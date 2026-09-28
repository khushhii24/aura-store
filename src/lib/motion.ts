import type { Transition, Variants } from 'motion/react'

/**
 * AURA motion.
 *
 * One curve family, four durations. Everything on the site uses a value from
 * this file — inconsistent entrance timing is the loudest "assembled from
 * templates" tell there is.
 *
 * Elegant -> subtle -> fast -> purposeful. Nothing here runs longer than 700ms.
 */

export const EASE = [0.16, 1, 0.3, 1] as const
export const EASE_EDITORIAL = [0.22, 1, 0.36, 1] as const

export const DURATION = {
  micro: 0.16,
  ui: 0.28,
  reveal: 0.52,
  image: 0.7,
} as const

/** Drawers and modals: a spring, so the weight feels physical, not timed. */
export const DRAWER_SPRING: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 40,
  mass: 0.9,
}

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.reveal, ease: EASE },
  },
}

/** Reduced motion keeps every state reachable, but removes the travel. */
export const revealVariantsReduced: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: DURATION.ui } },
}

export const staggerParent = (stagger = 0.06, delay = 0): Variants => ({
  hidden: {},
  shown: { transition: { staggerChildren: stagger, delayChildren: delay } },
})

/** The hero wordmark rises a line at a time from behind a mask. */
export const maskLineVariants: Variants = {
  hidden: { y: '106%' },
  shown: {
    y: '0%',
    transition: { duration: 0.9, ease: EASE_EDITORIAL },
  },
}

export const overlayFade: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: DURATION.ui, ease: EASE } },
  exit: { opacity: 0, transition: { duration: DURATION.micro, ease: EASE } },
}
