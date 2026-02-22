import mongoose from "mongoose";
import User from "./models/User.js";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/intellischedule";

async function checkSmtp() {
    try {
        await mongoose.connect(MONGO_URI);
        const user = await User.findOne({ email: "shrutisharma7263@gmail.com" });
        if (user) {
            console.log(JSON.stringify({
                email: user.email,
                hasSmtp: !!user.smtpPass,
                smtpPreview: user.smtpPass ? user.smtpPass.substring(0, 3) + "..." : "none"
            }));
        } else {
            console.log("User not found");
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSmtp();
