---
venture: telltail
org: Velocity Agency
phase: "8"
title: Operations and legal
owner: coo
status: ready_for_csuite — phase not complete
date: 2026-08-21
llm_tier: frontier-reasoning
llm_model: grok-4.5
generation_profile: none
generation_used: none
fallback_applied: false
ics_merged: [ops-manager, legal-counsel]
production_status: skipped
skip_reason: Phase 8 is Layer A ops+risk checklist. Explore. No store. Nobody is building. 4B closed.
---

# 08 — Operations & legal — Telltail

> **⚠️ NOT LICENSED LEGAL ADVICE** — Internal checklist only. Contract terms, IAP/refund policies, privacy notices, and public-facing legal copy must be **reviewed by licensed counsel** before go-live. Placeholders `[Attorney to draft]` / `[Operator to set]` must not be filled with invented legal terms.

This seat is not a licensed attorney. Nothing here is an opinion, clearance, insurance quote, or a finding that we own `telltail.com`.

Label key: **[F]** fact / lock · **[I]** inference · **[A]** assumption / test · **[Attorney to draft]** licensed counsel · **[Operator to set]** unknown name, hour, or vendor

**Mode:** explore. Nobody is building. Nothing in the App Store. **4B closed.** Not Blacksage. Not Sieger. Local disk only. Phase 8B / hiring **not opened** this pass.

**Product this file operates:** a **consumer iOS IAP app**. Not an inquiry desk, not a kennel, not a B2B onboarding motion. When we operate (no go-live date this pass), day-to-day work is reads + quota, the hard-stop queue, kids-in-frame refuse, IAP/restore, model-vendor health, and a small support queue. **[F]**

**Holding line (do not rewrite):** *See the signal. Do the next right thing — and know when to stop.* **[F]**

Canonical disk: `/Users/cbsuperpatch/Desktop/ClaudeSkills/docs/projects/telltail/business-idea/` (local only, no OneDrive).

COO merge of `_leases/08-ops-runbook.md` + `_leases/08-legal-risk.md`. This is the phase artifact for C-suite review. It is **not** launch clearance. **Do not mark Phase 8 complete.**

---

## 1. Executive summary

COO merged both Phase 8 IC leases into this file — a real ops+legal artifact, not a pointer at the lease folder. Ops-manager delivered the consumer-IAP runbook: scope vs out, operating principles, RACI with names still `[Operator to set]`, daily/weekly/event checklists, support cadence that cross-refs `07-sales-playbook.md`, vendor placeholders, and a data-handling SOP that leaves retention durations to counsel. Legal-counsel delivered the R1–R12 scorecard, FTC/App Store/COPPA/PIPEDA/BIPA/CPRA/vet/cloud checklists, IAP flags as `[Attorney to draft]`, privacy/PII controls, TM planning-accept note, ToS/not-a-vet flags, and the L1–L14 pre-launch attorney-review list. Scorecard below: ops checklist present, risk checklist present, both present. Explore only — **4B closed**; nobody is building; nothing in the App Store; **no 8B this pass** (orchestrator did not open Head of People). Merge-ready for CEO / C-suite review; not Phase 8 approval and not a public-brand / listing / paid green light.

| Slice | Present | Notes |
|-------|---------|-------|
| Ops checklist | **Yes** | D1–D7 / W1–W7 / event table, RACI, IAP support cadence, vendor placeholders, data SOP |
| Risk checklist | **Yes** | R1–R12, C1–C8, A1–A8, V1–V5, U1–U8, IAP `[Attorney to draft]`, L1–L14, banner |
| Both present | **Yes** | Layer A explore. 4B closed. **No 8B this pass.** Phase not complete. |

---

## 2. Ops + risk scorecard

Framework: severity (1–5) × likelihood (1–5) from `legal-risk-assessment`. Score 1–4 GREEN · 5–9 YELLOW · 10–15 ORANGE · 16–25 RED.

Scores are **planning ratings of the product as specified**, not counsel conclusions. Residual assumes the Phase 5 PRD locks actually ship. If a lock is skipped, use the unmitigated column. **Do not invent new scores.**

| ID | Risk | Category | Sev | Like | Score | Level | Status (planning) | Residual if locks ship | Owner |
|----|------|----------|-----|------|-------|-------|-------------------|------------------------|-------|
| R1 | UI or listing implies **relaxed / safe to approach / won’t bite** | Product liability / FTC | 5 | 3 | **15** | ORANGE | Open — kill-shot if shipped | YELLOW (4×2=8) if chip never exists and refuse-first holds | Product + counsel |
| R2 | **Kids-in-frame** clip uploaded to cloud vision with no refuse / no purpose-limit | COPPA / PIPEDA / BIPA / CPRA | 5 | 4 | **20** | RED | Open until refuse + no-template + short retain ship | ORANGE (5×2=10) — cloud collection still happens | Product + counsel |
| R3 | Every v1 read is a **cloud multimodal** call (video leaves the phone) | Privacy / Apple 5.1.2 / FTC deception | 4 | 5 | **20** | RED | Locked architecture **[F]** | ORANGE (4×3=12) with pre-clip disclose + purpose string + no on-device claim | Product + counsel |
| R4 | Output **diagnoses** or substitutes for a vet / DACVB | Vet-practice / FTC professional-sub | 4 | 3 | **12** | ORANGE | Open until escalate-only copy is locked in UI + ToS | YELLOW (4×2=8) | Product + counsel |
| R5 | **TELLTAIL** public brand vs live USPTO pet marks + Little Rock trainer + sunset `telltail.com` | Trademark / unfair competition | 4 | 3 | **12** | ORANGE | **Planning risk-accepted only.** Blocking for public mark use | Unchanged until counsel coexistence / risk-accept in writing | Founder + counsel |
| R6 | Translator / mind-reading / unlimited / on-device claims | FTC / App Store | 4 | 3 | **12** | ORANGE | Open for any public copy | YELLOW (4×2=8) if claims ladder holds on the same screen | CMO + counsel |
| R7 | IAP auto-renew / refund / credit-pack terms unpublished | Contract / consumer / store | 3 | 3 | **9** | YELLOW | Open — no terms drafted this pass | YELLOW until `[Attorney to draft]` ships | Counsel + operator |
| R8 | Support or chat **overrides a refuse** (“you’re fine”) | Product liability / claims | 4 | 3 | **12** | ORANGE | Open (SLA hours still `[Operator to set]`) | YELLOW if support never re-scores a hard stop | Ops + counsel |
| R9 | **A5 OPEN** — named celebrity / fake expert / scraped method catalog | Claims / publicity / TM | 3 | 2 | **6** | YELLOW | Open — stay unnamed | GREEN if no named voice ships | Founder + CMO |
| R10 | No product-liability + tech E&O bound before paid listing | Insurance / residual | 4 | 3 | **12** | ORANGE | Open founder item | Unchanged — **do not invent quotes** | Founder + counsel |
| R11 | Chat (US-21) mints a vision card from **text only** | Claims / deception | 4 | 3 | **12** | ORANGE | Locked “no clip → no card” **[F]** | YELLOW if lock holds | Product |
| R12 | Gate skipped at **0 remaining** / credits used to bypass safety | Safety / consumer | 5 | 2 | **10** | ORANGE | Locked “gate always runs” **[F]** | YELLOW if meter cannot skip | Product |

