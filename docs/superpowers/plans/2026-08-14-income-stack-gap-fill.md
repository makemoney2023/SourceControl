# Income Stack Gap Fill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the Income Stack deck from 15 to 20 scenes so every phrase from the source board is live overlay copy, with seven new text-free plates for the missing Full Stack beats.

**Architecture:** `slides.ts` remains SSOT. New scene IDs that have no Omni clip use a still-only `experienceMedia` fallback (poster = `conceptSrc`, no `<video>`). Existing income Omni files keep their slugs. Chapters become four ranges keyed by array index.

**Tech Stack:** Vite, React 19, TypeScript, Vitest, Playwright. App root: `apps/superpatch-income-stack`.

**Spec:** `docs/superpowers/specs/2026-08-14-income-stack-gap-fill-design.md`

## Global Constraints

- Scene count is **20**. `assertSlidesValid` and `assertExperienceMediaValid` must both require 20.
- Plates stay text-free. PNG phrases live in `eyebrow` / `headline` / `body` / `onScreenBody` / `annotations[]` only.
- Keep income slide IDs `07-retail` … `14-global` and `15-closing`. Do not rename Omni files.
- Retire `02-question` and `05-ecosystem`. Rename `06-ten-layers` → `08-ten-layers`.
- New IDs: `02-world`, `05-product`, `06-brand`, `07-development`, `17-compounding`, `18-different`, `19-future`.
- Pairing stays: stacks 7+8 on `13-executive`, 9+10 on `14-global`.
- Film body / `onScreenBody` stays 30–50 words. No “guaranteed” earnings language.
- `19-future` and `15-closing` require `INCOME_DISCLOSURE`.
- Do not bake Forbes / Mind Pump / other press marks into generated art.
- Omni/Veo loops for new IDs are out of scope.
- TDD: write the failing test, run it, then implement.
- Run tests from `apps/superpatch-income-stack` with `npm test`.

## File map

| File | Responsibility |
|---|---|
| `src/data/slides.ts` | 20-slide SSOT, chapters, `assertSlidesValid` |
| `src/data/slides.test.ts` | Copy, count, disclosure, annotation contracts |
| `src/data/experienceChapters.test.ts` | Four-chapter index map + `NN / 20` |
| `src/data/streamIndex.ts` | `isStreamIndexSlide` → `08-ten-layers` |
| `src/data/streamIndex.test.ts` | Index id + income-only range |
| `src/data/experienceMedia.ts` | Still-only fallback + slug remap |
| `src/data/experienceMedia.test.ts` | 20 entries; Omni vs still-only |
| `src/components/experience/SceneVideo.tsx` | Skip `<video>` when `src` is empty |
| `src/components/experience/ExperienceShell.tsx` | Affiliate CTA after Full Stack, hide on Action |
| `src/components/experience/ExperienceShell.test.tsx` | 20 scenes, `02-world`, Full Stack label |
| `src/components/experience/ExperienceChrome.test.tsx` | `07 / 20` |
| `src/components/DeckShell.test.tsx` | 20 slides, `02-world` |
| `src/remotion/timeline.test.ts` | Drop hardcoded 4248; keep formula |
| `src/remotion/components/flywheelPlacement.ts` | Comment id |
| `src/remotion/components/flywheelPlacement.test.ts` | `02-world` |
| `e2e/experience.spec.ts` | 20 scenes, new ids, `01 / 20` |
| `docs/.../assets/copy/SLIDES.md` | Mirror `slides.ts` |
| `apps/superpatch-income-stack/README.md` | 20 scenes / four chapters |
| `public/concepts/clean/sp-stack-{02-world,05-product,06-brand,07-development,17-compounding,18-different,19-future}.png` | New stills |

---

### Task 1: Still-only experience media

**Files:**
- Modify: `apps/superpatch-income-stack/src/data/experienceMedia.ts`
- Modify: `apps/superpatch-income-stack/src/data/experienceMedia.test.ts`
- Modify: `apps/superpatch-income-stack/src/components/experience/SceneVideo.tsx`
- Test: `apps/superpatch-income-stack/src/data/experienceMedia.test.ts`

**Interfaces:**
- Consumes: `SLIDES` (still 15 until Task 3; this task must not break current 15)
- Produces: `ExperienceMedia.stillOnly?: boolean`; `assertExperienceMediaValid` allows empty `src` when `stillOnly` is true; `SceneVideo` renders poster-only when `variant.src` is empty

- [ ] **Step 1: Write the failing still-only tests**

Add to `experienceMedia.test.ts` (keep the existing 15-count tests until Task 3):

```ts
it("treats an empty src as still-only poster media", () => {
  const still: ExperienceMedia = {
    slideId: "05-product",
    stillOnly: true,
    landscape: {
      src: "",
      poster: "/concepts/clean/sp-stack-07-retail.png",
      width: 1920,
      height: 1080,
    },
    portrait: {
      src: "",
      poster: "/concepts/clean/sp-stack-07-retail.png",
      width: 1920,
      height: 1080,
    },
  };
  expect(still.stillOnly).toBe(true);
  expect(still.landscape.src).toBe("");
});
```

- [ ] **Step 2: Run the new test**

Run: `npm test -- src/data/experienceMedia.test.ts`

Expected: FAIL — `stillOnly` is not on `ExperienceMedia`.

- [ ] **Step 3: Add the type and assertion branch**

In `experienceMedia.ts`, extend the type and relax Omni requirements for still-only rows:

