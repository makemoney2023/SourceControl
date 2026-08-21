---
phase: "5"
position: "product-manager"
reports_to: "head-of-product"
status: done
verdict_for_manager: ready_to_merge
llm_tier: strong-general
llm_model: composer-2.5
generation_profile: none
generation_used: none
fallback_applied: false
tool_status:
  github: unused
  figma: unused
  supabase: unused
production_status: skipped
production_paths: []
design_brief_path: ""
skip_reason: "Phase 5 is not shippable. 4B closed. Explore only. Nobody is building. Nothing in the App Store. This seat writes the PRD merge-slice as an IC handoff only — 05-prd.md stays with Head of Product."
wire_owner: none
wire_checklist_path: ""
wire_notes: ""
---

# Handoff — Product Manager → Head of Product

## Operator brief (plain English)

Story IDs, functional areas, MoSCoW, and a Lite→Plus staged launch are on disk for you to merge into `05-prd.md`. I did not write the PRD, BA’s file, or a manager brief. Must IDs stay US-01–US-12; Should is US-13–US-16; I did not mint new Must IDs. A+C is sequenced as an explore test — paywall withdrawn if it fails — not as a launch lock. Ready to merge once BA lands AC against these IDs.

## What we found

- Shared IDs US-01–US-20 cover the locked loop (clip → one Flash-class cloud read → refuse-before-card → 1–3 next-60s actions + stop-rule) plus the $12 / $99 meter. No Must gap needed a US-21+.
- Lite (US-07) is the explore gate: 3–5 cheap-model reads, safety gates always on, first read must finish a real scare (a refuse still counts; a mid-moment tease does not).
- Plus (US-08/US-09) is the A+C *test* SKU. If the test or K1 fails, this paywall is withdrawn — we do not quietly sell curriculum (US-17) at the same price.
- After-action upload (US-14) is Should, not Must: live-film (A1) is still OPEN. If owners will not film the scare, A+C slides toward homework.
- Flash-refuse eval is stubbed for Phase 9 / CTO. This seat does not design the eval, fixtures, or rubric.

## Next steps

1. **Head of Product** — merge this slice into `05-prd.md` with BA’s AC / NFR / traceability. Do not mark Phase 5 complete from this seat.
2. **BA (already leased, not spawned)** — write AC against US-01–US-16 (Must + Should). See Gaps for BA AC below. Could/Won’t (US-17–US-20 + named Won’t) need only a one-line out-of-scope note, not full AC.
3. **No new operator question.** Named voice (A5), film-live (A1), and TM/domain stay founder/counsel. Flash-refuse eval stays later CTO work.

## Goal (from context packet)

User stories, functional areas, staged launch, and MoSCoW draft for Telltail Phase 5 PRD. Report to `head-of-product`. `delegate_budget: 0`. Do not spawn. Do not write `05-prd.md`. Do not mark the phase complete.

---

## Product vision summary

Telltail is a **training tool** — an AI dog trainer for missed training moments. A phone clip becomes observable signals, a confidence, 1–3 next-60-second actions, and a hard stop when the honest next step is stop. It is not a toy, translator, or entertainment sticker. Position against Pupford / Zigzag / Pawfessor / Tailo. Never Traini. **[F]** Phase 3 locks.

**Holding line (do not rewrite):** *See the signal. Do the next right thing — and know when to stop.* **[F]**

**Form we sequence, not lock:** A gated by C — moment coach behind refuse-first — is the **recommended test**. If the test fails, the Plus paywall is withdrawn. Hybrids (including form B as a neighbor) stay available. **[A]** `03-strategy.md`

This seat does not contradict Phase 3. $12 / $99 is Phase 4 presentation, not WTP. **[I]** C1 / C-suite Phase 4.

## Goals / success (explore — inherit Phase 3, not a forecast)

| Signal | Good | Kill |
|--------|------|------|
| Flash refuse (later CTO eval) | Holds a confidence floor; false-“relaxed” on bite-risk does not ship | Cannot refuse → Plus is not a product (K1) |
| First Lite scare (US-07) | Clip (or immediate upload) → card *or* refuse → stop-rule. Loop finishes. | Tease that dies mid-moment |
| Plus meter (US-08/09) | 60 + refuse-cannot-skip understood as harm-per-wrong-fire | “Unlimited?” as the dominant reaction |
| Claims (US-06/10) | Zero translator / safe-to-approach / won’t-bite chips | Kinship-class press |
| Demand | Do not invent. Public vision-instruction ratings still ~0 except Traini | Treating Traini volume as our TAM |

