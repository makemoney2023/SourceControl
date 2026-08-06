---
phase: "13"
position: product-marketing-manager
reports_to: cmo
status: done
verdict_for_manager: ready_to_merge
label: REDO
llm_tier: strong-general
llm_model: composer-2.5-fast
generation_profile: none
generation_used: none
fallback_applied: false
---

# Handoff — Phase 13 Copy Foundation (REDO) → CMO

**REDO:** Replaces v1 apply-era handoff (scroll narrative, `/apply`, "Power with nobility" as hero). Aligns to trust-first multi-page IA (Phase 11–12). Merge sections below into `13-copy-foundation.md` — do **not** treat prior PMM notes or merged doc § scroll hierarchy as authoritative.

## Goal (from context packet)

Define claims guardrails (Tier 1/2/3), Package A/B/C language locks, objection handling, and conversion narrative for trust-first multi-page site. IC handoff only — CMO merges into `13-copy-foundation.md`. Do not mark phase complete.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/13-product-marketing-manager.md` | This file — merge-ready paste blocks |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | strong-general |
| llm_model | composer-2.5-fast |
| generation_profile | none |
| generation_used | none |
| fallback_applied | false |

## Decisions

- **Hero posture:** Evidence-led positioning over poetic tagline — Home h1 supports proof band, not "Power with nobility" as primary hero
- **Route lock:** `/inquire` only — never `/apply`; nav label "Inquire" or "Begin your inquiry" on buttons
- **CTA lock:** "Begin your inquiry" / "Submit inquiry" / "Inquiry received" — reject Buy, Shop, Reserve, Apply now
- **Packages distinct:** A (interest list), B (waitlist inquiry), C (placement education prose only) — do not collapse
- **Q1 gating:** brand-first = Package A only; active program = Package B fields enabled
- **Badge system:** Standard reference / Program policy / Verified / Coming soon — maps to Tier 1/2/honest-empty

## Asks for manager (`ask_manager`)

- Peer help needed: none
- Clarification needed: none
- **Conflict resolution (non-blocking):** Prior `13-copy-foundation.md` merged doc still references `/apply`, scroll sections (Heritage→Apply), and "Power with nobility" as primary tagline — **CMO should supersede with this REDO + Phase 11 §5/§7.6 + Phase 12 IA on merge**
- **Optional post-merge:** Refresh `.agents/product-marketing.md` conversion narrative from §4 below — not in IC write_lease

## Risks / blockers

- Operator Q1/Q2/Q6/Q7 still open — copy must use placeholders and Tier 1 posture until confirmed
- Per-dog OFA claims blocked until health inventory — category education only on `/health`

## Packs used

- `skills/community/marketingskills/product-marketing/`
- `skills/community/advertising-skills/skills/foundations/offer-extraction/`

## Do not

- Mark the phase complete
- Write `13-copy-foundation.md` (copy-chief lease)
- Spawn other positions
- Write manager brief

---

# MERGE-READY CONTENT — paste into `13-copy-foundation.md`

---

## PMM §1 — Positioning one-liner + messaging hierarchy

### Positioning one-liner (Home h1 support)

**Primary (Tier 1 — use as Home h1 or immediate subhead):**

> German / ADRK-aligned Rottweilers — structure, temperament, and verifiable health transparency before inquiry.

**Alternate one-liner (shorter):**

> ADRK-aligned Rottweilers. Evidence first. Inquiry when you're ready.

**Supporting line (Tier 1 — body, not hero):**

> German Rottweilers. Deliberately bred.

**Tagline (optional, secondary — do NOT substitute for proof):**

> Power with nobility.

*Use tagline in footer or About only if operator confirms brand preference. Phase 11 favors evidence-led credibility over poetic hero copy.*

### Messaging hierarchy (multi-page — not scroll narrative)

| Priority | Message | Primary surfaces | Tier |
|----------|---------|------------------|------|
| 1 | **Evidence density** — health categories, standards literacy, named dogs when available | Home proof band, `/health`, `/dogs` | 1–2 |
| 2 | **Standards-aligned type** — ADRK/FCI No. 147, natural tail, correct markings | `/health#standards`, Home proof cell | 1 |
| 3 | **Temperament within ADRK bounds** — devoted, biddable, even-tempered | `/health#temperament`, About | 1 |
| 4 | **Deliberate placement** — selective, not volume; Packages A–C | `/health#placement`, `/inquire` | 1 |
| 5 | **Qualified inquiry** — after review, not checkout | `/inquire`, tertiary Home CTA | Decision |

