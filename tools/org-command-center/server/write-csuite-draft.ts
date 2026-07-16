import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { renderCsuiteDraft, splitScorecard } from "../src/jarvis/csuite-draft";
import { resolveEscalationSecondaries } from "../src/jarvis/escalation";
import { resolvePhaseOwner } from "../src/lib/parse-registry";
import { assertWritable, businessIdeaFile, handoffsDir } from "./paths";
import { loadSnapshot } from "./snapshot";

export function secondariesForPhase(
  handoffs: { phase: string; recommendation: string; verdictForManager: string; escalationTags: string[] }[],
  phase: string,
): string[] {
  const tags = handoffs
    .filter(
      (h) =>
        h.phase === phase &&
        (h.recommendation === "escalate" || h.verdictForManager === "escalate"),
    )
    .flatMap((h) => h.escalationTags);
  return resolveEscalationSecondaries(tags);
}

export type WriteCsuiteDraftResult =
  | { ok: true; path: string }
  | { ok: false; error: string; path: string };

export function writeCsuiteDraft(
  repoRoot: string,
  args: { phase: string; force?: boolean },
): WriteCsuiteDraftResult {
  const phase = String(args.phase ?? "");
  if (!phase) return { ok: false, error: "phase required", path: "" };

  const force = Boolean(args.force);
  const snap = loadSnapshot(repoRoot);
  const owner = resolvePhaseOwner(snap.org, phase);
  const mgr = snap.handoffs.find((h) => h.kind === "manager" && h.phase === phase);
  const managerBriefPath = mgr
    ? businessIdeaFile(repoRoot, `HANDOFFS/${mgr.filename}`)
    : businessIdeaFile(
        repoRoot,
        `HANDOFFS/${phase}-manager-${owner?.managerOwner ?? "unknown"}.md`,
      );
  const artifacts = snap.handoffs
    .filter((h) => h.phase === phase)
    .flatMap((h) => h.artifacts.map((a) => a.path));
  const secondaries = secondariesForPhase(snap.handoffs, phase);
  const md = renderCsuiteDraft({
    phase,
    reviewer: owner?.csuiteReviewer || "ceo-strategist",
    managerBriefPath,
    artifactPaths: [...new Set(artifacts)],
    scorecardLines: splitScorecard(owner?.scorecard ?? ""),
    secondaryReviewers: secondaries,
    comments: [...(mgr?.asks ?? []), ...(mgr?.blockers ?? [])],
  });
  const rel = businessIdeaFile(repoRoot, `HANDOFFS/${phase}-csuite-review.md`);
  const abs = assertWritable(repoRoot, rel);
  if (existsSync(abs) && !force) {
    return {
      ok: false,
      error: "csuite review already exists; pass force:true to overwrite draft",
      path: rel,
    };
  }
  mkdirSync(handoffsDir(repoRoot), { recursive: true });
  writeFileSync(abs, md);
  return { ok: true, path: rel };
}
