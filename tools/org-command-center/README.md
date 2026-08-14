# Org Command Center — Situation Room

Glance-first war-table: full-bleed 3D command table with a thin **Glance** bar (customer · initiative · phase, threat-first status line, **Run next** as the only filled CTA, Talk / Brief me, **Command deck**, Intelligence, System). **Threat rail** mounts only when seats are blocked (RESOLVE via `blocker.resolve`; **ANSWER** for `needs_input` / open asks opens the Report Q&A form). **Seat console** opens only while a seat is selected. Portfolio CRUD, spend, progress, auto-spawn, OmniVoice, and follow-cam live in **System → Workspace**. First visit plays a four-step tour (`sr-tour-v1`; replay from System). Voice stack is self-hosted LiveKit + Dialogue Control Plane.

Glanceable mission status, live tasks, execution controls, narrative seat reports, and production artifact browsing share the same teal glass system (`theme.css` · `.j-hud-panel`). Active, running, blocked, needs-input (**ANSWER** cue), and escalated seats retain persistent text cues in addition to semantic color; phase rail marks use **Pending / In progress / Done / Skipped** (no emoji chrome). Reduced-motion preferences disable pulse/orbit, follow-cam, gaze lift, tour motion, and animated camera travel.

Use the compact **Command deck** control in the Glance bar, or `Cmd+K` / `Ctrl+K`, to search seats and active tasks. Seat results drive the canonical theater highlight and seat-console selection; run-backed tasks resolve their run position when needed and also open the matching Runs detail. Completed, cancelled, and done tasks are excluded.

## Situation Room operation

`SituationRoom` is the canonical Jarvis interface. The organization theater remains its defining workspace; **Ops tables** are an optional supplement under **System**. Workspace toggles never permit both views to be hidden. Floor / Assign / Outputs are not 3D modes — Assign and Outputs stay drawers from Intelligence.

- **Glance bar:** identity + one status sentence from `glanceStatusLine` (top threat headline when blocked, otherwise `mission.nextAction`). **Run next** is the only filled button; hover/focus previews the wake seat. Talk / Brief me stay in the bar. Portfolio CRUD is not in the hero.
- **Command deck:** open from the Glance bar or `Cmd+K` on macOS / `Ctrl+K` elsewhere. The controller remains mounted when Theater is hidden, so the shortcut also works in Ops-only mode. Search seats and active tasks, use arrow keys and Enter to select, and Escape to close. Selection writes through the canonical Jarvis store, highlights the seat, focuses the theater camera, and opens run detail for run-backed tasks.
- **Inspect:** click a seat (or Command deck result) to open the seat console; double-click opens the full report drawer. Click empty table, or **Esc** when no dialog is open, clears selection, closes the console, and frames the company. **j** / **k** cycle needs-you seats (`blocked`, `needs_input`); ignored while a field or dialog has focus.
- **Threat rail:** left overlay only when `blockedSeats.length > 0`. When clear, the left stack is empty — no “ALL CLEAR” card.
- **Follow-cam:** on by default (`sr-follow-cam` unset). Tracks running seats when nothing is selected and the operator is not orbiting. Toggle from System or Workspace. Yields to inspect.
- **Tour:** four coach marks on first visit (`sr-tour-v1`). **System → Replay tour** resets and replays.
- **System → Workspace:** Agency (disabled), customer, initiative, Add customer, Add initiative, plus Status (progress, spend, OmniVoice, auto-spawn, last updated, follow-cam).
- **Accessible overlays:** shadcn/Radix Dialog, Command, and Dropdown primitives provide named dialogs and menus, focus trapping, keyboard navigation, backdrop/Escape dismissal, and focus restoration to the opener.
- **Responsive theater:** wide desktop keeps the full theater and side overlays; short laptop viewports scroll without collapsing the 520px theater; at 390px the document scrolls around a retained 620px theater with compact, scrollable command clusters and docked overlays.
- **Feedback:** initial skeletons, loading/status announcements, explicit error and empty states, refresh/last-updated status, retryable scorecard/chat/review-inbox failures, and copy-path success/failure are visible and announced where appropriate. “Inbox clear” appears only after a successful empty review-inbox response. Reduced-motion disables cinematic transitions, pulse/orbit effects, bloom, follow-cam, and animated camera travel.
- **Safety contracts:** dispatch remains manager-only and venture-isolated. A `needs_confirm` response is returned without automatic resubmission; blocker resolution displays the server summary/reason in a Radix confirmation dialog, and only explicit operator confirmation sends the token. Cancel, Escape, and backdrop dismissal explicitly invalidate that exact token with `accept: false`; cancellation failures remain visible in the dialog and cannot fall through to confirmation. Run next and other hard writes retain confirmation requirements unless explicit auto-spawn is enabled.
- **Live status:** only active runs (`starting`, `running`) or sessions (`active`, `starting`, `running`, `connected`) render a seat as running. Completed historical sessions are ignored. Claimed packets are correlated with run/session lifecycle truth: successful terminal work is done, failed/cancelled work is pending and recoverable when a session can be rewoken, and an orphan claimed packet stays idle/pending rather than appearing live.

