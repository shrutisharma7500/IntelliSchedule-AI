import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// Get user settings
router.get("/", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({
            email: user.email,
            calApiKey: user.calApiKey ? "***" + user.calApiKey.slice(-4) : "",
            calEventTypeId: user.calEventTypeId,
            calUsername: user.calUsername,
            smtpUser: user.smtpUser,
            hasCalConfig: !!(user.calApiKey && user.calEventTypeId),
            hasSmtpConfig: !!(user.smtpUser && user.smtpPass)
        });
    } catch (err) {
        console.error("Get settings error:", err);
        res.status(500).json({ error: "Failed to fetch settings" });
    }
});

// Update user settings
router.put("/", authenticateToken, async (req, res) => {
    try {
        const { calApiKey, calEventTypeId, calUsername, smtpUser, smtpPass } = req.body;

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (calApiKey) user.calApiKey = calApiKey;
        if (calEventTypeId) user.calEventTypeId = calEventTypeId;
        if (calUsername) user.calUsername = calUsername;
        if (smtpUser) user.smtpUser = smtpUser;
        if (smtpPass) user.smtpPass = smtpPass;

        await user.save();

        res.json({
            message: "Settings updated successfully",
            hasCalConfig: !!(user.calApiKey && user.calEventTypeId),
            hasSmtpConfig: !!(user.smtpUser && user.smtpPass)
        });
    } catch (err) {
        console.error("Update settings error:", err);
        res.status(500).json({ error: "Failed to update settings" });
    }
});

export default router;
