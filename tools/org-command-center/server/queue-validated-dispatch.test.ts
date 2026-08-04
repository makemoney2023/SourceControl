import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { seedContextMd } from "./sources/context-md";
import { queueValidatedDispatch } from "./queue-validated-dispatch";

const FIXTURES = join(import.meta.dirname, "../src/lib/fixtures");
const BIZ_IDEA = "docs/projects/passive-grid/business-idea";

function tempRepo() {
  const root = mkdtempSync(join(tmpdir(), "queue-dispatch-"));
  mkdirSync(join(root, "projects"), { recursive: true });
  mkdirSync(join(root, "skills/org"), { recursive: true });
  writeFileSync(
    join(root, "skills/org/ORG-REGISTRY.md"),
    readFileSync(join(FIXTURES, "sample-org-registry.md"), "utf8"),
  );
  writeFileSync(
    join(root, "skills/org/MODEL-REGISTRY.md"),
    readFileSync(join(FIXTURES, "sample-model-registry.md"), "utf8"),
  );
  writeFileSync(
    join(root, "projects/registry.json"),
    JSON.stringify({
      active: "passive-grid",
      projects: {
        "passive-grid": {
          name: "Passive Grid",
          businessIdea: BIZ_IDEA,
          memory: "docs/projects/passive-grid/MEMORY",
        },
      },
    }),
  );
  const idea = join(root, BIZ_IDEA);
  mkdirSync(join(idea, "DISPATCH/queue"), { recursive: true });
  mkdirSync(join(idea, "DISPATCH/claimed"), { recursive: true });
  mkdirSync(join(idea, "DISPATCH/runs"), { recursive: true });
  mkdirSync(join(idea, "HANDOFFS"), { recursive: true });
  writeFileSync(
    join(idea, "RUNBOOK-TRACKER.md"),
    readFileSync(join(FIXTURES, "sample-tracker.md"), "utf8"),
  );
  return root;
}

describe("queueValidatedDispatch", () => {
  let repo = "";

  afterEach(() => {
    if (repo) rmSync(repo, { recursive: true, force: true });
  });

  it("merges venture context reads into packet must_read", () => {
    repo = tempRepo();
    mkdirSync(join(repo, "docs/projects/passive-grid/MEMORY"), { recursive: true });
    writeFileSync(
      join(repo, "docs/projects/passive-grid/MEMORY/context.md"),
      seedContextMd("Use the attached sources."),
      "utf8",
    );

    const result = queueValidatedDispatch(repo, {
      phase: "2",
      position: "head-of-research",
      goal: "Run market research",
      llm_tier: "strong-general",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.packet.must_read.some((p) => p.includes("MEMORY/context.md"))).toBe(true);
  });

  it("fills write_lease from seat Outputs when omitted", () => {
    repo = tempRepo();
    mkdirSync(join(repo, "skills/org/positions/head-of-research"), {
      recursive: true,
    });
    writeFileSync(
      join(repo, "skills/org/positions/head-of-research/SKILL.md"),
      `# Head of Research

## Outputs
- \`docs/projects/<active>/business-idea/02-evidence-base.md\`
- \`docs/projects/<active>/business-idea/02-market-research.md\`
`,
    );

    const result = queueValidatedDispatch(repo, {
      phase: "2",
      position: "head-of-research",
      goal: "Run market research",
      llm_tier: "strong-general",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.packet.outputs).toEqual(
      expect.arrayContaining([
        `${BIZ_IDEA}/02-evidence-base.md`,
        `${BIZ_IDEA}/02-market-research.md`,
      ]),
    );
    expect(result.packet.write_lease).toEqual(
      expect.arrayContaining([
        `${BIZ_IDEA}/02-evidence-base.md`,
        `${BIZ_IDEA}/HANDOFFS/2-manager-head-of-research.md`,
      ]),
    );
  });
});
