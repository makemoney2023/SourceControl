---
phase: "2"
venture: telltail
owner: market-research-analyst
reports_to: head-of-research
status: ic-complete-pending-merge
llm_tier: strong-general
llm_model: grok-4.5
generation_profile: none
generation_used: none
fallback_applied: false
tool_status:
  parallel-research: available
  parallel-cli: oauth_ok
  firecrawl: unavailable
date: 2026-08-21
---

# 02 — Market research — Telltail

**Venture:** Telltail (`telltail`) · Velocity Agency · standalone consumer app  
**Not:** Blacksage Kennels · not Sieger Show Secretary  
**Lease:** full file except competitor deep-dive / profile table (CIA owns that)  
**Framing file:** `01-problem-framing.md` is **missing**. Founder locks used instead of invented framing.  
**Access date for all new fetches:** 2026-08-21 unless noted.

Label key: **[F]** fact · **[I]** inference · **[A]** assumption

Founder locks (do not re-ask) **[A unless noted as packet fact]:**

- Product is an AI dog **trainer / training tool**, not a toy or translator.
- Problem to test = **missed training moments**.
- Framing to test = **moment coach gated by refuse-first**.
- Plus = **60 Flash-class reads/mo + credits**; quota cannot skip bite-risk refuse.
- Stack = multimodal LLM read per clip (Flash-class), **not** a custom pose detector.
- ICP seed: P0 first-time/anxious owners; P1 reactive/adolescent; trainers = channel not v1 buyer.

**Load-bearing question (labeled, not answered):** can a Flash-class multimodal **refuse safely**? See §Science risk.

**No TAM, CAGR, download totals, or search volumes invented.** Missing numbers are written **not disclosed**.

---

## Executive summary

Telltail is aiming at a **job that is already paid in other forms** (human coaches, curriculum apps, 24/7 chat, YouTube, ChatGPT) and a **form that is not yet a proven paid category**: phone-camera clip → Flash-class multimodal read → 1–3 actions for the next ~60 seconds, refuse-first on bite-risk. **[I]**

The **instruction job** is independently evidenced. UK Dogs Trust National Dog Survey 2024 (373,216 owners / 430,406 dogs) shows owners over-confident on body language, already Googling “what do I do,” and almost never in class. **[F]** That survey is **UK**. It is the best competence survey we have. **Do not export 80/24 to US/CA as fact.** **[F]**

The **US/CA opportunity is a household count, not a market size.** AVMA 2025 Sourcebook (public table, accessed 2026-08-21): **42.6%** of U.S. households own dogs (**56.3 million** households; **87.3 million** dogs). **[F]** APPA 2025 NPOS (cited on APPA’s industry-trends page): **95 million** U.S. households own *a pet* (all species). **[F]** APPA also publishes **$158 billion** 2024 U.S. pet spend; training is buried inside a **$14.3 billion** “Other Services” bucket with boarding, grooming, insurance, sitting, and walking — **training spend: not disclosed.** **[F]** None of these figures is Telltail TAM/SAM/SOM.

**Trainer-job neighbors (qualitative substitutes, not TAM):** Pupford (curriculum + “Ask Doris” AI), Zigzag (puppy programme + 24/7 coach/AI), GoodPup as described in a 2023 Rover test ($34/week + 24/7 chat — **goodpup.com now redirects to Rover’s trainer marketplace**, 2026-08-21), ChatGPT-as-budget-trainer (Jessica Logan client quote), YouTube/Kikopup (Emily Larlham, ~439–441k subscribers). **[F]** These already sell *moment help*. Telltail’s only structural difference vs that set is the **camera**. **[I]**

**Load-bearing science risk remains open.** Martvel, Zamansky, Shimshoni & Bremhorst, *Scientific Reports* 21 Nov 2025: zero-shot GPT/Gemini/LLaVA look moderate on layperson-labeled web photos; performance **drops to near chance** on experimentally elicited Labrador faces; **backgrounds drive labels**. Authors: current LVLMs “are not yet suitable for reliable, biologically grounded recognition of canine emotions”; misleading feedback could “foster false confidence.” **[F]** This seat **does not invent an answer** to “can Flash refuse safely?” The product lock (refuse-first; quota cannot skip bite-risk refuse) is a **policy**, not an evidence result. **[A]**

**Implication for HoR merge:** proceed in explore on the **job**; do not treat vision-app capture of that job as evidenced demand. Claims language cannot be “we read your dog” on this stack. **[I]** Competitive profiles stay with CIA.

