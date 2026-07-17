"""Nickel foam conductive disc — passive grid-down MOF water harvester."""

from build123d import BuildPart, Cylinder, Part
from cadpy.assembly import label_shape

DISPLAY_NAME = "Nickel foam disc"

DISC_DIAMETER_MM = 70.0
FOAM_THICKNESS_MM = 0.5
THICKNESS_TOL_MM = 0.05


def make_nickel_foam_disc() -> Part:
    radius = DISC_DIAMETER_MM / 2.0
    with BuildPart() as disc:
        Cylinder(radius=radius, height=FOAM_THICKNESS_MM)
    return label_shape(
        disc.part,
        "nickel_foam_disc",
        f"d{int(DISC_DIAMETER_MM)}",
        f"t{FOAM_THICKNESS_MM}mm_pm{THICKNESS_TOL_MM}",
    )


def gen_step():
    return make_nickel_foam_disc()
