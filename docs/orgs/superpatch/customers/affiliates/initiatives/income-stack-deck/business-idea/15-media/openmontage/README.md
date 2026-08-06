# OpenMontage production — Income Stack

**Rule Zero:** all video generation goes through an OpenMontage pipeline. Do not call providers ad hoc.

## Intent

| Deliverable | Spec | Output path |
|-------------|------|-------------|
| Full share film | 16:9, ~75s, silent or light bed | `income-stack-deck-final.mp4` |
| Hero loops (optional) | 5–8s muted WebM/MP4 for slides 01, 04, 06, 14, 15 | `loops/0N-*.webm` |

## Pipeline

**Primary:** `skills/community/openmontage/pipeline_defs/animation.yaml`  
**Why:** motion-graphics / diagram-led / kinetic treatment of existing HQ plates.  
**Alt for I2V heroes:** `cinematic.yaml` + image→video stage after plate lock.

## Preflight (operator / video-producer)

```bash
cd skills/community/openmontage
# discover tools / doctor per AGENT_GUIDE Rule Zero
# confirm FAL_KEY / budget before paid I2V
```

## Inputs (locked)

- Concept plates: `../hyperframes/income-stack-deck/assets/` (or `../../assets/concepts/`)
- Copy SSOT: `apps/superpatch-income-stack/src/data/slides.ts`
- Brief: `../design/VIDEO-BRIEF.md`

## Status

| Item | State |
|------|--------|
| Design brief | complete |
| HyperFrames composition | complete (source for timing) |
| Full share film | **rendered** — `income-stack-deck-final.mp4`, 1920×1080 / 30fps / 75.0s, 0 spend |
| Hero loops (I2V) | **pending** — needs pipeline run + budget |
| production_status | `in_progress` |

The share film comes out of HyperFrames (local Chrome + FFmpeg, no provider spend), so Rule Zero
does not apply to it — nothing is generated. Only the optional I2V hero loops need a pipeline
run and `budget_usd`.

Renders are git-ignored: the composition is the source of truth and a fresh MP4 takes ~30s
(`hyperframes render`, see the HyperFrames README). Distribute the file itself out-of-band.

When finals land, set `production_status: complete` in the video-producer handoff and copy loops into `apps/superpatch-income-stack/public/loops/`.
