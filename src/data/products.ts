import {
  BONE_CLAY,
  BONE_VOLT,
  CHALK_SILVER,
  MOSS_BONE,
  SAND_CLAY,
  SLATE_ASH,
} from './colorways'
import { imagesFor } from './productImages'
import type { Product } from './types'

/** The size run AURA makes. US sizing; the guide converts. */
export const SIZE_RUN = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13]

export const products: Product[] = [
  {
    id: 'p-one',
    slug: 'aura-one',
    name: 'ONE',
    tagline: 'Everyday performance trainer',
    category: 'training',
    audience: ['men', 'women'],
    price: 180,
    released: '2025-03-04',
    badge: 'bestseller',
    featured: true,
    shortDescription:
      'A lightweight everyday trainer engineered for movement from morning to night.',
    description:
      'ONE is the shoe the rest of the range is measured against. A leather and nubuck upper sits on a nitrogen-infused foam midsole tuned for the kind of distance nobody counts — the walk to the station, the standing meeting, the eleven-thousand steps you did not plan on. Light enough to train in, quiet enough to wear with anything.',
    story:
      'We built ONE after tracking how people actually move through a day. Not a workout and then the rest of it — a continuous, uneven, unplanned amount of walking, standing and occasional running for a train. So we stopped designing for one activity. The stack is high enough to absorb pavement for hours and low enough to feel the ground underneath you.',
    images: imagesFor('aura-one'),
    colorways: [SAND_CLAY],
    sizes: SIZE_RUN,
    soldOutSizes: [6, 12.5],
    rating: 4.8,
    reviewCount: 412,
    specs: [
      { label: 'Weight', value: '238 g / 8.4 oz (US 9)' },
      { label: 'Stack height', value: '32 mm heel / 24 mm forefoot' },
      { label: 'Drop', value: '8 mm' },
      { label: 'Fit', value: 'True to size, standard width' },
    ],
    materials: [
      'Full-grain leather and nubuck upper',
      'Nitrogen-infused EVA midsole',
      'Natural rubber outsole, 30% reclaimed content',
      'Moulded footbed with a bio-oil blend',
    ],
    technology: [
      {
        name: 'AURAFOAM',
        detail: 'Nitrogen-infused midsole foam that returns energy without feeling springy.',
      },
      {
        name: 'Three-panel upper',
        detail: 'Nubuck where the shoe has to hold its shape, softer leather where the foot moves.',
      },
      {
        name: 'Ground Map outsole',
        detail: 'Rubber placed only where wear data said it was needed. Less weight, same grip.',
      },
    ],
    shape: { stack: 1, collar: 0, soleStyle: 'wedge', toe: 'round', outsole: 'pods', overlay: 'arc', lacing: 'laced', material: 'leather', perforated: false, heelTab: true },
  },

  {
    id: 'p-run',
    slug: 'aura-run',
    name: 'RUN',
    tagline: 'Lightweight running shoe',
    category: 'running',
    audience: ['men', 'women'],
    price: 195,
    released: '2025-08-19',
    badge: 'new',
    featured: true,
    shortDescription: 'A fast, low-mass daily trainer for road miles that add up.',
    description:
      'RUN strips ONE back to what a road runner needs. The same nitrogen foam, re-tuned firmer and set on a rocker geometry that keeps you rolling forward through the back half of a long run. The upper is a monofilament mesh you can see daylight through.',
    story:
      'The brief was a single number: under 220 grams, with a midsole that still feels alive at kilometre eighteen. Getting there meant deleting things — a heel counter became a thermoplastic strip, the tongue became part of the upper, the outsole became four rubber pads instead of a sheet.',
    images: imagesFor('aura-run'),
    colorways: [SLATE_ASH],
    sizes: SIZE_RUN,
    soldOutSizes: [6, 6.5, 13],
    rating: 4.7,
    reviewCount: 268,
    specs: [
      { label: 'Weight', value: '212 g / 7.5 oz (US 9)' },
      { label: 'Stack height', value: '36 mm heel / 28 mm forefoot' },
      { label: 'Drop', value: '8 mm' },
      { label: 'Fit', value: 'True to size, performance width' },
    ],
    materials: [
      'Monofilament engineered mesh upper',
      'Nitrogen-infused EVA midsole, firm tune',
      'Four-zone rubber outsole',
      'Non-slip performance laces',
    ],
    technology: [
      {
        name: 'AURAFOAM Fast',
        detail: 'A firmer tune of the same foam — more return, less compression over distance.',
      },
      {
        name: 'Roll geometry',
        detail: 'A 6-degree forefoot rocker that carries momentum when your form gets tired.',
      },
      {
        name: 'Monofil mesh',
        detail: 'An upper you can see through, so heat leaves as fast as it arrives.',
      },
    ],
    shape: { stack: 1.04, collar: 6, soleStyle: 'rocker', toe: 'tapered', outsole: 'pods', overlay: 'flash', lacing: 'laced', material: 'mesh', perforated: true, heelTab: false },
  },

  {
    id: 'p-form',
    slug: 'aura-form',
    name: 'FORM',
    tagline: 'Minimal lifestyle sneaker',
    category: 'lifestyle',
    audience: ['men', 'women'],
    price: 165,
    released: '2025-05-22',
    featured: true,
    shortDescription: 'The quietest shoe we make. Performance construction, no performance styling.',
    description:
      'FORM takes the ONE platform and removes every visual cue that says athletic. A smooth full-grain leather upper, a sole unit pared back to a clean line, and no logo anywhere you can see it from across a room. It still has the foam.',
    story:
      'A lot of people told us they wanted the comfort of a trainer and none of the look. FORM is the answer: the same midsole, hidden inside a shoe you can wear to dinner. Nothing on the outside says which shoe it is.',
    images: imagesFor('aura-form'),
    colorways: [CHALK_SILVER],
    sizes: SIZE_RUN,
    soldOutSizes: [11.5],
    rating: 4.6,
    reviewCount: 193,
    specs: [
      { label: 'Weight', value: '284 g / 10.0 oz (US 9)' },
      { label: 'Stack height', value: '28 mm heel / 22 mm forefoot' },
      { label: 'Drop', value: '6 mm' },
      { label: 'Fit', value: 'Runs slightly large — consider a half size down' },
    ],
    materials: [
      'Full-grain leather, vegetable-tanned in Portugal',
      'Nitrogen-infused EVA midsole',
      'Cupsole with a natural rubber wrap',
      'Recycled-textile lining',
    ],
    technology: [
      {
        name: 'Hidden AURAFOAM',
        detail: 'The same midsole as ONE, wrapped in leather so nothing announces itself.',
      },
      {
        name: 'Single-line last',
        detail: 'One unbroken line from heel to toe — the detail that makes it read as a shoe.',
      },
    ],
    shape: { stack: 0.92, collar: -4, soleStyle: 'cupsole', toe: 'round', outsole: 'gum', overlay: 'none', lacing: 'laced', material: 'leather', perforated: false, heelTab: false },
  },

  {
    id: 'p-glide',
    slug: 'aura-glide',
    name: 'GLIDE',
    tagline: 'Long-distance cushioned runner',
    category: 'running',
    audience: ['men', 'women'],
    price: 225,
    compareAt: 250,
    released: '2025-02-11',
    badge: 'last-pairs',
    shortDescription: 'Maximum stack, minimum noise. For the runs measured in hours.',
    description:
      'GLIDE is the most cushioned shoe AURA makes — a 40 mm heel of nitrogen foam over a carbon-infused plate that keeps the whole thing from feeling vague. It is not a race shoe. It is the shoe that gets you to the race.',
    story:
      'Big foam usually costs you feel. GLIDE keeps it by running a thin plate through the middle of the stack, so the shoe stays honest about where the ground is while still taking the sting out of it.',
    images: imagesFor('aura-glide'),
    colorways: [BONE_VOLT],
    sizes: SIZE_RUN,
    soldOutSizes: [6, 6.5, 7, 11.5, 12, 12.5, 13],
    rating: 4.9,
    reviewCount: 76,
    specs: [
      { label: 'Weight', value: '272 g / 9.6 oz (US 9)' },
      { label: 'Stack height', value: '40 mm heel / 34 mm forefoot' },
      { label: 'Drop', value: '6 mm' },
      { label: 'Fit', value: 'True to size, performance width' },
    ],
    materials: [
      'Engineered mesh upper with welded overlays',
      'Nitrogen-infused EVA, high-volume tune',
      'Carbon-infused stability plate',
      'Full-coverage rubber outsole',
    ],
    technology: [
      { name: 'High-volume AURAFOAM', detail: '40 mm of foam that still tells you where the ground is.' },
      { name: 'Guide plate', detail: 'A carbon-infused sheet that keeps a tall stack from wandering.' },
      { name: 'Heel cradle', detail: 'A moulded cup that locks the foot down at distance pace.' },
    ],
    shape: { stack: 1.18, collar: 8, soleStyle: 'rocker', toe: 'tapered', outsole: 'full', overlay: 'flash', lacing: 'laced', material: 'mesh', perforated: true, heelTab: true },
  },

  {
    id: 'p-low',
    slug: 'aura-low',
    name: 'LOW',
    tagline: 'Low-profile court sneaker',
    category: 'lifestyle',
    audience: ['men', 'women'],
    price: 150,
    released: '2025-04-15',
    shortDescription: 'A flat, clean court shape with a modern sole unit underneath.',
    description:
      'LOW borrows its proportions from a 1970s court shoe and nothing else. Underneath the leather is a compressed AURAFOAM wedge, so a silhouette that usually punishes you after two hours does not.',
    story:
      'The hardest part was resisting the urge to add. LOW has three panels, one line of stitching and a gum-toned outsole. Everything interesting about it is underneath.',
    images: imagesFor('aura-low'),
    colorways: [BONE_CLAY],
    sizes: SIZE_RUN,
    soldOutSizes: [6, 13],
    rating: 4.6,
    reviewCount: 231,
    specs: [
      { label: 'Weight', value: '292 g / 10.3 oz (US 9)' },
      { label: 'Stack height', value: '22 mm heel / 18 mm forefoot' },
      { label: 'Drop', value: '4 mm' },
      { label: 'Fit', value: 'Runs slightly large — consider a half size down' },
    ],
    materials: [
      'Smooth full-grain leather upper',
      'Compressed AURAFOAM wedge',
      'Vulcanised gum rubber outsole',
      'Recycled-textile lining',
    ],
    technology: [
      { name: 'Compressed wedge', detail: 'The foam, densified, so a flat shoe still has something in it.' },
      { name: 'Vulcanised bond', detail: 'Heat-bonded sole, not glued. It stays on.' },
      { name: 'Court last', detail: 'A narrow, flat last with an unbroken toe line.' },
    ],
    shape: { stack: 0.82, collar: -8, soleStyle: 'cupsole', toe: 'blunt', outsole: 'gum', overlay: 'none', lacing: 'laced', material: 'leather', perforated: false, heelTab: false },
  },

  {
    id: 'p-step',
    slug: 'aura-step',
    name: 'STEP',
    tagline: 'Slip-on knit travel shoe',
    category: 'travel',
    audience: ['men', 'women'],
    price: 140,
    released: '2025-07-08',
    shortDescription: 'No laces, no fuss. The shoe that lives in the front pocket of the bag.',
    description:
      'STEP is a one-piece knit with a structured collar that holds its shape when you push your foot in without your hands. The sole is a thinner AURAFOAM wedge tuned for standing, not striding.',
    story:
      'This started as a sample nobody asked for — ONE with the laces removed — and turned into the shoe most of the studio actually wears. Sometimes the edit is the product.',
    images: imagesFor('aura-step'),
    colorways: [MOSS_BONE],
    sizes: SIZE_RUN,
    soldOutSizes: [12.5, 13],
    rating: 4.4,
    reviewCount: 54,
    specs: [
      { label: 'Weight', value: '206 g / 7.3 oz (US 9)' },
      { label: 'Stack height', value: '26 mm heel / 21 mm forefoot' },
      { label: 'Drop', value: '5 mm' },
      { label: 'Fit', value: 'Snug — sized for a knit upper' },
    ],
    materials: [
      'Seamless circular-knit upper',
      'Thermoplastic collar frame',
      'AURAFOAM wedge, standing tune',
      'Reclaimed-rubber outsole pads',
    ],
    technology: [
      { name: 'Hold collar', detail: 'A thermoplastic frame that keeps the opening up while you step in.' },
      { name: 'Circular knit', detail: 'Knitted in one piece, so there is nothing to come apart.' },
      { name: 'Standing tune', detail: 'Softer under the heel, firmer under the arch. For queues.' },
    ],
    shape: { stack: 0.88, collar: 2, soleStyle: 'slab', toe: 'round', outsole: 'pods', overlay: 'none', lacing: 'slip', material: 'knit', perforated: true, heelTab: true },
  },
]

export const getProduct = (slug: string) => products.find((p) => p.slug === slug)

/** The four models on the home page, in the order the brand leads with. */
export const FEATURED_SLUGS = ['aura-one', 'aura-run', 'aura-form', 'aura-step']

export const featuredProducts = FEATURED_SLUGS.map(
  (slug) => products.find((p) => p.slug === slug)!,
)

export const flagship = products.find((p) => p.slug === 'aura-one')!
