import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import GoldDust from './GoldDust';

export default function Hero({ greeting }: { greeting: string; target: Date }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-4 py-16 text-center"
      style={{
        background:
          'radial-gradient(120% 80% at 50% 8%, #4a2a58 0%, #2a1533 46%, #1c0f22 100%)',
      }}
    >
      <GoldDust count={110} />

      <motion.div style={{ opacity: contentOpacity }} className="relative z-10 flex flex-col items-center">
        <motion.p
          className="mb-2 font-body italic"
          style={{ color: 'rgba(243,236,223,0.72)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {greeting}
        </motion.p>

        <motion.p
          className="font-label mb-4 text-[0.7rem] uppercase tracking-[0.34em]"
          style={{ color: 'var(--color-gold-bright)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Request the honour of your presence
        </motion.p>

        <motion.h1
          className="font-script text-[clamp(3.6rem,15vw,7rem)] leading-[0.95]"
          style={{ color: 'var(--color-ivory)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          Keerthy <span style={{ color: 'var(--color-gold-bright)' }}>&amp;</span> Abhijith
        </motion.h1>

        {/* slim gold divider with a centre diamond */}
        <motion.div
          className="mt-5 flex items-center gap-3"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.9, duration: 0.7 }}
        >
          <span className="h-px w-16 sm:w-28" style={{ background: 'linear-gradient(90deg, transparent, var(--color-gold-bright))' }} />
          <span style={{ color: 'var(--color-gold-bright)' }}>&#10070;</span>
          <span className="h-px w-16 sm:w-28" style={{ background: 'linear-gradient(90deg, var(--color-gold-bright), transparent)' }} />
        </motion.div>

        <motion.p
          className="mt-6 text-xl tracking-wide"
          style={{ color: 'rgba(243,236,223,0.92)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <strong style={{ color: 'var(--color-champagne)', fontWeight: 600 }}>10 &ndash; 13 December 2026</strong> &middot; Kerala
        </motion.p>
      </motion.div>

      <motion.a
        href="#events"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="font-label absolute bottom-8 left-1/2 -translate-x-1/2 text-[0.7rem] uppercase tracking-[0.24em]"
        style={{ color: 'var(--color-gold-bright)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{ opacity: { delay: 1.4, duration: 0.6 }, y: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } }}
      >
        Scroll &darr;
      </motion.a>
    </section>
  );
}
