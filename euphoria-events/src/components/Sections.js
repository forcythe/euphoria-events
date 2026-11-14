'use client';

import { useState } from 'react';
import { siInstagram, siTiktok, siFacebook, siYoutube, siWhatsapp } from 'simple-icons';
import { BRAND, PACKAGES, FAQS, LEGAL, REVIEWS, GOOGLE_REVIEW_URL } from '@/lib/data';
import { SEO_PAGES } from '@/lib/seo';
import { Btn, Plus, Split, naira, scrollToId } from './ui';
import Drawer from './Drawer';

/* ------------------------------------------------------------------------ */
export function Packages({ onBook }) {
  // Spotlight follows the pointer across each card.
  const track = e => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <section className="pkgs" id="packages" data-label="Packages" data-tint="gold" aria-labelledby="pkg-h">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <p className="kicker acc-d" data-rv>Photo booth packages and prices</p>
            <h2 id="pkg-h" className="disp split"><Split text="Pick your package" /></h2>
          </div>
          <p className="lede" data-rv=".1">All packages include setup, pack-down and a dedicated attendant.</p>
        </div>
        <div className="pkg-grid" id="pkgGrid">
          {PACKAGES.map(p => (
            <article key={p.id} className={`pkg${p.best ? ' best' : ''}`} onPointerMove={track} data-pkg>
              <div className="top">
                <div>
                  <h3 className="disp">{p.name}</h3>
                  <p className="tl">{p.tagline}</p>
                </div>
                {p.best && <span className="pop">Most popular</span>}
              </div>
              <p className={`price${p.best ? ' foil-text foil-once' : ''}`} data-foil-once={p.best || undefined}>{naira(p.price)}</p>
              <ul>{p.services.map(s => <li key={s}>{s}</li>)}</ul>
              <Btn variant={p.best ? 'white' : 'line'} icon={p.best} block onClick={() => onBook(p)}>{`Book ${p.name}`}</Btn>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
const Stars = ({ size = 14 }) => (
  <span className="stars" aria-hidden="true">
    {[0, 1, 2, 3, 4].map(i => (
      <svg key={i} width={size} height={size} viewBox="0 0 16 16"><path d="M8 1.2l2.1 4.3 4.7.7-3.4 3.3.8 4.7L8 12l-4.2 2.2.8-4.7L1.2 6.2l4.7-.7z" fill="currentColor" /></svg>
    ))}
  </span>
);

export function Reviews() {
  const card = (r, hidden) => (
    <figure key={r.name + (hidden ? '-b' : '')} className="rev" aria-hidden={hidden || undefined}>
      <Stars />
      <blockquote>“{r.review}”</blockquote>
      <figcaption>
        <span className="av" aria-hidden="true">{r.name[0]}</span>
        <span><b>{r.name}</b><small>{r.event}</small></span>
      </figcaption>
    </figure>
  );
  return (
    <section className="revs" id="reviews" data-label="Reviews" data-tint="violet" aria-labelledby="rev-h">
      <div className="wrap sec-head">
        <div>
          <p className="kicker acc-d" data-rv>Client love</p>
          <h2 id="rev-h" className="disp split"><Split text="Hosts who booked us" /></h2>
        </div>
        <div className="rev-score glass" data-rv=".1">
          <b className="disp">5.0</b>
          <span><Stars size={16} /><small>Rated on Google</small></span>
        </div>
      </div>
      <div className="rev-row" data-rev-row>
        <div className="marq-in" data-marq="55">
          <div className="marq-set">{REVIEWS.map(r => card(r, false))}</div>
          <div className="marq-set" aria-hidden="true">{REVIEWS.map(r => card(r, true))}</div>
        </div>
      </div>
      <div className="wrap rev-cta" data-rv>
        <Btn variant="line" icon={false} href={GOOGLE_REVIEW_URL}>Leave us a review on Google</Btn>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
export function BigMarquee() {
  const row = hidden => (
    <div className="marq-set" aria-hidden={hidden || undefined}>
      <span className="f">Make every <em className="g">moment</em></span><span className="o">euphoric</span><span>360° booths</span>
      <span className="g">Magic mirrors</span><span className="f">Guestbooks</span><span className="o">Video</span><span>Drone</span>
    </div>
  );
  return (
    <div className="bigmarq" aria-hidden="true">
      <div className="marq-in" data-marq="-60">{row(false)}{row(true)}</div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="faq" id="faq" data-label="FAQs" data-tint="violet" aria-labelledby="faq-h">
      <div className="wrap faq-grid">
        <div className="faq-side">
          <p className="kicker acc-d" data-rv style={{ marginBottom: 18, textTransform: 'none', letterSpacing: '.08em' }}>FAQs</p>
          <h2 id="faq-h" className="disp split"><Split text="Before you book" /></h2>
          <p data-rv=".1">Deposits, date changes, travel and branding. If your question is not here, message us on WhatsApp.</p>
          <div data-rv=".15"><Btn href={BRAND.socials.whatsapp}>Chat on WhatsApp</Btn></div>
        </div>
        <div className="qa">
          {FAQS.map((f, i) => {
            const on = open === i;
            return (
              <div key={f.q} className={`qa-i${on ? ' open' : ''}`}>
                <button type="button" className="qa-q" aria-expanded={on} aria-controls={`qa-${i}`} id={`qq-${i}`} onClick={() => setOpen(on ? null : i)}>
                  <span className="q">{f.q}</span>
                  <span className="pl" aria-hidden="true"><Plus /></span>
                </button>
                <div className="qa-a" id={`qa-${i}`} role="region" aria-labelledby={`qq-${i}`}>
                  <div><p>{f.a}</p></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
const FOLLOW = [
  ['Instagram', 'instagram', siInstagram], ['TikTok', 'tiktok', siTiktok], ['Facebook', 'facebook', siFacebook], ['YouTube', 'youtube', siYoutube],
];

export function End({ onLegal }) {
  return (
    <div className="end" data-label="Contact" data-tint="pink">
      <div className="end-stage" id="endStage">
        <div className="end-media" id="endMedia">
          <div className="ph"><img src="/hero-3.jpg" alt="Couple sharing a first dance surrounded by sparklers" loading="lazy" /></div>
          <div className="end-shade" />
        </div>
        <div className="end-copy wrap" id="endCopy">
          <h2 className="disp split"><Split text="Ready to lock in your date?" /></h2>
          <p>Weekends from May to August and in December go first. We recommend booking four to six weeks ahead.</p>
          <div className="acts">
            <Btn onClick={() => scrollToId('booking')}>Book a date</Btn>
            <Btn variant="line" icon={false} href={BRAND.socials.whatsapp}>Chat on WhatsApp</Btn>
          </div>
        </div>
      </div>

      <footer className="foot">
        <div className="wrap">
          <div className="fgrid">
            <div>
              <h3>Euphoria Events</h3>
              <p>{BRAND.description}</p>
            </div>
            <nav aria-label="Footer">
              <h3>Explore</h3>
              {[['Services', 'services'], ['Gallery', 'gallery'], ['Packages', 'packages'], ['Reviews', 'reviews'], ['FAQs', 'faq']].map(([l, id]) => (
                <button key={id} type="button" className="fl-link" onClick={() => scrollToId(id)}>{l}</button>
              ))}
            </nav>
            <nav aria-label="Popular services">
              <h3>Popular</h3>
              {SEO_PAGES.map(p => <a key={p.slug} href={`/${p.slug}`}>{p.h1.replace(' in Lagos', '')}</a>)}
            </nav>
            <div>
              <h3>Follow</h3>
              <div className="socials">
                {FOLLOW.map(([l, k, icon]) => (
                  <a key={k} className="soc" href={BRAND.socials[k]} target="_blank" rel="noopener noreferrer" aria-label={`Euphoria on ${l}`} title={l}>
                    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d={icon.path} fill="currentColor" /></svg>
                  </a>
                ))}
              </div>
            </div>
            <address>
              <h3>Contact</h3>
              <div className="socials">
                <a className="soc" href={`mailto:${BRAND.email}`} aria-label={`Email Euphoria at ${BRAND.email}`} title={BRAND.email}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" /><path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.7" /></svg>
                </a>
                <a className="soc" href={BRAND.socials.whatsapp} target="_blank" rel="noopener noreferrer" aria-label={`Chat with Euphoria on WhatsApp, ${BRAND.phone}`} title={`WhatsApp ${BRAND.phone}`}>
                  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d={siWhatsapp.path} fill="currentColor" /></svg>
                </a>
              </div>
            </address>
          </div>
          <div className="flogo" aria-hidden="true"><span className="w foil-text foil-once" id="footWord">euphoria</span><i /></div>
          <div className="fbase">
            <span>© {new Date().getFullYear()} {BRAND.fullName}. All rights reserved.</span>
            <span className="legal">
              <button type="button" onClick={() => onLegal('terms')}>Terms and conditions</button>
              <button type="button" onClick={() => onLegal('policy')}>Privacy policy</button>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
export function LegalDrawer({ page, open, onClose }) {
  const doc = LEGAL[page];
  return (
    <Drawer open={open} onClose={onClose} title={doc.title} sub="Legal" top>
      <div className="legal-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <p className="upd">Last updated {doc.updated}</p>
        {doc.sections.map(([h, b]) => (
          <section key={h}>
            <h3>{h}</h3>
            <p>{b}</p>
          </section>
        ))}
      </div>
      <div><Btn variant="deep" icon={false} onClick={onClose}>Close</Btn></div>
    </Drawer>
  );
}
