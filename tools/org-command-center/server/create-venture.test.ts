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
import { Hono } from "hono";
import type { ProjectRegistry } from "./paths";
import { createVenture, slugifyVentureName } from "./create-venture";
import { registerProjectRoutes } from "./project-routes";

function seedRepo(): string {
  const root = mkdtempSync(join(tmpdir(), "occ-create-"));
  mkdirSync(join(root, "projects"), { recursive: true });
  mkdirSync(join(root, "templates/business-idea"), { recursive: true });
  writeFileSync(
    join(root, "templates/business-idea/RUNBOOK-TRACKER.md"),
    "# Business Idea Runbook Tracker\n\n**Idea:** _[one sentence]_\n**Started:** YYYY-MM-DD\n**Last updated:** YYYY-MM-DD\n**Current phase:** 0\n\n## Phase status\n\n| Phase | Name | Status | Artifact | Notes |\n|-------|------|--------|----------|-------|\n| 0 | Intake | ⬜ | 00-intake.md | |\n",
  );
  mkdirSync(join(root, "templates/business-idea/HANDOFFS"), { recursive: true });
  writeFileSync(join(root, "templates/business-idea/HANDOFFS/README.md"), "# Handoffs\n");
  const reg: ProjectRegistry = {
    active: "existing",
    projects: {
      existing: {
        name: "Existing",
        businessIdea: "docs/projects/existing/business-idea",
        memory: "docs/projects/existing/MEMORY",
      },
    },
  };
  writeFileSync(join(root, "projects/registry.json"), JSON.stringify(reg, null, 2));
  mkdirSync(join(root, "docs/projects/existing/business-idea"), { recursive: true });
  return root;
}

describe("slugifyVentureName", () => {
  it("slugifies display names", () => {
    expect(slugifyVentureName("Solar Lantern")).toBe("solar-lantern");
    expect(slugifyVentureName("  Acme Widgets!! ")).toBe("acme-widgets");
  });
});

describe("createVenture", () => {
  let root = "";
  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it("scaffolds tree, registers, and optionally activates", () => {
    root = seedRepo();
    const result = createVenture(root, {
      name: "Solar Lantern",
      activate: true,
    });
    expect(result.slug).toBe("solar-lantern");
    expect(result.active).toBe("solar-lantern");
    expect(existsSync(join(root, "docs/projects/solar-lantern/business-idea/RUNBOOK-TRACKER.md"))).toBe(
      true,
    );
    expect(existsSync(join(root, "docs/projects/solar-lantern/business-idea/DISPATCH/queue"))).toBe(
      true,
    );
    expect(existsSync(join(root, "docs/projects/solar-lantern/MEMORY/decisions.md"))).toBe(true);
    const tracker = readFileSync(
      join(root, "docs/projects/solar-lantern/business-idea/RUNBOOK-TRACKER.md"),
      "utf8",
    );
    expect(tracker).toMatch(/\*\*Idea:\*\* Solar Lantern/);
    const reg = JSON.parse(readFileSync(join(root, "projects/registry.json"), "utf8"));
    expect(reg.active).toBe("solar-lantern");
    expect(reg.projects["solar-lantern"].name).toBe("Solar Lantern");
  });

  it("rejects duplicate slug", () => {
    root = seedRepo();
    expect(() =>
      createVenture(root, { name: "Existing", slug: "existing" }),
    ).toThrow(/already/i);
  });

  it("createVenture seeds SOURCES and context note", () => {
    root = seedRepo();
    const result = createVenture(root, {
      name: "Solar Lantern",
      slug: "solar-lantern",
      contextNote: "Hardware first",
    });
    expect(existsSync(join(root, result.businessIdea, "SOURCES", "INDEX.md"))).toBe(true);
    const ctx = readFileSync(join(root, result.memory, "context.md"), "utf8");
    expect(ctx).toContain("Hardware first");
    expect(ctx).toContain("auto:sources-digest");
  });
});

describe("POST /api/project/create", () => {
  let root = "";
  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it("creates via API and lists the new project", async () => {
    root = seedRepo();
    const app = new Hono();
    registerProjectRoutes(app, root);

    const res = await app.request("/api/project/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "New Idea Co", activate: true }),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.slug).toBe("new-idea-co");
    expect(body.active).toBe("new-idea-co");

    const list = await (await app.request("/api/project")).json();
    expect(list.projects.some((p: { slug: string }) => p.slug === "new-idea-co")).toBe(true);
  });
});
