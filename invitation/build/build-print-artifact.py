#!/usr/bin/env python3
"""Build the press-kit page for each side, previews inlined as data URIs.

One template, two outputs: the bride's printing and the groom's differ only in
the order of the two families and the bus time, and both of those come out of
SIDES below rather than out of two copies of the page.

Run build/render-print.mjs first — the previews are made from print/.
"""
import base64
import io
import os

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
PRINT = os.path.join(ROOT, "print")
OUT = os.environ.get(
    "ARTIFACT_OUT",
    "/tmp/claude-0/-home-user-keerthy-abhijith-wedding/"
    "3126ebd2-dea7-5110-b083-f31d2c778891/scratchpad",
)

PREVIEW_W = 820

SIDES = {
    "bride": {
        "label": "Bride's side",
        "family": "Thompil Puthenpurayil, Manjadi, Thiruvalla",
        "first": "Keerthy",
        "second": "Abhijith",
        "bus": "10:30 AM",
        "other_bus": "9:30 AM",
        "other": "groom's",
    },
    "groom": {
        "label": "Groom's side",
        "family": "Sreenitha, Thonnalloor, Pandalam",
        "first": "Abhijith",
        "second": "Keerthy",
        "bus": "9:30 AM",
        "other_bus": "10:30 AM",
        "other": "bride's",
    },
}

# ordered as they are printed, not as they are read
PLATES = [
    ("card-A-all-events-front", "Card A · side 1", "The photo side", "5 × 7 in"),
    ("card-A-all-events-back", "Card A · side 2", "Three celebrations", "5 × 7 in"),
    ("card-B-wedding-day-front", "Card B · side 1", "The same photo side", "5 × 7 in"),
    ("card-B-wedding-day-back", "Card B · side 2", "The wedding day only", "5 × 7 in"),
    ("envelope-outside-flat", "Envelope · the printed sheet", "One side, die-cut and folded", "7.56 × 12.15 in flat"),
    ("envelope-diecut", "Envelope · die-line", "Cut and fold drawing — not printed", "7.56 × 12.15 in flat"),
]


