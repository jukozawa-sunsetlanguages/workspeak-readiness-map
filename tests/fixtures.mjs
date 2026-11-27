import { QUESTIONS_BY_SECTION } from '../src/assessment/questions.ts'
import { captureAnswerSnapshot } from '../src/assessment/answerSnapshot.ts'
import { INSTRUMENT_VERSION } from '../src/assessment/instrument.ts'

export function request(seed = 0, complements = {}) {
  const responses = {
    context: {}, readiness: {}, friction: {}, training: {},
    contact: { firstName: 'Pessoa Teste', email: 'fixture@example.invalid', role: 'Teste', marketingConsent: false },
  }
  let i = 0
  for (const [section, questions] of Object.entries(QUESTIONS_BY_SECTION)) {
    for (const q of questions) {
      if (q.kind === 'text') { responses[section][q.id] = { values: [], text: 'Apresentar atualizações' }; continue }
      const options = q.options.filter(o => !o.opensText)
      responses[section][q.id] = { values: [options[(seed + i++) % options.length].id] }
      if (section === 'readiness' && complements[q.id] !== undefined) responses[section][q.id].openText = complements[q.id]
    }
  }
  return {
    submissionId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', emailAttempt: 1,
    instrumentVersion: INSTRUMENT_VERSION, responses,
    answerSnapshot: captureAnswerSnapshot(responses),
    attribution: { source: 'fixture', utmSource: '', utmMedium: '', utmCampaign: '' },
  }
}
