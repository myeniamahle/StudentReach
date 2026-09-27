// backend/src/messageTrigger.js
const { pool } = require("./db");
const { generateMessage } = require("./aiMessages"); // optional, see 2.3

const TEMPLATES = {
    ATTENDANCE_DROP:
        "Hi {name}, we noticed you've missed some classes recently. Everything okay?",
    MISSED_ASSIGNMENTS:
        "Hi {name}, we see a couple of assignments are outstanding. Need a hand?",
    FUNDING_STATUS_CHANGE:
        "Hi {name}, your funding status changed. Want to talk through options?",
    ENGAGEMENT_DROPOFF:
        "Hi {name}, you've been quieter on the portal lately. How are you doing?",
    COMBINED_SIGNAL:
        "Hi {name}, a few things have come up. Can we check in?",
};

const COOLDOWN_DAYS = 7;

async function shouldTrigger(studentId) {
    const { rows } = await pool.query(
        `SELECT sent_at FROM message_log
     WHERE student_id = $1
     ORDER BY sent_at DESC LIMIT 1`,
        [studentId]
    );
    if (!rows.length) return true;
    const days = (Date.now() - new Date(rows[0].sent_at).getTime()) / 86400000;
    return days > COOLDOWN_DAYS;
}

async function buildMessage(flag, student) {
    // Try AI first if key present, fall back to templates
    if (process.env.ANTHROPIC_API_KEY) {
        try {
            return await generateMessage(student.first_name, flag.rule_code, flag.reason || "");
        } catch (e) {
            console.warn("[messageTrigger] AI failed, using template:", e.message);
        }
    }
    const t = TEMPLATES[flag.rule_code] || "Hi {name}, can we check in?";
    return t.replace("{name}", student.first_name);
}

async function triggerMessageForFlag(flag) {
    const { rows: [student] } = await pool.query(
        `SELECT * FROM students WHERE id = $1`,
        [flag.student_id]
    );
    if (!student) return null;
    if (!(await shouldTrigger(student.id))) return null;

    const text = await buildMessage(flag, student);
    const { rows: [log] } = await pool.query(
        `INSERT INTO message_log (student_id, flag_id, channel, message_text, sent_at, status)
     VALUES ($1, $2, 'in_app', $3, NOW(), 'sent')
     RETURNING *`,
        [student.id, flag.id, text]
    );
    return log;
}

module.exports = { triggerMessageForFlag, shouldTrigger, buildMessage };