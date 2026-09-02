import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import {
  CITY_OMNI_LEGS,
  STYLE_PREAMBLE,
  SUPERPATCH_LOGO,
  buildDesktopArgs,
  buildMobileArgs,
  buildPrompt,
  expandForcedLegIds,
  referencePathsForLeg,
  resolvePublicPath,
  startFramePath,
} from "./omni-animate-city-legs.mjs";
import {
  CITY_LEGS,
  CITY_PACKAGE_ACCENTS,
  CITY_PLATE_MOMENTS,
  slideById,
} from "../src/data/cityFlight";

const APP = resolve(import.meta.dirname, "..");

describe("city Omni generation contract", () => {
  it("style preamble allows SuperPatch logo and packages", () => {
    expect(STYLE_PREAMBLE.toLowerCase()).not.toMatch(/no logos/);
    expect(STYLE_PREAMBLE.toLowerCase()).toMatch(/superpatch|logo/);
    expect(STYLE_PREAMBLE.toLowerCase()).toMatch(/package|product/);
  });

  it("omni legs align with CITY_LEGS ids and clipSeconds", async () => {
    expect(CITY_OMNI_LEGS.map((l) => l.id)).toEqual(CITY_LEGS.map((l) => l.id));
    expect(CITY_OMNI_LEGS.map((l) => l.clipSeconds)).toEqual(
      CITY_LEGS.map((l) => l.clipSeconds),
    );
  });

  it("starts every prompt with the shared preamble and plate-aware moves", () => {
    for (const leg of CITY_OMNI_LEGS) {
      const refs = referencePathsForLeg(
        CITY_OMNI_LEGS.findIndex((entry) => entry.id === leg.id),
        leg,
      );
      const prompt = buildPrompt(leg, STYLE_PREAMBLE, refs);
      expect(prompt.startsWith(STYLE_PREAMBLE)).toBe(true);
      expect(prompt).toContain("<FIRST_FRAME>");
      expect(prompt).not.toContain("product-free");
      expect(prompt).not.toContain("Do not continue the previous camera move");
    }
  });

  it("grounds each plate moment on slide conceptSrc under public/", () => {
    for (const moment of CITY_PLATE_MOMENTS) {
      const leg = CITY_OMNI_LEGS.find((entry) => entry.id === moment.legId);
      expect(leg, moment.slideId).toBeDefined();
      const conceptPath = resolvePublicPath(slideById(moment.slideId).conceptSrc);
      expect(existsSync(conceptPath), conceptPath).toBe(true);
      expect(leg!.move.toLowerCase()).toContain(moment.note.toLowerCase().slice(0, 12));
    }
  });

  it("reveals the SuperPatch logo on leg 1 and keeps VTT beats consecutive", () => {
    const legOne = CITY_OMNI_LEGS[0]!;
    const legOneRefs = referencePathsForLeg(0, legOne);
    expect(legOne.id).toBe("leg-01-terrace");
    expect(legOneRefs).toContain(SUPERPATCH_LOGO);
    expect(buildPrompt(legOne, STYLE_PREAMBLE, legOneRefs).toLowerCase()).toMatch(
      /logo|superpatch/,
    );

    const productIdx = CITY_OMNI_LEGS.findIndex((leg) => leg.id === "leg-09-product");
    const scienceIdx = CITY_OMNI_LEGS.findIndex((leg) => leg.id === "leg-10-science");
    expect(productIdx).toBe(8);
    expect(scienceIdx).toBe(9);
    expect(buildPrompt(CITY_OMNI_LEGS[productIdx]!, STYLE_PREAMBLE).toLowerCase()).toMatch(
      /product|vtt/,
    );
    expect(buildPrompt(CITY_OMNI_LEGS[scienceIdx]!, STYLE_PREAMBLE).toLowerCase()).toMatch(
      /science|vtt/,
    );
  });

  it("uses the Era plate first and the previous encoded leg thereafter", () => {
    expect(startFramePath(0)).toMatch(/public\/concepts\/clean\/sp-stack-00-era\.png$/);
    expect(startFramePath(1)).toMatch(/out\/city-chain\/leg-01-terrace\.png$/);
    expect(startFramePath(17)).toMatch(/out\/city-chain\/leg-17-bridge\.png$/);
  });

  it("expands mid-chain --force to include all successor legs", () => {
    expect([...expandForcedLegIds(new Set(["leg-08-skyline-lock"]))]).toEqual([
      "leg-08-skyline-lock",
      "leg-09-product",
      "leg-10-science",
      "leg-11-market-brand",
      "leg-12-development",
      "leg-13-ten-layers",
      "leg-14-districts-a",
      "leg-15-districts-b",
      "leg-16-districts-c",
      "leg-17-bridge",
      "leg-18-hold",
    ]);

    const fromFive = expandForcedLegIds(new Set(["leg-05-windows"]));
    expect(fromFive.has("leg-04-street")).toBe(false);
    expect(fromFive.has("leg-06-ascent")).toBe(true);
    expect(fromFive.has("leg-18-hold")).toBe(true);

    expect(expandForcedLegIds(new Set())).toEqual(new Set());
  });

  it("builds dense-GOP desktop and mobile scrub encodes", () => {
    const desktop = buildDesktopArgs(CITY_OMNI_LEGS[0], "raw.mp4", "desktop.mp4");
    expect(desktop).toEqual(expect.arrayContaining(["-g", "8", "-an", "desktop.mp4"]));
    expect(desktop.join(" ")).toContain("1920:1080");

    const peak = buildDesktopArgs(CITY_OMNI_LEGS[7], "raw.mp4", "desktop.mp4");
    expect(peak.join(" ")).toContain("setpts=1.25*PTS");
    expect(peak).toEqual(expect.arrayContaining(["-t", "10"]));

    const mobile = buildMobileArgs("desktop.mp4", "mobile.mp4");
    expect(mobile).toEqual(expect.arrayContaining(["-g", "4", "mobile.mp4"]));
    expect(mobile.join(" ")).toContain("crop=ih*9/16:ih");
    expect(mobile.join(" ")).toContain("scale=720:1280");
  });

  it("includes package accent refs on assigned legs only", () => {
    for (const accent of CITY_PACKAGE_ACCENTS) {
      const index = CITY_OMNI_LEGS.findIndex((leg) => leg.id === accent.legId);
      expect(index).toBeGreaterThanOrEqual(0);
      const refs = referencePathsForLeg(index, CITY_OMNI_LEGS[index]!);
      expect(refs).toContain(resolvePublicPath(accent.src));
      expect(existsSync(resolvePublicPath(accent.src))).toBe(true);
    }
  });
});
