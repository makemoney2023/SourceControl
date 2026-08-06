# Phase 13 — Content Strategist Notes (CMO merge fragment)

**Venture:** Blacksage Kennels  
**Phase:** 13 — Copy foundation support  
**Author:** content-strategist IC  
**For:** CMO → copy-chief merge into `13-copy-foundation.md`  
**Do not publish as standalone phase artifact**

---

## A. Messaging pillars (content hierarchy)

### Brand pillars (source: `11-brand-system.md`)

| Pillar | Core meaning | Copy job |
|--------|--------------|----------|
| **Structure** | Correct breed type, health testing, deliberate pairing | Prove competence; answer “Are these dogs bred correctly?” |
| **Steadiness** | Calm baseline temperament, even nerve | Dissolve aggression stereotypes; answer “Will this dog be stable?” |
| **Devotion** | Family loyalty, working heritage | Emotional bridge; answer “Will this dog belong to our family?” |
| **Heritage** | German origin, ADRK/FCI alignment | Credibility anchor; answer “Why German type / ADRK-minded?” |
| **Selectivity** | Waitlist, not volume; earned inquiry | Conversion gate; answer “Is this kennel for serious buyers?” |

### Scroll narrative order (pillar → section)

Pillars are **not** one-to-one with sections. They **compound** trust down the page. Recommended lead pillar per section:

| Scroll order | Section | Lead pillar | Supporting pillars | Trust compound |
|--------------|---------|-------------|--------------------|----------------|
| 1 | **Hero** | Heritage + Structure (brand promise) | Steadiness (tone) | *Recognition:* “This is a serious German Rottweiler kennel, not hype.” |
| 2 | **Heritage** | Heritage | Structure (standards frame) | *Credibility:* ADRK/FCI context grounds the breed claim. |
| 3 | **Structure** | Structure | Heritage (type reference) | *Competence:* Health, type, pairing logic — buyer can evaluate standards. |
| 4 | **Temperament** | Steadiness + Devotion | Structure (temperament eval) | *Fit:* Calm nerve + family loyalty — emotional permission to want this breed. |
| 5 | **Trust** | Structure + Selectivity | Steadiness (eval process) | *Proof:* Process signals replace volume marketing; buyer feels vetted path is fair. |
| 6 | **Apply CTA** | Selectivity | Devotion (welcoming inquiry) | *Intent:* Inquiry is deliberate, not transactional. |
| 7 | **Footer** | Heritage | Selectivity (metadata) | *Persistence:* Tagline + ADRK note reinforce after scroll. |

### Pillar stack toward Apply

```
Hero          →  Promise (power with nobility)
Heritage      →  Authority (German / ADRK frame)
Structure     →  Evidence (type, health, pairing)
Temperament   →  Relief (steadiness, devotion)
Trust         →  Process (clearances, eval, placement)
Apply         →  Gate (selective, reviewed inquiry)
```

**Copy-chief rule:** Each section should advance **one awareness beat** (see §C) while reinforcing at least **one pillar** from the row above. Do not repeat the hero promise verbatim in Trust — deepen it with specifics.

### Hero messaging spine (no CTA in viewport 1)

- **Display / wordmark:** Blacksage Kennels (visual — minimal copy)
- **Subhead must carry:** Heritage (German / ADRK-minded) + Structure + Steadiness in one breath
- **Direction (not final):** *German Rottweilers from ADRK-minded breeding. Power with nobility — structure, steadiness, and family devotion.*
- **Defer to Phase 14:** Alternate taglines, pull quotes, long-form breed education

---

## B. Content hierarchy vs Phase 12 IA

### Section map: content job, must-say vs defer, nav vs headline

