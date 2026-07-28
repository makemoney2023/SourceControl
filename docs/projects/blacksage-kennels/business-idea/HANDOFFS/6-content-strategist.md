---
phase: "6"
position: content-strategist
reports_to: cmo
status: done
verdict_for_manager: ready_to_merge
llm_tier: strong-general
llm_model: composer-2.5-fast
generation_profile: none
generation_used: none
fallback_applied: false
---

# Handoff — Phase 6 Content Strategy → CMO

## Goal (from context packet)

Produce content pillars and education path supporting D2 trust-first strategy for GTM. Content goes in this handoff for CMO merge into `06-gtm-plan.md`. Organic/trust-first only; Phase 19 paid skipped. No FOMO puppy content; no price-led content; no invented kennel-specific facts.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/6-content-strategist.md` | This handoff — merge-ready craft for `06-gtm-plan.md` |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | strong-general |
| llm_model | composer-2.5-fast |
| generation_profile | none |
| generation_used | none |
| fallback_applied | false |

## Decisions

1. **Content pillars map 1:1 to PMM messaging pillars** — no new pillar language; content strategy operationalizes existing Phase 3 locks.
2. **Education path owns VERIFY stage** — site education must be substantive before "Begin your inquiry" is promoted beyond tertiary CTA.
3. **Tier 1 publishability default** — brand-first launch ships Tier 1 (breed/standard/category) content only; Tier 2 per-dog and litter content waits on operator facts (Q1, Q6, health inventory).
4. **Ungated education posture** — interest list is the sole capture mechanism; no PDF lead magnets or gated checklists that attract impulse shoppers.
5. **Organic-first cadence** — site education pages are the product; blog and social are optional support layers, not proof substitutes.
6. **Measurement favors quality signals** — time on Health/Dogs, inquiry quality notes, referrer share over raw traffic.

## Asks for manager (`ask_manager`)

- Peer help needed: **seo-manager** for keyword cluster validation on Health/Education hub topics before Phase 14 blog expansion | optional, not blocking GTM merge
- Clarification needed: **none** — operator dependencies (Q1, Q2, Q6, Q7, health inventory) correctly flagged as content gates, not invented

## Risks / blockers

- **Q1 unset:** Determines whether Dogs/Litters sections ship populated content or honest coming-soon; Tier 1 vs Tier 2 content plan diverges here.
- **Health inventory absent:** Per-dog clearance content blocked; Health/Education hub must stay at Tier 1 category level until operator confirms.
- **Q6 photography delay:** Dog profile content cannot publish named-stock claims; empty-state copy is preferred over placeholder photos.
- **Scope creep to blog/social:** Bootstrapped operator may feel pressure to "do content marketing" — cadence plan intentionally limits to site education first.

## Packs used

- `skills/org/positions/content-strategist/SKILL.md`
- `skills/org/HANDOFF-TEMPLATE.md`
- `skills/community/marketingskills/content-strategy/SKILL.md`

## Do not

- Mark the phase complete
- Write outside write_lease
- Spawn other positions
- Write `06-gtm-plan.md` (CMO merge responsibility)

---

# MERGE-READY CRAFT — for `06-gtm-plan.md`

*CMO: merge sections below into Phase 6 GTM plan. Source: content-strategist IC, Phase 6.*

---

## 1. Content pillars (five)

Content pillars align 1:1 with messaging pillars in `.agents/product-marketing.md`. Each pillar defines GTM purpose, education topics, proof requirements, anti-patterns, and Tier 1 vs Tier 2 publishability under SD5 honest coming-soon discipline.

### Pillar 1 — Standards-aligned type and structure (ADRK/FCI)

| Field | Detail |
|-------|--------|
| **GTM purpose** | Earn shortlist survival by demonstrating standards literacy; differentiate from "German Rottweiler" SEO spam without kennel-specific claims until operator facts exist |
| **Example education topics** | What ADRK/FCI Standard No. 147 defines; correct proportions, markings, and natural tail; how serious buyers evaluate structure; difference between breed standard reference and kennel-specific dogs; why "oversize" or "giant" tropes fail the standard |
| **Proof requirements** | Tier 1: cite ADRK/FCI standard facts with outbound links; generic breed-standard diagrams labeled "breed standard reference." Tier 2: named breeding stock photos and standard-aligned type claims only when operator supplies verified dogs (Q6) |
| **Anti-patterns** | "Giant," "oversize," "biggest head," superlative type claims; stock photos presented as Blacksage dogs; invented show results or titles |
| **Tier 1 publishability** | **Yes** — standard literacy, structure vocabulary, natural-tail context, buyer evaluation checklist |
| **Tier 2 publishability** | Named dog profiles, kennel-specific type claims, show/work titles — **blocked until** operator dog inventory + photography (Q6) |

**Primary IA homes:** Home (proof summary block), Health/Education (standard literacy hub), Dogs (when populated), About (program philosophy tie-in)

---

### Pillar 2 — Temperament within ADRK bounds (no aggression marketing)

| Field | Detail |
|-------|--------|
| **GTM purpose** | Filter guard-dog fantasy seekers; attract family companion, sport/working, and import/pedigree sub-segments who value steadiness over spectacle |
| **Example education topics** | ADRK temperament descriptors (good-natured, devoted, biddable, even-tempered, self-assured); what BH and ZTP-equivalent screening mean conceptually; responsible ownership and breed power; matching activity level to dog (companion vs sport vs structure focus); why aggression marketing is an eliminating fault context |
| **Proof requirements** | Tier 1: standard-cited temperament language; calm imagery direction guidelines. Tier 2: operator-described evaluation practices, temperament screening process, calm handler/dog photography when Q6 available |
| **Anti-patterns** | "Guard dog," "protection machine," "weapon," "attack," machismo tropes; promising "safe with everyone always" or "non-aggressive" absolutes; fear-based marketing |
| **Tier 1 publishability** | **Yes** — breed-standard temperament education, screening concepts (BH/ZTP explained), responsible ownership framing |
| **Tier 2 publishability** | Blacksage-specific temperament evaluation process, named-dog temperament narrative — **blocked until** operator confirms practices and media |

**Primary IA homes:** Home (temperament proof block), Health/Education (temperament + screening section), About (program philosophy), Contact/Inquire (form intent fields reinforce fit)

---

### Pillar 3 — Verifiable health transparency

| Field | Detail |
|-------|--------|
| **GTM purpose** | Address trust signal #1 (parent health testing); enable buyer VERIFY stage on-site before OFA lookup off-site; reduce unqualified "how much / any puppies?" inquiries |
| **Example education topics** | CHIC-required tests for Rottweilers (hips, elbows, eyes, cardiac); JLPP and genetic testing concepts; how to read OFA/CHIC results; ADRK HD/ED requirements in Germany; why "health tested" without specifics fails due diligence; what buyers should ask every breeder |
| **Proof requirements** | Tier 1: test **categories** with links to OFA CHIC, ADRK, Embark resources. Tier 2: named per-dog clearance results **only** with registry outbound links when operator health inventory exists |
| **Anti-patterns** | "100% healthy," "disease-free," guaranteed outcomes; specific OFA numbers without registry links; vague "health tested" with no test names; invented clearance claims |
| **Tier 1 publishability** | **Yes** — health test category hub, buyer checklist, registry links, JLPP/cardiac/eyes context |
| **Tier 2 publishability** | Per-dog health pages, CHIC numbers, clearance PDFs/links — **blocked until** operator health inventory confirmed |

**Primary IA homes:** Health/Education (primary hub), Dogs (per-dog health links when Tier 2), Home (health commitment summary)

---

### Pillar 4 — Deliberate placement, not volume (no FOMO)

| Field | Detail |
|-------|--------|
| **GTM purpose** | Signal trust signal #3 (buyer screening); repel impulse shoppers and checkout-expecters; align with category waitlist norms without inventing Blacksage process details |
| **Example education topics** | How ethical breeder placement works (application → interview → match); why selective breeding means limited placements; interest list vs waitlist distinction; what "qualification" means (mutual fit, not rejection); deposit and contract norms at category level (no Blacksage dollar amounts); timeline expectations (6–12+ months category norm) |
| **Proof requirements** | Tier 1: process sequencing copy ("pricing and deposit discussed after qualification"); Package A/B/C descriptions without amounts. Tier 2: operator-confirmed waitlist policy, contract/guarantee PDF, response SLA (Q7), geography/service area (Q2) |
| **Anti-patterns** | Countdown timers, "only X puppies left," "available now," price-forward CTAs, fake scarcity, litter dates without verification, Buy/Reserve/Shop language |
| **Tier 1 publishability** | **Yes** — category-level placement education, Package A interest-list posture, honest "program in development" when Q1 = brand-first |
| **Tier 2 publishability** | Active litter pages, Package B waitlist fields, specific deposit policy copy — **blocked until** Q1 = active program + Q7 destination + operator policy (OP-P2) |

**Primary IA homes:** Health/Education (placement process section), Contact/Inquire (form + expectations), About (selectivity philosophy), Litters (conditional, Tier 2 only)

---

### Pillar 5 — Education before sale

| Field | Detail |
|-------|--------|
| **GTM purpose** | Own trust signal #5; reduce unqualified inquiries; reward standards literacy; position Blacksage as teacher-first, seller-second — the meta-pillar that governs content sequencing and CTA hierarchy |
| **Example education topics** | How to evaluate an ethical Rottweiler breeder; breed standard literacy primer; health test checklist; puppy-raising and socialization expectations; natural tail policy context; finding-a-breeder alignment (buyer self-screening); responsible ownership commitment |
| **Proof requirements** | Tier 1: comprehensive Health/Education hub covering standard, health, temperament, and process topics with authoritative outbound citations. Tier 2: operator-specific puppy-raising practices, facility/husbandry narrative when Q6 media available |
| **Anti-patterns** | Condescending tone toward sincere researchers; education buried below apply CTA; thin FAQ as substitute for substantive hub; keyword-stuffed "German Rottweiler" spam pages |
| **Tier 1 publishability** | **Yes** — full education hub at category/principle level; buyer self-assessment content; FAQ slot |
| **Tier 2 publishability** | Operator-specific raising practices, kennel tour narrative, verified testimonials — **blocked until** operator input + media |

**Primary IA homes:** Health/Education (primary), Home (pathway CTAs to education), About (operator story when available), global nav (education before inquire prominence per U1)

---

### Pillar interlock (content sequencing rule)

```
Education before sale (P5) governs sequencing
  ├── Standards (P1) + Temperament (P2) = buyer literacy foundation
  ├── Health transparency (P3) = verify bar
  └── Deliberate placement (P4) = conversion framing AFTER proof consumed
