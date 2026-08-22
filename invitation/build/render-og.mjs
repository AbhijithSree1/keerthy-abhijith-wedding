/* Render the link-preview card to public/og.jpg.
 *
 *   node build/render-og.mjs
 *
 * This is the one piece of artwork that belongs to the website rather than to
 * the printed suite, but it is drawn from the same tokens, so it lives here and
 * writes out into the site's public folder. 1200x630 at 2x, saved as JPEG —
 * WhatsApp caches previews aggressively and rejects anything heavy.
 */
import { chromium } from "playwright";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const OUT = path.resolve(ROOT, "..", "public", "og.jpg");

const browser = await chromium.launch();
const ctx = await browser.newContext({ deviceScaleFactor: 2 });
const page = await ctx.newPage();

await page.goto(pathToFileURL(path.join(ROOT, "og-image.html")).href, { waitUntil: "load" });
await page.waitForFunction(() => document.documentElement.dataset.motifsReady === "1");
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(200);

const el = await page.$(".sheet");
await page.setViewportSize({ width: 1200, height: 630 });
await el.screenshot({ path: OUT, type: "jpeg", quality: 86 });
await browser.close();

console.log(`public/og.jpg  2400x1260 px  ${Math.round(fs.statSync(OUT).size / 1024)} KB`);
