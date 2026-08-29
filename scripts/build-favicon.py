"""
Generates the site's favicon set.

  python scripts/build-favicon.py

The mark is an isometric cube: the intro loader's wireframe icosahedron reduced
to the simplest form that still reads as three-dimensional. An icosahedron has
twenty faces and turns to mush below about 48px; a cube has three visible faces
and survives 16px, which is the size that actually matters in a browser tab.

Three flat tones rather than an outline, because hairlines disappear at 16px
while tonal blocks do not. Colours are the site's own: the brand red ground,
with the cube in off-white through to the dark panel tone, so the icon reads as
part of the same system as the red header bar.

Outputs, all picked up automatically by the Next.js App Router:
  app/icon.svg        modern browsers, scales cleanly
  app/favicon.ico     legacy, 16 / 32 / 48
  app/apple-icon.png  180px, iOS home screen
"""

import math
from PIL import Image, ImageDraw

RED = (221, 43, 15)        # #dd2b0f, the brand red
TOP = (247, 246, 245)      # #f7f6f5, off-white
LEFT = (168, 162, 158)     # mid tone
RIGHT = (90, 85, 82)       # dark tone, close to the panel colour

# Drawn large and downsampled, which is cheaper than antialiasing by hand.
SUPER = 512


def cube_points(cx, cy, r):
    """Six outer vertices of an isometric cube, plus its centre."""
    w = r * math.cos(math.radians(30))
    return {
        "top": (cx, cy - r),
        "upper_right": (cx + w, cy - r / 2),
        "lower_right": (cx + w, cy + r / 2),
        "bottom": (cx, cy + r),
        "lower_left": (cx - w, cy + r / 2),
        "upper_left": (cx - w, cy - r / 2),
        "centre": (cx, cy),
    }


def render(size: int) -> Image.Image:
    img = Image.new("RGB", (SUPER, SUPER), RED)
    draw = ImageDraw.Draw(img)

    cx = cy = SUPER / 2
    # Generous inset: a favicon is usually shown inside other chrome, and a
    # mark that runs to the edge looks cramped next to every other tab.
    r = SUPER * 0.30
    p = cube_points(cx, cy, r)

    draw.polygon([p["top"], p["upper_right"], p["centre"], p["upper_left"]], fill=TOP)
    draw.polygon([p["upper_left"], p["centre"], p["bottom"], p["lower_left"]], fill=LEFT)
    draw.polygon([p["upper_right"], p["lower_right"], p["bottom"], p["centre"]], fill=RIGHT)

    return img.resize((size, size), Image.LANCZOS)


def svg() -> str:
    """Hand-written so the vector version is exact rather than traced."""
    cx = cy = 32.0
    r = 19.2  # 0.30 of 64, matching the raster
    p = cube_points(cx, cy, r)

    def poly(keys, fill):
        pts = " ".join(f"{p[k][0]:.2f},{p[k][1]:.2f}" for k in keys)
        return f'  <polygon points="{pts}" fill="{fill}"/>'

    return "\n".join([
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" '
        'role="img" aria-label="James Hutt">',
        '  <rect width="64" height="64" fill="#dd2b0f"/>',
        poly(["top", "upper_right", "centre", "upper_left"], "#f7f6f5"),
        poly(["upper_left", "centre", "bottom", "lower_left"], "#a8a29e"),
        poly(["upper_right", "lower_right", "bottom", "centre"], "#5a5552"),
        "</svg>",
        "",
    ])


def main():
    with open("app/icon.svg", "w", encoding="utf-8") as f:
        f.write(svg())
    print("Written app/icon.svg")

    # Multi-resolution ICO. 16 is the one that has to work.
    render(256).save(
        "app/favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
    )
    print("Written app/favicon.ico (16, 32, 48)")

    render(180).save("app/apple-icon.png", format="PNG")
    print("Written app/apple-icon.png (180)")

    # A visual check sheet, not committed: real sizes side by side.
    sheet = Image.new("RGB", (16 + 32 + 48 + 64 + 50, 70), (68, 64, 60))
    x = 10
    for s in (16, 32, 48, 64):
        sheet.paste(render(s), (x, (70 - s) // 2))
        x += s + 10
    sheet.save("favicon-preview.png")
    print("Written favicon-preview.png (preview only, gitignored)")


if __name__ == "__main__":
    main()
