#!/usr/bin/env python3
"""Fold the flat artwork and draw what the finished envelope looks like.

    python3 build/fold-sim.py [bride|groom]

Reads out/envelope-flat-<side>.png — the flat sheet at trim, no bleed — masks
it to the die, moves each flap where folding puts it, and writes the finished
front and back to out/fold-sim-<side>.png.

WHY EACH FLAP MOVES THE WAY IT DOES
-----------------------------------
The sheet is printed on one face. Lay it print-side up and fold every flap
away from you; the centre panel's print face is then the address side, and the
flaps' print faces end up on the back. To look at that back you turn the whole
envelope over, which mirrors left-for-right. Composing the two:

  side flaps   fold about a vertical line, then the turn mirrors x back again
               — so they translate to the opposite edge, upright.

  top and      fold about a horizontal line and the turn mirrors x, which
  bottom flap  together is a 180 degree rotation. Anything printed on them
               arrives upside down.

That last line is the whole reason the artwork pre-rotates those two regions.
The quickest sanity check needs no algebra: the top flap's point aims up the
flat sheet and down on a closed envelope.
"""
import os
import sys

from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)

from envelope_geometry import DIE  # noqa: E402

PX = 1.92 * 300 / 192  # hundredths of an inch -> pixels in a 300dpi render


def p(v):
    return int(round(v * PX))


def die_mask(size):
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).polygon([(p(x), p(y)) for x, y in DIE["outline"]], fill=255)
    return m


def region(img, mask, box):
    """Cut one panel out of the sheet, keeping only paper that the die leaves."""
    sub = img.crop(box).convert("RGBA")
    sub.putalpha(mask.crop(box))
    return sub


def main():
    side = sys.argv[1] if len(sys.argv) > 1 else "bride"
    src = os.path.join(ROOT, "out", f"envelope-flat-{side}.png")
    if not os.path.exists(src):
        sys.exit(f"no {src} — run: node build/render.mjs envelope-flat")

    sheet = Image.open(src).convert("RGB")
    mask = die_mask(sheet.size)

    fl, fr = p(DIE["foldL"]), p(DIE["foldR"])
    ft, fb = p(DIE["foldT"]), p(DIE["foldB"])
    sw, sh = sheet.size
    pw, ph = fr - fl, fb - ft

    front = region(sheet, mask, (fl, ft, fr, fb))

    # unprinted stock, which is what shows through the mouth before the flap
    # comes down over it
    back = Image.new("RGBA", (pw, ph), (238, 232, 218, 255))

    # side flaps: translate to the opposite edge, upright
    left = region(sheet, mask, (0, ft, fl, fb))
    back.alpha_composite(left, (pw - (fl - 0), 0))
    right = region(sheet, mask, (fr, ft, sw, fb))
    back.alpha_composite(right, (0, 0))

    # bottom flap: 180 degrees, landing against the foot of the back
    bottom = region(sheet, mask, (0, fb, sw, sh)).rotate(180)
    back.alpha_composite(bottom, (-fl, ph - (sh - fb)))

    # top flap: 180 degrees, hanging from the head of the back
    top = region(sheet, mask, (0, 0, sw, ft)).rotate(180)
    back.alpha_composite(top, (-fl, 0))

    # the two faces on their own: these are the mockups that ship in the pack,
    # so the picture of the finished envelope is the fold of the real artwork
    # rather than a separately drawn impression of it
    for name, im in (("front", front), ("back", back)):
        im.convert("RGB").save(
            os.path.join(ROOT, "out", f"fold-sim-{side}-{name}.png")
        )

    gap = 60
    out = Image.new("RGB", (pw * 2 + gap * 3, ph + gap * 2), (46, 42, 48))
    out.paste(front.convert("RGB"), (gap, gap))
    out.paste(back.convert("RGB"), (gap * 2 + pw, gap))

    d = ImageDraw.Draw(out)
    d.text((gap, gap - 34), "FRONT  (address side)", fill=(210, 200, 215))
    d.text((gap * 2 + pw, gap - 34), "BACK  (flap closed)", fill=(210, 200, 215))

    dst = os.path.join(ROOT, "out", f"fold-sim-{side}.png")
    out.save(dst)
    print(f"{os.path.relpath(dst, ROOT)}  {out.size[0]}x{out.size[1]}")
    print(f"finished envelope {pw / 300:.2f} x {ph / 300:.2f} in")


if __name__ == "__main__":
    main()
