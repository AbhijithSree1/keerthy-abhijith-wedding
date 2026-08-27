#!/usr/bin/env python3
"""Lay the plates onto press sheets, n-up, with crop marks.

    python3 build/impose.py [quantity]

A studio running 300-400 does not print one card per sheet. This works out how
many fit on the sheets they actually stock, places them with gutters and crop
marks, and says how many sheets the run needs. Output goes to
print/<side>/imposed/, and the sheet counts print to the terminal.

The envelope is the awkward one: its flat sheet is 8.2 x 15.95in with bleed, so
it is one-up on SRA3 however you turn it. That is worth knowing before quoting,
not after.
"""
import math
import os
import sys

import pymupdf

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
PRINT = os.path.join(ROOT, "print")

PT = 72.0
BLEED = 0.125
GUTTER = 0.25       # between pieces, so crop marks have somewhere to live
GRIP = 0.35         # unprintable edge most presses need

# The sheets an Indian digital or small-offset studio will actually have.
SHEETS = {
    "SRA3": (12.598, 17.717),        # 320 x 450 mm — the digital workhorse
    "13x19": (13.0, 19.0),           # A3+ / super-B
    "20x30": (20.0, 30.0),           # small offset
}

# what has to be printed, and how many of each per invitation
PLATES = {
    "card-A-all-events-front": 1,
    "card-A-all-events-back": 1,
    "card-B-wedding-day-front": 1,
    "card-B-wedding-day-back": 1,
    "envelope-outside-flat": 1,
}


def fits(piece, sheet):
    """Best n-up for a piece on a sheet, trying both rotations."""
    best = (0, 0, 0, False)
    for rot in (False, True):
        pw, ph = (piece[1], piece[0]) if rot else piece
        usable = (sheet[0] - 2 * GRIP, sheet[1] - 2 * GRIP)
        cols = int((usable[0] + GUTTER) // (pw + GUTTER))
        rows = int((usable[1] + GUTTER) // (ph + GUTTER))
        if cols * rows > best[0]:
            best = (cols * rows, cols, rows, rot)
    return best


def crop_marks(page, x, y, w, h, bleed_pt):
    """Four L-shaped marks at the trim corners, drawn out in the bleed."""
    run = 0.18 * PT
    shape = page.new_shape()
    for cx, sx in ((x + bleed_pt, -1), (x + w - bleed_pt, 1)):
        for cy, sy in ((y + bleed_pt, -1), (y + h - bleed_pt, 1)):
            shape.draw_line((cx + sx * bleed_pt * 0.35, cy),
                            (cx + sx * (bleed_pt * 0.35 + run), cy))
            shape.draw_line((cx, cy + sy * bleed_pt * 0.35),
                            (cx, cy + sy * (bleed_pt * 0.35 + run)))
    shape.finish(color=(0, 0, 0), width=0.25)
    shape.commit()


def impose(side, stem, sheet_name, quantity, write=True):
    src = pymupdf.open(os.path.join(PRINT, side, "pdf", stem + ".pdf"))
    r = src[0].rect
    piece = (r.width / PT, r.height / PT)
    sheet = SHEETS[sheet_name]

    n, cols, rows, rot = fits(piece, sheet)
    if not n:
        return None

    pw, ph = (piece[1], piece[0]) if rot else piece
    out = pymupdf.open()
    page = out.new_page(width=sheet[0] * PT, height=sheet[1] * PT)

    block = (cols * pw + (cols - 1) * GUTTER, rows * ph + (rows - 1) * GUTTER)
    ox = (sheet[0] - block[0]) / 2 * PT
    oy = (sheet[1] - block[1]) / 2 * PT

    for i in range(cols):
        for j in range(rows):
            x = ox + i * (pw + GUTTER) * PT
            y = oy + j * (ph + GUTTER) * PT
            box = pymupdf.Rect(x, y, x + pw * PT, y + ph * PT)
            page.show_pdf_page(box, src, 0, rotate=90 if rot else 0)
            crop_marks(page, x, y, pw * PT, ph * PT, BLEED * PT)

    dst = None
    if write:
        d = os.path.join(PRINT, side, "imposed")
        os.makedirs(d, exist_ok=True)
        dst = os.path.join(d, f"{stem}-{sheet_name}-{n}up.pdf")
        out.save(dst)
    return n, cols, rows, rot, math.ceil(quantity / n), dst


def main():
    quantity = int(sys.argv[1]) if len(sys.argv) > 1 else 400
    print(f"For {quantity} invitations per side, {quantity * 2} in total.\n")

    for sheet_name in SHEETS:
        print(f"  {sheet_name}  ({SHEETS[sheet_name][0]:.2f} x {SHEETS[sheet_name][1]:.2f} in)")
        total = 0
        for stem in PLATES:
            res = impose("bride", stem, sheet_name, quantity, write=False)
            if not res:
                print(f"    {stem:28} DOES NOT FIT")
                continue
            n, cols, rows, rot, sheets, _ = res
            total += sheets
            turned = " turned" if rot else ""
            print(f"    {stem:28} {n}-up ({cols}x{rows}{turned})"
                  f"  ->  {sheets} sheets")
        print(f"    {'':28} {'':16}      {total} sheets per side, "
              f"{total * 2} for both\n")

    # write the chosen sheet's imposition for both sides
    for side in ("bride", "groom"):
        for stem in PLATES:
            impose(side, stem, "SRA3", quantity)
    print("wrote print/<side>/imposed/ for SRA3")


if __name__ == "__main__":
    main()
