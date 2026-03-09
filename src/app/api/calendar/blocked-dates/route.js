import { NextResponse } from 'next/server';
import { getBlockedDates } from '@/lib/googleCalendar';

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
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
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
