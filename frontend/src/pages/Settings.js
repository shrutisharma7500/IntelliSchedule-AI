import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Save, LogOut, Key, Calendar, Mail } from "lucide-react";
import api from "../api";

function Settings() {
    const [calApiKey, setCalApiKey] = useState("");
    const [calEventTypeId, setCalEventTypeId] = useState("");
    const [calUsername, setCalUsername] = useState("");
    const [smtpUser, setSmtpUser] = useState("");
    const [smtpPass, setSmtpPass] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await api.get("/settings");
            setCalEventTypeId(res.data.calEventTypeId || "");
            setCalUsername(res.data.calUsername || "");
            setSmtpUser(res.data.smtpUser || "");
        } catch (err) {
            console.error("Failed to fetch settings");
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            await api.put("/settings", {
                calApiKey,
                calEventTypeId,
                calUsername,
                smtpUser,
                smtpPass
            });
            setMessage("Settings saved successfully!");
            setCalApiKey(""); // Clear sensitive fields after save
            setSmtpPass("");
        } catch (err) {
            setMessage("Failed to save settings");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_email");
        navigate("/login");
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
                        <SettingsIcon color="white" size={24} />
                    </div>
                    <h1 style={{ fontSize: "1.8rem", fontWeight: 700 }}>Account Settings</h1>
                </motion.div>
                <button onClick={handleLogout} style={{ marginTop: 15, background: "rgba(239, 68, 68, 0.2)", color: "#fca5a5", border: "none", padding: "8px 16px", borderRadius: 8, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <LogOut size={16} /> Logout
                </button>
            </header>

            <main className="glass-card" style={{ maxWidth: 600, margin: "0 auto", padding: 40 }}>
                {message && (
                    <div style={{ background: message.includes("success") ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", border: `1px solid ${message.includes("success") ? "#10b981" : "#ef4444"}`, borderRadius: 8, padding: 12, marginBottom: 20, color: message.includes("success") ? "#a7f3d0" : "#fca5a5" }}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSave}>
                    <h2 style={{ fontSize: "1.2rem", marginBottom: 15, display: "flex", alignItems: "center", gap: 8 }}>
                        <Calendar size={20} color="var(--primary)" /> Cal.com Integration
                    </h2>

                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: "block", marginBottom: 8, fontSize: "0.9rem", color: "var(--text-dim)" }}>
                            <Key size={14} style={{ display: "inline", marginRight: 6 }} />
                            Cal.com API Key
                        </label>
                        <input
                            type="password"
                            value={calApiKey}
                            onChange={(e) => setCalApiKey(e.target.value)}
                            className="chat-input"
                            placeholder="cal_live_..."
                            style={{ width: "100%" }}
                        />
                        <small style={{ color: "var(--text-dim)", fontSize: "0.75rem" }}>Get from cal.com/settings/developer</small>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: "block", marginBottom: 8, fontSize: "0.9rem", color: "var(--text-dim)" }}>
                            Event Type ID
                        </label>
                        <input
                            type="text"
                            value={calEventTypeId}
                            onChange={(e) => setCalEventTypeId(e.target.value)}
                            className="chat-input"
                            placeholder="1821554"
                            style={{ width: "100%" }}
                        />
                    </div>

                    <div style={{ marginBottom: 30 }}>
                        <label style={{ display: "block", marginBottom: 8, fontSize: "0.9rem", color: "var(--text-dim)" }}>
                            Cal.com Username
                        </label>
                        <input
                            type="text"
                            value={calUsername}
                            onChange={(e) => setCalUsername(e.target.value)}
                            className="chat-input"
                            placeholder="your-username"
                            style={{ width: "100%" }}
                        />
                    </div>

                    <h2 style={{ fontSize: "1.2rem", marginBottom: 15, display: "flex", alignItems: "center", gap: 8, marginTop: 30 }}>
                        <Mail size={20} color="var(--primary)" /> Email Settings (Gmail)
                    </h2>

                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: "block", marginBottom: 8, fontSize: "0.9rem", color: "var(--text-dim)" }}>
                            Gmail Address
                        </label>
                        <input
                            type="email"
                            value={smtpUser}
                            onChange={(e) => setSmtpUser(e.target.value)}
                            className="chat-input"
                            placeholder="you@gmail.com"
                            style={{ width: "100%" }}
                        />
                    </div>

                    <div style={{ marginBottom: 30 }}>
                        <label style={{ display: "block", marginBottom: 8, fontSize: "0.9rem", color: "var(--text-dim)" }}>
                            Gmail App Password
                        </label>
                        <input
                            type="password"
                            value={smtpPass}
                            onChange={(e) => setSmtpPass(e.target.value)}
                            className="chat-input"
                            placeholder="xxxx xxxx xxxx xxxx"
                            style={{ width: "100%" }}
                        />
                        <small style={{ color: "var(--text-dim)", fontSize: "0.75rem" }}>Get from myaccount.google.com/apppasswords</small>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
                        <Save size={18} />
                        {loading ? "Saving..." : "Save Settings"}
                    </button>
                </form>

                <div style={{ marginTop: 30, padding: 15, background: "rgba(59, 130, 246, 0.1)", borderRadius: 12, border: "1px solid rgba(59, 130, 246, 0.3)" }}>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-dim)", margin: 0 }}>
                        💡 <strong>Tip:</strong> After saving your credentials, go to the <a href="/" style={{ color: "var(--primary)" }}>Chat</a> to start scheduling meetings with your own Cal.com account!
                    </p>
                </div>
            </main>
        </div>
    );
}

export default Settings;
