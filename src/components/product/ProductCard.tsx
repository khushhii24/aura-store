import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { price } from '@/lib/format'
import type { Product } from '@/data/types'
import { Swatch } from '@/components/primitives/Bits'
import { WishlistButton } from './WishlistButton'

const BADGE_LABEL: Record<NonNullable<Product['badge']>, string> = {
  new: 'New',
  bestseller: 'Best seller',
  'last-pairs': 'Last pairs',
}

export type CardLayout = 'square' | 'portrait' | 'wide'

interface ProductCardProps {
  product: Product
  layout?: CardLayout
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
  className,
  priority = false,
}: ProductCardProps) {
  const [hovered, setHovered] = useState(false)
  const colorway = product.colorways[0]
  const to = `/product/${product.slug}`
  const primary = product.images[0]
  /** Only AURA ONE has a second angle; the rest lean on a slow zoom instead. */
  const secondary = product.images[1]

  if (!primary) return null

  return (
    <article
      className={cn('group/card flex flex-col', className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={cn('relative isolate overflow-hidden bg-[color:var(--color-bed-mid)]', ASPECT[layout])}>
        <Link
          to={to}
          className="absolute inset-0 block focus-visible:outline-offset-[-3px]"
          aria-label={`${product.name} — ${product.tagline}, ${price(product.price)}`}
        >
          <img
            src={primary.src}
            alt={primary.alt}
            width={primary.width}
            height={primary.height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className={cn(
              'photo-grade absolute inset-0 h-full w-full object-cover transition-all duration-[var(--duration-image)] ease-[cubic-bezier(0.16,1,0.3,1)]',
              secondary && hovered ? 'opacity-0' : 'opacity-100',
              !secondary && 'group-hover/card:scale-[1.04]',
            )}
          />
          {secondary && (
            <img
              src={secondary.src}
              alt=""
              width={secondary.width}
              height={secondary.height}
              loading="lazy"
              decoding="async"
              aria-hidden="true"
              className={cn(
                'photo-grade absolute inset-0 h-full w-full object-cover transition-opacity duration-[var(--duration-image)] ease-[cubic-bezier(0.16,1,0.3,1)]',
                hovered ? 'opacity-100' : 'opacity-0',
              )}
            />
          )}
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

        <div
          className={cn(
            'pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden translate-y-2 bg-gradient-to-t from-[#14120e]/55 to-transparent p-4 opacity-0 transition-all duration-[var(--duration-ui)] ease-[cubic-bezier(0.16,1,0.3,1)] md:block',
            'group-hover/card:translate-y-0 group-hover/card:opacity-100',
          )}
        >
          <p className="t-label text-[color:var(--color-on-dark)]">
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
        <Swatch colors={colorway.swatch} size={16} />
        <span className="t-small text-[color:var(--color-muted)]">{colorway.name}</span>
      </div>
    </article>
  )
}
