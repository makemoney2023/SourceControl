# Income Stack — Super Stack Layout (21 Scenes)

**Date:** 2026-08-17  
**Venture:** Superpatch / affiliates / income-stack-deck  
**Status:** Approved — implemented on feat/income-stack-gap-fill  
**App:** `apps/superpatch-income-stack`  
**SSOT:** `src/data/slides.ts`  
**Copy mirror:** `docs/orgs/superpatch/customers/affiliates/initiatives/income-stack-deck/business-idea/assets/copy/SLIDES.md`  
**Supersedes:** overlay seats and 20-scene count in `2026-08-14-income-stack-gap-fill-design.md`; title-slot copy in `2026-08-14-income-stack-title-patch-glb-design.md`  
**Keeps:** gap-fill copy phrases, still-only new plates, income IDs `07-retail` … `15-closing`, title `PatchHeroScene` + receding grid

## Goal

Open the deck on the 3D patch with a centered product title, **THE SUPERPATCH SUPER STACK**. Shift the current 20-scene gap-fill deck down one slot (21 scenes). Park every new phrase on a named seat so chips stop colliding with the hero, the left lower third, and each other.

**Success bar:** Scene 01 shows the patch and the two-line title with no left cinematic copy and no mid-volume chips. Scenes 02–21 use one overlay system. New copy is either a crown caption, a tile/rail caption, or lower-third prose. Nothing else.

## Locked decisions

| Decision | Choice |
|---|---|
| Scene 01 title | `THE SUPERPATCH` / `SUPER STACK` (two lines). Hero name, not the trademark |
| Trademark | `The Super Patch Income Stack™` stays on scene 02 eyebrow and in later Income copy |
| Scene count | **21** (insert one scene ahead of the 20-scene gap-fill deck) |
| New first id | `00-super-stack` (avoids renaming `01-title`) |
| Title media | Existing `PatchHeroScene` + cyan receding grid, mounted on `00-super-stack` |
| Scene 01 copy component | Centered product caption under the patch. **Not** `.scene-copy` |
| Overlay rule | Two layers, never duplicated. If a phrase has no seat, it stays in the lower third |
| Chip type | ALL CAPS, 1–4 words, accent color. Sentences never sit on the plate |
| Compact | Chips with `yPct >= 58` still drop. Required chips must sit at `yPct <= 52` |
| Income IDs | `07-retail` … `14-global` and `15-closing` stay so Omni slugs do not rename |
| Four-stacks type | Keep baked Omni labels. Hide live annotations on that scene |
| World plate | Recolor so it is not the Product / Brand / Income / People palette |
| Why Different plate | No checklist on the patch. Use as scene 01 poster and/or a still. Regen out of scope |
| Omni / Veo for new IDs | Still out of scope |
| Closing CTAs | Unchanged: “Get your affiliate link” / “Read the Income Disclosure” |
| Worktree | **Port, not merge.** `feat/income-stack-title-patch-glb` shares no git history with gap-fill and uses the standalone-repo layout (`src/` at root vs `apps/superpatch-income-stack/src/`). Copy the patch files in (list under Architecture) |
| Remotion film | Excludes hero-caption slides (`SLIDES.filter`). Rendered film stays the current 20-scene cut |
| Compact chips | Existing width rule (`annotationsVisibleInLayout`) drops labels longer than ~11 chars on phones. Accepted: long crown/rail chips are desktop-only; compact carries the story in the lower third. Short chips (`ONE`, `100+`, `SIDE`, `OWN`) survive |

## Approaches considered

| | Approach | Why not |
|---|---|---|
| A | Keep 20 scenes; put Super Stack type on the current 10-slab title | Rejected. User kept the 3D patch as scene 01 and shifted the rest |
| B | Freehand `xPct` / `yPct` for every new phrase | Rejected. That is the current collision |
| C | Kill all new chips; lower third only | Rejected. Product tiles, pillar captions, and income metrics need on-plate seats |
| D | 21 scenes + named seats (crown / tile / rail / metric / lower third / hero caption) | **Locked** |

## Non-goals

- Generating Omni / Veo loops for new plates
- Splitting Executive / CEO or Global President / Pool
- Changing CTA destinations or disclosure legal
- Baking type back into concept PNGs
- Regenerating `18-different` as a six-point plate (follow-on)
- Rewriting income math
- Deleting `PhotorealStackScene` or `?view=hero3d`

