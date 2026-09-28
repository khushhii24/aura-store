#!/usr/bin/env node
/**
 * AURA — WCAG contrast check.
 *
 * Tokens are read straight out of src/styles/index.css so this can never
 * drift from the design system. Add a pair here whenever a new colour
 * combination appears in a component; do not eyeball it.
 *
 *   node scripts/check-contrast.mjs
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const css = readFileSync(resolve(here, '../src/styles/index.css'), 'utf8')

/** Pull `--color-*: #hex;` declarations out of the @theme block. */
const tokens = Object.fromEntries(
  [...css.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/g)].map(([, name, hex]) => [
    name,
    hex,
  ]),
)

const srgb = (hex) => {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255)
}

const luminance = (hex) => {
  const [r, g, b] = srgb(hex).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const ratio = (a, b) => {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}

/** [foreground, background, minimum, where it is used] */
const PAIRS = [
  // Light canvas
  ['primary', 'canvas', 4.5, 'body headings on the page'],
  ['secondary', 'canvas', 4.5, 'body copy'],
  ['muted', 'canvas', 4.5, 'labels, meta, captions'],
  ['primary', 'stone', 4.5, 'headings on stone bands'],
  ['secondary', 'stone', 4.5, 'copy on stone bands'],
  ['muted', 'stone', 4.5, 'labels on stone bands'],
  ['primary', 'surface', 4.5, 'card + drawer copy'],
  ['secondary', 'surface', 4.5, 'card + drawer copy'],
  ['muted', 'surface', 4.5, 'card meta, drawer meta'],
  ['muted', 'stone-deep', 4.5, 'captions on deep stone wells'],
  ['on-bed', 'bed-top', 4.5, 'captions on a product bed (lit edge)'],
  ['on-bed', 'bed-mid', 4.5, 'captions on a product bed'],
  ['on-bed', 'bed-deep', 4.5, 'captions on a product bed (shadowed edge)'],
  ['primary', 'bed-deep', 4.5, 'headings laid over a product bed'],
  ['on-bed', 'bed-mid', 3, 'the hero scroll-cue border (non-text)'],
  ['on-dark-muted', 'bed-dark-top', 4.5, 'captions on a dark product bed'],
  ['on-dark-secondary', 'bed-dark-top', 4.5, 'copy on a dark product bed'],
  ['signal-ink', 'canvas', 4.5, 'the readable cut of the accent'],
  ['signal-ink', 'signal-wash', 4.5, 'accent text inside a tint fill'],
  ['sale', 'canvas', 4.5, 'error + sale text'],
  ['positive', 'canvas', 4.5, 'in-stock / free-shipping text'],

  // Dark band
  ['on-dark', 'ink-deep', 4.5, 'headings in the dark band'],
  ['on-dark-secondary', 'ink-deep', 4.5, 'copy in the dark band'],
  ['on-dark-muted', 'ink-deep', 4.5, 'labels in the dark band'],
  ['on-dark-secondary', 'ink', 4.5, 'copy on charcoal'],
  ['on-dark-muted', 'ink', 4.5, 'labels on charcoal'],
  ['on-dark-secondary', 'ink-raised', 4.5, 'copy on raised dark panels'],
  ['on-dark-muted', 'ink-raised', 4.5, 'labels on raised dark panels'],
  ['signal', 'ink-deep', 4.5, 'accent text in the dark band'],
  ['signal', 'ink', 4.5, 'accent text on charcoal'],

  // Inverted fills
  ['canvas', 'ink', 4.5, 'solid button label'],
  ['ink', 'signal', 4.5, 'signal badge + hover button label'],

  // Non-text: borders and focus rings need 3:1
  ['control', 'canvas', 3, 'field + pill + chip borders (non-text)'],
  ['control', 'surface', 3, 'control borders inside cards + drawers (non-text)'],
  ['control', 'stone', 3, 'control borders on stone bands (non-text)'],
  ['line-strong', 'canvas', 1.2, 'decorative rules (non-essential)'],
  ['line', 'canvas', 1.2, 'hairline dividers (decorative)'],
  ['ink', 'canvas', 3, 'focus ring on light (non-text)'],
  ['signal', 'ink-deep', 3, 'focus ring on dark (non-text)'],
]

let failures = 0
const rows = PAIRS.map(([fg, bg, min, use]) => {
  const fgHex = tokens[fg]
  const bgHex = tokens[bg]
  if (!fgHex || !bgHex) {
    failures++
    return { pair: `${fg} on ${bg}`, ratio: 'MISSING TOKEN', min, use, pass: false }
  }
  const r = ratio(fgHex, bgHex)
  const pass = r >= min
  if (!pass) failures++
  return { pair: `${fg} on ${bg}`, ratio: r.toFixed(2), min: min.toFixed(1), use, pass }
})

const w = Math.max(...rows.map((r) => r.pair.length))
console.log('\nAURA — contrast audit\n')
for (const r of rows) {
  const mark = r.pass ? 'PASS' : 'FAIL'
  console.log(
    `  ${mark}  ${r.pair.padEnd(w)}  ${String(r.ratio).padStart(7)} : 1  (min ${r.min})  ${r.use}`,
  )
}

console.log(
  failures === 0
    ? `\n  ${rows.length} pairs checked, all pass.\n`
    : `\n  ${failures} of ${rows.length} pairs FAIL.\n`,
)

process.exit(failures === 0 ? 0 : 1)
