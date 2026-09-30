/**
 * ============================================================================
 *  ASSESSMENT ITEMS — CENTRALIZED CONFIGURATION
 * ============================================================================
 *
 *  DRAFT — REQUIRES WORKSPEAK REVIEW BEFORE COMMERCIAL USE
 *
 *  Every item flagged `draft: true` was written for this MVP from the
 *  WorkSpeak behavioral definitions. None of them are validated. Weights are
 *  placeholders chosen to make the journey testable, not psychometric values.
 *
 *  To replace items: edit the arrays below. Components render whatever is
 *  here; interpretation rules only depend on `dimension` and `weight`.
 * ============================================================================
 */
import { CONTEXT_LABELS } from './content'
import type { ContextKey, Question } from './types'

const contextOptions = (keys: ContextKey[]) =>
  keys.map((k) => ({ id: k, label: CONTEXT_LABELS[k], opensText: k === 'other' }))

const ALL_CONTEXTS: ContextKey[] = [
  'meetings',
  'interviews',
  'presentations',
  'clients',
  'technical',
  'leadership',
  'networking',
  'negotiation',
]

/* -------------------------------------------------------------------------- */
/*  02 — PROFESSIONAL CONTEXT (context only — never scored)                    */
/* -------------------------------------------------------------------------- */

export const CONTEXT_QUESTIONS: Question[] = [
  {
    id: 'ctx_matters_most',
    section: 'context',
    kind: 'multi',
    maxSelections: 3,
    prompt: 'Where does English matter most in your professional life right now?',
    helper: 'Select up to 3.',
    options: contextOptions([...ALL_CONTEXTS, 'other']),
  },
  {
    id: 'ctx_frequency',
    section: 'context',
    kind: 'single',
    prompt: 'How often do you currently use English professionally?',
    options: [
      { id: 'rarely', label: 'Rarely or never' },
      { id: 'monthly', label: 'A few times per month' },
      { id: 'weekly', label: 'A few times per week' },
      { id: 'almost_daily', label: 'Almost every day' },
      { id: 'daily', label: 'Every day' },
    ],
  },
  {
    id: 'ctx_most_demanding',
    section: 'context',
    kind: 'single',
    prompt: 'Which situation currently demands the most from you?',
    options: contextOptions(ALL_CONTEXTS),
  },
  {
    id: 'ctx_unprepared',
    section: 'context',
    kind: 'single',
    prompt: 'How often do you need to respond without having time to prepare?',
    options: [
      { id: 'rarely', label: 'Rarely — most situations can be prepared' },
      { id: 'sometimes', label: 'Sometimes — a few times per month' },
      { id: 'often', label: 'Often — most weeks' },
      { id: 'constantly', label: 'Constantly — it is part of most conversations' },
    ],
  },
]

/* -------------------------------------------------------------------------- */
/*  03 — COMMUNICATION READINESS (ASSESSMENT PATTERN)                          */
/*  DRAFT — REQUIRES WORKSPEAK REVIEW BEFORE COMMERCIAL USE                    */
/*  Weight: 3 = most stable reported behavior … 0 = strongest breakdown.       */
/*  Option order is intentionally mixed so answers do not read good → bad.     */
/* -------------------------------------------------------------------------- */

