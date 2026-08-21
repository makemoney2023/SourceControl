---
phase: "4"
position: "product-marketing-manager"
reports_to: "cfo"
status: done
verdict_for_manager: ready_to_merge
llm_tier: strong-general
llm_model: composer-2.5
generation_profile: none
generation_used: none
fallback_applied: false
tool_status:
  parallel-research: unused
production_status: skipped
production_paths: []
design_brief_path: ""
skip_reason: "Phase 4 PMM is pricing-presentation sidecar, not a shippable Layer B artifact."
wire_owner: none
wire_checklist_path: ""
wire_notes: ""
---

# Handoff — Product Marketing Manager → CFO

## Operator brief (plain English)

Pricing presentation is in a sidecar for you to merge — I did not touch `04-business-model.md` and I invented no WTP. v1 publishes Lite vs Plus on the paywall; 60 + credits is disclosed; the hero is harm-per-wrong-fire, not a scan fight with Tailo or Aplexity. One flag: do not land Plus at $9.99 next to Aplexity’s unlimited $9.99 unless you want “stingy” as the first review.

## What we found

- Inquiry-first is the wrong posture for this B2C IAP. Publish the band; Apple will show the price anyway.
- Credits ($8–12 / 20, still [A]) belong behind Plus as overflow, not as a third plan that re-opens binge.
- Trainer seat $29–49 stays off the v1 grid so we do not look like we replace a trainer.
- If Flash cannot refuse, the offer copy already contains the kill: $9 Plus is not a product — don’t paper it.
- `HANDOFFS/0-manager-cfo.md` is not on the Telltail disk; packet + `03-strategy.md` used.

## Next steps

1. **CFO** — merge this sidecar into `04-business-model.md` with FP&A’s tables. Pick the SKU inside $9–13 with C1 in mind ($9.99 vs Aplexity).
2. **FP&A** — unit-econ still yours. Credit-pack COGS and whether annual includes a buffer are not priced here.
3. **No new operator question.** Flash-refuse remains Product/CTO. Named voice remains founder.

## Goal (from context packet)

Pricing posture + packaging + offer anatomy for Telltail Phase 4. Presentation only. Report to CFO. Do not spawn. Do not mark the phase complete. 4B stays closed.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/telltail/business-idea/04-pmm-pricing-packaging.md` | Sidecar: posture, packages, value metric, paywall, 60-vs-unlimited, credits, claims, contradictions |
| `docs/projects/telltail/business-idea/HANDOFFS/4-product-marketing-manager.md` | This handoff |
| `docs/projects/telltail/business-idea/.agents/product-marketing.md` | Short Phase 4 addendum only — no Phase 3 lock reopened |

Local Mac only (`/Users/cbsuperpatch/Desktop/ClaudeSkills/docs/projects/telltail/business-idea/`). `/dev/disk3s5`. Not OneDrive.

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
| skip_reason | Phase 4 presentation sidecar; no Layer B |

## SDK correlation (optional)

| Field | Value |
|-------|-------|
| sdk_runtime | n/a |
| sdk_agent_id | n/a |
| sdk_run_id | n/a |
| sdk_request_id | n/a |

## Decisions

- Published IAP paywall, not inquiry-first.
- v1 grid = Lite (3–5 Lite-model reads, gates always on) / Plus (60 Flash + credits). Credits overflow. Trainer seat out of v1.
- Value metric = a **read** = one honest moment (or a refuse), not unlimited chat.
- Paywall leads harm-per-wrong-fire. 60 explained as “wrong trainer does not fire 200×/month.” Not “what serious apps do.”
- Credit pack merchandising = $8–12 / 20 **[A]** seed, not a lock, not a hero column.
- If Flash cannot refuse, kill the Plus promise in the offer — do not paper it.
- C1 escalated: avoid hero SKU at $9.99 against Aplexity unlimited $9.99.

## Asks for manager (`ask_manager`)

- Peer help needed: none (no spawn)
- Clarification needed: **C1** — should Plus avoid $9.99 so it does not sit on Aplexity’s unlimited SKU? Presentation only; band $9–13 unchanged. FP&A owns the number.

## Risks / blockers

- WTP for 60 vs unlimited Gemini (A4) still OPEN. Copy cannot close it.
- Flash-refuse OPEN. Plus is not a product if it fails.
- Missing `0-manager-cfo.md` on this venture’s disk — used packet + strategy.
- A+C remains a **test**; a confident paywall must not smuggle a launch lock.

## Packs used

| Pack | Decision tied to pack |
|------|------------------------|
| `skills/community/marketingskills/product-marketing/` | Packages and value metric stay aligned to the Phase 3 context file; only a short Phase 4 addendum appended. |
| `skills/community/advertising-skills/skills/foundations/offer-extraction/` | Dominant offer is 60 honest Flash reads + a hard stop; kill switch is inside the offer if Flash cannot refuse. |
| `skills/community/marketingskills/marketing-psychology/` | Paywall uses loss aversion / prospect theory (harm-per-wrong-fire) and paradox of choice (two plans, not a trainer-seat decoy). Avoided matching Aplexity’s $9.99 anchor (C1). |
| `skills/org/packs/standing-context/buying-psychology/` | 60 is a real cap (ethical scarcity), not a fake countdown; Tailo/Aplexity unlimited is the reference price we reframe, not race. |
| `skills/community/advertising-skills/skills/foundations/avatar-extraction/` | Lite exists so P0 “first-week panic” can finish one 11pm scare before Plus; first Lite read must complete. |

## Do not

- Mark the phase complete
- Write outside write_lease (`04-business-model.md` stays with CFO)
- Spawn other positions
- Invent WTP, conversion, or revenue
- Market 60 as category-norm metering
- Copy artifacts to OneDrive / iCloud / Google Drive
