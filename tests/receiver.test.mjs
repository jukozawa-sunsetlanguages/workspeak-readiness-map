import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import fs from 'node:fs'
import { SHEET_COLUMNS } from '../src/server/sheetRow.ts'

const code = fs.readFileSync(new URL('../google-apps-script/Code.gs', import.meta.url), 'utf8')
function receiver(headers = [...SHEET_COLUMNS].reverse(), history = []) {
  const rows = [headers, ...structuredClone(history)]
  const writes = []
  const sheet = {
    getLastColumn: () => rows[0]?.length ?? 0,
    getLastRow: () => rows.length,
    getRange(row, column, height = 1, width = 1) {
      return {
        getValues: () => Array.from({ length: height }, (_, y) => Array.from({ length: width }, (_, x) => rows[row-1+y]?.[column-1+x] ?? '')),
        getValue: () => rows[row-1]?.[column-1] ?? '',
        setValue(value) { writes.push({ row, column, value }); rows[row-1][column-1] = value },
        setValues(values) { writes.push({ row, column, values }); values.forEach((cells,y) => cells.forEach((v,x) => { rows[row-1+y] ??= []; rows[row-1+y][column-1+x] = v })) },
        createTextFinder(value) { return { matchEntireCell: () => ({ findNext: () => { const index = rows.findIndex((r,i) => i >= row-1 && r[column-1] === value); return index < 0 ? null : { getRow: () => index+1 } } }) } },
      }
    },
    appendRow: values => { writes.push({ append: true }); rows.push(Array.from(values)) },
  }
  const context = vm.createContext({
    SpreadsheetApp: { getActiveSpreadsheet: () => ({ getSheetByName: () => sheet }) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => 'fixture-secret' }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: text => ({ setMimeType: () => JSON.parse(text) }) },
    console,
  })
  vm.runInContext(code, context)
  return { context, rows, writes, post: row => context.doPost({ postData: { contents: JSON.stringify({ secret: 'fixture-secret', row }) } }) }
}

test('Apps Script columns match application schema and header order is irrelevant', () => {
  const r = receiver()
  assert.deepEqual(Array.from(r.context.COLUMNS), [...SHEET_COLUMNS])
  const payload = Object.fromEntries(SHEET_COLUMNS.map((c, i) => [c, `${c}-${i}`]))
  payload.instrumentVersion = 'CRM-v2'
  assert.equal(r.post(payload).ok, true)
  r.rows[0].forEach((column,i) => assert.equal(r.rows[1][i], payload[column]))
})

test('receiver never overwrites historical answers, scores, manual notes, formulas or version', () => {
  const headers = [...SHEET_COLUMNS].reverse()
  const historical = headers.map(h => ({ submissionId: 'old-id', instrumentVersion: 'CRM-v1', resultEmailStatus: 'failed', notes: '=SUM(1,2)', submittedAt: 'old-date' })[h] ?? `historic-${h}`)
  const r = receiver(headers, [historical])
  const result = r.post({ submissionId: 'old-id', instrumentVersion: 'CRM-v2', q1Clarity: 'different', clarityScore: 99, notes: 'overwrite', resultEmailStatus: 'sent', resultEmailSentAt: 'new-sent-date' })
  assert.equal(result.action, 'updated')
  headers.forEach((h,i) => assert.equal(r.rows[1][i], h === 'resultEmailStatus' ? 'sent' : h === 'resultEmailSentAt' ? 'new-sent-date' : historical[i]))
  assert.equal(r.writes.length, 2)
  r.post({ submissionId: 'old-id', resultEmailStatus: 'failed', resultEmailSentAt: '' })
  assert.equal(r.writes.length, 2)
  assert.equal(r.rows.length, 2)
})

test('duplicate submissions do not append or change collected data', () => {
  const r = receiver()
  const payload = { submissionId: 'fixture-id', instrumentVersion: 'CRM-v2', q1Clarity: 'selected text', q1ClarityOpen: 'Ação\nNew line', resultEmailStatus: 'sent' }
  r.post(payload)
  const first = structuredClone(r.rows)
  r.post({ ...payload, q1ClarityOpen: 'different', resultEmailStatus: 'failed' })
  assert.deepEqual(r.rows, first)
  assert.equal(r.rows.length, 2)
})

test('write boundary escapes formula candidates without modifying normal multiline text', () => {
  const r = receiver()
  for (const input of ['=1+1','+x','-x','@x','  =1+1','\t=1','\n=1']) assert.equal(r.context.safeCell_(input), "'"+input)
  for (const input of ['Ação\nI explain', "'=1+1", '42']) assert.equal(r.context.safeCell_(input), input)
  assert.equal(r.context.safeCell_(2), 2)
  assert.equal(r.context.safeCell_(false), false)
  r.post({ submissionId: 'formula-fixture', instrumentVersion: 'CRM-v2', q1ClarityOpen: '=1+1', notes: '\n=1' })
  assert.equal(r.rows[1][r.rows[0].indexOf('q1ClarityOpen')], "'=1+1")
})

test('incomplete or duplicate headers fail explicitly before any new write', () => {
  const missing = receiver(SHEET_COLUMNS.filter(c => c !== 'q1ClarityOpen'))
  assert.equal(missing.post({ submissionId: 'fixture', instrumentVersion: 'CRM-v2' }).error, 'schema_upgrade_required')
  assert.equal(missing.writes.length, 0)
  const duplicates = receiver([...SHEET_COLUMNS, 'q1Clarity'])
  assert.equal(duplicates.post({ submissionId: 'fixture', instrumentVersion: 'CRM-v2' }).error, 'duplicate_headers')
  assert.equal(duplicates.writes.length, 0)
})

test('legacy payload still appends safely to upgraded sheet, with new fields blank', () => {
  const r = receiver()
  assert.equal(r.post({ submissionId: 'legacy', instrumentVersion: 'CRM-v1', q1Clarity: 'a' }).ok, true)
  assert.equal(r.rows[1][r.rows[0].indexOf('q1Clarity')], 'a')
  assert.equal(r.rows[1][r.rows[0].indexOf('q1ClarityOpen')], '')
  assert.equal(r.rows[1][r.rows[0].indexOf('technicalResponses')], '')
})

test('unauthorized receiver requests never touch the sheet', () => {
  const r = receiver()
  assert.equal(r.context.doPost({ postData: { contents: JSON.stringify({ secret: 'wrong', row: { submissionId: 'fixture' } }) } }).error, 'unauthorized')
  assert.equal(r.writes.length, 0)
})
