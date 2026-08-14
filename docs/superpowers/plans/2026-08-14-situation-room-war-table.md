# Situation Room War Table Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the Situation Room into a Glance-first war-room table: thin chrome, furniture 3D, inspect-on-select, follow-cam, and a first-run tour.

**Architecture:** Keep `SituationRoom` as the state owner and `OrgTheater` as the scene. Extract Glance chrome and pure helpers (`glanceStatusLine`, `deptColor`, `needsYouSlugs`) so the 3D and HUD can change without rewriting fetch/subscribe. Adapt `SeatNode` and `PhaseBead` in place. No new APIs. No dispatch/confirm contract changes.

**Tech Stack:** Vite + React 19 + Vitest + Testing Library + R3F + Drei + existing jarvis theme (`tools/org-command-center`).

**Spec:** `docs/superpowers/specs/2026-08-14-situation-room-war-table-design.md`

**Worktree:** `.worktrees/situation-room-ui-polish` on `feature/situation-room-ui-polish`

## Global Constraints

- Product name in chrome/README: **Situation Room**. No “Jarvis Theater”, “Floor”, or “Org Command Center” in operator-facing chrome.
- Verbs: **Run**, **Inspect**, **Brief**.
- Store camera mode stays `"floor"`. Assign/Outputs stay drawers.
- Run next is the only filled button in the context bar.
- No emoji status chrome (`⬜🔄✅⏭️`).
- Type scale 11 / 13 / 16 / 22. HUD radius 4px. Accent `#3fd4be` for live work only.
- No `EffectComposer` / Bloom / Vignette / Stars.
- `prefers-reduced-motion: reduce` disables dolly, orbit rings, pulse, packet motion, follow-cam, gaze lift, tour motion.
- Do not change dispatch isolation, `needs_confirm`, blocker token confirm/cancel, or auto-spawn write rules.
- Do not delete `JarvisShell`, `ModeBar`, `FloorDashboard`, `KpiStrip`.
- TDD: failing test first. Work only in this worktree. Commit after each task.
- Test command cwd: `tools/org-command-center`. Run: `npm test -- <file>`.

## File structure

| File | Responsibility |
|------|----------------|
| `src/jarvis/hud/glance-status.ts` | `glanceStatusLine` |
| `src/jarvis/hud/needs-you.ts` | `needsYouSlugs`, `nextNeedsYouSlug` |
| `src/jarvis/scene/dept-color.ts` | `DEPT_PALETTE`, `deptColor` |
| `src/jarvis/hud/MissionContextBar.tsx` | Glance header |
| `src/jarvis/hud/WorkspaceSheet.tsx` | Relocated CRUD + status + follow-cam + replay tour |
| `src/jarvis/hud/FirstRunTour.tsx` | Four coach marks |
| `src/jarvis/scene/CommandTable.tsx` | Furniture table, room, rings, wedges, dais |
| `src/jarvis/state/useJarvisStore.ts` | `previewWakeSlug`, `followCam`, `orbiting` |
| `src/jarvis/layout/forceOrgLayout.ts` | Follow-cam look-at |
| `src/jarvis/scene/nodes/SeatNode.tsx` | Terminals, labels, gaze, pinstripe |
| `src/jarvis/scene/nodes/PhaseBead.tsx` | In-floor marks |
| `src/jarvis/scene/ReportEdges.tsx` | Arced conduits |
| `src/jarvis/scene/OrgTheater.tsx` | Lights, table, no stars/bloom, empty-table click |
| `src/jarvis/hud/MissionCommandControls.tsx` | Drop Assign/Outputs from primary row; wake preview hover; System items |
| `src/jarvis/hud/ThreatRail.tsx` | Hide when empty; selecting a row is enough (parent pulses seat) |
| `src/jarvis/SituationRoom.tsx` | Compose Glance; conditional overlays; j/k/Esc; double-click report |
| `src/jarvis/hud/theme.css` | Tokens + Glance grid |
| `README.md` | Operator language |

---

### Task 1: Glance pure helpers

