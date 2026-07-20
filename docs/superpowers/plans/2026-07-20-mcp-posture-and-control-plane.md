# MCP Posture & Control Plane Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lock MCP posture in docs, add Jarvis proactive completion announce via `events/since`, and ship a thin confirm-gated `occ-control` MCP adapter over OCC intents.

**Architecture:** Skills stay local markdown. LiveKit keeps calling OCC HTTP. New `GET /api/jarvis/events/since` feeds a LiveKit watcher that speaks finish/gap lines (deduped, deferred over Confirm?). Optional `occ-control` adapts the same `handleJarvisAct` / confirm store for non-Jarvis MCP clients.

**Tech Stack:** TypeScript, Vitest, Hono, LiveKit agent, existing jarvis act/confirm pipeline.

## Global Constraints

- Skills ≠ MCP servers; no per-seat MCP under `skills/org/positions/`
- No Cursor-SDK-as-MCP wrapper for Jarvis; OCC remains the bridge
- Composio not a v1 dependency
- Hard confirm for writes; audit parity with HTTP jarvis
- TDD: failing test before implementation on every code task
- Commits only when the human asks (skip Step “Commit” unless instructed)
- Work under `tools/org-command-center/`, `skills/org/`, and `docs/superpowers/`

## File map

| Path | Responsibility |
|------|----------------|
| `skills/org/TOOL-REGISTRY.md` | MCP posture section |
| `skills/org/README.md` | Skills ≠ MCP paragraph |
| `docs/superpowers/specs/2026-07-16-digital-worker-integrations-design.md` | Clarify non-goal vs Phase C |
| `tools/org-command-center/README.md` | Posture + completion announce notes |
| `server/jarvis/run-events.ts` | `eventCursor`, `listRunEventsSince`, `spokenAnnounceLine` |
| `server/api.ts` | `GET /api/jarvis/events/since` |
| `livekit-agent/src/completion-announce.ts` | Dedupe, defer, poll guard, announce text |
| `livekit-agent/src/confirm-gate.ts` | Waiting-for-confirm flag |
| `livekit-agent/src/occ-client.ts` | `eventsSince` client |
| `livekit-agent/src/occ-tools.ts` | Set/clear confirm gate on needs_confirm / confirm |
| `livekit-agent/src/agent.ts` | Watcher interval |
| `server/mcp/occ-control.ts` | Tool list + call → jarvis act/confirm |
| `server/mcp/occ-control-stdio.ts` | Stdio MCP bridge for Cursor IDE |
| `tools/org-command-center/docs/mcp.json` | Example client config |
| `scripts/check-no-seat-mcp.sh` | Guard against per-seat MCP dirs |

---

### Task 1: Phase A — posture docs

**Files:**
- Modify: `skills/org/TOOL-REGISTRY.md`
- Modify: `skills/org/README.md`
- Modify: `docs/superpowers/specs/2026-07-16-digital-worker-integrations-design.md`
- Modify: `tools/org-command-center/README.md`

- [x] **Step 1: Add MCP posture section to TOOL-REGISTRY** (after Hard rules)

- [x] **Step 2: Add skills ≠ MCP note to org README**

- [x] **Step 3: Clarify integrations design non-goal** — hosting per-seat MCP forbidden; optional OCC Control MCP allowed per 2026-07-20 spec

- [x] **Step 4: OCC README** — link posture spec; note proactive completion announce

---

### Task 2: `listRunEventsSince` + spoken announce line (TDD)

**Files:**
- Modify: `tools/org-command-center/server/jarvis/run-events.ts`
- Modify: `tools/org-command-center/server/jarvis/run-events.test.ts`

**Interfaces:**
- Produces: `eventCursor(e: RunEvent): string`
- Produces: `listRunEventsSince(dispatchRoot, cursor?: string): { events: RunEvent[]; nextCursor: string | null }`
- Produces: `spokenAnnounceLine(e: RunEvent): string | null` — only for `finished` | `error` | `acceptance_failed`; never includes digit runIds

- [x] **Step 1: Write failing tests** for since-cursor ordering, nextCursor, announce lines, null for `started`

