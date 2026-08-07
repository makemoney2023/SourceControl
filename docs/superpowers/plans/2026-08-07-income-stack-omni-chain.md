# Income Stack Omni Chain Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate 30 text-free Gemini Omni Flash hero clips (15 slides × 16:9 + 9:16) for the Income Stack 3D scroll website asset pack.

**Architecture:** A small prompt/path helper module + batch runner wraps OpenMontage `gemini_omni_video`. Clean plates are `<FIRST_FRAME>`; optional prior last-frame is palette bridge only. Assets write under `public/concepts/omni-chain/` without touching existing Veo loops.

**Tech Stack:** Node (vitest), Python/`GeminiOmniVideo`, ffmpeg/ffprobe, Gemini Interactions API (`gemini-omni-flash-preview`)

## Global Constraints

- No on-screen text/numbers/logos/UI in any generated frame
- Soft ambient audio only; no dialogue or VO
- Duration hint: 8 seconds; aspect: `16:9` then `9:16`
- Output under `apps/superpatch-income-stack/public/concepts/omni-chain/`
- Do not overwrite `public/concepts/animated/*_animated.mp4` Veo assets
- Source plates: `public/concepts/clean/sp-stack-*.png`
- API key from repo-root `.env.local` (`GEMINI_API_KEY` / `GOOGLE_API_KEY`)

---

## File map

| File | Responsibility |
|---|---|
| `scripts/omni-chain-lib.mjs` | Plate list, prompt builder, output paths |
| `scripts/omni-chain-lib.test.mjs` | Unit tests for lib |
| `scripts/omni-animate-plates.mjs` | Batch runner calling GeminiOmniVideo |
| `public/concepts/omni-chain/prompts.json` | Frozen prompt pack |
| `public/concepts/omni-chain/manifest.json` | Generation results |

---

### Task 1: Prompt/path helper + tests

- [x] Write failing vitest for plate→output path mapping and text-ban prompt suffix
- [x] Implement `src/data/omniChain.ts`
- [x] Run tests until green
- [x] Write `prompts.json` from the approved shot list

### Task 2: Batch runner

- [x] Implement `omni-animate-plates.mjs` (load `.env.local`, call GeminiOmniVideo via OpenMontage python path, write bridges + manifest)
- [x] Support `--aspect 16:9|9:16|both`, selective slide nums, skip-existing

### Task 3: Generate + QA

- [x] Run 16:9 chain (15 clips)
- [x] Extract last frames to `bridges/`
- [x] Run 9:16 chain (15 clips)
- [x] ffprobe + visual text QA; Omni edit pass on failures
- [x] Update venture MEMORY note with asset paths
