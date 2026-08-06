# 09 Build Log — Blacksage Kennels MVP (Rebuild)

**Phase:** 9 / 9-R — Software MVP + Skill-Max cinema delta  
**Status:** Skill-Max craft approved; soft-launch gated on operator facts  
**Last updated:** 2026-07-27  
**Owner:** cto (tech-lead IC implementation)

---

## Skill-Max / Option C delta (current — 2026-07-27)

**Supersedes** the light-paper / “Zero Three.js” summary below for *current* product expression. Historical rebuild narrative retained for audit.

| Item | Current |
|------|---------|
| Home | `HomeScrollStage` → `CinemaDocumentaryHome` default; WebGL only with licensed GLB |
| Theme | Void `#070707` · tan `#C4A35A` · Fraunces + Manrope |
| Copy | `lib/home-scroll-story.ts` = Phase 14 kennel substance |
| Locks | D2 Hybrid · SD4-C · CTA Begin your inquiry |
| Handoffs | `HANDOFFS/9r-tech-lead.md`, `9r-csuite-review.md` |
| Launch | `OPERATOR-LAUNCH-BLOCKERS.md` |

---

## Summary (trust-first rebuild — historical baseline)

Phase 9 **rebuilt** `apps/blacksage-kennels` from scratch as a trust-first, multi-page Next.js 15 App Router site. v1 (scroll-3D / R3F cinematic landing + `/apply`) was **replaced**, not patched. The rebuild established five Must routes, Package A/B inquire, and `/apply` → `/inquire`. Later Option B/C/Skill-Max reopened craft while keeping Hybrid IA — see delta above.

---

## Rebuild vs v1

| Aspect | v1 (deprecated) | v2 (current) |
|--------|-----------------|--------------|
| Strategy | Cinematic scroll narrative | D2 trust-first — evidence before inquire |
| Homepage | R3F canvas + scroll progress | Proof summary band + positioning prose |
| Routes | `/`, `/apply` | `/`, `/dogs`, `/health`, `/about`, `/inquire` |
| Theme | Dark cinematic default | Editorial light paper `#FAFAF8` |
| 3D | `@react-three/fiber`, `three`, `@react-three/drei` | **Removed** |
| Motion | Framer Motion scroll reveals | Static-first RSC; no scroll-jacking |
| Copy source | `14-pages/homepage.md`, `apply.md` | `14-pages/home.md` … `inquire.md` |
| CTA | Apply-first hero | **Begin your inquiry** (tertiary on home) |
| Tests | 8 (apply-schema only) | 13 (nav, routes, redirect, inquire-schema) |

**Deleted v1 artifacts:** `components/three/*`, scroll sections (Heritage, Structure, Temperament, Trust, ApplyCta), `app/apply/page.tsx`, `apply-schema*`, motion/scroll hooks.

---

## What shipped

### Project

| Item | Detail |
|------|--------|
| Path | `apps/blacksage-kennels/` |
| Framework | Next.js 15.5.22 App Router + TypeScript + Tailwind CSS v4 |
| UI | shadcn/ui (Button, Form, Input, Textarea, Select, Label, Checkbox) |
| Fonts | Cormorant Garamond (display) + Source Sans 3 (body/UI) via `next/font/google` |
| Theme | Editorial light; paper `#FAFAF8`; charcoal text; amber accent `#C4A574` |
| Validation | Zod + react-hook-form; Package A/B schemas in `inquire-schema.ts` |
| Tests | Vitest — 13 tests across 4 files |
| Package toggle | `NEXT_PUBLIC_INQUIRE_PACKAGE=A\|B` (default A) |

### Routes

| Route | Features |
|-------|----------|
| `/` | Proof summary band (4 cells); positioning prose; education + about teasers; tertiary inquire band — **no hero CTA** |
| `/dogs` | Tier 1 empty state; honest “profiles coming soon” copy |
| `/health` | Standards, testing, temperament, placement sections with anchor IDs |
| `/about` | Program principles, operator gap placeholder, contact placeholder |
| `/inquire` | Package A/B mode header; full inquiry form; mailto submit stub |
| `/apply` | **301 permanent redirect** → `/inquire` (`next.config.ts`) |

