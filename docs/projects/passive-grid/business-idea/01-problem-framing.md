# 01 Problem Framing

**Phase:** 1
**Status:** draft
**Last updated:** 2026-07-14

## Summary

Atmospheric water generation is a proven concept trapped in an inefficient form factor. Refrigeration-based AWGs consume excessive energy and stop producing below ~30% relative humidity — exactly where off-grid and arid-region users need water most. The opportunity is a sorbent-based system with intelligent edge control that captures water across a wider humidity range, purifies it to drinking standard, and presents as a consumer appliance rather than an industrial dehumidifier.

## Problem statement

**For** homeowners, cottage owners, and preparedness-minded consumers in variable-humidity climates  
**Who** need reliable drinking water without municipal supply or bottled dependency  
**The** refrigeration-based atmospheric water generator  
**Is a** high-energy, humidity-limited appliance  
**That** fails in dry conditions and costs too much to operate for daily use  
**Unlike** bottled water or rainwater harvesting  
**Our product** passively adsorbs humidity via desiccant cycles, desorbs with targeted low-grade heat, and produces remineralized drinking water — controlled by a localized edge computer that optimizes yield per kilowatt-hour using real-time psychrometrics.

## Stakeholders

| Stakeholder | Interest | Priority |
|-------------|----------|----------|
| End consumer (homeowner) | Safe, tasty water; low operating cost; simple UI | High |
| Off-grid / preparedness buyer | Works without cloud; grid-down tolerance | High |
| User (founder/builder) | Prove bench prototype; path to product | High |
| Danny (collaborator) | TBD — role unconfirmed | Medium |
| Filter/UV suppliers | Component sales | Low |
| Regulatory (Health Canada drinking water) | Safety compliance for consumer water device | Medium (future) |

## Assumptions

| # | Assumption | Confidence | Validate by |
|---|------------|------------|-------------|
| A1 | Zeolite/silica desiccant can produce measurable water on bench in Ontario humidity | Medium | Phase 9B prototype test |
| A2 | $561–638 BOM is sufficient for functional bench unit | Medium | Procurement in Phase 9B |
| A3 | Raspberry Pi 5 can run kiosk UI + sensor polling + relay control simultaneously | High | Phase 9B firmware |
| A4 | MOF sorbent is the long-term moat but not available for prototype | High | Literature / supplier search in Phase 2 |
| A5 | Consumers will pay premium over bottled water for self-sufficiency narrative | Low | Phase 2 market research |
| A6 | UV-C + carbon + calcite chain meets drinkable water perception | Medium | TDS testing in prototype |

## Constraints

| Type | Constraint |
|------|------------|
| Budget | ~$750–850 CAD prototype BOM |
| Technical | Pi GPIO is 3.3V — all 5V sensors need level shifting |
| Technical | Pi heat corrupts BME280 readings — sensor must be thermally isolated |
| Technical | MOFs not off-the-shelf — prototype uses zeolite |
| Regulatory | Consumer drinking water device may require Health Canada / NSF pathway (future) |
| Team | Small team (user + Danny); no dedicated industrial designer yet |
| Time | Not stated — assume 3–6 month bench prototype target |

## Facts vs assumptions in source material

| Claim | Status |
|-------|--------|
| Traditional AWGs fail below ~30% RH | **Fact** (well-documented in AWG literature; verify in Phase 2) |
| MOFs capture water down to ~15% RH | **Fact** (published research; specific MOF varies) |
| Prototype BOM $561–638 USD | **Assumption** (Gemini retail scrape Jul 2026 — re-verify before purchase) |
| Magnus-Tetens dew point formula for control | **Fact** (standard psychrometric equation) |

## Open items

- Confirm Danny's role and availability
- Decide: powered smart unit only, or also develop grid-down passive variant
- Health Canada regulatory path for consumer AWG (Phase 8 legal)

## Sources / skills used

- `00-intake.md`, `00-gemini-source.md`, `00-system-block-diagram.md`
- Informed by business-problem-framing, problem-statement-refiner, assumption-extractor, constraint-detector patterns (Phase 1 skills)
