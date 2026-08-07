# Income Stack 3D Scroll Experience — Design Spec

**Date:** 2026-08-07  
**Venture:** Superpatch / affiliates / income-stack-deck  
**Status:** Approved for execution (Premium V2 contract locked)  
**App:** `apps/superpatch-income-stack`

## Goal

Ship a premium cinematic 15-scene scroll website where each Omni video layer slides over the previous one. The site owns all typography and parallax overlays. The existing fluid `DeckShell` remains a deterministic legacy/static fallback.

Premium V2 evolves the working full-viewport experience into **Directed Cinematic Chapters**: chapter-level orientation, scene-specific choreography derived from each slide’s `motionPreset`, responsive headline reveals, poster-to-video polish, and restrained conversion cues—without replacing the layered DOM/video/GSAP architecture or rewriting approved copy.

## Locked architecture

| Decision | Choice |
|---|---|
| Rendering | Layered DOM + CSS perspective + GSAP ScrollTrigger |
| WebGL / Three.js / R3F | Out of scope |
| Smooth-scroll library | None (native scroll) |
| Default surface | `ExperienceShell` |
| Fallback surface | `DeckShell` via `?view=legacy` or reduced-capability path |
| Content SSOT | `src/data/slides.ts` + `streamIndex.ts` |
| Media SSOT | `src/data/experienceMedia.ts` (maps slide IDs → Omni clips/posters) |
| Landscape media | `public/concepts/omni-chain/16x9/*_omni.mp4` (1280×720) |
| Portrait media | `public/concepts/omni-chain/9x16/*_omni.mp4` (720×1280) |
| Posters | Optimized WebP from loop-settle bridge frames |
| UI kit | shadcn/ui `Button` + `Tooltip` for experience controls |
| Accessibility | WCAG 2.2 AA |

## Experience model

1. Fifteen semantic `<section>` scenes in document order.
2. Each scene owns a full-viewport sticky video plane.
3. Incoming scene covers the previous scene; outgoing scene may recede slightly (scale/blur) without harming legibility.
4. HTML copy is the accessible narrative; video is decorative (`aria-hidden`).
5. Vertical 15-step navigator with real buttons, `aria-current`, keyboard support.
6. Autoplay muted only; ambient audio requires an explicit user gesture and follows the active scene.

## Premium V2 chapters

Three narrative chapters group the 15 scenes. Chapter metadata is typed data consumed by chrome and motion; it does not duplicate slide copy.

| Chapter | Scenes | Purpose |
|---|---|---|
| **Foundation** | 01–06 | Why the Income Stack exists: title, old model, four stacks, flywheel, ecosystem, ten layers |
| **Ten Income Streams** | 07–14 | Each stack’s earning mechanism, disclosures on every scene |
| **Action** | 15 | Closing leverage story, primary/secondary CTAs, full disclosure |

**Scene IDs (SSOT: `slides.ts`):**

- Foundation: `01-title`, `02-the-question`, `03-four-stacks`, `04-flywheel`, `05-ecosystem`, `06-ten-layers`
- Ten Income Streams: `07-retail` … `14-global`
- Action: `15-closing`

Chrome must expose chapter orientation: active scene index (`01 / 15`), current chapter label, and continuous scroll progress (see Acceptance criteria). On mobile, prefer a compact scene counter over 15 persistent dot targets.

## Approved composition correction

The production composition is **Cinematic Lower Third**. Every scene is a single
full-viewport visual stage—not a media card beside or above a copy column.

- The active 16:9 or 9:16 video uses `position: absolute; inset: 0` and fills the
  sticky viewport with `object-fit: cover`.
- Copy overlays the video in a lower-third safe zone. It never participates in a
  grid that changes the video's dimensions.
- A bottom-up navy scrim protects readability while leaving the upper image
  unobstructed. Scrim strength can vary by scene, but copy must pass WCAG AA.
- Desktop copy remains left-aligned and constrained to roughly 10–12 headline
  characters per line. Portrait copy stays within safe-area insets above controls.
- The Super Patch logo is an approved, unmodified SVG with required clear space;
  plain typed text is not a substitute for the mark.

### Depth and parallax

Depth must be perceptible during normal scrolling, not merely present in code:

1. Video moves at approximately `0.35×` scroll progress with a subtle push-in.
2. The readability scrim moves at approximately `0.7×`.
3. Eyebrow, headline, body, disclosures, and CTAs occupy independent visual
   planes with distinct vertical travel and scale.
4. Each incoming full-viewport stage begins below the viewport and slides
   upward over the pinned outgoing stage, like a card placed on top of a deck.
5. The outgoing stage remains flat, scales to approximately `0.94`, and darkens
   slightly underneath the incoming stage. It does not rotate or tilt.
6. The incoming stage has no visible rounded card edge or page gap; its viewport
   boundary itself creates the shuffle edge and there is never a black frame.
7. Motion travels forward/left-to-right or bottom-to-top, uses ease-out timing,
   and avoids ornamental rotation.

