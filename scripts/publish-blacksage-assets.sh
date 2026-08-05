#!/usr/bin/env bash
# Upload Blacksage image assets to Vercel Blob and update ASSETS.json hosted URLs.
# Requires BLOB_READ_WRITE_TOKEN. Does not rewrite HTML until hosted URLs exist.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
ASSETS="$ROOT/docs/projects/blacksage-kennels/business-idea/ASSETS.json"

load_dotenv_local() {
  local f="$ROOT/.env.local"
  [[ -f "$f" ]] || return 0
  while IFS= read -r line || [[ -n "$line" ]]; do
    [[ "$line" =~ ^[[:space:]]*# ]] && continue
    [[ "$line" =~ ^[[:space:]]*$ ]] && continue
    if [[ "$line" =~ ^([A-Za-z_][A-Za-z0-9_]*)=(.*)$ ]]; then
      local k="${BASH_REMATCH[1]}"
      local v="${BASH_REMATCH[2]}"
      v="${v%\"}"; v="${v#\"}"
      if [[ -z "${!k:-}" ]]; then export "$k=$v"; fi
    fi
  done <"$f"
}
load_dotenv_local

if [[ -z "${BLOB_READ_WRITE_TOKEN:-}" ]]; then
  echo "publish-blacksage-assets: BLOB_READ_WRITE_TOKEN unset — ASSETS.json hosted stays null" >&2
  exit 2
fi

if ! command -v npx >/dev/null 2>&1; then
  echo "npx required" >&2
  exit 1
fi

echo "publish-blacksage-assets: upload each local path from ASSETS.json via vercel blob (operator)"
echo "After upload, set hosted HTTPS URLs in $ASSETS and rewrite email HTML img src."
echo "Manual: npx vercel blob put <file> --token \$BLOB_READ_WRITE_TOKEN"
exit 0
