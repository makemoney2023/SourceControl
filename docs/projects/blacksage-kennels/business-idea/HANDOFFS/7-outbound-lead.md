---
phase: "7"
position: outbound-lead
reports_to: head-of-sales-cs
status: done
verdict_for_manager: ready_to_merge
llm_tier: fast-general
llm_model: composer-2.5-fast
generation_profile: none
generation_used: none
fallback_applied: false
---

# Handoff — Phase 7 Inbound Inquiry Triage & Follow-Up → head-of-sales-cs

## Goal (from context packet)

Produce merge-ready playbook sections for **inbound inquiry triage and follow-up sequences** (not cold outbound). Cover: intake triage with qualification tags, auto-reply templates (Package A vs B), follow-up sequences (qualified / neutral / anti-persona), response SLA framework, channel routing (Q7), referral source tracking, and Tier 1 vs Tier 2 handling differences. Align to D2 trust-first, Package A/B/C, no price-on-site, no FOMO.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/7-outbound-lead.md` | This handoff — merge-ready inbound sales ops craft for head-of-sales-cs → `07-sales-playbook.md` |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | fast-general |
| llm_model | composer-2.5-fast |
| generation_profile | none |
| generation_used | none |
| fallback_applied | false — no fallback needed |

## Decisions

1. **Inbound only:** This playbook covers responses to form submissions and direct contact initiated by the buyer — no cold outreach, puppy forum ads, or marketplace prospecting.
2. **Triage tags:** Three tags — **qualified**, **neutral**, **anti-persona** — applied within first operator review cycle; tags drive follow-up path, not form auto-sort (human review required).
3. **SLA posture:** Use operator-configurable placeholder **[Operator to set: e.g., 24–48 business hours]** for all response timelines; do not publish invented Blacksage SLA numbers.
4. **Auto-reply split:** Package A (Interest list) and Package B (Waitlist) get distinct acknowledgment templates; both set expectations without implying approval or reservation.
5. **Price gate:** Pricing and deposit amounts are discussed only after qualification conversation — never in auto-reply or first-touch nurture.
6. **Tier differentiation:** Tier 1 handles Package A only with nurture-forward sequences; Tier 2 adds Package B qualification path and waitlist deposit framing (no amounts).

## Asks for manager (`ask_manager`)

- Peer help needed: `customer-success-lead` for post-placement retention and referrer thank-you loop | recommended for full `07-sales-playbook.md`
- Clarification needed: **Q7** (inquiry destination, primary channel email vs phone, auto-reply enablement) must be operator-closed before public launch — templates assume email primary with optional phone follow-up | none blocking merge of inbound craft

## Risks / blockers

| Risk | Mitigation |
|------|------------|
| Q7 unset at launch | No public launch without form destination + owner (PRD LG2, M-11) |
| Operator capacity exceeds inquiry volume | Triage tags prioritize qualified; neutral gets low-frequency nurture only |
| Anti-persona volume from wrong channels | Polite decline template; GTM anti-patterns (no FOMO/price ads) reduce source |
| Deposit discussion before qualification | Follow-up sequences gate Package B deposit language to post-approval only |
| Invented SLA numbers in public copy | All timelines use operator placeholder; site success state mirrors same placeholder |

## Packs used

- `skills/community/marketingskills/product-marketing/` (CTA locks, voice)
- `skills/community/awesome-claude-corporate-skills/07-operations/` (process framing)

## Do not

- Mark the phase complete
- Write outside write_lease
- Spawn other positions
- Write `07-sales-playbook.md` (head-of-sales-cs lease)
- Write manager brief

---

# Merge-ready craft — head-of-sales-cs → `07-sales-playbook.md`

*Source inputs: `06-gtm-plan.md`, `05-prd.md`, `04-business-model.md`, `.agents/product-marketing.md`. Scope: **inbound inquiry triage and follow-up only** — no cold outbound, no spam, no marketplace prospecting.*

---

## 1. Scope and principles

### What this playbook covers

| In scope | Out of scope |
|----------|--------------|
| Form submissions (Package A / B) | Cold email or DM prospecting |
| Direct email/phone initiated by buyer | Puppy forum ads or marketplace outreach |
| Referrer-originated inbound | Paid lead gen (Phase 19 deferred) |
| Interest list nurture (Tier 1) | FOMO urgency sequences ("only X left") |
| Waitlist qualification follow-up (Tier 2) | Price quotes before qualification |

### Operating principles (inherited locks)

| Lock | Sales ops implication |
|------|----------------------|
| **D2 / SD3** | Inquiry is not a reservation; qualification before price/deposit |
| **Package A/B/C** | Tag and route by package type; never collapse paths |
| **A10** | No pricing or deposit amounts in templates or auto-replies |
| **Voice** | Confident · Calm · Precise · Evidence-led · Respectful |
| **Monetization sequencing** | Trust content → Inquiry → Qualification → Price discussion → Deposit (if waitlisted) → Placement |

---

## 2. Response SLA framework

> **Operator gate (Q7):** All SLA numbers below are **placeholders**. The operator must set actual response commitments before public launch. Do not publish specific Blacksage SLA hours until confirmed.

### SLA tiers

| Event | Target | Owner | Notes |
|-------|--------|-------|-------|
| **Auto-acknowledgment** | Immediate (automated) | System / form backend | Fires on successful form submit if operator enables (PRD S-06) |
| **First human review** | **[Operator to set: e.g., 24–48 business hours]** | Operator (Q7 owner) | Business days; exclude weekends/holidays unless operator chooses otherwise |
| **Qualified lead — first personal response** | **[Operator to set: e.g., 24–48 business hours]** from submission | Operator | Email or phone per Q7 preference |
| **Neutral lead — nurture touch 1** | **[Operator to set: e.g., 5–7 business days]** | Operator | Low frequency; education-forward |
| **Anti-persona — polite decline** | **[Operator to set: e.g., 24–48 business hours]** | Operator | Respectful; no argument |
| **Referrer thank-you** (qualified leads only) | **[Operator to set: e.g., within 1 week]** | Operator | Private 1:1; not mass email |

### SLA copy for site and auto-replies

Use this placeholder consistently across form success states, auto-replies, and operator templates:

> *Thank you for your inquiry. We review submissions personally and aim to respond within **[Operator to set: e.g., 24–48 business hours]** on business days. Inquiry is not a reservation — placements are selective and mutual.*

**Do not:** Promise same-day response, instant approval, or availability without operator confirmation.

### SLA breach protocol

1. If review queue exceeds operator capacity, prioritize **qualified** tags first.
2. Neutral leads may receive a brief delay notice: *"Thank you for your patience — we are reviewing inquiries in order received."*
3. Never use delay as FOMO lever ("high demand — act now").

---

## 3. Channel routing (Q7)

> **Q7 blocks public launch.** Operator must define destination, owner, and primary channel before form goes live.

### Default routing matrix (operator to confirm)

| Channel | Role | When to use |
|---------|------|-------------|
| **Email (primary)** | Form destination; auto-reply; follow-up sequences | Default for all packages; async qualification |
| **Phone (optional)** | Follow-up for qualified leads when buyer provided number | Operator-initiated after review — not cold call |
| **Form backend / CRM webhook** | Intake + tagging + referral field capture | If operator configures beyond email-only |

### Routing rules

1. **All form submissions** route to operator-defined destination (Q7) — email inbox, form SaaS, or CRM webhook.
2. **Phone field** is optional on form (PRD); if provided, operator may call qualified leads — never required for Package A.
3. **No SMS or live chat** required at v1 (PRD W-12).
4. **Referral source** captured via form field "How did you hear about us?" — logged at intake for analytics (GTM leading indicator).

### Referral source enum (form + CRM)

| Value | Follow-up note |
|-------|----------------|
| Search (Google / other) | Standard qualification path |
| Trainer / professional referral | Priority review; consider referrer thank-you if qualified |
| Breed club / show / working network | Standard path; note club name in "Other" if applicable |
| Prior Blacksage owner / word of mouth | Priority review; referrer thank-you if qualified |
| Social media | Standard path; verify buyer reviewed site education |
| Other (free text) | Capture verbatim for quarterly review |

**Referrer thank-you rule (GTM):** Thank referrer on **qualified leads only** — private 1:1, not mass broadcast. Do not share buyer PII with referrer.

---

## 4. Inquiry intake triage

### Intake workflow

```
Form submit → Auto-ack (if enabled) → Operator review queue → Tag → Route to follow-up sequence
```

### Triage tags

Apply **one primary tag** within the first human review cycle:

| Tag | Definition | Signals (from form + message) |
|-----|------------|-------------------------------|
| **Qualified** | Serious ADRK-aligned buyer; evidence of due diligence; fit plausible | Thoughtful "Why Blacksage?" message; prior Rottweiler experience; realistic timeline; activity goals align (companion/family/sport-working/show); referrer or search origin; reviewed site education |
| **Neutral** | Legitimate interest but incomplete signal — needs nurture or more information | Brief message; vague timeline; first-time breed researcher; no red flags but insufficient fit data |
| **Anti-persona** | Misaligned intent — filter respectfully | Price-only focus; guard-dog/protection language; impulse timeline (0–6 mo + checkout language); disrespectful tone; clearly wrong breed expectations |

### Triage checklist (operator)

Review within SLA window:

- [ ] Read full message and household context
- [ ] Check prior Rottweiler experience and activity goals
- [ ] Note referral source
- [ ] Confirm package type (A Interest vs B Waitlist)
- [ ] Apply tag: qualified / neutral / anti-persona
- [ ] Log tag in CRM/spreadsheet (if no CRM: simple tracker with date, name, tag, package)

### Tier 1 vs Tier 2 triage differences

| Dimension | Tier 1 (Package A — Interest list) | Tier 2 (Package A + B) |
|-----------|-------------------------------------|-------------------------|
| **Primary conversion** | Interest list membership | Waitlist consideration (Package B) |
| **Qualified path** | Nurture + program updates; no waitlist/deposit language | Qualification conversation → possible waitlist invitation |
| **Neutral path** | Education nurture; invite to review Health/Education | Same + optional ask for missing fit fields |
| **Anti-persona path** | Polite decline; no waitlist mention | Polite decline; do not discuss deposit or litter availability |
| **Deposit language** | **Never** in Tier 1 sequences | Only after approval, off-site, no amount (Package B) |
| **Litter/puppy availability** | Do not discuss — program in development posture | Discuss only verified facts; no FOMO |

---

## 5. Auto-reply / acknowledgment templates

> **Customization:** Replace `[Operator Name]`, `[Operator Email]`, `[Operator Phone if applicable]`, and SLA placeholder before launch. Voice: Confident, Calm, Precise, Evidence-led, Respectful.

### Package A — Interest list acknowledgment

**Subject:** Thank you — Blacksage Kennels interest list

**Body:**

```
Dear [First Name],

