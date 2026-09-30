# AGENTS.md

## What this is
WorkSpeak™ Communication Readiness Map, by Sunset Languages. A single-route (`/`) multi-step self-report assessment built with TanStack Start + Tailwind v4, deployed on Netlify. MVP: no auth, no database. Completed Maps are emailed (Resend) and recorded in Google Sheets (Apps Script) by one Netlify Function.

## Architecture — four layers, kept separate
1. **Content** — `src/assessment/content.ts` (UI copy, labels, stages, dimension names) and `src/assessment/profiles.ts` (result copy keyed by primary dimension, next-step copy).
2. **Assessment data** — `src/assessment/questions.ts`. Every question is config; components render whatever is there. Readiness/training items carry hidden `weight`s. Communication Readiness items are the reviewed WorkSpeak V1 set (option order is fixed — never sort by weight); Training items flagged `draft: true` are unreviewed.
3. **Interpretation rules** — `src/assessment/interpretation.ts`. `buildMapResult(responses)` → `MapResult`. Placeholder thresholds; replace freely.
4. **UI** — `src/components/*` (question/option/progress/contact) and `src/components/results/*`. `src/routes/index.tsx` orchestrates steps.

Supporting: `types.ts` (data model), `steps.ts` (screen sequence derived from config + validation), `useAssessment.ts` (state + sessionStorage persistence, including delivery state), `submission.ts` (client delivery + retries), `attribution.ts` (UTM/source), `instrument.ts` (`INSTRUMENT_VERSION`, bump when scored items change).

## Delivery (server)
- `netlify/functions/submit-map.mts` (`POST /api/submit-map`): validates (`src/server/validateSubmission.ts`), recomputes with `buildMapResult`, sends the email (`src/server/resultEmail.ts`), then upserts one Sheets row (`src/server/sheetRow.ts`) with the final email status. Results render client-side first and never wait on this.
- Idempotency: client-generated `submissionId` + `emailAttempt` → Resend `Idempotency-Key`; Apps Script (`google-apps-script/Code.gs`) upserts by `submissionId`. Keep `SHEET_COLUMNS` and `COLUMNS` in Code.gs in sync.
- Email and page share copy via `RESULT_COPY` / profiles; never add interpretation logic to the email or the sheet.
- Env: `RESEND_API_KEY`, `RESULT_EMAIL_FROM`, `RESULT_EMAIL_REPLY_TO`, `GOOGLE_SHEETS_WEBHOOK_URL`, `GOOGLE_SHEETS_WEBHOOK_SECRET` (server only).

## Data model rules (do not merge these)
`Responses` has separate buckets: `context` (never scored), `readiness` (ASSESSMENT PATTERN), `friction` (SELF-PERCEIVED FRICTION — never used to compute the pattern), `training` (TRAINING READINESS — separate from communication readiness), `contact`.

## Brand + copy conventions
- Colors only: navy `#0F1E2E`, strategic `#1F3F3A`, amber `#C96F1A`, offwhite `#F4F2ED`, graphite `#2B2F36` (Tailwind tokens in `src/styles.css`). Target ~70% navy / 20% offwhite / 10% green; amber is an accent (CTA, progress line, active markers) only.
- Sora for headings, Inter for body. `eyebrow` is a custom Tailwind utility; override its size with the suffix important syntax (`text-[10px]!`).
- All participant-facing copy is PT-BR. Keep in English only: WorkSpeak™, Communication Readiness Map, and the five dimension labels, shown in English only via `dimensionName()` (e.g. "Clarity"; descriptions stay PT-BR). Profiles have an internal English `patternName` and a displayed PT-BR `patternLabel`.
- Sunset Languages is the parent brand in the header, shown with the official logo (`public/brand/sunset-languages-logo.png`, navy canvas trimmed only — do not recreate it as text). WorkSpeak™ appears as a typographic label only — never create a WorkSpeak logo or palette.
- Lines/markers/grids, not rounded cards, shadows, gradients, badges or gamification.
- Never display numeric scores. Result language must stay hypothesis-framed ("Suas respostas sugerem…", "pode", "vale observar se…") and must never claim English knowledge/proficiency was measured. Never claim validation, proficiency level or diagnosis.
- Amber CTA buttons use navy text (off-white on amber fails contrast).

## Non-obvious decisions
- One question per screen; `STEPS` is derived from `QUESTIONS_BY_SECTION`, so adding/removing items needs no UI changes.
- Option order in readiness items is intentionally mixed so answers don't read good → bad.
- Native radio/checkbox inputs (visually hidden) provide keyboard access; focus moves to each screen's `h1` on step change.
- Bootcamp fit (`result.nextStep`, sheet column `bootcampFit`) is internal only: never show fit/Bootcamp copy to participants. The public next step is the same for everyone (`RESULT_COPY.nextFocus`). `BOOTCAMP_URL` / `NEXT_STEP_COPY` are unused placeholders.
- The result email includes a table-based dimension map driven by `result.dimensions` + `DIMENSION_STATES`, the same source as the web map (no SVG/JS).