export const READINESS_QUESTIONS: Question[] = [
  // ---- CLARITY -------------------------------------------------------------
  {
    id: 'clr_complex_idea',
    section: 'readiness',
    dimension: 'clarity',
    draft: true,
    kind: 'single',
    prompt: 'When you explain a complex idea in English at work, what usually happens?',
    options: [
      { id: 'a', weight: 2, label: 'The idea gets across, but I often need a second attempt to make it clear.' },
      { id: 'b', weight: 1, label: 'I start with background, and the main point arrives late or gets diluted.' },
      { id: 'c', weight: 3, label: 'I usually lead with the main point and add detail as the other person needs it.' },
      { id: 'd', weight: 0, label: 'I build long sentences, lose track of where they were going and leave the idea unfinished.' },
    ],
  },
  {
    id: 'clr_adapt_listener',
    section: 'readiness',
    dimension: 'clarity',
    draft: true,
    kind: 'single',
    prompt:
      'When you need to explain the same topic to a different listener — for example, a manager instead of a close colleague — what usually happens?',
    options: [
      { id: 'a', weight: 1, label: 'I keep the same explanation, because adjusting it in English takes too much processing.' },
      { id: 'b', weight: 3, label: 'I adjust the level of detail and vocabulary without much difficulty.' },
      { id: 'c', weight: 0, label: 'I simplify so much that important nuance disappears.' },
      { id: 'd', weight: 2, label: 'I adjust it, but the message becomes longer than it needs to be.' },
    ],
  },

  // ---- INTERACTION ---------------------------------------------------------
  {
    id: 'int_follow_up',
    section: 'readiness',
    dimension: 'interaction',
    draft: true,
    kind: 'single',
    prompt: 'During an unexpected follow-up question in English, what usually happens?',
    options: [
      { id: 'a', weight: 3, label: 'I can usually respond and develop the idea without extensive preparation.' },
      { id: 'b', weight: 2, label: 'I can respond, but I need extra time to organize what I want to say.' },
      { id: 'c', weight: 1, label: 'I often simplify or shorten the idea because I cannot access the language quickly enough.' },
      { id: 'd', weight: 0, label: 'I frequently lose the response or depend on someone or something else to continue.' },
    ],
  },
  {
    id: 'int_interrupted',
    section: 'readiness',
    dimension: 'interaction',
    draft: true,
    kind: 'single',
    prompt: 'When someone interrupts you in the middle of an explanation, what usually happens?',
    options: [
      { id: 'a', weight: 2, label: 'I respond to the interruption, but I often do not return to my original point.' },
      { id: 'b', weight: 0, label: 'I usually let the other person take over and do not come back to it.' },
      { id: 'c', weight: 3, label: 'I respond to the interruption and then return to where I was.' },
      { id: 'd', weight: 1, label: 'I lose the thread and need to restart the explanation from the beginning.' },
    ],
  },
  {
    id: 'int_clarify',
    section: 'readiness',
    dimension: 'interaction',
    draft: true,
    kind: 'single',
    prompt: 'When you do not fully understand what someone has just said, what do you usually do?',
    options: [
      { id: 'a', weight: 1, label: 'I respond to what I think they meant and hope it fits.' },
      { id: 'b', weight: 3, label: 'I ask a specific clarification question and continue from there.' },
      { id: 'c', weight: 0, label: 'I agree or stay quiet, and check later by message or with a colleague.' },
      { id: 'd', weight: 2, label: 'I ask them to repeat, and sometimes still respond to a partial understanding.' },
    ],
  },

  // ---- ACCESS UNDER PRESSURE -----------------------------------------------
  // Framed as observable behavior, not as anxiety.
  {
    id: 'acc_word_missing',
    section: 'readiness',
    dimension: 'access',
    draft: true,
    kind: 'single',
    prompt:
      'In a live conversation, you need a specific word and it does not come. What usually happens?',
    options: [
      { id: 'a', weight: 1, label: 'I stop and search for the exact word, and the sentence loses momentum.' },
      { id: 'b', weight: 3, label: 'I describe it another way and keep going.' },
      { id: 'c', weight: 2, label: 'I pause briefly, find an alternative and continue.' },
      { id: 'd', weight: 0, label: 'I abandon the sentence and move to something simpler to say.' },
    ],
  },
  {
    id: 'acc_opinion_no_notice',
    section: 'readiness',
    dimension: 'access',
    draft: true,
    kind: 'single',
    prompt: 'You are asked for your opinion in a meeting without notice. What usually happens?',
    options: [
      { id: 'a', weight: 2, label: 'There is a noticeable delay before I start, but then I continue.' },
      { id: 'b', weight: 1, label: 'I know my view, but by the time it is organized in English the conversation has moved on.' },
      { id: 'c', weight: 0, label: 'I say something brief or agree with someone else to avoid a long silence.' },
      { id: 'd', weight: 3, label: 'I give a first answer and develop it as I speak.' },
    ],
  },
  {
    id: 'acc_self_correction',
    section: 'readiness',
    dimension: 'access',
    draft: true,
    kind: 'single',
    prompt: 'While speaking under time pressure, how often do you correct yourself mid-sentence?',
    options: [
      { id: 'a', weight: 3, label: 'Rarely — I let small mistakes go when the meaning is clear.' },
      { id: 'b', weight: 2, label: 'Sometimes — mainly when a mistake could change the meaning.' },
      { id: 'c', weight: 1, label: 'Often — I restart sentences to fix grammar or word choice.' },
      { id: 'd', weight: 0, label: 'Very often — correcting takes more attention than the idea itself.' },
    ],
  },

  // ---- INDEPENDENCE --------------------------------------------------------
  {
    id: 'ind_preparation',
    section: 'readiness',
    dimension: 'independence',
    draft: true,
    kind: 'single',
    prompt: 'Before an important conversation in English, what do you usually do?',
    options: [
      { id: 'a', weight: 1, label: 'I write out most of what I plan to say, often in full sentences.' },
      { id: 'b', weight: 3, label: 'I note a few key points and speak from them.' },
      { id: 'c', weight: 0, label: 'I write it in my native language first and translate it.' },
      { id: 'd', weight: 2, label: 'I prepare the main ideas and a few key phrases in advance.' },
    ],
  },
  {
    id: 'ind_language_unavailable',
    section: 'readiness',
    dimension: 'independence',
    draft: true,
    kind: 'single',
    prompt:
      'During a conversation, the language you need is not available. What usually happens next?',
    options: [
      { id: 'a', weight: 2, label: 'I continue with a simpler version and follow up in writing to add precision.' },
      { id: 'b', weight: 0, label: 'A colleague often steps in or finishes the explanation for me.' },
      { id: 'c', weight: 1, label: 'I pause to check a translation tool or my notes before continuing.' },
      { id: 'd', weight: 3, label: 'I simplify the message and continue, even if it is not perfectly expressed.' },
    ],
  },

  // ---- TRANSFER ------------------------------------------------------------
  {
    id: 'trf_studied_expression',
    section: 'readiness',
    dimension: 'transfer',
    draft: true,
    kind: 'single',
    prompt:
      'You have studied or practiced a useful expression. What usually happens when you need it at work?',
    options: [
      { id: 'a', weight: 2, label: 'I use it in writing first; in speech it takes longer to appear.' },
      { id: 'b', weight: 0, label: 'I tend to fall back on the same familiar phrases I have always used.' },
      { id: 'c', weight: 3, label: 'I can usually use it in a real conversation within a short time.' },
      { id: 'd', weight: 1, label: 'I recognize it when others use it, but it rarely comes out when I speak.' },
    ],
  },
  {
    id: 'trf_prepared_vs_spontaneous',
    section: 'readiness',
    dimension: 'transfer',
    draft: true,
    kind: 'single',
    prompt:
      'Compare prepared situations (classes, rehearsals, planned presentations) with spontaneous work situations. What usually happens?',
    options: [
      { id: 'a', weight: 1, label: 'I perform well when prepared, but lose stability when things go off-plan.' },
      { id: 'b', weight: 3, label: 'My communication is broadly similar in both.' },
      { id: 'c', weight: 2, label: 'Spontaneous situations are a little less precise, but still stable.' },
      { id: 'd', weight: 0, label: 'What I can do in class or rehearsal rarely appears in real work situations.' },
    ],
  },
]

