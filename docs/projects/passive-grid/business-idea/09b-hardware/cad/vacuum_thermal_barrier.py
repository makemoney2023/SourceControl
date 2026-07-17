"""Double-wall vacuum thermal barrier sleeve — Gemini DFM 2.50 mm gap."""

import math

from build123d import Align, Axis, BuildPart, Cylinder, Mode, Part
from cadpy.assembly import label_shape

DISPLAY_NAME = "Vacuum thermal barrier sleeve"

INNER_BORE_DIAMETER_MM = 70.0
INNER_WALL_THICKNESS_MM = 0.5
VACUUM_GAP_MM = 2.5
VACUUM_GAP_TOL_MM = 0.1
OUTER_WALL_THICKNESS_MM = 0.5
SLEEVE_HEIGHT_MM = 140.0


def make_vacuum_thermal_barrier() -> Part:
    """Concentric double-wall sleeve with evacuated annulus."""
    inner_bore_r = INNER_BORE_DIAMETER_MM / 2.0
    inner_wall_od_r = inner_bore_r + INNER_WALL_THICKNESS_MM
    vacuum_id_r = inner_wall_od_r + VACUUM_GAP_MM
    outer_wall_od_r = vacuum_id_r + OUTER_WALL_THICKNESS_MM
    align = (Align.CENTER, Align.CENTER, Align.MIN)

    with BuildPart() as sleeve:
        Cylinder(radius=outer_wall_od_r, height=SLEEVE_HEIGHT_MM, align=align)
        Cylinder(radius=vacuum_id_r, height=SLEEVE_HEIGHT_MM + 0.2, align=align, mode=Mode.SUBTRACT)
        Cylinder(radius=inner_bore_r, height=SLEEVE_HEIGHT_MM + 0.2, align=align, mode=Mode.SUBTRACT)
    return label_shape(
        sleeve.part,
        "vacuum_thermal_barrier",
        "double_wall_sleeve",
        f"gap{VACUUM_GAP_MM}mm_pm{VACUUM_GAP_TOL_MM}",
    )


def gen_step():
    return make_vacuum_thermal_barrier()
