---
phase: "17"
position: lifecycle-marketer
reports_to: cmo
status: done
verdict_for_manager: ready_to_merge
llm_tier: strong-general
llm_model: composer-2.5
generation_profile: none
generation_used: none
fallback_applied: false
---

# Handoff — Lifecycle Marketer → CMO

## Goal (from context packet)

Produce email sequences for Blacksage Kennels: inquiry nurture (Package A interest list), waitlist nurture (Package B), welcome/confirmation. Full written emails (subject, preview, body, CTA). Document SMS skip with rationale. Do not write social calendar or mark phase complete.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/blacksage-kennels/business-idea/17-channels/email/README.md` | Journey index, cadence rules, Package A/B/C language, placeholders, **SMS skip documented** |
| `docs/projects/blacksage-kennels/business-idea/17-channels/email/inquiry-welcome.md` | 4 full emails: Package A/B auto-ack, human initial response, A confirmation |
| `docs/projects/blacksage-kennels/business-idea/17-channels/email/interest-nurture.md` | 5 full nurture emails for Package A; 3–6 week cadence |
| `docs/projects/blacksage-kennels/business-idea/17-channels/email/waitlist-nurture.md` | 4 full emails for Package B; event/milestone driven |
| `docs/projects/blacksage-kennels/business-idea/17-channels/email/tier2-program-update.md` | 2 full emails for Tier 2 / waitlist-open announcement to interest list |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | strong-general |
| llm_model | composer-2.5 |
| generation_profile | none |
| generation_used | none |
| fallback_applied | no |

## Decisions

- **SMS skipped for v1** — documented in `email/README.md` and below. GTM owned channel is interest/inquiry email; sales playbook §7 excludes SMS at v1; no phone consent flow; trust-first positioning conflicts with SMS urgency patterns.
- **Cadence:** Interest nurture spaced ~3–6 weeks (5 emails); waitlist nurture is event-driven, not weekly. Aligns GTM "low frequency, high value."
- **CTA lock:** Primary conversion CTA remains **Begin your inquiry**; education CTAs link to `/health` anchors and `/dogs`.
- **No pricing/deposits** in any email body; timeline assumptions labeled as assumptions per sales playbook §3.3.
- **Placeholders:** `[CONTACT_EMAIL]`, `[LOCATION]`, `[RESPONSE_SLA]`, `[OPERATOR_NAME]`, `[DOMAIN]` — no invented operator facts.
- **tier2-program-update.md included** — optional but written; 1 announcement + 1 optional gentle reminder (skippable).
- **Did not write:** `17-channels/social/` (content-strategist), root `17-channels/README.md` (CMO merge), manager brief, SMS templates.

## SMS skip (confirmed)

| Reason | Source |
|--------|--------|
| Owned nurture channel = email | `06-gtm-plan.md` § Owned |
| No SMS/live chat at v1 | `07-sales-playbook.md` §7 |
| No TCPA/A2P consent on inquire form | PRD / form spec |
| Anti-FOMO / trust-first voice | D2, GTM CTA locks |
| Selective kennel spam risk | Operator brand posture |

Full rationale in `17-channels/email/README.md` § SMS — skipped for v1.

## Asks for manager (`ask_manager`)

- Peer help needed: **content-strategist** for `17-channels/social/` calendar — lifecycle-marketer scope is email only | none for email craft
- Clarification needed: **Q7** — operator must set `[RESPONSE_SLA]` and `[CONTACT_EMAIL]` before auto-replies go live | **Q1** — confirms when to enable Package B emails and `tier2-program-update.md` broadcast

## Risks / blockers

- Root `17-channels/README.md` still references legacy `emails/` paths — CMO merge should point to `email/` subdir and mark journeys complete.
- Auto-reply wiring depends on Q7 form backend; copy is ready but not implemented in ESP.
- `tier2-program-update.md` must not send until Tier 2 operator gates pass (verified Dogs, zero Tier 3 claims).
- Email 2 in tier2 sequence is optional; CMO/operator should decide whether single follow-up fits brand (recommend skip if engagement is low).

## Packs used

- `skills/org/positions/lifecycle-marketer/SKILL.md`
- `skills/org/HANDOFF-TEMPLATE.md`
- `skills/community/marketingskills/emails/SKILL.md`
- `skills/community/marketingskills/sms/SKILL.md` (read for skip rationale only)

## Do not

- Mark the phase complete
- Write outside write_lease
- Spawn other positions
- Inherit parent model when MODEL-REGISTRY pins a different tier (esp. creative/legal)

## Verdict for manager

**ready_to_merge** — All required email journeys written in full under `17-channels/email/`. SMS skip documented. Awaiting CMO merge into root channel index and ESP/Q7 implementation.
