import { resolvePhaseOwner } from "./parse-registry";
import type {
  ManagerPacket,
  ManagerPacketInput,
  ModelRegistry,
  OrgRegistry,
  ValidateResult,
} from "./types";

const GENERATION_REQUIRED_PHASES = new Set(["11", "12", "15", "19"]);

const DEFAULT_CONSTRAINTS = [
  "Spawn only Delegates to from your position SKILL.md",
  "Give each IC a write_lease subset (no colliding paths)",
  "Each IC packet MUST include llm_tier",
  "Await IC handoffs; merge; write manager brief",
  "Do not mark phase complete",
  "Do not spawn peer managers yourself — ask orchestrator",
];

export function validateManagerPacket(
  input: ManagerPacketInput,
  org: OrgRegistry,
  models: ModelRegistry,
  options?: { allowAnyManager?: boolean },
): ValidateResult {
  const errors: string[] = [];

  if (!input.phase) errors.push("phase is required");
  if (!input.position) errors.push("position is required");
  if (!input.goal?.trim()) errors.push("goal is required");
  if (!input.llm_tier) errors.push("llm_tier is required — refuse spawn without it");

  const owner = resolvePhaseOwner(org, input.phase);
  if (!owner) {
    errors.push(`No phase owner in registry for phase ${input.phase}`);
  } else if (!options?.allowAnyManager && input.position && input.position !== owner.managerOwner) {
    errors.push(
      `position must be phase Manager owner (${owner.managerOwner}), not ${input.position}`,
    );
  }

  const seat = org.roster.find((r) => r.slug === input.position);
  if (input.position && !seat) {
    errors.push(`Unknown position slug: ${input.position}`);
  } else if (seat && seat.level !== "manager") {
    errors.push(
      `Orchestrator may only assign managers — ${input.position} is level "${seat.level}"`,
    );
  }

  if (GENERATION_REQUIRED_PHASES.has(input.phase) && !input.generation_profile) {
    errors.push(
      `generation_profile is required for phase ${input.phase} (11/12/15/19)`,
    );
  }

  if (input.preferred_ic) {
    const ic = org.roster.find((r) => r.slug === input.preferred_ic);
    if (!ic) {
      errors.push(`Unknown preferred_ic slug: ${input.preferred_ic}`);
    } else if (ic.level !== "ic") {
      errors.push(`preferred_ic must be an IC, not ${ic.level}: ${input.preferred_ic}`);
    } else if (ic.reportsTo !== input.position) {
      errors.push(
        `preferred_ic ${input.preferred_ic} must report to intake manager ${input.position}, not ${ic.reportsTo ?? "unknown"}`,
      );
    }
  }

  if (errors.length) return { ok: false, errors };

  const model = models[input.position] ?? {
    llmTier: input.llm_tier!,
    llmModel: input.llm_model ?? "",
    generationProfile: "none",
  };

  const reportTo =
    input.report_to ??
    (seat?.reportsTo || "ceo-strategist");

  const goal = input.goal.trim();
  const companyGoal =
    input.company_goal?.trim() || input.idea?.trim() || "Company mission";
  const parentGoal =
    input.parent_goal?.trim() ||
    `Phase ${input.phase}${input.phase_name ? ` — ${input.phase_name}` : ""}`;
  const goalPath =
    input.goal_path?.length ? input.goal_path : [companyGoal, parentGoal, goal];

  const managerOwnerEntry = org.phaseOwners.find((p) => p.managerOwner === input.position);
  const delegateBudget =
    input.delegate_budget ??
    (options?.allowAnyManager
      ? (managerOwnerEntry?.maySpawn.length ?? 3)
      : owner!.maySpawn.length);

  const packet: ManagerPacket = {
    schema_version: 1,
    queued_at: new Date().toISOString(),
    phase: input.phase,
    position: input.position,
    goal,
    report_to: reportTo || "ceo-strategist",
    parent_position: "orchestrator",
    llm_tier: input.llm_tier!,
    llm_model: input.llm_model || model.llmModel,
    generation_profile:
      input.generation_profile ?? model.generationProfile ?? "none",
    inputs: input.inputs ?? [],
    must_read: input.must_read ?? ["skills/org/MODEL-REGISTRY.md"],
    outputs: input.outputs ?? [],
    write_lease: input.write_lease ?? [],
    budget_usd: input.budget_usd ?? null,
    collaborators: input.collaborators ?? [],
    delegate_budget: delegateBudget,
    constraints: input.constraints?.length ? input.constraints : DEFAULT_CONSTRAINTS,
    company_goal: companyGoal,
    parent_goal: parentGoal,
    goal_path: goalPath,
    ...(input.preferred_ic ? { preferred_ic: input.preferred_ic } : {}),
    ...(input.require_inbox !== undefined ? { require_inbox: input.require_inbox } : {}),
    ...(input.require_ic_handoff !== undefined
      ? { require_ic_handoff: input.require_ic_handoff }
      : {}),
  };

  return { ok: true, packet };
}
