"""Full assembly — DAY mode: reflector deployed, cap sealed, condenser shaded."""

from passive_harvester_assembly_core import (
    cap_transform_day,
    core_instances,
    reflector_deployed_instance,
)

DISPLAY_NAME = "Passive harvester — DAY (reflector deployed, cap sealed)"


def gen_step():
    instances = core_instances()
    instances.append(reflector_deployed_instance())
    instances.append(
        {
            "name": "baffle_cap_day_sealed",
            "path": "baffle_cap.step",
            "transform": cap_transform_day(),
        }
    )
    return {"instances": instances}