```

**CTA rule:** "Begin your inquiry" may appear on site but remains **tertiary** until user can navigate Dogs, Health/Education, and About without hitting dead-end placeholders. Education content is the conversion prerequisite, not a sidebar.

---

## 2. Education path supporting D2 (buyer journey content map)

### Journey stages → content types → IA mapping

| Stage | Buyer mindset | Content job | Primary IA | Content types | CTA posture |
|-------|---------------|-------------|------------|---------------|-------------|
| **DISCOVER** | "Is this breed/program category worth my research time?" | Establish ADRK-aligned positioning; signal seriousness | **Home** | Positioning statement, proof-pathway summary, links to Health/Education | View our dogs · Health & testing · Learn our process — **no inquire primary** |
| **SHORTLIST** | "Does Blacksage belong on my 3–8 kennel list?" | Evidence density in first 3–5 screens; filter anti-personas via tone | **Home**, **About** (stub OK Tier 1) | Program focus summary, standards/temperament/health commitment blocks, operator identity or honest pending state | Secondary navigation to Dogs and Health/Education |
| **VERIFY** | "Can I confirm claims without contacting yet?" | Enable independent due diligence on-site | **Dogs**, **Health/Education** | Tier 1 education hub; Tier 2 named dogs + registry links when available; standard diagrams; health category explainer; placement process | Learn about our process — still **no inquire dominance** |
| **CONTACT / INQUIRE** | "I've reviewed enough to ask a thoughtful question." | Capture qualified interest; set expectations | **Contact/Inquire** | Inquiry form (Package A or B per Q1); process expectations; consent copy | **Begin your inquiry** — primary CTA **only here** and tertiary elsewhere |

### IA content requirements by section

| IA section | DISCOVER | SHORTLIST | VERIFY | INQUIRE |
|------------|----------|-----------|--------|---------|
| **Home** | ✓ Primary | ✓ Primary | ○ Summary only | ○ Tertiary CTA |
| **Dogs** | ○ Link from Home | ○ Scan for named stock | ✓ Primary (Tier 2) or honest empty state (Tier 1) | ○ Supports decision |
| **Health/Education** | ○ Link from Home | ✓ Differentiator | ✓ Primary hub | ○ Pre-inquire required reading |
| **About** | ○ Optional | ✓ Operator identity | ○ Philosophy confirmation | ○ Trust reinforcement |
| **Contact/Inquire** | ✗ Hidden as primary | ✗ Not promoted | ○ Reachable but not dominant | ✓ Primary conversion |

### Education that MUST exist before promoting "Begin your inquiry"

Minimum **Tier 1** education ship-set (all required at launch regardless of Q1):

| # | Required content | IA home | Pillar |
|---|------------------|---------|--------|
| E1 | ADRK/FCI standard literacy (structure, markings, natural tail) | Health/Education | P1 |
| E2 | Temperament within standard bounds + screening concepts (BH/ZTP explained) | Health/Education | P2 |
| E3 | Health test category hub with OFA/CHIC/ADRK outbound links | Health/Education | P3 |
| E4 | Placement process overview (Packages A–C described; no prices) | Health/Education | P4 |
| E5 | How to evaluate a breeder / buyer self-assessment checklist | Health/Education | P5 |
| E6 | Home proof summary blocks linking to E1–E5 | Home | P1–P5 |
| E7 | Honest posture statement (what is verified today vs coming soon) | Home + About | SD5 |
| E8 | About program philosophy (operator bio when available; honest gap otherwise) | About | P2, P4 |

**Gate rule:** If E1–E8 are not substantive (not stub lorem), "Begin your inquiry" must not appear as primary or above-fold CTA anywhere on site (PRD U1, U2).

**Tier 2 additions before active-program promotion:**

| # | Additional content | Gate |
|---|---------------------|------|
| E9 | Named dog profiles with verified photos | Q6 + health inventory |
| E10 | Per-dog OFA/CHIC outbound links | Health inventory |
| E11 | Litter page (parents linked, no price) | Q1 active + litter facts |
| E12 | Operator geography and contact methods | Q2 |
| E13 | Contract/guarantee reference | Operator docs |

### Content type taxonomy (searchable-first)

| Type | Searchable intent | Example titles (Tier 1 safe) | IA placement |
|------|-------------------|------------------------------|--------------|
| **Standard literacy** | "rottweiler breed standard," "adrk rottweiler standard" | Understanding FCI Rottweiler Standard No. 147 | Health/Education hub |
| **Health explainer** | "rottweiler health testing," "ofa chic rottweiler" | Health Tests Every Responsible Rottweiler Breeder Should Perform | Health/Education hub |
| **Temperament explainer** | "rottweiler temperament," "adrk rottweiler temperament" | Rottweiler Temperament: What ADRK Standards Require | Health/Education hub |
| **Buyer guide** | "how to find ethical rottweiler breeder" | How to Evaluate a Rottweiler Breeding Program | Health/Education hub |
| **Process explainer** | "rottweiler breeder waitlist" | What to Expect from a Selective Breeding Program | Health/Education + Contact |
| **Program proof** | Branded/navigational | [Dog name] — Breeding Stock | Dogs (Tier 2 only) |

All Tier 1 topics are **searchable** (capture existing demand from serious researchers). Shareable content (operator story, litter announcements) is **Tier 2 optional** and never substitutes for proof.

---

## 3. Tiered content ship plan

Aligns with PRD staged launch tiers (Tier 0 staging / Tier 1 brand-first / Tier 2 active program). Content population follows operator fact gates — quality bar is identical across public tiers.

### Tier 0 — Staging (internal only)

| Dimension | Rule |
|-----------|------|
| **Purpose** | Design/dev/content review against PRD AC before public launch |
| **Content allowed** | Tier 1 copy only; any placeholder explicitly marked non-production |
| **Content blocked** | Tier 2/3 claims; production form destinations; invented dogs/litters/location |
| **Exit criteria** | E1–E8 draft complete; claim audit passes Tier 1 discipline; zero Tier 3 violations |

### Tier 1 — Brand-first (Q1 = pre-litter / coming-soon)

| Dimension | Detail |
|-----------|--------|
| **Trigger** | Q1 = brand-first OR photography/health inventory not ready |
| **Live sections** | Home, About, Health/Education, Contact/Interest list |
| **Dogs section** | Honest empty state: "Breeding stock profiles coming soon" — **not** fake profiles |
| **Litters** | Omitted or explicit coming-soon with verified facts only |
| **Conversion** | Package A (Interest list) only |
| **Content ship-set** | E1–E8 (full Tier 1 education hub) + interest list capture |
| **Photography** | Brand/environment or typographic hero; breed-standard diagrams labeled "reference"; **no stock dogs as Blacksage stock** |
| **Operator facts required** | Q7 (form destination) before public launch; Q2 partial OK (philosophy-only About) |

**What waits for operator:**

| Content | Operator dependency |
|---------|---------------------|
| Named dog pages | Q6 photography + dog names |
| Per-dog health links | Health inventory |
| Litter content | Q1 = active program |
| Geography/service area copy | Q2 |
| Club affiliation badges | Membership docs |
| Show/work titles | Title records |
| Operator bio specifics | Operator input |
| Waitlist/deposit specifics | Q1 + OP-P2 |

### Tier 2 — Active program (Q1 = active breeding)

| Dimension | Detail |
|-----------|--------|
| **Trigger** | Q1 = active + health inventory + Q6 photos + operator sign-off |
| **Live sections** | All primary IA including populated Dogs (+ Litters when litter facts verified) |
| **Conversion** | Package A and/or B per operator policy |
| **Content additions** | E9–E13 (named dogs, per-dog health links, litter pages, geography, contract refs) |
| **Photography** | Operator-supplied dog photos required for any named-dog claims |
| **Health** | Per-dog clearance links only with registry URLs |

**Promotion path:**

```
Tier 0 (staging)
  → Tier 1 when: E1–E8 built + NFR pass + zero Tier 3 + Q7 plan documented
  → Tier 2 when: Q1 active + health inventory + Q6 photos + Dogs/Litters populated + operator sign-off
