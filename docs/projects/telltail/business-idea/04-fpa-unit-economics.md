---
venture: telltail
org: Velocity Agency
phase: "4"
title: FP&A unit economics (sidecar)
owner: fpa-analyst
reports_to: cfo
status: IC complete — CFO merges; Phase 4 not marked complete
date: 2026-08-21
llm_tier: strong-general
llm_model: grok-4.5
generation_profile: none
generation_used: none
fallback_applied: true
fallback_reason: Packet preferred composer-2.5; this seat ran on Grok Bot (grok-4.5). Not a downgrade.
production_status: skipped
skip_reason: Phase 4 is Layer A craft. 4B remains closed; no model.xlsx / pitch.
4B: closed
---

# 04 — FP&A unit economics — Telltail (sidecar)

**Lease:** this file only. Do **not** treat as `04-business-model.md`. CFO merges with PMM pricing posture / packaging / offer copy. PMM owns those; this seat does not rewrite them.

**Mode:** explore · **4B:** closed · Not Blacksage · Not Sieger

Label key: **[F]** fact · **[I]** inference · **[A]** assumption · **[F×A]** list-price arithmetic on an assumed token recipe

This sidecar makes **cost-to-serve** explicit. It is not a forecast. It does not invent revenue, subscribers, TAM, CAC, conversion, LTV, or churn.

---

## Unit of analysis

Two nested units (both required):

| Unit | Definition | Why |
|------|------------|-----|
| **One paying Plus month** | One subscriber-month of Plus at a list price in the seed band $9 / $11 / $13, or the monthly equivalent of $79 / $99 annual. **[A]** band from intake/CFO seed; not a WTP finding. | This is the P&L atom after Apple/Google take. |
| **One read** | One owner clip (or stills) → **one** Flash-class cloud multimodal LLM call → signals + confidence + 1–3 next-60s actions + safety escalate/refuse. **[F]** stack lock (multimodal LLM per read; founder). **[A]** aligned to intake / Phase 0 CFO recipe. | Usage unit. Meter = 60 included Flash / Plus month. **[F]** lock. Frontier = cascade only. **[F]** |

Not a unit this pass: trainer seat $29–49 (out of v1). **[A]** intake. Not a unit: “unlimited session minutes” (different COGS; do not bundle into Plus). **[I]** Phase 0.

Free Lite is a **cost center per free user**, not blended into the Plus month. Mix is unknown. Do not invent attach. **[A]**

---

## Cost structure

### Vision COGS — public API list prices **[F]**

Retrieved / confirmed 2026-08-21. Interactive (not Batch/Flex) rates. Gemini 2.0 Flash is shut down — do not plan on it.

