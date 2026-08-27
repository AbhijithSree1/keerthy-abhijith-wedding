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
from PIL import Image, ImageChops

sys.path.insert(0, HERE_BOOT := os.path.dirname(os.path.abspath(__file__)))
from envelope_geometry import DIE  # noqa: E402

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
    # the flat envelope sheet is cut to the die, but it still carries bleed,
    # so its trim is the die's own bounding box — taken from the geometry
    # rather than typed here, because the die has changed once already
    "envelope-outside-flat": (DIE["sheetW"] / 100, DIE["sheetH"] / 100),
    # the die-line is a drawing, printed at size with no bleed
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
        # a pixel of rounding is fine; a wrong panel size is not
        want = (trim[0] * PT, trim[1] * PT)
        got = (rect.width, rect.height)
        assert max(abs(g - w) for g, w in zip(got, want)) < 1.0, (
            f"{stem}: trim came out {got}, expected {want}"
        )
        page.set_trimbox(rect)
        page.set_bleedbox(media)

    doc.save(path + ".tmp", garbage=4, deflate=True)
    doc.close()
    os.replace(path + ".tmp", path)
    return media


# A PDF and a PNG of the same plate are rasterised by different engines, so
# they never match exactly — antialiasing and gamma put the honest difference
# around 4 levels. A PDF that lost part of the plate scores an order of
# magnitude worse, which is the whole point of this gate: the first version of
# this package shipped with every PDF cropped to its top-left quarter, because
# it was checked by eye on crops rather than compared whole.
DIFF_LIMIT = 12.0


def check_against_raster(side, stem):
    pdf = os.path.join(PRINT, side, "pdf", stem + ".pdf")
    png = os.path.join(PRINT, side, "png-600dpi", stem + ".png")

    pix = pymupdf.open(pdf)[0].get_pixmap(dpi=150)
    a = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    b = Image.open(png).convert("RGB").resize(a.size, Image.LANCZOS)

    diff = ImageChops.difference(a, b).convert("L")
    hist = diff.histogram()
    total = sum(hist)
    mean = sum(i * n for i, n in enumerate(hist)) / total
    return mean


def main():
    if not os.path.isdir(PRINT):
        sys.exit("no print/ directory — run build/render-print.mjs first")

    bad = []
    for side in ("bride", "groom"):
        pdf_dir = os.path.join(PRINT, side, "pdf")
        for name in sorted(os.listdir(pdf_dir)):
            if not name.endswith(".pdf"):
                continue
            stem = name[:-4]
            media = set_boxes(os.path.join(pdf_dir, name), stem)
            trim = TRIM[stem]
            trim_txt = f"trim {trim[0]} x {trim[1]} in" if trim else "cut to die-line"
            mean = check_against_raster(side, stem)
            flag = "" if mean <= DIFF_LIMIT else "   !! DOES NOT MATCH THE RENDER"
            if flag:
                bad.append(f"{side}/{stem}")
            print(
                f"{side}/{stem:28} media {media.width / PT:.3f} x "
                f"{media.height / PT:.3f} in  {trim_txt}  diff {mean:.1f}{flag}"
            )

    if bad:
        sys.exit(
            "\nThese PDFs do not match the rendered plate — do not send them:\n  "
            + "\n  ".join(bad)
        )

    # The raster backup ships as JPEG, not PNG. At quality 95 with no chroma
    # subsampling the difference from the lossless render is 0.7 levels mean —
    # invisible in print — and it takes a side's pack from 70MB to 25MB, which
    # is the difference between a pack you can email and one you cannot.
    for side in ("bride", "groom"):
        png_dir = os.path.join(PRINT, side, "png-600dpi")
        jpg_dir = os.path.join(PRINT, side, "raster-300dpi")
        os.makedirs(jpg_dir, exist_ok=True)
        for name in sorted(os.listdir(png_dir)):
            if not name.endswith(".png"):
                continue
            im = Image.open(os.path.join(png_dir, name)).convert("RGB")
            # 300 dpi is what a press needs, and the PDFs are the real
            # deliverable now that they are checked against these renders —
            # so the fallback set halves its resolution to keep each pack
            # inside what mail will carry.
            im = im.resize((im.width // 2, im.height // 2), Image.LANCZOS)
            im.save(
                os.path.join(jpg_dir, name[:-4] + ".jpg"),
                "JPEG",
                quality=95,
                optimize=True,
                subsampling=0,
                dpi=(300, 300),
            )

        # the mockups are the fold simulation's output — a fold of the very
        # artwork in this pack, not a separate drawing of what it should be
        subprocess.run(
            [sys.executable, os.path.join(HERE, "fold-sim.py"), side],
            check=True, capture_output=True,
        )
        mock = os.path.join(PRINT, side, "mockups")
        os.makedirs(mock, exist_ok=True)
        for face in ("front", "back"):
            im = Image.open(os.path.join(ROOT, "out", f"fold-sim-{side}-{face}.png"))
            im.convert("RGB").save(
                os.path.join(mock, f"MOCKUP-envelope-{face}.jpg"),
                "JPEG", quality=88, optimize=True,
            )

        shutil.copy(
            os.path.join(HERE, "PRINT-SPEC.md"),
            os.path.join(PRINT, side, "PRINT-SPEC.md"),
        )
        shutil.copy(
            os.path.join(HERE, "EDITING-AND-FONTS.md"),
            os.path.join(PRINT, side, "EDITING-AND-FONTS.md"),
        )

    # One zip per side: each is a complete, self-contained pack for one
    # family's printing, and each stays under the 30MB most mail will carry.
    for side in ("bride", "groom"):
        out = os.path.join(ROOT, f"invitation-print-{side}.zip")
        if os.path.exists(out):
            os.remove(out)
        subprocess.run(
            ["zip", "-r", "-q", out, "pdf", "imposed", "raster-300dpi",
             "mockups", "PRINT-SPEC.md", "EDITING-AND-FONTS.md"],
            cwd=os.path.join(PRINT, side),
            check=True,
        )
        print(f"\ninvitation-print-{side}.zip  {os.path.getsize(out) / 1e6:.1f} MB")


if __name__ == "__main__":
    main()
