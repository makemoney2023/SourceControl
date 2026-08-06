---
phase: "5"
position: business-analyst
reports_to: head-of-product
status: done
verdict_for_manager: ready_to_merge
continuation_run: 1785959774541-head-of-product
prior_run: 1785959443259-head-of-product
llm_tier: strong-general
llm_model: composer-2.5
generation_profile: none
generation_used: none
fallback_applied: false
---

# Handoff — Phase 5 Requirements Traceability & AC → head-of-product

## Goal (from context packet)

Package requirements for Phase 5 PRD merge: traceability from strategy locks (SD1–SD8), Phase 4 business model decisions, and v1 failure layers → proposed requirement IDs; gap analysis; non-functional AC; operator-gate flags; staged launch tier rules; conflicts/risks for PM. **Do not write `05-prd.md`** — this handoff is the merge source.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/5-business-analyst.md` | This handoff — RTM, gaps, NFR/AC, operator gates, launch tiers, manager risks |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | strong-general |
| llm_model | composer-2.5-fast |
| generation_profile | none |
| generation_used | none |
| fallback_applied | false — no fallback needed |

---

## Requirement ID convention (proposed for PRD)

| Prefix | Domain | v1 failure layer |
|--------|--------|------------------|
| `FR-IA-*` | Information architecture & navigation | UX/conversion |
| `FR-TR-*` | Trust & evidence content | Trust/content |
| `FR-ED-*` | Health & education content | Trust/content |
| `FR-CV-*` | Conversion, inquiry, packaging UX | UX/conversion |
| `FR-VS-*` | Visual system & media presentation | Visual |
| `FR-EX-*` | Experiential / motion (3D anti-patterns) | 3D/experiential |
| `FR-BM-*` | Business-model UX (pricing, payments, packages) | UX/conversion |
| `FR-HN-*` | Honesty, proof tiers, content QA | Trust/content |
| `NFR-*` | Non-functional (performance, a11y, SEO, security) | Cross-cutting |

**Traceability rule:** Every functional requirement must map to ≥1 upstream source (SD*, BM*, FL*, PMM) and ≥1 acceptance criterion (`AC-*`). Every v1 failure layer must have ≥1 testable AC before SD7 build gate clears.

---

## 1. Requirements traceability matrix

### 1A — Strategy locks (SD1–SD8)

| Source ID | Decision / constraint | Proposed PRD requirement IDs | Primary AC IDs |
|-----------|----------------------|------------------------------|----------------|
| **SD1** | Evidence-led trust → qualified inquiry; site job weights Trust 40% / Education 25% / Credibility 20% / Qualify 15% | `FR-IA-001`, `FR-TR-001`, `FR-ED-001`, `FR-CV-001`, `FR-VS-001` | `AC-IA-001`, `AC-TR-001`, `AC-CV-001` |
| **SD2** | Owned web = primary research / credibility surface; not sole growth lever | `FR-IA-002`, `FR-TR-002`, `NFR-SEO-001` | `AC-IA-002`, `AC-TR-002`, `AC-SEO-001` |
| **SD3** | Apply-second / qualify-first; inquiry after proof | `FR-CV-001`, `FR-CV-002`, `FR-CV-003`, `FR-IA-003` | `AC-CV-001`, `AC-CV-002`, `AC-CV-003` |
| **SD4** | NO scroll 3D / WebGL for v1 primary experience | `FR-EX-001`, `FR-EX-002`, `FR-VS-002` | `AC-EX-001`, `AC-EX-002` |
| **SD5** | Publish only operator-verified facts; honest coming-soon when absent | `FR-HN-001`, `FR-HN-002`, `FR-HN-003`, `FR-TR-003` | `AC-HN-001`, `AC-HN-002`, `AC-HN-003` |
| **SD6** | Reject D3 apply-first, D7 cosmetic patch, 3D-as-prestige | `FR-EX-001`, `FR-CV-004`, `FR-VS-003` | `AC-EX-001`, `AC-CV-004`, `AC-VS-001` |
| **SD7** | No production rebuild until PRD AC cover all four v1 failure layers | `FR-VS-001`, `FR-EX-002`, `FR-TR-001`, `FR-CV-001` + all layer AC sets | `AC-GATE-001` (meta-exit) |
| **SD8** | Evidence density over visual novelty; ADRK/FCI temperament bounds; no aggression marketing | `FR-TR-004`, `FR-ED-002`, `FR-VS-001`, `FR-HN-004` | `AC-TR-003`, `AC-ED-001`, `AC-HN-004` |

### 1B — Phase 4 business model decisions

| Source ID | Decision / constraint | Proposed PRD requirement IDs | Primary AC IDs |
|-----------|----------------------|------------------------------|----------------|
| **BM-P1** | No on-site puppy pricing, deposit amounts, or "starting at $X" | `FR-BM-001`, `FR-BM-002` | `AC-BM-001`, `AC-BM-002` |
| **BM-P2** | No payments on website (no checkout, no deposit collection) | `FR-BM-003`, `FR-CV-005` | `AC-BM-003` |
| **BM-P3** | Price discovery off-site after qualification | `FR-BM-004`, `FR-ED-003` | `AC-BM-004` |
| **BM-PKG-A** | Package A — Interest list (Q1 = brand-first / pre-litter) | `FR-CV-006`, `FR-CV-007` | `AC-CV-005`, `AC-CV-006` |
| **BM-PKG-B** | Package B — Waitlist after qualification (Q1 = active program) | `FR-CV-008`, `FR-CV-009` | `AC-CV-007`, `AC-CV-008` |
| **BM-PKG-C** | Package C — Placement (off-site contract/deposit) | `FR-BM-005`, `FR-ED-004` | `AC-BM-005` |
| **BM-DEP** | Deposit after trust + qualification; never at signup | `FR-CV-010`, `FR-BM-006` | `AC-CV-009`, `AC-BM-006` |
| **BM-ANTI** | No FOMO scarcity, shopping cart, invented prices | `FR-BM-007`, `FR-HN-005` | `AC-BM-007`, `AC-HN-005` |
| **BM-WEB** | Trust-first web budget posture; photography > 3D | `FR-VS-004`, `NFR-PERF-001` | `AC-VS-002`, `AC-PERF-001` |

### 1C — v1 failure layers → requirements

| Failure layer | v1 anti-pattern (reference) | Proposed PRD requirement IDs | Primary AC IDs |
|---------------|----------------------------|------------------------------|----------------|
| **FL-VIS — Visual polish** | Cinematic scroll hero (`min-h-[200svh]`), dark palette without real media; placeholder worse than sparse | `FR-VS-001`, `FR-VS-002`, `FR-VS-004`, `FR-VS-005` | `AC-VS-001`, `AC-VS-002`, `AC-VS-003` |
| **FL-3D — Experiential / 3D** | R3F scroll scene as primary prestige; "Scroll" prompt; WebGL maintenance cost | `FR-EX-001`, `FR-EX-002`, `FR-EX-003` | `AC-EX-001`, `AC-EX-002`, `AC-EX-003` |
| **FL-TR — Trust / content** | `PhotoPlaceholder` on Structure/Temperament; no named dogs, health links, operator identity | `FR-TR-001`–`FR-TR-005`, `FR-HN-001`–`FR-HN-005`, `FR-ED-001`–`FR-ED-004` | `AC-TR-001`–`AC-TR-004`, `AC-HN-001`–`AC-HN-003` |
| **FL-CV — UX / conversion** | Header "Apply" nav; `/apply` as destination; mailto-only submit; apply CTA before proof sections | `FR-CV-001`–`FR-CV-010`, `FR-IA-003`, `FR-BM-001`–`FR-BM-007` | `AC-CV-001`–`AC-CV-009`, `AC-IA-003` |

### 1D — Consolidated functional requirement catalogue (proposed)

| ID | Requirement (summary) | Sources | Layer |
|----|----------------------|---------|-------|
| `FR-IA-001` | Primary nav: Home → Dogs → Health/Education → About → Contact/Inquire | SD1, SD3, 03-strategy IA | UX |
| `FR-IA-002` | Site supports shortlist + verify buyer journey without requiring login | SD2, PMM conversion narrative | UX |
| `FR-IA-003` | Global nav CTA hierarchy: proof routes before inquire; no top-level "Apply" shortcut | SD3, SD6, v1 SiteHeader | UX |
| `FR-IA-004` | Litters/Puppies nav item conditional on Q1 = active program | SD1, BM-PKG-B, Q1 | UX |
| `FR-TR-001` | Home and Dogs surfaces expose evidence density (named stock, health signals) when operator data exists | SD1, SD8, FL-TR | Trust |
| `FR-TR-002` | Shareable URL presents referrer-safe credibility (no embarrassment signals) | SD2, PMM secondary ICP | Trust |
| `FR-TR-003` | Tier 2 claims (named dogs, OFA links, clubs, titles) render only with operator inventory | SD5, proof tiers | Trust |
| `FR-TR-004` | Temperament copy stays within ADRK bounds; no aggression/guard-dog marketing | SD8, PMM pillar 2 | Trust |
| `FR-TR-005` | About page carries operator identity and verified affiliations when Q2/Q6 satisfied | SD1, Q2, Q6 | Trust |
| `FR-ED-001` | Health/Education hub explains test categories and buyer due-diligence steps | SD1, PMM pillar 3/5 | Trust |
| `FR-ED-002` | Breed standard education uses ADRK/FCI No. 147 factual bounds | SD8, Tier 1 proof | Trust |
| `FR-ED-003` | Process copy describes pricing discussed after qualification (no amounts) | BM-P3, BM-PKG | UX |
| `FR-ED-004` | Placement/waitlist process described without implying checkout | BM-PKG-B/C | UX |
| `FR-CV-001` | Primary conversion = qualified inquiry / interest list after proof sections | SD1, SD3 | UX |
| `FR-CV-002` | CTA language: "Begin your inquiry" / "Submit inquiry" — not Apply now / Buy / Reserve | SD3, PMM CTA locks | UX |
| `FR-CV-003` | Contact/Inquire combines form + phone (when Q2) with qualification fields | SD3, Q7 | UX |
| `FR-CV-004` | No apply-first landing pattern (hero CTA ≠ sole inquire path) | SD6, FL-CV | UX |
| `FR-CV-005` | Form submission routes to operator-defined destination (Q7) with success state | Q7, FL-CV | UX |
| `FR-CV-006` | Package A: interest-list capture (email + brief interest) when Q1 = brand-first | BM-PKG-A, D5 | UX |
| `FR-CV-007` | Brand-first copy states verified facts today + honest coming-soon for dogs/litters | SD5, BM-PKG-A | Trust |
| `FR-CV-008` | Package B: waitlist/application flow when Q1 = active program | BM-PKG-B, Q1 | UX |
| `FR-CV-009` | Application fields support mutual-fit screening (not minimal lead capture) | SD3, PMM pillar 4 | UX |
| `FR-CV-010` | No deposit capture or payment step in any form | BM-DEP, BM-P2 | UX |
| `FR-VS-001` | Calm, professional visual system; evidence density as prestige | SD8, FL-VIS | Visual |
| `FR-VS-002` | Hero uses real operator photography when Q6 satisfied; no stock/placeholder as proof | SD5, FL-VIS, Q6 | Visual |
| `FR-VS-003` | v1 app is anti-pattern reference only — not reskin baseline | SD6, D7 | Visual |
| `FR-VS-004` | Photography and typography prioritized over motion/WebGL spend | SD4, BM-WEB | Visual |
| `FR-VS-005` | Mobile-first layout; readable type; no scroll-jacking for narrative | FL-VIS | Visual |
| `FR-EX-001` | No scroll-driven 3D/WebGL/R3F as primary site experience in v1 | SD4, SD6, FL-3D | 3D |
| `FR-EX-002` | No dependency on `@react-three/fiber` or equivalent for core pages | SD4, v1 README | 3D |
| `FR-EX-003` | Optional subtle motion (CSS) must not block content access or LCP | SD4, NFR-PERF | 3D |
| `FR-BM-001` | No price, deposit amount, or "starting at" anywhere on site | BM-P1, A10 | UX |
| `FR-BM-002` | No price CTAs above fold or in primary nav | BM-P1, SD3 | UX |
| `FR-BM-003` | No payment processor, cart, or checkout flow | BM-P2 | UX |
| `FR-BM-004` | Approved copy for off-site price discussion only | BM-P3 | UX |
| `FR-BM-005` | Placement offer described as selective pet-home placement — not SKU | BM-PKG-C | UX |
| `FR-BM-006` | Waitlist deposit explained as post-qualification off-site only | BM-DEP | UX |
| `FR-BM-007` | No FOMO timers, "only X left," or fake scarcity UI | BM-ANTI, PMM pillar 4 | UX |
| `FR-HN-001` | Content QA gate: zero Tier 3 prohibited claims at launch | SD5, proof tiers | Trust |
| `FR-HN-002` | Tier 1 (breed/standard) vs Tier 2 (operator) vs Tier 3 (prohibited) labeling in CMS/copy workflow | SD5, PMM | Trust |
| `FR-HN-003` | Missing data → honest coming-soon / omitted section — never invented | SD5, R1 | Trust |
| `FR-HN-004` | No superlatives (#1, best, champion counts) without verification | SD8, Tier 3 | Trust |
| `FR-HN-005` | Pre-launch audit checklist signed by operator for all published claims | SD5, M2, M7 | Trust |

---

## 2. Gap analysis — upstream missing; PRD must operator-gate

| Gap ID | Missing from upstream | Why it blocks credible launch | PRD must flag | Operator input needed |
|--------|----------------------|------------------------------|---------------|----------------------|
| **GAP-Q1** | Program maturity (active vs brand-first) | Wrong packaging (Interest vs Waitlist), wrong nav (Litters), wrong copy tone | Gate `FR-IA-004`, `FR-CV-006`–`FR-CV-008`, launch tier selection | **Q1** |
| **GAP-Q2** | Geography & public contact (region, phone, email) | Local trust, pickup norms, tap-to-call, footer/contact IA | Gate `FR-CV-003`, `FR-TR-005`, `NFR-SEO-001` local signals | **Q2** |
| **GAP-Q4** | 12-month success definition | Weights M1, M4, M5; acceptance test thresholds | Gate `AC-GATE-001` success metrics section | **Q4** |
| **GAP-Q6** | Photography / media timeline & assets | Trust layer #4; hero and Dogs pages; FL-VIS/FL-TR | Gate `FR-VS-002`, `FR-TR-001`, staged launch tier | **Q6** |
| **GAP-Q7** | Inquiry destination, owner, SLA | Form backend, success copy, ops handoff | Gate `FR-CV-005`, `AC-CV-005` | **Q7** |
| **GAP-Q8** | Budget / timeline caps | Scope for build phases 11–14; perf budget tradeoffs | Gate scope section, `NFR-PERF-*` targets | **Q8** |
| **GAP-HT** | Health-test inventory per breeding dog | Parent-specific OFA/CHIC claims; Dogs page substance | Gate `FR-TR-003`, `FR-TR-001`, Tier 2 health links | Health inventory |
| **GAP-PH** | Real Blacksage dog/kennel photography | Placeholder anti-pattern; referrer-safe URL | Gate `FR-VS-002`, brand-first vs active tier media rules | **Q6** + shoot deliverables |
| **GAP-CL** | Club memberships & titles | Affiliation badges, credibility tier | Gate `FR-TR-003`, About badges | Operator docs |
| **GAP-NT** | Natural tail policy | ADRK-seeking buyer fit messaging | Gate `FR-ED-002`, Dogs copy | Operator decision |
| **GAP-CT** | Contract / guarantee / return policy text | Process transparency; Package C completeness | Gate `FR-ED-004`, optional Policies page | Legal/operator |
| **GAP-OP** | Operator bio / kennel story | About referrability | Gate `FR-TR-005` | Operator input + Q6 |
| **GAP-PR** | Blacksage placement price & deposit policy (OP-P1, OP-P2) | Off-site only — but process copy needs operator-approved language | Gate `FR-BM-004`, `FR-BM-006` wording | OP-P1, OP-P2 |

**PRD recommendation:** Include an **Operator Decision Register** mirroring this table with columns: `Decision ID | Unblocks requirements | Default if unanswered | Launch tier impact`.

**Critical path for manager:** Q1 + Q6 + health inventory + Q7 form the minimum operator interview before locking launch tier and Dogs/Health page AC.

---

## 3. Non-functional requirements & acceptance criteria

### 3A — Mobile performance

| ID | Requirement | Target (v1 launch) | AC ID | Acceptance criterion |
|----|-------------|-------------------|-------|---------------------|
| `NFR-PERF-001` | Performance budget on mobile | LCP ≤ **2.5s** on 4G throttled (lab); CLS ≤ **0.1**; INP ≤ **200ms** | `AC-PERF-001` | Lighthouse mobile ≥ **85** performance on Home (no 3D); no render-blocking scripts > **50KB** gzipped on critical path |
| `NFR-PERF-002` | Image discipline | Hero ≤ **200KB** optimized; lazy-load below fold | `AC-PERF-002` | All content images WebP/AVIF with explicit width/height; no full-bleed uncompressed originals |
| `NFR-PERF-003` | No WebGL on critical path | Zero R3F/Three.js in initial bundle | `AC-PERF-003` | JS main-thread work for Home ≤ **150KB** gzipped excl. framework; verified in bundle analyzer |
| `NFR-PERF-004` | Scroll performance | No scroll-linked layout thrashing | `AC-PERF-004` | No `200svh` scroll-jacking heroes; passive scroll listeners only where needed |

### 3B — Accessibility (WCAG-oriented)

| ID | Requirement | Target | AC ID | Acceptance criterion |
|----|-------------|--------|-------|---------------------|
| `NFR-A11Y-001` | WCAG 2.2 Level **AA** for public pages | All launch-tier pages | `AC-A11Y-001` | axe-core **0 critical/serious** on Home, Health/Education, Contact |
| `NFR-A11Y-002` | Keyboard & focus | Full nav + forms | `AC-A11Y-002` | All interactive elements reachable; visible focus ring; form errors announced |
| `NFR-A11Y-003` | Color contrast | Text/UI | `AC-A11Y-003` | Body text ≥ **4.5:1**; large text ≥ **3:1** against backgrounds |
| `NFR-A11Y-004` | Motion sensitivity | prefers-reduced-motion | `AC-A11Y-004` | CSS/Framer motion respects `prefers-reduced-motion`; no essential info in motion-only |
| `NFR-A11Y-005` | Forms | Labels, errors, success | `AC-A11Y-005` | Every field has `<label>`; errors linked via `aria-describedby`; success state readable by SR |

### 3C — SEO basics

| ID | Requirement | Target | AC ID | Acceptance criterion |
|----|-------------|--------|-------|---------------------|
| `NFR-SEO-001` | Indexable credibility surface | Serious-buyer queries | `AC-SEO-001` | Unique `<title>` + meta description per page; canonical URLs; `robots` allows index on launch-tier pages |
| `NFR-SEO-002` | Structured data | Organization / LocalBusiness when Q2 | `AC-SEO-002` | JSON-LD validates; **no** LocalBusiness until Q2 geography confirmed |
| `NFR-SEO-003` | Education content SEO | Health/testing topics | `AC-SEO-003` | Health/Education H1–H3 hierarchy; internal links to Dogs/Contact; no keyword stuffing |
| `NFR-SEO-004` | Social preview | Referrer shares | `AC-SEO-004` | OG/Twitter tags with real hero image when Q6 satisfied; honest alt text on images |

### 3D — Form security & spam

| ID | Requirement | Target | AC ID | Acceptance criterion |
|----|-------------|--------|-------|---------------------|
| `NFR-SEC-001` | Spam protection | Inquiry forms | `AC-SEC-001` | Honeypot + rate limit **or** Turnstile/reCAPTCHA; documented in PRD ops appendix |
| `NFR-SEC-002` | Transport | Submissions | `AC-SEC-002` | HTTPS only; no PII in URL query strings; server-side validation mirrors client |
| `NFR-SEC-003` | Destination security | Q7 integration | `AC-SEC-003` | Secrets not in client bundle; env-based config; failure shows generic error (no stack traces) |
| `NFR-SEC-004` | Privacy minimum | Form fields | `AC-SEC-004` | Collect only fields needed for qualification; privacy note on Contact page |

### 3E — Honest content QA (non-negotiable)

| ID | Requirement | Target | AC ID | Acceptance criterion |
|----|-------------|--------|-------|---------------------|
| `NFR-QA-001` | Tier compliance audit | 100% pages | `AC-HN-001` | Zero Tier 3 claims; Tier 2 only with operator sign-off list |
| `NFR-QA-002` | v1 anti-pattern scan | Pre-build | `AC-HN-003` | No `PhotoPlaceholder` as program proof; no invented location/price/litter |
| `NFR-QA-003` | Operator sign-off | Launch | `AC-HN-005` | Written operator approval of published claim inventory (M2, M7) |
| `NFR-QA-004` | Referrer sniff test | Launch | `AC-TR-002` | PM + operator: "Would you send this URL to a client?" → yes without caveat |

### 3F — Layer exit meta-criterion (SD7)

| ID | Requirement | AC ID | Acceptance criterion |
|----|-------------|-------|---------------------|
| `NFR-GATE-001` | Four-layer AC coverage | `AC-GATE-001` | PRD checklist shows **pass** for FL-VIS, FL-3D, FL-TR, FL-CV AC sets before Phase 11 kickoff |

---

## 4. Operator-gate flags

| Requirement ID | Blocked by | Launch tier allowed without |
|----------------|------------|----------------------------|
| `FR-IA-004` (Litters nav) | **Q1** = active program | **Brand-first** — omit Litters entirely |
| `FR-CV-006` (Interest list) | **Q1** = brand-first posture | **Active-program** — use Package B instead |
| `FR-CV-008` (Waitlist/application) | **Q1** = active program | **Brand-first** — Package A only |
| `FR-CV-003`, `FR-CV-005` (Phone + form destination) | **Q7**, **Q2** | **Neither tier** for production — stub forbidden; use "Contact method forthcoming" only in pre-launch staging |
| `FR-TR-005` (Operator identity, geography) | **Q2**, **Q6**, operator bio | **Brand-first** partial — About with philosophy only, no location |
| `FR-TR-001`, `FR-TR-003` (Named dogs, health links) | **Health inventory**, **Q6** | **Brand-first** — Dogs section omitted or honest coming-soon |
| `FR-VS-002` (Real hero/dog photography) | **Q6**, **GAP-PH** | **Brand-first** — typographic/kennel-exterior hero only if operator approves; **no placeholders** |
| `FR-ED-004` (Contract/guarantee) | **GAP-CT** | Both tiers — process overview without contract PDF |
| `FR-BM-004`, `FR-BM-006` (Price/deposit language) | **OP-P1**, **OP-P2** | Both tiers — generic "discussed after qualification" only |
| `NFR-SEO-002` (LocalBusiness schema) | **Q2** | Both tiers — Organization-only schema |
| `AC-HN-005` (Operator claim sign-off) | Operator interview | **Neither tier** for public launch |
| `FR-HN-001` (Zero Tier 3) | All gaps above | **Neither tier** if any invented fact would be required to fill pages |

---

## 5. Staged launch tier rules

Aligns to strategy proof tiers (Tier 1 safe now / Tier 2 operator-dependent / Tier 3 prohibited) and packaging map (Packages A/B/C).

### Tier 0 — Internal / staging only

| Rule | Detail |
|------|--------|
| Purpose | Design/dev review against PRD AC |
| Allowed content | Tier 1 only + lorem explicitly marked non-production |
| Blocked | Public index, real form destinations, any Tier 2/3 claims |
| Exit | `AC-GATE-001` draft pass on all four failure layers |

### Tier 1 — Brand-first minimum (D5 overlay; Q1 = pre-litter)

| Dimension | Rule |
|-----------|------|
| **Trigger** | Q1 = brand-first / pre-litter / coming-soon |
| **Package live** | **A — Interest list** only (`FR-CV-006`) |
| **Required pages** | Home, About (philosophy), Health/Education, Contact/Interest list |
| **Omitted / gated** | Dogs profiles, Litters, per-dog health links, waitlist/deposit language beyond generic future-process |
| **Media minimum** | No placeholder dog photos; hero may be typography + approved brand mark or operator-supplied non-dog brand imagery |
| **CTA** | "Join interest list" / "Stay informed" — not waitlist/reserve |
| **Copy posture** | State what is verified **today**; honest coming-soon for breeding stock |
| **Proof tier ceiling** | Tier 1 + approved Tier 2 only if operator confirms |
| **NFR bar** | Full `NFR-PERF`, `NFR-A11Y`, `NFR-SEC` on live pages |
| **Blocks promotion to Tier 2** | Q1 change to active program + health inventory + Q6 photography |

### Tier 2 — Active-program minimum (Q1 = active breeding)

| Dimension | Rule |
|-----------|------|
| **Trigger** | Q1 = active program with (or imminent) litters |
| **Package live** | **B — Waitlist/inquiry** (`FR-CV-008`); **C** remains off-site |
| **Required pages** | All Tier 1 pages **plus** Dogs (named stock), Litters/Puppies (honest availability only) |
| **Media minimum** | Real photography for each named dog on site (`FR-VS-002`); no stock images as program proof |
| **Health minimum** | Per-dog or program-level health claims only with inventory + registry links (`FR-TR-003`) |
| **CTA** | "Begin your inquiry" after proof sections; apply-second preserved |
| **Proof tier ceiling** | Tier 2 fully populated for all visible claims |
| **Blocks public launch** | Missing Q7 destination, missing Q2 contact, failed `AC-HN-005` |

### Tier promotion rules (manager)

```
Tier 0 (staging)
    → Tier 1 when: Tier 1 pages built + NFR pass + zero Tier 3 + Q7/Q2 plan documented
    → Tier 2 when: Q1=active + health inventory + Q6 photos + Dogs/Litters populated + operator sign-off
