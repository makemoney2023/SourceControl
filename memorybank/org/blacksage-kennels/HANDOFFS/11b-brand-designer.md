---
phase: "11-b"
position: brand-designer
reports_to: creative-director
status: done
verdict_for_manager: ready_to_merge
llm_tier: creative-language
llm_model: composer-2.5
generation_profile: brand-stills
generation_used: none
fallback_applied: false
---

# Handoff — Phase 11-b Black/Tan Token Reopen → Creative Director

## Goal (from context packet)

Remap brand color/material tokens to **black and tan (ADRK-aligned)** for **Option B** (CEO locked): dark ground default, tan accents, contained hero WebGL exception owned by Phase 12. Draft complete token tables, CSS variables, Tailwind extension, imagery guidance for dark cinematic hero (contained 3D Rottweiler — not gamer neon), and document that light-paper `#FAFAF8` is **superseded** for primary surfaces. Preserve voice, type, IA, CTA, proof UI patterns, and D2 trust-first hierarchy.

---

## 1. Supersede note (Option B)

| Layer | Phase 11 (light editorial) | Phase 11-b (Option B) | Preserved unchanged |
|-------|---------------------------|------------------------|---------------------|
| **Default surface mode** | Editorial light `#FAFAF8` paper | **Dark ground** `#0E0E0E` near-black | — |
| **Accent logic** | Tan `#8B7355` + sage on light | **Rich ADRK tan** `#C4A35A` primary; sage as secondary badge accent | Tan-as-marking metaphor |
| **Hero treatment** | Static proof band; no WebGL | **Contained hero WebGL slot** (Phase 12) + static photoreal fallback | Proof-before-inquire pathway |
| **Voice & tone** | D2 trust-first | **Unchanged** | §5 voice, ADRK bounds, no machismo |
| **Typography** | Libre Baskerville + Source Sans 3 | **Unchanged** — contrast tweaks only (see §5) | Scale, weights, load snippet |
| **IA & nav** | Home → Dogs → Health → About → Inquire | **Unchanged** | U1 lock |
| **CTA** | "Begin your inquiry" → `/inquire` | **Unchanged** | Tertiary hierarchy on Home |
| **Packages** | A → B → C visual modes | **Unchanged** | §7.6 patterns |
| **Proof UI vocabulary** | Evidence grid, OFA cards, tier badges | **Unchanged structure** — color deltas only (§9) | D2 evidence density |
| **SD4 scroll-3D** | NO full-page R3F | **Still NO** scroll-3D / full-page R3F; **narrow hero-only WebGL exception** per Phase 22 CEO brief | Mode E anti-pattern |

**Superseded tokens (do not use as page default):**

- `--color-paper` / `#FAFAF8` as `--color-bg-primary`
- `--color-paper-warm` / `#F5F3EF` as section default
- Light-default semantic mapping in Tailwind `blacksage.paper.*` as site background

**Legacy retention (narrow use only):**

- `#FAFAF8` / `#FFFFFF` may appear **inside** elevated photo cards or form panels when operator photography needs neutral surround — never as page ground.

---

## 2. Full core + semantic token tables (locked hex)

### 2.1 Core palette

| Token | Hex | Role |
|-------|-----|------|
| `--color-ground` | `#0E0E0E` | Primary page background (near-black; avoids pure `#000` crush) |
| `--color-ground-elevated` | `#161616` | Cards, nav bar, form panels on dark |
| `--color-ground-lifted` | `#1C1C1E` | Proof band, footer, hero text column backdrop |
| `--color-charcoal-soft` | `#242428` | Nested cards, hover states on dark |
| `--color-graphite` | `#B8B4AC` | Secondary text on dark |
| `--color-stone` | `#8A8680` | Tertiary text, placeholders on dark |
| `--color-border` | `#2A2A2E` | Dividers, card borders on dark |
| `--color-border-strong` | `#3A3A40` | Input borders, table rules on dark |
| `--color-tan` | `#C4A35A` | Primary accent — links (large/UI), CTA fill, marking highlights |
| `--color-tan-deep` | `#A67C52` | CTA hover, active link, pressed states |
| `--color-tan-soft` | `#D4B87A` | Badge accents, subtle rules, icon highlights |
| `--color-sage` | `#7A8F7E` | Secondary accent — category badges, proof labels (lifted for dark) |
| `--color-sage-deep` | `#5C6B5E` | Sage text on dark (large/caption only) |
| `--color-sage-muted` | `#6B7A6E` | Muted tier badges on dark |
| `--color-black-coat` | `#0A0A0A` | Dog coat reference in imagery/3D — not UI ground |
| `--color-paper-legacy` | `#FAFAF8` | **Legacy** — photo card interior / form field bg only |
| `--color-white-elevated` | `#FFFFFF` | Form input fill on dark panels |

