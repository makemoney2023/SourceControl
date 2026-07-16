import type { Snapshot } from "../../api/client";
import { seatStatus } from "../status";

export function KpiStrip({ snapshot }: { snapshot: Snapshot }) {
  const phases = snapshot.tracker.phases;
  const inProgress = phases.filter((p) => p.status === "🔄").length;
  const pending = phases.filter((p) => p.status === "⬜").length;
  const done = phases.filter((p) => p.status === "✅").length;
  const blocked = snapshot.org.roster.filter((r) => {
    const s = seatStatus(r.slug, snapshot.handoffs).status;
    return s === "blocked" || s === "escalate";
  }).length;
  const activeWorkers = snapshot.handoffs.filter(
    (h) => h.status && h.status !== "done" && h.kind !== "csuite",
  ).length;

  const items = [
    { label: "Current phase", value: snapshot.tracker.currentPhase },
    { label: "In progress", value: String(inProgress) },
    { label: "Pending", value: String(pending) },
    { label: "Done", value: String(done) },
    { label: "Active handoffs", value: String(activeWorkers) },
    { label: "Blocked", value: String(blocked), warn: blocked > 0 },
    { label: "Dispatch queue", value: String(snapshot.queue.length) },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
        gap: 8,
      }}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="j-glass"
          style={{ padding: "10px 12px" }}
        >
          <div className="j-muted" style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            {item.label}
          </div>
          <div
            style={{
              marginTop: 4,
              fontSize: 22,
              fontWeight: 600,
              color: item.warn ? "var(--j-warn)" : "var(--j-ink)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}
