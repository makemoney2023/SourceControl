import type { MissionState } from "../../src/jarvis/mission";
import { loadSnapshot } from "../snapshot";
import { listSources } from "../sources/store";
import { memoryBrief } from "../memory";
import {
  loadPhase0Roundtable,
  spokenPhase0FindingsBrief,
} from "./phase0-roundtable";

export type MissionBriefInput = Pick<
  MissionState,
  "idea" | "currentPhase" | "currentPhaseName" | "progressPct" | "blockerCount" | "nextAction"
>;

export function spokenMissionBrief(mission: MissionBriefInput): string {
  const name = mission.idea || "The venture";
  const phaseLabel = mission.currentPhaseName
    ? `Phase ${mission.currentPhase} ${mission.currentPhaseName}`
    : `Phase ${mission.currentPhase}`;

  const opener = `${name} on ${phaseLabel}, ${mission.progressPct}% complete.`;

  if (mission.blockerCount > 0) {
    const blockerText =
      mission.blockerCount === 1 ? "One blocker" : `${mission.blockerCount} blockers`;
    return `${opener} ${blockerText} open; next is ${mission.nextAction}.`;
  }

  return `${opener} Next is ${mission.nextAction}.`;
}

export async function buildJarvisContext(repoRoot: string) {
  const snap = loadSnapshot(repoRoot);
  const { sources, contextNote } = listSources(repoRoot);
  const truncated = contextNote.trim().slice(0, 500);

  let spokenBrief: string;
  const phase0 = loadPhase0Roundtable(repoRoot);
  const phase0Pulse = phase0?.pulse?.trim();
  if (phase0?.status === "done") {
    // Prefer findings from 0-csuite-review.md over a thin "verdict approve" pulse.
    spokenBrief =
      spokenPhase0FindingsBrief(repoRoot) ||
      phase0Pulse ||
      spokenMissionBrief(snap.mission);
  } else if (phase0Pulse && phase0?.status && phase0.status !== "failed") {
    // Live roundtable pulse beats stale tracker "Next is Phase 0 Intake…"
    spokenBrief = phase0Pulse;
  } else {
    try {
      const brief = await memoryBrief(repoRoot);
      spokenBrief = brief.spoken;
    } catch {
      spokenBrief = spokenMissionBrief(snap.mission);
    }
  }

  // Keep wake/FAB speech clean — never append MEMORY context prose (often noisy).
  // Only mention attached sources when present.
  if (sources.length > 0) {
    spokenBrief += ` ${sources.length} source${sources.length === 1 ? "" : "s"} attached.`;
  }

  return {
    mission: snap.mission,
    spokenBrief,
    contextNote: truncated,
    sourcesCount: sources.length,
  };
}
