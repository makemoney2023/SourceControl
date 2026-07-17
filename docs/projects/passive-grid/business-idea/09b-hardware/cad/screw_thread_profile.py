"""Schematic M80 x 2.0 thread profile helpers (DFM — not ISO-certified)."""

from build123d import Align, Cylinder, Locations, Mode

THREAD_NOMINAL_MM = 80.0
THREAD_PITCH_MM = 2.0
THREAD_ZONE_HEIGHT_MM = 24.0


def add_external_thread_grooves(
    *,
    thread_radius: float,
    z_start: float,
    height: float,
    align,
) -> None:
    """Male thread schematic grooves on outer cylindrical surface."""
    groove_count = int(round(height / THREAD_PITCH_MM))
    for index in range(groove_count):
        z = z_start + index * THREAD_PITCH_MM + 0.15
        with Locations((0, 0, z)):
            Cylinder(
                radius=thread_radius - 0.25,
                height=THREAD_PITCH_MM * 0.45,
                align=align,
                mode=Mode.SUBTRACT,
            )


def add_internal_thread_grooves(
    *,
    thread_radius: float,
    z_start: float,
    height: float,
    align,
) -> None:
    """Female thread schematic grooves on inner cylindrical bore."""
    groove_count = int(round(height / THREAD_PITCH_MM))
    for index in range(groove_count):
        z = z_start + index * THREAD_PITCH_MM + 0.15
        with Locations((0, 0, z)):
            Cylinder(
                radius=thread_radius + 0.25,
                height=THREAD_PITCH_MM * 0.45,
                align=align,
                mode=Mode.SUBTRACT,
            )
