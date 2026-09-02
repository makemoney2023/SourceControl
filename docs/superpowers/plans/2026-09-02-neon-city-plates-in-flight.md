# Neon City Plates-in-Flight Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the neon-city worldflight so all 26 approved plates (plus logo open, sparse packages, and VTT) live **in the Omni film**, remove DOM glass overlays, and sequence live copy for every slide without crowding.

**Architecture:** Data-first: `cityFlight.ts` gains `CITY_PLATE_MOMENTS` (26), `CITY_PACKAGE_ACCENTS` (4–6), expanded `CITY_LEGS` (16–22vh track), and per-slide copy windows. `CityFlightShell` drops glass/focus and renders one copy block per slide. Omni style + prompts re-chain from leg 1. Scroll Craft verify + city e2e prove coverage and mobile non-overlap.

**Tech Stack:** Vite + React 19, TypeScript, vitest, Playwright + axe, vendored Scroll Craft, ffmpeg encodes, Gemini Omni via existing `scripts/omni-animate-city-legs.mjs` / OpenMontage.

**Spec:** `docs/superpowers/specs/2026-09-02-neon-city-plates-in-flight-design.md` (amends the original worldflight design). Read both before starting.

## Global Constraints

- Copy/claims **verbatim** from `SLIDES` / `INCOME_STREAMS` / `INCOME_DISCLOSURE` only.
- Never edit vendored `scrollcraft.js` / `scrollcraft.css`.
- Never AI-redraw plate PNGs; Omni **grounds** on `conceptSrc` paths.
- Pace law: `CITY_RATE = 0.215`; one ~10s peak leg; track total **16–22vh**.
- Seam law: encoded last frame → next start; `--force` on leg N regenerates N…end.
- No scene counter / scroll cue / 26-item jumper.
- Join CTAs only when both production HTTPS env URLs are set.
- Phase 1 stays on `?view=city`. Do not flip default `/` (original Task 11) without operator gate.
- Workdir: `/Users/cbsuperpatch/Desktop/ClaudeSkills/.worktrees/affiliate-income-stack-main` on `feat/neon-city-worldflight`.
- macOS only. `npm test`, lint, build clean before commits that touch `src/`.

## File Structure

| Path | Responsibility |
|------|----------------|
| `src/data/cityFlight.ts` | Legs, plate moments, package accents, copy windows, stops, streams |
| `src/data/cityFlight.test.ts` | 26 coverage, pace, track band, window sequencing, no glass export |
| `src/city/CityFlightShell.tsx` | Worldflight markup; all copy; no glass |
| `src/city/CityFlightShell.test.tsx` | 26 copy nodes; no `[data-glass]`; VTT science present |
| `src/city/city.css` | Remove glass blur styles; keep rail/streams/type |
| `src/city/glassFocus.ts` (+ test) | **Delete** once unused |
| `scripts/omni-animate-city-legs.mjs` | Expanded legs, style preamble, plate/logo/package refs + moves |
| `scripts/omni-animate-city-legs.test.ts` | Style allows logo/packages; every plate moment has a leg |
| `scripts/verify-city-assets.ts` | Duration/presence for expanded legs |
| `e2e/city.spec.ts` | Mobile non-overlap; science headline; no glass |
| `docs/baselines/city/` | New Omni baseline + plate checklist |

---

### Task 1: Data — plate moments, packages, expanded legs, copy windows

**Files:**
- Modify: `src/data/cityFlight.ts`
- Modify: `src/data/cityFlight.test.ts`

**Interfaces:**
- Produces: `CITY_PLATE_MOMENTS`, `CITY_PACKAGE_ACCENTS`, expanded `CITY_LEGS`, `COPY_WINDOWS: Record<string, string>` (or `copyWindowFor(slideId)`), remove `CITY_GLASS` export.
- Consumes: `SLIDES`, existing window helpers.

- [ ] **Step 1: Write failing tests**

