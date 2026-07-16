import { describe, expect, it } from "vitest";
import { DEFAULT_BUSINESS_IDEA_REL } from "../lib/project-paths";
import { renderCsuiteDraft, splitScorecard } from "./csuite-draft";

const BIZ = DEFAULT_BUSINESS_IDEA_REL;

describe("renderCsuiteDraft", () => {
  it("includes phase, scorecard, secondaries", () => {
    const md = renderCsuiteDraft({
      phase: "2",
      reviewer: "ceo-strategist",
      managerBriefPath: `${BIZ}/HANDOFFS/2-manager-head-of-research.md`,
      artifactPaths: [`${BIZ}/02-evidence-base.md`],
      scorecardLines: splitScorecard("Evidence quality; Sources cited"),
      secondaryReviewers: ["head-of-research"],
      comments: ["Check ICP"],
    });
    expect(md).toContain('phase: "2"');
    expect(md).toContain("Evidence quality");
    expect(md).toContain("head-of-research");
    expect(md).toContain("verdict: pending");
    expect(md).not.toContain("verdict: approve");
  });
});
