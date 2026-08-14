import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import type { ManagerPacket } from "../../src/lib/types";
import { evaluateRunAcceptance } from "./run-acceptance";

const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), "../../src/lib/fixtures");
const SAMPLE_MODEL_REGISTRY = readFileSync(
  join(FIXTURES, "sample-model-registry.md"),
  "utf8",
);

const BIZ_IDEA = "docs/projects/passive-grid/business-idea";

const basePacket: ManagerPacket = {
  schema_version: 1,
  queued_at: "2026-07-16T14:00:00.000Z",
  phase: "2",
  position: "cmo",
  goal: "Write launch blog",
  report_to: "ceo-strategist",
  parent_position: "orchestrator",
  llm_tier: "strong-general",
  llm_model: "composer-2.5",
  generation_profile: "none",
  inputs: [],
  must_read: [],
  outputs: [],
  write_lease: [],
  budget_usd: null,
  collaborators: [],
  delegate_budget: 3,
  constraints: [],
  company_goal: "Test",
  parent_goal: "Phase 2",
  goal_path: ["Test", "Phase 2", "Write launch blog"],
  preferred_ic: "copy-chief",
  require_inbox: true,
  require_ic_handoff: true,
};

function tempRepo() {
  const root = mkdtempSync(join(tmpdir(), "run-acceptance-"));
  mkdirSync(join(root, "projects"), { recursive: true });
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
  mkdirSync(join(root, BIZ_IDEA), { recursive: true });
  return root;
}

function writeInbox(
  root: string,
  filename: string,
  frontmatter: Record<string, string>,
  body = "# Deliverable\n",
) {
  const dir = join(root, BIZ_IDEA, "REVIEW", "inbox");
  mkdirSync(dir, { recursive: true });
  const fm = Object.entries(frontmatter)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  writeFileSync(join(dir, filename), `---\n${fm}\n---\n\n${body}`, "utf8");
}

function writeHandoff(root: string, filename: string, content: string) {
  const dir = join(root, BIZ_IDEA, "HANDOFFS");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, filename), content, "utf8");
}

function writePrdArtifact(root: string): string {
  const rel = `${BIZ_IDEA}/05-prd.md`;
  writeFileSync(join(root, rel), "# PRD\n", "utf8");
  return rel;
}

function writeModelRegistry(root: string) {
  mkdirSync(join(root, "skills/org"), { recursive: true });
  writeFileSync(join(root, "skills/org/MODEL-REGISTRY.md"), SAMPLE_MODEL_REGISTRY, "utf8");
}

