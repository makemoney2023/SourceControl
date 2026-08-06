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
| OpenMontage finals | **pending** — needs pipeline run + budget |
| production_status | `in_progress` (scaffold) |

When finals land, set `production_status: complete` in the video-producer handoff and copy loops into `apps/superpatch-income-stack/public/loops/`.
