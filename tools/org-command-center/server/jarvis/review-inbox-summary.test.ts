import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type { ProjectRegistry } from "../paths";
import { findInboxDeliverableByRunId } from "./review-inbox";
import {
  extractOperatorSummary,
  formatOperatorSummarySpoken,
} from "./operator-summary";

function seedRepo(): string {
  const root = mkdtempSync(join(tmpdir(), "occ-inbox-summary-"));
  mkdirSync(join(root, "projects"), { recursive: true });
  mkdirSync(join(root, "docs/projects/a/business-idea/REVIEW/inbox"), {
    recursive: true,
  });
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

describe("findInboxDeliverableByRunId + operator summary", () => {
  let root = "";
  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it("loads plain English next steps from matching deliverable", () => {
    root = seedRepo();
    writeFileSync(
      join(root, "docs/projects/a/business-idea/REVIEW/inbox/0-cfo-deliverable.md"),
      [
        "---",
        "status: pending_review",
        "position: cfo",
        "runId: run-abc",
        "---",
        "",
        "# Deliverable",
        "",
        "## In plain English",
        "Cash needs look manageable for a single-event pilot.",
        "",
        "## Next steps",
        "1. Operator confirms booth fee budget.",
        "",
      ].join("\n"),
    );
    const hit = findInboxDeliverableByRunId(root, "run-abc");
    expect(hit).toBeTruthy();
    const spoken = formatOperatorSummarySpoken(extractOperatorSummary(hit!.markdown));
    expect(spoken).toMatch(/Cash needs look manageable/i);
    expect(spoken).toMatch(/Next:.*booth fee/i);
  });
});
