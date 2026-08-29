#!/usr/bin/env python3
"""Write the two QR codes as standalone files for someone else's design.

    python3 build/export-qr-handoff.py

The cards embed these themselves, but if the invitation is being made
elsewhere the studio needs them loose: vector to scale, raster as a fallback,
black on white so they can sit on any background, and a note covering the four
ways a printed QR gets broken.

Output goes to qr-handoff/, with a README written for the printer rather than
for us.
"""
import base64
import os
from urllib.parse import quote

import qrcode
import qrcode.image.svg
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, "qr-handoff")

SITE = "https://abhijithsree1.github.io/keerthy-abhijith-wedding/"
TARGET_PNG_PX = 2000


def invite_url(keys):
    """None means the bare site — everyone sees all four events there."""
    if keys is None:
        return SITE
    token = base64.b64encode(",".join(keys).encode()).decode()
    return f"{SITE}#/?invite={quote(token, safe='')}"


SETS = {
    "qr-all-events": (["sangeet", "wedding", "reception"],
                      "Guests invited to all three celebrations"),
    "qr-wedding-day": (None, "General invitation — the wedding day"),
}


def main():
    os.makedirs(OUT, exist_ok=True)
    for name, (keys, who) in SETS.items():
        url = invite_url(keys)

        svg = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M,
                            border=4, image_factory=qrcode.image.svg.SvgPathImage)
        svg.add_data(url)
        svg.make(fit=True)
        svg.make_image().save(os.path.join(OUT, name + ".svg"))

        # Raster at a whole number of pixels per module, so nothing is ever
        # resampled at a fraction — which is what quietly breaks printed codes.
        q = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M,
                          border=4, box_size=1)
        q.add_data(url)
        q.make(fit=True)
        img = q.make_image(fill_color="black", back_color="white").convert("RGB")
        modules = img.width
        box = TARGET_PNG_PX // modules
        img = img.resize((modules * box, modules * box), Image.NEAREST)
        img.save(os.path.join(OUT, name + ".png"))

        print(f"{name}: {modules} modules incl. quiet zone, png {img.width}px")
        print(f"   {who}\n   {url}\n")


if __name__ == "__main__":
    main()
