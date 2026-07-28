---
phase: "3"
position: business-analyst
reports_to: ceo-strategist
status: done
verdict_for_manager: ready_to_merge
llm_tier: strong-general
llm_model: composer-2.5-fast
generation_profile: none
generation_used: none
fallback_applied: false
---

# Handoff — Phase 3 Strategy Analysis → ceo-strategist

## Goal (from context packet)

Strategic options analysis, risks, assumptions, success metrics for Phase 3. Produce mergeable fragments for `03-strategy.md`. Recommend **trust-first (D2)** with explicit tradeoffs vs alternatives (D1–D7). Confirm or refine Phase 2 default hypothesis using evidence from Phases 0–2.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/3-business-analyst.md` | This handoff — strategy decision, options comparison, D2 refinement, VP, SWOT, risks, assumptions, metrics, anti-patterns, operator questions, IA sketch |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | strong-general |
| llm_model | composer-2.5-fast |
| generation_profile | none |
| generation_used | none |
| fallback_applied | false — no fallback needed |

---

# Mergeable sections for `03-strategy.md`

---

## 1. Strategic decision — what Phase 3 must lock

Phase 3 must lock the following before any brand, web design, copy, or build work (Phases 11–14 → 9):

| # | Decision | Recommended lock | Kind |
|---|----------|------------------|------|
| SD1 | **Primary site job** | **Evidence-led trust → qualified inquiry** (not storefront, not spectacle-first) | Decision (recommend D2) |
| SD2 | **Channel role** | Web is the **primary research and credibility surface** for serious buyers and referrers; **not assumed** to be the sole primary growth lever until operator confirms program maturity and geography (Q1, Q2, Q4) | Decision + Assumption |
| SD3 | **Conversion model** | **Apply-second / qualify-first** — inquiry path follows proof layer (journey stages 2–4 before apply) | Decision |
| SD4 | **Experiential / 3D** | **NO for v1/primary** — not a launch differentiator; may revisit **only after** trust layer ships and PRD trust/content AC pass | Decision |
| SD5 | **Content honesty rule** | Publish only operator-verified facts; use honest coming-soon / interest-list posture where program facts are absent | Non-negotiable (Phase 0) |
| SD6 | **Rejected paths** | D7 (cosmetic patch), D3 (apply-first funnel), scroll 3D as prestige substitute | Decision |
| SD7 | **Build gate** | No production rebuild until PRD (Phase 5) ties acceptance criteria to all four v1 failure layers | Decision (Phase 1) |

**Strategic thesis (one sentence):** Blacksage's public presence must earn **due-diligence trust** from serious ADRK-aligned Rottweiler buyers through verifiable evidence and education, then convert **qualified** interest — because category evidence shows prestige is proof density, not visual novelty, and v1 failed by inverting that order.

---

## 2. Options comparison (D1–D7)

*Scored against Phase 2 evidence: buyer journey, trust signal ranking, 8-kennel competitive scan, v1 failure modes.*

| Option | Description | Fit vs evidence | Feasibility | Risks | Verdict |
|--------|-------------|-----------------|-------------|-------|---------|
| **D1 — Strategy-first web hub** | Full production site as primary credibility + apply channel after Phases 2–5; visual/3D TBD by strategy | **High** if site job = trust + qualify | **Medium** — blocked until operator media + program facts | Repeats v1 if build jumps ahead of PRD; must ship all four layers together | **Accept as umbrella** — D2 is the *content* strategy inside D1 |
| **D2 — Trust-first, apply-second** ← **RECOMMEND** | Lead with evidence, standards-informed education, real media; apply once proof exists | **Highest** — matches trust ranks 1–5, buyer journey, 8/8 competitor patterns | **Medium** — needs Q1, Q6, health inventory | Slower raw conversion; filters tire-kickers (feature, not bug) | **SELECT** |
| **D3 — Apply-first funnel** | Minimal prestige, maximum inquiry capture | **Low** — inverts buyer journey; v1 proved failure | Low without trust layer | Unqualified leads; scam-adjacent UX; referrers won't share | **REJECT** |
| **D4 — Referral-led + light web** | Word-of-mouth primary; web as business card | **Medium** if program already active locally | **Unknown** — geography unset (Q2) | Underserves buyers who research online first (evidence: shortlist stage is web-native) | **Partial** — referrals are secondary channel, not substitute for owned proof site |
| **D5 — Brand-first / coming-soon** | Positioning + interest list before litters | **Conditional** — viable if Q1 = pre-litter | Medium | Indefinite coming-soon without exit criteria; hollow brand without dogs/tests | **Conditional overlay** on D2 when Q1 = brand-first; must state what is verified *today* |
| **D6 — Multi-channel package** | Web + social + referral kit aligned to one story | **High** holistically | **Low now** — ops complexity | Scope creep before web trust bar met | **Defer** to GTM (Phase 6+); web remains anchor asset |
| **D7 — Patch v1 cosmetically** | Reskin Next.js/R3F prototype | **Poor** — contradicts v1 failure E | High technically | Repeats fast-forward failure; fixes surface not root cause | **REJECT** |

### Recommendation rationale vs Phase 2 evidence

| Evidence line | Implication for D2 |
|---------------|-------------------|
| Trust signals 1–5 (health, named stock, screening, real media, education) outweigh visual prestige (#10) | Site must lead with proof, not hero animation |
| 0/8 premium competitors use scroll 3D/WebGL | 3D is not category norm; no competitive disadvantage from skipping |
| Buyer journey: Shortlist → Verify before Contact → Apply | Apply-first (D3) inverts documented behavior |
| v1 failed all four layers simultaneously | Cosmetic patch (D7) cannot succeed |
| 0/8 competitors publish puppy prices | Price-forward UX is anti-pattern; qualification before price discussion |
| 6–12+ month waitlists are category norm | Trust-first aligns with patience of serious segment |

**Tradeoff summary:** D2 sacrifices **speed-to-lead** and **visual wow** for **referrability**, **buyer quality**, and **long-term credibility** — the correct trade for a high-commitment, $2k–$5k+ lifetime decision category.

---

## 3. Selected strategy — D2 refined

### Site job mix (recommended weights)

| Job | Weight | What it means on site | Phase 5+ deliverable |
|-----|--------|----------------------|----------------------|
| **Trust / evidence** | **40%** | Named dogs (when available), health test transparency, club affiliations, operator identity, real photography | Dog profiles, health hub, About |
| **Education** | **25%** | ADRK/FCI-informed standard context, health testing explainer, buyer process, tail/temperament bounds | Health/Education section |
| **Credibility / prestige** | **20%** | Professional, calm visual system; evidence density as prestige — not cinematic UX | Brand + web design (Phase 11–12) |
| **Qualification / apply** | **15%** | Interest list or application **after** proof sections; phone + form hybrid; no checkout UX | Contact/Inquire flow |

*Kind: **Inference** — weights derived from trust signal ranking and competitor IA norms; operator Q5 may adjust.*

### Channel role

| Channel | Role | Primary vs supporting |
|---------|------|----------------------|
| **Owned website** | Durable proof surface for shortlist + verify stages; shareable link for referrers | **Primary credibility channel** (evidence-backed) |
| **Referrals / clubs / shows** | Discovery and endorsement | **Supporting discovery** — amplified by credible web URL |
| **Social (FB/IG/YT)** | Litter updates, community, live photos | **Supporting engagement** — not substitute for proof architecture |
| **Phone / email** | Serious buyer conversation after web vetting | **Primary conversion conversation** (category norm) |

**Inference:** Web is unlikely to be the *only* growth lever for an established local program (D4 scenario), but for **online-first researchers** — the primary buyer persona in Phase 2 — it is the **gate** to referral and contact. Until Q1/Q2 close, treat web as **credibility channel for an emerging program**, not proven primary demand engine.

### 3D / experiential — go/no-go

| Question | Answer |
|----------|--------|
| Go for v1 / primary experience? | **NO** — out of scope for launch and primary site job |
| Revisit after trust layer ships? | **Maybe** — optional enhancement only if PRD trust/content/visual AC pass **and** operator accepts maintenance cost |
| v1 R3F scroll scene | **Do not inherit** — reference as anti-pattern |

**Rationale:** Phase 2 CI — zero competitors use scroll 3D; v1 failed on 3D layer; trust ROI is negative until evidence layer exists. If operator wants "premium feel," invest in **real photography, typography, and calm layout** before any WebGL. **3D is not a Phase 11–14 priority.**

### D2 operating principles

1. **Evidence before CTA** — every page earns the next step toward inquiry  
2. **Honest scarcity** — waitlist/interest-list language matches Q1 answer; no invented litters  
3. **Verifier-friendly** — structure content so buyers can cross-check OFA/CHIC and pedigrees  
4. **Referrer-safe** — one URL a trainer can share without reputational risk  
5. **PRD-gated build** — no Phase 11–14 until Phase 5 AC exist for all v1 failure layers  

---

## 4. Value proposition summary

### Value Proposition Canvas (labeled)

| Element | Content | Kind |
|---------|---------|------|
| **Customer segment** | Serious Rottweiler buyers seeking ADRK-aligned temperament, structure, and health-tested programs; secondary: referrers (trainers, clubs) | Fact (Phase 0–1) + Inference (Phase 2 segments) |
| **Core job (JTBD)** | Find and verify a breeder worth trusting before a 10+ year, five-figure commitment | Inference (Phase 2 J1) |
| **Pains** | Opaque programs; unverifiable health claims; placeholder/low-trust web; broken apply UX; puppy-mill noise in search | Fact (v1) + Inference (market) |
| **Gains sought** | Verifiable health clearances; named breeding stock; educational competence; straightforward qualification path; shareable credibility for referrers | Inference (Phase 2 trust ranks) |
| **Products & services** | ADRK-aligned Rottweiler breeding program + public web presence + inquiry/waitlist process | Fact (intake) — *program details unverified* |
| **Pain relievers (via D2 site)** | Proof architecture; education reducing fear; clear process; real media; no invented claims | Inference — *contingent on operator data* |
| **Gain creators** | OFA/CHIC-verifiable transparency; ADRK-informed education; professional presence referrers can endorse | Inference — *contingent on operator data* |

### Positioning statement (draft — for CEO merge)

**For** serious Rottweiler buyers who evaluate breeders through health verification, pedigree depth, and temperament evidence,  
**Blacksage Kennels** is an **ADRK-aligned Rottweiler program** *(breeding claims: operator to verify)*  
**That** provides a **transparent, evidence-led public presence** so buyers can perform due diligence before initiating contact,  
**Unlike** impulse puppy-marketplace UX or spectacle-first websites without proof,  
**We** prioritize **verifiable program integrity and buyer qualification** over speed-to-sale.

*Kind: **Inference** for Blacksage-specific claims; **Fact** for category buyer behavior.*

### Differentiators (hypothesis — not asserted as Blacksage facts)

| Differentiator | Status | Validate by |
|----------------|--------|-------------|
| ADRK-aligned type/temperament narrative bounded by Standard No. 147 | Copy bounds only until program proof | Operator + health inventory |
| Evidence-dense web vs. category dated templates | Achievable with D2 + real media | Phase 11–12 design |
| Natural tail / European correctness | **Unknown** — operator must confirm policy | Operator interview |
| Working + companion dual aptitude | Breed-standard aligned messaging | Operator program facts |

**Do not claim** as differentiators until verified: import pedigrees, titles, club memberships, CHIC numbers, litter availability, geography, pricing.

---

## 5. SWOT (prioritized — load-bearing items only)

### Strengths

| # | Item | Kind |
|---|------|------|
| S1 | Clear brand identity and breed focus (Blacksage Kennels; German/ADRK-aligned Rottweilers) | **Fact** |
| S2 | Operator rejected v1 and mandated strategy-first restart — quality bar explicit | **Fact** |
| S3 | ADRK standard URL indexed; Phase 2 evidence base and competitive scan complete | **Fact** |
| S4 | v1 prototype exists as **anti-pattern reference** (what not to ship) | **Fact** |
| S5 | Category rewards evidence density — achievable without 3D or premium agency budget | **Inference** |

*No Blacksage program strengths (dogs, tests, titles, location) listed as facts — undocumented.*

### Weaknesses

| # | Item | Kind |
|---|------|------|
| W1 | **No documented program evidence** — health inventory, photography, geography, maturity | **Fact** |
| W2 | v1 public face failed holistically — reputational repair if anything was indexed/shared | **Fact** |
| W3 | Operator open questions (Q1, Q2, Q4–Q8) block launch-ready content | **Fact** |
| W4 | Bootstrapped assumption — limits paid acquisition and agency depth | **Assumption** |
| W5 | No defined inquiry handling process (Q7) | **Fact** |

### Opportunities

| # | Item | Kind |
|---|------|------|
| O1 | Ethical-tier supply constrained (6–12+ mo waitlists) — serious buyers actively searching | **Inference** (Phase 2) |
| O2 | Competitors win with dated templates — **evidence-dense modern IA** can meet bar without 3D | **Inference** (CI) |
| O3 | Referrer channel underserved if credible URL exists | **Inference** (Phase 1) |
| O4 | ADRK/FCI-informed education content differentiates from generic "German Rottweiler" SEO spam | **Inference** |
| O5 | Honest brand-first posture viable if Q1 = pre-litter — builds list before first litter | **Inference** (conditional Q1) |

### Threats

| # | Item | Kind |
|---|------|------|
| T1 | Puppy-mill / marketplace SEO noise — buyers default to skepticism | **Inference** (market) |
| T2 | Publishing unverifiable claims → reputational harm in tight breed community | **Inference** |
| T3 | Rebuilding before operator media → second trust failure | **Inference** (v1 pattern) |
| T4 | Scope creep (3D, multi-channel) before PRD → repeat fast-forward | **Fact** (decision log) |
| T5 | Geographic/market mismatch if operator targets region unlike US-facing research | **Assumption** |

**Load-bearing SWOT insight:** **W1** (missing evidence) is the binding constraint — O1–O4 are only capturable after operator supplies program facts and media.

---

## 6. Strategic risks + mitigations

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|------------|--------|------------|
| R1 | **Launch with placeholder/invented content** → second trust collapse | High if unmitigated | Critical | SD5 honesty rule; PRD AC forbids invented dogs/tests/litters; coming-soon template |
| R2 | **Operator Q1 = brand-first but site built as active-breeder** | Medium | High | Lock posture in Phase 3/5 from Q1; interest-list UX vs waitlist |
| R3 | **Team reverts to v1 3D/apply-first patterns** | Medium | High | SD4/SD6 explicit no-go; v1 as anti-pattern in PRD |
| R4 | **Photography delay blocks credible launch** | Medium | High | Phase 5 defines minimum viable media set; staged launch tiers |
| R5 | **Inquiry volume exceeds operator capacity** | Low initially | Medium | Qualification form design; phone-first for serious buyers; Q7 process |
| R6 | **ADRK-aligned claims without OFA/CHIC proof** | Medium | High | US market expects verifiable tests (Phase 2); publish only linked results |
| R7 | **Geographic opacity** reduces trust | Medium | Medium | Q2 must close before launch; no invented locale |
| R8 | **Budget/timeline pressure causes second fast-forward** | Medium | Critical | SD7 build gate; RUNBOOK enforcement; operator Q8 |
| R9 | **Natural tail policy mismatch** alienates ADRK-seeking buyers | Low–Medium | Medium | Operator confirms policy; state clearly when known |
| R10 | **Legal/compliance overclaim** on health guarantees | Low | High | Defer guarantee language to ops/legal phase; no invented contracts |

### Top 5 risks (executive summary)

1. **R1** — Placeholder/invented content at launch  
2. **R3** — Reversion to v1 3D/apply-first anti-patterns  
3. **R8** — Timeline pressure → second fast-forward  
4. **R4** — Photography delay blocks trust layer  
5. **R6** — ADRK marketing without verifiable US health transparency  

---

## 7. Assumptions log (with validate-by)

| ID | Statement | Label | Confidence | Validate by | Phase 3 impact |
|----|-----------|-------|------------|-------------|----------------|
| A1 | Brand: Blacksage Kennels; ADRK-aligned Rottweilers | Fact | High | Intake | Locked |
| A2 | v1 failed all four layers (E) | Fact | High | Operator Q3 | Locked — drives SD6 |
| A3 | Serious buyers trust before apply | Inference | High | Phase 2 evidence | D2 selected |
| A4 | Evidence density beats visual novelty in category | Inference | High | CI 8-kennel scan | 3D no-go |
| A5 | US-facing market until operator specifies geography | Assumption | Medium | Operator Q2 | Messaging, compliance |
| A6 | Web = primary research surface (not sole growth lever) | Inference | Medium | Operator Q1, Q4 | Channel role |
| A7 | Bootstrapped; organic/referral first | Assumption | Low | Operator Q8 | Scope, Phase 19 skip |
| A8 | 12-month success includes accepted presence + inquiry process | Assumption | Low | Operator Q4 | Metrics baseline |
| A9 | Real photography required before credible launch | Inference | High | Operator Q6 | Launch gate |
| A10 | No puppy prices on site (category norm) | Inference | High | CI 0/8 publish prices | UX rule |
| A11 | Phone + form hybrid for conversion | Inference | Medium | CI patterns | IA Contact |
| A12 | Blacksage has **no documented** health tests, titles, or litters today | Fact | High | Evidence gaps table | Content scope |
| A13 | D2 correct default; D5 overlay if Q1 = brand-first | Inference | Medium | Operator Q1 | Site posture |
| A14 | Operator will supply health inventory before parent/litter pages | Assumption | Low | Operator interview | Trust pages |
| A15 | Referrers need shareable URL more than social DMs | Inference | Medium | Phase 1 secondary stakeholder | Web priority |

---

## 8. Success metrics

### 12-month success metrics *(assumptions flagged — pending Q4)*

| Metric | Target (hypothesis) | Assumption? | Measurement |
|--------|---------------------|-------------|-------------|
| **M1 — Operator acceptance** | Operator rates public presence "production-quality" vs v1 | Yes (Q4) | Operator sign-off checklist |
| **M2 — Trust layer completeness** | 100% of published dog/health claims backed by operator-verified data | No (non-negotiable) | Content audit |
| **M3 — Inquiry process defined** | Documented destination, owner, SLA for response | Yes (Q7) | Ops doc exists |
| **M4 — Qualified inquiry volume** | Baseline TBD post-launch; quality > quantity | Yes | Form fields + operator feedback |
| **M5 — Referrer usability** | ≥1 referrer (trainer/club) willing to share URL without caveat | Yes | Operator interview |
| **M6 — Buyer journey support** | Site supports shortlist + verify stages (health, dogs, education live) | No | Heuristic review vs Phase 2 criteria |
| **M7 — Zero invented facts** | No location/price/litter claims without operator source | No | QA audit |
| **M8 — v1 failure layers addressed** | PRD AC pass on visual, content/trust, UX/conversion; 3D only if explicitly approved | No | Phase 5 + 10 QA |

*Quantitative traffic/conversion targets deferred — no baseline, no analytics on v1, program maturity unknown.*

### Strategy-phase exit criteria (Phase 3 → Phase 4/5)

| Criterion | Status when met |
|-----------|-----------------|
| Site job locked (SD1) | D2 weights documented in `03-strategy.md` |
| Channel role stated (SD2) | Credibility-primary; growth lever conditional on Q1/Q4 |
| D1–D7 comparison with explicit rejections | Done in this handoff |
| 3D go/no-go recorded (SD4) | **NO for v1/primary**; revisit only post-trust layer |
| Anti-patterns listed (Section 9) | Done |
| Operator questions classified launch vs strategy blockers | Section 10 |
| IA sketch for PRD (Section 11) | Done |
| Assumptions log with validate-by | Section 7 |
| CEO merges into `03-strategy.md` | Pending |

**Phase 3 does NOT require** operator answers to Q1/Q2/Q4–Q8 to **lock strategy** — but **Phase 5 PRD and launch do**.

---

## 9. What we are NOT doing (anti-patterns)

| Anti-pattern | Why rejected | Source |
|--------------|--------------|--------|
| **D7 — Cosmetic v1 patch** | Failed all four layers; strategy skipped | Phase 1, operator |
| **D3 — Apply-first funnel** | Inverts buyer journey; v1 conversion failed | Phase 2 journey map |
| **Scroll 3D as differentiator** | 0/8 competitors; v1 3D failed; negative trust ROI | Phase 2 CI |
| **Inventing location, prices, litters, health results** | Non-negotiable; community reputational risk | Phase 0 |
| **Price-forward / puppy-mill UX** | Category red flag; 0/8 publish prices | Phase 2 CI |
| **Shopping-cart checkout for puppies** | Red flag #11 in CI | Phase 2 |
| **Generic "German Rottweiler" without proof** | Red flag #5 | Phase 2 |
| **Fast-forward to Phases 11–14/9 before PRD** | Root cause of v1 failure | decisions.md |
| **Placeholder dog photography** | Worse than sparse honest copy | Phase 2 trust rank #4 |
| **Treating soft locks (brand+apply equally; 3D) as strategy** | Reopened by restart | MEMORY/context |
| **Asserting Blacksage strengths** (titles, imports, CHIC) **without operator data** | Evidence gap | Phase 2 |

---

## 10. Open operator questions — launch vs strategy lock

| # | Question | Blocks strategy lock? | Blocks launch / PRD? | Phase 3 handling |
|---|----------|----------------------|----------------------|------------------|
| **Q1** | Program maturity — active litters vs brand-first? | **No** — D2 + D5 overlay covers both | **Yes** — waitlist vs interest-list UX, copy tone | Recommend honest posture per answer; strategy supports both |
| **Q2** | Geography & contact method | **No** — strategy is evidence-first regardless | **Yes** — local trust, pickup norms, contact IA | Placeholder-free; omit until answered |
| **Q4** | 12-month success definition | **No** — metrics flagged as assumptions | **Yes** — weights M1, M4, M5 | Proceed with hypothesis metrics |
| **Q5** | Site job mix (prestige / apply / education) | **Was open — recommend close with D2 weights** | Partial — fine-tune in PRD | **Lock via SD1** unless CEO overrides |
| **Q6** | Photography / media timeline | **No** | **Yes** — trust signal #4 | Define staged launch tiers in PRD |
| **Q7** | Application destination & owner | **No** | **Yes** — conversion architecture | Recommend phone + form hybrid now |
| **Q8** | Budget / timeline caps | **No** | **Yes** — scope, build approach | SD7 mitigates fast-forward risk |

**Additional operator questions (from Phase 2 evidence gaps):**

| Question | Blocks launch? | Note |
|----------|----------------|------|
| Blacksage health-test inventory | **Yes** | Any parent/litter health page |
| Club memberships & titles | **Yes** for credibility tier claims | Badges only if verified |
| Natural tail policy | **Yes** for ADRK-seeking buyers | Ask alongside Q1 |
| Primary market geography (US only?) | Partial | Affects compliance copy |

**Strategy lock recommendation:** CEO can merge D2 and exit Phase 3 **without** operator interview — but should **schedule operator session** before Phase 5 to close Q1, Q2, Q6, Q7 and evidence gaps.

---

## 11. Recommended IA / channel architecture (PRD handoff sketch)

*Labeled **Inference** — synthesized from 8-kennel competitor norm (Phase 2 CI pattern #10). Adapt when operator facts exist.*

### Primary navigation (recommended lock)

**Top-level IA (Phase 3 recommendation):**

```
Home → Dogs → Health/Education → About → Contact/Inquire
```

| Nav item | Job under D2 |
|----------|----------------|
| **Home** | Orient; route to proof; hero with real media when Q6 satisfied |
| **Dogs** | Verify breeding stock — named profiles, photos, pedigrees, per-dog health links when operator inventory exists |
| **Health/Education** | Enable due diligence — testing explainer, ADRK/FCI-informed standard bounds, buyer process |
| **About** | Operator identity + referrability — program philosophy, affiliations **only when verified** |
| **Contact/Inquire** | Qualify interest — form + phone (when Q2); apply-second placement |

**Conditional extension (Q1 = active program):** add **Litters / Puppies** between Dogs and Health/Education — current/upcoming litters with linked sire/dam, honest waitlist rules. Omit entirely for brand-first posture until Q1 permits.

### Expanded navigation (PRD detail)

```
Home
├── Dogs (Breeding Stock)
│   ├── Males / Studs
│   ├── Females / Dams
│   └── (Future: Offspring / Gallery)
├── [Litters / Puppies] — conditional on Q1
│   ├── Current / Upcoming (honest — only if Q1 permits)
│   └── Past Litters (optional, when history exists)
├── Health & Education
│   ├── Health Testing (OFA/CHIC, JLPP, cardiac, eyes — program-specific when verified)
│   ├── Breed Standard (ADRK/FCI-informed — factual bounds OK)
│   ├── Our Process (socialization, screening, waitlist/interest list)
│   └── (Optional) Contracts / Policies (when operator provides)
├── About
│   ├── Our Program / Philosophy
│   ├── Operator / Kennel Story (named people, years — when provided)
│   └── Affiliations (only verified badges)
└── Contact / Inquire
    ├── Contact form (qualification fields)
    ├── Phone (when Q2 provides)
    └── Interest list / Application (apply-second placement)
