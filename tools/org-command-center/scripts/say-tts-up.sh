#!/usr/bin/env bash
# Minimal OpenAI-compatible TTS using macOS `say` (free local fallback when OmniVoice is down).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
exec python3 "$ROOT/say-tts/server.py"
