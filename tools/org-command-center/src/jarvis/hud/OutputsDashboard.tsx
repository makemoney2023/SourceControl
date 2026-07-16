import { useEffect, useState } from "react";
import { fetchFile, type SituationSnapshot } from "../../api/client";
import { stripBusinessIdeaPrefix } from "../../lib/project-paths";
import { indexArtifacts } from "../artifacts";

export function OutputsDashboard({
  snapshot,
  selectedPath,
  onSelect,
}: {
  snapshot: Pick<SituationSnapshot, "tracker" | "handoffs" | "businessIdeaRel">;
  selectedPath: string | null;
  onSelect: (path: string | null) => void;
}) {
  const items = indexArtifacts(
    snapshot.tracker.phases,
    snapshot.handoffs,
    snapshot.businessIdeaRel,
  );
  const [preview, setPreview] = useState("");
  const [entries, setEntries] = useState<
    { name: string; path: string; type: string }[] | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedPath) {
      setPreview("");
      setEntries(null);
      setError(null);
      return;
    }
    let cancelled = false;
    (async () => {
      setError(null);
      setPreview("");
      setEntries(null);
      try {
        const data = await fetchFile(selectedPath);
        if (cancelled) return;
        if (data.type === "dir") setEntries(data.entries ?? []);
        else setPreview(data.content ?? "");
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedPath]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(240px, 1fr) minmax(280px, 1.4fr)",
        gap: 12,
        minHeight: 0,
      }}
    >
      <section className="j-glass" style={{ padding: 14, overflow: "auto" }}>
        <p className="j-title">Artifacts</p>
        <p className="j-muted" style={{ marginTop: 4 }}>
          From tracker + handoffs
        </p>
        <ul style={{ listStyle: "none", margin: "12px 0 0", padding: 0 }}>
          {items.length === 0 && (
            <li className="j-muted">No artifacts indexed yet.</li>
          )}
          {items.map((item) => (
            <li key={item.path}>
              <button
                type="button"
                className="j-btn"
                data-active={selectedPath === item.path}
                onClick={() => onSelect(item.path)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  marginBottom: 6,
                  display: "block",
                }}
              >
                <div className="j-mono" style={{ fontSize: 11 }}>
                  {stripBusinessIdeaPrefix(item.path, snapshot.businessIdeaRel)}
                </div>
                <div className="j-muted" style={{ marginTop: 2 }}>
                  Phase {item.phase} · {item.status}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="j-glass" style={{ padding: 14, overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <p className="j-title">Preview</p>
          {selectedPath && (
            <button
              type="button"
              className="j-btn"
              onClick={() => navigator.clipboard.writeText(selectedPath)}
            >
              Copy path
            </button>
          )}
        </div>
        {!selectedPath && (
          <p className="j-muted" style={{ marginTop: 12 }}>
            Select an artifact from the list.
          </p>
        )}
        {error && <p className="j-error" style={{ marginTop: 12 }}>{error}</p>}
        {entries && (
          <ul style={{ margin: "12px 0 0", padding: 0, listStyle: "none" }}>
            {entries.map((e) => (
              <li key={e.path}>
                <button
                  type="button"
                  className="j-btn"
                  style={{ marginBottom: 6, width: "100%", textAlign: "left" }}
                  onClick={() => onSelect(e.path)}
                >
                  {e.type === "dir" ? "[dir] " : ""}
                  {e.name}
                </button>
              </li>
            ))}
          </ul>
        )}
        {preview && <pre className="j-pre" style={{ marginTop: 12 }}>{preview}</pre>}
      </section>
    </div>
  );
}
