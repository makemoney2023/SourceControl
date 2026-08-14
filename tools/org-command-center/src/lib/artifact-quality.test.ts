import { describe, expect, it } from "vitest";
import { parseArtifactQuality, qualityFailures } from "./artifact-quality";

const MD = `# Artifact quality
| id | phase | artifact | must_contain_headings |
| q5-prd | 5 | 05-prd.md | Personas, MoSCoW, User stories |
`;

describe("qualityFailures", () => {
  it("fails when MoSCoW heading is missing", () => {
    const checks = parseArtifactQuality(MD);
    const missing = qualityFailures(checks, "5", () => "# PRD\n## Personas\n## User stories\n");
    expect(missing).toEqual(["quality_fail:q5-prd"]);
  });

  it("passes when all headings exist", () => {
    const checks = parseArtifactQuality(MD);
    const missing = qualityFailures(
      checks,
      "5",
      () => "# PRD\n## Personas\n## MoSCoW\n## User stories\n",
    );
    expect(missing).toEqual([]);
  });

  it("returns quality_scorecard when the artifact file is missing", () => {
    const checks = parseArtifactQuality(MD);
    expect(qualityFailures(checks, "5", () => null)).toEqual(["quality_scorecard"]);
  });

  it("ignores other phases", () => {
    const checks = parseArtifactQuality(MD);
    expect(qualityFailures(checks, "2", () => null)).toEqual([]);
  });
});
