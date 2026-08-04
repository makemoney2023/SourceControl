import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import {
  expandOutputPath,
  loadSeatOutputPaths,
  mergeUniquePaths,
  parseSeatOutputsSection,
} from "./seat-outputs";

describe("parseSeatOutputsSection", () => {
  it("extracts bullet paths under ## Outputs", () => {
    const md = `# Seat

## Outputs
- \`docs/projects/<active>/business-idea/17-channels/email/html/\` (Layer B)
- design-system/<venture>/
- apps/<venture>/

## Done criteria
- something else
`;
    expect(parseSeatOutputsSection(md)).toEqual([
      "docs/projects/<active>/business-idea/17-channels/email/html/",
      "design-system/<venture>/",
      "apps/<venture>/",
    ]);
  });

  it("returns empty when section missing", () => {
    expect(parseSeatOutputsSection("# No outputs\n")).toEqual([]);
  });
});

describe("expandOutputPath", () => {
  const biz = "docs/projects/blacksage-kennels/business-idea";

  it("substitutes <active> and <venture>", () => {
    expect(
      expandOutputPath("docs/projects/<active>/business-idea/11-brand/assets/", {
        ventureSlug: "blacksage-kennels",
        businessIdeaRel: biz,
      }),
    ).toBe("docs/projects/blacksage-kennels/business-idea/11-brand/assets");

    expect(
      expandOutputPath("design-system/<venture>/", {
        ventureSlug: "blacksage-kennels",
        businessIdeaRel: biz,
      }),
    ).toBe("design-system/blacksage-kennels");

    expect(
      expandOutputPath("apps/<venture>/", {
        ventureSlug: "blacksage-kennels",
        businessIdeaRel: biz,
      }),
    ).toBe("apps/blacksage-kennels");
  });

  it("prefixes relative business-idea paths", () => {
    expect(
      expandOutputPath("09b-hardware/", {
        ventureSlug: "passive-grid",
        businessIdeaRel: "docs/projects/passive-grid/business-idea",
      }),
    ).toBe("docs/projects/passive-grid/business-idea/09b-hardware");
  });
});

describe("mergeUniquePaths", () => {
  it("unions and de-dupes", () => {
    expect(mergeUniquePaths(["a/", "b"], ["b", "c"], undefined)).toEqual([
      "a",
      "b",
      "c",
    ]);
  });
});

describe("loadSeatOutputPaths", () => {
  let root = "";

  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it("reads position SKILL.md and expands for active venture", () => {
    root = mkdtempSync(join(tmpdir(), "seat-outputs-"));
    mkdirSync(join(root, "projects"), { recursive: true });
    mkdirSync(join(root, "skills/org/positions/lifecycle-marketer"), {
      recursive: true,
    });
    writeFileSync(
      join(root, "projects/registry.json"),
      JSON.stringify({
        active: "blacksage-kennels",
        projects: {
          "blacksage-kennels": {
            name: "Blacksage",
            businessIdea: "docs/projects/blacksage-kennels/business-idea",
            memory: "docs/projects/blacksage-kennels/MEMORY",
          },
        },
      }),
    );
    writeFileSync(
      join(root, "skills/org/positions/lifecycle-marketer/SKILL.md"),
      `# Lifecycle

## Outputs
- \`docs/projects/<active>/business-idea/17-channels/email/html/\`
`,
    );

    const paths = loadSeatOutputPaths(root, "lifecycle-marketer");
    expect(paths).toContain(
      "docs/projects/blacksage-kennels/business-idea/17-channels/email/html",
    );
  });
});