## Frame contract (16:9)

Percent of the scene card, not the drifting media plane.

| Zone | Seat | Allowed type |
|---|---|---|
| y 0–12 | Chrome | Logo, `NN / 21`, chapter. No story type |
| y 12–22 | Crown | Short ALL CAPS captions **above** slabs |
| y 22–62 | Hero | Plate or 3D patch. Chips only on reserved tiles |
| y 62–68 | Dead band | Empty. Chips here hit the lower third |
| y 68–92, x 6–40 | Lower third | Eyebrow, headline, body, CTAs, disclosure |
| x 72–92, y 22–54 | Right rail | Chip column when the left is full of art |
| Compact | Chips y 22–50 only | `COMPACT_ANNOTATION_MAX_Y_PCT` stays 58 |

Implementation stores seats as `PlateAnnotation` values that land inside these zones. Do not guess round numbers that fall in the dead band.

## Copy components

### Hero caption (scene 01 only)

New layout, not `.scene-copy`.

- Position: horizontally centered, **under the patch, above the receding floor** (about y 70–80, x 20–80)
- Type: display face, white, two lines, no red tick, no body, no chips
- The patch stays the optical center. True geometric center is on the patch and is forbidden for type
- Chrome already owns y 0–12, so a title above the patch is forbidden
- Type scale: larger than the first Super Stack pass — desktop `clamp(2.35rem, 5.8vw, 5.75rem)`, compact `clamp(2.5rem, 9.4vw, 3.85rem)`
- Compact logo: 20% larger than the shared compact frame (`compactScaleMul` 1.2 on `00-super-stack` only)
- First paint: camera flyover + one Y spin, then idle rock. Product Stack does not replay this intro
- `isHero3dExperienceSlide` matches `00-super-stack` and `05-product`

```
THE SUPERPATCH
SUPER STACK
```

### Lower third (scenes 02–21)

Existing cinematic block: left-bottom, red tick + uppercase eyebrow, display headline (`max-width: 16ch`), muted body (52ch). Do not route scene 01 through this component.

### Chip recipes

| Recipe | Seat | Use |
|---|---|---|
| Crown | y 12–22, one label per slab | World, 10-slab pillars, Future tops |
| Tile column | On reserved chips, y 28–52 | Product left tiles |
| Right rail | x ≈ 78, y 26–54 | Brand channels, ten-layer tiers |
| Metric anchor | Existing measured percents | Income 07–14 |
| No-chip | Lower third only | Sentences, lockup prose, Why Different list, Close pillars |

Chip style: ALL CAPS, `font-weight: 700`, accent color, `translate(-50%, -50%)`. Measure tile centers from the PNG. Do not reuse `xPct: 22` as a default.

## Chapter model

`sceneStart` / `sceneEnd` are array indices.

| Chapter id | Label | Indices | Slide IDs |
|---|---|---|---|
| `super-stack` | Super Stack | 0–0 | `00-super-stack` |
| `full-stack` | Full Stack | 1–7 | `01-title` … `07-development` |
| `ten-income-streams` | Ten Income Streams | 8–16 | `08-ten-layers` … `14-global` |
| `momentum` | Momentum | 17–19 | `17-compounding` … `19-future` |
| `action` | Action | 20–20 | `15-closing` |

`ExperienceChapterId` adds `"super-stack"`. Counter is `NN / 21`.

Header affiliate CTA appears after Full Stack completes (after index 7) and hides on Action.

## Slide ID map

Array order is scene order. Income IDs stay.

| # | ID | Was | Media |
|---|---|---|---|
| 01 | `00-super-stack` | — | `PatchHeroScene` + grid. No still poster — black void only. Existing title poster remains unused on this scene |
| 02 | `01-title` | `01-title` | Keep 10-slab plate / Omni |
| 03 | `02-world` | `02-world` | Recolored still |
| 04 | `03-four-stacks` | `03-four-stacks` | Keep Omni (baked labels) |
| 05 | `04-flywheel` | `04-flywheel` | Keep Omni |
| 06 | `05-product` | `05-product` | Live 3D patch (`superpatch-title.glb`) + receding floor. Logo GLB stays on `00-super-stack` only |
| 07 | `06-brand` | `06-brand` | Keep still |
| 08 | `07-development` | `07-development` | Keep still |
| 09 | `08-ten-layers` | `08-ten-layers` | Keep Omni |
| 10–17 | `07-retail` … `14-global` | same | Keep Omni |
| 18 | `17-compounding` | `17-compounding` | Keep still |
| 19 | `18-different` | `18-different` | Still / poster only. No on-plate list |
| 20 | `19-future` | `19-future` | Keep still |
| 21 | `15-closing` | `15-closing` | Keep Omni |

