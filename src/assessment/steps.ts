/**
 * Derives the screen sequence from the question configuration.
 * One question per screen keeps the flow fast on mobile.
 */
import { VALIDATION } from './content'
import type { StageId } from './content'
import { QUESTIONS_BY_SECTION } from './questions'
import type { Answer, Question, Responses, SectionId } from './types'

export type Step =
  | { kind: 'intro' }
  | {
      kind: 'question'
      stage: StageId
      question: Question
      position: number
      total: number
    }
  | { kind: 'contact'; stage: StageId }
  | { kind: 'results'; stage: StageId }

const SECTION_SEQUENCE: SectionId[] = ['context', 'readiness', 'friction', 'training']

export const STEPS: Step[] = [
  { kind: 'intro' },
  ...SECTION_SEQUENCE.flatMap((section) => {
    const questions = QUESTIONS_BY_SECTION[section]
    return questions.map(
      (question, i): Step => ({
        kind: 'question',
        stage: section,
        question,
        position: i + 1,
        total: questions.length,
      }),
    )
  }),
  { kind: 'contact', stage: 'result' },
  { kind: 'results', stage: 'result' },
]

export const CONTACT_STEP = STEPS.findIndex((s) => s.kind === 'contact')
export const RESULTS_STEP = STEPS.length - 1

/** Returns a calm validation message, or null if the answer is complete. */
export function validateAnswer(question: Question, answer: Answer | undefined): string | null {
  if (question.kind === 'text') {
    if (question.optional) return null
    return answer?.text?.trim() ? null : VALIDATION.textRequired
  }
  const values = answer?.values ?? []
  if (values.length === 0) {
    return question.kind === 'multi' ? VALIDATION.multiRequired : VALIDATION.singleRequired
  }
  if (question.maxSelections && values.length > question.maxSelections) {
    return VALIDATION.tooMany(question.maxSelections)
  }
  const opensText = question.options?.some((o) => o.opensText && values.includes(o.id))
  if (opensText && !answer?.text?.trim()) {
    return VALIDATION.otherText
  }
  return null
}

export function getAnswer(responses: Responses, question: Question): Answer | undefined {
  return responses[question.section][question.id]
}

/** Stage progress in [0, 1] for each stage, used by the progress rail. */
export function stageProgress(stepIndex: number): Record<StageId, number> {
  const stages: StageId[] = ['context', 'readiness', 'friction', 'training', 'result']
  const result = {} as Record<StageId, number>
  for (const stage of stages) {
    const indices = STEPS.map((s, i) => ('stage' in s && s.stage === stage ? i : -1)).filter(
      (i) => i >= 0,
    )
    const first = indices[0]
    const count = indices.length
    if (stepIndex < first) result[stage] = 0
    else if (stepIndex >= first + count) result[stage] = 1
    else result[stage] = (stepIndex - first + 1) / count
  }
  return result
}

export type ContactErrors = Partial<Record<'firstName' | 'email' | 'role', string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContact(contact: Responses['contact']): ContactErrors {
  const errors: ContactErrors = {}
  if (!contact.firstName.trim()) errors.firstName = VALIDATION.firstName
  if (!contact.email.trim()) errors.email = VALIDATION.email
  else if (!EMAIL_PATTERN.test(contact.email.trim()))
    errors.email = VALIDATION.emailFormat
  if (!contact.role.trim()) errors.role = VALIDATION.role
  return errors
}
