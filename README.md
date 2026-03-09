# Euphoria Events — Next.js 14

Premium event media rentals website. Built with Next.js 14 App Router, fully SEO-optimised.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── layout.js       # Root layout — SEO metadata, structured data, fonts
│   ├── page.js         # Full site (single-page, client component)
│   ├── globals.css     # Global styles + responsive CSS
│   ├── sitemap.js      # Auto-generated /sitemap.xml
│   └── robots.js       # Auto-generated /robots.txt
└── lib/
    └── data.js         # All content, brand info, structured data schemas
```

## SEO Features

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

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_GOOGLE_MAPS_KEY` | Google Places API key for venue autocomplete |
| `RESEND_API_KEY` | Resend API key for booking email notifications |
| `NEXT_PUBLIC_SITE_URL` | Your production domain |

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
