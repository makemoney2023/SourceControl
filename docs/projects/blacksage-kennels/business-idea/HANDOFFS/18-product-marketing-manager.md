---
phase: "18"
position: product-marketing-manager
reports_to: cmo
status: done
verdict_for_manager: ready_to_merge
llm_tier: strong-general
llm_model: composer-2.5
generation_profile: none
generation_used: none
fallback_applied: false
---

# Handoff — Conversion Optimization → CMO

## Goal (from context packet)

Produce Phase 18 funnel map, CTA audit, and conversion path for trust-first inquire flow. Write full draft sections into handoff for CMO merge into `18-conversion.md`. Do NOT write `18-conversion.md` (CMO merges).

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/18-product-marketing-manager.md` | Full draft for `18-conversion.md` — funnel map, CTA audit, conversion path, PMM CRO recommendations |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | strong-general |
| llm_model | composer-2.5 |
| generation_profile | none |
| generation_used | none |
| fallback_applied | no |

## Decisions

- **Primary conversion surface:** Owned web (`apps/blacksage-kennels`) — organic trust → inquire path; paid deferred Phase 19.
- **Happy path locked:** Home → Dogs/Health/About → Inquire — never apply-first or above-fold convert pressure on Home.
- **CTA copy lock:** **Begin your inquiry** only for conversion buttons/links; Package A/B headlines allowed per copy foundation.
- **Q7 open:** Form submits via `mailto:` stub today; future CRM/ESP destination documented as **open** — measurement and auto-reply blocked until resolved.
- **Package staging:** A (interest) → B (waitlist) → C (placement off-site); Q1 gates form mode via `NEXT_PUBLIC_INQUIRE_PACKAGE`.
- **Header nav:** Desktop shows "Begin your inquiry" for `/inquire`; mobile shows "Inquire" label — minor consistency gap flagged, not a lock violation.

## Asks for manager (`ask_manager`)

- Peer help needed: none
- Clarification needed: **Q1** — operator confirms Package A-only vs B enable date for form toggle | **Q7** — operator sets `[CONTACT_EMAIL]`, `[RESPONSE_SLA]`, and CRM/ESP destination before treating conversion as live

## Risks / blockers

- **Mailto stub:** No server-side submit capture, no ESP auto-reply, no analytics event — conversion metrics are conceptual until Q7 closes.
- **Mobile nav:** Inquire link labeled "Inquire" on mobile vs "Begin your inquiry" on desktop — soft inconsistency; CMO may route to web-designer if unified label desired.
- **Health placement section:** Shows both Package A and B cards simultaneously regardless of Q1 mode — educationally correct but may confuse which mode is active; form header (`PackageModeHeader`) resolves at `/inquire`.
- **Footer nav:** Uses "Inquire" label, not "Begin your inquiry" — acceptable per nav convention; conversion copy lock applies to CTA actions, not nav labels.

## Packs used

- `skills/org/positions/product-marketing-manager/SKILL.md`
- `skills/org/HANDOFF-TEMPLATE.md`
- `skills/community/marketingskills/product-marketing/SKILL.md`
- `skills/community/marketingskills/marketing-psychology/SKILL.md`

## Do not

- Mark the phase complete
- Write outside write_lease
- Spawn other positions
- Inherit parent model when MODEL-REGISTRY pins a different tier (esp. creative/legal)

---

## Draft for 18-conversion.md

*CMO merge target. PMM draft — Phase 18 conversion optimization for Blacksage Kennels v2 rebuild.*

---

### 1. Funnel map

#### Strategic frame

Blacksage Kennels converts through **evidence density, not urgency**. The site completes its GTM job at **qualified inquiry submission** — qualification, pricing, deposits, and placement (Package C) happen off-site. Paid acquisition is **deferred** (Phase 19); this funnel optimizes the **organic trust → inquire** path.

**Lock:** D2 trust-first — Home → Dogs / Health / About → Inquire. NOT apply-first.

#### Stages

| Stage | Buyer mindset | Primary surface | Page role | Success signal (conceptual) |
|-------|---------------|-----------------|-----------|----------------------------|
| **1 — Discover** | "Who is Blacksage?" | Borrowed/rented → **owned web** | Entry via `/`, deep links, `/apply`→`/inquire` redirect | Session starts on owned domain |
| **2 — Shortlist** | "Worth keeping on my list?" | **Home** `/` | Proof summary band + positioning — no hero CTA | Proof-band clicks; time on Home > bounce |
| **3 — Verify** | "Can I trust this program?" | **Dogs** `/dogs`, **Health** `/health`, **About** `/about` | Evidence, education, operator honesty | ≥2 evidence pages viewed before `/inquire` (heuristic) |
| **4 — Inquire** | "I'm ready to start a conversation" | **Inquire** `/inquire` | Package A or B form; mutual-fit framing | Form submit (Package A or B) |
| **5 — Package A/B/C** | Off-site qualification | Email, phone, operator process | A interest nurture → B waitlist → C placement | Operator-qualified lead; not site metric |

#### Owned-web page roles

| Route | Funnel stage | Job | CTA priority |
|-------|--------------|-----|--------------|
| `/` | Shortlist | Program identity + proof pathway | 1–4: proof links; 7: **Begin your inquiry** (tertiary, bottom band only) |
| `/dogs` | Verify | Breeding stock proof or honest empty state | Primary: Health & testing; secondary: Begin your inquiry |
| `/health` | Verify + educate | Standards, testing, temperament, placement (E1–E8) | Education links; placement CTAs at `#placement` |
| `/about` | Verify | Operator story, principles, contact | Health link + tertiary inquire band |
| `/inquire` | Convert | Package A/B form; expectation copy | Submit inquiry (form button — not a marketing CTA) |

