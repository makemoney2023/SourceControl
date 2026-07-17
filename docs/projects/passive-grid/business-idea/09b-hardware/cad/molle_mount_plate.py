"""MOLLE mount plate — Gemini callout 7 interface to plate carrier."""

from build123d import Align, Box, BuildPart, Locations, Mode, Part
from cadpy.assembly import label_shape

DISPLAY_NAME = "MOLLE mount plate"

PLATE_W_MM = 80.0
PLATE_H_MM = 120.0
PLATE_T_MM = 4.0
SLOT_W_MM = 25.0
SLOT_H_MM = 8.0
SLOT_ROWS = 4
SLOT_COLS = 2


def make_molle_mount_plate() -> Part:
    align = (Align.CENTER, Align.CENTER, Align.MIN)
    with BuildPart() as plate:
        Box(PLATE_W_MM, PLATE_T_MM, PLATE_H_MM, align=align)
        for row in range(SLOT_ROWS):
            for col in range(SLOT_COLS):
                x = -18.0 + col * 36.0
                z = 18.0 + row * 24.0
                with Locations((x, 0, z)):
                    Box(SLOT_W_MM, PLATE_T_MM + 0.4, SLOT_H_MM, align=align, mode=Mode.SUBTRACT)

    return label_shape(
        plate.part,
        "molle_mount_plate",
        f"w{int(PLATE_W_MM)}",
        f"h{int(PLATE_H_MM)}",
        f"slots{SLOT_ROWS * SLOT_COLS}",
    )


def gen_step():
    return make_molle_mount_plate()
