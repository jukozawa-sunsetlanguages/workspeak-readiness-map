import { forwardRef } from 'react'
import { SECTION_META, dimensionName } from '../assessment/content'
import type { StageId } from '../assessment/content'
import type { Answer, Question } from '../assessment/types'
import OptionList from './OptionList'
import TextAnswer from './TextAnswer'

interface Props {
  stage: StageId
  question: Question
  position: number
  total: number
  answer: Answer | undefined
  onChange: (answer: Answer) => void
}

/** Renders any configured question. Content comes entirely from config. */
const QuestionScreen = forwardRef<HTMLHeadingElement, Props>(function QuestionScreen(
  { stage, question, position, total, answer, onChange },
  headingRef,
) {
  const meta = SECTION_META[stage]
  const dimension = question.dimension ? dimensionName(question.dimension) : null

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="eyebrow text-offwhite/65">
          {meta.number} — {meta.title}
          {dimension && <span className="text-offwhite"> · {dimension}</span>}
        </p>
        <p className="eyebrow text-offwhite/55">
          {position} / {total}
        </p>
      </div>

      {position === 1 && meta.note.length > 0 && (
        <div className="mt-4 space-y-1.5 border-l border-offwhite/25 pl-4 text-sm leading-relaxed text-offwhite/70">
          {meta.note.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      )}

      <h1
        ref={headingRef}
        tabIndex={-1}
        className="mt-8 text-[1.4rem] leading-[1.3] font-semibold text-offwhite outline-none sm:text-[1.75rem]"
      >
        {question.prompt}
      </h1>
      {question.helper && <p className="mt-3 text-sm text-offwhite/65">{question.helper}</p>}

      <div className="mt-8">
        {question.kind === 'text' ? (
          <TextAnswer question={question} answer={answer} onChange={onChange} />
        ) : (
          <OptionList question={question} answer={answer} onChange={onChange} />
        )}
      </div>
    </div>
  )
})

export default QuestionScreen
