import { useId, useMemo } from 'react'
import { cn } from '@/lib/cn'
import { contour, darken, lighten } from '@/lib/color'
import type { ShoeParts, ShoeShape } from '@/data/types'
import { ShoeDefs, textureFor } from './shoeShading'
import {
  BRAND_ARC,
  EYELETS,
  FLASH_LINES,
  GROUND,
  KNIT_LINES,
  LACE_BARS,
  MIDFOOT_SEAM,
  MUDGUARD,
  PANEL_EYESTAY,
  PANEL_QUARTER,
  PANEL_TOE,
  PERFORATIONS,
  SOLE_FLEX,
  SOLE_FOREFOOT_POD,
  SOLE_HEEL_POD,
  SOLE_HEEL_TREAD,
  SEAM_EYESTAY_BOTTOM,
  SEAM_EYESTAY_TOP,
  SOLE_SHANK,
  TOE_SEAM,
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
  makeFarUpper,
  makeOpening,
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

/** Which views are drawn in plan, and which stay flat lateral. */
const PLAN_VIEWS: ShoeView[] = ['top', 'sole']
const FLAT_VIEWS: ShoeView[] = ['profile']

export function ShoeVisual({
  parts,
  shape,
  view = 'hero',
  flip = false,
  shadow = true,
  className,
  label,
}: ShoeVisualProps) {
  const uid = useId().replace(/:/g, '')
  const id = (name: string) => `${name}-${uid}`

  const sole = useMemo(() => makeSole(shape), [shape])
  const upper = useMemo(() => makeUpper(shape, sole.lastingReversed), [shape, sole.lastingReversed])

  /** The far side, foreshortened by the width of the last at each point. */
  const farUpper = useMemo(() => makeFarUpper(shape, sole.lasting), [shape, sole.lasting])

  /** The opening, the tongue inside it and the lacing across it. */
  const opening = useMemo(() => makeOpening(shape.collar), [shape.collar])

  /**
   * Contours are derived, not stored. A bone upper on a stone bed is only
   * two steps apart in luminance, so without an edge the product dissolves
   * into its own backdrop.
   */
  const edge = useMemo(
    () => ({
      upper: contour(parts.upper, 0.34),
      upperTop: contour(parts.upper, 0.24),
      midsole: contour(parts.midsole, 0.28),
      overlay: contour(parts.overlay, 0.22),
      rim: lighten(parts.upper, 0.55),
      opening: darken(parts.collar, 0.55),
      seam: darken(parts.upperShade, 0.22),
    }),
    [parts.upper, parts.upperShade, parts.midsole, parts.overlay, parts.collar],
  )

  const texture = textureFor(shape.material)
  const isPlan = PLAN_VIEWS.includes(view)
  const isFlat = FLAT_VIEWS.includes(view)
  const threeQ = !isPlan && !isFlat

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
        <ShoeDefs id={id} parts={parts} />
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
            <TopView parts={parts} shape={shape} edge={edge} id={id} texture={texture} />
          ) : (
            <SoleView parts={parts} edge={edge} id={id} />
          )
        ) : (
          <g transform={`translate(0 ${sole.dy})`}>
            {/* ============================================== the far side
                The whole silhouette drawn once more, offset. Its exposed
                crescent IS the top surface of the shoe — no second geometry
                to keep in sync with the first. */}
            {threeQ && (
              <g>
                <path
                  d={sole.midsoleFar}
                  fill={`url(#${id('midTop')})`}
                  stroke={edge.midsole}
                  strokeWidth="1.5"
                />
                <path
                  d={farUpper}
                  fill={`url(#${id('upperTop')})`}
                  stroke={edge.upperTop}
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d={farUpper}
                  fill={`url(#${id(texture.pattern)})`}
                  opacity={texture.opacity * 0.45}
                />
                <path d={farUpper} fill={`url(#${id('specUpper')})`} />
              </g>
            )}

            {/* ========================================= the collar opening */}
            {threeQ && (
              <g transform={opening.transform}>
                <ellipse
                  cx={opening.cx}
                  cy={opening.cy}
                  rx={opening.rx}
                  ry={opening.ry}
                  fill={edge.opening}
                />
                {/* The lining you see on the near wall of the opening. */}
                <ellipse
                  cx={opening.cx}
                  cy={opening.cy}
                  rx={opening.rx}
                  ry={opening.ry}
                  fill="none"
                  stroke={parts.collar}
                  strokeWidth="7"
                  opacity="0.9"
                />
                <ellipse
                  cx={opening.tongue.cx}
                  cy={opening.tongue.cy}
                  rx={opening.tongue.rx}
                  ry={opening.tongue.ry}
                  fill={`url(#${id('overlaySide')})`}
                  stroke={edge.overlay}
                  strokeWidth="1.2"
                />
              </g>
            )}

            {shape.lacing === 'laced' && threeQ && (
              <g>
                {opening.bars.map((d, i) => (
                  <path
                    key={i}
                    d={d}
                    stroke={parts.laces}
                    strokeWidth="6.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                ))}
                {opening.eyelets.map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="2.6" fill={parts.eyelet} />
                ))}
              </g>
            )}

            {/* ================================================== sole unit */}
            <path
              d={sole.midsole}
              fill={`url(#${id('midSide')})`}
              stroke={edge.midsole}
              strokeWidth="1.6"
            />
            <path d={sole.midsole} fill={`url(#${id('foam')})`} opacity="0.5" />
            <g clipPath={`url(#${id('soleClip')})`}>
              <path
                d={sole.sidewall}
                fill="none"
                stroke={parts.midsoleShade}
                strokeWidth="2"
                opacity="0.65"
              />
              {sole.flexGrooves.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke={parts.midsoleShade}
                  strokeWidth="3"
                  opacity="0.6"
                />
              ))}
            </g>
            {/* The shadow the upper's overhang casts down the sidewall. */}
            <path d={sole.midsole} fill={`url(#${id('occUp')})`} />
            <path d={sole.midsole} fill={`url(#${id('specMid')})`} />

            {sole.lugs.map((d, i) => (
              <path key={i} d={d} fill={darken(parts.outsole, 0.12)} />
            ))}
            <path d={sole.outsole} fill={`url(#${id('outsoleSide')})`} />
            <path d={sole.outsole} fill={`url(#${id('rubber')})`} opacity="0.55" />
            <g clipPath={`url(#${id('outsoleClip')})`}>
              {sole.tread.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  stroke={lighten(parts.outsole, 0.3)}
                  strokeWidth="4"
                  opacity="0.22"
                  strokeLinecap="round"
                />
              ))}
            </g>

            {/* ====================================================== upper */}
            <path
              d={upper}
              fill={`url(#${id('upperSide')})`}
              stroke={edge.upper}
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path d={upper} fill={`url(#${id(texture.pattern)})`} opacity={texture.opacity} />

            <g clipPath={`url(#${id('upperClip')})`}>
              {/* Panels first: the tone breaks that make it read as cut and
                  stitched rather than moulded in one piece. */}
              <path d={PANEL_QUARTER} fill={darken(parts.upper, 0.05)} />
              <path d={PANEL_TOE} fill={lighten(parts.upper, 0.06)} />
              <path d={PANEL_EYESTAY} fill={darken(parts.upper, 0.08)} />
              <path
                d={SEAM_EYESTAY_TOP}
                fill="none"
                stroke={edge.seam}
                strokeWidth="2"
                opacity="0.55"
              />
              <path
                d={SEAM_EYESTAY_BOTTOM}
                fill="none"
                stroke={edge.seam}
                strokeWidth="2"
                opacity="0.55"
              />

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
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r="3"
                    fill={darken(parts.upperShade, 0.32)}
                    opacity="0.7"
                  />
                ))}

              {shape.mudguard && (
                <path
                  d={MUDGUARD}
                  fill={parts.overlay}
                  stroke={edge.overlay}
                  strokeWidth="1.4"
                  opacity="0.92"
                />
              )}

              <path
                d={TOE_SEAM}
                fill="none"
                stroke={edge.seam}
                strokeWidth="2.2"
                opacity="0.7"
              />
              <path
                d={MIDFOOT_SEAM}
                fill="none"
                stroke={edge.seam}
                strokeWidth="2.2"
                opacity="0.6"
              />

              {shape.lacing === 'slip' &&
                KNIT_LINES.map((d, i) => (
                  <path
                    key={i}
                    d={d}
                    fill="none"
                    stroke={edge.seam}
                    strokeWidth="3"
                    opacity="0.55"
                  />
                ))}

              {/* The flat view has no opening to look into, so it keeps the
                  lateral eyelet row instead. */}
              {isFlat && shape.lacing === 'laced' && (
                <>
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

              <path
                d={makeCollarRim(shape.collar)}
                fill="none"
                stroke={parts.collar}
                strokeWidth="9"
                strokeLinecap="round"
                opacity={threeQ ? 0.5 : 0.9}
              />

              {shape.heelTab && <path d={makeHeelTab(shape.collar)} fill={parts.accent} />}
            </g>

            {/* -------------------------------------- light and shadow pass */}
            <path d={upper} fill={`url(#${id('occDown')})`} />
            <path d={upper} fill={`url(#${id('occBack')})`} />
            <path d={upper} fill={`url(#${id('specUpper')})`} />

            {/* The binding around the opening — and, in three-quarter, the
                edge the top plane breaks over. */}
            <path
              d={makeTopline(shape.collar)}
              fill="none"
              stroke={edge.seam}
              strokeWidth="2.6"
              strokeLinecap="round"
              opacity="0.85"
            />
          </g>
        )}
      </g>
    </svg>
  )
}

