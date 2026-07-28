# 08 Operations & Legal

**Phase:** 8  
**Status:** draft — ready for C-suite review  
**Last updated:** 2026-07-27  
**Author:** coo (merge); ICs: ops-manager, legal-counsel  
**Reports to:** ceo-strategist  
**Venture:** Blacksage Kennels  
**Mode:** ops runbook + risk checklist (C-suite gate; phase not marked complete)

---

> **⚠️ NOT LICENSED LEGAL ADVICE**
>
> This document is an **internal operations and compliance checklist** for Blacksage Kennels venture planning. It is **not** a substitute for advice from a licensed attorney in the operator’s jurisdiction(s). Contract terms, deposit/refund policies, consumer-protection obligations, privacy notices, and any public-facing legal copy must be **reviewed and finalized by licensed counsel** before go-live. Placeholders marked `[Operator to set]` or `[Attorney to draft]` must not be filled with invented Blacksage terms.

---

## Executive summary

Phase 8 defines how Blacksage Kennels **runs day to day** (kennel care + website inquiry/content ops) and what **legal/risk controls** must be checked before public launch. Ops owns cadence, ownership, and checklists; sales scripts stay in `07-sales-playbook.md`; licensed counsel finalizes contracts, deposit/refund terms, and privacy notice text.

**Scorecard coverage:**

| Area | What’s in this doc |
|------|-------------------|
| **Ops** | Kennel daily/weekly/litter checklists; inquiry intake (Q7); content update cadence (SD5); privacy data lifecycle SOP; vendor placeholders |
| **Risk** | SD5 claim checklist; OP-P2/P6 deposit/contract flags; disclaimer/consent drafts; web-form PII controls; pre-launch attorney-review list |

**Hard constraints:** D2 trust-first · Package A/B/C · A10 (no on-site prices/payments) · SD5 claim tiers · Phase 7 monetization sequencing · **8B skip** (no hires at v1).

### Monetization sequencing (locked — risk control)

```
Trust content → Inquiry → Qualification (off-site) → Price (off-site)
  → Deposit (off-site, post-approval) → Contract → Placement → Go-home CS
```

Form submission ≠ reservation, approval, or payment obligation.

---

## 1. Operations scope and principles

### What Phase 8 covers

| In scope | Out of scope |
|----------|--------------|
| Kennel daily / weekly / litter-cycle checklists | Sales talk tracks (`07-sales-playbook.md`) |
| Website inquiry ownership and cadence | Full contract drafting (`[Attorney to draft]`) |
| Content update cadence + SD5 enforcement | Copy writing (Phases 13–14) |
| Inquiry data handling SOP (ops level) | Build implementation (Phase 9 / CTO) |
| Vendor / tool checklist placeholders | Hiring plan (`08b-people-plan.md` — **skip**) |
| Legal/risk checklists + attorney flags | Invented deposit amounts or refund law |

### Operating principles (inherited locks)

| Lock | Ops / legal implication |
|------|-------------------------|
| **D2 / SD3** | Site earns trust → inquiry; ops supports qualification, not volume |
| **SD5** | Publish only operator-verified facts; honest coming-soon when absent |
| **Package A/B/C** | Route by package; never auto-upgrade from form alone |
| **A10** | No on-site prices, payments, or deposit amounts |
| **Q7** | Inquiry destination + owner blocks public launch |
| **OP-P2 / OP-P6** | Deposit and contract terms attorney-drafted; site stays generic |

### RACI legend and default roles (v1 — single operator)

| Code | Meaning |
|------|---------|
| **R** | Responsible |
| **A** | Accountable |
| **C** | Consulted |
| **I** | Informed |

| Role | Holder |
|------|--------|
| **Operator** | Kennel owner / primary decision-maker |
| **Ops backup** | `[Operator to set]` — optional |
| **Legal** | Licensed counsel (privacy notice, contracts); this doc = checklist only |
| **Build** | CTO / tech-lead (form backend, deploy) |

---

## 2. Kennel operations

### 2.1 Daily checklist

**Frequency:** Every day dogs are on premises · **R/A:** Operator

