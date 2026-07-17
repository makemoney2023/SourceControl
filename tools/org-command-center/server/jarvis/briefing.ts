import type { MissionState } from "../../src/jarvis/mission";
import { loadSnapshot } from "../snapshot";
import { listSources } from "../sources/store";
import { memoryBrief } from "../memory";

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
  try {
    const brief = await memoryBrief(repoRoot);
    spokenBrief = brief.spoken;
  } catch {
    spokenBrief = spokenMissionBrief(snap.mission);
  }

  if (truncated || sources.length > 0) {
    if (truncated) {
      spokenBrief += ` Context note on file; ${sources.length} sources attached.`;
    } else {
      spokenBrief += ` ${sources.length} source${sources.length === 1 ? "" : "s"} attached.`;
    }
  }

  return {
    mission: snap.mission,
    spokenBrief,
    contextNote: truncated,
    sourcesCount: sources.length,
  };
}
