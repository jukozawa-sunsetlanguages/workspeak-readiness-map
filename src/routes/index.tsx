import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { buildMapResult } from '../assessment/interpretation'
import { STEPS, getAnswer, validateAnswer, validateContact } from '../assessment/steps'
import type { ContactErrors } from '../assessment/steps'
import { captureAttribution } from '../assessment/attribution'
import { MAX_EMAIL_ATTEMPTS, newSubmission, submitAssessment } from '../assessment/submission'
import { useAssessment } from '../assessment/useAssessment'
import BrandHeader from '../components/BrandHeader'
import ContactScreen from '../components/ContactScreen'
import IntroScreen from '../components/IntroScreen'
import ProgressRail from '../components/ProgressRail'
import QuestionScreen from '../components/QuestionScreen'
import StepNav from '../components/StepNav'
import ValidationMessage from '../components/ValidationMessage'
import ResultsView from '../components/results/ResultsView'
import { CONTACT_COPY, DELIVERY_COPY, UI } from '../assessment/content'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const {
    stepIndex,
    responses,
    submission,
    hydrated,
    setAnswer,
    setContact,
    setSubmission,
    goTo,
    reset,
  } = useAssessment()
  const [error, setError] = useState<string | null>(null)
  const [contactErrors, setContactErrors] = useState<ContactErrors>({})
  const headingRef = useRef<HTMLHeadingElement>(null)
  const mounted = useRef(false)
  const inFlight = useRef<string | null>(null)
  const step = STEPS[stepIndex]

  // Capture UTM/source on landing, before the URL can be lost.
  useEffect(() => {
    captureAttribution()
  }, [])

  // Move focus and scroll to the new screen heading for orientation.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    window.scrollTo({ top: 0 })
    headingRef.current?.focus({ preventScroll: true })
  }, [stepIndex])

  const result = useMemo(
    () => (step.kind === 'results' ? buildMapResult(responses) : null),
    [step.kind, responses],
  )

  // Delivery runs only after Results are on screen and never blocks them.
  // Unchanged responses reuse the same submission, so revisiting the contact
  // step, double submits or a refresh do not create duplicates.
  useEffect(() => {
    if (!hydrated || step.kind !== 'results') return
    const fingerprint = JSON.stringify(responses)
    if (!submission || submission.fingerprint !== fingerprint) {
      setSubmission(newSubmission(fingerprint))
      return
    }
    if (submission.settled) return
    const key = `${submission.id}:${submission.emailAttempt}`
    if (inFlight.current === key) return
    inFlight.current = key
    const { id, emailAttempt } = submission
    void submitAssessment({
      submissionId: id,
      emailAttempt,
      responses,
      attribution: captureAttribution(),
    }).then((res) => {
      if (inFlight.current === key) inFlight.current = null
      setSubmission((prev) =>
        prev && prev.id === id
          ? {
              ...prev,
              emailStatus: prev.emailStatus === 'sent' || res.emailStatus === 'sent' ? 'sent' : 'failed',
              recorded: prev.recorded || res.recorded,
              settled: true,
            }
          : prev,
      )
    })
  }, [hydrated, step.kind, responses, submission, setSubmission])

  function retryEmail() {
    setSubmission((prev) =>
      prev && prev.emailAttempt < MAX_EMAIL_ATTEMPTS
        ? { ...prev, emailAttempt: prev.emailAttempt + 1, emailStatus: 'pending', settled: false }
        : prev,
    )
  }

  function move(delta: number) {
    setError(null)
    setContactErrors({})
    goTo(stepIndex + delta)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (step.kind === 'question') {
      const message = validateAnswer(step.question, getAnswer(responses, step.question))
      if (message) return setError(message)
      move(1)
    } else if (step.kind === 'contact') {
      const errors = validateContact(responses.contact)
      setContactErrors(errors)
      const firstInvalid = Object.keys(errors)[0]
      if (firstInvalid) {
        document.getElementById(`contact-${firstInvalid}`)?.focus()
        return
      }
      move(1)
    }
  }

  function restart() {
    if (window.confirm(UI.restartConfirm)) {
      setError(null)
      setContactErrors({})
      reset()
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <BrandHeader />
      {step.kind !== 'intro' && <ProgressRail stepIndex={stepIndex} />}

      {step.kind === 'results' && result ? (
        <main className="flex-1 pt-6">
          <ResultsView
            ref={headingRef}
            result={result}
            firstName={responses.contact.firstName.trim()}
            onBack={() => move(-1)}
            onRestart={restart}
            delivery={
              submission && (
                <div aria-live="polite" className="mt-6 flex max-w-xl items-start gap-3 text-sm leading-relaxed text-offwhite/70">
                  <span aria-hidden="true" className="mt-[10px] h-px w-5 shrink-0 bg-offwhite/40" />
                  <p>
                    {submission.emailStatus === 'sent'
                      ? DELIVERY_COPY.sent(responses.contact.email.trim())
                      : submission.emailStatus === 'failed'
                        ? DELIVERY_COPY.failed
                        : DELIVERY_COPY.pending}
                    {submission.emailStatus === 'failed' && submission.emailAttempt < MAX_EMAIL_ATTEMPTS && (
                      <>
                        {' '}
                        <button
                          type="button"
                          onClick={retryEmail}
                          className="font-medium text-offwhite underline decoration-offwhite/40 underline-offset-4 hover:decoration-amber"
                        >
                          {DELIVERY_COPY.retry}
                        </button>
                      </>
                    )}
                  </p>
                </div>
              )
            }
          />
        </main>
      ) : step.kind === 'intro' ? (
        <main className="mx-auto w-full max-w-5xl flex-1 px-5 pb-16 pt-8 sm:px-8">
          <div className="step-in">
            <IntroScreen onStart={() => move(1)} />
          </div>
        </main>
      ) : (
        <main className="mx-auto w-full max-w-2xl flex-1 px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
          <form key={stepIndex} noValidate onSubmit={handleSubmit} className="step-in">
            {step.kind === 'question' && (
              <QuestionScreen
                ref={headingRef}
                stage={step.stage}
                question={step.question}
                position={step.position}
                total={step.total}
                answer={getAnswer(responses, step.question)}
                onChange={(answer) => {
                  setError(null)
                  setAnswer(step.question.section, step.question.id, answer)
                }}
              />
            )}
            {step.kind === 'contact' && (
              <ContactScreen
                ref={headingRef}
                contact={responses.contact}
                errors={contactErrors}
                onChange={setContact}
              />
            )}
            <ValidationMessage message={error} />
            <StepNav
              onBack={() => move(-1)}
              continueLabel={step.kind === 'contact' ? CONTACT_COPY.cta : UI.continue}
            />
          </form>
        </main>
      )}
    </div>
  )
}
