"""TEBS-1 collapsed assembly — all segments nested concentric at transport height."""

DISPLAY_NAME = "Telescoping bellows shell assembly (collapsed)"

IDENTITY = (
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0,
)


def gen_step():
    """Collapsed transport mode: T3 nested in T2 nested in T1 at shared origin."""
    return {
        "instances": [
            {"name": "tebs1_t1_base", "path": "telescoping_external_bellows_shell.step", "transform": IDENTITY},
            {"name": "tebs1_t2_middle", "path": "telescoping_shell_t2.step", "transform": IDENTITY},
            {"name": "tebs1_t3_top", "path": "telescoping_shell_t3.step", "transform": IDENTITY},
        ],
    }
