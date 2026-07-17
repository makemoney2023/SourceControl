"""Condenser shade disc — sits above fins so solar reflector rim keeps them cool."""

from build123d import Align, BuildPart, Cylinder, Mode, Part
from cadpy.assembly import label_shape

DISPLAY_NAME = "Condenser shade disc"

DISC_OD_MM = 90.0
DISC_ID_MM = 14.0  # clearance for collection tube / vapor path
THICKNESS_MM = 3.0


def make_condenser_shade_disc() -> Part:
    align = (Align.CENTER, Align.CENTER, Align.MIN)
    with BuildPart() as disc:
        Cylinder(radius=DISC_OD_MM / 2.0, height=THICKNESS_MM, align=align)
        Cylinder(radius=DISC_ID_MM / 2.0, height=THICKNESS_MM + 0.2, align=align, mode=Mode.SUBTRACT)

    return label_shape(
        disc.part,
        "condenser_shade_disc",
        f"od{int(DISC_OD_MM)}",
        f"t{THICKNESS_MM}",
    )


def gen_step():
    return make_condenser_shade_disc()
