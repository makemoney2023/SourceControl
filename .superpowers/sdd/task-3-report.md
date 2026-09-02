# Task 3 Report: Vendor engine, theme, and CityFlightShell

## Status

DONE_WITH_CONCERNS

Task 3 is implemented without wiring `App.tsx`. The Scroll Craft engine and stylesheet are byte-identical to their source. `CityStopsRail`, `StreamsIndex`, and `wireGlassFocus` remain deliberately minimal stubs for Tasks 4–6.

## Delivered

- Vendored `scrollcraft.js` and `scrollcraft.css` under `src/city/engine/`.
- Added the SuperPatch token mapping and city-only presentation rules in `src/city/city.css`.
- Added `CityFlightShell` with ten worldflight legs, mapped copy, approved glass plates, disclosure, guarded production CTAs, and the full-experience link.
- Added the three requested follow-on task stubs.
- Added nine shell behavior tests.
- Refreshed the local Graphify index after code changes; generated graph artifacts are ignored and were not staged.

## TDD evidence

1. RED: `npx vitest run src/city/CityFlightShell.test.tsx` failed because `./CityFlightShell` did not exist.
2. GREEN attempt: 8 of 9 tests passed. The no-URL test inherited the HTTPS defaults declared by `vite.config.ts`.
3. Adaptation: the no-URL test now uses `vi.stubEnv` to explicitly blank both URL variables. `vi.stubEnv` itself works in this project; no alternate Vite stubbing mechanism was needed.
4. GREEN: targeted suite passed, 1 file and 9 tests.

## Verification

- Engine identity: PASS for both vendored files using byte comparisons.
- Targeted test: PASS — 9/9.
- IDE lint diagnostics for `src/city/`: PASS — no errors.
- `npm run lint`: PASS with warnings. One warning predates this task; nine warnings are inside the required byte-identical vendored engine and were not edited.
- `npm test`: FAIL — 15 unrelated failures in `DeckShell.test.tsx`, `chipImagery.test.ts`, and `experienceMedia.test.ts`. They concern stale 25-slide assumptions, imagery text, and asset checksum mismatches.
- `npm run build`: FAIL before bundling because existing `src/data/pptxExport.ts` imports Node built-ins while the TypeScript configuration lacks Node types.
- `git diff --check`: PASS.
- Scope check: PASS — `App.tsx` does not reference `CityFlightShell`.

## Self-review

- Confirmed all visible copy and image paths come from the existing city/slides source of truth.
- Confirmed CTA rendering requires a complete validated HTTPS pair through the existing helper.
- Confirmed data-save mode omits video while retaining posters.
- Confirmed no real rail, streams, or glass-focus behavior leaked into this task.
- Confirmed unrelated untracked assets are not included.

## Concerns

- The Taskmaster MCP server failed live tool discovery, so its requested documentation-source workflow could not run. The checked-in task brief was used as the authority.
- The repository-wide test and build failures are outside Task 3 and were intentionally not changed.
