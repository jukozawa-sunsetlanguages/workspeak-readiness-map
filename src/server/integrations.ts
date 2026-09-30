/**
 * Outbound integrations. Both return a status instead of throwing, and log
 * only ids and status codes: never secrets, payloads or personal data.
 */
// Brings the global `Netlify` (env access) type into scope.
import type {} from '@netlify/functions'
import type { SheetRow } from './sheetRow'

const DEFAULT_FROM = 'WorkSpeak by Sunset Languages <results@sunsetlanguages.com.br>'

const env = (name: string) => Netlify.env.get(name)?.trim() || undefined

export interface EmailMessage {
  to: string
  subject: string
  html: string
  text: string
}

/**
 * Sends the predefined result email. The idempotency key makes retries of the
 * same submission/attempt return the original send instead of a duplicate.
 */
export async function sendResultEmail(
  message: EmailMessage,
  idempotencyKey: string,
  submissionId: string,
): Promise<boolean> {
  const apiKey = env('RESEND_API_KEY')
  if (!apiKey) {
    console.error(`[submit-map] ${submissionId}: RESEND_API_KEY is not configured; email skipped`)
    return false
  }
  const replyTo = env('RESULT_EMAIL_REPLY_TO')
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify({
        from: env('RESULT_EMAIL_FROM') ?? DEFAULT_FROM,
        to: [message.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
      signal: AbortSignal.timeout(10_000),
    })
    if (res.ok) return true
    const detail = (await res.json().catch(() => null)) as { name?: string; message?: string } | null
    console.error(
      `[submit-map] ${submissionId}: Resend responded ${res.status}${detail?.name ? ` (${detail.name}: ${detail.message ?? ''})` : ''}`,
    )
  } catch (err) {
    console.error(`[submit-map] ${submissionId}: Resend request failed (${(err as Error).name})`)
  }
  return false
}

/**
 * Upserts one row (keyed by submissionId) through the Apps Script web app.
 * The shared secret travels in the POST body because Apps Script cannot read
 * request headers; it is never exposed to the browser.
 */
export async function writeSheetRow(row: SheetRow, submissionId: string): Promise<boolean> {
  const url = env('GOOGLE_SHEETS_WEBHOOK_URL')
  const secret = env('GOOGLE_SHEETS_WEBHOOK_SECRET')
  if (!url || !secret) {
    console.error(`[submit-map] ${submissionId}: Google Sheets webhook is not configured; row not written`)
    return false
  }
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, row }),
      redirect: 'follow',
      signal: AbortSignal.timeout(20_000),
    })
    const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null
    if (res.ok && data?.ok) return true
    console.error(
      `[submit-map] ${submissionId}: Sheets webhook responded ${res.status}${data ? ` (${data.error ?? 'not ok'})` : ' (non-JSON response; check the web app deployment access)'}`,
    )
  } catch (err) {
    console.error(`[submit-map] ${submissionId}: Sheets webhook request failed (${(err as Error).name})`)
  }
  return false
}
