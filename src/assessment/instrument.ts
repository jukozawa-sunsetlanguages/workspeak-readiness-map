/**
 * Explicit instrument version stored with every submission, so future versions
 * of the assessment can coexist with historical data. Bump it whenever scored
 * items, options or weights change — never derive it from the deploy date.
 */
export const INSTRUMENT_VERSION = 'CRM-v1'
