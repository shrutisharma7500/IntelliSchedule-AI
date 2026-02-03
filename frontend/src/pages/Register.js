import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock } from "lucide-react";
import axios from "axios";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post("/auth/register", { email, password });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user_email", res.data.user.email);
            navigate("/settings");
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed");
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
                    <div style={{ display: "inline-flex", background: "linear-gradient(135deg, #8b5cf6, #3b82f6)", padding: 12, borderRadius: 12, marginBottom: 15 }}>
                        <UserPlus color="white" size={28} />
                    </div>
                    <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 8 }}>Create Account</h1>
                    <p style={{ color: "var(--text-dim)", fontSize: "0.9rem" }}>Join IntelliSchedule AI today</p>
                </div>

                {error && (
                    <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", borderRadius: 8, padding: 12, marginBottom: 20, color: "#fca5a5" }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister}>
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: "block", marginBottom: 8, fontSize: "0.9rem", color: "var(--text-dim)" }}>
                            <Mail size={14} style={{ display: "inline", marginRight: 6 }} />
                            Email
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
                            <Lock size={14} style={{ display: "inline", marginRight: 6 }} />
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="chat-input"
                            placeholder="••••••••"
                            style={{ width: "100%" }}
                        />
                    </div>

                    <div style={{ marginBottom: 25 }}>
                        <label style={{ display: "block", marginBottom: 8, fontSize: "0.9rem", color: "var(--text-dim)" }}>
                            <Lock size={14} style={{ display: "inline", marginRight: 6 }} />
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="chat-input"
                            placeholder="••••••••"
                            style={{ width: "100%" }}
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
                        {loading ? "Creating account..." : "Sign Up"}
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.9rem", color: "var(--text-dim)" }}>
                    Already have an account? <Link to="/login" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>Sign in</Link>
                </p>
            </motion.div>
        </div>
    );
}

export default Register;
