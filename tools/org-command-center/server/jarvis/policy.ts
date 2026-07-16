import type { JarvisIntent, JarvisMode } from "./intents";

export type JarvisPolicy = {
  allowed: boolean;
  needsConfirm: boolean;
  reason?: string;
};

const HARD = new Set<JarvisIntent>([
  "spawn.run_next",
  "run.cancel",
  "run.rewake",
  "agent.pause",
  "agent.resume",
  "csuite.draft",
]);
const OPS_ONLY = new Set<JarvisIntent>([
  ...HARD,
  "dispatch.queue",
  "dispatch.queue_for",
  "dispatch.preview",
  "dispatch.list",
  "delegate.plan",
]);
const STRUCTURAL = new Set<JarvisIntent>(["venture.create", "venture.switch"]);
const ARCHITECT_ONLY = new Set<JarvisIntent>([...STRUCTURAL]);

export function policyFor(intent: JarvisIntent, mode: JarvisMode): JarvisPolicy {
  if (intent === "agent.spawn_ic") {
    return {
      allowed: false,
      needsConfirm: false,
      reason:
        "I can't spawn ICs directly. Queue a manager with dispatch.queue_for, or ask for a delegate plan.",
    };
  }

  if (intent === "mode.set") return { allowed: true, needsConfirm: false };

  if (intent === "session.cancel_pending") {
    if (mode !== "ops" && mode !== "architect") {
      return { allowed: false, needsConfirm: false, reason: "Switch to Ops mode first" };
    }
    return { allowed: true, needsConfirm: false };
  }

  if (ARCHITECT_ONLY.has(intent) && mode !== "architect") {
    return {
      allowed: false,
      needsConfirm: false,
      reason: "Switch to Architect mode first",
    };
  }

  if (mode === "briefing" && OPS_ONLY.has(intent)) {
    return { allowed: false, needsConfirm: false, reason: "Switch to Ops mode first" };
  }
  if (mode === "review" && intent.startsWith("spawn")) {
    return { allowed: false, needsConfirm: false, reason: "Spawn disabled in Review" };
  }
  if (mode === "architect" && intent.startsWith("spawn")) {
    return {
      allowed: false,
      needsConfirm: false,
      reason: "Spawn disabled in Architect — switch to Ops",
    };
  }

  const needsConfirm =
    HARD.has(intent) ||
    intent === "dispatch.queue" ||
    intent === "dispatch.queue_for" ||
    STRUCTURAL.has(intent);

  return { allowed: true, needsConfirm };
}
