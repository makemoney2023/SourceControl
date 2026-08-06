# 20 Analytics — Tracking Plan & Dashboard Spec

**Phase:** 20  
**Status:** draft — ready for C-suite review  
**Last updated:** 2026-07-27  
**Author:** head-of-data (merge); IC: analytics-engineer  
**Reports to:** ceo-strategist  
**Venture:** Blacksage Kennels  
**Mode:** Measurement design (phase not marked complete)

---

## Executive summary

Blacksage has **no analytics in `apps/blacksage-kennels` today**. Phase 20 defines a **trust-first measurement model** aligned to D2: optimize **qualified inquiry quality**, not raw volume. The owned site completes its GTM job at **inquiry submission** after evidence-page engagement.

**Recommended stack (CTO implements — head-of-data recommendation below + optional GSC):**

| Layer | Tool | Role |
|-------|------|------|
| **Primary (pick one)** | **Plausible** *(recommended)* | Privacy-first custom events for full taxonomy; lightweight; fits trust brand |
| | **Vercel Analytics** | Zero-config page views + Web Vitals if already on Vercel — pair with Plausible for custom events if needed |
| | **GA4** | Full event model + Search Console linking; heavier consent surface — use only if operator wants Google ecosystem |
| **Search** | Google Search Console | Organic queries, indexation — operator-owned (Phase 16) |
| **Off-site** | Operator CRM / ESP | Qualified inquiry tags — manual until Q7 closes |

**Head-of-data recommendation:** Ship **Plausible** as primary analytics (`lib/analytics/track.ts` adapter) for custom events (NS-1, proof-band, form funnel). Add **Vercel Web Analytics** in parallel if deploy target is Vercel — free Web Vitals row in dashboard §3.5 without duplicating page-view logic. Defer **GA4** unless operator explicitly wants Search Console deep linking and accepts cookie/consent UX. No paid ad pixels (Phase 19 skipped).

**Locks held:** D2 trust-first · `/inquire` (not `/apply`) · Packages A/B · Phase 19 paid **skipped** — no paid KPIs · Q7 mailto stub — still instrument `inquire_submit` client-side.

**Current build facts:** `InquiryForm` mailto stub · `ProofSummaryBand` 4-cell `PROOF_BAND` · `SiteHeader` Begin your inquiry CTA · `layout.tsx` has `metadataBase`, no analytics script · `sitemap.ts` + `robots.ts` exist.

---

## 1. North-star & supporting KPIs

### 1.1 North-star metric

| ID | Metric | Definition | Why north-star |
|----|--------|------------|----------------|
| **NS-1** | **Trust-path inquiry submit rate** | `inquire_submit` events where session included **≥2 distinct evidence routes** (`/health`, `/dogs`, `/about`) **before** first `/inquire` page view | Matches D2: evidence before inquire; quality over volume (18-conversion § Strategic frame) |

**Formula:**

```
NS-1 = count(inquire_submit WHERE prior_evidence_pages >= 2)
       / count(unique /inquire sessions)
```

**Target posture:** Majority of submits follow trust path — **no numeric target at Phase 20** (ASSUMPTION: baseline established in first 90 days post-launch).

### 1.2 Primary supporting KPIs

| ID | Metric | Definition | Target posture |
|----|--------|------------|----------------|
| **KPI-1** | Inquiry submit rate | `inquire_submit` / unique `/inquire` sessions | Quality > volume; watch alongside NS-1 |
| **KPI-2** | Evidence-before-inquire rate | % of `/inquire` sessions with prior `/health` OR `/dogs` OR `/about` view | **ASSUMPTION:** >60% at steady state for organic traffic |
| **KPI-3** | Proof-band engagement rate | % home sessions with ≥1 `proof_band_click` | Primary Home success vs hero CTA (18-conversion H1) |
| **KPI-4** | Health depth rate | % `/health` sessions with ≥2 `health_section_view` anchors | Education engagement before convert |
| **KPI-5** | Qualified inquiry rate | Operator tags submit as qualified / neutral / anti-persona | **Manual** until Q7 CRM; not automatable at launch |
| **KPI-6** | Referral-attributed submit share | % `inquire_submit` where `how_heard = referral` | Supports M5 referrer GTM bet — **ASSUMPTION:** track mix, no volume target |

### 1.3 Guardrail metrics (do not optimize up)