```ts
// additions to src/data/cityFlight.test.ts
import { CITY_PLATE_MOMENTS, CITY_PACKAGE_ACCENTS, COPY_WINDOWS } from "./cityFlight";

it("covers every slide exactly once as a plate moment", () => {
  const ids = CITY_PLATE_MOMENTS.map((m) => m.slideId);
  expect(ids).toHaveLength(SLIDES.length);
  expect(new Set(ids).size).toBe(SLIDES.length);
  for (const s of SLIDES) {
    expect(ids).toContain(s.id);
  }
});

it("ties every plate moment to a real leg id", () => {
  const legIds = new Set(CITY_LEGS.map((l) => l.id));
  for (const m of CITY_PLATE_MOMENTS) {
    expect(legIds.has(m.legId), m.slideId).toBe(true);
  }
});

it("has 4–6 package accents on real legs", () => {
  expect(CITY_PACKAGE_ACCENTS.length).toBeGreaterThanOrEqual(4);
  expect(CITY_PACKAGE_ACCENTS.length).toBeLessThanOrEqual(6);
});

it("keeps track length in the 16–22vh band", () => {
  expect(trackTotalVh()).toBeGreaterThanOrEqual(16);
  expect(trackTotalVh()).toBeLessThanOrEqual(22);
});

it("exports a copy window for every slide", () => {
  for (const s of SLIDES) {
    expect(COPY_WINDOWS[s.id]?.split(" ").length).toBe(4);
  }
});

it("does not export CITY_GLASS", async () => {
  const mod = await import("./cityFlight");
  expect("CITY_GLASS" in mod).toBe(false);
});
```

- [ ] **Step 2: Run tests — expect FAIL**

Run: `npm test -- --run src/data/cityFlight.test.ts`  
Expected: FAIL on missing exports / track band.

- [ ] **Step 3: Implement data**

Expand `CITY_LEGS` with additional 5s legs (keep one 10s peak). Define:

```ts
export type CityPlateMoment = { slideId: string; legId: string; note: string };
export type CityPackageAccent = { id: string; legId: string; src: string; note: string };

export const CITY_PLATE_MOMENTS: CityPlateMoment[] = [
  // one entry per SLIDES id — assign legId + Omni note
];

export const CITY_PACKAGE_ACCENTS: CityPackageAccent[] = [
  // 4–6 entries; src under public/concepts/refs/packages/ or patches/
];

export const COPY_WINDOWS: Record<string, string> = {
  // build with windowAcross / windowForLegSlice; sequence so adjacent
  // plateaus barely overlap (< ~0.03 track fraction dual-hold)
};
```

Remove `CITY_GLASS`. Keep `STREAMS_WINDOW` / Range helpers aligned with new leg indices. Ensure `05-product` window immediately precedes `05b-science`.

- [ ] **Step 4: Run tests — expect PASS**

Run: `npm test -- --run src/data/cityFlight.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/data/cityFlight.ts src/data/cityFlight.test.ts
git commit -m "$(cat <<'EOF'
feat(city): map all 26 plates and sequenced copy windows

Expand the flight track and drop glass SSOT so Omni can own plates in-world.
EOF
)"
```

---

### Task 2: Shell — remove glass, render all copy

**Files:**
- Modify: `src/city/CityFlightShell.tsx`
- Modify: `src/city/CityFlightShell.test.tsx`
- Modify: `src/city/city.css`
- Delete: `src/city/glassFocus.ts`, `src/city/glassFocus.test.ts` (if unused)

**Interfaces:**
- Consumes: `COPY_WINDOWS`, `CITY_LEGS`, `slideById`, streams helpers — **not** `CITY_GLASS` / `wireGlassFocus`.

- [ ] **Step 1: Failing tests**

```ts
it("renders a copy block for every slide id", () => {
  const { container } = render(<CityFlightShell />);
  for (const s of SLIDES) {
    expect(container.querySelector(`[data-city-copy="${s.id}"]`)?.textContent)
      .toContain(slideById(s.id).headline);
  }
});

it("does not render glass figures", () => {
  const { container } = render(<CityFlightShell />);
  expect(container.querySelectorAll("[data-glass]")).toHaveLength(0);
  expect(container.querySelectorAll(".city-glass")).toHaveLength(0);
});

it("includes VTT science headline on the flight", () => {
  const { container } = render(<CityFlightShell />);
  expect(container.querySelector('[data-city-copy="05b-science"]')?.textContent)
    .toContain(slideById("05b-science").headline);
});
```

