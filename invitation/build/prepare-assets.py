#!/usr/bin/env python3
"""Prepare image assets for the invitation artwork.

Reads from ../../public/img (the wedding site's photos, untouched) and writes
print-resolution derivatives into ../assets. Safe to re-run.
"""
import os
import qrcode
from PIL import Image, ImageEnhance, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.normpath(os.path.join(HERE, "..", "..", "public", "img"))
OUT = os.path.normpath(os.path.join(HERE, "..", "assets"))
os.makedirs(OUT, exist_ok=True)

SITE_URL = "https://abhijithsree1.github.io/keerthy-abhijith-wedding/"

# palette (mirrors src/index.css)
PLUM_DEEP = (22, 11, 26)
PLUM = (42, 21, 51)
GOLD = (232, 205, 130)
CREAM = (243, 236, 223)
CHAMPAGNE = (236, 217, 171)


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
    """Card front: the arched-porch engagement portrait, warmed slightly."""
    im = Image.open(os.path.join(SRC, "engagement-03.jpg")).convert("RGB")
    # the source is a hair wider than the arch: shave the ceiling, keep their feet
    im = cover(im, 1100, 1540, focus=0.66)
    im = ImageEnhance.Color(im).enhance(0.88)
    im = ImageEnhance.Contrast(im).enhance(1.06)
    # a whisper of plum in the shadows so the photo sits in the palette
    im = duotone(im, PLUM_DEEP, (255, 250, 242), strength=0.14)
    im.save(os.path.join(OUT, "hero.jpg"), quality=94, subsampling=0)
    print("hero.jpg", im.size)


def build_candid():
    """Envelope back: an ordinary evening out, pushed to a plum/champagne duotone.

    engagement-10 rather than the tighter selfies: at envelope size the faces
    need to sit *in* a room, not fill the whole panel.
    """
    im = Image.open(os.path.join(SRC, "engagement-10.jpg")).convert("RGB")
    im = cover(im, 1600, 970, focus=0.34)
    im = duotone(im, (26, 13, 32), CHAMPAGNE, strength=1.0)
    im = ImageEnhance.Brightness(im).enhance(1.06)
    im = ImageEnhance.Contrast(im).enhance(1.04)
    im.save(os.path.join(OUT, "candid.jpg"), quality=92, subsampling=0)
    print("candid.jpg", im.size)


def build_qr():
    """Cream-on-transparent QR pointing at the wedding site."""
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=20,
        border=0,
    )
    qr.add_data(SITE_URL)
    qr.make(fit=True)
    img = qr.make_image(fill_color=CREAM, back_color=None).convert("RGBA")
    # strip the background to transparent so it drops onto plum cleanly
    px = img.load()
    for y in range(img.height):
        for x in range(img.width):
            r, g, b, a = px[x, y]
            if (r, g, b) != CREAM:
                px[x, y] = (0, 0, 0, 0)
    img.save(os.path.join(OUT, "qr.png"))
    print("qr.png", img.size, "->", SITE_URL)


if __name__ == "__main__":
    build_hero()
    build_candid()
    build_qr()
