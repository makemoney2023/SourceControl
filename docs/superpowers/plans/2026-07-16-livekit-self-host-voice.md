# Self-Hosted LiveKit Voice Layer (Zero LiveKit Cost) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans`. Checkbox tracking lives here.

**Goal:** Let the operator talk to the virtual company with their microphone via **self-hosted LiveKit** (no LiveKit Cloud fees), with **local STT / LLM / TTS** so the voice stack adds **$0 new SaaS cost**. OCC remains the company control plane; LiveKit is transport + conversation only.

**Architecture:** Three local processes + OCC: (1) `livekit-server --dev` on `:7880`, (2) Node **Situation Room Agent** worker that joins rooms and calls OCC HTTP tools, (3) local model sidecars — **Ollama** (LLM), **Whisper sidecar** (STT), **OmniVoice** (TTS, already in-repo). Situation Room gets a **floating voice FAB** (always on-screen) for push-to-talk / continuous back-and-forth, plus an optional mission-strip **Talk** entry that opens the same session.

**Tech Stack:** LiveKit open-source server, `@livekit/agents` (Node), `livekit-server-sdk` (tokens), `@livekit/components-react` (UI), Ollama OpenAI-compatible API, OmniVoice `:3900`, small Whisper HTTP sidecar (MLX/faster-whisper on M4), Vitest, Hono OCC API.

## Cost lock (non-negotiable)

