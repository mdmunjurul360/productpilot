import { CatalogProduct } from '../context/DiscoveryContext';

export const UNIFIED_CATALOG: CatalogProduct[] = [
  {
    id: 'prod-sony-xm5',
    name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    slug: '/reviews/sony-wh-1000xm5',
    brand: 'Sony',
    category: 'Audio & Visual',
    subcategory: 'Noise-Canceling Headphones',
    price: '$398.00',
    numericPrice: 398,
    originalPrice: '$449.99',
    discount: '12% OFF',
    rating: 9.7,
    userRating: 4.8,
    reviewsCount: 1420,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
    ],
    merchant: 'Amazon',
    merchantsAvailable: ['Amazon', 'eBay', 'AliExpress', 'Daraz'],
    affiliateUrl: 'https://amazon.com',
    availability: 'In Stock',
    badge: "Editor's Choice",
    shortDescription:
      'The reigning industry champion in active noise cancellation, custom 30mm carbon composite drivers, and 8-microphone voice pickup.',
    specs: {
      dimensions: '8.9 x 7.3 x 2.8 in',
      weight: '250 grams (8.8 oz)',
      battery: '31.4 Hours (ANC On) / 40 Hours (ANC Off)',
      connectivity: 'Bluetooth 5.2, LDAC, AAC, SBC, 3.5mm Jack',
      performance: 'Class-leading mid-frequency ANC attenuation (-32dB)',
      compatibility: 'iOS, Android, macOS, Windows, Multipoint',
      warranty: '1 Year Manufacturer Limited Warranty',
      material: 'Synthetic Soft-Fit Leather, Recycled ABS',
      ancRating: '9.9 / 10',
    },
    pros: [
      'Industry-leading active noise cancellation targeting human voices',
      'Featherweight 250g chassis with stepless synthetic headband',
      '31.4-hour verified battery life with USB-PD 3-minute quick charging',
    ],
    cons: [
      'Non-collapsible headband requires slightly larger travel case',
      'No formal IP water resistance certification',
    ],
    releaseDate: '2024-05-15',
    isFeatured: true,
  },
  {
    id: 'prod-macbook-pro-16',
    name: 'Apple MacBook Pro 16" (M4 Max)',
    slug: '/reviews/apple-macbook-pro-16-m4-max',
    brand: 'Apple',
    category: 'Computing',
    subcategory: 'Pro Laptops',
    price: '$3,499.00',
    numericPrice: 3499,
    originalPrice: '$3,899.00',
    discount: '$400 OFF',
    rating: 9.8,
    userRating: 4.9,
    reviewsCount: 840,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80',
    ],
    merchant: 'Amazon',
    merchantsAvailable: ['Amazon', 'eBay'],
    affiliateUrl: 'https://amazon.com',
    availability: 'In Stock',
    badge: 'Premium Pick',
    shortDescription:
      'Unrivaled workstation computing performance, 128GB unified memory support, Liquid Retina XDR display, and 22-hour battery life.',
    specs: {
      dimensions: '14.01 x 9.77 x 0.66 in',
      weight: '2.16 kg (4.76 lbs)',
      battery: '22 Hours Web / 100Wh Battery (140W MagSafe)',
      connectivity: 'Wi-Fi 7, Bluetooth 5.3, 3x Thunderbolt 5, HDMI 2.1, SDXC',
      performance: '16-Core CPU, 40-Core GPU, 546 GB/s Memory Bandwidth',
      compatibility: 'macOS Sequoia, Metal 3, Pro Display XDR',
      warranty: '1 Year Apple Limited + AppleCare Eligible',
      material: '100% Recycled Aluminum Enclosure',
    },
    pros: [
      'Multi-core CPU and GPU performance does not throttle on battery power',
      'Best-in-class 1600-nit Liquid Retina XDR Mini-LED screen',
      'Whisper-quiet dual-fan vapor chamber cooling',
    ],
    cons: [
      'Significant investment price tag for max unified RAM',
      'Heavier than typical 15-inch ultraportables',
    ],
    releaseDate: '2024-11-01',
    isFeatured: true,
  },
  {
    id: 'prod-bose-ultra',
    name: 'Bose QuietComfort Ultra Wireless Headphones',
    slug: '/reviews/bose-qc-ultra',
    brand: 'Bose',
    category: 'Audio & Visual',
    subcategory: 'Noise-Canceling Headphones',
    price: '$429.00',
    numericPrice: 429,
    originalPrice: '$449.00',
    rating: 9.6,
    userRating: 4.7,
    reviewsCount: 920,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
    merchant: 'Amazon',
    merchantsAvailable: ['Amazon', 'eBay', 'AliExpress'],
    affiliateUrl: 'https://amazon.com',
    availability: 'In Stock',
    badge: 'Top Rated',
    shortDescription:
      'Immersive spatial audio tracking, ultra-compact fold-flat travel hinges, and iconic Bose acoustic isolation.',
    specs: {
      dimensions: '7.7 x 5.5 x 2.0 in',
      weight: '253 grams (8.9 oz)',
      battery: '24 Hours (Standard ANC) / 18 Hours (Immersive Audio)',
      connectivity: 'Bluetooth 5.3, Snapdragon Sound, aptX Adaptive, AAC',
      performance: 'Dynamic head-tracking spatialization with CustomTune',
      compatibility: 'iOS, Android, Windows, Multipoint',
      warranty: '1 Year Bose Limited Warranty',
      material: 'Anodized Aluminum Armature, Protein Leather',
      ancRating: '9.8 / 10',
    },
    pros: [
      'Folds flat into an ultra-compact clam-shell travel case',
      'Revolutionary Bose Immersive Audio head-tracking',
      'Unmatched sub-bass impact and low-end drone dampening',
    ],
    cons: [
      'Battery duration of 24h is shorter than Sony’s 31h',
      'Slightly higher introductory retail price',
    ],
    releaseDate: '2024-03-20',
    isFeatured: true,
  },
  {
    id: 'prod-roborock-s8',
    name: 'Roborock S8 Pro Ultra Robot Vacuum & Mop',
    slug: '/reviews/roborock-s8-pro-ultra',
    brand: 'Roborock',
    category: 'Smart Living',
    subcategory: 'Robot Vacuums',
    price: '$1,199.99',
    numericPrice: 1199.99,
    originalPrice: '$1,399.99',
    discount: '$200 OFF',
    rating: 9.5,
    userRating: 4.7,
    reviewsCount: 654,
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80',
    merchant: 'AliExpress',
    merchantsAvailable: ['Amazon', 'eBay', 'AliExpress', 'Daraz'],
    affiliateUrl: 'https://aliexpress.com',
    availability: 'In Stock',
    badge: 'Best Seller',
    shortDescription:
      'Fully autonomous floor cleaning with 6000Pa dual-roller suction, self-washing & hot-air drying mop dock station.',
    specs: {
      dimensions: '13.9 x 13.8 x 3.8 in (Robot) / 20.2 x 16.7 x 17.7 in (Dock)',
      weight: '4.8 kg (Robot) / 9.5 kg (Dock)',
      battery: '5200mAh Lithium (180 min runtime)',
      connectivity: 'Wi-Fi 2.4GHz, Matter Compatible, App Control',
      performance: '6000Pa HyperForce Suction, 3000 scrubs/min sonic mop',
      compatibility: 'Apple Home, Amazon Alexa, Google Assistant',
      warranty: '2 Year Roborock Limited Warranty',
    },
    pros: [
      'DuoRoller brushes virtually eliminate tangled pet fur',
      'Hot air dock drying completely stops mold and mildew odor',
      'Reactive 3D obstacle avoidance dodges power cables with ease',
    ],
    cons: [
      'Substantial dock footprint requires dedicated floor space',
    ],
    releaseDate: '2024-04-10',
    isFeatured: true,
  },
  {
    id: 'prod-asus-pg32ucdm',
    name: 'ASUS ROG Swift OLED PG32UCDM 32" 4K 240Hz',
    slug: '/reviews/asus-rog-swift-oled-pg32ucdm',
    brand: 'ASUS',
    category: 'Gaming',
    subcategory: 'OLED Monitors',
    price: '$1,299.00',
    numericPrice: 1299,
    rating: 9.7,
    userRating: 4.9,
    reviewsCount: 380,
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&auto=format&fit=crop&q=80',
    merchant: 'Amazon',
    merchantsAvailable: ['Amazon', 'eBay'],
    affiliateUrl: 'https://amazon.com',
    availability: 'Limited Stock',
    badge: 'Trending',
    shortDescription:
      'Third-generation QD-OLED panel with 4K resolution, 240Hz refresh rate, 0.03ms response time, and custom graphene heatsink.',
    specs: {
      dimensions: '28.3 x 20.8 x 10.6 in (with stand)',
      weight: '8.8 kg (19.4 lbs)',
      battery: 'N/A (90W USB-C PD Input/Output)',
      connectivity: '2x HDMI 2.1, 1x DisplayPort 1.4, 1x USB-C (90W PD)',
      performance: '3840x2160, 240Hz, 0.03ms GtG, 1000 nits Peak HDR',
      compatibility: 'PC, PS5, Xbox Series X, G-Sync Compatible',
      warranty: '3 Year Burn-in OLED Warranty',
      material: 'Titanium Slate Finish with Aura Sync RGB',
    },
    pros: [
      'Zero ghosting with instantaneous 0.03ms pixel response',
      'Pristine text clarity on 3rd-Gen QD-OLED subpixel matrix',
      'Comprehensive 3-year warranty covering permanent burn-in',
    ],
    cons: [
      'Requires modern high-end GPU (RTX 4080/4090) to drive 4K at 240fps',
    ],
    releaseDate: '2024-06-01',
    isFeatured: true,
  },
  {
    id: 'prod-airpods-max',
    name: 'Apple AirPods Max (USB-C Edition)',
    slug: '/reviews/apple-airpods-max',
    brand: 'Apple',
    category: 'Audio & Visual',
    subcategory: 'Noise-Canceling Headphones',
    price: '$549.00',
    numericPrice: 549,
    rating: 9.4,
    userRating: 4.6,
    reviewsCount: 2100,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80',
    merchant: 'Amazon',
    merchantsAvailable: ['Amazon', 'eBay'],
    affiliateUrl: 'https://amazon.com',
    availability: 'In Stock',
    badge: 'Hot Deal',
    shortDescription:
      'Stainless steel telescoping arms, breathable knit mesh canopy, and seamless Apple ecosystem computational audio.',
    specs: {
      dimensions: '7.37 x 6.64 x 3.28 in',
      weight: '384.8 grams (13.6 oz)',
      battery: '20 Hours ANC Playback',
      connectivity: 'Bluetooth 5.0, Apple H1 Chips, USB-C Audio',
      performance: 'Dual H1 chips running 9 billion operations per second',
      compatibility: 'Apple iOS, iPadOS, macOS, Apple TV, PC (basic)',
      warranty: '1 Year Apple Limited Warranty',
      material: 'Anodized Aluminum Cups, Stainless Steel Frame',
      ancRating: '9.7 / 10',
    },
    pros: [
      'Unsurpassed transparency mode sounds completely lifelike',
      'Luxury materials and mechanical tactile digital crown',
      'Lossless digital audio supported via direct USB-C connection',
    ],
    cons: [
      'Noticeably heavier at 385g than Sony (250g) and Bose (253g)',
      'Smart case provides minimal protective coverage',
    ],
    releaseDate: '2024-09-20',
  },
  {
    id: 'prod-sennheiser-m4',
    name: 'Sennheiser Momentum 4 Wireless',
    slug: '/reviews/sennheiser-momentum-4',
    brand: 'Sennheiser',
    category: 'Audio & Visual',
    subcategory: 'Noise-Canceling Headphones',
    price: '$299.95',
    numericPrice: 299.95,
    originalPrice: '$379.95',
    discount: '21% OFF',
    rating: 9.5,
    userRating: 4.7,
    reviewsCount: 780,
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
    merchant: 'eBay',
    merchantsAvailable: ['Amazon', 'eBay', 'Daraz'],
    affiliateUrl: 'https://ebay.com',
    availability: 'In Stock',
    badge: 'Best Value',
    shortDescription:
      'Audiophile-grade 42mm transducer system delivering staggering 60-hour battery stamina on a single charge.',
    specs: {
      dimensions: '7.1 x 7.6 x 1.8 in',
      weight: '293 grams (10.3 oz)',
      battery: '60 Hours continuous ANC playback',
      connectivity: 'Bluetooth 5.2, aptX Adaptive, AAC, SBC, 3.5mm, USB-C DAC',
      performance: 'Audiophile 42mm dynamic drivers (6 Hz - 22,000 Hz)',
      compatibility: 'iOS, Android, Windows, Mac',
      warranty: '2 Year Sennheiser International Warranty',
      material: 'Fabric Covered Headband, Lightweight Polymer',
      ancRating: '9.3 / 10',
    },
    pros: [
      'Unbelievable 60-hour battery life doubles all major competitors',
      'Rich, musical acoustic soundstage with customizable parametric EQ',
      'Built-in USB-C direct audiophile DAC playback mode',
    ],
    cons: [
      'Noise cancellation is slightly behind Sony XM5 in vocal ranges',
    ],
    releaseDate: '2023-10-12',
  },
  {
    id: 'prod-keychron-q1',
    name: 'Keychron Q1 Max 75% Wireless Mechanical Keyboard',
    slug: '/reviews/keychron-q1-max',
    brand: 'Keychron',
    category: 'Computing',
    subcategory: 'Custom Keyboards',
    price: '$219.00',
    numericPrice: 219,
    rating: 9.3,
    userRating: 4.8,
    reviewsCount: 450,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    merchant: 'Amazon',
    merchantsAvailable: ['Amazon', 'eBay'],
    affiliateUrl: 'https://amazon.com',
    availability: 'In Stock',
    badge: 'Top Rated',
    shortDescription:
      'CNC aluminum body, double-gasket acoustic mounting, 2.4GHz wireless polling, and fully hot-swappable switches.',
    specs: {
      dimensions: '12.87 x 5.71 x 1.41 in',
      weight: '1,724 grams (3.8 lbs)',
      battery: '4000mAh Battery (Up to 180 hours RGB off)',
      connectivity: '2.4GHz Wireless (1000Hz), Bluetooth 5.1, USB-C Wired',
      performance: 'Double-Gasket Acoustic Foam Mount, QMK/VIA Programmable',
      compatibility: 'macOS, Windows, Linux, iOS, Android',
      warranty: '1 Year Keychron Warranty',
      material: 'Full CNC Machined 6063 Aluminum Chassis',
    },
    pros: [
      'Deep, satisfying "marbly" acoustic typing sound signature',
      'Solid 3.8-pound aluminum chassis eliminates desk slippage',
      'Instant Mac/Windows physical toggle with native keycaps',
    ],
    cons: [
      'Too heavy for everyday backpack commuting',
    ],
    releaseDate: '2024-01-15',
  },
  {
    id: 'prod-sony-a7iv',
    name: 'Sony A7 IV Full-Frame Hybrid Mirrorless Camera',
    slug: '/reviews/sony-a7-iv',
    brand: 'Sony',
    category: 'Cameras',
    subcategory: 'Full-Frame Mirrorless',
    price: '$2,498.00',
    numericPrice: 2498,
    originalPrice: '$2,698.00',
    discount: '$200 OFF',
    rating: 9.6,
    userRating: 4.8,
    reviewsCount: 1120,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    merchant: 'Amazon',
    merchantsAvailable: ['Amazon', 'eBay', 'AliExpress'],
    affiliateUrl: 'https://amazon.com',
    availability: 'In Stock',
    badge: "Editor's Choice",
    shortDescription:
      '33MP full-frame Exmor R sensor, real-time eye autofocus tracking, 4K 60p 10-bit video, and 5.5-axis in-body stabilization.',
    specs: {
      dimensions: '5.16 x 3.8 x 3.14 in',
      weight: '658 grams (1.45 lbs)',
      battery: 'NP-FZ100 (approx. 580 shots per charge)',
      connectivity: 'USB-C 3.2 Gen 2 (10Gbps), Full HDMI, Wi-Fi 5GHz, Bluetooth',
      performance: '33MP BSI CMOS, BIONZ XR, 759-point Phase AF',
      compatibility: 'Sony E-Mount Lenses, CFexpress Type A / SD Cards',
      warranty: '1 Year Sony Warranty',
      material: 'Magnesium Alloy Weather-Sealed Body',
    },
    pros: [
      'Flawless real-time human, animal, and bird eye autofocus tracking',
      'Superb dynamic range and low-noise color science up to ISO 12,800',
      'Full-size HDMI port and variable-angle articulating touchscreen',
    ],
    cons: [
      '4K 60p video recording incurs a 1.5x Super35 crop factor',
    ],
    releaseDate: '2023-08-10',
    isFeatured: true,
  },
  {
    id: 'prod-dyson-v15',
    name: 'Dyson V15 Detect Absolute Cordless Vacuum',
    slug: '/reviews/dyson-v15-detect',
    brand: 'Dyson',
    category: 'Smart Living',
    subcategory: 'Stick Vacuums',
    price: '$749.99',
    numericPrice: 749.99,
    originalPrice: '$849.99',
    discount: '$100 OFF',
    rating: 9.4,
    userRating: 4.6,
    reviewsCount: 890,
    image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&auto=format&fit=crop&q=80',
    merchant: 'Amazon',
    merchantsAvailable: ['Amazon', 'eBay', 'Daraz'],
    affiliateUrl: 'https://amazon.com',
    availability: 'In Stock',
    badge: 'Trending',
    shortDescription:
      'Green laser optic reveals microscopic dust, acoustic piezo sensor calculates particle count, and 230AW cyclone suction.',
    specs: {
      dimensions: '49.6 x 9.8 x 10.5 in',
      weight: '3.1 kg (6.8 lbs)',
      battery: '60 Minutes Click-in Battery',
      connectivity: 'LCD Screen Real-Time Particle Counter',
      performance: '230 Air Watts Suction, 125,000 RPM Hyperdymium Motor',
      compatibility: 'Hardwood, Tile, Deep Pile Carpets',
      warranty: '2 Year Dyson Official Guarantee',
    },
    pros: [
      'Laser illumination head reveals debris invisible to naked eye',
      'Automatic suction throttling based on real-time particle density',
      'Whole-machine HEPA filtration captures 99.99% of allergens',
    ],
    cons: [
      'Finger trigger must be held down during cleaning',
    ],
    releaseDate: '2023-11-05',
  },
  {
    id: 'prod-steam-deck-oled',
    name: 'Valve Steam Deck OLED (512GB)',
    slug: '/reviews/steam-deck-oled',
    brand: 'Valve',
    category: 'Gaming',
    subcategory: 'Handheld Consoles',
    price: '$549.00',
    numericPrice: 549,
    rating: 9.6,
    userRating: 4.9,
    reviewsCount: 1650,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    merchant: 'Amazon',
    merchantsAvailable: ['Amazon', 'eBay'],
    affiliateUrl: 'https://amazon.com',
    availability: 'In Stock',
    badge: "Editor's Choice",
    shortDescription:
      '7.4-inch 90Hz HDR OLED display, custom 6nm AMD APU, 50Wh battery with 3-12 hour runtimes, and SteamOS flexibility.',
    specs: {
      dimensions: '11.7 x 4.6 x 1.9 in',
      weight: '640 grams (1.41 lbs)',
      battery: '50Wh Lithium-ion (3-12 Hours)',
      connectivity: 'Wi-Fi 6E, Bluetooth 5.3, USB-C DisplayPort, MicroSD',
      performance: '6nm AMD "Sephiroth" APU (4C/8T Zen 2 + 8 RDNA 2 CUs)',
      compatibility: 'Steam Library, Proton Compatibility, Desktop Linux',
      warranty: '1 Year Valve Hardware Warranty',
      material: 'Matte Ergonomic Polymer with Dual Haptic Trackpads',
    },
    pros: [
      'Stunning 1,000-nit HDR OLED panel with 90Hz refresh rate',
      'Superior battery efficiency over ROG Ally and Legion Go',
      'Ergonomic grip balance with dual capacitive trackpads',
    ],
    cons: [
      'Less raw compute horsepower than Z1 Extreme Windows handhelds',
    ],
    releaseDate: '2024-02-14',
    isFeatured: true,
  },
  {
    id: 'prod-lg-c4-oled',
    name: 'LG C4 65-inch 4K OLED evo Smart TV',
    slug: '/reviews/lg-c4-oled',
    brand: 'LG',
    category: 'Audio & Visual',
    subcategory: '4K OLED Displays',
    price: '$1,696.99',
    numericPrice: 1696.99,
    originalPrice: '$2,699.99',
    discount: '37% OFF',
    rating: 9.7,
    userRating: 4.8,
    reviewsCount: 520,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80',
    merchant: 'Amazon',
    merchantsAvailable: ['Amazon', 'eBay'],
    affiliateUrl: 'https://amazon.com',
    availability: 'In Stock',
    badge: 'Price Drop',
    shortDescription:
      'Alpha 9 Gen 7 AI Processor, 144Hz VRR gaming certification, Dolby Vision HDR, and infinite contrast ratio with zero blooming.',
    specs: {
      dimensions: '56.7 x 32.7 x 1.8 in (without stand)',
      weight: '16.6 kg (36.6 lbs)',
      battery: 'N/A',
      connectivity: '4x HDMI 2.1 (48Gbps, 144Hz, eARC), Wi-Fi 6, Bluetooth 5.1',
      performance: 'Alpha 9 Gen 7 AI 4K, 0.1ms response, G-Sync, FreeSync',
      compatibility: 'Apple AirPlay 2, HomeKit, Matter, Alexa',
      warranty: '1 Year LG Parts & Labor',
      material: 'Ultra-slim Bezel, Magnesium-fiber composite backplate',
    },
    pros: [
      'Perfect inky blacks and infinite contrast with self-lit OLED pixels',
      'Full 144Hz refresh rate with four 48Gbps HDMI 2.1 ports for PC/console',
      'Brighter evo panel outperforms prior generations in daylight rooms',
    ],
    cons: [
      'Built-in speakers lack deep low bass; external soundbar recommended',
    ],
    releaseDate: '2024-04-25',
    isFeatured: true,
  },
];

