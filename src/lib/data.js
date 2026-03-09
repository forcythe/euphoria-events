// ─── BRAND ────────────────────────────────────────────────────────────
export const BRAND = {
  name: "Euphoria",
  fullName: "Euphoria Events",
  tagline: "Total Experience Media Rentals",
  description:
    "360° booths, smile cams, audio & video guestbooks, and mobile videography — all in one electrifying experience.",
  siteUrl: "https://euphoria.events",
  email: "booking@euphoria.events",
  phone: "+234 703 856 5517",
  address: "Lagos, Nigeria",
  socials: {
    instagram: "https://instagram.com/euphoria.events",
    tiktok: "https://tiktok.com/@euphoria.events",
    facebook: "https://facebook.com/euphoriaevents",
    youtube: "https://youtube.com/@euphoriaevents",
    whatsapp: "https://wa.me/2347038565517",
  },
};

// ─── STATS ────────────────────────────────────────────────────────────
export const STATS = [
  { value: "200+", label: "Events Hosted" },
  { value: "4",    label: "Premium Services" },
  { value: "100%", label: "Fun Guaranteed" },
  { value: "48hr", label: "Response Time" },
];

// ─── SERVICES ─────────────────────────────────────────────────────────
export const SERVICES = [
  {
    id: "360",
    title: "360° Camera Booth",
    emoji: "🌀",
    color: "#FF3CAC",
    gradient: "linear-gradient(135deg,#FF3CAC,#784BA0)",
    shortDesc:
      "Slow-mo spins, epic angles, and shareable moments that last forever. Your guests become the stars.",
    features: [
      "Slow motion capture",
      "Instant sharing via QR",
      "Custom overlays & branding",
      "LED ring lighting",
      "Dedicated attendant",
    ],
    duration: "3–4 hrs",
    guests: "Unlimited",
    startingPrice: 300000,
  },
  {
    id: "smile",
    title: "Smile Camera Booth",
    emoji: "📸",
    color: "#FFD700",
    gradient: "linear-gradient(135deg,#FFD700,#FF6B35)",
    shortDesc:
      "Tap, smile, print. A classic photo booth reimagined with modern flair and custom branding.",
    features: [
      "Unlimited instant prints",
      "Digital copies for all guests",
      "Custom branded templates",
      "Full prop station",
      "Online gallery after event",
    ],
    duration: "3–4 hrs",
    guests: "Unlimited",
    startingPrice: 350000,
  },
  {
    id: "guestbook",
    title: "Audio & Video Guestbook",
    emoji: "🎙️",
    color: "#00F5FF",
    gradient: "linear-gradient(135deg,#00F5FF,#0057FF)",
    shortDesc:
      "Replace pen-and-paper with heartfelt video messages. A digital keepsake you'll treasure forever.",
    features: [
      "HD video messages",
      "Audio-only option",
      "Private gallery link",
      "QR code access",
      "Styled kiosk setup",
    ],
    duration: "Full event",
    guests: "Unlimited",
    startingPrice: 300000,
  },
  {
    id: "video",
    title: "Mobile Videography",
    emoji: "🎬",
    color: "#39FF14",
    gradient: "linear-gradient(135deg,#39FF14,#00A86B)",
    shortDesc:
      "Professional roaming videography that captures candid magic. Every laugh, dance, and toast — preserved.",
    features: [
      "4K resolution capture",
      "Cinematic edit",
      "Same-week delivery",
      "Highlight reel (2–3 min)",
      "Raw footage included",
    ],
    duration: "2–4 hrs",
    guests: "Any size",
    startingPrice: 250000,
  },
];

