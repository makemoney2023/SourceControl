import { useMemo, useSyncExternalStore } from "react";

export type JarvisMode = "floor" | "assign" | "outputs";

export interface JarvisState {
  mode: JarvisMode;
  selectedSlug: string | null;
  selectedPhase: string | null;
  selectedArtifact: string | null;
  beamActive: boolean;
  reducedMotion: boolean;
  bloomEnabled: boolean;
}

type Listener = () => void;

let state: JarvisState = {
  mode: "floor",
  selectedSlug: null,
  selectedPhase: null,
  selectedArtifact: null,
  beamActive: false,
  reducedMotion:
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  bloomEnabled: false,
};

const listeners = new Set<Listener>();
let stopMotionListener: (() => void) | null = null;

function emit() {
  for (const l of listeners) l();
}

export function getJarvisState() {
  return state;
}

export function setJarvisState(patch: Partial<JarvisState>) {
  state = { ...state, ...patch };
  if (state.reducedMotion) {
    state = { ...state, bloomEnabled: false, beamActive: false };
  }
  emit();
}

export function subscribeJarvis(listener: Listener) {
  if (listeners.size === 0 && typeof window !== "undefined") {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) => setJarvisState({ reducedMotion: event.matches });
    setJarvisState({ reducedMotion: media.matches });
    media.addEventListener?.("change", onChange);
    stopMotionListener = () => media.removeEventListener?.("change", onChange);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      stopMotionListener?.();
      stopMotionListener = null;
    }
  };
}

export function useJarvisStore() {
  const snap = useSyncExternalStore(subscribeJarvis, getJarvisState, getJarvisState);
  return useMemo(
    () => ({
      ...snap,
      setMode: (mode: JarvisMode) => setJarvisState({ mode }),
      selectSlug: (selectedSlug: string | null) => setJarvisState({ selectedSlug }),
      selectPhase: (selectedPhase: string | null) => setJarvisState({ selectedPhase }),
      selectArtifact: (selectedArtifact: string | null) =>
        setJarvisState({ selectedArtifact }),
      setBeam: (beamActive: boolean) => {
        if (getJarvisState().reducedMotion) return;
        setJarvisState({ beamActive });
      },
      setBloom: (bloomEnabled: boolean) =>
        setJarvisState({
          bloomEnabled: getJarvisState().reducedMotion ? false : bloomEnabled,
        }),
    }),
    [snap],
  );
}

export function useJarvisSelection() {
  const store = useJarvisStore();
  return {
    selectedSlug: store.selectedSlug,
    selectSlug: store.selectSlug,
  };
}
