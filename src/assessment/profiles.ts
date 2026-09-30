/**
 * Result copy, keyed by the PRIMARY pattern to observe.
 *
 * PLACEHOLDER PROFILES — REQUIRE WORKSPEAK REVIEW BEFORE COMMERCIAL USE.
 * All language is hypothesis-framed ("may", "suggest", "based on what you
 * reported"). Keep it that way when editing: this Map is self-report only.
 */
import type { ContextKey, DimensionId } from './types'

export interface Profile {
  patternName: string
  observation: string
  hypothesis: string
  trainingPriority: { title: string; detail: string }
  workExamples: Partial<Record<ContextKey, string>>
}

export const PROFILES: Record<DimensionId, Profile> = {
  access: {
    patternName: 'Knowledge-rich, Access-limited',
    observation:
      'Your answers suggest that the language is often there, but reaching it takes longer when time is short or the conversation moves quickly. Based on what you reported, the delay appears between knowing what you want to say and being able to say it.',
    hypothesis:
      'Your answers suggest that English knowledge may not be the main constraint. The pattern appears more strongly when you need to retrieve and organize language quickly during interaction.',
    trainingPriority: {
      title: 'Faster retrieval + structured spontaneous response',
      detail:
        'The behavior worth testing is how quickly you can start a response with a simple structure and keep it going, even when the exact word is not immediately available.',
    },
    workExamples: {
      meetings: 'You may know what you want to contribute but enter the discussion later than intended.',
      interviews: 'Prepared answers may feel stable while unexpected follow-up questions create more processing time.',
      clients: 'You may simplify ideas that you could explain with more nuance in your native language.',
      presentations: 'The prepared part may run well, while questions at the end take longer to answer.',
      technical: 'You may know the technical content well, but pause while searching for the precise term.',
      leadership: 'When asked for a quick view, you may give a shorter answer than your thinking supports.',
      networking: 'Conversations may stay at a general level because moving to specifics takes extra effort.',
      negotiation: 'You may notice the right moment to respond but reach it after the conversation has moved on.',
    },
  },
  interaction: {
    patternName: 'Prepared-stable, Interaction-sensitive',
    observation:
      'Your answers suggest that communication is more stable when you control the direction, and less stable when the other person changes it. Based on what you reported, follow-ups, interruptions and misunderstandings appear to have the largest effect.',
    hypothesis:
      'Your answers suggest that the constraint may be less about what you can say and more about sustaining an exchange — responding, clarifying and returning to your point when the conversation shifts.',
    trainingPriority: {
      title: 'Recovery + continuity in live exchange',
      detail:
        'The behavior worth testing is how you respond to a follow-up or interruption and then return to your original line of reasoning.',
    },
    workExamples: {
      meetings: 'After an interruption, your original point may not return to the discussion.',
      interviews: 'A follow-up question may pull the answer away from the example you prepared.',
      clients: 'When a client asks for clarification, you may shorten the explanation rather than rebuild it.',
      presentations: 'The presentation itself may be stable while the Q&A feels less structured.',
      technical: 'Questions in the middle of an explanation may make it harder to finish the sequence.',
      leadership: 'Quick questions from leadership may lead you to agree before your view is fully expressed.',
      networking: 'Conversations may end sooner than you would like because continuing takes extra effort.',
      negotiation: 'A counter-proposal may shift the conversation before you have restated your position.',
    },
  },
  clarity: {
    patternName: 'Idea-rich, Structure-limited',
    observation:
      'Your answers suggest that ideas are available, but the route from idea to message is not always direct. Based on what you reported, the main point may arrive late or become diluted by sentence construction.',
    hypothesis:
      'Your answers suggest that the constraint may be the organization of the message rather than the language itself. The pattern appears more strongly when an idea is complex or needs to be adapted for a specific listener.',
    trainingPriority: {
      title: 'Message structure + point-first responses',
      detail:
        'The behavior worth testing is whether leading with the main point and using shorter sentences makes your explanations easier to follow.',
    },
    workExamples: {
      meetings: 'Contributions may begin with background, so the main point arrives after attention has moved.',
      interviews: 'Answers may contain the right content but take longer to reach the conclusion.',
      clients: 'Explanations may be accurate but harder for the client to follow than you intend.',
      presentations: 'Slides may be clear while spoken transitions between ideas feel less direct.',
      technical: 'Detail may come before the overall picture, making it harder for others to follow the logic.',
      leadership: 'Updates may be longer than leadership expects, with the key decision less visible.',
      networking: 'Describing what you do may take several attempts before it feels precise.',
      negotiation: 'Your position may be present in what you say but not stated clearly enough to anchor the discussion.',
    },
  },
  independence: {
    patternName: 'Capable, Support-dependent',
    observation:
      'Your answers suggest that you communicate effectively when support is available — scripts, notes, translation or a colleague. Based on what you reported, the pattern appears when that support is not there.',
    hypothesis:
      'Your answers suggest that preparation may be carrying more of your communication than necessary. The pattern appears more strongly when you need to continue without a script or simplify a message on your own.',
    trainingPriority: {
      title: 'Reduced preparation + independent recovery',
      detail:
        'The behavior worth testing is whether you can speak from a few key points and continue with a simpler version when the exact language is not available.',
    },
    workExamples: {
      meetings: 'You may contribute more easily to agenda items you prepared than to open discussion.',
      interviews: 'Memorized answers may feel stable while unplanned questions feel less so.',
      clients: 'You may prefer to follow up in writing rather than resolve a point during the call.',
      presentations: 'Delivery may depend on staying close to the script.',
      technical: 'You may rely on written documentation to explain what you could explain verbally.',
      leadership: 'You may prefer to prepare before speaking to leadership, even for routine updates.',
      networking: 'Unscripted conversations may feel harder to sustain than structured ones.',
      negotiation: 'You may depend on a prepared position and find it harder to adjust in the moment.',
    },
  },
  transfer: {
    patternName: 'Practice-stable, Transfer-limited',
    observation:
      'Your answers suggest a gap between what you can do in study or rehearsal and what appears in real work situations. Based on what you reported, language you know may not yet be available where it matters most.',
    hypothesis:
      'Your answers suggest that the constraint may be the transfer from practice to real use. The pattern appears more strongly in spontaneous professional situations than in prepared ones.',
    trainingPriority: {
      title: 'Contextualized practice + transfer to real situations',
      detail:
        'The behavior worth testing is whether practicing inside realistic professional scenarios helps trained language appear in real meetings, calls and interviews.',
    },
    workExamples: {
      meetings: 'Expressions you have studied may not appear when the discussion is live.',
      interviews: 'Rehearsed answers may feel stable, while the conversation around them feels less so.',
      clients: 'You may return to familiar phrases even when you know more precise ones.',
      presentations: 'Practiced delivery may feel different from how you communicate once questions begin.',
      technical: 'Terminology you use in writing may be harder to use in spoken explanations.',
      leadership: 'Language that feels available in class may be harder to reach in higher-stakes conversations.',
      networking: 'Small talk you have practiced may feel less natural in a real event.',
      negotiation: 'Structures you have trained may not appear when the conversation is unpredictable.',
    },
  },
}

