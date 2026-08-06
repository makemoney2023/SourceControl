---
phase: "7"
position: sales-enablement-lead
reports_to: head-of-sales-cs
status: done
verdict_for_manager: ready_to_merge
llm_tier: fast-general
llm_model: composer-2.5-fast
generation_profile: none
generation_used: none
fallback_applied: false
---

# Handoff — Phase 7 Sales Enablement → head-of-sales-cs

## Goal (from context packet)

Produce merge-ready sales enablement content for manager integration into `07-sales-playbook.md`: qualification checklist (Package A → B → C), trust-first talk tracks, objection handling, deposit/placement conversation guide (off-site only, no dollar amounts), and package upgrade/downgrade criteria. Align to D2 trust-first, PRD/GTM packaging, and anti-persona filtering.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/7-sales-enablement-lead.md` | This handoff — merge-ready playbook sections for head-of-sales-cs |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | fast-general |
| llm_model | composer-2.5-fast |
| generation_profile | none |
| generation_used | none |
| fallback_applied | false — no fallback needed |

## Decisions

1. **Qualification is mutual fit, not approval theater.** Every package transition requires explicit criteria met — operator documents pass/fail; no implied placement from form submission alone.
2. **Price and deposit are always off-site and post-qualification.** Scripts reference "discussed individually after review" — never dollar amounts, never on-site collection language.
3. **Anti-persona disqualification is respectful and early.** Guard-dog fantasy, price-only, impulse, and checkout-expecter signals trigger polite decline or Package A-only nurture — not argument or conversion pressure.
4. **Response SLAs are operator-owned.** All timelines labeled **[Operator to set]** per Q7; no invented Blacksage SLA numbers.
5. **Voice lock:** Confident · Calm · Precise · Evidence-led · Respectful — no FOMO, scarcity timers, or machismo tropes.

## Asks for manager (`ask_manager`)

- Peer help needed: `customer-success-manager` for post-placement follow-up scripts and referrer thank-you loop | recommended when `07-sales-playbook.md` expands to post-sale
- Clarification needed: **Q1** (program maturity) determines whether Package B waitlist fields are live; **OP-P1/P2** (price band, deposit policy) block firm placement/deposit scripts — operator interview required before external use | none blocking enablement craft

## Risks / blockers

| Risk | Mitigation |
|------|------------|
| Operator has not set Q7 SLA or OP-P2 deposit policy | Scripts use **[Operator to set]** placeholders; generic "terms provided individually" language only |
| Seller reverts to price-first or FOMO language | Explicit anti-patterns and objection scripts model calm redirect |
| Package B offered before Q1 active program | Upgrade criteria gate on Q1; default Tier 1 = Package A only |
| Guard-dog or impulse leads consume operator time | Early disqualification checklist + polite decline scripts |
| Deposit discussed before qualification complete | Deposit/placement guide enforces sequencing: qualify → terms → deposit off-site |

## Packs used

- `skills/community/marketingskills/sales-enablement/`
- `skills/community/awesome-claude-corporate-skills/05-sales/call-prep/`
- `skills/community/awesome-claude-corporate-skills/05-sales/compose-outreach/`

## Do not

- Mark the phase complete
- Write outside write_lease
- Spawn other positions
- Write `07-sales-playbook.md` (head-of-sales-cs lease)
- Include dollar amounts or invented Blacksage pricing/deposit figures in scripts

---

# Merge-ready craft — head-of-sales-cs → `07-sales-playbook.md`

*Source inputs: `05-prd.md`, `06-gtm-plan.md`, `04-business-model.md`, `.agents/product-marketing.md`. Blacksage-specific price, deposit amount, response SLA, and program capacity remain operator-dependent — labeled **[Operator to set]** or **Assumption** throughout.*

---

## 1. Sales process overview

### Monetization sequencing (locked)

```
Trust content (on-site) → Inquiry → Qualification (off-site) → Price discussion (off-site) → Deposit (if waitlisted, off-site) → Contract → Placement
```

**Site job ends at informed inquiry.** Everything after form submission is operator-owned conversation — never checkout, never instant confirmation, never on-site payment.

### Package map (quick reference)

| Package | Label | Buyer commitment | Payment on site |
|---------|-------|------------------|-----------------|
| **A — Interest list** | Pre-litter / brand-first (Tier 1 default) | Email + brief interest | None |
| **B — Waitlist** | Active program + qualified fit (Tier 2) | Full application + mutual-fit review | None; deposit **after** approval, off-site |
| **C — Placement** | Waitlist match + signed contract | Contract + placement terms | None — all off-site |

### Voice and posture

| Attribute | Standard |
|-----------|----------|
| Tone | Confident · Calm · Precise · Evidence-led · Respectful |
| Frame | Mutual fit — selective placement serves the dog and the home |
| Never | FOMO, scarcity theater, guard-dog tropes, price pressure, "you're approved!" before review |
| CTAs (site-aligned) | Begin your inquiry · Join our interest list · Submit inquiry for waitlist consideration |

### Inquiry quality tags (for operator tracking)

| Tag | Definition | Typical package |
|-----|------------|-----------------|
| **Qualified** | Serious researcher; ADRK-aligned goals; accepts process | A → B or B → C path |
| **Neutral** | Incomplete info; needs education or follow-up | A nurture |
| **Anti-persona** | Guard-dog, price-only, impulse, checkout expecter | Decline or A-only with no upgrade path |

---

## 2. Qualification checklist

Use this checklist at each package transition. Document pass/fail in operator CRM or inquiry log. **Form submission alone does not satisfy any gate.**

### 2.1 Gate: Inquiry received → Package A (Interest list) confirmed

**When:** Tier 1 brand-first launch, or buyer not yet ready for waitlist. Also the default landing state for all new inquiries until B criteria are met.

| # | Criterion | Pass signal | Fail / hold |
|---|-----------|-------------|-------------|
| A1 | **Site engagement** | Buyer references Health/Education, Dogs, or About content; message shows research (50+ char thoughtful response per form spec) | One-line "how much?" with no context → anti-persona screen |
| A2 | **Intent clarity** | States companion / family / sport-working / show-structure goal (form field) | Vague or contradictory goals → follow-up question before confirming A |
| A3 | **Timeline realism** | Timeline field completed; accepts that inquiry ≠ reservation (consent checked) | "Need puppy this month" without flexibility → impulse screen |
| A4 | **Experience baseline** | Prior Rottweiler experience field completed honestly | No experience is OK if education appetite shown |
| A5 | **Anti-persona screen** | No guard-dog, protection-machine, or aggression language in message | Guard-dog fantasy → disqualify (see §4) |
| A6 | **Contact validity** | Valid email; region provided for logistics screening | Spam / honeypot triggered → no action |
| A7 | **Consent** | "I understand inquiry is not a reservation; placements are selective" checked | Missing consent → request resubmission |

**Package A outcome:** Add to interest list; send confirmation with expectations (see §3.2 email). **No price discussion.** **No deposit.**

---

### 2.2 Gate: Package A → Package B (Waitlist consideration)

**When:** Q1 = active program; operator has waitlist capacity; buyer passes mutual-fit review. Requires Tier 2 site UX ("Submit inquiry for waitlist consideration") or operator invitation after A nurture.

| # | Criterion | Pass signal | Fail / remain on A |
|---|-----------|-------------|---------------------|
| B1 | **Program maturity** | Q1 active; operator confirms waitlist open | Pre-litter → stay on A only |
| B2 | **Research depth** | Has reviewed site proof (dogs when live, health categories, placement process); can articulate why Blacksage vs. other kennels | Price-only comparator → remain A or decline |
| B3 | **Home fit** | Household context supports Rottweiler ownership (housing, activity, children/other pets disclosed) | Red flags (e.g., no fence + unsupervised plan) → hold or decline |
| B4 | **Activity match** | Goals align with program direction (companion/family/sport — not guard work) | Guard-dog or protection intent → disqualify |
| B5 | **Temperament expectations** | Accepts ADRK bounds: devoted, biddable, even-tempered — not "attack dog" | Machismo / weapon framing → disqualify |
| B6 | **Waitlist acceptance** | Accepts 6–12+ month norm (**Assumption** — category fact); no "available now" demand | Impulse timeline → remain A or polite decline |
| B7 | **Reference optional** | Trainer/vet reference provided if asked — credibility signal, not required for all | — |
| B8 | **Extended fields** | Package B form complete (preferred sex, tail preference if applicable, agreement acknowledgment) | Incomplete → request before B upgrade |
| B9 | **Phone/video screen** | Operator conversation completed — **[Operator to set]** format and duration | Form-only without conversation → do not upgrade to B |

**Package B outcome:** "Submit inquiry for waitlist consideration" confirmed; operator schedules or completes qualification call. **Still no price on first contact unless buyer asks after B1–B9 pass.** Deposit only after explicit B approval (see §5).

---

### 2.3 Gate: Package B (Waitlist) → Package C (Placement)

**When:** Litter match identified; contract ready; mutual fit reconfirmed at match time.

| # | Criterion | Pass signal | Fail / remain on B |
|---|-----------|-------------|---------------------|
| C1 | **Waitlist standing** | Approved waitlist member in good standing | Never approved for B → cannot reach C |
| C2 | **Litter match** | Puppy/litter assignment aligns with buyer preferences and program plan | No suitable match → remain B; honest timeline |
| C3 | **Reconfirm fit** | Home/activity unchanged or still suitable since B approval | Material life change → re-screen |
| C4 | **Contract review** | Buyer received and reviewed contract/guarantee/return policy (**[Operator to set]** — when OP-P6 docs exist) | Unsigned or unanswered → no C |
| C5 | **Price discussion complete** | Investment discussed individually off-site; buyer accepts in principle | Price objection unresolved → remain B or release |
| C6 | **Deposit terms accepted** | Written waitlist/placement deposit terms provided and accepted — **no dollar amount in scripts** | Deposit hesitation after terms → address trust, not pressure |
| C7 | **Pickup/logistics** | Geography and handoff plan confirmed when Q2 set | Logistics mismatch → hold |
| C8 | **Operator sign-off** | Operator explicitly approves placement | No operator approval → never C |

**Package C outcome:** Signed contract; deposit collected off-site per operator policy; placement scheduled. **Never confirm placement in auto-reply or before C8.**

---

### 2.4 Anti-persona disqualification checklist (all packages)

If **any** row matches strongly, do not upgrade — use polite decline script (§4.6).

| Anti-persona | Signals in inquiry or call | Action |
|--------------|---------------------------|--------|
| **Guard-dog fantasy** | "Protection," "guard," "attack," "weapon," "intruder," "aggressive" as desired trait | Disqualify; education optional, no B/C |
| **Price-only comparator** | First/only question is price; dismisses health/pedigree questions | Decline or A-only with no price quote |
| **Impulse buyer** | "This weekend," "ASAP," "any puppy now," resists waitlist norm | Remain A or decline |
| **Checkout expecter** | "How do I pay online?" "Reserve with credit card?" "Add to cart?" | Clarify process once; if persists, decline |

---

## 3. Talk tracks

Scripts are **guides**, not verbatim mandates. Adapt with operator facts when available. Maintain calm, evidence-led voice throughout.

### 3.1 Initial inquiry response (email — within **[Operator to set]** of receipt)

**Subject:** Your Blacksage Kennels inquiry — next steps

> Thank you for taking time to review our program before reaching out. We received your inquiry and appreciate your interest in an ADRK-aligned Rottweiler placement.
>
> **What happens next:** Each inquiry is reviewed individually. This is not a reservation or automatic waitlist placement. We look for mutual fit — your home, goals, and timeline aligned with our selective placement approach.
>
> **[Operator to set]:** We aim to respond within [X business days]. If your inquiry indicates waitlist consideration, we may invite a brief phone conversation to discuss fit, our health and temperament standards, and the placement process.
>
> In the meantime, if you have not already, we encourage you to review our Health & Education section — particularly our placement process overview and health testing categories.
>
> We respect the commitment a Rottweiler represents and look forward to learning more about your household and goals.
>
> Warm regards,  
> [Operator name / Blacksage Kennels]

**Do not include:** prices, deposit amounts, "you're on the list," scarcity language, or placement confirmation.

---

### 3.2 Package A confirmation (interest list)

**Subject:** You're on the Blacksage interest list

> Thank you for joining our interest list. You will receive occasional updates when we have program news worth sharing — for example, when breeding stock profiles or litter plans are verified and published. We do not send weekly puppy promotions.
>
> **Please note:** Interest list membership is not a waitlist reservation and does not guarantee a puppy. When our active program opens waitlist consideration, we will contact interest list members who may be a fit.
>
> If your timeline or goals change, you may reply to this email at any time.
>
> [Operator signature]

---

### 3.3 Qualification call opener (phone)

> "Thank you for making time today. I want to start by saying this conversation is a mutual fit check — not an approval interview. We place selectively because a Rottweiler is a ten-plus-year commitment, and our job is to match the right puppy to the right home.
>
> I've reviewed your inquiry. Before we go further, I'd like to hear in your words what drew you to an ADRK-aligned program and what role you see the dog playing in your household — companion, family, sport, or something else.
>
> Then I'll share how our placement process works, what health and temperament standards we hold, and honest timeline expectations. You can ask anything. If we're not the right fit, I'll say so respectfully — and I hope you'll feel comfortable doing the same."

**Do not open with:** price, deposit, litter availability, or "we have puppies ready."

---

### 3.4 Qualification call — core questions (Package B path)

Ask in natural order; not an interrogation checklist.

| Topic | Sample question | What you're listening for |
|-------|-----------------|---------------------------|
| **Research** | "What did you learn from our site that mattered most to you?" | Evidence engagement vs. price-only |
| **Goals** | "Describe a typical week with the dog — exercise, training, household rhythm." | Realistic activity match |
| **Experience** | "Tell me about your Rottweiler or large-breed experience." | Openness to guidance if novice |
| **Household** | "Who lives at home? Other pets? Children?" | Safety and management plan |
| **Temperament** | "What temperament traits matter most to you in a Rottweiler?" | Biddable/devoted vs. guard fantasy |
| **Timeline** | "Our process often involves a wait. What timeline are you working with?" | Flexibility vs. impulse |
| **Commitment** | "Are you prepared for health testing literacy, training, and breed-specific responsibility?" | Seriousness |
| **Referral** | "How did you hear about us?" | Referrer thank-you loop (qualified leads only) |

**Redirect if guard-dog language appears:**

> "I want to be direct: Blacksage breeds toward the ADRK standard — good-natured, devoted, biddable, even-tempered. We do not breed or place for guard work, protection sport, or aggression marketing. If your primary goal is a protection dog, we are not the right program — and I'd rather tell you that now than waste your time."

---

### 3.5 Package B invitation (email — after qualification pass)

**Subject:** Waitlist consideration — next step for your Blacksage inquiry

> Thank you for our conversation [or: for your detailed inquiry]. Based on what you've shared, we'd like to invite you to **submit inquiry for waitlist consideration**.
>
> **What this means:** Waitlist consideration is a mutual fit step — not a reservation. If approved, you'll receive individualized terms for any waitlist deposit and placement process. Pricing and deposit details are always discussed after qualification, never on our website.
>
> **Next step:** [Complete the waitlist fields on our inquiry form / Reply confirming you wish to proceed / Schedule follow-up — **[Operator to set]**]
>
> **Timeline:** [Operator to set — honest wait expectation, e.g., "Our waitlist norm in this category is often six to twelve months or longer — Assumption from market research, not a Blacksage guarantee."]
>
> If you have questions before proceeding, reply to this email.
>
> [Operator signature]

---

### 3.6 Polite decline (email — anti-persona or poor fit)

**Subject:** Regarding your Blacksage Kennels inquiry

> Thank you for your interest in Blacksage Kennels and for the time you put into your inquiry.
>
> After review, we don't believe our program is the right match for what you've described — [optional brief reason: e.g., "our placements are structured for companion and sport/working homes within ADRK temperament bounds, not guard or protection roles" / "we're unable to meet an immediate timeline"].
>
> We encourage you to continue researching responsible breeders through breed club resources and health registry tools like OFA/CHIC. A thoughtful match matters more than speed.
>
> We wish you well in your search.
>
> [Operator signature]

**Do not:** argue, upsell, offer "special exceptions," or quote price to win the lead.

---

## 4. Objection handling

Respond with calm precision. Never pressure. Never invent numbers.

### 4.1 "How much do puppies cost?" / price-first

**Principle:** Category norm is discuss-after-qualification (Fact: 0/8 competitors publish on-site). Blacksage price is **unknown** — operator sets OP-P1.

> "We don't publish pricing on our website — that’s intentional. Investment is discussed individually after we've both determined mutual fit, typically once waitlist consideration or placement matching is underway. I'd rather understand your goals and our program first so any number we discuss comes with context about health testing, placement support, and what you're actually receiving.
>
> If price is the only decision factor, we may not be the right fit — and that's okay."

**If they refuse to engage without a number:**

> "I understand budget matters. Without a qualification conversation, I can't provide a meaningful quote tied to our program. If you'd like to proceed with that conversation, I'm happy to. If not, I respect that and won't press."

**Do not:** give a range, "starting at," or category midpoint as if it were Blacksage policy.

---

### 4.2 "Why don't you list prices on the site?"

> "Serious buyers in this category typically evaluate health clearances, pedigrees, and placement philosophy before price — same as you would with other premium ethical breeders. Publishing a number without context attracts price-shoppers and impulse inquiries that aren't fair to the dogs or to families who've done the research.
>
> Our site is built for due diligence first. Pricing comes after we know we're aligned."

---

### 4.3 "How long is the wait?"

> "Waitlist timelines vary by program capacity and litter planning. In our category, six to twelve months or longer is common — **Assumption** from market research, not a guarantee of our current queue.
>
> **[Operator to set]:** I'll give you an honest picture of our current posture after we complete qualification. Inquiry and interest list membership don't hold a place in line — approved waitlist placement does."

**Do not:** promise a date, imply urgency, or say "spots are filling up."

---

### 4.4 "Why do you require a deposit?" / deposit hesitation

> "If you're approved for our waitlist, a deposit may be required — terms are provided individually in writing. Deposits in ethical breeding typically credit toward placement and reflect a shared commitment after mutual fit is established — not a fee to skip the line.
>
> We don't collect deposits at inquiry or on our website. You'll receive full terms before any payment is requested, and you'll have time to review them."

**Do not:** state dollar amount, refund terms (unless operator has locked OP-P2 and seller is authorized), or pressure immediate payment.

---

### 4.5 Guard-dog / protection requests

> "Blacksage breeds toward ADRK/FCI temperament — good-natured, devoted, biddable, even-tempered. A Rottweiler is a powerful breed, and responsible ownership includes training and management — but we do not market or place for guard work, protection roles, or aggression-forward use cases.
>
> If protection is your primary goal, I recommend working with a qualified trainer on a different path. We're not the right kennel for that intent."

**Action:** Disqualify; do not offer "well-bred Rottweilers deter people naturally" as a workaround.

---

### 4.6 Impulse buyer / "Do you have puppies available now?"

> "We place selectively and plan litters deliberately — we don't operate on an 'available now' model. If you need a puppy on an immediate timeline, we likely can't serve that need well, and I'd rather be honest than rush a mismatch.
>
> You're welcome to join our interest list for future program updates, but I can't promise availability on your timeline."

**Do not:** create FOMO ("last puppy," "someone else is interested").

---

### 4.7 "Can I just pay online / reserve on the website?"

> "No — and that's by design. Our website is for research and informed inquiry, not checkout. Every placement goes through qualification and contract review. That's how ethical breeders protect the dogs and the families they go to."

---

### 4.8 "Another breeder quoted me $X" (price comparison)

> "Different programs carry different health testing depth, pedigrees, placement support, and placement standards. A number alone doesn't compare those.
>
> If Blacksage is the right program for you, we'll discuss investment in context after qualification. If the deciding factor is the lowest quote, we may not be the best match — our selective model isn't built to compete on price alone."

---

## 5. Deposit and placement conversation guide

**Scope:** Off-site only. After Package B approval. No dollar amounts in these scripts.

### 5.1 Sequencing (non-negotiable)

```
1. Qualification complete (B1–B9 pass)
2. Operator approves waitlist membership
3. Written terms sent (deposit, refund policy, placement conditions) — [Operator to set / OP-P2]
4. Buyer reviews and accepts in writing
5. Deposit collected off-site (check, transfer, etc. — [Operator to set])
6. Waitlist position confirmed in writing — [Operator to set whether position numbers are shared]
7. Litter match → reconfirm fit → contract → Package C → balance per contract
```

**Never:** collect deposit before step 3. Never collect on website. Never verbal-only deposit agreements.

---

### 5.2 Waitlist approval + deposit invitation (phone or email)

> "I'm pleased to let you know we've approved your waitlist consideration — subject to the written terms I'm sending separately.
>
> The terms cover waitlist deposit, how it credits toward placement, refund conditions, and what happens if either party needs to withdraw. Please read them fully. There is no payment due until you've accepted in writing and had your questions answered.
>
> Take the time you need. We're not running a countdown on your decision."

---

### 5.3 Deposit conversation — buyer questions (without stating amounts)

| Buyer question | Response frame |
|----------------|----------------|
| "How much is the deposit?" | "The amount is in the written terms I'm providing — it reflects our operator policy, not a website quote." |
| "Is it refundable?" | "Refund conditions are spelled out in your terms — [Operator to set / OP-P2]. Read that section and ask me anything unclear." |
| "Does it hold my puppy?" | "It confirms waitlist commitment after approval — not a specific puppy assignment. Puppy matching happens when a litter aligns with your profile." |
| "Can I pay in installments?" | "[Operator to set — OP-P3 payment schedule]" |
| "I need to think about it." | "Absolutely. The terms will be there when you're ready. No pressure from our side." |

---

### 5.4 Litter match → placement (Package C) conversation

> "We have a potential match we'd like to discuss — a litter planned for [timeframe — operator verified only]. Before we go further, I want to reconfirm your household and goals haven't changed since waitlist approval.
>
> If we both agree to proceed, I'll send the placement contract and discuss investment balance, pickup logistics, and health documentation. Signing and deposit credit application happen after you've reviewed everything.
>
> If this litter isn't the right fit, you remain on the waitlist for a future match — no penalty for passing on a single opportunity, per your contract terms."

**Do not:** pressure acceptance, imply other buyers waiting, or confirm placement before contract signed.

---

### 5.5 Site-legal deposit language (for seller alignment with PRD)

When referencing what the **website** says (Package B form acknowledgment):

> "As our site states: a waitlist deposit may be required after application approval. Terms are provided individually."

**Never contradict site:** do not quote amounts on site; do not promise no deposit if operator policy requires one.

---

## 6. Package upgrade and downgrade criteria

### 6.1 Upgrade paths

| From | To | Trigger | Operator action |
|------|-----|---------|-----------------|
| **Inquiry** | **A (Interest)** | Tier 1 default; or buyer not ready for waitlist | Confirm A1–A7; send §3.2 email |
| **A (Interest)** | **B (Waitlist)** | Q1 active + B1–B9 pass + qualification call complete | Send §3.5 invitation; collect Package B fields if missing |
| **B (Waitlist)** | **C (Placement)** | C1–C8 pass + litter match + signed contract | Initiate §5.4 conversation; off-site payment per terms |

**Upgrade rule:** Each gate requires explicit operator approval documented in inquiry record. Auto-upgrade from form submission alone is **prohibited**.

---

### 6.2 Downgrade / hold paths

| From | To | Trigger | Operator action |
|------|-----|---------|-----------------|
| **B (Waitlist)** | **A (Interest)** | Timeline no longer active; buyer requests pause; capacity closed | Confirm still welcome on interest list; release deposit per OP-P2 if applicable |
| **B (Waitlist)** | **Released** | Poor fit discovered post-approval; buyer withdrawing; anti-persona revealed | Written release; deposit handling per contract **[Operator to set]** |
| **C (Placement)** | **B (Waitlist)** | Litter match fell through; buyer passed on assignment | Reconfirm waitlist standing per contract |
| **Any** | **Declined** | Anti-persona confirmed; guard-dog; irreconcilable fit | §3.6 polite decline |

**Downgrade rule:** Document reason code (fit / timeline / anti-persona / capacity / buyer-initiated). Never shame the buyer.

---

### 6.3 Tier 1 vs Tier 2 operational note

| Launch tier (Q1) | Live packages | Seller default |
|------------------|---------------|----------------|
| **Tier 1** (pre-litter) | **A only** | All inquiries → Interest list; no B invitations until Tier 2 promotion |
| **Tier 2** (active program) | **A + B**; C in process | Qualify for B when capacity open; C only on litter match |

---

## 7. Operator setup checklist (before using playbook externally)

| Item | Status | Blocks |
|------|--------|--------|
| **Q7** Inquiry destination + owner + response SLA | **[Operator to set]** | §3.1 timeline copy |
| **Q1** Program maturity (Tier 1 vs 2) | **[Operator to set]** | B/C availability |
| **OP-P1** Placement price band | **[Operator to set]** | Price conversations |
| **OP-P2** Deposit amount + refund policy | **[Operator to set]** | §5 deposit scripts |
| **OP-P3** Payment schedule | **[Operator to set]** | Balance/installment answers |
| **OP-P6** Contract / guarantee docs | **[Operator to set]** | C gate |
| Qualification call format (phone/video) | **[Operator to set]** | B9 |
| CRM or inquiry log for pass/fail documentation | **[Operator to set]** | Audit trail |

---

## 8. Anti-patterns (sales — do not execute)

| Anti-pattern | Why |
|--------------|-----|
| Quoting price before qualification | Violates A10, D2, category norm |
| Stating deposit dollar amount in email/script | OP-P2 not public; PRD prohibits on-site amounts |
| "You're approved!" in auto-reply | Inquiry ≠ approval; U2/U5 violation |
| FOMO ("another family interested," "last spot") | Pillar 4; GTM anti-pattern |
| Guard-dog upsell or "natural protector" workaround | T5; anti-persona attraction |
| Collecting payment on website or via form link | W-03, W-10 |
| Arguing with declined anti-persona leads | Reputation risk; wastes operator time |
| Promising wait timeline without operator data | Invented SLA |
| Upgrading to B without qualification call | B9 gate |

---

## 9. Fact / inference / assumption labels (load-bearing)

| Kind | Statement |
|------|-----------|
| **Fact** | Site does not publish prices; inquiry is not reservation; 0/8 competitors publish on-site prices |
| **Fact** | Package A/B/C map locked in PRD; deposit after approval off-site |
| **Fact** | ADRK temperament bounds prohibit guard-dog marketing |
| **Inference** | Qualification call improves fit vs. form-only for Package B |
| **Assumption** | Category waitlist norm 6–12+ months (market research — not Blacksage SLA) |
| **Decision** | Anti-persona disqualification is respectful and early |
| **[Operator to set]** | Response SLA, deposit amount, price band, contract terms, waitlist position policy |

---

## Sources (merged)

- `05-prd.md` — inquiry form fields, packaging A/B/C, consent copy, deposit language
- `06-gtm-plan.md` — demand path, CTA locks, monetization sequencing, anti-patterns
- `04-business-model.md` — pricing posture, deposit sequencing, trust-first economics
- `.agents/product-marketing.md` — ICP, anti-persona, voice, pillars, CTA locks
