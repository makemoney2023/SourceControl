---
phase: "12"
manager: creative-director
ics_spawned: [web-designer]
status: ready_for_verifier
recommendation: approve
llm_tier: creative-language
llm_model: composer-2.5
generation_profile: none
generation_used: none
fallback_applied: false
production_status: skipped
skip_reason: explore · outlines only · no store
design_brief_path: docs/projects/telltail/business-idea/12-web-design.md#design-brief-required-before-production
photoreal_qa: ""
wire_owner: none
---

# Manager brief — Telltail web design — Phase 12

## Operator brief (plain English)

Web Designer mapped PRD + GTM onto an outline and skipped Layer B honestly (no design-system folder, no stills). I merged that, then rewrote the app chrome for the founder lock: the product is one chat thread, not a capture dashboard or a lesson map. Marketing may be Home / How it works / Pricing. Phase 12 is not marked complete.

## What we found

- Founder lock is on disk: in-app `/` **is** the thread. Capture, read, refuse, moment card, and the post-Lite paywall are **in-thread** objects. History is prior threads. `/capture` `/card/:id` `/refuse/:id` are not primary destinations. **[F]**
- Tokens unchanged from Phase 11. Sign `#B5522A` is shadcn `primary`. No safety-green token. **[F]**
- Brand-designer not spawned: tokens already locked; no imagery lease; no colliding stills path. **[A]** CD
- Honest skip: no `design-system/telltail/` at repo root or under `business-idea/`. `generation_used: none`. `wire_owner: none`.
- Holding line unchanged. `$12/mo` / `$99/yr` · 60. Never `$9.99`. No store / no paid.

## Next steps

1. **Verifier** — confirm no DS folder, no stills, brief present, Sign not green, thread (not lesson map) is the product chrome. Write `HANDOFFS/12-verifier.md` only.
2. **CEO / Orchestrator** — after verifier: review `12-web-design.md` + this brief. Do **not** mark Phase 12 complete. Do **not** open store / paid / a live site.
3. **Later persist** — copy the embedded Design brief into repo-root `design-system/telltail/` only when Layer B is leased. Do not mkdir empty files.

## Summary

- Layer A IA merged + chat-UI rewrite. Recommendation **approve** the outline + honest skip.
- Marketing trio: Home / How it works / Pricing. Harvest `/vs-dog-translator` stays off home.
- Product moment is a thread with cards inside it.
- No fake design system. No live URL.
- Phase 12 is **not** marked complete.

## IC handoffs merged

| IC | Handoff path | Status | llm_tier | generation_used |
|----|--------------|--------|----------|-----------------|
| `web-designer` | `HANDOFFS/12-web-designer.md` | done / ready_to_merge (app chrome rewritten on merge) | strong-general | none |

## Model routing check

- [x] Web Designer packet had `llm_tier: strong-general` / `composer-2.5` / `generation_profile: brand-stills`
- [x] `generation_used: none` / `fallback_applied: false` / skip_reason present
- [x] This brief: creative-language / composer-2.5 / `generation_profile: none`
- [x] Brand-designer not leased (tokens already in 11; no stills)

## Conflicts resolved

- First IC draft used sibling app routes. The on-disk file now maps A–I to in-thread message/card types. I accepted that supersede and stamped CD-merged. Tokens, skip, and marketing trio kept.

## Artifacts for C-suite review

| Path | Scorecard check |
|------|-----------------|
| `docs/projects/telltail/business-idea/12-web-design.md` | IA + token map + embedded Design brief; CD-merged; thread lock |
| `docs/projects/telltail/business-idea/HANDOFFS/12-web-designer.md` | IC + production_status skipped |
| `docs/projects/telltail/business-idea/HANDOFFS/12-manager-creative-director.md` | This brief |
| `design-system/telltail/` | **Not created** (honest skip) |

Canonical Mac: `/Users/cbsuperpatch/Desktop/ClaudeSkills/docs/projects/telltail/business-idea/` (local only, no OneDrive).

## Production check (shippable phases)

| Field | Value |
|-------|-------|
| production_status (merged) | skipped |
| Layer B paths | none — no DS folder, no UI stills, no 3D |
| design_brief_path | `12-web-design.md` → Design brief section |
| photoreal_qa | empty (no stills) |
| wire_owner | none |
| skip_reason | explore · outlines only · no store |

Reject gate applied: missing `production_status` would have been sent back. Empty-folder complete not claimed.

## Escalation tags

- none. `brand→CD` is ownership. Founder chat-UI lock is recorded, not an open fight.

## Asks for C-suite

- Approve the **outline + honest skip**. Do **not** approve Phase 12 as complete.
- Treat the one-thread product chrome as locked. Do not reopen a lesson map.
- Do not treat missing `design-system/telltail/` as a hole — the skip was in the packet.
- After verifier pass, a later persist pass may write repo-root DS from the embedded brief.

## Recommendation

**approve** — Layer A + chat-UI rewrite as-is; Layer B skip is honest. Await verifier, then C-suite. Do not mark the phase complete.
