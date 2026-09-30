/**
 * Result email. Rendered only from the same MapResult and copy constants used
 * by the on-screen Results. No interpretation happens here. Table layout and
 * inline styles for broad email-client support.
 */
import {
  BRAND,
  DIMENSIONS,
  DIMENSION_STATES,
  RESULT_COPY,
  TRAINING_READINESS_LABELS,
  dimensionName,
  whatsappUrl,
} from '../assessment/content'
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

interface DimensionRow {
  name: string
  question: string
  stateLabel: string
  /** Position on the DIMENSION_STATES scale (0 = A observar … 3 = Mais estável). */
  position: number
  tag: string
  primary: boolean
}

interface Section {
  label: string
  value?: string
  body?: string
  map?: DimensionRow[]
}

/** The web DimensionMap's rows, from the same result states and scale. */
function dimensionRows(result: MapResult): DimensionRow[] {
  return result.dimensions.map((d) => ({
    name: dimensionName(d.id),
    question: DIMENSIONS[d.id].question,
    stateLabel: DIMENSION_STATES.find((s) => s.id === d.state)!.label,
    position: DIMENSION_STATES.findIndex((s) => s.id === d.state),
    tag:
      d.id === result.primary
        ? RESULT_COPY.map.primaryTag
        : d.id === result.secondary
          ? RESULT_COPY.map.secondaryTag
          : '',
    primary: d.id === result.primary,
  }))
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
    { label: RESULT_COPY.map.label, value: RESULT_COPY.map.title, body: RESULT_COPY.map.note, map: dimensionRows(result) },
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

const TRACK = '#E4E1DA'

/**
 * Email-safe dimension map: nested tables, bgcolor + inline styles, no SVG.
 * Each row fills a four-segment scale up to its qualitative state, mirroring
 * the line-and-marker map on the Results page. Amber marks the priority row.
 */
function mapHtml(rows: DimensionRow[]): string {
  const n = DIMENSION_STATES.length
  const cellWidth = `${100 / n}%`
  // Scale endpoints only: each row names its own state, and four labels do
  // not fit a phone-width column.
  const legend = `font-family:${BODY};font-size:10px;line-height:1.3;letter-spacing:0.8px;text-transform:uppercase;color:${C.graphite};padding:0 0 6px 0;`
  const scale = `<td width="50%" style="${legend}">${esc(DIMENSION_STATES[0].label)}</td><td width="50%" style="${legend}text-align:right;">${esc(DIMENSION_STATES[n - 1].label)}</td>`
  const row = (r: DimensionRow) => {
    const fill = r.primary ? C.amber : C.navy
    const segments = DIMENSION_STATES.map((_, i) => {
      const color = i <= r.position ? fill : TRACK
      return `<td width="${cellWidth}" height="6" bgcolor="${color}" style="height:6px;line-height:6px;font-size:0;background:${color};${i > 0 ? 'border-left:3px solid #FFFFFF;' : ''}">&nbsp;</td>`
    }).join('')
    return `
<tr><td style="padding:16px 0;border-top:1px solid #E4E1DA;">
  <p style="margin:0;font-family:${HEADING};font-size:15px;line-height:1.35;font-weight:600;color:${C.navy};">${esc(r.name)}${
    r.tag
      ? ` <span style="font-family:${BODY};font-size:10px;font-weight:500;letter-spacing:1px;text-transform:uppercase;color:${r.primary ? C.amber : C.graphite};">&middot; ${esc(r.tag)}</span>`
      : ''
  }</p>
  <p style="margin:4px 0 10px 0;font-family:${BODY};font-size:13px;line-height:1.5;color:${C.graphite};">${esc(r.question)}</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${segments}</tr></table>
  <p style="margin:8px 0 0 0;font-family:${BODY};font-size:13px;font-weight:600;color:${C.navy};">${esc(r.stateLabel)}</p>
</td></tr>`
  }
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;">
  <tr><td style="padding:0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${scale}</tr></table></td></tr>
  ${rows.map(row).join('')}
</table>`
}

function sectionHtml(s: Section): string {
  return `
<tr><td style="padding:22px 0 0 0;border-top:1px solid #D9D6CF;">
  <p style="margin:0;font-family:${BODY};font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${C.graphite};">${esc(s.label)}</p>
  ${s.value ? `<p style="margin:8px 0 0 0;font-family:${HEADING};font-size:18px;line-height:1.35;font-weight:600;color:${C.navy};">${esc(s.value)}</p>` : ''}
  ${s.body ? `<p style="margin:8px 0 0 0;font-family:${BODY};font-size:15px;line-height:1.6;color:${C.graphite};">${esc(s.body)}</p>` : ''}
  ${s.map ? mapHtml(s.map) : ''}
  <div style="height:22px;line-height:22px;font-size:0;">&nbsp;</div>
</td></tr>`
}

export function renderResultEmail(result: MapResult, firstName: string): { subject: string; html: string; text: string } {
  const list = sections(result)
  const conversationUrl = whatsappUrl()

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
  <p style="margin:10px 0 0 0;font-family:${HEADING};font-size:18px;line-height:1.35;font-weight:600;color:${C.offwhite};">${esc(RESULT_COPY.nextFocus.title)}</p>
  ${RESULT_COPY.nextFocus.body.map((p) => `<p style="margin:10px 0 0 0;font-family:${BODY};font-size:15px;line-height:1.6;color:#E4E7E5;">${esc(p)}</p>`).join('')}
  ${
    conversationUrl
      ? `<div style="margin:24px 0 0 0;height:1px;line-height:1px;font-size:0;background:#3A5752;">&nbsp;</div>
  <p style="margin:22px 0 0 0;font-family:${HEADING};font-size:16px;line-height:1.4;font-weight:600;color:${C.offwhite};">${esc(RESULT_COPY.conversation.title)}</p>
  <p style="margin:8px 0 0 0;font-family:${BODY};font-size:15px;line-height:1.6;color:#E4E7E5;">${esc(RESULT_COPY.conversation.body)}</p>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:18px;"><tr><td bgcolor="${C.amber}" style="background:${C.amber};">
  <a href="${esc(conversationUrl)}" target="_blank" style="display:inline-block;padding:14px 22px;font-family:${BODY};font-size:15px;font-weight:600;color:${C.navy};text-decoration:none;">${esc(RESULT_COPY.conversation.cta)}</a>
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
    ...list.flatMap((s) => [
      s.label.toUpperCase(),
      ...(s.value ? [s.value] : []),
      ...(s.body ? [s.body] : []),
      ...(s.map ?? []).map((r) => `- ${r.name}: ${r.stateLabel}${r.tag ? ` (${r.tag.toLowerCase()})` : ''}`),
      '',
    ]),
    EMAIL_COPY.methodNote,
    '',
    RESULT_COPY.nextStep.toUpperCase(),
    RESULT_COPY.nextFocus.title,
    ...RESULT_COPY.nextFocus.body,
    ...(conversationUrl
      ? ['', RESULT_COPY.conversation.title, RESULT_COPY.conversation.body, `${RESULT_COPY.conversation.cta.replace(/\s*→$/, '')}: ${conversationUrl}`]
      : []),
    '',
    `${BRAND.parent} · ${BRAND.principle}`,
  ].join('\n')

  return { subject: EMAIL_SUBJECT, html, text }
}
