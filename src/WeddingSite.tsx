import { useMemo } from 'react';
import DoorIntro from './components/DoorIntro';
import Nav from './components/Nav';
import Hero from './components/Hero';
import EventsTimeline from './components/EventsTimeline';
import Story from './components/Story';
import Gallery from './components/Gallery';
import Registry from './components/Registry';
import RSVP from './components/RSVP';
import Travel from './components/Travel';
import Countdown from './components/Countdown';
import Reveal from './components/Reveal';
import Footer from './components/Footer';
import { useGuestSelection } from './hooks/useGuestSelection';
import { EVENTS } from './data/events';

export default function WeddingSite() {
  const { to, events } = useGuestSelection();
  const greeting = to ? `Dear ${to},` : 'Dear Family & Friends,';

  const countdownTarget = useMemo(() => {
    const dates = EVENTS.filter((e) => events.includes(e.key)).map((e) => new Date(e.date));
    if (!dates.length) return new Date(EVENTS.find((e) => e.key === 'wedding')!.date);
    return new Date(Math.min(...dates.map((d) => d.getTime())));
  }, [events]);

  return (
    <>
      <DoorIntro events={events} />
      <Nav />
      <main>
        <Hero greeting={greeting} events={events} />
        <EventsTimeline visible={events} />
        <Story />
        <Gallery />
        <Registry />
        <RSVP visible={events} />
        <Travel />

        <section className="mx-auto max-w-[1100px] px-5 pb-24 pt-8 text-center">
          <Reveal className="mb-8">
            <p className="font-label text-xs uppercase tracking-[0.32em]" style={{ color: 'var(--color-maroon)' }}>
              The wait
            </p>
            <h2 className="font-script mt-1 text-[clamp(2.8rem,7vw,4rem)]" style={{ color: 'var(--color-maroon-deep)' }}>
              Counting down
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="flex justify-center">
            <Countdown target={countdownTarget} />
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
