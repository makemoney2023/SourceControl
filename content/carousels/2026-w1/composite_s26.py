#!/usr/bin/env python3
"""Composite the real Liberty pouch + patch renders onto the generated stone scene.

Used for w1d5-s26 because generative models mangle the packaging fine print.
"""

from pathlib import Path

from PIL import Image, ImageFilter

HERE = Path(__file__).parent

BG = HERE / "_refs/w1d5-s26-stone-scene-empty.png"
POUCH = HERE / "_refs/pkg-liberty-pouch.webp"
PATCH = HERE / "_refs/patch-liberty-flat.png"
OUT = HERE / "w1d5-better-balance/w1d5-s26-liberty-product-scene.png"

# Layout tuning (fractions of background size)
SURFACE_Y = 0.80          # vertical position where objects sit
POUCH_H = 0.62            # pouch height relative to bg height
POUCH_CX = 0.40           # pouch horizontal center
PATCH_H = 0.26            # patch height relative to bg height
PATCH_CX = 0.72           # patch horizontal center
PATCH_ROT = -8            # slight tilt, degrees


def drop_shadow(layer: Image.Image, blur: int, opacity: int) -> Image.Image:
    alpha = layer.split()[3].point(lambda a: a * opacity // 255)
    shadow = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    black = Image.new("RGBA", layer.size, (0, 0, 0, 255))
    shadow.paste(black, mask=alpha)
    return shadow.filter(ImageFilter.GaussianBlur(blur))


def place(bg: Image.Image, obj: Image.Image, height_frac: float, cx_frac: float,
          rot: float = 0.0) -> None:
    scale = (bg.height * height_frac) / obj.height
    obj = obj.resize((round(obj.width * scale), round(obj.height * scale)), Image.LANCZOS)
    if rot:
        obj = obj.rotate(rot, expand=True, resample=Image.BICUBIC)
    x = round(bg.width * cx_frac - obj.width / 2)
    y = round(bg.height * SURFACE_Y - obj.height)
    shadow = drop_shadow(obj, blur=max(8, obj.width // 30), opacity=140)
    bg.alpha_composite(shadow, (x + obj.width // 40, y + obj.height // 50))
    bg.alpha_composite(obj, (x, y))


def main() -> None:
    bg = Image.open(BG).convert("RGBA")
    place(bg, Image.open(POUCH).convert("RGBA"), POUCH_H, POUCH_CX)
    place(bg, Image.open(PATCH).convert("RGBA"), PATCH_H, PATCH_CX, rot=PATCH_ROT)
    bg.convert("RGB").save(OUT)
    print(f"Saved {OUT}")


if __name__ == "__main__":
    main()
