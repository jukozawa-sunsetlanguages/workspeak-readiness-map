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
 *   appending a duplicate. Only email delivery status can be updated; collected
 *   data stays immutable and a "sent" status is never downgraded.
 * - Performs no assessment logic. The application is the source of results.
 */

var SHEET_NAME = 'Responses';

// Used only to write the header row if the sheet is completely empty.
// Mirrors SHEET_COLUMNS in src/server/sheetRow.ts.
var COLUMNS = [
  'submissionId',
  'submittedAt',
  'instrumentVersion',
  'name',
  'email',
  'roleArea',
  'marketingConsent',
  'professionalContexts',
  'englishUseFrequency',
  'spontaneousCommunicationPattern',
  'q1Clarity',
  'q1ClarityOpen',
  'q2Clarity',
  'q2ClarityOpen',
  'q3Interaction',
  'q3InteractionOpen',
  'q4Interaction',
  'q4InteractionOpen',
  'q5Interaction',
  'q5InteractionOpen',
  'q6AccessUnderPressure',
  'q6AccessUnderPressureOpen',
  'q7AccessUnderPressure',
  'q7AccessUnderPressureOpen',
  'q8AccessUnderPressure',
  'q8AccessUnderPressureOpen',
  'q9Independence',
  'q9IndependenceOpen',
  'q10Independence',
  'q10IndependenceOpen',
  'q11Transfer',
  'q11TransferOpen',
  'q12Transfer',
  'q12TransferOpen',
  'perceivedFrictions',
  'thirtyDayGoal',
  'trainingReadinessResponses',
  'trainingReadinessLabel',
  'clarityScore',
  'interactionScore',
  'accessUnderPressureScore',
  'independenceScore',
  'transferScore',
  'currentPattern',
  'strongestDimension',
  'primaryPatternToObserve',
  'secondaryPatternToObserve',
  'recommendedTrainingFocus',
  'bootcampFit',
  'resultEmailStatus',
  'resultEmailSentAt',
  'source',
  'utmSource',
  'utmMedium',
  'utmCampaign',
  'notes',
  'mostDemandingContext',
  'trainingReadinessTime',
  'trainingReadinessRepetition',
  'trainingReadinessRecording',
  'trainingReadinessWeaknessExposed',
  'trainingReadinessFeedback',
  'technicalResponses',
];


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

  if (new Set(headers).size !== headers.length) return { ok: false, error: 'duplicate_headers' };
  var existingRow = findRow_(sheet, idIndex + 1, row.submissionId);
  if (existingRow) {
    // Retry writes delivery status only. Collected data and trainer notes stay intact.
    var statusIndex = headers.indexOf('resultEmailStatus');
    var sentAtIndex = headers.indexOf('resultEmailSentAt');
    if (statusIndex >= 0) {
      var statusCell = sheet.getRange(existingRow, statusIndex + 1);
      var currentStatus = statusCell.getValue();
      if (currentStatus !== 'sent' && (row.resultEmailStatus === 'sent' || row.resultEmailStatus === 'failed')) {
        statusCell.setValue(row.resultEmailStatus);
        if (sentAtIndex >= 0 && row.resultEmailStatus === 'sent') {
          sheet.getRange(existingRow, sentAtIndex + 1).setValue(safeCell_(row.resultEmailSentAt || ''));
        }
      }
    }
    return { ok: true, action: 'updated' };
  }
  // Never silently drop CRM-v2 fields when the schema upgrade is incomplete.
  if (row.instrumentVersion === 'CRM-v2' && COLUMNS.some(function (h) { return headers.indexOf(h) < 0; })) {
    return { ok: false, error: 'schema_upgrade_required' };
  }
  var values = headers.map(function (h) {
    return safeCell_(Object.prototype.hasOwnProperty.call(row, h) && row[h] !== null ? row[h] : '');
  });
  sheet.appendRow(values);
  return { ok: true, action: 'appended' };
}

/** Guard every write, including payloads from older application code. */
function safeCell_(value) {
  if (typeof value !== 'string') return value;
  return /^(?:[=+\-@\t\r\n]|\s+[=+\-@])/.test(value) ? "'" + value : value;
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