| ID | Metric | Definition | Alert if |
|----|--------|------------|----------|
| **G-1** | Zero-evidence inquire rate | `/inquire` → submit with **no** prior `/health`, `/dogs`, `/about` | Rising week-over-week |
| **G-2** | Home bounce rate | Single-page sessions landing on `/` | Spikes after IA/copy changes |
| **G-3** | Inquire form abandon rate | `inquire_start` without `inquire_submit` | Spikes after form changes (not mailto friction alone) |
| **G-4** | Anti-persona signal rate | Operator tags + `goals`/`experience` patterns (manual) | Operator reports surge |

### 1.4 Explicitly excluded KPIs (Phase 19 skipped / locks)

| Excluded | Reason |
|----------|--------|
| Paid ROAS, CPA, ad CTR | Phase 19 deferred ($0 budget) |
| Raw traffic / follower counts | GTM: not success (06-gtm-plan §7) |
| Revenue / deposit amounts | A10 — off-site only |
| Form volume alone | Quality > volume lock |

### 1.5 Operator manual metrics (post-submit — off analytics stack)

| Metric | Source | When |
|--------|--------|------|
| Qualified vs anti-persona tags | Operator review / future CRM | After Q7 |
| Response SLA adherence | Operator process | When `[RESPONSE_EXPECTATION]` set |
| Referrer thank-you (qualified only) | Operator 1:1 | Per 06-gtm-plan referral loop |
| M5 referrer shareability | Operator sniff test | Pre/post launch qualitative |

---

## 2. Event taxonomy

### 2.1 Conventions

| Rule | Value |
|------|-------|
| Event naming | `snake_case` verbs; GA4-compatible |
| Route values | Normalized path: `/`, `/dogs`, `/health`, `/about`, `/inquire` |
| Package mode | `A` \| `B` from `NEXT_PUBLIC_INQUIRE_PACKAGE` / runtime |
| Session evidence | Client `sessionStorage` key `bsk_evidence_pages` — array of routes visited |
| UTM capture | Parse once on landing; attach to all events in session |
| PII policy | **Never** send name, email, phone, message body to analytics |
| Mailto stub | Fire `inquire_submit` on successful mailto handoff until Q7 API replaces it |

### 2.2 Core events

#### `page_view`

Automatic via analytics provider **or** explicit on App Router navigation if using custom pipeline.

| Property | Type | Required | Notes |
|----------|------|----------|-------|
| `path` | string | ✅ | e.g. `/health` |
| `route_name` | enum | ✅ | `home` \| `dogs` \| `health` \| `about` \| `inquire` |
| `referrer` | string | optional | document.referrer |
| `utm_source` | string | optional | From URL or session |
| `utm_medium` | string | optional | |
| `utm_campaign` | string | optional | |
| `package_mode` | `A` \| `B` | optional | Only on `/inquire` |
| `is_returning` | boolean | optional | Provider-dependent |

**Trigger:** Each Must-route load (including `/apply` redirect landing on `/inquire` — tag `entry_via_apply_redirect: true` if detectable).

---

#### `proof_band_view`

Proof summary band entered viewport on Home.

| Property | Type | Required | Notes |
|----------|------|----------|-------|
| `path` | `/` | ✅ | |
| `visible_cells` | number | optional | Count of cells ≥50% visible |

**Trigger:** `ProofSummaryBand` — IntersectionObserver once per session.

---

#### `proof_band_click`

| Property | Type | Required | Notes |
|----------|------|----------|-------|
| `cell_id` | enum | ✅ | `standards` \| `health` \| `dogs` \| `placement` |
| `cell_title` | string | ✅ | From `PROOF_BAND[].title` |
| `destination` | string | ✅ | e.g. `/health#standards` |
| `path` | `/` | ✅ | |
| `link_label` | string | optional | e.g. "View standards →" |

**Mapping (`lib/constants.ts` PROOF_BAND index → cell_id):**

| Index | title | href | cell_id |
|-------|-------|------|---------|
| 0 | Standards-aligned | `/health#standards` | `standards` |
| 1 | Health approach | `/health#testing` | `health` |
| 2 | Our dogs | `/dogs` | `dogs` |
| 3 | Deliberate placement | `/health#placement` | `placement` |

**Trigger:** Click on proof-band `Link` in `components/proof/ProofSummaryBand.tsx`.