### Key files

```
apps/blacksage-kennels/
├── app/
│   ├── layout.tsx              # light theme, shared header/footer
│   ├── page.tsx                # home — proof band + teasers
│   ├── dogs/page.tsx
│   ├── health/page.tsx
│   ├── about/page.tsx
│   ├── inquire/page.tsx        # form shell + Package A/B
│   └── globals.css             # editorial light tokens
├── components/
│   ├── layout/                 # SiteHeader, SiteFooter, SkipLink
│   ├── proof/ProofSummaryBand.tsx
│   ├── content/PageHero.tsx
│   ├── inquire/                # InquiryForm, PackageModeHeader, InquiryConfirmation
│   └── ui/                     # shadcn primitives + checkbox
├── lib/
│   ├── nav.ts + nav.test.ts
│   ├── content/page-meta.ts + page-meta.test.ts
│   ├── site-config.ts          # Package A/B copy
│   ├── constants.ts            # placeholders, proof band, principles
│   ├── validations/inquire-schema.ts + .test.ts
│   └── redirect.test.ts        # /apply → /inquire config
└── next.config.ts              # permanent redirect
```

---

## How to run

```bash
cd apps/blacksage-kennels
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build |
| `npm test` | Vitest unit tests |
| `npm run lint` | ESLint |

### Environment (optional)

| Variable | Values | Default | Effect |
|----------|--------|---------|--------|
| `NEXT_PUBLIC_INQUIRE_PACKAGE` | `A` \| `B` | `A` | Package A = interest list; Package B = waitlist + deposit acknowledgment |

---

## Verification (CTO independent run — 2026-07-27)

### Tests

```
> vitest run
Test Files  4 passed (4)
     Tests  13 passed (13)
```

Coverage: nav order (5 links), page H1/meta per route, `/apply` redirect config, inquire-schema Package A/B validation.

### Build

```
> next build --turbopack
Exit code: 0

Route (app)                         Size  First Load JS
┌ ○ /                                0 B         127 kB
├ ○ /about                           0 B         127 kB
├ ○ /dogs                            0 B         127 kB
├ ○ /health                          0 B         127 kB
└ ○ /inquire                      115 kB         242 kB
```

No Three.js/R3F chunks in bundle. Landing pages ~127 kB First Load JS (down from ~177 kB v1 with R3F).

### Dependency audit

`package.json` — **no** `three`, `@react-three/fiber`, `@react-three/drei`, `framer-motion`, or `@types/three`. Grep across source: zero matches.

---

## TDD evidence

1. **RED:** Tests for `nav.ts`, `page-meta.ts`, `next.config` redirect, and `inquire-schema.ts` written before full page implementation.
2. **GREEN:** Minimal lib + page code to pass; 13/13 green.
3. **Verify:** CTO re-ran `npm test` + `npm run build` after IC handoff — still green.

---

## Acceptance criteria checklist

| Criterion | Status |
|-----------|--------|
| All Must routes render with approved copy structure | ✅ |
| No R3F/Three.js in package.json or imports | ✅ |
| `/apply` → `/inquire` permanent redirect | ✅ |
| Proof band + **Begin your inquiry** CTA language | ✅ |
| Tests pass for nav/routes/form/redirect smoke | ✅ (13/13) |
| `npm run build` succeeds | ✅ |
| Editorial light paper `#FAFAF8` default | ✅ |
| Package A/B form language on `/inquire` | ✅ |
| Placeholders preserved — no invented prices/certs/litters | ✅ |
| shadcn/ui + Tailwind + App Router | ✅ |

---

## Known gaps (pre-launch)

| Gap | Owner | Notes |
|-----|-------|-------|
| Operator contact placeholders | Operator | `[CONTACT_EMAIL]`, `[LOCATION]`, `[CONTACT_PHONE]` in `lib/constants.ts` |
| Health test specifics | Operator | `[HEALTH_TESTS]` placeholder in copy |
| Form backend | Phase 10+ / Q7 | mailto stub only — no API route or CRM yet |
| Real kennel photography | Operator | Tier badges / honest empty states only |
| Logo SVG / favicon | Operator / Phase 14 | Typography wordmark only |
| Mobile nav Sheet | Polish | Below `md`, nav may need hamburger Sheet |
| README.md | CTO polish | May still reference v1 `/apply` route |
| `/dogs/[slug]` | Operator inventory | Omitted until verified dog profiles exist |
| `/litters` | Q1-gated | Omitted per IA locks |