- [x] **Step 2: Run** `cd tools/org-command-center && npx vitest run server/jarvis/run-events.test.ts` — expect FAIL

- [x] **Step 3: Implement** helpers in `run-events.ts`

- [x] **Step 4: Re-run tests** — expect PASS

---

### Task 3: `GET /api/jarvis/events/since` (TDD)

**Files:**
- Modify: `tools/org-command-center/server/api.ts`
- Create or modify: route test near existing jarvis API tests

**Interfaces:**
- Produces: `{ events, nextCursor, active }` where `active` is true if any session/run is queued/running/starting

- [x] **Step 1: Failing test** for empty feed, cursor advance, `active` flag

- [x] **Step 2: Implement route** `GET /api/jarvis/events/since?cursor=`

- [x] **Step 3: Tests pass**

---

### Task 4: LiveKit completion announce helpers (TDD)

**Files:**
- Create: `tools/org-command-center/livekit-agent/src/completion-announce.ts`
- Create: `tools/org-command-center/livekit-agent/src/completion-announce.test.ts`
- Create: `tools/org-command-center/livekit-agent/src/confirm-gate.ts`
- Create: `tools/org-command-center/livekit-agent/src/confirm-gate.test.ts`

**Interfaces:**
- `shouldPollEvents(active, lastTerminalAtMs, nowMs): boolean` — poll when active OR within 30s of last terminal event
- `selectAnnounceEvents(events, announcedKeys, waitingConfirm): { speak: string[]; mark: string[] }` — empty speak when waitingConfirm; dedupe by cursor key
- `createConfirmGate()` → `{ isWaiting, setWaiting }`

- [x] **Step 1: Failing tests**

- [x] **Step 2: Implement**

- [x] **Step 3: Pass**

---

### Task 5: Wire watcher into LiveKit agent

**Files:**
- Modify: `livekit-agent/src/occ-client.ts` — `eventsSince(cursor?)`
- Modify: `livekit-agent/src/occ-tools.ts` — set waiting on needs_confirm speech path; clear on jarvis_confirm
- Modify: `livekit-agent/src/agent.ts` — 2s interval when `shouldPollEvents`
- Modify: `livekit-agent/src/jarvis-system-prompt.ts` — one line: system may announce finishes; do not invent them

- [x] **Step 1: Unit-test occ-client eventsSince URL** if client tests exist

- [x] **Step 2: Wire gate + watcher**

- [x] **Step 3: `npm run agent:test` + OCC vitest for touched files**

---

### Task 6: OCC Control MCP tool adapter (TDD)

**Files:**
- Create: `tools/org-command-center/server/mcp/occ-control.ts`
- Create: `tools/org-command-center/server/mcp/occ-control.test.ts`
- Modify: `tools/org-command-center/server/api.ts` — mount HTTP JSON bridge `POST /api/mcp/occ-control`

**Interfaces:**
- Tool names exactly as spec C.3
- `occ_work_request` → needs_confirm token flow
- `occ_confirm` → accept/reject with token
- Reads call `handleJarvisAct` / existing confirm helpers with `roomId: "mcp"` default

- [x] **Step 1: Failing tests** for list tools, read watch, write without confirm, confirm accept

- [x] **Step 2: Implement adapter + route**

- [x] **Step 3: Pass**

---

### Task 7: Stdio bridge + mcp.json + seat-MCP guard

**Files:**
- Create: `tools/org-command-center/server/mcp/occ-control-stdio.ts` (HTTP client to `/api/mcp/occ-control`)
- Create: `tools/org-command-center/docs/mcp.json`
- Create: `tools/org-command-center/scripts/check-no-seat-mcp.sh`
- Modify: `package.json` script `check:mcp-posture`

- [x] **Step 1: Example mcp.json + stdio bridge**

- [x] **Step 2: Guard script** fails if `skills/org/positions/*/mcp-server` exists

- [x] **Step 3: Run guard — expect PASS on clean tree**

---

## Verification (all phases)

```bash
cd tools/org-command-center && npm test && npm run agent:test && npm run check:mcp-posture
```
