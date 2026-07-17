# Passive Grid-Down AWG — Product Specification

**Decision:** 2026-07-14 — User confirmed **grid-down passive** product line (no Pi, no cloud, no power)
**Source:** [Gemini chat](https://share.gemini.google/qS0VN4WEAgkJ) DFM schematics + exploded blueprint
**Status:** Active product path — supersedes powered bench prototype in intake
**Schematic fidelity:** See `09b-hardware/SCHEMATIC-FIDELITY.md`

## Product concept

**Expeditionary Passive MOF Water Harvester** — cylindrical, zero-power atmospheric water generator using:

| Cycle | Mechanism |
|-------|-----------|
| **Night (adsorption)** | Cap louvers open; parabolic reflector stowed; desiccant absorbs humidity |
| **Day (desorption)** | Cap sealed; **Mylar parabolic reflector deployed** focuses sun on core and shades condenser; vapor condenses on cool fins |
| **Collection** | Droplets run down central tube by gravity into collection vessel |

## Exploded assembly (Gemini callouts)

| Callout | Component | Material (prototype) | CAD file |
|---------|-----------|---------------------|----------|
| 1 | Rotating baffle cap (M80, O-ring, T-handle, louvers) | PETG / ABS | `baffle_cap.step` |
| 2 | Shaded condenser fin array + shade disc | Aluminum (PETG fit-test) | `condenser_fin_array.step` + `condenser_shade_disc.step` |
| 3 | Vacuum-insulated thermal barrier sleeve | SS double-wall (model as PETG) | `vacuum_thermal_barrier.step` |
| 4a | MOF/sorbent disc (1.00 ±0.05 mm) | Zeolite/SAPO-34 for Phase 1 | `mof_sorbent_disc.step` |
| 4b | Nickel foam thermal conductor (0.50 ±0.05 mm) | Open-cell nickel foam | `nickel_foam_disc.step` |
| 4c | MOF puck housing (collapsible cartridge) | PETG | `mof_puck_housing.step` |
| — | Central collection tube (drip loop) | Food-safe PETG / SS | `central_collection_tube.step` |
| 5 | Telescoping external bellows shell (TEBS-1) | GF-Nylon / PETG | `telescoping_bellows_assembly.step` |
| 3b | Mylar bellows vacuum liner (film sleeve) | Aluminized Mylar film | `mylar_bellows_liner.step` |
| **6** | **Deployable Mylar parabolic reflector** | Aluminized Mylar fabric | `mylar_parabolic_reflector.step` (day) / `_stowed.step` (night) |
| 3-dep | Expansion spring + guidance (ESGS-1) | SS rods + compression spring | `expansion_spring_guidance.step` |
| 7 | MOLLE / CamelBak bladder | Soft goods (CAD proxy) | `molle_mount_plate.step` + `hydration_bladder.step` |

## Day / night assemblies

| Mode | File | Cap | Reflector |
|------|------|-----|-----------|
| **Day** | `passive_harvester_assembly_day.step` | Sealed | **Deployed dish (Ø240 mm)** |
| **Night** | `passive_harvester_assembly_night.step` | Louvers open | Stowed flat pack |
| Default | `passive_harvester_assembly.step` | = day | = day |

## Confirmed DFM tolerances (from Gemini)

| Feature | Spec |
|---------|------|
| MOF disc thickness | 1.00 mm ±0.05 mm |
| Nickel foam thickness | 0.50 mm ±0.05 mm |
| MOF ↔ nickel contact | >85% surface contact; parallelism ±0.05 mm |
| Vacuum gap | 2.50 mm ±0.1 mm |
| Integration thread | M80 × 2.0-6H/6g |
| O-ring | Food-grade silicone, high-temp, at thread gland |

## Assumed overall dimensions (not measured from Gemini plates)

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Body OD | 94 mm | M80 thread + wall |
| Core ID | 70 mm | Sorbent disc diameter |
| Reflector rim OD | 240 mm | Visual umbrella dish |
| Reflector height | ~68 mm | Collar + dish |
| Cap OD | 100 mm | Proud of body + T-handle |

## Phase 1 material pivot

MOF-303 is **patent-locked** (UC Berkeley WO2019010102A1). Phase 1 prototype uses:
- **SAPO-34 zeolite** or **SAP-LiCl composite** (open, documented AWH materials)
- Same mechanical CAD stack; only sorbent cartridge chemistry changes

## Business model (passive)

- **Razor/blades:** hardware housing + replaceable desiccant cartridges
- **Target:** preparedness, off-grid, disaster relief — not residential primary water
- **Yield reality:** milliliters to few liters/day; scale requires large collection surface

## Operating modes

```
NIGHT MODE (Adsorption)          DAY MODE (Desorption)
┌─────────────────┐              ┌─────────────────┐
│ Cap: LOUVERS    │              │ Cap: SEALED     │
│ OPEN to air     │              │ Reflector OPEN  │
│ Reflector STOWED│              │ focuses sun     │
│ Desiccant absorbs│             │ Fins SHADED     │
└─────────────────┘              └─────────────────┘
```

## CAD generation status

See `09b-hardware/cad/README.md` and `09b-hardware/SCHEMATIC-FIDELITY.md`.