/* -------------------------------------------------------------------------- */
/*  04 — PERCEIVED FRICTION (SELF-PERCEIVED — not used to compute the pattern) */
/* -------------------------------------------------------------------------- */

export const FRICTION_QUESTIONS: Question[] = [
  {
    id: 'frc_obstacles',
    section: 'friction',
    kind: 'multi',
    maxSelections: 2,
    prompt: 'What most often gets in the way when you need to communicate in English at work?',
    helper: 'Select up to 2.',
    options: [
      { id: 'finding_words', label: 'Finding words quickly enough' },
      { id: 'organizing_thoughts', label: 'Organizing my thoughts' },
      { id: 'understanding', label: 'Understanding the other person' },
      { id: 'fear_mistakes', label: 'Fear of making mistakes' },
      { id: 'structuring', label: 'Structuring my message' },
      { id: 'keeping_going', label: 'Keeping my answer going' },
      { id: 'recovering', label: 'Recovering when something goes wrong' },
      { id: 'lack_practice', label: 'Lack of real practice' },
      { id: 'vocabulary', label: 'Vocabulary' },
      { id: 'other', label: 'Other', opensText: true },
    ],
  },
  {
    id: 'frc_focus_situation',
    section: 'friction',
    kind: 'text',
    optional: true,
    prompt:
      'If you could improve one professional communication situation in the next 30 days, what would it be?',
    helper: 'A short sentence is enough.',
    placeholder: 'For example: giving updates in the weekly project meeting',
  },
]

