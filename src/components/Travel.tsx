import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Reveal from './Reveal';

const TOTAL_PHOTOS = 13;

function getRandomPhotos(count: number): string[] {
  const selected = new Set<number>();
  while (selected.size < count) {
    selected.add(Math.floor(Math.random() * TOTAL_PHOTOS) + 1);
  }
  return Array.from(selected).map(
    (num) => `${import.meta.env.BASE_URL}img/engagement-${String(num).padStart(2, '0')}.jpg`
  );
}

const CARDS = [
  {
    title: 'By Air',
    body: 'The nearest airports are Trivandrum International (TRV, ~3 hrs from Thiruvalla) and Cochin International (COK, ~2.5 hrs). Taxis and pre-paid cabs are available from both airports.',
  },
  {
    title: 'Where to Stay',
    body: 'Hotels and homestays are available in Thiruvalla and Varkala. We recommend booking early as December is peak season in Kerala. Reach out to us and we can help you find the perfect place.',
  },
  {
    title: 'Any Questions',
    body: null,
  },
];

export default function Travel() {
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    // Initial random photos
    setPhotos(getRandomPhotos(3));
    
    // Change them every 4 seconds
    const interval = setInterval(() => {
      setPhotos(getRandomPhotos(3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="travel" className="mx-auto max-w-[1100px] px-5 py-20">
      <Reveal className="mb-12 text-center">
        <p className="font-label text-xs uppercase tracking-[0.32em]" style={{ color: 'var(--color-maroon)' }}>
          Getting here
        </p>
        <h2 className="font-script mt-1 text-[clamp(3rem,7vw,4.4rem)] leading-tight" style={{ color: 'var(--color-maroon-deep)' }}>
          Travel &amp; Stay
        </h2>
      </Reveal>

      <div className="grid gap-8 text-center sm:grid-cols-3">
        {CARDS.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.1}>
            <h3 className="font-script text-3xl" style={{ color: 'var(--color-maroon-deep)' }}>
              {c.title}
            </h3>
            <p className="mt-2" style={{ color: 'var(--color-ink-soft)' }}>
              {c.body ?? (
                <>
                  Call or WhatsApp Abhijith Sreekumar at{' '}
                  <a href="tel:+916282529966" style={{ color: 'var(--color-maroon)' }}>
                    +91 62825 29966
                  </a>
                  .
                </>
              )}
            </p>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.15}>
        <div className="mt-14 grid grid-cols-3 gap-3">
          {photos.length > 0 && photos.map((src, i) => (
            <div key={i} className="relative aspect-[4/5] overflow-hidden rounded-sm outline outline-1 bg-black/5" style={{ outlineColor: 'var(--color-ivory-deep)' }}>
              <AnimatePresence>
                <motion.img
                  key={src}
                  src={src}
                  alt={`Kerala ${i + 1}`}
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                />
              </AnimatePresence>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
