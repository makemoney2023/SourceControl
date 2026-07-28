import { readFileSync } from "node:fs";
import { parseOrgRegistry } from "../../src/lib/parse-registry";
import { assertReadable } from "../paths";
import { JarvisExecError } from "./errors";
import { looksLikePhase0Request, phase0WorkGoal } from "./phase0-roundtable";
import { resolveSeatSlug } from "./resolve-seat";

export type WorkTarget = {
  intakeSeat: string;
  targetIc?: string;
  goal: string;
  spoken: string;
};

const GOAL_IC_HEURISTICS: { re: RegExp; ic: string }[] = [
  { re: /\b(blog|article|copy|landing\s*page|newsletter|press\s*release)\b/i, ic: "copy-chief" },
];

export function inferTargetIcFromGoal(goal: string): string | undefined {
  const g = goal.trim();
  if (!g) return undefined;
  for (const h of GOAL_IC_HEURISTICS) {
    if (h.re.test(g)) return h.ic;
  }
  return undefined;
}

/** Pull a roster seat named inside freeform goal text (e.g. "spin up head of research"). */
export function inferSeatFromGoalText(
  goal: string,
  roster: { slug: string; title: string }[],
): string | undefined {
  const g = goal.trim();
  if (!g) return undefined;

  // Prefer longer titles/slugs so "head of research" wins over bare "research".
  const candidates = roster
    .flatMap((r) => [
      { key: r.title, slug: r.slug },
      { key: r.slug.replace(/-/g, " "), slug: r.slug },
      { key: r.slug, slug: r.slug },
    ])
    .sort((a, b) => b.key.length - a.key.length);

  const lower = g.toLowerCase();
  for (const c of candidates) {
    if (c.key.length < 3) continue;
    if (lower.includes(c.key.toLowerCase())) {
      return resolveSeatSlug(c.slug, roster) ?? c.slug;
    }
  }

  // Phrase windows: try resolveSeatSlug on 2–5 word spans.
  const words = g.split(/\s+/).filter(Boolean);
  for (let n = Math.min(5, words.length); n >= 2; n--) {
    for (let i = 0; i + n <= words.length; i++) {
      const phrase = words.slice(i, i + n).join(" ");
      const hit = resolveSeatSlug(phrase, roster);
      if (hit) return hit;
    }
  }
  return undefined;
}

export function resolveWorkTarget(
  repoRoot: string,
  args: { position?: string; goal?: string; phase?: string },
): WorkTarget {
  const rawGoal = String(args.goal ?? "").trim() || "On-the-fly work request";
  if (looksLikePhase0Request({ phase: args.phase, goal: rawGoal })) {
    const goal = phase0WorkGoal(rawGoal);
    return {
      intakeSeat: "ceo-strategist",
      goal,
      spoken: `Phase 0 C-suite roundtable via ceo-strategist. Goal: ${goal}`,
    };
  }

  const goal = rawGoal;
  const org = parseOrgRegistry(
    readFileSync(assertReadable(repoRoot, "skills/org/ORG-REGISTRY.md"), "utf8"),
  );

  let position = String(args.position ?? "").trim();
  let targetIc: string | undefined;

  if (!position) {
    const fromGoal = inferSeatFromGoalText(goal, org.roster);
    if (fromGoal) position = fromGoal;
  }

  if (!position) {
    const inferred = inferTargetIcFromGoal(goal);
    if (inferred) position = inferred;
  }

  if (!position) {
    return {
      intakeSeat: "ceo-strategist",
      goal,
      spoken: `No clear seat — escalate intake to ceo-strategist for: ${goal}`,
    };
  }

  position = resolveSeatSlug(position, org.roster) ?? position;
  const seat = org.roster.find((r) => r.slug === position);
  if (!seat) throw new JarvisExecError(`Unknown seat: ${position}`, "unknown_seat");

  if (seat.level === "ic") {
    const manager = seat.reportsTo?.trim();
    if (!manager) {
      throw new JarvisExecError(`${position} has no reporting manager`, "not_manager");
    }
    const mgr = org.roster.find((r) => r.slug === manager);
    if (!mgr || mgr.level !== "manager") {
      throw new JarvisExecError(`${position} reports to non-manager ${manager}`, "not_manager");
    }
    targetIc = position;
    return {
      intakeSeat: manager,
      targetIc,
      goal,
      spoken: `Route via ${manager} (intake), may spawn ${targetIc}. Goal: ${goal}`,
    };
  }

  if (seat.level !== "manager") {
    throw new JarvisExecError(`${position} is not a manager or IC`, "not_manager");
  }

  return {
    intakeSeat: position,
    goal,
    spoken: `Intake with ${position}. Goal: ${goal}`,
  };
}