| # | Task | Pass criteria | Notes |
|---|------|---------------|-------|
| D1 | Visual health check — all dogs on premises | Appetite, mobility, eyes/ears, stool normal | Document anomalies; vet if urgent |
| D2 | Fresh water available and clean | All access points checked | |
| D3 | Feeding per operator nutrition plan | Per `[Operator to set]` protocol | |
| D4 | Exercise / enrichment | Per `[Operator to set]` standard | Match age, heat, health |
| D5 | Kennel / yard sanitation | Waste removed; no hazards | |
| D6 | Security check | Gates, latches, perimeter secure | |
| D7 | Record health / behavior notes | Log in `[Operator to set location]` | |
| D8 | Inquiry queue scan (if public site live) | New submissions flagged for triage (§3) | Cross-ref playbook Part II |

**Exception:** If no dogs on premises, reduce to security + facility check; document schedule gap.

### 2.2 Weekly checklist

**Frequency:** Once per calendar week · **R:** Operator

| # | Task | Pass criteria |
|---|------|---------------|
| W1 | Deep clean high-traffic areas | Floors, bowls, bedding |
| W2 | Inventory — food, supplies, meds | Reorder before stockout |
| W3 | Review health / vet schedule | Appointments confirmed; **no invented health claims for site** |
| W4 | Breeding stock condition review | Supports Tier 2 Dogs updates when verified |
| W5 | Inquiry log review | Open threads tagged; SLA per `[Operator to set]` |
| W6 | Website content drift check | No outdated Tier 2; coming-soon still accurate (§4) |
| W7 | Vendor / tool health check | Email, form test submit, backup access (§6) |
| W8 | Social / borrowed channel (if active) | Align GTM — no price/FOMO; skip if none |

### 2.3 Litter-cycle checklist

**Trigger:** Operator confirms active litter planning or whelping. **Do not publish litter facts until operator-verified (SD5 Tier 2).**

#### Phase A — Pre-breeding

| # | Task | Owner | Gate |
|---|------|-------|------|
| L-A1 | Confirm health clearances current for sire and dam | Operator (A) | Per-dog links only when inventory exists |
| L-A2 | Document pairing rationale | Operator (R) | Internal |
| L-A3 | Update waitlist posture if Tier 2 live | Operator (R) | No litter dates on site until verified |
| L-A4 | Review inquiry queue capacity | Operator (R) | `[Operator to set]` max concurrent B apps |

#### Phase B — Pregnancy / pre-whelp

| # | Task | Owner | Gate |
|---|------|-------|------|
| L-B1 | Vet / whelping plan confirmed | Operator (A) | `[Operator to set vet relationship]` |
| L-B2 | Whelping supplies staged | Operator (R) | |
| L-B3 | **Do not** announce litter until facts verified | Operator (A) | SD5 |

#### Phase C — Whelping through placement

| # | Task | Owner | Gate |
|---|------|-------|------|
| L-C1 | Daily dam and litter monitoring | Operator (R) | Document weights, concerns |
| L-C2 | Puppy health protocol per operator + vet | Operator (R) | Go-home docs |
| L-C3 | Early temperament / handling notes | Operator (R) | Not guard-dog framing |
| L-C4 | Match waitlist to litter (Package C) | Operator (A) | Playbook §1.3 C1–C8 |
| L-C5 | Go-home documentation bundle | Operator (R) | Playbook Part III |
| L-C6 | CS handoff for placed families | Operator (R) | Playbook |
| L-C7 | Site update — litter / Dogs | Operator (A) | Tier 2 + LG1 sign-off |

#### Phase D — Post-placement closeout

| # | Task | Owner |
|---|------|-------|
| L-D1 | Archive litter records | Operator (R) |
| L-D2 | Update site — litter placed / archived | Operator (A) |
| L-D3 | Alumni consent for photos / testimonials | Operator (A) — no publish without written consent |
| L-D4 | Referral loop — post-placement only | Operator (R) — playbook |

### 2.4 Kennel ops RACI (summary)

