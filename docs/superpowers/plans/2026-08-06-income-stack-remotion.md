# Income Stack Remotion Implementation Plan

> **For agentic workers:** Required subtree: `apps/superpatch-income-stack/`. TDD for timeline math. Do not modify HyperFrames generator.

**Goal:** Remotion film composition reading `slides.ts`, with fade transitions, kinetic headlines, and layered diagram presets.

**Architecture:** Pure `timeline.ts` → `IncomeStackFilm` (`TransitionSeries`) → per-slide `SlideScene` (plate/video + kinetic type + diagram layers). Entry: `src/remotion/index.ts`. Studio via `npm run remotion`.

## Task 1: Timeline math (TDD)

**Files:** `src/remotion/timeline.ts`, `src/remotion/timeline.test.ts`

- `clipFrames(slide, fps)`, `filmDurationInFrames(slides, fps, transitionFrames)`
- Formula: `sum(clipFrames) - (n-1) * transitionFrames`

## Task 2: Remotion scaffold + deps

**Files:** `remotion.config.ts`, `src/remotion/{index,Root,theme}.ts(x)`, package.json scripts/deps

## Task 3: SlideScene + film

**Files:** `IncomeStackFilm.tsx`, `components/{SlideScene,KineticHeadline,DiagramLayers,CopyBlock}.tsx`

## Task 4: Docs + verify

- README Remotion section; `npm test`; `npx remotion compositions`
