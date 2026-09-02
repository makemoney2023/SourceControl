# Neon City Worldflight Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the neon-city worldflight page behind `?view=city` — one continuous scroll-scrubbed camera flight with approved plates in glass and live copy from `slides.ts` — then (gated) flip it to the default front door.

**Architecture:** A `CityFlightShell` React component renders authored worldflight markup (`data-sc-mode="worldflight"`) and mounts the vendored Scroll Craft engine in an effect. All strings and plate paths come from `src/data/cityFlight.ts`, a thin SSOT map over `SLIDES` / `INCOME_STREAMS`. City film legs are mp4s at fixed public paths; a local ffmpeg script builds placeholder legs from approved plates so the whole page works before kie.ai generation (blocked on API key) swaps in real camera moves at the same paths.

**Tech Stack:** Vite + React 19, TypeScript, vitest + Testing Library, Playwright + axe, Scroll Craft engine (vanilla JS, vendored), ffmpeg, tsx for scripts.

**Spec:** `docs/superpowers/specs/2026-09-02-neon-city-worldflight-design.md` (read it before starting).

## Global Constraints

- Copy on the city page comes **verbatim** from `SLIDES` / `INCOME_STREAMS` / `INCOME_DISCLOSURE`. No new compensation numbers, no new claims, no paraphrase.
- Never edit `scrollcraft.js` / `scrollcraft.css` after vendoring. Theme via the six `--sc-*` color tokens and two font tokens only.
- No scene counter, no "Scroll/Swipe to explore" cue, no 26-item jumper on the city page.
- Plates are the approved PNGs referenced by each slide's `conceptSrc`. Never AI-redraw or substitute them. Glass `img` elements use `alt=""`.
- Pace law: every leg's `weight ÷ clipSeconds` = `CITY_RATE` = **0.215 vh/s** (±0.005). Peak is the only 10s leg → the only ~2.15vh leg.
- Encodes: GOP 8 desktop, GOP 4 mobile, no audio track. Posters extracted from **encoded** mp4s.
- Join CTAs render only when `VITE_AFFILIATE_URL` and `VITE_INCOME_DISCLOSURE_URL` are both valid HTTPS (reuse `readProductionCtaLinksFromEnv`).
- Income disclosure (`INCOME_DISCLOSURE`) stays pinned on screen for the whole Streams window, ≥16px.
- Phase 1 must not touch existing routes, `e2e/experience.spec.ts`, or visual snapshots. The default flip is Task 11, gated on operator approval.
- macOS commands only. Run `npm test`, `npm run lint`, `npm run build` clean before each commit that touches `src/`.
- Working directory for all tasks: `/Users/cbsuperpatch/Desktop/ClaudeSkills/.worktrees/affiliate-income-stack-main` (branch `feat/neon-city-worldflight`).

## File Structure

| Path | Responsibility |
|------|----------------|
| `src/data/cityFlight.ts` | SSOT map: legs, weights, copy windows, glass plates, stops, streams window. Pure data + pure helpers |
| `src/data/cityFlight.test.ts` | Contract tests: ids exist, pace law, peak margin, track length, stops |
| `src/city/engine/scrollcraft.js` + `.css` | Vendored engine, byte-identical to upstream |
| `src/city/city.css` | SuperPatch token overrides + city-only styles (glass, rail, streams index, disclosure) |
| `src/city/CityFlightShell.tsx` | The page: authored worldflight markup, engine mount, relayout, save-data, focus/verify wiring |
| `src/city/CityFlightShell.test.tsx` | Rendering contracts: copy verbatim, plates, no counter/cue, CTA gating |
| `src/city/glassFocus.ts` + `.test.ts` | Pure helpers: `glassVerifyState`, `streamsProgress` |
| `src/city/CityStopsRail.tsx` + `.test.tsx` | Five map stops, `aria-current`, waypoint listener |
| `src/city/StreamsIndex.tsx` + `.test.tsx` | Ten-stream lighting index from `INCOME_STREAMS` |
| `scripts/city-placeholder-legs.ts` | ffmpeg zoompan placeholder legs + mobile encodes + posters |
| `scripts/verify-city-assets.ts` | Presence/duration check for every leg + poster |
| `e2e/city.spec.ts` | Browser checks + axe at open/peak/close |
| `docs/baselines/city/` | Shoot contact sheets + feel-check notes |

---

### Task 1: `cityFlight.ts` data module

**Files:**
- Create: `src/data/cityFlight.ts`
- Test: `src/data/cityFlight.test.ts`

**Interfaces:**
- Consumes: `SLIDES`, `INCOME_DISCLOSURE`, `Slide` from `./slides`; `INCOME_STREAMS` from `./streamIndex`.
- Produces (used by Tasks 2–8): `CITY_RATE`, `CityLeg`, `CITY_LEGS`, `CITY_GLASS`, `CITY_STOPS`, `STREAMS_WINDOW`, `slideById(id): Slide`, `trackTotalVh(): number`, `legStartVh(i): number`, `windowForLegs(start, end, rampIn?, rampOut?): string`, `windowForLegSlice(leg, fromFrac, toFrac, rampIn?, rampOut?): string`, `stopScrollY(legIndex, innerHeight): number`, `streamsIndexLabels(): string[]`, `CITY_DISCLOSURE`.

- [ ] **Step 1: Write the failing test**

```ts
// src/data/cityFlight.test.ts
import { describe, expect, it } from "vitest";
import {
  CITY_LEGS,
  CITY_GLASS,
  CITY_STOPS,
  CITY_RATE,
  STREAMS_WINDOW,
  legStartVh,
  slideById,
  stopScrollY,
  streamsIndexLabels,
  trackTotalVh,
  windowForLegs,
  windowForLegSlice,
} from "./cityFlight";
import { SLIDES } from "./slides";
import { INCOME_STREAMS } from "./streamIndex";

const slideIds = new Set(SLIDES.map((s) => s.id));

describe("cityFlight legs", () => {
  it("has ten legs and every placeholder plate maps to a real slide", () => {
    expect(CITY_LEGS).toHaveLength(10);
    for (const leg of CITY_LEGS) {
      expect(slideIds.has(leg.placeholderPlateOf), leg.id).toBe(true);
      expect(leg.src).toBe(`/city/legs/${leg.id}.mp4`);
      expect(leg.srcMobile).toBe(`/city/legs/${leg.id}-m.mp4`);
      expect(leg.poster).toBe(`/city/posters/${leg.id}.webp`);
    }
  });

  it("holds one pace across the whole flight (pace law)", () => {
    for (const leg of CITY_LEGS) {
      expect(Math.abs(leg.weight / leg.clipSeconds - CITY_RATE), leg.id).toBeLessThan(0.005);
    }
  });

  it("makes the skyline lock the only 10s leg and ~2x every other leg", () => {
    const peak = CITY_LEGS.find((l) => l.id === "leg-07-skyline-lock");
    expect(peak?.clipSeconds).toBe(10);
    for (const leg of CITY_LEGS) {
      if (leg.id === "leg-07-skyline-lock") continue;
      expect(peak!.weight / leg.weight).toBeGreaterThanOrEqual(1.9);
    }
  });

  it("keeps the film inside the 9-12vh band", () => {
    expect(trackTotalVh()).toBeGreaterThanOrEqual(9);
    expect(trackTotalVh()).toBeLessThanOrEqual(12);
  });
});

describe("cityFlight windows and stops", () => {
  it("legStartVh accumulates weights", () => {
    expect(legStartVh(0)).toBe(0);
    expect(legStartVh(2)).toBeCloseTo(CITY_LEGS[0].weight + CITY_LEGS[1].weight, 5);
  });

  it("windowForLegs returns 'from to in out' track fractions in order", () => {
    const [from, to, rin, rout] = windowForLegs(1, 1).split(" ").map(Number);
    expect(from).toBeGreaterThan(0);
    expect(to).toBeGreaterThan(from);
    expect(to).toBeLessThanOrEqual(1);
    expect(rin).toBeGreaterThan(0);
    expect(rout).toBeGreaterThan(0);
  });

  it("windowForLegSlice stays inside its leg", () => {
    const whole = windowForLegs(6, 6).split(" ").map(Number);
    const slice = windowForLegSlice(6, 0.7, 1).split(" ").map(Number);
    expect(slice[0]).toBeGreaterThanOrEqual(whole[0]);
    expect(slice[1]).toBeLessThanOrEqual(whole[1] + 1e-9);
  });

  it("exposes exactly five stops in flight order", () => {
    expect(CITY_STOPS.map((s) => s.label)).toEqual([
      "Era", "Opportunity", "Skyline", "Streams", "Join",
    ]);
    const idxs = CITY_STOPS.map((s) => s.legIndex);
    expect([...idxs].sort((a, b) => a - b)).toEqual(idxs);
  });

  it("stopScrollY converts leg start to pixels", () => {
    expect(stopScrollY(0, 800)).toBe(0);
    expect(stopScrollY(2, 800)).toBeCloseTo(legStartVh(2) * 800, 3);
  });
});

describe("cityFlight glass and streams", () => {
  it("every glass entry points at a real slide and a real leg", () => {
    for (const g of CITY_GLASS) {
      expect(slideIds.has(g.slideId), g.slideId).toBe(true);
      expect(g.legIndex).toBeGreaterThanOrEqual(0);
      expect(g.legIndex).toBeLessThan(CITY_LEGS.length);
      expect(slideById(g.slideId).conceptSrc).toMatch(/^\/concepts\//);
    }
  });

  it("streams window covers the district legs", () => {
    expect(STREAMS_WINDOW).toEqual({ startLeg: 7, endLeg: 8 });
  });

  it("streams index labels are the ten shortLabels verbatim", () => {
    expect(streamsIndexLabels()).toEqual(INCOME_STREAMS.map((s) => s.shortLabel));
  });

  it("slideById throws on unknown id", () => {
    expect(() => slideById("nope")).toThrow(/nope/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/cityFlight.test.ts`
