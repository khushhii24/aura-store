/** Editorial copy and navigation. Kept out of components so the site reads as content-driven. */

export const NAV_LINKS = [
  { label: 'New', to: '/shop?sort=newest' },
  { label: 'Men', to: '/shop?audience=men' },
  { label: 'Women', to: '/shop?audience=women' },
  { label: 'Collections', to: '/shop' },
  { label: 'About', to: '/about' },
]

export const ANNOUNCEMENTS = [
  'Free shipping over $150',
  '30-day wear test',
  'Carbon-neutral delivery',
]

/** Section 7 — the five things the shoe actually does. */
export const STORY_FEATURES = [
  {
    id: 'cushioning',
    index: '01',
    title: 'Cushioning that lasts the day',
    copy: 'Nitrogen-infused foam holds its shape through roughly 800 km of walking. Most midsoles are noticeably flatter by 400.',
    metric: '32 mm',
    metricLabel: 'heel stack',
  },
  {
    id: 'weight',
    index: '02',
    title: 'Light enough to forget',
    copy: 'A single-piece upper removes eleven separate panels, and with them the seams, the glue and about 40 grams.',
    metric: '238 g',
    metricLabel: 'US 9',
  },
  {
    id: 'breathability',
    index: '03',
    title: 'An upper that breathes',
    copy: 'Knit density changes across the foot — open over the toes where heat collects, tight through the midfoot where you need hold.',
    metric: '4 zones',
    metricLabel: 'knit density',
  },
  {
    id: 'flex',
    index: '04',
    title: 'A sole that bends where you do',
    copy: 'Flex grooves are cut to the line your foot actually folds along, not the middle of the shoe.',
    metric: '6°',
    metricLabel: 'forefoot rocker',
  },
  {
    id: 'grip',
    index: '05',
    title: 'Grip placed, not sprayed',
    copy: 'Rubber sits only where wear-test data said it was needed. Everywhere else is exposed foam, which is lighter.',
    metric: '30%',
    metricLabel: 'reclaimed rubber',
  },
]

/** Section 8 — the four layers, top to bottom. */
export const TECH_LAYERS = [
  {
    id: 'upper',
    number: '01',
    name: 'Upper',
    summary: 'Panelled, minimal seams',
    copy: 'Cut so the only seam across the flex point is one you can see. Softer panels where the foot moves, firmer through the midfoot where it needs holding.',
  },
  {
    id: 'cushioning',
    number: '02',
    name: 'Cushioning',
    summary: 'Padded collar, moulded footbed',
    copy: 'The layer you feel first. A padded collar holds the heel without pressing on the ankle bone, over a bio-oil footbed that compresses on impact and is back to full height before the next step.',
  },
  {
    id: 'midsole',
    number: '03',
    name: 'Midsole',
    summary: 'Nitrogen-infused AURAFOAM',
    copy: 'Gas injected into the foam during moulding creates millions of closed cells. Lighter than standard EVA, and it keeps returning energy long after standard EVA has gone flat. Wrapped rather than exposed, so it holds its line.',
  },
  {
    id: 'outsole',
    number: '04',
    name: 'Outsole',
    summary: 'Ground Map rubber',
    copy: 'Natural rubber moulded in zones rather than one flat sheet, with the pattern set from wear data. Grip where it matters, foam everywhere else.',
  },
]

export const BRAND_PILLARS = [
  {
    title: 'One pair, one day',
    copy: 'We design for the whole day rather than one activity in it. If a shoe only works for an hour, it is the wrong shoe.',
  },
  {
    title: 'Engineering you can wear anywhere',
    copy: 'Every performance decision has to survive a second test: does it still look like something you would choose?',
  },
  {
    title: 'Fewer, better, longer',
    copy: 'Seven models. No seasonal churn. Materials chosen to last past the point where most trainers are thrown away.',
  },
]

export const SUGGESTED_SEARCHES = ['AURA ONE', 'Running', 'Bone', 'Under $180', 'Travel', 'New in']

export const SHIPPING_INFO = [
  {
    title: 'Standard',
    detail: '3–5 business days. Complimentary on orders over $150, otherwise $8.',
  },
  { title: 'Express', detail: '1–2 business days, $18. Order before 2pm for same-day dispatch.' },
  { title: 'International', detail: '5–9 business days to 34 countries. Duties calculated at checkout.' },
]

export const RETURNS_INFO = [
  {
    title: '30-day wear test',
    detail: 'Wear them outside. If they are not right, send them back within 30 days for a full refund.',
  },
  { title: 'Free return shipping', detail: 'A prepaid label is included in every box.' },
  { title: 'Exchanges', detail: 'Swap size or colourway once, free, within 60 days.' },
]

export const FOOTER_COLUMNS = [
  {
    heading: 'Shop',
    links: [
      { label: 'All footwear', to: '/shop' },
      { label: 'New arrivals', to: '/shop?sort=newest' },
      { label: 'Running', to: '/shop?category=running' },
      { label: 'Lifestyle', to: '/shop?category=lifestyle' },
      { label: 'Travel', to: '/shop?category=travel' },
    ],
  },
  {
    heading: 'Collections',
    links: [
      { label: 'AURA ONE', to: '/product/aura-one' },
      { label: 'AURA RUN', to: '/product/aura-run' },
      { label: 'AURA FORM', to: '/product/aura-form' },
      { label: 'AURA SHIFT', to: '/product/aura-shift' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Technology', to: '/about#technology' },
      { label: 'About AURA', to: '/about' },
      { label: 'Materials', to: '/about#materials' },
      { label: 'Wishlist', to: '/wishlist' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Shipping', to: '/about#shipping' },
      { label: 'Returns', to: '/about#returns' },
      { label: 'Size guide', to: '#size-guide' },
      { label: 'Contact', to: '/about#contact' },
    ],
  },
]

export const SOCIAL_LINKS = [
  { label: 'Instagram', href: '#' },
  { label: 'YouTube', href: '#' },
  { label: 'Strava', href: '#' },
  { label: 'Journal', href: '#' },
]

export const LEGAL_LINKS = [
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Accessibility', href: '#' },
  { label: 'Cookies', href: '#' },
]
