#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SIDE="$ROOT/whisper-sidecar"
cd "$SIDE"
if [[ ! -d .venv ]]; then
  python3 -m venv .venv
  # shellcheck disable=SC1091
  source .venv/bin/activate
  pip install -q fastapi uvicorn python-multipart
  # Prefer mlx-whisper on Apple Silicon; fall back to openai-whisper
  if ! pip install -q mlx-whisper 2>/dev/null; then
    pip install -q openai-whisper
  fi
else
  # shellcheck disable=SC1091
  source .venv/bin/activate
fi
echo "Whisper sidecar http://127.0.0.1:8090"
exec uvicorn app:app --host 127.0.0.1 --port 8090
