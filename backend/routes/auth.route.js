import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

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

        const user = await User.findOne({ email });
        console.log("Login attempt for email:", email);
        if (!user) {
            console.log("❌ LOGIN FAILED: User not found in database");
            return res.status(401).json({ error: "Invalid credentials" });
        }

        console.log("👤 User found, proceeding to compare password...");
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            console.log("❌ LOGIN FAILED: Password mismatch");
            return res.status(401).json({ error: "Invalid credentials" });
        }

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
        console.error("Login error:", err);
        res.status(500).json({ error: "Login failed" });
    }
});

export default router;
