import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Header() {
    const { isAuthenticated, logout, user } = useAuth();
    return (
        <nav>
            <Link to="/">Home</Link> |{" "}
            <Link to="/about">About</Link> |{" "}
            {isAuthenticated ? (
                <>
                    <Link to="/posts">Posts</Link> |{" "}
                    <Link to="/newpost">New Post</Link> |{" "}
                    <Link to="/feedback">FeedBack</Link> |{" "}
                    {user && <span>Xin chào, {user.username}! </span>}
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <Link to="/login">Login</Link>
            )}
        </nav>
    );
}