**Files:**
- Create: `tools/org-command-center/src/jarvis/hud/glance-status.ts`
- Create: `tools/org-command-center/src/jarvis/hud/glance-status.test.ts`
- Create: `tools/org-command-center/src/jarvis/hud/needs-you.ts`
- Create: `tools/org-command-center/src/jarvis/hud/needs-you.test.ts`
- Create: `tools/org-command-center/src/jarvis/scene/dept-color.ts`
- Create: `tools/org-command-center/src/jarvis/scene/dept-color.test.ts`

**Interfaces:**
- Consumes: `BlockedSeatDigest` fields `title`, `slug`, `headline`, `status`
- Produces:
  - `glanceStatusLine({ blockedSeats, nextAction }): string`
  - `needsYouSlugs(blocked): string[]`
  - `nextNeedsYouSlug(slugs, current, direction): string | null`
  - `DEPT_PALETTE: readonly string[]` (8 hexes from spec)
  - `deptColor(dept: string): string`

- [ ] **Step 1: Write the failing tests**

```ts
// glance-status.test.ts
import { describe, expect, it } from "vitest";
import { glanceStatusLine } from "./glance-status";

describe("glanceStatusLine", () => {
  it("prefers the top blocked headline over nextAction", () => {
    expect(
      glanceStatusLine({
        blockedSeats: [
          { title: "CFO", slug: "cfo", headline: "needs spend cap", status: "blocked" },
        ],
        nextAction: "Run research",
      }),
    ).toBe("CFO: needs spend cap");
  });

  it("falls back to nextAction when the rail is clear", () => {
    expect(glanceStatusLine({ blockedSeats: [], nextAction: "Run research" })).toBe(
      "Run research",
    );
  });

  it("truncates to 96 characters", () => {
    const line = glanceStatusLine({
      blockedSeats: [],
      nextAction: "x".repeat(120),
    });
    expect(line.length).toBe(96);
    expect(line.endsWith("…")).toBe(true);
  });
});
```

```ts
// needs-you.test.ts
import { describe, expect, it } from "vitest";
import { needsYouSlugs, nextNeedsYouSlug } from "./needs-you";

describe("needsYou", () => {
  it("orders blocked before needs_input and skips other statuses", () => {
    expect(
      needsYouSlugs([
        { slug: "pm", status: "needs_input" },
        { slug: "cfo", status: "blocked" },
        { slug: "ceo-strategist", status: "running" },
      ]),
    ).toEqual(["cfo", "pm"]);
  });

  it("cycles forward and wraps", () => {
    expect(nextNeedsYouSlug(["cfo", "pm"], "cfo", 1)).toBe("pm");
    expect(nextNeedsYouSlug(["cfo", "pm"], "pm", 1)).toBe("cfo");
  });

  it("starts at the first slug when nothing is selected", () => {
    expect(nextNeedsYouSlug(["cfo", "pm"], null, 1)).toBe("cfo");
  });
});
```

```ts
// dept-color.test.ts
import { describe, expect, it } from "vitest";
import { DEPT_PALETTE, deptColor } from "./dept-color";

describe("deptColor", () => {
  it("is stable for the same department name", () => {
    expect(deptColor("product")).toBe(deptColor("product"));
  });

  it("maps onto the eight-swatch palette", () => {
    expect(DEPT_PALETTE).toHaveLength(8);
    expect(DEPT_PALETTE).toContain(deptColor("finance"));
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd tools/org-command-center && npm test -- src/jarvis/hud/glance-status.test.ts src/jarvis/hud/needs-you.test.ts src/jarvis/scene/dept-color.test.ts`

Expected: FAIL — modules not found.

- [ ] **Step 3: Write minimal implementation**

`glanceStatusLine`: if `blockedSeats[0]`, return `"{title}: {headline}"` (title fallback slug); else `nextAction`; if length > 96, `slice(0, 95) + "…"`.

`needsYouSlugs`: filter `blocked` then `needs_input`, preserve relative order within each rank.

`nextNeedsYouSlug`: empty → null; current null or missing → first; else `(i + direction + n) % n`.

`deptColor`: djb2 hash of lowercase dept onto `DEPT_PALETTE` exactly:

`#3d6b8a #5a6b3d #6b4a6b #6b5a3d #3d6b5a #6b3d3d #3d5a6b #5a3d6b`

- [ ] **Step 4: Run tests to verify they pass**

