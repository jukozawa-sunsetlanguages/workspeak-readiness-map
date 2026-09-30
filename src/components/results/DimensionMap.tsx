import { DIMENSIONS, DIMENSION_STATES, dimensionName } from '../../assessment/content'
import type { DimensionId, DimensionReading } from '../../assessment/types'
import { cx } from '../cx'

interface Props {
  dimensions: DimensionReading[]
  primary: DimensionId
  secondary: DimensionId | null
}

/**
 * Qualitative map of the five working dimensions. Positions reflect the
 * qualitative state only — no numeric values are displayed.
 */
export default function DimensionMap({ dimensions, primary, secondary }: Props) {
  const positionOf = (state: DimensionReading['state']) =>
    DIMENSION_STATES.findIndex((s) => s.id === state) / (DIMENSION_STATES.length - 1)

  return (
    <div>
      {/* Scale header (desktop) */}
      <div className="hidden grid-cols-[minmax(0,17rem)_1fr] gap-10 pb-4 md:grid" aria-hidden="true">
        <span />
        <div className="relative h-4">
          {DIMENSION_STATES.map((s, i) => (
            <span
              key={s.id}
              className={cx(
                'eyebrow absolute top-0 whitespace-nowrap text-[10px]! text-offwhite/60',
                i === 0 && 'left-0',
                i === DIMENSION_STATES.length - 1 && 'right-0',
                i > 0 && i < DIMENSION_STATES.length - 1 && '-translate-x-1/2',
              )}
              style={
                i > 0 && i < DIMENSION_STATES.length - 1
                  ? { left: `${(i / (DIMENSION_STATES.length - 1)) * 100}%` }
                  : undefined
              }
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>

      <ul className="border-t border-offwhite/15">
        {dimensions.map((d) => {
          const meta = DIMENSIONS[d.id]
          const stateLabel = DIMENSION_STATES.find((s) => s.id === d.state)!.label
          const pos = positionOf(d.state)
          const isPrimary = d.id === primary
          const isSecondary = d.id === secondary
          return (
            <li
              key={d.id}
              className="grid grid-cols-1 gap-4 border-b border-offwhite/15 py-6 md:grid-cols-[minmax(0,17rem)_1fr] md:items-center md:gap-10"
            >
              <div>
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-heading text-base font-semibold">
                  {dimensionName(d.id)}
                  {(isPrimary || isSecondary) && (
                    <span className={cx('eyebrow text-[10px]!', isPrimary ? 'text-offwhite' : 'text-offwhite/70')}>
                      {isPrimary ? '· Prioritário para observar' : '· Secundário'}
                    </span>
                  )}
                </p>
                <p className="mt-1 text-[13px] leading-snug text-offwhite/65">{meta.question}</p>
              </div>

              <div>
                <div className="relative h-3" aria-hidden="true">
                  <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-offwhite/20" />
                  {DIMENSION_STATES.map((s, i) => (
                    <span
                      key={s.id}
                      className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-offwhite/35"
                      style={{ left: `${(i / (DIMENSION_STATES.length - 1)) * 100}%` }}
                    />
                  ))}
                  <div
                    className={cx('absolute top-1/2 h-[2px] -translate-y-1/2', isPrimary ? 'bg-amber' : 'bg-offwhite/70')}
                    style={{ width: `${pos * 100}%` }}
                  />
                  <span
                    className={cx(
                      'absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 border-2',
                      isPrimary ? 'border-amber bg-amber' : 'border-offwhite bg-strategic',
                    )}
                    style={{ left: `${pos * 100}%` }}
                  />
                </div>
                <p className="mt-3 text-sm font-medium text-offwhite">
                  <span className="sr-only">{dimensionName(d.id)}: </span>
                  {stateLabel}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
