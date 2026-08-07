# Income Stack Full-Viewport Correction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the constrained media-card composition with the approved full-viewport Cinematic Lower Third, apply the Super Patch brand system, and make layered parallax visibly perceptible.

**Architecture:** Preserve the existing semantic scene, media-window, accessibility, and native-scroll architecture. Change each sticky scene into one isolated viewport stage containing an absolute edge-to-edge media plane, readability scrim, overlay copy plane, and persistent brand chrome. GSAP remains the only animation authority and animates media, scrim, and copy layers at distinct rates.

**Tech Stack:** React 19, TypeScript, CSS, GSAP 3 / ScrollTrigger, Vitest, Playwright.

## Global Constraints

- App changes stay under `apps/superpatch-income-stack`; documentation stays under the existing initiative/spec paths.
- Follow TDD: demonstrate the visual contract failing before implementation.
- Preserve all 15 scenes, approved copy, disclosures, CTAs, media-window limits, muted autoplay, reduced-motion behavior, and legacy route.
- Use Montserrat → Helvetica → Arial for HTML.
- Headlines are uppercase, weight 900/800, line-height 1, and tracking `-0.016em`.
- Body is weight 500, line-height 1.5, and lower contrast than headlines.
- Interface chrome uses white, Super Patch website greys, and SP Red `#DD0604`; supplied media retains its own accent colors.
- Motion travels bottom-to-top or left-to-right with ease-out timing.
- Incoming stages shuffle upward from `yPercent: 100` to `0` over the pinned
  previous stage. The outgoing stage stays flat, scales to `0.94`, and darkens;
  neither stage rotates or exposes a gap.
- Do not add Three.js, R3F, smooth-scroll libraries, or another animation system.
- Do not create a git commit unless the user explicitly requests one.

---

### Task 1: Lock the full-viewport visual contract

**Files:**
- Modify: `apps/superpatch-income-stack/src/components/experience/ExperienceShell.test.tsx`
- Modify: `apps/superpatch-income-stack/e2e/experience.spec.ts`

**Interfaces:**
- Consumes: existing selectors `data-scene-sticky`, `data-scene-plane`, `data-scene-media`, `data-scene-copy`.
- Produces: regression coverage for overlay hierarchy, viewport geometry, brand typography, and differential parallax.

- [ ] **Step 1: Add failing structure assertions**

Add this test to `ExperienceShell.test.tsx`:

```tsx
it("composes media, scrim, and copy as layers in one viewport stage", () => {
  const { container } = render(<ExperienceShell />);
  const scene = container.querySelector('[data-slide="01-title"]');
  const stage = scene?.querySelector("[data-scene-sticky]");

  expect(stage?.querySelector(":scope > [data-scene-plane]")).toBeTruthy();
  expect(stage?.querySelector(":scope > [data-scene-scrim]")).toBeTruthy();
  expect(stage?.querySelector(":scope > [data-scene-copy]")).toBeTruthy();
  expect(
    stage?.querySelector("[data-scene-copy] [data-anim-layer='headline']"),
  ).toBeTruthy();
});
```

- [ ] **Step 2: Add failing browser geometry and typography assertions**

Add to `e2e/experience.spec.ts`:

```ts
test("first scene is an edge-to-edge branded overlay", async ({ page }) => {
  await page.goto("/");
  const geometry = await page.locator('[data-slide="01-title"]').evaluate((scene) => {
    const stage = scene.querySelector<HTMLElement>("[data-scene-sticky]")!;
    const plane = scene.querySelector<HTMLElement>("[data-scene-plane]")!;
    const copy = scene.querySelector<HTMLElement>("[data-scene-copy]")!;
    const heading = scene.querySelector<HTMLElement>(".scene-headline")!;
    const stageBox = stage.getBoundingClientRect();
    const planeBox = plane.getBoundingClientRect();
    const copyBox = copy.getBoundingClientRect();
    const headingStyle = getComputedStyle(heading);

    return {
      stageBox: { width: stageBox.width, height: stageBox.height },
      planeBox: { width: planeBox.width, height: planeBox.height },
      overlaps:
        copyBox.left < planeBox.right &&
        copyBox.right > planeBox.left &&
        copyBox.top < planeBox.bottom &&
        copyBox.bottom > planeBox.top,
      objectFit: getComputedStyle(
        scene.querySelector(".scene-video, .scene-poster")!,
      ).objectFit,
      headline: {
        transform: headingStyle.textTransform,
        weight: headingStyle.fontWeight,
        lineHeight: headingStyle.lineHeight,
      },
    };
  });

  expect(geometry.planeBox.width).toBeGreaterThanOrEqual(
    geometry.stageBox.width - 1,
  );
  expect(geometry.planeBox.height).toBeGreaterThanOrEqual(
    geometry.stageBox.height - 1,
  );
  expect(geometry.overlaps).toBe(true);
  expect(geometry.objectFit).toBe("cover");
  expect(geometry.headline.transform).toBe("uppercase");
  expect(Number(geometry.headline.weight)).toBeGreaterThanOrEqual(800);
});
```

