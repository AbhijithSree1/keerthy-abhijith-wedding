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
- `src/data/events.ts` — the 4 events (Sangeet/Wedding/Backwater/Reception): dates, venues, map links. Edit here.
- `src/components/` — one file per section (Hero, EventsTimeline, Gallery, Registry, RSVP, Travel, ...)
- `src/WeddingSite.tsx` — the guest-facing page, assembles all sections
- `src/LinkGenerator.tsx` — **private** page (`/#/invite`) that builds each guest's personal link
- `public/img/` — 10 placeholder engagement photos (resized/compressed for web)

## Things to fill in before sending links
1. **Love story** — edit the placeholder paragraph in `src/components/Story.tsx`.
2. **Sangeet & backwater venue addresses** — in `src/data/events.ts`, currently "coming soon" / a generic map search query.
3. **Event times** — every event currently shows "Time to be announced". Once muhurtham/timings are fixed, update both `timeLabel` (what guests see) and `date` (drives the countdown) for each event in `src/data/events.ts`.
4. **RSVP form** — create a Google Form, then Send → embed (`<>`) icon → copy the `src` URL → paste it into the `iframe` in `src/components/RSVP.tsx` (currently `src="about:blank"`).
5. **Honeymoon fund / UPI ID** — replace the placeholder in `src/components/Registry.tsx` (`UPI_ID` constant) with the real one, or swap the wording for a registry link instead.
6. **Photos** — swap files in `public/img/` with the real selects whenever ready (keep similar file sizes — resize to ~1600px wide, JPEG quality ~80, so pages stay fast; watch out for EXIF rotation on portrait shots).

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
- **GitHub Pages**: push this repo, enable Pages, point it at `dist/` (or use a GitHub Action to build it).

Routing uses a `#/` hash (`/#/invite`) specifically so it works on any static
host without server-side rewrite rules.