Thank you for joining the Blacksage Kennels interest list and for taking time to share your interest in our program.

We have received your submission. Our breeding program follows an ADRK-aligned, evidence-led approach — health transparency, standards-informed education, and selective placement. We review each inquiry personally.

What happens next:
• We aim to respond within [Operator to set: e.g., 24–48 business hours] on business days.
• Joining the interest list is not a reservation or waitlist placement.
• When program updates are available, we will share them at a thoughtful pace — not frequent promotional email.

If you have not already, we encourage you to review our Health & Education resources on the website. Serious buyers tell us this helps them evaluate fit before any further conversation.

If your question is time-sensitive, you may reply to this email [or call [Operator Phone] if Q7 confirms phone].

Thank you again for your interest.

Warm regards,
[Operator Name]
Blacksage Kennels
[Operator Email]
```

### Package B — Waitlist inquiry acknowledgment

**Subject:** Thank you — Blacksage Kennels inquiry received

**Body:**

```
Dear [First Name],

Thank you for submitting your inquiry for waitlist consideration with Blacksage Kennels.

We have received your application. Our program prioritizes selective, mutual placement — fit for the dog and fit for your home — over volume or speed.

What happens next:
• We review inquiries personally and aim to respond within [Operator to set: e.g., 24–48 business hours] on business days.
• Submitting this form is not approval for the waitlist and does not reserve a puppy.
• If mutual fit is established through our review process, we will discuss next steps individually — including placement process and any waitlist terms. Pricing and deposit details are shared only after qualification, not by email auto-reply.

