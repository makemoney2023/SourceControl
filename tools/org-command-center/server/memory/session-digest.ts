export function buildSessionDigestMarkdown(args: {
  ventureName: string;
  slug: string;
  at: Date;
  operatorSummary?: string;
  missionLine: string;
  runLines: string[];
  noteLines: string[];
}): string {
  const { ventureName, slug, at, operatorSummary, missionLine, runLines, noteLines } = args;
  const iso = at.toISOString();
  const lines: string[] = [
    `# Session digest — ${ventureName} (${slug})`,
    "",
    `**At:** ${iso}`,
    "",
    "## Operator summary",
    "",
    operatorSummary?.trim() ? operatorSummary.trim() : "_(none)_",
    "",
    "## Mission",
    "",
    missionLine.trim() || "_(unknown)_",
    "",
  ];

  lines.push("## Runs", "");
  if (runLines.length > 0) {
    for (const run of runLines) {
      lines.push(`- ${run}`);
    }
  } else {
    lines.push("_(none)_");
  }
  lines.push("");

  lines.push("## Notes", "");
  if (noteLines.length > 0) {
    for (const note of noteLines) {
      lines.push(`- ${note}`);
    }
  } else {
    lines.push("_(none)_");
  }
  lines.push("");

  return lines.join("\n");
}