/* -------------------------------------------------------------------------- */
/*  05 — TRAINING READINESS (behavioral feasibility — not motivation)          */
/*  DRAFT — REQUIRES WORKSPEAK REVIEW BEFORE COMMERCIAL USE                    */
/*  Weight: 2 = feasible now, 1 = feasible with adjustment, 0 = constrained.   */
/* -------------------------------------------------------------------------- */

export const TRAINING_QUESTIONS: Question[] = [
  {
    id: 'trn_time',
    section: 'training',
    draft: true,
    kind: 'single',
    prompt:
      'In a typical week, how realistic is 15–25 minutes of focused practice on most days?',
    options: [
      { id: 'a', weight: 2, label: 'Realistic — I can protect that time.' },
      { id: 'b', weight: 1, label: 'Possible on some days, but not most.' },
      { id: 'c', weight: 0, label: 'Difficult at the moment because of workload or other commitments.' },
    ],
  },
  {
    id: 'trn_repetition',
    section: 'training',
    draft: true,
    kind: 'single',
    prompt:
      'Some practice involves repeating the same communication task several times with small adjustments. What would you most likely do?',
    options: [
      { id: 'a', weight: 1, label: 'Do it, although repetition may feel slow.' },
      { id: 'b', weight: 2, label: 'Repeat it and look for what changes between attempts.' },
      { id: 'c', weight: 0, label: 'Move on after one or two attempts.' },
    ],
  },
  {
    id: 'trn_recording',
    section: 'training',
    draft: true,
    kind: 'single',
    prompt: 'Some tasks require recording a short voice or video response. What is most likely?',
    options: [
      { id: 'a', weight: 2, label: 'I would record it and review it.' },
      { id: 'b', weight: 1, label: 'I would record it, but might avoid listening back.' },
      { id: 'c', weight: 0, label: 'Recording is not practical for me right now (privacy, environment or equipment).' },
    ],
  },
  {
    id: 'trn_weakness_exposed',
    section: 'training',
    draft: true,
    kind: 'single',
    prompt:
      'If a practice exposed a communication weakness, what would you be most likely to do?',
    options: [
      { id: 'a', weight: 0, label: 'Focus on tasks where I already perform well.' },
      { id: 'b', weight: 2, label: 'Treat it as information and try the task again with one adjustment.' },
      { id: 'c', weight: 1, label: 'Take a break and return to it later.' },
    ],
  },
  {
    id: 'trn_feedback',
    section: 'training',
    draft: true,
    kind: 'single',
    prompt: 'When you receive specific feedback on how you communicated, what usually happens?',
    options: [
      { id: 'a', weight: 2, label: 'I try to apply one concrete change the next time.' },
      { id: 'b', weight: 1, label: 'I understand it, but applying it takes a few reminders.' },
      { id: 'c', weight: 1, label: 'I find it hard to use unless it comes with a worked example.' },
      { id: 'd', weight: 0, label: 'I rarely have the opportunity to apply it before the next situation.' },
    ],
  },
]

export const QUESTIONS_BY_SECTION = {
  context: CONTEXT_QUESTIONS,
  readiness: READINESS_QUESTIONS,
  friction: FRICTION_QUESTIONS,
  training: TRAINING_QUESTIONS,
} as const

export function findQuestion(id: string): Question | undefined {
  return Object.values(QUESTIONS_BY_SECTION)
    .flat()
    .find((q) => q.id === id)
}
