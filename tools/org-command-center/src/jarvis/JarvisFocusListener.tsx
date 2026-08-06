import { useEffect, useRef } from "react";
import { fetchSnapshot, subscribeEvents } from "../api/client";
import {
  latestJarvisFocus,
  resolveJarvisFocusApply,
  type JarvisFocus,
  type JarvisFocusApplyState,
} from "./jarvis-focus";

export function JarvisFocusListener({
  onFocus,
}: {
  onFocus: (focus: JarvisFocus | null) => void;
}) {
  const stateRef = useRef<JarvisFocusApplyState>({
    hydrated: false,
    lastAppliedAt: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function sync() {
      try {
        const snap = await fetchSnapshot();
        if (cancelled) return;
        const focus = latestJarvisFocus(snap.activity ?? []);
        const { apply, next } = resolveJarvisFocusApply(focus, stateRef.current);
        stateRef.current = next;
        if (apply) onFocus(apply);
      } catch {
        /* snapshot unavailable — keep prior focus */
      }
    }

    void sync();
    const unsub = subscribeEvents(() => void sync());
    return () => {
      cancelled = true;
      unsub();
    };
  }, [onFocus]);

  return null;
}
