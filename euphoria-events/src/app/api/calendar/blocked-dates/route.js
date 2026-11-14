import { NextResponse } from 'next/server';
import { getBlockedDates } from '@/lib/googleCalendar';

// Read Google Calendar on every request; without this Next.js builds the response once at deploy time.
export const dynamic = 'force-dynamic';

/**
 * GET /api/calendar/blocked-dates
 *
 * Returns an array of ISO date strings that are already booked in Google Calendar.
 * The frontend uses this to grey out dates in the calendar widget.
 */
export async function GET() {
  try {
    const blocked = await getBlockedDates();
    return NextResponse.json(
      { blocked, fetchedAt: new Date().toISOString() },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      },
    );
  } catch (err) {
    console.error('[GET /api/calendar/blocked-dates]', err.message);
    // Fail gracefully — return empty array so the site still works
    return NextResponse.json(
      { blocked: [], error: 'Calendar unavailable', fetchedAt: new Date().toISOString() },
      { status: 200 },
    );
  }
}
