import { NextResponse } from 'next/server';

/**
 * GET /api/debug
 * Shows which env vars are set (values hidden) and tests each service.
 * DELETE THIS ROUTE once everything is working.
 */
export async function GET() {
  const checks = {
    env: {
      GOOGLE_CALENDAR_ID:  !!process.env.GOOGLE_CALENDAR_ID,
      GOOGLE_CLIENT_EMAIL: !!process.env.GOOGLE_CLIENT_EMAIL,
      GOOGLE_PRIVATE_KEY:  !!process.env.GOOGLE_PRIVATE_KEY,
      RESEND_API_KEY:      !!process.env.RESEND_API_KEY,
    },
    calendarTest: null,
    resendTest:   null,
  };

  // Test Google Calendar
  try {
    const { getBlockedDates } = await import('@/lib/googleCalendar');
    const dates = await getBlockedDates();
    checks.calendarTest = { ok: true, blockedDates: dates.length, dates };
  } catch (err) {
    checks.calendarTest = { ok: false, error: err.message };
  }

  // Test Resend (just check key format, don't actually send)
  const key = process.env.RESEND_API_KEY;
  checks.resendTest = key
    ? { ok: true, keyPrefix: key.slice(0, 6) + '...' }
    : { ok: false, error: 'RESEND_API_KEY not set' };

  return NextResponse.json(checks, { status: 200 });
}
