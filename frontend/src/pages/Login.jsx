import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants/token_constants";
import "../styles/LoginForm.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const result = await api.post("/api/token", { username, password });
            localStorage.setItem(ACCESS_TOKEN, result.data.access);
            localStorage.setItem(REFRESH_TOKEN, result.data.refresh);
            navigate("/");
        } catch (error) {
            console.error("Login failed:", error);
            alert("Login failed. Please check your username and password.");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = () => {
        const backendUrl = import.meta.env.VITE_API_URL;
        window.location.href = `${backendUrl}/api/reset_password`;
    };

    return (
        <div className="login-page">
            <div className="login-form-container">
                <h1>Welcome back</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        className="login-form-input"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                    />
                    <input
                        className="login-form-input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                    <button className="login-form-button" type="submit" disabled={loading}>
                        {loading ? "Loading..." : "Sign in"}
                    </button>
                </form>
                <div className="forgot-password-link">
                    <button onClick={handlePasswordReset}>Forgot password?</button>
                </div>
            </div>
        </div>
    );
}

export default Login;