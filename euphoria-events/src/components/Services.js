'use client';

import { useState } from 'react';
import { SERVICES, SERVICE_IMAGES } from '@/lib/data';
import { seoPageForService } from '@/lib/seo';
import { Btn, Split, naira, Chevron, localSrcSet } from './ui';
import Drawer from './Drawer';

export default function Services({ onBookService, onSeePackages }) {
  const [current, setCurrent] = useState(SERVICES[0].id);
  const [isOpen, setIsOpen] = useState(false);
  const s = SERVICES.find(x => x.id === current);
  const show = id => { setCurrent(id); setIsOpen(true); };
  const hide = () => setIsOpen(false);

  return (
    <section className="svc" id="services" data-label="Services" data-tint="pink" aria-labelledby="svc-h">
      <div className="wrap sec-head svc-intro">
        <div>
          <p className="kicker acc-d" data-rv>Photo booth and videography services</p>
          <h2 id="svc-h" className="disp split"><Split text="Four ways to capture your event" /></h2>
        </div>
        <p className="lede" data-rv=".1">
          Book one service or combine several. Every booking includes setup, a dedicated attendant and pack-down.
        </p>
      </div>

      <div className="svc-stack">
        {SERVICES.map(item => (
          <article key={item.id} className="svc-panel" aria-labelledby={`svc-${item.id}`}>
            <div className="svc-media" data-svc-media>
              <div className="ph"><img src={SERVICE_IMAGES[item.id]} srcSet={localSrcSet(SERVICE_IMAGES[item.id])} sizes="100vw" alt={`${item.title} at a Euphoria event`} loading="lazy" decoding="async" /></div>
              <div className="svc-shade" />
              <div className="svc-dim" data-svc-dim />
            </div>
            <div className="svc-copy wrap" data-svc-copy>
              <div className="svc-top">
                <span className="svc-price">From {naira(item.startingPrice)}</span>
              </div>
              <div className="svc-bottom">
                <div>
                  <h3 id={`svc-${item.id}`} className="disp">{item.title}</h3>
                  <p>{item.shortDesc}</p>
                  {seoPageForService(item.id) && (
                    <a className="svc-more" href={`/${seoPageForService(item.id).slug}`}>{seoPageForService(item.id).h1} <Chevron size={13} /></a>
                  )}
                </div>
                <div className="svc-side">
                  <ul className="svc-tags">
                    <li>{item.duration}</li>
                    <li>{item.guests} guests</li>
                    <li>{item.features[0]}</li>
                  </ul>
                  <div className="svc-acts">
                    <Btn onClick={() => onBookService(item.id)}>Book this service</Btn>
                    <Btn variant="line" icon={false} onClick={() => show(item.id)}>What is included</Btn>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <Drawer open={isOpen} onClose={hide} title={s.title} sub="Service">
        <figure className="ph hd"><img src={SERVICE_IMAGES[s.id]} alt={`${s.title} at a Euphoria event`} /></figure>
        <p className="desc">{s.shortDesc}</p>
        <dl className="spec">
          <div><dt>Starting price</dt><dd>{naira(s.startingPrice)}</dd></div>
          <div><dt>Duration</dt><dd>{s.duration}</dd></div>
          <div><dt>Guests</dt><dd>{s.guests}</dd></div>
        </dl>
        <div>
          <p className="kicker acc-l" style={{ marginBottom: 12 }}>Included</p>
          <ul className="feat">{s.features.map(f => <li key={f}>{f}</li>)}</ul>
        </div>
        <div className="acts">
          <Btn variant="deep" onClick={() => { hide(); onBookService(s.id); }}>Book this service</Btn>
          <Btn variant="ol" icon={false} onClick={() => { hide(); onSeePackages(); }}>Compare packages</Btn>
        </div>
      </Drawer>
    </section>
  );
}
