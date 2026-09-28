import { useState } from 'react'
import { Link } from 'react-router-dom'
import { price } from '@/lib/format'
import { flagship } from '@/data/products'
import { Reveal } from '@/components/primitives/Reveal'
import { Eyebrow, RatingLine, Swatch } from '@/components/primitives/Bits'
import { ShoeVisual } from '@/components/visuals/ShoeVisual'

/**
 * The flagship, laid out as an editorial spread rather than a product card.
 *
 * This is where the drawn-product decision pays off: the swatches below
 * repaint the shoe on the left in real time, which a photographed catalogue
 * cannot do without loading five more images.
 */
export function FeaturedProduct() {
  const [index, setIndex] = useState(0)
  const colorway = flagship.colorways[index]

  return (
    <section className="section-y" aria-labelledby="featured-heading">
      <div className="container-aura">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* ------------------------------------------------------ visual */}
          <Reveal className="lg:col-span-7" y={32}>
            <div className="image-bed grain relative aspect-[5/4] overflow-hidden md:aspect-[16/11]">
              <div className="absolute inset-0 flex items-center justify-center">
                <ShoeVisual
                  parts={colorway.parts}
                  shape={flagship.shape}
                  label={`AURA ${flagship.name} in ${colorway.name}`}
                />
              </div>

              <p className="t-label absolute top-5 left-5 text-[color:var(--color-on-bed)]">
                Figure 01
              </p>
              <p className="t-label absolute right-5 bottom-5 text-[color:var(--color-on-bed)]">
                {colorway.name}
              </p>
            </div>
          </Reveal>

          {/* ------------------------------------------------------- copy */}
          <div className="lg:col-span-5 lg:pl-6">
            <Reveal>
              <Eyebrow>The flagship</Eyebrow>

              <h2 id="featured-heading" className="t-h1 mt-6">
                <span className="t-wordmark block text-[0.26em] tracking-[0.34em] text-[color:var(--color-muted)]">
                  Aura
                </span>
                {flagship.name}
              </h2>

              <p className="t-lede mt-5 max-w-prose">{flagship.shortDescription}</p>

              <dl className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <div>
                  <dt className="t-label text-[color:var(--color-muted)]">Price</dt>
                  <dd className="t-price mt-2 text-lg">{price(flagship.price)}</dd>
                </div>
                <div>
                  <dt className="t-label text-[color:var(--color-muted)]">Colour</dt>
                  <dd className="t-price mt-2 text-lg">{colorway.name}</dd>
                </div>
              </dl>

              <div className="mt-7">
                <p className="t-label text-[color:var(--color-muted)]">
                  {flagship.colorways.length} colourways
                </p>
                <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Colourway">
                  {flagship.colorways.map((c, i) => (
                    <button
                      key={c.id}
                      type="button"
                      role="radio"
                      aria-checked={i === index}
                      aria-label={c.name}
                      onClick={() => setIndex(i)}
                      className="flex h-11 w-11 items-center justify-center"
                    >
                      <Swatch colors={c.swatch} selected={i === index} size={26} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-5">
                <Link to={`/product/${flagship.slug}`} className="btn btn-solid btn-lg">
                  Shop AURA {flagship.name}
                </Link>
                <RatingLine value={flagship.rating} count={flagship.reviewCount} />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
