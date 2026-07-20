# Design: MCP Posture, Jarvis Completion Feedback & OCC Control-Plane MCP

**Date:** 2026-07-20  
**Status:** Approved for implementation (user: execute)  
**Extends:**  
`2026-07-16-digital-worker-integrations-design.md`,  
`2026-07-16-jarvis-work-request-voice-spawn-design.md`,  
`2026-07-17-jarvis-closed-action-loop-design.md`  
**App:** `tools/org-command-center/`, `skills/org/`, `skills/integrations/`  
**Source review:** [Gemini session — LiveKit / Cursor SDK / MCP](https://share.gemini.google/Tf6ge9RKI2IV)

## Purpose

Lock how this virtual company uses MCP: what we create, what we consume, and what we refuse. Then close two concrete gaps:

1. **Voice completion feedback** — Jarvis must announce finished (or gapped) runs without blocking the LiveKit loop or inventing status.  
2. **Optional OCC control-plane MCP** — expose a thin proprietary tool surface for non-Jarvis MCP clients, without turning digital workers into servers.

## Context (current system)

| Layer | Role today | Must stay |
|-------|------------|-----------|
| LiveKit Jarvis | Real-time voice control plane (Groq / local adapters) | Sub-second conversational loop |
| OCC Hono API | `jarvis_act` intents, confirm, dispatch, spawn | Single company action surface |
| Cursor SDK | Background workers that execute seat packets | Detached; never on the WebRTC hot path |
| `skills/org/positions/*/SKILL.md` | Seat identity, laws, craft | Local prompt injection |
| `skills/org/TOOL-REGISTRY.md` + `skills/integrations/*` | Seat × external tool map | Prefer MCP; REST/CLI fallback |
| `HANDOFFS/` + `REVIEW/inbox/` | Artifacts + operator review | Not a flat `outputs/` dump |

Hard laws already approved (unchanged):

- Cursor = workers; voice = control plane  
- Manager-only fan-out from Jarvis  
- Hard confirm for writes; audit trail  
- Detached spawn must not block confirm HTTP  
- Prefer MCP when connected; else REST/CLI; never invent keys or metrics  
- Secrets: Obsidian MCP when available, else `.env.local`

## Decisions

| Decision | Choice |
|----------|--------|
| Skill files → MCP servers? | **No.** Skills stay markdown instructions. |
| Wrap Cursor SDK as MCP for LiveKit? | **No.** LiveKit → OCC HTTP → dispatch/spawn already is the bridge. |
| Composio as default toolbelt? | **No for v1.** Evaluate later only for SaaS we refuse to maintain (e.g. Gmail/Slack/Shopify OAuth). |
| Where do seats get tools? | `TOOL-REGISTRY` + integration skills; Cursor agent connects to listed MCP servers. |
| Internal proprietary MCP? | **Yes, optional Phase C** — thin OCC control-plane MCP for non-Jarvis clients. |
| Per-seat MCP servers? | **Never.** |
| Completion UX | Phase B: event-driven proactive announce on top of existing `runs.watch`. |
| Auto-review via dual Cursor Agents in a Node loop? | **Out of scope.** Manager merge + REVIEW inbox remain the review path. |

## Architecture (target)

```text
                    ┌─────────────────────────────────────┐
                    │  LiveKit Jarvis (voice)             │
                    │  tools → OCC /api/jarvis/*          │
                    └─────────────────┬───────────────────┘
                                      │
     Optional Phase C                 │
  ┌──────────────────┐                ▼
  │ OCC Control MCP  │────►  OCC Hono control plane
  │ (non-Jarvis)     │      intents, confirm, dispatch, spawn
  └──────────────────┘                │
                                      ▼
                         Cursor SDK worker (detached)
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
           Load SKILL.md      TOOL-REGISTRY MCPs    Write HANDOFFS /
           (local brain)      (external toolbelt)   REVIEW / venture docs
                                      │
                                      ▼
                         finish → events ring / events.jsonl
                                      │
                    ┌─────────────────┴─────────────────┐
                    ▼                                   ▼
           runs.watch (pull)              Phase B: pulse announce (push)
```

### Tripartite boundary (locked)

1. **Brain** — `skills/org/positions/<seat>/SKILL.md` (+ craft packs). Loaded locally into the Cursor worker prompt. Not an RPC.  
2. **External toolbelt** — third-party / already-connected MCPs listed in `TOOL-REGISTRY` (Firecrawl, GitHub, GA, GSC, Figma, Supabase, Vercel, etc.).  
3. **Internal toolbelt** — OCC HTTP (Jarvis) and, when enabled, the OCC Control MCP (Phase C). Proprietary company actions only.

## Approaches considered

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| A — Docs-only posture | Fast, clarifies Gemini debate | Leaves completion + non-Jarvis clients unsolved | Necessary but insufficient |
| B — Gemini FastMCP Cursor wrapper + webhooks | Familiar “MCP everywhere” story | Duplicates OCC; fire-and-forget `create_task` loses reliability; LiveKit already has HTTP tools | Reject |
| C — Phased A → B → C (this design) | Reuses OCC; adds push announce; optional MCP for other clients | Slightly larger doc/plan | **Chosen** |
| Per-seat MCP + Composio for skills | Uniform tooling story | Massive latency/routing cost; contradicts approved non-goal | Reject |

---

## Phase A — MCP posture (decision + registry discipline)

### A.1 Rules for agents and humans

1. **Do not create** an MCP server per digital worker / seat / skill file.  
2. **Do not create** an MCP server whose only job is to spawn Cursor SDK agents for Jarvis — use OCC spawn APIs.  
3. **Do create / maintain** integration skills and `TOOL-REGISTRY` rows that tell seats which existing MCP (or REST/CLI fallback) to use.  
4. **May create** at most one proprietary **OCC Control MCP** (Phase C) when a non-Jarvis MCP client needs company actions.  
5. Skills describe *when* and *why* to use a tool; integration skills describe *how*. Never embed secrets in skills.

### A.2 Updates to existing docs

| Artifact | Change |
|----------|--------|
| `skills/org/TOOL-REGISTRY.md` | Add “MCP posture” section summarizing A.1; link this spec |
| `skills/org/README.md` | One paragraph: skills ≠ MCP servers |
| `2026-07-16-digital-worker-integrations-design.md` | Status note: non-goal “hosting MCP servers” clarified — excludes optional OCC Control MCP (Phase C); still forbids per-seat servers |
| `tools/org-command-center/README.md` | Link posture + Phase B completion behavior |

### A.3 Composio policy

- **v1:** do not add Composio as a required dependency.  
- **Later:** allowed only when (a) tool is not already in TOOL-REGISTRY, (b) OAuth/maintenance cost is high, (c) a single Composio session is scoped per operator/venture — never as a replacement for seat skills.  
- Any Composio adoption requires a follow-on design amendment; not part of Phase A deliverables beyond this policy sentence.

### A.4 Success criteria (Phase A)

- New contributors reading TOOL-REGISTRY + this spec answer correctly: “Are seats MCP servers?” → No.  
- No PR opens a `skills/org/positions/*/mcp-server` (or equivalent) without explicit amendment to this spec.

---

## Phase B — Jarvis completion feedback (proactive announce)

### B.1 Problem

Today completion is pull-only: user asks “is it done?” → `runs.watch`. Gemini’s webhook idea is right in spirit (async notify) but wrong in placement (new FastAPI + LiveKit data packets duplicating OCC). Closed-action-loop already persists finish events; we need the **voice plane to notice without the user asking**.

### B.2 Design

Reuse OCC run-event persistence from closed-action-loop (`DISPATCH/events.jsonl` or room-scoped ring). Add a **completion watcher** in the LiveKit agent process.

**Locked mechanism (v1):** OCC adds `GET /api/jarvis/events/since?cursor=` returning new run lifecycle events; the agent polls this endpoint every **2s only while** the venture has any `queued`/`running` session (or for **30s after** the last finish to catch late acceptance writes). Agent advances an opaque cursor. Fallback if the endpoint is missing: poll `runs.watch` with the same cadence/guards (no dual paths in production once `events/since` ships).

Websocket push is a later optimization, not v1.

On new `finished` / `failed` / `completed_with_gaps` events:

1. Build a **spoken one-liner** from the event summary (seat title, ok vs gaps — never raw runIds).  
2. Inject as a system notification into the active Jarvis session and **force a short speak turn** (same confirm-discipline as other system lines: do not spawn tools from the announce itself).  
3. Deduplicate by `runId` + status so reconnects do not re-announce.

### B.3 Voice laws for announce

- After `work.request` confirm: still say **started**, never **done**.  
- Proactive announce is allowed only from watcher-confirmed events.  
- If gaps: speak that review is needed / acceptance failed — do not claim deliverable complete.  
- If user is mid-utterance / mid-confirm wait: queue announce until idle (no barge-in over Confirm?).  
- Announces never call `work_request` or invent follow-up spawns.

### B.4 Explicitly not Phase B

- Gemini-style Node webhook → LiveKit `send_data` as the primary path (optional later if watcher proves insufficient).  
- Dual IC/Manager Cursor auto-review loop in the runner.  
- Claiming phase ✅ from announce.

### B.5 Success criteria (Phase B)

- Operator confirms a spawn, stays silent through finish → within **10s** of the finish event being visible to `events/since`, Jarvis speaks one accurate completion/gap line without being asked.  
- Duplicate announce rate = 0 for the same `runId`+status in a session.  
- “Is it done?” still works via `runs.watch` (pull path unchanged).

### B.6 Tests (TDD)

| Test | Expect |
|------|--------|
| Watcher with no active runs | No poll / no announce |
| Event `finished` + acceptance ok | One spoken line; spoken text excludes runId digits dump |
| Event `completed_with_gaps` | Speaks gap framing |
| Same event twice | Second suppressed |
| User in `needs_confirm` | Announce deferred until confirm resolved or cancelled |

---

## Phase C — OCC Control MCP (optional proprietary server)

### C.1 When to build

Build only if at least one of:

- A non-Jarvis MCP client (Cursor IDE chat, Claude Desktop, another agent harness) needs company actions without reinventing HTTP.  
- Operators explicitly want the same confirm-gated intents from an MCP host.

Do **not** build Phase C solely so Jarvis can call MCP — Jarvis already uses OCC HTTP tools.

### C.2 Shape

One server: **`occ-control`** (name locked).

| Concern | Rule |
|---------|------|
| Transport | Streamable HTTP or SSE mounted on OCC process (same origin / auth as OCC) — not a second business logic stack |
| Auth | Same secrets as OCC admin/local bind; no public anonymous tools |
| Tool surface (v1) | Read-only + status first; writes only as confirm-gated twins of existing intents |
| Implementation | Thin adapter over `executeIntent` / existing act pipeline — zero parallel policy |

### C.3 v1 tool list (maximum)

| MCP tool | Maps to | Confirm |
|----------|---------|---------|
| `occ_mission_get` | `mission.get` | no |
| `occ_runs_watch` | `runs.watch` | no |
| `occ_runs_get` | `runs.get` | no |
| `occ_blocker_list` | `blocker.list` | no |
| `occ_memory_brief` | `memory.brief` | no |
| `occ_seat_report` | `seat.report` | no |
| `occ_dispatch_preview` | `dispatch.preview` | no |
| `occ_work_resolve` | `work.resolve` | no |
| `occ_work_request` | `work.request` | hard (return needs_confirm / accept token flow or refuse until confirm tool) |
| `occ_confirm` | `jarvis_confirm` equivalent | yes/no only |

Writes beyond this list require a spec amendment. **No** `kickoff_ic_sprint`, **no** Cursor SDK spawn tools on the MCP surface that bypass OCC policy.

### C.4 Confirm model over MCP

MCP hosts often lack a voice Confirm? loop.

**Locked for v1:** Two-step tools — `occ_work_request` returns `{ needs_confirm, summary, confirmToken }`; client must call `occ_confirm({ accept, confirmToken })`. Same tokens as HTTP jarvis confirm store.

**Rejected for v1:** Auto-confirm flag on MCP tools (too easy to skip audit).

### C.5 Non-goals (Phase C)

- Exposing all `jarvis_act` intents on day one  
- Mounting Composio inside OCC Control MCP  
- Replacing LiveKit tool definitions with MCP for Jarvis  
- Hosting seat skills as MCP resources (optional later as read-only resources is a separate amendment; not v1)

### C.6 Success criteria (Phase C)

- Cursor IDE (or equivalent) with `occ-control` configured can `occ_runs_watch` and get the same summary shape as HTTP.  
- A write without `occ_confirm` cannot mutate dispatch.  
- Policy tests: denied intents stay denied when invoked via MCP adapter.

### C.7 Tests (TDD)

| Test | Expect |
|------|--------|
| Read tool → executeIntent | Same result as HTTP act |
| Write without confirm | needs_confirm or error; no queue |
| Confirm accept | Queue/spawn side effects match HTTP |
| Unknown tool | Reject |
| Per-seat server scaffolding | Lint/doc check or CI grep fails if added under positions |

---

## Sequencing

| Phase | Deliverable | Depends on |
|-------|-------------|------------|
| **A** | Spec approved + TOOL-REGISTRY / README posture updates | — |
| **B** | Completion watcher + announce + tests | Closed-action-loop events (`runs.watch` already exists) |
| **C** | `occ-control` MCP adapter + tests + mcp.json example | A; reuses act/confirm pipeline |

Recommended ship order: **A (docs) → B (voice value) → C (only when a non-Jarvis client is ready).**

## File map (implementation plan will detail)

| Path | Phase | Responsibility |
|------|-------|----------------|
| `docs/superpowers/specs/2026-07-20-mcp-posture-and-control-plane-design.md` | A | This design |
| `skills/org/TOOL-REGISTRY.md` | A | Posture section |
| `skills/org/README.md` | A | Skills ≠ MCP |
| `tools/org-command-center/README.md` | A/B | Operator notes |
| `tools/org-command-center/livekit-agent/src/*` | B | Watcher + announce |
| `tools/org-command-center/server/jarvis/*` | B/C | Events cursor API if needed; MCP mount |
| `tools/org-command-center/server/mcp/*` (or equiv.) | C | Thin FastMCP/SDK adapter |
| `docs/mcp.json` or OCC `docs/mcp.json` example | C | Client config snippet |

## Risks

| Risk | Mitigation |
|------|------------|
| Announce interrupts Confirm? | Defer until idle |
| Phase C duplicates Jarvis tools | Single `executeIntent` backend |
| Scope creep into Composio / per-seat servers | Explicit reject in Decisions |
| Gemini “Custom Stores” distraction | Out of scope; REVIEW inbox stays |

## Non-goals (global)

- Building MCP servers for each of the ~36 seats  
- Feeding LiveKit audio into Cursor SDK  
- Replacing OCC with a standalone FastMCP Cursor orchestrator  
- Making Composio the default integration layer in v1  
- Dual-agent Auto-Review loop in `cursor_runner` as the primary QA path  
- Automatic phase completion from MCP or announce

## Success metrics (overall)

1. Architecture question settled in writing; Gemini “skills → MCP servers?” answered **no** in-repo.  
2. Phase B: ≥1 proactive accurate completion announce in soak without user prompt.  
3. Phase C (when built): non-Jarvis client performs read + confirm-gated write with audit parity to HTTP.

## Open questions (resolved for this draft)

| Question | Resolution |
|----------|------------|
| Scope A / B / C? | All three, phased |
| Composio now? | Policy only; no implementation |
| Primary notify path? | OCC events → agent watcher (not Gemini webhook-first) |

## Approval gate

Operator reviews this file. On approval:

1. Status → `Approved for implementation`  
2. Invoke writing-plans → `docs/superpowers/plans/2026-07-20-mcp-posture-and-control-plane.md` with TDD tasks for A → B → C  
)
