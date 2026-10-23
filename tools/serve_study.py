#!/usr/bin/env python3
"""Launch Network Study at its fixed local address, from a checkout or a bundle."""

import argparse
from contextlib import contextmanager
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import signal
import socket
import sys
import threading
import webbrowser


ROOT = Path(__file__).resolve().parents[1]
ADDRESS = '127.0.0.1'
PORT = 4173
URL = f'http://{ADDRESS}:{PORT}/'


def asset_directory():
    if getattr(sys, 'frozen', False):
        return Path(sys._MEIPASS) / 'web'
    return ROOT / 'app/dist'


def build_info(directory):
    metadata = directory / 'build-info.json'
    if metadata.is_file():
        return json.loads(metadata.read_text(encoding='utf-8'))
    return {'app_version': json.loads((ROOT / 'app/package.json').read_text(encoding='utf-8'))['version']}


def emit(message, error=False):
    stream = sys.stderr if error else sys.stdout
    if stream is not None:
        print(message, file=stream, flush=True)


class StudyHandler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map,
                      '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
                      '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml',
                      '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf'}

    def log_message(self, *_):
        pass

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def list_directory(self, _):
        self.send_error(404, 'Not found')


class LocalHTTPServer(ThreadingHTTPServer):
    # Winsock's SO_REUSEADDR can admit two listeners on the same origin.
    allow_reuse_address = sys.platform != 'win32'
    # Mermaid loads many modules in parallel; the inherited backlog of five
    # can refuse connections on Windows before the accept loop catches up.
    request_queue_size = socket.SOMAXCONN


class StudyServer:
    def __init__(self, directory=None, port=PORT):
        self.directory = Path(directory) if directory is not None else asset_directory()
        for relative in ('index.html', 'content/catalogue.json'):
            if not (self.directory / relative).is_file():
                raise ValueError(f'Missing application asset: {relative}.\n'
                                 'From a checkout, build with: cd app && npm ci && npm run build\n'
                                 'For a download, extract the complete package again.')
        self.info = build_info(self.directory)
        try:
            self.http = LocalHTTPServer((ADDRESS, port), partial(StudyHandler, directory=str(self.directory)))
        except OSError as error:
            raise ValueError(f'Cannot use {URL}: {error}\n'
                             'Another copy or local preview may already be running. Stop it before launching again.\n'
                             'The address stays fixed to preserve your browser progress.') from error
        self.thread = threading.Thread(target=self.http.serve_forever, kwargs={'poll_interval': 0.1}, daemon=True)

    def start(self):
        self.thread.start()

    def close(self):
        if self.thread.is_alive():
            self.http.shutdown()
            self.thread.join(timeout=5)
        self.http.server_close()


@contextmanager
def browser_environment():
    """Do not pass bundled library search paths to the system browser/opener."""
    if not getattr(sys, 'frozen', False):
        yield
        return
    previous = {key: os.environ.get(key) for key in ('LD_LIBRARY_PATH', 'DYLD_LIBRARY_PATH', 'PATH')}
    bundle = Path(sys._MEIPASS).resolve()
    for key in ('LD_LIBRARY_PATH', 'DYLD_LIBRARY_PATH'):
        original = os.environ.get(key + '_ORIG')
        if original is None:
            os.environ.pop(key, None)
        else:
            os.environ[key] = original
    os.environ['PATH'] = os.pathsep.join(
        item for item in os.environ.get('PATH', '').split(os.pathsep)
        if item and not Path(item).resolve().is_relative_to(bundle)
    )
    if sys.platform == 'win32':
        import ctypes
        ctypes.windll.kernel32.SetDllDirectoryW(None)
    try:
        yield
    finally:
        for key, value in previous.items():
            if value is None:
                os.environ.pop(key, None)
            else:
                os.environ[key] = value
        if sys.platform == 'win32':
            ctypes.windll.kernel32.SetDllDirectoryW(str(bundle))


def open_browser(url=URL):
    with browser_environment():
        return webbrowser.open(url)


