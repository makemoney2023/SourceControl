# Income Stack Chip Sequence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace plate-anchored annotation overlays with a scroll-scrubbed chip sequence: copy exits left, then chips (label + sub-copy) animate in one at a time in the lower-third seat, on every scene that has chips.

**Architecture:** A pure math module (`chipSequence.ts`) computes normalized dwell segment windows and per-scene scroll heights. Slide data gains a `chips` field (validated). A `ChipStage` overlay renders grid-stacked chip items that the existing per-scene dwell scrub timeline in `useExperienceMotion` fades in/out at the computed windows; the copy block gets an exit-left tween in the same timeline. A static fallback list handles reduced-motion and screen readers. Income disclosures move to a bottom-pinned slot so they survive the copy exit.

**Tech Stack:** React 19 + TypeScript, GSAP ScrollTrigger (scrub), Vitest + Testing Library, Playwright.

**Working directory for all commands:** `.worktrees/income-stack-gap-fill/apps/superpatch-income-stack` (branch `feat/income-stack-gap-fill`). Git commands run fine from there; paths in commit commands are repo-relative from that directory.

**Spec:** `docs/superpowers/specs/2026-08-17-income-stack-chip-sequence-design.md`

## Global Constraints

- `SLIDES.length === 21`; scene ids and order must not change.
- Pure scroll scrub — no timers, no auto-advance, fully reversible on scroll-up.
- Segment constants: read hold ends at `0.12`, copy exit ends at `0.22`, chip enter window = first 30% of its slot; chip *i* exits during chip *i+1*'s enter window; last chip has no exit.
- Scroll height: `sceneScrollHeightVh` (165 fine / 135 coarse) + per chip 45 (fine) / 35 (coarse). Existing `sceneScrollHeightVh` signature/behavior unchanged.
- Chip validation: `chips.length <= 6`; label `wordCount` 1–4 AND ≤ 28 chars; sub 12–90 chars; `copyLayout === "hero-caption"` ⇒ no chips.
- `Slide.annotations` data stays (Remotion film uses it); only the **web** overlay rendering is removed.
- Slides with `chips` + `disclosure` render the disclosure pinned to the bottom edge, outside `[data-scene-copy]`, keeping `data-anim-layer="disclosure"`.
- Scenes without chips (`00-super-stack`, `15-closing`) behave exactly as today.
- Run `npx vitest run` and lint before each commit. Run `graphify update .` after code changes at the end of each task (AST-only, no API cost).

---

### Task 1: Chip sequence math module

**Files:**
- Create: `src/motion/chipSequence.ts`
- Create: `src/motion/chipSequence.test.ts`

**Interfaces:**
- Consumes: `sceneScrollHeightVh` from `src/motion/experienceMotionConfig.ts` (existing: `({ coarsePointer: boolean }) => number`, returns 165 fine / 135 coarse).
- Produces (used by Task 5):
  - `type SegmentWindow = { start: number; end: number }`
  - `type ChipWindow = { enter: SegmentWindow; exit: SegmentWindow | null }`
  - `type DwellSegments = { copyExit: SegmentWindow; chips: ChipWindow[] }`
  - `READ_HOLD_END = 0.12`, `COPY_EXIT_END = 0.22` (exported consts)
  - `buildDwellSegments(chipCount: number): DwellSegments | null`
  - `sceneScrollHeightVhForChips(options: { coarsePointer: boolean; chipCount: number }): number`

- [ ] **Step 1: Write the failing test**

Create `src/motion/chipSequence.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  READ_HOLD_END,
  COPY_EXIT_END,
  buildDwellSegments,
  sceneScrollHeightVhForChips,
} from "./chipSequence";
import { sceneScrollHeightVh } from "./experienceMotionConfig";

describe("buildDwellSegments", () => {
  it("returns null when there are no chips", () => {
    expect(buildDwellSegments(0)).toBeNull();
    expect(buildDwellSegments(-2)).toBeNull();
  });

  it("holds copy readable, then exits it before the first chip", () => {
    const segments = buildDwellSegments(3)!;
    expect(segments.copyExit.start).toBe(READ_HOLD_END);
    expect(segments.copyExit.end).toBe(COPY_EXIT_END);
    expect(segments.chips[0].enter.start).toBe(COPY_EXIT_END);
  });

  it("divides the remaining dwell into equal slots with 30% enter windows", () => {
    const segments = buildDwellSegments(3)!;
    const slot = (1 - COPY_EXIT_END) / 3;
    expect(segments.chips[0].enter.end).toBeCloseTo(COPY_EXIT_END + slot * 0.3, 10);
    expect(segments.chips[1].enter.start).toBeCloseTo(COPY_EXIT_END + slot, 10);
    expect(segments.chips[2].enter.start).toBeCloseTo(COPY_EXIT_END + 2 * slot, 10);
  });

  it("cross-fades: chip i exits exactly during chip i+1's enter window", () => {
    const segments = buildDwellSegments(4)!;
    for (let i = 0; i < 3; i++) {
      expect(segments.chips[i].exit).toEqual(segments.chips[i + 1].enter);
    }
  });

  it("lets the last chip hold to the scene handoff (no exit)", () => {
    expect(buildDwellSegments(1)!.chips[0].exit).toBeNull();
    expect(buildDwellSegments(6)!.chips[5].exit).toBeNull();
  });

  it("keeps every window inside 0..1 and ordered", () => {
    for (const n of [1, 2, 3, 4, 5, 6]) {
      const segments = buildDwellSegments(n)!;
      for (const chip of segments.chips) {
        expect(chip.enter.start).toBeGreaterThanOrEqual(0);
        expect(chip.enter.end).toBeGreaterThan(chip.enter.start);
        expect(chip.enter.end).toBeLessThanOrEqual(1);
        if (chip.exit) {
          expect(chip.exit.start).toBeGreaterThanOrEqual(chip.enter.end);
          expect(chip.exit.end).toBeLessThanOrEqual(1);
        }
      }
    }
  });
});

describe("sceneScrollHeightVhForChips", () => {
  it("matches the base height when a scene has no chips", () => {
    expect(
      sceneScrollHeightVhForChips({ coarsePointer: false, chipCount: 0 }),
    ).toBe(sceneScrollHeightVh({ coarsePointer: false }));
    expect(
      sceneScrollHeightVhForChips({ coarsePointer: true, chipCount: 0 }),
    ).toBe(sceneScrollHeightVh({ coarsePointer: true }));
  });

  it("adds 45svh per chip on fine pointers and 35svh on coarse", () => {
    expect(
      sceneScrollHeightVhForChips({ coarsePointer: false, chipCount: 4 }),
    ).toBe(sceneScrollHeightVh({ coarsePointer: false }) + 180);
    expect(
      sceneScrollHeightVhForChips({ coarsePointer: true, chipCount: 4 }),
    ).toBe(sceneScrollHeightVh({ coarsePointer: true }) + 140);
  });

  it("never returns less than the base height", () => {
    expect(
      sceneScrollHeightVhForChips({ coarsePointer: false, chipCount: -3 }),
    ).toBe(sceneScrollHeightVh({ coarsePointer: false }));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/motion/chipSequence.test.ts`
