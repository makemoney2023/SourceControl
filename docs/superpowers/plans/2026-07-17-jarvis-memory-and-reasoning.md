# Jarvis Memory + Reasoning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Give Jarvis durable venture memory (FS + local Chroma) and soft co-pilot reasoning so it can say what was done, what’s next, and suggest one move — without auto-spawning.

**Architecture:** New `server/memory/` service owns FS writes under `registry.memory` and a rebuildable Chroma index (local `chroma run --path` process + `chromadb` JS client). Jarvis intents `memory.note|recall|brief|digest|reindex` call that service. Soft co-pilot upgrades existing `/api/jarvis/context` `spokenBrief` (already used on LiveKit wake/pulse). FS is source of truth; Chroma is optional semantic recall with grep fallback.

**Tech Stack:** TypeScript, Vitest, Zod intents, `chromadb` npm client, local Chroma via `npx chroma run --path .data/chroma`, existing `server/paths.ts` (`memoryDir` / `loadRegistry`), LiveKit agent greeting/pulse.

**Spec:** `docs/superpowers/specs/2026-07-17-jarvis-memory-and-reasoning-design.md`

## Global Constraints

- Manager-only fan-out; `agent.spawn_ic` remains denied
- Hard confirm for memory writes (`memory.note`, `memory.digest`, `memory.reindex`); reads need no confirm
- Filesystem = source of truth; Chroma = rebuildable index only
- Soft co-pilot never queues/spawns without confirm
- No cross-venture bleed — scope to `active` project memory path
- Chroma JS is **not** in-process: local process `npx chroma run --path <persist>` (not Docker/Cloud)
- TDD: failing test before implementation on every task
- Work under `tools/org-command-center/` (+ docs paths); do not create root Superpatch AI files
- Plain spoken summaries for voice (no markdown TTS)

## File map

| Path | Responsibility |
|------|----------------|
| `server/memory/types.ts` | Shared DTOs (`MemoryBrief`, note kinds, recall hits) |
| `server/memory/situation.ts` | Pure brief composer |
| `server/memory/fs-store.ts` | Resolve active MEMORY; append/read notes/sessions |
| `server/memory/grep-recall.ts` | Keyword fallback search over MEMORY |
| `server/memory/chroma-index.ts` | Chroma client + upsert/query/reindex |
| `server/memory/chroma-process.ts` | Ensure local `chroma run` (optional auto-start) |
| `server/memory/session-digest.ts` | Build/write session digests |
| `server/memory/index.ts` | Facade used by Jarvis intents |
| `server/jarvis/intents.ts` | Add five intents |
| `server/jarvis/policy.ts` | Mode/confirm rules |
| `server/jarvis/tools-exec.ts` | Handlers |
| `server/jarvis/act.ts` | Confirm prompts + okSummary |
| `server/jarvis/briefing.ts` | Soft co-pilot: enrich `spokenBrief` from `memory.brief` |
| `server/spawn.ts` | Lifecycle note on run finish |
| `livekit-agent/src/jarvis-system-prompt.ts` | Memory playbooks |
| `livekit-agent/src/agent.ts` | Disconnect → `memory.digest` (best-effort) |
| `server/jarvis/eval/golden.json` | Utterances |
| `README.md` | Cheatsheet + Chroma setup |
| `.gitignore` | `.data/chroma/` |
| Venture `MEMORY/README.md` | Document `notes.md` / `preferences.md` / `context.md` (operator note from venture-sources plan) |

---

# Wave M1 — FS memory + core intents (no Chroma)

### Task 1: Memory types + pure situation composer

**Files:**
- Create: `tools/org-command-center/server/memory/types.ts`
- Create: `tools/org-command-center/server/memory/situation.ts`
- Create: `tools/org-command-center/server/memory/situation.test.ts`

**Interfaces:**
```ts
// types.ts
export type MemoryNoteKind =
  | "note"
  | "decision"
  | "preference"
  | "entity"
  | "lifecycle"
  | "session";

export type MemoryBrief = {
  done: string[];
  next: string[];
  blockers: string[];
  suggestion: string;
  sources: string[];
  memoryThin: boolean;
};

export type MemoryRecallHit = {
  text: string;
  path: string;
  kind: MemoryNoteKind | "unknown";
  score?: number;
};

export type SituationInput = {
  recentSessionLines: string[];
  decisionLines: string[];
  preferenceLines: string[];
  mission: {
    idea: string;
    currentPhase: string;
    currentPhaseName?: string;
    nextAction: string;
    blockerCount: number;
    openPhaseNames?: string[];
  };
  recentRunLines: string[]; // e.g. "run_abc failed acceptance: missing inbox"
};
```

