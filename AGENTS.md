# AGENTS.md

## What this is
WorkSpeak™ Communication Readiness Map, by Sunset Languages. A single-route (`/`) multi-step self-report assessment built with TanStack Start + Tailwind v4, deployed on Netlify. MVP: no backend, no submission, no auth.

## Architecture — four layers, kept separate
1. **Content** — `src/assessment/content.ts` (UI copy, labels, stages, dimension names) and `src/assessment/profiles.ts` (result copy keyed by primary dimension, next-step copy).
2. **Assessment data** — `src/assessment/questions.ts`. Every question is config; components render whatever is there. Readiness/training items carry hidden `weight`s. Items flagged `draft: true` are unreviewed.
3. **Interpretation rules** — `src/assessment/interpretation.ts`. `buildMapResult(responses)` → `MapResult`. Placeholder thresholds; replace freely.
4. **UI** — `src/components/*` (question/option/progress/contact) and `src/components/results/*`. `src/routes/index.tsx` orchestrates steps.

Supporting: `types.ts` (data model), `steps.ts` (screen sequence derived from config + validation), `useAssessment.ts` (state + sessionStorage persistence), `submission.ts` (empty hook point for future Netlify Forms / Functions + DB).

## Data model rules (do not merge these)
`Responses` has separate buckets: `context` (never scored), `readiness` (ASSESSMENT PATTERN), `friction` (SELF-PERCEIVED FRICTION — never used to compute the pattern), `training` (TRAINING READINESS — separate from communication readiness), `contact`.

## Brand + copy conventions
- Colors only: navy `#0F1E2E`, strategic `#1F3F3A`, amber `#C96F1A`, offwhite `#F4F2ED`, graphite `#2B2F36` (Tailwind tokens in `src/styles.css`). Target ~70% navy / 20% offwhite / 10% green; amber is an accent (CTA, progress line, active markers) only.
- Sora for headings, Inter for body. `eyebrow` is a custom Tailwind utility; override its size with the suffix important syntax (`text-[10px]!`).
- Sunset Languages is the parent brand in the header. WorkSpeak™ appears as a typographic label only — never create a WorkSpeak logo or palette.
- Lines/markers/grids, not rounded cards, shadows, gradients, badges or gamification.
- Never display numeric scores. Result language must stay hypothesis-framed ("Your answers suggest…", "may"). Never claim validation, proficiency level or diagnosis.
- Amber CTA buttons use navy text (off-white on amber fails contrast).

## Non-obvious decisions
- One question per screen; `STEPS` is derived from `QUESTIONS_BY_SECTION`, so adding/removing items needs no UI changes.
- Option order in readiness items is intentionally mixed so answers don't read good → bad.
- Native radio/checkbox inputs (visually hidden) provide keyboard access; focus moves to each screen's `h1` on step change.
- Bootcamp link is a placeholder (`BOOTCAMP_URL` in content.ts).
