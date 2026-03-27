/**
 * Google Calendar API helper
 *
 * Uses a Service Account (private key) stored in environment variables.
 * All requests are server-side only — the private key is never exposed to the browser.
 */

const GOOGLE_CALENDAR_ID  = process.env.GOOGLE_CALENDAR_ID;   // e.g. abc123@group.calendar.google.com
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;  // service account email
const GOOGLE_PRIVATE_KEY  = process.env.GOOGLE_PRIVATE_KEY    // -----BEGIN RSA PRIVATE KEY-----...
  ?.replace(/\\n/g, '\n');                                     // Render stores newlines as \n

// ── JWT helpers (no external dependency — pure Web Crypto) ──────────

/** Base64url-encode a Uint8Array */
function b64url(buf) {
  return Buffer.from(buf)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/** Create a signed JWT for Google OAuth2 service-account flow */
async function makeJWT() {
  const now = Math.floor(Date.now() / 1000);
  const header  = b64url(Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })));
  const payload = b64url(Buffer.from(JSON.stringify({
    iss:   GOOGLE_CLIENT_EMAIL,
    scope: 'https://www.googleapis.com/auth/calendar',
    aud:   'https://oauth2.googleapis.com/token',
    iat:   now,
    exp:   now + 3600,
  })));

  const data = `${header}.${payload}`;

  // Import the PEM private key
  const pemContents = GOOGLE_PRIVATE_KEY
    .replace('-----BEGIN RSA PRIVATE KEY-----', '')
    .replace('-----END RSA PRIVATE KEY-----', '')
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');

  const binaryKey = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(data),
  );

  return `${data}.${b64url(new Uint8Array(signature))}`;
}

/** Exchange JWT for a short-lived access token */
async function getAccessToken() {
  const jwt = await makeJWT();
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion:  jwt,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google token exchange failed: ${err}`);
  }
  const data = await res.json();
  return data.access_token;
}

// ── Public API ───────────────────────────────────────────────────────

/**
 * Fetch all events between now and 12 months ahead.
 * Returns an array of ISO date strings ('YYYY-MM-DD') that are blocked.
 */
export async function getBlockedDates() {
  if (!GOOGLE_CALENDAR_ID || !GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    console.warn('[googleCalendar] Missing env vars — returning empty blocked dates');
    return [];
  }

  const token = await getAccessToken();
  const now   = new Date();
  const end   = new Date(now);
  end.setFullYear(end.getFullYear() + 1);

  const params = new URLSearchParams({
    timeMin:      now.toISOString(),
    timeMax:      end.toISOString(),
    singleEvents: 'true',
    orderBy:      'startTime',
    maxResults:   '250',
    showDeleted:  'false',
    showHiddenInvitations: 'true',
  });

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(GOOGLE_CALENDAR_ID)}/events?${params}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google Calendar list failed: ${err}`);
  }

  const data  = await res.json();
  const dates = new Set();

  for (const event of data.items || []) {
    // All-day events have event.start.date; timed events have event.start.dateTime
    const startRaw = event.start?.date || event.start?.dateTime;
    const endRaw   = event.end?.date   || event.end?.dateTime;
    if (!startRaw) continue;

    const startDate = new Date(startRaw);
    let endDate = endRaw ? new Date(endRaw) : startDate;

    // Google stores all-day events with end.date = day AFTER the event
    // e.g. an event on March 11 has end.date = "2026-03-12"
    // So for all-day events (no time component), subtract 1 day from end
    const isAllDay = !startRaw.includes('T');
    // Only subtract 1 day if end is strictly after start (Google standard all-day format)
    // If start === end (our booking format), don't subtract
    if (isAllDay && endDate > startDate) endDate.setDate(endDate.getDate() - 1);

    // Block every calendar day the event spans
    const cursor = new Date(startDate);
    cursor.setHours(0, 0, 0, 0);
    const finish = new Date(endDate);
    finish.setHours(0, 0, 0, 0);

    while (cursor <= finish) {
      dates.add(cursor.toISOString().slice(0, 10));
      cursor.setDate(cursor.getDate() + 1);
    }
  }

  return [...dates];
}

/**
 * Create a TENTATIVE event in Google Calendar for a new booking request.
 *
 * @param {Object} booking
 * @param {string} booking.date        'YYYY-MM-DD'
 * @param {string} booking.name
 * @param {string} booking.email
 * @param {string} booking.phone
 * @param {string} booking.eventType
 * @param {string} booking.venue
 * @param {string} booking.notes
 * @param {string[]} booking.services  array of service/package names
 */
export async function createBookingEvent(booking) {
  if (!GOOGLE_CALENDAR_ID || !GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    throw new Error('[googleCalendar] Missing env vars — cannot create event');
  }

  const token = await getAccessToken();

  const servicesList = booking.services?.join('\n  • ') || 'N/A';
  const description  = [
    `📋 BOOKING REQUEST — PENDING CONFIRMATION`,
    ``,
    `⏰ Time:       ${booking.startTime ? booking.startTime + (booking.endTime ? ' — ' + booking.endTime : '') : 'Not specified'}`,
    ``,
    `👤 Client:     ${booking.name}`,
    `📧 Email:      ${booking.email}`,
    `📞 Phone:      ${booking.phone || 'Not provided'}`,
    `🎉 Event Type: ${booking.eventType || 'Not specified'}`,
    `📍 Venue:      ${booking.venue || 'Not specified'}`,
    ``,
    `📦 Services / Package:`,
    `  • ${servicesList}`,
    ``,
    `📝 Notes:`,
    booking.notes || 'None',
    ``,
    `─────────────────────────────`,
    `Submitted via euphoria.events`,
    `To confirm: reply to ${booking.email} and change event status to Confirmed.`,
    `To decline: delete this event — the date will open back up on the website.`,
  ].join('\n');

  const mapsUrl = booking.venue ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.venue)}` : '';

  const event = {
    summary:     `⏳ PENDING — ${booking.name} (${booking.eventType || 'Event'})`,
    description,
    location:    booking.venue ? `${booking.venue} — ${mapsUrl}` : '',
    status:      'tentative', // shows as striped/pending in Google Calendar
    start: booking.startTime
      ? { dateTime: `${booking.date}T${booking.startTime}:00+01:00` }
      : { date: booking.date },
    end: booking.endTime
      ? { dateTime: `${booking.date}T${booking.endTime}:00+01:00` }
      : booking.startTime
        ? { dateTime: `${booking.date}T${booking.startTime}:00+01:00` }
        : { date: booking.date },
    colorId:     '5',         // banana yellow = pending
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email',  minutes: 60 },
        { method: 'popup',  minutes: 30 },
      ],
    },
    
 };
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(GOOGLE_CALENDAR_ID)}/events?sendUpdates=none`,
    {
      method:  'POST',
      headers: {
        Authorization:  `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google Calendar create event failed: ${err}`);
  }

  return await res.json();
}

export async function getRawEvents() {
  const token = await getAccessToken();
  const now = new Date();
  const end = new Date(now);
  end.setFullYear(end.getFullYear() + 1);
  const params = new URLSearchParams({
    timeMin: now.toISOString(),
    timeMax: end.toISOString(),
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: '250',
  });
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(GOOGLE_CALENDAR_ID)}/events?${params}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }
  );
  const data = await res.json();
  return data.items || [];
}
