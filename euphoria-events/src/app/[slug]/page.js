import { notFound } from 'next/navigation';
import { BRAND, SERVICES, SERVICE_IMAGES, PACKAGES, GALLERIES, LD_BUSINESS_ID } from '@/lib/data';
import { SEO_PAGES, SITE, seoPageFor } from '@/lib/seo';

const RESPONSIVE = /^\/(hero-\d|smile-camera|audio-guestbook|mobile-videography)\.jpg$/;
const srcSet = src => { const m = src.match(RESPONSIVE); return m ? `/${m[1]}-800.jpg 800w, /${m[1]}-1280.jpg 1280w, ${src} 1800w` : undefined; };

// Built as static HTML at deploy time; unknown paths return 404.
export const dynamicParams = false;
export function generateStaticParams() {
  return SEO_PAGES.map(p => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const page = seoPageFor(params.slug);
  if (!page) return {};
  const url = `${SITE}/${page.slug}`;
  const svc = SERVICES.find(s => s.id === page.service);
  const image = `${SITE}${svc ? SERVICE_IMAGES[svc.id] : '/og-image.jpg'}`;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: url },
    openGraph: { type: 'website', locale: 'en_NG', url, siteName: BRAND.fullName, title: page.title, description: page.description, images: [{ url: image, width: 1200, height: 630, alt: page.h1 }] },
    twitter: { card: 'summary_large_image', title: page.title, description: page.description, images: [image] },
  };
}

const naira = n => `₦${n.toLocaleString('en-NG')}`;
const cld = (url, w) => url.replace(/\/upload\/(?:[^/]*[a-z]_[^/]*\/)?(v\d+\/)/, `/upload/f_auto,q_auto:good,w_${w},c_limit/$1`);