Run: same command. Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add tools/org-command-center/src/jarvis/hud/glance-status.ts tools/org-command-center/src/jarvis/hud/glance-status.test.ts tools/org-command-center/src/jarvis/hud/needs-you.ts tools/org-command-center/src/jarvis/hud/needs-you.test.ts tools/org-command-center/src/jarvis/scene/dept-color.ts tools/org-command-center/src/jarvis/scene/dept-color.test.ts
git commit -m "feat(occ): add glance status, needs-you cycle, and dept color helpers"
```

---

### Task 2: Jarvis store + follow-cam look-at

**Files:**
- Modify: `tools/org-command-center/src/jarvis/state/useJarvisStore.ts`
- Modify: `tools/org-command-center/src/jarvis/state/useJarvisStore.test.tsx`
- Modify: `tools/org-command-center/src/jarvis/layout/forceOrgLayout.ts`
- Modify: `tools/org-command-center/src/jarvis/layout/forceOrgLayout.test.ts`

**Interfaces:**
- Consumes: `Vec3`, existing `deriveCameraLookAt`
- Produces: `JarvisState.previewWakeSlug: string | null`, `followCam: boolean`, `orbiting: boolean`
  - `setPreviewWakeSlug`, `setFollowCam`, `setOrbiting` on the store hook
  - `deriveCameraLookAt(layout, selectedSlug, mode, opts?: { followSlug?: string | null; followCentroid?: Vec3 | null })`

- [ ] **Step 1: Write the failing tests**

Add to `useJarvisStore.test.tsx`:

```ts
it("stores a wake preview slug and follow-cam flag", () => {
  setJarvisState({ previewWakeSlug: "cfo", followCam: false, orbiting: true });
  expect(getJarvisState().previewWakeSlug).toBe("cfo");
  expect(getJarvisState().followCam).toBe(false);
  expect(getJarvisState().orbiting).toBe(true);
});
```

Add to `forceOrgLayout.test.ts`:

```ts
it("dollies to a follow slug when nothing is selected", () => {
  const layout = new Map([["cfo", { x: 3, y: 0, z: 0 }]]);
  expect(deriveCameraLookAt(layout, null, "floor", { followSlug: "cfo" })).toEqual([
    6.4, 4.2, 7, 3, 0, 0,
  ]);
});

it("looks at a running centroid from the home eye", () => {
  const look = deriveCameraLookAt(new Map(), null, "floor", {
    followCentroid: { x: 1, y: 0, z: 2 },
  });
  expect(look).toEqual([0, 6.5, 13, 1, 0, 2]);
});
```

Also update the existing no-selection floor camera expectation from `[0, 6, 12, 0, 0, 0]` to `[0, 6.5, 13, 0, 0, 0]`.

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd tools/org-command-center && npm test -- src/jarvis/state/useJarvisStore.test.tsx src/jarvis/layout/forceOrgLayout.test.ts`

Expected: FAIL — unknown fields / old camera tuple.

- [ ] **Step 3: Write minimal implementation**

Extend `JarvisState` defaults: `previewWakeSlug: null`, `followCam: true`, `orbiting: false`.

`MODE_CAMERA.floor = [0, 6.5, 13, 0, 0, 0]`.

`deriveCameraLookAt`: if `mode === "floor"` and `selectedSlug`, keep existing inspect offset `[+2.8, +3, +5.5]`. Else if `followSlug` in layout, return `[tx+3.4, ty+4.2, tz+7, tx, ty, tz]`. Else if `followCentroid`, return `[0, 6.5, 13, cx, cy, cz]`. Else `MODE_CAMERA[mode]`.