- [ ] **Step 3: Add a failing differential-parallax assertion**

```ts
test("media and copy move on visibly different scroll planes", async ({ page }) => {
  await page.goto("/");
  const scene = page.locator('[data-slide="02-the-question"]');
  await scene.scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 320);
  await page.waitForTimeout(100);

  const transforms = await scene.evaluate((el) => ({
    media: getComputedStyle(
      el.querySelector<HTMLElement>("[data-scene-media]")!,
    ).transform,
    headline: getComputedStyle(
      el.querySelector<HTMLElement>("[data-anim-layer='headline']")!,
    ).transform,
  }));

  expect(transforms.media).not.toBe("none");
  expect(transforms.headline).not.toBe("none");
  expect(transforms.media).not.toBe(transforms.headline);
});
```

Add a shuffle contract assertion:

```ts
test("incoming scene covers the pinned outgoing scene without a gap", async ({ page }) => {
  await page.goto("/");
  const viewportHeight = page.viewportSize()!.height;
  const second = page.locator('[data-slide="02-the-question"]');
  await second.scrollIntoViewIfNeeded();

  const positions = await page.locator("[data-experience-scene]").evaluateAll(
    (scenes) => scenes.slice(0, 2).map((scene) => {
      const rect = scene
        .querySelector<HTMLElement>("[data-scene-sticky]")!
        .getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom, height: rect.height };
    }),
  );

  expect(positions[0].height).toBeGreaterThanOrEqual(viewportHeight - 1);
  expect(positions[1].height).toBeGreaterThanOrEqual(viewportHeight - 1);
  expect(positions[1].top).toBeLessThanOrEqual(viewportHeight);
});
```

- [ ] **Step 4: Run the focused tests and confirm RED**

Run:

```bash
cd apps/superpatch-income-stack
npm test -- --run src/components/experience/ExperienceShell.test.tsx
npm run test:e2e -- --grep "edge-to-edge branded overlay|visibly different scroll planes"
```

Expected: unit test fails because `data-scene-scrim` and layer names do not exist; E2E geometry fails because portrait media is currently capped at `26rem × 58vh`.

---

### Task 2: Build the Cinematic Lower Third and brand chrome

**Files:**
- Add: `apps/superpatch-income-stack/public/brand/superpatch-company-horizontal-white.svg`
- Modify: `apps/superpatch-income-stack/src/components/experience/ExperienceScene.tsx`
- Modify: `apps/superpatch-income-stack/src/components/experience/ExperienceChrome.tsx`
- Modify: `apps/superpatch-income-stack/src/components/experience/experience.css`
- Modify: `apps/superpatch-income-stack/src/styles/tokens.css`

**Interfaces:**
- Consumes: `Slide`, `SceneVideo`, and existing data attributes.
- Produces: `data-scene-scrim`, `data-anim-layer`, full-viewport stage geometry, and an approved logo asset.

- [ ] **Step 1: Add the approved white horizontal logo**

Copy the unmodified source from:

```text
/Users/cbsuperpatch/Desktop/SP Brand Guidelines/assets/visual-identity/figma/imgColourWhite.svg
```

to:

```text
apps/superpatch-income-stack/public/brand/superpatch-company-horizontal-white.svg
```

Retain its `213.617 × 64` viewBox and white fill. Do not add effects, gradients, nearby lockup text, or change symbol/logotype proportions.

- [ ] **Step 2: Place all scene layers under one stage**

In `ExperienceScene.tsx`, keep the existing media and annotations inside
`data-scene-plane`, then add the scrim as a sibling before copy:

```tsx
<div className="scene-sticky" data-scene-sticky>
  <div className="scene-plane" data-scene-plane>
    <SceneVideo {...sceneVideoProps} />
    {annotations}
  </div>
  <div className="scene-scrim" data-scene-scrim aria-hidden="true" />
  <div className="scene-copy" data-scene-copy>
    <p className="scene-eyebrow" data-anim data-anim-layer="eyebrow">
      {slide.eyebrow}
    </p>
    <HeadingTag
      className="scene-headline"
      data-anim
      data-anim-layer="headline"
    >
      {slide.headline}
    </HeadingTag>
    <p className="scene-body" data-anim data-anim-layer="body">
      {body}
    </p>
    {/* preserve existing stream index, spine, CTA, and disclosure branches */}
  </div>
</div>
```

