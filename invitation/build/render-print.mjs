/* Build the print package: vector PDFs and high-resolution PNGs of every
 * plate, for both the bride's and the groom's printing.
 *
 *   node build/render-print.mjs
 *
 * Two formats on purpose:
 *
 *   pdf/   the files to hand the printer. Chromium keeps all the type as
 *          outlines, so the script and the fine Cinzel capitals stay sharp at
 *          any size instead of being frozen at whatever raster we chose. The
 *          MediaBox is the bleed size and the TrimBox is the finished card, so
 *          a prepress operator sees where to cut without being told. The boxes
 *          are set afterwards by build/package-print.py.
 *
 *   png/   the same plates flattened at 600 dpi. A fallback: if the printer's
 *          RIP mishandles the PDF (Chromium writes some glyphs as Type3, which
 *          a few older workflows dislike), these are unambiguous.
 *
 * Everything here is bleed artwork — 0.125in past the trim on every side —
 * except the die-line, which is a technical drawing cut to its own outline.
 */
import { chromium } from "playwright";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const OUT = path.join(ROOT, "print");

const DPI = 600;

// 192 authoring px to the inch, against the 96 px/in Chromium assumes in PDF
const PDF_SCALE = 96 / 192;

/* name in the package  <-  the page that draws it. Both cards share one front
   design; it is written out twice under each card's own name so the two sets
   cannot be mixed up on the press floor. */
const PLATES = [
  { file: "card-front", as: "card-A-all-events-front" },
  { file: "card-back-all", as: "card-A-all-events-back" },
  { file: "card-front", as: "card-B-wedding-day-front" },
  { file: "card-back-public", as: "card-B-wedding-day-back" },
  // The envelope prints as one flat sheet, not as two rectangles. See the
  // header of envelope-flat.html for why the two rectangles cannot work.
  { file: "envelope-flat", as: "envelope-outside-flat" },
  { file: "envelope-diecut", as: "envelope-diecut", bleed: false },
];

/* Pictures of the finished envelope, for the printer to work towards. These
   are NOT artwork — envelope-back draws its flap inside the rectangle, which
   is a thing paper cannot do — so they ship as JPEGs in a mockups/ folder and
   never as a PDF anyone could put on a press. */
/* Nothing here any more. The mockups used to be renders of envelope-front and
   envelope-back, which drew a finished envelope by hand — and drew it wrong,
   with a flap shape and a seal position the die never had. They are now the
   fold simulation's own output, copied in by build/package-print.py, so the
   picture of the finished envelope is a fold of the artwork that ships. */
const MOCKUPS = [];

fs.rmSync(OUT, { recursive: true, force: true });

const browser = await chromium.launch();

for (const side of ["bride", "groom"]) {
  const ctx = await browser.newContext({ deviceScaleFactor: DPI / 192 });
  const page = await ctx.newPage();

  const dirPdf = path.join(OUT, side, "pdf");
  const dirPng = path.join(OUT, side, "png-600dpi");
  fs.mkdirSync(dirPdf, { recursive: true });
  fs.mkdirSync(dirPng, { recursive: true });

  for (const plate of [...PLATES, ...MOCKUPS]) {
    const isMockup = MOCKUPS.includes(plate);
    const bleed = plate.bleed !== false && !isMockup;

    await page.goto(pathToFileURL(path.join(ROOT, `${plate.file}.html`)).href, {
      waitUntil: "load",
    });
    await page.evaluate(
      ([bleedOn, sideName]) => {
        if (bleedOn) document.body.classList.add("bleed");
        document.body.classList.add(sideName);
      },
      [bleed, side]
    );
    await page.waitForFunction(() => document.documentElement.dataset.motifsReady === "1");
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(220);

    // Same guard the proof render uses: the stacks are absolutely positioned,
    // so content that grows past its box overlaps the kasavu band silently.
    const overflow = await page.evaluate(() => {
      const box = document.querySelector(".stack");
      if (!box) return null;
      const over = box.scrollHeight - box.clientHeight;
      return over > 1 ? over : null;
    });
    if (overflow) {
      console.error(`  !! ${side}/${plate.as}: .stack overflows by ${overflow}px`);
      process.exitCode = 1;
    }

    const el = await page.$(".sheet");
    const box = await el.boundingBox();
    const wIn = box.width / 192;
    const hIn = box.height / 192;

    await page.setViewportSize({
      width: Math.ceil(box.width),
      height: Math.ceil(box.height),
    });
    await page.waitForTimeout(80);

    if (isMockup) {
      const dirMock = path.join(OUT, side, "mockups");
      fs.mkdirSync(dirMock, { recursive: true });
      const shot = path.join(dirMock, `${plate.as}.jpg`);
      await el.screenshot({ path: shot, type: "jpeg", quality: 88 });
      console.log(`${side}/mockups/${plate.as}  (reference only, not artwork)`);
      continue;
    }

    const png = path.join(dirPng, `${plate.as}.png`);
    await el.screenshot({ path: png });

    // The PDF page is sized to the artwork exactly, with no printer margin, so
    // the plate lands edge to edge with nothing scaled to fit.
    //
    // scale is not optional. Chromium lays a PDF out at the CSS convention of
    // 96px to the inch, but this artwork is authored at 192px to the inch — so
    // without it the sheet claims twice its real size in both directions and
    // only the top-left quarter lands on the page. PDF_SCALE converts between
    // the two; it is 192/96 inverted, not a fudge factor.
    const pdf = path.join(dirPdf, `${plate.as}.pdf`);
    await page.pdf({
      path: pdf,
      width: `${wIn}in`,
      height: `${hIn}in`,
      scale: PDF_SCALE,
      printBackground: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
      pageRanges: "1",
    });

    console.log(
      `${side}/${plate.as}  ${wIn.toFixed(3)} x ${hIn.toFixed(3)} in` +
        `  pdf ${Math.round(fs.statSync(pdf).size / 1024)}KB` +
        `  png ${Math.round(fs.statSync(png).size / 1024)}KB`
    );
  }
  await ctx.close();
}

await browser.close();
