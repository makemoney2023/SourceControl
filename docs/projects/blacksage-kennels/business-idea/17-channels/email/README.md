# Email Journeys — Blacksage Kennels

**Phase:** 17  
**Owner:** lifecycle-marketer  
**Last updated:** 2026-07-27  
**Venture:** Blacksage Kennels

---

## Purpose

Automated and operator-triggered email journeys for Package A (Interest list), Package B (Waitlist consideration), and Tier 2 program announcements. Every email in this directory is **written in full** — subject, preview text, body, and CTA.

**Strategic locks:** Trust-first D2 · CTA **Begin your inquiry** · No Buy/FOMO/price-forward · Low frequency, high value.

---

## Journey index

| Journey | File | Trigger | Emails | Cadence |
|---------|------|---------|--------|---------|
| Inquiry welcome / confirmation | [inquiry-welcome.md](./inquiry-welcome.md) | Form submit (Package A or B) + first human response | 4 | Immediate + within SLA |
| Interest list nurture (Package A) | [interest-nurture.md](./interest-nurture.md) | Interest list membership confirmed | 5 | ~3–6 weeks between sends; event-triggered optional |
| Waitlist nurture (Package B) | [waitlist-nurture.md](./waitlist-nurture.md) | Waitlist inquiry or approved waitlist | 4 | Event + milestone; not weekly |
| Tier 2 program update | [tier2-program-update.md](./tier2-program-update.md) | Operator promotes Tier 2 / opens waitlist to interest list | 2 | One-time announcement |

---

## Cadence rules (global)

1. **Low frequency, high value** — no weekly puppy promotions, no countdown timers, no scarcity language.
2. **Interest list (A):** Default spacing **3–6 weeks** between nurture emails unless an operator-verified milestone triggers an update (e.g., breeding stock profiles live, waitlist opens).
3. **Waitlist (B):** Emails tied to **qualification milestones** and **verified program facts** — not calendar filler.
4. **Exit conditions:** Unsubscribe honored immediately; anti-persona receives polite decline only (see sales playbook §2.6); placement (Package C) moves buyer to post-placement CS — not sales nurture.
5. **Quiet hours:** Send during business hours in recipient local time when platform supports it.
6. **One primary CTA per email** — usually a single education link or **Begin your inquiry** when re-engagement is appropriate.

---

## Package language (locked)

| Package | Label | Email use |
|---------|-------|-----------|
| **A** | Interest list | Join / on the interest list — **not** a reservation or waitlist |
| **B** | Waitlist consideration | Submit inquiry for waitlist consideration — **not** approval or puppy reservation |
| **C** | Placement | Described in education only; no automated Package C sales sequence in v1 |

---

## Placeholders (operator / build)

| Placeholder | Used for |
|-------------|----------|
| `[CONTACT_EMAIL]` | Reply-to and footer contact |
| `[LOCATION]` | Optional signature / logistics context when Q2 set |
| `[RESPONSE_SLA]` | e.g., "24–48 business hours" — operator sets before launch (Q7) |
| `[OPERATOR_NAME]` | Sign-off |
| `[First Name]` | Personalization token |

**Do not invent:** pricing, deposit amounts, litter dates, waitlist position numbers, or geography until operator confirms.

---

## SMS — skipped for v1

**Verdict:** SMS is **not** included in Phase 17 channel deliverables.

| Reason | Detail |
|--------|--------|
| GTM channel ownership | Phase 6 GTM plan designates **interest/inquiry email** as the owned nurture channel — not SMS |
| Ops plan | Sales playbook §7: "No SMS or live chat required at v1 (PRD W-12)" |
| Consent / compliance | No phone consent flow, A2P 10DLC registration, or TCPA-compliant opt-in copy on `/inquire` |
| Audience fit | Selective kennel buyers benefit from **evidence-dense email**, not interruptive texts |
| Spam risk | SMS urgency tone conflicts with trust-first, anti-FOMO positioning |

Revisit SMS only if operator adds explicit phone marketing consent, compliance setup, and a documented use case (e.g., transactional pickup reminders post-Package C).

---

## Implementation notes

- Wire **Package A** auto-reply on interest-list form submit; **Package B** on waitlist form submit.
- Human templates in `inquiry-welcome.md` are sent by operator within `[RESPONSE_SLA]` after triage — not automated without review.
- Link targets assume production URLs: `https://[DOMAIN]/health`, etc.
- Merge tags and ESP selection are CMO / ops decision — copy is ESP-agnostic.

---

## Related docs

- `06-gtm-plan.md` — owned email channel, cadence locks  
- `07-sales-playbook.md` — §2.1–2.2, §9 auto-replies, triage tags  
- `13-copy-foundation.md` — voice, Package A/B language, CTA locks  
- `14-pages/inquire.md` — form success states  
