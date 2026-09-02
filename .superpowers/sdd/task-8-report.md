# Task 8 report — Browser tests (Playwright + axe)

## Status

Complete. Added city worldflight browser coverage across all configured Playwright projects.

## Changes

- Added `e2e/city.spec.ts` for the Era opening, scroll track and progress, map-stop jump, pinned disclosure/stream index, and axe scans at open/peak/close.
- Made asynchronous engine and smooth-scroll assertions wait for observable browser state.
- Changed the city page root to `<main>` so axe recognizes the worldflight content as landmark-contained.
- Added Node types to the app TypeScript config because the existing `src/data/pptxExport.ts` Node imports otherwise blocked `build:e2e`.

## Verification

- `npm run test:e2e -- city.spec.ts` — 25 passed across desktop Chrome, mobile Chrome, iPhone 390, iPhone 375, and short landscape.
- `npm test -- src/city/CityFlightShell.test.tsx src/city/CityStopsRail.test.tsx` — 13 passed.
- `npm run lint` — exit 0; 11 pre-existing warnings remain in the vendored engine, an existing media test, and `CityStopsRail.tsx`.

## Concerns

- The production bundle remains large and Vite emits its existing chunk-size warning.
- The task-manager MCP server was unavailable during this task.

## Follow-up (keyboard map-stop test)

- Replaced `.click()` on the Skyline rail button with `focus()` + `Enter` so the test title matches behavior.
- Wrapped scroll-track `--sc-seg` assertion in `expect.poll` (same pattern as rail jump).
- `npx playwright test e2e/city.spec.ts --project=desktop-chrome` — 5 passed after `build:e2e`.