## Quick start

```bash
cd tools/org-command-center
npm install
npm run dev           # http://localhost:5177
```

## Jarvis voice stack (zero-cost, OSS)

No LiveKit Cloud. No Deepgram/Cartesia. Voice LLM is **Ollama only** (`qwen3` default).

```bash
npm run voice-stack   # prints the full recipe

# Terminals:
npm run livekit:up          # brew install livekit → :7880 (devkey/secret)
npm run whisper:up          # local Whisper → :8090
ollama serve && ollama pull qwen3   # fallback: ollama pull llama3.1
npm run mlx-tts:setup       # once — Kokoro via mlx-audio
npm run mlx-tts:up          # Kokoro TTS → :3900 (voice am_adam)
# fallback: npm run say-tts:up
npm run agent:dev           # situation-room worker
npm run dev                 # UI — floating mic FAB bottom-right
```

| Piece | Port | Role |
|-------|------|------|
| livekit-server --dev | 7880 | WebRTC room |
| Whisper sidecar | 8090 | STT |
| Ollama | 11434 | LLM (Talk agent, `qwen3`) |
| mlx-audio Kokoro | 3900 | TTS (`am_adam`) |
| OCC | 5177 | DCP + company tools + token mint |
| Agent worker | — | Joins rooms as `situation-room` |

### Latency targets (local, warm)

| Stage | Target |
|-------|--------|
| STT end → first audio | < 2.5s |
| Confirm round-trip | < 1.5s |
| Kokoro cold start | Once per boot; `mlx-tts:up` preloads via 1-word synthesis |

`mlx-tts:up` starts Kokoro in the background, waits for `:3900`, POSTs a warmup to `/tmp/kokoro-warm.wav`, then keeps the server in the foreground. Preload failure logs a warning only — the server stays up.

**Talk FAB:** tap to connect · tap again to mute/unmute · × to hang up. Glance bar **Talk** uses the same session. **Legacy voice** = old Web Speech + HTTP chat (`OCC_VOICE_BACKEND=legacy`).

**Speech hygiene:** Tool results are sanitized for TTS (`sanitizeForSpeech`) and prefer the act `summary` over raw JSON/markdown so Kokoro does not say “asterisk” or monologue dump payloads. Restart `npm run jarvis:agent` (or your voice-stack recipe) after pulling these changes.

Env (defaults work for local):

