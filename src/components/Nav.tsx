import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const LINKS = [
  { href: '#events', label: 'Celebrations' },
  { href: '#story', label: 'Our Story' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#rsvp', label: 'RSVP' },
  { href: '#registry', label: 'Registry' },
  { href: '#travel', label: 'Travel' },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-30 flex items-center justify-between border-b px-6 py-4 backdrop-blur-md sm:px-10"
      style={{ borderColor: 'rgba(232,205,130,0.22)', backgroundColor: 'rgba(28,15,34,0.72)' }}
    >
      <span className="font-label tracking-[0.15em]" style={{ color: 'var(--color-gold-bright)' }}>
        K &amp; A
      </span>

      <ul className="hidden gap-6 font-label text-[0.68rem] uppercase tracking-[0.15em] sm:flex">
        {LINKS.map((l) => (
          <li key={l.href}>
            <a href={l.href} className="transition-colors" style={{ color: 'rgba(236,217,171,0.82)' }}>
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="flex flex-col gap-1.5 sm:hidden"
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
      >
        <motion.span
          className="h-px w-6"
          style={{ backgroundColor: 'var(--color-gold-bright)' }}
          animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 4 : 0 }}
        />
        <motion.span
          className="h-px w-6"
          style={{ backgroundColor: 'var(--color-gold-bright)' }}
          animate={{ opacity: menuOpen ? 0 : 1 }}
        />
        <motion.span
          className="h-px w-6"
          style={{ backgroundColor: 'var(--color-gold-bright)' }}
          animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -4 : 0 }}
        />
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.ul
            className="absolute left-0 right-0 top-full flex flex-col gap-4 border-b px-6 py-6 font-label text-xs uppercase tracking-[0.2em] backdrop-blur-md sm:hidden"
            style={{ backgroundColor: 'rgba(28,15,34,0.92)', borderColor: 'rgba(232,205,130,0.22)' }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setMenuOpen(false)} style={{ color: 'rgba(236,217,171,0.85)' }}>
                  {l.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
}
