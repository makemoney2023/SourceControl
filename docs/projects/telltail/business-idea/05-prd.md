---
venture: telltail
org: Velocity Agency
phase: "5"
title: PRD
owner: head-of-product
status: HoP-merged — Phase 5 not marked complete
date: 2026-08-21
llm_tier: strong-general
llm_model: composer-2.5
generation_profile: none
fallback_applied: false
production_status: skipped
skip_reason: Phase 5 is not shippable. 4B closed. Explore only. Nobody is building. Nothing in the App Store.
4B: closed
---

# 05 — PRD — Telltail

**Mode:** explore · **4B:** closed · Nobody is building · Nothing in the App Store

Label key: **[F]** fact/lock · **[I]** inference · **[A]** assumption

Canonical disk: `/Users/cbsuperpatch/Desktop/ClaudeSkills/docs/projects/telltail/business-idea/` (local only, no OneDrive).

HoP merge of PM (vision, goals, personas/UC, functional areas, stories, FR-1–FR-12, MoSCoW, staged launch, deps, tech stub, risks) + BA (AC, traceability, NFRs, operator register, business rules, FR vs NFR). Phase 5 is **not** marked complete.

**Merge resolutions (one wording each — do not reopen as dual text):**

1. **Lite model.** Lite = cheap-model (Phase 4 / PM). **[F]** Safety does not downgrade. Not Flash-class on Lite.
2. **US-08 / US-09.** Must *of the A+C test*. Withdrawn if the test or K1 fails. Plus is not an unconditional v1 lock.
3. **US-15.** Should with labeled AC gap (A5 OPEN). AC-15.1 holds: do not ship anonymous PetGPT / fake named expert.
4. **Quota.** Gate **always** runs (cannot skip to save a credit), including at 0 remaining. A refuse consumes the safety path / counts as the read unit when a model ran. No “free refuse that hides a skipped gate.”
5. **Latency.** Unknown. Do not invent a 2s SLA. “Next 60 seconds” is the advice horizon, not a latency target.
6. **Inquiry form.** N/A. Published IAP, not inquiry-first.
7. **Do not invent.** No TAM, interviews, WTP close, named voice, or Flash-refuse eval design.
8. **Chat (US-21, Must).** First-class conversation lane for owner context / the scare story. A refuse-first **vision card** still requires a clip or stills. Text-only is not a substitute vision read and not anonymous PetGPT. Do not flatten A+C into a chat-only coach. A5 stays OPEN — do not name a trainer.
9. **Child vs dog (US-04).** Kids-in-frame is a **model detect** on the one cloud vision call, not only an owner chip. Child in frame → refuse. Adult holding the phone / in the background is **not** refuse unless the child detector fires. Lite cheap-model must not downgrade this detect.

---

## Executive summary

Telltail is a **training tool** — an AI dog trainer for missed training moments. A phone clip becomes observable signals, a confidence, 1–3 next-60-second actions, and a hard stop when the honest next step is stop. It is not a toy, translator, or entertainment sticker. Position against Pupford / Zigzag / Pawfessor / Tailo. Never Traini. **[F]**

**Holding line (do not rewrite):** *See the signal. Do the next right thing — and know when to stop.* **[F]**

The form we sequence is **A gated by C** (moment coach behind refuse-first). That is a **test, not a strategy lock**. If the test fails, the Plus paywall is withdrawn; we do not sell form B (curriculum) at the same SKU. **[A]** `03-strategy.md`

This PRD specifies the Lite explore loop (Must US-01–US-07 + US-10–US-12 + **US-21 chat**) and the Plus *test* meter (US-08/US-09). Chat is the context lane; it does not replace the clip. Working SKU **$12/mo / $99/yr**, 60 Flash + credits. Envelope $9–13 / $79–99. Never $9.99. $12 is presentation, not WTP (A4 OPEN). **[F]** Phase 4.

Explore only. 4B closed. Nobody is building. Nothing in the App Store.

---

## Vision

A gated moment coach: clip → one cloud read → refuse-first → card *or* refuse → stop-rule. Competence, not a mood sticker.

- **Identity:** Training tool / AI dog trainer. Not a toy, translator, or entertainment. **[F]**
- **Job:** In *this* second, what do I do — and when do I stop — so I do not make the dog worse. **[A]**
- **Offer:** Signals + confidence + 1–3 next-60s actions + stop-rule. Refuse *before* any state/action card. **[F]**
- **Why 60:** A wrong trainer must not fire 200×/month (COGS + safety). Not “what serious apps do.” **[I]**
- **Unproven:** Film-live (A1); Flash-refuse (A3/E1); WTP for 60 vs unlimited Gemini peers (A4); named voice (A5).

---

## Goals / success

Explore signals inherited from Phase 3. Not a forecast. Do not invent TAM, CAC, or conversion.

| Signal | Good | Kill |
|--------|------|------|
| Flash refuse (later CTO eval) | Holds a confidence floor; false-“relaxed” on bite-risk does not ship | Cannot refuse → Plus is not a product (K1) |
| First Lite scare (US-07) | Clip (or immediate upload) → card *or* refuse → stop-rule. Loop finishes. | Tease that dies mid-moment |
| Plus meter (US-08/09) | 60 + refuse-cannot-skip understood as harm-per-wrong-fire | “Unlimited?” as the dominant reaction |
| Claims (US-06/10) | Zero translator / safe-to-approach / won’t-bite chips | Kinship-class press |
| Demand | Do not invent. Public vision-instruction ratings still ~0 except Traini | Treating Traini volume as our TAM |

---

## Personas

Strategy already named ICP. No new avatars. P0/P1 remain provisional until interviews exist (0 interviews). **[A]**

| Who | Role in v1 | Label | Use in this PRD |
|-----|------------|-------|-----------------|
| P0 first-week / first-time panic (US/CA, iOS) | Primary buyer | **[A]** | 11pm kitchen scare they will try to film *or* upload immediately (A1 OPEN) |
| P1 reactive / adolescent | Secondary wedge | **[A]** | Live episode is faster; phone often pocketed → US-14 after-action is the hedge, not the hero |
| P2 trainers | Channel, not buyer | **[A]** | US-16 history is the only v1 artifact they might be shown. No trainer seat (US-18) |
| Anti: translator shopper, unlimited-AI bargain hunter, bite-rehab self-serve, show/kennel | Do not attract | **[F]** | No stories serve them |

### Use cases

**UC-1 — First Lite scare (P0).** Actor just had a jump / mouth / freeze. Opens Telltail, chats what happened and/or captures or uploads, gets a card *or* a refuse (card only if media attached), and the loop finishes. **[A]** A1. Maps: US-01, US-03, US-05, US-07, US-21.

**UC-2 — Kids in the room (P0/P1).** The vision model detects a **child** (not a dog) in the clip. Gate refuses before any state/action card. Owner “kids present” chip is extra, not the only path. An adult holding the phone / in the background is not refuse unless the child detector fires. Escalate, don’t diagnose. Never “relaxed / safe / won’t bite.” **[F]** Maps: US-04, US-06, US-10.

**UC-3 — Plus month of moments (P0/P1).** Paid user at $12 / $99. Each scare costs one of 60 Flash-class cloud reads. At 0 remaining, bite-risk refuse still fires. **[F]** Maps: US-02, US-08, US-09, US-04.

**UC-4 — They missed the film (P1).** Live capture failed. After-action upload is offered (Should). If this becomes the common path, A+C is homework, closer to B. **[I]** E2. Maps: US-14.

