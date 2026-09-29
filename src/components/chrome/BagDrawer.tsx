import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Link, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { money, price } from '@/lib/format'
import { Drawer } from '@/components/primitives/Overlay'
import { QuantityStepper } from '@/components/primitives/Bits'
import { DURATION, EASE } from '@/lib/motion'
import { FREE_SHIPPING_THRESHOLD, useShop, type ResolvedLine } from '@/store/shop'

function BagLine({ line, justAdded }: { line: ResolvedLine; justAdded: boolean }) {
  const { setQuantity, removeLine } = useShop()
  const { product, colorway } = line

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
      transition={{ duration: DURATION.ui, ease: EASE }}
      className={cn(
        'flex gap-4 overflow-hidden border-b border-[color:var(--color-line)] py-5',
        justAdded && 'bg-[color:var(--color-signal-wash)]/50',
      )}
    >
      <Link
        to={`/product/${product.slug}`}
        className="relative block h-24 w-28 shrink-0 overflow-hidden bg-[color:var(--color-bed-mid)]"
        aria-label={`AURA ${product.name}`}
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
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="t-product">
              <Link to={`/product/${product.slug}`} className="link-draw">
                AURA {product.name}
              </Link>
            </h3>
            <p className="t-small mt-1 text-[color:var(--color-muted)]">
              {colorway.name} · US {line.size}
            </p>
          </div>
          <p className="t-price shrink-0">{price(line.lineTotal)}</p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <QuantityStepper
            size="sm"
            value={line.quantity}
            onChange={(next) => setQuantity(line.id, next)}
            label={`AURA ${product.name}, size ${line.size}`}
            min={0}
          />
          <button
            type="button"
            onClick={() => removeLine(line.id)}
            className="t-label link-draw text-[color:var(--color-muted)] hover:text-[color:var(--color-primary)]"
          >
            Remove
            <span className="sr-only">
              {' '}
              AURA {product.name}, {colorway.name}, size {line.size}
            </span>
          </button>
        </div>
      </div>
    </motion.li>
  )
}

/** Progress toward free shipping. The one nudge in the whole bag. */
function ShippingMeter({ remaining }: { remaining: number }) {
  const reduced = useReducedMotion()
  const pct = Math.min(100, ((FREE_SHIPPING_THRESHOLD - remaining) / FREE_SHIPPING_THRESHOLD) * 100)

  return (
    <div className="px-5 pt-5 md:px-7">
      <p className="t-small text-[color:var(--color-secondary)]">
        {remaining > 0 ? (
          <>
            <span className="tabular">{price(remaining)}</span> away from free shipping
          </>
        ) : (
          <span className="text-[color:var(--color-positive)]">
            Free shipping applied to this order
          </span>
        )}
      </p>
      <div
        className="mt-2.5 h-[3px] w-full bg-[color:var(--color-stone-deep)]"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progress toward free shipping"
      >
        <motion.div
          className="h-full bg-[color:var(--color-signal)]"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={reduced ? { duration: 0 } : { duration: 0.5, ease: EASE }}
        />
      </div>
    </div>
  )
}

export function BagDrawer() {
  const {
    overlay,
    closeOverlay,
    lines,
    bagCount,
    subtotal,
    shipping,
    total,
    tax,
    freeShippingRemaining,
    lastAdded,
  } = useShop()
  const navigate = useNavigate()
  const open = overlay === 'bag'

  const goToCheckout = () => {
    closeOverlay()
    navigate('/checkout')
  }

  return (
    <Drawer
      open={open}
      onClose={closeOverlay}
      title={`Bag${bagCount ? ` (${bagCount})` : ''}`}
      footer={
        lines.length > 0 ? (
          <div className="px-5 py-5 md:px-7">
            <dl className="space-y-2.5">
              <div className="flex justify-between">
                <dt className="t-small text-[color:var(--color-secondary)]">Subtotal</dt>
                <dd className="t-price">{money(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="t-small text-[color:var(--color-secondary)]">Shipping estimate</dt>
                <dd className="t-price">{shipping === 0 ? 'Free' : money(shipping)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="t-small text-[color:var(--color-secondary)]">Estimated tax</dt>
                <dd className="t-price">{money(tax)}</dd>
              </div>
              <div className="flex justify-between border-t border-[color:var(--color-line)] pt-3">
                <dt className="t-product">Total</dt>
                <dd className="t-price font-medium">{money(total)}</dd>
              </div>
            </dl>

            <button type="button" onClick={goToCheckout} className="btn btn-solid btn-lg mt-5 w-full">
              Checkout
            </button>
            <button
              type="button"
              onClick={closeOverlay}
              className="t-label mt-4 block w-full text-center text-[color:var(--color-muted)] transition-colors hover:text-[color:var(--color-primary)]"
            >
              Continue shopping
            </button>
          </div>
        ) : undefined
      }
    >
      {lines.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center px-8 text-center">
          <p className="t-h3">Your bag is empty.</p>
          <p className="t-body mt-3 max-w-xs">
            Nothing in here yet. The ONE is where most people start.
          </p>
          <Link to="/shop" onClick={closeOverlay} className="btn btn-solid btn-md mt-7">
            Shop the collection
          </Link>
        </div>
      ) : (
        <>
          <ShippingMeter remaining={freeShippingRemaining} />
          <ul className="px-5 md:px-7">
            <AnimatePresence initial={false}>
              {lines.map((line) => (
                <BagLine key={line.id} line={line} justAdded={line.id === lastAdded} />
              ))}
            </AnimatePresence>
          </ul>
          <p className="t-small px-5 py-5 text-[color:var(--color-muted)] md:px-7">
            This is a portfolio prototype. Nothing is charged and no order is placed.
          </p>
        </>
      )}
    </Drawer>
  )
}