We appreciate the detail you provided about your experience, household, and goals. If we need clarification, we will reach out by email [or phone if you provided a number].

Thank you for approaching this decision with the seriousness it deserves.

Warm regards,
[Operator Name]
Blacksage Kennels
[Operator Email]
```

### Form success state (on-site — mirror auto-reply)

**Package A:**

> Thank you. You are on our interest list. We review submissions personally and aim to respond within **[Operator to set: e.g., 24–48 business hours]** on business days. Joining the list is not a reservation. Explore our Health & Education pages while you wait.

**Package B:**

> Thank you. Your inquiry has been received. We review applications personally and aim to respond within **[Operator to set: e.g., 24–48 business hours]** on business days. Submission is not waitlist approval or a puppy reservation. Pricing and deposit terms are discussed only after qualification.

---

## 6. Follow-up sequences

> **Frequency rule:** Low frequency, high value. No weekly puppy spam. No FOMO timers. No "only X spots left."

### 6.1 Qualified leads

**Goal:** Move toward qualification conversation and, at Tier 2, mutual-fit waitlist consideration — without pressuring.

| Step | Timing | Channel | Action |
|------|--------|---------|--------|
| **Q1 — Personal response** | Within SLA | Email (phone optional if number provided) | Acknowledge inquiry; ask 1–3 fit clarifiers if needed; invite brief call if appropriate |
| **Q2 — Qualification conversation** | **[Operator to set: e.g., within 1–2 weeks]** of Q1 | Phone or video (operator choice) | Discuss goals, experience, timeline, program fit; **no price quote on first call unless operator chooses** |
| **Q3 — Next steps** | After call | Email | Summarize conversation; if Tier 2 + mutual fit → explain waitlist process; if Tier 1 → confirm interest list + program update expectations |
| **Q4 — Waitlist invitation** (Tier 2 only) | After approval | Email | Send individual waitlist/deposit terms off-site — **operator-provided amounts; never template** |
| **Q5 — Ongoing** | **[Operator to set: e.g., quarterly or at milestones]** | Email | Program/litter updates when verified facts exist; education links |

**Qualified — first personal response template (email):**

**Subject:** Re: Your Blacksage Kennels inquiry

```
Dear [First Name],

