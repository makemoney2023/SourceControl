import type { Snapshot } from "../../api/client";
import type { JarvisMode } from "../state/useJarvisStore";

export function ModeBar({
  mode,
  onMode,
  snapshot,
  loading,
  onRefresh,
  bloomEnabled,
  onToggleBloom,
}: {
  mode: JarvisMode;
  onMode: (m: JarvisMode) => void;
  snapshot: Snapshot | null;
  loading: boolean;
  onRefresh: () => void;
  bloomEnabled: boolean;
  onToggleBloom: () => void;
}) {
  const modes: { id: JarvisMode; label: string; key: string }[] = [
    { id: "floor", label: "Floor", key: "1" },
    { id: "assign", label: "Assign", key: "2" },
    { id: "outputs", label: "Outputs", key: "3" },
  ];

  return (
    <header
      className="j-glass"
      style={{
        position: "absolute",
        top: 16,
        left: 16,
        right: 16,
        zIndex: 20,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "12px 16px",
      }}
    >
      <div>
        <p className="j-title">Org Command Center</p>
        <h1 className="j-heading">Jarvis Theater</h1>
        <p className="j-muted" style={{ margin: "4px 0 0" }}>
          {snapshot?.tracker.idea || "Loading…"}
          {snapshot ? ` · Phase ${snapshot.tracker.currentPhase}` : ""}
        </p>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        {modes.map((m) => (
          <button
            key={m.id}
            type="button"
            className="j-btn"
            data-active={mode === m.id}
            onClick={() => onMode(m.id)}
            title={`Key ${m.key}`}
          >
            {m.label}
          </button>
        ))}
        <span className="j-chip">queue {snapshot?.queue.length ?? 0}</span>
        <button type="button" className="j-btn" onClick={onToggleBloom}>
          bloom {bloomEnabled ? "on" : "off"}
        </button>
        <button type="button" className="j-btn" onClick={onRefresh} disabled={loading}>
          Refresh
        </button>
      </div>
    </header>
  );
}
