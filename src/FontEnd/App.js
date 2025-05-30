import "./styles.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Posts from "./pages/Post"
import PostDetail from "./pages/PostDetail";
import NewPost from "./pages/NewPost";
import FeedBack from "./pages/feedback";

import { AuthProvider, useAuth } from "./components/AuthContext";
import Header from "./components/Header";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/posts" element={
                        <ProtectedRoute>
                            <Posts />
                        </ProtectedRoute>
                    } />
                    <Route path="/posts/:slug" element={
                        <ProtectedRoute>
                            <PostDetail />
                        </ProtectedRoute>
                    } />
                    <Route path="/newpost" element={
                        <ProtectedRoute>
                            <NewPost />
                        </ProtectedRoute>
                    } />
                    <Route path="/feedback" element={
                        <ProtectedRoute>
                            <FeedBack />
                        </ProtectedRoute>
                    } />
                    <Route path="*" element={<h2>404 - Page Not Found</h2>} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
