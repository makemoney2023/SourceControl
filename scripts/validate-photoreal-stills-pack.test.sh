#!/usr/bin/env bash
# TDD gate for photoreal-stills org pack + seat wiring.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PACK="$ROOT/skills/org/packs/photoreal-stills/SKILL.md"
fail=0

assert_file() {
  if [[ ! -f "$1" ]]; then
    echo "FAIL: missing $1" >&2
    fail=1
  fi
}

assert_grep() {
  local file="$1" pattern="$2" label="$3"
  if [[ ! -f "$file" ]]; then
    echo "FAIL: $label — file missing: $file" >&2
    fail=1
    return
  fi
  if ! grep -qE "$pattern" "$file"; then
    echo "FAIL: $label — /$pattern/ not in ${file#"$ROOT/"}" >&2
    fail=1
  fi
}

assert_file "$PACK"
assert_grep "$PACK" "Photoreal reject checklist|reject checklist" "pack has reject checklist"
assert_grep "$PACK" "FLUX\\.2|camera" "pack mentions FLUX/camera"
assert_grep "$PACK" "Dog / animal|multi-ref|multi-reference" "pack animal/identity guidance"
assert_grep "$PACK" "image-upscaling" "pack binds upscaling"
assert_grep "$PACK" "photoreal_qa" "pack handoff field photoreal_qa"

for seat in brand-designer web-designer paid-media-manager creative-director verifier; do
  assert_grep \
    "$ROOT/skills/org/positions/$seat/SKILL.md" \
    "skills/org/packs/photoreal-stills" \
    "$seat binds photoreal-stills"
done

assert_grep \
  "$ROOT/skills/org/positions/brand-designer/SKILL.md" \
  "image-upscaling" \
  "brand binds image-upscaling"

assert_grep \
  "$ROOT/skills/org/MODEL-REGISTRY.md" \
  "photoreal-stills" \
  "MODEL-REGISTRY references photoreal-stills"

assert_grep \
  "$ROOT/skills/org/packs/production-artifacts/SKILL.md" \
  "photoreal-stills" \
  "production-artifacts teaches photoreal-stills"

if [[ "$fail" -ne 0 ]]; then
  echo "validate-photoreal-stills-pack.test: FAILED" >&2
  exit 1
fi
echo "validate-photoreal-stills-pack.test: OK"
