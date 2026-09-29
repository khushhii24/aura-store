import * as THREE from 'three'
import type { ShoeParts, ShoeShape } from '@/data/types'
import { darken, mix } from '@/lib/color'
import {
  GROUND,
  bulgeFor,
  lastingFor,
  outsoleFromFor,
  thicknessFor,
  toplinePoints,
  upperPoints,
  type Pt,
} from './shoeGeometry'

/**
 * The shoe as a solid.
 *
 * Built from exactly the same numbers as the drawing: the lasting line, the
 * per-architecture thickness profile, the toe shape and the collar height.
 * Nothing here is modelled by hand, which is the point — every product gets a
 * mesh that matches its own design, and the result carries no one else's
 * trademark, which is what ruled out the licensed models.
 *
 * The surface is a loft. Each station along the shoe knows three heights
 * (ground, lasting line, top of the upper) and a half-width; a cross-section
 * sweeps through them and adjacent sections stitch into quads. Bands of that
 * loft become the outsole, the midsole and the upper.
 */

/** SVG units are ~800 long; scale to something sane for a camera. */
const S = 0.01
/** The lateral plane of the shoe sits on x ~ 520 in SVG space. */
const CENTRE_X = 520
/** Half-width of the last at its widest, in SVG units. */
const HALF_WIDTH = 124

const STATIONS = 96

/**
 * Half-width of the last along its length, as a fraction of the widest point.
 *
 * `widthAt` in the drawing looks like it would do this job and does not: it is
 * a silhouette *offset* profile for the three-quarter view, so it falls to
 * near zero at heel and toe, where the far outline converges on the near one.
 * Used as an absolute width it tapers both ends to a point and the solid comes
 * out as a canoe. These are last measurements instead — heel at 0, toe at 1,
 * widest at the ball around 0.75.
 */
const LAST_WIDTH: Pt[] = [
  [0.0, 0.12],
  [0.025, 0.44],
  [0.06, 0.58],
  [0.11, 0.655],
  [0.175, 0.685],
  [0.25, 0.675],
  [0.33, 0.65],
  [0.41, 0.645],
  [0.49, 0.685],
  [0.57, 0.775],
  [0.64, 0.88],
  [0.7, 0.96],
  [0.745, 1.0],
  [0.8, 0.985],
  [0.855, 0.93],
  [0.905, 0.83],
  [0.95, 0.66],
  [0.98, 0.43],
  [1.0, 0.14],
]

/** Where the section stops climbing and turns down into the collar. */
const RIM = 0.76
/** Half-width at the rim and at the footbed, as fractions of the station. */
const RIM_W = 0.78
const FLOOR_W = 0.63

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

/** Highest point of a polyline at a given x. Handles the back bulge of a heel. */
function topOfPolylineAt(poly: Pt[], x: number): number | null {
  let best: number | null = null
  for (let i = 0; i < poly.length - 1; i++) {
    const [x0, y0] = poly[i]
    const [x1, y1] = poly[i + 1]
    if (x0 === x1) continue
    const lo = Math.min(x0, x1)
    const hi = Math.max(x0, x1)
    if (x < lo || x > hi) continue
    const y = y0 + ((y1 - y0) * (x - x0)) / (x1 - x0)
    if (best === null || y < best) best = y
  }
  return best
}

/** Linear interpolation across a polyline that is monotonic in x. */
function valueAt(poly: Pt[], x: number): number {
  if (x <= poly[0][0]) return poly[0][1]
  const last = poly[poly.length - 1]
  if (x >= last[0]) return last[1]
  for (let i = 0; i < poly.length - 1; i++) {
    if (x <= poly[i + 1][0]) {
      const t = (x - poly[i][0]) / (poly[i + 1][0] - poly[i][0])
      return lerp(poly[i][1], poly[i + 1][1], t)
    }
  }
  return last[1]
}

interface Station {
  x: number
  /** Heights in SVG space; smaller y is higher up. */
  yGround: number
  yLast: number
  yTop: number
  halfWidth: number
  /** 0 outside the collar opening, 1 at its centre. */
  well: number
}

