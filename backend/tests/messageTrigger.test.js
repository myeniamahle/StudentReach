const test = require('node:test');
const assert = require('node:assert/strict');
const { buildMessage } = require('../src/messageTrigger');

test('message templates match detection rule codes', async () => {
  const originalApiKey = process.env.ANTHROPIC_API_KEY;
  delete process.env.ANTHROPIC_API_KEY;

  try {
    const student = { first_name: 'Anele' };
    const cases = [
      ['ATTENDANCE_DROP', "missed some classes"],
      ['MISSED_ASSIGNMENTS', 'assignments are outstanding'],
      ['FUNDING_STATUS_CHANGE', 'funding status changed'],
      ['ENGAGEMENT_DROPOFF', 'quieter on the portal'],
      ['COMBINED_SIGNAL', 'few things have come up']
    ];

    for (const [ruleCode, expectedText] of cases) {
      const message = await buildMessage({ rule_code: ruleCode }, student);
      assert.match(message, new RegExp(expectedText));
      assert.match(message, /Anele/);
    }
  } finally {
    if (originalApiKey === undefined) delete process.env.ANTHROPIC_API_KEY;
    else process.env.ANTHROPIC_API_KEY = originalApiKey;
  }
});