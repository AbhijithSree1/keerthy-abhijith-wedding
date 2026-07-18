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
    travelNote: 'Nearest train station: Thiruvalla',
    extraLink: {
      label: 'Hotel Website',
      href: 'https://kgaelitehotel.com/'
    }
  },
  {
    key: 'wedding',
    label: 'Wedding',
    dayLabel: 'Sat · 12 December',
    date: '2026-12-12T07:30:00+05:30',
    timeLabel: 'Morning muhurtham · 7:30 AM',
    venueName: 'Sreevallabha Temple, Thiruvalla, Kerala',
    travelNote: 'Nearest train station: Thiruvalla · Buses provided',
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
    date: '2026-12-12T11:00:00+05:30',
    timeLabel: 'Afternoon · 11:00 AM',
    venueName: 'Contour Backwaters, Kerala',
    travelNote: 'Nearest train station: Thiruvalla · Buses provided',
    mapQuery: 'Contour Backwaters Kerala',
  },
  {
    key: 'reception',
    label: 'Reception',
    dayLabel: 'Sun · 13 December',
    date: '2026-12-13T17:30:00+05:30',
    timeLabel: 'Evening · 5:30 PM',
    venueName: 'Trip is Life, Varkala, Kerala',
    travelNote: 'Nearest train station: Thiruvalla · Buses provided',
    mapQuery: 'Trip is Life Varkala Kerala',
  },
];

export const ALL_EVENT_KEYS = EVENTS.map((e) => e.key);
