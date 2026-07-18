import { useState, type ReactNode } from 'react';
import { motion } from 'motion/react';

export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  // Once the entrance animation finishes, drop back to a plain <div>. Framer's
  // animated element keeps a `transform` (GPU layer) that makes images render
  // from a downsampled texture — "sharp on load, grainy after". A plain div has
  // no transform, so images/gradients re-render at full resolution.
  const [done, setDone] = useState(false);

  if (done) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={() => setDone(true)}
    >
      {children}
    </motion.div>
  );
}
