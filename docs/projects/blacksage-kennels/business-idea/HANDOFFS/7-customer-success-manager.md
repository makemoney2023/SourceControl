---
phase: "7"
position: customer-success-manager
reports_to: head-of-sales-cs
status: done
verdict_for_manager: ready_to_merge
llm_tier: fast-general
llm_model: composer-2.5-fast
generation_profile: none
generation_used: none
fallback_applied: false
---

# Handoff — Phase 7 Post-Placement CS → head-of-sales-cs

## Goal (from context packet)

Produce handoff for manager merge into `07-sales-playbook.md` covering **post-placement retain / puppy transition CS**: go-home transition checklist, puppy support touchpoints, health/vet documentation handoff, referral loop activation, issue escalation paths, and long-term relationship — aligned to D2 trust-first, selective placement, and ADRK temperament bounds.

---

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/7-customer-success-manager.md` | This handoff — merge-ready CS sections for `07-sales-playbook.md` |

---

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | fast-general |
| llm_model | composer-2.5-fast |
| generation_profile | none |
| generation_used | none |
| fallback_applied | no |

---

## Decisions

- **CS scope begins at Package C placement confirmation**, not at inquiry or waitlist. Pre-placement qualification and close belong in upstream sales playbook sections; this handoff covers **retain / transition / alumni** only.
- **Go-home support is proactive, calm, and educational** — not a sales follow-up or scarcity re-engagement. Tone matches Pillar 5 (education before sale) extended into ownership.
- **All Blacksage-specific policy references defer to operator contract** (return, guarantee, rehoming, health warranty). Playbook describes *categories* and *process*, not invented terms.
- **Referral asks are post-placement only**, triggered by verified satisfaction (owner-initiated positive update, successful vet visit, trainer endorsement) — never mass email, never pre-go-home, never incentivized (Phase 6: no affiliate/commission v1).
- **Touchpoint timing is operator-configurable.** All schedule labels use **[Operator to set]**; no invented SLA numbers.
- **Escalation paths separate health urgency from temperament coaching from contractual rehoming** — each has a distinct first responder and documentation trail.
- **Long-term relationship is opt-in alumni continuity**, not a marketing list. Repeat-buyer consideration is framed as mutual fit re-evaluation, not loyalty discount or FOMO for "next litter."

---

## Asks for manager (`ask_manager`)

- Peer help needed: **sales-development-rep** (if spawned) for handoff boundary between Package C contract signing and CS go-home kickoff | none if single operator owns both
- Clarification needed: **Operator contract template** (OP-P6) for exact health doc bundle, registry transfer steps, and rehoming clause language before CS scripts reference specific deliverables | default: "per operator contract" placeholder stands

---

## Risks / blockers

- **Policy vacuum:** Without operator-signed contract/guarantee text, CS cannot cite specific return windows or health guarantees — playbook uses process categories only; manager should flag OP-P6 as blocking for final script polish.
- **Astroturf risk:** Asking for referrals or testimonials before verified positive outcome damages M5 referrer shareability. Playbook gates referral ask behind satisfaction signals.
- **Guard-dog drift post-placement:** Owners seeking aggression training or "protection" framing should be redirected to ADRK-bounds education and qualified trainer coordination — not dismissed, but not enabled.
- **Q7 / response ownership unclear:** If inquiry responder ≠ go-home CS owner, handoff between sales close and CS kickoff must be documented by operator **[Operator to set]**.

---

## Packs used

- `skills/org/HANDOFF-TEMPLATE.md`
- Inputs: `06-gtm-plan.md`, `05-prd.md`, `04-business-model.md`, `.agents/product-marketing.md`
- Referenced: Phase 6 referral loop (organic, post-placement), Package C anatomy (04-business-model)

---

## Do not

- Mark the phase complete
- Write outside write_lease
- Spawn other positions
- Inherit parent model when MODEL-REGISTRY pins a different tier (esp. creative/legal)

---

# Merge-ready craft — Post-placement CS (for `07-sales-playbook.md`)

> **Strategic context:** Blacksage CS is the **retain** half of Phase 7 sales/CS. Placement (Package C) is the revenue event; CS ensures the puppy transition succeeds, the owner relationship stays trust-aligned, and satisfied homes become organic referrers — without FOMO, price pressure, or astroturf. Voice: **Confident · Calm · Precise · Evidence-led · Respectful** (`.agents/product-marketing.md`).

---

## 1. CS scope and handoff from sales

### When CS ownership begins

| Trigger | CS action | Sales action (upstream) |
|---------|-----------|-------------------------|
| Package C contract signed + go-home date confirmed | Open CS file; send pre-go-home welcome packet outline | Final fit confirmation; contract terms reviewed |
| Puppy goes home | Execute go-home checklist (§2) | — |
| **[Operator to set]** days post-go-home | Begin scheduled touchpoints (§3) | — |
| Owner-initiated concern | Route per escalation (§5) | Loop in if contractual |

**Rule:** CS does not re-sell, upsell litters, or solicit deposits. CS may share site education links and process reminders only.

### Internal handoff checklist (sales → CS)

- [ ] Buyer name, contact, household context (from Package B application)
- [ ] Puppy identity (name, sex, litter, sire/dam)
- [ ] Go-home date and logistics (pickup vs transport — per operator arrangement)
- [ ] Contract signed; copy filed **[Operator to set location]**
- [ ] Health/vet documentation bundle prepared (§4)
- [ ] Assigned CS responder **[Operator to set]**
- [ ] Optional: buyer's trainer/vet contact if provided on application

---

## 2. Go-home transition checklist

Structured support reduces early-placement failures and builds referrer-grade satisfaction. Adapt depth to operator capacity; minimum = documented checklist + one proactive contact in first 72 hours.

### Pre-go-home (before pickup / transport)

| Item | Owner / buyer action | Blacksage CS action |
|------|---------------------|---------------------|
| Contract + payment balance | Per operator contract | Confirm completion before release |
| Health/vet doc bundle | Receive at go-home | Prepare per §4; walk through at pickup |
| Microchip / registration paperwork | Review transfer steps | Explain registry follow-up timeline |
| Puppy packet (if operator provides) | Take home | Socialization notes, feeding schedule, vet rec — **only operator-verified content** |
| Home prep reminder | Crate, vet appointment booked, household plan | Send calm checklist email **[Operator to set]** days before |
| Emergency contact | Save operator CS number/email | Provide single point of contact |

**Voice note (pickup day):** Frame go-home as the start of a long relationship, not "final sale." Reinforce ADRK temperament expectations: good-natured, biddable, even-tempered — **not** guard-dog or protection framing (Pillar 2, T5).

### First 72 hours

| Priority | Checklist for buyer | CS touchpoint |
|----------|---------------------|---------------|
| **Safety & settling** | Quiet space, supervised exploration, established feeding times | Optional: brief "how is first night?" message **[Operator to set]** |
| **Vet scheduling** | Wellness exam within **[Operator to set]** (category norm: first week) | Remind of recommended timeline; do not diagnose |
| **Eating / elimination** | Monitor appetite and stool; note stress signals | Ask open question: "Anything unexpected?" |
| **Sleep / crate** | Expected adjustment period | Normalize; link to education if operator has puppy-raising content |
| **Other pets / children** | Supervised introductions only | Offer household integration tips within ADRK bounds |

**Do not:** Imply urgency to "lock in" training packages, next litter interest, or referral sharing in first 72 hours.

### First week

| Focus | Buyer guidance | CS action |
|-------|----------------|-----------|
| **Vet wellness visit** | Bring health records from §4 | Follow up: "Did your vet have everything they needed?" |
| **Routine establishment** | Feeding, potty, sleep schedule | Answer fit/temperament questions within normal puppy behavior |
| **Socialization window** | Positive exposures per operator socialization narrative | Point to Health/Education resources on site if live |
| **Boundaries & training** | Start basics; avoid harsh corrections | Recommend buyer's trainer if listed on application; offer trainer coordination (§6) |
| **Documentation** | File health records | Confirm buyer received complete bundle |

### First month

| Focus | Buyer guidance | CS action |
|-------|----------------|-----------|
| **Growth & nutrition** | Feed per operator guidance | Redirect diet changes to vet |
| **Behavior baseline** | Puppy mouthing, chewing, confidence building | Distinguish normal puppy behavior from concerns → §5 if needed |
| **Registration follow-up** | Complete AKC/ADRK transfer per contract | Remind once if pending **[Operator to set]** |
| **Training continuity** | Puppy class or private trainer | Check in on trainer fit if buyer opted in |
| **Relationship checkpoint** | — | Scheduled touchpoint per §3 |

---

## 3. Puppy support touchpoints

### Principles

- **Scheduled, not spammy.** Low frequency, high value — aligned to GTM interest-list discipline ("no weekly puppy spam").
- **Operator sets cadence.** All intervals below are placeholders.
- **Channel:** Email or phone per buyer preference and Q7-adjacent ops setup **[Operator to set]**.
- **Response time:** **[Operator to set]** — do not invent SLA.

### Recommended touchpoint schedule (template)

| Touchpoint | Timing | Purpose | Sample opener (adapt) |
|------------|--------|---------|----------------------|
| **T0 — Go-home** | Pickup day | Doc walkthrough, emergency contact | "Congratulations on bringing [puppy] home. Here is what we covered today…" |
| **T1 — Early check-in** | **[Operator to set]** (e.g., 48–72 hours) | Settling, eating, first vet scheduled | "How is the first few days going? Anything we can help clarify?" |
| **T2 — Week one** | **[Operator to set]** (e.g., day 5–7) | Vet visit follow-up, routine questions | "Did your wellness visit go smoothly? Did the vet have our health records?" |
| **T3 — Month one** | **[Operator to set]** (e.g., week 3–4) | Behavior baseline, training, registration | "How is [puppy] settling into your routine?" |
| **T4 — Quarter one** | **[Operator to set]** (e.g., ~90 days) | Temperament development, satisfaction pulse | "We like to check in at the three-month mark…" |
| **T5 — Annual (optional)** | **[Operator to set]** | Alumni relationship; life update | "Hope [dog] is doing well — we'd love a update when you have a moment." |

### Touchpoint content boundaries

| OK in touchpoints | Not OK |
|-------------------|--------|
| Puppy care, socialization, training resources | "Only X puppies left in next litter" |
| Health record / registry reminders | Price quotes for future puppies |
| Trainer/vet coordination offers | Pressure to refer before satisfaction verified |
| Link to site Health/Education | Guard-dog or protection framing |
| Invitation to share concerns early | Implying buyer must respond within X hours |

### Satisfaction signals (for §4 referral gate)

Record informally **[Operator to set CRM/note system]** when buyer demonstrates:

- Positive unprompted update (photo, milestone, trainer praise)
- Successful vet visit with no open health disputes
- Completes registration transfer
- Re-enrolls for alumni check-in voluntarily
- Trainer provides positive feedback to operator

---

## 4. Health / vet documentation handoff

### What the buyer receives at go-home (Package C deliverable)

Per `04-business-model.md` Package C anatomy: *"Selectively placed ADRK-aligned Rottweiler puppy + health docs per operator inventory."* Exact bundle is **operator-defined** — below is the category-standard checklist CS should verify before release.

| Document / item | Purpose | Notes |
|-----------------|---------|-------|
| **Vaccination record** | Vet continuity | Dates, product names, next due dates |
| **Deworming / parasite treatment log** | Vet continuity | As administered by operator |
| **Health exam summary** | Baseline for buyer's vet | From operator vet; date of exam |
| **Microchip certificate** | ID transfer | Chip number + registry |
| **Pedigree / registration application or transfer** | Ownership registry | Per operator contract — AKC or applicable registry |
| **Parent health testing summary** | Buyer due diligence | Categories only unless operator provides per-dog OFA/CHIC printouts with registry links |
| **Contract copy** | Terms reference | Signed; includes rehoming/return clauses **per operator contract** |
| **Feeding / care sheet** | Transition consistency | Operator-verified only — no generic internet handouts presented as Blacksage protocol |

**Prohibited:** Claiming "100% healthy," "disease-free," or guaranteed outcomes (Pillar 3 voice bounds).

### Registry follow-up process

| Step | Owner | Timing |
|------|-------|--------|
| 1. Review paperwork at go-home | CS walks buyer through each item | Pickup day |
| 2. Buyer completes transfer with registry | Buyer submits per registry instructions | **[Operator to set]** |
| 3. CS confirms receipt (optional) | Buyer sends confirmation or CS verifies registry | **[Operator to set]** |
| 4. Reminder if incomplete | Single polite reminder | **[Operator to set]** after go-home |
| 5. Escalation if dispute | Route to operator | Per §5 if registration blocked by health dispute |

### Vet handoff talking points (pickup / T1)

- "Your vet will want this vaccination and exam history at the first wellness visit."
- "Parent health clearances are verifiable at OFA/CHIC when we publish registry links — ask if you want help locating them on the site."
- "If your vet identifies a concern, contact us promptly so we can follow **per operator contract** — we want to support you, not debate in abstract."

**Do not:** Provide veterinary diagnosis, guarantee outcomes, or contradict buyer's licensed vet in writing.

---

## 5. Issue escalation paths

### Escalation principles

1. **Respond with calm urgency** — health concerns may be time-sensitive; temperament questions rarely are.
2. **Document every escalation** **[Operator to set location]**.
3. **Contract is the source of truth** for return, rehoming, guarantee, and health dispute resolution — CS explains process, operator decides terms.
4. **Never blame the buyer** for normal puppy behavior; never dismiss legitimate health concerns.

### Path A — Health concerns

| Severity | Examples | First responder | Action |
|----------|----------|-----------------|--------|
| **Emergency** | Collapse, severe injury, acute distress | Buyer → emergency vet **first** | CS available for support after stabilizing; notify operator **[Operator to set]** |
| **Urgent (non-ER)** | Persistent GI issues, limping, skin infection, not eating 24h+ | CS → operator | Encourage vet visit; request records; follow **per operator contract** for health disputes |
| **Routine** | Vaccine timing, diet question, minor scratch | CS | Educate; defer to buyer's vet for clinical decisions |

**Script anchor:** "Your puppy's health comes first — please see your veterinarian. Once you have their assessment, send us [records/notes] and we'll work through next steps per our placement agreement."

### Path B — Temperament / behavior questions

| Signal | Likely category | CS response |
|--------|-----------------|-------------|
| Puppy biting, chewing, zoomies | Normal puppy behavior | Reassure; training resources; offer trainer coordination (§6) |
| Fear periods, reactivity onset | Needs professional guidance | Recommend qualified Rottweiler-experienced trainer; **no guard-dog or protection training referrals** |
| Aggression toward people/animals | Serious — needs assessment | Operator consult; professional behavior eval; **per operator contract** if placement fit in question |
| Buyer wants "protection training" | Anti-persona drift | Redirect to ADRK even-tempered companion/working aptitude framing; decline to endorse machismo programs |

**Voice bound:** Never promise "non-aggressive" absolutes; acknowledge breed power and owner responsibility (`.agents/product-marketing.md` tone table).

### Path C — Rehoming / return (contractual)

| Scenario | CS role | Policy reference |
|----------|---------|------------------|
| Buyer cannot keep dog | Listen without judgment; explain **per operator contract** rehoming clause | OP-P6 — operator provides exact text |
| Operator-assisted rehoming | Facilitate intro to screened homes if contract allows | No public "available rehome" FOMO posts without operator approval |
| Health-based return dispute | Document; operator decision | **Per operator contract** — CS does not negotiate terms ad hoc |
| Buyer requests refund | Defer to contract + operator | No invented refund windows |

**Script anchor:** "We're committed to responsible placement for the life of the dog. Let's review what your agreement outlines and find the best path forward together."

### Escalation matrix (summary)

```
Owner contacts CS
  ├─ Health emergency → ER vet first → notify operator
  ├─ Health non-emergency → vet visit → records → per operator contract
  ├─ Temperament (normal puppy) → education + trainer offer
  ├─ Temperament (serious) → operator + professional eval
  └─ Rehoming / return → per operator contract → operator decision
