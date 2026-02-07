import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import chatRoute from "./routes/chat.route.js";
import authRoute from "./routes/auth.route.js";
import settingsRoute from "./routes/settings.route.js";

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.get("/", (req, res) => {
  res.send("🚀 IntelliSchedule AI Backend is running!");
});
app.use("/chat", chatRoute);
app.use("/auth", authRoute);
app.use("/settings", settingsRoute);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/intellischedule";

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error detail:");
    console.dir(err);
  });

app.listen(PORT, () => {
  console.log(`🚀 MCP Server running on http://localhost:${PORT}`);
});
