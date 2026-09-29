/**
 * AURA — parametric footwear geometry.
 *
 * Every product image on this site is generated from the numbers below rather
 * than photographed. Two reasons:
 *
 *  1. Selecting a colourway repaints the actual product in real time. A stock
 *     photo library cannot do that.
 *  2. Eight models share one silhouette engine, so the range looks like it
 *     came out of one design studio — which is exactly what a real brand
 *     needs its catalogue to look like.
 *
 * Proportions are taken off a real lateral product shot, normalised against
 * shoe length L:
 *
 *   collar top        0.355 L above ground
 *   sole at heel      0.120 L        sole at forefoot   0.085 L
 *   toe box (upper)   0.100 L        throat             0.235 L
 *
 * Getting these wrong is what makes a drawn shoe look like a boat.
 * The shoe faces right, in a 1000 x 480 space.
 */

export type Pt = [number, number]

/** The surface the shoe stands on. Every model is translated to meet it. */
export const GROUND = 424

const r1 = (n: number) => Math.round(n * 10) / 10

/**
 * Catmull-Rom through the given points, emitted as cubic beziers.
 * Closed loops wrap their neighbours, which turns the heel and toe into
 * smooth caps without any special-case path authoring.
 */
export function curveThrough(points: Pt[], closed = false, tension = 1): string {
  const n = points.length
  const at = (i: number): Pt =>
    closed ? points[(i + n) % n] : points[Math.min(Math.max(i, 0), n - 1)]

  let d = `M${r1(points[0][0])} ${r1(points[0][1])}`
  const last = closed ? n : n - 1

  for (let i = 0; i < last; i++) {
    const p0 = at(i - 1)
    const p1 = at(i)
    const p2 = at(i + 1)
    const p3 = at(i + 2)
    const k = tension / 6
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) * k, p1[1] + (p2[1] - p0[1]) * k]
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) * k, p2[1] - (p3[1] - p1[1]) * k]
    d += ` C${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${r1(p2[0])} ${r1(p2[1])}`
  }

  return closed ? `${d} Z` : d
}

/** Drop the leading move command so a curve can be appended to another path. */
const tail = (d: string) => d.replace(/^M[-\d.]+\s[-\d.]+/, '')

/** Offset a weighted point list by the model's collar height. */
const withCollar = (rows: [Pt, number][], collar: number): Pt[] =>
  rows.map(([p, w]) => [p[0], p[1] - collar * w])

/**
 * The lasting line — where the upper meets the sole. Fixed for every model;
 * it is the line that makes the range read as one family.
 */
const LASTING: Pt[] = [
  [150, 322],
  [200, 336],
  [265, 346],
  [345, 355],
  [435, 359],
  [525, 360],
  [615, 358],
  [705, 351],
  [790, 342],
  [850, 334],
  [890, 328],
]

/**
 * Sole thickness under each lasting point at stack = 1, chosen so the ground
 * contour comes out almost flat with a slight rocker and a toe spring — the
 * shape a shoe makes when it is standing still.
 */
const THICKNESS = [96, 92, 84, 76, 72, 70, 70, 72, 70, 64, 54]

/** How far the sole bulges past the upper at a given height through the stack. */
const toeX = (o: number) => 890 + 34 * Math.sin(Math.PI * Math.min(Math.max(o, 0), 1))
const heelX = (o: number) => 150 - 30 * Math.sin(Math.PI * Math.min(Math.max(o, 0), 1))

export function makeSole(stack: number) {
  const yAt = (i: number, offset: number) => LASTING[i][1] + THICKNESS[i] * stack * offset
  const ptsAt = (offset: number): Pt[] => LASTING.map((p, i) => [p[0], yAt(i, offset)])
  const lastIndex = LASTING.length - 1

  /**
   * A closed slice of the sole between two heights. Midsole, outsole and the
   * exploded-view layers are all bands — one function, four uses.
   */
  const band = (from: number, to: number): string => {
    const mid = (from + to) / 2
    const loop: Pt[] = [
      ...ptsAt(from),
      [toeX(mid), (yAt(lastIndex, from) + yAt(lastIndex, to)) / 2],
      ...[...ptsAt(to)].reverse(),
      [heelX(mid), (yAt(0, from) + yAt(0, to)) / 2],
    ]
    return curveThrough(loop, true)
  }

  /** Every model is dropped so its lowest point rests on GROUND. */
  const dy = GROUND - Math.max(...LASTING.map((_, i) => yAt(i, 1)))

  /** Short grooves cut up into the sole from the ground. */
  const flexGrooves = [6, 7, 8].map((i) => {
    const x = LASTING[i][0]
    const y = yAt(i, 0.52)
    const end = yAt(i, 0.98)
    return `M${r1(x)} ${r1(y)} C${r1(x + 5)} ${r1(y + (end - y) * 0.4)} ${r1(x + 5)} ${r1(
      y + (end - y) * 0.75,
    )} ${r1(x)} ${r1(end)}`
  })

  /** Tread ticks along the outsole. */
  const tread: string[] = []
  for (let i = 1; i <= 8; i++) {
    const t = i / 9
    const x = 230 + t * 600
    const idx = Math.min(lastIndex, Math.round(t * lastIndex))
    tread.push(`M${r1(x)} ${r1(yAt(idx, 0.88))} L${r1(x)} ${r1(yAt(idx, 0.99))}`)
  }

  return {
    dy,
    midsole: band(0, 1),
    outsole: band(0.84, 1),
    layerCushion: band(0, 0.22),
    layerMidsole: band(0.22, 0.84),
    layerOutsole: band(0.84, 1),
    sidewall: curveThrough(ptsAt(0.5)),
    flexGrooves,
    tread,
    lastingForward: curveThrough(LASTING),
    lastingReversed: tail(curveThrough([...LASTING].reverse())),
  }
}