#### Entry points

| Source | Typical landing | Funnel note |
|--------|-----------------|-------------|
| **Organic search** | `/`, `/health`, `/dogs` | SEO education-first; shortlist on Home, verify on Health |
| **Referrer / trainer** | `/` or `/health` | Highest-quality path; may skip Home if deep-linked |
| **Email return** (Phase 17) | `/health`, `/dogs`, `/inquire` | Nurture CTAs link to evidence pages first, inquire when ready |
| **Optional social** (Phase 17) | `/health` anchors | Education posts → owned site; no DM-for-price |
| **Legacy `/apply` links** | 301 → `/inquire` | Redirect preserves trust-first route; no apply-first UX |
| **Paid** (Phase 19 — deferred) | TBD landing (recommend `/health` or `/` proof path) | Design for proof-before-inquire; no price-led LP |

#### Drop-off risks

| Stage | Risk | Cause | Mitigation (trust-first) |
|-------|------|-------|--------------------------|
| Discover → Shortlist | Bounce from Home | Weak proof signal, spectacle expectation (v1 hangover) | Proof band above fold; no 3D hero; honest Tier 1 posture |
| Shortlist → Verify | Exit before evidence | User wanted instant availability / price | Education teaser; anti-persona copy on Health temperament + placement |
| Verify → Inquire | Premature inquire without proof | Header "Begin your inquiry" visible early | Copy sets expectation; form friction + consent checkbox filters impulse |
| Verify → Inquire | Never inquire after proof | Long form, unclear next step | Placement section explains A/B/C; email nurture re-invites |
| Inquire → Submit | Form abandonment | Field count, mailto handoff friction | Justified friction for selective placement; Q7 API removes mailto pain |
| Submit → Package | No operator follow-up | Q7 stub, no CRM | **Open:** ESP/CRM + `[RESPONSE_SLA]` before launch gate |

#### Success metrics (conceptual — pre-Q7)

