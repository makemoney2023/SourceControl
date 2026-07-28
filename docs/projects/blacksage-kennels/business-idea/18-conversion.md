# 18 Conversion

**Phase:** 18  
**Status:** draft — ready for C-suite review  
**Last updated:** 2026-07-27  
**Author:** cmo (merge); ICs: product-marketing-manager, paid-media-manager  
**Reports to:** ceo-strategist  
**Venture:** Blacksage Kennels  
**Mode:** Conversion UX / CRO (phase not marked complete)

---

## Executive summary

Blacksage converts through **evidence density, not urgency**. The owned site completes its GTM job at **qualified inquiry submission** — Packages A→B→C qualification, deposits, and placement happen off-site. Primary path: **Home → Dogs / Health / About → Inquire**. CTA lock: **Begin your inquiry**. CTA audit against rebuilt `apps/blacksage-kennels` **passes** (no apply-first, no FOMO, no price). Form delivery is a **mailto stub** until **Q7** CRM/ESP is wired. CRO backlog: **10 trust-safe hypotheses** (P0–P2) plus a permanent REJECT list; execution blocked until analytics + Q7.

**Locks held:** D2 trust-first · Begin your inquiry · Packages A→B→C (Q1-gated) · no dark patterns / FOMO / price · Q7 destination **open**.

---

## Strategic frame

| Lock | Conversion implication |
|------|------------------------|
| **D2 / SD1** | Proof before inquire; Home has no hero convert CTA |
| **SD2** | Owned web is primary conversion surface |
| **SD3** | Apply-second / qualify-first — `/apply` → `/inquire` only |
| **A10** | No on-site prices, deposits, or Buy CTAs |
| **Packages A/B/C** | Q1 gates form mode; C is education-only on site |
| **Phase 19** | Paid skipped unless funded — CRO optimizes organic first |

**North star (conceptual):** Qualified inquiry submissions where the buyer viewed ≥2 evidence pages (`/health`, `/dogs`, `/about`) in-session — optimize quality, not raw submit volume.

---

## 1. Funnel map

### Stages

| Stage | Buyer mindset | Primary surface | Page role | Success signal (conceptual) |
|-------|---------------|-----------------|-----------|----------------------------|
| **1 — Discover** | "Who is Blacksage?" | Borrowed/rented → **owned web** | Entry via `/`, deep links, `/apply`→`/inquire` | Session starts on owned domain |
| **2 — Shortlist** | "Worth keeping on my list?" | **Home** `/` | Proof summary band + positioning — no hero CTA | Proof-band clicks; time on Home > bounce |
| **3 — Verify** | "Can I trust this program?" | **Dogs** `/dogs`, **Health** `/health`, **About** `/about` | Evidence, education, operator honesty | ≥2 evidence pages before `/inquire` (heuristic) |
| **4 — Inquire** | "Ready to start a conversation" | **Inquire** `/inquire` | Package A or B form; mutual-fit framing | Form submit (A or B) |
| **5 — Package A/B/C** | Off-site qualification | Email / operator process | A interest → B waitlist → C placement | Operator-qualified lead — not a site metric |

### Owned-web page roles

| Route | Funnel stage | Job | CTA priority |
|-------|--------------|-----|--------------|
| `/` | Shortlist | Program identity + proof pathway | Proof links first; **Begin your inquiry** tertiary bottom band only |
| `/dogs` | Verify | Breeding stock proof or honest empty state | Primary: Health & testing; secondary: Begin your inquiry |
| `/health` | Verify + educate | Standards, testing, temperament, placement | Education links; placement CTAs at `#placement` |
| `/about` | Verify | Operator story, principles | Health link + tertiary inquire band |
| `/inquire` | Convert | Package A/B form; expectation copy | Submit inquiry (form action — not marketing CTA) |

### Entry points

| Source | Typical landing | Funnel note |
|--------|-----------------|-------------|
| Organic search | `/`, `/health`, `/dogs` | Education-first; verify on Health |
| Referrer / trainer | `/` or `/health` | Highest-quality path |
| Email return (Phase 17) | `/health`, `/dogs`, `/inquire` | Evidence first; inquire when ready |
| Optional social (Phase 17) | `/health` anchors | No DM-for-price |
| Legacy `/apply` | 301 → `/inquire` | No apply-first UX |
| Paid (Phase 19 — deferred) | Prefer `/health` or `/` proof path | Never price-led LP |

