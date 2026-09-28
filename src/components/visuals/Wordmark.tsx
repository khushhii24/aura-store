import { cn } from '@/lib/cn'

/**
 * The wordmark. Tracked-out grotesque caps with the trailing letter-space
 * optically cancelled, so it centres correctly against anything.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('t-wordmark', className)} aria-hidden="true">
      Aura
    </span>
  )
}

/** The arc mark — the only piece of graphic identity besides the wordmark. */
export function ArcMark({ className, size = 18 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn('shrink-0', className)}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M3 19 L12 5 L21 19"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
      />
      <path d="M7.4 13.2 H16.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  )
}
