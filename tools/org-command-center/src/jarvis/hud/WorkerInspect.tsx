import type { HandoffRecord, RosterEntry } from "../../lib/types";

export function WorkerInspect({
  seat,
  handoff,
  onClose,
}: {
  seat: RosterEntry;
  handoff?: HandoffRecord;
  onClose: () => void;
}) {
  return (
    <section className="j-glass" style={{ padding: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <div>
          <p className="j-title">Selected worker</p>
          <h2 className="j-heading" style={{ fontSize: 16 }}>
            {seat.title}
          </h2>
          <p className="j-mono j-muted">
            {seat.slug} · {seat.level} · {seat.dept}
          </p>
        </div>
        <button type="button" className="j-btn" onClick={onClose}>
          Clear
        </button>
      </div>
      {!handoff && (
        <p className="j-muted" style={{ marginTop: 12 }}>
          Idle — no handoff file yet.
        </p>
      )}
      {handoff && (
        <dl
          style={{
            margin: "12px 0 0",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 10,
            fontSize: 12,
          }}
        >
          <div>
            <dt className="j-muted">Status</dt>
            <dd style={{ margin: 0 }}>{handoff.status || "—"}</dd>
          </div>
          <div>
            <dt className="j-muted">llm_tier</dt>
            <dd style={{ margin: 0 }}>{handoff.llmTier || "—"}</dd>
          </div>
          <div>
            <dt className="j-muted">Verdict</dt>
            <dd style={{ margin: 0 }}>
              {handoff.verdictForManager || handoff.verdict || "—"}
            </dd>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <dt className="j-muted">Artifacts</dt>
            <dd style={{ margin: 0 }} className="j-mono">
              {handoff.artifacts.length === 0
                ? "—"
                : handoff.artifacts.map((a) => a.path).join(", ")}
            </dd>
          </div>
        </dl>
      )}
    </section>
  );
}
