# Keerthy & Abhijith — Wedding Site

React + TypeScript + Vite + Tailwind + Motion. Kerala temple-wedding
aesthetic — kasavu gold border frame, animated temple-door intro, parallax
hero, scroll-reveal sections, animated countdown, a proper photo lightbox.

## Running it
```
npm install     # first time only
npm run dev     # local preview at http://localhost:5173, auto-reloads on save
npm run build   # production build → outputs to dist/
npm run preview # preview the production build locally
```

## Structure
- `src/data/events.ts` — the 4 events (Sangeet / Temple Wedding / Auditorium Wedding / Reception): dates, venues, map links. Edit here.
- `src/components/` — one file per section (Hero, EventsTimeline, Gallery, Registry, RSVP, Travel, ...)
- `src/WeddingSite.tsx` — the guest-facing page, assembles all sections
- `src/LinkGenerator.tsx` — **private** page (`/#/invite`) that builds each guest's personal link
- `public/img/` — 10 placeholder engagement photos (resized/compressed for web)

## Things to fill in before sending links
1. **RSVP endpoint** — replies still go to Formspree, whose free tier stops
   accepting them after 50 a month and keeps only 30 days of history. Follow
   `rsvp-backend/README.md` to stand up the free Google Sheet endpoint, then
   paste its URL into `RSVP_ENDPOINT` in `src/components/RSVP.tsx`.
2. **Love story** — `src/components/Story.tsx` is written but not rendered
   anywhere, and still holds placeholder copy.
3. **Sangeet venue address** — in `src/data/events.ts`, currently a generic map
   search query.
4. **Photos** — swap files in `public/img/` with the real selects whenever
   ready. Resize to ~1600px on the long edge at JPEG quality ~80 before
   committing: the gallery loads every photo on the homepage, so full-size
   camera files make the page enormous. Watch out for EXIF rotation on
   portrait shots.

## The link preview
`public/og.jpg` is what WhatsApp, iMessage and the rest show when the link is
forwarded — for most guests it is the first thing they see. It is generated
from the printed card's own artwork:

```
cd invitation && node build/render-og.mjs
```

Edit `invitation/og-image.html` to change it. The absolute URLs in the
`og:` tags in `index.html` must match wherever the site is actually hosted, or
the preview breaks.

The site also carries `<meta name="robots" content="noindex, nofollow">` so it
stays reachable by link but out of search results — it lists both families'
phone numbers. Don't swap that for a `robots.txt` Disallow: that would also
block the WhatsApp crawler and kill the link preview.

## Sending personalized links
Open `/#/invite` (e.g. `http://localhost:5173/#/invite` while developing, or
`yourdomain.com/#/invite` once deployed) — **don't share this page itself**.
Type the guest/family name, tick which of the four events they're invited to,
and copy the generated link. Anyone who opens that link only sees the events
ticked for them, and gets greeted by name. A link with no event selection
(the bare homepage) shows all four — handy for previewing.

## Hosting it yourself (free)
This is a static site once built — `npm run build` produces a `dist/`
folder you deploy anywhere that serves static files:
- **Netlify**: drag the `dist/` folder onto app.netlify.com/drop — get a URL instantly.
- **GitHub Pages**: this is what the site currently uses. `npm run deploy`
  builds and pushes `dist/` to the `gh-pages` branch. There is no CI, so
  merging to `master` alone changes nothing publicly — the deploy is a
  separate, manual step.

Routing uses a `#/` hash (`/#/invite`) specifically so it works on any static
host without server-side rewrite rules.
