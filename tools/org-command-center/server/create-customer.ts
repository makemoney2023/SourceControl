import {
  DEFAULT_INITIATIVE_NAME,
  DEFAULT_INITIATIVE_SLUG,
  DEFAULT_ORG_SLUG,
  ensureDefaultOrg,
  type ActiveRef,
  type PortfolioRegistry,
} from "./portfolio-registry";
import { initiativePaths, loadRegistry, saveRegistry } from "./paths";
import { ensureInitiativeVaultSourceOfTruth } from "./obsidian/vault-sot";
import { scaffoldInitiativeWorkspace, SLUG_RE, slugifyName } from "./scaffold-workspace";

export type CreateCustomerInput = {
  name: string;
  slug?: string;
  org?: string;
  activate?: boolean;
  contextNote?: string;
};

export type CreateCustomerResult = {
  org: string;
  slug: string;
  name: string;
  initiative: string;
  businessIdea: string;
  memory: string;
  active: ActiveRef;
};

export function createCustomer(
  repoRoot: string,
  input: CreateCustomerInput,
): CreateCustomerResult {
  const name = input.name?.trim();
  if (!name) throw new Error("name is required");

  const slug = (input.slug?.trim() || slugifyName(name)).toLowerCase();
  if (!SLUG_RE.test(slug)) {
    throw new Error(`Slug must be lowercase alphanumeric with optional hyphens: got '${slug}'`);
  }

  let reg = ensureDefaultOrg(loadRegistry(repoRoot));
  const org = (input.org?.trim() || reg.active.org || DEFAULT_ORG_SLUG).toLowerCase();
  const orgEntry = reg.orgs[org];
  if (!orgEntry) throw new Error(`Unknown org: ${org}`);
  if (orgEntry.customers[slug]) {
    throw new Error(`Customer already registered: ${slug}`);
  }

  const initiative = DEFAULT_INITIATIVE_SLUG;
  const paths = initiativePaths(org, slug, initiative);
  scaffoldInitiativeWorkspace(repoRoot, {
    displayName: name,
    businessIdeaRel: paths.businessIdea,
    memoryRel: paths.memory,
    contextNote: input.contextNote,
    decisionsNote: "Customer scaffolded with default main initiative",
  });

  const next: PortfolioRegistry = {
    ...reg,
    orgs: {
      ...reg.orgs,
      [org]: {
        ...orgEntry,
        customers: {
          ...orgEntry.customers,
          [slug]: {
            name,
            initiatives: {
              [initiative]: {
                name: DEFAULT_INITIATIVE_NAME,
                businessIdea: paths.businessIdea,
                memory: paths.memory,
              },
            },
          },
        },
      },
    },
  };
  if (input.activate !== false) {
    next.active = { org, customer: slug, initiative };
  }
  saveRegistry(repoRoot, next);

  ensureInitiativeVaultSourceOfTruth(repoRoot, { org, customer: slug, initiative });

  return {
    org,
    slug,
    name,
    initiative,
    businessIdea: paths.businessIdea,
    memory: paths.memory,
    active: next.active,
  };
}
