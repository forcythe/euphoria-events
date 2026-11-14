// One price list for the invoice generator and the invoice email.
// Keys are matched exactly first, then by case-insensitive "contains".

export const PRICE_MAP = {
  // Packages
  'Spark Package': 550000, Spark: 550000,
  'Euphoria Package': 1500000, Euphoria: 1500000,
  'Ignite Package': 850000, Ignite: 850000,
  // Services (current names)
  '360° Camera Booth': 350000,
  'Magic Mirror Booth': 400000,
  'Audio & Video Guestbook': 400000,
  'Mobile Videography': 300000,
  // Older names still found in past bookings and links
  'Smile Camera Booth': 400000, 'Smile Booth': 400000, 'Magic Mirror': 400000, Smile: 400000,
  '360 Booth': 350000, '360°': 350000, '360': 350000,
  'Audio Guestbook': 400000, Guestbook: 400000,
  Videography: 300000,
};

export function priceFor(name = '') {
  const key = name.trim();
  if (PRICE_MAP[key]) return PRICE_MAP[key];
  const found = Object.keys(PRICE_MAP).find(k => key.toLowerCase().includes(k.toLowerCase()));
  return found ? PRICE_MAP[found] : 0;
}

/** Money and totals, shared so the page, the PDF and the email always agree. */
export function invoiceTotals({ total, deposit, vat }) {
  const subtotal = parseFloat(total) || 0;
  const paid = parseFloat(deposit) || 0;
  const parsedVat = parseFloat(vat);
  const vatRate = Number.isFinite(parsedVat) ? parsedVat : 7.5;
  const vatAmount = Math.round(subtotal * vatRate / 100);
  const grandTotal = subtotal + vatAmount;
  return { subtotal, paid, vatRate, vatAmount, grandTotal, balance: grandTotal - paid };
}

export function newInvoiceNo(d = new Date()) {
  return `EE-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 900) + 100}`;
}

export const naira = n => `₦${Math.round(n).toLocaleString('en-NG')}`;

// Payment details shown on balance reminders and as the default invoice note
export const PAYMENT = {
  bank: 'Providus Bank',
  accountNumber: '1307886609',
  accountName: 'Perime Experiences Ltd',
};
export const DEFAULT_INVOICE_NOTES =
  `Bank: ${PAYMENT.bank}\nAccount Number: ${PAYMENT.accountNumber}\nAccount Name: ${PAYMENT.accountName}\n\n` +
  'Please pay a 30% deposit to confirm your booking. The balance is due 7 days before your event.';
