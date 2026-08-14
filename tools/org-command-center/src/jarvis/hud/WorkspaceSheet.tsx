import { Textarea } from "../../components/ui/textarea";
import type { CustomerListItem, ProjectListItem } from "../../api/client";

type Props = {
  orgName: string;
  activeProject: string;
  activeInitiative: string;
  customers: CustomerListItem[];
  projects: ProjectListItem[];
  switchingProject: boolean;
  creatingVenture: boolean;
  creatingInitiative: boolean;
  showNewVenture: boolean;
  showNewInitiative: boolean;
  newVentureName: string;
  newVentureSlug: string;
  newVentureContext: string;
  newInitiativeName: string;
  newInitiativeSlug: string;
  newInitiativeContext: string;
  onSwitchProject: (slug: string) => void;
  onSwitchInitiative: (slug: string) => void;
  onToggleNewVenture: () => void;
  onToggleNewInitiative: () => void;
  onNewVentureNameChange: (value: string) => void;
  onNewVentureSlugChange: (value: string) => void;
  onNewVentureContextChange: (value: string) => void;
  onNewInitiativeNameChange: (value: string) => void;
  onNewInitiativeSlugChange: (value: string) => void;
  onNewInitiativeContextChange: (value: string) => void;
  onCreateCustomer: () => void;
  onCreateInitiative: () => void;
  onCancelNewVenture: () => void;
  onCancelNewInitiative: () => void;
  progressPct: number;
  done: number;
  active: number;
  pending: number;
  spendUsd: number;
  voiceOk: boolean | null;
  autoSpawn: boolean;
  onToggleAutoSpawn: (next: boolean) => void;
  lastUpdated: string | null;
  followCam: boolean;
  onToggleFollowCam: (next: boolean) => void;
  onReplayTour: () => void;
};

