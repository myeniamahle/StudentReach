// backend/src/aiMessages.js
require("dotenv").config();

const SYSTEM_PROMPT = `You are a compassionate student advisor writing short,
warm, non-judgemental check-in messages to students. Max 2 sentences.
Never mention "flags" or "data". Offer support, not blame.`;

async function generateMessage(studentName, flagType, context) {
    const Anthropic = require("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const resp = await client.messages.create({
        model: "claude-3-5-sonnet-latest",
        max_tokens: 120,
        system: SYSTEM_PROMPT,
        messages: [
            {
                role: "user",
                content: `Student: ${studentName}\nSignal: ${flagType}\nContext: ${context}\n\nWrite the check-in message.`,
            },
        ],
    });
    return resp.content[0].text.trim();
}

module.exports = { generateMessage };