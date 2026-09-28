import type { Colorway, ShoeParts } from './types'

/**
 * Colourways.
 *
 * These are not decorative swatches — every value is piped straight into the
 * SVG shoe, so choosing a colourway repaints the actual product. That is the
 * reason the product imagery is drawn rather than photographed.
 */

const make = (
  id: string,
  name: string,
  family: Colorway['family'],
  swatch: [string, string],
  parts: ShoeParts,
): Colorway => ({ id, name, family, swatch, parts })

export const BONE_VOLT = make('bone-volt', 'Bone / Volt', 'bone', ['#ece7dd', '#c9d64b'], {
  upper: '#ece7dd',
  upperShade: '#d8d0c1',
  overlay: '#dfd7c7',
  collar: '#d4ccbc',
  laces: '#f7f4ee',
  eyelet: '#6f6a60',
  midsole: '#eae5da',
  midsoleShade: '#d5cdbd',
  outsole: '#2a2824',
  accent: '#c9d64b',
})

export const CHARCOAL_STONE = make(
  'charcoal-stone',
  'Charcoal / Stone',
  'charcoal',
  ['#3a3733', '#e7e2d8'],
  {
    upper: '#3a3733',
    upperShade: '#2b2925',
    overlay: '#474339',
    collar: '#2e2c28',
    laces: '#bfb9ae',
    eyelet: '#8e877c',
    midsole: '#e7e2d8',
    midsoleShade: '#d0cabd',
    outsole: '#1a1916',
    accent: '#efebe4',
  },
)

export const SAND_CLAY = make('sand-clay', 'Sand / Clay', 'sand', ['#d7c7ae', '#a4623c'], {
  upper: '#d7c7ae',
  upperShade: '#c0ae94',
  overlay: '#c9b79b',
  collar: '#bfad92',
  laces: '#eadfcd',
  eyelet: '#6b5a46',
  midsole: '#e9e1d3',
  midsoleShade: '#d2c6b2',
  outsole: '#4a3d30',
  accent: '#a4623c',
})

export const INK_SIGNAL = make('ink-signal', 'Ink / Signal', 'black', ['#1e1d1a', '#c9d64b'], {
  upper: '#23221e',
  upperShade: '#161512',
  overlay: '#2e2c27',
  collar: '#191815',
  laces: '#3d3a35',
  eyelet: '#7b7566',
  midsole: '#2a2823',
  midsoleShade: '#1b1a16',
  outsole: '#0c0b0a',
  accent: '#c9d64b',
})

export const SLATE_ASH = make('slate-ash', 'Slate / Ash', 'slate', ['#6e7478', '#e2e2de'], {
  upper: '#6e7478',
  upperShade: '#585d61',
  overlay: '#7c8286',
  collar: '#5c6165',
  laces: '#c3c6c7',
  eyelet: '#41464a',
  midsole: '#e2e2de',
  midsoleShade: '#c9c9c3',
  outsole: '#22262a',
  accent: '#dadedf',
})

export const CHALK_SILVER = make('chalk-silver', 'Chalk / Silver', 'chalk', ['#f2f0ec', '#a9adb2'], {
  upper: '#f2f0ec',
  upperShade: '#ddd9d2',
  overlay: '#e8e5de',
  collar: '#e0dcd4',
  laces: '#ffffff',
  eyelet: '#8a867e',
  midsole: '#f1eee8',
  midsoleShade: '#dcd7cc',
  outsole: '#8e9094',
  accent: '#a9adb2',
})

export const MOSS_BONE = make('moss-bone', 'Moss / Bone', 'moss', ['#4c5347', '#ede8dd'], {
  upper: '#4c5347',
  upperShade: '#3a4036',
  overlay: '#59604f',
  collar: '#3f453b',
  laces: '#cfd3c4',
  eyelet: '#727866',
  midsole: '#e7e0d3',
  midsoleShade: '#cfc7b6',
  outsole: '#23261f',
  accent: '#c9d64b',
})

export const CLAY_INK = make('clay-ink', 'Clay / Ink', 'clay', ['#9c5a42', '#1c1b18'], {
  upper: '#9c5a42',
  upperShade: '#834733',
  overlay: '#aa6750',
  collar: '#874a36',
  laces: '#e4d6c8',
  eyelet: '#5c3626',
  midsole: '#e9e2d5',
  midsoleShade: '#d2c8b8',
  outsole: '#2a211c',
  accent: '#1c1b18',
})

export const STORM_VOLT = make('storm-volt', 'Storm / Volt', 'charcoal', ['#4a4f52', '#c9d64b'], {
  upper: '#4a4f52',
  upperShade: '#383c3f',
  overlay: '#565b5f',
  collar: '#3c4043',
  laces: '#aeb2b3',
  eyelet: '#2c2f32',
  midsole: '#20232a',
  midsoleShade: '#15171c',
  outsole: '#0e0f11',
  accent: '#c9d64b',
})

export const BONE_CLAY = make('bone-clay', 'Bone / Clay', 'bone', ['#e9e2d4', '#a4623c'], {
  upper: '#e9e2d4',
  upperShade: '#d4ccbb',
  overlay: '#ddd4c2',
  collar: '#cec5b2',
  laces: '#f5f0e6',
  eyelet: '#7a6a55',
  midsole: '#ece7db',
  midsoleShade: '#d4cabb',
  outsole: '#a4623c',
  accent: '#a4623c',
})

/** The full palette, used by the colour filter. */
export const ALL_COLORWAYS: Colorway[] = [
  BONE_VOLT,
  CHALK_SILVER,
  SAND_CLAY,
  BONE_CLAY,
  CHARCOAL_STONE,
  STORM_VOLT,
  SLATE_ASH,
  MOSS_BONE,
  CLAY_INK,
  INK_SIGNAL,
]
