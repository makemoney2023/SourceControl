---
phase: "2"
venture: telltail
owner: head-of-research
status: ready_for_csuite
llm_tier: frontier-reasoning
llm_model: grok-4.5
generation_profile: none
fallback_applied: false
tool_status:
  parallel-research: unavailable
  firecrawl: unavailable
  parallel-cli: mixed_mra_oauth_ok_others_unavailable
date: 2026-08-21
---

# 02 — Evidence base — Telltail

Label key: **[F]** fact · **[I]** inference · **[A]** assumption. Every load-bearing [F] has a URL + access date. **No TAM invented.**

IC merge complete 2026-08-21. All three IC verdicts ready_to_merge. This file is HoR synthesis. Phase not complete — CEO reviews.

## Executive summary

Telltail is classified as a consumer iOS training tool: phone-camera **Flash-class multimodal LLM** read per clip → 1–3 actions for the next ~60 seconds, **refuse-first** on bite-risk, Plus cap **60** Flash reads/mo + credits (quota cannot skip refuse). That is a **locked stack**, not a custom dog-pose detector.

The **job** “what should I do right now?” is real and already monetized by humans and text-LLMs (Dogs Trust NDS 2024; Zigzag/GoodPup/ChatGPT). The **form** (metered camera-vision instruction) is occupied on the supply side (Pawfessor, Tailo, PetSignalAI, others) and unproven on the demand side. The only named app with public store volume is **Traini**, which is a **translator/sticker** and is parked as an instruction peer.

Load-bearing risk: Martvel et al., *Scientific Reports* 21 Nov 2025 — general LVLMs (GPT/Gemini/LLaVA) fall to **near chance** on experimentally elicited dog faces; backgrounds drive labels. Authors: not suitable for biologically grounded canine emotion recognition. Pawfessor and Tailo disclose Gemini. Telltail’s locked stack is the same class.

**Proceed / pivot / stop (HoR, ICs merged):** **Proceed in explore** — researchable, classification holds, wedge is a supply-side gap (iOS moment-coach + hard refuse) not a proven paid vision category. Do **not** proceed as if TAM or paid vision-app demand were evidenced.

## Research questions + findings

| ID | Question | Finding | Label | Confidence |
|----|----------|---------|-------|------------|
| RQ1 | Is the instruction job real, or only a toy itch? | Both exist. Toy lineage is 24 years (BowLingual 2002 → 2026 Entertainment “AI Dog Translator” + PettiChat). Instruction job is independently measured (Dogs Trust 2024: overconfidence + Google help-seeking + <7% in class) and already paid via Zigzag/GoodPup/ChatGPT. | [F] job exists; [I] vision-app capture unproven | High / med-low |
| RQ2 | Can Flash-class multimodal **refuse safely**? | **Open / load-bearing.** Sci Rep 2025: zero-shot LVLMs near-chance on elicited Labrador faces; background shortcuts. No public refuse-eval for consumer dog apps found this pass. Quota-cannot-skip-refuse is a product lock, not an evidence result. | [F] paper; [A] that a refuse policy can be made reliable on Flash | Low on “yes” |
| RQ3 | Who already sells vision+instruction vs stickers? | KEEP vision+instruction: Pawfessor, Tailo, PetSignalAI, Dog Advise, LunaDogAI, PN1 (hybrid), Pawlyze, Aplexity; Como = live-vision companion (claims). Traini = volume **toy pole**. dogly.com = expert plan, not camera. “Dog AI” is not a brand. | [F] pages 2026-08-21 | High on existence; med on shipped UX |
| RQ4 | Do owners already pay for *this form*? | Public prices exist (credits, $4.99/episode, ~£9/mo, Luna $35/mo). Public ratings for instruction-framed vision apps are ~0. Traini has 3.9/295 iOS and a Play 5M+ *bucket* and is sticker-first. | [F] store pages; [I] paid vision-instruction demand unproven | Med |

## Market opportunity (no TAM)

**Not a sized market.** What is evidenced:

- **Competence gap [F]:** Dogs Trust NDS 2024 (373,216 owners / 430,406 dogs; fielded 2 May–20 Jun 2024). 80% confident reading body language; 24% consistently identified a worried dog that needed space; 76% misread an appeasement roll; 76% of dogs showed ≥1 “undesirable” behaviour; <7% of owners currently in class; 31–42% searched the internet for a given problem; 78% believed their own dog would never bite them. PDF: https://www.dogstrust.org.uk/downloads/Dogs_Trust_NDS_Report_2024__.pdf (accessed 2026-08-21). **UK sample — do not export 80/24 to US/CA as fact.**
- **Paid moment-help exists, mostly not vision [F]:** Zigzag Premium listed £9.99/mo or £39.99/yr (company page); company Impact Report 2025 claims 300k+ coaching/AI interactions (company-reported, not audited). GoodPup $34/wk is a 2023 Rover test; goodpup.com now redirects to Rover trainer marketplace (MRA 2026-08-21). Pupford Ask Doris is a live text-AI substitute. Jessica Logan quotes a client using ChatGPT “on a budget.”
- **US universe, not TAM [F]:** AVMA 2025 public table — 42.6% of U.S. households own dogs (56.3M households, 87.3M dogs). APPA $158B / $14.3B Other Services: training dollars not disclosed. Do not turn these into SAM.
- **Vision-app supply [F]:** multiple live products charge for clip/photo analysis. Demand-side proof (ratings, independent press about *paying instruction users*) is thin except Traini’s translator volume.
- **Whitespace [I]:** no opened page describes live/near-live camera → **1–3 next-60-second actions** + **hard bite/vet refuse** without a translator frame. That is a supply gap, not a demand proof.

## Proceed / pivot / stop

| Option | When | HoR now |
|--------|------|---------|
| **Proceed (explore)** | Job real, stack locked, comps mapped, refuse question explicit | **Yes — ICs merged** |
| Pivot to human-in-the-loop (Zigzag/GoodPup shape) | If refuse cannot be evidenced on Flash | Open for Phase 3/5 |
| Pivot to toy/translator | Against founder lock | **No** |
| Stop | If Sci Rep + Kinship risk is accepted as unmitigable and insurance/claims kill it | COO/CFO, not this seat |

## Competitive findings (merged from CIA 2026-08-21)

Source of truth for profiles: `02-competitive-landscape.md`. CIA handoff `HANDOFFS/2-competitive-intelligence-analyst.md` — `ready_to_merge`. Pages re-opened; no installs.

**Gemini-wrapper triplet (Pawfessor, Tailo, Aplexity) [F]:** Pawfessor FAQ names Google Gemini multimodal; Tailo terms (updated 2026-08-21) say videos are processed by Google’s Gemini AI. Same LVLM class as Sci Rep.

**Meter vs unlimited-at-$9–13 [F]:**
- Metered (Telltail-compatible pattern): Pawfessor credits $0.99 / $3.99 / $7.99; PetSignalAI $4.99 Episode Report.
- Unlimited inside/near the band (anti-pattern / education threat): Tailo Pro **£8.99/mo unlimited** Gemini analyses; Aplexity $9.99/mo; PN1 $1.99/wk.
- Outside band: LunaDogAI $35/mo unlimited (trainer-substitute ARPU).

**Store bands (display only) [F]:** KEEP vision apps still 0 App Store ratings except Traini **3.89 / 295**. Tailo Play 10+; Dog Advise Play 50+; Traini Play 5M+ bucket / 3.52K reviews. Not MAU.

**Whitespace [I]:** Nobody publishes the intersection Telltail locked — iOS + 60-second cards + refuse-first + non-translator ASO + a 60-read meter that cannot skip bite-risk. Closest pieces: PetSignalAI (gates, web), Tailo (next-step, Android, unlimited Pro), Pawfessor (iOS + credits, no refuse-first).

**Threats [I]:** Tailo unlimited-at-£8.99 educates the market against an honest meter. PN1 / Play Dog Advise / Aplexity buy “Translator” ASO. Como 78% vs-vet ticker is unevidenced marketing — do not match on a Flash stack (COO claims, not a new spawn).

**Out of CIA profile this pass:** Iterica, PupScan, Dogly, GoodPup, ChatGPT (5–10 rule). Aplexity: US listing omits anti-toy line; TM listing still has “doesn’t translate barks.” Terms name Gemini. Pro unlimited at $9.99/mo.

**Substitutes:** Zigzag Premium £9.99/mo or £39.99/yr (24/7 humans); Pupford Academy+ lifetime $99.99 on-page. Same wallet, zero vision COGS.

## Science / safety evidence

**Martvel, Zamansky, Shimshoni, Bremhorst (2025).** “Investigating the capabilities of large vision language models in dog emotion recognition.” *Sci Rep* 15:41250. Published 21 Nov 2025. https://doi.org/10.1038/s41598-025-25199-7 (accessed 2026-08-21).

- Zero-shot GPT / Gemini / LLaVA: moderate accuracy on layperson-labeled web “Dog Emotions” set; accuracy **moved with background** (grass/sofa → happy/relaxed; clinic/bars → sad).
- On experimentally elicited Labrador face crops (anticipation vs frustration): performance **near chance**. GPT-4o classified only 12/1000 images until forced.
- Specialised DINO-ViT on the same cropped-face set had previously hit 89% (Boneh-Shitrit et al. 2022) — signal is in the faces; general LVLMs are not using it.
- Authors: current LVLMs “are not yet suitable for reliable, biologically grounded recognition of canine emotions”; misleading feedback could “foster false confidence.”