---

## Personas

Strategy already named ICP. This seat does **not** rewrite avatars. Gaps only, labeled.

| Who | Role in v1 | Label | Gap this seat fills |
|-----|------------|-------|---------------------|
| P0 first-week / first-time panic (US/CA, iOS) | Primary buyer | **[A]** intake / strategy; 0 interviews | Use case = 11pm kitchen scare they will try to film *or* upload immediately (A1 still OPEN) |
| P1 reactive / adolescent | Secondary wedge | **[A]** | Live episode is faster; phone often pocketed → US-14 after-action is the hedge, not the hero |
| P2 trainers | Channel, not buyer | **[A]** | US-16 history is the only v1 artifact they might be shown. No trainer seat (US-18) |
| Anti: translator shopper, unlimited-AI bargain hunter, bite-rehab self-serve, show/kennel | Do not attract | **[F]** locks | No stories serve them |

No new persona invented. P0/P1 remain provisional until interviews exist.

### Use cases (only where strategy left the moment implicit)

**UC-1 — First Lite scare (P0).** Actor just had a jump / mouth / freeze. Opens Telltail, captures or uploads, gets a card *or* a refuse, and the loop finishes. **[A]** A1. Maps: US-01, US-03, US-05, US-07.

**UC-2 — Kids in the room (P0/P1).** Clip includes a child, or owner marks kids present. Gate refuses before any state/action card. Escalate, don’t diagnose. Never “relaxed / safe / won’t bite.” **[F]** Maps: US-04, US-06, US-10.

**UC-3 — Plus month of moments (P0/P1).** Paid user at $12 / $99. Each scare costs one of 60 Flash-class cloud reads. At 0 remaining, bite-risk refuse still fires. Paywall already said so. **[F]** Maps: US-02, US-08, US-09, US-04.

**UC-4 — They missed the film (P1).** Live capture failed. After-action upload is offered (Should). If this becomes the common path, A+C is homework, closer to B. **[I]** E2. Maps: US-14.

**UC-5 — K1 fires (operator / explore).** Flash cannot hold a refuse floor. Plus is killed. Retry stays on Flash; frontier cascade is not the happy path. HITL (US-20) is an explore kill-path, not a rescue SKU. **[F]** Maps: US-12, US-20.

---

## Functional areas

| Area | What it owns | US-IDs |
|------|----------------|--------|
| **A. Capture & media** | Live clip or upload; video leaves the phone; no on-device claim | US-01, US-11, US-14 |
| **B. Read** | Exactly one Flash-class cloud multimodal call per clip (Plus). Lite uses the cheap model. Never a custom detector | US-02, US-07, US-12 |
| **C. Refuse-first gate** | Gate runs *before* any state/action card. Bite-risk, kids-in-frame, low-confidence. Quota cannot skip | US-03, US-04 |
| **D. Moment card** | Signals + confidence + 1–3 next-60s actions + stop-rule. Reward-based / management only | US-05 |
| **E. Claims & escalate** | Banned language; escalate-don’t-diagnose | US-06, US-10, US-15 |
| **F. Lite explore** | 3–5 cheap-model reads; first read completes a real scare; gates always on | US-07 |
| **G. Plus / paywall / credits** | $12/mo / $99/yr; 60 Flash + credits; disclose 60 + refuse-cannot-skip + no unlimited | US-08, US-09, US-13 |
| **H. History** | Prior reads / moment log (Should) | US-16 |
| **Later / out** | Curriculum neighbor; trainer seat; Android; HITL kill-path | US-17, US-18, US-19, US-20 |

---

## User stories

Feature-spec pack, product-level. **Must + Should only.** Acceptance criteria are BA’s lease — not written here. Actor / precondition / main flow / alternatives / postcondition only.

### Must

#### US-01 — Capture / upload a live scare clip

**As a** P0/P1 owner, **I want** to film or immediately upload a short clip of *this* scare, **so that** the read is about this dog, this second.

- **Actor:** P0/P1 owner, iOS, EN US/CA
- **Precondition:** App is open. A scare just happened or is happening. Explore — not in the App Store.
- **Main flow:** 1) Start live capture *or* pick a just-shot clip. 2) Optional context chips (kids / food / doorbell / visitor) — not a form essay. 3) Confirm send.
- **Alternatives:** Live capture fails → offer US-14 (Should), do not dead-end. No clip → no read.
- **Postcondition:** One media object queued for a single cloud read (US-02 / US-07). Owner has been told video will leave the phone (US-11).
- **Out of this story:** Live home-camera, collar, multi-dog, cats.