### Premium V2 motion choreography

Each scene resolves to a web choreography derived from its `motionPreset` in `slides.ts` (shared SSOT with Remotion). GSAP remains the sole animation authority; web motion is limited to translation, scale, brightness, and opacity—no ornamental rotation or tilt.

**Two scroll phases per scene:**

1. **Handoff** — incoming viewport covers the outgoing card while copy reveals.
2. **Dwell** — scene settles long enough to read while media receives a preset-specific restrained drift or push.

Scene scroll height increases modestly on desktop and less on touch devices to create readable dwell without scroll-jacking. Headlines use GSAP SplitText **line** reveals (`type: "lines"`, `autoSplit`, font-ready init, `onSplit` cleanup via `gsap.context()`). In `prefers-reduced-motion: reduce`, disable splitting, staggering, pin, parallax, and blur; present static copy with posters.

Live annotations, stream index, and progress spine enter on preset-specific timing—not as static overlays from scene start.

### Scene 04 / 14 parity evaluation

Remotion already renders a hero flywheel (scene 04, `flywheel-scrub`) and recap overlay (scene 14, `earth-arcs` + `RECAP_OVERLAY_TEXT`). The Omni clips may already depict parts of those concepts, so web parity is conditional rather than automatic.

Before shipping web overlays:

1. **Scene 04** — evaluate whether a hero flywheel annotation adds information beyond the Omni clip. Render only if it clarifies the flywheel loop; never duplicate arcs already visible in the video.
2. **Scene 14** — evaluate whether the “You've seen all ten stacks” recap and completed spine add information beyond the Omni clip. Render only during the approved recap window; never duplicate globe/pool graphics baked into the footage.

If evaluation finds redundancy, omit the web overlay and rely on the Omni layer alone.

**Task 5 parity decision (2026-08-07):** retain the Omni visuals for scenes 04
and 14 without adding new hero flywheel or recap overlays. Scene 04's clip
already communicates the reinforcing loop, while scene 14's globe/pool imagery
and the existing live progress spine carry the recap. Duplicating either as a
second diagram would add visual noise rather than information. This decision
applies to the web experience only; existing Remotion overlays remain unchanged.

## Super Patch brand application

Source of truth: `/Users/cbsuperpatch/Desktop/SP Brand Guidelines`.

- HTML font: Montserrat, then Helvetica, then Arial.
- Headlines: uppercase, weight 900/800, 100% line height, `-0.8%` to `-1.6%`
  tracking.
- Supporting copy: weight 500, 150% line height, lower contrast than headlines.
- Sub-headlines: bold sentence case at 150% line height.
- Core interface colors: white, website greys, and SP Red `#DD0604`.
- Existing blue/green/orange/violet accents remain inside the supplied videos and
  narrative diagrams; interface chrome does not create a generic neon gradient.
- Super Patch Red is a focal accent, not a full-page wash.
- Buttons are bold and uppercase. Large text over imagery must meet at least 3:1
  contrast; normal text must meet at least 4.5:1.

## Media policy

- Warm only **previous / current / next** video sources.
- Distant scenes render poster-only until near.
- First poster is the LCP candidate (`rel=preload` + `fetchpriority=high`).
- Playback failure keeps poster + copy; never a black empty plane.
- `prefers-reduced-motion: reduce` disables pin/parallax/blur/autoplay and presents a static narrative with posters.
- Data-saving / constrained path prefers posters until explicit play.
- Never eagerly request all ~62 MB of Omni clips.

### Poster-to-first-frame transition

The poster remains fully visible until the video fires `loadeddata` (first decoded frame). Crossfade video over the poster; on autoplay or decode failure, keep poster + copy—never a gray, white, or black empty plane. First poster remains the LCP candidate.

### Visual-first audio scope

This pass is visual-first. Keep muted autoplay; ambient audio is opt-in only via an explicit user gesture. Chrome labels the control “Enable audio” / “Mute audio” with an unmistakable active state. Do not add new sound assets, global always-on soundtrack, or auto-advance behavior.

### Rapid-jump cleanup

Navigator jumps (including early → scene 8 or 15) must finish or reset superseded card, annotation, and SplitText timelines deterministically. No intermediate-scene graphics, metrics, or partial cards may remain visible on the destination scene after GSAP settling.

### Scene lifecycle and compositing

Assign explicit lifecycle state per scene: `previous`, `active`, `next`, `distant`. Apply `will-change` and expensive compositing only to the active neighborhood. Distant fixed cards must not persist on their own compositor layers. Validate fast-scroll and rapid-jump recovery before considering scene virtualization.

## Performance budgets

| Metric | Budget |
|---|---|
| LCP | First poster |
| CLS | < 0.1 |
| INP | < 200 ms |
| Attached videos | ≤ 3 (previous / current / next) |
| Active decoders | ≤ 3 |
| Playing videos | 1 (active scene only) |
| Compositor layers | Active neighborhood only; distant scenes unpromoted |
| Long scroll tasks | < 50 ms in representative trace |
| Initial distant-video fetches | 0 |
| Total eager Omni fetch | Never all ~62 MB |