```ts
export type ExperienceMedia = {
  slideId: string;
  landscape: ExperienceVariant;
  portrait: ExperienceVariant;
  brandLockup?: boolean;
  stillOnly?: boolean;
};

export function assertExperienceMediaValid(media: ExperienceMedia[]): void {
  if (media.length !== SLIDES.length) {
    throw new Error(
      `Expected ${SLIDES.length} experience media entries, got ${media.length}`,
    );
  }
  const ids = media.map((m) => m.slideId);
  if (new Set(ids).size !== ids.length) {
    throw new Error("Duplicate experience media slide ids");
  }
  for (const entry of media) {
    if (entry.stillOnly) {
      if (entry.landscape.src || entry.portrait.src) {
        throw new Error(`stillOnly ${entry.slideId} must have empty src`);
      }
      if (!entry.landscape.poster || !entry.portrait.poster) {
        throw new Error(`stillOnly ${entry.slideId} needs posters`);
      }
      continue;
    }
    const slug = SLIDE_TO_OMNI_SLUG[entry.slideId];
    if (!slug) {
      throw new Error(`Missing Omni slug for ${entry.slideId}`);
    }
    omniIdForSlide(entry.slideId);
    if (entry.slideId === "15-closing" && !entry.brandLockup) {
      throw new Error("Closing scene must set brandLockup");
    }
  }
}
```

Keep `EXPERIENCE_MEDIA` mapping as-is for now (still 15 Omni rows).

In `SceneVideo.tsx`, skip the video element when there is no src:

```tsx
const stillOnly = !variant.src;
// ...
{attachVideo && !failed && !stillOnly ? (
  <video /* existing props */ />
) : null}
```

Set `data-media-state` to `"poster-only"` when `stillOnly` is true.

- [ ] **Step 4: Re-run media tests**

Run: `npm test -- src/data/experienceMedia.test.ts`

Expected: PASS (existing 15 Omni tests unchanged).

- [ ] **Step 5: Commit**

```bash
git add apps/superpatch-income-stack/src/data/experienceMedia.ts \
  apps/superpatch-income-stack/src/data/experienceMedia.test.ts \
  apps/superpatch-income-stack/src/components/experience/SceneVideo.tsx
git commit -m "$(cat <<'EOF'
feat(income-stack): allow still-only experience media

New Full Stack scenes have no Omni clip yet. Empty src now renders poster-only.
EOF
)"
```

---

### Task 2: Four chapters and the 20-count contract

**Files:**
- Modify: `apps/superpatch-income-stack/src/data/slides.ts` (`assertSlidesValid`, `EXPERIENCE_CHAPTERS`, `ExperienceChapterId` only — do not rewrite `SLIDES` yet)
- Modify: `apps/superpatch-income-stack/src/data/experienceChapters.test.ts`
- Modify: `apps/superpatch-income-stack/src/data/slides.test.ts` (count test only)
- Modify: `apps/superpatch-income-stack/src/components/experience/ExperienceShell.tsx` (`shouldShowAffiliateCta`)

**Interfaces:**
- Consumes: Task 1 still-only media
- Produces:

```ts
export type ExperienceChapterId =
  | "full-stack"
  | "ten-income-streams"
  | "momentum"
  | "action";

export const EXPERIENCE_CHAPTERS: ExperienceChapter[] = [
  { id: "full-stack", label: "Full Stack", sceneStart: 0, sceneEnd: 6 },
  { id: "ten-income-streams", label: "Ten Income Streams", sceneStart: 7, sceneEnd: 15 },
  { id: "momentum", label: "Momentum", sceneStart: 16, sceneEnd: 18 },
  { id: "action", label: "Action", sceneStart: 19, sceneEnd: 19 },
];
```

`assertSlidesValid`: `if (slides.length !== 20)`.

`shouldShowAffiliateCta(activeIndex)`: `return activeIndex >= 7 && activeIndex <= 18;`

- [ ] **Step 1: Rewrite chapter + count tests so they fail**

Replace `experienceChapters.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import * as SlideData from "./slides";

describe("experienceChapters", () => {
  it("maps every scene into the four approved chapters", () => {
    expect(SlideData.chapterForSceneIndex(0).id).toBe("full-stack");
    expect(SlideData.chapterForSceneIndex(6).id).toBe("full-stack");
    expect(SlideData.chapterForSceneIndex(7).id).toBe("ten-income-streams");
    expect(SlideData.chapterForSceneIndex(15).id).toBe("ten-income-streams");
    expect(SlideData.chapterForSceneIndex(16).id).toBe("momentum");
    expect(SlideData.chapterForSceneIndex(18).id).toBe("momentum");
    expect(SlideData.chapterForSceneIndex(19).id).toBe("action");
    expect(SlideData.formatSceneCounter(6)).toBe("07 / 20");
    expect(SlideData.formatSceneCounter(19)).toBe("20 / 20");
  });
});
```

In `slides.test.ts` change the first test to `expect(SLIDES).toHaveLength(20)`.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/data/experienceChapters.test.ts src/data/slides.test.ts`

Expected: FAIL — chapters still say Foundation; `SLIDES` length 15; `assertSlidesValid` still wants 15.

- [ ] **Step 3: Update chapter types, `assertSlidesValid`, and affiliate CTA**

Change only the contract pieces in `slides.ts` (length 20, chapter table above). Leave the `SLIDES` array at 15 until Task 3 — `assertSlidesValid(SLIDES)` will fail, which is expected until Task 3. Do **not** change the `it("assertSlidesValid passes for SLIDES")` expectation yet; Task 3 will make it pass.

Implement `shouldShowAffiliateCta` as specified.

- [ ] **Step 4: Confirm chapter test now fails only on `formatSceneCounter` / missing indices if `SLIDES` is still 15**

`formatSceneCounter(19)` clamps to `SLIDES.length - 1`, so it will read `15 / 15` until Task 3 adds slides. That is acceptable — Task 3 unblocks it.

If the chapter test asserts `formatSceneCounter(6) === "07 / 20"` it will fail while length is 15. Keep that assertion; Task 3 is the fix.

- [ ] **Step 5: Commit the contract change**

```bash
git add apps/superpatch-income-stack/src/data/slides.ts \
  apps/superpatch-income-stack/src/data/experienceChapters.test.ts \
  apps/superpatch-income-stack/src/data/slides.test.ts \
  apps/superpatch-income-stack/src/components/experience/ExperienceShell.tsx