---

## Primary and secondary segments

| Priority | Segment | Who | Why this seat | Evidence | Label |
|----------|---------|-----|---------------|----------|-------|
| **P0** | First-time / anxious owners | New puppy or first adult dog; sleep-deprived; “is this normal?”; high shame if they get it wrong | Founder lock. Zigzag’s 2025 impact page: **58%** of support conversations cluster on 10 predictable challenges (biting, toilet, crate, sleep, separation, barking, loose lead, feeding, owner confidence, non-urgent health). **[F]** Logan: a new-puppy client chose ChatGPT “on a budget.” **[F]** | High that the *job* exists; **low** that they will film a live incident | P0 = **[A]** intake; job evidence **[F]** |
| **P1** | Reactive / adolescent owners | Dog 6–24 months; barking at door, other dogs, strangers; “I missed the window” | Dogs Trust 2024 (UK): 33% of dogs reaching adolescence (pandemic-pup aftermath, **UK**); 52% bark at outside noises; 17% rarely stay calm around other dogs; 16% around strangers. **[F]** US/CA equivalent **not disclosed.** | Medium that the pain is real in UK; **not evidenced** as US rates | P1 = **[A]** intake |
| **P2** | Trainers | Force-free / LIMA trainers who might recommend an app | Founder lock: **channel, not v1 buyer.** AVSAB 2021: refer only reward-based; aversives out. **[F]** | High that trainers will tax gimmick/translator apps (Kinship/Traini). **[F]** | P2 = **[A]** |
| **P3** | Shelters / rescue later | Relinquishment prevention | Zigzag mission/impact copy ties early support to fewer relinquishments (company claim). **[F]** company-reported | Out of v1 | **[A]** later |
| **Out** | Show / kennel ops | Blacksage, Sieger | Different buyer, liability, brand | Intake | **[F]** lock |

**Who pays v1:** B2C owner. **[A]**  
**Geo v1:** EN US/CA (intake). **[A]** Best competence survey is UK — treat US overconfidence as **unknown**, not 80/24. **[F]**

**US household context (not TAM). [F]** AVMA 2025 public table (survey n=7,519, early spring 2025, weighted to Census):

| Statistic | Dogs |
|-----------|------|
| % of U.S. households owning | 42.6% |
| Households owning | 56.3 million |
| Dogs in the U.S. | 87.3 million |
| Avg per dog-owning household | 1.6 |
| Avg vet spend / household / year | $598 |

Source: https://www.avma.org/resources-tools/reports-statistics/us-pet-ownership-statistics (accessed 2026-08-21). **Share who are first-time, anxious, or reactive: not disclosed.** **Willingness-to-pay for a camera coach: not disclosed.**

APPA 2025 NPOS: 95 million U.S. households own a pet (all species). **[F]** https://americanpetproducts.org/industry-trends-and-stats (accessed 2026-08-21). **Dog-only first-time share: not disclosed.** $158B 2024 pet spend is **industry expenditure, not Telltail TAM.** Training $ inside Other Services: **not disclosed.**

---

## Buyer avatars

Built with `avatar-extraction`. **Interviews: 0.** Personas are **provisional proxies** (customer-research Mode 2). Replace with first-party evidence. Customer-research minimum (5–10 independent data points per segment) is **not met for US P0/P1 voice**; UK survey + substitute product copy + one trainer anecdote are the proxies.

### Primary avatar — P0 “first-week panic” (provisional)

**Description.** Adult in US/CA who just brought home a puppy or first adult dog. Phone is already the help desk. They are not shopping “AI dog translator.” They are googling *what do I do when he bites my hands* at 11pm. **[I]** from Zigzag FAQ cluster + Logan.

**Current situation.** Sleep-deprived. Unsure what is normal. 24/7 substitutes already exist as *text and video curriculum* (Zigzag, Pupford Ask Doris, ChatGPT, Kikopup). **[F]** The camera is extra friction. **[I]**

**Pain points.**

1. Missed moments: the jump/guard/snap already happened; they do not know the next 60 seconds. **[A]** founder problem lock.
2. Overconfidence vs skill — evidenced **in UK**, not US: 80% confident reading body language; 24% consistently identified a worried dog; 76% missed an appeasement roll as “belly rub”; owners who *strongly* agreed they were confident were *less* likely to be correct. **[F]** Dogs Trust NDS 2024 PDF. **Do not treat as US rates.**
3. Shame + budget: “I’ll use ChatGPT for now. I’m on a budget.” **[F]** Logan, accessed 2026-08-21.
4. Fear of making it worse / bite in the home. AVMA: any dog can bite; about half of bite victims are children; never leave a baby or small child alone with a dog. **[F]**

