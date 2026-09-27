const { pool } = require("./db");
const { categoriseReply } = require("./aiReplies"); // optional, see 2.4

const CATEGORIES = {
    1: "ok_busy",
    2: "academic_struggle",
    3: "personal_issues",
    4: "funding_need",
};

async function handleReply(studentId, replyCode, replyText) {
    let category = CATEGORIES[replyCode] || "unknown";
    let confidence = 1.0;

    if (process.env.ANTHROPIC_API_KEY && replyText) {
        try {
            const r = await categoriseReply(replyText);
            category = r.category;
            confidence = r.confidence;
        } catch (e) {
            console.warn("[replyHandler] AI categorise failed:", e.message);
        }
    }

    const { rows: [log] } = await pool.query(
          `INSERT INTO message_log (student_id, channel, message_text, sent_at, status, reply_code, reply_category)
      VALUES ($1, 'in_app', $2, NOW(), 'received', $3, $4)
     RETURNING *`,
          [studentId, replyText || `[reply ${replyCode}]`, replyCode, category]
    );

    return { ok: true, code: replyCode, category, confidence, log };
}

module.exports = { handleReply };