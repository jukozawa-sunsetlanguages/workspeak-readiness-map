import type { ReactNode } from 'react'
import {
  BRAND,
  RESULT_COPY,
  TRAINING_READINESS_LABELS,
  dimensionName,
} from '../../assessment/content'
import type { MapResult } from '../../assessment/types'
import DimensionMap from './DimensionMap'
import EvidencePath from './EvidencePath'
import { ResultBand, ResultRecord } from './ResultBand'
import { forwardRef } from 'react'

interface Props {
  result: MapResult
  firstName: string
  onRestart: () => void
  onBack: () => void
  /** Status line for the emailed copy of the result. */
  delivery?: ReactNode
}

const ResultsView = forwardRef<HTMLHeadingElement, Props>(function ResultsView(
  { result, firstName, onRestart, onBack, delivery },
  headingRef,
) {
  const label = dimensionName
  const readiness = TRAINING_READINESS_LABELS[result.trainingReadiness]

  return (
    <div className="step-in">
      {/* A. CURRENT REPORTED PATTERN */}
      <ResultBand label={`${BRAND.system} · ${BRAND.product}${firstName ? ` · ${firstName}` : ''}`}>
        <p className="eyebrow text-offwhite/65">{RESULT_COPY.currentPattern}</p>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="mt-5 max-w-3xl text-[1.9rem] leading-[1.15] font-semibold text-balance outline-none sm:text-[3rem]"
        >
          {result.patternLabel}
        </h1>
        <div aria-hidden="true" className="mt-8 h-px w-24 bg-amber" />
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-offwhite/75">
          {RESULT_COPY.hypothesisNote}
        </p>
        {delivery}
      </ResultBand>

      {/* B. OBSERVATION + D/E/F */}
      <ResultBand tone="offwhite" label="Observação">
        <h2 className="text-2xl font-semibold sm:text-3xl">{RESULT_COPY.observation}</h2>
        <p className="mt-5 max-w-3xl text-[17px] leading-relaxed text-graphite">{result.observation}</p>
        <div className="mt-12 grid grid-cols-1 border-b border-graphite/25 sm:grid-cols-3 sm:border-t sm:pt-6 sm:pb-6">
          <ResultRecord label={RESULT_COPY.strongest} value={label(result.strongest)} />
          <ResultRecord
            label={RESULT_COPY.primary}
            value={result.primary ? label(result.primary) : RESULT_COPY.noPrimary}
            marked={!!result.primary}
          />
          <ResultRecord
            label={RESULT_COPY.secondary}
            value={result.secondary ? label(result.secondary) : RESULT_COPY.noSecondary}
          />
        </div>
      </ResultBand>

      {/* C. DIMENSION MAP */}
      <ResultBand tone="strategic" label={RESULT_COPY.map.label}>
        <h2 className="text-2xl font-semibold sm:text-3xl">{RESULT_COPY.map.title}</h2>
        <p className="mt-3 mb-10 max-w-2xl text-[15px] leading-relaxed text-offwhite/75">
          {RESULT_COPY.map.note}
        </p>
        <DimensionMap dimensions={result.dimensions} primary={result.primary} secondary={result.secondary} />
      </ResultBand>

      {/* G. SELF-PERCEIVED FRICTION  vs  H. WORKING HYPOTHESIS */}
      <ResultBand label="Duas leituras, mantidas separadas">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <p className="eyebrow text-offwhite/65">Fricção percebida</p>
            <h2 className="mt-3 text-xl font-semibold sm:text-2xl">O que você percebe como fricção</h2>
            <ul className="mt-6 border-t border-offwhite/12">
              {result.perceivedFriction.length ? (
                result.perceivedFriction.map((f) => (
                  <li key={f} className="border-b border-offwhite/12 py-3 text-[15px] text-offwhite/90">
                    {f}
                  </li>
                ))
              ) : (
                <li className="border-b border-offwhite/12 py-3 text-[15px] text-offwhite/65">Não informado</li>
              )}
            </ul>
            {result.focusSituation && (
              <p className="mt-6 text-sm leading-relaxed text-offwhite/75">
                <span className="eyebrow block text-offwhite/55">Situação para melhorar em 30 dias</span>
                <span className="mt-2 block text-[15px] text-offwhite/90">“{result.focusSituation}”</span>
              </p>
            )}
          </div>
          <div>
            <p className="eyebrow text-offwhite/65">{RESULT_COPY.hypothesis}</p>
            <h2 className="mt-3 text-xl font-semibold sm:text-2xl">O que o padrão das suas respostas sugere</h2>
            <p className="mt-6 border-t border-offwhite/12 pt-5 text-[16px] leading-relaxed text-offwhite/90">
              {result.hypothesis}
            </p>
          </div>
        </div>
        <p className="mt-12 max-w-2xl border-l border-offwhite/25 pl-4 text-sm leading-relaxed text-offwhite/65">
          Essas duas leituras podem coincidir ou não, e as duas são úteis. Compará-las ao longo do
          tempo, junto com a performance observada, faz parte do método WorkSpeak.
        </p>
      </ResultBand>

      {/* I. WHAT THIS MAY LOOK LIKE AT WORK */}
      <ResultBand label="No contexto" className="border-t border-offwhite/10">
        <h2 className="text-2xl font-semibold sm:text-3xl">Como isso pode aparecer no trabalho</h2>
        <dl className="mt-10 border-t border-offwhite/12">
          {result.workExamples.map((ex) => (
            <div
              key={ex.context}
              className="grid grid-cols-1 gap-2 border-b border-offwhite/12 py-5 sm:grid-cols-[13rem_1fr] sm:gap-8"
            >
              <dt className="font-heading text-[15px] font-semibold">{ex.context}</dt>
              <dd className="text-[15px] leading-relaxed text-offwhite/80">{ex.text}</dd>
            </div>
          ))}
        </dl>
      </ResultBand>

      {/* J. TRAINING PRIORITY + K. TRAINING READINESS */}
      <ResultBand className="border-t border-offwhite/10">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-16">
          <div>
            <p className="eyebrow text-offwhite/65">{RESULT_COPY.trainingPriority}</p>
            <h2 className="mt-4 text-xl leading-snug font-semibold sm:text-2xl">{result.trainingPriority.title}</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-offwhite/80">{result.trainingPriority.detail}</p>
          </div>
          <div>
            <p className="eyebrow text-offwhite/65">{RESULT_COPY.trainingReadiness}</p>
            <p className="mt-4 flex items-center gap-3 font-heading text-xl font-semibold sm:text-2xl">
              <span aria-hidden="true" className="h-px w-6 bg-offwhite/60" />
              {readiness.label}
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-offwhite/80">{readiness.text}</p>
            <p className="mt-4 text-xs leading-relaxed text-offwhite/60">
              Avaliada separadamente da Communication Readiness.
            </p>
          </div>
        </div>
      </ResultBand>

      {/* L. NEXT EVIDENCE */}
      <ResultBand tone="strategic" label={RESULT_COPY.nextEvidence.label}>
        <h2 className="text-2xl font-semibold sm:text-3xl">{RESULT_COPY.nextEvidence.title}</h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-offwhite/80">
          {RESULT_COPY.nextEvidence.body}
        </p>
        <div className="mt-12">
          <EvidencePath />
        </div>
      </ResultBand>

      {/* NEXT FOCUS — the same for everyone. Bootcamp fit is internal only
          (result.nextStep is stored for research, never shown). */}
      <ResultBand label={RESULT_COPY.nextStep}>
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold sm:text-3xl">{RESULT_COPY.nextFocus.title}</h2>
          {RESULT_COPY.nextFocus.body.map((paragraph) => (
            <p key={paragraph} className="mt-4 text-[16px] leading-relaxed text-offwhite/80">
              {paragraph}
            </p>
          ))}
        </div>
      </ResultBand>

      {/* Footer: epistemic limit + controls */}
      <footer className="border-t border-offwhite/10">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="max-w-xl text-xs leading-relaxed text-offwhite/60">
            {RESULT_COPY.methodNote}
          </p>
          <div className="flex gap-6">
            <button type="button" onClick={onBack} className="text-sm font-medium text-offwhite/75 hover:text-offwhite">
              ← Revisar respostas
            </button>
            <button type="button" onClick={onRestart} className="text-sm font-medium text-offwhite/75 hover:text-offwhite">
              Recomeçar
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
})

export default ResultsView
