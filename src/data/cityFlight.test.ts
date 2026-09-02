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
