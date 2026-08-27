#!/usr/bin/env python3
"""The envelope die, as numbers, with the checks that say whether it folds.

Everything about the envelope — the die-line drawing, the flat artwork, and the
fold simulation — reads its geometry from here, so the three cannot drift apart.
Units are hundredths of an inch, which is what the die-line's viewBox uses.

Run it to print the checks and rewrite assets/envelope-die.js.

WHY THIS FILE EXISTS
--------------------
The first die was drawn by eye. Its top flap was 2.82in deep and its bottom
flap 1.92in, against a back 7.25in tall — so the two together covered 4.74in
of it and left a 2.5in hole. It could not have been made. Every dimension
below is now derived from a closure condition and checked.
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

# ---- the finished envelope ------------------------------------------------
W = 525          # 5.25in — takes the 5x7 card flat
H = 725          # 7.25in

# ---- the flaps ------------------------------------------------------------
S = 135          # side flaps, each
B = 625          # bottom flap: folds up, glues to the side flaps, forms the back

# The closing flap. A sharp full-width V has to be very deep to cover the
# mouth at its corners, because a triangle is shallowest exactly where the
# mouth is widest — the first attempt needed 3.40in and looked like a dart.
# Every shape below keeps its depth further out, so a much shallower, calmer
# flap still closes. FLAP picks between them.
FLAP = os.environ.get("FLAP", "soft")

FLAPS = {
    # a wide, gently pointed flap with the point taken off and radiused
    "soft":  {"depth": 220, "tip": 90,  "radius": 55},
    # a single shallow arc, corner to corner
    "round": {"depth": 205, "tip": 0,   "radius": None},
    # straight across, corners rounded — a wallet flap
    "square": {"depth": 195, "tip": 262.5, "radius": 50},
    # the original, kept so the comparison is honest
    "point": {"depth": 340, "tip": 0,   "radius": 0},
}
T = FLAPS[FLAP]["depth"]

CARD = (500, 700)

# Sheet is the die's bounding box.
SHEET_W = S + W + S
SHEET_H = T + H + B

# fold lines, in sheet coordinates
FOLD_L = S
FOLD_R = S + W
FOLD_T = T
FOLD_B = T + H

# the mouth: the gap left at the top of the back once the bottom flap is up.
# The card goes in through this, and the top flap has to cover it.
MOUTH_H = H - B
MOUTH_HALF_W = W / 2 - S


def _round_corners(pts, radius):
    """Replace each interior corner with a circular fillet of `radius`."""
    import math

    if not radius:
        return pts
    out = [pts[0]]
    for a, b, c in zip(pts, pts[1:], pts[2:]):
        v1 = (a[0] - b[0], a[1] - b[1])
        v2 = (c[0] - b[0], c[1] - b[1])
        l1 = math.hypot(*v1) or 1e-9
        l2 = math.hypot(*v2) or 1e-9
        u1 = (v1[0] / l1, v1[1] / l1)
        u2 = (v2[0] / l2, v2[1] / l2)
        # how far back along each leg the fillet starts
        half_angle = math.acos(max(-1, min(1, u1[0] * u2[0] + u1[1] * u2[1]))) / 2
        setback = min(radius / max(math.tan(half_angle), 1e-6), l1 * 0.49, l2 * 0.49)
        p1 = (b[0] + u1[0] * setback, b[1] + u1[1] * setback)
        p2 = (b[0] + u2[0] * setback, b[1] + u2[1] * setback)
        out.append(p1)
        # quadratic through the corner is close enough at these radii
        for i in range(1, 10):
            s = i / 10
            out.append((
                (1 - s) ** 2 * p1[0] + 2 * (1 - s) * s * b[0] + s ** 2 * p2[0],
                (1 - s) ** 2 * p1[1] + 2 * (1 - s) * s * b[1] + s ** 2 * p2[1],
            ))
        out.append(p2)
    out.append(pts[-1])
    return out


def flap_profile():
    """The flap edge, left base corner to right base corner, as (x, y) with y
    measured up from the fold. Curves are flattened to points, which is all
    the SVG path, the die mask and the fold simulation need."""
    import math

    half = W / 2
    spec = FLAPS[FLAP]
    tip, r = spec["tip"], spec["radius"]

    if FLAP == "round":
        # one shallow arc, corner to corner
        return [
            (-half + 2 * half * i / 120,
             T * math.sqrt(max(0.0, 1 - ((2 * i / 120) - 1) ** 2)))
            for i in range(121)
        ]

    return _round_corners(
        [(-half, 0.0), (-tip, float(T)), (tip, float(T)), (half, 0.0)], r
    )


def flap_depth_at(u):
    """How deep the flap reaches at horizontal distance u from the centre."""
    prof = flap_profile()
    best = 0.0
    for (x0, y0), (x1, y1) in zip(prof, prof[1:]):
        if min(x0, x1) <= u <= max(x0, x1) and x0 != x1:
            best = max(best, y0 + (y1 - y0) * (u - x0) / (x1 - x0))
    return best


def checks():
    """Each returns (name, ok, detail). Anything False means it will not fold."""
    out = []

    out.append((
        "Panel is the finished size",
        (FOLD_R - FOLD_L, FOLD_B - FOLD_T) == (W, H),
        f"{(FOLD_R - FOLD_L)/100:.2f} x {(FOLD_B - FOLD_T)/100:.2f} in",
    ))

    clear = (W - CARD[0], H - CARD[1])
    out.append((
        "Card clears the inside",
        clear[0] >= 20 and clear[1] >= 20,
        f"{clear[0]/100:.2f} in wider, {clear[1]/100:.2f} in taller than the "
        f"{CARD[0]/100:g} x {CARD[1]/100:g} card",
    ))

    out.append((
        "Side flaps do not collide",
        2 * S < W,
        f"{2*S/100:.2f} in of flap into a {W/100:.2f} in panel — "
        f"{(W - 2*S)/100:.2f} in apart",
    ))

    out.append((
        "Bottom flap reaches the side flaps to glue",
        B > 0 and B <= H,
        f"glued along {B/100:.2f} in of each side flap",
    ))

    out.append((
        "Top flap covers the mouth on the centre line",
        T > MOUTH_H,
        f"flap {T/100:.2f} in deep over a {MOUTH_H/100:.2f} in mouth — "
        f"{(T - MOUTH_H)/100:.2f} in of overlap",
    ))

    # the hard one: a pointed flap is shallowest at its edges, and the mouth is
    # widest exactly there. This is the check the first die failed.
    edge = flap_depth_at(MOUTH_HALF_W)
    out.append((
        "Top flap still covers the mouth at its corners",
        edge >= MOUTH_H,
        f"flap is {edge/100:.2f} in deep {MOUTH_HALF_W/100:.2f} in off centre, "
        f"against a {MOUTH_H/100:.2f} in mouth — {(edge - MOUTH_H)/100:+.2f} in",
    ))

    out.append((
        "Flap point lands on the back, not past it",
        T < H,
        f"point sits {T/100:.2f} in down a {H/100:.2f} in back",
    ))

    return out


def outline():
    """The cut path, clockwise from the top flap's left base corner."""
    flap = [(SHEET_W / 2 + x, FOLD_T - y) for x, y in flap_profile()]
    return [
        (FOLD_L, FOLD_T), *flap, (FOLD_R, FOLD_T),
        (SHEET_W, FOLD_T + 120), (SHEET_W, FOLD_B - 120), (FOLD_R, FOLD_B),
        (FOLD_R - 40, SHEET_H), (FOLD_L + 40, SHEET_H), (FOLD_L, FOLD_B),
        (0, FOLD_B - 120), (0, FOLD_T + 120), (FOLD_L, FOLD_T),
    ]


