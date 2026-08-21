---
phase: "11"
manager: creative-director
ics_spawned: [brand-designer]
status: ready_for_verifier
recommendation: approve
llm_tier: creative-language
llm_model: composer-2.5
generation_profile: none
generation_used: none
fallback_applied: false
production_status: skipped
skip_reason: explore · outlines only · no store / no paid
design_brief_path: docs/projects/telltail/business-idea/11-brand/design/telltail-design-brief.md
photoreal_qa: ""
wire_owner: none
---

# Manager brief — Telltail brand system — Phase 11

## Operator brief (plain English)

Brand Designer locked Layer A tokens and the two card motifs. I merged them as the brand SSOT. Stills are an honest skip — explore, outlines only, no store / no paid — so `11-brand/assets/` is empty on purpose and the design brief already has FLUX-positive hero prose for a later lease. Phase 12 can draw from this file without inventing a second palette. I am not marking Phase 11 complete.

## What we found

- Look lock accepted: Ink `#1A1814` / Paper `#F6F2E9` / Sign `#B5522A` (not safety green, not kennel gold) / Refuse `#6B2C28`. Display = Newsreader; UI = IBM Plex Sans; meter = IBM Plex Mono. **[A]** this-pass craft
- Holding line unchanged. Trainer-not-toy. Lifestyle + Education if a store ever exists. Never Entertainment. **[F]**
- Kids leftover stays a product refuse, not a “no kids ever” brand. A5 unnamed — no Cesar, no PetGPT face. **[F]**
- Reject gate applied: `production_status: skipped` + three-part reason; no Layer B files; Cursor gen not claimed complete.
- SKU on any later surface stays `$12/mo` / `$99/yr` · 60 Flash. Never `$9.99`. Never “what serious apps do.” **[F]**

## Next steps

1. **Verifier** — confirm empty `11-brand/assets/`, design brief on disk, holding line intact, no false-complete. Write `HANDOFFS/11-verifier.md` only.
2. **CEO / Orchestrator** — after verifier: review `11-brand-system.md` + this brief. Do **not** mark Phase 11 complete. Do **not** open store / paid.
3. **Phase 12 (later)** — web-designer consumes tokens + moment/refuse motifs. Brand-stills render only from `telltail-design-brief.md` with photoreal QA.

## Summary

- Layer A brand SSOT merged. Recommendation **approve** the outlines + honest stills skip.
- Sign is burnt sienna; refuse is oxblood. No Traini sticker system.
- Design brief exists so design-before-production is not a later excuse.
- No store. No paid. Explore only.
- Phase 11 is **not** marked complete.

## IC handoffs merged

| IC | Handoff path | Status | llm_tier | generation_used |
|----|--------------|--------|----------|-----------------|
| `brand-designer` | `HANDOFFS/11-brand-designer.md` | done / ready_to_merge | strong-general | none |

## Model routing check

- [x] Brand Designer packet had `llm_tier: strong-general` / `composer-2.5` / `generation_profile: brand-stills`
- [x] `generation_used: none` / `fallback_applied: false` / skip_reason present
- [x] This brief: creative-language / composer-2.5 / `generation_profile: none`
- [x] No Plane B render this pass

## Conflicts resolved

- none. Single IC. I accepted the skip (brief written, assets empty, no complete claimed). Palette roles and kids leftover framing accepted as written.

## Artifacts for C-suite review

| Path | Scorecard check |
|------|-----------------|
| `docs/projects/telltail/business-idea/11-brand-system.md` | Brand system documented; CD-merged; stills skip + F/I/A |
| `docs/projects/telltail/business-idea/11-brand/design/telltail-design-brief.md` | Design brief before any later render |
| `docs/projects/telltail/business-idea/11-brand/assets/` | Empty on purpose |
| `docs/projects/telltail/business-idea/HANDOFFS/11-brand-designer.md` | IC + production_status skipped |
| `docs/projects/telltail/business-idea/HANDOFFS/11-manager-creative-director.md` | This brief |

Canonical Mac: `/Users/cbsuperpatch/Desktop/ClaudeSkills/docs/projects/telltail/business-idea/` (local only, no OneDrive).

## Production check (shippable phases)

| Field | Value |
|-------|-------|
| production_status (merged) | skipped |
| Layer B paths | none — `11-brand/assets/` empty |
| design_brief_path | `docs/projects/telltail/business-idea/11-brand/design/telltail-design-brief.md` |
| photoreal_qa | empty (no stills) |
| wire_owner | none |
| skip_reason | explore · outlines only · no store / no paid |

Reject gate applied: missing `production_status` would have been sent back. False-complete (MD-as-stills / Cursor gen) not claimed.

## Escalation tags

- none. `brand→CD` is ownership, not a fight. Name collision and A5 stay open as already-logged leftovers.

## Asks for C-suite

- Approve the **Layer A system + honest stills skip**. Do **not** approve Phase 11 as complete.
- Do not treat empty assets as a missing deliverable — the skip was in the packet.
- Do not invert Sign into a safety green or open store/paid from this file.
- After verifier pass, Phase 12 may consume tokens. Render stills only on a later brand-stills lease.

## Recommendation

**approve** — Layer A + design brief as-is; stills skip is honest. Await verifier, then C-suite. Do not mark the phase complete.