Expected: FAIL — cannot resolve `./chipSequence`.

- [ ] **Step 3: Write the implementation**

Create `src/motion/chipSequence.ts`:

```ts
import { sceneScrollHeightVh } from "./experienceMotionConfig";

export type SegmentWindow = { start: number; end: number };
export type ChipWindow = { enter: SegmentWindow; exit: SegmentWindow | null };
export type DwellSegments = {
  copyExit: SegmentWindow;
  chips: ChipWindow[];
};

/** Copy sits still until here so the scene stays readable before anything moves. */
export const READ_HOLD_END = 0.12;
/** Copy has fully exited left by here; chip slots own the rest of the dwell. */
export const COPY_EXIT_END = 0.22;
/** A chip spends the first 30% of its slot entering, then holds. */
const CHIP_ENTER_FRACTION = 0.3;

/** Extra scroll distance per chip so each one gets a deliberate beat. */
const PER_CHIP_VH_FINE = 45;
const PER_CHIP_VH_COARSE = 35;

/**
 * Normalized (0..1) windows over a scene's dwell scrub.
 * Chip i exits exactly during chip i+1's enter window (cross-fade);
 * the last chip has no exit — it holds until the scene handoff.
 */
export function buildDwellSegments(chipCount: number): DwellSegments | null {
  if (chipCount <= 0) return null;
  const slot = (1 - COPY_EXIT_END) / chipCount;
  const enterFor = (i: number): SegmentWindow => {
    const start = COPY_EXIT_END + i * slot;
    return { start, end: start + slot * CHIP_ENTER_FRACTION };
  };
  const chips: ChipWindow[] = Array.from({ length: chipCount }, (_, i) => ({
    enter: enterFor(i),
    exit: i + 1 < chipCount ? enterFor(i + 1) : null,
  }));
  return {
    copyExit: { start: READ_HOLD_END, end: COPY_EXIT_END },
    chips,
  };
}

export function sceneScrollHeightVhForChips(options: {
  coarsePointer: boolean;
  chipCount: number;
}): number {
  const perChip = options.coarsePointer ? PER_CHIP_VH_COARSE : PER_CHIP_VH_FINE;
  return (
    sceneScrollHeightVh({ coarsePointer: options.coarsePointer }) +
    perChip * Math.max(0, options.chipCount)
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/motion/chipSequence.test.ts`
Expected: PASS (9 tests).

- [ ] **Step 5: Commit**

```bash
git add src/motion/chipSequence.ts src/motion/chipSequence.test.ts
git commit -m "feat: add chip sequence dwell segment math"
```

---

### Task 2: Slide data — `chips` field, validation, and authored chip copy

**Files:**
- Modify: `src/data/slides.ts` (type at ~line 142, validator `assertSlidesValid` at ~line 237, `SLIDES` entries from ~line 329)
- Modify: `src/data/slides.test.ts`

**Interfaces:**
- Produces (used by Tasks 3–5):
  - `export type SequencedChip = { label: string; sub: string }`
  - `Slide.chips?: SequencedChip[]`
  - Validation errors thrown from `assertSlidesValid` for invalid chips.

- [ ] **Step 1: Write the failing tests**

Add to `src/data/slides.test.ts` (import `SequencedChip` is not needed; use inline objects). Append inside the existing `describe("SLIDES", ...)` block:

```ts
  it("gives every lower-third scene a sequenced chip set (63 chips total)", () => {
    const withChips = SLIDES.filter((s) => (s.chips?.length ?? 0) > 0);
    expect(withChips.map((s) => s.id)).toEqual([
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
    ]);
    const total = withChips.reduce((n, s) => n + (s.chips?.length ?? 0), 0);
    expect(total).toBe(63);
    expect(SLIDES.find((s) => s.id === "00-super-stack")?.chips).toBeUndefined();
    expect(SLIDES.find((s) => s.id === "15-closing")?.chips).toBeUndefined();
  });

  it("keeps chip labels tight and sub-copy one readable line", () => {
    for (const s of SLIDES) {
      for (const chip of s.chips ?? []) {
        expect(chip.label.trim().length, `${s.id} label empty`).toBeGreaterThan(0);
        expect(wordCount(chip.label), `${s.id} "${chip.label}" too wordy`).toBeLessThanOrEqual(4);
        expect(chip.label.length, `${s.id} "${chip.label}" too long`).toBeLessThanOrEqual(28);
        expect(chip.sub.length, `${s.id} "${chip.label}" sub too short`).toBeGreaterThanOrEqual(12);
        expect(chip.sub.length, `${s.id} "${chip.label}" sub too long`).toBeLessThanOrEqual(90);
      }
      expect(s.chips?.length ?? 0).toBeLessThanOrEqual(6);
    }
  });
```

Then add a new top-level `describe` for the validator (reuse the `base` slide fixture pattern already used in this file for `assertSlidesValid` tests — find the existing valid-slide fixture with `rg -n "assertSlidesValid" src/data/slides.test.ts` and mirror it; the fixture below works standalone):

