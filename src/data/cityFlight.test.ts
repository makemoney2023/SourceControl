// src/data/cityFlight.test.ts
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  CITY_LEGS,
  CITY_PACKAGE_ACCENTS,
  CITY_PLATE_MOMENTS,
  CITY_STOPS,
  CITY_RATE,
  COPY_WINDOWS,
  STREAMS_WINDOW,
  legStartVh,
  primaryPlateSlideIdForLeg,
  slideById,
  stopScrollY,
  streamsIndexLabels,
  trackTotalVh,
  BRIDGE_WINDOWS,
  RANGE_STREAMS_WINDOW,
  RANGE_TEN_LAYERS_WINDOW,
  windowAcross,
  windowForLegs,
  windowForLegSlice,
} from "./cityFlight";
import { SLIDES } from "./slides";
import { INCOME_STREAMS } from "./streamIndex";

const slideIds = new Set(SLIDES.map((s) => s.id));

/** Story order for copy sequencing checks. */
const COPY_SEQUENCE = SLIDES.map((s) => s.id);

function windowParts(win: string): [number, number, number, number] {
  const [from, to, rin, rout] = win.split(" ").map(Number);
  return [from!, to!, rin!, rout!];
}

function windowMidpoint(win: string): number {
  const [from, to] = windowParts(win);
  return (from + to) / 2;
}

/** Track-fraction span for a leg index. */
function legTrackSpan(legIndex: number): [number, number] {
  const total = trackTotalVh();
  const from = legStartVh(legIndex) / total;
  const to = (legStartVh(legIndex) + CITY_LEGS[legIndex]!.weight) / total;
  return [from, to];
}

const legIndexById = new Map(CITY_LEGS.map((l, i) => [l.id, i]));
const momentBySlide = new Map(CITY_PLATE_MOMENTS.map((m) => [m.slideId, m]));

/** Sub-slice on a leg for slide index i of n slides (story order within leg). */
function legSubSlice(
  legIndex: number,
  slideIndexOnLeg: number,
  slideCountOnLeg: number,
): [number, number] {
  const [legFrom, legTo] = legTrackSpan(legIndex);
  const width = legTo - legFrom;
  const from = legFrom + (slideIndexOnLeg / slideCountOnLeg) * width;
  const to = legFrom + ((slideIndexOnLeg + 1) / slideCountOnLeg) * width;
  return [from, to];
}

/** Slides grouped by leg in deck story order. */
function slidesPerLegInStoryOrder(): Map<string, string[]> {
  const perLeg = new Map<string, string[]>();
  for (const slide of SLIDES) {
    const legId = momentBySlide.get(slide.id)!.legId;
    const list = perLeg.get(legId) ?? [];
    list.push(slide.id);
    perLeg.set(legId, list);
  }
  return perLeg;
}

describe("cityFlight legs", () => {
  it("maps every placeholder plate to a real slide", () => {
    for (const leg of CITY_LEGS) {
      expect(slideIds.has(leg.placeholderPlateOf), leg.id).toBe(true);
      expect(leg.src).toBe(`/city/legs/${leg.id}.mp4`);
      expect(leg.srcMobile).toBe(`/city/legs/${leg.id}-m.mp4`);
      expect(leg.poster).toBe(`/city/posters/${leg.id}.webp`);
    }
  });

  it("resolves each leg's primary plate moment in story order (Era fallback)", () => {
    expect(primaryPlateSlideIdForLeg("leg-01-terrace")).toBe("00-era");
    expect(primaryPlateSlideIdForLeg("leg-11-market-brand")).toBe("05c-market");
    expect(primaryPlateSlideIdForLeg("leg-14-districts-a")).toBe("07-retail");
    expect(primaryPlateSlideIdForLeg("leg-17-bridge")).toBe("17-compounding");
    expect(primaryPlateSlideIdForLeg("leg-18-hold")).toBe("15-closing");
    expect(primaryPlateSlideIdForLeg("nope-leg")).toBe("00-era");
    for (const leg of CITY_LEGS) {
      expect(slideIds.has(primaryPlateSlideIdForLeg(leg.id)), leg.id).toBe(true);
    }
  });

  it("holds one pace across the whole flight (pace law)", () => {
    for (const leg of CITY_LEGS) {
      expect(Math.abs(leg.weight / leg.clipSeconds - CITY_RATE), leg.id).toBeLessThan(0.005);
    }
  });

  it("makes the skyline lock the only 10s leg and ~2x every other leg", () => {
    const peak = CITY_LEGS.find((l) => l.id === "leg-08-skyline-lock");
    expect(peak?.clipSeconds).toBe(10);
    for (const leg of CITY_LEGS) {
      if (leg.id === "leg-08-skyline-lock") continue;
      expect(peak!.weight / leg.weight).toBeGreaterThanOrEqual(1.9);
    }
  });

  it("keeps the film inside the 16-22vh band", () => {
    expect(trackTotalVh()).toBeGreaterThanOrEqual(16);
    expect(trackTotalVh()).toBeLessThanOrEqual(22);
  });
});

describe("cityFlight plate moments and packages", () => {
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
    const legIds = new Set(CITY_LEGS.map((l) => l.id));
    for (const pkg of CITY_PACKAGE_ACCENTS) {
      expect(legIds.has(pkg.legId), pkg.id).toBe(true);
      expect(pkg.src).toMatch(/^\/concepts\//);
    }
  });

  it("package accent src paths exist under public/", () => {
    const publicRoot = join(process.cwd(), "public");
    for (const pkg of CITY_PACKAGE_ACCENTS) {
      expect(existsSync(join(publicRoot, pkg.src.slice(1))), pkg.src).toBe(true);
    }
  });
});

