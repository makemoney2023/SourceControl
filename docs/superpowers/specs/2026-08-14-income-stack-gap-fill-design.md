# Income Stack Gap Fill — Design Spec

**Date:** 2026-08-14  
**Venture:** Superpatch / affiliates / income-stack-deck  
**Status:** Implemented (20-scene gap fill)  
**App:** `apps/superpatch-income-stack`  
**SSOT:** `src/data/slides.ts`  
**Copy mirror:** `docs/orgs/superpatch/customers/affiliates/initiatives/income-stack-deck/business-idea/assets/copy/SLIDES.md`  
**Source board:** Super Patch Income Stack™ 15-panel PNG (extracted 2026-08-14)

## Goal

Bring every phrase from the source Income Stack board onto the live deck, and add dedicated cinematic plates for the seven beats that currently have no scene. The deck grows from 15 scenes to **20**. Plates stay text-free. All overlay type lives in `slides.ts`.

## Locked decisions

| Decision | Choice |
|---|---|
| Scene count | **20** (was 15) |
| Stream pairing | Keep stacks 7+8 on one slide and 9+10 on one slide |
| Overlay architecture | Plates text-free; PNG phrases → `eyebrow` / `headline` / `body` / `onScreenBody` / `annotations[]` |
| New plates | Seven still 1920×1080 concepts in the existing neon-slab language |
| Existing income media | Keep slide IDs `07-retail` … `14-global` and their Omni slugs |
| Retired scenes | `02-question` (becomes `02-world`); `05-ecosystem` (content split into Product + Compounding) |
| Third-party marks | Do **not** bake Forbes / Mind Pump / SportsTech TODAY / healthgrades / MEDICAL DAILY into generated art. Live text or a separately licensed logo strip only |
| Film word budget | `body` or `onScreenBody` stays 30–50 words |
| Disclosure | Every money slide plus Imagine Your Future plus Close |
| Motion / Omni for new IDs | Out of scope for the first implementation plan. Stills + live overlays first |
| Closing CTAs | Unchanged: “Get your affiliate link” / “Read the Income Disclosure” |

## Approaches considered

| | Approach | Why not |
|---|---|---|
| A | Keep 15; stuff PNG phrases into Foundation + close | Rejected. Product, Brand, and Personal Development never get a plate |
| B | Hybrid ~18; dedicated Product / Brand / PD only | Rejected. User chose dedicated plates for all seven missing beats |
| C | Expand to 20; keep 7+8 and 9+10 paired | **Locked** |
| D | Expand to 22; split CEO and Global Pool | Rejected. User kept pairing |

## Visual system (new plates must match)

Existing clean concepts are the style bible (`public/concepts/clean/sp-stack-*.png`):

- Near-black cosmic void, blue mist, reflective obsidian floor
- Frosted translucent acrylic slabs with internal grain, neon rim, bloom
- Spectral roles: **green = product**, **blue = brand**, **orange = income**, **violet = people**
- Human figures as node-mesh silhouettes when people are the subject
- **No burned-in type, logos, or UI chrome on the plate**
- Landscape master 1920×1080; portrait 1080×1920 is a later art-direct pass, not this spec

## Overlay architecture

Two layers, never duplicated:

1. **Lower third** — `eyebrow`, `headline`, `body` (or `onScreenBody` for film). Cinematic Lower Third contract from the 2026-08-07 experience spec still applies.
2. **Plate annotations** — short labels and metrics that sat on the source board. Same `PlateAnnotation` shape already used on slides 03, 04, 07–10.

If a phrase is a headline-scale claim, it goes in the lower third. If it is a chip, channel, module, or metric, it goes in `annotations[]`.

Compact layouts still drop annotations below `COMPACT_ANNOTATION_MAX_Y_PCT` (58). New annotation `yPct` values must sit at or above that line when the label is required on phones.

## Chapter model

`EXPERIENCE_CHAPTERS` becomes four chapters. `sceneStart` / `sceneEnd` are **array indices**, not slide-id numbers.

| Chapter id | Label | Indices | Slide IDs |
|---|---|---|---|
| `full-stack` | Full Stack | 0–6 | `01-title` … `07-development` |
| `ten-income-streams` | Ten Income Streams | 7–15 | `08-ten-layers` … `14-global` |
| `momentum` | Momentum | 16–18 | `17-compounding`, `18-different`, `19-future` |
| `action` | Action | 19–19 | `15-closing` |

Chrome counter becomes `NN / 20`. `formatSceneCounter` already uses `SLIDES.length`; tests that hard-code `/ 15` must update.

`ExperienceChapterId` union: `"full-stack" | "ten-income-streams" | "momentum" | "action"`.

