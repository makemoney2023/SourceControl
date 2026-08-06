# Income Stack Film Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Remotion motion presets real, fix baked/live label rules, harden compliance on the close, and add conversion narrative beats (index, recap, CTA, proof, objections) without inventing compensation claims.

**Architecture:** Extend `slides.ts` as SSOT with explicit media/label metadata and optional narrative fields. Introduce a Remotion `MotionDirector` registry keyed by `motionPreset` that ports plate transforms from `useDeckMotion.ts` and gates copy vs diagram animation. Wire `SlideScene` through that registry; keep HyperFrames untouched unless a task explicitly says otherwise.

**Tech Stack:** Remotion 4 (`@remotion/transitions`), Vitest, React 19, existing `Flywheel.tsx`, Montserrat via `@remotion/google-fonts`.

## Global Constraints

- Branch: `feature/income-stack-remotion` under `apps/superpatch-income-stack/`.
- Do not invent compensation numbers; edit money copy only from the approved outline / official disclosure language.
- Bodies that stay on screen for film should target 8–16 words; longer explanation moves to `voiceover` / `presenterNotes` fields (new).
- Do not modify HyperFrames generator unless a task says so.
- Before code exploration: `graphify query "IncomeStackFilm SlideScene motionPreset slides"`.
- After code edits: `graphify update apps/superpatch-income-stack`.
- TDD for pure helpers (motion registry, label policy, slide validation).
- Portrait-first (1080×1920) remains the product direction from the remotion design spec; this plan ships landscape Remotion first and adds aspect metadata hooks so portrait can follow without rewrite.
- Animated backgrounds: native **1920×1080** (and later **1080×1920**); reject 720p upscale for new assets.
- Commit only when the user asks.

---

## File Structure

| Path | Responsibility |
|------|----------------|
| `src/data/slides.ts` | SSOT: Slide type, media flags, narrative fields, validation |
| `src/data/slides.test.ts` | Validation + narrative/media contract tests |
| `src/remotion/motion/presets.ts` | MotionPreset registry (pure data + transforms) |
| `src/remotion/motion/presets.test.ts` | Registry coverage for all 15 presets |
| `src/remotion/motion/gating.ts` | Frame offsets for primary → secondary → hold |
| `src/remotion/motion/gating.test.ts` | Gate math tests |
| `src/remotion/labels.ts` | `shouldShowLiveAnnotations(slide)` policy |
| `src/remotion/labels.test.ts` | Baked/live annotation policy tests |
| `src/remotion/components/PlateMotion.tsx` | Applies plate transform from registry |
| `src/remotion/components/SlideScene.tsx` | Compose plate + labels + copy + flywheel |
| `src/remotion/components/CopyBlock.tsx` | Duration-aware copy timing; shorter on-screen bodies |
| `src/remotion/components/FlywheelRemotion.tsx` | Remotion-safe flywheel (or re-export web SVG) |
| `src/remotion/components/ProgressSpine.tsx` | 1–10 income progress indicator |
| `src/remotion/components/EndCard.tsx` | Close: CTA + disclosure |
| `docs/orgs/.../15-media/design/VIDEO-BRIEF.md` | Asset delivery rules (1080p / labels baked) |
| `docs/superpowers/specs/2026-08-06-income-stack-remotion-design.md` | Spec sync |

---

### Task 1: Explicit baked/live labels + media metadata

**Files:**
- Modify: `apps/superpatch-income-stack/src/data/slides.ts`
- Modify: `apps/superpatch-income-stack/src/data/slides.test.ts`
- Create: `apps/superpatch-income-stack/src/remotion/labels.ts`
- Create: `apps/superpatch-income-stack/src/remotion/labels.test.ts`
- Modify: `apps/superpatch-income-stack/src/remotion/layout.ts`
- Modify: `apps/superpatch-income-stack/src/remotion/layout.test.ts`
- Modify: `apps/superpatch-income-stack/src/remotion/components/SlideScene.tsx`
- Modify: `apps/superpatch-income-stack/src/components/Slide.tsx` (same label policy)

**Interfaces:**
- Produces: `HeroMediaMeta`, `shouldShowLiveAnnotations(slide: Slide): boolean`
- Consumes: existing `Slide.heroVideoSrc`, `Slide.annotations`

