import Reveal from './Reveal';

// Paste your RSVP form link here (Google Form, Typeform, etc.). The button
// below opens it in a new tab. Until it's set, the button is disabled.
const RSVP_URL = '';

export default function RSVP() {
  const ready = RSVP_URL.length > 0;

  return (
    <section id="rsvp" className="mx-auto max-w-[1100px] px-5 py-24 text-center">
      <Reveal className="mb-6">
        <p className="font-label text-xs uppercase tracking-[0.32em]" style={{ color: 'var(--color-maroon)' }}>
          Kindly respond
        </p>
        <h2 className="font-script mt-1 text-[clamp(2.8rem,7vw,4rem)]" style={{ color: 'var(--color-maroon-deep)' }}>
          RSVP
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="mx-auto mb-8 max-w-md text-lg italic" style={{ color: 'var(--color-ink-soft)' }}>
          We would be honoured to have you with us. Please let us know if you can make it.
        </p>

        <a
          href={ready ? RSVP_URL : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!ready}
          onClick={(e) => { if (!ready) e.preventDefault(); }}
          className="font-label inline-block rounded-full px-10 py-4 text-[0.72rem] uppercase tracking-[0.24em] transition-transform hover:scale-[1.03]"
          style={{
            backgroundColor: 'var(--color-gold)',
            color: '#2a1533',
            boxShadow: '0 12px 34px rgba(203,162,77,0.28)',
            opacity: ready ? 1 : 0.55,
            cursor: ready ? 'pointer' : 'not-allowed',
          }}
        >
          RSVP · Click Here
        </a>

        {!ready && (
          <p className="mt-3 text-sm italic" style={{ color: 'var(--color-ink-soft)' }}>
            (Add your form link in <code>src/components/RSVP.tsx</code> to activate this button.)
          </p>
        )}
      </Reveal>

      <Reveal delay={0.2} className="mt-8">
        <p className="italic" style={{ color: 'var(--color-ink-soft)' }}>
          Prefer to reply directly? Call or WhatsApp Abhijith at{' '}
          <a href="tel:+917824065488" style={{ color: 'var(--color-maroon)' }}>
            +91 78240 65488
          </a>
          .
        </p>
      </Reveal>
    </section>
  );
}
