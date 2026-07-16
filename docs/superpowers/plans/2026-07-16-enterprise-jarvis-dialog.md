# Enterprise Jarvis Dialog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn Situation Room Talk into an open-source enterprise Jarvis: natural understanding, confirmable control-plane actions, and command presence — without cloud voice SaaS.

**Architecture:** Insert a Dialogue Control Plane (DCP) in OCC (`server/jarvis/`). LiveKit agent tools call `POST /api/jarvis/act` instead of raw OCC endpoints. Policy gates hard writes behind spoken confirm. Stronger Ollama tool-calling model (`qwen3` / `llama3.1`). Modes via agent handoffs (Briefing / Ops / Review). UI focus via SSE. Workers still spawn through Cursor SDK.

**Tech Stack:** LiveKit Agents (Node), Ollama tool calling, Whisper sidecar, mlx-audio Kokoro, Vitest/TDD, existing OCC Hono API + SSE events.

**Spec:** `docs/superpowers/specs/2026-07-16-enterprise-jarvis-dialog-design.md`

## Global Constraints

- Open-source voice brain only: LiveKit self-host, Ollama, Whisper, Kokoro, Silero — no Deepgram/Cartesia/OpenAI/Anthropic/LiveKit Inference for Talk.
- Manager-only dispatch; no inventing packets; no auto-approve phase complete.
- Hard writes require confirm tokens (60s TTL, single-use).
- Cursor SDK remains the worker runtime; Jarvis only triggers `/api/spawn` etc.
- TDD for `intents`, `policy`, `session`, act handler; agent tests for tool wiring.
- Files only under `tools/org-command-center/` (and linked docs under `docs/superpowers/`).
- Default voice: Kokoro `am_adam`; default LLM after Task 2 smoke: tool-capable Ollama model.

---

## File map

| Path | Role |
|------|------|
| `server/jarvis/intents.ts` | Intent enum + arg schemas (zod) |
| `server/jarvis/policy.ts` | confirm / deny rules |
| `server/jarvis/session.ts` | pending confirms + mode |
| `server/jarvis/briefing.ts` | open-mic mission script |
| `server/jarvis/tools-exec.ts` | execute intents against existing services |
| `server/jarvis/audit.ts` | activity events |
| `server/jarvis/act.ts` | `act` / `confirm` orchestration |
| `server/api.ts` | mount `/api/jarvis/*` |
| `livekit-agent/src/occ-tools.ts` | thin tools → jarvis act |
| `livekit-agent/src/agent.ts` | modes, briefing on enter, model env |
| `livekit-agent/src/adapters/local-models.ts` | default Ollama model |
| `src/jarvis/JarvisFocusListener.tsx` | SSE focus → UI highlight |
| `docs/superpowers/specs/2026-07-16-org-command-center-design.md` | bump voice section to v3.5 |
| `tools/org-command-center/README.md` | Jarvis ops + model pull |

---

## Wave A — Dialogue Control Plane (understand & act)

### Task 1: Intent catalog + policy (TDD)

**Files:**
- Create: `tools/org-command-center/server/jarvis/intents.ts`
- Create: `tools/org-command-center/server/jarvis/policy.ts`
- Create: `tools/org-command-center/server/jarvis/intents.test.ts`
- Create: `tools/org-command-center/server/jarvis/policy.test.ts`

**Interfaces:**
- Produces: `JarvisIntent` union; `parseJarvisAct(body)`; `policyFor(intent, mode)` → `{ allowed, needsConfirm, reason? }`
- Consumes: nothing

- [ ] **Step 1: Write failing tests**

```ts
import { describe, expect, it } from "vitest";
import { parseJarvisAct } from "./intents";
import { policyFor } from "./policy";

describe("parseJarvisAct", () => {
  it("accepts mission.get", () => {
    expect(parseJarvisAct({ intent: "mission.get", args: {} }).intent).toBe("mission.get");
  });
  it("rejects unknown intent", () => {
    expect(() => parseJarvisAct({ intent: "spawn.anything", args: {} })).toThrow(/intent/);
  });
});

describe("policyFor", () => {
  it("allows mission.get in Briefing without confirm", () => {
    expect(policyFor("mission.get", "briefing")).toEqual({
      allowed: true,
      needsConfirm: false,
    });
  });
  it("denies spawn.run_next in Briefing mode", () => {
    expect(policyFor("spawn.run_next", "briefing").allowed).toBe(false);
  });
  it("requires confirm for spawn.run_next in Ops", () => {
    expect(policyFor("spawn.run_next", "ops")).toEqual({
      allowed: true,
      needsConfirm: true,
    });
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd tools/org-command-center && npx vitest run server/jarvis/intents.test.ts server/jarvis/policy.test.ts
```