**UC-5 — K1 fires (operator / explore).** Flash cannot hold a refuse floor. Plus is killed. Retry stays on Flash; frontier cascade is not the happy path. HITL (US-20) is an explore kill-path, not a rescue SKU. **[F]** Maps: US-12, US-20.

### Functional areas (derive — not new IA)

| Area | What it owns | US-IDs |
|------|----------------|--------|
| **A. Capture & media** | Live clip or upload; video leaves the phone; no on-device claim | US-01, US-11, US-14 |
| **B. Read** | Plus: exactly one Flash-class cloud multimodal call per clip. Lite: one cheap-model call. Never a custom detector | US-02, US-07, US-12 |
| **C. Refuse-first gate** | Gate runs *before* any state/action card. Bite-risk, kids-in-frame, low-confidence. Quota cannot skip | US-03, US-04 |
| **D. Moment card** | Signals + confidence + 1–3 next-60s actions + stop-rule. Reward-based / management only | US-05 |
| **E. Claims & escalate** | Banned language; escalate-don’t-diagnose | US-06, US-10, US-15 |
| **F. Lite explore** | 3–5 cheap-model reads; first read completes a real scare; gates always on | US-07 |
| **G. Plus / paywall / credits** | $12/mo / $99/yr; 60 Flash + credits; disclose 60 + refuse-cannot-skip + no unlimited | US-08, US-09, US-13 |
| **H. History** | Prior reads / moment log (Should) | US-16 |
| **I. Chat** | First-class conversation: scare story + context (kids / food / doorbell / visitor). Attach clip or stills **in thread** to unlock a vision card. Text-only ≠ “I saw your dog.” | US-21 |
| **Later / out** | Curriculum neighbor; trainer seat; Android; HITL kill-path | US-17, US-18, US-19, US-20 |

---

## Information architecture

Derived from Phase 3 strategy. Do not invent new IA this pass.

| Layer | Role |
|-------|------|
| **Hero CTA** | Film this moment / finish one real scare (Lite) |
| **Paywall CTA** | 60 honest reads + a hard stop — not unlimited |
| **Store** | Lifestyle + Education. Body language / training / behavior words. Never Entertainment / translator |
| **Paid** | Problem queries (“he froze at the door”), not “dog translator.” Do not buy Traini keywords |
| **Chat** | First-class lane: describe the scare in conversation; attach media in thread. Not a chat-only coach. |
| **Proof** | Named voice only when A5 locks; until then no anonymous PetGPT |

---

## Packaging

Two plans + overflow. Not Good-Better-Best. Trainer seat off the v1 grid.

| Package | Included | Not |
|---------|----------|-----|
| **Lite** | 3–5 cheap-model reads. Gates always on. First read must finish a real scare (refuse counts; mid-moment tease does not). | Flash-class on Lite. Frontier. Unlimited try. “Full AI.” |
| **Plus** | Working SKU **$12/mo / $99/yr**. 60 Flash-class cloud reads/mo + credits. Frontier cascade-only, not an entitlement. | Unlimited. Curriculum library. Human coach. Trainer seat. $9.99. |
| **Credits** | Seed overflow **$8–12 / 20 [A]** after 60. Extra Flash-class reads. Not a third plan. Not a hero column on first paywall. | Refuse bypass. GBB middle tier. |

$12 is presentation, not WTP. Envelope $9–13 / $79–99 remains as sensitivity. Never $9.99. **[F]**

---

## Staged launch

Not a calendar and not an App Store plan. Explore sequencing. **A+C is a TEST, not a lock.**

```
Stage 0  Lite explore
         US-01, 03, 04, 05, 06, 07, 10, 11, 21
         First scare completes (card or refuse)
         Chat = context + attach-in-thread (not a text-only card)
         Cheap model · gates always on
         No store · no Plus promise required
                │
                │ A1 (will they film / upload?) observed
                │ A3/E1 Flash-refuse eval = later CTO (stub only)
                ▼
Stage 1  Plus test  (withdraw if test or K1 fails)
         + US-02, 08, 09, 12
         $12 / $99 · 60 Flash + credits
         Paywall: 60 + refuse-cannot-skip + no unlimited
         Do not quietly sell US-17 at this SKU
                │
                ├─ A1 weak → pull US-14 forward (homework path; re-label form)
                ├─ A5 locks → US-15 may speak
                └─ K1 fires → kill Plus; US-20 is explore only; 4B stays closed
                ▼
Stage 2  Shoulds if the test holds
         US-13 merchandised (not hero)
         US-16 history
         US-14 as a supported path, not the pitch
                ▼
Later    US-17 neighbor · US-18 trainer seat · US-19 Android
         Never this pass: App Store, unlimited, detector, aversives, translator loop
```

**Capacity / dates:** unknown. Do not invent a quarter.

**Change rule:** If A+C fails, withdraw the Stage 1 paywall. Do not keep $12 and swap in curriculum.

---

## Failure-layer

If we restart from a named fail, these are the only moves (if restart):

| Fail | Move |
|------|------|
| **A+C test fail** | Withdraw the paywall. Do not sell form B at the same SKU. |
| **K1 Flash-refuse fail** | Kill Plus. Retry on Flash first. Do not invent a frontier cascade as the happy path. |
| **A1 film-live fail** | Pull US-14 forward. Re-label toward homework / form B. Live-first is no longer the pitch. |
| **A5 unnamed** | No public authority claims. Reward-based / management only. No ghost trainer. |

---

## Media rules

- Video **leaves the phone**. Never claim on-device analysis. **[F]**
- One cloud vision call per read: Plus = Flash-class; Lite = cheap-model. Never a custom detector. **[F]**
- Kids-in-frame: **model detect** (child vs dog) on the one cloud vision call — not only an owner chip. Child in frame → refuse. No vision card. No child identity / face template. Clip not kept as training data. Adult-in-background / phone-holder is **not** “any human = refuse.” Lite must not downgrade this detect. **[F]**
- Escalate, don’t diagnose. Ban “relaxed / safe / won’t bite.” **[F]**

---

## Inquiry form

N/A. Published IAP, not inquiry-first. Do not invent a form.

---

## User stories

Must + Should only. Actor / precondition / main / alt / post from PM, compressed. BA Given/When/Then AC nested under each US-ID. Could/Won’t live in MoSCoW only.

### Must

#### US-01 — Capture / upload a live scare clip

**As a** P0/P1 owner, **I want** to film or immediately upload a short clip of *this* scare, **so that** the read is about this dog, this second.

- **Actor:** P0/P1 owner, iOS, EN US/CA
- **Precondition:** App is open. A scare just happened or is happening. Explore — not in the App Store.
- **Main:** Start live capture *or* pick a just-shot clip → optional context chips *or* US-21 chat story (kids / food / doorbell / visitor) → confirm send.
- **Alt:** Live capture fails → offer US-14 (Should) and/or US-21 chat. **No clip or stills → no vision read / no “I saw your dog” card.** Text in chat is context, not a substitute read.
- **Post:** One media object queued for a single cloud read (US-02 / US-07). Owner has been told video will leave the phone (US-11).
- **Out:** Live home-camera, collar, multi-dog, cats.

**AC-01.1** Given the owner is signed in on iOS and has granted camera permission, When they start a capture for a live scare, Then the app records a clip (or stills) and shows a visible recording indicator (Apple 2.5.14).

