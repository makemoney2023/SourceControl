import type { ManagerPacketInput } from "../lib/types";
import {
  DEFAULT_BUSINESS_IDEA_REL,
  managerHandoffPath,
  resolveArtifactPath,
} from "../lib/project-paths";

export function buildAssignPayload(args: {
  phase: string;
  position: string;
  llm_tier: string;
  llm_model: string;
  goal: string;
  inputsText: string;
  outputsText: string;
  generation_profile: string;
  budgetText: string;
  creativeRequired: boolean;
  businessIdeaRel?: string;
}): ManagerPacketInput {
  const prefix = args.businessIdeaRel ?? DEFAULT_BUSINESS_IDEA_REL;
  const artifactPaths = args.outputsText
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((p) => resolveArtifactPath(p, prefix));

  return {
    phase: args.phase,
    position: args.position,
    goal: args.goal,
    llm_tier: args.llm_tier,
    llm_model: args.llm_model,
    generation_profile: args.creativeRequired
      ? args.generation_profile
      : args.generation_profile || "none",
    inputs: args.inputsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    outputs: artifactPaths,
    write_lease: [
      ...artifactPaths,
      managerHandoffPath(prefix, args.phase, args.position),
    ],
    budget_usd: args.budgetText ? Number(args.budgetText) : null,
    collaborators: [],
  };
}