- [ ] **Step 2: Run — expect FAIL** (missing science / still has glass)

- [ ] **Step 3: Implement**

- Map `SLIDES` (or `Object.keys(COPY_WINDOWS)`) to `<Copy />` with `window={COPY_WINDOWS[id]}` and varied anchors (`lead` / `trail` / `center`) without stacking same-anchor neighbors.
- Remove glass map, `wireGlassFocus` import/effect, contrast/glass CSS for blur.
- Keep streams index block + disclosure + experience link; windows from data module.

- [ ] **Step 4: Run unit tests PASS; delete dead glassFocus files; `npm run build`**

- [ ] **Step 5: Commit**

```bash
git add src/city/CityFlightShell.tsx src/city/CityFlightShell.test.tsx src/city/city.css
git add -u src/city/glassFocus.ts src/city/glassFocus.test.ts
git commit -m "$(cat <<'EOF'
feat(city): drop glass overlays and show every slide headline

Plates move into the film; DOM only carries sequenced copy and streams chrome.
EOF
)"
```

---

### Task 3: Omni script — style, legs, refs for logo / plates / packages

**Files:**
- Modify: `scripts/omni-animate-city-legs.mjs`
- Modify: `scripts/omni-animate-city-legs.test.ts`

**Interfaces:**
- `STYLE_PREAMBLE` allows logo + sparse packages + plate art; forbids foreign brands/people.
- `CITY_OMNI_LEGS` matches `CITY_LEGS` ids/order/clipSeconds.
- Each plate moment supplies reference path = `slideById(slideId).conceptSrc` (resolve under `public/`).

- [ ] **Step 1: Failing tests**

```ts
it("style preamble allows SuperPatch logo and packages", () => {
  expect(STYLE_PREAMBLE.toLowerCase()).not.toMatch(/no logos/);
  expect(STYLE_PREAMBLE.toLowerCase()).toMatch(/superpatch|logo/);
  expect(STYLE_PREAMBLE.toLowerCase()).toMatch(/package|product/);
});

it("omni legs align with CITY_LEGS ids", async () => {
  const { CITY_LEGS } = await import("../src/data/cityFlight.ts");
  expect(CITY_OMNI_LEGS.map((l) => l.id)).toEqual(CITY_LEGS.map((l) => l.id));
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement** prompts/`move` strings per leg: logo on leg 1; plate notes from `CITY_PLATE_MOMENTS`; package accents; VTT/science consecutive. Wire multi-ref Omni calls the same way the existing chain passes start-frame + style.

- [ ] **Step 4: Tests PASS**

- [ ] **Step 5: Commit**

```bash
git add scripts/omni-animate-city-legs.mjs scripts/omni-animate-city-legs.test.ts
git commit -m "$(cat <<'EOF'
feat(city): point Omni chain at logo, plates, and package accents

