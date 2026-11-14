'use client';

import { useEffect, useRef, useState } from 'react';
import { SERVICES, PACKAGES, EVENT_TYPES } from '@/lib/data';
import { TIME_SLOTS, formatTime, formatTimeRange } from '@/lib/time';
import { Btn, Chevron, naira, longDate } from './ui';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const pad = n => String(n).padStart(2, '0');

/* ------------------------------------------------------------------------ */
/* Calendar                                                                  */
/* ------------------------------------------------------------------------ */
export function Calendar({ selectedDate, onSelect, blockedDates = [] }) {
  const today = new Date();
  const [y, setY] = useState(today.getFullYear());
  const [m, setM] = useState(today.getMonth());
  const key = d => `${y}-${pad(m + 1)}-${pad(d)}`;
  const first = new Date(y, m, 1).getDay();
  const total = new Date(y, m + 1, 0).getDate();
  const isPast = d => new Date(y, m, d) <= new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const atStart = y === today.getFullYear() && m === today.getMonth();
  const cells = [...Array(first).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];
  const prev = () => { if (atStart) return; if (m === 0) { setM(11); setY(y - 1); } else setM(m - 1); };
  const next = () => { if (m === 11) { setM(0); setY(y + 1); } else setM(m + 1); };

  return (
    <div className="cal">
      <div className="cal-head">
        <button type="button" onClick={prev} aria-label="Previous month" disabled={atStart} style={atStart ? { opacity: .35, cursor: 'not-allowed' } : undefined}>
          <Chevron dir="left" />
        </button>
        <span className="m" aria-live="polite">{MONTHS[m]} {y}</span>
        <button type="button" onClick={next} aria-label="Next month"><Chevron /></button>
      </div>
      <div className="cal-grid" role="group" aria-label={`${MONTHS[m]} ${y}`}>
        {DOW.map(d => <div key={d} className="cal-dow" aria-hidden="true">{d}</div>)}
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} aria-hidden="true" />;
          const k = key(d);
          const past = isPast(d);
          const booked = blockedDates.includes(k);
          const sel = selectedDate === k;
          return (
            <button
              key={k}
              type="button"
              className={`cal-day${booked ? ' booked' : ''}`}
              disabled={past || booked}
              aria-pressed={sel}
              aria-label={`${d} ${MONTHS[m]} ${y}${booked ? ', already booked' : ''}`}
              title={booked ? 'Already booked' : undefined}
              onClick={() => onSelect(k)}
            >
              {d}
            </button>
          );
        })}
      </div>
      <div className="cal-key" aria-hidden="true">
        <span><i style={{ background: 'var(--cloud)', border: '1px solid var(--mist)' }} />Available</span>
        <span><i style={{ background: 'var(--plum)' }} />Selected</span>
        <span><i className="k-booked" />Booked</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Venue input with local suggestions                                        */
/* ------------------------------------------------------------------------ */

