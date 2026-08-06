---
phase: "6"
position: pr-manager
reports_to: cmo
status: done
verdict_for_manager: ready_to_merge
llm_tier: creative-language
llm_model: composer-2.5-fast
generation_profile: none
generation_used: none
fallback_applied: false
---

# Handoff — Phase 6 GTM PR Plan → cmo

## Goal (from context packet)

Produce reputation, community, and breeder-network PR plan for trust-first kennel GTM. Content goes in this handoff for CMO merge into `06-gtm-plan.md`.

---

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/6-pr-manager.md` | This handoff — merge-ready PR sections for `06-gtm-plan.md` |

---

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | creative-language |
| llm_model | composer-2.5-fast |
| generation_profile | none |
| generation_used | none |
| fallback_applied | no |

---

## Decisions

- **PR is earned reputation, not press hits.** In this category, referrers and club networks judge credibility before journalists ever matter. Owned web is the primary proof asset; PR amplifies what already exists — it does not substitute for missing evidence (SD5, SD2).
- **No paid PR retainer or mass-media splash** in Phase 6 base case (A7 bootstrapped; Phase 19 paid skipped). All tactics are organic, operator-led, and relationship-based.
- **Claim discipline is the reputation strategy.** Tier 1 (breed/standard facts, health categories, inquiry posture) may publish now; Tier 2 (named dogs, clearances, clubs, titles, geography) only after operator confirmation; Tier 3 (prices, litter dates, unlinked OFA, placeholder dog photos) is prohibited (SD5, PRD T1–T7).
- **Referrer shareability (M5) is the north-star PR outcome** — not coverage count, AVE, or vanity press metrics.
- **Soft intro before hard pitch** in all community and breeder-network outreach. Never spam forums with puppy ads or availability posts.
- **Launch PR follows staged tiers** (Tier 0 internal → Tier 1 brand-first → Tier 2 active program). No public announcement before proof exists.
- **Geography-specific co-marketing deferred** until operator closes Q2 (likely Q2 calendar per operator interview schedule).

---

## Asks for manager (`ask_manager`)

- Peer help needed: none
- Clarification needed: **Operator interview** to close Q1 (program maturity), Q2 (geography), Q6 (photography), Q7 (inquiry destination) before Tier 1 public launch PR activates. Recommend CMO coordinate with head-of-product on shared operator session.

---

## Risks / blockers

- **Hollow-site referrer silence (v1 lesson):** If site launches without substantive trust content, referrers will not share URL regardless of outreach effort. PR plan assumes PRD Tier 1 minimum is met before any external credibility push.
- **Unverifiable claims in tight community:** Rottweiler breeder networks cross-check OFA, pedigrees, and club affiliations. One invented claim can permanently damage operator reputation — worse than no site at all.
- **Puppy-mill association risk:** Aggressive outreach, price-forward language, or forum puppy ads trigger category skepticism and ARC/AMRRC-aligned buyer blacklisting.
- **Geography unknown:** Local club and trainer co-marketing cannot be prioritized by region until Q2 confirmed.

---

## Packs used

- `skills/community/marketingskills/public-relations/SKILL.md`
- `skills/community/marketingskills/referrals/SKILL.md`
- `skills/community/marketingskills/co-marketing/SKILL.md`
- `skills/org/positions/pr-manager/SKILL.md`
- `skills/org/HANDOFF-TEMPLATE.md`

---

## Do not

- Mark the phase complete
- Write outside write_lease
- Spawn other positions
- Inherit parent model when MODEL-REGISTRY pins a different tier (esp. creative/legal)

---

# Merge-ready craft — PR & reputation (for `06-gtm-plan.md`)

> **Strategic context:** Blacksage GTM is trust-first (D2). The website earns shortlist survival; referrals, clubs, and breeder networks are **supporting discovery channels** — not substitutes for owned proof (SD2, A6). PR in this venture means **reputation earned in a skeptical category**, not TechCrunch coverage. Phase 19 paid media is skipped; all tactics below are organic and operator-relationship-led.

---

## 1. Reputation strategy

### Core principle

In ADRK-aligned Rottweiler breeding, **reputation is evidence, not narrative.** Serious buyers and referrers evaluate OFA/CHIC links, named breeding stock, temperament bounds, and placement integrity — not taglines or visual spectacle. Blacksage's reputation strategy is therefore **claim discipline + referrable proof density**, not brand awareness campaigns.

### How Blacksage earns reputation

| Mechanism | What it looks like | Proof tier |
|-----------|-------------------|------------|
| **Owned web as credibility asset** | Evidence-led IA (Home → Dogs → Health/Education → About → Contact/Inquire); education before inquiry | Tier 1 now; Tier 2 when operator supplies |
| **Verifiable health transparency** | Health test categories published; per-dog OFA/CHIC links only when operator inventory exists | Tier 1 categories; Tier 2 per-dog |
| **Honest posture when facts pending** | "Breeding program in development" / interest list — not invented litters or dogs | SD5, T4 |
| **Referrer-validated shareability** | URL a trainer or prior owner sends without caveat or apology | M5 heuristic, T7 |
| **Relationship-based network presence** | Personal introductions through clubs, shows, working events — not mass outreach | Organic only |
| **Consistent voice bounds** | ADRK/FCI temperament language; no aggression/guard-dog marketing (T5) | Tier 1 (standard facts) |

### How Blacksage protects reputation

| Risk | Protection |
|------|------------|
| Unverifiable kennel-specific claims | **SD5 claim discipline:** publish only operator-verified facts; QA audit before any public surface (M2, M7) |
| Placeholder content presented as proof | Media rules: no stock/AI dog photos as Blacksage stock; honest empty states preferred (PRD media rules, Tier 3) |
| Apply-first / price-forward UX | Rejected paths D3, A10; CTA = "Begin your inquiry" after trust sections (U1, U2) |
| Spectacle without substance | SD4: no scroll-3D/WebGL v1; prestige = evidence density (SD8) |
| Overpromising in outreach | All external comms mirror Tier 1–2 rules; operator approves Tier 2 claims before publication |

### Claim discipline (SD5) — PR operating rules

**Tier 1 — Safe to publish in any PR or outreach context:**

- Breed focus: German / ADRK-aligned Rottweilers per FCI Standard No. 147
- Temperament language within ADRK bounds (devoted, biddable, even-tempered — not guard-dog hype)
- Health testing **categories** (hips, elbows, eyes, cardiac, JLPP) as responsible-breeding literacy
- Inquiry-is-not-checkout posture; selective placement framing
- Category facts (ADRK breeding requires HD/ED, BH, ZTP in Germany; OFA CHIC requirements in US)

**Tier 2 — Operator confirmation required before any public or referral-facing claim:**

- Named breeding stock, photos, pedigrees
- Specific health clearances with registry links
- Club affiliations, show/work titles
- Geography, contact methods, program maturity (active litters vs. interest list)
- Operator identity, kennel story, years in program

**Tier 3 — Never publish, pitch, or imply:**

- Puppy prices, deposit amounts, "starting at" language
- Litter availability, dates, or puppy counts
- Unlinked OFA results or "100% healthy" guarantees
- Superlatives ("best," "#1," "champion lines") without records
- Invented location, memberships, or titles
- Stock or AI imagery presented as Blacksage dogs

**PR corollary:** If a journalist, club newsletter, or referrer asks for proof Blacksage cannot provide, the correct response is honest scope — not filler. "We publish verified results as they become available" beats a hollow claim that gets fact-checked.

### Shareable URL for referrers (P2)

Referrers (trainers, prior owners, club members, show/working contacts) need a **single URL they can send without reputational risk**. The site is the referral asset — not a referral landing page separate from the main site.

**Referrer shareability checklist (M5 / T7):**

- [ ] Professional, calm visual system — not template-broken or spectacle-heavy
- [ ] Substantive Health/Education content (Tier 1 minimum) reachable in 1–2 clicks
- [ ] Dogs section honest: populated with verified stock **or** explicit coming-soon — never fake profiles
- [ ] No apply-first hero, no price CTAs, no FOMO scarcity
- [ ] Mobile-readable; fast load without WebGL (referrers often share via phone)
- [ ] Open Graph preview looks credible when pasted in text/email (S-12)
- [ ] Operator or PM sniff test: "Would I send this to a client without explaining what's missing?"

**Referrer enablement (lightweight, no formal program v1):**

- Stable canonical URL (no staging links in the wild)
- Optional one-paragraph "about the program" blurb operator can paste in emails — mirrors Tier 1 facts only until Tier 2 confirmed
- Form field "How did you hear about us?" captures referral source (S-09) for thank-you loop

**What referrers do NOT need v1:** commission structures, affiliate codes, referral rewards, or gamified share mechanics — those undermine trust in this category.

---

## 2. Community & breeder-network PR

### Channel role

Clubs, trainers, working/show contacts, and ADRK-aligned networks are **borrowed credibility channels** — they extend reach to serious buyers already in the due-diligence mindset. They are supporting discovery (SD2), not the primary growth lever until owned proof exists.

**Geography note:** Local club and trainer prioritization is **TBD until operator closes Q2**. Tactics below describe *types* and *approaches*; named local partners are not assumed.

### Target network types (prioritized)

| Priority | Network type | Role | Approach |
|----------|-------------|------|----------|
| **P1** | **Rottweiler breed clubs (US)** | Buyer education alignment; referrer pipeline | Borrowed credibility via club buyer-education norms — not kennel advertising |
| **P1** | **Professional dog trainers (Rottweiler-experienced)** | Secondary ICP referrers; temperament-fit gatekeepers | Relationship-first; shareable URL as primary asset |
| **P2** | **Working / sport / IGP community** | Sport/working buyer sub-segment | Proof-led intro when operator has working titles or training narrative (Tier 2) |
| **P2** | **Show / conformation contacts** | Structure/type credibility | Personal network only; no invented show claims |
| **P3** | **ADRK-aligned online communities** | Education and standards literacy | Contribute value before mention; never lead with availability |
| **P3** | **Veterinary / breed-health adjacent** | Health literacy reinforcement | Co-education angle only when operator has verifiable health story |

**Category-known orgs (context only — no assumed Blacksage membership):**

- **AMRRC (American Rottweiler Club)** — publishes buyer-education guidelines ([choose-breeder resources](https://www.amrottclub.org/about-the-rottweiler/find-a-rottweiler/choose-breeder/)); serious buyers use ARC-aligned framing as trust shorthand
- **AKC responsible breeder guidance** — converges on health verification, buyer screening, real photography
- **OFA/CHIC** — registry links are the verification layer buyers cross-check independently

Blacksage does **not** claim ARC membership, ADRK World Family status, or any club affiliation until operator provides Tier 2 documentation.

### Soft intro vs. hard pitch

| Soft intro (default) | Hard pitch (only when relationship + proof exist) |
|---------------------|---------------------------------------------------|
| Share educational content aligned with club buyer guidelines | Ask for explicit referral endorsement |
| Attend events; meet people; listen first | Request newsletter feature or directory listing |
| Offer to answer breed-health questions from genuine interest | Propose co-authored buyer-education piece |
| Mention site only when asked "what are you building?" | Lead with "we have puppies" or "join our waitlist" |
| Follow club/event social; engage thoughtfully | Post availability in club forums or Facebook groups |

**Soft intro script (operator voice, Tier 1 safe):**

> "We're building Blacksage Kennels as an ADRK-aligned Rottweiler program — leading with health transparency and standards-informed education on our site. We're [in development / preparing our breeding program — per Q1]. If you know someone doing serious breed research, the site explains our approach. Happy to share the link if it's useful."

**Hard pitch (Tier 2+ only — when named dogs, health links, and program maturity verified):**

> "We've published our breeding stock and health testing on [URL]. If you work with families researching German-line Rottweilers, I'd appreciate you taking a look — and passing it along if it meets your bar for responsible programs."

### Forum and community rules — never do this

| Anti-pattern | Why it destroys reputation |
|--------------|---------------------------|
| **Puppy availability posts in breed forums** | Reads as puppy-mill / broker behavior; moderators ban; buyers blacklist |
| **"PM me for pricing" or price hints in groups** | Price-led acquisition attracts anti-persona; violates A10 |
| **Guard-dog / protection marketing in Rottweiler groups** | Violates ADRK temperament bounds; attracts liability buyers (T5) |
| **Astroturfing or fake testimonials** | Tight community fact-checks; one caught lie is permanent |
| **Repeated self-promotion without contribution** | Spam perception; damages operator personally, not just brand |
| **Claiming club membership or titles not held** | Tier 3 violation; community verification is immediate |

**Acceptable community participation:**

- Answer sincere health/standard questions with ADRK-informed, Tier 1 literacy
- Share third-party buyer-education resources (AKC, AMRRC, OFA) without self-linking every comment
- When directly asked for breeder recommendations, respond honestly about program stage (interest list vs. active) — do not oversell

### ADRK-aligned network posture

US buyers evaluating "German / ADRK-aligned" programs cross-check **both** FCI type/temperament norms **and** OFA-verifiable health transparency. External PR and community presence should reinforce:

- Natural tail / European type literacy (when operator policy confirmed)
- BH/ZTP-equivalent concepts as temperament screening education (Tier 1)
- No "German lines" label without pedigrees to back it (Tier 2)

---

## 3. Referral amplification

### Secondary ICP: trainers, prior owners, club members

Referrers recommend kennels to protect **their own** reputation. Amplification strategy = make sharing **easy, accurate, and embarrassment-free** — not incentivized with FOMO or cash rewards.

### Trigger moments to ask (operator-led, 1:1)

| Moment | Ask |
|--------|-----|
| After successful placement + positive follow-up | "If you know anyone researching seriously, our site explains our program — I'd welcome you sharing it if you felt comfortable." |
| After trainer/vet expresses satisfaction with a Blacksage dog | "Would this URL be useful for other clients in research mode?" |
| After club contact engages positively with site | "If our approach fits what you tell buyers to look for, feel free to pass the link along." |
| **Not** at first contact or before proof exists | Premature ask → referrer silence (v1 lesson) |

### Assets referrers need to share confidently

| Asset | Purpose | Tier |
|-------|---------|------|
| **Canonical site URL** | Single link for text, email, social paste | Always |
| **Health/Education page** | Deep link for buyers asking "what tests matter?" | Tier 1 |
| **Dogs page (when populated)** | Deep link for buyers asking "show me the program" | Tier 2 |
| **About page** | Operator identity and philosophy | Tier 2 when bio exists |
| **OG/social preview** | Credible snippet when URL unfurls in iMessage/Slack | Should S-12 |
| **One-paragraph program summary** (optional PDF or email blurb) | For trainers who forward introductions | Tier 1–2 only; operator-approved |

**Referrers do NOT need v1:**

- Referral codes or tracking links (feels transactional in this category)
- Commission or finder fees (creates wrong incentive alignment)
- "Limited spots" urgency copy
- Puppy photos without verified context
- Price sheets or deposit information

### How to ask without FOMO tactics

| Do | Don't |
|----|-------|
| "Share if it fits someone you know in research mode" | "Only 2 spots left — tell your friends!" |
| "The site explains our health and placement approach" | "Get on the list before it's too late" |
| "No obligation — only if you'd stake your name on it" | "Earn rewards for referrals" |
| Frame selectivity as mutual fit | Frame scarcity as marketing pressure |
| Thank referrers privately when inquiry cites them | Public leaderboard of referrers |

### Referral loop (organic, no platform v1)

```
Trigger moment (post-placement, positive trainer interaction)
  → Operator personal ask (1:1, not mass email)
  → Referrer shares canonical URL or deep link
  → Buyer lands on trust-first site (shortlist → verify)
  → Inquiry form captures "How did you hear about us?"
  → Operator thanks referrer on qualified inquiry (not on junk leads)
  → Relationship strengthened for future passive referrals
