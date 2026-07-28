---
phase: "0"
manager: head-of-research
ics_spawned: []
status: ready_for_csuite
recommendation: approve
llm_tier: strong-general
llm_model: composer-2.5
generation_profile: none
generation_used: none
fallback_applied: false
runId: 1784562461564-head-of-research
tool_status:
  firecrawl: unavailable
  parallel-research: unavailable
desk_research: informal_web_search_only_not_indexed
---

# Manager brief — Lemonade Stand — Phase 0 (Head of Research peer brief)

## In plain English

We reviewed the refreshed CEO intake for your seasonal event lemonade stand. There are still no uploaded research sources, so every market claim here is labeled assumption or desk inference—not verified evidence. Early reality checks suggest the category can work, but success depends more on picking the right events and pricing than on having fresh-squeezed lemonade alone, because that positioning is already common at festivals. We flagged nine evidence gaps; three are blocking until you name geography, pricing, and permit status. This peer brief is ready for the CEO roundtable merge. Phase 0 stays open, and full Phase 2 research should wait until you answer the blocking questions.

## What we found

- **Evidence state (fact):** `SOURCES/INDEX.md` is empty; intake rests on the operator note in `MEMORY/context.md` only.
- **Category economics (assumption / desk inference):** Fresh lemonade vendors often see ~70–80% gross margin on ingredients, but net ~20–35% after booth fees, labor, and travel—event selection dominates outcome.
- **Differentiation (inference):** “Fresh-squeezed + ice-cold” matches incumbent festival vendors; a second wedge (flavor line, speed, spectacle, niche events, or organizer partnerships) is likely needed to avoid pure price competition.
- **Regulatory (inference):** Adult-operated event stands typically need temporary food establishment permits; child lemonade-stand exemptions generally do not apply—path is geography-specific (aligns with COO/legal peer flags).
- **Cross-peer alignment (inference):** CFO mid-case at $5/cup implies ~61 cups to break even at a mid-festival booth fee; desk research suggests **$6–8/cup** is the common street/fair band—Phase 2 should stress-test both once pricing is confirmed.

## Next steps

1. **Operator** — answer blocking gaps E1–E3: geography / first events, pricing & cup sizes, and temporary food vendor / permit status.
2. **CEO (merge wave)** — fold this brief with CFO, CMO, and COO peer outputs into a fresh `HANDOFFS/0-csuite-review.md`; do not reuse the 2026-07-17 merge as the close for this roundtable.
3. **Orchestrator** — keep Phase 0 in progress until the new C-suite review approves; do not mark Phase 0 ✅ yet.
4. **Head of Research (Phase 2)** — after E1–E3 clear, spawn market + competitive ICs with write leases for `02-evidence-base.md`, `02-market-research.md`, `02-competitive-landscape.md`, and `SOURCES/INDEX.md` (target ≥15 indexed sources).
5. **COO / CFO** — COO owns permit checklist once geography is known; CFO should add $6–8 price-band sensitivity alongside existing $4–$6 scenarios.

**Blocking questions the operator must answer before Phase 2 deep research or a pilot sale:**  
(1) Geography / first events? (2) Pricing & pack (sizes, price, add-ons)? (3) Permits / temporary food vendor status?

## Summary (5 bullets max)

- Wave 2 research peer brief for run `1784562461564-head-of-research`; inputs: refreshed `00-intake.md` (CEO run `1784562406799-ceo-strategist`) + `MEMORY/context.md`.
- Zero indexed sources — all market reality checks are **Low confidence** until Phase 2.
- Idea is **feasible but undifferentiated and event-selection-sensitive** at this evidence depth.
- No ICs spawned (`write_lease` = single manager file; `delegate_budget: 3` reserved for Phase 2).
- Phase not marked complete; awaiting CEO merge → `0-csuite-review.md`.

## IC handoffs merged

| IC | Handoff path | Status | llm_tier | generation_used |
|----|--------------|--------|----------|-----------------|
| — | — | n/a (none spawned) | — | — |

**Spawn rationale:** Phase 0 peer brief scope is a single manager handoff. No IC packets issued; geography and pricing block meaningful market/competitive IC work until operator clears E1–E3.

## Model routing check

