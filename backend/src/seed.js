const { pool } = require('./db');
const { createSeedProfiles } = require('./seedData');

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`TRUNCATE advisor_reviews, message_log, detection_flags, engagement_records, funding_status_history, assignments, attendance_records, students CASCADE`);

    for (const profile of createSeedProfiles()) {
      const result = await client.query(
        `INSERT INTO students(student_number,first_name,last_name,email,programme,year_level)
         VALUES($1,$2,$3,$4,$5,$6) RETURNING id`,
        [profile.studentNumber, profile.firstName, profile.lastName, profile.email, profile.programme, profile.yearLevel]
      );
      const studentId = result.rows[0].id;

      for (const row of profile.attendance) {
        await client.query(
          `INSERT INTO attendance_records(student_id,period_start,attendance_percent) VALUES($1,$2,$3)`,
          [studentId, row.periodStart, row.attendancePercent]
        );
      }

      for (const row of profile.assignments) {
        await client.query(
          `INSERT INTO assignments(student_id,assignment_code,due_date,submitted,submitted_at) VALUES($1,$2,$3,$4,$5)`,
          [studentId, row.assignmentCode, row.dueDate, row.submitted, row.submittedAt]
        );
      }

      for (const row of profile.fundingHistory) {
        await client.query(
          `INSERT INTO funding_status_history(student_id,status,effective_at) VALUES($1,$2,$3)`,
          [studentId, row.status, row.effectiveAt]
        );
      }

      for (const row of profile.engagement) {
        await client.query(
          `INSERT INTO engagement_records(student_id,period_start,login_count) VALUES($1,$2,$3)`,
          [studentId, row.periodStart, row.loginCount]
        );
      }
    }

    await client.query('COMMIT');
    console.log('Seeded 20 synthetic StudentReach profiles with current-dated histories.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

if (require.main === module) {
  seed().catch(error => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { seed };