```

### Page-level job mapping (D2)

| Page | Primary job | Key content (when data exists) |
|------|-------------|--------------------------------|
| **Home** | Orient + route to proof | Value prop, hero with **real** kennel/dog photo, trust strip (badges/tests), CTA = "Meet our dogs" / "Our health program" — **not** "Apply now" alone |
| **Dogs** | Verify breeding stock | Named profiles, photos, pedigrees, per-dog health links |
| **Litters** | Scarcity + process honesty | Sire/dam links, expected timing, waitlist rules — or interest-list if brand-first |
| **Health & Education** | Reduce fear, enable OFA lookup | Test explanations, ADRK-informed context, what buyers should ask |
| **About** | Operator identity + referrability | Named breeder, location (when Q2), years, philosophy |
| **Contact / Inquire** | Qualify, not close | Form with lifestyle/breed goals; phone prominent; no price checkout |

### Channel architecture

```
                    ┌─────────────────┐
   Discover ───────►│ Search / Clubs  │
   (external)       │ Referrals       │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  OWNED WEBSITE  │◄── Primary proof asset (D2)
                    │  (evidence IA)  │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼───┐  ┌───────▼──────┐  ┌───▼────────┐
     │ Verify     │  │ Contact      │  │ Social     │
     │ (OFA,      │  │ Phone/Email  │  │ (updates)  │
     │  pedigrees)│  │ Form/Inquire │  │            │
     └────────────┘  └──────────────┘  └────────────┘
