# Phase 1 Fit-Test Print Guide

**Product:** Grid-down passive MOF water harvester (collapsible TEBS-1)  
**Goal:** Validate enclosure fit, segment slide, cap seat, and cartridge stack — **not** full water yield yet  
**STL pack:** `09b-hardware/cad/meshes/`  
**Last updated:** 2026-07-15

## Before you slice

1. Import STL from `cad/meshes/` — **not** assembly STEP files
2. Units are **millimeters**
3. This is a **fit-test** batch; several interfaces are schematic (threads, bayonet lugs, cap rotation)
4. Measure printed O-ring grooves and source seals after first shell print

---

## Print this batch (PETG fit-test — 9 unique STL files)

| STL file | Qty | Material | Orientation | Notes |
|----------|-----|----------|-------------|-------|
| `telescoping_external_bellows_shell.stl` | 1 | PETG | **Vertical** (cylinder axis Z) | Brim recommended; 3 mm walls |
| `telescoping_shell_t2.stl` | 1 | PETG | Vertical | Test slide fit inside T1 |
| `telescoping_shell_t3.stl` | 1 | PETG | Vertical | Test slide fit inside T2 |
| `baffle_cap.stl` | 1 | PETG | **Flat on louvers** (cap top down) | Supports likely needed in louver slots |
| `mof_puck_housing.stl` | **3** | PETG | Flat on base (bosses up) | Cartridge frames |
| `expansion_spring_guidance.stl` | 1 | PETG | Flat on base plate | **Print base for fit only** — buy real spring + rods |
| `condenser_fin_array.stl` | 1 | PETG | Flat on fin tips (hub up) | Fit-test only — prefer metal AM below |
| `condenser_shade_disc.stl` | 1 | PETG or AlSi10Mg | Flat on face | Optional shade above fins |
| `central_collection_tube.stl` | 1 | PETG | **Vertical** | Tall part — use brim; food-safe PETG if available |

---

## Metal AM — aluminum condenser (AlSi10Mg)

Print these in **AlSi10Mg** (DMLS / SLM / metal binder-jet + sinter — whatever your bureau runs):

| STL | Qty | Material | Orientation | Notes |
|-----|-----|----------|-------------|-------|
| `condenser_fin_array.stl` | 1 | **AlSi10Mg** | Fins vertical (Z = cylinder axis) or per bureau support strategy | Ø80 × 35 mm; **3 mm** fin walls (≥1 mm AlSi10Mg min); Ø14 bore + powder vents |
| `condenser_shade_disc.stl` | 1 | **AlSi10Mg** | Flat | Ø90 × 3 mm disc; print with fins or separately |

**Metal print checklist**
- Units: millimeters
- Alloy: AlSi10Mg (or equivalent thermal aluminum AM grade)
- Post: powder remove via vents/bore → bead blast → optional T6 heat treat if bureau offers
- Food-contact: if condensate touches fins, specify food-safe post-process / anodize or coat per your risk plan
- Do **not** use the PETG fin print for yield testing — plastic fins won’t sink heat

**Source CAD:** `cad/condenser_fin_array.py`, `cad/condenser_shade_disc.py`

---

## Do NOT print (source or skip for v1)

| File | Why | What to do instead |
|------|-----|-------------------|
| `passive_harvester_assembly.step` | Assembly reference only | Use CAD Viewer for layout |
| `mylar_inner_liner.step` | Film, not FDM | Cut Mylar sheet to liner dims (Ø87.6 × 132 mm, 70 mm bore) |
| `vacuum_thermal_barrier.step` | 0.5 mm walls — unprintable | Skip for v1; use single-wall PETG sleeve or omit |
| `mof_sorbent_disc.step` | Consumable reference | Pack SAPO-34 zeolite or silica gel into puck housings |
| `nickel_foam_disc.step` | Purchased sheet | Cut Ø70 mm × 0.5 mm discs from nickel foam |
| `main_body_shell.step` | Fixed-shell v1 alternate | Only if testing fixed path instead of TEBS-1 |

---

## Slicer settings (starting point)