```ts
// situation.ts
export function composeMemoryBrief(input: SituationInput): MemoryBrief;
export function speakMemoryBrief(brief: MemoryBrief): string;
// speakMemoryBrief → one short sentence for TTS (done/next/blocker hint + suggestion)
```

- [x] **Step 1: Write failing tests**

```ts
import { describe, expect, it } from "vitest";
import { composeMemoryBrief, speakMemoryBrief } from "./situation";

describe("composeMemoryBrief", () => {
  it("uses mission when MEMORY is empty and marks memoryThin", () => {
    const brief = composeMemoryBrief({
      recentSessionLines: [],
      decisionLines: [],
      preferenceLines: [],
      mission: {
        idea: "Passive Grid",
        currentPhase: "2",
        currentPhaseName: "Evidence",
        nextAction: "finish evidence base",
        blockerCount: 1,
      },
      recentRunLines: [],
    });
    expect(brief.memoryThin).toBe(true);
    expect(brief.next[0]).toMatch(/evidence/i);
    expect(brief.suggestion.length).toBeGreaterThan(0);
    expect(brief.done.length).toBeLessThanOrEqual(5);
  });

  it("prefers session lines for done and caps arrays at 5", () => {
    const brief = composeMemoryBrief({
      recentSessionLines: Array.from({ length: 8 }, (_, i) => `Did thing ${i}`),
      decisionLines: ["MOF-303 is lead sorbent"],
      preferenceLines: [],
      mission: {
        idea: "Passive Grid",
        currentPhase: "2",
        nextAction: "finish evidence",
        blockerCount: 0,
      },
      recentRunLines: ["run_1 acceptance gap: missing inbox"],
    });
    expect(brief.done).toHaveLength(5);
    expect(brief.blockers.some((b) => /inbox/i.test(b))).toBe(true);
    expect(brief.sources.length).toBeGreaterThan(0);
  });

  it("speakMemoryBrief is one short plain sentence", () => {
    const spoken = speakMemoryBrief({
      done: ["Intake done"],
      next: ["Finish Phase 2"],
      blockers: ["Missing TEBS cites"],
      suggestion: "Queue head-of-research on TEBS.",
      sources: ["MEMORY/sessions/x.md"],
      memoryThin: false,
    });
    expect(spoken).not.toMatch(/[*`#]/);
    expect(spoken.split(/(?<=[.!?])\s+/).length).toBeLessThanOrEqual(3);
  });
});
```

- [x] **Step 2: Run — expect FAIL**

```bash
cd tools/org-command-center && npx vitest run server/memory/situation.test.ts
```

- [x] **Step 3: Implement `types.ts` + `situation.ts` (deterministic heuristics only — no LLM)**

Suggestion heuristic (v1): if blockers/run gaps mention inbox → suggest rewake/queue owning seat from `mission.nextAction`; else suggest acting on `mission.nextAction`. Never invent phase numbers not in input.

- [x] **Step 4: Tests PASS**

- [x] **Step 5: Commit** — `feat(occ): memory situation composer`

---

### Task 2: Filesystem memory store

**Files:**
- Create: `tools/org-command-center/server/memory/fs-store.ts`
- Create: `tools/org-command-center/server/memory/fs-store.test.ts`
- Modify: `docs/projects/passive-grid/MEMORY/README.md`
- Modify: `docs/projects/demo-venture/MEMORY/README.md`

**Interfaces:**
```ts
export type AppendNoteArgs = {
  kind: MemoryNoteKind; // note|decision|preference|entity|lifecycle
  text: string;
  entityId?: string; // required when kind=entity
  ts?: string; // ISO, default now
};

export function resolveMemoryRoot(repoRoot: string, slug?: string): {
  slug: string;
  absDir: string;
  relDir: string;
};

export function appendMemoryNote(repoRoot: string, args: AppendNoteArgs): {
  path: string; // repo-relative
  kind: MemoryNoteKind;
};

export function appendLifecycleLine(repoRoot: string, line: string, dayIso?: string): {
  path: string; // sessions/YYYY-MM-DD.md
};

export function writeSessionDigestFile(
  repoRoot: string,
  markdown: string,
  at?: Date,
): { path: string }; // sessions/YYYY-MM-DD-HHmm.md

