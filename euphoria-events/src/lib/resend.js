/**
 * Resend email helper
 *
 * Booking:   client confirmation and owner notification on every booking request.
 * Reminders: day-before reminder, balance reminder, post-event review request.
 * Invoices:  branded invoice email.
 *
 * All templates share the website's design via ./emailLayout.
 */
import { layout, esc, nl2br, para, heading, details, chips, callout, panel, button, buttons, C, FONT, DISPLAY } from './emailLayout';
import { priceFor, invoiceTotals, newInvoiceNo, naira, PAYMENT, DEFAULT_INVOICE_NOTES } from './pricing';
export { DEFAULT_INVOICE_NOTES };

const RESEND_API_KEY   = process.env.RESEND_API_KEY;
const FROM_EMAIL       = 'noreply@euphoria.events';
const NOTIFY_EMAIL     = 'booking@euphoria.events';
const RESEND_ENDPOINT  = 'https://api.resend.com/emails';
const SITE             = 'https://www.euphoria.events';
const REVIEW_URL       = 'https://g.page/r/CagVce2aZCPOEAI/review';



/** Send a single email via Resend */
async function sendEmail({ from, to, replyTo, subject, html }) {
  const key = process.env.RESEND_API_KEY || RESEND_API_KEY;
  if (!key) {
    console.warn('[resend] RESEND_API_KEY not set, skipping email');
    return null;
  }
  const res = await fetch(RESEND_ENDPOINT, {
    method:  'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, reply_to: replyTo, subject, html }),
  });
  if (!res.ok) throw new Error(`Resend error: ${await res.text()}`);
  return res.json();
}

// ── Formatting ────────────────────────────────────────────────────────
function formatTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'pm' : 'am'}`;
}
const timeRange = (s, e) => (s ? `${formatTime(s)}${e ? ` to ${formatTime(e)}` : ''}` : '');

function formatDate(dateStr, opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) {
  if (!dateStr) return '';
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-GB', opts);
}
const shortDate = d => formatDate(d, { day: 'numeric', month: 'long', year: 'numeric' });
/** "Wedding" -> "wedding" inside a sentence; acronyms such as "PTA" are left alone. */
const lc = v => { const t = String(v || 'event'); return /^[A-Z][a-z]/.test(t) ? t[0].toLowerCase() + t.slice(1) : t; };
const firstName = n => esc(String(n || '').trim().split(/\s+/)[0] || 'there');

// ── 1. Client confirmation ────────────────────────────────────────────
function clientEmailHTML({ name, date, eventType, venue, services, phone, notes, startTime, endTime }) {
  const content = [
    para(`We have received your booking request and our team is reviewing the details. We will be in touch within <strong>24 hours</strong> to confirm availability.`),
    callout(
      'We will send your invoice with a 30% deposit request. Your date is secured once the deposit is received; until then it is not yet confirmed.',
      { title: 'What happens next' },
    ),
    heading('Your request'),
    details([
      ['Date', esc(formatDate(date))],
      startTime && ['Time', esc(timeRange(startTime, endTime))],
      ['Event', esc(eventType || 'Not specified')],
      venue && ['Venue', esc(venue)],
      phone && ['Phone', esc(phone)],
      services?.length && ['Services', chips(services)],
      notes && ['Notes', `<span style="font-weight:400;">${nl2br(notes)}</span>`],
    ]),
    buttons([button(`${SITE}/#gallery`, 'See our latest events'), button(SITE, 'Visit euphoria.events', { variant: 'secondary' })]),
  ].join('');
  return layout({
    preheader: `We have your request for ${shortDate(date)} and will confirm within 24 hours.`,
    eyebrow: 'Booking request',
    title: `Thank you, ${String(name || '').trim().split(/\s+/)[0] || 'there'}. Your request is in.`,
    content,
  });
}

