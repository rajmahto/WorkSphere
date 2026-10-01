import { useState } from "react";
import "../App.css";
import Notification from "../components/Notification";

function LoginPage({ onLogin }) {

    const [email, setEmail] = useState(
        localStorage.getItem("rememberedEmail") || ""
    );
    const [password, setPassword] = useState("");
    const [notification, setNotification] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(
        !!localStorage.getItem("rememberedEmail")
    );

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(
                "https://worksphere-f0vt.onrender.com/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setNotification({
                    type: "error",
                    message: data.message || "Login failed"
                });
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("email", data.email);

            if (rememberMe) {
                localStorage.setItem("rememberedEmail", email);
            } else {
                localStorage.removeItem("rememberedEmail");
            }

            onLogin({
                type: "success",
                message: "Welcome back to WorkSphere!"
            });

        } catch (error) {
            console.error("Login error:", error);

            setNotification({
                type: "error",
                message: "Unable to connect to server"
            });
        }
    };

    return (
        <div className="ws-login-page">

            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="ws-login-container">

                {/* LEFT SIDE */}
                <div className="ws-login-left">

                    <div className="ws-login-form-wrapper">

                        <div className="ws-login-brand">
                            <div className="ws-login-logo">WS</div>
                            <div>
                                <div className="ws-login-brand-name">
                                    WorkSphere
                                </div>
                                <div className="ws-login-brand-subtitle">
                                    Employee Management System
                                </div>
                            </div>
                        </div>

                        <div className="ws-login-heading">
                            <h1>Welcome Back</h1>

                            <p>
                                Sign in to access your WorkSphere workspace.
                            </p>
                        </div>

                        <form
                            className="ws-login-form"
                            onSubmit={handleLogin}
                        >

                            <div className="ws-login-field">
                                <label>Email</label>

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="ws-login-field">
                                <div className="ws-password-label">
                                    <label>Password</label>
                                </div>

                                <div className="ws-password-wrapper">

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="ws-password-toggle"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>

                                </div>
                            </div>

                            <div className="ws-login-options">

                                <label className="ws-remember">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(event) => setRememberMe(event.target.checked)}
                                    />
                                    <span>Remember me</span>
                                </label>

                                <button
                                    type="button"
                                    className="ws-forgot"
                                    onClick={() =>
                                        setNotification({
                                            type: "info",
                                            message:
                                                "Password reset will be available soon."
                                        })
                                    }
                                >
                                    Forgot password?
                                </button>

                            </div>

                            <button
                                type="submit"
                                className="ws-login-button"
                            >
                                Sign In
                            </button>

                        </form>

                        <div className="ws-login-footer">
                            <span>Secure employee workspace</span>
                            <span>•</span>
                            <span>WorkSphere</span>
                        </div>

                    </div>

                </div>


                {/* RIGHT SIDE */}
                <div className="ws-login-right">

                    <div className="ws-login-right-content">

                        <div className="ws-login-right-badge">
                            WORKSPHERE
                        </div>

                        <h2>
                            Everything your team needs,
                            <span> in one place.</span>
                        </h2>

                        <p>
                            Manage employees, attendance, leaves and payroll
                            through a simple and secure employee workspace.
                        </p>

                        {/* DASHBOARD PREVIEW */}
                        <div className="ws-dashboard-preview">

                            <div className="ws-preview-top">

                                <div>
                                    <div className="ws-preview-small">
                                        WORKSPHERE
                                    </div>

                                    <div className="ws-preview-title">
                                        Dashboard
                                    </div>
                                </div>

                                <div className="ws-preview-avatar">
                                    A
                                </div>

                            </div>


                            <div className="ws-preview-cards">

                                <div className="ws-preview-card">
                                    <div className="ws-preview-icon">
                                        👥
                                    </div>

                                    <div>
                                        <span>Total Employees</span>
                                        <strong>24</strong>
                                    </div>
                                </div>

                                <div className="ws-preview-card">
                                    <div className="ws-preview-icon">
                                        ✓
                                    </div>

                                    <div>
                                        <span>Present Today</span>
                                        <strong>21</strong>
                                    </div>
                                </div>

                                <div className="ws-preview-card">
                                    <div className="ws-preview-icon">
                                        ₹
                                    </div>

                                    <div>
                                        <span>Payroll</span>
                                        <strong>Active</strong>
                                    </div>
                                </div>

                            </div>


                            <div className="ws-preview-chart">

                                <div className="ws-preview-chart-header">
                                    <span>Attendance Overview</span>
                                    <span>This Week</span>
                                </div>

                                <div className="ws-chart-bars">
                                    <div style={{ height: "45%" }}></div>
                                    <div style={{ height: "65%" }}></div>
                                    <div style={{ height: "55%" }}></div>
                                    <div style={{ height: "78%" }}></div>
                                    <div style={{ height: "68%" }}></div>
                                    <div style={{ height: "88%" }}></div>
                                    <div style={{ height: "74%" }}></div>
                                </div>

                                <div className="ws-chart-days">
                                    <span>Mon</span>
                                    <span>Tue</span>
                                    <span>Wed</span>
                                    <span>Thu</span>
                                    <span>Fri</span>
                                    <span>Sat</span>
                                    <span>Sun</span>
                                </div>

                            </div>


                            <div className="ws-preview-bottom">

                                <div className="ws-preview-list">

                                    <div className="ws-preview-list-title">
                                        Recent Activity
                                    </div>

                                    <div className="ws-preview-list-item">
                                        <span className="ws-dot"></span>
                                        Employee attendance updated
                                    </div>

                                    <div className="ws-preview-list-item">
                                        <span className="ws-dot"></span>
                                        Leave request approved
                                    </div>

                                    <div className="ws-preview-list-item">
                                        <span className="ws-dot"></span>
                                        Payroll processed
                                    </div>

                                </div>

                                <div className="ws-preview-mini-stat">
                                    <span>Leave Balance</span>
                                    <strong>11 Days</strong>
                                </div>

                            </div>

                        </div>

                        <div className="ws-login-features">

                            <div>
                                <strong>✓</strong>
                                Secure
                            </div>

                            <div>
                                <strong>✓</strong>
                                Role Based
                            </div>

                            <div>
                                <strong>✓</strong>
                                Easy to Use
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default LoginPage;