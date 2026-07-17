"""MOF puck housing — cartridge frame for collapsible sorbent stack (Gemini Plate 4).

Holds 4a MOF disc + 4b nickel foam with 0.25 mm shell clearance (69.5 mm OD vs 70 mm bore).
"""

import math

from build123d import Align, BuildPart, Cylinder, Locations, Mode, Part
from cadpy.assembly import label_shape

DISPLAY_NAME = "MOF puck housing"

PUCK_OD_MM = 69.5
PUCK_ID_MM = 66.0
BODY_HEIGHT_MM = 4.0
CAVITY_DEPTH_MM = 1.6
WALL_MM = (PUCK_OD_MM - PUCK_ID_MM) / 2.0
LIP_HEIGHT_MM = 0.8
BOSS_OD_MM = 4.0
BOSS_HEIGHT_MM = 1.2


def make_mof_puck_housing() -> Part:
    outer_r = PUCK_OD_MM / 2.0
    inner_r = PUCK_ID_MM / 2.0
    align = (Align.CENTER, Align.CENTER, Align.MIN)

    with BuildPart() as housing:
        Cylinder(radius=outer_r, height=BODY_HEIGHT_MM, align=align)
        Cylinder(radius=inner_r, height=CAVITY_DEPTH_MM + 0.1, align=align, mode=Mode.SUBTRACT)
        lip_z = BODY_HEIGHT_MM - LIP_HEIGHT_MM
        with Locations((0, 0, lip_z)):
            Cylinder(radius=outer_r - 0.6, height=LIP_HEIGHT_MM + 0.1, align=align, mode=Mode.SUBTRACT)

        for angle_deg in (0.0, 120.0, 240.0):
            x = (inner_r + 1.5) * math.cos(math.radians(angle_deg))
            y = (inner_r + 1.5) * math.sin(math.radians(angle_deg))
            with Locations((x, y, -BOSS_HEIGHT_MM)):
                Cylinder(radius=BOSS_OD_MM / 2.0, height=BOSS_HEIGHT_MM, align=align)

    return label_shape(
        housing.part,
        "mof_puck_housing",
        f"od{PUCK_OD_MM}",
        f"id{int(PUCK_ID_MM)}",
        "collapsible_stack",
    )


def gen_step():
    return make_mof_puck_housing()
