/** Portfolio registry (agency → customer → initiative). */

export const DEFAULT_ORG_SLUG = "velocity-agency";
export const DEFAULT_ORG_NAME = "Velocity Agency";
export const DEFAULT_INITIATIVE_SLUG = "main";
export const DEFAULT_INITIATIVE_NAME = "Main";

export type InitiativeEntry = {
  name: string;
  businessIdea: string;
  memory: string;
};

export type CustomerEntry = {
  name: string;
  initiatives: Record<string, InitiativeEntry>;
};

export type OrgEntry = {
  name: string;
  customers: Record<string, CustomerEntry>;
};

export type ActiveRef = {
  org: string;
  customer: string;
  initiative: string;
};

export type PortfolioRegistry = {
  version: 2;
  active: ActiveRef;
  orgs: Record<string, OrgEntry>;
};

/** Legacy flat venture registry (pre-portfolio). */
export type ProjectEntry = {
  name: string;
  businessIdea: string;
  memory: string;
};

export type ProjectRegistry = {
  active: string;
  projects: Record<string, ProjectEntry>;
};

export function isPortfolioRegistry(raw: unknown): raw is PortfolioRegistry {
  if (!raw || typeof raw !== "object") return false;
  const r = raw as Record<string, unknown>;
  return (
    r.version === 2 &&
    r.active !== null &&
    typeof r.active === "object" &&
    r.orgs !== null &&
    typeof r.orgs === "object"
  );
}

export function isFlatProjectRegistry(raw: unknown): raw is ProjectRegistry {
  if (!raw || typeof raw !== "object") return false;
  const r = raw as Record<string, unknown>;
  return typeof r.active === "string" && r.projects !== null && typeof r.projects === "object";
}

export function migrateFlatToPortfolio(flat: ProjectRegistry): PortfolioRegistry {
  if (!flat.active || !flat.projects?.[flat.active]) {
    throw new Error(`Invalid registry: active "${flat.active}" not in projects`);
  }
  const customers: Record<string, CustomerEntry> = {};
  for (const [slug, entry] of Object.entries(flat.projects)) {
    customers[slug] = {
      name: entry.name,
      initiatives: {
        [DEFAULT_INITIATIVE_SLUG]: {
          name: DEFAULT_INITIATIVE_NAME,
          businessIdea: entry.businessIdea,
          memory: entry.memory,
        },
      },
    };
  }
  return {
    version: 2,
    active: {
      org: DEFAULT_ORG_SLUG,
      customer: flat.active,
      initiative: DEFAULT_INITIATIVE_SLUG,
    },
    orgs: {
      [DEFAULT_ORG_SLUG]: {
        name: DEFAULT_ORG_NAME,
        customers,
      },
    },
  };
}

export function normalizeRegistry(raw: unknown): { registry: PortfolioRegistry; migrated: boolean } {
  if (isPortfolioRegistry(raw)) {
    assertActiveValid(raw);
    return { registry: raw, migrated: false };
  }
  if (isFlatProjectRegistry(raw)) {
    const registry = migrateFlatToPortfolio(raw);
    assertActiveValid(registry);
    return { registry, migrated: true };
  }
  throw new Error("Invalid registry: expected portfolio v2 or flat projects map");
}

export function assertActiveValid(reg: PortfolioRegistry): void {
  const { org, customer, initiative } = reg.active;
  const orgEntry = reg.orgs[org];
  if (!orgEntry) throw new Error(`Invalid registry: active org "${org}" not found`);
  const customerEntry = orgEntry.customers[customer];
  if (!customerEntry) {
    throw new Error(`Invalid registry: active customer "${customer}" not found`);
  }
  if (!customerEntry.initiatives[initiative]) {
    throw new Error(`Invalid registry: active initiative "${initiative}" not found`);
  }
}

export function getInitiative(
  reg: PortfolioRegistry,
  ref?: Partial<ActiveRef> | null,
): { ref: ActiveRef; entry: InitiativeEntry; customerName: string; orgName: string } {
  const active: ActiveRef = {
    org: ref?.org ?? reg.active.org,
    customer: ref?.customer ?? reg.active.customer,
    initiative: ref?.initiative ?? reg.active.initiative,
  };
  const orgEntry = reg.orgs[active.org];
  if (!orgEntry) throw new Error(`Unknown org: ${active.org}`);
  const customerEntry = orgEntry.customers[active.customer];
  if (!customerEntry) throw new Error(`Unknown customer: ${active.customer}`);
  const entry = customerEntry.initiatives[active.initiative];
  if (!entry) throw new Error(`Unknown initiative: ${active.initiative}`);
  return {
    ref: active,
    entry,
    customerName: customerEntry.name,
    orgName: orgEntry.name,
  };
}

/** Resolve by customer slug → main initiative (legacy venture slug). */
export function getCustomerMain(
  reg: PortfolioRegistry,
  customerSlug: string,
  orgSlug = DEFAULT_ORG_SLUG,
): { ref: ActiveRef; entry: InitiativeEntry; customerName: string; orgName: string } {
  return getInitiative(reg, {
    org: orgSlug,
    customer: customerSlug,
    initiative: DEFAULT_INITIATIVE_SLUG,
  });
}

export function listCustomers(
  reg: PortfolioRegistry,
  orgSlug = DEFAULT_ORG_SLUG,
): { slug: string; name: string }[] {
  const org = reg.orgs[orgSlug];
  if (!org) return [];
  return Object.entries(org.customers).map(([slug, c]) => ({ slug, name: c.name }));
}

export function listInitiatives(
  reg: PortfolioRegistry,
  customerSlug: string,
  orgSlug = DEFAULT_ORG_SLUG,
): { slug: string; name: string; businessIdea: string; memory: string }[] {
  const customer = reg.orgs[orgSlug]?.customers[customerSlug];
  if (!customer) return [];
  return Object.entries(customer.initiatives).map(([slug, i]) => ({
    slug,
    name: i.name,
    businessIdea: i.businessIdea,
    memory: i.memory,
  }));
}

/** Compat: customer slug → main initiative paths (looks like old ProjectEntry map). */
export function flatProjectsView(reg: PortfolioRegistry): Record<string, ProjectEntry> {
  const out: Record<string, ProjectEntry> = {};
  for (const org of Object.values(reg.orgs)) {
    for (const [customerSlug, customer] of Object.entries(org.customers)) {
      const main = customer.initiatives[DEFAULT_INITIATIVE_SLUG];
      if (!main) continue;
      out[customerSlug] = {
        name: customer.name,
        businessIdea: main.businessIdea,
        memory: main.memory,
      };
    }
  }
  return out;
}

export function ensureDefaultOrg(reg: PortfolioRegistry): PortfolioRegistry {
  if (reg.orgs[DEFAULT_ORG_SLUG]) return reg;
  return {
    ...reg,
    orgs: {
      ...reg.orgs,
      [DEFAULT_ORG_SLUG]: { name: DEFAULT_ORG_NAME, customers: {} },
    },
  };
}