---

#### `cta_click`

Any tracked CTA link or nav item leading to conversion or evidence.

| Property | Type | Required | Notes |
|----------|------|----------|-------|
| `label` | string | ✅ | Visible copy e.g. "Begin your inquiry" |
| `placement` | enum | ✅ | See placement enum below |
| `source_page` | string | ✅ | Current path |
| `destination` | string | ✅ | href target |
| `priority` | 1–7 | optional | 18-conversion CTA hierarchy |

**`placement` enum:**

| Value | Example surfaces |
|-------|------------------|
| `header_nav_desktop` | `SiteHeader` lg nav — "Begin your inquiry" |
| `header_nav_mobile` | `SiteHeader` mobile — "Inquire" |
| `footer_nav` | `SiteFooter` nav |
| `home_proof_teaser` | Home body links to `/health`, `/dogs` |
| `home_education_band` | Home "Read our health & education approach" |
| `home_about_teaser` | Home "About our program" |
| `home_inquire_band` | Home bottom "Begin your inquiry →" |
| `dogs_empty_primary` | Dogs → Health & testing |
| `dogs_empty_secondary` | Dogs → Begin your inquiry |
| `health_placement_card_a` | Health `#placement` Package A card |
| `health_placement_card_b` | Health `#placement` Package B card |
| `health_external_resource` | ADRK/OFA outbound (optional — lower priority) |
| `about_inquire_band` | About tertiary inquire (if present) |
| `inquire_footer` | Inquire page footer cross-links |

**Trigger:** Wrapper `TrackedLink` or onClick handler on all CTA `Link` components listed in §4.

---

#### `health_section_view`

Health page anchor section ≥50% visible.

| Property | Type | Required | Notes |
|----------|------|----------|-------|
| `anchor` | enum | ✅ | `standards` \| `testing` \| `temperament` \| `placement` |
| `path` | `/health` | ✅ | |
| `depth_order` | number | optional | 1st, 2nd, 3rd section viewed in session |

**Trigger:** IntersectionObserver on `#standards`, `#testing`, `#temperament`, `#placement` in `app/health/page.tsx` (client subcomponent recommended).

---

#### `inquire_start`

User begins meaningful form interaction on `/inquire`.

| Property | Type | Required | Notes |
|----------|------|----------|-------|
| `package_mode` | `A` \| `B` | ✅ | |
| `prior_evidence_pages` | string[] | ✅ | From session storage e.g. `["/health","/about"]` |
| `prior_evidence_count` | number | ✅ | Length of array |
| `entry_referrer` | string | optional | document.referrer |
| `how_heard_prefill` | string | optional | If UTM → pre-select wired later |

**Trigger:** First focus or first field change in `InquiryForm` — **once per session**.

---

#### `inquire_field_error`

Validation error on blur/submit.

| Property | Type | Required | Notes |
|----------|------|----------|-------|
| `field_name` | string | ✅ | e.g. `message`, `consent` |
| `package_mode` | `A` \| `B` | ✅ | |
| `error_type` | string | optional | Zod message key |

**Trigger:** `form.formState.errors` after failed submit attempt or blur validation — debounced, no PII.

---

#### `inquire_submit`

Primary conversion event.

| Property | Type | Required | Notes |
|----------|------|----------|-------|
| `package_mode` | `A` \| `B` | ✅ | |
| `how_heard` | enum | ✅ | `referral` \| `search-engine` \| `social-media` \| `breed-club` \| `other` |
| `experience` | enum | ✅ | From form — aggregate only |
| `goals` | enum | ✅ | |
| `timeline` | enum | ✅ | |
| `prior_evidence_pages` | string[] | ✅ | Session evidence routes |
| `prior_evidence_count` | number | ✅ | |
| `trust_path_qualified` | boolean | ✅ | `prior_evidence_count >= 2` |
| `submit_method` | enum | ✅ | `mailto` (today) → `api` (post-Q7) |
| `has_phone` | boolean | optional | Whether phone provided |
| `has_household` | boolean | optional | Whether household filled |

**Trigger:** `InquiryForm.onSubmit` after Zod pass, before/after mailto redirect. When Q7 API ships, fire on HTTP 200 only; add `inquire_submit_fail` on error.

---

#### `inquire_submit_fail`