| Activity | Operator | Ops backup | Legal | Build |
|----------|----------|------------|-------|-------|
| Daily dog care | R/A | C | — | — |
| Health / vet decisions | R/A | I | — | — |
| Breeding / litter decisions | R/A | I | — | — |
| Placement matching | R/A | C | C (contract) | — |
| Inquiry triage | R/A | C | — | — |
| Site content publish (Tier 2) | A | R | C (claims) | R (deploy) |
| Privacy / data requests | R | C | A (counsel) | C |

---

## 3. Website operations — inquiry handling

> **Cross-reference:** Response SLAs, triage tags, auto-reply templates, and follow-up sequences live in **`07-sales-playbook.md` Part II**. Ops owns **ownership, cadence, and checklist enforcement** — not script duplication.

### 3.1 Inquiry intake ownership (Q7)

**Gate:** Public launch blocked until Q7 is closed (PRD LG2).

| Element | Owner | Action |
|---------|-------|--------|
| **Primary owner** | Operator | `[Operator to set name]` |
| **Form destination** | Operator | `[Operator to set: email / form backend / CRM webhook]` |
| **Primary channel** | Email (default) | Phone optional for qualified follow-up |
| **Auto-acknowledgment** | System (if enabled) | Templates in playbook |
| **Backup if owner unavailable** | `[Operator to set]` | Document in Q7 closure |
| **Business hours** | `[Operator to set]` | Used for SLA copy |

**Routing rules:**

1. All submissions → operator-defined Q7 destination — no client-only mailto in production.
2. Package A vs B by Q1 tier and form mode — not auto-upgraded.
3. Referral source logged at intake.
4. No SMS or live chat required at v1.

### 3.2 Triage cadence

```
Form submit
  → Auto-ack (if enabled) — system
  → Operator review — [Operator to set: e.g., daily AM + PM scan]
  → Tag: qualified / neutral / anti-persona
  → Route to playbook follow-up path
  → Log in inquiry CRM / spreadsheet
```

| Cadence | Action | SLA target |
|---------|--------|------------|
| **Intake scan** | Read new submissions | `[Operator to set: e.g., 24–48 business hours]` |
| **Qualified — first personal response** | Email or phone | `[Operator to set]` |
| **Neutral — nurture** | Education-forward | `[Operator to set]` |
| **Anti-persona — decline** | Single polite email | `[Operator to set]` |
| **Weekly queue hygiene** | Close stale; re-tag dormants | Weekly (W5) |

**Triage checklist (each submission):**

- [ ] Read full message and household context
- [ ] Check experience and activity goals
- [ ] Note referral source
- [ ] Confirm package type (A vs B) matches Q1
- [ ] Tag: qualified / neutral / anti-persona
- [ ] Log in `[Operator to set: CRM / inquiry log]`
- [ ] Route to correct sequence — **no price or deposit until B approval**

### 3.3 Auto-reply ownership

| Element | Owner |
|---------|-------|
| Enable / disable auto-reply | Operator (A) |
| Package A / B templates | Operator configures (playbook) |
| Form success state | Build deploys; operator approves copy |
| SLA placeholder in ack copy | Operator sets once Q7 closed |

**Prohibited in auto-reply:** prices, deposit amounts, “you're approved,” litter urgency, placement confirmation.

**Pre-launch test:** Submit test A and B forms; confirm destination, auto-reply, success state.

### 3.4 Website ops RACI — inquiry

| Activity | Operator | System / build | Legal (counsel) |
|----------|----------|----------------|-----------------|
| Q7 destination config | A | R | I |
| Auto-reply content approval | A | R (send) | C (consent copy) |
| Triage and tagging | R/A | I | — |
| Follow-up emails | R | — | — |
| SLA copy on site | A | R | C |
| Privacy link on Contact | A | R | A (notice text) |

---

## 4. Content update cadence (SD5)

### 4.1 Claim tiers (ops enforcement)

| Tier | What | Ops rule |
|------|------|----------|
| **1 — Safe** | Breed/standard facts, health categories, process | May publish |
| **2 — Operator-dependent** | Named dogs, clearances, geography, litters, photos | **Operator sign-off before publish (LG1)** |
| **3 — Prohibited** | Prices, unlinked OFA, fake dogs, superlatives, stock photos as proof | **Never publish** |

Full risk detail: §8 Legal & risk.

### 4.2 Update cadence by surface