```ts
describe("assertSlidesValid chip rules", () => {
  const validSlide: Slide = {
    id: "x",
    conceptSrc: "/concepts/clean/x.png",
    accent: "blue",
    eyebrow: "EYEBROW",
    headline: "Headline",
    body: "word ".repeat(35).trim(),
    motionPreset: "hero-patch",
    requiresDisclosure: false,
  };
  const stack = (overrides: Partial<Slide>): Slide[] =>
    Array.from({ length: 21 }, (_, i) =>
      i === 1 ? { ...validSlide, ...overrides, id: `s${i}` } : { ...validSlide, id: `s${i}` },
    );

  it("rejects more than 6 chips", () => {
    const chips = Array.from({ length: 7 }, (_, i) => ({
      label: `CHIP ${i}`,
      sub: "A supporting line of copy.",
    }));
    expect(() => assertSlidesValid(stack({ chips }))).toThrow(/at most 6 chips/);
  });

  it("rejects labels over 4 words or 28 characters", () => {
    expect(() =>
      assertSlidesValid(
        stack({ chips: [{ label: "ONE TWO THREE FOUR FIVE", sub: "A supporting line." }] }),
      ),
    ).toThrow(/label/);
    expect(() =>
      assertSlidesValid(
        stack({ chips: [{ label: "A".repeat(29), sub: "A supporting line." }] }),
      ),
    ).toThrow(/label/);
  });

  it("rejects sub-copy outside 12-90 characters", () => {
    expect(() =>
      assertSlidesValid(stack({ chips: [{ label: "CHIP", sub: "too short" }] })),
    ).toThrow(/sub/);
    expect(() =>
      assertSlidesValid(stack({ chips: [{ label: "CHIP", sub: "x".repeat(91) }] })),
    ).toThrow(/sub/);
  });

  it("rejects chips on hero-caption scenes", () => {
    expect(() =>
      assertSlidesValid(
        stack({
          copyLayout: "hero-caption",
          eyebrow: "",
          body: "",
          chips: [{ label: "CHIP", sub: "A supporting line of copy." }],
        }),
      ),
    ).toThrow(/hero-caption/);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/data/slides.test.ts`
Expected: FAIL — `chips` does not exist on `Slide` (TS error) / chip-set test fails.

- [ ] **Step 3: Add the type and validator rules**

In `src/data/slides.ts`, directly above `export type Slide`:

```ts
/** One step of the scroll-driven chip sequence: big accent label + one-line context. */
export type SequencedChip = {
  label: string;
  sub: string;
};
```

Inside `Slide`, after the `annotations?: PlateAnnotation[];` line:

```ts
  /** Scroll-sequenced lower-third chips; replaces the web plate-annotation overlay. */
  chips?: SequencedChip[];
```

In `assertSlidesValid`, inside the `for (const s of slides)` loop, after the annotations loop:

```ts
    const chips = s.chips ?? [];
    if (chips.length > 0 && s.copyLayout === "hero-caption") {
      throw new Error(`Slide ${s.id} is hero-caption and cannot carry chips`);
    }
    if (chips.length > 6) {
      throw new Error(`Slide ${s.id} has ${chips.length} chips; at most 6 chips per scene`);
    }
    for (const chip of chips) {
      const words = wordCount(chip.label);
      if (!chip.label.trim() || words < 1 || words > 4 || chip.label.length > 28) {
        throw new Error(
          `Slide ${s.id} chip label "${chip.label}" must be 1-4 words and <= 28 chars`,
        );
      }
      if (chip.sub.length < 12 || chip.sub.length > 90) {
        throw new Error(
          `Slide ${s.id} chip "${chip.label}" sub must be 12-90 chars, got ${chip.sub.length}`,
        );
      }
    }
```

- [ ] **Step 4: Author the chip data**

