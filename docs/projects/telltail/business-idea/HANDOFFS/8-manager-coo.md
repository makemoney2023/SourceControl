---
phase: "8"
manager: "coo"
ics_spawned: [ops-manager, legal-counsel]
status: ready_for_csuite
recommendation: escalate
llm_tier: frontier-reasoning
llm_model: grok-4.5
generation_profile: none
generation_used: none
fallback_applied: false
---

# Manager brief — Operations & legal — Telltail — Phase 8

## Operator brief (plain English)

I merged both Phase 8 IC leases into `08-operations.md` — ops runbook plus legal/risk checklist, not a pointer at the lease folder. Scorecard is both present: D1–D7 / W1–W7 / events and RACI on the ops side; R1–R12, C/A/V/U, and L1–L14 on the legal side. Explore only; 4B closed; nobody is building; Phase 8B was not opened. Artifacts are merge-ready for CEO / C-suite review. I am not marking the phase complete and this is not launch clearance.

## What we found

- Day-to-day is a consumer IAP loop (reads/quota, hard-stop, kids-in-frame, restore, vendor), not an inquiry desk. SLA hours stay `[Operator to set]`.
- Gate always runs at 0 remaining; support never re-scores a hard stop; kids-in-frame is yes/no only, no identity template, clip not a training asset.
- R2 kids-in-frame stays **RED (20)** until refuse + no-template + short retain ship; residual still ORANGE because cloud collection happens. **R5 name collision: founder lock 2026-08-21 accepted. Proceed with Telltail. Other Telltail = a person’s training shop, not an LLM app. Do not reopen as a block. Do not buy telltail.com.**
- Highest leftover unchanged except name: cloud kids video (R2/R3), L-list counsel before listing (ToS/IAP/privacy/insurance), SLA hours unset. Name is not among the leftovers-as-blocks.
- Vendors are placeholders. No contracts, insurance quotes, or `telltail.com` purchase.

## Next steps

1. **CEO / C-suite** — review the merge in `08-operations.md`. Do not treat as Phase 8 approval or launch clearance.
2. **Orchestrator** — do **not** mark Phase 8 ✅.
3. **Founder** — engage licensed US (+ CA) counsel on the L-list before public brand / listing / paid. No quotes invented here.
4. **No 8B** unless the orchestrator opens Head of People. Do not write JDs.

## Summary

- COO merge ready for C-suite. Status `ready_for_csuite`. Recommendation **escalate**.
- Scorecard both present. Banner present. Placeholders unfilled. 8B skipped (`skip_reason`: not opened).
- Legal leftovers: R2 RED until refuse ships; L-list counsel before listing; SLA / insurance unset. **R5 name accepted — not a block.**
- Production skipped. 4B closed. Explore only. Nobody is building. Nothing in the App Store.
- Phase 8 is **not** marked complete.

## IC handoffs merged

| IC | Handoff path | Status | llm_tier | generation_used |
|----|--------------|--------|----------|-----------------|
| `ops-manager` | `HANDOFFS/8-ops-manager.md` | done / ready_to_merge | fast-ops | none |
| `legal-counsel` | `HANDOFFS/8-legal-counsel.md` | done / ready_to_merge | frontier-reasoning | none |

## Model routing check

- [x] Every IC packet had `llm_tier`
- [x] `ops-manager`: fast-ops / composer-2.5; `generation_profile: none` / `generation_used: none` / `fallback_applied: false`
- [x] `legal-counsel`: frontier-reasoning / grok-4.5; `generation_profile: none` / `generation_used: none` / `fallback_applied: false`
- [x] This brief: frontier-reasoning / grok-4.5; no fallback
- [x] Creative `generation_profile` n/a (no creative IC this phase)

## Conflicts resolved

- **none requiring a rewrite.** Leases were non-colliding (ops = runbook/RACI/checklists; legal = risk/compliance/ToS/L-list).
- Ops asked legal for COPPA / retention / DPA / TM; legal lease covers all four.
- Both left SLA hours `[Operator to set]`. One cross-ref to `07-sales-playbook.md`. No invented hours.
- A5 unnamed on both sides. Legal lease used a public trainer as the banned example; merge keeps C8 / ToS A5 as unnamed / no-celebrity-catalog and does not repeat the name.

## Artifacts for C-suite review

| Path | Scorecard check |
|------|-----------------|
| `docs/projects/telltail/business-idea/08-operations.md` | **Ops AND risk** present. Banner. Exec summary scorecard. R1–R12 + ops-readiness. RACI. D1–D7 / W1–W7 / events. IAP support. Vendors placeholders. Data SOP. C1–C8 / A1–A8 / V1–V5 / U1–U8. IAP `[Attorney to draft]`. Privacy. TM planning-accept. ToS flags. L1–L14. Claims ladder. 8B skipped. Operator register (OPEN only). IC merge notes. |
| `docs/projects/telltail/business-idea/HANDOFFS/8-manager-coo.md` | This brief |
| `docs/projects/telltail/business-idea/_leases/08-ops-runbook.md` | IC lease (not overwritten) |
| `docs/projects/telltail/business-idea/_leases/08-legal-risk.md` | IC lease (not overwritten) |
| `docs/projects/telltail/business-idea/HANDOFFS/8-ops-manager.md` | IC handoff (not overwritten) |
| `docs/projects/telltail/business-idea/HANDOFFS/8-legal-counsel.md` | IC handoff (not overwritten) |

Canonical Mac: `/Users/cbsuperpatch/Desktop/ClaudeSkills/docs/projects/telltail/business-idea/` (local only, no OneDrive).

## Production check (shippable phases)

| Field | Value |
|-------|-------|
| production_status (merged) | skipped |
| Layer B paths | none |
| wire_owner | none |
| skip_reason | Phase 8 is Layer A ops+risk checklist. Explore. No store. Nobody is building. 4B closed. |

Phase 8 is not a shippable Layer B phase. Production skip is correct.

## Escalation tags

- **legal** (required) — R2 kids-in-frame RED until refuse ships; counsel on remaining L-list before listing / paid; **R5 name founder-accepted 2026-08-21, do not reopen**
- **spend** (soft) — 60 Flash + credits meter; do not invent SLA hours or insurance quotes

## Asks for C-suite

- **Accept** the merged artifacts in `08-operations.md` as the Phase 8 explore checklist.
- Do **not** mark Phase 8 complete.
- Do **not** open 8B.
- Do **not** spawn more ICs.
- Do not treat this brief as launch clearance.

## Recommendation

**escalate** — artifacts stay merge-ready; do **not** approve Phase 8 or treat as launch clearance. Founder lock: proceed with Telltail; name collision accepted; do not reopen the name; do not buy `telltail.com`. Leftovers unchanged: R2 kids-in-frame RED until refuse ships; counsel before listing on ToS/IAP/privacy/insurance; SLA hours unset. No new ICs.

<!-- graph:start -->
[[Telltail · Main]] · [[COO - Legal — Telltail · Main]] · [[Phase 8 — Telltail · Main]] · [[8-ops-manager]] · [[8-legal-counsel]]
<!-- graph:end -->
