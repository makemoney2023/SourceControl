import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { ManagerPacket } from "../../src/lib/types";
import { evaluateRunAcceptance } from "./run-acceptance";

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
    const ok = evaluateRunAcceptance(root, { runId: "r1", packet });
    expect(ok.ok).toBe(true);
  });
});