**Highest residual after product locks:** R2/R3 (cloud kids video) and R5 (public brand). Those stay counsel-gated. Explore planning may continue. Public claims, App Store listing, and paid launch stay blocked.

| Ops-readiness | Status this pass |
|---------------|------------------|
| Runbook | **Exists** — this file §§3–7 (D1–D7 / W1–W7 / events, RACI, IAP support, vendors, data SOP) |
| SLA / cover-window hours | **Unset** — `[Operator to set]` in `07-sales-playbook.md` Shared operator SLA. Do not invent hours. |
| Vendors | **Placeholders** — Flash-class vision, Apple IAP, crash tool, support desk. No signed contracts. |
| On-call / L1 name | **`[Operator to set]`** — solo default: founder holds A until a seat is named |
| Weekly RAG | Shape only. Overall status now **n/a — no build** |
| Insurance / counsel | Unbound / unengaged. Founder items. **No quotes invented.** |

---

## 3. Operations scope / principles / RACI

### 3.1 Scope vs out

| In (Phase 8 ops) | Out |
|------------------|-----|
| Daily / weekly / event checklists for **when** we operate | A go-live date, App Store listing, TestFlight, paid |
| RACI with role titles; names stay `[Operator to set]` | Hiring plan (Phase 8B), JD copy |
| Support cadence for an **IAP consumer app** | Inquiry form, “request pricing,” SDR list, kennel go-home, QBR |
| Vendor / tool **placeholders** (vision LLM, IAP, crash, support desk) | Signed contracts, named insurance quotes, counsel opinions |
| Ops-level data handling: clip leaves device, retention *clock exists*, no train-on-user-video default | ToS, privacy policy, COPPA/BIPA/PIPEDA legal text (legal slice in this file — flags, not drafted terms) |
| Hard-stop queue + kids-in-frame refuse handling as **ops events** | Product gate design, Flash-refuse eval (CTO later), K1 design |
| Cross-ref to `07-sales-playbook.md` Shared operator SLA | Sales scripts, talk tracks, Close/Retain copy |
| Weekly RAG flash on operating loops | Marking the phase complete; opening 8B |

**Inherited locks (do not reopen).** Training tool / AI dog trainer. Reward-based / no-dominance. A5 **OPEN** — unnamed; do not scrape a catalog. Video **leaves the phone** every v1 read (cloud multimodal); never claim on-device. Kids-in-frame: no identity template; clip not retained as a training asset. Escalate, don’t diagnose. Ban relaxed / safe / won’t bite. Not a vet. Chat (US-21) = scare-story context + attach media; no clip → no “I saw your dog” card. Working SKU **$12/mo / $99/yr**, 60 Flash-class cloud reads/mo then credits, Lite 3–5. Never $9.99. $12 is presentation. A+C is a **test**. K1 kills Plus. **Gate always runs at 0 remaining.** Brand collision risk-accepted for **planning only**. Do not buy `telltail.com`. Explore only. **4B closed.** SLA hours in the sales playbook stay `[Operator to set]` — do not invent them here. **[F]**

### 3.2 Operating principles

1. **Safety is not a support override.** A product refuse (bite-risk / kids-in-frame / medical / floor-fail) is the answer. Support never re-scores a hard-stopped clip as “actually fine,” never writes a goodwill card, and never skips the gate to save a credit. **[F]** US-04, Phase 0 COO
2. **Quota cannot weaken the gate.** At 0 remaining, the bite-risk path still runs. A refuse consumes the read unit when a model ran. No “free refuse that hides a skipped gate.” **[F]**
3. **One vision path.** Clip or stills in → one cloud multimodal call out. Chat is context. Text-only is not a substitute read. **[F]** US-21
4. **Support is IAP ops, not a sales desk.** Inbound is how-to, billing/restore, crashes, and safety *copy* (escalate). There is no inquiry form and no SDR clock. Hours: cross-ref `07-sales-playbook.md` Shared operator SLA — **[Operator to set]**. **[F]**
5. **Checkpoints, not extra gates.** Daily/weekly checks sit *beside* the owner loop. They do not insert a human approval in front of a read. Extra handoffs are waste. **[I]** process-optimization
6. **Claims hygiene is an ops job.** Banned strings (relaxed / safe / won’t bite / translator / unlimited / on-device / diagnose) are scanned on tickets, macros, crash notes, and later store replies — same ban as the card. Footer ToS does not un-say a chip. **[F]** US-06
7. **Explore posture.** This runbook is the shape for *when* a build exists. It is not a ship plan and invents no date. **[F]**

### 3.3 RACI

Names are unset. Fill `[Operator to set]` when a human exists. Solo-operator default: founder holds **A** on every row until a seat is named.

| Activity | Operator / founder | L1 support | Product | Eng / later CTO | Counsel |
|----------|--------------------|------------|---------|-----------------|---------|
| Daily reads / quota health | **A** / R | C | C | C | I |
| Hard-stop queue (bite-risk / medical) | **A** | R (copy + escalate; never re-score) | C | C | I |
| Kids-in-frame refuse + retention check | **A** | R (do not retain / do not coach closer) | C | R (detector + delete path) | C — legal slice |
| Support tickets (how-to / billing / crash) | **A** | **R** | C | C | I |
| IAP subscribe / restore / cancel path | **A** | **R** | C | C (StoreKit) | I |
| Model vendor health (Flash-class / Lite cheap) | **A** | I | C | **R** | I |
| Crash / ANR triage | **A** | C | C | **R** | I |
| Claims / banned-string scan | **A** | R (macros) | **R** (product copy) | C | C — legal slice |
| Weekly RAG flash | **A** / R | I | I | I | I |
| P1 incident (gate skipped, banned chip live, kids frames retained wrong) | **A** | R (intake) | **R** (product) | **R** (fix) | C |
| Data retention execution | **A** | I | C | **R** | C — legal slice |
| Vendor contract / DPA | **A** | I | I | C | **R** — legal slice |

Cover window / who is on-call: **[Operator to set]**. Do not invent hours. **[A]**

### 3.4 Process shape (when we operate)

There is no live process today (nobody is building). The waste to **not** import from kennel / inquiry-desk playbooks:

