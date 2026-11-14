// ─── BRAND ────────────────────────────────────────────────────────────
export const BRAND = {
  name: "Euphoria",
  fullName: "Euphoria Events",
  tagline: "Total Experience Media Rentals",
  description:
    "Lagos’s foremost event experience media house. We bring 360° slow-motion booths, magic mirror booths, video guestbooks and cinematic coverage to weddings, birthdays and corporate events, and make every guest part of the story.",
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
  { value: "200+", label: "Events hosted" },
  { value: "4",    label: "Premium services" },
  { value: "100%", label: "Satisfaction" },
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
    startingPrice: 350000,
  },
  {
    id: "smile",
    title: "Magic Mirror Booth",
    emoji: "📸",
    color: "#FFD700",
    gradient: "linear-gradient(135deg,#FFD700,#FF6B35)",
    shortDesc:
      "Tap, smile, print. A full-length mirror photo booth with instant prints and custom branding.",
    features: [
      "Unlimited instant prints",
      "Digital copies for all guests",
      "Custom branded templates",
      "Full prop station",
      "Online gallery after event",
    ],
    duration: "3–4 hrs",
    guests: "Unlimited",
    startingPrice: 400000,
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
    startingPrice: 400000,
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
    startingPrice: 300000,
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
      "Magic Mirror Booth (6 hrs)",
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
      "360° Booth + Magic Mirror Booth",
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
    cover: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_webp,q_30,w_400/v1773264395/Euphoria%20Events/PXL_20241130_171434274_btdq7x.jpg",
    media: [
      { url: "https://res.cloudinary.com/dhahjsrtn/video/upload/v1773148190/Euphoria%20Events/Bridal_Shower_p1bbwh.mp4", caption: "Bridal shower 360° spin", type: "video" },
      { url: "https://res.cloudinary.com/dhahjsrtn/video/upload/v1773063038/Euphoria%20Events/Wedding_lboalb.mp4", caption: "Wedding slow-mo magic", type: "video" },
      { url: "https://res.cloudinary.com/dhahjsrtn/video/upload/v1773062669/Euphoria%20Events/wedding_reception_fyhbvu.mp4", caption: "Reception 360° highlights", type: "video" },
      { url: "https://res.cloudinary.com/dhahjsrtn/video/upload/v1773266181/Euphoria%20Events/PXL_20241130_150920897_w5yc2w.mp4", caption: "360° booth in action", type: "video" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_webp,q_30,w_400/v1773264395/Euphoria%20Events/PXL_20241130_171434274_btdq7x.jpg", caption: "Captured in the moment" },
    ],
  },
  2: {
    label: "Wedding Reception", color: "#FFD700", tag: "Magic Mirror",
    cover: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_webp,q_30,w_400/v1773264400/Euphoria%20Events/PXL_20241130_161918346.PORTRAIT.ORIGINAL_pmrfml.jpg",
    media: [
      { url: "https://res.cloudinary.com/dhahjsrtn/video/upload/v1773266181/Euphoria%20Events/PXL_20241130_150920897_w5yc2w.mp4", caption: "Wedding reception highlights", type: "video" },
      { url: "https://res.cloudinary.com/dhahjsrtn/video/upload/v1773266088/Euphoria%20Events/PXL_20241130_170141105_wfyauu.mp4", caption: "Reception dance floor", type: "video" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_webp,q_30,w_400/v1773264402/Euphoria%20Events/PXL_20220423_144427346.PORTRAIT_fgw5j5.jpg", caption: "Bride & groom portrait" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_webp,q_30,w_400/v1773264400/Euphoria%20Events/PXL_20241130_161918346.PORTRAIT.ORIGINAL_pmrfml.jpg", caption: "Reception moments" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_webp,q_30,w_400/v1773264395/Euphoria%20Events/PXL_20241130_171434274_btdq7x.jpg", caption: "Celebrating love" },
    ],
  },
  3: {
    label: "Corporate Gala Night", color: "#00F5FF", tag: "Videography",
    cover: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_webp,q_30,w_400/v1773265341/Euphoria%20Events/BOS_1_zcfjyi.jpg",
    media: [
      { url: "https://res.cloudinary.com/dhahjsrtn/video/upload/v1773063421/Euphoria%20Events/Gala_v3mwjq.mp4", caption: "Gala night highlights", type: "video" },
      { url: "https://res.cloudinary.com/dhahjsrtn/video/upload/v1773062615/Euphoria%20Events/Greenspring_PTA_Meeting_skorc5.mp4", caption: "School PTA event", type: "video" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_webp,q_30,w_400/v1773264211/Euphoria%20Events/BOS_7976_ottdia.jpg", caption: "Gala night crowd" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_webp,q_30,w_400/v1773264196/Euphoria%20Events/BOS_8044_syvazu.jpg", caption: "Gala host" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_webp,q_30,w_400/v1773264211/Euphoria%20Events/BOS_7816_vpoohv.jpg", caption: "Gala table setup" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_webp,q_30,w_400/v1773265341/Euphoria%20Events/BOS_1_zcfjyi.jpg", caption: "Gala party vibes" },
    ],
  },
  4: {
    label: "Birthday Bash", color: "#FF6B35", tag: "Guestbook",
    cover: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_webp,q_30,w_400/v1773266206/Euphoria%20Events/Happy_Birthday_lycuif.jpg",
    media: [
      { url: "https://res.cloudinary.com/dhahjsrtn/video/upload/v1773063398/Euphoria%20Events/60th_Birthday_dot0b3.mp4", caption: "60th birthday celebration", type: "video" },
      { url: "https://res.cloudinary.com/dhahjsrtn/video/upload/v1773062670/Euphoria%20Events/50th%20birthday.mp4", caption: "50th birthday party", type: "video" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/a_90,f_webp,q_30,w_400/v1773266233/Euphoria%20Events/Becky_at_One_asxrgl.jpg", caption: "Becky turns one" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_webp,q_30,w_400/v1773266206/Euphoria%20Events/Happy_Birthday_lycuif.jpg", caption: "Happy birthday setup" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_webp,q_30,w_400/v1773267030/Euphoria%20Events/Birthday_Table_Decor_ua6un0.jpg", caption: "Birthday table decor" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_webp,q_30,w_400/v1773266266/Euphoria%20Events/Happy_Bithday_Table_Flower_iplyzm.jpg", caption: "Floral table arrangement" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_webp,q_30,w_400/v1773266263/Euphoria%20Events/50th_Birthday_Cake_ya9rju.jpg", caption: "50th birthday neon" },
    ],
  },
  5: {
    label: "Graduation Celebration", color: "#39FF14", tag: "360 Booth",
    cover: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_webp,q_30,w_400/v1773266245/Euphoria%20Events/Graduation_Ceremony_w1cnfx.jpg",
    media: [
      { url: "https://res.cloudinary.com/dhahjsrtn/video/upload/v1773152112/Euphoria%20Events/NXU_Graduation_jf9zlo.mp4", caption: "Graduation highlights", type: "video" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_webp,q_30,w_400/v1773266245/Euphoria%20Events/Graduation_Ceremony_w1cnfx.jpg", caption: "Graduation ceremony" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_webp,q_30,w_400/v1773266261/Euphoria%20Events/Graduand_areyhi.jpg", caption: "Proud graduand" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_webp,q_30,w_400/v1773266218/Euphoria%20Events/Graduation_Party_e30vpd.jpg", caption: "Graduation party" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_webp,q_30,w_400/v1773266256/Euphoria%20Events/Graduation_Portrait_xxsxhd.jpg", caption: "Graduation portrait" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_webp,q_30,w_400/v1773266232/Euphoria%20Events/Kids_Graduation_p4qsft.jpg", caption: "Young graduates" },
    ],
  },
  6: {
    label: "Bridal & Baby Shower Vibes", color: "#FF3CAC", tag: "Magic Mirror",
    cover: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_webp,q_30,w_400/v1773266300/Euphoria%20Events/Baby_shower_ballons_awdzwj.jpg",
    media: [
      { url: "https://res.cloudinary.com/dhahjsrtn/video/upload/v1773148190/Euphoria%20Events/Bridal_Shower_p1bbwh.mp4", caption: "Bridal shower highlights", type: "video" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_webp,q_30,w_400/v1773266300/Euphoria%20Events/Baby_shower_ballons_awdzwj.jpg", caption: "Oh Baby balloon arch" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_webp,q_30,w_400/v1773266294/Euphoria%20Events/baby_shower_set_up_ciwkxk.jpg", caption: "Floral baby shower setup" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_webp,q_30,w_400/v1773266276/Euphoria%20Events/baby_shower_c9xkbs.jpg", caption: "Precious newborn" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_webp,q_30,w_400/v1773266299/Euphoria%20Events/Bridal_shower_train_w5p82h.jpg", caption: "Bridal shower train" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_webp,q_30,w_400/v1773266301/Euphoria%20Events/Bride_to_be_ldbwv4.jpg", caption: "Bride to be" },
      { url: "https://res.cloudinary.com/dhahjsrtn/image/upload/f_webp,q_30,w_400/v1773266294/Euphoria%20Events/Mum_baby_shower_fryjff.jpg", caption: "Mum celebration" },
    ],
  },
};

export const SERVICE_IMAGES = {
  "360":     "/360-booth.webp",
  smile:     "/smile-camera.jpg",
  guestbook: "/audio-guestbook.jpg",
  video:     "/mobile-videography.jpg",
};

export const HERO_SLIDES = [
  { src: "/hero-1.jpg", label: "Birthdays", alt: "Friends celebrating with confetti and balloons under warm lights" },
  { src: "/hero-2.jpg", label: "Weddings",  alt: "Wedding couple dancing at night while guests film on their phones" },
  { src: "/hero-3.jpg", label: "First dances", alt: "First dance with sparklers in an elegant venue" },
];

// Event types offered in the hero picker and the booking form
export const EVENT_TYPES = [
  "Wedding", "Birthday", "Corporate event", "Graduation", "Baby shower", "Other",
];

// Shown in the scrolling strip under the hero
export const OCCASIONS = [
  "Weddings", "Birthdays", "Corporate galas", "Graduations", "Baby showers",
  "360° booth", "Magic mirror booth", "Video guestbook", "Drone coverage",
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

// ─── FEATURED PHOTOS ──────────────────────────────────────────────────
// Captions of gallery photos used in the hero collage and the About collage.
// The 360° ring skips these so the same photo never appears twice in a row of sections.
export const FEATURED = {
  heroFan: ["Bridal shower train", "Gala party vibes", "Young graduates", "Precious newborn", "Graduation portrait", "Becky turns one"],
  about:   ["Graduation party", "Bride to be", "Gala night crowd", "Mum celebration"],
};

// ─── REVIEWS ──────────────────────────────────────────────────────────
export const GOOGLE_REVIEW_URL = "https://g.page/r/CagVce2aZCPOEAI/review";
export const REVIEWS = [
  { name: "Adaeze Okafor", event: "Wedding Reception", review: "Euphoria Events made our wedding absolutely magical! The 360° booth had all our guests going crazy. The team was professional, fun and delivered beyond expectations. Best decision we made!" },
  { name: "Emeka Nwosu", event: "Corporate Gala", review: "We hired Euphoria for our company's annual gala and they were outstanding. The setup was sleek, the smile booth had a queue all night, and the video highlights were cinematic. Highly recommend!" },
  { name: "Blessing Adeyemi", event: "Birthday Party", review: "My 30th birthday was a dream come true thanks to Euphoria Events! The audio guestbook is something I'll treasure forever. Every guest loved it. They truly go above and beyond." },
  { name: "Funmi Adeola", event: "Baby Shower", review: "I cannot stop raving about Euphoria Events! They turned my baby shower into a full production. The photos and videos were stunning. The team is so warm and talented." },
  { name: "Tunde Fashola", event: "Graduation Party", review: "From booking to delivery, everything was seamless. The 360 booth was a hit and the prints were gorgeous. Will definitely be booking again for our next event!" },
  { name: "Chioma Obi", event: "Bridal Shower", review: "Absolutely incredible experience! The team arrived early, set up beautifully and kept the energy high all evening. Our guests are still talking about it weeks later!" },
];

// ─── LEGAL ────────────────────────────────────────────────────────────
export const LEGAL = {
  terms: {
    title: "Terms and conditions",
    updated: "1 January 2026",
    sections: [
      ["Booking and deposits", "All bookings require a non-refundable 30% deposit to secure your event date. The remaining balance is due no later than 7 days before the event."],
      ["Cancellations and rescheduling", "Cancellations made more than 30 days before the event will receive a credit note valid for 12 months. Cancellations within 30 days forfeit the deposit. Rescheduling is permitted once at no extra charge if requested at least 14 days in advance."],
      ["Event day", "The client is responsible for ensuring adequate space, power supply and venue access for our equipment. Euphoria reserves the right to refuse service if conditions are deemed unsafe."],
      ["Deliverables", "Digital deliverables are provided within the agreed timeframe after the event. Euphoria is not liable for delays caused by third-party platforms or force majeure events."],
      ["Intellectual property", "Euphoria retains the right to use event photos and videos for marketing purposes unless the client opts out in writing before the event."],
      ["Liability", "Our maximum liability is limited to the total amount paid for services."],
      ["Governing law", "These terms are governed by the laws of the Federal Republic of Nigeria. Disputes shall be resolved through the courts of Lagos State."],
    ],
  },
  policy: {
    title: "Privacy policy",
    updated: "1 January 2026",
    sections: [
      ["Information we collect", "We collect personal information you provide during booking (name, email, phone number, event details, venue) and usage data when you interact with our website."],
      ["How we use your information", "Your information is used solely to process your booking, communicate with you about your event, and improve our offerings."],
      ["Data sharing", "We do not sell or share your personal data with third parties, except trusted service providers bound by confidentiality agreements."],
      ["Data retention", "We retain booking records for 3 years. You may request deletion of your data at any time by contacting us."],
      ["Media rights", "Photos and videos captured at your event may be used in our portfolio unless you request exclusion in writing before the event."],
      ["Security", "We implement industry-standard security measures to protect your data."],
      ["Contact", "For privacy-related requests, contact us at booking@euphoria.events or +234 703 856 5517."],
    ],
  },
};

// Structured data helpers
export const LD_BUSINESS_ID = "https://euphoria.events/#business";
const SERVICE_SLUGS = { "360": "360-photo-booth-lagos", smile: "magic-mirror-photo-booth-lagos", guestbook: "audio-guestbook-lagos", video: "event-videography-lagos" };

export const LD_ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": LD_BUSINESS_ID,
  name: "Euphoria Events",
  alternateName: ["Euphoria", "Euphoria Photos", "Euphoria Photo Booth", "Euphoria Booths", "Euphoria Photo Booths"],
  description: "Lagos’s foremost event experience media house: 360° photo booths, magic mirror photo booths, audio and video guestbooks and event videography for weddings, birthdays and corporate events across Nigeria.",
  url: "https://euphoria.events",
  logo: "https://euphoria.events/favicon.png",
  image: ["https://euphoria.events/og-image.jpg", "https://euphoria.events/360-booth.webp", "https://euphoria.events/smile-camera.jpg"],
  telephone: "+2347038565517",
  email: "booking@euphoria.events",
  address: { "@type": "PostalAddress", addressLocality: "Lagos", addressRegion: "Lagos", addressCountry: "NG" },
  areaServed: [
    { "@type": "City", name: "Lagos" },
    { "@type": "State", name: "Lagos State" },
    { "@type": "Country", name: "Nigeria" },
  ],
  priceRange: "₦300,000 – ₦1,500,000",
  currenciesAccepted: "NGN",
  knowsAbout: ["360 photo booth", "magic mirror photo booth", "audio guestbook", "video guestbook", "event videography", "wedding photo booth", "corporate event activation"],
  sameAs: [
    "https://instagram.com/euphoria.eventsng",
    "https://tiktok.com/@euphoria.eventsng",
    "https://facebook.com/euphoria.eventsng",
    "https://youtube.com/@euphoria.eventsng",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Photo booth and event media rentals",
    itemListElement: SERVICES.map(s => ({
      "@type": "Offer",
      price: s.startingPrice,
      priceCurrency: "NGN",
      url: `https://euphoria.events/${SERVICE_SLUGS[s.id]}`,
      itemOffered: { "@type": "Service", name: s.title, description: s.shortDesc },
    })),
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "09:00", closes: "18:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday","Sunday"], opens: "10:00", closes: "20:00" },
  ],
};

export const LD_WEBSITE = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://euphoria.events/#website",
  url: "https://euphoria.events",
  name: "Euphoria Events",
  alternateName: ["Euphoria Photos", "Euphoria Photo Booth", "Euphoria Booths", "Euphoria Photo Booths"],
  inLanguage: "en-NG",
  publisher: { "@id": LD_BUSINESS_ID },
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
      provider: { "@id": LD_BUSINESS_ID },
      url: `https://euphoria.events/${SERVICE_SLUGS[s.id]}`,
      offers: {
        "@type": "Offer",
        price: s.startingPrice,
        priceCurrency: "NGN",
        priceSpecification: { "@type": "UnitPriceSpecification", price: s.startingPrice, priceCurrency: "NGN", referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitText: "event" } },
      },
    },
  })),
};