**AC-01.2** Given camera permission is denied, When they try to capture, Then the app does not capture, explains why, and offers Photos upload (US-14) — it does not invent a clip.

**AC-01.3** Given a capture is in progress, When they cancel, Then no read is started and no quota is consumed.

**Gap:** A1 (will they film *during* the scare) is OPEN. AC tests the capability, not that owners will use it live.

#### US-02 — One Flash-class cloud multimodal read per clip

**As a** Plus owner, **I want** one honest cloud read per clip, **so that** I am not billed a cascade and we do not pretend the phone did the vision.

- **Actor:** Plus subscriber (or the Plus-path read)
- **Precondition:** A clip from US-01. Remaining Flash > 0 *or* a credit will be used — except refuse (US-04) which still runs at 0.
- **Main:** Upload to cloud → exactly one Flash-class multimodal call → refuse (US-03/04) *or* card (US-05).
- **Alt:** Call fails → retry on Flash (US-12). Do not silently escalate to Opus/Sol as the happy path.
- **Post:** One read consumed (or a refuse recorded). No second model in the happy path.
- **Out:** Custom pose detector. On-device vision. “Unlimited scans.”

**AC-02.1** Given a valid clip is submitted, When a read starts, Then the product issues **exactly one** Flash-class cloud multimodal LLM call for that read (no custom detector; no classifier-then-LLM).

**AC-02.2** Given a read is in flight, When the owner taps again, Then a second parallel call is not opened for the same clip (idempotent / in-flight lock).

**AC-02.3** Given the result is a card **or** a refuse, When the call completes, Then that outcome counts as **one read** against Lite or Plus (refuse consumes the unit when a model ran).

#### US-03 — Refuse-first before any state / action card

**As an** owner, **I want** the app to decide whether it can speak *before* it shows me a state or an action, **so that** I never get a coaching card the model cannot stand behind.

- **Actor:** Any user on Lite or Plus
- **Precondition:** A read has returned (or the gate can decide from the clip + context).
- **Main:** Gate evaluates confidence floor + banned situations. Cannot hold the floor → refuse screen, no state chip, no actions. Can → then and only then US-05.
- **Alt:** Owner at 0 quota — gate still runs (US-04). Lite cheap-model — gate still runs (safety does not downgrade).
- **Post:** User saw either a refuse or a card. Never a card that skipped the gate.
- **Out:** Soft “low confidence” badge on a full action card as a substitute for refuse.

**AC-03.1** Given a clip is submitted, When the safety / confidence gate has not yet passed, Then **no** state chip, emotion label, or action card is shown.

**AC-03.2** Given the gate refuses, When the UI renders, Then the owner sees the refuse / escalate path only — not a “here’s what we would have said” preview.

**AC-03.3** Given the gate passes, When the card renders, Then it appears only after the refuse-first step.

#### US-04 — Bite-risk / kids-in-frame / low-confidence refuse (quota cannot skip)

**As an** owner (especially with kids or a scary clip), **I want** a hard refuse I cannot buy my way around, **so that** a paid meter never becomes a safety bypass.

- **Actor:** Any user
- **Precondition:** Clip or context shows bite-risk cues, a **model-detected child** in frame (owner “kids present” chip is extra, not required), medical/pain-like events, or confidence below the floor. An adult holding the phone / in the background is not this precondition unless the child detector fires.
- **Main:** Refuse → escalate copy (US-10) → no state/action card. Meter does not waive the refuse at 0 remaining.
- **Alt:** Owner tries to “use a credit to get a card anyway” → blocked. Credits are not a refuse bypass.
- **Post:** No “relaxed / safe / won’t bite.” No diagnosis. Human next step named.
- **Out:** Scoring calmness-as-safety. Vs-vet %.

**AC-04.1** Given a clip is submitted, When the gate runs, Then **auto-refuse** (no action card) fires only for **kids-in-frame** (model-detected child, chip extra), **snap / bite-risk**, **medical**, or **confidence-floor fail**. Freeze / whale-eye / stare are **gate inputs** (signals the gate reads), not automatic refuse. If those cues alone auto-refused, Stage 0 would never card the job.

**AC-04.2** Given Plus remaining reads = 0 or the owner is on the last included read, When a bite-risk / kids / low-confidence case arrives, Then the refuse **still runs**. The quota **cannot** skip the gate to save a credit.

**AC-04.3** Given a refuse fires and a model ran, When quota is updated, Then the safety path consumed the read unit. No “free refuse that hides a skipped gate.”

**AC-04.4** Given kids-in-frame, When refuse fires, Then there is **no vision card**, the clip is **not** kept as training data, and no child identity / face template is stored (purpose = child-present yes/no only).

**AC-04.5** Given a clip is submitted, When the one cloud vision call runs (Plus = Flash-class; Lite = cheap-model), Then the model **must distinguish a child from a dog**. Kids-in-frame is this detect, not only an owner chip. Lite **must not** downgrade this detect. Safety does not downgrade. Still **one** cloud vision call per read — no second child-detector stack.

**AC-04.6** Given a dog-only clip with a human **adult** holding the phone or visible in the background, When the child detector does **not** fire, Then the product does **not** auto-refuse for “human present.” Do not invent an “any human = refuse” rule. Owner “kids present” chip may still refuse as an extra path.

**Eval note (CTO later):** accuracy of the bite-risk / kids / floor detector is US-12 / K1. These AC specify product behavior **when the gate fires**, not that Flash is proven safe.

#### US-05 — Card: signals + confidence + 1–3 next-60s actions + stop-rule

**As an** owner who passed the gate, **I want** what we see, how sure we are, 1–3 things to do in the next minute, and when to stop, **so that** I do the next right thing and do not make the dog worse.

- **Actor:** Owner after a pass on US-03
- **Precondition:** Gate passed. One read completed.
- **Main:** Card shows (1) observable signals, (2) confidence and what would change the read, (3) 1–3 reward-based / space-giving / management actions for ~60 seconds, (4) stop-rule / escalate line.
- **Alt:** If the honest next step is stop → card is the stop-rule, not three invented drills.
- **Post:** No cartoon quote. No 6-week plan. No aversive / dominance protocol.
- **Out:** Curriculum (US-17). Bite-rehab protocol.

**AC-05.1** Given refuse-first passed, When the card is shown, Then it contains: observable signals, a confidence indication, **1–3** next-60-second actions, and a stop-rule / escalate line.

**AC-05.2** Given the card is shown, When the owner inspects it, Then it does **not** contain a cartoon quote, “what the dog is thinking,” or a translator sticker as the core content.

**AC-05.3** Given more than 3 actions could be generated, When the card renders, Then at most 3 actions are shown.

#### US-06 — Banned claims

**As the** product (and as a P2 trainer watching), **I want** certain sentences to be impossible on the card, paywall, and listing, **so that** we do not inherit the Kinship tax.

- **Actor:** System + any surface that speaks
- **Precondition:** Any generated or static string about the dog or the offer.
- **Main:** Block and never ship: “relaxed / safe / won’t bite”; translator / “see what your dog is thinking”; diagnose / replace vet or trainer; unlimited; “what serious apps do.”
- **Alt:** Model emits a banned chip → strip and refuse or rewrite to signals + escalate. Footer disclaimers do not un-say a chip.
- **Post:** Holding line intact. Lifestyle + Education language only (when a store exists — not this pass).
- **Out:** Rewriting Phase 3 claims ladder.

**AC-06.1** Given any UI, paywall, store listing, or card, When copy is rendered, Then it does **not** include “relaxed,” “safe,” “won’t bite,” “translator,” or a veterinary diagnosis / disease name / drug.

