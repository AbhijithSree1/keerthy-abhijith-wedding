import { useSearchParams } from 'react-router-dom';
import { ALL_EVENT_KEYS, type EventKey } from '../data/events';

export function useGuestSelection() {
  const [params] = useSearchParams();
  const to = params.get('to');
  const eventsParam = params.get('events');
  const inviteParam = params.get('invite');

  // Default public view if NO parameters are provided or they are removed
  let parsedEvents: EventKey[] = ['wedding', 'backwater'];

  if (inviteParam) {
    try {
      const decoded = atob(inviteParam);
      parsedEvents = decoded.split(',').filter((k) => ALL_EVENT_KEYS.includes(k as EventKey)) as EventKey[];
    } catch (e) {
      // Ignore bad base64
    }
  } else if (eventsParam) {
    // Legacy support for plain-text ?events=...
    parsedEvents = eventsParam.split(',').filter((k) => ALL_EVENT_KEYS.includes(k as EventKey)) as EventKey[];
  }

  // If "wedding" is selected, ALWAYS include the Contour Backwaters reception too
  if (parsedEvents.includes('wedding') && !parsedEvents.includes('backwater')) {
    parsedEvents.push('backwater');
  }

  // Ensure they are sorted in the correct chronological order based on ALL_EVENT_KEYS
  const events = parsedEvents.sort((a, b) => ALL_EVENT_KEYS.indexOf(a) - ALL_EVENT_KEYS.indexOf(b));

  return { to, events, isFiltered: events.length < ALL_EVENT_KEYS.length };
}