```bash
LIVEKIT_URL=ws://127.0.0.1:7880
LIVEKIT_API_KEY=devkey
LIVEKIT_API_SECRET=secret
OCC_VOICE_BACKEND=livekit
OLLAMA_BASE_URL=http://127.0.0.1:11434/v1
OLLAMA_MODEL=qwen3
WHISPER_URL=http://127.0.0.1:8090/v1
OMNIVOICE_URL=http://127.0.0.1:3900
OMNIVOICE_MODEL=mlx-community/Kokoro-82M-bf16
OMNIVOICE_VOICE=am_adam
OCC_API_BASE=http://127.0.0.1:5177
JARVIS_PULSE_MS=0          # optional idle mission pulse (ms; 0 = off)
JARVIS_LLM_BACKEND=ollama  # voice turn-taking LLM (local Ollama)
JARVIS_BRAIN_MODEL=grok-4.5  # Cursor SDK model for brain.ask + brain.route
XAI_API_KEY=               # optional direct xAI voice LLM; ignored when JARVIS_LLM_BACKEND=ollama
CURSOR_API_KEY=   # required for brain.route / brain.ask + voice work.request + Run next (Cursor SDK)
```

**Voice LLM:** Default harness is local Ollama (`JARVIS_LLM_BACKEND=ollama`) for leftover tool turns after routing. STT/TTS stay local (Whisper + Kokoro). **Intent routing** uses Cursor SDK `brain.route` (`grok-4.5` via `CURSOR_API_KEY`) to classify ask vs proceed vs clarify, then OCC tools answer or Confirm?. Deep think remains `brain.ask` (“think hard / ask Grok / tradeoffs…”). Worker spawn is separate and also uses the Cursor SDK.

**Voice → Cursor spawn:** In Ops, say e.g. “spin up the CEO to look at this project” or “write a short blog”. Jarvis switches to Ops, runs `work.resolve` once, then `work.request` → one confirm → queues the manager and starts Cursor (`spawnClaimedManagerDetached`). Content asks (blog/copy) may gather a couple of requirements first; clear seat+goal asks skip invented clarifying questions. Deliverables land under `docs/projects/<active>/business-idea/REVIEW/inbox/` (Outputs drawer → **Needs review**). Without `CURSOR_API_KEY` in repo `.env.local`, confirm will fail with “CURSOR_API_KEY missing”.

Optional Ollama smoke (only if using `JARVIS_LLM_BACKEND=ollama`):

```bash
npm run jarvis:smoke   # requires: ollama pull qwen3 && ollama serve
```

## Jarvis modes

Default on connect: **Briefing** (read-only). Hard writes require the right mode + spoken confirm.

| Mode | Say | Unlocks |
|------|-----|---------|
| **Briefing** | “switch to briefing” | Reads, digests, `venture.list` / `venture.get` |
| **Ops** | “switch to ops” | Queue, `queue_for`, `work.request`, spawn, pause, cancel, rewake |
| **Review** | “switch to review” | `file.read`, `csuite.draft`, handoffs |
| **Architect** | “switch to architect” | `venture.create`, `venture.switch` |

Mode changes via natural speech (`mode.set` intent) or agent tool `set_mode`. Ops-only intents are **denied** in Briefing; venture create/switch require **Architect**.

## Confirm phrase

When Jarvis proposes a write (assign, run, pause, cancel, etc.):

1. Jarvis speaks a one-line summary and asks **“Confirm?”**
2. Reply **yes** to execute or **no** to cancel (also `jarvis_confirm` tool / UI)
3. Confirm tokens expire in **60s** and are **single-use**

Example: “Queue phase 2 research” → summary → “Confirm?” → “yes”.

## Knowledge graph (org work + Graphify)

**Situation Room → Intelligence → Knowledge graph** shows the **portfolio org-work graph** by default (`GET /api/org-work-graph?scope=portfolio`): Velocity Agency → customers → initiatives → work (active initiative expanded; others summarized). Use `scope=initiative` for the single-active work graph. Click a seat node to open that seat’s report.

**Graphify** remains a separate local code/docs graph for agents (query instead of grepping). It is not what the Knowledge graph menu renders.

