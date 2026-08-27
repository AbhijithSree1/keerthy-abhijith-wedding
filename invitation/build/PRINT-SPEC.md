# Keerthy & Abhijith — invitation, print specification

Hand this folder to the printer as it stands. Everything they need is in it.

---

## 1. What is in the folder

`pdf/` is the artwork to print. `raster-600dpi/` is the same seven plates
flattened to 600 dpi JPEG — a fallback only, if anything goes wrong with the
PDFs. **Print from the PDFs unless the printer says otherwise.** Do not print
both.

The PDFs are vector: all the type is outlines, so it stays sharp at any size
rather than being frozen at one resolution. Chromium writes some glyphs as
Type3 fonts, which a few older prepress workflows dislike — that is the only
reason the raster set is here.

| File | What it is | Prints on |
| --- | --- | --- |
| `card-A-all-events-front` | Card A, photo side | Card A, side 1 |
| `card-A-all-events-back` | Card A, three celebrations | Card A, side 2 |
| `card-B-wedding-day-front` | Card B, photo side | Card B, side 1 |
| `card-B-wedding-day-back` | Card B, the wedding day only | Card B, side 2 |
| `envelope-outside-flat` | The whole envelope, flat | One side of the flat sheet |
| `envelope-diecut` | Cutting and folding drawing | Not printed — see §6 |

`mockups/` holds two JPEGs of the finished envelope, front and back. They are
not drawings of what it ought to look like — they are the artwork in this pack
folded by `build/fold-sim.py`, so they show what the sheet actually becomes.
**They are reference pictures, not artwork.** Nothing in that folder goes on a
press.

**There are two different cards.** Card A goes to guests invited to all three
celebrations; Card B goes to everyone else. They share the same front. Both are
printed double-sided. Keep the two runs separate and labelled — the fronts are
identical, so once they are cut the only way to tell a Card A from a Card B is
to turn it over.

This folder is one family's printing. The other family's is the same seven
plates with the names, the order of the two families, and the bus time swapped.
Both must be printed; they are not interchangeable.

---

## 2. Sizes

| | Finished (trim) | Artwork supplied | Bleed |
| --- | --- | --- | --- |
| Card | 5 × 7 in · 127 × 178 mm | 5.25 × 7.25 in | 0.125 in / 3.2 mm all round |
| Envelope, finished | 5.25 × 7.25 in (A7) · 133 × 184 mm | — | — |
| Envelope, flat sheet | 7.56 × 12.15 in | 7.81 × 12.40 in | 0.125 in / 3.2 mm all round |
| Envelope die-line | 7.56 × 12.15 in flat | — | none |

Every PDF carries its **TrimBox** and **BleedBox**, so the cut line is recorded
in the file itself — no crop marks are drawn on the artwork, and none should be
needed. If the printer's workflow wants visible marks, they can add them on
imposition from those boxes.

Nothing that matters sits closer than **0.4 in / 10 mm** to the trim, so there
is room for normal cutting variance.

---

## 3. Colour

Artwork is supplied in **RGB**. Convert to CMYK with your own press profile —
do not let a generic conversion run unattended, because two things in this
design shift badly if it does:

- **The plum ground** covers almost the whole card. Build it as a rich black /
  deep four-colour build, not as a flat single-plate dark. Watch total ink
  coverage against whatever the stock allows — the ground runs edge to edge on
  every plate, so this is the single biggest risk in the job.
- **The gold** (`#E8CD82` down to `#A8842A`) is a warm metallic-looking gradient.
  In plain CMYK it will read as flat mustard. If the budget allows, print the
  gold elements as a **spot metallic or gold foil** instead — this is the one
  upgrade that would most change how the card feels in the hand. See §5.

Ask for a **wet proof or a press proof on the actual stock** before the full
run. A screen proof will not tell you what the plum does.

---

## 4. Stock and finish

Suggested, not prescriptive — the printer will know what runs well locally:

- **300–350 gsm** for the card. Anything lighter feels wrong against the dark
  ground.
- **Uncoated or matte** rather than gloss. The design is matte plum with metallic
  accents; a gloss finish fights it.
- If the plum scuffs on the chosen stock, a **matte lamination** on the printed
  side will fix it — check on the proof.
- The envelope prints on a flat sheet and is cut, folded and glued afterwards.

---

## 5. If the gold is foiled

Worth doing, with one restriction.

The gold type, rules and the kasavu bands are all vector in the PDFs and can be
foiled or printed as spot metallic without any extra work.

**The Ganapati on the envelope flap cannot.** It is a raster image, not a vector
outline, so there is no path for a foil die to follow. At its printed size —
about 15 mm — it is heavily oversampled and will print sharply as artwork, but
foiling it would need the figure redrawn as vector first. Either foil the rest
of the gold and print the Ganapati, or have it redrawn.

---

## 6. Envelope

The envelope is **one flat sheet, printed on one side only**, then die-cut,
folded and glued.

`envelope-outside-flat` is that sheet. Everything on it becomes the exterior of
the finished envelope, because every flap turns through 180° — so the face that
lies down on the press bed ends up outside everywhere:

| Region of the sheet | Colour | Becomes |
| --- | --- | --- |
| Top flap | Ivory, with the gold seal | The closing flap |
| Centre panel, 5.25 × 7.25 in | Ivory, with the address panel | The address side |
| Side flaps | Plum | Fold in |
| Bottom flap | Plum | Folds up over them, glued — the back |

`envelope-diecut` is the cutting and folding drawing at the same 7.56 × 12.15 in,
registered to the artwork. It is a technical drawing — cut lines and fold lines —
and is not printed onto anything.

**Nothing is printed on the inside face.** If a printed liner is wanted, ask and
it can be added.

### Please read before quoting

If you already have an A7 envelope die you would rather use — and most envelope
makers do — **say so, and send us its dimensions.** The artwork will be re-laid
onto your die. That is cheaper and lower risk than cutting a new one, and it is
the first thing worth settling.

Two things that are deliberate, so they are not "fixed" on the way through:

- **The seal sits wholly inside the top flap**, not across its edge. The flap
  and the back it closes against are separate regions of the sheet that only
  meet after folding, so no printed mark can cross that join. The mockups show
  the seal at the flap's point because that is where it lands once folded.
- **The plum runs off the die's edges** on the side and bottom flaps. That is
  the bleed.

---

## 7. The QR code

Each card back carries a QR code that takes guests to the wedding website. It is
the one element on the card that can silently stop working.

- It prints at **1 inch / 25.4 mm square**. **Do not reduce it.**
- **Do not invert it, tint it, or print it as gold on plum.** It must stay dark
  on the cream plaque it sits on. The plaque is not decoration — it is the
  quiet zone the scanner needs.
- **Do not resample or "clean up" the code.** The hard pixel edges are
  deliberate; smoothing them costs the scanner contrast exactly where it reads.

**Scan the QR off the paper proof with an ordinary phone before approving the
run.** Both card versions carry *different* codes — test both.

---

## 8. Before the run — a checklist

1. Proof on the real stock, and look at the plum under daylight, not office
   light.
2. Scan both QR codes off the proof.
3. Check the two families read correctly on each side's printing — the bride's
   printing names Keerthy first, the groom's names Abhijith first.
4. Check the bus time: **10:30 AM on the bride's printing, 9:30 AM on the
   groom's.** They are the easiest thing in the job to get the wrong way round.
5. Confirm Card A and Card B are bagged and labelled separately.
6. Fold one envelope from a proof sheet before running the rest, and check the
   seal lands where the mockup shows it.

---

## 9. One known limit

The photograph on the card front prints at about **417 dpi** at its finished
size, which is comfortably above the 300 dpi a press needs. It is the only
element in the job that could not be made sharper — everything else is vector.
If a higher-resolution original of that photograph exists, it is worth
re-cutting the artwork from it before printing; if not, it is fine as it is.


---

## 10. Running 300–400

`imposed/` holds the plates already laid onto **SRA3 (320 × 450 mm)** with
gutters and crop marks — print those directly, or re-impose to suit your press.

It also holds `envelope-outside-flat-SRA3-1up-CUT-GUIDE.pdf`: the same sheet
with **the die drawn on it in red, and the four creases marked as blue ticks**
in the waste outside the cut. If you are cutting by hand rather than to a die,
print that one — cut along the red line and it is consumed by the blade, then
join tick to tick with a ruler to crease. The creases are ticks rather than
lines on purpose: a dashed line drawn across the flap would still be there
after folding.
The counts below are for **400 invitations per family side**.

| | SRA3 12.6 × 17.7 | 13 × 19 | 20 × 30 |
| --- | --- | --- | --- |
| Each card plate | 4-up | 4-up | 10-up |
| Envelope flat sheet | 1-up | 1-up | 3-up |
| **Sheets per side** | **800** | **800** | **294** |
| **Sheets, both sides** | **1600** | **1600** | **588** |

The envelope is the expensive piece. Its flat sheet is 8.21 × 15.96 in with
bleed, which is one-up on SRA3 whichever way it is turned — so 400 envelopes is
400 sheets on a digital press. **On a 20 × 30 sheet it goes three-up**, and the
whole job drops from 1600 sheets to 588. At this quantity it is worth pricing
both digital and small offset before committing.

Per invitation the run is: one card (two sides), and one envelope. Card A and
Card B are different cards — split the quantity between them however the guest
list falls, and tell us the split if you want the imposition redone to match.

### Order of work

1. Print the card plates, both sides, and trim to 5 × 7 in.
2. Print the envelope flat sheets, one side only.
3. Die-cut the envelope sheets to `envelope-diecut`.
4. Crease on the four fold lines, fold, and glue the bottom flap to the side
   flaps. The top flap stays free.
5. Fold one from a proof sheet and check it before running the rest.

## 11. Editing

See `EDITING-AND-FONTS.md`. The short version: the PDFs are vector and you are
welcome to re-impose, recolour and change the die — but the type is outlined, so
**do not retype any wording**. Send corrections back and they are re-rendered
from source in minutes, consistently across both sides and both cards.
