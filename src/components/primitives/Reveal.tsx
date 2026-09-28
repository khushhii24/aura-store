import { motion, useReducedMotion, type Variants } from 'motion/react'
import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { DURATION, EASE } from '@/lib/motion'

interface RevealProps {
  children: ReactNode
  /** Seconds. Use to stagger siblings by hand where a parent variant is overkill. */
  delay?: number
  /** Travel distance in px. 0 gives a pure fade. */
  y?: number
  as?: ElementType
  className?: string
  /** How much of the element must be on screen before it plays. */
  amount?: number
  once?: boolean
}

/**
 * The single scroll-entrance in the system.
 *
 * Reduced motion drops the travel and keeps the fade, so nothing ever appears
 * out of nowhere and nothing ever slides.
 */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  as = 'div',
  className,
  amount = 0.25,
  once = true,
}: RevealProps) {
  const reduced = useReducedMotion()
  const Component = motion.create(as as ElementType)

  const variants: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : y },
    shown: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? DURATION.ui : DURATION.reveal, ease: EASE, delay },
    },
  }

  return (
    <Component
      initial="hidden"
      whileInView="shown"
      viewport={{ once, amount }}
      variants={variants}
      className={cn(className)}
    >
      {children}
    </Component>
  )
}

/**
 * A display line that rises from behind a mask. Reserved for the two or three
 * biggest headlines on the site — used more often it becomes a tic.
 */
export function MaskLine({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reduced = useReducedMotion()

  if (reduced) {
    return (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: DURATION.ui, delay }}
        className={cn('block', className)}
      >
        {children}
      </motion.span>
    )
  }

  return (
    <span className={cn('block overflow-hidden', className)}>
      <motion.span
        className="block"
        initial={{ y: '108%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 0.92, ease: [0.22, 1, 0.36, 1], delay }}
      >
        {children}
      </motion.span>
    </span>
  )
}
