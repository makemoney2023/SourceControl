#!/usr/bin/env bash
# Blacksage Layer B proof: email inventory + design briefs + wire + DS SSOT + verifier.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BIZ="$ROOT/docs/projects/blacksage-kennels/business-idea"
HTML_DIR="$BIZ/17-channels/email/html"
INV="$BIZ/17-channels/email/PRODUCTION-INVENTORY.md"
BRIEF="$BIZ/17-channels/email/design/inquiry-welcome-design-brief.md"
LIFE="$BIZ/HANDOFFS/17-lifecycle-marketer.md"
MGR="$BIZ/HANDOFFS/17-manager-cmo.md"
VER="$BIZ/HANDOFFS/17-verifier.md"
WIRE="$BIZ/WIRE/phase-17-email.md"
DS="$ROOT/design-system/blacksage-kennels/MASTER.md"
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

assert_file "$INV"
assert_file "$BRIEF"
assert_file "$LIFE"
assert_file "$MGR"
assert_file "$VER"
assert_file "$WIRE"
assert_file "$DS"

html_count=$(find "$HTML_DIR" -maxdepth 1 -name '*.html' | wc -l | tr -d ' ')
if [[ "$html_count" -lt 15 ]]; then
  echo "FAIL: expected >=15 email HTML, got $html_count" >&2
  fail=1
fi

bash "$ROOT/scripts/validate-email-html.sh" "$HTML_DIR" || fail=1

assert_grep "$BRIEF" "email-design" "design brief cites email-design"
assert_grep "$LIFE" "design_brief_path" "lifecycle handoff design_brief_path"
assert_grep "$LIFE" "wire_checklist_path" "lifecycle wire_checklist_path"
assert_grep "$LIFE" "production_status:\\s*complete" "lifecycle production complete"
assert_grep "$MGR" "production_status:\\s*complete" "manager production complete"
assert_grep "$VER" "verdict:\\s*pass" "verifier pass"
assert_grep "$VER" "position:\\s*verifier" "verifier position"

if [[ "$fail" -ne 0 ]]; then
  echo "validate-blacksage-production-proof.test: FAILED" >&2
  exit 1
fi
echo "validate-blacksage-production-proof.test: OK"
