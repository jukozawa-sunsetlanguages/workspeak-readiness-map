import type { Answer, Question } from '../assessment/types'
import { cx } from './cx'

interface Props {
  question: Question
  answer: Answer | undefined
  onChange: (answer: Answer) => void
}

const LETTERS = 'ABCDEFGHIJKL'

/** Reusable single/multi-choice answer list using native inputs for keyboard access. */
export default function OptionList({ question, answer, onChange }: Props) {
  const options = question.options ?? []
  const values = answer?.values ?? []
  const multi = question.kind === 'multi'
  const max = question.maxSelections
  const atMax = multi && !!max && values.length >= max
  const otherOption = options.find((o) => o.opensText)
  const otherSelected = !!otherOption && values.includes(otherOption.id)

  function toggle(id: string) {
    const opensText = options.find((o) => o.id === id)?.opensText
    if (multi) {
      const next = values.includes(id) ? values.filter((v) => v !== id) : [...values, id]
      onChange({ values: next, text: answer?.text })
    } else {
      onChange({ values: [id], text: opensText ? answer?.text : undefined })
    }
  }

  return (
    <fieldset>
      <legend className="sr-only">{question.prompt}</legend>
      {multi && max && (
        <p className="mb-3 text-sm text-offwhite/65" aria-live="polite">
          {values.length} of {max} selected
        </p>
      )}
      <ul className="border-t border-offwhite/12">
        {options.map((option, i) => {
          const checked = values.includes(option.id)
          const disabled = atMax && !checked
          return (
            <li key={option.id} className="border-b border-offwhite/12">
              <label
                className={cx(
                  'relative flex cursor-pointer items-start gap-4 px-4 py-4 transition-colors sm:px-5',
                  'has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-amber has-[input:focus-visible]:-outline-offset-2',
                  checked ? 'bg-strategic' : 'hover:bg-offwhite/[0.04]',
                  disabled && 'cursor-not-allowed opacity-45 hover:bg-transparent',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cx('absolute inset-y-0 left-0 w-[3px]', checked ? 'bg-amber' : 'bg-transparent')}
                />
                <input
                  type={multi ? 'checkbox' : 'radio'}
                  name={question.id}
                  value={option.id}
                  checked={checked}
                  disabled={disabled}
                  onChange={() => toggle(option.id)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={cx(
                    'mt-px flex h-6 w-6 shrink-0 items-center justify-center border text-[11px] font-medium transition-colors',
                    multi ? 'rounded-[2px]' : 'rounded-full',
                    checked
                      ? 'border-amber bg-amber text-navy'
                      : 'border-offwhite/35 text-offwhite/70',
                  )}
                >
                  {checked && multi ? '✓' : LETTERS[i]}
                </span>
                <span className={cx('text-[15px] leading-relaxed sm:text-base', checked ? 'text-offwhite' : 'text-offwhite/90')}>
                  {option.label}
                </span>
              </label>
            </li>
          )
        })}
      </ul>

      {otherSelected && (
        <div className="mt-5">
          <label htmlFor={`${question.id}-other`} className="mb-2 block text-sm text-offwhite/75">
            Describe “Other” in a few words
          </label>
          <input
            id={`${question.id}-other`}
            type="text"
            maxLength={120}
            value={answer?.text ?? ''}
            onChange={(e) => onChange({ values, text: e.target.value })}
            className="w-full border border-offwhite/25 bg-offwhite/[0.04] px-4 py-3 text-offwhite placeholder:text-offwhite/40 focus:border-amber focus:outline-none"
          />
        </div>
      )}
    </fieldset>
  )
}
