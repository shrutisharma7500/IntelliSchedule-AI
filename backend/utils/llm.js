import OpenAI from "openai";
import "dotenv/config";

// Utility to get OpenAI client safely
let _openai = null;
const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) return null;
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return _openai;
};

// 🔹 Extract valid JSON from messy LLM output
function extractJSON(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  return match[0].replace(/\/\/.*$/gm, "");
}

export async function askLLM({ message }) {
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });

  const systemsPrompt = `You are a scheduling assistant. 
Current Date: ${dateStr} (${dayName}).
Extract actions from user requests.
TOOLS:
1. "schedule_meeting": { "date": "YYYY-MM-DD", "time": "HH:MM", "title": "string" }
2. "set_reminder": { "minutes_before": number, "message": "string" }
3. "check_availability": { "date": "YYYY-MM-DD" }

RULES:
- Respond ONLY with JSON in format: { "actions": [...] }
- If a meeting is mentioned, include "schedule_meeting".
- If no date is mentioned, use ${dateStr}.
- Calculate relative dates (e.g., "tomorrow") based on ${dateStr}.`;

  try {
    const openai = getOpenAIClient();
    if (!openai) {
      console.log("⚠️ OPENAI_API_KEY missing. Falling back to default (no actions)...");
      // Optional fallback to Ollama if local
      return { actions: [] };
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemsPrompt },
        { role: "user", content: message }
      ],
      response_format: { type: "json_object" },
      temperature: 0
    });

    const raw = response.choices[0].message.content;
    console.log("🧠 OPENAI OUTPUT:\n", raw);

    const cleaned = extractJSON(raw);
    if (!cleaned) return { actions: [] };

    return JSON.parse(cleaned);
  } catch (error) {
    console.error("❌ AI Error:", error.message);
    return { actions: [] };
  }
}
