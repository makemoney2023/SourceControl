---
venture: telltail
org: Velocity Agency
phase: "4"
title: Business model
owner: cfo
status: CFO-merged — Phase 4 not marked complete
date: 2026-08-21
llm_tier: frontier-reasoning
llm_model: grok-4.5
generation_profile: none
fallback_applied: false
production_status: skipped
skip_reason: Phase 4 is Layer A. 4B closed — no pitch.pptx / model.xlsx
4B: closed
---

# 04 — Business model — Telltail

**Mode:** explore · **4B:** closed · Not Blacksage · Not Sieger

Label key: **[F]** fact / lock · **[I]** inference · **[A]** assumption · **[F×A]** list-price arithmetic on an assumed token recipe

This file is the CFO merge of FP&A unit economics and PMM pricing/packaging. It does **not** invent revenue, subscribers, TAM, CAC, conversion, LTV, or churn. It does **not** mark Phase 4 complete.

Canonical disk: `/Users/cbsuperpatch/Desktop/ClaudeSkills/docs/projects/telltail/business-idea/` (local only, no OneDrive).

---

## Summary

Telltail v1 is a **B2C iOS subscription**: Lite (3–5 cheap-model reads) and Plus (**60 Flash-class multimodal reads/mo + credits**). Working published SKU is **$12/mo or $99/yr** — inside the $9–13 / $79–99 seed, and **not $9.99** (Aplexity’s unlimited Gemini sits there). **[F]** locks + **[I]** C1.

On 60 Flash + think, vision COGS is **~$0.37**. After Apple 30%, $12 Plus keeps **~$8.03** (96% GM on net). Store take dwarfs the model bill. **[F×A]**

If Flash cannot refuse, **$9–13 Plus is not a product** (named kill **K1**). Do not prompt out. 4B stays closed.

**Line to hold:** *Sixty honest reads. A hard stop when the next right thing is to stop.*

---

## Model type

| Field | Value |
|-------|--------|
| Kind | Consumer software / iOS-first |
| Revenue | Recurring IAP subscription + finite credit overflow |
| Who pays | B2C owner **[A]** |
| Not | Marketplace, trainer take-rate, kennel ops, hardware, inquiry-first B2B |
| Form we *price* | A+C (moment coach gated by refuse-first) is the **recommended test**, not a launch lock **[A]** `03-strategy.md` |

If the A+C test fails, this paywall is withdrawn. We do not quietly sell curriculum (form B) at the same SKU. **[I]** PMM

---

## Units

| Unit | Definition |
|------|------------|
| **One read** | One clip/stills → **one** Flash-class cloud multimodal LLM call → card (1–3 next-60s actions) **or** a refuse. **[F]** stack. Frontier = cascade only. |
| **One Plus month** | One subscriber-month at published list, 60 included Flash, credits after. |
| **One credit pack** | Overflow reads after 60. Separate unit. Seed **$8–12 / 20 [A]** — not a lock. |
| **One Lite user / mo** | Cost center. 3–5 Lite-model reads. **Not** blended into Plus (mix unknown). |

Trainer seat $29–49 is **out of v1**. **[A]**

---

## Pricing

**Posture:** published IAP, not inquiry-first. Apple will show the price. **[I]** PMM

**Envelope (seed, not WTP):** $9–13/mo or $79–99/yr. **[A]** Phase 0 / strategy

**Working published SKU (CFO lock this pass):**

| SKU | List | Why |
|-----|------|-----|
| Plus monthly | **$12.00 / mo** | Inside the band. Avoids Aplexity’s **$9.99 unlimited** left-digit cage (PMM **C1**). **[I]** presentation, not a WTP finding. |
| Plus annual | **$99 / yr** | Same 60-read/mo meter. Stronger net than $79 after 30% ($5.77 vs $4.61). Not “unlimited for a year.” |
| Lite | $0 | 3–5 Lite-model reads |
| Credits | **$8–12 / 20 [A]** overflow | Not a third plan. Not a 200-read binge pack. |
| Trainer seat | $29–49 later | Off the v1 grid |

**Disclose on paywall + listing:** 60 Flash + credits; a read is one moment or a refuse; quota **cannot skip** bite-risk refuse; Lite 3–5 with gates on. No “unlimited.” No “what serious apps do.”

**A4 (WTP for 60 vs unlimited Gemini) stays OPEN.** This file prices cost-to-serve and presentation, not willingness to pay.

