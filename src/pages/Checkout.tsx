import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Check, Info, Lock } from 'lucide-react'
import { cn } from '@/lib/cn'
import { money } from '@/lib/format'
import { ShoeVisual } from '@/components/visuals/ShoeVisual'
import { Eyebrow } from '@/components/primitives/Bits'
import { STANDARD_SHIPPING, useShop } from '@/store/shop'

type Fields = Record<string, string>

const CONTACT_FIELDS = [
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', required: true },
  { name: 'phone', label: 'Phone (optional)', type: 'tel', autoComplete: 'tel', required: false },
]

const ADDRESS_FIELDS = [
  { name: 'firstName', label: 'First name', autoComplete: 'given-name', required: true, half: true },
  { name: 'lastName', label: 'Last name', autoComplete: 'family-name', required: true, half: true },
  { name: 'address', label: 'Address', autoComplete: 'address-line1', required: true },
  { name: 'address2', label: 'Apartment, suite (optional)', autoComplete: 'address-line2', required: false },
  { name: 'city', label: 'City', autoComplete: 'address-level2', required: true, half: true },
  { name: 'postal', label: 'Postal code', autoComplete: 'postal-code', required: true, half: true },
  { name: 'country', label: 'Country', autoComplete: 'country-name', required: true },
]

const DELIVERY_OPTIONS = [
  { id: 'standard', name: 'Standard', detail: '3–5 business days', cost: 0 },
  { id: 'express', name: 'Express', detail: '1–2 business days', cost: 18 },
  { id: 'collect', name: 'Collect in store', detail: 'Ready in 2 hours — London, Flagship', cost: 0 },
]

function Field({
  name,
  label,
  type = 'text',
  autoComplete,
  required,
  value,
  error,
  onChange,
  className,
}: {
  name: string
  label: string
  type?: string
  autoComplete?: string
  required?: boolean
  value: string
  error?: string
  onChange: (v: string) => void
  className?: string
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="t-label block text-[color:var(--color-muted)]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className="field mt-2.5"
      />
      {error && (
        <p id={`${name}-error`} role="alert" className="t-small mt-2 text-[color:var(--color-sale)]">
          {error}
        </p>
      )}
    </div>
  )
}

function Step({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <section className="border-t border-[color:var(--color-line)] py-9">
      <h2 className="flex items-baseline gap-4">
        <span className="t-label tabular text-[color:var(--color-muted)]">{number}</span>
        <span className="t-h3">{title}</span>
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  )
}

