import { describe, expect, it } from "vitest";
import { buildPageMetadata } from "./page-metadata";

describe("buildPageMetadata", () => {
  it("sets title, description, and canonical from PAGE_META", () => {
    const metadata = buildPageMetadata("health", "/health");
    expect(metadata.title).toBe("Health & education — Blacksage Kennels");
    expect(metadata.description).toContain("ADRK/FCI Standard No. 147");
    expect(metadata.alternates).toEqual({ canonical: "/health" });
  });

  it("covers all Must route keys", () => {
    const routes: Array<[keyof typeof import("@/lib/content/page-meta").PAGE_META, string]> = [
      ["home", "/"],
      ["dogs", "/dogs"],
      ["health", "/health"],
      ["about", "/about"],
      ["inquire", "/inquire"],
    ];

    for (const [key, path] of routes) {
      const metadata = buildPageMetadata(key, path);
      expect(metadata.alternates?.canonical).toBe(path);
      expect(metadata.title).toBeTruthy();
      expect(metadata.description).toBeTruthy();
    }
  });
});
