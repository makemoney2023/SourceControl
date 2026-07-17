# Business Idea Runbook Tracker

**Idea:** Smart sorbent-based atmospheric water generator with Raspberry Pi edge control
**Classification:** Hardware / robotics — grid-down passive
**Mode:** build
**Depth:** full-execution
**Started:** 2026-07-14
**Last updated:** 2026-07-16
**Current phase:** 2

## Execution mode

- **Continuous** — run phases in order until Phase 21 complete or explicit STOP
- **Resume** — read this file at every session start; continue from first ⬜/🔄 phase
- **Source:** [Gemini chat](https://share.gemini.google/qS0VN4WEAgkJ) extracted to `00-gemini-source.md` + `00-system-block-diagram.md`

## Phase status

| Phase | Name | Status | Artifact | Notes |
|-------|------|--------|----------|-------|
| 0 | Intake | ✅ | 00-intake.md | Extracted from Gemini chat |
| 1 | Frame | ✅ | 01-problem-framing.md | |
| 2 | Market | 🔄 | 02-evidence-base.md + 02-market-research.md | deep-research first |
| 3 | Strategy | ⬜ | 03-strategy.md | |
| 4 | Business model | ⬜ | 04-business-model.md | |
| 4B | Funding & investor materials | ⏭️ | — | bootstrapped |
| 5 | Product | ⬜ | 05-prd.md | |
| 6 | GTM strategy | ⬜ | 06-gtm-plan.md | |
| 7 | Sales & CS | ⬜ | 07-sales-playbook.md | |
| 8 | Ops & legal | ⬜ | 08-operations.md | |
| 8B | People & hiring plan | ⏭️ | — | no hires planned |
| 9 | Build MVP (software) | ⏭️ | — | Pi kiosk UI only; no web MVP |
| 9B | Hardware & CAD | ✅ | 09b-hardware-build.md + 09b-hardware/cad/ | 18 STEP files — collapsible TEBS-1 complete |
| 10 | Strategy QA | ⬜ | 10-strategy-review.md | |
| 11 | Brand & design system | ⬜ | 11-brand-system.md | |
| 12 | Web design & IA | ⬜ | 12-web-design.md | |
| 13 | Copy foundation | ⬜ | 13-copy-foundation.md | |
| 14 | Page content | ⬜ | 14-pages/ | |
| 15 | Video & media | ⬜ | 15-media/ | |
| 16 | SEO implementation | ⬜ | 16-seo.md | |
| 17 | Email & social | ⬜ | 17-channels/ | |
| 18 | Conversion UX | ⬜ | 18-conversion.md | |
| 19 | Paid acquisition | ⏭️ | — | no ad budget |
| 20 | Analytics | ⬜ | 20-analytics.md | |
| 21 | Launch & final QA | ⬜ | 21-executive-summary.md | DONE |
| 22 | Operate (recurring) | ⬜ | 22-operating-cadence.md | post-launch |

Status: ⬜ pending · 🔄 in progress · ✅ done · ⏭️ skipped

## Skipped phases (with reason)

| Phase | Reason |
|-------|--------|
| 4B | Bootstrapped prototype — no fundraise |
| 8B | Solo/small team, no hires planned |
| 9 | No web software MVP — Pi kiosk UI is the software surface |
| 19 | No ad budget stated |

## Open questions (blocking only)

- Danny's role on the project?

## Decisions log

| Date | Phase | Decision |
|------|-------|----------|
| 2026-07-14 | 0 | Classified as Hardware/robotics; Gemini chat as primary source; full-execution depth |
| 2026-07-14 | 0 | Skip 4B, 8B, 9, 19 initially |
| 2026-07-14 | 0 | **Grid-down passive** confirmed — no Pi/cloud/software MVP |
| 2026-07-14 | 9B | CAD generated: 8 STEP files + assembly from Gemini DFM schematics |
| 2026-07-14 | 9B | TEBS-1 collapsible shell, ESGS-1, MOF puck housings, collapsed assembly — CAD complete |

## Positions & handoffs

| Phase | Manager | ICs spawned | Handoff dir | C-suite verdict | Reviewer | Manager llm_tier |
|-------|---------|-------------|-------------|-----------------|----------|------------------|
| 2 | head-of-research |  | `HANDOFFS/` |  | ceo-strategist | strong-general |

Model routing SSOT: `skills/org/MODEL-REGISTRY.md`. Creative phases log `generation_profile` / `generation_used` on handoffs.

## Skills completed this run

| Phase | Skills applied |
|-------|----------------|
| 0 | Manual extraction from Gemini shared chat |
| 1 | business-problem-framing, problem-statement-refiner, assumption-extractor, constraint-detector (patterns) |
