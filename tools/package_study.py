#!/usr/bin/env python3
"""Prepare shared web assets or build a native Network Study candidate package."""

import argparse
from datetime import datetime, timezone
import hashlib
import importlib.metadata
import json
import os
from pathlib import Path
import platform
import re
import shutil
import subprocess
import sys
import sysconfig
import tarfile
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]
INVENTORY = 'web-files.json'
INFO = 'build-info.json'


def read_json(path):
    return json.loads(path.read_text(encoding='utf-8'))


def write_json(path, value):
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')


def sha256(path):
    digest = hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b''):
            digest.update(chunk)
    return digest.hexdigest()


def source_info(allow_dirty=False):
    version = read_json(ROOT / 'app/package.json')['version']
    if not re.fullmatch(r'\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?', version):
        raise ValueError('Application version is not a supported release version')
    if read_json(ROOT / 'app/package-lock.json')['version'] != version:
        raise ValueError('package.json and package-lock.json versions differ')
    commit = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip()
    dirty = bool(subprocess.check_output(['git', 'status', '--porcelain'], cwd=ROOT, text=True).strip())
    if dirty and not allow_dirty:
        raise ValueError('Commit the source before packaging, or use --allow-dirty for a local prototype.')
    return {'app_version': version, 'commit': commit, 'dirty': dirty}


def web_files(directory):
    files = {}
    for path in sorted(directory.rglob('*')):
        if path.is_symlink():
            raise ValueError(f'Web input contains a symlink: {path}')
        relative = path.relative_to(directory).as_posix()
        if path.is_file() and relative not in (INVENTORY, INFO):
            files[relative] = sha256(path)
    return files


def npm_notices():
    """Retain installed dependency license texts, including local font notices."""
    parts = ['Network Study third-party notices\n\nDependency versions are recorded in package-lock.json.\n']
    for relative, metadata in read_json(ROOT / 'app/package-lock.json')['packages'].items():
        if not relative:
            continue
        directory = ROOT / 'app' / relative
        package = directory / 'package.json'
        if not package.is_file():
            if metadata.get('optional'):
                continue
            raise ValueError('Install locked web dependencies with npm ci before preparing assets')
        parts.append(f"\n{'=' * 60}\n{relative} {metadata.get('version', '')}\nLicense: {metadata.get('license', 'See package notices')}\n")
        # A few packages keep font or vendored notices one level below their root.
        for path in sorted(directory.rglob('*')):
            local = path.relative_to(directory)
            if 'node_modules' in local.parts or len(local.parts) > 3 or not path.is_file():
                continue
            if re.match(r'(?i)^(license|licence|copying|notice|ofl)([._-].*)?$', path.name):
                parts.append(f'\n{local.as_posix()}\n{path.read_text(encoding="utf-8", errors="replace")}\n')
    return ''.join(parts)


def prepare_web(directory, allow_dirty):
    info = source_info(allow_dirty)
    if not (directory / 'index.html').is_file():
        raise ValueError('Build the app first: cd app && npm ci && npm run build')
    catalogue = read_json(directory / 'content/catalogue.json')
    (directory / 'THIRD_PARTY_NOTICES.txt').write_text(npm_notices(), encoding='utf-8')
    inventory = web_files(directory)
    info.update(schema_version=1, content_version=catalogue['content_version'],
                web_sha256=hashlib.sha256(json.dumps(inventory, sort_keys=True).encode()).hexdigest())
    write_json(directory / INVENTORY, inventory)
    write_json(directory / INFO, info)
    print(f"Prepared web assets: {info['app_version']} / {info['content_version']}")
    return info


def verify_web(directory, allow_dirty):
    info = read_json(directory / INFO)
    current = source_info(allow_dirty)
    if any(info.get(key) != value for key, value in current.items()):
        raise ValueError('Web assets belong to a different source commit/version/dirty state; prepare them again')
    inventory = read_json(directory / INVENTORY)
    if inventory != web_files(directory):
        raise ValueError('Web assets differ from their prepared file inventory')
    digest = hashlib.sha256(json.dumps(inventory, sort_keys=True).encode()).hexdigest()
    if info['web_sha256'] != digest or info['content_version'] != read_json(directory / 'content/catalogue.json')['content_version']:
        raise ValueError('Prepared web metadata does not match its catalogue/inventory')
    return info


def native_target():
    system = {'Windows': 'windows', 'Darwin': 'macos', 'Linux': 'linux'}.get(platform.system())
    arch = {'x86_64': 'x64', 'AMD64': 'x64', 'aarch64': 'arm64', 'arm64': 'arm64'}.get(platform.machine())
    if not system or not arch or (arch != 'x64' and system != 'macos'):
        raise ValueError(f'Unsupported native build target: {platform.system()} {platform.machine()}')
    return system, arch


