# Jarvis Intent Catalog v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand Jarvis Dialogue Control Plane so voice can create/switch ventures, queue on-the-fly manager tasks for any manager seat, and grow toward full OCC control-plane parity — without breaking manager-only law or OSS voice constraints.

**Architecture:** Keep the single `jarvis_act` / `jarvis_confirm` / `jarvis_context` tool surface. Grow the intent enum + `policyFor` + `executeIntent` switch. Add **`architect`** mode for venture/structural ops. Richer confirm summaries echo name/slug for R3 intents. Heuristic goldens expand in CI; no new LiveKit tools.

**Tech Stack:** TypeScript, Zod, Vitest/TDD, existing OCC Hono API (`createVenture`, `queueValidatedDispatch`, project routes), LiveKit agent modes in `livekit-agent/src/modes.ts`.

**Spec:** `docs/superpowers/specs/2026-07-16-jarvis-intent-catalog-v2-design.md`

## Global Constraints

- Open-source voice brain only (LiveKit self-host, Ollama, Whisper, Kokoro) — no cloud voice SaaS.
- Manager-only fan-out: never spawn ICs via voice; `agent.spawn_ic` always denied.
- No pack invention: all queues go through `queueValidatedDispatch` / `validateManagerPacket`.
- Hard/structural writes need confirm tokens (60s TTL, single-use, token-bound args).
- `venture.create` **auto-activates** the new venture (`activate !== false`).
- `dispatch.queue_for` may target **any manager** in the org roster.
- Fourth mode **`architect`**: venture create/switch (+ later structural tracker) require it; Ops remains execution.
- Files only under `tools/org-command-center/` (+ docs under `docs/superpowers/`).
- TDD: failing test → implement → pass → commit per task.
- Cursor SDK remains the worker runtime.

---

## File map

| Path | Role |
|------|------|
| `server/jarvis/intents.ts` | Expand `JARVIS_INTENTS` + `JarvisMode` (+ `architect`) |
| `server/jarvis/policy.ts` | Architect gates, R2/R3 confirms, R4 denies |
| `server/jarvis/act.ts` | Richer `confirmSummary(intent, args)` for R3 |
| `server/jarvis/tools-exec.ts` | Execute new intents |
| `server/jarvis/dispatch-for.ts` | Build `ManagerPacketInput` for `queue_for` / preview |
| `server/jarvis/session.ts` | Mode type already from intents (no change unless helpers) |
| `server/create-venture.ts` | Reuse as-is (`activate` default true) |
| `server/paths.ts` | `listProjects`, `loadRegistry`, `saveRegistry` |
| `livekit-agent/src/modes.ts` | Architect ack + mode apply |
| `livekit-agent/src/occ-client.ts` | `JarvisMode` union includes `architect` |
| `server/jarvis/eval/heuristic-intent.ts` | Utterance → new intents |
| `server/jarvis/eval/golden.json` | New goldens |
| `tools/org-command-center/README.md` | Modes + cheatsheet |
| Spec design | Already approved; mark waves done in progress ledger if present |

---

## Wave E1 — Architect mode + ventures

### Task 1: Mode + venture intents + policy (TDD)

**Files:**
- Modify: `tools/org-command-center/server/jarvis/intents.ts`
- Modify: `tools/org-command-center/server/jarvis/policy.ts`
- Modify: `tools/org-command-center/server/jarvis/intents.test.ts`
- Modify: `tools/org-command-center/server/jarvis/policy.test.ts`

**Interfaces:**
- Produces: `JarvisMode = "briefing" | "ops" | "review" | "architect"`; intents `venture.list`, `venture.get`, `venture.slugify`, `venture.create`, `venture.switch`; `policyFor(intent, mode)`
- Consumes: existing `parseJarvisAct`

- [ ] **Step 1: Write failing tests**