// ─── PACKAGES ─────────────────────────────────────────────────────────
export const PACKAGES = [
  {
    id: "spark",
    name: "Spark",
    price: 550000,
    color: "#FFD700",
    tagline: "Perfect starter package",
    best: false,
    services: [
      "Smile Camera Booth (6 hrs)",
      "Unlimited prints",
      "1 custom template",
      "Props station",
      "Online gallery 7 days",
    ],
  },
  {
    id: "euphoria",
    name: "Euphoria",
    price: 1500000,
    color: "#FF3CAC",
    tagline: "The full experience for all day.",
    best: true,
    services: [
      "360° Booth + Smile Booth",
      "Audio/Video Guestbook",
      "Mobile Videography (4 hrs)",
      "Drone coverage",
      "All digitals + prints",
      "Custom branding",
      "Highlight reel",
      "Priority support",
    ],
  },
  {
    id: "ignite",
    name: "Ignite",
    price: 850000,
    color: "#00F5FF",
    tagline: "Visual storytelling focus",
    best: false,
    services: [
      "360° Camera Booth (6 hrs)",
      "Mobile Videography (3 hrs)",
      "Drone coverage",
      "Cinematic highlight reel",
      "Full digital gallery",
    ],
  },
];

// ─── GALLERY ──────────────────────────────────────────────────────────
export const GALLERY_TILES = [
  { id: 1, span: 2 },
  { id: 2, span: 1 },
  { id: 3, span: 1 },
  { id: 4, span: 2 },
  { id: 5, span: 1 },
  { id: 6, span: 1 },
];

