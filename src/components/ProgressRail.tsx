import { STAGES } from '../assessment/content'
import { stageProgress } from '../assessment/steps'
import { cx } from './cx'

/**
 * Stage progress built on the Burnt Amber horizontal line — the line
 * extends as the participant moves from knowledge to use.
 */
export default function ProgressRail({ stepIndex }: { stepIndex: number }) {
  const progress = stageProgress(stepIndex)
  const currentIndex = STAGES.findIndex((s) => progress[s.id] > 0 && progress[s.id] < 1)
  const activeIndex = currentIndex === -1 ? STAGES.length - 1 : currentIndex

  return (
    <nav aria-label="Assessment progress" className="mx-auto max-w-5xl px-5 pt-5 sm:px-8">
      <p className="sr-only">
        Stage {activeIndex + 1} of {STAGES.length}: {STAGES[activeIndex].label}
      </p>
      <ol className="grid grid-cols-5 gap-1.5 sm:gap-3" aria-hidden="true">
        {STAGES.map((stage, i) => {
          const value = progress[stage.id]
          const isActive = i === activeIndex
          return (
            <li key={stage.id} className="min-w-0">
              <div className="h-[2px] w-full bg-offwhite/15">
                <div
                  className="h-full bg-amber transition-[width] duration-300 ease-out"
                  style={{ width: `${Math.round(value * 100)}%` }}
                />
              </div>
              <span
                className={cx(
                  'eyebrow mt-2 block truncate text-[10px]! sm:text-[11px]!',
                  isActive ? 'text-offwhite' : value === 1 ? 'text-offwhite/70' : 'text-offwhite/55',
                  !isActive && 'max-sm:invisible',
                )}
              >
                {stage.label}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
