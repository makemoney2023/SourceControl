#!/usr/bin/env bash
# Blacksage Layer B proof: HTML email + verifier pass (no still/video required).
# Run: bash scripts/validate-blacksage-production-proof.test.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BIZ="$ROOT/docs/projects/blacksage-kennels/business-idea"
HTML="$BIZ/17-channels/email/html/inquiry-welcome-1-interest-ack.html"
BRIEF="$BIZ/17-channels/email/design/inquiry-welcome-design-brief.md"
LIFE="$BIZ/HANDOFFS/17-lifecycle-marketer.md"
MGR="$BIZ/HANDOFFS/17-manager-cmo.md"
VER="$BIZ/HANDOFFS/17-verifier.md"
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

assert_file "$HTML"
assert_file "$BRIEF"
assert_file "$LIFE"
assert_file "$MGR"
assert_file "$VER"

assert_grep "$BRIEF" "email-design" "design brief cites email-design"
assert_grep "$BRIEF" "generation prompt|Header still" "design brief locks header prompt"
assert_grep "$LIFE" "design_brief_path" "lifecycle handoff design_brief_path"

assert_grep "$HTML" "max-width:\\s*600px|width=\"600\"" "HTML 600px width"
assert_grep "$HTML" "Unsubscribe|unsubscribe" "HTML unsubscribe"
assert_grep "$HTML" "bgcolor=|#2c3e2d" "HTML bulletproof CTA"
assert_grep "$HTML" "font-size:\\s*1[4-9]px|font-size:\\s*[2-9][0-9]px" "HTML readable font"

assert_grep "$LIFE" "production_status:\\s*complete" "lifecycle production complete"
assert_grep "$LIFE" "inquiry-welcome-1-interest-ack\\.html" "lifecycle lists HTML path"
assert_grep "$MGR" "production_status:\\s*complete" "manager production complete"
assert_grep "$VER" "verdict:\\s*pass" "verifier pass"
assert_grep "$VER" "position:\\s*verifier" "verifier position"

# Proof scope: do not require stills/video dirs
if [[ -d "$BIZ/15-media/openmontage" ]] && [[ -n "$(find "$BIZ/15-media/openmontage" -type f 2>/dev/null | head -1)" ]]; then
  : # optional; not required
fi

if [[ "$fail" -ne 0 ]]; then
  echo "validate-blacksage-production-proof.test: FAILED" >&2
  exit 1
fi
echo "validate-blacksage-production-proof.test: OK"
