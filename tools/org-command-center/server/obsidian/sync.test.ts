import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ProjectRegistry } from "../paths";
import { syncRepoFileToObsidian, syncVentureMarkdownToObsidian } from "./sync";

function seedVenture(): string {
  const root = mkdtempSync(join(tmpdir(), "occ-obsidian-sync-"));
  mkdirSync(join(root, "projects"), { recursive: true });
  const idea = join(root, "docs/projects/alpha/business-idea");
  mkdirSync(join(idea, "HANDOFFS"), { recursive: true });
  mkdirSync(join(root, "docs/projects/alpha/MEMORY"), { recursive: true });
  writeFileSync(join(idea, "HANDOFFS/1-manager-cfo.md"), "# CFO\n\nBurn notes.\n");
  writeFileSync(join(root, "docs/projects/alpha/MEMORY/notes.md"), "# Notes\n");
  writeFileSync(join(idea, "05-prd.md"), "# PRD\n");
  mkdirSync(join(idea, "DISPATCH"), { recursive: true });
  writeFileSync(join(idea, "DISPATCH/alerts.json"), "{}");
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

describe("syncRepoFileToObsidian", () => {
  let root = "";
  afterEach(() => {
    vi.restoreAllMocks();
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it("writes mapped markdown via createVaultFile", async () => {
    root = seedVenture();
    const create = vi.fn(async () => ({ ok: true, text: "OK" }));
    const result = await syncRepoFileToObsidian(
      root,
      "docs/projects/alpha/business-idea/HANDOFFS/1-manager-cfo.md",
      { createVaultFile: create },
    );
    expect(result.ok).toBe(true);
    expect(result.vaultPath).toBe("org/alpha/HANDOFFS/1-manager-cfo.md");
    expect(create).toHaveBeenCalledWith(
      "org/alpha/HANDOFFS/1-manager-cfo.md",
      expect.stringContaining("# CFO"),
    );
    expect(create.mock.calls[0][1]).toContain("occ_source:");
  });

  it("skips non-sync paths", async () => {
    root = seedVenture();
    const create = vi.fn(async () => ({ ok: true, text: "OK" }));
    const result = await syncRepoFileToObsidian(
      root,
      "docs/projects/alpha/business-idea/DISPATCH/alerts.json",
      { createVaultFile: create },
    );
    expect(result.ok).toBe(true);
    expect(result.skipped).toBe(true);
    expect(create).not.toHaveBeenCalled();
  });
});

describe("syncVentureMarkdownToObsidian", () => {
  let root = "";
  afterEach(() => {
    vi.restoreAllMocks();
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it("syncs handoffs, memory, and phase files for active venture", async () => {
    root = seedVenture();
    const create = vi.fn(async () => ({ ok: true, text: "OK" }));
    const result = await syncVentureMarkdownToObsidian(root, undefined, {
      createVaultFile: create,
    });
    expect(result.ok).toBe(true);
    expect(result.synced).toBe(3);
    expect(result.failed).toBe(0);
    const paths = create.mock.calls.map((c) => c[0]).sort();
    expect(paths).toEqual([
      "org/alpha/HANDOFFS/1-manager-cfo.md",
      "org/alpha/MEMORY/notes.md",
      "org/alpha/phases/05-prd.md",
    ]);
  });
});
