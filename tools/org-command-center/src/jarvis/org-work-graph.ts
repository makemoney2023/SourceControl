import type { HandoffRecord, OrgRegistry, RosterEntry } from "../lib/types";
import type { RunRecord } from "../lib/runs";
import type { GraphScope } from "./graph-scope";
import { forceOrgLayout } from "./layout/forceOrgLayout";

export type OrgWorkInboxItem = {
  filename: string;
  path: string;
  status: string;
  position?: string;
  phase?: string;
  goal?: string;
};

export type OrgWorkNodeKind =
  | "agency"
  | "customer"
  | "initiative"
  | "work_summary"
  | "seat"
  | "handoff"
  | "run"
  | "deliverable"
  | "artifact"
  | "phase"
  | "skill";

export type OrgWorkEdgeKind =
  | "serves"
  | "owns"
  | "runs"
  | "reports_to"
  | "authored"
  | "executed"
  | "delivered"
  | "produced"
  | "for_phase"
  | "owns_phase"
  | "spawned"
  | "related_handoff"
  | "reviewed_by"
  | "uses_skill";

export type OrgWorkNode = {
  id: string;
  kind: OrgWorkNodeKind;
  label: string;
  slug?: string;
  status?: string;
  phase?: string;
  detail?: string;
  x: number;
  y: number;
};

export type OrgWorkEdge = {
  id: string;
  kind: OrgWorkEdgeKind;
  from: string;
  to: string;
};

export type OrgWorkLegendItem = {
  kind: OrgWorkNodeKind;
  label: string;
  color: string;
};

export type OrgWorkGraph = {
  nodes: OrgWorkNode[];
  edges: OrgWorkEdge[];
  legend: OrgWorkLegendItem[];
  stats: {
    seatCount: number;
    workCount: number;
    edgeCount: number;
  };
};

const KIND_META: Record<OrgWorkNodeKind, { label: string; color: string }> = {
  agency: { label: "Agency", color: "#e8e6e3" },
  customer: { label: "Customer", color: "#6ec6ff" },
  initiative: { label: "Initiative", color: "#b388ff" },
  work_summary: { label: "Work summary", color: "#9aa0a6" },
  seat: { label: "Seat", color: "#3fd4be" },
  handoff: { label: "Handoff", color: "#7aa2ff" },
  run: { label: "Run", color: "#f0c674" },
  deliverable: { label: "Deliverable", color: "#c3e88d" },
  artifact: { label: "Artifact", color: "#c792ea" },
  phase: { label: "Phase", color: "#ff9f6b" },
  skill: { label: "Skill", color: "#e1bee7" },
};

export type PortfolioInitiativeInput = {
  org: string;
  customer: string;
  customerName: string;
  initiative: string;
  initiativeName: string;
  isActive: boolean;
  /** Open work count for collapsed non-active initiatives. */
  workCount: number;
  /** Full work graph for the active initiative (optional). */
  workGraph?: OrgWorkGraph;
};

export type PortfolioGraphInput = {
  orgSlug: string;
  orgName: string;
  initiatives: PortfolioInitiativeInput[];
};

export type ScopedInitiativeInput = {
  customer: string;
  customerName: string;
  initiative: string;
  initiativeName: string;
  uniqueInAgency: boolean;
  work?: OrgWorkGraph;
};

export type ScopedGraphInput = {
  scope: GraphScope;
  orgSlug: string;
  orgName: string;
  org: OrgRegistry;
  customer?: string;
  initiative?: string;
  seat?: string;
  initiatives: ScopedInitiativeInput[];
};

export function buildScopedOrgGraph(input: ScopedGraphInput): OrgWorkGraph {
  if (input.scope === "agency") return buildAgencyGraph(input);
  if (input.scope === "customer") return buildCustomerGraph(input);
  if (input.scope === "initiative") return buildInitiativeGraph(input);
  return buildSeatEgoGraph(input);
}