export function readMemorySnippets(repoRoot: string): {
  recentSessionLines: string[];
  decisionLines: string[];
  preferenceLines: string[];
  noteLines: string[];
};
```

Path rules (locked):
- `note` → append `## YYYY-MM-DD` section line to `notes.md`
- `decision` → table row in `decisions.md` (`| date | decision | rationale |` — put full text in decision col, rationale `-`)
- `preference` → bullet in `preferences.md`
- `entity` → append to `entities/<entityId>.md` (slugify entityId: lowercase, hyphens)
- `lifecycle` → `appendLifecycleLine`

Use `memoryDir` / `memoryRel` / `activeProjectSlug` from `server/paths.ts`. Create files/dirs if missing. Throw `JarvisExecError`-friendly `Error` if registry invalid.

- [x] **Step 1: Failing tests** with `mkdtemp` mini-repo containing `projects/registry.json` pointing memory at temp MEMORY dir

```ts
it("appendMemoryNote writes notes.md under active venture", () => { /* ... */ });
it("entity kind requires entityId and writes entities/<id>.md", () => { /* ... */ });
it("appendLifecycleLine creates sessions/YYYY-MM-DD.md", () => { /* ... */ });
```

- [x] **Step 2: Run FAIL → implement → PASS**

- [x] **Step 3: Update both venture MEMORY READMEs** with `notes.md`, `preferences.md`, sessions lifecycle note; state Chroma lives in OCC `.data/chroma/`

- [x] **Step 4: Commit** — `feat(occ): filesystem memory store`

---

### Task 3: Grep recall fallback

**Files:**
- Create: `tools/org-command-center/server/memory/grep-recall.ts`
- Create: `tools/org-command-center/server/memory/grep-recall.test.ts`

**Interfaces:**
```ts
export function grepRecallMemory(
  repoRoot: string,
  query: string,
  limit?: number, // default 5
): MemoryRecallHit[];
```

Pure Node walk of MEMORY (no shell `rg` required): split query into tokens (≥2 chars), score files by token hits, return top snippets (line containing match ± context). Skip `.chroma` if present.

- [x] **Step 1–4: TDD + commit** — `feat(occ): grep memory recall fallback`

---

### Task 4: Wire M1 intents (note / recall / brief)

**Files:**
- Create: `tools/org-command-center/server/memory/index.ts` (facade)
- Modify: `tools/org-command-center/server/jarvis/intents.ts`
- Modify: `tools/org-command-center/server/jarvis/policy.ts`
- Modify: `tools/org-command-center/server/jarvis/policy.test.ts`
- Modify: `tools/org-command-center/server/jarvis/tools-exec.ts`
- Modify: `tools/org-command-center/server/jarvis/tools-exec.test.ts`
- Modify: `tools/org-command-center/server/jarvis/act.ts`
- Modify: `tools/org-command-center/server/jarvis/act.test.ts`

**Interfaces (facade):**
```ts
export async function memoryNote(repoRoot: string, args: {
  text: string;
  kind?: MemoryNoteKind;
  entityId?: string;
}): Promise<{ path: string; kind: MemoryNoteKind; indexed: boolean }>;

export async function memoryRecall(repoRoot: string, args: {
  query: string;
  limit?: number;
}): Promise<{ hits: MemoryRecallHit[]; via: "chroma" | "grep"; summary: string }>;

export async function memoryBrief(repoRoot: string): Promise<MemoryBrief & { spoken: string }>;
```

M1: `indexed` always `false`; `memoryRecall` always `via: "grep"`.

**Policy:**
- `memory.recall`, `memory.brief` — any mode, no confirm
- `memory.note` — ops only, **needsConfirm: true** (add to HARD or dedicated confirm set)
- Deny `memory.note` in briefing/review/architect with “Switch to Ops…”

**tools-exec cases:** call facade; for brief load mission from snapshot + recent runs (reuse existing listRuns/activity helpers if present; else pass empty `recentRunLines` until Task 8).

**act.ts:**
- Confirm: `I'll remember: <truncated text>. Confirm?`
- okSummary brief → `spoken`; note → `Saved to <path>.`; recall → `summary`

- [x] **Step 1: Failing policy + tools-exec + act tests** for the three intents

- [x] **Step 2: Implement intents + policy + handlers + summaries**

- [x] **Step 3: PASS + commit** — `feat(occ): jarvis memory.note recall brief intents`

---

# Wave M2 — Local Chroma index

### Task 5: Chroma process helper + index module

