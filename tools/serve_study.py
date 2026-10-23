#!/usr/bin/env python3
"""Serve the built study app at its fixed local address and open a browser."""

import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import webbrowser


ROOT = Path(__file__).resolve().parents[1]
ADDRESS = '127.0.0.1'
PORT = 4173


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--no-browser', action='store_true', help='Print the address without opening a browser')
    args = parser.parse_args()
    directory = ROOT / 'app/dist'
    if not (directory / 'index.html').is_file():
        parser.exit(1, 'Build the app first: cd app && npm ci && npm run build\n')
    handler = partial(SimpleHTTPRequestHandler, directory=str(directory))
    try:
        server = ThreadingHTTPServer((ADDRESS, PORT), handler)
    except OSError as error:
        parser.exit(1, f'Cannot use http://{ADDRESS}:{PORT}: {error}\n'
                    'Stop another local preview before launching. Keep this address unchanged to retain browser progress.\n')
    url = f'http://{ADDRESS}:{PORT}/'
    print(f'Network Study: {url}\nKeep this process running while studying. Press Ctrl+C to stop.', flush=True)
    if not args.no_browser:
        webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == '__main__':
    main()