### 2.2 Semantic tokens (dark default)

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg-primary` | `#0E0E0E` | Page background |
| `--color-bg-secondary` | `#161616` | Alternating sections |
| `--color-bg-elevated` | `#1C1C1E` | Proof modules, cards, form panel shell |
| `--color-bg-dark-band` | `#0A0A0A` | Hero WebGL surround / deepest cinematic frame (hero region only) |
| `--color-bg-proof-band` | `#141414` | Proof summary band — slightly lifted with optional tan rule |
| `--color-text-primary` | `#F5F2EB` | Headlines, body on dark (warm off-white) |
| `--color-text-secondary` | `#B8B4AC` | Supporting copy |
| `--color-text-muted` | `#8A8680` | Labels, captions |
| `--color-text-on-tan` | `#0E0E0E` | Text on tan CTA fill |
| `--color-text-on-dark` | `#F5F2EB` | Alias for primary on dark |
| `--color-accent-primary` | `#C4A35A` | Primary button fill, key links (UI/large) |
| `--color-accent-secondary` | `#7A8F7E` | Secondary button outline, category badges |
| `--color-border-subtle` | `#2A2A2E` | Card edges on dark |
| `--color-border-accent` | `#C4A35A` at 35% opacity | Proof band top rule, focus-adjacent dividers |
| `--color-focus-ring` | `#C4A35A` | `:focus-visible` — 2px ring, 2px offset |
| `--color-success` | `#6B9A72` | Form success (lifted sage-green) |
| `--color-error` | `#C47070` | Form errors (muted red, readable on dark) |

---

## 3. CSS `:root` custom properties (copy-paste ready)

```css
:root {
  /* Core — Option B dark default */
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

  /* Semantic — dark default */
  --color-bg-primary: var(--color-ground);
  --color-bg-secondary: var(--color-ground-elevated);
  --color-bg-elevated: var(--color-ground-lifted);
  --color-bg-dark-band: var(--color-black-coat);
  --color-bg-proof-band: #141414;
  --color-text-primary: #F5F2EB;
  --color-text-secondary: var(--color-graphite);
  --color-text-muted: var(--color-stone);
  --color-text-on-tan: var(--color-ground);
  --color-text-on-dark: var(--color-text-primary);
  --color-accent-primary: var(--color-tan);
  --color-accent-secondary: var(--color-sage);
  --color-border-subtle: var(--color-border);
  --color-border-accent: rgba(196, 163, 90, 0.35);
  --color-focus-ring: var(--color-tan);
  --color-success: #6B9A72;
  --color-error: #C47070;

  /* Hero / WebGL island (Phase 12) — material refs only, not page-wide */
  --hero-fog: #0A0A0A;
  --hero-rim-warm: rgba(196, 163, 90, 0.12);
  --hero-key-fill: rgba(245, 242, 235, 0.08);
}
```

**shadcn/ui mapping (Phase 12):**

```css
:root {
  --background: var(--color-bg-primary);
  --foreground: var(--color-text-primary);
  --card: var(--color-bg-elevated);
  --card-foreground: var(--color-text-primary);
  --primary: var(--color-accent-primary);
  --primary-foreground: var(--color-text-on-tan);
  --secondary: var(--color-bg-secondary);
  --secondary-foreground: var(--color-text-primary);
  --muted: var(--color-charcoal-soft);
  --muted-foreground: var(--color-text-muted);
  --accent: var(--color-accent-secondary);
  --accent-foreground: var(--color-text-primary);
  --border: var(--color-border-subtle);
  --input: var(--color-border-strong);
  --ring: var(--color-focus-ring);
}
```

---

## 4. Tailwind `colors.blacksage.*` extension (dark default)

```javascript
// tailwind.config — colors.blacksage.*
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
      legacy: '#FAFAF8', // photo/form interior only — not page bg
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
}
```

---

