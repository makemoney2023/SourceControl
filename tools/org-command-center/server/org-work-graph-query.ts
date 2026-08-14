import type { GraphFocus, GraphScope } from "../src/jarvis/graph-scope";

const SCOPES: GraphScope[] = ["agency", "customer", "initiative", "seat"];

export function parseOrgWorkGraphQuery(
  url: URL,
): GraphFocus | { error: string } {
  const raw = (url.searchParams.get("scope") || "agency").toLowerCase();
  if (!SCOPES.includes(raw as GraphScope)) {
    return { error: "scope must be agency, customer, initiative, or seat" };
  }
  const scope = raw as GraphScope;
  const customer = url.searchParams.get("customer") || undefined;
  const initiative = url.searchParams.get("initiative") || undefined;
  const seat = url.searchParams.get("seat") || undefined;
  if (scope === "customer" && !customer) {
    return { error: "customer is required for scope=customer" };
  }
  if ((scope === "initiative" || scope === "seat") && (!customer || !initiative)) {
    return { error: `customer and initiative are required for scope=${scope}` };
  }
  if (scope === "seat" && !seat) {
    return { error: "seat is required for scope=seat" };
  }
  return { scope, customer, initiative, seat };
}
