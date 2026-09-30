/**
 * Result email. Rendered only from the same MapResult and copy constants used
 * by the on-screen Results. No interpretation happens here. Table layout and
 * inline styles for broad email-client support.
 */
import {
  BOOTCAMP_URL,
  BRAND,
  RESULT_COPY,
  TRAINING_READINESS_LABELS,
  dimensionName,
} from '../assessment/content'
import { NEXT_STEP_COPY } from '../assessment/profiles'
import type { MapResult } from '../assessment/types'

export const EMAIL_SUBJECT = `Seu ${BRAND.system} ${BRAND.product}`

const EMAIL_COPY = {
  tagline: 'a method by Sunset Languages',
  title: `Seu ${BRAND.product}`,
  greeting: (name: string) => (name ? `Olá, ${name}.` : 'Olá.'),
  intro: `Aqui está a leitura inicial do seu ${BRAND.product}.`,
  methodNote:
    'Este resultado é uma hipótese inicial baseada nas suas respostas. Ele não é um diagnóstico de proficiência em inglês.',
}

const C = {
  navy: '#0F1E2E',
  strategic: '#1F3F3A',
  amber: '#C96F1A',
  offwhite: '#F4F2ED',
  graphite: '#2B2F36',
}
const HEADING = "'Sora', 'Segoe UI', Helvetica, Arial, sans-serif"
const BODY = "'Inter', 'Segoe UI', Helvetica, Arial, sans-serif"

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]!)

interface Section {
  label: string
  value?: string
  body?: string
}

/** Everything the email shows, in order. Shared by the HTML and text parts. */
function sections(result: MapResult): Section[] {
  const readiness = TRAINING_READINESS_LABELS[result.trainingReadiness]
  const list: Section[] = [
    { label: RESULT_COPY.currentPattern, value: result.patternLabel },
    { label: RESULT_COPY.strongest, value: dimensionName(result.strongest) },
    {
      label: RESULT_COPY.primary,
      value: result.primary ? dimensionName(result.primary) : RESULT_COPY.noPrimary,
    },
  ]
  if (result.secondary) list.push({ label: RESULT_COPY.secondary, value: dimensionName(result.secondary) })
  list.push(
    { label: RESULT_COPY.observation, body: result.observation },
    { label: RESULT_COPY.hypothesis, body: result.hypothesis },
    {
      label: RESULT_COPY.trainingPriority,
      value: result.trainingPriority.title,
      body: result.trainingPriority.detail,
    },
    { label: RESULT_COPY.trainingReadiness, value: readiness.label, body: readiness.text },
    { label: RESULT_COPY.nextEvidence.label, value: RESULT_COPY.nextEvidence.title, body: RESULT_COPY.nextEvidence.body },
  )
  return list
}

function nextStep(result: MapResult) {
  if (result.nextStep.kind === 'bootcamp-fit') {
    // The CTA is only rendered once BOOTCAMP_URL is a real absolute link.
    const url = /^https?:\/\//.test(BOOTCAMP_URL) ? BOOTCAMP_URL : null
    return { headline: NEXT_STEP_COPY.fit.headline, body: NEXT_STEP_COPY.fit.body, cta: url ? { url, label: NEXT_STEP_COPY.fit.cta } : null }
  }
  return {
    headline: NEXT_STEP_COPY.notYet.headline,
    body: NEXT_STEP_COPY.notYet.reasons[result.nextStep.reason],
    cta: null,
  }
}

function sectionHtml(s: Section): string {
  return `
<tr><td style="padding:22px 0 0 0;border-top:1px solid #D9D6CF;">
  <p style="margin:0;font-family:${BODY};font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${C.graphite};">${esc(s.label)}</p>
  ${s.value ? `<p style="margin:8px 0 0 0;font-family:${HEADING};font-size:18px;line-height:1.35;font-weight:600;color:${C.navy};">${esc(s.value)}</p>` : ''}
  ${s.body ? `<p style="margin:8px 0 0 0;font-family:${BODY};font-size:15px;line-height:1.6;color:${C.graphite};">${esc(s.body)}</p>` : ''}
  <div style="height:22px;line-height:22px;font-size:0;">&nbsp;</div>
</td></tr>`
}