```

---

## 6. Referral loop activation (post-placement only)

Inherited from Phase 6 GTM referral loop — CS executes the **owner side** after verified satisfaction.

### Referral loop (CS execution)

```
Positive trigger (verified satisfaction — §3 signals)
  → Operator 1:1 ask (not mass email)
  → Owner shares canonical site URL if willing
  → New buyer verifies on site → inquiry
  → "How did you hear about us?" → thank referrer on qualified leads only
```

### When to ask (gates — all must pass)

| Gate | Requirement |
|------|-------------|
| **G1 — Timing** | Minimum **[Operator to set]** after go-home (recommend: post–month-one touchpoint or later) |
| **G2 — Satisfaction** | Verified positive signal (§3) — not absence of complaints alone |
| **G3 — No open disputes** | No unresolved health, contract, or temperament escalation |
| **G4 — Owner consent** | Ask permission; accept "not now" without follow-up pressure |

### How to ask (1:1, no FOMO)

**Preferred channel:** Phone or personal email from operator/CS — not bulk campaign.

**Sample ask (adapt):**

> "We're glad [dog] is doing well. If you know someone researching an ADRK-aligned Rottweiler program the way you did — health tests, temperament, selective placement — we'd appreciate you sharing our website when it feels natural. No obligation; we only ask when families tell us things are going well."

**If owner agrees to testimonial (site C-03 backlog):**

- Written consent required **[Operator to set form]**
- Publish only verified owner statements; no editing that invents claims
- Photo only with explicit permission; no stock imagery

### What never to do

| Anti-pattern | Why |
|--------------|-----|
| Referral ask before go-home or during deposit stress | Trust inversion; feels transactional |
| Mass "refer a friend" email with incentive | Phase 6: no affiliate/commission v1; category skepticism |
| Public pressure ("tag us or share") | Astroturf risk; damages M5 |
| Referral tied to price discount on future puppy | Price-forward; not D2 |
| Fake or coached testimonials | SD5 / Tier 3 violation |

### Referrer thank-you (qualified lead only)

When inquiry form cites referring owner (S-09) **and** lead passes qualification:

- Personal thank-you from operator **[Operator to set]**
- No public announcement unless owner opts in
- Strengthens alumni relationship for passive future referrals

---

## 7. Long-term relationship

### Alumni network (lightweight v1)

**Purpose:** Maintain trust-aligned relationship for life-of-dog support, repeat-fit evaluation, and organic referrals — **not** a promotional email list.

| Element | v1 posture | Operator gate |
|---------|------------|---------------|
| **Alumni roster** | Internal list of placed homes **[Operator to set]** | Privacy: no sharing without consent |
| **Annual check-in** | Optional T5 touchpoint (§3) | Opt-out honored immediately |
| **Life updates** | Welcome photos/milestones; store with permission | Testimonial gate (§6) |
| **Site alumni page** | Defer — PRD C-03 Could have | Verified testimonials only |
| **Events** | Defer until Q2 geography + capacity | Local meetups optional Tier 2+ |

### Repeat buyer consideration

| Principle | Practice |
|-----------|----------|
| **Mutual re-qualification** | Repeat buyers re-enter inquiry/waitlist process — no automatic reservation |
| **No FOMO for "next litter"** | Inform interested alumni when program has capacity — calm notice, not countdown |
| **Fit over loyalty** | Prior placement success does not bypass screening if household or goals changed |
| **Timeline honesty** | Same waitlist norms as Phase 4 (6–12+ months category Fact) — **Blacksage wait unknown until Q1** |

**Sample language:** "If you're considering another Blacksage dog in the future, we'd welcome a fresh inquiry when the time is right — we'll review fit the same way we did the first time."

### Trainer coordination

| Scenario | CS action |
|----------|-----------|
| Buyer named trainer on application | Intro email loop: operator ↔ trainer ↔ buyer **[Operator to set]** |
| Buyer needs trainer referral post-go-home | Recommend Rottweiler-experienced trainers from operator network only — **no guard-dog specialists** |
| Trainer reports concern | Treat as Path B escalation; collaborate on plan |
| Trainer praise | Satisfaction signal (§3); potential referral co-source (Phase 6 borrowed channel) |

**Co-marketing boundary:** CS may thank trainers privately; public co-marketing follows Phase 6 PR tier gates (Tier 2 proof before endorsement asks).

---

## 8. CS metrics (quality > volume)

Align to Phase 6 measurement posture — no invented targets.

| ID | Metric | Definition | Target posture |
|----|--------|------------|----------------|
| **CS-M1** | Go-home doc completeness | 100% of placements receive §4 bundle before release | **[Operator to set target]** |
| **CS-M2** | Touchpoint completion | Scheduled T0–T4 executed per operator cadence | Track % complete, not speed |
| **CS-M3** | Early escalation resolution | Health/temperament issues documented and routed | Zero dropped threads |
| **CS-M4** | Referral-sourced inquiries (post-placement ask) | Form field attribution | Quality > volume (M4) |
| **CS-M5** | Owner satisfaction pulse | Informal positive signal at T3/T4 | Baseline TBD post-first litter |
| **CS-M6** | Reputation incidents from CS | Public complaints, astroturf, policy disputes | **0** (align PR-M3) |

**Not success:** Touchpoint count alone · referral ask rate · upsell to next litter · response-time vanity without quality.

---

## 9. Voice and messaging locks (CS-specific)

| Use | Avoid |
|-----|-------|
| "How is [puppy] settling in?" | "Don't miss our next litter" |
| "Per your placement agreement…" | "Guaranteed healthy for life" |
| "Your vet is the best first call" | "You must use our vet" |
| "Share our site if you know a serious researcher" | "Refer a friend for a reward" |
| Even-tempered, biddable, devoted (ADRK bounds) | Guard dog, protection, weapon |
| "We're here for the life of the dog" | "Sale complete — good luck" |

---

## 10. Operator gates affecting CS playbook

| Gate | CS impact | Default if unanswered |
|------|-----------|----------------------|
| **OP-P6** | Contract, guarantee, return/rehoming text | "Per operator contract" in all scripts |
| **Q7** | CS contact routing, response owner | **[Operator to set]** |
| **Q1** | Whether repeat-buyer / alumni volume exists | CS templates still valid; touchpoints scale to zero until first placement |
| **Q2** | Local trainer/vet coordination | National/category resources only |
| **Health inventory** | Parent clearance docs in buyer bundle | Category summary only; link to site when Tier 2 live |

---

## Fact / inference / assumption labels

| Statement | Kind |
|-----------|------|
| CS begins at Package C placement, not inquiry | Decision (Phase 7 scope) |
| Referral ask post-placement only; no commission v1 | Fact (Phase 6 GTM) |
| Health doc categories at go-home are category-standard | Inference |
| Touchpoint intervals, SLAs, CRM tooling | **Operator to set** — not invented |
| Return/guarantee/rehoming terms | **Per operator contract** — OP-P6 |
| First vet visit within first week is category norm | Inference — timing **[Operator to set]** |
| Alumni network is lightweight v1 | Decision (bootstrapped A7) |

---

## Sources (merged)

- `06-gtm-plan.md` — §5 referral loop, reputation, CTA locks, measurement
- `05-prd.md` — Package C description, personas P1/P3, form S-09 referral field, C-03 testimonials Could
- `04-business-model.md` — Package C anatomy, placement deliverable, no FOMO scarcity
- `.agents/product-marketing.md` — Pillars 2–5, voice bounds, anti-persona, Tier 2/3 claim discipline
