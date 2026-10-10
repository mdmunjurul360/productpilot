export interface TrendingProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  rating: number;
  shortDescription: string;
  priceRange: string;
  image: string;
  badge?: string;
  awards?: string;
  pros: string[];
  affiliateLinks: {
    amazonUrl: string;
    amazonPrice: string;
    ebayUrl: string;
    ebayPrice: string;
    aliExpressUrl: string;
    aliExpressPrice: string;
  };
}

export interface CategoryCardData {
  id: string;
  name: string;
  slug: string;
  count: number;
  iconName: string;
  gradient: string;
  description: string;
}

export interface ReviewItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  rating: number;
  readingTime: string;
  date: string;
  thumbnail: string;
  excerpt: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
}

export interface BuyingGuideItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  itemCount: number;
  award: string;
  updatedDate: string;
  thumbnail: string;
  description: string;
  author: string;
}

export interface DealItem {
  id: string;
  title: string;
  slug: string;
  merchant: 'Amazon' | 'eBay' | 'AliExpress';
  category: string;
  originalPrice: number;
  salePrice: number;
  savingsPercent: number;
  couponCode?: string;
  endsIn: string;
  thumbnail: string;
  verifiedTimestamp: string;
}

export const HERO_PRODUCT = {
  id: 'sony-wh-1000xm5',
  title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
  tagline: "The gold standard in active noise cancellation, redesigned from the ground up.",
  score: 9.7,
  award: "Editor's Choice 2026 · Best Overall Headphones",
  reviewSlug: '/reviews/sony-wh-1000xm5',
  compareSlug: '/compare/sony-wh-1000xm5-vs-bose-qc-ultra',
  image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80',
  quickSummary:
    'Equipped with twin processors and an eight-microphone array, the WH-1000XM5 silences mid-and-high-frequency commute noise like nothing else on the market. With 30 hours of battery stamina and LDAC audiophile codec support, it is our definitive top recommendation.',
  lowestPrice: '$398.00',
  storeCount: 4,
  testedMetrics: [
    { label: 'ANC Attenuation', value: '-34 dB', status: 'Best-in-Class' },
    { label: 'Battery Stamina', value: '31.4 hrs', status: 'Lab Verified' },
    { label: 'Total Weight', value: '250 grams', status: 'Ultra-Comfort' },
  ],
  merchants: [
    { name: 'Amazon', price: '$398.00', inStock: true, prime: true },
    { name: 'eBay', price: '$349.99', inStock: true, prime: false },
    { name: 'AliExpress', price: '$329.00', inStock: true, prime: false },
  ],
};

