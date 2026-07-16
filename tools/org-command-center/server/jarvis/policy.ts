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
const OPS_ONLY = new Set<JarvisIntent>([...HARD, "dispatch.queue"]);

export function policyFor(intent: JarvisIntent, mode: JarvisMode): JarvisPolicy {
  if (intent === "mode.set") return { allowed: true, needsConfirm: false };
  if (mode === "briefing" && OPS_ONLY.has(intent)) {
    return { allowed: false, needsConfirm: false, reason: "Switch to Ops mode first" };
  }
  if (mode === "review" && intent.startsWith("spawn")) {
    return { allowed: false, needsConfirm: false, reason: "Spawn disabled in Review" };
  }
  return { allowed: true, needsConfirm: HARD.has(intent) || intent === "dispatch.queue" };
}
