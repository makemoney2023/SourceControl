import { describe, expect, it } from "vitest";
import { checkArtifacts } from "./artifact-check";

describe("checkArtifacts", () => {
  it("marks existence via injected checker", () => {
    const out = checkArtifacts(
      "/repo",
      [
        { path: "docs/a.md", fromHandoff: "1.md" },
        { path: "docs/missing.md", fromHandoff: "1.md" },
      ],
      (abs) => abs.endsWith("docs/a.md"),
    );
    expect(out[0]?.exists).toBe(true);
    expect(out[1]?.exists).toBe(false);
  });
});
