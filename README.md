# WorkSpeak™ Communication Readiness Map — by Sunset Languages

A short self-report reflection that helps professionals with intermediate or higher English see how their communication currently behaves under real work pressure. It produces an initial **working hypothesis** across five dimensions (Clarity, Interaction, Access Under Pressure, Independence, Transfer), kept separate from self-perceived friction and training readiness.

It is **not** an English proficiency test, a CEFR assessment or a validated psychometric instrument.

## Flow

Intro → Professional context → Communication readiness → Perceived friction → Training readiness → Result access → Results

## Stack

- TanStack Start (React 19, file-based routing) on Netlify
- Tailwind CSS v4 with the Sunset Languages palette defined in `src/styles.css`
- Sora (headings) and Inter (body) via Google Fonts
- Local state only; answers are kept in `sessionStorage` for the current browser session

## Run locally

```bash
pnpm install
netlify dev   # or: pnpm dev
```

## Editing content

- Assessment items: `src/assessment/questions.ts` (all marked **DRAFT — REQUIRES WORKSPEAK REVIEW BEFORE COMMERCIAL USE**)
- Result copy: `src/assessment/profiles.ts`
- Interpretation thresholds: `src/assessment/interpretation.ts`
- Interface copy and labels: `src/assessment/content.ts`

## CRM-v2 — collection and response storage

The 12 behavioral questions now have an optional expandable complement. Selected
option IDs still drive the existing assessment. New submissions store selected labels
for human review and retain IDs in a separate technical JSON record.

See [architecture, schema, verification and deployment](docs/response-refinement.md).

Development checks (Node.js 24 for the built-in test loader):

```bash
pnpm test
pnpm build
pnpm typecheck # run after build generates routeTree.gen.ts
```

Tests mock email and spreadsheet delivery; they do not contact leads or production Sheets.
