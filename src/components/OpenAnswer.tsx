import { useState } from 'react'
import { OPEN_ANSWER_COPY } from '../assessment/content'
import { MAX_OPEN_TEXT_LENGTH } from '../assessment/instrument'
import type { Answer, Question } from '../assessment/types'

interface Props {
  question: Question
  answer: Answer | undefined
  onChange: (answer: Answer) => void
}

/** Native disclosure keeps the optional context quiet and keyboard accessible. */
export default function OpenAnswer({ question, answer, onChange }: Props) {
  const id = `${question.id}-open`
  const [expanded, setExpanded] = useState(Boolean(answer?.openText))
  return (
    <details open={expanded} onToggle={(event) => setExpanded(event.currentTarget.open)} className="mt-6 border-b border-offwhite/12 pb-4">
      <summary className="cursor-pointer text-sm leading-relaxed text-offwhite/70 underline-offset-4 hover:text-offwhite focus-visible:outline-2 focus-visible:outline-amber">
        {OPEN_ANSWER_COPY.summary}
      </summary>
      <div className="mt-4">
        <label htmlFor={id} className="mb-2 block text-sm leading-relaxed text-offwhite/75">
          {OPEN_ANSWER_COPY.helper}
        </label>
        <textarea
          id={id}
          rows={3}
          maxLength={MAX_OPEN_TEXT_LENGTH}
          placeholder={OPEN_ANSWER_COPY.placeholder}
          value={answer?.openText ?? ''}
          onChange={(e) => onChange({ ...answer, values: answer?.values ?? [], openText: e.target.value })}
          className="w-full resize-y border border-offwhite/25 bg-offwhite/[0.04] px-4 py-3 text-base leading-relaxed text-offwhite placeholder:text-offwhite/40 focus:border-amber focus:outline-none"
        />
      </div>
    </details>
  )
}
