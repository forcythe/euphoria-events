'use client';

import { useEffect, useRef, useState } from 'react';
import { GALLERY_TILES, GALLERIES } from '@/lib/data';
import { Btn, Close, Chevron, Split, lockScroll, unlockScroll, cld, cldVideo, cldPoster, mediaKey } from './ui';

/**
 * A gallery item is a photo by default. Set type: 'video' (and optionally a poster image)
 * in data.js to show a clip instead: it plays muted on a loop in the reel and with sound
 * and controls when opened.
 */
function Media({ m, mode, alt = '' }) {
  const [live, setLive] = useState(false);
  const fine = typeof window !== 'undefined' && window.matchMedia?.('(hover: hover)').matches;

  if (m.type === 'video') {
    if (mode === 'full') {
      return <video src={cldVideo(m.url, 1920)} poster={m.poster || cldPoster(m.url, 1920)} controls autoPlay playsInline />;
    }
    // In the reel and grids a clip shows its poster frame, and plays muted while hovered.
    const poster = m.poster || cldPoster(m.url, mode === 'reel' ? 1200 : 900);
    return (
      <span className="vid" onMouseEnter={() => fine && setLive(true)} onMouseLeave={() => setLive(false)}>
        <img src={poster} alt={alt} loading="lazy" draggable="false" />
        {live && <video src={cldVideo(m.url, 960)} muted loop playsInline autoPlay aria-hidden="true" />}
      </span>
    );
  }
  const w = mode === 'full' ? 2400 : mode === 'reel' ? 1200 : 900;
  return <img src={cld(m.url, w)} alt={alt} loading="lazy" draggable="false" />;
}

// Every photo and clip once, tagged with the album it first appears in, then dealt
// round-robin across albums so neighbouring shots in the reel come from different events.
const ALL = (() => {
  const seen = new Set();
  const byAlbum = GALLERY_TILES.map(t => GALLERIES[t.id].media
    .map((m, i) => ({ ...m, gid: t.id, idx: i }))
    .filter(m => { const k = mediaKey(m.url); if (seen.has(k)) return false; seen.add(k); return true; }));
  const out = [];
  for (let r = 0; byAlbum.some(a => a[r]); r += 1) byAlbum.forEach(a => { if (a[r]) out.push(a[r]); });
  return out;
})();
const ROW_A = ALL.filter((_, i) => i % 2 === 0);
const ROW_B = ALL.filter((_, i) => i % 2 === 1);

