import { useSearchParams } from 'react-router-dom';
import { ALL_EVENT_KEYS, type EventKey } from '../data/events';

export function useGuestSelection() {
  const [params] = useSearchParams();
  const to = params.get('to');
  const eventsParam = params.get('events');

  const parsedEvents: EventKey[] = eventsParam
    ? (eventsParam.split(',').filter((k) => ALL_EVENT_KEYS.includes(k as EventKey)) as EventKey[])
    : [...ALL_EVENT_KEYS]; // no param = show everything (default / preview link)

  // If "wedding" is selected, ALWAYS include the Contour Backwaters reception too
  // since "Wedding" means both ceremonies that day.
  if (parsedEvents.includes('wedding') && !parsedEvents.includes('backwater')) {
    parsedEvents.push('backwater');
  }

  // Ensure they are sorted in the correct chronological order based on ALL_EVENT_KEYS
  const events = parsedEvents.sort((a, b) => ALL_EVENT_KEYS.indexOf(a) - ALL_EVENT_KEYS.indexOf(b));

  return { to, events, isFiltered: events.length < ALL_EVENT_KEYS.length };
}
