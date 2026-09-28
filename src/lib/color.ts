/**
 * Small colour helpers used by the product illustration.
 *
 * Contour lines are derived from each colourway rather than stored, so adding
 * a colourway stays a four-line change and no edge is ever a hardcoded grey
 * sitting on top of a warm palette.
 */

const clamp = (n: number) => Math.min(255, Math.max(0, Math.round(n)))

const parse = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ]
}

const toHex = (rgb: [number, number, number]) =>
  `#${rgb.map((v) => clamp(v).toString(16).padStart(2, '0')).join('')}`

/** Mix `hex` toward `target` by `amount` (0–1). */
export function mix(hex: string, target: string, amount: number) {
  const a = parse(hex)
  const b = parse(target)
  return toHex([
    a[0] + (b[0] - a[0]) * amount,
    a[1] + (b[1] - a[1]) * amount,
    a[2] + (b[2] - a[2]) * amount,
  ])
}

/** Toward warm charcoal, never toward pure black — the palette stays warm. */
export const darken = (hex: string, amount: number) => mix(hex, '#181613', amount)

export const lighten = (hex: string, amount: number) => mix(hex, '#fffdf8', amount)

/**
 * A contour that works on both a pale and a near-black colourway: pale parts
 * get a darker edge, dark parts get a lighter one.
 */
export function contour(hex: string, strength = 0.26) {
  const [r, g, b] = parse(hex)
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  return luminance > 0.42 ? darken(hex, strength) : lighten(hex, strength * 0.9)
}
