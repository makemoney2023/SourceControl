"""TEBS-1 assembly — collapsed (nested) and expanded segment positions."""

DISPLAY_NAME = "Telescoping bellows shell assembly (expanded)"

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
    """Expanded stack: T1 base, T2 mid, T3 top — segments offset vertically."""
    return {
        "instances": [
            {"name": "tebs1_t1_base", "path": "telescoping_external_bellows_shell.step", "transform": IDENTITY},
            {"name": "tebs1_t2_middle", "path": "telescoping_shell_t2.step", "transform": _tx(50.0)},
            {"name": "tebs1_t3_top", "path": "telescoping_shell_t3.step", "transform": _tx(100.0)},
        ],
    }
