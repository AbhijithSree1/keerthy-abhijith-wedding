import { useState } from 'react';
import Reveal from './Reveal';

// Replace with the real one before sending links
const UPI_ID = 'keerthyhemaprakash-3@oksbi';

export default function Registry() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(UPI_ID);
    } catch {
      window.prompt('Copy this:', UPI_ID);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section id="registry" className="mx-auto max-w-[1100px] px-5 py-20">
      <Reveal>
        <div
          className="relative overflow-hidden rounded px-6 py-14 text-center sm:px-12"
          style={{ backgroundColor: 'var(--color-plum)', color: 'var(--color-ivory)' }}
        >
          <div
            className="pointer-events-none absolute inset-[10px] border"
            style={{ borderColor: 'rgba(228,197,103,0.5)' }}
          />
          <p className="font-label text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--color-gold-bright)' }}>
            A small note
          </p>
          <h2 className="font-script mt-1 text-[clamp(2.6rem,6vw,3.6rem)]" style={{ color: 'var(--color-gold-bright)' }}>
            Blessings &amp; Wishes
          </h2>
          <p className="mx-auto mt-4 max-w-xl" style={{ color: 'rgba(251,244,230,0.85)' }}>
            Your presence at our celebration itself is a gift for us. If you'd still like to send
            something our way, we're saving up for our first big trip together as a married couple — a
            contribution to the honeymoon fund would mean the world.
          </p>
          <div
            className="mx-auto mt-8 inline-flex flex-wrap items-center justify-center gap-4 rounded border px-6 py-4"
            style={{ backgroundColor: 'rgba(251,244,230,0.08)', borderColor: 'rgba(228,197,103,0.4)' }}
          >
            <code className="text-lg tracking-wide">UPI: {UPI_ID}</code>
            <button
              type="button"
              onClick={copy}
              className="font-label rounded px-4 py-2 text-[0.62rem] uppercase tracking-[0.14em]"
              style={{ backgroundColor: copied ? 'var(--color-gold-bright)' : 'var(--color-gold)', color: '#2a1533' }}
            >
              {copied ? 'Copied!' : 'Copy UPI ID'}
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
