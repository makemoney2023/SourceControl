# HANDOFFS/

Structured upward reporting for the virtual company. Created during runbook execution.

## Naming

| Kind | Path |
|------|------|
| IC → manager | `<phase>-<ic-slug>.md` |
| Manager → C-suite | `<phase>-manager-<mgr-slug>.md` |
| C-suite verdict | `<phase>-csuite-review.md` |
| Append-only log (optional) | `_log.md` |

Templates live in ClaudeSkills:

- `skills/org/HANDOFF-TEMPLATE.md`
- `skills/org/MANAGER-BRIEF-TEMPLATE.md`
- `skills/org/CSUITE-REVIEW-TEMPLATE.md`

Every handoff must include model audit fields: `llm_tier`, `llm_model`, `generation_profile`, `generation_used`, `fallback_applied` (see `skills/org/MODEL-REGISTRY.md`).

Every IC handoff, manager brief, and C-suite review must include the **Operator brief** near the top:

1. `## Operator brief (plain English)` — 3–5 sentences a non-technical operator can understand  
2. `## What we found` — load-bearing facts  
3. `## Next steps` — who acts + blocking questions  

Jarvis / Situation Room reads these sections directly. Do not leave jargon for a later rewrite.

A phase is not complete until `*-csuite-review.md` has `verdict: approve` (or Phase 0 `skip-review` with reason).
