# 05 Product Requirements Document (PRD)

**Phase:** 5  
**Status:** draft — ready for C-suite review  
**Last updated:** 2026-07-27  
**Author:** head-of-product (merge); ICs: product-manager, business-analyst  
**Reports to:** ceo-strategist  
**Venture:** Blacksage Kennels  
**Mode:** strategy → feature spec + roadmap slice (C-suite gate; phase not marked complete)

---

## Executive summary

Blacksage Kennels needs a **trust-first public website** that lets serious ADRK-aligned Rottweiler buyers **evaluate program credibility before initiating inquiry** — not a cosmetic reskin of the rejected v1 prototype. This PRD defines what ships in production rebuild (Phase 9), how staged launch tiers adapt to operator program maturity (Q1), and acceptance criteria covering **all four v1 failure layers** (visual, experiential/3D, trust/content, UX/conversion).

**Strategic locks inherited from Phase 3–4:**

| Lock | Requirement |
|------|-------------|
| **D2** | Evidence-led trust → qualified inquiry |
| **SD4** | No scroll-3D / WebGL as v1 requirement |
| **SD5** | Publish only operator-verified facts; honest coming-soon when absent |
| **SD6/SD7** | Reject D3 apply-first, D7 cosmetic patch; **full rebuild**, not extend v1 |
| **A10** | No on-site prices, payment UX, or Buy/Reserve/Shop CTAs |
| **Packaging** | A Interest list / B Waitlist / C Placement — gated by Q1 |

**Legacy anti-pattern:** `apps/blacksage-kennels` (Next.js + R3F scroll-3D, apply-first UX, placeholder content) is **reference only**. Production build replaces it entirely after Phases 11–14 and this PRD are approved — do not patch v1.

---

## Vision

**For** serious Rottweiler buyers who research health, structure, and program integrity before a 10+ year commitment, **Blacksage Kennels' website** is the **primary credibility and evaluation surface** — leading with verifiable evidence and standards-informed education, then inviting **qualified inquiry** through a calm, professional experience that referrers can share without embarrassment.

**Prestige in this category = evidence density**, not visual spectacle.

---

## Goals and success criteria

### Product goals

| # | Goal | Success signal | Kind |
|---|------|----------------|------|
| G1 | Buyer can **shortlist and verify** Blacksage during due diligence | Heuristic pass vs Phase 2 trust-signal checklist (named dogs when available, health transparency, education, process) | Inference |
| G2 | Referrer can share URL **without reputational risk** | Operator or referrer confirms shareability (M5) | Assumption |
| G3 | Site filters anti-persona leads (impulse, price-only, guard-dog fantasy) | Inquiry copy + education reduce unqualified volume | Inference |
| G4 | Operator accepts production presence vs v1 | Sign-off (M1) | Assumption |
| G5 | Zero invented kennel facts at launch | QA audit: 100% Tier 1–2 claim discipline (M7) | Decision |

### Non-goals (v1)

- Scroll-driven 3D / WebGL hero or primary differentiator (SD4)  
- On-site puppy pricing, deposit amounts, or "starting at" language (A10)  
- Shopping cart, instant reserve, Buy now / Shop / Reserve CTAs (D3)  
- Payment collection on website (Phase 4 decision)  
- Cosmetic patch or extension of `apps/blacksage-kennels` (D7)  
- Placeholder dog photography presented as program proof (SD5, Tier 3)

### 12-month metrics (hypothesis — operator Q4)

| Metric | Target | Assumption? |
|--------|--------|-------------|
| M1 Operator acceptance | Sign-off on production site | Yes |
| M2 Verified claims only | 100% published claims operator-verified | No |
| M3 Inquiry process documented | Destination + owner + response SLA | Yes (Q7) |
| M4 Qualified inquiries | Quality > volume; baseline TBD post-launch | Yes |
| M5 Referrer shareability | ≥1 referrer willing to share URL | Yes |
| M6 Shortlist + verify support | Passes Phase 2 heuristic on-site | No |
| M7 Zero invented facts | QA audit clean | No |
| M8 PRD AC on all four v1 layers | This document + Phase 10 QA | No |

---

## Personas

### P1 — Primary: Serious ADRK-aligned buyer

| Attribute | Detail |
|-----------|--------|
| **Who** | Research-heavy buyer seeking German/ADRK-aligned temperament and structure — family companion, sport/working, or import/pedigree focus |
| **Job** | Evaluate breeder credibility **before** contact |
| **Behavior** | OFA/CHIC lookup, standard comparison, 3–8 site scan; accepts waitlists |
| **Needs from site** | Named stock (when available), health categories, education, clear inquiry path **after** proof |
| **Anti-signals** | Hollow placeholders, apply-first, spectacle without evidence, price-forward UX |

### P2 — Secondary: Referrer

