import { useSearchParams } from 'react-router-dom';
import { ALL_EVENT_KEYS, type EventKey } from '../data/events';

export function useGuestSelection() {
  const [params] = useSearchParams();
  const to = params.get('to');
  const eventsParam = params.get('events');

  const events: EventKey[] = eventsParam
    ? (eventsParam.split(',').filter((k) => ALL_EVENT_KEYS.includes(k as EventKey)) as EventKey[])
    : ALL_EVENT_KEYS; // no param = show everything (default / preview link)

  return { to, events, isFiltered: events.length < ALL_EVENT_KEYS.length };
}
