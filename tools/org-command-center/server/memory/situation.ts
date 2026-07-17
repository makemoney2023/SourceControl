import type { MemoryBrief, SituationInput } from "./types";

const MAX_ITEMS = 5;

function cap(items: string[]): string[] {
  return items.slice(0, MAX_ITEMS);
}

function extractBlockersFromRunLine(line: string): string[] {
  const blockers: string[] = [];
  const gapMatch = line.match(/acceptance gap:\s*(.+)/i);
  if (gapMatch) {
    blockers.push(gapMatch[1].trim());
    return blockers;
  }
  if (/\bfailed\b/i.test(line)) {
    blockers.push(line.trim());
    return blockers;
  }
  if (/\bblocker\b/i.test(line)) {
    blockers.push(line.trim());
  }
  return blockers;
}

function buildSuggestion(input: SituationInput, blockers: string[]): string {
  const blockerText = blockers.join(" ").toLowerCase();
  const runText = input.recentRunLines.join(" ").toLowerCase();
  const nextAction = input.mission.nextAction.trim();

  if (/inbox/.test(blockerText) || /inbox/.test(runText)) {
    return `Rewake or queue the owning seat to ${nextAction}.`;
  }

  if (nextAction.length > 0) {
    return `Focus on ${nextAction}.`;
  }

  return "Review the current mission tracker for the next move.";
}

export function composeMemoryBrief(input: SituationInput): MemoryBrief {
  const memoryThin =
    input.recentSessionLines.length === 0 &&
    input.decisionLines.length === 0 &&
    input.preferenceLines.length === 0;

  const sources: string[] = [];

  if (input.recentSessionLines.length > 0) {
    sources.push("MEMORY/sessions");
  }
  if (input.decisionLines.length > 0) {
    sources.push("MEMORY/decisions.md");
  }
  if (input.preferenceLines.length > 0) {
    sources.push("MEMORY/preferences.md");
  }
  if (input.mission.idea || input.mission.nextAction) {
    sources.push("mission");
  }
  if (input.recentRunLines.length > 0) {
    sources.push("runs");
  }

  const done = cap(input.recentSessionLines.slice(-MAX_ITEMS));

  const next: string[] = [];
  if (input.mission.nextAction.trim()) {
    next.push(input.mission.nextAction.trim());
  }

  const blockers: string[] = [];
  for (const line of input.recentRunLines) {
    blockers.push(...extractBlockersFromRunLine(line));
  }
  if (input.mission.blockerCount > 0 && blockers.length === 0) {
    const count = input.mission.blockerCount;
    blockers.push(count === 1 ? "1 open blocker" : `${count} open blockers`);
  }

  const suggestion = buildSuggestion(input, blockers);

  return {
    done,
    next: cap(next),
    blockers: cap(blockers),
    suggestion,
    sources,
    memoryThin,
  };
}

export function speakMemoryBrief(brief: MemoryBrief): string {
  const sentences: string[] = [];

  if (brief.done.length > 0) {
    sentences.push(`Recently: ${brief.done[brief.done.length - 1]}.`);
  }

  if (brief.next.length > 0) {
    sentences.push(`Next is ${brief.next[0]}.`);
  }

  if (brief.blockers.length > 0) {
    if (brief.suggestion.length > 0) {
      sentences.push(`${brief.blockers[0]} — ${brief.suggestion.replace(/\.$/, "")}.`);
    } else {
      sentences.push(`${brief.blockers[0]}.`);
    }
  } else if (brief.suggestion.length > 0) {
    sentences.push(brief.suggestion.endsWith(".") ? brief.suggestion : `${brief.suggestion}.`);
  }

  if (brief.memoryThin && sentences.length === 0) {
    sentences.push("Memory is thin; leaning on live mission state.");
  }

  if (brief.memoryThin && sentences.length > 0 && sentences.length < 3) {
    sentences.push("Venture memory is still thin.");
  }

  return sentences.slice(0, 3).join(" ");
}
