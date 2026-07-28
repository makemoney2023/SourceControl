---
phase: "4"
position: fpa-analyst
reports_to: cfo
status: done
verdict_for_manager: ready_to_merge
llm_tier: strong-general
llm_model: composer-2.5
generation_profile: none
generation_used: none
fallback_applied: false
---

# Handoff — Unit Economics & Business Model → CFO

## Goal (from context packet)

Produce unit economics model for kennel + web channel: cost/revenue assumptions (all labeled Fact/Inference/Assumption), contribution per placement, waitlist/deposit economics, website cost vs value, sensitivity scenarios. Output for CFO merge into `04-business-model.md`. Do not invent Blacksage puppy prices.

---

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/4-fpa-analyst.md` | Full Phase 4 FP&A analysis — merge source for `04-business-model.md` |

---

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | strong-general |
| llm_model | composer-2.5 |
| generation_profile | none |
| generation_used | none |
| fallback_applied | false |

---

## 1. Business model type

| Element | Classification | Label |
|---------|----------------|-------|
| Core revenue | **Transactional service** — fee for a selectively placed puppy to an approved home | Inference |
| Model archetype | **Selective-placement kennel**, not SaaS, not marketplace, not e-commerce checkout | Decision (Phase 3 SD1–SD3) |
| Volume posture | **Deliberate scarcity** — quality and placement fit over throughput | Decision (Phase 3 SD8) |
| Web channel role | **Acquisition + credibility CAPEX/OPEX** — primary research surface, not sole growth lever (A6) | Inference + Assumption |
| Fundraising | **Bootstrapped** — skip Phase 4B; no paid-ads assumption in base case (A7) | Assumption |
| Conversion path | Trust-first → qualified inquiry → application → wait → deposit → match → placement | Inference (Phase 2–3) |

**Implication:** Unit economics are **placement economics**, not MRR/cohort economics. The website is a **fixed-cost credibility asset** whose value is measured in inquiry quality and referrability, not conversion rate alone. LTV/CAC SaaS benchmarks (3× LTV:CAC, NDR >100%) do not apply; use **contribution per placement** and **annual breakeven placements**.

---

## 2. Unit definition

### Primary unit: **Qualified placement**

A puppy placed with an approved buyer after screening, contract, and (typically) deposit/waitlist — the economic event that recognizes revenue.

| Attribute | Definition | Label |
|-----------|------------|-------|
| Revenue recognition | Puppy purchase price (Blacksage policy **UNKNOWN**) | Assumption — timing at contract/deposit vs pickup TBD by operator |
| Excluded from unit | Tire-kicker contacts, unqualified form fills, social followers | Inference |
| Quality bar | Buyer passed application/interview; breeder-led match | Fact (category norm) |

### Secondary unit: **Qualified inquiry**

A contact that demonstrates serious intent (thoughtful message, completed interest form after proof review) — leading indicator, not revenue.

| Metric role | Use | Label |
|-------------|-----|-------|
| Inquiry → placement conversion | Funnel efficiency; baseline TBD post-launch (M4) | Assumption |
| Web attribution | Site enabled shortlist → verify → contact stages | Inference |

**FP&A note:** Model annual economics on **placements/year**; track **qualified inquiries/year** as a secondary KPI for web ROI, not as the revenue unit.

---

## 3. Revenue assumptions

### Blacksage pricing

| Statement | Label |
|-----------|-------|
| **Blacksage puppy price is UNKNOWN** — no firm price until operator sets policy | Fact (Phase 0/2 constraint) |
| Category does not publish prices on site (0/8 competitors) — price discussed after qualification | Fact (Phase 2 CI) |
| Strategy prohibits price-forward web UX and invented prices (A10, Tier 3 claims) | Decision + Inference |

### Market price bands (context only — NOT Blacksage prices)

| Scenario | Price band | Midpoint used in model | Basis | Label |
|----------|------------|------------------------|-------|-------|
| **Low** | $1,500–$2,000 | **$1,750** | Mainstream ethical floor ([Insurify](https://insurify.com/pet-insurance/knowledge/how-much-is-a-rottweiler/); [King Rottweilers](https://www.kingrottweilers.com/rottweiler-puppy-cost/)) | **Fact** (range) / **Assumption** (midpoint) |
| **Base** | $2,000–$2,500 | **$2,250** | Mainstream ethical mid ([Insurify](https://insurify.com/pet-insurance/knowledge/how-much-is-a-rottweiler/)) | **Fact** (range) / **Assumption** (midpoint) |
| **High** | $3,000–$5,000 | **$3,500** | Premium/import-adjacent entry ([King Rottweilers](https://www.kingrottweilers.com/rottweiler-puppy-cost/); weak anecdote $5k–$7k) | **Fact** (range exists) / **Assumption** (midpoint conservative vs $7k+) |

**Additional revenue streams (not modeled in base case — flag for operator):**

| Stream | Notes | Label |
|--------|-------|-------|
| Stud fees | Possible if titled males; size unknown | Assumption — unverified |
| Co-ownership / retained puppies | Breeder keeps pick; no cash revenue on retained dog | Assumption |
| Show/title pursuit | Cost center unless monetized | Assumption |

### Placements volume (selective kennel proxy)

| Parameter | Low | Base | High | Label |
|-----------|-----|------|------|-------|
| Litters/year | 1 | 1–2 | 2 | **Assumption** — selective small program |
| Puppies born/litter | 5 | 7 | 9 | **Assumption** — large-breed typical 6–10 |
| Placements/litter (sold to approved homes) | 3 | 5 | 7 | **Assumption** — breeder retains picks, co-owns, or occasional keep |
| **Placements/year** | **3** | **7** | **14** | **Assumption** |

**Annual gross revenue (market-context scenarios only):**

| Price scenario | × 3 pl/yr | × 7 pl/yr | × 14 pl/yr |
|----------------|-----------|-----------|------------|
| Low ($1,750) | $5,250 | $12,250 | $24,500 |
| Base ($2,250) | $6,750 | $15,750 | $31,500 |
| High ($3,500) | $10,500 | $24,500 | $49,000 |

*These are illustrative category-aligned outputs — not Blacksage forecasts.*

---

## 4. Cost structure

All Blacksage-specific costs are **Assumption** unless operator confirms. Ranges reflect ethical-tier Rottweiler breeder cost proxies from category literature and standard OFA/vet fee orders of magnitude.

### 4A. Kennel COGS (variable — per placement)

Allocated share of litter-direct costs + breeding-stock health amortization per puppy placed.

| Cost item | Low | Base | High | Notes | Label |
|-----------|-----|------|------|-------|-------|
| Puppy vet care (microchip, vaccines, deworm, exam) | $100 | $175 | $250 | Per puppy through 8–10 weeks | Assumption |
| Registration / litter reporting (AKC) | $25 | $40 | $60 | Per puppy | Assumption |
| Feed & supplies (dam + litter share) | $75 | $125 | $200 | Allocated per placed puppy | Assumption |
| Whelping / emergency vet (litter allocated) | $50 | $150 | $400 | Per placement share | Assumption |
| Breeding stock health testing (amortized/placement) | $100 | $250 | $500 | Hips, elbows, eyes, cardiac, JLPP, panels spread over placements/year | Assumption |
| **Variable COGS per placement** | **$350** | **$740** | **$1,410** | | Assumption |

**Breeding stock — annual fixed-ish costs (before litter allocation):**

| Item | Low | Base | High | Label |
|------|-----|------|------|-------|
| Parent health testing (OFA, DNA, cardiac, eyes) | $800 | $1,500 | $3,000 | Per breeding pair cycle | Assumption |
| BH / temperament / ZTP-equivalent | $0 | $500 | $1,500 | If pursued | Assumption |
| Stud travel / AI fees | $0 | $500 | $2,000 | If outside stud | Assumption |
| Dam maintenance (feed, vet, show) | $1,500 | $3,000 | $6,000 | Per active dam/year | Assumption |

*Above parent costs largely embedded in amortized line or kennel fixed below depending on operator accounting.*

### 4B. Kennel fixed overhead (annual)

| Item | Low | Base | High | Label |
|------|-----|------|------|-------|
| Facility (home kennel vs dedicated) | $1,000 | $4,000 | $12,000 | Rent, utilities, pens, cleaning | Assumption |
| Insurance (kennel liability) | $500 | $1,200 | $2,500 | | Assumption |
| Misc supplies, toys, enrichment | $500 | $1,500 | $3,000 | | Assumption |
| Bookkeeping / admin | $0 | $500 | $1,500 | Sweat equity vs paid | Assumption |
| **Annual kennel fixed** | **$2,000** | **$7,200** | **$19,000** | | Assumption |

### 4C. Web channel costs (trust-first v1 — NO scroll 3D per SD4)

| Item | Low | Base | High | Notes | Label |
|------|-----|------|------|-------|-------|
| Site build (static, evidence-led IA) | $0 | $3,000 | $8,000 | Sweat equity / agency / contractor | Assumption |
| Domain + hosting + email | $100 | $250 | $500 | Annual | Assumption |
| CMS/forms (if paid) | $0 | $200 | $600 | Annual | Assumption |
| Photography (professional) | $0 | $1,500 | $4,000 | One-time; operator may DIY (Q6) | Assumption |
| Content / copy (if paid) | $0 | $500 | $2,000 | One-time | Assumption |
| **Year-1 web cash** | **$100** | **$5,450** | **$15,100** | | Assumption |
| **Web amortized (3 yr)** | **$33** | **$1,817** | **$5,033** | Annual | Assumption |

**Explicitly excluded from base case:** scroll 3D/WebGL, paid performance ads (A7), e-commerce checkout tooling.

### 4D. Customer acquisition cost (CAC)

| Channel | Base-case CAC | Label |
|---------|---------------|-------|
| Organic search / SEO | ~$0 marginal (time cost excluded) | Assumption (A7) |
| Referrals (trainers, clubs, prior owners) | ~$0 cash | Inference |
| Shows / events | Variable — not in base | Assumption |
| Paid ads | **$0 in base case** | Assumption (A7) |

**Qualified inquiry CAC (cash):** **$0–$50** in bootstrapped base (hosting amortized only).

**Placement CAC (fully loaded):** If 7 placements/year and $5,450 Year-1 web spend → **~$779/placement** Year 1 (web only); falls with amortization and repeat years.

---

## 5. Contribution margin / unit economics

### Per-placement contribution (before annual fixed overhead)

**Formula:** `Contribution = Price (scenario) − Variable COGS (scenario)`

| Price ↓ / COGS → | Low COGS ($350) | Base COGS ($740) | High COGS ($1,410) |
|------------------|-----------------|------------------|---------------------|
| **Low price ($1,750)** | $1,400 | $1,010 | $340 |
| **Base price ($2,250)** | $1,900 | $1,510 | $840 |
| **High price ($3,500)** | $3,150 | $2,760 | $2,090 |

**Gross margin % (Base price × Base COGS):** $1,510 / $2,250 = **67%** — healthy at placement level.

### Annual contribution (before kennel + web fixed)

| Scenario | Placements/yr | Price | Variable COGS/pl | Annual contribution |
|----------|---------------|-------|------------------|---------------------|
| Bear | 3 | $1,750 | $740 | $3,030 |
| Base | 7 | $2,250 | $740 | $10,570 |
| Bull | 14 | $3,500 | $740 | $38,640 |
| Stress | 3 | $1,750 | $1,410 | $1,020 |

### After fixed costs (Base kennel fixed $7,200 + Base web amortized $1,817 = **$9,017**)

| Scenario | Annual contribution | − Fixed | **Operating surplus/(deficit)** |
|----------|---------------------|---------|--------------------------------|
| Bear (3 × $1,010) | $3,030 | $9,017 | **($5,987)** |
| Base (7 × $1,510) | $10,570 | $9,017 | **$1,553** |
| Bull (14 × $2,760) | $38,640 | $9,017 | **$29,623** |
| Stress (3 × $340) | $1,020 | $9,017 | **($7,997)** |

### What must be true for economics to work

| # | Condition | Label |
|---|-----------|-------|
| C1 | **Price at or above mainstream ethical band** (~$2,000+) unless costs kept hobby-scale | Inference |
| C2 | **≥5–6 placements/year** at base price/cost, OR lower fixed overhead (home kennel, sweat-equity web) | Assumption |
| C3 | **Health/testing costs controlled** — unplanned vet events erode margin fast on small litters | Inference |
| C4 | **Selective ≠ zero volume** — 1 litter × 3 placements at low price is structurally underwater on fixed costs | Inference |
| C5 | **Web spend disciplined** — trust-first static site; 3D rejected (SD4) avoids $5k–$20k+ sunk cost with no category ROI | Fact + Inference |
| C6 | Operator may accept **subsidy from non-puppy income** (day job, stud, show budget) — not modeled | Assumption |

**Breakeven placements (Base price $2,250, Base COGS $740, Fixed $9,017):**

`$9,017 / ($2,250 − $740) = **~6.0 placements/year**`

---

## 6. Waitlist / deposit economics

### Category norms

| Element | Detail | Label |
|---------|--------|-------|
| Waitlist duration | 6–12+ months common | Fact ([The Canine Chasm](https://thecaninechasm.com/how-to-get-on-the-list-reputable-breeders-part-4/)) |
| Deposit amount | **~$500** common (Dreibergen published policy) | Inference (CI pattern) |
| Price on site | 0/8 competitors publish puppy prices | Fact |
| Deposit timing | Pre-birth to 2–4 weeks old — varies by breeder | Inference |

### Working capital mechanics

| Mechanism | Effect | Label |
|-----------|--------|-------|
| Deposit intake | Brings cash **6–12 months before** full puppy payment if waitlist starts pre-litter | Inference |
| Applied-to-purchase | $500 deposit reduces balance at sale — not incremental revenue | Assumption |
| Refundable vs non-refundable | Refundable: liability on balance sheet until placement; non-refundable: retained on dropout | Assumption — operator policy UNKNOWN |
| Waitlist size × $500 | 10 deposits = **$5,000** float (e.g., 10 × $500) | Arithmetic |

**Example cash timeline (Base case, applied deposit):**

```
Month 0: Buyer approved → $500 deposit (liability if refundable)
Month 6–12: Litter born → match → balance due ($2,250 − $500 = $1,750)
```

### Risks

| Risk | Impact | Mitigation | Label |
|------|--------|------------|-------|
| Deposits without Q1 capacity clarity | Liability + reputational harm if program not active | Honest interest-list vs waitlist (SD5, D5 overlay) | Inference |
| Refund requests on long waits | Cash outflow; admin burden | Published policy; communication | Assumption |
| Trust deficit → deposit hesitation | Working capital benefit unrealized | Trust-first web before deposit CTAs (SD3) | Inference |
| Too many deposits vs litter capacity | 20 deposits, 5 puppies → 15 disappointed buyers | Selective list management; transparent process | Inference |

**FP&A recommendation:** Treat deposits as **working-capital tool**, not revenue. Do not model deposit float as profit. CFO should note **refundability** and **litter capacity** as policy decisions with balance-sheet implications.

---

## 7. Website cost vs value (business case)

### Problem — cost of status quo (v1 hollow)

| Status quo cost | Mechanism | Label |
|-----------------|-----------|-------|
| Shortlist elimination | Buyers scan 3–8 sites; no named dogs/tests → removed | Fact (Phase 2 buyer journey) |
| Referrer silence | Trainers/clubs won't share URL — reputational risk | Inference (Phase 1 secondary stakeholder) |
| Unqualified inquiry load | Apply-first without proof → tire-kickers | Inference (v1 failure + D3 rejected) |
| Second-build risk | Cosmetic patch (D7) repeats sunk cost without trust ROI | Decision |
| Opportunity cost | 6–12 month buyer research cycles lost to competitors with proof-dense sites | Inference |

**Quantified status-quo proxy (Assumption):** If v1 prevents **2–4 qualified inquiries/year** that would convert at **25–50%** to placement at **$2,250**, lost revenue = **$1,125–$4,500/year** — exceeds base-case Year-1 web investment.

### Proposed investment (trust-first static — NO 3D)

| Cost bucket | Range | Label |
|-------------|-------|-------|
| Build + launch | $0–$8,000 | Assumption |
| Year-1 all-in (incl. photo) | $100–$15,100 | Assumption |
| Steady-state annual | $250–$1,100 | Assumption |

### Expected benefits

| Benefit | Type | Quantifiability | Label |
|---------|------|-----------------|-------|
| Pass shortlist gate (named dogs, health, education) | Hard/soft | Heuristic vs Phase 2 trust rank 1–5 | Inference |
| Referrer shareability (M5) | Soft | Operator interview | Assumption |
| Qualified inquiry quality ↑, volume ↓ | Soft | M4 baseline TBD | Assumption |
| Reduced operator time filtering bad leads | Soft | Qualitative | Inference |
| Avoid 3D build/maintenance | Hard savings | $5k–$20k+ avoided vs v1 path | Assumption |

### Rough ROI frame (Base case)

| Metric | Calculation | Result |
|--------|-------------|--------|
| Year-1 investment | | $5,450 |
| Incremental placements needed to pay back @ $1,510 contribution | $5,450 / $1,510 | **~3.6 placements** |
| Time to payback | 1 litter if 5+ placements | **≤12 months** if inquiry funnel works | Assumption |

**Sensitivity:** At sweat-equity ($0 build), ROI is immediate on first incremental qualified placement. At High web spend ($15k) without photography ready, ROI **delayed 2+ years** — fails PRD launch gates.

### Proceed conditions (recommend to CFO)

| # | Condition |
|---|-----------|
| W1 | Operator photography + Tier 2 facts ready or staged launch tier (SD7, Q6) — **no hollow rebuild** |
| W2 | Budget within **$3k–$8k** all-in Year 1 OR explicit sweat-equity acceptance |
| W3 | **No 3D** in v1 scope (SD4) — savings redirected to photography and health content |
| W4 | Inquiry destination + owner defined before launch (Q7) — else web generates unhandled leads |
| W5 | Success measured by **qualified inquiry quality + referrer willingness (M5)**, not traffic alone |

---

## 8. Sensitivity analysis

### Tornado — impact on annual operating surplus (Base case center: 7 pl, $2,250, $740 COGS, $9,017 fixed)

| Variable | Change | Surplus impact | Breaks model? |
|----------|--------|----------------|---------------|
| **Placements/year** | 7 → 3 | −$6,040 | **Yes — primary driver** |
| **Price band** | $2,250 → $1,750 | −$3,500 | **Yes at low volume** |
| **Variable COGS** | $740 → $1,410 | −$4,690 | Yes at ≤4 placements |
| **Kennel fixed** | $7,200 → $19,000 | −$11,800 | Yes unless bull volume |
| **Web Year-1 spend** | $5,450 → $15,100 | −$9,650 one-time | Delays payback; rarely alone fatal |
| **Litter size** | 7 → 4 puppies, 3 placements | −$6,040 | Yes |
| **Deposit policy failure** | Refunds 50% of 10 deposits | −$2,500 cash | Working capital shock |

### Scenario matrix (annual operating surplus $)

| | Low COGS | Base COGS | High COGS |
|---|----------|-----------|-----------|
| **3 pl / Low price** | ($4,817) | ($5,987) | ($7,997) |
| **7 pl / Base price** | $4,133 | **$1,553** | ($3,087) |
| **14 pl / High price** | $31,483 | $29,623 | $25,423 |

### Variables that break the model (ordered)

1. **Placements/year < 5** at mainstream price and non-hobby fixed costs  
2. **Price at low mainstream ($1,500–$1,750)** combined with premium health stack (High COGS)  
3. **High fixed kennel overhead** ($15k+) without premium pricing or second income stream  
4. **Large web spend before operator media exists** — sunk cost without trust conversion  
5. **Deposit/waitlist promises without Q1 program maturity** — reputational + refund liability  

### Variables that do NOT break model alone

- Hosting/domain costs ($250/yr)  
- Organic CAC ($0 cash)  
- Moderate web build ($3k–$5k) if ≥1 incremental placement/year  

---

## 9. Operator questions that block firm numbers

| # | Question | Blocks | FP&A impact |
|---|----------|--------|-------------|
| **Q1** | Program maturity — active litters vs brand-first? | Waitlist vs interest-list; placement volume forecast | Cannot firm placements/year or deposit policy |
| **Q8** | Budget / timeline | Web spend scenario; build vs sweat equity | Low/Base/High web cost selection |
| — | **Pricing policy** | Revenue per unit | All price scenarios remain market-context only |
| — | **Deposit policy** (amount, refundable, timing) | Working capital + liability | $500 category proxy unusable for balance sheet |
| — | **Litter cadence** | Annual volume | 1 vs 2 litters/year swings breakeven ±50% |
| — | **Health-test inventory / depth** | COGS tier | Low vs High variable COGS |
| **Q6** | Photography timeline | Web ROI timing | Launch without photos → status quo trust failure persists |
| **Q7** | Application destination & owner | Inquiry value capture | Web benefit unrealized if leads unhandled |
| **Q2** | Geography | Shipping/pickup costs | May add $200–$800/placement if shipping common |
| **Q4** | 12-month success definition | KPI weighting | M4/M5 drive web ROI proof, not revenue forecast |

---

## 10. Recommendation for CFO

### Verdict: **Category unit economics are plausible under selective placement + trust-first web — conditional on operator inputs.**

| Question | Answer |
|----------|--------|
| Is the business model viable at category economics? | **Yes, as a small-scale ethical kennel** — not as a high-volume or SaaS-style business. Mainstream pricing ($2k–$2.5k) supports **67%+ gross contribution per placement** if health costs are managed. |
| Does selective placement conflict with viability? | **Tension, not contradiction.** Breakeven ≈ **6 placements/year** at base assumptions. One litter with 3 sales at low price is **underwater** on fixed costs unless hobby-subsidized. |
| Is trust-first web worth it? | **Yes, proceed with conditions** — ROI frame ~**3–4 incremental placements** to cover base Year-1 web spend; status quo (v1 hollow) likely costs more in lost qualified demand. **Do not** fund 3D. |
| Bootstrapped path (A7)? | **Compatible** — organic/referral CAC ≈ $0 cash; avoid paid ads until M4 baseline exists. |

### Conditions for "yes"

1. Operator confirms **≥1 litter/year** with **≥5 intended placements** OR accepts hobby economics.  
2. Pricing policy lands at **≥$2,000** mainstream ethical OR costs held to Low COGS tier.  
3. Web rebuild stays **≤$8k Year-1** (or sweat equity) and **ships with real photography** (Q6).  
4. Q1/Q7 resolved before deposit/waitlist CTAs go live.  
5. CFO documents **Blacksage price = TBD** in `04-business-model.md`; use market bands labeled **Assumption** only.

### Merge guidance for `04-business-model.md`

- Lead with **business model type** (§1) and **unit definition** (§2).  
- Present **scenario tables** (§3, §5) with clear Fact/Inference/Assumption legend.  
- Include **breakeven ~6 placements** and **web payback ~3.6 placements** as headline metrics.  
- Cross-ref Phase 3 locks (SD4 no 3D, A7 bootstrapped, A10 no prices on site).  
- Skip fundraising section (4B).  
- Flag stud fees / co-ownership as **unmodeled upside**.

---

## Decisions

- Primary economic unit = **qualified placement**; secondary = **qualified inquiry**.  
- Blacksage price remains **UNKNOWN**; all dollar prices in model are **market-context Assumptions**.  
- Base case volume = **7 placements/year** (1–2 selective litters).  
- Base case web = **trust-first static**, **$3k–$5.5k Year-1**, **no 3D**, **no paid ads**.  
- Deposits modeled as **~$500 category norm** (Inference), not Blacksage policy.  
- Breakeven **~6 placements/year** at base price/cost/fixed.

---

## Asks for manager (`ask_manager`)

- Peer help needed: **none**  
- Clarification needed: CFO to confirm whether `04-business-model.md` should include a **hobby-subsidy** footnote (operator day-job cross-subsidy) as explicit non-GAAP framing | none required if standard kennel P&L suffices

---

## Risks / blockers

| Risk | Severity | Note |
|------|----------|------|
| Operator price below $2k at low volume | High | Model breaks without subsidy |
| Q1 = brand-first but waitlist/deposit UX live | High | Deposit liability without capacity |
| Photography delay | Medium | Web ROI deferred; trust gap persists |
| Health cost overrun (single litter emergency) | Medium | Swings variable COGS to High tier |
| Treating market prices as Blacksage prices in external comms | High | Violates Phase 0/2 constraint — CFO must gate |

---

## Packs used

- `skills/community/awesome-claude-corporate-skills/02-finance-accounting/unit-economics/SKILL.md`  
- `skills/community/awesome-claude-corporate-skills/07-operations/business-case-builder/SKILL.md`  
- `skills/org/positions/fpa-analyst/SKILL.md`

---

## Do not

- Mark Phase 4 complete (orchestrator + C-suite gate)  
- Write outside write_lease  
- Spawn other positions  
- Invent Blacksage puppy prices
