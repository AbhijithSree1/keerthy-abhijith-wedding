#!/usr/bin/env python3
"""Decode the QR straight off each finished card and check where it points.

A QR that looks fine in a layout can still be undecodable — the first version
of this card used light modules on plum with no quiet zone and scanned on
nothing. Run this after every render; it exits non-zero if a card would fail
in a guest's hand.

    python3 build/verify-qr.py
"""
import os
import sys

import cv2
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, "..", "out"))

# kept in step with INVITE_SETS in prepare-assets.py
EXPECTED = {
    "card-back-all-bride.png": "sangeet,wedding,reception",
    "card-back-all-groom.png": "sangeet,wedding,reception",
    "card-back-public-bride.png": None,  # bare URL — the site's public default
    "card-back-public-groom.png": None,
}

BASE = "https://abhijithsree1.github.io/keerthy-abhijith-wedding/"


def expected_url(keys_csv):
    if keys_csv is None:
        return BASE
    import base64
    from urllib.parse import urlencode

    token = base64.b64encode(keys_csv.encode()).decode()
    return f"{BASE}#/?" + urlencode({"invite": token})


def decode(path, scale):
    """Decode at a given scale — a phone rarely sees the card at 300 dpi."""
    im = Image.open(path).convert("RGB")
    if scale != 1:
        im = im.resize((int(im.width * scale), int(im.height * scale)), Image.LANCZOS)
    arr = cv2.cvtColor(np.array(im), cv2.COLOR_RGB2BGR)
    data, _, _ = cv2.QRCodeDetector().detectAndDecode(arr)
    return data


def main():
    failures = 0
    for filename, keys in EXPECTED.items():
        path = os.path.join(OUT, filename)
        if not os.path.exists(path):
            print(f"MISSING  {filename} — render it first")
            failures += 1
            continue

        want = expected_url(keys)
        # 100% is the printed 5in card, where a module is ~0.48mm — comfortably
        # above the ~0.4mm phones need. 80% and 70% stand in for the PNG shown
        # on a screen. Further down it is a thumbnail, and no QR survives that.
        for scale in (1.0, 0.8, 0.7):
            got = decode(path, scale)
            tag = f"{filename} @{int(scale * 100)}%"
            if got == want:
                print(f"OK       {tag}")
            elif got:
                print(f"WRONG    {tag}\n         got  {got}\n         want {want}")
                failures += 1
            else:
                print(f"NO SCAN  {tag}")
                failures += 1

    if failures:
        print(f"\n{failures} QR check(s) failed.")
        return 1
    print("\nAll QR codes scan and point at the right guest view.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
