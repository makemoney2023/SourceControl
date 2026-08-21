---
phase: "4"
position: "fpa-analyst"
reports_to: "cfo"
status: done
verdict_for_manager: ready_to_merge
llm_tier: strong-general
llm_model: grok-4.5
generation_profile: none
generation_used: none
fallback_applied: true
tool_status: "stripe/obsidian-secrets unused (unavailable this seat); public list prices via official pages + Phase 0 CFO fetch 2026-08-21; Apple SBP page retrieved 2026-08-21"
production_status: skipped
production_paths: []
design_brief_path: ""
skip_reason: "Phase 4 is Layer A craft. 4B closed — no pitch.pptx / model.xlsx."
wire_owner: none
wire_checklist_path: ""
wire_notes: ""
photoreal_qa: ""
license_basis: ""
---

# Handoff — FP&A Analyst → CFO

## Operator brief (plain English)

Unit economics for one Plus month are now explicit on a sidecar — not the business-model file, which you merge. On 60 Flash reads, contribution after Apple 30% is about $5.93 at $9 and $4.24 a month at $79; store take dwarfs vision COGS. If Flash cannot refuse, $9 Plus and both annual SKUs fail a 40% gross-margin gate (annual $79/30% goes negative) — that kill is named, not prompted around. I did not write packaging, did not invent subscribers, and I am not marking the phase complete.

## What we found

- Base Plus month (60 × Gemini 2.5 Flash + think ≈ $0.37 COGS **[F×A]**) contributes $4.24–$10.68 across the $9/$11/$13 and $79/$99 × 15%/30% grid; GM on net ≥ 92%.
- Reads-to-break on Flash is ~750–1,250 / mo depending on SKU — the 60-cap is a safety meter, not a COGS meter. 40% GM ceiling on $9/30% is $3.78 COGS; Flash ($0.37) and cascade-20% ($1.05) pass; 60 × Opus ($5.12) fails.
- Named scenario **K1 Flash-refuse FAIL:** 100% Opus/Sol at 60 included kills $9 Plus (GM 10–33%) and $79 annual (negative at 30%). Credits still contribute on frontier (~$0.19+/read after 30%) but have no home if Plus dies.
- Free Lite 3–5 is $0.002–$0.006 / user / mo on Flash-Lite; I did not blend it into Plus (mix unknown). 3-statement skipped — no revenue to link.
- Desktop was missing `HANDOFFS/0-manager-cfo.md`; recipes came from the box copy of that brief. Canonical writes landed on Desktop.

## Next steps

1. **CFO** — merge this sidecar into `04-business-model.md` with PMM packaging. Hold K1 as a hard kill, not a reprice footnote. Do not mark Phase 4 complete. 4B stays closed.
2. **CTO (via CFO / ask_manager, not spawned)** — Flash-refuse eval remains the leftover that keeps $9 contingent. Measure tokens per real 10s clip so U3 leaves **[A]**.
3. **Operator** — enroll Apple SBP when there is an Account Holder; 15% vs 30% is a bigger dollar hole than Flash COGS. No new Open question that is not already in the register.

## Goal (from context packet)

Make unit economics explicit for Telltail Phase 4. Write only `04-fpa-unit-economics.md` and this handoff. Do not spawn. Do not write `04-business-model.md`, the manager brief, or 4B. Do not mark the phase complete.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/telltail/business-idea/04-fpa-unit-economics.md` | Sidecar: unit, cost structure, contribution grid, reads-to-break, 40% GM ceiling, K1 kill, 3-statement skip |
| `docs/projects/telltail/business-idea/HANDOFFS/4-fpa-analyst.md` | This handoff |

Canonical: `/Users/cbsuperpatch/Desktop/ClaudeSkills/docs/projects/telltail/business-idea/` (local disk, no OneDrive). Box copy under `/workspace/docs/projects/telltail/business-idea/`.

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | strong-general |
| llm_model | grok-4.5 |
| generation_profile | none |
| generation_used | none |
| fallback_applied | yes — packet preferred composer-2.5; runtime is Grok Bot (grok-4.5). Not a downgrade. |

## Production (shippable phases — required)

| Field | Value |
|-------|-------|
| production_status | skipped |
| production_paths | none |
| wire_owner | none |
| wire_notes | n/a |
| skip_reason | Phase 4 craft only. 4B closed; Office model not leased. |

## SDK correlation (optional)

| Field | Value |
|-------|-------|
| sdk_runtime | n/a |
| sdk_agent_id | n/a |
| sdk_run_id | n/a |
| sdk_request_id | n/a |

## Decisions

- Unit of analysis = one paying Plus month nested on one read. Free Lite and credit packs are separate units, not a blended ARPU.
- Base COGS = Gemini 2.5 Flash Architecture B + 2k think = $0.0061/read; 60 included = $0.37 **[F×A]**.
- Contribution after 15% and 30% computed at $9 / $11 / $13 and $79 / $99. No price pick (PMM owns packaging; band is a seed).
- Breakeven = reads-to-break + COGS ceiling for 40% GM on net. No customer-count forecast.
- **K1 Flash-refuse FAIL** is a named kill: $9 Plus and annual prepaid die; do not prompt out.
- 3-statement skipped (no revenue). LTV/CAC/NDR refused (zero customers).
- 4B closed. Stripe unused.

## Asks for manager (`ask_manager`)

- Peer help needed: `cto` (via you, not spawned) for Flash-refuse eval + measured tokens per clip — the two blockers that keep U3/K1 from going firm
- Peer help needed: `product-marketing-manager` only if you want the $8–12/20 credit seed confirmed as packaging; I did not write offer copy
- Clarification needed: none on locks. Optional: land `HANDOFFS/0-manager-cfo.md` on Desktop (it was missing; I used the box copy)

## Risks / blockers

- Flash-refuse OPEN — $9 Plus is contingent on K1 not firing.
- Token recipe **[A]** until a real clip is metered.
- Apple SBP enrollment unknown (15% vs 30%).
- Free:paid mix unknown; subsidy left unloaded.
- Refunds / non-vision opex unpriced (can only worsen contribution).
- Desktop/box split on the Phase 0 CFO brief.

## Packs used

| Pack | Decision tied to pack |
|------|------------------------|
| `skills/community/awesome-claude-corporate-skills/02-finance-accounting/unit-economics/` | Used contribution after store take as the unit metric. **Refused** ARR bridge / LTV / CAC / NDR / cohort tables — zero customers; those would be theater. |
| `skills/community/awesome-claude-corporate-skills/02-finance-accounting/financial-plan/` | Pack is personal-finance cashflow. **Skipped** its IS-style annual cash-flow table — no income, savings, or opex to put in the rows. |
| `skills/community/awesome-claude-corporate-skills/02-finance-accounting/3-statements/` | **Skipped** linked IS/BS/CF. No revenue to place at the top of the income statement; inventing it would violate the packet. |
| `skills/org/HANDOFF-TEMPLATE.md` | This file. |
| `skills/org/packs/production-artifacts/SKILL.md` | `production_status: skipped` — Phase 4 is not in the shippable matrix; 4B stays closed. |

## Do not

- Mark the phase complete
- Write `04-business-model.md` or the manager brief
- Spawn other positions
- Open 4B / write pitch or model.xlsx
- Invent revenue, subscribers, TAM, CAC, conversion, LTV, or churn
- Treat 60 as category-norm metering or “unlimited is cheaper”
- Duplicate PMM pricing posture / packaging / offer copy
- Name-drop packs without a decision row
