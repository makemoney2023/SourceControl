"""Main harvester body shell with M80 x 2.0 integration thread zone."""

from build123d import Align, BuildPart, Cylinder, Locations, Mode, Part
from cadpy.assembly import label_shape

DISPLAY_NAME = "Main body shell"

BODY_OD_MM = 94.0
BODY_ID_MM = 70.0
BODY_HEIGHT_MM = 180.0
THREAD_NOMINAL_MM = 80.0
THREAD_PITCH_MM = 2.0
THREAD_ZONE_HEIGHT_MM = 24.0


def make_main_body_shell() -> Part:
    outer_r = BODY_OD_MM / 2.0
    inner_r = BODY_ID_MM / 2.0
    thread_r = THREAD_NOMINAL_MM / 2.0
    lower_h = BODY_HEIGHT_MM - THREAD_ZONE_HEIGHT_MM
    align = (Align.CENTER, Align.CENTER, Align.MIN)

    with BuildPart() as body:
        with Locations((0, 0, 0)):
            Cylinder(radius=outer_r, height=lower_h, align=align)
        with Locations((0, 0, lower_h)):
            Cylinder(radius=thread_r, height=THREAD_ZONE_HEIGHT_MM, align=align)
        Cylinder(radius=inner_r, height=BODY_HEIGHT_MM + 0.2, align=align, mode=Mode.SUBTRACT)
        for index in range(int(round(THREAD_ZONE_HEIGHT_MM / THREAD_PITCH_MM))):
            z = lower_h + index * THREAD_PITCH_MM + 0.15
            with Locations((0, 0, z)):
                Cylinder(
                    radius=thread_r - 0.25,
                    height=THREAD_PITCH_MM * 0.45,
                    align=align,
                    mode=Mode.SUBTRACT,
                )

    return label_shape(
        body.part,
        "main_body_shell",
        "m80x2_integration",
        f"od{int(BODY_OD_MM)}",
        f"id{int(BODY_ID_MM)}",
        f"h{int(BODY_HEIGHT_MM)}",
    )


def gen_step():
    return make_main_body_shell()
