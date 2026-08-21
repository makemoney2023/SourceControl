---
phase: "7"
position: "sales-enablement-lead"
reports_to: "head-of-sales-cs"
status: done
verdict_for_manager: ready_to_merge
llm_tier: strong-general
llm_model: composer-2.5
generation_profile: none
generation_used: none
fallback_applied: false
tool_status:
  firecrawl: unused
  parallel-research: unused
production_status: skipped
production_paths: []
design_brief_path: ""
skip_reason: "Explore Layer A — Close slice is markdown only; no Layer B, no store, no paid, nobody is building."
wire_owner: none
wire_checklist_path: ""
wire_notes: ""
---

# Handoff — Sales Enablement Lead → Head of Sales & CS

## Operator brief (plain English)

Part I Close is drafted as a B2C IAP loop, not a demo sale: qualify the scare and the shopper, finish Lite (card or refuse), then offer Plus only as a test. Chat is a first-class lane for context; a moment card still needs a clip, and “I don’t have a video” gathers story + invites media instead of inventing a read. Stay-on-Lite is a real close. Ready for you to merge with outbound and CS — I did not write the playbook or mark the phase done.

## What we found

- Chat-described scare and clip-ready moment are different qualification gates; flattening them into one “conversation coach” would become PetGPT.
- Refuse-as-close is a finished Lite scare (US-07) and a valid IAP *non*-ask — especially kids-in-frame / bite-risk / medical.
- Unlimited-at-~$10 (Tailo / Aplexity) is the load-bearing price objection; the honest answer is harm-per-wrong-fire, then fail Plus if volume is the only job.
- A4 / WTP, Lite N in {3,4,5}, and credit-pack dollars stay `[Operator to set]` — Close must not invent them.
- No new Open question. A1 / A3 / A4 / A5 remain the existing register.

## Next steps

1. **Head of Sales & CS** — merge this Close slice with Outbound (Part II) and CS (Part III). Do not have this seat write `07-sales-playbook.md` or the manager brief.
2. **Outbound Lead / CSM (your spawn, not mine)** — inherit the anti-persona fails and the escalate-to-human seam; do not write sequences or onboarding into `01-close.md`.
3. **No new operator ask.** Do not re-ask $12, 60, never $9.99, A5, or film-during-scare.

## Goal (from context packet)

Draft Part I Close for Telltail B2C IAP — IAP qualification, talk tracks, objections. Not a B2B demo sale. Include chat lane. Report to head-of-sales-cs. Do not spawn. Do not mark the phase complete. Do not write the manager brief or `07-sales-playbook.md`.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/telltail/business-idea/07-sales/01-close.md` | Mergeable Close: lane gates, Lite / Plus / anti-persona checklists, four talk tracks, objection library + escalate-to-human, one-pager + paywall outline beats, Part II/III placeholders |
| `docs/projects/telltail/business-idea/HANDOFFS/7-sales-enablement-lead.md` | This handoff |

Local Mac only (`/Users/cbsuperpatch/Desktop/ClaudeSkills/docs/projects/telltail/business-idea/`). Not OneDrive.

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | strong-general |
| llm_model | composer-2.5 |
| generation_profile | none |
| generation_used | none |
| fallback_applied | no |

## Production (shippable phases — required)

| Field | Value |
|-------|-------|
| production_status | skipped |
| production_paths | none |
| wire_owner | none |
| wire_notes | n/a |
| skip_reason | Explore Layer A; Close is markdown; no Layer B / store / paid |

Phase 7 is not a shippable Layer B phase in `ARTIFACT-QUALITY.md` (no q7 row). Production skipped on purpose.

## SDK correlation (optional)

| Field | Value |
|-------|-------|
| sdk_runtime | n/a |
| sdk_agent_id | n/a |
| sdk_run_id | n/a |
| sdk_request_id | n/a |

## Decisions

- Close motion = Lite scare finishes (card **or** refuse) → Plus $12/60 as a **test**. Stay-on-Lite is a valid end.
- Qualification has three verdicts: Lite-finish ready / Plus-test candidate / anti-persona fail — plus a chat-lane vs clip-lane gate that runs first.
- “No video” talk track = gather context, invite a clip, never mint a card from text (US-21).
- Objections use acknowledge-then-ask (Conversation Aikido). Disclose 60 + refuse-at-zero *before* the Plus consent ask. No high-pressure backup close.
- Enablement assets this pass = outlines only (one-pager beats + in-app paywall hero beats). No B2B demo script, no Layer B HTML.
- Unknown numbers labeled `[Operator to set]`. No invented WTP, conversion, or “$12 is proven.”

## Asks for manager (`ask_manager`)

- Peer help needed: none for this craft. You merge `outbound-lead` (Part II) and `customer-success-manager` (Part III) on your side — do not have me spawn them.
- Clarification needed: none

## Risks / blockers

- A1 still OPEN — if owners never attach a clip, Close’s clip-ready lane starves and chat-only pressure will try to invent cards. Product lock already forbids that; enablement must keep failing it.
- A4 still OPEN — O1/O2 will be the dominant shopper reaction; copy cannot close WTP.
- K1 / A+C test fail withdraws every Plus talk track. Do not leave a $12 course in the merge.
- A5 unnamed — talk tracks stay reward-based / management. Naming a celebrity trainer is a claims kill.
- Brand collision (Little Rock trainer / telltail.com) is GTM/Legal, not this Close — do not reopen.

## Packs used

| Pack | Decision tied to pack |
|------|------------------------|
| `skills/community/marketingskills/sales-enablement/` | Situation-specific B2C IAP Close (not a 10-slide enterprise deck). Objection rows use statement / why / response / proof / follow-up plus a one-screen quick table. One-pager is five scannable beats, not a proposal. |
| `skills/community/awesome-claude-corporate-skills/05-sales/call-prep/` | Treated the in-app scare as the “call”: snapshot = what just happened; agenda = finish Lite first; discovery questions live on the chat lane, not a B2B MEDDIC sheet. |
| `skills/community/awesome-claude-corporate-skills/05-sales/create-an-asset/` | Used the one-pager skeleton (hero / 3 points / proof / CTA) as an **outline only** — no HTML asset, no prospect-branded landing page, no demo walkthrough. |
| `skills/org/packs/standing-context/sales-youtube-frameworks/` | `frameworks/objection_handling.md` → Conversation Aikido (acknowledge + open question; do not karate “only 60”). `frameworks/closing_techniques.md` → disclose 60/refuse before the consent ask; discard high-pressure backup-close. |

## Do not

- Mark the phase complete
- Write outside write_lease (`07-sales-playbook.md`, manager brief, outbound sequences, CS onboarding)
- Spawn other positions
- Inherit a frontier model — this seat is `strong-general` / `composer-2.5`
- Name-drop packs without a decision row
- Invent WTP, conversion, or a named A5 voice