```ts
// intents.test.ts — add:
it("accepts venture.create", () => {
  expect(parseJarvisAct({ intent: "venture.create", args: { name: "X" } }).intent).toBe(
    "venture.create",
  );
});
it("accepts architect mode.set args via parse still only checks intent", () => {
  expect(parseJarvisAct({ intent: "mode.set", args: { mode: "architect" } }).intent).toBe(
    "mode.set",
  );
});

// policy.test.ts — add:
it("denies venture.create in briefing", () => {
  expect(policyFor("venture.create", "briefing").allowed).toBe(false);
});
it("denies venture.create in ops", () => {
  expect(policyFor("venture.create", "ops").allowed).toBe(false);
});
it("allows venture.create in architect with confirm", () => {
  expect(policyFor("venture.create", "architect")).toEqual({
    allowed: true,
    needsConfirm: true,
  });
});
it("allows venture.list in briefing without confirm", () => {
  expect(policyFor("venture.list", "briefing")).toEqual({
    allowed: true,
    needsConfirm: false,
  });
});
it("requires confirm for venture.switch in architect", () => {
  expect(policyFor("venture.switch", "architect").needsConfirm).toBe(true);
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd tools/org-command-center && npx vitest run server/jarvis/intents.test.ts server/jarvis/policy.test.ts
```

Expected: FAIL (unknown intent / mode)

- [ ] **Step 3: Implement**

In `intents.ts`, extend:

```ts
export const JARVIS_INTENTS = [
  // ...existing...
  "venture.list",
  "venture.get",
  "venture.slugify",
  "venture.create",
  "venture.switch",
] as const;

export type JarvisMode = "briefing" | "ops" | "review" | "architect";
```

In `policy.ts`:

```ts
const STRUCTURAL = new Set<JarvisIntent>(["venture.create", "venture.switch"]);
const ARCHITECT_ONLY = new Set<JarvisIntent>([...STRUCTURAL]);

export function policyFor(intent: JarvisIntent, mode: JarvisMode): JarvisPolicy {
  if (intent === "mode.set") return { allowed: true, needsConfirm: false };

  if (ARCHITECT_ONLY.has(intent) && mode !== "architect") {
    return {
      allowed: false,
      needsConfirm: false,
      reason: "Switch to Architect mode first",
    };
  }

  if (mode === "briefing" && OPS_ONLY.has(intent)) {
    return { allowed: false, needsConfirm: false, reason: "Switch to Ops mode first" };
  }
  if (mode === "review" && intent.startsWith("spawn")) {
    return { allowed: false, needsConfirm: false, reason: "Spawn disabled in Review" };
  }
  if (mode === "architect" && intent.startsWith("spawn")) {
    return { allowed: false, needsConfirm: false, reason: "Spawn disabled in Architect — switch to Ops" };
  }

  const needsConfirm =
    HARD.has(intent) ||
    intent === "dispatch.queue" ||
    STRUCTURAL.has(intent);

  return { allowed: true, needsConfirm };
}
```

Keep existing `HARD` / `OPS_ONLY` sets; do not put venture intents in `OPS_ONLY`.

- [ ] **Step 4: Run tests — expect PASS**

```bash
cd tools/org-command-center && npx vitest run server/jarvis/intents.test.ts server/jarvis/policy.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add tools/org-command-center/server/jarvis/intents.ts \
  tools/org-command-center/server/jarvis/policy.ts \
  tools/org-command-center/server/jarvis/intents.test.ts \
  tools/org-command-center/server/jarvis/policy.test.ts
git commit -m "$(cat <<'EOF'
feat(jarvis): add architect mode and venture intents to policy

EOF
)"
```

---

### Task 2: Rich confirm summaries for structural intents (TDD)

**Files:**
- Modify: `tools/org-command-center/server/jarvis/act.ts`
- Modify: `tools/org-command-center/server/jarvis/act.test.ts`

**Interfaces:**
- Produces: `confirmSummary(intent, args)` → spoken string including name/slug for ventures
- Consumes: `handleJarvisAct` confirm path

- [ ] **Step 1: Write failing test**

```ts
it("venture.create confirm summary echoes name and slug", async () => {
  setExecuteIntentForTests(async () => ({ ok: true }));
  const r = await handleJarvisAct(repo, "room-1", {
    intent: "venture.create",
    args: { name: "Grid Down Water", slug: "grid-down-water" },
    mode: "architect",
  });
  expect(r.status).toBe("needs_confirm");
  expect(r.summary).toMatch(/Grid Down Water/i);
  expect(r.summary).toMatch(/grid-down-water/);
  expect(r.summary).toMatch(/active/i);
});
```

