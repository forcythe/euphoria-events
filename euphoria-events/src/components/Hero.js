'use client';

import { memo, useEffect, useState } from 'react';
import { HERO_SLIDES, EVENT_TYPES, STATS, GALLERIES, FEATURED } from '@/lib/data';
import { Btn, Split, cld, photoByCaption, localSrcSet } from './ui';
import Stars from './Stars';

const WORDS = ['unforgettable', 'electrifying', 'euphoric'];

// People photos that fan out around the hero image as the visitor scrolls (FEATURED.heroFan in data.js).
// Each tile requests a crop in its own shape so the photo fills it, with the subject kept in frame.
const FAN_SHAPES = { a: '3:4', b: '3:2', c: '4:3', d: '3:4', e: '4:5', f: '4:5' };
const FAN = FEATURED.heroFan
  .map((c, i) => ({ photo: photoByCaption(GALLERIES, c), pos: 'abcdef'[i] }))
  .filter(f => f.photo);

function RollingWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = setInterval(() => setI(n => (n + 1) % WORDS.length), 2600);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="roll">
      {/* Search engines and screen readers read one word; the rolling words are drawn by CSS */}
      <span className="sr-only"> {WORDS[WORDS.length - 1]}</span>
      <span aria-hidden="true" style={{ transform: `translateY(${-i * 100 / WORDS.length}%)` }}>
        {WORDS.map(w => <em key={w} data-w={w} />)}
      </span>
    </span>
  );
}

// The event picker cycles through occasions until the visitor chooses one.
// It owns its state, so each tick only updates this small form.
function Finder({ onPickEvent }) {
  const [type, setType] = useState(EVENT_TYPES[0]);
  const [touched, setTouched] = useState(false);
  const CYCLE = EVENT_TYPES.filter(t => t !== 'Other');
  useEffect(() => {
    if (touched || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = setInterval(() => setType(cur => CYCLE[(CYCLE.indexOf(cur) + 1) % CYCLE.length]), 2200);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [touched]);
  return (
    <form className="finder glass h-in" onSubmit={e => { e.preventDefault(); onPickEvent(type); }}>
      <label>
        <span className="k">What are you celebrating?</span>
        <span className="pick">
          <span className="pick-v" aria-hidden="true"><span key={type}>{type}</span></span>
          <select value={type} onChange={e => { setTouched(true); setType(e.target.value); }} onFocus={() => setTouched(true)} aria-label="Event type">
            {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </span>
      </label>
      <Btn size="sm" type="submit">Check dates</Btn>
    </form>
  );
}

// Collage photos load once the page has settled (they only appear after scrolling)
const Fan = memo(function Fan({ ready }) {
  return (
    <div className="hero-fan" aria-hidden="true">
      {FAN.map(f => (
        <div key={f.pos} className={`fan fan-${f.pos} ph`}>
          {ready && <img src={cld(f.photo.url, 900, { ar: FAN_SHAPES[f.pos] })} alt="" decoding="async" />}
        </div>
      ))}
    </div>
  );
});

const Headline = memo(function Headline() {
  return (
    <h1 id="hero-h" className="disp split">
      <Split text="Make every moment" />
      <RollingWord />
    </h1>
  );
});

export default function Hero({ onPickEvent }) {
  const [slide, setSlide] = useState(0);
  const [ready, setReady] = useState(false);

  // Everything not needed for the first view waits until the page has loaded and settled
  useEffect(() => {
    const go = () => setTimeout(() => setReady(true), 1200);
    if (document.readyState === 'complete') go(); else window.addEventListener('load', go, { once: true });
    return () => window.removeEventListener('load', go);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(t);
  }, [slide]);

  const meta = STATS.slice(0, 3);

  return (
    <section className="hero" id="hero" data-label="Home" data-tint="pink" aria-labelledby="hero-h">
      <div className="hero-stage" id="heroStage">
        <Stars />
        <Fan ready={ready} />

        <div className="hero-frame" id="heroFrame">
          <div className="hero-slides" id="heroSlides">
            {HERO_SLIDES.map((s, i) => (
              <div key={s.src} className={`ph${i === slide ? ' on' : ''}`}>
                {(i === 0 || ready) && (
                  <img src={s.src} srcSet={localSrcSet(s.src)} sizes="100vw" alt={i === slide ? s.alt : ''}
                    fetchPriority={i === 0 ? 'high' : 'low'} decoding={i === 0 ? 'sync' : 'async'} />
                )}
              </div>
            ))}
          </div>
          <div className="hero-grad" />
        </div>

        <p className="hero-mid disp" id="heroMid" aria-hidden="true">Your celebration, from every angle</p>

        <div className="hero-top" id="heroTop">
          <div className="wrap">
            <span className="badge glass h-in">
              <span className="sq" aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="3" fill="currentColor" /></svg>
              </span>
              360° photo booth &amp; event experience rentals in Lagos
            </span>
            <div className="hero-steps h-in" role="group" aria-label="Choose a photo">
              {HERO_SLIDES.map((s, i) => (
                <button key={s.src} type="button" aria-current={i === slide} onClick={() => setSlide(i)}>
                  <i aria-hidden="true" />{s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-copy" id="heroCopy">
          <div className="wrap">
            <div>
              <Headline />
              <p className="hero-lede h-in">
                <strong>Photo booth and event video rentals in Lagos.</strong> 360° slow-motion booths, instant-print magic mirror booths, video guestbooks and roaming videographers that turn your wedding, birthday or corporate event into moments guests share before they leave.
              </p>
            </div>
            <div className="hero-side">
              <Finder onPickEvent={onPickEvent} />
              <div className="hero-meta glass h-in">
                {meta.map(s => <div key={s.label}><b>{s.value}</b><span>{s.label}</span></div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
