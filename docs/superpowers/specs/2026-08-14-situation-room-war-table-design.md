# Situation Room — War Room Table Design

**Date:** 2026-08-14  
**Status:** Ready for operator review  
**App:** `tools/org-command-center`  
**Surface:** `SituationRoom` + `OrgTheater` (canonical Jarvis UI)  
**Branch / worktree:** `feature/situation-room-ui-polish` · `.worktrees/situation-room-ui-polish`  
**Review:** [situation-room-ui-review canvas](/Users/cbsuperpatch/.cursor/projects/Users-cbsuperpatch-Desktop-ClaudeSkills/canvases/situation-room-ui-review.canvas.tsx)

## Problem

The Situation Room is supposed to be a live company you can read at a glance. Today it is a dense ops console sitting on top of a Three.js demo: a teal disc, glowing spheres, starfield, and bloom, with a header that also does portfolio CRUD, briefing, voice, and twelve competing actions. The org graph is a postage stamp. Operators cannot form a single next action or tell who is who without hovering.

## Approach (chosen)

**War Room Table, Glance-first.** Keep 3D as the product. The floor becomes a physical command table with etched org rings. Seats become terminals with persistent labels. The HUD is a thin viewport frame. Inspectors open on selection. Ops tables stay available, demoted to System.

This is Approach A from the review, with Glance as the default state from Approach C. Approach B (theater as radar) is rejected: it abandons the room.

| Wave | Theme | Outcome |
|------|--------|---------|
| **1** | Chrome | Thin context bar; theater owns ≥70% of a 1440×900 viewport; status line prefers the top threat; Run next hover previews the wake seat |
| **2** | Table | Furniture table (thickness, lip, reflection); closed room; etched rings; dept wedges + dept color |
| **3** | Seats | Terminals + collision-aware names + gaze hover + dept pinstripe |
| **4** | Light | Neutral key, cool rim, teal only on live work; local hover key |
| **5** | Inspect | Console on select; threat lights the matching seat; Esc / empty-table clear; j/k needs-you; double-click full report |
| **6** | Phase + copy | In-floor timeline; Lucide/text status; no emoji chrome |
| **7** | Motion + tour | Follow-cam on running seats; first-run coach marks |

Waves 1–7 are one implementation plan, sequenced. Do not ship Wave 2 without Wave 1: a prettier table under the current header still fails the job.

## Decisions locked

| Topic | Choice |
|-------|--------|
| Product name | **Situation Room** everywhere in UI and README. Drop “Jarvis Theater”, “Floor”, and “Org Command Center” from operator-facing chrome. |
| Operator verbs | **Run**, **Inspect**, **Brief**. Everything else is a menu or an inspector. |
| Home state | **Glance.** Full-bleed theater + thin bar + threat rail if any + one primary CTA. |
| Command | Existing **Ops tables**, opened from System. Not a second product, not a header twin. |
| Theater modes | Do not surface Floor / Assign / Outputs as 3D modes. Store camera mode stays `"floor"`. Assign and Outputs remain drawers. |
| Primary CTA | **Run next** is the only filled button in the context bar. |
| Search | Command deck stays. Trigger is a compact control in the bar plus `Cmd+K` / `Ctrl+K`. |
| Talk / Brief | Talk stays in the bar. Brief me stays in the bar as a text button. Brief CEO / digest / legacy voice stay under **Intelligence**. |
| Portfolio CRUD | Agency (disabled), customer, initiative, Add customer, Add initiative move into a **System → Workspace** sheet. Not in the hero. |
| Auto-spawn / voice health | System → Workspace… drawer only. |
| C-suite list on stage | Removed. The graph is the C-suite. |
| Activity strip | Removed as a permanent footer. Activity is a Command deck group and the Runs inspector. |
| Empty seat console | Do not render the right rail until a seat is selected. |
| Threat rail | Persistent only when `blockedSeats.length > 0`. When clear, show nothing (no “ALL CLEAR” card). |
| Camera | Locked high three-quarter as home. Gentle dolly on seat select. Free orbit allowed, not advertised. “Frame company” in Command deck resets look-at. |
| Follow-cam | On by default when ≥1 seat is running, no seat is selected, and the operator is not dragging the orbit. Tracks running work. Yields to inspect. |
| Glance status line | Prefer the top threat headline when `blockedSeats.length > 0`. Otherwise `mission.nextAction`. One sentence. |
| Run next preview | Hovering Run next ghost-highlights the seat that will receive work. Click path unchanged. |
| Deselect | Click empty table, or Esc when no dialog is open, clears selection, closes the console, and frames the company. |
| Needs-you keys | `j` / `k` cycle seats whose status is `blocked` or `needs_input`. Wrap. Command deck stays the search path. |
| Double-click | Double-click a seat opens the existing full report drawer. Single click still selects + console. |
| First-run tour | Four coach marks, once, `localStorage` key `sr-tour-v1`. Replay from System. |
| Dept color | Stable palette per department: wedge fill, label swatch, seat pinstripe. Status beacon always wins. |
| Bloom | Off by default. No bloom toggle in chrome. |
| Stars | Removed. |
| Phase chrome | No emoji (`⬜ 🔄 ✅ ⏭️`). Use text: Pending / In progress / Done / Skipped, plus Lucide marks on the rail. |
| Type scale | 11 / 13 / 16 / 22. IBM Plex Sans + IBM Plex Mono. No 28px NOW headline. |
| Radius | HUD corners 4px. Stop mixing 10px glass and 2px holos. |
| Accent | Keep `#3fd4be` for **live work only**. Surfaces stay near-black / slate. |
| Dead code | Leave `JarvisShell`, `ModeBar`, `FloorDashboard`, `KpiStrip` in the tree. Do not migrate back to them. Do not delete them in this plan. |
| Safety | No change to dispatch isolation, `needs_confirm`, blocker token confirm/cancel, or auto-spawn write rules. |

