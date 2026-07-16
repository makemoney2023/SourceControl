# Design: smixs Visual Skills → Runbook Image/Video Generation

**Date:** 2026-07-16  
**Status:** Implemented  
**Source:** [smixs/visual-skills](https://github.com/smixs/visual-skills) (MIT)

## Goal

Vendor the `image` and `video` prompting skills and wire them so the business-idea runbook calls them whenever visuals need to be generated.

## Decisions

| Decision | Choice |
|----------|--------|
| Pack location | `skills/community/visual-skills/` |
| Layout | Upstream flat: `image/`, `video/` (+ `references/`) |
| Role | Prompting only; render via `inference-sh` |
| Naming | Paths `visual-skills/image/` (distinct from `marketingskills/image/`) |

## Runbook

Global rule + Phases 11, 14, 15, 19.
