import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/cn'
import { useShop } from '@/store/shop'

interface WishlistButtonProps {
  slug: string
  colorwayId: string
  productName: string
  /** `overlay` sits on a product shot, `inline` next to a button. */
  tone?: 'overlay' | 'inline'
  className?: string
}

/**
 * The only place the signal colour is allowed to fill a shape at small size.
 * Saved state has to be readable at a glance in a grid of eight.
 */
export function WishlistButton({
  slug,
  colorwayId,
  productName,
  tone = 'overlay',
  className,
}: WishlistButtonProps) {
  const { isWished, toggleWish } = useShop()
  const reduced = useReducedMotion()
  const saved = isWished(slug, colorwayId)

  return (
    <button
      type="button"
      onClick={() => toggleWish({ slug, colorwayId })}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${productName} from wishlist` : `Save ${productName} to wishlist`}
      className={cn(
        'group/wish relative flex items-center justify-center transition-colors',
        tone === 'overlay'
          ? 'h-10 w-10 bg-[color:var(--color-surface)]/80 backdrop-blur-sm hover:bg-[color:var(--color-surface)]'
          : 'h-14 w-14 border border-[color:var(--color-control)] hover:border-[color:var(--color-ink)]',
        className,
      )}
    >
      <motion.svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        aria-hidden="true"
        animate={reduced ? undefined : { scale: saved ? [1, 1.28, 1] : 1 }}
        transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
      >
        <path
          d="M12 20.4 3.9 12.6a4.9 4.9 0 0 1 0-7 5.1 5.1 0 0 1 7.2 0l.9.9.9-.9a5.1 5.1 0 0 1 7.2 0 4.9 4.9 0 0 1 0 7Z"
          fill={saved ? 'var(--color-signal)' : 'none'}
          stroke={saved ? 'var(--color-ink)' : 'currentColor'}
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </motion.svg>
    </button>
  )
}
