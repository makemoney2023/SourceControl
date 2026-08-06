---
phase: "13"
position: content-strategist
reports_to: cmo
status: done
verdict_for_manager: ready_to_merge
llm_tier: strong-general
llm_model: composer-2.5-fast
generation_profile: none
generation_used: none
fallback_applied: false
redo: true
supersedes: "v1 scroll/apply handoff — multi-page IA per 12-web-design.md REDO"
---

# Handoff — Content Strategy (REDO) → CMO

## Goal (from context packet)

Produce messaging map from pillars → routes for trust-first **multi-page** site. Document awareness journey, content jobs per page, empty-state content rules, and pillar compounding across IA. Write IC handoff only (CMO merges into `13-copy-foundation.md`). Do **not** mark phase complete. Do **not** write `13-copy-foundation.md`.

**This REDO supersedes** the prior v1 handoff (single landing + `/apply` scroll beats: Hero → Heritage → Structure → Temperament → Trust → Apply). Phase 12 web-design REDO is source of truth for IA.

---

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/13-content-strategist.md` | This handoff — merge-ready sections for CMO → `13-copy-foundation.md` |

---

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | strong-general |
| llm_model | composer-2.5-fast |
| generation_profile | none |
| generation_used | none |
| fallback_applied | false |

---

## Decisions

1. **Pillars compound across routes** — no 1:1 pillar-to-page mapping; each route carries a **lead pillar** but inherits trust from prior pages in the journey.
2. **Home leads with proof summary band** (4 cells) — not scroll narrative, not apply-first hero.
3. **Schwartz stages map to route sequence**, not scroll depth on one page.
4. **Education lives on `/health`** — blog deferred post-v1; no separate `/blog` in MVP content scope.
5. **Empty states are honest** — "coming soon" or omit; never fake dog profiles, per-test rows, or litter pages when Q1 = brand-first.
6. **CTA lock:** **Begin your inquiry** — tertiary on Home; route `/inquire` not `/apply`.
7. **Q1 brand-first:** Litters nav omitted; Dogs may be empty; Package A only on `/inquire`.

---

## Asks for manager (`ask_manager`)

- Peer help needed: **none**
- Clarification needed: **none** — operator TBD items (Q2 contact, Q7 response SLA, health inventory) correctly left as placeholders for copy-chief

---

## Risks / blockers

- **`13-copy-foundation.md` on disk still reflects v1 scroll IA** — copy-chief merge must adopt this REDO map; CMO should flag collision if copy-chief retains Heritage/Structure/Temperament scroll section order.
- **Operator placeholders:** Contact block, response-time copy, per-dog OFA rows blocked until Q2/Q6/health inventory confirmed.
- **Tagline drift:** Existing copy foundation uses "Power with nobility" as locked tagline; brand system §1 favors evidence-led credibility — copy-chief should reconcile with creative-director, not content-strategist.

---

## Packs used

- `skills/org/positions/content-strategist/SKILL.md`
- `skills/org/HANDOFF-TEMPLATE.md`
- `skills/community/marketingskills/content-strategy/SKILL.md`

---

## Do not

- Mark the phase complete
- Write outside write_lease (`13-copy-foundation.md` untouched)
- Spawn other positions
- Revert to v1 scroll hierarchy or `/apply` route language

---

# MERGE-READY CRAFT — for `13-copy-foundation.md`

*CMO: merge sections below. Source: content-strategist IC REDO, Phase 13. IA authority: `12-web-design.md`.*

---

## 1. Pillar → route messaging map

### Five messaging pillars (from `.agents/product-marketing.md`)

| # | Pillar | Core message (Tier 1 safe) |
|---|--------|----------------------------|
| P1 | **Standards-aligned type and structure** | ADRK/FCI Standard No. 147 — correct proportions, markings, natural tail; no giant tropes |
| P2 | **Temperament within ADRK bounds** | Good-natured, devoted, biddable, even-tempered — steadiness, not aggression marketing |
| P3 | **Verifiable health transparency** | Health clearances inform pairing — hips, elbows, eyes, cardiac, JLPP as categories; per-dog links when verified |
| P4 | **Deliberate placement, not volume** | Selective inquiry; mutual fit; no FOMO; process before checkout |
| P5 | **Education before sale** | Teach standard, health tests, responsible ownership before asking for commitment |

### Route map — lead pillar + compound inheritance

Pillars **compound** across the site. A buyer who reaches `/inquire` should have encountered P1–P5 at least once through navigation — not through one long scroll.

| Route | Nav label | Lead pillar(s) | Supporting pillars | Content role |
|-------|-----------|----------------|--------------------|--------------|
| `/` | Home | P1 + P3 (promise via proof band) | P2 (tone), P4 (tertiary inquire posture), P5 (teaser links) | **Orient + route** — proof summary band surfaces all four proof pathways in one viewport; positioning prose sets ADRK frame |
| `/dogs` | Dogs | P1 (structure on named stock) | P3 (per-dog clearances when Tier 2), P2 (temperament in bios when operator provides) | **Verify stock** — named breeding stock or honest empty; no placeholder photos as proof |
| `/health` | Health/Education | P5 + P3 | P1 (`#standards`), P2 (`#temperament`), P4 (`#placement`) | **Verify + educate** — category-level health grid, standard literacy, placement process (Packages A–C prose) |
| `/about` | About | P2 + P4 (operator philosophy) | P1 (program principles), P5 (why we teach first) | **Verify operator** — identity, principles, contact when Q2; no invented tenure or geography |
| `/inquire` | Inquire | P4 | P5 (expectation copy), P2 (welcome tone) | **Qualify** — form after trust path; Package A or B mode |
| `/litters` *(conditional)* | Litters | P4 + P1 | P3 (parent links to `/dogs`), P5 (process reminder) | **Verify availability posture** — only when Q1 active + verified litter facts; no prices, no "Reserve" |

