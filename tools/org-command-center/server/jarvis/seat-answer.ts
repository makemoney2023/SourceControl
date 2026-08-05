import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { buildCompanyDigest } from "../../src/jarvis/company-digest";
import { appendMemoryNote } from "../memory/fs-store";
import {
  assertReadable,
  assertWritable,
  businessIdeaFile,
} from "../paths";
import { loadSnapshot } from "../snapshot";
import { planBlockerResolve, type BlockerResolvePlan } from "./blocker-resolve";
import { JarvisExecError } from "./errors";
import { resolveSeatSlug } from "./resolve-seat";
import { normalizeSeatAnswers } from "./seat-answer-normalize";
import {
  getLastReportedSeat,
  getSeatAnswerDraft,
  mergeWorkGoal,
} from "./session";

export type PersistSeatAnswersResult = {
  handoffRel: string;
  memoryRel: string | null;
};

function formatAnswersMarkdown(answers: Record<string, string>, ts: string): string {
  const lines = Object.entries(answers).map(
    ([k, v]) => `- **${k.trim()}:** ${String(v).trim()}`,
  );
  return [
    "",
    "## Operator answers",
    "",
    `_Answered ${ts}_`,
    "",
    ...lines,
    "",
  ].join("\n");
}

export function buildSeatAnswerGoal(
  seat: string,
  answers: Record<string, string>,
): string {
  return mergeWorkGoal(
    `Continue work for ${seat} using the operator answers below. Clear needs_input/blocked once applied.`,
    answers,
  );
}

export function persistSeatAnswers(
  repoRoot: string,
  seatRaw: string,
  answers: Record<string, string>,
): PersistSeatAnswersResult {
  const snap = loadSnapshot(repoRoot);
  const seat =
    resolveSeatSlug(seatRaw.trim(), snap.org.roster) ?? seatRaw.trim();
  if (!seat) {
    throw new JarvisExecError("seat is required", "invalid_args");
  }
  const cleaned = Object.fromEntries(
    Object.entries(answers)
      .map(([k, v]) => [String(k).trim(), String(v ?? "").trim()] as const)
      .filter(([k, v]) => k && v),
  );
  if (!Object.keys(cleaned).length) {
    throw new JarvisExecError("No usable answers", "invalid_args");
  }

  const latest = snap.handoffs.filter((h) => h.position === seat).at(-1);
  if (!latest) {
    throw new JarvisExecError(`No handoff found for ${seat}`, "not_found");
  }
  const handoffRel = businessIdeaFile(repoRoot, `HANDOFFS/${latest.filename}`);
  const abs = assertWritable(repoRoot, handoffRel);
  if (!existsSync(abs)) {
    throw new JarvisExecError(`Handoff missing on disk: ${latest.filename}`, "not_found");
  }
  const ts = new Date().toISOString();
  const prev = readFileSync(abs, "utf8");
  const next = prev.replace(/\s*$/, "") + formatAnswersMarkdown(cleaned, ts);
  writeFileSync(abs, next.endsWith("\n") ? next : `${next}\n`, "utf8");
  assertReadable(repoRoot, handoffRel);

  let memoryRel: string | null = null;
  try {
    const text = [
      `Operator answered questions for ${seat}:`,
      ...Object.entries(cleaned).map(([k, v]) => `- ${k}: ${v}`),
    ].join("\n");
    const written = appendMemoryNote(repoRoot, { kind: "note", text });
    memoryRel = written.path;
  } catch {
    memoryRel = null;
  }

  return { handoffRel, memoryRel };
}

function seatNeedsAnswers(h: {
  status: string;
  asks: string[];
}): boolean {
  return (
    h.status === "blocked" ||
    h.status === "needs_input" ||
    h.asks.length > 0
  );
}

/** Seats currently eligible for seat.answer (needs_input / asks / blocked). */
export function listSeatsNeedingAnswers(repoRoot: string): string[] {
  const snap = loadSnapshot(repoRoot);
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
    models: snap.models,
  });
  const fromDigest = digest.blockedSeats
    .filter((b) => b.status === "needs_input" || b.status === "blocked")
    .map((b) => b.slug);
  const fromAsks = snap.handoffs
    .filter((h) => seatNeedsAnswers(h))
    .map((h) => h.position);
  return [...new Set([...fromDigest, ...fromAsks])];
}

