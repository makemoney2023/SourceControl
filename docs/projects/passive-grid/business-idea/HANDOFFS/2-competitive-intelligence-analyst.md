---
phase: "2"
position: competitive-intelligence-analyst
reports_to: head-of-research
status: done
verdict_for_manager: ready_to_merge
llm_tier: strong-general
llm_model: composer-2.5
generation_profile: none
generation_used: none
fallback_applied: false
---

# Handoff — Competitive Landscape → head-of-research

## Goal (from context packet)

Map AWG and sorbent water-harvesting competitors; identify positioning gaps for passive-grid.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/passive-grid/business-idea/02-competitive-landscape.md` | 10 competitor profiles, positioning matrix, white-space analysis, threat assessment, 22 cited sources |
| `docs/projects/passive-grid/business-idea/HANDOFFS/2-competitive-intelligence-analyst.md` | This handoff |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | strong-general |
| llm_model | composer-2.5 |
| generation_profile | none |
| generation_used | none |
| fallback_applied | false — preferred model per MODEL-REGISTRY |

## Decisions

- Profiled **10 competitors** across three mechanism families: refrigeration (Watergen, Skywell, Tsunami, Akvo, Aquaria, AquaFromAir), sorbent/solar (SOURCE, Spout), MOF industrial (AirJoule, Atoco).
- Positioned passive-grid in the **portable + zero-power + sub-$500** quadrant — no direct incumbent SKU identified.
- Primary white-space: **expeditionary passive sorbent harvester with replaceable cartridges** vs fixed SOURCE panels or grid-powered Spout desiccant wheel.
- Highest near-term threat flagged: **AirJoule Core AWG** residential launch (target Q4 2026); mitigated by staying in passive/preparedness niche.
- Competitive doc aligned to user-resolved **grid-down passive** product path per `00-passive-grid-down-spec.md`; powered Pi bench treated as secondary context only.

## Asks for manager (`ask_manager`)

- Peer help needed: **market-research-analyst** for TAM/sizing and consumer willingness-to-pay validation on preparedness segment (A5 in problem framing) | optional
- Clarification needed: none

## Risks / blockers

- Competitor pricing/RH specs are **manufacturer-rated**; field yield in Ontario may differ materially (especially zeolite vs MOF RH floor).
- AirJoule and Atoco MOF commercialization could compress passive-grid's long-term MOF moat if material costs drop below ~$12–14/kg at scale.
- SOURCE owns "off-grid water from air" mindshare — passive-grid needs distinct messaging (portable, cartridge, preparedness) to avoid comparison on panel yield alone.
- Web search only (parallel-research / firecrawl integrations not invoked); some prices are 2021–2025 quotes where current pricing requires direct vendor contact (Tsunami).

## Packs used

- `skills/community/marketingskills/competitor-profiling/` — profile structure (name, mechanism, price, RH, energy, customer, strengths/weaknesses)
- `skills/community/awesome-claude-corporate-skills/01-executive-leadership/competitive-analysis/` — positioning matrix and threat framing

## Do not

- Mark the phase complete
- Write outside write_lease
- Spawn other positions
- Inherit parent model when MODEL-REGISTRY pins a different tier (esp. creative/legal)