## Fit-and-finish bar

Apple restraint × Nike cinematic energy × McKinsey clarity. Image-dominant
full-viewport stages with branded lower-third copy and copy-safe edges. Smooth
cover handoffs with no black flashes, clipping, text collisions, or z-index
seams. Closing logo remains the deterministic brand lockup (not AI-redrawn).

## Conversion hierarchy

Scene 15 owns the full closing CTA block: primary action (SP Red, bold uppercase), clearly subordinate disclosure link, and undisturbed legal copy.

After scene 6 (Foundation complete), a compact non-blocking affiliate CTA may appear in header chrome; hide it when scene 15’s full CTA is visible.

**Real destination requirement:** Production CTAs must resolve to verified affiliate-link and income-disclosure URLs from existing project/Obsidian documentation before release. Do not ship hash placeholders (e.g. `#get-affiliate-link`). Until destinations are confirmed, keep CTAs out of production chrome or mark them inert in non-production builds only.

## Premium V2 acceptance criteria

Measurable gates for implementation and QA. All must pass on desktop **1440×900** and mobile **375×812** portrait unless noted.

| Criterion | Pass condition |
|---|---|
| **Scene dwell** | Each scene has distinct handoff + dwell scroll phases; dwell height ≥ readable body on desktop; touch dwell shorter but still allows full headline + first body line without overlap from the next card |
| **SplitText line reveal** | Headlines split by line, reveal on preset timing; reflow on resize/orientation without orphaned fragments; `revert()` on unmount; reduced-motion shows full headline immediately |
| **Chapter orientation** | Chrome shows `NN / 15`, current chapter label, and `aria-current` on active nav target; mobile uses compact counter, not 15 tiny persistent dots |
| **Poster-to-first-frame** | No gray/white/black flash between poster and first video frame; poster visible until `loadeddata`; failure keeps poster |
| **375×812 safe areas** | Copy, CTAs, and chrome respect `env(safe-area-inset-*)`; no control covers lower-third copy; release-blocking visual QA at this size |
| **Reduced motion** | `prefers-reduced-motion: reduce` disables pin, parallax, blur, autoplay, SplitText stagger, and card shuffle; static posters + full copy remain |
| **Continuous progress** | Progress rail tracks total scroll progress continuously—not stepped by active scene index alone |
| **CTA hierarchy** | Scene 15: primary CTA visually dominant (SP Red); disclosure link subordinate; both targets are real URLs in production |
| **Scene 04 / 14 parity** | Flywheel/recap overlays pass redundancy evaluation; if shipped, add information without duplicating Omni-baked graphics |
| **Rapid-jump cleanup** | Jump from scene 01 → 08 → 15 leaves no intermediate annotations, cards, or timelines visible after settle |
| **Attached videos** | ≤ 3 `<video>` elements attached (previous / current / next) |
| **Active decoders** | ≤ 3 decoders; exactly 1 video playing at a time |
| **Compositor budget** | Distant scenes not promoted to persistent compositor layers; active-neighborhood `will-change` only |
| **Scroll task budget** | Long representative scroll tasks < 50 ms in trace |
| **Accessibility** | WCAG 2.2 AA; axe zero serious/critical on scenes 1, 7, 15; keyboard nav (arrows, Page Up/Down) without requiring dot focus |
| **First-scroll cue** | “Scroll to explore” on scene 1 disappears after first meaningful scroll |
| **Audio control** | Opt-in only; labeled enable/mute; no new assets; follows active scene when enabled |

## Library guidance (claudedesignskills)

Reviewed `web3d-integration-patterns` and `gsap-scrolltrigger` from
[freshtechbro/claudedesignskills](https://github.com/freshtechbro/claudedesignskills).

| Idea | Decision |
|---|---|
| Layered media / animation / UI separation (Pattern 1) | **Adapt** — video+CSS planes instead of Three.js |
| Marketing scroll-story → GSAP + React UI | **Adopt** |
| One animation authority per property | **Adopt** — GSAP only for transforms/opacity |
| `useGSAP` scoped cleanup, pin+scrub parent timelines | **Adopt** |
| ScrollToPlugin + active-nav ScrollTrigger callbacks | **Adopt** |
| GSAP SplitText line reveals (`autoSplit`, font-ready, context cleanup) | **Adopt** — reduced-motion bypass |
| `matchMedia`, `anticipatePin`, `invalidateOnRefresh` | **Adopt** |
| Zustand / Three.js / R3F / Motion-3D / React Spring | **Reject** for v1 |
| Lenis / Locomotive smooth scroll | **Reject** |
| Image-sequence canvas scrub | **Reject** — Omni MP4s already exist |

## Out of scope

- Replacing Remotion film or Veo heroes
- Full WebGL scenes (Three.js / R3F)
- Global always-on soundtrack without opt-in
- Rewriting approved slide copy / disclosure language