Header affiliate CTA (from the 2026-08-07 spec) appears after the Full Stack chapter completes (after index 6), and hides on the Action scene.

## Slide ID map

Array order is scene order. Income IDs stay so Omni / hero maps do not rename.

| # | New id | Was | Plate |
|---|---|---|---|
| 01 | `01-title` | `01-title` | Keep 10-slab stack |
| 02 | `02-world` | `02-question` | **New** |
| 03 | `03-four-stacks` | `03-four-stacks` | Keep four pillars |
| 04 | `04-flywheel` | `04-flywheel` | Keep flywheel |
| 05 | `05-product` | — | **New** |
| 06 | `06-brand` | — | **New** |
| 07 | `07-development` | — | **New** |
| 08 | `08-ten-layers` | `06-ten-layers` | Keep ten-layer stack |
| 09 | `07-retail` | `07-retail` | Keep |
| 10 | `08-fast-start` | `08-fast-start` | Keep |
| 11 | `09-team-overrides` | `09-team-overrides` | Keep |
| 12 | `10-md-depth` | `10-md-depth` | Keep |
| 13 | `11-vp-override` | `11-vp-override` | Keep |
| 14 | `12-generations` | `12-generations` | Keep |
| 15 | `13-executive` | `13-executive` | Keep |
| 16 | `14-global` | `14-global` | Keep |
| 17 | `17-compounding` | `05-ecosystem` (retired) | **New** |
| 18 | `18-different` | — | **New** |
| 19 | `19-future` | — | **New** |
| 20 | `15-closing` | `15-closing` | Keep horizon / brand lockup |

`isStreamIndexSlide` must match `08-ten-layers` (not `06-ten-layers`).

`SLIDE_TO_OMNI_SLUG` keeps existing income slugs. New still-only IDs have no Omni clip in this pass; `experienceMedia.ts` must allow a still-plate fallback (poster = `conceptSrc`) so ExperienceShell does not throw.

## Scene copy and annotations

Locked strings. Implementation may tighten word count into the 30–50 band without dropping a locked phrase. Product outcomes stay non-clinical.

### 01 `01-title` — Title

- **Eyebrow:** The Super Patch Income Stack™
- **Headline:** More Than an Affiliate Program. A Complete Opportunity.
- **Body (target):** At Super Patch we did not build another affiliate program. We built a complete opportunity: better health, greater freedom, and bigger impact. One company. Four stacks. Ten income streams. Infinite potential.
- **Annotations:** `BETTER HEALTH` · `GREATER FREEDOM` · `BIGGER IMPACT` · `ONE COMPANY` · `FOUR STACKS` · `TEN INCOME STREAMS` · `INFINITE POTENTIAL`
- **Accent:** blue · **Disclosure:** no · **Preset:** `parallax-slabs`

### 02 `02-world` — The World Has Changed

- **Eyebrow:** The World Has Changed
- **Headline:** Multiple income streams are no longer optional.
- **Body (target):** People want more freedom, more purpose, and more control of their future. Traditional jobs, the gig economy, the creator economy, and social commerce all point the same way: one stream is not a plan. Multiple income streams are essential.
- **Annotations:** `TRADITIONAL JOBS` · `GIG ECONOMY` · `CREATOR ECONOMY` · `SOCIAL COMMERCE`
- **Accent:** cool · **Disclosure:** no · **Preset:** `ken-burns-glow`
- **Concept:** Night-Earth curve with city lights. Four frosted slabs in an arc (briefcase / rider / creator / network as *forms*, not labeled icons). Text-free.

### 03 `03-four-stacks` — Full Stack

- **Eyebrow:** The Super Patch Full Stack
- **Headline:** One Company. Four Stacks. Ten Income Streams. Infinite Potential.
- **Body:** Keep the current ecosystem paragraph (Product delivers outcomes, Brand & Marketing creates demand, Income opens opportunity, Personal Development builds leaders).
- **Annotations (replace current short names):** `PRODUCT STACK` · `BRAND & MARKETING` · `INCOME STACK` · `PERSONAL DEVELOPMENT`
- **Accent:** multi · **Preset:** `pillars-sequence`
- **Presenter notes:** unchanged — point to official materials; do not invent clinical claims.

### 04 `04-flywheel` — Why the Full Stack Wins

- **Eyebrow:** Why the Full Stack Wins
- **Headline:** Each Stack Reinforces the Others
- **Body:** Keep the current six-step flywheel paragraph. It already covers the PNG idea.
- **Annotations (add checklist; keep stack labels if they still fit):** `Products create customers` · `Marketing creates demand` · `Income creates opportunity` · `Personal development creates leaders`
- **Accent:** multi · **Preset:** `flywheel-scrub`

