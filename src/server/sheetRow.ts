/**
 * Structured row for the "Responses" sheet. The application stays the
 * assessment engine; the sheet only receives raw answers plus the already
 * computed result. CRM-v2 stores selected labels and optional complements in
 * separate cells, with original option ids retained in technicalResponses.
 */
import { LEGACY_INSTRUMENT_VERSION } from '../assessment/instrument'
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
  'q1ClarityOpen',
  'q2Clarity',
  'q2ClarityOpen',
  'q3Interaction',
  'q3InteractionOpen',
  'q4Interaction',
  'q4InteractionOpen',
  'q5Interaction',
  'q5InteractionOpen',
  'q6AccessUnderPressure',
  'q6AccessUnderPressureOpen',
  'q7AccessUnderPressure',
  'q7AccessUnderPressureOpen',
  'q8AccessUnderPressure',
  'q8AccessUnderPressureOpen',
  'q9Independence',
  'q9IndependenceOpen',
  'q10Independence',
  'q10IndependenceOpen',
  'q11Transfer',
  'q11TransferOpen',
  'q12Transfer',
  'q12TransferOpen',
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
  'mostDemandingContext',
  'trainingReadinessTime',
  'trainingReadinessRepetition',
  'trainingReadinessRecording',
  'trainingReadinessWeaknessExposed',
  'trainingReadinessFeedback',
  'technicalResponses',
] as const

export type SheetColumn = (typeof SHEET_COLUMNS)[number]
export type SheetRow = Record<SheetColumn, string | number | boolean>

/** Readiness item → column, in instrument order (Q1–Q12). */
export const ITEM_COLUMNS: Record<string, SheetColumn> = {
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
  return /^(?:[=+\-@\t\r\n]|\s+[=+\-@])/.test(value) ? `'${value}` : value
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
  row.instrumentVersion = submission.instrumentVersion

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

  // Old clients retain their original representation, never relabeled as CRM-v2.
  if (submission.instrumentVersion === LEGACY_INSTRUMENT_VERSION) return row

  const selected = (id: string) => (submission.answerSnapshot[id] ?? []).join('\n')
  row.professionalContexts = selected('ctx_matters_most')
  row.englishUseFrequency = selected('ctx_frequency')
  row.spontaneousCommunicationPattern = selected('ctx_unprepared')
  row.mostDemandingContext = selected('ctx_most_demanding')
  row.perceivedFrictions = selected('frc_obstacles')
  for (const question of READINESS_QUESTIONS) {
    const column = ITEM_COLUMNS[question.id]
    row[column] = selected(question.id)
    row[`${column}Open` as SheetColumn] = asText(r.readiness[question.id]?.openText ?? '')
  }
  const trainingColumns: Record<string, SheetColumn> = {
    trn_time: 'trainingReadinessTime',
    trn_repetition: 'trainingReadinessRepetition',
    trn_recording: 'trainingReadinessRecording',
    trn_weakness_exposed: 'trainingReadinessWeaknessExposed',
    trn_feedback: 'trainingReadinessFeedback',
  }
  for (const [id, column] of Object.entries(trainingColumns)) row[column] = selected(id)
  // Exact validated ids/texts stay separate from human-facing cells; no weights
  // or unselected options are stored in this technical audit record.
  const { contact: _contact, ...answers } = r
  row.technicalResponses = JSON.stringify(answers)

  return row
}
