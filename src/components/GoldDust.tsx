import { useMemo } from 'react';
import { motion } from 'motion/react';

interface Speck {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  bright: boolean;
}

// top-biased: most specks cluster in the upper third (like the "Shimmer Dust"
// reference), thinning out lower down.
function makeSpecks(count: number): Speck[] {
  return Array.from({ length: count }, (_, id) => {
    const size = 1 + Math.random() * 3.5;
    return {
      id,
      left: Math.random() * 100,
      top: Math.pow(Math.random(), 1.8) * 100,
      size,
      duration: 2.4 + Math.random() * 4,
      delay: Math.random() * 5,
      bright: size > 3,
    };
  });
}

// ponytail: decorative gold shimmer-dust, aria-hidden. Static specks that
// twinkle in place; larger ones glow brighter. Add scroll parallax only if it
// ever looks flat.
export default function GoldDust({ count = 90 }: { count?: number }) {
  const specks = useMemo(() => makeSpecks(count), [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {specks.map((s) => (
        <motion.span
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            backgroundColor: s.bright ? '#f6e6b0' : 'var(--color-gold-bright)',
            boxShadow: s.bright
              ? '0 0 7px 1px rgba(246,230,176,0.85)'
              : '0 0 4px rgba(232,205,130,0.7)',
          }}
          animate={{ opacity: [0, s.bright ? 1 : 0.85, 0], scale: [0.6, 1, 0.6] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}
