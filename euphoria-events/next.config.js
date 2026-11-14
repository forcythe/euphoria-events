/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // Enable compression
  compress: true,
  // Power headers for SEO / security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
        ],
      },
      {
        source: '/(.*)\\.(jpg|jpeg|png|webp|avif|gif|svg|ico)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
  // Extra brand domains (euphoriaphotos, euphoriaphotobooth, euphoriaphotobooths,
  // euphoriabooths; any ending) point permanently
  // to the one main site, so search engines see a single site and
  // every link to the other domains counts towards euphoria.events.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: '(?:www\\.)?euphoria(?:photos|photobooths?|booths)\\..+' }],
        destination: 'https://euphoria.events/:path*',
        permanent: true,
      },
    ];
  },
  // Canonical trailing slash behaviour
  trailingSlash: false,
};

module.exports = nextConfig;