export const TRENDING_PRODUCTS: TrendingProduct[] = [
  {
    id: 'macbook-pro-16-m4',
    name: 'Apple MacBook Pro 16" (M4 Max)',
    slug: '/reviews/apple-macbook-pro-16-m4-max',
    category: 'Computing & Workstations',
    rating: 9.8,
    badge: 'Supreme Workstation',
    awards: 'Best Creator Laptop 2026',
    shortDescription:
      'Crushing 40-core GPU, 128GB unified bandwidth, and a Liquid Retina XDR screen that hits 1,600 nits peak HDR with 22-hour battery life.',
    priceRange: '$3,499 - $3,899',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=700&auto=format&fit=crop&q=80',
    pros: ['Silent acoustic profile under full load', 'Unmatched 22h battery runtime', 'Best-in-class Mini-LED display'],
    affiliateLinks: {
      amazonUrl: 'https://amazon.com',
      amazonPrice: '$3,499.00',
      ebayUrl: 'https://ebay.com',
      ebayPrice: '$3,390.00',
      aliExpressUrl: 'https://aliexpress.com',
      aliExpressPrice: '$3,420.00',
    },
  },
  {
    id: 'roborock-s8-pro',
    name: 'Roborock S8 Pro Ultra Robot Vacuum',
    slug: '/reviews/roborock-s8-pro-ultra',
    category: 'Smart Home & Floorcare',
    rating: 9.5,
    badge: 'Hands-Free Cleaning',
    awards: 'Top Robot Vacuum 2026',
    shortDescription:
      'Autonomous mop-washing, warm air drying, 6,000Pa dual rubber rollers, and structured 3D obstacle avoidance that never eats charging cables.',
    priceRange: '$1,199 - $1,399',
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=700&auto=format&fit=crop&q=80',
    pros: ['Zero-maintenance auto-clean dock', 'Reactive 3D obstacle evasion', 'VibraRise 2.0 sonic mopping'],
    affiliateLinks: {
      amazonUrl: 'https://amazon.com',
      amazonPrice: '$1,199.99',
      ebayUrl: 'https://ebay.com',
      ebayPrice: '$1,149.00',
      aliExpressUrl: 'https://aliexpress.com',
      aliExpressPrice: '$1,099.00',
    },
  },
  {
    id: 'asus-rog-pg32ucdm',
    name: 'ASUS ROG Swift OLED PG32UCDM 240Hz',
    slug: '/reviews/asus-rog-swift-oled-pg32ucdm',
    category: 'Gaming Monitors',
    rating: 9.7,
    badge: 'Esports Elite',
    awards: 'Best OLED Monitor',
    shortDescription:
      '3rd Gen QD-OLED 4K panel delivering instantaneous 0.03ms pixel response, graphene heatsink design, and Dolby Vision HDR.',
    priceRange: '$1,299 - $1,349',
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=700&auto=format&fit=crop&q=80',
    pros: ['True 240Hz 4K fluidity', 'Inky infinite blacks without blooming', 'Custom heatsink prevents burn-in'],
    affiliateLinks: {
      amazonUrl: 'https://amazon.com',
      amazonPrice: '$1,299.00',
      ebayUrl: 'https://ebay.com',
      ebayPrice: '$1,249.00',
      aliExpressUrl: 'https://aliexpress.com',
      aliExpressPrice: '$1,270.00',
    },
  },
  {
    id: 'fujifilm-x100vi',
    name: 'Fujifilm X100VI Compact Street Camera',
    slug: '/reviews/fujifilm-x100vi',
    category: 'Cameras & Photography',
    rating: 9.6,
    badge: 'Street Photography King',
    awards: 'Camera of the Year',
    shortDescription:
      '40.2MP X-Trans 5 HR sensor paired with 6.0 stops of in-body image stabilization and timeless analog mechanical dials.',
    priceRange: '$1,599 - $1,799',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=700&auto=format&fit=crop&q=80',
    pros: ['Legendary Fujifilm film simulations', 'Incredible 40.2MP crop flexibility', 'Pocketable hybrid optical viewfinder'],
    affiliateLinks: {
      amazonUrl: 'https://amazon.com',
      amazonPrice: '$1,599.00',
      ebayUrl: 'https://ebay.com',
      ebayPrice: '$1,750.00',
      aliExpressUrl: 'https://aliexpress.com',
      aliExpressPrice: '$1,680.00',
    },
  },
  {
    id: 'herman-miller-embody',
    name: 'Herman Miller x Logitech G Embody',
    slug: '/reviews/herman-miller-logitech-embody',
    category: 'Home Office & Ergonomics',
    rating: 9.7,
    badge: 'Ergonomic Benchmark',
    awards: 'Best Ergonomic Chair',
    shortDescription:
      'Pixelated support matrix that micro-conforms to spine movement, pressure distribution cooling foam, and a 12-year structural warranty.',
    priceRange: '$1,695 - $1,895',
    image: 'https://images.unsplash.com/photo-1580481077112-9218d6174a72?w=700&auto=format&fit=crop&q=80',
    pros: ['Eliminates lower-back lumbar fatigue', 'Copper-infused cooling layer', 'Backed by 12-year official warranty'],
    affiliateLinks: {
      amazonUrl: 'https://amazon.com',
      amazonPrice: '$1,795.00',
      ebayUrl: 'https://ebay.com',
      ebayPrice: '$1,480.00',
      aliExpressUrl: 'https://aliexpress.com',
      aliExpressPrice: '$1,550.00',
    },
  },
  {
    id: 'dyson-v15-detect',
    name: 'Dyson V15 Detect Absolute Cordless',
    slug: '/reviews/dyson-v15-detect',
    category: 'Home & Kitchen',
    rating: 9.3,
    badge: 'Deep Clean Champion',
    awards: 'Best Cordless Vacuum',
    shortDescription:
      'Piezo sensor counts microscopic dust particles in real-time, green laser illuminates invisible hardwood debris, and 240AW cyclone power.',
    priceRange: '$649 - $749',
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=700&auto=format&fit=crop&q=80',
    pros: ['Illuminating laser reveals micro dust', 'Intelligent suction autoscaling', '60-minute fade-free battery'],
    affiliateLinks: {
      amazonUrl: 'https://amazon.com',
      amazonPrice: '$649.99',
      ebayUrl: 'https://ebay.com',
      ebayPrice: '$589.00',
      aliExpressUrl: 'https://aliexpress.com',
      aliExpressPrice: '$620.00',
    },
  },
];

