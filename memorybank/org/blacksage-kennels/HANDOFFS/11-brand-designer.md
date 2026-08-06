---
phase: "11"
position: brand-designer
reports_to: creative-director
status: done
verdict_for_manager: ready_to_merge
llm_tier: strong-general
llm_model: composer-2.5
generation_profile: brand-stills
generation_used: none
fallback_applied: false
---

# Handoff — Phase 11 Brand System → creative-director

## Goal (from context packet)

Full replace of `11-brand-system.md` for Blacksage Kennels Phase 11. Trust-first kennel brand — evidence density, photography-forward, calm luxury, ADRK-aligned dignity. Reject v1 cinematic scroll-3D / R3F / WebGL as brand differentiator. Document v1 patterns as anti-patterns. Encode hard locks: D2, SD4, IA, `/inquire`, Packages A–C.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/blacksage-kennels/business-idea/11-brand-system.md` | Full replace — trust-first editorial light system; §10 v1 anti-patterns; §7 proof UI patterns; §12 FLUX prompts (gen skipped) |
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/11-brand-designer.md` | This file |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | strong-general |
| llm_model | composer-2.5 |
| generation_profile | brand-stills |
| generation_used | none — no FAL_KEY / INFSH_API_KEY in environment |
| fallback_applied | no |

## Decisions

- **Brand essence:** Evidence-led prestige replaces "power with nobility" as primary framing; tagline remains optional secondary.
- **Color default:** Editorial light (`#FAFAF8` paper) with charcoal/sage/tan accents — replaces v1 cinematic dark-first (`#0A0A0B` site-wide).
- **Typography:** Libre Baskerville + Source Sans 3 — editorial authority over cinematic display-only Cormorant-at-72px hero.
- **Logo:** Flat wordmark only; explicit ban on 3D watermark / scene integration.
- **Hero model:** Proof summary band + positioning — not scroll-3D stage, not wordmark-only full viewport.
- **IA visual:** Home → Dogs → Health/Education → About → Contact/Inquire; `/inquire` not `/apply`.
- **Proof UI vocabulary:** Defined OFA link cards, evidence grids, tier badges, dog cards, package mode indicators for Phase 12.
- **Motion:** Minimal functional transitions only; scroll-linked camera explicitly banned.
- **§10 v1 anti-patterns:** Table listing 13 rejected patterns from old 11-brand-system and v1 app with replacements.
- **FLUX:** Four new prompts aligned to editorial/photography direction; v1 "night kennel 3D" prompts rejected; generation skipped (no API keys).

## Asks for manager (`ask_manager`)

- Peer help needed: none
- Clarification needed: none — operator Q1/Q6/Q7 remain launch gates, not brand blockers; Tier 1 defaults documented

## Risks / blockers

- **Patch risk:** Phase 12 web-designer may inherit v1 Tailwind dark theme from `apps/blacksage-kennels` — §10 + §14 handoff explicitly warn against port.
- **Photography gap:** Light UI assumes eventual operator photos; placeholders defined but Tier 2 Dogs will look sparse until Q6.
- **Tagline:** "Power with nobility" demoted to optional; copy-chief may need operator preference before lock.

## Packs used

- `skills/community/ui-ux-pro-max-skill/brand/` (color, typography, voice references)
- `skills/community/visual-skills/image/` (FLUX prompt structure — prompts only, no render)

## Do not

- Mark the phase complete
- Write outside write_lease
- Spawn other positions
- Inherit parent model when MODEL-REGISTRY pins a different tier (esp. creative/legal)