- [ ] **Step 3: Implement intents + policy**

```ts
// intents.ts — zod enum covering catalog in the spec
export const JARVIS_INTENTS = [
  "mission.get", "digest.get", "seat.report", "tasks.list", "runs.list",
  "activity.list", "alerts.list", "spend.get", "file.read",
  "dispatch.queue", "alerts.ack", "routine.enable",
  "spawn.run_next", "run.cancel", "run.rewake", "agent.pause", "agent.resume",
  "csuite.draft", "mode.set",
] as const;
export type JarvisIntent = (typeof JARVIS_INTENTS)[number];
export type JarvisMode = "briefing" | "ops" | "review";
```

```ts
// policy.ts
const HARD = new Set(["spawn.run_next", "run.cancel", "run.rewake", "agent.pause", "agent.resume", "csuite.draft"]);
const OPS_ONLY = new Set([...HARD, "dispatch.queue"]);

export function policyFor(intent: JarvisIntent, mode: JarvisMode) {
  if (intent === "mode.set") return { allowed: true, needsConfirm: false };
  if (mode === "briefing" && OPS_ONLY.has(intent)) {
    return { allowed: false, needsConfirm: false, reason: "Switch to Ops mode first" };
  }
  if (mode === "review" && intent.startsWith("spawn")) {
    return { allowed: false, needsConfirm: false, reason: "Spawn disabled in Review" };
  }
  return { allowed: true, needsConfirm: HARD.has(intent) || intent === "dispatch.queue" };
}
```

- [ ] **Step 4: Run tests — expect PASS**

- [ ] **Step 5: Commit** (only if operator asked)

```bash
git add tools/org-command-center/server/jarvis/
git commit -m "$(cat <<'EOF'
feat(jarvis): intent catalog and mode-aware policy

EOF
)"
```

---

### Task 2: Confirm session store + act orchestration (TDD)

**Files:**
- Create: `tools/org-command-center/server/jarvis/session.ts`
- Create: `tools/org-command-center/server/jarvis/act.ts`
- Create: `tools/org-command-center/server/jarvis/act.test.ts`
- Create: `tools/org-command-center/server/jarvis/audit.ts`

**Interfaces:**
- Produces: `createConfirmToken`, `consumeConfirm`, `handleJarvisAct(repoRoot, roomId, body) → JarvisActResult`
- Consumes: `parseJarvisAct`, `policyFor`

- [ ] **Step 1: Failing test — confirm gate**

```ts
it("returns needs_confirm for spawn.run_next in ops without token", async () => {
  const r = await handleJarvisAct(repo, "room-1", {
    intent: "spawn.run_next",
    args: {},
    mode: "ops",
  });
  expect(r.status).toBe("needs_confirm");
  expect(r.token).toBeTruthy();
});

it("executes after valid confirm", async () => {
  const first = await handleJarvisAct(repo, "room-1", {
    intent: "spawn.run_next",
    args: {},
    mode: "ops",
  });
  const second = await handleJarvisAct(repo, "room-1", {
    intent: "spawn.run_next",
    args: {},
    mode: "ops",
    confirmToken: first.token,
  });
  expect(second.status).toBe("ok");
});
```

Stub `executeIntent` in test via dependency injection.

- [ ] **Step 2: Implement in-memory session map + TTL 60s**

```ts
type Pending = { intent: JarvisIntent; args: unknown; expires: number };
const pending = new Map<string, Pending>(); // key = `${roomId}:${token}`

export function createConfirmToken(roomId: string, intent: JarvisIntent, args: unknown): string {
  const token = crypto.randomUUID();
  pending.set(`${roomId}:${token}`, { intent, args, expires: Date.now() + 60_000 });
  return token;
}
```