#### US-02 — One Flash-class cloud multimodal read per clip

**As a** Plus owner, **I want** one honest cloud read per clip, **so that** I am not billed a cascade and we do not pretend the phone did the vision.

- **Actor:** Plus subscriber (or the Plus-path read)
- **Precondition:** A clip from US-01. Remaining Flash > 0 *or* a credit will be used — except refuse (US-04) which still runs at 0.
- **Main flow:** 1) Upload to cloud. 2) Exactly one Flash-class multimodal call. 3) Result is a refuse (US-03/04) *or* a card (US-05).
- **Alternatives:** Call fails → retry on Flash (US-12). Do not silently escalate to Opus/Sol as the happy path.
- **Postcondition:** One read consumed (or a refuse recorded). No second model in the happy path.
- **Out:** Custom pose detector. On-device vision. “Unlimited scans.”

#### US-03 — Refuse-first before any state / action card

**As an** owner, **I want** the app to decide whether it can speak *before* it shows me a state or an action, **so that** I never get a coaching card the model cannot stand behind.

- **Actor:** Any user on Lite or Plus
- **Precondition:** A read has returned (or the gate can decide from the clip + context).
- **Main flow:** 1) Gate evaluates confidence floor + banned situations. 2) If it cannot hold the floor → refuse screen, no state chip, no actions. 3) If it can → then and only then US-05.
- **Alternatives:** Owner at 0 quota — gate still runs (US-04). Lite cheap-model — gate still runs (safety does not downgrade).
- **Postcondition:** User saw either a refuse or a card. Never a card that skipped the gate.
- **Out:** Soft “low confidence” badge on a full action card as a substitute for refuse.

#### US-04 — Bite-risk / kids-in-frame / low-confidence refuse (quota cannot skip)

**As an** owner (especially with kids or a scary clip), **I want** a hard refuse I cannot buy my way around, **so that** a paid meter never becomes a safety bypass.

- **Actor:** Any user
- **Precondition:** Clip or context shows bite-risk cues, a child in frame / kids-present chip, medical/pain-like events, or confidence below the floor.
- **Main flow:** 1) Refuse. 2) Escalate copy (US-10). 3) No state/action card. 4) Meter does not waive the refuse at 0 remaining.
- **Alternatives:** Owner tries to “use a credit to get a card anyway” → blocked. Credits are not a refuse bypass.
- **Postcondition:** No “relaxed / safe / won’t bite.” No diagnosis. Human next step named.
- **Out:** Scoring calmness-as-safety. Vs-vet %.

#### US-05 — Card: signals + confidence + 1–3 next-60s actions + stop-rule

**As an** owner who passed the gate, **I want** what we see, how sure we are, 1–3 things to do in the next minute, and when to stop, **so that** I do the next right thing and do not make the dog worse.

- **Actor:** Owner after a pass on US-03
- **Precondition:** Gate passed. One read completed.
- **Main flow:** Card shows (1) observable signals, (2) confidence and what would change the read, (3) 1–3 reward-based / space-giving / management actions for ~60 seconds, (4) stop-rule / escalate line.
- **Alternatives:** If the honest next step is stop → card is the stop-rule, not three invented drills.
- **Postcondition:** No cartoon quote. No 6-week plan. No aversive / dominance protocol.
- **Out:** Curriculum (US-17). Bite-rehab protocol.

#### US-06 — Banned claims

**As the** product (and as a P2 trainer watching), **I want** certain sentences to be impossible on the card, paywall, and listing, **so that** we do not inherit the Kinship tax.

- **Actor:** System + any surface that speaks
- **Precondition:** Any generated or static string about the dog or the offer.
- **Main flow:** Block and never ship: “relaxed / safe / won’t bite”; translator / “see what your dog is thinking”; diagnose / replace vet or trainer; unlimited; “what serious apps do.”
- **Alternatives:** Model emits a banned chip → strip and refuse or rewrite to signals + escalate. Footer disclaimers do not un-say a chip.
- **Postcondition:** Holding line intact. Lifestyle + Education language only (when a store exists — not this pass).
- **Out:** Rewriting Phase 3 claims ladder. That file already exists.

#### US-07 — Lite: 3–5 cheap-model reads; first read completes a real scare