---

## Packaging

v1 shows **two plans + overflow**, not Good-Better-Best.

| Package | Included | Not included |
|---------|----------|--------------|
| **Lite** | 3–5 Lite-model reads. Safety gates **always on**. First Lite read must complete. | Frontier. Unlimited. “Full AI.” |
| **Plus** | 60 Flash-class cloud reads/mo + credits. Frontier cascade-only (not an entitlement). | Unlimited scans. Curriculum. Human coach. Trainer seat. |
| **Credits** | Extra Flash-class reads after 60. | Refuse bypass. Hero column on first paywall. |

Lite-model vs Flash: **safety does not downgrade.** A Lite freeze/stare/kids-in-frame still refuses. **[F]**

Paywall leads **harm-per-wrong-fire**, not “unlimited?” Hero: *Sixty honest reads. A hard stop when the next right thing is to stop.*

---

## Revenue assumptions

**None invented.** No subscriber count, attach, conversion, or ARR.

What we *may* collect, if someone pays (identity only):

| Stream | When | Label |
|--------|------|-------|
| Plus monthly $12 | IAP | **[A]** working SKU |
| Plus annual $99 | IAP | **[A]** working SKU |
| Credits $8–12 / 20 | After 60 | **[A]** seed |
| Lite | $0 | **[F]** |

Envelope still includes $9 / $11 / $13 and $79 if we reprice. Those are sensitivities, not listed SKUs.

---

## Cost structure

Vision + store take only. Hosting, egress, refunds, support **not** in the unit (unknown; can only reduce contribution). **[A]**

### Vision — public list prices **[F]** 2026-08-21

