# Google Calendar Sync — Setup Guide

This guide walks you through connecting Euphoria Events to your Google Calendar so that:
- Dates you block in Google Calendar automatically grey out on the website
- Every booking submitted on the website creates a **pending (tentative)** event in your calendar

Estimated time: **15–20 minutes**

---

## Step 1 — Create a Google Cloud Project

1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Click **Select a project → New Project**
3. Name it `euphoria-events` and click **Create**
4. Make sure this project is selected in the top dropdown

---

## Step 2 — Enable the Google Calendar API

1. In the left sidebar go to **APIs & Services → Library**
2. Search for **Google Calendar API**
3. Click it and press **Enable**

---

## Step 3 — Create a Service Account

A Service Account is a server identity that your website uses to read/write your calendar — no login popups needed.

1. Go to **APIs & Services → Credentials**
2. Click **+ Create Credentials → Service account**
3. Fill in:
   - **Name:** `euphoria-bookings`
   - **ID:** auto-filled (leave it)
   - **Description:** `Euphoria website calendar sync`
4. Click **Create and Continue**
5. For Role, select **Basic → Editor** (or skip — we'll handle permissions via calendar sharing)
6. Click **Done**

---

## Step 4 — Download the Private Key

1. In the Credentials list, click your new service account (`euphoria-bookings@...`)
2. Go to the **Keys** tab
3. Click **Add Key → Create new key**
4. Choose **JSON** and click **Create**
5. A `.json` file downloads automatically — **keep this safe, never commit it to git**

The file looks like this:
```json
{
  "type": "service_account",
  "project_id": "euphoria-events",
  "client_email": "euphoria-bookings@euphoria-events.iam.gserviceaccount.com",
  "private_key": "-----BEGIN RSA PRIVATE KEY-----\nMIIE...\n-----END RSA PRIVATE KEY-----\n",
  ...
}
```

You need two values from this file:
- `client_email` → goes into `GOOGLE_CLIENT_EMAIL`
- `private_key`  → goes into `GOOGLE_PRIVATE_KEY`

---

## Step 5 — Create Your Euphoria Bookings Calendar

1. Open [Google Calendar](https://calendar.google.com)
2. On the left panel, click **+ Other calendars → Create new calendar**
3. Name it **Euphoria Bookings** (or any name you like)
4. Click **Create calendar**
5. In the left panel, hover over the new calendar → click the **⋮ menu → Settings and sharing**
6. Scroll down to **Integrate calendar** — copy the **Calendar ID** (looks like `abc123@group.calendar.google.com`)

This goes into `GOOGLE_CALENDAR_ID`.

---

## Step 6 — Share the Calendar with the Service Account

Still in the calendar's Settings and sharing page:

1. Scroll to **Share with specific people or groups**
2. Click **+ Add people and groups**
3. Paste the `client_email` from your JSON key file
4. Set permission to **Make changes to events**
5. Click **Send**

---

## Step 7 — Set Environment Variables on Render

1. In your Render dashboard, open your web service
2. Go to **Environment → Environment Variables**
3. Add these three variables:

| Key | Value |
|-----|-------|
| `GOOGLE_CALENDAR_ID` | The Calendar ID from Step 5 |
| `GOOGLE_CLIENT_EMAIL` | The `client_email` from the JSON file |
| `GOOGLE_PRIVATE_KEY` | The full `private_key` value from the JSON file (including the `-----BEGIN-----` lines — Render handles the `\n` automatically) |

4. Click **Save Changes** — Render will redeploy automatically

---

## Step 8 — Test It

1. Open your live site and go to the booking calendar
2. In Google Calendar, create an event on any future date in your **Euphoria Bookings** calendar
3. Refresh the website — that date should now appear greyed out (within ~60 seconds due to cache)
4. Submit a booking request on the website for a different date
5. Check your Google Calendar — a new **⏳ PENDING** event should appear in yellow

---

## How It Works Day-to-Day

### Blocking a date manually
Just create any event in your **Euphoria Bookings** calendar on that date. Multi-day events block all days they span. The website refreshes blocked dates every 60 seconds.

### Confirming a booking
1. Open the pending event in Google Calendar
2. Change the title from `⏳ PENDING — ...` to `✅ CONFIRMED — ...`
3. Change the event status from **Tentative** to **Confirmed** (in the event details)
4. Reply to the client's email directly from the event (their email is listed as an attendee)

### Declining/cancelling a booking
1. Delete the event from Google Calendar
2. The date opens back up on the website automatically within 60 seconds

### Checking all bookings
Your **Euphoria Bookings** calendar shows everything in one place. Pending events appear striped/yellow (tentative), confirmed events appear solid.

---

## Troubleshooting

**Dates aren't blocking on the website**
- Check Render logs for errors mentioning `Google Calendar`
- Verify the service account has been shared with the calendar (Step 6)
- Make sure `GOOGLE_CALENDAR_ID` matches exactly (copy-paste from Google Calendar settings)

**"Google token exchange failed" error**
- The `GOOGLE_PRIVATE_KEY` may have lost its newlines. In Render's environment variable editor, paste the key exactly as it appears in the JSON file — Render preserves `\n` sequences correctly.

**"Calendar unavailable" on the website but no crash**
- This is the graceful fallback — the site works fine, just without live blocking
- Check the Render service logs for the specific error

**Booking creates event but I can't see it**
- Make sure you're looking at the correct calendar (Euphoria Bookings, not your personal one)
- Check that the service account email has **Make changes to events** permission, not just **See all event details**

---

## Security Notes

- The `GOOGLE_PRIVATE_KEY` is **server-side only** — it is never sent to the browser
- The API routes (`/api/calendar/blocked-dates`, `/api/bookings`) run on the server
- The private key is never included in the JavaScript bundle
- Never commit the downloaded JSON key file to your git repository (it's in `.gitignore`)
