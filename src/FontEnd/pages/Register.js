import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { API_URL } from "../config/config";

export default function Register() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!username || !password || !confirmPassword) {
            setError("Vui lòng điền đầy đủ thông tin");
            return;
        }
        if (password !== confirmPassword) {
            setError("Mật khẩu không khớp");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (data.success) {
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    await login(username, password);
                    navigate("/about");
                } else {
                    alert("Đăng ký thành công. Vui lòng đăng nhập.");
                    navigate("/login");
                }
            } else {
                setError(data.message || "Đăng ký thất bại");
            }
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            setError("Lỗi kết nối đến server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Đăng ký tài khoản</h2>
                {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

                <div>
                    <label>Tên đăng nhập:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Mật khẩu:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Xác nhận mật khẩu:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                
                <button type="submit" disabled={loading}>
                    {loading ? "Đang xử lý..." : "Đăng ký"}
                </button>
                <p>
                    Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                </p>
            </form>
        </div>
    );
}
