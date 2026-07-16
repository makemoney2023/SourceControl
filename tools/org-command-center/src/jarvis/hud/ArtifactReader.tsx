import { useEffect, useState } from "react";
import { fetchFile } from "../../api/client";

export function ArtifactReader({
  path,
  onClose,
  onNavigate,
}: {
  path: string;
  onClose: () => void;
  onNavigate: (path: string) => void;
}) {
  const [preview, setPreview] = useState("");
  const [entries, setEntries] = useState<
    { name: string; path: string; type: string }[] | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setError(null);
      setPreview("");
      setEntries(null);
      try {
        const data = await fetchFile(path);
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
  }, [path]);

  return (
    <aside
      className="j-glass"
      style={{
        position: "absolute",
        top: 96,
        right: 16,
        width: "min(480px, calc(100vw - 32px))",
        zIndex: 20,
        padding: 14,
        maxHeight: "calc(100vh - 120px)",
        overflow: "auto",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <div>
          <p className="j-title">Output</p>
          <p
            className="j-muted"
            style={{ fontFamily: "IBM Plex Mono, monospace", marginTop: 4 }}
          >
            {path}
          </p>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            type="button"
            className="j-btn"
            onClick={() => navigator.clipboard.writeText(path)}
          >
            Copy path
          </button>
          <button type="button" className="j-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      {error && <p className="j-error" style={{ marginTop: 12 }}>{error}</p>}
      {entries && (
        <ul style={{ margin: "12px 0 0", padding: 0, listStyle: "none" }}>
          {entries.map((e) => (
            <li key={e.path}>
              <button
                type="button"
                className="j-btn"
                style={{ marginBottom: 6, width: "100%", textAlign: "left" }}
                onClick={() => onNavigate(e.path)}
              >
                {e.type === "dir" ? "[dir] " : ""}
                {e.name}
              </button>
            </li>
          ))}
        </ul>
      )}
      {preview && <pre className="j-pre" style={{ marginTop: 12 }}>{preview}</pre>}
    </aside>
  );
}
