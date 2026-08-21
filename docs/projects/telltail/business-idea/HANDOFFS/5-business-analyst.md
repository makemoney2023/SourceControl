---
phase: "5"
position: business-analyst
reports_to: head-of-product
status: done
verdict_for_manager: ready_to_merge
llm_tier: strong-general
llm_model: composer-2.5
generation_profile: none
generation_used: none
fallback_applied: false
production_status: skipped
production_paths: []
skip_reason: Phase 5 is not shippable; 4B closed; nobody is building; nothing in the App Store
---

# Handoff — Phase 5 Business Analyst → head-of-product

## Operator brief (plain English)

AC, NFRs, traceability, business rules, and an operator decision register are in this handoff for you to merge into `05-prd.md`. Shared story IDs US-01–US-16 are used; I did not invent competing Must IDs. US-15 (named voice) is a labeled AC gap — A5 is still OPEN. Flash-refuse eval is specified as the test K1/US-12 must eventually satisfy; I did not design or run it. Phase 5 is not complete. I did not write the PRD or the PM file.

## What we found

- **[F]** Musts US-01–US-12 have Given/When/Then AC. Shoulds US-13, US-14, US-16 have AC. US-15 is a **gap** until A5 is named.
- **[F]** Unit = one cloud Flash-class read (card **or** refuse). Working SKU $12/mo / $99/yr, 60 + credits. Never $9.99. Lite 3–5; first scare must complete. Quota cannot skip refuse.
- **[A]** A+C is the **test form**, not a launch lock. If the test fails, the paywall is withdrawn — AC for US-08/US-12 say so.
- **[F]** OPEN and blocking: A1 film-live, A3/E1 Flash-refuse, A4 WTP, A5 named voice, A10 Dogs Trust export.
- **[I]** Latency is unknown until CTO measures a clip. NFR states “unknown,” not a fake SLA.

## Next steps

1. **Head of Product** — merge this slice with `HANDOFFS/5-product-manager.md` into `05-prd.md`. Do not mark Phase 5 complete.
2. **This IC** — stop. No spawn. No PRD write.
3. **CTO later** — Flash-refuse eval must satisfy US-03 / US-04 / US-12 AC. Not a prompt bake-off.

## Goal (from context packet)

