# Design: Super Patch Income Stack — Animated Affiliate Deck

**Date:** 2026-08-06  
**Status:** Draft — pending operator review of this spec before implementation planning  
**Branch:** `feature/superpatch-income-stack-deck`  
**Approach:** Peer Superpatch agency + creative-seat hybrid motion presentation  
**Related:** [Agency → Customer → Initiative](./2026-08-06-agency-customer-initiative-design.md), `income-stack-deck/README.md`, `skills/org/positions/creative-director/SKILL.md`

## Jobs to be done

| Job | Outcome |
|-----|---------|
| House Super Patch work outside Blacksage / Velocity customers | New agency org `superpatch` in `projects/registry.json` |
| Ship an enterprise affiliate presentation | Mobile-first scroll deck with animated concept plates + on-slide copy |
| Preserve provided compensation narrative | No rewrite of stack definitions or earnings figures |
| Use creative seats / skills, not a full 0–22 runbook | Creative Director → brand-designer + web-designer; legal consult on disclosures only |

## Portfolio placement

| Layer | Slug | Display name |
|-------|------|----------------|
| Agency (org) | `superpatch` | Superpatch |
| Customer | `affiliates` | Affiliates |
| Initiative | `income-stack-deck` | Income Stack Deck |

**Active triple after scaffold:** `{ org: "superpatch", customer: "affiliates", initiative: "income-stack-deck" }`

**Paths (new initiative layout):**

```
docs/orgs/superpatch/customers/affiliates/initiatives/income-stack-deck/business-idea/
docs/orgs/superpatch/customers/affiliates/initiatives/income-stack-deck/MEMORY/
memorybank/org/superpatch/affiliates/income-stack-deck/   # when Obsidian sync applies
```

**Registry:** Add `superpatch` as a peer of `velocity-agency` (extends portfolio beyond the prior “single agency UI” non-goal; OCC must resolve the new org via existing v2 registry helpers). Creating the org does not migrate or alter Blacksage Kennels paths.

**Concept asset source of truth:** Existing repo-root `income-stack-deck/` (15 PNGs + README). On implementation, copy (do not mutate meaning) into:

```
…/income-stack-deck/business-idea/assets/concepts/
apps/superpatch-income-stack/public/concepts/
```

## Non-goals

- Full business-idea runbook (phases 0–22) for Superpatch
- Changing compensation plan numbers, rank names, or stack definitions
- Nesting under `blacksage-kennels` or treating this as a Velocity customer project
- Image→video for all 15 frames (hero clips only)
- Replacing provided concept meaning with a new art direction that contradicts v1 frames

## Product: animated presentation

### App

- **Path:** `apps/superpatch-income-stack/`
- **Stack:** Vite + React + TypeScript + Tailwind
- **Motion:** GSAP + ScrollTrigger (+ ScrollToPlugin as needed); skills: `gsap-react`, `gsap-scrolltrigger`, `gsap-plugins`
- **Optional 3D:** Small Three.js / R3F accents only where they reinforce flywheel/stack motifs — not a full scene rebuild of every plate
- **Optional AI video:** 3–5 muted hero loops via existing image→video tooling (OpenMontage / fal); fallback to still + GSAP if generation fails

### Interaction

- Mobile-first vertical scroll; one slide ≈ one viewport; soft snap + scrubbed entrance
- Desktop: same narrative, wider cinematic framing, identical copy density
- `prefers-reduced-motion: reduce` → static plates, no scrub timelines
- Progress indicator + optional section dots (Income Stack / Full Stack / Close)

### Visual system

| Token | Value / rule |
|-------|----------------|
| Background | Near-black navy `#05070F` + soft radial gradients |
| Accents | Neon blue, green, orange, violet — one primary accent per stack section |
| Signature | SP Red `#DD0604` for rare focal moments only |
| Type | Display: Montserrat Black / Avenir-class web fonts; uppercase headlines; body 30–50 words |
| Recurring motif | Full Stack Flywheel SVG — full hero on slide 04; corner motif on section openers with active arc lit |
| Layout | Apple × Nike × McKinsey keynote: cinematic imagery, custom diagrams, no bullet walls |

### Copy layer (required on every slide)

- Each slide renders **eyebrow + headline + body** sourced from the provided Full Stack / Income Stack outline
- Body length: **30–50 words** (trim for voice; do not invent facts)
- Compensation figures stay **exactly as provided** (e.g. 25% weekly retail; Fast Start $200–$2,000; RAB up to $100,000; Level 1/2/3–5 overrides; leadership bonuses; Global 1% pool)
- Final type is **not** baked into concept PNGs; type lives in the app over a gradient scrim / safe zone
- Money / earnings slides include a short **income disclosure** line (legal-counsel consult; wording only)
- SSOT for strings: `apps/superpatch-income-stack/src/data/slides.ts` (mirrored brief under initiative `assets/copy/SLIDES.md` if seats need a markdown view)

### Motion approach (hybrid — locked)

1. **All 15 plates:** animate in-app (Ken Burns, parallax layers, mask reveals, SVG/Canvas overlays for flywheel and stack diagrams)
2. **Hero AI video (max 3–5):** candidate slides `01`, `04`, `06`, `14`, `15` — short muted loops; still+GSAP fallback
3. Do not regenerate concept meaning; polish/regenerate imagery only when Creative Director approves parity with v1 frames

## Slide map (15)

