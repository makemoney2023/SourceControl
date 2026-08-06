---
phase: "20"
position: analytics-engineer
reports_to: head-of-data
status: done
verdict_for_manager: ready_to_merge
llm_tier: coding-agent
llm_model: composer-2.5
generation_profile: none
generation_used: none
fallback_applied: false
---

# Handoff — Analytics Engineer → Head of Data

## Goal (from context packet)

Draft detailed sections for `20-analytics.md`: event taxonomy, dashboard spec, implementation wiring map for `apps/blacksage-kennels`. Handoff to head-of-data for merge and Phase 21 readiness gate.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/blacksage-kennels/business-idea/20-analytics.md` | Full IC draft: NS-1 north-star, 6 supporting KPIs, 4 guardrails, 12+ event definitions with properties, weekly operator dashboard (5 rows), file-level wiring map for CTO, Phase 21 M-01–M-19 launch criteria |
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/20-analytics-engineer.md` | This handoff |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | coding-agent |
| llm_model | composer-2.5 |
| generation_profile | none |
| generation_used | none |
| fallback_applied | no |

## Decisions

- **North-star:** NS-1 Trust-path inquiry submit rate (≥2 evidence pages before `/inquire`) — aligns 18-conversion conceptual north star with measurable session evidence via `sessionStorage`.
- **Provider posture:** Recommend thin `lib/analytics/track.ts` adapter; primary options Vercel Analytics / Plausible / GA4 — CTO picks one; no paid pixels (Phase 19 skipped).
- **Mailto stub:** Still fire `inquire_submit` client-side on Zod pass + mailto handoff; add `submit_method: mailto` until Q7 API — do not block measurement on Q7.
- **PII:** Never send name/email/message; only enum aggregates on submit (`how_heard`, `goals`, `experience`, `timeline`).
- **Targets:** All numeric targets labeled ASSUMPTION or deferred to 90-day baseline — no invented traffic/revenue goals.
- **PROOF_BAND cell_id:** Mapped to `standards` | `health` | `dogs` | `placement` from `lib/constants.ts` indices — optional `id` field addition suggested for CTO.
- **CRO backlog:** Event → hypothesis map included from 18-conversion H1–H10; execution still blocked until M-01–M-07 pass.

## Asks for manager (`ask_manager`)

- Peer help needed: **none**
- Clarification needed: **Provider selection** (Vercel vs Plausible vs GA4) and cookie/consent posture for operator — head-of-data + CTO decision before implementation ticket

## Risks / blockers

- **Q7 open:** Server-side submit confirmation unavailable; client `inquire_submit` may overcount if mailto blocked — mitigated by `inquire_submit_fail` + `submit_method` property.
- **Low traffic:** CRO tests need 8–12 week windows; dashboard should emphasize WoW trends not daily noise.
- **Manual quality KPI:** KPI-5 qualified inquiry rate stays operator-tagged until CRM — dashboard Row 5 includes manual weekly log template.
- **Google Analytics integration skill unavailable** in this session — GA4 mapping included from 18-conversion + standard event model; no live GA property audit.

## Packs used

- `skills/community/marketingskills/analytics/` — measurement framing, KPI hierarchy
- `skills/community/awesome-claude-corporate-skills/10-data-analytics/interactive-dashboard-builder/` — weekly dashboard tile structure
- `skills/community/marketingskills/revops/` — funnel stage alignment (referenced via 06-gtm / 18-conversion inputs)

## Do not

- Mark the phase complete
- Write outside write_lease
- Spawn other positions
- Inherit parent model when MODEL-REGISTRY pins a different tier (esp. creative/legal)
