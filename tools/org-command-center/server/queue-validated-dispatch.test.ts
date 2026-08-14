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
import { JarvisExecError } from "./jarvis/errors";
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

  it("appends discipline constraints without dumping lock text into goal", () => {
    repo = tempRepo();

    const result = queueValidatedDispatch(repo, {
      phase: "2",
      position: "head-of-research",
      goal: "Run market research",
      llm_tier: "strong-general",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.packet.goal).toBe("Run market research");
    expect(result.packet.constraints).toEqual(
      expect.arrayContaining([
        "Read MEMORY/decisions.md. Do not restate locked decisions in the operator brief.",
        "Do not re-ask locked ids. At most one new Open question, and only if it is not already on the register.",
        "Operator brief is a delta: what this seat uniquely produced.",
        "Packs used must be rows from your position SKILL.md Skill packs table.",
      ]),
    );
  });

  it("keeps DEFAULT_CONSTRAINTS on queued packets after discipline merge", () => {
    repo = tempRepo();

    const result = queueValidatedDispatch(repo, {
      phase: "2",
      position: "head-of-research",
      goal: "Run market research",
      llm_tier: "strong-general",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(
      result.packet.constraints.some(
        (c) =>
          c.includes("Spawn only Delegates") ||
          c.toLowerCase().includes("do not mark phase complete"),
      ),
    ).toBe(true);
    expect(result.packet.constraints).toEqual(
      expect.arrayContaining([
        "Read MEMORY/decisions.md. Do not restate locked decisions in the operator brief.",
        "Do not re-ask locked ids. At most one new Open question, and only if it is not already on the register.",
        "Operator brief is a delta: what this seat uniquely produced.",
        "Packs used must be rows from your position SKILL.md Skill packs table.",
      ]),
    );
  });

  it("does not duplicate discipline constraints already present", () => {
    repo = tempRepo();
    const existing =
      "Read MEMORY/decisions.md. Do not restate locked decisions in the operator brief.";

    const result = queueValidatedDispatch(repo, {
      phase: "2",
      position: "head-of-research",
      goal: "Run market research",
      llm_tier: "strong-general",
      constraints: [existing],
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(
      result.packet.constraints.filter((c) => c === existing),
    ).toHaveLength(1);
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

  it("allows Phase 6 queue when IC seat Outputs overlap (section leases)", () => {
    repo = tempRepo();
    // Fixture registry omits Phase 6 — append owner + colliding maySpawn ICs.
    const orgPath = join(repo, "skills/org/ORG-REGISTRY.md");
    writeFileSync(
      orgPath,
      `${readFileSync(orgPath, "utf8")}\n| 6 | cmo | product-marketing-manager, content-strategist, pr-manager \`(parallel: true)\` | ceo-strategist | — | GTM channels |\n`,
    );
    for (const [slug, outputs] of [
      ["cmo", [`docs/projects/<active>/business-idea/06-gtm-plan.md`]],
      [
        "product-marketing-manager",
        [
          `docs/projects/<active>/business-idea/06-gtm-plan.md`,
          `docs/projects/<active>/business-idea/13-copy-foundation.md`,
        ],
      ],
      [
        "content-strategist",
        [`docs/projects/<active>/business-idea/13-copy-foundation.md`],
      ],
      ["pr-manager", [`docs/projects/<active>/business-idea/06-gtm-plan.md`]],
    ] as const) {
      mkdirSync(join(repo, "skills/org/positions", slug), { recursive: true });
      writeFileSync(
        join(repo, "skills/org/positions", slug, "SKILL.md"),
        `# ${slug}\n\n## Outputs\n${outputs.map((o) => `- \`${o}\``).join("\n")}\n`,
      );
    }

    const result = queueValidatedDispatch(repo, {
      phase: "6",
      position: "cmo",
      goal: "Light internal GTM",
      llm_tier: "frontier-reasoning",
    });

    if (!result.ok) {
      throw new Error(result.errors.join(" | "));
    }
    expect(result.ok).toBe(true);
  });

  it("throws skipped_ic when preferred_ic is skipped for Internal classification", () => {
    repo = tempRepo();
    writeFileSync(
      join(repo, "skills/org/CLASSIFICATION-SKIPS.md"),
      `# Classification → skipped ICs and phases

| Match | Skip ICs | Skip phases |
|-------|----------|-------------|
| internal | seo-manager, pr-manager | 7, 13, 16, 18, 19 |
`,
    );
    writeFileSync(
      join(repo, BIZ_IDEA, "RUNBOOK-TRACKER.md"),
      readFileSync(join(FIXTURES, "sample-tracker.md"), "utf8").replace(
        "**Classification:** Software",
        "**Classification:** Internal (+ SaaS-optional)",
      ),
    );

    try {
      queueValidatedDispatch(repo, {
        phase: "2",
        position: "cmo",
        preferred_ic: "seo-manager",
        goal: "SEO plan",
        llm_tier: "frontier-reasoning",
      });
      expect.fail("expected skipped_ic");
    } catch (err) {
      expect(err).toBeInstanceOf(JarvisExecError);
      expect((err as JarvisExecError).code).toBe("skipped_ic");
    }
  });

  it("throws design_before_build for phase 9 without design brief or waiver", () => {
    repo = tempRepo();
    mkdirSync(join(repo, "docs/projects/passive-grid/MEMORY"), { recursive: true });
    writeFileSync(
      join(repo, "docs/projects/passive-grid/MEMORY/decisions.md"),
      `# Decisions
## Locked
| id | decision | asked_as |
|----|----------|----------|
| X1 | Unrelated lock | |
`,
    );

    try {
      queueValidatedDispatch(repo, {
        phase: "9",
        position: "creative-director",
        goal: "Build production",
        llm_tier: "creative-language",
      });
      expect.fail("expected design_before_build");
    } catch (err) {
      expect(err).toBeInstanceOf(JarvisExecError);
      expect((err as JarvisExecError).code).toBe("design_before_build");
    }
  });
});
