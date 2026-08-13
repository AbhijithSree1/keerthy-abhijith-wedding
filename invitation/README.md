# The invitation — Keerthy & Abhijith

Artwork for the printed/shareable wedding card and its envelope. Entirely
self-contained in this folder: **nothing here is part of the wedding website
build**. Vite only compiles `index.html` + `src/`, and `tsconfig.app.json` only
includes `src/`, so this folder is inert as far as the site is concerned.

## What's here

| Page | Trim size | What it is |
| --- | --- | --- |
| `card-front.html` | 5 × 7 in | The showpiece — arched photo, names, date |
| `card-back-all.html` | 5 × 7 in | **All four celebrations.** For close family and friends |
| `card-back-public.html` | 5 × 7 in | **The wedding day only.** The general-invite version |
| `envelope-front.html` | 5.25 × 7.25 in | Address side — ruled lines for the guest's name |
| `envelope-back.html` | 5.25 × 7.25 in | Sealed side — flap, Ganapati seal, a candid, backwaters |
| `envelope-diecut.html` | 7.55 × 12.15 in | The flat sheet the envelope is cut and folded from |

## Bride's side and groom's side

Every page except the die-line prints **twice**, once per inviting family:

- **Bride's side** — Keerthy's name first, her parents in the left column.
- **Groom's side** — Abhijith's name first, his parents in the left column.

Rather than keeping two copies of every page in sync, each page carries both
orderings and `body.groom` reverses them with CSS `order`. That is also why the
names are three spans (`.bride` / `.amp` / `.groom`) inside a `.pair` flex row
instead of one run of text — CSS can reorder boxes, but not text nodes.
`render.mjs` renders each page once per side and suffixes the filename.

Both families' house names and phone numbers appear on **both** versions of the
card back; only the column order changes. The envelope's return address is the
inviting family's alone, switched by `.only-bride` / `.only-groom`.

Rendered PNGs land in `out/`, at 300 dpi — 10 artwork files plus the die-line,
and the same again with bleed.

## The envelope, physically

It is an ordinary **rectangular A7 envelope, portrait, 5.25 × 7.25 in**. The
5 × 7 card slides straight in; nothing about the card folds.

- **Front** is the smooth face. This is the address side, and the one that
  faces up in the post.
- **Back** is where the flap folds down and seals. That is the side the guest
  opens.

The two PNGs show each face *finished and sealed* — they are not fold-out
templates. `envelope-diecut.png` is the fold-out: the flat sheet at true scale,
solid lines to cut, dashed lines to fold, with the fold order numbered.

**Worth knowing before you commit to custom envelopes.** On a real envelope the
side, bottom and top flaps fold *away* from the front panel, so their outward
faces are the reverse of the sheet — meaning a fully printed custom envelope is
a two-sided print job and costs accordingly. The cheap path is to buy ready-made
plain A7 envelopes in plum or kraft and print or foil only the front. Hand the
die-line to a printer only if you want the full custom job.

## The two card versions, and the QR

The QR on each back opens the website already filtered to that guest's events —
the same thing `/#/invite` produces, minus the guest's name.

| Version | QR opens | Shows |
| --- | --- | --- |
| `card-back-all-*` | `…/#/?invite=…` | Sangeet, wedding, backwater reception, reception |
| `card-back-public-*` | the bare site URL | Wedding + backwater reception |

The QR is identical on both sides of a given version — it points at the events,
not at a family.

Two things to know, both coming from the site's own behaviour in
`src/hooks/useGuestSelection.ts`:

1. **The temple wedding and the backwater reception are inseparable on the
   site.** Line 26 adds `backwater` whenever `wedding` is selected. So a truly
   wedding-only card is not something the site can currently show — the public
   card lists both, which is what its QR opens. To decouple them, delete that
   `if` block in `useGuestSelection.ts` and change the public card's QR to an
   explicit `invite` token.
2. **The bare URL is not "everything".** It defaults to wedding + backwater,
   which is exactly the public guest list — so the public card uses it as-is.
   That also keeps its URL short, which matters (see below).

### Why the QR is a cream tile

The first version was cream modules on plum with no quiet zone. It scanned on
nothing — light-on-dark inverts what decoders expect, and a zero border removes
the margin they lock onto. It is now dark-on-cream with a full quiet zone, and
`image-rendering: pixelated` keeps the module edges hard.

`build/verify-qr.py` decodes the QR straight out of the finished card PNG and
checks the URL, at print size and at two screen sizes. **Run it after every
render.** At 5 in a module is ~0.48 mm, comfortably above the ~0.4 mm phones
need. Both cards pass.

URL length drives module count, which is what decides whether a printed code
scans — that is why `INVITE_SETS` omits `backwater` from the "all" list (the
site adds it anyway) and why the public card uses the bare URL.

## Editing

The text is plain HTML; open the file and type. Blocks likely to change are
marked `<!-- EDIT ME -->`. Colours live in one place: `:root` in `shared.css`.

**Families**, as given:

| | Bride's side | Groom's side |
| --- | --- | --- |
| Parents | Sri. T. K. Prakash & Smt. Hema Prakash | Sri. Sreekumar V. & Smt. Anitha Kumary |
| House | Thompil Puthenpurayil, Manjadi, Thiruvalla | Sreenitha, Thonnalloor, Pandalam |
| Phone | +91 88914 53672 | +91 94475 94088 |

## The Ganapati

`ganapati()` in `motifs.js` is hand-drawn SVG — front-facing, symmetric apart
from the trunk, entirely stroked so it foils or prints in the same single gold
as everything else. `ganapatiSeal()` wraps it in the opaque disc that closes the
envelope; that seal carries the Ganapati and nothing else.

The **K&A monogram still appears on the envelope front**, at the top of the
address side. Swap it for the Ganapati by changing that page's `data-motif`
from `seal` to `ganapatiSeal`.

## Rebuilding

Needs Python (Pillow, qrcode, opencv-python-headless) and Playwright's Chromium.

```bash
pip install pillow qrcode opencv-python-headless
npm install -D playwright && npx playwright install chromium

python3 build/prepare-assets.py     # crops, duotones, QR codes -> assets/
node build/render.mjs               # trim-size PNGs -> out/
node build/render.mjs --bleed       # +0.125in bleed, for the printer
python3 build/verify-qr.py          # decode the QR back off the finished cards
node build/render.mjs card-front    # just one page, while iterating
```

`render.mjs` fails the build if a page's `.stack` overflows its box — that is
how the QR caption ended up printed on top of the kasavu band once.
`prepare-assets.py` reads from `../public/img` and only ever writes into
`assets/`; the website's photos are never modified.

## Printing

- Send the printer the `-bleed` files. Trim is 5 × 7 in for the card,
  5.25 × 7.25 in for the envelope.
- These are RGB PNGs; a press will want CMYK. Ask the printer to convert, and
  expect the gold to sit flatter in CMYK than on screen. If they can do a **gold
  foil** pass, foil the kasavu bands, the frame, the names and the seal —
  they already share one gold.
- The plum is heavy ink coverage. On uncoated stock, ask for a proof first.
- Do not let anyone rescale or re-compress the QR tile. Check a proof by
  scanning it with a phone before the full run.
- The non-bleed PNGs in `out/` are the ones to send on WhatsApp.
