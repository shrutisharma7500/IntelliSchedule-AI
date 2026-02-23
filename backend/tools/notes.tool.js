import fs from "fs";

export async function saveNote({ content }) {
  try {
    fs.appendFileSync("notes.txt", content + "\n");
    return { status: "note saved" };
  } catch (err) {
    console.log(`[NOTE] ${content}`);
    return { status: "note saved (logged to console)", message: "Local file system is read-only. Note was logged to server console." };
  }
}
