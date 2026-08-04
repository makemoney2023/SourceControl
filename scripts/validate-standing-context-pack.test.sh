#!/usr/bin/env bash
# TDD gate: standing-context org packs + seat bindings.
# Run: bash scripts/validate-standing-context-pack.test.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SC="$ROOT/skills/org/packs/standing-context"
POS="$ROOT/skills/org/positions"
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

assert_bind() {
  local seat="$1" fragment="$2" label="$3"
  assert_grep "$POS/$seat/SKILL.md" "$fragment" "$label"
}

assert_no_grep() {
  local file="$1" pattern="$2" label="$3"
  if [[ -f "$file" ]] && grep -qiE "$pattern" "$file"; then
    echo "FAIL: $label — forbidden /$pattern/ in ${file#"$ROOT/"}" >&2
    fail=1
  fi
}

# Index + child packs
assert_file "$SC/SKILL.md"
assert_file "$SC/buying-psychology/SKILL.md"
assert_file "$SC/buying-psychology/config.json"
assert_file "$SC/content-persuasion/SKILL.md"
assert_file "$SC/content-persuasion/config.json"
assert_file "$SC/ai-detection-writing/SKILL.md"
assert_file "$SC/ai-detection-writing/config.json"
assert_file "$SC/humor-craft/SKILL.md"
assert_file "$SC/humor-craft/sarcasm-idioms-config.json"
assert_file "$SC/humor-craft/key-and-peele-research.json"
assert_file "$SC/sales-youtube-frameworks/SKILL.md"
assert_file "$SC/sales-youtube-frameworks/youtube_videos.json"
assert_file "$SC/sales-youtube-frameworks/frameworks/all_frameworks.md"
assert_file "$SC/sales-youtube-frameworks/frameworks/objection_handling.md"
assert_file "$SC/sales-youtube-frameworks/frameworks/cold_calling.md"
assert_file "$SC/sales-youtube-frameworks/frameworks/closing_techniques.md"
assert_file "$SC/sales-youtube-frameworks/frameworks/sales_psychology_and_building_rapport.md"

# Analyses present (at least a handful)
analysis_count=$(find "$SC/sales-youtube-frameworks/analyses" -name '*.json' 2>/dev/null | wc -l | tr -d ' ')
if [[ "${analysis_count:-0}" -lt 20 ]]; then
  echo "FAIL: expected >=20 analysis JSON files, got ${analysis_count:-0}" >&2
  fail=1
fi

# Index contract
assert_grep "$SC/SKILL.md" "Standing context" "index names standing context"
assert_grep "$SC/SKILL.md" "buying-psychology|content-persuasion|sales-youtube" "index lists child packs"

# Configs are psychology/persuasion shaped
assert_grep "$SC/buying-psychology/config.json" "playbooks|cialdini" "buying psychology playbooks"
assert_grep "$SC/content-persuasion/config.json" "core_frameworks|cialdini" "persuasion frameworks"

# No Superpatch brand lock in imported standing context (case-insensitive)
for f in \
  "$SC/buying-psychology/config.json" \
  "$SC/content-persuasion/config.json" \
  "$SC/ai-detection-writing/config.json" \
  "$SC/humor-craft/sarcasm-idioms-config.json" \
  "$SC/humor-craft/key-and-peele-research.json" \
  "$SC/sales-youtube-frameworks/youtube_videos.json"
do
  assert_no_grep "$f" "super ?patch" "scrub Superpatch from $(basename "$f")"
done
# Framework MDs: strip Super Patch Application sections
assert_no_grep "$SC/sales-youtube-frameworks/frameworks/general_sales_training.md" "Super Patch Application" "scrub SP application sections"

# Seat bindings
assert_bind cmo "standing-context/buying-psychology" "cmo buying psych"
assert_bind copy-chief "standing-context/buying-psychology" "copy buying psych"
assert_bind copy-chief "standing-context/content-persuasion" "copy persuasion"
assert_bind copy-chief "standing-context/ai-detection-writing" "copy ai detection"
assert_bind content-strategist "standing-context/content-persuasion" "content persuasion"
assert_bind content-strategist "standing-context/ai-detection-writing" "content ai detection"
assert_bind content-strategist "standing-context/humor-craft" "content humor"
assert_bind lifecycle-marketer "standing-context/buying-psychology" "lifecycle buying psych"
assert_bind lifecycle-marketer "standing-context/content-persuasion" "lifecycle persuasion"
assert_bind product-marketing-manager "standing-context/buying-psychology" "pmm buying psych"
assert_bind web-designer "standing-context/buying-psychology" "web buying psych"
assert_bind pr-manager "standing-context/content-persuasion" "pr persuasion"
assert_bind video-producer "standing-context/humor-craft" "video humor"
assert_bind creative-director "standing-context/humor-craft" "cd humor"
assert_bind sales-enablement-lead "standing-context/sales-youtube-frameworks" "enablement sales YT"
assert_bind outbound-lead "standing-context/sales-youtube-frameworks" "outbound sales YT"
assert_bind head-of-sales-cs "standing-context/sales-youtube-frameworks" "hosales sales YT"
assert_bind customer-success-manager "standing-context/sales-youtube-frameworks" "csm sales YT follow-up"

# Org README mentions standing context
assert_grep "$ROOT/skills/org/README.md" "standing-context" "org README standing-context"

if [[ "$fail" -ne 0 ]]; then
  echo "validate-standing-context-pack.test: FAILED" >&2
  exit 1
fi
echo "validate-standing-context-pack.test: OK"
