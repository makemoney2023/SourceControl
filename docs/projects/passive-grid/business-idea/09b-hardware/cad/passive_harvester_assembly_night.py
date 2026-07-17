"""Full assembly — NIGHT mode: reflector stowed, louvers open to air."""

from passive_harvester_assembly_core import (
    cap_transform_night,
    core_instances,
    reflector_stowed_instance,
)

DISPLAY_NAME = "Passive harvester — NIGHT (reflector stowed, louvers open)"


def gen_step():
    instances = core_instances()
    instances.append(reflector_stowed_instance())
    instances.append(
        {
            "name": "baffle_cap_night_open",
            "path": "baffle_cap.step",
            "transform": cap_transform_night(),
        }
    )
    return {"instances": instances}
