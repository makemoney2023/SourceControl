export function renderCsuiteDraft(input: {
  phase: string;
  reviewer: string;
  managerBriefPath: string;
  artifactPaths: string[];
  scorecardLines: string[];
  secondaryReviewers: string[];
  comments?: string[];
}): string {
  const date = new Date().toISOString().slice(0, 10);
  const scoreRows =
    input.scorecardLines.length > 0
      ? input.scorecardLines.map((c) => `| ${c} |  |  |`).join("\n")
      : "| (scorecard from registry) |  |  |";
  const artifacts =
    input.artifactPaths.length > 0
      ? input.artifactPaths.map((p) => `- \`${p}\``).join("\n")
      : "- (none listed)";
  const comments =
    (input.comments ?? []).length > 0
      ? (input.comments ?? []).map((c) => `- ${c}`).join("\n")
      : "- (pending review)";
  const secondaries = JSON.stringify(input.secondaryReviewers);

  return `---
phase: "${input.phase}"
reviewer: "${input.reviewer}"
secondary_reviewers: ${secondaries}
verdict: pending
date: ${date}
llm_tier: frontier-reasoning
llm_model: ""
fallback_applied: false
---

# C-suite review — Phase ${input.phase}

## Inputs reviewed
- Manager brief: \`${input.managerBriefPath}\`
- Key artifacts:
${artifacts}

## Scorecard (from ORG-REGISTRY)
| Criterion | Pass? | Notes |
|-----------|-------|-------|
${scoreRows}
| Correct model tier used? |  |  |
| Generation profile correct (11/12/15/19)? |  |  |

## Verdict
**pending** — human or ceo-strategist must set approve | revise | escalate | skip-review

## Comments for manager
${comments}
`;
}

export function splitScorecard(scorecard: string): string[] {
  return scorecard
    .split(/[;|]/)
    .map((s) => s.trim())
    .filter(Boolean);
}
