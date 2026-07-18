import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { EVENTS, type EventKey } from '../data/events';
import Reveal from './Reveal';

const ICONS: Record<EventKey, ReactNode> = {
  sangeet: (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M9 18V5l10-2v13" stroke="currentColor" strokeWidth={1.5} />
      <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth={1.5} />
      <circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth={1.5} />
    </svg>
  ),
  wedding: (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M12 2 2 9h20L12 2Z" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" />
      <path d="M4 9v11h16V9M9 20v-6h6v6" stroke="currentColor" strokeWidth={1.5} />
    </svg>
  ),
  backwater: (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M2 18c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0" stroke="currentColor" strokeWidth={1.5} />
      <path d="M12 14V4M8 7l4-3 4 3" stroke="currentColor" strokeWidth={1.5} />
    </svg>
  ),
  reception: (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M12 21s-7-4.5-7-10a7 7 0 0 1 14 0c0 5.5-7 10-7 10Z" stroke="currentColor" strokeWidth={1.5} />
      <circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth={1.5} />
    </svg>
  ),
};

export default function EventsTimeline({ visible }: { visible: EventKey[] }) {
  const visibleEvents = EVENTS.filter((e) => visible.includes(e.key));

  return (
    <section id="events" className="mx-auto max-w-[1100px] px-5 py-20">
      <Reveal className="mb-14 text-center">
        <p className="font-label text-xs uppercase tracking-[0.32em]" style={{ color: 'var(--color-maroon)' }}>
          Join us for
        </p>
        <h2 className="font-script mt-1 text-[clamp(3rem,7vw,4.4rem)] leading-tight" style={{ color: 'var(--color-maroon-deep)' }}>
          The Celebrations
        </h2>
        <p className="mx-auto mt-3 max-w-lg italic" style={{ color: 'var(--color-ink-soft)' }}>
          {visibleEvents.length === 1 
            ? 'A beautiful day of celebration in Kerala \u2014 we would love for you to be part of it.'
            : 'Multiple days of celebration across Kerala \u2014 we would love for you to be part of them.'}
        </p>
      </Reveal>

      <div className="relative">
        <div
          className="absolute bottom-2 left-[27px] top-2 hidden w-px sm:left-1/2 sm:block"
          style={{ background: 'linear-gradient(180deg, transparent, var(--color-gold), transparent)' }}
        />
        <div className="flex flex-col gap-6 sm:gap-0">
          {visibleEvents.map((ev, i) => (
            <Reveal key={ev.key} delay={i * 0.08} className={`sm:flex ${i % 2 === 0 ? 'sm:justify-start' : 'sm:justify-end'}`}>
              <div
                className={`relative flex gap-5 rounded-xl px-5 py-5 sm:w-[calc(50%-2.5rem)] sm:py-6 ${
                  i % 2 === 0 ? 'sm:flex-row-reverse sm:text-right' : ''
                }`}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.035)',
                  border: '1px solid rgba(203,162,77,0.22)',
                  boxShadow: '0 14px 40px rgba(12,6,16,0.35)',
                }}
              >
                <motion.div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border"
                  style={{ borderColor: 'var(--color-gold)', backgroundColor: 'rgba(203,162,77,0.10)', color: 'var(--color-gold-bright)' }}
                  whileHover={{ scale: 1.08 }}
                >
                  <span className="h-6 w-6">{ICONS[ev.key]}</span>
                </motion.div>
                <div>
                  <p className="font-label text-[0.68rem] uppercase tracking-[0.22em]" style={{ color: 'var(--color-gold-bright)' }}>
                    {ev.dayLabel}
                  </p>
                  <h3 className="font-script text-4xl leading-tight" style={{ color: 'var(--color-maroon-deep)' }}>
                    {ev.label}
                  </h3>
                  <p className="mt-1 font-semibold" style={{ color: 'var(--color-ink)' }}>
                    {ev.timeLabel}
                  </p>
                  <p style={{ color: 'var(--color-ink-soft)' }}>{ev.venueName}</p>
                  {(ev.mapQuery || ev.extraLink) && (
                    <div className={`mt-2 flex flex-wrap gap-4 ${i % 2 === 0 ? 'sm:justify-end' : ''}`}>
                      {ev.extraLink && (
                        <a
                          href={ev.extraLink.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-label border-b pb-0.5 text-[0.65rem] uppercase tracking-[0.14em]"
                          style={{ color: 'var(--color-maroon)', borderColor: 'var(--color-gold)' }}
                        >
                          {ev.extraLink.label}
                        </a>
                      )}
                      {ev.mapQuery && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.mapQuery)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-label border-b pb-0.5 text-[0.65rem] uppercase tracking-[0.14em]"
                          style={{ color: 'var(--color-maroon)', borderColor: 'var(--color-gold)' }}
                        >
                          Get Directions
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {visibleEvents.length < EVENTS.length && (
        <Reveal className="mt-10 text-center italic" delay={0.1}>
          <p style={{ color: 'var(--color-ink-soft)' }}>
            We've highlighted the celebrations we'd love for you to join — see you there!
          </p>
        </Reveal>
      )}
    </section>
  );
}