**Files:**
- Create: `tools/org-command-center/server/memory/chroma-process.ts`
- Create: `tools/org-command-center/server/memory/chroma-index.ts`
- Create: `tools/org-command-center/server/memory/chroma-index.test.ts`
- Modify: `tools/org-command-center/package.json` — add `chromadb` dependency
- Modify: `tools/org-command-center/.gitignore` — add `.data/`
- Modify: `tools/org-command-center/README.md` — Chroma env + `npx chroma run`

**Interfaces:**
```ts
// chroma-process.ts
export function chromaPersistPath(occRoot: string): string; // <occ>/.data/chroma
export function chromaUrl(): string; // process.env.CHROMA_URL ?? "http://127.0.0.1:8000"
export async function ensureChromaRunning(occRoot: string): Promise<{ ok: boolean; detail: string }>;
// ensure: heartbeat GET; if fail and JARVIS_CHROMA_AUTOSTART=1, spawn `npx chroma run --path <persist> --port <port>` detached; else return ok:false

// chroma-index.ts
export type ChromaDoc = {
  id: string; // `${slug}:${relPath}#${chunkIndex}`
  document: string;
  metadata: { project: string; path: string; kind: string; ts: string };
};

export async function chromaHeartbeat(): Promise<boolean>;
export async function upsertMemoryDocs(docs: ChromaDoc[]): Promise<void>;
export async function queryMemoryDocs(args: {
  project: string;
  query: string;
  limit?: number;
}): Promise<MemoryRecallHit[]>;
export async function deleteProjectDocs(project: string): Promise<void>;
export async function reindexProjectFromFs(repoRoot: string, project: string): Promise<{ count: number }>;
```

Collection name: `jarvis_memory` (single collection; filter `where: { project }`).

Tests:
- Unit-test id formatting + metadata without live server
- Integration test gated: `if (!process.env.JARVIS_CHROMA_TEST) return` — upsert/query against live local Chroma
- Mock client path: injectable `getChromaClient` for failure simulation

- [x] **Step 1: `npm install chromadb` in OCC**

- [x] **Step 2: Failing unit tests for doc id + heartbeat false when URL down**

- [x] **Step 3: Implement index + process helper**

- [x] **Step 4: Document in README:**

```bash
cd tools/org-command-center
npx chroma run --path .data/chroma --port 8000
# optional: JARVIS_CHROMA_AUTOSTART=1 CHROMA_URL=http://127.0.0.1:8000
```

- [x] **Step 5: Commit** — `feat(occ): local chroma memory index`

---

### Task 6: Upsert on write + recall prefers Chroma

**Files:**
- Modify: `tools/org-command-center/server/memory/index.ts`
- Modify: `tools/org-command-center/server/memory/index.test.ts` (create if needed)
- Modify: `tools/org-command-center/server/jarvis/tools-exec.test.ts`

**Behavior:**
- After successful FS append, best-effort `upsertMemoryDocs`; on failure log + `indexed: false` (intent still succeeds)
- `memoryRecall`: try Chroma; on throw/empty+chroma down → `grepRecallMemory`; set `via` accordingly
- Never fail `memory.note` because Chroma is down

- [x] **Step 1: Test** — mock chroma throw → note still writes; recall returns grep hits with `via: "grep"`

- [x] **Step 2: Implement → PASS → commit** — `feat(occ): chroma upsert and recall with grep fallback`

---

# Wave M3 — Digests + lifecycle

### Task 7: Session digest + `memory.digest` intent

**Files:**
- Create: `tools/org-command-center/server/memory/session-digest.ts`
- Create: `tools/org-command-center/server/memory/session-digest.test.ts`
- Modify: `server/memory/index.ts` — `memoryDigest`
- Modify: intents / policy / tools-exec / act (+ tests)

**Interfaces:**
```ts
export function buildSessionDigestMarkdown(args: {
  ventureName: string;
  slug: string;
  at: Date;
  operatorSummary?: string;
  missionLine: string;
  runLines: string[];
  noteLines: string[];
}): string;

