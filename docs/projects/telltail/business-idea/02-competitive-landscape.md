# 02 — Competitive landscape — Telltail

**Venture slug:** `telltail`
**Org:** Velocity Agency
**Date accessed:** 2026-08-21 (America/Toronto)
**Phase:** 2 — Competitive intelligence (IC slice)
**Owner:** competitive-intelligence-analyst
**Reports to:** head-of-research
**Status:** IC landscape ready to merge; phase not complete
**llm_tier:** strong-general
**llm_model:** grok-4.5
**generation_profile:** none
**fallback_applied:** false

Label key: **[F]** page/store/paper fact this pass · **[I]** inference · **[A]** assumption

Primary tools this pass: WebSearch + WebFetch. `parallel-research`, `firecrawl`, `playwright-browser` unavailable (no MCP / no CLI). No app installs. No Sensor Tower. No invented TAM, revenue, MAU, or user counts. App Store **0** ratings and Play download *buckets* are display bands, not traction.

Founder locks used (packet; `01-problem-framing.md` missing): trainer/training tool not toy or translator; moment coach gated **refuse-first**; stack = Flash-class multimodal LLM per clip, not custom pose detector; Plus = 60 Flash reads/mo + credits; quota cannot skip bite-risk refuse.

---

## Scope

Comparison set is the locked KEEP list (9) + Traini as the volume toy pole (parked as instruction peer) + Pupford and Zigzag as trainer-job substitutes. Not exhaustive. Dogly, generic “Dog AI,” Iterica, PupScan, PettiChat, Accelar Dogly, GoodPup, ChatGPT-as-trainer are **out of profile** this pass (aliases / parked noise). Customer-segment work is MRA’s lease — not done here.

Every profile is split: **vision+instruction** vs **sticker/empathy** vs **not-vision**. Metering called out vs unlimited-at-$9–13.

Load-bearing science: Martvel et al., *Sci Rep* 15:41250, published 21 Nov 2025 — zero-shot GPT / Gemini / LLaVA moderate on layperson-labeled web photos, **near-chance on experimentally elicited Labrador faces**; backgrounds drive labels. Authors: current LVLMs “are not yet suitable for reliable, biologically grounded recognition of canine emotions.” **[F]** Pawfessor, Tailo, **and Aplexity terms** disclose **Gemini** this pass — three Gemini wrappers on the same stack Telltail locked (not only twins). **[F]**

---

## Landscape table

