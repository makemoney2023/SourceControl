---
phase: "9-b"
position: tech-lead
reports_to: cto
status: done
verdict_for_manager: ready_to_merge
llm_tier: coding-agent
llm_model: composer-2.5-fast
generation_profile: none
generation_used: none
fallback_applied: false
---

# Handoff — Phase 9-b Option B Build Delta → CTO

## Goal (from context packet)

Implement Option B in `apps/blacksage-kennels`: dark brand tokens from `11-brand-system`, contained HeroIsland with lazy R3F + poster fallback + prefers-reduced-motion gates, poster-first until licensed GLB, TDD, build log update. Preserve D2 IA, proof band, routes, inquire CTA, analytics, SEO. No scroll-jacking. Three.js only in lazy hero chunk.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `apps/blacksage-kennels/app/globals.css` | Full Option B dark tokens; shadcn + Tailwind `blacksage.*` mapping; legacy aliases for migration |
| `apps/blacksage-kennels/app/layout.tsx` | Libre Baskerville + Source Sans 3; dark body classes |
| `apps/blacksage-kennels/app/page.tsx` | `HomeHero` + proof band below hero; content sections dark-themed |
| `apps/blacksage-kennels/components/home/HomeHero.tsx` | Wordmark, h1, subhead, text CTAs to `/dogs` + `/health` only |
| `apps/blacksage-kennels/components/three/HeroIsland.tsx` | Client boundary; dynamic import canvas |
| `apps/blacksage-kennels/components/three/HeroIslandCanvas.tsx` | R3F fog `#0A0A0A`, idle orbit ≤0.15 rad, GLTFLoader |
| `apps/blacksage-kennels/components/three/HeroIslandFallback.tsx` | Poster LCP at fixed ~50vh |
| `apps/blacksage-kennels/hooks/usePrefersReducedMotion.ts` | Media query hook |
| `apps/blacksage-kennels/hooks/useHeroWebGL.ts` | Composes gates + HEAD probe for GLB |
| `apps/blacksage-kennels/lib/hero-webgl.ts` | `shouldEnableWebGL()`, `detectWebGL()`, `checkHeroModelAvailable()` |
| `apps/blacksage-kennels/lib/hero-island.ts` | `resolveHeroDisplayMode()`, poster path constants |
| `apps/blacksage-kennels/lib/site-config.ts` | `THEME_TOKENS`, `SITE_ENV_DOCS` (+ `NEXT_PUBLIC_REDUCE_3D`, `NEXT_PUBLIC_HERO_GLB_READY`) |
| `apps/blacksage-kennels/lib/theme-tokens.test.ts` | Theme smoke tests (TDD) |
| `apps/blacksage-kennels/lib/hero-webgl.test.ts` | WebGL gate tests (TDD) |
| `apps/blacksage-kennels/lib/hero-island.test.ts` | Poster vs canvas resolution tests (TDD) |
| `apps/blacksage-kennels/public/images/hero-rottweiler-fallback.svg` | Dark gradient poster placeholder |
| `apps/blacksage-kennels/package.json` | Added `three`, `@react-three/fiber`, `@types/three` |
| `apps/blacksage-kennels/components/layout/*` | SiteHeader, SiteFooter, SkipLink — dark theme |
| `apps/blacksage-kennels/components/proof/ProofSummaryBand.tsx` | Dark proof band styling |
| `apps/blacksage-kennels/components/analytics/ProofBandTracker.tsx` | Dark cells; analytics preserved |
| `apps/blacksage-kennels/components/content/PageHero.tsx` | Dark typography |
| `apps/blacksage-kennels/components/ui/*` | Button (tan + dark CTA text), inputs, select, checkbox |
| `apps/blacksage-kennels/app/{dogs,health,about,inquire}/page.tsx` | Dark surface tokens |
| `apps/blacksage-kennels/components/inquire/*` | Dark form surfaces |
| `docs/projects/blacksage-kennels/business-idea/09-build-log.md` | Option B delta section appended |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | coding-agent |
| llm_model | composer-2.5-fast |
| generation_profile | none |
| generation_used | none |
| fallback_applied | no |

## Decisions

- **Poster-first:** Canvas upgrade requires licensed GLB at `public/models/hero-rottweiler.glb` (HEAD probe) or `NEXT_PUBLIC_HERO_GLB_READY=true`. No scraped/paid assets in repo.
- **Poster asset:** SVG gradient placeholder at `public/images/hero-rottweiler-fallback.svg` — operator may replace with licensed `.webp` and update `HERO_POSTER_PATH`.
- **Hero slot:** Fixed `h-[50vh] min-h-[280px] max-h-[520px]` — no layout shift between poster and canvas.
- **Orbit:** `sin(elapsed * 0.25) * 0.15` rad — idle only, no scroll coupling.
- **CTA lock:** Tan button fill uses `#0E0E0E` text per brand system — never white-on-tan.
- **Three.js scope:** `@react-three/fiber` dynamically imported from `HeroIsland` only; other routes ~131 kB First Load JS unchanged.
- **D2 preserved:** Proof band, nav, routes, inquire flow, analytics (`ProofBandTracker`, `TrackedLink`), SEO metadata untouched in behavior.

## Test results

```
npm test
 Test Files  14 passed (14)
      Tests  50 passed (50)

npm run build
 ✓ Compiled successfully
 Route / First Load JS: 139 kB (hero lazy chunk)
 Other routes: ~131 kB (no Three.js in critical path)
```

New tests: `theme-tokens.test.ts` (3), `hero-webgl.test.ts` (8), `hero-island.test.ts` (3). All prior nav/routes/redirect/inquire-schema/analytics/seo tests still pass.

## GLB status

| Asset | Status |
|-------|--------|
| Poster | **SVG placeholder** in repo — LCP candidate active |
| `hero-rottweiler.glb` | **Not in repo** — poster-first; canvas gated until licensed drop-in |

## Acceptance checklist

- [x] Option B dark tokens in `globals.css` + `site-config`
- [x] HomeHero + HeroIsland (poster SSR, lazy canvas gated)
- [x] No scroll-jacking / full-page R3F narrative
- [x] `prefers-reduced-motion` + `NEXT_PUBLIC_REDUCE_3D` gates
- [x] Proof band below hero with dark styling + analytics
- [x] Hero text CTAs to `/dogs` and `/health` only (no filled inquire in hero)
- [x] TDD tests for theme + WebGL gates + display mode
- [x] 50/50 tests pass; build green
- [x] `09-build-log.md` updated
- [x] RUNBOOK **not** marked complete

## Asks for manager (`ask_manager`)

- Peer help needed: none
- Clarification needed: none — operator must supply licensed GLB + optional `.webp` poster for production hero

## Risks / blockers

- **Licensed GLB missing:** Site runs poster-only (by design). Set `NEXT_PUBLIC_HERO_GLB_READY` or drop file to enable canvas.
- **HEAD probe on static export:** Works on Vercel/static hosting; if CDN blocks HEAD on `.glb`, use env flag.
- **Home bundle +7 kB:** Expected from hero client wrapper; Three.js loads only when all gates pass.

## Packs used

- `skills/plugins/superpowers/test-driven-development/` — RED/GREEN for theme + hero gates
- `skills/plugins/vercel/nextjs/` — dynamic import, App Router, static pages

## Do not

- Phase 9-b **not** marked complete in RUNBOOK-TRACKER (orchestrator + C-suite gate)
- No paid/scraped GLB assets added
- No scroll-linked 3D narrative
