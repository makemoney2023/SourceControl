---
phase: "12"
position: web-designer
reports_to: creative-director
status: done
verdict_for_manager: ready_to_merge
llm_tier: strong-general
llm_model: composer-2.5-fast
generation_profile: brand-stills
generation_used: none
fallback_applied: false
---

# Handoff — Phase 12 Web Design → creative-director

## Goal (from context packet)

Full replace of `12-web-design.md` with a trust-first multi-page web design & IA spec. Reject v1 scroll-3D / R3F / apply-first patterns from prior spec and `apps/blacksage-kennels`. Encode locked IA, `/inquire` route, proof summary band hero, Packages A–B form modes, editorial light design system, and Phase 9 implementation guidance.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/blacksage-kennels/business-idea/12-web-design.md` | Full replace — multi-page IA, wireframes, design system, component inventory, anti-patterns table, Phase 9 checklist |
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/12-web-designer.md` | This file |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | strong-general |
| llm_model | composer-2.5-fast |
| generation_profile | brand-stills |
| generation_used | none — spec-only phase; no image generation required (no API keys) |
| fallback_applied | no |

## Decisions

- **Architecture:** Multi-page static-first Next.js App Router — **not** two-route scroll landing + apply.
- **Routes (Must):** `/`, `/dogs`, `/health`, `/about`, `/inquire`; optional `/litters` Q1-gated with nav omitted when brand-first.
- **Hero model:** ProofSummaryBand (4 cells from brand §7.1) above fold — **no** R3F canvas, no 200svh scroll hero, no "Scroll" prompt.
- **Nav order:** Home → Dogs → Health/Education → About → Contact/Inquire — replaces v1 Heritage/Structure/Temperament/Trust/Apply anchors.
- **Route naming:** `/inquire` locked; `/apply` rejected; optional `/education` → `/health` redirect documented.
- **CTA hierarchy:** Tertiary "Begin your inquiry" on Home; primary links to Dogs and Health in proof band and header.
- **Design system:** Editorial light paper default; Libre Baskerville + Source Sans 3; shadcn tokens mapped to brand §3 — **not** v1 dark cinematic theme.
- **Components:** Full inventory — ProofSummaryBand, EvidenceGrid, OfaLinkCard, TierBadge, DogCard, PlaceholderSlot, InquiryForm with PackageModeHeader A/B.
- **Package C:** Process copy on `/health#placement` only — no form variant v1.
- **Motion:** CSS transitions only; scroll-linked 3D and Framer scroll narratives banned; no 3D reduced-motion fallback needed.
- **Anti-patterns:** 15-row table mapping v1 `apps/blacksage-kennels` patterns to v2 replacements.
- **A11y:** WCAG 2.2 AA target (harmonized from PRD 2.1 note in Phase 10).

## Asks for manager (`ask_manager`)

- Peer help needed: none
- Clarification needed: none — Q1/Q2/Q6/Q7 remain operator launch gates; Tier 1 defaults sufficient for design lock

## Risks / blockers

- **Patch risk:** Phase 9 engineer may copy v1 `apps/blacksage-kennels` file tree — §Anti-patterns and build checklist explicitly forbid; new project required per SD7.
- **Words≠architecture:** Prior v1 used "Begin your inquiry" copy on `/apply` — spec locks route and nav to `/inquire`.
- **Sparse Tier 1:** Dogs and hero photo depend on Q6; PlaceholderSlot and empty states specified but site will look thin until operator assets.
- **Form backend:** Q7 blocks public launch; UI spec complete for staging.

## Packs used

- `11-brand-system.md` §3–8, §10, §14 (primary design input)
- `05-prd.md` (IA, form spec, NFR, failure layers)
- `10-strategy-review.md`, `03-strategy.md` (lock confirmation)
- `apps/blacksage-kennels` (anti-pattern audit — not ported)

## Do not

- Mark the phase complete
- Write outside write_lease
- Spawn other positions
- Inherit parent model when MODEL-REGISTRY pins a different tier (esp. creative/legal)