## 5. WCAG 2.2 AA contrast notes (text / CTA on dark)

| Pair | Ratio (approx.) | Pass | Usage rule |
|------|-----------------|------|------------|
| `#F5F2EB` on `#0E0E0E` | **~15.8:1** | AA + AAA all sizes | Body, headlines, nav |
| `#B8B4AC` on `#0E0E0E` | **~9.5:1** | AA all sizes | Secondary copy |
| `#8A8680` on `#0E0E0E` | **~5.2:1** | AA normal text | Captions, placeholders only |
| `#C4A35A` on `#0E0E0E` | **~7.8:1** | AA normal; AAA large | Links, overlines, UI labels — prefer underline on body links |
| `#C4A35A` on `#161616` | **~7.2:1** | AA normal | Links on elevated cards |
| `#0E0E0E` on `#C4A35A` (CTA fill) | **~7.8:1** | AA all sizes | **Primary button** — use dark text on tan fill |
| `#7A8F7E` on `#0E0E0E` | **~5.6:1** | AA normal | Sage badges — large/caption preferred for smaller sizes |
| `#F5F2EB` on `#C4A35A` | **~2.0:1** | **Fail** | **Do not** use white text on tan fill |
| Tan outline CTA (`border tan`, text tan) | **~7.8:1** | AA | Secondary/tertiary button variant |

**Typography contrast tweaks (Libre Baskerville + Source Sans 3 preserved):**

- Headlines: `#F5F2EB` on ground — no change to families or scale.
- Body links: default `#F5F2EB` with tan underline `#C4A35A`; hover underline deepens to `#A67C52`. Avoid tan-only body links below 18px without underline.
- Form labels: `#B8B4AC` minimum; never `#8A8680` for required field labels.
- Libre Baskerville display-xl on hero: ensure text sits on `#141414`–`#1C1C1E` scrim if overlaid on WebGL — never directly on busy 3D without 60%+ dark gradient scrim.

---

## 6. Hero / 3D material guidance (Phase 12 composition)

**Intent:** Dark cinematic prestige **without** gamer neon, purple glow, or scroll-jacking. Contained WebGL island only — Phase 12 owns layout; brand owns material/lighting language.

### 6.1 Scene framing

| Element | Spec |
|---------|------|
| **Canvas region** | Fixed hero viewport slice (~45–55vh desktop; min 320px mobile height); lazy-loaded; not full-page |
| **Surround** | `#0A0A0A`–`#0E0E0E` gradient falloff into page ground — no hard clip box visible |
| **Fallback** | Static photoreal Rottweiler or editorial kennel still — same dark surround; `prefers-reduced-motion` → fallback only |
| **Scroll** | **No** scroll-driven camera; optional subtle idle loop (breath/tail) ≤ 2s period |

### 6.2 Lighting language (WebGL island)

| Light | Spec | Avoid |
|-------|------|-------|
| **Key** | Soft warm directional ~4500K from upper-left; intensity low — reveal coat structure | Harsh spotlight, lens flare |
| **Fill** | Cool-neutral fill `#1A1A1C` ambient — preserve black coat depth | Flat ambient washing markings |
| **Rim** | `--hero-rim-warm` `rgba(196,163,90,0.12)` max — subtle tan edge on markings only | Purple/cyan rim, neon bloom |
| **Fog** | `--hero-fog` `#0A0A0A` exponential — model dissolves into ground | Colored fog, god-ray stacks |
| **Env map** | Neutral studio HDRI or muted interior — no cyber city nights | HDR neon environments |

### 6.3 Dog material (breed-accurate)

| Attribute | Spec |
|-----------|------|
| **Coat black** | Base `#0A0A0A`–`#121212`; roughness 0.55–0.7; subtle anisotropic highlight — not plastic |
| **Tan markings** | `#C4A35A` base, `#A67C52` in shadow creases; crisp ADRK/FCI boundary — not airbrushed |
| **Eyes** | Dark brown, moist spec — not glowing |
| **Tail** | **Natural undocked** preferred (German/ADRK presentation) |
| **Pose** | Calm alert stand or sit — structure visible; not snarling, not "guard dog" aggression |

### 6.4 Static photoreal fallback tone

When WebGL unavailable: full-body or 3/4 Rottweiler on `#0E0E0E` with soft vignette; true-to-life markings; same tan hex reference in grade; **no** purple/teal color grade; **no** stock uncanny AI dog.