export function Checkout() {
  const { lines, subtotal, tax, clearBag, bagCount } = useShop()
  const [fields, setFields] = useState<Fields>({})
  const [errors, setErrors] = useState<Fields>({})
  const [delivery, setDelivery] = useState('standard')
  const [placed, setPlaced] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Checkout — AURA'
  }, [])

  const chosen = DELIVERY_OPTIONS.find((o) => o.id === delivery) ?? DELIVERY_OPTIONS[0]
  const shipping = useMemo(() => {
    if (chosen.id === 'express') return chosen.cost
    if (chosen.id === 'collect') return 0
    return subtotal >= 150 || subtotal === 0 ? 0 : STANDARD_SHIPPING
  }, [chosen, subtotal])

  const total = subtotal + shipping + tax

  const set = (name: string) => (value: string) => {
    setFields((f) => ({ ...f, [name]: value }))
    setErrors((e) => (e[name] ? { ...e, [name]: '' } : e))
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const next: Fields = {}

    for (const f of [...CONTACT_FIELDS, ...ADDRESS_FIELDS]) {
      if (f.required && !fields[f.name]?.trim()) next[f.name] = 'Required'
    }
    if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      next.email = 'Enter a valid email address'
    }

    setErrors(next)
    if (Object.keys(next).length > 0) {
      const first = document.getElementById(Object.keys(next)[0])
      first?.focus()
      return
    }

    setPlaced(`AU-${String(Date.now()).slice(-8)}`)
    clearBag()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /* ------------------------------------------------------- confirmation */

  if (placed) {
    return (
      <section className="container-aura py-20 md:py-28">
        <div className="max-w-xl">
          <span className="flex h-12 w-12 items-center justify-center bg-[color:var(--color-signal)]">
            <Check size={22} strokeWidth={1.75} aria-hidden="true" />
          </span>
          <h1 className="t-h1 mt-8">Order placed.</h1>
          <p className="t-lede mt-5">
            Reference <span className="tabular">{placed}</span>. In a live store this is where the
            confirmation email would go out.
          </p>
          <p className="t-small mt-6 border-t border-[color:var(--color-line)] pt-6 text-[color:var(--color-muted)]">
            This is a front-end prototype. No payment was taken, no order was created and nothing
            will be shipped.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/shop" className="btn btn-solid btn-lg">
              Back to the collection
            </Link>
            <Link to="/" className="btn btn-outline btn-lg">
              Home
            </Link>
          </div>
        </div>
      </section>
    )
  }

  /* -------------------------------------------------------- empty state */

  if (lines.length === 0) {
    return (
      <section className="container-aura py-20 md:py-28">
        <div className="max-w-md">
          <Eyebrow>Checkout</Eyebrow>
          <h1 className="t-h1 mt-6">Your bag is empty.</h1>
          <p className="t-lede mt-5">Add something to it and this page will have work to do.</p>
          <Link to="/shop" className="btn btn-solid btn-lg mt-8">
            Shop the collection
          </Link>
        </div>
      </section>
    )
  }

  /* ------------------------------------------------------------- the form */

  return (
    <div className="container-aura py-12 md:py-16">
      <Eyebrow>Checkout</Eyebrow>
      <h1 className="t-h1 mt-6">
        {bagCount} {bagCount === 1 ? 'item' : 'items'}
      </h1>

      <div className="mt-10 flex items-start gap-3 border border-[color:var(--color-line-strong)] bg-[color:var(--color-signal-wash)]/60 p-4">
        <Info
          size={16}
          strokeWidth={1.5}
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-[color:var(--color-signal-ink)]"
        />
        <p className="t-small text-[color:var(--color-secondary)]">
          <span className="font-medium text-[color:var(--color-primary)]">
            Visual prototype.
          </span>{' '}
          This checkout is front-end only. No payment provider is connected, no card fields are
          rendered, and nothing you type leaves this browser.
        </p>
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* ------------------------------------------------------- form */}
        <form className="lg:col-span-7" onSubmit={submit} noValidate>
          <Step number="01" title="Contact information">
            <div className="grid gap-5 sm:grid-cols-2">
              {CONTACT_FIELDS.map((f) => (
                <Field
                  key={f.name}
                  {...f}
                  value={fields[f.name] ?? ''}
                  error={errors[f.name] || undefined}
                  onChange={set(f.name)}
                />
              ))}
            </div>
          </Step>

          <Step number="02" title="Shipping address">
            <div className="grid gap-5 sm:grid-cols-2">
              {ADDRESS_FIELDS.map((f) => (
                <Field
                  key={f.name}
                  {...f}
                  value={fields[f.name] ?? ''}
                  error={errors[f.name] || undefined}
                  onChange={set(f.name)}
                  className={f.half ? undefined : 'sm:col-span-2'}
                />
              ))}
            </div>
          </Step>

          <Step number="03" title="Delivery method">
            <fieldset>
              <legend className="sr-only">Delivery method</legend>
              <div className="space-y-2.5">
                {DELIVERY_OPTIONS.map((option) => {
                  const selected = option.id === delivery
                  const cost =
                    option.id === 'standard' && subtotal < 150 ? STANDARD_SHIPPING : option.cost
                  return (
                    <label
                      key={option.id}
                      className={cn(
                        'flex cursor-pointer items-center gap-4 border p-4 transition-colors',
                        selected
                          ? 'border-[color:var(--color-ink)] bg-[color:var(--color-stone)]/60'
                          : 'border-[color:var(--color-control)] hover:border-[color:var(--color-ink)]',
                      )}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        value={option.id}
                        checked={selected}
                        onChange={() => setDelivery(option.id)}
                        className="h-4 w-4 shrink-0 appearance-none rounded-full border border-[color:var(--color-control)] checked:border-[6px] checked:border-[color:var(--color-ink)]"
                      />
                      <span className="flex-1">
                        <span className="t-product block">{option.name}</span>
                        <span className="t-small block text-[color:var(--color-muted)]">
                          {option.detail}
                        </span>
                      </span>
                      <span className="t-price shrink-0">{cost === 0 ? 'Free' : money(cost)}</span>
                    </label>
                  )
                })}
              </div>
            </fieldset>
          </Step>

          <Step number="04" title="Payment">
            {/* Deliberately no card inputs. A prototype that renders real
                payment fields invites people to type real card numbers. */}
            <div className="border border-dashed border-[color:var(--color-control)] p-6">
              <p className="t-label flex items-center gap-2.5 text-[color:var(--color-muted)]">
                <Lock size={14} strokeWidth={1.5} aria-hidden="true" />
                Payment step — not implemented
              </p>
              <p className="t-body mt-4 max-w-prose">
                In production this is where the payment provider’s hosted fields would mount. They
                are left out on purpose: no card, billing or identity fields are rendered anywhere
                in this prototype, so there is nothing here to type real details into.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['Card', 'Apple Pay', 'Google Pay', 'Klarna'].map((method) => (
                  <span key={method} className="badge badge-outline">
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </Step>

          <div className="border-t border-[color:var(--color-line)] pt-8">
            <button type="submit" className="btn btn-solid btn-lg w-full sm:w-auto sm:min-w-[18rem]">
              Place order — {money(total)}
            </button>
            <p className="t-small mt-4 text-[color:var(--color-muted)]">
              Placing the order clears your bag and shows a confirmation screen. Nothing is charged.
            </p>
          </div>
        </form>

        {/* ---------------------------------------------------- summary */}
        <aside className="lg:col-span-5" aria-label="Order summary">
          <div className="lg:sticky lg:top-32">
            <div className="border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-5 md:p-7">
              <h2 className="t-label">Order summary</h2>

              <ul className="mt-6 space-y-5">
                {lines.map((line) => (
                  <li key={line.id} className="flex gap-4">
                    <span className="image-bed relative block h-20 w-24 shrink-0 overflow-hidden">
                      <span className="absolute inset-0 flex items-center justify-center">
                        <ShoeVisual
                          parts={line.colorway.parts}
                          shape={line.product.shape}
                          label={null}
                        />
                      </span>
                      <span
                        className="tabular absolute top-1 right-1 flex h-5 min-w-5 items-center justify-center bg-[color:var(--color-ink)] px-1 text-[10px] text-[color:var(--color-canvas)]"
                        aria-hidden="true"
                      >
                        {line.quantity}
                      </span>
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="t-product">AURA {line.product.name}</span>
                      <span className="t-small text-[color:var(--color-muted)]">
                        {line.colorway.name} · US {line.size} · Qty {line.quantity}
                      </span>
                    </span>
                    <span className="t-price shrink-0">{money(line.lineTotal)}</span>
                  </li>
                ))}
              </ul>

              <dl className="mt-7 space-y-2.5 border-t border-[color:var(--color-line)] pt-5">
                <div className="flex justify-between">
                  <dt className="t-small text-[color:var(--color-secondary)]">Subtotal</dt>
                  <dd className="t-price">{money(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="t-small text-[color:var(--color-secondary)]">
                    Shipping — {chosen.name}
                  </dt>
                  <dd className="t-price">{shipping === 0 ? 'Free' : money(shipping)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="t-small text-[color:var(--color-secondary)]">Estimated tax</dt>
                  <dd className="t-price">{money(tax)}</dd>
                </div>
                <div className="flex justify-between border-t border-[color:var(--color-line)] pt-3">
                  <dt className="t-product">Total</dt>
                  <dd className="t-price font-medium">{money(total)}</dd>
                </div>
              </dl>
            </div>

            <p className="t-small mt-5 text-[color:var(--color-muted)]">
              Free standard shipping over $150. 30-day wear test on every pair.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