**As a** new P0 owner, **I want** a few free cheap-model reads that actually finish one scare, **so that** I learn the stop-rule exists before anyone asks for $12.

- **Actor:** Unsigned or free Lite user
- **Precondition:** Explore build. Not a store listing.
- **Main flow:** 1) First Lite read runs the same capture → gate → card-or-refuse loop to completion. 2) Remaining Lite reads (up to 3–5 / period) use the cheap model. 3) Gates stay on. Safety does not downgrade.
- **Alternatives:** First read refuses (US-04) — that *is* a completed scare. Crash / paywall / “upgrade to see the card” mid-loop — fail this story.
- **Postcondition:** Owner saw a finished moment. No Frontier on Lite. No “full AI” tease.
- **Out:** Blending Lite COGS into Plus. Unlimited try.

#### US-08 — Plus: 60 Flash/mo + credits; $12/mo / $99/yr

**As a** paying owner, **I want** sixty Flash-class reads a month plus overflow credits at the working SKU, **so that** a wrong trainer cannot fire 200×/month.

- **Actor:** Plus subscriber
- **Precondition:** A+C test is still on. K1 has not fired. Working published SKU **$12.00 / mo** or **$99 / yr**. Envelope $9–13 / $79–99 remains; never $9.99.
- **Main flow:** 1) Subscribe at $12 or $99. 2) 60 Flash-class cloud reads / month. 3) After 60, credits (US-13) may buy more Flash reads. 4) Frontier is cascade-only, not an entitlement.
- **Alternatives:** A+C test fails or K1 fires → this SKU is withdrawn (US-12). Do not silently retarget the same price at curriculum.
- **Postcondition:** $12 is presentation, not WTP (A4 OPEN). No unlimited Plus. No trainer seat on this grid.
- **Out:** Inventing conversion, ARR, or that owners will pay 60 vs Tailo/Aplexity unlimited.

#### US-09 — Paywall disclose: 60 + refuse-cannot-skip + no unlimited

**As a** shopper, **I want** the paywall to say what I am buying before I pay, **so that** 60 is not a surprise and refuse is not a “gotcha.”

- **Actor:** Lite user hitting the Plus wall
- **Precondition:** They finished (or attempted) a Lite scare, or they opened paywall from settings.
- **Main flow:** Paywall states: 60 Flash reads / mo + credits; a read is one moment *or* a refuse; quota cannot skip bite-risk refuse; not unlimited. Hero is harm-per-wrong-fire, not a scan fight with Tailo / Aplexity.
- **Alternatives:** Annual $99 shown as the same meter, not “unlimited for a year.”
- **Postcondition:** No “what serious apps do.” No Unlimited / Translator Pro IAP names.
- **Out:** Store screenshots this pass (App Store = Won’t).

#### US-10 — Escalate, don’t diagnose (vet / trainer)

**As an** owner on a scary clip, **I want** a human next step, **so that** the app does not play vet or behaviorist.

- **Actor:** Owner on a refuse or on a card whose stop-rule is escalate
- **Precondition:** Bite-risk, pain-like, seizure-like, injury, or “we cannot hold this.”
- **Main flow:** Name the escalate: space now; licensed vet / veterinary behaviorist / credentialed trainer. No in-app protocol for bite history.
- **Alternatives:** Owner asks “is he aggressive / in pain / safe for my kid?” → refuse the diagnosis, keep the escalate.
- **Postcondition:** No medical claim. No “replaces your trainer.”
- **Out:** Trainer marketplace, booking, US-18.

#### US-11 — Media: video leaves the phone; never claim on-device

**As an** owner sending a home clip (often with kids), **I want** to be told the video leaves the phone, **so that** we never market an on-device lie.

- **Actor:** Anyone about to send media
- **Precondition:** Before first upload and on the send confirm.
- **Main flow:** Clear disclosure: cloud read; video leaves the device. No “on-device AI” / “stays on your phone” claim. Stack is one cloud multimodal call.
- **Alternatives:** Owner declines send → no read, no silent upload.
- **Postcondition:** Copy matches the stack lock. Privacy/COPPA detail is COO/Legal, not this seat.
- **Out:** Designing the retention policy or the model vendor.

#### US-12 — K1: Flash-refuse fail kills Plus; retry Flash; no frontier cascade as happy path

**As the** explore operator, **I want** a named kill and a retry rule, **so that** we do not prompt our way into a $5–6/read Plus.

