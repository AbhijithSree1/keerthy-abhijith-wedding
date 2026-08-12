/* Render the invitation artwork to PNG at 300 dpi.
 *
 *   node build/render.mjs            # trim-size PNGs (share these)
 *   node build/render.mjs --bleed    # +0.125in bleed on every side (for print)
 *   node build/render.mjs card-front # just one page
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
  "card-front",
  "card-back-all",     // guests invited to all four celebrations
  "card-back-public",  // the wedding day only — temple and backwater reception
  "envelope-front",
  "envelope-back",
  "envelope-diecut",
];

// the die-line is a technical drawing, not artwork — it has no bleed
const NO_BLEED = new Set(["envelope-diecut"]);

const args = process.argv.slice(2);
const bleed = args.includes("--bleed");
const only = args.filter((a) => !a.startsWith("--"));
const pages = only.length ? only : PAGES;

fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ deviceScaleFactor: DSF });
const page = await ctx.newPage();
let overflowed = false;

for (const name of pages) {
  const file = path.join(ROOT, `${name}.html`);
  if (!fs.existsSync(file)) {
    console.warn(`skip ${name} — no such page`);
    continue;
  }
  if (bleed && NO_BLEED.has(name)) continue;

  await page.goto(pathToFileURL(file).href, { waitUntil: "load" });
  if (bleed) await page.evaluate(() => document.body.classList.add("bleed"));
  await page.waitForFunction(() => document.documentElement.dataset.motifsReady === "1");
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
    console.error(`  !! ${name}: .stack overflows its box by ${overflow}px`);
    overflowed = true;
  }

  const el = await page.$(".sheet");
  const box = await el.boundingBox();
  await page.setViewportSize({
    width: Math.ceil(box.width),
    height: Math.ceil(box.height),
  });
  await page.waitForTimeout(80);

  const out = path.join(OUT, `${name}${bleed ? "-bleed" : ""}.png`);
  await el.screenshot({ path: out });
  const { width, height } = await el.boundingBox();
  console.log(
    `${path.basename(out)}  ${Math.round(width * DSF)}x${Math.round(height * DSF)} px` +
      `  (${(width / 192).toFixed(3)} x ${(height / 192).toFixed(3)} in @300dpi)`
  );
}

await browser.close();

if (overflowed) {
  console.error("\nLayout overflow detected — fix before printing.");
  process.exit(1);
}
