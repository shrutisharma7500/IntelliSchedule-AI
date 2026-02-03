import express from "express";
import { runAgent } from "../agent/aiAgent.js";
import { authenticateToken } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Get user's credentials from database
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Pass user credentials to the agent
    const userConfig = {
      email: user.email,
      calApiKey: user.calApiKey,
      calEventTypeId: user.calEventTypeId,
      calUsername: user.calUsername,
      smtpUser: user.smtpUser,
      smtpPass: user.smtpPass
    };

    const response = await runAgent(message, userConfig);
    res.json(response);
  } catch (err) {
    console.error("🔥 BACKEND ERROR:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
});

export default router;
