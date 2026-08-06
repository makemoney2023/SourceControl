import {
  ensureDefaultOrg,
  type ActiveRef,
  type PortfolioRegistry,
} from "./portfolio-registry";
import { loadRegistry, saveRegistry } from "./paths";
import { SLUG_RE, slugifyName } from "./scaffold-workspace";

export type CreateOrgInput = {
  name: string;
  slug?: string;
  /** Only valid when the org already has a customer+initiative; otherwise ignored/false. */
  activate?: boolean;
};

export type CreateOrgResult = {
  org: string;
  name: string;
  active: ActiveRef;
};

export function createOrg(repoRoot: string, input: CreateOrgInput): CreateOrgResult {
  const name = input.name?.trim();
  if (!name) throw new Error("name is required");

  const slug = (input.slug?.trim() || slugifyName(name)).toLowerCase();
  if (!SLUG_RE.test(slug)) {
    throw new Error(`Slug must be lowercase alphanumeric with optional hyphens: got '${slug}'`);
  }

  const reg = ensureDefaultOrg(loadRegistry(repoRoot));
  if (reg.orgs[slug]) {
    throw new Error(`Org already registered: ${slug}`);
  }

  const next: PortfolioRegistry = {
    ...reg,
    orgs: {
      ...reg.orgs,
      [slug]: {
        name,
        customers: {},
      },
    },
  };

  // Empty orgs cannot become active — ActiveRef requires customer + initiative.
  if (input.activate) {
    throw new Error(
      "Cannot activate an empty org; create a customer and initiative first, then switch active",
    );
  }

  saveRegistry(repoRoot, next);

  return {
    org: slug,
    name,
    active: next.active,
  };
}
