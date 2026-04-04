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
    instagram: "https://instagram.com/euphoria.eventsng",
    tiktok: "https://tiktok.com/@euphoria.eventsng",
    facebook: "https://facebook.com/euphoria.eventsng",
    youtube: "https://youtube.com/@euphoria.eventsng",
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
    cover: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_auto,q_auto,w_600,dpr_auto/v1773264395/Euphoria%20Events/PXL_20241130_171434274_btdq7x.jpg",
    media: [
      { url: "https://res.cloudinary.com/dhahjsrtn/video/upload/v1773148190/Euphoria%20Events/Bridal_Shower_p1bbwh.mp4", caption: "Bridal shower 360° spin", type: "video" },
      { url: "https://res.cloudinary.com/dhahjsrtn/video/upload/v1773063038/Euphoria%20Events/Wedding_lboalb.mp4", caption: "Wedding slow-mo magic", type: "video" },
      { url: "https://res.cloudinary.com/dhahjsrtn/video/upload/v1773062669/Euphoria%20Events/wedding_reception_fyhbvu.mp4", caption: "Reception 360° highlights", type: "video" },
      { url: "https://res.cloudinary.com/dhahjsrtn/video/upload/v1773266181/Euphoria%20Events/PXL_20241130_150920897_w5yc2w.mp4", caption: "360° booth in action", type: "video" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_auto,q_auto,w_600,dpr_auto/v1773264395/Euphoria%20Events/PXL_20241130_171434274_btdq7x.jpg", caption: "Captured in the moment" },
    ],
  },
  2: {
    label: "Wedding Reception", color: "#FFD700", tag: "Smile Booth",
    cover: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_auto,q_auto,w_600,dpr_auto/v1773264400/Euphoria%20Events/PXL_20241130_161918346.PORTRAIT.ORIGINAL_pmrfml.jpg",
    media: [
      { url: "https://res.cloudinary.com/dhahjsrtn/video/upload/v1773266181/Euphoria%20Events/PXL_20241130_150920897_w5yc2w.mp4", caption: "Wedding reception highlights", type: "video" },
      { url: "https://res.cloudinary.com/dhahjsrtn/video/upload/v1773266088/Euphoria%20Events/PXL_20241130_170141105_wfyauu.mp4", caption: "Reception dance floor", type: "video" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_auto,q_auto,w_600,dpr_auto/v1773264402/Euphoria%20Events/PXL_20220423_144427346.PORTRAIT_fgw5j5.jpg", caption: "Bride & groom portrait" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_auto,q_auto,w_600,dpr_auto/v1773264400/Euphoria%20Events/PXL_20241130_161918346.PORTRAIT.ORIGINAL_pmrfml.jpg", caption: "Reception moments" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_auto,q_auto,w_600,dpr_auto/v1773264395/Euphoria%20Events/PXL_20241130_171434274_btdq7x.jpg", caption: "Celebrating love" },
    ],
  },
  3: {
    label: "Corporate Gala Night", color: "#00F5FF", tag: "Videography",
    cover: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_auto,q_auto,w_600,dpr_auto/v1773265341/Euphoria%20Events/BOS_1_zcfjyi.jpg",
    media: [
      { url: "https://res.cloudinary.com/dhahjsrtn/video/upload/v1773063421/Euphoria%20Events/Gala_v3mwjq.mp4", caption: "Gala night highlights", type: "video" },
      { url: "https://res.cloudinary.com/dhahjsrtn/video/upload/v1773062615/Euphoria%20Events/Greenspring_PTA_Meeting_skorc5.mp4", caption: "School PTA event", type: "video" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_auto,q_auto,w_600,dpr_auto/v1773264211/Euphoria%20Events/BOS_7976_ottdia.jpg", caption: "Gala night crowd" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_auto,q_auto,w_600,dpr_auto/v1773264196/Euphoria%20Events/BOS_8044_syvazu.jpg", caption: "Gala host" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_auto,q_auto,w_600,dpr_auto/v1773264211/Euphoria%20Events/BOS_7816_vpoohv.jpg", caption: "Gala table setup" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_auto,q_auto,w_600,dpr_auto/v1773265341/Euphoria%20Events/BOS_1_zcfjyi.jpg", caption: "Gala party vibes" },
    ],
  },
  4: {
    label: "Birthday Bash", color: "#FF6B35", tag: "Guestbook",
    cover: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_auto,q_auto,w_600,dpr_auto/v1773266206/Euphoria%20Events/Happy_Birthday_lycuif.jpg",
    media: [
      { url: "https://res.cloudinary.com/dhahjsrtn/video/upload/v1773063398/Euphoria%20Events/60th_Birthday_dot0b3.mp4", caption: "60th birthday celebration", type: "video" },
      { url: "https://res.cloudinary.com/dhahjsrtn/video/upload/v1773062670/Euphoria%20Events/50th%20birthday.mp4", caption: "50th birthday party", type: "video" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_auto,q_auto,w_600,dpr_auto/v1773266233/Euphoria%20Events/Becky_at_One_asxrgl.jpg", caption: "Becky turns one" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_auto,q_auto,w_600,dpr_auto/v1773266206/Euphoria%20Events/Happy_Birthday_lycuif.jpg", caption: "Happy birthday setup" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_auto,q_auto,w_600,dpr_auto/v1773267030/Euphoria%20Events/Birthday_Table_Decor_ua6un0.jpg", caption: "Birthday table decor" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_auto,q_auto,w_600,dpr_auto/v1773266266/Euphoria%20Events/Happy_Bithday_Table_Flower_iplyzm.jpg", caption: "Floral table arrangement" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_auto,q_auto,w_600,dpr_auto/v1773266263/Euphoria%20Events/50th_Birthday_Cake_ya9rju.jpg", caption: "50th birthday neon" },
    ],
  },
  5: {
    label: "Graduation Celebration", color: "#39FF14", tag: "360 Booth",
    cover: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_auto,q_auto,w_600,dpr_auto/v1773266245/Euphoria%20Events/Graduation_Ceremony_w1cnfx.jpg",
    media: [
      { url: "https://res.cloudinary.com/dhahjsrtn/video/upload/v1773152112/Euphoria%20Events/NXU_Graduation_jf9zlo.mp4", caption: "Graduation highlights", type: "video" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_auto,q_auto,w_600,dpr_auto/v1773266245/Euphoria%20Events/Graduation_Ceremony_w1cnfx.jpg", caption: "Graduation ceremony" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_auto,q_auto,w_600,dpr_auto/v1773266261/Euphoria%20Events/Graduand_areyhi.jpg", caption: "Proud graduand" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_auto,q_auto,w_600,dpr_auto/v1773266218/Euphoria%20Events/Graduation_Party_e30vpd.jpg", caption: "Graduation party" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_auto,q_auto,w_600,dpr_auto/v1773266256/Euphoria%20Events/Graduation_Portrait_xxsxhd.jpg", caption: "Graduation portrait" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_auto,q_auto,w_600,dpr_auto/v1773266232/Euphoria%20Events/Kids_Graduation_p4qsft.jpg", caption: "Young graduates" },
    ],
  },
  6: {
    label: "Bridal & Baby Shower Vibes", color: "#FF3CAC", tag: "Smile Booth",
    cover: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_auto,q_auto,w_600,dpr_auto/v1773266300/Euphoria%20Events/Baby_shower_ballons_awdzwj.jpg",
    media: [
      { url: "https://res.cloudinary.com/dhahjsrtn/video/upload/v1773148190/Euphoria%20Events/Bridal_Shower_p1bbwh.mp4", caption: "Bridal shower highlights", type: "video" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_auto,q_auto,w_600,dpr_auto/v1773266300/Euphoria%20Events/Baby_shower_ballons_awdzwj.jpg", caption: "Oh Baby balloon arch" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_auto,q_auto,w_600,dpr_auto/v1773266294/Euphoria%20Events/baby_shower_set_up_ciwkxk.jpg", caption: "Floral baby shower setup" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_auto,q_auto,w_600,dpr_auto/v1773266276/Euphoria%20Events/baby_shower_c9xkbs.jpg", caption: "Precious newborn" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_auto,q_auto,w_600,dpr_auto/v1773266299/Euphoria%20Events/Bridal_shower_train_w5p82h.jpg", caption: "Bridal shower train" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_auto,q_auto,w_600,dpr_auto/v1773266301/Euphoria%20Events/Bride_to_be_ldbwv4.jpg", caption: "Bride to be" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_auto,q_auto,w_600,dpr_auto/v1773266294/Euphoria%20Events/Mum_baby_shower_fryjff.jpg", caption: "Mum celebration" },
    ],
  },
};

export const SERVICE_IMAGES = {
  "360":     "/360-booth.webp",
  smile:     "/smile-camera.webp",
  guestbook: "/audio-guestbook.webp",
  video:     "/mobile-videography.webp",
};

export const HERO_IMAGES = [
  "/hero-1.webp",
  "/hero-2.webp",
  "/hero-3.webp",
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
  { id: "about",    label: "About" },
  { id: "services", label: "Services" },
  { id: "gallery",  label: "Gallery" },
  { id: "packages", label: "Packages" },
  { id: "reviews",  label: "Reviews" },
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