export default function SeoPage({ params }) {
  const page = seoPageFor(params.slug);
  if (!page) notFound();
  const url = `${SITE}/${page.slug}`;
  const svc = SERVICES.find(s => s.id === page.service);
  const services = svc ? [svc] : SERVICES;
  const photos = Object.values(GALLERIES)
    .filter(g => !page.galleryTag || g.tag === page.galleryTag)
    .flatMap(g => g.media.filter(m => m.type !== 'video'))
    .slice(0, 6);
  const packages = svc
    ? PACKAGES.filter(p => p.services.some(x => x.toLowerCase().includes(svc.title.split(' ')[0].toLowerCase().replace('°', ''))))
    : PACKAGES;
  const others = SEO_PAGES.filter(p => p.slug !== page.slug);
  const bookHref = svc ? `/?service=${svc.id}#booking` : '/#booking';

  // Structured data: the service itself, its questions and the breadcrumb trail
  const ld = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: page.h1,
      serviceType: svc ? svc.title : 'Photo booth rental',
      alternateName: page.aka,
      description: page.description,
      url,
      areaServed: [{ '@type': 'City', name: 'Lagos' }, { '@type': 'Country', name: 'Nigeria' }],
      provider: { '@id': LD_BUSINESS_ID },
      offers: services.map(s => ({
        '@type': 'Offer', name: s.title, price: s.startingPrice, priceCurrency: 'NGN',
        availability: 'https://schema.org/InStock', url,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
        { '@type': 'ListItem', position: 2, name: page.h1, item: url },
      ],
    },
  ];

  return (
    <>
      {ld.map((d, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />)}
      <div className="lp">
        <header className="lp-bar">
          <a href="/" className="logo" aria-label={`${BRAND.fullName} home`}>euphoria<i aria-hidden="true" /></a>
          <nav aria-label="Main" className="lp-nav">
            <a href="/photo-booth-rental-lagos">All services</a>
            <a href="/#gallery">Gallery</a>
            <a href="/#packages">Packages</a>
            <a href="/#booking" className="lp-book">Book a date</a>
          </nav>
        </header>

        <main>
          <nav aria-label="Breadcrumb" className="lp-crumbs wrap"><a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">{page.h1}</span></nav>

          <section className="lp-hero wrap">
            <div className="lp-hero-copy">
              <h1 className="disp">{page.h1}</h1>
              <p className="lp-lede">{page.lede}</p>
              {svc && (
                <dl className="lp-facts">
                  <div><dt>From</dt><dd>{naira(svc.startingPrice)}</dd></div>
                  <div><dt>Duration</dt><dd>{svc.duration}</dd></div>
                  <div><dt>Guests</dt><dd>{svc.guests}</dd></div>
                </dl>
              )}
              <div className="lp-ctas">
                <a href={bookHref} className="lp-btn">Check your date</a>
                <a href={BRAND.socials.whatsapp} className="lp-btn ghost" rel="noopener noreferrer" target="_blank">Chat on WhatsApp</a>
              </div>
              <p className="lp-aka">Also known as: {page.aka.join(', ')}.</p>
            </div>
            <figure className="lp-hero-img">
              <img src={svc ? SERVICE_IMAGES[svc.id] : '/hero-2.jpg'} srcSet={srcSet(svc ? SERVICE_IMAGES[svc.id] : '/hero-2.jpg')} sizes="(max-width: 860px) 100vw, 45vw" fetchPriority="high" alt={svc ? `${svc.title} at a Euphoria event in Lagos` : 'Guests celebrating at a Euphoria event in Lagos'} width="900" height="1100" />
            </figure>
          </section>

          {services.length > 1 ? (
            <section className="lp-sec wrap" aria-labelledby="svc-list">
              <h2 id="svc-list" className="disp">Our photo booths and services</h2>
              <div className="lp-cards">
                {services.map(s => {
                  const sp = SEO_PAGES.find(p => p.service === s.id);
                  return (
                    <a key={s.id} className="lp-card" href={`/${sp.slug}`}>
                      <img src={SERVICE_IMAGES[s.id]} srcSet={srcSet(SERVICE_IMAGES[s.id])} sizes="(max-width: 860px) 100vw, 45vw" alt={`${s.title} in Lagos`} loading="lazy" width="600" height="400" />
                      <span className="lp-card-t"><b>{s.title}</b><span>From {naira(s.startingPrice)} · {s.duration}</span><span>{s.shortDesc}</span></span>
                    </a>
                  );
                })}
              </div>
            </section>
          ) : (
            <section className="lp-sec wrap lp-two" aria-labelledby="inc">
              <div>
                <h2 id="inc" className="disp">What is included</h2>
                <ul className="lp-list">{svc.features.map(f => <li key={f}>{f}</li>)}</ul>
              </div>
              {page.steps && (
                <div>
                  <h2 className="disp">How it works</h2>
                  <ol className="lp-steps">{page.steps.map(st => <li key={st}>{st}</li>)}</ol>
                </div>
              )}
            </section>
          )}

          {photos.length > 0 && (
            <section className="lp-sec wrap" aria-labelledby="ph">
              <h2 id="ph" className="disp">From our events</h2>
              <div className="lp-photos">
                {photos.map(m => <img key={m.url} src={cld(m.url, 800)} alt={m.caption} loading="lazy" />)}
              </div>
            </section>
          )}

          {packages.length > 0 && (
            <section className="lp-sec wrap" aria-labelledby="pk">
              <h2 id="pk" className="disp">{svc ? `Packages with the ${svc.title.toLowerCase()}` : 'Packages and prices'}</h2>
              <div className="lp-pkgs">
                {packages.map(p => (
                  <div key={p.id} className={`lp-pkg${p.best ? ' best' : ''}`}>
                    <h3>{p.name}</h3>
                    <p className="lp-price">{naira(p.price)}</p>
                    <ul>{p.services.map(x => <li key={x}>{x}</li>)}</ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="lp-sec wrap" aria-labelledby="fq">
            <h2 id="fq" className="disp">Questions, answered</h2>
            <div className="lp-faq">
              {page.faqs.map(f => (
                <div key={f.q} className="lp-qa">
                  <h3>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="lp-sec wrap lp-cta" aria-labelledby="cta">
            <h2 id="cta" className="disp">Ready to lock in your date?</h2>
            <p>Weekends from May to August and in December go first. Check availability now; no payment until we confirm.</p>
            <div className="lp-ctas"><a href={bookHref} className="lp-btn">Check your date</a><a href={`mailto:${BRAND.email}`} className="lp-btn ghost">{BRAND.email}</a></div>
          </section>

          <nav className="lp-sec wrap lp-more" aria-label="Other services">
            <h2 className="disp">Explore more</h2>
            <ul>{others.map(p => <li key={p.slug}><a href={`/${p.slug}`}>{p.h1}</a></li>)}</ul>
          </nav>
        </main>

        <footer className="lp-foot wrap">
          <span>© {new Date().getFullYear()} {BRAND.fullName} · Lagos, Nigeria</span>
          <span><a href={`tel:${BRAND.phone.replace(/\s/g, '')}`}>{BRAND.phone}</a> · <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a></span>
        </footer>
      </div>
    </>
  );
}
