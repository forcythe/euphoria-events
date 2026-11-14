// ─── SEARCH LANDING PAGES ─────────────────────────────────────────────
// One page per service (plus an overview) so each can rank for its own searches.
// Copy uses only facts from data.js (prices, durations, features, FAQs).
// Synonyms appear once, naturally, in "aka"; do not stuff them elsewhere.

export const SITE = 'https://euphoria.events';

export const SEO_PAGES = [
  {
    slug: '360-photo-booth-lagos',
    service: '360',
    galleryTag: '360 Booth',
    title: '360° Photo Booth Rental in Lagos',
    description: 'Hire a 360° slow-motion video booth in Lagos for weddings, birthdays and corporate events. Custom branding, instant QR sharing. From ₦350,000.',
    h1: '360° photo booth rental in Lagos',
    lede: 'Guests step onto the platform, the camera circles them in slow motion, and a branded clip is on their phone before they step off. It is the moment everyone queues for.',
    aka: ['360 booth', '360 video booth', '360 camera booth', '360 spin booth', 'slow-motion booth'],
    steps: [
      'Guests step onto the platform, alone or in a group.',
      'The camera arm circles them and records in slow motion, under LED ring lighting.',
      'Each clip is finished with your custom overlay: names, date, logo or hashtag.',
      'Guests scan a QR code to download and share their clip on the spot.',
    ],
    faqs: [
      { q: 'How much does a 360 photo booth cost in Lagos?', a: 'Euphoria’s 360° photo booth starts from ₦350,000 per event in Lagos. That covers 3 to 4 hours, unlimited guests, custom overlays, LED lighting, instant QR sharing and a dedicated attendant. Packages that combine the 360° booth with videography start from ₦850,000.' },
      { q: 'What is a 360 photo booth?', a: 'A 360 photo booth is a platform with a camera on a rotating arm. Guests stand on it while the camera circles them, recording a short slow-motion video from every angle. The clip is branded and shared to the guest’s phone, usually by QR code.' },
      { q: 'How do guests get their 360 videos?', a: 'Each clip is shared instantly by QR code. Guests scan it with their phone camera, download the video and post it straight to Instagram, TikTok or WhatsApp, often before they have left the platform.' },
      { q: 'Can the 360 booth be branded for a corporate event?', a: 'Yes. Every 360° clip carries a custom overlay with your logo, event name, hashtag or campaign message, so each video guests share also promotes your brand. We agree the design with you 1 to 2 weeks before the event.' },
      { q: 'Do you bring the 360 booth outside Lagos?', a: 'Yes. We cover Greater Lagos and travel to other Nigerian cities for an added travel charge. Contact us with your venue and date for a custom quote.' },
    ],
  },
  {
    slug: 'magic-mirror-photo-booth-lagos',
    service: 'smile',
    galleryTag: 'Magic Mirror',
    title: 'Magic Mirror Photo Booth Hire in Lagos',
    description: 'Magic mirror photo booth hire in Lagos: unlimited instant prints, branded templates, props and an online gallery. Weddings and parties. From ₦400,000.',
    h1: 'Magic mirror photo booth hire in Lagos',
    lede: 'A full-length mirror that invites guests to tap, pose and print. Every guest leaves with a printed keepsake in your event’s design, plus a digital copy.',
    aka: ['photo booth', 'photobooth', 'mirror photo booth', 'selfie mirror', 'photo booth with prints'],
    steps: [
      'Guests tap the full-length mirror screen to start.',
      'They pose with props from the prop station while the mirror counts down.',
      'The photo prints instantly on your custom branded template.',
      'Guests also receive a digital copy, and every photo goes into an online gallery after the event.',
    ],
    faqs: [
      { q: 'How much is a photo booth in Lagos?', a: 'Euphoria’s magic mirror photo booth starts from ₦400,000 per event in Lagos. That includes 3 to 4 hours, unlimited instant prints, digital copies for every guest, a custom branded template, a full prop station and an online gallery after the event. The Spark package, with 6 hours of magic mirror, is ₦550,000.' },
      { q: 'What is a magic mirror photo booth?', a: 'A magic mirror photo booth is a full-length mirror with a touch screen and camera built in. Guests tap the mirror to start, pose, and see their photo appear before it prints instantly. It is a more glamorous, interactive take on the classic photo booth.' },
      { q: 'Do guests get printed photos?', a: 'Yes. Prints are unlimited, so every guest can take home as many printed photos as they like, each on your branded template. Every guest also gets a digital copy.' },
      { q: 'Can the print design match my wedding or brand?', a: 'Yes. We design a custom print template with your names, date, logo or colours, and agree it with you 1 to 2 weeks before the event.' },
      { q: 'Are props included?', a: 'Yes. A full prop station comes with every magic mirror booking.' },
    ],
  },
  {
    slug: 'audio-guestbook-lagos',
    service: 'guestbook',
    galleryTag: 'Guestbook',
    title: 'Audio & Video Guestbook Rental in Lagos',
    description: 'Audio and video guestbook rental in Lagos. Guests record HD video or audio messages at a styled kiosk, saved to a private gallery. From ₦400,000.',
    h1: 'Audio and video guestbook rental in Lagos',
    lede: 'Replace the pen-and-paper guestbook with messages you can actually hear and watch again: laughter, advice and toasts from the people who were there.',
    aka: ['audio guest book', 'video guestbook', 'phone guestbook', 'wedding guestbook', 'voicemail guestbook'],
    steps: [
      'We set up a styled guestbook kiosk at your event.',
      'Guests record an HD video message, or choose audio only.',
      'A QR code gives guests quick access to the guestbook.',
      'You receive every message in a private gallery link to keep and share.',
    ],
    faqs: [
      { q: 'How much is an audio guestbook in Lagos?', a: 'Euphoria’s audio and video guestbook starts from ₦400,000 and runs for your full event, with unlimited guests. It includes HD video messages, an audio-only option, QR code access, a styled kiosk and a private gallery link for all your messages.' },
      { q: 'What is an audio guestbook?', a: 'An audio guestbook lets guests leave a spoken message instead of writing in a book. With Euphoria, guests can record a video message or an audio-only message at a styled kiosk, and every recording is saved for you.' },
      { q: 'How do we receive the messages?', a: 'All the video and audio messages are collected in a private gallery link that only you and the people you share it with can open.' },
      { q: 'How long is the guestbook available at the event?', a: 'The guestbook runs for the full duration of your event, so guests can record whenever they are ready.' },
    ],
  },
  {
    slug: 'event-videography-lagos',
    service: 'video',
    galleryTag: 'Videography',
    title: 'Event Videographer in Lagos',
    description: 'Event videographer in Lagos: 4K roaming coverage, a cinematic 2–3 minute highlight reel and raw footage, delivered the same week. From ₦300,000.',
    h1: 'Event videographer in Lagos',
    lede: 'A roaming videographer who captures the candid moments, the laughs, the dances and the toasts, and turns them into a cinematic film of your day.',
    aka: ['event videography', 'wedding videographer', 'party videographer', 'corporate event video', 'highlight reel'],
    steps: [
      'Your videographer roams the event, capturing it in 4K.',
      'We edit the footage into a cinematic film.',
      'You receive a 2 to 3 minute highlight reel, ready to share.',
      'Raw footage is included, delivered the same week.',
    ],
    faqs: [
      { q: 'How much does an event videographer cost in Lagos?', a: 'Euphoria’s mobile videography starts from ₦300,000 for 2 to 4 hours of coverage. It includes 4K capture, a cinematic edit, a 2 to 3 minute highlight reel and raw footage, delivered the same week.' },
      { q: 'How soon will I receive my event video?', a: 'Videos are delivered the same week as your event.' },
      { q: 'What do I receive?', a: 'A cinematically edited highlight reel of 2 to 3 minutes, plus the raw footage, all filmed in 4K.' },
      { q: 'Do you offer drone coverage?', a: 'Yes. Drone coverage is included in the Euphoria package (₦1,500,000) and the Ignite package (₦850,000), alongside videography and a highlight reel.' },
    ],
  },
  {
    slug: 'photo-booth-rental-lagos',
    service: null,
    galleryTag: null,
    title: 'Photo Booth Rental in Lagos: Prices & Packages',
    description: 'Photo booth rental in Lagos: compare the 360° video booth, magic mirror booth, audio guestbook and videography. Prices and packages from ₦300,000.',
    h1: 'Photo booth rental in Lagos',
    lede: 'Four ways to turn your guests into the story: a 360° slow-motion booth, a magic mirror with instant prints, an audio and video guestbook, and a roaming videographer. Book one, or combine them in a package.',
    aka: ['photo booth hire', 'photobooth rental', 'event photo booth', 'party booth', 'event experience rentals'],
    steps: null,
    faqs: [
      { q: 'How much does it cost to rent a photo booth in Lagos?', a: 'At Euphoria, prices start from ₦300,000 for mobile videography, ₦350,000 for the 360° photo booth and ₦400,000 for the magic mirror booth or the audio and video guestbook. Packages start at ₦550,000 (Spark), ₦850,000 (Ignite) and ₦1,500,000 (Euphoria).' },
      { q: 'Which photo booth is best for a wedding?', a: 'It depends on what you want guests to take home. The 360° booth creates slow-motion videos made for sharing online. The magic mirror gives guests printed photos to keep. The audio and video guestbook collects messages for the couple. The Euphoria package includes all three, plus videography and drone coverage.' },
      { q: 'How far in advance should I book a photo booth?', a: 'We recommend booking at least 4 to 6 weeks ahead for weekends, especially in the peak months of May to August and December. Weekday bookings can often be arranged within 1 to 2 weeks.' },
      { q: 'Is a deposit required?', a: 'Yes. A 30% deposit secures your date, and the balance is due 7 days before your event.' },
      { q: 'Do you cover events outside Lagos?', a: 'Yes. We cover Greater Lagos and travel to other Nigerian cities for an added travel charge. Contact us with your venue and date for a custom quote.' },
    ],
  },
];

export const seoPageFor = slug => SEO_PAGES.find(p => p.slug === slug);
export const seoPageForService = id => SEO_PAGES.find(p => p.service === id);