| Metric | Definition | Target posture |
|--------|------------|----------------|
| **Inquiry submit rate** | `/inquire` sessions → successful submit | Quality > volume; baseline TBD post-launch |
| **Evidence-before-inquire** | Sessions with `/health` and/or `/dogs` and/or `/about` before `/inquire` | Majority of converters (heuristic — not enforced) |
| **Proof-band engagement** | Clicks on Home 4-cell band | Primary Home success signal vs hero CTA |
| **Bounce rate by entry page** | Single-page exit | Lower on `/health` for search traffic |
| **Referrer shareability** | M5 — referrer willing to share URL | Qualitative gate, not analytics |
| **Package mode accuracy** | Submissions tagged A vs B | Matches Q1 operator gate |
| **Anti-persona filter** | Inquiry message quality / operator rejection rate | Fewer guard-dog / price-only leads |

*Measurement prerequisites blocked until Q7: server-side submit events, ESP delivery confirmation, `[RESPONSE_SLA]` tracking.*

---

### 2. CTA audit

#### Audit scope

Sources: `14-pages/*.md`, `13-copy-foundation.md`, `12-web-design.md`, rebuilt `apps/blacksage-kennels` (routes `/`, `/dogs`, `/health`, `/about`, `/inquire`; `/apply`→`/inquire` 301).

#### Global — Nav + footer

| Location | Element | Copy | Target | Hierarchy | Compliance |
|----------|---------|------|--------|-----------|------------|
| **SiteHeader** (desktop) | Nav link | Begin your inquiry | `/inquire` | Tertiary (amber accent vs other nav) | ✅ Lock |
| **SiteHeader** (mobile) | Nav link | Inquire | `/inquire` | Same position | ⚠️ Label differs from desktop; not a forbidden CTA |
| **SiteFooter** | Nav list | Inquire | `/inquire` | Footer nav | ✅ Nav label convention |
| **SiteFooter** | Contact | `[CONTACT_EMAIL]` placeholder | mailto N/A in footer | Informational | ⚠️ Q7 placeholder |

**Apply-first check (Home):** ✅ **PASS** — No CTA in first viewport. Hero = H1 + subhead + proof band text links only. Inquire appears only in bottom inquire band (below education + about teasers).

#### Home (`/`)

| Placement | Copy | Type | Target | Priority | Compliance |
|-----------|------|------|--------|----------|------------|
| Proof band cell 1 | View standards → | Text link | `/health#standards` | 1 | ✅ |
| Proof band cell 2 | View health approach → | Text link | `/health#testing` | 2 | ✅ |
| Proof band cell 3 | View our dogs → | Text link | `/dogs` | 3 | ✅ |
| Proof band cell 4 | Learn our process → | Text link | `/health#placement` | 4 | ✅ |
| Positioning prose | health and education resources / our dogs | Inline links | `/health`, `/dogs` | — | ✅ |
| Education teaser | Read our health & education approach → | Text link | `/health` | 5 | ✅ |
| About teaser | About our program → | Text link | `/about` | 6 | ✅ |
| Inquire band (bottom) | Begin your inquiry → | Text link (outline styling) | `/inquire` | 7 tertiary | ✅ Lock |

**Flags:** None. No Buy / Apply now / Reserve. No scroll hint. No above-fold convert pressure.

#### Dogs (`/dogs`) — Tier 1 empty state (current build)

| Placement | Copy | Type | Target | Priority | Compliance |
|-----------|------|------|--------|----------|------------|
| Empty state primary | Health & testing → | Text link (primary weight) | `/health` | 1 | ✅ Proof-first |
| Empty state secondary | Begin your inquiry → | Text link (tertiary/muted) | `/inquire` | 2 | ✅ Lock |

**Tier 2 (when populated):** View profile → per dog; no price, no "Available now," no Reserve ribbon — per `14-pages/dogs.md`.

#### Health (`/health`)

| Placement | Copy | Type | Target | Priority | Compliance |
|-----------|------|------|--------|----------|------------|
| External | Learn more at ADRK / OFA → | Outbound | adrk.de, ofa.org | — | ✅ |
| `#placement` Package A card headline | Join our interest list | Section h3 | — | Package A label | ✅ Allowed |
| `#placement` Package A CTA | Begin your inquiry → | Text link | `/inquire` | Convert | ✅ Lock |
| `#placement` Package B card headline | Submit inquiry for waitlist consideration | Section h3 | — | Package B label | ✅ Allowed |
| `#placement` Package B CTA | Begin your inquiry → | Text link | `/inquire` | Convert | ✅ Lock |
| `#placement` Package C card | How placement works | Education only | — | No CTA | ✅ |

