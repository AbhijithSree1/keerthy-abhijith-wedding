#!/usr/bin/env python3
"""Prepare image assets for the invitation artwork.

Reads from ../../public/img (the wedding site's photos, untouched) and writes
print-resolution derivatives into ../assets. Safe to re-run.
"""
import base64
import os
from urllib.parse import urlencode

import qrcode
from PIL import Image, ImageEnhance, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.normpath(os.path.join(HERE, "..", "..", "public", "img"))
OUT = os.path.normpath(os.path.join(HERE, "..", "assets"))
os.makedirs(OUT, exist_ok=True)

SITE_URL = "https://abhijithsree1.github.io/keerthy-abhijith-wedding/"

# Two printed versions of the card, so the QR lands each guest on the same
# tailored page src/LinkGenerator.tsx would have produced for them. The site
# reads ?invite=<base64 csv of event keys>; no `to=` here, since a printed
# card is not addressed to one guest.
#
# "backwater" is deliberately absent from the "all" list: useGuestSelection.ts
# adds it whenever "wedding" is present, so naming it only lengthens the URL.
#
# "public" is deliberately the bare URL: useGuestSelection.ts already defaults
# an unparameterised visit to wedding + backwater, which is exactly the public
# card's guest list.
#
# Both choices are about length. URL length drives QR module count, and module
# count is what decides whether the printed code still scans — see
# build/verify-qr.py.
INVITE_SETS = {
    "all": ["sangeet", "wedding", "reception"],
    "public": None,
}

# palette (mirrors src/index.css)
PLUM_DEEP = (22, 11, 26)
PLUM = (42, 21, 51)
GOLD = (232, 205, 130)
CREAM = (243, 236, 223)
CHAMPAGNE = (236, 217, 171)
SEAL_INK = (34, 16, 43)   # the plum the seal figure is struck in, on its gold disc


def invite_url(keys):
    if keys is None:
        return SITE_URL
    token = base64.b64encode(",".join(keys).encode()).decode()
    return f"{SITE_URL}#/?" + urlencode({"invite": token})


def cover(im, w, h, focus=0.5):
    """Resize + centre-crop to exactly w x h. focus = vertical anchor 0..1."""
    src_ratio = im.width / im.height
    dst_ratio = w / h
    if src_ratio > dst_ratio:            # source too wide -> crop sides
        new_w = int(im.height * dst_ratio)
        x = (im.width - new_w) // 2
        im = im.crop((x, 0, x + new_w, im.height))
    else:                                 # source too tall -> crop top/bottom
        new_h = int(im.width / dst_ratio)
        y = int((im.height - new_h) * focus)
        im = im.crop((0, y, im.width, y + new_h))
    return im.resize((w, h), Image.LANCZOS)


def duotone(im, shadow, highlight, strength=1.0):
    """Map luminance onto a shadow->highlight ramp, then blend back by strength."""
    grey = ImageOps.grayscale(im)
    toned = ImageOps.colorize(grey, black=shadow, white=highlight)
    return Image.blend(im.convert("RGB"), toned, strength)


def build_hero():
    """Card front: the engagement portrait, warmed slightly.

    1100x1521 is the arch's own ratio (506:700), so `cover` only shaves the
    frame rather than distorting it; focus 0.16 keeps their feet in and lets
    the chandelier sit inside the top of the arch.
    """
    im = Image.open(os.path.join(SRC, "engagement-07.jpg")).convert("RGB")
    im = cover(im, 1100, 1521, focus=0.16)
    im = ImageEnhance.Color(im).enhance(0.88)
    im = ImageEnhance.Contrast(im).enhance(1.06)
    # a whisper of plum in the shadows so the photo sits in the palette
    im = duotone(im, PLUM_DEEP, (255, 250, 242), strength=0.14)
    im.save(os.path.join(OUT, "hero.jpg"), quality=94, subsampling=0)
    print("hero.jpg", im.size)


def build_qr():
    """One QR per printed version of the card, as a cream plaque.

    Deliberately dark-on-light with a full quiet zone rather than the prettier
    cream-on-plum: light-on-dark inverts what decoders expect and a zero border
    removes the margin they lock onto. Both together made the first version of
    this card scan on nothing at all.
    """
    for name, keys in INVITE_SETS.items():
        url = invite_url(keys)
        qr = qrcode.QRCode(
            version=None,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=20,
            border=4,  # the spec's quiet zone, in modules
        )
        qr.add_data(url)
        qr.make(fit=True)
        img = qr.make_image(fill_color=PLUM_DEEP, back_color=CREAM).convert("RGB")
        img.save(os.path.join(OUT, f"qr-{name}.png"))
        print(f"qr-{name}.png", img.size, f"{img.width // 20} modules", "->", url)


def build_seal_figure():
    """Turn a supplied Ganapati into the seal's figure, if one has been added.

    Drop the artwork in as `assets/ganapati-source.<ext>` and re-run. An SVG is
    used as-is (best: it foils, and it is resolution-free). A raster is turned
    into a clean single-colour silhouette in the seal's ink with a transparent
    ground, trimmed to its own edges so it centres properly in the disc.

    Writes `assets/seal-config.js` either way, so the pages know whether to use
    the supplied figure or fall back to the drawn one. Nothing here fails when
    no source is present — that is the normal state until artwork arrives.
    """
    config = os.path.join(OUT, "seal-config.js")
    src = None
    for ext in ("svg", "png", "jpg", "jpeg", "webp"):
        candidate = os.path.join(OUT, f"ganapati-source.{ext}")
        if os.path.exists(candidate):
            src = candidate
            break

    if src is None:
        with open(config, "w") as fh:
            fh.write("window.GANAPATI_SRC = null;\n")
        print("seal-config.js  no ganapati-source.* found — using the drawn figure")
        return

    if src.endswith(".svg"):
        with open(config, "w") as fh:
            fh.write('window.GANAPATI_SRC = "assets/ganapati-source.svg";\n')
        print("seal-config.js  using ganapati-source.svg")
        return

    im = Image.open(src)
    if im.mode in ("RGBA", "LA") and im.getchannel("A").getextrema()[0] < 255:
        mask = im.getchannel("A")            # already cut out
    else:
        grey = ImageOps.grayscale(im.convert("RGB"))
        # line art is usually dark on light; if the corners are dark, invert
        w, h = grey.size
        corners = [grey.getpixel(p) for p in
                   ((2, 2), (w - 3, 2), (2, h - 3), (w - 3, h - 3))]
        light_ground = sum(corners) / 4 > 128
        mask = ImageOps.invert(grey) if light_ground else grey

    # firm up the edges without losing the antialiasing that keeps curves smooth
    mask = mask.point(lambda v: 0 if v < 40 else min(255, int((v - 40) * 1.6)))

    bbox = mask.getbbox()
    if bbox:
        mask = mask.crop(bbox)

    side = max(mask.size)
    square = Image.new("L", (side, side), 0)
    square.paste(mask, ((side - mask.width) // 2, (side - mask.height) // 2))
    square = square.resize((1200, 1200), Image.LANCZOS)

    out = Image.new("RGBA", square.size, SEAL_INK + (0,))
    out.putalpha(square)
    out.save(os.path.join(OUT, "ganapati.png"))
    with open(config, "w") as fh:
        fh.write('window.GANAPATI_SRC = "assets/ganapati.png";\n')
    print("ganapati.png", out.size, f"from {os.path.basename(src)}")


if __name__ == "__main__":
    build_hero()
    build_qr()
    build_seal_figure()
