---
phase: "18"
position: paid-media-manager
reports_to: cmo
status: done
verdict_for_manager: ready_to_merge
llm_tier: strong-general
llm_model: composer-2.5
generation_profile: none
generation_used: none
fallback_applied: false
---

# Handoff — Paid Media Manager (CRO) → CMO

## Goal (from context packet)

Produce test hypotheses / CRO experiments for trust-first inquire conversion path. Even if paid later, design experiments that improve organic conversion and prepare paid landing readiness. Handoff only — CMO merges into `18-conversion.md`. Paid acquisition (Phase 19) deferred unless operator funds.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/18-paid-media-manager.md` | Full CRO draft for CMO merge into `18-conversion.md` |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | strong-general |
| llm_model | composer-2.5 |
| generation_profile | none |
| generation_used | none |
| fallback_applied | no |

## Decisions

- **Organic-first experiment design** — all hypotheses must improve referral/search conversion without paid traffic; paid landing readiness noted as secondary prep only.
- **Trust path is non-negotiable** — minimum path remains Home → (Dogs or Health) → Inquire; no apply-first or hero CTA tests.
- **Package A/B copy tests are in-scope** — but which package is live remains Q1 operator gate, not a CRO variable.
- **Form progressive disclosure** — testable for Package B only; Package A fields stay minimal; selective Package B fields must not be removed.
- **Analytics prerequisite flagged** — no GA/pixel wired in build today; all P0 tests blocked until basic event instrumentation ships.

## Asks for manager (`ask_manager`)

- Peer help needed: none
- Clarification needed: **Q7** — CRM/API destination must replace mailto stub before form-submit experiments are meaningful; **Q1** — confirms Package A vs B live mode for copy/form tests

## Risks / blockers

- **Low traffic volume** — bootstrapped organic launch may require 8–12 weeks per variant before statistical confidence; use directional reads + inquiry quality tagging instead of premature winner calls.
- **tool_status: unavailable** — Google Analytics / conversion pixel not wired in `apps/blacksage-kennels` (grep confirms no gtag/plausible/posthog). CRO tests cannot run until Phase 16+ instrumentation or lightweight Plausible/GA4 snippet added.
- **Q7 mailto stub** — form submit currently opens mail client; submit-rate metric is unreliable until backend destination exists.
- **Package mode env toggle** — `NEXT_PUBLIC_INQUIRE_PACKAGE=A|B` is build-time; A/B copy tests on `/inquire` require deploy or feature-flag pattern.

## Packs used

- `skills/org/positions/paid-media-manager/SKILL.md`
- `skills/org/HANDOFF-TEMPLATE.md`
- `skills/community/advertising-skills/skills/operator-os/conversion-path-builder/SKILL.md`
- `skills/community/marketingskills/ads/SKILL.md`

## Do not

- Mark the phase complete
- Write outside write_lease
- Spawn other positions
- Inherit parent model when MODEL-REGISTRY pins a different tier (esp. creative/legal)

---

## Draft for 18-conversion.md

**Phase:** 18 — Conversion optimization (CRO experiments)  
**Venture:** Blacksage Kennels  
**Scope:** Trust-first inquire path — organic conversion now; paid landing readiness note for deferred Phase 19  
**Author:** paid-media-manager IC  
**Status:** draft for CMO merge

### Context

Blacksage converts through a **trust-first multi-page path**: Home → Dogs / Health / About → Inquire. Primary CTA is **Begin your inquiry** only. Package A (interest list) or Package B (waitlist) is Q1-gated. Form submits via **mailto stub** until Q7 CRM destination is wired. Paid acquisition (Phase 19) is **skipped** unless operator funds — experiments below prioritize organic/referral traffic but note paid readiness where relevant.

**Current build surfaces (Phase 9):**

| Route | Conversion role |
|-------|-----------------|
| `/` | Proof summary band (4 cells); tertiary inquire band at bottom — no hero CTA |
| `/dogs` | Tier 1 empty state → Health primary link; tertiary Inquire |
| `/health` | Education depth; `#placement` explains Packages A–C |
| `/about` | Program principles; operator gap honest |
| `/inquire` | Package A/B form; trust footer; success = "Inquiry received" |

