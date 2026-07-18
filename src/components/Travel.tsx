import Reveal from './Reveal';

// Swap these for venue/Kerala photos when you have them — just change the paths.
const STRIP = [`${import.meta.env.BASE_URL}img/engagement-03.jpg`, `${import.meta.env.BASE_URL}img/engagement-06.jpg`, `${import.meta.env.BASE_URL}img/engagement-09.jpg`];

const CARDS = [
  {
    title: 'By Air',
    body: 'Trivandrum International Airport (TRV) and Cochin International Airport (COK) are the nearest gateways — details on the best option for each venue coming soon.',
  },
  {
    title: 'Where to Stay',
    body: 'A curated list of nearby hotels and homestays will be shared here closer to the date.',
  },
  {
    title: 'Any Questions',
    body: null,
  },
];

export default function Travel() {
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
                  <a href="tel:+917824065488" style={{ color: 'var(--color-maroon)' }}>
                    +91 78240 65488
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
          {STRIP.map((src, i) => (
            <div key={src} className="aspect-[4/5] overflow-hidden rounded-sm outline outline-1" style={{ outlineColor: 'var(--color-ivory-deep)' }}>
              <img src={src} alt={`Kerala ${i + 1}`} loading="lazy" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
