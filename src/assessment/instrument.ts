/**
 * Explicit instrument version stored with every submission, so future versions
 * of the assessment can coexist with historical data. Bump it whenever scored
 * items, options, weights or collection/storage semantics change — never derive
 * it from the deploy date.
 */
export const LEGACY_INSTRUMENT_VERSION = 'CRM-v1'
// Collection/storage refinement only. Questions, option ids and scoring are unchanged.
export const INSTRUMENT_VERSION = 'CRM-v2'
export const MAX_OPEN_TEXT_LENGTH = 1000
