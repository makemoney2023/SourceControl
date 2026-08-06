import {
  DEFAULT_INITIATIVE_SLUG,
  DEFAULT_ORG_SLUG,
  ensureDefaultOrg,
  type ActiveRef,
  type PortfolioRegistry,
} from "./portfolio-registry";
import {
  initiativePaths,
  loadRegistry,
  saveRegistry,
} from "./paths";
import { ensureInitiativeVaultSourceOfTruth } from "./obsidian/vault-sot";
import { scaffoldInitiativeWorkspace, SLUG_RE, slugifyName } from "./scaffold-workspace";

export type CreateInitiativeInput = {
  name: string;
  slug?: string;
  org?: string;
  customer?: string;
  activate?: boolean;
  contextNote?: string;
};

export type CreateInitiativeResult = {
  org: string;
  customer: string;
  slug: string;
  name: string;
  businessIdea: string;
  memory: string;
  active: ActiveRef;
};

export function createInitiative(
  repoRoot: string,
  input: CreateInitiativeInput,
): CreateInitiativeResult {
  const name = input.name?.trim();
  if (!name) throw new Error("name is required");

  const slug = (input.slug?.trim() || slugifyName(name)).toLowerCase();
  if (!SLUG_RE.test(slug)) {
    throw new Error(`Slug must be lowercase alphanumeric with optional hyphens: got '${slug}'`);
  }

  let reg = ensureDefaultOrg(loadRegistry(repoRoot));
  const org = (input.org?.trim() || reg.active.org || DEFAULT_ORG_SLUG).toLowerCase();
  const customer = (input.customer?.trim() || reg.active.customer).toLowerCase();
  if (!customer) throw new Error("customer is required");

  const orgEntry = reg.orgs[org];
  if (!orgEntry) throw new Error(`Unknown org: ${org}`);
  const customerEntry = orgEntry.customers[customer];
  if (!customerEntry) throw new Error(`Unknown customer: ${customer}`);
  if (customerEntry.initiatives[slug]) {
    throw new Error(`Initiative already registered: ${customer}/${slug}`);
  }

  const paths = initiativePaths(org, customer, slug);
  scaffoldInitiativeWorkspace(repoRoot, {
    displayName: name,
    businessIdeaRel: paths.businessIdea,
    memoryRel: paths.memory,
    contextNote: input.contextNote,
    decisionsNote: "Initiative scaffolded",
  });

  const next: PortfolioRegistry = {
    ...reg,
    orgs: {
      ...reg.orgs,
      [org]: {
        ...orgEntry,
        customers: {
          ...orgEntry.customers,
          [customer]: {
            ...customerEntry,
            initiatives: {
              ...customerEntry.initiatives,
              [slug]: {
                name,
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
    next.active = { org, customer, initiative: slug };
  }
  saveRegistry(repoRoot, next);

  ensureInitiativeVaultSourceOfTruth(repoRoot, { org, customer, initiative: slug });

  return {
    org,
    customer,
    slug,
    name,
    businessIdea: paths.businessIdea,
    memory: paths.memory,
    active: next.active,
  };
}

export { DEFAULT_INITIATIVE_SLUG };