/** Used when every dimension is reported as Strong. */
export const BROADLY_STABLE_PROFILE: Omit<Profile, 'workExamples'> = {
  patternName: 'Broadly stable, Refinement-focused',
  observation:
    'Your answers suggest that your communication is reported as stable across most situations. Based on what you reported, no single dimension stands out as a clear constraint.',
  hypothesis:
    'Your answers suggest that further development may be about refinement in specific high-stakes contexts rather than a consistent pattern across situations.',
  trainingPriority: {
    title: 'Targeted refinement in high-stakes contexts',
    detail:
      'The behavior worth testing is whether performance remains as stable in your most demanding situation as it is in everyday use.',
  },
}

export const NEXT_STEP_COPY = {
  fit: {
    headline: 'Ready to test this pattern in practice?',
    body: 'The WorkSpeak Bootcamp turns an initial communication hypothesis into targeted practice, observation and evidence over 30 days.',
    cta: 'Explore the WorkSpeak Bootcamp',
  },
  notYet: {
    headline: 'The Bootcamp may not be your best next step yet.',
    // PLACEHOLDER recommendations — require WorkSpeak review.
    reasons: {
      'training-constrained':
        'Based on what you reported, current conditions may make daily practice difficult. The Bootcamp depends on regular practice, so it may be more useful when you can protect 15–25 minutes on most days. In the meantime, you could observe one situation per week and note where the pattern appears.',
      'broadly-stable':
        'Based on what you reported, your communication appears broadly stable. A structured 30-day programme may add less than targeted preparation for a specific high-stakes situation, such as an interview or presentation.',
      foundation:
        'Based on what you reported, the pattern appears across all five dimensions. WorkSpeak is designed for professionals who already have a solid base in English. It may be worth building a broader language foundation first, then returning to the Map.',
      'low-use':
        'Based on what you reported, English is not currently part of your regular professional routine. WorkSpeak works best when there are real situations in which to test practice. It may be more useful when English use becomes more frequent.',
    },
  },
}
