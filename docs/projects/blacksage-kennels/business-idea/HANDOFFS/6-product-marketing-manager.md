---
phase: "6"
position: product-marketing-manager
reports_to: cmo
status: done
verdict_for_manager: ready_to_merge
llm_tier: strong-general
llm_model: composer-2.5-fast
generation_profile: none
generation_used: none
fallback_applied: false
---

# Handoff — Phase 6 GTM Messaging → cmo

## Goal (from context packet)

Produce GTM launch narrative + ICP channel fit for trust-first kennel. Content goes in this handoff for CMO merge into `06-gtm-plan.md`. Align Interest → Waitlist → Placement; organic-first; no FOMO puppy ads; no price-led acquisition.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/6-product-marketing-manager.md` | This handoff — merge-ready GTM craft sections for CMO |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | strong-general |
| llm_model | composer-2.5-fast |
| generation_profile | none |
| generation_used | none |
| fallback_applied | false — no fallback needed |

## Decisions

1. **GTM posture:** Organic/trust-first only. Owned web is primary growth surface; rented channels are secondary and capped at 1–2 platforms max. Paid acquisition **skipped** unless operator funds explicitly (Phase 19 deferred).
2. **Launch story:** One narrative arc across Tier 0→1→2 — Blacksage introduces itself as an ADRK-aligned program building credibility through evidence density, never inventing program facts.
3. **Conversion path:** Package A (Interest) → Package B (Waitlist) → Package C (Placement) maps to PRD staged launch; site never collects payment or shows prices.
4. **CTA locks preserved:** Begin your inquiry / Interest list / waitlist — no Apply now, Buy, Shop, Reserve, FOMO scarcity, or price-led ads.
5. **Success = quality over volume:** Qualified inquiries, referrer shareability, and inquiry fit — not traffic or form volume.

## Asks for manager (`ask_manager`)

- Peer help needed: `public-relations-manager` for borrowed-channel detail (club/show/referrer outreach playbook) | **recommended for 06-gtm-plan.md merge**
- Clarification needed: **Q1** (program maturity) determines Tier 1 vs Tier 2 launch messaging and Package A vs B live UX — GTM craft is tier-agnostic but CMO should flag operator dependency at merge | none blocking PMM craft

## Risks / blockers

| Risk | Mitigation |
|------|------------|
| Operator facts delayed (Q1, Q6, health inventory) | Tier 1 brand-first launch with honest coming-soon; no invented dogs/litters |
| Revert to FOMO puppy ads or price-forward social | Explicit anti-patterns in messaging section; CMO gate |
| Hollow launch before photography | Staged Tier 1; GTM does not promise dogs/litters until operator confirms |
| Referrer silence if site still hollow | M5 heuristic — do not promote URL until referrer sniff test passes |
| Scope creep to paid ads | Paid SKIPPED in base GTM; Phase 19 deferred |

## Packs used

- `skills/community/marketingskills/product-marketing/`
- `skills/community/marketingskills/launch/`

## Do not

- Mark the phase complete
- Write outside write_lease
- Spawn other positions
- Write `06-gtm-plan.md` (CMO lease)
- Write manager brief

---

# Merge-ready craft — CMO → `06-gtm-plan.md`

*Source inputs: `05-prd.md`, `03-strategy.md`, `04-business-model.md`, `.agents/product-marketing.md`, `02-market-research.md`. All Blacksage-specific program facts remain operator-dependent — this GTM craft uses Tier 1 safe claims and honest posture only.*

---

## 1. Launch narrative (Tier 0 → Tier 1 → Tier 2)

### One story, three stages

Blacksage Kennels enters the market with a single coherent story: **a German / ADRK-aligned Rottweiler breeding program whose public presence earns trust through verifiable evidence and standards-informed education — then invites qualified inquiry.** Prestige in this category is **evidence density**, not spectacle, scarcity theater, or price competition.

The narrative does not change between tiers — only **what we can show** changes. We never invent dogs, litters, geography, titles, health results, or prices.

### Tier 0 — Staging (internal only)

| Element | Narrative posture |
|---------|-------------------|
| **Audience** | Operator, build team, QA — not public |
| **Story** | "We are building a credibility surface that serious buyers and referrers can trust." |
| **Message** | Internal alignment on D2 trust-first: proof before inquiry, no v1 anti-patterns |
| **What we say** | Nothing public. Tier 1 copy only in staging; lorem explicitly marked non-production |
| **What we do NOT say** | Any Tier 2 claim (named dogs, litters, location, titles) until operator sign-off |

**GTM role at Tier 0:** PMM + CMO validate messaging against proof tiers; referrer sniff test planned; no borrowed/rented promotion.

### Tier 1 — Brand-first (Q1 = pre-litter / coming-soon)

| Element | Narrative posture |
|---------|-------------------|
| **Audience** | Serious ADRK-aligned buyers in research mode; referrers evaluating shareability |
| **Story** | "Blacksage Kennels is an ADRK-aligned Rottweiler program building toward selective placements. Today you can evaluate our standards commitment, health-testing philosophy, and placement approach — and join our interest list if alignment fits." |
| **Hero message** | Program identity + proof pathway — **not** availability, pricing, or apply-first urgency |
| **Proof available** | Tier 1 only: breed/standard facts, ADRK temperament bounds, health test **categories**, education, honest program-in-development posture |
| **Conversion** | Package A — **Interest list** ("Join our interest list" / "Begin your inquiry" for general contact) |
| **Honest gaps** | Dogs section: "Breeding stock profiles coming soon" — not fake profiles. Litters omitted or explicit coming-soon. No geography until Q2. |

**How Blacksage introduces itself (Tier 1 sample framing — not final copy):**

> Blacksage Kennels breeds German / ADRK-aligned Rottweilers toward FCI Standard No. 147 — correct structure, natural tail, and temperament within ADRK bounds: good-natured, devoted, biddable, even-tempered. We believe serious buyers deserve evidence before inquiry. Explore our health and education resources, learn our placement philosophy, and — when ready — begin your inquiry or join our interest list.

**What we do NOT do at Tier 1:**

- Imply active litters, available puppies, or waitlist slots without Q1 confirmation
- Use FOMO ("limited spots," countdown timers, "only X left")
- Publish prices, deposits, or "starting at" language
- Lead with apply/reserve/buy CTAs
- Use stock or AI dog photos as program proof

### Tier 2 — Active program (Q1 = active breeding + operator inventory)

| Element | Narrative posture |
|---------|-------------------|
| **Audience** | Same primary ICP — now with named-stock verification need; referrers sending qualified clients |
| **Story** | "Blacksage Kennels is an ADRK-aligned program you can verify on-site — named breeding stock, linked health clearances when available, education, and a deliberate placement process. Inquiry is the next step after you've evaluated the program." |
| **Hero message** | Evidence summary → Dogs → Health — inquiry is tertiary |
| **Proof available** | Tier 1 + Tier 2 (operator-verified): named dogs, photos, per-dog registry links, litters when confirmed, operator identity, geography when Q2 closed |
| **Conversion** | Package A (Interest) and/or Package B (Waitlist inquiry) per operator policy; Package C described in process copy only |
| **Deposit framing** | "A waitlist deposit may be required after approval. Terms provided individually." — **no dollar amount on any surface** |

**How Blacksage introduces itself (Tier 2 sample framing — not final copy):**

> Blacksage Kennels is a selective ADRK-aligned Rottweiler program. Review our breeding stock, health clearances, and educational resources — then begin your inquiry when you're ready to discuss fit. Placements are mutual; inquiry is not a reservation.

**Tier promotion narrative (operator-facing, not public ad copy):**

```
Tier 0 (staging) → validate trust bar internally
Tier 1 (brand-first) → earn referrer shareability + interest list
Tier 2 (active program) → enable full due-diligence + waitlist inquiry
```

**Rule:** Tier determines **content population**, not **quality bar** or **messaging ethics**. Both public tiers use the same trust-first voice, CTA locks, and anti-patterns.

---

## 2. ICP × channel fit matrix

### Primary ICP — Serious ADRK-aligned buyer

**Who:** Research-heavy buyer seeking German/ADRK-aligned temperament and structure — 10+ year commitment; accepts waitlists.

**Core job:** Evaluate breeder credibility **before** contact.

**Sub-segments:**

| Sub-segment | Discovery behavior | Channel fit | Message emphasis | Do NOT |
|-------------|-------------------|-------------|------------------|--------|
| **Family companion** | Google ("ADRK Rottweiler breeder," "health tested Rottweiler"), ARC/club referral lists, Facebook breed groups (lurking, not impulse posting) | **Owned:** Site SEO (Health/Education, breed standard literacy). **Borrowed:** Trainer/club referral → site URL. **Rented (optional 1):** Facebook — education posts linking to site, not puppy availability ads | Socialization evidence, temperament within ADRK bounds, household fit screening, education before sale | Guard-dog tropes; "family protection dog"; price in first touch; available-now puppy posts |
| **Sport/working prospect** | Show/working community, pedigree databases, OFA lookups, sport club networks | **Owned:** Dogs pages with titles/working proof when verified; Health/Education on BH/ZTP concepts. **Borrowed:** Working/sport referrers, club directories. **Rented (optional 1):** Instagram — training/working lifestyle imagery **only with real operator media** | Drive, structure, working heritage within standard; breeder match to activity level | Machismo; aggression marketing; unverified title claims |
| **Import/pedigree-focused** | Pedigree forums, European line research, natural tail advocacy, skeptical of "German lines" without proof | **Owned:** Dogs + pedigree transparency when operator provides; natural tail / FCI type education. **Borrowed:** ADRK-world-community referrers. **Rented:** Low priority — this segment distrusts social hype | Verifiable pedigrees, ADRK alignment narrative, natural tail policy when confirmed | "Rare bloodline" superlatives; unlinked OFA claims; docked-tail inconsistency without explanation |

**Primary ICP — channel summary:**

| Channel type | Fit | Role |
|--------------|-----|------|
| **Owned — website** | ★★★★★ Primary | Shortlist + verify; all paths lead here |
| **Owned — interest/inquiry email** | ★★★★★ Primary | Post-verification conversion; nurture for Tier 1 |
| **Borrowed — referrers (trainers, clubs, prior owners)** | ★★★★☆ High | Discovery shortcut; requires shareable URL (M5) |
| **Borrowed — club directories / ARC-adjacent lists** | ★★★☆☆ Medium | Credibility listing when operator membership verified |
| **Rented — Facebook** | ★★★☆☆ Medium (max 1 platform) | Education + program updates → link to site; not primary proof |
| **Rented — Instagram** | ★★☆☆☆ Low–Medium | Real dog media only (Q6); lifestyle/training context |
| **Rented — Google Ads / paid social** | ✗ Skipped | Phase 19 deferred; price-led acquisition anti-pattern |
| **Rented — puppy marketplaces (Lancaster, etc.)** | ✗ Avoid | Category red flag; price-forward; anti-persona magnet |

---

### Secondary ICP — Referrer

**Who:** Trainers, prior owners, breed club members, show/working contacts.

**Job:** Recommend a kennel **without reputational risk**.

| Channel type | Fit | Role | Message for referrer | Do NOT |
|--------------|-----|------|---------------------|--------|
| **Owned — website URL** | ★★★★★ | Single shareable proof asset | "Send clients here to evaluate health, standards, and process before inquiry" | Share URL before M5 sniff test passes |
| **Owned — printable program summary** | ★★★☆☆ (post-v1) | Leave-behind for trainers | Evidence-dense one-pager when operator facts exist | One-pager with invented claims |
| **Borrowed — direct referral relationship** | ★★★★★ | Primary referrer motion | Professional tone; verifiable health story | Ask referrers to vouch for unverified claims |
| **Borrowed — club/show presence** | ★★★☆☆ | PR-owned detail | Operator-led; PMM provides proof talking points only | PMM inventing show/club calendar |
| **Rented — referrer's social** | ★★★☆☆ | Referrer shares link organically | Site must stand alone without referrer apology | Paid influencer puppy posts |

**Referrer enablement message (internal/talking points — not public ad):**

> Blacksage's site is built for your clients to do due diligence — health categories, standards education, named stock when available, and a clear inquiry path. You can share the URL without caveats about hollow marketing.

---

### Anti-persona — Design to repel

| Anti-persona | Where they discover kennels | Why channel misfires | GTM filter |
|--------------|----------------------------|----------------------|------------|
| **Impulse puppy shopper** | Puppy marketplace ads, "available now" SEO, Instagram puppy reels | Paid availability ads attract them | No FOMO ads; no marketplace listings; education + selective tone |
| **Guard-dog fantasy seeker** | Aggressive marketing sites, protection-dog SEO, machismo social | Guard-dog copy attracts liability | ADRK temperament bounds in all messaging; no protection/weapon language |
| **Price-only comparator** | Price-comparison searches, "how much Rottweiler puppy" ads | Price-led ads and on-site prices attract them | No prices anywhere; no price-led paid; inquiry asks *why*, not *how much* |
| **Checkout UX expecter** | E-commerce puppy sites, reserve-now UX | Cart/reserve CTAs attract them | No Buy/Shop/Reserve; consent copy: "inquiry is not a reservation" |

**Anti-persona channel rule:** If a channel requires price, scarcity, or instant availability to perform — **do not use it**.

---

## 3. Demand path — Discover → Shortlist → Verify → Inquire → Package A / B / C

### Buyer journey (market + PRD aligned)

```
DISCOVER → SHORTLIST → VERIFY (on-site) → BEGIN YOUR INQUIRY → QUALIFY (off-site) → PACKAGE A / B / C
                              ↑
                    Site GTM job completes here well
