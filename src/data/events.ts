export type EventKey = 'sangeet' | 'wedding' | 'backwater' | 'reception';

export interface WeddingEvent {
  key: EventKey;
  label: string;
  dayLabel: string;
  date: string;
  timeLabel: string;
  venueName: string;
  travelNote?: string;
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
    timeLabel: 'Evening · 6:00 PM',
    venueName: 'KGA Elite Hotel',
    travelNote: 'Nearest Railway station: Thiruvalla',
    mapQuery: 'KGA Elite Hotel Thiruvalla Kerala',
    extraLink: {
      label: 'Hotel Website',
      href: 'https://kgaelitehotel.com/'
    }
  },
  {
    key: 'wedding',
    label: 'Temple Wedding',
    dayLabel: 'Sat · 12 December',
    date: '2026-12-12T07:30:00+05:30',
    timeLabel: 'Muhurtham · 7:00 – 7:30 AM',
    venueName: 'Sreevallabha Temple, Thiruvalla, Kerala',
    travelNote: 'Nearest Railway station: Thiruvalla',
    mapQuery: 'Sreevallabha Temple Thiruvalla Kerala',
    extraLink: {
      label: 'About the Temple',
      href: 'https://en.wikipedia.org/wiki/Sreevallabha_Temple',
    },
  },
  {
    key: 'backwater',
    label: 'Auditorium Wedding',
    dayLabel: 'Sat · 12 December',
    date: '2026-12-12T11:00:00+05:30',
    timeLabel: 'Afternoon · 11:00 AM',
    venueName: 'Contour Backwaters, Changanassery, Kerala',
    travelNote: 'Nearest Railway station: Changanassery',
    mapQuery: 'Contour Backwaters Changanassery Kerala',
    extraLink: {
      label: 'Venue Website',
      href: 'https://contourbackwaters.com/'
    },
  },
  {
    key: 'reception',
    label: 'Reception',
    dayLabel: 'Sun · 13 December',
    date: '2026-12-13T17:30:00+05:30',
    timeLabel: 'Evening · 5:30 PM',
    venueName: 'Trip is Life, Varkala, Kerala',
    travelNote: 'Nearest Railway station: Varkala · Buses provided',
    mapQuery: 'Trip is Life Varkala Kerala',
    extraLink: {
      label: 'Venue Website',
      href: 'https://cafetripislife.com/'
    },
  },
];

export const ALL_EVENT_KEYS = EVENTS.map((e) => e.key);