// ── 2. Owner notification ─────────────────────────────────────────────
function ownerEmailHTML({ name, email, phone, date, eventType, venue, notes, services, calEventLink, startTime, endTime }) {
  const invoiceLink = `${SITE}/invoice?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone || '')}&date=${encodeURIComponent(date)}&eventType=${encodeURIComponent(eventType || '')}&venue=${encodeURIComponent(venue || '')}&services=${encodeURIComponent((services || []).join(','))}`;
  const replySubject = encodeURIComponent(`Your Euphoria Events booking on ${shortDate(date)}`);
  const content = [
    para('A new booking request came in through the website. Review it and reply to the client within 24 hours.'),
    heading('Client'),
    details([
      ['Name', esc(name)],
      ['Email', `<a href="mailto:${esc(email)}" style="color:${C.pinkText};text-decoration:none;">${esc(email)}</a>`],
      ['Phone', phone ? `<a href="tel:${esc(phone.replace(/\s/g, ''))}" style="color:${C.pinkText};text-decoration:none;">${esc(phone)}</a>` : 'Not provided'],
    ]),
    heading('Event'),
    details([
      ['Date', esc(formatDate(date))],
      startTime && ['Time', esc(timeRange(startTime, endTime))],
      ['Type', esc(eventType || 'Not specified')],
      venue && ['Venue', esc(venue)],
      services?.length && ['Services', chips(services)],
      notes && ['Notes', `<span style="font-weight:400;">${nl2br(notes)}</span>`],
    ]),
    buttons([
      button(invoiceLink, 'Create invoice'),
      calEventLink ? button(calEventLink, 'Open in calendar', { variant: 'secondary' }) : '',
      button(`mailto:${email}?subject=${replySubject}`, 'Reply to client', { variant: 'secondary' }),
    ]),
    callout(
      'Reply to the client, send the deposit invoice (30% upfront), then change the Google Calendar event from <em>Tentative</em> to <em>Confirmed</em>.<br><br><strong>To decline:</strong> delete the calendar event and the date opens again on the website automatically.',
      { title: 'To confirm this booking' },
    ),
  ].join('');
  return layout({
    preheader: `${eventType || 'Event'}${venue ? `, ${venue}` : ''}`,
    eyebrow: 'New booking',
    title: `${name} wants ${shortDate(date)}`,
    content,
    internal: true,
  });
}

// ── Public: send both booking emails ─────────────────────────────────
export async function sendBookingEmails({ booking, calEventLink }) {
  const { name, email, phone, date, eventType, venue, notes, services, startTime, endTime } = booking;
  const results = { client: null, owner: null, errors: [] };

  try {
    results.client = await sendEmail({
      from:    `Euphoria Events <${FROM_EMAIL}>`,
      to:      email,
      replyTo: NOTIFY_EMAIL,
      subject: `We have your booking request for ${shortDate(date)}`,
      html:    clientEmailHTML({ name, date, eventType, venue, services, phone, notes, startTime, endTime }),
    });
  } catch (err) {
    console.error('[resend] Client email failed:', err.message);
    results.errors.push(`client: ${err.message}`);
  }

  try {
    results.owner = await sendEmail({
      from:    `Euphoria Bookings <${FROM_EMAIL}>`,
      to:      NOTIFY_EMAIL,
      replyTo: email,
      subject: `New booking request: ${name}, ${shortDate(date)}`,
      html:    ownerEmailHTML({ name, email, phone, date, eventType, venue, notes, services, calEventLink, startTime, endTime }),
    });
  } catch (err) {
    console.error('[resend] Owner email failed:', err.message);
    results.errors.push(`owner: ${err.message}`);
  }

  return results;
}

/** Reminder-style sends log failures instead of throwing, so one bad address never stops a batch. */
async function sendQuietly(label, msg) {
  try {
    return Boolean(await sendEmail(msg));
  } catch (err) {
    console.error(`[resend] ${label} failed:`, err.message);
    return false;
  }
}

// ── 3. Day-before reminder ────────────────────────────────────────────
export function reminderEmailHTML({ clientName, venue, eventType, date }) {
  const content = [
    para(`Everything is set for your <strong>${esc(lc(eventType))}</strong>. Our team will be there to set up before your guests arrive, so the experience is ready when they are.`),
    heading('Event details'),
    details([
      ['Date', esc(formatDate(date))],
      ['Event', esc(eventType)],
      venue && ['Venue', esc(venue)],
    ]),
    callout('Call or WhatsApp us on <strong>+234 703 856 5517</strong> as early as possible, and we will sort it out.', { title: 'Need to change anything?' }),
  ].join('');
  return layout({
    preheader: `Your ${lc(eventType)} is tomorrow. Here are the details.`,
    eyebrow: 'Event reminder',
    title: `See you tomorrow, ${String(clientName || '').trim().split(/\s+/)[0] || 'there'}.`,
    content,
  });
}

export async function sendReminderEmail({ clientEmail, clientName, venue, eventType, date }) {
  return sendQuietly('Reminder', {
    from: 'Euphoria Events <booking@euphoria.events>',
    to: [clientEmail],
    subject: `Tomorrow: your ${lc(eventType)} with Euphoria`,
    html: reminderEmailHTML({ clientName, venue, eventType, date }),
  });
}