---

## Option B delta (Phase 9-b — 2026-07-27)

**Scope:** Dark editorial theme + contained HeroIsland (poster-first, lazy R3F). D2 IA, proof band, routes, inquire CTA, analytics, and SEO unchanged. No scroll-jacking.

### What changed from light editorial → Option B

| Aspect | Phase 9 (light) | Phase 9-b (Option B) |
|--------|-----------------|----------------------|
| Default theme | Paper `#FAFAF8`, charcoal text | Ground `#0E0E0E`, tan accent `#C4A35A`, text `#F5F2EB` |
| Display font | Cormorant Garamond | Libre Baskerville |
| Homepage hero | `PageHero` text only | `HomeHero` — wordmark, h1, subhead, text CTAs + `HeroIsland` |
| Proof band | Inline white cards | `#141414` band, tan top rule, `#1C1C1E` cells |
| Hero 3D | None | Lazy `@react-three/fiber` island (~50vh), idle orbit ≤0.15 rad |
| CTA buttons | Tan fill + light text | Tan fill + **dark** text `#0E0E0E` (brand lock) |
| Three.js | Removed | `three` + `@react-three/fiber` — **home hero chunk only** |

### HeroIsland render logic

1. **SSR / first paint:** `HeroIslandFallback` poster (LCP candidate) at fixed ~50vh slot — no layout shift.
2. **Client upgrade:** If `!prefers-reduced-motion` && WebGL available && `!NEXT_PUBLIC_REDUCE_3D` → dynamic import `HeroIslandCanvas` (geometric stand-in when GLB absent).
3. **On failure / gate:** Remain on poster fallback.

### Poster-first status

- **Poster:** `public/images/hero-rottweiler-fallback.svg` (dark gradient + silhouette placeholder; replace with licensed `.webp` at same path when available).
- **GLB:** Expected at `public/models/hero-rottweiler.glb` — **not in repo**. Canvas runs **stand-in mesh** until licensed asset is dropped.

### Phase 9-c — threejs skill-pack pass (2026-07-27)

**Root cause:** OpenMontage `threejs-*` packs existed but were **not on** `tech-lead` / `cto` Skill packs tables — see `HANDOFFS/23-skill-pack-gap-audit.md`.

**Skills loaded this pass:** threejs-fundamentals, lighting, materials, loaders, interaction, geometry; vercel-react-best-practices (dynamic island already in place).

| Change | Detail |
|--------|--------|
| `lib/hero-scene.ts` | Testable lighting / camera / fog / orbit / materials SSOT |
| Lighting | Hemisphere + key (tan) + fill + rim; low ambient; ACES + soft shadows |
| Stand-in | Capsule/sphere silhouette, brand coat/tan PBR, undocked tail |
| Orbit | `IdleOrbit` — damping rotate + autoRotate; **zoom/pan off** (no scroll fight) |
| GLB load | Single scene attach (no per-frame `clone`); cast/receive shadows |
| Label | Stand-in badge only when `data-hero-asset=stand-in` |

```
npm test → 59 passed (15 files)
```

### Drop in licensed GLB

```bash
# 1. Place licensed model
cp /path/to/licensed-hero.glb apps/blacksage-kennels/public/models/hero-rottweiler.glb

# 2. Optional: set env to skip HEAD probe (or rely on automatic HEAD check)
# NEXT_PUBLIC_HERO_GLB_READY=true

# 3. Optional: replace poster for LCP
cp /path/to/hero-rottweiler-fallback.webp apps/blacksage-kennels/public/images/
# Update HERO_POSTER_PATH in lib/hero-island.ts if switching to .webp
```

### Environment flags (documented in `lib/site-config.ts`)