Add a `chips` array to each of the 19 slides below (insert after that slide's `annotations` array, or after `body` if it has none). Copy verbatim:

`01-title`:

```ts
    chips: [
      { label: "BETTER HEALTH", sub: "World-class wellness solutions that deliver real results." },
      { label: "GREATER FREEDOM", sub: "Ten income streams you can build at your own pace." },
      { label: "BIGGER IMPACT", sub: "A global movement of leaders building together." },
    ],
```

`02-world`:

```ts
    chips: [
      { label: "TRADITIONAL JOBS", sub: "One paycheck, capped upside, and someone else's schedule." },
      { label: "GIG ECONOMY", sub: "Flexible work proved people want control of their time." },
      { label: "CREATOR ECONOMY", sub: "Millions now earn by sharing what they love." },
      { label: "SOCIAL COMMERCE", sub: "Buying moved to feeds, stories, and trusted voices." },
    ],
```

`03-four-stacks`:

```ts
    chips: [
      { label: "PRODUCT STACK", sub: "VTT patches and wellness solutions that deliver outcomes." },
      { label: "BRAND & MARKETING", sub: "Global visibility and credibility that create demand." },
      { label: "INCOME STACK", sub: "Ten streams that reward every stage of building." },
      { label: "PERSONAL DEVELOPMENT", sub: "Training and community that build leaders." },
    ],
```

`04-flywheel`:

```ts
    chips: [
      { label: "PRODUCTS CREATE CUSTOMERS", sub: "Real results turn buyers into raving fans." },
      { label: "MARKETING CREATES DEMAND", sub: "Visibility and credibility bring customers to you." },
      { label: "INCOME CREATES OPPORTUNITY", sub: "Ten streams turn activity into earnings." },
      { label: "DEVELOPMENT CREATES LEADERS", sub: "Better people build stronger communities." },
    ],
```

Note: "INCOME CREATES OPPORTUNITY" is 26 chars, "DEVELOPMENT CREATES LEADERS" is 27 — both inside the 28-char cap.

`05-product`:

```ts
    chips: [
      { label: "PROPRIETARY TECHNOLOGY", sub: "Vibrotactile trigger technology found nowhere else." },
      { label: "BACKED BY SCIENCE", sub: "Research-driven design behind every patch." },
      { label: "15+ SOLUTIONS", sub: "Targeted patches for sleep, energy, focus, and more." },
      { label: "TRUSTED BY MILLIONS", sub: "Customers worldwide feel the difference daily." },
    ],
```

`06-brand`:

```ts
    chips: [
      { label: "GLOBAL MEDIA & PR", sub: "Featured in Forbes and Medical Daily." },
      { label: "TOP CREATORS", sub: "Influencers like Mind Pump share Super Patch." },
      { label: "RETAIL & DIGITAL", sub: "Growing retail and e-commerce channels worldwide." },
      { label: "HEALTHCARE PROFESSIONALS", sub: "Recommended by practitioners on Healthgrades." },
      { label: "PRO SPORTS", sub: "Covered by SportsTech Today. Worn by elite athletes." },
    ],
```

`07-development` (restores the COMMUNITY & SUPPORT chip the plate layout dropped):

```ts
    chips: [
      { label: "LEADERSHIP DEVELOPMENT", sub: "Learn to lead teams that build teams." },
      { label: "SALES MASTERY", sub: "Share products with confidence and skill." },
      { label: "COMMUNICATION SKILLS", sub: "Connect, present, and persuade with clarity." },
      { label: "FINANCIAL EDUCATION", sub: "Understand, manage, and grow what you earn." },
      { label: "MINDSET & GROWTH", sub: "Build the habits of top performers." },
      { label: "COMMUNITY & SUPPORT", sub: "You never build alone at Super Patch." },
    ],
```

`08-ten-layers`:

```ts
    chips: [
      { label: "1-3 FOUNDATION", sub: "Retail commissions, Fast Start bonuses, and team overrides." },
      { label: "4-7 LEADERSHIP", sub: "Depth bonuses, leg overrides, and generation pay." },
      { label: "8-10 EXECUTIVE & GLOBAL", sub: "CEO bonuses, global overrides, and the leadership pool." },
    ],
```

`07-retail`:

```ts
    chips: [
      { label: "25% RETAIL COMMISSIONS", sub: "Earn 25% on every sale through your link, paid weekly." },
    ],
```

`08-fast-start`:

```ts
    chips: [
      { label: "$200-$2,000 FAST START", sub: "Enroll three qualifying affiliates in a month to unlock." },
      { label: "UP TO $100,000 RABS", sub: "Rank Advancement Bonuses grow with your sales milestones." },
    ],
```

`09-team-overrides`:

```ts
    chips: [
      { label: "15% ON LEVEL 1", sub: "Earn up to 15% of Bonus Volume on your first level." },
      { label: "10% ON LEVEL 2", sub: "Earn up to 10% as your team helps others build." },
      { label: "4% ON LEVELS 3-5", sub: "Depth pays: up to 4% on three more levels." },
    ],
```

`10-md-depth`:

```ts
    chips: [
      { label: "2% UNLIMITED DEPTH", sub: "Past level 5, down to the next qualified Managing Director." },
    ],
```

`11-vp-override`:

```ts
    chips: [
      { label: "2% ON EVERY LEG", sub: "Every leg of your organization, down to the next VP." },
    ],
```

`12-generations`:

```ts
    chips: [
      { label: "3% x 3 GENERATIONS", sub: "Leadership rewarding leadership, three VP generations deep." },
    ],
```

`13-executive`:

```ts
    chips: [
      { label: "2% EXECUTIVE OVERRIDE", sub: "Across your qualified organization with no preset cap." },
      { label: "$10K-$20K MONTHLY", sub: "CEO Leadership Bonus at President and Global President." },
    ],
```

`14-global`:

```ts
    chips: [
      { label: "1% GLOBAL OVERRIDE", sub: "On Bonus Volume across your qualified global organization." },
      { label: "GLOBAL 1% POOL", sub: "Qualified NVPs and above share in worldwide growth." },
    ],
```

`17-compounding` (restores the full six-step chain from the reference deck):

```ts
    chips: [
      { label: "ONE CUSTOMER", sub: "Every stack starts with a single result." },
      { label: "TEN CUSTOMERS", sub: "Real results spread by word of mouth." },
      { label: "100+ CUSTOMERS", sub: "Momentum compounds as your base grows." },
      { label: "TEAMS", sub: "Customers become affiliates and build with you." },
      { label: "LEADERS", sub: "Teams develop leaders who develop leaders." },
      { label: "MULTIPLE INCOME STREAMS", sub: "Every layer adds a new way to earn." },
    ],
```

`18-different`:

```ts
    chips: [
      { label: "TRUE FULL STACK", sub: "Product, brand, income, and development in one company." },
      { label: "PROVEN PRODUCTS", sub: "Wellness people can feel and reorder." },
      { label: "BRAND ENGINE", sub: "Massive marketing that creates demand for you." },
      { label: "TEN WAYS TO EARN", sub: "An Income Stack, not a single commission." },
      { label: "DEVELOPMENT BUILT IN", sub: "Personal growth is part of the plan." },
      { label: "GLOBAL VISION", sub: "Unlimited potential in a worldwide movement." },
    ],
```

`19-future`:

```ts
    chips: [
      { label: "SIDE INCOME", sub: "A few hundred a month changes the math." },
      { label: "INCOME REPLACEMENT", sub: "Stack streams until they cover your paycheck." },
      { label: "BUSINESS OWNERSHIP", sub: "Build an organization you are proud to own." },
      { label: "FINANCIAL FREEDOM", sub: "Your time becomes yours again." },
      { label: "GENERATIONAL WEALTH", sub: "Build something that outlasts you." },
    ],
```

Do NOT add chips to `00-super-stack` or `15-closing`.

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/data/slides.test.ts`
Expected: PASS. If a label/sub trips the validator, fix the data (not the rule) — counts above were pre-checked against the limits.

- [ ] **Step 6: Run the full unit suite**

Run: `npx vitest run`
Expected: PASS — `chips` is optional, so no other consumer breaks.

- [ ] **Step 7: Commit**

```bash
git add src/data/slides.ts src/data/slides.test.ts
git commit -m "feat: add sequenced chip data with validation to all lower-third scenes"
```

---

### Task 3: ChipStage overlay, static fallback list, remove web plate-annotation overlay

**Files:**
- Create: `src/components/experience/ChipStage.tsx`
- Create: `src/components/experience/ChipStage.test.tsx`
- Modify: `src/components/experience/ExperienceScene.tsx`
- Modify: `src/components/experience/experience.css`
- Modify: `src/components/experience/ExperienceShell.test.tsx` (annotation assertions at ~lines 65–90, 163, 224)

**Interfaces:**
- Consumes: `SequencedChip` from Task 2.
- Produces (used by Task 5): DOM contract —
  - `[data-chip-stage]` wrapper (aria-hidden), one per chip scene, inside `[data-scene-card]`.
  - `[data-chip-item][data-chip-index="i"]` per chip, grid-stacked.
  - `[data-chip-fallback]` static `<ul>` inside `[data-scene-copy]`.
  - CSS reacts to `data-chips-animated="true"` on the `<section data-experience-scene>` (attribute is set by the motion hook in Task 5).

- [ ] **Step 1: Write the failing component test**

Create `src/components/experience/ChipStage.test.tsx`:

```tsx
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChipStage } from "./ChipStage";

const CHIPS = [
  { label: "BETTER HEALTH", sub: "World-class wellness solutions that deliver real results." },
  { label: "GREATER FREEDOM", sub: "Ten income streams you can build at your own pace." },
];

