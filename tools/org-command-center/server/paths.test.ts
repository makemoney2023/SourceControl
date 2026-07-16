import { describe, expect, it } from "vitest";
import {
  activeProjectSlug,
  assertReadable,
  assertWritable,
  businessIdeaFile,
  businessIdeaRel,
  dispatchRoot,
  loadRegistry,
  resolveRepoRoot,
  trackerPath,
} from "./paths";

describe("FS allowlist + multi-venture paths", () => {
  const root = resolveRepoRoot();

  it("loads registry with passive-grid active", () => {
    const reg = loadRegistry(root);
    expect(reg.active).toBe("passive-grid");
    expect(activeProjectSlug(root)).toBe("passive-grid");
    expect(businessIdeaRel(root)).toBe("docs/projects/passive-grid/business-idea");
  });

  it("allows reading org skills and namespaced business-idea docs", () => {
    expect(() => assertReadable(root, "skills/org/ORG-REGISTRY.md")).not.toThrow();
    expect(() =>
      assertReadable(root, "docs/projects/passive-grid/business-idea/RUNBOOK-TRACKER.md"),
    ).not.toThrow();
    expect(() => assertReadable(root, "projects/registry.json")).not.toThrow();
  });

  it("rejects reading outside allowlist", () => {
    expect(() => assertReadable(root, ".env.local")).toThrow(/allowlist/i);
    expect(() => assertReadable(root, "package.json")).toThrow(/allowlist/i);
  });

  it("allows writing DISPATCH, BRIEFINGS, tracker, MEMORY, registry", () => {
    expect(() =>
      assertWritable(root, "docs/projects/passive-grid/business-idea/DISPATCH/queue/x.yaml"),
    ).not.toThrow();
    expect(() =>
      assertWritable(root, "docs/projects/passive-grid/business-idea/BRIEFINGS/cfo-standup.md"),
    ).not.toThrow();
    expect(() =>
      assertWritable(root, "docs/projects/passive-grid/business-idea/RUNBOOK-TRACKER.md"),
    ).not.toThrow();
    expect(() =>
      assertWritable(root, "docs/projects/passive-grid/MEMORY/decisions.md"),
    ).not.toThrow();
    expect(() => assertWritable(root, "projects/registry.json")).not.toThrow();
    expect(() => assertWritable(root, "skills/org/ORG-REGISTRY.md")).toThrow(/allowlist/i);
  });

  it("blocks path traversal", () => {
    expect(() =>
      assertReadable(root, "docs/projects/passive-grid/business-idea/../../.env.local"),
    ).toThrow();
  });

  it("resolves dispatch and tracker under active venture", () => {
    expect(dispatchRoot(root)).toContain("docs/projects/passive-grid/business-idea/DISPATCH");
    expect(trackerPath(root)).toContain(
      "docs/projects/passive-grid/business-idea/RUNBOOK-TRACKER.md",
    );
    expect(businessIdeaFile(root, "HANDOFFS/x.md")).toBe(
      "docs/projects/passive-grid/business-idea/HANDOFFS/x.md",
    );
  });
});
