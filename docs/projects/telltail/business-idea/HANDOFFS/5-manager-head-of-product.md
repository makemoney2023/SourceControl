---
phase: "5"
manager: head-of-product
ics_spawned: [product-manager, business-analyst]
status: ready_for_csuite
recommendation: approve
llm_tier: strong-general
llm_model: composer-2.5
generation_profile: none
fallback_applied: false
production_status: skipped
skip_reason: Phase 5 is not shippable. 4B closed.
---

# Manager brief — Telltail PRD — Phase 5

## Operator brief (plain English)

I merged the PM slice (vision, stories, FR-1–FR-12, MoSCoW, staged launch) with the BA slice (AC, traceability, NFRs, register, rules) into one `05-prd.md` — edited, not pasted. The load-bearing decision: A+C stays a test; US-08/US-09 are Must *of that test* (withdrawn if the test or K1 fails); US-15 stays a labeled A5 gap with AC-15.1 (no anonymous PetGPT). C-suite can review the merge. Work continues to review only — do not mark Phase 5 complete.

## What we found

- Merge is one PRD: PM craft + BA AC/NFR/trace/rules under shared US-01–US-16. No competing Must IDs.
- US-01–14 and US-16 have testable Given/When/Then AC. US-15 is a labeled gap (A5 OPEN) plus AC-15.1 placeholder.
- Lite = cheap-model (not Flash-class); Plus = Flash-class; safety does not downgrade. **[F]**
- Gate always runs, including at 0 remaining; a refuse consumes the safety path when a model ran. No free-refuse bypass.
- Latency unknown (no 2s SLA). Inquiry form N/A (IAP). No invented TAM, interviews, WTP close, named voice, or eval design.

## Next steps

1. **C-suite** — review and approve `05-prd.md`. Do not flatten A+C into a lock. Do not mark Phase 5 complete.
2. **Orchestrator** — route the merge; do not spawn from this brief.
3. **CTO later** — Flash-refuse eval (K1 / US-12). Stubbed, not designed. Not a prompt bake-off.
4. **No new operator question.** A1 / A3 / A4 / A5 already OPEN on the register.

## Summary

- HoP-merged PRD ready for C-suite. Status `ready_for_csuite`. Recommendation **approve**.
- Scorecard: PRD + MoSCoW + AC present. US-01–14 and US-16 have testable AC. US-15 labeled gap (A5 OPEN).
- US-08/US-09 remain Must *of the A+C test*, not an unconditional v1 lock.
- Production skipped. 4B closed. Explore only. Nobody is building. Nothing in the App Store.
- Phase 5 is **not** marked complete.

## IC handoffs merged

| IC | Handoff path | Status | llm_tier | generation_used |
|----|--------------|--------|----------|-----------------|
| `product-manager` | `HANDOFFS/5-product-manager.md` | done / ready_to_merge | strong-general | none |
| `business-analyst` | `HANDOFFS/5-business-analyst.md` | done / ready_to_merge | strong-general | none |

## Model routing check

- [x] Both IC packets had `llm_tier: strong-general`
- [x] Both used `llm_model: composer-2.5`
- [x] `generation_profile: none` / `generation_used: none`
- [x] `fallback_applied: false` on both ICs and this brief
- [x] This brief: strong-general / composer-2.5; no fallback

## Conflicts resolved

1. **Lite model** = cheap-model (Phase 4 / PM). Safety does not downgrade. Not Flash-class on Lite.
2. **US-08/US-09** = Must *of the A+C test*. Withdrawn if test or K1 fails. Plus is not an unconditional v1 lock.
3. **US-15** = Should with labeled AC gap (A5 OPEN). AC-15.1 held: no anonymous PetGPT / fake named expert.
4. **Quota** = gate always runs, including at 0 remaining. Refuse consumes the safety path / read unit when a model ran. No free refuse that hides a skipped gate.
5. **Latency** = unknown. No 2s SLA. “Next 60 seconds” is the advice horizon, not a latency target.
6. **Inquiry form** = N/A (published IAP, not inquiry-first).
7. **Do not invent** TAM, interviews, WTP close, named voice, or Flash-refuse eval design.

## Artifacts for C-suite review

| Path | Scorecard check |
|------|-----------------|
| `docs/projects/telltail/business-idea/05-prd.md` | **PRD + MoSCoW + AC** present. US-01–14 and US-16 have testable AC. US-15 labeled gap (A5 OPEN). Every Must/Should has testable AC or a labeled gap. |
| `docs/projects/telltail/business-idea/HANDOFFS/5-manager-head-of-product.md` | This brief |

Canonical Mac (when copied): `/Users/cbsuperpatch/Desktop/ClaudeSkills/docs/projects/telltail/business-idea/` (local only, no OneDrive).

## Production check (shippable phases)

| Field | Value |
|-------|-------|
| production_status (merged) | skipped |
| Layer B paths | none |
| wire_owner | none |
| skip_reason | Phase 5 is not shippable. 4B closed. Explore only. Nobody is building. Nothing in the App Store. |

## Escalation tags

- none

Flash-refuse remains named **K1 / A3/E1 OPEN** on the register — already inherited, not a new evidence tag from this merge.

## Asks for C-suite

- Review and approve the HoP merge in `05-prd.md`.
- Do not flatten A+C from test into a strategy / launch lock.
- Do not mark Phase 5 complete.

## Recommendation

**approve** — ship the merged PRD as the Phase 5 artifact for C-suite review. Do not mark the phase complete.
