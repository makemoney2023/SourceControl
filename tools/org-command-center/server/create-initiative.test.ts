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
import { createInitiative } from "./create-initiative";
import { registerProjectRoutes } from "./project-routes";

function seedRepo(): string {
  const root = mkdtempSync(join(tmpdir(), "occ-init-"));
  mkdirSync(join(root, "projects"), { recursive: true });
  mkdirSync(join(root, "templates/business-idea"), { recursive: true });
  writeFileSync(
    join(root, "templates/business-idea/RUNBOOK-TRACKER.md"),
    "# Business Idea Runbook Tracker\n\n**Idea:** _[one sentence]_\n**Started:** YYYY-MM-DD\n**Last updated:** YYYY-MM-DD\n**Current phase:** 0\n",
  );
  const reg: ProjectRegistry = {
    active: "blacksage-kennels",
    projects: {
      "blacksage-kennels": {
        name: "Blacksage Kennels",
        businessIdea: "docs/projects/blacksage-kennels/business-idea",
        memory: "docs/projects/blacksage-kennels/MEMORY",
      },
    },
  };
  writeFileSync(join(root, "projects/registry.json"), JSON.stringify(reg, null, 2));
  mkdirSync(join(root, "docs/projects/blacksage-kennels/business-idea"), { recursive: true });
  mkdirSync(join(root, "docs/projects/blacksage-kennels/MEMORY"), { recursive: true });
  return root;
}

describe("createInitiative", () => {
  let root = "";
  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it("scaffolds nested initiative under customer", () => {
    root = seedRepo();
    const result = createInitiative(root, {
      name: "Web Design",
      customer: "blacksage-kennels",
      activate: true,
      contextNote: "New site",
    });
    expect(result.slug).toBe("web-design");
    expect(result.customer).toBe("blacksage-kennels");
    expect(result.businessIdea).toBe(
      "docs/orgs/velocity-agency/customers/blacksage-kennels/initiatives/web-design/business-idea",
    );
    expect(existsSync(join(root, result.businessIdea, "DISPATCH/queue"))).toBe(true);
    expect(existsSync(join(root, result.businessIdea, "SOURCES/INDEX.md"))).toBe(true);
    const ctx = readFileSync(join(root, result.memory, "context.md"), "utf8");
    expect(ctx).toContain("New site");
    const reg = JSON.parse(readFileSync(join(root, "projects/registry.json"), "utf8"));
    expect(reg.active.initiative).toBe("web-design");
    expect(
      reg.orgs["velocity-agency"].customers["blacksage-kennels"].initiatives["web-design"].name,
    ).toBe("Web Design");
  });

  it("POST /api/initiative/create works", async () => {
    root = seedRepo();
    const app = new Hono();
    registerProjectRoutes(app, root);
    const res = await app.request("/api/initiative/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "SEO Sprint",
        customer: "blacksage-kennels",
        activate: true,
      }),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.slug).toBe("seo-sprint");
  });
});
