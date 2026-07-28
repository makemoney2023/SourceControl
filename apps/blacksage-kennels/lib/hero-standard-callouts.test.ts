import { describe, expect, it } from "vitest";
import { HERO_STANDARD_CALLOUTS } from "@/lib/hero-standard-callouts";

describe("HERO_STANDARD_CALLOUTS", () => {
  it("maps five ADRK/FCI body standards", () => {
    expect(HERO_STANDARD_CALLOUTS.map((c) => c.id)).toEqual([
      "head",
      "temperament",
      "markings",
      "structure",
      "tail",
    ]);
  });

  it("keeps anchors inside the frame and links to health education", () => {
    for (const c of HERO_STANDARD_CALLOUTS) {
      expect(c.x).toBeGreaterThanOrEqual(0);
      expect(c.x).toBeLessThanOrEqual(100);
      expect(c.y).toBeGreaterThanOrEqual(0);
      expect(c.y).toBeLessThanOrEqual(100);
      expect(c.href.startsWith("/health")).toBe(true);
    }
  });
});
