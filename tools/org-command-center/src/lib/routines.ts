export type RoutineAction = "enqueue" | "rewake";

export interface RoutineDef {
  id: string;
  enabled: boolean;
  cron: string;
  action: RoutineAction;
  phase?: string;
  position?: string;
  goal?: string;
  rewake_dispatch?: string | null;
  budget_usd?: number | null;
  last_run_at?: string | null;
}

export function parseRoutine(raw: unknown): RoutineDef | null {
  const o = (raw ?? {}) as Record<string, unknown>;
  const id = String(o.id ?? "").trim();
  const cron = String(o.cron ?? "").trim();
  if (!id || !cron) return null;
  const action = o.action === "rewake" ? "rewake" : "enqueue";
  return {
    id,
    enabled: o.enabled !== false && o.enabled !== "false",
    cron,
    action,
    phase: o.phase != null ? String(o.phase) : undefined,
    position: o.position != null ? String(o.position) : undefined,
    goal: o.goal != null ? String(o.goal) : undefined,
    rewake_dispatch: o.rewake_dispatch != null ? String(o.rewake_dispatch) : null,
    budget_usd:
      typeof o.budget_usd === "number"
        ? o.budget_usd
        : o.budget_usd == null
          ? null
          : Number(o.budget_usd),
    last_run_at: o.last_run_at != null ? String(o.last_run_at) : null,
  };
}