export function renderResultEmail(result: MapResult, firstName: string): { subject: string; html: string; text: string } {
  const list = sections(result)
  const next = nextStep(result)

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${esc(EMAIL_SUBJECT)}</title>
</head>
<body style="margin:0;padding:0;background:${C.offwhite};">
<div style="display:none;max-height:0;overflow:hidden;">${esc(EMAIL_COPY.intro)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.offwhite};">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">

<tr><td style="background:${C.navy};padding:28px 32px 26px 32px;">
  <p style="margin:0;font-family:${HEADING};font-size:15px;font-weight:600;letter-spacing:1px;color:${C.offwhite};">${esc(BRAND.system)}</p>
  <p style="margin:4px 0 0 0;font-family:${BODY};font-size:12px;color:#B9BEC6;">${esc(EMAIL_COPY.tagline)}</p>
  <div style="margin:22px 0 0 0;width:64px;height:2px;line-height:2px;font-size:0;background:${C.amber};">&nbsp;</div>
  <h1 style="margin:22px 0 0 0;font-family:${HEADING};font-size:24px;line-height:1.3;font-weight:600;color:${C.offwhite};">${esc(EMAIL_COPY.title)}</h1>
</td></tr>

<tr><td style="background:#FFFFFF;padding:28px 32px 8px 32px;">
  <p style="margin:0;font-family:${BODY};font-size:15px;line-height:1.6;color:${C.navy};">${esc(EMAIL_COPY.greeting(firstName))}</p>
  <p style="margin:8px 0 24px 0;font-family:${BODY};font-size:15px;line-height:1.6;color:${C.graphite};">${esc(EMAIL_COPY.intro)}</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${list.map(sectionHtml).join('')}</table>
  <p style="margin:8px 0 28px 0;padding:0 0 0 12px;border-left:2px solid ${C.amber};font-family:${BODY};font-size:13px;line-height:1.6;color:${C.graphite};">${esc(EMAIL_COPY.methodNote)}</p>
</td></tr>

<tr><td style="background:${C.strategic};padding:28px 32px;">
  <p style="margin:0;font-family:${BODY};font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:#C9D3CF;">${esc(RESULT_COPY.nextStep)}</p>
  <p style="margin:10px 0 0 0;font-family:${HEADING};font-size:18px;line-height:1.35;font-weight:600;color:${C.offwhite};">${esc(next.headline)}</p>
  <p style="margin:10px 0 0 0;font-family:${BODY};font-size:15px;line-height:1.6;color:#E4E7E5;">${esc(next.body)}</p>
  ${
    next.cta
      ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;"><tr><td style="background:${C.amber};">
  <a href="${esc(next.cta.url)}" style="display:inline-block;padding:14px 22px;font-family:${BODY};font-size:15px;font-weight:600;color:${C.navy};text-decoration:none;">${esc(next.cta.label)} &rarr;</a>
</td></tr></table>`
      : ''
  }
</td></tr>

<tr><td style="padding:20px 32px;">
  <p style="margin:0;font-family:${BODY};font-size:12px;color:${C.graphite};">${esc(BRAND.parent)} · ${esc(BRAND.principle)}</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`

  const text = [
    `${BRAND.system}, ${EMAIL_COPY.tagline}`,
    '',
    EMAIL_COPY.title,
    '',
    EMAIL_COPY.greeting(firstName),
    EMAIL_COPY.intro,
    '',
    ...list.flatMap((s) => [s.label.toUpperCase(), ...(s.value ? [s.value] : []), ...(s.body ? [s.body] : []), '']),
    EMAIL_COPY.methodNote,
    '',
    RESULT_COPY.nextStep.toUpperCase(),
    next.headline,
    next.body,
    ...(next.cta ? [`${next.cta.label}: ${next.cta.url}`] : []),
    '',
    `${BRAND.parent} · ${BRAND.principle}`,
  ].join('\n')

  return { subject: EMAIL_SUBJECT, html, text }
}
