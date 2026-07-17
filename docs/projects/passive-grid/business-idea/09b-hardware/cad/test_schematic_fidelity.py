"""Failing-first schematic fidelity checks for passive harvester CAD generators."""

from __future__ import annotations

import sys
import unittest
from pathlib import Path

CAD_DIR = Path(__file__).resolve().parent
if str(CAD_DIR) not in sys.path:
    sys.path.insert(0, str(CAD_DIR))


class SchematicFidelityTests(unittest.TestCase):
    def test_deployed_reflector_is_wider_than_body(self):
        from mylar_parabolic_reflector import BODY_OD_MM, make_reflector_deployed

        part = make_reflector_deployed()
        size = part.bounding_box().size
        self.assertGreater(size.X, BODY_OD_MM * 1.8, "Deployed reflector must read as umbrella dish")
        self.assertGreater(size.Y, BODY_OD_MM * 1.8)

    def test_stowed_reflector_is_compact(self):
        from mylar_parabolic_reflector import make_reflector_stowed

        part = make_reflector_stowed()
        size = part.bounding_box().size
        self.assertLess(size.Z, 20.0, "Stowed reflector must be flat pack")

    def test_bellows_liner_is_cylindrical_not_funnel(self):
        from mylar_bellows_liner import make_mylar_bellows_liner

        part = make_mylar_bellows_liner()
        bb = part.bounding_box()
        # Top and bottom XY extents should be similar (cylinder), not cone
        self.assertAlmostEqual(bb.size.X, bb.size.Y, delta=1.0)
        self.assertGreater(bb.size.Z, 100.0)

    def test_baffle_cap_has_rotation_handle_height(self):
        from baffle_cap import CAP_HEIGHT_MM, make_baffle_cap

        part = make_baffle_cap()
        self.assertGreaterEqual(part.bounding_box().size.Z, CAP_HEIGHT_MM - 0.5)
        self.assertGreaterEqual(CAP_HEIGHT_MM, 40.0, "Cap must include visible handle zone")

    def test_reflector_assembly_z_is_at_top(self):
        from passive_harvester_assembly_core import (
            CONDENSER_Z,
            REFLECTOR_DEPLOYED_Z,
            REFLECTOR_STOWED_Z,
            reflector_deployed_instance,
            tx,
        )

        self.assertGreaterEqual(
            REFLECTOR_DEPLOYED_Z,
            CONDENSER_Z - 15.0,
            "Deployed reflector collar must sit at top near condenser, not base",
        )
        self.assertGreater(
            REFLECTOR_STOWED_Z,
            100.0,
            "Stowed reflector pack must sit at top under cap, not base",
        )
        # cadpy reads translation at indices 3/7/11 — last-row Z is ignored
        self.assertEqual(tx(z=92.0)[11], 92.0)
        self.assertEqual(tx(z=92.0)[14], 0.0)
        self.assertEqual(reflector_deployed_instance()["transform"][11], REFLECTOR_DEPLOYED_Z)

    def test_t2_has_bayonet_lugs(self):
        from telescoping_shell_t2 import gen_step

        part = gen_step()
        # Lugs extend OD beyond plain cylinder (~87.5)
        self.assertGreater(part.bounding_box().size.X, 90.0)

    def test_molle_plate_has_webbing_slots(self):
        from molle_mount_plate import make_molle_mount_plate

        part = make_molle_mount_plate()
        size = part.bounding_box().size
        self.assertGreater(size.Z, 100.0)
        self.assertGreater(size.X, 60.0)

    def test_bladder_clears_deployed_reflector_rim(self):
        from hydration_bladder import BLADDER_D_MM
        from passive_harvester_assembly_core import BLADDER_Y, REFLECTOR_OUTER_R_MM

        bladder_inner_y = BLADDER_Y - (BLADDER_D_MM / 2.0)
        self.assertGreater(
            bladder_inner_y,
            REFLECTOR_OUTER_R_MM,
            "Hydration bladder must sit outside the Ø240 mm umbrella, not inside it",
        )

    def test_condenser_fins_metal_print_ready(self):
        from condenser_fin_array import (
            BORE_ID_MM,
            FIN_THICKNESS_MM,
            make_condenser_fin_array,
        )

        # AlSi10Mg DMLS typical min wall ≈ 1.0 mm (Materialise / service bureaux)
        self.assertGreaterEqual(FIN_THICKNESS_MM, 1.0)
        part = make_condenser_fin_array()
        bb = part.bounding_box()
        self.assertAlmostEqual(bb.size.X, 80.0, delta=0.5)
        self.assertGreaterEqual(BORE_ID_MM, 12.0, "Bore must clear Ø12 collection tube")


if __name__ == "__main__":
    unittest.main()
