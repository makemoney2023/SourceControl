#!/usr/bin/env bash
# TDD gate: wave-2 skill→role bindings (marketingskills leftovers + legal/CS/sales/data).
# Run: bash scripts/validate-wave2-skill-bindings.test.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
POS="$ROOT/skills/org/positions"
fail=0

assert_bind() {
  local seat="$1" pack_fragment="$2" label="$3"
  local file="$POS/$seat/SKILL.md"
  if [[ ! -f "$file" ]]; then
    echo "FAIL: $label — missing seat file $file" >&2
    fail=1
    return
  fi
  if ! grep -qF "$pack_fragment" "$file"; then
    echo "FAIL: $label — '$pack_fragment' not bound on $seat" >&2
    fail=1
  fi
}

assert_pack_exists() {
  local rel="$1"
  if [[ ! -f "$ROOT/$rel/SKILL.md" ]] && [[ ! -f "$ROOT/$rel/AGENTS.md" ]]; then
    echo "FAIL: pack missing on disk: $rel" >&2
    fail=1
  fi
}

# --- Packs must exist ---
for rel in \
  skills/community/marketingskills/popups \
  skills/community/marketingskills/paywalls \
  skills/community/marketingskills/marketing-ideas \
  skills/community/marketingskills/marketing-council \
  skills/community/marketingskills/free-tools \
  skills/community/marketingskills/aso \
  skills/community/marketingskills/directory-submissions \
  skills/community/marketingskills/community-marketing \
  skills/community/marketingskills/competitors \
  skills/community/marketingskills/image \
  skills/community/awesome-claude-corporate-skills/06-legal-compliance/compliance-tracking \
  skills/community/awesome-claude-corporate-skills/06-legal-compliance/canned-responses \
  skills/community/awesome-claude-corporate-skills/11-customer-success/qbr-builder \
  skills/community/awesome-claude-corporate-skills/11-customer-success/ticket-triage \
  skills/community/awesome-claude-corporate-skills/11-customer-success/response-drafting \
  skills/community/awesome-claude-corporate-skills/11-customer-success/knowledge-management \
  skills/community/awesome-claude-corporate-skills/05-sales/account-research \
  skills/community/awesome-claude-corporate-skills/05-sales/enrich-lead \
  skills/community/awesome-claude-corporate-skills/05-sales/lead-research-assistant \
  skills/community/awesome-claude-corporate-skills/05-sales/sequence-load \
  skills/community/awesome-claude-corporate-skills/05-sales/contact-research \
  skills/community/awesome-claude-corporate-skills/05-sales/draft-outreach \
  skills/community/awesome-claude-corporate-skills/05-sales/create-an-asset \
  skills/community/awesome-claude-corporate-skills/05-sales/daily-briefing \
  skills/community/awesome-claude-corporate-skills/10-data-analytics/sql-queries \
  skills/community/awesome-claude-corporate-skills/10-data-analytics/data-exploration \
  skills/community/awesome-claude-corporate-skills/10-data-analytics/statistical-analysis \
  skills/community/awesome-claude-corporate-skills/10-data-analytics/data-validation \
  skills/community/awesome-claude-corporate-skills/10-data-analytics/postgres
do
  assert_pack_exists "$rel"
done

# --- marketingskills leftovers ---
assert_bind cmo "marketingskills/marketing-ideas" "cmo marketing ideas"
assert_bind cmo "marketingskills/marketing-council" "cmo marketing council"
assert_bind cmo "marketingskills/free-tools" "cmo free tools"
assert_bind lifecycle-marketer "marketingskills/popups" "lifecycle popups"
assert_bind lifecycle-marketer "marketingskills/paywalls" "lifecycle paywalls"
assert_bind web-designer "marketingskills/popups" "web popups"
assert_bind web-designer "marketingskills/paywalls" "web paywalls"
assert_bind seo-manager "marketingskills/aso" "seo ASO"
assert_bind seo-manager "marketingskills/directory-submissions" "seo directories"
assert_bind product-marketing-manager "marketingskills/aso" "pmm ASO"
assert_bind product-marketing-manager "marketingskills/free-tools" "pmm free tools"
assert_bind pr-manager "marketingskills/community-marketing" "pr community"
assert_bind pr-manager "marketingskills/directory-submissions" "pr directories"
assert_bind competitive-intelligence-analyst "marketingskills/competitors" "cia competitors"
assert_bind brand-designer "marketingskills/image" "brand image"

# --- legal ---
assert_bind legal-counsel "06-legal-compliance/compliance-tracking" "legal compliance tracking"
assert_bind legal-counsel "06-legal-compliance/canned-responses" "legal canned responses"

# --- customer success ---
assert_bind customer-success-manager "11-customer-success/qbr-builder" "csm QBR"
assert_bind customer-success-manager "11-customer-success/ticket-triage" "csm ticket triage"
assert_bind customer-success-manager "11-customer-success/response-drafting" "csm response drafting"
assert_bind customer-success-manager "11-customer-success/knowledge-management" "csm knowledge"

# --- sales / outbound ---
assert_bind outbound-lead "05-sales/account-research" "outbound account research"
assert_bind outbound-lead "05-sales/enrich-lead" "outbound enrich lead"
assert_bind outbound-lead "05-sales/lead-research-assistant" "outbound lead research"
assert_bind outbound-lead "05-sales/sequence-load" "outbound sequence load"
assert_bind outbound-lead "05-sales/contact-research" "outbound contact research"
assert_bind outbound-lead "05-sales/draft-outreach" "outbound draft outreach"
assert_bind sales-enablement-lead "05-sales/create-an-asset" "enablement create asset"
assert_bind sales-enablement-lead "05-sales/daily-briefing" "enablement daily briefing"
assert_bind sales-enablement-lead "05-sales/weekly-prep-brief" "enablement weekly prep"

# --- data ---
assert_bind analytics-engineer "10-data-analytics/sql-queries" "ae sql"
assert_bind analytics-engineer "10-data-analytics/data-exploration" "ae exploration"
assert_bind analytics-engineer "10-data-analytics/statistical-analysis" "ae stats"
assert_bind analytics-engineer "10-data-analytics/data-validation" "ae validation"
assert_bind analytics-engineer "10-data-analytics/postgres" "ae postgres"
assert_bind head-of-data "10-data-analytics/data-exploration" "hod exploration"
assert_bind head-of-data "10-data-analytics/statistical-analysis" "hod stats"
assert_bind head-of-data "10-data-analytics/sql-queries" "hod sql"

if [[ "$fail" -ne 0 ]]; then
  echo "validate-wave2-skill-bindings.test: FAILED" >&2
  exit 1
fi
echo "validate-wave2-skill-bindings.test: OK"
