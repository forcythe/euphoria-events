import { timingSafeEqual } from 'crypto';
import { sendInvoiceEmail, sendBalanceReminderEmail } from '@/lib/resend';
import { invoiceTotals } from '@/lib/pricing';

export const dynamic = 'force-dynamic';

/**
 * POST /api/send-invoice
 *
 * Sends an invoice (or a balance reminder) from the /invoice generator.
 * Auth: the owner types the admin key on the generator page; it is sent in the
 * x-admin-key header and compared here with INVOICE_ADMIN_KEY (falls back to
 * CRON_SECRET so existing deployments keep working). The key never ships in
 * the site's JavaScript.
 */
function authorised(req) {
  const expected = process.env.INVOICE_ADMIN_KEY || process.env.CRON_SECRET || '';
  const given = req.headers.get('x-admin-key') || '';
  if (!expected || given.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(given), Buffer.from(expected));
}

export async function POST(req) {
  if (!authorised(req)) {
    return Response.json({ ok: false, error: 'That admin key is not valid.' }, { status: 401 });
  }

  let b;
  try { b = await req.json(); } catch { return Response.json({ ok: false, error: 'Invalid request.' }, { status: 400 }); }

  const clientEmail = String(b.email || '').trim();
  const clientName  = String(b.name || '').trim();
  if (!clientEmail || !clientName) {
    return Response.json({ ok: false, error: 'Client name and email are required.' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
    return Response.json({ ok: false, error: 'That client email address does not look right.' }, { status: 400 });
  }

  try {
    if (b.type === 'balance') {
      const t = invoiceTotals({ total: b.total, deposit: b.deposit, vat: b.vat });
      const sent = await sendBalanceReminderEmail({
        clientEmail, clientName,
        eventType: b.eventType || 'Event',
        date:      b.date || '',
        venue:     b.venue || '',
        total:     String(t.grandTotal),
        deposit:   String(t.paid),
      });
      if (!sent) throw new Error('The email service did not accept the message.');
    } else {
      await sendInvoiceEmail({
        clientEmail, clientName,
        eventType: b.eventType || 'Event',
        date:      b.date || '',
        venue:     b.venue || '',
        services:  b.services || '',
        servicePrices: b.servicePrices || {},
        invoiceNo: b.invoiceNo || '',
        dueDate: /^\d{4}-\d{2}-\d{2}$/.test(b.dueDate || '') ? b.dueDate : '',
        total: b.total, deposit: b.deposit, vat: b.vat, notes: b.notes,
      });
    }
    return Response.json({ ok: true, type: b.type === 'balance' ? 'balance' : 'invoice', to: clientEmail });
  } catch (err) {
    console.error('[send-invoice]', err.message);
    return Response.json({ ok: false, error: 'The email could not be sent. Please try again.' }, { status: 500 });
  }
}
