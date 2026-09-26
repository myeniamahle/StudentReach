const { pool } = require('./db');

async function loadStudents() {
  const { rows: students } = await pool.query('SELECT * FROM students ORDER BY student_number');
  for (const s of students) {
    const [attendance, assignments, fundingHistory, engagement] = await Promise.all([
      pool.query('SELECT period_start AS "periodStart", attendance_percent AS "attendancePercent" FROM attendance_records WHERE student_id=$1 ORDER BY period_start',[s.id]),
      pool.query('SELECT assignment_code AS "assignmentCode", due_date AS "dueDate", submitted FROM assignments WHERE student_id=$1 ORDER BY due_date',[s.id]),
      pool.query('SELECT status, effective_at AS "effectiveAt" FROM funding_status_history WHERE student_id=$1 ORDER BY effective_at',[s.id]),
      pool.query('SELECT period_start AS "periodStart", login_count AS "loginCount" FROM engagement_records WHERE student_id=$1 ORDER BY period_start',[s.id])
    ]);
    s.attendance = attendance.rows;
    s.assignments = assignments.rows;
    s.fundingHistory = fundingHistory.rows;
    s.engagement = engagement.rows;
  }
  return students;
}
module.exports = { loadStudents };
