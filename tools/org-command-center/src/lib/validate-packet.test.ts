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
      expect(result.packet.llm_model).toBe("composer-2.5");
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

  it("allows any manager when allowAnyManager is set", () => {
    const result = validateManagerPacket(
      {
        phase: "2",
        position: "cmo",
        goal: "Cross-phase task",
        llm_tier: "frontier-reasoning",
      },
      org,
      models,
      { allowAnyManager: true },
    );
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.packet.position).toBe("cmo");
  });

  it("accepts preferred_ic when IC reports to a manager", () => {
    const result = validateManagerPacket(
      {
        phase: "13",
        position: "cmo",
        goal: "Ship blog copy",
        llm_tier: "frontier-reasoning",
        preferred_ic: "copy-chief",
        require_inbox: true,
        require_ic_handoff: true,
      },
      org,
      models,
      { allowAnyManager: true },
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.packet.preferred_ic).toBe("copy-chief");
      expect(result.packet.require_inbox).toBe(true);
      expect(result.packet.require_ic_handoff).toBe(true);
    }
  });

  it("rejects unknown preferred_ic", () => {
    const result = validateManagerPacket(
      {
        phase: "13",
        position: "cmo",
        goal: "Ship blog copy",
        llm_tier: "frontier-reasoning",
        preferred_ic: "not-a-real-ic",
      },
      org,
      models,
      { allowAnyManager: true },
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.join(" ")).toMatch(/unknown preferred_ic/i);
  });

  it("rejects preferred_ic that is not an IC", () => {
    const result = validateManagerPacket(
      {
        phase: "13",
        position: "cmo",
        goal: "Ship blog copy",
        llm_tier: "frontier-reasoning",
        preferred_ic: "cmo",
      },
      org,
      models,
      { allowAnyManager: true },
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.join(" ")).toMatch(/must be an IC/i);
  });

  it("rejects preferred_ic that does not report to the intake manager", () => {
    const result = validateManagerPacket(
      {
        phase: "11",
        position: "cmo",
        goal: "Ship blog copy",
        llm_tier: "frontier-reasoning",
        preferred_ic: "brand-designer",
      },
      org,
      models,
      { allowAnyManager: true },
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.join(" ")).toMatch(/must report to intake manager cmo/i);
    }
  });

  it("requires budget_usd or production_skip_committed for phases 15/19", () => {
    const missing = validateManagerPacket(
      {
        phase: "15",
        position: "creative-director",
        goal: "Hero video",
        llm_tier: "creative-language",
        generation_profile: "hero-video",
      },
      org,
      models,
    );
    expect(missing.ok).toBe(false);
    if (!missing.ok) expect(missing.errors.join(" ")).toMatch(/budget_usd/);

    const withBudget = validateManagerPacket(
      {
        phase: "19",
        position: "cmo",
        goal: "Paid creatives",
        llm_tier: "frontier-reasoning",
        generation_profile: "ad-creative",
        budget_usd: 25,
      },
      org,
      models,
    );
    expect(withBudget.ok).toBe(true);

    const skipped = validateManagerPacket(
      {
        phase: "15",
        position: "creative-director",
        goal: "Skip video",
        llm_tier: "creative-language",
        generation_profile: "none",
        production_skip_committed: true,
      },
      org,
      models,
    );
    expect(skipped.ok).toBe(true);
    if (skipped.ok) expect(skipped.packet.production_skip_committed).toBe(true);
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
