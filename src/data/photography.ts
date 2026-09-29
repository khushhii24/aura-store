import constructionCushioning from '@/assets/construction/cushioning.webp'
import constructionMidsole from '@/assets/construction/midsole.webp'
import constructionOutsole from '@/assets/construction/outsole.webp'
import constructionUpper from '@/assets/construction/upper.webp'
import grainBeige from '@/assets/photography/grain-beige.webp'
import knitBone from '@/assets/photography/knit-bone.webp'
import knitCharcoal from '@/assets/photography/knit-charcoal.webp'
import knitSand from '@/assets/photography/knit-sand.webp'
import leatherBlack from '@/assets/photography/leather-black.webp'
import leatherTan from '@/assets/photography/leather-tan.webp'
import motionFigures from '@/assets/photography/motion-figures.webp'
import streetLegs from '@/assets/photography/street-legs.webp'
import streetWalk from '@/assets/photography/street-walk.webp'
import wovenCanvas from '@/assets/photography/woven-canvas.webp'

/**
 * Photography.
 *
 * Real photographs carry the materials, the atmosphere, the products and
 * the construction section. Sourcing them is the constraint the whole
 * catalogue is shaped around: most commercially licensed studio sneaker
 * photography is an identifiable Nike, Adidas or Vans, and putting one of
 * those under "AURA ONE — $180" would present another company's product as
 * this brand's.
 *
 * The construction crops are cut from the flagship's own shoot, except the
 * outsole. That one is a separate photograph, because the flagship's sole
 * carries a debossed maker's mark — tonal and illegible at gallery size,
 * but a crop of it is not gallery size.
 *
 * All images are from Unsplash under the Unsplash License (free for
 * commercial use, no attribution required). Sources are listed in
 * CREDITS.md and bundled locally rather than hot-linked, so the site has no
 * runtime dependency on anyone else's CDN.
 */

export interface Photo {
  src: string
  /** Empty string marks the image as decorative. */
  alt: string
  /** Intrinsic size, so the browser can reserve the space. */
  width: number
  height: number
  /** Whether dark or light text can sit on top of it. */
  tone: 'light' | 'dark'
}

const material = (src: string, alt: string, tone: Photo['tone']): Photo => ({
  src,
  alt,
  width: 1000,
  height: 750,
  tone,
})

/** Construction crops are all cut to 4:3 at the same width. */
const layer = (src: string, alt: string): Photo => ({
  src,
  alt,
  width: 1400,
  height: 1050,
  tone: 'light',
})

const scene = (src: string, alt: string, tone: Photo['tone']): Photo => ({
  src,
  alt,
  width: 1600,
  height: 1067,
  tone,
})

export const PHOTOS = {
  knitBone: material(knitBone, 'Close-up of an undyed engineered knit', 'light'),
  knitSand: material(knitSand, 'Close-up of a sand-coloured knit textile', 'light'),
  knitCharcoal: material(knitCharcoal, 'Close-up of a charcoal knit textile', 'dark'),
  wovenCanvas: material(wovenCanvas, 'Close-up of a woven canvas structure', 'light'),
  grainBeige: material(grainBeige, 'Close-up of a fine beige grain', 'light'),
  leatherTan: material(leatherTan, 'Close-up of vegetable-tanned leather', 'light'),
  leatherBlack: material(leatherBlack, 'Close-up of black leather folds', 'dark'),

  constructionUpper: layer(constructionUpper, 'The upper: pebbled leather and nubuck panels meeting at the lacing'),
  constructionCushioning: layer(constructionCushioning, 'The collar opening, showing the padded lining inside the shoe'),
  constructionMidsole: layer(constructionMidsole, 'The midsole, a smooth white band above the outsole edge'),
  constructionOutsole: layer(constructionOutsole, 'The outsole, moulded rubber tread'),

  motionFigures: scene(motionFigures, 'Commuters crossing a street, caught mid-stride', 'dark'),
  streetLegs: scene(streetLegs, 'Long shadows across a sunlit pavement', 'dark'),
  streetWalk: scene(streetWalk, 'A figure walking away along a waterfront', 'light'),
} as const

export type PhotoKey = keyof typeof PHOTOS
