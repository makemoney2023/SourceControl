# Income Stack 3D Scroll Experience — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a premium 15-scene stacked Omni-video scroll experience as the default Income Stack website surface, with `DeckShell` retained as legacy fallback.

**Architecture:** Layered DOM/video + CSS perspective + GSAP ScrollTrigger (Pattern 1 from claudedesignskills web3d skill, adapted without WebGL). React owns discrete UI state; GSAP owns per-frame motion.

**Tech Stack:** Vite, React 19, TypeScript, Tailwind v4, GSAP + ScrollTrigger + ScrollToPlugin + `@gsap/react`, shadcn Button/Tooltip, Vitest, Playwright + axe.

**Sources reviewed:**
- https://github.com/freshtechbro/claudedesignskills/blob/main/.claude/skills/web3d-integration-patterns/SKILL.md
- https://github.com/freshtechbro/claudedesignskills/blob/main/.claude/skills/gsap-scrolltrigger/SKILL.md

## Global Constraints

- No Three.js / R3F / Drei / Framer Motion / React Spring / Lenis / Locomotive / Zustand in v1
- Content SSOT remains `src/data/slides.ts` + `streamIndex.ts`
- Media SSOT is `src/data/experienceMedia.ts` (paths only; no copy duplication)
- Autoplay muted; ambient audio opt-in only
- Media warm window: previous / current / next only
- WCAG 2.2 AA; reduced-motion disables pin/parallax/blur/autoplay
- TDD for every new unit; Remotion + Veo pipelines untouched

---

## Library adopt / adapt / reject

| Idea | Decision |
|---|---|
| Layered media / animation / UI separation | Adapt (video planes instead of Three.js scene) |
| Pin + scrub parent timelines, `useGSAP` cleanup | Adopt |
| ScrollToPlugin + active-nav ScrollTrigger callbacks | Adopt |
| `matchMedia`, `anticipatePin`, `invalidateOnRefresh` | Adopt |
| One authority per animated property | Adopt |
| Zustand / R3F / Motion-3D / smooth-scroll libs | Reject |

Full matrix lives in the Cursor plan and design spec.

---

### Task 1: Contract + baseline

**Files:**
- Create: `docs/superpowers/specs/2026-08-07-income-stack-3d-experience-design.md`
- Modify: `apps/superpatch-income-stack/README.md`
- Create: `apps/superpatch-income-stack/docs/baselines/3d-experience/2026-08-07-pre-experience.md`

- [ ] Write design spec with architecture, media policy, a11y, budgets, and skill matrix
- [ ] Update README for default ExperienceShell + `?view=legacy`
- [ ] Capture baseline test/build/media footprint notes

### Task 2: Experience media model (TDD)

**Files:**
- Create: `apps/superpatch-income-stack/src/data/experienceMedia.ts`
- Create: `apps/superpatch-income-stack/src/data/experienceMedia.test.ts`
- Create: `apps/superpatch-income-stack/scripts/verify-omni-assets.mjs`
- Create: `apps/superpatch-income-stack/public/concepts/omni-chain/posters/{16x9,9x16}/*.webp`

- [ ] Write failing media contract tests
- [ ] Implement media map + helpers (`mediaWindow`, `resolveExperienceSrc`, etc.)
- [ ] Generate WebP posters from bridge settle frames
- [ ] Add `verify:omni-assets` script (30 mp4s + posters + dimensions/codecs)

### Task 3: Semantic scenes (no motion yet)

**Files:**
- Create: `src/components/experience/{ExperienceShell,ExperienceScene,SceneVideo,ExperienceChrome}.tsx`
- Create: matching `*.test.tsx`
- Create: `src/components/experience/experience.css`

- [ ] Failing component tests for 15 sections, headings, disclosures, CTAs, decorative video
- [ ] Minimal markup with sticky tracks and copy columns
- [ ] Poster-only rendering path works without GSAP

### Task 4: Stacked-cover GSAP motion

**Files:**
- Create: `src/motion/useExperienceMotion.ts`
- Create: `src/motion/useExperienceMotion.test.ts`

- [ ] Install `@gsap/react`; register ScrollTrigger + ScrollToPlugin
- [ ] Failing tests for matchMedia branches / cleanup contract
- [ ] Pin+scrub cover timelines per scene; copy reveals as timeline children
- [ ] Reduced-motion branch leaves static layers

### Task 5: Media lifecycle + shadcn controls

**Files:**
- Create: `src/components/experience/useSceneMedia.ts` + test
- Create: minimal shadcn `Button` / `Tooltip` under `src/components/ui/`

- [ ] Warm window tests (≤3 attached videos)
- [ ] Pause/release distant decoders; poster fallback on error
- [ ] Muted autoplay + opt-in ambient sound with versioned preference

### Task 6: Navigation + a11y

**Files:**
- Modify: `ExperienceChrome.tsx`, `ExperienceShell.tsx`

- [ ] Vertical 15-step navigator with `aria-current`, keyboard, skip link
- [ ] Active sync via ScrollTrigger; jumps via ScrollToPlugin
- [ ] Portrait/landscape source swap without full reload

### Task 7: Safe integration

**Files:**
- Modify: `src/App.tsx`, `package.json`

- [ ] Default `ExperienceShell`; `?view=legacy` → `DeckShell`
- [ ] Scripts: `test:e2e`, `verify:omni-assets`
- [ ] Confirm Remotion/Veo untouched; no WebGL deps

### Task 8: Release gates + polish

**Files:**
- Create: Playwright specs under `apps/superpatch-income-stack/e2e/`
- Create: visual baselines for representative scenes

- [ ] Desktop/mobile journeys, reduced-motion, keyboard, sound, failure paths
- [ ] axe: zero serious/critical
- [ ] Performance budgets on `vite preview`
- [ ] Final fit-and-finish pass

## Execution handoff

After this plan is approved for continued execution, resume Task 2 (media model currently in progress — tests written, implementation pending).
