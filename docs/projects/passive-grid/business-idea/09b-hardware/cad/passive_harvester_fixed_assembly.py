"""Passive harvester assembly — fixed main_body_shell variant (v1 reference)."""

DISPLAY_NAME = "Passive MOF water harvester assembly (fixed shell)"

IDENTITY = (
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0,
)


def _tx(z: float) -> tuple[float, ...]:
    return (
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, float(z),
        0.0, 0.0, 0.0, 1.0,
    )


def gen_step():
    return {
        "instances": [
            {"name": "main_body_shell", "path": "main_body_shell.step", "transform": IDENTITY},
            {"name": "vacuum_thermal_barrier", "path": "vacuum_thermal_barrier.step", "transform": _tx(15.0)},
            {"name": "mof_303_sorbent_disc", "path": "mof_sorbent_disc.step", "transform": _tx(55.0)},
            {"name": "nickel_foam_disc", "path": "nickel_foam_disc.step", "transform": _tx(56.5)},
            {"name": "condenser_fin_array", "path": "condenser_fin_array.step", "transform": _tx(95.0)},
            {"name": "central_collection_tube", "path": "central_collection_tube.step", "transform": _tx(20.0)},
            {"name": "baffle_cap", "path": "baffle_cap.step", "transform": _tx(180.0)},
        ],
    }