(Use existing act.test repo fixture + `resetSessionForTests`.)

- [ ] **Step 2: Run — expect FAIL** (summary is generic `Confirm venture create?`)

```bash
cd tools/org-command-center && npx vitest run server/jarvis/act.test.ts
```

- [ ] **Step 3: Implement `confirmSummary`**

```ts
function confirmSummary(intent: JarvisIntent, args: Record<string, unknown>): string {
  if (intent === "venture.create") {
    const name = String(args.name ?? "unnamed");
    const slug = String(args.slug ?? "(auto-slug)");
    return `Create venture "${name}" as ${slug} and make it active. Confirm?`;
  }
  if (intent === "venture.switch") {
    const slug = String(args.slug ?? "");
    return `Switch active venture to ${slug}. Confirm?`;
  }
  if (intent === "dispatch.queue_for") {
    const position = String(args.position ?? "manager");
    const phase = String(args.phase ?? "?");
    return `Queue ${position} for phase ${phase}. Confirm?`;
  }
  return `Confirm ${intent.replace(/\./g, " ")}?`;
}
```

Call sites: pass `act.args` into `confirmSummary`. Update `mode` resolution:

```ts
if (mode === "briefing" || mode === "ops" || mode === "review" || mode === "architect") return mode;
```

- [ ] **Step 4: Run — expect PASS**

```bash
cd tools/org-command-center && npx vitest run server/jarvis/act.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add tools/org-command-center/server/jarvis/act.ts tools/org-command-center/server/jarvis/act.test.ts
git commit -m "$(cat <<'EOF'
feat(jarvis): echo venture name/slug in confirm summaries

EOF
)"
```

---

### Task 3: Execute venture intents (TDD)

**Files:**
- Modify: `tools/org-command-center/server/jarvis/tools-exec.ts`
- Modify: `tools/org-command-center/server/jarvis/tools-exec.test.ts`

**Interfaces:**
- Produces: `executeIntent` cases for `venture.*` and `mode.set` accepting `architect`
- Consumes: `createVenture`, `slugifyVentureName`, `listProjects`, `loadRegistry`, `saveRegistry`, `activeProjectSlug`

- [ ] **Step 1: Write failing tests**

```ts
it("venture.list returns projects", async () => {
  const r = (await executeIntent(repo, "venture.list", {})) as {
    active: string;
    projects: { slug: string }[];
  };
  expect(r.projects.length).toBeGreaterThan(0);
  expect(r.active).toBeTruthy();
});

it("venture.create scaffolds and activates", async () => {
  const name = `Voice Venture ${Date.now()}`;
  const r = (await executeIntent(repo, "venture.create", { name })) as {
    slug: string;
    active: string;
  };
  expect(r.active).toBe(r.slug);
  const get = (await executeIntent(repo, "venture.get", {})) as { active: string };
  expect(get.active).toBe(r.slug);
});

it("venture.switch changes active", async () => {
  // create A, create B (both activate), switch back to A
});

it("mode.set accepts architect", async () => {
  const r = await executeIntent(repo, "mode.set", { roomId: "r1", mode: "architect" });
  expect(r).toMatchObject({ ok: true, mode: "architect" });
});
```

Use the existing temp-repo helper in `tools-exec.test.ts`. Prefer unique slugs; clean up not required if temp dir is wiped in `afterEach`.

- [ ] **Step 2: Run — expect FAIL**

```bash
cd tools/org-command-center && npx vitest run server/jarvis/tools-exec.test.ts
```

- [ ] **Step 3: Implement switch cases**

