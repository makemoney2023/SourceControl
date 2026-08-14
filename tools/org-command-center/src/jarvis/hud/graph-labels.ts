import type { GraphScope } from "../graph-scope";
import {
  KIND_META,
  type OrgWorkLegendItem,
  type OrgWorkNodeKind,
} from "../org-work-graph";

export function labelKindsForScope(scope: GraphScope): OrgWorkNodeKind[] {
  if (scope === "agency") return ["agency", "customer", "initiative"];
  if (scope === "customer") return ["customer", "initiative", "seat"];
  if (scope === "initiative") return ["initiative", "seat"];
  return ["seat", "handoff", "run", "deliverable", "skill", "phase"];
}

const KIND_ORDER = Object.keys(KIND_META) as OrgWorkNodeKind[];

export function legendForNodes(
  nodes: Array<{ kind: OrgWorkNodeKind }>,
): OrgWorkLegendItem[] {
  const present = new Set(nodes.map((n) => n.kind));
  return KIND_ORDER.filter((kind) => present.has(kind)).map((kind) => ({
    kind,
    label: KIND_META[kind].label,
    color: KIND_META[kind].color,
  }));
}