**AC-06.2** Given a test string list of banned tokens (relaxed / safe to approach / won’t bite / translator / your dog has [condition]), When a release build is scanned, Then those strings are absent from user-visible surfaces (or only appear in this ban list / legal “we do not say”).

**AC-06.3** Given a footer disclaimer exists, When a state chip would have said “relaxed/safe,” Then the chip is still forbidden — a disclaimer does not cure it.

#### US-07 — Lite: 3–5 cheap-model reads; first read completes a real scare

**As a** new P0 owner, **I want** a few free cheap-model reads that actually finish one scare, **so that** I learn the stop-rule exists before anyone asks for $12.

- **Actor:** Unsigned or free Lite user
- **Precondition:** Explore build. Not a store listing.
- **Main:** First Lite read runs capture → gate → card-or-refuse to completion. Remaining Lite reads (up to 3–5 / period) use the cheap model. Gates stay on.
- **Alt:** First read refuses (US-04) — that *is* a completed scare. Crash / paywall / “upgrade to see the card” mid-loop — fail this story.
- **Post:** Owner saw a finished moment. No Frontier on Lite. No “full AI” tease. Not Flash-class on Lite.
- **Out:** Blending Lite COGS into Plus. Unlimited try.

**AC-07.1** Given a new Lite user, When they have used 0 reads, Then they can complete **one** full scare path: clip → refuse-first → card **or** refuse → stop-rule, without a paywall mid-moment.

**AC-07.2** Given Lite remaining reads in {3,4,5} as configured, When they exhaust them, Then further reads require Plus or wait — they do not silently get Flash-unlimited.

**AC-07.3** Given a Lite read hits bite-risk / kids / low-confidence, When the gate runs, Then Lite **refuses** the same as Plus. Safety does not downgrade on the cheap model.

**AC-07.4** Given the first Lite scare is in progress, When a paywall or “upgrade to see the answer” would interrupt, Then it does **not** fire until the scare path has completed.

#### US-08 — Plus: 60 Flash/mo + credits; $12/mo / $99/yr — Must *of the test*

**As a** paying owner, **I want** sixty Flash-class reads a month plus overflow credits at the working SKU, **so that** a wrong trainer cannot fire 200×/month.

- **Actor:** Plus subscriber
- **Precondition:** A+C test is still on. K1 has not fired. Working published SKU **$12.00 / mo** or **$99 / yr**. Envelope $9–13 / $79–99 remains; never $9.99.
- **Main:** Subscribe at $12 or $99 → 60 Flash-class cloud reads / month → after 60, credits (US-13) may buy more Flash reads. Frontier is cascade-only, not an entitlement.
- **Alt:** A+C test fails or K1 fires → this SKU is withdrawn (US-12). Do not silently retarget the same price at curriculum.
- **Post:** $12 is presentation, not WTP (A4 OPEN). No unlimited Plus. No trainer seat on this grid.
- **Out:** Inventing conversion, ARR, or that owners will pay 60 vs Tailo/Aplexity unlimited.

**AC-08.1** Given Plus is purchased, When the store / paywall shows the SKU, Then the listed prices are **$12.00/mo** and **$99/yr** — never **$9.99**.

**AC-08.2** Given an active Plus month, When included reads are counted, Then the grant is **60** Flash-class cloud reads (not 40). Credits apply after 60.

**AC-08.3** Given the A+C test is withdrawn, When product is told to withdraw Plus, Then Plus is not sold as curriculum (form B) at the same SKU.

**AC-08.4** Given envelope prices $9 / $11 / $13 / $79 exist as sensitivities, When the *published* v1 SKU is asserted, Then working published SKU remains $12 / $99 until CFO/CEO change it.

#### US-09 — Paywall disclose: 60 + refuse-cannot-skip + no unlimited — Must *of the test*

**As a** shopper, **I want** the paywall to say what I am buying before I pay, **so that** 60 is not a surprise and refuse is not a “gotcha.”

- **Actor:** Lite user hitting the Plus wall
- **Precondition:** They finished (or attempted) a Lite scare, or they opened paywall from settings.
- **Main:** Paywall states: 60 Flash reads / mo + credits; a read is one moment *or* a refuse; quota cannot skip bite-risk refuse; not unlimited. Hero is harm-per-wrong-fire, not a scan fight with Tailo / Aplexity.
- **Alt:** Annual $99 shown as the same meter, not “unlimited for a year.”
- **Post:** No “what serious apps do.” No Unlimited / Translator Pro IAP names.
- **Out:** Store screenshots this pass (App Store = Won’t).

**AC-09.1** Given the paywall and (later) the App Store listing, When the owner reads what’s included, Then all three are explicit: **60 included Flash reads / then credits**; a read is a moment **or** a refuse; quota **cannot skip** bite-risk refuse.

**AC-09.2** Given paywall / listing / IAP name, When copy is rendered, Then it does **not** say unlimited, “what serious apps do,” Unlimited, or Translator Pro.

**AC-09.3** Given paywall hero, When shown, Then it leads harm-per-wrong-fire (holding: “Sixty honest reads. A hard stop when the next right thing is to stop.” / “See the signal. Do the next right thing — and know when to stop.”) not “unlimited?”

#### US-10 — Escalate, don’t diagnose (vet / trainer)

**As an** owner on a scary clip, **I want** a human next step, **so that** the app does not play vet or behaviorist.

- **Actor:** Owner on a refuse or on a card whose stop-rule is escalate
- **Precondition:** Bite-risk, pain-like, seizure-like, injury, or “we cannot hold this.”
- **Main:** Name the escalate: space now; licensed vet / veterinary behaviorist / credentialed trainer. No in-app protocol for bite history.
- **Alt:** Owner asks “is he aggressive / in pain / safe for my kid?” → refuse the diagnosis, keep the escalate.
- **Post:** No medical claim. No “replaces your trainer.”
- **Out:** Trainer marketplace, booking, US-18.

**AC-10.1** Given a medical-looking or bite-risk refuse, When the escalate screen shows, Then it tells the owner to stop / create space and contact a veterinarian (and DACVB / certified professional as appropriate) — and states Telltail is not a diagnosis and does not replace a vet or trainer.

**AC-10.2** Given that screen, When inspected, Then it does not name a disease, name a drug, or say “your dog has anxiety/pain.”

#### US-11 — Media: video leaves the phone; never claim on-device

**As an** owner sending a home clip (often with kids), **I want** to be told the video leaves the phone, **so that** we never market an on-device lie.

- **Actor:** Anyone about to send media
- **Precondition:** Before first upload and on the send confirm.
- **Main:** Clear disclosure: cloud read; video leaves the device. No “on-device AI” / “stays on your phone” claim.
- **Alt:** Owner declines send → no read, no silent upload.
- **Post:** Copy matches the stack lock. Privacy/COPPA detail is COO/Legal, not this PRD.
- **Out:** Designing the retention policy or the model vendor.

**AC-11.1** Given camera / upload permission, When the purpose string and in-app notice are shown, Then they state the clip **leaves the device** for a cloud vision model.

**AC-11.2** Given any marketing, store, or in-app claim, When searched, Then there is **no** “on-device,” “on your phone only,” or “never uploaded” claim for the read path.

**AC-11.3** Given a third-party model call, When the read runs, Then it is the locked stack: one cloud multimodal call (Plus = Flash-class; Lite = cheap-model). Not Como-style on-device keypoints.

