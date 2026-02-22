import mongoose from "mongoose";
import User from "./models/User.js";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/intellischedule";

async function resetPassword(email, newPassword) {
    try {
        await mongoose.connect(MONGO_URI);
        const user = await User.findOne({ email });
        if (!user) {
            console.error(`❌ User not found: ${email}`);
            process.exit(1);
        }

        user.password = newPassword;
        await user.save();
        console.log(`✅ Password reset successfully for ${email}`);
        process.exit(0);
    } catch (err) {
        console.error("❌ Error resetting password:", err);
        process.exit(1);
    }
}

const email = process.argv[2];
const pass = process.argv[3];

if (!email || !pass) {
    console.log("Usage: node reset-pass.js <email> <newPassword>");
    process.exit(1);
}

resetPassword(email, pass);