```ts
import { createVenture, slugifyVentureName } from "../create-venture";
import { activeProjectSlug, listProjects, loadRegistry, saveRegistry } from "../paths";

// mode.set:
if (next !== "briefing" && next !== "ops" && next !== "review" && next !== "architect") {
  throw new JarvisExecError("mode must be briefing, ops, review, or architect", "invalid_arg");
}

case "venture.list": {
  const reg = loadRegistry(repoRoot);
  return { active: reg.active, projects: listProjects(repoRoot) };
}
case "venture.get": {
  const reg = loadRegistry(repoRoot);
  const entry = reg.projects[reg.active];
  return {
    active: reg.active,
    name: entry?.name,
    businessIdea: entry?.businessIdea,
    memory: entry?.memory,
  };
}
case "venture.slugify": {
  const name = String(args.name ?? "");
  return { slug: slugifyVentureName(name) };
}
case "venture.create": {
  const name = String(args.name ?? "").trim();
  if (!name) throw new JarvisExecError("name required", "missing_arg");
  const slug = args.slug != null ? String(args.slug) : undefined;
  // activate defaults true — auto-switch
  return createVenture(repoRoot, { name, slug, activate: true });
}
case "venture.switch": {
  const slug = String(args.slug ?? "").trim();
  if (!slug) throw new JarvisExecError("slug required", "missing_arg");
  const reg = loadRegistry(repoRoot);
  if (!reg.projects[slug]) throw new JarvisExecError(`Unknown project: ${slug}`, "unknown_venture");
  reg.active = slug;
  saveRegistry(repoRoot, reg);
  return { ok: true, active: activeProjectSlug(repoRoot) };
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
cd tools/org-command-center && npx vitest run server/jarvis/tools-exec.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add tools/org-command-center/server/jarvis/tools-exec.ts \
  tools/org-command-center/server/jarvis/tools-exec.test.ts
git commit -m "$(cat <<'EOF'
feat(jarvis): execute venture list/get/create/switch intents

EOF
)"
```

---

### Task 4: LiveKit agent architect mode wiring

**Files:**
- Modify: `tools/org-command-center/livekit-agent/src/occ-client.ts`
- Modify: `tools/org-command-center/livekit-agent/src/modes.ts`
- Modify: `tools/org-command-center/livekit-agent/src/modes.test.ts` (create if missing; else extend)
- Grep agent prompts for mode enum and update to include architect

**Interfaces:**
- Produces: `JarvisMode` includes `architect`; `modeAck("architect")`; `applyModeFromActResult` accepts architect

- [ ] **Step 1: Write failing tests**

```ts
it("modeAck describes architect", () => {
  expect(modeAck("architect")).toMatch(/architect/i);
});
it("applyModeFromActResult accepts architect", () => {
  const state = createModeState("briefing");
  applyModeFromActResult(state, { status: "ok", result: { mode: "architect" } });
  expect(state.getMode()).toBe("architect");
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
cd tools/org-command-center/livekit-agent && npm test -- --run src/modes.test.ts
```

- [ ] **Step 3: Implement**

```ts
export type JarvisMode = "briefing" | "ops" | "review" | "architect";

// applyModeFromActResult:
if (mode !== "briefing" && mode !== "ops" && mode !== "review" && mode !== "architect") return false;

// modeAck:
case "architect":
  return "Architect mode. Venture create and switch available with confirmation.";
```

Update `set_mode` tool description / system prompt snippets that list modes so Ollama can say “switch to architect”.

- [ ] **Step 4: Run agent tests**

```bash
cd tools/org-command-center/livekit-agent && npm test
```

- [ ] **Step 5: Commit**

```bash
git add tools/org-command-center/livekit-agent/src/occ-client.ts \
  tools/org-command-center/livekit-agent/src/modes.ts \
  tools/org-command-center/livekit-agent/src/modes.test.ts \
  tools/org-command-center/livekit-agent/src/agent.ts
git commit -m "$(cat <<'EOF'
feat(jarvis): wire architect mode into LiveKit agent

EOF
)"
```

---

## Wave E2 — On-the-fly manager tasks

### Task 5: Forbidden `agent.spawn_ic` + `seat.who_owns` + `dispatch.preview` intents/policy

**Files:**
- Modify: `intents.ts`, `policy.ts`, tests

**Interfaces:**
- Produces: intents `agent.spawn_ic`, `seat.who_owns`, `dispatch.preview`, `dispatch.queue_for`, `dispatch.list`, `delegate.plan`
- Policy: `agent.spawn_ic` always `{ allowed: false, reason: "..." }`

- [ ] **Step 1: Failing tests**

