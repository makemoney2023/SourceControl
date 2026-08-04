# C-Suite Review Template

Copy to `docs/projects/<active>/business-idea/HANDOFFS/<phase>-csuite-review.md`. Orchestrator must not mark the phase ✅ until `verdict: approve` (Phase 0 may use `skip-review` with reason).

Reviewer always uses **`frontier-reasoning`** (`grok-4.5` per MODEL-REGISTRY).

```markdown
---
phase: "<id>"
reviewer: "ceo-strategist"
secondary_reviewers: []
verdict: approve | revise | escalate | skip-review
date: YYYY-MM-DD
llm_tier: frontier-reasoning
llm_model: "<Cursor model ID actually used>"
fallback_applied: false
---

# C-suite review — Phase <id>

## In plain English
3–5 short sentences: the verdict in human terms, what is safe to do next, and what is still blocked. No runIds or dense tables here.

## What we found
- Up to 5 load-bearing agreements or tensions (plain language)

## Next steps
1. Who acts next (operator / orchestrator / seat) and the concrete ask
2. …
3. Blocking questions for the operator (if any)

## Inputs reviewed
- Manager brief: `HANDOFFS/<phase>-manager-<slug>.md`
- Key artifacts: …

## Scorecard (from ORG-REGISTRY)
| Criterion | Pass? | Notes |
|-----------|-------|-------|
| … | yes/no | |
| Correct model tier used? | yes/no | Wrong tier/profile on creative/legal → revise |
| Generation profile correct (11/12/15/19)? | yes/no/n/a | e.g. hero-video → Veo 3.1 |
| Production Layer B complete or skipped with reason? | yes/no/n/a | HTML/app/assets/finals — see production-artifacts pack |
| Verifier pass? | yes/no/n/a | `HANDOFFS/<phase>-verifier.md` with `verdict: pass` (required on shippable) |
| Wire owner named? | yes/no/n/a | ESP / ads / DNS may stay operator |

## Verdict
**approve** — orchestrator may mark phase ✅  
**revise** — comments for manager (do not advance)  
**escalate** — pull in listed secondary reviewers, then re-review  
**skip-review** — only Phase 0 or explicit user waiver; reason required

## Comments for manager
- …

## Decisions to log in RUNBOOK-TRACKER
- …
```
