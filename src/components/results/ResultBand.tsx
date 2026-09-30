import type { ReactNode } from 'react'
import { cx } from '../cx'

type Tone = 'navy' | 'offwhite' | 'strategic'

const TONES: Record<Tone, string> = {
  navy: 'bg-navy text-offwhite',
  offwhite: 'bg-offwhite text-navy',
  strategic: 'bg-strategic text-offwhite',
}

/** Full-width result section with a consistent label and rhythm. */
export function ResultBand({
  tone = 'navy',
  label,
  children,
  className,
}: {
  tone?: Tone
  label?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cx(TONES[tone], className)}>
      <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
        {label && (
          <p className={cx('eyebrow mb-6', tone === 'offwhite' ? 'text-graphite' : 'text-offwhite/65')}>
            {label}
          </p>
        )}
        {children}
      </div>
    </section>
  )
}

/** Small labelled record used for strongest / primary / secondary. */
export function ResultRecord({
  label,
  value,
  marked,
}: {
  label: string
  value: string
  marked?: boolean
}) {
  return (
    <div className="border-t border-graphite/25 py-5 sm:border-t-0 sm:border-l sm:px-6 sm:first:border-l-0 sm:first:pl-0">
      <p className="eyebrow text-graphite">{label}</p>
      <p className="mt-3 flex items-center gap-3 font-heading text-lg font-semibold text-navy">
        {marked && <span aria-hidden="true" className="h-px w-5 bg-amber" />}
        {value}
      </p>
    </div>
  )
}