```ts
it("always denies agent.spawn_ic", () => {
  for (const mode of ["briefing", "ops", "review", "architect"] as const) {
    expect(policyFor("agent.spawn_ic", mode).allowed).toBe(false);
  }
});
it("dispatch.queue_for needs confirm in ops", () => {
  expect(policyFor("dispatch.queue_for", "ops")).toEqual({
    allowed: true,
    needsConfirm: true,
  });
});
it("dispatch.queue_for denied in briefing", () => {
  expect(policyFor("dispatch.queue_for", "briefing").allowed).toBe(false);
});
it("dispatch.preview allowed in ops without confirm", () => {
  expect(policyFor("dispatch.preview", "ops")).toEqual({
    allowed: true,
    needsConfirm: false,
  });
});
```

- [ ] **Step 2: Run — FAIL**

- [ ] **Step 3: Implement**

Add intents to enum. Policy:

```ts
if (intent === "agent.spawn_ic") {
  return {
    allowed: false,
    needsConfirm: false,
    reason:
      "I can't spawn ICs directly. Queue a manager with dispatch.queue_for, or ask for a delegate plan.",
  };
}

const OPS_ONLY = new Set<JarvisIntent>([
  ...HARD,
  "dispatch.queue",
  "dispatch.queue_for",
  "dispatch.preview",
  "dispatch.list",
  "delegate.plan",
]);

// needsConfirm includes dispatch.queue_for (not preview)
```

`seat.who_owns` / `delegate.plan` / `dispatch.list` / `dispatch.preview`: allowed in ops (and review for who_owns/delegate.plan reads) without confirm except queue_for.

Treat `seat.who_owns` as R0 in briefing+.

- [ ] **Step 4: PASS + commit**

```bash
git commit -m "$(cat <<'EOF'
feat(jarvis): policy for queue_for and forbid IC spawn

EOF
)"
```

---

### Task 6: `dispatch-for` builder + execute queue_for / preview (TDD)

**Files:**
- Create: `tools/org-command-center/server/jarvis/dispatch-for.ts`
- Create: `tools/org-command-center/server/jarvis/dispatch-for.test.ts`
- Modify: `tools-exec.ts` + `tools-exec.test.ts`

**Interfaces:**
- Produces:
  - `buildQueueForPacket(repoRoot, { position, goal, phase? }): ManagerPacketInput | throws JarvisExecError`
  - `previewQueueFor(...)` → `{ ok, packet?, errors?, summary }`
- Consumes: `parseOrgRegistry`, `parseModelRegistry`, `resolvePhaseOwner`, `validateManagerPacket`, `queueValidatedDispatch`, tracker for default phase/idea

- [ ] **Step 1: Failing tests**

```ts
it("rejects IC position", () => {
  expect(() =>
    buildQueueForPacket(repo, {
      position: "copy-chief",
      goal: "Write homepage copy",
      phase: "6",
    }),
  ).toThrow(/manager/i);
});

it("accepts any manager even if not phase owner", () => {
  // Phase 2 owner is head-of-research; queue cfo for phase 2 still builds
  const input = buildQueueForPacket(repo, {
    position: "cfo",
    goal: "Cost model for TEBS",
    phase: "2",
  });
  expect(input.position).toBe("cfo");
  expect(input.phase).toBe("2");
  expect(input.goal).toMatch(/Cost model/);
});

it("defaults phase to current mission phase when omitted", () => {
  const input = buildQueueForPacket(repo, {
    position: "head-of-research",
    goal: "Finish evidence base",
  });
  expect(input.phase).toBeTruthy();
});
```

- [ ] **Step 2: Run — FAIL**

```bash
cd tools/org-command-center && npx vitest run server/jarvis/dispatch-for.test.ts
```

- [ ] **Step 3: Implement `dispatch-for.ts`**

