# Euphoria Events: Next.js 14

Premium event media rentals website. Built with Next.js 14 App Router, fully SEO-optimised.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Project Structure

```
src/
├── app/
│   ├── layout.js            # Root layout: SEO metadata, structured data, fonts, analytics
│   ├── page.js              # Home page: composes the sections and shared booking state
│   ├── globals.css          # Design tokens and all component styles
│   ├── invoice/             # Internal invoice generator (admin key required, not indexed)
│   ├── api/                 # bookings, calendar/blocked-dates, reminders, send-invoice, health
│   ├── sitemap.js · robots.js
├── components/
│   ├── Motion.js            # Smooth scroll, scroll-driven scenes, cursor (off for reduced motion)
│   ├── Nav.js · Hero.js · Stars.js · Story.js · Services.js · Gallery.js · Sections.js
│   ├── Booking.js           # Calendar, pickers, venue search, booking form
│   ├── Drawer.js · ui.js    # Panels, buttons, Cloudinary helpers
└── lib/
    ├── data.js              # All content: services, packages, galleries, reviews, FAQs, legal
    ├── pricing.js           # Price list, invoice totals, payment details
    ├── emailLayout.js       # Branded email layout and building blocks
    ├── resend.js            # Booking, reminder, review and invoice emails
    ├── googleCalendar.js    # Calendar sync and blocked dates
    └── time.js              # Event time helpers
```

## Brand and design system

**Type.** Anybody for headlines, Plus Jakarta Sans for text, both self-hosted (SIL Open Font License). Both cover the Naira sign and Yoruba letters (ẹ, ọ, ṣ).
Anybody uses only three widths, set as tokens in `globals.css`:

| Token | Width | Use |
|---|---|---|
| `--w-cond` | 76% | Long headlines, footer wordmark |
| `--w-reg` | 100% | Titles, prices, UI, the logo |
| `--w-wide` | 126% | Big moments: hero line, 360° counter, scrolling words |

**Colour.** Plum `#211826` (base), Euphoria pink `#FF3CAC` (energy: spark, buttons, badges), champagne `#E8C987` (luxury), ivory `#F8F3EA` and cloud `#F5F2F6` (light grounds). Text variants: soft pink `#FF9BD2` on plum, deep pink `#B8136E` and deep gold `#7A5B16` on light.

**Finishes** (`--foil`, `--lacquer`). Rules: one foil moment per screen; foil only on large type; never on buttons; the sheen plays once on reveal except in the hero; motion stops for reduced-motion users. Current placements: hero rolling word, Euphoria package price and card, footer wordmark. Emails use flat champagne because Gmail and Outlook do not render gradients reliably.

**Photos.** Gallery photos and videos live on Cloudinary (`GALLERIES` in `data.js`). `cld()` in `components/ui.js` requests the right size with automatic format and quality, and keeps any rotation stored in the URL. Photos featured in the hero and About collages are chosen by caption in `FEATURED` (`data.js`). Clips: add `type: "video"` to a gallery item.

# SEO Features

- **Next.js Metadata API** — title templates, OG tags, Twitter cards
- **Schema.org structured data** — LocalBusiness, FAQPage, ItemList (services)
- **Sitemap** — auto-generated at `/sitemap.xml`
- **Robots.txt** — auto-generated at `/robots.txt`
- **Security headers** — X-Frame-Options, CSP, referrer policy
- **Image optimisation** — WebP/AVIF via next/image, lazy loading, priority hints
- **Canonical URL** — set via metadata
- **Semantic HTML** — `<main>`, `<nav>`, `<section>`, `<article>`, `<address>`, `<footer>`
- **ARIA labels** — all interactive elements labelled
- **Google Fonts** — via `next/font` (zero layout shift)
- **PWA manifest** — `/site.webmanifest`

## SEO

**Pages.** Each service has its own page, built as static HTML with its own title, description, canonical URL and structured data (Service, FAQPage, BreadcrumbList). Content lives in `src/lib/seo.js`; the template is `src/app/[slug]/page.js`.

| URL | Targets |
|---|---|
| `/360-photo-booth-lagos` | 360 photo booth, 360 video booth, 360 camera booth, spin booth, slow-motion booth |
| `/magic-mirror-photo-booth-lagos` | photo booth, photobooth, mirror booth, selfie mirror, photo booth with prints |
| `/audio-guestbook-lagos` | audio guestbook, video guestbook, phone guestbook, wedding guestbook |
| `/event-videography-lagos` | event videographer, wedding videographer, highlight reel |
| `/photo-booth-rental-lagos` | photo booth rental/hire, prices and packages (overview) |

To add a page, add an entry to `SEO_PAGES`; the sitemap, footer links and internal links update automatically. Keep every page genuinely useful and different: near-duplicate pages (for example one per city with the same text) break Google's spam policies.

**Domains.** `euphoriaphotos.*`, `euphoriaphotobooth.*`, `euphoriaphotobooths.*` and `euphoriabooths.*` redirect permanently (308) to the same path on euphoria.events (`next.config.js`). Point all four domains at this deployment. Never serve the site's content on them directly: duplicate sites split ranking and can be treated as spam.

**After each deploy:** run `npm run indexnow` to notify Bing and Yandex. Keep `public/8549940a956a6582d4a6749139477962.txt` published.

**One-off setup:** verify the site in Google Search Console, Bing Webmaster Tools and Yandex Webmaster (codes go in the environment variables below), and submit `https://euphoria.events/sitemap.xml` in each.

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_GOOGLE_MAPS_KEY` | Google Places API key for venue autocomplete |
| `RESEND_API_KEY` | Resend API key for booking email notifications |
| `NEXT_PUBLIC_SITE_URL` | Your production domain |

> **Invoice generator:** set `INVOICE_ADMIN_KEY` (a long random value, different from `CRON_SECRET`). The `/invoice` page asks for it and only the server checks it. If the old value `euphoriacron123` was ever used for `CRON_SECRET`, replace it: it was exposed in public code before this version.

## Deployment

### Vercel (recommended)
```bash
npx vercel
```

### Render / Railway / Docker
```bash
npm run build
npm start
```

## Customisation

All content lives in `src/lib/data.js` — edit BRAND, SERVICES, PACKAGES, FAQS and GALLERIES there. No need to touch the page component for content changes.
