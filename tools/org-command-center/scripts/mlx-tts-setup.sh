#!/usr/bin/env bash
# Install local mlx-audio[server] + Kokoro deps into mlx-tts/.venv
# Prefer Python 3.11 — misaki[en]/spaCy does not build on 3.14.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VENV="$ROOT/mlx-tts/.venv"

PY=""
for c in python3.11 python3.12 python3.13 python3; do
  if command -v "$c" >/dev/null 2>&1; then
    ver="$("$c" -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')"
    if [[ "$ver" != "3.14" ]]; then
      PY="$c"
      break
    fi
  fi
done
if [[ -z "$PY" ]]; then
  echo "Need Python 3.11–3.13 (not 3.14) for Kokoro/spaCy. brew install python@3.11"
  exit 1
fi

mkdir -p "$ROOT/mlx-tts"
if [[ ! -d "$VENV" ]]; then
  "$PY" -m venv "$VENV"
fi
# shellcheck disable=SC1091
source "$VENV/bin/activate"
pip install -U pip
pip install "mlx-audio[server,tts]" "misaki[en]" num2words
echo "mlx-tts ready: $VENV (python=$PY)"
echo "Next: npm run mlx-tts:up"
