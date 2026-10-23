"""Launcher asset, lifecycle, and frozen-browser integration checks."""

import importlib.util
from concurrent.futures import ThreadPoolExecutor
from contextlib import ExitStack
from http.client import HTTPResponse
import os
from pathlib import Path
import socket
import sys
import tempfile
import unittest
from unittest.mock import patch
from urllib.error import HTTPError
from urllib.request import urlopen

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import serve_study as launcher


class LauncherTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory(prefix='study launcher ')
        self.addCleanup(self.temporary.cleanup)
        self.directory = Path(self.temporary.name)
        (self.directory / 'content').mkdir()
        (self.directory / 'index.html').write_text('study', encoding='utf-8')
        (self.directory / 'content/catalogue.json').write_text('{}', encoding='utf-8')
        (self.directory / 'app.js').write_text('export {};', encoding='utf-8')

    def test_bundle_assets_do_not_depend_on_the_checkout_or_working_directory(self):
        with patch.object(sys, 'frozen', True, create=True), patch.object(sys, '_MEIPASS', str(self.directory), create=True):
            self.assertEqual(launcher.asset_directory(), self.directory / 'web')
        self.assertEqual(launcher.asset_directory(), launcher.ROOT / 'app/dist')

    def test_missing_assets_fail_before_binding(self):
        (self.directory / 'content/catalogue.json').unlink()
        with self.assertRaisesRegex(ValueError, 'catalogue.json'):
            launcher.StudyServer(self.directory, port=0)

    def test_server_is_local_static_uncached_and_releases_port(self):
        server = launcher.StudyServer(self.directory, port=0)
        port = server.http.server_port
        self.addCleanup(server.close)
        server.start()
        url = f'http://127.0.0.1:{port}/'
        with urlopen(url) as response:
            self.assertEqual(response.read(), b'study')
            self.assertEqual(response.headers['Cache-Control'], 'no-store')
        with urlopen(url + 'app.js') as response:
            self.assertEqual(response.headers['Content-Type'], 'text/javascript')
        with self.assertRaises(HTTPError) as error:
            urlopen(url + 'content/')
        self.assertEqual(error.exception.code, 404)
        with self.assertRaisesRegex(ValueError, 'address stays fixed'):
            launcher.StudyServer(self.directory, port=port)
        server.close()
        self.assertFalse(server.thread.is_alive())
        replacement = launcher.StudyServer(self.directory, port=port)
        replacement.close()

    def test_pending_asset_connections_survive_a_module_load_burst(self):
        server = launcher.StudyServer(self.directory, port=0)
        self.addCleanup(server.close)
        with ExitStack() as clients:
            # Queue a browser-sized burst before the accept loop can run.
            # A small backlog rejects/times out connections even on loopback.
            connections = [clients.enter_context(socket.create_connection(server.http.server_address, timeout=2))
                           for _ in range(24)]
            server.start()

            def fetch_asset(client):
                client.sendall(b'GET /app.js HTTP/1.0\r\nHost: 127.0.0.1\r\n\r\n')
                with HTTPResponse(client) as response:
                    response.begin()
                    return response.status, response.headers['Content-Type'], response.read()

            with ThreadPoolExecutor(max_workers=len(connections)) as pool:
                self.assertEqual(list(pool.map(fetch_asset, connections)),
                                 [(200, 'text/javascript', b'export {};')] * len(connections))

    @unittest.skipIf(sys.platform == 'win32', 'Windows uses SetDllDirectoryW; covered by native candidate checks')
    def test_external_browser_environment_is_restored_even_after_failure(self):
        expected = {'LD_LIBRARY_PATH': 'original', 'LD_LIBRARY_PATH_ORIG': 'original',
                    'DYLD_LIBRARY_PATH': 'bundled', 'PATH': os.pathsep.join([str(self.directory), '/usr/bin'])}
        with patch.dict(os.environ, expected), patch.object(sys, 'frozen', True, create=True), \
                patch.object(sys, '_MEIPASS', str(self.directory), create=True):
            with self.assertRaisesRegex(RuntimeError, 'failure'):
                with launcher.browser_environment():
                    self.assertEqual(os.environ['LD_LIBRARY_PATH'], 'original')
                    self.assertNotIn('DYLD_LIBRARY_PATH', os.environ)
                    self.assertEqual(os.environ['PATH'], '/usr/bin')
                    raise RuntimeError('failure')
            self.assertEqual(os.environ['DYLD_LIBRARY_PATH'], 'bundled')
            self.assertEqual(os.environ['PATH'], expected['PATH'])

    @unittest.skipUnless(importlib.util.find_spec('tkinter') and (sys.platform in ('darwin', 'win32') or os.environ.get('DISPLAY')),
                         'Tkinter and a desktop display are required')
    def test_native_open_button_and_window_close_stop_the_owned_server(self):
        server = launcher.StudyServer(self.directory, port=0)
        self.addCleanup(server.close)
        server.start()
        with patch.object(launcher, 'open_browser', return_value=False) as browser:
            window = launcher.LauncherWindow(server, auto_open=False)
            window.root.after(30, window.open)
            window.root.after(60, window.stop)
            window.run()
            browser.assert_called_once_with(launcher.URL)
        self.assertFalse(server.thread.is_alive())


if __name__ == '__main__':
    unittest.main()