**Desired outcome.** One doable next step, in their kitchen, that does not require booking a class. Feel like a competent owner, not a bad one. Know when to **stop** and call a vet/behaviorist. **[I]**

**Failed attempts (proxies).**

- Google / YouTube (Kikopup is the quality pole of free video; 439k–441k subscribers, Emily Larlham). **[F]**
- ChatGPT (Logan client). **[F]**
- Curriculum app (Zigzag / Pupford). Pupford page: “Ask Doris, our AI dog trainer.” Testimonial: “like having a little personal dog trainer in my pocket 24/7.” **[F]** company page, 2026-08-21. “2+ million Pup Parents” = **marketing, unused as volume**.
- In-person class later — Dogs Trust UK: only ~6.5–7% currently in class; 56% skip because they can “manage alone”; 49% because training is “common sense.” **[F]** UK only.

**Emotional drivers.** Anxiety, embarrassment, love of the dog, fear of a bite involving a child or visitor, desire for control without becoming “the aversive person.” **[I]**

### Secondary avatar — P1 reactive / adolescent (provisional)

**Description.** Owner of a 6–24 month dog whose “cute puppy” problems (door barking, other dogs, strangers) got louder. They missed early socialisation (UK pandemic-pup story is documented; **US equivalent not disclosed**). **[F]/[A]**

**Pain.** Live incidents are fast. Phone is often in a pocket. **Will they film during a reactive episode? Unknown — evidence gap E2.** **[A]**

**Desired outcome.** Safety first (space, management), not a sticker that says “relaxed.” Escalate to a credentialed trainer / veterinary behaviorist when it is bite-risk. **[I]** aligned with AVSAB referral language. **[F]**

### P2 trainers — channel, not buyer

They evaluate apps on **method** (reward-based vs aversive junk) and **honesty** (does it overclaim?). Kinship/Adopt-a-Pet Traini critique (same Eloise article, 16 Apr 2026) is the public tax on translator apps. **[F]** Do not position Telltail where trainers will screenshot it as a toy.

---

## Jobs to be done

| Job type | Job | When | Current substitutes | Label |
|----------|-----|------|---------------------|-------|
| **Functional (core)** | In *this* moment, tell me what to do next (and what *not* to do) so I do not make the dog worse | Live jump / mouth / freeze / growl / visitor | Zigzag 24/7 coach, Pupford Ask Doris, GoodPup-style chat (2023), ChatGPT, Kikopup video, Google, in-person trainer | Functional job **[A]** lock; substitutes **[F]** |
| **Functional (safety)** | Know when to stop, crate/separate, and call a vet or behaviorist | Bite-risk, pain, kids in frame | PetSignalAI-class escalate language (CIA); AVMA “talk to your veterinarian”; AVSAB refer-out | **[F]** standards; product form **[A]** |
| **Emotional** | Feel like a competent, kind owner — not cruel, not clueless | After a scare | Classes, coaches, “positive” brand apps | **[I]** |
| **Social** | Not be the household that “let the dog get like this”; not look reckless with kids/visitors | Kids, guests, neighbors | Training class as social proof (UK: 63% agree classes are fun; <7% attend) **[F]** UK | **[I]** |
| **Anti-job** | Do **not** “translate” the dog into a quote / sticker | Entertainment itch | BowLingual 2002 → 2026 Entertainment “AI Dog Translator” cluster (Phase 0; CIA) | **[F]** lineage; anti-job = founder **[A]** |

Zigzag (company, June 2026): 58% of support conversations = 10 predictable puppy challenges. That is a **curriculum + chat** capture of the moment job, without a camera. **[F]** company-reported mix.

Logan on where text-AI helps: normal puppy behavior, routines, enrichment, overstimulation, bite inhibition, gentle approaches. Where it fails: **it cannot see the dog** (pain, gait, muscle tone). **[F]** Telltail’s camera is meant to close that gap. Sci Rep says general LVLMs do **not** currently close it on elicited faces. **[F]** So the camera can be a **liability** if it is wrong. **[I]**

---

## Evaluation criteria