// ── 4. Balance reminder (7 days before) ───────────────────────────────
function paymentPanel() {
  return panel(
    `Bank: <strong>${esc(PAYMENT.bank)}</strong><br>Account number: <strong>${esc(PAYMENT.accountNumber)}</strong><br>Account name: <strong>${esc(PAYMENT.accountName)}</strong>`,
    { title: 'Payment details', tone: 'gold' },
  );
}

export function balanceEmailHTML({ clientName, venue, eventType, date, total, deposit }) {
  const totalNum = parseFloat(total) || 0;
  const depositNum = parseFloat(deposit) || 0;
  const balance = totalNum - depositNum;
  const content = [
    para('This is a friendly reminder that the balance for your booking is due before the event.'),
    heading('Booking summary'),
    details([
      ['Date', esc(formatDate(date))],
      ['Event', esc(eventType)],
      venue && ['Venue', esc(venue)],
      totalNum > 0 && ['Total', naira(totalNum)],
      depositNum > 0 && ['Deposit paid', naira(depositNum)],
      balance > 0 && ['Balance due', `<span style="font-family:${DISPLAY};font-size:24px;color:${C.goldDeep};">${naira(balance)}</span>`],
    ]),
    paymentPanel(),
    para('If you have already paid in full, please ignore this message. Thank you.', { muted: true, size: 13 }),
  ].join('');
  return layout({
    preheader: balance > 0 ? `Balance due: ${naira(balance)}` : 'Balance reminder for your event',
    eyebrow: 'Payment reminder',
    title: `Your event is a week away, ${String(clientName || '').trim().split(/\s+/)[0] || 'there'}.`,
    content,
  });
}

export async function sendBalanceReminderEmail({ clientEmail, clientName, venue, eventType, date, total, deposit }) {
  return sendQuietly('Balance reminder', {
    from: 'Euphoria Events <booking@euphoria.events>',
    to: [clientEmail],
    subject: `Balance reminder: your ${lc(eventType)} on ${shortDate(date)}`,
    html: balanceEmailHTML({ clientName, venue, eventType, date, total, deposit }),
  });
}

// ── 5. Review request (after the event) ──────────────────────────────
export function reviewEmailHTML({ clientName, eventType }) {
  const content = [
    para(`Thank you for celebrating with Euphoria. We hope your guests loved every moment of your <strong>${esc(lc(eventType))}</strong>.`),
    para('If you have 30 seconds, a Google review helps other hosts find us, and it means a great deal to our team.'),
    buttons([button(REVIEW_URL, 'Leave a Google review', { chip: C.gold })]),
    panel(`Share your photos and videos on Instagram and tag <strong style="color:${C.goldDeep};">@euphoria.eventsng</strong>. We love seeing them.`, { title: 'Share the moments', tone: 'gold' }),
  ].join('');
  return layout({
    preheader: 'A quick review helps other hosts find us.',
    accent: 'gold',
    eyebrow: 'Thank you',
    title: `How was your ${lc(eventType)}, ${String(clientName || '').trim().split(/\s+/)[0] || 'there'}?`,
    content,
  });
}

export async function sendReviewRequestEmail({ clientEmail, clientName, eventType }) {
  return sendQuietly('Review request', {
    from: 'Euphoria Events <booking@euphoria.events>',
    to: [clientEmail],
    subject: `How was your ${lc(eventType)}?`,
    html: reviewEmailHTML({ clientName, eventType }),
  });
}

// ── 6. Invoice ────────────────────────────────────────────────────────
/**
 * @param {object}  p
 * @param {string}  [p.invoiceNo]      number shown on the generator page; generated if missing
 * @param {object}  [p.servicePrices]  per-line prices edited on the generator page
 */
