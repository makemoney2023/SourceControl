import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { resolveClassificationSkips } from "../../src/lib/classification-skips";
import { parseDecisionRegister } from "../../src/lib/decision-register";
import { DESIGN_LED_PRODUCTION_PHASES } from "../../src/lib/seat-outputs";
import { businessIdeaRel, memoryRel } from "../paths";
import { JarvisExecError } from "./errors";

const DESIGN_WAIVER_RE = /design.?before.?build|skip design|waiver.*phase 9/i;

function walkRelFiles(absDir: string, relPrefix = ""): string[] {
  if (!existsSync(absDir)) return [];
  let names: string[];
  try {
    names = readdirSync(absDir);
  } catch {
    return [];
  }
  const out: string[] = [];
  for (const name of names) {
    const abs = join(absDir, name);
    const rel = relPrefix ? `${relPrefix}/${name}` : name;
    try {
      if (statSync(abs).isDirectory()) {
        out.push(...walkRelFiles(abs, rel));
      } else {
        out.push(rel);
      }
    } catch {
      // skip unreadable entries
    }
  }
  return out;
}

function hasDesignBriefEvidence(repoRoot: string): boolean {
  const ideaAbs = join(repoRoot, businessIdeaRel(repoRoot));
  if (existsSync(join(ideaAbs, "11-brand/MASTER.md"))) return true;
  if (existsSync(join(ideaAbs, "HANDOFFS/11-creative-director.md"))) return true;
  return walkRelFiles(ideaAbs).some((rel) =>
    /(?:^|\/)design\/[^/]+-design-brief\.md$/i.test(rel),
  );
}

function hasDesignWaiver(repoRoot: string, decisionsRel: string): boolean {
  const register = parseDecisionRegister(
    readFileSync(join(repoRoot, decisionsRel), "utf8"),
  );
  return register.locked.some((item) => DESIGN_WAIVER_RE.test(item.text));
}

/** Refuse phase 9 enqueue unless a design brief or locked waiver exists. */
function assertDesignBeforeBuild(
  repoRoot: string,
  phase: string,
  classification: string,
): void {
  if (phase === "9B" || phase !== "9") return;
  if (!classification.trim()) return;
  if (!DESIGN_LED_PRODUCTION_PHASES.has("9")) return;
  const decisionsRel = `${memoryRel(repoRoot)}/decisions.md`;
  if (!existsSync(join(repoRoot, decisionsRel))) return;
  if (hasDesignBriefEvidence(repoRoot)) return;
  if (hasDesignWaiver(repoRoot, decisionsRel)) return;
  throw new JarvisExecError(
    "phase 9 requires a design brief or locked design-before-build waiver",
    "design_before_build",
  );
}

export function assertClassificationAndDesignGates(
  repoRoot: string,
  opts: { phase: string; preferred_ic?: string; classification: string },
): void {
  const skipsPath = join(repoRoot, "skills/org/CLASSIFICATION-SKIPS.md");
  const skips = existsSync(skipsPath)
    ? resolveClassificationSkips(
        opts.classification,
        readFileSync(skipsPath, "utf8"),
      )
    : { skipIcs: [], skipPhases: [] };
  if (opts.preferred_ic && skips.skipIcs.includes(opts.preferred_ic)) {
    throw new JarvisExecError(
      `${opts.preferred_ic} skipped for classification ${opts.classification}`,
      "skipped_ic",
    );
  }
  if (skips.skipPhases.includes(opts.phase)) {
    throw new JarvisExecError(
      `phase ${opts.phase} skipped for classification ${opts.classification}`,
      "skipped_phase",
    );
  }
  assertDesignBeforeBuild(repoRoot, opts.phase, opts.classification);
}