describe("ChipStage", () => {
  it("renders one stacked item per chip with counter, label, and sub", () => {
    const { container } = render(<ChipStage chips={CHIPS} />);
    const stage = container.querySelector("[data-chip-stage]")!;
    expect(stage.getAttribute("aria-hidden")).toBe("true");
    const items = stage.querySelectorAll("[data-chip-item]");
    expect(items).toHaveLength(2);
    expect(items[0].getAttribute("data-chip-index")).toBe("0");
    expect(items[0].textContent).toContain("01 / 02");
    expect(items[0].textContent).toContain("BETTER HEALTH");
    expect(items[1].textContent).toContain(
      "Ten income streams you can build at your own pace.",
    );
  });
});
```

Also add to `ExperienceShell.test.tsx` (new `it` blocks inside the main describe):

```tsx
  it("renders the chip stage and static fallback list for chip scenes", () => {
    const { container } = renderShell(); // use this file's existing render helper
    const scene = container.querySelector('[data-slide="01-title"]')!;
    expect(scene.querySelectorAll("[data-chip-item]")).toHaveLength(3);
    const fallback = scene.querySelector("[data-chip-fallback]")!;
    expect(fallback.textContent).toContain("BETTER HEALTH");
    expect(
      container.querySelector('[data-slide="00-super-stack"] [data-chip-stage]'),
    ).toBeNull();
  });

  it("no longer renders the plate-annotation overlay on the web", () => {
    const { container } = renderShell();
    expect(container.querySelectorAll("[data-plate-annotation]")).toHaveLength(0);
  });
```

(`renderShell` = whatever render helper the existing tests in that file use; match it.)

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/experience/ChipStage.test.tsx src/components/experience/ExperienceShell.test.tsx`
Expected: FAIL — `ChipStage` module missing; shell still renders plate annotations.

- [ ] **Step 3: Implement ChipStage**

Create `src/components/experience/ChipStage.tsx`:

```tsx
import type { SequencedChip } from "../../data/slides";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Grid-stacked chip items for the scroll-driven sequence. Purely decorative:
 * the motion hook fades items in/out; screen readers get the static
 * [data-chip-fallback] list inside the copy block instead.
 */
export function ChipStage({ chips }: { chips: SequencedChip[] }) {
  return (
    <div className="chip-stage" data-chip-stage aria-hidden="true">
      {chips.map((chip, index) => (
        <div
          key={chip.label}
          className="chip-stage-item"
          data-chip-item
          data-chip-index={index}
        >
          <p className="chip-stage-count">
            {pad(index + 1)} / {pad(chips.length)}
          </p>
          <p className="chip-stage-label">{chip.label}</p>
          <p className="chip-stage-sub">{chip.sub}</p>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Wire into ExperienceScene and remove the annotation overlay**

In `src/components/experience/ExperienceScene.tsx`:

1. Import: `import { ChipStage } from "./ChipStage";`
2. **Delete** the `scene-annotations` overlay block — the JSX that maps `visibleAnnotations` to `<span className="plate-annotation" ...>` inside `<div className="scene-annotations" data-annotation-layer ...>` — plus any now-unused local variables/imports it leaves behind (e.g. `visibleAnnotations`, `annotationFontSizeCss`, `shouldShowLiveAnnotations` usages). Keep the `annotations` prop untouched in data-land; only rendering goes. Verify with `rg -n "plate-annotation|data-annotation-layer" src/components/experience/ExperienceScene.tsx` → no matches.
3. Render the chip stage inside the scene card, in the same place the annotations block used to sit (sibling of the copy block, gated like other motion layers):

```tsx
      {slide.chips?.length ? <ChipStage chips={slide.chips} /> : null}
```

4. Add the static fallback list inside the copy block (`[data-scene-copy]`), immediately after the body paragraph:

```tsx
        {slide.chips?.length ? (
          <ul className="scene-chip-list" data-chip-fallback>
            {slide.chips.map((chip) => (
              <li key={chip.label}>
                <strong>{chip.label}</strong> {chip.sub}
              </li>
            ))}
          </ul>
        ) : null}
```

- [ ] **Step 5: Add CSS**

Append to `src/components/experience/experience.css` (after the `.scene-disclosure` rules ~line 620):

```css
/* Scroll-sequenced chips occupy the lower-third seat the copy vacates.
   Items are grid-stacked; the motion hook drives opacity/x per scroll segment. */
.chip-stage {
  position: absolute;
  left: calc(clamp(24px, 7vw, 112px) + var(--safe-left));
  bottom: calc(clamp(52px, 8vh, 104px) + var(--safe-bottom));
  z-index: 3;
  width: min(680px, calc(100vw - clamp(76px, 17vw, 250px)));
  display: grid;
  pointer-events: none;
  text-shadow: 0 8px 28px rgba(0, 0, 0, 0.68);
}

/* Hidden until the motion hook owns the sequence; static mode uses the fallback list. */
[data-experience-scene]:not([data-chips-animated="true"]) .chip-stage {
  display: none;
}

.chip-stage-item {
  grid-area: 1 / 1;
  display: flex;
  flex-direction: column;
  gap: clamp(0.45rem, 0.9vw, 0.75rem);
  opacity: 0;
}

.chip-stage-count {
  margin: 0;
  color: var(--sp-fine);
  font-size: 0.78rem;
  letter-spacing: 0.14em;
  font-weight: 900;
}

.chip-stage-label {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.6vw, 4.4rem);
  line-height: 0.98;
  letter-spacing: -0.02em;
  font-weight: 900;
  text-transform: uppercase;
  color: var(--slide-accent-text, var(--slide-accent));
  text-wrap: balance;
}

.chip-stage-sub {
  margin: 0;
  max-width: 44ch;
  color: var(--sp-white);
  font-size: clamp(1.02rem, 1.3vw, 1.25rem);
  font-weight: 600;
  line-height: 1.45;
}

/* Static fallback: visible list under the body copy when motion is off/reduced. */
.scene-chip-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: var(--sp-muted);
  font-size: clamp(0.92rem, 1.05vw, 1.05rem);
  line-height: 1.4;
}

.scene-chip-list strong {
  color: var(--slide-accent-text, var(--slide-accent));
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-right: 0.4em;
}