### Drop-off risks

| Stage | Risk | Mitigation (trust-first) |
|-------|------|--------------------------|
| Discover → Shortlist | Bounce from Home | Proof band above fold; no 3D hero |
| Shortlist → Verify | Exit seeking price/availability | Education teaser; anti-persona copy |
| Verify → Inquire | Never inquire after proof | Placement A/B/C explain; email nurture |
| Inquire → Submit | Form / mailto abandonment | Keep selective fields; fix delivery via Q7 |
| Submit → Package | No operator follow-up | **Open:** ESP/CRM + `[RESPONSE_SLA]` |

### Success metrics (conceptual — pre-Q7)

| Metric | Definition | Target posture |
|--------|------------|----------------|
| Inquiry submit rate | `/inquire` sessions → submit | Quality > volume |
| Evidence-before-inquire | Sessions with evidence pages before `/inquire` | Majority of converters |
| Proof-band engagement | Clicks on Home 4-cell band | Primary Home success vs hero CTA |
| Package mode accuracy | Submissions tagged A vs B | Matches Q1 gate |
| Anti-persona filter | Operator rejection / quality tags | Fewer price-only / guard-dog leads |

*Blocked until Q7 + analytics: server-side submit events, ESP confirmation, SLA tracking.*

---

## 2. CTA audit

**Scope:** `14-pages/*`, `13-copy-foundation.md`, rebuilt `apps/blacksage-kennels` (`/`, `/dogs`, `/health`, `/about`, `/inquire`; `/apply`→`/inquire`).

### Global — Nav + footer

| Location | Copy | Target | Compliance |
|----------|------|--------|------------|
| SiteHeader (desktop) | Begin your inquiry | `/inquire` | ✅ Lock |
| SiteHeader (mobile) | Inquire | `/inquire` | ⚠️ Label differs — not a forbidden CTA |
| SiteFooter | Inquire | `/inquire` | ✅ Nav convention |
| SiteFooter contact | `[CONTACT_EMAIL]` | — | ⚠️ Q7 placeholder |

**Home apply-first check:** ✅ **PASS** — No CTA in first viewport. Hero = H1 + subhead + proof-band text links only. Inquire only in bottom band.

### By route

| Route | CTAs | Compliance |
|-------|------|------------|
| **Home** | Proof band → Health/Dogs/Process; education + about teasers; bottom **Begin your inquiry →** | ✅ No Buy/Apply/Reserve; no scroll hint |
| **Dogs** (empty) | Primary Health & testing →; secondary **Begin your inquiry →** | ✅ Proof-first |
| **Health** | `#placement` A/B cards: headlines Join our interest list / Submit inquiry for waitlist consideration; CTAs **Begin your inquiry →**; C education only | ✅ Allowed Package labels + lock CTA |
| **About** | Tertiary **Begin your inquiry →**; Health secondary | ✅ |
| **Inquire** | H1 Begin your inquiry; PackageModeHeader A/B; Submit inquiry; success "Inquiry received" | ✅ Not "You're in!" / Apply now |

**Note:** Health `#placement` shows both A and B cards for education; live form mode is `NEXT_PUBLIC_INQUIRE_PACKAGE` on `/inquire`.

### Forbidden CTA scan (site-wide)

| Forbidden | Found? |
|-----------|--------|
| Apply now / Apply UX | ❌ (`/apply` redirects only) |
| Buy / Shop / Reserve | ❌ |
| Limited time / Act now / X left | ❌ |
| On-site pricing / deposit amounts | ❌ |
| Exit-intent / popup capture | ❌ |
| FOMO scarcity timers | ❌ |

### CTA hierarchy (locked)

```
Priority 1–4: Proof / education links (Dogs, Health, Process, Standards)
Priority 5–6: About / internal proof cross-links
Priority 7:    Begin your inquiry (tertiary — never dominant above fold on Home)
Form action:   Submit inquiry (on /inquire only)
```

---

## 3. Conversion path (primary)

### Happy path

