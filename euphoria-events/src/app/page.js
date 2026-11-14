'use client';

import { useCallback, useEffect, useState } from 'react';
import { PACKAGES, LD_FAQ, LD_SERVICES } from '@/lib/data';
import Motion from '@/components/Motion';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Story, { Occasions, Spin } from '@/components/Story';
import Services from '@/components/Services';
import Gallery from '@/components/Gallery';
import { Packages, Reviews, BigMarquee, Faq, End, LegalDrawer } from '@/components/Sections';
import BookingForm from '@/components/Booking';
import Drawer from '@/components/Drawer';
import { Split, naira, scrollToId } from '@/components/ui';

export default function HomePage() {
  const [blocked, setBlocked] = useState([]);
  const [preset, setPreset] = useState(null);
  const [pkg, setPkg] = useState(PACKAGES[0]);
  const [pkgOpen, setPkgOpen] = useState(false);
  const [legal, setLegal] = useState('terms');
  const [legalOpen, setLegalOpen] = useState(false);

  const loadBlocked = useCallback(() => {
    fetch('/api/calendar/blocked-dates', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (d.blocked) setBlocked(d.blocked); })
      .catch(err => console.warn('Could not fetch blocked dates:', err));
  }, []);
  useEffect(loadBlocked, [loadBlocked]);

  // Links from the service pages (/?service=360#booking) open the form with that service chosen
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('service');
    if (id) { setPreset({ mode: 'services', service: id }); setTimeout(() => scrollToId('booking'), 400); }
  }, []);

  // Each preset is a new object, so the form re-applies it even if the values repeat.
  const bookWith = p => { setPreset({ ...p }); setTimeout(() => scrollToId('booking'), 60); };
  const openLegal = page => { setLegal(page); setLegalOpen(true); };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD_FAQ) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD_SERVICES) }} />
      <div className="ambient" aria-hidden="true"><i className="a1" /><i className="a2" /><i className="a3" /></div>
      <Motion />
      <Nav />

      <main>
        <Hero onPickEvent={eventType => bookWith({ eventType })} />
        <Occasions />
        <Spin />
        <Story />
        <Services
          onBookService={id => bookWith({ mode: 'services', service: id })}
          onSeePackages={() => scrollToId('packages')}
        />
        <Gallery onBook={() => scrollToId('booking')} />
        <Packages onBook={p => { setPkg(p); setPkgOpen(true); }} />
        <Reviews />
        <BigMarquee />

        <section className="book" id="booking" data-label="Booking" data-tint="cyan" aria-labelledby="book-h">
          <div className="wrap">
            <div className="book-card on-light" id="bookCard">
            <div className="sec-head">
              <div>
                <p className="kicker acc-l">Booking</p>
                <h2 id="book-h" className="disp split"><Split text="Book your date" /></h2>
              </div>
              <p className="lede" data-rv=".1">
                Pick a date, choose services or a package, and tell us about the event. We reply within 24 hours.
              </p>
            </div>
            <BookingForm idPrefix="bk" preset={preset} blockedDates={blocked} onBooked={loadBlocked} onOpenLegal={openLegal} />
            </div>
          </div>
        </section>

        <Faq />
      </main>

      <End onLegal={openLegal} />

      <Drawer
        open={pkgOpen}
        onClose={() => setPkgOpen(false)}
        title={`${pkg.name}, ${naira(pkg.price)}`}
        sub="Package booking"
        center
      >
        <BookingForm key={pkg.id} idPrefix={`pk-${pkg.id}`} fixedPkg={pkg} blockedDates={blocked} onBooked={loadBlocked} onOpenLegal={openLegal} />
      </Drawer>

      <LegalDrawer page={legal} open={legalOpen} onClose={() => setLegalOpen(false)} />
    </>
  );
}
