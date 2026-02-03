import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock } from "lucide-react";
import axios from "axios";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await axios.post("/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user_email", res.data.user.email);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.error || "Login failed");
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
                        <LogIn color="white" size={28} />
                    </div>
                    <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 8 }}>Welcome Back</h1>
                    <p style={{ color: "var(--text-dim)", fontSize: "0.9rem" }}>Sign in to your IntelliSchedule account</p>
                </div>

                {error && (
                    <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", borderRadius: 8, padding: 12, marginBottom: 20, color: "#fca5a5" }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
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

                    <div style={{ marginBottom: 25 }}>
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

                    <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.9rem", color: "var(--text-dim)" }}>
                    Don't have an account? <Link to="/register" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>Sign up</Link>
                </p>
            </motion.div>
        </div>
    );
}

export default Login;
