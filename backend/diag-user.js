import mongoose from "mongoose";
import User from "./models/User.js";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/intellischedule";

async function diagnoseUser() {
    try {
        await mongoose.connect(MONGO_URI);
        const user = await User.findOne({ email: "shrutisharma7263@gmail.com" });
        if (user) {
            console.log("User Diagnostic for shrutisharma7263@gmail.com:");
            console.log("- Password Hash prefix:", user.password.substring(0, 10));
            console.log("- SMTP Pass length:", user.smtpPass ? user.smtpPass.length : "None");
            console.log("- SMTP Pass starts with:", user.smtpPass ? user.smtpPass.substring(0, 4) : "N/A");
            console.log("- SMTP Pass ends with:", user.smtpPass ? user.smtpPass.slice(-4) : "N/A");
        } else {
            console.log("User not found");
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

diagnoseUser();
