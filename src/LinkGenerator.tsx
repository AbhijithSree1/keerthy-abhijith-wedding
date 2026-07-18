import { useMemo, useState } from 'react';
import { EVENTS, type EventKey } from './data/events';

export default function LinkGenerator() {
  const [name, setName] = useState('');
  const [checked, setChecked] = useState<Record<EventKey, boolean>>(
    Object.fromEntries(EVENTS.map((e) => [e.key, true])) as Record<EventKey, boolean>,
  );
  const [copied, setCopied] = useState(false);

  const chosen = EVENTS.filter((e) => checked[e.key]).map((e) => e.key);

  const link = useMemo(() => {
    if (!chosen.length) return '';
    const base = `${window.location.origin}${window.location.pathname}#/`;
    const params = new URLSearchParams();
    if (name.trim()) params.set('to', name.trim());
    if (chosen.length > 0) {
      // Obfuscate the parameter so users don't easily tamper with it
      params.set('invite', btoa(chosen.join(',')));
    }
    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
  }, [name, chosen]);

  async function copy() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      window.prompt('Copy this:', link);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="min-h-screen px-5 py-16" style={{ backgroundColor: 'var(--color-ivory)' }}>
      <div className="kasavu-frame" aria-hidden="true" />
      <div className="mx-auto max-w-xl">
        <p className="font-label text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--color-maroon)' }}>
          Private tool — don't share this page itself
        </p>
        <h1 className="font-display mt-2 text-3xl italic" style={{ color: 'var(--color-maroon-deep)' }}>
          Guest Link Generator
        </h1>
        <p className="mt-2" style={{ color: 'var(--color-ink-soft)' }}>
          Pick who's invited to what, then copy their personal link.
        </p>

        <label className="font-label mt-8 block text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--color-maroon)' }}>
          Guest / family name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. The Menon Family"
          className="mt-2 w-full rounded border bg-white px-4 py-3 text-lg"
          style={{ borderColor: 'var(--color-ivory-deep)' }}
        />

        <p className="font-label mt-6 block text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--color-maroon)' }}>
          Invited to
        </p>
        <div className="mt-3 flex flex-wrap gap-4">
          {EVENTS.map((e) => (
            <label key={e.key} className="flex items-center gap-2 text-lg">
              <input
                type="checkbox"
                checked={checked[e.key]}
                onChange={(ev) => setChecked((c) => ({ ...c, [e.key]: ev.target.checked }))}
              />
              {e.label}
            </label>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <input
            type="text"
            readOnly
            value={chosen.length ? link : 'Select at least one event'}
            className="min-w-[240px] flex-1 rounded border bg-white px-4 py-3"
            style={{ borderColor: 'var(--color-ivory-deep)' }}
          />
          <button
            type="button"
            onClick={copy}
            disabled={!chosen.length}
            className="font-label rounded px-5 py-3 text-xs uppercase tracking-[0.14em] disabled:opacity-40"
            style={{ backgroundColor: copied ? 'var(--color-gold-bright)' : 'var(--color-gold)', color: 'var(--color-maroon-deep)' }}
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>
    </div>
  );
}
