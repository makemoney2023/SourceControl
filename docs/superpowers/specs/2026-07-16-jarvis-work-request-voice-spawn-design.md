# Design: Jarvis Work Request → Voice-Driven Cursor Spawn

**Date:** 2026-07-16  
**Status:** Approved (operator decisions locked in planning)  
**Extends:** `2026-07-16-jarvis-intent-catalog-v2-design.md`  
**App:** `tools/org-command-center/`  
**Plan:** `.cursor/plans/voice_drives_cursor_spawn_ce9a3c72.plan.md`

## Purpose

Make the LiveKit voice agent **drive** OCC dispatch + Cursor SDK spawn so utterances like “write a short blog” result in:

1. Domain C-suite intake on the mic  
2. One confirm  
3. Manager packet queued + Cursor agent started (non-blocking)  
4. Deliverable written to `REVIEW/inbox/` for operator review  

## Locked decisions

| Decision | Choice |
|----------|--------|
| Intake seat | Domain C-suite; named IC resolves via `reportsTo` to manager; CEO for escalation only |
| Requirements | Jarvis role-plays C-suite checklist on mic (no mid-call C-suite Cursor agent) |
| Confirm blast | One confirm → `dispatch.queue_for` + start Cursor manager run |
| Review surface | Dedicated `REVIEW/inbox/` + Needs-review HUD (not dual-write to HANDOFFS as primary) |
| Manager-only law | Unchanged — never `agent.spawn_ic` from Jarvis |

## Hard laws

- Manager-only fan-out; ICs only via manager Cursor worker  
- Confirm hard writes; audit trail  
- Active venture isolation  
- Cursor = workers; voice = control plane  
- Spawn must not block the confirm HTTP response (detached run)

## Intents

| Intent | Mode | Confirm | Behavior |
|--------|------|---------|----------|
| `work.resolve` | any | no | Resolve `{ intakeSeat, targetIc?, goal }` + spoken routing line |
| `work.intake_save` | ops | no | Store checklist answers on room session |
| `work.request` | ops | hard | Confirm seat + goal + “start Cursor now”; on accept queue + detach-spawn |

### Resolve rules

1. Explicit manager slug → `intakeSeat = slug`  
2. Explicit IC slug → `intakeSeat = reportsTo` (must be manager), `targetIc = slug`  
3. Goal heuristics: blog/copy/article → `copy-chief` → CMO  
4. Ambiguous / cross-domain → `ceo-strategist` intake  

### Confirm execute

1. Merge session intake + args into goal string  
2. `queueValidatedDispatch` with `allowAnyManager: true`  
3. `spawnClaimedManagerDetached` on that filename  
4. Clear intake; return `{ runId, position, filename, reviewInboxHint }`  

## Non-blocking spawn

`spawnClaimedManagerDetached`: same prechecks/claim as `spawnClaimedManager`, persist `status: running`, start `adapter.run` without awaiting completion, return `{ ok, runId, position, filename }` immediately. Background completion updates run JSON + activity.

Spawn prompt requires deliverable under:

`docs/projects/<active>/business-idea/REVIEW/inbox/{phase}-{position}-{ts}-{slug}.md`

## REVIEW inbox

- Writable/readable under active venture `REVIEW/inbox/`  
- Frontmatter: `status: pending_review`, `position`, `phase`, `runId?`, `goal`, `created`  
- `GET /api/jarvis/review-inbox` + Situation Room “Needs review” HUD  

## Voice duties

1. Work ask → `set_mode(ops)` then `work.resolve`  
2. Intake questions one at a time; `work.intake_save`  
3. `jarvis_act(work.request)` → speak summary → `jarvis_confirm`  
4. Speak runId / inbox  
5. Never invent spawn; never direct IC spawn  

Log every tool execute: `[jarvis] tool …`.

## Prerequisite

`CURSOR_API_KEY` must be set in repo `.env.local` for real Cursor launches.

## Tests

- Resolve IC→manager, blog heuristic, intake merge  
- Policy/act confirm tiers  
- Confirm → queue + detached spawn (test adapter)  
- Paths allowlist + inbox list  
- Goldens for blog utterance  
- Voice playbook string coverage  

## Out of scope

- Live multi-agent voice braid  
- Auto phase ✅  
- Cloud voice LLM  
