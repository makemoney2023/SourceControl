"""Shared assembly instances for day/night silhouette variants.

Gemini day: reflector deployed + cap sealed + condenser shaded.
Gemini night: reflector stowed + louvers open.

cadpy / Open CASCADE 4x4 transforms store translation in column 4
(indices 3, 7, 11) — NOT the last row. Putting Z in index 14 is ignored
and leaves every part at the origin.
"""

IDENTITY = (
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0,
)


def tx(x: float = 0.0, y: float = 0.0, z: float = 0.0) -> tuple[float, ...]:
    """Translation-only transform in cadpy's 4x4 layout (tx/ty/tz at 3/7/11)."""
    return (
        1.0, 0.0, 0.0, float(x),
        0.0, 1.0, 0.0, float(y),
        0.0, 0.0, 1.0, float(z),
        0.0, 0.0, 0.0, 1.0,
    )


def rot_z_90_tx(*, x: float = 0.0, y: float = 0.0, z: float = 0.0) -> tuple[float, ...]:
    """90° about Z, then translate (night-mode louvers)."""
    return (
        0.0, -1.0, 0.0, float(x),
        1.0, 0.0, 0.0, float(y),
        0.0, 0.0, 1.0, float(z),
        0.0, 0.0, 0.0, 1.0,
    )


# T3 top = 100 + 56 = 156; M80 neck starts ~24 mm below top → z=132
CAP_THREAD_Z = 132.0
CAP_HEIGHT_MM = 52.0  # updated screw-on cap with T-handle

# Reflector at TOP — collar under condenser on T3; dish flares up to shade fins
REFLECTOR_DEPLOYED_Z = 92.0
REFLECTOR_STOWED_Z = 128.0

# Condenser under shade rim of deployed reflector
CONDENSER_Z = 100.0
SHADE_DISC_Z = 136.0

# MOLLE + bladder outside deployed reflector rim (Ø240 → r=120).
# Previous y=55/95 put the pouch inside the umbrella envelope.
REFLECTOR_OUTER_R_MM = 120.0
MOLLE_Y = REFLECTOR_OUTER_R_MM + 8.0   # just outside rim
BLADDER_Y = REFLECTOR_OUTER_R_MM + 45.0  # pouch clear of dish (+ bladder half-depth ~20)
MOLLE_Z = 5.0
BLADDER_Z = 5.0


def core_instances(*, include_reflector: bool = False):
    """Core stack without mode-specific cap/reflector."""
    instances = [
        {"name": "tebs1_t1_base", "path": "telescoping_external_bellows_shell.step", "transform": IDENTITY},
        {"name": "tebs1_t2_middle", "path": "telescoping_shell_t2.step", "transform": tx(z=50.0)},
        {"name": "tebs1_t3_top", "path": "telescoping_shell_t3.step", "transform": tx(z=100.0)},
        {"name": "expansion_spring_guidance", "path": "expansion_spring_guidance.step", "transform": tx(z=2.0)},
        {"name": "mylar_bellows_liner", "path": "mylar_bellows_liner.step", "transform": tx(z=12.0)},
        {"name": "vacuum_thermal_barrier", "path": "vacuum_thermal_barrier.step", "transform": tx(z=15.0)},
        {"name": "mof_puck_housing_1", "path": "mof_puck_housing.step", "transform": tx(z=52.0)},
        {"name": "mof_puck_housing_2", "path": "mof_puck_housing.step", "transform": tx(z=57.2)},
        {"name": "mof_puck_housing_3", "path": "mof_puck_housing.step", "transform": tx(z=62.4)},
        {"name": "mof_303_sorbent_disc", "path": "mof_sorbent_disc.step", "transform": tx(z=55.0)},
        {"name": "nickel_foam_disc", "path": "nickel_foam_disc.step", "transform": tx(z=56.5)},
        {"name": "condenser_fin_array", "path": "condenser_fin_array.step", "transform": tx(z=CONDENSER_Z)},
        {"name": "condenser_shade_disc", "path": "condenser_shade_disc.step", "transform": tx(z=SHADE_DISC_Z)},
        {"name": "central_collection_tube", "path": "central_collection_tube.step", "transform": tx(z=20.0)},
        {"name": "molle_mount_plate", "path": "molle_mount_plate.step", "transform": tx(y=MOLLE_Y, z=MOLLE_Z)},
        {"name": "hydration_bladder", "path": "hydration_bladder.step", "transform": tx(y=BLADDER_Y, z=BLADDER_Z)},
    ]
    return instances


def reflector_deployed_instance():
    return {
        "name": "mylar_parabolic_reflector_deployed",
        "path": "mylar_parabolic_reflector.step",
        "transform": tx(z=REFLECTOR_DEPLOYED_Z),
    }


def reflector_stowed_instance():
    return {
        "name": "mylar_parabolic_reflector_stowed",
        "path": "mylar_parabolic_reflector_stowed.step",
        "transform": tx(z=REFLECTOR_STOWED_Z),
    }


def cap_transform_day():
    """Day mode — cap fully screwed down, sealed for desorption."""
    return tx(z=CAP_THREAD_Z)


def cap_transform_night():
    """Night mode — cap backed off and rotated 90° to open louvers."""
    return rot_z_90_tx(z=CAP_THREAD_Z + 6.0)