Replace the product-free style ban so the re-shoot can bake the full deck.
EOF
)"
```

---

### Task 4: Placeholder legs for expanded track (dev without Omni)

**Files:**
- Modify: `scripts/city-placeholder-legs.ts` (and tests if any)
- Modify: `scripts/verify-city-assets.ts`

- [ ] **Step 1: Extend placeholder generator** to emit every new `CITY_LEGS` id (zoompan from that leg’s primary plate moment `conceptSrc`, else Era).

- [ ] **Step 2: Run** `npx tsx scripts/city-placeholder-legs.ts` then `npm run verify:city-assets`  
Expected: all legs + posters present; durations match clipSeconds ± tolerance.

- [ ] **Step 3: Commit** generated `public/city/legs/*` + `posters/*` only if placeholders are required for CI; otherwise commit script changes and document regenerate command in baseline.

```bash
git add scripts/city-placeholder-legs.ts scripts/verify-city-assets.ts public/city/
git commit -m "$(cat <<'EOF'
feat(city): placeholder encodes for expanded plate-in-flight legs

Keep local scrub working before the Omni re-chain lands.
EOF
)"
```

---

### Task 5: Omni re-chain (operator spend)

**Files:**
- Runtime: `public/city/legs/*`, `public/city/posters/*`, `out/city-chain/`
- Docs: `docs/baselines/city/YYYY-MM-DD-plates-in-flight-omni.md`

- [ ] **Step 1: Confirm API key** via Obsidian / env (do not commit secrets).

- [ ] **Step 2: Dry-run** one leg (leg-01) and visually confirm logo reveal + terrace.

- [ ] **Step 3: Full chain**

```bash
node scripts/omni-animate-city-legs.mjs --force
```

Expected: all legs encoded desktop+mobile; posters from frame 0; seam continuity.

- [ ] **Step 4: Plate checklist** in baseline markdown — tick each of 26 slide ids + note 4–6 package accents + VTT pair.

- [ ] **Step 5: Commit** media + baseline (large binaries only if repo already tracks city legs).

```bash
git add public/city docs/baselines/city/
git commit -m "$(cat <<'EOF'
feat(city): Omni plates-in-flight chain with logo and VTT beats

Replace the product-free flyby with the full deck grounded in approved plates.
EOF
)"
```

---

### Task 6: E2E + mobile crowding guards

**Files:**
- Modify: `e2e/city.spec.ts`

- [ ] **Step 1: Add / update tests**

```ts
test("has no glass plates in the DOM", async ({ page }) => {
  await expect(page.locator("[data-glass]")).toHaveCount(0);
});

test("science / VTT headline appears during product act", async ({ page }) => {
  await scrollToVh(page, /* vh near 05b window from COPY_WINDOWS */ 0);
  // compute from data: import COPY_WINDOWS mid or hardcode measured vh after Task 1
  await expect(page.locator('[data-city-copy="05b-science"]')).toBeVisible();
});

// keep existing mobile dual-hold guard; broaden sample across full track
```

- [ ] **Step 2: `npm run build:e2e && npm run test:e2e -- city.spec.ts`** — PASS

- [ ] **Step 3: Commit**

```bash
git add e2e/city.spec.ts
git commit -m "$(cat <<'EOF'
test(city): assert no glass and VTT science on the flight

Guard the plates-in-flight contracts in Playwright.
EOF
)"
```

---

### Task 7: Scroll-craft shoot / fingerprint

**Files:**
- `docs/baselines/city/` contact notes + `FINGERPRINTS.md` row

- [ ] **Step 1:** Run scroll-craft shoot/verify flow used for prior city baseline (serve `dist`, contact strip open / VTT / peak / streams / join).

- [ ] **Step 2:** Update fingerprint: signature = **approved plates live inside the neon city film**; note logo open + sparse packages.

- [ ] **Step 3: Commit**

```bash
git add docs/baselines/city/
git commit -m "$(cat <<'EOF'
docs(city): baseline plates-in-flight shoot and fingerprint

Record the new signature after glass removal and Omni re-chain.
EOF
)"
```

---

### Task 8: Gated — default front door (unchanged gate)

Do **not** start until operator explicitly unlocks.

- Flip `/` → city; `?view=experience` for 26-scene shell; migrate experience e2e `goto`s; README/OG — same as original worldflight Task 11.

---

## Spec coverage check

| Spec requirement | Task |
|------------------|------|
| 26 plates in film | 1, 3, 5 |
| Remove glass DOM | 2, 6 |
| Logo open baked | 3, 5 |
| 4–6 packages | 1, 3, 5 |
| All slide copy sequenced | 1, 2 |
| VTT `05b-science` on flight | 1, 2, 5, 6 |
| Track 16–22vh + pace/seam | 1, 4, 5 |
| Mobile non-overlap | 2, 6 |
| Baseline / fingerprint | 7 |
| Default flip | 8 (gated) |

## Placeholder scan

No TBD steps. Omni spend is Task 5 with explicit commands. Exact `scrollToVh` for science may be filled from `COPY_WINDOWS` + `trackTotalVh()` once Task 1 lands — compute in the test from exported helpers rather than magic numbers:

```ts
import { COPY_WINDOWS, trackTotalVh, legStartVh } from "../src/data/cityFlight";
// parse mid-point of COPY_WINDOWS["05b-science"] * trackTotalVh()
```