| Name | Split | Input → output | Platform | Meter vs $9–13 | Store band (display only) | Call vs Telltail |
|------|-------|----------------|----------|----------------|---------------------------|------------------|
| **Pawfessor** | Vision+instruction, emotion-framed; anime portraits = sticker adjacent | Short video → body language, 0–100 calmness, tips, chat, vet PDF. Gemini multimodal. | iOS live v2.1.0 (2026-07-29). Play “Coming Soon.” | **Credits.** IAP widget: 1 / 5 / 20 analysis credits at **$0.99 / $3.99 / $7.99**. Terms also mention auto-renewable subs (not on IAP widget this pass). | App Store **0 / 0**. | **KEEP — closest iOS analog.** No bite-risk refuse-first found. |
| **Tailo** | Vision+instruction (next-step + health log) | 10–30s clip → stress/body language + “what to try next.” Gemini. | Android + web analyser. iOS “Coming soon.” Play **10+** bucket. | Free **1 full analysis/day**. Pro **£8.99/mo** or **£89.90/yr** = **unlimited video analyses** — unlimited Gemini inside the $9–13 band. | Play **10+**. No public rating count opened. | **KEEP — on-wedge next-step.** Not iOS-first. Unlimited Pro is the COGS anti-pattern. |
| **PetSignalAI** | Vision+instruction / safety triage. Anti-translator. | Photo or short video → 15 stress signals; triage relax / monitor / call a pro. Approach-risk low/mid/high/emergency on science page. | Web. No store listing found this pass. | Free first analysis. **$4.99 Episode Report** (one-time). No subscription required (homepage). | n/a (web) | **KEEP — closest escalate-gate analogue.** Web-only; not 60-second iOS cards. |
| **Como – Speak Pet** | Vision + companion/health. **Claims audit.** Not 60-second action cards. | Live camera; claims **24 on-device keypoints** + voice. | iOS v1.2.9 (2026-07-02). 0 ratings. | Premium weekly/monthly/annual. IAP SKUs unlabeled “como” at **$1.99 / $6.99 / $69.99**. Body copy: unlimited voice + real-time vision on Premium. | App Store **0 / 0**. | **KEEP — claims audit only.** Different stack than Flash-per-clip lock. Homepage ticker **unused as TAM**. |
| **LunaDogAI** | Vision+instruction (trainer substitute) | Upload clip or text → custom plan + chat. “Proprietary language models” — Gemini **not** named. | Web/app claims; cloud. Store IDs not opened this pass. | **$35/mo** or **$378/yr**, **unlimited video uploads**. Not the $9–13 band. | n/a this pass | **KEEP.** Closest “watch *this* dog” trainer-priced peer. Unlimited vision at $35. |
| **Dog Advise** (Play) | Vision+instruction, **weak**; store title is Translator | Video scan → Happy/Stressed/Reactive or Aggressive/Fearful + plans + chat. | Play `com.dogadvise.app`, updated 2026-02-07. | IAP exist; **amounts not disclosed** on listing. | Play **50+** bucket. | **KEEP — weak.** Legal copy: severe aggression/illness → pro. Not a UX refuse gate. |
| **Pawlyze** | Vision+instruction, emotion + tips | Text Qs (capped) or photo/video → “how they feel” + tips. | iOS v2.1 (2025-08-18). Separate from Play Dog Advise. | Text **2/day** free. Photo/video behind sub. IAP: Weekly **$4.99** / Monthly **$17.99** / Yearly **$189.99** **and** 1-Year **$49.99** (dual yearly SKUs on one listing). | App Store **0 / 0**. | **KEEP.** Stale vs 2026 vision set. Dual yearly SKU is a trust flag. |
| **PN1** | **Hybrid canary:** What to Do **and** Dog Quote | Short video → 5-part report. Lifestyle + Entertainment. | iOS v1.1.2 (2026-07-23). | Weekly Premium **$1.99** / Yearly **$44.99**. No daily cap found — cheap unlimited-weekly. | App Store **0 / 0**. | **KEEP as canary.** If users screenshot the Quote, category is still a toy. |
| **Aplexity** | Thin vision+insights; title still Translator | Photo → body language / structured insights. **Gemini API** (terms). TM listing: “doesn’t translate barks”; US listing omits that block. | iOS v1.3.6 (2026-05-19). | Weekly **$5.99** / Monthly **$9.99** / Annual **$49.99**. Terms: Pro = **unlimited behavior scans** — unlimited Gemini at $9.99. | App Store **0 / 0**. | **KEEP — thin.** Third Gemini wrapper. Unlimited-at-$9.99. |
| **Traini** | **Sticker-first hybrid.** Parked as instruction peer; volume toy pole. | Face/body/bark claimed → emotion labels + 200+ lessons + PetGPT. Store: entertainment/educational. | iOS v1.3.0 (2026-08-20) + Play (updated 2026-08-17). | US IAP dollars **not on listing**. Play IAP range **$4.99–$119.99 per item**; What’s new: **translation vouchers**. | US App Store **3.89 / 295**. Play **5M+** *bucket*, **3.6** stars / **3.52K** reviews. | **PARK instruction; KEEP volume pole.** Only named app with real public ratings. |
| **Pupford** | **Not-vision** substitute | Curriculum / courses / Ask Doris. No camera-AI body-language product on pages opened. | iOS id1476456602 + Play `com.pupford.pupford` + web. | Catalog/IAP monthly **$9.99**. Web lifetime **$99.99**; US IAP lifetime **$199.99** (storefronts disagree). Semi-annual web **$59.94** vs IAP **$39.99**. Content-gated, not clip-metered. | Play **100K+** *bucket* (not MAU). | **Neighbor — substitute.** Same $9–13 content price, zero vision COGS. |
| **Zigzag** | **Not-vision** substitute | Age/breed lessons + 24/7 human trainer/behaviourist chat (Premium). AI “Ziggy” on free tier. | iOS id1550121165 + Play `nl.navara.zigzag`. Seller PetCare Services Ltd. | Blog: free 3 lessons/day; Premium **£9.99/mo** or **£39.99/yr**. US IAP **$9.99 / $49.99** (+ promo SKUs). GB IAP shows annual **£39.99**; monthly **£9.99 missing from GB list this fetch**. | Play **500K+** *bucket* (not MAU). | **Neighbor — substitute.** Buys the “what do I do” job with humans, not clips. |

---

## Positioning map

Axes used: **camera vision (clip/live) vs not-vision**, and **competence / next-step vs empathy / sticker**.

```
                    COMPETENCE / NEXT-STEP
                              ^
     PetSignalAI (web, $4.99 ep, refuse-to-pro)
     Tailo ("what to try next"; Pro unlimited Gemini)
     LunaDogAI ($35 unlimited clip → plan)
     Pawfessor (tips + chat; emotion-framed)
     Dog Advise / Pawlyze / Aplexity (thin)
                              |
     Zigzag (human 24/7)      |         PN1 (What to Do + Dog Quote)
     Pupford (courses)        |
NOT-VISION <------------------+------------------> VISION CLIP / LIVE
                              |
                              |         Traini (emotion sentence + lessons)
                              |         Como (live keypoints + "Speak Pet")
                              v
                    EMPATHY / STICKER / COMPANION
```

**Empty cell Telltail is trying to occupy [I]:** iOS-live clip → 1–3 actions for the next 60 seconds, **refuse-first** on bite-risk, **non-translator** store frame, **metered** Flash (60/mo; quota cannot skip refuse). Nobody in the KEEP set publishes that intersection. Closest pieces: PetSignalAI (gates, web), Tailo (next-step, Android/unlimited Pro), Pawfessor (iOS + credits, no refuse-first, translator-adjacent copy).

