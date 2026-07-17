# 09B Hardware CAD — Passive Grid-Down Harvester

**Generated:** 2026-07-14  
**Tool:** [text-to-cad/cad](skills/community/text-to-cad/cad/) + build123d  
**Source schematics:** Gemini DFM drawings ([chat](https://share.gemini.google/qS0VN4WEAgkJ))

## STEP files

### Core stack

| File | Component | Key dimensions |
|------|-----------|----------------|
| `mof_sorbent_disc.step` | MOF/sorbent disc (4a) | Ø70 × 1.0 mm |
| `nickel_foam_disc.step` | Nickel foam conductor (4b) | Ø70 × 0.5 mm |
| `mof_puck_housing.step` | Puck cartridge frame (Plate 4) | Ø69.5 × 4.8 mm |
| `mof_puck_stack_assembly.step` | 3× puck housing stack | 15.6 mm tall |
| `vacuum_thermal_barrier.step` | Double-wall sleeve (3) | 2.5 mm vacuum gap |
| `mylar_bellows_liner.step` | TEBS vacuum film liner (3b) | Ø87.6 thin sleeve × 132 mm |
| `mylar_parabolic_reflector.step` | **Deployable solar dish (callout 6)** | Rim Ø240 mm, day deployed |
| `mylar_parabolic_reflector_stowed.step` | Reflector flat pack | Ø110 × 6 mm, night |
| `condenser_shade_disc.step` | Shade over condenser fins | Ø90 × 3 mm |
| `condenser_fin_array.step` | Shaded condenser fins (2) | Ø80 × 35 mm, 24 fins |
| `baffle_cap.step` | Rotating baffle cap (1) | Ø94 × 25 mm, M80 zone |
| `central_collection_tube.step` | Drip/collection tube | Ø12 × 150 mm |

### Enclosure — fixed shell (v1 reference)

| File | Component | Key dimensions |
|------|-----------|----------------|
| `main_body_shell.step` | Fixed body shell | Ø94 × 180 mm |
| `passive_harvester_fixed_assembly.step` | Full assembly with fixed shell | ~94 × 180.5 mm |

### Enclosure — collapsible TEBS-1 (primary product path)

| File | Component | Key dimensions |
|------|-----------|----------------|
| `telescoping_external_bellows_shell.step` | TEBS-1 segment T1 (outer/base) | Ø94 × 72 mm |
| `telescoping_shell_t2.step` | TEBS-1 segment T2 (middle) | Ø87.5 × 64 mm |
| `telescoping_shell_t3.step` | TEBS-1 segment T3 (inner/top) | Ø81 × 56 mm |
| `telescoping_bellows_assembly.step` | TEBS-1 expanded stack | ~94 × 156 mm |
| `telescoping_bellows_collapsed.step` | TEBS-1 collapsed/nested | Ø94 × 72 mm |
| `expansion_spring_guidance.step` | ESGS-1 spring + guide rods (Plate 4) | Ø68 base, 120 mm rods |
| `passive_harvester_assembly.step` | Full assembly (collapsible) | ~94 × 181 mm expanded |

## Python generators

Each `.py` file pairs with its `.step` output. Regenerate:

```bash
cd /Users/cbsuperpatch/Desktop/ClaudeSkills
PY=docs/projects/passive-grid/business-idea/09b-hardware/cad/.venv/bin/python
STEP=skills/community/text-to-cad/cad/scripts/step
$PY $STEP docs/projects/passive-grid/business-idea/09b-hardware/cad/<part>.py
```

## STL print pack (`meshes/`)

Phase 1 fit-test STLs exported 2026-07-15.

**Share with fabricator:** `../print-kit/` — contains only STLs + `Phase-1-Print-Guide.docx` (no Python/CAD source). Zip: `../passive-harvester-print-kit.zip`

See `../PRINT-GUIDE.md` for full slicer settings and print order.

## Preview

Open any `.step` file with `cad-viewer` skill, or import into Fusion 360 / FreeCAD.

## Notes

- M80×2.0 thread zone is schematic (80 mm OD band), not certified ISO thread geometry
- Phase 1 sorbent: use SAPO-34 zeolite or SAP-LiCl — not MOF-303 (patent-locked)
- Puck housing OD 69.5 mm provides 0.25 mm clearance to 70 mm bore reference
- ESGS-1 spring is schematic coil geometry — source physical spring separately for prototype
- Assumed body dimensions where Gemini text lacked callouts — see `00-passive-grid-down-spec.md`