**Home hero rule:** h1 + proof summary band above fold. Primary pathway CTAs = View our dogs / Health & testing. **Begin your inquiry** is tertiary — not dominant above fold.

---

## PMM §2 — Claims guardrails (Tier 1 / 2 / 3)

### Tier 1 — Safe now (publish on any public page)

| Claim | Copy pattern | Badge | Surfaces |
|-------|--------------|-------|----------|
| Breed focus: German / ADRK-aligned Rottweilers | "German / ADRK-aligned Rottweiler breeding program" | Standard reference | Home, About, footer |
| ADRK/FCI Standard No. 147 type language | "Black with clearly defined rich tan markings; compact powerful build; natural tail" | Standard reference | `/health#standards` |
| Temperament within FCI bounds | "Good-natured, devoted, biddable, self-assured, even-tempered" | Standard reference | `/health#temperament` |
| Health testing **categories** exist in responsible breeding | "Hips, elbows, eyes, cardiac, JLPP — categories we evaluate when applicable" | Standard reference | `/health#testing`, EvidenceGrid |
| ADRK club breeding requirements (Germany) | "ADRK breeding requires HD/ED, BH, ZTP" — cite as standard context | Standard reference | `/health` prose |
| Inquiry is not checkout | "Inquiry is reviewed individually; not a reservation or purchase" | Program policy | `/inquire`, consent checkbox |
| No on-site pricing without operator policy | Omit prices entirely | Program policy | All pages |
| Selective placement posture | "Placements are deliberate; we are not a volume kennel" | Program policy | `/health#placement`, About |
| Honest empty when Q1 brand-first | "Breeding stock profiles are coming soon" | Coming soon | `/dogs` empty state |
| Program in development (when true) | "Our program is in development. Join the interest list for updates." | Coming soon | Home, About, Package A |

### Tier 2 — Operator confirmation required before public claim

| Claim | Operator dependency | Badge when live | Surfaces |
|-------|---------------------|-----------------|----------|
| Named breeding stock (sire/dam) | Names, photos, pedigrees | Verified | `/dogs`, `/dogs/[slug]` |
| Specific health clearances per dog | Health-test inventory + registry URLs | Verified | Dog detail, OfaLinkCard |
| Club affiliations | Membership docs | Verified | About |
| Show/work titles | Title records | Verified | Dog detail |
| Geography / service area | Q2 | Verified | About, footer, schema |
| Program maturity (active litters) | Q1 | Verified | `/litters`, Package B enable |
| Litter status / expected timing | Verified litter facts | Verified | `/litters/[slug]` — **no dates until confirmed** |
| Operator identity / kennel story | Bio, years, philosophy | Verified | About |
| Contract / guarantee / return policy | Legal docs | Verified | `/health#placement` link |
| Inquiry destination / response SLA | Q7 | Program policy | `/inquire` trust footer |
| Natural tail policy | Operator decision | Program policy | Package B field, `/health` |
| Deposit process (generic, no amount) | OP-P2 | Program policy | Package B addendum only |

**Rule:** Tier 2 claims on named entities require **Verified** badge + outbound registry link where applicable. Omit row entirely — never "Coming soon" per-test on named dog pages (brand §7.3).

### Tier 3 — Never until verified (prohibited)

| Prohibited claim | Why | Say instead |
|------------------|-----|-------------|
| Puppy prices, deposit amounts, "starting at" | No Blacksage pricing documented | "Pricing discussed after qualification" (off-site) |
| Litter availability dates or "puppies available now" | Q1 open | Honest interest-list posture or verified litter facts only |
| "Best in [region/world]," champion counts, import counts | Unsubstantiated superlatives | "ADRK-aligned breeding program" |
| Specific OFA results without registry link | Trust requires verifiability | Category education on `/health`; per-dog links when Tier 2 |
| Kennel location or service area | Q2 open | Omit until Q2 |
| "ADRK certified" (kennel) | Misleading unless club membership verified | "ADRK-aligned" or name specific affiliation when Tier 2 |
| "100% healthy," "disease-free," guaranteed outcomes | Unverifiable | "Health clearances inform every pairing" |
| Stock or AI dog photography as program proof | Tier 3 media violation | PlaceholderSlot with honest label |
| Fake scarcity — countdown, "only X left" | FOMO / puppy-mill pattern | Selectivity framed as care |
| Guard-dog / protection-machine marketing | Attracts anti-persona; off ADRK bounds | Steadiness, devotion, working capability |