#### US-12 — K1: Flash-refuse fail kills Plus; retry Flash; no frontier cascade as happy path

**As the** explore operator, **I want** a named kill and a retry rule, **so that** we do not prompt our way into a $5–6/read Plus.

- **Actor:** Product / later CTO (not a consumer-facing “feature”)
- **Precondition:** Flash cannot hold a refuse floor, or a read errors.
- **Main:** First retry on Flash only. If the *eval* says Flash cannot refuse → kill Plus (working $12 and the $9 envelope language). Do not invent a frontier cascade as the happy path. HITL (US-20) is an explore path, not a rescue SKU.
- **Alt:** Transient API fail ≠ K1. K1 is “cannot hold the floor,” not “one timeout.”
- **Post:** Credits have no home if Plus dies. 4B stays closed. No raise.
- **Out:** Designing the eval (see Technical constraints).

**AC-12.1** Given a retry is needed, When the first retry runs, Then it is **Flash-class** — not Opus/Sol as the happy path.

**AC-12.2** Given product configuration, When a reviewer inspects the default path, Then frontier is **cascade-only / not an entitlement**, not 60× frontier.

**AC-12.3** Given the Flash-refuse **eval** (CTO later) concludes Flash cannot hold a confidence floor, When that result is recorded, Then Plus is **killed** (K1) — not patched with a prompt bake-off, not rescued by 60× frontier.

**AC-12.4 (eval must eventually satisfy — not run here)** The Flash-refuse eval must show that a false-confident “proceed / relaxed-equivalent” does **not** ship on bite-risk cues. Until the eval exists, US-03/US-04 behavior is specified; **safety of the detector is a gap**.


#### US-21 — Chat as context + attach media in thread

**As a** P0/P1 owner, **I want** to describe what just happened in conversation and attach a clip or stills in the same thread, **so that** I can give context without pretending the model saw a dog I never sent.

- **Actor:** P0/P1 owner, iOS
- **Precondition:** App is open. A scare just happened, is happening, or just ended. A5 OPEN — no named trainer.
- **Main:** Owner chats the scare story (what happened, kids, food, doorbell, visitor, etc.). Optional context chips still work. To unlock a refuse-first **vision card**, they attach a clip or stills **in the thread**. Same gate + card-or-refuse path as US-01/US-03/US-05.
- **Alt:** Text-only, no media → no vision card; no “I saw your dog”; no seen-dog diagnosis from a paragraph. Chat may ask for a clip, honor refuse-first / banned claims / escalate-don’t-diagnose / reward-based / no-dominance / kids-in-frame / K1. It must not become anonymous PetGPT or a chat-only coach.
- **Post:** Context is on the thread. A card exists only if media was attached and the gate ran. Quota: a vision read consumes a unit; text-only context does not invent a seen-dog read.
- **Out:** Flattening A+C into a text-only trainer. Naming a voice (A5). Cesar Millan or any other named method.

**AC-21.1** Given the owner is in the app, When they open chat, Then they can describe the issue in conversation (what happened, kids, food, doorbell, visitor, etc.) without being forced through a form essay.

**AC-21.2** Given a thread has **no** clip or stills, When the owner asks what the dog is doing / feeling / will do, Then the product does **not** render a refuse-first vision card and does **not** claim it saw the dog. It may ask them to attach media.

**AC-21.3** Given the owner attaches a clip or stills **in the thread**, When they submit that media, Then the same refuse-first → card-or-refuse path as US-01–US-06 runs (one cloud call; gate in front of the card; banned claims; kids-in-frame / snap-bite-risk / medical / floor-fail auto-refuse).

**AC-21.4** Given chat copy is rendered (with or without media), When inspected, Then it honors refuse-first, banned claims (no “relaxed / safe / won’t bite,” no translator, no diagnose), escalate-don’t-diagnose, reward-based / no-dominance / no aversives, kids-in-frame, and K1. It does not ship anonymous PetGPT or a named trainer (A5 OPEN).

**AC-21.5** Given text-only input, When a “read” would be invented from the paragraph, Then it is blocked. Chat is not a substitute vision read and is not a chat-only coach.

### Should

#### US-13 — Credit overflow $8–12 / 20 (seed, not lock)

**As a** Plus owner who used 60 in a hard week, **I want** a small overflow pack, **so that** I am not forced into unlimited and we do not sell a 200-read binge.

- **Actor:** Plus subscriber after 60
- **Precondition:** Plus still exists (K1 has not fired)
- **Main:** Offer overflow credits. Seed merchandising **$8–12 / 20 [A]** — not a lock, not a third plan, not a hero column on first paywall. Credits cannot skip refuse.
- **Alt:** Owner not on Plus → do not lead with credits.
- **Post:** Overflow is extra Flash-class reads. Not a refuse bypass.

**AC-13.1** Given Plus included 60 are exhausted, When credits are offered, Then they are overflow Flash-class reads — not a refuse bypass, not a third plan on the first paywall.

**AC-13.2** Given credits ship, When the pack is shown, Then the working seed is **$8–12 / 20 [A]** — exact dollar is **not locked**. AC checks *shape* (20 Flash reads, no gate skip), not a frozen price.

**Gap:** exact pack price is OPEN (CFO seed). Do not fail a build for $10 vs $8.

#### US-14 — After-action upload if live-film fails

**As an** owner who could not film the scare, **I want** to upload what I have right after, **so that** the loop still finishes — knowing this is the A1 hedge.

- **Actor:** P0/P1
- **Precondition:** Live capture failed, was refused by the owner, or the moment is already over
- **Main:** Prompt to upload the just-shot roll clip / stills. Same gate + card path.
- **Alt:** Nothing to upload → offer US-21 chat for the scare story and attach later. **Do not** fake a vision read or an “I saw your dog” card from text alone (that is ChatGPT / PetGPT, already a substitute).
- **Post:** If this path dominates, label it: A+C is sliding toward homework (closer to B). **[I]** E2
- **Note:** Should, not Must. Live-first remains the test.

**AC-14.1** Given camera capture fails, is denied, or the owner missed the live second (A1 risk), When they choose upload, Then they can submit a just-taken clip from Photos and receive the same refuse-first → card-or-refuse path.

**AC-14.2** Given an upload, When the read runs, Then US-02–US-06 still apply (one cloud call; refuse-first; banned claims).

**Gap:** A1 remains OPEN — upload is the fallback *capability*, not proof they will film live.

#### US-15 — Named training voice (OPEN — A5) — Should — **GAP**

**As a** P2 trainer (and as copy), **I want** a named method we will stand behind, **so that** we are not anonymous PetGPT.

- **Actor:** Founder (lock) / later claims surfaces
- **Precondition:** A5 is OPEN. Do not invent a name.
- **Main:** When founder locks a voice, card + listing may cite it. Until then: reward-based / management only, no fake credential.
- **Alt:** Do not ship public “our trainer says” without the lock.
- **Post:** Authority pillar stays empty rather than filled with a ghost. Not a Phase 5 blocker for explore stories.

**Gap-15:** No testable AC for a *named* voice until the founder names it. Inventing a school or person is forbidden.

**AC-15.1 (placeholder, blocked)** Given A5 is still OPEN, When public claims / store / cards render in explore, Then the product does **not** ship an anonymous “PetGPT” / fake named expert as if A5 were closed.

**AC-15.2 (blocked on A5)** Once a voice is named, AC will require that method library and on-card attribution match that voice and stay reward-based / no aversives. **Cannot write the name or school now.**

