import { useMemo, useState } from "react";
import {
  nextGraphFocus,
  type BreadcrumbCrumb,
  type GraphFocus,
} from "../graph-scope";
import {
  orgWorkNodeColor,
  type OrgWorkGraph,
  type OrgWorkNode,
  type OrgWorkNodeKind,
} from "../org-work-graph";
import { labelKindsForScope } from "./graph-labels";

const KIND_RADIUS: Record<OrgWorkNodeKind, number> = {
  agency: 18,
  customer: 15,
  initiative: 12,
  work_summary: 9,
  seat: 14,
  phase: 10,
  handoff: 7,
  run: 7,
  deliverable: 7,
  artifact: 6,
  skill: 7,
};

function project(nodes: OrgWorkNode[], width: number, height: number) {
  if (nodes.length === 0) {
    return { mapped: [] as Array<OrgWorkNode & { px: number; py: number }>, pad: 24 };
  }
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const n of nodes) {
    minX = Math.min(minX, n.x);
    maxX = Math.max(maxX, n.x);
    minY = Math.min(minY, n.y);
    maxY = Math.max(maxY, n.y);
  }
  const pad = 36;
  const dx = Math.max(maxX - minX, 0.001);
  const dy = Math.max(maxY - minY, 0.001);
  const mapped = nodes.map((n) => ({
    ...n,
    px: pad + ((n.x - minX) / dx) * (width - pad * 2),
    py: pad + ((n.y - minY) / dy) * (height - pad * 2),
  }));
  return { mapped, pad };
}

export function OrgWorkGraphView({
  graph,
  focus,
  crumbs,
  onFocus,
  onOpenWork,
}: {
  graph: OrgWorkGraph;
  focus: GraphFocus;
  crumbs: BreadcrumbCrumb[];
  onFocus: (focus: GraphFocus) => void;
  onOpenWork?: (slug?: string) => void;
}) {
  const [hover, setHover] = useState<OrgWorkNode | null>(null);
  const [filter, setFilter] = useState<Record<OrgWorkNodeKind, boolean>>({
    agency: true,
    customer: true,
    initiative: true,
    work_summary: true,
    seat: true,
    handoff: true,
    run: true,
    deliverable: true,
    artifact: true,
    phase: true,
    skill: true,
  });

  const width = 980;
  const height = 620;
  const svgWidth =
    focus.scope === "customer" || focus.scope === "initiative" ? width * 1.4 : width;
  const labelKinds = useMemo(() => labelKindsForScope(focus.scope), [focus.scope]);
  const visible = useMemo(
    () => graph.nodes.filter((n) => filter[n.kind]),
    [graph.nodes, filter],
  );
  const visibleIds = useMemo(() => new Set(visible.map((n) => n.id)), [visible]);
  const { mapped } = useMemo(() => project(visible, width, height), [visible]);
  const byId = useMemo(() => new Map(mapped.map((n) => [n.id, n])), [mapped]);

  const edges = graph.edges.filter(
    (e) => visibleIds.has(e.from) && visibleIds.has(e.to),
  );

  return (
    <div className="j-org-work-graph">
      <nav className="j-org-work-breadcrumb" aria-label="Graph scope">
        {crumbs.map((crumb, i) => (
          <span key={`${crumb.scope}-${crumb.label}`} className="j-org-work-crumb">
            {i > 0 ? <span className="j-org-work-crumb-sep" aria-hidden> / </span> : null}
            <button
              type="button"
              className="j-org-work-crumb-btn"
              data-active={i === crumbs.length - 1 ? "true" : undefined}
              onClick={() => onFocus(crumb.focus)}
            >
              {crumb.label}
            </button>
          </span>
        ))}
      </nav>

      <div className="j-org-work-graph-meta">
        <p className="j-muted" style={{ margin: 0 }}>
          {graph.stats.seatCount} seats · {graph.stats.workCount} work items ·{" "}
          {graph.stats.edgeCount} links
        </p>
        <div className="j-org-work-legend" aria-label="Graph legend">
          {graph.legend.map((item) => (
            <label key={item.kind} className="j-org-work-legend-item">
              <input
                type="checkbox"
                checked={filter[item.kind]}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, [item.kind]: e.target.checked }))
                }
              />
              <span
                className="j-org-work-swatch"
                style={{ background: item.color }}
                aria-hidden
              />
              {item.label}
            </label>
          ))}
        </div>
      </div>

      <div className="j-org-work-graph-body">
        <div className="j-org-work-viewport">
          <svg
            className="j-org-work-svg"
            width={svgWidth}
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label="Org work graph"
          >
            {edges.map((e) => {
              const a = byId.get(e.from);
              const b = byId.get(e.to);
              if (!a || !b) return null;
              return (
                <line
                  key={e.id}
                  x1={a.px}
                  y1={a.py}
                  x2={b.px}
                  y2={b.py}
                  className="j-org-work-edge"
                  data-kind={e.kind}
                />
              );
            })}
            {mapped.map((n) => {
              const r = KIND_RADIUS[n.kind];
              const fill = orgWorkNodeColor(n.kind);
              const showLabel = labelKinds.includes(n.kind);
              return (
                <g
                  key={n.id}
                  transform={`translate(${n.px},${n.py})`}
                  className="j-org-work-node"
                  data-kind={n.kind}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => {
                    const next = nextGraphFocus(focus, n);
                    if (next === "open-work") onOpenWork?.(n.slug);
                    else if (next) onFocus(next);
                  }}
                >
                  <circle r={r} fill={fill} />
                  {showLabel ? (
                    <text y={r + 12} textAnchor="middle" className="j-org-work-label">
                      {n.label}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </svg>
        </div>

        <aside className="j-org-work-info" aria-live="polite">
          <p className="j-title">Node info</p>
          {!hover ? (
            <p className="j-muted" style={{ fontSize: 12 }}>
              Hover a node. Click to drill down; use the breadcrumb to go up.
            </p>
          ) : (
            <div style={{ display: "grid", gap: 6, fontSize: 12 }}>
              <p style={{ margin: 0 }}>
                <span className="j-chip" style={{ marginRight: 6 }}>
                  {hover.kind}
                </span>
                <strong>{hover.label}</strong>
              </p>
              {hover.slug ? <p className="j-muted" style={{ margin: 0 }}>Slug · {hover.slug}</p> : null}
              {hover.phase ? <p className="j-muted" style={{ margin: 0 }}>Phase · {hover.phase}</p> : null}
              {hover.status ? (
                <p className="j-muted" style={{ margin: 0 }}>
                  Status · {hover.status}
                </p>
              ) : null}
              {hover.detail ? (
                <p className="j-muted" style={{ margin: 0 }}>
                  {hover.detail}
                </p>
              ) : null}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