Apply `data-anim-layer="cta"` and `data-anim-layer="disclosure"` to their
existing wrappers so every visible copy group has an explicit plane.

- [ ] **Step 3: Replace typed brand text with the approved mark**

In `ExperienceChrome.tsx`, render:

```tsx
<img
  className="experience-brand-mark"
  src="/brand/superpatch-company-horizontal-white.svg"
  width="134"
  height="40"
  alt="The Super Patch Company"
/>
```

Keep “Income Stack™” separate and outside the logo clear-space region.

- [ ] **Step 4: Replace grid/card CSS with viewport layers**

Implement these geometry rules in `experience.css`:

```css
.experience-scene .scene-sticky {
  position: sticky;
  top: 0;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: hidden;
  isolation: isolate;
  background: var(--sp-bg);
}

.scene-plane,
.scene-media-plane,
.scene-poster,
.scene-video,
.scene-scrim {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.scene-plane {
  z-index: 1;
  aspect-ratio: auto;
  overflow: hidden;
  transform-origin: 50% 50%;
}

.scene-poster,
.scene-video {
  display: block;
  object-fit: cover;
}

.scene-scrim {
  z-index: 2;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    transparent 26%,
    rgba(5, 7, 15, 0.16) 52%,
    rgba(5, 7, 15, 0.92) 100%
  );
}

.scene-copy {
  position: absolute;
  z-index: 4;
  left: max(var(--scene-rail), env(safe-area-inset-left));
  right: max(calc(var(--scene-rail) + 2.5rem), env(safe-area-inset-right));
  bottom: max(clamp(3.5rem, 8vh, 6.5rem), env(safe-area-inset-bottom));
  max-width: min(46rem, 72vw);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transform-style: preserve-3d;
}

.scene-headline {
  max-width: 12ch;
  font-size: clamp(2.5rem, 7vw, 6.75rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.016em;
  text-transform: uppercase;
  text-wrap: balance;
  text-shadow: 0 12px 42px rgba(0, 0, 0, 0.7);
}

.scene-body {
  max-width: 42ch;
  color: var(--sp-muted);
  font-size: clamp(1rem, 1.6vw, 1.3rem);
  font-weight: 500;
  line-height: 1.5;
  text-shadow: 0 5px 24px rgba(0, 0, 0, 0.9);
}
```

Delete the portrait rules that set `.scene-plane` to `max-height: 58vh` and
`width: min(100%, 26rem)`. On portrait viewports, keep full-stage media and
reduce headline/body size—not the video dimensions.

- [ ] **Step 5: Remove generic rainbow interface gradients**

Change `.experience-progress` to a neutral track with an SP Red active fill:

```css
.experience-progress {
  background: var(--sp-red);
  box-shadow: 0 0 16px rgba(221, 6, 4, 0.4);
}
```

Keep slide accents only for scene diagrams/annotations when the supplied media
does not already bake those labels.

- [ ] **Step 6: Run unit tests and confirm GREEN**

Run:

```bash
cd apps/superpatch-income-stack
npm test -- --run src/components/experience/ExperienceShell.test.tsx
```

Expected: all `ExperienceShell` tests pass.

---

### Task 3: Implement real layered parallax and verify the experience

**Files:**
- Modify: `apps/superpatch-income-stack/src/motion/experienceMotionConfig.ts`
- Modify: `apps/superpatch-income-stack/src/motion/useExperienceMotion.test.ts`
- Modify: `apps/superpatch-income-stack/src/motion/useExperienceMotion.ts`
- Modify: `apps/superpatch-income-stack/e2e/experience.spec.ts`
- Modify: `apps/superpatch-income-stack/docs/baselines/3d-experience/2026-08-07-post-experience.md`
- Modify: `docs/orgs/superpatch/customers/affiliates/initiatives/income-stack-deck/MEMORY/context.md`

**Interfaces:**
- Produces: `buildParallaxLayerVars(layer)` and differential media/scrim/copy transforms.
- Preserves: reduced-motion, scoped cleanup, ≤3 attached videos, and scene cover handoff.

- [ ] **Step 1: Add failing unit coverage for layer amplitudes**

In `useExperienceMotion.test.ts`:

