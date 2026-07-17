"""Vacuum-rated aluminized Mylar bellows liner — TEBS-1 thermal barrier film.

Gemini collapsible path: thin film lining telescoping shell for vacuum integrity.
This is NOT the deployable parabolic reflector and NOT a water funnel.
"""

from build123d import Align, BuildPart, Cylinder, Mode, Part
from cadpy.assembly import label_shape

DISPLAY_NAME = "Mylar bellows vacuum liner"

LINER_OD_MM = 87.6
LINER_ID_MM = 84.0  # thin film sleeve (~1.8 mm wall for CAD visibility)
HEIGHT_MM = 132.0


def make_mylar_bellows_liner() -> Part:
    outer_r = LINER_OD_MM / 2.0
    inner_r = LINER_ID_MM / 2.0
    align = (Align.CENTER, Align.CENTER, Align.MIN)

    with BuildPart() as liner:
        Cylinder(radius=outer_r, height=HEIGHT_MM, align=align)
        Cylinder(radius=inner_r, height=HEIGHT_MM + 0.2, align=align, mode=Mode.SUBTRACT)

    return label_shape(
        liner.part,
        "mylar_bellows_liner",
        "tebs1_vacuum_film",
        f"od{LINER_OD_MM}",
        f"id{LINER_ID_MM}",
        f"h{int(HEIGHT_MM)}",
    )


def gen_step():
    return make_mylar_bellows_liner()