| Surface | Trigger | Cadence | Tier gate |
|---------|---------|---------|-----------|
| **Home** | Facts or tier promotion | When Tier 2 arrives; quarterly review | 1–2 |
| **Dogs** | New named dog / photo / clearance | Within `[Operator to set: e.g., 5 business days]` of verification | 2 |
| **Dogs** empty state | Q1 brand-first | Monthly accuracy check | 1 |
| **Health/Education** | Education / categories | Launch + **quarterly review** | 1 |
| **Health** per-dog links | Registry URLs | When operator provides | 2 |
| **About** | Bio, geography (Q2), contact | When Q2 closed | 2 |
| **Litters** | Verified litter facts only | Litter-cycle Phase C; remove when placed | 2 |
| **Contact/Inquire** | Q7, SLA, package mode | Before public launch; on Q1 change | 1 |
| **Privacy notice** | Counsel provides | When published | — |

**Tier promotion:** Tier 1 → Tier 2 when Q1 active + health inventory + Q6 photos + Dogs populated + operator sign-off.

### 4.3 Pre-publish checklist — SOP-OPS-001

| # | Check | Pass |
|---|-------|------|
| C1 | Maps to Tier 1 or 2 — not Tier 3 | ☐ |
| C2 | Named dog: operator name, photo, permitted claims | ☐ |
| C3 | Health claim: registry link live and matches dog | ☐ |
| C4 | Geography / contact: Q2 confirmed if location claimed | ☐ |
| C5 | Litter: operator-verified dates, counts, status | ☐ |
| C6 | No price, deposit, or “available now” (A10) | ☐ |
| C7 | No guard-dog / aggression marketing | ☐ |
| C8 | Operator written sign-off recorded | ☐ |
| C9 | Staging review before production | ☐ |

**Rollback:** If Tier 3 or unverified Tier 2 discovered live, revert within `[Operator to set: e.g., 24 hours]`; document for M7 audit.

---

## 5. Privacy and inquiry data handling — SOP-OPS-002

> **Not legal advice.** Operational handling only. Licensed counsel owns privacy notice text, consent wording, and jurisdictional compliance. See also §8.4.

**Owner:** Operator (R/A) · **Consulted:** counsel (notice, retention)  
**Scope:** Website inquiry form + subsequent off-site qualification / placement communication.

### 5.1 Data collected (qualification fields only)

| Category | Examples | Purpose |
|----------|----------|---------|
| Identity | Name, email, phone (optional) | Respond |
| Location | City / state or region | Fit / logistics |
| Qualification | Experience, household, goals, timeline, message | Mutual fit |
| Package B extended | Preferences, references, agreement ack | Waitlist consideration |
| Consent | Inquiry-is-not-reservation checkbox | Expectation setting |
| Referral | How did you hear? | Analytics — qualified thank-you only |
| Technical | Timestamp, honeypot, rate-limit metadata | Spam prevention |

**Not collected on site:** Payment data, SSN, deposit amounts, puppy price, government ID.

### 5.2 Collect → store → access → retention → delete

| Stage | Rules |
|-------|-------|
| **Collect** | HTTPS; server validation; honeypot + rate limit; consent required; privacy notice linked when counsel provides |
| **Store** | `[Operator to set: CRM / secure email / spreadsheet]`; no PII in URLs; secrets in env; access = Operator + `[Operator to set backup]` only |
| **Access** | Inquiry owner for follow-up; **do not share buyer PII with referrers**; alumni/testimonials only with written consent; no sale of leads |
| **Retention** | `[Operator to set]` / counsel guidance — placeholders: active while relationship open; declined `[Operator to set: e.g., 12 months]`; dormant neutral `[Operator to set: e.g., 90 days]`; placed buyers life-of-dog + contract minimum |
| **Delete** | On request (verify identity), retention expiry, or spam discard; confirm to requestor; log action without retaining deleted PII |

### 5.3 Breach / incident (ops)

1. Contain (rotate credentials, disable compromised integration)  
2. Notify operator immediately  
3. Consult licensed counsel for notification obligations  
4. Document timeline — do not notify affected parties until counsel advises  

---

## 6. Vendor and tool checklist

**Do not invent vendor names** — operator selects stack. Configure and test before public launch.

