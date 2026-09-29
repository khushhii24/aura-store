import form1 from '@/assets/products/form-1.webp'
import form2 from '@/assets/products/form-2.webp'
import form3 from '@/assets/products/form-3.webp'
import form4 from '@/assets/products/form-4.webp'
import glide from '@/assets/products/glide.webp'
import low1 from '@/assets/products/low-1.webp'
import low2 from '@/assets/products/low-2.webp'
import low3 from '@/assets/products/low-3.webp'
import low4 from '@/assets/products/low-4.webp'
import one1 from '@/assets/products/one-1.webp'
import one2 from '@/assets/products/one-2.webp'
import one3 from '@/assets/products/one-3.webp'
import one4 from '@/assets/products/one-4.webp'
import run from '@/assets/products/run.webp'
import step from '@/assets/products/step.webp'

/**
 * Product imagery: seven photographs and eight generated renders.
 *
 * The photographs are from Unsplash, bundled locally. Alt text is not
 * reliable for spotting branding — one image labelled "a pair of white
 * shoes" is a pair of Air Force 1s, and one labelled "nike" is not a Nike at
 * all — so every one was inspected at full resolution with the tonal range
 * lifted, which is the step that catches a white-on-white mark.
 *
 * FORM and LOW are rendered, not photographed. Both of their photographs
 * carried a competitor's trademark: adidas three-stripes stitched across
 * FORM's lateral side, the Puma cat and wordmark on LOW. Replacements were
 * searched for and none was clean, so rather than cut two more models their
 * imagery is generated from the same parametric geometry that drives the 3D
 * viewer, by `render.html`. That has a side effect worth noting: generation
 * is free, so those two carry four angles each where most photographed
 * models manage one.
 *
 * AURA ONE gets four angles from a single shoot, which is why it carries the
 * flagship treatment.
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
  'aura-form': [
    img(form1, 'Three-quarter', 'Generated render of AURA FORM in Chalk, three-quarter view'),
    img(form2, 'Profile', 'Generated render of AURA FORM in Chalk, lateral profile'),
    img(form3, 'Heel', 'Generated render of AURA FORM in Chalk, from behind the heel'),
    img(form4, 'Top', 'Generated render of AURA FORM in Chalk, from above the throat'),
  ],
  'aura-glide': [img(glide, 'Pair', 'A pair of AURA GLIDE in Bone, on a studio plinth')],
  'aura-low': [
    img(low1, 'Three-quarter', 'Generated render of AURA LOW in Bone with a gum outsole, three-quarter view'),
    img(low2, 'Profile', 'Generated render of AURA LOW in Bone with a gum outsole, lateral profile'),
    img(low3, 'Heel', 'Generated render of AURA LOW in Bone, from behind the heel'),
    img(low4, 'Top', 'Generated render of AURA LOW in Bone, from above the throat'),
  ],
  'aura-step': [img(step, 'Pair', 'A pair of AURA STEP in Moss, knit slip-on')],
}

export const imagesFor = (slug: string): ProductImage[] => PRODUCT_IMAGES[slug] ?? []