### 6.5 Banned hero aesthetics

- Purple/blue gradient overlays
- Cream + terracotta lifestyle grading
- Neon underglow, RGB rim, bloom > 0.3
- Full-viewport scroll narrative
- Gamer UI frames (hex HUD, scan lines)
- Docked tail unless operator explicitly overrides

---

## 7. Imagery rules deltas (Option B)

| Rule | Phase 11 (light) | Phase 11-b delta |
|------|------------------|------------------|
| **Page default** | Photos in paper cards | Photos in `#161616`–`#1C1C1E` cards; 1px `#2A2A2E` border; optional 2px top tan rule on featured dog |
| **Hero photo** | 16:9 on paper | 16:9 in hero slot beside/alternate to 3D island; dark surround; scrim if text overlay |
| **Placeholder bg** | `#F5F3EF` paper-warm | `#161616` with sage stem/monogram at 10% opacity `#F5F2EB` |
| **Placeholder label** | Graphite on light | `#B8B4AC` on dark |
| **Dog photography grade** | True color on light UI | True color on dark — **lift midtones** slightly so tan markings read; do not crush blacks to `#000` |
| **Tail presentation** | Natural tail noted | **Undocked natural tail preferred** in all breed reference and operator direction |
| **Full-bleed dark cinematic** | Banned site-wide | **Allowed hero region only** — not every Dogs grid cell |
| **AI dog stock** | Prohibited | **Still prohibited** — Tier 3 violation |
| **Education diagrams** | White bg | `#FAFAF8` or `#FFFFFF` diagram interior acceptable — label "breed standard reference" |

**Alt text / honesty:** Unchanged — no marketing fluff; placeholders remain "Placeholder — kennel photography pending."

---

## 8. Logo / wordmark color variants (dark ground)

| Variant | "Blacksage" | "Kennels" | Mark | Use |
|---------|-------------|-----------|------|-----|
| **Primary (dark header)** | `#F5F2EB` | `#C4A35A` | Sage stem `#7A8F7E` | Default header on `#0E0E0E` |
| **Reversed band** | `#F5F2EB` | `#D4B87A` | `#F5F2EB` mono | Footer `#141414`, proof band header |
| **Tan accent lockup** | `#F5F2EB` | `#C4A35A` tracked small caps | Tan mark `#C4A35A` | Hero wordmark when paired with 3D |
| **Mono light** | `#F5F2EB` | `#F5F2EB` | `#F5F2EB` | Watermark / reduced motion fallback hero |
| **Mono tan** | `#C4A35A` | `#C4A35A` | `#C4A35A` | Favicon on `#0E0E0E` bg |
| **Favicon** | — | — | Sage stem or BS monogram on `#0E0E0E` | 16–32px; flat only |

**Don't (unchanged + delta):** No gradients on logo, no 3D bevel, no animated logo inside WebGL scene, no paw prints, no stock Rottweiler silhouette mark.

---

## 9. Proof band / UI pattern color deltas

### 9.1 Proof summary band (Home)

| Element | Phase 11-b spec |
|---------|-----------------|
| Background | `#141414` (`--color-bg-proof-band`) |
| Top rule | 2px `#C4A35A` at 35% opacity or solid `#C4A35A` 1px |
| Cell cards | `#1C1C1E` elevated; border `#2A2A2E` |
| Cell hover | Border `#C4A35A` at 50% opacity |
| Links | `#F5F2EB` with tan underline; "View health approach →" in tan for UI label |
| Sage badge ("Standards") | bg `#6B7A6E` at 25% opacity; text `#7A8F7E` |

### 9.2 Evidence density grid (Health/Education)

| Element | Spec |
|---------|------|
| Card bg | `#1C1C1E` |
| Title | `#F5F2EB` Source Sans 600 |
| Body | `#B8B4AC` |
| Footer link | `#C4A35A` → hover `#A67C52` |
| Section alternate | `#161616` vs `#0E0E0E` striping |

### 9.3 Tier badges (dark)

| Badge | Background | Text |
|-------|------------|------|
| `Standard reference` | `#6B7A6E` at 30% | `#7A8F7E` |
| `Program policy` | `#C4A35A` at 20% | `#D4B87A` |
| `Verified` | `#5C6B5E` | `#F5F2EB` |
| `Coming soon` | `#242428` | `#8A8680` |

