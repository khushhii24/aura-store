import { useId, useMemo } from 'react'
import { motion } from 'motion/react'
import { contour } from '@/lib/color'
import type { ShoeParts, ShoeShape } from '@/data/types'
import {
  BRAND_ARC,
  EYELETS,
  LACE_BARS,
  makeCollarRim,
  makeHeelCounter,
  makeSole,
  makeTopline,
  makeUpper,
} from './shoeGeometry'

interface ExplodedShoeProps {
  parts: ShoeParts
  shape: ShoeShape
  /** 0 = assembled, 1 = fully separated. Driven by scroll. */
  progress: number
  /** Index 0-3, or null. Dims the other three. */
  active: number | null
}

const SEPARATION = 62

/**
 * The same geometry engine, cut into its four construction layers.
 *
 * This is the payoff for drawing the product rather than photographing it:
 * no photograph can be taken apart, and a stock "exploded shoe" render would
 * not match the shoe on the rest of the site.
 */
export function ExplodedShoe({ parts, shape, progress, active }: ExplodedShoeProps) {
  const uid = useId().replace(/:/g, '')
  const id = (n: string) => `${n}-${uid}`
  const sole = useMemo(() => makeSole(shape.stack), [shape.stack])
  const upper = useMemo(
    () => makeUpper(shape.collar, sole.lastingReversed),
    [shape.collar, sole.lastingReversed],
  )
  const edge = useMemo(
    () => ({
      upper: contour(parts.upper, 0.3),
      midsole: contour(parts.midsole, 0.26),
      overlay: contour(parts.overlay, 0.22),
    }),
    [parts.upper, parts.midsole, parts.overlay],
  )

  /** Layers lift by their index so the stack opens from the ground up. */
  const lift = (index: number) => -(3 - index) * SEPARATION * progress
  const dim = (index: number) => (active === null || active === index ? 1 : 0.3)

  /**
   * Opening the stack moves its centre of mass upward, so the whole group
   * slides down by half the travel and the composition stays centred at
   * both ends of the scroll.
   */
  const recentre = (SEPARATION * 3 * progress) / 2

  return (
    <svg
      viewBox="22 -8 1000 584"
      className="shoe-svg h-full w-full"
      role="img"
      aria-label="AURA construction, four layers: upper, cushioning, midsole and outsole"
    >
      <defs>
        <linearGradient id={id('upper')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={parts.upper} />
          <stop offset="56%" stopColor={parts.upper} />
          <stop offset="100%" stopColor={parts.upperShade} />
        </linearGradient>
        <linearGradient id={id('mid')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={parts.midsole} />
          <stop offset="100%" stopColor={parts.midsoleShade} />
        </linearGradient>
        <clipPath id={id('upperClip')}>
          <path d={upper} />
        </clipPath>
      </defs>

      <g transform={`translate(0 ${sole.dy + recentre})`}>
        {/* 04 — outsole */}
        <motion.g animate={{ y: lift(3), opacity: dim(3) }} transition={{ duration: 0 }}>
          <path d={sole.layerOutsole} fill={parts.outsole} />
          {sole.tread.map((d, i) => (
            <path
              key={i}
              d={d}
              stroke={parts.midsole}
              strokeWidth="5"
              opacity="0.16"
              strokeLinecap="round"
            />
          ))}
        </motion.g>

        {/* 03 — midsole */}
        <motion.g animate={{ y: lift(2), opacity: dim(2) }} transition={{ duration: 0 }}>
          <path
            d={sole.layerMidsole}
            fill={`url(#${id('mid')})`}
            stroke={edge.midsole}
            strokeWidth="1.6"
          />
          <path
            d={sole.sidewall}
            fill="none"
            stroke={parts.midsoleShade}
            strokeWidth="2"
            opacity="0.6"
          />
        </motion.g>

        {/* 02 — cushioning */}
        <motion.g animate={{ y: lift(1), opacity: dim(1) }} transition={{ duration: 0 }}>
          <path
            d={sole.layerCushion}
            fill={parts.overlay}
            stroke={edge.overlay}
            strokeWidth="1.5"
          />
        </motion.g>

        {/* 01 — upper */}
        <motion.g animate={{ y: lift(0), opacity: dim(0) }} transition={{ duration: 0 }}>
          <path
            d={upper}
            fill={`url(#${id('upper')})`}
            stroke={edge.upper}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <g clipPath={`url(#${id('upperClip')})`}>
            <path d={makeHeelCounter(shape.collar)} fill={parts.overlay} opacity="0.34" />
            {shape.overlay !== 'none' && <path d={BRAND_ARC} fill={parts.accent} opacity="0.95" />}
            <path
              d={makeCollarRim(shape.collar)}
              fill="none"
              stroke={parts.collar}
              strokeWidth="9"
              strokeLinecap="round"
              opacity="0.9"
            />
            {LACE_BARS.map((d, i) => (
              <path
                key={i}
                d={d}
                stroke={parts.laces}
                strokeWidth="7.5"
                strokeLinecap="round"
                fill="none"
              />
            ))}
            {EYELETS.map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="2.6" fill={parts.eyelet} />
            ))}
          </g>
          <path
            d={makeTopline(shape.collar)}
            fill="none"
            stroke={edge.upper}
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.85"
          />
        </motion.g>
      </g>
    </svg>
  )
}
