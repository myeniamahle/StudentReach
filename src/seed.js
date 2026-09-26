const { pool } = require('./db');

const names = [
  ['Anele','Mthembu'],['Sibusiso','Dlamini'],['Lerato','Mokoena'],['Thando','Ndlovu'],['Ayanda','Khumalo'],
  ['Zanele','Cele'],['Sipho','Mthethwa'],['Nokuthula','Zulu'],['Lwazi','Naidoo'],['Precious','Molefe'],
  ['Musa','Ngcobo'],['Kea','Mahlangu'],['Bongani','Sithole'],['Nosipho','Mbatha'],['Lindokuhle','Mkhize'],
  ['Samkelo','Buthelezi'],['Karabo','Mabena'],['Amahle','Hadebe'],['Siyabonga','Gumede'],['Khanyisa','Moyo']
];
const programmes = ['Information Technology','Computer Science','Business Information Systems','Data Science'];
const start = new Date('2026-08-24T00:00:00Z');
const isoDate = d => d.toISOString().slice(0,10);

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`TRUNCATE advisor_reviews, message_log, detection_flags, engagement_records, funding_status_history, assignments, attendance_records, students CASCADE`);
    for (let i=0;i<20;i++) {
      const [first,last] = names[i];
      const s = await client.query(`INSERT INTO students(student_number,first_name,last_name,email,programme,year_level) VALUES($1,$2,$3,$4,$5,$6) RETURNING id`, [`SR${String(1001+i)}`,first,last,`${first.toLowerCase()}.${last.toLowerCase()}@studentreach.test`,programmes[i%programmes.length],(i%3)+1]);
      const studentId = s.rows[0].id;
      const attendanceDrop = i % 4 === 0 || i === 17;
      const engagementDrop = i % 5 === 0 || i === 18;
      const missed = i % 3 === 0 || i === 19;
      const fundingChange = i % 4 === 1 || i === 18;
      for (let w=0;w<6;w++) {
        const d = new Date(start); d.setUTCDate(d.getUTCDate()+w*7);
        const attendance = attendanceDrop && w===5 ? 55 : 88 + ((i+w)%5);
        const logins = engagementDrop && w===5 ? 2 : 8 + ((i+w)%3);
        await client.query(`INSERT INTO attendance_records(student_id,period_start,attendance_percent) VALUES($1,$2,$3)`,[studentId,isoDate(d),attendance]);
        await client.query(`INSERT INTO engagement_records(student_id,period_start,login_count) VALUES($1,$2,$3)`,[studentId,isoDate(d),logins]);
      }
      for (let a=0;a<4;a++) {
        const d = new Date(start); d.setUTCDate(d.getUTCDate()+a*10);
        const submitted = !(missed && a>=2);
        await client.query(`INSERT INTO assignments(student_id,assignment_code,due_date,submitted,submitted_at) VALUES($1,$2,$3,$4,$5)`,[studentId,`A${a+1}`,isoDate(d),submitted,submitted ? new Date(d.getTime()+86400000) : null]);
      }
      const baseDate = new Date(start); baseDate.setUTCDate(baseDate.getUTCDate()+28);
      await client.query(`INSERT INTO funding_status_history(student_id,status,effective_at) VALUES($1,$2,$3)`,[studentId,'active',baseDate]);
      if (fundingChange) {
        const changed = new Date(baseDate.getTime()+7*86400000);
        await client.query(`INSERT INTO funding_status_history(student_id,status,effective_at) VALUES($1,$2,$3)`,[studentId,i%2?'pending':'unresolved',changed]);
      }
    }
    await client.query('COMMIT');
    console.log('Seeded 20 synthetic StudentReach profiles.');
  } catch(e) { await client.query('ROLLBACK'); throw e; }
  finally { client.release(); await pool.end(); }
}
seed().catch(e => { console.error(e); process.exit(1); });