### Badge language locks (brand §7.4)

| Badge label | CSS tier key | When to use | Copy pairing |
|-------------|--------------|-------------|--------------|
| **Standard reference** | `standard-reference` | Tier 1 breed/standard facts | "Per FCI Standard No. 147" / ADRK temperament language |
| **Program policy** | `program-policy` | Tier 1 strategic decisions | Inquiry-not-checkout; selective placement |
| **Verified** | `verified` | Tier 2 operator-confirmed | Named dog, linked OFA result, club membership |
| **Coming soon** | `coming-soon` | Honest empty — not fake proof | Dogs index empty; photography pending |

**QA rule:** Every on-page claim must map to a tier + badge. Zero Tier 3 at launch (NFR-QA-001).

---

## PMM §3 — Package A / B / C language locks

**Do not collapse packages.** Each has distinct headline, expectation copy, and form behavior.

### Package A — Interest list (Q1 = brand-first / pre-litter)

| Element | Locked copy |
|---------|-------------|
| **Page h1** | Begin your inquiry |
| **Mode headline** | Join our interest list |
| **Mode subhead** | Share your contact details and interest in our program. This is not a reservation or waitlist placement. |
| **Expectation copy** | Joining the interest list keeps you informed as our program develops. It does not guarantee a puppy or place you on a waitlist. We review messages individually when appropriate. |
| **Submit button** | Submit inquiry |
| **Consent checkbox** | I understand this inquiry is not a reservation; placements are selective. |
| **Deposit mention** | **None** |
| **Success h2** | Inquiry received |
| **Success body** | Thank you. We have received your message. If our program aligns with your timeline and goals, we will be in touch. Response times vary — [SLA placeholder when Q7 defined]. |
| **Prohibited** | Reserve, deposit, waitlist guarantee, "You're on the list!" |

**Q1 gate:** When `INQUIRY_PACKAGE_MODE=A`, Package B fields hidden; Litters nav omitted.

### Package B — Waitlist consideration (Q1 = active program)

| Element | Locked copy |
|---------|-------------|
| **Page h1** | Begin your inquiry |
| **Mode headline** | Submit inquiry for waitlist consideration |
| **Mode subhead** | Tell us about your home, experience, and goals. Waitlist placement is selective and not guaranteed by submitting this form. |
| **Expectation copy** | Submitting this inquiry begins a mutual fit review — not a reservation. If we determine alignment, we will discuss next steps individually, including any waitlist process. |
| **Deposit addendum** (below form, Package B only) | A waitlist deposit may be required after approval. Terms and amounts are provided individually — not on this site. |
| **Agreement checkbox** (required, Package B) | I understand a waitlist deposit may be required after approval; terms provided individually. |
| **Submit button** | Submit inquiry |
| **Success h2** | Inquiry received |
| **Success body** | Thank you. We have received your inquiry and will review it individually. If there is a potential fit, we will contact you to discuss next steps. This is not approval or waitlist confirmation. |
| **Prohibited** | Deposit amount, "Pay now," "Reserve your spot," instant waitlist confirmation |

**Q1 gate:** When `INQUIRY_PACKAGE_MODE=B`, extended fields enabled per PRD § Package B.

### Package C — Placement (education only — no form v1)

| Element | Locked copy |
|---------|-------------|
| **Surface** | `/health#placement` prose only — **no form variant** |
| **Section h2** | Our placement process |
| **Process copy (Tier 1)** | Placements are selective. After mutual fit is established through inquiry and conversation, we discuss contract terms, health guarantees, and logistics individually. Pricing and deposit terms are never published on this site. |
| **Sequence descriptor** | Interest or inquiry → individual review → fit conversation → [waitlist when applicable] → placement agreement off-site |
| **CTA from placement section** | Text link only: "Begin your inquiry" → `/inquire` (tertiary styling) |
| **Prohibited** | Payment fields, contract download unless operator provides Tier 2 PDF, price/deposit amounts |

### Cross-package CTA locks

| Context | Use | Avoid |
|---------|-----|-------|
| Header / nav tertiary | Begin your inquiry | Apply, Apply now |
| Form submit | Submit inquiry | Send, Apply, Reserve |
| Post-submit | Inquiry received | You're in!, Approved, Confirmed |
| Body / interest capture | Join our interest list (Package A only) | Sign up now, Reserve |
| Body / waitlist | Submit inquiry for waitlist consideration (Package B only) | Join waitlist (implies auto-enrollment) |
| Litters page CTA | Begin your inquiry (text link) | Reserve, Available now |