class LauncherWindow:
    """Small desktop lifecycle control; studying stays in the browser."""

    def __init__(self, server, auto_open=True):
        import tkinter as tk
        from tkinter import ttk
        self.server = server
        self.root = tk.Tk()
        self.root.title('Network Study')
        self.root.resizable(False, False)
        frame = ttk.Frame(self.root, padding=24)
        frame.grid()
        ttk.Label(frame, text='Network Study', font=('TkDefaultFont', 18, 'bold')).grid(sticky='w')
        ttk.Label(frame, text=f"Version {server.info['app_version']}").grid(sticky='w', pady=(4, 16))
        self.status = tk.StringVar(value='Running. Your study data is saved in your browser.')
        ttk.Label(frame, textvariable=self.status, wraplength=440).grid(sticky='w')
        address = ttk.Entry(frame, width=48)
        address.insert(0, URL)
        address.configure(state='readonly')
        address.grid(sticky='ew', pady=12)
        ttk.Button(frame, text='Open study app', command=self.open).grid(sticky='ew', pady=4)
        ttk.Button(frame, text='Licenses', command=lambda: self.open('LICENSES.txt'),
                   state='normal' if (server.directory / 'LICENSES.txt').is_file() else 'disabled').grid(sticky='ew', pady=4)
        ttk.Button(frame, text='Stop and quit', command=self.stop).grid(sticky='ew', pady=4)
        ttk.Label(frame, text='Keep this window open while studying.\nClosing a browser tab leaves the app running.').grid(sticky='w', pady=(12, 0))
        self.root.protocol('WM_DELETE_WINDOW', self.stop)
        if auto_open:
            self.root.after(150, self.open)

    def open(self, relative=''):
        try:
            opened = open_browser(URL + relative)
        except (OSError, RuntimeError):
            opened = False
        if not opened:
            self.status.set('Browser opening was unavailable. Copy the address above into your browser.')

    def stop(self):
        self.server.close()
        self.root.destroy()

    def run(self):
        self.root.mainloop()


def show_error(message, gui):
    emit(message, error=True)
    if gui:
        try:
            import tkinter as tk
            from tkinter import messagebox
            root = tk.Tk()
            root.withdraw()
            messagebox.showerror('Network Study could not start', message, parent=root)
            root.destroy()
        except Exception:
            if sys.platform == 'win32':
                import ctypes
                ctypes.windll.user32.MessageBoxW(None, message, 'Network Study could not start', 0x10)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument('--headless', action='store_true', help='Run without native controls (automation/terminal use)')
    mode.add_argument('--gui', action='store_true', help='Show native controls when running from source')
    mode.add_argument('--check-gui', action='store_true', help='Verify native controls and exit (packaging checks)')
    parser.add_argument('--no-browser', action='store_true', help='Do not open the browser automatically')
    parser.add_argument('--stop-file', type=Path, help='Headless only: stop cleanly when this file appears')
    args = parser.parse_args()
    if args.stop_file and not args.headless:
        parser.error('--stop-file requires --headless')
    gui = args.gui or args.check_gui or (getattr(sys, 'frozen', False) and not args.headless)
    server = None
    try:
        server = StudyServer()
        server.start()
        emit(f'Network Study: {URL}\nKeep this process running while studying. Press Ctrl+C to stop.')
        if gui:
            window = LauncherWindow(server, auto_open=not args.no_browser and not args.check_gui)
            if args.check_gui:
                window.root.after(350, window.stop)
            window.run()
        else:
            if not args.no_browser and not open_browser():
                emit(f'Open {URL} in your browser.')
            stopped = threading.Event()
            signal.signal(signal.SIGTERM, lambda *_: stopped.set())
            while not stopped.wait(0.2):
                if args.stop_file and args.stop_file.exists():
                    break
    except KeyboardInterrupt:
        pass
    except Exception as error:
        show_error(str(error), gui and not args.check_gui)
        return 1
    finally:
        if server is not None:
            server.close()
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
