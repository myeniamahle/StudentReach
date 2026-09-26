const test = require('node:test');
const assert = require('node:assert/strict');
const { RULES, attendanceDrop, missedAssignments, fundingStatusChange, engagementDropoff, combinedSignal, detectStudent } = require('../src/detection');

const attendance = vals => vals.map((v,i)=>({periodStart:`2026-08-${String(1+i*7).padStart(2,'0')}`,attendancePercent:v}));
const engagement = vals => vals.map((v,i)=>({periodStart:`2026-08-${String(1+i*7).padStart(2,'0')}`,loginCount:v}));

test('attendance rule fires only when drop exceeds 25%', () => {
  assert.equal(attendanceDrop({attendance:attendance([90,88,92,90,60])}).ruleCode, RULES.ATTENDANCE_DROP);
  assert.equal(attendanceDrop({attendance:attendance([90,88,92,90,70])}), null);
});

test('missed assignment rule fires at two consecutive misses', () => {
  assert.equal(missedAssignments({assignments:[{dueDate:'2026-09-20',submitted:false},{dueDate:'2026-09-10',submitted:false}]}).observedValue, 2);
  assert.equal(missedAssignments({assignments:[{dueDate:'2026-09-20',submitted:false},{dueDate:'2026-09-10',submitted:true}]}), null);
});

test('funding rule fires on a status change', () => {
  assert.equal(fundingStatusChange({fundingHistory:[{effectiveAt:'2026-09-01',status:'active'},{effectiveAt:'2026-09-08',status:'pending'}]}).ruleCode, RULES.FUNDING_STATUS_CHANGE);
  assert.equal(fundingStatusChange({fundingHistory:[{effectiveAt:'2026-09-01',status:'active'},{effectiveAt:'2026-09-08',status:'active'}]}), null);
});

test('engagement rule fires when drop exceeds 50%', () => {
  assert.equal(engagementDropoff({engagement:engagement([10,8,9,10,3])}).ruleCode, RULES.ENGAGEMENT_DROPOFF);
  assert.equal(engagementDropoff({engagement:engagement([10,8,9,10,5])}), null);
});

test('combined rule fires for two signals in 14 days', () => {
  const now = new Date('2026-09-26T00:00:00Z');
  const flags = [
    {ruleCode:RULES.ATTENDANCE_DROP,detectedAt:'2026-09-20T00:00:00Z'},
    {ruleCode:RULES.ENGAGEMENT_DROPOFF,detectedAt:'2026-09-25T00:00:00Z'}
  ];
  assert.equal(combinedSignal(flags, now).ruleCode, RULES.COMBINED_SIGNAL);
  assert.equal(combinedSignal([{ruleCode:RULES.ATTENDANCE_DROP,detectedAt:'2026-09-01T00:00:00Z'}], now), null);
  assert.equal(combinedSignal([
    {ruleCode:RULES.ATTENDANCE_DROP,detectedAt:'2026-09-20T00:00:00Z'},
    {ruleCode:RULES.ENGAGEMENT_DROPOFF,detectedAt:'2026-09-27T00:00:00Z'}
  ], now), null);
});

test('student flags use their source event dates', () => {
  const student = {
    id: 'student-1',
    attendance: attendance([90, 60]).map((row, index) => ({ ...row, periodStart: index ? '2026-09-20' : '2026-09-13' })),
    assignments: [],
    fundingHistory: [],
    engagement: engagement([10, 4]).map((row, index) => ({ ...row, periodStart: index ? '2026-09-25' : '2026-09-18' }))
  };
  const flags = detectStudent(student, new Date('2026-09-26T00:00:00Z'));

  assert.equal(flags.find(flag => flag.ruleCode === RULES.ATTENDANCE_DROP).detectedAt, '2026-09-20T00:00:00.000Z');
  assert.equal(flags.find(flag => flag.ruleCode === RULES.ENGAGEMENT_DROPOFF).detectedAt, '2026-09-25T00:00:00.000Z');
  assert.equal(flags.find(flag => flag.ruleCode === RULES.COMBINED_SIGNAL).detectedAt, '2026-09-25T00:00:00.000Z');
});
