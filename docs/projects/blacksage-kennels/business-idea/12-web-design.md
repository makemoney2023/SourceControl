# 12 Web Design — Blacksage Kennels

**Phase:** 12-R (Skill-Max Working-Dog Cinema) — **ACTIVE SSOT**  
**Status:** approved — Skill-Max craft  
**Last updated:** 2026-07-27 (SSOT freeze)  
**Author:** creative-director (merge); IC: web-designer (`HANDOFFS/12r-web-designer.md`)  
**Venture:** Blacksage Kennels  
**Mode:** D2 Hybrid + SD4-C home cinema · Territory B  

> **Do not implement from Option B or Option C craft sections below.** Those are historical. Product shape (Hybrid + mid-home proof + inquire-after-proof) remains; visual system is **11-R / 12-R cinema**.

---

## Skill-Max supersede (2026-07-27) — ACTIVE

**Operator GO** (`HANDOFFS/25-ceo-creative-reboot.md`) + territory **B Working-Dog Cinema** (`HANDOFFS/26-creative-director-territory.md`).

| Layer | Value |
|-------|--------|
| Product shape | Option C Hybrid held: scroll/cinema chapters on `/` + multi-page proof IA |
| Default home | **Photography-first documentary** (`CinemaDocumentaryHome`) — not geometric box-dog |
| WebGL | Only when WebGL gate **and** licensed GLB at `public/models/hero-rottweiler.glb` |
| Tokens | Void `#070707` · tan `#C4A35A` · Fraunces display · Manrope body |
| Proof band | Mid-scroll / mid-document HTML (hard) — four cells |
| Copy | Phase 14 kennel substance (`lib/home-scroll-story.ts` / `14-pages/home.md` + `home-scroll-chapters.md`) — **no film jargon** |
| Secondary pages | HTML RSC; dark cinema tokens |
| Reduced-motion | Stacked chapters; same copy; no WebGL |

### Chapter storyboard (0–1)

| Progress | id | Job |
|----------|-----|-----|
| 0.00–0.18 | `presence` | Breed presence + H1 |
| 0.18–0.36 | `standards` | ADRK / FCI teaser → `/health#standards` |
| 0.36–0.52 | `proof` | **HTML proof band** |
| 0.52–0.70 | `health` | Education teaser → `/health` |
| 0.70–0.86 | `dogs` | Breeding stock teaser → `/dogs` |
| 0.86–1.00 | `inquire` | Tertiary CTA → `/inquire` |

### Design SSOT in app

- `apps/blacksage-kennels/design-system/blacksage-kennels/MASTER.md`
- `apps/blacksage-kennels/design-system/blacksage-kennels/pages/home.md`

**Skills required for any further craft:** ui-ux-pro-max (cli + design + ui-styling), web-design-guidelines, tailwind-design-system, threejs-fundamentals (if WebGL), natural-human-voice / copy-chief for chapter text.

---

## Option C supersede (2026-07-27) — historical (product shape only)

**Operator locked Option C** (`HANDOFFS/24-ceo-option-c-lock.md`): **1A** scroll narrative + Hybrid IA. Craft quality was later **rejected**; Skill-Max rebuilt expression while keeping Hybrid + SD4-C.

| Layer | Option B | Option C (historical craft) | Unchanged through Skill-Max |
|-------|----------|-----------------------------|-----------------------------|
| Home 3D | Contained island | Full-bleed ScrollControls | Product shape: chapters + proof |
| Proof band | Below hero | Mid-scroll HTML | Four cells + links |
| Fallback | Poster island | Static stacked chapters | REDUCE_3D / reduced-motion |

### Scroll storyboard (progress 0–1) — still the chapter contract

| Progress | Chapter id | Job | Overlay |
|----------|------------|-----|---------|
| 0.00–0.18 | `presence` | Breed presence | Wordmark + H1 + short support |
| 0.18–0.36 | `standards` | Standards / temperament | Chapter title + link to /health |
| 0.36–0.52 | `proof` | **HTML proof band** (hard) | `ProofBandTracker` cells |
| 0.52–0.70 | `health` | Health education teaser | CTA to /health |
| 0.70–0.86 | `dogs` | Dogs teaser | CTA to /dogs |
| 0.86–1.00 | `inquire` | Conversion | **Begin your inquiry** |

---

## Option B supersede (2026-07-27) — historical

Hero-only WebGL island + black/tan remap. **Superseded by Option C product shape, then Skill-Max craft.** Do not ship Option B island as primary home.

---

## Summary (ACTIVE)

Blacksage Kennels ships as a **multi-page Next.js App Router** site on a **void-black Working-Dog Cinema** system (`#070707`, tan `#C4A35A`, Fraunces + Manrope). Homepage is a **chaptered cinema / documentary narrative** with a **hard HTML proof band** mid-path and tertiary inquire at the end. Default visual is photography-first; WebGL is an optional GLB upgrade. Nav: **Home → Dogs → Health/Education → About → Inquire**. CTA: **"Begin your inquiry"**.

