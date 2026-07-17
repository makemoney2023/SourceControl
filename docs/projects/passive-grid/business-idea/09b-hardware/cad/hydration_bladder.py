"""MOLLE-compatible hydration bladder pouch — Gemini callout 7 soft goods proxy."""

from build123d import Align, Box, BuildPart, Cylinder, Locations, Mode, Part
from cadpy.assembly import label_shape

DISPLAY_NAME = "Hydration bladder (CamelBak proxy)"

BLADDER_W_MM = 70.0
BLADDER_D_MM = 40.0
BLADDER_H_MM = 160.0
NECK_OD_MM = 18.0
NECK_H_MM = 25.0


def make_hydration_bladder() -> Part:
    align = (Align.CENTER, Align.CENTER, Align.MIN)
    with BuildPart() as bladder:
        # Soft pouch approximated as rounded box
        Box(BLADDER_W_MM, BLADDER_D_MM, BLADDER_H_MM, align=align)
        # Fill / hose neck on top
        with Locations((0, 0, BLADDER_H_MM - 2.0)):
            Cylinder(radius=NECK_OD_MM / 2.0, height=NECK_H_MM, align=align)
        Cylinder(radius=NECK_OD_MM / 2.0 - 2.0, height=NECK_H_MM + 4.0, align=align, mode=Mode.SUBTRACT)
        # Hose barb exit toward harvester tube
        with Locations((0, BLADDER_D_MM / 2.0 - 2.0, 20.0)):
            Cylinder(radius=5.0, height=20.0, align=(Align.CENTER, Align.MIN, Align.CENTER))

    return label_shape(
        bladder.part,
        "hydration_bladder",
        "molle_camelbak_proxy",
        f"w{int(BLADDER_W_MM)}",
        f"h{int(BLADDER_H_MM)}",
    )


def gen_step():
    return make_hydration_bladder()