- [x] Every IC packet had `llm_tier` — n/a (no ICs)
- [x] Creative ICs used correct `generation_profile` — n/a
- [x] Fallbacks recorded when Max Mode / plan blocked preferred model — none; `composer-2.5` used

## Evidence gaps (systematic review vs `00-intake.md`)

| ID | Severity | Gap | Why it matters | Recommended fix (Phase 2+) |
|----|----------|-----|----------------|----------------------------|
| E1 | **blocking** | No geography / first-event list | Permit regime, booth fees, competition density, and season length are locale-specific | Operator names city/region + 3–5 target events for season one |
| E2 | **blocking** | No pricing / cup-size pack | Cannot model unit economics or WTP vs incumbents | Operator sets base price, sizes, optional flavor upsell |
| E3 | **blocking** | Permit status unknown | Adult event vendor ≠ lemonade-stand exemption laws | COO/legal + operator confirm TFE / cottage-food path with local health dept |
| E4 | high | No customer interviews or wait-time observations | Attendee WTP and queue tolerance at events unvalidated | 5–10 intercept interviews at one pilot event |
| E5 | high | No competitor scan at target events | Multiple lemonade vendors common at farmers markets / fairs | Competitive IC profiles for named events + 3 regional vendors |
| E6 | high | No indexed sources | Later phases cannot cite; confidence stays Low | Populate `SOURCES/INDEX.md` in Phase 2 (target ≥15 sources) |
| E7 | medium | Weather / spoilage plan undocumented | Fresh TCS beverage + ice = food-safety and waste risk | Ops checklist: ice capacity, hold times, shade, discard SOP |
| E8 | medium | Lemon COGS sensitivity unstated | Lemon spot prices swing seasonally; margin claims fragile | CFO scenario on lemon $/lb at 2–3 price points (see `0-manager-cfo.md`) |
| E9 | low | Brand ambition unset | Research depth for GTM (Phase 11+) vs side hustle | Operator confirms side hustle vs multi-event brand |

### Unsupported claims in intake (acceptable at Phase 0 — flag for Phase 2)

| Intake statement | Status | Notes |
|------------------|--------|-------|
| “Positive unit economics per event” (12-mo success) | **Unvalidated** | Category supports high gross margin; net depends on booth fee, labor, travel — unknown |
| “Local/regional events near operator” | **Assumption** | Reasonable default; blocks permit + competitive research until confirmed |
| “Event attendees seeking cold, fresh drink” | **Inference** | Plausible; needs local event mix (family vs concert vs sports) |
| Skip Phase 19 (paid ads) | **Supported inference** | Bootstrapped explore mode; prove event economics first |

## Early market reality checks

### Category economics (desk research — Low confidence until sourced)

| Signal | Range / pattern | Confidence | Source type |
|--------|-----------------|------------|-------------|
| Ingredient COGS per cup (fresh) | ~$0.30–$1.60/cup (regular ~$1.40; flavored ~$1.61 cited) | Medium | F&B blogs / operator anecdotes |
| Street / festival price band | ~$6–$10/cup sweet spot; state-fair items often $10–14 | Medium | Concession guides / vendor blogs |
| Gross margin (ingredients only) | ~70–80% before booth fee + labor | Medium | Multiple secondary sources |
| Net margin (after COGS, booth, labor) | ~20–35% of gross for efficient vendors | Low | County fair vendor economics |
| Small event gross | ~$100–$600/day reported | Low | Operator stories; high variance |
| Large festival gross | ~$500–$25,000/event depending on fair size | Low | Fair vendor guides |
| Booth fees | ~$150 local markets → $2,000–$5,000+ large fairs | Low | County fair / health dept examples |
| Booth-fee rule of thumb | Experienced vendors target **≥10× booth fee** in gross revenue | Low | Concession operator guidance |

**Research read:** Unit economics *can* work, but **event selection dominates outcome** more than recipe quality. Operators who underprice (~$7 at a state fair when $10–14 is norm) or pick low-traffic paid slots often fail despite good product. Aligns with CFO peer mid-case: ~$3.70 contribution/cup at $5 price requires ~61 cups to cover ~$225 mid-festival fixed costs — **pricing at $6–8** (category norm) improves headroom.

### Competitive landscape (early)

