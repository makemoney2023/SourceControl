# Design: Kim Barrett Advertising Skills → Marketing Stack

**Date:** 2026-07-16  
**Status:** Implemented (2026-07-16)  
**Source:** [realkimbarrett/advertising-skills](https://github.com/realkimbarrett/advertising-skills) (listed in [VoltAgent/awesome-agent-skills § Advertising Skills by Kim Barrett](https://github.com/VoltAgent/awesome-agent-skills#advertising-skills-by-kim-barrett))

## Goal

Vendor Kim Barrett’s 12 direct-response advertising skills into ClaudeSkills as a first-class community pack, and wire them into `business-idea-runbook.mdc` so agents run the full chain during marketing execution — not only when someone remembers to load them.

## Decisions (locked)

| Decision | Choice |
|----------|--------|
| Pack location | `skills/community/advertising-skills/` (new pack, not nested under `marketingskills/`) |
| Folder layout | Keep upstream categories: `foundations/`, `copy-chief/`, `operator-os/`, `orchestrators/`, `qa/` |
| Runbook depth | Full chain across Phases 2, 4, 13, 18, 19, 22 |
| Phase model | Approach 1 — extend existing phases (no new Phase 19B) |
| Skill bodies | Vendor as-is; do not rewrite upstream content |
| Existing business-idea docs | Out of scope — do not re-run deliverables unless asked later |

## Pack contents (12 skills)

| Category | Skill | Purpose |
|----------|-------|---------|
| foundations | `avatar-extraction` | Buyer avatar: wants, tried, drivers |
| foundations | `offer-extraction` | High-converting offer from product/service |
| copy-chief | `schwartz-awareness-mapper` | Awareness level → messaging approach |
| copy-chief | `mechanism-builder` | Unique mechanism / why this works |
| copy-chief | `headline-matrix` | Headline variations across angles |
| copy-chief | `objection-crusher` | Objections and neutralization |
| operator-os | `ad-angle-multiplier` | Expand core idea into testable ad angles |
| operator-os | `scroll-stopping-creative` | First-3-seconds creative concepts |
| operator-os | `conversion-path-builder` | Click → conversion / booked-call path |
| operator-os | `performance-diagnosis` | Underperforming campaign diagnosis |
| orchestrators | `full-funnel-campaign-orchestrator` | End-to-end ads + funnel coordination |
| qa | `generic-language-killer` | Kill vague / corporate / AI-sounding copy |

Upstream also includes `README.md`, `AGENTS.md`, `VERSIONS.md`, and `examples/` — keep them in the pack root.

**License:** Individual skill frontmatter declares `license: MIT`. Repo-level SPDX may be missing upstream; document MIT from skill frontmatter in the pack README and note the upstream source URL.

## Target tree

```
skills/community/advertising-skills/
├── README.md                 # ClaudeSkills pack hub (source, install, runbook map)
├── AGENTS.md                 # upstream chain rules (kept)
├── VERSIONS.md               # upstream
├── examples/                 # upstream
└── skills/
    ├── foundations/{avatar-extraction,offer-extraction}/
    ├── copy-chief/{schwartz-awareness-mapper,mechanism-builder,headline-matrix,objection-crusher}/
    ├── operator-os/{ad-angle-multiplier,scroll-stopping-creative,conversion-path-builder,performance-diagnosis}/
    ├── orchestrators/{full-funnel-campaign-orchestrator}/
    └── qa/{generic-language-killer}/
```

**Layout rule:** Mirror upstream exactly (`skills/<category>/<skill-name>/SKILL.md`). Runbook paths:

`advertising-skills/skills/<category>/<skill-name>/`

## Runbook integration

File: `rules/shared/business-idea-runbook.mdc`

| Phase | Insert | Order / notes |
|-------|--------|----------------|
| **2** Market & customer intelligence | `avatar-extraction` | After `customer-research` |
| **4** Business model & economics | `offer-extraction` | After `offers` |
| **13** Copy foundation | `schwartz-awareness-mapper` → `mechanism-builder` → `headline-matrix` → `objection-crusher` → `generic-language-killer` | After existing copy skills; QA last |
| **18** Conversion optimization | `conversion-path-builder` | Alongside CRO skills |
| **19** Paid acquisition | `ad-angle-multiplier` → `scroll-stopping-creative` → `full-funnel-campaign-orchestrator` | Alongside `ads` / `ad-creative`; orchestrator last |
| **22** Operate | `performance-diagnosis` | When paid KPIs miss or user reports underperformance |

Phase 19 skip rule unchanged: skip with reason if no budget; continue to Phase 20.

**Fast paths:** “Marketing & content only” may still skip 19 unless paid is in scope. No mandatory change to the fast-path table beyond documenting that Phase 19 advertising-skills run when paid is executed.

**Outputs (informational, no new template files required):**

- Phase 2: avatar section can land in `02-market-research.md` or a short `02-avatar.md` subsection — prefer enriching `02-market-research.md` to avoid tracker churn.
- Phase 4: offer extraction enriches `04-business-model.md`.
- Phase 13: awareness/mechanism/headlines/objections enrich `13-copy-foundation.md`.
- Phase 18: conversion path enriches `18-conversion.md`.
- Phase 19: angles/creative/orchestrator enrich `19-paid.md`.
- Phase 22: diagnosis entries append to `22-operating-cadence.md`.

## Documentation updates

| File | Change |
|------|--------|
| `skills/community/advertising-skills/README.md` | New pack hub (source, categories table, install, runbook phase map) |
| `README.md` (repo root) | New “Community — Advertising Skills (12)” section next to Marketing Skills; install `cp` example |
| `rules/shared/business-idea-runbook.mdc` | Skill rows per phase table above |

## Non-goals

- Rewriting or “improving” upstream skill prose
- Merging into `marketingskills/`
- Flattening category folders
- Creating Phase 19B
- Re-executing an in-flight business-idea runbook
- Publishing to skills.sh / npm

## Verification

1. All 12 skills present under `skills/community/advertising-skills/` with `SKILL.md`
2. Pack README lists every skill and phase mapping
3. Root README links to the pack
4. Runbook Phase 2/4/13/18/19/22 tables include the paths above
5. Grep for `advertising-skills/` in the runbook returns the expected skill count (12 skill path references)

## Implementation outline (for writing-plans)

1. Sparse-clone or archive-copy upstream into `skills/community/advertising-skills/`
2. Write ClaudeSkills pack `README.md` (hub)
3. Update root `README.md`
4. Patch `business-idea-runbook.mdc` phase tables
5. Verify file presence + grep counts
