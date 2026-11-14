'use client';

import { useEffect, useRef, useState } from 'react';
import { BRAND } from '@/lib/data';
import { Btn, Arrow, Close, scrollToId, lockScroll, unlockScroll } from './ui';

const LINKS = [
  { id: 'services', label: 'Services', img: '/360-booth.webp', cap: 'Four ways to capture your event' },
  { id: 'gallery', label: 'Gallery', img: '/hero-2.webp', cap: 'Real events, real guests' },
  { id: 'packages', label: 'Packages', img: '/smile-camera.webp', cap: 'Bundles for every budget' },
  { id: 'reviews', label: 'Reviews', img: '/hero-1.webp', cap: 'Rated 5.0 on Google' },
  { id: 'faq', label: 'FAQs', img: '/audio-guestbook.webp', cap: 'Deposits, dates and travel' },
  { id: 'booking', label: 'Book a date', img: '/hero-3.webp', cap: 'Check availability in Lagos' },
];

export function Logo({ as = 'a', ...rest }) {
  const Tag = as;
  return (
    <Tag className="logo" {...rest}>
      euphoria<i aria-hidden="true" />
    </Tag>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [prev, setPrev] = useState(LINKS[0]);
  const btnRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    lockScroll();
    const t = setTimeout(() => closeRef.current?.focus(), 80);
    const onKey = e => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', onKey);
      unlockScroll();
      btnRef.current?.focus({ preventScroll: true });
    };
  }, [open]);

  const go = id => {
    setOpen(false);
    setTimeout(() => scrollToId(id), open ? 450 : 0);
  };

  return (
    <>
      <header className="nav" id="nav">
        <div className="nav-in">
          <div className="nav-l">
            <button ref={btnRef} className="menu-btn" type="button" aria-expanded={open} aria-controls="menu" aria-label="Open menu" onClick={() => setOpen(true)}>
              <span className="sq" aria-hidden="true"><i /><i /></span>
            </button>
            <span className="sec-label" id="secLabel" aria-hidden="true">Home</span>
          </div>
          <Logo href="/" aria-label={`${BRAND.fullName} home`} />
          <div className="right">
            <nav className="nav-links" aria-label="Sections">
              {LINKS.slice(0, 3).map(l => (
                <button key={l.id} type="button" onClick={() => go(l.id)}>{l.label}</button>
              ))}
            </nav>
            <Btn size="sm" onClick={() => go('booking')} aria-label="Book a date">Book a date</Btn>
          </div>
          <i className="navprog" id="navProg" aria-hidden="true" />
        </div>
      </header>

      <div className={`menu${open ? ' open' : ''}`} id="menu" role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!open}>
        <div className="menu-scrim" onClick={() => setOpen(false)} />
        <aside className="menu-panel" data-lenis-prevent>
          <div className="menu-head">
            <Logo as="span" />
            <button ref={closeRef} type="button" className="x on-dark" aria-label="Close menu" onClick={() => setOpen(false)}>
              <Close />
            </button>
          </div>
          <nav aria-label="Menu">
            <ul className="menu-links">
              {LINKS.map(l => (
                <li key={l.id}>
                  <button type="button" tabIndex={open ? 0 : -1} onClick={() => go(l.id)} onMouseEnter={() => setPrev(l)} onFocus={() => setPrev(l)}>
                    <span className="lk">{l.label}</span>
                    <span className="ar" aria-hidden="true"><Arrow /></span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="menu-foot">
            <div className="ct">
              <span className="kicker acc-d" style={{ gridColumn: '1 / -1' }}>Talk to us</span>
              <a href={`tel:${BRAND.phone.replace(/\s/g, '')}`} tabIndex={open ? 0 : -1}>{BRAND.phone}</a>
              <a href={`mailto:${BRAND.email}`} tabIndex={open ? 0 : -1}>{BRAND.email}</a>
              <a href={BRAND.socials.whatsapp} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>WhatsApp</a>
              <a href={BRAND.socials.instagram} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>Instagram</a>
            </div>
          </div>
        </aside>
        <figure className="menu-preview ph" aria-hidden="true">
          {LINKS.map(l => (
            <img key={l.id} src={l.img} alt="" style={{ opacity: prev.id === l.id ? 1 : 0, transform: prev.id === l.id ? 'scale(1)' : 'scale(1.06)' }} />
          ))}
          <figcaption className="disp">{prev.cap}</figcaption>
        </figure>
      </div>
    </>
  );
}