def preview(side, stem):
    src = os.path.join(PRINT, side, "png-600dpi", stem + ".png")
    im = Image.open(src).convert("RGB")
    im = im.resize((PREVIEW_W, round(im.height * PREVIEW_W / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=84, optimize=True, progressive=True)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()


CSS = """
:root {
  --plum-deep:#120912; --plum:#1d0f24; --plum-mid:#2a1533; --mauve:#3d2149;
  --gold:#b8912f; --gold-mid:#cba24d; --gold-bright:#e8cd82;
  --champagne:#ecd9ab; --ivory:#f3ecdf; --lavender:#c6a5d8;
  --ink:#efe6d8; --ink-soft:#c9b6d2; --ink-faint:#9c86a8;
  --line:rgba(203,162,77,.26); --line-soft:rgba(203,162,77,.14);
  --warn:#f0b46a;
  --serif:"Cormorant Garamond",Georgia,serif;
  --label:"Cinzel",Georgia,serif;
  --script:"Great Vibes",cursive;
  --mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
}
/* One committed world: this page is the invitation's own plum, and the plates
   are dark artwork that only sits right on a dark ground. No theme swap. */
*{box-sizing:border-box;margin:0;padding:0}
body{
  background:
    radial-gradient(120% 60% at 50% -10%, var(--mauve) 0%, var(--plum-mid) 26%, var(--plum) 54%, var(--plum-deep) 100%)
    var(--plum-deep);
  background-attachment:fixed;
  color:var(--ink); font-family:var(--serif); font-size:19px; line-height:1.62;
  -webkit-font-smoothing:antialiased;
}
.wrap{max-width:1180px;margin:0 auto;padding:0 clamp(20px,5vw,56px) 100px}
.prose{max-width:68ch}
a{color:var(--gold-bright)}

/* ---- kasavu rule: the card's own edge treatment, used as a divider ---- */
.kara{height:22px;margin:64px 0;background-image:
  repeating-linear-gradient(90deg,rgba(232,205,130,.5) 0 1px,transparent 1px 5px),
  linear-gradient(180deg,transparent,rgba(184,145,47,.18) 45%,transparent);
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);
  mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)}

/* ---- header ---- */
header{padding:clamp(56px,9vw,104px) 0 0}
.eyebrow{font-family:var(--label);text-transform:uppercase;font-size:11px;
  letter-spacing:.42em;color:var(--champagne)}
.names{font-family:var(--script);font-size:clamp(56px,9vw,92px);line-height:1.3;
  padding:.06em .18em;margin:10px 0 0 -0.18em;
  background:linear-gradient(178deg,#f6e8bf,var(--gold-bright) 38%,var(--gold-mid) 74%,#a8842a);
  -webkit-background-clip:text;background-clip:text;color:transparent;
  text-wrap:balance}
.side-badge{display:inline-flex;align-items:center;gap:12px;margin-top:14px;
  border:1px solid var(--gold-mid);border-radius:999px;padding:9px 22px;
  font-family:var(--label);text-transform:uppercase;font-size:12px;letter-spacing:.28em;
  color:var(--gold-bright)}
.lede{margin-top:26px;font-size:22px;color:var(--ink-soft);max-width:60ch;font-style:italic}

/* ---- fact strip ---- */
.facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(168px,1fr));
  gap:1px;margin-top:44px;background:var(--line-soft);
  border:1px solid var(--line-soft)}
.facts div{background:rgba(18,9,18,.55);padding:18px 20px}
.facts dt{font-family:var(--label);text-transform:uppercase;font-size:9.5px;
  letter-spacing:.26em;color:var(--ink-faint)}
.facts dd{font-family:var(--mono);font-size:15px;color:var(--champagne);margin-top:7px;
  font-variant-numeric:tabular-nums}

/* ---- sections ---- */
section{margin-top:16px}
h2{font-family:var(--serif);font-weight:500;font-size:clamp(30px,4.4vw,40px);
  line-height:1.2;color:var(--ivory);text-wrap:balance;margin-top:6px}
h3{font-family:var(--label);text-transform:uppercase;font-size:12px;letter-spacing:.2em;
  color:var(--champagne);margin:38px 0 12px}
.num{font-family:var(--mono);font-size:13px;color:var(--gold);letter-spacing:.1em}
p{margin-top:16px}
.prose ul{margin-top:16px;padding-left:0;list-style:none;display:flex;
  flex-direction:column;gap:13px}
.prose ul li{position:relative;padding-left:26px}
.prose ul li::before{content:"";position:absolute;left:2px;top:.62em;width:9px;height:9px;
  border:1px solid var(--gold-mid);transform:rotate(45deg)}
ol.check{margin-top:20px;padding-left:0;list-style:none;counter-reset:c;
  display:flex;flex-direction:column;gap:15px}
ol.check li{counter-increment:c;position:relative;padding-left:46px}
ol.check li::before{content:counter(c,decimal-leading-zero);position:absolute;left:0;top:.16em;
  font-family:var(--mono);font-size:13px;color:var(--gold);
  border:1px solid var(--line);padding:2px 7px}
strong{color:var(--ivory);font-weight:600}
code,.mono{font-family:var(--mono);font-size:.84em;color:var(--champagne);
  background:rgba(203,162,77,.09);padding:2px 6px;border:1px solid var(--line-soft)}

/* ---- plates ---- */
.plates{display:grid;grid-template-columns:repeat(auto-fit,minmax(268px,1fr));
  gap:clamp(22px,3.4vw,42px);margin-top:40px}
figure{display:flex;flex-direction:column;gap:14px}
.shot{background:var(--plum-deep);border:1px solid var(--line-soft);
  box-shadow:0 22px 50px -26px rgba(0,0,0,.9)}
.shot img{display:block;width:100%;height:auto}
figcaption{display:flex;flex-direction:column;gap:5px}
.pl-role{font-family:var(--label);text-transform:uppercase;font-size:10px;
  letter-spacing:.24em;color:var(--gold-bright)}
.pl-file{font-family:var(--mono);font-size:12.5px;color:var(--ink-soft);word-break:break-all}
.pl-note{font-size:16px;color:var(--ink-faint);font-style:italic}

/* ---- tables ---- */
.scroll{overflow-x:auto;margin-top:24px;border:1px solid var(--line-soft)}
table{border-collapse:collapse;width:100%;min-width:520px;font-size:16px}
th,td{text-align:left;padding:13px 18px;border-bottom:1px solid var(--line-soft);
  vertical-align:top}
thead th{font-family:var(--label);text-transform:uppercase;font-size:9.5px;
  letter-spacing:.24em;color:var(--ink-faint);background:rgba(18,9,18,.5)}
tbody tr:last-child td{border-bottom:0}
td.f{font-family:var(--mono);font-size:12.5px;color:var(--champagne);
  font-variant-numeric:tabular-nums;white-space:nowrap}

/* ---- callout ---- */
.flag{border:1px solid var(--line);border-left:3px solid var(--warn);
  background:rgba(240,180,106,.06);padding:22px 26px;margin-top:30px}
.flag .h{display:block;font-family:var(--label);text-transform:uppercase;font-size:10.5px;
  letter-spacing:.24em;color:var(--warn);margin-bottom:9px}
.flag p:first-of-type{margin-top:0}
.big{font-family:var(--mono);font-size:26px;color:var(--gold-bright);
  font-variant-numeric:tabular-nums}

footer{margin-top:80px;padding-top:30px;border-top:1px solid var(--line-soft);
  font-family:var(--label);text-transform:uppercase;font-size:10px;letter-spacing:.24em;
  color:var(--ink-faint)}

@media (prefers-reduced-motion:no-preference){
  .rv{opacity:0;transform:translateY(14px);transition:opacity .7s ease,transform .7s ease}
  .rv.in{opacity:1;transform:none}
}
"""


def page(side):
    s = SIDES[side]
    plates = "\n".join(
        f"""      <figure class="rv">
        <div class="shot"><img src="{preview(side, stem)}" alt="{role} — {note}"></div>
        <figcaption>
          <span class="pl-role">{role}</span>
          <span class="pl-file">{stem}.pdf</span>
          <span class="pl-note">{note} · {size}</span>
        </figcaption>
      </figure>"""
        for stem, role, note, size in PLATES
    )

    return f"""<title>{s['label']} Press Kit</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Cinzel:wght@500;600&family=Great+Vibes&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>{CSS}</style>

<div class="wrap">

  <header>
    <p class="eyebrow">Invitation · print pack</p>
    <h1 class="names">{s['first']} &amp; {s['second']}</h1>
    <span class="side-badge">{s['label']}</span>
    <p class="lede">Seven plates, ready for press. This is the {s['label'].lower()}
      printing — {s['family']}. The {s['other']} side is a separate pack and a
      separate run.</p>

    <dl class="facts">
      <div><dt>Card trim</dt><dd>5 × 7 in</dd></div>
      <div><dt>Envelope trim</dt><dd>5.25 × 7.25 in</dd></div>
      <div><dt>Bleed</dt><dd>0.125 in</dd></div>
      <div><dt>Artwork</dt><dd>Vector PDF</dd></div>
      <div><dt>Raster backup</dt><dd>600 dpi</dd></div>
      <div><dt>Buses leave</dt><dd>{s['bus']}</dd></div>
    </dl>
  </header>

  <div class="kara"></div>

  <section>
    <p class="num">01</p>
    <h2>The seven plates</h2>
    <div class="prose">
      <p>Print from the PDFs — the type in them is vector outlines, so it stays
      sharp at any size instead of being frozen at one resolution. The
      <code>raster-600dpi</code> folder holds the same seven plates flattened to
      600&nbsp;dpi, as a fallback if the PDFs give your workflow trouble. It is
      not a second job: do not print both.</p>
    </div>
    <div class="plates">
{plates}
    </div>
  </section>

  <div class="kara"></div>

  <section class="prose">
    <p class="num">02</p>
    <h2>Two cards, one front</h2>
    <p><strong>Card A</strong> goes to guests invited to all three celebrations.
    <strong>Card B</strong> goes to everyone else. They share the same front
    design, and both print double-sided.</p>
    <p>Keep the two runs separate and labelled. Once they are cut, the fronts
    are identical — the only way to tell a Card A from a Card B is to turn it
    over.</p>

    <div class="scroll">
      <table>
        <thead><tr><th>File</th><th>Prints on</th><th>Finished size</th></tr></thead>
        <tbody>
          <tr><td class="f">card-A-all-events-front</td><td>Card A, side 1</td><td class="f">5 × 7 in</td></tr>
          <tr><td class="f">card-A-all-events-back</td><td>Card A, side 2</td><td class="f">5 × 7 in</td></tr>
          <tr><td class="f">card-B-wedding-day-front</td><td>Card B, side 1</td><td class="f">5 × 7 in</td></tr>
          <tr><td class="f">card-B-wedding-day-back</td><td>Card B, side 2</td><td class="f">5 × 7 in</td></tr>
          <tr><td class="f">envelope-outside-flat</td><td>One side of the flat sheet</td><td class="f">7.56 × 12.15 in</td></tr>
          <tr><td class="f">envelope-diecut</td><td>Not printed — die-line</td><td class="f">7.56 × 12.15 in</td></tr>
        </tbody>
      </table>
    </div>

    <div class="flag">
      <span class="h">The easiest thing in this job to get wrong</span>
      <p>This pack's buses leave at <span class="big">{s['bus']}</span> — the
      {s['other']} side reads {s['other_bus']}. The two packs are otherwise near
      identical, so check this line on the proof before the run.</p>
    </div>
  </section>

  <div class="kara"></div>

  <section class="prose">
    <p class="num">03</p>
    <h2>Bleed and trim</h2>
    <p>Artwork is supplied at bleed size — 0.125 in / 3.2 mm past the cut on
    every side. Every PDF carries its own <strong>TrimBox</strong> and
    <strong>BleedBox</strong>, so the cut line is recorded inside the file. No
    crop marks are drawn on the artwork; if your workflow wants visible marks,
    add them on imposition from those boxes.</p>
    <p>Nothing that matters sits closer than <strong>0.4 in / 10 mm</strong> to
    the trim, so there is room for normal cutting variance.</p>
  </section>

  <section class="prose">
    <p class="num">04</p>
    <h2>Colour</h2>
    <p>Artwork is <strong>RGB</strong>. Convert with your own press profile
    rather than letting a generic conversion run unattended — two things in this
    design shift badly if it does.</p>
    <ul>
      <li><strong>The plum ground</strong> covers almost the whole card and runs
        edge to edge on every plate. Build it as a deep four-colour black, not a
        flat single-plate dark, and watch total ink coverage against the stock.
        This is the biggest risk in the job.</li>
      <li><strong>The gold</strong> — <code>#E8CD82</code> down to
        <code>#A8842A</code> — is a warm metallic gradient. In plain CMYK it
        reads as flat mustard.</li>
    </ul>
    <p>Ask for a proof on the actual stock. A screen proof will not tell you
    what the plum does.</p>
  </section>

  <section class="prose">
    <p class="num">05</p>
    <h2>Stock, and the case for foil</h2>
    <p>Suggested rather than prescribed — <strong>300–350 gsm</strong>, uncoated
    or matte. Anything lighter feels wrong under a ground this dark, and gloss
    fights a design built on matte plum with metallic accents. If the plum
    scuffs on the chosen stock, matte lamination on the printed side fixes it.</p>
    <p>Every gold element except one is vector, so the gold type, the rules and
    the kasavu bands can be foiled or run as spot metallic with no extra work.
    It is the single upgrade that would most change how the card feels.</p>
    <div class="flag">
      <span class="h">The one exception</span>
      <p>The Ganapati on the envelope flap is a raster image, not an outline, so
      there is no path for a foil die to follow. At about 15 mm it is heavily
      oversampled and prints sharply as artwork — but foiling it would need the
      figure redrawn as vector first.</p>
    </div>
  </section>

  <section class="prose">
    <p class="num">06</p>
    <h2>The envelope</h2>
    <p>The envelope is <strong>one flat sheet, printed on one side</strong>,
    then die-cut, folded and glued. Everything on that sheet becomes the
    exterior, because every flap turns through 180° — the face lying on the
    press bed ends up outside everywhere.</p>
    <ul>
      <li><strong>Top flap</strong> — ivory, carrying the gold seal.</li>
      <li><strong>Centre panel</strong> — ivory, the address side. 5.25 × 7.25 in,
        and it does not fold.</li>
      <li><strong>Side flaps and bottom flap</strong> — plum. They fold in and up
        to form the back.</li>
    </ul>
    <p><code>envelope-diecut</code> is the cutting and folding drawing at the
    same size, registered to the artwork. It is a technical drawing, not
    artwork: give it to whoever makes the envelope and do not print it onto
    anything.</p>
    <div class="flag">
      <span class="h">Ask the printer this first</span>
      <p>If they already have an A7 envelope die — most envelope makers do —
      use theirs and send us the dimensions, and the artwork gets re-laid onto
      it. Cheaper and lower risk than cutting a new die.</p>
    </div>
    <p>The <code>mockups</code> folder holds two pictures of the finished
    envelope closed, so the printer can see what they are working towards. They
    are reference only and must never go on a press.</p>
  </section>

  <section class="prose">
    <p class="num">07</p>
    <h2>The QR code</h2>
    <p>Each card back carries a code that takes guests to the wedding website.
    It is the one element here that can fail silently.</p>
    <ul>
      <li>It prints at <strong>1 in / 25.4 mm square</strong>. Do not reduce it.</li>
      <li>Do not invert it, tint it, or set it gold-on-plum. It stays dark on
        its cream plaque — and the plaque is not decoration, it is the quiet
        zone the scanner needs.</li>
      <li>Do not resample or smooth it. The hard pixel edges are deliberate;
        softening them costs contrast exactly where a phone reads.</li>
    </ul>
    <p>Card A and Card B carry <strong>different</strong> codes. Scan both off
    the paper proof with an ordinary phone before approving the run.</p>
  </section>

  <div class="kara"></div>

  <section class="prose">
    <p class="num">08</p>
    <h2>Before the run</h2>
    <ol class="check">
      <li>Proof on the real stock, and look at the plum in daylight rather than
        office light.</li>
      <li>Scan both QR codes off the proof — Card A and Card B separately.</li>
      <li>Check the names read <strong>{s['first']} first</strong>. That is what
        makes this the {s['label'].lower()} pack.</li>
      <li>Check the bus line reads <strong>{s['bus']}</strong>.</li>
      <li>Confirm Card A and Card B are bagged and labelled separately before
        they leave the printer.</li>
    </ol>
  </section>

  <section class="prose">
    <p class="num">09</p>
    <h2>One known limit</h2>
    <p>The photograph on the card front prints at about <strong>417 dpi</strong>
    at its finished size — comfortably above the 300 dpi a press needs. It is
    the only element in the job that could not be made sharper; everything else
    is vector. If a higher-resolution original of that photograph turns up, the
    artwork is worth re-cutting from it. If not, it is fine as it is.</p>
  </section>

  <footer>Keerthy &amp; Abhijith · 10–13 December 2026 · {s['label']} · seven plates</footer>
</div>

<script>
  const io = new IntersectionObserver((es) => {{
    for (const e of es) if (e.isIntersecting) {{ e.target.classList.add('in'); io.unobserve(e.target); }}
  }}, {{ rootMargin: '0px 0px -8% 0px' }});
  document.querySelectorAll('.rv').forEach((el) => io.observe(el));
</script>
"""


def main():
    os.makedirs(OUT, exist_ok=True)
    for side in SIDES:
        path = os.path.join(OUT, f"press-kit-{side}.html")
        with open(path, "w") as fh:
            fh.write(page(side))
        print(f"{os.path.basename(path)}  {os.path.getsize(path) // 1024} KB")


if __name__ == "__main__":
    main()
