# Income Stack Chip Sequence — Design Spec

**Date:** 2026-08-17
**Branch:** `feat/income-stack-gap-fill` (worktree `.worktrees/income-stack-gap-fill`)
**App:** `apps/superpatch-income-stack`
**Status:** Approved by user (Approach A, pure scroll-driven, no timer)

## Problem

Text chips ("BETTER HEALTH", "GREATER FREEDOM", metric callouts, etc.) are currently
absolutely positioned over the plate artwork via `Slide.annotations`. They compete with
the artwork, are hard to read at small sizes, and appear all at once. The user wants:

1. During each scene's dwell, the copy block (eyebrow + headline + body) slides off the
   **left** edge of the screen.
2. Chips then animate in **one at a time** as the user continues to scroll — each new
   chip pushes the previous one out. Pure scroll-scrubbed; scrolling back reverses it.
3. Consistent placement and styling for every chip on every scene.
4. Each chip gets a short supporting sub-line for context.

## Decisions (user-confirmed)

- **Copy behavior:** exit-left during a dedicated scroll segment (`exit-left`).
- **Chip stage:** chips appear in the lower-third seat vacated by the copy (`lower-third`).
- **Metric chips:** metric callouts (25%, $2,000, 15%…) join the same sequential
  chip flow (`all-sequence`).
- **Sub-copy:** every chip carries a one-line supporting phrase (`with-subcopy`).
- **Drive:** pure scroll scrub. No timers, no auto-advance (`pure-scroll`).

## Interaction model (per scene with chips)

Scene dwell progress is normalized 0→1 over the scene's scroll height minus one viewport:

| Segment | Range | What happens |
|---|---|---|
| Read hold | 0 → 0.12 | Copy sits still; user reads eyebrow/headline/body. |
| Copy exit | 0.12 → 0.22 | Whole `[data-scene-copy]` block translates off the left edge. |
| Chip slots | 0.22 → 1.0 | Split into N equal slots. Chip *i* enters during the first 30% of its slot; chip *i−1* exits during the same window (cross-fade). The last chip holds to 1.0, then the normal card-shuffle handoff to the next scene takes over. |

Scenes without chips (`00-super-stack`, `15-closing`) keep today's behavior exactly.

## Chip stage

- New `ChipStage` overlay in the same lower-third seat as `.scene-copy` (same
  left/bottom offsets, z-index 3). Items are grid-stacked in one cell.
- Each item: small counter ("02 / 04", fine text), large all-caps label in the slide
  accent color (display font), one-line white sub-copy.
- `aria-hidden="true"` — it is motion decoration. Accessibility comes from a static
  fallback list (below).

## Data model

- New exported type in `src/data/slides.ts`:
  `SequencedChip = { label: string; sub: string }`.
- New optional field `chips?: SequencedChip[]` on `Slide`.
- `annotations` stays untouched — the Remotion film keeps using it. The **web** stops
  rendering the plate-annotation overlay entirely (every annotated slide now has chips).
- Validation added to `assertSlidesValid`:
  - `chips.length <= 6`
  - label: `wordCount` 1–4 **and** ≤ 28 characters
  - sub: 12–90 characters
  - `copyLayout === "hero-caption"` ⇒ no chips
- 19 of 21 scenes get chips (63 total), including restored content the plate layout
  couldn't fit: the flywheel causal chain, "HEALTHCARE PROFESSIONALS", "COMMUNITY &
  SUPPORT", the full 6-step compounding chain, and the 6 differentiators.

## Compliance

Income scenes (`07-retail` … `14-global`, `19-future`) must keep the income disclosure
visible even after the copy block exits. For any slide with both `chips` and
`disclosure`, the disclosure renders **outside** `[data-scene-copy]` in a
`.scene-disclosure-pinned` element anchored to the bottom edge. It keeps
`data-anim-layer="disclosure"` so the existing handoff entrance still animates it.

## Scroll math

- New module `src/motion/chipSequence.ts` (pure functions, unit-tested):
  - `buildDwellSegments(chipCount)` → `{ copyExit, chips: [{enter, exit|null}] }`
    windows in normalized 0–1, or `null` for `chipCount <= 0`.
  - `sceneScrollHeightVhForChips({coarsePointer, chipCount})` →
    `sceneScrollHeightVh(...) + perChip × chipCount` where perChip is 45 (fine pointer)
    / 35 (coarse). Existing `sceneScrollHeightVh` is unchanged (back-compat).
- `useExperienceMotion` sets per-scene heights from the scene's own chip count and
  extends the existing dwell scrub timeline with the copy-exit and chip tweens.
  Existing dwell media/scrim tweens get explicit `duration: 1` so the timeline is
  normalized 0–1.

## Fallbacks / accessibility

- The motion hook sets `data-chips-animated="true"` on scenes where it builds chip
  tweens (removed on cleanup).
- Every chip slide also renders a static `<ul class="scene-chip-list">` inside the copy
  block (label + sub per item). When `data-chips-animated="true"` it is visually hidden
  (sr-only styles, still readable by screen readers). Under reduced motion / motion
  disabled the attribute is never set: the list renders as visible static content and
  the `ChipStage` overlay is hidden via CSS.
- `scrollToScene` resets chip items to hidden and the copy block to x:0 before/after
  jumps; the scrubbed dwell timeline re-applies the correct state via
  `ScrollTrigger.update()`.

## Testing

- Unit: `chipSequence.test.ts` (segment math, heights), `slides.test.ts` (chip
  validation + authored data invariants).
- Component: `ExperienceShell.test.tsx` / scene tests — chip stage renders, fallback
  list renders, plate-annotation overlay gone, pinned disclosure present on income
  scenes.
- E2E (Playwright, `e2e/experience.spec.ts`): scroll to computed dwell fractions on
  `01-title` and assert chips appear/disappear one at a time and copy exits left;
  assert disclosure stays visible at 90% dwell on `07-retail`.

## Out of scope

- Remotion film changes (film keeps plate annotations).
- Any change to scene count, chapter map, or hero media contracts.
