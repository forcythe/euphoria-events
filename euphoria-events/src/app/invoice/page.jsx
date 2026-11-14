'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Btn, Chevron } from '@/components/ui';
import { priceFor, invoiceTotals, newInvoiceNo, naira, DEFAULT_INVOICE_NOTES } from '@/lib/pricing';

const KEY_STORE = 'ee-admin-key';

const fmtDate = d => (d ? new Date(`${d}T00:00:00`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '');
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
function defaultDue(eventDate) {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  if (!eventDate) { const d = new Date(now); d.setDate(d.getDate() + 7); return iso(d); }
  const d = new Date(`${eventDate}T00:00:00`); d.setDate(d.getDate() - 7);
  return iso(d < now ? now : d);
}
const shortDate = d => (d ? new Date(`${d}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '');
const today = () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

function Field({ id, label, value, onChange, type = 'text', full, ...rest }) {
  return (
    <div className={`fl${full ? ' full' : ''}`}>
      <input id={id} type={type} placeholder=" " value={value} onChange={e => onChange(e.target.value)} {...rest} />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Date field with a calendar dropdown, styled like the rest of the form     */
/* ------------------------------------------------------------------------ */
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function DateField({ id, label, value, onChange, min }) {
  const [open, setOpen] = useState(false);
  const base = value ? new Date(`${value}T00:00:00`) : new Date();
  const [y, setY] = useState(base.getFullYear());
  const [m, setM] = useState(base.getMonth());
  const wrap = useRef(null);
  const btn = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const d = value ? new Date(`${value}T00:00:00`) : new Date();
    setY(d.getFullYear()); setM(d.getMonth());
    const away = e => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    const esc = e => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); } };
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', esc);
    requestAnimationFrame(() => {
      const box = wrap.current;
      (box?.querySelector('.dp-day[aria-pressed="true"]') || box?.querySelector('.dp-day.today:not(:disabled)') || box?.querySelector('.dp-day:not(:disabled)'))?.focus();
    });
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('keydown', esc); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const first = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const key = d => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const todayKey = iso(new Date());
  const step = n => { const d = new Date(y, m + n, 1); setY(d.getFullYear()); setM(d.getMonth()); };
  const pick = k => { onChange(k); setOpen(false); btn.current?.focus(); };

  // Arrow keys move between days inside the grid
  const onGridKey = e => {
    const moves = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (!(e.key in moves)) return;
    e.preventDefault();
    const all = [...e.currentTarget.querySelectorAll('.dp-day:not(:disabled)')];
    const i = all.indexOf(document.activeElement);
    const next = all[Math.min(all.length - 1, Math.max(0, i + moves[e.key]))];
    next?.focus();
  };

  return (
    <div className={`fl dp${open ? ' open' : ''}`} ref={wrap}>
      <button ref={btn} id={id} type="button" className="es-btn dp-btn" aria-haspopup="dialog" aria-expanded={open}
        aria-labelledby={`${id}-lbl ${id}`} onClick={() => setOpen(o => !o)}>
        <span>{value ? new Date(`${value}T00:00:00`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }) : 'Choose a date'}</span>
        <svg className="dp-ico" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3.5" y="5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </button>
      <label id={`${id}-lbl`} htmlFor={id} className="up">{label}</label>
      {open && (
        <div className="dp-pop" role="dialog" aria-label={`Choose ${label.toLowerCase()}`}>
          <div className="dp-head">
            <button type="button" onClick={() => step(-1)} aria-label="Previous month"><Chevron dir="left" /></button>
            <span aria-live="polite">{MONTHS[m]} {y}</span>
            <button type="button" onClick={() => step(1)} aria-label="Next month"><Chevron /></button>
          </div>
          <div className="dp-grid" onKeyDown={onGridKey}>
            {DOW.map(d => <span key={d} className="dp-dow" aria-hidden="true">{d}</span>)}
            {cells.map((d, i) => {
              if (!d) return <span key={`e${i}`} aria-hidden="true" />;
              const k = key(d);
              return (
                <button key={k} type="button" className={`dp-day${k === todayKey ? ' today' : ''}`}
                  aria-pressed={k === value} disabled={Boolean(min) && k < min}
                  aria-label={new Date(`${k}T00:00:00`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  onClick={() => pick(k)}>{d}</button>
              );
            })}
          </div>
          <div className="dp-foot">
            <button type="button" className="linkish" onClick={() => pick(todayKey)} disabled={Boolean(min) && todayKey < min}>Today</button>
            {value && <button type="button" className="linkish" onClick={() => { onChange(''); setOpen(false); }}>Clear</button>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Admin key gate: the key is checked by the server when you send            */
/* ------------------------------------------------------------------------ */
function Eye({ off }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
      {off && <path d="M4 4l16 16" stroke="currentColor" strokeWidth="1.7" />}
    </svg>
  );
}

function KeyGate({ error, onSave }) {
  const [v, setV] = useState('');
  const [show, setShow] = useState(false);
  return (
    <div className="inv-gate on-light">
      <p className="kicker acc-l">Euphoria internal</p>
      <h1 className="disp">Invoice generator</h1>
      <p className="muted-l">Enter the admin key to send invoices and reminders from this device. It stays in this browser tab only.</p>
      <form onSubmit={e => { e.preventDefault(); if (v.trim()) onSave(v.trim()); }}>
        <div className="fl fl-reveal">
          <input id="admin-key" type={show ? 'text' : 'password'} placeholder=" " autoComplete="current-password"
            autoCapitalize="off" autoCorrect="off" spellCheck={false} value={v} onChange={e => setV(e.target.value)} />
          <label htmlFor="admin-key">Admin key</label>
          <button type="button" className="reveal" onClick={() => setShow(x => !x)}
            aria-label={show ? 'Hide admin key' : 'Show admin key'} aria-pressed={show} title={show ? 'Hide' : 'Show'}>
            <Eye off={show} />
          </button>
        </div>
        {error && <p className="err" role="alert">{error}</p>}
        <Btn variant="deep" block type="submit">Continue</Btn>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Invoice document: the same design as the invoice email                    */
/* ------------------------------------------------------------------------ */
function InvoicePaper({ form, lines, t }) {
  return (
    <article className="inv-paper" aria-label="Invoice preview">
      <header className="inv-head">
        <div className="inv-brand">
          <span className="logo">euphoria<i aria-hidden="true" /></span>
          <span className="inv-eyebrow">Issued {today()}</span>
        </div>
        <h2 className="disp">Invoice {form.invoiceNo}</h2>
        {form.dueDate && <div className="inv-duedate">Payment due by <strong>{shortDate(form.dueDate)}</strong></div>}
        <div className="inv-from">booking@euphoria.events · +234 703 856 5517 · Lagos, Nigeria</div>
      </header>
      <div className="inv-band" />
      <div className="inv-body">
        <div className="inv-parties">
          <div>
            <p className="inv-k">Billed to</p>
            <p className="inv-v">{form.name || 'Client name'}</p>
            <p className="inv-s">{form.email}</p>
            {form.phone && <p className="inv-s">{form.phone}</p>}
          </div>
          <div>
            <p className="inv-k">Event</p>
            <p className="inv-v">{form.eventType || 'Event'}</p>
            {form.date && <p className="inv-s">{fmtDate(form.date)}</p>}
            {form.venue && <p className="inv-s">{form.venue}</p>}
          </div>
        </div>

        <table className="inv-table">
          <thead><tr><th>Service or package</th><th>Amount</th></tr></thead>
          <tbody>
            {lines.length === 0 && <tr><td colSpan={2} className="inv-empty">Add services on the left</td></tr>}
            {lines.map(l => (
              <tr key={l.name}>
                <td>{l.name}<small>Event media service</small></td>
                <td>{l.price > 0 ? naira(l.price) : 'Quoted'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <dl className="inv-sums">
          <div><dt>Subtotal</dt><dd>{naira(t.subtotal)}</dd></div>
          {t.vatAmount > 0 && <div><dt>VAT ({t.vatRate}%)</dt><dd>{naira(t.vatAmount)}</dd></div>}
          <div className="strong"><dt>Total</dt><dd>{naira(t.grandTotal)}</dd></div>
          {t.paid > 0 && <div><dt>Deposit paid</dt><dd>− {naira(t.paid)}</dd></div>}
        </dl>
        <div className="inv-due"><span>Balance due{form.dueDate && <small>by {shortDate(form.dueDate)}</small>}</span><b className="disp">{naira(t.balance)}</b></div>

        {form.notes && (
          <div className="inv-notes">
            <p className="inv-k">Payment instructions</p>
            {form.notes.split('\n').map((line, i) => {
              const m = line.match(/^(Bank|Account Number|Account Name):\s*(.*)$/);
              return line ? <p key={i}>{m ? <>{m[1]}: <strong>{m[2]}</strong></> : line}</p> : <br key={i} />;
            })}
          </div>
        )}
        <p className="inv-thanks">Thank you for choosing Euphoria Events. We cannot wait to capture your celebration.</p>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------------ */
export default function InvoicePage() {
  const [ready, setReady] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [keyError, setKeyError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '', eventType: '', venue: '', services: '', invoiceNo: '', dueDate: '', deposit: '', vat: '7.5', notes: DEFAULT_INVOICE_NOTES });
  const [dueTouched, setDueTouched] = useState(false);
  const [prices, setPrices] = useState({});
  const [totalOverride, setTotalOverride] = useState('');
  const [mode, setMode] = useState('invoice');
  const [status, setStatus] = useState({ state: 'idle', msg: '' });

  // Prefill from the "Create invoice" link in the booking notification
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setForm(f => ({
      ...f,
      name: p.get('name') || '', email: p.get('email') || '', phone: p.get('phone') || '',
      date: p.get('date') || '', eventType: p.get('eventType') || '', venue: p.get('venue') || '',
      services: p.get('services') || '', invoiceNo: newInvoiceNo(),
    }));
    try { setAdminKey(sessionStorage.getItem(KEY_STORE) || ''); } catch { /* storage unavailable */ }
    setReady(true);
  }, []);

  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  // Due date follows the payment terms (balance 7 days before the event, never in the past)
  // until it is changed by hand.
  useEffect(() => {
    if (dueTouched) return;
    setForm(f => ({ ...f, dueDate: defaultDue(f.date) }));
  }, [form.date, dueTouched]);
  const serviceNames = useMemo(() => [...new Set(form.services.split(',').map(s => s.trim()).filter(Boolean))], [form.services]);

  // Each new service starts at its list price; edits are kept
  useEffect(() => {
    setPrices(prev => {
      const next = {};
      serviceNames.forEach(s => { next[s] = prev[s] !== undefined ? prev[s] : String(priceFor(s) || ''); });
      return next;
    });
  }, [serviceNames]);

  const lines = serviceNames.map(name => ({ name, price: parseFloat(prices[name]) || 0 }));
  const linesTotal = lines.reduce((s, l) => s + l.price, 0);
  const total = totalOverride !== '' ? totalOverride : String(linesTotal || '');
  const t = invoiceTotals({ total, deposit: form.deposit, vat: form.vat });

  // Suggest the balance reminder once a deposit is entered
  useEffect(() => { setMode(parseFloat(form.deposit) > 0 ? 'balance' : 'invoice'); }, [form.deposit]);

  const saveKey = k => { setAdminKey(k); setKeyError(''); try { sessionStorage.setItem(KEY_STORE, k); } catch { /* ignore */ } };
  const forgetKey = msg => { setAdminKey(''); setKeyError(msg || ''); try { sessionStorage.removeItem(KEY_STORE); } catch { /* ignore */ } };

  const send = async () => {
    if (!form.name || !form.email) { setStatus({ state: 'error', msg: 'Add the client name and email first.' }); return; }
    setStatus({ state: 'sending', msg: '' });
    try {
      const res = await fetch('/api/send-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify({ ...form, total, servicePrices: prices, type: mode }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) { forgetKey('That admin key was not accepted. Enter it again.'); setStatus({ state: 'idle', msg: '' }); return; }
      if (!res.ok || !data.ok) throw new Error(data.error || 'The email could not be sent.');
      setStatus({ state: 'sent', msg: `${mode === 'balance' ? 'Balance reminder' : 'Invoice'} sent to ${form.email}.` });
    } catch (err) {
      setStatus({ state: 'error', msg: err.message });
    }
  };

  if (!ready) return <main className="inv-page" />;
  if (!adminKey) return <main className="inv-page"><KeyGate error={keyError} onSave={saveKey} /></main>;

  return (
    <main className="inv-page">
      <div className="inv-top inv-ui">
        <span className="logo">euphoria<i aria-hidden="true" /></span>
        <span className="inv-title">Invoice generator</span>
        <button type="button" className="linkish inv-lock" onClick={() => forgetKey('')}>Lock</button>
      </div>

      <div className="inv-grid">
        <section className="inv-form on-light inv-ui" aria-label="Invoice details">
          <h2 className="disp">Client and event</h2>
          <div className="fields">
            <Field id="i-name" label="Client name" value={form.name} onChange={set('name')} />
            <Field id="i-email" label="Client email" type="email" value={form.email} onChange={set('email')} />
            <Field id="i-phone" label="Phone" type="tel" value={form.phone} onChange={set('phone')} />
            <DateField id="i-date" label="Event date" value={form.date} onChange={set('date')} />
            <Field id="i-type" label="Event type" value={form.eventType} onChange={set('eventType')} />
            <Field id="i-venue" label="Venue" value={form.venue} onChange={set('venue')} />
          </div>

          <h2 className="disp">Services and amounts</h2>
          <div className="fields">
            <Field id="i-services" label="Services or packages, separated by commas" value={form.services} onChange={set('services')} full />
          </div>
          {lines.length > 0 && (
            <ul className="inv-lines">
              {serviceNames.map(s => (
                <li key={s}>
                  <span>{s}</span>
                  <label className="sr-only" htmlFor={`p-${s}`}>Price for {s}</label>
                  <span className="cur">₦</span>
                  <input id={`p-${s}`} type="number" inputMode="numeric" min="0" value={prices[s] ?? ''} placeholder="0"
                    onChange={e => setPrices(p => ({ ...p, [s]: e.target.value }))} />
                </li>
              ))}
            </ul>
          )}
          <div className="fields">
            <Field id="i-total" label={`Subtotal (₦)${totalOverride === '' ? ', from the lines above' : ''}`} type="number" value={total}
              onChange={v => setTotalOverride(v === String(linesTotal) ? '' : v)} />
            <Field id="i-vat" label="VAT (%)" type="number" step="0.1" value={form.vat} onChange={set('vat')} />
            <Field id="i-deposit" label="Deposit received (₦)" type="number" value={form.deposit} onChange={set('deposit')} />
            <Field id="i-no" label="Invoice number" value={form.invoiceNo} onChange={set('invoiceNo')} />
            <DateField id="i-due" label="Payment due date" value={form.dueDate} min={iso(new Date())}
              onChange={v => { setDueTouched(true); set('dueDate')(v); }} />
            {dueTouched && (
              <div className="fl inv-reset">
                <button type="button" className="linkish" onClick={() => setDueTouched(false)}>Reset due date to 7 days before the event</button>
              </div>
            )}
          </div>

          <h2 className="disp">Payment instructions</h2>
          <div className="fields">
            <div className="fl full">
              <textarea id="i-notes" rows={7} placeholder=" " value={form.notes} onChange={e => set('notes')(e.target.value)} />
              <label htmlFor="i-notes">Shown at the bottom of the invoice</label>
            </div>
          </div>

          <div className="inv-actions">
            <div className="seg" role="tablist" aria-label="Email to send">
              <button type="button" role="tab" aria-selected={mode === 'invoice'} onClick={() => setMode('invoice')}>Invoice</button>
              <button type="button" role="tab" aria-selected={mode === 'balance'} onClick={() => setMode('balance')}>Balance reminder</button>
            </div>
            <div className="inv-btns">
              <Btn variant="deep" block disabled={status.state === 'sending'} onClick={send}>
                {status.state === 'sending' ? 'Sending' : mode === 'balance' ? 'Email balance reminder' : 'Email invoice to client'}
              </Btn>
              <Btn variant="ol" icon={false} block onClick={() => window.print()}>Print or save as PDF</Btn>
            </div>
            {status.state === 'sent' && <p className="inv-ok" role="status">{status.msg}</p>}
            {status.state === 'error' && <p className="err" role="alert">{status.msg}</p>}
          </div>
        </section>

        <div className="inv-preview">
          <p className="inv-ui inv-preview-label">Live preview</p>
          <InvoicePaper form={form} lines={lines} t={t} />
        </div>
      </div>
    </main>
  );
}
