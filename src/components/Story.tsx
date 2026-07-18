import Reveal from './Reveal';

export default function Story() {
  return (
    <section id="story" className="mx-auto max-w-[1100px] px-5 py-20 text-center">
      <Reveal className="mb-4 flex items-center justify-center gap-3">
        <span className="h-px flex-1 max-w-24" style={{ background: 'linear-gradient(90deg, transparent, var(--color-gold))' }} />
        <svg viewBox="0 0 24 24" className="h-6 w-6" style={{ color: 'var(--color-gold)' }}>
          <path
            d="M12 2c1 3-3 4-3 8a3 3 0 0 0 6 0c0-1-0.5-2-1-2.5 1.5 1 2.5 3 2.5 5a4.5 4.5 0 0 1-9 0C7.5 8.5 11 6.5 12 2Z"
            fill="currentColor"
          />
        </svg>
        <span className="h-px flex-1 max-w-24" style={{ background: 'linear-gradient(90deg, var(--color-gold), transparent)' }} />
      </Reveal>

      <Reveal delay={0.1} className="mb-8">
        <p className="font-label text-xs uppercase tracking-[0.32em]" style={{ color: 'var(--color-maroon)' }}>
          How it began
        </p>
        <h2 className="font-script mt-1 text-[clamp(3rem,7vw,4.4rem)] leading-tight" style={{ color: 'var(--color-maroon-deep)' }}>
          Our Story
        </h2>
      </Reveal>

      {/* ponytail: placeholder copy — swap in the real story whenever it's ready */}
      <Reveal delay={0.2}>
        <p className="mx-auto max-w-xl text-xl italic" style={{ color: 'var(--color-ink-soft)' }}>
          Every love story is beautiful, but ours is our favourite. From a chance beginning to building a
          life together — this is where we'll share how Keerthy and Abhijith's journey unfolded.{' '}
          <em>(Full story coming soon.)</em>
        </p>
      </Reveal>
    </section>
  );
}