| Section | ID | Content job (buyer question) | Must say (Phase 13) | Defer (Phase 14 polish) | Nav label | Section headline (may differ) |
|---------|-----|------------------------------|---------------------|-------------------------|-----------|----------------------------|
| **Hero** | `#hero` | Who is this? Why should I keep scrolling? | One-line positioning; subhead with ADRK-minded + three pillars (structure, steadiness, devotion); scroll hint only — **no CTA** | Tagline A/B; micro-copy on scroll indicator | *(none — Home is not in nav)* | N/A — wordmark is hero |
| **Heritage** | `#heritage` | Why German type? Why ADRK alignment matters? | Germany origin; FCI Std. 147; ADRK as origin club; black + rich tan markings; natural tail — **factual, not fluff** | Deeper FCI clause quotes; historical Rottweiler context | **Heritage** | **German heritage, deliberately bred** (or similar — nav is category, headline is promise) |
| **Structure** | `#structure` | Are health and type taken seriously? | Health clearances inform pairings; correct breed type; deliberate pairing (not volume); placeholder label honest | Specific test names (OFA, etc.) when operator confirms; stud/dam naming | **Structure** | **Structure bred in** — subheads for health + type |
| **Temperament** | `#temperament` | Will this dog be stable and devoted? | ADRK temperament traits (good-natured, placid, devoted, self-assured); family placement framing; **no guard-dog hype** | Pull quote; owner testimonial slots when available | **Temperament** | **Steadiness and devotion** — nav uses breed term, headline uses pillars |
| **Trust** | `#trust` | What process backs the claims? | 3-item vertical list: health testing, temperament assessment, selective placement; ADRK-aligned badge | Response-time SLA; operator credentials | **Trust** | **How we place every dog** or **Built on trust, not volume** |
| **Apply CTA** | `#apply` | What is the next step? | Headline: **Begin your inquiry**; subhead: every inquiry reviewed; single primary button → `/apply` | Secondary link to FAQ (future) | **Apply** | Same as CTA headline — nav and band align |
| **Footer** | — | Contact + legal persistence | Tagline **Power with nobility.**; ADRK/FCI alignment overline; operator placeholders `[TBD]` | Privacy link copy; full contact block | — | No section headline — utility |

### Nav label vs section headline — when they differ

| Pattern | Use when | Example |
|---------|----------|---------|
| **Same** | Conversion moments; legal/trust labels | Nav **Apply** → band **Begin your inquiry** (CTA verb differs from nav noun — intentional) |
| **Nav = category, H2 = promise** | Education sections | Nav **Heritage** → H2 **German heritage, deliberately bred** |
| **Nav = breed term, H2 = pillar language** | Temperament section | Nav **Temperament** → H2 **Steadiness and devotion** |

**Rule for copy-chief:** Nav labels stay short (single word from Phase 12 `SECTIONS` constant). Headlines carry pillar language and emotional lift. Overlines (`German Heritage`, `Structure`, etc.) use sage-muted caps per brand §4.

### `/apply` page (separate route — not a landing section)

| Element | Content job | Must say (Phase 13) |
|---------|-------------|---------------------|
| H2 | Conversion headline | **Begin your inquiry** |
| Subhead | Set expectation | We review every inquiry; selective placement |
| Field labels | Reduce friction | Plain, overline style; no jargon |
| Helper text | Qualify applicant | Experience + household fields explain *why* we ask |
| Trust footer | Post-form confidence | ADRK alignment note; response expectation (e.g. “We respond within …” — operator TBD) |
| Success state | Confirm without hype | **Inquiry received** — calm, no confetti copy |

**Form select — “How you heard about us”** (copy-chief final list): Referral · Search · Social · ADRK / breed club · Other

### MVP scope reminder

- **In scope:** `/` landing sections above + `/apply`
- **Out of scope:** `/blog`, `/pricing`, FAQ page, privacy page (footer link deferred)

---

## C. Awareness journey (content plan)

### Eugene Schwartz levels on one long landing

| Level | Buyer state | Landing beat | Section | Content move |
|-------|-------------|--------------|---------|--------------|
| **1 — Unaware** | “Rottweiler = guard dog / aggressive” or “all breeders are the same” | Reframe breed + kennel category | Hero | Declarative promise: power **with nobility**; calm tone breaks stereotype before proof |
| **2 — Problem aware** | “I want a Rottweiler but worry about temperament, health, backyard breeders” | Name the real risk (structure + nerve + health) | Heritage → Structure (enter) | Standards language: ADRK/FCI, type, testing — buyer sees *category* of responsible breeding |
| **3 — Solution aware** | “I need an ADRK-minded / German-type breeder” | Show alignment + process | Structure → Temperament | Pairing logic, clearances, temperament traits — buyer maps solution to **this** approach |
| **4 — Product aware** | “Is Blacksage the right kennel for us?” | Differentiate via selectivity + devotion | Temperament → Trust | Not volume; placement deliberate; family/working capability — buyer self-selects |
| **5 — Most aware** | “I’m ready to inquire” | Clear, low-hype conversion | Apply CTA → `/apply` form | **Begin your inquiry**; form fields qualify without insulting; submit = commitment |

### Single-page journey diagram

```
Unaware          Problem aware       Solution aware      Product aware       Most aware
   │                  │                    │                   │                  │
 Hero ──────────► Heritage ────────► Structure ──────► Temperament ───► Trust ───► Apply
(reframe)         (standards)         (process)          (fit/feeling)    (proof)    (act)
```

### Beat-by-beat: what moves the buyer