### Pillar compounding matrix (how trust stacks)

| Pillar | Primary surface | Reinforced on | Earned before inquire when… |
|--------|-----------------|---------------|----------------------------|
| P1 Standards | `/health#standards`, Home proof cell "Standards" | `/dogs` (structure in profiles), `/about` (principles) | Buyer can articulate ADRK/FCI alignment frame |
| P2 Temperament | `/health#temperament` | `/about`, `/dogs` bios (Tier 2) | Buyer understands even-tempered / no guard-dog hype |
| P3 Health | `/health#testing`, Home proof cell "Health" | `/dogs/[slug]` OfaLinkCard rows (Tier 2 only) | Buyer knows test categories; can OFA-lookup parents when data exists |
| P4 Placement | `/health#placement`, Home proof cell "Process" | `/inquire`, `/litters` (conditional) | Buyer understands selective process; no checkout expectation |
| P5 Education | `/health` (full hub) | Home education teaser, `/about` principles | Buyer has read at least one education anchor before form |

### Explicit reject — v1 scroll mapping

| v1 scroll beat | v1 pillar assignment | v2 replacement |
|----------------|---------------------|----------------|
| Hero (full viewport wordmark) | Heritage + Structure promise | Home compact hero + **proof summary band** |
| Heritage section | Heritage pillar | `/health#standards` + Home positioning prose |
| Structure section | Structure pillar | `/dogs` + `/health#testing` |
| Temperament section | Steadiness + Devotion | `/health#temperament` |
| Trust section | Structure proof + Selectivity | `/health#placement` + `/about` |
| Apply CTA culmination | Selectivity | `/inquire` (after multi-page path) |

**Do not** reorder copy sections to match scroll depth. **Do** ensure each route's H1 and lead paragraph honor its lead pillar.

---

## 2. Page content jobs + CTA hierarchy

### One job per route

