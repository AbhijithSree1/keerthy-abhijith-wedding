/* Render the invitation artwork to PNG at 300 dpi.
 *
 *   node build/render.mjs             # trim-size PNGs (share these)
 *   node build/render.mjs --bleed     # +0.125in bleed on every side (for print)
 *   node build/render.mjs card-front  # just one page, both sides
 *
 * Most pages print twice, once per inviting family: the bride's side names her
 * first, the groom's side names him first, and the two families swap columns.
 * Both orderings live in the HTML and `body.groom` flips them, so there is only
 * ever one copy of each page to keep in sync.
 */
import { chromium } from "playwright";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const OUT = path.join(ROOT, "out");

// 192 CSS px == 1 inch in the artwork; 300/192 lands us on 300 dpi.
const DSF = 300 / 192;

const PAGES = [
  { name: "card-front", sides: true },
  { name: "card-back-all", sides: true }, // guests invited to all four
  { name: "card-back-public", sides: true }, // the wedding day only
  { name: "envelope-front", sides: true },
  { name: "envelope-back", sides: true },
  // the die-line is a technical drawing: no sides, and no bleed
  { name: "envelope-diecut", sides: false, bleed: false },
];

const args = process.argv.slice(2);
const bleed = args.includes("--bleed");
const only = args.filter((a) => !a.startsWith("--"));
const pages = only.length ? PAGES.filter((p) => only.includes(p.name)) : PAGES;

fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ deviceScaleFactor: DSF });
const page = await ctx.newPage();
let overflowed = false;

for (const spec of pages) {
  const file = path.join(ROOT, `${spec.name}.html`);
  if (!fs.existsSync(file)) {
    console.warn(`skip ${spec.name} — no such page`);
    continue;
  }
  if (bleed && spec.bleed === false) continue;

  const sides = spec.sides ? ["bride", "groom"] : [null];

  for (const side of sides) {
    await page.goto(pathToFileURL(file).href, { waitUntil: "load" });
    await page.evaluate(
      ([bleedOn, sideName]) => {
        if (bleedOn) document.body.classList.add("bleed");
        if (sideName) document.body.classList.add(sideName);
      },
      [bleed, side]
    );
    await page.waitForFunction(
      () => document.documentElement.dataset.motifsReady === "1"
    );
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(180);

    // Layout guard: the stacks are absolutely positioned, so content that grows
    // past its box silently overlaps the kasavu band instead of pushing the page.
    const overflow = await page.evaluate(() => {
      const box = document.querySelector(".stack");
      if (!box) return null;
      const over = box.scrollHeight - box.clientHeight;
      return over > 1 ? over : null;
    });
    if (overflow) {
      console.error(
        `  !! ${spec.name}${side ? ` (${side})` : ""}: .stack overflows by ${overflow}px`
      );
      overflowed = true;
    }

    const el = await page.$(".sheet");
    const box = await el.boundingBox();
    await page.setViewportSize({
      width: Math.ceil(box.width),
      height: Math.ceil(box.height),
    });
    await page.waitForTimeout(80);

    const stem = side ? `${spec.name}-${side}` : spec.name;
    const out = path.join(OUT, `${stem}${bleed ? "-bleed" : ""}.png`);
    await el.screenshot({ path: out });
    const { width, height } = await el.boundingBox();
    console.log(
      `${path.basename(out)}  ${Math.round(width * DSF)}x${Math.round(height * DSF)} px` +
        `  (${(width / 192).toFixed(3)} x ${(height / 192).toFixed(3)} in @300dpi)`
    );
  }
}

await browser.close();

if (overflowed) {
  console.error("\nLayout overflow detected — fix before printing.");
  process.exit(1);
}
