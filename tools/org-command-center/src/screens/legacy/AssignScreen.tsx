import { useMemo, useState, type FormEvent } from "react";
import type { Snapshot } from "../../api/client";
import { assignWork } from "../../api/client";
import {
  managerHandoffPath,
  resolveArtifactPath,
} from "../../lib/project-paths";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";

const CREATIVE = new Set(["11", "12", "15", "19"]);

export function AssignScreen({
  snapshot,
  onDone,
}: {
  snapshot: Snapshot;
  onDone: () => void;
}) {
  const assignable = snapshot.tracker.phases.filter(
    (p) => p.status === "⬜" || p.status === "🔄",
  );
  const [phase, setPhase] = useState(assignable[0]?.phase ?? snapshot.tracker.currentPhase);
  const owner = snapshot.org.phaseOwners.find((p) => p.phase === phase);
  const model = owner ? snapshot.models[owner.managerOwner] : undefined;

  const [goal, setGoal] = useState(
    owner
      ? `Produce Phase ${phase} via delegates; merge; write manager brief`
      : "",
  );
  const [inputs, setInputs] = useState("");
  const [outputs, setOutputs] = useState(owner ? (snapshot.tracker.phases.find((p) => p.phase === phase)?.artifact ?? "") : "");
  const [generationProfile, setGenerationProfile] = useState(
    model?.generationProfile ?? "none",
  );
  const [budget, setBudget] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ path: string; prompt: string } | null>(null);

  const defaults = useMemo(() => {
    if (!owner) return null;
    return {
      position: owner.managerOwner,
      llm_tier: model?.llmTier ?? "",
      llm_model: model?.llmModel ?? "",
      maySpawn: owner.maySpawn,
      reviewer: owner.csuiteReviewer,
    };
  }, [owner, model]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!defaults) return;
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const prefix = snapshot.businessIdeaRel;
      const artifactPaths = outputs
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((p) => resolveArtifactPath(p, prefix));
      const result = await assignWork({
        phase,
        position: defaults.position,
        goal,
        llm_tier: defaults.llm_tier,
        llm_model: defaults.llm_model,
        generation_profile: CREATIVE.has(phase) ? generationProfile : generationProfile || "none",
        inputs: inputs
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        outputs: artifactPaths,
        write_lease: [
          ...artifactPaths,
          managerHandoffPath(prefix, phase, defaults.position),
        ],
        budget_usd: budget ? Number(budget) : null,
        collaborators: [],
      });
      setSuccess({ path: result.path, prompt: result.orchestratorPrompt });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <CardHeader>
          <CardTitle>Assign work (manager packet)</CardTitle>
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            Orchestrator fan-out only — IC seats are not selectable here.
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Phase</span>
              <select
                className="flex h-10 w-full rounded-md border border-[var(--color-line)] bg-[var(--color-surface)] px-3 text-sm"
                value={phase}
                onChange={(e) => {
                  const p = e.target.value;
                  setPhase(p);
                  const o = snapshot.org.phaseOwners.find((x) => x.phase === p);
                  const art = snapshot.tracker.phases.find((x) => x.phase === p)?.artifact ?? "";
                  setGoal(
                    o
                      ? `Produce Phase ${p} via delegates; merge; write manager brief`
                      : "",
                  );
                  setOutputs(art);
                  const m = o ? snapshot.models[o.managerOwner] : undefined;
                  setGenerationProfile(m?.generationProfile ?? "none");
                }}
              >
                {assignable.map((p) => (
                  <option key={p.phase} value={p.phase}>
                    {p.phase} — {p.name} ({p.status})
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1 text-sm">
                <span className="font-medium">Manager owner</span>
                <div className="rounded-md border border-[var(--color-line)] bg-[var(--color-bg)] px-3 py-2 font-mono text-xs">
                  {defaults?.position ?? "—"}
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <span className="font-medium">llm_tier / model</span>
                <div className="rounded-md border border-[var(--color-line)] bg-[var(--color-bg)] px-3 py-2 font-mono text-xs">
                  {defaults?.llm_tier ?? "—"} · {defaults?.llm_model ?? "—"}
                </div>
              </div>
            </div>

            <label className="block space-y-1 text-sm">
              <span className="font-medium">Goal</span>
              <Textarea value={goal} onChange={(e) => setGoal(e.target.value)} required />
            </label>

            <label className="block space-y-1 text-sm">
              <span className="font-medium">Inputs (one path per line)</span>
              <Textarea
                value={inputs}
                onChange={(e) => setInputs(e.target.value)}
                placeholder={`${snapshot.businessIdeaRel}/01-problem-framing.md`}
              />
            </label>

            <label className="block space-y-1 text-sm">
              <span className="font-medium">Outputs / write lease artifacts</span>
              <Input
                value={outputs}
                onChange={(e) => setOutputs(e.target.value)}
                placeholder="02-evidence-base.md, 02-market-research.md"
              />
            </label>

            {CREATIVE.has(phase) && (
              <label className="block space-y-1 text-sm">
                <span className="font-medium">generation_profile (required)</span>
                <select
                  className="flex h-10 w-full rounded-md border border-[var(--color-line)] bg-[var(--color-surface)] px-3 text-sm"
                  value={generationProfile}
                  onChange={(e) => setGenerationProfile(e.target.value)}
                >
                  <option value="none">none (skip with reason in constraints)</option>
                  <option value="brand-stills">brand-stills</option>
                  <option value="hero-video">hero-video</option>
                  <option value="ad-creative">ad-creative</option>
                </select>
              </label>
            )}

            <label className="block space-y-1 text-sm">
              <span className="font-medium">budget_usd (optional)</span>
              <Input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="null"
              />
            </label>

            {error && (
              <p className="rounded-md border border-[#f0b4b4] bg-[#fde8e8] px-3 py-2 text-sm text-[var(--color-danger)]">
                {error}
              </p>
            )}
            {success && (
              <div className="space-y-2 rounded-md border border-[#b7dfc4] bg-[#e6f4ea] px-3 py-2 text-sm">
                <p className="font-medium text-[var(--color-ok)]">Queued for orchestrator</p>
                <p className="font-mono text-xs">{success.path}</p>
                <p className="text-xs text-[var(--color-muted)]">{success.prompt}</p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => navigator.clipboard.writeText(success.prompt)}
                >
                  Copy orchestrator prompt
                </Button>
              </div>
            )}

            <Button type="submit" disabled={busy || !defaults}>
              {busy ? "Queuing…" : "Queue manager dispatch"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Delegates preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(defaults?.maySpawn ?? []).length === 0 && (
              <p className="text-sm text-[var(--color-muted)]">No IC delegates for this phase.</p>
            )}
            {(defaults?.maySpawn ?? []).map((slug) => (
              <div
                key={slug}
                className="flex items-center justify-between rounded-md border border-[var(--color-line)] px-3 py-2 text-sm"
              >
                <span className="font-mono text-xs">{slug}</span>
                <Badge tone="neutral">IC</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Dispatch queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {snapshot.queue.length === 0 && (
              <p className="text-sm text-[var(--color-muted)]">Queue empty.</p>
            )}
            {snapshot.queue.map((f) => (
              <div key={f} className="font-mono text-xs text-[var(--color-muted)]">
                {f}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
