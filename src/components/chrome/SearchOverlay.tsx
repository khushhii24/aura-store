import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { ArrowRight, Search, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { price } from '@/lib/format'
import { searchProducts } from '@/data/catalog'
import { SUGGESTED_SEARCHES } from '@/data/content'
import { products } from '@/data/products'
import { useEscapeKey, useFocusTrap, useScrollLock } from '@/lib/hooks'
import { DURATION, EASE } from '@/lib/motion'
import { useShop } from '@/store/shop'

function ResultRow({
  slug,
  onNavigate,
  compact = false,
}: {
  slug: string
  onNavigate: () => void
  /** The sidebar column is too narrow for the tagline and the arrow. */
  compact?: boolean
}) {
  const product = products.find((p) => p.slug === slug)
  if (!product) return null

  return (
    <li>
      <Link
        to={`/product/${product.slug}`}
        onClick={onNavigate}
        className="group flex items-center gap-4 py-2.5 transition-colors hover:bg-[color:var(--color-stone)]/60"
      >
        <span
          className={cn(
            'relative block shrink-0 overflow-hidden bg-[color:var(--color-bed-mid)]',
            compact ? 'h-12 w-16' : 'h-16 w-20',
          )}
        >
          {product.images[0] && (
            <img
              src={product.images[0].src}
              alt=""
              loading="lazy"
              decoding="async"
              className="photo-grade absolute inset-0 h-full w-full object-cover"
            />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="t-product block">AURA {product.name}</span>
          {compact ? (
            <span className="t-small block text-[color:var(--color-muted)]">
              {price(product.price)}
            </span>
          ) : (
            <span className="t-small block text-[color:var(--color-muted)]">{product.tagline}</span>
          )}
        </span>
        {!compact && (
          <>
            <span className="t-price shrink-0 text-[color:var(--color-secondary)]">
              {price(product.price)}
            </span>
            <ArrowRight
              size={15}
              strokeWidth={1.5}
              aria-hidden="true"
              className="shrink-0 -translate-x-1 text-[color:var(--color-muted)] opacity-0 transition-all duration-[var(--duration-micro)] group-hover:translate-x-0 group-hover:opacity-100"
            />
          </>
        )}
      </Link>
    </li>
  )
}

export function SearchOverlay() {
  const { overlay, closeOverlay, recentlyViewed } = useShop()
  const open = overlay === 'search'
  const [query, setQuery] = useState('')
  const reduced = useReducedMotion()

  useScrollLock(open)
  useEscapeKey(open, closeOverlay)
  const ref = useFocusTrap<HTMLDivElement>(open)

  const results = useMemo(() => searchProducts(query, products), [query])
  const searching = query.trim().length > 0

  const close = () => {
    setQuery('')
    closeOverlay()
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-[#14120e]/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.ui, ease: EASE }}
            onClick={close}
            aria-hidden="true"
          />

          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="fixed inset-x-0 top-0 z-50 max-h-[92vh] overflow-y-auto overscroll-contain bg-[color:var(--color-canvas)] lg:max-h-[86vh]"
            initial={reduced ? { opacity: 0 } : { y: '-100%' }}
            animate={reduced ? { opacity: 1 } : { y: 0 }}
            exit={reduced ? { opacity: 0 } : { y: '-100%' }}
            transition={
              reduced ? { duration: DURATION.ui } : { duration: 0.42, ease: [0.16, 1, 0.3, 1] }
            }
          >
            <div className="container-aura">
              <div className="flex items-center gap-4 border-b border-[color:var(--color-line)] py-5">
                <Search
                  size={20}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="shrink-0 text-[color:var(--color-muted)]"
                />
                <label htmlFor="site-search" className="sr-only">
                  Search AURA
                </label>
                <input
                  id="site-search"
                  data-autofocus
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search footwear, colours, categories"
                  autoComplete="off"
                  className="t-h3 min-w-0 flex-1 border-0 bg-transparent py-1 outline-none placeholder:text-[color:var(--color-line-strong)] focus-visible:outline-none"
                />
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close search"
                  className="-mr-2.5 flex h-11 w-11 shrink-0 items-center justify-center text-[color:var(--color-secondary)] transition-colors hover:text-[color:var(--color-primary)]"
                >
                  <X size={19} strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>

              <div className="grid gap-10 py-8 lg:grid-cols-[18rem_1fr] lg:gap-16 lg:py-10">
                <div className={cn(searching && 'hidden lg:block')}>
                  <h2 className="t-label text-[color:var(--color-muted)]">Suggested</h2>
                  <ul className="mt-4 space-y-2.5">
                    {SUGGESTED_SEARCHES.map((s) => (
                      <li key={s}>
                        <button
                          type="button"
                          onClick={() => setQuery(s)}
                          className="t-small link-draw text-left text-[color:var(--color-secondary)] hover:text-[color:var(--color-primary)]"
                        >
                          {s}
                        </button>
                      </li>
                    ))}
                  </ul>

                  {recentlyViewed.length > 0 && (
                    <>
                      <h2 className="t-label mt-9 text-[color:var(--color-muted)]">
                        Recently viewed
                      </h2>
                      <ul className="mt-3 -ml-1">
                        {recentlyViewed.map((slug) => (
                          <ResultRow key={slug} slug={slug} onNavigate={close} compact />
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                <div aria-live="polite">
                  {!searching && (
                    <>
                      <h2 className="t-label text-[color:var(--color-muted)]">The range</h2>
                      <ul className="mt-3 -ml-1">
                        {products.slice(0, 4).map((p) => (
                          <ResultRow key={p.id} slug={p.slug} onNavigate={close} />
                        ))}
                      </ul>
                    </>
                  )}

                  {searching && results.length > 0 && (
                    <>
                      <h2 className="t-label text-[color:var(--color-muted)]">
                        {results.length} {results.length === 1 ? 'result' : 'results'} for “{query}”
                      </h2>
                      <ul className="mt-3 -ml-1">
                        {results.map((p) => (
                          <ResultRow key={p.id} slug={p.slug} onNavigate={close} />
                        ))}
                      </ul>
                    </>
                  )}

                  {searching && results.length === 0 && (
                    <div className="max-w-md">
                      <h2 className="t-h3">No results for “{query}”.</h2>
                      <p className="t-body mt-3">
                        Try a model name — ONE, RUN, FORM, SHIFT — or a colour like bone, moss or
                        clay.
                      </p>
                      <Link to="/shop" onClick={close} className="btn btn-outline btn-md mt-6">
                        Browse everything
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}
