import { askLLM } from "../utils/llm.js";
import { executeTool } from "../mcp/toolExecutor.js";

// Casual conversation patterns
const casualPatterns = {
  greetings: /^(hi|hello|hey|good morning|good afternoon|good evening)/i,
  thanks: /^(thank|thanks|thank you|thx|appreciate)/i,
  goodbye: /^(bye|goodbye|see you|later|take care)/i,
  howAreYou: /^(how are you|how's it going|what's up|wassup)/i,
  help: /^(help|what can you do|commands|features)/i
};

const casualResponses = {
  greetings: [
    "Hello! 👋 How can I help you schedule your day?",
    "Hi there! Ready to organize your calendar?",
    "Hey! What would you like to schedule today?"
  ],
  thanks: [
    "You're welcome! 😊 Let me know if you need anything else.",
    "Happy to help! Feel free to ask if you need more scheduling assistance.",
    "Anytime! I'm here whenever you need to plan your meetings."
  ],
  goodbye: [
    "Goodbye! Have a productive day! 👋",
    "See you later! Don't forget to check your calendar.",
    "Take care! Come back anytime you need to schedule something."
  ],
  howAreYou: [
    "I'm doing great, thanks for asking! Ready to help you schedule your meetings. 😊",
    "All systems running smoothly! How can I assist with your calendar today?",
    "Fantastic! What can I help you schedule?"
  ],
  help: [
    `I can help you with:
📅 Schedule meetings - "Schedule a sync tomorrow at 3pm"
🔔 Set reminders - "Remind me 10 minutes before"
📧 Send confirmations - Automatic email notifications
🕐 Check availability - "When am I free this week?"

Just tell me what you need!`
  ]
};