What a P0/P1 owner (and a referring trainer) uses to say yes/no. Ranked from evidence, not a survey.

| # | Criterion | Why it matters | Evidence | Label |
|---|-----------|----------------|----------|-------|
| 1 | **Safety / refuse** | False “relaxed” on bite-risk is the failure mode trainers already attack | Sci Rep 2025; Kinship Traini; AVMA any-dog-can-bite; Dogs Trust 78% “my dog would never bite me” (**UK**) | **[F]** |
| 2 | **Doable next step** | They are not buying a lecture; Zigzag sells “pawnic” 24/7 help; Pupford sells instant Doris | Zigzag + Pupford pages 2026-08-21 | **[F]** copy; **[I]** that Telltail must beat *text* help |
| 3 | **Method (reward-based)** | AVSAB 2021: only reward-based; aversives (shock, prong, alpha roll, flooding) out | AVSAB PDF | **[F]** |
| 4 | **Not a toy** | Default ASO word is “translator”; trainers already tax that frame | Kinship/Adopt-a-Pet; Entertainment listings (CIA) | **[F]** |
| 5 | **Price vs human moment-help** | GoodPup 2023 Rover test: **$34/week** + 24/7 chat. Zigzag homepage 2026-08-21: public price **not disclosed** (freemium since 2025, company). Play review anecdotally $10/mo — **not a company page.** Pupford public price on opened page: **not disclosed.** Plus lock $9–13 / 60 Flash reads is a **packaging lock**, not WTP. | Rover 2023; this pass | **[F]** / **[A]** |
| 6 | **Friction of filming** | If they will not raise the phone during the incident, the camera job dies | No interviews. Gap. | **[A]** |
| 7 | **Who is the voice** | Founder-only, still open. Substitutes brand a named trainer (Zak George/Pupford; Emily Larlham/Kikopup) or “Puppy Coach.” | Product pages | **[F]** pattern; Telltail voice **[A]** unknown |

---

## Category and standards context

Telltail sits at a **three-way collision**, not in a named SIC/NAICS “AI dog trainer” category with public size.

1. **Instruction / coaching apps (trainer job).** Pupford, Zigzag, (historical) GoodPup, Dogo/Puppr-class curriculum apps. Human or text-AI. **No camera required.** **[F]**
2. **Vision “translator / emotion” apps (toy job).** 24-year lineage from Takara BowLingual (BBC 27 Sep 2002) to 2026 Entertainment-category clones. CIA owns the set. **[F]**
3. **Professional standard of care.** What a *responsible* instruction product is allowed to say.

**Standards this product must not violate (cited):**

- **AVSAB Position Statement on Humane Dog Training (2021).** “Based on current scientific evidence, AVSAB recommends that only reward-based training methods are used for all dog training, including the treatment of behavior problems.” Aversives (force, pain, emotional or physical discomfort) “should not be used.” Tools to avoid: choke/prong/shock, squirt/shaker cans, shouting, alpha rolls, leash jerks, flooding. Aggression is **not** an exception; refer to veterinarian / veterinary behaviorist / CAAB. **[F]** https://avsab.org/wp-content/uploads/2021/08/AVSAB-Humane-Dog-Training-Position-Statement-2021.pdf (accessed 2026-08-21).
- **IAABC LIMA** (Least Intrusive, Minimally Aversive) + humane hierarchy: wellness/pain first; effectiveness is not enough; punishment last. **[F]** https://iaabc.org/en/lima (search pass 2026-08-21).
- **AVMA dog-bite prevention.** Any dog can bite; millions of people bitten per year in the U.S.; about half of victims are children; never leave a baby or small child alone with a dog; learn warning signs; positive training and socialization. Exact U.S. annual bite count on the AVMA prevention page opened this pass: **not disclosed** (page says “millions” / “hundreds of thousands seek medical attention”). **[F]** https://www.avma.org/resources-tools/pet-owners/dog-bite-prevention (accessed 2026-08-21).
- **Veterinary line.** Pain and illness change bite risk (Dogs Trust NDS 2024; AVMA). An app that outputs training steps on a painful dog is a claims/COO problem. **[F]**

**Category implication [I]:** if store copy, model output, or “tips” include aversive junk, Telltail fails the trainer-channel test and the AVSAB bar on day one. If copy says “we translate your dog,” it inherits the toy tax. Framing to test remains **moment coach + refuse-first**.

**PESTLE** (cited cells only; empty cells omitted). Five-forces skipped: no share, no disclosed rival revenue.