| Attribute | Detail |
|-----------|--------|
| **Who** | Trainer, prior owner, club member, show/working contact |
| **Job** | Recommend kennel without embarrassment |
| **Needs from site** | Shareable URL, evidence-dense IA, verifiable health story, professional tone |

### P3 — Operator / kennel owner

| Attribute | Detail |
|-----------|--------|
| **Who** | Blacksage program operator |
| **Job** | Convert **qualified** interest; protect reputation |
| **Needs from site** | Honest posture when facts pending; manageable inquiry flow; no false claims |

### Anti-persona (design to repel, not convert)

Impulse shoppers, guard-dog fantasy seekers, price-only comparators, checkout-expecters — filter via education, tone, and inquiry-after-trust IA.

---

## Information architecture

### Primary navigation (locked)

```
Home → Dogs → Health/Education → About → Contact/Inquire
```

| Section | Purpose | Trust-first rule |
|---------|---------|------------------|
| **Home** | Positioning, proof summary, pathway to Dogs/Health — **not** apply-first hero | Primary CTAs: View our dogs, Health & testing, Learn our process; tertiary: Begin your inquiry |
| **Dogs** | Named breeding stock when operator provides; honest empty state otherwise | No placeholder photos as proof |
| **Health/Education** | Health test categories, standard literacy, responsible ownership, placement process | Tier 1 safe; Tier 2 per-dog only when verified |
| **About** | Operator identity, program philosophy, geography/contact when Q2 confirmed | No invented location or tenure |
| **Contact/Inquire** | Inquiry form + optional phone/email when operator provides | **Reachable only after** user can navigate trust sections |

### Conditional sections (Q1-gated)

| Section | When live | When hidden / alternate |
|---------|-----------|-------------------------|
| **Litters / Puppies** | Q1 = active program with litter facts | Omit or "coming soon" with honest copy if pre-litter |
| **Waitlist application (Package B)** | Q1 = active + qualified inquiry path | Interest list only (Package A) if brand-first |
| **Deposit language** | Operator confirms waitlist policy (OP-P2) | Generic "terms provided individually" — **no dollar amounts** |

### CTA hierarchy (locked)

1. View our dogs / Health & testing  
2. Learn about our process  
3. Join interest list / **Begin your inquiry** / Contact  
4. **Never above fold:** Buy now, Available puppies, price CTAs, Reserve, Shop, Apply now

**Primary conversion CTA copy:** **"Begin your inquiry"** (button and form entry).

### Buyer journey on-site

```
DISCOVER → SHORTLIST → VERIFY (on-site) → CONTACT/INQUIRE
                              ↑
                    Site job completes here well
```

Trust pages (Home proof blocks, Dogs, Health/Education, About) **must be reachable and substantive before** the inquire flow is promoted as primary action.

---

## Packaging map (A / B / C) — Q1-gated

Three packages — **do not collapse**. Live UX depends on operator program maturity (Q1).

| Package | Trigger (Q1) | Site UX | Payment on site |
|---------|--------------|---------|-----------------|
| **A — Interest list** | Pre-litter / brand-first | Email + brief interest capture; honest "program in development" when true | **None** |
| **B — Waitlist** | Active program + qualified inquiry | Full application fields; copy states deposit **after** approval, off-site | **None** |
| **C — Placement** | Waitlist match + contract | Process description only; contract terms when operator provides | **None** — all off-site |

**PRD rule:** Site may describe process sequencing ("Pricing and deposit terms are discussed after qualification") but **must not** collect payments or show dollar amounts.

### Package-specific form behavior

| Field set | Package A (Interest) | Package B (Waitlist) |
|-----------|---------------------|----------------------|
| Core | Name, email, message | All Package A + extended fields (see Inquiry form) |
| Commitment copy | "Join our interest list" | "Submit inquiry for waitlist consideration" |
| Success state | Confirmation + expectations | Confirmation + review timeline (when Q7 defined) |
| Deposit mention | None | "A waitlist deposit may be required after approval. Terms provided individually." — **no amount** |

---

## Staged launch tiers

Launch tier selected by **Q1** (program maturity) and **Q6** (photography timeline). Both tiers must pass all four v1 failure-layer AC.

### Tier 1 — Brand-first (Q1 = pre-litter / coming-soon)

**Minimum live sections:** Home, About, Health/Education, Contact/Interest list  
**Dogs:** Honest empty state or "Breeding program in development" — **not** fake dog profiles  
**Litters:** Omitted or explicit coming-soon with verified facts only  
**Conversion:** Package A (Interest list) only  
**Photography:** Brand/kennel/environment slots per placeholder rules below; no stock dogs as Blacksage stock

### Tier 2 — Active program (Q1 = active breeding)