describe("evaluateRunAcceptance", () => {
  it("ok when inbox matches runId and ic handoff present", () => {
    const root = tempRepo();
    writeInbox(root, "2-cmo-deliverable.md", {
      status: "pending_review",
      position: "cmo",
      phase: "2",
      goal: "Write launch blog",
      runId: "run-abc",
    });
    writeHandoff(
      root,
      "2-copy-chief.md",
      `---
phase: "2"
position: copy-chief
reports_to: cmo
status: done
---
# IC handoff
`,
    );

    const result = evaluateRunAcceptance(root, {
      runId: "run-abc",
      packet: basePacket,
    });

    expect(result.ok).toBe(true);
    expect(result.missing).toEqual([]);
    expect(result.checkedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("missing inbox when require_inbox and no matching artifact", () => {
    const root = tempRepo();
    writeHandoff(
      root,
      "2-copy-chief.md",
      `---
phase: "2"
position: copy-chief
reports_to: cmo
status: done
---
`,
    );

    const result = evaluateRunAcceptance(root, {
      runId: "run-abc",
      packet: basePacket,
    });

    expect(result.ok).toBe(false);
    expect(result.missing).toContain("inbox");
  });

  it("missing ic_handoff when preferred_ic has no handoff", () => {
    const root = tempRepo();
    writeInbox(root, "2-cmo-deliverable.md", {
      status: "pending_review",
      position: "cmo",
      phase: "2",
      goal: "Write launch blog",
      runId: "run-abc",
    });

    const result = evaluateRunAcceptance(root, {
      runId: "run-abc",
      packet: basePacket,
    });

    expect(result.ok).toBe(false);
    expect(result.missing).toContain("ic_handoff");
  });

  it("falls back to position+goal when inbox lacks runId", () => {
    const root = tempRepo();
    writeInbox(root, "2-cmo-legacy.md", {
      status: "pending_review",
      position: "cmo",
      phase: "2",
      goal: "Write launch blog",
    });
    writeHandoff(
      root,
      "2-copy-chief.md",
      `---
phase: "2"
position: copy-chief
reports_to: cmo
status: done
---
`,
    );

    const result = evaluateRunAcceptance(root, {
      runId: "run-new",
      packet: basePacket,
    });

    expect(result.ok).toBe(true);
    expect(result.missing).toEqual([]);
  });

  it("skips checks when packet flags are false", () => {
    const root = tempRepo();
    const packet: ManagerPacket = {
      ...basePacket,
      require_inbox: false,
      require_ic_handoff: false,
    };

    const result = evaluateRunAcceptance(root, {
      runId: "run-abc",
      packet,
    });

    expect(result.ok).toBe(true);
    expect(result.missing).toEqual([]);
  });

  it("requires production_status on shippable phases", () => {
    const root = tempRepo();
    const packet: ManagerPacket = {
      ...basePacket,
      phase: "17",
      require_inbox: false,
      require_ic_handoff: false,
      require_verifier: false,
    };

    const missing = evaluateRunAcceptance(root, { runId: "r1", packet });
    expect(missing.ok).toBe(false);
    expect(missing.missing).toContain("production_status");

    writeHandoff(
      root,
      "17-manager-cmo.md",
      `---
phase: "17"
position: cmo
production_status: skipped
skip_reason: Blacksage HTML deferred to proof run
---
`,
    );
    const ok = evaluateRunAcceptance(root, { runId: "r1", packet });
    expect(ok.ok).toBe(true);
  });

  it("requires production_paths to exist when status is complete", () => {
    const root = tempRepo();
    const htmlRel = `${BIZ_IDEA}/17-channels/email/html/welcome-1.html`;
    const briefRel = `${BIZ_IDEA}/17-channels/email/design/welcome-design-brief.md`;
    const wireRel = `${BIZ_IDEA}/WIRE/phase-17-email.md`;
    const packet: ManagerPacket = {
      ...basePacket,
      phase: "17",
      require_inbox: false,
      require_ic_handoff: false,
      require_verifier: false,
    };

    writeHandoff(
      root,
      "17-lifecycle-marketer.md",
      `---
phase: "17"
position: lifecycle-marketer
production_status: complete
production_paths:
  - ${htmlRel}
wire_owner: operator
design_brief_path: ${briefRel}
wire_checklist_path: ${wireRel}
---
`,
    );

    const missingPath = evaluateRunAcceptance(root, { runId: "r1", packet });
    expect(missingPath.ok).toBe(false);
    expect(missingPath.missing.some((m) => m.startsWith("production_path:"))).toBe(
      true,
    );

    mkdirSync(join(root, BIZ_IDEA, "17-channels/email/html"), { recursive: true });
    mkdirSync(join(root, BIZ_IDEA, "17-channels/email/design"), { recursive: true });
    mkdirSync(join(root, BIZ_IDEA, "WIRE"), { recursive: true });
    writeFileSync(
      join(root, htmlRel),
      `<!DOCTYPE html><html><body><table style="max-width:600px"><tr><td><a href="https://example.com">CTA</a></td></tr></table></body></html>`,
      "utf8",
    );
    writeFileSync(join(root, briefRel), "# Design brief\n", "utf8");
    writeFileSync(join(root, wireRel), "# Wire\n- [ ] ESP\n", "utf8");

    const ok = evaluateRunAcceptance(root, { runId: "r1", packet });
    expect(ok.ok).toBe(true);
  });

  it("requires design_brief_path on disk when production complete on design-led phases", () => {
    const root = tempRepo();
    const htmlRel = `${BIZ_IDEA}/17-channels/email/html/welcome-1.html`;
    const wireRel = `${BIZ_IDEA}/WIRE/phase-17-email.md`;
    const packet: ManagerPacket = {
      ...basePacket,
      phase: "17",
      require_inbox: false,
      require_ic_handoff: false,
      require_verifier: false,
    };
    mkdirSync(join(root, BIZ_IDEA, "17-channels/email/html"), { recursive: true });
    mkdirSync(join(root, BIZ_IDEA, "WIRE"), { recursive: true });
    writeFileSync(
      join(root, htmlRel),
      `<!DOCTYPE html><html><body><table style="max-width:600px"><tr><td><a href="https://example.com">CTA</a></td></tr></table></body></html>`,
      "utf8",
    );
    writeFileSync(join(root, wireRel), "# Wire\n", "utf8");
    writeHandoff(
      root,
      "17-lifecycle-marketer.md",
      `---
phase: "17"
position: lifecycle-marketer
production_status: complete
production_paths:
  - ${htmlRel}
wire_owner: operator
wire_checklist_path: ${wireRel}
---
`,
    );
    const missing = evaluateRunAcceptance(root, { runId: "r1", packet });
    expect(missing.ok).toBe(false);
    expect(missing.missing).toContain("design_brief_path");
  });

  it("requires photoreal_qa for image production paths", () => {
    const root = tempRepo();
    const imgRel = `${BIZ_IDEA}/11-brand/assets/hero.png`;
    const briefRel = `${BIZ_IDEA}/11-brand/design/hero-design-brief.md`;
    const wireRel = `${BIZ_IDEA}/WIRE/phase-11.md`;
    const packet: ManagerPacket = {
      ...basePacket,
      phase: "11",
      require_inbox: false,
      require_ic_handoff: false,
      require_verifier: false,
    };
    mkdirSync(join(root, BIZ_IDEA, "11-brand/assets"), { recursive: true });
    mkdirSync(join(root, BIZ_IDEA, "11-brand/design"), { recursive: true });
    mkdirSync(join(root, BIZ_IDEA, "WIRE"), { recursive: true });
    writeFileSync(join(root, imgRel), "fake", "utf8");
    writeFileSync(join(root, briefRel), "# Brief\n", "utf8");
    writeFileSync(join(root, wireRel), "# Wire\n", "utf8");
    writeHandoff(
      root,
      "11-brand-designer.md",
      `---
phase: "11"
position: brand-designer
production_status: complete
production_paths:
  - ${imgRel}
wire_owner: operator
design_brief_path: ${briefRel}
wire_checklist_path: ${wireRel}
---
`,
    );
    const missing = evaluateRunAcceptance(root, { runId: "r1", packet });
    expect(missing.ok).toBe(false);
    expect(missing.missing).toContain("photoreal_qa");

    writeHandoff(
      root,
      "11-brand-designer.md",
      `---
phase: "11"
position: brand-designer
production_status: complete
production_paths:
  - ${imgRel}
wire_owner: operator
design_brief_path: ${briefRel}
wire_checklist_path: ${wireRel}
photoreal_qa: pass
generation_used: fal/flux-2-max
---
`,
    );
    const ok = evaluateRunAcceptance(root, { runId: "r1", packet });
    expect(ok.ok).toBe(true);
  });

  it("requires verifier pass on shippable phases", () => {
    const root = tempRepo();
    const packet: ManagerPacket = {
      ...basePacket,
      phase: "17",
      require_inbox: false,
      require_ic_handoff: false,
      require_production: false,
    };

    const missing = evaluateRunAcceptance(root, { runId: "r1", packet });
    expect(missing.ok).toBe(false);
    expect(missing.missing).toContain("verifier_handoff");

    const specRel = "apps/sieger-show-secretary/e2e/happy-path.spec.ts";
    mkdirSync(join(root, "apps/sieger-show-secretary/e2e"), { recursive: true });
    writeFileSync(join(root, specRel), "test('happy path', () => {});", "utf8");
    writeHandoff(
      root,
      "17-verifier.md",
      `---
phase: "17"
position: verifier
verdict: pass
happy_path_status: pass
happy_path_spec: ${specRel}
---
`,
    );
    const ok = evaluateRunAcceptance(root, { runId: "r1", packet });
    expect(ok.ok).toBe(true);
  });

  it("missing reference_blocked:O2 when PM is done and O2 blocks product-manager", () => {
    const root = tempRepo();
    mkdirSync(join(root, "docs/projects/passive-grid/MEMORY"), { recursive: true });
    writeFileSync(
      join(root, "docs/projects/passive-grid/MEMORY/decisions.md"),
      `# Decisions
## Open
| id | question | owner | blocks_seats |
|----|----------|-------|--------------|
| O2 | Gold approved ADRK critique PDF | operator | product-manager, tech-lead, brand-designer |
`,
    );
    writeHandoff(
      root,
      "5-product-manager.md",
      `---
phase: "5"
position: product-manager
status: done
---
## Operator brief (plain English)
Drafted the PRD slice.
`,
    );

    const result = evaluateRunAcceptance(root, {
      runId: "run-ref-o2",
      packet: {
        ...basePacket,
        phase: "5",
        position: "product-manager",
        goal: "PRD",
        preferred_ic: undefined,
        require_ic_handoff: false,
        require_inbox: false,
      },
    });
    expect(result.ok).toBe(false);
    expect(result.missing).toContain("reference_blocked:O2");
  });

  it("missing reask:O1 when handoff re-asks a locked register item", () => {
    const root = tempRepo();
    writeInbox(root, "5-hop.md", {
      status: "pending_review",
      position: "head-of-product",
      phase: "5",
      goal: "PRD",
      runId: "run-5",
      artifact_path: writePrdArtifact(root),
    });
    mkdirSync(join(root, "docs/projects/passive-grid/MEMORY"), { recursive: true });
    writeFileSync(
      join(root, "docs/projects/passive-grid/MEMORY/decisions.md"),
      `# Decisions
## Locked
| id | decision | asked_as |
| O1 | First-show rulebook = ADRK | which rulebook, first-show rulebook |
`,
    );
    writeHandoff(
      root,
      "5-manager-head-of-product.md",
      `---
phase: "5"
position: head-of-product
status: done
---
## Operator brief (plain English)
Merged the PRD.

## Next steps
1. Operator — which rulebook governs the first deployment?
`,
    );

    const result = evaluateRunAcceptance(root, {
      runId: "run-5",
      packet: {
        ...basePacket,
        phase: "5",
        position: "head-of-product",
        goal: "PRD",
        preferred_ic: undefined,
        require_ic_handoff: false,
        require_inbox: true,
      },
    });
    expect(result.ok).toBe(false);
    expect(result.missing).toContain("reask:O1");
  });

  it("missing brief_echo when manager brief copies the IC operator brief", () => {
    const root = tempRepo();
    writeInbox(root, "5-hop.md", {
      status: "pending_review",
      position: "head-of-product",
      phase: "5",
      goal: "PRD",
      runId: "run-5b",
      artifact_path: writePrdArtifact(root),
    });
    const story =
      "We finished the product requirements for Sieger Show Secretary the software that turns a judge spoken ringside critique into an approved PDF emailed to the dog owner with multi-show login and four selectable rulebooks.";
    writeHandoff(
      root,
      "5-product-manager.md",
      `---
phase: "5"
position: product-manager
status: done
---
## Operator brief (plain English)
${story}
`,
    );
    writeHandoff(
      root,
      "5-manager-head-of-product.md",
      `---
phase: "5"
position: head-of-product
status: done
---
## Operator brief (plain English)
${story}
`,
    );

    const result = evaluateRunAcceptance(root, {
      runId: "run-5b",
      packet: {
        ...basePacket,
        phase: "5",
        position: "head-of-product",
        goal: "PRD",
        preferred_ic: undefined,
        require_ic_handoff: false,
        require_inbox: true,
      },
    });
    expect(result.ok).toBe(false);
    expect(result.missing.some((m) => m.startsWith("brief_echo:"))).toBe(true);
  });

  it("missing pack_not_allowed:prd-writer when IC cites a pack outside the seat table", () => {
    const root = tempRepo();
    writeInbox(root, "5-pm.md", {
      status: "pending_review",
      position: "product-manager",
      phase: "5",
      goal: "PRD",
      runId: "run-5c",
      artifact_path: writePrdArtifact(root),
    });
    mkdirSync(join(root, "skills/org/positions/product-manager"), {
      recursive: true,
    });
    writeFileSync(
      join(root, "skills/org/positions/product-manager/SKILL.md"),
      `# Product Manager

## Skill packs
Read each pack's \`SKILL.md\` before use. Do not load packs outside this list unless the orchestrator expands scope.

| Pack path | Use for |
|-----------|---------|
| \`skills/community/awesome-claude-corporate-skills/09-product-management/feature-spec/\` | Feature specs |
| \`skills/community/awesome-claude-corporate-skills/09-product-management/roadmap-builder/\` | Roadmap |
| \`skills/community/business-analysis-skills/skills/moscow-prioritisation/\` | MoSCoW |
`,
    );
    writeHandoff(
      root,
      "5-product-manager.md",
      `---
phase: "5"
position: product-manager
status: done
---
## Operator brief (plain English)
Drafted the PRD slice.

## Packs used
| Pack | Decision tied to pack |
|------|------------------------|
| \`skills/community/awesome-claude-corporate-skills/09-product-management/prd-writer/SKILL.md\` | Structured PRD |
`,
    );

    const result = evaluateRunAcceptance(root, {
      runId: "run-5c",
      packet: {
        ...basePacket,
        phase: "5",
        position: "product-manager",
        goal: "PRD",
        preferred_ic: undefined,
        require_ic_handoff: false,
        require_inbox: true,
      },
    });
    expect(result.ok).toBe(false);
    expect(result.missing).toContain("pack_not_allowed:prd-writer");
  });

  it("missing packs_used_missing when IC/manager handoff is ≥20 lines with empty Packs used", () => {
    const root = tempRepo();
    writeInbox(root, "5-pm.md", {
      status: "pending_review",
      position: "product-manager",
      phase: "5",
      goal: "PRD",
      runId: "run-5d",
      artifact_path: writePrdArtifact(root),
    });
    mkdirSync(join(root, "skills/org/positions/product-manager"), {
      recursive: true,
    });
    writeFileSync(
      join(root, "skills/org/positions/product-manager/SKILL.md"),
      `# Product Manager\n`,
    );
    const longBody = [
      "## Operator brief (plain English)",
      "Drafted the PRD slice.",
      ...Array.from({ length: 22 }, (_, i) => `Detail line ${i + 1}.`),
      "",
      "## Packs used",
      "| Pack | Decision tied to pack |",
      "|------|------------------------|",
    ].join("\n");
    writeHandoff(
      root,
      "5-product-manager.md",
      `---
phase: "5"
position: product-manager
status: done
---
${longBody}
`,
    );

    const result = evaluateRunAcceptance(root, {
      runId: "run-5d",
      packet: {
        ...basePacket,
        phase: "5",
        position: "product-manager",
        goal: "PRD",
        preferred_ic: undefined,
        require_ic_handoff: false,
        require_inbox: true,
      },
    });
    expect(result.missing).toContain("packs_used_missing");
  });

  it("does not flag packs_used_missing when IC/manager body is a skip stub under 20 lines", () => {
    const root = tempRepo();
    writeInbox(root, "5-pm.md", {
      status: "pending_review",
      position: "product-manager",
      phase: "5",
      goal: "PRD",
      runId: "run-5e",
      artifact_path: writePrdArtifact(root),
    });
    mkdirSync(join(root, "skills/org/positions/product-manager"), {
      recursive: true,
    });
    writeFileSync(
      join(root, "skills/org/positions/product-manager/SKILL.md"),
      `# Product Manager\n`,
    );
    writeHandoff(
      root,
      "5-product-manager.md",
      `---
phase: "5"
position: product-manager
status: done
---
## Operator brief (plain English)
Skipped — no PRD work this slice.

## Packs used
| Pack | Decision tied to pack |
|------|------------------------|
`,
    );

    const result = evaluateRunAcceptance(root, {
      runId: "run-5e",
      packet: {
        ...basePacket,
        phase: "5",
        position: "product-manager",
        goal: "PRD",
        preferred_ic: undefined,
        require_ic_handoff: false,
        require_inbox: true,
      },
    });
    expect(result.missing).not.toContain("packs_used_missing");
  });

  it("missing csuite_no_new_risk when review has no new-risk section", () => {
    const root = tempRepo();
    writeHandoff(
      root,
      "3-csuite-review.md",
      `---
phase: "3"
position: ceo-strategist
verdict: approve
---
## Operator brief (plain English)
Strategy holds. Advance the market brief.

## Scorecard (from ORG-REGISTRY)
| Criterion | Pass? | Notes |
|-----------|-------|-------|
| Direction | yes | Clear |
`,
    );

    const result = evaluateRunAcceptance(root, {
      runId: "run-3",
      packet: {
        ...basePacket,
        phase: "3",
        position: "ceo-strategist",
        goal: "C-suite review",
        preferred_ic: undefined,
        require_inbox: false,
        require_ic_handoff: false,
      },
    });

    expect(result.ok).toBe(false);
    expect(result.missing).toContain("csuite_no_new_risk");
  });

  it("missing pack_procedure:feature-spec when PM cites feature-spec and 05-prd.md lacks User stories", () => {
    const root = tempRepo();
    mkdirSync(join(root, "skills/org/positions/product-manager"), {
      recursive: true,
    });
    writeFileSync(
      join(root, "skills/org/PACK-PROCEDURES.md"),
      `# Pack procedures

| pack | required_headings |
|------|-------------------|
| skills/community/awesome-claude-corporate-skills/09-product-management/feature-spec | User stories, Functional requirements |
`,
      "utf8",
    );
    writeFileSync(
      join(root, "skills/org/ARTIFACT-QUALITY.md"),
      `# Artifact quality (structural)

| id | phase | artifact | must_contain_headings |
|----|-------|----------|------------------------|
| q5-prd | 5 | 05-prd.md | Personas |
`,
      "utf8",
    );
    writeFileSync(
      join(root, "skills/org/positions/product-manager/SKILL.md"),
      `# Product Manager

## Skill packs
| Pack path | Use for |
|-----------|---------|
| \`skills/community/awesome-claude-corporate-skills/09-product-management/feature-spec/\` | Feature specs |
`,
      "utf8",
    );
    writeFileSync(
      join(root, BIZ_IDEA, "05-prd.md"),
      `# PRD\n## Personas\n## Functional requirements\n`,
      "utf8",
    );
    writeHandoff(
      root,
      "5-product-manager.md",
      `---
phase: "5"
position: product-manager
status: done
---
## Operator brief (plain English)
Drafted the PRD slice.

## Packs used
| Pack | Decision tied to pack |
|------|------------------------|
| \`skills/community/awesome-claude-corporate-skills/09-product-management/feature-spec/SKILL.md\` | Feature spec headings |
`,
    );

    const result = evaluateRunAcceptance(root, {
      runId: "run-proc-5",
      packet: {
        ...basePacket,
        phase: "5",
        position: "product-manager",
        goal: "PRD",
        preferred_ic: undefined,
        require_ic_handoff: false,
        require_inbox: false,
      },
    });

    expect(result.ok).toBe(false);
    expect(result.missing).toContain("pack_procedure:feature-spec");
  });

  it("missing quality_fail:q5-prd when 05-prd.md lacks MoSCoW", () => {
    const root = tempRepo();
    mkdirSync(join(root, "skills/org"), { recursive: true });
    writeFileSync(
      join(root, "skills/org/ARTIFACT-QUALITY.md"),
      `# Artifact quality (structural)

| id | phase | artifact | must_contain_headings |
|----|-------|----------|------------------------|
| q5-prd | 5 | 05-prd.md | Personas, MoSCoW, User stories, NOT doing |
`,
      "utf8",
    );
    writeFileSync(
      join(root, BIZ_IDEA, "05-prd.md"),
      `# PRD\n## Personas\n## User stories\n## NOT doing\n`,
      "utf8",
    );

    const result = evaluateRunAcceptance(root, {
      runId: "run-q5",
      packet: {
        ...basePacket,
        phase: "5",
        position: "head-of-product",
        goal: "PRD",
        preferred_ic: undefined,
        require_inbox: false,
        require_ic_handoff: false,
      },
    });

    expect(result.ok).toBe(false);
    expect(result.missing).toContain("quality_fail:q5-prd");
  });

  it("skips quality_scorecard when manager handoff is blocked", () => {
    const root = tempRepo();
    mkdirSync(join(root, "skills/org"), { recursive: true });
    writeFileSync(
      join(root, "skills/org/ARTIFACT-QUALITY.md"),
      `# Artifact quality (structural)

| id | phase | artifact | must_contain_headings |
|----|-------|----------|------------------------|
| q5-prd | 5 | 05-prd.md | Personas, MoSCoW, User stories, NOT doing |
`,
      "utf8",
    );
    writeHandoff(
      root,
      "5-manager-head-of-product.md",
      `---
phase: "5"
position: head-of-product
status: blocked
---
## Operator brief (plain English)
Blocked on operator input.
`,
    );

    const result = evaluateRunAcceptance(root, {
      runId: "run-q5-blocked",
      packet: {
        ...basePacket,
        phase: "5",
        position: "head-of-product",
        goal: "PRD",
        preferred_ic: undefined,
        require_inbox: false,
        require_ic_handoff: false,
      },
    });

    expect(result.missing).not.toContain("quality_scorecard");
    expect(result.missing).not.toContain("quality_fail:q5-prd");
  });

  it("missing happy_path_spec when verifier pass has no spec path", () => {
    const root = tempRepo();
    const packet: ManagerPacket = {
      ...basePacket,
      phase: "17",
      require_inbox: false,
      require_ic_handoff: false,
      require_production: false,
    };
    writeHandoff(
      root,
      "17-verifier.md",
      `---
phase: "17"
position: verifier
verdict: pass
---
`,
    );

    const result = evaluateRunAcceptance(root, { runId: "r1", packet });
    expect(result.ok).toBe(false);
    expect(result.missing).toContain("happy_path_spec");
  });

  it("missing inbox_not_artifact when require_inbox and inbox lacks artifact_path", () => {
    const root = tempRepo();
    writeInbox(root, "5-hop.md", {
      status: "pending_review",
      position: "head-of-product",
      phase: "5",
      goal: "PRD",
      runId: "run-art-missing",
    });

    const result = evaluateRunAcceptance(root, {
      runId: "run-art-missing",
      packet: {
        ...basePacket,
        phase: "5",
        position: "head-of-product",
        goal: "PRD",
        preferred_ic: undefined,
        require_ic_handoff: false,
        require_inbox: true,
      },
    });

    expect(result.ok).toBe(false);
    expect(result.missing).toContain("inbox_not_artifact");
  });

  it("does not flag inbox_not_artifact when artifact_path points at a real 05-prd.md", () => {
    const root = tempRepo();
    const prdRel = `${BIZ_IDEA}/05-prd.md`;
    writeFileSync(join(root, prdRel), "# PRD\n", "utf8");
    writeInbox(root, "5-hop.md", {
      status: "pending_review",
      position: "head-of-product",
      phase: "5",
      goal: "PRD",
      runId: "run-art-ok",
      artifact_path: prdRel,
    });

    const result = evaluateRunAcceptance(root, {
      runId: "run-art-ok",
      packet: {
        ...basePacket,
        phase: "5",
        position: "head-of-product",
        goal: "PRD",
        preferred_ic: undefined,
        require_ic_handoff: false,
        require_inbox: true,
      },
    });

    expect(result.missing).not.toContain("inbox_not_artifact");
  });

  it("missing inbox_not_artifact when artifact_path is the inbox filename", () => {
    const root = tempRepo();
    writeInbox(root, "5-hop.md", {
      status: "pending_review",
      position: "head-of-product",
      phase: "5",
      goal: "PRD",
      runId: "run-art-self",
      artifact_path: "5-hop.md",
    });

    const result = evaluateRunAcceptance(root, {
      runId: "run-art-self",
      packet: {
        ...basePacket,
        phase: "5",
        position: "head-of-product",
        goal: "PRD",
        preferred_ic: undefined,
        require_ic_handoff: false,
        require_inbox: true,
      },
    });

    expect(result.missing).toContain("inbox_not_artifact");
  });

  it("missing inbox_not_artifact when artifact_path ends with HANDOFFS/", () => {
    const root = tempRepo();
    writeInbox(root, "5-hop.md", {
      status: "pending_review",
      position: "head-of-product",
      phase: "5",
      goal: "PRD",
      runId: "run-art-handoffs",
      artifact_path: `${BIZ_IDEA}/HANDOFFS/`,
    });

    const result = evaluateRunAcceptance(root, {
      runId: "run-art-handoffs",
      packet: {
        ...basePacket,
        phase: "5",
        position: "head-of-product",
        goal: "PRD",
        preferred_ic: undefined,
        require_ic_handoff: false,
        require_inbox: true,
      },
    });

    expect(result.missing).toContain("inbox_not_artifact");
  });

  it("missing inbox_not_artifact when artifact_path file is missing on disk", () => {
    const root = tempRepo();
    writeInbox(root, "5-hop.md", {
      status: "pending_review",
      position: "head-of-product",
      phase: "5",
      goal: "PRD",
      runId: "run-art-gone",
      artifact_path: `${BIZ_IDEA}/05-prd.md`,
    });

    const result = evaluateRunAcceptance(root, {
      runId: "run-art-gone",
      packet: {
        ...basePacket,
        phase: "5",
        position: "head-of-product",
        goal: "PRD",
        preferred_ic: undefined,
        require_ic_handoff: false,
        require_inbox: true,
      },
    });

    expect(result.missing).toContain("inbox_not_artifact");
  });

  it("does not enforce artifact_path on phase 0 inbox", () => {
    const root = tempRepo();
    writeInbox(root, "0-cfo.md", {
      status: "pending_review",
      position: "cfo",
      phase: "0",
      goal: "Intake numbers",
      runId: "run-p0",
    });

    const result = evaluateRunAcceptance(root, {
      runId: "run-p0",
      packet: {
        ...basePacket,
        phase: "0",
        position: "cfo",
        goal: "Intake numbers",
        preferred_ic: undefined,
        require_ic_handoff: false,
        require_inbox: true,
      },
    });

    expect(result.missing).not.toContain("inbox_not_artifact");
    expect(result.ok).toBe(true);
  });

  it("phase 6 accepts 06-gtm-plan.md without 06-enablement steward card", () => {
    const root = tempRepo();
    const gtmRel = `${BIZ_IDEA}/06-gtm-plan.md`;
    writeFileSync(join(root, gtmRel), "# GTM\n", "utf8");
    writeInbox(root, "6-cmo.md", {
      status: "pending_review",
      position: "cmo",
      phase: "6",
      goal: "GTM plan",
      runId: "run-p6",
      artifact_path: gtmRel,
    });

    const result = evaluateRunAcceptance(root, {
      runId: "run-p6",
      packet: {
        ...basePacket,
        phase: "6",
        position: "cmo",
        goal: "GTM plan",
        preferred_ic: undefined,
        require_ic_handoff: false,
        require_inbox: true,
      },
    });

    expect(result.missing).not.toContain("inbox_not_artifact");
  });

  it("missing model_tier when handoff tier does not match registry", () => {
    const root = tempRepo();
    writeModelRegistry(root);
    writeHandoff(
      root,
      "6-creative-director.md",
      `---
phase: "6"
position: creative-director
status: done
llm_tier: fast-ops
generation_profile: none
fallback_applied: false
---
# Creative director
`,
    );

    const result = evaluateRunAcceptance(root, {
      runId: "run-tier",
      packet: {
        ...basePacket,
        phase: "6",
        position: "creative-director",
        goal: "GTM copy",
        preferred_ic: undefined,
        require_inbox: false,
        require_ic_handoff: false,
      },
    });

    expect(result.ok).toBe(false);
    expect(result.missing).toContain("model_tier");
  });

  it("missing model_tier when creative-language seat set fallback_applied true", () => {
    const root = tempRepo();
    writeModelRegistry(root);
    writeHandoff(
      root,
      "6-creative-director.md",
      `---
phase: "6"
position: creative-director
status: done
llm_tier: creative-language
generation_profile: none
fallback_applied: true
---
# Creative director
`,
    );

    const result = evaluateRunAcceptance(root, {
      runId: "run-fallback",
      packet: {
        ...basePacket,
        phase: "6",
        position: "creative-director",
        goal: "GTM copy",
        preferred_ic: undefined,
        require_inbox: false,
        require_ic_handoff: false,
      },
    });

    expect(result.ok).toBe(false);
    expect(result.missing).toContain("model_tier");
  });

  it("skips model_tier when MODEL-REGISTRY.md is absent", () => {
    const root = tempRepo();
    writeHandoff(
      root,
      "6-creative-director.md",
      `---
phase: "6"
position: creative-director
status: done
llm_tier: creative-language
generation_profile: none
fallback_applied: true
---
# Creative director
`,
    );

    const result = evaluateRunAcceptance(root, {
      runId: "run-skip-registry",
      packet: {
        ...basePacket,
        phase: "6",
        position: "creative-director",
        goal: "GTM copy",
        preferred_ic: undefined,
        require_inbox: false,
        require_ic_handoff: false,
      },
    });

    expect(result.missing).not.toContain("model_tier");
    expect(result.ok).toBe(true);
  });
});