**Note:** Both A and B cards render simultaneously for education. Active form mode is determined at `/inquire` via `NEXT_PUBLIC_INQUIRE_PACKAGE`.

#### About (`/about`)

| Placement | Copy | Type | Target | Priority | Compliance |
|-----------|------|------|--------|----------|------------|
| Inquire band | Begin your inquiry → | Text link | `/inquire` | Tertiary | ✅ Lock |
| Secondary | Read our health & education approach → | Text link | `/health` | Proof | ✅ |
| Copy reference | Joining the interest list… | Body text | — | Package A language | ✅ Allowed |

**Missing vs spec:** Alternate "Join our interest list →" link not implemented — optional; primary lock satisfied.

#### Inquire (`/inquire`)

| Placement | Copy | Type | Target | Compliance |
|-----------|------|------|--------|------------|
| Page H1 | Begin your inquiry | Heading | — | ✅ Lock |
| PackageModeHeader A | Join our interest list | Mode headline | — | ✅ Package A |
| PackageModeHeader B | Submit inquiry for waitlist consideration | Mode headline | — | ✅ Package B |
| Form submit | Submit inquiry | Button | mailto stub | ✅ Not "Apply now" |
| Pending | Sending… | Button state | — | ✅ |
| Success H2 | Inquiry received | Confirmation | — | ✅ Not "You're in!" |
| Footer links | Return to home / Health & education / Our placement process | Text links | `/`, `/health`, `/health#placement` | ✅ |

#### Forbidden CTA scan (site-wide)

| Forbidden | Found? |
|-----------|--------|
| Apply now / Apply | ❌ Not present (route redirects) |
| Buy now / Shop / Reserve | ❌ Not present |
| Limited time / Act now / X left | ❌ Not present |
| On-site pricing / deposit amounts | ❌ Not present |
| Exit-intent / popup capture | ❌ Not present |
| FOMO scarcity timers | ❌ Not present |

#### CTA hierarchy summary (locked)

```
Priority 1–4: View our dogs / Health & testing / Learn our process / Education links
Priority 5–6: About / internal proof cross-links
Priority 7:    Begin your inquiry (tertiary — never dominant above fold on Home)
Form action:   Submit inquiry (on /inquire only)
```

---

### 3. Conversion path (primary)

#### Recommended happy path

```
Discover (search / referral / email)
    ↓
Home — proof summary band (4 cells) → shortlist
    ↓
Health/Education — standards, testing, temperament, placement (verify + educate)
    ↓
Dogs — empty state → back to Health OR Tier 2 profiles → OFA links
    ↓
About — principles + operator story (verify)
    ↓
Inquire — Package A or B form → submit
    ↓
Off-site — operator qualification → Package A/B/C
```

**Alternate valid paths:**

- Referrer deep-link → `/health#testing` → `/about` → `/inquire`
- Email nurture → `/health` anchor → `/inquire` when ready
- Home proof cell → `/dogs` → `/health` → `/inquire`

**Invalid path (rejected):** Home hero → immediate `/inquire` without evidence pages. v1 `/apply`-first pattern is explicitly rejected.

#### Form friction analysis

| Factor | Assessment | Rationale |
|--------|------------|-----------|
| **Field count** | High (10+ fields + consent) | Intentional — selective placement filter; aligns with anti-persona repulsion |
| **Message min length** | 50+ characters | Ensures thoughtful inquiry; reduces impulse submits |
| **Experience + goals + timeline** | Required selects | Qualification data for operator; reduces back-and-forth |
| **Consent checkbox** | Required | Sets "not a reservation" expectation — trust-first |
| **Package B extras** | Optional sex/tail/reference + deposit ack | Waitlist-specific; only when Q1 = active |
| **Validation timing** | onBlur + submit | Reduces keystroke annoyance without hiding errors |
| **Mailto submit** | **Friction risk** | Opens email client — may fail on mobile/web; **Q7 open** |

