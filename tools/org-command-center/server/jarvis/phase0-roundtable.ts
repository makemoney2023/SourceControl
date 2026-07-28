import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  activeProjectSlug,
  businessIdeaFile,
  businessIdeaRoot,
  dispatchRoot,
  trackerPath,
} from "../paths";
import { appendActivity } from "../activity";
import { queueValidatedDispatch } from "../queue-validated-dispatch";
import { spawnClaimedManagerDetached, spawnRunReady } from "../spawn";
import {
  patchTrackerPhaseStatus,
  seedPositionsRow,
} from "../../src/lib/parse-tracker";
import {
  type BatchQueueItem,
  buildQueueForPacket,
  queueDispatchBatch,
} from "./dispatch-for";
import {
  extractOperatorSummary,
  formatOperatorSummarySpoken,
} from "./operator-summary";
import { setReviewInboxStatus } from "./review-inbox";

export const PHASE0_PEER_SEATS = [
  "cfo",
  "cmo",
  "coo",
  "head-of-research",
] as const;

export type Phase0PeerSeat = (typeof PHASE0_PEER_SEATS)[number];

export type Phase0RoundtableStatus =
  | "idle"
  | "awaiting_ceo_intake"
  | "peers_running"
  | "awaiting_ceo_merge"
  | "rewaking_peers"
  | "done"
  | "failed";

export type Phase0RoundtableState = {
  venture: string;
  status: Phase0RoundtableStatus;
  ceoIntakeRunId?: string;
  peerRunIds: Record<string, string>;
  peerBriefs: Record<string, string>;
  mergeRunId?: string;
  startedAt: string;
  updatedAt: string;
  peersStartedAt?: string;
  partial?: boolean;
  error?: string;
  pulse?: string;
  /** Tracker + inbox closeout after approve / skip-review. */
  closeoutApplied?: boolean;
  /** Seats currently being respawned after CEO rewake. */
  rewakeSeats?: string[];
  /** Auto-rewake cycles completed (max 1). */
  rewakeCount?: number;
};

export const DEFAULT_PEER_TIMEOUT_MS = 25 * 60 * 1000;

const PEER_GOALS: Record<Phase0PeerSeat, string> = {
  cfo: [
    "Phase 0 peer brief (CFO).",
    "Read 00-intake.md and MEMORY/context.md.",
    "Write ONLY HANDOFFS/0-manager-cfo.md with unit-economics, budget, and capital assumptions for this intake classification.",
    "Do not rewrite intake. Do not mark phase complete. Do not spawn peer managers.",
  ].join(" "),
  cmo: [
    "Phase 0 peer brief (CMO).",
    "Read 00-intake.md and MEMORY/context.md.",
    "Write ONLY HANDOFFS/0-manager-cmo.md with customer, channel, and positioning assumptions.",
    "Do not rewrite intake. Do not mark phase complete. Do not spawn peer managers.",
  ].join(" "),
  coo: [
    "Phase 0 peer brief (COO).",
    "Read 00-intake.md and MEMORY/context.md.",
    "Write ONLY HANDOFFS/0-manager-coo.md with ops, delivery, and legal/compliance flags.",
    "Do not rewrite intake. Do not mark phase complete. Do not spawn peer managers.",
  ].join(" "),
  "head-of-research": [
    "Phase 0 peer brief (Head of Research).",
    "Read 00-intake.md and MEMORY/context.md.",
    "Write ONLY HANDOFFS/0-manager-head-of-research.md with evidence gaps and early market reality checks.",
    "Do not rewrite intake. Do not mark phase complete. Do not spawn peer managers.",
  ].join(" "),
};

export function planPhase0PeerBatch(): BatchQueueItem[] {
  return PHASE0_PEER_SEATS.map((position) => ({
    position,
    phase: "0",
    goal: PEER_GOALS[position],
  }));
}

