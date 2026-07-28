import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type { ProjectRegistry } from "../paths";
import {
  advancePhase0Roundtable,
  isPhase0RoundtableRequest,
  loadPhase0Roundtable,
  parseRewakeSeatsList,
  PHASE0_PEER_SEATS,
  planPhase0PeerBatch,
  spokenPhase0FindingsBrief,
  startPhase0Roundtable,
} from "./phase0-roundtable";

const BIZ = "docs/projects/a/business-idea";

function seedRepo(): string {
  const root = mkdtempSync(join(tmpdir(), "phase0-rt-"));
  mkdirSync(join(root, "projects"), { recursive: true });
  mkdirSync(join(root, "skills/org"), { recursive: true });
  mkdirSync(join(root, BIZ, "DISPATCH/runs"), { recursive: true });
  mkdirSync(join(root, BIZ, "HANDOFFS"), { recursive: true });
  mkdirSync(join(root, "docs/projects/a/MEMORY"), { recursive: true });
  const reg: ProjectRegistry = {
    active: "a",
    projects: {
      a: {
        name: "Alpha",
        businessIdea: BIZ,
        memory: "docs/projects/a/MEMORY",
      },
    },
  };
  writeFileSync(join(root, "projects/registry.json"), JSON.stringify(reg, null, 2));
  writeFileSync(join(root, "skills/org/ORG-REGISTRY.md"), "# Org\n");
  return root;
}