### 9.4 OFA / registry link card

- Row bg `#161616`; border `#2A2A2E`
- "View ↗" link `#C4A35A`
- Registry ID mono optional `#B8B4AC`

### 9.5 Dog card (Dogs index)

- Photo area: dark card; placeholder per §7
- Name `#F5F2EB` Libre Baskerville h3
- Health link tan

### 9.6 Inquire form (Package A/B)

| Element | Spec |
|---------|------|
| Page bg | `#0E0E0E` |
| Form panel | `#1C1C1E` shell; inputs `#FFFFFF` fill, `#3A3A40` border |
| Submit | bg `#C4A35A`, text `#0E0E0E`, hover `#A67C52` |
| Secondary outline | border `#7A8F7E`, text `#F5F2EB` |

**Hierarchy unchanged:** Proof band above fold; tertiary "Begin your inquiry" in header — not dominant over Dogs/Health links.

---

## 10. Do / Don't deltas (Option B)

### Do (additions to Phase 11 §9)

- Default to **dark ground** `#0E0E0E` with **warm off-white** `#F5F2EB` type
- Use **ADRK-aligned tan** `#C4A35A` for accents, CTAs, marking metaphor
- Support **contained hero WebGL** with static fallback (Phase 12) — cinematic **editorial**, not game UI
- Keep **proof pathway first** — Dogs, Health, process before inquire CTA
- Use **dark text on tan CTA fill** for AA compliance
- Prefer **natural undocked tail** in all Rottweiler imagery and 3D direction
- Apply **tan rim/fog tokens** sparingly in hero — subtle warmth only
- Test **WCAG 2.2 AA** on dark surfaces (§5)

### Don't (updates to Phase 11 §9 / §10)

| Anti-pattern | Status |
|--------------|--------|
| Light-paper `#FAFAF8` as **primary page surface** | **Superseded — banned as default** |
| Site-wide pure `#000000` crush | **Still banned** — use `#0E0E0E` ground |
| Purple gradients, neon cyberpunk, cream + terracotta AI luxury | **Still banned** |
| Full-page scroll-driven R3F / scroll-jacking | **Still banned** (SD4 narrow exception ≠ full 3D site) |
| Gamer neon rim, purple glow on hero model | **New explicit ban** |
| White text on tan button fill | **New ban** — use `#0E0E0E` on tan |
| AI dog stock / fake program photos | **Still banned** |
| Docked tail as default breed presentation | **Avoid** — undocked preferred |
| Glassmorphism blocking proof above fold | **Still banned** |
| `/apply` route, Buy/Shop CTAs, on-site prices | **Still banned** |

---

## 11. Phase 12 handoff bullets (web-designer)

| Item | Spec |
|------|------|
| **Theme default** | Dark — shadcn mapping per §3; `--background: #0E0E0E` |
| **Tokens** | Implement CSS vars §3 + Tailwind §4 |
| **Hero** | Contained WebGL slot (~45–55vh); lazy import; `#0A0A0A` surround; material language §6 |
| **Fallback** | Static photoreal hero + `prefers-reduced-motion` → no WebGL |
| **Proof band** | Directly below/alternate hero — `#141414` band per §9.1; **must remain above fold on 1280×800** |
| **IA** | Home → Dogs → Health/Education → About → Contact/Inquire — unchanged |
| **Route** | `/inquire`; CTA "Begin your inquiry" |
| **Typography** | Libre Baskerville + Source Sans 3; link/CTA contrast per §5 |
| **Nav** | `#0E0E0E` or `#161616` sticky header; wordmark variant §8 |
| **Components** | Proof band, evidence grid, tier badges, dog card, placeholder, inquire form — colors §9 |
| **Performance** | Dynamic import Three/R3F; GLB target <5–15MB; LCP hero fallback image prioritized |
| **No** | Scroll-3D, full-page R3F, scroll-jacking, neon bloom |
| **Photo cards** | `#161616` cards; legacy `#FAFAF8` only inside photo mat if needed |

---

## 12. FLUX prompt updates (dark brand stills)

**Generation skipped:** No `FAL_KEY` or `INFSH_API_KEY` in environment. Prompts documented for Phase 14 / operator art direction — **not** v1 ship assets or fake program proof.