git commit -m "$(cat <<'EOF'
feat(income-stack): lock 20-scene four-chapter contract

Full Stack, Ten Income Streams, Momentum, and Action replace the 15-scene Foundation map.
EOF
)"
```

---

### Task 3: Rewrite `SLIDES` to 20 scenes

**Files:**
- Modify: `apps/superpatch-income-stack/src/data/slides.ts` (`SLIDES` array)
- Modify: `apps/superpatch-income-stack/src/data/slides.test.ts`
- Modify: `apps/superpatch-income-stack/src/data/streamIndex.ts`
- Modify: `apps/superpatch-income-stack/src/data/streamIndex.test.ts`
- Modify: `apps/superpatch-income-stack/src/data/experienceMedia.ts` (`SLIDE_TO_OMNI_SLUG` + `EXPERIENCE_MEDIA` builder)
- Modify: `apps/superpatch-income-stack/src/data/experienceMedia.test.ts`
- Modify: `apps/superpatch-income-stack/src/remotion/timeline.test.ts`
- Modify: `apps/superpatch-income-stack/src/remotion/components/flywheelPlacement.ts`
- Modify: `apps/superpatch-income-stack/src/remotion/components/flywheelPlacement.test.ts`

**Interfaces:**
- Consumes: Task 1 `stillOnly`; Task 2 chapter ranges
- Produces: `SLIDES` length 20 with the ids and copy below; `isStreamIndexSlide("08-ten-layers")`; media rows for every slide

**Stand-in plates (replace in Task 6):**

| New id | Temporary `conceptSrc` |
|---|---|
| `02-world` | `/concepts/clean/sp-stack-02-the-question.png` |
| `05-product` | `/concepts/clean/sp-stack-07-retail.png` |
| `06-brand` | `/concepts/clean/sp-stack-03-four-stacks.png` |
| `07-development` | `/concepts/clean/sp-stack-12-generations.png` |
| `17-compounding` | `/concepts/clean/sp-stack-05-ecosystem.png` |
| `18-different` | `/concepts/clean/sp-stack-07-retail.png` |
| `19-future` | `/concepts/clean/sp-stack-15-closing.png` |

`08-ten-layers` keeps `/concepts/clean/sp-stack-06-ten-layers.png` and its existing hero/Omni.

- [ ] **Step 1: Rewrite copy/id tests so they fail**

Replace the slide-06 and ecosystem tests in `slides.test.ts`:

```ts
it("has 20 slides with copy fields", () => {
  expect(SLIDES).toHaveLength(20);
  expect(SLIDES.map((s) => s.id)).toEqual([
    "01-title",
    "02-world",
    "03-four-stacks",
    "04-flywheel",
    "05-product",
    "06-brand",
    "07-development",
    "08-ten-layers",
    "07-retail",
    "08-fast-start",
    "09-team-overrides",
    "10-md-depth",
    "11-vp-override",
    "12-generations",
    "13-executive",
    "14-global",
    "17-compounding",
    "18-different",
    "19-future",
    "15-closing",
  ]);
});

it("rewrites the ten-stream index as 08-ten-layers with tier bands", () => {
  const bridge = SLIDES.find((s) => s.id === "08-ten-layers")!;
  expect(bridge.eyebrow).toBe("Income Stack™ — Ten Streams");
  expect(bridge.headline).toBe("One Opportunity. Ten Income Streams.");
  expect(bridge.annotations?.map((a) => a.text)).toEqual([
    "1–3 FOUNDATION",
    "4–7 LEADERSHIP",
    "8–10 EXECUTIVE & GLOBAL",
  ]);
});

it("covers the seven new Full Stack and Momentum beats", () => {
  expect(SLIDES.find((s) => s.id === "02-world")!.headline).toMatch(
    /no longer optional/i,
  );
  expect(SLIDES.find((s) => s.id === "05-product")!.eyebrow).toBe("Product Stack");
  expect(SLIDES.find((s) => s.id === "06-brand")!.eyebrow).toBe(
    "Brand & Marketing Stack",
  );
  expect(SLIDES.find((s) => s.id === "07-development")!.headline).toMatch(
    /better people/i,
  );
  expect(SLIDES.find((s) => s.id === "17-compounding")!.eyebrow).toMatch(
    /Compounding/i,
  );
  expect(SLIDES.find((s) => s.id === "18-different")!.eyebrow).toMatch(
    /Different/i,
  );
  const future = SLIDES.find((s) => s.id === "19-future")!;
  expect(future.requiresDisclosure).toBe(true);
  expect(future.disclosure).toBe(INCOME_DISCLOSURE);
});

it("keeps product presenter notes off invented clinical claims", () => {
  const product = SLIDES.find((s) => s.id === "05-product")!;
  expect(product.presenterNotes).toMatch(/official Super Patch materials/i);
  expect(product.body.toLowerCase()).not.toMatch(/\bguaranteed\b/);
  const four = SLIDES.find((s) => s.id === "03-four-stacks")!;
  expect(four.presenterNotes).toMatch(/official Super Patch materials/i);
});
```

In `streamIndex.test.ts`:

```ts
expect(isIncomeStreamSlide("08-ten-layers")).toBe(false);
expect(isStreamIndexSlide("08-ten-layers")).toBe(true);
expect(isStreamIndexSlide("06-ten-layers")).toBe(false);
```

Import `isStreamIndexSlide`.

In `experienceMedia.test.ts`:
- Change length assertions from 15 to `SLIDES.length` / 20
- `mediaWindow(0, 20)`, `mediaWindow(7, 20)`, `mediaWindow(19, 20)` → `[0,1]`, `[6,7,8]`, `[18,19]`
- Split the “every scene has Omni mp4” test: Omni rows must match the mp4 regex; still-only rows must have empty `src` and a `public/concepts/clean/` poster
- Replace `02-question` with `03-four-stacks` vs `01-title` for the poster-hash guard, or skip that test if `02-world` is still-only

In `timeline.test.ts` delete the `toBe(4248)` line. Keep the formula assertion.

In `flywheelPlacement.test.ts` use `02-world` instead of `02-question`.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/data/slides.test.ts src/data/streamIndex.test.ts src/data/experienceMedia.test.ts`