- **Actor:** Product / later CTO (not a consumer-facing “feature”)
- **Precondition:** Flash cannot hold a refuse floor, or a read errors.
- **Main flow:** 1) First retry on Flash only. 2) If the *eval* says Flash cannot refuse → kill Plus (working $12 and the $9 envelope language). 3) Do not invent a frontier cascade as the happy path. 4) HITL (US-20) is an explore path, not a rescue SKU.
- **Alternatives:** Transient API fail ≠ K1. K1 is “cannot hold the floor,” not “one timeout.”
- **Postcondition:** Credits have no home if Plus dies. 4B stays closed. No raise.
- **Out:** This seat designing the eval (see Technical constraints stub).

### Should

#### US-13 — Credit overflow $8–12 / 20 (seed, not lock)

**As a** Plus owner who used 60 in a hard week, **I want** a small overflow pack, **so that** I am not forced into unlimited and we do not sell a 200-read binge.

- **Actor:** Plus subscriber after 60
- **Precondition:** Plus still exists (K1 has not fired)
- **Main flow:** Offer overflow credits. Seed merchandising **$8–12 / 20 [A]** — not a lock, not a third plan, not a hero column on first paywall. Credits cannot skip refuse.
- **Alternatives:** Owner not on Plus → do not lead with credits.
- **Postcondition:** Overflow is extra Flash-class reads. Not a refuse bypass.

#### US-14 — After-action upload if live-film fails

**As an** owner who could not film the scare, **I want** to upload what I have right after, **so that** the loop still finishes — knowing this is the A1 hedge.

- **Actor:** P0/P1
- **Precondition:** Live capture failed, was refused by the owner, or the moment is already over
- **Main flow:** Prompt to upload the just-shot roll clip / stills. Same gate + card path.
- **Alternatives:** Nothing to upload → do not fake a read from a text box (that is ChatGPT, already a substitute).
- **Postcondition:** If this path dominates, label it: A+C is sliding toward homework (closer to B). **[I]** E2
- **Note:** Should, not Must. Live-first remains the test.

#### US-15 — Named training voice (OPEN — A5)

**As a** P2 trainer (and as copy), **I want** a named method we will stand behind, **so that** we are not anonymous PetGPT.

- **Actor:** Founder (lock) / later claims surfaces
- **Precondition:** A5 is OPEN. Do not invent a name.
- **Main flow:** When founder locks a voice, card + listing may cite it. Until then: reward-based / management only, no fake credential.
- **Alternatives:** Do not ship public “our trainer says” without the lock.
- **Postcondition:** Authority pillar stays empty rather than filled with a ghost. Not a Phase 5 blocker for explore stories.

#### US-16 — History of prior reads / moment log

**As an** owner (and later a P2 trainer they show), **I want** a trail of prior reads, **so that** the next human sees what we already said.

- **Actor:** Owner who has completed ≥1 read
- **Precondition:** At least one card or refuse exists
- **Main flow:** List prior moments: date, signals or refuse reason, actions given. No “progress to relaxed.”
- **Alternatives:** First-time user — empty state, no fake history.
- **Postcondition:** History is a log, not a curriculum streak toy.
- **Out:** Trainer seat sharing (US-18). Client homework portal.

---

## Functional requirements

Product-level. Not API contracts, not schema, not architecture. Phase 9 owns build. BA owns testable AC.

**FR-1 Capture.** The product accepts a short phone clip (live or immediate upload) of one dog in one moment. Optional context chips (kids / food / doorbell / visitor) travel with the clip. **US-01**

**FR-2 One cloud read.** Plus: one Flash-class multimodal LLM call per clip. Lite: one cheap-model call per clip. Never a custom pose detector. Never “on-device vision.” **US-02, US-07, US-11**

**FR-3 Refuse-first.** The gate runs before any state chip or action list. A failed floor produces a refuse screen, not a hedged card. **US-03**

**FR-4 Unskippable safety.** Bite-risk, kids-in-frame (or kids-present context), and low-confidence always refuse. Remaining quota = 0 does not skip. Credits do not skip. Lite does not skip. **US-04**

**FR-5 Card shape.** On a pass: observable signals + confidence + 1–3 next-60s actions + stop-rule. Reward-based / space / management only. **US-05**

**FR-6 Claims filter.** Banned strings cannot appear on card, paywall, or (later) listing: relaxed/safe/won’t bite; translator / mind-reading; diagnose; unlimited; “what serious apps do.” **US-06, US-09**

**FR-7 Lite complete.** First Lite read finishes a real scare (card *or* refuse). 3–5 cheap-model reads. No mid-loop paywall tease. **US-07**