Expected: FAIL — cannot resolve `./cityFlight`.

- [ ] **Step 3: Write the module**

```ts
// src/data/cityFlight.ts
import { INCOME_DISCLOSURE, SLIDES, type Slide } from "./slides";
import { INCOME_STREAMS } from "./streamIndex";

/** vh of scroll per second of film. One pace for the whole flight (spec: 0.21-0.22). */
export const CITY_RATE = 0.215;

export type CityStopLabel = "Era" | "Opportunity" | "Skyline" | "Streams" | "Join";

export type CityLeg = {
  id: string;
  clipSeconds: number;
  /** vh of scroll this leg owns. Always clipSeconds * CITY_RATE (pace law). */
  weight: number;
  src: string;
  srcMobile: string;
  poster: string;
  waypoint?: CityStopLabel;
  /** Slide whose conceptSrc seeds the ffmpeg placeholder leg until kie legs land. */
  placeholderPlateOf: string;
};

function leg(
  id: string,
  clipSeconds: number,
  placeholderPlateOf: string,
  waypoint?: CityStopLabel,
): CityLeg {
  return {
    id,
    clipSeconds,
    weight: Number((clipSeconds * CITY_RATE).toFixed(3)),
    src: `/city/legs/${id}.mp4`,
    srcMobile: `/city/legs/${id}-m.mp4`,
    poster: `/city/posters/${id}.webp`,
    waypoint,
    placeholderPlateOf,
  };
}

/** Flight order. leg-07 is the peak: the only 10s clip, so the only ~2.15vh leg. */
export const CITY_LEGS: CityLeg[] = [
  leg("leg-01-terrace", 5, "00-era", "Era"),
  leg("leg-02-title-glass", 5, "01-title", "Opportunity"),
  leg("leg-03-overlook", 5, "00b-mission"),
  leg("leg-04-street", 5, "00c-ceo"),
  leg("leg-05-windows", 5, "02-world"),
  leg("leg-06-ascent", 5, "03-four-stacks", "Skyline"),
  leg("leg-07-skyline-lock", 10, "03b-name-stacks"),
  leg("leg-08-districts-a", 5, "08-ten-layers", "Streams"),
  leg("leg-09-districts-b", 5, "17-compounding"),
  leg("leg-10-hold", 5, "15-closing", "Join"),
];

const slideMap = new Map(SLIDES.map((s) => [s.id, s]));

export function slideById(id: string): Slide {
  const slide = slideMap.get(id);
  if (!slide) throw new Error(`cityFlight references unknown slide ${id}`);
  return slide;
}

export function trackTotalVh(): number {
  return CITY_LEGS.reduce((sum, l) => sum + l.weight, 0);
}

export function legStartVh(index: number): number {
  return CITY_LEGS.slice(0, index).reduce((sum, l) => sum + l.weight, 0);
}

/** Copy window "from to in out" (track fractions) spanning legs [start..end]. */
export function windowForLegs(
  start: number,
  end: number,
  rampIn = 0.15,
  rampOut = 0.15,
): string {
  const total = trackTotalVh();
  const from = legStartVh(start) / total;
  const to = (legStartVh(end) + CITY_LEGS[end].weight) / total;
  return `${from.toFixed(4)} ${to.toFixed(4)} ${rampIn} ${rampOut}`;
}

/** Copy window confined to a fraction of one leg (e.g. the last 30% of the peak). */
export function windowForLegSlice(
  legIndex: number,
  fromFrac: number,
  toFrac: number,
  rampIn = 0.2,
  rampOut = 0.2,
): string {
  const total = trackTotalVh();
  const start = legStartVh(legIndex);
  const w = CITY_LEGS[legIndex].weight;
  const from = (start + w * fromFrac) / total;
  const to = (start + w * toFrac) / total;
  return `${from.toFixed(4)} ${to.toFixed(4)} ${rampIn} ${rampOut}`;
}

export type CityGlass = { slideId: string; legIndex: number };

/** Approved plates that live in the city's glass. Never substituted, never redrawn. */
export const CITY_GLASS: CityGlass[] = [
  { slideId: "01-title", legIndex: 1 },
  { slideId: "00c-ceo", legIndex: 3 },
  { slideId: "02-world", legIndex: 4 },
  { slideId: "03-four-stacks", legIndex: 5 },
  { slideId: "07-retail", legIndex: 7 },
  { slideId: "09-team-overrides", legIndex: 7 },
  { slideId: "12-generations", legIndex: 8 },
  { slideId: "14-global", legIndex: 8 },
];

export type CityStop = { id: string; label: CityStopLabel; legIndex: number };

export const CITY_STOPS: CityStop[] = CITY_LEGS.flatMap((l, i) =>
  l.waypoint ? [{ id: l.id, label: l.waypoint, legIndex: i }] : [],
);

export function stopScrollY(legIndex: number, innerHeight: number): number {
  return legStartVh(legIndex) * innerHeight;
}

/** District legs where the ten-stream index lights and the disclosure stays pinned. */
export const STREAMS_WINDOW = { startLeg: 7, endLeg: 8 } as const;

export function streamsIndexLabels(): string[] {
  return INCOME_STREAMS.map((s) => s.shortLabel);
}

export const CITY_DISCLOSURE = INCOME_DISCLOSURE;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/cityFlight.test.ts`
Expected: PASS (all).

- [ ] **Step 5: Commit**

```bash
git add src/data/cityFlight.ts src/data/cityFlight.test.ts
git commit -m "feat(city): cityFlight SSOT map — legs, pace law, windows, glass, stops"
```

---

### Task 2: Placeholder legs + asset verifier

**Files:**
- Create: `scripts/city-placeholder-legs.ts`
- Create: `scripts/verify-city-assets.ts`
- Modify: `package.json` (two npm scripts)

**Interfaces:**
- Consumes: `CITY_LEGS`, `slideById` from `../src/data/cityFlight`.
- Produces: files at `public/city/legs/<id>.mp4`, `public/city/legs/<id>-m.mp4`, `public/city/posters/<id>.webp` for all ten legs — exactly the paths `CityLeg` declares. `npm run city:placeholders`, `npm run verify:city-assets` (exit 0 = complete).

- [ ] **Step 1: Write the generator script**

