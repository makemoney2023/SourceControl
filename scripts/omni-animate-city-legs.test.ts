import { describe, expect, it } from "vitest";

import {
  CITY_OMNI_LEGS,
  STYLE_PREAMBLE,
  buildDesktopArgs,
  buildMobileArgs,
  buildPrompt,
  expandForcedLegIds,
  startFramePath,
} from "./omni-animate-city-legs.mjs";

describe("city Omni generation contract", () => {
  it("matches the ten declared city legs and peak duration", () => {
    expect(CITY_OMNI_LEGS.map(({ id, clipSeconds }) => [id, clipSeconds])).toEqual([
      ["leg-01-terrace", 5],
      ["leg-02-title-glass", 5],
      ["leg-03-overlook", 5],
      ["leg-04-street", 5],
      ["leg-05-windows", 5],
      ["leg-06-ascent", 5],
      ["leg-07-skyline-lock", 10],
      ["leg-08-districts-a", 5],
      ["leg-09-districts-b", 5],
      ["leg-10-hold", 5],
    ]);
  });

  it("starts every prompt with the shared preamble and continues the flight", () => {
    for (const leg of CITY_OMNI_LEGS) {
      const prompt = buildPrompt(leg);
      expect(prompt.startsWith(STYLE_PREAMBLE)).toBe(true);
      expect(prompt).not.toContain("palette only");
      expect(prompt).not.toContain("Do not continue the previous camera move");
    }
  });

  it("makes the peak aerial and the final hold visually empty", () => {
    expect(buildPrompt(CITY_OMNI_LEGS[6])).toContain("open aerial skyline");
    expect(buildPrompt(CITY_OMNI_LEGS[8])).toContain("blank abstract color");
    expect(buildPrompt(CITY_OMNI_LEGS[9])).toContain("unmarked surfaces");
    expect(buildPrompt(CITY_OMNI_LEGS[9])).toContain("dark unbroken reflective glass");
  });

  it("uses the Era plate first and the previous encoded leg thereafter", () => {
    expect(startFramePath(0)).toMatch(/public\/concepts\/clean\/sp-stack-00-era\.png$/);
    expect(startFramePath(1)).toMatch(/out\/city-chain\/leg-01-terrace\.png$/);
    expect(startFramePath(9)).toMatch(/out\/city-chain\/leg-09-districts-b\.png$/);
  });

  it("expands mid-chain --force to include all successor legs", () => {
    expect([...expandForcedLegIds(new Set(["leg-07-skyline-lock"]))]).toEqual([
      "leg-07-skyline-lock",
      "leg-08-districts-a",
      "leg-09-districts-b",
      "leg-10-hold",
    ]);

    const fromFive = expandForcedLegIds(new Set(["leg-05-windows"]));
    expect(fromFive.has("leg-04-street")).toBe(false);
    expect(fromFive.has("leg-06-ascent")).toBe(true);
    expect(fromFive.has("leg-10-hold")).toBe(true);

    expect(expandForcedLegIds(new Set())).toEqual(new Set());
  });

  it("builds dense-GOP desktop and mobile scrub encodes", () => {
    const desktop = buildDesktopArgs(CITY_OMNI_LEGS[0], "raw.mp4", "desktop.mp4");
    expect(desktop).toEqual(expect.arrayContaining(["-g", "8", "-an", "desktop.mp4"]));
    expect(desktop.join(" ")).toContain("1920:1080");

    const peak = buildDesktopArgs(CITY_OMNI_LEGS[6], "raw.mp4", "desktop.mp4");
    expect(peak.join(" ")).toContain("setpts=1.25*PTS");
    expect(peak).toEqual(expect.arrayContaining(["-t", "10"]));

    const mobile = buildMobileArgs("desktop.mp4", "mobile.mp4");
    expect(mobile).toEqual(expect.arrayContaining(["-g", "4", "mobile.mp4"]));
    expect(mobile.join(" ")).toContain("crop=ih*9/16:ih");
    expect(mobile.join(" ")).toContain("scale=720:1280");
  });
});