| Route | Single content job | Must exist (Tier 1 minimum) | Tier 2 unlock |
|-------|-------------------|------------------------------|---------------|
| `/` | **Orient serious buyers and surface proof pathways in first viewport** | h1 + subhead (ADRK-aligned positioning); proof band (4 cells); 2–3 sentence positioning prose; education + about teasers; tertiary inquire band | Optional hero photo (Q6); dog count in proof cell when stock exists |
| `/dogs` | **Show named breeding stock or honest program-development posture** | PageHero + Tier 1 intro (structure + temperament focus); empty state OR DogGrid | DogCard + `/dogs/[slug]` with photos, bios, OfaLinkCard rows |
| `/health` | **Educate on standard, health categories, temperament, and placement process** | `#standards`, `#testing` (5 category cards), `#temperament`, `#placement` (Packages A/B/C prose); external ADRK/OFA links | Per-dog registry references in copy when inventory exists |
| `/about` | **Humanize operator and program principles without invented biography** | Program principles (Tier 1 bullets); honest gap copy for operator story | Operator story, contact block (Q2), club affiliations (verified) |
| `/inquire` | **Capture qualified interest after buyer has navigated trust pages** | PackageModeHeader (A or B); expectation copy; InquiryForm; trust footer (ADRK note) | Package B fields + deposit-after-approval disclaimer (no amount); response SLA when Q7 |
| `/litters` *(conditional)* | **Present verified litter facts without commerce UX** | — *(route omitted Q1 brand-first)* | Litter cards with parent links, status, expected timing; text link → `/inquire` |

### Global CTA hierarchy (locked — from Phase 12)

| Priority | CTA copy | Typical placement | Styling |
|----------|----------|-------------------|---------|
| 1 | View our dogs | Header nav, Home proof band cell "Dogs" | Nav link / proof cell link |
| 2 | Health & testing *(or "Health approach")* | Header nav, Home proof band cell "Health" | Nav link / proof cell link |
| 3 | Learn about our process | `/health#placement`, `/about` body links | Inline text link |
| 4 | **Begin your inquiry** | Header tertiary, footer, Home bottom band, `/about` closing | Text button or outline — **not** filled primary on Home above fold |

**Never above fold on Home:** Apply now, Buy, Shop, Reserve, price CTAs, FOMO language.

### Per-route CTA table

| Route | Primary CTA | Secondary CTA | Tertiary CTA |
|-------|-------------|---------------|--------------|
| `/` | View our dogs *(via proof cell)* | Health & testing *(via proof cell)* | Begin your inquiry *(bottom band only)* |
| `/dogs` | — *(browse)* | Health approach → `/health` | Begin your inquiry *(empty state footer)* |
| `/dogs/[slug]` | — | Health approach → `/health` | ← Back to dogs |
| `/health` | — *(read)* | View our dogs → `/dogs` | Begin your inquiry *(after `#placement`)* |
| `/about` | — | Health & education → `/health` | Begin your inquiry *(page close)* |
| `/inquire` | Submit *(form — Package A/B headline)* | — | — |
| `/litters` | — | Parent dog profiles → `/dogs/[slug]` | Begin your inquiry *(text link, not Reserve)* |

### What must exist before inquire is "earned"

Copy and UX should imply the buyer has **had the opportunity** to verify before converting. Minimum trust path:

```
Home (proof band) → at least one of: /dogs OR /health → /inquire
```

| Gate | Requirement | Copy implication |
|------|-------------|------------------|
| **Structural** | Nav exposes Dogs + Health before Inquire | Header order locked |
| **Home** | Proof band links to `/health` and `/dogs` before bottom inquire band | "Ready after reviewing our program?" framing |
| **Inquire page** | Expectation copy states review process | Not a reservation; selective placement |
| **Package A (Q1 brand-first)** | "Join our interest list" — no deposit language | Honest program-in-development posture when true |
| **Package B (Q1 active)** | Deposit-after-approval disclaimer | No dollar amounts |

---

## 3. Schwartz awareness journey — multi-page route sequence

Replace v1 single-page scroll beat map with **route-based** awareness progression. Buyer may enter from any route (SEO, referral) but ideal path follows increasing awareness.

