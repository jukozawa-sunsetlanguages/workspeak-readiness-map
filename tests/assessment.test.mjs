import test from 'node:test'
import assert from 'node:assert/strict'
import { READINESS_QUESTIONS, QUESTIONS_BY_SECTION, TRAINING_QUESTIONS } from '../src/assessment/questions.ts'
import { INSTRUMENT_VERSION, MAX_OPEN_TEXT_LENGTH } from '../src/assessment/instrument.ts'
import { captureAnswerSnapshot } from '../src/assessment/answerSnapshot.ts'
import { validateAnswer } from '../src/assessment/steps.ts'
import { buildMapResult } from '../src/assessment/interpretation.ts'
import { validateSubmission, MAX_BODY_BYTES } from '../src/server/validateSubmission.ts'
import { buildSheetRow, ITEM_COLUMNS } from '../src/server/sheetRow.ts'
import { renderResultEmail } from '../src/server/resultEmail.ts'
import submit from '../netlify/functions/submit-map.mts'
import { request } from './fixtures.mjs'

const email = { status: 'sent', sentAt: '2026-11-27T12:00:00Z' }
function validated(body) { const p = validateSubmission(body); assert.equal(p.ok, true, JSON.stringify(p)); return p.value }
function rowFor(body) { const s = validated(body); return buildSheetRow(s, '2026-11-27T12:00:00Z', buildMapResult(s.responses), email) }

for (const count of [0, 1, 12]) {
  test(`${count} optional complements map to their own columns`, () => {
    const complements = Object.fromEntries(READINESS_QUESTIONS.slice(0, count).map(q => [q.id, `Contexto ${q.id}: ação\nI usually explain — çã 😊`]))
    const body = request(0, complements)
    const row = rowFor(body)
    for (const q of READINESS_QUESTIONS) {
      assert.equal(row[`${ITEM_COLUMNS[q.id]}Open`], complements[q.id] ?? '')
      assert.equal(row[ITEM_COLUMNS[q.id]], body.answerSnapshot[q.id][0])
    }
    assert.equal(row.instrumentVersion, INSTRUMENT_VERSION)
    assert.deepEqual(JSON.parse(row.technicalResponses).readiness, body.responses.readiness)
  })
}

test('complements do not replace mandatory options or alter results (256 answer patterns)', () => {
  for (let seed = 0; seed < 256; seed++) {
    const body = request(seed)
    // Spread the seed across questions to cover independent option combinations.
    READINESS_QUESTIONS.forEach((q, i) => { body.responses.readiness[q.id].values = [q.options[(seed >> (i % 7)) % q.options.length].id] })
    body.answerSnapshot = captureAnswerSnapshot(body.responses)
    const before = buildMapResult(body.responses)
    const beforeEmail = renderResultEmail(before, 'Pessoa')
    for (const q of READINESS_QUESTIONS) body.responses.readiness[q.id].openText = 'Outro contexto sem relação com a pontuação'
    const after = buildMapResult(validated(body).responses)
    assert.deepEqual(after, before)
    assert.deepEqual(renderResultEmail(after, 'Pessoa'), beforeEmail)
  }
  assert.ok(validateAnswer(READINESS_QUESTIONS[0], { values: [], openText: 'Há texto' }))
  assert.equal(validateAnswer(READINESS_QUESTIONS[0], { values: ['a'], openText: '' }), null)
})

test('only selected full labels are stored, including multis, training and demanding context', () => {
  const body = request()
  body.responses.context.ctx_matters_most = { values: ['clients', 'meetings', 'other'], text: 'Pesquisa em inglês' }
  body.responses.friction.frc_obstacles = { values: ['fear_mistakes', 'other'], text: 'Situação específica' }
  body.answerSnapshot = captureAnswerSnapshot(body.responses)
  const row = rowFor(body)
  assert.equal(row.professionalContexts, body.answerSnapshot.ctx_matters_most.join('\n'))
  assert.equal(row.perceivedFrictions, body.answerSnapshot.frc_obstacles.join('\n'))
  assert.equal(row.mostDemandingContext, body.answerSnapshot.ctx_most_demanding[0])
  assert.equal(row.englishUseFrequency, body.answerSnapshot.ctx_frequency[0])
  assert.equal(row.spontaneousCommunicationPattern, body.answerSnapshot.ctx_unprepared[0])
  const columns = ['trainingReadinessTime','trainingReadinessRepetition','trainingReadinessRecording','trainingReadinessWeaknessExposed','trainingReadinessFeedback']
  TRAINING_QUESTIONS.forEach((q, i) => assert.equal(row[columns[i]], body.answerSnapshot[q.id][0]))
  assert.deepEqual(JSON.parse(row.trainingReadinessResponses), Object.fromEntries(TRAINING_QUESTIONS.map(q => [q.id, body.responses.training[q.id].values[0]])))
  assert.equal(JSON.parse(row.technicalResponses).context.ctx_matters_most.text, 'Pesquisa em inglês')
})