**Supersede v1 light-paper prompts (§12 A/C in `11-brand-system.md`):** Replace paper-bg stills with dark-ground editorial variants.

### Prompt A — Dark editorial kennel environment (brand/environment slot)

```text
A clean modern kennel yard at dusk in soft neutral light, charcoal metal
fencing and warm tan wood accents (#C4A35A), muted sage at frame edges,
empty of dogs, near-black ground (#0E0E0E) fading to soft vignette,
editorial architectural photography, natural color not cinematic neon,
calm credible atmosphere, shot on medium format at f/8, no purple grading
```

### Prompt B — Breed standard reference (education — diagram interior may stay light)

```text
Side-profile breed standard diagram of a Rottweiler in correct ADRK proportion,
black coat with clearly defined rich tan markings (#C4A35A), natural undocked
tail, clean white background for diagram interior only, educational illustration,
precise linework, labeled breed standard reference not a portrait photograph
```

### Prompt C — Sage brand still life (dark surround)

```text
Single sage stem (#7A8F7E) in soft focus against near-black ground (#0E0E0E),
minimal still life, soft warm key light from upper left with subtle tan rim
(#C4A35A) at low intensity, fine art photography, generous negative space for
typography overlay, no text, no dogs, no neon glow
```

### Prompt D — Operator dog photography direction (reference only)

```text
A calm adult Rottweiler standing in natural alert posture, black coat with
clearly defined rich tan markings (#C4A35A), natural undocked tail, soft
overcast daylight, full-body structure visible, professional breed photography,
true-to-life color with lifted midtones so markings read on dark presentation,
devoted expression not aggressive, background softly dark neutral not pure black crush
```

### Prompt E — Hero static fallback (WebGL substitute)

```text
A noble adult Rottweiler in calm standing pose, ADRK-type head and structure,
natural undocked tail, black and rich tan coat, on near-black seamless backdrop
(#0E0E0E) with soft studio gradient, subtle warm rim light matching tan markings,
editorial prestige not gaming CGI, photoreal, no purple or teal color grade,
no glowing eyes, medium shot showing chest to head with space for headline overlay
```

**Model recommendation (when keys available):** FLUX.2 [pro] environment; FLUX.2 [max] dog reference. **Never** generate dogs as stand-in Blacksage stock.

---

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/11b-brand-designer.md` | This handoff — merge-ready for CD update of `11-brand-system.md` |

---

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | creative-language |
| llm_model | composer-2.5 |
| generation_profile | brand-stills |
| generation_used | none |
| fallback_applied | false — no API keys; prompts documented only |

---

## Decisions

- Locked ground `#0E0E0E` (not pure `#000`) and primary tan `#C4A35A` / hover `#A67C52` from CEO range — final picks with AA notes.
- Primary CTA: **dark text on tan fill** — white-on-tan fails WCAG.
- Sage lifted to `#7A8F7E` for dark-surface badge readability; deep sage retained for verified badge fill.
- `#FAFAF8` retained as `--color-paper-legacy` for photo mat / form input only — not page ground.
- Typography families unchanged; link pattern shifts to off-white + tan underline for small body text.
- Hero WebGL material language defined; scroll-3D remains forbidden; contained island only.
- Undocked tail: **preferred default** in imagery and 3D brief.

---

## Asks for manager (`ask_manager`)

- Peer help needed: **none**
- Clarification needed: **none** — operator locked Option B per Phase 22 brief
- **CD action:** Merge §1–§12 into `11-brand-system.md`; supersede light-default §3/§6/§9/§10/§12/§14; add SD4 narrow hero exception cross-ref to Phase 22 memo

---

## Risks / blockers

- Tan `#C4A35A` as sole link color in small body copy without underline may fail perception on some displays — Phase 12 should implement underline pattern from §5.
- WebGL hero CWV risk if model/textures exceed budget — Phase 9 owns perf; brand provides fallback tone §6.4.
- Operator photography graded for light UI may need re-edit for dark cards — Phase 14 / operator.

---

## Packs used

- `skills/community/ui-ux-pro-max-skill/brand/`
- `skills/community/awesome-claude-corporate-skills/04-marketing/theme-factory/` (reference)
- FLUX best practices (workspace AGENTS.md) — prompt structure §12

---

## Do not

- Mark the phase complete
- Write outside write_lease
- Spawn other positions
- Inherit parent model when MODEL-REGISTRY pins a different tier