- [ ] **Step 4: Run tests to verify they pass**

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add tools/org-command-center/src/jarvis/state/useJarvisStore.ts tools/org-command-center/src/jarvis/state/useJarvisStore.test.tsx tools/org-command-center/src/jarvis/layout/forceOrgLayout.ts tools/org-command-center/src/jarvis/layout/forceOrgLayout.test.ts
git commit -m "feat(occ): extend Jarvis store and camera for wake preview and follow-cam"
```

---

### Task 3: Glance chrome

**Files:**
- Create: `tools/org-command-center/src/jarvis/hud/MissionContextBar.tsx`
- Create: `tools/org-command-center/src/jarvis/hud/MissionContextBar.test.tsx`
- Create: `tools/org-command-center/src/jarvis/hud/WorkspaceSheet.tsx`
- Modify: `tools/org-command-center/src/jarvis/hud/MissionCommandControls.tsx`
- Modify: `tools/org-command-center/src/jarvis/hud/MissionCommandControls.test.tsx`
- Modify: `tools/org-command-center/src/jarvis/SituationRoom.tsx`
- Modify: `tools/org-command-center/src/jarvis/hud/theme.css`

**Interfaces:**
- Consumes: `glanceStatusLine`, store `setPreviewWakeSlug`, existing MissionCommandControls callbacks
- Produces: Glance header with identity + status + Run next / Talk / Brief me / Command deck / Intelligence / System. No Add customer, Add initiative, spend, progress ring, Auto-spawn in the bar.

- [ ] **Step 1: Write the failing chrome test**

```ts
// MissionContextBar.test.tsx
// @vitest-environment jsdom
it("shows Glance slots and hides portfolio CRUD", () => {
  render(
    <div data-theme="jarvis">
      <MissionContextBar
        customerName="Acme"
        initiativeName="Web"
        phaseLabel="Phase 4 Research"
        ideaName="Virtual Company"
        statusLine="CFO: needs spend cap"
        commandSlot={<button type="button">Command deck</button>}
        controls={<button type="button">Run next</button>}
      />
    </div>,
  );
  expect(screen.getByText("Situation Room")).toBeTruthy();
  expect(screen.getByRole("heading", { name: "Virtual Company" })).toBeTruthy();
  expect(screen.getByText("CFO: needs spend cap")).toBeTruthy();
  expect(screen.queryByText("Add customer")).toBeNull();
  expect(screen.queryByText("Add initiative")).toBeNull();
  expect(screen.queryByText("Auto-spawn on queue")).toBeNull();
});
```

Update `MissionCommandControls.test.tsx`: Assign and Outputs must **not** be visible as primary buttons. They move into Intelligence (Assign/Outputs items) or stay as Intelligence? Spec: Assign/Outputs remain drawers, not header twins. Put **Assign** and **Outputs** in the Intelligence menu. Primary row: Run next only. Voice cluster: Talk, Brief me.

Add props: `onPreviewWakeStart`, `onPreviewWakeEnd`, `followCam`, `onToggleFollowCam`, `onReplayTour`.

Test: hover Run next calls `onPreviewWakeStart`; leave calls `onPreviewWakeEnd`.

System menu gains Follow running seats checkbox and Replay tour.

- [ ] **Step 2: Run test to verify it fails**

Run: `cd tools/org-command-center && npm test -- src/jarvis/hud/MissionContextBar.test.tsx src/jarvis/hud/MissionCommandControls.test.tsx`

Expected: FAIL — `MissionContextBar` missing; Assign still in primary row.

- [ ] **Step 3: Write minimal implementation**

`MissionContextBar`: `header.j-hud-panel.j-mission-header` with title “Situation Room”, customer · initiative · phase, `h1` idea at 16px, muted status line, `children`/`controls`/`commandSlot`.

Move portfolio CRUD + spend + progress + auto-spawn + OmniVoice + follow-cam + replay into `WorkspaceSheet` opened from System → Workspace….

`SituationRoom` header becomes `<MissionContextBar … statusLine={glanceStatusLine({ blockedSeats: digest?.blockedSeats ?? [], nextAction: m.nextAction })} />`.

`theme.css`: `--j-radius: 4px`; `.j-situation-shell` rows `auto 1fr`; `.j-heading` in the bar 16px; unify `.j-hud-panel` radius 4px.

Wake preview: `onMouseEnter`/`onFocus` on Run next → `setPreviewWakeSlug(phaseOwnerSlug)`; leave/blur → `null`. Resolve owner the same way `OrgTheater` does: `snap.org.phaseOwners.find(p => p.phase === currentPhase)?.managerOwner ?? null`.

Command deck trigger: move into the bar (`showTrigger` stays true but parent is the bar, not `j-command-launch` over the CEO).

- [ ] **Step 4: Run tests to verify they pass**

Also run: `npm test -- src/jarvis/hud/MissionCommandControls.test.tsx src/jarvis/SituationRoom.confirmation.test.tsx`

Expected: PASS. Confirmation tests unchanged.

- [ ] **Step 5: Commit**

```bash
git add tools/org-command-center/src/jarvis/hud/MissionContextBar.tsx tools/org-command-center/src/jarvis/hud/MissionContextBar.test.tsx tools/org-command-center/src/jarvis/hud/WorkspaceSheet.tsx tools/org-command-center/src/jarvis/hud/MissionCommandControls.tsx tools/org-command-center/src/jarvis/hud/MissionCommandControls.test.tsx tools/org-command-center/src/jarvis/SituationRoom.tsx tools/org-command-center/src/jarvis/hud/theme.css
git commit -m "feat(occ): collapse Situation Room chrome into Glance context bar"
```

---

### Task 4: Command table scene

**Files:**
- Create: `tools/org-command-center/src/jarvis/scene/CommandTable.tsx`
- Modify: `tools/org-command-center/src/jarvis/scene/OrgTheater.tsx`
- Modify: `tools/org-command-center/src/jarvis/scene/OrgTheater.test.tsx`
- Modify: `tools/org-command-center/src/jarvis/scene/ReportEdges.tsx`
- Modify: `tools/org-command-center/src/jarvis/layout/forceOrgLayout.ts` (export `MANAGER_RING` and `IC_RING` as `3.6` and `6.2`)

**Interfaces:**
- Consumes: `deptColor`, roster depts, `MANAGER_RING`, `IC_RING`
- Produces: `<CommandTable depts={string[]} />` — furniture table, room shell, rings, wedges, ticks, dais

- [ ] **Step 1: Write the failing source contract test**

Replace the OrgTheater starfield-speed assertion with:

```ts
it("does not mount a starfield or bloom composer", () => {
  const source = readFileSync("src/jarvis/scene/OrgTheater.tsx", "utf8");
  expect(source).not.toMatch(/<Stars\b/);
  expect(source).not.toMatch(/EffectComposer/);
  expect(source).toMatch(/CommandTable/);
  expect(source).toMatch(/ambientLight/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Expected: FAIL — file still contains `<Stars` and `EffectComposer`.

- [ ] **Step 3: Write minimal implementation**

`CommandTable`: cylinder top r=9 h=0.18; lip torus; `MeshReflectorMaterial` if available from drei (fallback `meshStandardMaterial` if the import fails types); rings at 3.6 and 6.2; wedges via `ringGeometry` segments colored with `deptColor`; ticks every 30°; dais r=0.7 h=0.10; inverted hemisphere room `#05070a`; fog on the Canvas via `<fog attach="fog" args={["#070b10", 14, 28]} />`.

`OrgTheater` lights exactly as spec. Remove Stars, EffectComposer, Bloom, Vignette, old disc/cylinder. Mount `<CommandTable depts={[...new Set(roster.map(r => r.dept))].sort()} />`.

`ReportEdges`: quadratic mid-lift 0.25 using `QuadraticBezierCurve3` sampled to a `Line` (or three points: a, mid, b as two segments). Idle `#1f4a44` 0.35.

Empty-table click: add a full-table mesh `onClick` that calls `selectSlug(null)` when the click target is the table (stopPropagation on seats already).

- [ ] **Step 4: Run tests**

Run: `npm test -- src/jarvis/scene/OrgTheater.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add tools/org-command-center/src/jarvis/scene/CommandTable.tsx tools/org-command-center/src/jarvis/scene/OrgTheater.tsx tools/org-command-center/src/jarvis/scene/OrgTheater.test.tsx tools/org-command-center/src/jarvis/scene/ReportEdges.tsx tools/org-command-center/src/jarvis/layout/forceOrgLayout.ts
git commit -m "feat(occ): replace theater disc with a furniture command table"
```

---

### Task 5: Seat terminals and phase rail

**Files:**
- Modify: `tools/org-command-center/src/jarvis/scene/nodes/SeatNode.tsx`
- Modify: `tools/org-command-center/src/jarvis/scene/sceneHtml.test.ts` (or add `SeatNode` source/contract tests)
- Create: `tools/org-command-center/src/jarvis/scene/nodes/SeatNode.test.tsx`
- Modify: `tools/org-command-center/src/jarvis/scene/nodes/PhaseBead.tsx`
- Modify: `tools/org-command-center/src/jarvis/scene/OrgTheater.tsx` (pass `previewWakeSlug`, `dept`)

**Interfaces:**
- Consumes: `deptColor`, `previewWakeSlug`, existing `SeatVisualStatus`
- Produces: rank silhouettes, persistent title Html, 150ms hover card, gaze scale 1.02, dept pinstripe, preview torus

- [ ] **Step 1: Write the failing test**

```ts
// SeatNode.test.tsx — source contract + jsdom Html
it("renders the seat title at rest when the drawer is closed", () => {
  render(
    <SeatNode
      seat={{ slug: "cfo", title: "CFO", level: "manager", dept: "finance", reportsTo: "ceo-strategist" }}
      position={{ x: 0, y: 0, z: 0 }}
      status="idle"
      reducedMotion
      onSelect={vi.fn()}
    />,
  );
  // If R3F Html is mocked, assert source instead:
});
```

Safer source contract (match existing OrgTheater style):

```ts
const source = readFileSync("src/jarvis/scene/nodes/SeatNode.tsx", "utf8");
expect(source).toMatch(/seat\.title/);
expect(source).toMatch(/boxGeometry/);
expect(source).not.toMatch(/sphereGeometry/);
expect(source).toMatch(/deptColor/);
```

PhaseBead source: no `⬜` `🔄` `✅` `⏭️` in rendered label; use Pending / In progress / Done / Skipped text.

- [ ] **Step 2: Run test to verify it fails**

Expected: FAIL — still `sphereGeometry`.

- [ ] **Step 3: Write minimal implementation**

CEO: keep sphere-equivalent on dais or short cylinder r=0.38. Manager: `boxGeometry` 0.36×0.16×0.28. IC: 0.22×0.10×0.18. Body `#1a2228`. Beacon pip as a small sphere on top using `STATUS_COLOR`. Persistent title Html at rest when `showHtmlLabels`. Hover card after 150ms timeout (clear on out). Gaze: `scale` 1.02 unless `reducedMotion`. Pinstripe: thin box/ring using `deptColor(seat.dept)` except CEO. Preview: if `previewWakeSlug === seat.slug`, dashed torus opacity 0.5.

PhaseBead: position on table Y=0.06, radius 2.2 (already). Replace sphere with square/diamond/tick/dash by status. Label text without emoji.

- [ ] **Step 4: Run tests**

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add tools/org-command-center/src/jarvis/scene/nodes/SeatNode.tsx tools/org-command-center/src/jarvis/scene/nodes/SeatNode.test.tsx tools/org-command-center/src/jarvis/scene/nodes/PhaseBead.tsx tools/org-command-center/src/jarvis/scene/OrgTheater.tsx
git commit -m "feat(occ): give seats terminal silhouettes and an in-floor phase rail"
```

---

### Task 6: Inspect interactions

**Files:**
- Modify: `tools/org-command-center/src/jarvis/SituationRoom.tsx`
- Modify: `tools/org-command-center/src/jarvis/hud/ThreatRail.tsx`
- Modify: `tools/org-command-center/src/jarvis/hud/ThreatRail.test.tsx`
- Create: `tools/org-command-center/src/jarvis/SituationRoom.glance.test.tsx` (jsdom, mock theater)

**Interfaces:**
- Consumes: `needsYouSlugs`, `nextNeedsYouSlug`, `openReport`
- Produces: conditional ThreatRail and SeatConsole; Esc/empty-table deselect; j/k cycle; double-click report

- [ ] **Step 1: Write the failing tests**

ThreatRail: when `blocked={[]}` the parent should not render it. Test in SituationRoom.glance or ThreatRail — spec says no ALL CLEAR card. Change ThreatRail empty render to `null` **or** parent omits the component. Prefer parent omit + ThreatRail may still render ALL CLEAR if called; parent test is the contract.

```ts
it("does not mount the threat rail when there are no blocked seats", () => {
  // render SituationRoom with mocked fetch returning empty blockedSeats
  expect(screen.queryByRole("complementary", { name: "Threat rail" })).toBeNull();
});
```

If SituationRoom is too heavy to mount, test a extracted `GlanceOverlays` or assert source + unit-test a helper `shouldShowThreatRail(blocked)` — **do not** add a helper just for this; parent condition `blockedSeats.length > 0 && <ThreatRail />` and source-test:

```ts
const source = readFileSync("src/jarvis/SituationRoom.tsx", "utf8");
expect(source).toMatch(/blockedSeats\.length > 0/);
expect(source).toMatch(/selectedSlug &&/);
```

Plus `needs-you` already tested. Add a small `onGlanceKeydown` helper in `needs-you.ts`:

```ts
export function glanceKeyAction(
  key: string,
  opts: { inputFocused: boolean; dialogOpen: boolean },
): "escape" | "next" | "prev" | null {
  if (opts.inputFocused || opts.dialogOpen) return null;
  if (key === "Escape") return "escape";
  if (key === "j") return "next";
  if (key === "k") return "prev";
  return null;
}
```

Test those four branches.

Double-click: `SeatNode` `onDoubleClick` → `onOpenReport?.(slug)`. Source or callback test.

- [ ] **Step 2: Run tests to verify they fail**

Expected: FAIL.

- [ ] **Step 3: Write minimal implementation**

SituationRoom:
- Left overlay: only if `(digest?.blockedSeats.length ?? 0) > 0`
- Right overlay: only if `selectedSlug`
- Remove C-suite aside from the theater
- Remove activity footer
- `onSelect` threat → `selectStoreSlug` (already) — SeatNode pulses when selected
- window keydown: `glanceKeyAction` → escape clears slug; j/k `nextNeedsYouSlug`
- Pass `onOpenReport` into theater → SeatNode dblclick
- Click table clears slug (Task 4)

- [ ] **Step 4: Run tests**

Also: `npm test -- src/jarvis/hud/ThreatRail.test.tsx src/jarvis/SituationRoom.confirmation.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add tools/org-command-center/src/jarvis/SituationRoom.tsx tools/org-command-center/src/jarvis/hud/ThreatRail.tsx tools/org-command-center/src/jarvis/hud/needs-you.ts tools/org-command-center/src/jarvis/hud/needs-you.test.ts tools/org-command-center/src/jarvis/scene/nodes/SeatNode.tsx tools/org-command-center/src/jarvis/scene/OrgTheater.tsx
git commit -m "feat(occ): inspect on select with Esc, j/k, and double-click report"
```

---

### Task 7: Follow-cam + first-run tour

**Files:**
- Create: `tools/org-command-center/src/jarvis/hud/FirstRunTour.tsx`
- Create: `tools/org-command-center/src/jarvis/hud/FirstRunTour.test.tsx`
- Modify: `tools/org-command-center/src/jarvis/scene/OrgTheater.tsx`
- Modify: `tools/org-command-center/src/jarvis/SituationRoom.tsx`
- Modify: `tools/org-command-center/src/jarvis/hud/WorkspaceSheet.tsx` / MissionCommandControls

**Interfaces:**
- Consumes: `followCam`, `orbiting`, `deriveCameraLookAt` opts, `sr-tour-v1`
- Produces: follow-cam look-at when running and idle; four-step tour

- [ ] **Step 1: Write the failing tour test**

```ts
it("shows step 1 when sr-tour-v1 is empty and Skip writes the key", async () => {
  localStorage.removeItem("sr-tour-v1");
  render(<FirstRunTour hasThreats={false} onDone={() => {}} />);
  expect(screen.getByText(/This table is the company/)).toBeTruthy();
  await userEvent.click(screen.getByRole("button", { name: "Skip" }));
  expect(localStorage.getItem("sr-tour-v1")).toBe("1");
});
```

Follow-cam: extend `deriveCameraLookAt` tests already in Task 2. In OrgTheater `useEffect`, compute running slugs from `seatWorkContext`; if `followCam && !selectedSlug && !orbiting && !reducedMotion`, pass followSlug or followCentroid.

CameraControls `onStart` → `setOrbiting(true)`; Frame company / Esc / empty click → `setOrbiting(false)` and `selectSlug(null)`.

- [ ] **Step 2: Run test to verify it fails**

Expected: FAIL — `FirstRunTour` missing.

- [ ] **Step 3: Write minimal implementation**

Four steps from the spec. Next advances; last Next and Skip set `sr-tour-v1`. Replay tour deletes the key and resets step to 0.

Wire follow-cam in OrgTheater. Persist followCam to `localStorage` `sr-follow-cam` (`"0"` off, unset = on).

- [ ] **Step 4: Run tests**

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add tools/org-command-center/src/jarvis/hud/FirstRunTour.tsx tools/org-command-center/src/jarvis/hud/FirstRunTour.test.tsx tools/org-command-center/src/jarvis/scene/OrgTheater.tsx tools/org-command-center/src/jarvis/SituationRoom.tsx tools/org-command-center/src/jarvis/hud/MissionCommandControls.tsx
git commit -m "feat(occ): add follow-cam and first-run Situation Room tour"
```

---

### Task 8: README + theme + emoji contract

**Files:**
- Modify: `tools/org-command-center/README.md`
- Modify: `tools/org-command-center/src/jarvis/hud/theme.test.ts`
- Modify: `tools/org-command-center/src/jarvis/hud/theme.css` (if any leftover)

**Interfaces:**
- Consumes: none
- Produces: operator docs matching Glance; source test that SituationRoom + PhaseBead do not render emoji status

- [ ] **Step 1: Write the failing docs/source test**

In `theme.test.ts` (or a new `glance-copy.test.ts`):

```ts
it("does not use emoji as phase status chrome", () => {
  const room = readFileSync("src/jarvis/SituationRoom.tsx", "utf8");
  const beads = readFileSync("src/jarvis/scene/nodes/PhaseBead.tsx", "utf8");
  for (const ch of ["⬜", "🔄", "✅", "⏭️"]) {
    expect(room.includes(ch)).toBe(false);
    expect(beads.includes(ch)).toBe(false);
  }
});
```

- [ ] **Step 2: Run test to verify it fails** if emoji still present; if already gone, the test documents the contract.

- [ ] **Step 3: Replace remaining emoji chips with Pending / In progress / Done / Skipped. Update README** to Situation Room, Glance bar, Command deck, System → Workspace, threat rail when needed, follow-cam, j/k, Esc, tour. Remove Floor/Assign/Outputs mode-bar language.

- [ ] **Step 4: Run** `npm test -- src/jarvis/hud/theme.test.ts` and `npm test` (full OCC suite).

Expected: PASS. If a pre-existing failure is unrelated, do not “fix” it by weakening safety tests — report it.

- [ ] **Step 5: Commit**

```bash
git add tools/org-command-center/README.md tools/org-command-center/src/jarvis/hud/theme.test.ts tools/org-command-center/src/jarvis/SituationRoom.tsx tools/org-command-center/src/jarvis/scene/nodes/PhaseBead.tsx
git commit -m "docs(occ): align Situation Room README and ban emoji status chrome"
```

---

## Spec coverage

| Spec requirement | Task |
|------------------|------|
| Glance bar, 70% theater, Run next only filled CTA | 3 |
| `glanceStatusLine` threat-first | 1, 3 |
| Workspace sheet / System menu / follow + replay | 3, 7 |
| Furniture table, room, rings, wedges, reflection | 4 |
| `deptColor` + pinstripe | 1, 5 |
| Seat terminals, persistent labels, gaze, 150ms card | 5 |
| Phase rail text marks | 5, 8 |
| No Stars/bloom | 4 |
| Camera home + inspect + follow-cam | 2, 7 |
| Threat rail only when blocked | 6 |
| Console only when selected | 6 |
| Esc / empty table / j/k / double-click | 6 |
| Run next wake preview | 2, 3 |
| First-run tour | 7 |
| README + no emoji chrome | 8 |
| Safety tests unchanged | 3, 6, 8 |
| Dead JarvisShell left alone | all |

## Self-review

No TBD. Names are `glanceStatusLine`, `needsYouSlugs`, `nextNeedsYouSlug`, `glanceKeyAction`, `deptColor`, `previewWakeSlug`, `followCam`, `orbiting`, `CommandTable`, `MissionContextBar`, `WorkspaceSheet`, `FirstRunTour`. Floor camera is `[0, 6.5, 13]`. Follow one-seat offset is `[+3.4, +4.2, +7]`.
