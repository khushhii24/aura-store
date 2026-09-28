import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  BRAND_PILLARS,
  RETURNS_INFO,
  SHIPPING_INFO,
  TECH_LAYERS,
} from '@/data/content'
import { flagship, products } from '@/data/products'
import { press } from '@/data/reviews'
import { Reveal } from '@/components/primitives/Reveal'
import { Eyebrow } from '@/components/primitives/Bits'
import { ShoeVisual } from '@/components/visuals/ShoeVisual'

const MATERIALS = [
  {
    name: 'Nitrogen-infused AURAFOAM',
    detail:
      'Gas injected into the foam during moulding, creating closed cells that stay springy for roughly twice as long as standard EVA.',
    share: '100% of models',
  },
  {
    name: 'Recycled engineered knit',
    detail:
      '62% post-consumer polyester, knitted in one piece so there is no offcut waste at the cutting table.',
    share: '5 of 8 models',
  },
  {
    name: 'Vegetable-tanned leather',
    detail:
      'Tanned in Portugal without chromium, from a tannery audited by the Leather Working Group.',
    share: 'FORM only',
  },
  {
    name: 'Reclaimed rubber',
    detail: '30% reclaimed content in every outsole, placed only where wear data called for it.',
    share: 'All outsoles',
  },
]

