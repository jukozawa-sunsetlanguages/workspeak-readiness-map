import { cx } from '../cx'

const STEPS = [
  { label: 'Self-report', text: 'What you described about your communication.', done: true },
  { label: 'Hypothesis', text: 'The working pattern this Map suggests.', done: true },
  { label: 'Performance evidence', text: 'What actually appears when you communicate.', done: false },
]

/** SELF-REPORT → HYPOTHESIS → PERFORMANCE EVIDENCE, on the amber line. */
export default function EvidencePath() {
  return (
    <ol className="relative grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
      {STEPS.map((s, i) => (
        <li key={s.label} className="relative pl-8 md:pl-0 md:pt-8">
          {/* connector: vertical on mobile, horizontal on desktop */}
          <span
            aria-hidden="true"
            className={cx(
              'absolute left-[5px] top-0 h-full w-px md:left-0 md:top-[5px] md:h-px md:w-full',
              s.done ? 'bg-amber' : 'border-l border-dashed border-offwhite/40 md:border-l-0 md:border-t',
            )}
          />
          <span
            aria-hidden="true"
            className={cx(
              'absolute left-0 top-0 h-[11px] w-[11px] border-2',
              s.done ? 'border-amber bg-amber' : 'border-offwhite bg-strategic',
            )}
          />
          <p className="eyebrow text-offwhite/65">
            {String(i + 1).padStart(2, '0')}
            {s.done ? ' · Done' : ' · Next'}
          </p>
          <p className="mt-2 font-heading text-lg font-semibold">{s.label}</p>
          <p className="mt-1 text-sm leading-relaxed text-offwhite/75">{s.text}</p>
        </li>
      ))}
    </ol>
  )
}