```

### Stage-by-stage demand path

| Stage | Buyer action | Blacksage surface | GTM / packaging |
|-------|--------------|-------------------|-----------------|
| **1. Discover** | Google search, club referral, trainer recommendation, social link | **Borrowed/rented** → **Owned site** | Organic SEO (Health/Education); referrer URL share; 1 rented platform max posts → site |
| **2. Shortlist** | Opens 3–8 breeder sites; 3–8 second scan | **Home** — program identity + proof pathway | Hero = standards + evidence path, not apply. CTAs: View our dogs, Health & testing |
| **3. Verify** | Reads Dogs, Health/Education, About; OFA lookup if links exist | **Dogs → Health/Education → About** | Tier 1: categories + education. Tier 2: named stock + registry links. No apply dominance |
| **4. Inquire** | Submits form after proof review | **Contact/Inquire** — "Begin your inquiry" | Form destination Q7; success sets expectations |
| **5. Qualify** | Phone/email conversation with operator | **Off-site** — operator-owned | Not GTM scope; site copy sets expectation of review |
| **6. Package match** | Operator assigns package based on Q1 + fit | **Off-site process** | See packaging map below |

### Packaging map (PRD A / B / C → GTM)

| Package | Trigger (Q1) | Site UX / CTA | GTM messaging | Payment |
|---------|--------------|---------------|---------------|---------|
| **A — Interest list** | Pre-litter / brand-first (Tier 1) | "Join our interest list" + short capture form | "Program in development — join interest list for updates when breeding stock and litters are announced." Honest coming-soon. | None |
| **B — Waitlist** | Active program (Tier 2) + operator policy | "Begin your inquiry" → full waitlist application fields | "Submit inquiry for waitlist consideration. Placements are selective; deposit discussed after approval." | None on site; deposit off-site after approval only |
| **C — Placement** | Waitlist match + contract | Process described in Health/Education or About — **no form CTA** | "Matched placements follow contract and individual terms." Never marketed as product SKU. | Off-site per operator contract |

### Demand path — Tier 1 vs Tier 2

**Tier 1 path:**

```
Referrer/Google → Home → Health/Education → About → Interest list (Package A)
                              ↓
                    Dogs: honest empty state (no fake proof)
