export type JarvisFocus = {
  at?: string;
  phase?: string;
  slug?: string;
  openReport?: boolean;
  focusQuestions?: boolean;
};

export type ActivityFocusInput = {
  at: string;
  type: string;
  phase?: string;
  slug?: string;
  position?: string;
  openReport?: boolean;
  focusQuestions?: boolean;
};

export type JarvisFocusApplyState = {
  hydrated: boolean;
  lastAppliedAt: string | null;
};

export function parseJarvisFocusEvent(ev: ActivityFocusInput): JarvisFocus | null {
  if (ev.type !== "jarvis.focus") return null;
  const slug = ev.slug ?? ev.position;
  const phase = ev.phase;
  if (!slug && !phase && !ev.openReport && !ev.focusQuestions) {
    return { at: ev.at };
  }
  return {
    at: ev.at,
    ...(phase ? { phase } : {}),
    ...(slug ? { slug } : {}),
    ...(ev.openReport ? { openReport: true } : {}),
    ...(ev.focusQuestions ? { focusQuestions: true } : {}),
  };
}

/** Newest jarvis.focus wins (activity tail is newest-first in snapshot). */
export function latestJarvisFocus(activity: ActivityFocusInput[]): JarvisFocus | null {
  for (const ev of activity) {
    const focus = parseJarvisFocusEvent(ev);
    if (focus !== null) return focus;
  }
  return null;
}

/**
 * Apply focus from activity without trapping the operator in a stale report drawer.
 * - First hydrate: select seat/phase, never auto-open report from history.
 * - Later syncs: ignore the same event `at` so Close sticks across SSE polls.
 * - Newer `at`: apply fully (including openReport).
 */
export function resolveJarvisFocusApply(
  focus: JarvisFocus | null,
  state: JarvisFocusApplyState,
): { apply: JarvisFocus | null; next: JarvisFocusApplyState } {
  if (!focus) {
    return { apply: null, next: state };
  }

  const at = focus.at ?? null;

  if (!state.hydrated) {
    const apply: JarvisFocus = {
      ...(at ? { at } : {}),
      ...(focus.phase ? { phase: focus.phase } : {}),
      ...(focus.slug ? { slug: focus.slug } : {}),
    };
    return {
      apply,
      next: { hydrated: true, lastAppliedAt: at },
    };
  }

  if (at != null && state.lastAppliedAt != null && at <= state.lastAppliedAt) {
    return { apply: null, next: state };
  }

  return {
    apply: focus,
    next: { hydrated: true, lastAppliedAt: at ?? state.lastAppliedAt },
  };
}
