/**
 * Server-side validation. Responses are rebuilt from the question config, so
 * only known questions, known option ids and bounded free text survive; the
 * browser's values are never trusted as-is.
 */
import type { Attribution } from '../assessment/attribution'
import { QUESTIONS_BY_SECTION } from '../assessment/questions'
import { validateAnswer, validateContact } from '../assessment/steps'
import { MAX_EMAIL_ATTEMPTS } from '../assessment/submission'
import type { Answer, Responses, SectionAnswers, SectionId } from '../assessment/types'

export const MAX_BODY_BYTES = 32 * 1024

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export interface ValidSubmission {
  submissionId: string
  emailAttempt: number
  responses: Responses
  attribution: Attribution
}

type Obj = Record<string, unknown>
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v)

/** Trims, strips control characters and caps length. */
export function cleanText(value: unknown, max: number): string {
  if (typeof value !== 'string') return ''
  return value.replace(/[\u0000-\u001f\u007f]+/g, ' ').trim().slice(0, max)
}

function cleanSection(section: SectionId, raw: unknown): SectionAnswers | string {
  const input = isObj(raw) ? raw : {}
  const out: SectionAnswers = {}
  for (const question of QUESTIONS_BY_SECTION[section]) {
    const given = isObj(input[question.id]) ? (input[question.id] as Obj) : {}
    const ids = new Set(question.options?.map((o) => o.id) ?? [])
    const values = Array.isArray(given.values)
      ? [...new Set(given.values.filter((v): v is string => typeof v === 'string' && ids.has(v)))]
      : []
    const answer: Answer = {
      values: question.kind === 'single' ? values.slice(0, 1) : values,
    }
    const text = cleanText(given.text, question.kind === 'text' ? 240 : 120)
    const opensText = question.options?.some((o) => o.opensText && answer.values.includes(o.id))
    if (text && (question.kind === 'text' || opensText)) answer.text = text

    const problem = validateAnswer(question, answer)
    if (problem) return `${question.id}: ${problem}`
    if (answer.values.length || answer.text) out[question.id] = answer
  }
  return out
}

export function validateSubmission(
  body: unknown,
): { ok: true; value: ValidSubmission } | { ok: false; reason: string } {
  if (!isObj(body)) return { ok: false, reason: 'body' }
  const submissionId = typeof body.submissionId === 'string' ? body.submissionId : ''
  if (!UUID.test(submissionId)) return { ok: false, reason: 'submissionId' }

  const attempt = Number(body.emailAttempt)
  const emailAttempt = Number.isInteger(attempt) && attempt >= 1 && attempt <= MAX_EMAIL_ATTEMPTS ? attempt : 0
  if (!emailAttempt) return { ok: false, reason: 'emailAttempt' }

  const raw = isObj(body.responses) ? body.responses : {}
  const sections = {} as Record<SectionId, SectionAnswers>
  for (const section of Object.keys(QUESTIONS_BY_SECTION) as SectionId[]) {
    const cleaned = cleanSection(section, raw[section])
    if (typeof cleaned === 'string') return { ok: false, reason: cleaned }
    sections[section] = cleaned
  }

  const c = isObj(raw.contact) ? raw.contact : {}
  const contact = {
    firstName: cleanText(c.firstName, 100),
    email: cleanText(c.email, 254).toLowerCase(),
    role: cleanText(c.role, 150),
    // Only an explicit `true` counts as consent.
    marketingConsent: c.marketingConsent === true,
  }
  if (Object.keys(validateContact(contact)).length) return { ok: false, reason: 'contact' }

  const a = isObj(body.attribution) ? body.attribution : {}
  const attribution: Attribution = {
    source: cleanText(a.source, 200),
    utmSource: cleanText(a.utmSource, 200),
    utmMedium: cleanText(a.utmMedium, 200),
    utmCampaign: cleanText(a.utmCampaign, 200),
  }

  return {
    ok: true,
    value: { submissionId, emailAttempt, responses: { ...sections, contact }, attribution },
  }
}