**Strategic locks:** D2 Hybrid · SD4-C · Packages A–C · claim honesty · no Mode E empty spectacle · no film-jargon-only copy.

**Explicit reject:** Apply-first storefront · purple/cream AI defaults · geometric stand-in as prestige hero when documentary path exists · inventing dog photos.

---

## Strategic locks (non-negotiable)

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
| **Skill-Max / 11-R** | Void cinema tokens from `11-brand-system.md`; photography-first; undocked tail preferred when GLB/photos exist |
| **SD4-C** | Home chapters / cinema narrative; secondary pages HTML |

---

## Sitemap & routes

### Public routes (Must)

| Route | Nav label | Purpose | Render mode | Tier |
|-------|-----------|---------|-------------|------|
| `/` | Home | Cinema chapters + mid-path proof band + inquire end | RSC shell; HomeScrollStage client | Tier 0–2 |
| `/dogs` | Dogs | Breeding stock index or honest empty state | RSC + static params when populated | Tier 1–2 |
| `/dogs/[slug]` | — | Named dog detail (operator-verified only) | RSC + `generateStaticParams` | Tier 2 |
| `/health` | Health/Education | Evidence grid + education prose + process overview | RSC | Tier 0–2 |
| `/about` | About | Operator story, philosophy, contact when Q2 | RSC | Tier 0–2 |
| `/inquire` | Inquire | Package A or B inquiry form | RSC shell + client form island | Tier 1–2 |

**Route alias (optional):** `/education` → 301 redirect to `/health` if SEO prefers shorter label in URL; nav copy remains **Health/Education**.

### Conditional route (Should — Q1-gated)

| Route | Nav label | When live | When hidden |
|-------|-----------|-----------|-------------|
| `/litters` | Litters | Q1 = active program + verified litter facts | Omit nav item; no orphan route |
| `/litters/[slug]` | — | Named litter with verified parents | — |

**Q1 = brand-first (Tier 1):** Litters nav omitted; Dogs may show empty state; Inquire = Package A only.

**Q1 = active (Tier 2):** Litters nav appears when operator confirms; Package B fields enabled on `/inquire`.

### Routes explicitly excluded (v1)

| Route | Status |
|-------|--------|
| `/apply` | **Rejected** — redirect to `/inquire` in new build if legacy links exist |
| `/pricing` | Won't have |
| `/blog` | Could have post-v1 |

### CTA hierarchy (per page)

| Priority | Action | Typical placement |
|----------|--------|-------------------|
| 1 | View our dogs | Home proof band, hero text links, header nav |
| 2 | Health & testing | Home proof band, hero text links, header nav |
| 3 | Learn about our process | Health, About |
| 4 | **Begin your inquiry** | Header tertiary button, footer, bottom of About — **not** filled primary in hero |

---

## Next.js App Router file tree

```
app/
├── layout.tsx                    # Root: fonts, metadata, ThemeProvider, SkipLink target
├── page.tsx                      # Home — RSC shell; HomeHero + ProofSummaryBand + sections
├── not-found.tsx                 # On-brand 404
├── dogs/
│   ├── page.tsx                  # Dogs index
│   └── [slug]/
│       └── page.tsx              # Dog detail
├── health/
│   └── page.tsx                  # Health/Education hub
├── about/
│   └── page.tsx                  # About
├── inquire/
│   ├── page.tsx                  # Inquiry form (package mode from env/CMS)
│   └── layout.tsx                # Form-specific metadata
├── litters/                      # Conditional — Q1 active
│   ├── page.tsx
│   └── [slug]/
│       └── page.tsx
├── api/
│   └── inquire/
│       └── route.ts              # POST handler → Q7 destination
├── globals.css                   # CSS variables + Tailwind base
└── sitemap.ts                    # Public trust pages only

components/
├── layout/
│   ├── SiteHeader.tsx            # Nav + tertiary Inquire CTA
│   ├── SiteFooter.tsx            # Dark band; ADRK note
│   ├── MobileNav.tsx             # Sheet drawer
│   └── SkipLink.tsx
├── home/
│   └── HomeHero.tsx              # Wordmark, copy, CTA group, HeroIsland
├── three/
│   ├── HeroIsland.tsx            # Client island — dynamic import boundary
│   ├── HeroIslandCanvas.tsx      # R3F Canvas + scene (lazy)
│   ├── HeroIslandFallback.tsx    # Static poster + same layout slot
│   └── useHeroWebGL.ts           # Capability + reduced-motion + low-end gate
├── proof/
│   ├── ProofSummaryBand.tsx      # Home 4-cell band (brand §7.1)
│   ├── EvidenceGrid.tsx          # Health test categories
│   ├── OfaLinkCard.tsx           # Per-dog registry row
│   └── TierBadge.tsx             # Claim discipline labels
├── dogs/
│   ├── DogCard.tsx               # Index card
│   ├── DogGrid.tsx               # Responsive grid wrapper
│   └── DogHealthList.tsx         # Detail health stack
├── placeholders/
│   └── PlaceholderSlot.tsx       # Honest empty media
├── inquire/
│   ├── InquiryForm.tsx           # Package A/B modes
│   ├── PackageModeHeader.tsx     # A vs B headline/subhead
│   └── InquiryConfirmation.tsx   # Post-submit state
├── content/
│   ├── PageHero.tsx              # Shared page header pattern
│   └── ProseSection.tsx          # Education long-form wrapper
└── ui/                           # shadcn primitives
    ├── button.tsx
    ├── card.tsx
    ├── form.tsx
    ├── input.tsx
    ├── select.tsx
    ├── textarea.tsx
    ├── checkbox.tsx
    ├── badge.tsx
    ├── separator.tsx
    ├── navigation-menu.tsx
    ├── sheet.tsx
    └── label.tsx

lib/
├── content/
│   ├── dogs.ts                   # Static or CMS-sourced dog data
│   ├── health-categories.ts      # Tier 1 evidence grid data
│   └── site-config.ts            # Q1 package mode, feature flags, REDUCE_3D
├── validations/
│   └── inquire-schema.ts         # Zod — Package A/B field sets
└── utils.ts

hooks/
├── usePrefersReducedMotion.ts
└── useLowEndDevice.ts            # Optional: disable WebGL on low memory / slow connection

public/
├── fonts/                        # Optional self-hosted fallback
├── models/
│   └── hero-rottweiler.glb       # Optimized ≤15MB (prefer ≤8MB) — gitignored until licensed
├── images/
│   └── hero-rottweiler-fallback.webp  # LCP poster ≤200KB
└── og/                           # OG images when Q6 satisfied
```

