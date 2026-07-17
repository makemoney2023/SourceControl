import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parseOrgRegistry } from "../../src/lib/parse-registry";
import { normalizeSeatKey, resolveSeatSlug, seatAliasKeys } from "./resolve-seat";

const dir = dirname(fileURLToPath(import.meta.url));
const fullRoster = parseOrgRegistry(
  readFileSync(join(dir, "../../../../skills/org/ORG-REGISTRY.md"), "utf8"),
).roster;

const roster = [
  { slug: "ceo-strategist", title: "CEO / Strategist" },
  { slug: "head-of-research", title: "Head of Research" },
  { slug: "cfo", title: "CFO" },
  { slug: "cmo", title: "CMO" },
  { slug: "creative-director", title: "Creative Director" },
  { slug: "content-strategist", title: "Content Strategist" },
  { slug: "legal-counsel", title: "Legal Counsel" },
  { slug: "coo", title: "COO / Legal" },
  { slug: "fpa-analyst", title: "FP&A Analyst" },
  { slug: "head-of-sales-cs", title: "Head of Sales & CS" },
];

describe("normalizeSeatKey", () => {
  it("maps spoken ceo slash strategist to slug form", () => {
    expect(normalizeSeatKey("ceo/strategist")).toBe("ceo-strategist");
    expect(normalizeSeatKey("CEO / Strategist")).toBe("ceo-strategist");
    expect(normalizeSeatKey("CEO strategist")).toBe("ceo-strategist");
  });
});

describe("seatAliasKeys", () => {
  it("includes slug, title, and slash segments", () => {
    const keys = seatAliasKeys({ slug: "ceo-strategist", title: "CEO / Strategist" });
    expect(keys).toEqual(expect.arrayContaining(["ceo-strategist", "ceo", "strategist"]));
  });
});

describe("resolveSeatSlug", () => {
  it("resolves exact slug", () => {
    expect(resolveSeatSlug("ceo-strategist", roster)).toBe("ceo-strategist");
  });

  it("resolves title and spoken variants for CEO", () => {
    expect(resolveSeatSlug("CEO / Strategist", roster)).toBe("ceo-strategist");
    expect(resolveSeatSlug("ceo strategist", roster)).toBe("ceo-strategist");
    expect(resolveSeatSlug("ceo/strategist", roster)).toBe("ceo-strategist");
    expect(resolveSeatSlug("ceo", roster)).toBe("ceo-strategist");
    expect(resolveSeatSlug("C-suite", roster)).toBe("ceo-strategist");
    expect(resolveSeatSlug("csuite", roster)).toBe("ceo-strategist");
  });

  it("resolves head of research spoken form", () => {
    expect(resolveSeatSlug("head of research", roster)).toBe("head-of-research");
  });

  it("resolves FP&A and sales & CS titles", () => {
    expect(resolveSeatSlug("FP&A Analyst", roster)).toBe("fpa-analyst");
    expect(resolveSeatSlug("fpa analyst", roster)).toBe("fpa-analyst");
    expect(resolveSeatSlug("head of sales and cs", roster)).toBe("head-of-sales-cs");
    expect(resolveSeatSlug("head of sales & cs", roster)).toBe("head-of-sales-cs");
  });

  it("resolves legal counsel over coo slash-legal when unique", () => {
    expect(resolveSeatSlug("legal counsel", roster)).toBe("legal-counsel");
    expect(resolveSeatSlug("coo", roster)).toBe("coo");
  });

  it("returns null for unknown seats", () => {
    expect(resolveSeatSlug("moon-base-chef", roster)).toBeNull();
  });

  it("resolves every org roster seat by slug and by title", () => {
    expect(fullRoster.length).toBeGreaterThanOrEqual(30);
    for (const seat of fullRoster) {
      expect(resolveSeatSlug(seat.slug, fullRoster)).toBe(seat.slug);
      expect(resolveSeatSlug(seat.title, fullRoster)).toBe(seat.slug);
    }
  });

  it("resolves common spoken forms across the org", () => {
    const cases: [string, string][] = [
      ["copy chief", "copy-chief"],
      ["tech lead", "tech-lead"],
      ["product manager", "product-manager"],
      ["brand designer", "brand-designer"],
      ["seo manager", "seo-manager"],
      ["head of people", "head-of-people"],
      ["head of data", "head-of-data"],
      ["cto", "cto"],
      ["engineering", "cto"],
      ["paid media manager", "paid-media-manager"],
      ["customer success manager", "customer-success-manager"],
      ["analytics engineer", "analytics-engineer"],
    ];
    for (const [spoken, slug] of cases) {
      expect(resolveSeatSlug(spoken, fullRoster), spoken).toBe(slug);
    }
  });
});