## Non-goals

- New 3D engine, GLB hero assets, or img2threejs sculpt pipeline
- Replacing LiveKit / OmniVoice / Whisper
- New intents, new seat report schema, or knowledge-graph UX
- Light mode
- Deleting `JarvisShell` and the unused Floor/Assign/Outputs shell
- Mobile-first redesign (keep current 600 / 900 / short-laptop contracts; Glance chrome must still fit)
- Pixel-perfect film look or Divine Eye scoring
- Minimap
- Audio ticks, film grain, or depth-of-field

## Success criteria

1. On a 1440×900 viewport in Glance, the theater stage is at least 70% of the window height.
2. An operator can name the current customer, initiative, phase, and the primary next action without opening a menu.
3. An operator can identify CEO, at least one manager, and that manager’s ICs without hovering.
4. Idle / running / blocked / needs-input read at rest via shape + label + beacon, not color alone.
5. Clicking a seat opens the seat console; clearing selection closes it and returns the camera to the company frame.
6. With zero blocked seats, the left overlay stack is empty.
7. No emoji appears as status chrome in the header, phase rail, or seat labels.
8. `prefers-reduced-motion: reduce` disables dolly, orbit rings, pulse, packet motion, follow-cam, gaze lift, and tour motion.
9. Existing confirmation, cancel-token, and dispatch-isolation tests still pass.
10. README operator language matches the chrome: Situation Room, Run, Inspect, Brief.
11. With a blocked seat, the context-bar status line shows that seat’s headline, not a generic next-action.
12. Esc or an empty-table click returns to the company frame and unmounts the seat console.
13. First visit shows the four-step tour; `sr-tour-v1` set means it does not show again until System → Replay tour.

## Information architecture

### Glance chrome (always)

One horizontal **context bar**, `j-hud-panel`, single row on ≥1100px:

| Slot | Content |
|------|---------|
| Identity | `Situation Room` (11px title) · customer name · initiative name · `Phase {n} {name}` as text |
| Status | One muted line from `glanceStatusLine()` (below). No progress ring. No spend. No threat paragraph. |
| Actions | `Run next` (primary, wake-preview on hover) · `Talk` · `Brief me` · Command deck trigger · Intelligence · System |

Progress percent, spend, parallel-track chips, OmniVoice line, and auto-spawn leave the bar. They live in **System → Status** as a compact definition list.

### System menu

System stays a dropdown on the context bar (existing `DropdownMenu`). It does not dump CRUD into the hero.

