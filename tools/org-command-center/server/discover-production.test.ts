import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import {
  discoverSeatProductionFiles,
  enrichHandoffsWithSeatOutputs,
} from "./discover-production";
import type { HandoffRecord } from "../src/lib/types";

const BIZ = "docs/projects/demo/business-idea";

function seedRepo(): string {
  const root = mkdtempSync(join(tmpdir(), "occ-discover-"));
  mkdirSync(join(root, "projects"), { recursive: true });
  mkdirSync(join(root, "skills/org/positions/brand-designer"), {
    recursive: true,
  });
  writeFileSync(
    join(root, "projects/registry.json"),
    JSON.stringify({
      active: "demo",
      projects: {
        demo: {
          name: "Demo",
          businessIdea: BIZ,
          memory: "docs/projects/demo/MEMORY",
        },
      },
    }),
  );
  writeFileSync(
    join(root, "skills/org/positions/brand-designer/SKILL.md"),
    `# Brand

## Outputs
- \`${BIZ}/images/\`
- \`${BIZ}/html/landing.html\`

## Done
- x
`,
  );
  mkdirSync(join(root, BIZ, "images"), { recursive: true });
  mkdirSync(join(root, BIZ, "html"), { recursive: true });
  writeFileSync(join(root, BIZ, "images", "hero.png"), "png");
  writeFileSync(join(root, BIZ, "images", "notes.md"), "craft");
  writeFileSync(join(root, BIZ, "html", "landing.html"), "<html></html>");
  return root;
}

describe("discoverSeatProductionFiles", () => {
  let root = "";
  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it("lists production files under seat ## Outputs leases", () => {
    root = seedRepo();
    const paths = discoverSeatProductionFiles(root, "brand-designer");
    expect(paths.sort()).toEqual(
      [`${BIZ}/html/landing.html`, `${BIZ}/images/hero.png`].sort(),
    );
    expect(paths.some((p) => p.endsWith("notes.md"))).toBe(false);
  });

  it("enriches handoff productionPaths without dropping existing entries", () => {
    root = seedRepo();
    const handoff = {
      filename: "11-brand-designer.md",
      kind: "ic",
      phase: "11",
      position: "brand-designer",
      reportsTo: "creative-director",
      status: "done",
      verdictForManager: "",
      verdict: "",
      llmTier: "",
      generationProfile: "",
      fallbackApplied: "",
      artifacts: [],
      asks: [],
      blockers: [],
      recommendation: "",
      escalationTags: [],
      productionPaths: [`${BIZ}/office/deck.docx`],
    } as HandoffRecord;
    const [enriched] = enrichHandoffsWithSeatOutputs(root, [handoff]);
    expect(enriched?.productionPaths).toEqual(
      expect.arrayContaining([
        `${BIZ}/office/deck.docx`,
        `${BIZ}/images/hero.png`,
        `${BIZ}/html/landing.html`,
      ]),
    );
  });
});