| Factor | Finding | Source | Label |
|--------|---------|--------|-------|
| **Political / public health** | National Dog Bite Prevention Week messaging (AVMA Apr 2026 PR): supervise children; warning signs are subtle; bites often look “harmless” (hug, interrupt eating). | AVMA PR 2026-04-13; avma.org/DogBitePrevention | **[F]** |
| **Economic** | Human moment-help is expensive relative to a $9–13 meter (GoodPup 2023 $34/wk). Curriculum apps compete at lower undisclosed/freemium prices. Training spend inside APPA Other Services: **not disclosed.** | Rover 2023; APPA 2026-08-21 | **[F]** |
| **Social** | UK: overconfidence + “my dog would never bite.” US rates: **not disclosed.** Zigzag: puppy challenges are predictable. | Dogs Trust 2024; Zigzag 2026 | **[F]** UK / company |
| **Technological** | Locked stack = Flash-class LVLM per clip. Sci Rep: near-chance on elicited faces; background shortcuts. Gemini is the disclosed backend on some vision apps (Phase 0 / CIA). | Martvel et al. 2025 | **[F]** |
| **Legal / claims** | Kids-in-frame; bite liability; “we read emotion” vs Sci Rep. COO lease. | Intake + AVMA | **[I]** for Telltail exposure |
| **Environmental** | — | not cited | omitted |

**Opportunities (cited).** (1) Instruction job is real and already paid without a camera. (2) AVSAB/AVMA create a trust standard vision toys ignore. (3) Refuse-first is the only claims-compatible stance on this stack.  
**Threats (cited).** (1) Sci Rep. (2) Gimmick tax. (3) Text substitutes may be “good enough” if the camera is wrong or unused. (4) Owners may not film live incidents.  
**Monitoring signals.** Flash refuse eval; US competence survey; whether GoodPup-class live chat stays a product or collapses into Rover marketplace; CIA install-pass on vision apps.

---

## Trust signals

What would make a P0 owner *and* a referring trainer believe this is not Traini-with-tips.

| Signal | Bar | Evidence it is the bar | Label |
|--------|-----|------------------------|-------|
| **Refuse-first on bite-risk** | Hard gate; quota cannot skip. Output “stop / separate / call a pro,” not a calmness score. | Sci Rep false-confidence warning; Kinship trainers (Easterbrook, Lawley-Rudd, Grossman); Dogs Trust 78% never-bite belief (**UK**) | **[F]** bar; product **[A]** |
| **No emotion sticker as the hero** | Lead with next action + uncertainty, not “happy/relaxed” | Martvel: background → happy/relaxed; clinic/bars → sad | **[F]** |
| **Reward-based only** | System prompt + reviewed tips; no shock/prong/alpha content | AVSAB 2021 | **[F]** |
| **Vet / DACVB / CAAB / CPDT escalate** | Explicit when medical, aggression, kids | AVSAB referral; AVMA “talk to your veterinarian”; CCPDT how-to-choose | **[F]** |
| **Kids** | Never unsupervised; if child in frame, refuse-to-coach + supervise | AVMA prevention page | **[F]** |
| **Method named** | Who is the training voice (founder-open) | Substitutes name trainers | **[I]** |
| **Honest limits** | “We can be wrong. This is not a diagnosis.” | Sci Rep + Kinship | **[I]** |

**Trust anti-signals:** Entertainment category; “translator”; calmness-0–100 without a refuse; unlimited vision at $9–13 (COGS/CFO lock). **[I]**

---

## Buyer journey

Hypothesis, labeled. No Telltail funnel data.

```
Trigger → cheap help → (maybe) camera app → paywall → keep / churn / escalate
```

