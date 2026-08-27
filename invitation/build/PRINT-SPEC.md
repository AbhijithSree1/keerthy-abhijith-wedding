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
| `envelope-front` | Address side | Envelope, outside |
| `envelope-back` | Plum body, ivory flap, seal | Envelope, inside face |
| `envelope-diecut` | Cutting and folding drawing | Not printed — see §6 |

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
| Envelope | 5.25 × 7.25 in (A7) · 133 × 184 mm | 5.5 × 7.5 in | 0.125 in / 3.2 mm all round |
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

The envelope prints on a flat sheet and is made up afterwards.

- `envelope-front` is the **outside** — the face with the address lines.
- `envelope-back` is the **inside face** — the plum body with the ivory flap.
  When the envelope is folded, this is what forms the back and the flap.
- `envelope-diecut` is the **cutting and folding drawing**, at 7.56 × 12.15 in
  flat. It is a technical drawing: cut lines and fold lines, not artwork. Do not
  print it onto the envelope.

Give the die-line to whoever makes the envelope. If they already have a standard
A7 (5.25 × 7.25 in) envelope die they prefer, theirs is fine — say so, and the
artwork can be re-laid to fit it.

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

---

## 9. One known limit

The photograph on the card front prints at about **417 dpi** at its finished
size, which is comfortably above the 300 dpi a press needs. It is the only
element in the job that could not be made sharper — everything else is vector.
If a higher-resolution original of that photograph exists, it is worth
re-cutting the artwork from it before printing; if not, it is fine as it is.
