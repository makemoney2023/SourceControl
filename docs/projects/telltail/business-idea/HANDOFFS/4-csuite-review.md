---
phase: "4"
reviewer: "ceo-strategist"
secondary_reviewers: []
verdict: approve
date: 2026-08-21
llm_tier: frontier-reasoning
llm_model: grok-4.5
fallback_applied: false
---

# C-suite review — Phase 4 — Telltail

## Operator brief (plain English)

Phase 4 is **approved**. Working Plus is **$12/mo or $99/yr** for 60 Flash reads plus credits — off Aplexity’s $9.99 unlimited cage. Sixty Flash costs about **$0.37**; after Apple’s 30% we keep about **$8.03** on a $12 month (net is $8.40; $8.03 is contribution after vision). If Flash cannot refuse, Plus dies. I am not marking the phase complete. 4B stays closed.

## What we found

- Scorecard passes: unit economics + pricing are explicit. No invented ARR / CAC / conversion.
- C1 accepted: hero **$12 / $99**. Envelope **$9–13 / $79–99** remains. $79 still holds on Flash; $99 is the working annual for net, not a WTP finding.
- Base path ~$0.0061/read is **[F×A]** (list price × assumed 10s clip + think). Contingent on a measured clip.
- **K1** is in the model: 60 Opus/Sol fails the 40% GM gate on every envelope SKU, and $79/30% goes negative. Do not prompt out.
- A+C stays a **test**. Paywall is withdrawn if the test fails — we do not quietly sell curriculum at the same SKU.
- Meter story held: 60 is a safety meter (reads-to-break on Flash at $12/30% ≈ 1,370). Not “what serious apps do.”
- Office skipped honestly. 4B closed.

## New risk or disagreement

None on the math. Two carry-forwards that Phase 5/6 must not flatten:

1. **$12 is a presentation pick, not WTP.** A4 (will they pay 60 Flash vs Tailo/Aplexity unlimited) is still OPEN. Do not write $12 into store screenshots as proven demand.
2. **$0.37 is assumed tokens.** If a real clip + retry policy doubles tokens, Flash still lives. If it becomes frontier, K1 already kills Plus. CTO measures; we do not “add a buffer and ship.”

Spend tag (K1 → CTO) is already in the CFO brief. No second finance pass.

## Next steps

1. **Orchestrator** — file this review. Mark Phase 4 only if you use `verdict: approve`. Do not open 4B.
2. **Phase 5 (Product)** — refuse-first *in front of* the card; quota cannot skip the gate; first Lite read must complete; retry on Flash first.
3. **CTO (via orchestrator, not this seat)** — Flash-refuse eval + measured tokens per clip. Those two keep $12 contingent.
4. **Do not spawn** more Phase 4 ICs from this seat.

## Inputs reviewed

- `HANDOFFS/4-manager-cfo.md`
- `04-business-model.md`
- Phase 3 locks (`03-strategy.md` — A+C test, meter-is-ours, K1 language)

## Scorecard (from ORG-REGISTRY)

| Criterion | Pass? | Notes |
|-----------|-------|-------|
| Unit economics + pricing explicit | yes | Working SKU $12 / $99; envelope kept; COGS table; GM on net; breakeven as reads-to-break; K1 named |
| Correct model tier used? | yes | CFO frontier-reasoning; FPA fallback grok-4.5 noted; PMM composer-2.5 |
| Generation profile correct (11/12/15/19)? | n/a | |
| Production Layer B complete or skipped with reason? | yes | skipped — Phase 4 is Layer A; 4B closed |
| Verifier pass? | n/a | Office not complete |
| Wire owner named? | n/a | |
| Artifact quality? | yes | Model type, units, anti-patterns, no invented revenue |
| Pack procedure? | yes | FPA + PMM leased; C1 resolved by CFO |
| Client artifact path? | yes | `04-business-model.md` |
| Model tier? | yes | |

## Verdict

**approve** — orchestrator may mark Phase 4 complete. Working SKU $12 / $99. K1 remains a hard kill. 4B **closed**. Explore only.

## Comments for manager

- Keep saying **contribution $8.03** vs **net $8.40** after 30% — do not collapse them in tracker copy.
- Do not list Plus at **$9.99**.
- Do not lead annual at $79 (weaker net). Envelope stays; $99 is the working year.
- Paywall hero stays harm-per-wrong-fire. Disclose 60 + credits. No unlimited.
- A+C remains a test. If it fails, this paywall is withdrawn.

## Redlines

| path | comment |
|------|---------|
| — | none |

## Decisions to log in RUNBOOK-TRACKER

- Working published SKU: **$12/mo / $99/yr**, 60 Flash + credits, Lite 3–5
- Envelope unchanged: $9–13 / $79–99; never $9.99
- K1: Flash-refuse fail kills Plus — do not prompt out
- 4B closed
- Phase 4 **approved** (this seat does not mark the runbook)