### Stage → route mapping

| Schwartz stage | Buyer mindset | Primary route(s) | Content job | CTA posture |
|----------------|---------------|------------------|-------------|-------------|
| **Unaware** | "Rottweilers are guard dogs / I want a puppy now" | `/` (entry), `/health#temperament` | Reframe: ADRK temperament bounds; education before impulse | No inquire pressure; link to Health |
| **Problem-aware** | "I need a responsible breeder / health-tested lines" | `/health#testing`, `/health#standards` | Name categories (hips, elbows, eyes, cardiac, JLPP); standard literacy | View our dogs; learn process |
| **Solution-aware** | "German / ADRK-aligned is the quality shorthand" | `/`, `/health#standards`, `/dogs` | Position Blacksage within ADRK/FCI frame; structure language | Health & testing; View our dogs |
| **Product-aware** | "Is Blacksage credible vs. other kennels?" | `/dogs`, `/dogs/[slug]`, `/about`, `/health` (full) | Evidence density: named stock, operator identity, process transparency | Learn about our process |
| **Most aware** | "I'm ready to inquire if fit looks right" | `/health#placement`, `/about`, `/inquire` | Package A/B expectations; mutual qualification framing | **Begin your inquiry** |

### Ideal journey sequence (replace scroll beats)

```
DISCOVER          SHORTLIST           VERIFY                         INQUIRE
   │                  │                  │                              │
   ▼                  ▼                  ▼                              ▼
  /            →    /  + nav scan   →   /health (+ /dogs, /about)   →   /inquire
(proof band)      (3–8 page views)     (education + evidence)         (Package A/B)
```

| Step | Route | Awareness advance | Key copy beat |
|------|-------|-------------------|---------------|
| 1 | `/` | Unaware → Problem-aware | Proof band: Standards + Health cells answer "what kind of program?" |
| 2 | `/health` | Problem-aware → Solution-aware | `#standards` + `#testing` establish ADRK frame and health categories |
| 3 | `/dogs` | Solution-aware → Product-aware | Named stock or honest empty — credibility either way |
| 4 | `/about` | Product-aware | Operator principles + identity (or honest gap) |
| 5 | `/health#placement` | Product-aware → Most aware | Packages A/B/C process prose — no payment UX |
| 6 | `/inquire` | Most aware | Form + expectation copy |

### Entry-point variants (copy should support non-linear arrival)

| Entry route | Assume awareness | Lead with | Defer |
|-------------|------------------|-----------|-------|
| `/` (referral) | Product-aware | Proof band — skip re-education in hero | Long breed primer |
| `/health` (search) | Problem-aware | `#testing` or matched anchor | Home positioning repeat |
| `/dogs` (direct) | Solution-aware | Stock or empty state honesty | Apply-first CTA |
| `/inquire` (deep link) | Most aware *(risky)* | Expectation copy + form | Still show trust footer; no "Apply now" headline |

---

## 4. Empty-state content rules

Honest posture per SD5. **Coming soon** when section is planned; **omit** when faking proof would violate tier discipline.

### `/dogs` — empty (Q1 brand-first / Tier 1)

| Element | Rule | Tier 1 copy direction *(copy-chief finalizes)* |
|---------|------|-----------------------------------------------|
| PageHero h1 | Keep — "Breeding stock" or equivalent | Do not hide route |
| Intro | Tier 1 — structure + temperament **program focus**, not fake names | `[Operator: program intro when provided]` |
| Body | PlaceholderSlot + honest message | "Breeding stock profiles are coming soon." |
| Stat in Home proof cell | "Profiles coming soon" or omit count | Never show fake count |
| Links | → `/health`, → `/inquire` (tertiary) | Offer education path |
| **Do not** | Stock photography, invented sire/dam names, "Coming soon" per-dog cards | — |

### `/dogs/[slug]` — gated

