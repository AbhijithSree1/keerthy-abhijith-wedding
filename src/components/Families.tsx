import Reveal from './Reveal';
import { BRIDE, GROOM, type Family } from '../data/families';

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

function Side({ family, delay }: { family: Family; delay: number }) {
  return (
    <Reveal delay={delay} className="flex-1 text-center">
      <p className="font-script text-[clamp(2.2rem,5vw,3rem)] leading-tight" style={{ color: 'var(--color-gold-bright)' }}>
        {family.name}
      </p>
      <p className="mt-1 text-lg italic" style={{ color: 'var(--color-ink-soft)' }}>
        {family.relation}
      </p>
      <p className="mt-3 text-xl" style={{ color: 'var(--color-ivory)' }}>
        {family.parents}
      </p>
      <p className="mt-3 text-lg italic" style={{ color: 'var(--color-champagne)' }}>
        {family.house}
      </p>
      <a
        href={telHref(family.phone)}
        className="font-label mt-2 inline-block text-sm tracking-[0.12em] transition-colors"
        style={{ color: 'var(--color-lavender)' }}
      >
        {family.phone}
      </a>
    </Reveal>
  );
}

export default function Families() {
  return (
    <section id="families" className="mx-auto max-w-[1100px] px-5 py-20">
      <Reveal className="mb-12 text-center">
        <p className="font-label text-xs uppercase tracking-[0.32em]" style={{ color: 'var(--color-maroon)' }}>
          Together with their families
        </p>
        <h2 className="font-script mt-1 text-[clamp(3rem,7vw,4.4rem)] leading-tight" style={{ color: 'var(--color-maroon-deep)' }}>
          At the marriage of
        </h2>
      </Reveal>

      <div className="flex flex-col items-center gap-10 sm:flex-row sm:items-start sm:gap-6">
        <Side family={BRIDE} delay={0.1} />

        <Reveal delay={0.15} className="font-script text-4xl sm:pt-6" >
          <span style={{ color: 'var(--color-gold-bright)' }}>&amp;</span>
        </Reveal>

        <Side family={GROOM} delay={0.2} />
      </div>
    </section>
  );
}