type Edge = {
  upper: string
  upperTop: string
  midsole: string
  overlay: string
  rim: string
  opening: string
  seam: string
}

/* ------------------------------------------------------------------ views */

function TopView({
  parts,
  shape,
  edge,
  id,
  texture,
}: {
  parts: ShoeParts
  shape: ShoeShape
  edge: Edge
  id: (n: string) => string
  texture: { pattern: string; opacity: number }
}) {
  const collarTransform = `rotate(${TOP_COLLAR.rotate} ${TOP_COLLAR.cx} ${TOP_COLLAR.cy})`

  return (
    <g>
      {/* The sole peeking out around the upper. */}
      <g transform="translate(520 240) scale(1.05) translate(-520 -240)">
        <path
          d={TOP_OUTLINE}
          fill={`url(#${id('midSide')})`}
          stroke={edge.midsole}
          strokeWidth="1.6"
        />
      </g>
      <path d={TOP_OUTLINE} fill={`url(#${id('upperTop')})`} stroke={edge.upper} strokeWidth="1.6" />
      <path d={TOP_OUTLINE} fill={`url(#${id(texture.pattern)})`} opacity={texture.opacity} />

      <g clipPath={`url(#${id('planClip')})`}>
        {/* The break between the top plane and the sidewalls. Without it the
            plan view reads as a flat footprint rather than a shoe. */}
        <g transform="translate(525 240) scale(0.93) translate(-525 -240)">
          <path d={TOP_OUTLINE} fill="none" stroke={edge.seam} strokeWidth="2.4" opacity="0.75" />
        </g>

        {TOP_SEAMS.map((d, i) => (
          <path key={i} d={d} fill="none" stroke={edge.seam} strokeWidth="2.6" opacity="0.85" />
        ))}

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
          fill={darken(parts.collar, 0.32)}
          transform={collarTransform}
        />

        <path
          d={TOP_TONGUE}
          fill={darken(parts.overlay, 0.15)}
          stroke={edge.overlay}
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

        <path d={TOP_OUTLINE} fill={`url(#${id('specUpper')})`} />
      </g>
    </g>
  )
}