## Scene copy and seats

Locked strings. Implementation may tighten body word count into the 30–50 band without dropping a locked phrase.

### 01 `00-super-stack`

- **Component:** Hero caption
- **Lines:** `THE SUPERPATCH` / `SUPER STACK` (uppercase via CSS)
- **`headline` field:** `The SuperPatch Super Stack` — required by the type; feeds navigator aria-labels and the compact jump menu
- **Eyebrow / body / annotations:** none. `assertSlidesValid` exempts `copyLayout === "hero-caption"` slides from the eyebrow/body requirement and the 30–50 film word budget
- **`conceptSrc`:** `/concepts/clean/sp-stack-18-different.png` (required field; doubles as the poster)
- **`motionPreset`:** `hero-patch` (new string; no `flywheelArc`)
- **Accent:** blue
- **Disclosure:** no
- **Hero3d:** yes
- **Media entry:** add `00-super-stack` to `STILL_ONLY_IDS` in `experienceMedia.ts` so the media map does not throw; poster comes from `conceptSrc`

### 02 `01-title` — 10-slab lockup

- **Eyebrow:** The Super Patch Income Stack™
- **Headline:** More Than an Affiliate Program. A Complete Opportunity.
- **Body:** At Super Patch we did not build another affiliate program. We built a complete opportunity: better health, greater freedom, and bigger impact. One company. Four stacks. Ten income streams. Infinite potential.
- **Crown chips (only):** `BETTER HEALTH` · `GREATER FREEDOM` · `BIGGER IMPACT` at y ≈ 16, x 22 / 50 / 78
- **Delete:** the seven mid-stack chips at y=28 and y=48
- **Lockup** `ONE COMPANY … INFINITE POTENTIAL` stays in the body. Not chips.

### 03 `02-world`

- **Eyebrow:** The World Has Changed
- **Headline:** Multiple income streams are no longer optional.
- **Body:** Keep the current world paragraph.
- **Crown chips:** `TRADITIONAL JOBS` · `GIG ECONOMY` · `CREATOR ECONOMY` · `SOCIAL COMMERCE` — one above each slab, y ≈ 18
- **Delete:** the y=36 row through the icons
- **Art:** recolor slabs so they are not green / blue / orange / violet stack roles. Cool neutrals or a single cool accent.

### 04 `03-four-stacks`

- **Eyebrow / headline / body:** unchanged (headline is the lockup)
- **Live annotations:** hidden (`annotationsBaked: true`)
- **SSOT annotations:** keep the long names for docs / film. Do not render them on top of Omni type

### 05 `04-flywheel`

- **Eyebrow / headline / body:** unchanged
- **Keep** measured `PRODUCT` · `BRAND` · `PEOPLE` · `INCOME` if they still sit on the ring
- **Delete:** the four sentence chips (`Products create customers` …). Those sentences stay in the body

### 06 `05-product`

- **Eyebrow / headline / body:** unchanged
- **Tile column:** `PROPRIETARY TECHNOLOGY` · `BACKED BY SCIENCE` · `15+ SOLUTIONS` · `TRUSTED BY MILLIONS`
- **Seat:** centers of the four left tiles, measured from the PNG. Target y 28 / 36 / 44 / 52 so chip 4 stays above the dead band
- **Delete:** title-case guesses at `xPct: 22`

### 07 `06-brand`

- **Eyebrow / headline / body:** unchanged
- **Right rail:** `GLOBAL MEDIA & PR` · `TOP CREATORS` · `RETAIL & DIGITAL` · `HEALTHCARE` · `PRO SPORTS`
- **Seat:** x ≈ 78, y 26 / 33 / 40 / 47 / 54
- **Delete:** the x=22 column on the monolith