| Waste | Why it fails here | Future-state |
|-------|-------------------|--------------|
| Inquiry / “request pricing” queue | Published IAP. Inquiry form **N/A**. **[F]** | No form. No deposit. No AE SLA. |
| Human re-score after a refuse | Rework + liability. Support “you’re fine” un-says the gate. **[F]** | Product refuse stands. Human sends escalate copy only. |
| Second vision path in chat | Text-only “I saw your dog” is a fake read. **[F]** US-21 | Invite a clip. No card without media. |
| Duplicate SLA clocks | Sales playbook already owns one shared block. **[F]** | Ops **cross-refs**; does not publish a second clock or invent hours. |
| Kennel fulfillment / go-home / QBR | Wrong business. **[F]** | Out. |
| SDR follow-up on support tickets | Respond is support, not sales-dev. **[F]** | One clarifying reply + IAP path, or stop. |
| Skipping the gate at 0 remaining to “save a credit” | Quota must not weaken bite-risk. **[F]** | Gate always runs. Credits cannot buy a bypass. |

**Checkpoints (ops), not gates (product):** vendor ping, meter vs Apple, hard-stop queue empty?, kids-refuse retention check, crash spike, ticket age vs `[Operator to set]` cover window. None of these sit in front of the owner’s clip.

---

## 4. Runbooks

IAP app. Not an inquiry desk. Run on days we operate. Owner of the lists: Operator / founder until **[Operator to set]**. No invented clock.

**Load-bearing ops controls (do not drop):**

- **Gate always runs at 0 remaining.** Quota cannot skip bite-risk / kids / medical / floor. A refuse consumes the unit when a model ran. **[F]**
- **Support never re-scores a hard stop.** Escalate copy only. Never “you’re fine” / “relaxed / safe / won’t bite.” **[F]**
- **Kids-in-frame is yes/no only.** No identity template. Clip is not a training asset. **[F]**

### 4.1 Daily checklist

| # | Check | Pass | Fail → |
|---|--------|------|--------|
| D1 | **Reads / quota.** Plus meter (60 Flash + credits) and Lite 3–5 match the SKU. Zero-remaining still runs the gate. Refuses that invoked a model consumed a unit. | Meter honest; no “unlimited” surface | P2 if meter wrong; P1 if gate skipped to save a credit |
| D2 | **Hard-stop queue.** Bite-risk / medical refuses from the last waking block. Owner-facing copy = stop / space / vet or DACVB / CAAB / credentialed trainer. No diagnosis. | Queue reviewed; escalate copy sent where a human is in-thread | Do **not** clear with “relaxed / safe / won’t bite.” Do not re-score. |
| D3 | **Kids-in-frame refuse.** Child-present = yes/no only. No face template. Clip **not** retained as a scorable training asset. | Detector fired; delete/no-train path held | **P1.** Stop coaching. Flag counsel. |
| D4 | **Support tickets.** Triage only: how-to film/upload, why-refuse, restore purchase, Plus/credits explain, crash. Invite a clip when a card is the job. | Tagged P1–P4 per sales playbook; no second SLA | Never mint a vision card from text. Never nurture an anti-persona. |
| D5 | **IAP / restore.** Subscribe $12 / $99, restore, cancel stay on Apple’s rails. Point failed payments to Settings → Subscriptions. | Restore works; cancel is easy | Do not invent Stripe dunning while IAP is the rail. Never $9.99. |
| D6 | **Model vendor.** Flash-class path (Plus) and cheap-model path (Lite) both up. First retry stays Flash-class. Transient timeout ≠ K1. | Vendor green or known incident | Page eng. Do **not** silently cascade to frontier as the happy path. |
| D7 | **Banned-string glance** on yesterday’s macros / ticket replies / crash notes. | No relaxed / safe / won’t bite / translator / unlimited / on-device / diagnose | Rewrite the reply. Treat a live banned chip in-product as **P1**. |

Chat tickets with no media: ask for a clip. Do not pretend we saw the dog. **[F]** US-21

### 4.2 Weekly checklist

