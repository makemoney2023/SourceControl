import { afterEach, describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { MUST_ROUTE_PATHS } from "./must-routes";

describe("app/sitemap", () => {
  const original = process.env.NEXT_PUBLIC_SITE_URL;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.NEXT_PUBLIC_SITE_URL;
    } else {
      process.env.NEXT_PUBLIC_SITE_URL = original;
    }
  });

  it("includes Must routes only with absolute URLs", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toEqual([
      "https://example.com/",
      "https://example.com/health",
      "https://example.com/dogs",
      "https://example.com/about",
      "https://example.com/inquire",
    ]);
    expect(urls).not.toContain("https://example.com/apply");
  });

  it("emits one entry per Must route path", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
    const entries = sitemap();
    expect(entries).toHaveLength(MUST_ROUTE_PATHS.length);
  });
});

describe("app/robots", () => {
  const original = process.env.NEXT_PUBLIC_SITE_URL;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.NEXT_PUBLIC_SITE_URL;
    } else {
      process.env.NEXT_PUBLIC_SITE_URL = original;
    }
  });

  it("allows all crawlers and references the sitemap", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
    const config = robots();

    expect(config.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(config.sitemap).toBe("https://example.com/sitemap.xml");
  });
});