| # | Category | Selected | Blocks launch? |
|---|----------|----------|----------------|
| V1 | Domain / DNS | `[Operator to set]` | Yes |
| V2 | Hosting / deploy | `[Operator to set]` | Yes |
| V3 | Business email | `[Operator to set]` | Yes (Q7) |
| V4 | Form backend | `[Operator to set]` | Yes (Q7) |
| V5 | CRM / inquiry log | `[Operator to set]` | Recommended |
| V6 | Auto-reply | Via V3 or V4 | Should-have |
| V7 | Analytics | `[Operator to set]` — Phase 16 | No at Tier 1 |
| V8 | Spam protection | Honeypot + `[Operator to set: optional CAPTCHA]` | Yes |
| V9 | Backup / password manager | `[Operator to set]` | Recommended |
| V10 | Privacy notice hosting | On-site when counsel provides | Before collecting PII |

**Acceptance tests:** Form → destination (A+B); auto-reply content; HTTPS; validation errors; no secrets in client bundle.

**Cadence:** Weekly form/email spot-check (W7); quarterly subprocessor/access review; re-test on vendor change.

---

## 7. Operator launch gates (ops consolidated)

| Gate | Requirement | Blocks |
|------|-------------|--------|
| **Q7** | Destination + owner + SLA placeholders | Public launch |
| **Q1** | Tier 1 vs 2; Package A vs B | Form mode, triage |
| **Q2** | Geography / contact if claimed | About, LocalBusiness |
| **Q6** | Photography for Tier 2 dog pages | Named dog claims |
| **Privacy notice** | Counsel-approved text linked on Contact | PII collection |
| **Auto-reply tested** | Package A/B | Buyer expectations |
| **Inquiry log / CRM** | Tagging live | Audit trail |
| **SOP-OPS-001** | Tier 2 sign-off process | Content integrity |
| **OP-P1 / P2 / P3** | Price/deposit (off-site) | Sales conversations — not site |
| **OP-P6** | Contract / guarantee | Package C, CS escalation |
| **§8.5 attorney flags** | Counsel review of F1–F10 as applicable | Production index + live form |

---

## 8. Legal & risk

> **⚠️ NOT LICENSED LEGAL ADVICE** — see banner at top of this document. Contract, deposit, refund, privacy notice, and public legal copy require licensed counsel before go-live.

### 8.1 Marketing claims risk checklist (SD5)

**Rule:** Publish only what the tier allows. When facts are absent → honest coming-soon / interest-list — never invent.

#### Tier 1 — Generally publishable

| Claim type | Allowed | Risk control |
|------------|---------|--------------|
| Breed focus | German / ADRK-aligned; FCI No. 147 literacy | Do not imply Blacksage ADRK membership unless Tier 2 verified |
| Temperament (standard bounds) | Devoted, even-tempered, biddable | **No aggression / guard-dog / protection marketing** |
| Health **categories** | Hips, elbows, eyes, cardiac, JLPP as topics | Categories ≠ per-dog results |
| Process posture | Inquiry reviewed; selective placement | No “reserve now” / instant placement |
| Pricing posture | Discussed after qualification; not on site | **A10 — zero dollar amounts** |

#### Tier 2 — Operator-verified only

| Claim type | Requires | Pre-publish |
|------------|----------|-------------|
| Named breeding stock | Name + photo + permitted claims (LG1, Q6) | ☐ Written approval |
| Per-dog health clearances | Inventory + **live registry link** | ☐ Working OFA/CHIC URL |
| Club affiliations / titles | Membership/title docs | ☐ No badges without docs |
| Geography / LocalBusiness | Q2 confirmed | ☐ Region/phone only if Q2 closed |
| Program maturity / litters | Q1 active + inventory | ☐ Litters nav only when allowed |
| Public guarantee / return summary | OP-P6 attorney-drafted | ☐ Matches counsel or stays generic |
| Operator bio / tenure | Operator input | ☐ No invented years |

#### Tier 3 — Prohibited (launch blockers if present)