---

## PMM §4 — Conversion narrative

### Buyer journey (site job boundaries)

```
DISCOVER → SHORTLIST → VERIFY (on-site) → BEGIN YOUR INQUIRY (/inquire)
                              ↑
                    Site completes its job here well
```

| Stage | Buyer action | Site responsibility | CTA posture |
|-------|--------------|---------------------|-------------|
| **Discover** | Finds Blacksage via search, referral, or direct | Home positioning + proof band signals credibility | View our dogs · Health & testing |
| **Shortlist** | Compares to other kennels | Evidence density in first 3–5 screens; professional tone | Nav to Dogs, Health, About |
| **Verify** | Reads standards, health approach, process, dogs (when live) | Tier 1 education + Tier 2 verified proof only | Learn about our process |
| **Inquire** | Submits Package A or B form after trust path | `/inquire` — qualified capture, not checkout | **Begin your inquiry** (tertiary until Verify complete) |

### Site job boundaries (what the site does / does not do)

| In scope | Out of scope |
|----------|--------------|
| Earn trust through evidence and education | Sell puppies on-site |
| Filter anti-persona via tone and inquiry fields | Instant placement or checkout |
| Capture qualified inquiry (Package A or B) | Collect deposits or payments |
| Describe placement process (Package C prose) | Publish prices or litter dates without verification |
| Link to external registries when Tier 2 data exists | Claim unlinked OFA results |

### Page-level conversion roles

| Route | Conversion job | Primary CTA | Inquire CTA |
|-------|----------------|-------------|-------------|
| `/` | Orient + proof pathway | View our dogs / Health & testing | Tertiary band only |
| `/dogs` | Verify breeding stock | — | Tertiary text link in empty state |
| `/health` | Verify health + learn process | Internal anchors | Tertiary at `#placement` |
| `/about` | Verify operator + philosophy | — | Tertiary at page bottom |
| `/inquire` | Convert qualified interest | Submit inquiry | Page purpose |
| `/litters` (conditional) | Verify litter context | — | Text link → `/inquire` |

**Anti-pattern rejected:** Apply-first hero, scroll narrative culminating in Apply, `/apply` route. Words must match architecture.

---

## PMM §5 — Objection crusher table

Top buyer objections with approved copy angles. Use `[placeholder]` where operator facts missing.

| Objection | Buyer fear | Approved response angle | Proof / placement | Placeholder |
|-----------|------------|-------------------------|-------------------|-------------|
| **"How do I know health claims are real?"** | Breeder hides failures; vague "health tested" | Name categories; link to registries when Tier 2; educate on what responsible breeding evaluates | `/health#testing` EvidenceGrid; per-dog OfaLinkCard when live | `[Specific test results when inventory confirmed]` |
| **"Why no prices on the site?"** | Hidden fees; price gouging | Category norm: ethical breeders discuss after qualification; signals selectivity not commodity | `/health#placement` Package C prose | `[Pricing discussed after mutual fit — off-site]` |
| **"How long is the wait?"** | Endless waitlist; fake scarcity | Honest timeline posture; no invented dates | Package A/B expectation copy; `/health#placement` | `[Typical wait: placeholder until operator defines Q1/Q7 policy]` |
| **"Is this a guard dog kennel?"** | Aggression marketing; wrong breed fit | ADRK temperament bounds — steadiness, devotion, even-tempered; power ≠ aggression | `/health#temperament`; anti-claims list | — |
| **"I'm a first-time Rottie owner — am I welcome?"** | Rejection or unsafe match | Inquiry reviews experience and household; mutual fit, not blanket yes/no | `/inquire` experience field helper; `/health#placement` | `[First-time policy: placeholder until operator confirms]` |
| **"What if there are no puppies / no dogs listed?"** | Hollow or scam site | Honest brand-first posture; interest list; education still valuable | `/dogs` empty state; Package A | "Breeding stock profiles are coming soon" |
| **"Why such a long application?"** | Busywork; data harvest | Selective placement protects dogs and buyers; serious buyers expect it | Package B expectation copy; consent language | — |
| **"Are you really ADRK-aligned?"** | "German lines" marketing lie | Standard literacy; FCI No. 147 language; affiliation only when Tier 2 verified | `/health#standards`; About affiliations | `[Club affiliations: placeholder until operator confirms]` |
| **"What happens after I submit?"** | Black hole; spam | Inquiry received; individual review; no auto-approval | `/inquire` success state; trust footer | `[Response expectation: placeholder when Q7 defined]` |
| **"Why require a deposit?"** (Package B) | Pay-before-approval scam | Deposit **after** approval only; terms individual; never on-site | Package B addendum | **No amount — ever on site** |

