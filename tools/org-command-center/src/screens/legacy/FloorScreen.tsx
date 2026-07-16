import type { Snapshot } from "../../api/client";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

function statusTone(status: string, kind: string, verdict: string) {
  if (kind === "csuite") {
    if (verdict === "approve") return "ok" as const;
    if (verdict === "revise" || verdict === "escalate") return "warn" as const;
    return "accent" as const;
  }
  if (status === "done") return "ok" as const;
  if (status === "blocked" || status === "needs_input") return "danger" as const;
  if (status) return "warn" as const;
  return "neutral" as const;
}

function workerLabel(status: string, kind: string, verdict: string) {
  if (kind === "csuite") return verdict ? `C-suite: ${verdict}` : "Awaiting C-suite";
  if (!status) return "idle";
  return status;
}

export function FloorScreen({ snapshot }: { snapshot: Snapshot }) {
  const byDept = new Map<string, typeof snapshot.org.roster>();
  for (const seat of snapshot.org.roster) {
    const list = byDept.get(seat.dept) ?? [];
    list.push(seat);
    byDept.set(seat.dept, list);
  }

  const handoffByPos = new Map(snapshot.handoffs.map((h) => [h.position || h.filename, h]));

  const phaseBoard = snapshot.tracker.phases.filter((p) =>
    ["⬜", "🔄", "✅"].includes(p.status),
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            Runbook — {snapshot.tracker.idea || "Untitled"} · current phase{" "}
            {snapshot.tracker.currentPhase}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {phaseBoard.map((p) => (
              <Badge
                key={p.phase}
                tone={
                  p.status === "✅" ? "ok" : p.status === "🔄" ? "warn" : "neutral"
                }
              >
                {p.phase} {p.name} {p.status}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {snapshot.handoffs.length === 0 && (
        <p className="text-sm text-[var(--color-muted)]">
          Floor is empty — no handoffs under {snapshot.businessIdeaRel}/HANDOFFS/ yet. Assign work and run
          the orchestrator to populate worker status.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[...byDept.entries()].map(([dept, seats]) => (
          <Card key={dept}>
            <CardHeader>
              <CardTitle className="capitalize">{dept}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {seats.map((seat) => {
                const h =
                  handoffByPos.get(seat.slug) ??
                  snapshot.handoffs.find((x) => x.position === seat.slug);
                const tone = statusTone(h?.status ?? "", h?.kind ?? "", h?.verdict ?? "");
                return (
                  <div
                    key={seat.slug}
                    className="rounded-md border border-[var(--color-line)] px-3 py-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-medium">{seat.title}</div>
                        <div className="font-mono text-[11px] text-[var(--color-muted)]">
                          {seat.slug}
                        </div>
                      </div>
                      <Badge tone={seat.level === "manager" ? "accent" : "neutral"}>
                        {seat.level}
                      </Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <Badge tone={tone}>
                        {workerLabel(h?.status ?? "", h?.kind ?? "ic", h?.verdict ?? "")}
                      </Badge>
                      {h?.llmTier && <Badge tone="neutral">{h.llmTier}</Badge>}
                      {h?.verdictForManager && (
                        <Badge tone="warn">{h.verdictForManager}</Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
