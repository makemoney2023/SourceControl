import matter from "gray-matter";
import type { StandupBriefing } from "./csuite";

export function parseStandupBriefing(slug: string, content: string): StandupBriefing {
  const { data, content: body } = matter(content);
  const progressMatch = body.match(/## Progress\n([\s\S]*?)(?:\n## |$)/);
  return {
    slug: String(data.position ?? slug),
    status: String(data.status ?? "on_track"),
    phaseFocus: String(data.phase_focus ?? ""),
    progress: (progressMatch?.[1] ?? body).trim(),
    updatedAt: String(data.updated_at ?? ""),
    raw: content,
  };
}

export function renderStandupBriefing(input: {
  position: string;
  phase_focus: string;
  status: "on_track" | "at_risk" | "blocked";
  escalation_tags: string[];
  progress: string;
  asks: string;
  blockers: string;
}): string {
  const updated = new Date().toISOString();
  return `---
schema_version: 1
position: ${input.position}
updated_at: ${updated}
phase_focus: "${input.phase_focus}"
status: ${input.status}
escalation_tags: [${input.escalation_tags.map((t) => JSON.stringify(t)).join(", ")}]
---

# Standup — ${input.position}

## Progress
${input.progress.trim() || "-"}

## Asks
${input.asks.trim() || "- none"}

## Blockers
${input.blockers.trim() || "- none"}
`;
}
