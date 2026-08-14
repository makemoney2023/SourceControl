import { readFileSync } from "node:fs";
import { parseModelRegistry, parseOrgRegistry } from "../../src/lib/parse-registry";
import { parseTracker } from "../../src/lib/parse-tracker";
import { validateManagerPacket } from "../../src/lib/validate-packet";
import type { ManagerPacketInput } from "../../src/lib/types";
import { loadSeatOutputPaths, mergeUniquePaths } from "../../src/lib/seat-outputs";
import {
  activeArtifactSlug,
  assertReadable,
  businessIdeaFile,
  businessIdeaRel,
  trackerPath,
} from "../paths";
import { queueValidatedDispatch } from "../queue-validated-dispatch";
import { loadSnapshot } from "../snapshot";
import { assertClassificationAndDesignGates } from "./dispatch-gates";
import { JarvisExecError } from "./errors";
import { resolveSeatSlug } from "./resolve-seat";

export type QueueForArgs = {
  position: string;
  goal: string;
  phase?: string;
  /** Alias for preferred_ic — used by work.request flows */
  targetIc?: string;
  preferred_ic?: string;
  require_inbox?: boolean;
  require_ic_handoff?: boolean;
};

export const MAX_BATCH = 5;

export type BatchQueueItem = {
  position: string;
  goal: string;
  phase?: string;
};

function seatLabel(slug: string): string {
  if (slug === "ceo-strategist") return "CEO";
  return slug.replace(/-/g, " ");
}

export function parseBatchQueueItems(raw: unknown): BatchQueueItem[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new JarvisExecError("items required (non-empty array)", "missing_arg");
  }
  if (raw.length > MAX_BATCH) {
    throw new JarvisExecError(`max ${MAX_BATCH} items per batch`, "invalid_arg");
  }
  const items: BatchQueueItem[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new JarvisExecError("each item must be an object", "invalid_arg");
    }
    const row = entry as Record<string, unknown>;
    const position = String(row.position ?? "").trim();
    const goal = String(row.goal ?? "").trim();
    const phase = row.phase != null ? String(row.phase).trim() : undefined;
    if (!position) throw new JarvisExecError("position required on each item", "missing_arg");
    if (!goal) throw new JarvisExecError("goal required on each item", "missing_arg");
    items.push({ position, goal, phase: phase || undefined });
  }
  return items;
}

export function summarizeQueueBatchSpoken(
  items: Array<{ position: string; phase: string }>,
): string {
  if (!items.length) return "No managers queued.";
  const labels = items.map((i) => seatLabel(i.position));
  const phases = [...new Set(items.map((i) => i.phase))];
  const phasePhrase =
    phases.length === 1 ? ` for phase ${phases[0]}` : ` across phases ${phases.join(", ")}`;
  if (labels.length === 1) {
    return `Queued ${labels[0]}${phasePhrase}.`;
  }
  const last = labels.pop();
  return `Queued ${labels.join(", ")} and ${last}${phasePhrase}.`;
}

export function queueDispatchBatch(
  repoRoot: string,
  items: BatchQueueItem[],
): {
  ok: true;
  items: Array<{
    position: string;
    phase: string;
    goal: string;
    filename: string;
    path: string;
  }>;
  filenames: string[];
  spoken: string;
} {
  if (!items.length) {
    throw new JarvisExecError("items required (non-empty array)", "missing_arg");
  }
  if (items.length > MAX_BATCH) {
    throw new JarvisExecError(`max ${MAX_BATCH} items per batch`, "invalid_arg");
  }
  const queued: Array<{
    position: string;
    phase: string;
    goal: string;
    filename: string;
    path: string;
  }> = [];

  for (const item of items) {
    const input = buildQueueForPacket(repoRoot, item);
    const result = queueValidatedDispatch(repoRoot, input, { allowAnyManager: true });
    if (!result.ok) {
      throw new JarvisExecError(
        ("errors" in result ? result.errors : ["queue failed"]).join("; "),
        "validation_error",
      );
    }
    const filename = result.path.split("/").pop()!;
    queued.push({
      position: result.packet.position,
      phase: result.packet.phase,
      goal: result.packet.goal,
      filename,
      path: result.path,
    });
  }

  return {
    ok: true,
    items: queued,
    filenames: queued.map((q) => q.filename),
    spoken: summarizeQueueBatchSpoken(queued),
  };
}

