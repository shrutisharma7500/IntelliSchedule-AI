import { scheduleMeeting } from "../tools/calendar.tool.js";
import { setReminder } from "../tools/reminder.tool.js";
import { sendEmail } from "../tools/email.tool.js";
import { checkAvailability } from "../tools/availability.tool.js";

export async function executeTool(name, args, userConfig = {}) {
  switch (name) {
    case "schedule_meeting":
      return scheduleMeeting(args, userConfig);
    case "set_reminder":
      return setReminder(args);
    case "send_email":
      return sendEmail(args, userConfig);
    case "check_availability":
      return checkAvailability(args, userConfig);
    default:
      return { error: `Unknown tool: ${name}` };
  }
}
