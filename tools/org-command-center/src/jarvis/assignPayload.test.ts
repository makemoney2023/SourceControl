import { describe, expect, it } from "vitest";
import { DEFAULT_BUSINESS_IDEA_REL } from "../lib/project-paths";
import { buildAssignPayload } from "./assignPayload";
import type { ManagerPacketInput } from "../lib/types";

const BIZ = DEFAULT_BUSINESS_IDEA_REL;

describe("buildAssignPayload", () => {
  it("matches ManagerPacketInput shape for assign API", () => {
    const payload: ManagerPacketInput = buildAssignPayload({
      phase: "2",
      position: "head-of-research",
      llm_tier: "strong-general",
      llm_model: "composer-2.5",
      goal: "Market research",
      inputsText: `${BIZ}/01-problem-framing.md`,
      outputsText: "02-evidence-base.md, 02-market-research.md",
      generation_profile: "none",
      budgetText: "",
      creativeRequired: false,
    });
    expect(payload).toMatchObject({
      phase: "2",
      position: "head-of-research",
      llm_tier: "strong-general",
      llm_model: "composer-2.5",
      goal: "Market research",
      generation_profile: "none",
      budget_usd: null,
      collaborators: [],
    });
    expect(payload.outputs).toEqual([
      `${BIZ}/02-evidence-base.md`,
      `${BIZ}/02-market-research.md`,
    ]);
    expect(payload.write_lease).toContain(
      `${BIZ}/HANDOFFS/2-manager-head-of-research.md`,
    );
  });
});
