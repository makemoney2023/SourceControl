import type { SeatReport } from "../seat-report";
import type { SeatWorkContext } from "../seat-work-context";

export function SeatConsole({
  report,
  work,
  loading,
  onClose,
  onResolveBlocker,
  onOpenArtifact,
  resolving,
}: {
  report: SeatReport | null;
  work?: SeatWorkContext;
  loading?: boolean;
  onClose: () => void;
  onResolveBlocker?: (slug: string) => void;
  onOpenArtifact?: (path: string) => void;
  resolving?: boolean;
}) {
  if (loading) {
    return (
      <aside className="j-hud-panel j-hud-grid j-seat-console" aria-label="Seat console">
        <p className="j-title">Seat console</p>
        <p className="j-muted">Loading telemetry…</p>
      </aside>
    );
  }

  if (!report) {
    return (
      <aside className="j-hud-panel j-hud-grid j-seat-console" aria-label="Seat console">
        <p className="j-title">Seat console</p>
        <p className="j-muted" style={{ margin: 0 }}>
          Select a node on the org graph to inspect live work.
        </p>
      </aside>
    );
  }

  const status = work?.status ?? report.pulse;
  const tone =
    status === "blocked" || status === "error"
      ? "danger"
      : status === "escalate" || status === "paused" || status === "active"
        ? "warn"
        : status === "done" || status === "running"
          ? "ok"
          : undefined;

  return (
    <aside className="j-hud-panel j-hud-grid j-seat-console" aria-label="Seat console">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <div>
          <p className="j-title">Seat console</p>
          <h2 className="j-heading" style={{ fontSize: 16 }}>
            {report.title}
          </h2>
          <p className="j-mono j-muted">
            {report.slug} · {report.role} · {report.dept}
          </p>
        </div>
        <button type="button" className="j-btn" onClick={onClose}>
          Clear
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        <span className="j-chip" data-tone={tone}>
          {status}
        </span>
        {work?.phase && <span className="j-chip">P{work.phase}</span>}
        {work?.queuePosition != null && (
          <span className="j-chip" data-tone="warn">
            Queue #{work.queuePosition}
          </span>
        )}
      </div>

      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.4 }}>{report.summary}</p>
      {work?.goal && (
        <p className="j-muted" style={{ margin: 0, fontSize: 12 }}>
          Work · {work.goal}
        </p>
      )}

      {report.upwardBlockers.length > 0 && (
        <section>
          <p className="j-title">Blockers</p>
          <ul style={{ margin: "6px 0 0", paddingLeft: 16, fontSize: 12 }}>
            {report.upwardBlockers.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          {onResolveBlocker && (
            <button
              type="button"
              className="j-btn"
              data-active="true"
              disabled={resolving}
              style={{ marginTop: 8 }}
              onClick={() => onResolveBlocker(report.slug)}
            >
              {resolving ? "Resolving…" : "RESOLVE"}
            </button>
          )}
        </section>
      )}

      <section>
        <p className="j-title">Live runs</p>
        {report.liveRuns.length === 0 ? (
          <p className="j-muted" style={{ margin: "6px 0 0", fontSize: 12 }}>
            None
          </p>
        ) : (
          <ul style={{ listStyle: "none", margin: "6px 0 0", padding: 0 }}>
            {report.liveRuns.map((r) => (
              <li key={r.runId} className="j-mono" style={{ fontSize: 11, marginBottom: 4 }}>
                {r.status} · P{r.phase} · {r.started_at}
                {typeof r.cost_usd === "number" ? ` · $${r.cost_usd.toFixed(4)}` : ""}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <p className="j-title">Artifacts</p>
        {report.artifacts.length === 0 ? (
          <p className="j-muted" style={{ margin: "6px 0 0", fontSize: 12 }}>
            None listed
          </p>
        ) : (
          <ul style={{ listStyle: "none", margin: "6px 0 0", padding: 0 }}>
            {report.artifacts.map((a) => (
              <li key={a.path} style={{ marginBottom: 4 }}>
                <button
                  type="button"
                  className="j-holo-tile"
                  data-tone={a.exists ? "ok" : "danger"}
                  onClick={() => onOpenArtifact?.(a.path)}
                >
                  <span className="j-mono" style={{ fontSize: 11 }}>
                    {a.path.split("/").pop()}
                  </span>
                  <span className="j-muted" style={{ fontSize: 10 }}>
                    {a.exists ? "delivered" : "missing"} · {a.fromHandoff}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {report.downward.length > 0 && (
        <section>
          <p className="j-title">Direct reports</p>
          <ul style={{ listStyle: "none", margin: "6px 0 0", padding: 0 }}>
            {report.downward.map((d) => (
              <li key={d.slug} style={{ fontSize: 12, marginBottom: 4 }}>
                <span className="j-chip">{d.latestStatus || "idle"}</span> {d.title}
                {d.blockers[0] ? (
                  <span className="j-muted"> — {d.blockers[0]}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  );
}