**Allowed:** `components/three/HeroIsland*` — contained hero island only.  
**Still banned:** `ScrollScene`, `scroll-timeline`, full-page `SceneCanvas`, `@react-three/drei` ScrollControls.

---

## Global layout wireframe

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Skip to main content                                                      │
├──────────────────────────────────────────────────────────────────────────┤
│ [Wordmark]    Dogs   Health/Education   About          [Begin inquiry →] │  sticky header
│               ─────────────────────────────────────────────────────────  │  #0E0E0E / #161616; tan underline active
├──────────────────────────────────────────────────────────────────────────┤
│ <main id="main-content">                                                  │
│   {page content}                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│ FOOTER (#141414 band)                                                     │
│ Wordmark · Nav repeat · ADRK alignment note · contact when Q2             │
│ © Blacksage Kennels                                                       │
└──────────────────────────────────────────────────────────────────────────┘
```

### Header spec

| Element | Spec |
|---------|------|
| Background | `#0E0E0E` or `#161616`; on scroll add `border-b` `#2A2A2E` + subtle shadow |
| Wordmark | Libre Baskerville; "Blacksage" `#F5F2EB` + "Kennels" `#C4A35A` |
| Nav links | Source Sans 3 `body-sm` `#F5F2EB`; active tan underline |
| Inquire CTA | Tertiary: ghost or outline tan — **not** filled primary on Home context |
| Mobile | Hamburger → Sheet; same nav order; Inquire at bottom of sheet |

### Footer spec

| Element | Spec |
|---------|------|
| Background | `#141414` (`--color-bg-proof-band`) |
| Text | `#F5F2EB` / secondary `#B8B4AC` |
| Content | Repeat nav, ADRK/FCI alignment one-liner (Tier 1), email/phone when Q2 |
| Top rule | Optional 1px tan at 35% opacity |
| No | Social icon row required v1; payment badges; puppy countdown |

---

## Per-page wireframe specs

### Home (`/`) — Option B

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
│ MOBILE (stack): wordmark → h1 → subhead → WebGL plane (16:9) → CTAs     │
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

#### Home hero composition rules

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

#### Proof band cells (brand §7.1)

| Cell | Title | Body (Tier 1) | Link |
|------|-------|---------------|------|
| Standards | Standards-aligned | ADRK / FCI No. 147 type | `/health#standards` |
| Health | Health approach | Testing categories overview | `/health#testing` |
| Dogs | Our dogs | Count or "Profiles coming soon" | `/dogs` |
| Process | Deliberate placement | Selective inquiry process | `/health#placement` |

**Acceptance:** V2, U1, U2 — no "Scroll" prompt, no scroll-jacking, proof band + hero visible without scroll on 1280×800 laptop.

---

### Dogs index (`/dogs`)

**Job:** Named breeding stock when Tier 2 inventory exists; honest empty otherwise.

```
┌─────────────────────────────────────────────────────────────────┐
│ PageHero: h1 "Breeding stock"                                    │
│ intro: Tier 1 — structure + temperament focus                    │
├─────────────────────────────────────────────────────────────────┤
│ POPULATED: DogGrid — 3-col lg, 2-col md, 1-col sm              │
│   [DogCard] [DogCard] [DogCard]                                  │
├─────────────────────────────────────────────────────────────────┤
│ EMPTY (Tier 1): PlaceholderSlot + honest copy                    │
│ "Breeding stock profiles are coming soon."                       │
│ → link /health, /inquire (tertiary)                              │
└─────────────────────────────────────────────────────────────────┘
```

**DogCard:** photo or PlaceholderSlot; name (h3 serif); role sire/dam; health link if inventory. Surfaces: `#1C1C1E` cards; text `#F5F2EB`.

**Filters:** None v1 — small inventory expected.

---

### Dog detail (`/dogs/[slug]`)

**Gate:** Page exists only when operator supplies name, photo approval, permitted claims.

```
┌─────────────────────────────────────────────────────────────────┐
│ Breadcrumb: Dogs / {Name}                                        │
├──────────────────────────────┬──────────────────────────────────┤
│ Photo 3:2 or 4:5             │ h1 Name                          │
│ in elevated card #1C1C1E     │ Role: Sire | Dam                   │
│ photo-mat: paper-legacy fill │ TierBadge: Verified (when Tier 2)  │
│                              │ body: permitted bio                │
├──────────────────────────────┴──────────────────────────────────┤
│ h2 Health clearances                                             │
│ DogHealthList → OfaLinkCard rows (Tier 2 only; omit if none)    │
├─────────────────────────────────────────────────────────────────┤
│ Pedigree / titles — only when operator verified; else omit       │
├─────────────────────────────────────────────────────────────────┤
│ Link: ← Back to dogs · Health approach →                         │
└─────────────────────────────────────────────────────────────────┘
```

**Rule:** No "Coming soon" per-test rows on named dog — omit entirely (brand §7.3).

---

### Health/Education (`/health`)

**Job:** Tier 1 education + evidence density; placement process (Packages A–C described, no prices).

**Anchor IDs:** `#standards`, `#testing`, `#temperament`, `#placement`

```
┌─────────────────────────────────────────────────────────────────┐
│ PageHero: h1 "Health & education"                                │
├─────────────────────────────────────────────────────────────────┤
│ #standards — ProseSection (max 68ch)                             │
│ ADRK/FCI temperament bounds; natural tail; TierBadge Standard ref│
├─────────────────────────────────────────────────────────────────┤
│ #testing — h2 "Health testing approach"                          │
│ EvidenceGrid — 5 category cards on #1C1C1E                       │
├─────────────────────────────────────────────────────────────────┤
│ #temperament — prose + optional breed-standard diagram slot      │
├─────────────────────────────────────────────────────────────────┤
│ #placement — h2 "Our placement process"                          │
│ Package A / B / C described in prose blocks (no payment UX)      │
│ Package C: education only — no form                              │
├─────────────────────────────────────────────────────────────────┤
│ External resources: ADRK, OFA links (outbound, new tab)        │
└─────────────────────────────────────────────────────────────────┘
```

---

### About (`/about`)

```
┌─────────────────────────────────────────────────────────────────┐
│ PageHero: h1 "About Blacksage Kennels"                           │
├─────────────────────────────────────────────────────────────────┤
│ Operator story — Tier 2 when provided; honest gap copy otherwise │
├─────────────────────────────────────────────────────────────────┤
│ Program principles — Tier 1 bullets                              │
├─────────────────────────────────────────────────────────────────┤
│ Contact block — only when Q2 (city/region, email, phone)         │
│ LocalBusiness schema gated on Q2                                   │
├─────────────────────────────────────────────────────────────────┤
│ Club affiliations — Tier 2 verified only                         │
└─────────────────────────────────────────────────────────────────┘
```

Prose `#F5F2EB` on ground `#0E0E0E`.

---

### Inquire (`/inquire`)

**Job:** Qualified inquiry after trust navigation; Package mode from `site-config` (Q1).

```
┌─────────────────────────────────────────────────────────────────┐
│ max-width 560px centered on ground bg                            │
├─────────────────────────────────────────────────────────────────┤
│ PackageModeHeader                                                │
│   A: "Join our interest list"                                    │
│   B: "Submit inquiry for waitlist consideration"                 │
├─────────────────────────────────────────────────────────────────┤
│ Expectation copy — not a reservation; selective placement        │
├─────────────────────────────────────────────────────────────────┤
│ InquiryForm — #1C1C1E panel, 1px border #2A2A2E                  │
│   inputs: #FFFFFF fill; shared fields + Package B extras         │
│   honeypot hidden                                                  │
├─────────────────────────────────────────────────────────────────┤
│ Package B addendum — deposit-after-approval, no amount           │
├─────────────────────────────────────────────────────────────────┤
│ Trust footer — ADRK note; response expectation when Q7           │
└─────────────────────────────────────────────────────────────────┘
```

**Post-submit:** Inline `InquiryConfirmation` — h2 "Inquiry received"; no confetti; no puppy art.

**Package C:** Described on `/health#placement` only — no form variant v1.

**Submit CTA:** Tan fill `#C4A35A` + **dark text** `#0E0E0E`.

---

### Litters index (`/litters`) — conditional

**When Q1 active + litter facts verified:**

```
┌─────────────────────────────────────────────────────────────────┐
│ PageHero: h1 "Litters"                                           │
│ Tier 1 intro — no prices, no "available now" FOMO                │
├─────────────────────────────────────────────────────────────────┤
│ Litter cards: parents (links to /dogs/[slug]), status, expected  │
│ CTA: text link → /inquire (not "Reserve")                        │
└─────────────────────────────────────────────────────────────────┘
```

**When Q1 brand-first:** Route and nav item **omitted** — not a hidden empty page.

---

## HeroIsland component spec

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

### Dynamic import pattern

```typescript
const HeroIslandCanvas = dynamic(
  () => import('./HeroIslandCanvas'),
  { ssr: false, loading: () => <HeroIslandFallback /> }
);
```

---

## 3D model notes + license diligence (for CTO)

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

## Design system

### CSS custom properties

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

**Legacy light surfaces:** `--color-paper-legacy` for photo card interiors; form input fill `#FFFFFF` on dark panels only.

**Dark mode:** Site is dark-by-default. No `prefers-color-scheme` light toggle in v1.

### Tailwind config extension

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
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
      fontFamily: {
        display: ['var(--font-display)'],
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      maxWidth: {
        prose: '68ch',
        content: '72rem',
        form: '35rem',
      },
      spacing: {
        section: { DEFAULT: '5rem', mobile: '3rem' },
      },
    },
  },
};
```

### shadcn/ui theme mapping

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
| `ring` | tan | Focus visible |
| `destructive` | error `#C47070` | Form errors |

