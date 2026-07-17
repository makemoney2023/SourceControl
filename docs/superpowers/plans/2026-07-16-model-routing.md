# Model Routing & Org Gaps Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every org position and skill pack an explicit model profile (LLM + generation stack) so delegated workers always run on the right brain for the task.

**Architecture:** Split routing into two planes — (1) **Cursor LLM** via agent frontmatter `model:` + Task `model` + context-packet fields, (2) **Generation providers** (image/video/audio) via OpenMontage / fal / inference-sh profiles. Single SSOT: `skills/org/MODEL-REGISTRY.md`. Positions and packs bind to **tiers**, not raw IDs, so swaps stay cheap.

**Tech Stack:** Cursor subagents (`.cursor/agents/` YAML `model`), org position skills, OpenMontage `.env` + provider defaults, optional `inference-sh` for stills.

## Global Constraints

- Never invent Cursor model IDs — use [Cursor models docs](https://cursor.com/docs/models-and-pricing.md) / subagent model configuration.
- Image/video models (Veo, Kling, FLUX, etc.) are **not** Cursor `model:` values; they live under `generation_profile`.
- Prefer **tiers** (`frontier-reasoning`, `strong-general`, …) in position skills; resolve to concrete IDs only in MODEL-REGISTRY.
- Every spawn must carry `llm_tier` (and `generation_profile` when creative). Handoffs must record `model_used` / `generation_used`.
- Fallback ladder required when Max Mode / plan blocks the preferred model.
- Do not break manager-only fan-out or C-suite gates.

---

## Gap review (current state)

### Already in place
- 36 positions + orchestrator, RACI, handoffs, C-suite gate
- Skill packs bound per position (advertising / visual / OpenMontage)
- Phase → manager → IC map

### Still missing (org / ops)

| Gap | Why it matters |
|-----|----------------|
| **No model registry** | Every worker inherits the parent model today |
| **Agents only in `templates/`** | Cursor honors `model:` on `.cursor/agents/*.md`, not templates |
| **Packet has no `llm_tier` / `generation_profile`** | Managers can't enforce routing on spawn |
| **Handoffs don't record model used** | Can't audit cost or wrong-brain failures |
| **Packs don't declare model needs** | OpenMontage needs Veo; copy-chief needs strong LLM — nowhere stated |
| **No cost / budget tier policy** | Frontier on every IC will burn API pool |
| **Creative QA seat soft** | Brand/video finals lack a dedicated review role (CD merges only) |
| **Social / community manager** | GTM/lifecycle covers email; organic social is thin |
| **Performance creative IC** | Phase 19 creatives sit awkwardly between paid-media + video |
| **SEO ↔ Research dotted line** | Documented in phases but not as dual-report in registry |
| **Generation spend ledger** | fal/Veo keys exist; no runbook for tracking $ per phase |
| **Fallback when Max Mode off** | Opus pins silently degrade — no documented ladder |

### Two-plane model (critical design)

```
┌─────────────────────────────────────────────────────────────┐
│ Plane A — Cursor LLM (reasoning / writing / coding)         │
│   agent frontmatter model: grok-4-5                         │
│   Task tool model=… when spawning                           │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ Plane B — Generation APIs (image / video / audio)           │
│   OpenMontage + FAL_KEY / GOOGLE_API_KEY / etc.             │
│   e.g. veo-3.1, flux, imagen, elevenlabs                    │
│   Agent LLM still crafts prompts; Plane B renders           │
└─────────────────────────────────────────────────────────────┘
```

**Designers do not "run as Veo" inside Cursor.** They run a strong/creative LLM that is *required* to call OpenMontage (or inference-sh) with the registry's `generation_profile`.

---

## File map

| File | Responsibility |
|------|----------------|
| `skills/org/MODEL-REGISTRY.md` | SSOT: tiers → Cursor IDs, generation profiles, position map, pack map, fallbacks |
| `skills/org/positions/<slug>/SKILL.md` | Add `## Model profile` (tier + gen profile + fallback) |
| `templates/org/agents/<slug>.md` | Add frontmatter `model: <resolved-id>` |
| `.cursor/agents/<slug>.md` | Installed copies Cursor actually loads (symlink or sync script) |
| `skills/org/orchestrator/SKILL.md` | Require packet fields; spawn with correct model |
| `skills/org/HANDOFF-TEMPLATE.md` (+ manager/csuite) | `model_used`, `generation_used`, `fallback_applied` |
| Pack READMEs / position pack tables | Optional `requires_tier` / `requires_generation` |
| `docs/projects/<active>/business-idea/RUNBOOK-TRACKER.md` template | Model/cost row optional |
| `scripts/sync-org-agents.sh` (or Makefile target) | Copy templates → `.cursor/agents/` with model pins |
| Canvas / ORG-REGISTRY | Link to MODEL-REGISTRY; optional model column |

---

## Proposed tier catalog (Plane A)

Resolve IDs in MODEL-REGISTRY; adjust when Cursor renames. Defaults as of 2026-07:

| Tier | Cursor `model` (preferred) | Who |
|------|----------------------------|-----|
| `frontier-reasoning` | `grok-4-5` | ceo-strategist, C-suite reviews, Phase 10, legal-counsel on hard gates, orchestrator decisions |
| `strong-general` | `composer-2.5` | Most managers + research/product/marketing ICs |
| `creative-language` | `composer-2.5` | copy-chief, creative-director (briefs), pr-manager (high-stakes) |
| `coding-agent` | `composer-2.5` | cto, tech-lead, hardware-engineer (CAD text), analytics-engineer |
| `fast-ops` | `composer-2.5` | ops-manager drafts, recruiter first passes, SEO technical checklists |
| `inherit-parent` | `inherit` | Only when explicitly cheaper and low-risk (rare) |

**Fallback ladder (all tiers):** preferred → `composer-2.5` → inherit. Record `fallback_applied: true` in handoff.

## Proposed generation profiles (Plane B)

| Profile | Image | Video | Audio | Used by |
|---------|-------|-------|-------|---------|
| `brand-stills` | FLUX / Imagen (OpenMontage or inference-sh) | — | — | brand-designer, web-designer |
| `hero-video` | FLUX keyframes | **Veo 3.1** (fal) primary | ElevenLabs | video-producer Phase 15 |
| `ad-creative` | FLUX / GPT Image | Veo or Kling short | optional | Phase 19 (video-producer + paid-media) |
| `none` | — | — | — | most text roles |

Exact provider strings live in MODEL-REGISTRY and must match OpenMontage config / `.env.example`.

## Position → tier map (draft)

| Slug | llm_tier | generation_profile |
|------|----------|-------------------|
| company-orchestrator | frontier-reasoning | none |
| ceo-strategist | frontier-reasoning | none |
| head-of-research | strong-general | none |
| market-research-analyst | strong-general | none |
| competitive-intelligence-analyst | strong-general | none |
| cfo | frontier-reasoning | none |
| fpa-analyst | strong-general | none |
| fundraising-lead | strong-general | none |
| head-of-product | strong-general | none |
| product-manager | strong-general | none |
| business-analyst | strong-general | none |
| cmo | frontier-reasoning | none |
| product-marketing-manager | strong-general | none |
| copy-chief | creative-language | none |
| content-strategist | strong-general | none |
| seo-manager | fast-ops | none |
| paid-media-manager | strong-general | none |
| lifecycle-marketer | strong-general | none |
| pr-manager | creative-language | none |
| creative-director | creative-language | none |
| brand-designer | strong-general | brand-stills |
| web-designer | strong-general | brand-stills |
| video-producer | strong-general | hero-video |
| head-of-sales-cs | strong-general | none |
| sales-enablement-lead | strong-general | none |
| outbound-lead | strong-general | none |
| customer-success-manager | strong-general | none |
| coo | frontier-reasoning | none |
| ops-manager | fast-ops | none |
| legal-counsel | frontier-reasoning | none |
| head-of-people | strong-general | none |
| recruiter | fast-ops | none |
| cto | coding-agent | none |
| tech-lead | coding-agent | none |
| hardware-engineer | coding-agent | none |
| head-of-data | strong-general | none |
| analytics-engineer | coding-agent | none |

## Pack → model needs (draft)

| Pack / skill area | llm_tier hint | generation_profile |
|-------------------|---------------|--------------------|
| advertising-skills (copy-chief / foundations) | creative-language | none |
| visual-skills/image | strong-general | brand-stills |
| visual-skills/video | strong-general | hero-video / ad-creative |
| openmontage | strong-general | hero-video (Veo primary) |
| corporate finance / DCF | strong-general | none |
| product-marketing | strong-general | none |

---

## Enforcement flow (when delegated)

```
Orchestrator
  → reads MODEL-REGISTRY for manager llm_tier
  → builds packet with llm_tier + generation_profile: none
  → spawns manager agent (Cursor model: from registry)

Manager
  → for each IC: resolve tier/profile from position skill OR registry
  → spawn IC with Task model=<resolved> (or agent file with model pin)
  → packet includes llm_tier, generation_profile, write_lease

IC
  → MUST use Plane A model as configured
  → if generation_profile != none: MUST render via OpenMontage/inference-sh
    using registry provider defaults (e.g. Veo 3.1)
  → handoff records model_used + generation_used + fallback_applied

C-suite review
  → always frontier-reasoning (or explicit Max Mode)
  → may reject if wrong tier/profile used for load-bearing creative/legal work
```

---

### Task 1: Create MODEL-REGISTRY.md (SSOT)

**Files:**
- Create: `skills/org/MODEL-REGISTRY.md`
- Modify: `skills/org/ORG-REGISTRY.md` (link at top)

- [x] Write tier catalog with preferred Cursor model IDs + fallback ladder
- [x] Write generation profiles with OpenMontage/fal provider strings (Veo 3.1 primary for hero-video)
- [x] Write full position → tier/profile table (36 + orchestrator)
- [x] Write pack → requirements table
- [x] Document Max Mode / plan limitations and audit fields
- [x] Link from ORG-REGISTRY.md

**Verify:** Grep shows every roster slug appears exactly once in the position map.

---

### Task 2: Extend handoff + orchestrator packets

**Files:**
- Modify: `skills/org/HANDOFF-TEMPLATE.md`, `MANAGER-BRIEF-TEMPLATE.md`, `CSUITE-REVIEW-TEMPLATE.md`
- Modify: `skills/org/orchestrator/SKILL.md`
- Modify: `templates/business-idea/HANDOFFS/` copies if mirrored

- [x] Add YAML fields: `llm_tier`, `llm_model`, `generation_profile`, `generation_used`, `fallback_applied`
- [x] Orchestrator packet schema requires `llm_tier` (and `generation_profile` when phase ∈ {11,12,15,19})
- [x] Hard rule: refuse spawn if packet missing `llm_tier`
- [x] C-suite review checklist item: "Correct model tier used?"

**Verify:** Phase 13 smoke example updated with model fields (Task 6).

---

### Task 3: Regen position skills + agent templates with model pins

**Files:**
- Modify: all `skills/org/positions/*/SKILL.md`
- Modify: all `templates/org/agents/*.md`
- Modify: `skills/org/orchestrator/SKILL.md` frontmatter if applicable

- [x] Add `## Model profile` section to each position (tier, profile, fallback, "must not inherit for creative/legal")
- [x] Set agent frontmatter `model: <preferred-id>` from registry (not only tier name)
- [x] Keep description trigger text intact
- [x] Script or one-shot regen preferred to avoid drift

**Verify:** Every agent file has a `model:` line; no blank models.

---

### Task 4: Install path — sync to `.cursor/agents/`

**Files:**
- Create: `scripts/sync-org-agents.sh` (or `skills/org/scripts/sync-agents.sh`)
- Create/update: `.cursor/agents/*.md` (generated; commit if team wants shared pins)
- Modify: `skills/org/ORG-REGISTRY.md` install instructions

- [x] Script copies `templates/org/agents/*.md` → `.cursor/agents/`
- [x] Document: Cursor only applies `model:` from `.cursor/agents/` (or `~/.cursor/agents/`)
- [x] Note IDE frontmatter-stripping bug; edit via script/external editor if needed
- [x] Add README note: Max Mode required for Opus pins

**Verify:** Run sync; `head` of `.cursor/agents/ceo-strategist.md` shows `model: grok-4-5`

---

### Task 5: Wire generation profiles into creative positions + OpenMontage

**Files:**
- Modify: brand-designer, web-designer, video-producer position skills
- Modify: runbook Phase 11/15/19 notes (or principle in runbook)
- Optionally: small `skills/org/GENERATION-DEFAULTS.md` if registry grows too large

- [x] video-producer: default video provider Veo 3.1 via fal; document env keys
- [x] brand-designer: brand-stills profile; visual-skills for prompts → OpenMontage/inference-sh render
- [x] Phase 15 scorecard: "generation_profile hero-video used (or skip reason)"
- [x] Phase 19: ad-creative profile for video ads

**Verify:** Smoke path in docs names Veo 3.1 + required env vars.

---

### Task 6: Docs, smoke, tracker, canvas

**Files:**
- Create: `docs/superpowers/specs/2026-07-16-model-routing-design.md` (short design)
- Modify: `skills/org/examples/phase-13-smoke.md`
- Modify: tracker template Positions table
- Modify: canvas optional "Models" view or tooltip data

- [x] Spec explains two-plane design + enforcement
- [x] Smoke includes model fields on packets/handoffs
- [x] Tracker column or note: preferred tier per phase owner
- [ ] Commit when user requests

**Verify:** Reader can answer "what model does copy-chief use?" from MODEL-REGISTRY alone in <30s.

---

### Task 7 (optional follow-on): Org seat gaps

Not required for model routing; track separately if user wants:

- [ ] Add `performance-creative` IC under creative-director or CMO for Phase 19
- [ ] Add `social-media-manager` under CMO
- [ ] Formalize SEO dotted-line to head-of-research in registry
- [ ] Add `creative-qa` reviewer for Phases 11/15/19 (or expand CD scorecard)
- [ ] Generation spend log template under `docs/projects/<active>/business-idea/`

---

## Acceptance criteria

1. `MODEL-REGISTRY.md` is SSOT for all 36+orchestrator roles.
2. Spawning without `llm_tier` is a hard orchestrator/manager violation.
3. Installed agents in `.cursor/agents/` pin concrete Cursor model IDs.
4. Creative ICs have non-`none` generation profiles; video defaults to Veo 3.1.
5. Handoffs audit `model_used` / `generation_used` / `fallback_applied`.
6. C-suite can reject on wrong-tier usage for hard-gate phases.

## Out of scope

- Building a custom multi-provider LLM gateway outside Cursor
- Guaranteeing Cursor never falls back (plan/admin limits are platform constraints)
- Training or fine-tuning custom models
