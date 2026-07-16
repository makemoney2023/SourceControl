import { useEffect, useMemo, useState, type FormEvent } from "react";
import { assignWork, type Snapshot } from "../../api/client";
import type { ManagerPacketInput } from "../../lib/types";
import { buildAssignPayload } from "../assignPayload";

const CREATIVE = new Set(["11", "12", "15", "19"]);

export function AssignPanel({
  snapshot,
  phase,
  onPhaseChange,
  onQueued,
  onBeam,
}: {
  snapshot: Snapshot;
  phase: string;
  onPhaseChange: (phase: string) => void;
  onQueued: () => void;
  onBeam: (managerSlug: string) => void;
}) {
  const assignable = snapshot.tracker.phases.filter(
    (p) => p.status === "⬜" || p.status === "🔄",
  );
  const owner = snapshot.org.phaseOwners.find((p) => p.phase === phase);
  const model = owner ? snapshot.models[owner.managerOwner] : undefined;

  const [goal, setGoal] = useState("");
  const [inputs, setInputs] = useState("");
  const [outputs, setOutputs] = useState("");
  const [generationProfile, setGenerationProfile] = useState("none");
  const [budget, setBudget] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ path: string; prompt: string } | null>(null);

  useEffect(() => {
    if (!owner) return;
    setGoal(`Produce Phase ${phase} via delegates; merge; write manager brief`);
    setOutputs(snapshot.tracker.phases.find((p) => p.phase === phase)?.artifact ?? "");
    setGenerationProfile(model?.generationProfile ?? "none");
  }, [phase, owner, model, snapshot.tracker.phases]);

  const defaults = useMemo(() => {
    if (!owner) return null;
    return {
      position: owner.managerOwner,
      llm_tier: model?.llmTier ?? "",
      llm_model: model?.llmModel ?? "",
      maySpawn: owner.maySpawn,
    };
  }, [owner, model]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!defaults) return;
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const payload: ManagerPacketInput = buildAssignPayload({
        phase,
        position: defaults.position,
        llm_tier: defaults.llm_tier,
        llm_model: defaults.llm_model,
        goal,
        inputsText: inputs,
        outputsText: outputs,
        generation_profile: generationProfile,
        budgetText: budget,
        creativeRequired: CREATIVE.has(phase),
        businessIdeaRel: snapshot.businessIdeaRel,
      });
      onBeam(defaults.position);
      const result = await assignWork(payload);
      setSuccess({ path: result.path, prompt: result.orchestratorPrompt });
      onQueued();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="j-glass" style={{ padding: 16 }}>
      <p className="j-title">Assign work</p>
      <p className="j-muted" style={{ marginTop: 4 }}>
        Queues a manager packet. Orchestrator spawns that manager only — ICs are not selectable.
      </p>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, marginTop: 14, maxWidth: 560 }}>
        <label className="j-muted">
          Phase
          <select
            className="j-select"
            value={phase}
            onChange={(e) => onPhaseChange(e.target.value)}
            style={{ marginTop: 4 }}
          >
            {assignable.map((p) => (
              <option key={p.phase} value={p.phase}>
                {p.phase} — {p.name} ({p.status})
              </option>
            ))}
          </select>
        </label>
        <div className="j-muted">
          Manager (auto)
          <div className="j-mono" style={{ marginTop: 4, color: "var(--j-accent)", fontSize: 13 }}>
            {defaults?.position ?? "—"}
          </div>
          <div className="j-mono" style={{ fontSize: 11 }}>
            {defaults?.llm_tier} · {defaults?.llm_model}
          </div>
        </div>
        <label className="j-muted">
          Goal
          <textarea
            className="j-textarea"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            required
            style={{ marginTop: 4 }}
          />
        </label>
        <label className="j-muted">
          Inputs (one path per line)
          <textarea
            className="j-textarea"
            value={inputs}
            onChange={(e) => setInputs(e.target.value)}
            style={{ marginTop: 4 }}
          />
        </label>
        <label className="j-muted">
          Outputs
          <input
            className="j-input"
            value={outputs}
            onChange={(e) => setOutputs(e.target.value)}
            style={{ marginTop: 4 }}
          />
        </label>
        {CREATIVE.has(phase) && (
          <label className="j-muted">
            generation_profile
            <select
              className="j-select"
              value={generationProfile}
              onChange={(e) => setGenerationProfile(e.target.value)}
              style={{ marginTop: 4 }}
            >
              <option value="none">none</option>
              <option value="brand-stills">brand-stills</option>
              <option value="hero-video">hero-video</option>
              <option value="ad-creative">ad-creative</option>
            </select>
          </label>
        )}
        <label className="j-muted">
          budget_usd
          <input
            className="j-input"
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            style={{ marginTop: 4 }}
          />
        </label>
        {(defaults?.maySpawn.length ?? 0) > 0 && (
          <div>
            <p className="j-muted">May spawn (preview)</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
              {defaults!.maySpawn.map((s) => (
                <span key={s} className="j-chip">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
        {error && <p className="j-error">{error}</p>}
        {success && (
          <div>
            <p className="j-chip" data-tone="ok">
              Queued {success.path}
            </p>
            <p className="j-muted" style={{ marginTop: 8 }}>
              {success.prompt}
            </p>
            <button
              type="button"
              className="j-btn"
              style={{ marginTop: 8 }}
              onClick={() => navigator.clipboard.writeText(success.prompt)}
            >
              Copy orchestrator prompt
            </button>
          </div>
        )}
        <button type="submit" className="j-btn" data-active="true" disabled={busy || !defaults}>
          {busy ? "Queuing…" : "Queue manager dispatch"}
        </button>
      </form>
    </section>
  );
}
