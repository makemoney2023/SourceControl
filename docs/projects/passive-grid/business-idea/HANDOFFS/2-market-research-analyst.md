---
phase: "2"
position: market-research-analyst
reports_to: head-of-research
status: done
verdict_for_manager: ready_to_merge
llm_tier: strong-general
llm_model: composer-2.5
generation_profile: none
generation_used: none
fallback_applied: false
---

# Handoff — Phase 2 Market Research → head-of-research

## Goal (from context packet)

Produce customer segments, buyer avatars, PESTLE, and market sizing for passive-grid sorbent AWG (Ontario beachhead, off-grid/preparedness ICP).

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/passive-grid/business-idea/02-market-research.md` | Full Phase 2 market synthesis: TAM/SAM/SOM, segments, 3 avatars, PESTLE, Porter's, trends, A5 partial validation, 10 open questions |
| `docs/projects/passive-grid/business-idea/SOURCES/INDEX.md` | JSON array of 25 sources (22 external + 3 internal) |
| `docs/projects/passive-grid/business-idea/HANDOFFS/2-market-research-analyst.md` | This handoff |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | strong-general |
| llm_model | composer-2.5 |
| generation_profile | none |
| generation_used | none |
| fallback_applied | no |

## Decisions

- **Beachhead:** Ontario cottage country + rural off-grid homeowners; remote communities and prep pragmatists as secondary.
- **TAM framing:** Report both (a) all residential/off-grid AWG and (b) sorbent-specific sub-TAM (~USD 15M–55M global) — latter is the relevant ceiling for passive-grid differentiation.
- **SAM point estimate:** USD 50M–100M Canada; USD 40M–80M Ontario (Low confidence — triangulated top-down + bottom-up).
- **SOM (Y1–3 bootstrapped):** USD 0.1M–0.8M (50–400 units at USD 1,800–2,200 ASP).
- **A5 verdict:** Partially supported — resilience buyers show WTP (solar, cottage equity); mass-market buyers reject cost-per-litre vs. tap unless outage/drought frame applies.
- **A4 confirmed:** MOF remains R&D/long-term; zeolite MVP appropriate.

## Asks for manager (`ask_manager`)

- Peer help needed: `competitive-intelligence-analyst` for deep dive on SOURCE, Watergen, EcoloBlue, and any Canadian wet-desiccation entrants (flagged in open questions).
- Clarification needed: none — Phase 1 product-line question (grid-down passive) already resolved in intake.

## Risks / blockers

- Industry reports do not isolate sorbent/residential Canada cleanly — SAM confidence is **Low**.
- No primary customer interviews yet; avatars are hypothesis-driven from secondary data.
- Regulatory path (Health Canada / NSF) not scoped — could affect ASP and timeline.
- Wet-desiccation is <1.5% of AWG market today — category creation/education burden is high.

## Packs used

- `skills/community/marketingskills/customer-research/` (segment + avatar structure)
- `skills/community/advertising-skills/skills/foundations/avatar-extraction/` (JTBD, pain, WTP)
- `skills/community/business-analysis-skills/skills/pestle-analysis/` (PESTLE table)
- `skills/community/business-analysis-skills/skills/porters-five-forces/` (five forces summary)

## Do not

- Mark the phase complete
- Write outside write_lease
- Spawn other positions
- Inherit parent model when MODEL-REGISTRY pins a different tier (esp. creative/legal)
