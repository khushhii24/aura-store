import { useEffect, useState } from 'react'
import { Link, useOutletContext, useParams } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { getProduct, products } from '@/data/products'
import { reviewsFor } from '@/data/reviews'
import { ProductGallery } from '@/components/product/ProductGallery'
import { ProductInfo } from '@/components/product/ProductInfo'
import { ProductCard } from '@/components/product/ProductCard'
import { Photo } from '@/components/visuals/Photo'
import { PHOTOS } from '@/data/photography'
import { Reveal } from '@/components/primitives/Reveal'
import { Eyebrow, Stars } from '@/components/primitives/Bits'
import { useShop } from '@/store/shop'
import { NotFound } from './NotFound'

interface LayoutContext {
  openSizeGuide: () => void
}

export function ProductDetail() {
  const { slug = '' } = useParams()
  const product = getProduct(slug)
  const { openSizeGuide } = useOutletContext<LayoutContext>()
  const { markViewed } = useShop()
  const [colorwayId, setColorwayId] = useState(product?.colorways[0].id ?? '')

  useEffect(() => {
    if (!product) return
    setColorwayId(product.colorways[0].id)
    markViewed(product.slug)
    document.title = `AURA ${product.name} — ${product.tagline}`
  }, [product, markViewed])

  if (!product) return <NotFound />

  const colorway = product.colorways.find((c) => c.id === colorwayId) ?? product.colorways[0]
  const reviews = reviewsFor(product.slug)
  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3)

  return (
    <>
      {/* ------------------------------------------------------ breadcrumb */}
      <nav aria-label="Breadcrumb" className="container-aura pt-6 pb-2">
        <ol className="flex flex-wrap items-center gap-1.5">
          {[
            { label: 'Home', to: '/' },
            { label: 'Shop', to: '/shop' },
          ].map((crumb) => (
            <li key={crumb.to} className="flex items-center gap-1.5">
              <Link to={crumb.to} className="t-label link-draw text-[color:var(--color-muted)]">
                {crumb.label}
              </Link>
              <ChevronRight
                size={13}
                strokeWidth={1.5}
                aria-hidden="true"
                className="text-[color:var(--color-line-strong)]"
              />
            </li>
          ))}
          <li className="t-label text-[color:var(--color-primary)]" aria-current="page">
            AURA {product.name}
          </li>
        </ol>
      </nav>

      {/* --------------------------------------------------- gallery + buy */}
      <div className="container-aura pt-4 pb-16 md:pb-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7 xl:col-span-7">
            {/* Full-bleed gallery on mobile, inset on desktop. */}
            <div className="-mx-5 md:-mx-10 lg:mx-0">
              <ProductGallery product={product} />
            </div>
          </div>

          <div className="lg:col-span-5">
            <ProductInfo
              product={product}
              colorway={colorway}
              onOpenSizeGuide={openSizeGuide}
            />
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------- story */}
      <section className="bg-[color:var(--color-stone)] section-y" aria-labelledby="pdp-story">
        <div className="container-aura grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <Eyebrow>Behind the design</Eyebrow>
            <h2 id="pdp-story" className="t-h2 mt-6 max-w-[16ch]">
              Why the {product.name} exists.
            </h2>
            <p className="t-body mt-6 max-w-prose">{product.story}</p>

            <dl className="mt-9 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-[color:var(--color-line-strong)] pt-8">
              {product.specs.map((spec) => (
                <div key={spec.label}>
                  <dt className="t-label text-[color:var(--color-muted)]">{spec.label}</dt>
                  <dd className="t-small mt-2">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={0.06}>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Photo photo={PHOTOS.knitCharcoal} className="absolute inset-0" alt="" />
            </div>
            <p className="t-label mt-3 text-[color:var(--color-muted)]">
              Material — {colorway.name}
            </p>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------------------- reviews */}
      {reviews.length > 0 && (
        <section id="reviews" className="section-y" aria-labelledby="pdp-reviews">
          <div className="container-aura">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <Eyebrow>Reviews</Eyebrow>
                  <h2 id="pdp-reviews" className="t-h2 mt-6">
                    {product.rating.toFixed(1)} from {product.reviewCount} owners
                  </h2>
                </div>
                <Stars value={product.rating} size={18} />
              </div>
            </Reveal>

            <ul className="mt-12 grid gap-px md:grid-cols-2 md:gap-x-12">
              {reviews.map((review, i) => (
                <Reveal key={review.id} as="li" delay={(i % 2) * 0.06}>
                  <article className="h-full border-t border-[color:var(--color-line)] py-7">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <Stars value={review.rating} />
                      <h3 className="t-product">{review.title}</h3>
                    </div>
                    <p className="t-body mt-4">{review.body}</p>
                    <p className="t-label mt-5 text-[color:var(--color-muted)]">
                      {review.author}
                      <span className="mx-2.5 text-[color:var(--color-line-strong)]">/</span>
                      {review.location}
                      <span className="mx-2.5 text-[color:var(--color-line-strong)]">/</span>
                      Fits {review.fit === 'true' ? 'true to size' : `${review.fit}`}
                    </p>
                  </article>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------- related */}
      <section className="section-y-tight border-t border-[color:var(--color-line)]" aria-labelledby="pdp-related">
        <div className="container-aura">
          <h2 id="pdp-related" className="t-label text-[color:var(--color-muted)]">
            You might also consider
          </h2>
          <div className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
            {related.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.05}>
                <ProductCard
                  product={item}
                  layout="square"
                  priority
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
