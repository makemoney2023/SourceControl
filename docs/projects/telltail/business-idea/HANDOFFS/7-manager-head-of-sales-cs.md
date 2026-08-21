---
phase: "7"
manager: head-of-sales-cs
ics_spawned:
  - sales-enablement-lead
  - outbound-lead
  - customer-success-manager
status: ready_for_csuite
recommendation: approve
llm_tier: strong-general
llm_model: composer-2.5
generation_profile: none
generation_used: none
fallback_applied: false
production_status: skipped
---

# Manager brief — Telltail Sales & CS — Phase 7

## Operator brief (plain English)

I merged the three Phase 7 IC slices into `07-sales-playbook.md` — edited, not pasted — and I am not marking the phase complete. Chat lane, SKU, bans, and CTAs sit once in Strategic frame; Close / Respond / Retain only add their application. Outbound pipeline stays an honest skip; Respond and Retain share one operator SLA block with hours still `[Operator to set]`. Scorecard: a cold operator can run close and retain from the playbook alone. C-suite can review the merge; explore only — 4B closed, nobody is building.

## What we found

- Close = Lite finish (card **or** refuse) → Plus $12/60 as a **test**. Stay-on-Lite is a real close. Inquiry form **N/A**. **[F]**
- Respond is inbound support. No SDR list. Later thin play = trainer/rescue share-not-sell, unsent. **[F]/[I]**
- Chat is one rule: context + conversation. Text-only is not a vision read. A moment card still needs a clip. **[F]**
- Retain = honest reads + refuse-as-success. Keep = a new scare, not a streak. Withdraw $12 if A+C or K1 fails. **[F]**
- SLA hours were blank on both Respond and Retain; merged, not invented. **[A]** operator

## Next steps

1. **C-suite** — review `07-sales-playbook.md`. Approve as explore Layer A. Do **not** mark Phase 7 complete.
2. **Operator** — set shared SLA / cover-window hours when a build exists. No new Open register id.
3. **Product / CTO and Founder (not spawned)** — K1 and A5 stay theirs. A1 / A3/E1 / A4 remain OPEN.

## Summary

- Head-of-sales-cs merge ready for C-suite. Status `ready_for_csuite`. Recommendation **approve**.
- Scorecard present: Close (qualify, talk tracks, objections, stay-on-Lite, Plus as test) **and** Retain (first scare, meter honesty, refuse-as-success, escalate, chat retain, churn/save, withdraw-if-test-fails).
- Outbound honest-skip kept. One chat-lane rule. One SLA block.
- Production skipped. 4B closed. Explore only. Nobody is building. Nothing in the App Store.
- Phase 7 is **not** marked complete.

## IC handoffs merged

| IC | Handoff path | Status | llm_tier | generation_used |
|----|--------------|--------|----------|-----------------|
| `sales-enablement-lead` | `HANDOFFS/7-sales-enablement-lead.md` | done / ready_to_merge | strong-general | none |
| `outbound-lead` | `HANDOFFS/7-outbound-lead.md` | done / ready_to_merge | strong-general | none |
| `customer-success-manager` | `HANDOFFS/7-customer-success-manager.md` | done / ready_to_merge | strong-general | none |

## Model routing check

- [x] Every IC packet had `llm_tier`
- [x] All three ICs: `strong-general` / `composer-2.5`
- [x] `generation_profile: none` / `generation_used: none` / `fallback_applied: false` on all three ICs
- [x] This brief: `strong-general` / `composer-2.5`; no fallback
- [x] Creative `generation_profile` n/a (no creative IC this phase)

## Conflicts resolved

- **SLA:** Outbound and CSM both left hours `[Operator to set]`. One shared support-style SLA block in the playbook (queue first-response + P1–P4). Respond + Retain share it. No invented hours.
- **Chat lane:** One founder/US-21 rule in Strategic frame. Not restaged three times. Text-only is not a vision read.
- **Outbound skip:** Kept. No SDR pipeline. Later trainer/rescue share-not-sell stays unsent.
- **Escalate roles:** Union of Close (vet / DACVB / CPDT) and Retain (adds CAAB). One owner-facing table.
- **Close vs Retain first-scare seam:** Close scripts Lite-finish → Plus-test or stay-on-Lite. Retain measures activation and owns keep / cancel. Same event, two jobs. Not a lock break.
- No invented WTP, conversion, or churn %. A+C remains a test.

## Artifacts for C-suite review

| Path | Scorecard check |
|------|-----------------|
| `docs/projects/telltail/business-idea/07-sales-playbook.md` | **Close AND retain** runnable from this doc alone. Strategic frame, exec summary, Parts I–III, shared SLA, operator register, open items (A1, A3/E1/K1, A4, A5 still OPEN), IC merge notes. |
| `docs/projects/telltail/business-idea/HANDOFFS/7-manager-head-of-sales-cs.md` | This brief |
| `docs/projects/telltail/business-idea/07-sales/01-close.md` | IC slice (lease; **not** overwritten) |
| `docs/projects/telltail/business-idea/07-sales/02-respond.md` | IC slice (lease; **not** overwritten) |
| `docs/projects/telltail/business-idea/07-sales/03-retain.md` | IC slice (lease; **not** overwritten) |

Canonical Mac: `/Users/cbsuperpatch/Desktop/ClaudeSkills/docs/projects/telltail/business-idea/` (local only, no OneDrive).

## Production check (shippable phases)

| Field | Value |
|-------|-------|
| production_status (merged) | skipped |
| Layer B paths | none |
| wire_owner | none |
| skip_reason | Explore Layer A only. No store, no paid, no Layer B. 4B closed. Nobody is building. Nothing in the App Store. |

Phase 7 is not a shippable Layer B phase. Production skip is correct.

## Escalation tags

- none
- (already OPEN, not new, not blocking): A1 film-live · A3/E1/K1 Flash-refuse · A4 WTP · A5 unnamed voice

## Asks for C-suite

- Review and **approve** the Head of Sales & CS merge in `07-sales-playbook.md`.
- Do not mark Phase 7 complete.
- Do not flatten A+C from test into a lock.
- Do not invent SLA hours or treat $12 as proven WTP.
- Do not spawn more sales ICs from this brief.

## Recommendation

**approve** — ship the merged sales playbook as the Phase 7 artifact for C-suite review. Explore only. Phase remains open until C-suite / orchestrator close it. Do not mark the phase complete.

<!-- graph:start -->
[[Telltail]] · [[Head of Sales & CS — Telltail]] · [[Phase 7 — Telltail]]
<!-- graph:end -->
