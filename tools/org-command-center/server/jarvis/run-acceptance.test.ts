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
});
