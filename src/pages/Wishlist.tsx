import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { featuredProducts, products } from '@/data/products'
import { CatalogGrid } from '@/components/product/ProductGrid'
import { ProductCard } from '@/components/product/ProductCard'
import { Eyebrow } from '@/components/primitives/Bits'
import { Reveal } from '@/components/primitives/Reveal'
import { useShop } from '@/store/shop'

export function Wishlist() {
  const { wishlist } = useShop()

  useEffect(() => {
    document.title = 'Wishlist — AURA'
  }, [])

  /** One card per saved product, even if several colourways are saved. */
  const saved = useMemo(() => {
    const slugs = [...new Set(wishlist.map((w) => w.slug))]
    return slugs.flatMap((slug) => products.filter((p) => p.slug === slug))
  }, [wishlist])

  const empty = saved.length === 0

  return (
    <>
      <header className="border-b border-[color:var(--color-line)] bg-[color:var(--color-stone)]">
        <div className="container-aura py-14 md:py-20">
          <Eyebrow>Saved</Eyebrow>
          <h1 className="t-h1 mt-6">Wishlist</h1>
          <p className="t-lede mt-5 max-w-xl">
            {empty
              ? 'Nothing saved yet. Tap the heart on any product to keep it here — it survives a refresh and costs nothing to change your mind about.'
              : `${saved.length} ${saved.length === 1 ? 'style' : 'styles'} saved. Stored in this browser — no account needed.`}
          </p>
          {empty && (
            <Link to="/shop" className="btn btn-solid btn-lg mt-8">
              Browse the collection
            </Link>
          )}
        </div>
      </header>

      <div className="container-aura py-14 md:py-20">
        {empty ? (
          /* An empty page with nothing on it is the worst version of this
             screen. Give it the range to look at instead. */
          <section aria-labelledby="wishlist-suggestions">
            <h2 id="wishlist-suggestions" className="t-label text-[color:var(--color-muted)]">
              Most people start here
            </h2>
            <div className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
              {featuredProducts.slice(0, 3).map((product, i) => (
                <Reveal key={product.id} delay={i * 0.05}>
                  <ProductCard
                    product={product}
                    layout="square"
                    view={i === 1 ? 'top' : 'hero'}
                    hoverView={i === 1 ? 'hero' : 'profile'}
                    flip={i === 2}
                    tone={i === 1 ? 'dark' : 'stone'}
                    priority
                  />
                </Reveal>
              ))}
            </div>
          </section>
        ) : (
          <section aria-labelledby="wishlist-saved">
            {/* The grid's cards are h3s, so the populated branch needs its own
                h2 or the heading order jumps straight from h1 to h3. */}
            <h2 id="wishlist-saved" className="t-label text-[color:var(--color-muted)]">
              Saved styles
            </h2>
            <div className="mt-8">
              <CatalogGrid products={saved} />
            </div>
          </section>
        )}
      </div>
    </>
  )
}
