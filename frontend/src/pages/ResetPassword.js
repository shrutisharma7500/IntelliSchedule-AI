import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LifeBuoy, Mail, Lock, ShieldCheck } from "lucide-react";
import api from "../api";

function ResetPassword() {
    const [email, setEmail] = useState("");
    const [gmailAppPass, setGmailAppPass] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const res = await api.post("/auth/rescue-password", {
                email,
                gmailAppPass,
                newPassword
            });
            setMessage(res.data.message);
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setError(err.response?.data?.error || "Reset failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App" style={{ justifyContent: "center", alignItems: "center" }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card"
                style={{ maxWidth: 450, width: "100%", padding: 40 }}
            >
                <div style={{ textAlign: "center", marginBottom: 30 }}>
                    <div style={{ display: "inline-flex", background: "linear-gradient(135deg, #10b981, #3b82f6)", padding: 12, borderRadius: 12, marginBottom: 15 }}>
                        <LifeBuoy color="white" size={28} />
                    </div>
                    <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 8 }}>Password Rescue</h1>
                    <p style={{ color: "var(--text-dim)", fontSize: "0.9rem" }}>Reset login password using your Gmail App Pass</p>
                </div>

                {error && (
                    <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", borderRadius: 8, padding: 12, marginBottom: 20, color: "#fca5a5" }}>
                        {error}
                    </div>
                )}

                {message && (
                    <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid #10b981", borderRadius: 8, padding: 12, marginBottom: 20, color: "#a7f3d0" }}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleReset}>
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: "block", marginBottom: 8, fontSize: "0.9rem", color: "var(--text-dim)" }}>
                            <Mail size={14} style={{ display: "inline", marginRight: 6 }} />
                            Account Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="chat-input"
                            placeholder="you@example.com"
                            style={{ width: "100%" }}
                        />
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: "block", marginBottom: 8, fontSize: "0.9rem", color: "var(--text-dim)" }}>
                            <ShieldCheck size={14} style={{ display: "inline", marginRight: 6 }} />
                            Gmail App Password (stored in settings)
                        </label>
                        <input
                            type="password"
                            value={gmailAppPass}
                            onChange={(e) => setGmailAppPass(e.target.value)}
                            required
                            className="chat-input"
                            placeholder="xxxx xxxx xxxx xxxx"
                            style={{ width: "100%" }}
                        />
                        <p style={{ fontSize: "0.7rem", color: "var(--text-dim)", marginTop: 4 }}>This verifies your identity since you set it up previously.</p>
                    </div>

                    <div style={{ marginBottom: 25 }}>
                        <label style={{ display: "block", marginBottom: 8, fontSize: "0.9rem", color: "var(--text-dim)" }}>
                            <Lock size={14} style={{ display: "inline", marginRight: 6 }} />
                            New Login Password
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="chat-input"
                            placeholder="New secure password"
                            style={{ width: "100%" }}
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
                        {loading ? "Verifying..." : "Reset Login Password"}
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.9rem", color: "var(--text-dim)" }}>
                    Remembered it? <Link to="/login" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>Back to Login</Link>
                </p>
            </motion.div>
        </div>
    );
}

export default ResetPassword;
