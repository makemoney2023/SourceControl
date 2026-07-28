---
phase: "11-b"
manager: creative-director
ics_spawned: [brand-designer]
status: ready_for_csuite
recommendation: approve
llm_tier: creative-language
llm_model: grok-4.5
generation_profile: brand-visual
generation_used: none
fallback_applied: false
---

# Manager brief — Black/Tan Brand Reopen — Phase 11-b

## In plain English

We remapped the Blacksage visual system to **black and rich tan** (ADRK-aligned) after the operator locked Option B. The site now defaults to a dark, high-contrast editorial look instead of light paper — without changing trust-first voice, navigation, or the “Begin your inquiry” path. A contained 3D Rottweiler hero is allowed next (Phase 12); a full scroll-3D website is still forbidden. This is ready for a yes/no C-suite gate before web design.

## What we found

- Operator Option B requires dark ground + tan accents; light-paper `#FAFAF8` as page default is superseded (retained only for photo mats / form inputs).
- Locked tokens: ground `#0E0E0E`, elevated `#161616` / `#1C1C1E`, proof band `#141414`, tan `#C4A35A` / hover `#A67C52`, text `#F5F2EB`.
- Primary CTA must use **dark text on tan fill** — white-on-tan fails WCAG AA.
- Voice, Libre Baskerville + Source Sans 3, IA, Packages A–C, and D2 proof-before-inquire are unchanged.
- Hero WebGL is presence only: contained island, editorial lighting, no gamer neon; natural undocked tail preferred.

## Next steps

1. **C-suite** — yes/no on `11-brand-system.md` (Option B color system).
2. **web-designer (Phase 12)** — dark theme + contained hero WebGL slot + static/`prefers-reduced-motion` fallback; keep D2 proof band above fold.
3. **Operator** — confirm commercial 3D asset budget / license (still open from Phase 22); undocked-tail assumed yes.

## Summary

- Phase 11-b reopen complete: black/tan tokens, CSS vars, Tailwind map, WCAG notes merged into `11-brand-system.md`.
- IC `brand-designer` handoff merged; no peer conflicts.
- Scroll-3D / Mode E still rejected; narrow SD4 hero exception documented for Phase 12.
- RUNBOOK **not** marked complete — awaiting C-suite gate.

## IC handoffs merged

| IC | Handoff path | Status | llm_tier | generation_used |
|----|--------------|--------|----------|-----------------|
| `brand-designer` | `HANDOFFS/11b-brand-designer.md` | done / ready_to_merge | creative-language | none |

## Model routing check

- [x] Every IC packet had `llm_tier`
- [x] Creative IC used `generation_profile: brand-stills` (generation skipped — no API keys; prompts documented)
- [x] Fallbacks recorded (`fallback_applied: false`)
- [x] Manager: `llm_tier: creative-language`, `llm_model: grok-4.5`, `generation_profile: brand-visual`, `generation_used: none`

## Conflicts resolved

- none — IC picks align with CEO proposed ranges; CD accepted ground `#0E0E0E` and tan `#C4A35A`/`#A67C52` with CTA contrast rule

## Artifacts for C-suite review

| Path | Scorecard check |
|------|-----------------|
| `docs/projects/blacksage-kennels/business-idea/11-brand-system.md` | Option B supersede; tokens; CSS/Tailwind; D2 preserved; hero material; undocked tail |
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/11b-brand-designer.md` | IC craft source |
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/11b-manager-creative-director.md` | This brief |

## Escalation tags

- none (scope brand; spend on 3D asset remains operator/CTO diligence — not blocking this brand gate)

## Asks for C-suite

- **Approve** Phase 11-b black/tan system so Phase 12 can design the dark hero + WebGL island?
- Confirm undocked-tail remains hard yes (CEO assumed yes).
- Asset budget still open — do not block brand approve; gate purchase before Phase 9 asset commit.

## Recommendation

**approve** — ship Phase 11-b brand artifacts as-is; sequence Phase 12 web design (hero WebGL composition) after C-suite yes. Do **not** mark RUNBOOK ✅ until orchestrator + C-suite gate.

### Token table (quick reference)

| Role | Hex |
|------|-----|
| Ground | `#0E0E0E` |
| Elevated / cards | `#161616` / `#1C1C1E` |
| Proof band | `#141414` |
| Text primary | `#F5F2EB` |
| Tan / hover | `#C4A35A` / `#A67C52` |
| Sage (badges) | `#7A8F7E` |
| CTA text on tan | `#0E0E0E` |
| Paper legacy | `#FAFAF8` (photo/form only) |
