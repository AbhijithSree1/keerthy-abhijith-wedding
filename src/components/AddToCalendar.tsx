import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getGoogleCalendarUrl, getIcsDataUri, type CalendarEventDetails } from '../utils/calendar';

export default function AddToCalendar({ event }: { event: CalendarEventDetails }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="font-label flex items-center gap-2 border-b pb-0.5 text-[0.65rem] uppercase tracking-[0.14em]"
        style={{ color: 'var(--color-maroon)', borderColor: 'var(--color-gold)' }}
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
          <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" />
          <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" />
          <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" />
        </svg>
        Add to Calendar
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-10 mt-2 flex w-48 flex-col rounded-md border py-2 shadow-xl backdrop-blur-md"
            style={{
              backgroundColor: 'rgba(42, 21, 51, 0.95)', // Plum with opacity
              borderColor: 'var(--color-gold)',
            }}
          >
            <a
              href={getGoogleCalendarUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-left text-sm transition-colors hover:bg-white/10"
              style={{ color: 'var(--color-ink)' }}
            >
              Google Calendar
            </a>
            <a
              href={getIcsDataUri(event)}
              download={`${event.title.replace(/\s+/g, '_')}.ics`}
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-left text-sm transition-colors hover:bg-white/10"
              style={{ color: 'var(--color-ink)' }}
            >
              Apple / Outlook (.ics)
            </a>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Invisible overlay to close dropdown when clicking outside */}
      {open && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setOpen(false)} 
        />
      )}
    </div>
  );
}
