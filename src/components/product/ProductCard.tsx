import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { price } from '@/lib/format'
import type { Product } from '@/data/types'
import { ShoeVisual } from '@/components/visuals/ShoeVisual'
import { Swatch } from '@/components/primitives/Bits'
import { WishlistButton } from './WishlistButton'
import type { ShoeView } from '@/components/visuals/shoeGeometry'

const BADGE_LABEL: Record<NonNullable<Product['badge']>, string> = {
  new: 'New',
  bestseller: 'Best seller',
  'last-pairs': 'Last pairs',
}

export type CardLayout = 'square' | 'portrait' | 'wide'

interface ProductCardProps {
  product: Product
  layout?: CardLayout
  /** The shot shown at rest. */
  view?: ShoeView
  /** The shot revealed on hover — a real second angle, not a zoom. */
  hoverView?: ShoeView
  flip?: boolean
  tone?: 'stone' | 'dark'
  /** Index used only to stagger nothing — kept for grid keys. */
  className?: string
  priority?: boolean
}

const ASPECT: Record<CardLayout, string> = {
  square: 'aspect-square',
  portrait: 'aspect-[4/5]',
  wide: 'aspect-[16/11]',
}

export function ProductCard({
  product,
  layout = 'square',
  view = 'hero',
  hoverView = 'top',
  flip = false,
  tone = 'stone',
  className,
  priority = false,
}: ProductCardProps) {
  /** The card previews colourways in place — no navigation required. */
  const [colorIndex, setColorIndex] = useState(0)
  const colorway = product.colorways[colorIndex]
  const to = `/product/${product.slug}`

  return (
    <article className={cn('group/card flex flex-col', className)}>
      <div
        className={cn(
          'relative isolate overflow-hidden',
          ASPECT[layout],
          tone === 'dark' ? 'image-bed-deep grain grain-dark' : 'image-bed grain',
        )}
      >
        <Link
          to={to}
          className="absolute inset-0 block focus-visible:outline-offset-[-3px]"
          aria-label={`${product.name} — ${product.tagline}, ${price(product.price)}`}
        >
          <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-[var(--duration-image)] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:opacity-0">
            <ShoeVisual
              parts={colorway.parts}
              shape={product.shape}
              view={view}
              flip={flip}
              label={null}
            />
          </span>
          <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-[var(--duration-image)] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:opacity-100">
            <ShoeVisual
              parts={colorway.parts}
              shape={product.shape}
              view={hoverView}
              flip={flip}
              label={null}
            />
          </span>
        </Link>

        {product.badge && (
          <span
            className={cn(
              'badge pointer-events-none absolute top-3 left-3 z-10 md:top-4 md:left-4',
              product.badge === 'new' ? 'badge-signal' : 'badge-ink',
            )}
          >
            {BADGE_LABEL[product.badge]}
          </span>
        )}

        <WishlistButton
          slug={product.slug}
          colorwayId={colorway.id}
          productName={`AURA ${product.name}`}
          className="absolute top-3 right-3 z-10 md:top-4 md:right-4"
        />

        {/* Sizes in stock — the one piece of information that stops a
            shopper opening a page just to find their size is gone. */}
        <div
          className={cn(
            'pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden translate-y-2 p-4 opacity-0 transition-all duration-[var(--duration-ui)] ease-[cubic-bezier(0.16,1,0.3,1)] md:block',
            'group-hover/card:translate-y-0 group-hover/card:opacity-100',
          )}
        >
          <p
            className={cn(
              't-label',
              tone === 'dark'
                ? 'text-[color:var(--color-on-dark-muted)]'
                : 'text-[color:var(--color-on-bed)]',
            )}
          >
            {product.sizes.length - product.soldOutSizes.length} sizes in stock
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="t-product">
            <Link to={to} className="link-draw" tabIndex={priority ? 0 : -1}>
              AURA {product.name}
            </Link>
          </h3>
          <p className="t-small mt-1 text-[color:var(--color-muted)]">{product.tagline}</p>
        </div>
        <p className="t-price shrink-0">
          {product.compareAt && (
            <span className="mr-2 text-[color:var(--color-muted)] line-through">
              {price(product.compareAt)}
            </span>
          )}
          <span className={cn(product.compareAt && 'text-[color:var(--color-sale)]')}>
            {price(product.price)}
          </span>
        </p>
      </div>

      <div className="mt-3 flex items-center gap-2.5">
        {product.colorways.map((c, i) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setColorIndex(i)}
            aria-label={`Preview ${product.name} in ${c.name}`}
            aria-pressed={i === colorIndex}
            className="flex h-6 w-6 items-center justify-center"
          >
            <Swatch colors={c.swatch} selected={i === colorIndex} size={16} />
          </button>
        ))}
        <span className="t-small ml-1 text-[color:var(--color-muted)]">
          {product.colorways.length} colours
        </span>
      </div>
    </article>
  )
}