function buildAgencyGraph(input: ScopedGraphInput): OrgWorkGraph {
  const nodes = new Map<string, OrgWorkNode>();
  const edges: OrgWorkEdge[] = [];
  const edgeKeys = new Set<string>();

  const addEdge = (kind: OrgWorkEdgeKind, from: string, to: string) => {
    if (!nodes.has(from) || !nodes.has(to)) return;
    const id = `${kind}:${from}->${to}`;
    if (edgeKeys.has(id)) return;
    edgeKeys.add(id);
    edges.push({ id, kind, from, to });
  };

  const agencyId = `agency:${input.orgSlug}`;
  nodes.set(agencyId, {
    id: agencyId,
    kind: "agency",
    label: input.orgName,
    slug: input.orgSlug,
    x: 0,
    y: 0,
  });

  const byCustomer = new Map<string, ScopedInitiativeInput[]>();
  for (const init of input.initiatives) {
    const list = byCustomer.get(init.customer) ?? [];
    list.push(init);
    byCustomer.set(init.customer, list);
  }

  const customerSlugs = [...byCustomer.keys()];
  customerSlugs.forEach((customerSlug, ci) => {
    const inits = byCustomer.get(customerSlug)!;
    const customerName = inits[0]!.customerName;
    const customerId = `customer:${customerSlug}`;
    const cx = (ci - (customerSlugs.length - 1) / 2) * 8;
    nodes.set(customerId, {
      id: customerId,
      kind: "customer",
      label: customerName,
      slug: customerSlug,
      x: cx,
      y: 3,
    });
    addEdge("serves", agencyId, customerId);

    inits.forEach((init, ii) => {
      const initiativeId = `initiative:${init.customer}/${init.initiative}`;
      const ix = cx + (ii - (inits.length - 1) / 2) * 3.2;
      const iy = 6;
      nodes.set(initiativeId, {
        id: initiativeId,
        kind: "initiative",
        label: init.initiativeName,
        slug: `${init.customer}/${init.initiative}`,
        x: ix,
        y: iy,
      });
      addEdge("owns", customerId, initiativeId);
    });
  });

  const nodeList = [...nodes.values()];
  const structureCount = nodeList.filter(
    (n) => n.kind === "agency" || n.kind === "customer" || n.kind === "initiative",
  ).length;
  return {
    nodes: nodeList,
    edges,
    legend: (Object.keys(KIND_META) as OrgWorkNodeKind[]).map((kind) => ({
      kind,
      label: KIND_META[kind].label,
      color: KIND_META[kind].color,
    })),
    stats: {
      seatCount: nodeList.filter((n) => n.kind === "seat").length,
      workCount: nodeList.length - structureCount,
      edgeCount: edges.length,
    },
  };
}

function buildCustomerGraph(_input: ScopedGraphInput): OrgWorkGraph {
  throw new Error("not implemented");
}

function buildInitiativeGraph(_input: ScopedGraphInput): OrgWorkGraph {
  throw new Error("not implemented");
}

function buildSeatEgoGraph(_input: ScopedGraphInput): OrgWorkGraph {
  throw new Error("not implemented");
}

/**
 * Agency → customers → initiatives → work (active expanded, others summarized).
 */
export function buildPortfolioWorkGraph(input: PortfolioGraphInput): OrgWorkGraph {
  const nodes = new Map<string, OrgWorkNode>();
  const edges: OrgWorkEdge[] = [];
  const edgeKeys = new Set<string>();

  const addEdge = (kind: OrgWorkEdgeKind, from: string, to: string) => {
    if (!nodes.has(from) || !nodes.has(to)) return;
    const id = `${kind}:${from}->${to}`;
    if (edgeKeys.has(id)) return;
    edgeKeys.add(id);
    edges.push({ id, kind, from, to });
  };

  const agencyId = `agency:${input.orgSlug}`;
  nodes.set(agencyId, {
    id: agencyId,
    kind: "agency",
    label: input.orgName,
    slug: input.orgSlug,
    x: 0,
    y: 0,
  });

  const byCustomer = new Map<string, PortfolioInitiativeInput[]>();
  for (const init of input.initiatives) {
    const list = byCustomer.get(init.customer) ?? [];
    list.push(init);
    byCustomer.set(init.customer, list);
  }

  const customerSlugs = [...byCustomer.keys()];
  customerSlugs.forEach((customerSlug, ci) => {
    const inits = byCustomer.get(customerSlug)!;
    const customerName = inits[0]!.customerName;
    const customerId = `customer:${customerSlug}`;
    const cx = (ci - (customerSlugs.length - 1) / 2) * 8;
    nodes.set(customerId, {
      id: customerId,
      kind: "customer",
      label: customerName,
      slug: customerSlug,
      x: cx,
      y: 3,
    });
    addEdge("serves", agencyId, customerId);

    inits.forEach((init, ii) => {
      const initiativeId = `initiative:${init.customer}/${init.initiative}`;
      const ix = cx + (ii - (inits.length - 1) / 2) * 3.2;
      const iy = 6;
      nodes.set(initiativeId, {
        id: initiativeId,
        kind: "initiative",
        label: init.initiativeName,
        slug: `${init.customer}/${init.initiative}`,
        status: init.isActive ? "active" : undefined,
        detail: init.isActive ? "active" : undefined,
        x: ix,
        y: iy,
      });
      addEdge("owns", customerId, initiativeId);

      if (init.isActive && init.workGraph) {
        const offsetX = ix;
        const offsetY = iy + 4;
        for (const n of init.workGraph.nodes) {
          const nid = `${initiativeId}:${n.id}`;
          nodes.set(nid, {
            ...n,
            id: nid,
            x: n.x * 0.45 + offsetX,
            y: n.y * 0.45 + offsetY,
          });
          if (n.kind === "seat") {
            addEdge("runs", initiativeId, nid);
          }
        }
        for (const e of init.workGraph.edges) {
          addEdge(e.kind, `${initiativeId}:${e.from}`, `${initiativeId}:${e.to}`);
        }
      } else {
        const summaryId = `${initiativeId}:summary`;
        nodes.set(summaryId, {
          id: summaryId,
          kind: "work_summary",
          label: `${init.workCount} work items`,
          slug: `${init.customer}/${init.initiative}`,
          detail: "collapsed",
          x: ix,
          y: iy + 2.2,
        });
        addEdge("runs", initiativeId, summaryId);
      }
    });
  });

  const nodeList = [...nodes.values()];
  const structureCount = nodeList.filter((n) =>
    n.kind === "agency" || n.kind === "customer" || n.kind === "initiative" || n.kind === "work_summary",
  ).length;
  return {
    nodes: nodeList,
    edges,
    legend: (Object.keys(KIND_META) as OrgWorkNodeKind[]).map((kind) => ({
      kind,
      label: KIND_META[kind].label,
      color: KIND_META[kind].color,
    })),
    stats: {
      seatCount: nodeList.filter((n) => n.kind === "seat").length,
      workCount: nodeList.length - structureCount,
      edgeCount: edges.length,
    },
  };
}