#### US-16 — History of prior reads / moment log

**As an** owner (and later a P2 trainer they show), **I want** a trail of prior reads, **so that** the next human sees what we already said.

- **Actor:** Owner who has completed ≥1 read
- **Precondition:** At least one card or refuse exists
- **Main:** List prior moments: date, signals or refuse reason, actions given. No “progress to relaxed.”
- **Alt:** First-time user — empty state, no fake history.
- **Post:** History is a log, not a curriculum streak toy.
- **Out:** Trainer seat sharing (US-18). Client homework portal.

**AC-16.1** Given the owner has completed reads, When they open history, Then they see prior moments (card or refuse) they can reopen.

**AC-16.2** Given history exists, When a trainer-share is considered, Then it is **off by default**, separate consent, not a v1 marketplace.

**AC-16.3** Given a kids-in-frame refuse, When history is shown, Then raw frames with a child are not the default retained object (align US-04.4).

---

## Traceability

| US-ID | Pri | Strategy lock / thesis | Persona | Business-model unit |
|-------|-----|------------------------|---------|---------------------|
| US-01 | Must | Missed training moments; A+C *test* needs a clip | P0/P1 | Trigger for **one read** |
| US-02 | Must | One multimodal LLM call / Flash-class cloud (Plus) | P0 | **One Plus read** = one Flash-class cloud call |
| US-03 | Must | Refuse-first *in front of* the card; A gated by C test | P0 | Read outcome may be refuse |
| US-04 | Must | Quota cannot skip bite-risk refuse; kids-in-frame | P0 + household | Refuse still consumes safety path when a model ran |
| US-05 | Must | Offer: signals + confidence + 1–3 actions + stop | P0 | Successful read → card |
| US-06 | Must | Never relaxed/safe/won’t bite; no translator; no diagnose | All | Claims / price surfaces |
| US-07 | Must | First Lite scare completes; Lite 3–5 **cheap-model** | P0 trial | **One Lite user / mo** |
| US-08 | Must *of the test* | Plus 60 Flash + credits; $12 / $99; never $9.99 | P0 paying | **One Plus month** |
| US-09 | Must *of the test* | Disclose 60 + no-skip + no unlimited | P0 shopper | Paywall / listing |
| US-10 | Must | Escalate-don’t-diagnose | P0/P1 | Refuse / medical path |
| US-11 | Must | Cloud vision; never on-device claim | All | Stack / privacy notice |
| US-12 | Must | **K1** Flash-refuse fail kills Plus; retry Flash first | Company | Named kill; no frontier happy path |
| US-21 | Must | First-class chat = context + attach-in-thread; no clip → no vision card | P0/P1 | Context lane; vision unit still requires media |
| US-13 | Should | Credits $8–12/20 seed | Plus overage | **One credit pack** |
| US-14 | Should | If A1 fails, after-action upload | P0 | Same **one read** unit |
| US-15 | Should | A5 named voice before public claims | Brand | **GAP** — not a SKU |
| US-16 | Should | Light history; trainer share later | P0 / P2 channel | Retention / consent |

---

## Operator decision register

Blocking only. Do not invent answers. Do not re-ask locked ids (name, stack, trainer-not-toy, 4B, $12 presentation, 60-read, never $9.99).

| ID | Decision | Status | Blocks | Owner |
|----|----------|--------|--------|-------|
| A1 | Will owners film during a live scare? | **OPEN** | Moment-coach vs after-action (US-01/14) | Founder + interviews |
| A3 / E1 | Can Flash refuse safely? | **OPEN** | K1 / Plus (US-12). Not a prompt bake-off | CTO later |
| A4 | WTP $12/60 vs Aplexity/Tailo unlimited | **OPEN** | Paywall copy cannot close it (US-08/09) | Explore evidence |
| A5 | Named training voice | **OPEN** | US-15 AC gap; public claims | Founder |
| A10 | Export Dogs Trust 80/24 to US copy? | **OPEN / no** | Competence marketing | CMO — do not export |
| U3 | Measured tokens / clip | **OPEN [A]** | COGS recipe, not AC for v1 behavior | CTO |
| SBP | Apple 15% vs 30% | **OPEN** | Unit $, not AC | Founder / ops |
| Credits $ | Exact $8–12/20 | **OPEN seed** | US-13 shape only | CFO |

Already locked — do not re-ask: Telltail name; 60 Flash; $12/$99 working SKU; never $9.99; quota cannot skip refuse; A+C is a *test*; Lite = cheap-model; first-class chat is context + attach-in-thread (not a text-only vision card); kids-in-frame is child-vs-dog model detect (chip extra; adult ≠ child); 4B closed; explore only.

---

## NFRs

| ID | Area | Requirement | Testable? |
|----|------|-------------|-----------|
| NFR-S1 | Safety | Refuse-first before any state/action card (US-03/04) | Yes — UI order |
| NFR-S2 | Safety | Banned tokens never ship (US-06) | Yes — string scan |
| NFR-S3 | Safety | K1: no Plus if Flash-refuse eval fails | Yes — release gate (eval not run this phase) |
| NFR-P1 | Privacy | Clip **leaves the phone**; purpose string says so (US-11) | Yes — copy + network |
| NFR-P2 | Privacy | Kids-in-frame: no identity template; clip not kept as training data (US-04/16) | Yes — storage rules |
| NFR-S4 | Safety | One cloud vision call must distinguish **child vs dog**. Chip is extra. Lite must not downgrade. Adult-in-frame ≠ refuse unless child detector fires | Yes — detect + negative adult case |
| NFR-P3 | Privacy | No training foundation models on user video without express opt-in | Yes — config / ToS |
| NFR-L1 | Latency | Time-to-card/refuse is **unknown** until CTO measures a real clip. Do **not** invent a 2s SLA. “Next 60 seconds” is the advice horizon, not a latency target. | Gap — measure later |
| NFR-C1 | Claims | Holding line + paywall hero as specified; no vs-vet %; no translator ASO | Yes — copy review |
| NFR-C2 | App Store | Category **Lifestyle + Education**. Never Entertainment / translator subtitle | Yes — ASC listing |
| NFR-C3 | Meter honesty | 60 + credits + refuse-cannot-skip + no unlimited on paywall and listing (US-09) | Yes — copy |
| NFR-A1 | Aversives | No e-collar / prong / choke / leash-pop protocol generation (AVSAB) | Yes — output filter |
| NFR-I1 | Identity | Not Blacksage / Sieger; do not buy telltail.com | Process, not a build test |

---

## Business rules