---

## Profiles

### Pawfessor — vision+instruction (emotion-framed) — KEEP direct

**Entity:** Oguzhan San. iOS id6760047972, bundle `com.pawfessor.app`. First release 2026-03-23. v2.1.0 current version date 2026-07-29. Lifestyle + Education. **[F]** itunes lookup + homepage 2026-08-21.

**Job split:** Vision+instruction. Homepage/FAQ: “personalized training advice,” chat, vet-ready PDF. Also “what your dog is really trying to say,” calmness 0–100, **anime portraits**. Sticker-adjacent feature on an instruction product. **[F]**

**Stack:** FAQ: “Pawfessor uses **Google Gemini multimodal AI** to read posture, gait, ear and tail position, facial expression and calming signals.” **[F]** Gemini-wrapper twin.

**Metering:** Homepage: free to download; “Optional in-app credits unlock heavier usage.” Release notes v2.1: unlocking chat “spends **1 credit**.” App Store IAP widget (indexed this pass; direct store fetch timed out): **1 Analysis Credit $0.99 / 5 $3.99 / 20 $7.99**. Terms (11 Feb 2026) also describe auto-renewable subscriptions not shown on that IAP widget. **[F]** Credits = metered. Not unlimited-at-$9–13.

**Bite-risk / refuse:** FAQ: does not replace vet; flags stress signals (whale-eye, lip-licking, pacing). **No bite-risk refuse-first / “do not proceed” gate found** on homepage, FAQ, or terms. **[F]**

**Store band:** averageUserRating **0**, userRatingCount **0**. Play “Coming Soon.” **[F]** Zero is a display band, not “no market.”

**Strengths [I]:** Closest iOS-first clip analog; already meters; Gemini disclosed (honest stack).
**Weaknesses [I]:** Emotion + anime copy undercuts trainer positioning; no refuse-first; 0 ratings; terms/subs vs credits dual-path.

**Alias:** pawfessor.ai is a B2B enablement copilot, not this app.

Sources: https://pawfessor.app/ · https://pawfessor.app/terms · https://apps.apple.com/us/app/pawfessor-dog-behavior-ai/id6760047972 · https://itunes.apple.com/lookup?id=6760047972 — 2026-08-21.

---

### Tailo — vision+instruction — KEEP direct

**Entity:** DOGTOK.AI LTD, Elgin, Scotland (Play developer). Site terms last updated **2026-08-21**. **[F]**

**Job split:** Vision+instruction. Homepage: clip → body language / stress / “what to try next”; share with trainer or vet; health/meds log. Not a bark translator on pages opened. **[F]**

**Stack:** Terms §4 / §7: “Videos are processed by **Google’s Gemini AI** for behavioural analysis.” Third-party: Gemini, AWS S3, PostHog. Analyse page: 10–30s clips. **[F]** Gemini-wrapper twin. Homepage also claims the model is “trained on … thousands of dogs” — company marketing, not a disclosed custom pose detector. **[A]/[I]** do not treat as verified training data.

**Metering:** Free **1 full analysis a day** (same detail as Pro). Pro **£8.99/month** or **£89.90/year** with **unlimited video analyses**. **[F]** That is **unlimited-at-the-$9–13 band** on a Gemini backend.

**Bite-risk / refuse:** Educational disclaimer; not veterinary. Cite Dogs Trust 76%/78% stats on homepage. **No pre-bite refuse-first UX found** on homepage/analyse/terms. **[F]**

**Store band:** Play `com.tailo.tailo_app`, **10+** downloads bucket, in-app purchases, updated 2026-08-02. iOS coming soon. **[F]**

**Strengths [I]:** On-wedge next-step language; behaviourist-share; honest Gemini disclosure.
**Weaknesses [I]:** Unlimited Pro vs Flash COGS; not iOS-first; Play 10+ band; “trained on thousands” claim sits badly next to Sci Rep.

**Aliases:** App Store “Tailo AI Chat & Talking Pet” (id6755666949) ≠ this. DogTok bark-translator (Ai Apps SRL) ≠ DOGTOK.AI LTD.

Sources: https://tailo.dog/ · https://tailo.dog/analyse · https://tailo.dog/terms · https://play.google.com/store/apps/details?id=com.tailo.tailo_app — 2026-08-21.

---

### PetSignalAI — vision+instruction / safety triage — KEEP direct

**Job split:** Vision+instruction. Homepage: “catches 15 documented stress signals … then triages each cue as **relax, monitor, or call a professional**.” Science page: never “your dog says…”; anti-guilt; always offer an out to a professional; conservative confidence (stills 0.55–0.80). **[F]**

**Stack:** “computer vision and expert behavioral knowledge”; “processed securely by AI providers.” Model brand **not named** (not a disclosed Gemini twin). **[F]**

**Metering:** $0 first analysis; **$4.99 Episode Report** one-time; “No subscription required.” Eligible 14-day refund. **[F]** Per-episode meter — COGS-compatible analogue.

