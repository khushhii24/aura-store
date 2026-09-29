import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { BRAND_PILLARS } from '@/data/content'
import { products } from '@/data/products'
import { Reveal } from '@/components/primitives/Reveal'
import { Eyebrow } from '@/components/primitives/Bits'
import { Photo } from '@/components/visuals/Photo'
import { PHOTOS } from '@/data/photography'

/**
 * Two products at scale, one offset against the other.
 *
 * This started as three tiles across the column. At 1440 that made each one
 * about 230px wide — thumbnails, not a composition — and left a dead band
 * underneath. Two is fewer products and a much better picture.
 */
/**
 * The product beside the thing it is for.
 *
 * Two plates: one drawn product, one photograph of people actually moving.
 * The section headline is "Built for the way life actually moves" — showing
 * two more product shots next to that line says nothing.
 */
const COMPOSITION = [
  {
    kind: 'product' as const,
    slug: 'aura-form',
    view: 'hero' as const,
    tone: 'stone' as const,
    aspect: 'aspect-[4/5]',
    offset: '',
    scale: 'scale-[1.32]',
    caption: 'AURA FORM',
  },
  {
    kind: 'photo' as const,
    aspect: 'aspect-[3/4]',
    offset: 'sm:mt-16',
    caption: 'Weekday, 08:12',
  },
]

export function BrandStory() {
  return (
    <section className="section-y bg-[color:var(--color-stone)]" aria-labelledby="brand-heading">
      <div className="container-aura">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <Eyebrow>Why AURA</Eyebrow>
            <h2 id="brand-heading" className="t-h1 mt-6">
              Built for the way life actually moves.
            </h2>
            <div className="mt-7 max-w-prose space-y-5">
              <p className="t-body">
                AURA started from a complaint. Performance footwear had become very good at one
                thing and openly bad at everything around it — brilliant for the hour you train,
                conspicuous for the fourteen you do not.
              </p>
              <p className="t-body">
                So we designed the other fourteen hours first. The midsole came from running. The
                proportions came from a pair of leather shoes. Nothing on the outside tells you how
                much engineering is underneath, which is the point: you should not have to dress
                around your shoes.
              </p>
            </div>

            <Link to="/about" className="btn btn-outline btn-lg mt-9">
              Read the full story
            </Link>
          </Reveal>

          <div className="lg:col-span-7">
            {/* Side by side on a phone would be two 167px plates. Stack them. */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-6">
              {COMPOSITION.map((cell, i) => {
                if (cell.kind === 'photo') {
                  return (
                    <Reveal key="photo" delay={i * 0.08} className={cn(cell.offset)}>
                      <figure>
                        <Photo
                          photo={PHOTOS.motionFigures}
                          className={cn('overflow-hidden', cell.aspect)}
                        />
                        <figcaption className="t-label mt-3 text-[color:var(--color-muted)]">
                          {cell.caption}
                        </figcaption>
                      </figure>
                    </Reveal>
                  )
                }

                const product = products.find((p) => p.slug === cell.slug)
                if (!product) return null
                return (
                  <Reveal key={cell.slug} delay={i * 0.08} className={cn(cell.offset)}>
                    <figure>
                      <div className={cn('relative overflow-hidden', cell.aspect)}>
                        {product.images[0] && (
                          <Photo photo={product.images[0]} className="absolute inset-0" />
                        )}
                      </div>
                      <figcaption className="t-label mt-3 text-[color:var(--color-muted)]">
                        {cell.caption}
                      </figcaption>
                    </figure>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </div>

        <Reveal className="mt-16 lg:mt-24">
          <dl className="grid gap-8 border-t border-[color:var(--color-line-strong)] pt-10 md:grid-cols-3 md:gap-12">
            {BRAND_PILLARS.map((pillar, i) => (
              <div key={pillar.title}>
                <dt className="flex items-baseline gap-4">
                  <span className="t-label tabular text-[color:var(--color-muted)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="t-h3">{pillar.title}</span>
                </dt>
                <dd className="t-body mt-4 max-w-prose md:pl-9">{pillar.copy}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