export const FEATURED_CATEGORIES: CategoryCardData[] = [
  {
    id: 'smart-home',
    name: 'Smart Home',
    slug: '/category/smart-home',
    count: 142,
    iconName: 'Home',
    gradient: 'from-blue-600 to-indigo-600',
    description: 'Matter hubs, smart locks, automated shades & security',
  },
  {
    id: 'kitchen',
    name: 'Kitchen Tech',
    slug: '/category/kitchen',
    count: 88,
    iconName: 'Utensils',
    gradient: 'from-amber-500 to-orange-600',
    description: 'Espresso machines, air fryers, sous vide & induction',
  },
  {
    id: 'electronics',
    name: 'Electronics',
    slug: '/category/electronics',
    count: 210,
    iconName: 'Tv',
    gradient: 'from-cyan-500 to-blue-600',
    description: '4K OLED displays, DAC amps, wireless soundbars',
  },
  {
    id: 'gaming',
    name: 'Gaming & Esports',
    slug: '/category/gaming',
    count: 124,
    iconName: 'Gamepad2',
    gradient: 'from-purple-600 to-pink-600',
    description: '240Hz monitors, rapid-trigger mice, sim rigs',
  },
  {
    id: 'wearables',
    name: 'Wearables & Health',
    slug: '/category/wearables',
    count: 94,
    iconName: 'Watch',
    gradient: 'from-emerald-500 to-teal-600',
    description: 'ECG smartwatches, smart rings, biometric bands',
  },
  {
    id: 'cameras',
    name: 'Cameras & Lenses',
    slug: '/category/cameras',
    count: 76,
    iconName: 'Camera',
    gradient: 'from-rose-500 to-red-600',
    description: 'Mirrorless bodies, cinema primes, gimbal stabilizers',
  },
  {
    id: 'home-office',
    name: 'Home Office',
    slug: '/category/home-office',
    count: 112,
    iconName: 'Laptop',
    gradient: 'from-slate-700 to-slate-900',
    description: 'Ergonomic task chairs, standing desks, docks',
  },
  {
    id: 'accessories',
    name: 'EDC & Accessories',
    slug: '/category/accessories',
    count: 165,
    iconName: 'Briefcase',
    gradient: 'from-violet-600 to-indigo-700',
    description: 'GaN chargers, magnetic power banks, tech pouches',
  },
  {
    id: 'beauty',
    name: 'Personal Care Tech',
    slug: '/category/personal-care',
    count: 62,
    iconName: 'Sparkles',
    gradient: 'from-fuchsia-500 to-rose-500',
    description: 'Sonic toothbrushes, high-speed ionic dryers',
  },
  {
    id: 'fitness',
    name: 'Fitness & Recovery',
    slug: '/category/fitness',
    count: 78,
    iconName: 'Activity',
    gradient: 'from-green-600 to-emerald-700',
    description: 'Percussive massage guns, smart treadmills, GPS',
  },
  {
    id: 'drones',
    name: 'Drones & Action',
    slug: '/category/drones',
    count: 45,
    iconName: 'Navigation',
    gradient: 'from-sky-500 to-blue-700',
    description: 'Sub-249g drones, 360 action cams, FPV systems',
  },
  {
    id: 'creator-gear',
    name: 'Creator Studio',
    slug: '/category/creator-gear',
    count: 98,
    iconName: 'Mic',
    gradient: 'from-orange-500 to-red-600',
    description: 'Broadcast microphones, audio interfaces, keylights',
  },
];

