from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

PORT = 8000


class Server(ThreadingHTTPServer):
    request_queue_size = 512


class Handler(SimpleHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'

    def log_message(self, *args):
        pass


game = Path(__file__).resolve().parent / 'game'
print(f'Twinleaf Town: http://127.0.0.1:{PORT}/')
Server(('127.0.0.1', PORT), partial(Handler, directory=str(game))).serve_forever()