**Minimum live sections:** All primary IA sections including Dogs (+ Litters when litter facts verified)  
**Conversion:** Package A and/or B per operator policy; Package C described in process copy only  
**Photography:** Operator-supplied dog photos required for any named-dog claims  
**Health:** Per-dog clearance links only when operator inventory exists

### Tier 0 — Staging (internal only)

| Rule | Detail |
|------|--------|
| Purpose | Design/dev review against PRD AC before public launch |
| Allowed content | Tier 1 copy only; any lorem explicitly marked non-production |
| Blocked | Public index, production form destinations, Tier 2/3 claims |
| Exit | Draft pass on all four v1 failure-layer AC sets (`AC-GATE-001`) |

### Launch gates (both public tiers)

| Gate | Requirement |
|------|-------------|
| LG1 | Operator sign-off on all Tier 2 claims (`AC-HN-005`) |
| LG2 | Inquiry destination + owner defined (Q7) — **no mailto-only without operator approval** |
| LG3 | Photography rules satisfied — no Tier 3 violations |
| LG4 | PRD failure-layer AC signed by QA (Phase 10) |
| LG5 | No scroll-3D/WebGL in primary experience |
| LG6 | Rebuild is new codebase/deploy — not v1 patch |
| LG7 | **`AC-GATE-001`:** All four v1 failure-layer AC sets pass before Phase 11 kickoff (SD7) |

### Tier promotion

```
Tier 0 (staging)
  → Tier 1 when: Tier 1 pages built + NFR pass + zero Tier 3 + Q7/Q2 plan documented
  → Tier 2 when: Q1 = active + health inventory + Q6 photos + Dogs/Litters populated + operator sign-off
```

**Rule:** Tier determines **content population**, not **quality bar** — both public tiers must satisfy all four failure-layer AC.

---

## v1 failure layer coverage

v1 failed holistically (Mode E). Production rebuild must satisfy **all four layers** before Phase 9 build is approved.

### Layer 1 — Visual polish

**Problem:** Site felt subpar vs prestige kennel expectation; spectacle without authentic media.

| AC ID | Acceptance criterion |
|-------|---------------------|
| V1 | Calm, professional visual system — typography, spacing, color — consistent across breakpoints; no "template" or broken layout on mobile |
| V2 | Hero and above-fold communicate **program identity and proof pathway**, not "Scroll" or 3D spectacle |
| V3 | Real operator photography OR approved placeholder system (see Media rules) — never stock/fake dogs as program proof |
| V4 | Lighthouse Performance ≥ 85 mobile on production build (static-first; no WebGL blocking LCP) |
| V5 | WCAG 2.1 AA contrast and focus states on all interactive elements |

### Layer 2 — Experiential / 3D

**Problem:** Scroll-driven R3F scene did not deliver prestige or conversion; added complexity without trust ROI.

| AC ID | Acceptance criterion |
|-------|---------------------|
| E1 | **No scroll-driven 3D or WebGL** in v1 production experience (SD4) |
| E2 | No primary navigation or content gated behind scroll/interaction gimmicks |
| E3 | Page remains fully usable with JavaScript disabled or failed hydration (progressive enhancement for core content) |
| E4 | If optional ambient motion exists later, it is **decorative only**, does not replace proof sections, and passes performance AC — **post-v1 backlog only** |
| E5 | v1 R3F patterns in `apps/blacksage-kennels` documented as anti-patterns in build brief — not ported |

### Layer 3 — Trust / content

**Problem:** Serious buyers could not evaluate program; placeholder copy; risk of invented claims.

| AC ID | Acceptance criterion |
|-------|---------------------|
| T1 | Every kennel-specific claim maps to Tier 1 (safe) or Tier 2 (operator-verified) per `.agents/product-marketing.md` |
| T2 | Health/Education section publishes test **categories** (Tier 1) and per-dog results **only** with registry links when operator provides |
| T3 | Named dog pages exist **only** when operator supplies name, photo, and permitted claims |
| T4 | Honest coming-soon / interest-list posture when Q1 = brand-first — no invented litters, location, prices, titles |
| T5 | ADRK/FCI temperament copy stays within standard bounds — no aggression/guard-dog marketing |
| T6 | About page includes operator identity when provided; no fabricated biography |
| T7 | Referrer test: a trainer could share URL without apologizing for hollow content (M5 heuristic) |

### Layer 4 — UX / conversion

**Problem:** Apply-first path without trust prerequisites; undefined inquiry destination.

| AC ID | Acceptance criterion |
|-------|---------------------|
| U1 | Global nav exposes trust sections before Contact/Inquire is visually dominant |
| U2 | Primary site CTA language = **"Begin your inquiry"** — no Buy/Reserve/Shop/Apply now |
| U3 | No on-site prices, deposit amounts, or "starting at" (A10) |
| U4 | No payment fields, cart, or checkout flow |
| U5 | Inquiry form submits to operator-defined destination (Q7) with success/error states |
| U6 | Form fields match Package A or B spec below; spam protection (honeypot or equivalent) |
| U7 | Mobile: form usable on 320px width; tap targets ≥ 44px |
| U8 | SEO: unique title/description per major page; semantic headings; indexable trust content |

