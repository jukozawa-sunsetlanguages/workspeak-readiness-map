/**
 * WorkSpeak™ Communication Readiness Map → "Responses" sheet receiver.
 *
 * Paste into the Apps Script project bound to the spreadsheet
 * "Communication Readiness Map - WorkSpeak" and deploy as a Web App
 * (Execute as: Me · Who has access: Anyone). See README.md in this folder.
 *
 * - Requires the shared secret stored in Script Properties as WEBHOOK_SECRET
 *   (same value as GOOGLE_SHEETS_WEBHOOK_SECRET in Netlify).
 * - Maps values by header name, so column order in the sheet does not matter;
 *   unknown keys are ignored and missing keys are left blank.
 * - Upserts by submissionId: a retry updates the existing row instead of
 *   appending a duplicate, keeping the original submittedAt and never
 *   downgrading a "sent" email status.
 * - Performs no assessment logic. The application is the source of results.
 */

var SHEET_NAME = 'Responses';

// Used only to write the header row if the sheet is completely empty.
// Mirrors SHEET_COLUMNS in src/server/sheetRow.ts.
var COLUMNS = [
  'submissionId', 'submittedAt', 'instrumentVersion',
  'name', 'email', 'roleArea', 'marketingConsent',
  'professionalContexts', 'englishUseFrequency', 'spontaneousCommunicationPattern',
  'q1Clarity', 'q2Clarity', 'q3Interaction', 'q4Interaction', 'q5Interaction',
  'q6AccessUnderPressure', 'q7AccessUnderPressure', 'q8AccessUnderPressure',
  'q9Independence', 'q10Independence', 'q11Transfer', 'q12Transfer',
  'perceivedFrictions', 'thirtyDayGoal',
  'trainingReadinessResponses', 'trainingReadinessLabel',
  'clarityScore', 'interactionScore', 'accessUnderPressureScore', 'independenceScore', 'transferScore',
  'currentPattern', 'strongestDimension', 'primaryPatternToObserve', 'secondaryPatternToObserve',
  'recommendedTrainingFocus', 'bootcampFit',
  'resultEmailStatus', 'resultEmailSentAt',
  'source', 'utmSource', 'utmMedium', 'utmCampaign',
  'notes'
];

// Kept from the first write when a submission is updated.
var PRESERVE_ON_UPDATE = ['submittedAt'];

function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var expected = PropertiesService.getScriptProperties().getProperty('WEBHOOK_SECRET');
    if (!expected || typeof body.secret !== 'string' || body.secret !== expected) {
      return json_({ ok: false, error: 'unauthorized' });
    }
    var row = body.row;
    if (!row || typeof row !== 'object' || typeof row.submissionId !== 'string' || !row.submissionId) {
      return json_({ ok: false, error: 'invalid_row' });
    }

    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      return json_(upsert_(row));
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    console.error('doPost failed: ' + err);
    return json_({ ok: false, error: 'server_error' });
  }
}

function upsert_(row) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return { ok: false, error: 'sheet_not_found' };

  if (sheet.getLastColumn() === 0) {
    sheet.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS]);
  }
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(function (h) {
    return String(h).trim();
  });
  var idIndex = headers.indexOf('submissionId');
  if (idIndex < 0) return { ok: false, error: 'missing_submissionId_column' };

  var values = headers.map(function (h) {
    return Object.prototype.hasOwnProperty.call(row, h) && row[h] !== null ? row[h] : '';
  });

  var existingRow = findRow_(sheet, idIndex + 1, row.submissionId);
  if (existingRow) {
    var range = sheet.getRange(existingRow, 1, 1, headers.length);
    var current = range.getValues()[0];
    headers.forEach(function (h, i) {
      if (PRESERVE_ON_UPDATE.indexOf(h) >= 0 && current[i] !== '') values[i] = current[i];
    });
    var statusIndex = headers.indexOf('resultEmailStatus');
    var sentAtIndex = headers.indexOf('resultEmailSentAt');
    if (statusIndex >= 0 && current[statusIndex] === 'sent' && values[statusIndex] !== 'sent') {
      values[statusIndex] = current[statusIndex];
      if (sentAtIndex >= 0) values[sentAtIndex] = current[sentAtIndex];
    }
    range.setValues([values]);
    return { ok: true, action: 'updated' };
  }

  sheet.appendRow(values);
  return { ok: true, action: 'appended' };
}

function findRow_(sheet, column, submissionId) {
  var last = sheet.getLastRow();
  if (last < 2) return 0;
  var match = sheet
    .getRange(2, column, last - 1, 1)
    .createTextFinder(submissionId)
    .matchEntireCell(true)
    .findNext();
  return match ? match.getRow() : 0;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
