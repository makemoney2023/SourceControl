---
phase: "8"
position: legal-counsel
reports_to: coo
status: done
verdict_for_manager: ready_to_merge
llm_tier: frontier-reasoning
llm_model: cursor-grok-4.5-high-fast
generation_profile: none
generation_used: none
fallback_applied: false
---

# Handoff — Ops & Legal Risk Checklist → COO

## Goal (from context packet)

Produce merge-ready legal/risk checklist for breeding kennel marketing website: claims discipline, contracts, deposits, disclaimers, privacy/web-form risks. NOT licensed legal advice — label clearly; flag items requiring attorney review. Align claim discipline to strategy (no invented health/location/prices).

---

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/8-legal-counsel.md` | Full Phase 8 legal IC draft — paste sections below into `08-operations.md` (COO lease) |

---

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | frontier-reasoning |
| llm_model | cursor-grok-4.5-high-fast |
| generation_profile | none |
| generation_used | none |
| fallback_applied | false |

---

## Decisions

- **No invented Blacksage legal terms or dollar amounts.** Deposit, refund, return, guarantee, and contract substance are `[Operator to set]` / `[Attorney to draft]` only.
- **A10 reinforced as risk control:** no on-site prices, deposit amounts, or payment UX — reduces deceptive-pricing / premature-commitment exposure.
- **Monetization sequencing locked (Phase 7):** Trust → Inquiry → Qualification → Price (off-site) → Deposit (off-site, post-approval) → Contract → Placement. Form submission ≠ reservation, approval, or payment obligation.
- **SD5 claim tiers are the marketing compliance spine.** Tier 3 at launch is a go-live blocker for content; not escalated as phase-block here — flagged for attorney + operator QA.
- **Legal pack path empty/missing** (`skills/community/awesome-claude-corporate-skills/06-legal/`). Proceeded with PRD/strategy claim tiers + standard consumer-protection / privacy risk framing. No `legal` escalation tag — attorney-review items are listed inside checklists so COO can proceed merge without blocking the phase.

---

## Asks for manager (`ask_manager`)

- Peer help needed: none
- Clarification needed: none (operator gates Q7, OP-P1/P2/P6, Q2 remain open by design — placeholders used)
- Optional (non-blocking): schedule licensed counsel review against **§F Pre-launch attorney-review flag list** before public index / production form go-live

---

## Risks / blockers

| Risk | Severity | Handling |
|------|----------|----------|
| Publishing without attorney-drafted OP-P2/P6 policies | High at go-live | Flag list §F — launch gate, not Phase 8 block |
| Web form PII without privacy notice + retention plan | Medium–High | Privacy checklist §E; Q7 destination must be operator-owned |
| Tier 3 marketing claims (prices, fake dogs, unlinked OFA, invented location) | Critical reputational + consumer-protection | Claims checklist §B; align to SD5 / M7 / NFR-QA-001 |
| Collecting deposits on-site or before approval | Critical process + legal exposure | A10 + sequencing locks; playbook Part I §4 |
| Treating this handoff as legal advice | Critical | Banner §A — prominent in `08-operations.md` |

**No phase-blocking escalate.** Prefer flag-for-attorney-review over `legal` escalation tag.

---

## Packs used

- `skills/org/positions/legal-counsel/SKILL.md`
- `skills/org/HANDOFF-TEMPLATE.md`
- `skills/org/MODEL-REGISTRY.md`
- `skills/org/ESCALATION.md`
- `skills/community/awesome-claude-corporate-skills/06-legal/` — **unavailable / empty**; proceeded per packet instruction with PRD + strategy claim discipline

## Inputs reviewed

- `07-sales-playbook.md` (monetization sequencing, OP-P2/P6 placeholders, consent copy)
- `05-prd.md` (A10, form fields, LG1–LG3, privacy NFR, claim AC)
- `06-gtm-plan.md` (anti-patterns, Tier 0→1→2 launch)
- `03-strategy.md` (SD5, A10, SD8 temperament bounds)
- `.agents/product-marketing.md` (Tier 1/2/3 proof hierarchy)

## Do not

- Mark the phase complete
- Write outside write_lease (`08-operations.md` is COO-owned)
- Spawn other positions
- Invent deposit amounts, refund windows, or Blacksage contract language

---

# MERGE-READY SECTIONS — paste into `08-operations.md`

> **COO merge note:** Paste §§A–F below into Phase 8 operations artifact. Keep the legal disclaimer banner at the top of the legal/risk section. Do not strip “not legal advice” labels or `[Attorney to draft]` placeholders.

---

## A. Legal disclaimer banner (required)

```markdown
> **⚠️ NOT LICENSED LEGAL ADVICE**
>
> This section is an **internal risk and compliance checklist** produced for Blacksage Kennels venture planning. It is **not** a substitute for advice from a licensed attorney in the operator’s jurisdiction(s). Contract terms, deposit/refund policies, consumer-protection obligations, privacy notices, and any public-facing legal copy must be **reviewed and finalized by licensed counsel** before go-live. Placeholders marked `[Operator to set]` or `[Attorney to draft]` must not be filled with invented Blacksage terms.
```

---

## B. Marketing claims risk checklist (SD5 — Tier 1 / 2 / 3)

**Purpose:** Prevent deceptive, unverifiable, or invented kennel claims on the website and in GTM/sales surfaces. Aligns to SD5, PRD G5/M2/M7, GTM claim discipline, and `.agents/product-marketing.md` proof hierarchy.

**Rule:** Publish only what the tier allows. When facts are absent → honest coming-soon / interest-list posture — never invent.

### B.1 Tier 1 — Generally publishable (breed/standard + process posture)

| Claim type | Allowed examples | Risk control | Pre-publish check |
|------------|------------------|--------------|-------------------|
| Breed focus | German / ADRK-aligned Rottweilers; FCI Standard No. 147 literacy | Cite standard as education, not Blacksage certification | ☐ Copy does not imply Blacksage ADRK membership unless Tier 2 verified |
| Temperament (standard bounds) | Devoted, even-tempered, biddable — ADRK/FCI language | **No aggression / guard-dog / protection marketing** (SD8, T5, M-23) | ☐ No “guard,” “protection,” “aggressive deterrent” framing |
| Health **categories** | Hips, elbows, eyes, cardiac, JLPP as responsible-breeding topics | Categories ≠ per-dog results | ☐ No specific dog named with clearance numbers |
| Process posture | Inquiry reviewed individually; not checkout; selective placement | Reinforces D2 / apply-second | ☐ No “reserve now” / instant placement language |
| Pricing posture | Prices/deposits discussed after qualification; not on site | **A10 risk control** | ☐ Zero dollar amounts, “starting at,” or deposit figures |

### B.2 Tier 2 — Operator-verified only (blocked until signed off)

| Claim type | Requires | Attorney / ops flag | Pre-publish check |
|------------|----------|---------------------|-------------------|
| Named breeding stock | Operator name + photo + permitted claims (LG1, Q6) | Content sign-off | ☐ LG1 written approval on claim inventory |
| Per-dog health clearances | Inventory + **live registry link** (OFA/CHIC) | Unlinked OFA = treat as Tier 3 | ☐ Every clearance has working registry URL |
| Club affiliations / titles | Membership/title docs | Do not badge until verified | ☐ No ARC/ADRK/AKC BOM badges without docs |
| Geography / LocalBusiness | Q2 confirmed | Invented location = Tier 3 | ☐ Region/phone only if Q2 closed |
| Program maturity / litters | Q1 = active + inventory | Tier 1 must not claim active litters | ☐ Litters nav only when Q1 allows |
| Contract / guarantee / return **public** description | OP-P6 attorney-drafted summary | Site may say process exists; not invent terms | ☐ Public text matches counsel draft or stays generic |
| Operator bio / tenure | Operator input | No invented years-in-breed | ☐ Bio facts operator-verified |

### B.3 Tier 3 — Prohibited until proven (launch blockers if present)

| Prohibited claim / asset | Why it is high risk | Mitigation |
|--------------------------|---------------------|------------|
| On-site puppy **prices**, deposit **amounts**, “starting at” | A10; no documented Blacksage pricing; deceptive-pricing exposure | Keep all money talk off-site post-qualification |
| Litter availability / dates / “puppies ready” without Q1+inventory | Invented scarcity / availability | Honest empty state or interest list |
| Specific OFA/CHIC results **without** registry link | Unverifiable health marketing | Link or omit |
| Kennel location / service area before Q2 | Invented geography | Philosophy-only About until Q2 |
| Stock / AI photos presented as Blacksage dogs | Fraudulent proof (SD5 Tier 3 media) | Typographic empty state; labeled placeholders only |
| Superlatives (“best,” champion counts, import counts) without proof | Unsubstantiated superiority | Cut or prove |
| Aggression / guard-dog marketing | Breed liability + anti-persona amplification | ADRK temperament bounds only |
| Fake / coached testimonials | SD5 / GTM Tier 3 | Real consented testimonials only, or none |

### B.4 Claims QA gate (pre-launch)

- [ ] Claim audit: 100% published claims map to Tier 1 or operator-signed Tier 2 (M7 / NFR-QA-001)
- [ ] Zero Tier 3 claims or media on production index
- [ ] Health page: categories OK; per-dog links only when verified
- [ ] CTA language: Inquire / Interest list — not Buy / Shop / Reserve / Apply now (above-fold)
- [ ] Social/GTM copy uses same claim tiers as site (no “DM for price,” FOMO, marketplace listings)

---

## C. Contract / deposit / refund / return policy checklist (OP-P2 / OP-P6)

> **⚠️ NOT LEGAL ADVICE.** Do not invent Blacksage dollar amounts, refund windows, or guarantee language. Operator sets commercial policy; **licensed attorney drafts** enforceable terms for the governing jurisdiction(s).

### C.1 Monetization sequencing (locked — risk control)

| Step | Where | When | Site may say | Site must not |
|------|-------|------|--------------|---------------|
| 1. Trust | Website | Always | Education + evidence | Invented proof |
| 2. Inquiry | Website form | After proof | Interest / inquire | Reservation confirmation |
| 3. Qualification | Off-site (email/phone) | Post-inquiry | Process overview | Approval in auto-reply |
| 4. Price | Off-site | Post-qualification | “Discussed after qualification” | Any $ amount (A10) |
| 5. Deposit | Off-site | **After waitlist approval** | “May be required after approval; terms provided individually” | Collect payment; show amount |
| 6. Contract | Off-site | Before placement confirmation | That a written agreement is used | Publish unreviewed full contract as marketing |
| 7. Placement | Off-site | Post-contract | Process at high level | Confirm specific puppy in form success state |

**Hard rules (ops + legal risk):**

- Never collect deposit at inquiry or on website.
- Never verbal-only deposit agreements.
- Form submission ≠ approval, waitlist seat, or payment obligation.
- Written terms **before** any payment request (playbook Part I §4).

### C.2 Deposit policy checklist — OP-P2 `[Operator to set]` / `[Attorney to draft]`

| # | Item | Owner | Status |
|---|------|-------|--------|
| D1 | Deposit purpose (waitlist commitment vs placement credit) | Operator + Attorney | ☐ |
| D2 | Deposit **amount** — never published on site | Operator | ☐ `[Operator to set]` |
| D3 | When deposit is requested (only post-approval) | Operator | ☐ Align playbook §4.2 |
| D4 | How deposit is collected (off-site method) | Operator | ☐ No site payment UX |
| D5 | Whether / how deposit credits toward placement price | Attorney | ☐ `[Attorney to draft]` |
| D6 | Refund / forfeiture conditions (buyer withdraw, kennel withdraw, litter cancel, mismatch, force majeure) | Attorney | ☐ `[Attorney to draft]` |
| D7 | Timeline for refund processing if refundable under terms | Attorney | ☐ Do not invent days |
| D8 | Non-transferability / non-assignability of waitlist position | Attorney | ☐ |
| D9 | Written acknowledgment required before payment | Operator | ☐ |
| D10 | Site copy stays generic — no amount, no DIY refund window | Copy + Legal QA | ☐ |

**Allowed site language (process only — no amounts):**

> A waitlist deposit may be required after application approval. Terms are provided individually.

**Forbidden site language:** any `$`, “non-refundable,” specific day windows, “reserve with deposit,” payment links.

### C.3 Placement contract / return / guarantee checklist — OP-P6 `[Attorney to draft]`

| # | Item | Notes |
|---|------|-------|
| C1 | Parties, governing law, venue | `[Attorney to draft]` — jurisdiction `[Operator to set]` |
| C2 | Dog identification (litter/puppy designation when known) | After match — not at inquiry |
| C3 | Purchase price / balance due mechanics | Off-site; amounts not on website |
| C4 | Health documentation delivered at go-home | Align CS playbook Part III; no overclaim |
| C5 | Warranty / health guarantee scope and exclusions | `[Attorney to draft]` — do not market “lifetime guarantee” without counsel |
| C6 | Return / rehoming / cannot-keep provisions | Buyer escalation → OP-P6; no invented CS refund scripts |
| C7 | Spay/neuter / co-ownership / breeding rights (if any) | Only if operator program uses them — attorney draft |
| C8 | Limitation of liability / assumption of animal-ownership risks | `[Attorney to draft]` |
| C9 | Photo/testimonial release (separate or exhibit) | Needed before public alumni use |
| C10 | Signature / electronic signature process | Off-site; retain executed copies |

### C.4 Operator gates before live deposit/contract conversations

| Gate | Blocks |
|------|--------|
| **OP-P2** | Any deposit invitation, refund answer, waitlist $ talk |
| **OP-P6** | Placement confirmation, return/guarantee CS scripts |
| **OP-P1** | Price band discussion (still off-site; not invented) |
| **Q7** | Production form destination + responder SLA |

Until gates close: use playbook placeholders only (“terms provided individually,” “per operator contract”).

---

## D. Website disclaimer / inquiry consent language guidance

> **Label: DRAFT — NOT LEGAL ADVICE.** Site-facing drafts for operator + counsel to adapt. Do not publish as final until attorney review (§F).

### D.1 Site-wide / footer disclaimer (draft)

**Draft (not advice):**

> Blacksage Kennels provides educational information about ADRK/FCI-aligned Rottweiler standards and our program philosophy. Content is for general information and does not constitute a veterinary, training, or legal opinion. Inquiry through this website is not a reservation, purchase, or guarantee of puppy availability. Placements are selective and subject to mutual fit and written agreement. Pricing and any deposit terms are discussed only after qualification and are never completed on this website.

**Operator/attorney checklist:**

- [ ] Confirm jurisdiction-appropriate consumer language
- [ ] Add business entity name / DBA when known `[Operator to set]`
- [ ] Link privacy notice when available
- [ ] Do not add medical cure claims or temperament guarantees in disclaimer “fixes”

### D.2 Package A — Interest / inquiry consent (checkbox) — PRD-aligned

**Required checkbox copy (PRD):**

> I understand inquiry is not a reservation; placements are selective.

**Optional expanded consent (draft — not advice):**

> I understand that submitting this form does not reserve a puppy, approve me for a waitlist, or create a purchase obligation. Blacksage reviews inquiries individually. Pricing and any deposit or contract terms, if applicable, are discussed only after qualification and off this website.

### D.3 Package B — Waitlist acknowledgment (checkbox) — PRD-aligned

**Required checkbox copy (PRD) — no amount:**

> I understand a waitlist deposit may be required after approval; terms provided individually.

**Optional clarity line (draft — not advice):**

> I understand that form submission is not waitlist approval. If approved, I will receive written terms before any payment is requested. Deposit collection does not occur on this website.

### D.4 Success-state / auto-reply constraints (legal-adjacent)

Success UI and auto-replies **must not** state: waitlist approval, puppy reservation, price, deposit amount, or placement confirmation.

**Safe pattern (align playbook):** received → personal review → response within `[Operator to set]` SLA → pricing/deposit only after qualification.

### D.5 Health / education page caution (draft)

**Draft (not advice):**

> Health-testing categories described here reflect responsible-breeding practices and publicly available registry frameworks (e.g., OFA/CHIC). Individual dog results are published only when verifiable registry links are available. Always verify clearances independently and consult your own veterinarian.

---

## E. Privacy / inquiry data risk checklist (web form PII)

**Context:** Forms collect name, email, phone (optional), location region, household/experience details, goals, timeline — sensitive enough to warrant a minimum privacy program even for a small kennel site (PRD `NFR-SEC-004`).

> **⚠️ NOT LEGAL ADVICE.** Privacy obligations vary by jurisdiction (e.g., state privacy laws, CAN-SPAM/CASL for email). Counsel should confirm notices and retention for the operator’s locations and visitor base.

### E.1 Data minimization

| Control | Requirement | Status |
|---------|-------------|--------|
| Fields | Qualification fields only (PRD form spec) | ☐ |
| No payment data | No card/ACH fields on site (A10) | ☐ |
| No SSN / government ID | Not collected via marketing site | ☐ |
| Household/children notes | Optional; treat as sensitive PII | ☐ |
| Honeypot / rate limit | Spam abuse protection enabled | ☐ |

### E.2 Notice and consent

| Control | Requirement | Status |
|---------|-------------|--------|
| Privacy notice | Link on Contact/Inquire when operator provides; counsel-drafted preferred | ☐ `[Attorney to draft]` / `[Operator to set]` URL |
| Purpose statement | Inquiry review, fit assessment, follow-up communication | ☐ |
| Marketing email | Separate consent if used beyond transactional inquiry replies | ☐ Do not assume form = newsletter opt-in |
| Third parties | Disclose form processor / email / CRM (Q7 destination) | ☐ |

### E.3 Storage, access, retention

| Control | Requirement | Status |
|---------|-------------|--------|
| Destination ownership | Q7: email / backend / CRM configured before launch | ☐ **LG2 launch gate** |
| Access limited | Only inquiry owner(s) `[Operator to set]` | ☐ |
| Retention period | How long inquiries kept `[Operator to set]` / counsel guidance | ☐ |
| Deletion / correction request path | How buyer asks to delete or update | ☐ `[Operator to set]` |
| Security basics | HTTPS, no plaintext password storage, no public form dump | ☐ Eng/ops |

### E.4 Downstream use restrictions

| Control | Requirement | Status |
|---------|-------------|--------|
| No sale of leads | Do not sell/share inquiry lists | ☐ |
| Alumni / testimonials | Consent before naming or photos (see C9) | ☐ |
| Referral analytics | “How did you hear” aggregated where possible | ☐ |
| Anti-persona notes | Internal only; professional tone; no public shaming | ☐ |

### E.5 Breach / incident readiness (lightweight)

| Control | Requirement | Status |
|---------|-------------|--------|
| Who to notify if inbox/CRM compromised | `[Operator to set]` | ☐ |
| Counsel contact for incident | `[Attorney / Operator to set]` | ☐ |

---

## F. Pre-launch attorney-review flag list

**Items that should go to licensed counsel before public go-live** (production index + live inquiry form). These are **launch gates**, not Phase 8 document blockers.

| # | Item | Why counsel | Owner after review |
|---|------|-------------|-------------------|
| F1 | Final privacy notice + form consent language | Privacy / marketing consent law | Operator publishes counsel-approved text |
| F2 | OP-P2 deposit / refund / forfeiture agreement | Consumer payment + refund obligations | Used off-site only; site stays generic |
| F3 | OP-P6 placement contract, health guarantee, return/rehoming | Animal sale / warranty / liability | Sales + CS use executed docs only |
| F4 | Public website disclaimer + footer legal links | Consumer-facing representations | Web + copy |
| F5 | Any public summary of “guarantee” or “refund policy” | Marketing vs contract conflict risk | Prefer “terms provided individually” until approved |
| F6 | Testimonial / photo release templates | Likeness / privacy | CS / alumni |
| F7 | Email auto-reply + nurture sequences if promotional | Anti-spam / consent | Outbound / lifecycle |
| F8 | Business entity, DBA, and contact identity on site | Accurate seller identity | About / Contact (with Q2) |
| F9 | Jurisdiction-specific breeding / pet-sale / lemon-law overlays | Local compliance varies widely | Operator + counsel for home state and ship-to states `[Operator to set]` |
| F10 | Claim inventory sign-off if health/performance marketing expands | Deceptive advertising risk | Align SD5; counsel spot-check Tier 2 health claims |

### F.11 Explicitly out of scope for inventing in-house

Do **not** ask the AI org (or this checklist) to invent:

- Deposit dollar amounts  
- Refund day counts  
- Full contract clauses  
- Governing-law selection without counsel  
- Medical outcome guarantees  

---

## G. Alignment summary (for COO merge)

| Lock | Legal/risk implication |
|------|------------------------|
| **SD5** | Claims checklist is primary pre-launch compliance control |
| **A10** | No prices/payment UX = reduced deceptive-pricing and premature-contract risk |
| **D2 / Phase 7 sequencing** | Inquiry ≠ money; deposit only post-approval off-site |
| **Package A/B/C** | Consent copy differs; B acknowledges possible deposit without amounts |
| **Q7 / LG2** | Live form without owned destination = privacy + ops failure |
| **OP-P2 / OP-P6** | Attorney-drafted; site never substitutes marketing copy for contract |

---

## H. Suggested `08-operations.md` outline insertion

```markdown
## Legal & risk (Phase 8)

[Paste §A banner]

### Marketing claims discipline (SD5)
[Paste §B]

### Contracts, deposits, refunds, returns (OP-P2 / OP-P6)
[Paste §C]

### Website disclaimers & inquiry consent (draft — not advice)
[Paste §D]

### Privacy & inquiry PII
[Paste §E]

### Pre-launch attorney review flags
[Paste §F]
```

---

**IC complete.** `verdict_for_manager: ready_to_merge`. Phase not marked complete. `08-operations.md` not written (COO lease).