```ts
// scripts/city-placeholder-legs.ts
// Placeholder city legs: slow ffmpeg push-ins over approved plates, encoded for
// scrubbing (dense GOP). Same output paths the real kie legs will overwrite later.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { CITY_LEGS, slideById } from "../src/data/cityFlight";

const root = resolve(import.meta.dirname, "..");
const legsDir = resolve(root, "public/city/legs");
const postersDir = resolve(root, "public/city/posters");
mkdirSync(legsDir, { recursive: true });
mkdirSync(postersDir, { recursive: true });

const FPS = 25;

function ffmpeg(args: string[]): void {
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...args], { stdio: "inherit" });
}

for (const leg of CITY_LEGS) {
  const plate = resolve(root, "public", slideById(leg.placeholderPlateOf).conceptSrc.slice(1));
  if (!existsSync(plate)) throw new Error(`missing plate ${plate}`);
  const frames = FPS * leg.clipSeconds;
  const zoom = `zoompan=z='1.04+0.14*on/${frames}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1920x1080:fps=${FPS}`;
  const desktop = `${legsDir}/${leg.id}.mp4`;
  const mobile = `${legsDir}/${leg.id}-m.mp4`;

  // Desktop: 1920x1080, GOP 8, no audio.
  ffmpeg([
    "-loop", "1", "-i", plate,
    "-vf", `${zoom},format=yuv420p`,
    "-t", String(leg.clipSeconds), "-an",
    "-c:v", "libx264", "-preset", "medium", "-crf", "20",
    "-g", "8", "-keyint_min", "8", "-sc_threshold", "0",
    desktop,
  ]);

  // Mobile: portrait center crop 720x1280, GOP 4.
  ffmpeg([
    "-i", desktop,
    "-vf", "crop=ih*9/16:ih,scale=720:1280,format=yuv420p",
    "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "22",
    "-g", "4", "-keyint_min", "4", "-sc_threshold", "0",
    mobile,
  ]);

  // Poster from the ENCODED desktop mp4 (first decoded frame = what the browser holds).
  ffmpeg(["-i", desktop, "-frames:v", "1", `${postersDir}/${leg.id}.webp`]);

  console.log(`built ${leg.id}`);
}
console.log("placeholder legs complete");
```

- [ ] **Step 2: Write the verifier**

```ts
// scripts/verify-city-assets.ts
// Exit non-zero unless every leg has desktop + mobile mp4 and a poster, with
// duration within 0.5s of the manifest.
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { CITY_LEGS } from "../src/data/cityFlight";

const root = resolve(import.meta.dirname, "..");
let failures = 0;

function durationSec(file: string): number {
  const out = execFileSync("ffprobe", [
    "-v", "error", "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1", file,
  ]).toString();
  return Number(out.trim());
}

for (const leg of CITY_LEGS) {
  for (const rel of [leg.src, leg.srcMobile, leg.poster]) {
    const file = resolve(root, "public", rel.slice(1));
    if (!existsSync(file)) {
      console.error(`MISSING ${rel}`);
      failures++;
      continue;
    }
    if (rel.endsWith(".mp4")) {
      const d = durationSec(file);
      if (Math.abs(d - leg.clipSeconds) > 0.5) {
        console.error(`BAD DURATION ${rel}: ${d}s, expected ~${leg.clipSeconds}s`);
        failures++;
      }
    }
  }
}

if (failures > 0) {
  console.error(`${failures} city asset problem(s)`);
  process.exit(1);
}
console.log(`all ${CITY_LEGS.length} legs verified`);
```

- [ ] **Step 3: Add npm scripts**

In `package.json` `"scripts"`, after `"verify:omni-assets"`:

```json
"city:placeholders": "tsx scripts/city-placeholder-legs.ts",
"verify:city-assets": "tsx scripts/verify-city-assets.ts",
```

- [ ] **Step 4: Run and verify**

Run: `npm run verify:city-assets`
Expected: FAIL — 30 MISSING lines, exit 1.

Run: `npm run city:placeholders` (takes a few minutes)
Expected: `built leg-01-terrace` … `placeholder legs complete`.

Run: `npm run verify:city-assets`
Expected: `all 10 legs verified`, exit 0.

- [ ] **Step 5: Commit** (media is committed in this repo by convention; ~20-40MB)

```bash
git add scripts/city-placeholder-legs.ts scripts/verify-city-assets.ts package.json public/city/
git commit -m "feat(city): placeholder flight legs from approved plates + asset verifier"
```

---

### Task 3: Vendor engine, theme, and `CityFlightShell`

**Files:**
- Create: `src/city/engine/scrollcraft.js` (copy, unmodified)
- Create: `src/city/engine/scrollcraft.css` (copy, unmodified)
- Create: `src/city/city.css`
- Create: `src/city/CityFlightShell.tsx`
- Test: `src/city/CityFlightShell.test.tsx`

**Interfaces:**
- Consumes: everything from Task 1; `readProductionCtaLinksFromEnv` from `../components/experience/ctaLinks`; `useDataSave` from `../components/experience/useDataSave`; `hasEndCard` from `../data/slides`.
- Produces: `CityFlightShell(): JSX.Element` with root `[data-city-flight]`. Placeholder containers `[data-city-rail]`, `[data-city-streams]`, `[data-city-glass-layer]` that Tasks 4–6 fill. Copy blocks carry `data-city-copy="<slideId>"`.

- [ ] **Step 1: Vendor the engine (byte-identical)**

```bash
mkdir -p src/city/engine
cp /Users/cbsuperpatch/Desktop/ClaudeSkills/skills/community/scroll-craft/plugins/nateherk-design/skills/scrollcraft/engine/scrollcraft.js src/city/engine/
cp /Users/cbsuperpatch/Desktop/ClaudeSkills/skills/community/scroll-craft/plugins/nateherk-design/skills/scrollcraft/engine/scrollcraft.css src/city/engine/
diff src/city/engine/scrollcraft.js /Users/cbsuperpatch/Desktop/ClaudeSkills/skills/community/scroll-craft/plugins/nateherk-design/skills/scrollcraft/engine/scrollcraft.js && echo ENGINE-IDENTICAL
```

Expected: `ENGINE-IDENTICAL`.

- [ ] **Step 2: Write the failing shell test**

```tsx
// src/city/CityFlightShell.test.tsx
import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CityFlightShell } from "./CityFlightShell";
import { CITY_GLASS, CITY_LEGS, CITY_DISCLOSURE, slideById } from "../data/cityFlight";

afterEach(() => vi.unstubAllEnvs());

