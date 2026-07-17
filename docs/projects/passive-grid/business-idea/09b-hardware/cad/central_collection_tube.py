"""Central water collection tube — passive grid-down MOF water harvester."""

from build123d import Align, BuildPart, Cylinder, Mode, Part
from cadpy.assembly import label_shape

DISPLAY_NAME = "Central collection tube"

TUBE_OD_MM = 12.0
TUBE_LENGTH_MM = 150.0
WALL_THICKNESS_MM = 1.0


def make_central_collection_tube() -> Part:
    outer_r = TUBE_OD_MM / 2.0
    inner_r = outer_r - WALL_THICKNESS_MM
    with BuildPart() as tube:
        Cylinder(radius=outer_r, height=TUBE_LENGTH_MM, align=(Align.CENTER, Align.CENTER, Align.MIN))
        Cylinder(radius=inner_r, height=TUBE_LENGTH_MM + 0.2, align=(Align.CENTER, Align.CENTER, Align.MIN), mode=Mode.SUBTRACT)
    return label_shape(
        tube.part,
        "central_collection_tube",
        f"od{int(TUBE_OD_MM)}",
        f"len{int(TUBE_LENGTH_MM)}",
    )


def gen_step():
    return make_central_collection_tube()
