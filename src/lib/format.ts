const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const usdCents = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** Catalogue prices are whole dollars; totals carry cents. */
export const price = (value: number) => usd.format(value)
export const money = (value: number) => usdCents.format(value)

export const plural = (n: number, one: string, many = `${one}s`) => (n === 1 ? one : many)

export const compactCount = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n))