| Property | Type | Required | Notes |
|----------|------|----------|-------|
| `package_mode` | `A` \| `B` | ✅ | |
| `failure_reason` | enum | ✅ | `mailto_blocked` \| `api_error` \| `validation` \| `network` |
| `prior_evidence_count` | number | optional | |

**Trigger:** catch block in `onSubmit`; mailto blocked detection if feasible.

---

#### `confirmation_view`

| Property | Type | Required | Notes |
|----------|------|----------|-------|
| `package_mode` | `A` \| `B` | ✅ | |
| `prior_evidence_count` | number | optional | |

**Trigger:** `InquiryConfirmation` mount in `components/inquire/InquiryConfirmation.tsx`.

---

#### `inquire_banner_impression` / `inquire_banner_dismiss` / `inquire_banner_click`

Reserved for **H3** soft pre-inquire education banner (18-conversion P1). Not in build today — define schema for CRO backlog.

| Property | Type | Notes |
|----------|------|-------|
| `banner_id` | string | e.g. `trust_education_v1` |
| `prior_trust_page_view` | boolean | Session had `/health` or `/dogs` |

---

#### `evidence_page_recorded` (internal/session helper)

Not necessarily sent to analytics provider on every fire — may batch into subsequent events.

| Property | Type | Notes |
|----------|------|-------|
| `path` | string | `/health`, `/dogs`, `/about` |

**Trigger:** On `page_view` for evidence routes — append to `sessionStorage.bsk_evidence_pages` if not present.

---

### 2.3 Event → CRO hypothesis map (Phase 18 backlog)

| Event(s) | Hypothesis |
|----------|------------|
| `proof_band_click` by `cell_id` | H1 proof-band order |
| `cta_click` `placement=dogs_empty_secondary` | H2 Dogs empty-state CTA |
| `inquire_banner_*` | H3 cold deep-link banner |
| `inquire_start` → `inquire_submit` funnel | H4 two-step form |
| `confirmation_view` + operator feedback | H5 success SLA copy |
| `cta_click` `placement=home_inquire_band` | H6 text vs button |
| `health_section_view` + `cta_click` from health | H9 mid-page inquire link |

**Sample guidance (low traffic):** ≥500 sessions/variant for click tests; ≥50 form starts/variant; 8–12 week windows (18-conversion §4).

---

### 2.4 Provider mapping notes

| Event | Vercel Analytics | Plausible | GA4 |
|-------|------------------|-----------|-----|
| Page views | ✅ automatic | ✅ automatic | ✅ `page_view` |
| Custom events | ⚠️ Web Analytics Events (limited) | ✅ custom goals | ✅ recommended events |
| Web Vitals | ✅ | ❌ | ❌ (use CrUX/GSC) |
| `prior_evidence_pages` | ⚠️ pass as comma-separated prop | ✅ props | ✅ event params |

**Recommendation:** Implement **`lib/analytics/track.ts`** abstraction so CTO can swap providers without touching every component.

---

## 3. Dashboard spec — weekly operator view

**Audience:** Operator + CMO (weekly 15-min review)  
**Cadence:** Rolling 7 days vs prior 7 days  
**Tool:** Plausible dashboard / GA4 exploration / Vercel Analytics + exported sheet — **ASSUMPTION:** single primary dashboard once provider chosen

### 3.1 Row 1 — North-star & conversion

| Tile | Metric | Visualization | Notes |
|------|--------|---------------|-------|
| **Trust-path submit rate** | NS-1 | % + WoW delta | Primary decision metric |
| **Inquiry submits** | count(`inquire_submit`) | Number + sparkline | Context only — not goal |
| **Inquire → submit rate** | KPI-1 | % | |
| **Evidence-before-inquire** | KPI-2 | % | Any 1+ evidence page |

### 3.2 Row 2 — Funnel (owned web)

| Stage | Metric | Source |
|-------|--------|--------|
| Discover | Sessions by landing page | `page_view` grouped by entry |
| Shortlist | Home sessions + proof-band engagement (KPI-3) | `/` + `proof_band_click` |
| Verify | Sessions on `/health`, `/dogs`, `/about` | `page_view` |
| Inquire | `/inquire` sessions, `inquire_start`, `inquire_submit` | form funnel |
| Quality | Trust-path qualified submits | NS-1 numerator |

