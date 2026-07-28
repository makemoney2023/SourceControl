---
phase: "3"
position: product-marketing-manager
reports_to: ceo-strategist
status: done
verdict_for_manager: ready_to_merge
llm_tier: strong-general
llm_model: composer-2.5-fast
generation_profile: none
generation_used: none
fallback_applied: false
---

# Handoff — Phase 3 Positioning → ceo-strategist

## Goal (from context packet)

Own positioning, ICP, messaging pillars, and proof hierarchy for Blacksage Kennels Phase 3. Verify/refresh `.agents/product-marketing.md` aligned to trust-first (D2) from Phase 2 evidence. Deliver positioning locks and merge-ready strategy inputs for CEO merge into `03-strategy.md` — **do not write 03-strategy.md** (outside lease).

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/blacksage-kennels/business-idea/.agents/product-marketing.md` | Verified complete — no material gaps vs Phase 2. Trust-first D2 lock, ICP + anti-persona, 5 messaging pillars, proof tiers 1–3, conversion/CTA locks, voice bounds, competitive framing, operator dependencies (Q1/Q2/Q5/Q6/Q7), fact/inference/assumption labels. |
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/3-product-marketing-manager.md` | This handoff |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | strong-general |
| llm_model | composer-2.5-fast |
| generation_profile | none |
| generation_used | none |
| fallback_applied | false — no fallback needed |

## Decisions

Positioning locks for CEO merge into `03-strategy.md`:

1. **Trust-first (D2) — site job lock:** Public web channel primary job is **evidence-led trust**, then **qualified inquiry / interest or waitlist**. Education + verifiable health/pedigree signals precede apply. Reopen prior v1 soft lock ("brand + apply equally") — arrival is proof evaluation, not dual CTA.

2. **Reject D3 and D7:** Apply-first funnel (D3) and cosmetic v1 patch (D7) remain explicit anti-patterns. v1 failed holistically (visual, 3D, trust/content, UX/conversion); strategy-led rebuild required.

3. **De-prioritize scroll 3D as primary differentiator:** 0/8 premium competitors use scroll 3D/WebGL. Category prestige = **evidence density**, not visual spectacle. 3D go/no-go stays **reopened** for CEO — any experiential layer must not precede or replace proof sections.

4. **ICP lock:** Primary = serious ADRK-aligned Rottweiler buyer (due-diligence, waitlist-tolerant, 10+ year commitment). Secondary = referrers needing shareable credibility. Anti-persona = impulse shoppers, guard-dog fantasy seekers, price-only comparators, checkout UX expecters.

5. **Messaging pillars (5):**
   - **Pillar 1 — Standards-aligned type/structure** (ADRK/FCI No. 147; no giant/oversize tropes)
   - **Pillar 2 — Temperament within ADRK bounds** (good-natured, devoted, even-tempered, biddable; no guard-dog/machismo)
   - **Pillar 3 — Verifiable health transparency** (OFA/CHIC categories; no "100% healthy" claims)
   - **Pillar 4 — Deliberate placement, not volume** (selective; no fake scarcity/FOMO)
   - **Pillar 5 — Education before sale** (teach before ask; reduces unqualified inquiries)

6. **CTA language lock:**

   | Use | Avoid |
   |-----|-------|
   | Begin your inquiry | Apply now / Get your puppy |
   | Submit inquiry | Buy / Shop / Reserve |
   | Inquiry received | You're in! / Application approved |
   | Interest list / waitlist (when Q1 clarified) | Limited time / Only X left |

   Primary conversion = qualified inquiry **after** trust content. IA norm: Home → About → Dogs → Litters → Health/Education → Contact/Apply.

7. **Proof tier boundaries:**
   - **Tier 1 (safe now):** Breed/standard facts, ADRK temperament language, health test **categories**, process posture (inquiry reviewed individually; no checkout), no pricing/availability until operator policy
   - **Tier 2 (operator-dependent):** Named breeding stock, specific clearances, club affiliations, titles, geography (Q2), program maturity (Q1), photography (Q6), application destination (Q7), natural tail policy, contract/guarantee
   - **Tier 3 (prohibited until verified):** Puppy prices, litter dates/availability, location, specific OFA results without registry link, unsubstantiated superlatives, Blacksage dog/kennel photography when Q6 open

8. **Voice lock:** Confident · Calm · Precise · Evidence-led · Respectful. ADRK-informed temperament language; selectivity as mutual fit, not elitism. Tagline "Power with nobility" de-emphasized until operator confirms — evidence-led credibility over poetic taglines.

### Optional sections for CEO merge into 03-strategy.md

#### Positioning statement (merge-ready)

> For serious Rottweiler buyers who research health, structure, and program integrity before a 10+ year commitment, Blacksage Kennels is a German / ADRK-aligned breeding program whose public presence leads with verifiable evidence and standards-informed education — not spectacle or instant checkout. Unlike volume kennels or visually polished sites without proof, Blacksage earns trust through evidence density and invites qualified inquiry only after the buyer can evaluate the program.

*Label: Inference — kennel-specific proof pending operator Tier 2 facts.*

#### Strategic rejections table (merge-ready)

| Option | Verdict | Rationale |
|--------|---------|-----------|
| D2 Trust-first | **Adopt (lock)** | Phase 2 evidence; buyer journey; v1 failure mode |
| D3 Apply-first | **Reject** | v1 proved apply without trust fails |
| D7 Cosmetic patch | **Reject** | Holistic failure; contradicts restart |
| Scroll 3D primary | **De-prioritize** | 0/8 competitors; no trust ROI alone |
| Publish pricing on site | **Defer** | 0/8 competitors; no Blacksage price data |

#### Operator gates before credible launch (merge-ready)

- Q1 program maturity → waitlist vs. interest-list UX
- Q2 geography/contact → local trust, contact IA
- Q6 photography → trust signal #4
- Q7 application destination → conversion architecture
- Health-test inventory → any parent-specific claims
- Club memberships/titles, natural tail policy → credibility tier

*Launch credibility gated; strategy drafting not blocked.*

## Asks for manager (`ask_manager`)

- Peer help needed: **none**
- Clarification needed: **none** for PMM scope — operator Q1/Q2/Q5/Q6/Q7 remain open for CEO/operator interview; PMM has locked D2 default for Q5 pending operator override

## Risks / blockers

- **Operator fact gap:** Without Q1/Q2/Q6/Q7 and health inventory, Tier 2 proof claims cannot appear on site — honest "coming soon" posture may be required if program is brand-first (Q1).
- **Tagline drift:** Prior stub/v1 used "Power with nobility" — Phase 3 PMM de-emphasizes poetic taglines in favor of evidence-led positioning; CEO should confirm in brand phase (11).
- **3D pressure:** v1 soft lock may resurface in design phases — strategy must subordinate experiential layers to trust requirements.
- **Geography assumption:** US-facing ICP assumed until Q2 answered — may affect health registry emphasis (OFA/CHIC vs. ADRK-only narrative).

## Packs used

- `skills/org/positions/product-marketing-manager/SKILL.md`
- `skills/org/HANDOFF-TEMPLATE.md`
- `skills/community/marketingskills/product-marketing/SKILL.md`

## Do not

- Mark the phase complete (orchestrator + C-suite gate)
- Write outside write_lease (`03-strategy.md` is CEO lease)
- Spawn other positions
- Invent Blacksage location, prices, health inventory, or litter availability
