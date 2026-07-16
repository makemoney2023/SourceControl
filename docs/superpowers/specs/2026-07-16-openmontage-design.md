# Design: OpenMontage → Runbook Video Production

**Date:** 2026-07-16  
**Status:** Implemented  
**Source:** [calesthio/OpenMontage](https://github.com/calesthio/OpenMontage) — AGPL-3.0

## Goal

Vendor the full OpenMontage agentic video production system and make it the default path whenever the business-idea runbook needs to generate video.

## Decisions

| Decision | Choice |
|----------|--------|
| Location | `skills/community/openmontage/` (shallow clone, no `.git`) |
| License | AGPL-3.0 — keep upstream LICENSE; document in pack + root README |
| Skill counting | One community **system** (not +500 to ClaudeSkills skill total) |
| Video rule | Pipeline-first per OpenMontage Rule Zero |
| Helpers kept | `visual-skills/video`, Remotion skills, `marketingskills/video` |

## Runbook

- Global visual principle: images → visual-skills; **video → OpenMontage pipeline**
- Phase 15: OpenMontage primary
- Phase 19: OpenMontage when paid needs video creatives
