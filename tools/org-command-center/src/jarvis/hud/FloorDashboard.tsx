import type { Snapshot } from "../../api/client";
import { seatWorkContext } from "../seat-work-context";
import { STATUS_COLOR } from "../status";

export function FloorDashboard({
  snapshot,
  selectedSlug,
  onSelect,
}: {
  snapshot: Snapshot;
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
}) {
  const byDept = new Map<string, typeof snapshot.org.roster>();
  for (const seat of snapshot.org.roster) {
    const list = byDept.get(seat.dept) ?? [];
    list.push(seat);
    byDept.set(seat.dept, list);
  }

  const phases = snapshot.tracker.phases.filter((p) =>
    ["⬜", "🔄", "✅"].includes(p.status),
  );

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section className="j-glass" style={{ padding: 14 }}>
        <p className="j-title">Phase board</p>
        <div style={{ marginTop: 10, overflowX: "auto" }}>
          <table className="j-table">
            <thead>
              <tr>
                <th>Phase</th>
                <th>Name</th>
                <th>Status</th>
                <th>Artifact</th>
              </tr>
            </thead>
            <tbody>
              {phases.map((p) => (
                <tr key={p.phase}>
                  <td>{p.phase}</td>
                  <td>{p.name}</td>
                  <td>
                    <span className="j-chip" data-tone={p.status === "✅" ? "ok" : p.status === "🔄" ? "warn" : undefined}>
                      {p.status}
                    </span>
                  </td>
                  <td className="j-mono">{p.artifact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="j-glass" style={{ padding: 14 }}>
        <p className="j-title">Workers</p>
        <p className="j-muted" style={{ marginTop: 4 }}>
          Click a row to inspect. Status comes from HANDOFFS (idle if none).
        </p>
        <div style={{ marginTop: 10, overflowX: "auto" }}>
          <table className="j-table">
            <thead>
              <tr>
                <th>Dept</th>
                <th>Role</th>
                <th>Slug</th>
                <th>Level</th>
                <th>Status</th>
                <th>Tier</th>
              </tr>
            </thead>
            <tbody>
              {[...byDept.entries()].flatMap(([dept, seats]) =>
                seats.map((seat) => {
                  const work = seatWorkContext(seat.slug, {
                    handoffs: snapshot.handoffs,
                    runs: snapshot.runs,
                    sessions: snapshot.sessions,
                    claimedFiles: snapshot.claimed,
                    queueFiles: snapshot.queue,
                    agentStates: snapshot.agentStates,
                  });
                  const selected = selectedSlug === seat.slug;
                  return (
                    <tr
                      key={seat.slug}
                      data-selected={selected}
                      onClick={() => onSelect(seat.slug)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{dept}</td>
                      <td>{seat.title}</td>
                      <td className="j-mono">{seat.slug}</td>
                      <td>{seat.level}</td>
                      <td>
                        <span
                          className="j-chip"
                          style={{ borderColor: STATUS_COLOR[work.status] }}
                        >
                          {work.status}
                          {work.phase ? ` · P${work.phase}` : ""}
                        </span>
                      </td>
                      <td className="j-mono">
                        {snapshot.handoffs.find((h) => h.position === seat.slug)
                          ?.llmTier || "—"}
                      </td>
                    </tr>
                  );
                }),
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