function resolvePositionArg(repoRoot: string, raw: string): string {
  const org = parseOrgRegistry(
    readFileSync(assertReadable(repoRoot, "skills/org/ORG-REGISTRY.md"), "utf8"),
  );
  return resolveSeatSlug(raw, org.roster) ?? raw;
}

/** Resolve queue_for args so confirm tokens bind the same phase execution will use. */
export function normalizeQueueForArgs(
  repoRoot: string,
  args: Record<string, unknown>,
): Record<string, unknown> {
  const rawPosition = String(args.position ?? "").trim();
  const position = rawPosition ? resolvePositionArg(repoRoot, rawPosition) : rawPosition;
  const goal = String(args.goal ?? "").trim();
  const snap = loadSnapshot(repoRoot);
  const fallback = String(snap.mission.currentPhase || "").trim();
  const phase = coercePhaseArg(args.phase, fallback);
  if (!phase) throw new JarvisExecError("phase required", "missing_arg");
  return { ...args, position, goal, phase };
}

/** Accept "2", "Phase 2 Market", etc. Reject garbage like "queue" / "Resolve". */
export function coercePhaseArg(raw: unknown, fallback: string): string {
  const s = String(raw ?? "").trim();
  if (/^\d+$/.test(s)) return s;
  const labeled = s.match(/\bphase\s*(\d+)\b/i);
  if (labeled?.[1]) return labeled[1];
  const leading = s.match(/^(\d+)\b/);
  if (leading?.[1]) return leading[1];
  return fallback;
}

export function buildQueueForPacket(repoRoot: string, args: QueueForArgs): ManagerPacketInput {
  const rawPosition = args.position?.trim();
  const goal = args.goal?.trim();
  if (!rawPosition) throw new JarvisExecError("position required", "missing_arg");
  if (!goal) throw new JarvisExecError("goal required", "missing_arg");

  const org = parseOrgRegistry(
    readFileSync(assertReadable(repoRoot, "skills/org/ORG-REGISTRY.md"), "utf8"),
  );
  const position = resolveSeatSlug(rawPosition, org.roster) ?? rawPosition;
  const seat = org.roster.find((r) => r.slug === position);
  if (!seat) throw new JarvisExecError(`Unknown seat: ${rawPosition}`, "unknown_seat");
  if (seat.level !== "manager") {
    throw new JarvisExecError(
      `${position} is an IC — queue their manager instead`,
      "not_manager",
    );
  }

  const snap = loadSnapshot(repoRoot);
  const phase = coercePhaseArg(args.phase, String(snap.mission.currentPhase || "").trim());
  if (!phase) throw new JarvisExecError("phase required", "missing_arg");

  const tracker = parseTracker(readFileSync(trackerPath(repoRoot), "utf8"));
  const phase_name = tracker.phases.find((p) => p.phase === phase)?.name;
  const models = parseModelRegistry(
    readFileSync(assertReadable(repoRoot, "skills/org/MODEL-REGISTRY.md"), "utf8"),
  );
  const model = models[position];

  const rawPreferredIc = (args.preferred_ic ?? args.targetIc)?.trim();
  const preferred_ic = rawPreferredIc
    ? resolveSeatSlug(rawPreferredIc, org.roster) ?? rawPreferredIc
    : undefined;

  assertClassificationAndDesignGates(repoRoot, {
    phase,
    preferred_ic,
    classification: tracker.classification,
  });

  const seatOutputs = loadSeatOutputPaths(repoRoot, position, {
    ventureSlug: activeArtifactSlug(repoRoot),
    businessIdeaRel: businessIdeaRel(repoRoot),
  });
  const handoff = businessIdeaFile(
    repoRoot,
    `HANDOFFS/${phase}-manager-${position}.md`,
  );

  const input: ManagerPacketInput = {
    phase,
    position,
    goal,
    idea: tracker.idea,
    phase_name,
    llm_tier: model?.llmTier,
    llm_model: model?.llmModel,
    generation_profile: model?.generationProfile,
    outputs: seatOutputs,
    write_lease: mergeUniquePaths(seatOutputs, [handoff]),
  };

  if (preferred_ic) {
    input.preferred_ic = preferred_ic;
    input.require_ic_handoff = args.require_ic_handoff ?? true;
  }

  if (args.require_inbox !== undefined) {
    input.require_inbox = args.require_inbox;
  } else if (preferred_ic) {
    input.require_inbox = true;
  }

  return input;
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