**Button variants:**

| Variant | Use |
|---------|-----|
| `default` (tan fill + dark text) | Form submit only on `/inquire` |
| `outline` | Secondary actions |
| `ghost` | Header nav, tertiary links |
| `link` | Inline text CTAs on Home hero / proof band |

### Typography application

| Element | Class / token |
|---------|---------------|
| Page h1 | `font-display text-h1` (40px → 32px mobile) |
| Section h2 | `font-display text-h2` |
| Proof card title | `font-sans text-h4 font-semibold` |
| Body education | `font-sans text-body-lg max-w-prose` |
| Captions | `text-caption text-blacksage-stone` |
| Overline labels | `text-overline uppercase tracking-widest` |

Load fonts via `next/font/google`: Libre Baskerville, Source Sans 3, IBM Plex Mono.

---

## Component inventory

### HomeHero

**Purpose:** Compose Option B hero — wordmark, h1, subhead, text CTAs, HeroIsland.

| Prop | Type | Required | Notes |
|------|------|----------|-------|
| `headline` | string | Yes | From `14-pages/home.md` |
| `subhead` | string | Yes | |
| `posterSrc` | string | Yes | Fallback image |
| `modelSrc` | string \| null | No | Until licensed |

---

### HeroIsland / HeroIslandCanvas / HeroIslandFallback

