import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Send, Calendar, Sparkles, AlertCircle, CheckCircle2, Clock, Settings as SettingsIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";

function Chat() {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([
        { role: "ai", content: "Hello! I'm your Intelligent Scheduler. How can I help you today?", executions: [] }
    ]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chat]);

    const handleSend = async () => {
        if (!message.trim() || loading) return;

        const userMsg = { role: "user", content: message };
        setChat((prev) => [...prev, userMsg]);
        setMessage("");
        setLoading(true);

        try {
            const res = await api.post("/chat", { message });
            const data = res.data;

            setChat((prev) => [
                ...prev,
                {
                    role: "ai",
                    content: data.reply || "Done! I've processed your request.",
                    executions: data.executions || []
                }
            ]);
        } catch (err) {
            console.error("Chat Error:", err);
            const detail = err.response?.data?.error || err.response?.data?.message || err.message;
            const errorMsg = err.response?.status === 401
                ? "Session expired. Please login again."
                : `❌ Error: ${detail}. (Status: ${err.response?.status || 'Network Error'})`;

            setChat((prev) => [
                ...prev,
                { role: "ai", content: errorMsg, type: "error" }
            ]);

            if (err.response?.status === 401) {
                setTimeout(() => window.location.href = "/login", 2000);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">
            <header style={{ textAlign: "center", marginBottom: 20 }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}
                >
                    <div style={{ background: "linear-gradient(135deg, #8b5cf6, #3b82f6)", padding: 10, borderRadius: 12 }}>
                        <Sparkles color="white" size={24} />
                    </div>
                    <h1 style={{ fontSize: "1.8rem", fontWeight: 700 }}>IntelliSchedule <span style={{ color: "var(--primary)" }}>AI</span></h1>
                </motion.div>
                <p style={{ color: "var(--text-dim)", fontSize: "0.9rem", marginTop: 8 }}>Powered by FastMCP & Cal.com</p>

                <Link to="/settings" style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-dim)", textDecoration: "none", fontSize: "0.85rem" }}>
                    <SettingsIcon size={14} /> Settings
                </Link>
            </header>

            <main className="chat-container glass-card">
                <div className="messages-list custom-scrollbar" ref={scrollRef}>
                    <AnimatePresence>
                        {chat.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`message-bubble ${msg.role === "user" ? "user-message" : "ai-message"}`}
                            >
                                <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>

                                {msg.executions && msg.executions.length > 0 && (
                                    <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                                        {msg.executions.map((exe, j) => (
                                            <div key={j} className={`execution-card ${exe.status === "error" ? "error" : ""}`}>
                                                <div className={`status-badge ${exe.status === "error" ? "badge-error" : "badge-success"}`}>
                                                    {exe.tool.replace("_", " ")}
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                    {exe.status === "error" ? <AlertCircle size={14} color="#ef4444" /> : <CheckCircle2 size={14} color="#10b981" />}
                                                    <span style={{ color: exe.status === "error" ? "#fca5a5" : "#a7f3d0" }}>
                                                        {exe.data.message || exe.data.reminder || "Executed successfully"}
                                                    </span>
                                                </div>
                                                {exe.data.meetingLink && (
                                                    <a
                                                        href={`https://cal.com/booking/${exe.data.meetingLink}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8, color: "var(--acc-blue)", textDecoration: "none", fontSize: "0.8rem", fontWeight: 600 }}
                                                    >
                                                        <Calendar size={14} /> View Booking Record
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {loading && (
                        <div className="message-bubble ai-message pulse">
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <Clock size={16} /> Thinking...
                            </div>
                        </div>
                    )}
                </div>

                <div className="input-area" style={{ borderTop: "1px solid var(--border)" }}>
                    <input
                        type="text"
                        className="chat-input"
                        placeholder="Type your request (e.g. Schedule a sync tomorrow at 4pm)"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    />
                    <button className="btn-primary" onClick={handleSend} disabled={loading}>
                        <Send size={18} />
                    </button>
                </div>
            </main>

            <footer style={{ marginTop: 20, textAlign: "center", fontSize: "0.8rem", color: "var(--text-dim)" }}>
                Real-time tool chaining with deterministic execution.
            </footer>
        </div>
    );
}

export default Chat;