**Bite-risk / refuse:** Closest public analogue to refuse-first: relax/monitor/call-a-pro; science page approach-risk **low / mid / high / emergency**. Analyser page (re-opened after timeout): pre-bite flags **hackles, freeze/stiffen, hard stare, low growl, lip curl or air snap**; “never advise punishing a growl”; near-bite / child / resource-guard → CAAB or veterinary behaviorist. **[F]** Whether the product **blocks** a confident “relaxed” on bite-risk is **not observable** without an install. **[I]**

**Platform:** Web. Analyzer FAQ: browser-based, no app install. `/sample-report` **404** this pass. Terms also mention a credit ledger alongside the $4.99 episode table.

**Alias:** SignalPET = clinic radiology AI, not this. Same site’s “AI Pet Emotion Detector” is a related page, not a second company.

Sources: https://petsignal.ai/ · https://petsignal.ai/science · https://petsignal.ai/ai-dog-body-language-analyzer · https://petsignal.ai/terms — 2026-08-21.

---

### Como – Speak Pet — vision companion/health — KEEP claims audit

**Entity:** Terms: **16873944 CANADA INC., operating as COMO Lab** (Quebec). App Store seller **yousuf ghairat**. iOS id6752532377, v1.2.9 (2026-07-02), first release 2025-10-09. Lifestyle + Health & Fitness. App Store age **9+** this pass (lookup JSON still showed 4+). **[F]**

**Job split:** Live vision + voice companion + health. Not a 60-second training-action card. “Speak Pet.” **[F]**

**Stack claims (unverified):** “maps **24 anatomical keypoints** … natively on your device.” Homepage: 78% “predictive behavioral accuracy” vs “trained veterinarians & behaviourists 44–48%.” Ticker: **$261B / 500M pet households / 78%** — **marketing, unused as TAM or accuracy fact.** **[F]** Different stack than Telltail’s Flash-per-clip lock. Do not treat keypoints or 78% as measured. **[I]**

**Metering:** Free download; FAQ: **limited voice AI sessions per day** (count unpublished); Pro = unlimited voice. IAP SKUs labeled only “como”: **$1.99 / $6.99 / $69.99** — **do not map dollars to weekly/monthly/annual**; page does not. Terms say monthly/annually (omit weekly the store claims). **[F]**

**Bite-risk / refuse:** Complements vet; not a replacement. No refuse-first training gate found. **[F]**

**Store band:** **0 / 0** ratings. **[F]**

**Alias:** SpeakPet: Animal Communicator ≠ this.

Sources: https://comoai.app/ · https://apps.apple.com/us/app/como-speak-pet/id6752532377 · https://itunes.apple.com/lookup?id=6752532377 — 2026-08-21.

---

### LunaDogAI — vision+instruction (trainer substitute) — KEEP

**Entity:** LunaDogAI LLC (Delaware; PO Box 861, Ravenel SC). No live App Store/Play URL found this pass; terms still mention stores. **[F]**

**Job split:** Vision+instruction. “Upload a video of your dog’s behavior” → custom plan + real-time chat + 5–10 min drills. Built-by-trainers positioning. **Not live camera.** **[F]**

**Stack:** FAQ: “proprietary language models and knowledge base.” Gemini **not** disclosed. **[F]**

**Metering:** **$35/month** or **$378/year**; **unlimited video uploads**; no refunds; cancel anytime. **[F]** Unlimited vision, but **not** at $9–13 — a different willingness-to-pay analogue (private-trainer substitute).

**Bite-risk / refuse:** Copy covers reactivity/aggression with “safety-first coaching” and “suggests … safety options when appropriate.” Not a hard refuse-first product claim. **[F]**

**Store:** No App Store ID opened this pass. “Thousands of dogs” on marketing pages unused as users.

Sources: https://www.lunadogai.com/ — 2026-08-21.

---

### Dog Advise (Play) — vision+instruction, weak — KEEP

**Entity:** רגב כדורי / Regev Kadouri, Ramat Gan. `com.dogadvise.app`. Store title this pass: **“Dog Advise: AI Dog Translator.”** Updated 2026-02-07. **[F]**

**Job split:** Mixed. Translator title + video body-language states (Happy / Stressed / Reactive or Aggressive / Fearful) + plans + 24/7 AI chat. **[F]**

**Metering:** In-app purchases; **dollar amounts not on the Play listing.** **[F]**

**Bite-risk / refuse:** Disclaimer: educational; “For **severe aggression or sudden illness, consult a pro immediately**.” Legal copy, not demonstrated UX gate. **[F]**

**Store band:** Play **50+** downloads *bucket*. **[F]**

Sources: https://play.google.com/store/apps/details?id=com.dogadvise.app — 2026-08-21.

---

### Pawlyze — vision+instruction — KEEP

**Entity:** Ben Siso / WeCreate. iOS id6747022085, v2.1, current version **2025-08-18** (stale vs 2026 set). Lifestyle + Education. **[F]**

**Job split:** Text questions free (limited **twice per day**); photo/video → “how your dog feels” + practical tips. Emotion-first, tips second. **[F]**

