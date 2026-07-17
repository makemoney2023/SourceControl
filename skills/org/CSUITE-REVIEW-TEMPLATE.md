# C-Suite Review Template

Copy to `docs/projects/<active>/business-idea/HANDOFFS/<phase>-csuite-review.md`. Orchestrator must not mark the phase ✅ until `verdict: approve` (Phase 0 may use `skip-review` with reason).

Reviewer always uses **`frontier-reasoning`** (`grok-4-5` per MODEL-REGISTRY).

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

## Inputs reviewed
- Manager brief: `HANDOFFS/<phase>-manager-<slug>.md`
- Key artifacts: …

## Scorecard (from ORG-REGISTRY)
| Criterion | Pass? | Notes |
|-----------|-------|-------|
| … | yes/no | |
| Correct model tier used? | yes/no | Wrong tier/profile on creative/legal → revise |
| Generation profile correct (11/12/15/19)? | yes/no/n/a | e.g. hero-video → Veo 3.1 |

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
