"""Three MOF puck housings stacked for collapsible core cartridge."""

DISPLAY_NAME = "MOF puck stack assembly"

IDENTITY = (
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0,
)

PUCK_PITCH_MM = 5.2


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
            {"name": "mof_puck_housing_1", "path": "mof_puck_housing.step", "transform": IDENTITY},
            {"name": "mof_puck_housing_2", "path": "mof_puck_housing.step", "transform": _tx(PUCK_PITCH_MM)},
            {"name": "mof_puck_housing_3", "path": "mof_puck_housing.step", "transform": _tx(2 * PUCK_PITCH_MM)},
        ],
    }