describe("phase0-roundtable", () => {
  let root = "";
  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it("spokenPhase0FindingsBrief speaks plain English, not peer-table jargon", () => {
    root = seedRepo();
    writeFileSync(
      join(root, BIZ, "HANDOFFS/0-csuite-review.md"),
      [
        "---",
        "verdict: approve",
        "rewake_seats: []",
        "---",
        "",
        "# C-suite review — Phase 0",
        "",
        "## Peer briefs present",
        "| Seat | Brief | Peer recommendation | Load-bearing stance |",
        "|------|-------|---------------------|---------------------|",
        "| cfo | yes | approve | Per-cup economics; mid-case ~$5 COGS assumptions |",
        "| cmo | yes | approve | Booth-native GTM; skip ads until economics proven |",
        "| coo | yes | approve | Ops gated on geography + temp food permit |",
        "| head-of-research | yes | approve | Evidence debt; category crowded |",
        "",
        "## Load-bearing conflict check",
        "| Topic | Tension? | Resolution |",
        "|-------|----------|------------|",
        "| Pricing band | soft | Carry both ranges into Phase 4 |",
        "| Permits | aligned | Does not block Phase 0 close |",
        "",
        "## Verdict",
        "**approve** — Intake merge is coherent. Advance to Phase 1 framing.",
        "",
        "## Comments for manager / company",
        "- Keep CFO ranges as labeled assumptions.",
        "- No event sale until permit + insurance clear.",
        "",
      ].join("\n"),
    );

    const spoken = spokenPhase0FindingsBrief(root);
    expect(spoken).toBeTruthy();
    expect(spoken!).toMatch(/C-suite says approve/i);
    expect(spoken!).toMatch(/Finance, marketing, ops, and research/i);
    expect(spoken!).toMatch(/Pricing band/i);
    expect(spoken!).toMatch(/Phase 1/i);
    expect(spoken!).not.toMatch(/Per-cup|COGS|GTM|Evidence debt/i);
    expect(spoken!.length).toBeGreaterThan(60);
    expect(spoken!.length).toBeLessThanOrEqual(420);
    expect(spoken!).not.toMatch(/[*`#|]/);
  });

  it("spokenPhase0FindingsBrief falls back to thin verdict when review is sparse", () => {
    root = seedRepo();
    writeFileSync(
      join(root, BIZ, "HANDOFFS/0-csuite-review.md"),
      "---\nverdict: block\n---\n# Review\n",
    );
    const spoken = spokenPhase0FindingsBrief(root);
    expect(spoken).toMatch(/C-suite says block/i);
  });

  it("spokenPhase0FindingsBrief prefers In plain English and Next steps", () => {
    root = seedRepo();
    writeFileSync(
      join(root, BIZ, "HANDOFFS/0-csuite-review.md"),
      [
        "---",
        "verdict: approve",
        "---",
        "",
        "# C-suite review — Phase 0",
        "",
        "## In plain English",
        "The lemonade stand intake is coherent enough to keep exploring.",
        "We should not sell at events until permits and insurance are clear.",
        "",
        "## Next steps",
        "1. Operator names city and first two events.",
        "2. Orchestrator opens Phase 1 framing after that.",
        "",
        "## Peer briefs present",
        "| Seat | Brief | Peer recommendation | Load-bearing stance |",
        "|------|-------|---------------------|---------------------|",
        "| cfo | yes | approve | obscure jargon that should not dominate speech |",
        "",
      ].join("\n"),
    );
    const spoken = spokenPhase0FindingsBrief(root);
    expect(spoken).toMatch(/C-suite says approve/i);
    expect(spoken).toMatch(/lemonade stand intake/i);
    expect(spoken).toMatch(/Next:.*city|events/i);
    expect(spoken).not.toMatch(/obscure jargon/i);
  });

  it("parseRewakeSeatsList accepts YAML unquoted seat arrays", () => {
    expect(parseRewakeSeatsList("[]")).toEqual([]);
    expect(parseRewakeSeatsList("[cfo]")).toEqual(["cfo"]);
    expect(parseRewakeSeatsList("[cfo, cmo]")).toEqual(["cfo", "cmo"]);
    expect(parseRewakeSeatsList("['cfo', \"cmo\"]")).toEqual(["cfo", "cmo"]);
  });

  it("isPhase0RoundtableRequest for CEO phase 0 / intake goals", () => {
    expect(
      isPhase0RoundtableRequest({ phase: "0", position: "ceo-strategist", goal: "x" }),
    ).toBe(true);
    expect(
      isPhase0RoundtableRequest({
        phase: "2",
        position: "ceo-strategist",
        goal: "Phase 0 Intake",
      }),
    ).toBe(true);
    expect(
      isPhase0RoundtableRequest({
        phase: "2",
        position: "head-of-research",
        goal: "market",
      }),
    ).toBe(false);
  });

  it("isPhase0RoundtableRequest even when model passes wrong seat (STT Phase 0)", () => {
    expect(
      isPhase0RoundtableRequest({
        phase: "0",
        position: "head-of-research",
        goal: "Restart 5 Phase 0",
      }),
    ).toBe(true);
    expect(
      isPhase0RoundtableRequest({
        phase: "2",
        position: "manager",
        goal: "restart phase zero",
      }),
    ).toBe(true);
  });

  it("planPhase0PeerBatch returns four peer seats for phase 0", () => {
    const items = planPhase0PeerBatch();
    expect(items.map((i) => i.position).sort()).toEqual([...PHASE0_PEER_SEATS].sort());
    expect(items.every((i) => i.phase === "0")).toBe(true);
    expect(items.every((i) => i.goal.length > 20)).toBe(true);
  });

  it("startPhase0Roundtable writes awaiting_ceo_intake state", () => {
    root = seedRepo();
    const state = startPhase0Roundtable(root, { ceoIntakeRunId: "run-ceo-1" });
    expect(state.status).toBe("awaiting_ceo_intake");
    expect(state.ceoIntakeRunId).toBe("run-ceo-1");
    expect(loadPhase0Roundtable(root)?.status).toBe("awaiting_ceo_intake");
  });

  it("advance: CEO done + intake present → queues and spawns peers", () => {
    root = seedRepo();
    startPhase0Roundtable(root, { ceoIntakeRunId: "run-ceo-1" });
    writeFileSync(join(root, BIZ, "00-intake.md"), "# Intake\nclassification: service\n");
    writeFileSync(
      join(root, BIZ, "DISPATCH/runs/run-ceo-1.json"),
      JSON.stringify({
        runId: "run-ceo-1",
        status: "completed",
        position: "ceo-strategist",
        phase: "0",
        finished_at: "2026-07-17T18:00:00.000Z",
        started_at: "2026-07-17T17:00:00.000Z",
      }),
    );

    const queued: string[] = [];
    const spawned: string[] = [];
    const next = advancePhase0Roundtable(root, {
      queuePeers: (_repo, items) => {
        queued.push(...items.map((i) => i.position));
        return {
          filenames: items.map((i) => `0-${i.position}.yaml`),
          items: items.map((i) => ({
            position: i.position,
            filename: `0-${i.position}.yaml`,
          })),
        };
      },
      spawnFilenames: (_repo, filenames) => {
        spawned.push(...filenames);
        return {
          started: filenames.map((f) => ({
            position: f.replace(/^0-/, "").replace(/\.yaml$/, ""),
            runId: `run-${f}`,
            filename: f,
          })),
        };
      },
    });

    expect(next?.status).toBe("peers_running");
    expect(queued.sort()).toEqual([...PHASE0_PEER_SEATS].sort());
    expect(spawned).toHaveLength(4);
    expect(Object.keys(next!.peerRunIds).sort()).toEqual([...PHASE0_PEER_SEATS].sort());
  });

  it("advance: all peer briefs → spawns CEO merge", () => {
    root = seedRepo();
    startPhase0Roundtable(root, { ceoIntakeRunId: "run-ceo-1" });
    writeFileSync(join(root, BIZ, "00-intake.md"), "# Intake\n");
    // Jump state to peers_running
    const statePath = join(root, BIZ, "DISPATCH/phase0-roundtable.json");
    writeFileSync(
      statePath,
      JSON.stringify({
        venture: "a",
        status: "peers_running",
        ceoIntakeRunId: "run-ceo-1",
        peerRunIds: {
          cfo: "r1",
          cmo: "r2",
          coo: "r3",
          "head-of-research": "r4",
        },
        peerBriefs: {},
        startedAt: "2026-07-17T17:00:00.000Z",
        updatedAt: "2026-07-17T17:00:00.000Z",
      }),
      "utf8",
    );
    for (const seat of PHASE0_PEER_SEATS) {
      writeFileSync(join(root, BIZ, "HANDOFFS", `0-manager-${seat}.md`), `---\nstatus: ready\n---\n# ${seat}\n`);
    }

    let mergeGoal = "";
    const next = advancePhase0Roundtable(root, {
      spawnMerge: (_repo, goal) => {
        mergeGoal = goal;
        return { runId: "run-merge-1" };
      },
    });

    expect(next?.status).toBe("awaiting_ceo_merge");
    expect(next?.mergeRunId).toBe("run-merge-1");
    expect(mergeGoal).toMatch(/0-csuite-review/i);
    expect(mergeGoal).toMatch(/secondary_reviewers/i);
    expect(Object.keys(next!.peerBriefs)).toHaveLength(4);
  });

  it("advance: timeout with some briefs → partial merge", () => {
    root = seedRepo();
    writeFileSync(join(root, BIZ, "00-intake.md"), "# Intake\n");
    writeFileSync(
      join(root, BIZ, "DISPATCH/phase0-roundtable.json"),
      JSON.stringify({
        venture: "a",
        status: "peers_running",
        ceoIntakeRunId: "run-ceo-1",
        peerRunIds: { cfo: "r1" },
        peerBriefs: {},
        startedAt: "2026-07-17T17:00:00.000Z",
        updatedAt: "2026-07-17T17:00:00.000Z",
      }),
    );
    writeFileSync(
      join(root, BIZ, "HANDOFFS/0-manager-cfo.md"),
      "---\nstatus: ready\n---\n# cfo\n",
    );

    const next = advancePhase0Roundtable(root, {
      now: () => Date.parse("2026-07-17T17:30:00.000Z"), // 30m later
      peerTimeoutMs: 25 * 60 * 1000,
      spawnMerge: () => ({ runId: "run-merge-partial" }),
    });

    expect(next?.status).toBe("awaiting_ceo_merge");
    expect(next?.partial).toBe(true);
    expect(next?.mergeRunId).toBe("run-merge-partial");
  });

  it("advance: merge complete with verdict → done", () => {
    root = seedRepo();
    writeFileSync(
      join(root, BIZ, "DISPATCH/phase0-roundtable.json"),
      JSON.stringify({
        venture: "a",
        status: "awaiting_ceo_merge",
        ceoIntakeRunId: "run-ceo-1",
        peerRunIds: {},
        peerBriefs: {},
        mergeRunId: "run-merge-1",
        startedAt: "2026-07-17T17:00:00.000Z",
        updatedAt: "2026-07-17T17:20:00.000Z",
      }),
    );
    writeFileSync(
      join(root, BIZ, "HANDOFFS/0-csuite-review.md"),
      "---\nverdict: approve\nsecondary_reviewers: [cfo, cmo]\n---\n# Review\n",
    );
    writeFileSync(
      join(root, BIZ, "DISPATCH/runs/run-merge-1.json"),
      JSON.stringify({
        runId: "run-merge-1",
        status: "completed",
        position: "ceo-strategist",
        phase: "0",
        finished_at: "2026-07-17T17:25:00.000Z",
        started_at: "2026-07-17T17:20:00.000Z",
      }),
    );

    const next = advancePhase0Roundtable(root, {});
    expect(next?.status).toBe("done");
    expect(existsSync(join(root, BIZ, "DISPATCH/phase0-roundtable.json"))).toBe(true);
    expect(JSON.parse(readFileSync(join(root, BIZ, "DISPATCH/phase0-roundtable.json"), "utf8")).status).toBe(
      "done",
    );
  });

  it("advance: approve closeout marks Phase 0 inbox approved and tracker ✅", () => {
    root = seedRepo();
    mkdirSync(join(root, BIZ, "REVIEW/inbox"), { recursive: true });
    writeFileSync(
      join(root, BIZ, "RUNBOOK-TRACKER.md"),
      [
        "# Tracker",
        "",
        "**Idea:** Alpha",
        "**Current phase:** 0",
        "**Last updated:** 2026-07-17",
        "",
        "## Phase status",
        "",
        "| Phase | Name | Status | Artifact | Notes |",
        "|-------|------|--------|----------|-------|",
        "| 0 | Intake | 🔄 | 00-intake.md | awaiting CEO merge |",
        "| 1 | Frame | ⬜ | 01-problem-framing.md | |",
        "",
        "## Positions & handoffs",
        "",
        "| Phase | Manager | ICs spawned | Handoff dir | C-suite verdict | Reviewer | Manager llm_tier |",
        "|-------|---------|-------------|-------------|-----------------|----------|------------------|",
        "| 0 | ceo-strategist |  | `HANDOFFS/` |  | ceo-strategist | frontier-reasoning |",
        "",
      ].join("\n"),
    );
    writeFileSync(
      join(root, BIZ, "REVIEW/inbox/0-ceo-strategist-deliverable.md"),
      "---\nstatus: pending_review\nposition: ceo-strategist\nphase: \"0\"\n---\n# CEO\n",
    );
    writeFileSync(
      join(root, BIZ, "REVIEW/inbox/0-cfo-deliverable.md"),
      "---\nstatus: pending_review\nposition: cfo\nphase: \"0\"\n---\n# CFO\n",
    );
    writeFileSync(
      join(root, BIZ, "DISPATCH/phase0-roundtable.json"),
      JSON.stringify({
        venture: "a",
        status: "awaiting_ceo_merge",
        ceoIntakeRunId: "run-ceo-1",
        peerRunIds: {},
        peerBriefs: {},
        mergeRunId: "run-merge-1",
        startedAt: "2026-07-17T17:00:00.000Z",
        updatedAt: "2026-07-17T17:20:00.000Z",
      }),
    );
    writeFileSync(
      join(root, BIZ, "HANDOFFS/0-csuite-review.md"),
      "---\nverdict: approve\nrewake_seats: []\n---\n# Review\n",
    );
    writeFileSync(
      join(root, BIZ, "DISPATCH/runs/run-merge-1.json"),
      JSON.stringify({
        runId: "run-merge-1",
        status: "completed",
        position: "ceo-strategist",
        phase: "0",
        finished_at: "2026-07-17T17:25:00.000Z",
        started_at: "2026-07-17T17:20:00.000Z",
      }),
    );

    const next = advancePhase0Roundtable(root, {});
    expect(next?.status).toBe("done");
    expect(next?.closeoutApplied).toBe(true);

    const ceoInbox = readFileSync(
      join(root, BIZ, "REVIEW/inbox/0-ceo-strategist-deliverable.md"),
      "utf8",
    );
    expect(ceoInbox).toMatch(/^status:\s*approved/m);
    const cfoInbox = readFileSync(join(root, BIZ, "REVIEW/inbox/0-cfo-deliverable.md"), "utf8");
    expect(cfoInbox).toMatch(/^status:\s*approved/m);

    const tracker = readFileSync(join(root, BIZ, "RUNBOOK-TRACKER.md"), "utf8");
    expect(tracker).toMatch(/\*\*Current phase:\*\*\s*1/);
    expect(tracker).toMatch(/\| 0 \| Intake \| ✅ \|/);
    expect(tracker).toMatch(/\| 0 \| ceo-strategist \|.*\| approve \|/);
  });

  it("advance: already done without closeout recovers inbox + tracker", () => {
    root = seedRepo();
    mkdirSync(join(root, BIZ, "REVIEW/inbox"), { recursive: true });
    writeFileSync(
      join(root, BIZ, "RUNBOOK-TRACKER.md"),
      [
        "# Tracker",
        "**Current phase:** 0",
        "**Last updated:** 2026-07-17",
        "",
        "## Phase status",
        "",
        "| Phase | Name | Status | Artifact | Notes |",
        "|-------|------|--------|----------|-------|",
        "| 0 | Intake | 🔄 | 00-intake.md | stuck |",
        "| 1 | Frame | ⬜ | 01.md | |",
        "",
        "## Positions & handoffs",
        "",
        "| Phase | Manager | ICs spawned | Handoff dir | C-suite verdict | Reviewer | Manager llm_tier |",
        "|-------|---------|-------------|-------------|-----------------|----------|------------------|",
        "| 0 | ceo-strategist |  | `HANDOFFS/` |  | ceo-strategist | frontier-reasoning |",
        "",
      ].join("\n"),
    );
    writeFileSync(
      join(root, BIZ, "REVIEW/inbox/0-ceo.md"),
      "---\nstatus: pending_review\nphase: \"0\"\n---\n# x\n",
    );
    writeFileSync(
      join(root, BIZ, "HANDOFFS/0-csuite-review.md"),
      "---\nverdict: approve\n---\n# Review\n",
    );
    writeFileSync(
      join(root, BIZ, "DISPATCH/phase0-roundtable.json"),
      JSON.stringify({
        venture: "a",
        status: "done",
        pulse: "Phase 0 C-suite roundtable done — verdict approve.",
        ceoIntakeRunId: "run-ceo-1",
        peerRunIds: {},
        peerBriefs: {},
        mergeRunId: "run-merge-1",
        startedAt: "2026-07-17T17:00:00.000Z",
        updatedAt: "2026-07-17T17:25:00.000Z",
      }),
    );

    const next = advancePhase0Roundtable(root, {});
    expect(next?.closeoutApplied).toBe(true);
    expect(readFileSync(join(root, BIZ, "REVIEW/inbox/0-ceo.md"), "utf8")).toMatch(
      /^status:\s*approved/m,
    );
    expect(readFileSync(join(root, BIZ, "RUNBOOK-TRACKER.md"), "utf8")).toMatch(
      /\| 0 \| Intake \| ✅ \|/,
    );
  });

  it("advance: CEO rewake_seats respawns peers then re-merges until approve", () => {
    root = seedRepo();
    writeFileSync(join(root, BIZ, "00-intake.md"), "# Intake\n");
    writeFileSync(
      join(root, BIZ, "DISPATCH/phase0-roundtable.json"),
      JSON.stringify({
        venture: "a",
        status: "awaiting_ceo_merge",
        ceoIntakeRunId: "run-ceo-1",
        peerRunIds: { cfo: "run-cfo-1", cmo: "run-cmo-1" },
        peerBriefs: {
          cfo: `${BIZ}/HANDOFFS/0-manager-cfo.md`,
          cmo: `${BIZ}/HANDOFFS/0-manager-cmo.md`,
        },
        mergeRunId: "run-merge-1",
        startedAt: "2026-07-17T17:00:00.000Z",
        updatedAt: "2026-07-17T17:20:00.000Z",
      }),
    );
    writeFileSync(
      join(root, BIZ, "HANDOFFS/0-csuite-review.md"),
      "---\nverdict: approve\nrewake_seats: [cfo]\n---\n# Needs CFO redo\n",
    );
    writeFileSync(
      join(root, BIZ, "DISPATCH/runs/run-merge-1.json"),
      JSON.stringify({
        runId: "run-merge-1",
        status: "completed",
        position: "ceo-strategist",
        phase: "0",
        finished_at: "2026-07-17T17:25:00.000Z",
      }),
    );
    writeFileSync(join(root, BIZ, "HANDOFFS/0-manager-cfo.md"), "# old cfo\n");
    writeFileSync(join(root, BIZ, "HANDOFFS/0-manager-cmo.md"), "# cmo\n");

    const queued: string[] = [];
    const spawned: string[] = [];
    let mergeGoals: string[] = [];

    const afterRewake = advancePhase0Roundtable(root, {
      queuePeers: (_r, items) => {
        for (const i of items) queued.push(i.position);
        return {
          filenames: items.map((i) => `${i.position}.json`),
          items: items.map((i) => ({ position: i.position, filename: `${i.position}.json` })),
        };
      },
      spawnFilenames: (_r, filenames) => {
        const started = filenames.map((filename) => {
          const position = filename.replace(/\.json$/, "");
          spawned.push(position);
          return { position, runId: `rewake-${position}`, filename };
        });
        return { started };
      },
      spawnMerge: (_r, goal) => {
        mergeGoals.push(goal);
        return { runId: `run-merge-${mergeGoals.length + 1}` };
      },
    });

    expect(afterRewake?.status).toBe("rewaking_peers");
    expect(queued).toEqual(["cfo"]);
    expect(spawned).toEqual(["cfo"]);
    expect(afterRewake?.rewakeSeats).toEqual(["cfo"]);
    expect(afterRewake?.rewakeCount).toBe(1);
    expect(afterRewake?.peerRunIds.cfo).toBe("rewake-cfo");

    // Rewake run finishes — should re-merge
    writeFileSync(
      join(root, BIZ, "DISPATCH/runs/rewake-cfo.json"),
      JSON.stringify({
        runId: "rewake-cfo",
        status: "completed",
        position: "cfo",
        phase: "0",
        finished_at: "2026-07-17T17:30:00.000Z",
      }),
    );
    writeFileSync(join(root, BIZ, "HANDOFFS/0-manager-cfo.md"), "# revised cfo\n");

    const afterPeers = advancePhase0Roundtable(root, {
      spawnMerge: (_r, goal) => {
        mergeGoals.push(goal);
        return { runId: "run-merge-2" };
      },
    });
    expect(afterPeers?.status).toBe("awaiting_ceo_merge");
    expect(afterPeers?.mergeRunId).toBe("run-merge-2");
    expect(mergeGoals.length).toBeGreaterThanOrEqual(1);

    // Second merge approves cleanly
    writeFileSync(
      join(root, BIZ, "HANDOFFS/0-csuite-review.md"),
      "---\nverdict: approve\nrewake_seats: []\n---\n# Final\n",
    );
    writeFileSync(
      join(root, BIZ, "DISPATCH/runs/run-merge-2.json"),
      JSON.stringify({
        runId: "run-merge-2",
        status: "completed",
        position: "ceo-strategist",
        phase: "0",
        finished_at: "2026-07-17T17:35:00.000Z",
      }),
    );
    mkdirSync(join(root, BIZ, "REVIEW/inbox"), { recursive: true });
    writeFileSync(
      join(root, BIZ, "REVIEW/inbox/0-cfo.md"),
      "---\nstatus: pending_review\nphase: \"0\"\n---\n# x\n",
    );
    writeFileSync(
      join(root, BIZ, "RUNBOOK-TRACKER.md"),
      [
        "**Current phase:** 0",
        "",
        "## Phase status",
        "",
        "| Phase | Name | Status | Artifact | Notes |",
        "|-------|------|--------|----------|-------|",
        "| 0 | Intake | 🔄 | 00-intake.md | |",
        "| 1 | Frame | ⬜ | 01.md | |",
        "",
        "## Positions & handoffs",
        "",
        "| Phase | Manager | ICs spawned | Handoff dir | C-suite verdict | Reviewer | Manager llm_tier |",
        "|-------|---------|-------------|-------------|-----------------|----------|------------------|",
        "| 0 | ceo-strategist |  | `HANDOFFS/` |  | ceo-strategist | frontier-reasoning |",
        "",
      ].join("\n"),
    );

    const done = advancePhase0Roundtable(root, {});
    expect(done?.status).toBe("done");
    expect(done?.closeoutApplied).toBe(true);
  });
});