See §HeroIsland component spec above.

---

### ProofSummaryBand

**Purpose:** Home proof pathway below hero (brand §7.1).

| Prop | Type | Required | Notes |
|------|------|----------|-------|
| `cells` | `ProofCell[]` | Yes | Exactly 4 cells |
| `className` | string | No | |

```typescript
type ProofCell = {
  id: 'standards' | 'health' | 'dogs' | 'process';
  title: string;
  description: string;
  href: string;
  badge?: 'sage' | 'tan';
  stat?: string; // e.g. dog count or "Coming soon"
};
```

**Variants:** `layout: 'grid' | 'horizontal-scroll'` — default `grid` (2×2 md+). Surface: `#141414` band, cells `#1C1C1E`.

---

### EvidenceGrid

**Purpose:** Health/Education test category cards (brand §7.2).

| Prop | Type | Required |
|------|------|----------|
| `categories` | `HealthCategory[]` | Yes |
| `columns` | `2 \| 3` | No — default 2 md, 1 sm |

```typescript
type HealthCategory = {
  id: string;
  title: string;       // e.g. "Hips"
  label: string;       // e.g. "HD / OFA Hips"
  body: string;        // Tier 1 one-liner
  learnMoreHref?: string; // external OFA/ADRK
};
```

---

### OfaLinkCard

**Purpose:** Per-dog verified registry row (brand §7.3) — Tier 2 only.

| Prop | Type | Required |
|------|------|----------|
| `testName` | string | Yes |
| `result` | string | Yes | e.g. "Excellent" |
| `registryUrl` | string | Yes |
| `status` | `'clear' \| 'pending'` | No |

**Empty behavior:** Parent omits component — never render placeholder row.

---

### TierBadge

**Purpose:** Claim discipline QA (brand §7.4).

| Prop | Type | Required |
|------|------|----------|
| `tier` | `'standard-reference' \| 'program-policy' \| 'verified' \| 'coming-soon'` | Yes |

**Variants:** Maps to sage-muted, tan-soft, sage, stone backgrounds on dark.

---

### DogCard

**Purpose:** Dogs index item (brand §7.5).

| Prop | Type | Required |
|------|------|----------|
| `slug` | string | Yes |
| `name` | string | Yes |
| `role` | `'sire' \| 'dam'` | Yes |
| `photoSrc` | string \| null | Yes |
| `photoAlt` | string | When photo |
| `hasHealthLinks` | boolean | No |

