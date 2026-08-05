import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { persistSeatAnswers, buildSeatAnswerGoal } from "./seat-answer";
import { executeIntent } from "./tools-exec";

const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), "../../src/lib/fixtures");
const BIZ_IDEA = "docs/projects/passive-grid/business-idea";

function tempRepo() {
  const root = mkdtempSync(join(tmpdir(), "seat-answer-"));
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
  mkdirSync(join(root, "docs/projects/passive-grid/MEMORY/notes"), { recursive: true });
  writeFileSync(join(idea, "RUNBOOK-TRACKER.md"), readFileSync(join(FIXTURES, "sample-tracker.md"), "utf8"));
  return root;
}

function writeNeedsInputHandoff(repoRoot: string) {
  writeFileSync(
    join(repoRoot, BIZ_IDEA, "HANDOFFS", "2-market-research-analyst.md"),
    `---
kind: ic
phase: "2"
position: market-research-analyst
reports_to: head-of-research
status: needs_input
verdict_for_manager: ""
verdict: ""
llm_tier: strong-general
generation_profile: none
fallback_applied: ""
---

# Handoff

## Asks for manager

- Which geography should we prioritize?

## In plain English
We need a geography call before continuing.
`,
  );
}

describe("persistSeatAnswers / buildSeatAnswerGoal", () => {
  it("writes operator answers onto the handoff and a memory note", () => {
    const repo = tempRepo();
    writeNeedsInputHandoff(repo);
    const result = persistSeatAnswers(repo, "market-research-analyst", {
      "Which geography should we prioritize?": "Outer Banks beaches",
    });
    expect(result.handoffRel).toMatch(/HANDOFFS/);
    const handoff = readFileSync(join(repo, result.handoffRel), "utf8");
    expect(handoff).toMatch(/## Operator answers/i);
    expect(handoff).toMatch(/Outer Banks beaches/);
    expect(result.memoryRel).toBeTruthy();
    const note = readFileSync(join(repo, result.memoryRel!), "utf8");
    expect(note).toMatch(/Outer Banks beaches/);
  });

  it("builds a continue goal with Requirements from answers", () => {
    const goal = buildSeatAnswerGoal("market-research-analyst", {
      "Which geography should we prioritize?": "Outer Banks beaches",
    });
    expect(goal).toMatch(/Continue work for market-research-analyst/i);
    expect(goal).toMatch(/Requirements:/);
    expect(goal).toMatch(/Outer Banks beaches/);
  });
});

describe("executeIntent seat.answer", () => {
  const okAdapter = {
    async run() {
      return { status: "completed", result: "done" };
    },
  };

  it("maps a freeform answer onto the open ask and defaults seat when only one needs answers", async () => {
    const repo = tempRepo();
    writeNeedsInputHandoff(repo);
    const result = (await executeIntent(repo, "seat.answer", {
      answer: "prioritize Outer Banks geography",
      apiKey: "test-key",
      adapter: okAdapter,
    })) as { ok: boolean; blockedSeat?: string };
    expect(result.ok).toBe(true);
    expect(result.blockedSeat).toBe("market-research-analyst");
    const handoff = readFileSync(
      join(repo, BIZ_IDEA, "HANDOFFS", "2-market-research-analyst.md"),
      "utf8",
    );
    expect(handoff).toMatch(/Outer Banks/);
    expect(handoff).toMatch(/Which geography should we prioritize/);
  });

  it("continues a seat that has open asks even when status is not needs_input", async () => {
    const repo = tempRepo();
    writeFileSync(
      join(repo, BIZ_IDEA, "HANDOFFS", "2-market-research-analyst.md"),
      `---
kind: ic
phase: "2"
position: market-research-analyst
reports_to: head-of-research
status: done
---

# Handoff

## Asks for manager

- Confirm weekend vs weekday events?
`,
    );
    const before = readFileSync(
      join(repo, BIZ_IDEA, "HANDOFFS", "2-market-research-analyst.md"),
      "utf8",
    );
    expect(before).not.toMatch(/## Operator answers/);
    const result = (await executeIntent(repo, "seat.answer", {
      seat: "market-research-analyst",
      answers: { "Confirm weekend vs weekday events?": "Weekends only" },
      apiKey: "test-key",
      adapter: okAdapter,
    })) as { ok: boolean; action?: string };
    expect(result.ok).toBe(true);
    expect(result.action).toBe("queue");
    const after = readFileSync(
      join(repo, BIZ_IDEA, "HANDOFFS", "2-market-research-analyst.md"),
      "utf8",
    );
    expect(after).toMatch(/Weekends only/);
  });

  it("does not persist answers when the seat cannot be continued", async () => {
    const repo = tempRepo();
    writeFileSync(
      join(repo, BIZ_IDEA, "HANDOFFS", "2-market-research-analyst.md"),
      `---
kind: ic
phase: "2"
position: market-research-analyst
reports_to: head-of-research
status: done
---

# Handoff

No asks here.
`,
    );
    await expect(
      executeIntent(repo, "seat.answer", {
        seat: "market-research-analyst",
        answers: { "Anything?": "Nope" },
        apiKey: "test-key",
        adapter: okAdapter,
      }),
    ).rejects.toThrow();
    const after = readFileSync(
      join(repo, BIZ_IDEA, "HANDOFFS", "2-market-research-analyst.md"),
      "utf8",
    );
    expect(after).not.toMatch(/## Operator answers/);
  });

  it("persists answers and queues owner to continue", async () => {
    const repo = tempRepo();
    writeNeedsInputHandoff(repo);
    const result = (await executeIntent(repo, "seat.answer", {
      seat: "market-research-analyst",
      answers: {
        "Which geography should we prioritize?": "Outer Banks beaches",
      },
      apiKey: "test-key",
      adapter: okAdapter,
    })) as {
      ok: boolean;
      action?: string;
      spoken?: string;
      blockedSeat?: string;
    };
    expect(result.ok).toBe(true);
    expect(result.action).toBe("queue");
    expect(result.blockedSeat).toBe("market-research-analyst");
    expect(result.spoken).toMatch(/continu/i);
    const handoff = readFileSync(
      join(repo, BIZ_IDEA, "HANDOFFS", "2-market-research-analyst.md"),
      "utf8",
    );
    expect(handoff).toMatch(/Outer Banks beaches/);
  });
});