AC, traceability, NFRs, operator decision register for Telltail Phase 5 PRD. report_to: head-of-product. Parallel with PM on a non-colliding lease.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/telltail/business-idea/HANDOFFS/5-business-analyst.md` | This file. All BA Phase 5 craft lives here for HoP merge. Local Mac path only. |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | strong-general |
| llm_model | composer-2.5 |
| generation_profile | none |
| generation_used | none |
| fallback_applied | false |

## Production

| Field | Value |
|-------|-------|
| production_status | skipped |
| production_paths | none |
| wire_owner | none |
| skip_reason | Phase 5 is not shippable; 4B closed |

---

## Shared story IDs (locked — do not invent competitors)

Must: US-01 … US-12. Should: US-13 … US-16. PM owns stories/MoSCoW. This seat owns AC.

**Persona (P0) [A]:** first-time / anxious US/CA owner. **P1** reactive/adolescent. **Anti:** translator shopper, unlimited-AI bargain hunter, bite-rehab self-serve.

---

## 1. Acceptance criteria (Must + Should)

Format: Given / When / Then. Negative cases included. US-15 = labeled gap.

### US-01 Capture/upload a live scare clip — Must

**AC-01.1** Given the owner is signed in on iOS and has granted camera permission, When they start a capture for a live scare, Then the app records a clip (or stills) and shows a visible recording indicator (Apple 2.5.14).

**AC-01.2** Given camera permission is denied, When they try to capture, Then the app does not capture, explains why, and offers Photos upload (US-14) — it does not invent a clip.

**AC-01.3** Given a capture is in progress, When they cancel, Then no read is started and no quota is consumed.

**Gap:** A1 (will they film *during* the scare) is OPEN. AC tests the *capability*, not that owners will use it live.

### US-02 One Flash-class cloud multimodal read per clip — Must

**AC-02.1** Given a valid clip is submitted, When a read starts, Then the product issues **exactly one** Flash-class cloud multimodal LLM call for that read (no custom detector; no classifier-then-LLM).

**AC-02.2** Given a read is in flight, When the owner taps again, Then a second parallel call is not opened for the same clip (idempotent / in-flight lock).

**AC-02.3** Given the result is a card **or** a refuse, When the call completes, Then that outcome counts as **one read** against Lite or Plus (refuse consumes the unit).

### US-03 Refuse-first before any state/action card — Must

**AC-03.1** Given a clip is submitted, When the safety / confidence gate has not yet passed, Then **no** state chip, emotion label, or action card is shown.

**AC-03.2** Given the gate refuses, When the UI renders, Then the owner sees the refuse / escalate path only — not a “here’s what we would have said” preview.

**AC-03.3** Given the gate passes, When the card renders, Then it appears only after the refuse-first step.

### US-04 Bite-risk / kids-in-frame / low-confidence refuse (quota cannot skip) — Must

**AC-04.1** Given freeze / whale-eye / hard stare / resource-guard / snap-bite-risk cues **or** kids-in-frame **or** confidence below the floor, When the gate runs, Then the product **refuses** (no action card).

**AC-04.2** Given Plus remaining reads = 0 or the owner is on the last included read, When a bite-risk / kids / low-confidence case arrives, Then the refuse **still runs**. The quota **cannot** skip the gate to save a credit.

**AC-04.3** Given a refuse fires, When quota is updated, Then the safety path still consumed a read (or an explicit “safety read” that is not skipped). No “free refuse that bypasses the meter” that hides a skipped gate.

**AC-04.4** Given kids-in-frame, When refuse fires, Then the clip is not retained as a scorable training asset; no child identity / face template is stored (purpose = child-present yes/no only).

**Eval note (CTO later):** the *accuracy* of the bite-risk / kids / floor detector is US-12 / K1. These AC specify product behavior **when the gate fires**, not that Flash is proven safe.

### US-05 Card: signals + confidence + 1–3 next-60s actions + stop-rule — Must

**AC-05.1** Given refuse-first passed, When the card is shown, Then it contains: observable signals, a confidence indication, **1–3** next-60-second actions, and a stop-rule / escalate line.

**AC-05.2** Given the card is shown, When the owner inspects it, Then it does **not** contain a cartoon quote, “what the dog is thinking,” or a translator sticker as the core content.

**AC-05.3** Given more than 3 actions could be generated, When the card renders, Then at most 3 actions are shown.

### US-06 Banned claims — Must

**AC-06.1** Given any UI, paywall, store listing, or card, When copy is rendered, Then it does **not** include “relaxed,” “safe,” “won’t bite,” “translator,” or a veterinary diagnosis / disease name / drug.

**AC-06.2** Given a test string list of banned tokens (relaxed / safe to approach / won’t bite / translator / your dog has [condition]), When a release build is scanned, Then those strings are absent from user-visible surfaces (or only appear in this ban list / legal “we do not say”).

**AC-06.3** Given a footer disclaimer exists, When a state chip would have said “relaxed/safe,” Then the chip is still forbidden — a disclaimer does not cure it.

### US-07 Lite: 3–5 cheap-model reads; first read completes a real scare — Must

**AC-07.1** Given a new Lite user, When they have used 0 reads, Then they can complete **one** full scare path: clip → refuse-first → card **or** refuse → stop-rule, without a paywall mid-moment.

**AC-07.2** Given Lite remaining reads in {3,4,5} as configured, When they exhaust them, Then further reads require Plus or wait — they do not silently get Flash-unlimited.

**AC-07.3** Given a Lite read hits bite-risk / kids / low-confidence, When the gate runs, Then Lite **refuses** the same as Plus. Safety does not downgrade on the cheap model.

**AC-07.4** Given the first Lite scare is in progress, When a paywall or “upgrade to see the answer” would interrupt, Then it does **not** fire until the scare path has completed.

### US-08 Plus: 60 Flash/mo + credits; $12/mo / $99/yr — Must

**AC-08.1** Given Plus is purchased, When the store / paywall shows the SKU, Then the listed prices are **$12.00/mo** and **$99/yr** — never **$9.99**.

**AC-08.2** Given an active Plus month, When included reads are counted, Then the grant is **60** Flash-class cloud reads (not 40). Credits apply after 60.

**AC-08.3** Given the A+C test is withdrawn (strategy: test fails → paywall withdrawn), When product is told to withdraw Plus, Then Plus is not sold as curriculum (form B) at the same SKU.

**AC-08.4** Given envelope prices $9 / $11 / $13 / $79 exist as sensitivities, When the *published* v1 SKU is asserted, Then working published SKU remains $12 / $99 until CFO/CEO change it.

### US-09 Paywall disclose: 60 + refuse-cannot-skip + no unlimited — Must

**AC-09.1** Given the paywall and the App Store listing, When the owner reads what’s included, Then all three are explicit: **60 included Flash reads / then credits**; a read is a moment **or** a refuse; quota **cannot skip** bite-risk refuse.

**AC-09.2** Given paywall / listing / IAP name, When copy is rendered, Then it does **not** say unlimited, “what serious apps do,” Unlimited, or Translator Pro.

**AC-09.3** Given paywall hero, When shown, Then it leads harm-per-wrong-fire (holding: “Sixty honest reads. A hard stop when the next right thing is to stop.” / “See the signal. Do the next right thing — and know when to stop.”) not “unlimited?”

### US-10 Escalate-don’t-diagnose (vet/trainer) — Must

**AC-10.1** Given a medical-looking or bite-risk refuse, When the escalate screen shows, Then it tells the owner to stop / create space and contact a veterinarian (and DACVB / certified professional as appropriate) — and states Telltail is not a diagnosis and does not replace a vet or trainer.

**AC-10.2** Given that screen, When inspected, Then it does not name a disease, name a drug, or say “your dog has anxiety/pain.”

### US-11 Media: video leaves phone; never claim on-device — Must

**AC-11.1** Given camera / upload permission, When the purpose string and in-app notice are shown, Then they state the clip **leaves the device** for a cloud vision model.

**AC-11.2** Given any marketing, store, or in-app claim, When searched, Then there is **no** “on-device,” “on your phone only,” or “never uploaded” claim for the read path.

**AC-11.3** Given a third-party model call, When the read runs, Then it is the locked stack: one Flash-class **cloud** multimodal call (not Como-style on-device keypoints).

### US-12 K1: Flash-refuse fail kills Plus; retry Flash; no frontier cascade as happy path — Must

**AC-12.1** Given a retry is needed, When the first retry runs, Then it is **Flash-class** — not Opus/Sol as the happy path.

**AC-12.2** Given product configuration, When a reviewer inspects the default path, Then frontier is **cascade-only / not an entitlement**, not 60× frontier.

**AC-12.3** Given the Flash-refuse **eval** (CTO later) concludes Flash cannot hold a confidence floor, When that result is recorded, Then Plus is **killed** (K1) — not patched with a prompt bake-off, not rescued by 60× frontier.

**AC-12.4 (eval must eventually satisfy — not run here)** The Flash-refuse eval must show that a false-confident “proceed / relaxed-equivalent” does **not** ship on bite-risk cues. Until the eval exists, US-03/US-04 behavior is specified; **safety of the detector is a gap**.

### US-13 Credit overflow $8–12/20 (seed, not lock) — Should

**AC-13.1** Given Plus included 60 are exhausted, When credits are offered, Then they are overflow Flash-class reads — not a refuse bypass, not a third plan on the first paywall.

**AC-13.2** Given credits ship, When the pack is shown, Then the working seed is **$8–12 / 20 [A]** — exact dollar is **not locked**. AC checks *shape* (20 Flash reads, no gate skip), not a frozen price.

**Gap:** exact pack price is OPEN (CFO seed). Do not fail a build for $10 vs $8.

### US-14 After-action upload if live-film fails — Should

**AC-14.1** Given camera capture fails, is denied, or the owner missed the live second (A1 risk), When they choose upload, Then they can submit a just-taken clip from Photos and receive the same refuse-first → card-or-refuse path.

**AC-14.2** Given an upload, When the read runs, Then US-02–US-06 still apply (one cloud call; refuse-first; banned claims).

**Gap:** A1 remains OPEN — upload is the fallback *capability*, not proof they will film live.

### US-15 Named training voice (OPEN — A5) — Should — **GAP**

**Gap-15:** No testable AC for a *named* voice until the founder names it. Inventing a school or person is forbidden.

**AC-15.1 (placeholder, blocked)** Given A5 is still OPEN, When public claims / store / cards render in explore, Then the product does **not** ship an anonymous “PetGPT” / fake named expert as if A5 were closed.

**AC-15.2 (blocked on A5)** Once a voice is named, AC will require that method library and on-card attribution match that voice and stay reward-based / no aversives. **Cannot write the name or school now.**

### US-16 History of prior reads / moment log — Should

**AC-16.1** Given the owner has completed reads, When they open history, Then they see prior moments (card or refuse) they can reopen.

**AC-16.2** Given history exists, When a trainer-share is considered, Then it is **off by default**, separate consent, not a v1 marketplace.

**AC-16.3** Given a kids-in-frame refuse, When history is shown, Then raw frames with a child are not the default retained object (align US-04.4).

---

## 2. Traceability

| US-ID | Pri | Strategy lock / thesis | Persona | Business-model unit |
|-------|-----|------------------------|---------|---------------------|
| US-01 | Must | Missed training moments; A+C *test* needs a clip | P0/P1 | Trigger for **one read** |
| US-02 | Must | One multimodal LLM call / Flash-class cloud | P0 | **One read** = one cloud call |
| US-03 | Must | Refuse-first *in front of* the card; A gated by C test | P0 | Read outcome may be refuse |
| US-04 | Must | Quota cannot skip bite-risk refuse; kids-in-frame | P0 + household | Refuse still consumes safety path |
| US-05 | Must | Offer: signals + confidence + 1–3 actions + stop | P0 | Successful read → card |
| US-06 | Must | Never relaxed/safe/won’t bite; no translator; no diagnose | All | Claims / price surfaces |
| US-07 | Must | First Lite scare completes; Lite 3–5 | P0 trial | **One Lite user / mo** |
| US-08 | Must | Plus 60 Flash + credits; $12 / $99; never $9.99 | P0 paying | **One Plus month** |
| US-09 | Must | Disclose 60 + no-skip + no unlimited; meter = our COGS+safety | P0 shopper | Paywall / listing |
| US-10 | Must | Escalate-don’t-diagnose | P0/P1 | Refuse / medical path |
| US-11 | Must | Cloud vision; never on-device claim | All | Stack / privacy notice |
| US-12 | Must | **K1** Flash-refuse fail kills Plus; retry Flash first | Company | Named kill; no frontier happy path |
| US-13 | Should | Credits $8–12/20 seed | Plus overage | **One credit pack** |
| US-14 | Should | If A1 fails, after-action upload | P0 | Same **one read** unit |
| US-15 | Should | A5 named voice before public claims | Brand | **GAP** — not a SKU |
| US-16 | Should | Light history; trainer share later | P0 / P2 channel | Retention / consent |

---

## 3. NFRs

| ID | Area | Requirement | Testable? |
|----|------|-------------|-----------|
| NFR-S1 | Safety | Refuse-first before any state/action card (US-03/04) | Yes — UI order |
| NFR-S2 | Safety | Banned tokens never ship (US-06) | Yes — string scan |
| NFR-S3 | Safety | K1: no Plus if Flash-refuse eval fails | Yes — release gate (eval not run this phase) |
| NFR-P1 | Privacy | Clip **leaves the phone**; purpose string says so (US-11) | Yes — copy + network |
| NFR-P2 | Privacy | Kids-in-frame: no identity template; no default retain of child frames (US-04/16) | Yes — storage rules |
| NFR-P3 | Privacy | No training foundation models on user video without express opt-in | Yes — config / ToS |
| NFR-L1 | Latency | Time-to-card/refuse is **unknown** until CTO measures a real clip. Do **not** invent a 2s SLA. | Gap — measure later |
| NFR-C1 | Claims | Holding line + paywall hero as specified; no vs-vet %; no translator ASO | Yes — copy review |
| NFR-C2 | App Store | Category **Lifestyle + Education**. Never Entertainment / translator subtitle | Yes — ASC listing |
| NFR-C3 | Meter honesty | 60 + credits + refuse-cannot-skip + no unlimited on paywall and listing (US-09) | Yes — copy |
| NFR-A1 | Aversives | No e-collar / prong / choke / leash-pop protocol generation (AVSAB) | Yes — output filter |
| NFR-I1 | Identity | Not Blacksage / Sieger; do not buy telltail.com | Process, not a build test |

---

## 4. Operator decision register (blocking only)

Do not invent answers. Do not re-ask locked ids (name, stack, trainer-not-toy, 4B, $12 presentation, 60-read, never $9.99).

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

Already locked — do not re-ask: Telltail name; 60 Flash; $12/$99 working SKU; never $9.99; quota cannot skip refuse; A+C is a *test*; 4B closed; explore only.

---

## 5. Business rules

| ID | Rule |
|----|------|
| BR-1 | Quota **cannot** skip a bite-risk / kids / low-confidence refuse to save a credit. |
| BR-2 | A refuse / hard-stop **consumes** the safety path (counts as the read unit). |
| BR-3 | Lite safety **does not downgrade**. Cheap model still refuses. |
| BR-4 | **One** Flash-class **cloud** multimodal call per read. |
| BR-5 | **K1:** Flash-refuse eval fail **kills Plus**. First retry is Flash. Frontier is not the happy path. |
| BR-6 | First Lite scare **must complete** (no mid-moment paywall). |
| BR-7 | Published Plus SKU **$12/mo / $99/yr**. Never **$9.99**. Envelope $9–13 / $79–99 is sensitivity, not the listing. |
| BR-8 | If the A+C **test** fails, **withdraw the paywall**. Do not sell form B at the same SKU. |
| BR-9 | No unlimited claims. Disclose 60 + credits + refuse-cannot-skip. |
| BR-10 | Never “relaxed / safe / won’t bite”; never translator; never diagnose. |
| BR-11 | Video leaves the phone. Never claim on-device. |
| BR-12 | Reward-based only. No aversive protocols. |
| BR-13 | Explore only. Nobody is building. Nothing in the App Store this phase. |

---

## 6. FR vs NFR split

**Functional (behavior the owner can observe):** US-01 capture/upload; US-02 one read call; US-03 gate-before-card; US-04 refuse cases + quota; US-05 card shape; US-07 Lite complete-scare; US-08 meter count + SKU; US-10 escalate copy; US-13 credits shape; US-14 Photos fallback; US-16 history.

**Non-functional (quality / constraint):** US-06 claims language; US-09 disclosure honesty; US-11 media leaving phone / no on-device claim; US-12 K1 release gate + retry policy; NFR-L1 latency unknown; NFR-C2 store category; NFR-A1 aversives filter; NFR-P* privacy.

**Business rules** (BR-*) constrain both. They are not user stories.

---

## 7. Quality-check + ambiguity

**Quality-check (this slice)**
- [x] Every Must has AC or a labeled gap — all Musts have AC.
- [x] Every Should has AC or a labeled gap — US-15 is the gap.
- [x] AC are observable (UI, quota, copy scan, SKU, call count).
- [x] Failure modes: cancel capture, permission denied, last-read refuse, Lite mid-moment paywall, frontier-as-happy-path.
- [x] No invented named voice, WTP, latency SLA, or TAM.
- [x] Shared IDs used; no competing Must IDs.

**Ambiguity hunter**
| Segment | Why ambiguous | Tightening |
|---------|---------------|------------|
| “Real scare” (US-07) | Not a clinical definition | AC = complete path clip → gate → card or refuse → stop-rule, no mid-paywall |
| “Confidence floor” | Numeric threshold unknown | Product behavior specified; **number is CTO eval** — do not invent 0.8 |
| “Safety read consumes quota” | Could mean always −1 or only when model ran | BR-2: refuse consumes the safety path; do not skip the *gate* to save a credit. Exact −1 vs “gate always runs” is an implementation note for HoP/PM — **do not skip the gate** is the lock |
| “Live scare” vs upload | A1 OPEN | US-01 = live capture capability; US-14 = fallback |
| “$8–12/20” | Range | Shape locked; dollar not locked (US-13) |
| Latency | “Next 60 seconds” is the *advice horizon*, not a 60s SLA | NFR-L1 unknown |

---

## Decisions

- Shared US-01–US-16 used. No competing Must IDs.
- US-15 = gap (A5 OPEN). US-12 eval AC specified, not designed/run.
- A+C remains a **test**; paywall withdraws if the test fails (AC-08.3, BR-8).
- Latency not faked. GoodPup not revived. Dogs Trust not exported.
- `05-prd.md` not written. PM file not written. Phase not marked complete.

## Asks for manager (`ask_manager`)

- Peer help needed: none
- Clarification needed: none (A1/A3/A4/A5/A10 already on the register)

## Risks / blockers

- **K1 / E1** Flash-refuse untested — Plus is contingent.
- **A1** film-live untested — moment coach may degrade to US-14.
- **A4** WTP vs unlimited Gemini — US-09 copy is the control, not a close.
- **A5** blocks a real named-voice AC (US-15).
- **NFR-L1** no latency target — do not promise “real-time” in the PRD.

## Packs used

| Pack | Decision tied to pack |
|------|------------------------|
| `skills/community/business-analysis-skills/skills/requirements-elicitation/` | Elicited FR/NFR from 03-strategy + 04-business-model against locked US-IDs; no new Must IDs. |
| `skills/community/business-analysis-skills/skills/acceptance-criteria-writer/` | Given/When/Then for US-01–14 and US-16; negatives for quota-skip, mid-Lite paywall, banned tokens. |
| `skills/community/business-analysis-skills/skills/requirements-traceability-starter/` | US-ID → strategy lock / persona / unit (read, Plus month, credit pack, Lite user). |
| `skills/community/business-analysis-skills/skills/functional-vs-nonfunctional-splitter/` | Split in §6; claims/privacy/K1/store treated as NFR, capture/card/meter as FR. |
| `skills/community/business-analysis-skills/skills/requirements-quality-check/` | Coverage checklist; US-15 gap explicit; no fake test for unnamed voice. |
| `skills/community/business-analysis-skills/skills/ambiguity-hunter/` | “Real scare,” confidence floor, latency, live vs upload flagged; no invented SLA. |
| `skills/community/awesome-claude-corporate-skills/09-product-management/prd-writer/` | PRD-shaped AC/NFR/rules written **in this handoff** so HoP can merge; `05-prd.md` not authored here. |
| `skills/community/business-analysis-skills/skills/requirements-packager/` | Single handoff package: AC + trace + NFR + BR + register. |

## Do not

- Mark the phase complete
- Write `05-prd.md` or `HANDOFFS/5-product-manager.md`
- Spawn
- Invent competing story IDs
- Design or run the Flash-refuse eval
- Invent operator facts (voice, WTP, film-live, latency SLA)
- Copy artifacts to OneDrive / iCloud / Google Drive
- Flatten A+C from test into a launch lock
- Publish $9.99 or “unlimited”
- Claim on-device vision

Phase 5 not complete. Explore only. Nobody is building.