Expected: FAIL — old ids still in `SLIDES`.

- [ ] **Step 3: Implement the 20-slide array and media map**

`streamIndex.ts`:

```ts
export function isStreamIndexSlide(slideId: string): boolean {
  return slideId === "08-ten-layers";
}
```

`SLIDE_TO_OMNI_SLUG` (drop retired ids; point the renamed index at the existing ten-layers Omni):

```ts
const SLIDE_TO_OMNI_SLUG: Record<string, string> = {
  "01-title": "title",
  "03-four-stacks": "four-stacks",
  "04-flywheel": "flywheel",
  "08-ten-layers": "ten-layers",
  "07-retail": "retail",
  "08-fast-start": "fast-start",
  "09-team-overrides": "team-overrides",
  "10-md-depth": "unlimited-depth",
  "11-vp-override": "vp-override",
  "12-generations": "generations",
  "13-executive": "executive",
  "14-global": "global-pool",
  "15-closing": "closing",
};

const STILL_ONLY_IDS = new Set([
  "02-world",
  "05-product",
  "06-brand",
  "07-development",
  "17-compounding",
  "18-different",
  "19-future",
]);
```

Build `EXPERIENCE_MEDIA` from `SLIDES`:

```ts
export const EXPERIENCE_MEDIA: ExperienceMedia[] = SLIDES.map((slide) => {
  if (STILL_ONLY_IDS.has(slide.id)) {
    const poster = slide.conceptSrc;
    return {
      slideId: slide.id,
      stillOnly: true,
      landscape: { src: "", poster, width: 1920, height: 1080 },
      portrait: { src: "", poster, width: 1920, height: 1080 },
    };
  }
  return {
    slideId: slide.id,
    landscape: variantFor(slide.id, "16x9", 1280, 720),
    portrait: variantFor(slide.id, "9x16", 720, 1280),
    brandLockup: slide.id === "15-closing" ? true : undefined,
  };
});
```

Replace the `SLIDES` array. Keep the existing objects for `07-retail` … `14-global` unchanged. Use these locked objects for changed/new scenes (no `hero` on still-only scenes):