**Metering:** Photo/video require paid subscription. IAP this pass: Weekly **$4.99** / Monthly **$17.99** / Yearly **$189.99** **and** “1-Year Subscription **$49.99**.” Dual yearly SKUs on one listing. **[F]** Monthly is **above** $9–13; weekly is unlimited-cheap.

**Store band:** **0 / 0**. **[F]** Separate product from Play Dog Advise (do not merge).

Sources: https://apps.apple.com/us/app/dog-advice-ai-pawlyze/id6747022085 · https://itunes.apple.com/lookup?id=6747022085 — 2026-08-21.

---

### PN1 — hybrid canary — KEEP

**Entity:** Deniz Sertkan. iOS id6755426821, v1.1.2 (2026-07-23), first release 2026-02-23. Lifestyle + **Entertainment**. Seller URL aidogtranslator.de. **[F]**

**Job split:** Every analysis includes five outputs, including **What to Do** *and* **Dog Quote** (“playful human-style interpretation of what your dog might say”). Hybrid. **[F]**

**Metering:** Weekly Premium **$1.99** / Yearly **$44.99**. No per-read cap on listing. **[F]** Unlimited-at-$1.99/week.

**Store band:** **0 / 0**. **[F]**

**Why it matters [I]:** Canary for whether the category’s paid loop is the instruction card or the screenshot-able quote.

Sources: https://apps.apple.com/us/app/ai-dog-translator-pn1/id6755426821 · https://itunes.apple.com/lookup?id=6755426821 — 2026-08-21.

---

### Aplexity — thin vision+insights — KEEP

**Entity:** Aplexity Limited, Hong Kong. iOS id6760407916, v1.3.6 (2026-05-19). Lifestyle + Entertainment. Title still **Translator & Scanner**. **[F]**

**Job split:** Photo body-language scan. **US listing** omits the anti-toy block. **TM listing** (re-opened): “doesn’t ‘translate barks’” / “No fake ‘translations’” / “No barking-to-human voice.” Copy split, not a product split. **[F]** Thin instruction, translator ASO.

**Stack:** Terms (2026-04-15): “The AI analysis feature is powered by **Google Gemini API**.” Third Gemini wrapper. **[F]**

**Metering:** Weekly **$5.99** / Monthly **$9.99** / Annual Pro **$49.99**. Terms §8.1: Pro includes **unlimited behavior scans**. **[F]** Unlimited Gemini at $9.99.

**Store band:** **0 / 0**. **[F]**

Sources: https://apps.apple.com/us/app/ai-dog-translator-scanner/id6760407916 · https://apps.apple.com/tm/app/ai-dog-translator-scanner/id6760407916 · https://aplexityai.com/aidog/terms_of_use.html · https://itunes.apple.com/lookup?id=6760407916 — 2026-08-21.

---

### Traini — sticker-first hybrid — PARK as instruction peer; KEEP as volume toy pole

**Entity:** Traini Inc., 535 Arastradero Rd APT 305, Palo Alto. iOS id1607696607 v1.3.0 (current version 2026-08-20). Play `com.traini.app` updated 2026-08-17. iOS name “Training & Insights”; Play name “Translator&Training.” **[F]**

**Job split:** Sticker/empathy first. iOS description: interpret face/voice/behavior “for **entertainment and educational purposes**”; emotion label laundry list; 200+ lessons; PetGPT; “1,000,000 dog lovers” = **marketing, unused**. Play “What’s new”: **translation vouchers**. **[F]**

**Store band:** iTunes lookup: averageUserRating **3.89153**, userRatingCount **295**. Play **5M+** downloads *bucket*, **3.6** stars (`ratingValue` 3.60), **3.52K** reviews. **[F]** 5M+ is a display bucket, not MAU.

**Metering:** US App Store IAP = Yes, **no SKU dollars on the US card**. Play: **$4.99–$119.99 per item**; What’s new: **translation vouchers**. Not a clean unlimited-at-$9–13 card. **[F]**

**Critique (re-opened):** Marianne Eloise, Kinship, **16 Apr 2026** — trainers (Lawley-Rudd, Easterbrook, Grossman) flag false certainty / welfare harm; Grossman example: busy Manhattan street, app said dog was “10 percent alert.” Same article also lives on Adopt-a-Pet (Phase 0); Kinship URL re-opened this pass. **One critique, two URLs.** **[F]**

**Bite-risk [I]:** This is the public trainer-attack template Telltail inherits if it ships translator framing on a Gemini/Flash stack.

Sources: https://www.traini.app/ · https://apps.apple.com/us/app/traini-dog-training-insights/id1607696607 · https://itunes.apple.com/lookup?id=1607696607 · https://play.google.com/store/apps/details?id=com.traini.app · https://www.kinship.com/dog-lifestyle/can-traini-really-translate-your-dogs-emotions — 2026-08-21.

---

### Pupford — not-vision substitute — neighbor

Curriculum / Academy courses / Ask Doris (text Q&A). iOS + Android + web. **No camera body-language AI** on official site, Academy, body-language *course*, App Store, or Play. “Dog Body Language” is a course (videos/PDF), not a clip product. **[F]**

