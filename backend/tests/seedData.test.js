const test = require('node:test');
const assert = require('node:assert/strict');
const { createSeedProfiles } = require('../src/seedData');
const { RULES, detectStudent } = require('../src/detection');

test('synthetic profiles include full histories and exercise all five rules', () => {
  const now = new Date('2026-09-27T12:00:00.000Z');
  const profiles = createSeedProfiles(now);

  assert.equal(profiles.length, 20);
  for (const profile of profiles) {
    assert.equal(profile.attendance.length, 6);
    assert.equal(profile.assignments.length, 4);
    assert.ok(profile.fundingHistory.length >= 1);
    assert.equal(profile.engagement.length, 6);
  }

  const fundingStatuses = new Set(profiles.flatMap(profile => profile.fundingHistory.map(row => row.status)));
  assert.deepEqual([...fundingStatuses].sort(), ['active', 'approved', 'pending', 'unresolved']);

  const flags = profiles.flatMap(profile => detectStudent(profile, now));
  const ruleCounts = Object.fromEntries(
    Object.values(RULES).map(ruleCode => [
      ruleCode,
      flags.filter(flag => flag.ruleCode === ruleCode).length
    ])
  );

  for (const [ruleCode, count] of Object.entries(ruleCounts)) {
    assert.ok(count > 0, `expected synthetic data to trigger ${ruleCode}`);
  }

  for (const flag of flags) {
    assert.ok(new Date(flag.detectedAt) <= now, `${flag.ruleCode} must not be future-dated`);
    assert.ok(Number.isFinite(flag.thresholdValue), `${flag.ruleCode} must include its threshold`);
  }
});