---

### 1. Test hypotheses (CRO backlog)

Prioritized for trust-first inquire conversion. Run one major test at a time on low-traffic site; compound learnings across quarters.

---

#### H1 — Proof-band cell order: Health-first vs Standards-first

| Field | Value |
|-------|-------|
| **Hypothesis** | If we reorder the proof summary band so **Health approach** is the first cell (left-most on desktop) instead of Standards-aligned, then **proof-band click-through to `/health#testing`** will increase and **inquire submit rate among visitors who clicked any proof cell** will increase, because serious Rottweiler buyers prioritize verifiable health transparency over breed-standard literacy on first scan. |
| **Primary metric** | Click rate on proof-band Health cell; % of sessions with `/health` view before `/inquire` |
| **Guardrail metrics** | Bounce rate on `/`; time on `/health`; spam/low-quality inquiry rate |
| **Variant A (control)** | Current order: Standards → Health → Dogs → Process |
| **Variant B** | Health → Standards → Process → Dogs *(Dogs last when empty — avoids dead-end first click)* |
| **Risk to brand locks** | **Low** — reorder only; no CTA or copy lock violations |
| **Priority** | **P0** |
| **Prerequisites** | Event tracking: `proof_band_click` with `cell_id`; session path stitching; ≥500 home sessions per variant |

---

#### H2 — Empty Dogs state: interest-path clarity (Package A framing)

| Field | Value |
|-------|-------|
| **Hypothesis** | If we replace the Dogs empty-state secondary link label from generic **Begin your inquiry** to **Join our interest list** (same `/inquire` destination, Package A copy alignment), then **inquire form start rate from `/dogs` referrals** will increase and **post-submit operator-reported inquiry quality** will improve, because visitors who land on empty Dogs self-select into correct Package A expectations instead of assuming waitlist availability. |
| **Primary metric** | `/dogs` → `/inquire` navigation rate; form start rate (referrer = `/dogs`) |
| **Guardrail metrics** | Overall inquire submit rate; anti-persona inquiry tags; bounce on `/inquire` |
| **Variant A (control)** | Secondary link: "Begin your inquiry →" (tertiary styling) |
| **Variant B** | Secondary link: "Join our interest list →" + one-line helper: "Not a reservation — we'll keep you informed as the program develops." |
| **Risk to brand locks** | **Low** — CTA still routes to `/inquire`; aligns with Package A copy foundation |
| **Priority** | **P0** |
| **Prerequisites** | Q1 = Package A (brand-first); `cta_click` events with `source_page` + `label`; operator inquiry quality tagging |

---

#### H3 — Minimum trust path: Health→Inquire vs Home→Inquire direct

