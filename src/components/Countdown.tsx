import { motion, AnimatePresence } from 'motion/react';
import { useCountdown } from '../hooks/useCountdown';

function Digit({ value }: { value: string }) {
  return (
    <span className="relative inline-block h-[1em] w-[0.62em] overflow-hidden align-top">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          className="absolute inset-0"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Cell({ value, unit }: { value: number; unit: string }) {
  const digits = String(value).padStart(2, '0').split('');
  return (
    <div className="flex min-w-[62px] flex-col items-center">
      <span
        className="font-body text-4xl font-semibold tabular-nums sm:text-5xl"
        style={{ color: 'var(--color-champagne)' }}
      >
        {digits.map((d, i) => (
          <Digit key={i} value={d} />
        ))}
      </span>
      <span
        className="font-label mt-1 text-[0.62rem] uppercase tracking-[0.18em]"
        style={{ color: 'var(--color-gold-bright)' }}
      >
        {unit}
      </span>
    </div>
  );
}

export default function Countdown({ target }: { target: Date }) {
  const { days, hours, mins, secs } = useCountdown(target);

  return (
    <div className="flex gap-4 sm:gap-8" aria-label="Countdown to the celebrations">
      <Cell value={days} unit="Days" />
      <Cell value={hours} unit="Hours" />
      <Cell value={mins} unit="Mins" />
      <Cell value={secs} unit="Secs" />
    </div>
  );
}
