# 09B Hardware & CAD Build Log

**Phase:** 9B (CAD complete — collapsible TEBS-1 stack)
**Product:** Grid-down passive MOF water harvester
**Status:** CAD complete · physical build pending
**Last updated:** 2026-07-14

## Summary

Generated 18 STEP files + assemblies from Gemini DFM schematics using text-to-cad/build123d. Collapsible **TEBS-1** telescoping shell, **ESGS-1** spring/guidance, and **MOF puck housings** are now modeled. Product path confirmed as **grid-down passive** — no Pi, no cloud, no power.

## Product type

- [x] Passive solar desiccant harvester (primary)
- [x] MOF/sorbent core stack (zeolite Phase 1, MOF long-term)
- [x] Shaded condenser fin array
- [x] 3D-printable PETG enclosure
- [ ] Grid-down radiative dew trap (secondary — not CAD'd yet)

## Artifacts produced (`09b-hardware/cad/`)

| File | Type | Skill | Status |
|------|------|-------|--------|
| `mof_sorbent_disc.step` | STEP | cad | ✅ Ø70 × 1.0 mm |
| `nickel_foam_disc.step` | STEP | cad | ✅ Ø70 × 0.5 mm |
| `vacuum_thermal_barrier.step` | STEP | cad | ✅ 2.5 mm gap |
| `condenser_fin_array.step` | STEP | cad | ✅ 24 fins |
| `baffle_cap.step` | STEP | cad | ✅ M80 zone |
| `main_body_shell.step` | STEP | cad | ✅ Ø94 × 180 mm (fixed shell) |
| `telescoping_external_bellows_shell.step` | STEP | cad | ✅ TEBS-1 T1 outer/base Ø94 × 72 mm |
| `telescoping_shell_t2.step` | STEP | cad | ✅ TEBS-1 T2 middle Ø87.5 × 64 mm |
| `telescoping_shell_t3.step` | STEP | cad | ✅ TEBS-1 T3 inner/top Ø81 × 56 mm |
| `telescoping_bellows_assembly.step` | STEP | cad | ✅ TEBS-1 expanded stack |
| `telescoping_bellows_collapsed.step` | STEP | cad | ✅ TEBS-1 collapsed/nested |
| `mylar_inner_liner.step` | STEP | cad | ⚠️ deprecated → use bellows liner |
| `mylar_bellows_liner.step` | STEP | cad | ✅ TEBS vacuum film sleeve |
| `mylar_parabolic_reflector.step` | STEP | cad | ✅ deployable dish Ø240 mm (Gemini callout 6) |
| `mylar_parabolic_reflector_stowed.step` | STEP | cad | ✅ night flat pack |
| `condenser_shade_disc.step` | STEP | cad | ✅ shade over fins |
| `mof_puck_housing.step` | STEP | cad | ✅ Ø69.5 cartridge frame |
| `mof_puck_stack_assembly.step` | STEP | cad | ✅ 3× puck stack |
| `expansion_spring_guidance.step` | STEP | cad | ✅ ESGS-1 spring + 3 guide rods |
| `central_collection_tube.step` | STEP | cad | ✅ Ø12 × 150 mm |
| `passive_harvester_assembly.step` | STEP | cad | ✅ full assembly (collapsible TEBS-1) |
| `passive_harvester_fixed_assembly.step` | STEP | cad | ✅ v1 reference (fixed shell) |

## DFM tolerances applied (from Gemini)

- MOF disc: 1.00 mm ±0.05
- Nickel foam: 0.50 mm ±0.05
- Vacuum gap: 2.50 mm ±0.1
- Thread zone: M80 × 2.0 (schematic, not ISO-certified)

## Phase 1 material plan

- Sorbent: **SAPO-34 zeolite** or SAP-LiCl (MOF-303 patent-locked)
- Enclosure print: **PETG** high-temp
- Fins (prototype): PETG fit-test → aluminum for production

## STL print pack

**Shareable kit:** `09b-hardware/print-kit/` (STLs + `Phase-1-Print-Guide.docx` + `README.txt`)  
**Zip archive:** `09b-hardware/passive-harvester-print-kit.zip`  
**Dev STL source:** `09b-hardware/cad/meshes/`  
**Guide (markdown):** `09b-hardware/PRINT-GUIDE.md`

## Next physical build steps

1. Slice and print Phase 1 batch per `PRINT-GUIDE.md`
2. Source Mylar, O-rings, spring, zeolite, nickel foam (see BOM in guide)
3. Dry-fit T1/T2/T3 + cap + puck stack
4. Bench-test night adsorption / day desorption cycle
5. Measure yield (mL/day) at Ontario humidity levels

## Open items

- Bayonet lug geometry + cap rotation joint (functional v2)
- O-ring part numbers after groove measurement on printed shells
- Danny's role TBD
- MOF-303 licensing if moving beyond zeolite prototype

## Sources / skills used

- Gemini DFM schematics ([share link](https://share.gemini.google/qS0VN4WEAgkJ))
- `text-to-cad/cad` — build123d generators + inspect validation
- `00-passive-grid-down-spec.md`