```

**No formal referral program, affiliate platform, or double-sided rewards in Phase 6 base case.** If volume justifies structure later, revisit after M5 baseline established (≥1 referrer sharing without prompt).

---

## 4. Launch PR outline by tier

Launch PR is **credibility sequencing**, not a media splash. Each tier gates what external audiences see.

### Tier 0 — Internal (staging)

| Element | Rule |
|---------|------|
| **Public PR** | **None.** No social announcement, no club outreach, no referrer distribution. |
| **Audience** | Operator, build team, QA (Phase 10) |
| **Purpose** | Validate PRD failure-layer AC (V, E, T, U) before any external exposure |
| **Content allowed** | Tier 1 copy only; lorem explicitly marked non-production |
| **Blocked** | Public index, production form destinations, Tier 2/3 claims, referrer URLs in the wild |
| **Exit gate** | `AC-GATE-001` + operator review of claim inventory |

### Tier 1 — Brand-first (Q1 = pre-litter / coming-soon)

| Element | Plan |
|---------|------|
| **Public PR posture** | **Quiet credibility launch** — site goes live; no press release, no paid placement |
| **Announcement** | Optional low-key post on operator-owned social (if used): "Our program site is live — it explains our ADRK-aligned approach and health commitments. Breeding stock profiles coming as verified." Honest scope only. |
| **Interest list** | Package A live; conversion = join interest list, not waitlist/deposit |
| **Referrer activation** | **Selective, 1:1** — share URL with 2–3 trusted contacts (trainer, mentor, prior relationship) for sniff test (M5) before wider distribution |
| **Club/network outreach** | **Soft intro only** — no directory submissions claiming active breeding; no litter announcements |
| **Earned media** | **Skip.** No journalist pitching pre-proof. Category has no "startup launch" narrative. |
| **Minimum live sections** | Home, About, Health/Education, Contact/Interest list; Dogs = honest empty state |
| **Messaging anchor** | "Evidence-led program in development — inquiry and interest list open for serious researchers" |

**Tier 1 launch checklist (PR):**

- [ ] Operator sign-off on all published claims (LG1)
- [ ] Referrer sniff test passed (T7, M5)
- [ ] Zero Tier 3 violations (M7)
- [ ] Inquiry destination live (Q7)
- [ ] No price, deposit, litter, or geography claims beyond verified facts
- [ ] Social/OG preview reviewed for credible unfurl

### Tier 2 — Active program (Q1 = active breeding + verified inventory)

| Element | Plan |
|---------|------|
| **Public PR posture** | **Controlled announcement** when verified dogs, health links, and photography exist |
| **Announcement** | Operator-owned channels: site update noting breeding stock and health transparency now published; still no price or availability countdown |
| **Referrer activation** | Expand 1:1 outreach to trainer/club network; provide deep links to Dogs and Health pages |
| **Club/network outreach** | Consider club newsletter **education contribution** (not ad): e.g., "Health tests we publish and why" — only with verifiable Tier 2 content |
| **Earned media** | **Optional, low priority:** local pet/breed press only if operator has a genuine human story + verifiable proof; pitch under 150 words; story = responsible breeding trend, not "new kennel open" |
| **Litters section** | Live only when operator confirms litter facts; **no price**; inquiry CTA only |
| **Waitlist** | Package B when operator policy confirmed; deposit language off-site, post-approval |

**Tier 2 gate — do not announce until:**

- Named dogs with operator-supplied photos and permitted claims
- Per-dog health links where inventory exists (or category-only if not)
- Q6 photography satisfied for hero and dog pages
- Operator written approval of Tier 2 claim inventory

### What never happens (any tier)

- Mass media splash before proof
- Press release distribution service / newswire spend
- "Grand opening" puppy event marketing
- Influencer or paid pet-account sponsorship (Phase 19 skipped)
- FOMO scarcity campaigns tied to launch
- Claiming memberships, titles, geography, or pricing not verified

---

## 5. Co-marketing / borrowed channel list

All co-marketing is **win-win, proof-aligned, and organic.** No invented named partners. Geography-specific execution deferred until Q2.

### Prioritized borrowed channels

| Priority | Channel type | Win for partner | Win for Blacksage | Pitch angle | Tier gate |
|----------|-------------|-----------------|-------------------|-------------|-----------|
| **1** | **Rottweiler-experienced trainers** | Credible breeder to recommend; educates their clients | Qualified referrals; temperament-fit leads | "Our site helps your clients do due diligence before they contact us — saves you screening time" | Tier 1 minimum; Tier 2 for dog deep links |
| **2** | **Breed club education channels** | Content that helps buyers avoid puppy mills | Borrowed authority; reach to serious buyers | Co-contribute buyer-education aligned with AMRRC/AKC guidelines — **not** kennel advertising | Tier 1 content only unless club invites kennel feature |
| **3** | **Working/sport club newsletters or training orgs** | Working-line buyer education | Sport/working sub-segment reach | "How we evaluate temperament and structure for working homes" — when operator has Tier 2 proof | Tier 2 |
| **4** | **Veterinary clinics (relationship-based)** | Client education on choosing ethical breeders | Local trust signal when geography known | Provide Tier 1 health literacy handout or link to Health/Education page | Q2 for local; Tier 1 content |
| **5** | **Prior puppy owners (when exist)** | Stay connected to program they believe in | Testimonials + referrals | Life-update check-ins; ask for share only after positive experience | Tier 2+; verified testimonials only (C-03) |
| **6** | **Show/conformation network** | Structure/type discourse | Conformation-credibility buyers | Personal introductions at events; no claims until titles verified | Tier 2 |
| **7** | **Breed-health education platforms** | Accurate Rottweiler health content | SEO + credibility adjacency | Guest literacy content citing OFA/CHIC/ADRK — no kennel superlatives | Tier 1 |
| **8** | **Local pet media / regional breed press** | Human-interest responsible-breeding story | Earned local legitimacy | Operator story + verifiable health program — **not** puppy sale angle | Tier 2; optional |

### Co-marketing formats (ranked by fit)

| Format | Effort | Lead sharing | Best for |
|--------|--------|--------------|----------|
| **Referrer URL share (trainer → client)** | Low | Partner keeps relationship; Blacksage gets inquiry | P1 trainers |
| **Guest Q&A in club/trainer newsletter** | Low | Shared education; no lead split needed | P2 clubs |
| **Co-authored buyer checklist (PDF/web)** | Medium | Both link to resource | P2 clubs, P7 health education |
| **Joint workshop (virtual): "Evaluating Rottweiler breeders"** | High | Each keeps own audience | P2 clubs when operator ready for visibility |
| **Case study: placement success (verified owner)** | Medium | Owner consent required | P5 prior owners |
| **Event presence (show, sport trial)** | Medium | In-person relationships | P6 show/working |

**Deferred until Q2 confirmed:** local vet co-marketing, regional club directory listings, geo-targeted community posts.

### Win-win pitch templates (Tier 1 safe)

**Trainer outreach:**

> Subject: Resource for your Rottweiler research clients
>
> I work with [or am building] Blacksage Kennels — ADRK-aligned Rottweiler program. We published a health-and-standards education section on our site that mirrors what you already tell clients to verify (OFA/CHIC categories, temperament screening concepts). If it's useful, feel free to share [URL] with clients in research mode — no puppy advertising, just due-diligence content.

**Club education contribution:**

> Subject: Buyer-education content idea
>
> I noticed [club/newsletter] publishes guidance for serious Rottweiler buyers. I'd be glad to contribute a short piece on [health test categories / reading OFA results / ADRK temperament bounds] — educational only, aligned with AMRRC buyer guidelines. No kennel promotion unless you prefer a brief program note at the end.

### What we do not pursue

- Paid co-marketing spend or sponsored newsletter placements
- Cross-promotion with puppy marketplaces or classified sites
- Partnerships with guard-dog / protection training brands
- Giveaways, contests, or "free puppy consultation" funnels
- Integration/partner pages implying affiliations not verified

---

## 6. Crisis / anti-patterns

### Reputation threat matrix

| Threat | How it manifests | Prevention | Response if it happens |
|--------|------------------|------------|------------------------|
| **Puppy-mill association** | Price-forward posts, availability spam, forum puppy ads, checkout UX | A10, W-09, forum rules above; no price on site ever | Cease promotional activity; remove offending posts; publish nothing until operator statement clarifies selective placement model |
| **Aggression marketing backlash** | Guard-dog language, protection hype, machismo imagery/copy | T5, Pillar 2 voice bounds; operator review of all copy | Immediate takedown of offending content; restate ADRK temperament bounds publicly if correction needed |
| **Hollow-site referrer silence** | Referrers won't share; negative word-of-mouth ("all sizzle") | Tier 1 minimum before external PR; M5 sniff test | Pause outreach; fix content gaps; re-approach referrers only after T7 passes |
| **Unverifiable claim exposure** | Community fact-check finds invented OFA, title, or club claim | SD5 Tier discipline; operator sign-off LG1 | **Correct immediately** — remove claim, post correction if already public, personal apology to affected referrer/club contact |
| **Deposit/trust inversion** | Deposits requested before relationship established | Package A until trust built; off-site deposit only post-approval | Refund per operator policy; clarify process in writing |
| **v1 pattern relapse** | Scroll-3D, apply-first, placeholder dogs return | SD4, SD6, SD7; PRD AC gates | Block public launch until rebuild passes QA |
| **Social pile-on from wrong buyer segment** | Anti-persona complaints ("won't sell me a puppy now") | Education + anti-persona filtering in copy and form | Do not engage defensively; reaffirm selective placement; no price negotiation in public |

### Response principles

1. **Speed on factual corrections; silence on trolls.** If Blacksage published something wrong, fix it within 24 hours. If an anti-persona complains about selectivity, do not debate publicly.
2. **Operator voice, not corporate PR voice.** Responses come from the breeder, personally — not a press@ alias (unless operator prefers).
3. **Never argue temperament or health claims in comments.** Point to published Tier 1 education or offer private conversation for qualified inquirers.
4. **No "revolutionary" or defensive superlatives.** Correction = facts, not counter-attack.
5. **Document incidents.** Log what was claimed, corrected, and who was notified — feeds M7 audit and future QA.

### Anti-patterns catalog (do not execute)

| # | Anti-pattern | Category |
|---|--------------|----------|
| AP-01 | Puppy availability posts in Facebook groups / breed forums | Community |
| AP-02 | "Starting at $X" in any channel | Pricing |
| AP-03 | FOMO timers, "only X puppies left," countdown widgets | Scarcity |
| AP-04 | Guard-dog, protection, weapon, attack language | Temperament |
| AP-05 | Invented ARC/ADRK membership badges on site or social | Claims |
| AP-06 | Stock photos labeled as Blacksage dogs | Media |
| AP-07 | Press release newswire blast at launch | Earned media |
| AP-08 | Paid pet influencer sponsorship | Paid |
| AP-09 | Referral commission or affiliate program at launch | Referrals |
| AP-10 | Astroturfed reviews or testimonials | Social proof |
| AP-11 | Sharing staging / incomplete URL with referrers | Process |
| AP-12 | Arguing with critics in public comment threads | Crisis |
| AP-13 | Pitching journalists before Tier 2 proof exists | Launch |
| AP-14 | Listing on puppy marketplace / broker directories | Channel |
| AP-15 | Deposit collection before qualification conversation | Trust |

---

## 7. PR metrics

PR success is measured by **reputation integrity and referral quality** — not press clips or impressions.

### Primary metrics (report monthly post-launch)

| ID | Metric | Definition | Target (12-mo hypothesis) | Source |
|----|--------|------------|---------------------------|--------|
| **PR-M1** | Referrer shareability (M5) | ≥1 referrer (trainer, prior owner, club contact) willing to share URL **without caveat** | ≥1 confirmed | Operator interview + form field |
| **PR-M2** | Qualified inbound from network | Inquiries citing referral source (trainer, club, prior owner, show contact) | Baseline TBD post-launch; quality > volume | Form "How did you hear about us?" |
| **PR-M3** | Zero reputation incidents | No confirmed Tier 3 claim published; no puppy-mill association events; no aggression-marketing backlash | **0** incidents | QA audit + operator report |
| **PR-M4** | Referrer sniff test pass (T7) | Operator/PM assessment: URL shareable without apologizing for hollow content | Pass before Tier 1 external PR | Pre-launch checklist |
| **PR-M5** | Claim audit clean (M7) | 100% published claims map to Tier 1–2 with operator sign-off on Tier 2 | 100% | Content QA |

### Secondary metrics (track, do not optimize)

| ID | Metric | Why track | Why not primary |
|----|--------|-----------|-----------------|
| **PR-S1** | Referral-sourced inquiry % | Shows network channel contribution | Volume meaningless if unqualified |
| **PR-S2** | Repeat referrer shares | Relationship depth signal | N may be small for selective kennel |
| **PR-S3** | Social followers / post reach | Awareness proxy | Does not predict placement quality |
| **PR-S4** | Education page time-on-page | Content engagement | Vanity without inquiry conversion |
| **PR-S5** | Earned media placements | Activity baseline | **Explicitly deprioritized** — local optional only at Tier 2 |

### Explicitly NOT success metrics

| Vanity metric | Why excluded |
|---------------|--------------|
| Press hit count / AVE | PR firms' invented metric; no conversion link in this category |
| Total impressions / reach | Awareness without trust is worthless; attracts anti-persona |
| Social follower growth rate | Followers ≠ qualified buyers |
| Form submission volume alone | M4 = quality > volume; junk leads damage operator time |
| Website traffic spikes from paid | Phase 19 skipped; spikes from wrong audience harm reputation |
| Directory listing count | Puppy directories are negative signal in ethical tier |

### Measurement cadence

| Phase | Cadence | Owner |
|-------|---------|-------|
| Pre-launch (Tier 0→1) | PR-M4, PR-M5 once before external exposure | Operator + QA |
| First 90 days post-launch | PR-M1–M3, PR-S1 monthly review | Operator |
| Ongoing | PR-M3 continuous; PR-M2 quarterly trend | Operator |
| 12-month review | All primary metrics vs hypothesis (Q4) | CMO + operator |

### Success definition (PR slice of GTM)

> Blacksage PR is working when a trainer or club contact shares the URL confidently, qualified inquiries arrive with referral attribution, and **zero** reputation incidents occur from claim violations or category anti-patterns — regardless of whether any journalist ever writes a story.

---

## Downstream notes for CMO merge

- Align PR tier gates with PRD staged launch (Tier 0/1/2) and packaging map (A/B/C).
- SEO and content strategists (Phase 14) own education-page depth; PR owns relationship channel and referrer enablement.
- Copy chief (Phase 13) enforces Tier 1–3 voice bounds in all external-facing text.
- Phase 19 paid media remains out of scope — do not add paid PR line items without operator request.
- Revisit formal referral program only after M5 baseline met and operator confirms volume justifies structure.

---

## Sources

- `docs/projects/blacksage-kennels/business-idea/05-prd.md`
- `docs/projects/blacksage-kennels/business-idea/03-strategy.md`
- `docs/projects/blacksage-kennels/business-idea/04-business-model.md`
- `docs/projects/blacksage-kennels/business-idea/02-market-research.md`
- `docs/projects/blacksage-kennels/business-idea/.agents/product-marketing.md`
- `skills/community/marketingskills/public-relations/SKILL.md`
- `skills/community/marketingskills/referrals/SKILL.md`
- `skills/community/marketingskills/co-marketing/SKILL.md`