| Stage | What they do | Substitutes already there | Telltail implication | Label |
|-------|--------------|---------------------------|----------------------|-------|
| **1. Trigger** | Puppy comes home; first jump/bite; first visitor; adolescent door-bark | Zigzag “pawnic”; Logan “exhausted and overwhelmed” | P0 trigger is puppyhood, not “I want AI vision” | **[F]** quotes; **[I]** |
| **2. Zero-cost help** | Google, YouTube (Kikopup), ChatGPT, friends | Kikopup ~440k subs **[F]**; Logan ChatGPT quote **[F]** | Camera app is *later* than YouTube/ChatGPT unless refuse/safety is the hook | **[I]** |
| **3. Cheap structured help** | Zigzag / Pupford free tier + AI chat (Doris) | Pupford Ask Doris; Zigzag freemium 2025 **[F]** company | Text AI already claims 24/7. Telltail must win on **seeing this dog now** — which Sci Rep undermines | **[I]** |
| **4. Paid human moment-help** | GoodPup-class $34/wk (2023); Rover in-person ~$90–$200/session (marketplace listing 2026-08-21, location-specific, **not a national ASP**) | Rover GoodPup review 2023; goodpup.com → Rover marketplace 2026-08-21 **[F]** | $9–13 meter is *cheap vs human*, not vs Doris/ChatGPT | **[I]** |
| **5. Class / behaviorist** | UK: <7% currently in class; 31–42% googled for a given problem | Dogs Trust 2024 **[F]** UK | App is a **bypass of class**, not a complement, unless trainer-channel works | **[I]** |
| **6. Camera-vision try** | Download a clip app | CIA set; public ratings on instruction-vision apps ~0 (Phase 0) | Demand for *this form* unproven | **[I]** from Phase 0 facts |
| **7. Keep / drop** | If the read feels wrong, or filming is awkward, they bounce to ChatGPT | Logan: AI cannot see the dog — Telltail claims it can; Sci Rep: it mostly cannot (on elicited faces) | Trust crash if false-relaxed | **[I]** |

**Critical unknown in the journey:** step 6 during a *live* incident (reactivity, guarding). If they only film calm posed dogs, Sci Rep’s background-shortcut problem is the product. **[I]**

---

## Science risk — load-bearing question (do not invent an answer)

**Question:** Can a Flash-class multimodal **refuse safely**?

**What is evidenced [F]** — Martvel, G., Zamansky, A., Shimshoni, I. & Bremhorst, A. (2025). “Investigating the capabilities of large vision language models in dog emotion recognition.” *Scientific Reports* 15:41250. Published 21 November 2025. https://doi.org/10.1038/s41598-025-25199-7 (accessed 2026-08-21).

- Models: GPT, Gemini, LLaVA family, zero-shot.
- DE (web, layperson labels): moderate accuracy; **background manipulations shift labels** (grass/sofa → happy/relaxed; clinic/bars → sad).
- LRc (experimentally elicited Labrador faces, cropped, anticipation vs frustration): **near chance**; GPT-4o classified **12/1000** images until forced (then 114). None of the models exceeded 0.6 accuracy on LRc.
- Specialised DINO-ViT on the same cropped-face set: **89%** (Boneh-Shitrit et al. 2022) — the signal is in the faces; general LVLMs are not using it.
- Prompt tricks (“Panel of Experts,” attach the Bremhorst PDF) raised response rate, **not accuracy**.
- Authors: “Our findings demonstrate that current LVLMs **are not yet suitable for reliable, biologically grounded recognition of canine emotions**.” Commercial pet-owner products: “misleading emotional feedback could **foster false confidence**.”

**What is not evidenced (do not fill):**

- A published refuse-eval of Flash-class video on bite-risk cues (hard stare, freeze, lip curl, growl, air snap) for consumer apps. **not disclosed / not found this pass.**
- That a policy layer (“if unsure, refuse”) is calibrated. Quota-cannot-skip-refuse is a **lock**, not a test result. **[A]**
- That Gemini-class video (Pawfessor/Tailo, CIA) is safer than the still-image Sci Rep setup. **not disclosed.**

**Seat verdict:** **OPEN.** Label **[A]** if anyone claims Flash can refuse safely. This is the constraint on claims, not a footnote.

---

## Qualitative substitutes (trainer job) — not a competitor table

CIA owns vision-app profiles. This list is **what the buyer already uses for the same job.**