- [ ] **Step 1: Write failing tests for label policy**

```ts
// labels.test.ts
import { describe, expect, it } from "vitest";
import { SLIDES } from "../data/slides";
import { shouldShowLiveAnnotations } from "./labels";

describe("shouldShowLiveAnnotations", () => {
  it("hides live labels only when hero declares baked annotations", () => {
    const four = SLIDES.find((s) => s.id === "03-four-stacks")!;
    expect(four.hero?.annotationsBaked).toBe(true);
    expect(shouldShowLiveAnnotations(four)).toBe(false);
  });

  it("shows live labels when hero is present but annotations are not baked", () => {
    const title = SLIDES.find((s) => s.id === "01-title")!;
    expect(title.hero?.annotationsBaked).toBe(false);
    // title has no annotations — still false because empty
    expect(shouldShowLiveAnnotations(title)).toBe(false);
  });

  it("shows live labels on still plates with annotations", () => {
    const retail = SLIDES.find((s) => s.id === "07-retail")!;
    expect(shouldShowLiveAnnotations(retail)).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd apps/superpatch-income-stack && npm test -- src/remotion/labels.test.ts
```

Expected: FAIL (module/types missing).

- [ ] **Step 3: Extend Slide type and populate hero media**

In `slides.ts`, replace optional `heroVideoSrc?: string` with:

```ts
export type HeroMedia = {
  src: string;
  /** Native pixel size of the source file. New assets must be 1920×1080. */
  width: number;
  height: number;
  /** True when the loop already contains diagram labels that would duplicate live overlays. */
  annotationsBaked: boolean;
};

export type Slide = {
  // ...existing fields...
  /** @deprecated Prefer `hero`. Kept during migration if any scripts still read it. */
  heroVideoSrc?: string;
  hero?: HeroMedia;
  annotations?: PlateAnnotation[];
  // ...
};

export function heroSrc(slide: Slide): string | undefined {
  return slide.hero?.src ?? slide.heroVideoSrc;
}
```

Populate:

```ts
// 01-title
hero: {
  src: "/concepts/animated/sp-stack-01-title_animated.mp4",
  width: 1280,
  height: 720, // document current debt; Task 5 tracks re-export
  annotationsBaked: false,
},
heroVideoSrc: "/concepts/animated/sp-stack-01-title_animated.mp4", // temporary alias

// 03-four-stacks
hero: {
  src: "/concepts/animated/sp-stack-03-four-stacks_animated.mp4",
  width: 1280,
  height: 720,
  annotationsBaked: true, // verify in Studio; flip if loop is label-free
},
```

Update `clipDurationSec` to use `heroSrc(slide)`.

- [ ] **Step 4: Implement label policy**

```ts
// labels.ts
import type { Slide } from "../data/slides";
import { heroSrc } from "../data/slides";

export function shouldShowLiveAnnotations(slide: Slide): boolean {
  const annotations = slide.annotations ?? [];
  if (!annotations.length) return false;
  if (heroSrc(slide) && slide.hero?.annotationsBaked === true) return false;
  // Hero without baked labels: allow live overlays
  return true;
}
```

- [ ] **Step 5: Wire layout + SlideScene + web Slide**

`pickCopyAnchor`: stop using bare `slide.heroVideoSrc` to hide annotations. Use:

```ts
import { shouldShowLiveAnnotations } from "./labels";

export function pickCopyAnchor(slide: Slide) {
  const showAnnotations = shouldShowLiveAnnotations(slide);
  // occupancy logic only when showAnnotations; otherwise bl default
  ...
  return { anchor, showAnnotations };
}
```

`SlideScene` / `Slide.tsx`: use `heroSrc(slide)` and `shouldShowLiveAnnotations(slide)`.

- [ ] **Step 6: Update layout tests + slides tests; run green**

```bash
npm test -- src/remotion/labels.test.ts src/remotion/layout.test.ts src/data/slides.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit** (only if user asks)

```bash
git add apps/superpatch-income-stack/src/data/slides.ts \
  apps/superpatch-income-stack/src/data/slides.test.ts \
  apps/superpatch-income-stack/src/remotion/labels.ts \
  apps/superpatch-income-stack/src/remotion/labels.test.ts \
  apps/superpatch-income-stack/src/remotion/layout.ts \
  apps/superpatch-income-stack/src/remotion/layout.test.ts \
  apps/superpatch-income-stack/src/remotion/components/SlideScene.tsx \
  apps/superpatch-income-stack/src/components/Slide.tsx
