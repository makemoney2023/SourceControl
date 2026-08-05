#!/usr/bin/env bash
# TDD gate: every org position seat meets CEO-bar structural minimums + Phase 22 peer SSOT.
# Run: bash scripts/validate-ceo-bar-seats.test.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
POS="$ROOT/skills/org/positions"
fail=0

fail_msg() {
  echo "FAIL: $*" >&2
  fail=1
}

ok_count=0
for dir in "$POS"/*/; do
  slug="$(basename "$dir")"
  skill="$dir/SKILL.md"
  [[ -f "$skill" ]] || continue

  [[ -f "$dir/HEARTBEAT.md" ]] || fail_msg "$slug missing HEARTBEAT.md"
  [[ -f "$dir/CHANGELOG.md" ]] || fail_msg "$slug missing CHANGELOG.md"

  if ! grep -qE '## Phase (craft )?playbooks|## Phase playbooks' "$skill"; then
    fail_msg "$slug SKILL.md missing Phase playbooks section"
  fi

  if grep -qE '_None — IC seat_|Delegates to\n_None_' "$skill" || grep -q '_None — IC seat_' "$skill"; then
    # IC: must not claim May spawn table for manager fan-out
    if grep -q '## May spawn' "$skill"; then
      fail_msg "$slug is IC but has ## May spawn (ICs must not spawn)"
    fi
  else
    # Manager: expect May spawn when Owns phases lists numeric phase rows
    if grep -q '## Owns phases' "$skill" && grep -qE '^\| [0-9]' "$skill"; then
      if ! grep -q '## May spawn' "$skill"; then
        fail_msg "$slug manager missing ## May spawn"
      fi
    fi
  fi

  agent="$ROOT/templates/org/agents/${slug}.md"
  [[ -f "$agent" ]] || fail_msg "$slug missing templates/org/agents/${slug}.md"

  ok_count=$((ok_count + 1))
done

# Orchestrator routing seat
[[ -f "$ROOT/skills/org/orchestrator/SKILL.md" ]] || fail_msg "orchestrator SKILL.md missing"
[[ -f "$ROOT/skills/org/orchestrator/HEARTBEAT.md" ]] || fail_msg "orchestrator HEARTBEAT.md missing"
[[ -f "$ROOT/skills/org/orchestrator/CHANGELOG.md" ]] || fail_msg "orchestrator CHANGELOG.md missing"
[[ -f "$ROOT/templates/org/agents/company-orchestrator.md" ]] || fail_msg "company-orchestrator agent missing"
grep -q '22-peer-' "$ROOT/skills/org/orchestrator/SKILL.md" || fail_msg "orchestrator missing Phase 22 peer paths"
grep -q 'Parallel IC leases' "$ROOT/skills/org/COLLABORATION.md" || fail_msg "COLLABORATION.md missing Parallel IC leases section"
grep -q '22-peer-<slug>' "$ROOT/skills/org/HANDOFF-TEMPLATE.md" || fail_msg "HANDOFF-TEMPLATE missing Phase 22 peer convention"

# Phase 22 SSOT across key seats
grep -q '22-peer-head-of-data' "$POS/ceo-strategist/SKILL.md" || fail_msg "CEO Phase 22 missing 22-peer-head-of-data"
grep -q '22-peer-cmo' "$POS/ceo-strategist/SKILL.md" || fail_msg "CEO Phase 22 missing 22-peer-cmo"
grep -q '22-peer-paid-media-manager' "$POS/ceo-strategist/SKILL.md" || fail_msg "CEO Phase 22 missing 22-peer-paid-media-manager"
grep -q '22-peer-cmo' "$POS/cmo/SKILL.md" || fail_msg "CMO missing Phase 22 peer path/playbook"
grep -q '22-peer-head-of-data' "$POS/head-of-data/SKILL.md" || fail_msg "HoD missing 22-peer-head-of-data"
grep -q '22-peer-paid-media-manager' "$POS/paid-media-manager/SKILL.md" || fail_msg "paid-media-manager missing 22-peer path"

if [[ "$ok_count" -lt 30 ]]; then
  fail_msg "expected >=30 position seats scanned, got $ok_count"
fi

if [[ "$fail" -ne 0 ]]; then
  echo "validate-ceo-bar-seats.test: FAILED" >&2
  exit 1
fi

echo "validate-ceo-bar-seats.test: OK ($ok_count positions + orchestrator/Phase 22 SSOT)"
