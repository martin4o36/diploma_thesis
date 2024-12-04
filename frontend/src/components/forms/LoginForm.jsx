import { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";

function LoginForm() {
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
    }

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>Login</h1>
            <input 
            className="form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            />

            <input 
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            />

            <button className="form-button" type="submit" disabled={loading}>
                {loading ? "Loading..." : "Login"}
            </button>
        </form>
    );
}

export default LoginForm