function sampleStations(shape: ShoeShape): Station[] {
  const lasting = lastingFor(shape)
  const thickness = thicknessFor(shape)
  const bulge = bulgeFor(shape)
  const upper = upperPoints(shape)
  const topline = toplinePoints(shape.collar)

  const thicknessPoly: Pt[] = lasting.map((p, i) => [p[0], thickness[i] * shape.stack])
  const xFrom = lasting[0][0] - bulge.heel * 0.92
  const xTo = lasting[lasting.length - 1][0] + bulge.toe * 0.92

  /* The opening runs from the peak of the topline to the throat. Starting it
     level with the peak eats the heel counter and the shoe reads as a mule,
     so it begins forward of the peak and leaves the counter solid. */
  const collarFrom = topline[1][0] + 24
  const collarTo = topline[topline.length - 1][0] + 30

  const out: Station[] = []
  for (let i = 0; i < STATIONS; i++) {
    const t = i / (STATIONS - 1)
    const x = lerp(xFrom, xTo, t)
    const yLast = valueAt(lasting, x)
    const yGround = yLast + valueAt(thicknessPoly, x)
    const yTop = topOfPolylineAt(upper, x) ?? yLast

    const inCollar = x > collarFrom && x < collarTo
    const well = inCollar
      ? Math.pow(Math.sin(Math.PI * clamp01((x - collarFrom) / (collarTo - collarFrom))), 0.62)
      : 0

    out.push({
      x,
      yGround,
      yLast,
      yTop: Math.min(yTop, yLast - 4),
      halfWidth: HALF_WIDTH * valueAt(LAST_WIDTH, t),
      well,
    })
  }
  return out
}

/**
 * The cross-section: half-width and height at parameter `t`.
 *
 * `t` runs 0 at the ground to 1 at the top, with `split` marking the lasting
 * line. Below it the sidewall is a slight barrel. Above it the upper is a
 * superellipse — a plain dome collapses to a knife edge, which is wrong,
 * because a toe box is broad and rounds over only at the very end.
 *
 * Across the collar the section climbs to a rim and then turns *inward and
 * down*, so the loft closes on a sunken footbed instead of over the top. That
 * is what makes the opening an opening: a disc laid on the surface cannot
 * work, because the surface is always drawn over it.
 */
function section(s: Station, t: number, split: number): { w: number; y: number } {
  if (t <= split) {
    const u = split === 0 ? 1 : t / split
    return {
      w: s.halfWidth * (0.94 + 0.06 * u + 0.04 * Math.sin(Math.PI * u)),
      y: lerp(s.yGround, s.yLast, u),
    }
  }

  const v = clamp01((t - split) / (1 - split))
  const height = s.yLast - s.yTop

  const n = 3.1
  const plain = {
    w: s.halfWidth * Math.pow(Math.max(0, 1 - Math.pow(v, n)), 1 / n),
    y: s.yLast - height * v,
  }
  if (s.well <= 0.001) return plain

  let collar: { w: number; y: number }
  if (v <= RIM) {
    const u = v / RIM
    collar = { w: s.halfWidth * (1 - (1 - RIM_W) * Math.pow(u, 2.4)), y: s.yLast - height * u }
  } else {
    const u = (v - RIM) / (1 - RIM)
    /* How deep the well goes is a viewing decision as much as an anatomical
       one: taken all the way down to the insole, the floor disappears behind
       the near rim at any sane product angle and the opening stops reading. */
    const yFloor = s.yLast - height * 0.6
    collar = {
      w: s.halfWidth * lerp(RIM_W, FLOOR_W, u),
      y: lerp(s.yTop, yFloor, Math.pow(u, 0.7)),
    }
  }

  return { w: lerp(plain.w, collar.w, s.well), y: lerp(plain.y, collar.y, s.well) }
}

/**
 * One band of the loft, as a closed tube around the shoe.
 *
 * The loop runs forward along the lateral side and back along the medial
 * side, so each level is a closed ring and adjacent levels stitch into quads.
 */
