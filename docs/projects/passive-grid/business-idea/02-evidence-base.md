# 02 Evidence Base (deep-research report)

**Phase:** 2 (runs first, before market research skills)  
**Mode used:** quick brief + evidence-gap review  
**Status:** draft  
**Last updated:** 2026-07-17  
**Author seat:** head-of-research  
**Run ID:** 1784309147792-head-of-research

## Research question

**What does the evidence say about the viability of a grid-down, passive sorbent atmospheric water harvester for Ontario off-grid / preparedness buyers — and which Phase 1 assumptions are safe to build on?**

Sub-questions:
1. Do refrigeration AWGs fail where sorbent systems claim advantage (RH floor)?
2. Is there a commercial gap for portable, zero-power sorbent harvesters?
3. Which market and competitive claims from IC artifacts are evidence-backed vs. inferred?

---

## Executive summary

Evidence supports the **problem framing** and **mechanism differentiation** for passive-grid: refrigeration AWGs require grid power and lose practical yield below ~20–30% RH, while sorbent paths (SOURCE hydropanels, MOF research, passive solar-thermal cycles) operate at lower RH floors — but **no scaled consumer SKU** occupies the **portable + zero-power + cartridge-replaceable** quadrant passive-grid targets.

Market evidence (IC merge) confirms a **narrow but real wedge**: global AWG is large (USD 2.9B–3.7B, 2026) but sorbent/residential is **<1.5% of revenue**; Canada SAM for the ICP is **USD 35M–120M (Low confidence)** with bootstrapped SOM **USD 0.1M–0.8M** over Y1–3. Assumption **A4 (MOF unavailable for prototype)** is **confirmed**; **A5 (premium WTP)** is **partially supported** for resilience buyers only.

**Critical gaps before Phase 3:** no primary customer interviews, no field yield data for zeolite MVP in Ontario RH bands, and Health Canada / NSF pathway unscoped. **Recommendation:** advance Phase 2 artifacts to C-suite review; do **not** mark phase complete until yield proof and regulatory scoping are scheduled.

---

## Key findings (with sources)

