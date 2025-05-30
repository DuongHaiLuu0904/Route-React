import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { API_URL } from "../config/config";

export default function Login() {
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const success = await login(username, password);
            if (success) {
                navigate("/about");
            }
        } catch (err) {
            setError("Đăng nhập thất bại. Vui lòng thử lại.");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Đăng nhập</h2>

                {error && (
                    <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
                )}

                <div>
                    <label>Tên đăng nhập:</label>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Tên đăng nhập"
                        required
                    />
                </div>

                <div>
                    <label>Mật khẩu:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mật khẩu"
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
            </form>
            <p>
                Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
            </p>
        </div>
    );
}
