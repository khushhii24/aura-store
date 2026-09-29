import { useId, useMemo } from 'react'
import { cn } from '@/lib/cn'
import { contour, darken } from '@/lib/color'
import type { ShoeParts, ShoeShape } from '@/data/types'
import {
  BRAND_ARC,
  EYELETS,
  FLASH_LINES,
  GROUND,
  KNIT_LINES,
  LACE_BARS,
  MIDFOOT_SEAM,
  PERFORATIONS,
  SOLE_FLEX,
  SOLE_FOREFOOT_POD,
  SOLE_HEEL_POD,
  SOLE_HEEL_TREAD,
  SOLE_SHANK,
  TOE_SEAM,
  TONGUE,
  TOP_ACCENT,
  TOP_COLLAR,
  TOP_EYELETS,
  TOP_LACE_BARS,
  TOP_OUTLINE,
  TOP_SEAMS,
  TOP_TONGUE,
  VIEW_BOX,
  makeCollarRim,
  makeHeelCounter,
  makeHeelTab,
  makeSole,
  makeTopline,
  makeUpper,
  type ShoeView,
} from './shoeGeometry'

interface ShoeVisualProps {
  parts: ShoeParts
  shape: ShoeShape
  view?: ShoeView
  /** Mirrors the shoe. Used to break the rhythm across a grid. */
  flip?: boolean
  shadow?: boolean
  className?: string
  /** Accessible description. Pass `null` for decorative instances. */
  label?: string | null
}