| Prohibited | Why | Mitigation |
|------------|-----|------------|
| On-site prices, deposit amounts, “starting at” | A10; deceptive-pricing exposure | Money talk off-site post-qualification |
| Litter dates / “puppies ready” without inventory | Invented availability | Honest empty state / interest list |
| OFA/CHIC without registry link | Unverifiable health marketing | Link or omit |
| Location before Q2 | Invented geography | Philosophy-only About |
| Stock / AI photos as Blacksage dogs | Fraudulent proof | Typographic empty state |
| Unproven superlatives | Unsubstantiated superiority | Cut or prove |
| Aggression / guard-dog marketing | Liability + anti-persona | ADRK temperament bounds only |
| Fake / coached testimonials | SD5 | Real consented only, or none |

#### Claims QA gate (pre-launch)

- [ ] 100% published claims map to Tier 1 or operator-signed Tier 2 (M7)
- [ ] Zero Tier 3 claims or media on production
- [ ] Health: categories OK; per-dog links only when verified
- [ ] CTAs: Inquire / Interest list — not Buy / Shop / Reserve / Apply now (above-fold)
- [ ] Social/GTM uses same tiers (no “DM for price,” FOMO, marketplaces)

### 8.2 Contracts, deposits, refunds, returns (OP-P2 / OP-P6)

> Do **not** invent Blacksage dollar amounts, refund windows, or guarantee language.

#### Sequencing (hard rules)

| Step | Where | Site may say | Site must not |
|------|-------|--------------|---------------|
| Trust | Website | Education + evidence | Invented proof |
| Inquiry | Form | Interest / inquire | Reservation confirmation |
| Qualification | Off-site | Process overview | Approval in auto-reply |
| Price | Off-site | “Discussed after qualification” | Any $ amount |
| Deposit | Off-site, **post-approval** | “May be required after approval; terms provided individually” | Collect payment; show amount |
| Contract | Off-site | Written agreement is used | Unreviewed full contract as marketing |
| Placement | Off-site | Process at high level | Confirm specific puppy in form success |

- Never collect deposit at inquiry or on website.  
- Never verbal-only deposit agreements.  
- Written terms **before** any payment request.

#### Deposit checklist — OP-P2

| # | Item | Owner | Status |
|---|------|-------|--------|
| D1 | Deposit purpose (waitlist vs placement credit) | Operator + Attorney | ☐ |
| D2 | Deposit **amount** — never on site | Operator | ☐ `[Operator to set]` |
| D3 | When requested (only post-approval) | Operator | ☐ |
| D4 | How collected (off-site method) | Operator | ☐ |
| D5 | Credit toward placement price | Attorney | ☐ `[Attorney to draft]` |
| D6 | Refund / forfeiture conditions | Attorney | ☐ `[Attorney to draft]` |
| D7 | Refund processing timeline if refundable | Attorney | ☐ Do not invent days |
| D8 | Non-transferability of waitlist position | Attorney | ☐ |
| D9 | Written acknowledgment before payment | Operator | ☐ |
| D10 | Site copy generic — no amount, no DIY refund window | Copy + Legal QA | ☐ |

**Allowed site language:** “A waitlist deposit may be required after application approval. Terms are provided individually.”

**Forbidden:** any `$`, “non-refundable” with invented window, “reserve with deposit,” payment links.

#### Placement contract checklist — OP-P6 `[Attorney to draft]`

| # | Item |
|---|------|
| C1 | Parties, governing law, venue — jurisdiction `[Operator to set]` |
| C2 | Dog identification when known (after match) |
| C3 | Purchase price / balance mechanics (off-site; amounts not on website) |
| C4 | Health documentation at go-home (align CS playbook; no overclaim) |
| C5 | Warranty / health guarantee scope and exclusions — no “lifetime guarantee” without counsel |
| C6 | Return / rehoming / cannot-keep provisions |
| C7 | Spay/neuter / co-ownership / breeding rights (if used) |
| C8 | Limitation of liability / animal-ownership risks |
| C9 | Photo/testimonial release |
| C10 | Signature / e-sign process; retain executed copies |

Until OP-P2/P6 close: use placeholders only (“terms provided individually,” “per operator contract”).

### 8.3 Website disclaimers & inquiry consent (DRAFT — not advice)