/** Seats with open asks / needs_input (voice announce) — not hard blockers alone. */
export function listSeatsAwaitingAnswers(repoRoot: string): string[] {
  const snap = loadSnapshot(repoRoot);
  return [
    ...new Set(
      snap.handoffs
        .filter((h) => h.status === "needs_input" || h.asks.length > 0)
        .map((h) => h.position),
    ),
  ];
}

export function resolveSeatForAnswer(
  repoRoot: string,
  args: { seat?: string; roomId?: string },
): string {
  const snap = loadSnapshot(repoRoot);
  const raw = args.seat?.trim() ?? "";
  if (raw) {
    return resolveSeatSlug(raw, snap.org.roster) ?? raw;
  }
  const roomId = args.roomId?.trim() ?? "";
  if (roomId) {
    const last = getLastReportedSeat(roomId);
    if (last) {
      const latest = snap.handoffs.filter((h) => h.position === last).at(-1);
      if (latest && seatNeedsAnswers(latest)) return last;
    }
  }
  const needing = listSeatsNeedingAnswers(repoRoot);
  if (needing.length === 1) return needing[0]!;
  if (needing.length === 0) {
    throw new JarvisExecError(
      "No seat needs answers right now. Report on a seat first.",
      "not_found",
    );
  }
  throw new JarvisExecError(
    `Which seat? ${needing.map((s) => s.replace(/-/g, " ")).join(", ")} need answers.`,
    "invalid_args",
  );
}

export function openAsksForSeat(repoRoot: string, seat: string): string[] {
  const snap = loadSnapshot(repoRoot);
  const latest = snap.handoffs.filter((h) => h.position === seat).at(-1);
  return latest?.asks?.filter(Boolean) ?? [];
}

export function resolveAnswersForSeat(
  repoRoot: string,
  args: {
    seat: string;
    answers?: Record<string, string>;
    answer?: string;
    question?: string;
    roomId?: string;
    useDraft?: boolean;
  },
): Record<string, string> {
  const openAsks = openAsksForSeat(repoRoot, args.seat);
  try {
    return normalizeSeatAnswers({
      answers: args.answers,
      answer: args.answer,
      question: args.question,
      openAsks,
    });
  } catch (e) {
    if (args.useDraft !== false && args.roomId) {
      const draft = getSeatAnswerDraft(args.roomId);
      if (draft && draft.seat === args.seat && Object.keys(draft.answers).length) {
        return { ...draft.answers };
      }
    }
    throw e;
  }
}

export function planSeatAnswer(
  repoRoot: string,
  args: {
    seat?: string;
    answers?: Record<string, string>;
    answer?: string;
    question?: string;
    roomId?: string;
  },
): BlockerResolvePlan & { handoffRel: string; memoryRel: string | null; seat: string } {
  const seat = resolveSeatForAnswer(repoRoot, {
    seat: args.seat,
    roomId: args.roomId,
  });
  const snap = loadSnapshot(repoRoot);
  const latest = snap.handoffs.filter((h) => h.position === seat).at(-1);
  if (!latest) {
    throw new JarvisExecError(`No handoff found for ${seat}`, "not_found");
  }
  if (!seatNeedsAnswers(latest)) {
    throw new JarvisExecError(
      `${seat} has no open asks or blocked/needs_input status`,
      "not_found",
    );
  }

  const answers = resolveAnswersForSeat(repoRoot, {
    seat,
    answers: args.answers,
    answer: args.answer,
    question: args.question,
    roomId: args.roomId,
    useDraft: true,
  });

  // Plan first so a routing failure does not leave orphan Operator answers.
  const goal = buildSeatAnswerGoal(seat, answers);
  const plan = planBlockerResolve(repoRoot, { seat, goal });
  const persisted = persistSeatAnswers(repoRoot, seat, answers);
  const label = seat.replace(/-/g, " ");
  return {
    ...plan,
    seat,
    spoken:
      plan.action === "rewake"
        ? `Rewake ${plan.position.replace(/-/g, " ")} to continue ${label} with operator answers.`
        : `Queue ${plan.position.replace(/-/g, " ")} to continue ${label} with operator answers.`,
    handoffRel: persisted.handoffRel,
    memoryRel: persisted.memoryRel,
  };
}
