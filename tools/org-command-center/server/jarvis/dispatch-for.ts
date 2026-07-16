import { readFileSync } from "node:fs";
import { parseModelRegistry, parseOrgRegistry } from "../../src/lib/parse-registry";
import { parseTracker } from "../../src/lib/parse-tracker";
import { validateManagerPacket } from "../../src/lib/validate-packet";
import type { ManagerPacketInput } from "../../src/lib/types";
import { assertReadable, trackerPath } from "../paths";
import { loadSnapshot } from "../snapshot";
import { JarvisExecError } from "./errors";

export type QueueForArgs = {
  position: string;
  goal: string;
  phase?: string;
};

export function buildQueueForPacket(repoRoot: string, args: QueueForArgs): ManagerPacketInput {
  const position = args.position?.trim();
  const goal = args.goal?.trim();
  if (!position) throw new JarvisExecError("position required", "missing_arg");
  if (!goal) throw new JarvisExecError("goal required", "missing_arg");

  const org = parseOrgRegistry(
    readFileSync(assertReadable(repoRoot, "skills/org/ORG-REGISTRY.md"), "utf8"),
  );
  const seat = org.roster.find((r) => r.slug === position);
  if (!seat) throw new JarvisExecError(`Unknown seat: ${position}`, "unknown_seat");
  if (seat.level !== "manager") {
    throw new JarvisExecError(
      `${position} is an IC — queue their manager instead`,
      "not_manager",
    );
  }

  const snap = loadSnapshot(repoRoot);
  const phase = (args.phase?.trim() || String(snap.mission.currentPhase || "")).trim();
  if (!phase) throw new JarvisExecError("phase required", "missing_arg");

  const tracker = parseTracker(readFileSync(trackerPath(repoRoot), "utf8"));
  const phase_name = tracker.phases.find((p) => p.phase === phase)?.name;
  const models = parseModelRegistry(
    readFileSync(assertReadable(repoRoot, "skills/org/MODEL-REGISTRY.md"), "utf8"),
  );
  const model = models[position];

  return {
    phase,
    position,
    goal,
    idea: tracker.idea,
    phase_name,
    llm_tier: model?.llmTier,
    llm_model: model?.llmModel,
    generation_profile: model?.generationProfile,
  };
}

export function previewQueueFor(repoRoot: string, args: QueueForArgs) {
  const input = buildQueueForPacket(repoRoot, args);
  const org = parseOrgRegistry(
    readFileSync(assertReadable(repoRoot, "skills/org/ORG-REGISTRY.md"), "utf8"),
  );
  const models = parseModelRegistry(
    readFileSync(assertReadable(repoRoot, "skills/org/MODEL-REGISTRY.md"), "utf8"),
  );
  const result = validateManagerPacket(input, org, models, { allowAnyManager: true });
  if (!result.ok) return { ok: false as const, errors: result.errors, input };
  return {
    ok: true as const,
    packet: result.packet,
    summary: `Manager ${result.packet.position}, phase ${result.packet.phase}: ${result.packet.goal}`,
  };
}
