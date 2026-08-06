---
phase: "8"
position: ops-manager
reports_to: coo
status: done
verdict_for_manager: ready_to_merge
llm_tier: fast-ops
llm_model: composer-2.5-fast
generation_profile: none
generation_used: none
fallback_applied: false
---

# Handoff — Phase 8 Ops & Legal (Ops Manager craft) → COO

## Goal (from context packet)

Produce merge-ready kennel ops + website ops runbook content for COO merge into `08-operations.md`. Cover kennel ops checklist, website ops (inquiry handling cadence aligned to Phase 7 playbook, content update cadence, privacy/data handling for web form at ops level). Do NOT invent SLA numbers, prices, deposits, location, or health inventory — use `[Operator to set]` placeholders. Skip hiring (8B).

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/8-ops-manager.md` | This handoff — merge-ready ops craft for COO → `08-operations.md` |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | fast-ops |
| llm_model | composer-2.5-fast |
| generation_profile | none |
| generation_used | none |
| fallback_applied | false — no fallback needed |

## Decisions

1. **8B skip recommended:** No hires at v1 launch — operator + existing tools sufficient for Tier 1/2 volume; defer `08b-people-plan.md` unless operator explicitly plans staff.
2. **Ops vs sales boundary:** Ops owns **cadence, ownership, checklists, and data handling**; sales scripts and templates remain in `07-sales-playbook.md` (cross-reference only, no duplication).
3. **Privacy SOP at ops level:** Document collect → store → access → retention → delete workflow; **legal-counsel** owns privacy notice text, disclaimer language, and jurisdictional compliance review.
4. **No invented stack:** Vendor/tool checklist uses placeholders — operator selects email, form backend, and CRM before launch (Q7).
5. **Claim discipline gate:** Any Dogs / Health / About update requires SD5 Tier 1/2/3 review before publish — ops checklist enforces, does not bypass operator sign-off (LG1).
6. **Kennel ops scope:** Daily/weekly/litter-cycle checklists cover standard ethical breeding operations without inventing Blacksage-specific health inventory, location, or vet relationships.

## Asks for manager (`ask_manager`)

- Peer help needed: `legal-counsel` for privacy notice draft, inquiry consent language review, and contract/disclaimer alignment with ops SOP | recommended before public launch
- Clarification needed: **Q7** (form destination, auto-reply enablement, CRM vs email-only) must be operator-closed before website ops go live | none blocking merge of ops craft

## Risks / blockers

| Risk | Mitigation |
|------|------------|
| Q7 unset at launch | Website ops §2 blocks public launch; staging-only until destination configured (PRD LG2, M-11) |
| Privacy notice missing | Ops SOP requires link on Contact/Inquire when operator provides; legal-counsel owns draft |
| Tier 3 claim published during content update | SD5 checklist on every Dogs/Health/About change; operator sign-off for Tier 2 |
| Inquiry data stored insecurely | Ops SOP mandates HTTPS transport, env secrets, access control — no PII in URLs |
| Alumni/referrer PII shared without consent | Explicit prohibition in privacy SOP; aligns Phase 7 referrer thank-you rule |
| Operator capacity single point of failure | 8B skip accepted; document escalation to `[Operator to set backup contact]` if applicable |

## Packs used

- `skills/community/awesome-claude-corporate-skills/07-operations/sop-builder/`
- `skills/community/awesome-claude-corporate-skills/07-operations/process-optimization/`
- `skills/community/awesome-claude-corporate-skills/07-operations/project-status-report/`

## Do not

- Mark the phase complete
- Write outside write_lease
- Spawn other positions
- Write `08-operations.md` (COO lease)
- Write manager brief

---

# Merge-ready craft — COO → `08-operations.md`

> **Disclaimer:** This document is operational guidance, **not legal advice**. Privacy notice text, contract language, disclaimers, and jurisdictional compliance are owned by **legal-counsel**. Ops documents process; legal documents risk language.

*Source inputs: `07-sales-playbook.md`, `05-prd.md`, `06-gtm-plan.md`, `03-strategy.md`. Scope: **kennel ops + website ops** — no hiring plan (8B deferred).*

---

## 1. Operations scope and principles

### What Phase 8 ops covers

| In scope | Out of scope (other phases / seats) |
|----------|-------------------------------------|
| Kennel daily / weekly / litter-cycle checklists | Sales talk tracks, objection scripts (`07-sales-playbook.md`) |
| Website inquiry intake ownership and cadence | Legal privacy notice / disclaimer draft (`legal-counsel`) |
| Content update cadence and SD5 claim discipline | Copy writing (`copy-chief` / Phase 13–14) |
| Inquiry data handling SOP (ops level) | Contract / guarantee terms (`OP-P6`; operator + legal) |
| Vendor / tool checklist placeholders | Build implementation (`Phase 9` / CTO) |
| Operator gate checklist before launch | Hiring plan (`08b-people-plan.md` — **skip recommended**) |

### Operating principles (inherited locks)

| Lock | Ops implication |
|------|-----------------|
| **D2 / SD3** | Site earns trust → inquiry; ops supports qualification path, not volume |
| **SD5** | Publish only operator-verified facts; honest coming-soon when absent |
| **Package A/B/C** | Ops routes by package type; never auto-upgrade from form alone |
| **A10** | No on-site prices, payments, or deposit amounts in ops templates |
| **Q7** | Inquiry destination + owner blocks public launch until configured |

### RACI legend

| Code | Meaning |
|------|---------|
| **R** | Responsible — does the work |
| **A** | Accountable — final decision / sign-off |
| **C** | Consulted — provides input |
| **I** | Informed — kept updated |

**Default roles (v1 — single operator model):**

| Role | Holder |
|------|--------|
| **Operator** | Kennel owner / primary decision-maker |
| **Ops backup** | `[Operator to set]` — optional second contact |
| **Legal** | legal-counsel (privacy notice, contract review) |
| **Build** | CTO / tech-lead (form backend, deploy) |

---

## 2. Kennel operations

### 2.1 Daily checklist

**Frequency:** Every day dogs are on premises  
**Owner (R):** Operator  
**Accountable (A):** Operator

| # | Task | Pass criteria | Notes |
|---|------|---------------|-------|
| D1 | Visual health check — all dogs on premises | Appetite, mobility, eyes/ears, stool normal; note concerns | Document anomalies; vet if urgent |
| D2 | Fresh water available and clean | All enclosures / yard access points checked | |
| D3 | Feeding per operator nutrition plan | Amounts and schedule per `[Operator to set]` protocol | No diet changes without operator approval |
| D4 | Exercise / enrichment | Minimum activity per dog per `[Operator to set]` standard | Match age, heat, and health status |
| D5 | Kennel / yard sanitation | Waste removed; surfaces clean; no hazards | |
| D6 | Security check | Gates, latches, perimeter secure | |
| D7 | Record any health or behavior notes | Log in `[Operator to set location]` | Supports placement matching and vet continuity |
| D8 | Inquiry queue scan (if public site live) | New submissions flagged for triage per §3 | Cross-ref `07-sales-playbook.md` Part II |

**Exception:** If no dogs on premises (travel, etc.), reduce to security + facility check; document schedule gap.

### 2.2 Weekly checklist

**Frequency:** Once per calendar week (operator sets day)  
**Owner (R):** Operator

| # | Task | Pass criteria | Notes |
|---|------|---------------|-------|
| W1 | Deep clean high-traffic areas | Floors, bowls, bedding laundered or replaced | |
| W2 | Inventory check — food, supplies, meds | Reorder before stockout; meds within date | |
| W3 | Review health / vet schedule | Upcoming appointments confirmed; records current | No invented health claims for site |
| W4 | Breeding stock condition review | Body condition, coat, temperament baseline | Supports Tier 2 Dogs page updates when verified |
| W5 | Inquiry log review | Open threads tagged; SLA status per `[Operator to set]` | See §3.3 |
| W6 | Website content drift check | No outdated Tier 2 claims; coming-soon still accurate | See §4 |
| W7 | Vendor / tool health check | Email deliverability, form test submit, backup access | See §6 |
| W8 | Social / borrowed channel (if active) | Optional rented channel post aligns with GTM — no price/FOMO | Skip if no rented channel |

### 2.3 Litter-cycle checklist

**Trigger:** Operator confirms active litter planning or whelping — **do not publish litter facts until operator-verified (SD5 Tier 2).**

#### Phase A — Pre-breeding (planning)

| # | Task | Owner | Gate |
|---|------|-------|------|
| L-A1 | Confirm health clearances current for sire and dam | Operator (A) | Per-dog links only when operator inventory exists |
| L-A2 | Document pairing rationale (structure, temperament, health) | Operator (R) | Internal record |
| L-A3 | Update waitlist posture if Tier 2 live | Operator (R) | No litter dates on site until verified |
| L-A4 | Review inquiry queue capacity | Operator (R) | `[Operator to set]` max concurrent B applications |

#### Phase B — Pregnancy / pre-whelp

| # | Task | Owner | Gate |
|---|------|-------|------|
| L-B1 | Vet / whelping plan confirmed | Operator (A) | `[Operator to set vet relationship]` |
| L-B2 | Whelping supplies staged | Operator (R) | |
| L-B3 | **Do not** announce litter on site or email until facts verified | Operator (A) | SD5 — no invented dates or counts |

#### Phase C — Whelping through placement

| # | Task | Owner | Gate |
|---|------|-------|------|
| L-C1 | Daily dam and litter monitoring | Operator (R) | Document weights, concerns |
| L-C2 | Puppy health protocol per operator + vet | Operator (R) | Vaccination / deworming log for go-home bundle |
| L-C3 | Early temperament / handling notes | Operator (R) | Supports placement matching — not guard-dog framing |
| L-C4 | Match waitlist to litter (Package C path) | Operator (A) | C1–C8 gates in `07-sales-playbook.md` §1.3 |
| L-C5 | Go-home documentation bundle prepared | Operator (R) | Per playbook §14 |
| L-C6 | CS handoff for placed families | Operator (R) | Playbook §11 |
| L-C7 | Site update — litter page / Dogs | Operator (A) + build if needed | Tier 2 only; operator sign-off (LG1) |

#### Phase D — Post-placement litter closeout

| # | Task | Owner |
|---|------|-------|
| L-D1 | Archive litter records | Operator (R) |
| L-D2 | Update site — litter status to placed / archived | Operator (A) |
| L-D3 | Alumni consent for any photos or testimonials | Operator (A) | No publish without written consent |
| L-D4 | Referral loop — post-placement only | Operator (R) | Playbook §16 |

### 2.4 Kennel ops RACI (summary)

| Activity | Operator | Ops backup | Legal | Build |
|----------|----------|------------|-------|-------|
| Daily dog care | R/A | C | — | — |
| Health / vet decisions | R/A | I | — | — |
| Breeding / litter decisions | R/A | I | — | — |
| Placement matching | R/A | C | C (contract) | — |
| Inquiry triage | R/A | C | — | — |
| Site content publish (Tier 2) | A | R | C (claims) | R (deploy) |
| Privacy / data requests | R | C | A | C |

---

## 3. Website operations — inquiry handling

> **Cross-reference:** Response SLAs, triage tags, auto-reply templates, and follow-up sequences are defined in **`07-sales-playbook.md` Part II (§6–§10)**. Ops owns **ownership, cadence, and checklist enforcement** — not script duplication.

### 3.1 Inquiry intake ownership (Q7)

**Gate:** Public launch blocked until Q7 is closed (PRD LG2, M-11).

| Element | Owner | Placeholder / action |
|---------|-------|----------------------|
| **Primary owner** | Operator | `[Operator to set name]` |
| **Form destination** | Operator selects | `[Operator to set: email / form backend / CRM webhook]` |
| **Primary channel** | Email (default) | Phone optional for qualified follow-up — not required for Package A |
| **Auto-acknowledgment** | System (if enabled) | Operator configures; templates in playbook §9 |
| **Backup if owner unavailable** | `[Operator to set]` | Document in Q7 closure |
| **Business hours definition** | `[Operator to set]` | Used for SLA copy on site and auto-replies |

**Routing rules (ops enforcement):**

1. All form submissions route to operator-defined Q7 destination — no client-only mailto in production (PRD NFR-SEC-003).
2. Package A vs B determined by Q1 launch tier and form mode — not auto-upgraded.
3. Referral source field logged at intake — playbook §7 enum.
4. No SMS or live chat required at v1 (PRD W-12).

### 3.2 Triage cadence

**Process map:**

```
Form submit
  → Auto-ack (if enabled) — immediate — system
  → Operator review queue — [Operator to set: e.g., daily AM + PM scan]
  → Tag: qualified / neutral / anti-persona
  → Route to playbook follow-up path (§10)
  → Log in inquiry CRM / spreadsheet