---

## Media and photography rules

Real photo placeholders **with rules** — placeholders are not permission to fake proof.

| Slot type | Allowed | Rules |
|-----------|---------|-------|
| **Brand/environment** | Kennel facility, landscape, non-dog brand imagery when operator provides | Label as operator media; alt text accurate |
| **Breed education** | Standard diagrams, ADRK-cited illustrations, generic breed structure (labeled "breed standard reference") | Must not imply specific Blacksage dog |
| **Dog profile** | Operator-supplied photos only | Named dog page requires operator sign-off on name + claims + image |
| **Prohibited** | Stock photos of Rottweilers presented as Blacksage stock | Tier 3 violation |
| **Prohibited** | AI-generated "kennel" or "our dogs" imagery | Tier 3 violation |
| **Empty state** | Typography + honest copy: "Breeding stock profiles coming soon" | Preferred over fake photo |

**Placeholder component requirements:**

- Visible distinction from verified dog photography (e.g., labeled slot, no fake names)  
- CMS or content config prevents publishing dog name without linked photo approval flag  
- QA checklist item: zero Tier 3 media violations at launch

---

## Inquiry form specification

### Shared fields (Package A & B)

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| Full name | text | Yes | 2–100 chars | |
| Email | email | Yes | RFC5322 basic | Primary contact |
| Phone | tel | No | E.164 or US format if provided | Surface if operator prefers phone follow-up (Q7) |
| City / State or Region | text | Yes | 2–100 chars | Fit and logistics screening; no invented service-area claims in copy until Q2 |
| How did you hear about us? | select | No | Enum + optional "Other" | Referral analytics |
| Message / Why Blacksage? | textarea | Yes | 50–2000 chars | Intent and fit signal |
| Prior Rottweiler experience | select | Yes | None / Pet owner / Working-sport / Breeder-experienced | Anti-persona filter |
| Household context | textarea | No | 0–1000 chars | Children, other pets, housing |
| Activity level / goals | select | Yes | Companion / Family / Sport-working / Show-structure | Match to program |
| Timeline | select | Yes | 0–6 mo / 6–12 mo / 12+ mo / Flexible | Waitlist alignment |
| Consent | checkbox | Yes | Must be checked | "I understand inquiry is not a reservation; placements are selective." |
| Honeypot | hidden | — | Must be empty | Spam mitigation |

### Package B additional fields (waitlist — Q1 active)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Preferred sex | select | No | Male / Female / No preference |
| Natural tail preference | select | No | If operator policy confirmed |
| Trainer or vet reference | text | No | Optional credibility signal |
| Agreement acknowledgment | checkbox | Yes | "I understand a waitlist deposit may be required after approval; terms provided individually." — **no amount** |

### Submission behavior

| Requirement | Detail |
|-------------|--------|
| Destination | Operator-defined: email, form backend, CRM webhook (Q7) — **must be configured before launch** |
| Success | Inline confirmation + email auto-reply if operator enables |
| Error | Clear retry message; no data loss on validation failure |
| Privacy | Link to privacy notice when operator provides |
| Rate limit | Basic abuse protection |

**Prohibited form patterns:** payment fields, deposit amount, puppy price, "Reserve now," instant confirmation of placement.

---

## User stories

### Epic 1 — Trust-first discovery

**US-1.1 — Evaluate from Home**  
As a **serious buyer**, I want the home page to summarize program focus and direct me to dogs and health content, so that I can start due diligence without being pushed to apply immediately.

**Acceptance criteria:** Home includes positioning statement, links to Dogs and Health/Education above fold; no Buy/Apply-now primary CTA; "Begin your inquiry" is tertiary or below proof summary.

**US-1.2 — Browse Dogs**  
As a **buyer**, I want to view named breeding stock with photos and verified claims when available, so that I can assess program quality.

**Acceptance criteria:** Dog index and detail templates exist; empty state when no operator dogs; per-dog health links only when verified; no stock photos as Blacksage dogs.

**US-1.3 — Learn health standards**  
As a **buyer**, I want education on health tests and ADRK-aligned standards, so that I can judge whether Blacksage meets my bar.

**Acceptance criteria:** Health/Education page covers Tier 1 categories; links to ADRK/OFA resources; no unlinked specific OFA claims.

### Epic 2 — Credible About and contact

**US-2.1 — Know the operator**  
As a **buyer**, I want to read about the breeder and program philosophy, so that I trust who stands behind the dogs.

