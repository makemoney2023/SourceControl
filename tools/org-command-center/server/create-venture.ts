/**
 * Legacy createVenture → createCustomer (customer + default main initiative).
 */
import { createCustomer } from "./create-customer";
import { slugifyName } from "./scaffold-workspace";

export const slugifyVentureName = slugifyName;

export type CreateVentureInput = {
  name: string;
  slug?: string;
  /** Default true — switch Situation Room to the new customer/main. */
  activate?: boolean;
  contextNote?: string;
};

export type CreateVentureResult = {
  slug: string;
  name: string;
  businessIdea: string;
  memory: string;
  active: string;
};

export function createVenture(repoRoot: string, input: CreateVentureInput): CreateVentureResult {
  const result = createCustomer(repoRoot, {
    name: input.name,
    slug: input.slug,
    activate: input.activate,
    contextNote: input.contextNote,
  });
  return {
    slug: result.slug,
    name: result.name,
    businessIdea: result.businessIdea,
    memory: result.memory,
    active: result.active.customer,
  };
}
