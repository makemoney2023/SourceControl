import { describe, expect, it } from "vitest";
import {
  DEFAULT_INITIATIVE_SLUG,
  DEFAULT_ORG_SLUG,
  flatProjectsView,
  getInitiative,
  migrateFlatToPortfolio,
  normalizeRegistry,
  type ProjectRegistry,
} from "./portfolio-registry";

describe("migrateFlatToPortfolio", () => {
  it("wraps flat ventures under velocity-agency with main initiatives", () => {
    const flat: ProjectRegistry = {
      active: "blacksage-kennels",
      projects: {
        "blacksage-kennels": {
          name: "Blacksage Kennels",
          businessIdea: "docs/projects/blacksage-kennels/business-idea",
          memory: "docs/projects/blacksage-kennels/MEMORY",
        },
        "passive-grid": {
          name: "Passive Grid",
          businessIdea: "docs/projects/passive-grid/business-idea",
          memory: "docs/projects/passive-grid/MEMORY",
        },
      },
    };
    const reg = migrateFlatToPortfolio(flat);
    expect(reg.version).toBe(2);
    expect(reg.active).toEqual({
      org: DEFAULT_ORG_SLUG,
      customer: "blacksage-kennels",
      initiative: DEFAULT_INITIATIVE_SLUG,
    });
    expect(reg.orgs[DEFAULT_ORG_SLUG]?.name).toBe("Velocity Agency");
    expect(reg.orgs[DEFAULT_ORG_SLUG]?.customers["blacksage-kennels"]?.initiatives.main).toEqual({
      name: "Main",
      businessIdea: "docs/projects/blacksage-kennels/business-idea",
      memory: "docs/projects/blacksage-kennels/MEMORY",
    });
    expect(Object.keys(reg.orgs[DEFAULT_ORG_SLUG]!.customers)).toEqual(
      expect.arrayContaining(["blacksage-kennels", "passive-grid"]),
    );
  });
});

describe("normalizeRegistry", () => {
  it("migrates flat and passes through portfolio", () => {
    const flat: ProjectRegistry = {
      active: "a",
      projects: {
        a: { name: "A", businessIdea: "docs/projects/a/business-idea", memory: "docs/projects/a/MEMORY" },
      },
    };
    const { registry, migrated } = normalizeRegistry(flat);
    expect(migrated).toBe(true);
    expect(registry.active.customer).toBe("a");

    const again = normalizeRegistry(registry);
    expect(again.migrated).toBe(false);
    expect(again.registry.active.initiative).toBe("main");
  });

  it("rejects invalid active", () => {
    expect(() =>
      normalizeRegistry({ active: "missing", projects: { a: { name: "A", businessIdea: "x", memory: "y" } } }),
    ).toThrow(/active/);
  });
});

describe("getInitiative + flatProjectsView", () => {
  it("resolves active initiative and flat compat view", () => {
    const { registry } = normalizeRegistry({
      active: "c1",
      projects: {
        c1: {
          name: "Customer One",
          businessIdea: "docs/projects/c1/business-idea",
          memory: "docs/projects/c1/MEMORY",
        },
      },
    });
    const resolved = getInitiative(registry);
    expect(resolved.entry.businessIdea).toBe("docs/projects/c1/business-idea");
    expect(flatProjectsView(registry).c1?.name).toBe("Customer One");
  });
});
