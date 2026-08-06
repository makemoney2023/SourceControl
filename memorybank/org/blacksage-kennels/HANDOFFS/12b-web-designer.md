---
phase: "12-b"
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

# Handoff — Phase 12-b Option B Web Design → creative-director

## Goal (from context packet)

Spec Option B hero WebGL island web design for merge into `12-web-design.md`: black/tan surfaces from `11-brand-system.md` §3, contained Rottweiler WebGL hero (layout, loading, fallback, perf budget, model placement). Provide full mergeable sections; **do not** edit `12-web-design.md` directly.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/12b-web-designer.md` | This file — mergeable sections below for CD paste into `12-web-design.md` |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | strong-general |
| llm_model | composer-2.5-fast |
| generation_profile | brand-stills |
| generation_used | none — spec-only; no image/3D generation |
| fallback_applied | no |

## Decisions

- **Theme supersede:** Dark ground `#0E0E0E` + rich tan `#C4A35A` / `#A67C52` replaces editorial light-paper as site default. Light `#FAFAF8` retained only as `--color-paper-legacy` (photo mats, form input interiors).
- **SD4 narrow exception:** Contained hero WebGL island only — scroll-3D / full-page R3F / scroll-jacking remain **banned**.
- **Home hero model:** Split layout — brand wordmark + h1 + subhead + CTA group (left or stacked) + edge-to-edge WebGL visual plane within hero region; **no** detachable badges/chips/overlays on media.
- **Proof band:** Stays **below** hero (D2 trust-first); both visible without scroll on 1280×800 target.
- **Interaction:** Subtle idle orbit / breath only — **no** scroll-linked camera.
- **Loading:** Dynamic import Three.js + R3F; GLB target ≤15MB (prefer ≤8MB); progressive enhancement.
- **Fallback:** Static photoreal poster when WebGL fails, `prefers-reduced-motion: reduce`, or low-end device flag.
- **IA / nav / CTA:** Unchanged — Home → Dogs → Health/Education → About → Inquire; CTA **"Begin your inquiry"**.
- **3D model:** Realistic German/ADRK Rottweiler; **natural undocked tail** hard preference; shortlist → CEO brief §6.
- **Mobile:** Hero height budget 45–55vh (min 320px); touch-safe; optional `REDUCE_3D` flag for low-end devices.
- **Explicit rejects:** Full-page R3F narrative, 200svh scroll hero, detached hero labels, purple/cream AI defaults, IA/CTA wording changes.

## Asks for manager (`ask_manager`)

- Peer help needed: **CTO** for GLB optimize pipeline, license diligence sign-off, and `HeroIsland` perf gate before Phase 9 merge — not a block on design merge
- Clarification needed: **Operator** commercial 3D asset budget cap + undocked-tail hard yes (CEO assumed yes) before purchase — see `HANDOFFS/22-ceo-operator-feedback-3d-brand.md` §8

## Risks / blockers

- **Scope creep:** Engineers may expand hero island into scroll narrative — §Anti-patterns and build checklist must stay visible in merged doc.
- **CWV:** WebGL island risks LCP/INP if fallback image not prioritized and Three bundle not code-split.
- **Asset:** No licensed GLB committed; static fallback (Prompt E in brand §13) ships until CTO completes diligence.
- **Contrast:** Phase 13/14 may need light→dark surface pass only — no CTA/IA rewrite.

## Packs used

- `11-brand-system.md` §3, §7, §8, §10, §12, §15 (primary tokens + hero material)
- `12-web-design.md` (prior light-paper spec — supersede sections only)
- `HANDOFFS/22-ceo-operator-feedback-3d-brand.md` (Option B locks + model shortlist)
- `HANDOFFS/11b-csuite-review.md` (C-suite approve gate)
- `14-pages/home.md` (copy structure — hero composition adapts, proof band order preserved)

## Do not

- Mark the phase complete
- Write outside write_lease
- Edit `12-web-design.md` directly
- Write the manager brief
- Spawn other positions

---

# Mergeable sections for `12-web-design.md`

> **Merge instructions for creative-director:** Insert §Option B supersede after title block; replace Summary, Strategic locks, Design system, Motion, Performance, Anti-patterns, Phase 9 checklist, and Home wireframe per sections below. Preserve multi-page IA, routes, component inventory, and non-Home wireframes unless token references need dark-theme updates.