- [ ] **Step 3: `handleJarvisAct` flow: parse → policy → confirm or execute → audit**

- [ ] **Step 4: Tests PASS**

---

### Task 3: Wire intent executors to existing OCC services

**Files:**
- Create: `tools/org-command-center/server/jarvis/tools-exec.ts`
- Create: `tools/org-command-center/server/jarvis/tools-exec.test.ts`
- Modify: `tools/org-command-center/server/api.ts` (mount routes)

**Interfaces:**
- Produces: `executeIntent(repoRoot, intent, args): Promise<unknown>`
- Consumes: `loadSnapshot`, `spawnClaimedManager`, `enqueueDispatch` / assign validation, pause/resume, cancel, rewake, digests, seat reports

- [ ] **Step 1: Map each intent to one existing function** (no duplicate business logic)

| Intent | Call |
|--------|------|
| `mission.get` | `buildMission` / snapshot.mission |
| `digest.get` | company digest builder |
| `seat.report` | seat report builder |
| `dispatch.queue` | same validation as `POST /api/assign` |
| `spawn.run_next` | `spawnClaimedManager` |
| `run.cancel` | existing cancel |
| `agent.pause` / `resume` | `setSeatPaused` |
| `csuite.draft` | existing draft helper |

- [ ] **Step 2: HTTP routes**

```ts
app.post("/api/jarvis/act", async (c) => {
  const body = await c.req.json();
  const roomId = String(body.roomId || "default");
  return c.json(await handleJarvisAct(repoRoot, roomId, body));
});
app.get("/api/jarvis/context", (c) => c.json(buildJarvisContext(repoRoot)));
app.post("/api/jarvis/confirm", async (c) => {
  const { roomId, token, accept } = await c.req.json();
  return c.json(await handleJarvisConfirm(repoRoot, roomId, token, accept));
});
```

- [ ] **Step 3: Integration-style unit tests with temp repo (reuse spawn.test fixtures)**

- [ ] **Step 4: `npm test` PASS**

---

### Task 4: Briefing script + context endpoint

**Files:**
- Create: `tools/org-command-center/server/jarvis/briefing.ts`
- Create: `tools/org-command-center/server/jarvis/briefing.test.ts`

**Interfaces:**
- Produces: `buildJarvisContext(repoRoot)`, `spokenMissionBrief(mission) → string` (≤ 2 sentences)

- [ ] **Step 1: Test**

```ts
it("speaks phase and blocker count", () => {
  const s = spokenMissionBrief({
    idea: "AWG",
    currentPhase: "2",
    currentPhaseName: "Market",
    progressPct: 14,
    blockerCount: 1,
    nextAction: "Phase 2 Market",
  });
  expect(s).toMatch(/Phase 2/);
  expect(s).toMatch(/blocker/i);
});
```

- [ ] **Step 2: Implement + wire to `GET /api/jarvis/context`**

---

### Task 5: Agent tools → Jarvis act (replace thin OCC client tools)

**Files:**
- Modify: `tools/org-command-center/livekit-agent/src/occ-client.ts`
- Modify: `tools/org-command-center/livekit-agent/src/occ-tools.ts`
- Modify: `tools/org-command-center/livekit-agent/src/occ-client.test.ts`
- Modify: `tools/org-command-center/livekit-agent/src/agent.ts`

**Interfaces:**
- Produces: `occ.jarvisAct({ intent, args, confirmToken?, mode, roomId })`
- Agent tools: `jarvis_act`, `jarvis_confirm`, `jarvis_context` (3 tools beat 15 flaky ones for small models)

- [ ] **Step 1: Failing client test for `jarvisAct` POST**

- [ ] **Step 2: Implement client methods**

```ts
jarvisAct: (body) => getJson("/api/jarvis/act", { method: "POST", body: JSON.stringify(body) }),
jarvisContext: () => getJson("/api/jarvis/context"),
jarvisConfirm: (body) => getJson("/api/jarvis/confirm", { method: "POST", body: JSON.stringify(body) }),
```

- [ ] **Step 3: Rebuild `buildOccTools`**

