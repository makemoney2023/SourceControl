import { describe, expect, it } from "vitest";
import { formatRedlineInstruction, parseRedlines } from "./redlines";

const TABLE = `## Redlines
| path | comment |
|------|---------|
| 05-prd.md#US-014 | Acceptance does not mention offline queue flush |
`;

describe("parseRedlines", () => {
  it("parses path and comment rows from a Redlines table", () => {
    expect(parseRedlines(TABLE)).toEqual([
      {
        path: "05-prd.md#US-014",
        comment: "Acceptance does not mention offline queue flush",
      },
    ]);
  });

  it("returns empty when Redlines table is missing or has no data rows", () => {
    expect(parseRedlines("## Verdict\nrevise\n")).toEqual([]);
    expect(
      parseRedlines(`## Redlines
| path | comment |
|------|---------|
`),
    ).toEqual([]);
  });

  it("returns empty when the table has only placeholder … / ... paths", () => {
    expect(
      parseRedlines(`## Redlines
| path | comment |
|------|---------|
| … | … |
| ... | ... |
`),
    ).toEqual([]);
  });
});

describe("formatRedlineInstruction", () => {
  it("formats leased-path revision instructions", () => {
    const out = formatRedlineInstruction([
      {
        path: "05-prd.md#US-014",
        comment: "Acceptance does not mention offline queue flush",
      },
    ]);
    expect(out).toBe(
      [
        "## Redlines (do not restart)",
        "Revise only these leased paths. Leave everything else.",
        "- `05-prd.md#US-014`: Acceptance does not mention offline queue flush",
      ].join("\n"),
    );
  });
});
