export type JarvisFocus = {
  phase?: string;
  slug?: string;
};

export type ActivityFocusInput = {
  at: string;
  type: string;
  phase?: string;
  slug?: string;
  position?: string;
};

export function parseJarvisFocusEvent(ev: ActivityFocusInput): JarvisFocus | null {
  if (ev.type !== "jarvis.focus") return null;
  const slug = ev.slug ?? ev.position;
  const phase = ev.phase;
  if (!slug && !phase) return {};
  return { ...(phase ? { phase } : {}), ...(slug ? { slug } : {}) };
}

/** Newest jarvis.focus wins (activity tail is newest-first in snapshot). */
export function latestJarvisFocus(activity: ActivityFocusInput[]): JarvisFocus | null {
  for (const ev of activity) {
    const focus = parseJarvisFocusEvent(ev);
    if (focus !== null) return focus;
  }
  return null;
}