**Entity / stores:** Pupford LLC (Lehi, UT). iOS *Pupford: Puppy Training* id1476456602 v1.27.1 (store date Aug 6). Play `com.pupford.pupford` updated 2026-08-06. Play download band **100K+** (display bucket, not MAU). **[F]**

**Pricing — storefronts disagree, do not collapse [F]:**

| Source | Monthly | 6-month | Lifetime |
|--------|---------|---------|----------|
| pupford.com catalog `/collections/all-products` | Academy+ **From $9.99** | Semi-annual **From $59.94** | — |
| `/products/pupford-academy-lifetime` | — | — | **$99.99** (struck $199.99) |
| US App Store IAP id1476456602 | **$9.99** | **$39.99** / 6 mo | **$199.99** |

Monthly and semi-annual *product pages* did not render a price in HTML this pass (catalog “From” used). Individual courses **$19.99** on US IAP. No official yearly dollar SKU found on pupford.com. **Metering:** content-gated library, not clip/session caps. Free named courses (e.g. 30 Day Perfect Pup). First-party “800,000+ / 2+ million Pup Parents” = **marketing, unused**.

**Why it matters [I]:** Buyers already pay **$9.99/mo** for instruction without vision. That is the substitute Telltail must beat with a camera that Sci Rep says is near-chance.

Sources: https://pupford.com/pages/pupford-academy · https://pupford.com/pages/dog-training-app · https://pupford.com/products/pupford-academy-lifetime · https://pupford.com/collections/all-products · https://apps.apple.com/us/app/pupford-puppy-training/id1476456602 · https://play.google.com/store/apps/details?id=com.pupford.pupford — 2026-08-21.

---

### Zigzag — not-vision substitute — neighbor

Human/curriculum puppy app. Bitesize lessons by breed & age; 24/7 human trainer/behaviourist chat on Premium; Ziggy AI chat on free. **Not a clip-vision product** on US/GB App Store, Play, or own 2026 comparison blog. **[F]**

**Entity / stores:** PetCare Services Ltd (London). iOS id1550121165 v7.2.2. Play `nl.navara.zigzag` updated 2026-08-18. Play download band **500K+** (display bucket, not MAU). **[F]**

**Pricing [F]:** Own blog (posted/modified 21 Jan 2026): free = **3 lessons/day** + unlimited library + Ziggy; Premium = unlimited lessons + 24/7 qualified trainers at **£9.99/month or £39.99/year**. US App Store: 7-day trial; IAP **Monthly $9.99**, **Annual $49.99**, plus promo SKUs $8.99 / $24.99 / $29.99 / $44.99. GB App Store this fetch: Annual **£39.99** (also £29.99 / quarterly £24.99 / 3 mo £19.99); **monthly £9.99 did not appear on the GB IAP list** — flag vs blog. Play HTML did not render SKU prices. **Metering:** freemium lesson cap, not clip-metered.

Impact report (first-party, 1 Jun 2026 / modified 18 Jun 2026): “>1 million puppies in 2025”; 1.4M total / 57 countries; 300k+ coaching and AI interactions — **company claims, unused as TAM/users**.

**Why it matters [I]:** This is the paid “pawnic / what do I do now” job with a human on the other end. Telltail’s camera is the only structural difference — and the liability.

Sources: https://zigzag.dog/ (homepage also opened this pass; one later fetch timed out) · https://zigzag.dog/blog/puppy-training/best-dog-training-apps-for-puppies/ · https://zigzag.dog/blog/news/zigzag-impact-report-2025/ · https://apps.apple.com/us/app/zigzag-dog-puppy-training/id1550121165 · https://play.google.com/store/apps/details?id=nl.navara.zigzag — 2026-08-21.

---

## Metering vs unlimited-at-$9–13

| Pattern | Who (this pass) | Implication for Telltail [I] |
|---------|-----------------|------------------------------|
| **Credits / per-read** | Pawfessor ($0.99/$3.99/$7.99 credits); Traini Play vouchers | Matches CFO meter lock. |
| **Per-episode** | PetSignalAI $4.99 Episode Report | Closest safety-product analogue. |
| **Daily cap then paid unlimited** | Tailo 1/day free → Pro unlimited at £8.99; Pawlyze text 2/day | Daily cap is fine; **unlimited Gemini at £8.99 is not** evidence-compatible with Flash COGS. |
| **Unlimited sub in/near $9–13** | Aplexity $9.99/mo **unlimited Gemini scans** (terms); PN1 $1.99/wk; Como unlabeled IAP | Price-band twins with no published read cap. |
| **Unlimited, higher ARPU** | LunaDogAI $35/mo unlimited uploads | Trainer-substitute price, not Plus. |
| **Not vision** | Zigzag £9.99/mo (blog) / $9.99 US IAP humans; Pupford **$9.99/mo** catalog+IAP (lifetime web $99.99 vs IAP $199.99) | Same wallet, zero vision COGS. |

