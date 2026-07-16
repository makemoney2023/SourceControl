# Schematic Fidelity Checklist — Passive Harvester

**Source:** [Gemini chat](https://gemini.google.com/share/eed8cc7a7de2)  
**Updated:** 2026-07-15  
**Purpose:** Build CAD against Gemini design intent, not assumed geometry.

## Gemini exploded stack (rigid path — callouts 1–7)

| # | Component | Status |
|---|-----------|--------|
| 1 | Rotating baffle cap (M80, O-ring, louvers, rotation handle) | ✅ T-handle screw-on |
| 2 | Shaded aluminum condenser fin array | ✅ fins + shade disc |
| 3 | Vacuum-insulated thermal barrier sleeve | ✅ exists (weak visual) |
| 4a/4b | MOF + nickel foam stack | ✅ exists |
| — | Central silicone drip tube | ✅ exists |
| 5 | External tactical shell | ✅ TEBS / fixed shell |
| **6** | **Deployable Mylar parabolic reflector** | ✅ day deployed / night stowed (**collar at top near condenser**, z≈92) |
| 7 | MOLLE / CamelBak bladder interface | ✅ `molle_mount_plate` + `hydration_bladder` |

## Collapsible path (later Gemini plates)

| Component | Status |
|-----------|--------|
| TEBS-1 telescoping segments + bayonet | ✅ slots on T1/T2 + lugs on T2/T3 |
| ESGS-1 spring + guides | ✅ schematic |
| MOF puck housings | ✅ exists |
| **Bellows vacuum Mylar liner** (film sleeve, not water funnel) | ✅ cylindrical sleeve |
| Compliant nickel mesh bridges | ⬜ deferred |

## Day / night silhouette (must be visually distinct)

| Mode | Cap | Reflector | Condenser |
|------|-----|-----------|-----------|
| **Day** | Screwed sealed | **Deployed dish** focuses sun + shades fins | Under shade rim |
| **Night** | Louvers open | **Stowed** flat against body | Exposed to night air |

## Assumed dimensions (document as assumptions until plates are measured)

| Parameter | Value | Source |
|-----------|-------|--------|
| Body OD | 94 mm | Assumed from M80 + wall |
| Reflector outer rim OD | 240 mm | Assumed — visual match to umbrella dish |
| Reflector height | 60 mm | Assumed |
| Condenser under shade | z ≈ 100–135 mm | Assumed stack |