```

**Tier 2 path:**

```
Referrer/Google → Home → Dogs → Health/Education → About → Begin your inquiry (Package A or B)
                              ↓
                    OFA/registry links when verified
                              ↓
                    Operator qualifies → Package B waitlist or Package C placement (off-site)
```

### Monetization sequencing (GTM must mirror — no inversion)

```
Trust content → Inquiry → Qualification → Price discussion (off-site) → Deposit (if waitlisted, off-site) → Placement
```

**GTM rule:** Never advertise price, deposit amount, or availability ahead of trust content. Never collect payment on site.

---

## 4. Launch outline — PMM view (ORB framework)

### Channel strategy summary

| Type | Priority | Status |
|------|----------|--------|
| **Owned** | Primary | Site + inquiry/interest email |
| **Rented** | Secondary | 1–2 platforms max, if operator capacity |
| **Borrowed** | Supporting | Referrers/clubs — PR owns detail |
| **Paid** | **SKIPPED** | Phase 19 deferred unless operator funds |

Everything rented or borrowed **funnels to owned** — never substitute platform presence for site proof.

---

### Pre-launch (Tier 0 — staging)

| Action | Owner | PMM input |
|--------|-------|-----------|
| Messaging QA against proof tiers 1–3 | PMM + CMO | This handoff |
| Referrer sniff test planned (M5) | Operator + CMO | "Would a trainer share this URL without caveat?" |
| Inquiry destination configured (Q7) | Operator + CTO | No public launch without form routing |
| SEO baseline: page titles, meta, sitemap for trust pages | SEO seat (Phase 6+) | Health/Education indexable |
| Launch tier selected (Q1 + Q6 + health inventory) | Operator + head-of-product | Tier 1 default if Q1 pre-litter |
| **No public promotion** | — | Zero rented/borrowed until LG1–LG4 gates pass |

**Pre-launch exit criteria (GTM-relevant):**

- [ ] Tier 1 or Tier 2 content populated per PRD — no Tier 3 violations
- [ ] CTA language locked: Begin your inquiry / Interest list
- [ ] Referrer willing to share URL (M5) OR explicit Tier 1 honest posture accepted
- [ ] Q7 form destination live

---

### Tier 1 launch — Brand-first moments

| Moment | Channel | Action |
|--------|---------|--------|
| **Soft launch** | Owned | Site live: Home, About, Health/Education, Contact/Interest list |
| **Interest list opening** | Owned email | Welcome sequence: what interest list means (not a reservation); what to expect; link to Health/Education |
| **Referrer outreach** | Borrowed | Operator/referrer network: "Site is live for client evaluation" — **PR detail** |
| **First education post** | Rented (optional) | One platform: link to Health/Education article — e.g., "What health tests matter for Rottweilers" → site |
| **Club/directory listing** | Borrowed | When membership verified — PR |

**Tier 1 — do NOT launch with:**

- Puppy availability posts
- Paid ads
- FOMO language
- Fake dog profiles or stock photos

---

### Tier 2 launch — Active program moments

| Moment | Channel | Action |
|--------|---------|--------|
| **Dogs section live** | Owned | Announce via site update + email to interest list: "Breeding stock profiles now available" |
| **Waitlist inquiry open** | Owned | Package B form live; email to interest list: "Begin your inquiry for waitlist consideration" |
| **Litter announcement** | Owned + rented (optional) | When operator confirms litter facts: litter page + single educational post → site. **No price. No "X puppies left."** |
| **Referrer re-enable** | Borrowed | Referrers can now send clients to verify named stock |
| **Registry link milestone** | Owned | Health/Education update when per-dog OFA links live |

**Tier 2 promotion rule:** Each moment adds **evidence**, not **urgency**.

---

### ORB channel plan (base case — bootstrapped A7)

#### Owned (primary)

| Asset | Launch role | Ongoing |
|-------|-------------|---------|
| **Website** | Primary proof + conversion surface | SEO compound; content updates when operator facts arrive |
| **Interest/inquiry email list** | Package A nurture; Tier 2 upgrade notices | Low-frequency, high-value updates only — no weekly puppy-blast spam |
| **Auto-reply on inquiry** | Sets expectations: review timeline, not approval | Operator-configured (Q7) |

#### Rented (secondary — pick 1, max 2)

| Platform | Fit | Use | Avoid |
|----------|-----|-----|-------|
| **Facebook** | Breed community presence | Education posts, program updates, link to site | Boosted puppy ads; price in posts; availability spam |
| **Instagram** | Visual proof when Q6 satisfied | Real dog/training photos → link in bio to site | Puppy-mill aesthetic; FOMO stories; "DM for price" |

**Recommendation:** Start with **one** rented platform where operator already has presence. If none, **skip rented at launch** — owned + borrowed sufficient for bootstrapped GTM.

#### Borrowed (supporting — PR owns detail)

| Channel | Role | PMM note |
|---------|------|----------|
| Trainer referrals | Highest-quality discovery | Enable with shareable URL + proof density |
| Breed club / ARC-adjacent directories | Credibility listing | Only when membership verified (Tier 2 claim) |
| Show/working community | Referrer network | Operator-led; PMM provides messaging consistency |
| Prior owner word-of-mouth | Social proof | Post-v1 testimonials when verified (Could have) |

#### Paid — SKIPPED

| Channel | Status | Rationale |
|---------|--------|-----------|
| Google Ads | **Deferred (Phase 19)** | Price-led keywords attract anti-persona; bootstrapped default A7 |
| Facebook/Instagram boosted posts | **Deferred** | Puppy ad ecosystem = FOMO + price competition |
| Puppy marketplace paid listings | **Never** | Category anti-pattern |

**Exception path:** If operator explicitly funds paid in Phase 19, PMM requires separate ICP-negative-keyword strategy — still no price in ad copy, landing = trust pages not checkout.

---

## 5. Messaging for GTM — CTA locks and voice

### Core GTM message (all tiers)

> Blacksage Kennels is a German / ADRK-aligned Rottweiler breeding program. We lead with verifiable evidence and standards-informed education — then invite qualified inquiry. Placements are selective and mutual.

### Messaging pillars → GTM application

| Pillar | GTM expression | Channel application |
|--------|----------------|---------------------|
| **1 — Standards-aligned type/structure** | FCI No. 147, natural tail, correct proportions | SEO: breed standard content; site hero |
| **2 — Temperament within ADRK bounds** | Good-natured, devoted, biddable, even-tempered | All surfaces; repel guard-dog seekers |
| **3 — Verifiable health transparency** | Health test categories; registry links when live | Health/Education hub; referrer talking points |
| **4 — Deliberate placement, not volume** | Selective; inquiry ≠ reservation; no FOMO | Form consent copy; social tone |
| **5 — Education before sale** | Teach before ask | SEO + rented posts drive to education pages |

### CTA language — LOCKED

| Context | Use | Avoid |
|---------|-----|-------|
| Primary site button | **Begin your inquiry** | Apply now / Get your puppy |
| Tier 1 capture | **Join our interest list** | Sign up now / Reserve your spot |
| Tier 2 waitlist form | **Submit inquiry for waitlist consideration** | Apply now / Join waitlist (without qualification framing) |
| Success state | **Inquiry received** — we'll review and respond | You're in! / Application approved |
| Process copy | **Interest list** / **waitlist** (when Q1 clear) | Limited time / Only X left |
| Secondary nav CTAs | View our dogs / Health & testing / Learn about our process | Available puppies / Buy now |

### GTM copy — DO use

- Structure, temperament, devoted, deliberate, inquiry, placement, standard-aligned
- Health clearances, verifiable, education, selective, ADRK-aligned, FCI Standard No. 147
- "Pricing discussed after qualification" (process copy only — not promotional headline)
- "Inquiry is not a reservation"
- "Breeding program in development" (Tier 1 honest posture)
- "Terms provided individually" (Package B deposit context — no amount)

### GTM copy — DO NOT use

| Prohibited | Why |
|------------|-----|
| Apply now | D3 anti-pattern; implies checkout urgency |
| Buy / Shop / Reserve | A10; e-commerce puppy-mill UX |
| How much? / Starting at $X | Price-led acquisition; Tier 3 |
| Only X puppies left / Limited spots | FOMO scarcity — Pillar 4 violation |
| Guard dog / protection machine / weapon | Anti-persona magnet; ADRK bounds |
| 100% healthy / disease-free | Unverifiable superlative |
| Best in [region] / #1 Rottweiler | Tier 3 without proof |
| Available now / Ready to go home | Impulse shopper magnet |
| German Rottweiler (without pedigree proof) | Unverified claim |

### Tier-specific messaging nuance

| Tier | Headline territory | Body territory | CTA |
|------|-------------------|----------------|-----|
| **Tier 1** | Program philosophy + standards commitment | Education, health categories, honest development posture | Join interest list / Begin your inquiry |
| **Tier 2** | Evidence summary — verify on-site | Named stock, litters when verified, process | Begin your inquiry / Waitlist consideration |

### Voice (all GTM)

**Confident · Calm · Precise · Evidence-led · Respectful**

Reward buyer research. Frame selectivity as mutual fit. Acknowledge breed power and owner responsibility. Never condescend to sincere inquirers.

---

## 6. Success signals — Quality over volume

### Primary success metrics (12-month — GTM lens)

| ID | Signal | Target | GTM interpretation |
|----|--------|--------|-------------------|
| **M4** | Qualified inquiries | Quality > volume; baseline TBD post-launch | Measure inquiry **fit**, not form count. Anti-persona self-filters via education + form fields |
| **M5** | Referrer shareability | ≥1 referrer willing to share URL without caveat | **Leading indicator** — if referrers won't share, GTM fails regardless of traffic |
| **M6** | Shortlist + verify support | Site passes Phase 2 trust heuristic | Buyer can complete due diligence on-site |
| **M1** | Operator acceptance | Sign-off on production presence vs v1 | Operator confident pointing serious buyers to site |
| **M2 / M7** | Zero invented facts | 100% claim discipline | GTM never outruns operator inventory |

### GTM-specific signals (PMM recommends CMO track)

| Signal | How to measure | Good | Bad |
|--------|----------------|------|-----|
| **Inquiry quality ratio** | Operator tags inquiries: qualified / neutral / anti-persona | Majority qualified; anti-persona declining over time | "How much?" as first message; guard-dog requests |
| **Referrer share rate** | Count referrer-sent clients who mention source on form | ≥1 active referrer in first 6 months | Referrers apologize for site or stay silent |
| **Verify depth** | Analytics: Health/Education + Dogs pages before Inquire | Inquire preceded by trust page sessions | Apply as landing page entry (v1 failure) |
| **Interest list → waitlist conversion** | Tier 1 list members who submit Tier 2 inquiry when available | Engaged researchers convert | List churn from over-messaging |
| **Organic discovery share** | "How did you hear about us?" form field | Referral + search + club = healthy mix | 100% paid (if paid ever enabled) |
| **Education engagement** | Time on Health/Education; scroll depth | Researchers read before inquire | Bounce from price-seeking |

### What success is NOT

| Not success | Why |
|-------------|-----|
| Raw traffic / pageviews | Vanity; attracts anti-persona |
| Form volume alone | D3 failure mode — apply without trust |
| Social follower count | Rented metric; doesn't prove credibility |
| "Viral" puppy content | FOMO magnet; wrong ICP |
| Price inquiry volume | Anti-persona signal |

### 90-day launch window — PMM success checklist

- [ ] Site live at agreed tier with zero Tier 3 claims
- [ ] ≥1 referrer confirms URL shareability (M5)
- [ ] First 5 inquiries reviewed by operator — majority qualified fit
- [ ] No anti-persona surge from guard-dog or price-only language
- [ ] Interest list (Tier 1) or inquiry form (Tier 2) routing confirmed working (Q7)
- [ ] At least one owned education asset indexed (SEO baseline)
- [ ] Zero FOMO or price-led promotional posts issued

### Tier promotion signals (when to advance GTM)

| From → To | Signal to promote |
|-----------|-------------------|
| Tier 0 → Tier 1 | PRD LG1–LG4 pass; Q7 configured; operator approves Tier 1 copy |
| Tier 1 → Tier 2 | Q1 = active; health inventory + Q6 photos; operator sign-off on named dogs; interest list notified |

---

## Fact / inference / assumption (GTM load-bearing)

| Kind | Statement |
|------|-----------|
| **Fact** | Phase 3 locks D2 trust-first; Phase 5 PRD defines Tier 0–2, Package A/B/C, CTA language |
| **Fact** | 0/8 competitors publish prices; 0/8 use scroll 3D; bootstrapped default skips paid (A7) |
| **Fact** | Blacksage location, pricing, litter availability, health inventory undocumented — GTM must not invent |
| **Inference** | Serious buyers discover via search + referrers; site is conversion surface, not ad landing page |
| **Inference** | Referrer shareability (M5) is leading GTM success indicator |
| **Assumption** | Operator has or will cultivate ≥1 referrer relationship |
| **Assumption** | One rented platform sufficient at launch; second optional |
| **Decision** | Paid SKIPPED; FOMO prohibited; price-led acquisition prohibited |

---

## Downstream handoff (for CMO merge)

| Section | Merge target in `06-gtm-plan.md` |
|---------|----------------------------------|
| §1 Launch narrative | Executive summary + staged launch |
| §2 ICP × channel matrix | Audience + channel strategy |
| §3 Demand path | Funnel + packaging alignment |
| §4 Launch outline | ORB plan + launch calendar |
| §5 Messaging / CTAs | Messaging hierarchy + copy guardrails |
| §6 Success signals | KPIs + 90-day checklist |

**Peer dependency:** PR manager should expand §2 borrowed channels and §4 Tier 1/2 referrer outreach with club/show detail.

---

## Sources

- `docs/projects/blacksage-kennels/business-idea/05-prd.md`
- `docs/projects/blacksage-kennels/business-idea/03-strategy.md`
- `docs/projects/blacksage-kennels/business-idea/04-business-model.md`
- `docs/projects/blacksage-kennels/business-idea/.agents/product-marketing.md`
- `docs/projects/blacksage-kennels/business-idea/02-market-research.md`
- `skills/community/marketingskills/product-marketing/SKILL.md`
- `skills/community/marketingskills/launch/SKILL.md`