### 08 `07-development`

- **Eyebrow / headline / body:** unchanged. Body keeps “Grow personally. Lead powerfully. Live fully.”
- **Tile chips:** `LEADERSHIP` · `SALES` · `COMMUNICATION` · `FINANCE` · `MINDSET` · `COMMUNITY` — one **on** each platform, measured from the PNG
- **If a platform center is y > 52:** that module stays in the body only
- **Delete:** the guessed halo at y=26–56

### 09 `08-ten-layers`

- **Eyebrow / headline / body / onScreenBody:** unchanged
- **Right rail:** `1–3 FOUNDATION` · `4–7 LEADERSHIP` · `8–10 EXECUTIVE`
- **Seat:** x ≈ 78, y 28 / 40 / 52
- **Delete:** the left-column guesses at x=22 (they hit the lower third)

### 10–17 `07-retail` … `14-global`

- No new copy
- Keep measured metric annotations
- Do not add chips

### 18 `17-compounding`

- **Eyebrow / headline / body:** unchanged (body is the full ladder)
- **Chips (three only):** `ONE` · `100+` · `STREAMS` on the high (right) platforms, measured from the PNG, y ≤ 52
- **Delete:** the flat six-label row at y=32 / 48
- **`motionPreset`:** change `flywheel-scrub` → `ken-burns-glow`. `flywheelPlacement` treats `flywheel-scrub` as the hero flywheel overlay in Remotion, which is wrong on this still. `04-flywheel` stays the only `flywheel-scrub` slide

### 19 `18-different`

- **Eyebrow:** Why Super Patch Is Different
- **Headline:** A true Full Stack company
- **Body:** Proven products people love. A massive brand and marketing engine. Ten ways to earn. Personal development built in. A global vision with unlimited potential. This is a full-stack company — not a single-commission catalog.
- **Annotations:** none
- **Delete:** the six centered checklist lines on the patch

### 20 `19-future`

- **Eyebrow / headline / body / disclosure:** unchanged
- **Crown chips:** `SIDE` · `REPLACE` · `OWN` · `FREEDOM` · `WEALTH` — one above each pillar top
- **Seat:** x 18 / 34 / 50 / 66 / 82, y following pillar height (about 48 → 22). Not one band at y=36

### 21 `15-closing`

- **Eyebrow / headline / body / CTAs / disclosure:** unchanged
- **Annotations:** none
- **Delete:** the three chips that repeat the headline

## Architecture

| Piece | Change |
|---|---|
| Patch port (phase 1) | Copy from `.worktrees/title-patch-glb` into `apps/superpatch-income-stack`: `src/components/hero3d/PatchHeroScene.tsx`, `patchFrame.ts`, `patchHero.ts`, `patchField.ts`, `pointerTilt.ts`, `patchErrorBoundary.tsx` (+ their tests), the `titlePatchExit` motion module, `Hero3dCanvas` `variant="patch"` wiring, and `public/models/superpatch-title.glb`. Diff against the gap-fill copies of shared files (`Hero3dCanvas`, `qualityTier`, `viewportMetrics`) before overwriting |
| `slides.ts` | Insert `00-super-stack`; drop forbidden chips; retarget remaining chips to seats |
| `assertSlidesValid` | Length 21. Exempt `copyLayout === "hero-caption"` slides from eyebrow/body and the 30–50 film word budget; headline stays required |
| `ExperienceChapterId` / `EXPERIENCE_CHAPTERS` | Five chapters; indices above |
| `hero3dExperienceSlide.ts` | `HERO3D_EXPERIENCE_SLIDE_ID = "00-super-stack"` (`01-title` reverts to its Omni video scene) |
| `ExperienceScene` | If `copyLayout === "hero-caption"`, render the centered two-line title instead of `.scene-copy` |
| `experience.css` | `.scene-copy-hero` — flex column, center, under-patch band. Do not reuse left lower-third offsets |
| `SceneHero3d` / `PatchHeroScene` | Unchanged behavior; new host slide id |
| `experienceMedia.ts` | Add `00-super-stack` to `STILL_ONLY_IDS`; poster from `conceptSrc`. Omni slug map unchanged |
| `ExperienceShell` | `shouldShowAffiliateCta` range shifts from `7–18` to `8–19` (after Full Stack ends at index 7; hidden on Action, index 20) |
| Remotion | `IncomeStackFilm` / timeline consume `FILM_SLIDES = SLIDES.filter(s => s.copyLayout !== "hero-caption")` — rendered film stays the 20-scene cut. `17-compounding` preset change removes the wrong hero flywheel |
| `streamIndex.ts` | `isStreamIndexSlide` stays `08-ten-layers` |
| Tests / e2e | Count 21; counter `01 / 21`; hero3d id; axe on the new title node. `RETAIL_SCENE` 9→10, `CLOSING_SCENE` 20→21; the `TITLE_HEADLINE` h1 check moves to scene 2 (scene 1 h1 is the Super Stack title); on-load chapter assertion `Full Stack` → `Super Stack`; regenerate all `scene-01-title*` snapshot baselines |
| `SLIDES.md` | Mirror the 21-scene SSOT |

