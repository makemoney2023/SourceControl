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
  listeners.add(listener);
  return () => listeners.delete(listener);
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