**FR-8 Plus meter.** Working SKU $12/mo / $99/yr. 60 Flash/mo + credits. Disclose 60, refuse-cannot-skip, and no unlimited on the paywall. $12 is presentation, not WTP. Never $9.99. **US-08, US-09**

**FR-9 Escalate.** Bite / pain / injury / kids-in-frame → human (vet / credentialed trainer). No in-app bite-rehab. **US-10**

**FR-10 Media honesty.** Before send: video leaves the phone. Owner can decline. **US-11**

**FR-11 Retry / K1.** First retry = Flash. Frontier cascade is not the happy path. If Flash cannot refuse, Plus dies. **US-12**

**FR-12 Shoulds.** Credits $8–12/20 seed, not lock (**US-13**). After-action upload if live fails (**US-14**). Named voice only when A5 locks (**US-15**). Moment log (**US-16**).

---

## MoSCoW

Assumptions before the table: A+C is a *test*, not a lock; A1 (film-live), A3/E1 (Flash-refuse), A4 (WTP), A5 (named voice) stay OPEN; $12 is presentation; explore only; no App Store this pass.

| ID | Item | Priority | Rationale (tied to strategy / model) |
|----|------|----------|--------------------------------------|
| US-01 | Capture / upload a live scare clip | **Must** | Job lock: missed training moments. Without a clip there is no “this dog, this second.” |
| US-02 | One Flash-class cloud read per clip | **Must** | Stack lock. One call. Not a detector. Frontier cascade-only. |
| US-03 | Refuse-first before any card | **Must** | Phase 5 explicit lock. Gate *in front of* the instruction card. A-alone is rejected. |
| US-04 | Bite-risk / kids / low-conf refuse; quota cannot skip | **Must** | Safety lock + Sci Rep constraint. Meter is ours; it cannot buy a bypass. |
| US-05 | Signals + confidence + 1–3 actions + stop-rule | **Must** | Offer lock. Competence, not a mood sticker. |
| US-06 | Banned claims | **Must** | Trainer identity. Kinship / Traini tax. Footer cannot un-say a chip. |
| US-07 | Lite 3–5 cheap-model; first scare completes | **Must** | Explore gate. Reciprocity. Safety does not downgrade. |
| US-08 | Plus 60 Flash + credits; $12 / $99 | **Must** *of the test* | Working SKU. 60 = wrong trainer does not fire 200×/mo. Withdrawn if test or K1 fails. |
| US-09 | Paywall disclose 60 + refuse-cannot-skip + no unlimited | **Must** *of the test* | Harm-per-wrong-fire. Tailo/Aplexity unlimited already educate the shelf. |
| US-10 | Escalate, don’t diagnose | **Must** | Non-negotiable. Not a vet. Not a bite-rehab app. |
| US-11 | Video leaves phone; never claim on-device | **Must** | Stack honesty. Cloud Flash-class. |
| US-12 | K1 kill + Flash retry; no frontier happy path | **Must** | Named kill. Do not prompt out. |
| US-13 | Credit overflow $8–12/20 | **Should** | Seed, not lock. Overflow after 60. Not a binge pack. |
| US-14 | After-action upload | **Should** | Hedge for A1. If it dominates, form slides toward B. |
| US-15 | Named training voice | **Should** | A5 OPEN. Blocks public authority claims, not explore stories. |
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

**Release implication:** Must US-01–US-07 + US-10–US-12 are the Lite explore slice. Must US-08–US-09 join only while the A+C test is on. Shoulds do not gate explore. Could/Won’t stay out of `05-prd.md` v1 scope.

---

## Staged launch

Not a calendar and not an App Store plan. Explore sequencing. **A+C is the test, not a lock.**

