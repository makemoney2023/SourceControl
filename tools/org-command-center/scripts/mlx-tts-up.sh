#!/usr/bin/env bash
# Kokoro TTS via mlx-audio OpenAI-compatible API on :3900
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VENV="$ROOT/mlx-tts/.venv"
HOST="${MLX_TTS_HOST:-127.0.0.1}"
PORT="${MLX_TTS_PORT:-3900}"
MODEL="${OMNIVOICE_MODEL:-mlx-community/Kokoro-82M-bf16}"
VOICE="${OMNIVOICE_VOICE:-am_adam}"
PRELOAD_OUT="/tmp/kokoro-warm.wav"
PORT_WAIT_SECS=60

if [[ ! -x "$VENV/bin/python" ]]; then
  echo "Run: npm run mlx-tts:setup"
  exit 1
fi

if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port $PORT already in use — stop say-tts / previous TTS first (lsof -iTCP:$PORT)"
  exit 1
fi

echo "mlx-tts (Kokoro) http://$HOST:$PORT model=$MODEL voice=$VOICE"

# Start server in background; wait at end keeps npm script in foreground
"$VENV/bin/python" -m mlx_audio.server --host "$HOST" --port "$PORT" &
SERVER_PID=$!

cleanup() {
  kill "$SERVER_PID" 2>/dev/null || true
  wait "$SERVER_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

elapsed=0
while ! lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; do
  if ! kill -0 "$SERVER_PID" 2>/dev/null; then
    echo "mlx-audio server exited before binding port $PORT"
    exit 1
  fi
  if (( elapsed >= PORT_WAIT_SECS )); then
    echo "Timed out waiting for mlx-tts on port $PORT (${PORT_WAIT_SECS}s)"
    exit 1
  fi
  sleep 1
  elapsed=$((elapsed + 1))
done

echo "Port $PORT listening — preloading Kokoro model…"

preload_payload=$(printf '{"model":"%s","voice":"%s","input":"Ready","response_format":"wav","speed":0.9}' "$MODEL" "$VOICE")
if ! curl -sfS -m 120 -o "$PRELOAD_OUT" \
  -H "Content-Type: application/json" \
  -d "$preload_payload" \
  "http://$HOST:$PORT/v1/audio/speech"; then
  echo "WARN: Kokoro preload curl failed — first Talk turn may be cold (server still running)"
else
  echo "Kokoro preloaded → $PRELOAD_OUT"
fi

wait "$SERVER_PID"
