---
phase: "9"
manager: "cto"
ics_spawned: [tech-lead]
status: ready_for_csuite
recommendation: approve
llm_tier: coding-agent
llm_model: composer-2.5
generation_profile: none
generation_used: none
fallback_applied: false
production_status: skipped
skip_reason: scoped kid-vs-dog eval, not a full Phase 9 MVP
wire_owner: none
---

# Manager brief — Scoped kid-vs-dog eval — Telltail — Phase 9

## Operator brief (plain English)

Tech Lead ran a live three-still kid-vs-dog gate on Gemini 3.5 Flash Lite (one cloud call per still, no second detector). Child-in-frame refused; dog-only and adult+dog did not. I checked `results.json` against the build log — 3/3 live, no invented scores. This is an honest skip of a full MVP, not leftover kids-risk solved and not the K1 bite-risk eval. Plus planning can continue on this detect. I am not marking Phase 9 complete.

## What we found

- Live Lite cheap-model (`gemini-3.5-flash-lite`) distinguished child vs dog on these three Commons stills. `gemini-2.5-flash-lite` 404s for this key.
- AC-04.6 held: adult walking a dog was not a kid-refuse.
- n=3 stills is not a detector floor. Not video. Not a phone-selfie adult. Not leftover R2 / COPPA closed.
- K1 / Flash bite-risk refuse was **not** this eval. Plus still dies if Flash cannot refuse bite-risk.
- Reject gate: `production_status: skipped` with skip_reason present. No Next.js MVP claim. `wire_owner: none`.

## Next steps

1. **Verifier** — check build-log numbers against `apps/telltail/eval/results.json`. Reject invented scores or an MVP-complete claim. Write `HANDOFFS/9-verifier.md` only.
2. **CEO / Orchestrator** — after verifier: review `09-build-log.md` + this brief. Do **not** mark Phase 9 complete. Do **not** open 9B.
3. **Later CTO (not this packet)** — K1 Flash bite-risk eval remains the Plus kill.

## Summary

- Scoped Phase 9 eval, not a shippable MVP. Recommendation **approve** the eval artifacts as honest skip.
- 3/3 live on Flash-Lite. Keep planning Plus on child-vs-dog; do not close leftover kids risk.
- K1 open. Phase 8 stays escalate / not complete.
- Vendor pin: Lite cheap-model id is now `gemini-3.5-flash-lite`.
- Phase 9 is **not** marked complete.

## IC handoffs merged

| IC | Handoff path | Status | llm_tier | generation_used |
|----|--------------|--------|----------|-----------------|
| `tech-lead` | `HANDOFFS/9-tech-lead.md` | done / ready_to_merge | coding-agent | none |
| `verifier` | `HANDOFFS/9-verifier.md` | done / **pass** | strong-general | none |

## Model routing check

- [x] Tech Lead packet had `llm_tier: coding-agent` / `composer-2.5`
- [x] `generation_profile: none` / `generation_used: none` / `fallback_applied: false`
- [x] Vision *vendor* id 2.5-flash-lite → 3.5-flash-lite is a 404, not a coding-agent fallback
- [x] This brief: coding-agent / composer-2.5; no fallback
- [x] Creative `generation_profile` n/a

## Conflicts resolved

- none. Single IC. I accepted the skip (harness exists, not claimed complete). I confirmed scores match `results.json`.

## Artifacts for C-suite review

| Path | Scorecard check |
|------|-----------------|
| `docs/projects/telltail/business-idea/09-build-log.md` | Honest eval: stack, fixtures, 3/3 table, PRD map, gaps, production skip |
| `docs/projects/telltail/business-idea/HANDOFFS/9-tech-lead.md` | IC handoff; production_status skipped |
| `docs/projects/telltail/business-idea/HANDOFFS/9-manager-cto.md` | This brief |
| `apps/telltail/eval/results.json` | Raw live calls |
| `apps/telltail/eval/kid_vs_dog.py` | CLI harness (not an MVP) |

Canonical Mac: `/Users/cbsuperpatch/Desktop/ClaudeSkills/docs/projects/telltail/business-idea/` (local only, no OneDrive).

## Production check (shippable phases)

| Field | Value |
|-------|-------|
| production_status (merged) | skipped |
| Layer B paths | `apps/telltail/eval/*`, `apps/telltail/fixtures/*` — harness only, **not** a shippable MVP |
| wire_owner | none |
| skip_reason | scoped kid-vs-dog eval, not a full Phase 9 MVP |
| design_brief_path | n/a — CLI/script; design-before-build does not apply |

Reject gate applied: missing `production_status` would have been sent back. False-complete (empty app / MD-only MVP) not claimed.

## Escalation tags

- none for this scoped eval (kids leftover and K1 stay open; they are later work, not a rewrite of this brief)

## Asks for C-suite

- Approve the **scoped eval write-up** as honest. Do **not** approve Phase 9 as complete.
- Do not treat 3/3 as leftover kids-risk solved (R2 residual, no-template / retain path not built).
- Do not treat this as K1 clearance.
- Note vendor drift: planning name `gemini-2.5-flash-lite` is dead for new keys.

## Recommendation

**approve** — scoped-eval artifacts as-is (honest skip + live 3/3). Verifier **pass**. Not a Phase 9 ship. Do not mark the phase complete.
