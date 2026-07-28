---
phase: "4"
position: product-marketing-manager
reports_to: cfo
status: done
verdict_for_manager: ready_to_merge
llm_tier: strong-general
llm_model: composer-2.5-fast
generation_profile: none
generation_used: none
fallback_applied: false
---

# Handoff — Phase 4 Pricing Posture & Packaging → cfo

## Goal (from context packet)

Define **pricing posture and packaging** (not dollar prices) for Blacksage Kennels Phase 4 business model work. Align waitlist vs. pet-home placement packaging to Phase 3 D2 trust-first strategy. Provide merge-ready language for `04-business-model.md` without inventing Blacksage litter/puppy prices or deposit amounts as firm kennel policy.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/4-product-marketing-manager.md` | This handoff — pricing posture, packaging map, value metric, deposit framing, anti-patterns, CFO merge recommendations |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | strong-general |
| llm_model | composer-2.5-fast |
| generation_profile | none |
| generation_used | none |
| fallback_applied | false — no fallback needed |

---

## 1. Pricing posture

### Core lock: discuss-after-qualification

Blacksage adopts the **category norm** for premium ethical Rottweiler breeders: **puppy price is not a marketing lever on the public site**. Phase 2 CI confirms **0/8 premium competitors publish puppy prices on site** (**Fact**). Price is shared **after** the buyer has evaluated program credibility and **after** mutual-fit qualification — not at discovery, not above the fold, not as a conversion hook.

| Dimension | Posture | Label |
|-----------|---------|-------|
| On-site pricing | **None** — no puppy price, no deposit amount, no "starting at $X" | **Decision** (D2 + A10) |
| Price discovery channel | Private conversation (phone/email) after inquiry review | **Inference** (category norm) |
| When price is shared | After trust content consumed + inquiry/application reviewed + breeder confirms fit | **Decision** |
| What site may say | Process framing only: "Pricing discussed after qualification" or "Investment discussed individually" | **Decision** |
| Category context (not Blacksage policy) | Mainstream ethical Rottweiler band ~$1,500–$2,500; premium/import-adjacent $3k–$7k+ | **Fact** (Insurify, King Rottweilers via evidence base) |

### When and how price is shared (sequencing)

```
DISCOVER → SHORTLIST → VERIFY (site) → INQUIRE → QUALIFY → PRICE DISCUSS → DEPOSIT (if waitlisted) → PLACEMENT
                              ↑                              ↑              ↑
                        Web job ends well              Off-site         Off-site
```

| Stage | Pricing action | Channel |
|-------|----------------|---------|
| Site visit | **No price** | Owned web |
| Inquiry submitted | Acknowledge receipt; no price in auto-reply unless operator policy adds it | Email/form |
| Qualification conversation | Breeder shares **price band or specific placement price** when fit is plausible | Phone/email |
| Waitlist acceptance | Deposit terms explained **with** placement price context | Phone/email + written agreement |
| Contract | Full placement price, payment schedule, deposit credit terms | Signed contract |

**Rationale:** Serious buyers research health and pedigree before price (**Fact** — Canine Chasm, AMRRC). Price-first contact is an anti-persona signal (impulse shopper, price-only comparator). Trust-first (D2) requires price to follow proof, not precede it.

### Pricing posture language (merge-ready for 04-business-model.md)

> **Pricing posture:** Blacksage does not publish puppy prices or deposit amounts on the public website. Pricing is discussed individually after inquiry review and mutual-fit qualification — consistent with premium ethical breeder category norms (0/8 competitors publish on-site prices). Category context for financial modeling only: mainstream ethical Rottweiler placements commonly fall in ~$1,500–$2,500; premium/import-adjacent programs may reach $3k–$7k+. **Blacksage-specific price band is an operator decision — not documented.**

---

## 2. Packaging map

Three distinct packages map to buyer journey stage and Q1 program maturity. These are **offer structures**, not SKUs with published prices.

### Package A — Brand-first interest list *(if Q1 = pre-litter / coming-soon)*

| Element | Detail |
|---------|--------|
| **Name** | Interest list / program updates |
| **What buyer gets** | Periodic program updates (when operator opts in); education access on site; early notification when breeding program activates | 
| **What kennel asks** | Name, email, brief interest statement; optional experience/ownership history | 
| **Payment timing** | **None** — no deposit at interest-list stage | 
| **Site CTA** | "Join the interest list" / "Stay informed" — **not** waitlist or reserve | 
| **Upgrade path** | When Q1 moves to active program → invite qualified interest-list contacts to formal waitlist process | 
| **Label** | **Inference** — D5 overlay per Phase 3 when Q1 = brand-first |

### Package B — Active program waitlist *(if Q1 = active litters / breeding program)*

| Element | Detail |
|---------|--------|
| **Name** | Waitlist / approved placement queue |
| **What buyer gets** | Consideration for a future puppy placement when litter timing aligns; transparency on process, timeline expectations (category: 6–12+ months common — **Fact**), contract review opportunity before deposit | 
| **What kennel asks** | Full application (household, experience, goals, references as operator defines); qualification interview; contract review | 
| **Payment timing** | **Deposit after trust + qualification** — not at first contact, not on website checkout | 
| **Site CTA** | "Begin your inquiry" → application/waitlist interest — per CTA language locks | 
| **Deposit framing** | Explained in qualification conversation; amount is **operator policy (open)** | 
| **Label** | **Inference** — contingent on Q1 = active |

### Package C — Qualified pet-home placement *(the actual sale/offer)*

| Element | Detail |
|---------|--------|
| **Name** | Pet-home puppy placement |
| **What buyer gets** | Single selectively placed Rottweiler puppy from ADRK-aligned breeding program; health documentation per operator inventory; socialization period per operator practice; contract/guarantee terms when operator provides | 
| **What kennel asks** | Signed purchase agreement; remaining balance per payment schedule; pickup/transport compliance; ongoing communication agreement | 
| **Payment timing** | Deposit (if waitlisted) **credited toward** placement price at contract signing; balance due per contract (common category patterns: deposit at waitlist acceptance, balance before or at pickup — **Assumption** for Blacksage until operator sets) | 
| **Site visibility** | Process description only — **never** shopping cart, instant reserve, or price display | 
| **Label** | **Fact** (core service) + **operator-dependent** (specific terms) |

### Packaging decision tree (Q1-dependent)

```
Q1 answer?
├── Pre-litter / brand-first → Package A (Interest list) only on site
│                              Packages B/C described in process copy as "future program"
└── Active breeding program  → Package A optional (updates)
                               Package B primary conversion path
                               Package C = outcome of B after qualification
