import type { HandoffRecord, PhaseOwner, Tracker } from "../lib/types";

export const HARD_GATES = new Set(["3", "6", "10", "14", "19", "21"]);

export interface MissionState {
  idea: string;
  currentPhase: string;
  currentPhaseName: string;
  currentStatus: string;
  progressPct: number;
  done: number;
  active: number;
  pending: number;
  skipped: number;
  nextAction: string;
  ownerSlug: string;
  queueDepth: number;
  blockerCount: number;
  openQuestions: string[];
  latestDecision: string;
  hardGate: boolean;
  parallelTracks: string[];
  spendUsd?: number;
}

function extractOpenQuestions(raw: string): string[] {
  const idx = raw.indexOf("## Open questions");
  if (idx === -1) return [];
  const slice = raw.slice(idx);
  const end = slice.slice(2).search(/\n## /);
  const block = end === -1 ? slice : slice.slice(0, end + 2);
  return block
    .split("\n")
    .map((l) => l.replace(/^[-*]\s*/, "").trim())
    .filter((l) => l && !l.startsWith("#") && l !== "(none)" && !l.startsWith("Status:"));
}

function extractLatestDecision(raw: string): string {
  const idx = raw.indexOf("## Decisions log");
  if (idx === -1) return "";
  const lines = raw
    .slice(idx)
    .split("\n")
    .filter((l) => l.startsWith("|") && !l.includes("---") && !l.includes("Date"));
  const last = lines[lines.length - 1];
  if (!last) return "";
  const cells = last
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
  return cells.slice(1).join(" — ");
}

export function buildMission(
  tracker: Tracker,
  phaseOwners: PhaseOwner[],
  handoffs: HandoffRecord[],
  queueDepth: number,
): MissionState {
  const countable = tracker.phases.filter((p) => p.status !== "⏭️");
  const done = countable.filter((p) => p.status === "✅").length;
  const pending = countable.filter((p) => p.status === "⬜").length;
  const active = countable.filter((p) => p.status === "🔄").length;
  const skipped = tracker.phases.filter((p) => p.status === "⏭️").length;
  const progressPct =
    countable.length === 0 ? 0 : Math.round((done / countable.length) * 100);

  const current =
    tracker.phases.find((p) => p.phase === tracker.currentPhase) ??
    tracker.phases.find((p) => p.status === "🔄") ??
    tracker.phases.find((p) => p.status === "⬜");

  const owner =
    phaseOwners.find((p) => p.phase === (current?.phase ?? tracker.currentPhase))
      ?.managerOwner ?? "";

  const blockers = handoffs.filter(
    (h) =>
      h.status === "blocked" ||
      h.status === "needs_input" ||
      h.verdictForManager === "escalate",
  ).length;

  const openQuestions = extractOpenQuestions(tracker.raw);
  const hardGate = HARD_GATES.has(current?.phase ?? tracker.currentPhase);
  const phaseNum = Number.parseFloat(current?.phase ?? tracker.currentPhase);
  const parallelTracks =
    !Number.isNaN(phaseNum) && phaseNum >= 10
      ? ["Build", "Brand", "Content", "Channels"]
      : [];

  const nextAction = current
    ? `Phase ${current.phase} ${current.name} — owned by ${owner || "unassigned"} — queue ${queueDepth}`
    : "No active phase";

  return {
    idea: tracker.idea,
    currentPhase: current?.phase ?? tracker.currentPhase,
    currentPhaseName: current?.name ?? "",
    currentStatus: current?.status ?? "",
    progressPct,
    done,
    active,
    pending,
    skipped,
    nextAction,
    ownerSlug: owner,
    queueDepth,
    blockerCount: blockers + openQuestions.length,
    openQuestions,
    latestDecision: extractLatestDecision(tracker.raw),
    hardGate,
    parallelTracks,
  };
}

export function missionBriefScript(mission: MissionState): string {
  const parts = [
    `${mission.idea || "The company"}.`,
    `We are on phase ${mission.currentPhase}, ${mission.currentPhaseName}, status ${mission.currentStatus}.`,
    `Progress ${mission.progressPct} percent complete.`,
    mission.nextAction + ".",
  ];
  if (mission.hardGate) parts.push("This phase is a hard C-suite gate.");
  if (mission.blockerCount > 0) {
    parts.push(`There are ${mission.blockerCount} blockers or open questions.`);
  }
  if (mission.openQuestions[0]) {
    parts.push(`Open question: ${mission.openQuestions[0]}`);
  }
  return parts.join(" ");
}
