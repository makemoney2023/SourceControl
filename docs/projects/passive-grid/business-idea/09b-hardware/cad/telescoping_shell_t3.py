"""TEBS-1 segment T3 (inner/top) with M80 male neck + bayonet lugs at bottom."""

from build123d import Align, BuildPart, Cylinder, Locations, Mode, Part
from bayonet_lock import add_bayonet_lug
from cadpy.assembly import label_shape
from screw_thread_profile import (
    THREAD_NOMINAL_MM,
    THREAD_ZONE_HEIGHT_MM,
    add_external_thread_grooves,
)

DISPLAY_NAME = "Telescoping shell T3 (inner/top)"

OD_MM = 81.0
HEIGHT_MM = 56.0
WALL_MM = 3.0
THREAD_R = THREAD_NOMINAL_MM / 2.0


def gen_step():
    outer_r = OD_MM / 2.0
    inner_r = outer_r - WALL_MM
    align = (Align.CENTER, Align.CENTER, Align.MIN)
    thread_z = HEIGHT_MM - THREAD_ZONE_HEIGHT_MM

    with BuildPart() as seg:
        with Locations((0, 0, 0)):
            Cylinder(radius=outer_r, height=HEIGHT_MM, align=align)
        Cylinder(radius=inner_r, height=HEIGHT_MM + 0.2, align=align, mode=Mode.SUBTRACT)

        add_bayonet_lug(outer_r=outer_r, align=align)

        with Locations((0, 0, thread_z)):
            Cylinder(radius=THREAD_R + 0.5, height=THREAD_ZONE_HEIGHT_MM + 0.1, align=align)
        add_external_thread_grooves(
            thread_radius=THREAD_R,
            z_start=thread_z,
            height=THREAD_ZONE_HEIGHT_MM,
            align=align,
        )

        groove_z = HEIGHT_MM - 3.2
        with Locations((0, 0, groove_z)):
            Cylinder(radius=inner_r + 0.7, height=2.5, align=align, mode=Mode.SUBTRACT)

    return label_shape(
        seg.part,
        "t3_inner_top",
        "tebs1",
        "m80_neck",
        "bayonet_lugs",
        f"od{int(OD_MM)}",
    )