**Variants:** `photo | placeholder` — auto from `photoSrc`. Card `#1C1C1E`.

---

### PlaceholderSlot

**Purpose:** Honest empty media (brand §6).

| Prop | Type | Required |
|------|------|----------|
| `aspectRatio` | `'16/9' \| '3/2' \| '4/5'` | Yes |
| `label` | string | Yes |
| `variant` | `'hero' \| 'dog' \| 'environment'` | No |

**Spec:** bg `#161616`, 1px border `#2A2A2E`, centered monogram 12% opacity, no shimmer.

---

### InquiryForm + PackageModeHeader

**Purpose:** `/inquire` conversion (PRD form spec + brand §7.6).

| Prop | Type | Required |
|------|------|----------|
| `packageMode` | `'A' \| 'B'` | Yes |
| `onSuccess` | callback | Yes |

**PackageModeHeader variants:**

| Mode | Headline | Subhead |
|------|----------|---------|
| A | Join our interest list | Brief capture; no deposit language |
| B | Submit inquiry for waitlist consideration | Deposit-after-approval disclaimer |

**Form fields:** See PRD § Inquiry form specification — shared + Package B extras.

**Implementation:** react-hook-form + zod; shadcn Form primitives.

---

### PageHero

| Prop | Type | Required |
|------|------|----------|
| `title` | string | Yes |
| `description` | string | No |
| `badge` | ReactNode | No — TierBadge slot |

---

### SiteHeader / MobileNav

| Prop | Type | Required |
|------|------|----------|
| `navItems` | `NavItem[]` | Yes — locked order |
| `inquireHref` | string | Default `/inquire` |

---

## shadcn components to install

Phase 9 engineer runs:

```bash
npx shadcn@latest init
npx shadcn@latest add button card form input select textarea checkbox badge separator navigation-menu sheet label
```

**Config notes:**

- `cssVariables: true`
- `baseColor: neutral` then override with blacksage **dark** tokens in `globals.css`
- `tailwind.config.ts` — extend with §Design system colors

**Do not install:** carousel, dialog (except Sheet), chart.  
**Allow as lazy deps (hero only):** `three`, `@react-three/fiber`, `@react-three/drei` (no ScrollControls).

---

## Responsive breakpoints & layout grid

### Breakpoints (Tailwind defaults)

| Token | Min width | Layout behavior |
|-------|-----------|-----------------|
| `sm` | 640px | Proof band 2-col; dog grid 1-col |
| `md` | 768px | Header full nav; proof band 2×2; hero may split |
| `lg` | 1024px | Dog grid 3-col; hero 40/60 split |
| `xl` | 1280px | max-w-content centered; hero + proof above fold target |
| `2xl` | 1536px | No wider content — maintain 72rem cap |

### Mobile hero spec

| Breakpoint | Layout |
|------------|--------|
| `< md` | Stack: wordmark → h1 → subhead → WebGL plane (aspect 16:9, min-h 200px) → text CTAs → proof band |
| `md–lg` | Optional 50/50 split if viewport height ≥ 700px |
| `≥ lg` | 40/45 copy \| 55/60 WebGL plane; hero total ~45–55vh |

| Concern | Rule |
|---------|------|
| Min height | 320px hero region; proof band peeks without scroll on 1280×800 |
| Touch | No orbit drag; links 44×44px |
| Performance | DPR cap 1.5; optional skip WebGL via `NEXT_PUBLIC_REDUCE_3D` / low-end |
| Type legibility | Full-width scrim under headline if canvas behind text |

### Grid system

| Context | Columns | Gutter | Max width |
|---------|---------|--------|-----------|
| Page shell | 12 (conceptual) | px-6 md:px-8 | 72rem |
| Home hero | 2-col lg / stack sm | 24px | full content |
| Proof band | 4 → 2×2 → 1×4 | 24px / 16px mobile | full content |
| Dog grid | 3 / 2 / 1 | 24px | full content |
| Evidence grid | 2 / 1 | 24px | full content |
| Form | 1 | — | 35rem |
| Prose | 1 | — | 68ch |

### Spacing

| Token | Desktop | Mobile |
|-------|---------|--------|
| Section vertical | `py-section` (5rem) | `py-12` (3rem) |
| Card padding | `p-6` to `p-8` | `p-6` |
| Header height | 64px | 56px |

---

## Accessibility (WCAG 2.2 AA)

Harmonize PRD M-15 (2.1) → **2.2 AA** per Phase 10 review.

| Requirement | Implementation |
|-------------|----------------|
| **Skip link** | First focusable; targets `#main-content` |
| **Landmarks** | `<header>`, `<nav aria-label="Primary">`, `<main>`, `<footer>` |
| **Headings** | One h1 per page; logical h2–h4 order |
| **Focus** | `:focus-visible` 2px tan ring, 2px offset on all interactives |
| **Contrast** | `#F5F2EB` on `#0E0E0E` ~15.8:1; CTA dark text on tan |
| **Forms** | `<label htmlFor>`; errors via `aria-describedby`; required `aria-required` |
| **Images** | Meaningful alt; PlaceholderSlot honest labels; hero poster not program proof |
| **Motion** | 3D not required for meaning; see §Motion |
| **Touch targets** | Min 44×44px for nav, buttons, checkbox |
| **Keyboard** | Full nav + form without mouse; Sheet trap focus; WebGL not keyboard-required |
| **Reduced motion** | `@media (prefers-reduced-motion: reduce)` — static poster only |

