import { describe, expect, it } from "vitest";
import { DEFAULT_BUSINESS_IDEA_REL } from "../lib/project-paths";
import { indexArtifacts, indexProductionArtifacts } from "./artifacts";

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

  it("retains seat, notes, and handoff filename from handoffs", () => {
    const items = indexArtifacts(
      [],
      [
        {
          filename: "11-brand-designer.md",
          kind: "ic",
          phase: "11",
          position: "brand-designer",
          reportsTo: "cmo",
          status: "done",
          verdictForManager: "",
          verdict: "",
          llmTier: "",
          generationProfile: "",
          fallbackApplied: "",
          artifacts: [
            { path: `${BIZ}/11-brand/logo.svg`, notes: "primary mark" },
          ],
        },
      ],
    );
    expect(items[0]).toMatchObject({
      path: `${BIZ}/11-brand/logo.svg`,
      phase: "11",
      status: "done",
      seat: "brand-designer",
      handoffFilename: "11-brand-designer.md",
      notes: "primary mark",
    });
  });

  it("indexProductionArtifacts drops craft markdown and keeps media", () => {
    const items = indexProductionArtifacts(
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
          filename: "11-brand-designer.md",
          phase: "11",
          position: "brand-designer",
          status: "done",
          artifacts: [
            { path: `${BIZ}/01-problem-framing.md`, notes: "" },
            { path: `${BIZ}/images/hero.png`, notes: "hero" },
          ],
          productionPaths: [`${BIZ}/html/landing.html`],
        },
      ],
    );
    expect(items.map((i) => i.path).sort()).toEqual(
      [`${BIZ}/html/landing.html`, `${BIZ}/images/hero.png`].sort(),
    );
  });
});
