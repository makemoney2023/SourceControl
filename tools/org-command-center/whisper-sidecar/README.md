# Whisper sidecar (local STT)

OpenAI-compatible `POST /v1/audio/transcriptions` on `http://127.0.0.1:8090`.

```bash
cd tools/org-command-center
npm run whisper:up
```

Uses `mlx-whisper` on Apple Silicon when available, else `openai-whisper`.