| Component | Choice | Money |
|-----------|--------|-------|
| LiveKit media server | Self-host `livekit-server --dev` ([local docs](https://docs.livekit.io/transport/self-hosting/local/)) | **$0** |
| Agent worker | Local Node process ([custom deploy](https://docs.livekit.io/deploy/custom/deployments/)) | **$0** |
| LiveKit Cloud / Inference | **Forbidden** in this plan | — |
| Deepgram / Cartesia / paid STT-TTS | **Forbidden** | — |
| LLM | **Ollama only** on localhost (`http://127.0.0.1:11434/v1`) | **$0** |
| STT | Local **Whisper sidecar** (MLX Whisper or faster-whisper) | **$0** |
| TTS | Existing **OmniVoice** (`OMNIVOICE_URL`) | **$0** |
| Cursor models (Composer / Grok via Cursor SDK) | **Digital workers only** (Run next / spawn) — **not** the voice operator LLM | existing usage |

**Voice LLM lock:** Ollama is the Situation Room Talk agent brain. Do **not** wire Cursor Composer/Grok, LiveKit Inference, or cloud chat APIs into the voice agent in v1. No OpenAI-compatible escape hatch in v1.

**Explicit non-goal:** Perfect cloud-quality voices. Goal is free, local, usable CEO↔company voice.

## Global Constraints

- Files under `tools/org-command-center/` (+ this plan + design spec append). No new root app.
- Do not break Assign / Play / Seat Report / Digest.
- Keep legacy `POST /api/voice/chat` + Web Speech as fallback when LiveKit is down (`OCC_VOICE_BACKEND=livekit|legacy`).
- Mac / zsh; LiveKit binds `127.0.0.1` by default (use `--bind 0.0.0.0` only if LAN needed).
- Dev credentials for `--dev`: API key `devkey`, secret `secret` ([docs](https://docs.livekit.io/transport/self-hosting/local/)).
- TDD for token minting, OCC tool client, Whisper/OmniVoice adapters (unit, mocked fetch).
- Agent tools must call OCC over `http://127.0.0.1:<occ-port>` — never invent company state.

---

## Design lock

```
┌─────────────┐  WebRTC mic/spk   ┌──────────────────┐
│ Situation   │ ←──────────────→  │ livekit-server   │
│ Room Talk   │   JWT from OCC    │ :7880 (self-host)│
└─────────────┘                   └────────┬─────────┘
                                           │ job dispatch
                                  ┌────────▼─────────┐
                                  │ occ-voice-agent  │
                                  │ (Node worker)    │
                                  └───┬─────┬────┬───┘
                    STT HTTP          │     │    │ TTS HTTP
              ┌───────▼───┐    ┌─────▼──┐  │  ┌─▼────────┐
              │ whisper   │    │ Ollama │  │  │ OmniVoice│
              │ :8090     │    │ :11434 │  │  │ :3900    │
              └───────────┘    └────────┘  │  └──────────┘
                                           │ tools HTTP
                                  ┌────────▼─────────┐
                                  │ OCC API :5177    │
                                  │ seat-report,     │
                                  │ assign, spawn…   │
                                  └──────────────────┘
```

**Agent name:** `situation-room` (stable; used in room agent dispatch).

**Tools (mirror chat tools, HTTP):**  
`get_mission`, `get_tasks`, `get_seat_report`, `get_company_digest`, `queue_dispatch`, `spawn_manager` / run_next, `draft_csuite` (optional), `open_ui` (data message to room for UI hints).

---

## File map

| Path | Responsibility |
|------|----------------|
| `docs/superpowers/specs/2026-07-16-org-command-center-design.md` | Append **v3.4 Self-hosted LiveKit voice** |
| `tools/org-command-center/scripts/livekit-up.sh` | Start `livekit-server --dev` |
| `tools/org-command-center/scripts/whisper-up.sh` | Start local Whisper sidecar |
| `tools/org-command-center/scripts/voice-stack-up.sh` | Orchestrate livekit + whisper + omnivoice + agent |
| `tools/org-command-center/server/livekit-token.ts` | Mint JWT (`devkey`/`secret`) |
| `tools/org-command-center/server/livekit-token.test.ts` | Token unit tests |
| `tools/org-command-center/server/api.ts` | `POST /api/livekit/token`, health |
| `tools/org-command-center/livekit-agent/` | Node agent package (worker) |
| `tools/org-command-center/livekit-agent/src/occ-tools.ts` | HTTP tool implementations |
| `tools/org-command-center/livekit-agent/src/adapters/ollama-llm.ts` | OpenAI-compatible → Ollama |
| `tools/org-command-center/livekit-agent/src/adapters/omnivoice-tts.ts` | TTS → OmniVoice WAV stream |
| `tools/org-command-center/livekit-agent/src/adapters/whisper-stt.ts` | STT → Whisper sidecar |
| `tools/org-command-center/whisper-sidecar/` | Minimal FastAPI/Flask or Node ffmpeg+whisper HTTP |
| `tools/org-command-center/src/jarvis/LiveKitTalk.tsx` | Session logic + compact status chip |
| `tools/org-command-center/src/jarvis/VoiceFab.tsx` | Fixed floating mic button (back-and-forth) |
| `tools/org-command-center/src/jarvis/SituationRoom.tsx` | Mount VoiceFab + optional strip Talk |
| `tools/org-command-center/README.md` | Zero-cost voice stack setup |

---

### Task 1: Spec v3.4 + README cost rules

**Files:**
- Modify: `docs/superpowers/specs/2026-07-16-org-command-center-design.md`
- Modify: `tools/org-command-center/README.md`

- [ ] **Step 1: Append spec**

```markdown
## Self-hosted LiveKit voice (v3.4)

**Status:** Active (implemented)  
**Plan:** `docs/superpowers/plans/2026-07-16-livekit-self-host-voice.md`

### Cost policy

No LiveKit Cloud. No LiveKit Inference. No Deepgram/Cartesia.  
Local: `livekit-server --dev`, **Ollama-only** LLM (no Cursor models for voice), Whisper sidecar STT, OmniVoice TTS.

### Flow

1. Operator clicks **Talk** → `POST /api/livekit/token`  
2. Browser joins room with mic (LiveKit components)  
3. Agent `situation-room` dispatched → STT/LLM/TTS local → OCC tools  
4. If LiveKit down → `OCC_VOICE_BACKEND=legacy` keeps Web Speech + OmniVoice chat

### Env

```
LIVEKIT_URL=ws://127.0.0.1:7880
LIVEKIT_API_KEY=devkey
LIVEKIT_API_SECRET=secret
OCC_VOICE_BACKEND=livekit
OLLAMA_BASE_URL=http://127.0.0.1:11434/v1
OLLAMA_MODEL=llama3.2
WHISPER_URL=http://127.0.0.1:8090
OMNIVOICE_URL=http://127.0.0.1:3900
OCC_API_BASE=http://127.0.0.1:5177
```
```

- [ ] **Step 2: README section “Zero-cost voice (LiveKit self-host)”** with brew install + ollama pull + scripts

- [ ] **Step 3: Commit** (if user asked) or leave dirty for batch commit

---

### Task 2: LiveKit server scripts + health

**Files:**
- Create: `tools/org-command-center/scripts/livekit-up.sh`
- Create: `tools/org-command-center/scripts/livekit-down.sh`
- Modify: `package.json` scripts `livekit:up`, `livekit:down`, `voice-stack:up`

- [ ] **Step 1: `livekit-up.sh`**

```bash
#!/usr/bin/env bash
set -euo pipefail
if ! command -v livekit-server >/dev/null 2>&1; then
  echo "Install: brew update && brew install livekit"
  exit 1
fi
# Dev mode — key/secret = devkey / secret (see LiveKit local docs)
exec livekit-server --dev --bind 127.0.0.1
```

- [ ] **Step 2: Document verify**

```bash
brew install livekit
cd tools/org-command-center && npm run livekit:up
# expect listening on 7880
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:7880 || true
```

- [ ] **Step 3: Commit scripts**

---

### Task 3: Token minting (TDD)

**Files:**
- Create: `tools/org-command-center/server/livekit-token.ts`
- Create: `tools/org-command-center/server/livekit-token.test.ts`
- Modify: `package.json` — add dep `livekit-server-sdk`
- Modify: `server/api.ts` — `POST /api/livekit/token`, `GET /api/livekit/health`

**Interfaces:**

```ts
export function livekitEnv(): {
  url: string;
  apiKey: string;
  apiSecret: string;
  agentName: string;
};

export async function mintTalkToken(opts?: {
  roomName?: string;
  identity?: string;
}): Promise<{
  serverUrl: string;
  participantToken: string;
  roomName: string;
  agentName: string;
}>;
```

- [ ] **Step 1: Install**

```bash
cd tools/org-command-center && npm install livekit-server-sdk
```

- [ ] **Step 2: Failing test**

```ts
import { describe, expect, it } from "vitest";
import { mintTalkToken } from "./livekit-token";

describe("mintTalkToken", () => {
  it("returns jwt-like token and ws url", async () => {
    process.env.LIVEKIT_URL = "ws://127.0.0.1:7880";
    process.env.LIVEKIT_API_KEY = "devkey";
    process.env.LIVEKIT_API_SECRET = "secret";
    const t = await mintTalkToken({ roomName: "occ-test", identity: "operator" });
    expect(t.serverUrl).toContain("7880");
    expect(t.participantToken.split(".").length).toBe(3);
    expect(t.agentName).toBe("situation-room");
  });
});
```

- [ ] **Step 3: Implement** using `AccessToken` + `VideoGrant` + optional `RoomConfiguration` agent dispatch for `situation-room` ([token docs](https://docs.livekit.io/frontends/build/authentication/custom.md))

```ts
import { AccessToken, type VideoGrant } from "livekit-server-sdk";
import { RoomAgentDispatch, RoomConfiguration } from "@livekit/protocol";

export async function mintTalkToken(opts?: { roomName?: string; identity?: string }) {
  const apiKey = process.env.LIVEKIT_API_KEY || "devkey";
  const apiSecret = process.env.LIVEKIT_API_SECRET || "secret";
  const serverUrl = process.env.LIVEKIT_URL || "ws://127.0.0.1:7880";
  const agentName = process.env.LIVEKIT_AGENT_NAME || "situation-room";
  const roomName = opts?.roomName || `occ-${Date.now()}`;
  const identity = opts?.identity || "operator";

  const at = new AccessToken(apiKey, apiSecret, { identity, ttl: "1h" });
  const grant: VideoGrant = {
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  };
  at.addGrant(grant);
  at.roomConfig = new RoomConfiguration({
    agents: [new RoomAgentDispatch({ agentName })],
  });
  return {
    serverUrl,
    participantToken: await at.toJwt(),
    roomName,
    agentName,
  };
}
```

If `@livekit/protocol` RoomConfiguration import fails in vitest, mint without roomConfig first and dispatch agent via worker `agentName` auto-join on room create — document fallback: agent uses `request.room` auto-dispatch with `agentName` in WorkerOptions.

- [ ] **Step 4: API routes**

```ts
app.get("/api/livekit/health", async (c) => {
  const url = process.env.LIVEKIT_URL || "ws://127.0.0.1:7880";
  // TCP/HTTP probe to 7880 — return { ok, url }
});

app.post("/api/livekit/token", async (c) => {
  if ((process.env.OCC_VOICE_BACKEND || "livekit") === "legacy") {
    return c.json({ ok: false, error: "OCC_VOICE_BACKEND=legacy" }, 503);
  }
  const body = await c.req.json().catch(() => ({}));
  const token = await mintTalkToken(body);
  return c.json({ ok: true, ...token });
});
```

- [ ] **Step 5: `npm test` PASS**

---

### Task 4: OCC tool HTTP client for agent (TDD)

**Files:**
- Create: `tools/org-command-center/livekit-agent/package.json`
- Create: `tools/org-command-center/livekit-agent/src/occ-client.ts`
- Create: `tools/org-command-center/livekit-agent/src/occ-client.test.ts`
- Create: `tools/org-command-center/livekit-agent/src/occ-tools.ts`

**Interfaces:**

```ts
export function createOccClient(baseUrl: string): {
  getMission(): Promise<unknown>;
  getSeatReport(slug: string): Promise<unknown>;
  getCompanyDigest(): Promise<unknown>;
  getTasks(status?: string): Promise<unknown>;
  queueDispatch(phase: string, goal: string): Promise<unknown>;
  runNext(): Promise<unknown>;
};
```

- [ ] **Step 1: Scaffold package**

```json
{
  "name": "occ-livekit-agent",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx src/main.ts dev",
    "start": "tsx src/main.ts start",
    "test": "vitest run"
  }
}
```

Deps: `@livekit/agents`, `@livekit/agents-plugin-openai` (OpenAI-compatible client pointed at Ollama — **no OpenAI cloud required**), `zod`, `tsx`, `vitest`, `dotenv`.

- [ ] **Step 2: Tests with mocked `fetch`**

```ts
it("getSeatReport hits /api/seat-report/:slug", async () => {
  const calls: string[] = [];
  global.fetch = async (url) => {
    calls.push(String(url));
    return new Response(JSON.stringify({ ok: true, report: { slug: "ceo-strategist" } }));
  };
  const c = createOccClient("http://127.0.0.1:5177");
  await c.getSeatReport("ceo-strategist");
  expect(calls[0]).toContain("/api/seat-report/ceo-strategist");
});
```

- [ ] **Step 3: Implement client + `llm.tool` wrappers in `occ-tools.ts`** returning JSON string summaries suitable for speech (truncate long fields).

---

### Task 5: Local Whisper sidecar (STT, $0)

**Files:**
- Create: `tools/org-command-center/whisper-sidecar/app.py` (or `server.mjs` if pure Node)
- Create: `tools/org-command-center/scripts/whisper-up.sh`
- Create: `tools/org-command-center/whisper-sidecar/README.md`

**API:**

```
POST /v1/audio/transcriptions
Content-Type: multipart/form-data
file: <wav/webm>
→ { "text": "..." }
```

OpenAI-compatible shape so Agents OpenAI STT plugin can point `baseURL` at sidecar if supported; otherwise custom STT adapter in Task 6 calls this.

- [ ] **Step 1: Prefer MLX Whisper on M4**

```bash
# whisper-up.sh outline
cd whisper-sidecar
python3 -m venv .venv && source .venv/bin/activate
pip install mlx-whisper fastapi uvicorn python-multipart
uvicorn app:app --host 127.0.0.1 --port 8090
```

- [ ] **Step 2: Minimal FastAPI** that writes upload to temp file, runs `mlx_whisper.transcribe`, returns `{ text }`

- [ ] **Step 3: Smoke**

```bash
curl -F file=@sample.wav http://127.0.0.1:8090/v1/audio/transcriptions
```

- [ ] **Step 4: Document model download (one-time, free, local cache)**

---

### Task 6: OmniVoice TTS + Whisper STT adapters for Agents JS

**Files:**
- Create: `livekit-agent/src/adapters/omnivoice-tts.ts`
- Create: `livekit-agent/src/adapters/whisper-stt.ts`
- Create: `livekit-agent/src/adapters/*.test.ts` (mock fetch)

**Approach:** Implement thin adapters matching `@livekit/agents` STT/TTS plugin interfaces (stream or chunked). If implementing full plugin interfaces is too heavy for v1, use:

**v1 pragmatic path (allowed by this plan):**
1. LLM via `@livekit/agents-plugin-openai` with `baseURL: OLLAMA_BASE_URL` and `apiKey: "ollama"`
2. Custom TTS class that: synthesize full utterance via OmniVoice → push PCM/WAV frames into AgentSession (follow Agents JS custom TTS example from current docs at implement time — Context7 `@livekit/agents-js`)
3. Custom STT: buffer user audio frames → POST to Whisper sidecar → return final transcript on end-of-utterance (VAD via Silero plugin — local, free)

- [ ] **Step 1: Pull Context7 / docs for current custom STT/TTS extension points in `@livekit/agents` before coding**

- [ ] **Step 2: Unit-test OmniVoice adapter encodes text → calls `/v1/audio/speech`**

- [ ] **Step 3: Unit-test Whisper adapter posts multipart → parses `text`**

---

### Task 7: Agent worker `situation-room`

**Files:**
- Create: `livekit-agent/src/agent.ts`
- Create: `livekit-agent/src/main.ts`
- Modify: root `package.json` → `"agent:dev": "npm --prefix livekit-agent run dev"`

- [ ] **Step 1: Agent definition**

```ts
// Pseudocode — align with current @livekit/agents API at implement time
export default defineAgent({
  prewarm: async (proc) => {
    proc.userData.vad = await silero.VAD.load();
  },
  entry: async (ctx) => {
    const occ = createOccClient(process.env.OCC_API_BASE || "http://127.0.0.1:5177");
    const agent = new voice.Agent({
      instructions: [
        "You are the Situation Room voice operator for a virtual company.",
        "Speak briefly. Use tools for company state. Never invent handoffs or phases.",
        "Prefer get_seat_report('ceo-strategist') and get_company_digest for CEO briefings.",
      ].join(" "),
      tools: buildOccTools(occ),
    });
    const session = new voice.AgentSession({
      stt: createWhisperSTT(),
      llm: createOllamaLLM(),
      tts: createOmniVoiceTTS(),
      vad: ctx.proc.userData.vad,
    });
    await session.start({ agent, room: ctx.room });
    await ctx.connect();
    await session.generateReply({
      instructions: "Greet the operator and offer a CEO digest or mission status.",
    });
  },
});
```

Env for worker:

```
LIVEKIT_URL=ws://127.0.0.1:7880
LIVEKIT_API_KEY=devkey
LIVEKIT_API_SECRET=secret
```

- [ ] **Step 2: Manual integration test checklist** (document in README)

1. `livekit:up`, `whisper:up`, `voice:up` (OmniVoice), `ollama serve`, `npm run dev` (OCC), `npm run agent:dev`  
2. Talk button → hear greeting  
3. Say “What’s the company digest?” → tool call → spoken summary  

- [ ] **Step 3: Commit agent package**

---

### Task 8: Floating voice FAB + Talk UI (back-and-forth)

**Files:**
- Create: `src/jarvis/LiveKitTalk.tsx` — room session hook/controller
- Create: `src/jarvis/VoiceFab.tsx` — floating button UI
- Create: `src/jarvis/voice-fab.css` — fixed position, z-index above drawers
- Modify: `SituationRoom.tsx` — mount `<VoiceFab />` at shell root
- Modify: `src/api/client.ts` — `fetchLivekitToken`, `fetchLivekitHealth`
- Modify: `package.json` — `livekit-client`, `@livekit/components-react` (optional)

**UX lock (required):**

| Control | Behavior |
|---------|----------|
| **Floating mic FAB** | Fixed bottom-right (safe area), always visible in Situation Room |
| First tap (idle) | Mint token → connect room → enable mic → agent greets |
| While connected | FAB shows state: listening / thinking / speaking (color/pulse) |
| Tap while connected | Toggle mic mute (still in session — true back-and-forth) |
| Long-press or small ✕ | Hang up / disconnect session |
| Tooltip / aria | “Talk to company” / “Mute” / “End call” |
| Failure | FAB shows error pulse; click opens hint: start `livekit:up` / whisper / ollama |

Session stays open across drawer open/close so the operator can open **Report** / **Digest** while still talking.

- [ ] **Step 1: Install client deps**

```bash
cd tools/org-command-center && npm install livekit-client @livekit/components-react
```

- [ ] **Step 2: `useLiveKitTalkSession` in `LiveKitTalk.tsx`**

```ts
// Responsibilities:
// - connect() / disconnect() / setMuted(boolean)
// - state: "idle" | "connecting" | "listening" | "thinking" | "speaking" | "error"
// - subscribe to Room events + remote audio playback
const room = new Room();
await room.connect(serverUrl, participantToken);
await room.localParticipant.setMicrophoneEnabled(true);
// Attach remote audio elements for agent TTS
```

- [ ] **Step 3: `VoiceFab.tsx`**

```tsx
// position: fixed; right: 24px; bottom: 24px; z-index: 50;
// round button ~56px; mic icon; data-state={session.state}
// onClick: idle→connect | connected→toggleMute
// secondary tiny button for hangup when connected
```

Keep styling on existing Jarvis tokens (`--j-accent`, `.j-glass`) — not a purple generic FAB.

- [ ] **Step 4: Mount in `SituationRoom`**

```tsx
{/* outside drawers so it floats over everything */}
<VoiceFab />
```

Optional mission-strip **Talk** that calls the same `connect()` (not a second session).

- [ ] **Step 5: Manual check** — connect → speak → hear reply → open Digest drawer → still connected → mute → unmute → hang up

- [ ] **Step 6: `npm test && npm run build`**

---

### Task 9: `voice-stack:up` orchestration + README polish

**Files:**
- Create: `scripts/voice-stack-up.sh` (starts livekit, whisper, reminds ollama + omnivoice + agent)
- Modify: README quick start

```bash
# Terminal A
npm run livekit:up
# Terminal B
npm run whisper:up
# Terminal C
ollama serve   # model: ollama pull llama3.2
# Terminal D
npm run voice:up   # OmniVoice
# Terminal E
npm run agent:dev
# Terminal F
npm run dev
```

- [ ] **Step 1: Script prints ports and health curls**

- [ ] **Step 2: README troubleshooting** (mic permissions, Ollama model missing, OmniVoice down → silent agent, LiveKit not installed)

- [ ] **Step 3: Full verify**

```bash
cd tools/org-command-center && npm test && npm run build
cd livekit-agent && npm test
```

---

### Task 10: Soft-deprecate OmniVoice as primary chat path

**Files:**
- Modify: `SituationRoom.tsx` — Voice chat drawer labeled “Legacy voice (HTTP)”
- Modify: README — Talk = primary; legacy optional

- [ ] **Step 1: Default `OCC_VOICE_BACKEND=livekit`**

- [ ] **Step 2: Keep OmniVoice process — still required as TTS backend for agent**

- [ ] **Step 3: Final commit**

---

## Self-review

| Requirement | Task |
|-------------|------|
| No LiveKit Cloud / Inference | 1, 2, 7 |
| No paid STT/TTS SaaS | 5, 6 |
| Self-host server | 2 |
| Operator mic voice | 8 |
| Floating FAB back-and-forth | 8 |
| Company tools via OCC | 4, 7 |
| Ollama-only voice LLM (no Cursor) | 6, 7 |
| OmniVoice TTS reuse | 6 |
| Legacy fallback | 1, 10 |
| TDD tokens + OCC client | 3, 4 |

## Risks / honesty

1. **Mic deaf if participant not linked** — `VoicePipelineAgent.start(room)` alone only listens for *future* `ParticipantConnected`. The browser operator usually joins first, so entry must `await ctx.waitForParticipant()` and `start(room, participant)`. Symptom: TTS works, Whisper never gets `/v1/audio/transcriptions`. Fixed in `link-participant.ts` + `agent.ts`.
2. **Latency** on first Whisper/Ollama load on M4 — warm models in `prewarm`.  
3. **Agents JS custom STT/TTS** APIs move quickly — Task 6 must re-check Context7 before coding.  
4. **`$0` ≠ “no electricity / no GPU time”** — local models use Mac resources.  
5. If Ollama is not installed or the model is missing, agent must fail with a clear spoken/log error — **never** fall back to OpenAI, Anthropic, Cursor, or LiveKit Inference.

## Sources

- [LiveKit Agents introduction](https://docs.livekit.io/agents/)
- [Self-host LiveKit locally](https://docs.livekit.io/transport/self-hosting/local/)
- [Custom agent deployments](https://docs.livekit.io/deploy/custom/deployments/)
- [Access token (custom auth)](https://docs.livekit.io/frontends/build/authentication/custom.md)