| ID | Rule |
|----|------|
| BR-1 | Quota **cannot** skip a bite-risk / kids / low-confidence refuse to save a credit. Gate always runs, including at 0 remaining. |
| BR-2 | A refuse / hard-stop **consumes** the safety path (counts as the read unit when a model ran). No free refuse that hides a skipped gate. |
| BR-3 | Lite safety **does not downgrade**. Cheap model still refuses. Lite is not Flash-class. |
| BR-4 | **One** cloud multimodal call per read. Plus = Flash-class. Lite = cheap-model. |
| BR-5 | **K1:** Flash-refuse eval fail **kills Plus**. First retry is Flash. Frontier is not the happy path. |
| BR-6 | First Lite scare **must complete** (no mid-moment paywall). Refuse counts; tease does not. |
| BR-7 | Published Plus SKU **$12/mo / $99/yr**. Never **$9.99**. Envelope $9–13 / $79–99 is sensitivity, not the listing. $12 is presentation, not WTP. |
| BR-8 | If the A+C **test** fails, **withdraw the paywall**. Do not sell form B at the same SKU. |
| BR-9 | No unlimited claims. Disclose 60 + credits + refuse-cannot-skip. |
| BR-10 | Never “relaxed / safe / won’t bite”; never translator; never diagnose. |
| BR-11 | Video leaves the phone. Never claim on-device. |
| BR-12 | Reward-based only. No aversive protocols. |
| BR-13 | Explore only. Nobody is building. Nothing in the App Store this phase. |
| BR-14 | Chat is first-class **context**. A refuse-first vision card requires a clip or stills. No clip → no “I saw your dog” card. Text-only is not a substitute vision read and not PetGPT. Do not flatten A+C into a chat-only coach. |
| BR-15 | Kids-in-frame is a **model detect** (child vs dog) on the one vision call. Child → refuse; no card; no face template; clip not training data. Chip is extra. Adult holding phone / background adult ≠ refuse unless the child detector fires. Lite must not downgrade. |

---

## Functional requirements

Product-level. Not API contracts, not schema, not architecture. Phase 9 owns build.

**FR-1 Capture.** The product accepts a short phone clip (live or immediate upload) of one dog in one moment. Optional context chips (kids / food / doorbell / visitor) travel with the clip **or** arrive as US-21 chat context. **No clip or stills → no vision card.** **US-01, US-21**

**FR-2 One cloud read.** Plus: one Flash-class multimodal LLM call per clip. Lite: one cheap-model call per clip. Never a custom pose detector. Never “on-device vision.” **US-02, US-07, US-11**

**FR-3 Refuse-first.** The gate runs before any state chip or action list. A failed floor produces a refuse screen, not a hedged card. **US-03**

**FR-4 Unskippable safety.** Snap/bite-risk, **model-detected child in frame**, medical, and low-confidence always refuse. Owner “kids present” chip is extra, not the only kids path. Adult phone-holder / background adult is not refuse unless the child detector fires. Remaining quota = 0 does not skip. Credits do not skip. Lite cheap-model must not downgrade the child-vs-dog detect. **US-04**

**FR-5 Card shape.** On a pass: observable signals + confidence + 1–3 next-60s actions + stop-rule. Reward-based / space / management only. **US-05**

**FR-6 Claims filter.** Banned strings cannot appear on card, paywall, or (later) listing: relaxed/safe/won’t bite; translator / mind-reading; diagnose; unlimited; “what serious apps do.” **US-06, US-09**

**FR-7 Lite complete.** First Lite read finishes a real scare (card *or* refuse). 3–5 cheap-model reads. No mid-loop paywall tease. **US-07**

**FR-8 Plus meter.** Working SKU $12/mo / $99/yr. 60 Flash/mo + credits. Disclose 60, refuse-cannot-skip, and no unlimited on the paywall. $12 is presentation, not WTP. Never $9.99. **US-08, US-09**

**FR-9 Escalate.** Bite / pain / injury / kids-in-frame → human (vet / credentialed trainer). No in-app bite-rehab. **US-10**

**FR-10 Media honesty.** Before send: video leaves the phone. Owner can decline. **US-11**

**FR-11 Retry / K1.** First retry = Flash. Frontier cascade is not the happy path. If Flash cannot refuse, Plus dies. **US-12**

**FR-12 Shoulds.** Credits $8–12/20 seed, not lock (**US-13**). After-action upload if live fails (**US-14**). Named voice only when A5 locks (**US-15**). Moment log (**US-16**).

**FR-13 Chat.** First-class conversation lane for the scare story. Attach clip or stills in thread to unlock the refuse-first vision card. Text-only must not invent a seen-dog diagnosis. Not a chat-only coach. A5 unnamed. **US-21**

---

## FR vs NFR split

**Functional (behavior the owner can observe):** US-01 capture/upload; US-21 chat context + attach-in-thread; US-02 one read call; US-03 gate-before-card; US-04 refuse cases + quota; US-05 card shape; US-07 Lite complete-scare; US-08 meter count + SKU; US-10 escalate copy; US-13 credits shape; US-14 Photos fallback; US-16 history.

**Non-functional (quality / constraint):** US-06 claims language; US-09 disclosure honesty; US-11 media leaving phone / no on-device claim; US-12 K1 release gate + retry policy; NFR-L1 latency unknown; NFR-C2 store category; NFR-A1 aversives filter; NFR-P* privacy.

**Business rules** (BR-*) constrain both. They are not user stories.

---

## MoSCoW

Assumptions before the table: A+C is a *test*, not a lock; A1 (film-live), A3/E1 (Flash-refuse), A4 (WTP), A5 (named voice) stay OPEN; $12 is presentation; Lite = cheap-model; explore only; no App Store this pass.

| ID | Item | Priority | Rationale (tied to strategy / model) |
|----|------|----------|--------------------------------------|
| US-01 | Capture / upload a live scare clip | **Must** | Job lock: missed training moments. Without a clip there is no “this dog, this second.” |
| US-02 | One Flash-class cloud read per clip | **Must** | Stack lock. One call. Not a detector. Frontier cascade-only. |
| US-03 | Refuse-first before any card | **Must** | Phase 5 explicit lock. Gate *in front of* the instruction card. A-alone is rejected. |
| US-04 | Bite-risk / kids / low-conf refuse; quota cannot skip | **Must** | Safety lock + Sci Rep constraint. Meter cannot buy a bypass. |
| US-05 | Signals + confidence + 1–3 actions + stop-rule | **Must** | Offer lock. Competence, not a mood sticker. |
| US-06 | Banned claims | **Must** | Trainer identity. Kinship / Traini tax. Footer cannot un-say a chip. |
| US-07 | Lite 3–5 cheap-model; first scare completes | **Must** | Explore gate. Reciprocity. Safety does not downgrade. |
| US-08 | Plus 60 Flash + credits; $12 / $99 | **Must** *of the test* | Working SKU. 60 = wrong trainer does not fire 200×/mo. Withdrawn if test or K1 fails. |
| US-09 | Paywall disclose 60 + refuse-cannot-skip + no unlimited | **Must** *of the test* | Harm-per-wrong-fire. Tailo/Aplexity unlimited already educate the shelf. |
| US-10 | Escalate, don’t diagnose | **Must** | Non-negotiable. Not a vet. Not a bite-rehab app. |
| US-11 | Video leaves phone; never claim on-device | **Must** | Stack honesty. Cloud vision. |
| US-12 | K1 kill + Flash retry; no frontier happy path | **Must** | Named kill. Do not prompt out. |
| US-21 | Chat as context + attach media in thread | **Must** | Founder lock. First-class conversation. No clip → no vision card. Not a chat-only coach. |
| US-13 | Credit overflow $8–12/20 | **Should** | Seed, not lock. Overflow after 60. Not a binge pack. |
| US-14 | After-action upload | **Should** | Hedge for A1. If it dominates, form slides toward B. |
| US-15 | Named training voice | **Should** | A5 OPEN. Labeled AC gap. Blocks public authority claims, not explore stories. |
| US-16 | History / moment log | **Should** | Intake “light history.” Channel artifact for P2, not a streak toy. |
| US-17 | Curriculum neighbor (form B) | **Could** | Neighbor, not the product. Not v1. Same SKU forbidden if A+C dies. |
| US-18 | Trainer seat $29–49 | **Could** | Out of v1. Channel later. |
| US-19 | Android | **Could** | iOS-first lock. Tailo already owns Android-ish shelf. |
| US-20 | HITL if Flash-refuse fails | **Could** | Explore kill-path only. Not a modeled rescue. |
| — | Translator / toy / mind-reading core loop | **Won’t** | Founder + Phase 3 identity. |
| — | Unlimited Plus | **Won’t** | COGS + safety. Peers already sell this; we do not race them. |
| — | Custom pose detector / 9B hardware | **Won’t** | Stack lock. 9B skipped. |
| — | Aversives / bite-rehab self-serve | **Won’t** | Non-negotiable. |
| — | App Store this pass | **Won’t** | Explore only. Nobody is building. |