```ts
jarvis_act: {
  description: "Execute a Situation Room intent. Prefer read intents. Hard writes return needs_confirm.",
  parameters: z.object({
    intent: z.string(),
    args: z.record(z.string(), z.unknown()).optional(),
    confirmToken: z.string().optional(),
  }),
  execute: async ({ intent, args, confirmToken }) =>
    summarizeForSpeech(await occ.jarvisAct({ intent, args: args ?? {}, confirmToken, mode, roomId })),
},
```

- [ ] **Step 4: System prompt — instruct confirm flow + mode rules**

- [ ] **Step 5: On enter after `start`: fetch context → `agent.say(brief)`**

- [ ] **Step 6: `npm run agent:test` PASS**

---

### Task 6: Ollama tool-model upgrade (OSS)

**Files:**
- Modify: `livekit-agent/src/adapters/local-models.ts`
- Modify: `README.md`, `scripts/voice-stack-up.sh`
- Create: `livekit-agent/scripts/smoke-ollama-tools.sh`

**Interfaces:**
- Default `OLLAMA_MODEL=qwen3` (or `llama3.1` if qwen3 unavailable on machine)
- Smoke: one tool call round-trip against local Ollama

- [ ] **Step 1: Document pull**

```bash
ollama pull qwen3
# fallback: ollama pull llama3.1
```

- [ ] **Step 2: Smoke script** — `curl` `/api/chat` with a dummy tool; assert `tool_calls` present (per Ollama tool-calling docs).

- [ ] **Step 3: Change default in `createOllamaLLM`**

```ts
const model = process.env.OLLAMA_MODEL || "qwen3";
```

- [ ] **Step 4: Update README env table**

---

## Wave B — Command presence + UI sync

### Task 7: Mode handoffs in the LiveKit agent

**Files:**
- Modify: `livekit-agent/src/agent.ts`
- Create: `livekit-agent/src/modes.ts`
- Create: `livekit-agent/src/modes.test.ts`

**Interfaces:**
- Produces: `briefingAgent`, `opsAgent`, `reviewAgent` factories OR mode state + `mode.set` intent
- Prefer **mode state in DCP** (simpler on current VoicePipelineAgent) + spoken acknowledgement; optional LiveKit `llm.handoff` when upgrading Agents major version.

- [ ] **Step 1: Test mode.set updates session mode via `/api/jarvis/act`**

- [ ] **Step 2: Agent tool `set_mode` → intent `mode.set`**

- [ ] **Step 3: Deny ops tools while mode=briefing (already in policy) — e2e unit via act.test**

---

### Task 8: Jarvis focus events → Situation Room UI

**Files:**
- Create: `src/jarvis/JarvisFocusListener.tsx`
- Modify: `server/jarvis/act.ts` to `appendActivity` / bump SSE with `{ type: "jarvis.focus", phase?, slug? }`
- Modify: Situation Room shell to subscribe and highlight mission strip / seat

- [ ] **Step 1: On successful `seat.report` / `mission.get`, emit focus event**

- [ ] **Step 2: UI listener scrolls/highlights matching card (no new card chrome — strip accent only)**

- [ ] **Step 3: Manual verify with Talk + digest ask**

---

### Task 9: Optional pulse + barge-in tuning

**Files:**
- Modify: `livekit-agent/src/agent.ts`
- Env: `JARVIS_PULSE_MS` (0 = off, default 0 for v1)

- [ ] **Step 1: If pulse > 0 and idle, re-fetch context and speak only if `blockerCount` or phase changed**

- [ ] **Step 2: Keep interruptions enabled on `say` / pipeline (`allowInterruptions: true`)**

---

## Wave C — Full control-plane parity + eval

### Task 10: Complete intent coverage checklist

Ensure every UI control has a voice intent:

| UI | Intent |
|----|--------|
| Assign | `dispatch.queue` |
| Run next / Play | `spawn.run_next` |
| Cancel | `run.cancel` |
| Rewake | `run.rewake` |
| Pause / Resume seat | `agent.pause` / `agent.resume` |
| Digest / Alerts / Ack | `digest.get` / `alerts.list` / `alerts.ack` |
| Draft csuite | `csuite.draft` |
| Report drawer | `seat.report` |
| Spend | `spend.get` |

- [ ] **Step 1: Table-driven test `tools-exec.test.ts` — each intent returns non-throw for fixture repo**

- [ ] **Step 2: README “Voice commands” cheatsheet**

---

