import type { Hono } from "hono";
import { createCustomer } from "./create-customer";
import { createInitiative } from "./create-initiative";
import { createVenture, slugifyVentureName } from "./create-venture";
import {
  DEFAULT_INITIATIVE_SLUG,
  DEFAULT_ORG_SLUG,
  activeProjectSlug,
  businessIdeaRel,
  getCustomerMain,
  getInitiative,
  listCustomers,
  listInitiatives,
  listProjects,
  loadRegistry,
  memoryRel,
  saveRegistry,
} from "./paths";

export function registerProjectRoutes(app: Hono, repoRoot: string): void {
  app.get("/api/project", (c) => {
    const reg = loadRegistry(repoRoot);
    const orgSlug = reg.active.org;
    const org = reg.orgs[orgSlug];
    const customers = listCustomers(reg, orgSlug).map((cust) => ({
      ...cust,
      initiatives: listInitiatives(reg, cust.slug, orgSlug),
    }));
    const activeResolved = getInitiative(reg);
    return c.json({
      version: 2,
      active: reg.active,
      activeProject: reg.active.customer,
      activeInitiative: reg.active.initiative,
      org: { slug: orgSlug, name: org?.name ?? orgSlug },
      businessIdeaRel: activeResolved.entry.businessIdea,
      memoryRel: activeResolved.entry.memory,
      customers,
      // Compat flat list (customers)
      projects: listProjects(repoRoot).map((p) => {
        const main = getCustomerMain(reg, p.slug, orgSlug);
        return {
          ...p,
          businessIdea: main.entry.businessIdea,
          memory: main.entry.memory,
        };
      }),
    });
  });

  app.post("/api/project", async (c) => {
    const body = await c.req
      .json<{
        active?: string;
        org?: string;
        customer?: string;
        initiative?: string;
      }>()
      .catch(
        () =>
          ({} as {
            active?: string;
            org?: string;
            customer?: string;
            initiative?: string;
          }),
      );

    const reg = loadRegistry(repoRoot);

    // Legacy: { active: customerSlug } → that customer's main
    if (body.active?.trim() && !body.customer) {
      const slug = body.active.trim();
      try {
        getCustomerMain(reg, slug, reg.active.org || DEFAULT_ORG_SLUG);
      } catch {
        return c.json({ ok: false, error: `Unknown project: ${slug}` }, 404);
      }
      reg.active = {
        org: reg.active.org || DEFAULT_ORG_SLUG,
        customer: slug,
        initiative: DEFAULT_INITIATIVE_SLUG,
      };
      saveRegistry(repoRoot, reg);
      return c.json({
        ok: true,
        active: reg.active,
        activeProject: activeProjectSlug(repoRoot),
        businessIdeaRel: businessIdeaRel(repoRoot),
        memoryRel: memoryRel(repoRoot),
      });
    }

    const org = (body.org?.trim() || reg.active.org || DEFAULT_ORG_SLUG).toLowerCase();
    const customer = body.customer?.trim();
    const initiative = body.initiative?.trim() || DEFAULT_INITIATIVE_SLUG;
    if (!customer) {
      return c.json({ ok: false, error: "customer (or legacy active) required" }, 400);
    }
    try {
      getInitiative(reg, { org, customer, initiative });
    } catch (e) {
      return c.json(
        { ok: false, error: e instanceof Error ? e.message : String(e) },
        404,
      );
    }
    reg.active = { org, customer, initiative };
    saveRegistry(repoRoot, reg);
    return c.json({
      ok: true,
      active: reg.active,
      activeProject: activeProjectSlug(repoRoot),
      businessIdeaRel: businessIdeaRel(repoRoot),
      memoryRel: memoryRel(repoRoot),
    });
  });

  app.post("/api/customer/create", async (c) => {
    const body = await c.req
      .json<{
        name?: string;
        slug?: string;
        org?: string;
        activate?: boolean;
        contextNote?: string;
      }>()
      .catch(
        () =>
          ({} as {
            name?: string;
            slug?: string;
            org?: string;
            activate?: boolean;
            contextNote?: string;
          }),
      );
    if (!body.name?.trim()) {
      return c.json({ ok: false, error: "name is required" }, 400);
    }
    try {
      const result = createCustomer(repoRoot, {
        name: body.name,
        slug: body.slug,
        org: body.org,
        activate: body.activate !== false,
        contextNote: body.contextNote,
      });
      return c.json({ ok: true, ...result }, 201);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const status = /already/i.test(msg) ? 409 : 400;
      return c.json({ ok: false, error: msg }, status);
    }
  });

  app.post("/api/initiative/create", async (c) => {
    const body = await c.req
      .json<{
        name?: string;
        slug?: string;
        org?: string;
        customer?: string;
        activate?: boolean;
        contextNote?: string;
      }>()
      .catch(
        () =>
          ({} as {
            name?: string;
            slug?: string;
            org?: string;
            customer?: string;
            activate?: boolean;
            contextNote?: string;
          }),
      );
    if (!body.name?.trim()) {
      return c.json({ ok: false, error: "name is required" }, 400);
    }
    try {
      const result = createInitiative(repoRoot, {
        name: body.name,
        slug: body.slug,
        org: body.org,
        customer: body.customer,
        activate: body.activate !== false,
        contextNote: body.contextNote,
      });
      return c.json({ ok: true, ...result }, 201);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const status = /already/i.test(msg) ? 409 : 400;
      return c.json({ ok: false, error: msg }, status);
    }
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
