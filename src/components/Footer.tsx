import { EVENTS, type EventKey } from '../data/events';

export default function Footer({ visible = [] }: { visible?: EventKey[] }) {
  const visibleEvents = EVENTS.filter((e) => visible.length === 0 || visible.includes(e.key));
  
  // Calculate dynamic date string based on visible events
  let dateText = '10–13 December 2026';
  
  if (visibleEvents.length > 0) {
    const dates = visibleEvents.map(e => new Date(e.date).getDate());
    const uniqueDates = [...new Set(dates)].sort((a, b) => a - b);
    
    if (uniqueDates.length === 1) {
      dateText = `${uniqueDates[0]} December 2026`;
    } else if (uniqueDates.length > 1) {
      const min = uniqueDates[0];
      const max = uniqueDates[uniqueDates.length - 1];
      dateText = `${min}–${max} December 2026`;
    }
  }

  return (
    <footer
      className="font-label px-5 pb-8 pt-12 text-center text-[0.68rem] uppercase tracking-[0.2em]"
      style={{ color: 'var(--color-ink-soft)' }}
    >
      Keerthy &amp; Abhijith · {dateText} · Made with love
    </footer>
  );
}
