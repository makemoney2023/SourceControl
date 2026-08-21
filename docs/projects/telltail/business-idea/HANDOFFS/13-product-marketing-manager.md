---
phase: "13"
position: "product-marketing-manager"
reports_to: "cmo"
status: done
verdict_for_manager: ready_to_merge
llm_tier: strong-general
llm_model: composer-2.5
generation_profile: none
generation_used: none
fallback_applied: false
tool_status:
  parallel-research: unused
production_status: skipped
production_paths: []
design_brief_path: ""
skip_reason: "Phase 13 PMM lease is CTA/claims outlines, not Layer B and not full page copy."
wire_owner: none
wire_checklist_path: ""
wire_notes: ""
---

# Handoff — Product Marketing Manager → CMO

## Operator brief (plain English)

CTA and claims locks are filed in `13-copy/03-cta-claims.md`. I did not write `13-copy-foundation.md` or headlines. Consolidated founder locks are in: one chat thread; one web app (PWA + Capacitor wrap on iOS and Android); not three products; not iOS-only; no store and no live pages this pass. Holding line unchanged. Paywall still only after a finished Lite scare.

## What we found

- Home / How it works CTA opens the same thread. Pricing may show $12 / 60; the app waits for US-07.
- Moment / refuse / paywall / zero-remaining each have a primary and an anti-CTA. Freeze / whale-eye / stare stay inputs, not auto-refuse buttons.
- Proof hierarchy stops at behavior we can show. A5 unnamed: no Cesar, no PetGPT face.
- One price everywhere: $12/mo / $99/yr · 60 Flash. Never $9.99. Never three SKUs or native-vs-web.
- A+C remains a test — $12 must not become a course.

## Next steps

1. **CMO** — merge this slice into `13-copy-foundation.md` with Copy Chief voice/headlines.
2. **Copy Chief (not spawned)** — inherit the CTA table and claims tiers; do not flatten OPEN rows.
3. **No new operator ask.**

## Goal (from context packet)

CTA system + claims tiers + messaging hierarchy for in-thread cards and Home / How it works / Pricing. Outlines only. Report to CMO. Do not spawn. Do not mark complete.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/telltail/business-idea/13-copy/03-cta-claims.md` | CTA table, claims tiers, hierarchy, enablement, F/I/A; consolidated surface lock |
| `docs/projects/telltail/business-idea/HANDOFFS/13-product-marketing-manager.md` | This handoff |

Local Mac only (`/Users/cbsuperpatch/Desktop/ClaudeSkills/docs/projects/telltail/business-idea/`). Not OneDrive.

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | strong-general |
| llm_model | composer-2.5 |
| generation_profile | none |
| generation_used | none |
| fallback_applied | no |

## Production (shippable phases — required)

| Field | Value |
|-------|-------|
| production_status | skipped |
| production_paths | none |
| wire_owner | none |
| wire_notes | n/a |
| skip_reason | Outlines only; no Layer B; explore, no store |

## SDK correlation (optional)

| Field | Value |
|-------|-------|
| sdk_runtime | n/a |
| sdk_agent_id | n/a |
| sdk_run_id | n/a |
| sdk_request_id | n/a |

## Decisions

- One chat thread. One web app: PWA + Capacitor wrap (iOS+Android). Not three products. Not iOS-only.
- No App Store / Play / live pages this pass.
- CTA system: Home, How it works, Pricing, moment, refuse, paywall, zero-remaining.
- In-app paywall only after Lite complete (US-07).
- Claims 1/2/3 + AC-04.1. A5 unnamed (no Cesar / PetGPT).
- $12 / $99 · 60 Flash. Never $9.99. Harm-per-wrong-fire.
- Holding line unchanged.

## Asks for manager (`ask_manager`)

- Peer help needed: none
- Clarification needed: none

## Risks / blockers

- Store-download CTAs this pass.
- "iPhone app" or native-vs-web leftover in headlines.
- Auto-refuse promise on freeze / whale-eye / stare.
- Paywall card before Lite complete.
- Fake expert while A5 is OPEN.

## Packs used

| Pack | Decision tied to pack |
|------|------------------------|
| `skills/community/marketingskills/product-marketing/` | Claims tiers inherit Phase 3 context; this file maps them onto thread cards + the marketing trio. |
| `skills/community/advertising-skills/skills/foundations/offer-extraction/` | Paywall CTA stays 60 honest reads + a hard stop; K1 kill remains inside the offer. |
| `skills/community/marketingskills/marketing-psychology/` | Hero CTA is the scare (Fogg prompt), not a store badge; one product, not a three-SKU paradox. |
| `skills/org/packs/standing-context/buying-psychology/` | $12 disclosed with 60 in the same viewport; no fake store social proof this pass. |

## Do not

- Mark the phase complete
- Write `13-copy-foundation.md` or Copy Chief headlines
- Spawn other positions
- Promise a store listing this pass
- Write three SKUs or native vs web
- Flatten A+C or A5 into a lock
- Copy artifacts to OneDrive / iCloud / Google Drive
