import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import {
  deleteSource,
  fetchSources,
  saveContextNote,
  uploadSources,
  type SourceRecord,
} from "../../api/client";

const STATUS_LABEL: Record<SourceRecord["status"], string> = {
  ok: "ok",
  extract_failed: "extract failed",
  image_stub: "image stub",
};

function sourcePreviewPath(record: SourceRecord): string {
  return record.extractRel === "self" ? record.originalRel : record.extractRel;
}

function StatusChip({ status }: { status: SourceRecord["status"] }) {
  const tone =
    status === "ok"
      ? "var(--j-ok)"
      : status === "image_stub"
        ? "var(--j-warn)"
        : "var(--j-danger)";

  return (
    <span
      className="j-mono"
      style={{
        fontSize: 10,
        padding: "2px 6px",
        borderRadius: 4,
        border: `1px solid ${tone}`,
        color: tone,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function SourcesPanel({
  onSelectPath,
  selectedPath,
}: {
  onSelectPath: (path: string | null) => void;
  selectedPath: string | null;
}) {
  const [sources, setSources] = useState<SourceRecord[]>([]);
  const [contextNote, setContextNote] = useState("");
  const [savedNote, setSavedNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSources();
      setSources(data.sources);
      setContextNote(data.contextNote);
      setSavedNote(data.contextNote);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const handleSaveNote = async () => {
    setSaving(true);
    setError(null);
    try {
      const data = await saveContextNote(contextNote);
      setSavedNote(data.contextNote);
      setContextNote(data.contextNote);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (files: FileList | File[] | null) => {
    if (!files) return;
    const list = Array.isArray(files) ? files : Array.from(files);
    if (list.length === 0) return;
    setUploading(true);
    setError(null);
    setWarnings([]);
    try {
      const result = await uploadSources(list);
      setSources(result.sources);
      if (result.warnings?.length) setWarnings(result.warnings);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError(null);
    try {
      await deleteSource(id);
      const deleted = sources.find((s) => s.id === id);
      if (deleted && selectedPath === sourcePreviewPath(deleted)) {
        onSelectPath(null);
      }
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setDeletingId(null);
    }
  };

  const noteDirty = contextNote !== savedNote;

  return (
    <section className="j-glass" style={{ padding: 14, overflow: "auto" }}>
      <p className="j-title">Venture context</p>
      <p className="j-muted" style={{ marginTop: 4 }}>
        Freeform note merged into agent must_read packets
      </p>
      <Textarea
        className="j-textarea"
        value={contextNote}
        onChange={(e) => setContextNote(e.target.value)}
        placeholder="Market, constraints, tone, must-know facts…"
        style={{ marginTop: 10 }}
      />
      <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
        <Button
          type="button"
          className="j-btn"
          data-active={noteDirty ? "true" : undefined}
          disabled={saving || !noteDirty}
          onClick={() => void handleSaveNote()}
        >
          {saving ? "Saving…" : "Save note"}
        </Button>
        {noteDirty && <span className="j-muted">Unsaved changes</span>}
      </div>

      <p className="j-title" style={{ marginTop: 20 }}>
        Upload sources
      </p>
      <p className="j-muted" style={{ marginTop: 4 }}>
        md, txt, csv, pdf, docx, png, jpg, webp — max 20 MB each
      </p>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void handleUpload(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        style={{
          marginTop: 10,
          padding: 16,
          borderRadius: 8,
          border: `1px dashed ${dragOver ? "var(--j-accent)" : "var(--j-panel-border)"}`,
          background: dragOver ? "rgba(63, 212, 190, 0.08)" : "rgba(0,0,0,0.2)",
          textAlign: "center",
          cursor: uploading ? "wait" : "pointer",
        }}
      >
        <p className="j-muted" style={{ margin: 0 }}>
          {uploading ? "Uploading…" : "Drop files here or click to browse"}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".md,.txt,.csv,.pdf,.docx,.png,.jpg,.jpeg,.webp"
          style={{ display: "none" }}
          onChange={(e) => void handleUpload(e.target.files)}
        />
      </div>

      {warnings.length > 0 && (
        <ul style={{ margin: "10px 0 0", paddingLeft: 18 }}>
          {warnings.map((w) => (
            <li key={w} className="j-muted" style={{ color: "var(--j-warn)" }}>
              {w}
            </li>
          ))}
        </ul>
      )}

      <p className="j-title" style={{ marginTop: 20 }}>
        Sources
      </p>
      {loading && <p className="j-muted" style={{ marginTop: 8 }}>Loading…</p>}
      {!loading && sources.length === 0 && (
        <p className="j-muted" style={{ marginTop: 8 }}>
          No sources uploaded yet.
        </p>
      )}
      <ul style={{ listStyle: "none", margin: "12px 0 0", padding: 0 }}>
        {sources.map((record) => {
          const path = sourcePreviewPath(record);
          return (
            <li key={record.id} style={{ marginBottom: 6 }}>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "stretch",
                }}
              >
                <button
                  type="button"
                  className="j-btn"
                  data-active={selectedPath === path}
                  onClick={() => onSelectPath(path)}
                  style={{
                    flex: 1,
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <span>{record.title}</span>
                    <StatusChip status={record.status} />
                  </div>
                  <span className="j-mono j-muted" style={{ fontSize: 10 }}>
                    .{record.ext} · {new Date(record.uploadedAt).toLocaleString()}
                  </span>
                </button>
                <button
                  type="button"
                  className="j-btn"
                  disabled={deletingId === record.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    void handleDelete(record.id);
                  }}
                  style={{ color: "var(--j-danger)", flexShrink: 0 }}
                >
                  {deletingId === record.id ? "…" : "Delete"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {error && (
        <p className="j-error" style={{ marginTop: 12 }}>
          {error}
        </p>
      )}
    </section>
  );
}