```ts
import { readFileSync } from "node:fs";
import { parseModelRegistry, parseOrgRegistry } from "../../src/lib/parse-registry";
import { parseTracker } from "../../src/lib/parse-tracker";
import { validateManagerPacket } from "../../src/lib/validate-packet";
import type { ManagerPacketInput } from "../../src/lib/types";
import { assertReadable, trackerPath } from "../paths";
import { loadSnapshot } from "../snapshot";
import { JarvisExecError } from "./tools-exec";

export type QueueForArgs = {
  position: string;
  goal: string;
  phase?: string;
};

export function buildQueueForPacket(repoRoot: string, args: QueueForArgs): ManagerPacketInput {
  const position = args.position?.trim();
  const goal = args.goal?.trim();
  if (!position) throw new JarvisExecError("position required", "missing_arg");
  if (!goal) throw new JarvisExecError("goal required", "missing_arg");

  const org = parseOrgRegistry(
    readFileSync(assertReadable(repoRoot, "skills/org/ORG-REGISTRY.md"), "utf8"),
  );
  const seat = org.roster.find((r) => r.slug === position);
  if (!seat) throw new JarvisExecError(`Unknown seat: ${position}`, "unknown_seat");
  if (seat.level !== "manager") {
    throw new JarvisExecError(
      `${position} is an IC — queue their manager instead`,
      "not_manager",
    );
  }

  const snap = loadSnapshot(repoRoot);
  const phase = (args.phase?.trim() || String(snap.mission.currentPhase || "")).trim();
  if (!phase) throw new JarvisExecError("phase required", "missing_arg");

  const tracker = parseTracker(readFileSync(trackerPath(repoRoot), "utf8"));
  const phase_name = tracker.phases.find((p) => p.phase === phase)?.name;

  return {
    phase,
    position,
    goal,
    idea: tracker.idea,
    phase_name,
  };
}

export function previewQueueFor(repoRoot: string, args: QueueForArgs) {
  const input = buildQueueForPacket(repoRoot, args);
  const org = parseOrgRegistry(
    readFileSync(assertReadable(repoRoot, "skills/org/ORG-REGISTRY.md"), "utf8"),
  );
  const models = parseModelRegistry(
    readFileSync(assertReadable(repoRoot, "skills/org/MODEL-REGISTRY.md"), "utf8"),
  );
  const result = validateManagerPacket(input, org, models);
  if (!result.ok) return { ok: false as const, errors: result.errors, input };
  return {
    ok: true as const,
    packet: result.packet,
    summary: `Manager ${result.packet.position}, phase ${result.packet.phase}: ${result.packet.goal}`,
  };
}
```

Wire `tools-exec`:

```ts
case "dispatch.queue_for": {
  const position = String(args.position ?? "");
  const goal = String(args.goal ?? "");
  const phase = args.phase != null ? String(args.phase) : undefined;
  const input = buildQueueForPacket(repoRoot, { position, goal, phase });
  const result = queueValidatedDispatch(repoRoot, input);
  assertExecOk(result, (r) => ("errors" in r ? r.errors : []).join("; "));
  emitJarvisFocus(droot, { phase: input.phase, slug: input.position });
  return result;
}
case "dispatch.preview": {
  return previewQueueFor(repoRoot, {
    position: String(args.position ?? ""),
    goal: String(args.goal ?? ""),
    phase: args.phase != null ? String(args.phase) : undefined,
  });
}
case "seat.who_owns": {
  const phase = String(args.phase ?? snap.mission.currentPhase ?? "");
  const org = snap.org;
  const owner = org.phaseOwners.find((p) => p.phase === phase);
  if (!owner) throw new JarvisExecError(`No owner for phase ${phase}`, "unknown_phase");
  return { phase, managerOwner: owner.managerOwner, maySpawn: owner.maySpawn, csuiteReviewer: owner.csuiteReviewer };
}
case "dispatch.list": {
  return { queue: snap.queue, claimed: snap.claimed };
}
case "delegate.plan": {
  const position = String(args.position ?? "");
  const goal = String(args.goal ?? "");
  const owner = snap.org.phaseOwners.find((p) => p.managerOwner === position)
    ?? snap.org.phaseOwners.find((p) => p.phase === String(snap.mission.currentPhase));
  const seat = snap.org.roster.find((r) => r.slug === position);
  return {
    position,
    level: seat?.level,
    goal,
    maySpawn: owner?.maySpawn ?? [],
    note: seat?.level === "manager"
      ? "Queue this manager; they may spawn listed ICs."
      : "This seat is IC — queue their manager instead.",
  };
}
case "agent.spawn_ic":
  throw new JarvisExecError("IC spawn forbidden", "forbidden");
```

- [ ] **Step 4: Integration test** — queue_for for `cfo` on phase `2` writes a queue file and returns `ok: true`.

- [ ] **Step 5: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(jarvis): queue_for any manager with preview and who_owns

