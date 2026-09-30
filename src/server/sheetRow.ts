/**
 * Structured row for the "Responses" sheet. The application stays the
 * assessment engine; the sheet only receives raw answers plus the already
 * computed result. Arrays/objects are JSON strings; Q1–Q12 store the selected
 * option id exactly as defined in questions.ts.
 */
import { INSTRUMENT_VERSION } from '../assessment/instrument'
import { READINESS_QUESTIONS } from '../assessment/questions'
import type { EmailStatus } from '../assessment/submission'
import type { DimensionId, MapResult, Responses, SectionAnswers } from '../assessment/types'
import type { ValidSubmission } from './validateSubmission'

/** Column order of the Responses sheet. Mirrored in google-apps-script/Code.gs. */
export const SHEET_COLUMNS = [
  'submissionId',
  'submittedAt',
  'instrumentVersion',
  'name',
  'email',
  'roleArea',
  'marketingConsent',
  'professionalContexts',
  'englishUseFrequency',
  'spontaneousCommunicationPattern',
  'q1Clarity',
  'q2Clarity',
  'q3Interaction',
  'q4Interaction',
  'q5Interaction',
  'q6AccessUnderPressure',
  'q7AccessUnderPressure',
  'q8AccessUnderPressure',
  'q9Independence',
  'q10Independence',
  'q11Transfer',
  'q12Transfer',
  'perceivedFrictions',
  'thirtyDayGoal',
  'trainingReadinessResponses',
  'trainingReadinessLabel',
  'clarityScore',
  'interactionScore',
  'accessUnderPressureScore',
  'independenceScore',
  'transferScore',
  'currentPattern',
  'strongestDimension',
  'primaryPatternToObserve',
  'secondaryPatternToObserve',
  'recommendedTrainingFocus',
  'bootcampFit',
  'resultEmailStatus',
  'resultEmailSentAt',
  'source',
  'utmSource',
  'utmMedium',
  'utmCampaign',
  'notes',
] as const

export type SheetColumn = (typeof SHEET_COLUMNS)[number]
export type SheetRow = Record<SheetColumn, string | number | boolean>

/** Readiness item → column, in instrument order (Q1–Q12). */
const ITEM_COLUMNS: Record<string, SheetColumn> = {
  clr_complex_idea: 'q1Clarity',
  clr_adapt_listener: 'q2Clarity',
  int_follow_up: 'q3Interaction',
  int_interrupted: 'q4Interaction',
  int_clarify: 'q5Interaction',
  acc_word_missing: 'q6AccessUnderPressure',
  acc_opinion_no_notice: 'q7AccessUnderPressure',
  acc_self_correction: 'q8AccessUnderPressure',
  ind_preparation: 'q9Independence',
  ind_language_unavailable: 'q10Independence',
  trf_practice_to_work: 'q11Transfer',
  trf_prepared_vs_spontaneous: 'q12Transfer',
}

const SCORE_COLUMNS: Record<DimensionId, SheetColumn> = {
  clarity: 'clarityScore',
  interaction: 'interactionScore',
  access: 'accessUnderPressureScore',
  independence: 'independenceScore',
  transfer: 'transferScore',
}

const first = (answers: SectionAnswers, id: string) => answers[id]?.values[0] ?? ''
const all = (answers: SectionAnswers, id: string) => JSON.stringify(answers[id]?.values ?? [])

/** Prevents spreadsheet formula injection from free text. */
function asText(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value
}

export function buildSheetRow(
  submission: ValidSubmission,
  submittedAt: string,
  result: MapResult,
  email: { status: EmailStatus; sentAt: string },
): SheetRow {
  const r: Responses = submission.responses
  const row = Object.fromEntries(SHEET_COLUMNS.map((c) => [c, ''])) as SheetRow

  row.submissionId = submission.submissionId
  row.submittedAt = submittedAt
  row.instrumentVersion = INSTRUMENT_VERSION

  row.name = asText(r.contact.firstName)
  row.email = asText(r.contact.email)
  row.roleArea = asText(r.contact.role)
  row.marketingConsent = r.contact.marketingConsent

  row.professionalContexts = all(r.context, 'ctx_matters_most')
  row.englishUseFrequency = first(r.context, 'ctx_frequency')
  row.spontaneousCommunicationPattern = first(r.context, 'ctx_unprepared')

  for (const q of READINESS_QUESTIONS) {
    const column = ITEM_COLUMNS[q.id]
    if (column) row[column] = first(r.readiness, q.id)
  }

  row.perceivedFrictions = all(r.friction, 'frc_obstacles')
  row.thirtyDayGoal = asText(r.friction.frc_focus_situation?.text ?? '')

  row.trainingReadinessResponses = JSON.stringify(
    Object.fromEntries(Object.entries(r.training).map(([id, a]) => [id, a.values[0] ?? ''])),
  )
  row.trainingReadinessLabel = result.trainingReadiness

  // Internal 0–3 means, for analysis only. Never shown to participants.
  for (const d of result.dimensions) row[SCORE_COLUMNS[d.id]] = Math.round(d.mean * 100) / 100

  row.currentPattern = result.patternName
  row.strongestDimension = result.strongest
  row.primaryPatternToObserve = result.primary ?? ''
  row.secondaryPatternToObserve = result.secondary ?? ''
  row.recommendedTrainingFocus = result.trainingPriority.title
  row.bootcampFit =
    result.nextStep.kind === 'bootcamp-fit' ? 'fit' : `not-yet:${result.nextStep.reason}`

  row.resultEmailStatus = email.status
  row.resultEmailSentAt = email.sentAt

  row.source = asText(submission.attribution.source)
  row.utmSource = asText(submission.attribution.utmSource)
  row.utmMedium = asText(submission.attribution.utmMedium)
  row.utmCampaign = asText(submission.attribution.utmCampaign)

  // Raw answers without a dedicated column, kept for reprocessing.
  const supplementary: Record<string, string> = {
    mostDemandingContext: first(r.context, 'ctx_most_demanding'),
  }
  if (r.context.ctx_matters_most?.text) supplementary.professionalContextsOther = r.context.ctx_matters_most.text
  if (r.friction.frc_obstacles?.text) supplementary.perceivedFrictionsOther = r.friction.frc_obstacles.text
  row.notes = asText(JSON.stringify(supplementary))

  return row
}
