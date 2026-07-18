export type EventKey = 'sangeet' | 'wedding' | 'backwater' | 'reception';

export interface WeddingEvent {
  key: EventKey;
  label: string;
  dayLabel: string;
  // ISO datetime — placeholder time (noon/evening) until muhurtham/schedule is
  // finalised. Update here once real timings are confirmed; the countdown
  // and sort order both derive from this single source.
  date: string;
  timeLabel: string;
  venueName: string;
  venueNote?: string;
  mapQuery?: string;
  extraLink?: { label: string; href: string };
}

export const EVENTS: WeddingEvent[] = [
  {
    key: 'sangeet',
    label: 'Sangeet',
    dayLabel: 'Thu · 10 December',
    date: '2026-12-10T18:00:00+05:30',
    timeLabel: 'Evening · Time to be announced',
    venueName: 'Venue details coming soon',
  },
  {
    key: 'wedding',
    label: 'Wedding',
    dayLabel: 'Sat · 12 December',
    date: '2026-12-12T08:00:00+05:30',
    timeLabel: 'Morning muhurtham · Time to be announced',
    venueName: 'Sreevallabha Temple, Thiruvalla, Kerala',
    mapQuery: 'Sreevallabha Temple Thiruvalla Kerala',
    extraLink: {
      label: 'About the Temple',
      href: 'https://en.wikipedia.org/wiki/Sreevallabha_Temple',
    },
  },
  {
    key: 'backwater',
    label: 'Backwater Reception',
    dayLabel: 'Sat · 12 December',
    date: '2026-12-12T18:00:00+05:30',
    timeLabel: 'Evening · Time to be announced',
    venueName: 'Contour Backwaters, Kerala',
    mapQuery: 'Contour Backwaters Kerala',
  },
  {
    key: 'reception',
    label: 'Reception',
    dayLabel: 'Sun · 13 December',
    date: '2026-12-13T19:00:00+05:30',
    timeLabel: 'Evening · Time to be announced',
    venueName: 'Trip is Life, Varkala, Kerala',
    mapQuery: 'Trip is Life Varkala Kerala',
  },
];

export const ALL_EVENT_KEYS = EVENTS.map((e) => e.key);