### 05 `05-product` — Product Stack

- **Eyebrow:** Product Stack
- **Headline:** Better products. Better results. Raving customers.
- **Body (target):** World-class VTT™ patches and innovative wellness solutions that deliver real results. Proprietary technology, backed by science, more than fifteen targeted solutions, trusted by millions. Better products create raving customers — and customers start the Income Stack.
- **Annotations:** `Proprietary Technology` · `Backed by Science` · `15+ Targeted Solutions` · `Trusted by Millions`
- **Accent:** green · **Disclosure:** no · **Preset:** `coin-rise` is wrong; use `node-mesh`
- **Presenter notes:** Product trust: point to official Super Patch materials for outcomes — do not invent clinical claims on this slide.
- **Concept:** Green hero slab. Athlete node-mesh silhouette with a square patch on the shoulder. Four small green chips reserved for live annotations. Text-free.

### 06 `06-brand` — Brand & Marketing Stack

- **Eyebrow:** Brand & Marketing Stack
- **Headline:** Massive visibility. Powerful credibility. Relentless momentum.
- **Body (target):** Super Patch shows up where trust is built: global media and PR, top creators, retail and digital channels, healthcare professionals, and pro sports. Massive visibility. Powerful credibility. Relentless momentum.
- **Annotations:** `Global Media & PR` · `Top Creators & Influencers` · `Retail & Digital Channels` · `Healthcare Professionals` · `Pro Sports & Elite Teams`
- **Optional live text (not plate art):** Forbes · MIND PUMP · SportsTech TODAY · healthgrades · MEDICAL DAILY — only if a licensed logo strip exists; otherwise omit marks and keep the five channel labels.
- **Accent:** blue · **Disclosure:** no · **Preset:** `ken-burns-glow`
- **Concept:** Blue pillar under a starfield. Silhouette looking up. Constellation nodes for five channels. No third-party logos on the plate.

### 07 `07-development` — Personal Development Stack

- **Eyebrow:** Personal Development Stack
- **Headline:** We don’t just build businesses. We build better people.
- **Body (target):** Leadership development, sales mastery, communication skills, financial education, mindset and growth, community and support. Grow personally. Lead powerfully. Live fully. Personal development is the stack that turns customers and affiliates into leaders.
- **Annotations:** `LEADERSHIP DEVELOPMENT` · `SALES MASTERY` · `COMMUNICATION SKILLS` · `FINANCIAL EDUCATION` · `MINDSET & GROWTH` · `COMMUNITY & SUPPORT`
- **Accent:** violet · **Disclosure:** no · **Preset:** `generation-rings`
- **Concept:** Violet mountain-peak silhouette. Six orbiting violet slabs. Text-free.

### 08 `08-ten-layers` — Income Stack Overview

- **Eyebrow:** Income Stack™ — Ten Streams
- **Headline:** One Opportunity. Ten Income Streams.
- **Body:** Keep the current ten-named-streams walk (`onScreenBody` + `voiceover` stay).
- **Annotations (new):** `1–3 FOUNDATION` · `4–7 LEADERSHIP` · `8–10 EXECUTIVE & GLOBAL`
- **Accent:** orange · **Preset:** `exploded-layers`
- **`isStreamIndexSlide`:** this id

### 09–16 Income streams

Keep current headlines, bodies, metrics, disclosures, and annotations on `07-retail` … `14-global`. Do not drop weekly pay, qualifying kits, “past level 5,” or the income disclosure. These slides already match the source board’s numbers and are often more precise.

`INCOME_STREAMS` `slideId` values stay. Recap overlay on `14-global` stays.

### 17 `17-compounding` — Compounding Income

- **Eyebrow:** The Power of Compounding Income
- **Headline:** Every activity. Every layer. Every time.
- **Body (target):** One customer becomes ten. Ten become more than a hundred. Customers become teams. Teams become leaders. Leaders unlock multiple income streams. The more you build, the more the Income Flywheel grows.
- **Annotations:** `ONE CUSTOMER` · `TEN CUSTOMERS` · `100+ CUSTOMERS` · `TEAMS` · `LEADERS` · `MULTIPLE INCOME STREAMS`
- **Accent:** orange · **Disclosure:** no · **Preset:** `flywheel-scrub`
- **Concept:** Orange cascading node counts on the reflective floor, resolving toward an infinity form. Text-free.

### 18 `18-different` — Why Super Patch Is Different

