import { readFileSync } from "node:fs";
import { parseOrgRegistry } from "../../src/lib/parse-registry";
import { assertReadable } from "../paths";
import { JarvisExecError } from "./errors";
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

export function resolveWorkTarget(
  repoRoot: string,
  args: { position?: string; goal?: string },
): WorkTarget {
  const goal = String(args.goal ?? "").trim() || "On-the-fly work request";
  const org = parseOrgRegistry(
    readFileSync(assertReadable(repoRoot, "skills/org/ORG-REGISTRY.md"), "utf8"),
  );

  let position = String(args.position ?? "").trim();
  let targetIc: string | undefined;

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
