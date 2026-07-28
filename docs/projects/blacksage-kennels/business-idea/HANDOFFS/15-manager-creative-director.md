---
phase: "15"
manager: creative-director
ics_spawned: [video-producer]
status: ready_for_csuite
recommendation: approve
llm_tier: creative-language
llm_model: grok-4.5
generation_profile: hero-video
generation_used: none
skip_reason: >-
  Operator directive 2026-07-27: skip video-producer / OpenMontage / synthetic AI video.
  Q6 real photography remains the media path; site ships without hero video.
fallback_applied: false
---

# Manager brief — Video & Rich Media — Phase 15

## In plain English

Phase 15 is a **documented skip**. The operator chose not to run video-producer or generate an AI/OpenMontage hero film. The site launches **without hero video**, using **real photography when Q6 delivers** — consistent with trust-first (D2) and the ban on AI dogs as program proof. Planning is limited to a thin shot-list stub so we do not invent kennel facts. Ready for C-suite to **approve the skip** and advance.

## What we found

- **Operator skip (2026-07-27):** No OpenMontage, Veo, or ElevenLabs generation — even if keys exist.
- **`generation_profile: hero-video`** applied as packet requirement; **`generation_used: none`** with explicit skip reason.
- **Primary media path remains Q6 photography** — thin stub only; no invented locations, litters, certs, or prices.
- **SD4 preserved:** no 3D / WebGL hero video invented for launch.
- **Channel:** stills on home/proof/about; social and paid video later (Phase 19 if needed).

## Next steps

1. **C-suite** — Approve skip / advance Phase 15 (orchestrator marks RUNBOOK).
2. **Operator** — Deliver real photography per Q6 and the thin shot-list stub when ready.
3. **No video-producer re-run** unless operator explicitly reopens Phase 15 generation later.

## Summary

- Hero-video profile skipped by operator directive
- Site ships without hero video; photography-first
- Thin Q6 stub only — no synthetic kennel claims
- Recommend **approve (skip)** for C-suite

## IC handoffs merged

| IC | Handoff path | Status | llm_tier | generation_used |
|----|--------------|--------|----------|-----------------|
| `video-producer` | `HANDOFFS/15-video-producer.md` | skipped (operator) | strong-general | none |

## Model routing check

- [x] IC packet had `llm_tier: strong-general` and `generation_profile: hero-video`
- [x] Skip reason documented (operator directive; not a silent omit)
- [x] Manager `creative-language`; no Plane B generation by manager
- [x] In-flight video-producer cancelled / ignored per operator

## Conflicts resolved

- none — operator directive supersedes in-flight IC production

## Artifacts for C-suite review

| Path | Scorecard check |
|------|-----------------|
| `15-media/README.md` | skip reason ✓ · generation_used: none ✓ · no hero video ✓ |
| `15-media/photography-shot-list-stub.md` | Q6 stub ✓ · no invented facts ✓ |
| `HANDOFFS/15-video-producer.md` | skipped status ✓ |
| `HANDOFFS/15-manager-creative-director.md` | this brief ✓ |

### Scorecard

| Check | Result |
|-------|--------|
| `generation_profile: hero-video` acknowledged | ✅ |
| `generation_used` or explicit skip | ✅ **skip** — operator directive; Q6 photography-first; no hero video |
| D2 trust-first (no FOMO / apply-first media) | ✅ |
| SD4 no 3D hero video requirement | ✅ |
| No invented kennel claims on camera | ✅ (no generation) |
| RUNBOOK Phase 15 marked ✅ by this seat | ❌ intentionally not — orchestrator |

## Escalation tags

- none

## Asks for C-suite

- Confirm **approve (skip)** so orchestrator can advance.
- Optional later: reopen video only if operator wants a clearly labeled non-proof mood film — not required for launch.

## Recommendation

**approve (skip)** — Phase 15 complete as documented skip. Advance. Do not require OpenMontage finals for launch. Phase not marked ✅ in RUNBOOK by this seat.