`Slide` gains `copyLayout?: "lower-third" | "hero-caption"`. Default `"lower-third"`. Only `00-super-stack` sets `"hero-caption"`.

## Plate actions

| Plate | Action |
|---|---|
| 05 Product, 07 Development, 19 Future | Keep. Measure caption seats from the PNG |
| 06 Brand | Keep art. Type on the right rail |
| 17 Compounding | Keep art. Three high-platform labels only |
| 02 World | Recolor. Crown captions above slabs |
| 18 Different | Poster / still. No on-plate type. Regen out of scope |
| 01 10-slab | Scene 02. Crown pillars only |
| Title GLB | Scene 01. Already framed on `feat/income-stack-title-patch-glb` |

## Compliance

- Income numbers and weekly-pay / qualifying-kit language stay
- Every money slide plus Future plus Close keeps the disclosure
- Product outcomes stay non-clinical; presenter note on Product unchanged
- Third-party marks stay off generated art
- Aspiration ladder is a choice of pace, not a typical result

## Acceptance criteria

| Criterion | Pass |
|---|---|
| Count | `SLIDES.length === 21` and `assertSlidesValid(SLIDES)` passes |
| Scene 01 | `00-super-stack` mounts `PatchHeroScene`; two-line title under the patch; no `.scene-copy`; no annotations |
| Title string | Visible text is exactly `THE SUPERPATCH` and `SUPER STACK` |
| Trademark | `Income Stack™` appears on scene 02, not on scene 01 |
| Seats | Every remaining annotation sits in crown, tile, right rail, or a measured metric seat. None in y 62–68 |
| Deleted chips | Mid-stack lockup, World y=36 row, flywheel sentences, Brand x=22, Development halo, ten-layer x=22, Compounding six-row, Different checklist, Close pillars — gone |
| Four stacks | Live annotations hidden while Omni is baked |
| Compact | Required chips have `yPct <= 52` |
| Income math | Unchanged |
| Counter | `NN / 21` |
| Chapters | Five labels; Super Stack is scene 01 only; on-load chapter reads `Super Stack` |
| CTA | Affiliate header shows on indices 8–19; hidden on Super Stack, Full Stack, and Action |
| Film | Remotion render is byte-identical in scene count to today (20 scenes); no hero flywheel on `17-compounding` |
| Validator | `assertSlidesValid(SLIDES)` passes with the hero-caption exemption; all other slides still meet the 30–50 word budget |
| SSOT | `SLIDES.md` matches `slides.ts` |
| World art | Slabs are not the four-stack color roles |

## Implementation phases (for the plan, not this spec’s code)

1. Port the patch files from `.worktrees/title-patch-glb` into the gap-fill app (file copy — the branches share no history; see the Architecture port row). Verify `?view=hero3d` renders the patch before touching slides
2. 21-scene contract: insert `00-super-stack`, validator exemption, chapters, hero3d id, media entry, CTA range, Remotion `FILM_SLIDES` filter, `17-compounding` preset — plus unit tests
3. `copyLayout: "hero-caption"` + CSS seat for scene 01
4. Retarget / delete chips to the seats in this spec
5. Recolor World still
6. e2e: shifted indices, moved h1 check, chapter label, regenerated `scene-01-title*` baselines
7. Docs: `SLIDES.md`, README, this spec marked approved
