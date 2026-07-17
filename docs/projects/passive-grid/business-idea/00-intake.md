# 00 Intake

**Phase:** 0
**Status:** complete (extracted from Gemini source + user kickoff)
**Last updated:** 2026-07-14
**Source chat:** [Gemini — Designing Proprietary Atmospheric Water Generation](https://share.gemini.google/qS0VN4WEAgkJ)

## One-sentence idea

A smart atmospheric water generator that captures humidity via sorbent desiccant cycles (MOF long-term, zeolite for bench prototype), purifies to drinking water, and runs a localized Raspberry Pi edge controller with touchscreen UI and psychrometric optimization.

## Trigger

**Market gap + technical bet** — Traditional AWGs use brute-force refrigeration and fail below ~30% RH. Sorbent-based extraction (MOFs) can work in arid conditions. Existing research chat validates engineering path and BOM.

## 12-month success (assumption — confirm with user)

Working bench prototype that:
- Generates measurable water from ambient air in Ontario test conditions
- Runs fully localized on Raspberry Pi 5 + Touch Display 2 (no cloud required)
- Ships with wiring schematic, 3D-printed enclosure, and filter chain producing drinkable output
- Validates unit economics path toward a consumer or off-grid product

## Mode

**build** — extensive hardware research already done; user wants execution, not exploration only.

## Target customer (assumption)

- Primary: **Off-grid / preparedness / sustainability-conscious homeowners** in humid-variable climates
- Secondary: **Remote communities, cottages, disaster-preparedness** buyers
- Geography: **Ontario, Canada** (sourcing already scoped to Canadian distributors)

## Budget / timeline / team

| Item | Value |
|------|-------|
| Prototype BOM | **$561–638 USD** (~$750–850 CAD) per Gemini research |
| Timeline | Not stated — **assumption:** 3–6 months to bench prototype |
| Team | User + **Danny** (collaborator mentioned in chat; role TBD) |
| Funding | **Bootstrapped** (no fundraise discussed) |
| Hiring | Not planned for prototype phase |

## Non-negotiables (from chat)

- Raspberry Pi as compute platform (Pi 5 bench → CM4 product)
- 3D-printed PETG enclosures with thermal-isolated sensor pod
- Localized edge UI (kiosk mode) — not cloud-dependent for core operation
- Complete purification chain: UV-C + carbon + remineralization
- Documented wiring schematic and block diagram

## What exists already

| Asset | Location |
|-------|----------|
| Gemini research chat (architecture, BOM, wiring) | `00-gemini-source.md` |
| System block diagram + Mermaid flow | `00-system-block-diagram.md` |
| Component sourcing list (Canada) | Embedded in `00-gemini-source.md` |
| ClaudeSkills runbook + 466-skill library | This repo |
| Working hardware | **None yet** — design/research only |

## Required outputs

**Full execution** (user history: runbook build, skills integration, "kick off the flow")

## Depth

**full-execution**

## Classification

**Hardware / robotics — grid-down passive** (zero power, sorbent + solar still)

| Emphasize | Often skip |
|-----------|------------|
| 5 (PRD), 9B (CAD/hardware), 11–18 (brand, web, content) | 9 (web/Pi MVP), 4B, 8B, 19 |

## Phases to skip (initial)

| Phase | Reason |
|-------|--------|
| 4B | Bootstrapped prototype |
| 8B | No hires planned |
| 9 | No web software MVP unless user requests companion app |
| 19 | No ad budget stated |

## Extracted schematics (from Gemini)

See `00-system-block-diagram.md` for:
- Mermaid system flow (capture → purify → brain → sensors → power)
- Power / Data / Actuator bus wiring tables
- GPIO pin map for Relay HAT
- Enclosure zone layout

## Open questions (blocking — need user input)

1. ~~**Product line:** Bench prototype only, or also pursue the **grid-down passive** variant?~~ **RESOLVED: grid-down passive**
2. **Danny's role:** Co-founder, engineer, or advisor?
3. ~~**Companion app:** Skip Phase 9 web build entirely?~~ **RESOLVED: skip — passive has no software surface**

## Sources / skills used

- Gemini shared chat extraction (manual)
- `business-idea-runbook.mdc` Phase 0 intake template