| Model | In / 1M | Out / 1M | Source |
|-------|---------|----------|--------|
| Gemini 2.5 Flash-Lite | $0.10 | $0.40 | [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) |
| Gemini 2.5 Flash | $0.30 | $2.50 | same |
| Claude Opus 5 | $5 | $25 | [anthropic.com/pricing](https://www.anthropic.com/pricing) |
| GPT-5.6 Sol | $5 | $30 | [OpenAI pricing](https://developers.openai.com/api/docs/pricing) |

Base path: Gemini 2.5 Flash, ~10s native video (Arch B), 2k thinking tokens → **$0.0061 / read [F×A]**. 60 included → **$0.37**. Token recipe stays **[A]** until CTO measures a real clip.

| Path | $ / read (think) | 60-read COGS |
|------|------------------|--------------|
| Flash-Lite B | $0.0012 | $0.07 (think) / $0.03 (400 out) |
| **Flash B + think (base)** | **$0.0061** | **$0.37** |
| Cascade 20% Opus think | $0.0175 | $1.05 |
| 100% Opus think | $0.0854 | $5.12 |
| 100% Sol think | $0.0946 | $5.68 |

Do not build v1 on Gemini 3.7 Flash promo (expires 2026-12-31). Do not use GPT-4o-mini `detail=high` as “cheap.” OpenAI/Claude have no public understand-video SKU.

### Store take **[F]**

iOS-first → Apple. SBP **15%** ([Apple](https://developer.apple.com/app-store/small-business-program/)). Standard / year-1 **30%** = planning worst case until enrolled.

Net on working SKUs:

| List | After 15% | After 30% |
|------|-----------|-----------|
| $12 / mo | $10.20 | **$8.40** |
| $99 / yr | $84.15 ($7.01/mo) | $69.30 (**$5.77/mo**) |
| $9 / mo (envelope) | $7.65 | $6.30 |
| $79 / yr (envelope) | $5.60/mo | $4.61/mo |

---

## Unit economics

**Paying Plus month, 60 included Flash, zero overage, no free-user load-in.** Contribution = net − vision COGS. GM on **net**, not list. No users assumed.

### Base: 60 × Flash B + think ($0.37)

| SKU | Take | Net / mo | COGS | Contribution | GM on net |
|-----|------|----------|------|--------------|-----------|
| **$12 mo (working)** | 15% | $10.20 | $0.37 | **$9.83** | 96.4% |
| **$12 mo (working)** | 30% | $8.40 | $0.37 | **$8.03** | 95.6% |
| **$99 yr (working)** | 15% | $7.01 | $0.37 | **$6.64** | 94.7% |
| **$99 yr (working)** | 30% | $5.77 | $0.37 | **$5.41** | 93.6% |
| $9 mo | 30% | $6.30 | $0.37 | $5.93 | 94.2% |
| $79 yr | 30% | $4.61 | $0.37 | $4.24 | 92.0% |

Store take on $12/30% ($3.60) dwarfs $0.37 vision. **[I]**

Cascade 20% ($1.05 COGS) still **≥77% GM** on every envelope SKU, including $79/30%. **[F×A]**

Credits: $8/20 after 30% = $0.28/read vs Flash think $0.006 — still +$0.27. Frontier credits still contribute; they have **no home if Plus dies**. **[I]**

Free Lite: $0.002–$0.006 / user / mo on Flash-Lite. **Unloaded** from Plus. Mix unknown.

---

## Breakeven

No customer-count forecast.

**Reads-to-break** (vision COGS = net):

| Path | $12 / 30% ($8.40) | $9 / 30% ($6.30) | $99 yr / 30% ($5.77) |
|------|-------------------|------------------|----------------------|
| Flash think $0.0061 | **1,369** | 1,026 | 940 |
| Cascade $0.0175 | 480 | 360 | 330 |
| Opus think $0.0854 | 98 | 74 | 68 |

60 Flash is a **safety meter**, not a COGS meter. 60 Opus is near/past break on cheap annual.

**40% GM ceiling** (`COGS ≤ 0.60 × net`):

| SKU / 30% | Ceiling | Flash $0.37 | Cascade $1.05 | Opus $5.12 | Sol $5.68 |
|-----------|---------|-------------|---------------|------------|-----------|
| $12 mo | $5.04 | PASS | PASS | FAIL | FAIL |
| $9 mo | $3.78 | PASS | PASS | FAIL | FAIL |
| $99 yr | $3.46 | PASS | PASS | FAIL | FAIL |
| $79 yr | $2.77 | PASS | PASS | FAIL | FAIL |

---

## Sensitivity

Hold **$12 / 30% = $8.40 net** (working SKU, worst store). Also show $9/30% because K1 language is “$9 Plus is not a product.”

| Scenario | COGS | Contrib @ $12/30% | Contrib @ $9/30% |
|----------|------|-------------------|------------------|
| Base 60 Flash think | $0.37 | $8.03 (96%) | $5.93 (94%) |
| 80 Flash think | $0.49 | $7.91 | $5.81 |
| Retry ×2, 60 Flash | $0.74 | $7.66 | $5.56 |
| Cascade 20%, 60 | $1.05 | $7.35 (88%) | $5.25 (83%) |
| 100% Opus, 60 | $5.12 | $3.28 (39%) | $1.18 (**19%**) |
| 100% Sol, 60 | $5.68 | $2.72 (32%) | $0.62 (**10%**) |
| 100% Opus, 80 | $6.83 | $1.57 (19%) | **−$0.53** |
| Retry ×2 Opus, 60 | $10.24 | **−$1.84** | **−$3.94** |

Flash stays healthy. Frontier is the only path that fails the gate or goes negative. **[I]**

---

## Named kill: K1 — Flash-refuse FAIL

**Lock:** If Flash cannot hold a confidence floor good enough to refuse, **$9 Plus is not a product.** Same for the working $12 SKU if every included read becomes frontier+think. Do not prompt out. **[F]** `03-strategy.md`

Under K1 the meter is 60 × Opus/Sol (~$5.12–$5.68):

| SKU | Take | Opus GM | Sol GM | Gate |
|-----|------|---------|--------|------|
| $12 mo | 30% | 39% | 32% | **FAIL both** (under 40%) |
| $9 mo | 30% | 19% | 10% | **FAIL** |
| $99 yr | 30% | 11% | 2% | **FAIL** |
| $79 yr | 30% | **−11%** | **−23%** | **negative** |

**What dies:** the metered Flash Plus thesis. Credits still contribute on frontier and have nowhere to live. HITL / form B are **not** modeled as a rescue.

**Action if K1 fires:** kill Plus. Explore kill or a new unit — not a raise. 4B stays closed.

---

## Anti-patterns

- Invented ARR / LTV / CAC / NDR / paid-user forecasts
- Publishing Plus at **$9.99** next to Aplexity unlimited $9.99 (C1)
- “What serious apps do” / 60 as category-norm (Tailo Pro and Aplexity unlimit in-band) **[F]**
- Unlimited Plus, or annual as “unlimited for a year”
- Quota that skips bite-risk refuse
- “Relaxed / safe / won’t bite” on a price surface
- Trainer seat or curriculum on the v1 paywall
- GPT-4o-mini high as cheap; Sora as a “read”; Gemini 3.7 promo as v1 COGS
- Blending free-user subsidy into Plus with a guessed attach
- Opening 4B because COGS “looks tight” — it does not, on Flash

---

## Funding

**4B closed.** Flash-class 60-read COGS does not require outside capital. Founder budget still unknown — not invented. K1 is an explore kill, not a raise.

---

## Operator blockers (keep numbers from going firm)

1. **Flash-refuse eval (CTO).** OPEN. $12/$9 Plus is contingent. Not a prompt bake-off.
2. **Measured tokens / clip.** U3 (10s / 8 stills / think budget) is **[A]** until product specs a real clip.
3. **Retry policy.** First retry on Flash only; Opus retry×2 is a kill.
4. **Apple SBP enrollment.** 15% vs 30% is a bigger dollar hole than Flash COGS.
5. **A4 WTP.** 60 vs unlimited Gemini — copy cannot close it.
6. **Free:paid mix.** Unloaded.
7. **Refunds / non-vision opex.** Unpriced.
8. **Named training voice.** Claims, not COGS; may raise cascade rate.
9. Credit pack exact $ is still **[A]** $8–12/20.

Already logged, do not re-ask: named voice, film-during-scare, TM/domain (not `telltail.com`).

---

## Fact / inference / assumption

| # | Statement | Label |
|---|-----------|-------|
| 1 | One read = one multimodal LLM call; Plus = 60 Flash + credits | **F** |
| 2 | Working published SKU $12/mo / $99/yr | **I** (C1 + store-take; not WTP) |
| 3 | Envelope $9–13 / $79–99 | **A** seed |
| 4 | Base COGS $0.0061/read; 60 = $0.37 | **F×A** |
| 5 | Aplexity $9.99 unlimited; Tailo Pro unlimited in-band | **F** |
| 6 | A+C is the form to *test* | **A** |
| 7 | K1: Flash-refuse fail kills Plus | **F** lock / **F×A** math |
| 8 | No subscribers / revenue this pass | **F** |
| 9 | 4B closed | **F** |

---

## Recommendation

**approve** the Phase 4 artifacts for CEO review — pricing and unit economics are explicit.

- Ship-planning SKU: **$12 / $99**, 60 Flash, credits overflow, Lite 3–5.
- Hold **K1** as a hard kill, not a footnote.
- Do **not** mark Phase 4 complete. CEO reviews. 4B stays closed.

**revise** only if CEO rejects C1 ($12 vs another in-band SKU that is still not $9.99) or wants annual $79 as the lead (weaker net; I would not).

---

## IC merge

| IC | Path | Verdict | Notes |
|----|------|---------|-------|
| `fpa-analyst` | `04-fpa-unit-economics.md` · `HANDOFFS/4-fpa-analyst.md` | ready_to_merge | Tables accepted. Fallback grok-4.5 recorded. |
| `product-marketing-manager` | `04-pmm-pricing-packaging.md` · `HANDOFFS/4-product-marketing-manager.md` | ready_to_merge | C1 accepted → $12 / $99. report_to cfo this phase. |

Conflicts resolved: price pick (FPA left it; PMM flagged $9.99). Phase 0 CFO brief copied to Desktop (was missing). No lease collision.

---

## Downstream handoff

- **CEO:** C-suite review of this file + `HANDOFFS/4-manager-cfo.md`. Do not mark ✅ from this seat.
- **Phase 5 (Product):** refuse-first *in front of* the card; quota cannot skip; first Lite read must complete; retry on Flash first.
- **Phase 6 (CMO):** inherit paywall hierarchy; IAP names Plus / Credits — never Unlimited / Translator Pro.
- **CTO:** Flash-refuse eval + measured tokens per clip.
- **Legal:** claims ladder on price surfaces; name coexistence unchanged.

## Sources

- `03-strategy.md`, `00-intake.md`, `.agents/product-marketing.md`
- `04-fpa-unit-economics.md`, `04-pmm-pricing-packaging.md`
- `HANDOFFS/0-manager-cfo.md`, `4-fpa-analyst.md`, `4-product-marketing-manager.md`
- Official API + Apple SBP pages cited in the FP&A sidecar (2026-08-21)

Phase 4 **not** marked complete. 4B **closed**.
