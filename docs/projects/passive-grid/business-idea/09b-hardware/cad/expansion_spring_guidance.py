"""Expansion Spring and Guidance System (ESGS-1) — Plate 4 collapsible deploy mechanism.

Compression spring expands telescoping shell; three guide rods maintain segment alignment.
"""

import math

from build123d import Align, BuildPart, Cylinder, Locations, Mode, Part
from cadpy.assembly import label_shape

DISPLAY_NAME = "Expansion spring and guidance system"

BASE_OD_MM = 68.0
BASE_HEIGHT_MM = 4.0
GUIDE_ROD_OD_MM = 4.0
GUIDE_ROD_HEIGHT_MM = 120.0
GUIDE_BOLT_CIRCLE_MM = 22.0
SPRING_WIRE_OD_MM = 1.8
SPRING_COIL_RADIUS_MM = 9.0
SPRING_PITCH_MM = 7.0
SPRING_HEIGHT_MM = 90.0


def make_expansion_spring_guidance() -> Part:
    align = (Align.CENTER, Align.CENTER, Align.MIN)
    base_r = BASE_OD_MM / 2.0
    hole_r = GUIDE_ROD_OD_MM / 2.0 + 0.15

    with BuildPart() as esgs:
        Cylinder(radius=base_r, height=BASE_HEIGHT_MM, align=align)
        for angle_deg in (0.0, 120.0, 240.0):
            x = (GUIDE_BOLT_CIRCLE_MM / 2.0) * math.cos(math.radians(angle_deg))
            y = (GUIDE_BOLT_CIRCLE_MM / 2.0) * math.sin(math.radians(angle_deg))
            with Locations((x, y, 0)):
                Cylinder(radius=hole_r, height=BASE_HEIGHT_MM + 0.2, align=align, mode=Mode.SUBTRACT)
            with Locations((x, y, BASE_HEIGHT_MM)):
                Cylinder(radius=GUIDE_ROD_OD_MM / 2.0, height=GUIDE_ROD_HEIGHT_MM, align=align)

        coil_count = int(SPRING_HEIGHT_MM / SPRING_PITCH_MM)
        for index in range(coil_count):
            angle = index * 35.0
            z = BASE_HEIGHT_MM + index * SPRING_PITCH_MM
            x = SPRING_COIL_RADIUS_MM * math.cos(math.radians(angle))
            y = SPRING_COIL_RADIUS_MM * math.sin(math.radians(angle))
            with Locations((x, y, z)):
                Cylinder(radius=SPRING_WIRE_OD_MM / 2.0, height=SPRING_WIRE_OD_MM, align=align)

    return label_shape(
        esgs.part,
        "expansion_spring_guidance",
        "esgs1",
        f"spring_h{int(SPRING_HEIGHT_MM)}",
        f"guides_{int(GUIDE_ROD_HEIGHT_MM)}",
    )


def gen_step():
    return make_expansion_spring_guidance()
