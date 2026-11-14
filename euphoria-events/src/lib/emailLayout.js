/**
 * Euphoria Events email design system.
 *
 * Matches the website: plum header, white body, pink accent, clean type.
 * Built for email clients: table layout, inline styles, no web fonts (Gmail and
 * Outlook ignore them), and a light scheme so dark-mode inboxes do not invert it.
 */

export const C = {
  ink: '#0f0b13',
  plum: '#211826',
  pink: '#ff3cac',
  pinkText: '#b8136e',   // pink that stays readable on white
  pinkSoft: '#fde6f1',
  gold: '#e8c987',       // champagne: accents on plum (10.7:1)
  goldDeep: '#7a5b16',   // deep gold: money and payment labels on white (6.1:1)
  ivory: '#f8f3ea',
  cloud: '#f5f2f6',
  mist: '#e4dee7',
  grey: '#6f6676',
  white: '#ffffff',
};

export const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";
export const DISPLAY = "'Arial Narrow', 'Helvetica Neue', Helvetica, Arial, sans-serif";

/** Escape anything a visitor typed before it goes into HTML. */
export function esc(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export const nl2br = s => esc(s).replace(/\n/g, '<br>');

export function para(html, { muted = false, size = 15, top = 0, bottom = 16 } = {}) {
  return `<p style="margin:${top}px 0 ${bottom}px;font-family:${FONT};font-size:${size}px;line-height:1.65;color:${muted ? C.grey : C.plum};">${html}</p>`;
}

export function heading(text, { size = 13 } = {}) {
  return `<p style="margin:28px 0 10px;font-family:${FONT};font-size:${size}px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${C.pinkText};">${esc(text)}</p>`;
}

/** Label / value rows separated by fine rules. Values are trusted HTML; escape before passing. */
export function details(rows) {
  const body = rows.filter(Boolean).map(([label, value], i) => `
    <tr>
      <td valign="top" style="padding:12px 16px 12px 0;width:34%;font-family:${FONT};font-size:13px;color:${C.grey};${i ? `border-top:1px solid ${C.mist};` : ''}">${esc(label)}</td>
      <td valign="top" style="padding:12px 0;font-family:${FONT};font-size:15px;font-weight:600;color:${C.plum};line-height:1.5;${i ? `border-top:1px solid ${C.mist};` : ''}">${value}</td>
    </tr>`).join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border-top:2px solid ${C.plum};border-bottom:1px solid ${C.mist};">${body}</table>`;
}

export function chips(list) {
  return (list || []).filter(Boolean).map(s =>
    `<span style="display:inline-block;margin:0 6px 6px 0;padding:5px 12px;border-radius:8px;background:${C.cloud};border:1px solid ${C.mist};font-family:${FONT};font-size:13px;font-weight:600;color:${C.plum};">${esc(s)}</span>`,
  ).join('');
}

/** Highlighted note: soft pink panel with a pink edge. */
export function callout(html, { title } = {}) {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:24px 0;">
    <tr><td style="background:${C.pinkSoft};border-left:4px solid ${C.pink};border-radius:0 10px 10px 0;padding:18px 20px;font-family:${FONT};font-size:14px;line-height:1.65;color:${C.plum};">
      ${title ? `<p style="margin:0 0 6px;font-family:${FONT};font-size:14px;font-weight:700;color:${C.plum};">${esc(title)}</p>` : ''}${html}
    </td></tr>
  </table>`;
}

/** Quiet panel on cloud grey, for payment details and similar reference blocks. */
export function panel(html, { title, tone } = {}) {
  const gold = tone === 'gold';
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:24px 0;">
    <tr><td style="background:${gold ? C.ivory : C.cloud};border:1px solid ${gold ? '#eadfca' : C.mist};${gold ? `border-top:2px solid ${C.gold};` : ''}border-radius:12px;padding:18px 20px;font-family:${FONT};font-size:14px;line-height:1.7;color:${C.plum};">
      ${title ? `<p style="margin:0 0 8px;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${gold ? C.goldDeep : C.pinkText};">${esc(title)}</p>` : ''}${html}
    </td></tr>
  </table>`;
}

/** Buttons: primary is plum with a pink arrow chip, like the site; secondary is outlined. */
export function button(href, label, { variant = 'primary', chip = C.pink } = {}) {
  const primary = variant === 'primary';
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-table;border-collapse:separate;margin:0 8px 8px 0;">
    <tr><td style="border-radius:10px;background:${primary ? C.plum : C.white};border:1px solid ${primary ? C.plum : C.grey};">
      <a href="${esc(href)}" target="_blank" style="display:inline-block;padding:13px 20px;font-family:${FONT};font-size:14px;font-weight:600;color:${primary ? C.white : C.plum};text-decoration:none;border-radius:10px;">${esc(label)}${primary ? `&nbsp;&nbsp;<span style="display:inline-block;width:22px;height:22px;line-height:22px;text-align:center;border-radius:6px;background:${chip};color:${C.ink};font-size:13px;">&#8599;</span>` : ''}</a>
    </td></tr>
  </table>`;
}

export const buttons = list => `<div style="margin:28px 0 8px;">${list.join('')}</div>`;

const CONTACT = {
  email: 'booking@euphoria.events',
  phone: '+234 703 856 5517',
  whatsapp: 'https://wa.me/2347038565517',
  instagram: 'https://instagram.com/euphoria.eventsng',
  site: 'https://euphoria.events',
};

/**
 * Full email document.
 * @param {object} o
 * @param {string} o.preheader  inbox preview text
 * @param {string} o.eyebrow    small label in the header
 * @param {string} o.title      headline in the header (plain text)
 * @param {string} o.content    body HTML
 * @param {boolean} [o.internal] internal notification: simpler footer
 */
export function layout({ preheader = '', eyebrow = '', title = '', content = '', internal = false, accent = 'pink' }) {
  const link = accent === 'gold' ? C.goldDeep : C.pinkText;
  const footer = internal
    ? `<p style="margin:0;font-family:${FONT};font-size:12px;color:${C.grey};">Euphoria Events booking system &middot; <a href="${CONTACT.site}" style="color:${C.grey};">euphoria.events</a></p>`
    : `
      <p style="margin:0 0 10px;font-family:${FONT};font-size:13px;line-height:1.7;color:${C.plum};">
        Questions? Reply to this email, or reach us on
        <a href="${CONTACT.whatsapp}" style="color:${link};font-weight:600;text-decoration:none;">WhatsApp</a>
        or at <a href="mailto:${CONTACT.email}" style="color:${link};font-weight:600;text-decoration:none;">${CONTACT.email}</a>.
      </p>
      <p style="margin:0;font-family:${FONT};font-size:12px;line-height:1.7;color:${C.grey};">
        &copy; ${new Date().getFullYear()} Euphoria Events &middot; Lagos, Nigeria &middot;
        <a href="${CONTACT.site}" style="color:${C.grey};">euphoria.events</a> &middot;
        <a href="${CONTACT.instagram}" style="color:${C.grey};">Instagram</a>
      </p>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(title)}</title>
</head>
<body style="margin:0;padding:0;background:${C.cloud};-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.cloud};">${esc(preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.cloud};">
  <tr><td align="center" style="padding:24px 12px 40px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;border-collapse:separate;">

      <!-- Header -->
      <tr><td style="background:${C.plum};border-radius:18px 18px 0 0;padding:26px 32px 30px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="font-family:${DISPLAY};font-size:24px;font-weight:700;letter-spacing:-0.5px;color:${C.white};">euphoria<span style="display:inline-block;width:7px;height:7px;margin-left:2px;background:${C.pink};border-radius:2px;vertical-align:top;"></span></td>
          <td align="right" style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:${C.gold};">${esc(eyebrow)}</td>
        </tr></table>
        <h1 style="margin:28px 0 0;font-family:${DISPLAY};font-size:32px;line-height:1.1;font-weight:700;letter-spacing:-0.8px;color:${C.white};">${esc(title)}</h1>
      </td></tr>
      <tr><td style="height:4px;line-height:4px;font-size:0;background:${C.gold};">&nbsp;</td></tr>

      <!-- Body -->
      <tr><td style="background:${C.white};padding:32px 32px 28px;">
        ${content}
      </td></tr>

      <!-- Footer -->
      <tr><td style="background:${C.white};border-top:1px solid ${C.mist};border-radius:0 0 18px 18px;padding:22px 32px 26px;">
        ${footer}
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}