| Vendor | Model | Input / 1M | Output / 1M | Source |
|--------|-------|------------|-------------|--------|
| Google | Gemini 2.5 Flash-Lite | $0.10 (text/image/video) | $0.40 | [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing); same $ confirmed on [Google Cloud Gemini pricing](https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing) 2026-08-21 |
| Google | Gemini 2.5 Flash | $0.30 | $2.50 | same |
| Google | Gemini 2.5 Pro (≤200k) | $1.25 | $10.00 | same |
| Google | Gemini 3.1 Flash-Lite | $0.25 | $1.50 | Gemini API pricing (Phase 0 fetch) |
| Anthropic | Claude Opus 5 | $5 | $25 | [anthropic.com/pricing](https://www.anthropic.com/pricing) (Phase 0 fetch) |
| OpenAI | GPT-5.6 Sol | $5 | $30 | [OpenAI API pricing](https://developers.openai.com/api/docs/pricing) (Phase 0 fetch) |

Thinking tokens billed as output. **[F]** Gemini page (“including thinking tokens”). Extra **2,000 output tokens** on the “think” column. **[A]** If product needs 4k+ thinking, double that column.

Token recipes (Architecture B = native ~10s video unless noted) from Phase 0 CFO brief — **[A]** until CTO measures a real clip:

| Path | In tokens | Recipe |
|------|-----------|--------|
| Gemini 2.5 Flash / Flash-Lite · B 10s default | 3,800 | ~300 tok/s × 10s + 800 text in. Video tokenize ~300 tok/s default / ~100 tok/s low ([video understanding](https://ai.google.dev/gemini-api/docs/video-understanding)). **[F]** rule × **[A]** 10s + 800 text. |
| Claude Opus 5 · A 8 stills | 7,072 | ⌈768/28⌉² = 784 tok/image × 8 + 800 text ([Claude vision](https://platform.claude.com/docs/en/build-with-claude/vision)). **[F]** tile math × **[A]** 8 frames. |
| GPT-5.6 Sol · A 8 stills | 6,920 | high-detail 768²: 85 + 4×170 = 765 tok × 8 + 800 text. **[A]** |

Formula: `(in_tok × input_$ / 1e6) + (out_tok × output_$ / 1e6)`.

| Path | $ / read (400 out) | $ / read (2k think out) |
|------|--------------------|-------------------------|
| Gemini 2.5 Flash-Lite · B | $0.0005 | $0.0012 |
| Gemini 2.5 Flash · B | $0.0021 | **$0.0061** |
| Claude Opus 5 · A | $0.0454 | **$0.0854** |
| GPT-5.6 Sol · A | $0.0466 | **$0.0946** |
| Cascade C: 80% Flash-Lite B (400 out) + 20% Opus think | — | **$0.0175** |
| Retry ×2 Flash think | — | $0.0123 |
| Retry ×2 Opus think | — | $0.1707 |

**Base Plus path this sidecar:** Gemini 2.5 Flash · Architecture B · **think on** → **$0.0061 / read [F×A]**. Conservative end of the Phase 0 Flash band ($0.002–$0.006 / 10s). Flash-Lite is the cheap bound, not the Plus default. **[A]**

**Do not** build v1 COGS on Gemini 3.7 Flash promo (expires 2026-12-31; 2× on 2027-01-01). **[F]** Phase 0.

Other variable costs **not** in this unit (unknown, not invented): egress, Apple Small Business vs standard (modeled as take-rate scenarios, not opex), refunds, hosting, crash-reporting, on-device preprocess. **[A]** vision + store take only.

### Store take **[F]**

iOS-first → model Apple. **[A]** strategy.

| Take | When | Source |
|------|------|--------|
| **15%** | App Store Small Business Program (proceeds ≤ $1M prior calendar year, plus current-year cap). Also the post–year-1 auto-renewable subscription rate on standard terms. | [Apple SBP](https://developer.apple.com/app-store/small-business-program/) retrieved 2026-08-21: “reduced commission rate of 15%.” |
| **30%** | Standard commission / year-1 subscription without SBP. **Planning worst case.** | Apple Paid Apps; treat as **[F]** rate, **[A]** that we are in this bucket until enrolled. |

Play first-$1M 15% exists; do not use it as the iOS planning case. **[I]**

---

## Net ARPU after store take

No users assumed. List × (1 − take). Annual shown as **monthly equivalent** (list/12 after take).

| List | After 15% | After 30% | Monthly equiv. 15% | Monthly equiv. 30% |
|------|-----------|-----------|--------------------|--------------------|
| $9 / mo | $7.65 | $6.30 | $7.65 | $6.30 |
| $11 / mo | $9.35 | $7.70 | $9.35 | $7.70 |
| $13 / mo | $11.05 | $9.10 | $11.05 | $9.10 |
| $79 / yr | $67.15 | $55.30 | $5.60 | $4.61 |
| $99 / yr | $84.15 | $69.30 | $7.01 | $5.77 |
| $8 / 20 credits **[A]** Phase 0 seed, PMM owns pack | $6.80 | $5.60 | $0.34 / read | $0.28 / read |
| $12 / 20 credits **[A]** seed | $10.20 | $8.40 | $0.51 / read | $0.42 / read |

---

## Unit economics table

**Paying Plus month, 60 included Flash, zero overage, no free-user load-in.** Contribution = net monthly ARPU − vision COGS. Gross margin on **net** (after store), not on list.

Vision COGS @ 60:

| Path | COGS / 60 reads | Label |
|------|-----------------|-------|
| Flash-Lite B (400 out) | $0.03 | **[F×A]** 60 × $0.00054 |
| **Flash B + think (base)** | **$0.37** | **[F×A]** 60 × $0.00614 |
| Cascade 20% frontier (Opus think) | $1.05 | **[F×A]** 60 × $0.0175 |
| 100% Opus + think | $5.12 | **[F×A]** 60 × $0.08536 |
| 100% Sol + think | $5.68 | **[F×A]** 60 × $0.0946 |

### Base: 60 × Flash B + think ($0.37 COGS)

| SKU | Take | Net / mo | Vision COGS | Contribution | GM on net |
|-----|------|----------|-------------|--------------|-----------|
| $9 mo | 15% | $7.65 | $0.37 | **$7.28** | 95.2% |
| $9 mo | 30% | $6.30 | $0.37 | **$5.93** | 94.2% |
| $11 mo | 15% | $9.35 | $0.37 | **$8.98** | 96.1% |
| $11 mo | 30% | $7.70 | $0.37 | **$7.33** | 95.2% |
| $13 mo | 15% | $11.05 | $0.37 | **$10.68** | 96.7% |
| $13 mo | 30% | $9.10 | $0.37 | **$8.73** | 96.0% |
| $79 yr | 15% | $5.60 | $0.37 | **$5.23** | 93.4% |
| $79 yr | 30% | $4.61 | $0.37 | **$4.24** | 92.0% |
| $99 yr | 15% | $7.01 | $0.37 | **$6.64** | 94.7% |
| $99 yr | 30% | $5.77 | $0.37 | **$5.41** | 93.6% |

Store take is the bigger bite. Apple 30% on $9 ($2.70) dwarfs $0.37 vision. **[I]**

### Credit overage (separate unit = one 20-pack)

Phase 0 seed $8–12 / 20. **[A]** Not packaging copy — PMM owns the offer. Modeled only as a COGS budget per extra read.

| Pack | Take | Net / read | vs Flash think $0.0061 | vs Opus think $0.0854 | vs Sol think $0.0946 |
|------|------|------------|------------------------|-----------------------|----------------------|
| $8 / 20 | 15% | $0.340 | +$0.334 | +$0.255 | +$0.245 |
| $8 / 20 | 30% | $0.280 | +$0.274 | +$0.195 | +$0.185 |
| $12 / 20 | 15% | $0.510 | +$0.504 | +$0.425 | +$0.415 |
| $12 / 20 | 30% | $0.420 | +$0.414 | +$0.335 | +$0.325 |

Credits still contribute on **frontier** reads. The kill is included-60 on a cheap Plus, not the overage SKU. **[I]** Do not invent overage attach.

### Free-user subsidy (separate unit = one Lite user / month)

Free = 3–5 reads on **Flash-Lite / cheap model only**. **[F]** lock. Never Opus/Sol on free. **[F]**

| Mix | COGS / free user / mo |
|-----|------------------------|
| 3 × Flash-Lite (400 out) | $0.0016 **[F×A]** |
| 5 × Flash-Lite think | $0.0059 **[F×A]** |
| 5 × Flash think *(wrong SKU)* | $0.031 **[F×A]** |
| 5 × Opus think *(lock broken)* | $0.43 **[F×A]** — cash leak |

Do **not** subtract this from the Plus month. Free:paid mix is not disclosed. A blended “contribution after subsidy” would be an invented conversion. **[A]** leave unloaded.

---

## Contribution grid (all SKUs × 15% / 30%)

Same 60-included month. Rounded to cents.

### Flash B + think (base)

See table above. **All ten cells contribute $4.24–$10.68. All GM ≥ 92%.**

### Cascade 20% Opus think ($1.05 COGS)

| SKU | 15% contrib (GM) | 30% contrib (GM) |
|-----|------------------|------------------|
| $9 mo | $6.60 (86%) | $5.25 (83%) |
| $11 mo | $8.30 (89%) | $6.65 (86%) |
| $13 mo | $10.00 (90%) | $8.05 (88%) |
| $79 yr | $4.55 (81%) | $3.56 (77%) |
| $99 yr | $5.96 (85%) | $4.72 (82%) |

Cascade **clears 40% GM** on every cell. **[F×A]**

### 100% frontier + think — see named kill scenario below.

---

## Breakeven

Cannot invent paid users. No customer-count breakeven is a forecast. Two cost-side identities only:

### Reads-to-break

Reads where vision COGS = net monthly ARPU. `reads = net / $ per read`. Included cap is 60; anything above is overage (credits), not “free extra.”

| Path | $ / read | $9 / 30% ($6.30) | $9 / 15% | $79 yr / 30% ($4.61) | $13 / 30% |
|------|----------|------------------|----------|----------------------|-----------|
| Flash-Lite B | $0.00054 | **11,667** | 14,167 | 8,534 | 16,852 |
| Flash B + think | $0.00614 | **1,026** | 1,246 | 751 | 1,482 |
| Cascade 20% | $0.0175 | **360** | 437 | 263 | 520 |
| 100% Opus think | $0.0854 | **74** | 90 | **54** | 107 |
| 100% Sol think | $0.0946 | **67** | 81 | **49** | 96 |

**Read:** 60 Flash is nowhere near the Flash break (need ~1k reads/mo on $9/30%). 60 Opus is **inside** the break on monthly $9/30% (74) but **past** the break on $79/30% (54). **[F×A]**

### COGS ceiling for 40% GM on net

`GM = (net − COGS) / net = 40%` ⇒ `COGS = 0.60 × net`.

| SKU | Ceiling 15% | Ceiling 30% | 60 × Flash $0.37 | 60 × cascade $1.05 | 60 × Opus $5.12 | 60 × Sol $5.68 |
|-----|-------------|-----------------|------------------|--------------------|-----------------|----------------|
| $9 mo | $4.59 | $3.78 | PASS / PASS | PASS / PASS | **FAIL / FAIL** | **FAIL / FAIL** |
| $11 mo | $5.61 | $4.62 | PASS / PASS | PASS / PASS | PASS / **FAIL** | **FAIL / FAIL** |
| $13 mo | $6.63 | $5.46 | PASS / PASS | PASS / PASS | PASS / PASS | PASS / **FAIL** |
| $79 yr | $3.36 | $2.77 | PASS / PASS | PASS / PASS | **FAIL / FAIL** | **FAIL / FAIL** |
| $99 yr | $4.21 | $3.47 | PASS / PASS | PASS / PASS | **FAIL / FAIL** | **FAIL / FAIL** |

**40% GM is the cost-side gate, not a target margin.** Flash and cascade pass every SKU. 100% Opus fails $9 at both takes and both annuals; it only clears $11/15% and $13. 100% Sol fails every cell except $13/15%. **[F×A]**

Customer-count breakeven: **not computed.** Would require invented opex + invented paid users. If someone later wants a count, mark it **[A]** and do not treat as a forecast.

---

## Sensitivity

Holding list **$9 / 30% = $6.30 net** (worst store case we should plan). Contribution = $6.30 − COGS.

| Scenario | Reads × path | COGS | Contrib | GM on net |
|----------|--------------|------|---------|-----------|
| Base | 60 × Flash think | $0.37 | $5.93 | 94% |
| Cap 80 | 80 × Flash think | $0.49 | $5.81 | 92% |
| Retry ×2, cap 60 | 60 × 2 × Flash think | $0.74 | $5.56 | 88% |
| Retry ×2, cap 80 | 80 × 2 × Flash think | $0.98 | $5.32 | 84% |
| Cascade 20% | 60 × cascade | $1.05 | $5.25 | 83% |
| Cascade 20%, cap 80 | 80 × cascade | $1.40 | $4.90 | 78% |
| 100% Opus think | 60 × Opus think | $5.12 | $1.18 | **19%** |
| 100% Opus, cap 80 | 80 × Opus think | $6.83 | **−$0.53** | **−8%** |
| Retry ×2, 100% Opus, 60 | 60 × 2 × Opus think | $10.24 | **−$3.94** | **−63%** |
| 100% Sol think | 60 × Sol think | $5.68 | $0.62 | **10%** |
| 100% Sol, cap 80 | 80 × Sol think | $7.57 | **−$1.27** | **−20%** |

Flash stays healthy at 80 and at retry×2. Frontier is the only path that goes negative. **[I]**

---

## Named scenario: K1 — Flash-refuse FAIL (kill)

**Trigger [F lock]:** If Flash cannot hold a confidence floor good enough to refuse, **$9 Plus is not a product.** Do not prompt-your-way-out. This is not a sensitivity on temperature. It is a product kill.

**What the unit becomes:** every included read is 100% frontier + think (Opus ~$0.085 / Sol ~$0.095), because the cheap model cannot be the safety path. **[I]** from the lock.

### Contribution at 60 included under K1

| SKU | Take | Opus contrib (GM) | Sol contrib (GM) | 40% GM gate |
|-----|------|-------------------|------------------|-------------|
| **$9 mo** | 15% | $2.53 (33%) | $1.97 (26%) | **FAIL both** |
| **$9 mo** | 30% | $1.18 (19%) | $0.62 (10%) | **FAIL both** |
| $11 mo | 15% | $4.23 (45%) | $3.67 (39%) | Opus thin PASS / Sol FAIL |
| $11 mo | 30% | $2.58 (33%) | $2.02 (26%) | **FAIL both** |
| $13 mo | 15% | $5.93 (54%) | $5.37 (49%) | Opus PASS / Sol thin PASS |
| $13 mo | 30% | $3.98 (44%) | $3.42 (38%) | Opus thin PASS / Sol FAIL |
| **$79 yr** | 15% | $0.47 (8%) | **−$0.08 (−1%)** | **FAIL both** |
| **$79 yr** | 30% | **−$0.51 (−11%)** | **−$1.07 (−23%)** | **FAIL both — negative** |
| $99 yr | 15% | $1.89 (27%) | $1.34 (19%) | **FAIL both** |
| $99 yr | 30% | $0.65 (11%) | $0.10 (2%) | **FAIL both** |

Reads-to-break under K1: **49–90 reads / mo** depending on SKU/take (table above). The 60-cap is *at or past* breakeven on annual prepaid.

### What dies under K1

1. **$9 Plus (60 Flash)** — the seed SKU. Every $9 cell fails 40% GM. Strategy line stands: *$9 Plus is not a product.* **[I]**
2. **$79 / $99 annual** — monthly net $4.61–$7.01 cannot carry $5.12–$5.68 vision. $79/30% is **negative contribution**. Prepaid is the first SKU to kill. **[F×A]**
3. **The explore thesis** that a *metered Flash moment coach* is a consumer subscription. Metering does not save you if the meter is 60 Opus fires. **[I]**
4. **Not dead:** credit packs still contribute on frontier ($0.19–$0.42 / read after take). They have no home if Plus itself is killed. **[I]**
5. **Not modeled, not a rescue:** human-in-the-loop (labor rate unknown); form B curriculum (different job — CEO/PMM, not this sidecar); “better prompt.” **[A]**

**Action if K1 fires:** kill $9 Plus. Do not raise-and-pray without a new unit (HITL or a non-vision SKU). 4B stays closed — this is an explore kill, not a raise.

---

## Directional 3-statement

**Skipped.** Reason: no revenue, no subscribers, no opex, no WC, no tax, no capex, no beginning cash. A linked IS/BS/CF would require invented top-line. The unit-economics pack’s ARR/LTV/NDR tables are the same trap. Cost-side contribution on one Plus month is the only honest statement this pass.

---

## Anti-patterns (do not)

- SaaS LTV / CAC / NDR / Magic Number / Rule of 40 with zero customers.
- “Unlimited is cheaper.” Aplexity $9.99 unlimited and Tailo Pro unlimited **[F]** exist; they are not our COGS, and they do not make 60-Opus cheap.
- Treating 60 as category-norm metering. Meter = **our** COGS + safety. **[F]** lock.
- Invented TAM, CAC, conversion, LTV, churn, paid-user breakeven-as-forecast.
- Loading free-user subsidy into Plus with a guessed attach rate.
- Building v1 on Gemini 3.7 promo rates.
- GPT-4o-mini `detail=high` as the “cheap” default (Phase 0: official tiles can exceed GPT-4o high). **[F]**
- OpenAI/Claude native video as v1 (no public understand-video SKU; Sora-2 is generation). **[F]** Phase 0.
- Pricing posture / packaging / offer copy (PMM lease).

---

## Assumption register (load-bearing)

| ID | Statement | Label |
|----|-----------|-------|
| U1 | One read = one multimodal LLM call | **F** (stack lock) |
| U2 | Plus included = 60 Flash-class / mo | **F** |
| U3 | Token recipe Architecture B 10s / 8 stills + 2k think | **A** (Phase 0; CTO must measure) |
| U4 | Base path = Gemini 2.5 Flash think $0.0061 | **F×A** |
| U5 | List band $9/11/13 and $79/99 | **A** seed, not WTP |
| U6 | iOS-first → Apple 15% vs 30% | **F** rates / **A** bucket |
| U7 | Cascade = 20% Opus think | **A** (sensitivity, not a mix forecast) |
| U8 | Free 3–5 Lite only | **F** |
| U9 | Flash-refuse OPEN; K1 is the kill | **F** lock |
| U10 | Credit $8–12/20 | **A** Phase 0 seed; PMM owns pack |
| U11 | No paid users / mix / refunds | **F** (not disclosed) |
| U12 | Trainer seat out of v1 | **A** intake |

---

## Operator blockers (keep numbers from going firm)

1. **Flash-refuse eval (CTO).** OPEN. Until it holds a floor, K1 stays live and $9 Plus is contingent. Not a prompt bake-off.
2. **Measured tokens / clip.** Need product spec: native video vs 8 stills, resolution, thinking budget, two-pass writer. U3 is **[A]** until then.
3. **Retry policy.** Retry×2 is the first Flash path that eats real dollars; on Opus it is a kill. Product must rate-limit; first retry on Flash only (Phase 0).
4. **Apple SBP enrollment.** 15% vs 30% is a $1.35 hole on $9 — larger than vision COGS on Flash. Unknown until Account Holder enrolls.
5. **Credit pack** is PMM/CFO merge, not this sidecar. $8–12/20 is a seed, not a SKU.
6. **Free:paid mix.** Cannot firm a blended contribution. Do not guess conversion.
7. **Refunds / chargebacks / “wrong read”.** Not priced. COO/product leak, not Phase 4 COGS.
8. **Non-vision opex** (hosting, egress, support). Not in the unit. A later opex load can only *reduce* contribution.
9. **Named training voice** — claims, not COGS. May force cascade rate if the voice requires a frontier pass. **[I]**
10. **Desktop source of truth:** `HANDOFFS/0-manager-cfo.md` was **not** on Desktop at write time; this sidecar used the box copy of that Phase 0 brief plus Desktop `00-intake.md` / `03-strategy.md` / `02-market-research.md`. CFO should land the Phase 0 brief on Desktop if it is canonical.

---

## Sources

- Desktop (canonical): `docs/projects/telltail/business-idea/00-intake.md`, `03-strategy.md`, `02-market-research.md`
- Box copy (Desktop missing): `HANDOFFS/0-manager-cfo.md` (Phase 0 list prices + recipes)
- [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) + [Google Cloud Gemini pricing](https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing) 2026-08-21
- [Apple SBP](https://developer.apple.com/app-store/small-business-program/) 2026-08-21 (15%)
- Aplexity $9.99 unlimited / Tailo Pro unlimited: `03-strategy.md` **[F]** — category reference, not our COGS

Phase 4 **not** marked complete. 4B **closed**.