| Field | Value |
|-------|-------|
| **Hypothesis** | If we add a **pre-inquire education checkpoint** on `/inquire` for visitors with no prior `/health` or `/dogs` session in the same visit (soft banner, not blocker), then **inquire bounce rate** will decrease and **submit rate among visitors who saw the banner and clicked through to `/health`** will exceed direct-submit rate, because cold deep-links need explicit permission to verify before committing to a long form. |
| **Primary metric** | `/inquire` bounce rate; submit rate segmented by `prior_trust_page_view` (yes/no) |
| **Guardrail metrics** | Total inquire submits (ensure banner doesn't suppress qualified deep-linkers); time on evidence pages |
| **Variant A (control)** | Current `/inquire` — no entry gate |
| **Variant B** | Conditional banner above form (non-blocking): "Most families review our [health & education approach](/health) before inquiring." Dismissible; does not hide form. |
| **Risk to brand locks** | **Low** — informational only; no popup, timer, or form hiding |
| **Priority** | **P1** |
| **Prerequisites** | Session-scoped page-view flag; banner impression/click/dismiss events; ≥200 `/inquire` sessions per variant |

---

#### H4 — Inquire form: Package B progressive disclosure (two-step)

| Field | Value |
|-------|-------|
| **Hypothesis** | If we split Package B inquire form into **Step 1 (contact + Why Blacksage + experience)** and **Step 2 (household, goals, timeline, Package B fields + consents)**, then **form completion rate** will increase because reducing initial field count lowers start friction while preserving selective qualification fields on Step 2. |
| **Primary metric** | Form completion rate (submit / form start); Step 1 → Step 2 progression rate |
| **Guardrail metrics** | Inquiry quality score (operator); field omission rate on Package B-only fields; time on `/inquire` |
| **Variant A (control)** | Single-page full form (current) |
| **Variant B** | Two-step with progress label "Step 1 of 2 — About you" / "Step 2 of 2 — Home & preferences"; all Package B fields retained on Step 2 |
| **Risk to brand locks** | **Low** — no fields removed; no dark patterns |
| **Priority** | **P1** |
| **Prerequisites** | Q1 = active program (Package B live); Q7 backend for reliable submit tracking; ≥50 form starts per variant |

---

#### H5 — Success message: expectation setting + next-step links

| Field | Value |
|-------|-------|
| **Hypothesis** | If we expand post-submit confirmation with **explicit response-time expectation** (`[RESPONSE_EXPECTATION]` when Q7 defined) and links to **Health `#placement`** + **interest nurture FAQ**, then **post-submit email open rate** (when Q7 wired) and **operator "when will you respond?" follow-up volume** will decrease, because anxiety-driven re-contact drops when expectations are set at conversion moment. |
| **Primary metric** | Operator follow-up "response timing" inquiries within 7 days; email 1 open rate (lifecycle) |
| **Guardrail metrics** | Secondary inquire rate (duplicate submissions); trust sentiment in reply emails |
| **Variant A (control)** | Current `InquiryConfirmation` — success title + body + return home |
| **Variant B** | Add: response SLA line; "What happens next" 3-bullet (review → contact if fit → no auto-approval); links to `/health#placement` and home |
| **Risk to brand locks** | **Low** — calm closure; no confetti, approval language, or urgency |
| **Priority** | **P1** |
| **Prerequisites** | Q7 `[RESPONSE_EXPECTATION]` operator copy; confirmation view event; lifecycle email wired |

---

#### H6 — Home inquire band: text link vs outline button

| Field | Value |
|-------|-------|
| **Hypothesis** | If we change the Home bottom inquire band CTA from **text link** to **outline button** (tan border, same "Begin your inquiry" label), then **Home → Inquire click rate** will increase without increasing **bounce on `/inquire` from unqualified visitors**, because affordance improves for ready buyers who completed proof-path reading while tertiary styling preserves non-aggressive tone. |
| **Primary metric** | Click rate on Home inquire band; `/inquire` entries with `referrer=home_inquire_band` |
| **Guardrail metrics** | Home bounce; % home→inquire with zero prior `/health` or `/dogs` view; inquiry quality |
| **Variant A (control)** | Text link "Begin your inquiry →" |
| **Variant B** | Outline `Button` variant — label unchanged |
| **Risk to brand locks** | **Low** — still below fold; not hero primary CTA |
| **Priority** | **P2** |
| **Prerequisites** | `cta_click` with `placement=home_inquire_band`; ≥300 home sessions per variant |

---

#### H7 — Proof-band copy: alternate Tier 1 bodies (copy foundation alts)

| Field | Value |
|-------|-------|
| **Hypothesis** | If we swap proof-band cell bodies to **copy foundation alternates** (e.g., Health cell: "Hips, elbows, eyes, cardiac, JLPP — our approach" vs control "Testing categories overview"), then **click-through to `/health#testing`** will increase because specificity signals evidence density to research-heavy buyers. |
| **Primary metric** | Proof-band click rate (all cells); `/health#testing` anchor views |
| **Guardrail metrics** | Tier 3 claim audit (must remain Tier 1); time on `/health`; inquire quality |
| **Variant A (control)** | Current bodies in `lib/constants.ts` PROOF_BAND |
| **Variant B** | Alternate bodies from `13-copy-foundation.md` §4 proof band alt table |
| **Risk to brand locks** | **Low** — pre-approved copy alternates only |
| **Priority** | **P2** |
| **Prerequisites** | Copy review by CMO; cell-level click tracking; ≥500 home sessions |

---

#### H8 — Package mode header clarity (A vs B expectation copy)

| Field | Value |
|-------|-------|
| **Hypothesis** | If we add a **visible Package mode explainer** above the form ("You're joining our interest list" vs "You're submitting for waitlist consideration") with one-sentence non-guarantee language repeated from `PackageModeHeader`, then **form abandonment at consent checkbox** will decrease because visitors who mismatch package expectations self-select out earlier instead of abandoning mid-form. |
| **Primary metric** | Consent checkbox reach rate; submit rate; abandonment step (last field touched) |
| **Guardrail metrics** | Anti-persona submits; operator "I thought this was a reservation" replies |
| **Variant A (control)** | Current `PackageModeHeader` only |
| **Variant B** | Add compact callout box restating mode headline + "not a reservation" before first field |
| **Risk to brand locks** | **Low** — uses locked Package A/B copy |
| **Priority** | **P2** |
| **Prerequisites** | Q1 resolved; form field funnel events; ≥40 form starts per variant |

---

#### H9 — Health `#placement` → Inquire pathing (inline CTA placement)

| Field | Value |
|-------|-------|
| **Hypothesis** | If we add a **mid-page text CTA** after `#testing` section ("Reviewed our health approach? [Begin your inquiry](/inquire)") in addition to existing `#placement` footer link, then **Health → Inquire conversion rate** will increase for visitors who read testing content but drop before placement section, because conversion prompt appears at peak verification moment without skipping education. |
| **Primary metric** | `/health` → `/inquire` rate; scroll depth to `#placement` |
| **Guardrail metrics** | Time on `/health` (ensure CTA doesn't shorten education); inquire quality |
| **Variant A (control)** | Inquire link only in `#placement` section |
| **Variant B** | Additional tertiary text link after `#testing` block — label: "Begin your inquiry" |
| **Risk to brand locks** | **Low** — text link only; not apply-first hero |
| **Priority** | **P2** |
| **Prerequisites** | Scroll/section view events; ≥150 `/health` sessions per variant |

---

#### H10 — Referrer attribution on form: "How did you hear" default prompt

| Field | Value |
|-------|-------|
| **Hypothesis** | If we add helper text to **How did you hear about us?** ("This helps us thank referrers and improve our resources — not used for marketing spam"), then **field completion rate** and **referral source accuracy** will increase because privacy-sensitive buyers understand why the field exists. |
| **Primary metric** | `howHeard` field completion rate; % "Referral" selections |
| **Guardrail metrics** | Form submit rate; time on form |
| **Variant A (control)** | Current label only |
| **Variant B** | Add `FormDescription` helper (1 sentence) |
| **Risk to brand locks** | **Low** |
| **Priority** | **P2** |
| **Prerequisites** | Form analytics; ≥30 submits per variant |

---

### Priority summary

| Priority | Hypotheses | Rationale |
|----------|------------|-----------|
| **P0** | H1, H2 | Highest leverage on home proof path + Dogs empty-state clarity; no form/backend dependency |
| **P1** | H3, H4, H5 | Trust-path enforcement, Package B UX, post-submit expectations — need moderate traffic or Q7 |
| **P2** | H6–H10 | Incremental UX/copy refinements; run after P0/P1 learnings |

**Recommended first test:** H1 (proof-band order) — pure IA change, directly supports D2 verify-before-inquire, measurable with lightweight analytics.

---

### 2. Explicit REJECT list (permanently out of bounds)

These experiments **must not** be proposed, built, or merged — they violate Blacksage brand locks, GTM plan, or copy foundation.

| Rejected experiment | Why forbidden |
|---------------------|---------------|
| **Apply-first hero CTA** on Home ("Begin your inquiry" above fold, filled primary) | Violates D2, SD4, copy foundation §5 — proof band only in viewport 1 |
| **Exit-intent popups / modal overlays** | Dark pattern; GTM explicitly rejects exit-intent and gated lead magnets |
| **Countdown timers / scarcity** ("Only X spots," "Limited time," litter countdown) | FOMO anti-pattern; violates P4 deliberate placement |
| **Fake urgency** (animated "X people viewing," stock availability ribbons) | Trust destruction; Tier 3 posture risk |
| **Price-led CTAs or on-site pricing tests** | A10 lock — no prices, deposits, or Buy/Shop/Reserve |
| **Shortened "quick apply" form** removing Package B qualification fields | Undermines selective placement; operator qualification risk |
| **Auto-open chat widgets / aggressive live chat** | Pressure tactic; inconsistent with calm voice |
| **Sticky floating "Inquire now" bar** on all pages | Apply-first behavior; mimics puppy-mill urgency UX |
| **Social proof spam** (fake review counts, unverified testimonial popups) | SD5 claim discipline |
| **Redirect `/inquire` → external Typeform with upsell** | Breaks owned-web trust surface (SD2) |
| **A/B test: "Apply now" vs "Begin your inquiry"** | "Apply now" is permanently rejected CTA language |
| **Guard-dog / protection angle landing variants** | Anti-persona magnet; aggression marketing lock |
| **Skip Health gate — forced single-page landing** replacing multi-page IA | Breaks trust-first architecture |
| **Email capture before inquiry** (separate popup list) | GTM: interest list *is* the capture — no duplicate funnels |
| **Paid-style VSL autoplay on Home** | Spectacle over evidence (SD8); rejected v1 pattern |
| **Package C checkout or deposit on-site** | Off-site only after approval |

---

### 3. Measurement & instrumentation

#### tool_status

| Tool | Status | Notes |
|------|--------|-------|
| Google Analytics 4 | **unavailable** | Not installed in `apps/blacksage-kennels` |
| Google Ads pixel | **unavailable** | Phase 19 deferred; no ad account |
| Meta pixel | **unavailable** | No rented paid social in base case |
| Search Console | **partial** | Sitemap exists; operator must verify property |
| Form backend / CRM | **unavailable** | Q7 mailto stub only — no server-side submit event |
| Plausible / Fathom / PostHog | **unavailable** | Recommend lightweight choice for privacy-first breed audience |

#### Events required for CRO

Implement via GA4, Plausible custom events, or PostHog — minimum viable set:

| Event | Parameters | Purpose |
|-------|------------|---------|
| `page_view` | `path`, `referrer`, `utm_*` | Baseline traffic |
| `proof_band_click` | `cell_id` (standards, health, dogs, process) | H1, H7 |
| `cta_click` | `label`, `placement`, `source_page`, `destination` | H2, H6, H9 |
| `nav_click` | `label`, `destination` | Header/footer pathing |
| `health_section_view` | `anchor` (standards, testing, temperament, placement) | Scroll engagement |
| `form_start` | `package_mode`, `referrer_path` | H4, H8 |
| `form_step_complete` | `step`, `package_mode` | H4 progressive disclosure |
| `form_field_error` | `field_name` | Friction diagnosis |
| `form_submit` | `package_mode`, `how_heard`, `prior_trust_pages[]` | Primary conversion |
| `form_submit_fail` | `error_type` | Q7/mailto reliability |
| `confirmation_view` | `package_mode` | H5 |
| `inquire_banner_*` | `action` (impression, click, dismiss) | H3 |

#### Derived metrics (report weekly)

| Metric | Definition |
|--------|------------|
| **Inquire submit rate** | `form_submit` / unique `/inquire` sessions |
| **Trust-path rate** | % submits where session included `/health` OR `/dogs` before `/inquire` |
| **Proof engagement rate** | % home sessions with ≥1 `proof_band_click` |
| **Qualified inquiry rate** | Operator tags: qualified / neutral / anti-persona (manual — not auto) |
| **Spam/low-quality rate** | Operator tags: incomplete, price-only, guard-dog — guardrail |
| **Health depth** | Median `health_section_view` count per session |

#### Minimum sample guidance

Bootstrapped organic site — expect **low volume**. Rules:

| Test type | Minimum before winner call | Notes |
|-----------|---------------------------|-------|
| **Page / CTA click tests** | ≥500 sessions per variant OR 4 weeks | Use 95% CI on click rate; if <30 clicks/variant, extend |
| **Form completion tests** | ≥50 form starts per variant | Binary conversion; do not call at n<30 |
| **Inquiry quality** | ≥20 operator-reviewed submits per variant | Qualitative guardrail overrides statistical win if quality drops |
| **Low traffic fallback** | Directional + quality | If <100 sessions/week, run sequential A→B months, not parallel |

**Do not** declare winners on single-week spikes. Seasonality in breed-buyer research cycles is slow — plan **8–12 week** test windows for P0 items.

#### Implementation note for CTO

Add analytics in `app/layout.tsx` or dedicated provider; respect cookie/consent posture operator chooses. Until wired, CRO backlog is **design-ready, execution-blocked**.

---

### 4. Paid landing readiness (Phase 19 prep — brief)

**Status:** Phase 19 **deferred** — $0 base case per GTM. Experiments above improve organic conversion regardless. If operator later funds paid, align to this readiness checklist (not a full `19-paid.md`).

#### Recommended paid entry path (if funded)

```
Ad click → Owned landing (NOT a stripped squeeze page)
         → Default: /health#testing or /health#standards (message-match anchor)
         → Secondary path: / (only if ad is brand/general)
         → Always allow full IA navigation — never trap in funnel
         → Convert on /inquire with same form + Package mode
```

**Do not** build separate paid-only landing pages that hide Dogs/Health/About navigation — breaks trust-first positioning and referrer-shareability (M5).

#### Message match rules

| Ad angle | Landing destination | Headline mirror |
|----------|---------------------|-----------------|
| Health transparency | `/health#testing` | Repeat ad promise in first H2 visible block |
| ADRK / standards literacy | `/health#standards` | FCI No. 147 language aligned to ad |
| Deliberate placement / selective breeder | `/health#placement` | "Begin your inquiry" only after placement copy |
| Brand introduction | `/` | Proof band visible; no hero inquire CTA |

Per ads skill: mirror winning ad headline in landing H1/subhead for 15–20% lift — but **never** mirror into apply-first or price-led layout.

#### Paid conversion events (when Phase 19 activates)

| Platform | Primary conversion | Secondary |
|----------|-------------------|-----------|
| Google Ads | `form_submit` (offline import if CRM) | `form_start`, `/health` engagement |
| Meta | `form_submit` or CRM custom event | ViewContent `/health` |

Requires Q7 CRM + consent-appropriate pixel. Until then, **do not** launch paid — optimize organic path first.

#### Budget / volume note

Category CPC for breeder intent is moderate; bootstrapped operator should expect paid to amplify **existing** converting path, not fix a broken one. Run H1–H5 organic winners **before** Phase 19 spend.

---

### Sources (draft)

- `06-gtm-plan.md` — D2 path, CTA locks, measurement posture, Phase 19 skip
- `13-copy-foundation.md` — CTA hierarchy, Package A/B copy, proof band alternates, minimum trust path
- `09-build-log.md` — routes, mailto stub, Package env toggle, no analytics
- `apps/blacksage-kennels/` — live IA confirmation
- `HANDOFFS/17-lifecycle-marketer.md` — post-submit email alignment for H5

---

## Verdict for manager

**ready_to_merge** — Ten prioritized CRO hypotheses (P0–P2), explicit REJECT list, measurement plan with tool_status, and brief Phase 19 paid landing readiness note. Awaiting CMO merge into `18-conversion.md`. Phase not marked complete.