```bash
# Install CLI (once)
uv tool install "graphifyy[mcp,ollama]"

# Build / refresh the OCC code graph (AST only, no API key)
graphify extract tools/org-command-center --code-only --force
graphify cluster-only tools/org-command-center   # writes graph.html + GRAPH_REPORT.md

# Optional: semantic pass over org skill docs (needs Ollama or another backend)
OLLAMA_API_KEY=ollama OLLAMA_MODEL=qwen3 \
  graphify extract skills/org --backend ollama --token-budget 3000

# Cursor skill + always-on rule
graphify cursor install --project

# MCP (Cursor / agents) — see docs/mcp.json
graphify-mcp tools/org-command-center/graphify-out/graph.json
```

| Surface | How |
|---------|-----|
| Situation Room | Intelligence → **Knowledge graph** → org-work graph (`/api/org-work-graph`) |
| Jarvis intents | `graph.status`, `graph.query`, `graph.path`, `graph.explain` (Graphify code map; read-only) |
| HTTP (Graphify) | `GET /api/graphify/status`, `GET /api/graphify/view` |
| Cursor MCP | `docs/mcp.json` → `graphify` server (`query_graph`, `shortest_path`, …) |

Canonical artifacts live at repo-root `graphify-out/` (OCC also keeps a copy under `tools/org-command-center/graphify-out/`). Jarvis resolves root first. Ignore `cost.json` / local cache churn; commit `graph.json` + `graph.html` + `GRAPH_REPORT.md` when you want the team to share a map.

## Obsidian vault source of truth (role markdown)

Role notes live once in the **memorybank** Obsidian vault. OCC keeps the usual paths under `docs/projects/<venture>/…` as **symlinks** into the vault (no dual copies).

| Path in OCC (symlink) | Vault SoT |
|-----------------------|-----------|
| `…/business-idea/HANDOFFS` | `memorybank/org/<venture>/HANDOFFS` |
| `…/business-idea/BRIEFINGS` | `memorybank/org/<venture>/BRIEFINGS` |
| `…/business-idea/REVIEW` | `memorybank/org/<venture>/REVIEW` |
| `…/MEMORY` | `memorybank/org/<venture>/MEMORY` |
| `…/business-idea/NN-*.md` | `memorybank/org/<venture>/phases/NN-*.md` |

Runtime stays on disk under docs: `DISPATCH/`, `RUNBOOK-TRACKER.md`, `SOURCES/`, operator blockers, etc.

```bash
# Optional — Obsidian MCP for search/tools (not required for SoT layout)
OBSIDIAN_MCP_URL=http://127.0.0.1:27200/mcp
OBSIDIAN_MCP_TOKEN=<token from Obsidian → MCP Connector settings>

# Cursor MCP: copy .cursor/mcp.json.example → .cursor/mcp.json and paste the token
```

| Surface | How |
|---------|-----|
| Layout | `ensureVentureVaultSourceOfTruth` (create-venture + `obsidian.sync`) |
| Jarvis | `obsidian.status` (read) · `obsidian.sync` (Ops + confirm) — link/migrate, not copy |
| HTTP | `GET /api/obsidian/status` · `POST /api/obsidian/sync` `{ "venture": "blacksage-kennels" }` |
| Vault layout | `memorybank/org/<venture>/{HANDOFFS,BRIEFINGS,REVIEW,MEMORY,phases}/…` |

Refresh Graphify over vault notes after large changes:

```bash
graphify extract memorybank/org --force
graphify merge-graphs graphify-out/graph.json memorybank/org/graphify-out/graph.json \
  --out graphify-out/graph.json
graphify cluster-only graphify-out --graph graphify-out/graph.json --no-label
```

## What you see