```

**Non-negotiable:** Tier promotion adds **content population**, not **quality bar reduction**. Both public tiers must pass all four v1 failure-layer AC.

### Content inventory checklist (CMO / copy-chief handoff)

| Content asset | Tier 0 | Tier 1 | Tier 2 | Owner phase |
|---------------|--------|--------|--------|-------------|
| Home proof blocks | Draft | **Ship** | **Ship** | 13 Copy |
| Health/Education hub (E1–E5) | Draft | **Ship** | **Ship** | 13–14 Content |
| About program philosophy | Draft | **Ship** | Enrich | 13 Copy |
| Dogs empty state | Draft | **Ship** | Replace with profiles | 14 Content |
| Dog detail template | Draft | N/A | **Ship** when gated | 14 Content |
| Litters section | Blocked | Omit/coming-soon | **Ship** when gated | 14 Content |
| Contact/Inquire form copy | Draft | **Ship** | Package B variant | 13 Copy |
| FAQ slot | Draft | **Ship** (Should) | **Ship** | 13–14 |
| Blog/articles | Blocked | Defer | Optional (Could) | 14+ |

---

## 4. Organic content cadence (lightweight)

Bootstrapped operator reality: site education pages are the content program. No paid amplification assumed (Phase 19 skipped). Cadence designed for sustainable operator effort, not content-marketing theater.

### Priority stack

| Priority | Channel / surface | Cadence | Purpose |
|----------|-------------------|---------|---------|
| **P0 — Must** | Site education pages (Health/Education hub) | Ship at launch; review quarterly | Trust + VERIFY stage; SEO foundation |
| **P1 — Should** | Home / About / Dogs page updates | As operator facts arrive | Proof density increases with inventory |
| **P2 — Could** | Blog (1–2 posts/quarter after launch) | Only after E1–E8 stable | Long-tail SEO depth; not launch blocker |
| **P3 — Optional** | Social (Instagram/Facebook) | 2–4 posts/month if operator has media | Community updates; **not proof substitute** |
| **P4 — Defer** | Newsletter beyond interest list | Post-Tier 2 if at all | Only when waitlist active and operator capacity exists |
| **Won't** | Paid content amplification | N/A | Phase 19 skipped; trust-first organic only |

### Phase-by-phase cadence

**Launch window (Tier 1):**

- Ship complete E1–E8 education hub as static pages (not blog posts)
- No blog required for launch
- Social: optional "program in development" announcement — 1 post maximum; link to site education, not apply pressure
- Operator effort estimate: **content review + approval**, not ongoing production

**First 90 days post-launch:**

- Monitor inquiry quality notes (see Measurement)
- Update About/Dogs only when operator supplies facts
- Blog: **0 posts required**; if capacity exists, 1 buyer-guide-style post driving to Health/Education hub
- Social: only when real operator photography exists; never stock-image "our dogs" posts

**Tier 2 promotion (when Q1 active):**

- Add dog profiles and litter announcements as events occur (not scheduled filler)
- Blog: max 1 post/month — litter news, health testing explainer deep-dives, show results (verified only)
- Social: litter/puppy updates for **existing interest list/waitlist audience** — not acquisition spam

### Content production roles (lightweight)

| Role | Responsibility | Frequency |
|------|----------------|-----------|
| Operator | Fact supply, photo approval, inquiry quality feedback | Ongoing |
| Copy-chief / content | Page copy from pillars; claim audit | Launch + updates on fact arrival |
| SEO (Phase 14) | Keyword validation on hub topics | One-time cluster map |
| CMO | Cadence adherence; anti-FOMO enforcement | Quarterly review |

### Social content rules (support only)

- Social posts **link back** to site education or specific dog pages — never standalone proof
- No "DM for price," no "puppies available now" unless Tier 2 litter facts verified and even then: inquiry CTA, not checkout
- No countdown, urgency, or scarcity language
- Photography: operator-supplied only; no stock Rottweilers labeled as Blacksage

---

## 5. Lead magnet / gated content posture

### Default: ungated education on-site

All Tier 1 education (E1–E8) ships **fully open** on Health/Education hub. Rationale:

- Serious buyers expect to verify **before** giving contact info — gating contradicts D2 trust-first
- Gated PDFs ("Free Rottweiler Buyer's Guide") attract impulse downloaders and price-shoppers — anti-persona magnet
- Category norm: top competitors publish education openly; gating would signal insecurity or lead-gen funnel, not breeder credibility

### Interest list as sole capture mechanism

| Mechanism | Posture |
|-----------|---------|
| **Interest list (Package A)** | Primary capture for Tier 1 — brief form, honest expectations, no bait-and-switch |
| **Waitlist inquiry (Package B)** | Tier 2 capture after education consumed — full form, qualification framing |
| **Email newsletter** | Defer until Tier 2; not a launch requirement |
| **Gated PDF / checklist download** | **Avoid** — if ever used, must not be puppy-availability bait |
| **Pop-ups / exit intent** | **Prohibited** — contradicts calm, evidence-led UX |

### Acceptable lightweight captures (optional, post-launch)

| Capture | Gated? | Condition |
|---------|--------|-----------|
| Interest list signup on Contact page | No — form is the page | Tier 1 launch |
| "Notify me when breeding stock profiles publish" | No — checkbox on interest form | Tier 1 if Dogs empty |
| Printable buyer checklist | **Ungated PDF link** preferred over email gate | Post-launch optional |

### Anti-patterns (lead magnet)

- "Enter email to see available puppies"
- "Download our price list"
- "Free puppy naming guide" or other impulse-shopper bait
- Quiz funnels ("What Rottweiler is right for you?") that skip education
- Any capture that appears before user can access Health/Education content

---

## 6. Content measurement

Organic/trust-first GTM does not optimize for vanity traffic. Measurement focuses on **leading indicators** that education is working and inquiries are qualifying.

### Primary metrics (leading indicators)

| Metric | Signal | How to measure | Target (hypothesis) |
|--------|--------|----------------|---------------------|
| **Time on Health/Education** | Buyer engaging VERIFY content | Analytics: avg time on page, scroll depth | > 2 min avg; > 50% scroll to placement section |
| **Health → Contact path rate** | Education-before-inquire behavior | Event: nav or CTA from Health/Education to Contact | Track baseline post-launch; improve with content depth |
| **Dogs page engagement** | Shortlist/proof consumption | Time on page; click-through to health links (Tier 2) | Baseline TBD; empty-state bounce expected Tier 1 |
| **Inquiry quality notes** | Anti-persona filter working | Operator tags inquiries: qualified / neutral / unqualified | ↑ qualified ratio over time; ↓ price-only first contacts |
| **Referrer share** | Referrer channel trust | Form field "How did you hear about us?" + direct/trainer/club mentions | ≥ 1 referrer-sourced inquiry in first 6 months (M5 alignment) |
| **Inquiry message depth** | Education absorbed before contact | Review "Why Blacksage?" field length and specificity | Messages reference standard/health topics |

### Secondary metrics (health checks)

| Metric | Signal | Notes |
|--------|--------|-------|
| **Organic search impressions** | Discover stage working | GSC: Health/Education queries; not primary KPI |
| **Bounce rate on Home** | Shortlist elimination vs confusion | High bounce OK if Health/Education path taken |
| **Contact page conversion rate** | Inquire after proof | Low volume expected; quality > quantity |
| **Return visits** | Due diligence behavior | 2+ sessions before inquire = healthy pattern |

### Explicitly de-prioritized (vanity / misaligned)

| Metric | Why de-prioritized |
|--------|-------------------|
| Total site traffic / pageviews | Volume attracts wrong audience; puppy-mill SEO competes on traffic |
| Social followers / likes | Not proof; can attract impulse audience |
| Email list size (interest list) | Size without inquiry quality is meaningless |
| Blog post count | Activity metric; not trust metric |
| Time on site (global) | Misleading if user is lost, not researching |
| Paid ROAS / CPL | Phase 19 skipped |

### Measurement cadence

| Cadence | Activity | Owner |
|---------|----------|-------|
| **Launch + 30 days** | Baseline: time on Health/Education, inquiry count, quality tags | CMO + operator |
| **Quarterly** | Review inquiry quality notes, referrer share, content gaps from operator feedback | CMO |
| **Tier 2 promotion** | Re-baseline Dogs/Litters engagement; add per-dog health link clicks | CMO + SEO |
| **12-month** | M4/M5 alignment: qualified inquiry trend + referrer willingness | CMO → operator Q4 |

### Feedback loop (content iteration)

```
Operator inquiry quality notes
  → Identify gaps ("buyers keep asking about X")
  → Add FAQ or Health/Education section (ungated)
  → Re-measure time on updated section + inquiry quality
```

No A/B testing on CTAs at launch — trust-first sequencing is a strategic lock, not an optimization experiment.

---

## Cross-reference locks (for CMO merge)

| Source | Lock | Content impact |
|--------|------|----------------|
| D2 | Trust-first → qualified inquiry | Education before inquire CTA |
| SD5 | Honest coming-soon | Tier 1 default; no invented facts |
| SD4 | No 3D v1 | Content is proof, not spectacle |
| A10 | No on-site prices | No price-led content ever |
| PRD U1–U2 | CTA hierarchy | Begin your inquiry tertiary until E1–E8 ship |
| PMM Tier 1–3 | Claim discipline | All content maps to proof tiers |
| Phase 19 | Paid skipped | Organic cadence only |

---

## Sources

- `docs/projects/blacksage-kennels/business-idea/05-prd.md`
- `docs/projects/blacksage-kennels/business-idea/03-strategy.md`
- `docs/projects/blacksage-kennels/business-idea/.agents/product-marketing.md`
- `docs/projects/blacksage-kennels/business-idea/02-market-research.md`
- `skills/community/marketingskills/content-strategy/SKILL.md`
