"""Stowed (night/transport) Mylar parabolic reflector — flat pack."""

from mylar_parabolic_reflector import DISPLAY_NAME, make_reflector_stowed

DISPLAY_NAME = "Mylar parabolic reflector (stowed)"


def gen_step():
    return make_reflector_stowed()