- **Established pattern:** Mobile fresh-squeezed lemonade at festivals is a **mature micro-category** (e.g., Just Squeezed, Family Squeezed Lemonade, regional trailers such as Lush Lemon, J&O’s Lemonade Squad, The Lemon Mill).
- **Differentiation vectors observed:** flavored SKUs, speed of service (~1 min/cup cited), spectacle (oversized cups, visible squeeze/smash), year-round calendar booking, cart rentals, catering upsell.
- **Saturation risk:** Press and operator content (2024–2026) describe adult lemonade stands as a **trending side hustle** — farmers markets described as **competitive for slots**, sometimes multiple lemonade vendors per event.
- **Implication for intake non-negotiables:** “Freshly squeezed” + “ice-cold” matches category norms; venture needs a **second differentiator** (flavor line, niche events, speed cart, local story, or organizer partnership) to avoid pure price competition.

### Demand / seasonality

- **Season:** Typically warm months (roughly May–October in US temperate zones); intake “seasonal / event-based” aligns with category.
- **Weather dependency:** Reported as material — rain/cold suppresses foot traffic and ice hold times.
- **Traffic heuristic:** Experienced fair vendors use ~**5% of daily fair attendance** as a rough transaction ceiling per booth — useful sanity check once E1 resolves.
- **Customer segments (intake assumptions hold, with nuance):**
  - Primary attendees: plausible at family fairs and heat-heavy outdoor events.
  - Secondary organizers: valid channel but **requires B2B booking motion** not yet in intake scope.

### Regulatory / evidence cross-walk (feeds COO peer brief)

- Many states exempt **children’s** neighborhood stands; **adult operators at public events** generally fall under temporary retail food rules.
- Fresh lemonade with ice is typically **time/temperature controlled (TCS)** — not a low-risk prepackaged exemption in most jurisdictions.
- Permit fees and inspection requirements vary by county; **cannot research until E1 resolved**.

## Conflicts resolved

- none (Phase 0 peer brief only; no IC artifacts to merge)
- **Cross-peer note:** CFO mid-case uses $5/cup sensitivity; desk research suggests **$6–8** is category sweet spot — not a conflict, but Phase 2 should stress-test both bands once operator confirms pricing (E2).

## Artifacts for C-suite review

| Path | Scorecard check |
|------|-----------------|
| `docs/projects/lemonade-stand/business-idea/00-intake.md` | Read-only input; classification Service / explore / light |
| `docs/projects/lemonade-stand/MEMORY/context.md` | Operator seed note |
| `docs/projects/lemonade-stand/business-idea/SOURCES/INDEX.md` | Empty — **evidence debt** flagged |
| `docs/projects/lemonade-stand/business-idea/HANDOFFS/0-manager-head-of-research.md` | This brief (Wave 2) |
| `docs/projects/lemonade-stand/business-idea/HANDOFFS/0-manager-cfo.md` | Unit economics cross-check |

## Escalation tags

- **evidence** — no indexed sources; desk research only for Phase 0
- **scope** — Phase 2 market/competitive depth deferred until geography + events named

## Asks for C-suite

1. **Approve** Phase 0 research peer brief for CEO merge into `HANDOFFS/0-csuite-review.md` (Wave 2).
2. **Operator (blocking):** Answer intake open questions E1–E3 before Phase 2 spawns market + competitive ICs.
3. **Orchestrator:** Phase 2 head-of-research packet should include write leases for `02-evidence-base.md`, `02-market-research.md`, `02-competitive-landscape.md`, and `SOURCES/INDEX.md`.
4. **Cross-peer alignment:** COO should own permit checklist; CFO should stress-test booth-fee breakeven using **$6–8 price band** (category norm) alongside existing $4–$6 sensitivity.

## Recommendation

**approve** — ship Phase 0 research peer brief to CEO roundtable merge. Evidence is intentionally thin; early market reality checks suggest the idea is **feasible but undifferentiated and event-selection-sensitive**. Do **not** mark Phase 0 ✅ until `0-csuite-review.md` verdict.

## Next action for orchestrator

After all four peer briefs land (`cfo`, `cmo`, `coo`, `head-of-research`), spawn CEO merge → `HANDOFFS/0-csuite-review.md`. Schedule Phase 2 research only after operator clears E1–E3.
