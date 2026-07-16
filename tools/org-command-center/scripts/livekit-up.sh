#!/usr/bin/env bash
set -euo pipefail
if ! command -v livekit-server >/dev/null 2>&1; then
  echo "Install LiveKit: brew update && brew install livekit"
  exit 1
fi
echo "Starting livekit-server --dev on 127.0.0.1:7880 (API key=devkey secret=secret)"
exec livekit-server --dev --bind 127.0.0.1
