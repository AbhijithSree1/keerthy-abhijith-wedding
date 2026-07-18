import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Reveal from './Reveal';

const PHOTOS = Array.from({ length: 27 }, (_, i) => `${import.meta.env.BASE_URL}img/engagement-${String(i + 1).padStart(2, '0')}.jpg`);

export default function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(10);

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(() => setIndex((i) => (i === null ? i : (i - 1 + PHOTOS.length) % PHOTOS.length)), []);
  const next = useCallback(() => setIndex((i) => (i === null ? i : (i + 1) % PHOTOS.length)), []);

  useEffect(() => {
    if (index === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, close, prev, next]);

  return (
    <section id="gallery" className="mx-auto max-w-[1100px] px-5 py-20">
      <Reveal className="mb-10 text-center">
        <p className="font-label text-xs uppercase tracking-[0.32em]" style={{ color: 'var(--color-maroon)' }}>
          A few favourites
        </p>
        <h2 className="font-script mt-1 text-[clamp(3rem,7vw,4.4rem)] leading-tight" style={{ color: 'var(--color-maroon-deep)' }}>
          Gallery
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {PHOTOS.slice(0, visibleCount).map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`View photo ${i + 1}`}
              className="aspect-[4/5] overflow-hidden rounded-sm outline outline-1"
              style={{ outlineColor: 'var(--color-ivory-deep)' }}
            >
              <motion.img
                src={src}
                alt={`Engagement photo ${i + 1}`}
                className="h-full w-full object-cover"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.5 }}
              />
            </button>
          ))}
        </div>
        {visibleCount < PHOTOS.length && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 10)}
              className="rounded-full px-8 py-3 text-sm font-medium uppercase tracking-widest transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--color-gold)', color: '#2a1533' }}
            >
              Show More
            </button>
          </div>
        )}
      </Reveal>

      <AnimatePresence>
        {index !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ backgroundColor: 'rgba(42,24,16,0.88)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 md:right-8 md:top-8 flex h-10 w-10 items-center justify-center rounded-full z-10 transition-transform hover:scale-105"
              style={{ backgroundColor: 'var(--color-gold)', color: '#2a1533' }}
            >
              ✕
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous"
              className="absolute left-4 md:left-8 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border text-xl z-10 transition-transform hover:scale-105"
              style={{ backgroundColor: 'var(--color-plum)', borderColor: 'var(--color-gold)', color: 'var(--color-gold-bright)' }}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next"
              className="absolute right-4 md:right-8 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border text-xl z-10 transition-transform hover:scale-105"
              style={{ backgroundColor: 'var(--color-plum)', borderColor: 'var(--color-gold)', color: 'var(--color-gold-bright)' }}
            >
              ›
            </button>

            <motion.div
              className="relative flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={index}
                  src={PHOTOS[index]}
                  alt={`Enlarged photo ${index + 1}`}
                  className="max-h-[84vh] max-w-[90vw] border-4"
                  style={{ borderColor: 'var(--color-ivory)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