- **Eyebrow:** Why Super Patch Is Different
- **Headline:** A true Full Stack company
- **Body (target):** Proven products people love. A massive brand and marketing engine. Ten ways to earn. Personal development built in. A global vision with unlimited potential. This is a full-stack company — not a single-commission catalog.
- **Annotations:** `A true FULL STACK company` · `Proven products people love` · `Massive brand and marketing engine` · `Ten ways to earn income` · `Personal development built in` · `Global vision. Unlimited potential`
- **Accent:** multi · **Disclosure:** no · **Preset:** `node-mesh`
- **Concept:** Close-up frosted square patch on skin, four-color rim (green / blue / orange / violet). Text-free.

### 19 `19-future` — Imagine Your Future

- **Eyebrow:** Imagine Your Future
- **Headline:** You decide how far you go.
- **Body (target):** Side income, income replacement, business ownership, financial freedom, or generational wealth — you choose the pace. Your future is created by the actions you take today. Income is not guaranteed. Results vary.
- **Annotations:** `SIDE INCOME` · `INCOME REPLACEMENT` · `BUSINESS OWNERSHIP` · `FINANCIAL FREEDOM` · `GENERATIONAL WEALTH`
- **Accent:** orange · **Disclosure:** **yes** (`INCOME_DISCLOSURE`) · **Preset:** `horizon-settle`
- **Concept:** Sunset city silhouette. Five ascending gold-orange slabs. Text-free.

### 20 `15-closing` — Join the Movement

- **Eyebrow:** Join the Movement
- **Headline:** Better Health. Greater Freedom. Bigger Impact.
- **Body (target):** We’re building the world’s leading human performance ecosystem—together. One company. Four stacks. Ten income streams. Infinite potential. Take the next step with your sponsor.
- **Annotations:** `BETTER HEALTH` · `GREATER FREEDOM` · `BIGGER IMPACT`
- **CTAs:** unchanged  
- **Disclosure:** yes · **Accent:** red · **Preset:** `horizon-settle`  
- **`hasEndCard`:** still true

## Media and tests that must change

Hard-coded `15` is a contract, not a suggestion. Update all of these in the same implementation plan:

- `assertSlidesValid` expected length **20**
- `slides.test.ts` length, chapter, stream-index, and counter assertions
- `EXPERIENCE_CHAPTERS` ranges and `ExperienceChapterId`
- `streamIndex.ts` `isStreamIndexSlide` → `08-ten-layers`
- `experienceMedia.ts` still-plate fallback for IDs without Omni
- `omniChain.ts` / `SLIDE_TO_OMNI_SLUG`: drop `02-question` and `05-ecosystem`; add still-only IDs
- Remotion `timeline.ts` and any `15` scene loops
- Experience chrome copy that says `15`
- `SLIDES.md` rewritten to match `slides.ts` (no more drift on slides 6 and 15)

Do not rename Omni files for `07-retail` … `14-global`.

## Compliance

- No “guaranteed” earnings language (existing retail test stays).
- `19-future` and `15-closing` require `INCOME_DISCLOSURE`.
- Product slide may say “backed by science” and “VTT™” as on the source board; it may not add new clinical or disease claims.
- Aspiration ladder on `19-future` is framed as a choice of pace, not a typical result.
- Third-party publication names are live text only, and only with usage rights.

## Out of scope

- Generating Omni / Veo loops for the seven new plates
- Splitting Executive / CEO or Global President / Pool into separate scenes
- Changing CTA destinations
- Rewriting the Cinematic Lower Third layout
- Baking type back into concept PNGs

## Acceptance criteria

| Criterion | Pass |
|---|---|
| Count | `SLIDES.length === 20` and `assertSlidesValid(SLIDES)` passes |
| Source coverage | Every locked phrase in this spec appears in `eyebrow`, `headline`, `body`/`onScreenBody`, or `annotations` |
| Dedicated plates | Product, Brand, PD, World, Compounding, Why Different, Imagine Your Future each have their own slide id and `conceptSrc` |
| Text-free plates | New concept PNGs contain no readable type |
| Income math | 25%, $200–$2,000, RABs to $100,000, 15/10/4, 2% MD/VP, 3% generations, $10k–$20k, 1% global still present |
| Disclosure | Money slides + future + close |
| Counter | Chrome shows `NN / 20` |
| Chapters | Four chapter labels; Full Stack is 01–07 |
| SSOT | `SLIDES.md` matches `slides.ts` |
| Experience | New scenes render with still plate + overlays when Omni is missing; no throw |

## Implementation phases (for the plan, not this spec’s code)

1. Data + tests: 20-slide SSOT, chapters, stream index, media fallback  
2. Copy + annotations on all 20  
3. Seven new still concepts at 1920×1080, wired as `conceptSrc`  
4. Docs: `SLIDES.md` + this spec marked approved  

Omni/Veo for new IDs is a follow-on plan.
