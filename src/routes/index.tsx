import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { buildMapResult } from '../assessment/interpretation'
import { STEPS, getAnswer, validateAnswer, validateContact } from '../assessment/steps'
import type { ContactErrors } from '../assessment/steps'
import { submitAssessment } from '../assessment/submission'
import { useAssessment } from '../assessment/useAssessment'
import BrandHeader from '../components/BrandHeader'
import ContactScreen from '../components/ContactScreen'
import IntroScreen from '../components/IntroScreen'
import ProgressRail from '../components/ProgressRail'
import QuestionScreen from '../components/QuestionScreen'
import StepNav from '../components/StepNav'
import ValidationMessage from '../components/ValidationMessage'
import ResultsView from '../components/results/ResultsView'
import { CONTACT_COPY } from '../assessment/content'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const { stepIndex, responses, setAnswer, setContact, goTo, reset } = useAssessment()
  const [error, setError] = useState<string | null>(null)
  const [contactErrors, setContactErrors] = useState<ContactErrors>({})
  const headingRef = useRef<HTMLHeadingElement>(null)
  const mounted = useRef(false)
  const step = STEPS[stepIndex]

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
      void submitAssessment(responses, buildMapResult(responses))
      move(1)
    }
  }

  function restart() {
    if (window.confirm('Start again? Your current answers will be cleared.')) {
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
              continueLabel={step.kind === 'contact' ? CONTACT_COPY.cta : 'Continue'}
            />
          </form>
        </main>
      )}
    </div>
  )
}
