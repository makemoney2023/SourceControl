"""TEBS-1 segment T1 (outer/base) — bayonet slots only."""

from build123d import Align, BuildPart, Cylinder, Locations, Mode, Part
from bayonet_lock import add_bayonet_slot
from cadpy.assembly import label_shape

DISPLAY_NAME = "Telescoping shell T1 (outer/base)"

OD_MM = 94.0
HEIGHT_MM = 72.0
WALL_MM = 3.0


def gen_step():
    outer_r = OD_MM / 2.0
    inner_r = outer_r - WALL_MM
    align = (Align.CENTER, Align.CENTER, Align.MIN)

    with BuildPart() as seg:
        with Locations((0, 0, 0)):
            Cylinder(radius=outer_r, height=HEIGHT_MM, align=align)
        Cylinder(radius=inner_r, height=HEIGHT_MM + 0.2, align=align, mode=Mode.SUBTRACT)
        add_bayonet_slot(outer_r=outer_r, wall_mm=WALL_MM, height=HEIGHT_MM, align=align)
        groove_z = HEIGHT_MM - 3.2
        with Locations((0, 0, groove_z)):
            Cylinder(radius=inner_r + 0.7, height=2.5, align=align, mode=Mode.SUBTRACT)

    return label_shape(seg.part, "t1_outer_base", "tebs1", "bayonet_slots", f"od{int(OD_MM)}")