**Verdict:** Long form is **justified** for this category. Do not shorten for CRO at the cost of lead quality. Fix delivery friction via Q7 API/ESP, not field removal.

#### Success / confirmation expectations

| Package | Success headline | Body tone | Follow-up |
|---------|------------------|-----------|-----------|
| **A** | Inquiry received | Thank you; review individually; patience on response time | Interest nurture sequence (Phase 17) — when ESP live |
| **B** | Inquiry received — not approval or waitlist confirmation | Explicit: submit ≠ waitlist placement | Waitlist nurture — event-driven |

**SLA placeholder:** `[RESPONSE_SLA]` / `[RESPONSE_EXPECTATION]` — operator must set before public launch. No invented timelines.

**Post-submit UX:** No confetti, no puppy illustrations, no "You're approved." Optional link: Return to home.

#### Q7 open — mailto stub → future CRM/ESP

| Today (build) | Future (required for launch gate) |
|---------------|-----------------------------------|
| `InquiryForm` builds `mailto:[CONTACT_EMAIL]` with encoded body | POST `/api/inquire` → CRM/ESP (e.g., ConvertKit, Mailchimp, HubSpot, or operator inbox API) |
| No server-side capture | Server-side record + duplicate to operator email |
| No auto-reply trigger | Wire Phase 17 `inquiry-welcome.md` auto-ack |
| No analytics event | `inquiry_submit` event with package mode + referral source |
| Confirmation shown after mailto redirect attempt | Confirmation after API 200 |

**Status:** **OPEN** — conversion path documentation treats mailto as **stub only**. CMO/CTO close Q7 before marking conversion live.

#### Anti-patterns forbidden list

| Anti-pattern | Why forbidden | Blacksage alternative |
|--------------|---------------|----------------------|
| Apply-first / hero CTA | D3 rejected; filters wrong buyers in | Proof band + tertiary inquire |
| Exit-intent popups | Dark pattern; breaks trust | Ungated education on-site |
| Scarcity timers / "X puppies left" | FOMO; Tier 3 claim risk | Honest program status |
| Gated lead magnets ("free puppy guide") | Capture before value | Full Health page ungated |
| Price / deposit on site | A10 lock | Off-site after qualification |
| Buy / Shop / Reserve CTAs | Checkout expectation | Begin your inquiry |
| Sticky floating "Apply now" bar | Convert pressure | Sticky header nav only |
| Chat widgets with pushy prompts | Urgency pattern | Email inquiry only v1 |
| SMS capture on form | No consent flow; anti-brand | Email only |
| Progress bars on form ("80% done") | Zeigarnik / pressure tactic | Calm form copy |
| Social proof fake counters | Tier 3 | Real referrals when verified |

#### Package A / B / C — conversion language changes

| Package | Q1 gate | Site headline | CTA button/link | Form mode | Payment |
|---------|---------|---------------|-----------------|----------|---------|
| **A — Interest list** | Brand-first / Tier 1 | Join our interest list | Begin your inquiry → | `NEXT_PUBLIC_INQUIRE_PACKAGE=A` | None |
| **B — Waitlist** | Active program / Tier 2 | Submit inquiry for waitlist consideration | Begin your inquiry → | `NEXT_PUBLIC_INQUIRE_PACKAGE=B` | Deposit off-site after approval only |
| **C — Placement** | Operator process | How placement works (education) | No form CTA | Copy only on Health `#placement` | Off-site contract |

**Staging rule:** A → B → C never invert. Tier 1 launches Package A only. Tier 2 enables B when operator confirms active program + inventory. C is never a site conversion action.

**Email alignment (Phase 17):** Nurture sequences use same language — Begin your inquiry for re-convert; Join our interest list in Package A body copy.

#### Paid landing readiness (Phase 19 — note only)

When/if operator funds paid:

- Land on `/health#standards` or `/` with proof band — **not** direct `/inquire`
- Ad copy: education + standards — never price or availability
- UTM capture via `howHeard` select + hidden field if API exists
- No dedicated "puppy landing page" with convert hero
- Conversion metric same: evidence pages → inquire

