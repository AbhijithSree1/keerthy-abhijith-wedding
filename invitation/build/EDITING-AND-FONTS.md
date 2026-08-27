# Editing these files, and the fonts they use

## What is editable, and what is not

The PDFs in `pdf/` are **vector**. Opened in Illustrator, CorelDRAW or Inkscape
you can move things, recolour them, change the die, and rescale without any
loss of quality.

**The text arrives as outlines, not as live text.** Chromium writes the type as
glyph outlines when it makes the PDF, so you can move a name or restyle it as
artwork, but you cannot click into it and retype. That is deliberate — it means
the files print identically anywhere, with no missing-font risk on your machine.

**So: do not retype anything.** If a name, an address, a phone number, a time or
a venue is wrong, send it back to us rather than setting it again by hand. The
whole suite is generated from one source, and a correction is a one-line change
and a re-render — it takes minutes, and it keeps both families' versions and
both card versions consistent. Retyping one panel by hand will not match the
letter-spacing of the others.

**What you are welcome to change without asking:**

- Imposition, gutters, crop and registration marks, colour bars.
- The die: if you have an A7 envelope die you would rather use, use it. Send us
  its dimensions and we will re-lay the artwork to fit — see below.
- CMYK conversion, trapping, and any press curve you need.

## The fonts

All four are open-licence (SIL Open Font License) and free to download and
install. We have not bundled them because the copies in our build are subsets —
they carry only the characters this artwork uses, and would fail on any text you
typed yourself.

| Font | Used for |
| --- | --- |
| Great Vibes | The names, in script |
| Cormorant Garamond (Light, Light Italic) | Body text and venues |
| Cinzel | The small letter-spaced capitals |

All four are on Google Fonts. You only need them if you are re-setting text —
for printing the supplied PDFs, you do not need them at all.

## The envelope die

`envelope-diecut.pdf` is our die, and `envelope-outside-flat.pdf` is drawn to
it exactly. Both come from a single geometry file, so they cannot disagree.

If you would rather use a die you already own, we would prefer that — it is
cheaper and lower risk. Send us:

- the flat sheet size,
- the finished envelope size,
- the four fold positions,
- the flap shape.

and we will re-lay the artwork onto it and send new files. Please do not stretch
or scale the artwork to fit a different die: the address panel has to stay at
5.25 × 7.25in or the 5 × 7in card will not go in.
