import { readFileSync } from "node:fs";
import { parseOrgRegistry } from "../../src/lib/parse-registry";
import { buildCompanyDigest } from "../../src/jarvis/company-digest";
import { assertReadable } from "../paths";
import { loadSnapshot } from "../snapshot";
import { JarvisExecError } from "./errors";
import { resolveSeatSlug } from "./resolve-seat";

export type BlockerResolvePlan = {
  action: "queue" | "rewake";
  position: string;
  goal: string;
  phase?: string;
  targetIc?: string;
  blockedSeat?: string;
  dispatchFilename?: string;
  spoken: string;
};

function seatLabel(slug: string): string {
  if (slug === "ceo-strategist") return "CEO";
  return slug.replace(/-/g, " ");
}

function defaultGoal(blockedSeat: string, reason: string): string {
  return `Resolve blocker for ${blockedSeat}: ${reason}`;
}

function findBlockedTarget(
  snap: ReturnType<typeof loadSnapshot>,
  args: { seat?: string; phase?: string },
): { slug: string; reason: string; phase: string } {
  const digest = buildCompanyDigest({
    org: snap.org,
    tracker: snap.tracker,
    handoffs: snap.handoffs,
    queueFiles: snap.queue,
    claimedFiles: snap.claimed,
    runs: snap.runs,
    sessions: snap.sessions,
    briefings: snap.briefings,
    alerts: snap.alerts,
    spendBySeat: snap.spend.bySeat,
    repoRoot: undefined,
    models: snap.models,
  });

  let candidates = digest.blockedSeats.map((b) => {
    const handoff = snap.handoffs.find((h) => h.position === b.slug);
    return {
      slug: b.slug,
      reason: b.reason,
      phase: handoff?.phase ?? String(snap.mission.currentPhase ?? ""),
    };
  });

  if (args.phase?.trim()) {
    const phase = args.phase.trim();
    candidates = candidates.filter((c) => c.phase === phase);
  }

  if (args.seat?.trim()) {
    const seat = resolveSeatSlug(args.seat.trim(), snap.org.roster) ?? args.seat.trim();
    const match = candidates.find((c) => c.slug === seat);
    if (match) return match;
    // Allow continue when handoff has asks (or blocked/needs_input) even if
    // digest candidacy raced / status text differs.
    const latest = snap.handoffs.filter((h) => h.position === seat).at(-1);
    if (
      latest &&
      (latest.status === "blocked" ||
        latest.status === "needs_input" ||
        latest.asks.length > 0)
    ) {
      return {
        slug: seat,
        reason: latest.asks[0] || latest.blockers[0] || latest.status || "needs input",
        phase: latest.phase || String(snap.mission.currentPhase ?? ""),
      };
    }
    throw new JarvisExecError(`No blocked seat matching ${args.seat}`, "not_found");
  }

  if (!candidates.length) {
    throw new JarvisExecError("No blockers to resolve", "not_found");
  }

  return candidates[0]!;
}

function resolveOwnerManager(
  repoRoot: string,
  blocked: { slug: string; reason: string; phase: string },
): { position: string; targetIc?: string } {
  const org = parseOrgRegistry(
    readFileSync(assertReadable(repoRoot, "skills/org/ORG-REGISTRY.md"), "utf8"),
  );
  const seat = org.roster.find((r) => r.slug === blocked.slug);
  if (!seat) {
    throw new JarvisExecError(`Unknown blocked seat: ${blocked.slug}`, "unknown_seat");
  }

  if (seat.level === "ic") {
    const manager = seat.reportsTo?.trim();
    if (!manager) {
      throw new JarvisExecError(`${blocked.slug} has no reporting manager`, "not_manager");
    }
    return { position: manager, targetIc: blocked.slug };
  }

  if (seat.level === "manager") {
    return { position: blocked.slug };
  }

  throw new JarvisExecError(`${blocked.slug} is not a manager or IC`, "not_manager");
}

export function planBlockerResolve(
  repoRoot: string,
  args: { seat?: string; phase?: string; goal?: string },
): BlockerResolvePlan {
  const snap = loadSnapshot(repoRoot);
  const blocked = findBlockedTarget(snap, args);
  const owner = resolveOwnerManager(repoRoot, blocked);
  const goal = args.goal?.trim() || defaultGoal(blocked.slug, blocked.reason);

  const liveSession = snap.sessions.find((s) => s.position === owner.position);
  if (liveSession) {
    return {
      action: "rewake",
      position: owner.position,
      goal,
      phase: blocked.phase || undefined,
      targetIc: owner.targetIc,
      blockedSeat: blocked.slug,
      dispatchFilename: liveSession.dispatch_filename,
      spoken: `Rewake ${seatLabel(owner.position)} to resolve ${seatLabel(blocked.slug)} blocker.`,
    };
  }

  return {
    action: "queue",
    position: owner.position,
    goal,
    phase: blocked.phase || undefined,
    targetIc: owner.targetIc,
    blockedSeat: blocked.slug,
    spoken: `Queue ${seatLabel(owner.position)} to resolve ${seatLabel(blocked.slug)} blocker.`,
  };
}
