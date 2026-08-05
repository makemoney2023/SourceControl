import type { BlockedSeatDigest } from "../company-digest";

export function ThreatRail({
  blocked,
  selectedSlug,
  resolvingSlug,
  onSelect,
  onResolve,
  onAnswer,
}: {
  blocked: BlockedSeatDigest[];
  selectedSlug: string | null;
  resolvingSlug: string | null;
  onSelect: (slug: string) => void;
  onResolve: (slug: string) => void;
  /** Opens the narrative report questions form for needs_input seats. */
  onAnswer?: (slug: string) => void;
}) {
  const prioritized = blocked.toSorted((a, b) => {
    const rank = (status: string) => (status === "blocked" ? 0 : status === "needs_input" ? 1 : 2);
    return rank(a.status) - rank(b.status) ||
      Number(a.phase) - Number(b.phase) ||
      a.slug.localeCompare(b.slug);
  });
  return (
    <aside className="j-hud-panel j-hud-grid j-threat-rail" aria-label="Threat rail">
      <p className="j-title">Threats</p>
      {blocked.length === 0 ? (
        <p className="j-muted" style={{ margin: 0, fontSize: 12 }}>
          ALL CLEAR
        </p>
      ) : (
        prioritized.map((b, index) => {
          const selected = selectedSlug === b.slug;
          const resolving = resolvingSlug === b.slug;
          const headline = b.headline || b.reason;
          const extra = b.reasons.filter(
            (r) => r.trim().toLowerCase() !== headline.trim().toLowerCase(),
          );
          return (
            <div
              key={`${b.slug}-${b.handoffFilename}`}
              className={`j-threat-item${index === 0 ? " j-threat-pulse" : ""}`}
              data-selected={selected}
              role="group"
            >
              <button
                type="button"
                onClick={() => onSelect(b.slug)}
                style={{
                  all: "unset",
                  cursor: "pointer",
                  display: "block",
                  width: "100%",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <span className="j-mono" style={{ fontSize: 11, color: "var(--j-danger)" }}>
                    {b.title || b.slug}
                  </span>
                  <span className="j-chip" data-tone="danger">
                    P{b.phase}
                  </span>
                </div>
                <p style={{ margin: "6px 0 0", fontSize: 12, lineHeight: 1.35 }}>
                  {headline}
                </p>
                {extra.length > 0 && (
                  <ul
                    style={{
                      margin: "6px 0 0",
                      paddingLeft: 16,
                      fontSize: 11,
                      color: "var(--j-muted)",
                    }}
                  >
                    {extra.slice(0, 3).map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                )}
                <p className="j-muted" style={{ margin: "6px 0 0", fontSize: 10 }}>
                  {b.statusLabel || b.status}
                  {b.managerSlug ? ` · Owner ${b.managerSlug}` : ""}
                </p>
              </button>
              <button
                type="button"
                className="j-btn"
                data-active="true"
                disabled={resolving}
                style={{ marginTop: 8, width: "100%" }}
                onClick={() =>
                  b.status === "needs_input" && onAnswer
                    ? onAnswer(b.slug)
                    : onResolve(b.slug)
                }
              >
                {resolving
                  ? "Resolving…"
                  : b.status === "needs_input"
                    ? "ANSWER"
                    : "RESOLVE"}
              </button>
            </div>
          );
        })
      )}
    </aside>
  );
}
