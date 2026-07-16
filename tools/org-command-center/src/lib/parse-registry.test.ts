import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parseModelRegistry, parseOrgRegistry, resolvePhaseOwner } from "./parse-registry";

const dir = dirname(fileURLToPath(import.meta.url));
const orgMd = readFileSync(join(dir, "fixtures/sample-org-registry.md"), "utf8");
const modelMd = readFileSync(join(dir, "fixtures/sample-model-registry.md"), "utf8");

describe("parseOrgRegistry", () => {
  it("parses roster and phase owners", () => {
    const reg = parseOrgRegistry(orgMd);
    expect(reg.roster.find((r) => r.slug === "head-of-research")?.level).toBe("manager");
    expect(reg.roster.find((r) => r.slug === "market-research-analyst")?.level).toBe("ic");
    const p2 = resolvePhaseOwner(reg, "2");
    expect(p2?.managerOwner).toBe("head-of-research");
    expect(p2?.maySpawn).toContain("market-research-analyst");
    expect(p2?.maySpawn).toContain("seo-manager");
  });
});

describe("parseModelRegistry", () => {
  it("maps slug to tier and model", () => {
    const models = parseModelRegistry(modelMd);
    expect(models["head-of-research"]).toMatchObject({
      llmTier: "strong-general",
      llmModel: "claude-sonnet-5",
      generationProfile: "none",
    });
  });
});