**Testing:** axe-core 0 critical/serious on Home (with fallback), `/health`, `/inquire` (NFR-A11Y-001).

---

## Motion

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

## Performance

### Static-first + hero island

| Page | Strategy |
|------|----------|
| Home | RSC shell; `HomeHero` client island dynamically imports Three/R3F; **poster is LCP** |
| Health, About, Dogs | RSC; SSG — **no Three.js** |
| Dogs/[slug], Litters/[slug] | SSG + `generateStaticParams` when CMS/static data |
| Inquire | RSC shell; client island for form only |
| API `/api/inquire` | Edge or Node route handler |

### RSC vs client boundaries

| Component | Server | Client |
|-----------|--------|--------|
| ProofSummaryBand, EvidenceGrid, DogCard, DogGrid | ✓ | |
| PlaceholderSlot | ✓ | |
| HomeHero (copy column) | ✓ partial | ✓ WebGL slot |
| HeroIsland, HeroIslandCanvas | | ✓ lazy |
| HeroIslandFallback | ✓ (SSR poster) | |
| SiteHeader (scroll state) | | ✓ minimal |
| MobileNav Sheet | | ✓ |
| InquiryForm | | ✓ |
| Optional section fade | | ✓ — disable when reduced motion |

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

**Bundle rule:** `three`, `@react-three/fiber`, `@react-three/drei` — **hero route only** via dynamic import. **Ban:** `ScrollControls`, scroll timeline deps, site-wide Three import.

### Mobile / low-end

| Rule | Spec |
|------|------|
| Hero height | 45–55vh desktop; min **320px** mobile; stack copy above canvas |
| Touch | No drag-to-orbit required; passive scroll; 44×44px tap targets on CTAs |
| DPR cap | `[1, 1.5]` on mobile |
| Optional flag | `NEXT_PUBLIC_REDUCE_3D=1` or `useLowEndDevice()` → fallback only |
| Save-Data | Respect `navigator.connection.saveData` → skip WebGL |

### Images

- `next/image` with width/height
- Lazy-load below fold
- Operator photos in paper-legacy mats inside dark elevated cards — not full-bleed neon frames

---

## Anti-patterns — v1 + Mode E + Option B scope

**Do not port** scroll-3D from `apps/blacksage-kennels`. Contained hero WebGL island is **not** permission for a “3D website.”

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
| Two-route only (`/` + `/apply`) | Wrong IA | Multi-page; `/inquire` |
| Nav: Heritage → … → Apply | Contradicts U1 | Home → Dogs → Health → About → Inquire |
| Cormorant display-at-8xl hero wordmark | Spectacle | Compact h1 + flat wordmark |
| `apps/blacksage-kennels` scroll port | SD7 | New tree; island ≠ ScrollScene |
| **Misread:** "hero island = 3D website" | Scope creep to Option C | Single lazy canvas; proof band below |

**PRD AC mapping:** E1–E5, V2, U1, M-04, M-32 — Mode E lessons held; Option B narrow exception only.

---

## Phase 9 build checklist

### Foundation

- [ ] New Next.js App Router project (do not extend `apps/blacksage-kennels` scroll structure)
- [ ] Tailwind + shadcn with **blacksage dark tokens** (not light paper)
- [ ] CSS vars from `11-brand-system.md` §3
- [ ] Fonts: Libre Baskerville + Source Sans 3 via `next/font`
- [ ] Global layout: SiteHeader, SiteFooter, SkipLink
- [ ] Locked nav order and `/inquire` route

### Pages

- [ ] Home with `HomeHero` + ProofSummaryBand (4 cells) below hero
- [ ] `/dogs` index + empty state
- [ ] `/dogs/[slug]` template (gated on data)
- [ ] `/health` with EvidenceGrid + placement anchors
- [ ] `/about`
- [ ] `/inquire` Package A/B modes
- [ ] `/litters` conditional on Q1 flag
- [ ] `not-found.tsx`, `sitemap.ts`

### Home / hero (Option B)

- [ ] `HomeHero` composes wordmark, h1, subhead, CTA links, `HeroIsland`
- [ ] `HeroIslandFallback` SSR poster — **LCP preload**
- [ ] Dynamic import `HeroIslandCanvas` — no Three in main bundle
- [ ] `prefers-reduced-motion` → fallback only
- [ ] `NEXT_PUBLIC_REDUCE_3D` env flag documented
- [ ] ProofSummaryBand **below** hero in DOM — 4 cells + hero above fold on 1280×800
- [ ] GLB pipeline: optimize ≤15MB (prefer ≤8MB); Draco; texture max 2K
- [ ] License diligence checklist complete before purchase

### Components

