import form from '@/assets/products/form.webp'
import glide from '@/assets/products/glide.webp'
import low from '@/assets/products/low.webp'
import one1 from '@/assets/products/one-1.webp'
import one2 from '@/assets/products/one-2.webp'
import one3 from '@/assets/products/one-3.webp'
import one4 from '@/assets/products/one-4.webp'
import run from '@/assets/products/run.webp'
import shift from '@/assets/products/shift.webp'
import step from '@/assets/products/step.webp'

/**
 * Product photography.
 *
 * Ten photographs from Unsplash, bundled locally. Every one was checked by
 * eye for a third-party logo before it went in — the stock alt text is not
 * reliable for this. Two strong candidates were cut late for exactly that
 * reason: one had "Saint Laurent Paris" printed on the tongue, another had a
 * monogram across the heel counter.
 *
 * AURA ONE gets four angles from a single shoot, which is why it carries the
 * flagship treatment. The rest have one shot each, and that is the honest
 * limit of what free licensed unbranded footwear photography supports.
 */

export interface ProductImage {
  src: string
  alt: string
  width: number
  height: number
  /** Shown under the gallery and read out on the thumbnail. */
  label: string
}

const img = (src: string, label: string, alt: string): ProductImage => ({
  src,
  alt,
  label,
  width: 1400,
  height: 1400,
})

export const PRODUCT_IMAGES: Record<string, ProductImage[]> = {
  'aura-one': [
    img(one1, 'Three-quarter', 'AURA ONE in Sand, three-quarter view on a studio table'),
    img(one2, 'Pair', 'A pair of AURA ONE in Sand, laces undone'),
    img(one3, 'Profile', 'AURA ONE in Sand, lateral profile'),
    img(one4, 'Detail', 'Close detail of the AURA ONE midsole and upper'),
  ],
  'aura-run': [img(run, 'Three-quarter', 'AURA RUN in Slate, engineered mesh upper')],
  'aura-form': [img(form, 'Profile', 'AURA FORM in Chalk, lit against a pale studio wall')],
  'aura-shift': [img(shift, 'Pair', 'A pair of AURA SHIFT in Charcoal')],
  'aura-glide': [img(glide, 'Pair', 'A pair of AURA GLIDE in Bone, on a studio plinth')],
  'aura-low': [img(low, 'Top', 'AURA LOW in Chalk, shot from above on black')],
  'aura-step': [img(step, 'Pair', 'A pair of AURA STEP in Moss, knit slip-on')],
}

export const imagesFor = (slug: string): ProductImage[] => PRODUCT_IMAGES[slug] ?? []
