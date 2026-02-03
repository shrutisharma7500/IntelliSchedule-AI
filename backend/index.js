import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import chatRoute from "./routes/chat.route.js";
import authRoute from "./routes/auth.route.js";
import settingsRoute from "./routes/settings.route.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/chat", chatRoute);
app.use("/auth", authRoute);
app.use("/settings", settingsRoute);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/intellischedule";

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`🚀 MCP Server running on http://localhost:${PORT}`);
});