```
Discover (search / referral / email)
    ↓
Home — proof summary band → shortlist
    ↓
Health/Education — standards, testing, temperament, placement
    ↓
Dogs — empty state → Health OR Tier 2 profiles
    ↓
About — principles + operator story
    ↓
Inquire — Package A or B form → submit
    ↓
Off-site — operator qualification → Package A / B / C
```

**Valid alternates:** Referrer → `/health` → `/about` → `/inquire`; email nurture → Health anchor → `/inquire`.

**Invalid (rejected):** Home hero → immediate `/inquire` without evidence. v1 apply-first pattern stays dead.

### Form friction

| Factor | Assessment | Rationale |
|--------|------------|-----------|
| Field count (10+ + consent) | High — intentional | Selective placement filter |
| Message 50+ chars | Required | Thoughtful inquiry |
| Experience / goals / timeline | Required | Operator qualification |
| Consent checkbox | Required | "Not a reservation" |
| Package B extras | When Q1 active | Waitlist-specific |
| Mailto submit | **Friction risk** | **Q7 open** — fix delivery, not field count |

**Verdict:** Do not shorten the form for CRO at the cost of lead quality. Close Q7 with API/ESP.

### Success / confirmation

| Package | Success posture | Follow-up |
|---------|-----------------|-----------|
| **A** | Inquiry received — individual review | Phase 17 interest nurture when ESP live |
| **B** | Inquiry received — **not** approval or waitlist confirmation | Waitlist nurture (event-driven) |

SLA: `[RESPONSE_EXPECTATION]` — operator-set before public launch. No confetti, no auto-approval language.

### Q7 open — mailto stub → CRM/ESP

| Today | Required for launch |
|-------|---------------------|
| `InquiryForm` → `mailto:[CONTACT_EMAIL]` | POST `/api/inquire` → CRM/ESP + operator copy |
| No server-side capture | Server record + analytics `form_submit` |
| No auto-reply | Wire Phase 17 `inquiry-welcome.md` |
| Confirmation after mailto attempt | Confirmation after API 200 |

**Status: OPEN** — conversion path treats mailto as stub only. Do not treat conversion as live until Q7 closes.

### Package A / B / C language

| Package | Q1 gate | Site headline | CTA link | Form | Payment |
|---------|---------|---------------|----------|------|---------|
| **A — Interest** | Brand-first / Tier 1 | Join our interest list | Begin your inquiry → | `PACKAGE=A` | None |
| **B — Waitlist** | Active program / Tier 2 | Submit inquiry for waitlist consideration | Begin your inquiry → | `PACKAGE=B` | Deposit off-site after approval |
| **C — Placement** | Operator process | How placement works | No form CTA | Education on `#placement` | Off-site contract |

**Staging:** A → B → C never invert. C is never a site conversion action.

### Anti-patterns (forbidden)

Apply-first / hero CTA · Exit-intent popups · Scarcity timers · Gated lead magnets · On-site price/deposit · Buy/Shop/Reserve · Sticky "Apply now" bar · Pushy chat widgets · SMS capture · Fake social-proof counters · Progress-bar pressure tactics on form

---

## 4. Test hypotheses (CRO backlog)

*Source: paid-media-manager. Organic-first; paid readiness secondary. Run one major test at a time on low traffic.*

### Priority summary

| Priority | IDs | Rationale |
|----------|-----|-----------|
| **P0** | H1, H2 | Home proof path + Dogs empty-state clarity; low backend dependency |
| **P1** | H3, H4, H5 | Trust-path banner, Package B two-step, success expectations — need traffic or Q7 |
| **P2** | H6–H10 | Incremental UX/copy after P0/P1 |

**Recommended first test:** H1 (proof-band order).

### P0

#### H1 — Proof-band cell order: Health-first vs Standards-first

| Field | Value |
|-------|-------|
| **Hypothesis** | If Health approach is first in the proof band (vs Standards), then `/health#testing` CTR and evidence-before-inquire rate increase — buyers prioritize health transparency on first scan. |
| **Primary metric** | Health cell click rate; % sessions with `/health` before `/inquire` |
| **Guardrails** | Home bounce; time on `/health`; spam/low-quality inquiry rate |
| **A / B** | Control: Standards → Health → Dogs → Process · Variant: Health → Standards → Process → Dogs |
| **Brand risk** | Low |
| **Prerequisites** | `proof_band_click`; ≥500 home sessions/variant |