export function ShoeVisual({
  parts,
  shape,
  view = 'profile',
  flip = false,
  shadow = true,
  className,
  label,
}: ShoeVisualProps) {
  const uid = useId().replace(/:/g, '')
  const sole = useMemo(() => makeSole(shape.stack), [shape.stack])
  const upper = useMemo(
    () => makeUpper(shape.collar, sole.lastingReversed),
    [shape.collar, sole.lastingReversed],
  )

  /**
   * Contours are derived, not stored. A bone upper on a stone bed is only
   * two steps apart in luminance, so without an edge the product dissolves
   * into its own backdrop — the single biggest tell of a drawn shoe.
   */
  const edge = useMemo(
    () => ({
      upper: contour(parts.upper, 0.3),
      midsole: contour(parts.midsole, 0.26),
      overlay: contour(parts.overlay, 0.22),
      tongue: contour(parts.overlay, 0.3),
    }),
    [parts.upper, parts.midsole, parts.overlay],
  )

  const id = (name: string) => `${name}-${uid}`
  const isPlan = view === 'top' || view === 'sole'

  return (
    <svg
      viewBox={VIEW_BOX[view]}
      /* Intrinsic aspect, not h-full: the hero and the final CTA position
         the shoe in an absolutely-placed box that has a width but no height,
         where an h-full SVG collapses to nothing. */
      className={cn('shoe-svg h-auto w-full', className)}
      role={label === null ? 'presentation' : 'img'}
      aria-hidden={label === null || undefined}
      aria-label={label ?? undefined}
      focusable="false"
    >
      <defs>
        <linearGradient id={id('upper')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={parts.upper} />
          <stop offset="52%" stopColor={parts.upper} />
          <stop offset="100%" stopColor={parts.upperShade} />
        </linearGradient>
        <linearGradient id={id('mid')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={parts.midsole} />
          <stop offset="46%" stopColor={parts.midsole} />
          <stop offset="100%" stopColor={parts.midsoleShade} />
        </linearGradient>
        <filter id={id('blur')} x="-40%" y="-500%" width="180%" height="1100%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
        <filter id={id('blurTight')} x="-40%" y="-800%" width="180%" height="1700%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <clipPath id={id('upperClip')}>
          <path d={upper} />
        </clipPath>
        <clipPath id={id('soleClip')}>
          <path d={sole.midsole} />
        </clipPath>
        <clipPath id={id('outsoleClip')}>
          <path d={sole.outsole} />
        </clipPath>
        <clipPath id={id('planClip')}>
          <path d={TOP_OUTLINE} />
        </clipPath>
        <clipPath id={id('forefootClip')}>
          <path d={SOLE_FOREFOOT_POD} />
        </clipPath>
      </defs>

      <g transform={flip ? 'translate(1044 0) scale(-1 1)' : undefined}>
        {shadow && !isPlan && (
          <g>
            <ellipse
              cx="520"
              cy={GROUND + 11}
              rx="386"
              ry="15"
              fill="#2a251d"
              opacity="0.26"
              filter={`url(#${id('blur')})`}
            />
            <ellipse
              cx="524"
              cy={GROUND + 4}
              rx="300"
              ry="5"
              fill="#221d16"
              opacity="0.5"
              filter={`url(#${id('blurTight')})`}
            />
          </g>
        )}

        {isPlan ? (
          view === 'top' ? (
            <TopView parts={parts} shape={shape} edge={edge} id={id} />
          ) : (
            <SoleView parts={parts} edge={edge} id={id} />
          )
        ) : (
          <g transform={`translate(0 ${sole.dy})`}>
            {/* ------------------------------------------------ sole unit */}
            <path
              d={sole.midsole}
              fill={`url(#${id('mid')})`}
              stroke={edge.midsole}
              strokeWidth="1.6"
            />
            <g clipPath={`url(#${id('soleClip')})`}>
              <path
                d={sole.sidewall}
                fill="none"
                stroke={parts.midsoleShade}
                strokeWidth="2"
                opacity="0.7"
              />
              {sole.flexGrooves.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke={parts.midsoleShade}
                  strokeWidth="3"
                  opacity="0.65"
                />
              ))}
            </g>

            <path d={sole.outsole} fill={parts.outsole} />
            <g clipPath={`url(#${id('outsoleClip')})`}>
              {sole.tread.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  stroke={parts.midsole}
                  strokeWidth="4"
                  opacity="0.14"
                  strokeLinecap="round"
                />
              ))}
            </g>

            {/* ---------------------------------------------------- upper */}
            <path
              d={upper}
              fill={`url(#${id('upper')})`}
              stroke={edge.upper}
              strokeWidth="1.6"
              strokeLinejoin="round"
            />

            <g clipPath={`url(#${id('upperClip')})`}>
              <path
                d={makeHeelCounter(shape.collar)}
                fill={parts.overlay}
                stroke={edge.overlay}
                strokeWidth="1.1"
                opacity="0.34"
              />

              {shape.overlay === 'arc' && <path d={BRAND_ARC} fill={parts.accent} opacity="0.95" />}

              {shape.overlay === 'flash' &&
                FLASH_LINES.map((d, i) => (
                  <path
                    key={i}
                    d={d}
                    fill="none"
                    stroke={parts.accent}
                    strokeWidth={i === 0 ? 7 : 4}
                    strokeLinecap="round"
                    opacity={i === 0 ? 0.95 : 0.5}
                  />
                ))}

              {shape.perforated &&
                PERFORATIONS.map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="3" fill={parts.upperShade} opacity="0.9" />
                ))}

              <path
                d={TOE_SEAM}
                fill="none"
                stroke={parts.upperShade}
                strokeWidth="2.2"
                opacity="0.8"
              />
              <path
                d={MIDFOOT_SEAM}
                fill="none"
                stroke={parts.upperShade}
                strokeWidth="2.2"
                opacity="0.7"
              />

              {shape.lacing === 'slip' &&
                KNIT_LINES.map((d, i) => (
                  <path
                    key={i}
                    d={d}
                    fill="none"
                    stroke={parts.upperShade}
                    strokeWidth="3"
                    opacity="0.7"
                  />
                ))}

              {/* The lining visible inside the collar opening. */}
              <path
                d={makeCollarRim(shape.collar)}
                fill="none"
                stroke={parts.collar}
                strokeWidth="9"
                strokeLinecap="round"
                opacity="0.9"
              />

              {shape.lacing === 'laced' && (
                <>
                  <path d={TONGUE} fill={parts.overlay} opacity="0.4" />
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
                </>
              )}

              {shape.heelTab && <path d={makeHeelTab(shape.collar)} fill={parts.accent} />}
            </g>

            {/* The topline — the binding around the collar opening. It does
                the job the padded band used to, without reading as a strap. */}
            <path
              d={makeTopline(shape.collar)}
              fill="none"
              stroke={darken(parts.upperShade, 0.16)}
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.9"
            />
          </g>
        )}
      </g>
    </svg>
  )
}

type Edge = { upper: string; midsole: string; overlay: string; tongue: string }

/* ------------------------------------------------------------------ views */