| Condition | Rule |
|-----------|------|
| No operator data | **Page does not exist** — omit from sitemap/`generateStaticParams` |
| Partial data | Publish only when name + photo approval + permitted claims confirmed |
| Health rows | OfaLinkCard rows **only when verified**; omit row entirely — no "Coming soon" per test |

### `/about` — operator story gap (Tier 1)

| Element | Rule | Copy direction |
|---------|------|----------------|
| Operator story | Tier 2 when provided | If absent: honest gap — e.g. "Operator profile forthcoming" + program principles carry page |
| Contact block | **Omit until Q2** | No `[CITY, STATE]` or invented phone/email |
| Club affiliations | Tier 2 verified only | Omit section entirely if unverified — do not list aspirational memberships |
| Program principles | Tier 1 bullets always | P1, P2, P4, P5 themes — no kennel-specific superlatives |

### `/health` — category-level (always Tier 1 safe)

| Section | Empty/missing rule |
|---------|-------------------|
| `#standards` | Never empty — Tier 1 ADRK/FCI prose always publishable |
| `#testing` | EvidenceGrid with 5 categories — Tier 1 one-liners; no per-dog results |
| `#temperament` | Never empty — Tier 1 ADRK temperament bounds |
| `#placement` | Never empty — Package A/B/C process prose; Package C = education only |
| Per-dog references | Omit inline mentions until Tier 2 inventory exists |

### `/litters` — Q1 brand-first

| Rule | Action |
|------|--------|
| Q1 = brand-first | **Route and nav item omitted** — not a hidden empty page |
| Q1 = active, no verified facts | Omit route until operator confirms litter data |
| Q1 = active, verified | Litter cards only; no prices, no "Available now" FOMO |

### Tier badge copy alignment (brand §7.4)

| Badge | When to use in copy/UI |
|-------|------------------------|
| `Standard reference` | Tier 1 breed/standard facts on `/health` |
| `Program policy` | Tier 1 decisions (no on-site pricing, selective placement) |
| `Verified` | Tier 2 operator-confirmed claims only |
| `Coming soon` | Honest empty (`/dogs` index, Home proof cell stat) — **not** on named dog health rows |

---

## 5. Home proof-band content strategy

### Role of proof summary band

The proof band is the **trust compound in miniature** — four cells replace v1 scroll depth by giving serious buyers four verification pathways in one viewport (above fold at 1280×800). It answers: *What kind of program? How do you handle health? Who are the dogs? What happens if I want a puppy?*

### Cell order and justification

Order is **fixed** left-to-right / top-to-bottom:

| Order | Cell ID | Title | Lead pillar | Why this position |
|-------|---------|-------|-------------|-------------------|
| 1 | `standards` | Standards-aligned | P1 | **Category frame first** — serious buyers filter on ADRK/FCI alignment before anything else; establishes credibility shorthand |
| 2 | `health` | Health approach | P3 + P5 | **Trust signal #1 in category** — health categories immediately after standards; links to education hub |
| 3 | `dogs` | Our dogs | P1 + P3 | **Verify stock** — proof of program exists in names/photos when Tier 2; honest empty when not |
| 4 | `process` | Deliberate placement | P4 + P5 | **Qualification frame last** — selective process after evidence; pre-frames `/inquire` without CTA pressure |

**Rationale:** Standards → Health → Dogs → Process mirrors buyer due-diligence order (Phase 2 trust-signal ranking) and ends on placement posture before Home's tertiary inquire band.

### Per-cell content spec (Tier 1)

| Cell | Title | Body (one line) | Link target | Badge | Stat slot |
|------|-------|-----------------|-------------|-------|-----------|
| Standards | Standards-aligned | ADRK / FCI No. 147 type | `/health#standards` | sage | — |
| Health | Health approach | Testing categories overview | `/health#testing` | — | — |
| Dogs | Our dogs | Breeding stock focus | `/dogs` | — | Count or "Profiles coming soon" |
| Process | Deliberate placement | Selective inquiry process | `/health#placement` | — | — |

### Trust compound across cells

