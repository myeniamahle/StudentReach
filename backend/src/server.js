const express = require('express');
const cors = require('cors');
const { pool } = require('./db');
const { loadStudents } = require('./repository');
const { runDetection } = require('./runDetection');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', async (_req,res) => {
  try { await pool.query('SELECT 1'); res.json({status:'ok', database:'connected'}); }
  catch { res.status(503).json({status:'error', database:'unavailable'}); }
});

app.get('/api/students', async (_req,res) => {
  try { const students = await loadStudents(); res.json(students); }
  catch(e) { res.status(500).json({error:e.message}); }
});

app.get('/api/students/:id', async (req,res) => {
  try {
    const students = await loadStudents();
    const student = students.find(s => s.id === req.params.id);
    if (!student) return res.status(404).json({error:'Student not found'});
    res.json(student);
  } catch(e) { res.status(500).json({error:e.message}); }
});

app.get('/api/flags', async (req,res) => {
  try {
    const status = req.query.status || 'active';
    const { rows } = await pool.query(`SELECT f.*, s.student_number, s.first_name, s.last_name, s.programme FROM detection_flags f JOIN students s ON s.id=f.student_id WHERE f.status=$1 ORDER BY CASE WHEN f.priority='high' THEN 0 ELSE 1 END, f.detected_at DESC`,[status]);
    res.json(rows);
  } catch(e) { res.status(500).json({error:e.message}); }
});

app.get('/api/flags/:id', async (req,res) => {
  try {
    const { rows } = await pool.query(`SELECT f.*, s.student_number, s.first_name, s.last_name, s.programme, s.year_level FROM detection_flags f JOIN students s ON s.id=f.student_id WHERE f.id=$1`,[req.params.id]);
    if (!rows[0]) return res.status(404).json({error:'Flag not found'});
    res.json(rows[0]);
  } catch(e) { res.status(500).json({error:e.message}); }
});

app.post('/api/detection/run', async (_req,res) => {
  try { const flags = await runDetection(); res.status(201).json({count:flags.length, flags}); }
  catch(e) { res.status(500).json({error:e.message}); }
});

app.patch('/api/flags/:id/status', async (req,res) => {
  const { status, advisorName='Demo Advisor', notes=null } = req.body;
  if (!['approved','dismissed','resolved'].includes(status)) return res.status(400).json({error:'status must be approved, dismissed, or resolved'});
  const client = await pool.connect();
  let flag;
  try {
    await client.query('BEGIN');
    const result = await client.query('UPDATE detection_flags SET status=$1 WHERE id=$2 RETURNING *',[status,req.params.id]);
    if (!result.rows[0]) { await client.query('ROLLBACK'); return res.status(404).json({error:'Flag not found'}); }
    await client.query('INSERT INTO advisor_reviews(flag_id,advisor_name,decision,notes) VALUES($1,$2,$3,$4)',[req.params.id,advisorName,status,notes]);
    await client.query('COMMIT');
    flag = result.rows[0];
  } catch(e) {
    await client.query('ROLLBACK');
    return res.status(500).json({error:e.message});
  }
  finally { client.release(); }

  let message = null;
  if (status === 'approved') {
    try {
      message = await triggerMessageForFlag(flag);
    } catch(e) {
      return res.status(500).json({error:'Flag approved, but the student message could not be logged.', flag});
    }
  }
  res.json({...flag, message});
});

// ---- Student messaging routes (Mmanga) ----
const { triggerMessageForFlag } = require("./messageTrigger");
const { handleReply } = require("./replyHandler");

// GET messages for a student (student app chat screen)
app.get("/students/:id/messages", async (req, res) => {
    const { pool } = require("./db");
    const { rows } = await pool.query(
          `SELECT id, message_text, sent_at, status
        FROM message_log
     WHERE student_id = $1 AND status = 'sent'
     ORDER BY sent_at ASC`,
        [req.params.id]
    );
    res.json(rows.map(r => ({ id: r.id, sender: "advisor", text: r.message_text })));
});

// POST reply from student
app.post("/students/:id/replies", async (req, res) => {
    try {
        const { reply_code, reply_text } = req.body;
        const result = await handleReply(req.params.id, reply_code, reply_text);
        res.json(result);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// POST manually trigger a message for a flag (for demo/testing)
app.post("/flags/:id/trigger-message", async (req, res) => {
    const { pool } = require("./db");
    const { rows: [flag] } = await pool.query(`SELECT * FROM detection_flags WHERE id = $1`, [req.params.id]);
    if (!flag) return res.status(404).json({ error: "flag not found" });
  if (flag.status !== 'approved') return res.status(409).json({ error: "flag must be approved before messaging the student" });
    const log = await triggerMessageForFlag(flag);
    res.json({ ok: !!log, log });
});

const port = process.env.PORT || 4000;
if (require.main === module) app.listen(port, () => console.log(`StudentReach API listening on http://localhost:${port}`));
module.exports = app;