function SoleView({ parts, edge, id }: { parts: ShoeParts; edge: Edge; id: (n: string) => string }) {
  return (
    <g>
      <g transform="translate(520 240) scale(1.05) translate(-520 -240)">
        <path d={TOP_OUTLINE} fill={parts.midsoleShade} stroke={edge.midsole} strokeWidth="1.6" />
      </g>
      <path
        d={TOP_OUTLINE}
        fill={`url(#${id('midSide')})`}
        stroke={edge.midsole}
        strokeWidth="1.4"
      />
      <path d={TOP_OUTLINE} fill={`url(#${id('foam')})`} opacity="0.5" />

      <g clipPath={`url(#${id('planClip')})`}>
        <path d={SOLE_HEEL_POD} fill={`url(#${id('outsoleSide')})`} />
        <path d={SOLE_FOREFOOT_POD} fill={`url(#${id('outsoleSide')})`} />
        <path d={SOLE_HEEL_POD} fill={`url(#${id('rubber')})`} opacity="0.6" />
        <path d={SOLE_FOREFOOT_POD} fill={`url(#${id('rubber')})`} opacity="0.6" />
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
            <path
              key={i}
              d={d}
              fill="none"
              stroke={lighten(parts.outsole, 0.32)}
              strokeWidth="7"
              opacity="0.4"
            />
          ))}
        </g>

        {SOLE_HEEL_TREAD.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke={lighten(parts.outsole, 0.32)}
            strokeWidth="6"
            opacity="0.3"
            strokeLinecap="round"
          />
        ))}

        <path d={TOP_OUTLINE} fill={`url(#${id('specMid')})`} />
      </g>
    </g>
  )
}