describe("CityFlightShell", () => {
  it("renders the worldflight root, all legs, and the spacer", () => {
    const { container } = render(<CityFlightShell />);
    const root = container.querySelector("[data-city-flight]");
    expect(root?.getAttribute("data-sc-mode")).toBe("worldflight");
    expect(container.querySelectorAll("[data-sc-segment]")).toHaveLength(CITY_LEGS.length);
    expect(container.querySelector("[data-sc-spacer]")).toBeTruthy();
  });

  it("opens on the Era headline verbatim from SLIDES", () => {
    const { getByRole } = render(<CityFlightShell />);
    expect(
      getByRole("heading", { level: 1, name: slideById("00-era").headline }),
    ).toBeTruthy();
  });

  it("renders every mapped copy block verbatim", () => {
    const { container } = render(<CityFlightShell />);
    for (const id of [
      "01-title", "00b-mission", "00c-ceo", "02-world",
      "03-four-stacks", "08-ten-layers", "18-different", "15-closing",
    ]) {
      const block = container.querySelector(`[data-city-copy="${id}"]`);
      expect(block?.textContent).toContain(slideById(id).headline);
    }
  });

  it("puts every approved plate in glass with alt='' and the exact conceptSrc", () => {
    const { container } = render(<CityFlightShell />);
    for (const g of CITY_GLASS) {
      const img = container.querySelector<HTMLImageElement>(
        `figure[data-glass="${g.slideId}"] img`,
      );
      expect(img?.getAttribute("src")).toBe(slideById(g.slideId).conceptSrc);
      expect(img?.getAttribute("alt")).toBe("");
    }
  });

  it("has no scene counter and no scroll cue", () => {
    const { container } = render(<CityFlightShell />);
    expect(container.textContent).not.toMatch(/\d{2}\s*\/\s*\d{2}/);
    expect(container.textContent).not.toMatch(/scroll to explore/i);
    expect(container.textContent).not.toMatch(/swipe to explore/i);
  });

  it("pins the income disclosure", () => {
    const { container } = render(<CityFlightShell />);
    const pinned = container.querySelector("[data-city-disclosure]");
    expect(pinned?.textContent).toBe(CITY_DISCLOSURE);
  });

  it("hides Join CTAs without production URLs", () => {
    const { container } = render(<CityFlightShell />);
    expect(container.querySelector("[data-city-cta]")).toBeNull();
  });

  it("shows Join CTAs with verbatim labels when both HTTPS URLs are set", () => {
    vi.stubEnv("VITE_AFFILIATE_URL", "https://superpatch.example/join");
    vi.stubEnv("VITE_INCOME_DISCLOSURE_URL", "https://superpatch.example/disclosure");
    const { container } = render(<CityFlightShell />);
    const closing = slideById("15-closing");
    const ctas = container.querySelectorAll("[data-city-cta] a");
    expect(ctas).toHaveLength(2);
    expect(ctas[0].textContent).toBe(closing.ctaPrimary);
    expect(ctas[1].textContent).toBe(closing.ctaSecondary);
  });

  it("links out to the full experience for stream detail", () => {
    const { container } = render(<CityFlightShell />);
    const link = container.querySelector<HTMLAnchorElement>("[data-city-experience-link]");
    expect(link?.getAttribute("href")).toBe("/?view=experience");
  });
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `npx vitest run src/city/CityFlightShell.test.tsx`
Expected: FAIL — cannot resolve `./CityFlightShell`.

- [ ] **Step 4: Write `city.css`** (tokens map to existing SuperPatch tokens; six colors + two fonts only, then city-page styles)

```css
/* src/city/city.css — SuperPatch theme over the engine tokens + city-only styles. */

.city-flight {
  /* The six color roles + two fonts. This is the entire engine theme. */
  --sc-canvas: var(--sp-bg, #05070f);
  --sc-surface: var(--sp-bg-elevated, #0a0e1a);
  --sc-ink: var(--sp-text, #ffffff);
  --sc-ink-soft: var(--sp-muted, #c8c8c8);
  --sc-accent: var(--sp-red, #dd0604);
  --sc-accent-ink: #ffffff;
  --sc-font-display: var(--font-display, "Montserrat", sans-serif);
  --sc-font-text: var(--font-body, "Montserrat", sans-serif);
}

/* Approved plates living in the city's glass. Blurred until focused/active. */
.city-glass {
  position: absolute;
  margin: 0;
  width: min(34vw, 560px);
  border: 1px solid var(--sc-hairline);
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgb(0 0 0 / 0.45);
}
.city-glass img {
  display: block;
  width: 100%;
  height: auto;
  filter: blur(2px) saturate(0.8) brightness(0.85);
  transition: filter 320ms ease, transform 320ms ease;
}
.city-glass:hover img,
.city-glass:focus-within img,
[data-city-focus] .city-glass[data-focused="true"] img {
  filter: none;
  transform: scale(1.015);
}
@media (prefers-reduced-motion: reduce) {
  .city-glass img { transition: none; }
}

/* Per-leg glass positions: authored, varied anchors (never all centered). */
.city-glass[data-glass="01-title"]   { right: 8vw;  top: 18vh; }
.city-glass[data-glass="00c-ceo"]    { left: 7vw;   bottom: 16vh; }
.city-glass[data-glass="02-world"]   { right: 10vw; bottom: 20vh; }
.city-glass[data-glass="03-four-stacks"] { left: 9vw; top: 14vh; }
.city-glass[data-glass="07-retail"]  { left: 6vw;   top: 12vh; width: min(26vw, 420px); }
.city-glass[data-glass="09-team-overrides"] { right: 7vw; bottom: 18vh; width: min(26vw, 420px); }
.city-glass[data-glass="12-generations"] { left: 8vw; bottom: 14vh; width: min(26vw, 420px); }
.city-glass[data-glass="14-global"]  { right: 9vw;  top: 16vh; width: min(26vw, 420px); }

/* Ten-stream index: pure CSS lighting off the engine's track vars. */
.city-streams-index {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.35rem;
  font-family: var(--sc-font-text);
  font-size: var(--sc-t-sm);
  color: var(--sc-ink);
}
.city-streams-index li {
  --city-flight-t: calc(var(--sc-seg, 0) + var(--sc-segp, 0));
  /* Item i lights as the flight crosses its slice of the streams legs. */
  opacity: calc(0.3 + 0.7 * clamp(0, (var(--city-flight-t) - (7 + var(--i) / 5)) * 6, 1));
}

/* Pinned disclosure: never below 16px. */
.city-disclosure {
  font-size: max(1rem, var(--sc-t-sm));
  color: var(--sc-ink-soft);
  max-width: 60ch;
}

/* Map stops rail. */
.city-rail {
  position: fixed;
  right: max(1.2rem, env(safe-area-inset-right));
  top: 50%;
  transform: translateY(-50%);
  z-index: 200;
  display: grid;
  gap: 0.5rem;
}
.city-rail button {
  min-width: 44px;
  min-height: 44px;
  border: 1px solid var(--sc-hairline-strong);
  background: color-mix(in oklab, var(--sc-canvas) 82%, transparent);
  color: var(--sc-ink-soft);
  font-family: var(--sc-font-text);
  font-size: var(--sc-t-xs);
  border-radius: 4px;
  cursor: pointer;
}
.city-rail button[aria-current="true"] {
  color: var(--sc-ink);
  border-color: var(--sc-accent);
}

/* Join CTAs (verbatim labels from 15-closing). */
.city-cta { display: flex; gap: 0.8rem; flex-wrap: wrap; }
.city-cta a {
  font-family: var(--sc-font-text);
  padding: 0.85rem 1.4rem;
  border-radius: 4px;
  text-decoration: none;
}
.city-cta a:first-child { background: var(--sc-accent); color: var(--sc-accent-ink); }
.city-cta a:last-child { border: 1px solid var(--sc-hairline-strong); color: var(--sc-ink); }
```

- [ ] **Step 5: Write the shell**

```tsx
// src/city/CityFlightShell.tsx
// The neon-city worldflight. Authored markup driven by the vendored Scroll Craft
// engine; all strings and plate paths come from the cityFlight/slides SSOT.
// View switches are full navigations (query param), so the engine mounts once
// per page load and needs no unmount path.
import { useEffect, useRef } from "react";
import {
  CITY_DISCLOSURE,
  CITY_GLASS,
  CITY_LEGS,
  STREAMS_WINDOW,
  slideById,
  windowForLegs,
  windowForLegSlice,
} from "../data/cityFlight";
import { readProductionCtaLinksFromEnv } from "../components/experience/ctaLinks";
import { useDataSave } from "../components/experience/useDataSave";
import { CityStopsRail } from "./CityStopsRail";
import { StreamsIndex } from "./StreamsIndex";
import { wireGlassFocus } from "./glassFocus";
import "./engine/scrollcraft.css";
import "./city.css";

declare global {
  interface Window {
    ScrollCraft?: { mount: (root: Document) => unknown };
  }
}

function Copy({
  slideId,
  window: win,
  anchor,
  level = 2,
  withEyebrow = false,
}: {
  slideId: string;
  window: string;
  anchor: "lead" | "trail" | "center";
  level?: 1 | 2;
  withEyebrow?: boolean;
}) {
  const slide = slideById(slideId);
  const H = level === 1 ? "h1" : "h2";
  return (
    <div
      className={`sc-copy sc-copy--${anchor}`}
      data-sc-copy
      data-sc-window={win}
      data-city-copy={slideId}
    >
      {withEyebrow && slide.eyebrow ? (
        <p className="sc-eyebrow">{slide.eyebrow}</p>
      ) : null}
      <H className="sc-display sc-display--lg">{slide.headline}</H>
    </div>
  );
}

export function CityFlightShell() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dataSave = useDataSave();
  const ctaLinks = readProductionCtaLinksFromEnv();
  const closing = slideById("15-closing");

  useEffect(() => {
    if (import.meta.env.MODE === "test") return;
    let disposed = false;
    import("./engine/scrollcraft.js" as string).then(() => {
      if (disposed || !window.ScrollCraft) return;
      window.ScrollCraft.mount(document);
      // Worldflight sizes its spacer once at mount; a 0 innerHeight reading
      // leaves the page unscrollable with no error. Re-measure when the window
      // and the webfonts settle.
      const relayout = () => window.dispatchEvent(new Event("resize"));
      window.addEventListener("load", relayout);
      document.fonts?.ready.then(relayout);
    });
    const unwire = wireGlassFocus(rootRef.current, STREAMS_WINDOW);
    return () => {
      disposed = true;
      unwire();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="city-flight"
      data-city-flight
      data-sc-mode="worldflight"
      data-sc-seam="0.12"
    >
      <div data-sc-world>
        {CITY_LEGS.map((leg) => (
          <div
            key={leg.id}
            data-sc-segment
            data-sc-w={leg.weight}
            {...(leg.waypoint ? { "data-sc-waypoint": leg.waypoint } : {})}
          >
            <img className="sc-world__poster" src={leg.poster} alt="" decoding="async" />
            {dataSave ? null : (
              <video
                data-sc-src={leg.src}
                data-sc-src-mobile={leg.srcMobile}
                playsInline
                muted
              />
            )}
          </div>
        ))}
      </div>

      <div data-sc-world-copy data-city-glass-layer>
        <div className="sc-world__scrim sc-scrim sc-scrim--band" />

        {/* Open: quiet awe. Hero window — on from the first pixel. */}
        <Copy slideId="00-era" window="hero" anchor="lead" level={1} />

        {/* Claim / Quiet / Human / Pressure / Approach. Varied anchors. */}
        <Copy slideId="01-title" window={windowForLegs(1, 1)} anchor="trail" withEyebrow />
        <Copy slideId="00b-mission" window={windowForLegs(2, 2)} anchor="center" />
        <Copy slideId="00c-ceo" window={windowForLegs(3, 3)} anchor="lead" />
        <Copy slideId="02-world" window={windowForLegs(4, 4)} anchor="trail" withEyebrow />
        <Copy slideId="03-four-stacks" window={windowForLegs(5, 5)} anchor="lead" withEyebrow />

        {/* Peak: the lock is visual. Copy arrives only in the last 30%, as the turn. */}
        <Copy
          slideId="08-ten-layers"
          window={windowForLegSlice(6, 0.7, 1)}
          anchor="center"
          withEyebrow
        />

        {/* Range: ten-stream index + pinned disclosure + detail link. */}
        <div
          className="sc-copy sc-copy--lead"
          data-sc-copy
          data-sc-window={windowForLegs(STREAMS_WINDOW.startLeg, STREAMS_WINDOW.endLeg)}
          data-city-streams
        >
          <StreamsIndex />
          <p className="city-disclosure" data-city-disclosure>
            {CITY_DISCLOSURE}
          </p>
          <a data-city-experience-link href="/?view=experience">
            See every stream in detail
          </a>
        </div>

        {/* Bridge: one short lift on the way to Join. */}
        <Copy slideId="18-different" window={windowForLegSlice(8, 0.55, 1)} anchor="trail" />

        {/* Resolve: the city holds; one ask. */}
        <div
          className="sc-copy sc-copy--center"
          data-sc-copy
          data-sc-window="finale"
          data-city-copy="15-closing"
        >
          {closing.eyebrow ? <p className="sc-eyebrow">{closing.eyebrow}</p> : null}
          <h2 className="sc-display sc-display--lg">{closing.headline}</h2>
          {ctaLinks ? (
            <div className="city-cta" data-city-cta>
              <a href={ctaLinks.primary}>{closing.ctaPrimary}</a>
              <a href={ctaLinks.secondary}>{closing.ctaSecondary}</a>
            </div>
          ) : null}
          <p className="city-disclosure">{closing.disclosure}</p>
        </div>

        {/* Approved plates in the city's glass. */}
        {CITY_GLASS.map((g) => (
          <figure
            key={`${g.slideId}-${g.legIndex}`}
            className="city-glass"
            data-glass={g.slideId}
            data-leg={g.legIndex}
            data-sc-copy
            data-sc-window={windowForLegs(g.legIndex, g.legIndex)}
          >
            <img src={slideById(g.slideId).conceptSrc} alt="" decoding="async" />
          </figure>
        ))}
      </div>

      <CityStopsRail />
      <div data-sc-spacer aria-hidden="true" />
    </div>
  );
}
```

Note: `CityStopsRail`, `StreamsIndex`, and `wireGlassFocus` do not exist yet. Create minimal stubs now so this task compiles and its tests pass; Tasks 4–6 replace them with real implementations and their own tests:

```tsx
// src/city/CityStopsRail.tsx (stub — Task 4 makes it real)
export function CityStopsRail() {
  return <nav className="city-rail" aria-label="City map stops" data-city-rail />;
}
```

```tsx
// src/city/StreamsIndex.tsx (stub — Task 5 makes it real)
export function StreamsIndex() {
  return <ul className="city-streams-index" data-city-streams-index />;
}
```

```ts
// src/city/glassFocus.ts (stub — Task 6 makes it real)
export function wireGlassFocus(
  _root: HTMLElement | null,
  _streams: { startLeg: number; endLeg: number },
): () => void {
  return () => {};
}
```

- [ ] **Step 6: Run tests**

Run: `npx vitest run src/city/CityFlightShell.test.tsx`
Expected: PASS. If the engine import breaks under vitest, confirm the `MODE === "test"` guard runs before the dynamic import.

- [ ] **Step 7: Full check + commit**

Run: `npm test && npm run lint && npm run build`
Expected: all clean (existing suites untouched).

```bash
git add src/city/ 
git commit -m "feat(city): CityFlightShell — worldflight markup, engine vendor, SuperPatch theme"
```

---

### Task 4: Map stops rail

**Files:**
- Modify: `src/city/CityStopsRail.tsx` (replace stub)
- Test: `src/city/CityStopsRail.test.tsx`

**Interfaces:**
- Consumes: `CITY_STOPS`, `stopScrollY` from `../data/cityFlight`; the engine's `sc:waypoint` CustomEvent (`detail: { index, count, label, el, progress }`) and per-leg `data-sc-waypoint` labels.
- Produces: `<CityStopsRail />` — five buttons, `aria-current="true"` follows waypoints, click scrolls to `stopScrollY(legIndex, innerHeight)`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/city/CityStopsRail.test.tsx
import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CityStopsRail } from "./CityStopsRail";
import { CITY_STOPS, stopScrollY } from "../data/cityFlight";

describe("CityStopsRail", () => {
  it("renders the five stops in flight order with no counter text", () => {
    const { getAllByRole } = render(<CityStopsRail />);
    const buttons = getAllByRole("button");
    expect(buttons.map((b) => b.textContent)).toEqual([
      "Era", "Opportunity", "Skyline", "Streams", "Join",
    ]);
  });

  it("tracks aria-current from sc:waypoint events", () => {
    const { getAllByRole } = render(<CityStopsRail />);
    act(() => {
      window.dispatchEvent(
        new CustomEvent("sc:waypoint", {
          detail: { index: CITY_STOPS[2].legIndex, count: 10, label: "Skyline" },
        }),
      );
    });
    const buttons = getAllByRole("button");
    expect(buttons[2].getAttribute("aria-current")).toBe("true");
    expect(buttons[0].getAttribute("aria-current")).toBe("false");
  });

  it("marks the nearest earlier stop for a leg between stops", () => {
    const { getAllByRole } = render(<CityStopsRail />);
    act(() => {
      window.dispatchEvent(
        new CustomEvent("sc:waypoint", { detail: { index: 4, count: 10, label: "" } }),
      );
    });
    // leg 4 sits between Opportunity (leg 1) and Skyline (leg 5).
    expect(getAllByRole("button")[1].getAttribute("aria-current")).toBe("true");
  });

  it("scrolls to the stop's track position on click", () => {
    const scrollTo = vi.fn();
    vi.stubGlobal("scrollTo", scrollTo);
    const { getAllByRole } = render(<CityStopsRail />);
    fireEvent.click(getAllByRole("button")[2]);
    expect(scrollTo).toHaveBeenCalledWith({
      top: stopScrollY(CITY_STOPS[2].legIndex, window.innerHeight),
      behavior: "smooth",
    });
    vi.unstubAllGlobals();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/city/CityStopsRail.test.tsx`
Expected: FAIL — stub renders no buttons.

- [ ] **Step 3: Implement**

```tsx
// src/city/CityStopsRail.tsx
// Five map stops. The engine renders no rail; it publishes sc:waypoint and we
// build the navigation in the page (worldflight contract).
import { useEffect, useState } from "react";
import { CITY_STOPS, stopScrollY } from "../data/cityFlight";

/** Index into CITY_STOPS of the stop that owns a given leg. */
export function activeStopForLeg(legIndex: number): number {
  let active = 0;
  CITY_STOPS.forEach((stop, i) => {
    if (legIndex >= stop.legIndex) active = i;
  });
  return active;
}

export function CityStopsRail() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onWaypoint = (e: Event) => {
      const detail = (e as CustomEvent<{ index: number }>).detail;
      if (typeof detail?.index === "number") setActive(activeStopForLeg(detail.index));
    };
    window.addEventListener("sc:waypoint", onWaypoint);
    return () => window.removeEventListener("sc:waypoint", onWaypoint);
  }, []);

  return (
    <nav className="city-rail" aria-label="City map stops" data-city-rail>
      {CITY_STOPS.map((stop, i) => (
        <button
          key={stop.id}
          type="button"
          aria-current={i === active ? "true" : "false"}
          onClick={() =>
            window.scrollTo({
              top: stopScrollY(stop.legIndex, window.innerHeight),
              behavior: "smooth",
            })
          }
        >
          {stop.label}
        </button>
      ))}
    </nav>
  );
}
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/city/CityStopsRail.test.tsx src/city/CityFlightShell.test.tsx`
Expected: PASS (shell test still green — rail buttons add no counter-pattern text).

- [ ] **Step 5: Commit**

```bash
git add src/city/CityStopsRail.tsx src/city/CityStopsRail.test.tsx
git commit -m "feat(city): map stops rail — five stops, waypoint tracking, smooth jumps"
```

---

### Task 5: Ten-stream lighting index

**Files:**
- Modify: `src/city/StreamsIndex.tsx` (replace stub)
- Test: `src/city/StreamsIndex.test.tsx`

**Interfaces:**
- Consumes: `streamsIndexLabels()` from `../data/cityFlight`.
- Produces: `<StreamsIndex />` — a `ul[data-city-streams-index]` of ten `li`, each with `style="--i: <n>"` consumed by the pure-CSS lighting rule already in `city.css`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/city/StreamsIndex.test.tsx
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StreamsIndex } from "./StreamsIndex";
import { INCOME_STREAMS } from "../data/streamIndex";

describe("StreamsIndex", () => {
  it("renders the ten stream shortLabels verbatim, in stack order", () => {
    const { container } = render(<StreamsIndex />);
    const items = [...container.querySelectorAll("li")];
    expect(items.map((li) => li.textContent)).toEqual(
      INCOME_STREAMS.map((s) => s.shortLabel),
    );
  });

  it("gives each item its lighting index --i", () => {
    const { container } = render(<StreamsIndex />);
    const items = [...container.querySelectorAll<HTMLElement>("li")];
    items.forEach((li, i) => {
      expect(li.style.getPropertyValue("--i")).toBe(String(i));
    });
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/city/StreamsIndex.test.tsx`
Expected: FAIL — stub renders an empty list.

- [ ] **Step 3: Implement**

```tsx
// src/city/StreamsIndex.tsx
// The ten income streams as a lighting index. Pure CSS lights each item off the
// engine's --sc-seg / --sc-segp track variables (see .city-streams-index in city.css);
// this component only supplies labels and indices.
import type { CSSProperties } from "react";
import { streamsIndexLabels } from "../data/cityFlight";

export function StreamsIndex() {
  return (
    <ul className="city-streams-index" data-city-streams-index>
      {streamsIndexLabels().map((label, i) => (
        <li key={label + i} style={{ "--i": String(i) } as CSSProperties}>
          {label}
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/city/StreamsIndex.test.tsx src/city/CityFlightShell.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/city/StreamsIndex.tsx src/city/StreamsIndex.test.tsx
git commit -m "feat(city): ten-stream lighting index from streamIndex SSOT"
```

---

### Task 6: Signature move — glass focus + verify state

**Files:**
- Modify: `src/city/glassFocus.ts` (replace stub)
- Test: `src/city/glassFocus.test.ts`

**Interfaces:**
- Consumes: engine CSS vars `--sc-seg` / `--sc-segp` on `document.documentElement`; glass figures `figure[data-glass][data-leg]` inside the layer.
- Produces: `wireGlassFocus(root, streams): () => void` (already called by the shell); pure helpers `glassVerifyState(seg, segp, focusedId): string` and `streamsProgress(seg, segp, startLeg, endLeg): number`. Side effects on the `[data-city-glass-layer]` element: `data-sc-verify-state` (for the shoot harness), `data-city-focus` + per-figure `data-focused`, and `--city-streams-p`.

- [ ] **Step 1: Write the failing test**

```ts
// src/city/glassFocus.test.ts
import { describe, expect, it } from "vitest";
import { glassVerifyState, streamsProgress, wireGlassFocus } from "./glassFocus";

describe("glassVerifyState", () => {
  it("renders a compact painted-state signature", () => {
    expect(glassVerifyState(3, 0.418, "00c-ceo")).toBe("seg:3|p:0.42|focus:00c-ceo");
    expect(glassVerifyState(0, 0, null)).toBe("seg:0|p:0.00|focus:none");
  });
});

describe("streamsProgress", () => {
  it("is 0 before the streams legs and 1 after them", () => {
    expect(streamsProgress(6, 0.9, 7, 8)).toBe(0);
    expect(streamsProgress(9, 0.2, 7, 8)).toBe(1);
  });
  it("ramps linearly across the streams legs", () => {
    expect(streamsProgress(7, 0, 7, 8)).toBe(0);
    expect(streamsProgress(8, 0, 7, 8)).toBeCloseTo(0.5, 5);
    expect(streamsProgress(8, 1, 7, 8)).toBe(1);
  });
});

describe("wireGlassFocus", () => {
  it("marks a glass figure focused on focusin and clears on focusout", () => {
    const root = document.createElement("div");
    root.innerHTML = `
      <div data-city-glass-layer>
        <figure class="city-glass" data-glass="00c-ceo" data-leg="3" tabindex="0"></figure>
        <figure class="city-glass" data-glass="02-world" data-leg="4" tabindex="0"></figure>
      </div>`;
    document.body.appendChild(root);
    const unwire = wireGlassFocus(root, { startLeg: 7, endLeg: 8 });
    const layer = root.querySelector<HTMLElement>("[data-city-glass-layer]")!;
    const fig = root.querySelector<HTMLElement>('figure[data-glass="00c-ceo"]')!;

    fig.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    expect(layer.getAttribute("data-city-focus")).toBe("00c-ceo");
    expect(fig.getAttribute("data-focused")).toBe("true");

    fig.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
    expect(layer.getAttribute("data-city-focus")).toBeNull();
    expect(fig.getAttribute("data-focused")).toBe("false");

    unwire();
    root.remove();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/city/glassFocus.test.ts`
Expected: FAIL — stub exports only a no-op `wireGlassFocus`.

- [ ] **Step 3: Implement**

```ts
// src/city/glassFocus.ts
// Signature move: the plate in the glass you are on comes into focus. Driven off
// the engine's --sc-seg/--sc-segp and pointer/keyboard focus. Publishes
// data-sc-verify-state so the shoot harness can see the painted state
// (verify.md: bespoke fixed layers must report what they render).

export function glassVerifyState(
  seg: number,
  segp: number,
  focusedId: string | null,
): string {
  return `seg:${seg}|p:${segp.toFixed(2)}|focus:${focusedId ?? "none"}`;
}

export function streamsProgress(
  seg: number,
  segp: number,
  startLeg: number,
  endLeg: number,
): number {
  const span = endLeg - startLeg + 1;
  return Math.min(1, Math.max(0, (seg - startLeg + segp) / span));
}

export function wireGlassFocus(
  root: HTMLElement | null,
  streams: { startLeg: number; endLeg: number },
): () => void {
  if (!root) return () => {};
  const layer = root.querySelector<HTMLElement>("[data-city-glass-layer]");
  if (!layer) return () => {};

  let focusedId: string | null = null;
  let raf = 0;

  const figures = () =>
    layer.querySelectorAll<HTMLElement>("figure[data-glass]");

  const setFocus = (id: string | null) => {
    focusedId = id;
    if (id) layer.setAttribute("data-city-focus", id);
    else layer.removeAttribute("data-city-focus");
    figures().forEach((f) =>
      f.setAttribute("data-focused", String(f.dataset.glass === id)),
    );
  };

  const glassIdFrom = (target: EventTarget | null): string | null =>
    target instanceof Element
      ? (target.closest("figure[data-glass]") as HTMLElement | null)?.dataset
          .glass ?? null
      : null;

  const onFocusIn = (e: Event) => {
    const id = glassIdFrom(e.target);
    if (id) setFocus(id);
  };
  const onFocusOut = () => setFocus(null);
  const onPointerOver = (e: Event) => {
    const id = glassIdFrom(e.target);
    if (id !== focusedId) setFocus(id);
  };

  const paintState = () => {
    raf = 0;
    const cs = getComputedStyle(document.documentElement);
    const seg = Number(cs.getPropertyValue("--sc-seg")) || 0;
    const segp = Number(cs.getPropertyValue("--sc-segp")) || 0;
    layer.setAttribute("data-sc-verify-state", glassVerifyState(seg, segp, focusedId));
    layer.style.setProperty(
      "--city-streams-p",
      streamsProgress(seg, segp, streams.startLeg, streams.endLeg).toFixed(3),
    );
  };
  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(paintState);
  };

  layer.addEventListener("focusin", onFocusIn);
  layer.addEventListener("focusout", onFocusOut);
  layer.addEventListener("pointerover", onPointerOver);
  window.addEventListener("scroll", onScroll, { passive: true });
  paintState();

  return () => {
    layer.removeEventListener("focusin", onFocusIn);
    layer.removeEventListener("focusout", onFocusOut);
    layer.removeEventListener("pointerover", onPointerOver);
    window.removeEventListener("scroll", onScroll);
    if (raf) cancelAnimationFrame(raf);
  };
}
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/city/`
Expected: PASS (all city suites).

- [ ] **Step 5: Commit**

```bash
git add src/city/glassFocus.ts src/city/glassFocus.test.ts
git commit -m "feat(city): glass focus signature + harness verify-state + streams progress"
```

---

### Task 7: Route `?view=city`

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx` (add one test; do not change existing assertions)

**Interfaces:**
- Consumes: `CityFlightShell` from `./city/CityFlightShell`.
- Produces: `?view=city` renders `[data-city-flight]`. Default (`/`) behavior unchanged in this task.

- [ ] **Step 1: Add the failing test** (append inside the existing describe block)

```tsx
  it("opens the neon-city worldflight via ?view=city", () => {
    vi.stubGlobal("location", {
      ...window.location,
      search: "?view=city",
    });
    const { container } = render(<App />);
    expect(container.querySelector("[data-city-flight]")).toBeTruthy();
    expect(container.querySelector("[data-experience-shell]")).toBeNull();
    expect(container.querySelector(".deck-shell")).toBeNull();
  });
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/App.test.tsx`
Expected: the new test FAILS (unknown view falls through to experience); existing tests PASS.

- [ ] **Step 3: Wire the route**

```tsx
// src/App.tsx — replace the whole file
import { DeckShell } from "./components/DeckShell";
import { ExperienceShell } from "./components/experience/ExperienceShell";
import { Hero3dPreview } from "./components/Hero3dPreview";
import { CityFlightShell } from "./city/CityFlightShell";
import "./components/deck.css";

type AppView = "legacy" | "hero3d" | "experience" | "city";

function useAppView(): AppView {
  if (typeof window === "undefined") return "experience";
  const params = new URLSearchParams(window.location.search);
  const view = params.get("view");
  if (view === "legacy" || view === "static") return "legacy";
  if (view === "hero3d") return "hero3d";
  if (view === "city") return "city";
  return "experience";
}

export default function App() {
  const view = useAppView();
  if (view === "legacy") return <DeckShell />;
  if (view === "hero3d") return <Hero3dPreview />;
  if (view === "city") return <CityFlightShell />;
  return <ExperienceShell />;
}
```

- [ ] **Step 4: Run the full unit suite**

Run: `npm test`
Expected: PASS — including every pre-existing App/experience test.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/App.test.tsx
git commit -m "feat(city): route neon-city worldflight behind ?view=city"
```

---

### Task 8: Browser tests (Playwright + axe)

**Files:**
- Create: `e2e/city.spec.ts`

**Interfaces:**
- Consumes: the built app (`npm run test:e2e` builds with stub HTTPS env), `[data-city-flight]`, `--sc-seg` on `:root`, `[data-city-rail]` buttons.
- Produces: a green `city.spec.ts` in the existing Playwright projects.

- [ ] **Step 1: Write the spec**

```ts
// e2e/city.spec.ts
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function flightSeg(page: Page): Promise<number> {
  return page.evaluate(() =>
    Number(
      getComputedStyle(document.documentElement).getPropertyValue("--sc-seg"),
    ) || 0,
  );
}

async function scrollToVh(page: Page, vh: number) {
  await page.evaluate((v) => window.scrollTo(0, window.innerHeight * v), vh);
  await page.waitForTimeout(400); // lerp settle
}

test.describe("Neon city worldflight", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/?view=city");
    await expect(page.locator("[data-city-flight]")).toBeVisible();
  });

  test("opens on the Era headline with no counter and no scroll cue", async ({ page }) => {
    await expect(
      page.getByRole("heading", { level: 1, name: /Join the SuperPatch Era\./ }),
    ).toBeVisible();
    await expect(page.getByText(/\d{2}\s*\/\s*\d{2}/)).toHaveCount(0);
    await expect(page.getByText(/scroll to explore/i)).toHaveCount(0);
  });

  test("the page has a real scroll track and the flight advances", async ({ page }) => {
    const track = await page.evaluate(
      () => document.documentElement.scrollHeight / window.innerHeight,
    );
    expect(track).toBeGreaterThan(9); // spacer = film + 1vh
    const before = await flightSeg(page);
    await scrollToVh(page, 6);
    expect(await flightSeg(page)).toBeGreaterThan(before);
  });

  test("map stops are keyboard-reachable and jump the flight", async ({ page }) => {
    const rail = page.locator("[data-city-rail]");
    await expect(rail.getByRole("button")).toHaveCount(5);
    await rail.getByRole("button", { name: "Skyline" }).click();
    await page.waitForTimeout(900);
    expect(await flightSeg(page)).toBeGreaterThanOrEqual(5);
  });

  test("disclosure is pinned through the streams window", async ({ page }) => {
    await scrollToVh(page, 8.4); // inside districts legs
    await expect(page.locator("[data-city-disclosure]")).toBeVisible();
    await expect(page.locator("[data-city-streams-index] li")).toHaveCount(10);
  });

  test("axe passes at open, peak, and close", async ({ page }) => {
    for (const vh of [0, 7, 11.5]) {
      await scrollToVh(page, vh);
      const results = await new AxeBuilder({ page })
        .disableRules(["color-contrast"]) // composited video contrast is checked by the shoot harness
        .analyze();
      expect(results.violations, `at ${vh}vh`).toEqual([]);
    }
  });
});
```

- [ ] **Step 2: Run**

Run: `npm run test:e2e -- city.spec.ts`
Expected: PASS on desktop + mobile projects. If the mobile project fails on rail visibility, the rail may need the compact treatment — fix forward by allowing the rail to collapse to a bottom strip under 900px in `city.css`:

```css
@media (max-width: 900px), (orientation: portrait) {
  .city-rail {
    top: auto;
    bottom: max(0.8rem, env(safe-area-inset-bottom));
    right: 50%;
    transform: translateX(50%);
    grid-auto-flow: column;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add e2e/city.spec.ts src/city/city.css
git commit -m "test(city): e2e flight checks + axe at open/peak/close"
```

---

### Task 9: Shoot verification, feel check, fingerprint

**Files:**
- Create: `docs/baselines/city/2026-09-XX-placeholder-flight.md`
- Create (registry, via workspace script): `scrollcraft/FINGERPRINTS.md` row

No unit tests — this task is the Scroll Craft verification pass. `SKILL` below = `/Users/cbsuperpatch/Desktop/ClaudeSkills/skills/community/scroll-craft/plugins/nateherk-design/skills/scrollcraft`.

- [ ] **Step 1: Build and serve over HTTP** (never `file://` — the Blob fetch silently falls back to posters)

```bash
npm run build:e2e
npm i -D playwright-core
node "$SKILL/scripts/serve.mjs" --root dist --port 4500 &
```

- [ ] **Step 2: Shoot three passes** (real Chrome, not bundled Chromium — no h264 in Chromium)

```bash
node "$SKILL/scripts/shoot.mjs" --url "http://localhost:4500/?view=city" --out lab/shots
node "$SKILL/scripts/shoot.mjs" --url "http://localhost:4500/?view=city" --out lab/mobile --width 390 --height 844
node "$SKILL/scripts/shoot.mjs" --url "http://localhost:4500/?view=city" --out lab/reduced --reduced-motion
```

Expected: no DEAD SCROLL, no FROZEN CLIP, no contrast failures. Fix and reshoot until green.

- [ ] **Step 3: Read the contact sheets** (`lab/*/sheet.png`) with actual eyes: does every leg advance, does the peak read as the largest visual change with the most scroll room, does the close hold instead of fading out, do glass plates land where the copy expects?

- [ ] **Step 4: Feel check** — scroll the page cold, write one word per beat, then diff against the spec's curve (quiet awe / bigger / still / trust / unease / rise / peak / possibility / lift / done). Where they disagree, change the page, not the notes.

- [ ] **Step 5: Record the baseline**

Write `docs/baselines/city/2026-09-XX-placeholder-flight.md`: shoot results per pass, the feel-check diff, what was fixed, and explicitly: **not verified on a real iPhone** (decoder, autoplay policy, Low Power Mode, touch).

- [ ] **Step 6: Append the fingerprint row**

```bash
node "$SKILL/scripts/workspace.mjs" --ensure   # prints the workspace; registry lives there
```

Append one row to `FINGERPRINTS.md`: grammar = continuous world/worldflight; nav = five map stops; hero = filmed terrace, live Era `h1`, no kinetic scrub template; act shape = one flight, 10 legs, ~11.8vh film, peak 2× via clip length; close = city holds, Join + disclosure in stage; signature = plates-in-glass focus sharpen. Confirm ≥4-of-6 difference against `descent` and `orrery` (both worldflights) per the spec's fingerprint section.

- [ ] **Step 7: Commit**

```bash
git add docs/baselines/city/ 
git commit -m "docs(city): placeholder-flight shoot baseline, feel check, fingerprint row"
```

---

### Task 10: Real city legs via kie.ai — **BLOCKED until unblocked by operator**

**Blockers:** (1) `KIE_AI_API_KEY` is not on this machine — check the Obsidian vault for it first; (2) operator approves the spend (~10 stills + ~10 clips; cents per still, more per clip).

**Files:**
- Create: `docs/orgs/superpatch/customers/affiliates/initiatives/income-stack-deck/business-idea/assets/city/STYLE-PREAMBLE.md` (the one preamble, reused verbatim)
- Overwrite: `public/city/legs/*.mp4`, `public/city/posters/*.webp` (same paths — zero code changes)

- [ ] **Step 1: Preflight**

```bash
node "$SKILL/scripts/doctor.mjs"
node "$SKILL/scripts/kie.mjs" probe
```

- [ ] **Step 2: Write the style preamble once** in `STYLE-PREAMBLE.md`, from the locked Era look: *neon night city, terrace and street level, cyan/magenta/amber signage glow, wet asphalt reflections, empty product-free dark glass storefronts and windows, no people, no readable signage, no logos, photographic, anamorphic, night.* Reuse it verbatim in every prompt.

- [ ] **Step 3: Generate leg stills, chained (seam law — Architecture A)**

Leg 1 starts from the Era look; every later leg starts from the previous leg's **encoded** last frame:

```bash
node "$SKILL/scripts/kie.mjs" still "<preamble>\n\nempty terrace overlook, quiet darker left" out/leg-01.png --ar 16:9 --ref public/concepts/clean/sp-stack-00-era.png
node "$SKILL/scripts/kie.mjs" shot "slow push forward over the terrace rail" out/leg-01.png out/leg-01-raw.mp4 --dur 5
bash "$SKILL/scripts/encode.sh" out/leg-01-raw.mp4 public/city/legs/leg-01-terrace.mp4
bash "$SKILL/scripts/encode.sh" out/leg-01-raw.mp4 public/city/legs/leg-01-terrace-m.mp4 mobile
ffmpeg -sseof -0.15 -i public/city/legs/leg-01-terrace.mp4 -frames:v 1 -q:v 2 out/chain-01.png
# leg 2 starts from chain-01.png … repeat through leg-10. Peak (leg-07) uses --dur 10.
ffmpeg -i public/city/legs/leg-01-terrace.mp4 -frames:v 1 public/city/posters/leg-01-terrace.webp
```

Look at **every** generated frame before using it. Reroll clay/cartoon/product-filled output.

- [ ] **Step 4: Verify and reshoot**

```bash
npm run verify:city-assets
```

Then repeat all of Task 9 (shoot passes, sheet read, feel check) against the real legs and update the baseline doc.

- [ ] **Step 5: Commit** (chunked push if the pack is large — this repo's remote drops very large single pushes)

```bash
git add public/city/ docs/orgs/superpatch/customers/affiliates/initiatives/income-stack-deck/business-idea/assets/city/ docs/baselines/city/
git commit -m "feat(city): real neon-city flight legs (kie.ai), seam-chained and scrub-encoded"
```

---

### Task 11: Phase 2 — flip the default front door — **GATED on operator approval after Tasks 1–9 (ideally 10) are green**

**Files:**
- Modify: `src/App.tsx` (default → city)
- Modify: `src/App.test.tsx` (default assertion)
- Modify: `e2e/experience.spec.ts` (every `goto("/")` → `goto("/?view=experience")`)
- Modify: `index.html` (title/meta + first-poster preload)
- Modify: `README.md` (routes table)

- [ ] **Step 1: Update the default-view test first**

In `src/App.test.tsx`, change the first test to:

```tsx
  it("defaults to the neon-city worldflight", () => {
    vi.stubGlobal("location", { ...window.location, search: "" });
    const { container } = render(<App />);
    expect(container.querySelector("[data-city-flight]")).toBeTruthy();
    expect(container.querySelector("[data-experience-shell]")).toBeNull();
  });

  it("keeps the 26-scene experience via ?view=experience", () => {
    vi.stubGlobal("location", { ...window.location, search: "?view=experience" });
    const { container } = render(<App />);
    expect(container.querySelector("[data-experience-shell]")).toBeTruthy();
  });
```

Run: `npx vitest run src/App.test.tsx` — expected FAIL (default still experience).

- [ ] **Step 2: Flip the default in `src/App.tsx`**

```tsx
function useAppView(): AppView {
  if (typeof window === "undefined") return "city";
  const params = new URLSearchParams(window.location.search);
  const view = params.get("view");
  if (view === "legacy" || view === "static") return "legacy";
  if (view === "hero3d") return "hero3d";
  if (view === "experience") return "experience";
  return "city";
}
```

Run: `npx vitest run src/App.test.tsx` — expected PASS.

- [ ] **Step 3: Migrate the experience e2e suite**

```bash
sed -i '' 's|page.goto("/")|page.goto("/?view=experience")|g' e2e/experience.spec.ts
rg -n 'goto\("/"\)' e2e/experience.spec.ts   # expect: no matches
```

- [ ] **Step 4: Front-door meta + LCP preload** — in `index.html` `<head>`:

```html
<title>Super Patch Income Stack — One City. Four Stacks. Ten Streams.</title>
<link rel="preload" as="image" href="/city/posters/leg-01-terrace.webp" fetchpriority="high" />
```

- [ ] **Step 5: Update `README.md`** — replace the "Default surface" paragraph: default is the neon-city worldflight (`CityFlightShell`); the 26-scene experience moves to `?view=experience`; `legacy` / `static` / `hero3d` unchanged.

- [ ] **Step 6: Full verification**

Run: `npm test && npm run lint && npm run build && npm run test:e2e`
Expected: all green, including untouched experience visual snapshots (same page under the new URL).

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx src/App.test.tsx e2e/experience.spec.ts index.html README.md
git commit -m "feat(city): neon-city worldflight becomes the front door; experience moves to ?view=experience"
```

---

## Execution notes

- Tasks 1 → 2 → 3 are sequential. Tasks 4, 5, 6 are independent of each other after 3. Task 7 needs 3; Task 8 needs 7; Task 9 needs 8.
- Task 10 is **blocked** (KIE key + spend approval). Task 11 is **gated** (operator approval). Neither starts without the operator saying so.
- Push after each committed task: `git push origin feat/neon-city-worldflight` (if the pack is huge, push in chunks — the remote has dropped single pushes near 761MB before; `gh auth switch --user makemoney2023` if the push is denied to SuperPatchAi, then switch back).
