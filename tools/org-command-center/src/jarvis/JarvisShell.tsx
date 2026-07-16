import { useCallback, useEffect, useRef, useState } from "react";
import { fetchSnapshot, type Snapshot } from "../api/client";
import { AssignPanel } from "./hud/AssignPanel";
import { FloorDashboard } from "./hud/FloorDashboard";
import { KpiStrip } from "./hud/KpiStrip";
import { OutputsDashboard } from "./hud/OutputsDashboard";
import { WorkerInspect } from "./hud/WorkerInspect";
import "./hud/theme.css";
import { OrgTheater } from "./scene/OrgTheater";
import { seatStatus } from "./status";
import { useJarvisStore, type JarvisMode } from "./state/useJarvisStore";

const NAV: { id: JarvisMode; label: string; hint: string }[] = [
  { id: "floor", label: "Floor", hint: "Phases & workers" },
  { id: "assign", label: "Assign", hint: "Queue manager work" },
  { id: "outputs", label: "Outputs", hint: "Browse artifacts" },
];

export function JarvisShell() {
  const store = useJarvisStore();
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(true);
  const seededPhase = useRef(false);
  const selectPhase = store.selectPhase;

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const snap = await fetchSnapshot();
      setSnapshot(snap);
      if (!seededPhase.current) {
        const assignable = snap.tracker.phases.find(
          (p) => p.status === "⬜" || p.status === "🔄",
        );
        selectPhase(assignable?.phase ?? snap.tracker.currentPhase);
        seededPhase.current = true;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [selectPhase]);

  useEffect(() => {
    void reload();
    const id = setInterval(() => void reload(), 8000);
    return () => clearInterval(id);
  }, [reload]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === "1") store.setMode("floor");
      if (e.key === "2") store.setMode("assign");
      if (e.key === "3") store.setMode("outputs");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [store]);

  const selectedSeat = snapshot?.org.roster.find((r) => r.slug === store.selectedSlug);
  const selectedHandoff = selectedSeat
    ? seatStatus(selectedSeat.slug, snapshot?.handoffs ?? []).handoff
    : undefined;

  return (
    <div data-theme="jarvis" className="j-shell">
      <header
        className="j-glass"
        style={{
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
          <h1 className="j-heading" style={{ fontSize: 20 }}>
            {snapshot?.tracker.idea || "Loading…"}
          </h1>
          <p className="j-muted" style={{ margin: "4px 0 0" }}>
            Dashboard · keys 1 / 2 / 3 switch views
          </p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button
            type="button"
            className="j-btn"
            data-active={showMap}
            onClick={() => setShowMap((v) => !v)}
          >
            Org map {showMap ? "on" : "off"}
          </button>
          <button type="button" className="j-btn" onClick={() => void reload()} disabled={loading}>
            Refresh
          </button>
        </div>
      </header>

      {snapshot && <KpiStrip snapshot={snapshot} />}

      {error && (
        <p className="j-glass j-error" style={{ padding: 12, margin: 0 }}>
          {error}
        </p>
      )}

      <div
        className="j-main"
        style={
          showMap
            ? undefined
            : { gridTemplateColumns: "200px minmax(0, 1fr)" }
        }
      >
        <nav className="j-glass j-nav">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className="j-btn"
              data-active={store.mode === item.id}
              onClick={() => store.setMode(item.id)}
              style={{ textAlign: "left" }}
            >
              <div style={{ fontWeight: 600 }}>{item.label}</div>
              <div className="j-muted" style={{ marginTop: 2 }}>
                {item.hint}
              </div>
            </button>
          ))}
          {snapshot && (
            <div style={{ marginTop: "auto", paddingTop: 12 }}>
              <p className="j-muted">Queue</p>
              {snapshot.queue.length === 0 ? (
                <p className="j-muted" style={{ marginTop: 4 }}>
                  Empty
                </p>
              ) : (
                snapshot.queue.map((f) => (
                  <p key={f} className="j-mono" style={{ margin: "4px 0", wordBreak: "break-all" }}>
                    {f}
                  </p>
                ))
              )}
            </div>
          )}
        </nav>

        <main className="j-panel-scroll">
          {!snapshot && loading && (
            <p className="j-muted">Loading dashboard…</p>
          )}

          {snapshot && store.mode === "floor" && (
            <div style={{ display: "grid", gap: 12 }}>
              <FloorDashboard
                snapshot={snapshot}
                selectedSlug={store.selectedSlug}
                onSelect={store.selectSlug}
              />
              {selectedSeat && (
                <WorkerInspect
                  seat={selectedSeat}
                  handoff={selectedHandoff}
                  onClose={() => store.selectSlug(null)}
                />
              )}
            </div>
          )}

          {snapshot && store.mode === "assign" && store.selectedPhase && (
            <AssignPanel
              snapshot={snapshot}
              phase={store.selectedPhase}
              onPhaseChange={store.selectPhase}
              onQueued={() => void reload()}
              onBeam={(slug) => {
                store.selectSlug(slug);
                store.setBeam(true);
              }}
            />
          )}

          {snapshot && store.mode === "outputs" && (
            <OutputsDashboard
              snapshot={snapshot}
              selectedPath={store.selectedArtifact}
              onSelect={store.selectArtifact}
            />
          )}
        </main>

        {snapshot && showMap && (
          <aside className="j-glass j-map">
            <div
              style={{
                position: "absolute",
                top: 10,
                left: 12,
                zIndex: 2,
                pointerEvents: "none",
              }}
            >
              <p className="j-title">Org map</p>
              <p className="j-muted">Optional overview — use the tables to work</p>
            </div>
            <OrgTheater snapshot={snapshot} />
          </aside>
        )}
      </div>
    </div>
  );
}