export function WorkspaceSheet(props: Props) {
  const customerOptions = props.customers.length
    ? props.customers
    : props.projects.length
      ? props.projects
      : [{ slug: props.activeProject, name: props.activeProject }];
  const initiativeOptions =
    props.customers.find((c) => c.slug === props.activeProject)?.initiatives ?? [
      { slug: props.activeInitiative, name: props.activeInitiative },
    ];

  return (
    <div className="j-workspace-sheet">
      <section className="j-workspace-section">
        <h2 className="j-title">Workspace</h2>
        <div className="j-workspace-fields">
          <label className="j-muted" htmlFor="sr-agency">
            Agency
          </label>
          <select id="sr-agency" className="j-select" disabled value="velocity-agency">
            <option value="velocity-agency">{props.orgName}</option>
          </select>
          <label className="j-muted" htmlFor="sr-project">
            Customer
          </label>
          <select
            id="sr-project"
            className="j-select"
            disabled={
              props.switchingProject ||
              props.creatingVenture ||
              props.creatingInitiative ||
              customerOptions.length === 0
            }
            value={props.activeProject}
            onChange={(e) => props.onSwitchProject(e.target.value)}
          >
            {customerOptions.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name || p.slug}
              </option>
            ))}
          </select>
          <label className="j-muted" htmlFor="sr-initiative">
            Initiative
          </label>
          <select
            id="sr-initiative"
            className="j-select"
            disabled={props.switchingProject || props.creatingInitiative}
            value={props.activeInitiative}
            onChange={(e) => props.onSwitchInitiative(e.target.value)}
          >
            {initiativeOptions.map((i) => (
              <option key={i.slug} value={i.slug}>
                {i.name || i.slug}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="j-btn"
            data-active="true"
            disabled={props.creatingInitiative || props.creatingVenture}
            onClick={props.onToggleNewInitiative}
          >
            Add initiative
          </button>
          <button
            type="button"
            className="j-btn"
            disabled={props.creatingVenture || props.creatingInitiative}
            onClick={props.onToggleNewVenture}
          >
            Add customer
          </button>
        </div>
        {props.showNewInitiative ? (
          <div className="j-glass j-workspace-form">
            <p className="j-muted">
              New initiative under {props.activeProject}: full workspace + Sources context, then switch.
            </p>
            <label className="j-muted" htmlFor="sr-init-name">
              Initiative name
            </label>
            <input
              id="sr-init-name"
              className="j-input"
              placeholder="e.g. Web Design"
              value={props.newInitiativeName}
              onChange={(e) => props.onNewInitiativeNameChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") props.onCreateInitiative();
              }}
            />
            <label className="j-muted" htmlFor="sr-init-slug">
              Slug
            </label>
            <input
              id="sr-init-slug"
              className="j-input"
              placeholder="web-design"
              value={props.newInitiativeSlug}
              onChange={(e) => props.onNewInitiativeSlugChange(e.target.value)}
            />
            <label className="j-muted" htmlFor="sr-init-context">
              Business context (optional)
            </label>
            <Textarea
              id="sr-init-context"
              className="j-textarea"
              placeholder="Operator notes — goals, constraints, source material summary…"
              rows={3}
              value={props.newInitiativeContext}
              onChange={(e) => props.onNewInitiativeContextChange(e.target.value)}
            />
            <div className="j-workspace-form-actions">
              <button
                type="button"
                className="j-btn"
                data-active="true"
                disabled={!props.newInitiativeName.trim() || props.creatingInitiative}
                onClick={props.onCreateInitiative}
              >
                {props.creatingInitiative ? "Creating…" : "Create & switch"}
              </button>
              <button
                type="button"
                className="j-btn"
                disabled={props.creatingInitiative}
                onClick={props.onCancelNewInitiative}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}
        {props.showNewVenture ? (
          <div className="j-glass j-workspace-form">
            <p className="j-muted">New customer under {props.orgName} with a default main initiative.</p>
            <label className="j-muted" htmlFor="sr-new-name">
              Customer name
            </label>
            <input
              id="sr-new-name"
              className="j-input"
              placeholder="e.g. Blacksage Kennels"
              value={props.newVentureName}
              onChange={(e) => props.onNewVentureNameChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") props.onCreateCustomer();
              }}
            />
            <label className="j-muted" htmlFor="sr-new-slug">
              Slug (folder id)
            </label>
            <input
              id="sr-new-slug"
              className="j-input"
              placeholder="blacksage-kennels"
              value={props.newVentureSlug}
              onChange={(e) => props.onNewVentureSlugChange(e.target.value)}
            />
            <label className="j-muted" htmlFor="sr-new-context">
              Business context (optional)
            </label>
            <Textarea
              id="sr-new-context"
              className="j-textarea"
              placeholder="Operator notes for agents — market, constraints, priorities…"
              rows={3}
              value={props.newVentureContext}
              onChange={(e) => props.onNewVentureContextChange(e.target.value)}
            />
            <div className="j-workspace-form-actions">
              <button
                type="button"
                className="j-btn"
                data-active="true"
                disabled={!props.newVentureName.trim() || props.creatingVenture}
                onClick={props.onCreateCustomer}
              >
                {props.creatingVenture ? "Creating…" : "Create & switch"}
              </button>
              <button
                type="button"
                className="j-btn"
                disabled={props.creatingVenture}
                onClick={props.onCancelNewVenture}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <section className="j-workspace-section">
        <h2 className="j-title">Status</h2>
        <dl className="j-workspace-status">
          <div>
            <dt>Progress</dt>
            <dd>{props.progressPct}%</dd>
          </div>
          <div>
            <dt>Queue</dt>
            <dd>
              {props.done} done · {props.active} active · {props.pending} pending
            </dd>
          </div>
          <div>
            <dt>Spend</dt>
            <dd>${props.spendUsd.toFixed(4)}</dd>
          </div>
          <div>
            <dt>OmniVoice</dt>
            <dd>
              {props.voiceOk == null ? "…" : props.voiceOk ? "online" : "offline (browser TTS fallback)"}
            </dd>
          </div>
          <div>
            <dt>Updated</dt>
            <dd>{props.lastUpdated ?? "Awaiting sync"}</dd>
          </div>
        </dl>
        <label className="j-workspace-check">
          <input
            type="checkbox"
            checked={props.autoSpawn}
            onChange={(e) => props.onToggleAutoSpawn(e.target.checked)}
          />{" "}
          Auto-spawn on queue
        </label>
        <label className="j-workspace-check">
          <input
            type="checkbox"
            checked={props.followCam}
            onChange={(e) => props.onToggleFollowCam(e.target.checked)}
          />{" "}
          Follow running seats
        </label>
        <button type="button" className="j-btn" onClick={props.onReplayTour}>
          Replay tour
        </button>
      </section>
    </div>
  );
}
