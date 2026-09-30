/**
 * Core types for the Communication Readiness Map.
 *
 * The data model deliberately keeps four kinds of data apart:
 *   - context       → where English needs to work (never scored)
 *   - readiness     → the ASSESSMENT PATTERN (reported behavior, interpreted)
 *   - friction      → SELF-PERCEIVED FRICTION (what the participant thinks is happening)
 *   - training      → TRAINING READINESS (feasibility of deliberate practice)
 */

export type SectionId = 'context' | 'readiness' | 'friction' | 'training'

export type DimensionId =
  | 'clarity'
  | 'interaction'
  | 'access'
  | 'independence'
  | 'transfer'

export type ContextKey =
  | 'meetings'
  | 'interviews'
  | 'presentations'
  | 'clients'
  | 'technical'
  | 'leadership'
  | 'networking'
  | 'negotiation'
  | 'other'

export interface AnswerOption {
  id: string
  label: string
  /**
   * Internal weight used by interpretation rules. Never shown to the participant.
   * Readiness: 0–3. Training: 0–2. Context/friction options have no weight.
   */
  weight?: number
  /** Selecting this option reveals a short free-text field. */
  opensText?: boolean
}

export type QuestionKind = 'single' | 'multi' | 'text'

export interface Question {
  id: string
  section: SectionId
  kind: QuestionKind
  prompt: string
  helper?: string
  options?: AnswerOption[]
  /** For `multi` questions. */
  maxSelections?: number
  /** Readiness items only. */
  dimension?: DimensionId
  optional?: boolean
  placeholder?: string
  /** Marks items that have not been reviewed by WorkSpeak. */
  draft?: boolean
}

export interface Answer {
  values: string[]
  text?: string
}

export type SectionAnswers = Record<string, Answer>

export interface ContactDetails {
  firstName: string
  email: string
  role: string
}

export interface Responses {
  context: SectionAnswers
  /** ASSESSMENT PATTERN input. */
  readiness: SectionAnswers
  /** SELF-PERCEIVED FRICTION. Not used to compute the pattern. */
  friction: SectionAnswers
  /** TRAINING READINESS. Kept separate from communication readiness. */
  training: SectionAnswers
  contact: ContactDetails
}

export type DimensionState =
  | 'strong'
  | 'functional'
  | 'developing'
  | 'priority'

export type TrainingReadinessLevel = 'high' | 'moderate' | 'constrained'

export interface DimensionReading {
  id: DimensionId
  /** Mean weight 0–3. Internal only — never rendered as a score. */
  mean: number
  state: DimensionState
}

export type NextStepState =
  | { kind: 'bootcamp-fit' }
  | {
      kind: 'not-yet'
      reason: 'training-constrained' | 'broadly-stable' | 'foundation' | 'low-use'
    }

export interface MapResult {
  patternName: string
  observation: string
  dimensions: DimensionReading[]
  strongest: DimensionId
  primary: DimensionId
  secondary: DimensionId | null
  hypothesis: string
  workExamples: { context: string; text: string }[]
  trainingPriority: { title: string; detail: string }
  trainingReadiness: TrainingReadinessLevel
  perceivedFriction: string[]
  focusSituation: string
  nextStep: NextStepState
}
