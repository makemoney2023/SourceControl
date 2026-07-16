import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parseModelRegistry, parseOrgRegistry } from "./parse-registry";
import { validateManagerPacket } from "./validate-packet";

const dir = dirname(fileURLToPath(import.meta.url));
const org = parseOrgRegistry(readFileSync(join(dir, "fixtures/sample-org-registry.md"), "utf8"));
const models = parseModelRegistry(
  readFileSync(join(dir, "fixtures/sample-model-registry.md"), "utf8"),
);

describe("validateManagerPacket", () => {
  it("accepts a valid manager packet and fills model defaults", () => {
    const result = validateManagerPacket(
      {
        phase: "2",
        position: "head-of-research",
        goal: "Run market research",
        llm_tier: "strong-general",
        idea: "Passive grid",
        phase_name: "Market",
      },
      org,
      models,
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.packet.llm_model).toBe("claude-sonnet-5");
      expect(result.packet.report_to).toBe("ceo-strategist");
      expect(result.packet.parent_position).toBe("orchestrator");
      expect(result.packet.generation_profile).toBe("none");
      expect(result.packet.company_goal).toBe("Passive grid");
      expect(result.packet.parent_goal).toBe("Phase 2 — Market");
      expect(result.packet.goal_path).toEqual([
        "Passive grid",
        "Phase 2 — Market",
        "Run market research",
      ]);
    }
  });

  it("refuses IC as position", () => {
    const result = validateManagerPacket(
      {
        phase: "2",
        position: "market-research-analyst",
        goal: "Nope",
        llm_tier: "strong-general",
      },
      org,
      models,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.join(" ")).toMatch(/manager/i);
  });

  it("refuses missing llm_tier", () => {
    const result = validateManagerPacket(
      {
        phase: "2",
        position: "head-of-research",
        goal: "Run market research",
      },
      org,
      models,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.join(" ")).toMatch(/llm_tier/);
  });

  it("refuses wrong manager for phase", () => {
    const result = validateManagerPacket(
      {
        phase: "2",
        position: "cmo",
        goal: "Wrong owner",
        llm_tier: "frontier-reasoning",
      },
      org,
      models,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.join(" ")).toMatch(/owner/i);
  });

  it("requires generation_profile for creative phases 11/12/15/19", () => {
    const missing = validateManagerPacket(
      {
        phase: "11",
        position: "creative-director",
        goal: "Brand",
        llm_tier: "creative-language",
      },
      org,
      models,
    );
    expect(missing.ok).toBe(false);
    if (!missing.ok) expect(missing.errors.join(" ")).toMatch(/generation_profile/);

    const ok = validateManagerPacket(
      {
        phase: "11",
        position: "creative-director",
        goal: "Brand",
        llm_tier: "creative-language",
        generation_profile: "brand-stills",
      },
      org,
      models,
    );
    expect(ok.ok).toBe(true);
  });
});
