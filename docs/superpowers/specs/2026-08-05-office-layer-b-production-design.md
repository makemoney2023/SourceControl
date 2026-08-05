# Design: Office Layer B Production (docx / pptx / xlsx)

**Date:** 2026-08-05  
**Status:** Approved / Implemented (2026-08-05)  
**Decisions:** Org-wide via `production-artifacts` · Verifier existence checks · No sample generators in v1  
**Extends:** `2026-08-05-ceo-position-skill-upgrade-design.md`, `packs/production-artifacts`

## Purpose

Markdown under `business-idea/` stays Layer A SSOT. Shareable Word / PowerPoint / Excel files are Layer B production with `production_status`, leased paths, and verifier existence checks when claimed complete.

## Decisions (locked)

| Decision | Choice |
|----------|--------|
| Placement | Extend `production-artifacts` (not a separate pack) |
| Formats | `.docx`, `.pptx`, `.xlsx` |
| Paths | Under `docs/projects/<active>/business-idea/exec/` (plus `04b-funding/` for raise materials) |
| Always office-shippable | Phases **4B**, **21** |
| Optional office | Phases **3**, **10** — produce when packet `require_office: true` or seat sets `production_status: complete` |
| Verifier | File exists, size > 0, extension matches claim — no deep content QA |
| Design brief | Required for branded **pptx**; optional for plain docx/xlsx |
| Sample generators | Out of scope v1 |

## Canonical paths

| Class | Path |
|-------|------|
| Exec report | `exec/<phase>-<slug>.docx` e.g. `exec/21-executive-summary.docx` |
| Strategy / findings | `exec/03-strategy-brief.pptx`, `exec/10-strategy-findings.docx` (optional) |
| Pitch deck | `04b-funding/pitch.pptx` (or `exec/04b-pitch.pptx`) |
| Model | `04b-funding/model.xlsx` |

Prefer `04b-funding/` for Phase 4B so craft MD and Layer B colocate.

## Phase matrix

| Phase | Craft | Production owner | Layer B default | Verifier |
|-------|-------|------------------|-----------------|----------|
| 4B | `04b-funding.md` | `fundraising-lead` | pptx + xlsx (or skip) | Always when phase runs |
| 21 | `21-executive-summary.md` | `ceo-strategist` | docx (or skip) | Always when phase runs |
| 3 | `03-strategy.md` | `ceo-strategist` | optional pptx | Only if `production_status: complete` |
| 10 | `10-strategy-review.md` | `ceo-strategist` | optional docx | Only if `production_status: complete` |

## Packs

| Seat | Bind |
|------|------|
| `ceo-strategist` | `production-artifacts`, `docx`, `pptx` |
| `fundraising-lead` | `production-artifacts` (already has pptx/xlsx) |
| `cfo` | `production-artifacts` (reject 4B handoffs missing status) |
| `verifier` | Office existence checklist in protocol |

## Handoff

Same fields as other Layer B: `production_status`, `production_paths`, `skip_reason`, `design_brief_path` (required when branded pptx complete), `wire_owner` usually `operator` (download/share).

## Orchestrator

Shippable list includes **4B, 21**. For **3, 10**: spawn verifier only when manager brief / IC handoff has `production_status: complete` with office paths.

## Acceptance

1. Pack documents office classes + paths + matrix  
2. CEO / fundraising / CFO / verifier / ORG-REGISTRY / orchestrator updated  
3. Shell tests assert pack + seat bindings + office verifier language  
4. CEO CHANGELOG entry for office Layer B  

## Out of scope

Sample doc generators, PDF polish, Google Docs, HoR evidence binders, deep slide QA.