| Setting | Value | Rationale |
|---------|-------|-----------|
| Material | **PETG** (high-temp if available) | Gemini spec; heat resistance for day cycle |
| Nozzle | 0.4 mm | Standard |
| Layer height | 0.2 mm | Balance speed/quality |
| Perimeters | 3–4 | Shell segments need strength |
| Infill | 20–30% gyroid | Structural parts |
| Bed temp | 75–85 °C | PETG adhesion |
| Nozzle temp | 240–250 °C | PETG |
| Brim | **On** for T1/T2/T3, tube | Tall cylinders warp |
| Supports | **On** for baffle_cap louvers, condenser fins | Overhangs |
| Tolerance compensation | **+0.1 to +0.2 mm** on inner bores | FDM tends to print holes small |

Tune for your printer — these are conservative defaults.

---

## Recommended print order

```
1. mof_puck_housing ×3     ← fastest; validates bore fit
2. telescoping_external_bellows_shell (T1)
3. telescoping_shell_t2 + t3   ← test slide + clearance
4. baffle_cap                ← test cap seat on T3 / liner lip
5. central_collection_tube   ← center bore check
6. condenser_fin_array       ← optional for top stack fit
7. expansion_spring_guidance ← base plate fit only
```

After T1+T2+T3+cap: dry-fit with Mylar film wrapped inside bore before loading sorbent.

---

## Off-the-shelf BOM (not printed)

| Item | Spec | Qty | Notes |
|------|------|-----|-------|
| Mylar film | Vacuum-rated, ~0.05 mm | 1 sheet | Cut/form to liner template |
| Compression spring | ~Ø18 × 90 mm, light rate | 1 | Replace schematic coil in ESGS-1 |
| Guide rods | SS Ø4 mm × 120 mm | 3 | Or PETG rods for fit-test only |
| O-rings | Food-grade silicone, high-temp | 3–6 | Size after measuring printed grooves |
| Zeolite / silica gel | SAPO-34 or desiccant beads | ~50–100 g | Phase 1 sorbent |
| Nickel foam | Open-cell, sheet | 1 small sheet | Cut Ø70 mm discs |
| Collection vessel | Food-safe bottle/canteen | 1 | Tube drips by gravity |

---

## Post-print checklist

- [ ] T2 slides inside T1 with light hand force (0.25 mm CAD clearance → may need light sand)
- [ ] T3 slides inside T2
- [ ] Cap sits flush on top segment / Mylar lip
- [ ] Puck housings (Ø69.5) fit inside 70 mm bore
- [ ] Collection tube clears center of puck stack
- [ ] O-ring grooves measured → O-rings sourced
- [ ] Mylar liner cut and inserted
- [ ] Zeolite + nickel foam loaded into 3 puck housings

---

## Known limitations (v1 fit-test)

| Feature | CAD status | Prototype workaround |
|---------|------------|---------------------|
| M80 thread | Schematic grooves | Hand-fit cap; add tape/gasket for seal test |
| Bayonet lock | Slots only, no lugs | Friction fit or drill pin holes |
| Cap rotation | Static louvers | Manually rotate cap for night/day test |
| Vacuum barrier | Not printed v1 | Omit or single-wall surrogate |
| Water yield | Not validated | Fit-test only — yield test is Phase 1 bench milestone |

---

## File locations

```
docs/projects/passive-grid/business-idea/09b-hardware/
├── PRINT-GUIDE.md          ← this file
├── 09b-hardware-build.md
└── cad/
    ├── meshes/             ← STL print pack
    │   ├── telescoping_external_bellows_shell.stl
    │   ├── telescoping_shell_t2.stl
    │   ├── telescoping_shell_t3.stl
    │   ├── baffle_cap.stl
    │   ├── mof_puck_housing.stl
    │   ├── expansion_spring_guidance.stl
    │   ├── condenser_fin_array.stl
    │   └── central_collection_tube.stl
    └── *.step              ← source CAD (reference / re-export)
```

## Regenerate STL

```bash
cd /Users/cbsuperpatch/Desktop/ClaudeSkills
PY=docs/projects/passive-grid/business-idea/09b-hardware/cad/.venv/bin/python
STEP=skills/community/text-to-cad/cad/scripts/step
CAD=docs/projects/passive-grid/business-idea/09b-hardware/cad
$PY $STEP $CAD/<part>.py --stl meshes/<part>.stl
```
