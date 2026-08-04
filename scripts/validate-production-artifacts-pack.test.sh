#!/usr/bin/env bash
# TDD gate for the production-artifacts org pack + seat wiring.
# Run: bash scripts/validate-production-artifacts-pack.test.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PACK="$ROOT/skills/org/packs/production-artifacts/SKILL.md"
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

# Pack must define Craft → Production → Wire and shippable phases
for phase in 9 11 12 14 15 17 19; do
  assert_grep "$PACK" "\\*\\*${phase}\\*\\*|\\| *${phase} *\\|" "pack matrix includes phase $phase"
done
assert_grep "$PACK" "Craft → Production → Wire|Craft -> Production -> Wire" "pack names three-layer model"
assert_grep "$PACK" "production_status" "pack defines production_status handoff field"
assert_grep "$PACK" "email/html" "pack leases HTML email path"

# COLLABORATION must cover Phase 17 production RACI
assert_grep "$ROOT/skills/org/COLLABORATION.md" "Phase 17" "COLLABORATION Phase 17 section"

# Shippable seats must load the pack
for seat in lifecycle-marketer tech-lead brand-designer video-producer paid-media-manager content-strategist web-designer cmo creative-director cto hardware-engineer; do
  assert_grep \
    "$ROOT/skills/org/positions/$seat/SKILL.md" \
    "skills/org/packs/production-artifacts" \
    "$seat binds production-artifacts pack"
done

assert_grep "$PACK" "design-system/<venture>" "pack locks design-system/<venture>"
assert_grep "$PACK" "11-brand/assets" "pack locks 11-brand/assets"
assert_grep "$PACK" "Figma ≠ Layer B|Figma != Layer B" "pack Figma export rule"
assert_grep "$PACK" "Verifier gate" "pack verifier gate"
assert_grep "$ROOT/skills/org/positions/brand-designer/SKILL.md" "11-brand/assets" "brand outputs 11-brand/assets"
assert_grep "$ROOT/skills/org/positions/web-designer/SKILL.md" "design-system/<venture>" "web outputs design-system/<venture>"
assert_grep "$ROOT/skills/org/positions/web-designer/SKILL.md" "fal-media" "web binds fal-media"
assert_grep "$ROOT/skills/org/positions/paid-media-manager/SKILL.md" "ad-creative" "paid generation_profile ad-creative"

# Lifecycle must also bind HTML email skill + production output path
assert_grep \
  "$ROOT/skills/org/positions/lifecycle-marketer/SKILL.md" \
  "inference-sh/email-design" \
  "lifecycle binds email-design"
assert_grep \
  "$ROOT/skills/org/positions/lifecycle-marketer/SKILL.md" \
  "17-channels/email/html" \
  "lifecycle outputs HTML lease"

# Tech-lead must lease app path
assert_grep \
  "$ROOT/skills/org/positions/tech-lead/SKILL.md" \
  "apps/" \
  "tech-lead outputs apps/ path"

# ORG scorecard mentions production for email
assert_grep \
  "$ROOT/skills/org/ORG-REGISTRY.md" \
  "HTML|production" \
  "ORG-REGISTRY production scorecard language"

# Handoff template carries production fields
assert_grep \
  "$ROOT/skills/org/HANDOFF-TEMPLATE.md" \
  "production_status" \
  "HANDOFF-TEMPLATE production_status"

if [[ "$fail" -ne 0 ]]; then
  echo "validate-production-artifacts-pack.test: FAILED" >&2
  exit 1
fi
echo "validate-production-artifacts-pack.test: OK"