/**
 * The upper, as sampled points each carrying a weight saying how much it
 * follows the collar height. `collar` is the single number that separates a
 * court shoe from a trail runner in this system.
 */
const UPPER_POINTS: [Pt, number][] = [
  [[150, 322], 0],
  [[136, 252], 0.3],
  [[176, 183], 0.8],
  [[249, 151], 1],
  [[313, 183], 0.9],
  [[377, 213], 0.66],
  [[405, 221], 0.52],
  [[440, 206], 0.56],
  [[486, 218], 0.34],
  [[538, 224], 0.2],
  [[618, 236], 0.08],
  [[715, 247], 0],
  [[803, 259], 0],
  [[868, 284], 0],
  [[884, 308], 0],
  [[890, 328], 0],
]

export function makeUpper(collar: number, lastingReversed: string) {
  return `${curveThrough(withCollar(UPPER_POINTS, collar), false, 0.9)} ${lastingReversed} Z`
}

/**
 * Two lines describe the collar: the topline is the binding on the edge
 * itself, the lining sits further inside. A single thick padded band was
 * tried first and read as a strap across the heel.
 */
const TOPLINE: [Pt, number][] = [
  [[176, 183], 0.8],
  [[249, 151], 1],
  [[313, 183], 0.9],
  [[377, 213], 0.66],
  [[405, 221], 0.52],
]

export const makeTopline = (collar: number) => curveThrough(withCollar(TOPLINE, collar))

const COLLAR_RIM: [Pt, number][] = [
  [[190, 200], 0.78],
  [[250, 172], 1],
  [[312, 202], 0.88],
  [[372, 231], 0.64],
  [[404, 244], 0.5],
]

export const makeCollarRim = (collar: number) => curveThrough(withCollar(COLLAR_RIM, collar))

/** The stiffened panel around the heel. */
const HEEL_COUNTER: [Pt, number][] = [
  [[154, 326], 0],
  [[136, 256], 0.3],
  [[178, 190], 0.8],
  [[249, 158], 1],
  [[272, 184], 1],
  [[280, 244], 0.6],
  [[278, 300], 0.26],
  [[264, 346], 0],
]

export const makeHeelCounter = (collar: number) =>
  curveThrough(withCollar(HEEL_COUNTER, collar), true)

const HEEL_TAB: [Pt, number][] = [
  [[212, 158], 1],
  [[248, 150], 1],
  [[251, 170], 1],
  [[215, 178], 1],
]

export const makeHeelTab = (collar: number) => curveThrough(withCollar(HEEL_TAB, collar), true, 0.4)

/* ------------------------------------------------------------------ detail */

/**
 * The tongue, sitting under the bump in the silhouette. Clipped to the upper
 * like every other detail — an earlier version drew it proud of the collar
 * and it floated above the shoe.
 */
export const TONGUE =
  'M408 256 C420 236 432 218 444 202 C454 208 462 218 466 228 C452 246 436 266 420 284 Z'

/**
 * Lacing, seen from the side: an eyelet row just inside the topline with
 * short lace segments running up over the eyestay toward the tongue.
 */
export const LACE_BARS = [
  'M310 212 L342 184',
  'M336 226 L368 198',
  'M362 240 L394 212',
  'M388 252 L420 224',
  'M412 262 L444 236',
]

export const EYELETS: Pt[] = [
  [310, 212],
  [336, 226],
  [362, 240],
  [388, 252],
  [412, 262],
]

/** A seam between the eyestay panel and the vamp, so the body is not one
 *  unbroken field from the laces to the toe. */
export const MIDFOOT_SEAM = 'M502 222 C512 262 514 302 506 342'