**Acceptance criteria:** About page uses operator-supplied bio; honest gaps when pending; geography/contact only when Q2 confirmed.

**US-2.2 — Inquire after trust**  
As a **buyer**, I want to submit an inquiry after reviewing program content, so that my contact reflects informed interest.

**Acceptance criteria:** Contact/Inquire reachable from nav; form matches field spec; CTA "Begin your inquiry"; success state sets expectations (no "you're approved").

### Epic 3 — Referrer shareability

**US-3.1 — Share URL**  
As a **referrer**, I want a professional, evidence-led site I can send to clients, so that I am not embarrassed by hollow marketing.

**Acceptance criteria:** Passes T7 heuristic; no scroll gimmicks; mobile-readable; no placeholder dog fraud.

### Epic 4 — Operator honesty

**US-4.1 — Brand-first launch**  
As the **operator**, I want a coming-soon posture that does not invent litters or dogs, so that my reputation is protected while the program develops.

**Acceptance criteria:** Tier 1 launch tier available; Package A interest list; all Tier 3 prohibitions enforced in CMS/content review.

**US-4.2 — Active program launch**  
As the **operator**, I want waitlist inquiry capture when litters are active, so that I receive qualified applications off-site payment flow.

**Acceptance criteria:** Tier 2 launch tier; Package B fields when enabled; deposit discussed only in post-approval copy without amounts.

### Epic 5 — Technical quality

**US-5.1 — Mobile performance**  
As a **mobile researcher**, I want fast page loads without WebGL, so that I can evaluate the program on my phone.

**Acceptance criteria:** E1, V4 satisfied; LCP < 2.5s on 4G throttled test target.

**US-5.2 — Accessibility**  
As a **user with assistive tech**, I want navigable structure and readable contrast, so that I can access the same trust content.

**Acceptance criteria:** V5; semantic landmarks; form labels; keyboard nav through main IA.

**US-5.3 — SEO discovery**  
As a **buyer searching for ethical Rottweiler breeders**, I want indexable education content, so that I can discover Blacksage through search.

**Acceptance criteria:** U8; no cloaking; canonical URLs; sitemap for public trust pages.

---

## Requirements traceability

### ID conventions

| Prefix | Domain | Maps to v1 layer AC |
|--------|--------|---------------------|
| `FR-IA-*` | IA & navigation | U1–U8 |
| `FR-TR-*` / `FR-ED-*` | Trust & education content | T1–T7 |
| `FR-CV-*` / `FR-BM-*` | Conversion & business-model UX | U1–U8 |
| `FR-VS-*` | Visual system & media | V1–V5 |
| `FR-EX-*` | Experiential / 3D anti-patterns | E1–E5 |
| `FR-HN-*` | Honesty & content QA | T1–T7 |
| `NFR-*` | Performance, a11y, SEO, security | Cross-cutting |

**SD7 meta-gate:** `AC-GATE-001` — all four failure-layer AC sets (V, E, T, U) must pass before Phase 11 kickoff.

### Strategy locks → requirements (summary)

| Source | Proposed FR/NFR IDs |
|--------|---------------------|
| SD1 (trust-first) | `FR-IA-001`, `FR-TR-001`, `FR-ED-001`, `FR-CV-001` |
| SD3 (inquire after proof) | `FR-CV-001`–`003`, `FR-IA-003` |
| SD4 (no 3D v1) | `FR-EX-001`–`003` → E1–E5 |
| SD5 (honesty) | `FR-HN-001`–`005` → T1, T4, T6 |
| SD6/SD7 (no patch) | `FR-VS-003`, `FR-EX-002` → M-04, M-32 |
| BM-P1–P3 (no price/payment) | `FR-BM-001`–`003` → U3, U4 |
| BM-PKG A/B/C | `FR-CV-006`–`010` → packaging map |

Full RTM (58 FR + 16 NFR): see `HANDOFFS/5-business-analyst.md`.

### v1 anti-pattern routing (resolved)

v1 uses `/apply` nav and apply-first IA while copy says "Begin your inquiry." **Production rebuild:** route `/inquire` (or equivalent); global nav exposes trust sections before inquire dominance (`FR-IA-003`, U1). Words ≠ architecture.

---

## Operator Decision Register

| Decision ID | Unblocks | Default if unanswered | Launch tier impact |
|-------------|----------|----------------------|-------------------|
| **Q1** | Litters nav, Package A vs B | Staging defaults to **Tier 1** | Brand-first vs active-program |
| **Q2** | Contact, geography, LocalBusiness schema | About philosophy-only; no location | Tier 1 partial OK |
| **Q6** | Hero/dog photography | Typographic hero; honest empty Dogs | Tier 2 blocked |
| **Q7** | Form destination, SLA copy | **No public launch** — staging only | Both tiers |
| **Q8** | Build scope/timeline | Trust-first static scope per Phase 4 budget | Scope sizing |
| **Health inventory** | Named dogs, per-dog OFA links | Dogs omitted or coming-soon | Tier 2 blocked |
| **OP-P1/P2** | Price/deposit process copy | Generic "discussed after qualification" | Both tiers |

