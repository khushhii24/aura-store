import type { Category, ColorFamily, Product } from './types'

/**
 * Filter + sort definitions and the pure functions that apply them.
 *
 * The filtering logic lives here rather than in the component so the shop
 * page stays a view: it holds the state, this file decides what the state
 * means.
 */

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'running', label: 'Running' },
  { value: 'training', label: 'Training' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'travel', label: 'Travel' },
]

/** Trimmed to the families the catalogue actually carries — an empty
 *  filter option is a dead end. */
export const COLOR_FAMILIES: { value: ColorFamily; label: string; swatch: string }[] = [
  { value: 'bone', label: 'Bone', swatch: '#ece7dd' },
  { value: 'chalk', label: 'Chalk', swatch: '#f2f0ec' },
  { value: 'sand', label: 'Sand', swatch: '#d7c7ae' },
  { value: 'moss', label: 'Moss', swatch: '#4c5347' },
  { value: 'slate', label: 'Slate', swatch: '#6e7478' },
]

export const PRICE_BANDS = [
  { value: 'under-160', label: 'Under $160', min: 0, max: 159.99 },
  { value: '160-190', label: '$160 – $190', min: 160, max: 190 },
  { value: '190-220', label: '$190 – $220', min: 190.01, max: 220 },
  { value: 'over-220', label: '$220 +', min: 220.01, max: Infinity },
] as const

export type PriceBand = (typeof PRICE_BANDS)[number]['value']

export const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
] as const

export type SortValue = (typeof SORTS)[number]['value']

export interface FilterState {
  categories: Category[]
  sizes: number[]
  colors: ColorFamily[]
  prices: PriceBand[]
}

export const emptyFilters: FilterState = { categories: [], sizes: [], colors: [], prices: [] }

export const countActiveFilters = (f: FilterState) =>
  f.categories.length + f.sizes.length + f.colors.length + f.prices.length

const inBand = (price: number, band: PriceBand) => {
  const def = PRICE_BANDS.find((b) => b.value === band)
  return def ? price >= def.min && price <= def.max : true
}

/** A size counts as available only if the model makes it and it is in stock. */
export const hasSize = (product: Product, size: number) =>
  product.sizes.includes(size) && !product.soldOutSizes.includes(size)

export function applyFilters(list: Product[], filters: FilterState) {
  return list.filter((product) => {
    if (filters.categories.length && !filters.categories.includes(product.category)) return false

    if (filters.sizes.length && !filters.sizes.some((size) => hasSize(product, size))) return false

    if (
      filters.colors.length &&
      !product.colorways.some((c) => filters.colors.includes(c.family))
    ) {
      return false
    }

    if (filters.prices.length && !filters.prices.some((band) => inBand(product.price, band))) {
      return false
    }

    return true
  })
}

export function applySort(list: Product[], sort: SortValue) {
  const sorted = [...list]
  switch (sort) {
    case 'newest':
      return sorted.sort((a, b) => Date.parse(b.released) - Date.parse(a.released))
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'featured':
    default:
      // Featured order = the order the brand leads with, then the rest.
      return sorted.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
  }
}

/** US -> UK / EU / CM. The numbers the size guide modal renders. */
export const SIZE_CONVERSIONS = [
  { us: 6, uk: 5.5, eu: 38.5, cm: 24 },
  { us: 6.5, uk: 6, eu: 39, cm: 24.5 },
  { us: 7, uk: 6, eu: 40, cm: 25 },
  { us: 7.5, uk: 6.5, eu: 40.5, cm: 25.5 },
  { us: 8, uk: 7, eu: 41, cm: 26 },
  { us: 8.5, uk: 7.5, eu: 42, cm: 26.5 },
  { us: 9, uk: 8, eu: 42.5, cm: 27 },
  { us: 9.5, uk: 8.5, eu: 43, cm: 27.5 },
  { us: 10, uk: 9, eu: 44, cm: 28 },
  { us: 10.5, uk: 9.5, eu: 44.5, cm: 28.5 },
  { us: 11, uk: 10, eu: 45, cm: 29 },
  { us: 11.5, uk: 10.5, eu: 45.5, cm: 29.5 },
  { us: 12, uk: 11, eu: 46, cm: 30 },
  { us: 12.5, uk: 11.5, eu: 47, cm: 30.5 },
  { us: 13, uk: 12, eu: 47.5, cm: 31 },
]

/**
 * Search across the fields a shopper would actually type: the model name,
 * what it is for, the colourway and the category. Scored so an exact model
 * name always outranks a colour that happens to match.
 */
export function searchProducts(query: string, list: Product[]) {
  const q = query.trim().toLowerCase()
  if (q.length === 0) return []

  const scored = list.map((product) => {
    const name = `aura ${product.name}`.toLowerCase()
    let score = 0

    if (name === q) score += 100
    if (name.startsWith(q) || product.name.toLowerCase().startsWith(q)) score += 60
    if (name.includes(q)) score += 30
    if (product.tagline.toLowerCase().includes(q)) score += 18
    if (product.category.includes(q)) score += 16
    if (product.shortDescription.toLowerCase().includes(q)) score += 8
    if (product.colorways.some((c) => c.name.toLowerCase().includes(q))) score += 14
    if (product.colorways.some((c) => c.family.includes(q))) score += 12
    if (product.audience.some((a) => a.includes(q))) score += 10
    if (q.startsWith('$') && String(product.price).startsWith(q.slice(1))) score += 20
    if (/^under\s*\$?(\d+)/.test(q)) {
      const cap = Number(/^under\s*\$?(\d+)/.exec(q)![1])
      if (product.price < cap) score += 22
    }
    if (q === 'new' && product.badge === 'new') score += 40

    return { product, score }
  })

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.product)
}