**Kinship / Adopt-a-Pet (same article), Marianne Eloise, 16 Apr 2026.** https://www.kinship.com/dog-lifestyle/can-traini-really-translate-your-dogs-emotions and https://www.adoptapet.com/blog/lifestyle/can-traini-really-translate-your-dogs-emotions (accessed 2026-08-21). Easterbrook: gimmick / potentially dangerous. Lawley-Rudd: false certainty; keep-exposing-the-dog if the app says relaxed. Grossman: “10 percent alert” on a Manhattan street.

**Implication [I]:** refuse-first is the only honest product stance on this stack. A confident emotion sticker is the failure mode the paper and the trainers describe.

## Evidence gaps

| ID | Severity | Gap | Owner |
|----|----------|-----|-------|
| E1 | high | Flash refuse eval (false-relaxed on bite-risk cues) | Product / CTO + Phase 2 leftover |
| E2 | high | Will owners film *during* a live missed moment? | MRA interviews (not done) |
| E3 | high | US/CA body-language overconfidence (Dogs Trust is UK) | MRA |
| E4 | high | IAP conversion on vision instruction apps | CIA / unknown |
| E5 | medium | Hybrid usage mix (Quote vs What-to-Do) | CIA install pass |
| E6 | medium | Keyword volumes (no tool export) | SEO — qualitative only |
| E7 | medium | `01-problem-framing.md` missing | CEO |
| E8 | low | `SOURCES/INDEX.md` being opened this phase | HoR |

## Fact / inference / assumption

| Claim | Type |
|-------|------|
| Dogs Trust NDS 2024 figures above | [F] |
| Sci Rep LVLM results | [F] |
| Named KEEP comps exist on stated URLs (2026-08-21) | [F] |
| Traini 3.9/295 and Play 5M+ bucket | [F] store display |
| Instruction job is the one to build | [A] founder lock |
| Flash refuse can be made safe enough to ship | [A] open |
| 60 reads/mo matches ICP usage | [A] packaging lock |
| iOS-first US/CA anxious owners are P0 | [A] intake |

## Search / ASO findings (merged from SEO 2026-08-21)

Source: `02-keyword-demand.md`. Handoff `ready_to_merge`. **No volumes.** Ahrefs/GSC/ASC unavailable. Google Suggest 403; Bing autocomplete + iTunes Search labeled as such.

- **Translator is the loud store cluster and the wrong one [F].** iTunes US `dog translator`: 14 software results, Entertainment/Games toys; several 10k–40k public ratings. KEEP vision+instruction apps absent from that list.
- **What-to-do-now is the primary organic bet [I].** Google growling / resource-guarding / stressed-dog queries resolve to PetMD, AKC, Dogs Trust, ASPCA — authority articles, app-empty in the observed set.
- **Body language is the web pillar [F].** Autocomplete does not even offer “app.” Competence seekers are not looking for software.
- **ASO lock for Phase 14 [I]:** Lifestyle + Education. Never translator / Entertainment / Games. One future `/vs-dog-translator` harvest page only.
- **Name collision [F]:** `telltail` / `telltail dog` → Telltail Dog Training (Little Rock) + podcast. iTunes `telltail` has no dog app. Flag for CMO/Legal — **not spawned this phase.**

## IC merge notes

| IC | Lease | Status |
|----|-------|--------|
| market-research-analyst | `02-market-research.md` | **merged** — no TAM; AVMA universe only; refuse OPEN |
| competitive-intelligence-analyst | `02-competitive-landscape.md` | **merged** — Gemini triplet + meter split + whitespace |
| seo-manager | `02-keyword-demand.md` | **merged** — qualitative clusters; ASO lock; name collision flagged |

## Phase 3 inputs

- Framing to test: moment coach + refuse-first (locked).
- Do not position as translator. ASO/SEO inherit gimmick tax if they do.
- Strategy must treat Sci Rep as a constraint on claims, not a footnote.
- Pricing story = metered 60 + credits; not unlimited Plus.
- Trainer/Pupford/Zigzag are substitutes in the buyer’s head, not just “different category.”
- ASO: Lifestyle + Education; never “translator.” Name collision with Telltail Dog Training is a brand/legal item, not an SEO tactic.

## Packs / tools used

| Pack / tool | Decision |
|-------------|---------|
| `skills/org/positions/head-of-research/` Phase 2 playbook | Spawn only MRA, CIA, SEO; HoR owns this file |
| Phase 0 HoR brief + primary pages | Baseline comps, demand split, Sci Rep, Dogs Trust |
| `parallel-research` / Firecrawl | HoR/CIA/SEO: unavailable. MRA: parallel-cli OAuth worked this pass; Firecrawl still unavailable. Mixed tool_status. |

## Sources

See `SOURCES/INDEX.md`. Index seeded from Phase 0; ICs append their own.

Phase not complete.