| # | File (concept) | Section | Accent | On-slide story (from provided copy) | Motion |
|---|----------------|---------|--------|-------------------------------------|--------|
| 01 | `sp-stack-01-title.png` | Open | blue | Income Stack™ — 10 ways to build life-changing income; not a single commission | Parallax glass slabs + light sweep; optional hero loop |
| 02 | `sp-stack-02-the-question.png` | Struggle | cool | Single-path affiliate fatigue → need multiple streams | Slow Ken Burns + lamp glow |
| 03 | `sp-stack-03-four-stacks.png` | Full Stack | multi | Product, Brand & Marketing, Income, Personal Development | Pillars light in sequence |
| 04 | `sp-stack-04-flywheel.png` | Flywheel | multi | Each stack reinforces the others; self-reinforcing ecosystem | SVG flywheel scrub; optional hero loop |
| 05 | `sp-stack-05-ecosystem.png` | Compounds | violet | Better products → brand → awareness → income → leaders → community → customers | Node mesh resolve |
| 06 | `sp-stack-06-ten-layers.png` | Income open | orange | Every new activity can unlock another stream without replacing the last | Exploded layers; optional hero loop |
| 07 | `sp-stack-07-retail.png` | Stack 1 | green | 25% retail affiliate commissions; paid weekly through personal link | Coin column + link pulse |
| 08 | `sp-stack-08-fast-start.png` | Stack 2 | orange | Fast Start $200–$2,000; Rank Advancement Bonuses up to $100,000 | Platform leap scrub |
| 09 | `sp-stack-09-team-overrides.png` | Stack 3 | blue | Team overrides up to 15% / 10% / 4% on Bonus Volume by level | Root tiers draw |
| 10 | `sp-stack-10-unlimited-depth.png` | Stack 4 | violet | Managing Director unlimited depth 2% past level 5 to next MD | Concentric rings deepen |
| 11 | `sp-stack-11-vp-override.png` | Stack 5 | blue | Vice President 2% down each leg to next VP | Legs of light descend |
| 12 | `sp-stack-12-generations.png` | Stack 6 | green | 3% Generation Bonuses through up to three VP generations | Three rings expand |
| 13 | `sp-stack-13-executive.png` | Stacks 7–8 | orange | Executive Leadership up to +2%; CEO Leadership $10k–$20k/mo at President / Global President | Summit reveal |
| 14 | `sp-stack-14-global-pool.png` | Stacks 9–10 | violet | Global President +1% override; Global 1% Leadership Pool for NVP+ | Earth arcs; optional hero loop |
| 15 | `sp-stack-15-closing.png` | Close | red hit | One opportunity, ten streams; build customers, leaders, leverage, future | Horizon settle; optional hero loop |

## Creative seats & skills

| Seat | Role | May write |
|------|------|-----------|
| `creative-director` | Art direction, flywheel consistency, merge QA | Initiative creative briefs, approve production |
| `brand-designer` | Tokens, iconography, concept parity / polish | `assets/concepts/`, brand notes |
| `web-designer` | Scroll UX, slide composition, GSAP treatments | `apps/superpatch-income-stack/` |
| `legal-counsel` | Consult only | Disclosure line wording — no plan rewrite |
| `video-producer` | Optional | Only if hero image→video clips are produced |

**Skill packs (required reads for builders):**

- `skills/org/positions/creative-director/SKILL.md`
- `skills/org/packs/production-artifacts/SKILL.md`
- `skills/org/packs/photoreal-stills/SKILL.md` (if regenerating stills)
- OpenMontage GSAP skills (`gsap-react`, `gsap-scrolltrigger`, `gsap-plugins`)
- FLUX / visual-style packs only when regenerating or extending concept imagery

**Orchestration style:** Thin creative track — orchestrator (or operator) spawns Creative Director; CD spawns brand + web with non-colliding `write_lease`. No kennel-style full phase tracker required; a short initiative `RUNBOOK-TRACKER.md` may list Craft → Production → Wire for the deck app only.

## Architecture (app)

```
apps/superpatch-income-stack/
  public/concepts/          # v1 PNGs (+ optional hero .mp4/.webm)
  src/
    data/slides.ts          # copy + accent + media + motion preset per slide
    components/
      DeckShell.tsx         # scroll root, progress, reduced-motion
      Slide.tsx             # plate + scrim + copy
      Flywheel.tsx          # shared SVG motif
      diagrams/             # stack-specific infographics
    motion/                 # ScrollTrigger presets per slide id
    styles/tokens.css       # navy, accents, type scale
```

**Data contract (`slides.ts` entry):** `id`, `conceptSrc`, `heroVideoSrc?`, `accent`, `eyebrow`, `headline`, `body`, `disclosure?`, `flywheelArc?`, `motionPreset`, `diagram?`.

## Testing

- Unit: `slides.ts` — every slide has eyebrow/headline/body; body word count 30–50; required disclosure flag on money slides
- Playwright (or equivalent): mobile viewport scroll through all 15; copy visible; reduced-motion path
- Manual Creative Director checklist: flywheel consistency, accent ownership, no invented numbers vs source outline

## Delivery sequence (implementation plan will expand)

1. Scaffold registry org/customer/initiative + MEMORY; copy concepts into initiative + app `public/`
2. Creative Director brief + brand tokens
3. Vite app shell + `slides.ts` with full copy
4. GSAP treatments for all 15; Flywheel component
5. Optional hero image→video for 01/04/06/14/15
6. Legal disclosure pass
7. Mobile QA + reduced-motion + production handoff note under initiative

## Open decisions (resolved in design)

| Topic | Decision |
|-------|----------|
| Portfolio shape | Peer agency `superpatch` / customer `affiliates` / initiative `income-stack-deck` |
| Runbook depth | Creative seats only; not full 0–22 |
| Source content | Provided outline + `income-stack-deck` v1 — do not change meaning |
| Motion | Hybrid A — GSAP/React on all plates; AI video on ≤5 heroes |
| Copy | On-slide text required on every slide |
| App home | `apps/superpatch-income-stack/` |
