'use client';
import { useState, useEffect, useRef } from 'react';

export default function InvoicePage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', date: '', eventType: '', venue: '', services: '',
    invoiceNo: '', deposit: '', total: '', vat: '7.5', notes: '',
  });
  const [ready, setReady] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const printRef = useRef(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const today = new Date();
    const invoiceNo = `EE-${today.getFullYear()}${String(today.getMonth()+1).padStart(2,'0')}${String(today.getDate()).padStart(2,'0')}-${Math.floor(Math.random()*900)+100}`;
    const initServices = p.get('services') || '';
    const initList = initServices.split(',').filter(Boolean);
    const INIT_PRICES = {
      'spark': 550000, 'Spark': 550000,
      'euphoria': 1500000, 'Euphoria': 1500000,
      'ignite': 850000, 'Ignite': 850000,
      '360': 300000, '360°': 300000, '360° Camera Booth': 300000, '360 Booth': 300000,
      'smile': 350000, 'Smile': 350000, 'Smile Camera Booth': 350000, 'Smile Booth': 350000,
      'guestbook': 300000, 'Guestbook': 300000, 'Audio & Video Guestbook': 300000, 'Audio Guestbook': 300000,
      'videography': 250000, 'Videography': 250000, 'Mobile Videography': 250000,
    };
    const initTotal = initList.reduce((sum, s) => {
      const k = s.trim();
      if (INIT_PRICES[k]) return sum + INIT_PRICES[k];
      const found = Object.keys(INIT_PRICES).find(p => k.toLowerCase().includes(p.toLowerCase()));
      return sum + (found ? INIT_PRICES[found] : 0);
    }, 0);
    setForm({
      name:      p.get('name')      || '',
      email:     p.get('email')     || '',
      phone:     p.get('phone')     || '',
      date:      p.get('date')      || '',
      eventType: p.get('eventType') || '',
      venue:     p.get('venue')     || '',
      services:  initServices,
      invoiceNo,
      deposit: '', total: initTotal > 0 ? String(initTotal) : '', vat: '7.5', notes: 'Bank: Providus Bank\nAccount Number: 1307886609\nAccount Name: Perime Experiences Ltd\n\nPlease pay 30% deposit to confirm your booking. Balance is due 7 days before your event.',
    });
    setReady(true);
  }, []);

  const serviceList = form.services ? form.services.split(',').filter(Boolean) : [];

  const PRICES = {
    // Packages
    'spark': 550000, 'Spark': 550000,
    'euphoria': 1500000, 'Euphoria': 1500000,
    'ignite': 850000, 'Ignite': 850000,
    // Individual services
    '360': 300000, '360°': 300000, '360° Camera Booth': 300000, '360 Booth': 300000,
    'smile': 350000, 'Smile': 350000, 'Smile Camera Booth': 350000, 'Smile Booth': 350000,
    'guestbook': 300000, 'Guestbook': 300000, 'Audio & Video Guestbook': 300000, 'Audio Guestbook': 300000,
    'videography': 250000, 'Videography': 250000, 'Mobile Videography': 250000,
  };

  const autoTotal = serviceList.reduce((sum, s) => {
    const key = s.trim();
    // Check exact match first, then partial
    if (PRICES[key]) return sum + PRICES[key];
    const found = Object.keys(PRICES).find(k => key.toLowerCase().includes(k.toLowerCase()));
    return sum + (found ? PRICES[found] : 0);
  }, 0);

  const formatDate = d => {
    if (!d) return '';
    return new Date(d + 'T00:00:00').toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const totalNum   = parseFloat(form.total)   || 0;
  const depositNum = parseFloat(form.deposit) || 0;
  const vatRate    = parseFloat(form.vat)     || 0;
  const vatAmount  = Math.round(totalNum * vatRate / 100);
  const grandTotal = totalNum + vatAmount;
  const balance    = grandTotal - depositNum;

  const handlePrint = () => window.print();

  const handleSendToClient = async () => {
    if (!form.email) { alert('Client email is required'); return; }
    setSending(true);
    try {
      const params = new URLSearchParams({
        secret: 'euphoriacron123',
        name: form.name, email: form.email, date: form.date,
        eventType: form.eventType, venue: form.venue, services: form.services,
        total: form.total, deposit: form.deposit, vat: form.vat, notes: form.notes,
      });
      const res = await fetch(`/api/send-invoice?${params}`);
      if (res.ok) { setSent(true); setTimeout(() => setSent(false), 4000); }
      else { alert('Failed to send. Please try again.'); }
    } catch { alert('Network error. Please try again.'); }
    finally { setSending(false); }
  };

  if (!ready) return (
    <div style={{ minHeight: '100vh', background: '#04000A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Arial' }}>
      Loading...
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        body { background: #04000A; font-family: 'DM Sans', Arial, sans-serif; color: #fff; }
        .page { max-width: 860px; margin: 0 auto; padding: 32px 20px 80px; }
        .top-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; flex-wrap: wrap; gap: 12px; }
        .title { font-size: 22px; font-weight: 700; letter-spacing: 2px; color: #FFD700; }
        .btn { padding: 12px 28px; border-radius: 30px; border: none; cursor: pointer; font-size: 14px; font-weight: 700; font-family: inherit; }
        .btn-print { background: linear-gradient(135deg,#FFD700,#FF6B35); color: #000; }
        .btn-print:hover { opacity: .9; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 24px; }
        @media(max-width:600px){ .form-grid { grid-template-columns: 1fr; } }
        .field { display: flex; flex-direction: column; gap: 6px; }
        .field label { font-size: 11px; letter-spacing: .15em; text-transform: uppercase; color: rgba(255,255,255,.4); }
        .field input, .field textarea { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); border-radius: 10px; padding: 10px 14px; color: #fff; font-size: 14px; font-family: inherit; outline: none; }
        .field input:focus, .field textarea:focus { border-color: #FFD700; }
        .field textarea { resize: vertical; min-height: 70px; }
        .section-title { font-size: 11px; letter-spacing: .2em; text-transform: uppercase; color: rgba(255,255,255,.3); margin: 24px 0 12px; }
        .divider { border: none; border-top: 1px solid rgba(255,255,255,.07); margin: 24px 0; }

        /* ── PRINTABLE INVOICE ── */
        @media print {
          body { background: #fff !important; color: #000 !important; }
          .no-print { display: none !important; }
          .invoice { display: block !important; }
          .page { padding: 0; }
        }
        .invoice { display: none; }
        @media print { .invoice { display: block; } }

        /* Invoice preview always shown below form */
        .invoice-preview { margin-top: 40px; border: 1px solid rgba(255,215,0,.2); border-radius: 20px; overflow: hidden; }
        .inv-header { background: linear-gradient(135deg,#0d0118,#1a0030); padding: 36px 40px; display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 20px; }
        .inv-logo { font-size: 28px; font-weight: 900; letter-spacing: 4px; color: #FFD700; }
        .inv-logo span { display: block; font-size: 11px; letter-spacing: 2px; color: rgba(255,255,255,.4); font-weight: 400; margin-top: 4px; }
        .inv-meta { text-align: right; }
        .inv-meta h2 { font-size: 32px; letter-spacing: 4px; color: rgba(255,255,255,.15); margin-bottom: 8px; }
        .inv-meta p { font-size: 13px; color: rgba(255,255,255,.5); margin: 2px 0; }
        .inv-meta strong { color: #FFD700; }
        .inv-body { background: #fff; color: #000; padding: 36px 40px; }
        .inv-parties { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
        .inv-party h4 { font-size: 10px; letter-spacing: .2em; text-transform: uppercase; color: #999; margin-bottom: 8px; }
        .inv-party p { font-size: 14px; line-height: 1.7; color: #333; }
        .inv-party strong { color: #000; font-size: 16px; }
        .inv-table { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
        .inv-table th { background: #04000A; color: #FFD700; font-size: 11px; letter-spacing: .15em; text-transform: uppercase; padding: 10px 14px; text-align: left; }
        .inv-table td { padding: 12px 14px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333; }
        .inv-table tr:last-child td { border-bottom: none; }
        .inv-totals { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; margin-bottom: 28px; }
        .inv-totals .row { display: flex; gap: 48px; font-size: 14px; color: #555; }
        .inv-totals .row.balance { font-size: 16px; font-weight: 700; color: #000; border-top: 2px solid #000; padding-top: 8px; }
        .inv-totals .row span:last-child { min-width: 120px; text-align: right; }
        .inv-footer { background: #04000A; padding: 20px 40px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .inv-footer p { font-size: 12px; color: rgba(255,255,255,.4); }
        .inv-footer strong { color: #FFD700; }
        .inv-notes { background: #fffbf0; border-left: 3px solid #FFD700; padding: 14px 18px; border-radius: 4px; margin-bottom: 24px; font-size: 13px; color: #555; line-height: 1.6; }
      `}</style>

      <div className="page">
        {/* Top bar */}
        <div className="top-bar no-print">
          <div className="title">⚡ Generate Invoice</div>
          <button className="btn btn-print" onClick={handlePrint}>Print / Save PDF →</button>
          <button className="btn" onClick={handleSendToClient} disabled={sending}
            style={{background: sent ? 'linear-gradient(135deg,#39FF14,#00C851)' : 'linear-gradient(135deg,#FF3CAC,#784BA0)', color: '#fff', opacity: sending ? .7 : 1}}>
            {sending ? 'Sending...' : sent ? '✓ Sent to Client!' : 'Send to Client →'}
          </button>
        </div>

        {/* Editable fields */}
        <div className="no-print">
          <p className="section-title">Client & Event Info</p>
          <div className="form-grid">
            {[
              ['name','Client Name'],['email','Email'],['phone','Phone'],
              ['date','Event Date'],['eventType','Event Type'],['venue','Venue'],
            ].map(([key, label]) => (
              <div className="field" key={key}>
                <label>{label}</label>
                <input value={form[key]} onChange={e => {
                  const updated = {...form, [key]: e.target.value};
                  if (key === 'services') {
                    const list = e.target.value.split(',').filter(Boolean);
                    const auto = list.reduce((sum, s) => {
                      const k = s.trim();
                      if (PRICES[k]) return sum + PRICES[k];
                      const found = Object.keys(PRICES).find(p => k.toLowerCase().includes(p.toLowerCase()));
                      return sum + (found ? PRICES[found] : 0);
                    }, 0);
                    if (auto > 0) updated.total = String(auto);
                  }
                  setForm(updated);
                }} />
              </div>
            ))}
          </div>

          <p className="section-title">Invoice Details</p>
          <div className="form-grid">
            <div className="field">
              <label>Invoice No.</label>
              <input value={form.invoiceNo} onChange={e => setForm(f => ({...f, invoiceNo: e.target.value}))} />
            </div>
            <div className="field">
              <label>Total Amount (₦)</label>
              <input type="number" value={form.total} onChange={e => setForm(f => ({...f, total: e.target.value}))} placeholder="e.g. 550000" />
            </div>
            <div className="field">
              <label>Deposit / Amount Paid (₦)</label>
              <input type="number" value={form.deposit} onChange={e => setForm(f => ({...f, deposit: e.target.value}))} placeholder="e.g. 165000" />
            </div>
            <div className="field">
              <label>VAT (%)</label>
              <input type="number" value={form.vat} onChange={e => setForm(f => ({...f, vat: e.target.value}))} placeholder="7.5" step="0.1" />
            </div>
            <div className="field">
              <label>Services (comma separated)</label>
              <input value={form.services} onChange={e => setForm(f => ({...f, services: e.target.value}))} placeholder="360 Booth, Smile Booth" />
            </div>
          </div>
          <div className="field" style={{marginTop: 14}}>
            <label>Notes / Payment Instructions</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} placeholder="e.g. Please pay deposit to: GTBank 0123456789 — Euphoria Events Ltd" />
          </div>
          <hr className="divider" />
        </div>

        {/* Invoice Preview */}
        <div className="invoice-preview" ref={printRef}>
          <div className="inv-header">
            <div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6,marginBottom:6}}>
                <img src="/favicon.png" alt="Euphoria Events" width={36} height={36} style={{borderRadius:8,display:'block'}} />
                <div className="inv-logo" style={{textAlign:'center'}}>EUPHORIA<span>Events • Lagos, Nigeria</span></div>
              </div>
              <p style={{fontSize:12,color:'rgba(255,255,255,.4)',marginTop:8}}>booking@euphoria.events</p>
              <p style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>+234 703 856 5517</p>
            </div>
            <div className="inv-meta">
              <h2>INVOICE</h2>
              <p>Invoice No: <strong>{form.invoiceNo}</strong></p>
              <p>Issue Date: <strong>{new Date().toLocaleDateString('en-NG',{day:'numeric',month:'long',year:'numeric'})}</strong></p>
              <p>Event Date: <strong>{formatDate(form.date)}</strong></p>
            </div>
          </div>

          <div className="inv-body">
            <div className="inv-parties">
              <div className="inv-party">
                <h4>Billed To</h4>
                <p><strong>{form.name || '—'}</strong><br/>{form.email}<br/>{form.phone}<br/>{form.venue}</p>
              </div>
              <div className="inv-party">
                <h4>Event Details</h4>
                <p><strong>{form.eventType || '—'}</strong><br/>{formatDate(form.date)}<br/>{form.venue}</p>
              </div>
            </div>

            <table className="inv-table">
              <thead>
                <tr>
                  <th>Service / Package</th>
                  <th>Description</th>
                  <th style={{textAlign:'right'}}>Amount (₦)</th>
                </tr>
              </thead>
              <tbody>
                {serviceList.length > 0 ? serviceList.map((s, i) => (
                  <tr key={i}>
                    <td>{s.trim()}</td>
                    <td style={{color:'#888'}}>Event media service</td>
                    <td style={{textAlign:'right'}}>—</td>
                  </tr>
                )) : (
                  <tr><td colSpan={3} style={{color:'#aaa',textAlign:'center'}}>No services listed</td></tr>
                )}
                {totalNum > 0 && (
                  <tr style={{background:'#f9f9f9'}}>
                    <td colSpan={2} style={{fontWeight:700}}>Total Package</td>
                    <td style={{textAlign:'right',fontWeight:700}}>₦{totalNum.toLocaleString()}</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="inv-totals">
              <div className="row"><span>Subtotal</span><span>₦{totalNum.toLocaleString()}</span></div>
              {vatAmount > 0 && <div className="row"><span>VAT ({form.vat}%)</span><span>₦{vatAmount.toLocaleString()}</span></div>}
              {vatAmount > 0 && <div className="row" style={{fontWeight:600}}><span>Total (incl. VAT)</span><span>₦{grandTotal.toLocaleString()}</span></div>}
              <div className="row"><span>Deposit Paid</span><span style={{color:'green'}}>- ₦{depositNum.toLocaleString()}</span></div>
              <div className="row balance"><span>Balance Due</span><span>₦{balance.toLocaleString()}</span></div>
            </div>

            {form.notes && (
              <div className="inv-notes">
                <strong>Payment Instructions / Notes:</strong><br/>
                {form.notes.split('\n').map((line, i) => {
                  const isBankLine = line.startsWith('Bank:') || line.startsWith('Account Number:') || line.startsWith('Account Name:');
                  return line ? (
                    <span key={i} style={{display:'block', marginTop: i === 0 ? 6 : 2}}>
                      {isBankLine ? <strong>{line}</strong> : line}
                    </span>
                  ) : <br key={i} />;
                })}
              </div>
            )}
          </div>

          <div className="inv-footer">
            <p>Thank you for choosing <strong>Euphoria Events</strong> — we can't wait to capture your memories!</p>
            <p style={{fontSize:11}}>euphoria.events</p>
          </div>
        </div>
      </div>
    </>
  );
}
