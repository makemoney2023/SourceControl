"""Deployable aluminized Mylar parabolic reflector — Gemini callout 6.

Umbrella dish at the TOP of the harvester: collar under condenser/shade,
rim flares upward to shade fins and focus sun on the sealed core.
"""

from build123d import Align, BuildPart, Cone, Cylinder, Locations, Mode, Part
from cadpy.assembly import label_shape

DISPLAY_NAME = "Mylar parabolic reflector"

BODY_OD_MM = 94.0
COLLAR_ID_MM = 82.0  # seats on T3 OD (~81)
COLLAR_OD_MM = 100.0
COLLAR_HEIGHT_MM = 10.0

# Deployed dish — flares UP from collar (umbrella canopy at top)
DEPLOYED_INNER_R = COLLAR_OD_MM / 2.0
DEPLOYED_OUTER_R = 120.0  # 240 mm OD rim
DEPLOYED_HEIGHT_MM = 55.0
WALL_MM = 1.2

# Stowed — folded flat under cap / at top of body
STOWED_OD_MM = 110.0
STOWED_HEIGHT_MM = 6.0

DEPLOYED_TOTAL_HEIGHT_MM = COLLAR_HEIGHT_MM + DEPLOYED_HEIGHT_MM


def make_reflector_deployed() -> Part:
    """Collar at local bottom; dish flares upward to wide rim (umbrella).

    Assembly places collar near condenser (top of body), NOT at the base.
    """
    align = (Align.CENTER, Align.CENTER, Align.MIN)
    outer_bottom = DEPLOYED_INNER_R
    outer_top = DEPLOYED_OUTER_R
    inner_bottom = outer_bottom - WALL_MM
    inner_top = outer_top - WALL_MM

    with BuildPart() as dish:
        with Locations((0, 0, 0)):
            Cylinder(radius=COLLAR_OD_MM / 2.0, height=COLLAR_HEIGHT_MM, align=align)
        with Locations((0, 0, 0)):
            Cylinder(radius=COLLAR_ID_MM / 2.0, height=COLLAR_HEIGHT_MM + 0.2, align=align, mode=Mode.SUBTRACT)

        with Locations((0, 0, COLLAR_HEIGHT_MM - 1.0)):
            Cone(
                bottom_radius=outer_bottom,
                top_radius=outer_top,
                height=DEPLOYED_HEIGHT_MM,
                align=align,
            )
            Cone(
                bottom_radius=max(inner_bottom, 1.0),
                top_radius=max(inner_top, 1.0),
                height=DEPLOYED_HEIGHT_MM + 0.2,
                align=align,
                mode=Mode.SUBTRACT,
            )

        # Outer rim shade flange (top of dish)
        with Locations((0, 0, COLLAR_HEIGHT_MM + DEPLOYED_HEIGHT_MM - 2.5)):
            Cylinder(radius=outer_top, height=2.5, align=align)
            Cylinder(radius=outer_top - 14.0, height=2.7, align=align, mode=Mode.SUBTRACT)

    return label_shape(
        dish.part,
        "mylar_parabolic_reflector",
        "deployed_top",
        f"rim_od{int(DEPLOYED_OUTER_R * 2)}",
        f"h{int(DEPLOYED_TOTAL_HEIGHT_MM)}",
    )


def make_reflector_stowed() -> Part:
    """Night / transport: reflector folded flat at top of body under cap."""
    align = (Align.CENTER, Align.CENTER, Align.MIN)
    with BuildPart() as pack:
        Cylinder(radius=STOWED_OD_MM / 2.0, height=STOWED_HEIGHT_MM, align=align)
        Cylinder(radius=COLLAR_ID_MM / 2.0, height=STOWED_HEIGHT_MM + 0.2, align=align, mode=Mode.SUBTRACT)

    return label_shape(
        pack.part,
        "mylar_parabolic_reflector",
        "stowed_top",
        f"od{int(STOWED_OD_MM)}",
        f"h{int(STOWED_HEIGHT_MM)}",
    )


def gen_step():
    return make_reflector_deployed()