```

### CTA hierarchy (apply-second)

1. **Primary:** "View our dogs" / "Health & testing"  
2. **Secondary:** "Learn about our process"  
3. **Tertiary:** "Join interest list" / "Inquire" / "Contact"  
4. **Avoid:** "Buy now," "Available puppies," price CTAs above fold  

### PRD handoff notes

- Minimum page set for **brand-first (Q1)** launch: Home, About, Health & Education, Contact/Interest list — Dogs/Litters gated on inventory  
- Minimum page set for **active program (Q1)** launch: all sections above with populated Dogs + Litters  
- Mobile: phone tap-to-call prominent on Contact (CI pattern #11)  
- SEO: education content targets serious-buyer queries (health tests, ADRK-aligned) — defer to Phase 14  

---

## Decisions (handoff summary)

- **Recommend D2 (trust-first, apply-second)** as Phase 3 strategy — confirmed and refined with Phase 2 evidence  
- **Reject D3, D7**; **defer D6**; **conditional D5 overlay** on D2 when Q1 = brand-first  
- **3D: NO for v1/primary** — revisit only after trust layer ships; real photography + calm design first  
- **Web channel:** primary **credibility/research** surface; primary **growth lever** conditional on Q1/Q4  
- **Site job weights:** Trust 40% / Education 25% / Credibility 20% / Qualify 15%  
- **Do not write `03-strategy.md`** — fragments above ready for CEO merge  

## Asks for manager (`ask_manager`)

- Peer help needed: **none**  
- Clarification needed: **none** for merge — recommend CEO schedule **operator interview** (Q1, Q2, Q6, Q7 + health inventory) before Phase 5 PRD kickoff  

## Risks / blockers (handoff)

- Strategy can lock without operator answers; **launch cannot**  
- W1 (no program evidence) remains binding — D2 succeeds only with operator-supplied content  
- Team memory of v1 3D/apply patterns is a recurring drift risk (R3)  

## Packs used

- `skills/community/business-analysis-skills/skills/strategy-analysis/SKILL.md`  
- `skills/community/business-analysis-skills/skills/value-proposition-analysis/SKILL.md`  
- `skills/org/HANDOFF-TEMPLATE.md`  

## Do not

- Mark the phase complete  
- Write `03-strategy.md` (CEO lease)  
- Write outside write_lease  
- Spawn other positions  
- Invent Blacksage location, prices, health inventory, or litter claims  