Site-facing drafts for operator + counsel to adapt. **Do not publish as final until attorney review (§8.5).**

#### Site-wide / footer (draft)

> Blacksage Kennels provides educational information about ADRK/FCI-aligned Rottweiler standards and our program philosophy. Content is for general information and does not constitute a veterinary, training, or legal opinion. Inquiry through this website is not a reservation, purchase, or guarantee of puppy availability. Placements are selective and subject to mutual fit and written agreement. Pricing and any deposit terms are discussed only after qualification and are never completed on this website.

#### Package A — Interest / inquiry consent (PRD)

**Required:** “I understand inquiry is not a reservation; placements are selective.”

**Optional expanded (draft):** “I understand that submitting this form does not reserve a puppy, approve me for a waitlist, or create a purchase obligation. Blacksage reviews inquiries individually. Pricing and any deposit or contract terms, if applicable, are discussed only after qualification and off this website.”

#### Package B — Waitlist acknowledgment (PRD — no amount)

**Required:** “I understand a waitlist deposit may be required after approval; terms provided individually.”

**Optional clarity (draft):** “I understand that form submission is not waitlist approval. If approved, I will receive written terms before any payment is requested. Deposit collection does not occur on this website.”

#### Health / education caution (draft)

> Health-testing categories described here reflect responsible-breeding practices and publicly available registry frameworks (e.g., OFA/CHIC). Individual dog results are published only when verifiable registry links are available. Always verify clearances independently and consult your own veterinarian.

**Success-state / auto-reply must not state:** waitlist approval, puppy reservation, price, deposit amount, or placement confirmation.

### 8.4 Privacy & inquiry PII checklist

| Control area | Requirement | Status |
|--------------|-------------|--------|
| **Minimization** | Qualification fields only; no payment/SSN/ID | ☐ |
| **Notice** | Privacy notice linked; counsel-drafted preferred | ☐ `[Attorney to draft]` |
| **Purpose** | Inquiry review, fit assessment, follow-up | ☐ |
| **Marketing email** | Separate consent if beyond transactional replies | ☐ |
| **Third parties** | Disclose form processor / email / CRM (Q7) | ☐ |
| **Storage** | Q7 destination before launch; access limited | ☐ |
| **Retention / deletion** | Periods + request path `[Operator to set]` | ☐ |
| **Security** | HTTPS; no public form dump | ☐ |
| **No sale of leads** | Do not sell/share inquiry lists | ☐ |
| **Alumni / testimonials** | Consent before naming or photos | ☐ |
| **Breach contact** | Operator + counsel `[Operator to set]` | ☐ |

Ops lifecycle detail: §5 SOP-OPS-002.

### 8.5 Pre-launch attorney-review flag list

**Launch gates** (production index + live inquiry form) — not Phase 8 document blockers.

| # | Item | Why counsel |
|---|------|-------------|
| F1 | Final privacy notice + form consent language | Privacy / marketing consent |
| F2 | OP-P2 deposit / refund / forfeiture agreement | Payment + refund obligations |
| F3 | OP-P6 placement contract, health guarantee, return/rehoming | Animal sale / warranty / liability |
| F4 | Public website disclaimer + footer legal links | Consumer-facing representations |
| F5 | Any public “guarantee” or “refund policy” summary | Marketing vs contract conflict |
| F6 | Testimonial / photo release templates | Likeness / privacy |
| F7 | Auto-reply + nurture if promotional | Anti-spam / consent |
| F8 | Business entity, DBA, contact identity on site | Accurate seller identity |
| F9 | Jurisdiction-specific breeding / pet-sale overlays | Home state + ship-to `[Operator to set]` |
| F10 | Claim inventory if health/performance marketing expands | Deceptive advertising risk |

**Do not invent in-house:** deposit dollar amounts · refund day counts · full contract clauses · governing-law without counsel · medical outcome guarantees.

---

## 9. Phase 8B — People and hiring

**Recommendation: SKIP `08b-people-plan.md` for v1.**

| Rationale | Detail |
|-----------|--------|
| Bootstrapped | Operator handles kennel ops + inquiry triage at expected Tier 1/2 volume |
| GTM discipline | Low-frequency, high-value path — not a call center |
| No invented roles | Do not spec hires without operator request |
| Future trigger | Revisit if volume exceeds `[Operator to set]` capacity or litter cycle needs staff |