1. **Hero → Heritage scroll:** Curiosity → credibility (buyer accepts “German / ADRK-minded” as the frame).
2. **Heritage → Structure:** Credibility → competence (standards become *operational* — health, type).
3. **Structure → Temperament:** Competence → emotional safety (steadiness/devotion answer fear).
4. **Temperament → Trust:** Emotional safety → rational confirmation (process list).
5. **Trust → Apply:** Confirmation → action (selectivity makes CTA feel earned, not urgent).

### Apply form as Most Aware conversion moment

The form is **not** lead capture — it is **mutual qualification**.

| Field | Awareness function |
|-------|-------------------|
| Prior Rottweiler experience | Confirms Problem/Solution aware buyer has context |
| Household description | Surfaces Product aware fit (family, environment) |
| Location | Logistics for placement |
| How you heard | Attribution + intent signal (ADRK/club = high intent) |

**Copy tone on apply:** Welcoming but clear — *Tell us about your home and experience. We review every inquiry.* (brand §5)

**Avoid:** Urgency, puppy-count scarcity, “reserve your spot” language.

### Future content backlog — DEFERRED (not MVP)

> **Appendix only.** No `/blog` in MVP. Topics below support Phase 14+ SEO and nurture — not Phase 13 ship criteria.

| Topic cluster | Pillar | Schwartz stage | Format | Priority |
|---------------|--------|----------------|--------|----------|
| ADRK vs American Rottweiler type | Heritage + Structure | Problem → Solution | Searchable guide | P1 post-MVP |
| Rottweiler temperament myths | Steadiness | Unaware → Problem | Shareable essay | P1 |
| Health testing glossary (OFA, etc.) | Structure | Solution | Searchable reference | P2 |
| Preparing for a Rottweiler puppy | Devotion + Selectivity | Product → Most | Searchable checklist | P2 |
| Working vs companion placement | Devotion | Product | Thought leadership | P3 |
| Kennel visit / waitlist FAQ | Selectivity | Most | FAQ page | P2 |

**SEO note for future:** Hub content should interlink to `/apply` — never to a pricing page (none planned).

---

## D. Editorial do / don't (brand content tone)

Aligned with voice locks: *power with nobility; ADRK-aligned; calm, precise; no aggression/machismo.*

### Do

| Rule | Example direction |
|------|-------------------|
| Lead with **declaration**, not hype | “Structure bred in. Devotion bred through.” |
| Use **ADRK/FCI facts** accurately | Cite Standard No. 147, origin Germany, tan markings — from `MEMORY/context.md` |
| Prefer **precise breed terms** | structure, temperament, markings, type, pairing, placement, inquiry |
| Write **short paragraphs** (max 65ch) | Source Sans body; one idea per block |
| Use **matter-of-fact trust copy** | “Health clearances and temperament assessment inform every pairing.” |
| Frame **selectivity as care** | “Placements are deliberate” — not “we’re too good for you” |
| Match **context tone shifts** (brand §5) | Hero: spare; Trust: factual; Apply: welcoming + clear |
| Keep **CTA consistent** | **Begin your inquiry** across nav intent, CTA band, `/apply` H2 |

### Don't

| Rule | Avoid |
|------|-------|
| **Aggression / machismo** | guard dog hype, killer, weapon, protector marketing, snarling imagery language |
| **Volume / urgency** | limited puppies, act now, don’t miss out, 🐾 emoji stacks |
| **Sentimental pet-brand** | fur baby, cuddle monster, perfect family dog (generic) |
| **False scarcity / elitism** | exotic, rare (unless factual), dismissive tone toward applicants |
| **Clinical jargon walls** | unreadable vet-speak without plain-language bridge |
| **Marketing fluff** | amazing, incredible, best ever, world-class |
| **Stereotype reinforcement** | anything that confirms “Rottweiler = dangerous” |
| **Placeholder dishonesty** | fake champion claims in photo placeholder copy |

### Word list (copy-chief reference)

**Prefer:** structure, temperament, devoted, deliberate, ADRK, German type, markings, steadiness, inquiry, placement, heritage, companion, working capability, good-natured, placid, self-assured  

**Avoid:** fur baby, guard dog (as hype), aggressive, killer, weapon, rare/exotic (unless factual), perfect family dog, limited time, act now

---

## Merge notes for CMO / copy-chief

1. **Pillar order on page** is fixed by Phase 12 IA — do not reorder sections to match pillar alphabetical order.
2. **Hero has no CTA** — conversion copy starts at Apply CTA band; `/apply` carries full form copy.
3. **3D beat names ≠ DOM section names** — Heritage *content* appears during Structure camera beat; copy should read independently of scroll sync.
4. **Operator TBD fields** — footer contact, response-time promise: use `[Operator … TBD]` placeholders; do not invent.
5. **Lease boundary:** This file is input only — copy-chief owns `13-copy-foundation.md` final prose.