### Task 11: Golden transcript eval (CI, no LiveKit)

**Files:**
- Create: `server/jarvis/eval/golden.json`
- Create: `server/jarvis/eval/run-golden.test.ts`

**Format:**

```json
[
  {
    "utterance": "where are we with the atmospheric water generator",
    "expectIntent": "mission.get",
    "mode": "briefing"
  },
  {
    "utterance": "run the next dispatch",
    "expectIntent": "spawn.run_next",
    "mode": "ops",
    "expectNeedsConfirm": true
  }
]
```

- [ ] **Step 1: Heuristic mapper for CI** — keyword → intent (not LLM) so CI is deterministic; separate optional live Ollama eval job.

```ts
export function heuristicIntent(utterance: string): JarvisIntent {
  const u = utterance.toLowerCase();
  if (/where are we|status|mission|awg|atmospheric/.test(u)) return "mission.get";
  if (/run next|spawn|execute queue/.test(u)) return "spawn.run_next";
  if (/digest|company brief/.test(u)) return "digest.get";
  // ...
  return "mission.get";
}
```

- [ ] **Step 2: ≥ 20 goldens; vitest asserts heuristic + policy**

- [ ] **Step 3: Optional `npm run jarvis:eval:ollama` local-only**

---

### Task 12: Spec + README bump (v3.5)

**Files:**
- Modify: `docs/superpowers/specs/2026-07-16-org-command-center-design.md` — add **Jarvis Dialog (v3.5)** pointing at this plan
- Modify: `tools/org-command-center/README.md` — modes, confirm, `qwen3`, `mlx-tts`

- [ ] **Step 1: Document confirm phrase + mode switch**

- [ ] **Step 2: `npm test && npm run agent:test && npm run build`**

---

## Wave D — Hardening (enterprise)

### Task 13: Audit + deny reasons spoken cleanly

- [ ] Every deny returns `{ status: "denied", reason }` → agent speaks reason once  
- [ ] Activity feed shows `jarvis_act` / `jarvis_confirm` / `jarvis_denied`

### Task 14: Path allowlist for `file.read`

- [ ] Only under active venture `docs/projects/<active>/business-idea/` + `HANDOFFS/`  
- [ ] Reject `..` and absolute paths outside repo

### Task 15: Latency budget

| Stage | Target |
|-------|--------|
| STT end → first audio | < 2.5s local warm |
| Confirm round-trip | < 1.5s |
| Cold Kokoro | acceptable once; warm on `mlx-tts:up` via preload curl |

- [ ] Preload Kokoro in `mlx-tts-up.sh` with a 1-word synthesis after boot  
- [ ] Keep system prompt short; push facts via `jarvis_context` not giant chat history

---

## Verification matrix

| Criterion | Task |
|-----------|------|
| AWG status understood | 4, 5, 11 |
| Confirm then spawn | 2, 3, 5 |
| Pause seat | 3, 10 |
| On-connect brief | 4, 5 |
| OSS-only voice | 6, Global Constraints |
| UI focus | 8 |
| Golden eval | 11 |
| Mode gate | 1, 7 |

## Risks

1. **Ollama tool reliability** — mitigate with 3 tools (`jarvis_act` / confirm / context) + heuristic eval; upgrade model.  
2. **VoicePipelineAgent age** — if Node API blocks handoffs, keep mode in DCP (Task 7) without framework handoff.  
3. **Python Agents docs vs Node** — Context7 examples skew Python `AgentSession`; do not migrate to Python unless Node path fails (separate decision).  
4. **Confirm false triggers** — require explicit yes/no; ignore mid-sentence noise via VAD end-of-utterance.

## Sources (OSS docs)

- LiveKit Agents sessions / tools / handoffs — Context7 `/websites/livekit_io_agents`  
- Ollama tool calling — Context7 `/llmstxt/ollama_llms_txt`  
- mlx-audio Kokoro server — existing Kokoro TTS design  
- OCC control plane — `server/api.ts`, spawn, seat reports

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-16-enterprise-jarvis-dialog.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — fresh subagent per task, review between tasks  
2. **Inline Execution** — this session with executing-plans + checkpoints  

**Which approach?** Start with Wave A (Tasks 1–6) for a usable enterprise dialog loop before UI polish.
