import { shouldEnableWebGL, type WebGLGateInput } from "@/lib/hero-webgl";
import { HERO_POSTER_PATH as HERO_SUBJECT_POSTER } from "@/lib/hero-subject";

export type HeroDisplayMode = "poster" | "canvas";

export function resolveHeroDisplayMode(input: WebGLGateInput): HeroDisplayMode {
  return shouldEnableWebGL(input) ? "canvas" : "poster";
}

export const HERO_ISLAND_HEIGHT_CLASS = "h-[50vh] min-h-[280px] max-h-[520px]";

/** @deprecated Prefer importing from `@/lib/hero-subject` — re-export for existing call sites */
export const HERO_POSTER_PATH = HERO_SUBJECT_POSTER;

export {
  HERO_DOG_NAME,
  HERO_POSTER_ALT,
} from "@/lib/hero-subject";