/** Detect Phase 0 / intake roundtable intent (including STT garble like "Restart 5 Phase 0"). */
export function looksLikePhase0Request(args: {
  phase?: string;
  goal?: string;
}): boolean {
  const phase = String(args.phase ?? "").trim();
  if (phase === "0") return true;
  const goal = String(args.goal ?? "").trim();
  if (!goal) return false;
  if (/\bphase\s*(?:zero|0)\b/i.test(goal)) return true;
  // Bare "intake" alone is too broad — require new-idea / classification cue.
  if (/\bintake\b/i.test(goal) && /\b(new\s+idea|classif|venture|lemonade|roundtable)\b/i.test(goal)) {
    return true;
  }
  return false;
}

export function isPhase0RoundtableRequest(args: {
  phase?: string;
  position?: string;
  goal?: string;
}): boolean {
  // Wrong seat must not block Phase 0 — server forces CEO roundtable.
  return looksLikePhase0Request(args);
}

export function phase0WorkGoal(goal?: string): string {
  const g = String(goal ?? "").trim();
  if (!g) return "Phase 0 Intake — C-suite roundtable";
  if (/\bphase\s*(?:zero|0)\b/i.test(g) || /\bintake\b/i.test(g)) return g;
  return `Phase 0 Intake — ${g}`;
}

function statePath(repoRoot: string): string {
  return join(dispatchRoot(repoRoot), "phase0-roundtable.json");
}

export function loadPhase0Roundtable(repoRoot: string): Phase0RoundtableState | null {
  const path = statePath(repoRoot);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as Phase0RoundtableState;
  } catch {
    return null;
  }
}

export function savePhase0Roundtable(
  repoRoot: string,
  state: Phase0RoundtableState,
): void {
  const dir = dispatchRoot(repoRoot);
  mkdirSync(dir, { recursive: true });
  const next = { ...state, updatedAt: new Date().toISOString() };
  writeFileSync(statePath(repoRoot), JSON.stringify(next, null, 2) + "\n", "utf8");
}

export function startPhase0Roundtable(
  repoRoot: string,
  opts: { ceoIntakeRunId: string },
): Phase0RoundtableState {
  const now = new Date().toISOString();
  const state: Phase0RoundtableState = {
    venture: activeProjectSlug(repoRoot),
    status: "awaiting_ceo_intake",
    ceoIntakeRunId: opts.ceoIntakeRunId,
    peerRunIds: {},
    peerBriefs: {},
    startedAt: now,
    updatedAt: now,
    pulse: "Phase 0 roundtable started — CEO intake running.",
  };
  savePhase0Roundtable(repoRoot, state);
  try {
    appendActivity(dispatchRoot(repoRoot), {
      type: "phase0_roundtable",
      detail: state.pulse,
      slug: "ceo-strategist",
      phase: "0",
    });
  } catch {
    /* activity optional in fixtures */
  }
  return state;
}

function intakeAbs(repoRoot: string): string {
  return join(repoRoot, businessIdeaFile(repoRoot, "00-intake.md"));
}

function peerBriefRel(repoRoot: string, seat: string): string {
  return businessIdeaFile(repoRoot, `HANDOFFS/0-manager-${seat}.md`);
}

function peerBriefAbs(repoRoot: string, seat: string): string {
  return join(repoRoot, peerBriefRel(repoRoot, seat));
}

function csuiteReviewAbs(repoRoot: string): string {
  return join(repoRoot, businessIdeaFile(repoRoot, "HANDOFFS/0-csuite-review.md"));
}

function readRunStatus(repoRoot: string, runId: string): string | null {
  const path = join(dispatchRoot(repoRoot), "runs", `${runId}.json`);
  if (!existsSync(path)) return null;
  try {
    const raw = JSON.parse(readFileSync(path, "utf8")) as { status?: string };
    return String(raw.status ?? "");
  } catch {
    return null;
  }
}

function runFinishedOk(status: string | null): boolean {
  return status === "completed" || status === "completed_with_gaps";
}

function collectPeerBriefs(repoRoot: string): Record<string, string> {
  const found: Record<string, string> = {};
  for (const seat of PHASE0_PEER_SEATS) {
    if (existsSync(peerBriefAbs(repoRoot, seat))) {
      found[seat] = peerBriefRel(repoRoot, seat);
    }
  }
  return found;
}

