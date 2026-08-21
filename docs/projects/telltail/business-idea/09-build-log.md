---
venture: telltail
org: Velocity Agency
phase: "9"
title: Build log — scoped kid-vs-dog eval
owner: tech-lead
status: scoped-eval — phase not complete
date: 2026-08-21
llm_tier: coding-agent
llm_model: composer-2.5
generation_profile: none
generation_used: none
fallback_applied: false
production_status: skipped
skip_reason: scoped kid-vs-dog eval, not a full Phase 9 MVP
wire_owner: none
4B: closed
---

# 09 — Build log — Telltail (scoped kid-vs-dog eval)

**Mode:** explore · **4B:** closed · Nobody is shipping · Nothing in the App Store

This is **not** a verified Next.js MVP. This is a **small kid-vs-dog test**. Do **not** mark Phase 9 complete. Do **not** open 9B.

Label key: **[F]** measured this pass · **[I]** inference · **[A]** assumption

Canonical disk: `/Users/cbsuperpatch/Desktop/ClaudeSkills/docs/projects/telltail/business-idea/` (local only, no OneDrive).

---

## Summary

Ran **three live** cloud vision calls (one per still) on **Gemini 3.5 Flash Lite** — the Lite cheap-model that this API key can actually reach. **3/3 right:** child-in-frame → refuse; dog-only → no kid-refuse; adult walking a dog → no kid-refuse. **[F]**

`gemini-2.5-flash-lite` (Phase 4 planning name) returned **HTTP 404** for this key: *no longer available to new users; use gemini-3.5-flash-lite*. That is vendor drift, not a coding-agent fallback. **[F]**

n=3 stills is **not** kids-risk solved. This does **not** close leftover R2 / COPPA residual. This does **not** close **K1 / bite-risk**. A paper plan is not a detector.

---

## Stack

| Item | What we actually used |
|------|------------------------|
| Product path under test | Lite = one cheap-model cloud vision call per clip/still |
| Model called | `gemini-3.5-flash-lite` (`model_version` echoed the same) |
| Model that failed | `gemini-2.5-flash-lite` — HTTP 404, not available to new users |
| Custom kid detector | **None.** Same one call does child-vs-dog. |
| On-device | Never. Stills were uploaded to Google generateContent. |
| App / UI | None. CLI harness only. |
| Plus Flash-class / bite-risk | **Not run.** |

Auth: `GEMINI_API_KEY` from repo-root `.env.local` (len 53). OPENAI empty — not used.

---

## Fixtures used

Wikimedia Commons stills. Not iPhone scare clips. Not user video. Not a training set. Attribution in `apps/telltail/fixtures/SOURCES.md`.

| id | File | What is in the still | Expected gate |
|----|------|----------------------|---------------|
| child-in-frame | `apps/telltail/fixtures/child-in-frame.jpg` | Young child + dog in a yard (child is small, lower-left) | Refuse — kids-in-frame |
| dog-only | `apps/telltail/fixtures/dog-only.jpg` | Golden retriever head; no human | Not a kid-refuse |
| adult-in-background | `apps/telltail/fixtures/adult-in-background.jpg` | Adult man walking a leashed dog; statue + buildings; no child | Not a kid-refuse (AC-04.6) |

---

## Results table

Live `generateContent` on 2026-08-21 ~1:18pm ET. Temperature 0. JSON response. One call per still.

| Fixture | HTTP | child_in_frame | refuse | Expected | Right/wrong | Latency (still) | Tokens (prompt / out / total) |
|---------|------|----------------|--------|----------|-------------|-----------------|-------------------------------|
| child-in-frame | 200 | true | true (`kids-in-frame`) | refuse | **right** | 1.284s | 1394 / 85 / 1479 |
| dog-only | 200 | false | false | no kid-refuse | **right** | 1.278s | 1366 / 71 / 1437 |
| adult-in-background | 200 | false | false | no kid-refuse | **right** | 1.444s | 1412 / 79 / 1491 |

**3 live calls. 3 right. 0 wrong.** Raw JSON: `apps/telltail/eval/results.json`.

Model notes (not identity): child case — “A small figure accompanied by a canine is visible in the lower left portion of the lawn.” Adult case named an adult + dog + statue; did not treat the statue as a child.

First attempt on `gemini-2.5-flash-lite`: **3× HTTP 404**. No scores invented from that run.

---

## Can Lite cheap-model distinguish child vs dog?

**On these three stills: yes.** The cheap-model refused the child+dog yard photo (even with a small distant child) and did **not** refuse dog-only or adult+dog. **[F]**

That is **not** a detector validation. Missing from this pass: video clips, phone-selfie adult, teenager vs adult boundary, doll / statue-of-child hard negatives, crowded park, back-of-head toddler, night kitchen. n=3 public photos.