function seatId(slug: string) {
  return `seat:${slug}`;
}

function handoffId(filename: string) {
  return `handoff:${filename}`;
}

function runId(id: string) {
  return `run:${id}`;
}

function deliverableId(filename: string) {
  return `deliverable:${filename}`;
}

function artifactId(path: string) {
  return `artifact:${path}`;
}

function phaseId(phase: string) {
  return `phase:${phase}`;
}

function shortPath(path: string): string {
  const parts = path.split(/[/\\]/).filter(Boolean);
  return parts.slice(-2).join("/") || path;
}

function rosterBySlug(roster: RosterEntry[]): Map<string, RosterEntry> {
  return new Map(roster.map((r) => [r.slug, r]));
}

/**
 * Live org-work graph: every roster seat + handoffs/runs/inbox/artifacts + relations.
 */
export function buildOrgWorkGraph(input: {
  org: OrgRegistry;
  handoffs: HandoffRecord[];
  runs: RunRecord[];
  inbox: OrgWorkInboxItem[];
}): OrgWorkGraph {
  const nodes = new Map<string, OrgWorkNode>();
  const edges: OrgWorkEdge[] = [];
  const edgeKeys = new Set<string>();
  const roster = input.org.roster;
  const bySlug = rosterBySlug(roster);
  const seatLayout = forceOrgLayout(roster);

  const addEdge = (kind: OrgWorkEdgeKind, from: string, to: string) => {
    if (!nodes.has(from) || !nodes.has(to)) return;
    const id = `${kind}:${from}->${to}`;
    if (edgeKeys.has(id)) return;
    edgeKeys.add(id);
    edges.push({ id, kind, from, to });
  };

  const placeNearSeat = (slug: string, index: number, kind: OrgWorkNodeKind) => {
    const base = seatLayout.get(slug) ?? { x: 0, y: 0, z: 0 };
    const ring = 1.1 + (index % 5) * 0.35;
    const angle = (index * 2.4 + kind.length) % (Math.PI * 2);
    return {
      x: base.x + Math.cos(angle) * ring,
      y: base.z + Math.sin(angle) * ring,
    };
  };

  for (const seat of roster) {
    const p = seatLayout.get(seat.slug) ?? { x: 0, y: 0, z: 0 };
    nodes.set(seatId(seat.slug), {
      id: seatId(seat.slug),
      kind: "seat",
      label: seat.title,
      slug: seat.slug,
      detail: seat.dept ? `${seat.level} · ${seat.dept}` : seat.level,
      x: p.x,
      y: p.z,
    });
  }

  for (const seat of roster) {
    if (seat.reportsTo && bySlug.has(seat.reportsTo)) {
      addEdge("reports_to", seatId(seat.slug), seatId(seat.reportsTo));
    }
  }

  const workIndexBySeat = new Map<string, number>();
  const nextIndex = (slug: string) => {
    const i = workIndexBySeat.get(slug) ?? 0;
    workIndexBySeat.set(slug, i + 1);
    return i;
  };

  for (const po of input.org.phaseOwners) {
    const id = phaseId(po.phase);
    if (!nodes.has(id)) {
      const owner = po.managerOwner || "ceo-strategist";
      const pos = placeNearSeat(owner, nextIndex(owner), "phase");
      nodes.set(id, {
        id,
        kind: "phase",
        label: `Phase ${po.phase}`,
        phase: po.phase,
        detail: po.managerOwner ? `Owner: ${po.managerOwner}` : undefined,
        x: pos.x,
        y: pos.y,
      });
    }
    if (po.managerOwner && bySlug.has(po.managerOwner)) {
      addEdge("owns_phase", seatId(po.managerOwner), id);
    }
  }

  for (const h of input.handoffs) {
    const slug = (h.position || "").trim();
    if (!slug || !bySlug.has(slug)) continue;
    const id = handoffId(h.filename);
    const pos = placeNearSeat(slug, nextIndex(slug), "handoff");
    nodes.set(id, {
      id,
      kind: "handoff",
      label: h.filename.replace(/\.md$/i, ""),
      slug,
      status: h.status || undefined,
      phase: h.phase || undefined,
      detail: h.kind,
      x: pos.x,
      y: pos.y,
    });
    addEdge("authored", seatId(slug), id);
    if (h.phase) {
      const pid = phaseId(h.phase);
      if (!nodes.has(pid)) {
        const ppos = placeNearSeat(slug, nextIndex(slug), "phase");
        nodes.set(pid, {
          id: pid,
          kind: "phase",
          label: `Phase ${h.phase}`,
          phase: h.phase,
          x: ppos.x,
          y: ppos.y,
        });
      }
      addEdge("for_phase", id, pid);
    }
    for (const art of h.artifacts) {
      if (!art.path) continue;
      const aid = artifactId(art.path);
      if (!nodes.has(aid)) {
        const apos = placeNearSeat(slug, nextIndex(slug), "artifact");
        nodes.set(aid, {
          id: aid,
          kind: "artifact",
          label: shortPath(art.path),
          slug,
          detail: art.path,
          x: apos.x,
          y: apos.y,
        });
      }
      addEdge("produced", id, aid);
    }
    for (const path of h.productionPaths || []) {
      if (!path) continue;
      const aid = artifactId(path);
      if (!nodes.has(aid)) {
        const apos = placeNearSeat(slug, nextIndex(slug), "artifact");
        nodes.set(aid, {
          id: aid,
          kind: "artifact",
          label: shortPath(path),
          slug,
          detail: path,
          x: apos.x,
          y: apos.y,
        });
      }
      addEdge("produced", id, aid);
    }
  }

  for (const r of input.runs) {
    const slug = (r.position || "").trim();
    if (!slug || !bySlug.has(slug)) continue;
    const id = runId(r.runId);
    const pos = placeNearSeat(slug, nextIndex(slug), "run");
    nodes.set(id, {
      id,
      kind: "run",
      label: r.runId,
      slug,
      status: r.status,
      phase: r.phase || undefined,
      detail: r.wake_reason,
      x: pos.x,
      y: pos.y,
    });
    addEdge("executed", seatId(slug), id);
    if (r.phase) {
      const pid = phaseId(r.phase);
      if (!nodes.has(pid)) {
        const ppos = placeNearSeat(slug, nextIndex(slug), "phase");
        nodes.set(pid, {
          id: pid,
          kind: "phase",
          label: `Phase ${r.phase}`,
          phase: r.phase,
          x: ppos.x,
          y: ppos.y,
        });
      }
      addEdge("for_phase", id, pid);
    }
  }

  for (const item of input.inbox) {
    const slug = (item.position || "").trim();
    if (!slug || !bySlug.has(slug)) continue;
    const id = deliverableId(item.filename);
    const pos = placeNearSeat(slug, nextIndex(slug), "deliverable");
    nodes.set(id, {
      id,
      kind: "deliverable",
      label: item.filename.replace(/\.md$/i, ""),
      slug,
      status: item.status || undefined,
      phase: item.phase || undefined,
      detail: item.goal,
      x: pos.x,
      y: pos.y,
    });
    addEdge("delivered", seatId(slug), id);
    if (item.phase) {
      const pid = phaseId(item.phase);
      if (nodes.has(pid)) addEdge("for_phase", id, pid);
    }
  }

  const nodeList = [...nodes.values()];
  const seatCount = nodeList.filter((n) => n.kind === "seat").length;
  return {
    nodes: nodeList,
    edges,
    legend: (Object.keys(KIND_META) as OrgWorkNodeKind[]).map((kind) => ({
      kind,
      label: KIND_META[kind].label,
      color: KIND_META[kind].color,
    })),
    stats: {
      seatCount,
      workCount: nodeList.length - seatCount,
      edgeCount: edges.length,
    },
  };
}

export function orgWorkNodeColor(kind: OrgWorkNodeKind): string {
  return KIND_META[kind].color;
}
