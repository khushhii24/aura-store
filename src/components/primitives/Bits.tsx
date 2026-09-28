import { Minus, Plus } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/* ------------------------------------------------------------------ rating */

/**
 * Stars render as a clipped overlay rather than rounded half-stars, so 4.8
 * actually looks like 4.8. The number is always shown alongside — stars on
 * their own are decoration, not information.
 */
export function Stars({ value, size = 13 }: { value: number; size?: number }) {
  const pct = `${(Math.min(Math.max(value, 0), 5) / 5) * 100}%`
  const star = (fill: string, key: string) => (
    <svg key={key} width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M10 1.6 12.47 7.1 18.4 7.76 13.99 11.78 15.2 17.6 10 14.63 4.8 17.6 6.01 11.78 1.6 7.76 7.53 7.1Z"
        fill={fill}
      />
    </svg>
  )

  return (
    <span className="relative inline-flex" role="presentation">
      <span className="flex gap-[2px]">
        {[0, 1, 2, 3, 4].map((i) => star('var(--color-line-strong)', `bg-${i}`))}
      </span>
      <span
        className="absolute inset-0 flex gap-[2px] overflow-hidden"
        style={{ width: pct }}
        aria-hidden="true"
      >
        {[0, 1, 2, 3, 4].map((i) => star('var(--color-ink)', `fg-${i}`))}
      </span>
    </span>
  )
}

export function RatingLine({
  value,
  count,
  className,
}: {
  value: number
  count: number
  className?: string
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <Stars value={value} />
      <span className="t-small tabular text-[color:var(--color-secondary)]">
        {value.toFixed(1)}
        <span className="sr-only"> out of 5</span>
      </span>
      <span aria-hidden="true" className="text-[color:var(--color-line-strong)]">
        ·
      </span>
      <span className="t-small text-[color:var(--color-muted)]">{count} reviews</span>
    </span>
  )
}

/* ---------------------------------------------------------------- quantity */

export function QuantityStepper({
  value,
  onChange,
  label,
  min = 1,
  max = 10,
  size = 'md',
}: {
  value: number
  onChange: (next: number) => void
  label: string
  min?: number
  max?: number
  size?: 'sm' | 'md'
}) {
  const dimension = size === 'sm' ? 'h-9 w-9' : 'h-11 w-11'

  return (
    <div
      className="inline-flex items-center border border-[color:var(--color-control)]"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        className={cn(
          dimension,
          'flex items-center justify-center text-[color:var(--color-primary)] transition-colors hover:bg-[color:var(--color-stone)] disabled:opacity-35 disabled:hover:bg-transparent',
        )}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={`Decrease quantity of ${label}`}
      >
        <Minus size={14} strokeWidth={1.75} aria-hidden="true" />
      </button>
      <span
        className={cn(
          'tabular min-w-9 text-center text-sm',
          size === 'sm' ? 'min-w-7' : 'min-w-9',
        )}
        aria-live="polite"
      >
        {value}
        <span className="sr-only"> in bag</span>
      </span>
      <button
        type="button"
        className={cn(
          dimension,
          'flex items-center justify-center text-[color:var(--color-primary)] transition-colors hover:bg-[color:var(--color-stone)] disabled:opacity-35 disabled:hover:bg-transparent',
        )}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Increase quantity of ${label}`}
      >
        <Plus size={14} strokeWidth={1.75} aria-hidden="true" />
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------- misc */

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('t-label text-[color:var(--color-muted)]', className)}>
      <span className="mr-3 inline-block h-px w-6 translate-y-[-3px] bg-[color:var(--color-line-strong)]" />
      {children}
    </p>
  )
}

export function Swatch({
  colors,
  selected,
  size = 22,
}: {
  colors: [string, string]
  selected?: boolean
  size?: number
}) {
  return (
    <span
      className={cn(
        'relative inline-block shrink-0 rounded-full',
        selected && 'ring-1 ring-[color:var(--color-ink)] ring-offset-2',
      )}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(115deg, ${colors[0]} 0 52%, ${colors[1]} 52% 100%)`,
        boxShadow: 'inset 0 0 0 1px rgb(28 27 24 / 0.16)',
      }}
      aria-hidden="true"
    />
  )
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cn('border-0 border-t border-[color:var(--color-line)]', className)} />
}
