import { NextResponse } from 'next/server';

// Lazy imports so missing env vars don't crash the module at load time
async function tryCreateCalendarEvent(booking) {
  try {
    const { createBookingEvent } = await import('@/lib/googleCalendar');
    return await createBookingEvent(booking);
  } catch (err) {
    console.warn('[bookings] Calendar skipped:', err.message);
    return null;
  }
}

async function tryGetBlockedDates() {
  try {
    const { getBlockedDates } = await import('@/lib/googleCalendar');
    return await getBlockedDates();
  } catch (err) {
    console.warn('[bookings] Blocked dates skipped:', err.message);
    return [];
  }
}

async function trySendEmails(booking, calEventLink) {
  try {
    const { sendBookingEmails } = await import('@/lib/resend');
    return await sendBookingEmails({ booking, calEventLink });
  } catch (err) {
    console.warn('[bookings] Email skipped:', err.message);
    return { client: null, owner: null, errors: [err.message] };
  }
}

/**
 * POST /api/bookings
 * Always returns valid JSON — gracefully degrades if Google Calendar
 * or Resend env vars are not yet configured on Render.
 */
export async function POST(request) {
  try {
    // Parse body safely
    let body;
    try {
      body = await request.json();
    } catch (_) {
      return NextResponse.json(
        { success: false, error: 'Invalid request body.' },
        { status: 400 },
      );
    }

    const { date, name, email, phone, eventType, venue, notes, services, bookingType } = body;

    // Validation
    if (!date || !name || !email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: date, name, and email are required.' },
        { status: 400 },
      );
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format. Expected YYYY-MM-DD.' },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address.' },
        { status: 400 },
      );
    }

    // Race-condition guard
    const blocked = await tryGetBlockedDates();
    if (blocked.includes(date)) {
      return NextResponse.json(
        { success: false, error: 'That date is no longer available. Please choose another.' },
        { status: 409 },
      );
    }

    const bookingData = {
      date, name, email,
      phone:       phone       || '',
      eventType:   eventType   || '',
      venue:       venue       || '',
      notes:       notes       || '',
      services:    services    || [],
      bookingType: bookingType || 'services',
    };

    // Create calendar event + send emails (both degrade gracefully)
    const calEvent     = await tryCreateCalendarEvent(bookingData);
    const emailResults = await trySendEmails(bookingData, calEvent?.htmlLink || null);

    return NextResponse.json(
      {
        success:  true,
        message:  'Booking request received! We will confirm within 24 hours.',
        eventId:  calEvent?.id || null,
        calendar: !!calEvent,
        emails: {
          clientSent: !!emailResults?.client,
          ownerSent:  !!emailResults?.owner,
        },
      },
      { status: 201 },
    );

  } catch (err) {
    console.error('[POST /api/bookings] Unhandled error:', err.message);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again or contact us directly at booking@euphoria.events.' },
      { status: 500 },
    );
  }
}
