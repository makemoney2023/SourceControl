"""MOF-303 sorbent disc — passive grid-down MOF water harvester (Gemini DFM)."""

from build123d import BuildPart, Cylinder, Part
from cadpy.assembly import label_shape

DISPLAY_NAME = "MOF-303 sorbent disc"

DISC_DIAMETER_MM = 70.0
DISC_THICKNESS_MM = 1.0
THICKNESS_TOL_MM = 0.05


def make_mof_sorbent_disc() -> Part:
    radius = DISC_DIAMETER_MM / 2.0
    with BuildPart() as disc:
        Cylinder(radius=radius, height=DISC_THICKNESS_MM)
    return label_shape(
        disc.part,
        "mof_303_sorbent_disc",
        f"d{int(DISC_DIAMETER_MM)}",
        f"t{DISC_THICKNESS_MM}mm_pm{THICKNESS_TOL_MM}",
    )


def gen_step():
    return make_mof_sorbent_disc()