---

## PMM §6 — Anti-claims list

**Never publish.** Positive alternatives included.

### Aggression / guard-dog tropes

| Anti-claim | Positive alternative |
|------------|---------------------|
| Guard dog (as marketing) | Steady companion with working heritage |
| Protection machine / weapon / killer | Self-assured, even-tempered, devoted |
| Attack training implied | Biddable, eager to work — matched to suitable homes |
| Snarling / bared-teeth imagery direction | Calm alert posture; structure visible |

### FOMO / scarcity manipulation

| Anti-claim | Positive alternative |
|------------|---------------------|
| Only X puppies left | Selective placements; inquiry reviewed individually |
| Limited time / act now | Deliberate process; no checkout pressure |
| Available now / Reserve today | Begin your inquiry when you've reviewed our program |
| Countdown timers | — (omit entirely) |

### Price / commerce language

| Anti-claim | Positive alternative |
|------------|---------------------|
| $X,XXX / starting at / deposit $XXX | Pricing discussed after qualification |
| Buy / Shop / Cart / Checkout | Begin your inquiry |
| Reserve / Apply now / Get your puppy | Submit inquiry for waitlist consideration (B) or Join our interest list (A) |

### Unverified credentials

| Anti-claim | Positive alternative |
|------------|---------------------|
| ADRK certified (without membership proof) | ADRK-aligned; FCI Standard No. 147 |
| 100% healthy / disease-free | Health clearances inform every pairing |
| OFA Excellent (without registry link) | Category on `/health`; linked result on dog page when Tier 2 |
| Champion / import / best in [region] (unverified) | Omit until Tier 2 records confirmed |
| Fake litter dates or availability | Coming soon (Package A) or verified facts only (Tier 2) |

### Absolute temperament promises

| Anti-claim | Positive alternative |
|------------|---------------------|
| Safe with everyone always | Even-tempered — matched to prepared homes |
| Non-aggressive / harmless | Good-natured, devoted; responsible ownership required |
| Perfect family dog (generic) | Tell us about your household; we review fit |

---

## PMM §7 — Proof band + key surface copy seeds (Tier 1)

Paste-ready one-liners for copy-chief. Aligns to Phase 12 proof band cells.

| Cell / surface | Title | Body (locked Tier 1) |
|----------------|-------|----------------------|
| Home proof — Standards | Standards-aligned | ADRK / FCI No. 147 type and temperament framework |
| Home proof — Health | Health approach | Testing categories that inform responsible pairings |
| Home proof — Dogs | Our dogs | `[Count when Tier 2]` or **Profiles coming soon** |
| Home proof — Process | Deliberate placement | Selective inquiry — not checkout |
| Home h1 | German / ADRK-aligned Rottweilers | — |
| Home subhead | We lead with health transparency and standards-informed education — then invite qualified inquiry. | — |
| `/dogs` empty | Breeding stock profiles are coming soon. | Explore our health and education resources in the meantime. |
| `/inquire` trust footer | ADRK-aligned breeding program. Every inquiry reviewed individually. | `[Response expectation when Q7 defined]` |

---

## PMM §8 — Copy-chief merge checklist

- [ ] Replace scroll-section pillar map with multi-page IA (Home → Dogs → Health → About → Inquire)
- [ ] Home h1 = evidence-led; demote "Power with nobility" to optional secondary
- [ ] All `/apply` references → `/inquire`
- [ ] Package A/B/C strings match §3 exactly
- [ ] Tier badges on claims per §2
- [ ] Objection table §5 available for FAQ / Health expansion
- [ ] Anti-claims §6 in do/don't section
- [ ] Zero Tier 3 claims; placeholders labeled `[placeholder]`
- [ ] CTA hierarchy: proof CTAs primary; Begin your inquiry tertiary on Home

---

## Sources

- `12-web-design.md` — IA, proof band, PackageModeHeader, `/inquire` spec
- `11-brand-system.md` — §5 voice, §7.4 tier badges, §7.6 package modes
- `.agents/product-marketing.md` — pillars, proof tiers, CTA locks
- `05-prd.md` — form spec, packaging map, staged tiers
- `03-strategy.md` — SD1–SD8, D2 trust-first
