#!/usr/bin/env python3
"""Collect four verified native candidates; optionally create an unpublished draft."""

import argparse
import json
import os
from pathlib import Path
import shutil
import subprocess

from package_study import read_json, sha256, write_json

TARGETS = {('windows', 'x64'), ('linux', 'x64'), ('macos', 'x64'), ('macos', 'arm64')}


def collect(packages, reports, output):
    records = [read_json(path) for path in packages.glob('network-study-*.json')]
    if len(records) != 4 or {(item['platform'], item['architecture']) for item in records} != TARGETS:
        raise ValueError('Expected exactly Windows x64, Linux x64, and both Mac candidates')
    identity = {(item['app_version'], item['commit'], item['content_version'], item['web_sha256']) for item in records}
    if len(identity) != 1 or any(item['dirty'] for item in records):
        raise ValueError('Candidate packages must share one clean source/content/version identity')
    checks = [read_json(path) for path in reports.glob('*.json')]
    verified = []
    for item in sorted(records, key=lambda row: row['asset']):
        if Path(item['asset']).name != item['asset']:
            raise ValueError('Asset name must be a filename')
        asset = packages / item['asset']
        if sha256(asset) != item['sha256']:
            raise ValueError(f'Download checksum mismatch: {asset.name}')
        matched = [report for report in checks if report.get('asset') == item['asset']]
        if len(matched) != 1:
            raise ValueError(f'Expected one package test report: {asset.name}')
        check = matched[0]
        if not all(check.get(key) == value for key, value in {
            'ok': True, 'browser_suite': True, 'native_gui': True, 'dirty': False,
            'commit': item['commit'], 'content_version': item['content_version'], 'asset_sha256': item['sha256'],
        }.items()):
            raise ValueError(f'Incomplete or mismatched package checks: {asset.name}')
        verified.append((asset, item, check))
    output.mkdir(parents=True, exist_ok=False)
    for asset, _, _ in verified:
        shutil.copy2(asset, output / asset.name)
    (output / 'SHA256SUMS.txt').write_text(''.join(f"{item['sha256']}  {asset.name}\n" for asset, item, _ in verified), encoding='utf-8')
    write_json(output / 'BUILD_INFO.json', {'packages': [item for _, item, _ in verified],
                                          'checks': [check for _, _, check in verified],
                                          'manual_desktop_acceptance': 'pending'})
    version, commit, content, _ = next(iter(identity))
    lines = ['Unpublished candidate. Desktop acceptance and distribution signing remain to verify.', '',
             '| Download | Platform | Signing |', '| --- | --- | --- |']
    lines.extend(f"| {asset.name} | {item['platform']} {item['architecture']} | {item['signing']} |" for asset, item, _ in verified)
    lines.extend(['', 'Download the asset for your computer; GitHub source archives are for development.',
                  'Extract Linux/macOS archives, then launch Network Study. Linux may require allowing the executable to run in your file manager.',
                  'Keep the launcher window open while studying; use Open study app to reopen the browser and Stop and quit to stop the server.',
                  'Study runs offline at http://127.0.0.1:4173/. Progress remains in that browser profile; export a backup before upgrading.',
                  'Windows candidates are unsigned; Mac candidates use ad-hoc signatures, without Developer ID/notarization.',
                  'Linux distribution/desktop compatibility is not established by Ubuntu CI alone. See DEPLOYMENT_PLAN.md for the validation matrix.',
                  'Explanation review and known question/source-format findings are unchanged.', '',
                  f'Source commit: {commit}', f'Catalogue content version: {content}',
                  'See BUILD_INFO.json for toolchain versions and automated package evidence.', ''])
    (output / 'RELEASE_NOTES.md').write_text('\n'.join(lines), encoding='utf-8')
    return version, commit


def create_draft(output, version, commit):
    tag = 'v' + version
    if os.environ.get('GITHUB_REF_TYPE') != 'tag' or os.environ.get('GITHUB_REF_NAME') != tag or os.environ.get('GITHUB_SHA') != commit:
        raise ValueError('Draft creation requires running on the matching version tag and tested commit')
    repository = os.environ.get('GITHUB_REPOSITORY')
    if not repository:
        raise ValueError('GITHUB_REPOSITORY is required for draft creation')
    assets = [str(path) for path in sorted(output.iterdir()) if path.name != 'RELEASE_NOTES.md']
    subprocess.run(['gh', 'release', 'create', tag, *assets, '--draft', '--verify-tag', '--repo', repository,
                    '--title', f'Network Study {version}', '--notes-file', str(output / 'RELEASE_NOTES.md')], check=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--packages', required=True, type=Path)
    parser.add_argument('--reports', required=True, type=Path)
    parser.add_argument('--output', required=True, type=Path)
    parser.add_argument('--create-draft', action='store_true', help='Create an unpublished draft on a matching existing Git tag')
    args = parser.parse_args()
    try:
        version, commit = collect(args.packages, args.reports, args.output)
        if args.create_draft:
            create_draft(args.output, version, commit)
        print(f'Candidate {version}: four packages verified; public publication has not occurred.')
    except (ValueError, OSError, KeyError, subprocess.SubprocessError) as error:
        parser.exit(1, f'Cannot assemble candidate: {error}\n')


if __name__ == '__main__':
    main()