| # | Check | Pass | Fail → |
|---|--------|------|--------|
| W1 | **RAG flash** (see [Weekly RAG flash](#43-weekly-rag-flash-when-we-operate)). Four loops only: reads/quota, hard-stop queue, kids-in-frame, IAP + vendor. | Status written; every AMBER/RED has an owner | Do not pad with invented budget, SPI, or subscriber counts. |
| W2 | **Crash / ANR.** New crash clusters vs last week. First-Lite-scare crash is a US-07 fail (treat as P1 if it paywalls or dies mid-loop). | Top crashes owned | Do not ship a mid-scare paywall as a “save.” |
| W3 | **Quota honesty sample.** Spot-check: refuse at 0 remaining still fired; Lite safety did not downgrade; credits did not skip the gate. | Sample clean | P1/P2 per sales-playbook severity. |
| W4 | **Kids + retention sample.** No child identity store. No train-on-user-video default. Kids-refuse clips not sitting in a “training set” bucket. | Sample clean | **P1** + counsel flag. |
| W5 | **IAP catalog.** Product + credits IAP names are Plus / Credits — never Unlimited AI or Translator Pro. List still **$12 / $99**. | Names + prices match | Never $9.99. Withdraw SKU if A+C or K1 fails — do not quietly retarget as a course. |
| W6 | **Vendor placeholders.** Vision LLM, IAP, crash, support desk still named as placeholders unless a real contract exists. No surprise frontier default. | Placeholders honest | Do not invent a signed DPA in this file. |
| W7 | **Claims / App Store replies** (only if a listing exists later — not this pass). Public replies claims-safe. | Clean | Kinship-class “translator” screenshot → L3 / legal flag. |

### 4.3 Event-triggered checklist

| Event | Immediate | Do not |
|-------|-----------|--------|
| **Gate skipped** or banned chip live (“relaxed / safe / won’t bite”) | P1. Freeze the surface. Stop sending owners through it. Product + eng. | Leave it up with a footer disclaimer. |
| **Kids frames retained wrong** / face template written | P1. Stop the retain path. Delete. Counsel. | Keep the clip “for training.” Identify the child. |
| **Hard-stop queue surge** (bite-risk / medical) | Work the queue with escalate copy. Human-review is an ops event, not a diagnosis. Hours remain `[Operator to set]`. | “You’re safe.” Re-score. Invent a same-day SLA number here. |
| **IAP / restore outage** | Status to owners: Settings → Subscriptions; restore path. | Stand up a card form, invoice, or off-store charge. |
| **Model vendor outage** | Pause new reads or fail closed (no card). Retry Flash-class only. | Frontier cascade as the happy path. Fake an on-device fallback. |
| **Suspected K1** (Flash cannot hold a refuse floor — eval, not one timeout) | Record. Plus is a **kill**, not a prompt bake-off. Credits have no home if Plus dies. | Paper it with HITL as a rescue SKU. Sell curriculum at $12. |
| **Paywall mid first Lite scare** | US-07 fail. P1 bug, not a save-offer. Finish card *or* refuse first. | Charge then show the card. |
| **Chat invents a vision card from text** | P2. Kill that path. Ask for a clip. | Leave the “I saw your dog” card up. |
| **A+C test withdrawn** | Withdraw the $12 paywall. Refund / cancel path `[Operator to set]` (Apple rails). | Quiet course swap. |
| **App Store review that asks for unlimited / translator** | Claims-safe public reply. Private: same triage tags. | Match volume. Translator subtitle language. |

### 4.4 Weekly RAG flash (when we operate)

One page. Same day each week **[Operator to set]**. Honesty over padding. Explore now: overall status is **n/a — no build**. When a loop exists, use:

**Overall:** GREEN / AMBER / RED on the four loops, not on a fake budget.

| Loop | GREEN | AMBER | RED |
|------|-------|-------|-----|
| Reads / quota | Meter matches 60 + credits; gate runs at 0 | Meter drift, credits UX unclear | Gate skipped to save a credit; “unlimited” shipped |
| Hard-stop queue | Escalate copy only; no re-score | Queue aging past `[Operator to set]` cover | Human cleared a refuse as “fine”; banned chip |
| Kids-in-frame | Yes/no only; no retain-as-train; no template | Detector miss rate unknown (expected until CTO eval) | Frames retained as training; identity store |
| IAP + vendor | Restore/cancel work; Flash-class up | Vendor blip; restore tickets up | IAP down; silent frontier default; $9.99 listed |

**Escalate immediately (ops):** overall RED; gate skipped; kids frames retained wrong; three+ P1s open; K1 eval fail; A+C withdraw. Do not invent a 10% budget rule — there is no operating budget in this explore pass.

Budget / SPI / FTE utilization: **out** until there is spend to report. Do not fabricate.

---

## 5. Support cadence

**IAP app, not inbound sales.** **Canonical clock:** `07-sales-playbook.md` → **Shared operator SLA (Respond + Retain)**. Ops does not keep a second clock and does **not** fill hours. **[F]**

| What ops runs | What ops does not run |
|---------------|------------------------|
| In-app chat as **support** (how-to, billing/restore, crash, safety copy) | Inquiry form / request-pricing / discovery call |
| Later: App Store review replies, email / social DM — same tags | SDR sequences, nurture, “just checking in” |
| L1 → L2 → eng/product/counsel **internal** briefs | Owner-facing “we re-watched and you’re fine” |
| Point IAP problems at Apple Settings → Subscriptions | Off-store payment, deposit, Stripe dunning (while IAP is the rail) |

**Severity (do not republish hours):** P1 = gate skipped, banned chip live, kids frames retained wrong, paywall mid first scare. P2 = meter wrong, refuse not consuming a read, chat inventing a vision card. P3 = how-to / why-60 / restore. P4 = feature ask (unlimited, course, named voice) → decline + FAQ. Hours: **[Operator to set]** in the playbook. Ticket-triage seeds (1h / 4h / 1bd / 2bd) stay seeds, not a promise. **[A]**

**L1 never:** overrides a safety refuse; mints a card from text; says relaxed / safe / won’t bite; names a public trainer (A5 OPEN); offers unlimited or a course-at-$12 save.

**Owner-facing escalate** (copy already in the playbook — do not duplicate scripts): vet / DACVB / CAAB / credentialed trainer. Reward-based / no-dominance. Not a diagnosis. Telltail does not replace them. **[F]** US-10

Internal brief shape (when L1 cannot close): severity, what the owner asked, whether a clip existed, whether the gate ran, impact, owner. Then stop. CS keeps the owner after a handoff; ops does not open a second thread.

---

## 6. Vendor placeholders

No contracts. No “we selected.” Fill when a build exists. **[A]**

| Need | Placeholder | Locked constraint | Not |
|------|-------------|-------------------|-----|
| **Vision LLM (Plus)** | Flash-class cloud multimodal. Phase 4 planning base = Gemini 2.5 Flash list price — **not a signed vendor**. | One call per clip. Video leaves the device. First retry = Flash-class. Frontier = cascade only, not an entitlement. | On-device keypoints. Custom detector. GPT-4o-mini `detail=high` as “cheap.” Gemini 3.7 Flash promo as v1. |
| **Vision LLM (Lite)** | Cheap-model (Flash-Lite-class in the unit-econ table). | Safety **does not downgrade.** Kids / bite-risk / floor still refuse. | Flash-class on Lite. Skipping the gate on the cheap path. |
| **IAP** | Apple In-App Purchase / StoreKit (iOS-first). | SKU **$12.00 / mo** and **$99 / yr**. Credits overflow seed $8–12 / 20 **[A]** — not a lock. Names: Plus / Credits. | $9.99. Unlimited. Translator Pro. Stripe as the v1 rail. |
| **Crash / ANR** | **[Operator to set]** crash tool (Sentry-class placeholder). | First-Lite-scare crash is a product fail, not a “retry the paywall.” | Inventing a vendor contract. |
| **Support desk** | **[Operator to set]** (in-app thread first; later App Store Connect replies + email). | Same SLA block as the playbook. Not a CRM inquiry desk. | Zendesk/Intercom as a lock. Salesforce. “Request pricing” page. |
| **Status / RAG** | Operator weekly flash (this file). | Four loops. No invented budget. | A PMO tool purchase this pass. |
| **Host / accounts** | **[Operator to set]** later (Phase 9). | Explore: nobody is building. | Shipping infra in this file. |

DPA, subprocessors, insurance, entity: legal slice below. Do not invent quotes or “counsel said.” **[F]**

---

## 7. Ops data-handling SOP

Ops executes. Counsel defines. Do **not** read this as a privacy policy. Retention **durations** are `[Attorney to draft]` (then `[Operator to set]` in ops). See §8.3 / §8.4.

### 7.1 Clip path (every v1 read)

```
Owner confirms send (US-11 disclosure: video leaves the phone)
        → clip / stills uploaded to our processors
        → gate (kids / bite-risk / medical / floor) BEFORE any state/action card
        → card OR refuse
        → meter: refuse consumes the unit when a model ran
```

Never claim on-device / “stays on your phone” / “never uploaded.” **[F]** US-11, CFO lock.

### 7.2 Retention (ops rules; durations are counsel)

| Object | Ops default | Legal flag |
|--------|-------------|------------|
| Ordinary clip after a card | Purpose = this read. Retention clock starts at **capture**, not at “someone opened history.” Duration **[Operator to set]** after counsel. | Counsel: retention schedule, CPRA/PIPEDA — `[Attorney to draft]` |
| Hard-stop clip | Persist for the **owner’s download** if product already specified that. Do not re-score. Do not use as a marketing still. | Counsel: how long we may keep a bite-risk clip — `[Attorney to draft]` |
| Kids-in-frame clip | **Not** retained as a scorable training asset. Purpose of any detector = child-present **yes/no** only. **No** identity / face template. | COPPA / PIPEDA under-13 / BIPA / CPRA biometric — counsel. Phase 0: on-device exception is **void** because the clip is transmitted. |
| Chat text without media | Context only. Does not mint a seen-dog record. | Counsel: chat log retention — `[Attorney to draft]` |
| Trainer-history share (US-16 / later) | Owner-initiated. Separate consent. No default share. Clock starts at capture. | Counsel: second processing purpose — `[Attorney to draft]` |
| Model training | **Default: do not train foundation models on user video.** Express opt-in only, if ever. | Counsel: training opt-in language. Do not draft it here. |

### 7.3 Support handling of media

- L1 does not download kids-in-frame clips onto a laptop “to take a look.”
- L1 does not attach a refused clip into a public App Store reply.
- Report / takedown path: **[Operator to set]** when a share surface exists (none in v1). Apple 1.2 if share/social appears later — legal + product.

### 7.4 Age-gate

Account age-gate (neutral 13+) is product. Ops does not age-gate the dog. **[A]** Phase 0


---

## 8. Legal / risk checklist

Jurisdiction assumption for v1: **EN US/CA**, iOS-first, no Quebec/FR this pass **[A]** (`HANDOFFS/0-manager-coo.md`). Label gaps. Do not treat a checkbox as clearance.

### 8.1 FTC claims (US)

| # | Control | Status | Note |
|---|---------|--------|------|
| C1 | Never ship **relaxed / safe / won’t bite** as a chip, card, listing, or support line | Required **[F]** | Material safety claim. Footer does not cure it. FTC Policy Statement on Deception (1983) + Advertising Substantiation (1984). |
| C2 | Never **translate / mind-read / “your dog is saying”** | Required **[F]** | No reasonable basis that a clip becomes language. Competitor pattern we do not copy. |
| C3 | Never claim to **diagnose, treat, or replace** a veterinarian, DACVB, or trainer | Required **[F]** | Operation AI Comply / DoNotPay analog: no AI exemption for professional-substitution claims. |
| C4 | Never claim **on-device / never leaves your phone** on v1 | Required **[F]** | Every read is cloud multimodal. An on-device privacy claim would be false. |
| C5 | Never claim **unlimited** reads or “ask as often as you want” | Required **[F]** | Working SKU is 60 Flash + credits at **$12/mo / $99/yr**. Never **$9.99**. |
| C6 | Allowed-if-qualified card only: *we see [signal]; likely [state] (confidence); try [1–3 next-60s]; stop if [X]* — qualifications **on the same screen** | Required **[F]** | “Not a diagnosis. Not a safety clearance. Does not replace a veterinarian or trainer.” |
| C7 | Outcome / “stops reactivity” / accuracy % / vs-vet ticker | Forbidden until trials | Needs competent and reliable scientific evidence *before* the ad. Do not invent a number. |
| C8 | A5 stays **OPEN** | Required | No public authority, no ghost trainer, no celebrity method name, do not scrape any named catalog. Reward-based / no-dominance only. |

Same-screen rule lives in `06-gtm-plan.md` § Claims discipline and `05-prd.md` US-06 / FR-6. Do not rewrite those scripts.

### 8.2 App Store / Apple review (later — no listing this pass)

| # | Control | Status | Note |
|---|---------|--------|------|
| A1 | Category **Lifestyle + Education**. Never Entertainment / Games / translator subtitle | Required **[F]** | Apple 2.3.7 — no unverifiable product claims in subtitle. |
| A2 | Declare **not** a regulated medical device. Stay out of Medical / “treatment information” age-rating flags | Required **[F]** | Apple 2026-03-26 Health & Fitness / Medical declaration. Telltail is not a medical device. |
| A3 | Apple **1.4.1 / 1.4.5** — accuracy + physical-harm scrutiny | Required | “Check with a veterinarian” analog. No safety light. |
| A4 | Apple **2.5.14** — camera consent + visible recording indicator | Required | Live capture path. |
| A5 | Apple **5.1.1 / 5.1.2 / 5.1.4** — purpose string + **explicit permission before sharing with third-party AI** | Required **[F]** | `NSCameraUsageDescription` must say the clip **may leave the device**. Separate 5.1.2 prompt before the cloud model call. |
| A6 | Apple **5.2.1** — do not use others’ marks in the app name | Required | Do not squat “Telltail Dog Training.” Do not present `telltail.com` as ours. |
| A7 | Apple **3.1.2** subscription disclosures | `[Attorney to draft]` | Auto-renew, length, price, cancel path. Do not invent store-legal text here. |
| A8 | Google Play (later) | Out of v1 iOS-first | Same claims + kids + cloud-upload rules if/when Android exists. `[Attorney to draft]` Play subscriptions. |

Explore only. Nothing in the App Store this phase.

### 8.3 COPPA / PIPEDA / BIPA / CPRA

| Regime | Why it attaches | v1 control (product lock) | Counsel item |
|--------|-----------------|---------------------------|--------------|
| **COPPA** (US, under 13) | A photo/video/audio file with a child’s image or voice **is** personal information. Home scare clips will capture kids. **CFO lock voids the on-device exception** — the clip is transmitted on every read. **[F]** | Age-gate the **account** (neutral 13+), not the dog. Kids-in-frame or kids-present chip → **auto-refuse**. No action card. Clip **not retained as a training asset**. | `[Attorney to draft]` actual-knowledge analysis, notice, VPC vs refuse-and-delete path, 2025 COPPA amendments check |
| **PIPEDA** (CA) | Under-13 generally cannot consent; child images treated as sensitive. EN-CA is in the v1 geo **[A]**. | Same refuse + parent/guardian posture. No Quebec/FR this pass — still a CA privacy file. | `[Attorney to draft]` OPC meaningful-consent + Law 25 / Quebec gap if we later add FR |
| **BIPA** (Illinois, 740 ILCS 14) | A scan of **face geometry** extracted from a photo can be a biometric identifier even if a raw photograph is excluded (`Sosa v. Onfido` cited in Phase 0). | Kids-in-frame detector purpose = **child-present yes/no only**. **No identity template. No face template stored.** Delete any intermediate embedding. Do not identify the child. | `[Attorney to draft]` BIPA purpose-limitation + retention + written policy if any geometry is computed, even transiently |
| **CPRA / Cal. Civ. Code §1798.140** | Imagery of the face is “biometric information” when used or intended to **establish identity**. | Same purpose-limit. No sale/share of clips. Service-provider terms with the model vendor. | `[Attorney to draft]` CPRA notice-at-collection, sensitive-PI limit, DSR timelines (10 bd ack / 45 d) |
| **GDPR / UK GDPR** | Not in v1 geo **[A]** | Do not claim EU readiness. | Flag if storefronts open EEA/UK |

**Practical refuse path [A]** (already in PRD US-04 / NFR-P1–P3): detect → refuse or blur humans → do not score → do not retain raw frames with a child as a scorable object → default **no** training on user video → account age-gate 13+.

### 8.4 Vet-practice line

| # | Rule | Source (Phase 0) | Product behavior |
|---|------|------------------|------------------|
| V1 | Do not diagnose or prescribe treatment for animal disease | CA B&P §4826; VA §54.1-3800 (state boards, not one federal license) **[F]** | Escalate, don’t diagnose |
| V2 | Only a DACVB may call themselves a veterinary behaviorist | ACVB **[F]** | Name the **role**, never impersonate it. A5 OPEN — no fake byline |
| V3 | Allowed hard-stop shape | Phase 0 UX **[A]** | “Stop. Do not approach. Create space. Contact a veterinarian. If aggression or a sudden change, ask for a DACVB or CAAB working with your vet. This is not a diagnosis and Telltail does not replace a veterinarian or a veterinary behaviorist.” |
| V4 | Forbidden | Phase 0 **[F]** | Naming a disease, naming a drug, “your dog has anxiety/pain,” “treat by doing X for 2 weeks,” “replaces your trainer/vet” |
| V5 | Gate inputs vs auto-refuse | PRD AC-04.1 **[F]** | Auto-refuse: kids-in-frame, snap/bite-risk, medical, confidence-floor fail. Freeze / whale-eye / stare are **signals**, not automatic refuse |

Support (sales playbook AR-0): a human **must not** clear a refuse with “you’re fine.” SLA hours stay `[Operator to set]`.

### 8.5 Cloud-upload (every v1 read)

| # | Control | Status |
|---|---------|--------|
| U1 | Disclose **before first clip** that video leaves the device | Required **[F]** US-11 |
| U2 | Purpose string + in-app notice match the stack (one cloud multimodal call; Plus = Flash-class; Lite = cheap-model) | Required **[F]** |
| U3 | Apple 5.1.2 separate permission before third-party AI | Required **[F]** |
| U4 | One vision call per read. Never a custom detector. Never “on-device vision” | Required **[F]** |
| U5 | DPA / processor terms with the cloud model vendor + any storage/CDN | `[Attorney to draft]` — locations, sub-processors, breach notify window, deletion on terminate, no-train-on-customer-data default |
| U6 | Retention clock starts at **capture**, not “trainer opened it” | Required **[A]** Phase 0 |
| U7 | Trainer-share is a **second purpose** — owner-initiated, separate consent, no implied endorsement, no re-score after hard stop | Required **[F]** |
| U8 | Default **no** foundation-model training on user video. Express opt-in only | Required **[F]** NFR-P3 |

### 8.6 IAP / subscription contract flags

B2C published IAP. No deposit. No inquiry form. No Stripe-in-chat. **Do not invent refund law.**

Working SKU **[F]:** Plus **$12/mo / $99/yr**, 60 Flash-class cloud reads/mo + credits. Lite 3–5 cheap-model reads. Envelope $9–13 / $79–99 is sensitivity, not a listed SKU. **Never $9.99.** A+C is a **test**. **K1 kills Plus** — withdraw the paywall; do not quietly sell curriculum at the same SKU.

| Topic | Flag | Draft status |
|-------|------|--------------|
| Store rail | iOS-first → Apple IAP. Google Play later. Do not invent a direct-card stack while IAP is the rail | `[Attorney to draft]` paid-apps / subscriptions schedule |
| Price presentation | $12.00 / $99; 60 included then credits; a read is a moment **or** a refuse; quota cannot skip the gate (including at 0 remaining) | Copy lock **[F]** — not legal terms |
| Auto-renew | Length, price, what renews, how to cancel | `[Attorney to draft]` + Apple 3.1.2 |
| Cancel | Easy. Settings → Subscriptions. No dark pattern, no guilt wall | Sales playbook **[F]**; legal text `[Attorney to draft]` |
| Restore | Restore purchases path when a listing exists | `[Attorney to draft]` |
| Refunds | Refuse-as-success is **not** a refund trigger by itself **[F]**. Policy text must not be invented | `[Attorney to draft]` / `[Operator to set]` — point at Apple’s refund process; do not write a fake statutory promise |
| Credit packs | Overflow after 60; seed $8–12 / 20 **[A]** — consumable vs subscription characterization | `[Attorney to draft]` |
| Pause | Unknown whether Apple pause exists for this SKU | `[Operator to set]` / `[Attorney to draft]` |
| Test / K1 fail | Withdraw Plus. Refund / cancel path | `[Attorney to draft]` / `[Operator to set]` |
| Failed payments | Apple-managed. Point to Settings → Subscriptions. No invented dunning | Playbook **[F]** |
| SLA / support hours | Shared Respond+Retain clock | **`[Operator to set]`** — do not invent a 2-hour AE SLA |
| Liability cap / indemnity / governing law / arbitration / class waiver | None exist | `[Attorney to draft]` — general commercial standards, not an org playbook |
| Processor / DPA | Cloud video + account PII | `[Attorney to draft]` |
| Kids / biometric | Cross-ref §8.3 | `[Attorney to draft]` |
| Insurance | Product liability + tech/professional E&O before paid launch. Homeowner policy will not cover this **[A]** Phase 0 | Founder item. **No quotes invented.** |

No B2B MSA. Trainer seat is out of v1.

### 8.7 Privacy / PII controls

Legal owns the *rules*; ops owns the runbook (§7).

| Control | Rule | PRD / NFR |
|---------|------|-----------|
| Cloud video | Clip **leaves the phone** on every v1 read. Never claim on-device | US-11, NFR-P1, BR-11 |
| Pre-clip notice | Same-screen disclosure + camera purpose string | US-11, Apple 5.1.2 |
| Kids-in-frame | Auto-refuse. No action card. No coach that puts a child closer | US-04, UC-2 |
| No identity / face template | Purpose = child-present yes/no only. Do not identify. Do not store a face embedding | US-04.4, NFR-P2 |
| No retain-as-training-asset | Raw frames with a child are not the default retained object | US-04.4, US-16.3 |
| No train-on-user-video default | Foundation-model training off unless express opt-in | NFR-P3 |
| Chat | Scare-story context + attach media. **No clip → no “I saw your dog” card.** Text-only is not a substitute read | US-21 |
| Account age-gate | Neutral 13+ **[A]** | Phase 0 |
| History | Trainer-history is a second purpose; separate consent; retention from capture | Phase 0 |
| DSR | Access / delete / correct once we have accounts | `[Attorney to draft]` CPRA/PIPEDA timelines |
| Breach | Vendor notify window must let us meet legal clocks | `[Attorney to draft]` |
| Support | Never re-score a hard-stopped clip as “actually fine.” Never collect a card number in-thread | Playbook |

### 8.8 Trademark collision note

**Planning risk-accepted. Name stays locked. Counsel before any public brand use.** This is not a rename ask and not a clearance.

Facts already in `HANDOFFS/0-manager-coo.md` **[F]** (do not reopen):

- USPTO standard-character **TELLTAIL**, owner TELLTAIL AND FRIENDS, LLC (Key Biscayne, FL): **Class 35 RN 7031825** (SN 90637046; dog-breed registries + pet-product consumer info; registered 2023-04-18) and **Class 45 RN 7495734** (SN 90637053; pet-adoption databases + pet social/breeding records; registered 2024-09-03).
- `telltail.com` is that brand’s **sunset puppy-matching** site. Do **not** buy it. Do **not** invent that we own it or inherited it.
- **Telltail Dog Training** (`telltaildogtraining.com`) — Elizabeth Silverstein, Little Rock, force-free. Same job, competence-coded. Highest *consumer* confusion risk.
- Telltale Games (LCG) is a misspell / SEO leak, not our job.
- `telltail.ai` is an unrelated live AI-eval product. `telltail.app` is Porkbun-parked. `gettelltail.com` appeared unregistered as of 2026-08-21 — not a purchase instruction.
- Class 9/41/42 TELL TAIL / TELL-TAIL software search and CIPO TELLTAIL word search were **incomplete** in Phase 0. Not “cleared.”

**Do:** keep the internal name; disambiguate in counsel-facing notes; pick a download URL that is not the sunset puppy site. **Do not:** squat their phrase, buy `telltail.com`, use their marks in the app name (Apple 5.2.1), or treat planning risk-accept as a public-brand green light.

`[Attorney to draft]` coexistence / risk-acceptance opinion + full clearance search (US + CA) before listing, paid, press, or a public site.

### 8.9 ToS / not-a-vet / not-a-safety-clearance copy flags

Public-facing legal copy is `[Attorney to draft]`. These are **flags**, not drafted terms.

| Flag | Must appear (same screen as the card / refuse, not only in ToS) | Must never appear |
|------|----------------------------------------------------------------|-------------------|
| Not a veterinarian | “Not a diagnosis. Does not replace a veterinarian or veterinary behaviorist.” | “Your dog has [condition].” “Treat with [X].” |
| Not a safety clearance | “Not a safety clearance.” Stop / create space / see a human | Relaxed · safe · won’t bite · green light · “you can approach” |
| Not a translator | “Observable signals + next 60 seconds — or we refuse.” | Bark-to-English, “what he’s saying,” talking-dog |
| Not on-device | “This clip leaves your phone for a cloud read.” | On-device · stays on your phone · never uploaded |
| Not unlimited | “60 included Flash reads / then credits.” | Unlimited · ask as often as you want · $9.99 cage |
| Method | Reward-based / no-dominance / no aversives | Named celebrity method; e-collar / prong / choke / leash-correction advice |
| Chat | No clip → we did not see the dog | “I saw your dog” from text |
| A5 | Unnamed | Any named trainer as authority; scraped method catalog |
| Brand | Telltail as *this* product | Telltail Dog Training (Little Rock); visit telltail.com; we own that domain |

ToS / EULA / Privacy Policy / in-app notices: `[Attorney to draft]`. Support AR-0 already carries the escalate line — do not rewrite sales scripts.

### 8.10 Pre-launch attorney-review list

Engage licensed US (+ CA) counsel before **public brand, App Store listing, or paid**. Explore planning does not need this signed. **Do not self-approve the phase.**

| # | Item | Why it blocks | Draft now? |
|---|------|---------------|------------|
| L1 | Privacy Policy + notice-at-collection (cloud video, kids-in-frame, account age) | COPPA/PIPEDA/CPRA; Apple 5.1.2 | `[Attorney to draft]` |
| L2 | ToS / EULA: not-a-vet, not-a-safety-clearance, no diagnosis, IAP pointer, acceptable use (no aversives ask) | Professional-sub + product-liability | `[Attorney to draft]` |
| L3 | Apple / Google subscription + refund + cancel + restore + credit-pack characterization | Consumer + store rules | `[Attorney to draft]` — no invented refund statute |
| L4 | Camera purpose strings + 5.1.2 third-party-AI permission copy | App Review reject + FTC deception if mismatched | `[Attorney to draft]` |
| L5 | DPA + no-train-on-customer-video default with cloud vision vendor (and storage) | Processor chain; breach clock | `[Attorney to draft]` |
| L6 | COPPA actual-knowledge + refuse-and-delete vs VPC memo | Cloud kids video | `[Attorney to draft]` |
| L7 | BIPA / CPRA biometric purpose-limitation (no face template) | Geometry-from-photo tripwire | `[Attorney to draft]` |
| L8 | TM coexistence / risk-acceptance (Class 45 RN 7495734, Class 35 RN 7031825, Little Rock trainer, sunset `telltail.com`) + complete Class 9/41/42 + CIPO search | Public brand | `[Attorney to draft]` — planning already risk-accepted |
| L9 | App Store listing / ASO / paywall hero vs claims ladder | FTC + Apple 2.3.7 / 1.4.1 | Counsel redline; CMO owns draft |
| L10 | Medical-device **No** declaration + category Lifestyle + Education | Apple 2026-03-26 | `[Attorney to draft]` confirm |
| L11 | Entity, governing law, consumer venue | None chosen | `[Operator to set]` + `[Attorney to draft]` |
| L12 | Product-liability + tech / professional E&O bind | Residual if a chip is trusted | Founder. **No quotes invented.** |
| L13 | Support script vs refuse (never “you’re fine”) | Same representation theory as the chip | Counsel review of AR-0; hours stay `[Operator to set]` |
| L14 | Kids / UGC report + retention + deletion runbook | COPPA + App Store 1.2 if any share surface | Cross-ref ops; counsel on hold/delete |

**Outside-counsel trigger (pack):** novel AI + kids + biometric + professional-adjacent + TM coexistence. Strongly recommended before listing. Mandatory if a regulator, a bite claim, or a TM demand arrives.

---

## 9. Claims ladder

Preserve from legal / Phase 0. Same-screen qualifications. A ToS footer does not un-say a chip.

| Band | May / must not | Examples |
|------|----------------|----------|
| **Forbidden** | Never ship on a chip, card, listing, support line, or screenshot | **relaxed / safe / won’t bite** · green light · “you can approach” · translator / mind-read / “your dog is saying” / bark-to-English · diagnose / treat / replace a vet, DACVB, or trainer · **on-device** / stays on your phone / never uploaded · **unlimited** / ask as often as you want · **$9.99** · named celebrity method / scraped catalog · “your dog has [condition]” · e-collar / prong / choke / leash-correction advice · “I saw your dog” from text · we own / visit `telltail.com` · Telltail Dog Training (Little Rock) as us |
| **Risky / hold** | Forbidden until evidence or counsel | Outcome / “stops reactivity” / accuracy % / vs-vet ticker (C7 — needs trials). Public TELLTAIL brand use (R5 — planning-accept only). Insurance-unbound paid listing (R10). |
| **Allowed if qualified on the same screen** | Card shape only | *we see [signal]; likely [state] (confidence); try [1–3 next-60s]; stop if [X]*. “Not a diagnosis. Not a safety clearance. Does not replace a veterinarian or trainer.” “This clip leaves your phone for a cloud read.” “60 included Flash reads / then credits.” Reward-based / no-dominance. Escalate: vet / DACVB / CAAB / credentialed trainer. SKU **$12/mo / $99/yr**. |

Working SKU lock (copy, not legal terms) **[F]:** Plus **$12/mo / $99/yr**, 60 Flash-class cloud reads/mo + credits, Lite 3–5. Never $9.99. A+C is a test. K1 kills Plus.

---

## 10. Phase 8B / hiring

**Skipped this pass.** Orchestrator did not open Head of People / Phase 8B.

`skip_reason`: not opened.

No JDs. No hiring plan. No FTE model. RACI in §3.3 uses role titles only; names stay `[Operator to set]`. Solo-operator default: founder holds **A** until a seat is named. Do not treat this file as a staffing ask. Do not open 8B unless the orchestrator opens it.

---

## 11. Cross-refs

Do not duplicate sales scripts or restage story AC as ops SOPs.

| File | What to reuse | What not to copy |
|------|---------------|------------------|
| `05-prd.md` | US-04 / 11 / 21, quota-cannot-skip, kids-in-frame AC-04.4, inquiry N/A | Story AC restated as ops SOPs |
| `04-business-model.md` | $12 / $99, 60 + credits, Lite 3–5, Flash-class COGS as planning, IAP not inquiry | Unit-econ tables, invented subscribers |
| `06-gtm-plan.md` | No store / no paid this pass; IAP not request-pricing; claims discipline | Channel plans, CTAs |
| `07-sales-playbook.md` | Shared operator SLA, P1–P4 meanings, L1 never-list, AR-0 escalate | Close scripts, auto-reply macros, talk tracks |
| `HANDOFFS/0-manager-coo.md` | Cloud clip lock, kids-in-frame, escalate-not-diagnose, quota vs hard stop, TM facts | Legal opinions, insurance, TM clearance as “done” |

---

## 12. Operator decision register

**OPEN items only.** Do **not** re-ask locked: name (Telltail), **$12/mo / $99/yr**, 60 Flash, cloud upload (video leaves the phone), never $9.99, A5 unnamed / no celebrity catalog.

| Item | Status | Who |
|------|--------|-----|
| SLA / cover-window hours | **OPEN** — `[Operator to set]`. Canonical in `07-sales-playbook.md` Shared operator SLA. Do not invent here. | Operator |
| Counsel engagement | **OPEN** — L1–L14 before public brand / listing / paid. Explore planning does not need this signed. | Founder + licensed US (+ CA) counsel |
| Insurance bind | **OPEN** founder item. Product-liability + tech / professional E&O. **No quotes invented.** | Founder + counsel |
| Retention durations | **OPEN** — `[Attorney to draft]`, then `[Operator to set]` in ops. Clock starts at capture. | Counsel → operator |
| A5 trainer voice | **OPEN** — stay unnamed. Reward-based / no-dominance. Do not scrape a catalog. | Founder — not ops |

Not this register (already owned elsewhere; do not reopen as a Phase 8 ask): K1 / Flash-refuse eval (CTO later); A4 WTP (not copy); Lite grant in {3, 4, 5} (PRD range, `[Operator to set]` when a build exists); credit-pack exact dollar (CFO seed $8–12 / 20 **[A]**); go-live date (none — explore).

---

## 13. IC merge notes

| IC | Handoff | Verdict | llm_tier / model | generation_used |
|----|---------|---------|------------------|-----------------|
| `ops-manager` | `HANDOFFS/8-ops-manager.md` | **ready_to_merge** | fast-ops / composer-2.5 | none |
| `legal-counsel` | `HANDOFFS/8-legal-counsel.md` | **ready_to_merge** | frontier-reasoning / grok-4.5 | none |

Leases were **non-colliding**: ops wrote runbook / principles / RACI / checklists / IAP support / vendor placeholders / data SOP; legal wrote scorecard / compliance / IAP `[Attorney to draft]` / privacy / TM / ToS flags / L1–L14. COO merged both into this file. No paste-only “see lease” stub.

Ops asked legal for COPPA / retention / DPA / TM. All four are covered in the legal lease and in §8.3 / §7.2 / U5 / L5 / §8.8 / L8. No gap that required a rewrite.

**Conflicts requiring a rewrite:** none.

Seams that matched without invention:

- Both left SLA hours `[Operator to set]`. One cross-ref to `07-sales-playbook.md`. No second clock.
- Both kept gate-always-runs-at-0, support-never-re-scores, kids-in-frame yes/no only, clip-leaves-device, no train-on-user-video default, A5 unnamed, never $9.99, do not buy `telltail.com`.
- Gemini 2.5 Flash remains a Phase 4 planning base, not a signed vendor.
- `ready_to_merge` means the **leases were mergeable**, not that Phase 8 is approved.

A5 lock hygiene: legal lease named a public trainer as the banned example in C8 / ToS / do-not. Merge keeps C8 and the ToS A5 row as **unnamed / no celebrity method / do not scrape a catalog** and does not repeat that name.

---

## 14. Open items / do-not

**Open (explore):** SLA hours; counsel engagement on L1–L14; insurance bind; retention durations; A5 unnamed. R2 kids-in-frame remains RED until refuse + no-template + short retain ship (residual still ORANGE — cloud collection happens). R5 TM is planning-accept only. Public brand / listing / paid stay blocked on counsel.

**Do not**

- Mark Phase 8 complete
- Treat this file as launch clearance, App Store permission, or a public-brand green light
- Open Phase 8B / Head of People / write JDs (not opened this pass)
- Invent SLA hours, insurance quotes, counsel opinions, refund statutes, or a go-live date
- Buy `telltail.com` or claim we own it
- Fill `[Attorney to draft]` / `[Operator to set]`
- Reopen locked: name, $12 / $99, 60 Flash, cloud upload, never $9.99, A5 unnamed
- Claim on-device, unlimited, or “I saw your dog” from text
- Re-score a refuse; skip the gate at 0 remaining
- Train on user video by default; keep a child identity template; retain kids-in-frame as a training asset
- Name a public trainer or scrape a celebrity catalog
- Duplicate sales scripts
- Spawn more ICs from this merge
- Copy artifacts to OneDrive / iCloud / Google Drive

Explore. No store. No paid. Nobody is building. **4B closed.**
