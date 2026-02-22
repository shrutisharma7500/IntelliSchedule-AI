import mongoose from "mongoose";
import User from "./models/User.js";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/intellischedule";

async function listUsers() {
    try {
        await mongoose.connect(MONGO_URI);
        const users = await User.find({}, { email: 1 });
        console.log("👥 Registered Users:");
        users.forEach(u => console.log(`- ${u.email}`));
        process.exit(0);
    } catch (err) {
        console.error("❌ Error listing users:", err);
        process.exit(1);
    }
}

listUsers();
