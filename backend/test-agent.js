import { runAgent } from "./agent/aiAgent.js";
import dotenv from "dotenv";
dotenv.config();

const testUserConfig = {
    email: "test@example.com",
    calApiKey: process.env.CAL_API_KEY,
    calEventTypeId: process.env.CAL_EVENT_TYPE_ID,
    calUsername: process.env.CAL_USERNAME
};

async function test() {
    console.log("🚀 Testing runAgent...");
    try {
        const response = await runAgent("Schedule a meeting tomorrow at 10am", testUserConfig);
        console.log("✅ Response:", JSON.stringify(response, null, 2));
    } catch (err) {
        console.error("❌ Error:", err);
    }
}

test();