| Item | Behavior |
|------|----------|
| Workspace… | Opens `WorkspaceSheet` in the existing right `JarvisDrawer` |
| Ops tables | Existing ops toggle |
| Runs / Routines | Existing drawers |
| Theater | Existing visibility checkbox (never hide both theater and ops) |
| Follow running seats | Checkbox, default on. Disabled visually when reduced-motion is on. |
| Replay tour | Resets `sr-tour-v1` and starts the four marks |
| Refresh | Existing reload |

`WorkspaceSheet` is one drawer with two stacked sections: **Workspace** (disabled Agency select, customer, initiative, Add customer, Add initiative — same forms as today) and **Status** (progress %, done/active/pending, spend, OmniVoice, auto-spawn, last updated, follow-cam). Agency stays a disabled Velocity Agency select. Do not invent multi-agency switching.

### Glance status line

Pure helper `glanceStatusLine({ blockedSeats, nextAction })`:

1. If `blockedSeats` is non-empty, use the first row after the existing threat sort (blocked, then needs_input): `"{title}: {headline}"`.
2. Else use `mission.nextAction`.
3. Truncate to 96 characters with an ellipsis.

### Run next wake preview

While the Run next button is hovered or keyboard-focused, set `previewWakeSlug` on the Jarvis store to the seat `run_next` / spawn would wake (same owner resolution used today for the packet beam target). That seat gets a ghost selection torus and 0.6 opacity lift. Clearing hover/focus clears the preview. Reduced motion: torus only, no lift.

### Intelligence menu

Unchanged contents: Brief CEO, Brief digest, Legacy voice, Digest, Knowledge graph, Alerts. Do not put Talk or Brief me here.

### Inspectors (not chrome)

| Trigger | Surface |
|---------|---------|
| Click seat or Command deck seat | Seat console overlay, right, only while selected |
| Double-click seat | Existing full report drawer (`openReport(slug)`). Selection + console still apply. |
| Click threat row | Select that slug, pulse its terminal, open console |
| Threat RESOLVE / ANSWER | Existing confirm dialog / report questions |
| Assign / Outputs (Intelligence or Command deck) | Existing drawers |
| Run next | Existing spawn + confirm path |
| Esc (no dialog open) | Deselect, close console, Frame company |
| Click empty table (not a seat, bead, or plaque) | Same as Esc |
| `j` / `k` | Cycle needs-you seats (`blocked`, `needs_input`). Ignore when a text field or dialog has focus. |

## 3D — command table

The scene is a dark room with a table, not a void with a disc.

### Floor

Replace the transparent `circleGeometry` disc and the 0.12 cylinder podium with `CommandTable`:

- Table as furniture: top radius 9, thickness 0.18, beveled lip (torus or chamfer) `#1a2228`
- Top material: `#0c1014`, roughness 0.72, metalness 0.22, opacity 1
- Faint reflection: Drei `MeshReflectorMaterial` on the top only, `mirror` 0.12, `mixStrength` 0.35, blur `[80, 20]`. No extra post.
- Etched rings at the existing layout radii: manager `3.6`, IC `6.2`
- Ring material: thin torus, `#1a2a30`, emissive off
- Faint radial ticks every 30° on the IC ring
- Department wedges: filled ring segments on the IC band, opacity 0.10, color from `deptColor(dept)`
- Department labels as Drei `Html` on the IC arc, 10px mono, with a 6px swatch in `deptColor(dept)`, pointer-events none
- CEO dais: low cylinder at origin, radius 0.7, height 0.10, slightly lighter metal `#161c22`
- Closed room: inverted hemisphere or large `sphereGeometry` around the table, `#05070a`, roughness 1, no stars. Soft exponential fog `near 14` `far 28` color `#070b10`

No starfield. No grid overlay on the HUD panels that repeats the table grid. Contact shadows stay, scale 16, opacity 0.4.

### Department color

`deptColor(dept: string)` hashes the department name onto this fixed 8-swatch palette. Do not generate a new hue per seat.

| Index | Hex | Use |
|-------|-----|-----|
| 0 | `#3d6b8a` | slate blue |
| 1 | `#5a6b3d` | olive |
| 2 | `#6b4a6b` | plum |
| 3 | `#6b5a3d` | bronze |
| 4 | `#3d6b5a` | pine |
| 5 | `#6b3d3d` | brick |
| 6 | `#3d5a6b` | steel |
| 7 | `#5a3d6b` | iris |

