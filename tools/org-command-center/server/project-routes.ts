import type { Hono } from "hono";
import { createVenture, slugifyVentureName } from "./create-venture";
import {
  activeProjectSlug,
  businessIdeaRel,
  listProjects,
  loadRegistry,
  saveRegistry,
} from "./paths";

export function registerProjectRoutes(app: Hono, repoRoot: string): void {
  app.get("/api/project", (c) => {
    const reg = loadRegistry(repoRoot);
    return c.json({
      active: reg.active,
      businessIdeaRel: businessIdeaRel(repoRoot),
      memoryRel: reg.projects[reg.active]?.memory ?? null,
      projects: listProjects(repoRoot).map((p) => ({
        ...p,
        businessIdea: reg.projects[p.slug].businessIdea,
        memory: reg.projects[p.slug].memory,
      })),
    });
  });

  app.post("/api/project", async (c) => {
    const body = await c.req.json<{ active?: string }>().catch(() => ({} as { active?: string }));
    if (!body.active?.trim()) {
      return c.json({ ok: false, error: "active required" }, 400);
    }
    const slug = body.active.trim();
    const reg = loadRegistry(repoRoot);
    if (!reg.projects[slug]) {
      return c.json({ ok: false, error: `Unknown project: ${slug}` }, 404);
    }
    reg.active = slug;
    saveRegistry(repoRoot, reg);
    return c.json({
      ok: true,
      active: activeProjectSlug(repoRoot),
      businessIdeaRel: businessIdeaRel(repoRoot),
      memoryRel: reg.projects[slug].memory,
    });
  });

  app.post("/api/project/create", async (c) => {
    const body = await c.req
      .json<{ name?: string; slug?: string; activate?: boolean; contextNote?: string }>()
      .catch(() => ({} as { name?: string; slug?: string; activate?: boolean; contextNote?: string }));
    if (!body.name?.trim()) {
      return c.json({ ok: false, error: "name is required" }, 400);
    }
    try {
      const result = createVenture(repoRoot, {
        name: body.name,
        slug: body.slug,
        activate: body.activate !== false,
        contextNote: body.contextNote,
      });
      return c.json(
        {
          ok: true,
          ...result,
          businessIdeaRel: result.businessIdea,
          memoryRel: result.memory,
        },
        201,
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const status = /already/i.test(msg) ? 409 : 400;
      return c.json({ ok: false, error: msg }, status);
    }
  });

  app.get("/api/project/slugify", (c) => {
    const name = c.req.query("name") ?? "";
    try {
      return c.json({ ok: true, slug: slugifyVentureName(name) });
    } catch (e) {
      return c.json(
        { ok: false, error: e instanceof Error ? e.message : String(e) },
        400,
      );
    }
  });
}
