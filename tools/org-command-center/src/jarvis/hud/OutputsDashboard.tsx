import { useEffect, useRef, useState } from "react";
import {
  fetchFile,
  fileRawUrl,
  fetchProductionScorecard,
  fetchReviewInbox,
  type ReviewInboxItem,
  type SituationSnapshot,
} from "../../api/client";
import { previewKindForPath } from "../../lib/file-preview";
import { stripBusinessIdeaPrefix } from "../../lib/project-paths";
import type { VentureProductionScorecard } from "../../lib/venture-production-scorecard";
import { indexProductionArtifacts } from "../artifacts";
import { SourcesPanel } from "./SourcesPanel";

type OutputsTab = "artifacts" | "sources";

function ProductionScorecardStrip() {
  const [card, setCard] = useState<VentureProductionScorecard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let cancelled = false;
    void fetchProductionScorecard()
      .then((c) => {
        if (!cancelled) {
          setCard(c);
          setError(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCard(null);
          setError(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);
  if (loading) return <section className="j-glass j-async-state"><span className="j-skeleton" /> Loading production scorecard…</section>;
  if (error || !card) {
    return (
      <section className="j-glass j-async-state j-error" role="alert">
        Production scorecard unavailable.{" "}
        <button
          type="button"
          className="j-btn"
          aria-label="Retry scorecard"
          onClick={() => {
            setLoading(true);
            setError(false);
            setAttempt((value) => value + 1);
          }}
        >
          Retry
        </button>
      </section>
    );
  }
  return (
    <section className="j-glass" style={{ padding: 14 }}>
      <p className="j-title">Production completeness — {card.venture}</p>
      <table style={{ width: "100%", marginTop: 8, fontSize: 12, borderCollapse: "collapse" }}>
        <thead>
          <tr className="j-muted">
            <th align="left">Phase</th>
            <th align="right">Craft</th>
            <th align="right">Design</th>
            <th align="right">Layer B</th>
            <th align="right">Verifier</th>
            <th align="right">Wire</th>
          </tr>
        </thead>
        <tbody>
          {card.phases.map((p) => (
            <tr key={p.phase}>
              <td>{p.phase}</td>
              <td align="right">{p.craft}%</td>
              <td align="right">{p.designBrief}%</td>
              <td align="right">{p.layerB}%</td>
              <td align="right">{p.verifierPass}%</td>
              <td align="right">{p.wireChecklist}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function PreviewColumn({
  selectedPath,
  onSelect,
}: {
  selectedPath: string | null;
  onSelect: (path: string | null) => void;
}) {
  const [preview, setPreview] = useState("");
  const [previewKind, setPreviewKind] = useState<string>("text");
  const [rawUrl, setRawUrl] = useState<string | null>(null);
  const [entries, setEntries] = useState<
    { name: string; path: string; type: string }[] | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const copySequence = useRef(0);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    copySequence.current += 1;
    setCopyStatus(null);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    if (!selectedPath) {
      setPreview("");
      setPreviewKind("text");
      setRawUrl(null);
      setEntries(null);
      setError(null);
      return;
    }
    let cancelled = false;
    (async () => {
      setError(null);
      setLoading(true);
      setPreview("");
      setEntries(null);
      setRawUrl(null);
      setPreviewKind(previewKindForPath(selectedPath));
      try {
        const data = await fetchFile(selectedPath);
        if (cancelled) return;
        if (data.type === "dir") {
          setEntries(data.entries ?? []);
          setPreviewKind("dir");
        } else {
          setPreviewKind(data.previewKind ?? previewKindForPath(selectedPath));
          setRawUrl(data.rawUrl ?? (data.binary ? fileRawUrl(selectedPath) : null));
          setPreview(data.content ?? "");
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedPath]);

  useEffect(() => () => {
    copySequence.current += 1;
    if (copyTimer.current) clearTimeout(copyTimer.current);
  }, []);

  return (
    <section className="j-glass" style={{ padding: 14, overflow: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
        <p className="j-title">Preview</p>
        <div style={{ display: "flex", gap: 6 }}>
          {selectedPath && rawUrl ? (
            <a className="j-btn" href={rawUrl} download target="_blank" rel="noreferrer">
              Download
            </a>
          ) : null}
          {selectedPath && (
            <button
              type="button"
              className="j-btn"
              onClick={async () => {
                const request = ++copySequence.current;
                try {
                  await navigator.clipboard.writeText(selectedPath);
                  if (request !== copySequence.current) return;
                  setCopyStatus("Path copied");
                } catch {
                  if (request !== copySequence.current) return;
                  setCopyStatus("Copy failed");
                }
                copyTimer.current = setTimeout(() => {
                  if (request === copySequence.current) setCopyStatus(null);
                }, 2000);
              }}
            >
              Copy path
            </button>
          )}
        </div>
      </div>
      {!selectedPath && (
        <p className="j-muted" style={{ marginTop: 12 }}>
          Select a production asset from the list.
        </p>
      )}
      {copyStatus && (
        <p
          className={copyStatus === "Copy failed" ? "j-error" : "j-muted"}
          role={copyStatus === "Copy failed" ? "alert" : "status"}
        >
          {copyStatus}
        </p>
      )}
      {loading && <p className="j-muted" role="status"><span className="j-skeleton" /> Loading preview…</p>}
      {error && <p className="j-error" role="alert" style={{ marginTop: 12 }}>{error}</p>}
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
      {!loading && !error && selectedPath && previewKind === "image" && rawUrl ? (
        <img
          src={rawUrl}
          alt={selectedPath}
          style={{ marginTop: 12, maxWidth: "100%", height: "auto", borderRadius: 4 }}
        />
      ) : null}
      {!loading && !error && selectedPath && previewKind === "video" && rawUrl ? (
        <video
          src={rawUrl}
          controls
          style={{ marginTop: 12, maxWidth: "100%", borderRadius: 4 }}
        />
      ) : null}
      {!loading && !error && selectedPath && previewKind === "pdf" && rawUrl ? (
        <iframe
          title={selectedPath}
          src={rawUrl}
          style={{
            marginTop: 12,
            width: "100%",
            minHeight: 480,
            border: "1px solid var(--j-border, #333)",
            borderRadius: 4,
          }}
        />
      ) : null}
      {!loading &&
        !error &&
        selectedPath &&
        (previewKind === "docx" || previewKind === "xlsx" || previewKind === "download") && (
          <div style={{ marginTop: 12 }}>
            <p className="j-muted">
              {previewKind === "docx"
                ? "Word document"
                : previewKind === "xlsx"
                  ? "Spreadsheet"
                  : "Binary asset"}
              {rawUrl ? " — use Download to open externally." : ""}
            </p>
            {preview ? (
              <pre className="j-pre" style={{ marginTop: 8 }}>
                {preview}
              </pre>
            ) : null}
          </div>
        )}
      {!loading && !error && preview && previewKind === "text" ? (
        <pre className="j-pre" style={{ marginTop: 12 }}>
          {preview}
        </pre>
      ) : null}
    </section>
  );
}

type ArtifactFilter = "all" | "review" | "with_seat";

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
  const [filter, setFilter] = useState<ArtifactFilter>("all");
  const items = indexProductionArtifacts(
    snapshot.tracker.phases,
    snapshot.handoffs,
    snapshot.businessIdeaRel,
  );
  const [inbox, setInbox] = useState<ReviewInboxItem[]>([]);
  const [inboxLoading, setInboxLoading] = useState(true);
  const [inboxError, setInboxError] = useState<string | null>(null);
  const [inboxAttempt, setInboxAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setInboxLoading(true);
    setInboxError(null);
    void fetchReviewInbox()
      .then((r) => {
        if (!cancelled) {
          setInbox([...new Map(r.items.map((item) => [item.path, item])).values()]);
          setInboxError(null);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setInboxError(error instanceof Error ? error.message : String(error));
        }
      })
      .finally(() => {
        if (!cancelled) setInboxLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [snapshot.tracker, snapshot.handoffs, inboxAttempt]);

  const pendingInbox = inbox.filter(
    (item) => (item.status || "pending_review") === "pending_review",
  );
  const reviewPaths = new Set(pendingInbox.map((i) => i.path));
  const visibleItems = items.filter((item) => {
    if (filter === "review") return reviewPaths.has(item.path);
    if (filter === "with_seat") return Boolean(item.seat);
    return true;
  });
  const withSeat = items.filter((i) => i.seat).length;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        minHeight: 0,
      }}
    >
      <ProductionScorecardStrip />
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
        className="j-output-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(240px, 1fr) minmax(280px, 1.4fr)",
          gap: 12,
          minHeight: 0,
        }}
      >
        {tab === "artifacts" ? (
          <section className="j-hud-panel j-hud-grid" style={{ padding: 14, overflow: "auto" }}>
            <p className="j-title">Production assets</p>
            <p className="j-muted" style={{ marginTop: 4 }}>
              {items.length} shippable · {withSeat} with seat · {pendingInbox.length} pending review
              (briefs stay in Report)
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
              {(
                [
                  ["all", "All"],
                  ["review", "Pending review"],
                  ["with_seat", "By seat"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className="j-btn"
                  data-active={filter === id}
                  onClick={() => setFilter(id)}
                >
                  {label}
                </button>
              ))}
            </div>

            <p className="j-title" style={{ marginTop: 16 }}>
              Needs review
            </p>
            <ul style={{ listStyle: "none", margin: "10px 0 0", padding: 0 }}>
              {inboxLoading && (
                <li className="j-muted" role="status">
                  <span className="j-skeleton" /> Loading review inbox…
                </li>
              )}
              {inboxError && !inboxLoading && (
                <li
                  className="j-error"
                  role="alert"
                  aria-label="Review inbox error"
                >
                  {inboxError}{" "}
                  <button
                    type="button"
                    className="j-btn"
                    aria-label="Retry review inbox"
                    onClick={() => setInboxAttempt((value) => value + 1)}
                  >
                    Retry
                  </button>
                </li>
              )}
              {!inboxLoading && !inboxError && pendingInbox.length === 0 && (
                <li className="j-muted">Inbox clear — nothing pending review.</li>
              )}
              {pendingInbox.map((item) => (
                <li key={item.path} style={{ marginBottom: 6 }}>
                  <button
                    type="button"
                    className="j-holo-tile"
                    data-tone="warn"
                    data-selected={selectedPath === item.path}
                    onClick={() => onSelect(item.path)}
                  >
                    <span className="j-mono" style={{ fontSize: 11 }}>
                      {stripBusinessIdeaPrefix(item.path, snapshot.businessIdeaRel)}
                    </span>
                    <span className="j-muted" style={{ fontSize: 10 }}>
                      {item.position ?? "?"} · {item.status}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <p className="j-title" style={{ marginTop: 20 }}>
              Production artifacts
            </p>
            <ul style={{ listStyle: "none", margin: "10px 0 0", padding: 0 }}>
              {visibleItems.length === 0 && (
                <li className="j-muted">No artifacts match this filter.</li>
              )}
              {visibleItems.map((item) => {
                const pending = reviewPaths.has(item.path);
                return (
                  <li key={item.path} style={{ marginBottom: 6 }}>
                    <button
                      type="button"
                      className="j-holo-tile"
                      data-tone={pending ? "warn" : item.seat ? "ok" : undefined}
                      data-selected={selectedPath === item.path}
                      onClick={() => onSelect(item.path)}
                    >
                      <span className="j-mono" style={{ fontSize: 11 }}>
                        {stripBusinessIdeaPrefix(item.path, snapshot.businessIdeaRel)}
                      </span>
                      <span className="j-muted" style={{ fontSize: 10 }}>
                        P{item.phase}
                        {item.seat ? ` · ${item.seat}` : ""}
                        {" · "}
                        {pending ? "pending_review" : item.status}
                        {item.notes ? ` · ${item.notes}` : ""}
                      </span>
                    </button>
                  </li>
                );
              })}
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