Telltail Plus = **60 Flash reads/mo + credits**, and **quota cannot skip bite-risk refuse**. Live set that already meters: Pawfessor, PetSignalAI, Tailo *free* tier. Live set that sells unlimited vision near $9–13: **Tailo Pro, Aplexity, PN1 weekly**. **[F]+[I]**

---

## Gemini-wrapper twins + Sci Rep (load-bearing)

Martvel, Zamansky, Shimshoni, Bremhorst. *Investigating the capabilities of large vision language models in dog emotion recognition.* **Sci Rep 15, 41250 (2025).** Published **21 November 2025**. DOI https://doi.org/10.1038/s41598-025-25199-7. Models tested include **GPT, Gemini, LLaVA**. **[F]**

Facts from the paper (Nature page opened 2026-08-21):

- DE (web photos, layperson labels): moderate accuracy; **backgrounds** shift labels (grass/sofa → happy/relaxed; clinic/bars → sad).
- LRc (experimentally elicited Labrador faces, cropped, minimal background): **near-chance**; many models collapse to one class; GPT-4o often **refuses**.
- Authors: “**current LVLMs are not yet suitable for reliable, biologically grounded recognition of canine emotions.**”
- A species-specific DINO-ViT on the same cropped faces hit **89%** in prior work — the signal exists; zero-shot LVLMs do not use it. (Context only; Telltail stack lock = **not** a custom pose detector.)

**Wrappers [F]:** Pawfessor FAQ names Gemini multimodal. Tailo terms name Gemini for video. **Aplexity terms name Google Gemini API** (photo scans; Pro unlimited). Same class of model Sci Rep finds near-chance on elicited faces.

**Telltail implication [I]:** A Flash-class read that says “relaxed” on a freeze/hard-stare is the intake failure mode. Refuse-first is not a nice-to-have; it is the only honest product on this stack. Metering does not fix a wrong label; it only bounds how often you emit one. Quota must not skip refuse.

---

## Gaps (whitespace)

1. **Intersection gap [I, medium]:** iOS-live + 60-second competence cards + **refuse-first bite/vet gate** + non-translator ASO + **metered** Flash. Pieces exist separately (Pawfessor iOS+credits; Tailo next-step; PetSignalAI triage). Nobody ships the bundle on pages opened.
2. **Claims gap [F]:** Category default ASO word is still **Translator** (PN1, Aplexity, Play Dog Advise, Traini Play). Instruction-shaped apps still buy toy search. CMO/SEO problem; CIA flags it.
3. **Proof gap [F]:** Except Traini, vision KEEP apps show **0** public ratings. Paid vision+instruction demand is **unproven** in public stores. Do not read zeros as “easy to win.”
4. **Substitute gap [I]:** Zigzag/Pupford already sell “what do I do” without a camera. Telltail only wins if the clip is *safer and more useful* than a human chat or a course — Sci Rep argues the clip is currently the weak link.

---

## Threats

1. **Stack wrappers [I, high]:** Pawfessor (iOS, Gemini, credits), Tailo (next-step, Gemini, unlimited Pro), and **Aplexity (Gemini API, unlimited scans at $9.99)** can copy 60-second cards faster than Telltail can build distribution. Differentiation that is not refuse-first gets cloned.
2. **Unlimited Gemini at £8.99 [I, high]:** Tailo Pro trains the market that vision reads are uncapped at Plus prices. Undercuts a honest 60-read meter unless Telltail leads with safety, not volume.
3. **Gimmick tax [F→I, high]:** Traini 3.89/295 + Kinship trainer attack + Entertainment-category listings (PN1, Aplexity). A translator frame on a Flash stack inherits this. False-confident “relaxed” is the harm trainers already named.
4. **Cheap weekly IAPs [F, medium]:** PN1 $1.99/wk, Como $1.99 SKU, Pawlyze $4.99/wk. Race-to-the-bottom on unlimited vision.
5. **Como claims pollution [F, medium]:** 78% vs vet ticker is unevidenced on the page. If Telltail is compared to it, either match the hype (COO refuse) or look conservative.
6. **Human substitutes [I, medium]:** Zigzag 24/7 behaviourists at ~$10/mo. If the camera is wrong, the rational buyer stays here.
7. **Hybrid canary [I, medium]:** PN1 ships Quote + What to Do. If Quote is the screenshot, instruction positioning will not save ASO.

---

## Implications for Telltail (labeled inference)

- Do **not** compete as a better BowLingual / Traini. The only public ratings in the set belong to the toy pole. **[I]**
- Meter like Pawfessor/PetSignalAI, **not** like Tailo Pro unlimited. Founder lock (60 Flash/mo; refuse cannot be skipped) is consistent with the COGS-surviving comps. **[I]**
- Refuse-first is the actual supply-side hole. PetSignalAI is the copy to study; it is web-only and not iOS moment-cards. **[I]**
- iOS-first still differentiates vs Tailo (Android/web) if the product is live before Tailo ships iOS. Play “Coming Soon” on Pawfessor is a window, not a moat. **[I]**
- Sci Rep + Gemini twins = claims language cannot be “we read your dog.” Competence copy has to be hedged, gated, and trainer-shaped. **[I]**
- No operator-specific “we are better than X” claim is licensed by this desk pass. **[A]**

