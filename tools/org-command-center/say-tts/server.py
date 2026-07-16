#!/usr/bin/env python3
"""OpenAI-compatible /v1/audio/speech using macOS `say` + afconvert → wav."""
from __future__ import annotations

import json
import os
import subprocess
import tempfile
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

PORT = int(os.environ.get("SAY_TTS_PORT", "3900"))
VOICE = os.environ.get("SAY_TTS_VOICE", "Samantha")


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt: str, *args) -> None:
        print(f"[say-tts] {self.address_string()} {fmt % args}")

    def _json(self, code: int, obj: object) -> None:
        raw = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def do_GET(self) -> None:  # noqa: N802
        path = urlparse(self.path).path
        if path in ("/health", "/v1/audio/voices"):
            self._json(200, {"ok": True, "voices": [VOICE], "data": [{"id": VOICE}]})
            return
        self._json(404, {"error": "not found"})

    def do_POST(self) -> None:  # noqa: N802
        path = urlparse(self.path).path
        if path != "/v1/audio/speech":
            self._json(404, {"error": "not found"})
            return
        length = int(self.headers.get("Content-Length", "0"))
        body = json.loads(self.rfile.read(length) or b"{}")
        text = (body.get("input") or "").strip()
        voice = body.get("voice") or VOICE
        if not text:
            self._json(400, {"error": "input required"})
            return
        with tempfile.TemporaryDirectory() as td:
            aiff = Path(td) / "out.aiff"
            wav = Path(td) / "out.wav"
            subprocess.run(
                ["say", "-v", voice, "-o", str(aiff), text],
                check=True,
                capture_output=True,
            )
            subprocess.run(
                ["afconvert", "-f", "WAVE", "-d", "LEI16", str(aiff), str(wav)],
                check=True,
                capture_output=True,
            )
            data = wav.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", "audio/wav")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


if __name__ == "__main__":
    print(f"say-tts listening on http://127.0.0.1:{PORT} voice={VOICE}")
    ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
