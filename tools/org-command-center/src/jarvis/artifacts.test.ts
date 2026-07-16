import { describe, expect, it } from "vitest";
import { DEFAULT_BUSINESS_IDEA_REL } from "../lib/project-paths";
import { indexArtifacts } from "./artifacts";

const BIZ = DEFAULT_BUSINESS_IDEA_REL;

describe("indexArtifacts", () => {
  it("merges tracker and handoff paths without duplicates", () => {
    const items = indexArtifacts(
      [
        {
          phase: "1",
          name: "Frame",
          status: "✅",
          artifact: "01-problem-framing.md",
          notes: "",
        },
      ],
      [
        {
          filename: "1-ba.md",
          kind: "ic",
          phase: "1",
          position: "business-analyst",
          reportsTo: "ceo-strategist",
          status: "done",
          verdictForManager: "",
          verdict: "",
          llmTier: "",
          generationProfile: "",
          fallbackApplied: "",
          artifacts: [
            { path: `${BIZ}/01-problem-framing.md`, notes: "" },
            { path: `${BIZ}/extra.md`, notes: "" },
          ],
        },
      ],
    );
    expect(items.map((i) => i.path)).toEqual([
      `${BIZ}/01-problem-framing.md`,
      `${BIZ}/extra.md`,
    ]);
  });
});
