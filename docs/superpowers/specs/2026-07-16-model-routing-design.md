# Model Routing Design

**Date:** 2026-07-16  
**Plan:** `docs/superpowers/plans/2026-07-16-model-routing.md`  
**SSOT:** `skills/org/MODEL-REGISTRY.md`

## Problem

Delegated digital workers inherited the parent Cursor model. Creative seats had no binding to Veo/FLUX/ElevenLabs. Cost and quality drifted.

## Solution — two planes

1. **Plane A (Cursor LLM)** — Position → `llm_tier` → concrete `model:` on `.cursor/agents/<slug>.md` and Task `model=`. Packets require `llm_tier` or spawn is refused.
2. **Plane B (Generation APIs)** — `generation_profile` (`none` | `brand-stills` | `hero-video` | `ad-creative`) drives OpenMontage / fal / inference.sh. Default hero video: **Veo 3.1**.

Designers always run a strong LLM; they never “are” Veo.

## Enforcement

| Gate | Rule |
|------|------|
| Orchestrator / manager spawn | Packet must include `llm_tier` (+ `generation_profile` for phases 11/12/15/19) |
| Agent install | `./scripts/sync-org-agents.sh` → `.cursor/agents/` |
| Handoff | Audit `llm_model`, `generation_used`, `fallback_applied` |
| C-suite | May revise for wrong tier on creative/legal/hard gates; reviewer uses `frontier-reasoning` |

## Plane A defaults (2026-07-17)

- **Thinking / reasoning** (`frontier-reasoning`): `grok-4-5`
- **Everything else**: `composer-2.5`

## Fallback

preferred → `composer-2.5` → `inherit` when plan/admin blocks. Record `fallback_applied: true`.

## Env

Placeholders only in repo-root `.env.local` (`WORKER_*_MODEL`, `FAL_KEY`, `ELEVENLABS_API_KEY`, …).
