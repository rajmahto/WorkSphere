import { useState } from "react";
import "../App.css";
import Notification from "../components/Notification";

function LoginPage({ onLogin }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [notification, setNotification] = useState(null);

    const handleLogin = async (event) => {
        event.preventDefault();

        try {

            const response = await fetch(
                "http://localhost:8080/users/login",
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

            console.log("Login successful:", data);

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("email", data.email);

            /*
             * Login successful.
             * Notification App component ko bhej rahe hain
             * because LoginPage login ke baad unmount ho jayega.
             */

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
        <div className="login-page">

            {/* Login error notification */}
            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="login-card">

                <div className="logo">
                    WorkSphere
                </div>

                <h1>
                    Welcome Back
                </h1>

                <p className="subtitle">
                    Sign in to your employee workspace
                </p>

                <form onSubmit={handleLogin}>

                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        required
                    />

                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                    />

                    <button type="submit">
                        Sign In
                    </button>

                </form>

            </div>

        </div>
    );
}

export default LoginPage;