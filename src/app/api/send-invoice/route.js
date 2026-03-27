import { sendInvoiceEmail } from '@/lib/resend';

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const clientEmail = searchParams.get('email');
  const clientName  = searchParams.get('name');
  const eventType   = searchParams.get('eventType');
  const date        = searchParams.get('date');
  const venue       = searchParams.get('venue');
  const services    = searchParams.get('services');
  const total       = searchParams.get('total')   || '';
  const deposit     = searchParams.get('deposit') || '';
  const vat         = searchParams.get('vat')     || '7.5';
  const notes       = searchParams.get('notes')   || '';
  const secret      = searchParams.get('secret');
  const type        = searchParams.get('type') || 'invoice';

  // Basic auth check
  if (secret !== process.env.CRON_SECRET) {
    return new Response('<h2>Unauthorized</h2>', { status: 401, headers: { 'Content-Type': 'text/html' } });
  }

  if (!clientEmail || !clientName) {
    return new Response('<h2>Missing required fields</h2>', { status: 400, headers: { 'Content-Type': 'text/html' } });
  }

  try {
    if (type === 'balance') {
      const { sendBalanceReminderEmail } = await import('@/lib/resend');
      const totalNum   = parseFloat(total)   || 0;
      const depositNum = parseFloat(deposit) || 0;
      const vatRate    = parseFloat(vat)     || 7.5;
      const vatAmount  = Math.round(totalNum * vatRate / 100);
      const grandTotal = totalNum + vatAmount;
      const balance    = grandTotal - depositNum;
      await sendBalanceReminderEmail({
        clientEmail, clientName,
        eventType: eventType || 'Event',
        date:      date      || '',
        venue:     venue     || '',
        total:     String(grandTotal),
        deposit:   String(depositNum),
      });
    } else {
      await sendInvoiceEmail({
        clientEmail, clientName,
        eventType: eventType || 'Event',
        date:      date      || '',
        venue:     venue     || '',
        services:  services  || '',
        total, deposit, vat, notes,
      });
    }

    // Return a nice success page
    return new Response(`<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Invoice Sent</title></head>
<body style="margin:0;padding:0;background:#04000A;font-family:Arial,sans-serif;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;">
  <div style="text-align:center;padding:40px;">
    <div style="font-size:64px;margin-bottom:16px;">✅</div>
    <h1 style="color:#FFD700;font-size:28px;letter-spacing:3px;margin-bottom:8px;">INVOICE SENT!</h1>
    <p style="color:rgba(255,255,255,.6);font-size:15px;">Invoice successfully sent to <strong style="color:#FF3CAC;">${clientEmail}</strong></p>
    <p style="color:rgba(255,255,255,.4);font-size:13px;margin-top:24px;">You can close this tab.</p>
  </div>
</body>
</html>`, { status: 200, headers: { 'Content-Type': 'text/html' } });

  } catch (err) {
    console.error('[send-invoice]', err);
    return new Response(`<!DOCTYPE html>
<html>
<body style="margin:0;padding:40px;background:#04000A;color:#fff;font-family:Arial;">
  <h2 style="color:#FF3CAC;">❌ Failed to send invoice</h2>
  <p>${err.message}</p>
</body>
</html>`, { status: 500, headers: { 'Content-Type': 'text/html' } });
  }
}