export function invoiceEmailHTML({ clientEmail, clientName, eventType, date, venue, services, total, deposit, vat, notes, invoiceNo, servicePrices, dueDate }) {
  const due = /^\d{4}-\d{2}-\d{2}$/.test(dueDate || '') ? shortDate(dueDate) : '';
  const number = invoiceNo || newInvoiceNo();
  const issued = shortDate(new Date().toISOString().slice(0, 10));
  const lines = (services ? services.split(',') : []).map(s => s.trim()).filter(Boolean)
    .map(s => ({ name: s, price: servicePrices && servicePrices[s] !== undefined && servicePrices[s] !== '' ? parseFloat(servicePrices[s]) || 0 : priceFor(s) }));
  const t = invoiceTotals({ total, deposit, vat });
  const noteText = notes || DEFAULT_INVOICE_NOTES;
  const noteHtml = noteText.split('\n').map(line => {
    if (!line) return '<br>';
    const m = line.match(/^(Bank|Account Number|Account Name):\s*(.*)$/);
    return m ? `${esc(m[1])}: <strong>${esc(m[2])}</strong><br>` : `${esc(line)}<br>`;
  }).join('');

  const cell = `font-family:${FONT};font-size:14px;color:${C.plum};padding:12px 0;border-top:1px solid ${C.mist};`;
  const items = lines.map(l => `
      <tr>
        <td style="${cell}">${esc(l.name)}<br><span style="font-size:12px;color:${C.grey};">Event media service</span></td>
        <td align="right" style="${cell}font-weight:600;">${l.price > 0 ? naira(l.price) : 'Quoted'}</td>
      </tr>`).join('');
  const sumRow = (label, value, strong) => `
      <tr>
        <td align="right" style="font-family:${FONT};font-size:${strong ? 15 : 14}px;color:${strong ? C.plum : C.grey};padding:6px 16px 6px 0;${strong ? 'font-weight:700;' : ''}">${label}</td>
        <td align="right" style="font-family:${FONT};font-size:${strong ? 15 : 14}px;color:${C.plum};padding:6px 0;width:130px;${strong ? 'font-weight:700;' : ''}">${value}</td>
      </tr>`;

  const content = [
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-bottom:24px;"><tr>
      <td valign="top" width="50%" style="padding-right:12px;font-family:${FONT};">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${C.pinkText};">Billed to</p>
        <p style="margin:0;font-size:17px;font-weight:700;color:${C.plum};">${esc(clientName || 'Client')}</p>
        <p style="margin:4px 0 0;font-size:13px;color:${C.grey};">${esc(clientEmail || '')}</p>
      </td>
      <td valign="top" width="50%" style="padding-left:12px;font-family:${FONT};">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${C.pinkText};">Event</p>
        <p style="margin:0;font-size:17px;font-weight:700;color:${C.plum};">${esc(eventType || 'Event')}</p>
        ${date ? `<p style="margin:4px 0 0;font-size:13px;color:${C.grey};">${esc(formatDate(date))}</p>` : ''}
        ${venue ? `<p style="margin:4px 0 0;font-size:13px;color:${C.grey};">${esc(venue)}</p>` : ''}
      </td>
    </tr></table>`,
    due ? callout(`Please pay the balance of <strong>${naira(t.balance)}</strong> by <strong>${esc(due)}</strong>.`, { title: 'Payment due' }) : '',
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border-top:2px solid ${C.plum};">
      <tr>
        <td style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${C.grey};padding:12px 0 8px;">Service or package</td>
        <td align="right" style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${C.grey};padding:12px 0 8px;">Amount</td>
      </tr>${items}
    </table>`,
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border-top:1px solid ${C.mist};margin-top:4px;padding-top:6px;">
      ${sumRow('Subtotal', naira(t.subtotal))}
      ${t.vatAmount > 0 ? sumRow(`VAT (${t.vatRate}%)`, naira(t.vatAmount)) : ''}
      ${sumRow('Total', naira(t.grandTotal), true)}
      ${t.paid > 0 ? sumRow('Deposit paid', `&minus; ${naira(t.paid)}`) : ''}
    </table>`,
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;margin-top:14px;"><tr><td style="background:${C.plum};border-radius:12px;padding:16px 20px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="font-family:${FONT};font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${C.gold};">Balance due${due ? `<br><span style="font-size:13px;font-weight:400;letter-spacing:0;text-transform:none;color:#e4dee7;">by ${esc(due)}</span>` : ''}</td>
        <td align="right" style="font-family:${DISPLAY};font-size:26px;font-weight:700;color:${C.gold};">${naira(t.balance)}</td>
      </tr></table>
    </td></tr></table>`,
    panel(noteHtml, { title: 'Payment instructions', tone: 'gold' }),
    para('Thank you for choosing Euphoria Events. We cannot wait to capture your celebration.', { muted: true, size: 13, bottom: 0 }),
  ].join('');

  return layout({
    preheader: `Invoice ${number} for your ${lc(eventType)}: ${naira(t.balance)} due${due ? ` by ${due}` : ''}.`,
    eyebrow: `Issued ${issued}`,
    title: `Invoice ${number}`,
    content,
  });
}

export async function sendInvoiceEmail(p) {
  const number = p.invoiceNo || newInvoiceNo();
  await sendEmail({
    from: 'Euphoria Events <booking@euphoria.events>',
    to: [p.clientEmail],
    replyTo: NOTIFY_EMAIL,
    subject: `Invoice ${number}: your ${lc(p.eventType)}${p.date ? ` on ${shortDate(p.date)}` : ''}`,
    html: invoiceEmailHTML({ ...p, invoiceNo: number }),
  });
}

// Exposed for previews and tests
export { clientEmailHTML, ownerEmailHTML };