```

| Cadence | Action | SLA target | Playbook ref |
|---------|--------|------------|--------------|
| **Intake scan** | Operator reads new submissions | `[Operator to set: e.g., 24–48 business hours]` first review | §6 |
| **Qualified — first personal response** | Email or phone per Q7 | `[Operator to set]` | §10.1 Q1 |
| **Neutral — nurture** | Education-forward touch | `[Operator to set]` | §10.2 |
| **Anti-persona — decline** | Single polite email | `[Operator to set]` | §10.3, §2.6 |
| **Weekly queue hygiene** | Close stale threads; re-tag dormant neutrals | Weekly (§2.2 W5) | §10.2 N3 |
| **Referrer thank-you** | Qualified leads only; private 1:1 | `[Operator to set]` | §7 |

**SLA breach protocol (ops):** See playbook §6 — prioritize qualified tags; no FOMO lever on delays.

**Triage checklist (operator — each submission):**

- [ ] Read full message and household context
- [ ] Check prior Rottweiler experience and activity goals
- [ ] Note referral source
- [ ] Confirm package type (A vs B) matches Q1 tier
- [ ] Apply tag: qualified / neutral / anti-persona
- [ ] Log tag and date in `[Operator to set: CRM / inquiry log]`
- [ ] Route to correct follow-up sequence — **no price or deposit language until B approval**

### 3.3 Auto-reply ownership

| Element | Owner | Notes |
|---------|-------|-------|
| Enable / disable auto-reply | Operator (A) | PRD S-06 — should-have at launch |
| Package A template | Operator configures | Playbook §9 — replace placeholders before launch |
| Package B template | Operator configures | Playbook §9 |
| Form success state (on-site) | Build deploys; operator approves copy | Playbook §9 — mirrors email ack |
| SLA placeholder in all ack copy | Operator sets once Q7 closed | `[Operator to set: e.g., 24–48 business hours]` |

**Prohibited in auto-reply (ops audit):**

- Prices, deposit amounts, "starting at"
- "You're approved" or waitlist confirmation
- Litter availability or urgency language
- Placement confirmation

**Pre-launch test:** Submit test Package A and B forms; confirm destination receipt, auto-reply content, and success state — checklist item §7.

### 3.4 Website ops RACI — inquiry path

| Activity | Operator | System / build | Legal |
|----------|----------|----------------|-------|
| Q7 destination config | A | R (implement) | I |
| Auto-reply content approval | A | R (send) | C (consent copy) |
| Triage and tagging | R/A | I | — |
| Follow-up emails | R | — | — |
| SLA copy on site | A | R (publish) | C |
| Privacy link on Contact | A | R | A (notice text) |

---

## 4. Content update cadence

### 4.1 Principles (SD5 claim discipline)

| Tier | What | Ops rule |
|------|------|----------|
| **Tier 1** | Breed/standard facts, health categories, process description | May publish without per-fact operator sign-off each time |
| **Tier 2** | Named dogs, specific clearances, geography, litter facts, photos | **Operator sign-off required before publish** (LG1) |
| **Tier 3** | Prices, unlinked OFA, fake dogs, superlatives, stock photos as proof | **Never publish** |

Every content change to **Dogs**, **Health/Education**, or **About** passes the checklist in §4.3 before go-live.

### 4.2 Update cadence by surface

| Surface | Trigger | Cadence | Owner | Tier gate |
|---------|---------|---------|-------|-----------|
| **Home** — proof summary | Operator facts or tier promotion | When Tier 2 facts arrive; quarterly review | Operator (A) | Tier 1–2 |
| **Dogs** — index / detail | New named dog, photo, clearance link | Within `[Operator to set: e.g., 5 business days]` of operator verification | Operator (A) | Tier 2 |
| **Dogs** — empty state | Q1 brand-first | Review monthly — still accurate? | Operator | Tier 1 |
| **Health/Education** | New education content; category updates | Ship at launch; **quarterly review** (GTM §4) | Operator (A) | Tier 1 |
| **Health/Education** — per-dog links | Health inventory update | When operator provides registry URLs | Operator (A) | Tier 2 |
| **About** | Bio, geography (Q2), contact | When Q2 closed; on operator request | Operator (A) | Tier 2 |
| **Litters** | Verified litter facts only | On litter-cycle Phase C; remove when placed | Operator (A) | Tier 2 |
| **Contact/Inquire** | Q7, SLA, package mode | Before public launch; when Q1 tier changes | Operator (A) | Tier 1 |
| **Privacy notice link** | Legal provides notice | When notice published | Legal (A) / Operator (R) | — |

**Tier promotion (ops trigger):**

```
Tier 1 → Tier 2 when: Q1 active + health inventory + Q6 photos + Dogs populated + operator sign-off
```

Document tier in `[Operator to set: ops log]` when promotion occurs.

### 4.3 Pre-publish checklist (Dogs / Health / About)

**SOP-OPS-001: Tier 2 content change**

| # | Check | Pass |
|---|-------|------|
| C1 | Change maps to Tier 1 or Tier 2 — not Tier 3 | ☐ |
| C2 | Named dog: operator supplied name, photo, permitted claims | ☐ |
| C3 | Health claim: registry link live and matches dog | ☐ |
| C4 | Geography / contact: Q2 confirmed if location claimed | ☐ |
| C5 | Litter: operator verified dates, counts, status | ☐ |
| C6 | No price, deposit, or "available now" language (A10) | ☐ |
| C7 | No guard-dog / aggression marketing (T5) | ☐ |
| C8 | Operator written sign-off recorded `[Operator to set location]` | ☐ |
| C9 | Deploy reviewed on staging before production | ☐ |

**Rollback:** If Tier 3 or unverified Tier 2 discovered live, revert to last approved version within `[Operator to set: e.g., 24 hours]`; document incident for M7 audit.

---

## 5. Privacy and inquiry data handling SOP

> **Not legal advice.** This SOP describes operational handling. **legal-counsel** owns privacy notice text, consent wording review, and compliance with applicable law (e.g., state privacy regimes, CAN-SPAM for email).

**SOP-OPS-002: Inquiry and customer data lifecycle**

**Version:** 1.0 (draft for merge)  
**Owner:** Operator (R/A)  
**Consulted:** legal-counsel (notice, retention policy)  
**Scope:** Data collected via website inquiry form and subsequent off-site qualification / placement communication.

### 5.1 Data collected (PRD-aligned — qualification fields only)

| Field category | Examples | Purpose |
|----------------|----------|---------|
| Identity | Name, email, phone (optional) | Respond to inquiry |
| Location | City / state or region | Fit and logistics screening |
| Qualification | Experience, household, goals, timeline, message | Mutual fit assessment |
| Package B extended | Sex preference, references, agreement ack | Waitlist consideration |
| Consent | "Inquiry is not a reservation…" checkbox | Expectation setting |
| Referral | How did you hear about us? | Analytics — qualified thank-you only |
| Technical | Timestamp, honeypot (empty), rate-limit metadata | Spam / abuse prevention |

**Not collected on site (prohibited):** Payment data, SSN, deposit amounts, puppy price, government ID.

### 5.2 Collect

| Step | Action | Owner |
|------|--------|-------|
| 1 | Form submits over HTTPS to operator-configured destination | Build |
| 2 | Server-side validation per PRD field spec | Build |
| 3 | Honeypot + rate limit reject spam | Build |
| 4 | Consent checkbox required — reject if unchecked | Build |
| 5 | Success state sets expectations — no approval implied | Build + Operator copy |
| 6 | Privacy notice linked on Contact when legal provides | Operator + Legal |

### 5.3 Store

| Rule | Detail |
|------|--------|
| **Primary store** | `[Operator to set: CRM / secure email / spreadsheet location]` |
| **Transport** | HTTPS only; no PII in URL query strings (NFR-SEC-002) |
| **Secrets** | Form API keys in env — not in repo (NFR-SEC-003) |
| **Access control** | Operator + `[Operator to set backup]` only unless hire added later |
| **Minimization** | Store fields needed for qualification only — do not add unnecessary PII |
| **Alumni / placement data** | Separate from inquiry log after Package C; same access rules |
| **Backups** | `[Operator to set: backup frequency and location]` |

### 5.4 Access

| Request type | Authorized accessor | Prohibition |
|--------------|---------------------|-------------|
| Inquiry review / follow-up | Operator (Q7 owner) | — |
| Referrer thank-you | Operator — **qualified leads only** | **Do not share buyer PII with referrer** (playbook §7) |
| Alumni roster / testimonials | Operator | **No share without written consent** |
| Marketing list export | Operator | Interest list only — opt-out honored |
| Legal / regulatory request | Operator + Legal | Document request and response |
| Vendor (form backend) | Subprocessor per `[Operator to set vendor DPA]` | Legal review recommended |

### 5.5 Retention

> **Operator + Legal to set formal retention period.** Placeholder policy below until legal-counsel advises.

| Data class | Retention (placeholder) | Rationale |
|------------|-------------------------|-----------|
| Active inquiry / waitlist | Duration of active relationship + `[Operator to set]` | Ongoing qualification |
| Declined / anti-persona | `[Operator to set: e.g., 12 months]` then delete or archive | Minimal need |
| Dormant neutral (no response) | `[Operator to set: e.g., 90 days]` then archive | GTM nurture discipline |
| Placed buyer (Package C) | Life of dog + `[Operator to set]` per contract | CS, health, rehoming |
| Consent / contract records | `[Operator to set]` per legal advice | Dispute resolution |
| Spam / honeypot triggers | Do not retain PII — discard | |

**Quarterly retention review:** Ops weekly W5 includes spot-check for records past retention — queue for deletion.

### 5.6 Delete

| Trigger | Action | Owner |
|---------|--------|-------|
| Buyer requests deletion | Verify identity; delete from primary store + backups within `[Operator to set]` | Operator + Legal |
| Retention period expired | Delete or anonymize per policy | Operator |
| Incorrect submission / spam | Discard; do not add to CRM | Operator |
| Alumni opts out of contact | Remove from active lists; retain minimum if contract requires | Operator |

**Process:**

1. Receive request via `[Operator to set: email]`
2. Confirm requestor identity (match inquiry email or contract party)
3. Delete from CRM, email archives, spreadsheets — all copies
4. Confirm deletion to requestor
5. Log action (date, scope) without retaining deleted PII in log

### 5.7 Breach / incident (ops escalation)

1. Suspected unauthorized access → contain (rotate credentials, disable compromised integration)
2. Notify operator immediately
3. **Legal-counsel** consulted for notification obligations
4. Document timeline and scope in `[Operator to set location]`
5. Do not notify affected parties until Legal advises

---

## 6. Vendor and tool checklist

**Gate:** Configure and test before public launch. **Do not invent vendor names** — operator selects stack.

### 6.1 Pre-launch vendor checklist

| # | Tool category | Selected vendor | Status | Owner | Blocks launch? |
|---|---------------|-----------------|--------|-------|----------------|
| V1 | **Domain / DNS** | `[Operator to set]` | ☐ | Operator | Yes |
| V2 | **Hosting / deploy** | `[Operator to set]` | ☐ | Build | Yes |
| V3 | **Business email** | `[Operator to set]` | ☐ | Operator | Yes (Q7) |
| V4 | **Form backend** | `[Operator to set: e.g., Formspree / custom API / CRM form]` | ☐ | Operator + Build | Yes (Q7) |
| V5 | **CRM / inquiry log** | `[Operator to set: e.g., spreadsheet / HubSpot / email folders]` | ☐ | Operator | Recommended |
| V6 | **Auto-reply email** | Via V3 or V4 | ☐ | Operator | Should-have (S-06) |
| V7 | **Analytics** | `[Operator to set: e.g., Plausible / GA — Phase 16]` | ☐ | Operator | No at Tier 1 |
| V8 | **Spam protection** | Honeypot (required) + `[Operator to set: optional Turnstile]` | ☐ | Build | Yes (M-25) |
| V9 | **Backup / password manager** | `[Operator to set]` | ☐ | Operator | Recommended |
| V10 | **Privacy notice hosting** | On-site page when Legal provides | ☐ | Legal + Build | Before launch if collecting PII |

### 6.2 Integration requirements (ops acceptance)

| Integration | Acceptance test |
|-------------|-----------------|
| Form → destination | Test A + B submit; operator receives complete field set |
| Auto-reply | Buyer receives ack; no prohibited content (§3.3) |
| HTTPS | All pages and form POST secure |
| Error handling | Validation errors clear; no data loss on retry |
| Env secrets | No keys in client bundle or public repo |

### 6.3 Ongoing vendor cadence

| Cadence | Action |
|---------|--------|
| Weekly (W7) | Form test submit; email deliverability spot-check |
| Quarterly | Review subprocessor list; access credentials rotated if staff change |
| On vendor change | Re-run acceptance tests; update privacy notice if subprocessor changes (Legal) |

---

## 7. Operator launch gates (ops consolidated)

Consolidates playbook §18, PRD LG gates, and ops checklists.

| Gate | Requirement | Status | Blocks |
|------|-------------|--------|--------|
| **Q7** | Destination + owner + SLA placeholders set | `[Operator to set]` | Public launch |
| **Q1** | Tier 1 vs 2; Package A vs B | `[Operator to set]` | Form mode, triage path |
| **Q2** | Geography / contact (if claimed on site) | `[Operator to set]` | About, LocalBusiness schema |
| **Q6** | Photography (Tier 2 dog pages) | `[Operator to set]` | Named dog claims |
| **Privacy notice** | Legal draft linked on Contact | `[Operator to set]` | PII collection |
| **Auto-reply tested** | Package A/B | `[Operator to set]` | Buyer expectations |
| **Inquiry log / CRM** | Tagging system live | `[Operator to set]` | Audit trail |
| **Tier 2 sign-off process** | SOP-OPS-001 documented | Ready in this doc | Content integrity |
| **OP-P1/P2/P3** | Price/deposit (off-site only) | `[Operator to set]` | Sales conversations — not site |
| **OP-P6** | Contract / guarantee | `[Operator to set]` | Package C, CS escalation |

---

## 8. Phase 8B — People and hiring

**Recommendation: SKIP `08b-people-plan.md` for v1.**

| Rationale | Detail |
|-----------|--------|
| Bootstrapped model | Operator handles kennel ops + inquiry triage at expected Tier 1/2 volume |
| GTM discipline | Low-frequency, high-value inquiry path — not volume call center |
| No invented roles | Do not spec hires without operator request |
| Future trigger | Revisit 8B if inquiry volume exceeds `[Operator to set]` capacity or litter cycle requires dedicated staff |

If operator later hires: kennel assistant (R on daily care), part-time admin (inquiry triage backup) — document in 8B when triggered.

---

## 9. Measurement (ops health)

Align to GTM §7 and playbook §20 — ops tracks **process adherence**, not lead volume.

| ID | Metric | Definition | Target posture |
|----|--------|------------|----------------|
| **OPS-M1** | Daily checklist completion | % days checklist completed when dogs on premises | `[Operator to set: e.g., 95%]` |
| **OPS-M2** | Inquiry SLA adherence | % first responses within operator SLA | `[Operator to set: e.g., 90%]` — playbook §20 |
| **OPS-M3** | Tier 3 content incidents | Count of prohibited claims published | **0** (M7) |
| **OPS-M4** | Form / auto-reply uptime | Failed submits or missing acks | **0** at launch month |
| **OPS-M5** | Privacy request response time | Deletion/access requests closed | `[Operator to set]` per Legal |
| **OPS-M6** | Q7 routing failures | Inquiries lost or misrouted | **0** |

**Not success:** Raw inquiry volume · speed-to-price · auto-approval rate.

---

## 10. Anti-patterns (ops — do not execute)

| Anti-pattern | Why |
|--------------|-----|
| Publishing litter/dog facts before operator verification | SD5 Tier 3 / reputation risk |
| Sharing buyer PII with referrers | Privacy violation; playbook §7 |
| Publishing alumni photos without consent | Privacy + SD5 |
| Storing inquiries in unsecured shared doc | NFR-SEC |
| Skipping triage tag before follow-up | Wrong sequence; price leakage risk |
| Inventing SLA numbers in site copy | Operator gate Q7 |
| Collecting payment via form or site | W-03, A10 |
| Hiring plan without operator trigger | 8B skip |

---

## 11. Downstream handoffs

| Phase / seat | Uses this doc for |
|------------|-------------------|
| **COO** | Merge into `08-operations.md` |
| **legal-counsel** | Privacy notice, retention policy, disclaimer alignment with §5 |
| **CTO / Phase 9** | Form destination, honeypot, env secrets, deploy checklist §6 |
| **Phase 10 QA** | Tier 3 audit, form security AC |
| **Phase 16 analytics** | Referral field reporting |
| **Phase 22 operate** | Recurring cadence extension |

---

## 12. Fact / inference labels

| Kind | Statement |
|------|-----------|
| **Fact** | PRD defines inquiry fields and consent; no on-site payment |
| **Fact** | Q7 blocks public launch without form destination |
| **Fact** | Phase 7 playbook owns SLAs, templates, triage tags |
| **Decision** | Ops owns cadence and checklists; sales owns scripts |
| **Decision** | Recommend 8B skip — no hires v1 |
| **Inference** | Single-operator model sufficient at bootstrapped Tier 1/2 volume |
| **[Operator to set]** | SLA hours, retention periods, vendor choices, backup contact, vet relationships, storage locations |

---

## Sources

- `07-sales-playbook.md` — inquiry SLAs, triage, auto-replies, CS handoff
- `05-prd.md` — form spec, privacy minimum, launch gates, NFR-SEC
- `06-gtm-plan.md` — content cadence, referral loop, measurement
- `03-strategy.md` — SD5 tiers, D2 locks, Q7
- `.agents/product-marketing.md` — claim tiers, anti-persona
- Packs: sop-builder, process-optimization, project-status-report