function TopView({
  parts,
  shape,
  edge,
  id,
}: {
  parts: ShoeParts
  shape: ShoeShape
  edge: Edge
  id: (n: string) => string
}) {
  const collarTransform = `rotate(${TOP_COLLAR.rotate} ${TOP_COLLAR.cx} ${TOP_COLLAR.cy})`

  return (
    <g>
      {/* The sole peeking out around the upper. */}
      <g transform="translate(520 240) scale(1.05) translate(-520 -240)">
        <path d={TOP_OUTLINE} fill={parts.midsole} stroke={edge.midsole} strokeWidth="1.6" />
      </g>
      <path d={TOP_OUTLINE} fill={`url(#${id('upper')})`} stroke={edge.upper} strokeWidth="1.6" />

      <g clipPath={`url(#${id('planClip')})`}>
        {/* The break between the top plane and the sidewalls. Without it the
            plan view reads as a flat footprint rather than a shoe. */}
        <g transform="translate(525 240) scale(0.93) translate(-525 -240)">
          <path
            d={TOP_OUTLINE}
            fill="none"
            stroke={parts.upperShade}
            strokeWidth="2.4"
            opacity="0.75"
          />
        </g>

        {TOP_SEAMS.map((d, i) => (
          <path key={i} d={d} fill="none" stroke={parts.upperShade} strokeWidth="2.6" opacity="0.9" />
        ))}

        {/* The opening, with the lining visible inside it. */}
        <ellipse
          cx={TOP_COLLAR.cx}
          cy={TOP_COLLAR.cy}
          rx={TOP_COLLAR.rx}
          ry={TOP_COLLAR.ry}
          fill={parts.collar}
          stroke={edge.overlay}
          strokeWidth="1.5"
          transform={collarTransform}
        />
        {/* Darker inside the opening, so it reads as depth rather than a disc. */}
        <ellipse
          cx={TOP_COLLAR.cx}
          cy={TOP_COLLAR.cy}
          rx={TOP_COLLAR.rx - 11}
          ry={TOP_COLLAR.ry - 11}
          fill={darken(parts.collar, 0.2)}
          transform={collarTransform}
        />

        <path
          d={TOP_TONGUE}
          fill={darken(parts.overlay, 0.15)}
          stroke={edge.tongue}
          strokeWidth="1.6"
        />

        {shape.lacing === 'laced' && (
          <>
            {TOP_LACE_BARS.map((d, i) => (
              <path
                key={i}
                d={d}
                stroke={parts.laces}
                strokeWidth="6.5"
                strokeLinecap="round"
                fill="none"
              />
            ))}
            {TOP_EYELETS.map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="3" fill={parts.eyelet} />
            ))}
          </>
        )}

        {shape.overlay !== 'none' && (
          <path
            d={TOP_ACCENT}
            fill="none"
            stroke={parts.accent}
            strokeWidth="7"
            strokeLinecap="round"
          />
        )}
      </g>
    </g>
  )
}

function SoleView({ parts, edge, id }: { parts: ShoeParts; edge: Edge; id: (n: string) => string }) {
  return (
    <g>
      <g transform="translate(518 240) scale(1.045) translate(-518 -240)">
        <path d={TOP_OUTLINE} fill={parts.midsoleShade} stroke={edge.midsole} strokeWidth="1.6" />
      </g>
      <path d={TOP_OUTLINE} fill={parts.midsole} stroke={edge.midsole} strokeWidth="1.4" />

      <g clipPath={`url(#${id('planClip')})`}>
        <path d={SOLE_HEEL_POD} fill={parts.outsole} />
        <path d={SOLE_FOREFOOT_POD} fill={parts.outsole} />
        <path d={SOLE_SHANK} fill={parts.midsoleShade} />
        <path
          d="M408 226 C448 220 492 220 524 226"
          fill="none"
          stroke={parts.accent}
          strokeWidth="7"
          strokeLinecap="round"
        />

        <g clipPath={`url(#${id('forefootClip')})`}>
          {SOLE_FLEX.map((d, i) => (
            <path key={i} d={d} fill="none" stroke={parts.midsole} strokeWidth="7" opacity="0.32" />
          ))}
        </g>

        {SOLE_HEEL_TREAD.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke={parts.midsole}
            strokeWidth="6"
            opacity="0.22"
            strokeLinecap="round"
          />
        ))}
      </g>
    </g>
  )
}