export function About() {
  useEffect(() => {
    document.title = 'About — AURA'
  }, [])

  return (
    <>
      {/* ----------------------------------------------------------- hero */}
      <section className="image-bed grain relative overflow-hidden">
        {/* The right half was a large empty field at desktop widths. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-[-24%] hidden w-[70%] -translate-y-1/2 opacity-90 lg:block"
        >
          <ShoeVisual
            parts={flagship.colorways[4]?.parts ?? flagship.colorways[0].parts}
            shape={flagship.shape}
            label={null}
          />
        </div>

        <div className="container-aura relative z-10 py-20 md:py-28 lg:py-36">
          <Eyebrow className="text-[color:var(--color-on-bed)]">About AURA</Eyebrow>
          <h1 className="t-h1 mt-6 max-w-[15ch]">
            Performance you don’t have to dress around.
          </h1>
          <p className="t-lede mt-7 max-w-xl">
            We make footwear for people whose day does not sort itself neatly into a workout and
            everything else.
          </p>
        </div>
      </section>

      {/* --------------------------------------------------------- story */}
      <section className="section-y">
        <div className="container-aura grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <div className="max-w-prose space-y-6">
              <p className="t-lede text-[color:var(--color-primary)]">
                AURA began with a wardrobe problem, not a performance one.
              </p>
              <p className="t-body">
                Two of us were commuting across a city, training four times a week and travelling
                most months. The only shoes comfortable enough for that were running shoes, and the
                only shoes we actually wanted to wear were not comfortable enough for any of it.
                Everyone we asked was carrying a second pair.
              </p>
              <p className="t-body">
                So we started at the midsole and worked outwards. The foam came from running: a
                nitrogen-infused EVA that keeps returning energy long after standard foam has gone
                flat. The proportions came from a pair of leather shoes we measured on a kitchen
                table. The rule we set was simple — no performance decision survives unless the shoe
                still looks like something you would choose.
              </p>
              <p className="t-body">
                Eight models later, that is still the whole brief. One platform underneath, eight
                different answers to what a day looks like. No seasonal churn, no colourways
                designed to expire.
              </p>
            </div>

            <dl className="mt-14 grid gap-8 border-t border-[color:var(--color-line-strong)] pt-10 sm:grid-cols-3">
              {[
                { term: 'Founded', value: '2023' },
                { term: 'Models', value: 'Eight' },
                { term: 'Wear test', value: '30 days' },
              ].map((stat) => (
                <div key={stat.term}>
                  <dt className="t-label text-[color:var(--color-muted)]">{stat.term}</dt>
                  <dd className="t-serif mt-3 text-3xl leading-none">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={0.06}>
            <div className="image-bed grain relative aspect-[4/5] overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <ShoeVisual
                  parts={flagship.colorways[2].parts}
                  shape={flagship.shape}
                  view="heel"
                  label={`Heel detail of AURA ${flagship.name}`}
                />
              </div>
              <p className="t-label absolute bottom-5 left-5 text-[color:var(--color-on-bed)]">
                Heel counter — AURA {flagship.name}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------- pillars */}
      <section className="section-y-tight bg-[color:var(--color-stone)]">
        <div className="container-aura">
          <dl className="grid gap-10 md:grid-cols-3 md:gap-12">
            {BRAND_PILLARS.map((pillar, i) => (
              <Reveal key={pillar.title} delay={i * 0.06}>
                <dt className="flex items-baseline gap-4 border-t border-[color:var(--color-line-strong)] pt-6">
                  <span className="t-label tabular text-[color:var(--color-muted)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="t-h3">{pillar.title}</span>
                </dt>
                <dd className="t-body mt-4 md:pl-9">{pillar.copy}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------------------------------------------- technology */}
      <section id="technology" className="on-dark bg-[color:var(--color-ink-deep)] section-y">
        <div className="container-aura">
          <Reveal>
            <Eyebrow className="text-[color:var(--color-on-dark-muted)]">Technology</Eyebrow>
            <h2 className="t-h1 mt-6 max-w-[16ch]">What is actually under your foot.</h2>
          </Reveal>

          <ol className="mt-14 grid gap-px md:grid-cols-2 md:gap-x-14">
            {TECH_LAYERS.map((layer, i) => (
              <Reveal key={layer.id} as="li" delay={(i % 2) * 0.06}>
                <div className="border-t border-[color:var(--color-line-dark)] py-8">
                  <div className="flex items-baseline gap-5">
                    <span className="t-label tabular text-[color:var(--color-signal)]">
                      {layer.number}
                    </span>
                    <div>
                      <h3 className="t-h3">{layer.name}</h3>
                      <p className="t-label mt-2 text-[color:var(--color-on-dark-muted)]">
                        {layer.summary}
                      </p>
                      <p className="t-body mt-4 max-w-prose">{layer.copy}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ----------------------------------------------------- materials */}
      <section id="materials" className="section-y">
        <div className="container-aura">
          <Reveal>
            <Eyebrow>Materials</Eyebrow>
            <h2 className="t-h1 mt-6 max-w-[16ch]">Four materials do most of the work.</h2>
          </Reveal>

          <dl className="mt-12 space-y-px">
            {MATERIALS.map((m, i) => (
              <Reveal key={m.name} delay={Math.min(i, 3) * 0.05}>
                <div className="grid gap-3 border-t border-[color:var(--color-line)] py-7 md:grid-cols-12 md:gap-8">
                  <dt className="t-product md:col-span-4">{m.name}</dt>
                  <dd className="t-body md:col-span-6">{m.detail}</dd>
                  <dd className="t-label text-[color:var(--color-muted)] md:col-span-2 md:text-right">
                    {m.share}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ------------------------------------------- shipping and returns */}
      <section className="section-y-tight bg-[color:var(--color-stone)]">
        <div className="container-aura grid gap-12 md:grid-cols-2 md:gap-16">
          <div id="shipping" className="scroll-mt-32">
            <h2 className="t-h2">Shipping</h2>
            <dl className="mt-8 space-y-px">
              {SHIPPING_INFO.map((s) => (
                <div key={s.title} className="border-t border-[color:var(--color-line-strong)] py-5">
                  <dt className="t-product">{s.title}</dt>
                  <dd className="t-small mt-2 text-[color:var(--color-secondary)]">{s.detail}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div id="returns" className="scroll-mt-32">
            <h2 className="t-h2">Returns</h2>
            <dl className="mt-8 space-y-px">
              {RETURNS_INFO.map((s) => (
                <div key={s.title} className="border-t border-[color:var(--color-line-strong)] py-5">
                  <dt className="t-product">{s.title}</dt>
                  <dd className="t-small mt-2 text-[color:var(--color-secondary)]">{s.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- press */}
      <section className="section-y">
        <div className="container-aura">
          <Reveal>
            <Eyebrow>Press</Eyebrow>
            <ul className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
              {press.map((mention) => (
                <li key={mention.publication} className="border-t border-[color:var(--color-line)] pt-6">
                  <blockquote className="t-serif text-xl leading-[1.35] tracking-[-0.015em]">
                    “{mention.quote}”
                  </blockquote>
                  <p className="t-label mt-5 text-[color:var(--color-muted)]">
                    {mention.publication}
                    <span className="mx-2.5 text-[color:var(--color-line-strong)]">/</span>
                    {mention.issue}
                  </p>
                </li>
              ))}
            </ul>
            <p className="t-small mt-8 text-[color:var(--color-muted)]">
              AURA is a fictional brand. These publications are invented for this concept.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------- contact */}
      <section id="contact" className="section-y-tight scroll-mt-32 border-t border-[color:var(--color-line)]">
        <div className="container-aura grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="t-h2">Talk to a person.</h2>
            <p className="t-body mt-4 max-w-prose">
              Fit questions, returns, or which model suits your week — the team answers within a
              working day.
            </p>
            <p className="t-small mt-6 text-[color:var(--color-muted)]">
              Accounts, orders and messaging are not implemented in this prototype.
            </p>
          </div>
          <div className="flex flex-wrap items-start gap-3">
            <Link to="/shop" className="btn btn-solid btn-lg">
              Shop the collection
            </Link>
            <Link to={`/product/${products[0].slug}`} className="btn btn-outline btn-lg">
              Start with the ONE
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
