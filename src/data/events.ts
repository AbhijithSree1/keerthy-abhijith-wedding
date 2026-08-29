export type EventKey = 'sangeet' | 'wedding' | 'backwater' | 'reception';

export interface WeddingEvent {
  key: EventKey;
  label: string;
  dayLabel: string;
  date: string;
  timeLabel: string;
  venueName: string;
  /** What this event is called to a guest invited only to the wedding day.
      With nothing else on the page to tell it apart from, the auditorium
      ceremony is simply the reception — which is what their printed card
      says too. */
  labelWhenWeddingDayOnly?: string;
  travelNote?: string;
  /** Coach times. The site cannot know which family invited a given guest,
      so unlike the card it has to name both. */
  busNote?: string;
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
    label: 'Thalikettu',
    dayLabel: 'Sat · 12 December',
    date: '2026-12-12T07:45:00+05:30',
    timeLabel: 'Muhurtham · 7:45 – 8:45 AM',
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
    label: 'Wedding',
    labelWhenWeddingDayOnly: 'Reception',
    dayLabel: 'Sat · 12 December',
    date: '2026-12-12T11:58:00+05:30',
    timeLabel: 'Muhurtham · 11:58 AM – 12:38 PM',
    venueName: 'Contour Backwaters, Changanassery, Kerala',
    travelNote: 'Nearest Railway station: Changanassery',
    busNote: 'Buses run to the venue — 10:30 AM from the bride\'s side, 9:30 AM from the groom\'s.',
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


/** What an event is called to a guest with this invitation.

    A guest invited only to the wedding day has nothing else on the page to
    tell the auditorium ceremony apart from, so to them it is simply the
    reception — the same call the printed wedding-day card makes. Guests
    invited to all three still see it as the Wedding, because the reception on
    the 13th is there to distinguish it from.

    This lives here rather than in a component because the timeline, the RSVP
    checkboxes and the RSVP we receive all have to agree. */
export function eventLabel(ev: WeddingEvent, visible: EventKey[]): string {
  const onlyWeddingDay =
    visible.length > 0 && visible.every((k) => k === 'wedding' || k === 'backwater');
  return onlyWeddingDay && ev.labelWhenWeddingDayOnly
    ? ev.labelWhenWeddingDayOnly
    : ev.label;
}
