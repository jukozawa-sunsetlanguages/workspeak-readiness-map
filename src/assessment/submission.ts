/**
 * Client side of result delivery. The browser sends only raw responses; the
 * `submit-map` Netlify Function recomputes the result with the same
 * interpretation rules, emails it and records it in Google Sheets.
 *
 * Results are always rendered locally first; this never blocks them.
 */
import type { Attribution } from './attribution'
import type { Responses } from './types'

export const SUBMIT_ENDPOINT = '/api/submit-map'

/** Email attempts a participant can trigger (initial send + manual retries). */
export const MAX_EMAIL_ATTEMPTS = 3

export type EmailStatus = 'pending' | 'sent' | 'failed'

/** Persisted per session so a refresh never loses or duplicates delivery. */
export interface SubmissionState {
  id: string
  /** Serialized responses this submission belongs to. */
  fingerprint: string
  emailAttempt: number
  emailStatus: EmailStatus
  /** Whether the Sheets row was confirmed. */
  recorded: boolean
  /** True once delivery finished (successfully or not) for this attempt. */
  settled: boolean
}

export interface SubmitRequest {
  submissionId: string
  emailAttempt: number
  responses: Responses
  attribution: Attribution
}

export interface SubmitResponse {
  emailStatus: Exclude<EmailStatus, 'pending'>
  recorded: boolean
}

export function newSubmission(fingerprint: string): SubmissionState {
  return {
    id: crypto.randomUUID(),
    fingerprint,
    emailAttempt: 1,
    emailStatus: 'pending',
    recorded: false,
    settled: false,
  }
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function post(body: SubmitRequest): Promise<SubmitResponse | null> {
  try {
    const res = await fetch(SUBMIT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) return null
    return (await res.json()) as SubmitResponse
  } catch {
    return null
  }
}

/**
 * Sends the submission, retrying when the row was not recorded. Retries reuse
 * the same submissionId and attempt number, so the server never sends a
 * second email (Resend idempotency) or writes a second row (upsert by id).
 */
export async function submitAssessment(body: SubmitRequest): Promise<SubmitResponse> {
  const delays = [0, 4000, 12000]
  let last: SubmitResponse | null = null
  for (const delay of delays) {
    if (delay) await wait(delay)
    const res = await post(body)
    if (res) last = res
    if (res?.recorded) return res
  }
  return last ?? { emailStatus: 'failed', recorded: false }
}
