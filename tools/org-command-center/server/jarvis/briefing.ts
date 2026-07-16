import type { MissionState } from "../../src/jarvis/mission";
import { loadSnapshot } from "../snapshot";

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

export function buildJarvisContext(repoRoot: string) {
  const snap = loadSnapshot(repoRoot);
  return {
    mission: snap.mission,
    spokenBrief: spokenMissionBrief(snap.mission),
  };
}
