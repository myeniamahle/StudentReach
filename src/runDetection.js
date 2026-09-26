const { pool } = require('./db');
const { loadStudents } = require('./repository');
const { detectStudent } = require('./detection');

async function runDetection({ persist = true } = {}) {
  const students = await loadStudents();
  const allFlags = [];
  for (const student of students) {
    const flags = detectStudent(student);
    allFlags.push(...flags);
    if (persist) {
      for (const f of flags) {
        await pool.query(`INSERT INTO detection_flags(student_id,rule_code,priority,reason,threshold_value,observed_value,detected_at) VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (student_id,rule_code,detected_at) DO NOTHING`,[student.id,f.ruleCode,f.priority,f.reason,f.thresholdValue,f.observedValue,f.detectedAt]);
      }
    }
  }
  return allFlags;
}
if (require.main === module) runDetection().then(flags => { console.log(JSON.stringify(flags,null,2)); return pool.end(); }).catch(e => { console.error(e); process.exit(1); });
module.exports = { runDetection };