test('changing a choice keeps the independent complement and captures the new label', () => {
  const body = request(0, { clr_complex_idea: 'Meu complemento' })
  body.responses.readiness.clr_complex_idea.values = ['d']
  body.answerSnapshot = captureAnswerSnapshot(body.responses)
  const row = rowFor(body)
  assert.equal(row.q1Clarity, READINESS_QUESTIONS[0].options.find(o => o.id === 'd').label)
  assert.equal(row.q1ClarityOpen, 'Meu complemento')
  assert.equal(JSON.parse(row.technicalResponses).readiness.clr_complex_idea.values[0], 'd')
})

test('line breaks, accents and special characters survive; formula candidates are escaped', () => {
  const goal = request(); goal.responses.friction.frc_focus_situation.text = 'Apresentar ações\nExplain next steps';
  assert.equal(rowFor(goal).thirtyDayGoal, 'Apresentar ações\nExplain next steps')
  for (const text of ['Ação, café & <tag> "aspas"\nSecond line 😊', '=SUM(1,2)', '+cmd', '-2+3', '@x', '  =HYPERLINK("x")', '\t=1+1', '\n=1+1']) {
    const row = rowFor(request(0, { clr_complex_idea: text }))
    const escaped = /^(?:[=+\-@\t\r\n]|\s+[=+\-@])/.test(text)
    assert.equal(row.q1ClarityOpen, (escaped ? "'" : '') + text)
    assert.equal(JSON.parse(row.technicalResponses).readiness.clr_complex_idea.openText, text)
  }
})

test('rejects stale or forged snapshots, unknown versions and oversized complement', () => {
  const body = request()
  body.answerSnapshot.clr_complex_idea = ['forged']
  assert.equal(validateSubmission(body).ok, false)
  const unknown = request(); unknown.instrumentVersion = 'CRM-v999'
  assert.equal(validateSubmission(unknown).ok, false)
  assert.equal(validateSubmission(request(0, { clr_complex_idea: 'x'.repeat(MAX_OPEN_TEXT_LENGTH + 1) })).ok, false)
  const max = request(0, Object.fromEntries(READINESS_QUESTIONS.map(q => [q.id, '\t'.repeat(MAX_OPEN_TEXT_LENGTH)])))
  assert.ok(Buffer.byteLength(JSON.stringify(max)) < MAX_BODY_BYTES)
  assert.equal(validateSubmission(max).ok, true)
})

test('legacy clients retain CRM-v1 ids and no historical conversion occurs', () => {
  const body = request(); delete body.instrumentVersion; delete body.answerSnapshot
  const row = rowFor(body)
  assert.equal(row.instrumentVersion, 'CRM-v1')
  assert.equal(row.q1Clarity, body.responses.readiness.clr_complex_idea.values[0])
  assert.equal(row.q1ClarityOpen, '')
  assert.equal(row.technicalResponses, '')
  assert.equal(row.professionalContexts, JSON.stringify(body.responses.context.ctx_matters_most.values))
})

test('submit endpoint keeps email delivery, status, idempotency and Sheets payload (mock services)', async () => {
  const originalFetch = globalThis.fetch
  const originalNetlify = globalThis.Netlify
  globalThis.Netlify = { env: { get: key => ({ RESEND_API_KEY: 'fixture-key', GOOGLE_SHEETS_WEBHOOK_URL: 'https://fixture.invalid/sheets', GOOGLE_SHEETS_WEBHOOK_SECRET: 'fixture-secret' })[key] } }
  const calls = []
  globalThis.fetch = async (url, init) => { calls.push({ url, init, body: JSON.parse(init.body) }); return Response.json(url.includes('resend') ? { id: 'fixture-email' } : { ok: true }) }
  try {
    const body = request(0, { clr_complex_idea: 'Completo\nI explain' })
    const response = await submit(new Request('http://fixture.invalid/api/submit-map', { method: 'POST', body: JSON.stringify(body) }), {})
    assert.deepEqual(await response.json(), { emailStatus: 'sent', recorded: true })
    assert.equal(calls.length, 2)
    assert.equal(calls[0].init.headers['Idempotency-Key'], `crm-${body.submissionId}-1`)
    assert.deepEqual(calls[0].body.to, ['fixture@example.invalid'])
    assert.ok(calls[0].body.html.includes('Pessoa'))
    assert.equal(calls[1].body.row.q1ClarityOpen, 'Completo\nI explain')
    assert.equal(calls[1].body.row.resultEmailStatus, 'sent')
    assert.equal(calls[1].body.row.q1Clarity, body.answerSnapshot.clr_complex_idea[0])
  } finally { globalThis.fetch = originalFetch; globalThis.Netlify = originalNetlify }
})
