import { useEffect, useState } from "react";
import {
  fetchFile,
  fetchReviewInbox,
  type ReviewInboxItem,
  type SituationSnapshot,
} from "../../api/client";
import { stripBusinessIdeaPrefix } from "../../lib/project-paths";
import { indexArtifacts } from "../artifacts";
import { SourcesPanel } from "./SourcesPanel";

type OutputsTab = "artifacts" | "sources";

function PreviewColumn({
  selectedPath,
  onSelect,
}: {
  selectedPath: string | null;
  onSelect: (path: string | null) => void;
}) {
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
          Select an item from the list.
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
  );
}

export function OutputsDashboard({
  snapshot,
  selectedPath,
  onSelect,
}: {
  snapshot: Pick<SituationSnapshot, "tracker" | "handoffs" | "businessIdeaRel">;
  selectedPath: string | null;
  onSelect: (path: string | null) => void;
}) {
  const [tab, setTab] = useState<OutputsTab>("artifacts");
  const items = indexArtifacts(
    snapshot.tracker.phases,
    snapshot.handoffs,
    snapshot.businessIdeaRel,
  );
  const [inbox, setInbox] = useState<ReviewInboxItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    void fetchReviewInbox()
      .then((r) => {
        if (!cancelled) setInbox(r.items);
      })
      .catch(() => {
        if (!cancelled) setInbox([]);
      });
    return () => {
      cancelled = true;
    };
  }, [snapshot.tracker, snapshot.handoffs]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        minHeight: 0,
      }}
    >
      <div
        className="j-glass"
        style={{ display: "inline-flex", gap: 8, padding: 8, alignSelf: "flex-start" }}
      >
        <button
          type="button"
          className="j-btn"
          data-active={tab === "artifacts"}
          onClick={() => setTab("artifacts")}
        >
          Artifacts
        </button>
        <button
          type="button"
          className="j-btn"
          data-active={tab === "sources"}
          onClick={() => setTab("sources")}
        >
          Sources
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(240px, 1fr) minmax(280px, 1.4fr)",
          gap: 12,
          minHeight: 0,
        }}
      >
        {tab === "artifacts" ? (
          <section className="j-glass" style={{ padding: 14, overflow: "auto" }}>
            <p className="j-title">Needs review</p>
            <p className="j-muted" style={{ marginTop: 4 }}>
              REVIEW/inbox — voice-spawned deliverables
            </p>
            <ul style={{ listStyle: "none", margin: "12px 0 0", padding: 0 }}>
              {inbox.length === 0 && <li className="j-muted">Inbox empty.</li>}
              {inbox.map((item) => (
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
                      {item.position ?? "?"} · {item.status}
                    </div>
                  </button>
                </li>
              ))}
            </ul>

            <p className="j-title" style={{ marginTop: 20 }}>
              Artifacts
            </p>
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
        ) : (
          <SourcesPanel onSelectPath={onSelect} selectedPath={selectedPath} />
        )}

        <PreviewColumn selectedPath={selectedPath} onSelect={onSelect} />
      </div>
    </div>
  );
}
