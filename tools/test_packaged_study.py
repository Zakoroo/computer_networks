#!/usr/bin/env python3
"""Extract and smoke-test a native candidate; optionally run the browser suite."""

import argparse
import json
import os
from pathlib import Path
import shutil
import socket
import subprocess
import sys
import tarfile
import tempfile
import time
from urllib.error import URLError
from urllib.request import urlopen
import zipfile

from package_study import native_target, read_json, sha256, write_json
from serve_study import ADDRESS, PORT, URL

ROOT = Path(__file__).resolve().parents[1]


def ensure_port_free():
    with socket.socket() as probe:
        if probe.connect_ex((ADDRESS, PORT)) == 0:
            raise ValueError(f'{URL} is occupied. Stop the existing app before testing; it will not be reused.')


def extract(asset, destination):
    if asset.name.endswith('.tar.gz'):
        with tarfile.open(asset) as archive:
            archive.extractall(destination, filter='data')
    elif asset.suffix == '.zip':
        if sys.platform == 'darwin':
            subprocess.run(['ditto', '-x', '-k', str(asset), str(destination)], check=True)
        else:
            with zipfile.ZipFile(asset) as archive:
                archive.extractall(destination)
    elif asset.suffix == '.exe':
        destination.mkdir(parents=True, exist_ok=True)
        shutil.copy2(asset, destination / 'network-study.exe')
    else:
        raise ValueError(f'Unknown package format: {asset.name}')
    names = ['Network Study.app/Contents/MacOS/network-study'] if sys.platform == 'darwin' else [
        'network-study.exe', 'network-study/network-study.exe', 'network-study', 'network-study/network-study']
    for name in names:
        path = destination / name
        if path.is_file():
            return path.resolve()
    raise ValueError('Extracted package has no expected launcher')


def wait_ready(process, timeout=45):
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        if process.poll() is not None:
            raise ValueError(f'Packaged server exited during startup ({process.returncode})')
        try:
            with urlopen(URL + 'build-info.json', timeout=1) as response:
                return json.load(response)
        except (URLError, TimeoutError, OSError):
            time.sleep(0.1)
    raise ValueError('Packaged server did not become ready')


