# Manager Brief Template

Copy to `docs/projects/<active>/business-idea/HANDOFFS/<phase>-manager-<mgr-slug>.md` after ICs return and before C-suite review.

```markdown
---
phase: "<id>"
manager: "<slug>"
ics_spawned: []
status: ready_for_csuite | blocked
recommendation: approve | revise | escalate
llm_tier: "<manager tier from MODEL-REGISTRY>"
llm_model: "<Cursor model ID actually used>"
generation_profile: none
fallback_applied: false
---

# Manager brief — <Title> — Phase <id>

## In plain English
3–5 short sentences a non-technical operator can understand: what the team did, what it means, and whether we can continue. No runIds, no scorecard tables here.

## What we found
- Up to 5 load-bearing facts or labeled assumptions

## Next steps
1. Who acts next (operator / seat) and the concrete ask
2. …
3. Blocking questions the operator must answer (if any)

## Summary (5 bullets max)
- … (optional detail; prefer the three sections above for Jarvis / operators)

## IC handoffs merged
| IC | Handoff path | Status | llm_tier | generation_used |
|----|--------------|--------|----------|-----------------|
| `copy-chief` | `HANDOFFS/<phase>-copy-chief.md` | done | creative-language | none |

## Model routing check
- [ ] Every IC packet had `llm_tier`
- [ ] Creative ICs used correct `generation_profile` (or skip reason)
- [ ] Fallbacks recorded when Max Mode / plan blocked preferred model

## Conflicts resolved
- … | none

## Artifacts for C-suite review
| Path | Scorecard check |
|------|-----------------|
| `docs/projects/<active>/business-idea/…` | |

## Escalation tags
- none | legal | brand | spend | scope | evidence

## Asks for C-suite
- …

## Recommendation
**approve** — ship phase artifacts as-is  
**revise** — send back to ICs with comments below  
**escalate** — needs another C-suite seat (see tags)
```
