import axios from "axios";
import "dotenv/config";

// 🔹 Extract valid JSON from messy LLM output
function extractJSON(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;

  let jsonText = match[0];
  jsonText = jsonText.replace(/\/\/.*$/gm, "");
  return jsonText;
}

export async function askLLM({ message }) {
  const prompt = `
### TASK ###
Extract scheduling actions from the user request.
If the request mentions a meeting, sync, or time, you MUST include a "schedule_meeting" action.

### TOOLS ###
1. "schedule_meeting": { "date": "YYYY-MM-DD", "time": "HH:MM", "title": "string" }
2. "set_reminder": { "minutes_before": number, "message": "string" }

### RULES ###
- Respond ONLY with JSON.
- If a reminder is requested, include BOTH actions.

### EXAMPLES ###
User: "Schedule sync tomorrow 10am and remind me 5m before"
Result:
{
  "actions": [
    { "type": "schedule_meeting", "date": "2024-05-20", "time": "10:00", "title": "Sync" },
    { "type": "set_reminder", "minutes_before": 5, "message": "Meeting Sync" }
  ]
}

User request: "${message}"`;

  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "tinyllama",
      prompt,
      stream: false,
      format: "json",
      options: {
        temperature: 0,
        num_predict: 256
      }
    });

    const raw = response.data.response;
    console.log("🧠 RAW LLM OUTPUT:\n", raw);

    const cleaned = extractJSON(raw);
    if (!cleaned) return { actions: [] };

    try {
      return JSON.parse(cleaned);
    } catch (err) {
      console.error("❌ JSON PARSE FAILED", err);
      return { actions: [] };
    }
  } catch (error) {
    console.error("❌ Ollama API Error:", error.message);
    if (error.message.includes("404")) {
      console.log("⚠️ tinyllama model not found. Run 'ollama pull tinyllama'");
    }
    return { actions: [] };
  }
}
