#!/usr/bin/env bash
# TDD gate for the verifier seat + blocking org wiring.
# Run: bash scripts/validate-verifier-seat.test.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
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

SKILL="$ROOT/skills/org/positions/verifier/SKILL.md"
assert_file "$SKILL"
assert_grep "$SKILL" "skills/org/packs/production-artifacts" "verifier binds production-artifacts"
assert_grep "$SKILL" "verification-before-completion" "verifier binds verification-before-completion"
assert_grep "$SKILL" "verdict: pass" "verifier Done/output uses verdict pass"
assert_grep "$SKILL" "reports to|Reports to" "verifier reports to"
assert_grep "$SKILL" "\`cto\`" "verifier reports to cto"

assert_grep "$ROOT/skills/org/ORG-REGISTRY.md" "\\| verifier \\|" "ORG-REGISTRY roster has verifier"
assert_grep "$ROOT/skills/org/ORG-REGISTRY.md" "Verifier pass" "ORG-REGISTRY scorecard Verifier pass"
assert_grep "$ROOT/skills/org/MODEL-REGISTRY.md" "\\| verifier \\|" "MODEL-REGISTRY has verifier"
assert_grep "$ROOT/skills/org/positions/cto/SKILL.md" "verifier" "cto delegates verifier"
assert_grep "$ROOT/skills/org/orchestrator/SKILL.md" "verifier" "orchestrator verifier step"
assert_grep "$ROOT/skills/org/orchestrator/SKILL.md" "verdict: fail|verdict: pass" "orchestrator blocking language"
assert_grep "$ROOT/skills/org/CSUITE-REVIEW-TEMPLATE.md" "Verifier pass" "CSUITE scorecard Verifier pass"
assert_grep "$ROOT/skills/org/HANDOFF-TEMPLATE.md" "Verifier handoff|position: verifier" "HANDOFF-TEMPLATE verifier section"
assert_grep "$ROOT/skills/org/COLLABORATION.md" "verifier" "COLLABORATION mentions verifier"
assert_grep "$ROOT/skills/org/packs/production-artifacts/SKILL.md" "Verifier gate" "production pack Verifier gate"
assert_grep "$SKILL" "docx|pptx|xlsx|Office" "verifier checks Office Layer B existence"
assert_grep "$ROOT/skills/org/orchestrator/SKILL.md" "4B|21" "orchestrator lists office-shippable phases"

if [[ "$fail" -ne 0 ]]; then
  echo "validate-verifier-seat.test: FAILED" >&2
  exit 1
fi
echo "validate-verifier-seat.test: OK"
