import { scheduleMeeting } from "../tools/calendar.tool.js";
import { setReminder } from "../tools/reminder.tool.js";
import { saveNote } from "../tools/notes.tool.js";
import { sendEmail } from "../tools/email.tool.js";

export const tools = {
  schedule_meeting: scheduleMeeting,
  set_reminder: setReminder,
  save_note: saveNote,
  send_email: sendEmail
};
