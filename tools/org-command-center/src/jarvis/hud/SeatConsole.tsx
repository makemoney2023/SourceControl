import type { SeatReport } from "../seat-report";
import type { SeatWorkContext } from "../seat-work-context";

function BriefSection({
  title,
  lines,
  empty,
  ordered,
}: {
  title: string;
  lines: string[];
  empty?: string;
  ordered?: boolean;
}) {
  if (lines.length === 0) {
    if (!empty) return null;
    return (
      <section>
        <p className="j-title">{title}</p>
        <p className="j-muted" style={{ margin: "6px 0 0", fontSize: 12 }}>
          {empty}
        </p>
      </section>
    );
  }
  const ListTag = ordered ? "ol" : "ul";
  return (
    <section>
      <p className="j-title">{title}</p>
      <ListTag
        style={{
          margin: "6px 0 0",
          paddingLeft: ordered ? 18 : 16,
          fontSize: 12,
          lineHeight: 1.55,
        }}
      >
        {lines.map((line) => (
          <li key={line} style={{ marginBottom: 8 }}>
            {line}
          </li>
        ))}
      </ListTag>
    </section>
  );
}

export function SeatConsole({
  report,
  work,
  loading,
  onClose,
  onResolveBlocker,
  onAnswerQuestions,
  onOpenArtifact,
  resolving,
}: {
  report: SeatReport | null;
  work?: SeatWorkContext;
  loading?: boolean;
  onClose: () => void;
  onResolveBlocker?: (slug: string) => void;
  onAnswerQuestions?: (slug: string) => void;
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
  const brief = report.businessBrief;
  const needsAnswers =
    status === "needs_input" || brief.needsFromYou.length > 0;
  const tone =
    status === "blocked" || status === "error"
      ? "danger"
      : status === "escalate" ||
          status === "paused" ||
          status === "active" ||
          status === "needs_input"
        ? "warn"
        : status === "done" || status === "running"
          ? "ok"
          : undefined;

  const statusLabel =
    status === "needs_input"
      ? "Waiting on you"
      : status === "blocked"
        ? "Stuck"
        : status === "done"
          ? "Done"
          : status === "idle"
            ? "Idle"
            : status;

  return (
    <aside className="j-hud-panel j-hud-grid j-seat-console" aria-label="Seat console">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <div>
          <p className="j-title">Seat console</p>
          <h2 className="j-heading" style={{ fontSize: 16 }}>
            {report.title}
          </h2>
          <p className="j-muted" style={{ margin: 0, fontSize: 12 }}>
            {report.dept ? `${report.dept} · ` : ""}
            {report.role}
          </p>
        </div>
        <button type="button" className="j-btn" onClick={onClose}>
          Clear
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        <span className="j-chip" data-tone={tone}>
          {statusLabel}
        </span>
        {needsAnswers ? (
          <span className="j-chip" data-tone="warn">
            Needs your input
          </span>
        ) : null}
        {work?.phase && <span className="j-chip">Phase {work.phase}</span>}
        {work?.queuePosition != null && (
          <span className="j-chip" data-tone="warn">
            Queue #{work.queuePosition}
          </span>
        )}
      </div>

      {work?.goal && (
        <p className="j-muted" style={{ margin: 0, fontSize: 12 }}>
          Current work · {work.goal}
        </p>
      )}
      {report.briefSource === "grok" ? (
        <p className="j-muted" style={{ margin: 0, fontSize: 11 }}>
          Brief rewritten for clarity (Grok)
        </p>
      ) : null}

      <BriefSection
        title="What happened"
        lines={brief.whatHappened}
        empty="No plain-language brief yet from this seat."
      />
      <BriefSection
        title="Why it matters"
        lines={brief.whyItMatters}
        empty={brief.whatHappened.length ? "No separate findings yet." : undefined}
      />
      <BriefSection title="Next steps" lines={brief.nextSteps} ordered />

      {needsAnswers && brief.needsFromYou.length > 0 && (
        <section>
          <p className="j-title">What we need from you</p>
          <ul style={{ margin: "6px 0 0", paddingLeft: 16, fontSize: 12, lineHeight: 1.5 }}>
            {brief.needsFromYou.map((q) => (
              <li key={q} style={{ marginBottom: 6 }}>
                {q}
              </li>
            ))}
          </ul>
          {onAnswerQuestions && (
            <button
              type="button"
              className="j-btn"
              data-active="true"
              style={{ marginTop: 8 }}
              onClick={() => onAnswerQuestions(report.slug)}
            >
              Answer
            </button>
          )}
        </section>
      )}

      {brief.whatsStuck.length > 0 && (
        <section>
          <p className="j-title">What&apos;s stuck</p>
          <ul style={{ margin: "6px 0 0", paddingLeft: 16, fontSize: 12, lineHeight: 1.45 }}>
            {brief.whatsStuck.map((b) => (
              <li key={b} style={{ marginBottom: 4 }}>
                {b}
              </li>
            ))}
          </ul>
          {onResolveBlocker && status === "blocked" && (
            <button
              type="button"
              className="j-btn"
              data-active="true"
              disabled={resolving}
              style={{ marginTop: 8 }}
              onClick={() => onResolveBlocker(report.slug)}
            >
              {resolving ? "Resolving…" : "Resolve"}
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
                {r.status} · Phase {r.phase} · {r.started_at}
                {typeof r.cost_usd === "number" ? ` · $${r.cost_usd.toFixed(4)}` : ""}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <p className="j-title">Deliverables</p>
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
                    {a.exists ? "ready" : "missing"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {report.downward.length > 0 && (
        <section>
          <p className="j-title">Team</p>
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