**Funnel viz:** Sankey or stepped bar — Sessions → Evidence pages → Inquire view → Start → Submit → Trust-path submit.

### 3.3 Row 3 — Page & engagement breakdown

| Tile | Content |
|------|---------|
| **Top landing pages** | `/`, `/health`, `/dogs`, `/about`, `/inquire` session share |
| **Proof-band clicks** | Stacked bar by `cell_id` (H1 monitoring) |
| **Health sections viewed** | Count by `anchor` — standards/testing/temperament/placement |
| **CTA placements** | Top 10 `placement` values by `cta_click` |

### 3.4 Row 4 — Inquiry attributes (aggregate only)

| Tile | Dimension | Purpose |
|------|-----------|---------|
| **How heard** | `how_heard` on submit | Channel mix — referral vs search |
| **Goals** | `goals` | ICP fit signal |
| **Experience** | `experience` | Anti-persona guardrail |
| **Timeline** | `timeline` | Waitlist alignment |
| **Package mode** | `package_mode` A vs B | Q1 gate monitoring |

### 3.5 Row 5 — Guardrails & technical health

| Tile | Metric | Alert threshold |
|------|--------|-----------------|
| Zero-evidence submits | G-1 | **ASSUMPTION:** >30% triggers copy/IA review |
| Form abandon | G-3 | Spike >10pp WoW |
| Top field errors | `inquire_field_error` by `field_name` | UX friction |
| Web Vitals | LCP, CLS, INP | PRD V4/NFR-PERF-001 |
| Search Console | Impressions/clicks `/health` | Phase 16 — separate GSC dashboard |

### 3.6 Manual weekly fields (not in dashboard — operator log)

| Field | Values |
|-------|--------|
| Inquiries reviewed | count |
| Qualified / neutral / anti-persona | tags |
| Referrer thanked | Y/N + name |
| Notes | free text |

### 3.7 What this dashboard explicitly excludes

- Paid campaign performance (Phase 19 skipped)
- Revenue, deposits, LTV
- Social follower growth
- Raw traffic goals

---

## 4. Implementation wiring map (`apps/blacksage-kennels`)

**Status today:** No analytics scripts, hooks, or tests. CTO implements per this map.

### 4.1 New files (recommended)

| File | Purpose |
|------|---------|
| `lib/analytics/types.ts` | Event name union + property interfaces |
| `lib/analytics/track.ts` | `track(event, properties)` — provider adapter |
| `lib/analytics/evidence-session.ts` | `recordEvidencePage()`, `getEvidencePages()`, `getEvidenceCount()` |
| `lib/analytics/placements.ts` | `CTA_PLACEMENT` constants — single source for dashboard enums |
| `components/analytics/AnalyticsScripts.tsx` | Provider snippet(s) — load in layout |
| `components/analytics/PageViewTracker.tsx` | Client: fire `page_view` + evidence recording on route change |
| `components/analytics/TrackedLink.tsx` | Drop-in `Link` wrapper firing `cta_click` |
| `components/analytics/HealthSectionObserver.tsx` | Client: `health_section_view` IO |
| `components/analytics/ProofBandTracker.tsx` | Client wrapper for view + click tracking |
| `lib/analytics/track.test.ts` | Vitest: mock provider, assert payloads |
| `lib/analytics/evidence-session.test.ts` | Session storage edge cases |