```ts
{
  id: "01-title",
  conceptSrc: "/concepts/clean/sp-stack-01-title.png",
  hero: { src: "/concepts/animated/sp-stack-01-title_animated.mp4", width: 1280, height: 720, annotationsBaked: false },
  heroVideoSrc: "/concepts/animated/sp-stack-01-title_animated.mp4",
  accent: "blue",
  eyebrow: "The Super Patch Income Stack™",
  headline: "More Than an Affiliate Program. A Complete Opportunity.",
  body: "At Super Patch we did not build another affiliate program. We built a complete opportunity: better health, greater freedom, and bigger impact. One company. Four stacks. Ten income streams. Infinite potential.",
  annotations: [
    { text: "BETTER HEALTH", xPct: 18, yPct: 28, sizePct: 3.2, role: "label" },
    { text: "GREATER FREEDOM", xPct: 50, yPct: 28, sizePct: 3.2, role: "label" },
    { text: "BIGGER IMPACT", xPct: 82, yPct: 28, sizePct: 3.2, role: "label" },
    { text: "ONE COMPANY", xPct: 20, yPct: 48, sizePct: 2.8, role: "label" },
    { text: "FOUR STACKS", xPct: 40, yPct: 48, sizePct: 2.8, role: "label" },
    { text: "TEN INCOME STREAMS", xPct: 62, yPct: 48, sizePct: 2.8, role: "label" },
    { text: "INFINITE POTENTIAL", xPct: 84, yPct: 48, sizePct: 2.8, role: "label" },
  ],
  flywheelArc: "income",
  motionPreset: "parallax-slabs",
  requiresDisclosure: false,
},
{
  id: "02-world",
  conceptSrc: "/concepts/clean/sp-stack-02-the-question.png",
  accent: "cool",
  eyebrow: "The World Has Changed",
  headline: "Multiple income streams are no longer optional.",
  body: "People want more freedom, more purpose, and more control of their future. Traditional jobs, the gig economy, the creator economy, and social commerce all point the same way: one stream is not a plan. Multiple income streams are essential.",
  annotations: [
    { text: "TRADITIONAL JOBS", xPct: 16, yPct: 36, sizePct: 3.0, role: "label" },
    { text: "GIG ECONOMY", xPct: 38, yPct: 36, sizePct: 3.0, role: "label" },
    { text: "CREATOR ECONOMY", xPct: 60, yPct: 36, sizePct: 3.0, role: "label" },
    { text: "SOCIAL COMMERCE", xPct: 82, yPct: 36, sizePct: 3.0, role: "label" },
  ],
  motionPreset: "ken-burns-glow",
  requiresDisclosure: false,
},
{
  id: "03-four-stacks",
  // keep existing hero + conceptSrc
  accent: "multi",
  eyebrow: "The Super Patch Full Stack",
  headline: "One Company. Four Stacks. Ten Income Streams. Infinite Potential.",
  body: "We are building a full-stack human performance ecosystem: Product delivers outcomes, Brand & Marketing creates demand, Income opens opportunity, and Personal Development builds leaders. Each layer strengthens the others — not a catalog, a system.",
  annotations: [
    { text: "PRODUCT STACK", xPct: 17.12, yPct: 48, sizePct: 3.2, role: "label" },
    { text: "BRAND & MARKETING", xPct: 38.44, yPct: 48, sizePct: 3.2, role: "label" },
    { text: "INCOME STACK", xPct: 60.97, yPct: 48, sizePct: 3.2, role: "label" },
    { text: "PERSONAL DEVELOPMENT", xPct: 82.85, yPct: 48, sizePct: 3.2, role: "label" },
  ],
  flywheelArc: "all",
  motionPreset: "pillars-sequence",
  requiresDisclosure: false,
  presenterNotes:
    "Product trust: point to official Super Patch materials for outcomes — do not invent clinical claims on this slide.",
},
{
  id: "04-flywheel",
  // keep existing hero + conceptSrc + body
  eyebrow: "Why the Full Stack Wins",
  headline: "Each Stack Reinforces the Others",
  annotations: [
    { text: "PRODUCT", xPct: 20.21, yPct: 34.77, sizePct: 5.97, role: "label" },
    { text: "BRAND", xPct: 80.63, yPct: 34.72, sizePct: 5.83, role: "label" },
    { text: "PEOPLE", xPct: 19.73, yPct: 48, sizePct: 5.97, role: "label" },
    { text: "INCOME", xPct: 80.76, yPct: 48, sizePct: 5.83, role: "label" },
    { text: "Products create customers", xPct: 50, yPct: 22, sizePct: 2.6, role: "label" },
    { text: "Marketing creates demand", xPct: 50, yPct: 28, sizePct: 2.6, role: "label" },
    { text: "Income creates opportunity", xPct: 50, yPct: 52, sizePct: 2.6, role: "label" },
    { text: "Personal development creates leaders", xPct: 50, yPct: 58, sizePct: 2.6, role: "label" },
  ],
},
{
  id: "05-product",
  conceptSrc: "/concepts/clean/sp-stack-07-retail.png",
  accent: "green",
  eyebrow: "Product Stack",
  headline: "Better products. Better results. Raving customers.",
  body: "World-class VTT™ patches and innovative wellness solutions that deliver real results. Proprietary technology, backed by science, more than fifteen targeted solutions, trusted by millions. Better products create raving customers — and customers start the Income Stack.",
  annotations: [
    { text: "Proprietary Technology", xPct: 22, yPct: 32, sizePct: 2.8, role: "label" },
    { text: "Backed by Science", xPct: 22, yPct: 40, sizePct: 2.8, role: "label" },
    { text: "15+ Targeted Solutions", xPct: 22, yPct: 48, sizePct: 2.8, role: "label" },
    { text: "Trusted by Millions", xPct: 22, yPct: 56, sizePct: 2.8, role: "label" },
  ],
  flywheelArc: "product",
  motionPreset: "node-mesh",
  requiresDisclosure: false,
  presenterNotes:
    "Product trust: point to official Super Patch materials for outcomes — do not invent clinical claims on this slide.",
},
{
  id: "06-brand",
  conceptSrc: "/concepts/clean/sp-stack-03-four-stacks.png",
  accent: "blue",
  eyebrow: "Brand & Marketing Stack",
  headline: "Massive visibility. Powerful credibility. Relentless momentum.",
  body: "Super Patch shows up where trust is built: global media and PR, top creators, retail and digital channels, healthcare professionals, and pro sports. Massive visibility. Powerful credibility. Relentless momentum.",
  annotations: [
    { text: "Global Media & PR", xPct: 22, yPct: 30, sizePct: 2.6, role: "label" },
    { text: "Top Creators & Influencers", xPct: 22, yPct: 36, sizePct: 2.6, role: "label" },
    { text: "Retail & Digital Channels", xPct: 22, yPct: 42, sizePct: 2.6, role: "label" },
    { text: "Healthcare Professionals", xPct: 22, yPct: 48, sizePct: 2.6, role: "label" },
    { text: "Pro Sports & Elite Teams", xPct: 22, yPct: 54, sizePct: 2.6, role: "label" },
  ],
  flywheelArc: "brand",
  motionPreset: "ken-burns-glow",
  requiresDisclosure: false,
},
{
  id: "07-development",
  conceptSrc: "/concepts/clean/sp-stack-12-generations.png",
  accent: "violet",
  eyebrow: "Personal Development Stack",
  headline: "We don’t just build businesses. We build better people.",
  body: "Leadership development, sales mastery, communication skills, financial education, mindset and growth, community and support. Grow personally. Lead powerfully. Live fully. Personal development is the stack that turns customers and affiliates into leaders.",
  annotations: [
    { text: "LEADERSHIP DEVELOPMENT", xPct: 50, yPct: 26, sizePct: 2.5, role: "label" },
    { text: "SALES MASTERY", xPct: 22, yPct: 36, sizePct: 2.5, role: "label" },
    { text: "COMMUNICATION SKILLS", xPct: 78, yPct: 36, sizePct: 2.5, role: "label" },
    { text: "FINANCIAL EDUCATION", xPct: 22, yPct: 48, sizePct: 2.5, role: "label" },
    { text: "MINDSET & GROWTH", xPct: 78, yPct: 48, sizePct: 2.5, role: "label" },
    { text: "COMMUNITY & SUPPORT", xPct: 50, yPct: 56, sizePct: 2.5, role: "label" },
  ],
  flywheelArc: "development",
  motionPreset: "generation-rings",
  requiresDisclosure: false,
},
{
  id: "08-ten-layers",
  conceptSrc: "/concepts/clean/sp-stack-06-ten-layers.png",
  // keep existing hero paths
  accent: "orange",
  eyebrow: "Income Stack™ — Ten Streams",
  headline: "One Opportunity. Ten Income Streams.",
  body: "On the next slides we walk ten named streams: Retail twenty-five percent, Fast Start and Rank Advancement, Team Overrides, Managing Director Depth Bonus, Vice President Override, Generation Bonuses, Executive Leadership Override, CEO Leadership Bonus, Global President Override, and the Global Leadership Pool. We start where everyone starts.",
  onScreenBody:
    "Start with retail. Stack leadership as you grow. Ten named streams follow — retail, Fast Start and ranks, team overrides, MD depth, VP override, generations, executive and CEO bonuses, then Global President override and the Global Leadership Pool.",
  voiceover: "Let's walk them one by one, starting where everyone starts.",
  annotations: [
    { text: "1–3 FOUNDATION", xPct: 22, yPct: 28, sizePct: 3.0, role: "label" },
    { text: "4–7 LEADERSHIP", xPct: 22, yPct: 40, sizePct: 3.0, role: "label" },
    { text: "8–10 EXECUTIVE & GLOBAL", xPct: 28, yPct: 52, sizePct: 3.0, role: "label" },
  ],
  flywheelArc: "income",
  motionPreset: "exploded-layers",
  requiresDisclosure: false,
},
```

