"""OpenAI-compatible local Whisper transcription sidecar (port 8090)."""
from __future__ import annotations

import os
import tempfile
from pathlib import Path

from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse

app = FastAPI(title="OCC Whisper Sidecar")
MODEL = os.environ.get("WHISPER_MODEL", "base")
_backend = None
_model = None


def _load():
    global _backend, _model
    if _backend:
        return
    try:
        import mlx_whisper  # type: ignore

        _backend = "mlx"
        _model = mlx_whisper
    except Exception:
        import whisper  # type: ignore

        _backend = "openai-whisper"
        _model = whisper.load_model(MODEL)


@app.get("/health")
def health():
    return {"ok": True, "backend": _backend or "unloaded", "model": MODEL}


@app.post("/v1/audio/transcriptions")
async def transcribe(file: UploadFile = File(...)):
    _load()
    suffix = Path(file.filename or "audio.wav").suffix or ".wav"
    raw = await file.read()
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(raw)
        path = tmp.name
    try:
        if _backend == "mlx":
            # mlx_whisper.transcribe returns dict with "text"
            result = _model.transcribe(path, path_or_hf_repo=os.environ.get(
                "MLX_WHISPER_REPO", "mlx-community/whisper-base-mlx"
            ))
            text = (result.get("text") if isinstance(result, dict) else str(result)) or ""
        else:
            result = _model.transcribe(path)
            text = result.get("text", "") if isinstance(result, dict) else ""
        return {"text": text.strip()}
    except Exception as e:
        return JSONResponse({"error": str(e), "text": ""}, status_code=500)
    finally:
        try:
            os.unlink(path)
        except OSError:
            pass