**Critical path:** Q1 + Q6 + health inventory + Q7 before locking launch tier and Dogs/Health page population.

---

## Non-functional requirements

### Performance (`NFR-PERF-*`)

| ID | Target | AC |
|----|--------|-----|
| `NFR-PERF-001` | LCP ≤ 2.5s (4G lab); CLS ≤ 0.1; INP ≤ 200ms | Lighthouse mobile ≥ 85 on Home; no 3D on critical path (V4) |
| `NFR-PERF-002` | Hero ≤ 200KB optimized; lazy-load below fold | WebP/AVIF with explicit dimensions |
| `NFR-PERF-003` | Zero R3F/Three.js in initial bundle | Home JS ≤ 150KB gzipped excl. framework |
| `NFR-PERF-004` | No scroll-jacking heroes | No `200svh` scroll narratives (v1 anti-pattern) |

### Accessibility (`NFR-A11Y-*`)

| ID | Target | AC |
|----|--------|-----|
| `NFR-A11Y-001` | WCAG 2.2 AA public pages | axe-core 0 critical/serious on Home, Health/Education, Contact |
| `NFR-A11Y-002` | Keyboard & focus | All interactive elements reachable; visible focus |
| `NFR-A11Y-003` | Contrast | Body ≥ 4.5:1; large text ≥ 3:1 (V5) |
| `NFR-A11Y-004` | `prefers-reduced-motion` | No essential info motion-only (v1 Framer patterns audited) |
| `NFR-A11Y-005` | Forms | Labels, `aria-describedby` errors, SR-readable success |

### SEO (`NFR-SEO-*`)

| ID | Target | AC |
|----|--------|-----|
| `NFR-SEO-001` | Indexable trust content | Unique title/meta per page; canonical URLs (U8) |
| `NFR-SEO-002` | Structured data | JSON-LD Organization; **LocalBusiness only when Q2 confirmed** |
| `NFR-SEO-003` | Education SEO | Health/Education H1–H3 hierarchy; internal links |
| `NFR-SEO-004` | Social preview | OG/Twitter with real hero when Q6 satisfied |

### Form security (`NFR-SEC-*`)

| ID | Target | AC |
|----|--------|-----|
| `NFR-SEC-001` | Spam protection | Honeypot + rate limit or Turnstile |
| `NFR-SEC-002` | Transport | HTTPS; no PII in URL; server-side validation |
| `NFR-SEC-003` | Destination security | Secrets in env; generic error on failure |
| `NFR-SEC-004` | Privacy minimum | Qualification fields only; privacy note on Contact |

### Content QA (`NFR-QA-*`)

| ID | Target | AC |
|----|--------|-----|
| `NFR-QA-001` | Tier compliance | Zero Tier 3 claims at launch |
| `NFR-QA-002` | v1 anti-pattern scan | No `PhotoPlaceholder` as program proof; no invented facts |
| `NFR-QA-003` | Operator sign-off | Written approval of claim inventory (M2, M7) |
| `NFR-QA-004` | Referrer sniff test | Operator/PM: URL shareable without caveat (T7, M5) |

---

## Functional requirements (by area)

### FR-1 Home

- Hero: program identity + proof pathway (not scroll-3D)  
- Proof summary blocks: standards alignment, health commitment, selective placement (Tier 1 copy)  
- Secondary CTAs to Dogs, Health/Education, About  
- Tertiary "Begin your inquiry" — not dominant above fold

### FR-2 Dogs

- Index: grid/list of operator-confirmed dogs  
- Detail: name, photo, role (sire/dam), permitted health/pedigree claims, link out to registries when available  
- Empty state component for brand-first tier

### FR-3 Health/Education

- Health testing overview (hips, elbows, eyes, cardiac, JLPP categories)  
- ADRK/FCI standard literacy (Tier 1)  
- Placement process overview (Packages A–C described without prices)  
- Optional articles slot for Phase 14 content

### FR-4 About

- Operator story, program principles, contact methods when Q2 closed  
- Club affiliations **only** when verified

### FR-5 Contact/Inquire

- Inquiry form per spec; package mode driven by Q1  
- Optional click-to-call/email when operator provides  
- No chat widget required v1

### FR-6 Litters (conditional)

- Live only when operator confirms litter facts  
- Litter page: parents (linked to Dogs), status, **no price**, inquiry CTA  
- If no litter: section omitted or coming-soon with honest copy

---

## MoSCoW prioritization

### Must have (32 items) — ship incomplete without these