Each cell should **stand alone** (referrer may screenshot one cell) but **compound left-to-right**:

```
Standards (frame) → Health (verify intent) → Dogs (verify stock) → Process (verify selectivity)
```

Copy-chief: keep cell body to **one line each**; no superlatives; no invented test results or dog names in band.

### What proof band is NOT

- Not a replacement for `/health` education depth
- Not a CTA for **Begin your inquiry** — that remains tertiary below fold
- Not a scroll narrative substitute — no sequential reveal animation gating content

---

## 6. Optional post-v1 content notes

| Topic | v1 posture | Post-v1 option |
|-------|------------|----------------|
| **Blog** | **Deferred** — not MVP; route excluded | Topic clusters under `/blog` only after Health hub is live and operator capacity confirmed; SEO-manager validates keywords in Phase 14 |
| **Education hub** | **`/health` is the hub** | Expand `#standards`, `#testing`, `#temperament` with long-form; optional `/education` 301 → `/health` |
| **Litters** | Conditional on Q1 | Add nav + index when verified; link parents to `/dogs/[slug]` |
| **Social content** | Funnels to `/health` | Short posts → education anchors; never substitute for site proof |
| **Lead magnets** | **None v1** | Ungated education per GTM Phase 6 — interest list is sole capture |

### Searchable content backlog (appendix — not Phase 13 ship criteria)

When blog ships post-v1, prioritize **searchable** education aligned to P5:

| Topic cluster | Pillar | Buyer stage | Target route |
|---------------|--------|-------------|--------------|
| Rottweiler health testing explained | P3 | Problem-aware | `/health` spoke or `/blog/...` |
| ADRK vs. AKC Rottweiler type | P1 | Solution-aware | `/health#standards` spoke |
| Rottweiler temperament and family homes | P2 | Unaware → Problem-aware | `/health#temperament` spoke |
| How to evaluate a Rottweiler breeder | P5 | Problem-aware | `/health` spoke |
| Waitlist vs. interest list | P4 | Most aware | `/health#placement` spoke |

---

## 7. Conflicts / asks for CMO (copy-chief collision watch)

| Conflict | content-strategist position | Recommended resolution |
|----------|----------------------------|------------------------|
| **`13-copy-foundation.md` §2 pillar → scroll hierarchy** | Obsolete — uses Hero→Heritage→Structure→Temperament→Trust→Apply | **Replace** with §1 route map from this handoff |
| **Nav labels Heritage / Structure / Temperament / Trust / Apply** | Rejected in Phase 12 | Locked nav: Home → Dogs → Health/Education → About → Inquire |
| **`/apply` route language** | Rejected | `/inquire` only; **Begin your inquiry** |
| **"Power with nobility" as locked tagline** | Brand system §1 favors evidence-led line: *German Rottweilers. Deliberately bred.* | CMO/creative-director resolves; content-strategist does not lock tagline |
| **Cormorant / dark cinematic voice cues in copy foundation** | v1 anti-pattern | Editorial light; Libre Baskerville + Source Sans 3 per brand system |
| **Hero "no CTA in viewport 1" (v1 rule)** | Updated: proof band **is** viewport 1 content; tertiary inquire **not** in first viewport | Primary CTAs in band are **links to Dogs/Health**, not inquire |
| **copy-chief Package C form copy** | Package C = `/health#placement` prose only — no form variant | Align InquiryForm copy to Package A/B only |

---

## Summary for CMO merge checklist

- [ ] Replace scroll beat map with **route map** (§1)
- [ ] Add **page content jobs** + CTA table (§2)
- [ ] Replace Schwartz scroll mapping with **multi-page journey** (§3)
- [ ] Wire **empty-state rules** to Dogs, About, Health, Litters (§4)
- [ ] Lock **proof-band cell copy** to four-cell spec (§5)
- [ ] Mark blog as **deferred**; education on `/health` (§6)
- [ ] Resolve **copy-chief conflicts** in §7 before copy lock
