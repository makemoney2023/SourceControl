import { useEffect, useMemo, useState } from "react";
import type { Snapshot } from "../../api/client";
import { fetchFile } from "../../api/client";
import { resolveArtifactPath, stripBusinessIdeaPrefix } from "../../lib/project-paths";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

function normalizeArtifact(artifact: string, businessIdeaRel: string): string[] {
  if (!artifact || artifact === "—") return [];
  return artifact
    .split("+")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((p) => resolveArtifactPath(p, businessIdeaRel));
}

export function OutputsScreen({ snapshot }: { snapshot: Snapshot }) {
  const prefix = snapshot.businessIdeaRel;
  const fromTracker = snapshot.tracker.phases.flatMap((p) =>
    normalizeArtifact(p.artifact, prefix).map((path) => ({
      path,
      phase: p.phase,
      source: "tracker" as const,
      status: p.status,
    })),
  );
  const fromHandoffs = snapshot.handoffs.flatMap((h) =>
    h.artifacts.map((a) => ({
      path: a.path,
      phase: h.phase,
      source: "handoff" as const,
      status: h.status,
      notes: a.notes,
    })),
  );

  const items = useMemo(() => {
    type Item = {
      path: string;
      phase: string;
      source: "tracker" | "handoff";
      status: string;
      notes?: string;
    };
    const map = new Map<string, Item>();
    for (const item of [...fromTracker, ...fromHandoffs] as Item[]) {
      if (!map.has(item.path)) map.set(item.path, item);
    }
    return [...map.values()].sort((a, b) => a.path.localeCompare(b.path));
  }, [fromTracker, fromHandoffs]);

  const [selected, setSelected] = useState<string | null>(items[0]?.path ?? null);
  const [preview, setPreview] = useState<string>("");
  const [dirEntries, setDirEntries] = useState<
    { name: string; path: string; type: string }[] | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selected) return;
    let cancelled = false;
    (async () => {
      setError(null);
      setPreview("");
      setDirEntries(null);
      try {
        const data = await fetchFile(selected);
        if (cancelled) return;
        if (data.type === "dir") {
          setDirEntries(data.entries ?? []);
        } else {
          setPreview(data.content ?? "");
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selected]);

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <Card className="max-h-[70vh] overflow-auto">
        <CardHeader>
          <CardTitle>Artifacts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {items.length === 0 && (
            <p className="text-sm text-[var(--color-muted)]">No artifacts indexed yet.</p>
          )}
          {items.map((item) => (
            <button
              key={item.path}
              type="button"
              onClick={() => setSelected(item.path)}
              className={`w-full rounded-md border px-3 py-2 text-left text-xs transition-colors ${
                selected === item.path
                  ? "border-[var(--color-accent)] bg-[#e3f5f1]"
                  : "border-[var(--color-line)] hover:bg-[var(--color-bg)]"
              }`}
            >
              <div className="font-mono">{stripBusinessIdeaPrefix(item.path, prefix)}</div>
              <div className="mt-1 flex gap-1">
                <Badge tone="neutral">P{item.phase}</Badge>
                <Badge tone={item.status === "✅" ? "ok" : "neutral"}>{item.status}</Badge>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      <Card className="min-h-[70vh]">
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle className="font-mono text-xs font-normal">{selected ?? "Select an artifact"}</CardTitle>
          {selected && (
            <Button
              size="sm"
              variant="outline"
              type="button"
              onClick={() => navigator.clipboard.writeText(selected)}
            >
              Copy path
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {error && (
            <p className="text-sm text-[var(--color-danger)]">{error}</p>
          )}
          {dirEntries && (
            <ul className="space-y-1 text-sm">
              {dirEntries.map((e) => (
                <li key={e.path}>
                  <button
                    type="button"
                    className="font-mono text-xs text-[var(--color-accent)] underline"
                    onClick={() => setSelected(e.path)}
                  >
                    {e.type === "dir" ? "[dir] " : ""}
                    {e.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {preview && (
            <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-md border border-[var(--color-line)] bg-[var(--color-bg)] p-3 font-mono text-xs leading-relaxed">
              {preview}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
