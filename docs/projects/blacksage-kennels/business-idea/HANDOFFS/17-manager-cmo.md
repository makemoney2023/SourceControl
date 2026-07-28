---
phase: "17"
manager: cmo
ics_spawned:
  - lifecycle-marketer
  - content-strategist
status: ready_for_csuite
recommendation: approve
llm_tier: frontier-reasoning
llm_model: grok-4.5
generation_profile: none
fallback_applied: false
---

# Manager brief — Email, social & SMS channels — Phase 17

## In plain English

We now have full email journeys (welcome, interest nurture, waitlist nurture, Tier 2 announcement) and an optional social plan that defaults to education-only Facebook posts—or skipping social entirely if the operator has no bandwidth. SMS is intentionally off for v1. Ready for C-suite yes/no; the runbook phase is **not** marked complete.

## What we found

- **Email is the owned nurture channel** — 15 full emails across four journeys; low frequency (3–6 weeks for interest; event-driven for waitlist); no price/FOMO.
- **SMS skipped for v1** — not in GTM/ops plan; no phone consent flow; conflicts with trust-first voice. Documented in `17-channels/README.md` and `email/README.md`.
- **Social is optional support** — Facebook-first at ~3 posts/month or skip; litter drops are rare verified exceptions, not a pillar.
- Package A/B/C language and CTA **Begin your inquiry** are consistent with inquire page + sales playbook.
- Placeholders only: `[CONTACT_EMAIL]`, `[LOCATION]`, `[RESPONSE_SLA]` — nothing invented.

## Next steps

1. **C-suite (CEO + peers)** — Approve or revise `17-channels/` at the gate.
2. **Orchestrator** — On approve, advance runbook; do **not** mark Phase 17 ✅ until C-suite passes.
3. **Operator** — Before go-live: set Q7 (`[CONTACT_EMAIL]`, `[RESPONSE_SLA]`, inquiry routing); confirm Q1 tier; decide skip-vs-Facebook for social; wire email journeys in ESP.

## Summary (5 bullets max)

- Merged `17-channels/` with `email/` + `social/` + SMS skip note; replaced legacy stub README.
- Lifecycle: 15 full emails; SMS skip with ops/GTM rationale.
- Content: ORB map, 5 pillars, 90-day calendar, posting rules; education > litter drops.
- Locks held: D2 trust-first · Begin your inquiry · no Buy/FOMO/price · Package A/B/C consistent.
- Non-blocking asks: week-level email↔social dedup at execution; Q1/Q7 operator inputs.

## IC handoffs merged

| IC | Handoff path | Status | llm_tier | generation_used |
|----|--------------|--------|----------|-----------------|
| `lifecycle-marketer` | `HANDOFFS/17-lifecycle-marketer.md` | done | strong-general | none |
| `content-strategist` | `HANDOFFS/17-content-strategist.md` | done | strong-general | none |

## Model routing check

- [x] Every IC packet had `llm_tier`
- [x] Creative ICs N/A this phase (`generation_profile: none`)
- [x] Fallbacks recorded — none applied; both ICs used `composer-2.5` per MODEL-REGISTRY / agent pin

## Conflicts resolved

- **Legacy README paths (`emails/` stub):** CMO replaced root `17-channels/README.md` with merged index pointing to `email/` and `social/`; SMS marked skipped (not `sms-templates.md` ⬜).
- **Email ↔ social theme overlap:** Non-blocking — coordination rule added in root README (no same-week duplicate without intent). No craft rewrite required.
- **Social skip vs calendar:** Both valid; CMO recommendation = **skip at Tier 1 if capacity fails**, else Facebook-only at ~3/mo. Calendar remains shelf-ready.
- none other

## Artifacts for C-suite review

| Path | Scorecard check |
|------|-----------------|
| `17-channels/README.md` | Merged index ✅ · SMS skip ✅ · gates ✅ |
| `17-channels/email/` | 4 journeys + README ✅ · full emails ✅ |
| `17-channels/social/` | Map · pillars · calendar · rules ✅ |
| `HANDOFFS/17-lifecycle-marketer.md` | ready_to_merge · model audit ✅ |
| `HANDOFFS/17-content-strategist.md` | ready_to_merge · model audit ✅ |
| `HANDOFFS/17-manager-cmo.md` | This brief |

## Scorecard (CMO)

| Criterion | Pass? | Notes |
|-----------|-------|-------|
| Email sequences written in full | ✅ | Welcome (4) · Interest A (5) · Waitlist B (4) · Tier 2 (2) |
| Interest + waitlist coverage | ✅ | Package A/B language matches inquire + playbook |
| Social channel map + calendar | ✅ | ORB · pillars · 90-day · posting rules |
| Education over litter drops | ✅ | Litter rare/verified-only; not a pillar |
| SMS decision documented | ✅ | Skipped v1 with GTM/ops/consent rationale |
| CTA / Package locks | ✅ | Begin your inquiry; no Buy/FOMO/price |
| Placeholders only | ✅ | `[CONTACT_EMAIL]` `[LOCATION]` etc. |
| Root index merged | ✅ | `email/` + `social/` + SMS skip |
| IC handoffs + manager brief | ✅ | Both ready_to_merge |
| RUNBOOK Phase 17 not marked ✅ | ✅ | Orchestrator + C-suite only |

## Escalation tags

- none

## Asks for C-suite

- **Approve** Phase 17 channel plans (`17-channels/`) as launch guidance?
- Accept **SMS skip for v1** (revisit only with consent + transactional use case)?
- Accept social default: **skip or Facebook-only ~3 posts/month** (not required for launch)?
- Confirm operator will supply Q7 contact/SLA before auto-replies go live?

## Recommendation

**approve** — ship phase artifacts as-is; operator sets Q7/Q1 before ESP + optional social go-live

## collaborates_with

- `creative-director` — optional later for social stills when Q6 media exists (ask orchestrator; CMO does not spawn peer managers this phase)
- Operator ESP wiring — post-gate ops, not a peer desk
