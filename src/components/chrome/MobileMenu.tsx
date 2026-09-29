import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Search, X } from 'lucide-react'
import { price } from '@/lib/format'
import { NAV_LINKS, SOCIAL_LINKS } from '@/data/content'
import { products } from '@/data/products'
import { useEscapeKey, useFocusTrap, useScrollLock } from '@/lib/hooks'
import { DURATION, EASE } from '@/lib/motion'
import { Wordmark } from '@/components/visuals/Wordmark'
import { useShop } from '@/store/shop'

/**
 * The mobile menu is a different design, not the desktop nav stacked.
 *
 * Phone navigation gets one screen and a thumb, so the links are display-sized
 * and the range is browsable from inside the menu — on desktop that would be
 * clutter, here it removes a whole step.
 */
export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduced = useReducedMotion()
  const { openOverlay, wishlistCount } = useShop()
  useScrollLock(open)
  useEscapeKey(open, onClose)
  const ref = useFocusTrap<HTMLDivElement>(open)

  const range = products.slice(0, 4)

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex flex-col bg-[color:var(--color-canvas)] lg:hidden"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: DURATION.ui, ease: EASE }}
        >
          <div className="flex h-16 shrink-0 items-center justify-between px-5">
            <Link to="/" onClick={onClose} className="text-[0.9375rem]" aria-label="AURA — home">
              <Wordmark />
            </Link>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="-mr-2.5 flex h-10 w-10 items-center justify-center"
            >
              <X size={20} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <nav aria-label="Mobile" className="px-5 pt-4">
              <ul>
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.label}
                    initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: DURATION.reveal,
                      ease: EASE,
                      delay: reduced ? 0 : 0.04 + i * 0.045,
                    }}
                    className="border-b border-[color:var(--color-line)]"
                  >
                    <Link
                      to={link.to}
                      onClick={onClose}
                      className="flex items-center justify-between py-4"
                    >
                      <span className="t-h2">{link.label}</span>
                      <ArrowUpRight
                        size={20}
                        strokeWidth={1.25}
                        aria-hidden="true"
                        className="text-[color:var(--color-muted)]"
                      />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <section className="mt-10 pb-4">
              <h2 className="t-label px-5 text-[color:var(--color-muted)]">The range</h2>
              <ul className="no-scrollbar mt-4 flex gap-3 overflow-x-auto px-5 pb-2">
                {range.map((product) => (
                  <li key={product.id} className="w-[11rem] shrink-0">
                    <Link to={`/product/${product.slug}`} onClick={onClose} className="block">
                      <span className="relative block aspect-square overflow-hidden bg-[color:var(--color-bed-mid)]">
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
                      <span className="mt-2.5 flex items-baseline justify-between">
                        <span className="t-product">AURA {product.name}</span>
                        <span className="t-price text-[color:var(--color-muted)]">
                          {price(product.price)}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="shrink-0 border-t border-[color:var(--color-line)] px-5 py-5">
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => {
                  onClose()
                  openOverlay('search')
                }}
                className="btn btn-quiet btn-md flex-1 justify-start gap-3"
              >
                <Search size={16} strokeWidth={1.5} aria-hidden="true" />
                Search
              </button>
              <Link to="/wishlist" onClick={onClose} className="btn btn-quiet btn-md flex-1">
                Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ''}
              </Link>
            </div>

            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              {SOCIAL_LINKS.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="t-label text-[color:var(--color-muted)] link-draw">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
