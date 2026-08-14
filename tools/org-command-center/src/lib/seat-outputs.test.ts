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

  it("rewrites docs/projects/<active>/business-idea onto nested initiative businessIdeaRel", () => {
    const nested =
      "docs/orgs/velocity-agency/customers/blacksage-kennels/initiatives/sieger-show-secretary/business-idea";
    expect(
      expandOutputPath("docs/projects/<active>/business-idea/00-intake.md", {
        ventureSlug: "sieger-show-secretary",
        businessIdeaRel: nested,
      }),
    ).toBe(`${nested}/00-intake.md`);

    expect(
      expandOutputPath(
        "docs/projects/blacksage-kennels/business-idea/01-problem-framing.md",
        {
          ventureSlug: "blacksage-kennels",
          businessIdeaRel: nested,
        },
      ),
    ).toBe(`${nested}/01-problem-framing.md`);
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

  it("expands onto nested initiative businessIdea for portfolio v2 non-main active", () => {
    root = mkdtempSync(join(tmpdir(), "seat-outputs-v2-"));
    const nested =
      "docs/orgs/velocity-agency/customers/blacksage-kennels/initiatives/sieger-show-secretary/business-idea";
    mkdirSync(join(root, "projects"), { recursive: true });
    mkdirSync(join(root, "skills/org/positions/ceo-strategist"), {
      recursive: true,
    });
    writeFileSync(
      join(root, "projects/registry.json"),
      JSON.stringify({
        version: 2,
        active: {
          org: "velocity-agency",
          customer: "blacksage-kennels",
          initiative: "sieger-show-secretary",
        },
        orgs: {
          "velocity-agency": {
            customers: {
              "blacksage-kennels": {
                initiatives: {
                  main: {
                    name: "Website",
                    businessIdea: "docs/projects/blacksage-kennels/business-idea",
                  },
                  "sieger-show-secretary": {
                    name: "Sieger Show Secretary",
                    businessIdea: nested,
                  },
                },
              },
            },
          },
        },
      }),
    );
    writeFileSync(
      join(root, "skills/org/positions/ceo-strategist/SKILL.md"),
      `# CEO

## Outputs
- \`docs/projects/<active>/business-idea/00-intake.md\`
- apps/<venture>/
`,
    );

    const paths = loadSeatOutputPaths(root, "ceo-strategist");
    expect(paths).toContain(`${nested}/00-intake.md`);
    expect(paths).toContain("apps/sieger-show-secretary");
    expect(paths).not.toContain(
      "docs/projects/blacksage-kennels/business-idea/00-intake.md",
    );
  });
});
