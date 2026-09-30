import { BOOTCAMP_URL, BRAND, DIMENSIONS, TRAINING_READINESS_LABELS } from '../../assessment/content'
import { NEXT_STEP_COPY } from '../../assessment/profiles'
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
}

const ResultsView = forwardRef<HTMLHeadingElement, Props>(function ResultsView(
  { result, firstName, onRestart, onBack },
  headingRef,
) {
  const label = (id: keyof typeof DIMENSIONS) => DIMENSIONS[id].label
  const readiness = TRAINING_READINESS_LABELS[result.trainingReadiness]
  const next = result.nextStep

  return (
    <div className="step-in">
      {/* A. CURRENT REPORTED PATTERN */}
      <ResultBand label={`${BRAND.system} · Communication Readiness Map${firstName ? ` · ${firstName}` : ''}`}>
        <p className="eyebrow text-offwhite/65">Current reported pattern</p>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="mt-5 max-w-3xl text-[2.2rem] leading-[1.1] font-semibold outline-none sm:text-[3.4rem]"
        >
          {result.patternName}
        </h1>
        <div aria-hidden="true" className="mt-8 h-px w-24 bg-amber" />
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-offwhite/75">
          Based on your responses, this is a working hypothesis — not a proficiency diagnosis.
        </p>
      </ResultBand>

      {/* B. OBSERVATION + D/E/F */}
      <ResultBand tone="offwhite" label="Observation">
        <h2 className="text-2xl font-semibold sm:text-3xl">What your answers suggest</h2>
        <p className="mt-5 max-w-3xl text-[17px] leading-relaxed text-graphite">{result.observation}</p>
        <div className="mt-12 grid grid-cols-1 border-b border-graphite/25 sm:grid-cols-3 sm:border-t sm:pt-6 sm:pb-6">
          <ResultRecord label="Strongest reported dimension" value={label(result.strongest)} />
          <ResultRecord label="Primary pattern to observe" value={label(result.primary)} marked />
          <ResultRecord
            label="Secondary pattern to observe"
            value={result.secondary ? label(result.secondary) : 'No clear secondary pattern'}
          />
        </div>
      </ResultBand>

      {/* C. DIMENSION MAP */}
      <ResultBand tone="strategic" label="Dimension map">
        <h2 className="text-2xl font-semibold sm:text-3xl">Five working dimensions</h2>
        <p className="mt-3 mb-10 max-w-2xl text-[15px] leading-relaxed text-offwhite/75">
          Qualitative readings based on what you reported. They describe reported behavior, not
          measured performance.
        </p>
        <DimensionMap dimensions={result.dimensions} primary={result.primary} secondary={result.secondary} />
      </ResultBand>

      {/* G. SELF-PERCEIVED FRICTION  vs  H. WORKING HYPOTHESIS */}
      <ResultBand label="Two readings, kept separate">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <p className="eyebrow text-offwhite/65">Self-perceived friction</p>
            <h2 className="mt-3 text-xl font-semibold sm:text-2xl">What you think is happening</h2>
            <ul className="mt-6 border-t border-offwhite/12">
              {result.perceivedFriction.length ? (
                result.perceivedFriction.map((f) => (
                  <li key={f} className="border-b border-offwhite/12 py-3 text-[15px] text-offwhite/90">
                    {f}
                  </li>
                ))
              ) : (
                <li className="border-b border-offwhite/12 py-3 text-[15px] text-offwhite/65">Not specified</li>
              )}
            </ul>
            {result.focusSituation && (
              <p className="mt-6 text-sm leading-relaxed text-offwhite/75">
                <span className="eyebrow block text-offwhite/55">Situation to improve in 30 days</span>
                <span className="mt-2 block text-[15px] text-offwhite/90">“{result.focusSituation}”</span>
              </p>
            )}
          </div>
          <div>
            <p className="eyebrow text-offwhite/65">Working hypothesis</p>
            <h2 className="mt-3 text-xl font-semibold sm:text-2xl">What your response pattern suggests</h2>
            <p className="mt-6 border-t border-offwhite/12 pt-5 text-[16px] leading-relaxed text-offwhite/90">
              {result.hypothesis}
            </p>
          </div>
        </div>
        <p className="mt-12 max-w-2xl border-l border-offwhite/25 pl-4 text-sm leading-relaxed text-offwhite/65">
          These two readings may agree or differ. Both are useful. Comparing them over time — against
          observed performance — is part of how WorkSpeak works.
        </p>
      </ResultBand>

      {/* I. WHAT THIS MAY LOOK LIKE AT WORK */}
      <ResultBand label="In context" className="border-t border-offwhite/10">
        <h2 className="text-2xl font-semibold sm:text-3xl">What this may look like at work</h2>
        <dl className="mt-10 border-t border-offwhite/12">
          {result.workExamples.map((ex) => (
            <div
              key={ex.context}
              className="grid grid-cols-1 gap-2 border-b border-offwhite/12 py-5 sm:grid-cols-[12rem_1fr] sm:gap-8"
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
            <p className="eyebrow text-offwhite/65">Training priority</p>
            <h2 className="mt-4 text-xl leading-snug font-semibold sm:text-2xl">{result.trainingPriority.title}</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-offwhite/80">{result.trainingPriority.detail}</p>
          </div>
          <div>
            <p className="eyebrow text-offwhite/65">Training readiness</p>
            <p className="mt-4 flex items-center gap-3 font-heading text-xl font-semibold sm:text-2xl">
              <span aria-hidden="true" className="h-px w-6 bg-offwhite/60" />
              {readiness.label}
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-offwhite/80">{readiness.text}</p>
            <p className="mt-4 text-xs leading-relaxed text-offwhite/60">
              Assessed separately from communication readiness.
            </p>
          </div>
        </div>
      </ResultBand>

      {/* L. NEXT EVIDENCE */}
      <ResultBand tone="strategic" label="Next evidence">
        <h2 className="text-2xl font-semibold sm:text-3xl">What would we observe next?</h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-offwhite/80">
          This Map creates a hypothesis from what you reported. The next useful step is performance
          evidence. A short baseline communication task could help verify whether this pattern also
          appears during actual performance.
        </p>
        <div className="mt-12">
          <EvidencePath />
        </div>
      </ResultBand>

      {/* CONDITIONAL NEXT STEP */}
      <ResultBand label="Next step">
        {next.kind === 'bootcamp-fit' ? (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold sm:text-3xl">{NEXT_STEP_COPY.fit.headline}</h2>
            <p className="mt-4 text-[16px] leading-relaxed text-offwhite/80">{NEXT_STEP_COPY.fit.body}</p>
            <a
              href={BOOTCAMP_URL}
              className="mt-8 inline-block bg-amber px-7 py-4 text-[15px] font-medium text-navy transition-colors hover:bg-amber/90"
            >
              {NEXT_STEP_COPY.fit.cta} →
            </a>
          </div>
        ) : (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold sm:text-3xl">{NEXT_STEP_COPY.notYet.headline}</h2>
            <p className="mt-4 text-[16px] leading-relaxed text-offwhite/80">
              {NEXT_STEP_COPY.notYet.reasons[next.reason]}
            </p>
          </div>
        )}
      </ResultBand>

      {/* Footer: epistemic limit + controls */}
      <footer className="border-t border-offwhite/10">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="max-w-xl text-xs leading-relaxed text-offwhite/60">
            This Map is based on self-report. It is not an English proficiency test, a CEFR assessment
            or a validated psychometric instrument. Treat it as an initial working hypothesis.
          </p>
          <div className="flex gap-6">
            <button type="button" onClick={onBack} className="text-sm font-medium text-offwhite/75 hover:text-offwhite">
              ← Review answers
            </button>
            <button type="button" onClick={onRestart} className="text-sm font-medium text-offwhite/75 hover:text-offwhite">
              Start again
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
})

export default ResultsView
