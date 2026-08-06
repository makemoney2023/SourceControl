import { describe, expect, it } from "vitest";
import {
  listSyncRelPaths,
  repoRelToVaultPath,
  shouldSyncRepoRel,
} from "./vault-paths";

describe("repoRelToVaultPath", () => {
  it("maps handoffs under org/<venture>/HANDOFFS", () => {
    expect(
      repoRelToVaultPath(
        "docs/projects/blacksage-kennels/business-idea/HANDOFFS/1-manager-head-of-product.md",
      ),
    ).toBe("org/blacksage-kennels/HANDOFFS/1-manager-head-of-product.md");
  });

  it("maps MEMORY notes", () => {
    expect(
      repoRelToVaultPath("docs/projects/alpha/MEMORY/notes.md"),
    ).toBe("org/alpha/MEMORY/notes.md");
  });

  it("maps BRIEFINGS and REVIEW inbox", () => {
    expect(
      repoRelToVaultPath(
        "docs/projects/alpha/business-idea/BRIEFINGS/cfo-standup.md",
      ),
    ).toBe("org/alpha/BRIEFINGS/cfo-standup.md");
    expect(
      repoRelToVaultPath(
        "docs/projects/alpha/business-idea/REVIEW/inbox/1-head-of-product-deliverable.md",
      ),
    ).toBe("org/alpha/REVIEW/inbox/1-head-of-product-deliverable.md");
  });

  it("maps phase markdown under business-idea root to phases/", () => {
    expect(
      repoRelToVaultPath("docs/projects/alpha/business-idea/05-prd.md"),
    ).toBe("org/alpha/phases/05-prd.md");
  });

  it("returns null for non-sync paths", () => {
    expect(repoRelToVaultPath("tools/org-command-center/README.md")).toBeNull();
    expect(
      repoRelToVaultPath("docs/projects/alpha/business-idea/DISPATCH/alerts.json"),
    ).toBeNull();
  });
});

describe("shouldSyncRepoRel / listSyncRelPaths", () => {
  it("accepts role markdown families", () => {
    expect(
      shouldSyncRepoRel(
        "docs/projects/x/business-idea/HANDOFFS/2-manager-cfo.md",
      ),
    ).toBe(true);
    expect(shouldSyncRepoRel("docs/projects/x/MEMORY/sessions/2026-08-06.md")).toBe(
      true,
    );
  });

  it("lists syncable files under a venture tree", () => {
    const files = [
      "docs/projects/x/business-idea/HANDOFFS/1.md",
      "docs/projects/x/business-idea/DISPATCH/alerts.json",
      "docs/projects/x/MEMORY/notes.md",
      "docs/projects/x/business-idea/05-prd.md",
    ];
    expect(listSyncRelPaths(files)).toEqual([
      "docs/projects/x/business-idea/HANDOFFS/1.md",
      "docs/projects/x/MEMORY/notes.md",
      "docs/projects/x/business-idea/05-prd.md",
    ]);
  });
});