/* When the animated sequence owns the chips, keep the list for screen readers only. */
[data-chips-animated="true"] .scene-chip-list {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}
```

Also delete the now-dead `.scene-annotations` / `.plate-annotation` rule blocks (~lines 509–533 and the `@media (max-width: 900px)` `.scene-annotations, ...` entries later in the file). Verify with `rg -n "scene-annotations|plate-annotation" src/components/experience/experience.css` → no matches.

- [ ] **Step 6: Update remaining ExperienceShell annotation assertions**

In `ExperienceShell.test.tsx`, the existing tests at ~lines 65–90 ("keeps distant annotations unmounted…"), ~line 163, and ~line 224 assert on `[data-plate-annotation]` / `[data-annotation-layer]`. Retarget them to the chip DOM:
- Distant-scene unmount test: assert `container.querySelectorAll('[data-scene-lifecycle="distant"] [data-chip-stage]')` — chip stages still render in DOM (CSS-hidden, not unmounted), so change the assertion to check the stage exists but the fallback list carries content, or simply delete the annotation-suppression test if its subject (live annotations) no longer exists. Prefer deleting assertions whose subject is gone over inventing replacements.
- Any `[data-annotation-layer]` count assertions: remove.
Run `rg -n "annotation" src/components/experience/ExperienceShell.test.tsx` afterward → no matches.

- [ ] **Step 7: Run tests to verify they pass**

Run: `npx vitest run src/components/experience`
Expected: PASS.

- [ ] **Step 8: Full suite + lint, then commit**

Run: `npx vitest run && npx eslint src --max-warnings 0` (match the repo's existing lint script if different — check `package.json` `scripts`).
Expected: PASS. Fix any unused-import fallout from the annotation removal.

```bash
git add src/components/experience/ChipStage.tsx src/components/experience/ChipStage.test.tsx src/components/experience/ExperienceScene.tsx src/components/experience/ExperienceShell.test.tsx src/components/experience/experience.css
git commit -m "feat: add chip stage overlay and retire web plate-annotation overlay"
```

---

### Task 4: Pinned income disclosure

**Files:**
- Modify: `src/components/experience/ExperienceScene.tsx`
- Modify: `src/components/experience/experience.css`
- Modify: `src/components/experience/ExperienceShell.test.tsx`

**Interfaces:**
- Consumes: `Slide.chips`, `Slide.disclosure` (Task 2).
- Produces (used by Task 6 e2e): `[data-disclosure-pinned]` element outside `[data-scene-copy]`, keeping `data-anim-layer="disclosure"` so the existing handoff entrance tween still finds it.

- [ ] **Step 1: Write the failing test**

Add to `ExperienceShell.test.tsx`:

```tsx
  it("pins the income disclosure outside the copy block on chip scenes", () => {
    const { container } = renderShell();
    const scene = container.querySelector('[data-slide="07-retail"]')!;
    const pinned = scene.querySelector("[data-disclosure-pinned]")!;
    expect(pinned.textContent).toContain("Income is not guaranteed");
    expect(pinned.closest("[data-scene-copy]")).toBeNull();
    expect(pinned.getAttribute("data-anim-layer")).toBe("disclosure");
    // Non-chip scenes keep the disclosure where it was.
    const closing = container.querySelector('[data-slide="15-closing"]')!;
    expect(closing.querySelector("[data-disclosure-pinned]")).toBeNull();
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/experience/ExperienceShell.test.tsx`
Expected: FAIL — no `[data-disclosure-pinned]`.

- [ ] **Step 3: Implement**

In `ExperienceScene.tsx`:

1. Near the top of the component: `const pinDisclosure = Boolean(slide.chips?.length && slide.disclosure);`
2. Find where the disclosure currently renders inside the copy block (`rg -n "disclosure" src/components/experience/ExperienceScene.tsx`) and gate it: render inside the copy block only when `!pinDisclosure` (keep its existing className/data attributes exactly).
3. After the copy block (sibling inside the scene card), add:

```tsx
      {pinDisclosure ? (
        <p
          className="scene-disclosure scene-disclosure-pinned"
          data-anim-layer="disclosure"
          data-disclosure-pinned
        >
          {slide.disclosure}
        </p>
      ) : null}
```

In `experience.css`, after the `.scene-disclosure` block:

```css
/* Compliance: on chip scenes the disclosure must outlive the copy exit,
   so it pins to the bottom edge outside [data-scene-copy]. */
.scene-disclosure-pinned {
  position: absolute;
  left: calc(clamp(24px, 7vw, 112px) + var(--safe-left));
  bottom: calc(clamp(14px, 2.2vh, 26px) + var(--safe-bottom));
  z-index: 4;
  max-width: min(680px, calc(100vw - clamp(76px, 17vw, 250px)));
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/experience/ExperienceShell.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/experience/ExperienceScene.tsx src/components/experience/experience.css src/components/experience/ExperienceShell.test.tsx
git commit -m "feat: pin income disclosure to bottom edge on chip scenes"
```

---

### Task 5: Motion wiring — heights, copy exit, chip scrub, jump reset

**Files:**
- Modify: `src/motion/useExperienceMotion.ts` (height at ~lines 110–132, dwell timeline at ~lines 302–338, `scrollToScene`/`resetLayers` at ~lines 473–536, matchMedia cleanup)

**Interfaces:**
- Consumes: `buildDwellSegments`, `sceneScrollHeightVhForChips` (Task 1); DOM contract `[data-chip-item]`, `[data-scene-copy]` and the `data-chips-animated` CSS hooks (Task 3).
- Produces: scenes with chips get taller scroll heights, `data-chips-animated="true"` while motion owns them, and scrubbed copy-exit + chip cross-fade tweens on the existing dwell timeline.

There is no jsdom test that can meaningfully exercise ScrollTrigger scrub; this task is verified by the full unit suite staying green, manual dev-server review, and Task 6's e2e tests. Keep the diff tight.

- [ ] **Step 1: Import the new module**

In `src/motion/useExperienceMotion.ts` add to the imports from sibling modules:

```ts
import {
  buildDwellSegments,
  sceneScrollHeightVhForChips,
} from "./chipSequence";
```

- [ ] **Step 2: Per-scene heights from chip count**

At ~line 110 the hook computes one shared height:

```ts
const scrollHeight = sceneScrollHeightVh({ coarsePointer: Boolean(coarsePointer) });
```

and applies it at ~line 132:

```ts
scene.style.height = index === 0 ? "100svh" : `${scrollHeight}svh`;
```

Replace the per-scene assignment (inside the existing `scenes.forEach((scene, index) => {...})`) with:

```ts
            const chipItems = scene.querySelectorAll<HTMLElement>("[data-chip-item]");
            scene.style.height =
              index === 0
                ? "100svh"
                : `${sceneScrollHeightVhForChips({
                    coarsePointer: Boolean(coarsePointer),
                    chipCount: chipItems.length,
                  })}svh`;
```

Delete the now-unused shared `scrollHeight` const if nothing else reads it (check with `rg -n "scrollHeight" src/motion/useExperienceMotion.ts`). Keep the `sceneScrollHeightVh` import only if still used elsewhere in the file.

- [ ] **Step 3: Extend the dwell timeline**

At ~lines 302–338 the dwell timeline is built inside `if (sceneDwellEnabled(index)) { ... }`. Change it to capture the timeline, normalize the existing tweens to duration 1, and append the chip choreography:

```ts
            if (sceneDwellEnabled(index)) {
              const dwell = gsap
                .timeline({
                  scrollTrigger: {
                    trigger: scene,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: coarsePointer ? 0.9 : 0.7,
                    invalidateOnRefresh: true,
                  },
                })
                .fromTo(
                  plane,
                  {
                    ...preset.dwell.mediaFrom,
                    filter: "brightness(1)",
                  },
                  {
                    yPercent: preset.dwell.mediaDrift.yPercent,
                    scale: preset.dwell.mediaDrift.scale,
                    filter: `brightness(${preset.dwell.mediaDrift.brightness})`,
                    ease: "none",
                    immediateRender: false,
                    duration: 1,
                  },
                  0,
                )
                .fromTo(
                  scrim,
                  { ...preset.dwell.scrimFrom, opacity: 1 },
                  {
                    ...preset.dwell.scrimDrift,
                    ease: "none",
                    immediateRender: false,
                    duration: 1,
                  },
                  0,
                );

              const chipEls = Array.from(
                scene.querySelectorAll<HTMLElement>("[data-chip-item]"),
              );
              const copyBlock = scene.querySelector<HTMLElement>("[data-scene-copy]");
              const segments = buildDwellSegments(chipEls.length);
              if (segments && copyBlock) {
                scene.dataset.chipsAnimated = "true";
                gsap.set(chipEls, { opacity: 0 });
                // Copy reads until READ_HOLD_END, then slides fully off the left edge.
                dwell.to(
                  copyBlock,
                  {
                    x: () => -(copyBlock.getBoundingClientRect().right + 64),
                    ease: "power1.in",
                    immediateRender: false,
                    duration: segments.copyExit.end - segments.copyExit.start,
                  },
                  segments.copyExit.start,
                );
                chipEls.forEach((item, chipIndex) => {
                  const win = segments.chips[chipIndex];
                  dwell.fromTo(
                    item,
                    { opacity: 0, x: 72 },
                    {
                      opacity: 1,
                      x: 0,
                      ease: "none",
                      immediateRender: false,
                      duration: win.enter.end - win.enter.start,
                    },
                    win.enter.start,
                  );
                  if (win.exit) {
                    dwell.to(
                      item,
                      {
                        opacity: 0,
                        x: -72,
                        ease: "none",
                        immediateRender: false,
                        duration: win.exit.end - win.exit.start,
                      },
                      win.exit.start,
                    );
                  }
                });
              }
            }
```

Notes for the implementer:
- `duration: 1` on the two pre-existing dwell tweens is required: GSAP timeline positions are in seconds-units and the chip tweens are placed at 0.12–1.0, so all tweens must share the 0–1 scale or media drift would finish halfway through the dwell.
- The `x` function-value plus `invalidateOnRefresh: true` recomputes the exit distance on resize.
- Function-value `x` needs the non-null `copyBlock` binding above — do not inline `scene.querySelector(...)` in the arrow.

- [ ] **Step 4: Clean up the attribute with the motion context**

Find the matchMedia/`useGSAP` cleanup (where ScrollTriggers/splits are killed — `rg -n "cleanup|revert|kill" src/motion/useExperienceMotion.ts`) and add, in the same place scene-level dataset flags are reset (or the context cleanup function):

```ts
            scenes.forEach((scene) => {
              delete scene.dataset.chipsAnimated;
            });
```

This guarantees reduced-motion or unmount falls back to the static `scene-chip-list` (CSS from Task 3).

- [ ] **Step 5: Reset chips and copy on jumps**

In `scrollToScene`'s `resetLayers` (~line 487), extend the per-scene loop after the existing `gsap.set(...[data-annotation-layer]...)` call (that selector now matches nothing — replace it):

Replace:

```ts
      gsap.set(
        scene.querySelectorAll(
          "[data-annotation-layer], [data-stream-index], [data-progress-spine]",
        ),
        {
          autoAlpha: index === targetIndex ? 1 : 0,
        },
      );
```

with:

```ts
      gsap.set(
        scene.querySelectorAll("[data-stream-index], [data-progress-spine]"),
        {
          autoAlpha: index === targetIndex ? 1 : 0,
        },
      );
      // Chip state is owned by the scrubbed dwell timeline; park everything
      // hidden and let ScrollTrigger.update() re-apply the correct progress.
      gsap.set(scene.querySelectorAll("[data-chip-item]"), { opacity: 0, x: 72 });
      const copyBlock = scene.querySelector<HTMLElement>("[data-scene-copy]");
      if (copyBlock) {
        gsap.set(copyBlock, { x: 0 });
      }
```

- [ ] **Step 6: Verify unit suite, typecheck, and manual review**

Run: `npx vitest run && npx tsc --noEmit`
Expected: PASS.

Start the dev server (`npm run dev`, background) and manually verify on `http://localhost:5173` (or the port Vite reports):
- Scene 2 (`01-title`): copy reads, exits left, three chips cycle one at a time, last chip holds into the card handoff. Scrolling up reverses everything.
- Scene `07-retail`: disclosure stays pinned bottom-left the whole dwell.
- Jump via progress rail/chapter nav: no stale chips on the destination scene.
- OS reduced-motion (System Settings → Accessibility → Display → Reduce motion): chips render as a static list under the body copy; no overlay.

- [ ] **Step 7: Commit**

```bash
git add src/motion/useExperienceMotion.ts
git commit -m "feat: scroll-scrub copy exit and sequential chip choreography per scene"
```

---

### Task 6: E2E coverage, docs mirror, graph refresh

**Files:**
- Modify: `e2e/experience.spec.ts` (annotation-based test at ~lines 406–420; add new tests)
- Modify: `docs/orgs/superpatch/customers/affiliates/initiatives/income-stack-deck/business-idea/assets/copy/SLIDES.md` (repo-root relative)

**Interfaces:**
- Consumes: DOM contract from Tasks 3–5 (`[data-chip-item]`, `[data-chip-index]`, `[data-disclosure-pinned]`, `[data-scene-copy]`), segment constants from Task 1 (title scene, 3 chips: chip 0 enter 0.22–0.298, chip 1 enter 0.48–0.558, chip 2 enter 0.74–0.818).

- [ ] **Step 1: Add a dwell-scroll helper and the failing e2e tests**

In `e2e/experience.spec.ts` add near the other helpers:

```ts
async function scrollToDwellFraction(
  page: import("@playwright/test").Page,
  sceneId: string,
  fraction: number,
) {
  const y = await page.evaluate(
    ({ sceneId, fraction }) => {
      const scene = document.getElementById(`scene-${sceneId}`);
      if (!scene) throw new Error(`missing scene ${sceneId}`);
      const dwell = scene.offsetHeight - window.innerHeight;
      return scene.offsetTop + Math.round(dwell * fraction);
    },
    { sceneId, fraction },
  );
  await page.evaluate((y) => window.scrollTo(0, y), y);
}

async function chipOpacity(
  page: import("@playwright/test").Page,
  sceneId: string,
  index: number,
) {
  return page
    .locator(`[data-slide="${sceneId}"] [data-chip-index="${index}"]`)
    .evaluate((el) => Number(getComputedStyle(el).opacity));
}
```

Add the tests (match this file's existing `test(...)` setup — same `page.goto`, ready-state waits, and reduced-motion handling as the neighbouring tests):

```ts
test("title scene chips sequence one at a time on scroll", async ({ page }) => {
  await page.goto("/");
  // Read hold: copy visible, no chips yet.
  await scrollToDwellFraction(page, "01-title", 0.05);
  await expect.poll(() => chipOpacity(page, "01-title", 0)).toBeLessThan(0.1);

  // Chip 0 holds alone mid-slot; copy has exited left.
  await scrollToDwellFraction(page, "01-title", 0.4);
  await expect.poll(() => chipOpacity(page, "01-title", 0), { timeout: 5000 }).toBeGreaterThan(0.9);
  await expect.poll(() => chipOpacity(page, "01-title", 1)).toBeLessThan(0.1);
  const copyX = await page
    .locator('[data-slide="01-title"] [data-scene-copy]')
    .evaluate((el) => el.getBoundingClientRect().right);
  expect(copyX).toBeLessThan(0);

  // Chip 1 replaces chip 0.
  await scrollToDwellFraction(page, "01-title", 0.65);
  await expect.poll(() => chipOpacity(page, "01-title", 1), { timeout: 5000 }).toBeGreaterThan(0.9);
  await expect.poll(() => chipOpacity(page, "01-title", 0)).toBeLessThan(0.1);

  // Last chip holds at the end of the dwell.
  await scrollToDwellFraction(page, "01-title", 0.95);
  await expect.poll(() => chipOpacity(page, "01-title", 2), { timeout: 5000 }).toBeGreaterThan(0.9);

  // Pure scroll: reversing restores chip 0.
  await scrollToDwellFraction(page, "01-title", 0.4);
  await expect.poll(() => chipOpacity(page, "01-title", 0), { timeout: 5000 }).toBeGreaterThan(0.9);
});

test("income disclosure stays pinned through the chip phase", async ({ page }) => {
  await page.goto("/");
  await scrollToDwellFraction(page, "07-retail", 0.9);
  const pinned = page.locator('[data-slide="07-retail"] [data-disclosure-pinned]');
  await expect(pinned).toBeVisible();
  await expect.poll(() =>
    pinned.evaluate((el) => Number(getComputedStyle(el).opacity)),
  ).toBeGreaterThan(0.9);
});
```

The `expect.poll` calls absorb the `scrub: 0.7` catch-up lag. If the mobile-chrome project proves flaky from momentum differences, scope these two tests to the desktop project the same way other desktop-only tests in this file are scoped (check for existing `test.skip(({ isMobile }) => ...)` or project-name guards and reuse that pattern).

- [ ] **Step 2: Fix the stale annotation e2e test**

At ~lines 406–420, "rapid jumps leave no intermediate annotations on destination scene" asserts on `[data-plate-annotation]`, which no longer exists. Retarget it to chips: replace the `[data-scene-lifecycle="distant"] [data-plate-annotation]` locator with `[data-scene-lifecycle="distant"] [data-chip-item]` and assert every matched element has computed opacity `< 0.1` (they exist in DOM but are parked hidden by `resetLayers`). Keep the rapid-jump choreography of the test unchanged.

- [ ] **Step 3: Run the e2e suite**

Run: `npx playwright test`
Expected: PASS, including the pre-existing `scene-00`/`scene-15` screenshot baselines (those scenes have no chips; their appearance is unchanged). If an unrelated screenshot diff appears, inspect before regenerating — only regenerate a baseline if the visual change is an intended consequence of this feature (e.g. a scene captured mid-dwell).

- [ ] **Step 4: Update the copy mirror doc**

In `docs/orgs/superpatch/customers/affiliates/initiatives/income-stack-deck/business-idea/assets/copy/SLIDES.md`, add a `Chips:` line to each of the 19 scene sections, mirroring Task 2 verbatim in the doc's existing field style, e.g. for scene 01:

```markdown
- Chips:
  1. BETTER HEALTH — World-class wellness solutions that deliver real results.
  2. GREATER FREEDOM — Ten income streams you can build at your own pace.
  3. BIGGER IMPACT — A global movement of leaders building together.
```

Also note under the doc's interaction/notes section: "Web: copy exits left at 12–22% of scene dwell; chips sequence one per slot thereafter (pure scroll scrub). Film: plate annotations unchanged."

- [ ] **Step 5: Full verification and graph refresh**

```bash
npx vitest run && npx tsc --noEmit && npx playwright test
graphify update .
```

Expected: all green.

- [ ] **Step 6: Commit**

```bash
git add e2e/experience.spec.ts ../../docs/orgs/superpatch/customers/affiliates/initiatives/income-stack-deck/business-idea/assets/copy/SLIDES.md
git commit -m "test: e2e chip sequence coverage; docs: mirror chip copy in SLIDES.md"
```

---

## Self-Review Checklist (run after writing code, before final handoff)

- Spec coverage: exit-left copy ✔ (Task 5), lower-third stage ✔ (Task 3), all-sequence metrics ✔ (Task 2 data), sub-copy ✔ (Task 2), pure scroll ✔ (Task 5, no timers), pinned disclosure ✔ (Task 4), reduced-motion/a11y fallback ✔ (Tasks 3+5), jump reset ✔ (Task 5), validation ✔ (Task 2), e2e ✔ (Task 6).
- `00-super-stack` (index 0, height 100svh, `sceneDwellEnabled` false) and `15-closing` (no chips ⇒ `buildDwellSegments` null) are untouched by construction.
- Type names consistent across tasks: `SequencedChip`, `DwellSegments`, `buildDwellSegments`, `sceneScrollHeightVhForChips`, `[data-chip-item]`, `[data-chip-index]`, `[data-chip-stage]`, `[data-chip-fallback]`, `[data-disclosure-pinned]`, `data-chips-animated`.