---

## Aliases / do-not-confuse (re-checked)

| Name collision | Not the KEEP product |
|----------------|----------------------|
| pawfessor.ai | B2B copilot |
| Tailo talking-pet App Store id6755666949 | ≠ tailo.dog / DOGTOK.AI LTD |
| DogTok bark translator (Ai Apps SRL) | ≠ Tailo legal entity |
| SignalPET | Clinic radiology |
| SpeakPet: Animal Communicator | ≠ Como – Speak Pet |
| Play Dog Advise vs iOS Pawlyze | Separate products |
| dogly.com / Accelar Dogly / dogly.live | Out of set (not-vision / vaporware / crypto) |

---

## Open intel gaps (CIA)

| ID | Gap | Why it matters | Fix |
|----|-----|----------------|-----|
| C1 | No installs / session observation | Cannot see refuse UX, Quote vs What-to-Do usage, credit spend | Install pass when playwright or a device is available (Pawfessor, PN1, Traini, Tailo, PetSignalAI) |
| C2 | Tailo / Pawfessor live Gemini latency & refusal behavior | Sci Rep twins | Same install pass |
| C3 | Paid conversion / attach | Prices exist; attach does not | Sensor Tower or stores — treat as unknown |
| C4 | Como IAP period mapping | SKUs unlabeled $1.99/$6.99/$69.99 | Purchase-sheet screenshot |
| C5 | LunaDogAI store IDs | Neighbor pricing completeness | Store lookup next pass. **Pupford monthly $9.99 now first-party (catalog + US IAP); lifetime web vs IAP still disagree.** |
| C6 | PetSignalAI `/sample-report` 404; refuse is copy not a hard UX block | Escalate language vs actual gate | Install pass |

Customer interviews and ICP sizing = **MRA**. Keyword volumes = **SEO Manager**. Not done here.

---

## Sources (accessed 2026-08-21)

Product / store

- https://pawfessor.app/ · https://pawfessor.app/terms · https://apps.apple.com/us/app/pawfessor-dog-behavior-ai/id6760047972 · https://itunes.apple.com/lookup?id=6760047972
- https://tailo.dog/ · https://tailo.dog/analyse · https://tailo.dog/terms · https://play.google.com/store/apps/details?id=com.tailo.tailo_app
- https://petsignal.ai/ · https://petsignal.ai/science · https://petsignal.ai/ai-dog-body-language-analyzer · https://petsignal.ai/terms
- https://comoai.app/ · https://apps.apple.com/us/app/como-speak-pet/id6752532377 · https://itunes.apple.com/lookup?id=6752532377
- https://www.lunadogai.com/
- https://play.google.com/store/apps/details?id=com.dogadvise.app
- https://apps.apple.com/us/app/dog-advice-ai-pawlyze/id6747022085 · https://itunes.apple.com/lookup?id=6747022085
- https://apps.apple.com/us/app/ai-dog-translator-pn1/id6755426821 · https://itunes.apple.com/lookup?id=6755426821
- https://apps.apple.com/us/app/ai-dog-translator-scanner/id6760407916 · https://apps.apple.com/tm/app/ai-dog-translator-scanner/id6760407916 · https://aplexityai.com/aidog/terms_of_use.html · https://itunes.apple.com/lookup?id=6760407916
- https://www.traini.app/ · https://apps.apple.com/us/app/traini-dog-training-insights/id1607696607 · https://itunes.apple.com/lookup?id=1607696607 · https://play.google.com/store/apps/details?id=com.traini.app
- https://pupford.com/pages/pupford-academy · https://pupford.com/pages/dog-training-app · https://pupford.com/products/pupford-academy-lifetime · https://pupford.com/collections/all-products · https://apps.apple.com/us/app/pupford-puppy-training/id1476456602 · https://play.google.com/store/apps/details?id=com.pupford.pupford
- https://zigzag.dog/ · https://zigzag.dog/blog/puppy-training/best-dog-training-apps-for-puppies/ · https://zigzag.dog/blog/news/zigzag-impact-report-2025/ · https://apps.apple.com/us/app/zigzag-dog-puppy-training/id1550121165 · https://play.google.com/store/apps/details?id=nl.navara.zigzag

Science / critique

- Martvel et al. 2025, *Sci Rep* 15:41250 — https://www.nature.com/articles/s41598-025-25199-7 · https://doi.org/10.1038/s41598-025-25199-7
- Eloise, Kinship, 16 Apr 2026 — https://www.kinship.com/dog-lifestyle/can-traini-really-translate-your-dogs-emotions

Phase 0 input (not copied as evidence): `docs/projects/telltail/business-idea/00-intake.md`, `HANDOFFS/0-manager-head-of-research.md`. Primary pages were re-opened.

Phase not complete. Do not mark Phase 2 ✅.

<!-- graph:start -->
[[Telltail · Main]] · [[Competitive Intelligence Analyst — Telltail · Main]] · [[Phase 2 — Telltail · Main]]
<!-- graph:end -->
