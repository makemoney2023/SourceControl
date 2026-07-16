#!/usr/bin/env bash
# Kokoro TTS via mlx-audio OpenAI-compatible API on :3900
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VENV="$ROOT/mlx-tts/.venv"
HOST="${MLX_TTS_HOST:-127.0.0.1}"
PORT="${MLX_TTS_PORT:-3900}"
MODEL="${OMNIVOICE_MODEL:-mlx-community/Kokoro-82M-bf16}"

if [[ ! -x "$VENV/bin/python" ]]; then
  echo "Run: npm run mlx-tts:setup"
  exit 1
fi

if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port $PORT already in use — stop say-tts / previous TTS first (lsof -iTCP:$PORT)"
  exit 1
fi

echo "mlx-tts (Kokoro) http://$HOST:$PORT model=$MODEL voice=${OMNIVOICE_VOICE:-am_adam}"
# Preload model so first Talk turn is not cold
exec "$VENV/bin/python" -m mlx_audio.server --host "$HOST" --port "$PORT"