Then the eight unchanged income slides (`07-retail` … `14-global`).

Then:

```ts
{
  id: "17-compounding",
  conceptSrc: "/concepts/clean/sp-stack-05-ecosystem.png",
  accent: "orange",
  eyebrow: "The Power of Compounding Income",
  headline: "Every activity. Every layer. Every time.",
  body: "One customer becomes ten. Ten become more than a hundred. Customers become teams. Teams become leaders. Leaders unlock multiple income streams. The more you build, the more the Income Flywheel grows.",
  annotations: [
    { text: "ONE CUSTOMER", xPct: 16, yPct: 32, sizePct: 2.6, role: "label" },
    { text: "TEN CUSTOMERS", xPct: 32, yPct: 32, sizePct: 2.6, role: "label" },
    { text: "100+ CUSTOMERS", xPct: 50, yPct: 32, sizePct: 2.6, role: "label" },
    { text: "TEAMS", xPct: 66, yPct: 32, sizePct: 2.6, role: "label" },
    { text: "LEADERS", xPct: 78, yPct: 32, sizePct: 2.6, role: "label" },
    { text: "MULTIPLE INCOME STREAMS", xPct: 50, yPct: 48, sizePct: 2.6, role: "label" },
  ],
  flywheelArc: "income",
  motionPreset: "flywheel-scrub",
  requiresDisclosure: false,
},
{
  id: "18-different",
  conceptSrc: "/concepts/clean/sp-stack-07-retail.png",
  accent: "multi",
  eyebrow: "Why Super Patch Is Different",
  headline: "A true Full Stack company",
  body: "Proven products people love. A massive brand and marketing engine. Ten ways to earn. Personal development built in. A global vision with unlimited potential. This is a full-stack company — not a single-commission catalog.",
  annotations: [
    { text: "A true FULL STACK company", xPct: 50, yPct: 26, sizePct: 2.4, role: "label" },
    { text: "Proven products people love", xPct: 50, yPct: 32, sizePct: 2.4, role: "label" },
    { text: "Massive brand and marketing engine", xPct: 50, yPct: 38, sizePct: 2.4, role: "label" },
    { text: "Ten ways to earn income", xPct: 50, yPct: 44, sizePct: 2.4, role: "label" },
    { text: "Personal development built in", xPct: 50, yPct: 50, sizePct: 2.4, role: "label" },
    { text: "Global vision. Unlimited potential", xPct: 50, yPct: 56, sizePct: 2.4, role: "label" },
  ],
  flywheelArc: "all",
  motionPreset: "node-mesh",
  requiresDisclosure: false,
},
{
  id: "19-future",
  conceptSrc: "/concepts/clean/sp-stack-15-closing.png",
  accent: "orange",
  eyebrow: "Imagine Your Future",
  headline: "You decide how far you go.",
  body: "Side income, income replacement, business ownership, financial freedom, or generational wealth — you choose the pace. Your future is created by the actions you take today. Income is not guaranteed. Results vary.",
  annotations: [
    { text: "SIDE INCOME", xPct: 18, yPct: 36, sizePct: 2.6, role: "label" },
    { text: "INCOME REPLACEMENT", xPct: 34, yPct: 36, sizePct: 2.6, role: "label" },
    { text: "BUSINESS OWNERSHIP", xPct: 50, yPct: 36, sizePct: 2.6, role: "label" },
    { text: "FINANCIAL FREEDOM", xPct: 66, yPct: 36, sizePct: 2.6, role: "label" },
    { text: "GENERATIONAL WEALTH", xPct: 82, yPct: 36, sizePct: 2.6, role: "label" },
  ],
  disclosure: INCOME_DISCLOSURE,
  flywheelArc: "income",
  motionPreset: "horizon-settle",
  requiresDisclosure: true,
},
{
  id: "15-closing",
  // keep existing hero + conceptSrc + CTAs
  accent: "red",
  eyebrow: "Join the Movement",
  headline: "Better Health. Greater Freedom. Bigger Impact.",
  body: "We’re building the world’s leading human performance ecosystem—together. One company. Four stacks. Ten income streams. Infinite potential. Take the next step with your sponsor.",
  annotations: [
    { text: "BETTER HEALTH", xPct: 22, yPct: 32, sizePct: 3.0, role: "label" },
    { text: "GREATER FREEDOM", xPct: 50, yPct: 32, sizePct: 3.0, role: "label" },
    { text: "BIGGER IMPACT", xPct: 78, yPct: 32, sizePct: 3.0, role: "label" },
  ],
  disclosure: INCOME_DISCLOSURE,
  ctaPrimary: "Get your affiliate link",
  ctaSecondary: "Read the Income Disclosure",
  flywheelArc: "all",
  motionPreset: "horizon-settle",
  requiresDisclosure: true,
},
```

Count words on every new `body` / `onScreenBody` before saving. If any falls outside 30–50, trim or add a clause without dropping a locked phrase from the spec.

Update the flywheelPlacement comment to say `02-world`.

- [ ] **Step 4: Run the data tests**

Run: `npm test -- src/data src/remotion/timeline.test.ts src/remotion/components/flywheelPlacement.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/superpatch-income-stack/src/data \
  apps/superpatch-income-stack/src/remotion/timeline.test.ts \
  apps/superpatch-income-stack/src/remotion/components/flywheelPlacement.ts \
  apps/superpatch-income-stack/src/remotion/components/flywheelPlacement.test.ts
git commit -m "$(cat <<'EOF'
feat(income-stack): expand slide SSOT to 20 scenes

Restore Full Stack, compounding, and future-ladder copy as live overlays.
EOF
)"
```