function detectCasualConversation(message) {
  const lowerMsg = message.trim().toLowerCase();

  for (const [type, pattern] of Object.entries(casualPatterns)) {
    if (pattern.test(lowerMsg)) {
      const responses = casualResponses[type];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  return null;
}

export async function runAgent(userMessage, userConfig = {}) {
  // Check for casual conversation first
  const casualResponse = detectCasualConversation(userMessage);
  if (casualResponse) {
    return {
      status: "success",
      reply: casualResponse,
      executions: []
    };
  }

  const { actions } = await askLLM({ message: userMessage });

  let finalActions = actions || [];

  // 🛡️ SECURITY CHECK: If tinyllama missed the 'schedule_meeting' but it's clearly needed
  const hasSchedule = finalActions.some(a => (a.type || a.name || a.tool || "").toLowerCase().includes("sche"));
  const isErrorReport = userMessage.toLowerCase().includes("failed") || userMessage.toLowerCase().includes("error");
  const needsSchedule = !isErrorReport && (userMessage.toLowerCase().includes("schedule") || userMessage.toLowerCase().includes("meeting") || userMessage.toLowerCase().includes("sync"));

  if (!hasSchedule && needsSchedule) {
    console.log("⚠️ LLM missed schedule action. Auto-injecting...");

    let reminderMsg = finalActions.find(a => (a.type || "").includes("remind"))?.message || "";
    let context = (userMessage + " " + reminderMsg).toLowerCase();

    const timeRegex = /(1[0-2]|0?[1-9])([:|.][0-5][0-9])?\s*(am|pm)|(2[0-3]|[01]?[0-9])[:|.]([0-5][0-9])|(1[0-2]|[1-9])\s*(am|pm)/gi;
    const timeMatch = timeRegex.exec(context);

    let hour = 10;
    let minute = "00";

    if (timeMatch) {
      console.log("📍 Time found in context:", timeMatch[0]);
      // Handle cases like "4:30pm", "4.30pm", "4pm", "16:30"
      if (timeMatch[1]) { // am/pm format with optional minute
        hour = parseInt(timeMatch[1]);
        if (timeMatch[2]) minute = timeMatch[2].substring(1);
        const ampm = timeMatch[3].toLowerCase();
        if (ampm === "pm" && hour < 12) hour += 12;
        if (ampm === "am" && hour === 12) hour = 0;
      } else if (timeMatch[4]) { // 24h format
        hour = parseInt(timeMatch[4]);
        minute = timeMatch[5];
      } else if (timeMatch[6]) { // simple hour + am/pm
        hour = parseInt(timeMatch[6]);
        const ampm = timeMatch[7].toLowerCase();
        if (ampm === "pm" && hour < 12) hour += 12;
        if (ampm === "am" && hour === 12) hour = 0;
      }
    }

    const formattedTime = `${hour.toString().padStart(2, "0")}:${minute.replace(".", ":")}`;
    console.log(`🕒 Extracted Time: ${formattedTime}`);

    // 📅 DATE SMART-LOGIC: Use local time context
    const now = new Date();
    let date = now.toISOString().split("T")[0];

    // Check for day names in context
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const dayFound = days.find(d => context.includes(d));

    if (dayFound) {
      const targetDayIndex = days.indexOf(dayFound);
      const currentDayIndex = now.getDay();
      let daysToAdd = targetDayIndex - currentDayIndex;
      if (daysToAdd <= 0) daysToAdd += 7; // Next occurrence of that day

      now.setDate(now.getDate() + daysToAdd);
      date = now.toISOString().split("T")[0];
      console.log(`📅 Day name '${dayFound}' detected. Target date: ${date}`);
    } else {
      // If time is in the past today, move to tomorrow
      const scheduledTotalMins = (hour * 60) + parseInt(minute);
      const nowTotalMins = (now.getHours() * 60) + now.getMinutes();

      if (scheduledTotalMins <= nowTotalMins) {
        now.setDate(now.getDate() + 1);
        date = now.toISOString().split("T")[0];
        console.log(`➡️ Time has passed today. Moving to tomorrow: ${date}`);
      }
    }

    finalActions.unshift({
      type: "schedule_meeting",
      date: date,
      time: formattedTime,
      title: "AI Scheduled Meeting"
    });
  }

  if (finalActions.length === 0) {
    return {
      status: "success",
      reply: "I'm not sure what you'd like me to do. Try asking me to:\n• Schedule a meeting\n• Check your availability\n• Set a reminder\n\nOr just say 'help' to see what I can do! 😊",
      executions: []
    };
  }

  const results = [];
  let summaryParts = [];

  for (const action of finalActions) {
    let rawName = (action.type || action.name || action.tool || "").toLowerCase();
    let toolName = rawName;

    if (rawName.includes("sche") || rawName.includes("mee")) {
      toolName = "schedule_meeting";
    } else if (rawName.includes("remind")) {
      toolName = "set_reminder";
    } else if (rawName.includes("mail") || rawName.includes("email")) {
      toolName = "send_email";
    } else if (rawName.includes("availab") || rawName.includes("free") || rawName.includes("slot")) {
      toolName = "check_availability";
    }

    const result = await executeTool(toolName, action, userConfig);
    console.log(`✅ Result from ${toolName}:`, result);

    results.push({ tool: toolName, status: result.status, data: result });

    if (result.status === "success" || result.status === "reminder set") {
      if (toolName === "schedule_meeting") {
        const date = result.date || action.date || "tomorrow";
        const time = result.time || action.time || "10:00";
        const link = result.meetingLink ? `https://cal.com/booking/${result.meetingLink}` : "Scheduled at Cal.com";
        summaryParts.push(`✅ Meeting scheduled for ${date} at ${time}.\n🔗 Link: ${link}`);

        // 📧 Auto-send email if scheduled successfully
        if (result.meetingLink) {
          console.log("📨 Auto-triggering email confirmation...");
          await executeTool("send_email", {
            subject: `Meeting Confirmed: ${action.title || "AI Sync"}`,
            body: `Your meeting is confirmed for ${date} at ${time}.\n\nBooking Link: https://cal.com/booking/${result.meetingLink}`
          }, userConfig);
          summaryParts.push(`📨 Confirmation email sent to ${userConfig.email}`);
        }
      } else if (toolName === "set_reminder") {
        const mins = result.minutes_before || action.minutes_before || action.minutesBefore;
        summaryParts.push(`🔔 Reminder set for ${mins} minutes before.`);
      } else if (toolName === "check_availability") {
        summaryParts.push(result.summary || "Availability checked.");
      }
    } else {
      summaryParts.push(`❌ ${toolName} failed: ${result.message || "Unknown error"}`);
    }
  }

  return {
    status: "success",
    reply: summaryParts.join("\n") || "Actions completed.",
    executions: results
  };
}