| Zone | Purpose |
|------|---------|
| Glance bar | Situation Room title, customer · initiative · phase, threat-first status line, **Run next** (only filled CTA), Talk / Brief me, Command deck, Intelligence / System |
| Theater | Command table, seat terminals, phase rail (Pending / In progress / Done / Skipped), follow-cam, inspect on select |
| Knowledge graph | Intelligence menu → live org-work graph (all roster seats, handoffs, runs, deliverables, artifacts; click opens seat report). Graphify CLI remains for code RAG only. |
| Floating Talk | LiveKit mic session (Ollama + Whisper + Kokoro TTS) |
| Seat Report / Seat console | Console only while a seat is selected. Same business-conversation layout for every role: What happened → Why it matters → Next steps → What we need from you → What’s stuck. `/api/seat-report` returns the deterministic brief immediately, then Grok rewrites in the background (UI soft-polls until ready). Voice `seat.report` awaits up to `JARVIS_SEAT_BRIEF_TIMEOUT_MS` (default 4s) then falls back. Model: `JARVIS_SEAT_BRIEF_MODEL` / `JARVIS_BRAIN_MODEL` (default `grok-4.5`) via Cursor SDK + `CURSOR_API_KEY`. Cached by seat + content hash. |
| Threat rail | Mounts only when seats are blocked. Blocked + needs-input seats show roster **title**, plain status (**Needs your input** / **Stuck**), and humanized reasons (process noise like “peer help: none” dropped). On every `/api/company-digest`, `digest.get`, and `blocker.list`, OCC batch-rewrites threat headlines with the same Cursor Grok path (`JARVIS_THREAT_BRIEF_MODEL` → seat/brain model, default `grok-4.5`), cached by threat content hash. |
| Company digest | Blocked/escalate/awaiting-csuite rollup (Intelligence → Digest) |
| Live tasks | Play / Cancel / Rewake (Ops tables) |
| Runs / Routines | Execution + cron (System drawers) |
| Outputs | Intelligence drawer — **production assets only** (HTML, apps, images, video, Office, design-system) with typed preview (`/api/file/raw` for binary). Snapshot also discovers files under each seat’s `## Outputs` leases. Needs-review inbox stays a separate strip; narrative briefs live in Report. |

**Portfolio:** **System → Workspace** selects **Agency / Customer / Initiative**. **Add initiative** scaffolds a full workspace under the current customer; **Add customer** creates a customer with default `main`. Registry is portfolio v2 (`projects/registry.json`).

**Sources / context:** Outputs drawer → **Sources** — upload docs (text extracted for agents), edit the initiative context note. Add initiative / Add customer can set the note at create time. Assign/queue auto-adds `MEMORY/context.md` + source index to `must_read`.

## Execution

| Action | Effect |
|--------|--------|
| Assign | Queue manager packet |
| Run next / Play | Claim + Cursor SDK spawn (workers) |
| Talk FAB | Self-hosted LiveKit voice ↔ DCP ↔ OCC tools |
| Report | Narrative seat brief + questions form; submit answers → `seat.answer` (confirm) persists answers and rewakes/queues the owning manager |
| Pin snapshot | Optional BRIEFINGS standup |
| Draft csuite | Prefill review (no auto-approve) |

## Voice commands cheatsheet

Jarvis maps natural speech to **intents** via `jarvis_act`. Use **Ops** before queue/spawn/pause/cancel; **Architect** before venture create/switch; **Review** for file read and csuite draft.

