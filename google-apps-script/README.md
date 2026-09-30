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

## Notes

- Values are matched to row‑1 headers by name. If the sheet is empty, the
  header row is written from `COLUMNS`.
- Arrays/objects arrive as JSON strings. `q1Clarity`…`q12Transfer` store the
  selected option id (`a`–`d`, in display order).
- `notes` holds supplementary raw answers as JSON (`mostDemandingContext`, and
  the free text for “Outro” when given).
- Dimension score columns are internal 0–3 means used to rank self-reported
  patterns. They are not psychometric scores and are never shown to
  participants.
