---
phase: "4"
manager: "cfo"
ics_spawned: ["fpa-analyst", "product-marketing-manager"]
status: ready_for_csuite
recommendation: approve
llm_tier: frontier-reasoning
llm_model: grok-4.5
generation_profile: none
fallback_applied: false
---

# Manager brief — Telltail — Phase 4

## Operator brief (plain English)

Pricing and unit economics are now explicit. Working Plus is **$12/mo or $99/yr** for 60 Flash-class reads plus credits — not $9.99, because that sits on Aplexity’s unlimited Gemini. Sixty Flash costs about **$0.37**; after Apple’s 30% you still keep about **$8** on $12 (96% GM on net). If Flash cannot refuse, Plus is not a product — that kill is in the model, not a footnote. I am not marking the phase complete. 4B stays closed.

## What we found

- Stack + meter locks hold: one Flash-class multimodal call per read; 60 included; frontier cascade-only; Lite 3–5 on the cheap model. **[F]**
- Base COGS $0.37 / 60 Flash+think **[F×A]**. Store take is the bigger bite. Cascade 20% still clears 40% GM on every envelope SKU.
- C1 resolved: published hero **$12 / $99**. Envelope $9–13 / $79–99 remains. Not a WTP claim (A4 still OPEN).
- **K1** (Flash-refuse FAIL → 100% Opus/Sol): $12/30% GM 32–39%; $9/30% 10–19%; $79/30% **negative**. Kill Plus. Do not prompt out.
- No revenue invented. 3-statement skipped. Free Lite unloaded (mix unknown).

## Next steps

1. **CEO** — C-suite review of `04-business-model.md`. Verdict is yours. Do not treat this brief as phase-complete.
2. **CTO (via orchestrator, not spawned here)** — Flash-refuse eval + measured tokens per clip. Those two keep $12 contingent.
3. **Operator** — enroll Apple SBP when there is an Account Holder. No new founder question.

## Summary (5 bullets max)

- Published IAP: Lite vs Plus; credits overflow; trainer seat out of v1.
- Paywall leads harm-per-wrong-fire; meter disclosed; quota cannot skip refuse.
- Reads-to-break on Flash at $12/30% ≈ 1,370 — the 60-cap is a safety meter.
- 4B closed. No raise. Explore only.
- Two ICs, non-colliding leases, both `ready_to_merge`.

## IC handoffs merged

| IC | Handoff path | Status | llm_tier | generation_used |
|----|--------------|--------|----------|-----------------|
| `fpa-analyst` | `HANDOFFS/4-fpa-analyst.md` | done / ready_to_merge | strong-general | none (fallback grok-4.5) |
| `product-marketing-manager` | `HANDOFFS/4-product-marketing-manager.md` | done / ready_to_merge | strong-general / composer-2.5 | none |

## Model routing check

- [x] Both IC packets had `llm_tier: strong-general`
- [x] FPA fallback recorded (composer-2.5 preferred; ran grok-4.5)
- [x] PMM used composer-2.5; no generation profile
- [x] This brief: frontier-reasoning / grok-4.5; no fallback

## Conflicts resolved

- **C1 $9.99:** accepted. Hero SKU $12 / $99.
- **Price pick:** FPA left the band; PMM would not invent a SKU. CFO locked working published prices.
- **Desktop missing Phase 0 CFO brief:** copied to Desktop this phase.
- A+C remains a **test**. Paywall does not smuggle a launch lock.

## Artifacts for C-suite review

| Path | Scorecard check |
|------|-----------------|
| `docs/projects/telltail/business-idea/04-business-model.md` | Model type, units, pricing, packaging, cost, unit econ, breakeven, sensitivity, K1, anti-patterns, funding, blockers, F/I/A, recommendation |
| `04-fpa-unit-economics.md` | Quantitative lease |
| `04-pmm-pricing-packaging.md` | Packaging / paywall lease |
| `HANDOFFS/4-manager-cfo.md` | This brief |

## Production check (shippable phases)

| Field | Value |
|-------|-------|
| production_status (merged) | skipped |
| Layer B paths | none |
| wire_owner | n/a |
| skip_reason | Phase 4 is not a shippable Office phase. 4B closed. |

## Escalation tags

- spend (K1 / Flash-refuse leftover → CTO)
- evidence (A4 WTP still OPEN — not a Phase 4 block)

## Asks for C-suite

- Review and verdict. Do not mark Phase 4 ✅ from Finance.
- Do not open 4B.
- Do not spawn more finance ICs.
- If you want a different in-band SKU, keep it **off $9.99**.

## Recommendation

**approve** — ship Phase 4 artifacts as-is for CEO review. Pricing and unit economics are explicit. Phase remains open until CEO / orchestrator close it.