def runtime_notices():
    parts = []
    candidates = [Path(sysconfig.get_path('stdlib')) / 'LICENSE.txt',
                  Path(sys.base_prefix) / 'LICENSE.txt', Path(sys.base_prefix) / 'LICENSE']
    for path in candidates:
        if path.is_file():
            parts.append('Python runtime license\n' + path.read_text(encoding='utf-8', errors='replace'))
            break
    if not parts:
        raise ValueError('Cannot locate the Python runtime license')
    import tkinter
    library = Path(tkinter.Tcl().eval('info library'))
    for directory in [library, *library.parent.glob('tk*')]:
        for path in directory.glob('*'):
            if path.is_file() and re.match(r'(?i)^(license|licence|copying|notice|copyright)', path.name):
                parts.append(f'{directory.name}/{path.name}\n' + path.read_text(encoding='utf-8', errors='replace'))
    for entry in importlib.metadata.distribution('pyinstaller').files or []:
        if 'copying' in entry.name.lower() or 'license' in entry.name.lower():
            path = Path(importlib.metadata.distribution('pyinstaller').locate_file(entry))
            if path.is_file():
                parts.append(f'PyInstaller {entry.name}\n' + path.read_text(encoding='utf-8', errors='replace'))
    return '\n\n'.join(parts)


def package(directory, output, mode, allow_dirty):
    import PyInstaller
    info = verify_web(directory, allow_dirty)
    system, arch = native_target()
    folder = mode == 'onedir' or system == 'macos'
    info.update(platform=system, architecture=arch, bundle_mode='onedir' if folder else 'onefile',
                python_version=platform.python_version(), pyinstaller_version=PyInstaller.__version__,
                build_host=platform.platform(), built_at=datetime.now(timezone.utc).isoformat(),
                signing='ad-hoc' if system == 'macos' else 'unsigned',
                runner_image=os.environ.get('ImageOS'), runner_image_version=os.environ.get('ImageVersion'))
    stem = f"network-study-{info['app_version']}-{system}-{arch}" + ('-onedir' if mode == 'onedir' else '')
    extension = '.zip' if system == 'macos' or (system == 'windows' and folder) else '.exe' if system == 'windows' else '.tar.gz'
    output.mkdir(parents=True, exist_ok=True)
    artifact = output / (stem + extension)
    if artifact.exists():
        raise ValueError(f'Refusing to replace {artifact}; choose another output directory/version')
    work_root = ROOT / 'build/packaging'
    work_root.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix=system + '-', dir=work_root) as temporary:
        work = Path(temporary)
        staged = work / 'web'
        shutil.copytree(directory, staged)
        (staged / 'LICENSES.txt').write_text((staged / 'THIRD_PARTY_NOTICES.txt').read_text(encoding='utf-8')
                                            + '\n\n' + runtime_notices(), encoding='utf-8')
        info['licenses_sha256'] = sha256(staged / 'LICENSES.txt')
        write_json(staged / INFO, info)
        env = {**os.environ, 'PYINSTALLER_CONFIG_DIR': str(work / 'cache'), 'NETWORK_STUDY_WEB_DIR': str(staged),
               'NETWORK_STUDY_BUNDLE_MODE': info['bundle_mode'], 'NETWORK_STUDY_VERSION': info['app_version']}
        subprocess.run([sys.executable, '-m', 'PyInstaller', '--noconfirm', '--clean',
                        '--distpath', str(work / 'dist'), '--workpath', str(work / 'build'),
                        str(ROOT / 'packaging/network_study.spec')], env=env, cwd=ROOT, check=True)
        native = work / 'dist/network-study'
        if system == 'macos':
            subprocess.run(['ditto', '-c', '-k', '--sequesterRsrc', '--keepParent',
                            str(work / 'dist/Network Study.app'), str(artifact)], check=True)
        elif system == 'windows':
            if folder:
                with zipfile.ZipFile(artifact, 'w', zipfile.ZIP_DEFLATED) as archive:
                    for path in sorted(native.rglob('*')):
                        if path.is_file():
                            archive.write(path, Path('network-study') / path.relative_to(native))
            else:
                shutil.copy2(native.with_suffix('.exe'), artifact)
        else:
            with tarfile.open(artifact, 'w:gz') as archive:
                archive.add(native, arcname='network-study')
    info['asset'] = artifact.name
    info['sha256'] = sha256(artifact)
    write_json(output / (stem + '.json'), info)
    (output / (stem + '.sha256')).write_text(f"{info['sha256']}  {artifact.name}\n", encoding='utf-8')
    print(json.dumps({'artifact': str(artifact), 'metadata': str(output / (stem + '.json'))}))
    return artifact


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--prepare-web', action='store_true', help='Inventory a fresh production build and collect dependency notices')
    parser.add_argument('--web-dir', type=Path, default=ROOT / 'app/dist')
    parser.add_argument('--output-dir', type=Path, default=ROOT / 'dist/packages')
    parser.add_argument('--mode', choices=['onedir', 'release'], default='release')
    parser.add_argument('--allow-dirty', action='store_true', help='Mark a local prototype as built from uncommitted work')
    args = parser.parse_args()
    try:
        if args.prepare_web:
            prepare_web(args.web_dir.resolve(), args.allow_dirty)
        else:
            package(args.web_dir.resolve(), args.output_dir.resolve(), args.mode, args.allow_dirty)
    except (ValueError, OSError, KeyError, ImportError, subprocess.CalledProcessError) as error:
        parser.exit(1, f'Cannot package Network Study: {error}\n')


if __name__ == '__main__':
    main()