/* ------------------------------------------------------------------------ */
/* A single print in the album: tilts towards the pointer; clips play while in view. */
function Tile({ m, i, onOpen }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const rnd = useRef({
    dx: (Math.random() - 0.5) * 220, dy: 120 + Math.random() * 160, rot: (Math.random() - 0.5) * 18,
  }).current;

  useEffect(() => {
    if (m.type !== 'video' || !ref.current) return undefined;
    const io = new IntersectionObserver(([e]) => setInView(e.intersectionRatio > 0.5), { threshold: [0, 0.5, 1] });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [m.type]);

  const tilt = e => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5; const y = (e.clientY - r.top) / r.height - 0.5;
    e.currentTarget.style.setProperty('--ry', `${x * 10}deg`);
    e.currentTarget.style.setProperty('--rx', `${y * -10}deg`);
    e.currentTarget.style.setProperty('--gx', `${(x + 0.5) * 100}%`);
    e.currentTarget.style.setProperty('--gy', `${(y + 0.5) * 100}%`);
  };
  const reset = e => { e.currentTarget.style.setProperty('--rx', '0deg'); e.currentTarget.style.setProperty('--ry', '0deg'); };

  return (
    <button ref={ref} type="button" className="print" onClick={e => onOpen(i, e.currentTarget)} onPointerMove={tilt} onPointerLeave={reset}
      data-cur={m.type === 'video' ? 'Play' : 'Open'} aria-label={`Open ${m.type === 'video' ? 'video' : 'photo'}: ${m.caption}`}
      style={{ '--dx': `${rnd.dx}px`, '--dy': `${rnd.dy}px`, '--rot': `${rnd.rot}deg`, animationDelay: `${0.2 + i * 0.07}s` }}>
      <span className="print-in">
        {m.type === 'video' && inView
          ? <span className="vid"><img src={m.poster || cldPoster(m.url, 900)} alt={m.caption} /><video src={cldVideo(m.url, 960)} muted loop playsInline autoPlay aria-hidden="true" /></span>
          : <Media m={m} mode="thumb" alt={m.caption} />}
        <span className="glare" aria-hidden="true" />
        {m.type === 'video' && <span className="play" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 16 16"><path d="M4 2.5v11l9-5.5z" fill="currentColor" /></svg></span>}
        <span className="c">{m.caption}</span>
      </span>
    </button>
  );
}

function Viewer({ id, start, origin, onClose, onBook }) {
  const g = GALLERIES[id];
  const n = g.media.length;
  const [lb, setLb] = useState(start);
  const [dir, setDir] = useState(1);
  const [from, setFrom] = useState(null);       // tile rectangle the full view grows from
  const [closing, setClosing] = useState(false);
  const [cols, setCols] = useState(4);
  const closeRef = useRef(null);
  const bodyRef = useRef(null);
  const colRefs = useRef([]);
  const lbRef = useRef(lb);
  const swipe = useRef(null);
  lbRef.current = lb;

  const close = () => { setClosing(true); setTimeout(onClose, 520); };
  const go = step => { setDir(step); setFrom(null); setLb(i => (i + step + n) % n); };
  const openAt = (i, el) => {
    const r = el?.getBoundingClientRect();
    setFrom(r ? { x: r.left + r.width / 2 - window.innerWidth / 2, y: r.top + r.height / 2 - window.innerHeight / 2, s: Math.max(0.15, r.width / Math.min(window.innerWidth * 0.8, 1100)) } : null);
    setDir(1); setLb(i);
  };

  // Column count follows the screen width
  useEffect(() => {
    const fit = () => setCols(window.innerWidth >= 1100 ? 4 : window.innerWidth >= 700 ? 3 : 2);
    fit(); window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  // Depth: columns drift at different speeds as the album scrolls
  useEffect(() => {
    const body = bodyRef.current;
    if (!body || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const speeds = [0, -0.14, 0.06, -0.08];
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        colRefs.current.forEach((c, k) => { if (c) c.style.transform = `translate3d(0, ${body.scrollTop * speeds[k % 4]}px, 0)`; });
      });
    };
    body.addEventListener('scroll', onScroll, { passive: true });
    return () => { body.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [cols]);

  useEffect(() => {
    const prev = document.activeElement;
    lockScroll();
    closeRef.current?.focus();
    const onKey = e => {
      const cur = lbRef.current;
      if (e.key === 'Escape') { if (cur !== null) setLb(null); else close(); }
      if (cur === null) return;
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); unlockScroll(); prev?.focus?.({ preventScroll: true }); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = Array.from({ length: cols }, () => []);
  g.media.forEach((m, i) => columns[i % cols].push({ m, i }));
  const videos = g.media.filter(m => m.type === 'video').length;

  return (
    <div className={`viewer${closing ? ' closing' : ''}`} role="dialog" aria-modal="true" aria-label={`${g.label} gallery`}
      style={{ '--cx': `${origin.x}px`, '--cy': `${origin.y}px` }}>
      <div className="viewer-head">
        <div>
          <h2 className="disp">{g.label}</h2>
          <p className="sub">{g.tag} · {n - videos} photo{n - videos === 1 ? '' : 's'}{videos ? ` · ${videos} video${videos === 1 ? '' : 's'}` : ''}</p>
        </div>
        <button ref={closeRef} type="button" className="x on-dark" onClick={close} aria-label="Close gallery"><Close /></button>
      </div>
      <div className="viewer-body" ref={bodyRef} data-lenis-prevent>
        <div className="prints" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {columns.map((col, k) => (
            <div key={k} className="prints-col" ref={el => { colRefs.current[k] = el; }} style={{ marginTop: k % 2 ? 48 : 0 }}>
              {col.map(({ m, i }) => <Tile key={m.url + i} m={m} i={i} onOpen={openAt} />)}
            </div>
          ))}
        </div>
      </div>
      <div className="viewer-foot">
        <p>Want this at your event?</p>
        <Btn onClick={() => { onClose(); onBook(); }}>Book a date</Btn>
      </div>

      {lb !== null && (
        <div className="lb" role="dialog" aria-modal="true" aria-label="Photo viewer"
          onClick={e => { if (e.target === e.currentTarget) setLb(null); }}
          onPointerDown={e => { swipe.current = e.clientX; }}
          onPointerUp={e => { if (swipe.current === null) return; const dx = e.clientX - swipe.current; swipe.current = null; if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1); }}>
          <button type="button" className="x on-dark close" onClick={() => setLb(null)} aria-label="Close photo"><Close /></button>
          <button type="button" className="x on-dark nav-b p" onClick={() => go(-1)} aria-label="Previous"><Chevron dir="left" /></button>
          <figure key={lb} className={from ? 'grow' : dir > 0 ? 'from-right' : 'from-left'}
            style={from ? { '--fx': `${from.x}px`, '--fy': `${from.y}px`, '--fs': from.s } : undefined}>
            <span className={`lb-media${g.media[lb].type === 'video' ? '' : ' kb'}`}><Media m={g.media[lb]} mode="full" alt={g.media[lb].caption} /></span>
            <figcaption>{g.media[lb].caption}<span>{lb + 1} / {n}</span></figcaption>
          </figure>
          <div className="lb-progress" aria-hidden="true"><i style={{ width: `${((lb + 1) / n) * 100}%` }} /></div>
          <button type="button" className="x on-dark nav-b n" onClick={() => go(1)} aria-label="Next"><Chevron /></button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------ */
function Row({ items, dir, onOpen }) {
  const set = hidden => (
    <div className="strip-set" aria-hidden={hidden || undefined}>
      {items.map((m, i) => (
        <button key={`${m.url}-${i}`} type="button" className="shot" data-cur="View"
          tabIndex={hidden ? -1 : 0}
          aria-label={hidden ? undefined : `${GALLERIES[m.gid].label}: ${m.caption}`}
          onClick={e => onOpen(m.gid, m.idx, e)}>
          <span className="ph"><Media m={m} mode="reel" /></span>
          {m.type === 'video' && <span className="play" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 16 16"><path d="M4 2.5v11l9-5.5z" fill="currentColor" /></svg></span>}
          <span className="shot-cap"><b>{GALLERIES[m.gid].label}</b>{m.caption}</span>
        </button>
      ))}
    </div>
  );
  return (
    <div className="strip" data-strip={dir}>
      <div className="strip-in">{set(false)}{set(true)}</div>
    </div>
  );
}

export default function Gallery({ onBook }) {
  const [active, setActive] = useState(null);

  const open = (gid, idx, e) => {
    const r = e?.currentTarget?.getBoundingClientRect();
    const clamp = (v, max) => Math.min(Math.max(v, 0), max);
    const origin = r
      ? { x: clamp(r.left + r.width / 2, window.innerWidth), y: clamp(r.top + r.height / 2, window.innerHeight) }
      : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    setActive({ gid, idx, origin });
  };

  return (
    <section className="gal" id="gallery" data-label="Gallery" data-tint="cyan" aria-labelledby="gal-h">
      <div className="wrap sec-head">
        <div>
          <p className="kicker acc-d" data-rv>Real moments</p>
          <h2 id="gal-h" className="disp split"><Split text="The Euphoria effect" /></h2>
        </div>
        <p className="lede" data-rv=".1">Scroll faster and the reel speeds up. Tap any photo to open the full event.</p>
      </div>

      <div className="strips" id="strips">
        <Row items={ROW_A} dir="-1" onOpen={open} />
        <Row items={ROW_B} dir="1" onOpen={open} />
      </div>

      <div className="albums-pin" id="albumsPin">
        <div className="wrap">
          <div className="albums-head">
            <p className="kicker acc-d">Browse by event</p>
            <p className="albums-hint">Keep scrolling to move through the events. Tap one to open it.</p>
          </div>
          <div className="alb-strips" id="albStrips" role="group" aria-label="Events">
            {GALLERY_TILES.map(t => {
              const g = GALLERIES[t.id];
              const videos = g.media.filter(m => m.type === 'video').length;
              const photos = g.media.length - videos;
              const count = `${photos} photo${photos === 1 ? '' : 's'}${videos ? ` · ${videos} video${videos === 1 ? '' : 's'}` : ''}`;
              return (
                <button key={t.id} type="button" className="alb" data-alb onClick={e => open(t.id, null, e)}
                  aria-label={`Open the ${g.label} album: ${count}`}>
                  <span className="ph"><img src={cld(g.cover, 1400)} alt="" loading="lazy" draggable="false" /></span>
                  <span className="alb-shade" aria-hidden="true" />
                  <span className="alb-vert" aria-hidden="true">{g.label}</span>
                  <span className="alb-cap" aria-hidden="true">
                    <span className="alb-tag">{g.tag}</span>
                    <b className="disp">{g.label}</b>
                    <small>{count}</small>
                    <span className="alb-open">Open album <Chevron size={14} /></span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {active && <Viewer id={active.gid} start={active.idx} origin={active.origin} onClose={() => setActive(null)} onBook={onBook} />}
    </section>
  );
}
