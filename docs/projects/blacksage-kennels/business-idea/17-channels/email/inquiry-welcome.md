# Inquiry Welcome & Confirmation

**Journey:** Post-submit acknowledgment + first human response  
**Trigger:** `/inquire` form submission (Package A or B)  
**Goal:** Set expectations, confirm receipt, invite education — no approval, no price, no reservation language  
**Aligns to:** Sales playbook §2.1–2.2, §9

---

## Sequence overview

| # | Name | Send | Audience |
|---|------|------|----------|
| 1 | Package A — auto-acknowledgment | Immediate (automated) | Interest list submitters |
| 2 | Package B — auto-acknowledgment | Immediate (automated) | Waitlist consideration submitters |
| 3 | Initial inquiry response | Within `[RESPONSE_SLA]` (human) | Qualified / all non–anti-persona after triage |
| 4 | Package A — interest list confirmation | With Email 3 or immediately after A1 triage (human) | Confirmed Package A members |

**Exit:** Buyer enters `interest-nurture.md` (A) or operator-led qualification path (B). Anti-persona receives polite decline only — not this sequence.

---

## Email 1: Package A — auto-acknowledgment

**Send:** Immediate on form submit  
**Segment:** Package A — Interest list  
**Automated:** Yes

**Subject:** Thank you — Blacksage Kennels interest list

**Preview:** We received your inquiry. Interest list membership is not a reservation or waitlist placement.

**Body:**

Dear [First Name],

Thank you for joining the Blacksage Kennels interest list and for taking time to share your interest in our program.

We have received your submission. Our breeding program follows an ADRK-aligned, evidence-led approach — health transparency, standards-informed education, and selective placement. We review each inquiry personally.

**What happens next**

- We aim to respond within `[RESPONSE_SLA]` on business days.
- Joining the interest list is **not** a reservation or waitlist placement.
- When program updates are available, we will share them at a thoughtful pace — not frequent promotional email.

If you have not already, we encourage you to review our Health & Education resources on the website. Serious buyers tell us this helps them evaluate fit before any further conversation.

- Health & education → `https://[DOMAIN]/health`
- Our placement process → `https://[DOMAIN]/health#placement`

If your question is time-sensitive, you may reply to this email at `[CONTACT_EMAIL]`.

Thank you again for your interest.

Warm regards,  
[OPERATOR_NAME]  
Blacksage Kennels  
`[CONTACT_EMAIL]`

**CTA:** Health & education → `https://[DOMAIN]/health`

---

## Email 2: Package B — auto-acknowledgment

**Send:** Immediate on form submit  
**Segment:** Package B — Waitlist consideration  
**Automated:** Yes

**Subject:** Thank you — Blacksage Kennels inquiry received

**Preview:** Your inquiry is received. Submission is not waitlist approval or a puppy reservation.

**Body:**

Dear [First Name],

Thank you for submitting your inquiry for **waitlist consideration** with Blacksage Kennels.

We have received your application. Our program prioritizes selective, mutual placement — fit for the dog and fit for your home — over volume or speed.

**What happens next**

- We review inquiries personally and aim to respond within `[RESPONSE_SLA]` on business days.
- Submitting this form is **not** approval for the waitlist and does **not** reserve a puppy.
- If mutual fit is established through our review process, we will discuss next steps individually — including placement process and any waitlist terms. Pricing and deposit details are shared only after qualification, not by email auto-reply.

We appreciate the detail you provided about your experience, household, and goals. If we need clarification, we will reach out by email [or by phone if you provided a number].

While you wait, these pages may help you understand how we evaluate health, temperament, and placement:

- Health testing approach → `https://[DOMAIN]/health#testing`
- Placement process → `https://[DOMAIN]/health#placement`

Thank you for approaching this decision with the seriousness it deserves.

Warm regards,  
[OPERATOR_NAME]  
Blacksage Kennels  
`[CONTACT_EMAIL]`

**CTA:** Our placement process → `https://[DOMAIN]/health#placement`

---

## Email 3: Initial inquiry response (human)

**Send:** Within `[RESPONSE_SLA]` after operator triage  
**Segment:** Qualified or neutral — Package A or B (customize opening by package)  
**Automated:** No — operator sends after review

**Subject:** Your Blacksage Kennels inquiry — next steps

**Preview:** We received your inquiry. Each submission is reviewed individually — not a reservation.

**Body:**

Dear [First Name],

Thank you for taking time to review our program before reaching out. We received your inquiry and appreciate your interest in an ADRK-aligned Rottweiler placement.

**What happens next:** Each inquiry is reviewed individually. This is not a reservation or automatic waitlist placement. We look for mutual fit — your home, goals, and timeline aligned with our selective placement approach.

We aim to respond to substantive questions within `[RESPONSE_SLA]`. If your inquiry indicates waitlist consideration and your submission shows thoughtful research, we may invite a brief phone conversation to discuss fit, our health and temperament standards, and the placement process.

In the meantime, if you have not already, we encourage you to review our Health & Education section — particularly our placement process overview and health testing categories:

- Health & education → `https://[DOMAIN]/health`
- Temperament within the standard → `https://[DOMAIN]/health#temperament`

We respect the commitment a Rottweiler represents and look forward to learning more about your household and goals.

Warm regards,  
[OPERATOR_NAME]  
Blacksage Kennels  
`[CONTACT_EMAIL]`

**CTA:** Health & education → `https://[DOMAIN]/health`

**Do not include:** prices, deposit amounts, "you're on the list," scarcity language, or placement confirmation.

---

## Email 4: Package A — interest list confirmation (human)

**Send:** After A1–A7 triage pass; may follow Email 3 for Package A leads  
**Segment:** Confirmed interest list members  
**Automated:** No — operator or CRM workflow after tag = qualified/neutral on A

**Subject:** You're on the Blacksage interest list

**Preview:** Occasional program updates — not weekly promotions. Not a waitlist reservation.

**Body:**

Dear [First Name],

Thank you for joining our interest list.

You will receive occasional updates when we have program news worth sharing — for example, when breeding stock profiles or litter plans are verified and published. We do not send weekly puppy promotions.

**Please note:** Interest list membership is **not** a waitlist reservation and does **not** guarantee a puppy. When our active program opens waitlist consideration, we will contact interest list members who may be a fit.

If your timeline or goals change, you may reply to this email at any time.

Warm regards,  
[OPERATOR_NAME]  
Blacksage Kennels  
`[CONTACT_EMAIL]`

**CTA:** Explore health & education → `https://[DOMAIN]/health`

---

## On-site success state alignment

These emails mirror on-site confirmation copy in `14-pages/inquire.md`:

| Package | On-site H2 | Email equivalent |
|---------|------------|------------------|
| A | Inquiry received | Email 1 (auto) + Email 4 (confirmed) |
| B | Inquiry received — not approval or waitlist confirmation | Email 2 (auto) |

---

## Metrics

| Metric | Notes |
|--------|-------|
| Auto-ack delivery rate | Target >99% |
| Open rate (auto-ack) | Benchmark only — not a success metric for this program |
| Time to first human response | Within `[RESPONSE_SLA]` |
| Unsubscribe on auto-ack | Monitor; should stay low if cadence rules hold |