**Env vars:**

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_ANALYTICS_PROVIDER` | `vercel` \| `plausible` \| `ga4` \| `none` |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Plausible site id |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 `G-XXXXXXXX` |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | `true` in production only — guard staging |

### 4.2 Existing files — instrumentation points

#### `app/layout.tsx`

```tsx
// Add inside <body>, after SkipLink:
<AnalyticsScripts />
<PageViewTracker />
```

- Load analytics only when `NEXT_PUBLIC_ANALYTICS_ENABLED === 'true'`
- Do not block LCP — defer third-party scripts (`afterInteractive` strategy)

---

#### `components/proof/ProofSummaryBand.tsx`

| Event | Hook |
|-------|------|
| `proof_band_view` | Wrap section in `ProofBandTracker` or IO in client wrapper |
| `proof_band_click` | On each `Link` click — pass `cell_id` from map index |

Add `cell_id` to `PROOF_BAND` constant **or** derive in click handler from index.

---

#### `components/layout/SiteHeader.tsx`

| Event | Hook |
|-------|------|
| `cta_click` | Desktop nav link to `/inquire` — `placement: header_nav_desktop`, `label: "Begin your inquiry"` |
| `cta_click` | Mobile nav — `placement: header_nav_mobile`, `label: "Inquire"` |

---

#### `components/layout/SiteFooter.tsx`

| Event | Hook |
|-------|------|
| `cta_click` | Footer nav links — `placement: footer_nav` |

---

#### `app/page.tsx`

| Link target | placement |
|-------------|-----------|
| `/health`, `/dogs` in prose | `home_proof_teaser` |
| Education band → `/health` | `home_education_band` |
| About teaser → `/about` | `home_about_teaser` |
| Bottom → `/inquire` | `home_inquire_band` |

Use `TrackedLink` or inline `track('cta_click', ...)`.

---

#### `app/dogs/page.tsx`

| Link | placement |
|------|-----------|
| Health & testing | `dogs_empty_primary` |
| Begin your inquiry | `dogs_empty_secondary` |

---

#### `app/health/page.tsx`

| Element | Event |
|---------|-------|
| `#standards`, `#testing`, `#temperament`, `#placement` sections | `health_section_view` via `HealthSectionObserver` |
| Placement card A/B → `/inquire` | `cta_click` — `health_placement_card_a` / `_b` |
| ADRK/OFA external links | optional `health_external_resource` |

---

#### `app/about/page.tsx`

| Link | placement |
|------|-----------|
| Any inquire / health links | `about_inquire_band` or standard CTA placements |

---

#### `app/inquire/page.tsx`

| Element | Event |
|---------|-------|
| Footer cross-links | `inquire_footer` |
| Page load | `page_view` with `package_mode` from `getInquirePackage()` |

Consider thin client wrapper to pass `packageMode` to trackers.

---

#### `components/inquire/InquiryForm.tsx`

| Lifecycle point | Event |
|-----------------|-------|
| First field interaction | `inquire_start` (once) |
| Validation failure on submit | `inquire_field_error` per field |
| Successful validation + mailto | `inquire_submit` then show confirmation |
| catch / mailto fail | `inquire_submit_fail` |
| Include `prior_evidence_pages` from `evidence-session.ts` on all form events |

**Q7 migration:** Replace mailto block with `fetch('/api/inquire')` — fire `inquire_submit` on 200 only; add server-side logging duplicate optional.

---

#### `components/inquire/InquiryConfirmation.tsx`

| Event | Hook |
|-------|------|
| `confirmation_view` | `useEffect` on mount |

---

#### `lib/constants.ts` — PROOF_BAND enhancement (optional)

Add stable `id` field to each cell for analytics:

```ts
{ id: "standards", title: "Standards-aligned", ... }
```

---

### 4.3 Session evidence flow

```
page_view(/health) → recordEvidencePage('/health')
page_view(/about)  → recordEvidencePage('/about')
navigate /inquire  → inquire_start includes prior_evidence_pages: ['/health','/about']
submit             → inquire_submit.trust_path_qualified = true (count >= 2)
```

**Storage key:** `bsk_evidence_pages` — JSON string array; clear on tab close (sessionStorage).

---

### 4.4 Testing requirements (TDD)

| Test file | Cases |
|-----------|-------|
| `lib/analytics/track.test.ts` | No-op when disabled; correct payload shape per event |
| `lib/analytics/evidence-session.test.ts` | Dedup paths; count; empty session |
| `components/inquire/InquiryForm.test.tsx` (future) | Mock track — submit fires `inquire_submit` with trust_path flag |

Run alongside existing 13 Vitest tests — target ≥18 tests post-analytics.

---

### 4.5 Privacy & consent

| Requirement | Implementation |
|-------------|----------------|
| No PII in events | Strip form values; enums only on submit |
| Staging exclusion | `NEXT_PUBLIC_ANALYTICS_ENABLED=false` on preview |
| Cookie banner | **ASSUMPTION:** Plausible/Vercel may not require; GA4 likely requires — operator decision |
| `/inquire` | Do not send email/name/message to analytics |
| robots.txt | Already allows crawlers (Phase 16) — analytics separate |

---

## 5. Phase 21 launch readiness — measurement success criteria

Phase 21 (launch) should **not** proceed public without minimum measurement. These are **go/no-go checks** for head-of-data + CTO — not traffic targets.