**Release implication:** Must US-01–US-07 + US-10–US-12 + **US-21** are the Lite explore slice. Must US-08–US-09 join only while the A+C test is on. Shoulds do not gate explore. Could/Won’t are one-line out-of-scope — no full stories this pass.

---

## Technical constraints for Phase 9

Boundaries only. Not architecture. Flash-refuse eval is **stubbed, not designed**.

1. **One cloud multimodal call per read.** Plus = Flash-class. Lite = cheap-model. Frontier = cascade only, never the happy path.
2. **Video leaves the phone.** Never claim on-device analysis.
3. **No custom pose detector. No 9B hardware.** Phone is the sensor.
4. **Refuse is a product gate, not a prompt trick.** Quota, credits, and Lite cannot skip bite-risk / kids-in-frame / low-confidence. Gate always runs, including at 0 remaining. Kids-in-frame = child-vs-dog detect on that same one cloud call — Lite must not downgrade. Not “any human = refuse.”
5. **Retry = Flash first.** Opus/Sol retry×2 is a unit kill, not a UX flourish.
6. **Clip recipe is assumed** (~10s native video / think budget in Phase 4). Product will specify a real clip later; CTO measures. Do not “add a buffer and ship.”
7. **iOS-first, EN US/CA.** Android is Could.
8. **Flash-refuse eval — stub only.** Later CTO work must show Flash can hold a confidence floor good enough to refuse, including false-“relaxed” on bite-risk cues (Sci Rep 2025 is the constraint). **This PRD does not design the eval, fixtures, labels, sample, or pass bar.** If the eval fails → K1, Plus dies, 4B stays closed.

---

## Dependencies

| Dep | Type | Blocks | Owner later |
|-----|------|--------|-------------|
| Flash-refuse eval (E1) | Evidence / technical | Stage 1 Plus. K1 if fail | CTO — **not designed here** |
| Measured tokens / clip | Data | $0.37 COGS stays [F×A] until measured | CTO + product clip spec |
| A1 film-live | Behavioral | Whether Stage 0 is live-first or US-14-first | Research / founder (0 interviews) |
| A4 WTP 60 vs unlimited | Commercial | Whether Stage 1 paywall survives shoppers | Not copy. Not this PRD. |
| A5 named voice | Claims | US-15 public authority | Founder |
| TM / Telltail Dog Training | Legal | Public brand — planning accepted | Counsel. Do not buy telltail.com |
| App Store / build | Explicit out | Nothing this pass | — |

**Critical path (explore):** Stage 0 loop works without Plus. Stage 1 waits on a later Flash-refuse eval. Do not sequence a frontier cascade to “unblock” Stage 1.

---

## Risks

- **K1 / E1 Flash-refuse OPEN.** If Flash cannot refuse, Plus dies. Eval is later CTO work. Not a prompt bake-off. Not designed here.
- **A1 film-live OPEN.** If false, US-14 becomes the real path and A+C is homework.
- **A4 WTP OPEN.** Tailo Pro / Aplexity unlimited sit in-band. Paywall must lead harm-per-wrong-fire; copy cannot close WTP.
- **A5 named voice OPEN.** Public authority claims stay off until founder locks. US-15 is a labeled gap.
- **Sci Rep 2025.** Same LVLM class as Pawfessor / Tailo / Aplexity. Refuse-first is the only honest stance; it is still unproven.
- **Name collision** (Telltail Dog Training / USPTO) — risk-accepted for planning only. Public brand blocked until counsel.
- **Kids-in-frame + cloud video.** Disclosure is in US-11; COPPA / retention is COO/Legal.
- **NFR-L1.** No latency target. Do not promise “real-time.”
- **Explore only.** Nothing is in the App Store. Do not write this as a ship plan.

---

## Downstream handoff

Brief inherit only. No spawn from this file.

| Phase / seat | Inherits |
|--------------|----------|
| **Phase 6 GTM** | Holding line; Lifestyle + Education; paywall hero (60 + hard stop); banned claims; problem-query paid, not translator; A+C is a test (do not flatten into a lock); A5 unnamed → no public authority claims |
| **Phase 8 ops-legal** | Video leaves the phone; kids-in-frame no identity template / clip not training data; COPPA/retention; TM collision (Telltail Dog Training / USPTO) risk-accepted for planning only; do not buy telltail.com |
| **Phase 9 CTO** | FR-1–FR-13 + AC on US-01–14, US-16, US-21; US-15 gap; one cloud call (Plus Flash / Lite cheap); refuse-first; child-vs-dog detect on that call (Lite must not downgrade; adult ≠ child); chat = context not a text-only card; K1; Flash-refuse eval **stubbed, not designed**; NFR-L1 unknown; iOS-first |

---

## Approval checklist

Scorecard: **PRD + MoSCoW + AC**.

- [x] PRD present (`05-prd.md`) — HoP merge, not a concatenation
- [x] MoSCoW present — US-08/US-09 Must *of the test*
- [x] AC present for US-01–US-14, US-16, and US-21 (testable Given/When/Then)
- [x] US-15 labeled gap (A5 OPEN) + AC-15.1 placeholder (no anonymous PetGPT / fake named expert)
- [x] Every Must / Should has testable AC **or** a labeled gap
- [x] Could/Won’t are one-line out-of-scope only (US-17–US-20 + named Won’t)
- [ ] **Phase 5 is not marked complete.** C-suite reviews this merge. Orchestrator routes.

---

## NOT doing

- Toy / translator / mind-reading core loop
- Unlimited Plus, or annual as “unlimited for a year”
- Custom pose detector / 9B hardware
- Aversives / bite-rehab self-serve
- App Store / TestFlight / build this pass
- Diagnosing or replacing a vet or trainer
- Shipping “relaxed / safe / won’t bite”
- Curriculum-first product (B as the company) or selling B at the Plus SKU if A+C dies
- Flattening A+C from test into a launch lock
- Treating Plus (US-08/US-09) as an unconditional v1 Must
- Flash-class on Lite, or downgrading Lite safety
- Inventing a 2s / real-time latency SLA
- Inventing an inquiry form (IAP, not inquiry-first)
- Inventing TAM, CAC, conversion, WTP close, interviews, named voice, or Flash-refuse eval design
- Shipping anonymous PetGPT / fake named expert (US-15)
- Flattening A+C into a chat-only coach, or an “I saw your dog” card from text alone
- Naming Cesar Millan or any other trainer (A5 OPEN)
- Treating kids-in-frame as chip-only, or refusing a dog-only clip because an adult is holding the phone
- A “free refuse that hides a skipped gate”
- Marking Phase 5 complete
- Mixing Blacksage or Sieger
- Buying `telltail.com`
- Matching Como’s 78% ticker or calmness-as-safety-light
