import { useState, type FormEvent } from "react";
import { assignWork, type SituationSnapshot } from "../../api/client";
import {
  managerHandoffPath,
  resolveArtifactPath,
} from "../../lib/project-paths";

export function QuickAssign({
  snap,
  onDone,
}: {
  snap: SituationSnapshot;
  onDone: () => void;
}) {
  const assignable = snap.tracker.phases.filter(
    (p) => p.status === "⬜" || p.status === "🔄",
  );
  const [phase, setPhase] = useState(snap.mission.currentPhase);
  const owner = snap.org.phaseOwners.find((p) => p.phase === phase);
  const model = owner ? snap.models[owner.managerOwner] : undefined;
  const [goal, setGoal] = useState(
    `Produce Phase ${phase} via delegates; merge; write manager brief`,
  );
  const [error, setError] = useState<string | null>(null);
  const [path, setPath] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!owner || !model) return;
    setBusy(true);
    setError(null);
    try {
      const prefix = snap.businessIdeaRel;
      const art = snap.tracker.phases.find((p) => p.phase === phase)?.artifact ?? "";
      const outputs = art
        .split("+")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((p) => resolveArtifactPath(p, prefix));
      const result = await assignWork({
        phase,
        position: owner.managerOwner,
        goal,
        llm_tier: model.llmTier,
        llm_model: model.llmModel,
        generation_profile: model.generationProfile || "none",
        outputs,
        write_lease: [
          ...outputs,
          managerHandoffPath(prefix, phase, owner.managerOwner),
        ],
      });
      setPath(result.path);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, maxWidth: 520 }}>
      <label className="j-muted">
        Phase
        <select
          className="j-select"
          value={phase}
          onChange={(e) => {
            setPhase(e.target.value);
            setGoal(`Produce Phase ${e.target.value} via delegates; merge; write manager brief`);
          }}
        >
          {assignable.map((p) => (
            <option key={p.phase} value={p.phase}>
              {p.phase} — {p.name} ({p.status})
            </option>
          ))}
        </select>
      </label>
      <p className="j-mono" style={{ color: "var(--j-accent)" }}>
        Manager: {owner?.managerOwner ?? "—"} · {model?.llmTier} · {model?.llmModel}
      </p>
      <label className="j-muted">
        Goal
        <textarea
          className="j-textarea"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          required
        />
      </label>
      {error && <p className="j-error">{error}</p>}
      {path && (
        <p className="j-chip" data-tone="ok">
          Queued {path}
        </p>
      )}
      <button type="submit" className="j-btn" data-active="true" disabled={busy || !owner}>
        {busy ? "Queuing…" : "Queue manager dispatch"}
      </button>
    </form>
  );
}
