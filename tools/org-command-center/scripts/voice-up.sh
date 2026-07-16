#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../../OmniVoice-Studio" && pwd)"
cd "$ROOT"
if [[ ! -d .venv ]]; then
  echo "Run: npm run voice:setup  (from tools/org-command-center)"
  exit 1
fi
# Prefer uv if available
if command -v uv >/dev/null 2>&1; then
  exec uv run python backend/main.py
fi
exec .venv/bin/python backend/main.py
