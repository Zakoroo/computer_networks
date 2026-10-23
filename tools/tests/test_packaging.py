"""Reject stale web builds, misleading identities, and damaged package downloads."""

import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import package_study as packaging
from assemble_study_release import collect, create_draft, TARGETS


class PackagingTests(unittest.TestCase):
    def test_prepared_web_rejects_changed_assets_and_mismatched_source(self):
        with tempfile.TemporaryDirectory() as temporary:
            directory = Path(temporary)
            (directory / 'content').mkdir()
            (directory / 'content/catalogue.json').write_text(json.dumps({'content_version': 'test-content'}))
            (directory / 'index.html').write_text('original')
            identity = {'app_version': '0.1.0', 'commit': 'a' * 40, 'dirty': False}
            with patch.object(packaging, 'source_info', return_value=identity.copy()), \
                    patch.object(packaging, 'npm_notices', return_value='License texts'):
                packaging.prepare_web(directory, False)
                self.assertEqual(packaging.verify_web(directory, False)['commit'], identity['commit'])
                (directory / 'index.html').write_text('changed')
                with self.assertRaisesRegex(ValueError, 'file inventory'):
                    packaging.verify_web(directory, False)
                (directory / 'index.html').write_text('original')
                with patch.object(packaging, 'source_info', return_value={**identity, 'commit': 'b' * 40}):
                    with self.assertRaisesRegex(ValueError, 'different source'):
                        packaging.verify_web(directory, False)

    def test_symlinks_cannot_pull_unrelated_files_into_web_payload(self):
        if sys.platform == 'win32':
            self.skipTest('Windows symlink creation may require privileges')
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            directory = root / 'web'
            directory.mkdir()
            secret = root / 'unrelated.txt'
            secret.write_text('not an app asset')
            (directory / 'link').symlink_to(secret)
            with self.assertRaisesRegex(ValueError, 'symlink'):
                packaging.web_files(directory)

    def test_target_comes_from_native_machine_and_rejects_unsupported_architecture(self):
        with patch.object(packaging.platform, 'system', return_value='Darwin'), \
                patch.object(packaging.platform, 'machine', return_value='arm64'):
            self.assertEqual(packaging.native_target(), ('macos', 'arm64'))
        with patch.object(packaging.platform, 'system', return_value='Linux'), \
                patch.object(packaging.platform, 'machine', return_value='aarch64'):
            with self.assertRaisesRegex(ValueError, 'Unsupported native'):
                packaging.native_target()

    def test_release_collection_requires_matching_successful_checks_for_every_download(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            packages, reports = root / 'packages', root / 'reports'
            packages.mkdir()
            reports.mkdir()
            for system, arch in TARGETS:
                name = f'network-study-0.1.0-{system}-{arch}'
                asset = packages / (name + '.download')
                asset.write_bytes(name.encode())
                metadata = {'asset': asset.name, 'sha256': packaging.sha256(asset), 'app_version': '0.1.0',
                            'commit': 'a' * 40, 'content_version': 'content', 'web_sha256': 'web', 'dirty': False,
                            'platform': system, 'architecture': arch, 'signing': 'unsigned'}
                packaging.write_json(packages / (name + '.json'), metadata)
                packaging.write_json(reports / (name + '.json'), {**metadata, 'asset_sha256': metadata['sha256'],
                                      'ok': True, 'browser_suite': True, 'native_gui': True})
            self.assertEqual(collect(packages, reports, root / 'valid')[0], '0.1.0')
            report = next(reports.glob('*.json'))
            changed = packaging.read_json(report)
            changed['asset_sha256'] = 'different-download'
            packaging.write_json(report, changed)
            with self.assertRaisesRegex(ValueError, 'mismatched package checks'):
                collect(packages, reports, root / 'invalid')
            self.assertFalse((root / 'invalid').exists())

    def test_draft_cannot_write_a_release_from_an_unmatched_branch_or_tag(self):
        with patch.dict('os.environ', {'GITHUB_REF_TYPE': 'branch', 'GITHUB_REF_NAME': 'main'}), \
                patch('subprocess.run') as run:
            with self.assertRaisesRegex(ValueError, 'matching version tag'):
                create_draft(Path('unused'), '0.1.0', 'a' * 40)
            run.assert_not_called()


if __name__ == '__main__':
    unittest.main()
