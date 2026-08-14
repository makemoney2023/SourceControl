import type { GraphScope } from "../graph-scope";
import type { OrgWorkNodeKind } from "../org-work-graph";

export function labelKindsForScope(scope: GraphScope): OrgWorkNodeKind[] {
  if (scope === "agency") return ["agency", "customer", "initiative"];
  if (scope === "customer") return ["customer", "initiative", "seat"];
  if (scope === "initiative") return ["initiative", "seat"];
  return ["seat", "handoff", "run", "deliverable", "skill", "phase"];
}
