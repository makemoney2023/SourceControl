import { describe, expect, it } from "vitest";
import { MUST_ROUTE_PATHS, MUST_ROUTES } from "./must-routes";

describe("MUST_ROUTES", () => {
  it("lists only the five Must routes in SEO priority order", () => {
    expect(MUST_ROUTE_PATHS).toEqual([
      "/",
      "/health",
      "/dogs",
      "/about",
      "/inquire",
    ]);
  });

  it("does not include /apply or /litters", () => {
    expect(MUST_ROUTE_PATHS).not.toContain("/apply");
    expect(MUST_ROUTE_PATHS).not.toContain("/litters");
  });

  it("assigns sitemap priority and changefreq per 16-seo.md", () => {
    expect(MUST_ROUTES).toEqual([
      { path: "/", priority: 1.0, changeFrequency: "monthly" },
      { path: "/health", priority: 0.9, changeFrequency: "monthly" },
      { path: "/dogs", priority: 0.8, changeFrequency: "monthly" },
      { path: "/about", priority: 0.7, changeFrequency: "monthly" },
      { path: "/inquire", priority: 0.6, changeFrequency: "yearly" },
    ]);
  });
});