| Say (examples) | Intent | Confirm? |
|----------------|--------|----------|
| Where are we / mission status / AWG status | `mission.get` | No |
| Company digest / rollup / blockers | `digest.get` | No |
| What's blocked / any blockers / list blockers | `blocker.list` | No |
| Resolve that blocker / unblock research (after listing) | `blocker.resolve` | Yes |
| Report on research / what are they asking | `seat.report` | No |
| Save that answer / next question (after report) | `seat.answer_draft` | No (Ops) |
| Answer questions for research / continue that seat / the answer is … | `seat.answer` | Yes |
| What tasks / live tasks | `tasks.list` | No |
| List runs / what’s running | `runs.list` | No |
| Is it done / run status / watch runs | `runs.watch` | No |
| Status of run … (by id) | `runs.get` | No |
| Activity / recent pulse | `activity.list` | No |
| Alerts / handoff alerts | `alerts.list` | No |
| Ack alert … / dismiss alert … | `alerts.ack` | Soft |
| Spend / budget by seat | `spend.get` | No |
| Assign phase 2 research / queue dispatch | `dispatch.queue` | Yes |
| Give CFO a task to … / queue head-of-research to … | `dispatch.queue_for` | Yes |
| Spin up research and finance / kick off multiple managers | `dispatch.queue_batch` then `spawn.run_ready` | Yes (each) |
| Run ready / start queued managers | `spawn.run_ready` | Yes |
| Run next / spawn / execute queue | `spawn.run_next` | Yes |
| Cancel run … | `run.cancel` | Yes |
| Rewake / resume session … | `run.rewake` | Yes |
| Tell them to … / also cover … (mid-run) | `run.instruct` | Yes |
| Pause head-of-research / pause seat … | `agent.pause` | Yes |
| Resume … / unpause seat … | `agent.resume` | Yes |
| Draft csuite / csuite review phase 2 | `csuite.draft` | Yes |
| Enable routine … | `routine.enable` | Soft |
| Read file … (allowlisted paths only) | `file.read` | No |
| Switch to ops / briefing / review / architect | `mode.set` | No |
| Create a venture called X | `venture.create` | Yes (auto-activates) |
| Switch to venture slug | `venture.switch` | Yes |
| Spawn the copywriter | `agent.spawn_ic` | Denied |
| Write a short blog / create an article | `work.resolve` → intake → `work.request` | Yes (on request) |
| Kick off the work / start Cursor | `work.request` | Yes |
| Show review inbox / needs review | `review.inbox_list` | No |
| Knowledge graph status / is the graph ready | `graph.status` | No |
| Query the graph for auth flow / what connects SeatNode | `graph.query` | No |
| Path from SituationRoom to SeatNode | `graph.path` | No |
| Explain SeatNode in the graph | `graph.explain` | No |
| Vault SoT status | `obsidian.status` | No |
| Ensure vault SoT (symlinks) | `obsidian.sync` | Yes (Ops) |

Review mode adds `file.read`, `csuite.draft`, and handoffs; spawn intents stay disabled there. IC spawn requests are always denied — use `work.resolve` / `work.request` so Jarvis intakes with the manager and starts Cursor.

**Phase 1+2 lifecycle intents:** `runs.watch` (completion/gaps), `run.instruct` (mid-run operator delta), `blocker.list` / `blocker.resolve` (blocked seats), `dispatch.queue_batch` + `spawn.run_ready` (multi-manager kickoff). Started ≠ done — always confirm with `runs.watch` before reporting completion.

**MCP posture:** Seat skills stay markdown; do not wrap Cursor as MCP for voice. Jarvis uses OCC HTTP. Optional `occ-control` MCP is for non-Jarvis clients only. Design: [`docs/superpowers/specs/2026-07-20-mcp-posture-and-control-plane-design.md`](../../docs/superpowers/specs/2026-07-20-mcp-posture-and-control-plane-design.md). Example client config: [`docs/mcp.json`](./docs/mcp.json).

**Proactive completion:** While runs are active (and briefly after), the LiveKit agent polls `GET /api/jarvis/events/since` and may announce finish/gap lines without the user asking. Announces defer while waiting on Confirm?. Pull path (`runs.watch`) remains.

**Voice seat answers (report → draft → confirm):**

1. “Report on research” → `seat.report` (opens Report drawer, speaks brief + first open question; seeds last-reported seat).
2. Answer on mic → `seat_answer_draft` / `seat.answer_draft` (multi-turn; Ops; no Confirm?).
3. When questions are drafted (or one-shot) → `seat_answer` / `seat.answer` → speak Confirm? → `jarvis_confirm`.
4. Use `blocker.resolve` only for hard blockers; if `blocker.list` says “needs answers”, use the answer path.
5. Pulse/context may announce “{seat} needs answers” when a seat newly flips to `needs_input` (deferred during Confirm? / mid-turn).