EOF
)"
```

---

## Wave E3 — Session meta + awareness reads

### Task 7: Session + awareness intents

**Files:**
- Modify: `intents.ts`, `policy.ts`, `tools-exec.ts`, tests
- Modify: `act.ts` if `session.cancel_pending` needs `cancelConfirm` without accept

**New intents (this task):**
`session.help`, `session.repeat`, `session.cancel_pending`, `jarvis.ping`, `phase.list_open`, `digest.focus`, `activity.tail`

- [ ] **Step 1: Failing parse + policy + exec tests** for each.

- [ ] **Step 2: Implement**

| Intent | Exec behavior |
|--------|----------------|
| `session.help` | Return static markdown-ish bullet list of modes + top intents (from README cheatsheet subset) |
| `session.repeat` | Return `{ summary: lastSpoken }` — store `lastSummary` on room in `session.ts` via `setLastSummary` / `getLastSummary`; set from `handleJarvisAct` when returning ok/needs_confirm |
| `session.cancel_pending` | If `args.token` or peek latest — use `cancelConfirm`; needsConfirm false; allow in ops/architect |
| `jarvis.ping` | `{ ok: true, time: ISO }` (optional: try fetch localhost health later — YAGNI: timestamp only in E3) |
| `phase.list_open` | Tracker phases with status ⬜ or 🔄 |
| `digest.focus` | `buildCompanyDigest` then return only `args.section` key (`blocked`/`escalate`/`awaiting`) or full if omitted |
| `activity.tail` | `snap.activity.slice(-n)` default 10 |

- [ ] **Step 3: PASS + commit**

```bash
git commit -m "$(cat <<'EOF'
feat(jarvis): session help/repeat/cancel and awareness reads

EOF
)"
```

---

## Wave E4 — Ops polish (subset)

### Task 8: runs.get, spawn.run, routine.list/disable, handoff.list, briefing.pin

**Files:**
- Modify: intents, policy, tools-exec, tests
- Reuse: `/api/spawn` body patterns from `api.ts`, `listRoutineDefs` / `writeRoutine`, handoffs from snapshot

- [ ] **Step 1: Failing tests** for:
  - `runs.get` with runId
  - `spawn.run` confirms in ops (policy) and calls spawn with claimed file / wakeReason
  - `routine.list` / `routine.disable`
  - `handoff.list` for phase
  - `briefing.pin` soft-confirm or no-confirm write via existing briefing API helper

Inspect `api.ts` spawn + briefing handlers and call the same server functions — do not duplicate HTTP.

- [ ] **Step 2: Implement minimal wiring** — if `spawn.run` is awkward vs `spawn.run_next`, implement `runs.get` + `routine.list` + `routine.disable` + `handoff.list` first; add `spawn.run` only if a clear `spawnClaimedManager`/`wake` path exists with runId.

- [ ] **Step 3: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(jarvis): ops polish intents for runs, routines, handoffs

EOF
)"
```

---

## Wave E5 — Heuristics, goldens, docs

### Task 9: Heuristic intent + golden suite

**Files:**
- Modify: `server/jarvis/eval/heuristic-intent.ts`
- Modify: `server/jarvis/eval/golden.json`
- Modify: `server/jarvis/eval/run-golden.test.ts` if schema changes

**Rules (order matters — put specific before general):**

```ts
// architect / mode
if (/\barchitect\b/.test(u) && /\b(mode|switch|enter|go to)\b/.test(u)) return "mode.set";

// forbid / redirect patterns still map to agent.spawn_ic so policy deny is tested
if (/\bspawn\b/.test(s) && /\b(ic|copywriter|copy-chief|analyst)\b/.test(s)) {
  return "agent.spawn_ic";
}

if (/\b(create|new)\b/.test(s) && /\b(venture|idea|project)\b/.test(s)) {
  return "venture.create";
}
if (/\b(switch|activate|open)\b/.test(s) && /\b(venture|idea|project)\b/.test(s)) {
  return "venture.switch";
}
if (/\b(list|show)\b/.test(s) && /\b(venture|idea|project)s?\b/.test(s)) {
  return "venture.list";
}

// queue_for before generic queue
if (
  (/\b(queue|assign|give|task)\b/.test(s) &&
    /\b(head-of-|cfo|cmo|cto|ceo|creative-director|head of)\b/.test(s)) ||
  /\bqueue\b.+\bfor\b/.test(s)
) {
  return "dispatch.queue_for";
}
```

