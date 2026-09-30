import type { Answer, Question } from '../assessment/types'

interface Props {
  question: Question
  answer: Answer | undefined
  onChange: (answer: Answer) => void
}

export default function TextAnswer({ question, answer, onChange }: Props) {
  const id = `${question.id}-text`
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {question.prompt}
      </label>
      <textarea
        id={id}
        rows={3}
        maxLength={240}
        placeholder={question.placeholder}
        value={answer?.text ?? ''}
        onChange={(e) => onChange({ values: [], text: e.target.value })}
        className="w-full resize-none border border-offwhite/25 bg-offwhite/[0.04] px-4 py-3 text-base leading-relaxed text-offwhite placeholder:text-offwhite/40 focus:border-amber focus:outline-none"
      />
      <p className="mt-2 text-right text-xs text-offwhite/55">{(answer?.text ?? '').length}/240</p>
    </div>
  )
}
