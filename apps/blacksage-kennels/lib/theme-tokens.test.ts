import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { SITE_ENV_DOCS, THEME_TOKENS } from "@/lib/site-config";

describe("Working-Dog Cinema theme tokens (11-R)", () => {
  it("exports void-black + ADRK tan tokens", () => {
    expect(THEME_TOKENS.ground).toBe("#070707");
    expect(THEME_TOKENS.elevated).toBe("#121212");
    expect(THEME_TOKENS.lifted).toBe("#1A1A1A");
    expect(THEME_TOKENS.proofBand).toBe("#101010");
    expect(THEME_TOKENS.tan).toBe("#C4A35A");
    expect(THEME_TOKENS.tanDeep).toBe("#A67C52");
    expect(THEME_TOKENS.textPrimary).toBe("#F3EFE6");
    expect(THEME_TOKENS.ctaText).toBe("#070707");
    expect(THEME_TOKENS.heroFog).toBe("#050505");
    expect(THEME_TOKENS.sage).toBe("#7A8F7E");
  });

  it("documents NEXT_PUBLIC_REDUCE_3D in site-config", () => {
    const reduce3d = SITE_ENV_DOCS.find((entry) => entry.key === "NEXT_PUBLIC_REDUCE_3D");
    expect(reduce3d).toBeDefined();
    expect(reduce3d?.default).toBe("unset");
  });

  it("maps cinema tokens in globals.css", () => {
    const css = readFileSync(resolve(__dirname, "../app/globals.css"), "utf8");
    expect(css).toContain("--color-ground: #070707");
    expect(css).toContain("--color-tan: #c4a35a");
    expect(css).toContain("--color-text-primary: #f3efe6");
    expect(css).toContain("--color-hero-fog: #050505");
    expect(css).toContain("--color-blacksage-proof-band: #101010");
    expect(css).toContain("cinema-grain");
  });
});
