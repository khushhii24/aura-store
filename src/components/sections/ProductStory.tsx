import { cn } from '@/lib/cn'
import { STORY_FEATURES } from '@/data/content'
import { getProduct } from '@/data/products'
import { Reveal } from '@/components/primitives/Reveal'
import { Eyebrow } from '@/components/primitives/Bits'
import { Photo } from '@/components/visuals/Photo'
import { PHOTOS, type PhotoKey } from '@/data/photography'

/**
 * Five things the shoe does, told as an editorial run rather than a spec
 * table. Each one gets a different crop of the same shoe, so the section
 * reads as a photo essay of one product instead of five stock icons.
 */
/**
 * Five crops of the same shoe, with one real photograph among them. The
 * material claim is the one that earns a photograph — you cannot draw the
 * way a knit actually looks up close.
 */
/**
 * Five images against five claims. Three material macros and two product
 * photographs — the material claims are the ones a photograph can actually
 * evidence.
 */
const CROPS: { photo: PhotoKey; product?: string; tone: 'stone' | 'dark' }[] = [
  { photo: 'grainBeige', tone: 'stone' },
  { photo: 'knitCharcoal', product: 'aura-run', tone: 'dark' },
  { photo: 'knitBone', tone: 'stone' },
  { photo: 'wovenCanvas', product: 'aura-low', tone: 'stone' },
  { photo: 'leatherBlack', tone: 'dark' },
]

export function ProductStory() {
  return (
    <section className="section-y" aria-labelledby="story-heading">
      <div className="container-aura">
        <Reveal>
          <div className="max-w-3xl">
            <Eyebrow>Engineering</Eyebrow>
            <h2 id="story-heading" className="t-h1 mt-6">
              Designed around movement.
            </h2>
            <p className="t-lede mt-6 max-w-prose">
              Five decisions separate a shoe you forget you are wearing from one you count the
              hours in. None of them are visible from across a room.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 space-y-20 lg:mt-24 lg:space-y-28">
          {STORY_FEATURES.map((feature, i) => {
            const crop = CROPS[i]
            const reversed = i % 2 === 1

            return (
              <Reveal key={feature.id} amount={0.2}>
                <article
                  className={cn(
                    'grid items-center gap-8 lg:grid-cols-12 lg:gap-14',
                    reversed && 'lg:[&>*:first-child]:order-2',
                  )}
                >
                  <div className={cn('lg:col-span-7', reversed && 'lg:col-start-6')}>
                    <div
                      className={cn(
                        'relative aspect-[4/3] overflow-hidden md:aspect-[16/10]',
                        crop.tone === 'dark' ? 'image-bed-deep grain grain-dark' : 'image-bed grain',
                      )}
                    >
                      {crop.product ? (
                        <Photo
                          photo={getProduct(crop.product)?.images[0] ?? PHOTOS[crop.photo]}
                          className="absolute inset-0"
                          alt=""
                        />
                      ) : (
                        <Photo photo={PHOTOS[crop.photo]} className="absolute inset-0" alt="" />
                      )}
                      <p
                        className={cn(
                          't-label absolute bottom-5 left-5',
                          crop.tone === 'dark'
                            ? 'text-[color:var(--color-on-dark-muted)]'
                            : 'text-[color:var(--color-on-bed)]',
                        )}
                      >
                        Fig. {feature.index}
                      </p>
                    </div>
                  </div>

                  <div className={cn('lg:col-span-5', reversed ? 'lg:col-start-1 lg:row-start-1' : '')}>
                    <p className="t-label text-[color:var(--color-muted)]">{feature.index}</p>
                    <h3 className="t-h2 mt-5 max-w-[16ch]">{feature.title}</h3>
                    <p className="t-body mt-5 max-w-prose">{feature.copy}</p>

                    <div className="mt-8 flex items-baseline gap-4 border-t border-[color:var(--color-line)] pt-5">
                      <span className="t-serif tabular text-4xl leading-none">
                        {feature.metric}
                      </span>
                      <span className="t-label text-[color:var(--color-muted)]">
                        {feature.metricLabel}
                      </span>
                    </div>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
