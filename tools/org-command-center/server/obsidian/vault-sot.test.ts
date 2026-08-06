import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readlinkSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type { ProjectRegistry } from "../paths";
import {
  ensureVentureVaultSourceOfTruth,
  inspectVentureVaultSourceOfTruth,
  vaultOrgRootRel,
} from "./vault-sot";

function seedDuplicateVenture(): string {
  const root = mkdtempSync(join(tmpdir(), "occ-vault-sot-"));
  mkdirSync(join(root, "projects"), { recursive: true });
  const idea = join(root, "docs/projects/alpha/business-idea");
  const mem = join(root, "docs/projects/alpha/MEMORY");
  mkdirSync(join(idea, "HANDOFFS"), { recursive: true });
  mkdirSync(join(idea, "BRIEFINGS"), { recursive: true });
  mkdirSync(join(idea, "REVIEW/inbox"), { recursive: true });
  mkdirSync(join(idea, "DISPATCH/queue"), { recursive: true });
  mkdirSync(join(mem, "sessions"), { recursive: true });
  writeFileSync(join(idea, "HANDOFFS/1-cfo.md"), "# from docs\n");
  writeFileSync(join(idea, "BRIEFINGS/standup.md"), "# brief\n");
  writeFileSync(join(idea, "REVIEW/inbox/d.md"), "# deliverable\n");
  writeFileSync(join(idea, "05-prd.md"), "# prd\n");
  writeFileSync(join(idea, "RUNBOOK-TRACKER.md"), "# tracker\n");
  writeFileSync(join(mem, "notes.md"), "# mem\n");
  // Stale vault copy (different content) — docs should win on migrate
  mkdirSync(join(root, "memorybank/org/alpha/HANDOFFS"), { recursive: true });
  writeFileSync(join(root, "memorybank/org/alpha/HANDOFFS/1-cfo.md"), "# stale vault\n");

  const reg: ProjectRegistry = {
    active: "alpha",
    projects: {
      alpha: {
        name: "Alpha",
        businessIdea: "docs/projects/alpha/business-idea",
        memory: "docs/projects/alpha/MEMORY",
      },
    },
  };
  writeFileSync(join(root, "projects/registry.json"), JSON.stringify(reg, null, 2));
  return root;
}

describe("vaultOrgRootRel", () => {
  it("returns memorybank org path", () => {
    expect(vaultOrgRootRel("alpha")).toBe("memorybank/org/alpha");
  });
});

describe("ensureVentureVaultSourceOfTruth", () => {
  let root = "";
  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it("moves note folders into the vault and leaves OCC paths as symlinks", () => {
    root = seedDuplicateVenture();
    const result = ensureVentureVaultSourceOfTruth(root, "alpha");
    expect(result.ok).toBe(true);
    expect(result.linked).toContain("HANDOFFS");
    expect(result.linked).toContain("MEMORY");

    const handoffsLink = join(root, "docs/projects/alpha/business-idea/HANDOFFS");
    expect(lstatSync(handoffsLink).isSymbolicLink()).toBe(true);
    expect(readlinkSync(handoffsLink).replace(/\\/g, "/")).toMatch(
      /memorybank\/org\/alpha\/HANDOFFS$/,
    );

    const vaultFile = join(root, "memorybank/org/alpha/HANDOFFS/1-cfo.md");
    expect(readFileSync(vaultFile, "utf8")).toContain("from docs");

    // OCC still reads through the symlink
    expect(readFileSync(join(handoffsLink, "1-cfo.md"), "utf8")).toContain("from docs");

    // Runtime dirs stay real
    expect(lstatSync(join(root, "docs/projects/alpha/business-idea/DISPATCH")).isSymbolicLink()).toBe(
      false,
    );
    expect(existsSync(join(root, "docs/projects/alpha/business-idea/RUNBOOK-TRACKER.md"))).toBe(
      true,
    );
  });

  it("is idempotent when already linked", () => {
    root = seedDuplicateVenture();
    const first = ensureVentureVaultSourceOfTruth(root, "alpha");
    const second = ensureVentureVaultSourceOfTruth(root, "alpha");
    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    expect(second.alreadyLinked).toBeGreaterThan(0);
  });

  it("inspect reports pending before ensure and ready after", () => {
    root = seedDuplicateVenture();
    const before = inspectVentureVaultSourceOfTruth(root, "alpha");
    expect(before.ready).toBe(false);
    expect(before.pending).toContain("HANDOFFS");
    ensureVentureVaultSourceOfTruth(root, "alpha");
    const after = inspectVentureVaultSourceOfTruth(root, "alpha");
    expect(after.ready).toBe(true);
    expect(after.pending).toEqual([]);
  });
});