function readCsuiteVerdict(repoRoot: string): string | null {
  const path = csuiteReviewAbs(repoRoot);
  if (!existsSync(path)) return null;
  const text = readFileSync(path, "utf8");
  const m = text.match(/^verdict:\s*(\S+)/m);
  return m?.[1]?.trim() ?? null;
}

function stripForSpeech(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_#|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Spoken status for a finished Phase 0 roundtable — plain English for wake/FAB,
 * not peer-table jargon dumps.
 */
export function spokenPhase0FindingsBrief(repoRoot: string): string | null {
  const path = csuiteReviewAbs(repoRoot);
  if (!existsSync(path)) return null;
  const text = readFileSync(path, "utf8");
  const verdict = text.match(/^verdict:\s*(\S+)/m)?.[1]?.trim();
  if (!verdict) return null;

  // Prefer worker-written plain English + next steps when present.
  const operator = formatOperatorSummarySpoken(extractOperatorSummary(text), 420);
  if (operator) {
    let spoken = `Phase 0 is done — C-suite says ${verdict}. ${operator}`;
    spoken = spoken.replace(/\s+/g, " ").trim();
    if (spoken.length > 420) spoken = `${spoken.slice(0, 417).trimEnd()}…`;
    return spoken;
  }

  // Fallback for older reviews without operator sections — keep it human, not table dumps.
  const peerRecs: string[] = [];
  for (const line of text.split("\n")) {
    const m = line.match(
      /^\|\s*(cfo|cmo|coo|head-of-research)\s*\|\s*[^|]*\|\s*([^|]+)\|/i,
    );
    if (!m) continue;
    const rec = stripForSpeech(m[2]).toLowerCase();
    if (!rec || /^-{2,}$/.test(rec) || /recommendation/.test(rec)) continue;
    peerRecs.push(rec.split(/\s+/)[0] ?? rec);
  }
  const allApproved =
    peerRecs.length >= 2 && peerRecs.every((r) => r.startsWith("approve"));

  const softTopics: string[] = [];
  for (const line of text.split("\n")) {
    const m = line.match(/^\|\s*([^|]+)\|\s*soft\s*\|/i);
    if (!m) continue;
    const topic = stripForSpeech(m[1]);
    if (!topic || /^-{2,}$/.test(topic) || /^topic$/i.test(topic)) continue;
    softTopics.push(topic);
    if (softTopics.length >= 2) break;
  }

  const commentBits: string[] = [];
  const commentsSection = text.match(
    /##\s*Comments[^\n]*\n([\s\S]*?)(?=\n##\s|\n---|\s*$)/i,
  );
  if (commentsSection) {
    for (const line of commentsSection[1].split("\n")) {
      const bullet = line.match(/^\s*[-*+]\s+(.+)/);
      if (!bullet) continue;
      const cleaned = stripForSpeech(bullet[1]);
      if (cleaned) commentBits.push(cleaned);
      if (commentBits.length >= 2) break;
    }
  }

  const parts: string[] = [`Phase 0 is done — C-suite says ${verdict}.`];
  if (allApproved) {
    parts.push("Finance, marketing, ops, and research cleared intake.");
  } else if (peerRecs.length) {
    parts.push("Peer seats have reviewed the intake.");
  }
  if (softTopics.length) {
    parts.push(`Open items to carry forward: ${softTopics.join(" and ")}.`);
  }
  if (commentBits.length) {
    // One short human comment max for wake.
    const c = commentBits[0]!;
    parts.push(c.length > 120 ? `${c.slice(0, 117).trimEnd()}…` : c);
  }
  if (/phase\s*1/i.test(text) || verdict === "approve") {
    parts.push("Next: confirm location and first events, then Phase 1 framing.");
  }

  let spoken = parts.join(" ").replace(/\s+/g, " ").trim();
  if (spoken.length > 420) {
    spoken = `${spoken.slice(0, 417).trimEnd()}…`;
  }
  return spoken;
}

/** Parse YAML-ish seat lists: [], [cfo], [cfo, cmo], ["cfo"], cfo */
export function parseRewakeSeatsList(raw: string): string[] {
  const s = raw.trim();
  if (!s || s === "[]" || s === "~" || s === "null") return [];
  if (s.startsWith("[")) {
    const inner = s.slice(1, s.endsWith("]") ? -1 : undefined).trim();
    if (!inner) return [];
    return inner
      .split(",")
      .map((p) => p.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }
  return [s.replace(/^["']|["']$/g, "")].filter(Boolean);
}

function readRewakeSeats(repoRoot: string): string[] {
  const path = csuiteReviewAbs(repoRoot);
  if (!existsSync(path)) return [];
  const text = readFileSync(path, "utf8");
  const m = text.match(/^rewake_seats:\s*(\[[^\]]*\]|\S+)/m);
  if (!m) return [];
  return parseRewakeSeatsList(m[1]);
}

function planPhase0RewakeBatch(seats: string[]): BatchQueueItem[] {
  const allowed = new Set<string>(PHASE0_PEER_SEATS);
  return seats
    .map((s) => s.trim())
    .filter((s): s is Phase0PeerSeat => allowed.has(s))
    .map((position) => ({
      position,
      phase: "0",
      goal: [
        `Phase 0 rewake peer brief (${position}).`,
        "CEO requested a redo of your prior brief.",
        PEER_GOALS[position].replace(/^Phase 0 peer brief[^.]+\.\s*/, ""),
      ].join(" "),
    }));
}

/** After CEO approve/skip-review: clear pending_review noise + advance tracker. */
export function applyPhase0ApproveCloseout(repoRoot: string): void {
  setReviewInboxStatus(repoRoot, { status: "approved", phase: "0" });
  const trackerAbs = trackerPath(repoRoot);
  if (!existsSync(trackerAbs)) return;
  let md = readFileSync(trackerAbs, "utf8");
  md = patchTrackerPhaseStatus(md, "0", "✅");
  // Move pointer to Phase 1 framing (⬜) — do not auto-start Phase 1 spawn.
  md = md.replace(/\*\*Current phase:\*\*\s*.+/, "**Current phase:** 1");
  md = seedPositionsRow(md, {
    phase: "0",
    manager: "ceo-strategist",
    icsSpawned: "",
    handoffDir: "HANDOFFS/",
    csuiteVerdict: "approve",
    reviewer: "ceo-strategist",
    managerLlmTier: "frontier-reasoning",
  });
  // Clarify Phase 0 notes after closeout
  md = md.replace(
    /(\| 0 \| Intake \| ✅ \| [^|]* \| )[^|]*/,
    "$1C-suite approved — Phase 0 closed",
  );
  writeFileSync(trackerAbs, md, "utf8");
}

function maybeApplyApproveCloseout(
  repoRoot: string,
  state: Phase0RoundtableState,
): Phase0RoundtableState {
  if (state.closeoutApplied) return state;
  const verdict = readCsuiteVerdict(repoRoot);
  if (verdict !== "approve" && verdict !== "skip-review") return state;
  const rewake = readRewakeSeats(repoRoot);
  // After one auto-rewake cycle, approve closeout proceeds even if seats linger.
  if (rewake.length > 0 && (state.rewakeCount ?? 0) < 1) return state;
  try {
    applyPhase0ApproveCloseout(repoRoot);
  } catch {
    return state;
  }
  const next = { ...state, closeoutApplied: true };
  savePhase0Roundtable(repoRoot, next);
  return next;
}

function buildMergeGoal(partial: boolean, briefs: Record<string, string>): string {
  const present = Object.keys(briefs);
  const missing = PHASE0_PEER_SEATS.filter((s) => !briefs[s]);
  const lines = [
    "Phase 0 CEO merge — C-suite roundtable.",
    "Read 00-intake.md and all peer Phase 0 manager briefs under HANDOFFS/0-manager-*.md.",
    "Write or update HANDOFFS/0-csuite-review.md with YAML frontmatter including:",
    "verdict (approve | skip-review | block), secondary_reviewers: [cfo, cmo, coo, head-of-research],",
    partial || missing.length
      ? `gaps: ${JSON.stringify(missing)} (partial peer set),`
      : "gaps: [] ,",
    "Present peer briefs: " + (present.join(", ") || "(none)") + ".",
    "If peers conflict on load-bearing assumptions, list seats to rewake once; otherwise finalize verdict.",
    "Do not mark phase complete. Do not spawn peer managers.",
  ];
  return lines.join(" ");
}

export type Phase0AdvanceDeps = {
  now?: () => number;
  peerTimeoutMs?: number;
  queuePeers?: (
    repoRoot: string,
    items: BatchQueueItem[],
  ) => {
    filenames: string[];
    items: Array<{ position: string; filename: string }>;
  };
  spawnFilenames?: (
    repoRoot: string,
    filenames: string[],
  ) => {
    started: Array<{ position: string; runId: string; filename: string }>;
  };
  spawnMerge?: (repoRoot: string, goal: string) => { runId: string };
};

function defaultQueuePeers(repoRoot: string, items: BatchQueueItem[]) {
  const queued = queueDispatchBatch(repoRoot, items);
  return {
    filenames: queued.filenames,
    items: queued.items.map((i) => ({ position: i.position, filename: i.filename })),
  };
}

function defaultSpawnFilenames(repoRoot: string, filenames: string[]) {
  const result = spawnRunReady(repoRoot, {
    filenames,
    wakeReason: "on_demand",
  });
  return { started: result.started };
}

function defaultSpawnMerge(repoRoot: string, goal: string): { runId: string } {
  const input = buildQueueForPacket(repoRoot, {
    position: "ceo-strategist",
    goal,
    phase: "0",
    require_inbox: true,
  });
  const queued = queueValidatedDispatch(repoRoot, input, { allowAnyManager: true });
  if (!queued.ok) {
    throw new Error(("errors" in queued ? queued.errors : ["queue failed"]).join("; "));
  }
  const filename = queued.path.split("/").pop()!;
  const spawned = spawnClaimedManagerDetached(repoRoot, {
    filename,
    wakeReason: "on_demand",
  });
  if (!spawned.ok || !spawned.runId) {
    throw new Error(spawned.error || "CEO merge spawn failed");
  }
  return { runId: spawned.runId };
}

function pulse(
  repoRoot: string,
  state: Phase0RoundtableState,
  detail: string,
): Phase0RoundtableState {
  const next = { ...state, pulse: detail };
  savePhase0Roundtable(repoRoot, next);
  try {
    appendActivity(dispatchRoot(repoRoot), {
      type: "phase0_roundtable",
      detail,
      phase: "0",
      slug: "ceo-strategist",
    });
  } catch {
    /* ignore */
  }
  return next;
}

/** Prevent nested advance when queue/spawn → loadSnapshot → advance again. */
let advancingPhase0 = false;

/** Advance Phase 0 roundtable waves. Safe to call often (idempotent). */
export function advancePhase0Roundtable(
  repoRoot: string,
  deps: Phase0AdvanceDeps = {},
): Phase0RoundtableState | null {
  if (advancingPhase0) return loadPhase0Roundtable(repoRoot);
  advancingPhase0 = true;
  try {
    return advancePhase0RoundtableInner(repoRoot, deps);
  } finally {
    advancingPhase0 = false;
  }
}

function advancePhase0RoundtableInner(
  repoRoot: string,
  deps: Phase0AdvanceDeps,
): Phase0RoundtableState | null {
  const state = loadPhase0Roundtable(repoRoot);
  if (!state) return null;
  if (state.status === "failed" || state.status === "idle") {
    return state;
  }
  // done: still run approve closeout recovery (inbox/tracker) if missing
  if (state.status === "done") {
    return maybeApplyApproveCloseout(repoRoot, state);
  }

  const now = deps.now ?? Date.now;
  const timeoutMs = deps.peerTimeoutMs ?? DEFAULT_PEER_TIMEOUT_MS;
  const queuePeers = deps.queuePeers ?? defaultQueuePeers;
  const spawnFilenames = deps.spawnFilenames ?? defaultSpawnFilenames;
  const spawnMerge = deps.spawnMerge ?? defaultSpawnMerge;

  if (state.status === "awaiting_ceo_intake") {
    const runId = state.ceoIntakeRunId;
    if (!runId) {
      return pulse(repoRoot, { ...state, status: "failed", error: "missing ceoIntakeRunId" }, "Phase 0 failed — missing CEO run.");
    }
    const status = readRunStatus(repoRoot, runId);
    if (status === "error" || status === "cancelled") {
      return pulse(
        repoRoot,
        { ...state, status: "failed", error: `CEO intake ${status}` },
        `Phase 0 failed — CEO intake ${status}.`,
      );
    }
    if (!runFinishedOk(status)) return state;
    if (!existsSync(intakeAbs(repoRoot))) {
      return pulse(
        repoRoot,
        { ...state, status: "failed", error: "00-intake.md missing after CEO run" },
        "Phase 0 failed — intake file missing.",
      );
    }

    // Claim wave before side effects so nested snapshot/advance cannot double-spawn.
    const ts = new Date(now()).toISOString();
    pulse(
      repoRoot,
      {
        ...state,
        status: "peers_running",
        peersStartedAt: ts,
        peerRunIds: { ...state.peerRunIds },
      },
      "CEO intake done — spinning up CFO, CMO, COO, and research.",
    );

    const items = planPhase0PeerBatch();
    const queued = queuePeers(repoRoot, items);
    const spawned = spawnFilenames(repoRoot, queued.filenames);
    const peerRunIds: Record<string, string> = { ...state.peerRunIds };
    for (const s of spawned.started) {
      peerRunIds[s.position] = s.runId;
    }
    return pulse(
      repoRoot,
      {
        ...state,
        status: "peers_running",
        peerRunIds,
        peersStartedAt: ts,
      },
      "CEO intake done — spinning up CFO, CMO, COO, and research.",
    );
  }

  if (state.status === "peers_running") {
    const briefs = collectPeerBriefs(repoRoot);
    const allPresent = PHASE0_PEER_SEATS.every((s) => briefs[s]);
    const startedMs = Date.parse(state.peersStartedAt || state.updatedAt || state.startedAt);
    const timedOut =
      Number.isFinite(startedMs) && now() - startedMs >= timeoutMs;
    const canMerge = allPresent || (timedOut && Object.keys(briefs).length > 0);
    if (!canMerge) {
      if (timedOut && Object.keys(briefs).length === 0) {
        return pulse(
          repoRoot,
          {
            ...state,
            status: "failed",
            error: "peer timeout with no briefs",
            partial: true,
          },
          "Phase 0 failed — peers timed out with no briefs.",
        );
      }
      return { ...state, peerBriefs: briefs };
    }

    const partial = !allPresent;
    const goal = buildMergeGoal(partial, briefs);
    // Claim merge wave before spawnMerge (may loadSnapshot).
    pulse(
      repoRoot,
      {
        ...state,
        status: "awaiting_ceo_merge",
        peerBriefs: briefs,
        partial,
      },
      partial
        ? "Peers partial — CEO merging C-suite review."
        : "Peers done — CEO merging C-suite review.",
    );
    const { runId } = spawnMerge(repoRoot, goal);
    return pulse(
      repoRoot,
      {
        ...state,
        status: "awaiting_ceo_merge",
        peerBriefs: briefs,
        mergeRunId: runId,
        partial,
      },
      partial
        ? "Peers partial — CEO merging C-suite review."
        : "Peers done — CEO merging C-suite review.",
    );
  }

  if (state.status === "rewaking_peers") {
    const seats = (state.rewakeSeats ?? []).filter(Boolean);
    if (!seats.length) {
      return pulse(
        repoRoot,
        { ...state, status: "failed", error: "rewaking_peers with empty rewakeSeats" },
        "Phase 0 failed — rewake seats missing.",
      );
    }
    const allDone = seats.every((seat) => {
      const runId = state.peerRunIds[seat];
      if (!runId) return false;
      return runFinishedOk(readRunStatus(repoRoot, runId));
    });
    if (!allDone) return state;

    const briefs = collectPeerBriefs(repoRoot);
    const goal = buildMergeGoal(false, briefs);
    pulse(
      repoRoot,
      {
        ...state,
        status: "awaiting_ceo_merge",
        peerBriefs: briefs,
        rewakeSeats: [],
      },
      `Rewake done (${seats.join(", ")}) — CEO re-merging C-suite review.`,
    );
    const { runId } = spawnMerge(repoRoot, goal);
    return pulse(
      repoRoot,
      {
        ...state,
        status: "awaiting_ceo_merge",
        peerBriefs: briefs,
        mergeRunId: runId,
        rewakeSeats: [],
      },
      `Rewake done (${seats.join(", ")}) — CEO re-merging C-suite review.`,
    );
  }

  if (state.status === "awaiting_ceo_merge") {
    const mergeId = state.mergeRunId;
    if (!mergeId) return state;
    const status = readRunStatus(repoRoot, mergeId);
    if (status === "error" || status === "cancelled") {
      return pulse(
        repoRoot,
        { ...state, status: "failed", error: `CEO merge ${status}` },
        `Phase 0 failed — CEO merge ${status}.`,
      );
    }
    if (!runFinishedOk(status)) return state;

    const verdict = readCsuiteVerdict(repoRoot);
    const rewake = readRewakeSeats(repoRoot).filter((s) =>
      (PHASE0_PEER_SEATS as readonly string[]).includes(s),
    );
    const rewakeCount = state.rewakeCount ?? 0;
    if (
      (verdict === "approve" || verdict === "skip-review") &&
      rewake.length > 0 &&
      rewakeCount < 1 &&
      !state.closeoutApplied
    ) {
      const items = planPhase0RewakeBatch(rewake);
      if (!items.length) {
        return pulse(
          repoRoot,
          state,
          `CEO merge asks rewake but seats invalid: ${rewake.join(", ")}.`,
        );
      }
      const ts = new Date(now()).toISOString();
      pulse(
        repoRoot,
        {
          ...state,
          status: "rewaking_peers",
          rewakeSeats: items.map((i) => i.position),
          rewakeCount: rewakeCount + 1,
          peersStartedAt: ts,
        },
        `CEO declined peer briefs — respawning ${items.map((i) => i.position).join(", ")}.`,
      );
      const queued = queuePeers(repoRoot, items);
      const spawned = spawnFilenames(repoRoot, queued.filenames);
      const peerRunIds: Record<string, string> = { ...state.peerRunIds };
      for (const s of spawned.started) {
        peerRunIds[s.position] = s.runId;
      }
      return pulse(
        repoRoot,
        {
          ...state,
          status: "rewaking_peers",
          rewakeSeats: items.map((i) => i.position),
          rewakeCount: rewakeCount + 1,
          peerRunIds,
          peersStartedAt: ts,
        },
        `CEO declined peer briefs — respawning ${items.map((i) => i.position).join(", ")}.`,
      );
    }
    if (verdict === "approve" || verdict === "skip-review" || verdict === "block") {
      const findings =
        spokenPhase0FindingsBrief(repoRoot) ||
        `Phase 0 C-suite roundtable done — verdict ${verdict}.`;
      const done = pulse(
        repoRoot,
        { ...state, status: "done", rewakeSeats: [] },
        findings,
      );
      if (verdict === "approve" || verdict === "skip-review") {
        return maybeApplyApproveCloseout(repoRoot, done);
      }
      // Soft decline of the roundtable — clear pending noise so UI is not stuck.
      try {
        setReviewInboxStatus(repoRoot, { status: "declined", phase: "0" });
      } catch {
        /* ignore */
      }
      return done;
    }

    // Merge finished but no terminal verdict yet — keep awaiting (operator/CEO may still edit)
    return state;
  }

  return state;
}

/** Ensure DISPATCH dir exists for venture fixtures that call start without spawn dirs. */
export function ensurePhase0DispatchLayout(repoRoot: string): void {
  mkdirSync(join(businessIdeaRoot(repoRoot), "DISPATCH"), { recursive: true });
  mkdirSync(join(businessIdeaRoot(repoRoot), "HANDOFFS"), { recursive: true });
}