```
Stage 0  Lite explore
         US-01, 03, 04, 05, 06, 07, 10, 11
         First scare completes (card or refuse)
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

**Capacity / dates:** unknown. Founder budget unknown. Do not invent a quarter. Roadmap-builder used for *sequence and dependency*, not a fake Q2 Gantt.

**Change rule:** If A+C fails, withdraw the Stage 1 paywall. Do not keep $12 and swap in curriculum.

---

## Dependencies

| Dep | Type | Blocks | Owner later |
|-----|------|--------|-------------|
| Flash-refuse eval (E1) | Evidence / technical | Stage 1 Plus. K1 if fail | CTO — **not designed here** |
| Measured tokens / clip | Data | $0.37 COGS stays [F×A] until measured | CTO + product clip spec |
| A1 film-live | Behavioral | Whether Stage 0 is live-first or US-14-first | Research / founder (0 interviews) |
| A4 WTP 60 vs unlimited | Commercial | Whether Stage 1 paywall survives shoppers | Not copy. Not this seat. |
| A5 named voice | Claims | US-15 public authority | Founder |
| BA AC on US-01–US-16 | Traceability | PRD merge / later Phase 9 | BA (parallel lease) |
| TM / Telltail Dog Training | Legal | Public brand — planning accepted | Counsel. Do not buy telltail.com |
| App Store / build | Explicit out | Nothing this pass | — |

**Critical path (explore):** Stage 0 loop works without Plus. Stage 1 waits on a later Flash-refuse eval. Do not sequence a frontier cascade to “unblock” Stage 1.

---

## Technical constraints stub (Phase 9 — boundaries only)

Not architecture. Not an eval design. Not a vendor bake-off.

1. **One cloud multimodal call per read.** Plus = Flash-class. Lite = cheap model. Frontier = cascade only, never the happy path.
2. **Video leaves the phone.** Never claim on-device analysis.
3. **No custom pose detector. No 9B hardware.** Phone is the sensor.
4. **Refuse is a product gate, not a prompt trick.** Quota, credits, and Lite cannot skip bite-risk / kids-in-frame / low-confidence.
5. **Retry = Flash first.** Opus/Sol retry×2 is a unit kill, not a UX flourish.
6. **Clip recipe is assumed** (~10s native video / think budget in Phase 4). Product will specify a real clip later; CTO measures. Do not “add a buffer and ship.”
7. **iOS-first, EN US/CA.** Android is Could.
8. **Flash-refuse eval — stub only.** Later CTO work must show Flash can hold a confidence floor good enough to refuse, including false-“relaxed” on bite-risk cues (Sci Rep 2025 is the constraint). **This seat does not design the eval, fixtures, labels, sample, or pass bar.** If the eval fails → K1, Plus dies, 4B stays closed.

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
- Writing `05-prd.md` from this seat
- Marking Phase 5 complete
- Inventing TAM, CAC, conversion, WTP, or a filming-during-scare answer
- Designing the Flash-refuse eval
- Mixing Blacksage or Sieger
- Buying `telltail.com`
- Matching Como’s 78% ticker or calmness-as-safety-light

---

## Gaps for BA AC

Expect AC on **Must + Should**. IDs locked. Do not invent parallel IDs.

| US-ID | Why AC is load-bearing | Hint (not AC) |
|-------|------------------------|---------------|
| US-01 | Capture vs upload vs empty | Context chips vs required form |
| US-02 | One call; no silent cascade | What “one read” means when retry happens |
| US-03 | Gate *before* card | No state chip on refuse |
| US-04 | Quota cannot skip; kids-in-frame; credits cannot skip | Lite + Plus + 0 remaining |
| US-05 | Card anatomy; 1–3; stop-rule | Aversive output = fail |
| US-06 | Banned strings on every surface | Chip vs footer |
| US-07 | First Lite read completes; 3–5; cheap model; gates on | Refuse counts as complete; tease does not |
| US-08 | $12 / $99; 60 + credits; never $9.99 | Test withdrawn ≠ keep SKU |
| US-09 | Disclose 60 + refuse-cannot-skip + no unlimited | Hero copy = harm-per-wrong-fire |
| US-10 | Escalate targets; no diagnosis | Owner asks “is he safe?” |
| US-11 | Disclosure before send; decline path | Never “on-device” |
| US-12 | Retry Flash; K1 kills Plus; no frontier happy path | Transient fail ≠ K1 |
| US-13 | Overflow seed; not a bypass | Not on first-paywall hero |
| US-14 | After-action only if live fails | No text-only “read” |
| US-15 | A5 OPEN — AC should allow *absence* | No invented credential |
| US-16 | Log, not streak | Refuse rows included |

**Do not need full AC this pass:** US-17, US-18, US-19, US-20 (Could) and named Won’t — one-line out-of-scope is enough.

NFRs, operator decisions, and traceability matrix stay on BA’s lease.

---

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/telltail/business-idea/HANDOFFS/5-product-manager.md` | This handoff. Full PRD merge-slice (vision, personas gaps, functional areas, stories, FR, MoSCoW, staged launch, deps, tech stub, risks, BA gaps). **Did not write `05-prd.md`.** |

