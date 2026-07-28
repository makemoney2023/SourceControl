# 17 Channels — Email, Social & SMS

**Phase:** 17  
**Status:** draft — ready for C-suite review  
**Last updated:** 2026-07-27  
**Owner:** cmo (merge)  
**ICs:** lifecycle-marketer (email), content-strategist (social)  
**Venture:** Blacksage Kennels  
**Mode:** Channel plans for owned email + optional rented social; SMS skipped

---

## Executive summary

Blacksage Kennels’ Phase 17 channel system is **email-first, social-optional, SMS-off**.

- **Email (owned):** Full written journeys for inquiry welcome, Package A interest nurture, Package B waitlist nurture, and Tier 2 waitlist-open announcement — low frequency, high value, trust-first D2.
- **Social (rented, optional):** Facebook-first education calendar at 2–4 posts/month, or **skip** if operator capacity is missing. Credibility and education over litter drops; every post funnels to the owned site.
- **SMS:** **Skipped for v1** (see below).

**Conversion language locked:** **Begin your inquiry** · Join our interest list · Submit inquiry for waitlist consideration. No Buy / FOMO / price-forward.

---

## Folder map

| Path | Owner IC | Contents |
|------|----------|----------|
| [`email/`](./email/) | lifecycle-marketer | Journeys, cadence, SMS skip rationale |
| [`social/`](./social/) | content-strategist | Channel map, pillars, 90-day calendar, posting rules |
| `sms/` | — | **Not created** — SMS skipped for v1 |

---

## Email journeys (`email/`)

Every email is written in full: subject, preview text, body, CTA.

| Journey | File | Emails | Status |
|---------|------|--------|--------|
| Inquiry welcome / confirmation | [email/inquiry-welcome.md](./email/inquiry-welcome.md) | 4 | ✅ |
| Interest list nurture (Package A) | [email/interest-nurture.md](./email/interest-nurture.md) | 5 | ✅ |
| Waitlist nurture (Package B) | [email/waitlist-nurture.md](./email/waitlist-nurture.md) | 4 | ✅ |
| Tier 2 / waitlist-open update | [email/tier2-program-update.md](./email/tier2-program-update.md) | 2 | ✅ |
| Index + cadence + SMS skip | [email/README.md](./email/README.md) | — | ✅ |

**Cadence lock:** Interest nurture ~3–6 weeks between sends; waitlist emails event/milestone-driven; no weekly puppy spam.

**Package language:** A = Interest list · B = Waitlist consideration · C = Placement (process only; no automated C sales sequence).

**Placeholders (do not invent):** `[CONTACT_EMAIL]` · `[LOCATION]` · `[RESPONSE_SLA]` · `[OPERATOR_NAME]` · `[DOMAIN]`

---

## Social (`social/`)

| Artifact | File | Status |
|----------|------|--------|
| Index + capacity gate | [social/README.md](./social/README.md) | ✅ |
| ORB channel map | [social/channel-map.md](./social/channel-map.md) | ✅ |
| Content pillars | [social/content-pillars.md](./social/content-pillars.md) | ✅ |
| 90-day theme calendar | [social/calendar-90-day.md](./social/calendar-90-day.md) | ✅ |
| Posting rules | [social/posting-rules.md](./social/posting-rules.md) | ✅ |

**Default recommendation:** Skip rented social at Tier 1 brand-first launch **or** run **Facebook only** at **~3 posts/month**. Instagram is Q6-gated. Paid social deferred (Phase 19).

**Social job:** Amplify owned Health/Education and program literacy. Litter/availability posts are **rare, operator-verified exceptions** — not a pillar.

---

## SMS — skipped for v1

| Reason | Detail |
|--------|--------|
| GTM ownership | Phase 6 designates **interest/inquiry email** as the owned nurture channel |
| Ops / sales plan | Sales playbook: no SMS or live chat required at v1 |
| Consent | No phone marketing consent / A2P 10DLC flow on `/inquire` |
| Brand fit | SMS urgency patterns conflict with trust-first, anti-FOMO voice |

**Revisit only if** operator adds explicit consent, compliance setup, and a documented transactional use case (e.g., post-Package C pickup reminders). Full rationale: [email/README.md](./email/README.md) § SMS.

---

## Coordination rules (email ↔ social)

1. Do not duplicate the same education theme on email and social in the same week without operator intent.
2. Social never substitutes for email CRM (inquiry ack, interest list, waitlist milestones).
3. Both channels link to owned `/health` and `/inquire` — never “DM for price.”
4. Tier 2 waitlist-open email (`tier2-program-update.md`) is the canonical announcement; social may support with one education/process post after site update, not before.

---

## Launch gates before go-live

| Gate | Required for |
|------|----------------|
| **Q7** — `[CONTACT_EMAIL]` + `[RESPONSE_SLA]` + inquiry routing live | Email auto-replies + social bio → `/inquire` |
| **Q1** — Tier 1 vs Tier 2 | Enables Package B journeys + Tier 2 announcement email |
| **E1–E8** education substantive on site | Social amplification (do not drive traffic to stubs) |
| **Q6** verified dog media (if any) | Instagram / dog photos; otherwise education-only |
| Operator capacity 2–4 hrs/month | Rented social execution — else **skip social** |

---

## Explicitly out of scope (this phase)

| Item | Verdict |
|------|---------|
| SMS templates | Skipped |
| Paid social / Google Ads | Phase 19 deferred |
| Cold outreach B2B sequences | Not applicable to kennel ICP |
| Win-back / abandoned-cart style spam | Rejected — wrong category voice |
| Price, deposits, litter FOMO posts | Never in channel copy |

---

## Related docs

- `06-gtm-plan.md` — ORB channel architecture  
- `07-sales-playbook.md` — inquiry response, Package A/B/C gates  
- `13-copy-foundation.md` — voice + CTA locks  
- `14-pages/inquire.md` — form success states  
- `16-seo.md` — education themes social may amplify  

**Do not mark RUNBOOK Phase 17 ✅ from this folder** — orchestrator + C-suite gate only.
