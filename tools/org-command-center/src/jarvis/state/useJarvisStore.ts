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
  /** True while a Situation Room drawer/modal is open — hide scene Html labels. */
  drawerOpen: boolean;
  previewWakeSlug: string | null;
  followCam: boolean;
  orbiting: boolean;
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
  drawerOpen: false,
  previewWakeSlug: null,
  followCam: true,
  orbiting: false,
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
  const next = { ...state, ...patch };
  if (next.reducedMotion) {
    next.bloomEnabled = false;
    next.beamActive = false;
  }
  const changed = (Object.keys(patch) as (keyof JarvisState)[]).some(
    (key) => state[key] !== next[key],
  );
  if (!changed) return;
  state = next;
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
      setDrawerOpen: (drawerOpen: boolean) => setJarvisState({ drawerOpen }),
      setPreviewWakeSlug: (previewWakeSlug: string | null) =>
        setJarvisState({ previewWakeSlug }),
      setFollowCam: (followCam: boolean) => setJarvisState({ followCam }),
      setOrbiting: (orbiting: boolean) => setJarvisState({ orbiting }),
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
