import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { Hono } from "hono";
import type { ProjectRegistry } from "./paths";
import { registerSourcesRoutes } from "./sources-routes";

function seedActiveVenture(): string {
  const root = mkdtempSync(join(tmpdir(), "occ-sources-api-"));
  mkdirSync(join(root, "projects"), { recursive: true });
  mkdirSync(join(root, "docs/projects/a/business-idea/DISPATCH/queue"), { recursive: true });
  mkdirSync(join(root, "docs/projects/a/MEMORY"), { recursive: true });
  const reg: ProjectRegistry = {
    active: "a",
    projects: {
      a: {
        name: "Alpha",
        businessIdea: "docs/projects/a/business-idea",
        memory: "docs/projects/a/MEMORY",
      },
    },
  };
  writeFileSync(join(root, "projects/registry.json"), JSON.stringify(reg, null, 2));
  return root;
}

describe("sources API routes", () => {
  let root = "";
  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it("GET returns empty sources and note", async () => {
    root = seedActiveVenture();
    const app = new Hono();
    registerSourcesRoutes(app, root);
    const res = await app.request("/api/sources");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.sources).toEqual([]);
    expect(typeof body.contextNote).toBe("string");
  });

  it("POST upload accepts multipart md", async () => {
    root = seedActiveVenture();
    const app = new Hono();
    registerSourcesRoutes(app, root);
    const form = new FormData();
    form.append("file", new Blob(["# Hi"], { type: "text/markdown" }), "hi.md");
    const res = await app.request("/api/sources/upload", { method: "POST", body: form });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.sources.length).toBe(1);
  });

  it("PUT updates context note", async () => {
    root = seedActiveVenture();
    const app = new Hono();
    registerSourcesRoutes(app, root);
    const res = await app.request("/api/sources/context", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: "We sell water harvesters" }),
    });
    expect(res.status).toBe(200);
    const get = await (await app.request("/api/sources")).json();
    expect(get.contextNote).toContain("water harvesters");
  });

  it("DELETE returns not_found for missing id", async () => {
    root = seedActiveVenture();
    const app = new Hono();
    registerSourcesRoutes(app, root);
    const res = await app.request("/api/sources/missing-id", { method: "DELETE" });
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.code).toBe("not_found");
  });

  it("POST upload rejects unsupported type", async () => {
    root = seedActiveVenture();
    const app = new Hono();
    registerSourcesRoutes(app, root);
    const form = new FormData();
    form.append("file", new Blob(["x"], { type: "application/octet-stream" }), "bad.exe");
    const res = await app.request("/api/sources/upload", { method: "POST", body: form });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.code).toBe("unsupported_type");
  });
});
