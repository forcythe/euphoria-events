// Self-hosted variable fonts (no runtime request to Google Fonts)
// Brand type (self-hosted, OFL): Anybody for headlines, Plus Jakarta Sans for text.
// Both cover the Naira sign and Yoruba letters (ẹ, ọ, ṣ); DM Sans did not.
import '@fontsource-variable/anybody/standard.css';
import '@fontsource-variable/plus-jakarta-sans/index.css';
import Script from 'next/script';
import localFont from 'next/font/local';

// Latin subsets are preloaded and paired with size-matched fallbacks, so text appears at
// once and does not shift when the brand fonts arrive. The @fontsource imports above still
// supply the extended subsets (Yoruba letters, the Naira sign) on demand.
const anybody = localFont({
  src: '../fonts/anybody-latin.woff2',
  variable: '--font-anybody',
  weight: '100 900',
  display: 'swap',
  adjustFontFallback: 'Arial',
  declarations: [{ prop: 'font-stretch', value: '50% 150%' }],
});
const jakarta = localFont({
  src: '../fonts/jakarta-latin.woff2',
  variable: '--font-jakarta',
  weight: '200 800',
  display: 'swap',
  adjustFontFallback: 'Arial',
});
import { BRAND, LD_ORGANIZATION, LD_WEBSITE } from '@/lib/data';
import './globals.css';

const META_TITLE       = '360° Photo Booth & Magic Mirror Hire in Lagos | Euphoria Events';
const META_DESCRIPTION = '360° photo booths, magic mirror booths with prints, audio and video guestbooks and event videography for weddings, birthdays and corporate events in Lagos.';
const META_KEYWORDS    = '360 photo booth Lagos, photo booth rental Lagos, magic mirror photo booth, audio guestbook Nigeria, event videographer Lagos, wedding photo booth Lagos';
const SITE_URL         = BRAND.siteUrl;
const OG_IMAGE         = 'https://euphoria.events/og-image.jpg';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: META_TITLE,
    template: `%s | ${BRAND.fullName}`,
  },
  description: META_DESCRIPTION,
  keywords: META_KEYWORDS,
  authors: [{ name: BRAND.fullName, url: SITE_URL }],
  creator: BRAND.fullName,
  publisher: BRAND.fullName,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: SITE_URL,
    siteName: BRAND.fullName,
    title: META_TITLE,
    description: META_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Euphoria Events: 360° photo booth and event experience rentals in Lagos',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: META_TITLE,
    description: META_DESCRIPTION,
    images: [OG_IMAGE],
  },
  alternates: {
    canonical: SITE_URL,
  },
  // Ownership verification for search consoles. Paste each code into your hosting
  // environment settings; nothing is output for a code that is not set.
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : {}),
    ...(process.env.YANDEX_VERIFICATION ? { yandex: process.env.YANDEX_VERIFICATION } : {}),
    other: {
      ...(process.env.BING_SITE_VERIFICATION ? { 'msvalidate.01': process.env.BING_SITE_VERIFICATION } : {}),
    },
  },
  category: 'Event Services',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f0b13',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-NG" className={`${anybody.variable} ${jakarta.variable}`}>
      <head>
        {/* Structured Data — Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LD_ORGANIZATION) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LD_WEBSITE) }}
        />
        {/* Structured Data — FAQ */}
        {/* Structured Data — Services */}
        {/* Preconnect to the gallery image CDN */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        {/* Favicon */}
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-G5GH95X2B6" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-G5GH95X2B6');
        `}</Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