| Variable | Values | Default | Effect |
|----------|--------|---------|--------|
| `NEXT_PUBLIC_REDUCE_3D` | `true` \| `1` | unset | Force poster fallback; disables WebGL hero upgrade |
| `NEXT_PUBLIC_HERO_GLB_READY` | `true` \| `1` | unset | Skip HEAD probe after GLB drop (optional) |
| `NEXT_PUBLIC_INQUIRE_PACKAGE` | `A` \| `B` | `A` | Unchanged — Package A/B form mode |

### New / updated files

```
apps/blacksage-kennels/
├── app/globals.css                 # Option B dark tokens + shadcn mapping
├── app/layout.tsx                  # Libre Baskerville + dark body classes
├── app/page.tsx                    # HomeHero + proof band below hero
├── components/home/HomeHero.tsx
├── components/three/
│   ├── HeroIsland.tsx              # Client boundary + dynamic import
│   ├── HeroIslandCanvas.tsx        # R3F — idle orbit, fog #0A0A0A
│   └── HeroIslandFallback.tsx      # Poster LCP
├── hooks/usePrefersReducedMotion.ts
├── hooks/useHeroWebGL.ts
├── lib/hero-webgl.ts               # shouldEnableWebGL(), detectWebGL()
├── lib/hero-island.ts              # resolveHeroDisplayMode()
├── lib/site-config.ts              # THEME_TOKENS, SITE_ENV_DOCS
├── public/images/hero-rottweiler-fallback.svg
└── lib/*.test.ts                   # theme, hero-webgl, hero-island tests
```

### Verification (Phase 9-b — 2026-07-27)

```
npm test
Test Files  14 passed (14)
     Tests  50 passed (50)

npm run build
Exit code: 0
Route / First Load JS: 139 kB (hero client chunk lazy; other routes ~131 kB)
Three.js NOT in shared critical path for /dogs, /health, /about, /inquire
```

**TDD:** Tests written first for `THEME_TOKENS`, `shouldEnableWebGL()`, `resolveHeroDisplayMode()` before implementation.

---

## Option C delta (Phase 9-d — 2026-07-27)

**Scope:** Scroll-driven cinematic homepage (1A) + Hybrid D2. Supersedes Option B contained hero island on `/`. Secondary routes unchanged.

| Aspect | Option B | Option C (9d) |
|--------|----------|---------------|
| Home | Contained HeroIsland ~50vh | Full-viewport `HomeScrollStage` + `ScrollControls` (5 pages) |
| Proof | Below hero | Mid-scroll HTML chapter (`proof`) |
| Fallback | Poster island | `HomeScrollFallback` stacked chapters |
| Deps | fiber + three | + `@react-three/drei` |

### Key files

```
components/home/HomeScrollStage.tsx
components/home/HomeScrollFallback.tsx
components/three/HomeScrollCanvas.tsx
components/three/HomeScrollOverlays.tsx
components/three/HomeScrollSubject.tsx
components/three/HomeScrollCameraRig.tsx
components/three/HomeScrollLights.tsx
lib/home-scroll-story.ts (+ tests)
app/page.tsx → HomeScrollStage only
```

### Verification

```
npm test → 64 passed (16 files)
npm run build → OK · / First Load JS ~135 kB (drei/fiber lazy); other routes ~130 kB
```

---

## IC handoff

- `HANDOFFS/9-tech-lead.md` — Phase 9 MVP rebuild IC deliverable
- `HANDOFFS/9b-tech-lead.md` — Phase 9-b Option B delta IC deliverable
- `HANDOFFS/9d-tech-lead.md` — Phase 9-d Option C scroll home
- `HANDOFFS/9-manager-cto.md` — CTO manager brief for C-suite

---

## Sources

- `05-prd.md` — product requirements
- `11-brand-system.md` — tokens, typography
- `12-web-design.md` — IA, component inventory, anti-patterns (SD4 no 3D)
- `13-copy-foundation.md` — voice, validation copy, Package A/B language
- `14-pages/home.md`, `dogs.md`, `health.md`, `about.md`, `inquire.md` — locked page copy (Phase 14 REDO)
- `HANDOFFS/14-csuite-review.md` — C-suite approval context
