/**
 * Mock data contracts.
 *
 * Everything the storefront renders is typed here. Nothing in this folder
 * imports from `components/` — the UI depends on the data, never the reverse,
 * so swapping these arrays for a real commerce API is a one-file change.
 */

/** The parts the parametric shoe illustration paints. */
export interface ShoeParts {
  upper: string
  upperShade: string
  overlay: string
  collar: string
  laces: string
  eyelet: string
  midsole: string
  midsoleShade: string
  outsole: string
  accent: string
}

export interface Colorway {
  id: string
  /** Display name, e.g. "Bone / Volt". */
  name: string
  /** Filterable colour family. */
  family: ColorFamily
  /** The two dots shown in a swatch. */
  swatch: [string, string]
  parts: ShoeParts
  /** A handful of colourways are sold out to make the UI honest. */
  soldOut?: boolean
}

export type ColorFamily =
  | 'bone'
  | 'black'
  | 'charcoal'
  | 'sand'
  | 'slate'
  | 'moss'
  | 'clay'
  | 'chalk'

export type Category = 'running' | 'training' | 'lifestyle' | 'travel'
export type Audience = 'men' | 'women'

/**
 * Drives the illustration.
 *
 * These are the design of the shoe, not decoration on top of it. Sole
 * architecture, toe shape and outsole construction change the silhouette, so
 * a court shoe and a max-stack road runner do not share an outline.
 */
export interface ShoeShape {
  /** Multiplies the sole architecture's own thickness profile. */
  stack: number
  /** Collar height offset in SVG units; positive sits higher on the ankle. */
  collar: number
  /** Sole architecture. Carries thickness, toe spring and how far it flares. */
  soleStyle: 'wedge' | 'rocker' | 'cupsole' | 'slab' | 'lugged'
  /** Toe profile. */
  toe: 'round' | 'tapered' | 'blunt'
  /** Outsole construction: rubber pods, full coverage, a gum wrap, or lugs. */
  outsole: 'pods' | 'full' | 'gum' | 'lugs'
  overlay: 'arc' | 'flash' | 'none'
  /** A wrapped toe bumper. Trail models only. */
  mudguard?: boolean
  lacing: 'laced' | 'slip'
  /** Selects the surface texture. Eight models should not all feel identical. */
  material: 'knit' | 'mesh' | 'leather' | 'canvas' | 'ripstop'
  perforated: boolean
  heelTab: boolean
}

export interface SpecRow {
  label: string
  value: string
}

export interface Product {
  id: string
  slug: string
  /** "ONE" — the wordmark always prefixes it in the UI. */
  name: string
  /** One line under the name in the grid. */
  tagline: string
  category: Category
  audience: Audience[]
  price: number
  /** Set only on the one product with a markdown. */
  compareAt?: number
  /** ISO date, drives the "Newest" sort. */
  released: string
  badge?: 'new' | 'bestseller' | 'last-pairs'
  featured?: boolean
  shortDescription: string
  description: string
  /** Editorial paragraph used on the product page. */
  story: string
  colorways: Colorway[]
  /** US sizes this model is made in. */
  sizes: number[]
  /** US sizes currently out of stock. */
  soldOutSizes: number[]
  rating: number
  reviewCount: number
  specs: SpecRow[]
  materials: string[]
  technology: { name: string; detail: string }[]
  shape: ShoeShape
}

export interface Review {
  id: string
  productSlug: string
  author: string
  location: string
  rating: number
  date: string
  title: string
  body: string
  verified: boolean
  /** How the reviewer says it fits — feeds the fit summary. */
  fit: 'small' | 'true' | 'large'
}

export interface PressMention {
  publication: string
  quote: string
  issue: string
}
