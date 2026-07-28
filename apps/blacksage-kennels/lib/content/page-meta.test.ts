import { describe, expect, it } from "vitest";
import { PAGE_META } from "./page-meta";

describe("PAGE_META", () => {
  it("defines H1 text for all must routes", () => {
    expect(PAGE_META.home.h1).toBe("German / ADRK-aligned Rottweilers");
    expect(PAGE_META.dogs.h1).toBe("Breeding stock");
    expect(PAGE_META.health.h1).toBe("Health & education");
    expect(PAGE_META.about.h1).toBe("About Blacksage Kennels");
    expect(PAGE_META.inquire.h1).toBe("Begin your inquiry");
  });

  it("includes SEO title and description for each route", () => {
    for (const page of Object.values(PAGE_META)) {
      expect(page.title.length).toBeGreaterThan(0);
      expect(page.description.length).toBeGreaterThan(0);
    }
  });
});