Apply the color to: IC wedge fill, label swatch, and a 2px pinstripe on the seat terminal base. Never recolor the status beacon, selection torus, or live conduit. CEO uses no dept pinstripe.

### Seats — adapt `SeatNode.tsx` in place

Keep the `SeatNode` export and test path. Change the mesh and labels; do not add a parallel `SeatTerminal.tsx`.

| Rank | Silhouette | Rest label |
|------|------------|------------|
| CEO | Dais-mounted terminal, radius 0.38 equivalent | Title, always |
| Manager | Short box console (0.36 × 0.16 × 0.28) | Title, always |
| IC | Smaller plate (0.22 × 0.10 × 0.18) | Title, always |

Title is on at rest. If two titles overlap in screen space, the idle (or farther) label hides; the selected, preview, or needs-you label always wins. When the camera distance is greater than 16, rest labels collapse to the first word plus the beacon.

Slug, phase, and goal are hover-only, and only after a **150ms dwell**. Crossing the ring must not flicker cards.

Gaze hover (no dwell): scale the terminal to 1.02 and enable a local point light at the seat, intensity 0.45, color `#f2f0e8`. Reduced motion: no scale, light only.

Status is a **beacon** on the terminal, not a full-body emissive wash:

| Status | Beacon | Extra |
|--------|--------|-------|
| idle | Dark pip `#2a3a40` | No orbit |
| running | Teal pip + orbit ring | Pulse only if motion allowed |
| active | Teal pip, no pulse | Slow orbit if motion allowed |
| blocked | Red pip + `BLOCKED` cue | |
| needs_input | Gold pip + `ANSWER` cue | |
| escalate | Amber pip + `ESCALATE` cue | |
| done | Green pip, no orbit | |
| paused | Muted pip | |

Body material stays dark metal (`#1a2228`, roughness 0.45, metalness 0.55) plus the dept pinstripe. Selection is a thin teal torus on the table around the terminal, not a brighter body. A threat-selected or `j`/`k`-focused seat uses the same torus plus a 1.2s pulse (disabled under reduced motion). Wake preview uses a dashed / 0.5-opacity torus.

### Edges

Keep reporting lines. Draw them as slight arcs (quadratic, lift Y 0.25 at midpoint), not straight segments. Idle opacity 0.35, `#1f4a44`. If either end is running, opacity 0.8 and teal. If either end is blocked, `#e06060` at 0.7.

### Phase rail

Replace floating `PhaseBead` spheres. A 2.2-radius arc of marks on the table around the dais, Y = 0.06:

- Pending: empty square
- In progress: filled amber diamond
- Done: filled green tick plate
- Skipped: muted dash

Selected phase raises the mark 0.04 and shows a 11px name label. Click still calls `selectPhase`. Selectable whenever the operator can assign or inspect (today: assign + floor). Because theater mode stays `"floor"`, the rail is always selectable.

### Packet beam

Keep the existing spawn beam. Restyle the mesh to a short capsule streak along the conduit. Same `onDone` contract. No motion when reduced-motion is on: snap to end and fire `onDone` on the next frame.

### Lighting

```
ambientLight     intensity 0.28  color #e8e6e0
directionalLight intensity 0.95  color #f2f0e8  position [6, 10, 4]   key, castShadow
directionalLight intensity 0.35  color #9bb8c4  position [-4, 3, -6]  rim, no shadow
```

No teal `pointLight` at the origin. Teal exists only on running beacons and live conduits.

Do not mount `EffectComposer`, Bloom, or Vignette.

### Camera

`deriveCameraLookAt` for Glance (store mode `"floor"`):

- No selection, follow-cam off or no running seats: `[0, 6.5, 13]` look at `[0, 0, 0]`
- Selection: existing offset `[target + 2.8, +3, +5.5]` looking at the seat
- Follow-cam, one running seat, no selection: `[target + 3.4, +4.2, +7]` looking at that seat
- Follow-cam, two or more running seats, no selection: same home eye `[0, 6.5, 13]`, look at the centroid of running seats
- Reduced motion: `setLookAt(..., false)` and follow-cam does not run

Follow-cam rules:

- Default on (`localStorage` `sr-follow-cam` = `1` when unset).
- Off when the operator is dragging `CameraControls`, when a seat is selected, when a dialog is open, or when reduced-motion is on.
- After orbit drag ends, stay off until Frame company, Esc, or empty-table click.
- Lerp look-at at 0.08 per frame. Do not lerp while reduced-motion is on.