git commit -m "$(cat <<'EOF'
feat(income-stack): make baked vs live plate labels explicit

EOF
)"
```

---

### Task 2: MotionDirector registry + gating (TDD)

**Files:**
- Create: `apps/superpatch-income-stack/src/remotion/motion/presets.ts`
- Create: `apps/superpatch-income-stack/src/remotion/motion/presets.test.ts`
- Create: `apps/superpatch-income-stack/src/remotion/motion/gating.ts`
- Create: `apps/superpatch-income-stack/src/remotion/motion/gating.test.ts`

**Interfaces:**
- Produces: `MotionPresetId`, `getMotionBeat(preset)`, `getMotionPhases(frame, durationInFrames, hasAnnotations)`
- Consumes: preset string names already on `SLIDES`

- [ ] **Step 1: Failing tests — every slide preset is registered**

```ts
// presets.test.ts
import { describe, expect, it } from "vitest";
import { SLIDES } from "../../data/slides";
import { MOTION_PRESETS, getMotionBeat } from "./presets";

describe("MOTION_PRESETS", () => {
  it("registers every motionPreset used by SLIDES", () => {
    for (const s of SLIDES) {
      expect(MOTION_PRESETS[s.motionPreset], s.motionPreset).toBeDefined();
      const beat = getMotionBeat(s.motionPreset);
      expect(["copy-first", "diagram-first", "copy-only"]).toContain(
        beat.secondaryPolicy,
      );
      expect(beat.plate.from.scale).toBeGreaterThan(0);
      expect(beat.ambientScale[1]).toBeLessThanOrEqual(1.06);
    }
  });
});
```

```ts
// gating.test.ts
import { describe, expect, it } from "vitest";
import { getMotionPhases } from "./gating";

