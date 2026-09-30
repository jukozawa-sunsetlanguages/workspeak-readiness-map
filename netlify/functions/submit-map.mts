import type { Config, Context } from '@netlify/functions'
import { buildMapResult } from '../../src/assessment/interpretation'
import { sendResultEmail, writeSheetRow } from '../../src/server/integrations'
import { renderResultEmail } from '../../src/server/resultEmail'
import { buildSheetRow } from '../../src/server/sheetRow'
import { MAX_BODY_BYTES, validateSubmission } from '../../src/server/validateSubmission'

/**
 * Receives a completed Map, recomputes the result with the shared
 * interpretation rules, emails it, then records one row in Google Sheets.
 *
 * Ordering: email first, then the row, so the row is written once with the
 * final email status (no second write to update it). Retries from the client
 * reuse the submissionId: Resend's idempotency key prevents a duplicate email
 * and the Apps Script upserts by submissionId, so no duplicate row either.
 * Participants already see their Results; failures here only affect delivery.
 */
export default async (req: Request, _context: Context) => {
  const raw = await req.text()
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
    return Response.json({ error: 'payload_too_large' }, { status: 413 })
  }
  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    return Response.json({ error: 'invalid' }, { status: 400 })
  }

  const parsed = validateSubmission(body)
  if (!parsed.ok) {
    console.warn(`[submit-map] rejected submission (${parsed.reason})`)
    return Response.json({ error: 'invalid' }, { status: 400 })
  }
  const submission = parsed.value
  const { submissionId, emailAttempt, responses } = submission
  const submittedAt = new Date().toISOString()
  const result = buildMapResult(responses)

  // Recipient, subject and body all come from the validated submission and the
  // fixed template: the endpoint cannot be used as a general email relay.
  const email = renderResultEmail(result, responses.contact.firstName)
  const sent = await sendResultEmail(
    { to: responses.contact.email, ...email },
    `crm-${submissionId}-${emailAttempt}`,
    submissionId,
  )
  const emailState = sent
    ? { status: 'sent' as const, sentAt: new Date().toISOString() }
    : { status: 'failed' as const, sentAt: '' }

  const recorded = await writeSheetRow(
    buildSheetRow(submission, submittedAt, result, emailState),
    submissionId,
  )

  return Response.json({ emailStatus: emailState.status, recorded })
}

export const config: Config = {
  path: '/api/submit-map',
  method: 'POST',
  rateLimit: { windowLimit: 12, windowSize: 60, aggregateBy: ['ip', 'domain'] },
}
