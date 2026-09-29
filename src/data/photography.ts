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
 * Real photographs carry the materials and the atmosphere. The products
 * themselves stay drawn, for a reason worth stating plainly: every
 * commercially licensed studio sneaker photograph available is an
 * identifiable Nike, Adidas or Vans, and putting one of those under
 * "AURA ONE — $180" would present another company's product as this
 * brand's. Textures and street scenes carry no such claim.
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

  motionFigures: scene(motionFigures, 'Commuters crossing a street, caught mid-stride', 'dark'),
  streetLegs: scene(streetLegs, 'Long shadows across a sunlit pavement', 'dark'),
  streetWalk: scene(streetWalk, 'A figure walking away along a waterfront', 'light'),
} as const

export type PhotoKey = keyof typeof PHOTOS