```

**Do not collapse packages:** Interest list ≠ waitlist ≠ placement. Each has distinct buyer commitment, kennel obligation, and payment timing.

---

## 3. Value metric

### Primary value metric: approved home fit (selective placement)

Blacksage does **not** price on volume, litter count, checkout conversion, or lead volume. The value metric that aligns price with delivered value in this category:

| Metric | Definition | Why it fits |
|--------|------------|-------------|
| **Approved home fit** | One selectively matched puppy placement to a qualified, prepared pet home | Category ethical breeders optimize placement quality, not throughput (**Inference**) |
| **NOT the metric** | Puppies sold per year, cart checkouts, form submissions, page views | Volume metrics attract wrong buyers and misalign with D2/D4 pillar "deliberate placement" |

### Value equation — placement offer anatomy

Applied to Package C (qualified pet-home placement). No invented dollar amounts.

```
              Dream Outcome  ×  Perceived Likelihood of Achievement
  Value  =  ─────────────────────────────────────────────────────────
              Time Delay     ×   Effort & Sacrifice
```

| Lever | Placement offer design | Blacksage posture |
|-------|------------------------|-----------------|
| **Dream outcome ↑** | A structurally sound, temperament-stable, health-informed ADRK-aligned companion for 10+ years — matched to buyer's household and goals | Lead with standards-aligned type, temperament bounds, health transparency (Pillars 1–3) |
| **Perceived likelihood ↑** | Verifiable OFA/CHIC links, named breeding stock, published process, contract/guarantee, breeder accessibility | Proof tiers 1–2; no claims without operator data |
| **Time delay ↓** | Clear process timeline; responsive inquiry handling; honest waitlist expectations | Document SLA (Q7); no fake "available now" |
| **Effort & sacrifice ↓** | Education hub reduces buyer research burden; guided application; transparent steps from inquiry to placement | Education before sale (Pillar 5); structured application — not a maze |

### Complete offer anatomy (Package C — six components)

| # | Component | Blacksage design |
|---|-----------|------------------|
| 1 | **Core deliverable** | Selectively placed ADRK-aligned Rottweiler puppy with health documentation per operator inventory |
| 2 | **Bonus stack** | Not "inflated bonuses." Value-adds that are **real in category**: early socialization description, health test transparency, lifetime breeder support posture, educational resources, contract clarity — only when operator confirms |
| 3 | **Guarantee** | Contract/guarantee/return policy text when operator provides — **Tier 2**. No "100% healthy" or outcome guarantees |
| 4 | **Scarcity / urgency** | **Real only:** selective breeding = naturally limited placements. Frame as **selectivity and care**, not FOMO. No countdown timers, no "only X spots left" unless factually true and operator-approved |
| 5 | **Name** | "Pet-home placement" / "puppy placement" — avoid "Buy a puppy," "Reserve now," "Get your Rottweiler" |
| 6 | **Price + payment** | Discussed after qualification; deposit credited to placement per operator policy; full terms in signed contract |

---

## 4. Deposit / waitlist offer framing

### Category context (not Blacksage policy)

| Element | Category norm | Label |
|---------|---------------|-------|
| Waitlist deposit | ~$500 common among premium competitors (e.g., Dreibergen published waitlist policy) | **Fact** (CI handoff) |
| Timing | Deposit **after** trust established and application reviewed — not at first click | **Fact** (buyer journey) |
| Applied to purchase | Deposit typically **credited toward** final placement price | **Inference** (category pattern) |
| Refundability | Varies by breeder; often **non-refundable** if buyer withdraws after acceptance, with exceptions for breeder-side cancellation | **Assumption** — operator must set Blacksage policy |
| Waitlist duration | 6–12+ months common | **Fact** (Canine Chasm) |

### Trust-first sequencing for deposit offer

Deposit is **not** a web conversion action. Sequence:

1. Buyer consumes trust content on site (Dogs, Health/Education, About)
2. Buyer submits inquiry ("Begin your inquiry")
3. Breeder reviews application / conducts qualification conversation
4. Breeder explains waitlist process, timeline, and **deposit terms in writing**
5. Buyer reviews purchase agreement / waitlist agreement
6. **Then** deposit collected — off-site (check, Zelle, etc.) per operator preference

**Site may describe:** "A waitlist deposit may be required after application approval. Terms are provided individually."  
**Site must not state:** A specific deposit dollar amount until operator sets policy.

### Deposit offer framing language (merge-ready)

> **Waitlist deposit posture:** Following category norms, a waitlist deposit (~$500 among premium competitors — **category context, not Blacksage amount**) is typically collected **after** inquiry qualification and contract review, not at website signup. Deposit is generally applied toward the placement price at contract execution. Refund and forfeiture terms are **operator-defined** and must appear in written agreement before any payment. The website does not collect deposits or display deposit amounts.

### Open operator decisions (deposit)

| Decision | Options | CFO/operator owner |
|----------|---------|-------------------|
| Deposit amount | Operator sets; PMM recommends not publishing on site | Operator |
| Refund policy | Full/partial/non-refundable scenarios | Operator + legal |
| Payment methods | Check, Zelle, etc. — no cart on site | Operator |
| Waitlist position rules | How priority is determined | Operator |
| Deposit timing | After application approval vs. after phone screen | Operator |

---

## 5. Anti-patterns

Explicit violations of D2 trust-first and category evidence. **Do not** include in site, copy, or business model.

| Anti-pattern | Why it fails | Phase lock |
|--------------|--------------|------------|
| **Price-forward site** — puppy prices, "starting at $X," price CTAs above fold | 0/8 competitors publish; attracts price-shoppers and impulse buyers; inverts trust journey | A10, SD5, Tier 3 |
| **Invented "starting at $X"** — any Blacksage dollar figure without operator policy | Non-negotiable violation; destroys credibility if wrong | Tier 3 prohibited |
| **FOMO scarcity** — "Only 2 puppies left," countdown timers, "Act now" | Fake or manipulative scarcity erodes trust; Pillar 4 rejects | SD8, Pillar 4 |
| **Shopping cart / instant reserve** — e-commerce checkout for puppies | Category red flag #11; v1 apply-first failure mode | D3 rejected, v1 anti-pattern |
| **Deposit at signup** — pay-to-join waitlist on website | Payment before qualification; trust inversion | D2 violation |
| **Apply-first without proof** — application CTA before Dogs/Health sections | v1 failure; D3 rejected | SD3, SD6 |
| **"Reserve your puppy" / "Buy now" CTAs** | Checkout language; wrong buyer signal | CTA locks |
| **Bonus inflation** — "$5,000 value stack" on placement | Pattern-matches course-bro/scam; wrong category tone | Offers skill banned vocabulary |
| **Price as hero differentiator** — competing on lowest price | Anti-persona attractor; incompatible with selective placement | ICP anti-persona |
| **Publishing deposit amount without operator lock** | Same as invented pricing | Tier 3 |

---

## 6. Recommendation to CFO

### Merge-ready blocks for `04-business-model.md`

#### A. Revenue model summary

> Blacksage revenue comes from **selective pet-home puppy placements**, not volume throughput or e-commerce checkout. The public website is a **credibility and qualification surface** — not a storefront. Pricing and deposit terms are **off-site, post-qualification** decisions consistent with premium ethical breeder category norms.

#### B. Pricing posture (paste-ready)

> - **No on-site puppy prices or deposit amounts** (category Fact: 0/8 competitors publish)
> - **Price discussed after inquiry qualification** (phone/email)
> - **Category price bands for modeling only:** ~$1,500–$2,500 mainstream ethical; $3k–$7k+ premium/import-adjacent — **not Blacksage policy**
> - **Blacksage-specific price band: operator decision — undocumented**

#### C. Packaging summary (paste-ready)

| Package | Trigger | Buyer commitment | Payment |
|---------|---------|------------------|---------|
| Interest list | Q1 = pre-litter | Email + brief interest | None |
| Waitlist | Q1 = active + qualified inquiry | Full application + interview | Deposit after approval (operator amount) |
| Placement | Waitlist match + contract | Signed agreement | Deposit credited + balance per contract |

#### D. Value metric (paste-ready)

> **Value metric:** Approved home fit per selective placement — not puppies sold, not form volume, not checkout conversion.

#### E. Monetization sequencing (paste-ready)

> Trust content → inquiry → qualification → price discussion → deposit (if waitlisted) → contract → placement payment. Website does not process payments.

### Open operator decisions for CFO to flag in 04-business-model.md

| ID | Decision | Impact on business model | Blocks |
|----|----------|--------------------------|--------|
| **OP-P1** | Blacksage placement price band | Revenue projections, break-even | Financial model |
| **OP-P2** | Deposit amount and refund policy | Cash flow timing, liability | Contract template |
| **OP-P3** | Payment schedule (deposit + balance timing) | Working capital | Contract template |
| **OP-P4** | Q1 program maturity | Which package(s) are live on site | Packaging |
| **OP-P5** | Litters per year / placements per year | Capacity model | Operator input |
| **OP-P6** | Contract/guarantee terms | Offer completeness | Legal + operator |

**PMM recommendation:** CFO should treat category price bands as **external benchmarks** in financial scenarios (low/base/high) while clearly labeling Blacksage-specific assumptions as **operator-dependent**. Do not propagate invented prices into projections.

### Conflicts / alignment notes

- **Aligned with Phase 3:** D2 trust-first, SD5 content honesty, A10 no on-site prices, CTA language locks, Pillar 4 deliberate placement
- **Q1 gates packaging:** Interest list vs. waitlist is not a pricing decision but a **packaging availability** decision — CFO should cross-reference Q1 before locking revenue timing assumptions
- **No conflict with CFO scope:** PMM delivers posture/packaging only; unit economics and break-even remain CFO-owned with operator price inputs

---

## Decisions

1. **Pricing posture lock:** No on-site prices or deposit amounts. Discuss-after-qualification via off-site conversation. Category bands labeled Fact/Assumption; Blacksage prices operator-dependent.

2. **Three-package map:** Interest list (Q1 pre-litter) → Waitlist (Q1 active, post-qualification) → Placement (contracted sale). Do not collapse or conflate.

3. **Value metric lock:** Approved home fit / selective placement — explicitly not volume or checkout.

4. **Deposit sequencing lock:** Deposit after trust + qualification + contract review — never at website signup or above-fold CTA.

5. **Anti-pattern list:** Price-forward site, FOMO, shopping cart, invented prices, apply-first, deposit-at-signup — all prohibited.

6. **CTA/packaging language:** Preserve Phase 3 locks — "Begin your inquiry," "Interest list" vs. "Waitlist" per Q1, avoid Buy/Reserve/Shop.

---

## Asks for manager (`ask_manager`)

- Peer help needed: **none**
- Clarification needed: **Q1** (program maturity) determines which packaging tier is live — CFO should confirm operator timeline before locking revenue recognition assumptions in 04-business-model.md

---

## Risks / blockers

| Risk | Mitigation |
|------|------------|
| CFO or downstream phases invent Blacksage prices for modeling convenience | Label all Blacksage $ as operator assumption; use category bands as scenario inputs only |
| Q1 unresolved → wrong packaging on site | Conditional copy in PRD; interest-list default if pre-litter |
| Operator wants price on site for "transparency" | Category evidence (0/8) + anti-persona risk — escalate to CMO/CEO if override requested |
| Deposit policy undefined → buyer confusion post-inquiry | Operator must set before launch; site describes process, not amount |

---

## Packs used

- `skills/community/marketingskills/pricing/SKILL.md` — value metric, packaging tiers, value-based pricing framing
- `skills/community/marketingskills/offers/SKILL.md` — value equation, offer anatomy, anti-manipulation scarcity guidance
- `docs/projects/blacksage-kennels/business-idea/.agents/product-marketing.md` — CTA locks, proof tiers, ICP, positioning
- `docs/projects/blacksage-kennels/business-idea/03-strategy.md` — D2 lock, SD5, A10, IA/CTA hierarchy
- `docs/projects/blacksage-kennels/business-idea/02-evidence-base.md` — category price bands, 0/8 pricing transparency, waitlist/deposit norms

---

## Do not

- Mark Phase 4 complete (CFO + orchestrator gate)
- Write or rewrite `04-business-model.md` (CFO merge)
- Invent Blacksage puppy prices, deposit amounts, or litter availability
- Spawn other positions
- Publish price CTAs or shopping-cart UX in any downstream copy brief
