---
phase: "9"
position: "tech-lead"
reports_to: "cto"
status: done
verdict_for_manager: ready_to_merge
llm_tier: coding-agent
llm_model: composer-2.5
generation_profile: none
generation_used: none
fallback_applied: false
production_status: skipped
production_paths:
  - apps/telltail/eval/kid_vs_dog.py
  - apps/telltail/eval/results.json
  - apps/telltail/fixtures/child-in-frame.jpg
  - apps/telltail/fixtures/dog-only.jpg
  - apps/telltail/fixtures/adult-in-background.jpg
design_brief_path: ""
photoreal_qa: ""
license_basis: ""
wire_owner: none
wire_checklist_path: ""
wire_notes: "No wire. Eval harness only. No Vercel, no IAP, no vendor DPA."
skip_reason: "scoped kid-vs-dog eval, not a full Phase 9 MVP"
tool_status:
  github: unused
  vercel: unused
  supabase: unused
  gemini_generateContent: live
---

# Handoff — Tech Lead → CTO

## Operator brief (plain English)

I ran a live three-still kid-vs-dog gate on the Lite cheap-model we can actually call: Gemini 3.5 Flash Lite. Child-in-frame refused; dog-only and adult-with-dog did not. The Phase 4 name `gemini-2.5-flash-lite` 404s for this key. n=3 stills is not leftover kids-risk solved and does not touch bite-risk / K1. Plus planning can continue on this detect; do not mark Phase 9 complete.

## What we found

- One cloud vision call per still. No second kid-detector model.
- Live scores: **3/3 right** (child refuse; dog-only pass; adult+dog pass).
- Adult in frame was **not** treated as a kid-refuse (AC-04.6).
- `gemini-2.5-flash-lite` is dead for new users; cheap-model id is now `gemini-3.5-flash-lite`.
- This does not close K1, leftover R2, or Phase 8.

## Next steps

1. **CTO** — write the manager brief and spawn verifier. Do not mark the phase complete. Do not open 9B.
2. **Verifier** — check the build log numbers against `apps/telltail/eval/results.json`. Reject invented scores or an MVP-complete claim.
3. **Later CTO (not this packet)** — K1 Flash bite-risk eval remains the Plus kill. This pass is child-vs-dog only.

## Goal (from context packet)

Prove one cloud vision call can tell a child from a dog and refuse. Write `09-build-log.md`. Optional tiny harness in `apps/telltail/` only if it serves the eval. Return to CTO. Do not spawn. Do not write the manager brief. Do not mark the phase complete. Do not open 9B.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/telltail/business-idea/09-build-log.md` | Honest eval write-up; 3/3 live; not phase-complete |
| `docs/projects/telltail/business-idea/HANDOFFS/9-tech-lead.md` | This handoff |
| `apps/telltail/eval/kid_vs_dog.py` | CLI harness — one generateContent per still |
| `apps/telltail/eval/results.json` | Raw live results |
| `apps/telltail/eval/gemini-2.5-flash-lite-404.txt` | 404 note for the planning model id |
| `apps/telltail/fixtures/` | Three Commons stills + SOURCES.md |
| `apps/telltail/README.md` | Not-an-MVP notice |

Local Mac only. Not OneDrive.

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | coding-agent |
| llm_model | composer-2.5 |
| generation_profile | none |
| generation_used | none |
| fallback_applied | no — Plane A stayed composer-2.5. Vision *vendor* id shifted 2.5-flash-lite → 3.5-flash-lite because of a 404, not a coding-agent fallback. |

## Production (shippable phases — required)

| Field | Value |
|-------|-------|
| production_status | skipped |
| production_paths | `apps/telltail/eval/*` and `apps/telltail/fixtures/*` (harness only) |
| wire_owner | none |
| wire_notes | No deploy, no IAP, no DPA |
| skip_reason | scoped kid-vs-dog eval, not a full Phase 9 MVP |

Design-before-build does **not** apply to this CLI/script. No branded app UI.

## SDK correlation (optional)

| Field | Value |
|-------|-------|
| sdk_runtime | n/a |
| sdk_agent_id | n/a |
| sdk_run_id | n/a |
| sdk_request_id | n/a |

## Decisions

- Eval on **stills** (one frame) because the packet asked for a small kid-vs-dog test, not a clip recipe.
- Call **Gemini 3.5 Flash Lite** after 2.5-flash-lite 404'd — still one Lite cheap-model, still one call, no custom detector.
- Adult fixture = man walking a dog (Commons). Not a phone-selfie; still a valid AC-04.6 negative.
- `production_status: skipped` even though a harness exists — this is not a shippable MVP.

## Asks for manager (`ask_manager`)

- Peer help needed: none — verifier is yours to spawn after the manager brief
- Clarification needed: none

## Risks / blockers

- **n=3** is not a safety floor. Easy to over-read 3/3 as “kids solved.”
- Leftover kids risk (cloud collection, retain, COPPA) stays open. Phase 8 residual R2 is unchanged.
- **K1 / bite-risk** untouched. Plus still dies if Flash cannot refuse bite-risk.
- Vendor id drift: planning docs that say Gemini 2.5 Flash Lite will fail on new keys.
- Fixtures are public photos, not scare clips. Generalization is unproven.

## Packs used

| Pack | Decision tied to pack |
|------|------------------------|
| `skills/org/packs/production-artifacts/` | Set `production_status: skipped` with skip_reason “scoped kid-vs-dog eval, not a full Phase 9 MVP”; listed harness paths; `wire_owner: none`; did not claim complete or a Next.js MVP; design-before-build waived for CLI-only. |
| `skills/org/HANDOFF-TEMPLATE.md` | Wrote this file to the template shape (operator brief / found / next, lease table, production fields, model audit). |

## Do not

- Mark the phase complete
- Write the manager brief (CTO owns that)
- Open 9B or spawn a custom detector
- Spawn other positions
- Claim a verified Next.js MVP or App Store/TestFlight
- Treat 3/3 as leftover kids-risk closed
- Treat this as the K1 bite-risk eval
- Invent scores
- Claim on-device
- Name a trainer (A5 OPEN)
- Train on user video or these fixtures
- Buy telltail.com / mix Blacksage or Sieger