// -------------------------------------------------------------
// Fuzzy Match & Typo-Tolerant Search Algorithms
// -------------------------------------------------------------

function calculateLevenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

export function isFuzzyMatch(target: string, query: string): boolean {
  const t = target.toLowerCase();
  const q = query.toLowerCase().trim();

  if (q.length === 0) return true;
  if (t.includes(q)) return true;

  // Word-level partial and typo checks
  const targetWords = t.split(/\s+/);
  const queryWords = q.split(/\s+/);

  for (const qWord of queryWords) {
    if (qWord.length < 3) {
      if (!t.includes(qWord)) return false;
      continue;
    }

    let wordMatched = false;
    for (const tWord of targetWords) {
      if (tWord.includes(qWord) || qWord.includes(tWord)) {
        wordMatched = true;
        break;
      }
      // Allow 1 typo for words of length 3-5, 2 typos for 6+
      const maxDistance = qWord.length <= 5 ? 1 : 2;
      const dist = calculateLevenshteinDistance(tWord.slice(0, qWord.length), qWord);
      if (dist <= maxDistance) {
        wordMatched = true;
        break;
      }
    }

    if (!wordMatched) return false;
  }

  return true;
}

// Global Search Query Engine across Products, Categories, Brands, Guides, Comparisons
export interface SearchQueryResult {
  products: CatalogProduct[];
  categories: { name: string; slug: string; count: number }[];
  brands: { name: string; count: number }[];
  guides: { title: string; slug: string; readingTime: string }[];
  comparisons: { title: string; slug: string; winner: string }[];
}

