// backend/src/aiReplies.js
require("dotenv").config();

const CATEGORIES = {
    1: "ok_busy",
    2: "academic_struggle",
    3: "personal_issues",
    4: "funding_need",
};

async function categoriseReply(replyText) {
    const Anthropic = require("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const resp = await client.messages.create({
        model: "claude-3-5-haiku-latest",
        max_tokens: 5,
        messages: [
            {
                role: "user",
                content: `Classify into exactly one category:\n1=ok_busy, 2=academic_struggle, 3=personal_issues, 4=funding_need.\nReply: "${replyText}"\nAnswer with only the number.`,
            },
        ],
    });
    const raw = resp.content[0].text.trim();
    const code = "1234".includes(raw[0]) ? parseInt(raw[0], 10) : 1;
    return { code, category: CATEGORIES[code], confidence: 0.9 };
}

module.exports = { categoriseReply };