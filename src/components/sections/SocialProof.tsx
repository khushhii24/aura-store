import { press, reviews } from '@/data/reviews'
import { Reveal } from '@/components/primitives/Reveal'
import { Eyebrow, Stars } from '@/components/primitives/Bits'
import { products } from '@/data/products'

const TOTAL_REVIEWS = products.reduce((n, p) => n + p.reviewCount, 0)

/** Weighted by each product's review count, so the headline number is honest. */
const AVERAGE =
  products.reduce((n, p) => n + p.rating * p.reviewCount, 0) / TOTAL_REVIEWS

/** A believable distribution rather than a wall of fives. */
const DISTRIBUTION = [
  { stars: 5, share: 0.74 },
  { stars: 4, share: 0.19 },
  { stars: 3, share: 0.05 },
  { stars: 2, share: 0.014 },
  { stars: 1, share: 0.006 },
]

export function SocialProof() {
  const featured = reviews.filter((r) => r.productSlug === 'aura-one').slice(0, 3)

  return (
    <section id="reviews" className="section-y" aria-labelledby="reviews-heading">
      <div className="container-aura">
        <Reveal>
          <Eyebrow>Owner reviews</Eyebrow>
          <h2 id="reviews-heading" className="t-h1 mt-6 max-w-[18ch]">
            What people say after a month.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ---------------------------------------------------- aggregate */}
          <Reveal className="lg:col-span-4">
            <div className="border-t border-[color:var(--color-ink)] pt-7">
              <p className="t-serif text-[clamp(3.5rem,8vw,5.5rem)] leading-none tabular">
                {AVERAGE.toFixed(1)}
              </p>
              <div className="mt-4 flex items-center gap-3">
                <Stars value={AVERAGE} size={15} />
                <span className="t-small text-[color:var(--color-muted)]">
                  {TOTAL_REVIEWS.toLocaleString('en-US')} reviews
                </span>
              </div>

              <dl className="mt-8 space-y-2.5">
                {DISTRIBUTION.map((row) => (
                  <div key={row.stars} className="flex items-center gap-3">
                    <dt className="t-small tabular w-4 text-[color:var(--color-muted)]">
                      {row.stars}
                      <span className="sr-only"> stars</span>
                    </dt>
                    <dd className="flex flex-1 items-center gap-3">
                      <span className="h-[3px] flex-1 bg-[color:var(--color-stone-deep)]">
                        <span
                          className="block h-full bg-[color:var(--color-ink)]"
                          style={{ width: `${row.share * 100}%` }}
                        />
                      </span>
                      <span className="t-small tabular w-9 text-right text-[color:var(--color-muted)]">
                        {Math.round(row.share * 100)}%
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          {/* ------------------------------------------------------ reviews */}
          <div className="lg:col-span-8">
            <ul className="space-y-px">
              {featured.map((review, i) => (
                <Reveal key={review.id} as="li" delay={i * 0.06}>
                  <article className="border-t border-[color:var(--color-line)] py-8">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <Stars value={review.rating} />
                      <h3 className="t-product">{review.title}</h3>
                    </div>
                    <p className="t-body mt-4 max-w-prose">{review.body}</p>
                    <p className="t-label mt-5 text-[color:var(--color-muted)]">
                      {review.author}
                      <span className="mx-2.5 text-[color:var(--color-line-strong)]">/</span>
                      {review.location}
                      {review.verified && (
                        <>
                          <span className="mx-2.5 text-[color:var(--color-line-strong)]">/</span>
                          <span className="text-[color:var(--color-positive)]">
                            Verified purchase
                          </span>
                        </>
                      )}
                    </p>
                  </article>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>

        {/* --------------------------------------------------------- press */}
        <Reveal className="mt-20 lg:mt-28">
          <h3 className="t-label text-[color:var(--color-muted)]">Press</h3>
          <ul className="mt-8 grid gap-10 border-t border-[color:var(--color-line-strong)] pt-10 md:grid-cols-3 md:gap-12">
            {press.slice(0, 3).map((mention) => (
              <li key={mention.publication}>
                <blockquote className="t-serif text-[1.375rem] leading-[1.35] tracking-[-0.015em]">
                  “{mention.quote}”
                </blockquote>
                <p className="t-label mt-5 text-[color:var(--color-muted)]">
                  {mention.publication}
                  <span className="mx-2.5 text-[color:var(--color-line-strong)]">/</span>
                  {mention.issue}
                </p>
              </li>
            ))}
          </ul>
          <p className="t-small mt-8 text-[color:var(--color-muted)]">
            Publications shown are fictional, created for this concept.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