`CameraControls` stay. Min distance 5, max 20. Do not add a visible “orbit hint.” Command deck gains a **Frame company** item that clears selection and restores the home look-at.

## HUD composition

```
┌─────────────────────────────────────────────────────────────┐
│ Situation Room  Acme · Web  Phase 4 Research   [Run next]   │
│ Next: unblock CFO on spend cap     Talk  Brief  ⌘K  ⋯  ⚙   │
├─────────────────────────────────────────────────────────────┤
│ [Threats if any]                                     [Seat] │
│                                                             │
│                     COMMAND TABLE                           │
│                                                             │
│                                              Voice FAB      │
└─────────────────────────────────────────────────────────────┘
```

Overlays use the existing `j-overlay-stack` slots. Left is threats only. Right is seat console only when `selectedSlug` is set. Bottom overlay is gone.

Command deck trigger moves from `j-command-launch` (center of the stage) into the context bar so it does not cover the CEO dais.

## First-run tour

Four marks, in order. Each is a 13px glass card with Next / Skip. Skip and the final Next write `localStorage.sr-tour-v1 = "1"`.

| Step | Anchor | Copy |
|------|--------|------|
| 1 | Command table center | This table is the company. Size is rank. The pip is status. |
| 2 | Run next | Run next wakes the next seat. Hover to see who. |
| 3 | Command deck trigger | Search any seat or task. |
| 4 | Threat rail if present, else context-bar status line | When someone is stuck, they show here and light up on the table. |

No spotlight dim on the rest of the UI (that would hide the table). Arrow only. Reduced motion: cards appear with no slide. Replay from System does not auto-start on every refresh.

## Data flow

No new APIs. Same snapshot, digest, seat report, and confirm tokens.

| Source | Glance use |
|--------|------------|
| `snap.activeProject` / customers | Context bar identity; Workspace drawer selects |
| `snap.mission` | Phase name; `nextAction` fallback for `glanceStatusLine` |
| `digest.blockedSeats` | Threat rail; glance status line; needs-you cycle |
| `useJarvisStore.selectedSlug` | Camera dolly + seat console mount |
| `previewWakeSlug` | Run next hover ghost |
| `followCam` | Camera target when no selection |
| `seatWorkContext` | Beacon status (unchanged rules) |
| `forceOrgLayout` | Unchanged radii; table rings must match |

`SituationRoom` stays the state owner. Extract chrome into `MissionContextBar` so the 2,400-line page is not the place new layout lands. Do not rewrite fetch/subscribe logic.

## Tokens

Keep `[data-theme="jarvis"]` in `theme.css`. Required deltas:

| Token | Value | Why |
|-------|--------|-----|
| `--j-bg` | `#070b10` | Unchanged |
| `--j-ink` | `#e8f4f2` | Unchanged |
| `--j-muted` | `#8aa3a0` | Unchanged |
| `--j-accent` | `#3fd4be` | Live work only |
| `--j-radius` | `4px` | Unify panels, buttons, chips |
| `--j-fs-micro` | `11px` | Titles, mono |
| `--j-fs-body` | `13px` | Controls |
| `--j-fs-title` | `16px` | Seat console heading |
| `--j-fs-display` | `22px` | Unused in Glance bar; reserved |

Buttons use `--j-radius`. `.j-heading` in the Glance bar is 16px, not 22px. The 22px size is for inspector titles only.

## Error, empty, loading

- Initial load: keep the skeleton shell. Replace the orb with a flat table silhouette (rounded rect), not a pulsing circle.
- Snapshot error: one `j-error` line under the context bar. Theater does not mount.
- Zero threats: no left overlay.
- No seat selected: no right overlay. Do not show “Select a node…”.
- No activity: no footer empty state.
- Reduced motion: no skeleton shimmer (already gated in CSS); add the same gate to any new table shimmer.

## Accessibility

