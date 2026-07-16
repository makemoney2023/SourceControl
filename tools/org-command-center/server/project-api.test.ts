import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { Hono } from "hono";
import type { ProjectRegistry } from "./paths";
import { registerProjectRoutes } from "./project-routes";

function seedRepo(): string {
  const root = mkdtempSync(join(tmpdir(), "occ-proj-"));
  mkdirSync(join(root, "projects"), { recursive: true });
  mkdirSync(join(root, "docs/projects/a/business-idea/DISPATCH/queue"), { recursive: true });
  mkdirSync(join(root, "docs/projects/b/business-idea/DISPATCH/queue"), { recursive: true });
  mkdirSync(join(root, "docs/projects/a/MEMORY"), { recursive: true });
  mkdirSync(join(root, "docs/projects/b/MEMORY"), { recursive: true });
  const reg: ProjectRegistry = {
    active: "a",
    projects: {
      a: {
        name: "Alpha",
        businessIdea: "docs/projects/a/business-idea",
        memory: "docs/projects/a/MEMORY",
      },
      b: {
        name: "Beta",
        businessIdea: "docs/projects/b/business-idea",
        memory: "docs/projects/b/MEMORY",
      },
    },
  };
  writeFileSync(join(root, "projects/registry.json"), JSON.stringify(reg, null, 2));
  return root;
}

describe("GET/POST /api/project", () => {
  let root = "";
  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it("lists projects and switches active", async () => {
    root = seedRepo();
    const app = new Hono();
    registerProjectRoutes(app, root);

    const get1 = await app.request("/api/project");
    expect(get1.status).toBe(200);
    const list = await get1.json();
    expect(list.active).toBe("a");
    expect(list.projects).toHaveLength(2);

    const post = await app.request("/api/project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: "b" }),
    });
    expect(post.status).toBe(200);
    const switched = await post.json();
    expect(switched.ok).toBe(true);
    expect(switched.active).toBe("b");
    expect(switched.businessIdeaRel).toBe("docs/projects/b/business-idea");

    const disk = JSON.parse(readFileSync(join(root, "projects/registry.json"), "utf8"));
    expect(disk.active).toBe("b");

    const bad = await app.request("/api/project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: "nope" }),
    });
    expect(bad.status).toBe(404);
  });
});
