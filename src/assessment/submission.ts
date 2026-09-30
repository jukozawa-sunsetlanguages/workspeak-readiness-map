/**
 * Submission hook point — PLACEHOLDER.
 *
 * The MVP does not send responses anywhere. A future iteration can replace
 * this function with Netlify Forms or a Netlify Function backed by persistent
 * storage. It is called once, when the participant requests their result.
 */
import type { MapResult, Responses } from './types'

export async function submitAssessment(_responses: Responses, _result: MapResult): Promise<void> {
  // Intentionally empty in the MVP.
}