Add ≥ 12 golden rows covering: architect mode, create venture, switch venture, queue_for any manager, spawn IC deny, who owns phase, dispatch.preview, session.help.

- [ ] **Step 1: Add goldens that FAIL heuristic**
- [ ] **Step 2: Update heuristic**
- [ ] **Step 3: `npx vitest run server/jarvis/eval/run-golden.test.ts` PASS**
- [ ] **Step 4: Commit**

```bash
git commit -m "$(cat <<'EOF'
test(jarvis): golden coverage for venture and queue_for

EOF
)"
```

---

### Task 10: README + design cross-links

**Files:**
- Modify: `tools/org-command-center/README.md` (modes + cheatsheet)
- Modify: `docs/superpowers/specs/2026-07-16-jarvis-intent-catalog-v2-design.md` — status already Approved; add “Implementation: plan …” if missing
- Optionally bump OCC design voice section note to “catalog v2 in progress”

- [ ] **Step 1: Update README modes table**

| Mode | Unlocks |
|------|---------|
| Briefing | Reads, digests, venture.list/get |
| Ops | Queue, queue_for, spawn, pause, cancel, rewake |
| Review | file.read, csuite.draft, handoffs |
| Architect | venture.create, venture.switch |

Cheatsheet rows:

| Utterance | Intent | Confirm |
|-----------|--------|---------|
| Switch to architect | `mode.set` | No |
| Create a venture called X | `venture.create` | Yes (auto-activates) |
| Switch to venture slug | `venture.switch` | Yes |
| Give CFO a task to … | `dispatch.queue_for` | Yes |
| Spawn the copywriter | `agent.spawn_ic` | Denied |

- [ ] **Step 2: Commit**

```bash
git commit -m "$(cat <<'EOF'
docs(jarvis): architect mode and catalog v2 cheatsheet

EOF
)"
```

---

### Task 11: Full verify

- [ ] **Step 1: Run OCC + agent suites**

```bash
cd tools/org-command-center && npm test && npm run build
cd tools/org-command-center/livekit-agent && npm test
```

Expected: all green.

- [ ] **Step 2: Manual smoke (operator)**

1. Talk → “Switch to architect” → ack  
2. “Create a venture called Plan Smoke Test” → confirm → active switches  
3. “Switch to ops” → “Queue head-of-research to note smoke test goal for phase 0” → confirm  
4. “Spawn the copywriter” → spoken deny with redirect  

- [ ] **Step 3: Final commit only if verify fixes needed**

---

## Out of scope (catalog rows deferred)

These remain in the design catalog but are **not** in this plan’s waves (follow-up plan later):

- `venture.rename` / `venture.archive`
- `phase.set_status` / `phase.advance` / `phase.skip` / `phase.complete` (force)
- `spend.budget.set`, `memory.note` / `memory.recall`
- `alerts.ack_all`, `integration.*`
- `ui.focus` / `ui.open_*` (partial via existing `jarvis.focus` emits)
- Per-intent zod arg schemas for all 65 (YAGNI: validate in exec; expand schemas when NL extraction lands)

---

## Spec coverage self-review

| Spec requirement | Task |
|------------------|------|
| architect mode | 1, 4 |
| venture.create auto-activate | 3 |
| venture.switch confirm | 1, 2, 3 |
| queue_for any manager | 5, 6 |
| forbid IC spawn | 5, 6, 9 |
| confirm echo name/slug | 2 |
| session/help/awareness | 7 |
| ops polish subset | 8 |
| goldens + README | 9, 10 |
| no new LiveKit tools | constraint (all waves) |
| OSS voice | constraint |

## Placeholder scan

No TBD steps; deferred items listed under Out of scope with explicit names.

## Type consistency

- `JarvisMode` updated in `intents.ts`, `act.ts` resolveMode, `tools-exec` mode.set, `occ-client.ts`, `modes.ts`
- `dispatch.queue_for` args: `{ position, goal, phase? }` everywhere
- `venture.create` args: `{ name, slug? }` — always `activate: true` in exec
