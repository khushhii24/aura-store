/**
 * AURA — parametric footwear geometry.
 *
 * Every product image on this site is generated from the numbers below rather
 * than photographed, so selecting a colourway repaints the actual product and
 * the construction section can take the shoe apart into its layers.
 *
 * An earlier version of this file varied only five numbers between models,
 * which made eight products look like one shoe at eight sizes. The range now
 * differs at the silhouette level: sole architecture, toe shape, toe spring,
 * outsole construction and overlays. A court shoe and a max-stack road runner
 * should not share an outline.
 *
 * Proportions come off a real lateral product shot, normalised against shoe
 * length L:
 *
 *   collar top        0.355 L above ground
 *   sole at heel      0.120 L        sole at forefoot   0.085 L
 *   toe box (upper)   0.100 L        throat             0.235 L
 *
 * The shoe faces right, in a 1000 x 480 space.
 */

import type { ShoeShape } from '@/data/types'

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

/* ==========================================================================
   The last
   ========================================================================== */

/**
 * The lasting line — where the upper meets the sole. Shared by every model;
 * it is the one line that keeps the range reading as one family.
 */
const BASE_LASTING: Pt[] = [
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
 * Sole thickness under each lasting point, per architecture. These are what
 * separate a 40mm road slab from a vulcanised court sole at a glance.
 */
const THICKNESS: Record<ShoeShape['soleStyle'], number[]> = {
  /** Everyday trainer: a gentle wedge, thicker at the heel. */
  wedge: [96, 92, 84, 76, 72, 70, 70, 72, 70, 64, 54],
  /** Road runner: taller, and deliberately deepest under the ball. */
  rocker: [104, 100, 92, 84, 80, 80, 84, 90, 90, 80, 60],
  /** Leather and court: a thin cupsole with almost no wedge. */
  cupsole: [70, 68, 65, 62, 60, 58, 58, 58, 56, 52, 44],
  /** Slip-on: an even slab, softer under the heel. */
  slab: [86, 84, 80, 76, 74, 72, 72, 72, 70, 64, 52],
  /** Trail: thick and flat-bottomed, before the lugs are added. */
  lugged: [98, 96, 92, 88, 86, 86, 88, 90, 86, 76, 58],
}

/** How far the toe curls up off the ground. Court shoes sit flat; runners rock. */
const TOE_SPRING: Record<ShoeShape['soleStyle'], number> = {
  wedge: 0,
  rocker: 26,
  cupsole: -8,
  slab: 4,
  lugged: 12,
}

/** How far the sole flares out past the upper. */
const BULGE: Record<ShoeShape['soleStyle'], { toe: number; heel: number }> = {
  wedge: { toe: 34, heel: 30 },
  rocker: { toe: 40, heel: 40 },
  cupsole: { toe: 26, heel: 22 },
  slab: { toe: 32, heel: 28 },
  lugged: { toe: 44, heel: 38 },
}

/** Where the rubber starts up the sidewall. A cupsole wraps halfway up. */
const OUTSOLE_FROM: Record<ShoeShape['outsole'], number> = {
  pods: 0.84,
  full: 0.78,
  gum: 0.5,
  lugs: 0.76,
}

/** The three toe profiles, replacing the forward end of the upper's top edge. */
const TOE_SHAPES: Record<ShoeShape['toe'], Pt[]> = {
  /** Full and rounded — the everyday trainer and the leather sneaker. */
  round: [
    [803, 259],
    [868, 284],
    [884, 308],
  ],
  /** Lower and drawn out — a road runner's toe falls away early. */
  tapered: [
    [790, 268],
    [851, 294],
    [877, 314],
  ],
  /** Square and high — a vulcanised court toe. */
  blunt: [
    [820, 250],
    [878, 266],
    [888, 298],
  ],
}

/** The lift applied to the toe of the last, so the upper follows the sole. */
const toeLift = (style: ShoeShape['soleStyle']) => TOE_SPRING[style]

function lastingFor(shape: ShoeShape): Pt[] {
  const lift = toeLift(shape.soleStyle)
  const weight = [0, 0, 0, 0, 0, 0, 0, 0.12, 0.38, 0.72, 1]
  return BASE_LASTING.map(([x, y], i) => [x, y - lift * weight[i]])
}

/* ==========================================================================
   Sole
   ========================================================================== */

export function makeSole(shape: ShoeShape) {
  const lasting = lastingFor(shape)
  const thickness = THICKNESS[shape.soleStyle]
  const bulge = BULGE[shape.soleStyle]
  const lastIndex = lasting.length - 1

  const toeX = (o: number) =>
    890 + bulge.toe * Math.sin(Math.PI * Math.min(Math.max(o, 0), 1))
  const heelX = (o: number) =>
    150 - bulge.heel * Math.sin(Math.PI * Math.min(Math.max(o, 0), 1))

  const yAt = (i: number, offset: number) => lasting[i][1] + thickness[i] * shape.stack * offset
  const ptsAt = (offset: number): Pt[] => lasting.map((p, i) => [p[0], yAt(i, offset)])

  const loopFor = (from: number, to: number): Pt[] => {
    const mid = (from + to) / 2
    return [
      ...ptsAt(from),
      [toeX(mid), (yAt(lastIndex, from) + yAt(lastIndex, to)) / 2],
      ...[...ptsAt(to)].reverse(),
      [heelX(mid), (yAt(0, from) + yAt(0, to)) / 2],
    ]
  }

  const band = (from: number, to: number) => curveThrough(loopFor(from, to), true)
  const bandFar = (from: number, to: number) =>
    curveThrough(loopFor(from, to).map(farOf), true)

  /** Ground height at an arbitrary x, for placing lugs. */
  const groundAt = (x: number): number => {
    const pts = ptsAt(1)
    if (x <= pts[0][0]) return pts[0][1]
    for (let i = 0; i < pts.length - 1; i++) {
      if (x <= pts[i + 1][0]) {
        const f = (x - pts[i][0]) / (pts[i + 1][0] - pts[i][0])
        return pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f
      }
    }
    return pts[pts.length - 1][1]
  }

  /** Trail lugs: teeth that stand the shoe off the ground. */
  const lugDepth = shape.outsole === 'lugs' ? 15 : 0
  const lugs: string[] = []
  if (shape.outsole === 'lugs') {
    for (let x = 196; x <= 856; x += 52) {
      const y = groundAt(x)
      lugs.push(
        `M${r1(x - 19)} ${r1(y - 2)} L${r1(x - 13)} ${r1(y + lugDepth)} L${r1(x + 13)} ${r1(
          y + lugDepth,
        )} L${r1(x + 19)} ${r1(y - 2)} Z`,
      )
    }
  }

  /** Every model is dropped so its lowest point rests on GROUND. */
  const lowest = Math.max(...lasting.map((_, i) => yAt(i, 1))) + lugDepth
  const dy = GROUND - lowest

  /** Short grooves cut up into the sole from the ground. */
  const flexGrooves = (shape.soleStyle === 'cupsole' ? [7] : [6, 7, 8]).map((i) => {
    const x = lasting[i][0]
    const y = yAt(i, 0.52)
    const end = yAt(i, 0.98)
    return `M${r1(x)} ${r1(y)} C${r1(x + 5)} ${r1(y + (end - y) * 0.4)} ${r1(x + 5)} ${r1(
      y + (end - y) * 0.75,
    )} ${r1(x)} ${r1(end)}`
  })

  /** Tread ticks along the outsole. */
  const tread: string[] = []
  if (shape.outsole !== 'lugs') {
    const count = shape.outsole === 'full' ? 11 : 8
    for (let i = 1; i <= count; i++) {
      const t = i / (count + 1)
      const x = 230 + t * 600
      const idx = Math.min(lastIndex, Math.round(t * lastIndex))
      tread.push(`M${r1(x)} ${r1(yAt(idx, 0.88))} L${r1(x)} ${r1(yAt(idx, 0.99))}`)
    }
  }

  const from = OUTSOLE_FROM[shape.outsole]

  return {
    dy,
    lasting,
    midsole: band(0, 1),
    midsoleFar: bandFar(0, 1),
    outsole: band(from, 1),
    lugs,
    layerCushion: band(0, 0.22),
    layerMidsole: band(0.22, from),
    layerOutsole: band(from, 1),
    sidewall: curveThrough(ptsAt(0.5)),
    flexGrooves,
    tread,
    lastingForward: curveThrough(lasting),
    lastingReversed: tail(curveThrough([...lasting].reverse())),
  }
}

/* ==========================================================================
   Upper
   ========================================================================== */

/**
 * The upper, as sampled points each carrying a weight saying how much it
 * follows the collar height. The forward three points are swapped out per
 * toe shape, and the whole toe rides up with the sole's spring.
 */
const UPPER_BASE: [Pt, number][] = [
  [[150, 322], 0],
  [[137, 250], 0.3],
  [[158, 180], 0.78],
  [[200, 139], 1],
  [[241, 147], 1],
  [[289, 170], 0.92],
  [[345, 192], 0.75],
  [[404, 210], 0.5],
  [[462, 224], 0.3],
  [[546, 240], 0.14],
  [[618, 252], 0.05],
  [[699, 262], 0],
]

export function upperPoints(shape: ShoeShape): Pt[] {
  const lift = toeLift(shape.soleStyle)
  const body = withCollar(UPPER_BASE, shape.collar)
  const toe = TOE_SHAPES[shape.toe].map(([x, y], i) => [x, y - lift * [0.4, 0.78, 0.94][i]] as Pt)
  const lasting = lastingFor(shape)
  return [...body, ...toe, lasting[lasting.length - 1]]
}

export const makeUpperTopEdge = (shape: ShoeShape) =>
  curveThrough(upperPoints(shape), false, 0.9)

export function makeUpper(shape: ShoeShape, lastingReversed: string) {
  return `${makeUpperTopEdge(shape)} ${lastingReversed} Z`
}

/* ==========================================================================
   Collar, heel and details
   ========================================================================== */

/**
 * Two lines describe the collar: the topline is the binding on the edge
 * itself, the lining sits further inside. A single thick padded band was
 * tried first and read as a strap across the heel.
 */
const TOPLINE: [Pt, number][] = [
  [[156, 184], 0.78],
  [[200, 139], 1],
  [[241, 147], 1],
  [[289, 170], 0.92],
  [[345, 192], 0.75],
  [[404, 210], 0.5],
]

export const makeTopline = (collar: number) => curveThrough(withCollar(TOPLINE, collar))

const COLLAR_RIM: [Pt, number][] = [
  [[170, 208], 0.74],
  [[206, 166], 1],
  [[246, 177], 1],
  [[292, 204], 0.9],
  [[345, 234], 0.68],
  [[398, 259], 0.44],
]

export const makeCollarRim = (collar: number) => curveThrough(withCollar(COLLAR_RIM, collar))

/** The stiffened panel around the heel. */
const HEEL_COUNTER: [Pt, number][] = [
  [[152, 324], 0],
  [[136, 256], 0.3],
  [[158, 184], 0.78],
  [[200, 146], 1],
  [[226, 168], 1],
  [[240, 228], 0.6],
  [[242, 288], 0.25],
  [[232, 340], 0],
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

/** A toe bumper, wrapping the front of the upper. Trail models only. */
export const MUDGUARD =
  'M686 354 C750 349 820 339 892 328 L890 284 C820 294 750 305 688 311 Z'

/**
 * Lacing, seen flat from the side: an eyelet row just inside the topline with
 * short segments running up over the eyestay.
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

/** A seam between the eyestay panel and the vamp. */
export const MIDFOOT_SEAM = 'M502 222 C512 262 514 302 506 342'

/**
 * Panels.
 *
 * A real upper is cut and stitched from pieces; without them the shoe reads
 * as one moulded blob no matter how well it is shaded. Each panel is a
 * generous shape clipped to the upper, so the silhouette still decides the
 * outline and the panels only decide the tone breaks inside it.
 */
export const PANEL_QUARTER = 'M90 110 L498 110 C508 196 512 292 504 400 L90 400 Z'
export const PANEL_TOE = 'M806 160 C834 250 848 314 840 410 L990 410 L990 160 Z'
export const PANEL_EYESTAY =
  'M268 172 C330 196 392 216 452 230 L458 286 C396 270 332 248 272 222 Z'

/** The stitch lines between them. */
export const SEAM_EYESTAY_TOP = 'M268 172 C330 196 392 216 452 230'
export const SEAM_EYESTAY_BOTTOM = 'M272 222 C332 248 396 270 458 286'

export const BRAND_ARC =
  'M262 338 C338 333 412 316 472 293 C482 289 489 292 488 300 C487 307 480 310 468 314 C406 336 338 343 266 345 Z'

export const FLASH_LINES = [
  'M250 334 C332 326 418 302 496 272',
  'M254 356 C336 348 422 324 500 294',
]

/** A moulded toe-cap seam. */
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

/* ==========================================================================
   Plan views
   ========================================================================== */

/**
 * The top and outsole share one last outline: widest at the ball, pinched at
 * the waist, and a heel about 70% of the forefoot width.
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

/* ==========================================================================
   Views
   ========================================================================== */

export type ShoeView = 'hero' | 'profile' | 'detail' | 'heel' | 'toe' | 'top' | 'sole'

/**
 * Each view is a genuine crop or a different geometry — not the same picture
 * twice. `hero` is the three-quarter and is the default everywhere; `profile`
 * keeps the flat lateral for the gallery.
 */
export const VIEW_BOX: Record<ShoeView, string> = {
  hero: '22 -10 1000 490',
  profile: '22 56 1000 424',
  detail: '250 120 400 236',
  heel: '96 60 350 340',
  toe: '596 150 380 240',
  top: '96 96 840 288',
  sole: '96 96 840 288',
}

export const VIEW_LABEL: Record<ShoeView, string> = {
  hero: 'Three-quarter',
  profile: 'Lateral',
  detail: 'Midfoot',
  heel: 'Heel',
  toe: 'Toe',
  top: 'Top',
  sole: 'Outsole',
}

/* ==========================================================================
   Three-quarter construction
   ========================================================================== */

/**
 * The far side of the shoe.
 *
 * Two earlier attempts failed in instructive ways. Translating the whole
 * silhouette straight up gave the shoe a second heel and a second toe poking
 * out behind it. Scaling it down as well fixed the doubling but produced a
 * smooth dome over the heel, because a constant offset is an *extrusion* —
 * it makes the shoe as wide at the heel as it is at the ball.
 *
 * A shoe is not an extrusion. The offset follows the width of the last at
 * each point along it: narrow at the heel, narrower at the waist, widest at
 * the ball, tapering to nothing at the toe.
 */
export const THREE_Q = { dx: -5, dy: -68 }

/** Normalised width of the last along its length, taken off the plan outline. */
const WIDTH_PROFILE: Pt[] = [
  [130, 0.08],
  [175, 0.42],
  [230, 0.58],
  [300, 0.66],
  [380, 0.66],
  [460, 0.7],
  [540, 0.78],
  [620, 0.88],
  [700, 0.97],
  [780, 1],
  [840, 0.92],
  [880, 0.66],
  [930, 0.16],
]

export function widthAt(x: number): number {
  if (x <= WIDTH_PROFILE[0][0]) return WIDTH_PROFILE[0][1]
  const last = WIDTH_PROFILE[WIDTH_PROFILE.length - 1]
  if (x >= last[0]) return last[1]
  for (let i = 0; i < WIDTH_PROFILE.length - 1; i++) {
    const [x0, w0] = WIDTH_PROFILE[i]
    const [x1, w1] = WIDTH_PROFILE[i + 1]
    if (x <= x1) return w0 + ((w1 - w0) * (x - x0)) / (x1 - x0)
  }
  return last[1]
}

/** Move a point to the far side of the shoe, foreshortened by the local width. */
export const farOf = ([x, y]: Pt): Pt => {
  const w = widthAt(x)
  return [x + THREE_Q.dx * w, y + THREE_Q.dy * w]
}

export function makeFarUpper(shape: ShoeShape, lasting: Pt[]): string {
  const top = upperPoints(shape).map(farOf)
  const far = lasting.map(farOf)
  return `${curveThrough(top, false, 0.9)} ${tail(curveThrough([...far].reverse()))} Z`
}

export const toplinePoints = (collar: number) => withCollar(TOPLINE, collar)

/**
 * The collar opening, as the ellipse it actually projects to.
 *
 * Filling the strip between the near and far toplines was another early
 * mistake: it read as a black trench cut along the whole collar. A real
 * opening is an ellipse lying in the plane of the topline.
 */
export function makeOpening(collar: number) {
  const top = toplinePoints(collar)
  const a = top[1]
  const b = top[top.length - 1]
  const aFar = farOf(a)
  const bFar = farOf(b)

  const mid = (p: Pt, q: Pt): Pt => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]
  const heel = mid(a, aFar)
  const throat = mid(b, bFar)

  const cx = (heel[0] + throat[0]) / 2
  const cy = (heel[1] + throat[1]) / 2
  const len = Math.hypot(throat[0] - heel[0], throat[1] - heel[1])
  const angle = (Math.atan2(throat[1] - heel[1], throat[0] - heel[0]) * 180) / Math.PI
  const rx = (len / 2) * 0.98
  const depth =
    (Math.hypot(a[0] - aFar[0], a[1] - aFar[1]) + Math.hypot(b[0] - bFar[0], b[1] - bFar[1])) / 2
  const ry = (depth / 2) * 1.18

  const rad = (angle * Math.PI) / 180
  const along: Pt = [Math.cos(rad), Math.sin(rad)]
  const across: Pt = [-Math.sin(rad), Math.cos(rad)]
  const at = (u: number, v: number): Pt => [
    cx + along[0] * rx * u + across[0] * ry * v,
    cy + along[1] * rx * u + across[1] * ry * v,
  ]

  /* Lacing crosses the throat half of the opening, near edge to far edge. */
  const us = [0.02, 0.28, 0.54, 0.8]
  const near = us.map((u) => at(u, 0.58))
  const far = us.map((u) => at(u, -0.58))
  const bars: string[] = []
  for (let i = 0; i < us.length - 1; i++) {
    bars.push(`M${r1(near[i][0])} ${r1(near[i][1])} L${r1(far[i + 1][0])} ${r1(far[i + 1][1])}`)
    bars.push(`M${r1(far[i][0])} ${r1(far[i][1])} L${r1(near[i + 1][0])} ${r1(near[i + 1][1])}`)
  }

  return {
    cx,
    cy,
    rx,
    ry,
    transform: `rotate(${r1(angle)} ${r1(cx)} ${r1(cy)})`,
    tongue: { cx: at(0.44, 0)[0], cy: at(0.44, 0)[1], rx: rx * 0.54, ry: ry * 0.8 },
    bars,
    eyelets: [...near, ...far],
  }
}