export const BRAND_ARC =
  'M262 338 C338 333 412 316 472 293 C482 289 489 292 488 300 C487 307 480 310 468 314 C406 336 338 343 266 345 Z'

export const FLASH_LINES = [
  'M250 334 C332 326 418 302 496 272',
  'M254 356 C336 348 422 324 500 294',
]

/** A moulded toe-cap seam. Without it the forefoot reads as one flat panel. */
export const TOE_SEAM = 'M812 272 C836 292 846 316 842 346'

/** Knit contour lines on a slip-on: ribs instead of lacing. */
export const KNIT_LINES = [
  'M292 264 C352 272 424 258 494 234',
  'M306 292 C366 300 438 286 508 262',
  'M320 320 C380 328 452 314 522 290',
]

export const PERFORATIONS: Pt[] = (() => {
  const dots: Pt[] = []
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 3; j++) {
      dots.push([642 + i * 29, 280 + j * 14 + i * 6.5])
    }
  }
  return dots
})()

/* -------------------------------------------------------------- other views */

/**
 * The plan views.
 *
 * The top and outsole share one last outline: widest at the ball, pinched at
 * the waist, and a heel about 60% of the forefoot width. The first version
 * was a lozenge and read as an insole rather than a shoe.
 */
const TOP_POINTS: Pt[] = [
  [905, 240],
  [897, 194],
  [860, 160],
  [804, 143],
  [726, 135],
  [640, 143],
  [560, 158],
  [492, 166],
  [430, 170],
  [366, 169],
  [304, 166],
  [244, 164],
  [192, 180],
  [156, 208],
  [156, 272],
  [192, 300],
  [244, 316],
  [304, 314],
  [366, 307],
  [430, 310],
  [492, 312],
  [560, 322],
  [640, 337],
  [726, 345],
  [804, 337],
  [860, 320],
  [897, 286],
]

export const TOP_OUTLINE = curveThrough(TOP_POINTS, true)

/**
 * The opening is an elongated oval running heel-to-throat, not a circle at
 * the back. The circular version read as a hole punched in an insole.
 */
export const TOP_COLLAR = { cx: 296, cy: 240, rx: 104, ry: 50, rotate: -2 }

export const TOP_TONGUE =
  'M372 214 C440 204 500 210 540 224 C550 230 550 250 540 256 C500 270 440 276 372 266 C362 250 362 230 372 214 Z'

/** Laces cross over the tongue between two eyelet rows set into the quarters. */
export const TOP_LACE_BARS = [0, 1, 2, 3].flatMap((i) => {
  const x = 392 + i * 42
  return [`M${x} 198 L${x + 42} 282`, `M${x} 282 L${x + 42} 198`]
})

export const TOP_EYELETS: Pt[] = [0, 1, 2, 3, 4].flatMap((i) => [
  [392 + i * 42, 198] as Pt,
  [392 + i * 42, 282] as Pt,
])

export const TOP_SEAMS = [
  'M196 204 C232 184 288 182 324 198',
  'M806 150 C842 186 846 296 806 332',
  'M568 240 C650 234 726 234 792 240',
]

/** A lateral overlay following the outer edge of the toe box. */
export const TOP_ACCENT = 'M624 166 C686 154 752 152 806 164'


export const SOLE_HEEL_POD =
  'M182 202 C226 182 302 184 336 206 C352 216 352 266 336 276 C302 298 226 300 182 280 C166 268 166 214 182 202 Z'

export const SOLE_FOREFOOT_POD =
  'M556 172 C664 148 796 150 862 180 C886 191 890 292 862 304 C796 334 664 336 556 312 C542 292 542 192 556 172 Z'

export const SOLE_SHANK =
  'M388 200 C438 192 494 194 528 202 L528 280 C494 288 438 290 388 282 Z'

export const SOLE_FLEX = [636, 700, 764, 826].map(
  (x) => `M${x} 168 C${x + 9} 202 ${x + 9} 282 ${x} 316`,
)

export const SOLE_HEEL_TREAD = [214, 240, 266].map((y) => `M198 ${y} L322 ${y}`)

/* ------------------------------------------------------------------- views */

export type ShoeView = 'profile' | 'detail' | 'heel' | 'toe' | 'top' | 'sole'

/** Each view is a genuine crop or a different geometry — not the same picture twice. */
export const VIEW_BOX: Record<ShoeView, string> = {
  profile: '22 56 1000 424',
  detail: '250 176 400 224',
  heel: '96 104 350 330',
  toe: '596 206 380 230',
  top: '96 96 840 288',
  sole: '96 96 840 288',
}

export const VIEW_LABEL: Record<ShoeView, string> = {
  profile: 'Lateral',
  detail: 'Midfoot',
  heel: 'Heel',
  toe: 'Toe',
  top: 'Top',
  sole: 'Outsole',
}
