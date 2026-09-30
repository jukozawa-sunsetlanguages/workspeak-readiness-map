/**
 * Static copy and labels. Keep interface text here so it can be revised
 * without touching components or interpretation rules.
 */
import type {
  ContextKey,
  DimensionId,
  DimensionState,
  TrainingReadinessLevel,
} from './types'

export const BRAND = {
  parent: 'Sunset Languages',
  system: 'WorkSpeak™',
  product: 'Communication Readiness Map',
  principle: 'Evidence before confidence.',
}

/** Placeholder destination until the Bootcamp page exists. */
export const BOOTCAMP_URL = '#bootcamp'

export const INTRO = {
  headline: 'How ready is your English for real professional pressure?',
  support:
    'Map what happens to your communication when you need to explain, respond, interact or think on the spot.',
  clarification:
    'This is not an English proficiency test. It helps you reflect on how your communication currently behaves in professional situations.',
  facts: [
    { value: '~5 minutes', label: 'Duration' },
    { value: 'Immediate initial reading', label: 'Output' },
    { value: 'Professional communication focus', label: 'Scope' },
  ],
  cta: 'Map my communication readiness',
}

/** Progress stages shown in the progress rail. */
export const STAGES = [
  { id: 'context', label: 'Context' },
  { id: 'readiness', label: 'Readiness' },
  { id: 'friction', label: 'Friction' },
  { id: 'training', label: 'Training' },
  { id: 'result', label: 'Result' },
] as const

export type StageId = (typeof STAGES)[number]['id']

export const SECTION_META: Record<
  StageId,
  { number: string; title: string; note: string }
> = {
  context: {
    number: '02',
    title: 'Professional context',
    note: 'Where English needs to work. These answers give context — they are not scored.',
  },
  readiness: {
    number: '03',
    title: 'Communication readiness',
    note: 'Choose the option closest to what usually happens — not what you would like to happen.',
  },
  friction: {
    number: '04',
    title: 'Perceived friction',
    note: 'What you think is limiting your communication. Kept separate from your response pattern.',
  },
  training: {
    number: '05',
    title: 'Training readiness',
    note: 'Whether deliberate practice is currently feasible for you. This is not a judgment of motivation.',
  },
  result: {
    number: '06',
    title: 'Result access',
    note: 'Your answers are used to generate your initial Communication Readiness Map.',
  },
}

export const DIMENSIONS: Record<
  DimensionId,
  { label: string; question: string }
> = {
  clarity: {
    label: 'Clarity',
    question: 'Can you turn an idea into a message another person can follow?',
  },
  interaction: {
    label: 'Interaction',
    question: 'Can you respond, clarify, recover and sustain an exchange?',
  },
  access: {
    label: 'Access Under Pressure',
    question:
      'Can you access English you already know when time, uncertainty or interaction creates pressure?',
  },
  independence: {
    label: 'Independence',
    question: 'How much support do you need before or during communication?',
  },
  transfer: {
    label: 'Transfer',
    question:
      'Can knowledge and practice be used in the professional context where they matter?',
  },
}

export const DIMENSION_ORDER: DimensionId[] = [
  'clarity',
  'interaction',
  'access',
  'independence',
  'transfer',
]

/** Ordered from least to most stable — used by the dimension map scale. */
export const DIMENSION_STATES: { id: DimensionState; label: string }[] = [
  { id: 'priority', label: 'Priority to observe' },
  { id: 'developing', label: 'Developing' },
  { id: 'functional', label: 'Functional' },
  { id: 'strong', label: 'Strong' },
]

export const TRAINING_READINESS_LABELS: Record<
  TrainingReadinessLevel,
  { label: string; text: string }
> = {
  high: {
    label: 'High',
    text: 'Based on what you reported, current conditions appear to support regular deliberate practice, including repetition, recording and feedback.',
  },
  moderate: {
    label: 'Moderate',
    text: 'Based on what you reported, deliberate practice looks feasible with some adjustment — for example, protecting time or getting used to recording and repetition.',
  },
  constrained: {
    label: 'Currently constrained',
    text: 'Based on what you reported, current conditions — time, environment or practical access — may make regular deliberate practice difficult right now. This describes circumstances, not commitment.',
  },
}

export const CONTEXT_LABELS: Record<ContextKey, string> = {
  meetings: 'Meetings',
  interviews: 'Job interviews',
  presentations: 'Presentations',
  clients: 'Client conversations',
  technical: 'Technical explanations',
  leadership: 'Conversations with leadership',
  networking: 'Networking',
  negotiation: 'Negotiation',
  other: 'Other',
}

export const CONTACT_COPY = {
  headline: 'Your map is ready to generate.',
  explanation: 'Your answers are used to generate your initial Communication Readiness Map.',
  // Accurate for the MVP, where nothing is submitted. Update when submission is added.
  privacy:
    'In this test version, your details and answers stay in this browser session. There is no marketing opt-in on this screen.',
  cta: 'View my map',
}
