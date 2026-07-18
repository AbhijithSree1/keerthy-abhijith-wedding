import { useMemo } from 'react';
import { motion } from 'motion/react';

interface Petal {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  hue: 'gold' | 'maroon';
}

function makePetals(count: number): Petal[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    left: Math.random() * 100,
    size: 6 + Math.random() * 8,
    duration: 10 + Math.random() * 10,
    delay: Math.random() * 10,
    hue: Math.random() > 0.5 ? 'gold' : 'maroon',
  }));
}

// ponytail: decorative only, aria-hidden — count kept low (14) to stay
// gentle rather than a distracting "confetti" effect.
export default function FloatingPetals() {
  const petals = useMemo(() => makePetals(14), []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {petals.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-[60%_0]"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            top: -20,
            backgroundColor: p.hue === 'gold' ? 'var(--color-gold-bright)' : 'var(--color-maroon)',
            opacity: 0.35,
          }}
          animate={{ y: ['0vh', '110vh'], rotate: [0, 180] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
}