export function executeSmartSearch(query: string): SearchQueryResult {
  const cleanQ = query.trim().toLowerCase();

  if (!cleanQ) {
    return {
      products: UNIFIED_CATALOG.slice(0, 5),
      categories: [
        { name: 'Audio & Visual', slug: '/category/audio-visual', count: 148 },
        { name: 'Computing', slug: '/category/computing', count: 210 },
        { name: 'Smart Living', slug: '/category/smart-home', count: 142 },
        { name: 'Gaming', slug: '/category/gaming', count: 96 },
      ],
      brands: [
        { name: 'Sony', count: 42 },
        { name: 'Apple', count: 35 },
        { name: 'Bose', count: 28 },
        { name: 'ASUS', count: 31 },
      ],
      guides: [
        { title: 'The 7 Best Noise-Canceling Headphones for Long-Haul Flights', slug: '/buying-guides/best-anc-headphones-travel', readingTime: '8 min read' },
        { title: 'Top 5 Productivity Workstation Setups for Remote Engineers', slug: '/buying-guides/best-remote-engineer-setups', readingTime: '11 min read' },
      ],
      comparisons: [
        { title: 'Sony WH-1000XM5 vs Bose QuietComfort Ultra: Definitive ANC Test', slug: '/compare/sony-wh-1000xm5-vs-bose-qc-ultra', winner: 'Sony WH-1000XM5' },
        { title: 'Steam Deck OLED vs ASUS ROG Ally X: Portability vs Raw Power', slug: '/compare/steam-deck-oled-vs-rog-ally-x', winner: 'Steam Deck OLED' },
      ],
    };
  }

  // Filter Products with fuzzy matching
  const matchingProducts = UNIFIED_CATALOG.filter((p) => {
    return (
      isFuzzyMatch(p.name, cleanQ) ||
      isFuzzyMatch(p.brand, cleanQ) ||
      isFuzzyMatch(p.category, cleanQ) ||
      isFuzzyMatch(p.subcategory, cleanQ) ||
      isFuzzyMatch(p.shortDescription, cleanQ) ||
      p.pros.some((pro) => isFuzzyMatch(pro, cleanQ))
    );
  });

  // Categories
  const allCategories = [
    { name: 'Audio & Visual', slug: '/category/audio-visual', count: 148 },
    { name: 'Noise-Canceling Headphones', slug: '/category/audio/anc-headphones', count: 42 },
    { name: 'Computing & Workstations', slug: '/category/computing', count: 210 },
    { name: 'Smart Living & Automation', slug: '/category/smart-home', count: 142 },
    { name: 'Gaming & High-End Gear', slug: '/category/gaming', count: 96 },
    { name: 'Cameras & Optics', slug: '/category/cameras', count: 88 },
  ];
  const matchingCategories = allCategories.filter((c) => isFuzzyMatch(c.name, cleanQ));

  // Brands
  const allBrands = [
    { name: 'Sony', count: 42 },
    { name: 'Apple', count: 35 },
    { name: 'Bose', count: 28 },
    { name: 'Roborock', count: 18 },
    { name: 'ASUS', count: 31 },
    { name: 'Sennheiser', count: 22 },
    { name: 'Keychron', count: 19 },
    { name: 'Dyson', count: 16 },
    { name: 'Valve', count: 6 },
    { name: 'LG', count: 24 },
  ];
  const matchingBrands = allBrands.filter((b) => isFuzzyMatch(b.name, cleanQ));

  // Guides
  const allGuides = [
    { title: 'The 7 Best Noise-Canceling Headphones for Long-Haul Flights (2026)', slug: '/buying-guides/best-anc-headphones-travel', readingTime: '8 min read' },
    { title: 'Top 5 Productivity Workstation Setups for Remote Engineers', slug: '/buying-guides/best-remote-engineer-setups', readingTime: '11 min read' },
    { title: 'How to Build a 100% Local-First Smart Home Without Cloud Subscriptions', slug: '/buying-guides/local-first-smart-home', readingTime: '14 min read' },
    { title: 'Best Esports Mice for Claw and Palm Grippers in 2026', slug: '/buying-guides/best-esports-gaming-mice', readingTime: '8 min read' },
    { title: 'The Best Cordless Stick Vacuums for Pet Hair (Lab Staged)', slug: '/buying-guides/best-cordless-vacuums', readingTime: '7 min read' },
  ];
  const matchingGuides = allGuides.filter((g) => isFuzzyMatch(g.title, cleanQ));

  // Comparisons
  const allComparisons = [
    { title: 'Sony WH-1000XM5 vs Bose QuietComfort Ultra: Definitive Head-to-Head', slug: '/compare/sony-wh-1000xm5-vs-bose-qc-ultra', winner: 'Sony WH-1000XM5' },
    { title: 'Steam Deck OLED vs ASUS ROG Ally X: Portability vs Raw Power', slug: '/compare/steam-deck-oled-vs-rog-ally-x', winner: 'Steam Deck OLED' },
    { title: 'Sonos Arc Ultra vs Bose Smart Ultra: Which Soundbar Reigns Supreme?', slug: '/compare/sonos-arc-ultra-vs-bose-smart-ultra', winner: 'Sonos Arc Ultra' },
    { title: 'Dell XPS 14 vs MacBook Pro 14: The Developer Showdown', slug: '/compare/dell-xps-14-vs-macbook-pro-14', winner: 'MacBook Pro 14' },
  ];
  const matchingComparisons = allComparisons.filter((c) => isFuzzyMatch(c.title, cleanQ));

  return {
    products: matchingProducts,
    categories: matchingCategories,
    brands: matchingBrands,
    guides: matchingGuides,
    comparisons: matchingComparisons,
  };
}
