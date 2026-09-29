import { darken, lighten } from '@/lib/color'
import type { ShoeParts } from '@/data/types'

/**
 * The shading system.
 *
 * A flat fill with one gradient is what made the first version of this shoe
 * look like clip art. Real product photography gives you four things a flat
 * vector does not, and every one of them is reproducible with gradients and
 * patterns — no filters, so twenty of these can sit on a grid page:
 *
 *   form shading   the surface turns away from the light
 *   occlusion      it goes dark where two parts meet
 *   specular       a soft highlight where the surface faces the key light
 *   texture        knit, foam and rubber are not smooth
 *
 * Every value is derived from the colourway, so a new colourway is still a
 * four-line change and the whole system repaints live.
 */

export type Ids = (name: string) => string

/** Light comes from above and slightly in front of the shoe. */
const KEY = { x: 0.66, y: 0.16 }

export function ShoeDefs({ id, parts }: { id: Ids; parts: ShoeParts }) {
  return (
    <>
      {/* ------------------------------------------------- form shading */}
      <linearGradient id={id('upperSide')} x1="0" y1="0" x2="0.12" y2="1">
        <stop offset="0%" stopColor={lighten(parts.upper, 0.12)} />
        <stop offset="34%" stopColor={parts.upper} />
        <stop offset="82%" stopColor={parts.upperShade} />
        <stop offset="100%" stopColor={darken(parts.upperShade, 0.1)} />
      </linearGradient>

      {/* The top plane faces the light, so it is the lightest surface. */}
      <linearGradient id={id('upperTop')} x1="0.1" y1="0" x2="0.9" y2="1">
        <stop offset="0%" stopColor={lighten(parts.upper, 0.2)} />
        <stop offset="60%" stopColor={lighten(parts.upper, 0.09)} />
        <stop offset="100%" stopColor={parts.upper} />
      </linearGradient>

      <linearGradient id={id('midSide')} x1="0" y1="0" x2="0.08" y2="1">
        <stop offset="0%" stopColor={lighten(parts.midsole, 0.14)} />
        <stop offset="40%" stopColor={parts.midsole} />
        <stop offset="88%" stopColor={parts.midsoleShade} />
        <stop offset="100%" stopColor={darken(parts.midsoleShade, 0.12)} />
      </linearGradient>

      <linearGradient id={id('midTop')} x1="0.1" y1="0" x2="0.9" y2="1">
        <stop offset="0%" stopColor={lighten(parts.midsole, 0.2)} />
        <stop offset="100%" stopColor={lighten(parts.midsole, 0.05)} />
      </linearGradient>

      <linearGradient id={id('outsoleSide')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={lighten(parts.outsole, 0.18)} />
        <stop offset="45%" stopColor={parts.outsole} />
        <stop offset="100%" stopColor={darken(parts.outsole, 0.22)} />
      </linearGradient>

      <linearGradient id={id('overlaySide')} x1="0" y1="0" x2="0.1" y2="1">
        <stop offset="0%" stopColor={lighten(parts.overlay, 0.1)} />
        <stop offset="70%" stopColor={parts.overlay} />
        <stop offset="100%" stopColor={darken(parts.overlay, 0.14)} />
      </linearGradient>

      {/* --------------------------------------------------- occlusion */}
      {/* Where the upper sits down onto the sole. */}
      <linearGradient id={id('occDown')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#12100c" stopOpacity="0" />
        <stop offset="58%" stopColor="#12100c" stopOpacity="0" />
        <stop offset="88%" stopColor="#12100c" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#12100c" stopOpacity="0.42" />
      </linearGradient>

      {/* The shadow the upper casts onto the midsole beneath its overhang. */}
      <linearGradient id={id('occUp')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#12100c" stopOpacity="0.46" />
        <stop offset="16%" stopColor="#12100c" stopOpacity="0.16" />
        <stop offset="44%" stopColor="#12100c" stopOpacity="0" />
        <stop offset="86%" stopColor="#12100c" stopOpacity="0" />
        <stop offset="100%" stopColor="#12100c" stopOpacity="0.22" />
      </linearGradient>

      {/* The near side turns away from the light as it recedes to the heel. */}
      <linearGradient id={id('occBack')} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#12100c" stopOpacity="0.26" />
        <stop offset="26%" stopColor="#12100c" stopOpacity="0.06" />
        <stop offset="70%" stopColor="#12100c" stopOpacity="0" />
      </linearGradient>

      {/* ---------------------------------------------------- specular */}
      <radialGradient id={id('specUpper')} cx={KEY.x} cy={KEY.y} r="0.46">
        <stop offset="0%" stopColor="#fffdf6" stopOpacity="0.5" />
        <stop offset="55%" stopColor="#fffdf6" stopOpacity="0.14" />
        <stop offset="100%" stopColor="#fffdf6" stopOpacity="0" />
      </radialGradient>

      <radialGradient id={id('specMid')} cx="0.46" cy="0.24" r="0.6">
        <stop offset="0%" stopColor="#fffdf6" stopOpacity="0.42" />
        <stop offset="60%" stopColor="#fffdf6" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#fffdf6" stopOpacity="0" />
      </radialGradient>

      {/* ----------------------------------------------------- texture */}
      {/* Engineered knit: a fine two-direction loop structure. */}
      <pattern
        id={id('knit')}
        width="7"
        height="7"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(12)"
      >
        <path
          d="M0 0 L7 7 M7 0 L0 7"
          stroke={darken(parts.upperShade, 0.3)}
          strokeWidth="0.75"
          opacity="0.5"
          fill="none"
        />
      </pattern>

      {/* Moulded foam: closed cells, not a smooth surface. */}
      <pattern id={id('foam')} width="13" height="13" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="3.5" r="1.15" fill={darken(parts.midsoleShade, 0.26)} opacity="0.42" />
        <circle cx="9.5" cy="8.5" r="0.9" fill={darken(parts.midsoleShade, 0.26)} opacity="0.32" />
        <circle cx="6" cy="11" r="0.65" fill={lighten(parts.midsole, 0.4)} opacity="0.3" />
      </pattern>

      {/* Rubber: a fine directional grain. */}
      <pattern id={id('rubber')} width="6" height="6" patternUnits="userSpaceOnUse">
        <path
          d="M0 3 H6"
          stroke={lighten(parts.outsole, 0.34)}
          strokeWidth="0.7"
          opacity="0.3"
          fill="none"
        />
      </pattern>

      {/* Leather: a tight, quiet grain rather than a weave. */}
      <pattern id={id('grain')} width="5" height="5" patternUnits="userSpaceOnUse">
        <circle cx="1.5" cy="1.5" r="0.5" fill={darken(parts.upperShade, 0.28)} opacity="0.34" />
        <circle cx="3.8" cy="3.6" r="0.4" fill={darken(parts.upperShade, 0.28)} opacity="0.26" />
      </pattern>

      {/* Monofilament mesh: an open structure you can see daylight through. */}
      <pattern id={id('mesh')} width="9" height="9" patternUnits="userSpaceOnUse">
        <circle cx="2.4" cy="2.4" r="1.5" fill={darken(parts.upperShade, 0.34)} opacity="0.4" />
        <circle cx="6.9" cy="6.9" r="1.5" fill={darken(parts.upperShade, 0.34)} opacity="0.4" />
      </pattern>

      {/* Canvas and ripstop: a visible woven grid. */}
      <pattern id={id('canvas')} width="6" height="6" patternUnits="userSpaceOnUse">
        <path
          d="M0 0 H6 M0 0 V6"
          stroke={darken(parts.upperShade, 0.26)}
          strokeWidth="0.7"
          opacity="0.42"
          fill="none"
        />
      </pattern>
    </>
  )
}

/**
 * Which pattern each material wears, and how strongly. Leather is nearly
 * smooth; knit and mesh are the point of the upper and can carry more.
 */
export const textureFor = (
  material: 'knit' | 'mesh' | 'leather' | 'canvas' | 'ripstop',
): { pattern: string; opacity: number } => {
  switch (material) {
    case 'knit':
      return { pattern: 'knit', opacity: 0.5 }
    case 'mesh':
      return { pattern: 'mesh', opacity: 0.42 }
    case 'leather':
      return { pattern: 'grain', opacity: 0.3 }
    case 'canvas':
      return { pattern: 'canvas', opacity: 0.46 }
    case 'ripstop':
    default:
      return { pattern: 'canvas', opacity: 0.3 }
  }
}
