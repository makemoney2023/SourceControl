"""M80 screw-on baffle cap — day/night toggle with visible rotation handle.

Gemini Cap 1: screw-on, O-ring sealed, louvers for night adsorption.
"""

import math

from build123d import Align, Box, BuildPart, Cylinder, Location, Locations, Mode, Part
from cadpy.assembly import label_shape
from screw_thread_profile import (
    THREAD_NOMINAL_MM,
    THREAD_ZONE_HEIGHT_MM,
    add_internal_thread_grooves,
)

DISPLAY_NAME = "Screw-on baffle cap (M80)"

CAP_OD_MM = 100.0  # slightly proud of body for visual/tactile grip
THREAD_ZONE = THREAD_ZONE_HEIGHT_MM
LOUVER_ZONE_HEIGHT_MM = 16.0
HANDLE_HEIGHT_MM = 12.0
CAP_HEIGHT_MM = THREAD_ZONE + LOUVER_ZONE_HEIGHT_MM + HANDLE_HEIGHT_MM
THREAD_R = THREAD_NOMINAL_MM / 2.0
ORING_GROOVE_DEPTH_MM = 1.2
ORING_GROOVE_WIDTH_MM = 2.5
LOUVER_COUNT = 4
LOUVER_WIDTH_MM = 22.0
LOUVER_HEIGHT_MM = 12.0
LOUVER_DEPTH_MM = 10.0


def make_baffle_cap() -> Part:
    outer_r = CAP_OD_MM / 2.0
    thread_bore_r = THREAD_R + 0.6
    align = (Align.CENTER, Align.CENTER, Align.MIN)

    with BuildPart() as cap:
        Cylinder(radius=outer_r, height=CAP_HEIGHT_MM, align=align)

        # Female M80 bore
        Cylinder(radius=thread_bore_r, height=THREAD_ZONE + 0.2, align=align, mode=Mode.SUBTRACT)
        add_internal_thread_grooves(
            thread_radius=THREAD_R,
            z_start=0.0,
            height=THREAD_ZONE,
            align=align,
        )

        # O-ring gland
        groove_z = THREAD_ZONE - ORING_GROOVE_WIDTH_MM - 1.0
        with Locations((0, 0, groove_z)):
            Cylinder(
                radius=thread_bore_r - ORING_GROOVE_DEPTH_MM,
                height=ORING_GROOVE_WIDTH_MM + 0.1,
                align=align,
                mode=Mode.SUBTRACT,
            )

        # Night louvers in mid band
        louver_z = THREAD_ZONE + LOUVER_ZONE_HEIGHT_MM
        for index in range(LOUVER_COUNT):
            angle = index * (360.0 / LOUVER_COUNT)
            x = (outer_r - LOUVER_DEPTH_MM / 2.0) * math.cos(math.radians(angle))
            y = (outer_r - LOUVER_DEPTH_MM / 2.0) * math.sin(math.radians(angle))
            with Locations(Location((x, y, louver_z), (0, 0, angle))):
                Box(
                    LOUVER_WIDTH_MM,
                    LOUVER_DEPTH_MM + 2.0,
                    LOUVER_HEIGHT_MM,
                    align=(Align.CENTER, Align.CENTER, Align.MAX),
                    mode=Mode.SUBTRACT,
                )

        # Day/night rotation T-handle on top
        handle_z = THREAD_ZONE + LOUVER_ZONE_HEIGHT_MM
        with Locations((0, 0, handle_z)):
            Box(60.0, 10.0, HANDLE_HEIGHT_MM, align=align)
            Box(10.0, 40.0, HANDLE_HEIGHT_MM, align=align)

        # Orientation mark notch
        with Locations(Location((outer_r - 2.0, 0, CAP_HEIGHT_MM), (0, 0, 0))):
            Box(6.0, 4.0, 4.0, align=(Align.CENTER, Align.CENTER, Align.MAX), mode=Mode.SUBTRACT)

    return label_shape(
        cap.part,
        "baffle_cap",
        "m80x2_screw_on",
        "t_handle",
        f"od{int(CAP_OD_MM)}",
        f"louvers{LOUVER_COUNT}",
        f"h{int(CAP_HEIGHT_MM)}",
    )


def gen_step():
    return make_baffle_cap()
