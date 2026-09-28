import { Link } from 'react-router-dom'
import { getProduct } from '@/data/products'
import { Reveal } from '@/components/primitives/Reveal'
import { ShoeVisual } from '@/components/visuals/ShoeVisual'

/**
 * The closing statement: one line of display type, one button, and the
 * product cropped off the bottom of the page.
 *
 * An earlier version floated the shoe behind the type. With a charcoal
 * colourway that made ink-on-ink — the headline was unreadable. Type and
 * product now occupy their own bands and the section crops the product
 * instead of stacking it.
 */
export function FinalCTA() {
  const product = getProduct('aura-one')
  if (!product) return null
  const colorway = product.colorways[1] ?? product.colorways[0]

  return (
    <section
      className="image-bed grain relative overflow-hidden"
      aria-labelledby="final-cta-heading"
    >
      <div className="container-aura relative z-10 pt-20 pb-6 text-center md:pt-28 md:pb-10">
        <Reveal>
          <h2 id="final-cta-heading" className="t-h1 mx-auto max-w-[14ch]">
            Find your everyday movement.
          </h2>
          <p className="t-lede mx-auto mt-6 max-w-md">
            Eight models, one platform underneath. Start with the one people keep coming back to.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link to="/shop" className="btn btn-solid btn-lg">
              Shop AURA
            </Link>
            <Link to={`/product/${product.slug}`} className="btn btn-outline btn-lg">
              Start with the ONE
            </Link>
          </div>
        </Reveal>
      </div>

      <div
        aria-hidden="true"
        className="relative mx-auto -mb-[14%] w-[158%] max-w-none -translate-x-[18%] md:-mb-[11%] md:w-[112%] md:-translate-x-[6%] lg:w-[88%] lg:translate-x-[6%]"
      >
        <ShoeVisual parts={colorway.parts} shape={product.shape} label={null} />
      </div>
    </section>
  )
}
