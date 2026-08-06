import { describe, expect, it } from "vitest";
import {
  activeProjectSlug,
  assertJarvisReadable,
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

  it("loads registry with a registered active customer/initiative", () => {
    const reg = loadRegistry(root);
    expect(reg.version).toBe(2);
    expect(reg.orgs[reg.active.org]?.customers[reg.active.customer]?.initiatives[reg.active.initiative]).toBeTruthy();
    expect(activeProjectSlug(root)).toBe(reg.active.customer);
    expect(businessIdeaRel(root)).toBe(
      reg.orgs[reg.active.org]!.customers[reg.active.customer]!.initiatives[reg.active.initiative]!
        .businessIdea,
    );
  });

  it("allows reading org skills, vault SoT, and namespaced business-idea docs", () => {
    expect(() => assertReadable(root, "skills/org/ORG-REGISTRY.md")).not.toThrow();
    expect(() => assertReadable(root, "apps/demo/page.tsx")).not.toThrow();
    expect(() => assertReadable(root, "design-system/demo/tokens.css")).not.toThrow();
    expect(() =>
      assertReadable(root, "docs/projects/passive-grid/business-idea/RUNBOOK-TRACKER.md"),
    ).not.toThrow();
    expect(() =>
      assertReadable(root, "memorybank/org/blacksage-kennels/HANDOFFS"),
    ).not.toThrow();
    expect(() => assertReadable(root, "projects/registry.json")).not.toThrow();
  });

  it("rejects reading outside allowlist", () => {
    expect(() => assertReadable(root, ".env.local")).toThrow(/allowlist/i);
    expect(() => assertReadable(root, "package.json")).toThrow(/allowlist/i);
  });

  it("allows writing DISPATCH, BRIEFINGS, tracker, MEMORY, REVIEW/inbox, registry", () => {
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
    expect(() =>
      assertWritable(
        root,
        "docs/projects/passive-grid/business-idea/REVIEW/inbox/2-cmo-queued.md",
      ),
    ).not.toThrow();
    expect(() => assertWritable(root, "projects/registry.json")).not.toThrow();
    expect(() =>
      assertWritable(root, "memorybank/org/blacksage-kennels/HANDOFFS/1-cfo.md"),
    ).not.toThrow();
    expect(() => assertWritable(root, "skills/org/ORG-REGISTRY.md")).toThrow(/allowlist/i);
  });

  it("allows writing business-idea/SOURCES files", () => {
    expect(() =>
      assertWritable(root, "docs/projects/passive-grid/business-idea/SOURCES/INDEX.md"),
    ).not.toThrow();
    expect(() =>
      assertWritable(
        root,
        "docs/projects/passive-grid/business-idea/SOURCES/20260101T000000-foo.pdf",
      ),
    ).not.toThrow();
  });

  it("rejects SOURCES path traversal", () => {
    expect(() =>
      assertWritable(
        root,
        "docs/projects/passive-grid/business-idea/SOURCES/../../MEMORY/x.md",
      ),
    ).toThrow(/escape|allowlist/i);
  });

  it("blocks path traversal", () => {
    expect(() =>
      assertReadable(root, "docs/projects/passive-grid/business-idea/../../.env.local"),
    ).toThrow();
  });

  it("resolves dispatch and tracker under active venture", () => {
    const activeBiz = businessIdeaRel(root);
    expect(dispatchRoot(root)).toContain(`${activeBiz}/DISPATCH`);
    expect(trackerPath(root)).toContain(`${activeBiz}/RUNBOOK-TRACKER.md`);
    expect(businessIdeaFile(root, "HANDOFFS/x.md")).toBe(`${activeBiz}/HANDOFFS/x.md`);
  });
});

describe("assertJarvisReadable (file.read allowlist)", () => {
  const root = resolveRepoRoot();
  const activeBiz = businessIdeaRel(root);

  it("allows business-idea files for the active venture", () => {
    expect(() =>
      assertJarvisReadable(root, `${activeBiz}/RUNBOOK-TRACKER.md`),
    ).not.toThrow();
  });

  it("allows HANDOFFS under active venture business-idea", () => {
    expect(() => assertJarvisReadable(root, `${activeBiz}/HANDOFFS/README.md`)).not.toThrow();
  });

  it("rejects skills/org paths", () => {
    expect(() => assertJarvisReadable(root, "skills/org/ORG-REGISTRY.md")).toThrow(/allowlist/i);
  });

  it("rejects other project business-idea paths", () => {
    expect(() =>
      assertJarvisReadable(root, "docs/projects/demo-venture/business-idea/RUNBOOK-TRACKER.md"),
    ).toThrow(/allowlist/i);
  });

  it("rejects MEMORY outside business-idea", () => {
    expect(() =>
      assertJarvisReadable(root, "docs/projects/passive-grid/MEMORY/decisions.md"),
    ).toThrow(/allowlist/i);
  });

  it("rejects path traversal via ..", () => {
    expect(() =>
      assertJarvisReadable(root, `${activeBiz}/../../.env.local`),
    ).toThrow();
  });

  it("rejects absolute paths outside repo", () => {
    expect(() => assertJarvisReadable(root, "/etc/passwd")).toThrow();
  });
});