---

## 10. Measurement (ops health)

| ID | Metric | Target posture |
|----|--------|----------------|
| **OPS-M1** | Daily checklist completion (dogs on premises) | `[Operator to set: e.g., 95%]` |
| **OPS-M2** | Inquiry SLA adherence | `[Operator to set: e.g., 90%]` |
| **OPS-M3** | Tier 3 content incidents | **0** (M7) |
| **OPS-M4** | Form / auto-reply failures at launch month | **0** |
| **OPS-M5** | Privacy request response time | `[Operator to set]` per counsel |
| **OPS-M6** | Q7 routing failures | **0** |

**Not success:** Raw inquiry volume · speed-to-price · auto-approval rate.

---

## 11. Anti-patterns (do not execute)

| Anti-pattern | Why |
|--------------|-----|
| Publishing litter/dog facts before verification | SD5 / reputation |
| Sharing buyer PII with referrers | Privacy |
| Alumni photos without consent | Privacy + SD5 |
| Unsecured inquiry storage | NFR-SEC |
| Skipping triage tag before follow-up | Wrong sequence; price leakage |
| Inventing SLA numbers in site copy | Q7 gate |
| Collecting payment via form or site | A10 |
| Treating this doc as licensed legal advice | Malpractice risk |
| Hiring plan without operator trigger | 8B skip |

---

## 12. Downstream handoffs

| Phase / seat | Uses this doc for |
|--------------|-------------------|
| **C-suite / orchestrator** | Yes/no on Phase 8; skip 8B |
| **CTO / Phase 9** | Form destination, honeypot, secrets, deploy checklist |
| **Phase 10 QA** | Tier 3 audit, form security, claim discipline |
| **Phases 13–14 copy** | Consent/disclaimer drafts; claim tiers |
| **Phase 16 analytics** | Referral field; no PII leakage |
| **Phase 22 operate** | Recurring cadence extension |
| **Licensed counsel** | §8.5 flag list before go-live |

---

## 13. Fact / inference / assumption labels

| Kind | Statement |
|------|-----------|
| **Fact** | PRD defines inquiry fields and consent; no on-site payment (A10) |
| **Fact** | Q7 blocks public launch without form destination |
| **Fact** | Phase 7 playbook owns SLAs, templates, triage tags |
| **Decision** | Ops owns cadence/checklists; sales owns scripts; counsel owns enforceable legal text |
| **Decision** | Recommend 8B skip — no hires v1 |
| **Inference** | Single-operator model sufficient at bootstrapped Tier 1/2 volume |
| **[Operator to set]** | SLA hours, retention, vendors, backup contact, vet relationships, storage |
| **[Attorney to draft]** | Privacy notice, OP-P2/P6 terms, public disclaimers finalized |

---

## IC merge notes

| IC | Handoff | Merged |
|----|---------|--------|
| `ops-manager` | `HANDOFFS/8-ops-manager.md` | §§1–7, 9–11 kennel/website ops, privacy SOP, vendors, 8B skip |
| `legal-counsel` | `HANDOFFS/8-legal-counsel.md` | Banner + §8 claims, contracts, disclaimers, privacy checklist, attorney flags |

**Conflicts resolved:**

- **Privacy ownership:** Ops SOP-OPS-002 = process lifecycle; legal §8.4 = risk checklist + counsel-draft notice. Both retained; counsel owns final notice text.
- **Consent copy:** Legal drafts (§8.3) are canonical for site; ops auto-reply section references playbook + prohibits approval language.
- **8B:** Both ICs recommend skip — COO locks skip recommendation for C-suite.
- **Legal pack unavailable:** Noted; proceeded with SD5 / PRD claim framing — no phase block.

---

## Sources

- `07-sales-playbook.md`, `05-prd.md`, `06-gtm-plan.md`, `03-strategy.md`
- `.agents/product-marketing.md` — claim tiers
- Packs: sop-builder, process-optimization, project-status-report
- Legal pack `06-legal/` unavailable/empty — used strategy/PRD claim discipline + standard consumer-protection framing
