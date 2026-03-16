/**
 * Resend email helper
 *
 * Sends two emails on every confirmed booking request:
 *  1. Client confirmation  — from forms@euphoria.events
 *  2. Owner notification   — to booking@euphoria.events
 */

const RESEND_API_KEY   = process.env.RESEND_API_KEY;
const FROM_EMAIL       = 'forms@euphoria.events';
const NOTIFY_EMAIL     = 'booking@euphoria.events';
const RESEND_ENDPOINT  = 'https://api.resend.com/emails';

/** Send a single email via Resend */
async function sendEmail({ from, to, replyTo, subject, html }) {
  if (!RESEND_API_KEY) {
    console.warn('[resend] RESEND_API_KEY not set — skipping email');
    return null;
  }

  const res = await fetch(RESEND_ENDPOINT, {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, reply_to: replyTo, subject, html }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error: ${err}`);
  }

  return res.json();
}

// ── Shared styles ─────────────────────────────────────────────────────
const BASE_STYLES = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #08010F; font-family: 'DM Sans', Arial, sans-serif; color: #fff; }
    .wrap { max-width: 600px; margin: 0 auto; background: #08010F; }
    .header { background: linear-gradient(135deg, #1a0030, #0d0118); padding: 36px 40px 28px; border-bottom: 2px solid #FF3CAC; text-align: center; }
    .logo { font-size: 36px; font-weight: 900; letter-spacing: 6px; background: linear-gradient(90deg, #FF3CAC, #FFD700, #00F5FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .tagline { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,.45); margin-top: 6px; }
    .body { padding: 36px 40px; background: #0d0118; }
    .greeting { font-size: 22px; font-weight: 700; margin-bottom: 10px; }
    .intro { color: rgba(255,255,255,.65); line-height: 1.8; font-size: 15px; margin-bottom: 28px; }
    .card { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.1); border-radius: 16px; padding: 24px 28px; margin-bottom: 24px; }
    .card-title { font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #FF3CAC; margin-bottom: 16px; }
    .row { display: flex; align-items: flex-start; gap: 14px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,.06); }
    .row:last-child { border-bottom: none; padding-bottom: 0; }
    .row-label { font-size: 12px; color: rgba(255,255,255,.38); text-transform: uppercase; letter-spacing: 1px; min-width: 90px; padding-top: 2px; }
    .row-value { font-size: 14px; color: rgba(255,255,255,.85); font-weight: 500; flex: 1; line-height: 1.6; }
    .pill { display: inline-block; background: rgba(255,60,172,.15); border: 1px solid rgba(255,60,172,.3); border-radius: 20px; padding: 3px 12px; font-size: 12px; color: #FF3CAC; margin: 2px 3px 2px 0; }
    .cta-block { text-align: center; margin: 28px 0; }
    .cta-btn { display: inline-block; background: linear-gradient(135deg, #FF3CAC, #784BA0); color: #fff; font-weight: 700; font-size: 15px; padding: 14px 36px; border-radius: 50px; text-decoration: none; letter-spacing: 0.5px; }
    .notice { background: rgba(57,255,20,.07); border: 1px solid rgba(57,255,20,.2); border-radius: 12px; padding: 16px 20px; margin-bottom: 24px; font-size: 13.5px; color: rgba(255,255,255,.7); line-height: 1.7; }
    .notice strong { color: #39FF14; }
    .footer { background: #08010F; padding: 28px 40px; text-align: center; border-top: 1px solid rgba(255,255,255,.06); }
    .footer p { font-size: 12px; color: rgba(255,255,255,.25); line-height: 1.9; }
    .footer a { color: rgba(255,255,255,.45); text-decoration: none; }
    .divider { height: 1px; background: rgba(255,255,255,.06); margin: 20px 0; }
  </style>
`;

// ── Format date nicely ────────────────────────────────────────────────
function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-NG', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

// ── 1. Client confirmation email ─────────────────────────────────────

function clientEmailHTML({ name, date, eventType, venue, services, phone, notes }) {
  const serviceItems = (services || []).map(s => `<span class="pill">${s}</span>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">${BASE_STYLES}</head>
<body>
<div class="wrap">

  <div class="header">
    <div class="logo">EUPHORIA</div>
    <div class="tagline">Total Experience Media Rentals</div>
  </div>

  <div class="body">
    <p class="greeting">Hey ${name.split(' ')[0]} 🎉</p>
    <p class="intro">
      We've received your booking request and we're already excited about your event!
      Our team will review the details and reach out to confirm everything within
      <strong style="color:#fff">24 hours</strong>.
    </p>

    <div class="notice">
      <strong>What happens next?</strong><br>
      We'll send you a confirmation email with your invoice and a 30% deposit link to fully secure your date.
      Your date is <em>not yet confirmed</em> until the deposit is received.
    </div>

    <div class="card">
      <div class="card-title">📋 Your Booking Request</div>
      <div class="row">
        <span class="row-label">📅 Date</span>
        <span class="row-value">${formatDate(date)}</span>
      </div>
      <div class="row">
        <span class="row-label">🎉 Event</span>
        <span class="row-value">${eventType || 'Not specified'}</span>
      </div>
      ${venue ? `<div class="row">
        <span class="row-label">📍 Venue</span>
        <span class="row-value">${venue}</span>
      </div>` : ''}
      ${phone ? `<div class="row">
        <span class="row-label">📞 Phone</span>
        <span class="row-value">${phone}</span>
      </div>` : ''}
      ${serviceItems ? `<div class="row">
        <span class="row-label">📦 Services</span>
        <span class="row-value">${serviceItems}</span>
      </div>` : ''}
      ${notes ? `<div class="row">
        <span class="row-label">📝 Notes</span>
        <span class="row-value" style="font-style:italic;color:rgba(255,255,255,.7);">${notes}</span>
      </div>` : ''}
    </div>

    <div class="cta-block">
      <a href="https://euphoria.events" class="cta-btn">Visit Euphoria Events</a>
    </div>

    <div class="divider"></div>
    <p style="font-size:13px;color:rgba(255,255,255,.45);line-height:1.8;">
      Questions? Reply to this email or reach us at
      <a href="mailto:booking@euphoria.events" style="color:#FF3CAC;">booking@euphoria.events</a>
      or <a href="tel:+2347038565517" style="color:#FF3CAC;">+234 703 856 5517</a>.
    </p>
  </div>

  <div class="footer">
    <p>
      © ${new Date().getFullYear()} Euphoria Events &nbsp;·&nbsp; Lagos, Nigeria<br>
      <a href="https://euphoria.events">euphoria.events</a>
      &nbsp;·&nbsp;
      <a href="mailto:booking@euphoria.events">booking@euphoria.events</a>
    </p>
  </div>

</div>
</body>
</html>`;
}

// ── 2. Owner notification email ───────────────────────────────────────

function ownerEmailHTML({ name, email, phone, date, eventType, venue, notes, services, calEventLink }) {
  const serviceItems = (services || []).map(s => `<span class="pill">${s}</span>`).join('');
  const replySubject = encodeURIComponent(`Re: Your Euphoria Events Booking — ${formatDate(date)}`);

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">${BASE_STYLES}</head>
<body>
<div class="wrap">

  <div class="header">
    <div class="logo">EUPHORIA</div>
    <div class="tagline" style="color:#FFD700;">⚡ New Booking Request</div>
  </div>

  <div class="body">
    <p class="greeting">New booking from ${name} 🎯</p>
    <p class="intro">
      A new booking request just came in via your website. Review the details below
      and confirm with the client within 24 hours.
    </p>

    <div class="card">
      <div class="card-title" style="color:#FFD700;">👤 Client Details</div>
      <div class="row">
        <span class="row-label">Name</span>
        <span class="row-value">${name}</span>
      </div>
      <div class="row">
        <span class="row-label">Email</span>
        <span class="row-value"><a href="mailto:${email}" style="color:#FF3CAC;">${email}</a></span>
      </div>
      <div class="row">
        <span class="row-label">Phone</span>
        <span class="row-value">${phone ? `<a href="tel:${phone.replace(/\s/g,'')}" style="color:#FF3CAC;">${phone}</a>` : 'Not provided'}</span>
      </div>
    </div>

    <div class="card">
      <div class="card-title" style="color:#00F5FF;">📋 Event Details</div>
      <div class="row">
        <span class="row-label">📅 Date</span>
        <span class="row-value" style="color:#39FF14;font-weight:700;">${formatDate(date)}</span>
      </div>
      <div class="row">
        <span class="row-label">🎉 Type</span>
        <span class="row-value">${eventType || 'Not specified'}</span>
      </div>
      ${venue ? `<div class="row">
        <span class="row-label">📍 Venue</span>
        <span class="row-value">${venue}</span>
      </div>` : ''}
      ${serviceItems ? `<div class="row">
        <span class="row-label">📦 Services</span>
        <span class="row-value">${serviceItems}</span>
      </div>` : ''}
      ${notes ? `<div class="row">
        <span class="row-label">📝 Notes</span>
        <span class="row-value" style="font-style:italic;color:rgba(255,255,255,.6);">${notes}</span>
      </div>` : ''}
    </div>

    <div class="cta-block" style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
      <a href="mailto:${email}?subject=${replySubject}" class="cta-btn" style="background:linear-gradient(135deg,#FF3CAC,#784BA0);">
        Reply to Client →
      </a>
      ${calEventLink ? `<a href="${calEventLink}" class="cta-btn" style="background:linear-gradient(135deg,#00F5FF,#0057FF);color:#000;">
        View in Google Calendar →
      </a>` : ''}
    </div>

    <div class="notice">
      <strong>To confirm this booking:</strong><br>
      Reply to the client's email, send them a deposit invoice (30% = upfront), and update the
      Google Calendar event from <em>Tentative</em> to <em>Confirmed</em>.<br><br>
      <strong>To decline:</strong> Delete the calendar event — the date opens back up on the website automatically.
    </div>
  </div>

  <div class="footer">
    <p>
      Euphoria Events Booking System &nbsp;·&nbsp; <a href="https://euphoria.events">euphoria.events</a>
    </p>
  </div>

</div>
</body>
</html>`;
}

// ── Public: send both emails ──────────────────────────────────────────

export async function sendBookingEmails({ booking, calEventLink }) {
  const { name, email, phone, date, eventType, venue, notes, services } = booking;
  const results = { client: null, owner: null, errors: [] };

  // Client confirmation
  try {
    results.client = await sendEmail({
      from:    `Euphoria Events <${FROM_EMAIL}>`,
      to:      email,
      replyTo: NOTIFY_EMAIL,
      subject: `🎉 Booking Request Received — ${formatDate(date)}`,
      html:    clientEmailHTML({ name, date, eventType, venue, services, phone, notes }),
    });
  } catch (err) {
    console.error('[resend] Client email failed:', err.message);
    results.errors.push(`client: ${err.message}`);
  }

  // Owner notification
  try {
    results.owner = await sendEmail({
      from:    `Euphoria Bookings <${FROM_EMAIL}>`,
      to:      NOTIFY_EMAIL,
      replyTo: email,
      subject: `⚡ New Booking — ${name} · ${formatDate(date)}`,
      html:    ownerEmailHTML({ name, email, phone, date, eventType, venue, notes, services, calEventLink }),
    });
  } catch (err) {
    console.error('[resend] Owner email failed:', err.message);
    results.errors.push(`owner: ${err.message}`);
  }

  return results;
}
export async function sendReminderEmail({ clientEmail, clientName, venue, eventType, date }) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) return;

  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-NG', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const html = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#04000A;font-family:Arial,sans-serif;color:#ffffff;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <img src="https://euphoria.events/favicon.png" width="70" height="70" alt="Euphoria Events" style="border-radius:16px;" />
      <h1 style="font-size:28px;letter-spacing:4px;margin:16px 0 4px;color:#FFD700;">EUPHORIA EVENTS</h1>
      <p style="color:rgba(255,255,255,.4);font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0;">Your big day is tomorrow!</p>
    </div>
    <div style="background:linear-gradient(135deg,rgba(255,61,172,.13),rgba(255,215,0,.13));border:1px solid rgba(255,215,0,.27);border-radius:20px;padding:32px;margin-bottom:24px;text-align:center;">
      <div style="font-size:48px;margin-bottom:12px;">🎉</div>
      <h2 style="font-size:22px;margin:0 0 8px;color:#FFD700;">See you tomorrow, ${clientName}!</h2>
      <p style="color:rgba(255,255,255,.6);margin:0;font-size:15px;">We are all set for your <strong style="color:#FF3CAC;">${eventType}</strong></p>
    </div>
    <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:24px;margin-bottom:24px;">
      <h3 style="font-size:13px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.4);margin:0 0 16px;">Event Details</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:rgba(255,255,255,.4);font-size:13px;">Date</td><td style="padding:8px 0;font-size:14px;font-weight:600;">${formattedDate}</td></tr>
        <tr><td style="padding:8px 0;color:rgba(255,255,255,.4);font-size:13px;">Event</td><td style="padding:8px 0;font-size:14px;font-weight:600;">${eventType}</td></tr>
        <tr><td style="padding:8px 0;color:rgba(255,255,255,.4);font-size:13px;">Venue</td><td style="padding:8px 0;font-size:14px;font-weight:600;">${venue}</td></tr>
      </table>
    </div>
    <div style="background:rgba(255,61,172,.08);border:1px solid rgba(255,61,172,.2);border-radius:16px;padding:20px;margin-bottom:24px;">
      <p style="margin:0;font-size:14px;color:rgba(255,255,255,.7);">Need to reach us? Call or WhatsApp <strong style="color:#FF3CAC;">+234 703 856 5517</strong> or email <strong style="color:#FF3CAC;">booking@euphoria.events</strong></p>
    </div>
    <p style="text-align:center;color:rgba(255,255,255,.25);font-size:12px;">Euphoria Events &bull; Lagos, Nigeria</p>
  </div>
</body>
</html>`;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Euphoria Events <booking@euphoria.events>',
      to: [clientEmail],
      subject: `Reminder: Your event is tomorrow — ${eventType}`,
      html,
    }),
  });
}