export async function memoryDigest(repoRoot: string, args?: {
  summary?: string;
}): Promise<{ path: string; indexed: boolean; spoken: string }>;
```

Policy: ops + confirm. Confirm text: `Write a session digest for <venture>. Confirm?`

- [x] **Step 1–4: TDD + commit** — `feat(occ): memory.digest session digests`

---

### Task 8: Lifecycle line on run finish

**Files:**
- Modify: `tools/org-command-center/server/spawn.ts` (`finishAdapterRun` success/fail paths)
- Modify: `tools/org-command-center/server/spawn.test.ts` (or focused unit if finish is hard to hit — then extract `recordRunLifecycle(repoRoot, run)` and test that)

**Behavior:** After status finalized (and acceptance if present), append one line via `appendLifecycleLine`, e.g.  
` - run <id> <status> seat=<pos> acceptance=<ok|gap:…>`  
Best-effort; never fail the run finish if MEMORY write fails.

- [x] **Step 1: Failing test** on extracted helper or spawn finish mock

- [x] **Step 2: Implement → PASS → commit** — `feat(occ): append memory lifecycle on run finish`

---

# Wave M4 — Soft co-pilot + reindex + voice polish

### Task 9: `memory.reindex` intent

**Files:**
- Modify: `server/memory/index.ts`, intents, policy, tools-exec, act (+ tests)

**Behavior:** `reindexProjectFromFs` for active slug; ops + confirm; okSummary `Reindexed N memory chunks.`

- [x] **Step 1–4: TDD + commit** — `feat(occ): memory.reindex intent`

---

### Task 10: Soft co-pilot via `spokenBrief` + disconnect digest

**Files:**
- Modify: `tools/org-command-center/server/jarvis/briefing.ts`
- Modify: `tools/org-command-center/server/jarvis/briefing.test.ts`
- Modify: `tools/org-command-center/livekit-agent/src/agent.ts`
- Modify: `tools/org-command-center/livekit-agent/src/occ-client.ts` (add `memoryDigest` POST helper if needed)
- Modify: `tools/org-command-center/livekit-agent/src/jarvis-system-prompt.ts`
- Modify: `tools/org-command-center/livekit-agent/src/jarvis-system-prompt.test.ts`
- Modify: `tools/org-command-center/server/jarvis/eval/golden.json`
- Modify: `tools/org-command-center/server/jarvis/eval/heuristic-intent.ts` (+ tests) if heuristics exist for “where are we” / “remember”
- Modify: `tools/org-command-center/README.md` — memory voice cheatsheet
- Modify: `docs/superpowers/specs/2026-07-17-jarvis-memory-and-reasoning-design.md` — Status → Approved; Plan link

**Behavior:**
1. `buildJarvisContext` calls `memoryBrief(repoRoot)` and sets `spokenBrief` to `speakMemoryBrief` result (fallback to existing `spokenMissionBrief` if memory module throws).
2. **Merge with venture-sources:** If `contextNote` / `sourcesCount` already exist on the context object (from `server/sources`), append the same spoken clause (` Context note on file; N sources attached.`) after the memory brief. Do **not** remove `contextNote` / `sourcesCount` fields.
3. Prompt additions: where-are-we → `memory.brief`; remember → ops + `memory.note`; never spawn from suggestion alone.
4. On LiveKit `RoomEvent.Disconnected` / shutdown callback: best-effort `POST` digest (or jarvis_act memory.digest) — fire-and-forget; ignore errors.
5. Goldens: “where are we?”, “what’s next?”, “remember that MOF is the lead sorbent”, “digest this session”
6. `readMemorySnippets` / grep recall should include `MEMORY/context.md` when present (do not overwrite it from `memory.note`).

- [x] **Step 1: Failing briefing test** — with temp MEMORY containing a decision, `spokenBrief` mentions suggestion/next

- [x] **Step 2: Implement briefing enrichment**

- [x] **Step 3: Prompt + goldens + disconnect hook**

- [x] **Step 4: `npm test` + `npm run agent:test` PASS**

- [x] **Step 5: Commit** — `feat(occ): jarvis soft co-pilot memory brief on wake`

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| FS source of truth layout | 2 |
| `memory.note` / `recall` / `brief` | 4 |
| Chroma local + collection conventions | 5–6 |
| Grep fallback / Chroma down | 3, 6 |
| Session digests + `memory.digest` | 7 |
| Run-finish lifecycle | 8 |
| LiveKit disconnect digest | 10 |
| Soft co-pilot wake/pulse | 10 (via existing spokenBrief) |
| `memory.reindex` | 9 |
| No auto-spawn from brief | 10 prompt + hard laws |
| Acceptance criteria 1–6 | 4, 6, 7, 9, 10 |

## Out of scope (do not implement)

- Docker/Cloud Chroma, Neo4j, full transcript dumps, auto-queue from brief, cross-venture search
