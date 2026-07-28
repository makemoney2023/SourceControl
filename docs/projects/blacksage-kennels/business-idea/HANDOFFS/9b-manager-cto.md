---
phase: "9-b"
manager: cto
ics_spawned: [tech-lead]
status: ready_for_csuite
recommendation: approve
llm_tier: coding-agent
llm_model: composer-2.5
generation_profile: none
generation_used: none
fallback_applied: false
---

# Manager brief — Phase 9-b Option B Build Delta — CTO

## In plain English

Phase 9-b implements Option B in the live app: the site now uses the dark black/tan brand system across all pages, and the homepage has a contained hero region with a static poster that can optionally upgrade to a lazy 3D Rottweiler when a licensed model file is added. Trust-first IA is unchanged — proof band sits below the hero, routes and inquire flow are intact, and there is no scroll-jacking or full-page 3D narrative. The site ships **poster-first** today because no licensed GLB is in the repo. All 50 tests pass and production build succeeds. Ready for C-suite review; RUNBOOK not marked ✅.

## What we found

- **Theme:** `globals.css` remapped to Option B tokens (`#0E0E0E` ground, `#C4A35A` tan, `#F5F2EB` text, dark-on-tan CTA). Libre Baskerville replaces Cormorant. All public pages updated.
- **HeroIsland:** Contained ~50vh slot; SSR poster LCP; lazy R3F only when WebGL + GLB + no reduced-motion + `NEXT_PUBLIC_REDUCE_3D` unset. Idle orbit ≤0.15 rad — no scroll coupling. No ScrollControls or scroll-jacking in codebase.
- **D2 preserved:** Proof band below hero in DOM; nav Home → Dogs → Health/Education → About → Inquire; hero CTAs are text links to `/dogs` and `/health` only; tertiary inquire band unchanged; analytics + SEO intact.
- **Perf:** Home First Load JS 139 kB; other routes ~131 kB — Three.js not in shared critical path.
- **GLB:** Poster SVG at `public/images/hero-rottweiler-fallback.svg`; canvas gated until `public/models/hero-rottweiler.glb` licensed drop-in.

## Next steps

1. **C-suite** — scorecard review against Phase 12-b locks (contained hero, D2, fallback, tokens, perf). Approve or request revise.
2. **Operator** — purchase licensed GLB per CEO brief §6; drop at `public/models/hero-rottweiler.glb`; optionally replace poster with licensed `.webp`.
3. **copy-chief (13/14)** — contrast pass on dark surfaces only; no CTA/IA rewrite.

## Summary

- Option B dark theme + HeroIsland shipped in `apps/blacksage-kennels`
- Poster-first; WebGL upgrade gated on licensed GLB
- 50/50 tests pass; build green
- No scroll-jacking; Three.js lazy on home hero only
- RUNBOOK **not** marked ✅ — awaiting C-suite gate

## IC handoffs merged

| IC | Handoff path | Status | llm_tier | generation_used |
|----|--------------|--------|----------|-----------------|
| `tech-lead` | `HANDOFFS/9b-tech-lead.md` | done | coding-agent | none |

## Model routing check

- [x] IC packet had `llm_tier: coding-agent`
- [x] No generation profile required (engineering delta)
- [x] Fallback not applied

## Conflicts resolved

- none — IC deliverable aligned with Phase 11-b tokens and Phase 12-b hero spec

## Artifacts for C-suite review

| Path | Scorecard check |
|------|-----------------|
| `apps/blacksage-kennels/` (Option B delta) | Contained hero, dark theme, D2 IA, lazy R3F |
| `docs/projects/blacksage-kennels/business-idea/09-build-log.md` | Option B delta + GLB drop-in instructions |
| `HANDOFFS/9b-tech-lead.md` | IC verification (50 tests, build) |

## C-suite scorecard (CTO pre-check)

| Criterion | Pass? | Notes |
|-----------|-------|-------|
| Contained hero WebGL only — no scroll-jacking / full-page R3F | yes | ~50vh island; idle orbit; no ScrollControls |
| D2 proof band below hero; IA/CTA unchanged | yes | DOM order; text CTAs in hero; inquire tertiary |
| Static + prefers-reduced-motion fallback | yes | Poster SSR LCP; gates in `shouldEnableWebGL()` |
| Black/tan from Phase 11-b | yes | `#0E0E0E` + `#C4A35A`; dark-on-tan CTA |
| Perf budget (lazy R3F, not site-wide) | yes | Other routes ~131 kB; Three lazy on home |
| Poster-first until licensed GLB | yes | GLB not in repo; HEAD probe gates canvas |
| Tests pass | yes | 50/50 vitest; build exit 0 |
| Analytics / SEO preserved | yes | ProofBandTracker, TrackedLink, metadata unchanged |

## Escalation tags

- none (GLB purchase is operator action, not a build blocker)

## Asks for C-suite

- **Approve** Option B build delta for staging/preview, or **revise** with specific gaps.
- Confirm poster-first staging is acceptable until licensed GLB clears diligence.

## Recommendation

**approve** — Phase 9-b Option B build delta meets Phase 12-b C-suite locks: dark tokens, contained hero island with progressive enhancement, D2 trust pathway intact, no Mode E regression. Safe to preview poster-first; enable WebGL after licensed GLB drop-in.
