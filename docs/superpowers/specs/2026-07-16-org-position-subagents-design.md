# Design: Virtual Company Positions as Subagents

**Date:** 2026-07-16  
**Status:** Implemented  
**Decisions:** Full company (36 seats) · Dual artifacts (position SKILL.md + Cursor agents)

## Layout

- `skills/org/ORG-REGISTRY.md` — org tree + phase owners  
- `skills/org/orchestrator/SKILL.md` — CEO dispatcher  
- `skills/org/positions/<slug>/SKILL.md` — 36 seats  
- `templates/org/agents/<slug>.md` — Cursor agent defs  

## Runtime

Main session loads orchestrator → resolves Owner from registry → spawns Cursor agent / Task with context packet → managers spawn ICs → artifacts under `docs/projects/<active>/business-idea/`.

Degrade: sequential role-play from position skills if agents unavailable.

## Runbook

Principle #9 + Owner/Delegates on every phase in `business-idea-runbook.mdc`.