---

## §Option B supersede (insert after document header)

**Option B reopen (2026-07-27):** Operator locked hero-only WebGL + black/tan brand remap (`HANDOFFS/22-ceo-operator-feedback-3d-brand.md`). This document **updates** Phase 12 in place.

| Layer | Prior Phase 12 (light editorial) | **Now (Option B)** | Unchanged |
|-------|----------------------------------|--------------------|-----------|
| Default surface | Light paper `#FAFAF8` | **Dark ground** `#0E0E0E` | — |
| Accent | Tan `#8B7355` on light | **Rich ADRK tan** `#C4A35A` / hover `#A67C52` | Tan-as-marking metaphor |
| Home hero | Compact text + proof band first | **Contained WebGL island** + wordmark/copy + proof band **below** | Proof-before-inquire |
| Scroll-3D / full-page R3F | Banned | **Still banned** — hero island ≠ Mode E | Multi-page IA, `/inquire`, Packages A–C |

**Superseded:** Light-paper `--color-bg-primary`, light shadcn mapping, "No `components/three/`" rule, "Zero R3F" in strategic locks (narrow exception documented). **Preserved:** D2 trust-first · IA order · CTA wording · `/inquire` route · evidence UI structure · static-first architecture for non-hero pages.

---

## §Summary (replace)

Blacksage Kennels ships as a **multi-page, static-first Next.js App Router site** on a **dark editorial** design system (`#0E0E0E` ground, rich tan `#C4A35A` accents). The homepage leads with a **contained hero WebGL island** — realistic German/ADRK Rottweiler with static photoreal fallback — plus brand wordmark, headline, and support copy. **Proof summary band** (four cells, brand §7.1) sits **immediately below** the hero, not overlaid on 3D media. Global navigation: **Home → Dogs → Health/Education → About → Contact/Inquire**. Conversion routes to **`/inquire`** with tertiary **"Begin your inquiry"** on Home.

**Strategic locks encoded:** D2 trust-first · SD4 scroll-3D NO (narrow hero-island exception) · IA order · Packages A–C · `/inquire` not `/apply` · evidence density as prestige · dark black/tan default.

**Explicit reject:** Full-page scroll-driven R3F, scroll-jacking, 200svh scroll heroes, detached promo badges on hero media, purple/cream AI defaults, v1 `apps/blacksage-kennels` scroll narrative. See §Anti-patterns.

---

## §Strategic locks (replace table)

| Lock | Web design expression |
|------|------------------------|
| **D2 / SD1** | Proof pathway before inquire; Home = hero island + proof band below — not apply-first |
| **SD4** | Scroll-3D / full-page R3F / scroll-jacking **NO**; **narrow exception:** one lazy-loaded hero WebGL island (~45–55vh), idle motion only, static fallback required |
| **IA** | Nav: Home → Dogs → Health/Education → About → Contact/Inquire |
| **Route** | `/inquire` — **not** `/apply` |
| **CTA** | Primary: View our dogs / Health & testing (proof band); tertiary: **Begin your inquiry** |
| **Packages A–C** | Form modes A (interest) and B (waitlist); C in copy only |
| **SD5** | Honest placeholders; tier badges; no fake dog photography |
| **SD7** | New codebase spec — do not extend v1 app scroll structure |
| **A10** | No prices, deposits, Buy/Shop/Reserve on any page |
| **Option B** | Dark ground + tan accents from `11-brand-system.md` §3; undocked tail preferred in 3D + photography |

---

## §Next.js file tree (delta — merge into existing tree)

Add under `components/`:

```
components/
├── three/
│   ├── HeroIsland.tsx              # Client island — dynamic import boundary
│   ├── HeroIslandCanvas.tsx        # R3F Canvas + scene (lazy)
│   ├── HeroIslandFallback.tsx      # Static poster + same layout slot
│   └── useHeroWebGL.ts             # Capability + reduced-motion + low-end gate
├── home/
│   └── HomeHero.tsx                # Composes wordmark, copy, CTA group, HeroIsland
```

Add under `public/`:

```
public/
├── models/
│   └── hero-rottweiler.glb         # Optimized asset (≤15MB; target ≤8MB) — gitignored until licensed
└── images/
    └── hero-rottweiler-fallback.webp  # LCP-prioritized static poster (≤200KB AVIF/WebP)
```

Add under `hooks/`:

```
hooks/
├── usePrefersReducedMotion.ts
└── useLowEndDevice.ts              # Optional: disable WebGL on low memory / slow connection
```

**Remove prior rule:** "No `components/three/` directory in production build" — **superseded** by contained island only. **Still banned:** `ScrollScene`, `scroll-timeline`, full-page `SceneCanvas`, `@react-three/drei` ScrollControls.

Update `app/page.tsx` comment: `# Home — RSC shell; HomeHero (client island) + ProofSummaryBand + sections`

---

## §Global layout wireframe (replace header/footer token refs)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Skip to main content                                                      │
├──────────────────────────────────────────────────────────────────────────┤
│ [Wordmark]    Dogs   Health/Education   About          [Begin inquiry →] │  sticky header
│               ─────────────────────────────────────────────────────────  │  #0E0E0E or #161616; tan underline active
├──────────────────────────────────────────────────────────────────────────┤
│ <main id="main-content">                                                  │
│   {page content}                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│ FOOTER (#141414 band)                                                     │
│ Wordmark · Nav repeat · ADRK note · contact when Q2                       │
│ © Blacksage Kennels                                                       │
└──────────────────────────────────────────────────────────────────────────┘
```

### Header spec (dark default)

| Element | Spec |
|---------|------|
| Background | `#0E0E0E` or `#161616`; on scroll add `border-b` `#2A2A2E` + subtle shadow |
| Wordmark | Libre Baskerville; "Blacksage" `#F5F2EB` + "Kennels" `#C4A35A` |
| Nav links | Source Sans 3 `body-sm` `#F5F2EB`; active tan underline |
| Inquire CTA | Tertiary: ghost or outline tan — **not** filled primary on Home |
| Mobile | Hamburger → Sheet; same nav order; Inquire at bottom |

### Footer spec

| Element | Spec |
|---------|------|
| Background | `#141414` (`--color-bg-proof-band`) |
| Text | `#F5F2EB` / secondary `#B8B4AC` |
| Top rule | Optional 1px tan at 35% opacity |

---

## §Home wireframe — Option B (replace Home section)

**Job:** Brand presence via contained 3D + immediate proof pathway below. **Not** scroll narrative, apply-first hero, or badges floating on 3D media.

**Section order:**

1. **Home hero region** — wordmark + h1 + subhead + tertiary CTA group + contained WebGL plane
2. **Proof summary band** — 4 cells (required visible without scroll on 1280×800 alongside hero)
3. **Positioning prose** — 2–3 sentences + internal links
4. **Education teaser** — link to `/health`
5. **About teaser** — link to `/about`
6. **Inquire band (tertiary)** — calm CTA; outline/text only

```
┌─────────────────────────────────────────────────────────────────────────┐
│ HOME HERO REGION — full content width, max 72rem centered                │
│ bg: #0A0A0A → #0E0E0E gradient falloff                                  │
│ height: ~45–55vh desktop (min 320px mobile); NOT 200svh / NOT scroll    │
├──────────────────────────────┬──────────────────────────────────────────┤
│ COPY COLUMN (40–45% lg+)     │ WEBGL VISUAL PLANE (55–60% lg+)          │
│                              │ edge-to-edge within hero region only     │
│ [Wordmark — flat, not in 3D] │ ┌────────────────────────────────────┐ │
│ h1: German / ADRK-aligned…   │ │  R3F canvas — lazy loaded          │ │
│ subhead (body-lg)            │ │  idle orbit ≤ 0.15 rad amplitude   │ │
│                              │ │  calm standing pose, undocked tail │ │
│ CTA group (text links only): │ │  NO floating badges/chips/labels   │ │
│  → View our dogs             │ │  NO scroll-linked camera           │ │
│  → Health approach           │ └────────────────────────────────────┘ │
│  (no filled primary CTA)     │ scrim: left gradient #141414 60%+ if   │
│                              │ type overlaps canvas on narrow layouts │
├──────────────────────────────┴──────────────────────────────────────────┤
│ MOBILE (stack): wordmark → h1 → subhead → WebGL plane (16:9 crop) → CTAs│
├─────────────────────────────────────────────────────────────────────────┤
│ PROOF SUMMARY BAND — #141414 + tan top rule                              │
│ ┌──────────────┬──────────────┬──────────────┬──────────────┐           │
│ │ Standards    │ Health       │ Dogs         │ Process      │           │
│ │ → /health    │ → /health    │ → /dogs      │ → /health    │           │
│ └──────────────┴──────────────┴──────────────┴──────────────┘           │
│ cells: #1C1C1E; border #2A2A2E; links #F5F2EB + tan underline           │
├─────────────────────────────────────────────────────────────────────────┤
│ Positioning prose · Education teaser · About teaser · Inquire band       │
└─────────────────────────────────────────────────────────────────────────┘
```

### Home hero composition rules

| Rule | Spec |
|------|------|
| Wordmark | Flat SVG/text in copy column — **never** textured into WebGL scene |
| Headline | h1 `#F5F2EB` on scrim or copy column — never directly on busy 3D without ≥60% dark gradient |
| Support copy | One subhead (`body-lg` `#B8B4AC`); max 2 lines desktop |
| CTA group | Text links to `/dogs`, `/health` — **not** filled "Begin your inquiry" in hero |
| WebGL plane | Contained to hero region; lazy; fog `#0A0A0A`; no HUD frames, no neon rim |
| Overlays on media | **Banned** — no detached badges, promo chips, stat callouts on canvas |
| Proof band | **Below** hero DOM order — not z-index stacked over 3D as primary trust UI |
| Scroll | Normal document scroll — hero does not pin or hijack |

### Proof band cells (unchanged content — dark tokens)

| Cell | Title | Body (Tier 1) | Link |
|------|-------|---------------|------|
| Standards | Standards-aligned | ADRK / FCI No. 147 type | `/health#standards` |
| Health | Health approach | Testing categories overview | `/health#testing` |
| Dogs | Our dogs | Count or "Profiles coming soon" | `/dogs` |
| Process | Deliberate placement | Selective inquiry process | `/health#placement` |

**Acceptance:** V2, U1, U2 — no "Scroll" prompt, no scroll-jacking, proof band + hero visible without scroll on 1280×800 laptop.

---

## §HeroIsland component spec

### HeroIsland (client boundary)

| Prop | Type | Required | Notes |
|------|------|----------|-------|
| `className` | string | No | |
| `posterSrc` | string | Yes | `/images/hero-rottweiler-fallback.webp` |
| `modelSrc` | string | No | `/models/hero-rottweiler.glb` — omit until licensed |
| `disableWebGL` | boolean | No | Env `NEXT_PUBLIC_REDUCE_3D=1` or low-end hook |

**Render logic:**

1. SSR + first paint: `HeroIslandFallback` (poster) — **LCP candidate**
2. Client: if `!prefers-reduced-motion` && WebGL available && !low-end && !disableWebGL → dynamic import `HeroIslandCanvas`
3. On WebGL context loss / import error → remain on fallback
4. Canvas mounts inside fixed hero slot — no layout shift (reserve aspect box)

### HeroIslandCanvas (R3F — lazy)

| Setting | Value |
|---------|-------|
| Camera | Fixed perspective; subtle idle orbit on `useFrame` — amplitude ≤ 0.15 rad, period ≥ 8s |
| Scroll | **None** — no `useScroll`, no scroll percentage bindings |
| Lights | Key warm ~4500K upper-left; fill neutral; rim `--hero-rim-warm` max 0.12 alpha |
| Fog | `#0A0A0A` exponential |
| Model pose | Calm alert standing; structure visible; **undocked tail** |
| Materials | Black coat `#0A0A0A`–`#121212`; tan markings `#C4A35A` / shadow `#A67C52` |
| Animation | Optional idle breath/tail sway ≤ 2s loop — not aggression |
| DPR | `[1, 1.5]` max on mobile; `[1, 2]` desktop |
| Pixel ratio cap | Reduce on `deviceMemory ≤ 4` |

### HeroIslandFallback

| Element | Spec |
|---------|------|
| Image | WebP/AVIF poster; `next/image` priority; explicit width/height |
| Alt | "Rottweiler breed reference — hero illustration" (not program proof) |
| Motion | None |
| Reduced motion | **Always** this component — skip Canvas entirely |

### useHeroWebGL gate

```typescript
// Pseudocode — Phase 9 implements
function shouldEnableWebGL(): boolean {
  if (prefersReducedMotion) return false;
  if (process.env.NEXT_PUBLIC_REDUCE_3D === '1') return false;
  if (isLowEndDevice()) return false; // optional: low memory, save-data, slow connection
  if (!hasWebGL2()) return false;
  return true;
}
```

---

## §3D model notes + license diligence (for CTO)

**Breed:** Realistic German / ADRK-type Rottweiler. **Natural undocked tail** — hard preference per CEO brief.

**Shortlist** (verify license before purchase — `HANDOFFS/22-ceo-operator-feedback-3d-brand.md` §6):

| Priority | Candidate | URL | Notes |
|----------|-----------|-----|-------|
| 1 | Alex Lashko — Game-Ready Rottweiler | https://alexlashko.com/store/np1/rottweiler-game-ready | Undocked tail option; confirm web display rights |
| 2 | CGTrader — Realistic Animated/Rigged | https://www.cgtrader.com/3d-models/animal/mammal/realistic-rottweiler-dog-animated-and-rigged | GLB; optimize to budget |
| 3 | CGTrader — Standing Pose | https://www.cgtrader.com/3d-models/animal/mammal/rottweiler-dog-standing-pose-realistic-guard-breed-character | ~30MB source — aggressive Draco/mesh simplify |
| 4 | CGTrader — Low-poly VR/AR | https://www.cgtrader.com/3d-models/animal/mammal/rottweiler-dog-e7979050-ee77-434e-b858-3a6a714d468b | Budget-friendly; fidelity tradeoff |
| Last | Meshy AI Rottweilers | https://www.meshy.ai/tags/rottweiler | CC0 — breed accuracy risk; CEO approval only |

### License diligence checklist (CTO before buy)

- [ ] Commercial use includes **public website display**
- [ ] **CDN hosting** of optimized GLB permitted (or derivative only)
- [ ] **No public repo** of source files if license forbids
- [ ] **Animation/rig** rights for idle loop in hero
- [ ] **Undocked tail** available (or reject asset)
- [ ] Optimized GLB **≤15MB** (prefer **≤8MB**); Draco + texture budget documented
- [ ] Attribution in footer/credits if required
- [ ] Refund if breed fidelity fails QA

**Static fallback until licensed:** Use brand §13 Prompt E direction for poster art — label as illustration, not program proof.

---

## §Design system — CSS custom properties (replace §Design system CSS block)

Inherit from `11-brand-system.md` §3. **Dark default.** Map to shadcn:

```css
:root {
  /* Core — Option B dark default (from 11-brand-system §3) */
  --color-ground: #0E0E0E;
  --color-ground-elevated: #161616;
  --color-ground-lifted: #1C1C1E;
  --color-charcoal-soft: #242428;
  --color-graphite: #B8B4AC;
  --color-stone: #8A8680;
  --color-border: #2A2A2E;
  --color-border-strong: #3A3A40;
  --color-tan: #C4A35A;
  --color-tan-deep: #A67C52;
  --color-tan-soft: #D4B87A;
  --color-sage: #7A8F7E;
  --color-sage-deep: #5C6B5E;
  --color-sage-muted: #6B7A6E;
  --color-black-coat: #0A0A0A;
  --color-paper-legacy: #FAFAF8;
  --color-white-elevated: #FFFFFF;

  /* Semantic */
  --color-bg-primary: var(--color-ground);
  --color-bg-secondary: var(--color-ground-elevated);
  --color-bg-elevated: var(--color-ground-lifted);
  --color-bg-dark-band: var(--color-black-coat);
  --color-bg-proof-band: #141414;
  --color-text-primary: #F5F2EB;
  --color-text-secondary: var(--color-graphite);
  --color-text-muted: var(--color-stone);
  --color-text-on-tan: var(--color-ground);
  --color-accent-primary: var(--color-tan);
  --color-accent-secondary: var(--color-sage);
  --color-border-subtle: var(--color-border);
  --color-border-accent: rgba(196, 163, 90, 0.35);
  --color-focus-ring: var(--color-tan);
  --color-success: #6B9A72;
  --color-error: #C47070;

  /* Hero / WebGL island */
  --hero-fog: #0A0A0A;
  --hero-rim-warm: rgba(196, 163, 90, 0.12);
  --hero-key-fill: rgba(245, 242, 235, 0.08);

  /* shadcn/ui semantic mapping */
  --background: var(--color-bg-primary);
  --foreground: var(--color-text-primary);
  --card: var(--color-bg-elevated);
  --card-foreground: var(--color-text-primary);
  --popover: var(--color-bg-elevated);
  --popover-foreground: var(--color-text-primary);
  --primary: var(--color-accent-primary);
  --primary-foreground: var(--color-text-on-tan);
  --secondary: var(--color-bg-secondary);
  --secondary-foreground: var(--color-text-primary);
  --muted: var(--color-charcoal-soft);
  --muted-foreground: var(--color-text-muted);
  --accent: var(--color-accent-secondary);
  --accent-foreground: var(--color-text-primary);
  --destructive: var(--color-error);
  --destructive-foreground: var(--color-text-primary);
  --border: var(--color-border-subtle);
  --input: var(--color-border-strong);
  --ring: var(--color-focus-ring);
  --radius: 0.375rem;

  /* Typography */
  --font-display: "Libre Baskerville", Georgia, serif;
  --font-sans: "Source Sans 3", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", monospace;
}
```

**CTA rule (WCAG AA):** Primary button = tan fill `#C4A35A` + **dark text** `#0E0E0E` — never white on tan.

**Legacy light surfaces:** `--color-paper-legacy` for photo card interiors and form input fill `#FFFFFF` on dark panels only.

---

## §Tailwind config extension (replace colors block)

```javascript
colors: {
  blacksage: {
    ground: {
      DEFAULT: '#0E0E0E',
      elevated: '#161616',
      lifted: '#1C1C1E',
      soft: '#242428',
      band: '#141414',
    },
    paper: {
      legacy: '#FAFAF8',
      white: '#FFFFFF',
    },
    graphite: '#B8B4AC',
    stone: '#8A8680',
    tan: {
      DEFAULT: '#C4A35A',
      deep: '#A67C52',
      soft: '#D4B87A',
    },
    sage: {
      DEFAULT: '#7A8F7E',
      deep: '#5C6B5E',
      muted: '#6B7A6E',
    },
    border: {
      DEFAULT: '#2A2A2E',
      strong: '#3A3A40',
      accent: 'rgba(196, 163, 90, 0.35)',
    },
    text: {
      primary: '#F5F2EB',
      secondary: '#B8B4AC',
      muted: '#8A8680',
      onTan: '#0E0E0E',
    },
    coat: '#0A0A0A',
    hero: {
      fog: '#0A0A0A',
      rim: 'rgba(196, 163, 90, 0.12)',
    },
  },
},
```

### shadcn token mapping (replace table)

| shadcn token | Brand token | Usage |
|--------------|-------------|-------|
| `background` | ground `#0E0E0E` | Page fields |
| `foreground` | `#F5F2EB` | Body text |
| `primary` | tan `#C4A35A` | Submit on `/inquire` only |
| `primary-foreground` | `#0E0E0E` | **Dark text on tan CTA** |
| `secondary` | ground-elevated `#161616` | Secondary surfaces |
| `accent` | sage `#7A8F7E` | Badges |
| `muted-foreground` | stone `#8A8680` | Captions |
| `border` | `#2A2A2E` | Cards |
| `card` | ground-lifted `#1C1C1E` | Proof cells, dog cards |

Update non-Home wireframes: replace `paper bg`, `white card`, `charcoal text` refs with dark equivalents. Form panel: `#1C1C1E` shell; inputs `#FFFFFF` fill.

---

## §Motion (replace §Motion)

### Allowed

| Pattern | Spec |
|---------|------|
| Link hover | color 150ms `ease-out-soft` |
| Header scroll | border/shadow 200ms |
| Section enter (optional) | fade + translateY 8px max, 400ms, **once on mount** — not scroll-scrubbed |
| **Hero WebGL idle** | Subtle orbit/breath in hero island only; amplitude ≤ 0.15 rad; period ≥ 8s; **not scroll-driven** |
| Mobile Sheet | slide/fade standard |
| Form validation | inline — no confetti |

### Banned (SD4 / brand §8)

| Pattern | Reason |
|---------|--------|
| Scroll-jacking (`200svh` heroes) | NFR-PERF-004; Mode E |
| Scroll-linked camera / parallax depth stacks | v1 anti-pattern |
| Full-page R3F narrative | SD4 — hero island only |
| Framer Motion scroll narratives | Motion-gated content |
| Bounce/elastic on brand elements | Off-brand |
| Shimmer/pulse on placeholders | Fake loading |
| Animated logo in WebGL scene | Brand §2 |
| Neon bloom / purple rim on model | Option B anti-AI-default |

### prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**3D fallback required:** `prefers-reduced-motion: reduce` → **static poster only** — do not mount R3F Canvas. All proof content visible without motion.

---

## §Performance (replace/add WebGL budgets)

### Static-first + hero island

| Page | Strategy |
|------|----------|
| Home | RSC shell; `HomeHero` client island dynamically imports Three/R3F; **poster is LCP** |
| Health, About, Dogs | RSC; SSG — **no Three.js** |
| Inquire | RSC shell; form client island only |

### RSC vs client boundaries (update)

| Component | Server | Client |
|-----------|--------|--------|
| ProofSummaryBand, EvidenceGrid | ✓ | |
| HomeHero (copy column) | ✓ partial | ✓ WebGL slot |
| HeroIsland, HeroIslandCanvas | | ✓ lazy |
| HeroIslandFallback | ✓ (SSR poster) | |
| InquiryForm | | ✓ |

### Budgets

| Metric | Target |
|--------|--------|
| LCP | ≤ 2.5s mobile 4G — **fallback poster prioritized**; preload `/images/hero-rottweiler-fallback.webp` |
| CLS | ≤ 0.1 — hero slot explicit min-height; poster dimensions set |
| Home JS (excl. framework) | ≤ 180KB gzipped *(raised from 150KB for island)* |
| Three/R3F chunk | Lazy — **not** in initial bundle; target ≤ 120KB gzipped async |
| GLB asset | ≤ **15MB** max; prefer **≤8MB** after Draco/mesh optimize |
| Hero fallback image | ≤ 200KB WebP/AVIF |
| Lighthouse mobile | ≥ 85 Home *(monitor after WebGL enabled)* |

### Dynamic import pattern

```typescript
const HeroIslandCanvas = dynamic(
  () => import('./HeroIslandCanvas'),
  { ssr: false, loading: () => <HeroIslandFallback /> }
);
```

**Bundle rule:** `three`, `@react-three/fiber`, `@react-three/drei` — **hero route only** via dynamic import. **Ban:** `ScrollControls`, scroll timeline deps, site-wide Three import.

### Mobile / low-end

| Rule | Spec |
|------|------|
| Hero height | 45–55vh desktop; min **320px** mobile; stack copy above canvas |
| Touch | No drag-to-orbit required; passive scroll; 44×44px tap targets on CTAs |
| DPR cap | `[1, 1.5]` on mobile |
| Optional flag | `NEXT_PUBLIC_REDUCE_3D=1` or `useLowEndDevice()` → fallback only |
| Save-Data | Respect `navigator.connection.saveData` → skip WebGL |

---

## §Anti-patterns (add rows + clarify hero island)

**Mode E still rejected.** Contained hero WebGL island is **not** permission for scroll-3D.

| Pattern | Why rejected | v2 / Option B replacement |
|---------|--------------|---------------------------|
| Full-page scroll-driven R3F | Mode E; SD4 | Contained `HeroIsland` + static fallback |
| Scroll-jacking / 200svh hero | Blocks proof; NFR-PERF-004 | ~45–55vh hero; normal scroll |
| Scroll-linked camera | v1 failure | Idle orbit in island only |
| Detached badges/chips on hero media | Clutters trust signal | Copy column + proof band below |
| Light-paper `#FAFAF8` site default | Superseded Option B | Dark ground `#0E0E0E` |
| Purple/cream AI luxury | Category anti-pattern | Black + rich tan editorial |
| White text on tan CTA | WCAG fail | Dark text `#0E0E0E` on tan fill |
| 3D logo in scene | Gimmick | Flat wordmark in copy column |
| Gamer HUD / neon rim | Off-brand | `--hero-rim-warm` ≤ 0.12 alpha |
| `apps/blacksage-kennels` scroll port | SD7 | New tree; island ≠ ScrollScene |
| **Misread:** "hero island = 3D website" | Scope creep to Option C | Single lazy canvas; proof band below |

---

## §Phase 9 build checklist — Option B delta (merge into checklist)

### Foundation (update)

- [ ] Tailwind + shadcn with **blacksage dark tokens** (not light paper)
- [ ] CSS vars from `11-brand-system.md` §3

### Home / hero (add)

- [ ] `HomeHero` composes wordmark, h1, subhead, CTA links, `HeroIsland`
- [ ] `HeroIslandFallback` SSR poster — **LCP preload**
- [ ] Dynamic import `HeroIslandCanvas` — no Three in main bundle
- [ ] `prefers-reduced-motion` → fallback only
- [ ] `NEXT_PUBLIC_REDUCE_3D` env flag documented
- [ ] ProofSummaryBand **below** hero in DOM — 4 cells above fold on 1280×800
- [ ] GLB pipeline: optimize ≤15MB; Draco; texture max 2K

### Quality gates (update)

- [ ] Three.js/R3F **only** in lazy hero chunk — not site-wide
- [ ] **No** ScrollControls, scroll-timeline, full-page SceneCanvas
- [ ] WebGL context loss → graceful fallback
- [ ] Lighthouse mobile ≥ 85 with WebGL enabled (or document waiver if poster-only staging)
- [ ] axe-core 0 critical on Home with fallback poster

### Explicitly do not build (add)

- [ ] Full-page R3F narrative or scroll-driven camera
- [ ] Badges/chips overlaid on hero 3D canvas
- [ ] Light-paper primary theme
- [ ] Animated wordmark in WebGL

### Remove / supersede prior checklist items

- ~~Zero Three.js / R3F in `package.json`~~ → **Allow** Three/R3F as lazy deps for hero only
- ~~No 3D reduced-motion fallback required~~ → **Required** static poster fallback

---

## §Mobile hero spec

| Breakpoint | Layout |
|------------|--------|
| `< md` | Stack: wordmark → h1 → subhead → WebGL plane (aspect 16:9, min-h 200px) → text CTAs → proof band |
| `md–lg` | Optional 50/50 split if viewport height ≥ 700px |
| `≥ lg` | 40/45 copy \| 55/60 WebGL plane; hero total ~45–55vh |

| Concern | Rule |
|---------|------|
| Min height | 320px hero region including proof band peek |
| Touch | No orbit drag; links 44×44px |
| Performance | DPR cap 1.5; optional skip WebGL |
| Type legibility | Full-width scrim under headline if canvas behind text |

---

## §Non-Home page token pass (brief)

Apply dark tokens to existing wireframes without structural change:

| Page | Key surface updates |
|------|---------------------|
| Dogs | Cards `#1C1C1E`; placeholder `#161616`; text `#F5F2EB` |
| Health | Evidence grid on `#1C1C1E` / striping `#0E0E0E` / `#161616` |
| About | Prose `#F5F2EB` on ground |
| Inquire | Panel `#1C1C1E`; inputs `#FFFFFF`; submit tan + dark text |

---

## §Handoff to Phase 9 / copy-chief (delta)

### copy-chief

- Hero copy unchanged per `14-pages/home.md` — composition adds WebGL plane beside copy; **no primary CTA in viewport 1**
- Contrast pass: ensure `#B8B4AC` subheads readable on `#0A0A0A` scrim

### Phase 9 engineer

- Implement `components/three/HeroIsland*` per spec
- Ship **poster-only** until licensed GLB approved
- TDD: `shouldEnableWebGL()` gates; proof band renders below hero; reduced-motion skips Canvas

---
