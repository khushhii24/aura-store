import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { products } from '@/data/products'
import { CatalogGrid } from '@/components/product/ProductGrid'
import { Eyebrow } from '@/components/primitives/Bits'
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

  return (
    <>
      <header className="border-b border-[color:var(--color-line)] bg-[color:var(--color-stone)]">
        <div className="container-aura py-14 md:py-20">
          <Eyebrow>Saved</Eyebrow>
          <h1 className="t-h1 mt-6">Wishlist</h1>
          <p className="t-lede mt-5 max-w-xl">
            {saved.length > 0
              ? `${saved.length} ${saved.length === 1 ? 'style' : 'styles'} saved. Stored in this browser — no account needed.`
              : 'Nothing saved yet.'}
          </p>
        </div>
      </header>

      <div className="container-aura py-14 md:py-20">
        {saved.length > 0 ? (
          <CatalogGrid products={saved} />
        ) : (
          <div className="max-w-md py-8">
            <h2 className="t-h3">Save the ones you are deciding between.</h2>
            <p className="t-body mt-3">
              Tap the heart on any product to keep it here. It survives a refresh and costs nothing
              to change your mind about.
            </p>
            <Link to="/shop" className="btn btn-solid btn-lg mt-7">
              Browse the collection
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
