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
    expect(list.active).toEqual({
      org: "velocity-agency",
      customer: "a",
      initiative: "main",
    });
    expect(list.activeProject).toBe("a");
    expect(list.projects).toHaveLength(2);
    expect(list.customers).toHaveLength(2);

    const post = await app.request("/api/project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: "b" }),
    });
    expect(post.status).toBe(200);
    const switched = await post.json();
    expect(switched.ok).toBe(true);
    expect(switched.active.customer).toBe("b");
    expect(switched.activeProject).toBe("b");
    expect(switched.businessIdeaRel).toBe("docs/projects/b/business-idea");

    const disk = JSON.parse(readFileSync(join(root, "projects/registry.json"), "utf8"));
    expect(disk.active.customer).toBe("b");
    expect(disk.version).toBe(2);

    const bad = await app.request("/api/project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: "nope" }),
    });
    expect(bad.status).toBe(404);
  });

  it("lists only the active org and does not 500 on other orgs' customers", async () => {
    root = mkdtempSync(join(tmpdir(), "occ-proj-"));
    mkdirSync(join(root, "projects"), { recursive: true });
    writeFileSync(
      join(root, "projects/registry.json"),
      JSON.stringify({
        version: 2,
        active: { org: "superpatch", customer: "affiliates", initiative: "main" },
        orgs: {
          superpatch: {
            name: "Superpatch",
            customers: {
              affiliates: {
                name: "Affiliates",
                initiatives: {
                  main: {
                    name: "main",
                    businessIdea: "docs/orgs/superpatch/customers/affiliates/initiatives/main/business-idea",
                    memory: "docs/orgs/superpatch/customers/affiliates/initiatives/main/MEMORY",
                  },
                },
              },
            },
          },
          "velocity-agency": {
            name: "Velocity",
            customers: {
              "passive-grid": {
                name: "Passive Grid",
                initiatives: {
                  main: {
                    name: "main",
                    businessIdea: "docs/orgs/velocity-agency/customers/passive-grid/initiatives/main/business-idea",
                    memory: "docs/orgs/velocity-agency/customers/passive-grid/initiatives/main/MEMORY",
                  },
                },
              },
            },
          },
        },
      }),
    );
    const app = new Hono();
    registerProjectRoutes(app, root);
    const res = await app.request("/api/project");
    expect(res.status).toBe(200);
    const list = await res.json();
    expect(list.customers.map((c: { slug: string }) => c.slug).toSorted()).toEqual([
      "affiliates",
      "passive-grid",
    ]);
    const switched = await app.request("/api/project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: "passive-grid" }),
    });
    expect(switched.status).toBe(200);
    expect((await switched.json()).active).toEqual({
      org: "velocity-agency",
      customer: "passive-grid",
      initiative: "main",
    });
  });
});
