# Task 10 report — Real city legs via Gemini Omni

Status: DONE_WITH_CONCERNS

## Landed

- Added `scripts/omni-animate-city-legs.mjs` and the `city:omni` package script.
- Added the approved shared style preamble.
- Replaced all ten desktop and mobile city legs and all ten posters.
- Enforced Architecture A seams: each leg starts from the previous encoded desktop leg's final frame.
- Requested eight-second Omni clips, trimmed five-second legs, and slowed the skyline clip to its required ten-second moving peak.
- Scrub-encoded desktop at 1920×1080/GOP 8 and mobile at 720×1280/GOP 4, without audio.
- Added test-first runner contract coverage.
- Visually reviewed midpoint stills from every encoded desktop leg and rerolled the weak/portrait-filled tail.
- Did not flip the default route.

## Verification

- `npm run verify:city-assets`: all 10 legs verified.
- `npm test -- scripts/omni-animate-city-legs.test.ts`: 5 tests passed.

## Concerns

- The full Task 9 browser shoot and feel-check reshoot was deferred; the baseline records this explicitly.
- The generated city contains some distant indistinct pseudo-lettering on light panels, though accepted review frames are photographic and product-free.
- Not verified on a real iPhone.
- Taskmaster MCP discovery was unavailable during execution, so its document-source workflow could not run.
- Total Omni generation and quality rerolls cost approximately $13.60.

## Follow-up (mid-chain force seam fix)

- **Finding:** `--force` on a middle leg (e.g. leg-07) only regenerated that leg; later legs kept stale bridge frames and broke Architecture A seam chaining.
- **Fix:** `expandForcedLegIds()` — when `--force` targets specific leg id(s), the runner now also forces every successor leg through leg-10 so each start frame is re-extracted from its regenerated predecessor.
- **Tests:** `scripts/omni-animate-city-legs.test.ts` — new case asserts leg-07 force expands to legs 07–10 and does not pull in predecessors.
- **Verification:** `npm test -- scripts/omni-animate-city-legs.test.ts` (6 passed); `npm run verify:city-assets` (all 10 legs verified). No Omni re-generation required for this code-only fix.
