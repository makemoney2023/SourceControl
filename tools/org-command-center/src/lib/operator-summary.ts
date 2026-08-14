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
  // Peer help already marked done — not an open operator ask.
  if (/^peer help needed:/i.test(t) && /\(\s*done\b/i.test(t)) return false;
  return true;
}

/** Strip internal refs that read as worker jargon to an operator. */
function scrubInternalRefs(text: string): string {
  return text
    .replace(/\bsee\s+HANDOFFS\/[\w./#-]+/gi, "")
    .replace(/\bHANDOFFS\/[\w./#-]+/gi, "")
    .replace(/\bapps\/[\w./-]+/gi, "the old codebase")
    .replace(/§[\w./-]+/g, "")
    .replace(/\bPhase\s+\d+[a-z]?\b/gi, "")
    .replace(/\b\d{1,2}-[A-Z]\b/g, "")
    .replace(/\b(SD\d+|M-\d+)\b/g, "")
    .replace(/\b([A-Z]\d+)\b/g, "")
    .replace(/\bGLB\b/g, "3D model")
    .replace(/\bWebGL\b/g, "3D web")
    .replace(/\bScrollControls\b/gi, "scroll experience")
    .replace(/\bHeroIsland\b/gi, "hero 3D scene")
    .replace(/\bPlaceholderSlot\b/g, "placeholder slots")
    .replace(/\bbox-dog\b/gi, "geometric stand-in")
    .replace(/\bHybrid hard lock\b/gi, "agreed hybrid layout")
    .replace(/\bv1\b/gi, "the previous version")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,;.])/g, "$1")
    .replace(/\s+[—-]\s*$/g, "")
    .replace(/\bper\s*\.?$/i, "")
    .replace(/\bfrom\s*\.?$/i, "")
    .trim();
}

/**
 * Rewrite handoff asks into plain questions an operator can answer.
 * Returns null when the ask is process noise or already resolved.
 */
export function humanizeOperatorAsk(raw: string): string | null {
  if (!isActionableAsk(raw)) return null;
  let t = scrubInternalRefs(stripOperatorProse(raw));
  if (!t) return null;

  if (/^peer help needed:/i.test(t) && /\(\s*done\b/i.test(t)) return null;

  const clarification = t.match(/^clarification needed:\s*(.+)$/i);
  if (clarification) {
    t = clarification[1]!.replace(/^operator\s+/i, "").trim();
    t = t
      .replace(/\bundocked-tail hard yes\b/gi, "approval to keep the undocked-tail brand mark")
      .replace(/\bcommercial 3D asset budget cap\b/gi, "budget limit for buying commercial 3D assets")
      .replace(/\s*\+\s*/g, " and ");
    if (/budget|purchase|3D asset/i.test(t) && !/[?]$/.test(t)) {
      t =
        "What is your budget limit for buying commercial 3D assets, and do you approve the undocked-tail brand mark before we purchase?";
    } else if (!/[?]$/.test(t)) {
      t = /budget|cap|yes|confirm|approve|which|what|when|who|do you/i.test(t)
        ? `Please confirm: ${t.replace(/\.$/, "")}?`
        : `What should we do about this: ${t.replace(/\.$/, "")}?`;
    }
  }

  const peer = t.match(/^peer help needed:\s*(.+)$/i);
  if (peer) {
    const body = scrubInternalRefs(peer[1]!.trim());
    const roleFor = body.match(/^([^,:]+?)\s+for\s+(.+)$/i);
    if (roleFor) {
      let who = roleFor[1]!.trim();
      if (/^cto$/i.test(who)) who = "engineering (CTO)";
      if (/^copy-chief$/i.test(who)) who = "the copywriter";
      const why = roleFor[2]!
        .replace(/\s*[—-]\s*not a block on .+$/i, "")
        .replace(/\bbefore\s+merge\b/gi, "")
        .replace(/\boptimize pipeline\b/gi, "optimization")
        .replace(/\blicense diligence sign-off\b/gi, "license approval")
        .replace(/\bperf gate\b/gi, "performance check")
        .replace(/\.$/, "")
        .replace(/\s{2,}/g, " ")
        .trim();
      t = `Should we wait for ${who} on ${why} before continuing, or keep moving without that?`;
    } else {
      t = `Should we wait on teammate help for this before continuing: ${body.replace(/\.$/, "")}?`;
    }
  }

  t = t
    .replace(/^(c-suite ask|operator ask|ask):\s*/i, "")
    .replace(/\(\s*CEO assumed yes\s*\)/gi, "(CEO assumed yes)")
    .trim();
  t = scrubInternalRefs(t);
  if (!isActionableAsk(t) || t.length < 12) return null;
  if (t.length > 220) t = `${t.slice(0, 217).trimEnd()}…`;
  return t;
}

/** Soften decision / finding lines for a non-technical operator. */
export function humanizeBusinessLine(raw: string): string | null {
  let t = scrubInternalRefs(stripOperatorProse(raw));
  if (!t || /^\|/.test(t) || /^[-:| ]+$/.test(t)) return null;
  if (/^Risk\s+Severity\s+Mitigation$/i.test(t)) return null;

  t = t
    .replace(/^Default home\s*=\s*/i, "Home page defaults to ")
    .replace(/\bphotography documentary chapters\b/gi, "photography-led story chapters")
    .replace(/\bnot geometric stand-in 3D web\b/gi, "not a geometric 3D stand-in")
    .replace(
      /\b3D web scroll experience only when licensed 3D model \+ gate pass\b/gi,
      "3D scroll only turns on after a licensed model clears legal and quality checks",
    )
    .replace(
      /\bProof band remains HTML mid-path\b/gi,
      "Proof section stays as normal web content mid-page",
    )
    .replace(/\bagreed hybrid layout\b/gi, "the agreed hybrid layout")
    .replace(
      /\bNo purple\/cream;\s*Fraunces\/Manrope(?:\s+per)?\b/gi,
      "Keep brand colors off purple/cream; use Fraunces and Manrope typefaces",
    )
    .replace(
      /\bChapter chrome uses program kickers\b/gi,
      "Chapter labels use kennel-program style kickers",
    )
    .replace(/\bnot “Scene · id” film meta alone\b/gi, "not thin film-meta labels alone")
    .replace(/\bnot "Scene · id" film meta alone\b/gi, "not thin film-meta labels alone")
    .replace(/\s{2,}/g, " ")
    .trim();

  if (t.length < 12) return null;
  if (t.length > 200) t = `${t.slice(0, 197).trimEnd()}…`;
  return t;
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

    let cleaned: string | null = null;
    if (/patch risk|copy v1|file tree/i.test(line)) {
      cleaned =
        "Engineering must start a new site project instead of copying the previous codebase";
    } else if (/begin your inquiry|\/apply/i.test(line)) {
      cleaned =
        'The live site must use /inquire (not the old “Begin your inquiry” /apply path)';
    } else if (/sparse tier|hero photo depend|PlaceholderSlot/i.test(line)) {
      cleaned =
        "Real dog and hero photos are still missing, so the site will look thin until you supply them";
    } else if (/form backend|blocks public launch/i.test(line)) {
      cleaned = "The contact form still needs a real backend before public launch";
    } else {
      cleaned = humanizeBusinessLine(line) ?? scrubInternalRefs(line);
    }

    cleaned = cleaned.replace(/\s{2,}/g, " ").trim();
    if (cleaned.length < 12) continue;
    if (cleaned.length > 180) cleaned = `${cleaned.slice(0, 177).trimEnd()}…`;
    const key = cleaned.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(cleaned);
    if (out.length >= max) break;
  }
  return out;
}

/** Headings seats use for the operator-authored narrative (source of truth). */
const OPERATOR_BRIEF_HEADING =
  /^##\s+(Operator brief(?:\s*\(plain English\))?|In plain English|Plain English|Operator summary)\b/i;

/** Extract operator-facing sections from a worker deliverable or brief. */
export function extractOperatorSummary(markdown: string): OperatorSummary {
  const plainBody = sectionBody(markdown, OPERATOR_BRIEF_HEADING);
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

/**
 * When the seat already wrote an operator brief at the source, skip post-hoc Grok rewrite.
 */
export function shouldSkipGrokBriefRewrite(summary: OperatorSummary): boolean {
  return summary.plainEnglish.length > 0;
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
    const t = humanizeOperatorAsk(q);
    if (!t) return;
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
  const plain = input.operatorSummary.plainEnglish
    .map((l) => humanizeBusinessLine(l) ?? stripOperatorProse(l))
    .filter(Boolean);

  const whyItMatters = [
    ...(input.decisions ?? []),
    ...input.operatorSummary.findings,
  ]
    .map((l) => humanizeBusinessLine(l))
    .filter((l): l is string => Boolean(l))
    .filter((l, i, arr) => arr.findIndex((x) => x.toLowerCase() === l.toLowerCase()) === i)
    .slice(0, 6);

  let whatHappened = plain;
  if (whatHappened.length === 0) {
    const fallback = input.fallbackSummary?.trim()
      ? stripOperatorProse(input.fallbackSummary)
      : "";
    if (fallback && fallback.length > 12 && !/^(idle|done|blocked|needs_input)$/i.test(fallback)) {
      whatHappened = [fallback];
    } else if (whyItMatters.length > 0) {
      whatHappened = [
        "This seat finished its latest design pass and locked a few product choices. There is no separate plain-English write-up yet — the decisions below are the story.",
      ];
    }
  }

  const nextSteps = input.operatorSummary.nextSteps
    .map((l) => humanizeBusinessLine(l) ?? stripOperatorProse(l))
    .filter(Boolean)
    .slice(0, 5);

  const needsFromYou = input.openQuestions
    .map((q) => humanizeOperatorAsk(q) ?? q)
    .filter((q, i, arr) => arr.findIndex((x) => x.toLowerCase() === q.toLowerCase()) === i)
    .slice(0, 6);

  return {
    whatHappened,
    whyItMatters,
    nextSteps,
    needsFromYou,
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
  "Write the operator brief at the source — do not leave jargon for a later rewrite.",
  "Your REVIEW/inbox deliverable AND your HANDOFFS/*.md MUST be understandable to a non-technical operator.",
  "Put these sections near the top (after the title), before tables or model audit:",
  "",
  "### Operator brief (plain English)",
  "- 3–5 short sentences. What happened, what it means, and whether work is ready to continue.",
  "- No YAML dumps, no runIds, no raw path laundry lists, no scorecard tables here.",
  "- Alias headings still accepted: `In plain English`, `Operator summary`.",
  "",
  "### What we found",
  "- Up to 5 bullets of the load-bearing facts or assumptions (numbers ok if labeled).",
  "",
  "### Next steps",
  "- 3–5 numbered steps. Each step names who acts (operator, CEO, CFO, research, …) and the concrete ask.",
  "- End with any blocking questions the operator must answer before the next phase.",
  "",
  "### Client artifact",
  "- Frontmatter artifact_path must point at the file the operator should open (PRD, app README, PDF, pocket card) — not this inbox memo and not the handoff.",
  "",
  "IC handoffs, manager briefs, and C-suite reviews must use the same three sections.",
  "Situation Room reads these sections directly — missing Operator brief means a weak report.",
].join("\n");
