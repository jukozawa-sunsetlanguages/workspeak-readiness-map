import { UI } from '../assessment/content'

interface Props {
  onBack?: () => void
  continueLabel?: string
}

/** Back / Continue controls. Continue is a submit button so Enter works in forms. */
export default function StepNav({ onBack, continueLabel = UI.continue }: Props) {
  return (
    <div className="mt-10 flex items-center justify-between gap-4 border-t border-offwhite/10 pt-6">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="px-1 py-3 text-sm font-medium text-offwhite/75 transition-colors hover:text-offwhite"
        >
          ← {UI.back}
        </button>
      ) : (
        <span />
      )}
      <button
        type="submit"
        className="shrink-0 bg-amber px-6 py-3.5 text-sm font-medium text-navy transition-colors hover:bg-amber/90"
      >
        {continueLabel} →
      </button>
    </div>
  )
}
