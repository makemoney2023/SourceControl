#!/usr/bin/env bash
# Validate that Skill pack paths listed in org position SKILL.md tables exist.
# Exit 1 on any missing path. Used by sync-org-agents.sh and CI.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
POSITIONS="$ROOT/skills/org/positions"
fail=0
checked=0

if [[ ! -d "$POSITIONS" ]]; then
  echo "error: missing $POSITIONS" >&2
  exit 1
fi

# Extract backtick paths that look like skills/... from Skill packs tables.
while IFS= read -r -d '' skill_file; do
  while IFS= read -r path; do
    [[ -z "$path" ]] && continue
    # Normalize trailing slash
    path="${path%/}"
    abs="$ROOT/$path"
    checked=$((checked + 1))
    if [[ -d "$abs" ]]; then
      if [[ ! -f "$abs/SKILL.md" && ! -f "$abs/AGENTS.md" && ! -f "$abs/README.md" ]]; then
        # Allow pack dirs that are skill roots without SKILL.md (rare) if any file exists
        if [[ -z "$(ls -A "$abs" 2>/dev/null || true)" ]]; then
          echo "MISSING (empty dir): $path  (from ${skill_file#"$ROOT/"})" >&2
          fail=1
        fi
      fi
    elif [[ -f "$abs" ]]; then
      :
    elif [[ -f "$abs.md" ]]; then
      :
    else
      echo "MISSING: $path  (from ${skill_file#"$ROOT/"})" >&2
      fail=1
    fi
  done < <(
    # Lines in markdown tables: | `skills/...` | ...
    grep -oE '`skills/[^`]+`' "$skill_file" | tr -d '`' || true
  )
done < <(find "$POSITIONS" -name 'SKILL.md' -print0)

echo "Checked $checked pack path reference(s) across org positions."
if [[ "$fail" -ne 0 ]]; then
  echo "validate-skill-pack-paths: FAILED" >&2
  exit 1
fi
echo "validate-skill-pack-paths: OK"
