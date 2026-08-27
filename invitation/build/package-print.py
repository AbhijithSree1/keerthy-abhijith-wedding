#!/usr/bin/env python3
"""Finish the print package: set the PDF page boxes, write the spec, zip it.

Run build/render-print.mjs first — this works on what it leaves in print/.

The page boxes are the point of this step. Every PDF comes out of Chromium
sized to the bleed, with no record of where the card is actually cut. Setting
TrimBox tells a prepress operator exactly that, in the file itself, which is
how PDF/X does it and is more reliable than a note in an email.
"""
import os
import shutil
import subprocess
import sys

import pymupdf
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
PRINT = os.path.join(ROOT, "print")

PT = 72.0          # PDF points per inch
BLEED_IN = 0.125   # on every side

# finished size of each plate, in inches
TRIM = {
    "card-A-all-events-front": (5.0, 7.0),
    "card-A-all-events-back": (5.0, 7.0),
    "card-B-wedding-day-front": (5.0, 7.0),
    "card-B-wedding-day-back": (5.0, 7.0),
    "envelope-front": (5.25, 7.25),
    "envelope-back": (5.25, 7.25),
    # the die-line is cut to the drawing, not to a rectangle
    "envelope-diecut": None,
}


def set_boxes(path, stem):
    doc = pymupdf.open(path)
    page = doc[0]
    media = page.mediabox

    trim = TRIM[stem]
    if trim is None:
        # no bleed on this one: the trim is the page
        page.set_cropbox(media)
    else:
        inset = BLEED_IN * PT
        rect = pymupdf.Rect(
            media.x0 + inset,
            media.y0 + inset,
            media.x1 - inset,
            media.y1 - inset,
        )
        want = (round(trim[0] * PT, 1), round(trim[1] * PT, 1))
        got = (round(rect.width, 1), round(rect.height, 1))
        assert got == want, f"{stem}: trim came out {got}, expected {want}"
        page.set_trimbox(rect)
        page.set_bleedbox(media)

    doc.save(path + ".tmp", garbage=4, deflate=True)
    doc.close()
    os.replace(path + ".tmp", path)
    return media


def main():
    if not os.path.isdir(PRINT):
        sys.exit("no print/ directory — run build/render-print.mjs first")

    for side in ("bride", "groom"):
        pdf_dir = os.path.join(PRINT, side, "pdf")
        for name in sorted(os.listdir(pdf_dir)):
            if not name.endswith(".pdf"):
                continue
            stem = name[:-4]
            media = set_boxes(os.path.join(pdf_dir, name), stem)
            trim = TRIM[stem]
            trim_txt = f"trim {trim[0]} x {trim[1]} in" if trim else "cut to die-line"
            print(
                f"{side}/{stem:28} media {media.width / PT:.3f} x "
                f"{media.height / PT:.3f} in  {trim_txt}"
            )

    # The raster backup ships as JPEG, not PNG. At quality 95 with no chroma
    # subsampling the difference from the lossless render is 0.7 levels mean —
    # invisible in print — and it takes a side's pack from 70MB to 25MB, which
    # is the difference between a pack you can email and one you cannot.
    for side in ("bride", "groom"):
        png_dir = os.path.join(PRINT, side, "png-600dpi")
        jpg_dir = os.path.join(PRINT, side, "raster-600dpi")
        os.makedirs(jpg_dir, exist_ok=True)
        for name in sorted(os.listdir(png_dir)):
            if not name.endswith(".png"):
                continue
            im = Image.open(os.path.join(png_dir, name)).convert("RGB")
            im.save(
                os.path.join(jpg_dir, name[:-4] + ".jpg"),
                "JPEG",
                quality=95,
                optimize=True,
                subsampling=0,
                dpi=(600, 600),
            )

        shutil.copy(
            os.path.join(HERE, "PRINT-SPEC.md"),
            os.path.join(PRINT, side, "PRINT-SPEC.md"),
        )

    # One zip per side: each is a complete, self-contained pack for one
    # family's printing, and each stays under the 30MB most mail will carry.
    for side in ("bride", "groom"):
        out = os.path.join(ROOT, f"invitation-print-{side}.zip")
        if os.path.exists(out):
            os.remove(out)
        subprocess.run(
            ["zip", "-r", "-q", out, "pdf", "raster-600dpi", "PRINT-SPEC.md"],
            cwd=os.path.join(PRINT, side),
            check=True,
        )
        print(f"\ninvitation-print-{side}.zip  {os.path.getsize(out) / 1e6:.1f} MB")


if __name__ == "__main__":
    main()
