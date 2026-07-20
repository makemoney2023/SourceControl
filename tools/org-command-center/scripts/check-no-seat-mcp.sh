#!/usr/bin/env bash
# Fail if a per-seat MCP server directory appears under skills/org/positions.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
POSITIONS="$ROOT/skills/org/positions"
if [[ ! -d "$POSITIONS" ]]; then
  echo "check-no-seat-mcp: positions dir missing (ok)"
  exit 0
fi
hits="$(find "$POSITIONS" -type d \( -name 'mcp-server' -o -name 'mcp' \) 2>/dev/null || true)"
if [[ -n "$hits" ]]; then
  echo "Forbidden per-seat MCP directories (see MCP posture spec):" >&2
  echo "$hits" >&2
  exit 1
fi
echo "check-no-seat-mcp: ok"
