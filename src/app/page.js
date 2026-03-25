'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  BRAND, STATS, SERVICES, PACKAGES, GALLERY_TILES, GALLERIES,
  SERVICE_IMAGES, HERO_IMAGES, FAQS, NAV_LINKS,
} from '@/lib/data';

// ─── CYCLING TYPEWRITER WORDS ──────────────────────────────────────────
const CYCLING_WORDS = [
  { word: 'UNFORGETTABLE', from: '#00F5FF', to: '#39FF14' },
  { word: 'ELECTRIFYING',  from: '#FF3CAC', to: '#FFD700' },
  { word: 'EUPHORIC',      from: '#FFD700', to: '#FF6B35' },
];

// ─── TYPEWRITER ────────────────────────────────────────────────────────
function TypewriterWord() {
  const [wordIdx, setWordIdx]     = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase]         = useState('typing');
  const current = CYCLING_WORDS[wordIdx];

  useEffect(() => {
    let timer;
    if (phase === 'typing') {
      if (displayed.length < current.word.length) {
        timer = setTimeout(() => setDisplayed(current.word.slice(0, displayed.length + 1)), 70);
      } else {
        timer = setTimeout(() => setPhase('pause'), 100);
      }
    } else if (phase === 'pause') {
      timer = setTimeout(() => setPhase('deleting'), 2200);
    } else if (phase === 'deleting') {
      if (displayed.length > 0) {
        timer = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
      } else {
        setWordIdx(i => (i + 1) % CYCLING_WORDS.length);
        setPhase('typing');
      }
    }
    return () => clearTimeout(timer);
  }, [phase, displayed, current.word]);

  return (
    <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
      <span style={{
        display: 'inline-block',
        backgroundImage: `linear-gradient(90deg,${current.from},${current.to})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        color: 'transparent',
      }}>
        {displayed || '\u00a0'}
      </span>
      <span style={{
        display: 'inline-block', width: '3px', height: '0.82em',
        background: current.from, marginLeft: '3px', verticalAlign: 'middle',
        animation: 'typewriterCursor 0.8s step-end infinite', borderRadius: 2,
      }} />
    </span>
  );
}

// ─── HERO SLIDESHOW ────────────────────────────────────────────────────
function HeroSlideshow() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % HERO_IMAGES.length), 5500);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      {HERO_IMAGES.map((src, i) => (
        <div key={i} style={{ position: 'absolute', inset: 0, opacity: i === idx ? 1 : 0, transition: 'opacity 1.6s ease' }}>
          <img
            src={src}
            alt={i === 0 ? 'Euphoria Events — 360° Camera Booth in Lagos' : 'Event media rental Lagos'}
            style={{ width: '100%', height: '100%', objectFit: 'cover', animation: i === idx ? 'kenBurns 14s ease-in-out infinite' : 'none' }}
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : 'auto'}
          />
        </div>
      ))}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(8,1,15,.5) 0%,rgba(8,1,15,.15) 35%,rgba(8,1,15,.65) 75%,#08010F 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 100%,rgba(255,60,172,.15) 0%,transparent 70%)' }} />
      <div style={{ position: 'absolute', bottom: 44, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 7, zIndex: 2 }}>
        {HERO_IMAGES.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} aria-label={`Go to slide ${i + 1}`}
            style={{ width: i === idx ? 22 : 6, height: 6, borderRadius: 3, background: i === idx ? '#FF3CAC' : 'rgba(255,255,255,.3)', border: 'none', cursor: 'pointer', transition: 'all .35s' }} />
        ))}
      </div>
    </div>
  );
}

// ─── CALENDAR ─────────────────────────────────────────────────────────
function Calendar({ selectedDate, onSelect, blockedDates = [] }) {
  const today = new Date();
  const [y, setY] = useState(today.getFullYear());
  const [m, setM] = useState(today.getMonth());
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  const pad  = n => String(n).padStart(2, '0');
  const key  = d => `${y}-${pad(m + 1)}-${pad(d)}`;
  const first = new Date(y, m, 1).getDay();
  const total = new Date(y, m + 1, 0).getDate();
  const isPast = d => new Date(y, m, d) <= new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const cells  = [...Array(first).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];
  const prev   = () => (m === 0 ? (setM(11), setY(y - 1)) : setM(m - 1));
  const next   = () => (m === 11 ? (setM(0), setY(y + 1)) : setM(m + 1));
  return (
    <div style={{ background: 'rgba(255,255,255,.05)', borderRadius: 20, padding: 22, border: '1px solid rgba(255,255,255,.1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <button onClick={prev} aria-label="Previous month" style={{ background: 'none', border: '1px solid rgba(255,255,255,.2)', color: '#fff', borderRadius: 8, width: 34, height: 34, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>‹</button>
        <span style={{ fontFamily: 'var(--font-bebas, Bebas Neue, cursive)', fontSize: 21, letterSpacing: 3 }}>{MONTHS[m]} {y}</span>
        <button onClick={next} aria-label="Next month" style={{ background: 'none', border: '1px solid rgba(255,255,255,.2)', color: '#fff', borderRadius: 8, width: 34, height: 34, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>›</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3, marginBottom: 5 }}>
        {DAYS.map(d => <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.3)', letterSpacing: 1 }}>{d}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3 }}>
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} />;
          const past = isPast(d), booked = blockedDates.includes(key(d)), sel = selectedDate === key(d), dis = past || booked;
          return (
            <button key={d} onClick={() => !dis && onSelect(key(d))}
              aria-label={`${d} ${MONTHS[m]} ${y}${booked ? ' — booked' : past ? ' — past' : ''}`}
              aria-pressed={sel}
              style={{ aspectRatio: '1', borderRadius: 9, fontSize: 12, border: sel ? '2px solid #FF3CAC' : '2px solid transparent', background: sel ? 'linear-gradient(135deg,#FF3CAC,#784BA0)' : booked ? 'rgba(255,60,60,.1)' : past ? 'transparent' : 'rgba(255,255,255,.05)', color: past ? 'rgba(255,255,255,.18)' : booked ? 'rgba(255,100,100,.4)' : '#fff', cursor: dis ? 'not-allowed' : 'pointer', position: 'relative', fontFamily: 'var(--font-dm, DM Sans, sans-serif)', transition: 'all .15s' }}>
              {d}{booked && <span style={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', width: 3, height: 3, borderRadius: '50%', background: '#ff4444', display: 'block' }} />}
            </button>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 14, marginTop: 14, fontSize: 10, color: 'rgba(255,255,255,.38)' }}>
        {[['#ff4444','Booked'],['#FF3CAC','Selected'],['rgba(255,255,255,.2)','Available']].map(([c, l]) => (
          <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: c, display: 'inline-block' }} />{l}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── VENUE INPUT ──────────────────────────────────────────────────────
function VenueInput({ value, onChange }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [open, setOpen]               = useState(false);
  const debounceRef = useRef(null);
  const wrapRef     = useRef(null);

  const fetchSuggestions = async (input) => {
    if (!input || input.length < 3) { setSuggestions([]); setOpen(false); return; }
    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(input)}&format=json&limit=5&addressdetails=1&countrycodes=ng`,
        { headers: { 'Accept-Language': 'en', 'User-Agent': 'EuphoriaEvents/1.0 (booking@euphoria.events)' } }
      );
      const data = await res.json();
      const results = data.map(p => p.display_name);
      const withFallback = results.includes(input) ? results : [...results, input].slice(0, 6);
      setSuggestions(withFallback);
      setOpen(true);
    } catch {
      setSuggestions([input]);
      setOpen(true);
    } finally { setLoading(false); }
  };

  const handleChange = e => {
    onChange(e.target.value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(e.target.value), 400);
  };

  const pick = s => { onChange(s); setSuggestions([]); setOpen(false); };

  useEffect(() => {
    const h = e => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 15, pointerEvents: 'none' }}>📍</span>
        <input type="text" value={value} onChange={handleChange} placeholder="Start typing your venue or address…"
          aria-label="Event venue"
          style={{ width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.09)', borderRadius: 11, padding: '12px 16px 12px 38px', color: '#fff', fontSize: 14, fontFamily: 'var(--font-dm)', transition: 'border-color .2s' }}
          onFocus={() => value.length >= 3 && setOpen(true)} />
        {loading && <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: 'rgba(255,255,255,.35)' }}>…</span>}
      </div>
      {open && suggestions.length > 0 && (
        <div role="listbox" style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: '#16022a', border: '1px solid rgba(255,255,255,.12)', borderRadius: 12, overflow: 'hidden', zIndex: 999, boxShadow: '0 12px 40px rgba(0,0,0,.6)' }}>
          {suggestions.map((s, i) => (
            <div key={i} role="option" onClick={() => pick(s)}
              style={{ padding: '11px 16px', fontSize: 13, color: 'rgba(255,255,255,.75)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 9, borderBottom: i < suggestions.length - 1 ? '1px solid rgba(255,255,255,.06)' : 'none' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,60,172,.12)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <span>📍</span>{s}
            </div>
          ))}
          <div style={{ padding: '7px 16px', fontSize: 10, color: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', gap: 5 }}>
            © OpenStreetMap contributors
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TERMS MODAL ──────────────────────────────────────────────────────
function TermsModal({ page, onClose }) {
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [onClose]);

  const isTerms = page === 'terms';
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(4,0,10,.92)', backdropFilter: 'blur(12px)', zIndex: 4000, animation: 'fadeIn .25s ease' }} />
      <div role="dialog" aria-modal="true" aria-label={isTerms ? 'Terms and Conditions' : 'Privacy Policy'}
        style={{ position: 'fixed', inset: 0, zIndex: 4001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: '#0e0120', border: '1px solid rgba(255,60,172,.25)', borderRadius: 24, width: '100%', maxWidth: 680, maxHeight: '85vh', display: 'flex', flexDirection: 'column', animation: 'scaleIn .3s ease', boxShadow: '0 32px 80px rgba(0,0,0,.7)' }}>
          <div style={{ padding: '22px 28px 18px', borderBottom: '1px solid rgba(255,255,255,.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#FF3CAC', fontWeight: 700, marginBottom: 4 }}>{isTerms ? 'Legal' : 'Privacy'}</div>
              <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: 26, letterSpacing: 3 }}>{isTerms ? 'TERMS & CONDITIONS' : 'PRIVACY POLICY'}</h2>
            </div>
            <button onClick={onClose} aria-label="Close" style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.15)', color: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>
          <div style={{ overflowY: 'auto', padding: '24px 28px', color: 'rgba(255,255,255,.65)', fontSize: 14, lineHeight: 1.9 }}>
            {isTerms ? (
              <>
                <p style={{ marginBottom: 16 }}><strong style={{ color: '#fff' }}>Last updated:</strong> 1 January 2026</p>
                {[
                  ['1. Booking & Deposits', 'All bookings require a non-refundable 30% deposit to secure your event date. The remaining balance is due no later than 7 days before the event.'],
                  ['2. Cancellations & Rescheduling', 'Cancellations made more than 30 days before the event will receive a credit note valid for 12 months. Cancellations within 30 days forfeit the deposit. Rescheduling is permitted once at no extra charge if requested at least 14 days in advance.'],
                  ['3. Event Day', 'Client is responsible for ensuring adequate space, power supply, and venue access for our equipment. Euphoria reserves the right to refuse service if conditions are deemed unsafe.'],
                  ['4. Deliverables', 'Digital deliverables are provided within the agreed timeframe post-event. Euphoria is not liable for delays caused by third-party platforms or force majeure events.'],
                  ['5. Intellectual Property', 'Euphoria retains the right to use event photos and videos for marketing purposes unless the client opts out in writing prior to the event.'],
                  ['6. Liability', 'Our maximum liability is limited to the total amount paid for services.'],
                  ['7. Governing Law', 'These terms are governed by the laws of the Federal Republic of Nigeria. Disputes shall be resolved through the courts of Lagos State.'],
                ].map(([h, b]) => (
                  <div key={h} style={{ marginBottom: 20 }}>
                    <div style={{ fontWeight: 700, color: '#FF3CAC', marginBottom: 6, fontSize: 13 }}>{h}</div>
                    <p>{b}</p>
                  </div>
                ))}
              </>
            ) : (
              <>
                <p style={{ marginBottom: 16 }}><strong style={{ color: '#fff' }}>Last updated:</strong> 1 January 2026</p>
                {[
                  ['Information We Collect', 'We collect personal information you provide during booking (name, email, phone number, event details, venue) and usage data when you interact with our website.'],
                  ['How We Use Your Information', 'Your information is used solely to process your booking, communicate with you about your event, and improve our offerings.'],
                  ['Data Sharing', 'We do not sell or share your personal data with third parties, except trusted service providers bound by confidentiality agreements.'],
                  ['Data Retention', 'We retain booking records for 3 years. You may request deletion of your data at any time by contacting us.'],
                  ['Media Rights', 'Photos and videos captured at your event may be used in our portfolio unless you request exclusion in writing before the event.'],
                  ['Security', 'We implement industry-standard security measures to protect your data.'],
                  ['Contact', `For privacy-related requests, contact us at ${BRAND.email} or ${BRAND.phone}.`],
                ].map(([h, b]) => (
                  <div key={h} style={{ marginBottom: 20 }}>
                    <div style={{ fontWeight: 700, color: '#00F5FF', marginBottom: 6, fontSize: 13 }}>{h}</div>
                    <p>{b}</p>
                  </div>
                ))}
              </>
            )}
          </div>
          <div style={{ padding: '16px 28px', borderTop: '1px solid rgba(255,255,255,.07)', flexShrink: 0, textAlign: 'center' }}>
            <button onClick={onClose} style={{ background: 'linear-gradient(135deg,#FF3CAC,#784BA0)', border: 'none', color: '#fff', padding: '10px 32px', borderRadius: 30, fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-dm)', cursor: 'pointer' }}>Got It</button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── MASONRY TILE ────────────────────────────────────────────────────
function MasonryTile({ m, i, color, onClick }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (m.type !== 'video' || !videoRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [m.type]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 700;
  const baseHeights = isMobile ? [280, 340, 300, 360, 280, 320, 360, 300, 340, 280, 320, 300] : [380, 460, 420, 500, 380, 440, 480, 410, 500, 390, 450, 420];
  const heights = baseHeights;
  const h = heights[i % heights.length];

  return (
    <div onClick={onClick}
      style={{ breakInside: 'avoid', marginBottom: 6, borderRadius: 10, overflow: 'hidden', cursor: 'pointer', position: 'relative', background: 'rgba(255,255,255,.04)', border: `1px solid ${color}18`, height: h, display: 'block' }}>
      {m.type === 'video' ? (
        <video ref={videoRef} src={m.url} muted playsInline loop preload="metadata"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <img src={m.url} alt={m.caption}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .3s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          loading={i < 6 ? 'eager' : 'lazy'} />
      )}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 8px 6px', background: 'linear-gradient(to top, rgba(8,1,15,.85) 0%, transparent 100%)', fontSize: 9, color: 'rgba(255,255,255,.7)', fontWeight: 600, letterSpacing: '0.05em', lineHeight: 1.3 }}>{m.caption}</div>
    </div>
  );
}

// ─── GALLERY MODAL ────────────────────────────────────────────────────
function GalleryModal({ galleryId, onClose }) {
  const gallery = GALLERIES[galleryId];
  const [lbIdx, setLbIdx] = useState(null);

  useEffect(() => {
    const h = e => {
      if (e.key === 'Escape') { if (lbIdx !== null) setLbIdx(null); else onClose(); }
      if (e.key === 'ArrowRight' && lbIdx !== null) setLbIdx(i => (i + 1) % gallery.media.length);
      if (e.key === 'ArrowLeft'  && lbIdx !== null) setLbIdx(i => (i - 1 + gallery.media.length) % gallery.media.length);
    };
    window.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [lbIdx, gallery, onClose]);

  if (!gallery) return null;

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(4,0,10,.95)', backdropFilter: 'blur(14px)', zIndex: 2000, animation: 'fadeIn .3s ease' }} />
      <div role="dialog" aria-modal="true" aria-label={`${gallery.label} gallery`}
        style={{ position: 'fixed', inset: 0, zIndex: 2001, display: 'flex', flexDirection: 'column', animation: 'slideUp .4s ease', isolation: 'isolate' }}>
        {/* Header — explicit bg + zIndex so it always renders above backdrop */}
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${gallery.color}30`, background: '#08010F', flexShrink: 0, zIndex: 2, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 20, letterSpacing: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{gallery.label}</span>
            <span style={{ fontSize: 10, color: gallery.color, background: `${gallery.color}22`, border: `1px solid ${gallery.color}44`, padding: '3px 10px', borderRadius: 20, letterSpacing: '0.15em', textTransform: 'uppercase', flexShrink: 0 }}>{gallery.tag}</span>
          </div>
          <button onClick={onClose} aria-label="Close gallery"
            style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', color: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: 12 }}>✕</button>
        </div>
        {/* Masonry brick grid — 3 cols, varying heights, videos autoplay in view */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          <div style={{ columns: 3, columnGap: 6 }}>
            {gallery.media.map((m, i) => (
              <MasonryTile key={i} m={m} i={i} color={gallery.color} onClick={() => setLbIdx(i)} />
            ))}
          </div>
        </div>
        {/* Footer CTA — explicit bg + zIndex so it always renders above backdrop */}
        <div style={{ padding: '14px 20px', borderTop: `1px solid ${gallery.color}25`, background: '#08010F', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, zIndex: 2, position: 'relative', gap: 12 }}>
          <p style={{ color: 'rgba(255,255,255,.45)', fontSize: 13, margin: 0 }}>Want memories like these?</p>
          <button onClick={onClose}
            style={{ background: `linear-gradient(135deg,${gallery.color},${gallery.color}99)`, border: 'none', color: '#000', padding: '10px 24px', borderRadius: 30, fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-dm)', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
            Book Your Event →
          </button>
        </div>
      </div>

      {/* Lightbox */}
      {lbIdx !== null && (
        <>
          <div onClick={() => setLbIdx(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.96)', zIndex: 3000, animation: 'fadeIn .2s ease' }} />
          <div style={{ position: 'fixed', inset: 0, zIndex: 3001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 60px' }}>
            {/* Close button — top right, always visible */}
            <button onClick={() => setLbIdx(null)} aria-label="Close image"
              style={{ position: 'absolute', top: 16, right: 16, width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.25)', color: '#fff', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>✕</button>
            {/* Prev */}
            <button onClick={() => setLbIdx(i => (i - 1 + gallery.media.length) % gallery.media.length)} aria-label="Previous image"
              style={{ position: 'absolute', left: 16, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', color: '#fff', width: 44, height: 44, borderRadius: '50%', fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
            {/* Image or Video + caption */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, maxWidth: '85vw' }}>
              {gallery.media[lbIdx].type === 'video' ? (
                <video src={gallery.media[lbIdx].url} controls autoPlay playsInline
                  style={{ maxWidth: '100%', maxHeight: '78vh', borderRadius: 16, objectFit: 'contain', boxShadow: '0 24px 80px rgba(0,0,0,.8)', background: '#000' }} />
              ) : (
                <img src={gallery.media[lbIdx].url} alt={gallery.media[lbIdx].caption}
                  style={{ maxWidth: '100%', maxHeight: '78vh', borderRadius: 16, objectFit: 'contain', animation: 'scaleIn .25s ease', boxShadow: '0 24px 80px rgba(0,0,0,.8)' }} />
              )}
              <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 13, margin: 0 }}>{gallery.media[lbIdx].caption} · {lbIdx + 1} / {gallery.media.length}</p>
            </div>
            {/* Next */}
            <button onClick={() => setLbIdx(i => (i + 1) % gallery.media.length)} aria-label="Next image"
              style={{ position: 'absolute', right: 16, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', color: '#fff', width: 44, height: 44, borderRadius: '50%', fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
            {/* Dot strip */}
            <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
              {gallery.media.map((_, i) => (
                <button key={i} onClick={() => setLbIdx(i)} aria-label={`Photo ${i + 1}`}
                  style={{ width: i === lbIdx ? 20 : 6, height: 6, borderRadius: 3, background: i === lbIdx ? '#FF3CAC' : 'rgba(255,255,255,.3)', border: 'none', cursor: 'pointer', transition: 'all .25s' }} />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

// ─── PACKAGE BOOKING MODAL ────────────────────────────────────────────
function PackageBookingModal({ pkg, onClose, blockedDates = [] }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [form, setForm]   = useState({ name: '', email: '', phone: '', eventType: '', venue: '', notes: '' });
  const [submitted, setSubmitted] = useState(false);
  const [agreed, setAgreed]       = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const [pkgSubmitting, setPkgSubmitting] = useState(false);
  const [pkgError, setPkgError]           = useState(null);
  const canSubmit = selectedDate && form.name && form.email && agreed;

  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [onClose]);

  const inputStyle = { width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.09)', borderRadius: 10, padding: '11px 15px', color: '#fff', fontSize: 14, fontFamily: 'var(--font-dm)', transition: 'border-color .2s' };

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(4,0,10,.9)', backdropFilter: 'blur(14px)', zIndex: 2000, animation: 'fadeIn .3s ease' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 2001, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '16px', overflowY: 'auto' }}>
        <div role="dialog" aria-modal="true" aria-label={`Book ${pkg.name} package`}
          style={{ background: '#0d0118', border: `2px solid ${pkg.color}44`, borderRadius: 28, width: '100%', maxWidth: 860, animation: 'scaleIn .35s ease', boxShadow: `0 32px 80px ${pkg.color}20`, marginTop: 'auto', marginBottom: 'auto' }}>
          {/* Header — sticky so X button stays visible while scrolling on mobile */}
          <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: `linear-gradient(135deg,${pkg.color}18,#0d0118)`, borderRadius: '26px 26px 0 0', position: 'sticky', top: 0, zIndex: 10 }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: pkg.color, fontWeight: 700, marginBottom: 4 }}>Package Booking</div>
              <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: 28, letterSpacing: 3 }}>{pkg.name.toUpperCase()} — <span style={{ color: pkg.color }}>₦{pkg.price.toLocaleString()}</span></h2>
            </div>
            <button onClick={onClose} aria-label="Close" style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.15)', color: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>

          {submitted ? (
            <div style={{ padding: '60px 28px', textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
              <h3 style={{ fontFamily: 'var(--font-bebas)', fontSize: 32, color: pkg.color, letterSpacing: 3, marginBottom: 12 }}>REQUEST RECEIVED!</h3>
              <p style={{ color: 'rgba(255,255,255,.6)', lineHeight: 1.8, maxWidth: 400, margin: '0 auto 24px' }}>
                We received your booking request for the <strong style={{ color: '#fff' }}>{pkg.name}</strong> package on {selectedDate && new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-NG', { month: 'long', day: 'numeric', year: 'numeric' })}. We&apos;ll reach out within 24 hours.
              </p>
              <button onClick={onClose} style={{ background: `linear-gradient(135deg,${pkg.color},${pkg.color}88)`, border: 'none', color: '#000', padding: '12px 32px', borderRadius: 30, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Close</button>
            </div>
          ) : (
            <div className="pkg-modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
              {/* Calendar */}
              <div style={{ padding: 28, borderRight: '1px solid rgba(255,255,255,.07)' }}>
                <h4 style={{ fontFamily: 'var(--font-bebas)', fontSize: 21, color: pkg.color, letterSpacing: 2, marginBottom: 20 }}>① PICK YOUR DATE</h4>
                <Calendar selectedDate={selectedDate} onSelect={setSelectedDate} blockedDates={blockedDates} />
                {selectedDate && (
                  <div style={{ marginTop: 14, padding: '10px 15px', background: `${pkg.color}12`, border: `1px solid ${pkg.color}30`, borderRadius: 10, fontSize: 13, color: pkg.color, fontWeight: 600 }}>
                    ✓ {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                )}
              </div>
              {/* Form */}
              <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 13 }}>
                <h4 style={{ fontFamily: 'var(--font-bebas)', fontSize: 21, color: '#00F5FF', letterSpacing: 2, marginBottom: 7 }}>② YOUR DETAILS</h4>
                {[{ k: 'name', label: 'Full Name', ph: 'Jane Doe', t: 'text' }, { k: 'email', label: 'Email', ph: 'jane@example.com', t: 'email' }, { k: 'phone', label: 'Phone', ph: '+234 800 000 0000', t: 'tel' }, { k: 'eventType', label: 'Event Type', ph: 'Wedding, Birthday, Corporate…', t: 'text' }].map(f => (
                  <div key={f.k}>
                    <label htmlFor={`pkg-${f.k}`} style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,.38)', marginBottom: 6, display: 'block', fontWeight: 600 }}>{f.label}</label>
                    <input id={`pkg-${f.k}`} type={f.t} placeholder={f.ph} value={form[f.k]} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))} style={inputStyle} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,.38)', marginBottom: 6, display: 'block', fontWeight: 600 }}>Venue / Address</label>
                  <VenueInput value={form.venue} onChange={v => setForm(p => ({ ...p, venue: v }))} />
                </div>
                <div>
                  <label htmlFor="pkg-notes" style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,.38)', marginBottom: 6, display: 'block', fontWeight: 600 }}>Additional Notes</label>
                  <textarea id="pkg-notes" rows={2} placeholder="Guest count, special requests…" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} style={{ ...inputStyle, resize: 'none' }} />
                </div>

                {/* Summary */}
                {(selectedDate && form.name && form.email) && (
                  <div style={{ background: `${pkg.color}12`, border: `1px solid ${pkg.color}30`, borderRadius: 12, padding: '13px 15px' }}>
                    <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: pkg.color, fontWeight: 700, marginBottom: 8 }}>Booking Summary</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,.65)', marginBottom: 3 }}>📦 {pkg.name} Package — ₦{pkg.price.toLocaleString()}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,.65)', marginBottom: form.venue ? 3 : 0 }}>📅 {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-NG', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                    {form.venue && <div style={{ fontSize: 12, color: 'rgba(255,255,255,.65)' }}>📍 {form.venue}</div>}
                  </div>
                )}

                {/* T&C */}
                <div onClick={() => setAgreed(a => !a)} style={{ display: 'flex', alignItems: 'flex-start', gap: 11, cursor: 'pointer', padding: '10px 13px', borderRadius: 10, background: agreed ? 'rgba(57,255,20,.07)' : 'rgba(255,255,255,.03)', border: `1px solid ${agreed ? 'rgba(57,255,20,.25)' : 'rgba(255,255,255,.08)'}`, transition: 'all .2s' }}>
                  <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${agreed ? '#39FF14' : 'rgba(255,255,255,.25)'}`, background: agreed ? '#39FF14' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2, transition: 'all .2s', fontSize: 11, color: '#000', fontWeight: 700 }}>
                    {agreed && '✓'}
                  </div>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', lineHeight: 1.7, margin: 0 }}>
                    I agree to the{' '}
                    <button onClick={e => { e.stopPropagation(); setShowTerms('terms'); }} style={{ background: 'none', border: 'none', color: pkg.color, cursor: 'pointer', fontSize: 12, textDecoration: 'underline', padding: 0 }}>Terms & Conditions</button>
                    {' '}and{' '}
                    <button onClick={e => { e.stopPropagation(); setShowTerms('policy'); }} style={{ background: 'none', border: 'none', color: pkg.color, cursor: 'pointer', fontSize: 12, textDecoration: 'underline', padding: 0 }}>Privacy Policy</button>
                  </p>
                </div>

                {showTerms && <TermsModal page={showTerms} onClose={() => setShowTerms(false)} />}

                {pkgError && (
                  <div style={{ background: 'rgba(255,60,60,.12)', border: '1px solid rgba(255,60,60,.3)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#ff6b6b' }}>
                    ⚠️ {pkgError}
                  </div>
                )}
                <button
                  onClick={async () => {
                    if (!canSubmit || pkgSubmitting) return;
                    setPkgSubmitting(true);
                    setPkgError(null);
                    try {
                      const res = await fetch('/api/bookings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          ...form,
                          date: selectedDate,
                          services: [pkg.name + ' Package'],
                          bookingType: 'package',
                        }),
                      });
                      let data = {};
                      const text = await res.text();
                      try { data = JSON.parse(text); } catch (_) { data = {}; }
                      if (!res.ok || !data.success) throw new Error(data.error || 'Booking failed. Please try again.');
                      setSubmitted(true);
                    } catch (err) {
                      setPkgError(err.message);
                    } finally {
                      setPkgSubmitting(false);
                    }
                  }}
                  aria-disabled={!canSubmit || pkgSubmitting}
                  style={{ padding: 14, borderRadius: 13, border: 'none', background: canSubmit && !pkgSubmitting ? `linear-gradient(135deg,${pkg.color},${pkg.color}88)` : 'rgba(255,255,255,.07)', color: '#fff', fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-dm)', opacity: canSubmit && !pkgSubmitting ? 1 : 0.38, cursor: canSubmit && !pkgSubmitting ? 'pointer' : 'not-allowed' }}>
                  {pkgSubmitting ? '⏳ Submitting…' : `🎉 Confirm ${pkg.name} Package Booking`}
                </button>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,.22)', textAlign: 'center' }}>No payment now — we&apos;ll confirm and send an invoice.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────
export default function HomePage() {
  const [expandedSvc, setExpandedSvc]   = useState(null);
  const [openFaq, setOpenFaq]           = useState(null);
  const [activeGallery, setActiveGallery] = useState(null);
  const [hovGal, setHovGal]             = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selSvc, setSelSvc]             = useState([]);
  const [selPkg, setSelPkg]             = useState(null);
  const [bookingTab, setBookingTab]     = useState('services');
  const [pkgModal, setPkgModal]         = useState(null);
  const [mobileMenu, setMobileMenu]     = useState(false);
  const [form, setForm]                 = useState({ name: '', email: '', phone: '', eventType: '', venue: '', notes: '' });
  const [agreed, setAgreed]             = useState(false);
  const [showTerms, setShowTerms]       = useState(false);
  const [submitted, setSubmitted]       = useState(false);
  const [scrolled, setScrolled]         = useState(false);
  const [blockedDates, setBlockedDates]   = useState([]);
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 2800);
    return () => clearTimeout(t);
  }, []);
  const [submitting, setSubmitting]       = useState(false);
  const [submitError, setSubmitError]     = useState(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  // Fetch live blocked dates from Google Calendar
  const fetchBlockedDates = () => {
    fetch(`/api/calendar/blocked-dates?t=${Date.now()}`)
      .then(r => r.json())
      .then(data => { if (data.blocked) setBlockedDates(data.blocked); })
      .catch(err => console.warn('Could not fetch blocked dates:', err));
  };

  useEffect(() => {
    fetchBlockedDates();
    const interval = setInterval(fetchBlockedDates, 30000); // re-fetch every 30s
    return () => clearInterval(interval);
  }, []);

  const scrollTo   = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const toggleSvc  = id => setSelSvc(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const canSubmit  = bookingTab === 'services'
    ? (selectedDate && selSvc.length > 0 && form.name && form.email && agreed)
    : (selectedDate && selPkg && form.name && form.email && agreed);

  const inputStyle = { width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.09)', borderRadius: 11, padding: '12px 16px', color: '#fff', fontSize: 14, fontFamily: 'var(--font-dm)', transition: 'border-color .2s' };

  return (
    <>
      {/* ── NAV ── */}
      <nav role="navigation" aria-label="Main navigation"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 36px', background: scrolled ? 'rgba(8,1,15,.88)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '1px solid rgba(255,255,255,.06)' : 'none', transition: 'all .3s' }}>
        <a href="/" aria-label="Euphoria Events home" style={{ fontFamily: 'var(--font-bebas)', fontSize: 26, letterSpacing: '0.1em', background: 'linear-gradient(90deg,#FF3CAC,#FFD700,#00F5FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textDecoration: 'none' }}>EUPHORIA</a>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div className="nav-links" style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
            {NAV_LINKS.filter(l => !l.cta).map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.68)', fontSize: 14, fontWeight: 500, fontFamily: 'var(--font-dm)', cursor: 'pointer', transition: 'color .2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#FF3CAC'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.68)'}>
                {l.label}
              </button>
            ))}
          </div>
          <button onClick={() => { setBookingTab('services'); scrollTo('booking'); }}
            style={{ background: 'none', border: '1px solid #FF3CAC', borderRadius: 30, padding: '7px 18px', color: '#FF3CAC', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-dm)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Book Now
          </button>
          <button className="hamburger" onClick={() => setMobileMenu(m => !m)} aria-label="Open menu" aria-expanded={mobileMenu}
            style={{ display: 'none', background: 'none', border: '1px solid rgba(255,255,255,.2)', borderRadius: 8, padding: '6px 10px', color: '#fff', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>☰</button>
        </div>
      </nav>

      {/* ── MOBILE MENU ── */}
      {mobileMenu && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1500, display: 'flex', flexDirection: 'column' }}>
          <div onClick={() => setMobileMenu(false)} style={{ flex: 1, background: 'rgba(0,0,0,.7)', backdropFilter: 'blur(6px)' }} />
          <div style={{ background: '#0d0118', borderTop: '1px solid rgba(255,60,172,.3)', padding: '24px 24px 40px', display: 'flex', flexDirection: 'column', gap: 4, animation: 'slideUp .25s ease' }}>
            {NAV_LINKS.map(l => (
              <button key={l.id} onClick={() => { scrollTo(l.id); setMobileMenu(false); }}
                style={{ background: l.cta ? 'linear-gradient(135deg,#FF3CAC,#784BA0)' : 'none', border: 'none', borderRadius: l.cta ? 30 : 0, padding: l.cta ? '14px 0' : '14px 0', color: '#fff', fontSize: l.cta ? 16 : 18, fontWeight: l.cta ? 700 : 500, fontFamily: 'var(--font-dm)', cursor: 'pointer', textAlign: l.cta ? 'center' : 'left', borderBottom: l.cta ? 'none' : '1px solid rgba(255,255,255,.06)', width: '100%', display: 'block' }}>
                {l.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <main>
        {/* ── HERO ── */}
        <section id="hero" aria-label="Hero"
          style={{ minHeight: '93vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', textAlign: 'center', padding: '60px 24px 130px' }}>
          <HeroSlideshow />
          {[{ c: '#FF3CAC', l: '5%', t: '15%', s: 360, d: '0s' }, { c: '#FFD700', l: '70%', t: '58%', s: 280, d: '2s' }, { c: '#00F5FF', l: '80%', t: '5%', s: 220, d: '3.5s' }].map((b, i) => (
            <div key={i} style={{ position: 'absolute', left: b.l, top: b.t, width: b.s, height: b.s, borderRadius: '50%', background: b.c, opacity: .08, filter: 'blur(70px)', animation: `float 9s ease-in-out ${b.d} infinite`, pointerEvents: 'none', zIndex: 1 }} />
          ))}
          <div className="fade-up" style={{ position: 'relative', zIndex: 2, maxWidth: 860 }}>
            <div style={{ display: 'inline-block', marginBottom: 26, background: 'rgba(255,60,172,.18)', border: '1px solid rgba(255,60,172,.4)', borderRadius: 30, padding: '6px 22px', fontSize: 12, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#FF3CAC', backdropFilter: 'blur(10px)' }}>✨ {BRAND.tagline}</div>

            <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(58px,11vw,122px)', lineHeight: .9, letterSpacing: '0.04em', marginBottom: 26 }}>
              <span style={{ display: 'block', backgroundImage: 'linear-gradient(90deg,#FF3CAC,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', color: 'transparent' }}>MAKE EVERY</span>
              <span style={{ display: 'block', color: '#ffffff' }}>MOMENT</span>
              <span style={{ display: 'block', minHeight: '1.15em', overflow: 'hidden' }}><TypewriterWord /></span>
            </h1>

            <p style={{ fontSize: 17, color: 'rgba(255,255,255,.85)', lineHeight: 1.8, maxWidth: 520, margin: '0 auto 40px', fontWeight: 300, textShadow: '0 2px 20px rgba(0,0,0,.8)' }}>{BRAND.description}</p>

            <div className="hero-buttons" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-glow" onClick={() => { setBookingTab('services'); scrollTo('booking'); }}
                style={{ background: 'linear-gradient(135deg,#FF3CAC,#784BA0)', border: 'none', color: '#fff', padding: '15px 40px', borderRadius: 50, fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-dm)' }}>Book Your Date 🎉</button>
              <button className="btn-glow" onClick={() => scrollTo('services')}
                style={{ background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(12px)', border: '2px solid rgba(255,255,255,.3)', color: '#fff', padding: '15px 40px', borderRadius: 50, fontSize: 16, fontWeight: 600, fontFamily: 'var(--font-dm)' }}>Explore Services</button>
            </div>

          </div>

          {/* Stats bar — absolutely positioned so typewriter width NEVER affects it */}
          <div style={{ position: 'absolute', bottom: 28, left: 0, right: 0, zIndex: 3, display: 'flex', justifyContent: 'center', padding: '0 16px' }}>
            <div className="stats-bar" style={{ display: 'flex', gap: 0, background: 'rgba(8,1,15,.75)', backdropFilter: 'blur(20px)', borderRadius: 18, border: '1px solid rgba(255,255,255,.12)', padding: '16px 0', width: '100%', maxWidth: 560 }}>
              {STATS.map(({ value, label }, i) => (
                <div key={label} style={{ textAlign: 'center', flex: 1, padding: '0 10px', borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,.1)' : 'none' }}>
                  <div className="stat-value" style={{ fontFamily: 'var(--font-bebas)', fontSize: 34, letterSpacing: '0.04em', backgroundImage: 'linear-gradient(135deg,#FF3CAC,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{value}</div>
                  <div className="stat-label" style={{ fontSize: 9, color: 'rgba(255,255,255,.38)', textTransform: 'uppercase', letterSpacing: '0.18em', marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section id="about" aria-label="About Euphoria Events" style={{ padding: '96px 36px', background: 'linear-gradient(to bottom,#08010F,#0d0118)' }}>
          <div style={{ maxWidth: 1220, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}
            className="about-grid">
            <style>{`
              .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
              @media (max-width: 768px) { .about-grid { grid-template-columns: 1fr; gap: 48px; } }
              @keyframes floatA { 0%,100% { transform: translateY(0px) rotate(-2deg); } 50% { transform: translateY(-12px) rotate(2deg); } }
              @keyframes floatB { 0%,100% { transform: translateY(0px) rotate(2deg); } 50% { transform: translateY(-18px) rotate(-1deg); } }
              @keyframes floatC { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
            `}</style>

            {/* Left — Visual collage */}
            <div style={{ position: 'relative', height: 520 }}>
              {/* Main image */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '72%', height: '75%', borderRadius: 24, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,.6)', animation: 'floatA 6s ease-in-out infinite', border: '2px solid rgba(255,61,172,.2)' }}>
                <img src="https://res.cloudinary.com/dhahjsrtn/image/upload/v1773264400/Euphoria%20Events/PXL_20241130_161918346.PORTRAIT.ORIGINAL_pmrfml.jpg"
                  alt="Euphoria Events in action" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,1,15,.4) 0%, transparent 60%)' }} />
              </div>
              {/* Secondary image */}
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: '55%', height: '55%', borderRadius: 20, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,.5)', animation: 'floatB 7s ease-in-out infinite', border: '2px solid rgba(255,215,0,.2)' }}>
                <img src="https://res.cloudinary.com/dhahjsrtn/image/upload/v1773265341/Euphoria%20Events/BOS_1_zcfjyi.jpg"
                  alt="Euphoria Events gala" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              {/* Floating stat cards */}
              <div style={{ position: 'absolute', top: '42%', right: '-5%', background: 'rgba(13,1,24,.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,61,172,.3)', borderRadius: 16, padding: '14px 20px', boxShadow: '0 16px 40px rgba(255,61,172,.2)', animation: 'floatC 5s ease-in-out infinite', zIndex: 10 }}>
                <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 32, color: '#FF3CAC', lineHeight: 1 }}>500+</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', letterSpacing: '0.1em', marginTop: 2 }}>Events Covered</div>
              </div>
              <div style={{ position: 'absolute', top: '8%', right: '10%', background: 'rgba(13,1,24,.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,215,0,.3)', borderRadius: 16, padding: '12px 18px', boxShadow: '0 16px 40px rgba(255,215,0,.15)', animation: 'floatC 4s ease-in-out infinite .5s', zIndex: 10 }}>
                <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 28, color: '#FFD700', lineHeight: 1 }}>⭐ 5.0</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', letterSpacing: '0.1em', marginTop: 2 }}>Google Rating</div>
              </div>
              {/* Glow orb */}
              <div style={{ position: 'absolute', top: '30%', left: '20%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,61,172,.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
            </div>

            {/* Right — Text content */}
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#FF3CAC', fontWeight: 700, marginBottom: 14 }}>Our Story</div>
              <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(38px,5vw,62px)', letterSpacing: '0.04em', lineHeight: 1.05, marginBottom: 24 }}>
                WE DON'T JUST<br/><span style={{ background: 'linear-gradient(135deg,#FF3CAC,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CAPTURE MOMENTS</span><br/>WE CREATE THEM
              </h2>
              <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 15, lineHeight: 1.85, marginBottom: 20 }}>
                Euphoria Events is Lagos' premier event media company, bringing world-class 360° booths, smile cameras, audio guestbooks and cinematic videography to every celebration.
              </p>
              <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 14, lineHeight: 1.85, marginBottom: 36 }}>
                From intimate baby showers to grand corporate galas, we show up with our full energy, premium equipment and a passion for making your guests feel like stars. Every event deserves to be remembered — we make sure it is.
              </p>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 36 }}>
                {[
                  { num: '500+', label: 'Events', color: '#FF3CAC' },
                  { num: '5★', label: 'Rating', color: '#FFD700' },
                  { num: '3+', label: 'Years', color: '#00F5FF' },
                ].map(({ num, label, color }) => (
                  <div key={label} style={{ background: 'rgba(255,255,255,.04)', border: `1px solid ${color}22`, borderRadius: 16, padding: '18px 14px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 32, color, letterSpacing: 1 }}>{num}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <button onClick={() => scrollTo('booking')}
                  style={{ background: 'linear-gradient(135deg,#FF3CAC,#784BA0)', border: 'none', color: '#fff', padding: '14px 32px', borderRadius: 30, fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-dm)', cursor: 'pointer', letterSpacing: '0.05em' }}>
                  Book Your Event →
                </button>
                <button onClick={() => scrollTo('gallery')}
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,.15)', color: 'rgba(255,255,255,.7)', padding: '14px 32px', borderRadius: 30, fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-dm)', cursor: 'pointer' }}>
                  View Gallery
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── GALLERY ── */}
        <section id="gallery" aria-label="Event gallery" style={{ padding: '96px 36px', background: 'linear-gradient(to bottom,#0b0118,#08010F)' }}>
          <div style={{ maxWidth: 1220, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#FFD700', fontWeight: 700, marginBottom: 14 }}>Real Moments</div>
              <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(38px,6vw,70px)', letterSpacing: '0.05em' }}>THE EUPHORIA EFFECT</h2>
              <p style={{ color: 'rgba(255,255,255,.4)', marginTop: 10, fontSize: 15 }}>Step inside the moments that mattered. Relive the experience.</p>
            </div>
            <style>{`
              .gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 280px; gap: 14px; }
              @media (max-width: 700px) {
                .gallery-grid { grid-template-columns: repeat(2, 1fr) !important; grid-auto-rows: 200px !important; }
                .gal-tile { grid-column: span 1 !important; }
              }
            `}</style>
            <div className="gallery-grid">
              {GALLERY_TILES.map(tile => {
                const gallery = GALLERIES[tile.id];
                const hov = hovGal === tile.id;
                const videoCount = gallery.media.filter(m => m.type === 'video').length;
                return (
                  <article key={tile.id} className="gal-tile"
                    onMouseEnter={() => setHovGal(tile.id)} onMouseLeave={() => setHovGal(null)}
                    onClick={() => setActiveGallery(tile.id)}
                    style={{ gridColumn: `span ${tile.span}`, border: `1px solid ${gallery.color}28`, cursor: 'pointer', borderRadius: 18, overflow: 'hidden', position: 'relative', background: '#0c0119' }}
                    role="button" tabIndex={0} aria-label={`View ${gallery.label} gallery`}
                    onKeyDown={e => e.key === 'Enter' && setActiveGallery(tile.id)}>
                    <img src={gallery.cover} alt={`${gallery.label} — Euphoria Events`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s ease', transform: hov ? 'scale(1.05)' : 'scale(1)' }} loading="lazy" />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(8,1,15,.92) 0%,rgba(8,1,15,.2) 55%,transparent 100%)' }} />
                    <div style={{ position: 'absolute', inset: 0, background: `${gallery.color}18`, opacity: hov ? 1 : 0, transition: 'opacity .35s' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '18px 20px 16px' }}>
                      <div style={{ display: 'inline-block', fontSize: 10, color: gallery.color, letterSpacing: '0.18em', textTransform: 'uppercase', background: `${gallery.color}22`, border: `1px solid ${gallery.color}44`, padding: '3px 12px', borderRadius: 20, marginBottom: 7 }}>{gallery.tag}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                        <div style={{ fontFamily: 'var(--font-bebas)', fontSize: tile.span === 2 ? 24 : 19, letterSpacing: 2 }}>{gallery.label}</div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.45)', background: 'rgba(8,1,15,.6)', padding: '2px 10px', borderRadius: 20 }}>{gallery.media.length} items</div>
                          {videoCount > 0 && <div style={{ fontSize: 11, color: gallery.color, background: `${gallery.color}22`, padding: '2px 10px', borderRadius: 20 }}>▶ {videoCount} videos</div>}
                        </div>
                      </div>
                    </div>
                    <div style={{ position: 'absolute', top: '38%', left: '50%', transform: `translate(-50%,-50%) translateY(${hov ? 0 : 10}px)`, opacity: hov ? 1 : 0, transition: 'all .3s', background: 'rgba(8,1,15,.85)', backdropFilter: 'blur(12px)', padding: '10px 24px', borderRadius: 30, fontSize: 14, fontWeight: 700, border: `1px solid ${gallery.color}55`, whiteSpace: 'nowrap', color: gallery.color }}>
                      View Gallery ↗
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section id="services" aria-label="Our services" style={{ padding: '96px 36px', maxWidth: 1220, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#FF3CAC', fontWeight: 700, marginBottom: 14 }}>What We Offer</div>
            <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(38px,6vw,70px)', letterSpacing: '0.05em' }}>OUR SERVICES</h2>
            <p style={{ color: 'rgba(255,255,255,.4)', marginTop: 10, fontSize: 15 }}>Find your perfect fit. Discover what&apos;s inside.</p>
          </div>
          <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 22 }}>
            {SERVICES.map(s => {
              const open = expandedSvc === s.id;
              return (
                <article key={s.id} className="svc-card" onClick={() => setExpandedSvc(open ? null : s.id)}
                  style={{ borderRadius: 24, overflow: 'hidden', background: '#0c0119', border: `1px solid ${open ? s.color : 'rgba(255,255,255,.08)'}`, boxShadow: open ? `0 0 48px ${s.color}30,0 24px 56px rgba(0,0,0,.5)` : '0 8px 32px rgba(0,0,0,.35)' }}>
                  <div style={{ height: 210, overflow: 'hidden', position: 'relative' }}>
                    <img className="svc-img" src={SERVICE_IMAGES[s.id]} alt={`${s.title} — Euphoria Events Lagos`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom,transparent 25%,${s.color}60 80%,#0c0119 100%)` }} />
                    <div style={{ position: 'absolute', top: 12, right: 12, width: 30, height: 30, borderRadius: '50%', background: 'rgba(8,1,15,.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: s.color, border: `1px solid ${s.color}55`, transition: 'transform .25s', transform: open ? 'rotate(45deg)' : 'none' }}>+</div>
                    <div style={{ position: 'absolute', bottom: 14, left: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 42, height: 42, borderRadius: 11, background: 'rgba(8,1,15,.75)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, border: `1px solid ${s.color}55`, flexShrink: 0 }}>{s.emoji}</div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 21, letterSpacing: 2, lineHeight: 1, textShadow: '0 2px 10px rgba(0,0,0,.9)' }}>{s.title}</div>
                        <div style={{ fontSize: 11, color: s.color, letterSpacing: 1, marginTop: 1 }}>From ₦{s.startingPrice.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '16px 20px 20px' }}>
                    <p style={{ color: 'rgba(255,255,255,.58)', lineHeight: 1.7, fontSize: 13.5, marginBottom: 14 }}>{s.shortDesc}</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {[`⏱ ${s.duration}`, `👥 ${s.guests}`].map(t => (
                        <span key={t} style={{ fontSize: 11, background: 'rgba(255,255,255,.07)', padding: '3px 10px', borderRadius: 20, color: s.color }}>{t}</span>
                      ))}
                    </div>
                    {open && (
                      <div style={{ borderTop: '1px solid rgba(255,255,255,.07)', paddingTop: 14, marginTop: 14, marginBottom: 4, animation: 'fadeUp .25s ease' }}>
                        {s.features.map(f => (
                          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: 'rgba(255,255,255,.75)' }}>
                            <span style={{ color: s.color }}>✓</span>{f}
                          </div>
                        ))}
                      </div>
                    )}
                    <button className="btn-glow" onClick={e => { e.stopPropagation(); setBookingTab('services'); scrollTo('booking'); }}
                      style={{ width: '100%', background: s.gradient, border: 'none', color: '#fff', padding: '11px', borderRadius: 11, fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-dm)', marginTop: 16 }}>
                      Book This Service →
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ── PACKAGES ── */}
        <section id="packages" aria-label="Pricing packages" style={{ padding: '96px 36px', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#00F5FF', fontWeight: 700, marginBottom: 14 }}>Pricing</div>
            <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(38px,6vw,70px)', letterSpacing: '0.05em' }}>PICK YOUR VIBE</h2>
            <p style={{ color: 'rgba(255,255,255,.4)', marginTop: 10, fontSize: 15 }}>All packages include setup, breakdown, and a dedicated attendant.</p>
          </div>
          <div className="packages-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(275px,1fr))', gap: 22 }}>
            {PACKAGES.map(pkg => (
              <article key={pkg.id} className="pkg-card" style={{ borderRadius: 26, padding: 34, position: 'relative', overflow: 'hidden', background: pkg.best ? `linear-gradient(160deg,${pkg.color}18 0%,#0d0118 55%)` : 'rgba(255,255,255,.03)', border: `2px solid ${pkg.best ? pkg.color : 'rgba(255,255,255,.07)'}`, boxShadow: pkg.best ? `0 24px 64px ${pkg.color}22` : 'none' }}>
                {pkg.best && <div style={{ position: 'absolute', top: 18, right: 18, background: pkg.color, color: '#000', fontSize: 10, fontWeight: 800, padding: '4px 12px', borderRadius: 20, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Most Popular</div>}
                <div style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: pkg.color, marginBottom: 5, fontWeight: 700 }}>Package</div>
                <h3 style={{ fontFamily: 'var(--font-bebas)', fontSize: 38, letterSpacing: 3 }}>{pkg.name.toUpperCase()}</h3>
                <p style={{ color: 'rgba(255,255,255,.38)', fontSize: 12, marginBottom: 10 }}>{pkg.tagline}</p>
                <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 50, color: pkg.color, marginBottom: 22 }}>₦{pkg.price.toLocaleString()}</div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,.07)', paddingTop: 20, marginBottom: 22 }}>
                  {pkg.services.map(s => (
                    <div key={s} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginBottom: 11, fontSize: 13.5, color: 'rgba(255,255,255,.7)' }}>
                      <span style={{ color: pkg.color, flexShrink: 0, marginTop: 1 }}>✓</span>{s}
                    </div>
                  ))}
                </div>
                <button className="btn-glow" onClick={() => setPkgModal(pkg)}
                  style={{ width: '100%', padding: '13px', borderRadius: 13, border: 'none', background: pkg.best ? pkg.color : 'rgba(255,255,255,.07)', color: pkg.best ? '#000' : '#fff', fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-dm)' }}>
                  Book {pkg.name} →
                </button>
              </article>
            ))}
          </div>
        </section>

        {/* ── BOOKING ── */}
        <section id="booking" aria-label="Book your event" style={{ padding: '96px 36px', background: 'linear-gradient(to bottom,#0b0118,#08010F)' }}>
          <div style={{ maxWidth: 1060, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#FF3CAC', fontWeight: 700, marginBottom: 14 }}>Let&apos;s Party</div>
              <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(38px,6vw,70px)', letterSpacing: '0.05em' }}>BOOK YOUR DATE</h2>
              <p style={{ color: 'rgba(255,255,255,.4)', marginTop: 10 }}>Select your date, choose your services, and we&apos;ll take it from there.</p>
            </div>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
                <h3 style={{ fontFamily: 'var(--font-bebas)', fontSize: 42, letterSpacing: 3, marginBottom: 16 }}>YOU&apos;RE ON THE LIST!</h3>
                <p style={{ color: 'rgba(255,255,255,.55)', fontSize: 16, lineHeight: 1.8, marginTop: 12 }}>
                  We received your request for <strong style={{ color: '#fff' }}>{selectedDate && new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-NG', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>.<br />We&apos;ll reach out within 24 hours to confirm everything.
                </p>
                <button className="btn-glow" onClick={() => { setSubmitted(false); setSelectedDate(null); setSelSvc([]); setSelPkg(null); setBookingTab('services'); setForm({ name: '', email: '', phone: '', eventType: '', venue: '', notes: '' }); setAgreed(false); setSubmitError(null); }}
                  style={{ marginTop: 32, background: 'linear-gradient(135deg,#FF3CAC,#784BA0)', border: 'none', color: '#fff', padding: '14px 36px', borderRadius: 30, fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-dm)' }}>
                  Make Another Booking
                </button>
              </div>
            ) : (
              <div className="booking-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 44 }}>
                {/* Left — Calendar */}
                <div>
                  <h3 style={{ fontFamily: 'var(--font-bebas)', fontSize: 21, color: '#FF3CAC', letterSpacing: 2, marginBottom: 20 }}>① PICK YOUR DATE</h3>
                  <Calendar selectedDate={selectedDate} onSelect={setSelectedDate} blockedDates={blockedDates} />
                  {selectedDate && (
                    <div style={{ marginTop: 14, padding: '10px 15px', background: 'rgba(57,255,20,.08)', border: '1px solid rgba(57,255,20,.18)', borderRadius: 10, fontSize: 13, color: '#39FF14', fontWeight: 600 }}>
                      ✓ {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  )}
                </div>

                {/* Right — Service/Package + Form */}
                <div>
                  {/* Tab toggle */}
                  <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'rgba(255,255,255,.04)', borderRadius: 12, padding: 4, border: '1px solid rgba(255,255,255,.07)' }}>
                    {[{ id: 'services', label: '② Pick Services' }, { id: 'packages', label: '② Pick a Package' }].map(tab => (
                      <button key={tab.id} onClick={() => { setBookingTab(tab.id); setSelSvc([]); setSelPkg(null); }}
                        style={{ flex: 1, padding: '9px 14px', borderRadius: 9, border: 'none', background: bookingTab === tab.id ? '#FF3CAC' : 'transparent', color: bookingTab === tab.id ? '#fff' : 'rgba(255,255,255,.4)', fontWeight: bookingTab === tab.id ? 700 : 500, fontSize: 13, fontFamily: 'var(--font-dm)', cursor: 'pointer', transition: 'all .2s' }}>
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Services list */}
                  {bookingTab === 'services' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                      {SERVICES.map(s => {
                        const active = selSvc.includes(s.id);
                        return (
                          <div key={s.id} onClick={() => toggleSvc(s.id)}
                            style={{ padding: '10px 14px', borderRadius: 13, cursor: 'pointer', background: active ? `${s.color}15` : 'rgba(255,255,255,.04)', border: `1px solid ${active ? s.color : 'rgba(255,255,255,.07)'}`, display: 'flex', alignItems: 'center', gap: 12, transition: 'all .2s' }}
                            role="checkbox" aria-checked={active} tabIndex={0}>
                            <div style={{ width: 40, height: 40, borderRadius: 9, flexShrink: 0, border: `1px solid ${active ? s.color : 'rgba(255,255,255,.18)'}`, background: active ? `${s.color}18` : 'rgba(255,255,255,.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{s.emoji}</div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 600, fontSize: 14 }}>{s.title}</div>
                              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.38)', marginTop: 1 }}>{`${s.duration} · From ₦${s.startingPrice.toLocaleString()}`}</div>
                            </div>
                            <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${active ? s.color : 'rgba(255,255,255,.2)'}`, background: active ? s.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0, transition: 'all .2s' }}>{active && '✓'}</div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                      {PACKAGES.map(pkg => {
                        const active = selPkg === pkg.id;
                        return (
                          <div key={pkg.id} onClick={() => setSelPkg(active ? null : pkg.id)}
                            style={{ padding: '12px 14px', borderRadius: 13, cursor: 'pointer', background: active ? `${pkg.color}15` : 'rgba(255,255,255,.04)', border: `1px solid ${active ? pkg.color : 'rgba(255,255,255,.07)'}`, position: 'relative', transition: 'all .2s' }}
                            role="radio" aria-checked={active} tabIndex={0}>
                            {pkg.best && <div style={{ position: 'absolute', top: 10, right: 10, background: pkg.color, color: '#000', fontSize: 9, fontWeight: 800, padding: '2px 9px', borderRadius: 20 }}>Popular</div>}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{ flexShrink: 0 }}>
                                <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 22, letterSpacing: 2, color: active ? pkg.color : '#fff', lineHeight: 1 }}>{pkg.name.toUpperCase()}</div>
                                <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 18, color: pkg.color }}>₦{pkg.price.toLocaleString()}</div>
                              </div>
                              <div style={{ flex: 1, borderLeft: '1px solid rgba(255,255,255,.08)', paddingLeft: 12 }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 12px' }}>
                                  {pkg.services.slice(0, 3).map(s => (
                                    <span key={s} style={{ fontSize: 10, color: 'rgba(255,255,255,.5)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                      <span style={{ color: pkg.color, fontSize: 9 }}>✓</span>{s}
                                    </span>
                                  ))}
                                  {pkg.services.length > 3 && <span style={{ fontSize: 10, color: pkg.color }}>+{pkg.services.length - 3} more</span>}
                                </div>
                              </div>
                              <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${active ? pkg.color : 'rgba(255,255,255,.2)'}`, background: active ? pkg.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0, transition: 'all .2s' }}>{active && '✓'}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Form fields */}
                  <div style={{ marginTop: 24 }}>
                    <h4 style={{ fontFamily: 'var(--font-bebas)', fontSize: 21, color: '#00F5FF', letterSpacing: 2, marginBottom: 20 }}>③ YOUR DETAILS</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {[{ k: 'name', label: 'Full Name', ph: 'Jane Doe', t: 'text' }, { k: 'email', label: 'Email', ph: 'jane@example.com', t: 'email' }, { k: 'phone', label: 'Phone', ph: '+234 800 000 0000', t: 'tel' }, { k: 'eventType', label: 'Event Type', ph: 'Wedding, Birthday, Corporate…', t: 'text' }].map(f => (
                        <div key={f.k}>
                          <label htmlFor={`bk-${f.k}`} style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,.38)', marginBottom: 7, display: 'block', fontWeight: 600 }}>{f.label}</label>
                          <input id={`bk-${f.k}`} type={f.t} placeholder={f.ph} value={form[f.k]} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))} style={inputStyle} />
                        </div>
                      ))}
                      <div>
                        <label style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,.38)', marginBottom: 7, display: 'block', fontWeight: 600 }}>Venue / Address</label>
                        <VenueInput value={form.venue} onChange={v => setForm(p => ({ ...p, venue: v }))} />
                      </div>
                      <div>
                        <label htmlFor="bk-notes" style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,.38)', marginBottom: 7, display: 'block', fontWeight: 600 }}>Additional Notes</label>
                        <textarea id="bk-notes" rows={3} placeholder="Guest count, special requests…" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }} />
                      </div>

                      {/* Summary */}
                      {(selectedDate && (selSvc.length > 0 || selPkg) && form.name && form.email) && (
                        <div style={{ background: 'rgba(255,60,172,.08)', border: '1px solid rgba(255,60,172,.18)', borderRadius: 12, padding: 15 }}>
                          <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#FF3CAC', fontWeight: 700, marginBottom: 9 }}>Booking Summary</div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.62)', marginBottom: 3 }}>📅 {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-NG', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                          {form.venue && <div style={{ fontSize: 12, color: 'rgba(255,255,255,.62)', marginBottom: 3 }}>📍 {form.venue}</div>}
                          {bookingTab === 'services'
                            ? selSvc.map(id => { const s = SERVICES.find(x => x.id === id); return <div key={id} style={{ fontSize: 12, color: 'rgba(255,255,255,.62)', marginBottom: 3 }}>{s.emoji} {s.title}</div>; })
                            : (() => { const p = PACKAGES.find(x => x.id === selPkg); return p ? <div style={{ fontSize: 12, color: 'rgba(255,255,255,.62)' }}>{`📦 ${p.name} Package — ₦${p.price.toLocaleString()}`}</div> : null; })()
                          }
                        </div>
                      )}

                      {/* T&C */}
                      <div onClick={() => setAgreed(a => !a)} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', padding: '12px 14px', borderRadius: 11, background: agreed ? 'rgba(57,255,20,.07)' : 'rgba(255,255,255,.03)', border: `1px solid ${agreed ? 'rgba(57,255,20,.25)' : 'rgba(255,255,255,.08)'}`, transition: 'all .2s' }}
                        role="checkbox" aria-checked={agreed}>
                        <div style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${agreed ? '#39FF14' : 'rgba(255,255,255,.25)'}`, background: agreed ? '#39FF14' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, transition: 'all .2s', fontSize: 12, color: '#000', fontWeight: 700 }}>
                          {agreed && '✓'}
                        </div>
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', lineHeight: 1.7, margin: 0 }}>
                          I have read and agree to the{' '}
                          <button onClick={e => { e.stopPropagation(); setShowTerms('terms'); }} style={{ background: 'none', border: 'none', color: '#FF3CAC', cursor: 'pointer', fontFamily: 'var(--font-dm)', fontSize: 12, textDecoration: 'underline', padding: 0 }}>Terms & Conditions</button>
                          {' '}and{' '}
                          <button onClick={e => { e.stopPropagation(); setShowTerms('policy'); }} style={{ background: 'none', border: 'none', color: '#FF3CAC', cursor: 'pointer', fontFamily: 'var(--font-dm)', fontSize: 12, textDecoration: 'underline', padding: 0 }}>Privacy Policy</button>
                        </p>
                      </div>

                      {submitError && (
                        <div style={{ background: 'rgba(255,60,60,.12)', border: '1px solid rgba(255,60,60,.3)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#ff6b6b' }}>
                          ⚠️ {submitError}
                        </div>
                      )}
                      <button className="btn-glow"
                        onClick={async () => {
                          if (!canSubmit || submitting) return;
                          setSubmitting(true);
                          setSubmitError(null);
                          try {
                            const services = bookingTab === 'services'
                              ? selSvc.map(id => SERVICES.find(s => s.id === id)?.title).filter(Boolean)
                              : [PACKAGES.find(p => p.id === selPkg)?.name + ' Package'].filter(Boolean);
                            const res = await fetch('/api/bookings', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ ...form, date: selectedDate, services, bookingType: bookingTab }),
                            });
                            let data = {};
                            const text = await res.text();
                            try { data = JSON.parse(text); } catch (_) { data = {}; }
                            if (!res.ok || !data.success) throw new Error(data.error || 'Booking failed. Please try again.');
                            setSubmitted(true);
                            // Refresh blocked dates so the just-booked date greys out immediately
                            fetch('/api/calendar/blocked-dates').then(r => r.json()).then(d => { if (d.blocked) setBlockedDates(d.blocked); });
                          } catch (err) {
                            setSubmitError(err.message);
                          } finally {
                            setSubmitting(false);
                          }
                        }}
                        aria-disabled={!canSubmit || submitting}
                        style={{ padding: '16px', borderRadius: 14, border: 'none', background: canSubmit && !submitting ? 'linear-gradient(135deg,#FF3CAC,#784BA0)' : 'rgba(255,255,255,.07)', color: '#fff', fontWeight: 700, fontSize: 16, fontFamily: 'var(--font-dm)', opacity: canSubmit && !submitting ? 1 : .38, cursor: canSubmit && !submitting ? 'pointer' : 'not-allowed' }}>
                        {submitting ? '⏳ Submitting…' : '🎉 Confirm My Booking'}
                      </button>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,.22)', textAlign: 'center' }}>No payment now — we&apos;ll confirm availability and send an invoice.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── REVIEWS ── */}
        <section id="reviews" aria-label="Client reviews" style={{ padding: '96px 36px', background: 'linear-gradient(to bottom,#0d0118,#08010F)' }}>
          <div style={{ maxWidth: 1220, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#FFD700', fontWeight: 700, marginBottom: 14 }}>What They Say</div>
              <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(38px,6vw,70px)', letterSpacing: '0.05em' }}>CLIENT LOVE</h2>
              <p style={{ color: 'rgba(255,255,255,.4)', marginTop: 10, fontSize: 15 }}>Real moments. Real memories. Real reviews.</p>
              {/* Star rating summary */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 20 }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[1,2,3,4,5].map(i => <span key={i} style={{ fontSize: 24, color: '#FFD700' }}>★</span>)}
                </div>
                <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 32, color: '#FFD700', letterSpacing: 2 }}>5.0</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,.4)' }}>on Google</span>
              </div>
            </div>

            {/* Reviews grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 48 }}>
              {[
                { name: 'Adaeze Okafor', event: 'Wedding Reception', review: 'Euphoria Events made our wedding absolutely magical! The 360° booth had all our guests going crazy. The team was professional, fun and delivered beyond expectations. Best decision we made!', stars: 5, initial: 'A', color: '#FF3CAC' },
                { name: 'Emeka Nwosu', event: 'Corporate Gala', review: 'We hired Euphoria for our company\'s annual gala and they were outstanding. The setup was sleek, the smile booth had a queue all night, and the video highlights were cinematic. Highly recommend!', stars: 5, initial: 'E', color: '#FFD700' },
                { name: 'Blessing Adeyemi', event: 'Birthday Party', review: 'My 30th birthday was a dream come true thanks to Euphoria Events! The audio guestbook is something I\'ll treasure forever. Every guest loved it. They truly go above and beyond.', stars: 5, initial: 'B', color: '#00F5FF' },
                { name: 'Funmi Adeola', event: 'Baby Shower', review: 'I cannot stop raving about Euphoria Events! They turned my baby shower into a full production. The photos and videos were stunning. The team is so warm and talented.', stars: 5, initial: 'F', color: '#39FF14' },
                { name: 'Tunde Fashola', event: 'Graduation Party', review: 'From booking to delivery, everything was seamless. The 360 booth was a hit and the prints were gorgeous. Will definitely be booking again for our next event!', stars: 5, initial: 'T', color: '#FF6B35' },
                { name: 'Chioma Obi', event: 'Bridal Shower', review: 'Absolutely incredible experience! The team arrived early, set up beautifully and kept the energy high all evening. Our guests are still talking about it weeks later!', stars: 5, initial: 'C', color: '#784BA0' },
              ].map(({ name, event, review, stars, initial, color }) => (
                <div key={name}
                  style={{ background: 'rgba(255,255,255,.03)', border: `1px solid ${color}22`, borderRadius: 20, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 16, transition: 'transform .3s, box-shadow .3s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 20px 60px ${color}18`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  {/* Stars */}
                  <div style={{ display: 'flex', gap: 3 }}>
                    {[1,2,3,4,5].map(i => <span key={i} style={{ fontSize: 16, color: '#FFD700' }}>★</span>)}
                  </div>
                  {/* Review text */}
                  <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 14, lineHeight: 1.75, flex: 1 }}>"{review}"</p>
                  {/* Reviewer */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: '50%', background: `linear-gradient(135deg,${color},${color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: '#000', flexShrink: 0 }}>{initial}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>{name}</div>
                      <div style={{ fontSize: 12, color: color, letterSpacing: '0.05em' }}>{event}</div>
                    </div>
                    {/* Google G */}
                    <div style={{ marginLeft: 'auto', opacity: .4, fontSize: 18 }}>G</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Leave a review CTA */}
            <div style={{ textAlign: 'center' }}>
              <a href="https://g.page/r/CagVce2aZCPOEAI/review" target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'linear-gradient(135deg,#FFD700,#FF6B35)', color: '#000', padding: '14px 36px', borderRadius: 30, fontSize: 15, fontWeight: 700, textDecoration: 'none', letterSpacing: '0.05em' }}>
                ⭐ Leave Us a Review on Google
              </a>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" aria-label="Frequently asked questions" style={{ padding: '96px 36px', background: 'linear-gradient(to bottom,#0b0118,#08010F)' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#39FF14', fontWeight: 700, marginBottom: 14 }}>Got Questions?</div>
              <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(38px,6vw,70px)', letterSpacing: '0.05em' }}>FAQ</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {FAQS.map((item, i) => (
                <div key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ borderRadius: 14, overflow: 'hidden', cursor: 'pointer', background: 'rgba(255,255,255,.04)', border: `1px solid ${openFaq === i ? '#FF3CAC' : 'rgba(255,255,255,.07)'}`, transition: 'border-color .2s' }}
                  role="button" aria-expanded={openFaq === i} tabIndex={0}>
                  <div style={{ padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14 }}>
                    <h3 style={{ fontWeight: 600, fontSize: 15, margin: 0 }}>{item.q}</h3>
                    <span style={{ color: '#FF3CAC', fontSize: 22, flexShrink: 0, transform: openFaq === i ? 'rotate(45deg)' : '', transition: 'transform .2s', lineHeight: 1 }}>+</span>
                  </div>
                  {openFaq === i && <div style={{ padding: '0 20px 18px', color: 'rgba(255,255,255,.55)', lineHeight: 1.8, fontSize: 14 }}>{item.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ padding: '52px 36px 32px', borderTop: '1px solid rgba(255,255,255,.06)' }}>
        <div className="footer-grid" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 32, letterSpacing: '0.1em', backgroundImage: 'linear-gradient(90deg,#FF3CAC,#FFD700,#00F5FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 10 }}>EUPHORIA</div>
            <p style={{ color: 'rgba(255,255,255,.38)', fontSize: 13.5, lineHeight: 1.8, maxWidth: 260 }}>{BRAND.description}</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
              {[
                { label: 'Instagram', icon: '/icon-instagram.png', href: BRAND.socials.instagram },
                { label: 'TikTok',    icon: '/icon-tiktok.png',    href: BRAND.socials.tiktok },
                { label: 'Facebook',  icon: '/icon-facebook.png',  href: BRAND.socials.facebook },
                { label: 'YouTube',   icon: '/icon-youtube.png',   href: BRAND.socials.youtube },
                { label: 'WhatsApp',  icon: '/icon-whatsapp.png',  href: BRAND.socials.whatsapp },
              ].map(({ label, icon, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Follow us on ${label}`}
                  style={{ display: 'inline-block', cursor: 'pointer', textDecoration: 'none', transition: 'transform .2s, filter .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.12)'; e.currentTarget.style.filter = 'drop-shadow(0 4px 10px rgba(255,60,172,.5))'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'none'; }}>
                  <img src={icon} alt={label} width={44} height={44} style={{ display: 'block' }} />
                </a>
              ))}
            </div>
          </div>
          <nav aria-label="Footer navigation">
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.28)', marginBottom: 16 }}>Navigate</div>
            {['About', 'Services', 'Gallery', 'Packages', 'Reviews', 'FAQ', 'Booking'].map(l => (
              <button key={l} onClick={() => scrollTo(l.toLowerCase())} style={{ display: 'block', color: 'rgba(255,255,255,.48)', fontSize: 13.5, marginBottom: 10, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-dm)', textAlign: 'left', padding: 0 }}>{l}</button>
            ))}
          </nav>
          <address style={{ fontStyle: 'normal' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.28)', marginBottom: 16 }}>Contact</div>
            <p style={{ color: 'rgba(255,255,255,.48)', fontSize: 13.5, lineHeight: 2 }}>
              <a href={`mailto:${BRAND.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>📧 {BRAND.email}</a><br />
              <a href={`tel:${BRAND.phone.replace(/\s/g, '')}`} style={{ color: 'inherit', textDecoration: 'none' }}>📞 {BRAND.phone}</a><br />
              📍 {BRAND.address}
            </p>
          </address>
        </div>
        <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.2)' }}>© {new Date().getFullYear()} Euphoria. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <button onClick={() => setShowTerms('terms')} style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-dm)', textDecoration: 'underline' }}>Terms &amp; Conditions</button>
            <button onClick={() => setShowTerms('policy')} style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-dm)', textDecoration: 'underline' }}>Privacy Policy</button>
          </div>
        </div>
      </footer>

      {/* ── MODALS ── */}
      {activeGallery && <GalleryModal galleryId={activeGallery} onClose={() => setActiveGallery(null)} />}
      {pkgModal && <PackageBookingModal pkg={pkgModal} onClose={() => setPkgModal(null)} blockedDates={blockedDates} />}
      {showTerms && <TermsModal page={showTerms} onClose={() => setShowTerms(false)} />}

      {/* Splash Screen */}
      {splash && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: '#04000A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: splash ? 'none' : 'fadeOut .5s ease forwards' }}>
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            {/* Logo */}
            <img src="/favicon.png" alt="Euphoria Events" width={100} height={100}
              style={{ animation: 'splashLogo 1s ease forwards', opacity: 0 }} />
            {/* Brand name */}
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(32px,8vw,56px)', letterSpacing: '0.2em', background: 'linear-gradient(135deg,#FF3CAC,#FFD700,#FF3CAC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'splashText 1s ease .4s forwards', opacity: 0 }}>
              EUPHORIA EVENTS
            </div>
            {/* Tagline */}
            <div style={{ fontSize: 13, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', animation: 'splashText 1s ease .7s forwards', opacity: 0 }}>
              Capturing moments, creating memories
            </div>
            {/* Loading bar */}
            <div style={{ width: 180, height: 2, background: 'rgba(255,255,255,.1)', borderRadius: 2, overflow: 'hidden', marginTop: 16 }}>
              <div style={{ height: '100%', background: 'linear-gradient(90deg,#FF3CAC,#FFD700)', borderRadius: 2, animation: 'splashBar 2.4s ease forwards' }} />
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Floating Bubble */}
      <a href="https://wa.me/2347038565517?text=Hi%20Euphoria%20Events!%20I%27d%20like%20to%20make%20an%20enquiry."
        target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp"
        style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 9999, width: 60, height: 60, borderRadius: '50%', background: '#25D366', boxShadow: '0 4px 24px rgba(37,211,102,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', textDecoration: 'none', animation: 'waPulse 2s infinite' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </>
  );
}