```ts
import { buildParallaxLayerVars } from "./experienceMotionConfig";

it("assigns visibly different travel to each depth plane", () => {
  const media = buildParallaxLayerVars("media");
  const scrim = buildParallaxLayerVars("scrim");
  const eyebrow = buildParallaxLayerVars("eyebrow");
  const headline = buildParallaxLayerVars("headline");
  const body = buildParallaxLayerVars("body");

  expect(new Set([
    media.yPercent,
    scrim.yPercent,
    eyebrow.yPercent,
    headline.yPercent,
    body.yPercent,
  ]).size).toBe(5);
  expect(media.scale).toBeGreaterThan(1);
  expect(Math.abs(headline.yPercent)).toBeGreaterThan(Math.abs(body.yPercent));
});
```

Run:

```bash
npm test -- --run src/motion/useExperienceMotion.test.ts
```

Expected: FAIL because `buildParallaxLayerVars` is not exported.

- [ ] **Step 2: Add the pure parallax configuration**

In `experienceMotionConfig.ts`:

```ts
export type ParallaxLayer =
  | "media"
  | "scrim"
  | "eyebrow"
  | "headline"
  | "body"
  | "cta"
  | "disclosure";

const PARALLAX_LAYER_VARS = {
  media: { yPercent: -10, scale: 1.08 },
  scrim: { yPercent: -4, scale: 1 },
  eyebrow: { yPercent: -28, scale: 1 },
  headline: { yPercent: -22, scale: 1.015 },
  body: { yPercent: -14, scale: 1 },
  cta: { yPercent: -10, scale: 1 },
  disclosure: { yPercent: -7, scale: 1 },
} satisfies Record<ParallaxLayer, { yPercent: number; scale: number }>;

export function buildParallaxLayerVars(layer: ParallaxLayer) {
  return { ...PARALLAX_LAYER_VARS[layer] };
}
```

- [ ] **Step 3: Animate media, scrim, and copy independently**

In `useExperienceMotion.ts`, query:

```ts
const media = scene.querySelector<HTMLElement>("[data-scene-media]");
const scrim = scene.querySelector<HTMLElement>("[data-scene-scrim]");
const copyLayers = gsap.utils.toArray<HTMLElement>(
  scene.querySelectorAll("[data-anim-layer]"),
);
```

Add one scrubbed timeline section:

```ts
if (media) {
  tl.to(media, { ...buildParallaxLayerVars("media"), ease: "none", duration: 1 }, 0);
}
if (scrim) {
  tl.to(scrim, { ...buildParallaxLayerVars("scrim"), ease: "none", duration: 1 }, 0);
}
for (const layer of copyLayers) {
  const name = layer.dataset.animLayer as ParallaxLayer;
  tl.fromTo(
    layer,
    { opacity: 0, yPercent: 35 },
    {
      opacity: 1,
      ...buildParallaxLayerVars(name),
      duration: 0.58,
      ease: "power3.out",
    },
    name === "headline" ? 0.16 : 0.22,
  );
}
```

Do not animate width, height, top, left, or other layout properties. Keep
`useGSAP` scope cleanup and `matchMedia`.

- [ ] **Step 4: Verify focused E2E and refresh snapshots**

Run:

```bash
cd apps/superpatch-income-stack
npm run test:e2e -- --grep "edge-to-edge branded overlay|visibly different scroll planes"
npm run test:e2e:update -- --grep "captures representative visual baselines"
```

Expected: geometry and differential transforms pass; scene 01/07/15 snapshots
are intentionally updated to the approved full-viewport composition.

- [ ] **Step 5: Run full verification**

Run:

```bash
npm test
npm run lint
npm run build
npm run test:e2e
npm run verify:omni-assets
```

Expected: all commands exit 0; axe has no serious/critical violations; no more
than three videos are attached.

- [ ] **Step 6: Browser QA at desktop and mobile sizes**

Verify at `1440 × 900`, `390 × 844`, and `844 × 390`:

- video/poster covers the complete viewport;
- copy overlays media and stays above controls/safe areas;
- text remains legible over every supplied video;
- scrolling visibly separates video, scrim, headline, and body planes;
- no black flashes appear during scene covers;
- reduced motion removes parallax and keeps all copy/posters;
- logo proportions and clear space remain intact.

- [ ] **Step 7: Update existing documentation**

Record the approved Cinematic Lower Third, final verification commands, snapshot
paths, and any remaining media-specific contrast exceptions in:

```text
apps/superpatch-income-stack/docs/baselines/3d-experience/2026-08-07-post-experience.md
docs/orgs/superpatch/customers/affiliates/initiatives/income-stack-deck/MEMORY/context.md
```
