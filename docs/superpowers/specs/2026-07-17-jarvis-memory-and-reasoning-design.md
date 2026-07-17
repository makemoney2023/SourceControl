# Design: Jarvis Memory + Reasoning (Long-term Learner)

**Date:** 2026-07-17  
**Status:** Approved (M1–M4 implemented 2026-07-17; `memory.reindex` + soft co-pilot wake/disconnect digest in Task 9–10)  
**Extends:** `2026-07-16-jarvis-intent-catalog-v2-design.md` (`memory.note` / `memory.recall`), `2026-07-16-multi-venture-projects-design.md` (MEMORY layout; Chroma previously deferred), `2026-07-17-jarvis-closed-action-loop-design.md` (run lifecycle hooks)  
**App:** `tools/org-command-center/`  
**Plan:** `docs/superpowers/plans/2026-07-17-jarvis-memory-and-reasoning.md`  
**Skills referenced:** `skills/context-engineering/skills/memory-systems/`, venture `MEMORY/README.md`

## Purpose

Give Jarvis durable venture memory and soft co-pilot reasoning: know what was done, what’s next, and suggest one next move — without auto-spawning or inventing facts.

## Locked decisions (from brainstorm)

| Decision | Choice |
|----------|--------|
| Success bar | **C — Long-term learner** (continuity + soft proposals + durable prefs/patterns) |
| Storage | **Filesystem source of truth + Chroma semantic index** in the same delivery |
| Auto-write | **Explicit notes + lifecycle events + end-of-session digests** (not every utterance) |
| Assertiveness | **Soft co-pilot** — on wake/pulse speak status + one suggestion; hard confirm before writes/spawns |
| Chroma runtime | **Local process** on Mac (`npx chroma run --path .data/chroma`); JS client over HTTP; no Docker/Cloud for v1 |

## Hard laws (unchanged)

- Manager-only fan-out from Jarvis (`agent.spawn_ic` stays denied)
- Hard confirm for writes/spawns; audit trail
- Cursor = workers; voice = control plane
- Agents must not mark phase ✅ (C-suite / human gate)
- **Filesystem = source of truth; Chroma = rebuildable recall index only**
- Soft co-pilot **never** queues or spawns without operator confirm
- No cross-venture bleed — all reads/writes scoped to `projects/registry.json` → `active` → `memory` path

## Architecture

```
Voice / jarvis_act
       │
       ▼
 memory.note | memory.recall | memory.brief | memory.digest
       │
       ▼
 server/memory/
   ├── fs-store.ts       → docs/projects/<active>/MEMORY/
   ├── chroma-index.ts   → embedded Chroma under OCC `.data/chroma/`
   ├── situation.ts      → done / next / blockers / suggestion
   └── session-digest.ts → MEMORY/sessions/*.md + index
```

Approach: **intent-thin + Memory service** (not catalog-only, not graph-first).

## MEMORY layout (extend existing)

Per venture (`registry.projects[slug].memory`):

| Path | Purpose |
|------|---------|
| `decisions.md` | Durable decisions + rationale (table append) |
| `sessions/` | Chronological session digests + short lifecycle lines from run finish |
| `entities/` | Named entity notes (`entities/<slug>.md`) |
| `preferences.md` | Operator/venture preferences (new) |
| `notes.md` | Free-form `memory.note` appends when `kind` is `note` or omitted |

No Chroma files under MEMORY — index lives in OCC `.data/chroma/` (gitignored). Keep MEMORY README: grep works without Chroma; Chroma is semantic recall only.

## Components

| Module | Responsibility |
|--------|----------------|
| `server/memory/fs-store.ts` | Resolve active memory root; append/read markdown; list recent sessions |
| `server/memory/chroma-index.ts` | Start/connect embedded Chroma; upsert/delete by doc id; query top-k with `where: { project }` |
| `server/memory/situation.ts` | Pure function: FS snippets + live mission/runs/blockers → brief DTO |
| `server/memory/session-digest.ts` | Build session markdown from activity/runs window; write + index |
| Jarvis wiring | `intents.ts`, `policy.ts`, `tools-exec.ts`, `act.ts` okSummary, prompt, goldens |

### Chroma conventions

- **One** collection: `jarvis_memory`, filtered with `where: { project: <slug> }`
- Doc id: `<slug>:<relativePath>#<chunkIndex>` so reindex is idempotent
- Metadata: `{ project, path, kind, ts }` where `kind` ∈ `decision | session | entity | preference | note | lifecycle`
- Embeddings: Chroma default embedding function for v1 (document in OCC README; env override later)
- Persist dir: `tools/org-command-center/.data/chroma/` (gitignored)

### Rebuild

`memory.reindex` (ops, confirm) or CLI/script: walk MEMORY markdown → wipe project docs → upsert. Used after Chroma corruption or first enable.

## Intents

| Intent | Tier | Mode | Confirm | Args | Behavior |
|--------|------|------|---------|------|----------|
| `memory.note` | R1 | ops | yes | `text`, `kind?` | Append to FS by kind → index. Default `kind=note` → `notes.md`; `decision` → `decisions.md`; `preference` → `preferences.md`; `entity` + `entityId` → `entities/<id>.md` |
| `memory.recall` | R0 | briefing+ | no | `query`, `limit?` | Chroma query; **fallback ripgrep** if Chroma down |
| `memory.brief` | R0 | briefing+ | no | — | Situation DTO for voice |
| `memory.digest` | R1 | ops | yes | `summary?` | Force session digest now |
| `memory.reindex` | R2 | ops | yes | — | Rebuild Chroma from FS for active venture |

