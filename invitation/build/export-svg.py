#!/usr/bin/env python3
"""Write an editable SVG of every plate, next to the PDFs.

    python3 build/export-svg.py

Inkscape, Illustrator and CorelDRAW all open SVG with live text you can click
into and retype — which the PDFs alone could not offer while Chromium was
writing the type as Type3 glyph procedures. Installing the full font families
(build/install-fonts.sh) fixed that at the source: the PDFs now carry real
embedded TrueType, and converting them to SVG keeps real font names with it.

Text stays text here. Anyone opening these needs the three fonts installed —
they ship in the pack's fonts/ folder — or the editor will substitute
something else and the layout will look wrong even though the words are right.
"""
import os
import re
import sys

import pymupdf

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
PRINT = os.path.join(ROOT, "print")


def main():
    total = 0
    for side in ("bride", "groom"):
        pdf_dir = os.path.join(PRINT, side, "pdf")
        svg_dir = os.path.join(PRINT, side, "svg-editable")
        if not os.path.isdir(pdf_dir):
            sys.exit("no print/ — run build/render-print.mjs first")
        os.makedirs(svg_dir, exist_ok=True)

        for name in sorted(os.listdir(pdf_dir)):
            if not name.endswith(".pdf"):
                continue
            doc = pymupdf.open(os.path.join(pdf_dir, name))
            svg = doc[0].get_svg_image(text_as_path=False)

            # A Type3 font has no name to carry over, so it arrives as
            # `font-family="Type3 (91 0 R)"` and the editor substitutes at
            # random. Everything is real TrueType now except one thing: the
            # couple's names on the card front are a gold gradient clipped to
            # the glyphs, and a gradient clipped to text can only be drawn as
            # outlines. That is display type nobody needs to retype, so it is
            # reported rather than treated as a failure.
            bad = sorted(set(re.findall(r'font-family="(Type3[^"]*)"', svg)))
            note = f"   ({len(bad)} outlined — the gradient names)" if bad else ""

            out = os.path.join(svg_dir, name[:-4] + ".svg")
            with open(out, "w") as fh:
                fh.write(svg)
            total += 1
            words = len(re.findall(r"<text", svg))
            print(f"{side}/{os.path.basename(out):34} {len(svg)//1024:5} KB"
                  f"  {words} editable text runs{note}")

    print(f"\n{total} SVGs written to print/<side>/svg-editable/")


if __name__ == "__main__":
    main()
