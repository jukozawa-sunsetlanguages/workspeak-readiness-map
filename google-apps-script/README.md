# Google Sheets receiver (Apps Script)

`Code.gs` receives one structured submission from the `submit-map` Netlify
Function and upserts it into the **Responses** tab, keyed by `submissionId`.

## Deploy

1. Open the spreadsheet **Communication Readiness Map - WorkSpeak** →
   Extensions → Apps Script (the project bound to the sheet).
2. Replace the contents of `Code.gs` with the file in this folder and save.
3. Project Settings → Script Properties → add `WEBHOOK_SECRET` with a long
   random value (for example, 40+ random characters). Use the same value for
   `GOOGLE_SHEETS_WEBHOOK_SECRET` in Netlify.
4. Deploy → New deployment → type **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone** (the secret protects the endpoint; participants
     never sign in to Google)
5. Authorize when prompted, then copy the Web app URL (ends in `/exec`) into
   `GOOGLE_SHEETS_WEBHOOK_URL` in Netlify.

After editing `Code.gs` later, use Deploy → Manage deployments → Edit →
Version: **New version** so the same `/exec` URL serves the new code.

## CRM-v2 upgrade (existing workbook)

See [the rollout and verification report](../docs/response-refinement.md) before deploying.
The workbook schema has already been extended and backed up; do not repeat inserts.
Deploy this receiver **before** the new Netlify application. Keep the existing secret
and `/exec` URL; edit the current deployment to serve a new script version.

- All values map by header name, never fixed indexes. `COLUMNS` initializes empty sheets only.
- CRM-v2 requires all 63 headers before appending; otherwise it returns `schema_upgrade_required`.
- `q1Clarity`…`q12Transfer` contain only the selected full label; each adjacent `...Open`
  contains the independent optional complement (blank when omitted).
- Multi-select labels use line breaks. `mostDemandingContext` has its own readable column.
- `trainingReadinessResponses` retains the original ID JSON; five additional columns
  show the individually selected Training Readiness labels.
- `technicalResponses` retains validated option IDs, prior free text and `openText` by section.
- CRM-v1 submissions keep their original ID/JSON representation. Never backfill historical
  labels using the current question configuration without deployment-version evidence.
- Retries update **only** email delivery status/timestamp. Collected data, version,
  scores, manual notes and unknown/custom columns are never overwritten.
- Every new string is protected against spreadsheet formula execution at the write boundary.
  An initial apostrophe is an input escape, not part of the participant's original text;
  unescaped validated text remains in `technicalResponses`.
- `notes` retains the prior supplementary JSON for compatibility, including “Outro”.
- The sheet performs no interpretation or scoring.
