import { Link } from 'react-router-dom'
import { price } from '@/lib/format'
import { flagship } from '@/data/products'
import { Reveal } from '@/components/primitives/Reveal'
import { Eyebrow, RatingLine, Swatch } from '@/components/primitives/Bits'
import { Photo } from '@/components/visuals/Photo'

/**
 * The flagship, laid out as an editorial spread rather than a product card.
 *
 * This is where the drawn-product decision pays off: the swatches below
 * repaint the shoe on the left in real time, which a photographed catalogue
 * cannot do without loading five more images.
 */
export function FeaturedProduct() {
  const colorway = flagship.colorways[0]
  const hero = flagship.images[0]

  return (
    <section className="section-y" aria-labelledby="featured-heading">
      <div className="container-aura">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* ------------------------------------------------------ visual */}
          <Reveal className="lg:col-span-7" y={32}>
            <div className="relative aspect-[5/4] overflow-hidden md:aspect-[16/11]">
              {hero && <Photo photo={hero} className="absolute inset-0" />}
            </div>
            <p className="t-label mt-3 flex justify-between text-[color:var(--color-muted)]">
              <span>Figure 01</span>
              <span>{colorway.name}</span>
            </p>
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

              <div className="mt-7 flex items-center gap-3">
                <Swatch colors={colorway.swatch} size={22} />
                <p className="t-small text-[color:var(--color-muted)]">
                  Shown in {colorway.name}
                </p>
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
