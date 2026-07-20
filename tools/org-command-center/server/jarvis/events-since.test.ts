import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type { ProjectRegistry } from "../paths";
import { appendRunEvent, eventCursor } from "./run-events";
import { buildEventsSincePayload } from "./events-since";
import { dispatchRoot } from "../paths";

function seedRepo(): string {
  const root = mkdtempSync(join(tmpdir(), "occ-events-since-"));
  mkdirSync(join(root, "projects"), { recursive: true });
  mkdirSync(join(root, "docs/projects/a/business-idea/DISPATCH/runs"), { recursive: true });
  const reg: ProjectRegistry = {
    active: "a",
    projects: {
      a: {
        name: "Alpha",
        businessIdea: "docs/projects/a/business-idea",
        memory: "docs/projects/a/MEMORY",
      },
    },
  };
  writeFileSync(join(root, "projects/registry.json"), JSON.stringify(reg, null, 2));
  return root;
}

describe("buildEventsSincePayload", () => {
  let root = "";
  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it("returns empty events and active false", () => {
    root = seedRepo();
    const body = buildEventsSincePayload(root);
    expect(body.events).toEqual([]);
    expect(body.nextCursor).toBeNull();
    expect(body.active).toBe(false);
  });

  it("advances cursor and reports active when a run is running", () => {
    root = seedRepo();
    const droot = dispatchRoot(root);
    appendRunEvent(droot, {
      at: "2026-07-17T12:00:01.000Z",
      type: "started",
      runId: "r1",
      position: "cmo",
    });
    appendRunEvent(droot, {
      at: "2026-07-17T12:00:02.000Z",
      type: "finished",
      runId: "r1",
      position: "cmo",
    });
    writeFileSync(
      join(droot, "runs", "r1.json"),
      JSON.stringify({
        runId: "r1",
        status: "running",
        position: "cmo",
        phase: "1",
        claimed: "x",
        dispatch_filename: "1-cmo.md",
        wake_reason: "chat",
        started_at: "2026-07-17T12:00:01.000Z",
        llm_model: "test",
      }),
    );

    const first = buildEventsSincePayload(root);
    expect(first.events).toHaveLength(2);
    expect(first.active).toBe(true);
    const second = buildEventsSincePayload(root, eventCursor(first.events[0]!));
    expect(second.events).toHaveLength(1);
    expect(second.events[0]?.type).toBe("finished");
  });
});