DIE = {
    "sheetW": SHEET_W, "sheetH": SHEET_H,
    "foldL": FOLD_L, "foldR": FOLD_R, "foldT": FOLD_T, "foldB": FOLD_B,
    "panelW": W, "panelH": H,
    "topFlap": T, "bottomFlap": B, "sideFlap": S,
    "mouthH": MOUTH_H,
    "outline": [[round(x, 1), round(y, 1)] for x, y in outline()],
    # where the seal sits on the flap: far enough from the point that the disc
    # fits inside the taper with room to spare
    "sealFromPoint": 95,
}


def main():
    print(f"flat sheet   {SHEET_W/100:.2f} x {SHEET_H/100:.2f} in")
    print(f"finished     {W/100:.2f} x {H/100:.2f} in")
    print(f"flaps        top {T/100:.2f} ({FLAP})  bottom {B/100:.2f}  side {S/100:.2f}\n")

    ok = True
    for name, passed, detail in checks():
        print(f"  {'PASS' if passed else 'FAIL'}  {name:46} {detail}")
        ok = ok and passed

    # the seal has to fit inside the taper where it is placed
    d = DIE["sealFromPoint"]
    avail = 2 * (W / 2) * d / T
    print(f"\n  seal sits {d/100:.2f} in from the point, where the flap is "
          f"{avail/100:.2f} in across")

    path = os.path.join(ROOT, "assets", "envelope-die.js")
    with open(path, "w") as fh:
        fh.write("/* generated by build/envelope-geometry.py — do not edit */\n")
        fh.write("window.DIE = " + json.dumps(DIE) + ";\n")

    # The same numbers as CSS lengths, so the artwork lays itself out from the
    # die rather than from numbers typed in twice. 1.92px to the hundredth of
    # an inch, because the suite is authored at 192px to the inch.
    css = os.path.join(ROOT, "assets", "envelope-die.css")
    px = lambda v: f"{v * 1.92:.2f}px"
    with open(css, "w") as fh:
        fh.write("/* generated by build/envelope-geometry.py — do not edit */\n:root {\n")
        for k in ("sheetW", "sheetH", "foldL", "foldR", "foldT", "foldB",
                  "panelW", "panelH", "topFlap", "bottomFlap", "sideFlap",
                  "sealFromPoint"):
            name = "--die-" + "".join("-" + c.lower() if c.isupper() else c for c in k)
            fh.write(f"  {name}: {px(DIE[k])};\n")
        fh.write("}\n")
    print(f"\nwrote assets/envelope-die.js and assets/envelope-die.css")

    if not ok:
        raise SystemExit("\nThe die does not fold. Fix it before rendering.")


if __name__ == "__main__":
    main()
