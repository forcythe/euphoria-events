import { sendReminderEmail, sendBalanceReminderEmail, sendReviewRequestEmail, sendInvoiceEmail } from '@/lib/resend';

const GOOGLE_CALENDAR_ID  = process.env.GOOGLE_CALENDAR_ID;
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const GOOGLE_PRIVATE_KEY  = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const CRON_SECRET         = process.env.CRON_SECRET;

function b64url(buf) {
  return Buffer.from(buf).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function makeJWT() {
  const now     = Math.floor(Date.now() / 1000);
  const header  = b64url(Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })));
  const payload = b64url(Buffer.from(JSON.stringify({
    iss: GOOGLE_CLIENT_EMAIL,
    scope: 'https://www.googleapis.com/auth/calendar',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now, exp: now + 3600,
  })));
  const data = `${header}.${payload}`;
  const pem  = GOOGLE_PRIVATE_KEY
    .replace('-----BEGIN RSA PRIVATE KEY-----', '')
    .replace('-----END RSA PRIVATE KEY-----', '')
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');
  const binaryKey = Uint8Array.from(atob(pem), c => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8', binaryKey, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, new TextEncoder().encode(data));
  return `${data}.${b64url(new Uint8Array(sig))}`;
}

async function getAccessToken() {
  const jwt = await makeJWT();
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  const data = await res.json();
  return data.access_token;
}

export async function GET(req) {
  const secret = req.headers.get('x-cron-secret');
  if (secret !== CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const token = await getAccessToken();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    const params = new URLSearchParams({
      timeMin: tomorrow.toISOString(),
      timeMax: dayAfter.toISOString(),
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '50',
    });

    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(GOOGLE_CALENDAR_ID)}/events?${params}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data   = await res.json();
    const events = data.items || [];

    // ── Helper to fetch events on a specific date ──
    async function getEventsOnDate(targetDate) {
      const start = new Date(targetDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      const p = new URLSearchParams({ timeMin: start.toISOString(), timeMax: end.toISOString(), singleEvents: 'true', orderBy: 'startTime', maxResults: '50' });
      const r = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(GOOGLE_CALENDAR_ID)}/events?${p}`, { headers: { Authorization: `Bearer ${token}` } });
      const d = await r.json();
      return d.items || [];
    }

    function extractFields(event, fallbackDate) {
      const desc       = event.description || '';
      const emailMatch = desc.match(/📧 Email:\s*(.+)/);
      const nameMatch  = desc.match(/👤 Client:\s*(.+)/);
      const venueMatch = desc.match(/📍 Venue:\s*(.+)/);
      const typeMatch  = desc.match(/🎉 Event Type:\s*(.+)/);
      if (!emailMatch) return null;
      return {
        clientEmail: emailMatch[1].trim(),
        clientName:  nameMatch?.[1].trim()  || 'Valued Client',
        venue:       venueMatch?.[1].trim() || 'your venue',
        eventType:   typeMatch?.[1].trim()  || 'your event',
        date:        event.start?.date || fallbackDate,
      };
    }

    let sent = 0;

    // ── 1. Tomorrow reminder ──
    const tomorrowEvents = await getEventsOnDate(tomorrow);
    for (const event of tomorrowEvents) {
      if (event.status === 'cancelled') continue;
      const fields = extractFields(event, tomorrow.toISOString().slice(0, 10));
      if (!fields) continue;
      await sendReminderEmail(fields);
      sent++;
    }

    // ── 2. Balance reminder (7 days before) ──
    const in7days = new Date();
    in7days.setDate(in7days.getDate() + 7);
    const balanceEvents = await getEventsOnDate(in7days);
    for (const event of balanceEvents) {
      if (event.status === 'cancelled') continue;
      const fields = extractFields(event, in7days.toISOString().slice(0, 10));
      if (!fields) continue;
      await sendBalanceReminderEmail(fields);
      sent++;
    }

    // ── 3. Review request (3 days after event) ──
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const reviewEvents = await getEventsOnDate(threeDaysAgo);
    for (const event of reviewEvents) {
      if (event.status === 'cancelled') continue;
      const fields = extractFields(event, threeDaysAgo.toISOString().slice(0, 10));
      if (!fields) continue;
      await sendReviewRequestEmail(fields);
      sent++;
    }

    // ── 4. Invoice email (events marked INVOICED today) ──
    const invoiceEvents = await getEventsOnDate(new Date());
    for (const event of invoiceEvents) {
      if (event.status === 'cancelled') continue;
      if (!event.summary?.toUpperCase().includes('INVOICED')) continue;
      const fields = extractFields(event, new Date().toISOString().slice(0, 10));
      if (!fields) continue;
      // Extract services from description
      const desc = event.description || '';
      const servicesMatch = desc.match(/📦 Services \/ Package:[\s\S]*?•\s*(.+)/);
      await sendInvoiceEmail({
        ...fields,
        services: servicesMatch?.[1]?.trim() || '',
        total: '', deposit: '', vat: '7.5',
      });
      sent++;
    }

    return Response.json({ success: true, emailsSent: sent });
  } catch (err) {
    console.error('[reminders]', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
