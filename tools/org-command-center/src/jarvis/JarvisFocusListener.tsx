import { useEffect } from "react";
import { fetchSnapshot, subscribeEvents } from "../api/client";
import { latestJarvisFocus, type JarvisFocus } from "./jarvis-focus";

export function JarvisFocusListener({
  onFocus,
}: {
  onFocus: (focus: JarvisFocus | null) => void;
}) {
  useEffect(() => {
    let cancelled = false;

    async function sync() {
      try {
        const snap = await fetchSnapshot();
        if (cancelled) return;
        onFocus(latestJarvisFocus(snap.activity ?? []));
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
