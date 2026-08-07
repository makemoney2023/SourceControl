# Venture context

## Operator note

Mobile-first animated Income Stack presentation for new affiliates.

## Omni chain (2026-08-07)

Text-free Gemini Omni Flash heroes for the 3D scroll-stack website (site owns typography overlays).

- Spec: `docs/superpowers/specs/2026-08-07-income-stack-omni-chain-design.md`
- Plan: `docs/superpowers/plans/2026-08-07-income-stack-omni-chain.md`
- Assets: `apps/superpatch-income-stack/public/concepts/omni-chain/{16x9,9x16}/`
- Prompts: `.../omni-chain/prompts.json`
- Runner: `apps/superpatch-income-stack/scripts/omni-animate-plates.mjs`
- Existing Veo loops in `public/concepts/animated/` left untouched

## 3D scroll experience (2026-08-07)

Default app surface is `ExperienceShell` (layered DOM video + GSAP ScrollTrigger). Legacy `DeckShell` via `?view=legacy`.

- Spec: `docs/superpowers/specs/2026-08-07-income-stack-3d-experience-design.md`
- Plan: `docs/superpowers/plans/2026-08-07-income-stack-3d-experience.md`
- Media map: `apps/superpatch-income-stack/src/data/experienceMedia.ts`
- Posters: `public/concepts/omni-chain/posters/{16x9,9x16}/*.webp`
- Verify: `npm run verify:omni-assets` / `npm run test:e2e`

## Sources digest

<!-- auto:sources-digest -->

<!-- /auto:sources-digest -->