## Manual soak

Use a live voice session (LiveKit + Ops mode) to validate end-to-end behavior after deploy.

**After Phase 1 (closed action loop):**

1. Voice: “Spin up the CEO to review this project” → Confirm → hear **started** + runId
2. Wait / ask “is it done?” → `runs.watch` reflects finished or gaps
3. If gaps: “tell them to write the review to the inbox” → `run.instruct`
4. Confirm inbox file has `runId` frontmatter

**After Phase 2 (ops control plane):**

1. Create a blocked handoff fixture → “what’s blocked?” → “resolve that blocker” → confirm → owner running
2. “Kick off head of research and CFO on market and burn” → one confirm → two runIds

## Jarvis venture memory (Chroma)

Filesystem under each venture `MEMORY/` is the source of truth. Optional semantic recall uses a **local Chroma server** (not in-process):

```bash
cd tools/org-command-center
npx chroma run --path .data/chroma --port 8000
```

Env (optional):

```bash
CHROMA_URL=http://127.0.0.1:8000   # default
JARVIS_CHROMA_AUTOSTART=1          # spawn `npx chroma run` if heartbeat fails
JARVIS_CHROMA_TEST=1               # run live Chroma integration tests
```

`memory.note` always writes to disk; Chroma upsert is best-effort. `memory.recall` tries Chroma when the server is up, otherwise ripgrep-style grep over MEMORY.

Voice cheatsheet:

- **Where are we / what's next?** → `memory.brief` (read-only; spoken on wake via `spokenBrief`)
- **Remember that …** → Ops mode + `memory.note` (confirm)
- **Digest this session** → Ops mode + `memory.digest` (confirm); LiveKit also best-effort auto-digest on disconnect
- **Search memory** → `memory.recall`
- **Rebuild index** → Ops mode + `memory.reindex` (confirm)

## Tests & eval

```bash
npm test -- src/jarvis    # targeted Jarvis UI/domain tests
npm test                  # full unit + golden transcript eval (≥20 cases, no LiveKit)
npm run build
npm run agent:test        # livekit-agent wiring
npm run jarvis:smoke      # Ollama tool-call smoke (requires ollama pull qwen3)
npm run jarvis:eval:ollama   # optional live LLM eval against golden.json
```

Known baseline (2026-08-05): targeted Jarvis tests are green (**30 files, 118 tests**). The full suite has **3 pre-existing failures**: two `server/paths.test.ts` assertions assume `passive-grid` is active while the registry currently selects another venture, and one `server/memory/run-lifecycle.test.ts` assertion assumes a fixed session date. These are active-venture/date fixture assumptions, not Situation Room UI regressions.

Golden cases live in `server/jarvis/eval/golden.json`; CI runs heuristic intent + policy via `run-golden.test.ts` inside `npm test`.

## Design

- `docs/superpowers/specs/2026-07-16-org-command-center-design.md` — **v3.5** Jarvis Dialog
- `docs/superpowers/specs/2026-07-16-enterprise-jarvis-dialog-design.md` — DCP detail
- `docs/superpowers/plans/2026-07-16-enterprise-jarvis-dialog.md` — implementation plan
- `docs/superpowers/specs/2026-07-16-jarvis-intent-catalog-v2-design.md` — catalog v2 (architect mode, ventures, `queue_for`)
- `docs/superpowers/plans/2026-07-16-jarvis-intent-catalog-v2.md` — catalog v2 implementation plan
- `docs/superpowers/specs/2026-07-16-jarvis-work-request-voice-spawn-design.md` — voice-driven `work.request` + REVIEW inbox
- `docs/superpowers/specs/2026-07-17-jarvis-closed-action-loop-design.md` — closed action loop + ops control plane (Approved)
