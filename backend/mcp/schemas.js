export const toolSchemas = [
  {
    name: "schedule_meeting",
    description: "Schedule a calendar meeting",
    input_schema: {
      type: "object",
      properties: {
        title: { type: "string" },
        date: { type: "string" },
        time: { type: "string" },
        duration: { type: "number" },
        participants: {
          type: "array",
          items: { type: "string" }
        }
      },
      required: ["title", "date", "time"]
    }
  },
  {
    name: "set_reminder",
    description: "Set a reminder before an event",
    input_schema: {
      type: "object",
      properties: {
        message: { type: "string" },
        minutes_before: { type: "number" }
      },
      required: ["message", "minutes_before"]
    }
  },
  {
    name: "save_note",
    description: "Save a personal note",
    input_schema: {
      type: "object",
      properties: {
        content: { type: "string" }
      },
      required: ["content"]
    }
  }
];