def smoke(executable, metadata, work):
    ensure_port_free()
    empty = work / 'empty path'
    empty.mkdir()
    cwd = work / 'read only working directory'
    cwd.mkdir()
    if os.name != 'nt':
        cwd.chmod(0o555)
    stop = work / 'stop'
    env = {**os.environ, 'PATH': str(empty)}
    log = work / 'launcher.log'
    try:
        with log.open('wb') as stream:
            process = subprocess.Popen([str(executable), '--headless', '--no-browser', '--stop-file', str(stop)],
                                       cwd=cwd, env=env, stdout=stream, stderr=stream)
            try:
                running = wait_ready(process)
                for key in ('app_version', 'commit', 'content_version', 'web_sha256', 'platform', 'architecture', 'dirty'):
                    if running.get(key) != metadata.get(key):
                        raise ValueError(f'Running build differs from download metadata: {key}')
                system, arch = native_target()
                if (running['platform'], running['architecture']) != (system, arch):
                    raise ValueError('Candidate target differs from the test machine')
                with urlopen(URL + 'content/catalogue.json', timeout=10) as response:
                    catalogue = json.load(response)
                if catalogue['content_version'] != metadata['content_version']:
                    raise ValueError('Served catalogue is not the packaged content version')
                with urlopen(URL + 'web-files.json', timeout=10) as response:
                    inventory = json.load(response)
                # Validate every served asset, including lazy Mermaid chunks and fonts.
                import hashlib
                from urllib.parse import quote
                for relative, expected in inventory.items():
                    with urlopen(URL + quote(relative), timeout=10) as response:
                        digest = hashlib.sha256(response.read()).hexdigest()
                        if relative.endswith('.js') and response.headers.get_content_type() != 'text/javascript':
                            raise ValueError(f'JavaScript asset has an invalid MIME type: {relative}')
                    if digest != expected:
                        raise ValueError(f'Served file differs from the web build: {relative}')
                with urlopen(URL + 'LICENSES.txt', timeout=10) as response:
                    if hashlib.sha256(response.read()).hexdigest() != metadata['licenses_sha256']:
                        raise ValueError('Served runtime/dependency notices differ from package metadata')
                second = subprocess.run([str(executable), '--headless', '--no-browser'], cwd=cwd, env=env,
                                        capture_output=True, timeout=45)
                if second.returncode != 1 or process.poll() is not None:
                    raise ValueError('A second launcher did not refuse the occupied origin cleanly')
            finally:
                stop.touch()
                try:
                    process.wait(timeout=15)
                except subprocess.TimeoutExpired:
                    process.kill()
                    process.wait()
                    raise ValueError('Packaged launcher did not stop cleanly')
            if process.returncode != 0:
                raise ValueError(f'Launcher failed: {log.read_text(errors="replace")}')
        ensure_port_free()
        # Start the same download again, proving shutdown released the port.
        stop.unlink()
        with log.open('ab') as stream:
            process = subprocess.Popen([str(executable), '--headless', '--no-browser', '--stop-file', str(stop)],
                                       cwd=cwd, env=env, stdout=stream, stderr=stream)
            try:
                wait_ready(process)
            finally:
                stop.touch()
                try:
                    process.wait(timeout=15)
                except subprocess.TimeoutExpired:
                    process.kill()
                    process.wait()
                    raise ValueError('Relaunched candidate did not stop cleanly')
            if process.returncode != 0:
                raise ValueError('Relaunched candidate exited unsuccessfully')
        ensure_port_free()
        return len(inventory)
    finally:
        cwd.chmod(0o755)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--asset', required=True, type=Path)
    parser.add_argument('--metadata', required=True, type=Path)
    parser.add_argument('--report', type=Path)
    parser.add_argument('--browser', action='store_true', help='Run the existing Playwright suite against the extracted executable')
    parser.add_argument('--gui', action='store_true', help='Verify bundled Tk/native controls (requires a display)')
    args = parser.parse_args()
    report = {'asset': args.asset.name, 'ok': False, 'desktop_acceptance': 'not performed'}
    try:
        metadata = read_json(args.metadata)
        if metadata['asset'] != args.asset.name or metadata['sha256'] != sha256(args.asset):
            raise ValueError('Download checksum/name differs from its build metadata')
        with tempfile.TemporaryDirectory(prefix='network study package ') as temporary:
            work = Path(temporary)
            executable = extract(args.asset.resolve(), work / 'download')
            report['served_files_checked'] = smoke(executable, metadata, work)
            if args.gui:
                subprocess.run([str(executable), '--check-gui', '--no-browser'], cwd=work, check=True, timeout=45)
                ensure_port_free()
            if args.browser:
                env = {**os.environ, 'NETWORK_STUDY_EXECUTABLE': str(executable),
                       'NETWORK_STUDY_CATALOGUE': str((ROOT / 'app/dist/content/catalogue.json').resolve()),
                       'NETWORK_STUDY_CONTENT_VERSION': metadata['content_version']}
                npm = shutil.which('npm')
                if not npm:
                    raise ValueError('Browser test tooling needs Node/npm on the test machine')
                subprocess.run([npm, 'run', 'test:browser', '--', '--workers=2'], cwd=ROOT / 'app', env=env, check=True)
                ensure_port_free()
        report.update(ok=True, commit=metadata['commit'], content_version=metadata['content_version'],
                      asset_sha256=metadata['sha256'],
                      platform=metadata['platform'], architecture=metadata['architecture'],
                      browser_suite=args.browser, native_gui=args.gui, dirty=metadata['dirty'])
        print(json.dumps(report, indent=2))
    except (ValueError, OSError, KeyError, subprocess.SubprocessError) as error:
        report['error'] = str(error)
        print(f'Package check failed: {error}', file=sys.stderr)
    finally:
        if args.report:
            args.report.parent.mkdir(parents=True, exist_ok=True)
            write_json(args.report, report)
    return 0 if report['ok'] else 1


if __name__ == '__main__':
    raise SystemExit(main())
