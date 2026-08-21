---
phase: "2"
position: market-research-analyst
reports_to: head-of-research
status: done
verdict_for_manager: ready_to_merge
llm_tier: strong-general
llm_model: grok-4.5
generation_profile: none
generation_used: none
fallback_applied: false
production_status: skipped
production_paths: []
design_brief_path: ""
photoreal_qa: ""
license_basis: ""
wire_owner: none
wire_checklist_path: ""
wire_notes: ""
skip_reason: "Phase 2 IC market slice; not a shippable production phase"
tool_status:
  parallel-research: available
  parallel-cli: oauth_ok
  firecrawl: unavailable
date: 2026-08-21
---

# Handoff — Market Research Analyst → Head of Research

## Operator brief (plain English)

The instruction job is real and already paid as text/human coaching; the camera form is still an unproven bet sitting on a stack Sci Rep says cannot read dog faces. I did not invent TAM. UK 80/24 stays UK. The load-bearing refuse question is labeled open, not answered. HoR can merge the market slice; CIA still owns competitor profiles.

## What we found

- AVMA 2025 public table: 42.6% of U.S. households own dogs (56.3M households, 87.3M dogs). That is a universe, not SAM. Training dollars inside APPA’s $14.3B “Other Services” bucket: not disclosed.
- Dogs Trust NDS 2024 remains the best competence survey (80% confident / 24% correct on worried dogs; <7% in class; 78% “never bite me”). UK sample — not a US fact.
- Martvel et al., *Sci Rep* 21 Nov 2025: LVLMs near chance on elicited Labrador faces; backgrounds drive labels; authors: not suitable for biologically grounded canine emotion recognition; risk of false confidence. Flash refuse-safely = **open**.
- Trainer-job substitutes (not TAM): Pupford Ask Doris; Zigzag 24/7 coach/AI (58% of chats = 10 puppy problems, company); ChatGPT-on-a-budget (Logan); Kikopup (~440k subs). GoodPup $34/wk is a 2023 Rover test; **goodpup.com now redirects to Rover’s trainer marketplace**.
- AVSAB 2021 is the claims bar: reward-based only; aversives out; aggression refers out.

## Next steps

1. **Head of Research** — merge this slice into `02-market-research.md` / evidence base as needed. Do not wait on me for competitor tables (CIA) or keywords (SEO).
2. **CTO / product (via HoR)** — Flash refuse eval is still the load-bearing gap. Quota-cannot-skip-refuse is a policy, not a test.
3. **CEO** — `01-problem-framing.md` is still missing; this doc used founder locks. No new founder ask beyond what is already Locked.

## Goal (from context packet)

Phase 2 IC: customer + market synthesis for Telltail. Segments, JTBD, evaluation criteria, category/standards, trust, journey, cited PESTLE, implications, F/I/A, sources. No competitor deep-dive. No phase-complete. No manager brief.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/telltail/business-idea/02-market-research.md` | Full leased file. No competitor profile table. |
| `docs/projects/telltail/business-idea/HANDOFFS/2-market-research-analyst.md` | This handoff |

Did **not** write: `02-evidence-base.md`, `02-competitive-landscape.md`, `02-keyword-demand.md`, manager brief, phase-complete marks.

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | strong-general (packet) |
| llm_model | grok-4.5 |
| generation_profile | none |
| generation_used | none |
| fallback_applied | false |

## Production (shippable phases — required)

| Field | Value |
|-------|-------|
| production_status | skipped |
| production_paths | none |
| wire_owner | none |
| wire_notes | n/a |
| skip_reason | Phase 2 IC market slice; not a shippable production phase |

## SDK correlation (optional)

| Field | Value |
|-------|-------|
| sdk_runtime | n/a |
| sdk_agent_id | n/a |
| sdk_run_id | n/a |
| sdk_request_id | n/a |

## Decisions

- P0/P1/P2 kept as founder locks; avatars marked provisional (0 interviews).
- No TAM/SAM/SOM. AVMA counts cited as household universe only.
- PESTLE included because Legal/Tech/Social cells have citations. Porter skipped (no share data).
- Sci Rep question labeled **open**; not answered.
- GoodPup treated as historical price analog + 2026 URL redirect, not a live vision peer.
- `parallel-cli` was available (OAuth) this pass — unlike Phase 0. Firecrawl MCP still unavailable.

## Asks for manager (`ask_manager`)

- Peer help needed: none (CIA already leased for comps; SEO for keywords)
- Clarification needed: none (founder locks used; `01-problem-framing.md` is a CEO gap, not a re-ask)

## Risks / blockers

- Load-bearing: Flash refuse untested. Shipping “we read your dog” on this stack is a Kinship-shaped own-goal.
- Filming-during-incident unknown. If false, camera wedge vs Doris/ChatGPT collapses.
- US competence rates unknown. Copy that uses 80/24 as American is a lie.
- Customer-research sample bar (5–10 first-party points per segment) **not met**. Proxies only.

## Packs used

| Pack | Decision tied to pack |
|------|------------------------|
| `skills/community/marketingskills/customer-research/` | Mode 2 proxies only; avatars tagged provisional; no persona from <5 US data points |
| `skills/community/awesome-claude-corporate-skills/04-marketing/market-research/` | TAM/SAM/SOM **refused**; replaced with cited household counts + “not disclosed” |
| `skills/community/advertising-skills/skills/foundations/avatar-extraction/` | One P0 avatar (first-week panic) + P1 sketch from substitute copy + UK survey, not invented demographics |
| `skills/community/business-analysis-skills/skills/pestle-analysis/` | Cited-only PESTLE; skip empty Environmental; Porter not used |
| `skills/integrations/parallel-research/` | Used `parallel-cli` search + extract (OAuth ok). Firecrawl MCP unavailable → WebFetch fallback for Nature HTML + AVMA table |
| `skills/org/HANDOFF-TEMPLATE.md` | This file |

## Do not

- Mark the phase complete
- Write outside write_lease
- Spawn other positions
- Invent TAM, CAGR, downloads, or search volumes
- Export Dogs Trust 80/24 to US/CA as fact
- Answer “can Flash refuse safely?” as yes

<!-- graph:start -->
[[Telltail · Main]] · [[Market Research Analyst — Telltail · Main]] · [[Phase 2 — Telltail · Main]]
<!-- graph:end -->