- [ ] HomeHero, HeroIsland*, ProofSummaryBand, EvidenceGrid, OfaLinkCard, TierBadge
- [ ] DogCard, DogGrid, PlaceholderSlot
- [ ] InquiryForm, PackageModeHeader, InquiryConfirmation
- [ ] PageHero, ProseSection, MobileNav Sheet

### Quality gates

- [ ] Three.js/R3F **only** in lazy hero chunk — not site-wide
- [ ] **No** ScrollControls, scroll-timeline, full-page SceneCanvas
- [ ] WebGL context loss → graceful fallback
- [ ] axe-core 0 critical on Home (fallback), Health, Inquire
- [ ] Lighthouse mobile ≥ 85 with WebGL enabled (or document waiver if poster-only staging)
- [ ] Keyboard nav + focus visible all pages
- [ ] `prefers-reduced-motion` respected (static poster)
- [ ] Form honeypot + server validation
- [ ] Q7 destination configured before public launch
- [ ] Tier 1 copy only until operator sign-off Tier 2
- [ ] `/apply` → `/inquire` redirect if needed

### Explicitly do not build

- [ ] Full-page R3F narrative or scroll-driven camera
- [ ] Badges/chips overlaid on hero 3D canvas
- [ ] Light-paper primary theme
- [ ] Animated wordmark in WebGL
- [ ] Pricing, cart, payment fields
- [ ] Stock dog photography presented as program proof
- [ ] FOMO timers, "Available now" ribbons
- [ ] Full-site light-mode toggle

---

## Handoff notes

### copy-chief (Phase 13 contrast pass)

| Item | Guidance |
|------|----------|
| Voice | brand §5; `.agents/product-marketing.md` |
| Home h1/subhead | Unchanged from `14-pages/home.md` — composition adds WebGL beside copy |
| Hero CTA | No primary CTA in viewport 1; text links only |
| Proof band | Standards, Health, Dogs, Process — no superlatives |
| Contrast | Ensure `#B8B4AC` subheads readable on `#0A0A0A` scrim |
| CTA | **Begin your inquiry** only on buttons; nav "Inquire" |
| Don't | Rewrite IA/CTA; guard-dog hype; invented OFA results |

### Phase 9 engineer (CTO delta)

| Item | Guidance |
|------|----------|
| Stack | Next.js App Router, TypeScript, Tailwind, shadcn/ui |
| Reference | This doc + `11-brand-system.md` + `05-prd.md` |
| Anti-reference | `apps/blacksage-kennels` scroll stack — do not copy |
| Hero | `components/three/HeroIsland*` per §HeroIsland; ship **poster-only** until licensed GLB |
| Data | `lib/content/*` static v1; CMS optional later |
| Package mode | Env `INQUIRY_PACKAGE_MODE=A|B` or CMS flag from Q1 |
| 3D flag | `NEXT_PUBLIC_REDUCE_3D=1` documented |
| Form | POST `/api/inquire` → Q7 destination; zod validation |
| SEO | Metadata per page; JSON-LD Organization; LocalBusiness when Q2 |
| Tests | TDD: `shouldEnableWebGL()` gates; proof band below hero; reduced-motion skips Canvas; redirect /apply |
| Performance | Poster LCP; dynamic import Three; GLB ≤15MB |

### creative-director

- Verify Mode E anti-patterns absent; hero island ≠ scroll-3D
- Confirm proof band + hero visible above fold in Phase 9 staging
- Sign-off before copy contrast lock (Phase 13)

---

## Open items

| Item | Owner | Blocks |
|------|-------|--------|
| Q1 program maturity | Operator | Litters nav; Package B |
| Q2 geography/contact | Operator | About contact; footer; schema |
| Q6 photography | Operator | DogCard photos; optional stills matching black/tan |
| Q7 inquiry destination | Operator | Public launch |
| Commercial 3D asset budget + license | Operator / CTO | GLB purchase (not design merge) |
| Undocked-tail hard yes | Operator (CEO assumed yes) | Asset selection |
| Health inventory | Operator | OfaLinkCard population |
| Logo SVG | Phase 14 | Header favicon |
| `/education` redirect | Engineer | Optional alias |
| Phase 13/14 contrast pass | copy-chief | Light→dark surface copy only |

---

## Sources

- `11-brand-system.md` — §3–8, §10, §12, §15 (Option B tokens, hero material, proof UI)
- `HANDOFFS/22-ceo-operator-feedback-3d-brand.md` — Option B locks, model shortlist §6
- `HANDOFFS/11b-csuite-review.md` — Phase 11-b approve
- `HANDOFFS/12b-web-designer.md` — IC craft source for this merge
- `14-pages/home.md` — hero copy structure
- `05-prd.md` — IA, form spec, failure layers, NFR
- `03-strategy.md` — SD1–SD8, IA lock, CTA hierarchy
- `apps/blacksage-kennels` — anti-pattern reference only (Mode E)
- Model: `llm_tier: creative-language` (CD merge), IC `strong-general` / `composer-2.5-fast`, `generation_profile: brand-stills`, `generation_used: none`