Thank you for your thoughtful inquiry. I have reviewed your submission and would like to learn more about your goals and experience with the breed.

A few clarifying questions [customize as needed]:
• [Question 1 — e.g., activity level / training plans]
• [Question 2 — e.g., household / other pets]
• [Question 3 — e.g., timeline flexibility]

If you are open to a brief phone conversation, please reply with a few times that work for you [or call me at [Operator Phone]].

Inquiry is not a reservation — we approach each placement selectively and want to ensure mutual fit before discussing any waitlist or placement steps.

I look forward to connecting.

[Operator Name]
```

**Do not include:** Price, deposit amount, litter count, urgency language.

---

### 6.2 Neutral leads (nurture)

**Goal:** Provide education value; invite deeper engagement without pressure.

| Step | Timing | Channel | Action |
|------|--------|---------|--------|
| **N1 — Acknowledge + educate** | Within SLA | Email | Thank them; point to 1–2 Health/Education resources relevant to their stated goals |
| **N2 — Check-in** | **[Operator to set: e.g., 4–6 weeks]** | Email | Brief note; ask if questions remain; remind interest list status (Tier 1) or inquiry status (Tier 2) |
| **N3 — Re-triage** | After N2 | — | If engagement increases → re-tag qualified; if no response → **[Operator to set: e.g., 90-day]** dormant; no further outreach unless they re-inquire |

**Neutral — nurture template (N1):**

**Subject:** Resources for your Rottweiler research — Blacksage Kennels

```
Dear [First Name],

Thank you for reaching out to Blacksage Kennels. We appreciate your interest in the breed and our program.

While you continue your research, these pages may be helpful:
• [Link — Health/Education hub]
• [Link — How to evaluate a breeder / placement process]

There is no rush — a Rottweiler is a long commitment, and thorough due diligence serves both you and the dog well.

If your timeline or goals become clearer, feel free to reply with any questions. We aim to respond within [Operator to set: e.g., 24–48 business hours] on business days.

Warm regards,
[Operator Name]
```

---

### 6.3 Anti-persona (polite decline)

**Goal:** Decline respectfully; protect operator time and program positioning; no debate.

| Step | Timing | Channel | Action |
|------|--------|---------|--------|
| **A1 — Decline** | Within SLA | Email | Brief, respectful; no lengthy justification |
| **A2 — Close** | — | — | No follow-up sequence; archive |

**Anti-persona signals → decline triggers:**

- Primary message is price-only ("How much?") with no fit context
- Guard-dog, protection, or aggression framing
- Demands immediate availability or checkout-style language
- Disrespectful or bad-faith tone

**Anti-persona — polite decline template:**

**Subject:** Re: Your Blacksage Kennels inquiry

```
Dear [First Name],

Thank you for your interest in Blacksage Kennels.

After reviewing your inquiry, we do not believe our program is the right fit for what you described. Our placements emphasize ADRK-aligned temperament, selective matching, and long-term companion or sport/working homes — not [guard-dog / impulse purchase / price-shopping — customize to signal].

