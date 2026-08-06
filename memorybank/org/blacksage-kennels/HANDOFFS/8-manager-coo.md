---
phase: "8"
manager: coo
ics_spawned: [ops-manager, legal-counsel]
status: ready_for_csuite
recommendation: approve
llm_tier: frontier-reasoning
llm_model: grok-4.5
generation_profile: none
fallback_applied: false
---

# Manager brief — Ops & Legal — Phase 8

## In plain English

Phase 8 delivers one operator-facing operations document: how to run the kennel day-to-day, how to handle website inquiries and content updates, and a legal/risk checklist for breeding marketing. Two specialists worked in parallel — ops on checklists and cadences, legal on claims, contracts, deposits, privacy, and attorney-review flags. Nothing invents prices, SLA hours, deposit amounts, location, or contract terms; those stay as operator or attorney placeholders. The artifact is ready for C-suite yes/no. Phase 8B hiring should be skipped — no hires planned. The runbook phase is not marked complete.

## What we found

- **Ops and legal split cleanly:** Ops owns cadence, ownership, and SOPs; sales scripts stay in the Phase 7 playbook; licensed counsel must finalize privacy notice and OP-P2/P6 terms before go-live.
- **Inquiry ops is Q7-gated:** Public launch stays blocked until form destination, owner, and SLA placeholders are set — aligned to PRD LG2 and the sales playbook.
- **SD5 claim discipline is the compliance spine:** Tier 1/2/3 checklist plus pre-publish SOP (SOP-OPS-001) prevent invented health, location, prices, or fake dog proof.
- **Deposit/contract risk is controlled by sequencing:** Money and contracts stay off-site after qualification/approval; site language stays generic (“terms provided individually”).
- **8B skip:** Single-operator model is enough for bootstrapped Tier 1/2 volume; revisit hiring only if capacity breaks.

## Next steps

1. **C-suite (ceo-strategist / orchestrator):** Review `08-operations.md` for yes/no; do not mark RUNBOOK Phase 8 ✅ until approved; **skip 8B**.
2. **Operator:** Close Q7, Q1, Q2 (if claiming geography), and schedule licensed counsel against §8.5 attorney flags before production form go-live.
3. **Downstream:** CTO/Phase 9 use vendor + form security checklist; Phases 13–14 use consent/disclaimer drafts; Phase 10 QA audits Tier 3 / claims.

## Summary (5 bullets max)

- Merged `08-operations.md` covers kennel ops, website inquiry/content ops, privacy SOP, and legal/risk checklists.
- Both IC handoffs merged; no blocking conflicts; privacy process vs counsel notice ownership clarified.
- Not-legal-advice banner and `[Attorney to draft]` / `[Operator to set]` placeholders throughout.
- Recommend **8B skip** (no hires).
- Ready for C-suite; RUNBOOK not marked ✅.

## IC handoffs merged

| IC | Handoff path | Status | llm_tier | generation_used |
|----|--------------|--------|----------|-----------------|
| `ops-manager` | `HANDOFFS/8-ops-manager.md` | done | fast-ops | none |
| `legal-counsel` | `HANDOFFS/8-legal-counsel.md` | done | frontier-reasoning | none |

## Model routing check

- [x] Every IC packet had `llm_tier`
- [x] Creative ICs used correct `generation_profile` (or skip reason) — N/A; all `none`
- [x] Fallbacks recorded — none applied (`ops-manager`: composer-2.5-fast; `legal-counsel`: cursor-grok-4.5-high-fast)

## Conflicts resolved

- **Privacy:** Ops SOP-OPS-002 = lifecycle process; legal §8.4 = risk checklist + counsel-owned notice — both kept.
- **Consent copy:** Legal drafts (§8.3) canonical for site; ops references playbook and forbids approval language in auto-replies.
- **8B:** Both ICs recommend skip — COO recommendation = **skip**.
- **Legal pack empty:** Proceeded with SD5/PRD framing — documented; not escalated.

## Artifacts for C-suite review

| Path | Scorecard check |
|------|-----------------|
| `docs/projects/blacksage-kennels/business-idea/08-operations.md` | ✅ Ops: kennel daily/weekly/litter checklists; inquiry ownership/cadence; content cadence; privacy SOP; vendors |
| | ✅ Risk: SD5 claims; OP-P2/P6 deposit/contract flags; disclaimer/consent drafts; PII checklist; attorney-review list |
| | ✅ Not legal advice labeled; no invented prices/SLAs/location/health inventory |
| | ✅ Aligns D2, A10, Package A/B/C, Phase 7 sequencing |
| | ✅ 8B skip recommended |

## Escalation tags

- none (attorney items are launch flags inside §8.5, not phase-block escalations)

## Asks for C-suite

- Approve Phase 8 artifact as ops + risk posture before operator customizes vendors and counsel drafts.
- Confirm **8B skip** (no people plan) unless operator intends hires.
- Flag whether operator interview for Q7 / OP-P2 / OP-P6 should be scheduled before Tier 1 public launch (recommended — same posture as Phase 7).

## Recommendation

**approve** — ship `08-operations.md` as-is for C-suite gate; recommend skip 8B; do not mark RUNBOOK ✅ until CEO/orchestrator advances.
