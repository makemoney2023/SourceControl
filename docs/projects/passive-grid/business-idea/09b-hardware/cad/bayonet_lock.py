"""Bayonet lug + slot helpers for TEBS-1 telescoping segments."""

import math

from build123d import Align, Box, Location, Locations, Mode

BAYONET_DEPTH_MM = 8.0
BAYONET_WIDTH_MM = 6.0
BAYONET_LUG_RADIAL_MM = 3.5
BAYONET_LUG_COUNT = 2  # 180° opposed for 90° lock


def add_bayonet_slot(*, outer_r: float, wall_mm: float, height: float, align) -> None:
    """Female bayonet pocket near top of outer segment."""
    slot_z = height - BAYONET_DEPTH_MM
    for index in range(BAYONET_LUG_COUNT):
        angle = index * (360.0 / BAYONET_LUG_COUNT)
        x = (outer_r - wall_mm * 0.5) * math.cos(math.radians(angle))
        y = (outer_r - wall_mm * 0.5) * math.sin(math.radians(angle))
        with Locations(Location((x, y, slot_z), (0, 0, angle))):
            Box(
                BAYONET_WIDTH_MM,
                wall_mm + 0.6,
                BAYONET_DEPTH_MM,
                align=align,
                mode=Mode.SUBTRACT,
            )


def add_bayonet_lug(*, outer_r: float, align) -> None:
    """Male bayonet lug near bottom of inner segment."""
    for index in range(BAYONET_LUG_COUNT):
        angle = index * (360.0 / BAYONET_LUG_COUNT)
        x = (outer_r + BAYONET_LUG_RADIAL_MM * 0.5) * math.cos(math.radians(angle))
        y = (outer_r + BAYONET_LUG_RADIAL_MM * 0.5) * math.sin(math.radians(angle))
        with Locations(Location((x, y, 1.0), (0, 0, angle))):
            Box(
                BAYONET_WIDTH_MM - 0.8,
                BAYONET_LUG_RADIAL_MM,
                BAYONET_DEPTH_MM - 1.0,
                align=align,
            )
