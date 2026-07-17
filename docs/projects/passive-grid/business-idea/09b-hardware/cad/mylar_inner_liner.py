"""Deprecated: conical water-funnel liner.

Gemini Mylar roles are:
1. Deployable parabolic reflector → mylar_parabolic_reflector.py
2. TEBS bellows vacuum film → mylar_bellows_liner.py

This module re-exports the bellows liner for backward-compatible STEP paths.
"""

from mylar_bellows_liner import DISPLAY_NAME, gen_step, make_mylar_bellows_liner as make_mylar_inner_liner
