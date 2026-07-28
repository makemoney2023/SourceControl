export type OperatorSummary = {
  plainEnglish: string[];
  findings: string[];
  nextSteps: string[];
};

function sectionBody(markdown: string, heading: RegExp): string {
  const lines = markdown.split("\n");
  let i = 0;
  for (; i < lines.length; i++) {
    if (heading.test(lines[i]!)) {
      i += 1;
      break;
    }
  }
  if (i >= lines.length && !heading.test(markdown)) return "";
  const body: string[] = [];
  for (; i < lines.length; i++) {
    const line = lines[i]!;
    if (/^##\s+/.test(line)) break;
    body.push(line);
  }
  return body.join("\n").trim();
}

function proseLines(body: string): string[] {
  return body
    .split(/\n+/)
    .map((l) => l.replace(/^\s*[-*+\d.]+\s+/, "").trim())
    .map((l) => l.replace(/\*\*|__/g, "").replace(/`([^`]+)`/g, "$1").trim())
    .filter((l) => l.length > 0 && !/^\|/.test(l) && !/^[-:| ]+$/.test(l));
}

/** Extract operator-facing sections from a worker deliverable or brief. */
export function extractOperatorSummary(markdown: string): OperatorSummary {
  const plainBody = sectionBody(
    markdown,
    /^##\s+(In plain English|Plain English|Operator summary)\b/i,
  );
  const findingsBody = sectionBody(
    markdown,
    /^##\s+(What we (found|decided)|Findings|Key findings)\b/i,
  );
  const nextBody = sectionBody(markdown, /^##\s+(Next steps|What happens next)\b/i);

  return {
    plainEnglish: proseLines(plainBody).slice(0, 5),
    findings: proseLines(findingsBody).slice(0, 6),
    nextSteps: proseLines(nextBody).slice(0, 5),
  };
}

/** Short TTS-friendly line for Jarvis; null if sections are empty. */
export function formatOperatorSummarySpoken(
  summary: OperatorSummary,
  maxLen = 420,
): string | null {
  const parts: string[] = [];
  if (summary.plainEnglish.length) {
    parts.push(summary.plainEnglish.join(" "));
  } else if (summary.findings.length) {
    parts.push(summary.findings.slice(0, 2).join(" "));
  }
  if (summary.nextSteps.length) {
    parts.push(`Next: ${summary.nextSteps[0]}`);
  }
  if (!parts.length) return null;
  let out = parts.join(" ").replace(/\s+/g, " ").trim();
  if (out.length > maxLen) out = `${out.slice(0, maxLen - 1).trimEnd()}…`;
  return out;
}

/** Block injected into Cursor spawn prompts for composer / Grok workers. */
export const OPERATOR_DELIVERABLE_FORMAT = [
  "## Operator deliverable format (required)",
  "Your REVIEW/inbox deliverable MUST be understandable to a non-technical operator.",
  "Put these sections near the top of the deliverable (after the title), before tables or model audit:",
  "",
  "### In plain English",
  "- 3–5 short sentences. What happened, what it means, and whether work is ready to continue.",
  "- No YAML dumps, no runIds, no raw path laundry lists, no scorecard tables here.",
  "",
  "### What we found",
  "- Up to 5 bullets of the load-bearing facts or assumptions (numbers ok if labeled).",
  "",
  "### Next steps",
  "- 3–5 numbered steps. Each step names who acts (operator, CEO, CFO, research, …) and the concrete ask.",
  "- End with any blocking questions the operator must answer before the next phase.",
  "",
  "Manager briefs and C-suite reviews must use the same three sections (or equivalent headings).",
].join("\n");
