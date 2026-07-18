import { useState } from 'react';
import { motion } from 'motion/react';
import GoldDust from './GoldDust';

const REDUCE_MOTION =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

type Phase = 'closed' | 'loosening' | 'opening' | 'done';

// Classic heart outline (24x24 space), tip at (12,21), top dip at (12,6.5).
// Scaled + translated in the SVG so the tip rests on the thread.
const HEART =
  'M12 21 C12 21 3 13.5 3 8.5 C3 5.5 5.5 4 8 4 C10 4 11.5 5.5 12 6.5 C12.5 5.5 14 4 16 4 C18.5 4 21 5.5 21 8.5 C21 13.5 12 21 12 21 Z';

export default function DoorIntro() {
  const [phase, setPhase] = useState<Phase>(REDUCE_MOTION ? 'done' : 'closed');

  if (phase === 'done') return null;

  const opening = phase === 'opening';
  const loosening = phase === 'loosening' || opening;

  function untie() {
    if (loosening) return;
    setPhase('loosening');
    window.setTimeout(() => setPhase('opening'), 1000);
  }

  return (
    // Plain (non-animated) fixed cover so it paints opaque on the very first
    // frame — no flash of the page underneath. The reveal is a CSS opacity
    // transition; only the knot itself uses motion.
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-2 overflow-y-auto px-6 py-8 text-center"
      style={{
        background:
          'radial-gradient(120% 90% at 50% 20%, #3a1f42 0%, #241029 48%, #160b1a 100%)',
        opacity: opening ? 0 : 1,
        transform: opening ? 'scale(1.04)' : 'none',
        transition: 'opacity 1s ease, transform 1.2s ease',
        pointerEvents: opening ? 'none' : 'auto',
      }}
      onTransitionEnd={(e) => {
        if (opening && e.propertyName === 'opacity') setPhase('done');
      }}
      aria-hidden={opening}
    >
      <GoldDust count={30} />

      <motion.div
        className="relative z-10 flex w-full max-w-[440px] flex-col items-center"
        animate={{ opacity: loosening ? 0.15 : 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.span
          className="font-label mb-4 text-[0.66rem] uppercase tracking-[0.34em]"
          style={{ color: 'var(--color-gold-bright)' }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          Together with their families
        </motion.span>

        {/* Duotone purple/white portrait */}
        <motion.div
          className="relative aspect-[7/5] w-[min(380px,74vw)] overflow-hidden rounded-sm"
          style={{ outline: '1px solid rgba(232,205,130,0.55)', outlineOffset: '7px', boxShadow: '0 24px 70px rgba(10,4,12,0.6)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <img src={`${import.meta.env.BASE_URL}img/couple-portrait.jpg`} alt="Keerthy and Abhijith" className="h-full w-full object-cover" />
        </motion.div>

        <motion.h1
          className="font-script mt-5 text-[clamp(2.8rem,10vw,4.4rem)] leading-[0.95]"
          style={{ color: 'var(--color-ivory)' }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          Keerthy <span style={{ color: 'var(--color-gold-bright)' }}>&amp;</span> Abhijith
        </motion.h1>

        <motion.p
          className="font-label mt-3 text-[0.66rem] uppercase tracking-[0.28em]"
          style={{ color: 'rgba(236,217,171,0.85)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.7 }}
        >
          10 &ndash; 13 December 2026 &middot; Kerala
        </motion.p>
      </motion.div>

      {/* Heart love-knot on a thread */}
      <motion.button
        type="button"
        onClick={untie}
        disabled={loosening}
        className="relative z-10 mt-5 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.7 }}
      >
        <svg viewBox="0 0 240 96" className="h-14 w-[min(320px,78vw)]" fill="none" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="knotGold" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#b78b2f" />
              <stop offset="50%" stopColor="#f6e6b0" />
              <stop offset="100%" stopColor="#b78b2f" />
            </linearGradient>
          </defs>

          {/* the straight thread — brightens as the knot lets go */}
          <motion.line
            x1={14}
            y1={72}
            x2={226}
            y2={72}
            stroke="url(#knotGold)"
            strokeWidth={2}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: loosening ? 1 : 0.45 }}
            transition={{ pathLength: { delay: 1.3, duration: 1.1 }, opacity: { duration: 0.6 } }}
          />

          {/* the heart knot — draws in on load, unravels away on untie */}
          <motion.path
            d={HEART}
            transform="translate(84 8) scale(3)"
            stroke="url(#knotGold)"
            strokeWidth={0.85}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: loosening ? 0 : 1, opacity: loosening ? 0 : 1 }}
            transition={{
              pathLength: loosening
                ? { duration: 0.85, ease: [0.76, 0, 0.24, 1] }
                : { delay: 1.4, duration: 1.5, ease: [0.16, 1, 0.3, 1] },
              opacity: loosening ? { duration: 0.85 } : { delay: 1.4, duration: 0.5 },
            }}
            style={{ filter: 'drop-shadow(0 0 5px rgba(232,205,130,0.5))' }}
          />
        </svg>

        <motion.span
          className="font-label text-[0.6rem] uppercase tracking-[0.32em]"
          style={{ color: 'rgba(236,217,171,0.75)' }}
          animate={{ opacity: loosening ? 0 : [0.5, 1, 0.5] }}
          transition={loosening ? { duration: 0.3 } : { duration: 2.6, repeat: Infinity }}
        >
          {loosening ? 'Untying…' : 'Tap to untie the knot'}
        </motion.span>
      </motion.button>
    </div>
  );
}
