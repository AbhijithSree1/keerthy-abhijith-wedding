export interface CalendarEventDetails {
  title: string;
  description: string;
  location: string;
  startDate: string; // ISO string
  durationHours?: number;
}

function formatGoogleDate(isoDate: string, addHours = 0): string {
  const d = new Date(isoDate);
  d.setHours(d.getHours() + addHours);
  // Convert to YYYYMMDDTHHmmssZ (UTC)
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export function getGoogleCalendarUrl({ title, description, location, startDate, durationHours = 3 }: CalendarEventDetails) {
  const start = formatGoogleDate(startDate);
  const end = formatGoogleDate(startDate, durationHours);
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${start}/${end}`,
    details: description,
    location: location,
  });
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function getIcsDataUri({ title, description, location, startDate, durationHours = 3 }: CalendarEventDetails) {
  const start = formatGoogleDate(startDate);
  const end = formatGoogleDate(startDate, durationHours);
  const now = formatGoogleDate(new Date().toISOString());
  
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Keerthy and Abhijith Wedding//EN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}-${Math.random().toString(36).substring(2, 9)}@wedding.local`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
  
  return `data:text/calendar;charset=utf8,${encodeURIComponent(ics)}`;
}