---

## Can we keep planning Plus on this detect?

**Yes, keep planning Plus on the child-vs-dog detect** — this eval did not falsify AC-04.5 / AC-04.6 on the cheap-model. **[I]**

**Do not** treat leftover kids risk as closed. Cloud collection still happens (Phase 8 R2 residual). No face-template / no-train path was implemented. **[F]**

**Do not** treat this as K1 clearance. Bite-risk Flash-refuse is a different eval. K1 still kills Plus if Flash cannot refuse bite-risk. **[F]**

---

## PRD traceability

| ID | What the PRD asks | This pass |
|----|-------------------|-----------|
| **AC-04.5** | One cloud vision call (Lite = cheap-model) must distinguish a child from a dog. No second detector. Lite must not downgrade. | **Exercised on 3 stills.** Cheap-model did the detect. No second model. |
| **AC-04.6** | Adult holding phone / background adult is not auto-refuse unless child detector fires. | **Exercised** with adult+dog still (walker, not a selfie). No refuse. |
| **AC-04.4** | No vision card; no face template; clip not training data. | **Spec honored in harness** (yes/no JSON only). No card UI. Fixtures are Commons stills, not user clips. Product storage path **not built**. |
| **NFR-S4** | One call distinguishes child vs dog. Chip extra. Adult ≠ refuse unless child fires. | Same as AC-04.5 / 04.6. Chip path not tested (no app). |
| **BR-15** | Kids-in-frame is model detect on the one vision call. Child → refuse. Adult ≠ child. Lite must not downgrade. | Same. |
| **NFR-L1** | Do not invent a 2s SLA. | Still latencies ~1.3–1.4s recorded as **observations**, not a product SLA. Video not measured. |
| **US-12 / K1** | Flash-refuse on bite-risk | **Not this eval.** Open. |
| US-01–03, 05–11, 21, Plus meter, history, paywall | Full Lite loop / store / UI | **Out of scope.** |

---

## Demo path

No app UI. Reproduce the eval:

1. From `apps/telltail/`, run `python3 eval/kid_vs_dog.py`.
2. Requires `GEMINI_API_KEY` or `GOOGLE_API_KEY` in repo-root `.env.local`.
3. Reads `fixtures/*.jpg`. Writes `eval/results.json`.
4. Expected: 3 HTTP 200, 3 right, on `gemini-3.5-flash-lite`.

There is no TestFlight, no localhost Next app, no branded screen.

---

## Honest gaps

- **n=3 stills**, not video, not an iPhone scare clip.
- Adult fixture is a walker in a plaza, **not** an adult holding the phone toward the camera.
- Child fixture is a vintage yard photo; the child is small in frame (model still fired — one point, not a floor).
- No bite-risk / medical / confidence-floor fixtures. **K1 remains open.**
- No product gate UI, quota, history, or delete-on-kids-refuse path.
- `gemini-2.5-flash-lite` planning name is **dead for new keys**; Lite cheap-model is now `gemini-3.5-flash-lite` until someone signs a vendor.
- Phase 4 Gemini 2.5 Flash list price is still a planning base, not a signed DPA.
- This does **not** clear leftover kids risk. Paper + 3 stills ≠ COPPA residual closed.

---

## Production

| Field | Value |
|-------|-------|
| production_status | **skipped** |
| skip_reason | scoped kid-vs-dog eval, not a full Phase 9 MVP |
| production_paths | `apps/telltail/eval/kid_vs_dog.py`, `apps/telltail/eval/results.json`, `apps/telltail/fixtures/` — eval harness only, **not** a shippable MVP |
| wire_owner | none |
| design_brief | n/a — CLI/script; design-before-build does not apply |

Do **not** claim a verified Next.js MVP.

---

## Open items

- K1 / Flash bite-risk refuse eval (US-12, A3/E1) — later CTO. This pass does not design it.
- Kids leftover: refuse + no-template + short retain still must ship before leftover is closable. This eval is evidence the cheap-model *can* fire on a child still, not that risk is solved.
- Vendor pin: Lite cheap-model id drifted from 2.5-flash-lite → 3.5-flash-lite.
- Video / phone-selfie / hard-negative fixture set — not this pass.
- Phase 8 stays escalate / not complete.

---

## NOT doing / do-not

- Mark Phase 9 complete
- Open 9B / custom detector
- App Store, TestFlight, paywall, Plus meter, full Lite loop, history, chat, store listing, brand site, hiring
- Claim on-device
- Train on these fixtures or on user video
- Store a face template
- Name Cesar / any trainer (A5 OPEN)
- Invent scores
- Treat $12 as WTP
- Mix Blacksage or Sieger
