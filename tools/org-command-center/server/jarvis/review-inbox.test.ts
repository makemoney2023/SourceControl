import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { listReviewInbox, writeReviewInboxReceipt } from "./review-inbox";

const BIZ_IDEA = "docs/projects/passive-grid/business-idea";

function tempRepo() {
  const root = mkdtempSync(join(tmpdir(), "review-inbox-"));
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

describe("review inbox", () => {
  it("writes receipt and lists it", () => {
    const root = tempRepo();
    const { path } = writeReviewInboxReceipt(root, {
      position: "cmo",
      phase: "2",
      goal: "Write blog",
      runId: "run-1",
    });
    expect(path).toContain("REVIEW/inbox/");
    const raw = readFileSync(join(root, path), "utf8");
    expect(raw).toContain("pending_review");
    expect(raw).toContain("cmo");
    const items = listReviewInbox(root);
    expect(items.length).toBe(1);
    expect(items[0].position).toBe("cmo");
    expect(items[0].status).toBe("pending_review");
  });

  it("exposes artifact_path from inbox frontmatter", () => {
    const root = tempRepo();
    const dir = join(root, BIZ_IDEA, "REVIEW", "inbox");
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      join(dir, "5-hop.md"),
      `---
status: pending_review
position: head-of-product
phase: "5"
artifact_path: ${BIZ_IDEA}/05-prd.md
---
# Inbox
`,
      "utf8",
    );
    const items = listReviewInbox(root);
    expect(items[0].artifact_path).toBe(`${BIZ_IDEA}/05-prd.md`);
  });
});