| # | Finding | Confidence | Sources |
|---|---------|------------|---------|
| 1 | Refrigeration AWGs are **>99% of commercial AWG revenue**; rated RH floors ~20–30% with sharp yield drop in dry air | **High** | [Precedence Research](https://www.precedenceresearch.com/atmospheric-water-generator-market); competitor specs in `02-competitive-landscape.md` |
| 2 | Wet-desiccation / sorbent AWG is **nascent (~0.5–1.5% share)** but **faster CAGR (~7–8%)** than cooling condensation | **Medium** | [Precedence Research](https://www.precedenceresearch.com/atmospheric-water-generator-market); [PatSnap AWH 2026](https://www.patsnap.com/resources/blog/rd-blog/atmospheric-water-harvesting-2026-patsnap-eureka/) |
| 3 | SOURCE Hydropanels demonstrate **sorbent + solar thermal at ~10% RH** — mechanism analog, opposite form factor (fixed 4×8 ft, $4.5K–6.5K install) | **High** | [SOURCE FAQ](https://source.co/pages/frequently-asked-questions); [EnergyBS 2026 guide](https://energybs.com/green-living/water/atmospheric-water-generator-awg-hydropanel-guide/) |
| 4 | **No commercial passive portable sorbent harvester** with replaceable cartridges identified in competitive scan | **Medium–High** | `02-competitive-landscape.md` (10 profiles, white-space matrix) |
| 5 | MOF commercialization accelerating (AirJoule Core AWG Q4 2026 target) — **medium-term threat** to long-term MOF moat; **not** in sub-$500 passive niche today | **Medium** | [AirJoule Q1 2026 update](https://airjouletech.com/2026/05/14/airjoule-technologies-announces-first-quarter-2026-results-and-provides-business-update/); competitive doc |
| 6 | Ontario cottage / rural off-grid is a **credible beachhead**: ~400K+ recreational properties nationally; drought/well stress in Eastern Ontario (2025) | **Medium** | [Global Digest / Stats Can SFS](https://theglobaldigest.com/ca/summer-house-market-in-canada-trends-regulations-and-outlook-2024-2025/); [CBC drought 2025](https://www.cbc.ca/news/canada/ottawa/eastern-ontario-conservation-authorities-water-conservation-drought-conditions-1.7602368) |
| 7 | Resilience buyers show **WTP for off-grid infrastructure** (solar USD 25K–80K; entry AWG USD 799–1,770) — supports **USD 1,200–2,500** ASP hypothesis for segment | **Medium** | [VoltFlow](https://www.voltflow.net/blog/off-grid-solar-canada-2026); [EcoloBlue](https://www.ecoloblue.com/en/6-atmospheric-water-generators); `02-market-research.md` |
| 8 | Mass-market buyers **reject** AWG on cost-per-litre vs. municipal tap unless outage/drought frame applies | **Medium** | [EnergyBS 2026 guide](https://energybs.com/green-living/water/atmospheric-water-generator-awg-hydropanel-guide/) |
| 9 | MOF-303 is **patent-locked**; zeolite/SAPO-34 is appropriate Phase 1 open-material pivot | **High** | `00-passive-grid-down-spec.md`; UC Berkeley WO2019010102A1 (cited in spec) |
| 10 | Passive harvester yield is **milliliters to few liters/day** at expeditionary scale — honest messaging required | **Medium** | `00-passive-grid-down-spec.md`; [Nature Water passive MOF harvester](https://www.nature.com/articles/s44221-023-00103-7) |
| 11 | **A1 (zeolite bench yield in Ontario)** — **not yet validated**; remains prototype-critical | **Low until Phase 9B** | `01-problem-framing.md`; no field data |
| 12 | Health Canada / NSF drinking-water appliance path **not scoped** — could affect claims and timeline | **Low** | IC open questions; Phase 8 legal deferred |

---

## Assumption validation matrix

| Assumption | Evidence verdict | Confidence | Notes |
|------------|------------------|------------|-------|
| **A1** Zeolite produces measurable water in Ontario humidity | **Unvalidated** | Low | Literature supports mechanism; no project-specific bench data |
| **A2** $561–638 BOM sufficient for functional bench | **Plausible, unverified** | Medium | Gemini scrape Jul 2026; passive path BOM differs from powered bench |
| **A3** Pi 5 runs kiosk + sensors + relays | **Supported for powered variant** | High | Out of scope for primary grid-down passive path |
| **A4** MOF not available for prototype | **Confirmed** | High | Industry R&D-heavy; zeolite pivot documented |
| **A5** Premium WTP for self-sufficiency | **Partially supported** | Medium | Segment-dependent; resilience yes, mass market no |
| **A6** UV-C + carbon + calcite meets drinkable perception | **Mechanism sound; unproven for passive SKU** | Medium | Powered chain specified; passive may need simpler path |

---

## Contradictions & open questions

| Issue | Severity | Resolution path |
|-------|----------|-----------------|
| SAM/TAM dollar estimates vary **2–3×** across triangulation methods | Medium | Primary interviews (10–15 Ontario ICP); label all sizing Low until then |
| Competitor RH claims are **manufacturer-rated**; field yield may differ | Medium | Instrumented Ontario field test (Phase 9B) |
| Intake still references Pi edge control; **product path resolved to grid-down passive** | Low | Messaging and Phase 5 PRD must lead passive; Pi as legacy/secondary |
| Danny's role unconfirmed | Low | Operator input — not blocking Phase 2 evidence |
| Category creation burden: sorbent **<1.5%** of AWG market | High | GTM must educate on RH advantage + grid-down; avoid SOURCE comparison on panel yield alone |
| AirJoule Core AWG residential launch (Q4 2026) | High | Monitor pricing; stay in portable passive niche |

---

## Evidence gap review (targeted)

| Gap | Unsupported claim risk | Recommended fix |
|-----|------------------------|-----------------|
| No primary research | Avatar pain rankings, ASP, maintenance tolerance | 10–15 Ontario cottage/off-grid interviews before Phase 6 GTM |
| No yield data | Any L/day marketing | Phase 9B bench + seasonal RH logging |
| Regulatory | "Drinking water appliance" claims | Phase 8 legal scoping; interim "emergency supplemental" framing |
| Sorbent SAM isolation | Precise Canada sorbent TAM | Accept Low confidence; use range not point estimate |
| MOF cost curve | Long-term moat narrative | Supplier landscape scan in Phase 3 |

**Review-ready verdict:** Phase 2 **market + competitive artifacts are merge-ready** for C-suite with **Low–Medium confidence** flags preserved. Phase 2 is **not** complete until C-suite approves and yield/regulatory follow-ups are scheduled.

---

## How later phases should use this

| Phase | Safe to build on | Treat as assumption |
|-------|------------------|---------------------|
| **3 Strategy** | Problem validity; mechanism white-space; beachhead geography; competitor positioning | Exact SAM dollars; SOM unit counts |
| **5 PRD** | Grid-down passive primary; cartridge razor/blade; honest yield band | Specific L/day claims |
| **6 GTM** | Resilience/drought/outage framing; Ontario cottage cluster | Mass-market cost-per-litre story |
| **8 Legal** | Need Health Canada path before drinkability claims | — |
| **9B Hardware** | Zeolite/SAPO-34 pivot; CAD stack; RH instrumentation plan | MOF cartridge timeline |
| **10 Fact-check** | Re-verify all competitor pricing and RH specs at launch | — |

---

## IC merge summary

| IC artifact | Merged into evidence base |
|-------------|---------------------------|
| `02-market-research.md` | TAM/SAM/SOM, avatars, PESTLE, A4/A5 validation |
| `02-competitive-landscape.md` | White-space, threat matrix, mechanism families |
| `SOURCES/INDEX.md` | 25 indexed sources (src-001–src-025) |

**Conflicts resolved:** None material — market and competitive docs align on beachhead, passive primary path, and Low SAM confidence.

---

## Sources / skills used

**Skills:**
- `skills/community/academic-research-skills/deep-research/` (quick brief mode)
- `skills/community/business-analysis-skills/skills/evidence-gap-review/`

**Primary sources:** See `SOURCES/INDEX.md` and citations in `02-market-research.md`, `02-competitive-landscape.md`.

**Internal:** `00-intake.md`, `01-problem-framing.md`, `00-passive-grid-down-spec.md`, `00-gemini-source.md`

**Model routing:** llm_tier `strong-general`, llm_model `composer-2.5`, generation_profile `none`, fallback_applied `false`