---

### 4. PMM recommendations for CRO

#### What NOT to test (violates brand locks)

| Do not test | Lock violated |
|-------------|---------------|
| Hero "Apply now" vs "Begin your inquiry" | D2 / D3 |
| Above-fold primary inquire CTA on Home | D2 / E1–E8 gate |
| Shorter form (remove experience/goals/timeline) | Selective placement integrity |
| Scarcity / countdown on inquire or Health | Anti-FOMO / Tier 3 |
| Price or deposit amount on form or pages | A10 |
| Exit-intent or scroll-triggered modals | Dark patterns |
| "Join waitlist" as primary nav replacing proof order | IA lock |
| Social proof widget ("47 people viewing") | Trust / honesty |
| Aggressive retargeting with puppy imagery | Phase 19 + brand |
| SMS opt-in on form | Phase 17 skip + consent |

#### Soft optimizations (preserve trust-first)

| Optimization | Page | Expected impact | Risk |
|--------------|------|-----------------|------|
| Unify mobile nav label to "Begin your inquiry" | SiteHeader | CTA consistency | Low — may truncate on small screens; test wrap |
| Add "Join our interest list →" secondary link on About | `/about` | Package A clarity | Low — already in body copy |
| Cross-link Dogs empty state → `/health#standards` in addition to testing | `/dogs` | Deeper verify path | None |
| Proof-band cell analytics (which cell clicked most) | Home | Inform content priority | Requires analytics install |
| Post-submit education link on confirmation | `/inquire` | Return to Health for waiters | Low |
| `[RESPONSE_SLA]` visible on inquire footer + confirmation | `/inquire` | Reduces anxiety (Regret Aversion) | Must be operator-verified |
| Lazy-load Package B fields only when mode=B | `/inquire` | Reduced cognitive load in Tier 1 | Dev change — already mode-gated |
| Email auto-ack within minutes of submit | ESP | Peak-End Rule positive | Requires Q7 |
| Highlight active Package card on Health `#placement` when Q1 known | `/health` | Reduces A/B confusion | Low — needs env-aware component |
| Referrer-dedicated `howHeard` pre-select via UTM | `/inquire` | Better attribution | Low when Q7 API exists |

**Psychology applied ethically (marketing-psychology pack):**

- **Authority / social proof:** OFA/ADRK outbound links, registry links on Tier 2 dogs — not fake counters
- **Reciprocity:** Ungated education before ask
- **Commitment & consistency:** Consent checkbox + thoughtful message field — small commitment before submit
- **Regret aversion:** "Not a reservation" copy — address anxiety directly
- **Pratfall effect:** Honest empty states ("profiles coming soon") — increases trust vs fake fullness

#### Measurement prerequisites

| Prerequisite | Owner | Blocks |
|--------------|-------|--------|
| Q7 CRM/ESP destination + API route | CTO / operator | Submit tracking, auto-reply, real conversion rate |
| `[CONTACT_EMAIL]` + `[RESPONSE_SLA]` live | Operator | Trust copy, error fallback |
| Analytics (GA4 or Plausible) on owned domain | CMO / CTO | Funnel stage metrics, proof-band clicks |
| Event: `inquiry_submit` with package_mode | CTO | Package A/B reporting |
| Event: `evidence_page_view` (health, dogs, about) | CTO | Evidence-before-inquire heuristic |
| Q1 operator gate documented | Operator | Which form mode is canonical |
| M5 referrer sniff test | Operator / PR | Qualitative funnel top |
| ESP wired to Phase 17 emails | lifecycle + CTO | Post-convert nurture |

**North Star (conceptual):** Qualified inquiry submissions where buyer viewed ≥2 evidence pages in session — optimize for quality signal, not raw submit volume.

**CRO cadence:** No A/B testing until Q7 closed and 30+ organic inquiries collected — insufficient sample for selective kennel; qualitative operator review of inquiry messages first.

---

*End draft for 18-conversion.md*