function VenueInput({ id, value, onChange }) {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const wrap = useRef(null);
  const timer = useRef(null);

  // OpenStreetMap search across Nigeria: venue names and street addresses both work.
  // What the visitor typed is always offered too, so an unlisted address can still be used.
  const suggest = async input => {
    if (!input || input.length < 3) { setList([]); setOpen(false); return; }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(input)}&format=json&limit=5&addressdetails=1&countrycodes=ng`,
        { headers: { 'Accept-Language': 'en' } },
      );
      const data = await res.json();
      const found = [...new Set(data.map(p => p.display_name))];
      const options = found.includes(input) ? found : [...found, input].slice(0, 6);
      setList(options); setOpen(true);
    } catch {
      setList([input]); setOpen(true);
    }
  };

  useEffect(() => {
    const h = e => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => { document.removeEventListener('mousedown', h); clearTimeout(timer.current); };
  }, []);

  return (
    <div className="fl full" ref={wrap}>
      <input
        id={id}
        type="text"
        placeholder=" "
        autoComplete="off"
        value={value}
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        onChange={e => {
          onChange(e.target.value);
          clearTimeout(timer.current);
          const v = e.target.value;
          timer.current = setTimeout(() => suggest(v), 400);
        }}
        onFocus={() => list.length && setOpen(true)}
        onKeyDown={e => { if (e.key === 'Escape') setOpen(false); }}
      />
      <label htmlFor={id}>Event venue</label>
      <span className="fl-hint">Search any venue or street address in Nigeria</span>
      {open && (
        <ul className="sugg" id={`${id}-list`} role="listbox">
          {list.map(s => (
            <li key={s} role="option" aria-selected={value === s}>
              <button type="button" onClick={() => { onChange(s); setOpen(false); }}>{s}</button>
            </li>
          ))}
          <li className="osm" role="presentation">Map data © OpenStreetMap contributors</li>
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Picker: a styled listbox used for event type and times                    */
/* ------------------------------------------------------------------------ */
function Picker({ id, label, value, onChange, options, required, placeholder = 'Select' }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrap = useRef(null);
  const btn = useRef(null);
  const list = useRef(null);
  const current = options.find(o => o.value === value);

  useEffect(() => {
    const h = e => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => {
    if (!open) return;
    const i = Math.max(0, options.findIndex(o => o.value === value));
    setActive(i);
    requestAnimationFrame(() => {
      list.current?.focus();
      list.current?.querySelector(`#${CSS.escape(`${id}-o${i}`)}`)?.scrollIntoView({ block: 'nearest' });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (open) list.current?.querySelector(`#${CSS.escape(`${id}-o${active}`)}`)?.scrollIntoView({ block: 'nearest' });
  }, [active, open, id]);

  const choose = v => { onChange(v); setOpen(false); btn.current?.focus(); };
  const onKey = e => {
    const n = options.length;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(i => (i + 1) % n); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(i => (i - 1 + n) % n); }
    else if (e.key === 'Home') { e.preventDefault(); setActive(0); }
    else if (e.key === 'End') { e.preventDefault(); setActive(n - 1); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(options[active].value); }
    else if (e.key === 'Escape' || e.key === 'Tab') { setOpen(false); if (e.key === 'Escape') btn.current?.focus(); }
    else if (/^[a-z0-9]$/i.test(e.key)) {
      const i = options.findIndex(o => o.label.toLowerCase().startsWith(e.key.toLowerCase()));
      if (i >= 0) setActive(i);
    }
  };

  return (
    <div className={`fl es${open ? ' open' : ''}${current ? ' filled' : ''}`} ref={wrap}>
      <button
        ref={btn}
        id={id}
        type="button"
        className="es-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-lbl ${id}`}
        disabled={options.length === 0}
        onClick={() => setOpen(o => !o)}
        onKeyDown={e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setOpen(true); } }}
      >
        <span className={current ? '' : 'ph-t'}>{current ? current.label : placeholder}</span>
        <span className="chev" aria-hidden="true"><Chevron dir="down" size={14} /></span>
      </button>
      <label id={`${id}-lbl`} htmlFor={id}>{label}{required && <> <span className="req">*</span></>}</label>
      <ul
        ref={list}
        className="es-list"
        role="listbox"
        tabIndex={-1}
        aria-labelledby={`${id}-lbl`}
        aria-activedescendant={open ? `${id}-o${active}` : undefined}
        onKeyDown={onKey}
        hidden={!open}
        data-lenis-prevent
      >
        {options.map((o, i) => (
          <li
            key={o.value}
            id={`${id}-o${i}`}
            role="option"
            aria-selected={value === o.value}
            className={i === active ? 'act' : undefined}
            onMouseEnter={() => setActive(i)}
            onClick={() => choose(o.value)}
          >
            <i aria-hidden="true" />{o.label}
            {value === o.value && (
              <svg className="tick" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.8" /></svg>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

const EVENT_OPTIONS = EVENT_TYPES.map(t => ({ value: t, label: t }));
const TIME_OPTIONS = TIME_SLOTS.map(t => ({ value: t, label: formatTime(t) }));

/* ------------------------------------------------------------------------ */
/* Booking form                                                              */
/* ------------------------------------------------------------------------ */
const EMPTY = { name: '', email: '', phone: '', eventType: '', startTime: '', endTime: '', venue: '', notes: '' };

/**
 * Used in the booking section and, with `fixedPkg`, inside the package drawer.
 * `preset` lets other sections pre-select services, a package or an event type
 * without clearing anything the visitor has already typed.
 */
export default function BookingForm({ idPrefix = 'bk', preset, fixedPkg, blockedDates, onBooked, onOpenLegal }) {
  const [date, setDate] = useState(null);
  const [mode, setMode] = useState('services');
  const [svc, setSvc] = useState([]);
  const [pkg, setPkg] = useState(fixedPkg?.id || null);
  const [form, setForm] = useState(EMPTY);
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);
  const [tried, setTried] = useState(false);

  useEffect(() => {
    if (!preset) return;
    if (preset.mode) setMode(preset.mode);
    if (preset.service) setSvc(p => (p.includes(preset.service) ? p : [...p, preset.service]));
    if (preset.pkg) setPkg(preset.pkg);
    if (preset.eventType) setForm(f => ({ ...f, eventType: preset.eventType }));
  }, [preset]);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const chosenPkg = PACKAGES.find(p => p.id === (fixedPkg?.id || pkg));
  const isPkg = Boolean(fixedPkg) || mode === 'packages';

  const missing = [
    !date && 'a date',
    !fixedPkg && mode === 'services' && svc.length === 0 && 'at least one service',
    !fixedPkg && mode === 'packages' && !pkg && 'a package',
    !form.name && 'your name',
    !form.email && 'your email',
    !form.startTime && 'a start time',
    !form.endTime && 'an end time',
    !agreed && 'agreement to the terms',
  ].filter(Boolean);
  const ready = missing.length === 0;

  const submit = async () => {
    setTried(true);
    if (!ready || busy) return;
    setBusy(true);
    setError(null);
    try {
      const services = isPkg
        ? [`${chosenPkg.name} Package`]
        : svc.map(id => SERVICES.find(s => s.id === id)?.title).filter(Boolean);
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, date, services, bookingType: fixedPkg ? 'package' : mode }),
      });
      let data = {};
      try { data = JSON.parse(await res.text()); } catch { data = {}; }
      if (!res.ok || !data.success) throw new Error(data.error || 'The booking did not go through. Check your connection and try again.');
      setDone(true);
      onBooked?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setDone(false); setDate(null); setSvc([]); setPkg(fixedPkg?.id || null);
    setForm(EMPTY); setAgreed(false); setError(null); setTried(false);
  };

  if (done) {
    return (
      <div className="done" role="status">
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="54" height="54" rx="12" stroke="var(--mist)" strokeWidth="2" />
          <path d="M17 29L25 37L40 20" stroke="var(--pink-l)" strokeWidth="3" />
        </svg>
        <h3 className="disp">Request received</h3>
        <p>
          We have your request for {isPkg ? `the ${chosenPkg.name} package` : 'your selected services'} on{' '}
          <strong style={{ color: 'var(--plum)' }}>{longDate(date)}, {formatTimeRange(form.startTime, form.endTime)}</strong>. We will contact you within 24 hours to confirm and send an invoice.
        </p>
        {!fixedPkg && <Btn variant="deep" onClick={reset}>Make another booking</Btn>}
      </div>
    );
  }


  let step = 0;
  const n = () => { step += 1; return step; };

  return (
    <div className={`book-grid${fixedPkg ? ' compact' : ''}`}>
      <div className="bf-col">
        <div>
          <div className="step-h"><span className="n">{n()}</span><h3 className="disp">Pick your date</h3></div>
          <Calendar selectedDate={date} onSelect={setDate} blockedDates={blockedDates} />
          <p className={`date-line${date ? '' : ' empty'}`} aria-live="polite">
            <i aria-hidden="true" />{date ? longDate(date, true) : 'No date selected yet'}
          </p>
        </div>
      </div>

      <div className="bf-col">
        {!fixedPkg && (
          <div>
            <div className="step-h"><span className="n">{n()}</span><h3 className="disp">Choose what you need</h3></div>
            <div className="seg" role="tablist" aria-label="Booking type">
              <button type="button" role="tab" aria-selected={mode === 'services'} onClick={() => setMode('services')}>Individual services</button>
              <button type="button" role="tab" aria-selected={mode === 'packages'} onClick={() => setMode('packages')}>A package</button>
            </div>
            {mode === 'services' ? (
              <div className="chips" role="group" aria-label="Services">
                {SERVICES.map(s => {
                  const on = svc.includes(s.id);
                  return (
                    <button key={s.id} type="button" className="chip-b" aria-pressed={on}
                      onClick={() => setSvc(p => (on ? p.filter(x => x !== s.id) : [...p, s.id]))}>
                      {s.title} <small>from {naira(s.startingPrice)}</small>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="prow" role="radiogroup" aria-label="Packages">
                {PACKAGES.map(p => (
                  <button key={p.id} type="button" role="radio" aria-checked={pkg === p.id} onClick={() => setPkg(p.id)}>
                    <span className="nm">{p.name}</span>
                    <span className="pr">{naira(p.price)}</span>
                    <span className="rd" aria-hidden="true" />
                    <span className="inc">{p.services.slice(0, 3).join(', ')}{p.services.length > 3 ? `, and ${p.services.length - 3} more` : ''}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div>
          <div className="step-h"><span className="n">{n()}</span><h3 className="disp">Your details</h3></div>
          <div className="fields">
            <div className="fl">
              <input id={`${idPrefix}-name`} type="text" placeholder=" " autoComplete="name" value={form.name} onChange={set('name')} required />
              <label htmlFor={`${idPrefix}-name`}>Full name <span className="req">*</span></label>
            </div>
            <div className="fl">
              <input id={`${idPrefix}-email`} type="email" placeholder=" " autoComplete="email" value={form.email} onChange={set('email')} required />
              <label htmlFor={`${idPrefix}-email`}>Email <span className="req">*</span></label>
            </div>
            <div className="fl">
              <input id={`${idPrefix}-phone`} type="tel" placeholder=" " autoComplete="tel" value={form.phone} onChange={set('phone')} />
              <label htmlFor={`${idPrefix}-phone`}>Phone</label>
            </div>
            <Picker id={`${idPrefix}-type`} label="Event type" placeholder="Select an event type" options={EVENT_OPTIONS}
              value={form.eventType} onChange={v => setForm(f => ({ ...f, eventType: v }))} />
            <Picker id={`${idPrefix}-start`} label="Start time" placeholder="Select a time" options={TIME_OPTIONS} required
              value={form.startTime}
              onChange={v => setForm(f => ({ ...f, startTime: v, endTime: f.endTime && f.endTime <= v ? '' : f.endTime }))} />
            <Picker id={`${idPrefix}-end`} label="End time" placeholder={form.startTime ? 'Select a time' : 'Pick a start time first'}
              options={form.startTime ? TIME_OPTIONS.filter(o => o.value > form.startTime) : []} required
              value={form.endTime} onChange={v => setForm(f => ({ ...f, endTime: v }))} />
            <VenueInput id={`${idPrefix}-venue`} value={form.venue} onChange={v => setForm(f => ({ ...f, venue: v }))} />
            <div className="fl full">
              <textarea id={`${idPrefix}-notes`} rows={2} placeholder=" " value={form.notes} onChange={set('notes')} />
              <label htmlFor={`${idPrefix}-notes`}>Guest count or special requests</label>
            </div>
          </div>
        </div>

        {date && (isPkg ? chosenPkg : svc.length > 0) && (
          <div className="summary">
            <p className="kicker acc-l">Booking summary</p>
            <dl>
              <div><dt>Date</dt><dd>{longDate(date)}</dd></div>
              {form.startTime && form.endTime && <div><dt>Time</dt><dd>{formatTimeRange(form.startTime, form.endTime)}</dd></div>}
              {isPkg
                ? <div><dt>{chosenPkg.name} package</dt><dd>{naira(chosenPkg.price)}</dd></div>
                : svc.map(id => {
                  const s = SERVICES.find(x => x.id === id);
                  return <div key={id}><dt>{s.title}</dt><dd>from {naira(s.startingPrice)}</dd></div>;
                })}
              {form.venue && <div><dt>Venue</dt><dd>{form.venue}</dd></div>}
            </dl>
          </div>
        )}

        <div className="submit-row">
          <div className="terms">
            <input id={`${idPrefix}-agree`} type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
            <label htmlFor={`${idPrefix}-agree`}>
              I agree to the{' '}
              <button type="button" className="linkish" onClick={() => onOpenLegal?.('terms')}>terms and conditions</button>
              {' '}and{' '}
              <button type="button" className="linkish" onClick={() => onOpenLegal?.('policy')}>privacy policy</button>.
            </label>
          </div>

          {error && <p className="err" role="alert">{error}</p>}
          {tried && !ready && (
            <p className="err" role="alert">To send your request, add {missing.join(', ').replace(/, ([^,]*)$/, ' and $1')}.</p>
          )}

          <Btn variant="deep" block disabled={!ready || busy} onClick={submit}>
            {busy ? 'Sending request' : isPkg && chosenPkg ? `Request the ${chosenPkg.name} package` : 'Request this booking'}
          </Btn>
          <p className="fine">No payment now. We confirm availability first, then send an invoice.</p>
        </div>
      </div>
    </div>
  );
}
