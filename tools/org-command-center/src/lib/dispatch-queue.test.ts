import { mkdtempSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  claimDispatch,
  claimOldestDispatch,
  enqueueDispatch,
  listQueuedDispatches,
} from "./dispatch-queue";
import type { ManagerPacket } from "./types";

function tempDispatchRoot() {
  const root = mkdtempSync(join(tmpdir(), "org-cc-"));
  mkdirSync(join(root, "queue"), { recursive: true });
  mkdirSync(join(root, "claimed"), { recursive: true });
  return root;
}

const packet: ManagerPacket = {
  schema_version: 1,
  queued_at: "2026-07-16T14:00:00.000Z",
  phase: "2",
  position: "head-of-research",
  goal: "Market research",
  report_to: "ceo-strategist",
  parent_position: "orchestrator",
  llm_tier: "strong-general",
  llm_model: "composer-2.5",
  generation_profile: "none",
  inputs: [],
  must_read: ["skills/org/MODEL-REGISTRY.md"],
  outputs: [],
  write_lease: [],
  budget_usd: null,
  collaborators: [],
  delegate_budget: 3,
  constraints: [],
  company_goal: "Test",
  parent_goal: "Phase 2",
  goal_path: ["Test", "Phase 2", "Market research"],
};

describe("dispatch queue", () => {
  it("enqueues a yaml packet", () => {
    const root = tempDispatchRoot();
    const path = enqueueDispatch(root, packet, "20260716T140000Z");
    expect(path).toContain("queue/2-head-of-research-20260716T140000Z.yaml");
    const body = readFileSync(path, "utf8");
    expect(body).toContain("position: head-of-research");
    expect(listQueuedDispatches(root)).toHaveLength(1);
  });

  it("claims oldest packet", () => {
    const root = tempDispatchRoot();
    writeFileSync(join(root, "queue", "2-a-20260716T120000Z.yaml"), "phase: \"2\"\n");
    writeFileSync(join(root, "queue", "2-b-20260716T130000Z.yaml"), "phase: \"2\"\n");
    const claimed = claimOldestDispatch(root);
    expect(claimed?.filename).toBe("2-a-20260716T120000Z.yaml");
    expect(readdirSync(join(root, "queue"))).toEqual(["2-b-20260716T130000Z.yaml"]);
    expect(readdirSync(join(root, "claimed"))).toContain("2-a-20260716T120000Z.yaml");
  });

  it("claims a specific middle file by filename", () => {
    const root = tempDispatchRoot();
    writeFileSync(join(root, "queue", "2-a-20260716T120000Z.yaml"), "a: 1\n");
    writeFileSync(join(root, "queue", "2-b-20260716T130000Z.yaml"), "b: 1\n");
    writeFileSync(join(root, "queue", "2-c-20260716T140000Z.yaml"), "c: 1\n");
    const claimed = claimDispatch(root, { filename: "2-b-20260716T130000Z.yaml" });
    expect(claimed.ok).toBe(true);
    if (!claimed.ok) return;
    expect(claimed.filename).toBe("2-b-20260716T130000Z.yaml");
    expect(readdirSync(join(root, "queue")).sort()).toEqual([
      "2-a-20260716T120000Z.yaml",
      "2-c-20260716T140000Z.yaml",
    ]);
  });

  it("errors when filename missing from queue", () => {
    const root = tempDispatchRoot();
    writeFileSync(join(root, "queue", "2-a-20260716T120000Z.yaml"), "a: 1\n");
    const claimed = claimDispatch(root, { filename: "nope.yaml" });
    expect(claimed).toEqual({ ok: false, error: "dispatch file not in queue: nope.yaml" });
    expect(readdirSync(join(root, "queue"))).toEqual(["2-a-20260716T120000Z.yaml"]);
  });

  it("claimDispatch without filename claims oldest", () => {
    const root = tempDispatchRoot();
    writeFileSync(join(root, "queue", "2-a-20260716T120000Z.yaml"), "a: 1\n");
    writeFileSync(join(root, "queue", "2-b-20260716T130000Z.yaml"), "b: 1\n");
    const claimed = claimDispatch(root, {});
    expect(claimed.ok).toBe(true);
    if (!claimed.ok) return;
    expect(claimed.filename).toBe("2-a-20260716T120000Z.yaml");
  });
});