We wish you well in finding the right match for your situation.

[Operator Name]
```

**Do not:** Argue, lecture, or recommend competitors. One email only.

---

## 7. Package and tier routing summary

### Decision tree (post-triage)

```
Inbound inquiry received
├── Package A (Interest list)
│   ├── Qualified → Nurture + program updates (Tier 1) OR qualification path if Tier 2 dual-mode
│   ├── Neutral → Education nurture (N1–N3)
│   └── Anti-persona → Polite decline (A1)
└── Package B (Waitlist inquiry — Tier 2 only)
    ├── Qualified → Q1–Q5 sequence → waitlist invitation after approval
    ├── Neutral → N1–N3; re-triage if engagement improves
    └── Anti-persona → Polite decline (A1)
```

### Monetization touchpoints (off-site only)

| Stage | Allowed language | Prohibited |
|-------|------------------|------------|
| Auto-reply | "Pricing discussed after qualification" | Dollar amounts, "starting at," deposit figures |
| Qualified email | "We will discuss placement terms individually" | Price quote before qualification call (unless operator explicitly chooses) |
| Post-approval (Tier 2) | Operator sends individual terms | Template with invented deposit amount |
| Placement (Package C) | Contract per operator policy | On-site payment or checkout |

---

## 8. Measurement and quality (inbound ops)

Align to GTM north stars — quality over volume:

| Metric | Definition | Target posture |
|--------|------------|----------------|
| **Inquiry quality mix** | % qualified / neutral / anti-persona | Majority qualified at steady state |
| **SLA adherence** | % first responses within operator SLA | **[Operator to set target, e.g., 90%]** |
| **Referral source mix** | "How did you hear about us?" distribution | Track trainer/club/search share |
| **Interest → waitlist conversion** | Tier 2 only; Package A nurture → Package B application | Baseline TBD post-launch |
| **Anti-persona rate** | Declines / total inquiries | Low if GTM discipline holds |

**Not success:** Raw form volume, speed-to-price-quote, conversion to deposit without qualification.

---

## 9. Anti-patterns (inbound ops)

| Anti-pattern | Why | Instead |
|--------------|-----|---------|
| Cold outreach to forum/marketplace leads | Out of scope; trust inversion | Inbound only |
| "Only X puppies left" in follow-up | FOMO; violates Pillar 4 | Natural selectivity language only |
| Price in auto-reply or first email | A10; category norm | After qualification |
| Deposit request before review | Trust inversion (Phase 4) | Post-approval off-site |
| Weekly promotional blasts | GTM: low frequency, high value | Milestone updates only |
| Arguing with anti-persona | Reputational risk | One polite decline |
| Sharing buyer details with referrer | Privacy | Private thank-you only |

---

## 10. Operator setup checklist (before public launch)

- [ ] **Q7 closed:** Inquiry email/CRM destination live; owner assigned
- [ ] **SLA set:** Operator confirms hours; placeholder replaced in templates and site success copy
- [ ] **Auto-reply enabled:** Package A and B templates customized and tested
- [ ] **Phone policy:** Confirm if/when operator calls back qualified leads
- [ ] **Tagging system:** Spreadsheet or CRM field for qualified / neutral / anti-persona
- [ ] **Referral tracking:** "How did you hear about us?" visible in intake
- [ ] **Tier confirmed (Q1):** Tier 1 = Package A sequences only; Tier 2 = add Package B path
- [ ] **Deposit policy (OP-P2):** Individual terms document ready for post-approval — not in templates

---

## Fact / inference / assumption labels

| Statement | Kind |
|-----------|------|
| Serious buyers accept waitlists and qualification before price | Fact (Phase 2) |
| No on-site prices; discuss after qualification | Decision (D2, A10) |
| Three-tag triage (qualified/neutral/anti-persona) | Decision (this handoff) |
| SLA numbers in templates | **Placeholder — operator must set (Q7)** |
| Email primary, phone optional follow-up | Inference — pending Q7 |
| Referrer thank-you on qualified leads only | Decision (GTM referral loop) |
| Blacksage-specific response hours | **Unknown — do not invent** |

---

## Sources

- `06-gtm-plan.md` — demand path, CTA locks, referral loop, measurement
- `05-prd.md` — form spec, Package A/B fields, Q7 gate, auto-reply (S-06)
- `04-business-model.md` — monetization sequencing, deposit posture, anti-patterns
- `.agents/product-marketing.md` — voice, anti-persona, CTA discipline
