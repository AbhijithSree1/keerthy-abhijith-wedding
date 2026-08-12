# The invitation — Keerthy & Abhijith

Artwork for the printed/shareable wedding card and its envelope. Entirely
self-contained in this folder: **nothing here is part of the wedding website
build**. Vite only compiles `index.html` + `src/`, and `tsconfig.app.json` only
includes `src/`, so this folder is inert as far as the site is concerned.

## What's here

| Page | Trim size | What it is |
| --- | --- | --- |
| `card-front.html` | 5 × 7 in | The showpiece — arched photo, names, date |
| `card-back.html` | 5 × 7 in | Families, the four events, the chai line, QR |
| `envelope-front.html` | 5.25 × 7.25 in | Ruled lines for the guest's name, sender at the foot |
| `envelope-back.html` | 5.25 × 7.25 in | Flap, gold seal on the fold, a candid, backwaters |

Rendered PNGs land in `out/`. Everything is 300 dpi.

## The idea

Three things had to be true at once: unmistakably Kerala, no religious motifs,
and specific to the two of you rather than to weddings in general.

- **Kasavu, not deities.** The frame is the *kara* of a Kerala mundu — a fine
  outer thread, a breath of cloth, then a band of gold weave (`.kasavu-band` in
  `shared.css`, drawn as repeating 1px threads rather than a printed pattern).
  It carries "Kerala" without a single religious symbol.
- **The backwaters, drawn not photographed.** Coconut palms, water, and a
  *vallam* being poled across it — generated as SVG in `motifs.js`, so it
  scales to any size and prints as clean line-art. Full panorama on the
  envelope back; palms only on the card back, where the QR needs the room.
- **Two glasses of chai.** Your motif, not a stock flourish. It sits where a
  traditional card would put a lamp: as the divider under the photo on the
  front, and above the line on the back. Kerala chaya glasses — narrow foot,
  flared rim, steam leaning together.
- **The arch.** The card's photo is cut to the arch of the doorway you're
  actually standing in.
- **Ten years.** Said plainly on the front, and cashed in on the back.

Palette and fonts are lifted straight from `src/index.css` and the site's
`index.html` — plum, gold, Great Vibes / Cormorant Garamond / Cinzel — so the
card and the website read as one thing.

## Editing

The text is plain HTML; open the file and type. The two blocks most likely to
need changing are marked:

```html
<!-- ============ EDIT ME: parents' names ============ -->
<!-- ============ EDIT ME: return address ============ -->
```

**Still to fill in** (currently visible placeholders — do not print as-is):

- Both mothers' names: `card-back.html` reads "Smt. Bride's Mother" /
  "Smt. Groom's Mother". The fathers' names are guesses drawn from your own
  names — check them.
- The return address on `envelope-front.html` is just "Thiruvalla, Kerala".
- The QR points at `https://abhijithsree1.github.io/keerthy-abhijith-wedding/`
  (set in `build/prepare-assets.py`, `SITE_URL`). If you buy a domain, change
  it there and re-run the asset step, and update the printed URL on the card
  back to match.

Colours live in one place: `:root` in `shared.css`. Change `--plum` and
`--gold-bright` there and every page follows.

## Rebuilding

Needs Python (Pillow, qrcode) and Playwright's Chromium.

```bash
pip install pillow qrcode
npm install -D playwright && npx playwright install chromium

python3 build/prepare-assets.py     # crops, duotones, QR -> assets/
node build/render.mjs               # trim-size PNGs -> out/
node build/render.mjs --bleed       # +0.125in bleed on all sides, for the printer
node build/render.mjs card-front    # just one page, while iterating
```

`prepare-assets.py` reads from `../public/img` and only ever writes into
`assets/` — the website's photos are never modified.

## Printing

- Send the printer the `-bleed` files. Trim is 5 × 7 in for the card,
  5.25 × 7.25 in for the envelope (a standard A7 envelope, which the 5 × 7 card
  drops straight into).
- These are RGB PNGs. A press will want CMYK; ask the printer to convert, and
  expect the gold to sit a little flatter in CMYK than it does on screen. If
  they can do a **gold foil** pass, the elements to foil are the kasavu bands,
  the frame, the names, and the seal — everything already sits in the same
  gold.
- The plum is a heavy ink coverage. On uncoated stock ask for a proof first.
- The non-bleed PNGs in `out/` are the ones to send on WhatsApp.

## A note on the four events

The printed card lists all four celebrations. The website already tailors the
event list per guest via `/#/invite` links, so if you want a card that only
shows, say, the reception, duplicate `card-back.html`, delete the `.ev` blocks
you don't need, and render that file by name.