---

### Task 4: Shell, chrome, and DeckShell tests

**Files:**
- Modify: `apps/superpatch-income-stack/src/components/experience/ExperienceShell.test.tsx`
- Modify: `apps/superpatch-income-stack/src/components/experience/ExperienceChrome.test.tsx`
- Modify: `apps/superpatch-income-stack/src/components/DeckShell.test.tsx`

**Interfaces:**
- Consumes: 20-slide `SLIDES`, chapter label `Full Stack`, counter `NN / 20`
- Produces: passing component tests

- [ ] **Step 1: Update assertions that hard-code 15 / Foundation / `02-question`**

`ExperienceShell.test.tsx`:
- `toHaveLength(20)` for scenes and nav buttons
- `getByText("01 / 20")`
- `getByText("Full Stack")` instead of `Foundation`
- `[data-slide="02-world"]` instead of `02-question`

`ExperienceChrome.test.tsx`:
- `getByText("07 / 20")` wherever it expected `07 / 15`

`DeckShell.test.tsx`:
- slide/video counts → 20
- `[data-slide='02-world']` instead of `02-question`

- [ ] **Step 2: Run the component tests to see remaining failures**

Run: `npm test -- src/components`

Expected: FAIL only if a selector still points at a retired id; fix those selectors. No production chrome changes beyond Task 2’s CTA window.

- [ ] **Step 3: Fix any leftover selectors**

Search the app for `02-question`, `05-ecosystem`, `06-ten-layers`, `Foundation`, `/ 15`.

- [ ] **Step 4: Re-run the full unit suite**

Run: `npm test`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/superpatch-income-stack/src/components
git commit -m "$(cat <<'EOF'
test(income-stack): point shell and deck tests at the 20-scene map
EOF
)"
```

---

### Task 5: E2E contract

**Files:**
- Modify: `apps/superpatch-income-stack/e2e/experience.spec.ts`

**Interfaces:**
- Consumes: 20 `[data-experience-scene]`, `02-world`, `01 / 20`, chapter `Full Stack`
- Produces: Playwright spec that matches the new narrative

- [ ] **Step 1: Update the e2e assertions**

- `toHaveCount(20)` for `[data-experience-scene]`
- `jumpToScene(page, 20)` for the closing scene (1-based last scene)
- `01 / 20` instead of `01 / 15`
- `Full Stack` instead of `Foundation`
- `02-world` instead of `02-question`
- Closing remains `[data-slide="15-closing"]`

- [ ] **Step 2: Run e2e**

Run: `npm run test:e2e`

Expected: FAIL on old counts / labels / snapshots for scene 2.

- [ ] **Step 3: Re-record snapshots that the narrative change invalidates**

Run: `npm run test:e2e:update` only for screenshots that failed because copy or scene count changed. Do not refresh unrelated snapshots.

- [ ] **Step 4: Re-run e2e**

Run: `npm run test:e2e`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/superpatch-income-stack/e2e
git commit -m "$(cat <<'EOF'
test(income-stack): update experience e2e for 20 scenes
EOF
)"
```

---

### Task 6: Seven new text-free concept plates

**Files:**
- Create: `apps/superpatch-income-stack/public/concepts/clean/sp-stack-02-world.png`
- Create: `apps/superpatch-income-stack/public/concepts/clean/sp-stack-05-product.png`
- Create: `apps/superpatch-income-stack/public/concepts/clean/sp-stack-06-brand.png`
- Create: `apps/superpatch-income-stack/public/concepts/clean/sp-stack-07-development.png`
- Create: `apps/superpatch-income-stack/public/concepts/clean/sp-stack-17-compounding.png`
- Create: `apps/superpatch-income-stack/public/concepts/clean/sp-stack-18-different.png`
- Create: `apps/superpatch-income-stack/public/concepts/clean/sp-stack-19-future.png`
- Modify: `apps/superpatch-income-stack/src/data/slides.ts` (`conceptSrc` on the seven new ids)
- Test: `apps/superpatch-income-stack/src/data/slides.test.ts` (add path assertions)

**Interfaces:**
- Consumes: style bible in `public/concepts/clean/sp-stack-01-title.png`, `sp-stack-03-four-stacks.png`, `sp-stack-05-ecosystem.png`
- Produces: 1920×1080 text-free PNGs; `conceptSrc` points at the new files; still-only posters follow `conceptSrc`

- [ ] **Step 1: Add failing path assertions**

```ts
it("points new scenes at dedicated clean plates", () => {
  expect(SLIDES.find((s) => s.id === "02-world")!.conceptSrc).toBe(
    "/concepts/clean/sp-stack-02-world.png",
  );
  expect(SLIDES.find((s) => s.id === "05-product")!.conceptSrc).toBe(
    "/concepts/clean/sp-stack-05-product.png",
  );
  expect(SLIDES.find((s) => s.id === "06-brand")!.conceptSrc).toBe(
    "/concepts/clean/sp-stack-06-brand.png",
  );
  expect(SLIDES.find((s) => s.id === "07-development")!.conceptSrc).toBe(
    "/concepts/clean/sp-stack-07-development.png",
  );
  expect(SLIDES.find((s) => s.id === "17-compounding")!.conceptSrc).toBe(
    "/concepts/clean/sp-stack-17-compounding.png",
  );
  expect(SLIDES.find((s) => s.id === "18-different")!.conceptSrc).toBe(
    "/concepts/clean/sp-stack-18-different.png",
  );
  expect(SLIDES.find((s) => s.id === "19-future")!.conceptSrc).toBe(
    "/concepts/clean/sp-stack-19-future.png",
  );
});
```

- [ ] **Step 2: Run the test**