| Substitute | Job sold (this pass) | Price on opened page | Notes |
|------------|----------------------|----------------------|-------|
| **Zigzag** | Puppyhood curriculum + 7-day expert support / 24/7 coaching + AI | Homepage **not disclosed**. Company: freemium since 2025. Play user review claimed $10/mo — **not used as list price.** | Company-reported 1.4M puppies / 300k+ coaching+AI interactions / 58% of chats = 10 challenges. **Marketing volumes, unused as TAM.** https://zigzag.dog/ https://zigzag.dog/blog/news/zigzag-impact-report-2025/ |
| **Pupford** | Free curriculum + **Ask Doris** AI trainer + Academy upsell | Public price on pupford.com/pupford-dog-training-app: **not disclosed.** “2+ million Pup Parents” = marketing. | Certified / 100% R+. Direct **text-AI moment** analogue. |
| **GoodPup** | 2023 Rover test: live 1:1 virtual, $34/week, 30-min weekly, 24/7 trainer+vet chat | 2023 **[F]**. **2026-08-21: https://www.goodpup.com/ redirects to Rover “Find Dog Training Near You”** (in-person listings ~$90–$200/session in the geo the extractor hit — **local, not national**). | Treat live GoodPup as **historical / possibly sunset**. Human moment-help **price analog still useful**. |
| **ChatGPT** | Budget knowledge translator | Free / Plus (OpenAI pricing not restated) | Logan client verbatim. Blind spot: cannot see the dog. |
| **YouTube / Kikopup** | Free force-free how-to | Free | Emily Larlham; ~439k–441k subscribers (YouTube, this pass). Search-time substitute for “what do I do.” |
| **In-person class / Rover trainer** | Observation the camera claims to replace | Rover marketplace session prices **local, not disclosed as a national ASP** | AVSAB: this is the correct escalate for aggression. |

---

## Implications for strategy

1. **Sell the job, not the model.** “What should I do in the next 60 seconds — and when to stop.” Do not sell emotion labels. **[I]**
2. **Refuse is the product.** On a Flash stack, competence *is* knowing when not to answer. If refuse is a toast message under a calmness score, Sci Rep + Kinship will write the launch review. **[I]**
3. **Do not export UK 80/24.** Use it as a **hypotheses for US interviews**, not as ICP math. **[F]**
4. **Beat Doris/ChatGPT, not BowLingual.** Text-AI already claims 24/7 pocket trainer. The camera is the only wedge and the main risk. **[I]**
5. **Meter vs humans is easy; meter vs free YouTube/ChatGPT is not.** $9–13 / 60 reads is a CFO lock, not a WTP finding. **[A]**
6. **Trainers are a channel filter.** AVSAB-clean outputs or they will torch it. **[I]**
7. **Filming during the incident is a product bet, not a fact.** Design for “I filmed the aftermath / a still” as well as live, or the job never happens. **[A]**
8. **No TAM in Phase 3.** Use AVMA household counts only as **universe**, with unknown first-time/reactive shares.

---

## Evidence gaps

| ID | Severity | Gap | Why it matters | Fix |
|----|----------|-----|----------------|-----|
| M1 | **high** | Flash refuse eval (false-relaxed on bite-risk) | Load-bearing Q unanswered | Product/CTO eval; do not ship claims ahead of it |
| M2 | **high** | Will P0/P1 film *during* a live missed moment? | Camera job dies if no | 8–12 owner interviews (anxious first-time + reactive) |
| M3 | **high** | US/CA body-language overconfidence | Best survey is UK | Find/commission US source; do not use 80/24 in US copy |
| M4 | **high** | `01-problem-framing.md` missing | This doc used founder locks | CEO |
| M5 | **medium** | WTP vs Doris/ChatGPT/Zigzag freemium | 60-read meter untested | Pricing test; not a desk number |
| M6 | **medium** | US first-time / reactive **share of 56.3M** | Cannot size SAM | not disclosed — do not invent |
| M7 | **medium** | GoodPup product status | Human-chat analog may have sunset into Rover | CIA / watch |
| M8 | **medium** | Reddit / Facebook owner voice | Customer-research Mode 2 thin | Logged-in pass or interviews |
| M9 | **low** | Training $ inside APPA Other Services | Tempting fake TAM | Leave **not disclosed** |

---

## Fact / inference / assumption

| Claim | Type |
|-------|------|
| AVMA 2025: 42.6% / 56.3M households / 87.3M dogs | **[F]** |
| APPA: 95M pet-owning households; $158B 2024 spend; training $ **not disclosed** | **[F]** |
| Dogs Trust NDS 2024 figures (80/24, 76% belly-rub miss, <7% in class, 78% never-bite, 31–42% internet) | **[F] UK only** |
| Martvel et al. 2025 LVLM results + “not yet suitable” + “false confidence” | **[F]** |
| AVSAB 2021 reward-based only | **[F]** |
| AVMA: any dog can bite; ~half of victims children; never leave child alone with dog | **[F]** |
| Zigzag 58% / 10 challenges; 300k coaching+AI (company) | **[F]** company-reported |
| Pupford Ask Doris copy | **[F]** |
| Logan ChatGPT quote | **[F]** |
| Kikopup ~440k subscribers | **[F]** this pass |
| GoodPup $34/wk | **[F]** Rover 2023; 2026 URL redirect **[F]** |
| P0/P1/P2 ICP | **[A]** founder lock |
| Moment-coach + refuse-first is the right frame | **[A]** lock to test |
| Flash can refuse safely | **[A] OPEN — do not treat as fact** |
| 60 reads/mo matches usage | **[A]** packaging |
| Owners will film live incidents | **[A]** untested |
| Camera is an advantage vs ChatGPT | **[I]** only if the read is competent; else liability |
| Vision-app paid demand for this form | **unproven** (CIA / Phase 0 ratings) |

