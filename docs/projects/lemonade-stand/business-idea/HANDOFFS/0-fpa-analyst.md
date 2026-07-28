---
phase: "0"
position: fpa-analyst
reports_to: cfo
status: done
verdict_for_manager: ready_to_merge
llm_tier: strong-general
llm_model: composer-2.5-fast
generation_profile: none
generation_used: none
fallback_applied: true
---

# Handoff — Phase 0 unit economics & budget assumptions → CFO

## Goal (from context packet)

Phase 0 peer support for CFO. From `00-intake.md` and `MEMORY/context.md`, draft labeled unit-economics, budget, and capital assumptions for a seasonal event-based freshly-squeezed lemonade stand (Service / explore / light depth, bootstrapped). IC handoff only — no intake rewrite, no phase completion, no manager brief.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/lemonade-stand/business-idea/HANDOFFS/0-fpa-analyst.md` | This handoff |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | strong-general |
| llm_model | composer-2.5-fast |
| generation_profile | none |
| generation_used | none |
| fallback_applied | yes — registry preferred `composer-2.5`; harness only allows `composer-2.5-fast` |

---

## 1. Business model framing

| Dimension | Label | Content |
|-----------|-------|---------|
| Revenue model | **Inference** | Transaction / event retail — not SaaS, subscription, or marketplace take-rate |
| Classification | **Fact** (from intake) | Service — seasonal food & beverage retail / experiential event vendor |
| Primary unit | **Assumption** | **One cup sold** (fresh-squeezed lemonade, ice-cold serve) |
| Secondary unit | **Assumption** | **One event day** (booth shift at a festival, fair, sports day, etc.) |
| Revenue recognition | **Inference** | Cash at point of sale; no deferred revenue or cohort retention in SaaS sense |
| “Customer” | **Assumption** | Event attendee (buyer); event organizer (channel / fee counterparty) |

**Adapted unit-economics lens** (from unit-economics pack, transaction model):

- Replace ARR / NDR with **revenue per event day** and **cups per event**.
- Replace LTV:CAC with **contribution per cup** vs **fixed cost to serve an event** (booth fee, permits, travel, labor).
- Replace cohort retention with **repeat booking rate** at venues (season-two metric; not modeled here).

Non-negotiables from intake (**fact**): freshly squeezed lemons, ice-cold serve, seasonal/event footprint (not permanent retail).

---

## 2. Starter CapEx / working capital (USD ranges)

All figures are **assumptions** unless noted. No operator budget stated in intake.

### One-time setup (CapEx-ish, low depreciation)

| Item | Low | High | Label | Notes |
|------|-----|------|-------|-------|
| Cart / table / canopy | $150 | $600 | Assumption | Used cart or pop-up table + shade |
| Cooler(s) + ice storage | $80 | $250 | Assumption | Insulated; may already be owned |
| Juicer(s) | $50 | $350 | Assumption | Manual press vs electric; throughput driver |
| Signage / menu board | $30 | $150 | Assumption | DIY to printed |
| Initial smallwares | $50 | $150 | Assumption | Pitchers, sanitizer, gloves, towels |
| **Subtotal CapEx** | **$360** | **$1,500** | Assumption | |

### Pre-first-event working capital

| Item | Low | High | Label | Notes |
|------|-----|------|-------|-------|
| First ingredient batch | $75 | $200 | Assumption | Lemons, sugar, ice, cups for 1–2 trial runs |
| Permit / license deposits | $0 | $400 | Assumption | **Highly geography-dependent** — open question |
| Event application fees (first 1–2) | $50 | $300 | Assumption | Varies by organizer |
| Contingency (10%) | $50 | $150 | Assumption | Spoilage, re-buy, last-minute supplies |
| **Subtotal working capital** | **$175** | **$1,050** | Assumption | |

### Combined “get to first pour” envelope

| | Low | High | Label |
|---|-----|------|-------|
| **Total startup cash need** | **$535** | **$2,550** | Assumption |

**Inference:** Intake’s “bootstrapped, low CapEx” framing is consistent with sub-$3k to stand up; upper band assumes paid permits and modest booth deposits before first revenue.

---

## 3. Per-cup COGS sketch & contribution margin

**Assumption:** Single serve size (~12–16 oz); ~3–4 lemons per cup for “freshly squeezed” positioning; disposable cup/lid/straw.

### Variable COGS per cup (USD)

| Component | Low | Mid | High | Label |
|-----------|-----|-----|------|-------|
| Lemons (3–4 ea) | $0.60 | $0.90 | $1.40 | Assumption | Bulk vs retail pricing; yield waste |
| Sweetener / simple syrup | $0.08 | $0.15 | $0.25 | Assumption | |
| Ice | $0.05 | $0.10 | $0.15 | Assumption | Bag ice amortized per cup |
| Cup + lid + straw | $0.08 | $0.12 | $0.18 | Assumption | Compostable at high end |
| Water / misc | $0.02 | $0.03 | $0.05 | Assumption | |
| **COGS per cup** | **$0.83** | **$1.30** | **$2.03** | Assumption | |

**Fact:** No confirmed pricing or pack sizes from operator — price points below are **assumptions** for sensitivity only.

### Contribution margin at three price points

Formula: **Contribution/cup = Price − COGS** (excludes event-level fixed costs).

| Price point | vs COGS low ($0.83) | vs COGS mid ($1.30) | vs COGS high ($2.03) | Label |
|-------------|---------------------|---------------------|----------------------|-------|
| **$4.00** | $3.17 (79%) | $2.70 (68%) | $1.97 (49%) | Assumption |
| **$5.00** | $4.17 (83%) | $3.70 (74%) | $2.97 (59%) | Assumption |
| **$6.00** | $5.17 (86%) | $4.70 (78%) | $3.97 (66%) | Assumption |

**Inference:** Fresh-squeeze positioning likely needs **≥$4** retail to preserve margin after event fixed costs; **$5–$6** is a reasonable explore-range for festivals unless local comps force discounting (unverified — open question).

---

## 4. Per-event P&L skeleton

### Event-level fixed / semi-fixed costs (USD)

| Line | Low | High | Label | Notes |
|------|-----|------|-------|-------|
| Booth / vendor fee | $50 | $500 | Assumption | Farmers market vs major festival |
| Permits (allocated per event) | $0 | $150 | Assumption | Annual permit amortized or per-event |
| Labor (operator only) | $0 | $0 | Assumption | Solo — intake default |
| Labor (1 paid helper, 6 hr @ $15/hr) | $0 | $90 | Assumption | If volume requires help |
| Travel / parking / tolls | $15 | $80 | Assumption | Local vs regional |
| Waste / spoilage (5–10% of event COGS) | $10 | $60 | Assumption | Unsold lemons, melted ice |
| Payment processing (~2.5% of revenue) | varies | varies | Assumption | If card-heavy; omitted from break-even below |
| **Fixed stack (solo, low-fee event)** | **$75** | **$790** | Assumption | |

### Illustrative event day (mid case)

**Assumptions:** $5/cup, $1.30 COGS/cup → **$3.70 contribution/cup**; 120 cups sold; solo operator; $150 booth + $50 permit/travel allocation + $25 waste → **$225 event fixed**.

| Line | USD | Label |
|------|-----|-------|
| Revenue (120 × $5) | $600 | Assumption |
| Variable COGS (120 × $1.30) | ($156) | Assumption |
| Event fixed costs | ($225) | Assumption |
| **Event net (pre-operator time)** | **$219** | Assumption |

Operator labor is **not** cash-costed in solo model; treat net as return on operator time (open question: acceptable hourly yield).

### Break-even cups per event day

**Formula:** `Break-even cups = Event fixed costs ÷ Contribution per cup`

Using **$3.70 contribution/cup** (mid COGS, $5 price):

| Scenario | Event fixed | Break-even cups | Label |
|----------|-------------|-----------------|-------|
| Low-fee local (solo) | $100 | **27** | Assumption |
| Mid festival | $225 | **61** | Assumption |
| High-fee / helper | $500 | **135** | Assumption |
| Premium festival + helper | $790 | **214** | Assumption |

At **$4 price** / **$1.30 COGS** → $2.70 contribution: mid festival break-even ≈ **83 cups**.

**Inference:** Economics are viable at modest volume if booth fees stay low; high-fee events need **100+ cups/day** or **$6+ pricing** to clear a reasonable operator return.

---

## 5. Season-one budget envelope (explore / light / bootstrapped)

Aligned with intake: **explore** mode, **light** depth, **skip 4B** (no raise).

| Bucket | Low | High | Label | Notes |
|--------|-----|------|-------|-------|
| Startup CapEx + WC (§2) | $535 | $2,550 | Assumption | One-time |
| Event fixed costs (8 events × $100–$300 avg) | $800 | $2,400 | Assumption | |
| Variable COGS (8 events × 80–120 cups × ~$1.30) | $830 | $1,250 | Assumption | |
| Replenishment / misc season opex | $200 | $500 | Assumption | Ice runs, cup reorders, repairs |
| **Season-one total cash out** | **~$2,400** | **~$6,700** | Assumption | |

**Assumption:** **8–12 event days** in season one as the “prove/kill” window (not stated by operator — reasonable explore default).

**Fact:** No ad budget in scope (Phase 19 skipped); customer acquisition = booth placement + foot traffic, not paid media.

---

## 6. Capital assumptions

| Topic | Label | Content |
|-------|-------|---------|
| Funding source | **Assumption** (from intake) | Self-funded / bootstrapped; no equity or debt contemplated |
| Phase 4B status | **Fact** (from intake) | **Skipped** — bootstrapped; no raise discussed |
| Runway framing | **Assumption** | Operator funds **$2.5k–$7k** all-in season-one envelope before go/no-go |
| Prove/kill gate | **Inference** | After **8–12 events**: positive cumulative contribution after cash costs → continue; repeated sub-break-even events or permit blockers → kill or pivot |
| Return hurdle | **Open question** | Operator’s target $/hr or seasonal profit not stated — CFO should ask before hard go/no-go |

### When Phase 4B (fundraising) would reopen

**Inference:** Stay on bootstrapped path through season-one prove/kill unless one or more triggers clear:

| Trigger | Why it reopens 4B | Label |
|---------|-------------------|-------|
| Multi-stand or multi-city circuit | Working capital + gear duplication exceeds self-fund envelope | Assumption |
| Hired labor every event | Season opex step-change; payroll float before revenue | Assumption |
| Branded trailer + commissary | CapEx **$5k–$25k+**; likely needs debt or small raise | Assumption |
| Packaged retail extension (bottling, wholesale) | Inventory + compliance + production CapEx | Assumption |
| High-deposit event calendar | Booth deposits due before cash from prior events | Assumption |
| Operator chooses brand scale over side hustle | Web, paid media (Phase 19), repeat assets — cumulative cash need | Assumption |

**Recommendation:** Do **not** open 4B for season-one explore. Revisit only if operator commits to a path that clears a trigger above **and** bootstrapped envelope cannot cover it.

---

## 7. Open questions blocking tighter model

From intake — still blocking precision:

1. **Geography / first events** — permit cost tiers, booth fee norms, and lemon/ice supply costs vary materially (**assumption** until city/region named).
2. **Pricing & pack** — cup sizes and price points drive entire contribution table (**assumption** $4 / $5 / $6 used for sensitivity only).
3. **Permits** — health dept / temp food vendor path unknown; could add $0–$500+ and cap event count (**open question**).
4. **Labor model** — solo vs paid helpers shifts break-even by **~25–135 cups** on helper days (**open question**).
5. **Brand ambition** — side hustle (minimal signage, reuse gear) vs multi-event brand (web, repeat assets) affects CapEx and season opex (**open question**).

Additional FP&A gaps:

6. **Payment mix** — cash vs card affects net margin (**assumption:** mostly cash at explore stage).
7. **Weather / attendance** — volume variance not modeled; recommend tracking cups/hour per event type in season one (**inference**).

---

## 8. Recommendation to CFO

**Verdict:** **Light-depth unit economics is sufficient for Phase 0 peer brief** — enough to pressure-test feasibility, frame bootstrapped envelope, and flag break-even logic without operator-specific quotes.

**Caveat:** Tighter model (event-level forecast, season P&L, price recommendation) should wait on **operator answers to geography, pricing, permits, and labor** — not because the skeleton is wrong, but because **booth fees and COGS can swing break-even by 2–3×**.

Suggested CFO actions for Wave 2 merge:

- Carry **labeled ranges** into peer brief; do not present mid-case ($5 / 120 cups) as plan.
- Ask operator for **one anchor event** (name + fee + expected foot traffic) to collapse one column of the model.
- Align with COO peer on **throughput** (cups/hour) — caps revenue before margin matters.
- **Keep 4B skipped** unless operator selects a capital trigger from §6 and bootstrapped funding is insufficient.

---

## Decisions

- Used **transaction / event-day** unit economics (cup + event), not SaaS ARR framing.
- All numeric outputs labeled **fact / inference / assumption**; no invented geography, permits, or confirmed pricing.
- Season-one envelope aligned with bootstrapped explore path and **skip 4B**.

## Asks for manager (`ask_manager`)

- Peer help needed: **none** for Phase 0 skeleton; **coo** may later validate throughput/capacity assumptions when ops handoff exists.
- Clarification needed: **none from orchestrator** — operator-facing questions belong in CEO/CFO merge asks (geography, pricing, permits, labor, brand).

## Risks / blockers

- **Evidence thin:** `SOURCES/INDEX.md` empty — COGS and booth fees are industry-assumption bands, not local quotes.
- **Permit unknown** can invalidate entire event calendar (legal/ops peer territory).
- **Fresh-squeeze COGS** sits at high end of street-vendor margins; under-pricing or low volume is the primary kill scenario.

## Packs used

- `skills/community/awesome-claude-corporate-skills/02-finance-accounting/unit-economics/` (adapted to transaction / event F&B)

## Do not

- Mark the phase complete
- Write outside write_lease
- Spawn other positions
- Rewrite `00-intake.md` or produce CFO manager brief