Run: `npm test -- src/data/slides.test.ts`

Expected: FAIL — `conceptSrc` still points at stand-ins.

- [ ] **Step 3: Generate the seven plates**

Match existing clean plates: near-black void, frosted acrylic, neon rim, internal grain, reflective floor, blue mist. **No letters, numbers, logos, or UI.** Landscape 1920×1080.

Prompts (FLUX-style, positive only):

1. `sp-stack-02-world.png` — Night-side Earth curve with city lights, four frosted translucent slabs in a shallow arc, cool steel-blue glow, briefcase / rider / creator / network as abstract sculpted forms inside the slabs, reflective obsidian floor, cinematic keynote still, no text.
2. `sp-stack-05-product.png` — Single large green frosted acrylic slab, athlete node-mesh silhouette with a square wellness patch on the shoulder, four small unlit green chips in the left third reserved for later type, emerald bloom, reflective floor, no text.
3. `sp-stack-06-brand.png` — Tall blue frosted pillar under a starfield, person-as-constellation looking upward, five star-nodes in an arc, electric blue rim light, no logos, no text.
4. `sp-stack-07-development.png` — Violet mountain-peak node-mesh silhouette, six small orbiting violet frosted slabs, deep purple bloom, reflective floor, no text.
5. `sp-stack-17-compounding.png` — Orange cascading node counts receding on a reflective floor toward a luminous infinity form, amber bloom, no numerals, no text.
6. `sp-stack-18-different.png` — Extreme close-up of a frosted square patch on skin, four-color rim light green blue orange violet, dark cinematic background, no letters on the patch, no text.
7. `sp-stack-19-future.png` — Sunset city silhouette, five ascending gold-orange frosted slabs stepping up and away, warm rim light, reflective ground, no text.

Save under `apps/superpatch-income-stack/public/concepts/clean/`. If a generator returns type, regenerate. Then point each new slide’s `conceptSrc` at its new file.

- [ ] **Step 4: Run unit tests**

Run: `npm test -- src/data/slides.test.ts src/data/experienceMedia.test.ts`

Expected: PASS. Still-only posters now resolve to the new files and those files exist.

- [ ] **Step 5: Commit**

```bash
git add apps/superpatch-income-stack/public/concepts/clean/sp-stack-02-world.png \
  apps/superpatch-income-stack/public/concepts/clean/sp-stack-05-product.png \
  apps/superpatch-income-stack/public/concepts/clean/sp-stack-06-brand.png \
  apps/superpatch-income-stack/public/concepts/clean/sp-stack-07-development.png \
  apps/superpatch-income-stack/public/concepts/clean/sp-stack-17-compounding.png \
  apps/superpatch-income-stack/public/concepts/clean/sp-stack-18-different.png \
  apps/superpatch-income-stack/public/concepts/clean/sp-stack-19-future.png \
  apps/superpatch-income-stack/src/data/slides.ts \
  apps/superpatch-income-stack/src/data/slides.test.ts
git commit -m "$(cat <<'EOF'
feat(income-stack): add seven text-free Full Stack concept plates
EOF
)"
```

---

### Task 7: Docs and spec close-out

**Files:**
- Modify: `docs/orgs/superpatch/customers/affiliates/initiatives/income-stack-deck/business-idea/assets/copy/SLIDES.md`
- Modify: `apps/superpatch-income-stack/README.md`
- Modify: `docs/superpowers/specs/2026-08-14-income-stack-gap-fill-design.md` (status → Approved / implemented)

**Interfaces:**
- Consumes: final `slides.ts` copy
- Produces: `SLIDES.md` that lists all 20 slides with eyebrow, headline, body, annotations, disclosure

- [ ] **Step 1: Rewrite `SLIDES.md` to match `slides.ts`**

Use the same 20 headings and the locked strings from Task 3. Note SSOT: `apps/superpatch-income-stack/src/data/slides.ts`.

- [ ] **Step 2: Update the README experience blurb**

Replace the Foundation / 15-scene paragraph with:

```md
Default surface: **3D scroll experience** (`ExperienceShell`) — twenty full-viewport scenes that cover one another on scroll, with live HTML typography, GSAP ScrollTrigger, and a vertical scene navigator.

Premium V2 groups the story into **Full Stack (01–07)**, **Ten Income
Streams (08–16)**, **Momentum (17–19)**, and **Action (20)**.
```

Also point at `docs/superpowers/specs/2026-08-14-income-stack-gap-fill-design.md`.

- [ ] **Step 3: Mark the spec implemented**

Set **Status:** Implemented (20-scene gap fill).

- [ ] **Step 4: Run `graphify update .` from the repo root**

Expected: AST graph refresh, no API cost.

- [ ] **Step 5: Commit**

```bash
git add docs/orgs/superpatch/customers/affiliates/initiatives/income-stack-deck/business-idea/assets/copy/SLIDES.md \
  apps/superpatch-income-stack/README.md \
  docs/superpowers/specs/2026-08-14-income-stack-gap-fill-design.md
git commit -m "$(cat <<'EOF'
docs(income-stack): sync slide copy and README to the 20-scene deck
EOF
)"
```

---

## Self-review

**Spec coverage**
- 20 scenes + four chapters → Tasks 2–3
- Overlay phrases + dedicated plates → Tasks 3 and 6
- Still-only media fallback → Task 1
- Income IDs / Omni slugs preserved → Task 3 slug map
- Disclosure on future + close → Task 3
- No press logos on plates → Task 6 prompts
- `SLIDES.md` + README → Task 7
- E2E `NN / 20` → Task 5
- Omni/Veo for new IDs explicitly out of scope

**Placeholder scan:** none. Stand-in `conceptSrc` paths are real existing files, replaced in Task 6.

**Type consistency:** `ExperienceChapterId` is `full-stack | ten-income-streams | momentum | action`. Stream index id is `08-ten-layers`. Still-only flag is `stillOnly`.