---

## Sources index

Access 2026-08-21 unless dated. Title + URL.

| ID | Title | URL |
|----|-------|-----|
| M-S01 | Dogs Trust NDS 2024 PDF | https://www.dogstrust.org.uk/downloads/Dogs_Trust_NDS_Report_2024__.pdf |
| M-S02 | Dogs Trust NDS 2024 results | https://www.dogstrust.org.uk/about-us/what-we-do/professionals/research/national-dog-survey/results |
| M-S03 | Martvel et al. 2025 *Sci Rep* 15:41250 | https://doi.org/10.1038/s41598-025-25199-7 |
| M-S04 | Same paper, Nature HTML | https://www.nature.com/articles/s41598-025-25199-7 |
| M-S05 | AVMA U.S. pet ownership statistics (2025 table) | https://www.avma.org/resources-tools/reports-statistics/us-pet-ownership-statistics |
| M-S06 | AVMA Preventing dog bites | https://www.avma.org/resources-tools/pet-owners/dog-bite-prevention |
| M-S07 | AVMA National Dog Bite Prevention Week PR, 13 Apr 2026 | https://www.prnewswire.com/news-releases/national-dog-bite-prevention-week-april-1218-avma-emphasizes-protecting-children-through-education-and-supervision-302740647.html |
| M-S08 | APPA Industry Trends and Stats | https://americanpetproducts.org/industry-trends-and-stats |
| M-S09 | AVSAB Humane Dog Training Position Statement 2021 PDF | https://avsab.org/wp-content/uploads/2021/08/AVSAB-Humane-Dog-Training-Position-Statement-2021.pdf |
| M-S10 | IAABC LIMA | https://iaabc.org/en/lima |
| M-S11 | Zigzag homepage | https://zigzag.dog/ |
| M-S12 | Zigzag Impact Report 2025 (page) | https://zigzag.dog/blog/news/zigzag-impact-report-2025/ |
| M-S13 | Zigzag on Google Play | https://play.google.com/store/apps/details?id=nl.navara.zigzag&hl=en_GB |
| M-S14 | Pupford app page | https://pupford.com/pupford-dog-training-app |
| M-S15 | Pupford on Google Play | https://play.google.com/store/apps/details?id=com.pupford.pupford&hl=en_US |
| M-S16 | Rover GoodPup review (15 Aug 2023) | https://www.rover.com/blog/goodpup-review/ |
| M-S17 | goodpup.com (redirects to Rover trainers, 2026-08-21) | https://www.goodpup.com/ |
| M-S18 | Logan, “Can AI replace dog trainers?” | https://www.jessicalogan.ca/post/can-ai-replace-dog-trainers |
| M-S19 | Kikopup YouTube | https://www.youtube.com/channel/UC-qnqaajTk6bfs3UZuue6IQ |
| M-S20 | Kinship Traini critique (Eloise, 16 Apr 2026) | https://www.kinship.com/dog-lifestyle/can-traini-really-translate-your-dogs-emotions |
| M-S21 | Adopt-a-Pet (same article) | https://www.adoptapet.com/blog/lifestyle/can-traini-really-translate-your-dogs-emotions |
| M-S22 | BBC BowLingual, 27 Sep 2002 | http://news.bbc.co.uk/2/hi/business/2285509.stm |
| M-S23 | Phase 0 HoR brief (internal) | `docs/projects/telltail/business-idea/HANDOFFS/0-manager-head-of-research.md` |
| M-S24 | Intake | `docs/projects/telltail/business-idea/00-intake.md` |
| M-S25 | HoR evidence-base draft | `docs/projects/telltail/business-idea/02-evidence-base.md` |

Phase not complete. This seat does not mark Phase 2 ✅.
