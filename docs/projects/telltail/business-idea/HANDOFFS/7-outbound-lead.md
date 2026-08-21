---
phase: "7"
position: outbound-lead
reports_to: head-of-sales-cs
status: done
verdict_for_manager: ready_to_merge
llm_tier: strong-general
llm_model: composer-2.5
generation_profile: none
generation_used: none
fallback_applied: false
tool_status:
  parallel-research: unused
  firecrawl: unused
production_status: skipped
production_paths: []
design_brief_path: ""
skip_reason: "Phase 7 outbound lease is explore Respond craft. No Layer B. No store. No send. 4B closed. Outbound pipeline skipped on purpose."
wire_owner: none
wire_checklist_path: ""
wire_notes: "No sequences loaded into a tool. Macros are Layer A copy only."
photoreal_qa: ""
license_basis: ""
---

# Handoff — Outbound Lead → Head of Sales & CS

## Operator brief (plain English)

Wrote the Respond slice: inbound queues aligned to Close’s chat-described / clip-ready / anti-persona tags, support SLAs with hours left blank, full auto-replies and follow-ups, and a chat lane that will not mint a card from text. Skipped the outbound pipeline — no inquiry form, no B2B list, no owner cold-email. The only later outbound is a trainer/rescue share-not-sell note, unsent. Ready to merge; I did not write the playbook or mark the phase complete.

## What we found

- Inquiry-first is GTM Out and the PRD form is N/A, so there is no inbound “lead” to sequence as sales-dev. **[F]**
- Prospecting branches (SaaS / B2B / Local SMB) have no firm to score; Demand-signal owner-scare scraping is a compliance skip. **[I]**
- Chat is already specified as context + attach-in-thread (US-21). Support that coaches from a paragraph would flatten the product into PetGPT. **[F]**
- Unlimited / translator / bite-rehab inbound is refuse-and-stop, not a nurture. **[F]**
- No conversion or WTP to put in a follow-up. A4 stays OPEN. **[F]**

## Next steps

1. **Head of Sales & CS** — merge `07-sales/02-respond.md` into Part II of `07-sales-playbook.md`. Do not mark Phase 7 complete.
2. **Sales Enablement / CSM (not spawned)** — reuse the three tags; CSM owns retain SLAs if they also draft first-response times.
3. **Operator** — set the `[Operator to set]` hours. No new Open register question from this seat.

## Goal (from context packet)

Draft Part II Respond. Prospecting only if honest for B2C IAP; otherwise write why outbound is thin / later. Include chat lane. Report to head-of-sales-cs. Do not spawn. Do not mark the phase complete. Do not write the manager brief or `07-sales-playbook.md`.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/telltail/business-idea/07-sales/02-respond.md` | Mergeable Part II: outbound skip, triage, SLAs, auto-replies, follow-ups, chat lane, later trainer share |
| `docs/projects/telltail/business-idea/HANDOFFS/7-outbound-lead.md` | This handoff |

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
| wire_notes | No ESP / sequencer / CRM load. Macros stay in the markdown. |
| skip_reason | Explore Respond lease; Phase 7 not a shippable Layer B phase this pass; outbound pipeline skipped |

## SDK correlation (optional)

| Field | Value |
|-------|-------|
| sdk_runtime | n/a |
| sdk_agent_id | n/a |
| sdk_run_id | n/a |
| sdk_request_id | n/a |

## Decisions

- Outbound pipeline: **skip**. Honest for B2C IAP. No SDR list.
- Later thin play only: trainer/rescue **share-not-sell**, one note, no 3–5 owner sequence, no kennel AE motion.
- Triage tags: **qualified scare** / **chat-context-only** / **anti-persona** (translator, unlimited hunter, bite-rehab self-serve, plus kids green-light / aversive / kennel).
- SLAs are support-style with `[Operator to set]` hours — not sales-dev.
- Auto-replies and follow-ups never open a price/deposit form. Plus copy (AR-6) only if they ask, IAP-only, test-gated, never $9.99.
- Chat invites a clip when a card is the job. Text-only gets conversation + escalate, not a seen-dog card.
- Triage tags aligned to Close: **chat-described scare** / **clip-ready moment** / **anti-persona** (plus Lite-finish ready / Plus-test candidate).
- Follow-ups add a clip how-to or escalate, then stop. Anti-persona gets one reply and no sequence.
- A5 stays unnamed in every macro.

## Asks for manager (`ask_manager`)

- Peer help needed: `customer-success-manager` if their retain SLA table collides with these first-response hours — I left hours blank on purpose
- Peer help needed: `sales-enablement-lead` only if Close lane names drift (I already matched `01-close.md`)
- Clarification needed: none

## Risks / blockers

- A later seat standing up a “request pricing” form to give outbound something to do.
- Support minting a card from chat text (breaks US-21 / BR-14).
- Unlimited-hunter replies that fight on scan count or say “what serious apps do.”
- A 5-touch owner sequence added “just in case” after merge.
- Plus macros surviving after A+C or K1 dies (would sell a course at $12).
- Filling A5 with a celebrity or ghost trainer in chat voice.

## Packs used

| Pack | Decision tied to pack |
|------|------------------------|
| `skills/community/marketingskills/prospecting/` | Skip the lead sheet. No SaaS/B2B/Local SMB buyer. Demand-signal owner-scare scrape is a compliance skip. |
| `skills/community/marketingskills/cold-email/` | Skip the 3–5 owner sequence. Later trainer note is one resource, not a meeting ask. |
| `skills/org/packs/standing-context/sales-youtube-frameworks/` | Used follow-up (value-add, then stop) and objection (acknowledge + open question) on inbound only — not cold-call close. |

## Do not

- Mark the phase complete
- Write `07-sales-playbook.md` or the manager brief
- Spawn other positions
- Write outside write_lease
- Name-drop packs without a decision row
- Invent conversion, WTP, or an SDR list
- Copy artifacts to OneDrive / iCloud / Google Drive