Promote catalog v2 E4 `memory.*` from 🆕 to this delivery; add `brief` / `digest` / `reindex` as net-new.

### Brief DTO

```ts
type MemoryBrief = {
  done: string[];       // short bullets, max ~5
  next: string[];       // short bullets, max ~5
  blockers: string[];   // short bullets, max ~5
  suggestion: string;   // exactly one soft next move (spoken one sentence)
  sources: string[];    // relative MEMORY / mission paths used
};
```

Empty MEMORY → `done`/`next` from mission/tracker/runs only; `suggestion` still allowed from live state; speak that memory is thin.

## Auto writers

| Trigger | Write | Index |
|---------|-------|-------|
| Operator “remember…” / `memory.note` | FS by kind | yes |
| Run finish (success/fail/acceptance gap) | Append one lifecycle bullet to today’s `sessions/YYYY-MM-DD.md` (create if missing) | yes |
| LiveKit room disconnect for the voice session | Full digest → `sessions/YYYY-MM-DD-HHmm.md` | yes |
| Explicit `memory.digest` | Same full digest shape | yes |

If disconnect hook is unavailable in M3, ship `memory.digest` + run-finish lifecycle only; add disconnect in M4 with soft co-pilot.

**Not written:** raw full transcripts, every tool JSON dump, cross-venture content.

## Soft co-pilot

- On voice agent wake (and optional idle pulse if `JARVIS_PULSE_MS` > 0): invoke `memory.brief` **once** → speak **one** short sentence (status + suggestion).
- Prompt rule: after brief, stop and listen; do not chain spawn tools from the suggestion.
- Suggestion may name a seat/phase; execution still requires Ops + confirm via existing work/spawn intents.

## Data flow

1. **Write:** resolve active venture → append markdown → upsert Chroma → audit  
2. **Recall:** Chroma top-k → spoken-friendly hits; on failure → ripgrep MEMORY → same shape  
3. **Brief:** recent sessions + decisions (+ optional recall for open threads) + live mission/runs/blockers → `MemoryBrief`

## Errors & degradation

| Condition | Behavior |
|-----------|----------|
| Chroma unavailable | Log warning; recall/brief use FS; note/digest still write FS and queue reindex flag |
| No active venture | Clear `JarvisExecError` |
| Empty MEMORY | Brief from live mission/runs; say memory is thin |
| Index lag | FS wins; next recall may miss until upsert completes |

## Sequencing vs closed action loop

| Wave | Work |
|------|------|
| **M1** | FS store + intents `memory.note` / `memory.recall` / `memory.brief` (grep fallback, no Chroma yet) |
| **M2** | Embedded Chroma index + upsert on write + recall via Chroma |
| **M3** | Session digests + lifecycle hooks (prefer after run acceptance from closed-loop if available; otherwise hook `finishAdapterRun` / activity) |
| **M4** | Soft co-pilot wake/pulse + prompt/goldens + `memory.reindex` |

M1 is useful alone; M2 completes storage decision B; M3–M4 complete learner + soft co-pilot.

## Testing (TDD)

- `situation.test.ts` — fixtures for done/next/blockers/suggestion/sources  
- `fs-store.test.ts` — temp dir append/read/active path resolution  
- `chroma-index.test.ts` — temp persist path upsert/query/filter by project (skip if env disables heavy deps)  
- Intent policy + `tools-exec` coverage for all five intents  
- Degradation: mock Chroma throw → recall still returns FS hits  
- Golden utterances: “where are we?”, “what’s next?”, “remember that MOF is the lead sorbent”, “digest this session”

## Out of scope

- Neo4j / temporal knowledge graph  
- Chroma Cloud / Docker Chroma server  
- Auto-spawn or auto-queue from `memory.brief`  
- Dumping full chat into MEMORY  
- Cross-venture semantic search  
- Workplace glossary CLAUDE.md pattern (corporate `memory-management` skill) unless later requested

## Example dialogues

**Wake**

> Jarvis: Passive Grid — Phase 2 evidence still open; last run left an inbox gap. Want me to rewake head-of-research?

**Remember**

> You: Remember that MOF-303 is our lead sorbent.  
> Jarvis: I’ll note that under Passive Grid preferences. Confirm?  
> You: Yes.  
> Jarvis: Saved.

**Where are we?**

> You: Where are we?  
> Jarvis: Done — intake and problem framing. Next — finish Phase 2 evidence. Blocker — missing competitor TEBS cites. Suggestion — queue head-of-research on TEBS.

## Acceptance criteria

1. After confirm, `memory.note` appears on disk under active venture MEMORY and is recallable by semantic or keyword query.  
2. `memory.brief` returns structured done/next/blockers/suggestion without inventing phases.  
3. Chroma down does not break note or brief.  
4. Soft co-pilot never spawns without confirm.  
5. Session digest file exists after `memory.digest` or session end hook.  
6. `memory.reindex` rebuilds Chroma from FS for the active project.
