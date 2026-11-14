'use client';

/* Small shared pieces: icons, buttons, split text, smooth scrolling helper. */

export function Arrow({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  );
}

export function Plus({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function Close({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function Chevron({ dir = 'right', size = 16 }) {
  const d = dir === 'left' ? 'M10 3L5 8L10 13' : dir === 'down' ? 'M3 6L8 11L13 6' : 'M6 3L11 8L6 13';
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

/**
 * Button with a rolling label and an optional square icon chip.
 * Renders an <a> when href is given, otherwise a <button>.
 */
export function Btn({ children, variant = 'white', size, icon = true, block, href, disabled, className = '', ...rest }) {
  const cls = ['btn', `btn-${variant}`, size === 'sm' && 'btn-sm', block && 'btn-block', !icon && 'noic', className]
    .filter(Boolean).join(' ');
  const inner = (
    <>
      <span className="t"><span data-t={children}>{children}</span></span>
      {icon && <span className="ic" aria-hidden="true"><Arrow /></span>}
    </>
  );
  if (href) {
    const external = href.startsWith('http');
    return (
      <a className={cls} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" className={cls} aria-disabled={disabled || undefined} {...rest}>
      {inner}
    </button>
  );
}

/** Splits a heading into masked words so the motion layer can reveal them. */
export function Split({ text }) {
  return text.split(' ').map((w, i, a) => (
    <span key={i}>
      <span className="w"><span>{w}</span></span>{i < a.length - 1 ? ' ' : ''}
    </span>
  ));
}

/** Scrolls to a section id, through Lenis when it is running. */
export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = typeof window !== 'undefined' ? window.__lenis : null;
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.4 });
  else el.scrollIntoView({ behavior: 'smooth' });
}

export const naira = n => `₦${n.toLocaleString('en-NG')}`;

export const longDate = (iso, withDay = false) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', {
    ...(withDay ? { weekday: 'long' } : {}), day: 'numeric', month: 'long', year: 'numeric',
  });

/** Reference-counted scroll lock so nested overlays do not unlock each other. */
let locks = 0;
export function lockScroll() {
  locks += 1;
  if (locks === 1) {
    window.__lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
  }
}
export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) {
    document.documentElement.style.overflow = '';
    window.__lenis?.start();
  }
}

/* ------------------------------------------------------------------------ */
/* Cloudinary helpers                                                        */
/* The gallery data stores Cloudinary URLs; these request the right size and */
/* let Cloudinary pick the best format and quality for each device.          */
/* ------------------------------------------------------------------------ */
const CLD = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/(?:image|video)\/upload\/)(?:([^/]*[a-z]_[^/]*)\/)?(v\d+\/.+)$/;

// Keep a rotation set in the stored URL (for example a_90 on a photo saved sideways).
const keepAngle = t => (t && (t.match(/(?:^|,)(a_-?\d+)/) || [])[1] ? `${t.match(/(?:^|,)(a_-?\d+)/)[1]},` : '');

/**
 * Photo at a given width, automatic format and high quality. Non-Cloudinary URLs pass through.
 * Widths are requested at roughly twice the on-screen size so photos stay sharp on
 * high-density phone and laptop screens.
 * With `ar` (for example '3:4') the photo is cropped to fill that shape, and Cloudinary's
 * content-aware gravity keeps the people and the main subject inside the frame.
 */
export function cld(url, w = 1600, { ar } = {}) {
  const m = url && url.match(CLD);
  if (!m) return url;
  const a = keepAngle(m[2]);
  return ar
    ? `${m[1]}${a}f_auto,q_auto:good,c_fill,g_auto,ar_${ar},w_${w}/${m[3]}`
    : `${m[1]}${a}f_auto,q_auto:good,w_${w},c_limit/${m[3]}`;
}

/** Video at a given width, automatic quality, delivered as MP4. */
export function cldVideo(url, w = 1280) {
  const m = url && url.match(CLD);
  return m ? `${m[1]}q_auto:good,w_${w},c_limit/${m[3]}` : url;
}

/** Still frame from a video (1 second in), used as its poster. */
export function cldPoster(url, w = 900) {
  const m = url && url.match(CLD);
  return m ? `${m[1]}so_1,f_auto,q_auto:good,w_${w},c_limit/${m[3].replace(/\.(mp4|mov|webm)$/i, '.jpg')}` : undefined;
}

/** Identity of a media file regardless of size or format settings, used to skip duplicates. */
export function mediaKey(url = '') {
  return url.replace(/\/upload\/(?:[^/]*[a-z]_[^/]*\/)?(?:v\d+\/)?/, '/upload/').toLowerCase();
}

/**
 * Shows the whole photo inside a fixed-shape frame: the photo is contained (never
 * cropped) and the spare space is filled with a soft, blurred copy of itself.
 */
export function Fit({ src, alt = '', loading = 'lazy' }) {
  return (
    <span className="fit">
      <img className="fit-bg" src={src} alt="" aria-hidden="true" loading={loading} draggable="false" />
      <img className="fit-fg" src={src} alt={alt} loading={loading} draggable="false" />
    </span>
  );
}

/** A gallery photo by its caption (see FEATURED in data.js). */
export function photoByCaption(galleries, caption) {
  for (const g of Object.values(galleries)) {
    const m = g.media.find(x => x.type !== 'video' && x.caption === caption);
    if (m) return m;
  }
  return null;
}

/** srcset for local photos that have -800 and -1280 versions in /public (falls back to none). */
const RESPONSIVE = /^\/(hero-\d|smile-camera|audio-guestbook|mobile-videography)\.jpg$/;
export function localSrcSet(src) {
  const m = typeof src === 'string' && src.match(RESPONSIVE);
  return m ? `/${m[1]}-800.jpg 800w, /${m[1]}-1280.jpg 1280w, ${src} 1800w` : undefined;
}
