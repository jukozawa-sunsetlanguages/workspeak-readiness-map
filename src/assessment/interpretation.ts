/**
 * Interpretation rules — PLACEHOLDER LOGIC.
 *
 * This is not psychometric scoring. It averages placeholder weights per
 * dimension and maps them to qualitative states so the journey can be tested.
 * Replace thresholds and rules here once WorkSpeak finalizes the profile model.
 */
import { CONTEXT_LABELS, DIMENSION_ORDER } from './content'
import {
  FRICTION_QUESTIONS,
  READINESS_QUESTIONS,
  TRAINING_QUESTIONS,
} from './questions'
import { BROADLY_STABLE_PROFILE, PROFILES } from './profiles'
import type {
  ContextKey,
  DimensionId,
  DimensionReading,
  DimensionState,
  MapResult,
  NextStepState,
  Question,
  Responses,
  SectionAnswers,
  TrainingReadinessLevel,
} from './types'

/*
 * These weights rank self-reported response patterns for MVP interpretation.
 * They do not represent interval measurement, validated severity, proficiency
 * or psychometric scoring.
 *
 * Thresholds on a 0–3 mean.
 */
const STATE_THRESHOLDS: { min: number; state: DimensionState }[] = [
  { min: 2.5, state: 'strong' },
  { min: 1.75, state: 'functional' },
  { min: 1, state: 'developing' },
  { min: -Infinity, state: 'priority' },
]

/* Thresholds on a 0–2 mean. */
const TRAINING_THRESHOLDS: { min: number; level: TrainingReadinessLevel }[] = [
  { min: 1.5, level: 'high' },
  { min: 0.9, level: 'moderate' },
  { min: -Infinity, level: 'constrained' },
]

/** If every dimension is below this mean, suggest building a foundation first. */
const FOUNDATION_CEILING = 1

function weightOf(question: Question, answers: SectionAnswers): number | null {
  const chosen = answers[question.id]?.values[0]
  const option = question.options?.find((o) => o.id === chosen)
  return option?.weight ?? null
}

function mean(values: number[]): number {
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0
}

export function readDimensions(readiness: SectionAnswers): DimensionReading[] {
  return DIMENSION_ORDER.map((id) => {
    const weights = READINESS_QUESTIONS.filter((q) => q.dimension === id)
      .map((q) => weightOf(q, readiness))
      .filter((w): w is number => w !== null)
    const m = mean(weights)
    const state = STATE_THRESHOLDS.find((t) => m >= t.min)!.state
    return { id, mean: m, state }
  })
}

export function readTrainingReadiness(training: SectionAnswers): TrainingReadinessLevel {
  const weights = TRAINING_QUESTIONS.map((q) => weightOf(q, training)).filter(
    (w): w is number => w !== null,
  )
  const m = mean(weights)
  return TRAINING_THRESHOLDS.find((t) => m >= t.min)!.level
}

function labelsFor(question: Question, answers: SectionAnswers): string[] {
  const answer = answers[question.id]
  if (!answer) return []
  return answer.values.map((v) => {
    const option = question.options?.find((o) => o.id === v)
    if (option?.opensText && answer.text?.trim()) return answer.text.trim()
    return option?.label ?? v
  })
}

function pickWorkExamples(
  examples: Partial<Record<ContextKey, string>>,
  responses: Responses,
): { context: string; text: string }[] {
  const demanding = responses.context.ctx_most_demanding?.values[0] as ContextKey | undefined
  const matters = (responses.context.ctx_matters_most?.values ?? []) as ContextKey[]
  const fallback: ContextKey[] = ['meetings', 'interviews', 'clients']
  const ordered = [demanding, ...matters, ...fallback].filter(
    (k): k is ContextKey => !!k && k !== 'other' && !!examples[k],
  )
  const unique = [...new Set(ordered)].slice(0, 3)
  return unique.map((k) => ({ context: CONTEXT_LABELS[k], text: examples[k]! }))
}

function decideNextStep(
  dimensions: DimensionReading[],
  training: TrainingReadinessLevel,
  responses: Responses,
): NextStepState {
  if (responses.context.ctx_frequency?.values[0] === 'rarely') {
    return { kind: 'not-yet', reason: 'low-use' }
  }
  if (dimensions.every((d) => d.mean < FOUNDATION_CEILING)) {
    return { kind: 'not-yet', reason: 'foundation' }
  }
  if (dimensions.every((d) => d.state === 'strong')) {
    return { kind: 'not-yet', reason: 'broadly-stable' }
  }
  if (training === 'constrained') {
    return { kind: 'not-yet', reason: 'training-constrained' }
  }
  return { kind: 'bootcamp-fit' }
}

export function buildMapResult(responses: Responses): MapResult {
  const dimensions = readDimensions(responses.readiness)

  // Stable sort keeps DIMENSION_ORDER as the tie-breaker.
  const ascending = [...dimensions].sort((a, b) => a.mean - b.mean)
  const strongest = [...dimensions].sort((a, b) => b.mean - a.mean)[0].id
  const lowest: DimensionId = ascending[0].id
  const secondCandidate = ascending[1]
  const secondary =
    secondCandidate && secondCandidate.state !== 'strong' && secondCandidate.id !== strongest
      ? secondCandidate.id
      : null

  // When every dimension is Strong, one dimension is still numerically lowest,
  // but that is not a reported breakdown: no primary pattern is named and the
  // broadly-stable profile supplies all copy, including work examples.
  const allStrong = dimensions.every((d) => d.state === 'strong')
  const base = allStrong ? BROADLY_STABLE_PROFILE : PROFILES[lowest]
  const primary = allStrong ? null : lowest

  const trainingReadiness = readTrainingReadiness(responses.training)
  const [obstacles, focus] = FRICTION_QUESTIONS

  return {
    patternName: base.patternName,
    patternLabel: base.patternLabel,
    observation: base.observation,
    dimensions,
    strongest,
    primary,
    secondary,
    hypothesis: base.hypothesis,
    workExamples: pickWorkExamples(base.workExamples, responses),
    trainingPriority: base.trainingPriority,
    trainingReadiness,
    perceivedFriction: labelsFor(obstacles, responses.friction),
    focusSituation: responses.friction[focus.id]?.text?.trim() ?? '',
    nextStep: decideNextStep(dimensions, trainingReadiness, responses),
  }
}
