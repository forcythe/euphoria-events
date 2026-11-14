import { BRAND } from '@/lib/data';
import { SEO_PAGES } from '@/lib/seo';

// Real pages only (search engines ignore #section links).
export default function sitemap() {
  const base = BRAND.siteUrl;
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    ...SEO_PAGES.map(p => ({
      url: `${base}/${p.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: p.service ? 0.9 : 0.95,
    })),
  ];
}
