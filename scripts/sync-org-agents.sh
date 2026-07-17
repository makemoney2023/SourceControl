#!/usr/bin/env bash
# Sync templates/org/agents → .cursor/agents (Cursor loads model: from here).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/templates/org/agents"
DEST="$ROOT/.cursor/agents"

if [[ ! -d "$SRC" ]]; then
  echo "error: missing $SRC" >&2
  exit 1
fi

mkdir -p "$DEST"
count=0
for f in "$SRC"/*.md; do
  [[ -f "$f" ]] || continue
  base="$(basename "$f")"
  cp "$f" "$DEST/$base"
  count=$((count + 1))
done

echo "Synced $count agent(s) → $DEST"
echo "Note: Cursor honors model: on .cursor/agents/*.md (Grok 4.5 for frontier-reasoning; Composer 2.5 otherwise)."
echo "If the IDE strips YAML frontmatter, re-run this script or edit externally."

# Smoke: ceo-strategist must pin grok-4-5
if [[ -f "$DEST/ceo-strategist.md" ]]; then
  if ! grep -q '^model: grok-4-5' "$DEST/ceo-strategist.md"; then
    echo "warning: ceo-strategist.md missing expected grok-4-5 model pin" >&2
    head -n 12 "$DEST/ceo-strategist.md" >&2
    exit 1
  fi
  echo "OK: ceo-strategist model pin present"
fi