export const EDITORS_CHOICE_ARTICLE = {
  title: 'The Best All-Around Noise Canceling Headphones for 2026: Why the Sony WH-1000XM5 Still Outperforms Rivals',
  slug: '/reviews/sony-wh-1000xm5',
  author: {
    name: 'Dr. Marcus Vance',
    role: 'Lead Acoustic Engineer & Testing Director',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    testedHours: '140+ Lab Hours',
  },
  publishDate: 'Updated October 2026',
  readingTime: '12 min read',
  score: 9.7,
  image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&auto=format&fit=crop&q=80',
  excerpt:
    'After 140 continuous testing hours inside our anechoic chamber, the Sony WH-1000XM5 emerged as the undisputed winner against Apple AirPods Max and Bose QuietComfort Ultra. Its new synthetic protein leather headband, dual processor topology, and auto-optimizing NC system create an acoustic isolation seal that competitors simply cannot replicate.',
  pros: [
    'Subdues airplane engine roar and coffee shop chatter better than any competitor',
    '30 hours of continuous playback with ANC engaged (40 hours with ANC off)',
    'Flawless wear detection, multipoint Bluetooth 5.2 pairing, and LDAC audio',
  ],
  cons: [
    'No folding hinges—requires slightly larger travel case',
    'Touch control gestures take 1-2 days of muscle memory to master',
  ],
  quote:
    '“If you spend more than 2 hours a day commuting or working in an open office, this is the single best investment you can make in your focus.”',
};

