# Phase 1 Fit-Test Print Guide

**Product:** Grid-down passive MOF water harvester (collapsible TEBS-1)  
**Goal:** Validate enclosure fit, segment slide, cap seat, and cartridge stack — not full water yield yet  
**Units:** millimeters  
**Date:** 2026-07-15

## Before you slice

1. Import STL files from the `stl` folder included with this kit
2. Units are millimeters
3. This is a fit-test batch; several interfaces are schematic (threads, bayonet lugs, cap rotation)
4. Measure printed O-ring grooves and source seals after first shell print

---

## Print this batch (8 STL files)

| STL file | Qty | Material | Orientation | Notes |
|----------|-----|----------|-------------|-------|
| telescoping_external_bellows_shell.stl | 1 | PETG | Vertical (cylinder axis Z) | Brim recommended; 3 mm walls |
| telescoping_shell_t2.stl | 1 | PETG | Vertical | Test slide fit inside T1 |
| telescoping_shell_t3.stl | 1 | PETG | Vertical | Test slide fit inside T2 |
| baffle_cap.stl | 1 | PETG | Flat on louvers (cap top down) | Supports likely needed in louver slots |
| mof_puck_housing.stl | 3 | PETG | Flat on base (bosses up) | Cartridge frames — print three copies |
| expansion_spring_guidance.stl | 1 | PETG | Flat on base plate | Print base for fit only — client supplies real spring + rods |
| condenser_fin_array.stl | 1 | PETG | Flat on fin tips (hub up) | Fit-test only; production may use aluminum |
| central_collection_tube.stl | 1 | PETG | Vertical | Tall part — use brim; food-safe PETG if available |

**Total printed parts:** 10 physical pieces from 8 unique STL files (mof_puck_housing printed ×3).

---

## Do NOT print (client will source separately)

| Item | Why | Client action |
|------|-----|---------------|
| Mylar inner liner | Thin film, not FDM | Cut Mylar sheet (approx. Ø87.6 × 132 mm, 70 mm bore) |
| Vacuum thermal barrier | 0.5 mm walls — unprintable on FDM | Omitted for v1 |
| Sorbent discs | Consumable | Pack zeolite/silica gel into puck housings |
| Nickel foam discs | Purchased sheet | Cut Ø70 mm × 0.5 mm discs |
| Compression spring | Metal spring required | Client supplies ~Ø18 × 90 mm spring |
| Guide rods | Metal rods preferred | Client supplies SS Ø4 mm × 120 mm × 3 |
| O-rings | Size depends on printed grooves | Client sources after groove measurement |

---

## Slicer settings (starting point)

| Setting | Value | Rationale |
|---------|-------|-----------|
| Material | PETG (high-temp if available) | Heat resistance for outdoor day cycle |
| Nozzle | 0.4 mm | Standard |
| Layer height | 0.2 mm | Balance speed/quality |
| Perimeters | 3–4 | Shell segments need strength |
| Infill | 20–30% gyroid | Structural parts |
| Bed temp | 75–85 °C | PETG adhesion |
| Nozzle temp | 240–250 °C | PETG |
| Brim | On for T1/T2/T3, collection tube | Tall cylinders warp |
| Supports | On for baffle_cap louvers, condenser fins | Overhangs |
| Tolerance compensation | +0.1 to +0.2 mm on inner bores | FDM tends to print holes small |

Tune for your printer — these are conservative defaults.

---

## Recommended print order

1. mof_puck_housing ×3 — fastest; validates bore fit  
2. telescoping_external_bellows_shell (T1)  
3. telescoping_shell_t2 + telescoping_shell_t3 — test slide + clearance  
4. baffle_cap — test cap seat on T3  
5. central_collection_tube — center bore check  
6. condenser_fin_array — optional for top stack fit  
7. expansion_spring_guidance — base plate fit only  

---

## Off-the-shelf BOM (client supplies — not part of this print job)

| Item | Spec | Qty | Notes |
|------|------|-----|-------|
| Mylar film | Vacuum-rated, ~0.05 mm | 1 sheet | Cut/form to liner template |
| Compression spring | ~Ø18 × 90 mm, light rate | 1 | Replaces schematic coil in ESGS-1 |
| Guide rods | SS Ø4 mm × 120 mm | 3 | Or PETG rods for fit-test only |
| O-rings | Food-grade silicone, high-temp | 3–6 | Size after measuring printed grooves |
| Zeolite / silica gel | SAPO-34 or desiccant beads | ~50–100 g | Phase 1 sorbent |
| Nickel foam | Open-cell, sheet | 1 small sheet | Cut Ø70 mm discs |
| Collection vessel | Food-safe bottle/canteen | 1 | Tube drips by gravity |

---

## Post-print checklist (client assembly)

- T2 slides inside T1 with light hand force (may need light sand)
- T3 slides inside T2
- Cap sits flush on top segment
- Puck housings (Ø69.5 mm) fit inside 70 mm bore
- Collection tube clears center of puck stack
- O-ring grooves measured → O-rings sourced
- Mylar liner cut and inserted
- Zeolite + nickel foam loaded into 3 puck housings

---

## Known limitations (v1 fit-test)

| Feature | CAD status | Prototype workaround |
|---------|------------|---------------------|
| M80 thread | Schematic grooves | Hand-fit cap; gasket for seal test |
| Bayonet lock | Slots only, no lugs | Friction fit or pin holes |
| Cap rotation | Static louvers | Manually rotate cap for night/day test |
| Vacuum barrier | Not printed v1 | Omitted |
| Water yield | Not validated | Fit-test only |

---

## Kit contents

- Phase-1-Print-Guide.docx (this document)
- stl/ folder — 8 STL mesh files for slicing