| ID | Requirement |
|----|-------------|
| M-01 | IA: Home → Dogs → Health/Education → About → Contact/Inquire |
| M-02 | Trust-first CTA hierarchy; primary = "Begin your inquiry" |
| M-03 | No on-site prices, deposits, payment UX, Buy/Reserve/Shop |
| M-04 | Full rebuild — no v1 R3F/scroll-3D port (SD4, SD7) |
| M-05 | Tier 1 + Tier 2 claim discipline (SD5) |
| M-06 | Health/Education page with Tier 1 categories |
| M-07 | About page with operator content or honest pending state |
| M-08 | Dogs section with empty state + operator dog template |
| M-09 | Photo placeholder rules enforced — no fake program proof |
| M-10 | Inquiry form — shared fields + consent |
| M-11 | Form destination configured (Q7) before launch |
| M-12 | Package A interest list UX (brand-first minimum) |
| M-13 | Success/error states for inquiry submission |
| M-14 | Mobile-responsive layout all primary pages |
| M-15 | WCAG 2.1 AA baseline (V5) |
| M-16 | Mobile Lighthouse Performance ≥ 85 (V4) |
| M-17 | SEO basics: titles, meta, h1 hierarchy, sitemap (U8) |
| M-18 | v1 failure AC: Layer 1 Visual (V1–V5) |
| M-19 | v1 failure AC: Layer 2 Experiential (E1–E5) |
| M-20 | v1 failure AC: Layer 3 Trust (T1–T7) |
| M-21 | v1 failure AC: Layer 4 UX/Conversion (U1–U8) |
| M-22 | Staged launch tier selection documented at launch |
| M-23 | No aggression/guard-dog marketing (T5) |
| M-24 | Privacy/consent copy on inquiry |
| M-25 | Honeypot or spam protection on form |
| M-26 | Progressive enhancement — core content without WebGL (E3) |
| M-27 | Global nav exposes trust sections before inquire dominance (U1) |
| M-28 | Operator sign-off checklist for Tier 2 claims (LG1) |
| M-29 | Referrer-shareable professional visual system (V1, T7) |
| M-30 | Honest coming-soon when Q1 brand-first (T4, Tier 1 launch) |
| M-31 | Deposit/process copy without dollar amounts (Package B) |
| M-32 | Document v1 as anti-pattern in Phase 9 build brief |

### Should have (14 items) — important, target v1 launch

| ID | Requirement |
|----|-------------|
| S-01 | Package B waitlist extended form fields (Q1 active) |
| S-02 | Named dog detail pages when operator inventory ready |
| S-03 | Per-dog OFA/CHIC outbound links when verified |
| S-04 | Litters section when litter facts confirmed |
| S-05 | Click-to-call / mailto when Q2 contact confirmed |
| S-06 | Auto-reply email on inquiry submission |
| S-07 | Structured data (Organization, LocalBusiness) when geography confirmed |
| S-08 | FAQ slot on Health/Education or About |
| S-09 | Referral source analytics on form |
| S-10 | Content workflow flag: dog page requires photo approval |
| S-11 | 404 and error pages on-brand |
| S-12 | Open Graph tags for referrer previews |
| S-13 | Contract/guarantee PDF link when operator provides |
| S-14 | Natural tail policy copy when operator confirms |

### Could have (10 items) — post-v1 if time

| ID | Requirement |
|----|-------------|
| C-01 | Blog/articles for SEO depth |
| C-02 | Pedigree embed or PDF per dog |
| C-03 | Testimonials from verified owners |
| C-04 | Multi-language support |
| C-05 | Newsletter integration beyond interest list |
| C-06 | Instagram feed embed (social proof) |
| C-07 | Printable program summary PDF |
| C-08 | Advanced analytics dashboard for operator |
| C-09 | CRM native integration (vs email-only) |
| C-10 | Subtle ambient motion (non-scroll-gated, E4 compliant) |

### Won't have (v1) (12 items) — explicitly out of scope

| ID | Requirement |
|----|-------------|
| W-01 | Scroll-driven 3D / WebGL hero (SD4) |
| W-02 | On-site puppy pricing or "starting at" |
| W-03 | Shopping cart, checkout, payment processing |
| W-04 | Buy now / Reserve / Shop CTAs |
| W-05 | Apply-now above-fold primary CTA (D3) |
| W-06 | Cosmetic patch of `apps/blacksage-kennels` (D7) |
| W-07 | Stock or AI fake dog photos as program proof |
| W-08 | Invented location, litters, titles, health results |
| W-09 | FOMO scarcity timers / "only X puppies left" |
| W-10 | Deposit collection at signup |
| W-11 | Puppy marketplace / classified listing UX |
| W-12 | SMS or live chat as required launch feature |

### MoSCoW summary

