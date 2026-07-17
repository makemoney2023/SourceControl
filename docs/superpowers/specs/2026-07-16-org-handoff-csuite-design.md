# Design: Org Handoff + C-Suite Review Chain

**Date:** 2026-07-16  
**Status:** Implemented  
**Plan:** `docs/superpowers/plans/2026-07-16-org-handoff-csuite.md`

## Rules

1. Orchestrator → managers only  
2. Managers → ICs with write leases  
3. Handoffs on disk (IC, manager brief, csuite review)  
4. Phase ✅ only after C-suite `approve`  
5. Peers via `ask_manager` / orchestrator, never lateral spawn  

## Key files

- `skills/org/orchestrator/SKILL.md`
- `skills/org/HANDOFF-TEMPLATE.md` / `MANAGER-BRIEF-TEMPLATE.md` / `CSUITE-REVIEW-TEMPLATE.md`
- `skills/org/COLLABORATION.md` / `ESCALATION.md`
- `templates/business-idea/HANDOFFS/`
- Position skills + `templates/org/agents/*`