describe("cityFlight copy windows", () => {
  it("exports a copy window for every slide", () => {
    for (const s of SLIDES) {
      expect(COPY_WINDOWS[s.id]?.split(" ").length).toBe(4);
    }
  });

  it("sequences 05-product immediately before 05b-science", () => {
    const productIdx = COPY_SEQUENCE.indexOf("05-product");
    const scienceIdx = COPY_SEQUENCE.indexOf("05b-science");
    expect(scienceIdx).toBe(productIdx + 1);
    const [, productTo] = windowParts(COPY_WINDOWS["05-product"]!);
    const [scienceFrom] = windowParts(COPY_WINDOWS["05b-science"]!);
    expect(scienceFrom).toBeLessThan(productTo);
    expect(productTo - scienceFrom).toBeLessThan(0.03);
  });

  it("keeps adjacent copy plateaus from long dual-hold", () => {
    for (let i = 0; i < COPY_SEQUENCE.length - 1; i++) {
      const [, prevTo] = windowParts(COPY_WINDOWS[COPY_SEQUENCE[i]!]!);
      const [nextFrom] = windowParts(COPY_WINDOWS[COPY_SEQUENCE[i + 1]!]!);
      expect(nextFrom).toBeLessThan(prevTo);
      expect(prevTo - nextFrom).toBeLessThan(0.03);
    }
  });

  it("does not export CITY_GLASS", async () => {
    const mod = await import("./cityFlight");
    expect("CITY_GLASS" in mod).toBe(false);
  });

  it("places each copy window midpoint on its plate moment leg (or sub-slice)", () => {
    const perLeg = slidesPerLegInStoryOrder();
    for (const slide of SLIDES) {
      const moment = momentBySlide.get(slide.id)!;
      const legIndex = legIndexById.get(moment.legId)!;
      const slidesOnLeg = perLeg.get(moment.legId)!;
      const idxOnLeg = slidesOnLeg.indexOf(slide.id);
      const [subFrom, subTo] = legSubSlice(legIndex, idxOnLeg, slidesOnLeg.length);
      const [legFrom, legTo] = legTrackSpan(legIndex);
      const [from, to] = windowParts(COPY_WINDOWS[slide.id]!);
      const mid = windowMidpoint(COPY_WINDOWS[slide.id]!);
      const midOnLeg = mid >= subFrom - 1e-9 && mid <= subTo + 1e-9;
      const spanOnLeg = from >= legFrom - 1e-9 && to <= legTo + 1e-9;
      expect(midOnLeg || spanOnLeg, slide.id).toBe(true);
    }
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
    expect(rin).toBe(0.08);
    expect(rout).toBe(0.08);
  });

  it("windowForLegSlice stays inside its leg", () => {
    const whole = windowForLegs(7, 7).split(" ").map(Number);
    const slice = windowForLegSlice(7, 0.7, 1).split(" ").map(Number);
    expect(slice[0]).toBeGreaterThanOrEqual(whole[0]!);
    expect(slice[1]).toBeLessThanOrEqual(whole[1]! + 1e-9);
  });

  it("sequences Range so ten-layers yields before streams owns the band", () => {
    const tenTo = Number(RANGE_TEN_LAYERS_WINDOW.split(" ")[1]);
    const streamsFrom = Number(RANGE_STREAMS_WINDOW.split(" ")[0]);
    const streamsTo = Number(RANGE_STREAMS_WINDOW.split(" ")[1]);
    const bridgeFrom = Number(BRIDGE_WINDOWS.compounding.split(" ")[0]);
    expect(streamsFrom).toBeLessThan(tenTo);
    expect(tenTo - streamsFrom).toBeLessThan(0.03);
    expect(bridgeFrom).toBeGreaterThanOrEqual(streamsTo - 0.02);
  });

  it("windowAcross spans fractional positions across legs", () => {
    const tenLeg = STREAMS_WINDOW.startLeg;
    const [from, to] = windowAcross(tenLeg, 0.45, tenLeg + 1, 0.42)
      .split(" ")
      .map(Number);
    const legA = windowForLegs(tenLeg, tenLeg).split(" ").map(Number);
    const legB = windowForLegs(tenLeg + 1, tenLeg + 1).split(" ").map(Number);
    expect(from).toBeGreaterThan(legA[0]!);
    expect(from).toBeLessThan(legA[1]!);
    expect(to).toBeGreaterThan(legB[0]!);
    expect(to).toBeLessThan(legB[1]!);
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

describe("cityFlight streams", () => {
  it("streams window covers the district legs", () => {
    expect(STREAMS_WINDOW.startLeg).toBeLessThan(STREAMS_WINDOW.endLeg);
    expect(STREAMS_WINDOW.startLeg).toBeGreaterThanOrEqual(0);
    expect(STREAMS_WINDOW.endLeg).toBeLessThan(CITY_LEGS.length);
  });

  it("streams index labels are the ten shortLabels verbatim", () => {
    expect(streamsIndexLabels()).toEqual(INCOME_STREAMS.map((s) => s.shortLabel));
  });

  it("slideById throws on unknown id", () => {
    expect(() => slideById("nope")).toThrow(/nope/);
  });
});