| Category | Count |
|----------|-------|
| **Must** | 32 |
| **Should** | 14 |
| **Could** | 10 |
| **Won't** | 12 |
| **Total** | 68 |

---

## Technical direction (constraints for Phase 9 — not implementation spec)

| Topic | Direction |
|-------|-----------|
| **Build approach** | New production site; **replace** v1, do not extend |
| **Stack** | Static-first recommended (SSG/ISR) — align with Phase 9 architecture |
| **3D** | Excluded from v1 scope |
| **Forms** | Server-side or edge handler to operator destination; no client-only mailto |
| **CMS** | Operator-editable content for dogs/litters with approval flags preferred |
| **Hosting** | Bootstrapped budget ~$3k–5.5k Year-1 (Phase 4) |
| **Reference** | `apps/blacksage-kennels` — anti-patterns only |

---

## Dependencies and open questions

### Blocking launch (operator)

| ID | Question | PRD impact |
|----|----------|------------|
| **Q1** | Program maturity | Tier 1 vs 2; Package A vs B |
| **Q2** | Geography & contact | About, form, structured data |
| **Q6** | Photography timeline | Dog pages, hero media |
| **Q7** | Inquiry destination & owner | Form routing, SLA copy |
| **Q8** | Budget / timeline | Scope sizing for Phases 11–14 |
| **OP-P2** | Deposit policy | Package B copy only — no amounts on site |

### Upstream locks (closed)

D2 trust-first, SD4 no 3D v1, SD5 honesty, SD7 rebuild gate, IA order, CTA language, packaging A/B/C map, no price-forward UX.

---

## Risks

| Risk | Mitigation |
|------|------------|
| Operator facts delayed → hollow launch | Staged Tier 1 brand-first; honest coming-soon (T4) |
| Revert to v1 3D patterns | E1/E5 AC; v1 marked anti-pattern; SD4 |
| Placeholder photos as proof | Media rules; QA Tier 3 audit |
| Inquiry spam | Honeypot, rate limit |
| Scope creep to e-commerce | W-02–W-05 explicit Won't |
| Patch vs rebuild pressure | M-04, M-32; SD7 |

---

## Downstream handoff

| Phase | Owner | Carry forward |
|-------|-------|---------------|
| **6+ GTM** | cmo | CTA language, no invented prices, trust-first messaging |
| **10 QA** | qa | All v1 failure-layer AC IDs as test plan |
| **11 Brand** | creative-director | Calm prestige = evidence density; not v1 spectacle |
| **12 Web design** | web-designer | IA, placeholder rules, no 3D hero |
| **13 Copy** | copy-chief | Tier 1–3 claim discipline, pillar voice |
| **14 Content** | content-strategist | Health/education slots, dog page structure |
| **9 Build** | cto | Rebuild only; static-first; form to Q7 |

---

## Approval checklist

- [x] User stories map to MoSCoW Must items  
- [x] All four v1 failure layers have testable AC (22 IDs + `AC-GATE-001`)  
- [x] Staged launch tiers defined (Tier 0–2) with gates  
- [x] Packaging A/B/C mapped to Q1  
- [x] Inquiry form fields defined  
- [x] Media placeholder rules explicit  
- [x] No scroll-3D, price, or payment requirements in Must  
- [x] Rebuild-not-patch stated for Phase 9  
- [x] Operator Decision Register — no invented answers  
- [x] NFR traceability merged from business-analyst  
- [ ] C-suite review complete  

---

## IC merge notes

| IC | Handoff | Merged |
|----|---------|--------|
| product-manager | `HANDOFFS/5-product-manager.md` | PRD structure, user stories, MoSCoW, v1 layer AC, form spec, media rules |
| business-analyst | `HANDOFFS/5-business-analyst.md` | RTM, Operator Decision Register, NFR/AC, tier rules, `/inquire` routing |

**Conflicts resolved:**

- **Route naming:** v1 `/apply` vs D2 copy — **lock `/inquire`** (or equivalent) with trust-first nav (BA C2).
- **Health hub vs inventory:** Tier 1 allows category education (`FR-ED-001`); per-dog OFA links gated on inventory (BA C4).
- **Launch under photo pressure:** Downgrade to Tier 1 — do not lower Tier 2 media bar for date (BA C3, strategy R4).

---

## Sources

- `01-problem-framing.md`, `03-strategy.md`, `04-business-model.md`  
- `.agents/product-marketing.md`, `MEMORY/context.md`  
- `apps/blacksage-kennels` (v1 anti-pattern reference — replace in Phase 9, do not patch)  
- `HANDOFFS/5-product-manager.md`, `HANDOFFS/5-business-analyst.md`  
- Phase 3 locks SD1–SD8; Phase 4 packaging A/B/C  
- Model: `llm_tier: strong-general`, `llm_model: composer-2.5`, `generation_profile: none`
