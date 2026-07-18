import { useState } from 'react';
import Reveal from './Reveal';

export default function RSVP() {
  const [formData, setFormData] = useState({
    name: '',
    attending: 'yes',
    guests: 1,
    dietary: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch('https://formspree.io/f/mzdnrdlz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <section id="rsvp" className="mx-auto max-w-[800px] px-5 py-24 text-center">
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

        {status === 'success' ? (
          <div className="mx-auto max-w-md rounded-xl p-8" style={{ backgroundColor: 'var(--color-gold)', color: '#2a1533' }}>
            <h3 className="mb-2 text-2xl font-medium">Thank You!</h3>
            <p>Your RSVP has been successfully received.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-5 text-left">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium" style={{ color: 'var(--color-ink)' }}>Full Name</label>
              <input
                type="text"
                id="name"
                required
                className="w-full rounded-md border p-3 outline-none transition-colors"
                style={{ borderColor: 'var(--color-ivory-deep)' }}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--color-ink)' }}>Will you attend?</label>
              <div className="flex gap-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="attending"
                    value="yes"
                    checked={formData.attending === 'yes'}
                    onChange={(e) => setFormData({ ...formData, attending: e.target.value })}
                    className="h-4 w-4 accent-[var(--color-gold)]"
                  />
                  <span>Yes, gladly</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="attending"
                    value="no"
                    checked={formData.attending === 'no'}
                    onChange={(e) => setFormData({ ...formData, attending: e.target.value })}
                    className="h-4 w-4 accent-[var(--color-gold)]"
                  />
                  <span>No, sadly</span>
                </label>
              </div>
            </div>

            {formData.attending === 'yes' && (
              <Reveal>
                <label htmlFor="guests" className="mb-1 block text-sm font-medium" style={{ color: 'var(--color-ink)' }}>Number of Guests (including yourself)</label>
                <input
                  type="number"
                  id="guests"
                  min="1"
                  max="10"
                  required={formData.attending === 'yes'}
                  className="w-full rounded-md border p-3 outline-none transition-colors"
                  style={{ borderColor: 'var(--color-ivory-deep)' }}
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) || 1 })}
                />
              </Reveal>
            )}

            <div>
              <label htmlFor="dietary" className="mb-1 block text-sm font-medium" style={{ color: 'var(--color-ink)' }}>Dietary Requirements / Message</label>
              <textarea
                id="dietary"
                rows={3}
                className="w-full rounded-md border p-3 outline-none transition-colors"
                style={{ borderColor: 'var(--color-ivory-deep)' }}
                value={formData.dietary}
                onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
              />
            </div>

            {status === 'error' && (
              <p className="text-sm text-red-600">Failed to submit RSVP. Please try again or contact us directly.</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="font-label mt-4 inline-block w-full rounded-full px-10 py-4 text-[0.72rem] uppercase tracking-[0.24em] transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                backgroundColor: 'var(--color-gold)',
                color: '#2a1533',
                boxShadow: '0 12px 34px rgba(203,162,77,0.28)',
              }}
            >
              {status === 'loading' ? 'Submitting...' : 'Submit RSVP'}
            </button>
          </form>
        )}
      </Reveal>

      <Reveal delay={0.2} className="mt-12">
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
