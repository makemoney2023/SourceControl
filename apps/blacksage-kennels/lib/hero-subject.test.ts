import { describe, expect, it } from "vitest";
import {
  HERO_DOG_NAME,
  HERO_POSTER_ALT,
  HERO_POSTER_PATH,
} from "@/lib/hero-subject";

describe("hero subject (operator asset)", () => {
  it("names Shadow Vom Blacksage as the hero subject", () => {
    expect(HERO_DOG_NAME).toBe("Shadow Vom Blacksage");
  });

  it("points poster path at the cutout asset", () => {
    expect(HERO_POSTER_PATH).toBe("/images/shadow-vom-blacksage-cutout.png");
  });

  it("keeps accessible alt text kennel-specific", () => {
    expect(HERO_POSTER_ALT).toContain("Shadow Vom Blacksage");
    expect(HERO_POSTER_ALT).toContain("Rottweiler");
  });
});