### 5.1 P0 — Must pass before public launch

| # | Criterion | Verification |
|---|-----------|--------------|
| M-01 | Analytics provider installed in production only | View real-time/debug panel; staging silent |
| M-02 | `page_view` fires on all 5 Must routes | Manual walk + provider live view |
| M-03 | `inquire_submit` fires on successful form submit (mailto or API) | Test submit in production preview |
| M-04 | `confirmation_view` fires after submit | E2E manual test |
| M-05 | `cta_click` fires on header "Begin your inquiry" | Click test |
| M-06 | `proof_band_click` fires with correct `cell_id` | Click all 4 Home cells |
| M-07 | Session evidence captured — `prior_evidence_count` on submit | Path: Home → Health → Inquire → submit |
| M-08 | No PII in event payloads | Inspect network/beacon payloads |
| M-09 | Dashboard accessible to operator/CMO | Shared Plausible/GA4/Vercel project |
| M-10 | Google Search Console property verified + sitemap submitted | Phase 16 P1 — parallel track |

### 5.2 P1 — Should pass launch week

| # | Criterion | Verification |
|---|-----------|--------------|
| M-11 | `health_section_view` for all 4 anchors | Scroll `/health` test |
| M-12 | `inquire_start` distinct from `page_view` on `/inquire` | Form focus test |
| M-13 | Weekly dashboard template configured | Row 1–5 tiles from §3 |
| M-14 | Operator manual log template shared | Spreadsheet or Notion |
| M-15 | Web Vitals baseline captured | Vercel Analytics or PageSpeed |

### 5.3 P2 — Acceptable post-launch (30 days)

| # | Criterion | Notes |
|---|-----------|-------|
| M-16 | NS-1 baseline established (4+ weeks data) | First target-setting review |
| M-17 | Q7 API submit_method = `api` | Replaces mailto tracking nuance |
| M-18 | CRM qualified tags joined to submit id | Off-site |
| M-19 | CRO H1 test instrumentation validated | If test starts |

### 5.4 Launch blockers (measurement-specific)

| Blocker | Owner |
|---------|-------|
| Zero custom events on `/inquire` submit | CTO — cannot measure conversion |
| Analytics firing on staging with real domain confusion | CTO — env guard |
| PII leaking in event params | CTO — privacy fix before launch |
| No operator access to dashboard | head-of-data / CMO |

**Not a launch blocker:** Q7 mailto stub — client-side `inquire_submit` still required (this phase).

---

## Open items

| Item | Owner | Blocks |
|------|-------|--------|
| Analytics provider selection | head-of-data + CTO | Implementation adapter |
| Q7 CRM/API | CTO + operator | Server-side submit confirmation; `submit_method: api` |
| Q1 Package A vs B | Operator | `package_mode` interpretation |
| Consent/cookie policy | Operator + legal | GA4 if chosen |
| GSC access | Operator | Organic dashboard row |
| `[RESPONSE_EXPECTATION]` | Operator | H5 success message test |
| CRO test execution | CMO | H1–H10 backlog — needs M-01–M-07 first |

---

## Sources / skills used

- `18-conversion.md` — funnel, events required, CRO hypotheses, sample sizes
- `06-gtm-plan.md` — north stars M4–M7, quality > volume, paid skipped
- `05-prd.md` — inquiry form spec, NFR, packaging A/B
- `16-seo.md` — GSC, Must routes, no paid pixels
- `09-build-log.md` — app structure, mailto stub, test count
- `apps/blacksage-kennels/` — component audit (InquiryForm, ProofSummaryBand, SiteHeader, layout)
- IC: `HANDOFFS/20-analytics-engineer.md`
- Packs: `skills/community/marketingskills/analytics/`, `interactive-dashboard-builder/`

## IC merge notes

| IC | Handoff | Merged |
|----|---------|--------|
| analytics-engineer | `HANDOFFS/20-analytics-engineer.md` | Full taxonomy, dashboard, wiring map, Phase 21 criteria |

**Conflicts resolved:** none — IC draft accepted with provider recommendation added by head-of-data (Plausible primary + optional Vercel Web Vitals).

**Model audit:** head-of-data · `strong-general` / composer-2.5 · `generation_profile: none` · IC · `coding-agent` / composer-2.5

---

*Phase 20 not marked complete — awaiting C-suite review.*