export const LATEST_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    title: 'LG G4 OLED TV Review: The Brightness Milestone We’ve Been Waiting For',
    slug: '/reviews/lg-g4-oled',
    category: 'Displays & Home Cinema',
    rating: 9.8,
    readingTime: '9 min read',
    date: 'Oct 3, 2026',
    thumbnail: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&auto=format&fit=crop&q=80',
    excerpt: 'Micro Lens Array II technology propels OLED to 3,000 nits peak highlights while preserving perfect zero-black levels.',
    author: {
      name: 'Elena Rostova',
      role: 'Display Calibration Specialist',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    },
  },
  {
    id: 'rev-2',
    title: 'Sonos Arc Ultra Review: Sound Motion Tech Revolutionizes Living Room Atmos',
    slug: '/reviews/sonos-arc-ultra',
    category: 'Audio & Acoustics',
    rating: 9.4,
    readingTime: '8 min read',
    date: 'Oct 1, 2026',
    thumbnail: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80',
    excerpt: '14 custom drivers and revolutionary flat transducers deliver double the bass output in the same sleek architectural chassis.',
    author: {
      name: 'Dr. Marcus Vance',
      role: 'Lead Acoustic Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    },
  },
  {
    id: 'rev-3',
    title: 'Garmin Fenix 8 Solar In-Depth Test: The Indestructible Adventure Companion',
    slug: '/reviews/garmin-fenix-8-solar',
    category: 'Wearables & Health',
    rating: 9.5,
    readingTime: '11 min read',
    date: 'Sep 29, 2026',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    excerpt: 'Dual-band multi-GNSS tracking, titanium bezel, dive-rated buttons, and 28 days of solar-extended expedition battery.',
    author: {
      name: 'Kofi Mensah',
      role: 'Outdoor Gear Editor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    },
  },
  {
    id: 'rev-4',
    title: 'Breville Barista Touch Impress: Can Automated Tamping Beat Real Baristas?',
    slug: '/reviews/breville-barista-touch-impress',
    category: 'Kitchen Tech',
    rating: 9.2,
    readingTime: '7 min read',
    date: 'Sep 27, 2026',
    thumbnail: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    excerpt: 'Assisted 10kg tamp gauge with auto dose calculation turns specialty single-origin espresso extraction into a 60-second joy.',
    author: {
      name: 'Sophie Lin',
      role: 'Culinary Hardware Editor',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    },
  },
];

export const BUYING_GUIDES: BuyingGuideItem[] = [
  {
    id: 'guide-1',
    title: 'The Best Budget Mirrorless Cameras of 2026 (Under $1,000)',
    slug: '/buying-guides/best-budget-cameras-2026',
    category: 'Cameras & Photography',
    itemCount: 8,
    award: 'Updated for 2026',
    updatedDate: 'Oct 2026',
    author: 'Elena Rostova',
    thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
    description:
      'We tested autofocus tracking speeds, low-light sensor noise, and kit lens sharpness to find cameras that deliver true cinematic punch without breaking four digits.',
  },
  {
    id: 'guide-2',
    title: 'The Best Smart Lights for Every Room: Matter, Thread & Color Accuracy',
    slug: '/buying-guides/best-smart-lights',
    category: 'Smart Home',
    itemCount: 12,
    award: 'Lab Tested Pick',
    updatedDate: 'Oct 2026',
    author: 'Liam Chen',
    thumbnail: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=600&auto=format&fit=crop&q=80',
    description:
      'Philips Hue vs Nanoleaf vs Govee: spectral testing reveals which bulbs hit true 95+ CRI warm white and instantaneous Matter-over-Thread responses.',
  },
  {
    id: 'guide-3',
    title: 'The Best Robot Vacuums for Pet Hair and Carpet Obstacles',
    slug: '/buying-guides/best-robot-vacuums',
    category: 'Floorcare Tech',
    itemCount: 10,
    award: 'Hands-On Benchmark',
    updatedDate: 'Sep 2026',
    author: 'Sophie Lin',
    thumbnail: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80',
    description:
      'We spread 500 grams of synthetic fur, sand, and cereal across high-pile rugs and bare hardwood to measure suction efficiency and roller tangling.',
  },
  {
    id: 'guide-4',
    title: 'The Best Ergonomic Office Chairs for Back Pain Relief',
    slug: '/buying-guides/best-ergonomic-chairs',
    category: 'Home Office',
    itemCount: 7,
    award: 'Medical Verified',
    updatedDate: 'Sep 2026',
    author: 'Dr. Marcus Vance',
    thumbnail: 'https://images.unsplash.com/photo-1580481077112-9218d6174a72?w=600&auto=format&fit=crop&q=80',
    description:
      'Tested with orthopedic pressure sensors: Herman Miller Embody, Steelcase Gesture, and budget ergonomic alternatives that support 8+ hour work sessions.',
  },
];

export const VERIFIED_DEALS: DealItem[] = [
  {
    id: 'deal-1',
    title: 'Bose QuietComfort Ultra Wireless Noise Canceling Headphones',
    slug: '/reviews/bose-qc-ultra',
    merchant: 'Amazon',
    category: 'Audio',
    originalPrice: 429.0,
    salePrice: 329.0,
    savingsPercent: 23,
    couponCode: 'BOSEPRIME26',
    endsIn: '14h 22m',
    thumbnail: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=80',
    verifiedTimestamp: 'Verified 42m ago',
  },
  {
    id: 'deal-2',
    title: 'Apple iPad Air 11" M2 Chip (128GB Wi-Fi - Starlight)',
    slug: '/reviews/apple-ipad-air-m2',
    merchant: 'eBay',
    category: 'Tablets',
    originalPrice: 599.0,
    salePrice: 479.0,
    savingsPercent: 20,
    endsIn: '2d 08h',
    thumbnail: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80',
    verifiedTimestamp: 'Verified 1h ago',
  },
  {
    id: 'deal-3',
    title: 'Anker Prime 20,000mAh 200W GaN Power Bank with Smart Display',
    slug: '/reviews/anker-prime-200w',
    merchant: 'AliExpress',
    category: 'Accessories',
    originalPrice: 129.99,
    salePrice: 84.99,
    savingsPercent: 35,
    couponCode: 'ANKERFLASH',
    endsIn: '8h 45m',
    thumbnail: 'https://images.unsplash.com/photo-1609592807664-41d6fc22a969?w=500&auto=format&fit=crop&q=80',
    verifiedTimestamp: 'Verified 18m ago',
  },
  {
    id: 'deal-4',
    title: 'Samsung 49" Odyssey OLED G9 Curved Gaming Monitor (240Hz)',
    slug: '/reviews/samsung-odyssey-oled-g9',
    merchant: 'Amazon',
    category: 'Gaming',
    originalPrice: 1799.99,
    salePrice: 1099.99,
    savingsPercent: 39,
    endsIn: '1d 16h',
    thumbnail: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=80',
    verifiedTimestamp: 'Verified 2h ago',
  },
];
