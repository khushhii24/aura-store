import { useMemo, useState } from 'react'
import { Check, Truck } from 'lucide-react'
import { cn } from '@/lib/cn'
import { price } from '@/lib/format'
import type { Colorway, Product } from '@/data/types'
import { reviewsFor } from '@/data/reviews'
import { RETURNS_INFO, SHIPPING_INFO } from '@/data/content'
import { Button } from '@/components/primitives/Button'
import { AccordionItem } from '@/components/primitives/Accordion'
import { QuantityStepper, RatingLine, Swatch } from '@/components/primitives/Bits'
import { WishlistButton } from './WishlistButton'
import { useShop } from '@/store/shop'

interface ProductInfoProps {
  product: Product
  colorway: Colorway
  onOpenSizeGuide: () => void
}

export function ProductInfo({
  product,
  colorway,
  onOpenSizeGuide,
}: ProductInfoProps) {
  const { addToBag } = useShop()
  const [size, setSize] = useState<number | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [missingSize, setMissingSize] = useState(false)

  /** Reviewers' fit reports, summarised — the question everyone asks. */
  const fitNote = useMemo(() => {
    const list = reviewsFor(product.slug)
    if (list.length === 0) return null
    const small = list.filter((r) => r.fit === 'small').length
    const large = list.filter((r) => r.fit === 'large').length
    if (large > list.length / 2) return 'Most reviewers say this runs large.'
    if (small > list.length / 2) return 'Most reviewers say this runs small.'
    return 'Most reviewers say this fits true to size.'
  }, [product.slug])

  const submit = () => {
    if (size === null) {
      setMissingSize(true)
      document.getElementById('size-selector')?.focus()
      return
    }
    addToBag({ slug: product.slug, colorwayId: colorway.id, size, quantity })
  }

  return (
    <div className="lg:sticky lg:top-28">
      <p className="t-label text-[color:var(--color-muted)]">
        {product.category} — {product.audience.join(' · ')}
      </p>

      <h1 className="t-h1 mt-4">
        <span className="t-wordmark block text-[0.26em] tracking-[0.34em] text-[color:var(--color-muted)]">
          Aura
        </span>
        {product.name}
      </h1>

      <p className="t-lede mt-4 max-w-prose">{product.shortDescription}</p>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        <p className="t-price text-lg">
          {product.compareAt && (
            <span className="mr-2 text-[color:var(--color-muted)] line-through">
              {price(product.compareAt)}
            </span>
          )}
          <span className={cn(product.compareAt && 'text-[color:var(--color-sale)]')}>
            {price(product.price)}
          </span>
        </p>
        <a href="#reviews" className="link-draw">
          <RatingLine value={product.rating} count={product.reviewCount} />
        </a>
      </div>

      {/* Photography means one shot per colourway, and the pool of licensed
          unbranded footwear photography supports exactly one per model. The
          swatch reports the colour rather than offering a choice it cannot
          honour. */}
      <div className="mt-10 flex items-center gap-3">
        <Swatch colors={colorway.swatch} size={22} />
        <p className="t-small">
          <span className="t-label mr-2 text-[color:var(--color-muted)]">Colour</span>
          {colorway.name}
        </p>
      </div>

      {/* ------------------------------------------------------------ size */}
      <div className="mt-9">
        <div className="flex items-baseline justify-between">
          <h2 className="t-label text-[color:var(--color-muted)]">Size (US)</h2>
          <button type="button" onClick={onOpenSizeGuide} className="t-small link-draw">
            Size guide
          </button>
        </div>

        <div
          id="size-selector"
          tabIndex={-1}
          role="radiogroup"
          aria-label="Size"
          aria-describedby={missingSize ? 'size-error' : undefined}
          className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-6"
        >
          {product.sizes.map((s) => {
            const soldOut = product.soldOutSizes.includes(s)
            return (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={s === size}
                disabled={soldOut}
                onClick={() => {
                  setSize(s)
                  setMissingSize(false)
                }}
                className="pill min-w-0 px-0"
                data-selected={s === size || undefined}
              >
                {s}
                {soldOut && <span className="sr-only"> — sold out</span>}
              </button>
            )
          })}
        </div>

        {missingSize && (
          <p id="size-error" role="alert" className="t-small mt-3 text-[color:var(--color-sale)]">
            Choose a size to continue.
          </p>
        )}

        {fitNote && (
          <p className="t-small mt-3 text-[color:var(--color-muted)]">{fitNote}</p>
        )}
      </div>

      {/* ------------------------------------------------------------- buy */}
      <div className="mt-9 flex flex-wrap items-center gap-3">
        <QuantityStepper
          value={quantity}
          onChange={setQuantity}
          label={`AURA ${product.name}`}
          max={10}
        />
        <Button size="lg" className="min-w-[13rem] flex-1" onClick={submit}>
          Add to bag — {price(product.price * quantity)}
        </Button>
        <WishlistButton
          slug={product.slug}
          colorwayId={colorway.id}
          productName={`AURA ${product.name}`}
          tone="inline"
        />
      </div>

      <ul className="mt-6 space-y-2">
        <li className="t-small flex items-center gap-2.5 text-[color:var(--color-secondary)]">
          <Truck size={15} strokeWidth={1.5} aria-hidden="true" />
          Free shipping over $150 — arrives in 3–5 business days
        </li>
        <li className="t-small flex items-center gap-2.5 text-[color:var(--color-secondary)]">
          <Check size={15} strokeWidth={1.5} aria-hidden="true" />
          30-day wear test. Free returns, always.
        </li>
      </ul>

      {/* ------------------------------------------------------- the detail */}
      <div className="mt-12">
        <AccordionItem title="Description" defaultOpen>
          <p className="t-body max-w-prose">{product.description}</p>
          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
            {product.specs.map((spec) => (
              <div key={spec.label}>
                <dt className="t-label text-[color:var(--color-muted)]">{spec.label}</dt>
                <dd className="t-small mt-1.5">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </AccordionItem>

        <AccordionItem title="Materials">
          <ul className="space-y-2.5">
            {product.materials.map((m) => (
              <li key={m} className="t-small flex gap-3 text-[color:var(--color-secondary)]">
                <span aria-hidden="true" className="text-[color:var(--color-line-strong)]">
                  —
                </span>
                {m}
              </li>
            ))}
          </ul>
        </AccordionItem>

        <AccordionItem title="Technology">
          <dl className="space-y-5">
            {product.technology.map((t) => (
              <div key={t.name}>
                <dt className="t-product">{t.name}</dt>
                <dd className="t-small mt-1.5 max-w-prose text-[color:var(--color-secondary)]">
                  {t.detail}
                </dd>
              </div>
            ))}
          </dl>
        </AccordionItem>

        <AccordionItem title="Shipping">
          <dl className="space-y-4">
            {SHIPPING_INFO.map((s) => (
              <div key={s.title}>
                <dt className="t-product">{s.title}</dt>
                <dd className="t-small mt-1.5 text-[color:var(--color-secondary)]">{s.detail}</dd>
              </div>
            ))}
          </dl>
        </AccordionItem>

        <AccordionItem title="Returns">
          <dl className="space-y-4">
            {RETURNS_INFO.map((s) => (
              <div key={s.title}>
                <dt className="t-product">{s.title}</dt>
                <dd className="t-small mt-1.5 text-[color:var(--color-secondary)]">{s.detail}</dd>
              </div>
            ))}
          </dl>
        </AccordionItem>
      </div>
    </div>
  )
}
