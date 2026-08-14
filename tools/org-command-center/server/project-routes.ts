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
  loadRegistry,
  memoryRel,
  saveRegistry,
} from "./paths";

export function registerProjectRoutes(app: Hono, repoRoot: string): void {
  app.get("/api/project", (c) => {
    const reg = loadRegistry(repoRoot);
    const orgSlug = reg.active.org;
    const org = reg.orgs[orgSlug];
    const customers = Object.entries(reg.orgs).flatMap(([custOrg, orgEntry]) =>
      listCustomers(reg, custOrg).map((cust) => ({
        ...cust,
        org: custOrg,
        orgName: orgEntry.name,
        initiatives: listInitiatives(reg, cust.slug, custOrg),
      })),
    );
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
      // Compat flat list across orgs (Glance / Workspace switchers).
      projects: customers.map((p) => {
        try {
          const main = getCustomerMain(reg, p.slug, p.org);
          return {
            slug: p.slug,
            name: p.name,
            businessIdea: main.entry.businessIdea,
            memory: main.entry.memory,
          };
        } catch {
          return { slug: p.slug, name: p.name };
        }
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
      const ownerOrg =
        Object.entries(reg.orgs).find(([, entry]) => entry.customers[slug])?.[0] ??
        null;
      if (!ownerOrg) {
        return c.json({ ok: false, error: `Unknown project: ${slug}` }, 404);
      }
      try {
        getCustomerMain(reg, slug, ownerOrg);
      } catch {
        return c.json({ ok: false, error: `Unknown project: ${slug}` }, 404);
      }
      const firstInitiative =
        Object.keys(reg.orgs[ownerOrg]!.customers[slug]!.initiatives)[0] ??
        DEFAULT_INITIATIVE_SLUG;
      reg.active = {
        org: ownerOrg,
        customer: slug,
        initiative: firstInitiative,
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
