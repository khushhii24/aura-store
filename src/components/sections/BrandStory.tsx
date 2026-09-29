import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { BRAND_PILLARS } from '@/data/content'
import { products } from '@/data/products'
import { Reveal } from '@/components/primitives/Reveal'
import { Eyebrow } from '@/components/primitives/Bits'
import { ShoeVisual } from '@/components/visuals/ShoeVisual'

/**
 * Two products at scale, one offset against the other.
 *
 * This started as three tiles across the column. At 1440 that made each one
 * about 230px wide — thumbnails, not a composition — and left a dead band
 * underneath. Two is fewer products and a much better picture.
 */
const COMPOSITION = [
  {
    slug: 'aura-form',
    view: 'hero',
    tone: 'stone',
    aspect: 'aspect-[4/5]',
    offset: '',
    /* The shoe is a 2.3:1 shape in a 0.8:1 plate, so it is scaled up and
       cropped by the frame rather than floating in the middle of it. */
    scale: 'scale-[1.32]',
  },
  {
    slug: 'aura-shift',
    view: 'top',
    tone: 'dark',
    aspect: 'aspect-[3/4]',
    offset: 'sm:mt-16',
    scale: 'scale-[1.2]',
  },
] as const

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
                const product = products.find((p) => p.slug === cell.slug)
                if (!product) return null
                return (
                  <Reveal key={cell.slug} delay={i * 0.08} className={cn(cell.offset)}>
                    <figure>
                      <div
                        className={cn(
                          'relative overflow-hidden',
                          cell.aspect,
                          cell.tone === 'dark'
                            ? 'image-bed-deep grain grain-dark'
                            : 'image-bed grain',
                        )}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ShoeVisual
                            parts={product.colorways[0].parts}
                            shape={product.shape}
                            view={cell.view}
                            className={cell.scale}
                            label={null}
                          />
                        </div>
                      </div>
                      <figcaption className="t-label mt-3 text-[color:var(--color-muted)]">
                        AURA {product.name}
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