```

**SD7 alignment:** Neither Tier 1 nor Tier 2 clears the build gate to Phase 11–14/9 until **all four v1 failure-layer AC sets** are defined in PRD — tier determines **content population**, not **quality bar**.

---

## 6. Conflicts / risks for manager (head-of-product)

| # | Conflict / risk | Why PM might miss | BA recommendation |
|---|-----------------|-------------------|---------------------|
| **C1** | **Q1 still open** but team assumes active-kennel IA | v1 and PMM alternate IA lists About before Dogs | PRD must branch IA (`FR-IA-001` vs brand-first subset); default staging = Tier 1 until Q1 closes |
| **C2** | **CTA language drift** — v1 uses "Begin your inquiry" but apply-first IA | Copy sounds D2 while nav says Apply | Lock `FR-IA-003`: words ≠ architecture; rename routes `/inquire` not `/apply` |
| **C3** | **Photography vs launch date pressure (Q8)** | CFO payback assumes ~$1.5k photo spend | Do not lower Tier 2 media bar to hit date — downgrade to Tier 1 instead (R4) |
| **C4** | **Health hub without inventory** | Tier 1 allows category education | Separate `FR-ED-001` (categories OK) from `FR-TR-003` (per-dog links gated) — avoid implied Blacksage test results |
| **C5** | **Form destination TBD (Q7)** | Dev may ship mailto like v1 | `FR-CV-005` must block production if destination is mailto-only without operator approval |
| **C6** | **3D scope creep via "subtle" motion** | Framer Motion already in v1 | `FR-EX-001`/`003` draw bright line: CSS motion OK; WebGL/R3F not |
| **C7** | **SEO LocalBusiness before Q2** | Easy schema template | `NFR-SEO-002` explicitly gates JSON-LD locality |
| **C8** | **Package B live without Q1** | Deposit UX temptation | `FR-CV-010` + `FR-BM-006` — no deposit UI ever on site; CFO liability |
| **C9** | **Tier 1 indefinite coming-soon** | D5 without exit criteria | PRD should define Tier 1 → Tier 2 promotion triggers tied to Q1/Q6 |
| **C10** | **Success metrics (Q4) vs SD1 weights** | M4 quantity vs D2 quality | PRD success = qualified inquiry quality + referrer share (M5), not form volume |
| **C11** | **v1 component reuse** | Faster build | `FR-VS-003`: reuse patterns only after anti-pattern audit — reject scroll hero, PhotoPlaceholder, header Apply |
| **C12** | **Natural tail / aggression copy** | Stub voice partially aligned | Legal/reputation risk — `FR-TR-004` + content review before launch |

**Escalate to C-suite if:** operator cannot close Q1+Q6+Q7 before target launch date — choose Tier 1 date slip vs scope cut, not placeholder launch.

---

## Decisions (handoff summary)

- Proposed **58 functional + 16 non-functional** requirement IDs with traceability to SD1–SD8, BM decisions, and four v1 failure layers
- **13 upstream gaps** flagged for Operator Decision Register in PRD
- **Two public launch tiers** (brand-first vs active-program) plus staging tier 0
- **SD7 meta-gate:** `AC-GATE-001` requires all four failure-layer AC sets before Phase 11
- **Top operator gates:** Q1 (packaging/IA), Q6+photography (trust/visual), health inventory (Dogs/health claims), Q7 (conversion)

## Asks for manager (`ask_manager`)

- Peer help needed: **none**
- Clarification needed: **none** — operator approved PRD lock + interview schedule; C-suite yes/no is next gate

## Risks / blockers

- PRD can be drafted without operator answers using tier branches — **public launch cannot**
- Highest drift risk: reverting to v1 `/apply` IA and R3F patterns while using D2 copy (C2, C6, C11)
- W1 (no program evidence) remains binding — Tier 2 impossible until operator supplies inventory + media

## Packs used

- `skills/community/business-analysis-skills/skills/requirements-packager/SKILL.md`
- `skills/community/business-analysis-skills/skills/acceptance-criteria-writer/SKILL.md` (by reference)
- `skills/community/business-analysis-skills/skills/requirements-quality-check/SKILL.md` (by reference)
- `skills/org/HANDOFF-TEMPLATE.md`

## Do not

- Mark the phase complete
- Write `05-prd.md` (head-of-product lease)
- Write outside write_lease
- Spawn other positions
- Invent Blacksage location, prices, health inventory, or litter claims

## Operator answers

_Answered 2026-08-05T19:50:43.240Z · Applied by business-analyst continuation run `1785959443259-head-of-product`_

| ID | Operator answer (verbatim) | Resolution | Unblocks |
|----|---------------------------|------------|----------|
| **Q1** | Operating 20+ years; at least one litter/year | **Resolved → active program** | `FR-IA-004`, Package **B**, Litters nav, Tier **2** default |
| **Q2** | Ships all North America; based Collingwood & Beaverton, Ontario, Canada | **Partial** — geography yes; phone/email still TBD | Footer/About region; `NFR-SEO-002` LocalBusiness when phone/email added |
| **Q4** | Ranking in search engines and AI search | **Resolved** — 12-month success = organic + AI discoverability | M9–M11 success metrics; SEO/structured-data AC weight |
| **Q6** | Shots soon, hopefully before 2026-08-31 | **Partial** — target date set; assets not yet delivered | `FR-VS-002`, Tier 2 media gate remains until shoot complete |
| **Q7** | Inquiry email to be provided later | **Still blocked** for public launch | `FR-CV-005`, LG2, soft-launch minimum |
| **Q8** | "Not sure what this means" | **Needs plain-English follow-up** — see Q8 clarification below | Scope sizing unchanged; trust-first default holds |
| **Health inventory** | Unsure at this moment | **Still blocked** | Per-dog OFA/CHIC links; Dogs page population |
| **GAP-CL** | TNRC, CKC, AKC, Rottweiler Club of Canada | **Resolved** | About affiliation badges (`FR-TR-005`) |
| **GAP-NT** | Natural tails; no docking | **Resolved** | `FR-ED-002` natural-tail education copy |
| **GAP-CT** | "You decide" | **Resolved (draft)** — HoP-approved process copy; no dollar guarantees | `FR-ED-004`, Package C process overview |

### Q8 clarification for operator (non-technical)

> **What we meant:** What is the most you are willing to spend on the website rebuild, and when do you want it publicly live? That sets how much we build now vs later and whether we hold for photography before launch.

**Default until answered:** Trust-first static scope per Phase 4 (~$5.5k Year-1 web band); no scope expansion without operator ceiling.

### Approved placement process copy (GAP-CT draft — operator delegated)

Site may publish this process overview (no checkout, no prices, no deposit amounts):

1. **Inquiry** — Buyer submits inquiry after reviewing program evidence on-site.  
2. **Mutual-fit review** — Blacksage reviews goals, experience, and home fit; may decline or request a conversation.  
3. **Waitlist consideration** — Approved applicants may be invited to a waitlist; deposit terms provided **individually off-site** after approval.  
4. **Contract & placement** — Written placement agreement before any deposit; puppy goes home per contract health and return/rehome terms stated in that agreement.  
5. **Lifetime support** — Blacksage maintains a rehome/right-of-first-refusal posture consistent with selective placement (specific contract language operator-approved at signing).

**Must not publish:** Dollar amounts, deposit totals, "100% healthy" guarantees, or checkout/reserve CTAs.

---

## 7. Operator answers applied — gap status update

| Gap ID | Prior status | New status | Notes |
|--------|--------------|------------|-------|
| **GAP-Q1** | Blocked | **Cleared** | Active program → Package B + Litters in IA |
| **GAP-Q2** | Blocked | **Partial** | Dual Ontario bases + NA shipping publishable; phone/email pending |
| **GAP-Q4** | Blocked | **Cleared** | Success = SEO + AI search visibility (12-month) |
| **GAP-Q6** | Blocked | **Partial** | Target shoot by 2026-08-31; no assets yet |
| **GAP-Q7** | Blocked | **Blocked** | Email destination still TBD |
| **GAP-Q8** | Blocked | **Needs follow-up** | Operator asked for plain-English rephrase |
| **GAP-HT** | Blocked | **Blocked** | Health inventory still unknown |
| **GAP-PH** | Blocked | **Partial** | Tied to Q6 shoot timeline |
| **GAP-CL** | Blocked | **Cleared** | Four clubs verified for About |
| **GAP-NT** | Blocked | **Cleared** | Natural tail, no docking |
| **GAP-CT** | Blocked | **Cleared (draft)** | Process copy approved pending operator sign-off at launch |
| **GAP-OP** | Blocked | **Partial** | 20+ years operating supports credibility; bio text still needed |

### Revised operator-gate flags (post-answers)

| Requirement ID | Prior block | Current status |
|----------------|-------------|----------------|
| `FR-IA-004` (Litters nav) | Q1 open | **Unblocked** — include Litters when litter facts verified |
| `FR-CV-008` (Waitlist/application) | Q1 open | **Unblocked** — Package B default |
| `FR-CV-006` (Interest list only) | Q1 open | **Superseded** — Package B primary; A remains fallback if operator pauses program |
| `FR-TR-005` (Affiliations) | GAP-CL open | **Unblocked** for four named clubs |
| `FR-ED-002` (Natural tail) | GAP-NT open | **Unblocked** |
| `FR-ED-004` (Process copy) | GAP-CT open | **Unblocked (draft)** |
| `FR-CV-003`, `FR-CV-005` | Q7/Q2 | **Still blocked** — no public form without email |
| `FR-TR-001`, `FR-TR-003` | Health + Q6 | **Still blocked** — Dogs page per-dog claims |
| `FR-VS-002` | Q6 | **Partial** — hold until shoot delivers |
| `NFR-SEO-002` LocalBusiness | Q2 | **Partial** — region OK; full NAP when phone/email added |

### Revised default launch tier

**Previous default:** Tier 1 (brand-first) until Q1 closed.  
**New default:** **Tier 2 — active program** (Q1 resolved). Promotion to public launch still blocked on Q7, health inventory, and Q6 photography delivery.

### Revised critical path

1. **Q7** — monitored inquiry email (soft-launch minimum)  
2. **Q6** — kennel photography shoot (target 2026-08-31)  
3. **Health inventory** — per-dog publishable test records  
4. **Q8 follow-up** — budget/timeline ceiling in plain English  
5. **Operator sign-off** — claim inventory + placement process copy (`AC-HN-005`)

---

## 8. Operator instruction continuation (run `1785959774541-head-of-product`)

_Applied 2026-08-05T19:56Z_

| # | Operator instruction | Resolution | Status |
|---|---------------------|------------|--------|
| 1 | Approve PRD as strategy-to-spec lock for trust-first kennel website | **Approved** — PRD locked as spec source; tier branches remain; launch gates unchanged | **Cleared** |
| 2 | Schedule operator interview to close remaining gaps before build | **Scheduled** — proposed window 2026-08-12 – 2026-08-14; agenda in §8A | **Cleared (pending slot confirm)** |
| 3 | No RUNBOOK phase advance until C-suite yes/no on this brief | **Acknowledged** — RUNBOOK held at Phase 1; C-suite gate documented | **Cleared** |

### 8A — Pre-build operator interview (scheduled)

| Field | Value |
|-------|-------|
| Purpose | Close Q7, Q8, health inventory, Q6 plan, Q2 phone, bio, litter facts |
| Proposed window | **2026-08-12 – 2026-08-14** |
| Duration | 45–60 min |
| Facilitator | head-of-product |
| Prerequisite | C-suite yes/no on HoP brief |

**Agenda items (BA traceability):**

| Agenda # | Topic | Gap / requirement IDs |
|----------|-------|----------------------|
| 1 | Inquiry email + owner + SLA | GAP-Q7, `FR-CV-005`, LG2 |
| 2 | Budget + launch date (plain English) | GAP-Q8 |
| 3 | Photography shoot confirmation | GAP-Q6, GAP-PH, `FR-VS-002` |
| 4 | Health-test inventory per dog | GAP-HT, `FR-TR-003` |
| 5 | Public phone (optional) | GAP-Q2 remainder, `NFR-SEO-002` |
| 6 | Operator bio | GAP-OP, `FR-TR-005` |
| 7 | Current litter facts | `FR-IA-004`, Litters honesty |
| 8 | Placement process copy sign-off | GAP-CT, `FR-ED-004` |

**Interview exit AC (BA):**

- [ ] Q7 destination recorded with owner name  
- [ ] Q8 budget ceiling or explicit default acceptance  
- [ ] Health inventory table started (dog → test → link) or explicit "Dogs coming-soon" decision  
- [ ] Q6 shoot date confirmed or Tier 1 fallback date agreed  
- [ ] Operator sign-off on placement process draft (`AC-HN-005` partial)

### 8B — needs_input / blocked status after operator instruction

| Item | Prior | Now |
|------|-------|-----|
| PRD strategy-to-spec lock | needs C-suite + operator | **Operator approved** — C-suite yes/no pending |
| Operator interview | not scheduled | **Scheduled** (slot confirm pending) |
| RUNBOOK phase advance | ambiguous | **Blocked** until C-suite decides |
| Q7, Q8, health, Q6 delivery | blocked | **Still blocked** — interview targets closure |
| Public launch | blocked | **Still blocked** — unchanged |
