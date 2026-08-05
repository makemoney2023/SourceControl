export type JarvisFocus = {
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

export function parseJarvisFocusEvent(ev: ActivityFocusInput): JarvisFocus | null {
  if (ev.type !== "jarvis.focus") return null;
  const slug = ev.slug ?? ev.position;
  const phase = ev.phase;
  if (!slug && !phase && !ev.openReport && !ev.focusQuestions) return {};
  return {
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