export const GALLERIES = {
  1: {
    label: "360° Slow-Mo Magic", color: "#FF3CAC", tag: "360 Booth",
    cover: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80",
    media: [
      { url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80", caption: "The spin begins" },
      { url: "https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?w=1200&q=80", caption: "360° magic in action" },
      { url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80", caption: "Crowd energy" },
      { url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&q=80", caption: "Neon night spin" },
      { url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80", caption: "Festival vibes" },
      { url: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1200&q=80", caption: "Late night sessions" },
      { url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80", caption: "Showtime" },
      { url: "https://images.unsplash.com/photo-1504680177321-2e6a879aac86?w=1200&q=80", caption: "Epic captures" },
    ],
  },
  2: {
    label: "Wedding Reception", color: "#FFD700", tag: "Smile Booth",
    cover: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
    media: [
      { url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80", caption: "The happy couple" },
      { url: "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=1200&q=80", caption: "Booth fun" },
      { url: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=1200&q=80", caption: "Reception glow" },
      { url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1200&q=80", caption: "Smiles all round" },
      { url: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&q=80", caption: "First dance" },
      { url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80", caption: "Forever captured" },
    ],
  },
  3: {
    label: "Corporate Gala Night", color: "#00F5FF", tag: "Videography",
    cover: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80",
    media: [
      { url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80", caption: "Gala evening" },
      { url: "https://images.unsplash.com/photo-1576633587382-13ddf37b1fc1?w=1200&q=80", caption: "Behind the lens" },
      { url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&q=80", caption: "Keynote moment" },
      { url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&q=80", caption: "Awards night" },
      { url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&q=80", caption: "Team celebration" },
      { url: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1200&q=80", caption: "Candid laughter" },
      { url: "https://images.unsplash.com/photo-1522158637959-30385a09e0da?w=1200&q=80", caption: "Networking highlights" },
    ],
  },
  4: {
    label: "Birthday Bash", color: "#FF6B35", tag: "Guestbook",
    cover: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=1200&q=80",
    media: [
      { url: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=1200&q=80", caption: "Let the party begin" },
      { url: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1200&q=80", caption: "Cake moment" },
      { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80", caption: "Making wishes" },
      { url: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1200&q=80", caption: "Birthday glow" },
      { url: "https://images.unsplash.com/photo-1478147427282-58a87a702b70?w=1200&q=80", caption: "Video messages" },
      { url: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&q=80", caption: "Dance floor" },
      { url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&q=80", caption: "Confetti moment" },
      { url: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=1200&q=80", caption: "Friends forever" },
    ],
  },
  5: {
    label: "Graduation Celebration", color: "#39FF14", tag: "360 Booth",
    cover: "https://images.unsplash.com/photo-1627556704302-624286467c65?w=1200&q=80",
    media: [
      { url: "https://images.unsplash.com/photo-1627556704302-624286467c65?w=1200&q=80", caption: "Cap toss" },
      { url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80", caption: "The big day" },
      { url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80", caption: "Class of 2025" },
      { url: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=1200&q=80", caption: "Celebration time" },
      { url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80", caption: "360° victory lap" },
      { url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80", caption: "Party after" },
    ],
  },
  6: {
    label: "Baby Shower Vibes", color: "#FF3CAC", tag: "Smile Booth",
    cover: "https://images.unsplash.com/photo-1578167635648-bb0db6c2f10d?w=1200&q=80",
    media: [
      { url: "https://images.unsplash.com/photo-1578167635648-bb0db6c2f10d?w=1200&q=80", caption: "Soft pastel magic" },
      { url: "https://images.unsplash.com/photo-1544473244-3a5e6f0e0e5f?w=1200&q=80", caption: "Floral dream setup" },
      { url: "https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?w=1200&q=80", caption: "Smile cam moments" },
      { url: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=1200&q=80", caption: "Family joy" },
      { url: "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=1200&q=80", caption: "Printed memories" },
      { url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1200&q=80", caption: "Cherished moments" },
    ],
  },
};

export const SERVICE_IMAGES = {
  "360":     "/360-booth.webp",
  smile:     "/smile-camera.jpg",
  guestbook: "/audio-guestbook.jpg",
  video:     "/mobile-videography.jpg",
};

export const HERO_IMAGES = [
  "/hero-1.jpg",  // Friends celebrating with confetti, balloons, warm lights
  "/hero-2.jpg",  // Wedding couple dancing at night, crowd cheering with phones
  "/hero-3.jpg",  // First dance with sparklers, guests watching, elegant venue
];

export const FAQS = [
  { q: "How far in advance should I book?", a: "We recommend booking at least 4–6 weeks in advance for weekends, especially peak months (May–August, December). Weekday bookings can often be arranged within 1–2 weeks." },
  { q: "Do you travel outside Lagos?", a: "Yes! We cover Greater Lagos and can travel to other cities with a travel surcharge. Contact us for a custom quote." },
  { q: "What if my event date changes?", a: "We offer one free date change up to 14 days before your event. Changes within 14 days are subject to a rescheduling fee. All changes are subject to the availability of the new date." },
  { q: "Is a deposit required?", a: "Yes, a 30% deposit secures your date. The remaining balance is due 7 days before your event." },
  { q: "Can I customize booth overlays?", a: "Absolutely! All our booths support full custom branding — logos, colors, event names. We work with you 1–2 weeks before your event." },
];

export const BOOKED_DATES = new Set([
  "2026-03-05","2026-03-12","2026-03-15","2026-03-22",
  "2026-04-04","2026-04-11",
]);

export const NAV_LINKS = [
  { id: "services", label: "Services" },
  { id: "gallery",  label: "Gallery" },
  { id: "packages", label: "Packages" },
  { id: "faq",      label: "FAQ" },
  { id: "booking",  label: "Book Now", cta: true },
];

// Structured data helpers
export const LD_ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://euphoria.events/#business",
  name: "Euphoria Events",
  description: "Premium event media rentals in Lagos — 360° camera booths, smile booths, audio & video guestbooks, mobile videography and drone coverage.",
  url: "https://euphoria.events",
  telephone: "+2347038565517",
  email: "booking@euphoria.events",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lagos",
    addressCountry: "NG",
  },
  priceRange: "₦₦₦",
  image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80",
  sameAs: [
    "https://instagram.com/euphoria.events",
    "https://tiktok.com/@euphoria.events",
    "https://facebook.com/euphoriaevents",
    "https://youtube.com/@euphoriaevents",
  ],
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "09:00", closes: "18:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday","Sunday"], opens: "10:00", closes: "20:00" },
  ],
};

export const LD_FAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export const LD_SERVICES = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Euphoria Events Services",
  itemListElement: SERVICES.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Service",
      name: s.title,
      description: s.shortDesc,
      provider: { "@type": "LocalBusiness", name: "Euphoria Events" },
      offers: {
        "@type": "Offer",
        price: s.startingPrice,
        priceCurrency: "NGN",
        priceSpecification: { "@type": "UnitPriceSpecification", price: s.startingPrice, priceCurrency: "NGN", referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitText: "event" } },
      },
    },
  })),
};
