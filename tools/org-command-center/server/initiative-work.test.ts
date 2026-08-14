import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import { loadInitiativeWork } from "./initiative-work";

describe("loadInitiativeWork", () => {
  it("reads handoffs, runs, and inbox under a businessIdea path", () => {
    const root = join(tmpdir(), `init-work-${Date.now()}`);
    const idea = "docs/orgs/x/customers/c/initiatives/i/business-idea";
    mkdirSync(join(root, idea, "HANDOFFS"), { recursive: true });
    mkdirSync(join(root, idea, "DISPATCH", "runs"), { recursive: true });
    mkdirSync(join(root, idea, "REVIEW", "inbox"), { recursive: true });
    writeFileSync(
      join(root, idea, "HANDOFFS", "1-manager-ceo-strategist.md"),
      `---
phase: "1"
position: ceo-strategist
ics_spawned:
  - business-analyst
---
# Brief
`,
    );
    writeFileSync(
      join(root, idea, "DISPATCH", "runs", "1-ceo.json"),
      JSON.stringify({
        runId: "1-ceo",
        status: "completed",
        position: "ceo-strategist",
        phase: "1",
        claimed: "x.yaml",
        dispatch_filename: "x.yaml",
        wake_reason: "on_demand",
        started_at: "t",
        llm_model: "x",
      }),
    );
    writeFileSync(
      join(root, idea, "REVIEW", "inbox", "1-ceo-strategist-deliverable.md"),
      `---
position: ceo-strategist
phase: "1"
status: ready
---
# D
`,
    );
    const work = loadInitiativeWork(root, idea);
    expect(work.handoffs[0]?.position).toBe("ceo-strategist");
    expect(work.handoffs[0]?.icsSpawned).toEqual(["business-analyst"]);
    expect(work.runs[0]?.runId).toBe("1-ceo");
    expect(work.inbox[0]?.position).toBe("ceo-strategist");
  });

  it("returns empty lists when folders are missing", () => {
    const root = join(tmpdir(), `init-work-empty-${Date.now()}`);
    mkdirSync(root, { recursive: true });
    const work = loadInitiativeWork(root, "docs/missing");
    expect(work.handoffs).toEqual([]);
    expect(work.runs).toEqual([]);
    expect(work.inbox).toEqual([]);
  });
});
