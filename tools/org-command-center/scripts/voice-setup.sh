#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../../OmniVoice-Studio" && pwd)"
cd "$ROOT"
if [[ ! -f backend/main.py ]]; then
  echo "OmniVoice-Studio missing at $ROOT"
  exit 1
fi
if command -v uv >/dev/null 2>&1; then
  uv sync
  echo "OmniVoice setup complete (uv). Start with: npm run voice:up"
  exit 0
fi
python3 -m venv .venv
.venv/bin/pip install -U pip
if [[ -f pyproject.toml ]]; then
  .venv/bin/pip install -e .
fi
echo "OmniVoice setup complete (venv). Start with: npm run voice:up"
