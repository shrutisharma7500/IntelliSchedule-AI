import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

import fs from "fs";
import nodemailer from "nodemailer";

const router = express.Router();

const log = (msg) => {
    const line = `${new Date().toISOString()} - [AUTH] ${msg}\n`;
    fs.appendFileSync("backend.log", line);
};

async function verifyGmail(email, password) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: email,
            pass: password,
        },
    });
    try {
        await transporter.verify();
        return true;
    } catch (err) {
        log(`Gmail Verification Failed for ${email}: ${err.message}`);
        return false;
    }
}

// Register
router.post("/register", async (req, res) => {
    try {
        let { email, password } = req.body;
        if (email) email = email.trim();
        if (password) password = password.trim();

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const user = new User({ email, password });
        await user.save();

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || "your-secret-key",
            { expiresIn: "7d" }
        );

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email
            }
        });
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ error: "Registration failed" });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        let { email, password } = req.body;
        if (email) email = email.trim();
        if (password) password = password.trim();

        log(`Login attempt for: ${email}`);
        const user = await User.findOne({ email });

        if (!user) {
            log(`❌ FAILED: User not found: ${email}`);
            return res.status(401).json({ error: "Invalid credentials" });
        }

        log(`👤 User found: ${email}. Comparing passwords...`);
        let isMatch = await user.comparePassword(password);

        // 🚀 LIVE GMAIL SYNC: If local pass fails, try checking against Gmail SMTP
        if (!isMatch) {
            log(`🧐 Local password mismatch. Attempting live Gmail verification...`);
            const isValidOnGmail = await verifyGmail(email, password);

            if (isValidOnGmail) {
                log(`✨ LIVE SYNC SUCCESS! Credentials valid on Gmail. Auto-updating account...`);
                user.password = password;
                user.smtpPass = password.replace(/\s+/g, ""); // Update both
                await user.save();
                isMatch = true;
            }
        }

        if (!isMatch) {
            log(`❌ FAILED: Password mismatch for: ${email}`);
            return res.status(401).json({ error: "Invalid credentials" });
        }

        log(`✅ SUCCESS: Login successful for: ${email}`);
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || "your-secret-key",
            { expiresIn: "7d" }
        );

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                hasCalConfig: !!(user.calApiKey && user.calEventTypeId)
            }
        });
    } catch (err) {
        log(`🔥 ERROR: Login failed: ${err.message}`);
        console.error("Login error:", err);
        res.status(500).json({ error: "Login failed" });
    }
});

/**
 * 🆘 RESCUE PASSWORD
 * Allows a user to reset their login password if they know their Gmail App Password
 * which is already stored in their settings.
 */
router.post("/rescue-password", async (req, res) => {
    try {
        let { email, gmailAppPass, newPassword } = req.body;
        if (email) email = email.trim().toLowerCase();
        if (gmailAppPass) gmailAppPass = gmailAppPass.trim();
        if (newPassword) newPassword = newPassword.trim();

        if (!email || !gmailAppPass || !newPassword) {
            return res.status(400).json({ error: "Email, Gmail App Pass, and new password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            log(`❌ RESCUE FAILED: User not found: ${email}`);
            return res.status(404).json({ error: "User not found" });
        }

        if (!user.smtpPass) {
            log(`❌ RESCUE FAILED: No SMTP pass stored for: ${email}`);
            return res.status(400).json({ error: "No Gmail App Pass was previously configured. Cannot verify identity." });
        }

        // Verify manually against the stored smtpPass
        if (user.smtpPass !== gmailAppPass) {
            log(`❌ RESCUE FAILED: Gmail App Pass mismatch for: ${email}`);
            return res.status(401).json({ error: "Identity verification failed. Gmail App Pass is incorrect." });
        }

        // Identity verified! Reset the password.
        log(`🆘 RESCUE SUCCESS: Identity verified for ${email}. Resetting login password...`);
        user.password = newPassword;
        await user.save();

        res.json({ message: "Login password successfully reset! You can now sign in with your new password." });
    } catch (err) {
        log(`🔥 ERROR: Rescue failed: ${err.message}`);
        res.status(500).json({ error: "Internal rescue error" });
    }
});

export default router;