function buildBand(
  stations: Station[],
  split: number,
  tFrom: number,
  tTo: number,
  levels: number,
  capBottom: boolean,
  capTop: boolean,
  /** Per-vertex colour, so one mesh can carry the upper and its lining. */
  colorAt?: (s: Station, t: number) => THREE.Color,
  /** Below 1, crowds levels toward the top, where the section turns fastest. */
  bias = 1,
): THREE.BufferGeometry {
  const positions: number[] = []
  const colors: number[] = []
  const indices: number[] = []
  const ring = stations.length * 2

  for (let l = 0; l < levels; l++) {
    const t = lerp(tFrom, tTo, Math.pow(l / (levels - 1), bias))
    const push = (s: Station, side: 1 | -1) => {
      const { w, y } = section(s, t, split)
      positions.push((s.x - CENTRE_X) * S, (GROUND - y) * S, side * w * S)
      if (colorAt) {
        const c = colorAt(s, t)
        colors.push(c.r, c.g, c.b)
      }
    }
    for (const s of stations) push(s, 1)
    for (let i = stations.length - 1; i >= 0; i--) push(stations[i], -1)
  }

  for (let l = 0; l < levels - 1; l++) {
    for (let i = 0; i < ring; i++) {
      const a = l * ring + i
      const b = l * ring + ((i + 1) % ring)
      const c = (l + 1) * ring + i
      const d = (l + 1) * ring + ((i + 1) % ring)
      /* Wound so the face normal points away from the shoe: on the lateral
         side (b - a) is +x and (c - a) is +y, so (b-a) x (c-a) is +z. The
         other order turns the solid inside out, which renders see-through. */
      indices.push(a, b, c, b, d, c)
    }
  }

  /**
   * Close a level by stitching the lateral half to its medial mirror.
   *
   * A triangle fan to the centroid was the obvious thing and it is wrong: one
   * centre point shared by a ring that runs the whole length of the shoe
   * produces a bowtie, which showed up as a crease down the middle.
   */
  const ribbon = (level: number, flip: boolean) => {
    const n = stations.length
    for (let i = 0; i < n - 1; i++) {
      const a = level * ring + i
      const b = level * ring + i + 1
      const c = level * ring + (2 * n - 2 - i)
      const d = level * ring + (2 * n - 1 - i)
      if (flip) indices.push(a, c, b, a, d, c)
      else indices.push(a, b, c, a, c, d)
    }
  }

  if (capBottom) ribbon(0, true)
  if (capTop) ribbon(levels - 1, false)

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  if (colorAt) geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

export interface ShoeMesh {
  outsole: THREE.BufferGeometry
  midsole: THREE.BufferGeometry
  /** Upper and collar lining in one mesh, separated by vertex colour. */
  upper: THREE.BufferGeometry
  laces: { position: THREE.Vector3; width: number }[]
  /** Length of the shoe in scene units, for framing the camera. */
  length: number
}

export function buildShoeMesh(shape: ShoeShape, parts: ShoeParts): ShoeMesh {
  const stations = sampleStations(shape)
  const outsoleFrom = outsoleFromFor(shape)

  /* The share of total height taken by the lasting line varies along the
     shoe, so take the midpoint as the split for the whole loft. */
  const mid = stations[Math.floor(stations.length / 2)]
  const total = mid.yGround - mid.yTop
  const split = total <= 0 ? 0.4 : (mid.yGround - mid.yLast) / total
  const rubber = split * (1 - outsoleFrom)

  const upperColor = new THREE.Color().setStyle(parts.upper)
  const liningColor = new THREE.Color().setStyle(darken(mix(parts.collar, parts.upper, 0.3), 0.62))
  const colorAt = (s: Station, t: number) => {
    const v = clamp01((t - split) / (1 - split))
    /* Darken sharply at the rim, so the band of lining that is actually
       visible over the edge is the dark one. */
    const inside = v <= RIM ? 0 : s.well * clamp01((v - RIM) / (1 - RIM) / 0.12)
    return upperColor.clone().lerp(liningColor, inside)
  }

  /* Lace bars sit across the throat, forward of the opening. */
  const topline = toplinePoints(shape.collar)
  const throat = topline[topline.length - 1]
  const laces: ShoeMesh['laces'] = []
  for (let i = 0; i < 4; i++) {
    const x = throat[0] + 40 + i * 32
    const s = stations.reduce((best, c) => (Math.abs(c.x - x) < Math.abs(best.x - x) ? c : best))
    /* Height from the crown of the vamp, width from lower down the section:
       taken both at the same level the bar sits buried under the surface. */
    const { w } = section(s, split + (1 - split) * 0.7, split)
    laces.push({
      position: new THREE.Vector3((s.x - CENTRE_X) * S, (GROUND - s.yTop) * S - 0.016, 0),
      width: w * 1.35 * S,
    })
  }

  return {
    outsole: buildBand(stations, split, 0, rubber, 3, true, false),
    midsole: buildBand(stations, split, rubber, split, 4, false, false),
    upper: buildBand(stations, split, split, 1, 26, false, true, colorAt, 0.82),
    laces,
    length: (stations[stations.length - 1].x - stations[0].x) * S,
  }
}