- Context bar is a `header` with one `h1`: the initiative or idea name at 16px, not a 28px NOW line.
- Command deck and drawers keep Radix focus trap / Escape / restore.
- Seat terminals keep mesh click plus Command deck as the keyboard path. Do not require WebGL for the only way to select a seat.
- Status cues stay text (`BLOCKED`, `ANSWER`) in addition to beacon color.
- Skip link: “Skip to command table” is not required; Command deck is the skip.
- Contrast: muted text on `#070b10` must stay ≥4.5:1. Do not lighten `--j-muted` below current without a contrast check.
- `j` / `k` and Esc are documented in the Command deck empty-state hint.
- Dept color is never the only status signal.

## Testing

TDD. Tests land in the worktree on this branch.

| Contract | Test |
|----------|------|
| Glance chrome slots | `MissionContextBar.test.tsx`: render shows Run next, Talk, Brief me, Command trigger; does not show Add customer, Add initiative, spend, progress ring, Auto-spawn |
| Theater height | Theme or layout test: Glance grid is `auto 1fr` and the bar has no wrapped CRUD form |
| Persistent labels | `SeatNode` test: title HTML is present when not hovered and drawer is closed |
| No emoji chrome | Theme/source test: SituationRoom + Phase rail files do not contain `⬜🔄✅⏭️` as rendered status |
| Threat rail mount | SituationRoom test: zero blocked seats → no `aria-label="Threat rail"`; one blocked seat → rail present |
| Console mount | SituationRoom test: `selectedSlug` null → no seat console; set slug → console present |
| Glance status line | `glanceStatusLine` prefers top blocked headline over `nextAction` |
| Deselect | Esc / empty-table handler clears `selectedSlug` |
| Needs-you cycle | `j` then `k` walks a two-seat blocked list and wraps |
| Wake preview | Hover Run next sets `previewWakeSlug`; leave clears it |
| Follow-cam | Disabled when selected, when orbiting, and when reduced-motion |
| Double-click | Seat double-click calls `openReport(slug)` |
| Tour | First mount with empty `sr-tour-v1` shows step 1; Skip writes the key |
| Dept color | Same dept name always maps to the same palette index |
| Reduced motion | Existing `deriveSeatVisualBehavior` tests stay; packet beam snaps and calls `onDone`; follow-cam off |
| Safety | Existing confirmation and dispatch tests stay green |

Do not add Playwright for this plan. OCC’s contract suite is Vitest.

## File layout

| File | Role |
|------|------|
| `src/jarvis/hud/MissionContextBar.tsx` | Glance header; System / Intelligence stay as children |
| `src/jarvis/hud/WorkspaceSheet.tsx` | Relocated portfolio CRUD + status + auto-spawn + follow-cam + replay tour |
| `src/jarvis/hud/glance-status.ts` | `glanceStatusLine` |
| `src/jarvis/hud/FirstRunTour.tsx` | Four coach marks |
| `src/jarvis/scene/dept-color.ts` | `deptColor` palette hash |
| `src/jarvis/scene/CommandTable.tsx` | Furniture table, room shell, rings, wedges, ticks, dais |
| `src/jarvis/scene/nodes/SeatNode.tsx` | Rank silhouettes, beacon, persistent title (adapt in place) |
| `src/jarvis/scene/nodes/PhaseBead.tsx` | In-floor phase marks (adapt in place; one bead per phase on the rail) |
| `src/jarvis/scene/ReportEdges.tsx` | Arced conduits |
| `src/jarvis/scene/OrgTheater.tsx` | Lights, room, follow-cam, no Stars, no bloom, mount table |
| `src/jarvis/hud/theme.css` | Radius, type, Glance grid, overlay slots |
| `src/jarvis/hud/needs-you.ts` | Ordered `blocked` / `needs_input` slugs for `j` / `k` |
| `src/jarvis/SituationRoom.tsx` | Compose bar + theater + tour + conditional overlays; no new fetch logic |
| `README.md` | Operator language aligned to this spec |

Adapt `SeatNode.tsx` and `PhaseBead.tsx` in place. Do not leave a second unused implementation.

## Documentation

Update `tools/org-command-center/README.md` in the same plan: Situation Room, Glance chrome, Command deck, System → Workspace drawer, threat-rail-when-needed, follow-cam, j/k, Esc to frame, first-run tour, no Floor/Assign/Outputs mode bar.

## Out of scope for implementers

If a change is not in Waves 1–7, Decisions locked, or File layout, it is out of scope. Do not restyle Voice FAB beyond staying clear of the table. Do not add a minimap. Do not add audio ticks, film grain, or depth-of-field.