describe("getMotionPhases", () => {
  it("delays copy until primary settles when diagram-first", () => {
    const p = getMotionPhases({
      frame: 0,
      durationInFrames: 150,
      primarySettleFrames: 24,
      secondaryPolicy: "diagram-first",
      hasAnnotations: true,
    });
    expect(p.annotationStart).toBe(30); // 24 + 6
    expect(p.eyebrowStart).toBeGreaterThan(p.annotationStart);
    expect(p.bodyStart).toBeGreaterThan(p.eyebrowStart);
  });

  it("keeps ambient scale capped", () => {
    const p = getMotionPhases({
      frame: 75,
      durationInFrames: 150,
      primarySettleFrames: 20,
      secondaryPolicy: "copy-first",
      hasAnnotations: false,
      ambientScale: [1, 1.03],
    });
    expect(p.ambientScale).toBeGreaterThanOrEqual(1);
    expect(p.ambientScale).toBeLessThanOrEqual(1.03);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test -- src/remotion/motion
```

- [ ] **Step 3: Implement registry from `useDeckMotion.ts` DNA**

```ts
// presets.ts
export type SecondaryPolicy = "copy-first" | "diagram-first" | "copy-only";

export type PlateFrom = {
  opacity: number;
  y: number;
  scale: number;
  rotateX: number;
  brightness: number;
};

export type MotionBeat = {
  id: string;
  secondaryPolicy: SecondaryPolicy;
  primarySettleFrames: number;
  plate: { from: PlateFrom; durationFrames: number };
  ambientScale: [number, number];
  ambientYPercent: number; // e.g. -3 for rise/leap, else 2.5
};

const baseFrom = (): PlateFrom => ({
  opacity: 0,
  y: 28,
  scale: 1.04,
  rotateX: 0,
  brightness: 1,
});

export const MOTION_PRESETS: Record<string, MotionBeat> = {
  "parallax-slabs": {
    id: "parallax-slabs",
    secondaryPolicy: "copy-first",
    primarySettleFrames: 60,
    plate: {
      from: { opacity: 0, y: 0, scale: 1, rotateX: 0, brightness: 1 },
      durationFrames: 12,
    },
    ambientScale: [1, 1.02],
    ambientYPercent: 2.5,
  },
  "ken-burns-glow": {
    id: "ken-burns-glow",
    secondaryPolicy: "copy-only",
    primarySettleFrames: 18,
    plate: { from: { ...baseFrom(), y: 28, scale: 1.04 }, durationFrames: 27 },
    ambientScale: [1, 1.03],
    ambientYPercent: 2.5,
  },
  "exploded-layers": {
    id: "exploded-layers",
    secondaryPolicy: "copy-first",
    primarySettleFrames: 27,
    plate: {
      from: { opacity: 0, y: 48, scale: 0.94, rotateX: 8, brightness: 1 },
      durationFrames: 27,
    },
    ambientScale: [1, 1.02],
    ambientYPercent: 2.5,
  },
  "coin-rise": {
    id: "coin-rise",
    secondaryPolicy: "diagram-first",
    primarySettleFrames: 24,
    plate: {
      from: { opacity: 0, y: 64, scale: 0.96, rotateX: 0, brightness: 1 },
      durationFrames: 27,
    },
    ambientScale: [1, 1.02],
    ambientYPercent: -3,
  },
  "platform-leap": {
    id: "platform-leap",
    secondaryPolicy: "diagram-first",
    primarySettleFrames: 24,
    plate: {
      from: { opacity: 0, y: 64, scale: 0.96, rotateX: 0, brightness: 1 },
      durationFrames: 27,
    },
    ambientScale: [1, 1.02],
    ambientYPercent: -3,
  },
  "summit-reveal": {
    id: "summit-reveal",
    secondaryPolicy: "copy-first",
    primarySettleFrames: 30,
    plate: {
      from: { opacity: 0, y: 64, scale: 0.96, rotateX: 0, brightness: 0.7 },
      durationFrames: 30,
    },
    ambientScale: [1, 1.02],
    ambientYPercent: 2.5,
  },
  "root-tiers": {
    id: "root-tiers",
    secondaryPolicy: "diagram-first",
    primarySettleFrames: 28,
    plate: {
      from: { opacity: 0, y: 0, scale: 1.06, rotateX: 0, brightness: 0.7 },
      durationFrames: 27,
    },
    ambientScale: [1, 1.02],
    ambientYPercent: 2.5,
  },
  "depth-rings": {
    id: "depth-rings",
    secondaryPolicy: "diagram-first",
    primarySettleFrames: 28,
    plate: {
      from: { opacity: 0, y: 0, scale: 1.06, rotateX: 0, brightness: 0.7 },
      durationFrames: 27,
    },
    ambientScale: [1, 1.02],
    ambientYPercent: 2.5,
  },
  "generation-rings": {
    id: "generation-rings",
    secondaryPolicy: "diagram-first",
    primarySettleFrames: 28,
    plate: {
      from: { opacity: 0, y: 0, scale: 1.06, rotateX: 0, brightness: 0.7 },
      durationFrames: 27,
    },
    ambientScale: [1, 1.02],
    ambientYPercent: 2.5,
  },
  "legs-descend": {
    id: "legs-descend",
    secondaryPolicy: "copy-first",
    primarySettleFrames: 28,
    plate: {
      from: { opacity: 0, y: 0, scale: 1.06, rotateX: 0, brightness: 0.7 },
      durationFrames: 27,
    },
    ambientScale: [1, 1.02],
    ambientYPercent: 2.5,
  },
  "flywheel-scrub": {
    id: "flywheel-scrub",
    secondaryPolicy: "diagram-first",
    primarySettleFrames: 24,
    plate: {
      from: { opacity: 0, y: 0, scale: 0.92, rotateX: 0, brightness: 1 },
      durationFrames: 27,
    },
    ambientScale: [1, 1.02],
    ambientYPercent: 2.5,
  },
  "pillars-sequence": {
    id: "pillars-sequence",
    secondaryPolicy: "diagram-first",
    primarySettleFrames: 24,
    plate: {
      from: { opacity: 0, y: 0, scale: 0.92, rotateX: 0, brightness: 1 },
      durationFrames: 27,
    },
    ambientScale: [1, 1.02],
    ambientYPercent: 2.5,
  },
  "node-mesh": {
    id: "node-mesh",
    secondaryPolicy: "copy-first",
    primarySettleFrames: 24,
    plate: {
      from: { opacity: 0, y: 0, scale: 0.92, rotateX: 0, brightness: 0.6 },
      durationFrames: 27,
    },
    ambientScale: [1, 1.02],
    ambientYPercent: 2.5,
  },
  "earth-arcs": {
    id: "earth-arcs",
    secondaryPolicy: "copy-first",
    primarySettleFrames: 24,
    plate: {
      from: { opacity: 0, y: 0, scale: 0.92, rotateX: 0, brightness: 1 },
      durationFrames: 27,
    },
    ambientScale: [1, 1.02],
    ambientYPercent: 2.5,
  },
  "horizon-settle": {
    id: "horizon-settle",
    secondaryPolicy: "copy-first",
    primarySettleFrames: 30,
    plate: {
      from: { opacity: 0, y: 28, scale: 1.05, rotateX: 0, brightness: 1 },
      durationFrames: 30,
    },
    ambientScale: [1, 1.02],
    ambientYPercent: 1.5,
  },
};

export function getMotionBeat(preset: string): MotionBeat {
  return MOTION_PRESETS[preset] ?? MOTION_PRESETS["ken-burns-glow"];
}
```

```ts
// gating.ts
import { interpolate } from "remotion";
import type { SecondaryPolicy } from "./presets";

export function getMotionPhases(args: {
  frame: number;
  durationInFrames: number;
  primarySettleFrames: number;
  secondaryPolicy: SecondaryPolicy;
  hasAnnotations: boolean;
  ambientScale?: [number, number];
}) {
  const {
    frame,
    durationInFrames,
    primarySettleFrames,
    secondaryPolicy,
    hasAnnotations,
    ambientScale = [1, 1.03],
  } = args;

  const annotationStart =
    secondaryPolicy === "diagram-first" && hasAnnotations
      ? primarySettleFrames + 6
      : primarySettleFrames + 18;
  const eyebrowStart =
    secondaryPolicy === "diagram-first" && hasAnnotations
      ? annotationStart + 12
      : primarySettleFrames + 8;
  const bodyStart = eyebrowStart + 14;
  const disclosureStart = bodyStart + 15;

  return {
    annotationStart,
    eyebrowStart,
    bodyStart,
    disclosureStart,
    ambientScale: interpolate(frame, [0, durationInFrames], ambientScale, {
      extrapolateRight: "clamp",
    }),
    freezeSecondary: frame >= durationInFrames - 18,
  };
}
```

Note: `gating.ts` imports `interpolate` from Remotion — keep pure math extractable if vitest complains; alternatively implement linear lerp without Remotion.

- [ ] **Step 4: Run tests green**

```bash
npm test -- src/remotion/motion
```

---

### Task 3: Wire PlateMotion + SlideScene dispatcher + Flywheel

**Files:**
- Create: `apps/superpatch-income-stack/src/remotion/components/PlateMotion.tsx`
- Create: `apps/superpatch-income-stack/src/remotion/components/FlywheelRemotion.tsx`
- Modify: `apps/superpatch-income-stack/src/remotion/components/DiagramLayers.tsx` (accept `startFrame`)
- Modify: `apps/superpatch-income-stack/src/remotion/components/CopyBlock.tsx` (accept phase starts)
- Modify: `apps/superpatch-income-stack/src/remotion/components/SlideScene.tsx`
- Modify: `apps/superpatch-income-stack/src/components/Flywheel.tsx` — fix Brand=green / Income=orange arc colors (brand audit)

**Interfaces:**
- Consumes: `getMotionBeat`, `getMotionPhases`, `shouldShowLiveAnnotations`, `heroSrc`
- Produces: Visual per-preset plate transforms in Studio

- [ ] **Step 1: Fix Flywheel colors (web + Remotion)**

```ts
// Flywheel.tsx ARCS — match plate art
{ id: "product", label: "Product", color: "var(--sp-blue)" },
{ id: "brand", label: "Brand", color: "var(--sp-green)" },
{ id: "income", label: "Income", color: "var(--sp-orange)" },
{ id: "development", label: "Development", color: "var(--sp-violet)" },
```

Add a small unit test or DeckShell assertion that the SVG stroke variables match this order.

- [ ] **Step 2: PlateMotion component**

```tsx
// PlateMotion.tsx — apply spring from beat.plate.from → identity over durationFrames
// Children = Img or OffthreadVideo
// When heroSrc present: no plate entrance spring; ambient only if beat allows
```

- [ ] **Step 3: SlideScene composition**

```tsx
const beat = getMotionBeat(slide.motionPreset);
const showAnnotations = shouldShowLiveAnnotations(slide);
const phases = getMotionPhases({
  frame,
  durationInFrames,
  primarySettleFrames: beat.primarySettleFrames,
  secondaryPolicy: beat.secondaryPolicy,
  hasAnnotations: showAnnotations,
  ambientScale: beat.ambientScale,
});

// Layer A: PlateMotion / OffthreadVideo / SlabDropLayers
// Layer B: AnnotationLayers startFrame={phases.annotationStart}
//          FlywheelRemotion when flywheelArc && preset !== human-only
// Layer C: CopyBlock phase starts from phases.*
```

Rules:
- Slide 04: hero Flywheel overlay + keep annotations if a free corner exists; otherwise drop annotations (current) but keep Flywheel.
- Slides with `flywheelArc` except 02 and 04: corner Flywheel.
- Hero video: treat as primary; delay copy by `max(phases.eyebrowStart, 12)`.

- [ ] **Step 4: Studio smoke check**

```bash
npm run remotion:compositions
# Open Studio — seek slides 04, 07, 09, 15
```

Expected: distinct plate entrances; 09 annotations before dense copy; flywheel visible on 04.

- [ ] **Step 5: Full test suite**

```bash
npm test
```

---

### Task 4: Closing disclosure + qualification context

**Files:**
- Modify: `apps/superpatch-income-stack/src/data/slides.ts` (slide 15 + slide 07 wording)
- Modify: `apps/superpatch-income-stack/src/data/slides.test.ts`
- Create: `apps/superpatch-income-stack/src/remotion/components/EndCard.tsx`
- Modify: `apps/superpatch-income-stack/src/remotion/components/SlideScene.tsx` or `IncomeStackFilm.tsx`

**Interfaces:**
- Produces: `requiresDisclosure: true` on closing; EndCard props `{ ctaPrimary, ctaSecondary, disclosure }`

- [ ] **Step 1: Failing validation tests**

```ts
it("requires disclosure on closing when income outcomes are mentioned", () => {
  const close = SLIDES.find((s) => s.id === "15-closing")!;
  expect(close.requiresDisclosure).toBe(true);
  expect(close.disclosure?.length).toBeGreaterThan(10);
});

it("avoids unqualified guaranteed-earnings language on retail", () => {
  const retail = SLIDES.find((s) => s.id === "07-retail")!;
  expect(retail.body.toLowerCase()).not.toMatch(/\bguaranteed\b/);
});
```

- [ ] **Step 2: Soften retail + close copy (approved-language only)**

Retail body direction (exact words subject to legal review — use this structure):

```ts
body: "This is where everyone begins. When someone buys through your personal affiliate link, you earn 25% commission on qualifying purchases — paid weekly. One product or several, if they buy through your link, you earn 25% of what they pay.",
```

Closing:

```ts
requiresDisclosure: true,
disclosure: INCOME_DISCLOSURE,
ctaPrimary: "Get your affiliate link",
ctaSecondary: "Read the Income Disclosure",
// Shorten on-screen body; remove "generational wealth" / "few hundred a month"
body: "Most affiliate programs pay one commission. Super Patch rewards every stage of building — from retail customers to leadership pools. Choose your starting pace, then take the next step with your sponsor.",
```

Extend `Slide` type:

```ts
ctaPrimary?: string;
ctaSecondary?: string;
voiceover?: string;
presenterNotes?: string;
onScreenBody?: string; // if set, Remotion/web film overlay prefers this over body
```

`assertSlidesValid`: if `onScreenBody` set, word-count that for film; keep `body` as speaker script (30–50) OR relax body rule when `onScreenBody` present.

- [ ] **Step 3: EndCard for Remotion close**

Render on slide 15 after copy settles: primary CTA line, secondary disclosure CTA, `INCOME_DISCLOSURE` at ≥16px.

- [ ] **Step 4: Web deck parity** — show disclosure + CTA on slide 15 in `Slide.tsx`.

- [ ] **Step 5: Tests green**

```bash
npm test
```

---

### Task 5: Native 1080p animated backgrounds (asset contract)

**Files:**
- Modify: `docs/orgs/superpatch/customers/affiliates/initiatives/income-stack-deck/business-idea/15-media/design/VIDEO-BRIEF.md`
- Modify: `apps/superpatch-income-stack/README.md`
- Modify: `apps/superpatch-income-stack/src/data/slides.test.ts` (warn/assert hero dimensions)
- Modify: `docs/superpowers/specs/2026-08-06-income-stack-remotion-design.md`

**Interfaces:**
- Produces: documented delivery checklist; optional `assertHeroMedia(slide)` helper

- [ ] **Step 1: Write failing media contract test**

```ts
it("flags hero media that is below 1920×1080 for new delivery", () => {
  for (const s of SLIDES) {
    if (!s.hero) continue;
    // Transitional: allow known 720p debt with explicit allowlist
    const legacyOk = new Set(["01-title", "03-four-stacks"]);
    if (legacyOk.has(s.id)) {
      expect(s.hero.height).toBeLessThan(1080); // current debt
      continue;
    }
    expect(s.hero.width).toBeGreaterThanOrEqual(1920);
    expect(s.hero.height).toBeGreaterThanOrEqual(1080);
  }
});
```

- [ ] **Step 2: Document operator re-export checklist in VIDEO-BRIEF**

```markdown
## Hero / I2V delivery (mandatory)
- Resolution: 1920×1080 (16:9) and 1080×1920 (9:16) when available
- Frame rate: 30 fps, dense keyframes for Remotion seek
- Labels: either baked (set annotationsBaked: true) OR text-free (false + live annotations)
- First frame must match still plate grade/framing for handoff
- No 720p upscale for new assets
```

- [ ] **Step 3: Operator action (manual)** — re-encode existing heroes to 1080p; update `hero.width/height` and remove from allowlist.

```bash
# Example (operator machine)
ffmpeg -i sp-stack-01-title_animated.mp4 -vf scale=1920:1080:flags=lanczos \
  -c:v libx264 -pix_fmt yuv420p -r 30 -g 15 \
  sp-stack-01-title_animated_1080.mp4
```

- [ ] **Step 4: Flip allowlist off once files land; tests require 1080p for all heroes.**

---

### Task 6: Ten-stream index, progress spine, recap, proof, objections

**Files:**
- Modify: `apps/superpatch-income-stack/src/data/slides.ts` (slides 05–06, new fields, optional 15b content)
- Create: `apps/superpatch-income-stack/src/data/streamIndex.ts`
- Create: `apps/superpatch-income-stack/src/data/streamIndex.test.ts`
- Create: `apps/superpatch-income-stack/src/remotion/components/ProgressSpine.tsx`
- Create: `apps/superpatch-income-stack/src/remotion/components/StreamIndexOverlay.tsx`
- Modify: `apps/superpatch-income-stack/src/remotion/components/SlideScene.tsx`
- Modify: `apps/superpatch-income-stack/src/components/Slide.tsx` (web index list)

**Interfaces:**
- Produces: `INCOME_STREAMS: { id, stackNumber, shortLabel, slideId }[]` length 10
- Consumes: slides 07–14 mapping

- [ ] **Step 1: Stream index SSOT + tests**

```ts
// streamIndex.ts
export const INCOME_STREAMS = [
  { stackNumber: 1, shortLabel: "Retail 25%", slideId: "07-retail" },
  { stackNumber: 2, shortLabel: "Fast Start & Ranks", slideId: "08-fast-start" },
  { stackNumber: 3, shortLabel: "Team Overrides", slideId: "09-team-overrides" },
  { stackNumber: 4, shortLabel: "MD Depth Bonus", slideId: "10-md-depth" },
  { stackNumber: 5, shortLabel: "VP Override", slideId: "11-vp-override" },
  { stackNumber: 6, shortLabel: "Generations", slideId: "12-generations" },
  { stackNumber: 7, shortLabel: "Executive Override", slideId: "13-executive" },
  { stackNumber: 8, shortLabel: "CEO Leadership Bonus", slideId: "13-executive" },
  { stackNumber: 9, shortLabel: "Global President Override", slideId: "14-global" },
  { stackNumber: 10, shortLabel: "Global Leadership Pool", slideId: "14-global" },
] as const;
```

Test: length 10; every `slideId` exists in `SLIDES`.

- [ ] **Step 2: Rewrite slide 06 as index bridge (dedupe vs 01)**

```ts
// 06-ten-layers
eyebrow: "Income Stack™ — Ten Streams",
headline: "Ten Ways. One Path Forward.",
onScreenBody: "Start with retail. Stack leadership as you grow.",
body: /* 30–50 word speaker script listing that ten named streams follow */,
voiceover: "Let's walk them one by one, starting where everyone starts.",
```

- [ ] **Step 3: ProgressSpine on income slides 07–14**

Show `stackNumber` of current slide (for 13/14 show range 7–8 / 9–10). Remotion: compact top-right or left rail dots 1–10; active fills accent.

- [ ] **Step 4: Recap beat before close**

Options (pick one in implementation — prefer A):
- **A:** Extend slide 14 last 1.5s with overlay “You’ve seen all ten stacks” + spine complete.
- **B:** Add `onScreenBody` recap line on slide 15 before CTA.

Do **not** add a 16th slide unless timing budget is expanded.

- [ ] **Step 5: Proof + objection (approved content only)**

Add optional fields on slides 05 and/or 06:

```ts
// Prefer slide 05 presenterNotes / onScreenBody — no new $ claims
onScreenBody: "Health outcomes, opportunity, and leadership in one company.",
presenterNotes:
  "Objection: Do I have to recruit? Answer: Everyone starts at Stack 1 retail. Leadership stacks unlock as you help others. Cost/kits: point to official materials. Always: Income Disclosure.",
```

If product-trust copy exists in approved brand materials, add a single non-numeric line to slide 03 `presenterNotes` only in v1 (no invented science claims).

- [ ] **Step 6: CTA sequence on EndCard (from Task 4)**

Primary: Get affiliate link / talk to sponsor (ops picks URL later — placeholder string ok).  
Secondary: Read Income Disclosure.  
Persistent fine print: `INCOME_DISCLOSURE`.

- [ ] **Step 7: Tests + Studio seek 06, 07, 14, 15**

```bash
npm test
npm run remotion:compositions
```

---

### Task 7: Docs sync + graphify

**Files:**
- Modify: `apps/superpatch-income-stack/README.md`
- Modify: `docs/superpowers/specs/2026-08-06-income-stack-remotion-design.md`
- Modify: `docs/orgs/.../15-media/design/VIDEO-BRIEF.md` (if not done in Task 5)
- Run: `graphify update apps/superpatch-income-stack`

- [ ] **Step 1: Document MotionDirector, hero media meta, narrative fields, CTA.**
- [ ] **Step 2: List Studio seek checklist for QA (frames for 03, 04, 07, 09, 15).**
- [ ] **Step 3: `graphify update apps/superpatch-income-stack`**
- [ ] **Step 4: `npm test && npm run build && npm run remotion:compositions`**

---

## Spec coverage checklist

| Requirement | Task |
|-------------|------|
| Preset dispatcher for inactive intents | Tasks 2–3 |
| Ten-stream index | Task 6 |
| Recap | Task 6 |
| CTA | Tasks 4, 6 |
| Proof + objection handling | Task 6 |
| Baked/live labels explicit | Task 1 |
| Native 1080p backgrounds | Task 5 |
| Closing disclosure + qualification | Task 4 |
| Mobile-first formats (prior plan constraint) | Spec already; portrait composition deferred after this plan unless pulled forward |

## Placeholder scan

No TBD steps. Exact paths, types, and test snippets included. Operator ffmpeg is a real command, not a stub.

## Type consistency

- `HeroMedia`, `heroSrc`, `shouldShowLiveAnnotations`, `MotionBeat`, `getMotionBeat`, `getMotionPhases`, `INCOME_STREAMS`, `onScreenBody`, `ctaPrimary` / `ctaSecondary` used consistently across tasks.

---

## Execution order (dependency)

```
Task 1 (labels) ─┬─► Task 2 (registry) ─► Task 3 (wire SlideScene)
                 ├─► Task 4 (disclosure/CTA copy)
                 ├─► Task 5 (1080p contract; can parallel with 2–4)
                 └─► Task 6 (index/spine) after 1 + 4
Task 7 docs last
```
