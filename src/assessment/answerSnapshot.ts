import { QUESTIONS_BY_SECTION } from './questions'
import type { Responses, SectionId } from './types'

/** Only selected labels, captured from the same configuration rendered by the UI. */
export type AnswerSnapshot = Record<string, string[]>

export function captureAnswerSnapshot(responses: Responses): AnswerSnapshot {
  const snapshot: AnswerSnapshot = {}
  for (const section of Object.keys(QUESTIONS_BY_SECTION) as SectionId[]) {
    for (const question of QUESTIONS_BY_SECTION[section]) {
      if (!question.options) continue
      snapshot[question.id] = (responses[section][question.id]?.values ?? []).map(
        (id) => question.options!.find((option) => option.id === id)?.label ?? '',
      )
    }
  }
  return snapshot
}
