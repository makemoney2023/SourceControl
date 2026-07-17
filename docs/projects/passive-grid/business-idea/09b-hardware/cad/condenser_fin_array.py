"""Condenser radial fin array — aluminum (AlSi10Mg metal AM) + PETG fit-test.

24 fins @ 3 mm thickness (above AlSi10Mg ~1 mm min wall). Center bore clears
the Ø12 mm collection tube. Shade disc is a separate part.
"""

import math

from build123d import Align, Box, BuildPart, Cylinder, Location, Locations, Mode, Part
from cadpy.assembly import label_shape

DISPLAY_NAME = "Condenser fin array (AlSi10Mg / PETG)"

ARRAY_OD_MM = 80.0
FIN_HEIGHT_MM = 35.0
FIN_PITCH_MM = 3.0
FIN_COUNT = 24
FIN_THICKNESS_MM = FIN_PITCH_MM  # 3 mm — safe for AlSi10Mg DMLS/SLM (≥1 mm)
FIN_RADIAL_DEPTH_MM = 18.0
HUB_OD_MM = ARRAY_OD_MM - (2.0 * FIN_RADIAL_DEPTH_MM)
# Tube OD 12 mm + clearance for metal print / post-machining
BORE_ID_MM = 14.0
# Small hub vents help powder removal in PBF metal AM
POWDER_VENT_COUNT = 6
POWDER_VENT_D_MM = 2.5


def make_condenser_fin_array() -> Part:
    inner_r = HUB_OD_MM / 2.0
    align = (Align.CENTER, Align.CENTER, Align.MIN)
    angle_step = 360.0 / FIN_COUNT

    with BuildPart() as array:
        Cylinder(radius=inner_r, height=FIN_HEIGHT_MM, align=align)
        for index in range(FIN_COUNT):
            angle = index * angle_step
            mid_r = inner_r + FIN_RADIAL_DEPTH_MM / 2.0
            x = mid_r * math.cos(math.radians(angle))
            y = mid_r * math.sin(math.radians(angle))
            with Locations(Location((x, y, 0.0), (0, 0, angle))):
                Box(
                    FIN_RADIAL_DEPTH_MM,
                    FIN_THICKNESS_MM,
                    FIN_HEIGHT_MM,
                    align=align,
                    mode=Mode.ADD,
                )

        # Central vapor / drip-tube path
        Cylinder(radius=BORE_ID_MM / 2.0, height=FIN_HEIGHT_MM + 0.2, align=align, mode=Mode.SUBTRACT)

        # Radial powder-drain vents through hub wall (PBF AlSi10Mg)
        vent_r = (inner_r + BORE_ID_MM / 2.0) / 2.0
        for index in range(POWDER_VENT_COUNT):
            angle = index * (360.0 / POWDER_VENT_COUNT) + (angle_step / 2.0)
            x = vent_r * math.cos(math.radians(angle))
            y = vent_r * math.sin(math.radians(angle))
            with Locations((x, y, 0.0)):
                Cylinder(
                    radius=POWDER_VENT_D_MM / 2.0,
                    height=FIN_HEIGHT_MM + 0.2,
                    align=align,
                    mode=Mode.SUBTRACT,
                )

    return label_shape(
        array.part,
        "condenser_fin_array",
        "alsi10mg_ready",
        f"od{int(ARRAY_OD_MM)}",
        f"fins{FIN_COUNT}",
        f"t{int(FIN_THICKNESS_MM)}",
        f"bore{int(BORE_ID_MM)}",
        f"h{int(FIN_HEIGHT_MM)}",
    )


def gen_step():
    return make_condenser_fin_array()