#### H2 — Empty Dogs: interest-path clarity (Package A)

| Field | Value |
|-------|-------|
| **Hypothesis** | If Dogs empty-state secondary CTA uses **Join our interest list** (+ helper) instead of generic Begin your inquiry, then `/dogs`→`/inquire` start rate and inquiry quality improve under correct Package A expectations. |
| **Primary metric** | `/dogs` → `/inquire` rate; form start (referrer = dogs) |
| **Guardrails** | Overall submit rate; anti-persona tags; `/inquire` bounce |
| **A / B** | Control: Begin your inquiry → · Variant: Join our interest list → + one-line non-reservation helper |
| **Brand risk** | Low — still routes to `/inquire`; Package A language allowed |
| **Prerequisites** | Q1 = Package A; `cta_click` with source + label |

### P1

#### H3 — Soft pre-inquire education banner (cold deep-links)

Non-blocking banner on `/inquire` when session has no prior `/health` or `/dogs`: "Most families review our health & education approach before inquiring." Dismissible; form remains visible.  
**Metrics:** `/inquire` bounce; submit rate by `prior_trust_page_view`. **Risk:** Low. Needs ≥200 inquire sessions/variant.

#### H4 — Package B progressive disclosure (two-step)

Step 1: contact + Why Blacksage + experience. Step 2: household, goals, timeline, B fields + consents. **No fields removed.**  
**Metrics:** Completion rate; Step 1→2. **Guardrail:** Operator quality score. Needs Q1=B + Q7 + ≥50 starts/variant.

#### H5 — Success message: SLA + next steps

Add `[RESPONSE_EXPECTATION]`, 3-bullet "what happens next," links to `/health#placement` + home. No confetti/approval language.  
**Metrics:** Operator "when will you respond?" volume; email-1 open when lifecycle live. Needs Q7 copy.

### P2 (brief)

| ID | Test | Primary metric |
|----|------|----------------|
| **H6** | Home inquire band: text link vs outline button (same label, below fold) | Home→inquire click; guardrail: zero-evidence path % |
| **H7** | Proof-band body copy → Tier 1 alternates from copy foundation | Cell CTR; claim audit stays Tier 1 |
| **H8** | Compact Package mode callout above first field | Consent reach; abandon step |
| **H9** | Mid-page Health `#testing` tertiary **Begin your inquiry** link | Health→inquire; guardrail: time on Health |
| **H10** | Helper on "How did you hear" (referrer thank-you framing) | Field completion; Referral % |

### Soft optimizations (PMM — not formal A/B)

- Unify mobile nav label toward **Begin your inquiry** (watch truncation)
- Post-submit education link on confirmation
- Surface `[RESPONSE_SLA]` on inquire footer + confirmation when operator sets it
- Highlight active Package card on Health `#placement` when Q1 known
- UTM → `howHeard` pre-select when Q7 API exists

### What NOT to test / REJECT list

| Rejected experiment | Why |
|---------------------|-----|
| Apply-first / above-fold primary inquire on Home | D2 / copy foundation |
| Exit-intent popups / modal overlays | Dark pattern |
| Countdown / scarcity / "X spots left" | FOMO |
| Fake urgency counters | Trust / Tier 3 |
| Price-led CTAs or on-site pricing | A10 |
| Short "quick apply" removing qualification fields | Selective placement |
| Auto-open chat / sticky floating Inquire bar | Convert pressure |
| Fake review counts / unverified testimonial popups | SD5 |
| External Typeform upsell funnel | Breaks owned trust surface |
| A/B "Apply now" vs "Begin your inquiry" | Apply language permanently rejected |
| Guard-dog / protection landing variants | Anti-persona |
| Single-page squeeze replacing multi-page IA | Breaks trust-first |
| Separate popup email capture before inquiry | Duplicate funnel |
| Package C checkout / deposit on-site | Off-site only |
| SMS opt-in on form | Phase 17 skip + consent |

---

## 5. Measurement & instrumentation

### tool_status

