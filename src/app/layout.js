import { Bebas_Neue, DM_Sans } from 'next/font/google';
import { BRAND, LD_ORGANIZATION, LD_FAQ, LD_SERVICES } from '@/lib/data';
import './globals.css';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
  display: 'swap',
});

const META_TITLE       = 'Euphoria Events | 360° Booths, Smile Cams & Event Media — Lagos';
const META_DESCRIPTION = '360° camera booths, smile booths, audio & video guestbooks, mobile videography and drone coverage for weddings, birthdays, corporate galas & more in Lagos, Nigeria. Book online today.';
const META_KEYWORDS    = '360 camera booth Lagos, photo booth rental Lagos, event videography Lagos, smile booth Nigeria, audio guestbook, drone coverage Lagos, wedding photo booth, birthday booth Nigeria, Euphoria Events';
const SITE_URL         = BRAND.siteUrl;
const OG_IMAGE         = 'https://euphoria.events/360-booth.webp';

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
        alt: 'Euphoria Events — Premium Event Media Rentals Lagos',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: META_TITLE,
    description: META_DESCRIPTION,
    images: [OG_IMAGE],
    creator: '@euphoriaevents',
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    // Add your Google Search Console verification token here
    // google: 'YOUR_VERIFICATION_TOKEN',
  },
  category: 'Event Services',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#08010F',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-NG" className={`${bebasNeue.variable} ${dmSans.variable}`}>
      <head>
        {/* Structured Data — Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LD_ORGANIZATION) }}
        />
        {/* Structured Data — FAQ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LD_FAQ) }}
        />
        {/* Structured Data — Services */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LD_SERVICES) }}
        />
        {/* Preconnect to image CDN */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        {/* Favicon placeholders — replace with real assets */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>{children}</body>
    </html>
  );
}
