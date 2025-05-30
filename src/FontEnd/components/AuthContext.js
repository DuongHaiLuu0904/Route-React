import { createContext, useState, useContext, useEffect } from "react";
import { API_URL } from "../config/config";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false); const [error, setError] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
            setIsAuthenticated(true);

            const timer = setTimeout(() => {
                fetchUserProfile();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, []);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            if (!token) {
                console.log("No token available, skipping profile fetch");
                return;
            }

            const response = await fetch(`${API_URL}/api/user/profile`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.success) {
                setUser(data.user);
            } else {
                console.log("Profile fetch failed:", data.message);
                logout();
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (data.success && data.token) {
                try {
                    localStorage.setItem("token", data.token);

                    setToken(data.token);
                    setIsAuthenticated(true);

                    setTimeout(() => {
                        fetchUserProfile();
                    }, 500);
                    return true;
                } catch (storageError) {
                    alert("Lỗi lưu phiên đăng nhập");
                    return false;
                }
            } else {
                setError(data.message || "Đăng nhập thất bại");
                alert(data.message || "Đăng nhập thất bại");
                return false;
            }
        } catch (error) {
            setError("Lỗi kết nối đến server");
            alert("Lỗi kết nối đến server");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null); setIsAuthenticated(false);
    };

    const getAuthHeader = () => {
        if (!token) {
            console.warn("No token available for request");
            return {};
        }
        const authHeader = { "Authorization": `Bearer ${token}` };
        return authHeader;
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            login,
            logout,
            token,
            user,
            loading,
            error,
            getAuthHeader
        }}>
            {children}
        </AuthContext.Provider>
    );
};
