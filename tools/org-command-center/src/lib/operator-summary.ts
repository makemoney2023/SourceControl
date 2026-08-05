export type OperatorSummary = {
  plainEnglish: string[];
  findings: string[];
  nextSteps: string[];
};

/** Narrative sections for seat console / report — same for every role. */
export type SeatBusinessBrief = {
  whatHappened: string[];
  whyItMatters: string[];
  nextSteps: string[];
  needsFromYou: string[];
  whatsStuck: string[];
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

/** Strip markdown emphasis / code fences for operator-facing UI. */
export function stripOperatorProse(text: string): string {
  return text
    .replace(/\*\*|__/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^#+\s*/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

function proseLines(body: string): string[] {
  return body
    .split(/\n+/)
    .map((l) => l.replace(/^\s*[-*+\d.]+\s+/, "").trim())
    .map((l) => stripOperatorProse(l))
    .filter((l) => l.length > 0 && !/^\|/.test(l) && !/^[-:| ]+$/.test(l));
}

/**
 * Process / template asks that are not real operator questions
 * (e.g. "Peer help needed: none").
 */
export function isActionableAsk(raw: string): boolean {
  const t = stripOperatorProse(raw);
  if (!t || t.length < 8) return false;
  if (/^\|/.test(t) || /^[-:| ]+$/.test(t)) return false;
  if (/\b(peer help needed|clarification needed)\b/i.test(t) && /\bnone\b/i.test(t)) {
    return false;
  }
  if (/^(peer help|clarification needed):\s*none\b/i.test(t)) return false;
  if (/^none\b/i.test(t)) return false;
  return true;
}

/** Cap and clean risk/blocker lines for a business conversation. */
export function humanizeBlockers(blockers: string[], max = 4): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of blockers) {
    const line = stripOperatorProse(raw);
    if (!line || /^\|/.test(raw.trim()) || /^[-:| ]+$/.test(raw.trim())) continue;
    if (/^\|/.test(line) || /\|\s*-+\s*\|/.test(line)) continue;
    // Drop pure table header remnants after strip
    if (/^Risk\s+Severity\s+Mitigation$/i.test(line)) continue;
    let cleaned = line
      .replace(/\b([A-Z]\d+)\b/g, "") // D2, Q4, R3, W1 internal codes
      .replace(/\b(SD\d+|M-\d+)\b/g, "")
      .replace(/\s{2,}/g, " ")
      .replace(/\s+([,;.])/g, "$1")
      .trim();
    if (cleaned.length < 12) continue;
    if (cleaned.length > 160) cleaned = `${cleaned.slice(0, 157).trimEnd()}…`;
    const key = cleaned.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(cleaned);
    if (out.length >= max) break;
  }
  return out;
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

/** Extract ## Decisions bullets from a handoff or deliverable. */
export function extractDecisions(markdown: string): string[] {
  const body = sectionBody(markdown, /^##\s+Decisions\b/i);
  return proseLines(body).slice(0, 8);
}

/**
 * Merge handoff asks with blocking-question lines from Next steps.
 * Drops process "none" noise, strips markdown, deduplicates case-insensitively.
 */
export function collectOpenQuestions(
  asks: string[],
  nextSteps: string[],
): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  const push = (q: string) => {
    if (!isActionableAsk(q)) return;
    let t = stripOperatorProse(q)
      .replace(/^(c-suite ask|operator ask|ask):\s*/i, "")
      .trim();
    if (!isActionableAsk(t)) return;
    if (t.length > 180) t = `${t.slice(0, 177).trimEnd()}…`;
    const key = t.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    out.push(t);
  };
  for (const a of asks) push(a);
  for (const step of nextSteps) {
    if (
      /\bblocking question\b/i.test(step) ||
      /\?\s*$/.test(step) ||
      /^blocking:/i.test(step)
    ) {
      push(step.replace(/^\s*blocking question:\s*/i, "").trim());
    }
  }
  return out.slice(0, 12);
}

/**
 * Assemble a business-conversation brief for any seat role.
 * Prefers operator narrative sections; falls back lightly when missing.
 */
export function buildSeatBusinessBrief(input: {
  operatorSummary: OperatorSummary;
  decisions?: string[];
  openQuestions: string[];
  blockers: string[];
  fallbackSummary?: string;
}): SeatBusinessBrief {
  const whatHappened =
    input.operatorSummary.plainEnglish.length > 0
      ? input.operatorSummary.plainEnglish.map(stripOperatorProse).filter(Boolean)
      : input.fallbackSummary?.trim()
        ? [stripOperatorProse(input.fallbackSummary)].filter(
            (l) => l.length > 12 && !/^(idle|done|blocked|needs_input)$/i.test(l),
          )
        : [];

  const whyItMatters = [
    ...(input.decisions ?? []).map(stripOperatorProse),
    ...input.operatorSummary.findings.map(stripOperatorProse),
  ]
    .filter(Boolean)
    .filter((l, i, arr) => arr.findIndex((x) => x.toLowerCase() === l.toLowerCase()) === i)
    .slice(0, 6);

  const nextSteps = input.operatorSummary.nextSteps
    .map(stripOperatorProse)
    .filter(Boolean)
    .slice(0, 5);

  return {
    whatHappened,
    whyItMatters,
    nextSteps,
    needsFromYou: input.openQuestions.slice(0, 6),
    whatsStuck: humanizeBlockers(input.blockers, 4),
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
