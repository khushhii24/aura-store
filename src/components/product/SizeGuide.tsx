import { SIZE_CONVERSIONS } from '@/data/catalog'
import { Modal } from '@/components/primitives/Overlay'

/**
 * Size guide.
 *
 * Deliberately not a wall of numbers: the measuring instruction comes first,
 * because that is what the person opening this actually needs.
 */
export function SizeGuide({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Size guide">
      <div className="px-5 pt-7 pb-10 md:px-9">
        <h3 className="t-h3">Measure once, in the evening.</h3>
        <p className="t-body mt-3 max-w-prose">
          Feet swell through the day, so measure at the end of it. Stand on a sheet of paper with
          your heel against a wall, mark the tip of your longest toe, and measure the distance in
          centimetres. Use the larger foot — almost nobody has two the same.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          {[
            { step: '01', text: 'Heel to the wall, weight on both feet.' },
            { step: '02', text: 'Mark the longest toe, not the big toe.' },
            { step: '03', text: 'Match the centimetres to the CM column.' },
          ].map((row) => (
            <div key={row.step} className="border-t border-[color:var(--color-line)] pt-3">
              <p className="t-label text-[color:var(--color-muted)]">{row.step}</p>
              <p className="t-small mt-2 text-[color:var(--color-secondary)]">{row.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-9 overflow-x-auto">
          <table className="w-full min-w-[30rem] border-collapse text-left">
            <caption className="sr-only">
              AURA size conversions between US, UK, EU and foot length in centimetres
            </caption>
            <thead>
              <tr className="border-b border-[color:var(--color-ink)]">
                {['US', 'UK', 'EU', 'CM'].map((h) => (
                  <th key={h} scope="col" className="t-label py-3 pr-4 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZE_CONVERSIONS.map((row) => (
                <tr key={row.us} className="border-b border-[color:var(--color-line)]">
                  <th scope="row" className="tabular py-2.5 pr-4 text-sm font-normal">
                    {row.us}
                  </th>
                  <td className="tabular py-2.5 pr-4 text-sm text-[color:var(--color-secondary)]">
                    {row.uk}
                  </td>
                  <td className="tabular py-2.5 pr-4 text-sm text-[color:var(--color-secondary)]">
                    {row.eu}
                  </td>
                  <td className="tabular py-2.5 pr-4 text-sm text-[color:var(--color-secondary)]">
                    {row.cm.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="t-small mt-6 text-[color:var(--color-muted)]">
          Between sizes? Take the larger one on RUN, GLIDE and TRAIL. Take the smaller one on FORM
          and LOW, which run generous.
        </p>
      </div>
    </Modal>
  )
}