| Tool | Status | Notes |
|------|--------|-------|
| Google Analytics 4 | **unavailable** | Not in `apps/blacksage-kennels` |
| Ads / Meta pixels | **unavailable** | Phase 19 deferred |
| Form backend / CRM | **unavailable** | Q7 mailto stub |
| Privacy-first analytics (Plausible / Fathom / PostHog) | **unavailable** | Recommended before CRO execution |

### Events required

| Event | Parameters | Purpose |
|-------|------------|---------|
| `page_view` | path, referrer, utm_* | Baseline |
| `proof_band_click` | cell_id | H1, H7 |
| `cta_click` | label, placement, source_page, destination | H2, H6, H9 |
| `health_section_view` | anchor | Depth |
| `form_start` / `form_step_complete` / `form_field_error` | package_mode, step | H4, H8 |
| `form_submit` / `form_submit_fail` | package_mode, how_heard, prior_trust_pages[] | Primary conversion |
| `confirmation_view` | package_mode | H5 |
| `inquire_banner_*` | impression / click / dismiss | H3 |

### Derived metrics

- **Inquire submit rate** = form_submit / unique `/inquire` sessions  
- **Trust-path rate** = % submits with prior `/health` OR `/dogs`  
- **Proof engagement rate** = % home sessions with ≥1 proof_band_click  
- **Qualified inquiry rate** = operator tags (manual)  
- **Spam / low-quality rate** = guardrail  

### Sample guidance (low traffic)

| Test type | Minimum before winner |
|-----------|----------------------|
| Page / CTA click | ≥500 sessions/variant OR 4 weeks |
| Form completion | ≥50 form starts/variant (not <30) |
| Inquiry quality | ≥20 operator-reviewed submits/variant |
| Fallback | Sequential months if <100 sessions/week |

Plan **8–12 week** windows for P0. Do not call winners on single-week spikes. Until analytics + Q7: backlog is **design-ready, execution-blocked**.

### Measurement prerequisites

| Prerequisite | Owner | Blocks |
|--------------|-------|--------|
| Q7 CRM/ESP + API | CTO / operator | Real submit rate, auto-reply |
| `[CONTACT_EMAIL]` + `[RESPONSE_SLA]` | Operator | Trust copy |
| Analytics snippet | CMO / CTO | Funnel metrics |
| Q1 package mode confirmed | Operator | Which form is canonical |
| Phase 17 ESP wire-up | lifecycle + CTO | Post-convert nurture |

---

## 6. Paid landing readiness (Phase 19 prep — brief)

**Status:** Phase 19 deferred ($0 base). If later funded:

```
Ad → Owned landing (not squeeze page)
   → Prefer /health#testing or #standards (message-match)
   → Or / for brand/general (proof band; no hero inquire)
   → Full IA navigation always available
   → Convert on /inquire (same form + Package mode)
```

| Ad angle | Landing | Rule |
|----------|---------|------|
| Health transparency | `/health#testing` | Mirror promise in first visible H2 |
| ADRK / standards | `/health#standards` | FCI No. 147 alignment |
| Deliberate placement | `/health#placement` | Inquire only after placement copy |
| Brand intro | `/` | No hero inquire CTA |

Run H1–H5 organic winners **before** spend. Do not launch paid until Q7 + consent-appropriate pixel exist.

---

## Open items

1. **Operator Q7** — `[CONTACT_EMAIL]`, `[RESPONSE_SLA]`, CRM/ESP destination (blocks live conversion + H4/H5 measurement).  
2. **Operator Q1** — Package A vs B live mode (gates H2/H4/H8).  
3. **CTO** — Analytics events + inquire API replacing mailto.  
4. Soft: mobile nav label consistency (Begin your inquiry vs Inquire).  

---

## Sources / skills used

- IC: `HANDOFFS/18-product-marketing-manager.md` (funnel, CTA audit, conversion path)  
- IC: `HANDOFFS/18-paid-media-manager.md` (hypotheses, REJECT, measurement, paid readiness)  
- Inputs: `05-prd.md`, `06-gtm-plan.md`, `09-build-log.md`, `12-web-design.md`, `13-copy-foundation.md`, `14-pages/`, `17-channels/`, `apps/blacksage-kennels/`  
- Packs: product-marketing, marketing-psychology, conversion-path-builder, ads  

---

*Phase 18 not marked complete — awaiting C-suite review.*