Canonical disk: `/Users/cbsuperpatch/Desktop/ClaudeSkills/docs/projects/telltail/business-idea/` (local only, no OneDrive).

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | strong-general |
| llm_model | composer-2.5 |
| generation_profile | none |
| generation_used | none |
| fallback_applied | no |

## Production (shippable phases — required)

| Field | Value |
|-------|-------|
| production_status | skipped |
| production_paths | none |
| wire_owner | none |
| wire_notes | n/a |
| skip_reason | Phase 5 is not shippable. 4B closed. Explore only. No Layer B. |

## SDK correlation (optional)

| Field | Value |
|-------|-------|
| sdk_runtime | n/a |
| sdk_agent_id | n/a |
| sdk_run_id | n/a |
| sdk_request_id | n/a |

## Decisions

- Shared story IDs locked as given. No new Must IDs. No US-21+ needed.
- Feature-spec kept at product-level stories + FR. No API/schema (would collide with Phase 9 / CTO).
- MoSCoW: US-01–US-12 Must (US-08/09 Must *of the test*); US-13–US-16 Should; US-17–US-20 Could; translator / unlimited / detector / aversives / App Store this pass = Won’t.
- Staged launch = Lite explore → Plus test → Shoulds → later. A+C not a lock. Paywall withdrawn if the test or K1 fails.
- Lite = cheap-model 3–5 (Phase 4), not PMM’s leftover “Flash-class on Lite.” Safety does not downgrade.
- $12 / $99 working SKU; envelope kept; never $9.99; $12 ≠ WTP.
- Flash-refuse eval stubbed, not designed.
- Context chips folded into US-01/US-04 rather than a new ID.
- A refuse on first Lite read satisfies “completes a real scare.” A mid-moment upgrade wall does not.

## Asks for manager (`ask_manager`)

- Peer help needed: none (BA already running on a non-colliding lease)
- Clarification needed: none

## Risks / blockers

- **K1 / E1 Flash-refuse OPEN.** If Flash cannot refuse, Plus dies. Eval is later CTO work. Not a prompt bake-off. Not designed here.
- **A1 film-live OPEN.** If false, US-14 becomes the real path and A+C is homework.
- **A4 WTP OPEN.** Tailo Pro / Aplexity unlimited sit in-band. Paywall must lead harm-per-wrong-fire; copy cannot close WTP.
- **A5 named voice OPEN.** Public authority claims stay off until founder locks.
- **Sci Rep 2025.** Same LVLM class as Pawfessor / Tailo / Aplexity. Refuse-first is the only honest stance; it is still unproven.
- **Name collision** (Telltail Dog Training / USPTO) — risk-accepted for planning only. Public brand blocked until counsel.
- **Kids-in-frame + cloud video.** Disclosure is in US-11; COPPA / retention is COO/Legal.
- **Explore only.** Nothing is in the App Store. Do not write this as a ship plan.

## Packs used

| Pack | Decision tied to pack |
|------|------------------------|
| `skills/community/awesome-claude-corporate-skills/09-product-management/feature-spec/` | Wrote Must + Should as actor / precondition / main flow / alternatives / postcondition stories plus FR-1–FR-12. Stopped before API/schema so Phase 9 is not pre-solved. AC left to BA. |
| `skills/community/awesome-claude-corporate-skills/09-product-management/roadmap-builder/` | Sequenced Lite explore → Plus test → Shoulds → later, with A1 / E1 / K1 as the only real dependencies. No fake quarters (budget and dates unknown). |
| `skills/community/business-analysis-skills/skills/moscow-prioritisation/` | Must = locked loop + test SKU; Should = overflow / after-action / voice / history; Could = B / trainer / Android / HITL; Won’t includes App Store this pass. Assumptions stated above the table. |

## Do not

- Mark the phase complete
- Write `05-prd.md` or BA’s `HANDOFFS/5-business-analyst.md`
- Write outside write_lease
- Spawn other positions
- Invent new Must story IDs
- Flatten A+C from test into a launch lock
- Design the Flash-refuse eval
- Claim on-device vision
- List Plus at $9.99 or as WTP
- Market 60 as “what serious apps do”
- Put a frontier cascade in the happy path
- Re-ask locked ids (name, stack, trainer-not-toy, 4B, Blacksage/Sieger, telltail.com)
- Invent TAM, CAC, conversion, interviews, or a filming-during-scare answer
- Copy artifacts to OneDrive / iCloud / Google Drive
