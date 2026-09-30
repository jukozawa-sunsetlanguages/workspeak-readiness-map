/**
 * Local assessment state. Answers are kept in sessionStorage so a refresh or
 * accidental navigation does not lose progress. Nothing is sent to a server
 * in this MVP — see `submission.ts` for the future hook point.
 */
import { useCallback, useEffect, useState } from 'react'
import { STEPS } from './steps'
import type { Answer, ContactDetails, Responses, SectionId } from './types'

// Bumped when assessment items change so stale answers are not reused.
const STORAGE_KEY = 'workspeak-crm-v2'

export const EMPTY_RESPONSES: Responses = {
  context: {},
  readiness: {},
  friction: {},
  training: {},
  contact: { firstName: '', email: '', role: '' },
}

interface Persisted {
  stepIndex: number
  responses: Responses
}

export function useAssessment() {
  const [stepIndex, setStepIndex] = useState(0)
  const [responses, setResponses] = useState<Responses>(EMPTY_RESPONSES)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw) as Persisted
        setResponses({ ...EMPTY_RESPONSES, ...saved.responses })
        setStepIndex(Math.min(Math.max(saved.stepIndex, 0), STEPS.length - 1))
      }
    } catch {
      // Ignore corrupted or unavailable storage and start fresh.
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      const data: Persisted = { stepIndex, responses }
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      // Storage may be unavailable (private mode); state still works in memory.
    }
  }, [hydrated, stepIndex, responses])

  const setAnswer = useCallback((section: SectionId, questionId: string, answer: Answer) => {
    setResponses((prev) => ({
      ...prev,
      [section]: { ...prev[section], [questionId]: answer },
    }))
  }, [])

  const setContact = useCallback((contact: ContactDetails) => {
    setResponses((prev) => ({ ...prev, contact }))
  }, [])

  const goTo = useCallback((index: number) => {
    setStepIndex(Math.min(Math.max(index, 0), STEPS.length - 1))
  }, [])

  const reset = useCallback(() => {
    setResponses(EMPTY_RESPONSES)
    setStepIndex(0)
    try {
      window.sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }, [])

  return { stepIndex, responses, hydrated, setAnswer, setContact, goTo, reset }
}
